import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getMedicalAdvice(symptoms: string) {
  const prompt = `You are a professional medical assistant AI part of the "MedSmart" app.
  The user is reporting the following symptoms: "${symptoms}".
  Provide a professional, helpful, and concise response. 
  
  Guidelines:
  1. Analyze the symptoms and suggest possible (not definitive) conditions.
  2. Recommend specialized doctor types if applicable.
  3. Include a strong disclaimer: "AI advice is not a substitute for professional medical diagnosis. Please consult a qualified doctor for persistent or severe symptoms."
  4. Keep the tone empathetic and calm.
  
  Format the response in Markdown.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text || "I'm sorry, I couldn't process that request.";
}
