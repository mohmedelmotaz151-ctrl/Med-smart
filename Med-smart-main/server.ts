import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.disable("x-powered-by");
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.cloudinary.com wss://*.firebaseio.com; font-src 'self' data: https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
    if (process.env.NODE_ENV === "production") res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    next();
  });

  app.use(express.json({ limit: "8mb" }));
  app.use(express.urlencoded({ limit: "2mb", extended: true }));

  const rateBuckets = new Map<string, { count: number; resetAt: number }>();
  const rateLimit = (limit: number, windowMs: number) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const bucket = rateBuckets.get(key);
    if (!bucket || bucket.resetAt < now) {
      rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (bucket.count >= limit) return res.status(429).json({ error: "Too many requests. Please try again later." });
    bucket.count += 1;
    next();
  };

  const decodeBase64Url = (value: string) => Buffer.from(value.replace(/-/g, "+").replace(/_/g, "/"), "base64");
  const verifyFirebaseAdmin = async (token: string) => {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Invalid token");
    const header = JSON.parse(decodeBase64Url(parts[0]).toString("utf8"));
    const payload = JSON.parse(decodeBase64Url(parts[1]).toString("utf8"));
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
    if (!projectId || header.alg !== "RS256" || !header.kid) throw new Error("Invalid token configuration");
    const certResponse = await fetch("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com");
    if (!certResponse.ok) throw new Error("Unable to verify session");
    const certs = await certResponse.json() as Record<string, string>;
    const certPem = certs[header.kid];
    if (!certPem) throw new Error("Unknown signing key");
    const verifier = crypto.createVerify("RSA-SHA256");
    verifier.update(`${parts[0]}.${parts[1]}`);
    verifier.end();
    if (!verifier.verify(certPem, decodeBase64Url(parts[2]))) throw new Error("Invalid token signature");
    const now = Math.floor(Date.now() / 1000);
    if (payload.aud !== projectId || payload.iss !== `https://securetoken.google.com/${projectId}` || payload.exp <= now || payload.iat > now + 60 || !payload.sub) throw new Error("Invalid token claims");

    const userUrl = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/users/${encodeURIComponent(payload.sub)}`;
    const profileResponse = await fetch(userUrl, { headers: { Authorization: `Bearer ${token}` } });
    if (!profileResponse.ok) throw new Error("Unable to read user permission");
    const profile = await profileResponse.json() as any;
    if (profile?.fields?.role?.stringValue !== "admin") throw new Error("Administrator permission required");
    return payload;
  };

  const requireAdminOrPublicInquiryUpload = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.body?.category === "general") return next();
    try {
      const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : "";
      if (!token) return res.status(401).json({ error: "Authentication required." });
      await verifyFirebaseAdmin(token);
      next();
    } catch {
      return res.status(401).json({ error: "Invalid, expired, or unauthorized session." });
    }
  };

  // Ensure uploads directory exists and is static
  const fs = await import("fs");
  const uploadRoot = path.join(process.cwd(), "uploads");
  const categories = ["projects", "services", "fire-systems", "general"];
  for (const cat of categories) {
    const p = path.join(uploadRoot, cat);
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p, { recursive: true });
    }
  }

  // Serve the uploads directory statically
  app.use("/uploads", express.static(uploadRoot));

  // Serve the public directory statically
  app.use(express.static(path.join(process.cwd(), "public")));

  // Dynamic uploads endpoint
  app.post("/api/upload", rateLimit(8, 60_000), requireAdminOrPublicInquiryUpload, async (req, res) => {
    try {
      const { filename, content, category } = req.body;
      if (!filename || !content) {
        return res.status(400).json({ error: "Missing filename or content payload." });
      }
      if (typeof filename !== "string" || filename.length > 180 || typeof content !== "string") {
        return res.status(400).json({ error: "Invalid upload payload." });
      }
      const mimeMatch = content.match(/^data:([^;]+);base64,/);
      const allowedMimes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
      if (mimeMatch && !allowedMimes.has(mimeMatch[1])) return res.status(415).json({ error: "Unsupported file type." });
      const estimatedBytes = Math.ceil((content.length * 3) / 4);
      if (estimatedBytes > 6 * 1024 * 1024) return res.status(413).json({ error: "File exceeds the 6 MB upload limit." });

      // Check if Cloudinary is configured
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      // Normalize directory/folder naming
      let folderKey = "projects";
      if (category === "services") {
        folderKey = "services";
      } else if (category === "fire-systems" || category === "fire" || category === "cooling" || category === "power" || category === "cctv") {
        folderKey = "fire-systems";
      } else if (category === "general") {
        folderKey = "general";
      }

      if (cloudName && apiKey && apiSecret) {
        try {
          const { v2: cloudinary } = await import("cloudinary");
          cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
          });

          // Upload safely to Cloudinary
          const uploadResult = await cloudinary.uploader.upload(content, {
            folder: `gcc_media/${folderKey}`,
            resource_type: "auto",
          });

          return res.json({
            success: true,
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id
          });
        } catch (cloudinaryErr: any) {
          console.error("Cloudinary upload failed, falling back to local file system:", cloudinaryErr);
        }
      }

      // decode base64 buffer as fallback
      const matches = content.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer: Buffer;
      if (matches && matches.length === 3) {
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(content, 'base64');
      }

      const destFolder = path.join(uploadRoot, folderKey);
      if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder, { recursive: true });
      }

      if (process.env.NODE_ENV === "production") {
        return res.status(503).json({ error: "Cloud media storage is not configured." });
      }
      const ext = path.extname(filename).toLowerCase().replace(/[^.a-z0-9]/g, "") || ".bin";
      const safeFilename = `${Date.now()}-${crypto.randomBytes(12).toString("hex")}${ext}`;
      const finalPath = path.join(destFolder, safeFilename);
      fs.writeFileSync(finalPath, buffer, { flag: "wx" });
      res.json({ success: true, url: `/uploads/${folderKey}/${safeFilename}` });
    } catch (err: any) {
      console.error("API Upload error:", err);
      res.status(500).json({ error: err.message || "Failed saving uploaded asset." });
    }
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/consult", rateLimit(12, 60_000), async (req, res) => {
    try {
      const { message, history } = req.body;
      if (typeof message !== "string" || message.trim().length < 2 || message.length > 6000) {
        return res.status(400).json({ error: "Invalid consultation message." });
      }
      if (history && (!Array.isArray(history) || history.length > 20)) {
        return res.status(400).json({ error: "Invalid consultation history." });
      }
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const { GoogleGenAI } = await import("@google/genai");
      const client = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Prepare system instruction
      const systemInstruction = `You are "GCC COMPANY AI Engineer & Sizer", a professional electro-mechanical and HVAC consulting engineer at GCC COMPANY. 
      The company specializes in:
      1. Fire Fighting Systems (dry pipe, wet pipe, sprinklers, clean gas FM200, CO2 suppression) conforming to NFPA codes.
      2. Intelligent Fire Alarm & Detection Systems conforming to NFPA 72 codes.
      3. Cooling & HVAC Systems (central chillers, package, ducted, VRF systems) conforming to ASHRAE standards.
      4. Diesel Generators and Emergency Power Backup conforming to engineering ratings (sizing in kVA, standby load calculations).
      5. CCTV & Security Camera Surveillance Systems (enterprise IP camera networks, biometrics access control, NDAA-compliant security hardware, centralized monitoring facility design).

      Your role is to:
      - Help users select, specify, or size systems for their buildings, server rooms, hotels, or residential compounds.
      - Calculate cooling load estimates if they provide dimensions (e.g. standard guideline is roughly 1 Ton of cooling per 15-18 square meters of standard space, or 12,000 BTU per Ton).
      - Advise on generator sizing in kVA based on a list of appliances and backup requirements.
      - Advise on fire suppression systems (e.g., recommend FM200/CO2 for server rooms or libraries instead of water sprinklers to protect sensitive electronics).
      - Be energetic, precise, highly professional, and encouraging, giving clear structural specifications.
      - Support the language of the prompt context (Arabic or English). If they talk in Arabic, reply in professional Arabic.
      - Always include clean Markdown formatting. Keep a humble but highly competent consultant tone.`;

      // Structure history parts for Gemini
      // If history is provided, we map it, otherwise we just call generateContent
      const contentsParts = [];
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          contentsParts.push({
            role: turn.role === 'user' ? 'user' : 'model',
            parts: [{ text: turn.text }]
          });
        }
      }
      contentsParts.push({ role: 'user', parts: [{ text: message }] });

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contentsParts,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text || "I was unable to calculate that. Let's try different parameters." });
    } catch (err: any) {
      console.error("Gemini server error: ", err);
      res.status(500).json({ error: err.message || "Internal Server Error in GCC AI consultant" });
    }
  });

  // Example proxy for Gemini if needed, but the client can use it if key is VITE_ prefixed or if we use server-side
  // Let's keep Gemini logic server-side for security as per guidelines if it's sensitive, 
  // but for AI Studio, GEMINI_API_KEY is usually safe in the environment.
  // The instructions say: "Always use process.env.GEMINI_API_KEY for the Gemini API."

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
