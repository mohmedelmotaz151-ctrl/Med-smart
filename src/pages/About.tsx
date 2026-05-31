import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Building2, 
  Award, 
  ShieldCheck, 
  Users2, 
  FileCheck2, 
  Activity, 
  FileText, 
  MapPin, 
  CheckCircle2, 
  ClipboardList, 
  Sparkles, 
  Briefcase, 
  Download, 
  ChevronRight, 
  ChevronLeft, 
  ExternalLink,
  Phone,
  Mail,
  Flame,
  Bell,
  Zap,
  Snowflake,
  Shield,
  Eye,
  ArrowRight,
  TrendingUp,
  Wrench,
  Camera,
  Layers,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const About: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'projects' | 'documents' | 'slides'>('overview');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openedModal, setOpenedModal] = useState<'cover' | 'about' | null>(null);

  const downloadProfilePDF = () => {
    const pages = [
      // Page 1: Cover
      [
        { text: "GCC COMPANY CONTRACTING", bold: true, size: 22, x: 80, y: 720 },
        { text: "COMPANY PROFILE", bold: true, size: 36, x: 80, y: 640 },
        { text: "--------------------------------------------------------", bold: false, size: 12, x: 80, y: 600 },
        { text: "Certified Official Presentation - 30 Pages", bold: false, size: 14, x: 80, y: 560 },
        { text: "Corporate MEP & Electromechanical Contracting Solutions", bold: false, size: 12, x: 80, y: 530 },
        { text: "Saudi Building Code (SBC) & Civil Defense Verified", bold: true, size: 12, x: 80, y: 500 },
        { text: "CR: 5855377113 | VAT: 312596124700003", bold: true, size: 11, x: 80, y: 470 },
        { text: "Abha - Khamis Mushayt - Riyadh, Kingdom of Saudi Arabia", bold: false, size: 11, x: 80, y: 200 },
        { text: "Contact: Gcc@gccgr.com | Phone: 055 030 7003", bold: true, size: 11, x: 80, y: 170 }
      ],
      // Page 2: Table of Contents (الفهرس)
      [
        { text: "TABLE OF CONTENTS (INDEX)", bold: true, size: 18, x: 50, y: 780 },
        { text: "========================", bold: false, size: 12, x: 50, y: 760 },
        { text: "1. Corporate Narrative & Company Overview (من نحن) ........................ Page 3", bold: false, size: 12, x: 50, y: 700 },
        { text: "2. Strategic Vision & Executive Mission (الرؤية والرسالة) .................. Page 4", bold: false, size: 12, x: 50, y: 660 },
        { text: "3. Our Core Services & Fields of Activity (خدماتنا) ........................ Page 5", bold: false, size: 12, x: 50, y: 620 },
        { text: "4. Executed Infrastructure & Civil Projects (المشاريع المنفذة) ............ Page 8", bold: false, size: 12, x: 50, y: 580 },
        { text: "5. What Sets Us Apart / Our Distinct Edge (ما يميزنا) ....................... Page 11", bold: false, size: 12, x: 50, y: 540 },
        { text: "6. Engineering Milestones & Project Gallery (معرض أعمالنا) .................. Page 13", bold: false, size: 12, x: 50, y: 500 },
        { text: "7. Official Registries & Certified Credentials (المستندات الرسمية) .............. Page 25", bold: false, size: 12, x: 50, y: 460 },
        { text: "8. Unified Communication Channels (التواصل الموحد) ......................... Page 30", bold: false, size: 12, x: 50, y: 420 },
        { text: "==========================================================================", bold: false, size: 11, x: 50, y: 350 },
        { text: "This profile corresponds fully to the printed book of GCC Company (30 Certified Pages).", bold: false, size: 10, x: 50, y: 320 }
      ],
      // Page 3: Company Overview
      [
        { text: "COMPANY OVERVIEW (من نحن)", bold: true, size: 18, x: 50, y: 780 },
        { text: "-------------------------", bold: false, size: 12, x: 50, y: 760 },
        { text: "GCC Company for Contracting is a dynamic and forward-thinking company", bold: false, size: 12, x: 50, y: 710 },
        { text: "dedicated to delivering unparalleled excellence across a wide spectrum", bold: false, size: 12, x: 50, y: 690 },
        { text: "of contracting and specialized MEP services.", bold: false, size: 12, x: 50, y: 670 },
        { text: "The company has rapidly established its position as a trusted and reliable", bold: false, size: 12, x: 50, y: 640 },
        { text: "partner in diverse complex industries, driven by an unwavering commitment", bold: false, size: 12, x: 50, y: 620 },
        { text: "to premium quality, groundbreaking innovation, and profound client satisfaction.", bold: false, size: 12, x: 50, y: 600 },
        { text: "--- ARABIC NARRATIVE SUMMARY (ملخص عربي) ---", bold: true, size: 11, x: 50, y: 540 },
        { text: "Tu'ad sharikat GCC lil-muqawalat sharikan dhat ruyah mustaqbaliyah ", bold: false, size: 11, x: 50, y: 512 },
        { text: "tas'a ila taqdim mustawan la mathila lahu minal tamayyuz 'abra majmu'atin", bold: false, size: 11, x: 50, y: 494 },
        { text: "wasi'ah min khadamat al-muqawalat al-mutalamisah al-athariyah.", bold: false, size: 11, x: 50, y: 476 },
        { text: "Istatat al-sharikah an tursikh makanataha kasharik muwthaq ya'tamad", bold: false, size: 11, x: 50, y: 446 },
        { text: "'alayhi fi mukhtalaf al-qita'at madfu'atan bialtizamiha bialjawdah al-'aliyah", bold: false, size: 11, x: 50, y: 428 },
        { text: "wal-ibtikar wa rida al-'umala bil-kamil.", bold: false, size: 11, x: 50, y: 410 }
      ],
      // Page 4: Vision & Mission
      [
        { text: "STRATEGIC VISION & EXECUTIVE MISSION", bold: true, size: 18, x: 50, y: 780 },
        { text: "------------------------------------", bold: false, size: 12, x: 50, y: 760 },
        { text: "VISION (الرؤية)", bold: true, size: 14, x: 50, y: 710 },
        { text: "We strive to be the preeminent and most innovative force in the", bold: false, size: 12, x: 50, y: 680 },
        { text: "contracting industry, consistently expanding our operational footprint", bold: false, size: 12, x: 50, y: 660 },
        { text: "and embracing cutting-edge technology to deliver future-ready solutions,", bold: false, size: 12, x: 50, y: 640 },
        { text: "while proactively adapting to the evolving demands of the global market.", bold: false, size: 12, x: 50, y: 620 },
        { text: "[Nas'a an nakun al-quwah al-raidah wal-akthar ibtikaran fi qita' al-muqawalat]", bold: false, size: 10, x: 50, y: 590 },
        { text: "MISSION (الرسالة)", bold: true, size: 14, x: 50, y: 530 },
        { text: "Our mission is to consistently deliver exceptional, high-quality contracting,", bold: false, size: 12, x: 50, y: 500 },
        { text: "maintenance, and specialized system solutions. We achieve this by ensuring", bold: false, size: 12, x: 50, y: 480 },
        { text: "unparalleled client satisfaction through meticulous project management,", bold: false, size: 12, x: 50, y: 460 },
        { text: "the dedication of a highly skilled and expert team, and an unwavering commitment", bold: false, size: 12, x: 50, y: 440 },
        { text: "to sustainable practices and social responsibility.", bold: false, size: 12, x: 50, y: 420 },
        { text: "[Muhimmatuna taqdim hulul muqawalat wa-siyanah bi-mustawa_stithnaiyi]", bold: false, size: 10, x: 50, y: 390 }
      ],
      // Page 5: Core Services
      [
        { text: "OUR CORE SERVICES & SOLUTIONS (خدماتنا المعتمدة)", bold: true, size: 18, x: 50, y: 780 },
        { text: "-----------------------------------------------", bold: false, size: 11, x: 50, y: 765 },
        { text: "1. GENERAL CONTRACTING (المقاولات العامة)", bold: true, size: 13, x: 50, y: 720 },
        { text: "   Providing end-to-end contracting services from concept to keys.", bold: false, size: 11, x: 50, y: 700 },
        { text: "2. MAINTENANCE & OPERATIONS (الصيانة والتشغيل)", bold: true, size: 13, x: 50, y: 660 },
        { text: "   Delivering proactive, specialized maintenance for critical facilities.", bold: false, size: 11, x: 50, y: 640 },
        { text: "3. ELECTROMECHANICAL SYSTEMS (أنظمة كهروميكانيكية)", bold: true, size: 13, x: 50, y: 600 },
        { text: "   Specializing in sophisticated industrial power, HVAC, and mechanical systems.", bold: false, size: 11, x: 50, y: 580 },
        { text: "4. SECURITY & FIRE SAFETY SYSTEMS (الأمن والسلامة والإنذار)", bold: true, size: 13, x: 50, y: 540 },
        { text: "   Executing state-of-the-art addressable suppression grids (ZATCA & MOI approved).", bold: false, size: 11, x: 50, y: 520 },
        { text: "5. MEDICAL FACILITIES MAINTENANCE (الصيانة الطبية الدقيقة)", bold: true, size: 13, x: 50, y: 480 },
        { text: "   Meeting complex healthcare requirements for hospitals & dialysis units.", bold: false, size: 11, x: 50, y: 460 },
        { text: "6. CENTRAL HVAC SYSTEMS (التدفئة والتهوية وتكييف الهواء)", bold: true, size: 13, x: 50, y: 420 },
        { text: "   Engineering clean climate automation, air balance, and duct layouts.", bold: false, size: 11, x: 50, y: 400 }
      ],
      // Page 6 & 7: Project Operations
      [
        { text: "CIVIL & INFRASTRUCTURE OPERATIONS", bold: true, size: 18, x: 50, y: 785 },
        { text: "Our specialized subdivisions execute with 5-star precision:", bold: false, size: 11, x: 50, y: 760 },
        { text: "[1] Asphalt Paving Works (أعمال السفلتة ومسارات النقل)", bold: true, size: 12, x: 50, y: 710 },
        { text: "    Compact site grading, hot-mix asphalt laydown, and parking structures.", bold: false, size: 11, x: 50, y: 690 },
        { text: "[2] Plastering & Masonry (أعمال اللياسة والتشطيب)", bold: true, size: 12, x: 50, y: 650 },
        { text: "    Accurate alignment, plaster finish engineering, and surface control.", bold: false, size: 11, x: 50, y: 630 },
        { text: "[3] Professional Decor Painting (أعمال الدهانات والديكور)", bold: true, size: 12, x: 50, y: 590 },
        { text: "    Safe multi-layer protective painting meeting commercial requirements.", bold: false, size: 11, x: 50, y: 570 },
        { text: "[4] Plumbing & Sanitary Infrastructure (تمديدات شبكات المياه والصحي)", bold: true, size: 12, x: 50, y: 530 },
        { text: "    Underground piping grids, robust leakage prevention, and heavy drain lines.", bold: false, size: 11, x: 50, y: 510 },
        { text: "[5] Paving Blocks & Curbs (أعمال البلدورات والإنترلوك)", bold: true, size: 12, x: 50, y: 470 },
        { text: "    Rigid interlocking configurations for walkways, complexes, and campuses.", bold: false, size: 11, x: 50, y: 450 },
        { text: "[6] Gypsum Board Architecture (أعمال الأسقف المستعارة والجبسبورد)", bold: true, size: 12, x: 50, y: 410 },
        { text: "    Clean drywall drops, lighting cavities, and acoustic integration.", bold: false, size: 11, x: 50, y: 390 },
        { text: "[7] Tile & Ceramic Works (تركيب البلاط والبورسلان والديكور)", bold: true, size: 12, x: 50, y: 350 },
        { text: "[8] Landscaping Maintenance (زراعة وتجهيز المسطحات الخضراء)", bold: true, size: 12, x: 50, y: 310 }
      ],
      // Page 8 & 9: Special Electromechanical Equipment & Projects
      [
        { text: "ELECTROMECHANICAL EQUIPMENT SERVICE RANGE", bold: true, size: 16, x: 50, y: 785 },
        { text: "------------------------------------------", bold: false, size: 11, x: 50, y: 765 },
        { text: "[•] Primary Electrical Transformers & Grids (الأنظمة الموزعة للكهرباء)", bold: true, size: 11, x: 50, y: 720 },
        { text: "    Supply, safe panel arrays, and active electrical maintenance.", bold: false, size: 11, x: 50, y: 700 },
        { text: "[•] Precision Medical Devices (تركيب الأجهزة الطبية ومحاكاتها)", bold: true, size: 11, x: 50, y: 660 },
        { text: "    Specialized calibration for highly demanding clinic and theater instruments.", bold: false, size: 11, x: 50, y: 640 },
        { text: "[•] Emergency Power Standby Generators (المولدات والاحتياط للتيار)", bold: true, size: 11, x: 50, y: 600 },
        { text: "    Continuous load synchronization, secure fuel lines, block heating.", bold: false, size: 11, x: 50, y: 580 },
        { text: "[•] Industrial Elevators & Escalators (المصاعد والسلالم الكهربائية)", bold: true, size: 11, x: 50, y: 540 },
        { text: "    UL-listed emergency brakes, smart logic processors, scheduled safety checks.", bold: false, size: 11, x: 50, y: 520 },
        { text: "[•] Dynamic Chilled-Water & HVAC Infrastructure (تكييف الهواء المركزي)", bold: true, size: 11, x: 50, y: 480 },
        { text: "    Air Handling Units (AHUs), Chilled-Water loops, industrial air-flow balancing.", bold: false, size: 11, x: 50, y: 460 }
      ],
      // Page 9 & 10: Executed Projects Portfolio
      [
        { text: "PROUD INFRASTRUCTURE ACCOMPLISHMENTS (المشاريع المنفذة)", bold: true, size: 16, x: 50, y: 785 },
        { text: "Our project roster proves the depth of our mechanical and civil teams:", bold: false, size: 11, x: 50, y: 760 },
        { text: "1. MODON PUMPING STATION CHILLED-WATER HVAC", bold: true, size: 12, x: 50, y: 720 },
        { text: "   Supply & expert integration of massive package chiller systems at Aseer.", bold: false, size: 11, x: 50, y: 700 },
        { text: "2. UNIVERSITY OF BISHA CAMPUS ROADS & INFRASTRUCTURE", bold: true, size: 12, x: 50, y: 660 },
        { text: "   Durable asphalt laydown, precise compaction, and structural grading.", bold: false, size: 11, x: 50, y: 640 },
        { text: "3. UNIVERSITY OF BISHA UL-LISTED EMERGENCY FIRE DOORS", bold: true, size: 12, x: 50, y: 600 },
        { text: "   Supplied heavy fire-rated panic safety steel exit doors and smoke shields.", bold: false, size: 11, x: 50, y: 580 },
        { text: "4. MINISTRY OF SPORT HEAVY MECHANICAL VENTILATION GRIDS", bold: true, size: 12, x: 50, y: 540 },
        { text: "   CO2 automated sensor loops, ventilation networks, exhaust sizing.", bold: false, size: 11, x: 50, y: 520 },
        { text: "5. MINISTRY OF HEALTH - TANUMAH HOSPITAL DIALYSIS SUITE", bold: true, size: 12, x: 50, y: 480 },
        { text: "   Fully-engineered fire alarm & addressable wet suppression grids.", bold: false, size: 11, x: 50, y: 460 },
        { text: "6. JED4 AMAZON FULFILLMENT CENTER AIR DUCT RIGGING", bold: true, size: 12, x: 50, y: 420 },
        { text: "   Massive central HVAC ducts rigged strictly meeting corporate layout guidelines.", bold: false, size: 11, x: 50, y: 400 }
      ],
      // Page 10 continued: Portfolio and Letters
      [
        { text: "PROUD INFRASTRUCTURE ACCOMPLISHMENTS (CONTINUED)", bold: true, size: 16, x: 50, y: 785 },
        { text: "7. MAERSK LOGISTIC TRANSIT PARK DUCTS & AUTOMATION", bold: true, size: 12, x: 50, y: 720 },
        { text: "   Climate envelope automation in extreme coastal summer conditions.", bold: false, size: 11, x: 50, y: 700 },
        { text: "8. RECONSTRUCTION / RELOCATION OF NAJRAN RED CRESCENT HQ", bold: true, size: 12, x: 50, y: 660 },
        { text: "   Deconstruction, transport, re-erection, and full systems commissioning.", bold: false, size: 11, x: 50, y: 640 },
        { text: "9. PEST & WEED INTERVENTION FOR UNIVERSITY OF BISHA", bold: true, size: 12, x: 50, y: 600 },
        { text: "   Chemical soil treatment, eco-friendly weed removal, structural barriers.", bold: false, size: 11, x: 50, y: 580 },
        { text: "------------------------------------------------------------------------", bold: false, size: 11, x: 50, y: 530 },
        { text: "DISTINCTIVE EDGE & VALUES (ما يميزنا وقيم المجموعة):", bold: true, size: 13, x: 50, y: 500 },
        { text: "• Uncompromising Quality Standards (معايير جودة عالية بدون أي مساومة)", bold: false, size: 11, x: 50, y: 470 },
        { text: "• 5-Star Competent Logistics Sizing (تجهيز لوجستي خمس نجوم للمقاولات)", bold: false, size: 11, x: 50, y: 450 },
        { text: "• Direct Emergency SLA Dispatch Routing (مسؤولو صيانة الطوارئ في الخدمة)", bold: false, size: 11, x: 50, y: 430 },
        { text: "• Transparent Commercial Records & Absolute Regulatory Alignment", bold: false, size: 11, x: 50, y: 410 }
      ],
      // Page 25-29: Regulatory Credentials
      [
        { text: "OFFICIAL REGULATORY COMPLIANCE DATA", bold: true, size: 18, x: 50, y: 785 },
        { text: "Our corporate entities are fully licensed and registered on all portals:", bold: false, size: 11, x: 50, y: 760 },
        { text: "● COMMERCIAL REGISTER (السجل التجاري الرئيسي)", bold: true, size: 12, x: 50, y: 710 },
        { text: "  Number: 5855377113 (وزارة التجارة)", bold: true, size: 11, x: 50, y: 690 },
        { text: "  Verified under active commercial rules in Saudi Arabia.", bold: false, size: 11, x: 50, y: 670 },
        { text: "● ZATCA APPOINTED VAT TAXPAYER (هيئة الزكاة والضريبة والجمارك)", bold: true, size: 12, x: 50, y: 620 },
        { text: "  VAT Number: 312596124700003", bold: true, size: 11, x: 50, y: 600 },
        { text: "  Form ID: VAT-111-KSA. Registered on 2024-11-01.", bold: false, size: 11, x: 50, y: 580 },
        { text: "● UNIFIED COMPANY IDENTIFIER (الرقم الموحد المعتمد)", bold: true, size: 12, x: 50, y: 530 },
        { text: "  Number: 7042113659 (وزارة الداخلية والمنشآت)", bold: true, size: 11, x: 50, y: 510 },
        { text: "● MINISTRY OF INTERIOR CIVIL DEFENSE (سلامة)", bold: true, size: 12, x: 50, y: 460 },
        { text: "  Unified CD License Number: 100001126", bold: true, size: 11, x: 50, y: 440 },
        { text: "  Region: Aseer - Khamis Mushayt. Expiry: 2028-05-18", bold: false, size: 11, x: 50, y: 420 },
        { text: "● SAUDI CONTRACTORS AUTHORITY (عضوية مقاول الهيئة السعودية)", bold: true, size: 12, x: 50, y: 370 },
        { text: "  Membership Number: 1288128811 | Portal: muqawil.org", bold: true, size: 11, x: 50, y: 350 },
        { text: "● NATIONAL ADDRESS (العنوان الوطني الموحد للشركة)", bold: true, size: 12, x: 50, y: 300 },
        { text: "  Building 7780, King Fahad Road, Khamis Mushayt, Zone Code: 62451", bold: false, size: 11, x: 50, y: 280 }
      ],
      // Page 30: Contacts
      [
        { text: "CONTACTS & UNIFIED CHANNELS (قنوات التواصل)", bold: true, size: 20, x: 80, y: 720 },
        { text: "==============================================", bold: false, size: 12, x: 80, y: 690 },
        { text: "GCC COMPANY CONTRACTING - SAUDI ARABIA", bold: true, size: 13, x: 80, y: 640 },
        { text: "For direct technical proposals, bidding details, emergency support", bold: false, size: 12, x: 80, y: 610 },
        { text: "and service SLA routing, contact our headquarters team:", bold: false, size: 12, x: 80, y: 590 },
        { text: "● PRIMARY EMAIL INBOX:", bold: true, size: 12, x: 80, y: 530 },
        { text: "  Gcc@gccgr.com", bold: true, size: 14, x: 100, y: 505 },
        { text: "● TECHNICAL HOTLINE & COORDINATION:", bold: true, size: 12, x: 80, y: 450 },
        { text: "  +966 55 030 7003", bold: true, size: 14, x: 100, y: 425 },
        { text: "● EXECUTIVE HEADQUARTERS ADDRESS:", bold: true, size: 12, x: 80, y: 370 },
        { text: "  King Fahad Road, Al-Adawi Commercial Center, Khamis Mushayt", bold: false, size: 12, x: 100, y: 345 },
        { text: "  طريق الملك فهد، مركز العدوي التجاري، خميس مشيط", bold: false, size: 11, x: 100, y: 325 },
        { text: "==============================================", bold: false, size: 12, x: 80, y: 200 },
        { text: "PROMPTLY BUILT TO HIGHEST INDUSTRY STANDARDS", bold: true, size: 10, x: 80, y: 170 }
      ]
    ];

    // Helper to dynamically build a clean, multi-page PDF compliant with PDF-1.4 spec
    let pdfStr = "%PDF-1.4\n%âãÏÓ\n";
    let objects: string[] = [];
    let objOffsets: number[] = [];

    // Pre-declare catalog and pages parent ids
    const catalogId = 1;
    const pagesId = 2;

    // Put them manually as the first 4 objects so ID mapping is stable
    objects.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj");
    // Pages object will be filled in with page pointers
    let pagesPlaceholderIdx = objects.push("") - 1; // index in objects array

    // Put Font Objects
    objects.push("3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj");
    objects.push("4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj");

    // Build each page contents stream & page object
    const createdPageIds: number[] = [];

    for (let pIdx = 0; pIdx < pages.length; pIdx++) {
      const pageElements = pages[pIdx];
      // Generate standard PDF content stream for text drawing operations
      let streamTxt = "BT\n";
      pageElements.forEach(el => {
        // Simple manual scaling & position inside standard A4 paper (595 x 842 points)
        const escapedTxt = el.text
          .replace(/\\/g, '\\\\')
          .replace(/\(/g, '\\(')
          .replace(/\)/g, '\\)');
        streamTxt += `/F${el.bold ? 2 : 1} ${el.size || 11} Tf\n`;
        streamTxt += `${el.x || 50} ${el.y || 700} Td\n`;
        streamTxt += `(${escapedTxt}) Tj\n`;
        // Move backward for next items
        streamTxt += `-${el.x || 50} -${el.y || 700} Td\n`;
      });
      streamTxt += "ET\n";

      // stream object
      const streamId = objects.length + 1;
      objects.push(`${streamId} 0 obj\n<< /Length ${streamTxt.length} >>\nstream\n${streamTxt}endstream\nendobj`);

      // Page object referencing resources and the parent and content stream
      const pageId = objects.length + 1;
      objects.push(`${pageId} 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${streamId} 0 R >>\nendobj`);
      createdPageIds.push(pageId);
    }

    // Now complete the Pages catalog pointer in Obj 2
    const kidsStr = createdPageIds.map(id => `${id} 0 R`).join(' ');
    objects[pagesPlaceholderIdx] = `2 0 obj\n<< /Type /Pages /Kids [${kidsStr}] /Count ${createdPageIds.length} >>\nendobj`;

    // Now write out all offsets and PDF content binary text
    let totalOffset = 0;
    const bodyParts: string[] = [];

    // Header length
    totalOffset = pdfStr.length;

    for (let i = 0; i < objects.length; i++) {
      objOffsets.push(totalOffset);
      const strZ = objects[i] + "\n";
      bodyParts.push(strZ);
      totalOffset += strZ.length;
    }

    const startXref = totalOffset;

    // Build xref table
    let xrefTxt = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 0; i < objects.length; i++) {
      const offsetStr = String(objOffsets[i]).padStart(10, '0');
      xrefTxt += `${offsetStr} 00000 n \n`;
    }

    const trailerTxt = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF`;

    const fullPdfText = pdfStr + bodyParts.join("") + xrefTxt + trailerTxt;

    const arr = new Uint8Array(fullPdfText.length);
    for (let i = 0; i < fullPdfText.length; i++) {
      arr[i] = fullPdfText.charCodeAt(i);
    }
    
    const blob = new Blob([arr], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = language === 'en' ? 'GCC_Company_Profile_MEP.pdf' : 'بروفايل_شركة_جي_سي_سي_للمقاولات.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Table of Contents list based on actual screenshots
  const tocItems = [
    { page: 1, titleAr: 'الغلاف الرئيسي', titleEn: 'Cover Page', color: 'bg-red-650' },
    { page: 3, titleAr: 'من نحن والمقدمة', titleEn: 'Company Overview', color: 'bg-blue-900' },
    { page: 4, titleAr: 'الرؤية والرسالة', titleEn: 'Vision & Mission', color: 'bg-blue-900' },
    { page: 5, titleAr: 'خدماتنا الرئيسية', titleEn: 'Our Core Services', color: 'bg-blue-900' },
    { page: 7, titleAr: 'الأعمال الفرعية المتخصصة', titleEn: 'Project Operations', color: 'bg-blue-900' },
    { page: 9, titleAr: 'المشاريع المنفذة', titleEn: 'Executed Projects Portfolio', color: 'bg-blue-900' },
    { page: 11, titleAr: 'ما يميزنا وقيمنا الساندة', titleEn: 'Our Distinctive Edge', color: 'bg-blue-900' },
    { page: 13, titleAr: 'معرض الأعمال والمشاريع', titleEn: 'Project Completion Highlights', color: 'bg-blue-900' },
    { page: 25, titleAr: 'المستندات والشهادات الرسمية', titleEn: 'Official ZATCA & Commerce Docs', color: 'bg-blue-900' },
    { page: 30, titleAr: 'طرق التواصل والمقر الموحد', titleEn: 'Corporate Contact Info', color: 'bg-blue-900' }
  ];

  // Executed projects directory with fully correct bilingual details matching screenshots
  const sampleProjects = [
    {
      id: 1,
      titleAr: 'توريد وتركيب تكييف محطة الضخ والتعبئة بالمنطقة الصناعية (عسير - مدن)',
      titleEn: 'Supply & Installation of Package Air Conditioning Systems for MODON Pumping & Filling Station, Aseer Region',
      clientAr: 'الهيئة السعودية للمدن الصناعية ومناطق التقنية - مدن',
      clientEn: 'Saudi Authority for Industrial Cities and Technology Zones (MODON)',
      scopeAr: 'توريد كامل لمكيفات الباكيج، تمديد مجاري الهواء (الدكت)، واختبار ضغط تدفق الهواء الميكانيكي ومكافحة رطوبة الموقع.',
      scopeEn: 'Supply and integration of package aircon chillers, heavy-gauge duct fabrication, airflow balance debugging, and temperature zoning.'
    },
    {
      id: 2,
      titleAr: 'أعمال السفلتة ومسارات النقل بجامعة بيشة',
      titleEn: 'Infrastructure Asphalting & Transportation Works at Bisha University',
      clientAr: 'جامعة بيشة المعمرة',
      clientEn: 'University of Bisha',
      scopeAr: 'تمهيد، ردم الأسس، تسوية ورصف أسفلت الطرق الداخلية للجامعة ومواقف كليات البنين والبنات ومسارات المركبات بدقة.',
      scopeEn: 'Grading, soil compaction, hot-mix asphalt laydown, parking striping and curb construction inside university campus.'
    },
    {
      id: 3,
      titleAr: 'توريد وتركيب أبواب وحواجز مخارج الطوارئ الحديدية المقاومة للحرائق (جامعة بيشة)',
      titleEn: 'Supply & Retrofitting of Fire-Rated Emergency Steel Exit Doors (Bisha University)',
      clientAr: 'جامعة بيشة',
      clientEn: 'Bisha University',
      scopeAr: 'تركيب أبواب مقاومة للحريق والشدة ومخارج الهروب والبارات الهيدروليكية المانعة للتسرب الدخاني وفق كود البناء السعودي.',
      scopeEn: 'Installation of UL-listed heavy fire-rated steel doors, panic exit hardware rods, and smoke sealing compliant with SBC guidelines.'
    },
    {
      id: 4,
      titleAr: 'أنظمة التهوية وتجديد الهواء السحب الكبرى (وزارة الرياضة)',
      titleEn: 'Heavy Exhaust Mechanical Ventilation and Sizing Systems for Ministry of Sport',
      clientAr: 'وزارة الرياضة السعودية',
      clientEn: 'Ministry of Sport',
      scopeAr: 'صناعة وتمديد مواسير التهوية وتدفق الهواء السريع وسحب الأدخنة والروائح النفاذة للصالات الرياضية ومجموعات المسابح الموحدة.',
      scopeEn: 'Industrial duct installations, exhaust fan calibration, heat recovery units, and CO2 sensor integration for athletic structures.'
    },
    {
      id: 5,
      titleAr: 'شبكات إنذار وإطفاء الحريق لوزارة الصحة (مستشفى تنومة العام - الغسيل الكلوي)',
      titleEn: 'Fire Alarm & Emergency Suppression Systems (Ministry of Health, Tanumah Hospital - Dialysis)',
      clientAr: 'وزارة الصحة بالتعاون مع مؤسسة عسيري للسلامة',
      clientEn: 'Ministry of Health & Ahmed Asiri Est.',
      scopeAr: 'تأسيس مواسير مكافحة الحريق الرطبة، كواشف الدخان الحساسة وعنونة لوحات الإنذار الموحدة لضمان أقصى سلامة لمرضى التصفية.',
      scopeEn: 'Deployment of wet-pipe sprinkler grids, addressable heat/smoke detectors, and integrated emergency notification logs.'
    },
    {
      id: 6,
      titleAr: 'أعمال تكييف وتدفئة مجمعات أمازون اللوجستية الفرعية (JED4 - كمقاول ميكانيكي فرعي)',
      titleEn: 'JED4 Amazon Fulfillment Center HVAC Sizing & Air Ducting Operations',
      clientAr: 'شركة أمازون السعودية كرتونال والمقاول الرئيسي',
      clientEn: 'Amazon Saudi Arabia & Chief EPC',
      scopeAr: 'تأسيس قنوات تمديد التبريد المركزي العملاق والصيانة المجدولة لأجهزة شفط وتسييل الهواء بمقر مستودعات أمازون بجدة.',
      scopeEn: 'Completed complex HVAC chilled water and duct rigging work strictly meeting globally managed corporate standards.'
    },
    {
      id: 7,
      titleAr: 'مجمع ميرسك اللوجستي ومستودعات الترانزيت بجدة (Maersk Logistic Park - كمقاول فرعي)',
      titleEn: 'Chilled Air HVAC & Ventilation Project at Maersk Logistic Park, Jeddah',
      clientAr: 'ميرسك العالمية لإدارة سلاسل الإمداد - جدة',
      clientEn: 'Maersk Logistic Park, Jeddah, KSA',
      scopeAr: 'تنفيذ أنظمة الضغط ومكافحة الانفجارات الحرارية داخل منافذ مستودعات التبريد الحرج وصيانة دوريات التحكم الصيفي الشرس.',
      scopeEn: 'Engineering of specialized multi-zone climate automation controls and active duct flow registers for high-volume storage.'
    },
    {
      id: 8,
      titleAr: 'مشروع تفكيك ونقل وإعادة صياغة مبنى الهلال الأحمر بنجران',
      titleEn: 'Historic Relocation, Dismantling & Reconstruction of Najran Red Crescent HQ',
      clientAr: 'هيئة الهلال الأحمر السعودي',
      clientEn: 'Saudi Red Crescent Authority, Najran',
      scopeAr: 'فك الهيكل المعدني والمكاتب الجاهزة وتوليد المخططات، ثم النقل الآمن للمقر وإعادة الربط والتنسيق بالموقع الجديد.',
      scopeEn: 'Technical deconstruction, transport, layout planning and complete mechanical/infrastructure re-commissioning of the modular base.'
    }
  ];

  // Specific slides reconstruction corresponding to the corporate profile PDF
  const slides = [
    {
      id: 1,
      titleAr: 'الغلاف الفني لملف الشركة',
      titleEn: 'Corporate Profile Cover Card',
      content: (
        <div 
          onClick={() => setOpenedModal('cover')}
          className="bg-slate-900 text-white rounded-2xl p-8 flex flex-col justify-between h-96 relative overflow-hidden border border-slate-800 text-center items-center justify-center space-y-4 cursor-pointer group hover:border-red-650/50 transition-all active:scale-[0.99]"
          title={language === 'en' ? 'Click to Open Interactive Front Cover' : 'اضغط لفتح غلاف البروفايل التفاعلي'}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-650/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-red-650/15 transition-all" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none" />
          
          <div className="z-10 bg-red-650 text-white font-black text-[10px] tracking-widest px-3 py-1 rounded-full uppercase border border-red-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-white animate-pulse" />
            {language === 'en' ? 'CLICK TO OPEN PREVIEW' : 'اضغط لفتح المعاينة التفاعلية'}
          </div>

          <div className="space-y-3 z-10 max-w-md mx-auto pointer-events-none">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white uppercase font-sans">
              COMPANY PROFILE
            </h1>
            <div className="w-16 h-1 bg-red-600 mx-auto rounded-full group-hover:w-24 transition-all duration-300" />
            <p className="text-sm font-extrabold text-slate-300">
              {language === 'en' ? 'GCC Company for Contracting' : 'شركة جي سي سي للمقاولات العامة'}
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {language === 'en' ? 'HVAC • FIRE SUPPRESSION • ELECTROMECHANICAL • CIVIL' : 'أنظمة التكييف • مكافحة الحرائق • الكهروميكانيك • الخدمات المدنية'}
            </p>
          </div>

          <div className="z-10 text-[10px] text-slate-500 font-mono pointer-events-none">
            {language === 'en' ? 'REGISTERED OFFICE: KHAMIS MUSHAYT / ABHA' : 'مقر التسجيل المعتمد: خميس مشيط / أبها'}
          </div>
        </div>
      )
    },
    {
      id: 2,
      titleAr: 'الفهرس وجدول الأبواب',
      titleEn: 'Table of Contents Index',
      content: (
        <div className="bg-white text-slate-800 rounded-2xl p-6 sm:p-8 h-96 flex flex-col justify-between border border-slate-200">
          <div>
            <span className="text-[9px] font-black text-red-650 uppercase tracking-wider block mb-1">
              {language === 'en' ? 'PDF OUTLINE' : 'فهرس المحتويات التنظيمي'}
            </span>
            <h3 className="text-lg font-black text-slate-950">
              {language === 'en' ? 'Table of Contents (الفهرس)' : 'أبواب بروفايل الشركة المعتمد'}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 my-auto text-xs font-sans">
            <div 
              onClick={() => setOpenedModal('about')}
              className="flex justify-between items-center py-1.5 border-b border-slate-100 hover:bg-slate-50 p-1.5 rounded-lg transition-all cursor-pointer group"
              title={language === 'en' ? 'Click to Open Company Overview Page' : 'اضغط لفتح صفحة من نحن بالتفصيل'}
            >
              <span className="font-extrabold text-slate-700 group-hover:text-red-600 transition-colors">1. من نحن / Overview • 👀</span>
              <span className="font-mono text-red-600 font-black">صفحة ٣</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 p-1.5">
              <span className="font-extrabold text-slate-700">2. الرؤية والرسالة / Vision</span>
              <span className="font-mono text-slate-400 font-bold">صفحة ٤</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 p-1.5">
              <span className="font-extrabold text-slate-700">3. خدماتنا / Services</span>
              <span className="font-mono text-slate-400 font-bold">صفحة ٥</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 p-1.5">
              <span className="font-extrabold text-slate-700">4. المشاريع المنفذة / Portfolio</span>
              <span className="font-mono text-slate-400 font-bold">صفحة ٩</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 p-1.5">
              <span className="font-extrabold text-slate-700">5. ما يميزنا / Distinct Edge</span>
              <span className="font-mono text-slate-400 font-bold">صفحة ١١</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 p-1.5">
              <span className="font-extrabold text-slate-700">6. المستندات الرسمية / Docs</span>
              <span className="font-mono text-slate-400 font-bold">صفحة ٢٥</span>
            </div>
          </div>

          <span className="text-[9px] text-slate-400 font-bold block text-center leading-tight">
            {language === 'en' ? 'All referenced pages reflect the certified 30-page hardcopy document.' : 'الصفحات المرجعية المذكورة دقيقة ومطابقة للكتاب السنوي للشركة المكون من ٣٠ صفحة.'}
          </span>
        </div>
      )
    },
    {
      id: 3,
      titleAr: 'قصة التميز والمقدمة',
      titleEn: 'Corporate Narrative & Overview',
      content: (
        <div className="bg-slate-300 text-slate-800 rounded-2xl p-6 sm:p-7 h-auto md:h-96 flex flex-col md:flex-row gap-6 md:gap-8 border border-slate-450 relative overflow-y-auto font-sans shadow-inner">
          {/* Left Column: Arched Image of crane */}
          <div className="w-full md:w-5/12 h-44 md:h-full relative overflow-hidden rounded-t-[100px] border border-slate-400 shrink-0 shadow-md bg-slate-400">
            <img 
              src="https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1200" 
              className="w-full h-full object-cover" 
              alt="Hardworking Electro-Mechanical Engineers"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Right Column: Content */}
          <div className="flex-1 flex flex-col justify-between space-y-4 md:space-y-0 h-full">
            {/* Header Tabs */}
            <div className="flex rounded-md overflow-hidden self-start border border-slate-450 shadow-xs">
              <div className="bg-[#0f2d59] text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-center flex items-center justify-center">
                Company Overview
              </div>
              <div className="bg-slate-200 text-slate-700 px-3.5 py-1.5 text-[11px] font-black text-center flex items-center justify-center border-l border-slate-350">
                من نحن
              </div>
            </div>

            {/* Paragraph Block */}
            <div className="space-y-2.5 my-auto py-1">
              <p className="text-[11px] sm:text-[12px] leading-relaxed text-slate-900 text-justify font-sans font-extrabold" style={{ direction: 'rtl' }}>
                تُعد شركة جي سي سي للمقاولات شركة ذات رؤية مستقبلية تسعى إلى تقديم مستوى لا مثيل له من التميز عبر مجموعة واسعة من خدمات المقاولات. استطاعت الشركة أن ترسخ مكانتها كشريك موثوق يُعتمد عليه في مختلف القطاعات مدفوعة بالتزامها بالجودة العالية والابتكار ورضا العملاء.
              </p>
              <div className="flex justify-center text-slate-450 font-bold tracking-widest leading-none h-2">...</div>
              <p className="text-[9.5px] sm:text-[10px] leading-relaxed text-slate-800 text-justify font-sans font-semibold">
                GCC Company for Contracting is a dynamic and forward-thinking company dedicated to delivering unparalleled excellence across a wide spectrum of contracting services. The company has rapidly established its position as a trusted and reliable partner in diverse industries, driven by a commitment to high quality, groundbreaking innovation, and profound client satisfaction.
              </p>
            </div>

            {/* Footer Row */}
            <div className="flex justify-between items-center border-t border-slate-350 pt-2 text-[9px] font-black">
              <div className="bg-white text-slate-950 px-2.5 py-0.5 rounded border border-slate-400 font-mono">
                3
              </div>
              <div className="text-slate-650 font-sans tracking-wide">
                شركة جي سي سي للمقاولات / GCC COMPANY CONTRACTING
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      titleAr: 'الرؤية والرسالة التنفيذية',
      titleEn: 'Vision & Mission Statements',
      content: (
        <div className="bg-white text-slate-800 rounded-2xl p-6 sm:p-8 h-96 flex flex-col justify-between border border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-blue-800 block uppercase tracking-wider mb-1">VISION • الرؤية</span>
                <p className="text-[10px] sm:text-[10.5px] leading-relaxed text-slate-700">
                  نسعى أن نكون القوة الرائدة والأكثر ابتكاراً في قطاع المقاولات وتوطين التقنيات الهندسية ومكافحة واحتواء الحرائق بالمملكة.
                </p>
              </div>
              <p className="text-[9.5px] italic text-slate-500 mt-2">
                "We strive to be the preeminent and most innovative force in the contracting industry."
              </p>
            </div>

            <div className="bg-red-50/50 p-4 rounded-xl border border-red-100/50 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-red-650 block uppercase tracking-wider mb-1">MISSION • الرسالة</span>
                <p className="text-[10px] sm:text-[10.5px] leading-relaxed text-slate-700">
                  تقديم حلول في كل من المقاولات والصيانة التأسيسية بأساليب دقيقة وتعيين طاقم بخمس نجوم لضمان أعلى مستويات الأمان.
                </p>
              </div>
              <p className="text-[9.5px] italic text-slate-500 mt-2">
                "Our mission is to consistently deliver exceptional, high-quality contracting & system solutions."
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      titleAr: 'تأهيلات المستندات الرسمية',
      titleEn: 'ZATCA VAT & Address Official Proof',
      content: (
        <div className="bg-slate-50 text-slate-800 rounded-2xl p-6 sm:p-8 h-96 flex flex-col justify-between border border-slate-200 overflow-y-auto">
          <div>
            <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider leading-none">PAGES 25-26 • REGULATORY COMPLIANCE</span>
            <h3 className="text-base font-black text-slate-900">{language === 'en' ? 'Official CR & Tax Identities' : 'الشهادات والهويات التنظيمية الموثقة'}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-auto text-[10px] font-sans">
            <div className="bg-white p-3 border border-slate-200 rounded-xl space-y-1">
              <span className="font-extrabold text-slate-400 block text-[9px]">TAX REGISTRATION (ضريبة القيمة المضافة)</span>
              <span className="font-black text-slate-900 block font-mono">312596124700003</span>
              <span className="text-slate-500 block">Zakat, Tax and Customs Authority approved Quarterly tax payer. Registered November 2024.</span>
            </div>

            <div className="bg-white p-3 border border-slate-200 rounded-xl space-y-1">
              <span className="font-extrabold text-slate-400 block text-[9px]">COMMERCIAL REGISTRY (السجل التجاري)</span>
              <span className="font-black text-slate-900 block font-mono">5855377113</span>
              <span className="text-slate-500 block">Licensed entity under Ministry of Commerce Saudi Arabia. Verification QR verified in portal database.</span>
            </div>
          </div>

          <div className="text-[9px] text-slate-500 text-center font-bold">
            {language === 'en' ? '• Physical address located at King Fahad Road, Khamis Mushayt, Saudi Arabia.' : '• العنوان السكني الوطني المسجل: خميس مشيط - حي المعارض - طريق الملك فهد - الرمز البريدي 62451.'}
          </div>
        </div>
      )
    },
    {
      id: 6,
      titleAr: 'شهادة الاعتماد الدولي الآيزو ISO 9001:2015',
      titleEn: 'ISO 9001:2015 Quality Registration',
      content: (
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 h-96 flex flex-col justify-between border border-slate-800 overflow-y-auto relative text-justify">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-[9px] font-black text-amber-500 block uppercase tracking-wider leading-none">REGISTRATION RECORD • ISO 9001:2015</span>
              <h3 className="text-base font-black text-white mt-1">{language === 'en' ? 'Quality Management System Certificate' : 'شهادة نظام إدارة الجودة العالمية'}</h3>
            </div>
            <Award className="w-8 h-8 text-amber-500 shrink-0" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-auto text-[10px] font-sans">
            <div className="bg-slate-800/80 p-3.5 border border-slate-700/50 rounded-xl space-y-1">
              <span className="font-extrabold text-slate-400 block text-[9px] uppercase">Certificate Number / رقم الشهادة</span>
              <span className="font-mono font-black text-amber-500 block text-sm select-all">181224019645</span>
              <span className="text-slate-350 block leading-normal text-[9.5px]">
                {language === 'en' 
                  ? 'Verifiably matching general contracting capabilities (IAF Code: 28) for GCC Contracting.' 
                  : 'معتمدة ومطابقة لمجال المقاولات العامة والتجهيز الهندسي لشركة جي سي سي.'}
              </span>
            </div>

            <div className="bg-slate-800/80 p-3.5 border border-slate-700/50 rounded-xl space-y-1">
              <span className="font-extrabold text-slate-400 block text-[9px] uppercase">Accredited Body / الجهة الموثقة</span>
              <span className="font-black text-slate-200 block text-[10.5px]">ARS Assessment (UAF & IAF)</span>
              <span className="text-slate-350 block leading-normal text-[9.5px]">
                {language === 'en' 
                  ? 'Initial: 18-Dec-2024. Expiry Date: 17-Dec-2027.' 
                  : 'صياغة الإصدار: ١٨ ديسمبر ٢٠٢٤. تاريخ الانتهاء: ١٧ ديسمبر ٢٠٢٧.'}
              </span>
            </div>
          </div>

          <div className="bg-slate-850 p-2.5 rounded-xl text-[9.5px] text-slate-400 font-semibold border border-slate-800/60 leading-tight">
            <span className="text-amber-500 font-black mr-1 uppercase font-mono">VERIFICATION:</span>
            {language === 'en'
              ? 'Visit arscert.com or iafcertsearch.org to verifiably verify with Certificate No. 181224019645.'
              : 'يمكنكم تتبع مطابقة وموثوقية الرمز الإلكتروني للشهادة عبر قاعدة بيانات iafcertsearch.org.'}
          </div>
        </div>
      )
    },
    {
      id: 7,
      titleAr: 'ترخيص الدفاع المدني لمزاولة النشاط (سلامة)',
      titleEn: 'Civil Defense Activity License (Salamah)',
      content: (
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 h-96 flex flex-col justify-between border border-emerald-900/60 overflow-y-auto relative text-justify">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-[9px] font-black text-emerald-400 block uppercase tracking-wider leading-none">MINISTRY OF INTERIOR • CIVIL DEFENSE</span>
              <h3 className="text-base font-black text-white mt-1">{language === 'en' ? 'Civil Defense Commercial Activity License (Salamah)' : 'ترخيص الدفاع المدني لمزاولة النشاط التجاري (سلامة)'}</h3>
            </div>
            <Flame className="w-8 h-8 text-emerald-400 shrink-0 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-auto text-[10.5px] font-sans">
            <div className="bg-slate-850/90 p-3 border border-slate-800 rounded-xl space-y-1">
              <span className="font-extrabold text-slate-400 block text-[9px] uppercase">License particulars / تفاصيل الترخيص</span>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-350">{language === 'en' ? 'License Number:' : 'رقم الترخيص الموحد:'}</span>
                <span className="font-mono font-black text-emerald-400 select-all">100001126</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-350">{language === 'en' ? 'Ministry of Interior ID:' : 'رقم وزارة الداخلية:'}</span>
                <span className="font-mono text-slate-200 font-bold select-all">7042113659</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-350">{language === 'en' ? 'Commercial Name:' : 'الاسم التجاري للهيئة:'}</span>
                <span className="text-slate-200 font-extrabold truncate max-w-[120px]">{language === 'en' ? 'GCC Contracting' : 'شركة جي سي سي للمقاولات'}</span>
              </div>
            </div>

            <div className="bg-slate-850/90 p-3 border border-slate-800 rounded-xl space-y-1">
              <span className="font-extrabold text-slate-400 block text-[9px] uppercase">VALIDITY & REGION / المدد والمنطقة</span>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-350">{language === 'en' ? 'Issue Date:' : 'تاريخ الإصدار المعتمد:'}</span>
                <span className="font-mono text-slate-250 font-bold">2026-05-18</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-350">{language === 'en' ? 'Expiry Date:' : 'تاريخ الانتهاء المجدد:'}</span>
                <span className="font-mono font-black text-rose-450">2028-05-18</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-350">{language === 'en' ? 'Region / Location:' : 'المنطقة والمدينة والبلدية:'}</span>
                <span className="text-emerald-400 font-black">{language === 'en' ? 'Asir, Khamis Mushayt' : 'عسير - خميس مشيط'}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-850 p-2.5 rounded-xl text-[9px] text-slate-450 font-semibold border border-slate-800/60 leading-normal">
            <span className="text-emerald-400 font-black mr-1 uppercase font-mono">OFFICIAL STATUS:</span>
            {language === 'en'
              ? 'This document is digitally signed by Civil Defense (Asir) and does not require hand-written signatures per Cabinet Decision No. 8.'
              : 'هذه الوثيقة موقعة إلكترونياً ومصادق عليها رقمياً من مديرية الدفاع المدني بمنطقة عسير ولا تحتاج إلى توقيع يدوي وفقاً لقرار مجلس الوزراء رقم ٨.'}
          </div>
        </div>
      )
    },
    {
      id: 8,
      titleAr: 'شهادة عضوية الهيئة السعودية للمقاولين (SCA)',
      titleEn: 'Saudi Contractors Authority (SCA) Membership Certificate',
      content: (
        <div className="bg-white text-slate-800 rounded-2xl p-6 sm:p-8 h-96 flex flex-col justify-between border border-slate-200 overflow-y-auto relative text-justify">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-[9px] font-black text-teal-650 block uppercase tracking-wider leading-none">SAUDI CONTRACTORS AUTHORITY • SCA</span>
              <h3 className="text-base font-black text-slate-900 mt-1">{language === 'en' ? 'Contracting Membership Certificate' : 'شهادة عضوية تصنيف مقاول معتمد'}</h3>
            </div>
            <FileCheck2 className="w-8 h-8 text-teal-600 shrink-0" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-auto text-[10.5px] font-sans">
            <div className="bg-slate-50 p-3 border border-slate-150 rounded-xl space-y-1">
              <span className="font-extrabold text-slate-400 block text-[9px] uppercase">MEMBERSHIP DATA / معلومات العضوية</span>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">{language === 'en' ? 'Membership Number:' : 'رقم العضوية المسجل:'}</span>
                <span className="font-mono font-black text-teal-700 select-all">1288128811</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">{language === 'en' ? 'Registered Contractor:' : 'اسم المنشأة المرخصة:'}</span>
                <span className="font-extrabold text-slate-800 truncate max-w-[120px]">{language === 'en' ? 'GCC Contracting' : 'شركة جي سي سي للمقاولات'}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 border border-slate-150 rounded-xl space-y-1">
              <span className="font-extrabold text-slate-400 block text-[9px] uppercase">VALID PERIOD / دورة العضوية</span>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">{language === 'en' ? 'Issue Date:' : 'تاريخ الإصدار المعتمد:'}</span>
                <span className="font-mono text-slate-700 font-bold">2025-12-18</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">{language === 'en' ? 'Expiry Date:' : 'تاريخ نهاية العضوية:'}</span>
                <span className="font-mono font-black text-red-600">2026-12-18</span>
              </div>
            </div>
          </div>

          <div className="bg-teal-50/70 p-2.5 rounded-xl text-[9.5px] text-teal-850 font-semibold border border-teal-100 leading-normal">
            <span className="text-teal-700 font-black mr-1 uppercase font-mono">VERIFICATION DIRECTIVE:</span>
            {language === 'en'
              ? 'Visit official portal of Saudi Contractors Authority at muqawil.org using Membership ID 1288128811 to verifiably confirm credentials.'
              : 'يرجى مراجعة الموقع الرسمي للهيئة الهندسية السعودية للمقاولين muqawil.org بالرقم التعريفي المميز ١٢٨٨١٢٨٨١١ لمطابقة الشهادة.'}
          </div>
        </div>
      )
    }
  ];

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="space-y-10 pb-16 font-sans">
      
      {/* Upper header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-block bg-red-50 text-red-600 rounded-full text-[10px] font-black tracking-widest px-3 py-1 border border-red-100 uppercase mb-3">
            {language === 'en' ? 'GCC COMPANY CERTIFICATIONS' : 'الملف والوثائق الرسمية لشركة جي سي سي'}
          </div>
          <h1 className="text-3.5xl font-black text-slate-900 tracking-tight leading-none">
            {language === 'en' ? 'Company Profile Dashboard' : 'البروفايل التعريفي ومستندات الشركة'}
          </h1>
          <p className="text-slate-500 text-xs mt-2 font-semibold">
            {language === 'en' 
              ? 'Explore the official 30-page GCC Contracting portfolio, verified completion certificates and local tax registration documents.' 
              : 'تصفح بروفايل شركة GCC للمقاولات المكون من ٣٠ صفحة، ومستندات السجل الضريبي وشهادات إنجاز المخططات المعتمدة بكافة مناطق المملكة.'}
          </p>
        </div>

        {/* Action interactive layout switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 self-start md:self-end">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
              activeTab === 'overview' 
                ? 'bg-white text-slate-950 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'en' ? 'Overview' : 'المقدمة والرؤية'}
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
              activeTab === 'services' 
                ? 'bg-white text-slate-950 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'en' ? 'Services' : 'خدماتنا'}
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
              activeTab === 'projects' 
                ? 'bg-white text-slate-950 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'en' ? 'Projects' : 'المشاريع المنفذة'}
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
              activeTab === 'documents' 
                ? 'bg-white text-slate-950 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'en' ? 'Credentials' : 'المستندات الرسمية'}
          </button>
          <button
            onClick={() => setActiveTab('slides')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
              activeTab === 'slides' 
                ? 'bg-white text-red-650 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-red-600 animate-pulse" />
              {language === 'en' ? 'Slider' : 'أومني سلايدر'}
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: OVERVIEW AND STRATEGIC FOUNDATION (من نحن - الرؤية والرسالة) */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            
            {/* Split cover card element */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100/30 rounded-full blur-3xl" />
              
              {/* Left description text */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest block">{language === 'en' ? 'PAGE 3 SUMMARY' : 'ملخص الصفحة الثالثة للبروفايل'}</span>
                  <button
                    onClick={() => setOpenedModal('about')}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 rounded-xl transition-all font-black text-[10px] inline-flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3 h-3 text-red-600 animate-pulse" />
                    <span>{language === 'en' ? 'PREVIEW PAGE • 👀' : 'المعاينة التفاعلية • 👀'}</span>
                  </button>
                </div>
                
                <h2 className="text-2.5xl font-black text-slate-950 tracking-tight leading-tight">
                  {language === 'en' 
                    ? 'GCC Company for Contracting Overview' 
                    : 'شركة جي سي سي للمقاولات العامة والتجهيزات الكهروميكانيكية'}
                </h2>

                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify font-sans">
                  {language === 'en'
                    ? 'Our firm represents a forward-looking enterprise striving to bring an unparalleled benchmark of distinction across an expansive umbrella of commercial engineering and MEP construction works. GCC stands as a trustworthy cornerstone, supporting projects with critical fire suppression, structural safety, standby power grids, and thermal comfort.'
                    : 'تعتبر شركة جي سي سي للمقاولات من الكيانات الهندسية المرموقة وذات الرؤية المستقبلية الواعدة، حيث أخذنا على عاتقنا تقديم مستوى لا مثيل له من التميز عبر باقة متكاملة من الأعمال الإنشائية والكهروميكانيكية. نجحنا في ترسيخ مكانتنا كشريك استراتيجي رائد يمنح أصحاب المشاريع التجارية والصناعية والتطويرية هدوء البال بفضل تماشينا المطلق مع لوائح كود البناء السعودي ومعايير الدفاع المدني.'}
                </p>

                <div className="border-t border-slate-100 pt-5 grid grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <span className="text-slate-400 font-bold block">{language === 'en' ? 'Corporate Headquarters' : 'المقر والفرع الرئيسي'}</span>
                    <span className="font-extrabold text-slate-800 block mt-1">{language === 'en' ? 'King Fahad St, Abha / Khamis' : 'طريق الملك فهد، خميس مشيط / أبها'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block">{language === 'en' ? 'Commercial Registry No.' : 'رقم السجل التجاري الموثق'}</span>
                    <span className="font-mono font-black text-red-650 block mt-1">5855377113</span>
                  </div>
                </div>
              </div>

              {/* Right decorative visual box resembling cover */}
              <div 
                onClick={() => setOpenedModal('cover')}
                className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-80 relative overflow-hidden border border-slate-850 cursor-pointer group hover:border-red-650 transition-all active:scale-[0.99]"
                title={language === 'en' ? 'Preview Corporate Profile Cover' : 'معاينة غلاف البروفايل للشركة تفاعلياً'}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-650/15 rounded-full blur-2xl pointer-events-none group-hover:bg-red-650/25 transition-all" />
                
                <span className="bg-slate-850 text-red-500 border border-slate-700/60 text-[8.5px] px-2 py-0.5 rounded-lg uppercase self-start leading-none font-mono flex items-center gap-1 font-black shadow-sm group-hover:border-red-500/30 transition-all">
                  <Sparkles className="w-2.5 h-2.5 text-red-500 animate-pulse" />
                  {language === 'en' ? 'GCC COVER • CLICK TO PREVIEW' : 'غلاف جي سي سي • اضغط للمعاينة'}
                </span>

                <div className="space-y-2 pointer-events-none">
                  <h3 className="text-xl font-black tracking-tight uppercase leading-tight font-sans text-white">
                    COMPANY PROFILE
                  </h3>
                  <div className="w-10 h-1 bg-red-600 rounded group-hover:w-16 transition-all duration-300" />
                  <p className="text-[10.5px] text-slate-350 leading-relaxed font-semibold">
                    {language === 'en' ? 'Official book of execution, civil capabilities, and regulatory approvals.' : 'بروفايل معتمد بمكاتب الدفاع المدني للمقايسات والمقاولات.'}
                  </p>
                </div>

                <div className="text-[9px] text-slate-400 font-mono tracking-tighter flex justify-between items-center w-full pointer-events-none">
                  <span>ESTABLISHED REGISTERED TRADEMARK</span>
                  <span className="text-red-550 font-black text-[10px] animate-pulse">PDF 📥</span>
                </div>
              </div>
            </div>

            {/* Vision and Mission dual layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
              
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-4 right-4 text-slate-100 font-black text-6xl leading-none font-sans select-none">VISION</div>
                <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold relative z-10">
                  <Award className="w-5.5 h-5.5" />
                </div>
                
                <div className="space-y-2 relative z-10">
                  <span className="text-[9px] font-black text-blue-650 tracking-wider uppercase block">{language === 'en' ? 'THE PREEMINENT STANDARD' : 'الريادة والتميز الإقليمي'}</span>
                  <h3 className="text-lg font-black text-slate-900">{language === 'en' ? 'Our Vision (الرؤية)' : 'رؤية الشركة الاستمرارية'}</h3>
                  
                  <p className="text-slate-650 text-xs sm:text-[12.5px] leading-relaxed text-justify">
                    {language === 'en'
                      ? 'We strive to expand our footprint throughout the Kingdom of Saudi Arabia, embracing cutting-edge MEP solutions to deliver safe and sustainable cities in direct alignment with Saudi Vision 2030.'
                      : 'نسعى أن نكون القوة الهندسية الرائدة والأكثر ابتكاراً وتطوراً في قطاع المقاولات على مستوى المملكة العربية السعودية، عبر تقديم حلول كهروميكانيكية ووقائية متفوقة تواكب تحديات الغد، وتدعم أهداف رؤية المملكة ٢٠٣٠ في تحصين وحماية البنى التحتية.'}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-4 right-4 text-slate-100 font-black text-6xl leading-none font-sans select-none">SLA</div>
                <div className="w-11 h-11 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-bold relative z-10">
                  <ShieldCheck className="w-5.5 h-5.5" />
                </div>

                <div className="space-y-2 relative z-10">
                  <span className="text-[9px] font-black text-red-650 tracking-wider uppercase block">{language === 'en' ? 'INTEGRATED CONTRACTING' : 'التنفيذ الدقيق للمهام'}</span>
                  <h3 className="text-lg font-black text-slate-900">{language === 'en' ? 'Our Mission (الرسالة)' : 'رسالة وأهداف الشركة'}</h3>
                  
                  <p className="text-slate-650 text-xs sm:text-[12.5px] leading-relaxed text-justify">
                    {language === 'en'
                      ? 'Deploy, maintain and audit robust mechanical and thermal assets, ensuring absolute code conformance, budget accuracy and direct client safety through highly credentialed engineers.'
                      : 'تقديم وتأسيس وصيانة حلول الأنظمة الكهروميكانيكية المتكاملة بمستوى استثنائي وجودة صارمة لا تقبل المساومة. نهدف لضمان السلامة المطلقة والجمالية الهندسية عبر ترشيد النفقات التشغيلية وضمان التماشي التام والامتثال الحرفي لأعمال الدفاع المدني.'}
                  </p>
                </div>
              </div>

            </div>

            {/* Index summary layout */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm">
              <div>
                <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider block">{language === 'en' ? 'Interactive Index Guide' : 'الفهرس التفاعلي لأبواب البروفايل'}</h3>
                <p className="text-[10px] text-slate-400 font-bold">{language === 'en' ? 'Tracing sections matching the printed 30-page profile' : 'أبواب وملخصات مستوحاة من مستندات الشركة القانونية للتسهيل والسرية'}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {tocItems.map((item, idx) => {
                  const isInteractive = item.page === 1 || item.page === 3;
                  return (
                    <div 
                      key={idx} 
                      onClick={() => {
                        if (item.page === 1) setOpenedModal('cover');
                        if (item.page === 3) setOpenedModal('about');
                      }}
                      className={`bg-slate-50 border p-3.5 rounded-2xl flex flex-col justify-between transition-all ${
                        isInteractive 
                          ? 'border-red-100 hover:border-red-650/40 bg-gradient-to-tr from-slate-50 to-red-50/15 cursor-pointer hover:shadow-sm active:scale-95' 
                          : 'border-slate-100 opacity-80'
                      }`}
                      title={isInteractive ? (language === 'en' ? 'Click to Preview Section' : 'اضغط لمعاينة القسم تفاعلياً') : undefined}
                    >
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[9px] text-red-650 font-black block">PAGE {item.page}</span>
                          {isInteractive && (
                            <span className="text-[7.5px] bg-red-100 text-red-600 font-black px-1.5 py-0.5 rounded uppercase tracking-wider scale-95 origin-right">
                              {language === 'en' ? 'PREVIEW • 👀' : 'معاينة • 👀'}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-black text-slate-900 mt-1.5 leading-snug">
                          {language === 'en' ? item.titleEn : item.titleAr}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 2: SPECIALIZED SERVICES DIRECTORY (خدماتنا المعتمدة) */}
        {activeTab === 'services' && (
          <motion.div
            key="services"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="max-w-xl">
              <span className="text-[10px] font-black text-red-650 uppercase tracking-wider block">{language === 'en' ? 'PAGES 5-8' : 'ملخص الصفحات مابين ٥ و ٨ المعتمدة'}</span>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight mt-1">{language === 'en' ? 'Our Core Engineering Divisions' : 'التخصصات الهندسية ورخص التأسيس المسجلة'}</h2>
              <p className="text-slate-500 text-xs mt-1.5 font-semibold">
                {language === 'en' ? 'We execute complete MEP, civil contracting, fire suppression, and ventilation.' : 'مجموعة متكاملة وشاملة من الخدمات المصممة بعناية لتلبية وتجاوز التوقعات بدقة وكفاءة.'}
              </p>
            </div>

            {/* Core Services grid matching page 5 details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
              
              <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-red-50 text-red-650 rounded-xl flex items-center justify-center font-bold">
                  <Flame className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-sm font-black text-slate-950">{language === 'en' ? '1. Fire Fighting & Suppression' : '١. شبكات مكافحة وإطفاء الحرائق'}</h3>
                <p className="text-slate-550 text-xs leading-relaxed text-justify">
                  {language === 'en' ? 'Full design, hydraulic calculations, and installation of sprinkler grids, FM200 clean gas, dry systems, fire cabinets and pumps conforming with NFPA guidelines.' : 'تأسيس وتركيب وصيانة شبكات الإطفاء الرطبة والجافة، فوهة الحريق، أنظمة الغاز النظيف FM200 والضغوط الهيدروليكية المطابقة المطلقة للدفاع المدني.'}
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
                  <Bell className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-sm font-black text-slate-950">{language === 'en' ? '2. Fire Alarms & Detection' : '٢. كواشف وحساسات الإنذار المبكر'}</h3>
                <p className="text-slate-550 text-xs leading-relaxed text-justify">
                  {language === 'en' ? 'Addressable and conventional fire systems, smoke beam detectors, central safety monitors, control integrations and auto-dialers for safety dispatch.' : 'توريد وتوصيل كواشف الدخان والحرارة الحساسة الذكية، لوحات التحكم المعنونة، أجراس سارينة الطوارئ ومسارات تتبع لوحات توزيع كود البناء.'}
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                  <Snowflake className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-sm font-black text-slate-950">{language === 'en' ? '3. Central HVAC & Ducts' : '٣. التكييف والتهوية الميكانيكية'}</h3>
                <p className="text-slate-550 text-xs leading-relaxed text-justify">
                  {language === 'en' ? 'Heavy packaged central systems, split networks, chillers, air treatment units, precision ducts fabrication, and heat load calculations for warehouses.' : 'دراسة الأحمال الحرارية، تصميم وصناعة الدكت ومجاري التكييف المركزي المصنعة، تكييف الباكيج، الشيلرات وحساب التدفق ومراوح السحب لوزارة الرياضة وغيرها.'}
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center font-bold">
                  <Zap className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-sm font-black text-slate-950">{language === 'en' ? '4. Electromechanical (MEP)' : '٤. الأعمال والشبكات الكهروميكانيكية'}</h3>
                <p className="text-slate-550 text-xs leading-relaxed text-justify">
                  {language === 'en' ? 'Medium-voltage wiring, generator hookups, panel boards, electrical load balances, sanitization plumbing, sewage lines, pressure safety.' : 'التخصص في التمديدات والربط الكهربائي، لوحات التوزيع وتأمين أحمال المولدات، وخطوط شبكات تصريف مياه الفحوصات بامتياز ميكانيكي.'}
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center font-bold">
                  <Activity className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-sm font-black text-slate-950">{language === 'en' ? '5. Medical Facilities Maintenance' : '٥. الصيانة الطبية والتعقيم'}</h3>
                <p className="text-slate-550 text-xs leading-relaxed text-justify">
                  {language === 'en' ? 'Specialist preventive operations and compliance certifications for critical hospital departments, operating theaters, and medical chambers.' : 'تقديم برامج التطهير وصيانة شبكات الضغوط وتوريد كواشف الحرائق لقسم الغسيل الكلوي والأمور الجراحية الحساسة بوزارة الصحة.'}
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                  <Wrench className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-sm font-black text-slate-950">{language === 'en' ? '6. General Maintenance & Civil' : '٦. المقاولات الإنشائية والترميم'}</h3>
                <p className="text-slate-550 text-xs leading-relaxed text-justify">
                  {language === 'en' ? 'Asphalting roads, structural plastering and painting, curbstones layout, gypsum grids, tiling and certified safety exit barriers deployment.' : 'تمهيد وسفلتة الطرق الداخلية والمواقف للجامعات والبلديات، أعمال اللياسة، الدهان الخارجي الشديد للمباني، تركيب البلدورات وأبواب الطوارئ.'}
                </p>
              </div>
            </div>

            {/* Special tasks list section */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              <div className="flex gap-3.5 items-center">
                <div className="p-2.5 bg-red-650 rounded-xl text-white">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">{language === 'en' ? 'Operational Civil Work Division (Page 7 & 8)' : 'مجال الأعمال الإنشائية والمساندة المعتمد'}</h3>
                  <p className="text-[10px] text-slate-400">{language === 'en' ? 'Standard materials verified against SASO / SABER regulatory rules' : 'بنود يتم تزويدها وتأسيسها وتطويرها في مختلف المشروعات الحكومية والأكاديمية والشركات'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
                {[
                  { labelAr: 'أعمال السفلتة ورصف الطرق', labelEn: 'Asphalting & Laydown' },
                  { labelAr: 'أعمال اللياسة الهندسية', labelEn: 'Plastering & Masonry' },
                  { labelAr: 'أعمال الدهانات الديكورية والخارجية', labelEn: 'Protective & Dec Painting' },
                  { labelAr: 'أعمال التمديدات والوصلات الصحية', labelEn: 'Commercial Plumbing' },
                  { labelAr: 'أعمال البلدورات ورصف البلاط', labelEn: 'Curbstone & Interlock' },
                  { labelAr: 'أعمال الجبسبورد والقواطع', labelEn: 'Gypsum Board Grids' },
                  { labelAr: 'أعمال السيراميك والبورسلان', labelEn: 'Ceramic Tiling' },
                  { labelAr: 'تنسيق وصيانة المسطحات الخضراء', labelEn: 'Landscaping Operations' }
                ].map((task, i) => (
                  <div key={i} className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50 space-y-1">
                    <span className="text-[9px] text-red-500 font-mono font-black">CODE-GCC-{100 + i}</span>
                    <span className="block font-extrabold text-slate-200 text-[11px] leading-tight">{language === 'en' ? task.labelEn : task.labelAr}</span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 3: EXECUTED PROJECTS PORTFOLIO (المشاريع المنفذة) */}
        {activeTab === 'projects' && (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="max-w-xl">
              <span className="text-[10px] font-black text-red-650 uppercase tracking-wider block">{language === 'en' ? 'PORTFOLIO OUTLINE (PAGES 9 & 10)' : 'رؤية ملموسة لمسيرة المشاريع والتعميد'}</span>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight mt-1">{language === 'en' ? 'SBC & Civil Defense Certified Accomplishments' : 'المشاريع والاعتمادات المنجزة والمسجلة'}</h2>
              <p className="text-slate-500 text-xs mt-1 font-semibold">
                {language === 'en' ? 'Direct engineering outputs and contracts completed for government and corporate clients.' : 'استعراض للمشاريع الكهروميكانيكية الهامة التي صممناها ورصفناها وفحصناها بنجاح.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
              {sampleProjects.map((proj) => (
                <div key={proj.id} className="bg-white border border-slate-200 p-5 rounded-3xl space-y-3 shadow-xs hover:border-slate-350 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <span className="font-mono text-[9px] bg-slate-900 text-white px-2 py-0.5 rounded font-black">
                        PROJ-0{proj.id}
                      </span>
                      <span className="text-[9px] text-red-600 font-extrabold uppercase">
                        {language === 'en' ? 'COMPLETED & APPROVED' : 'منجز ومعتمد'}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                      {language === 'en' ? proj.titleEn : proj.titleAr}
                    </h4>

                    <p className="text-[10.5px] text-slate-400 font-bold leading-none">
                      {language === 'en' ? `CLIENT: ${proj.clientEn}` : `جهة التعاقد: ${proj.clientAr}`}
                    </p>

                    <p className="text-slate-600 text-[11px] leading-relaxed pt-1 border-t border-slate-50">
                      {language === 'en' ? proj.scopeEn : proj.scopeAr}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Achievement highlights box containing maersk and amazon codes */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">{language === 'en' ? 'Prestigious Corporate Logistics Sizing' : 'تأسيس شبكات مجمعات الخدمات اللوجستية'}</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                <div className="bg-white p-4.5 rounded-2xl border border-slate-150 space-y-2">
                  <span className="text-[9px] text-red-650 font-black tracking-widest block uppercase">JEDDAH JED4 FULFILLMENT</span>
                  <h4 className="font-black text-slate-900">{language === 'en' ? 'AMAZON JED4 FC CENTRAL HVAC' : 'أصناف التبريد الكبرى بمقر مستودعات أمازون جدي ٤'}</h4>
                  <p className="text-slate-500 text-[10.5px] leading-relaxed">
                    {language === 'en' ? 'Acted as the mechanical subcontractor rigging advanced HVAC ventilation and thermal controls across the fulfillment structures.' : 'تنفيذ أعمال تصفية الهواء المركزي وتشغيل أجهزة التدوير وشفط الرطوبة والضغط داخل مجمعات مخابئ توزيع شحنات أمازون بجدة.'}
                  </p>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-slate-150 space-y-2">
                  <span className="text-[9px] text-blue-600 font-black tracking-widest block uppercase">MAERSK LOGISTIC PARK</span>
                  <h4 className="font-black text-slate-900">{language === 'en' ? 'MAERSK TRANSIT ZONE MECHANICAL DEPT' : 'أعمال مكافحة المخاطر والتمديد بمجمع ميرسك'}</h4>
                  <p className="text-slate-500 text-[10.5px] leading-relaxed">
                    {language === 'en' ? 'Supervised duct engineering and custom heavy air conduits, ensuring flawless regulatory compliance with international standards.' : 'تمديدات خطوط الأنابيب الفولاذية المعلقة، وتجهيز وصناعة مجاري الهواء وتدفق التهوية بموقع مستودعات ميرسك للنقل اللوجستي بموانئ جدة الإسلامية.'}
                  </p>
                </div>

              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 4: OFFICIAL DOCUMENTS AND COMPLIANCE CERTIFICATES (المستندات والشهادات الرسمية) */}
        {activeTab === 'documents' && (
          <motion.div
            key="documents"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="max-w-xl">
              <span className="text-[10px] font-black text-red-650 uppercase tracking-wider block">{language === 'en' ? 'PAGES 25-29' : 'تفاصيل وفحوصات البيانات الرسمية والتعاقدات'}</span>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight mt-1">{language === 'en' ? 'Official Tax, Municipal & National Registries' : 'الهوية الضريبية والسجل التجاري الوطني المسجل'}</h2>
              <p className="text-slate-500 text-xs mt-1.5 font-semibold">
                {language === 'en' ? 'Verifiable registration numbers and parameters according to Saudi regulatory codes.' : 'الوثائق القانونية الموثقة لشركة جي سي سي للمقاولات التي تثبت الأمانة المالية والتراخيص المطابقة.'}
              </p>
            </div>

            {/* Document display cards mimicking page 25 & 26 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start font-sans">
              
              {/* VAT Registration simulated */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-[9px] font-black text-emerald-600 block uppercase tracking-widest">ZATCA SAUDI CERTIFIED</span>
                  <span className="text-[10px] text-slate-400 font-mono">FORM: VAT-111-KSA</span>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="text-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100 relative overflow-hidden">
                    <span className="text-[9px] text-slate-400 block font-bold">TAX REGISTRATION NUMBER / الرقم الضريبي الإلكتروني</span>
                    <span className="text-xl font-mono font-black text-slate-950 mt-1 block tracking-wider select-all">312596124700003</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pb-2 border-b border-slate-50">
                    <div>
                      <span className="text-slate-400 block font-bold">{language === 'en' ? 'Taxpayer Name' : 'اسم المكلف المسجل'}</span>
                      <span className="font-extrabold text-slate-800 block mt-0.5">{language === 'en' ? 'GCC COMPANY CONTRACTING' : 'شركة جي سي سي للمقاولات'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">{language === 'en' ? 'Effective Date' : 'تاريخ نفاذ التسجيل'}</span>
                      <span className="font-mono text-slate-800 block mt-0.5">2024/11/01</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 block font-bold">{language === 'en' ? 'ZATCA Tax Period' : 'الفترة الضريبية'}</span>
                      <span className="font-extrabold text-slate-800 block mt-0.5">{language === 'en' ? 'Quarterly (Quarter)' : 'ربع سنوي - الربع المالي'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">{language === 'en' ? 'Registered Office' : 'العنوان الجغرافي المسجل'}</span>
                      <span className="text-slate-800 block mt-0.5 font-bold truncate select-all">{language === 'en' ? 'Khamis Mushayt, حي المعارض' : 'خميس مشيط، حي المعارض، المملكة العربية السعودية'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 text-emerald-800 border border-emerald-100/60 p-3 rounded-xl text-[10px] leading-relaxed font-semibold">
                  {language === 'en' ? '✓ Registered with Zakat, Tax and Customs Authority for 15% VAT standard calculations.' : '✓ خاضعة ومعتمدة رسمياً بدفاتر هيئة الزكاة والضريبة والجمارك لضمان صحة المعاملات المالية الموحدة.'}
                </div>
              </div>

              {/* ISO 9001:2015 Registration Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="text-[9px] font-black text-amber-600 block uppercase tracking-widest flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      <span>ISO 9001:2015 REGISTERED</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">IAF CODE: 28</span>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="text-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100 relative overflow-hidden">
                      <span className="text-[9px] text-slate-400 block font-bold">CERTIFICATE NUMBER / رقم شهادة الآيزو</span>
                      <span className="text-xl font-mono font-black text-amber-600 mt-1 block tracking-wider select-all">181224019645</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pb-2 border-b border-slate-50">
                      <div>
                        <span className="text-slate-400 block font-bold">{language === 'en' ? 'Certified Quality System' : 'نظام الجودة ومجال النشاط'}</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">{language === 'en' ? 'GENERAL CONTRACTING' : 'أعمال المقاولات العامة'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">{language === 'en' ? 'Audit Standard' : 'مواصفة الفحص والتدقيق'}</span>
                        <span className="font-mono text-red-650 font-black block mt-0.5">ISO 9001:2015</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 block font-bold">{language === 'en' ? 'Registration Period' : 'صلاحية ومدة الاعتماد'}</span>
                        <span className="font-extrabold text-slate-850 block mt-0.5">2024/12/18 - 2027/12/17</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">{language === 'en' ? 'Accrediting Forum' : 'المنظمة وجهة الترخيص'}</span>
                        <span className="text-slate-850 block mt-0.5 font-bold truncate select-all">UAF & IAF (ARS Assessment)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 text-amber-900 border border-amber-100/60 p-3 rounded-xl text-[10px] leading-relaxed font-semibold mt-4">
                  {language === 'en' ? '✓ Quality Management System verified via standard registries arscert.com and iafcertsearch.org.' : '✓ مسجلة ومعتمدة رسمياً بموجب معايير تدقيق وتوثيق الجودة الإدارية للمقاولات كود ٢٨.'}
                </div>
              </div>

              {/* Civil Defense (Salamah) Activity License Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="text-[9px] font-black text-emerald-600 block uppercase tracking-widest flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                      <span>CIVIL DEFENSE LICENSED (سلامة)</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">MOI: 7042113659</span>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="text-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100 relative overflow-hidden">
                      <span className="text-[9px] text-slate-400 block font-bold">ACTIVITY LICENSE NUMBER / رقم ترخيص مزاولة النشاط</span>
                      <span className="text-xl font-mono font-black text-emerald-600 mt-1 block tracking-wider select-all">100001126</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pb-2 border-b border-slate-50">
                      <div>
                        <span className="text-slate-400 block font-bold">{language === 'en' ? 'Licensee Name' : 'اسم المنشأة المرخصة'}</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">{language === 'en' ? 'GCC Saudi Contracting' : 'شركة جي سي سي للمقاولات'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">{language === 'en' ? 'Region & City' : 'المنطقة والمدينة المعتمدة'}</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">{language === 'en' ? 'Asir, Khamis Mushayt' : 'منطقة عسير - خميس مشيط'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 block font-bold">{language === 'en' ? 'Validity Period' : 'تاريخ الصلاحية والنهاية'}</span>
                        <span className="font-extrabold text-slate-850 block mt-0.5">2026/05/18 - 2028/05/18</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">{language === 'en' ? 'Issuing Authority' : 'الجهة المصدرة للترخيص'}</span>
                        <span className="text-slate-850 block mt-0.5 font-bold truncate">{language === 'en' ? 'KCD Civil Defense' : 'مديرية الدفاع المدني بعسير'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 text-emerald-950 border border-emerald-100/60 p-3 rounded-xl text-[10px] leading-relaxed font-semibold mt-4">
                  {language === 'en' ? '✓ Digitally verified Salamah safety compliance record. Excempt from handwritten signature.' : '✓ مرخصة رقمياً بالكامل وصادرة بموجب قرار مجلس الوزراء رقم ٨ للتعاملات الإلكترونية.'}
                </div>
              </div>

              {/* Saudi Contractors Authority (SCA) Membership Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="text-[9px] font-black text-teal-600 block uppercase tracking-widest flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-teal-500" />
                      <span>SCA CONTRACTOR MEMBER</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">SCA: 1288128811</span>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="text-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100 relative overflow-hidden">
                      <span className="text-[9px] text-slate-400 block font-bold">MEMBERSHIP NUMBER / رقم عضوية الهيئة السعودية</span>
                      <span className="text-xl font-mono font-black text-teal-600 mt-1 block tracking-wider select-all">1288128811</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pb-2 border-b border-slate-50">
                      <div>
                        <span className="text-slate-400 block font-bold">{language === 'en' ? 'Registrant Entity' : 'المنشأة الهندسية المسجلة'}</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">{language === 'en' ? 'GCC Contracting' : 'شركة جي سي سي للمقاولات'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">{language === 'en' ? 'Validation Link' : 'رابط المطابقة الفورية'}</span>
                        <span className="font-mono text-teal-600 font-black block mt-0.5 select-all">muqawil.org</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 block font-bold">{language === 'en' ? 'Registration Date' : 'تاريخ إصدار العضوية'}</span>
                        <span className="font-extrabold text-slate-850 block mt-0.5">2025/12/18</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">{language === 'en' ? 'End of Membership' : 'تاريخ نهاية العضوية'}</span>
                        <span className="font-mono text-slate-850 font-bold block mt-0.5">2026/12/18</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 text-teal-950 border border-teal-100/60 p-3 rounded-xl text-[10px] leading-relaxed font-semibold mt-4">
                  {language === 'en' ? '✓ Registered with Saudi Contractors Authority (SCA) to construct electro-mechanical networks.' : '✓ مقيد في سجلات عضوية الهيئة السعودية للمقاولين ومصنف للمقاولات العامة.'}
                </div>
              </div>

              {/* National Address Proof simulated */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-[9px] font-black text-rose-650 block uppercase tracking-widest">NATIONAL ADDRESS DATA</span>
                  <span className="text-[10px] text-slate-400 font-mono">GCC-ADDR-2026</span>
                </div>

                <div className="space-y-4 text-xs font-sans">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 block font-bold">{language === 'en' ? 'Building Number' : 'رقم المبنى المسجل'}</span>
                      <span className="font-mono font-black text-slate-950 mt-1 block">7780</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">{language === 'en' ? 'Street Name' : 'اسم الشارع الرئيسي'}</span>
                      <span className="font-extrabold text-slate-850 mt-1 block truncate font-mono">{language === 'en' ? 'King Fahad Road' : 'طريق الملك فهد'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pb-2 border-b border-slate-50">
                    <div>
                      <span className="text-slate-400 block font-bold">{language === 'en' ? 'Postal Code' : 'الرمز البريدي'}</span>
                      <span className="font-mono text-slate-850 font-extrabold mt-1 block">62451</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">{language === 'en' ? 'City / Reg' : 'المدينة والبلدية لخدمة الموقع'}</span>
                      <span className="font-extrabold text-slate-850 mt-1 block">{language === 'en' ? 'Khamis Mushayt' : 'خميس مشيط'}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-bold">{language === 'en' ? 'SBC Building Standard Mapping Code' : 'رمز كود البناء السعودي التأسيسي'}</span>
                    <span className="font-mono font-black text-slate-900 text-[11px] block mt-1">SBC-GCC-XM-62451</span>
                  </div>

                </div>

                <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl text-[10px] leading-relaxed text-slate-500 font-semibold font-sans">
                  {language === 'en' ? '✓ Registered with Saudi Post (SPL). Address holds verifiably stamped verification nodes.' : '✓ وثيقة إثبات الإحداثيات الرسمية المعتمدة لمواقع السهو والسحب الكهروميكانيكي للمنتجات.'}
                </div>
              </div>

            </div>

            {/* Verifiable letters and achievements from page 27 & 28 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm">
              <div>
                <span className="text-[9px] font-black text-red-650 tracking-widest uppercase block">{language === 'en' ? 'COMPLETION LETTERS (PAGES 27-28)' : 'شهادات الشكر المتبادلة بمشاريع المنطقة'}</span>
                <h3 className="text-sm font-black text-slate-950 mt-1">{language === 'en' ? 'Third-Party Verification & Executed Milestones' : 'مشاهد الإنجاز والاعتمادات المحققة في الميدان'}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
                
                <div className="bg-slate-50/50 p-4 border border-slate-200/65 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 text-[10px]">
                    <span className="font-black text-red-650">AHMED ASIRI SAFETY EST.</span>
                    <span className="font-mono text-slate-400">DATE: 2025/04/15</span>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-950">{language === 'en' ? 'Tanumah Hospital Dialysis Center Project' : 'مشهد إنجاز مشروع مركز الغسيل الكلوي بتنومة'}</h4>
                    <p className="text-slate-600 font-medium text-[10.5px] mt-1.5 leading-relaxed text-justify italic">
                      "تشهد مؤسسة أحمد عسيري لأجهزة السلامة بأن شركة جي سي سي للمقاولات قد نفذت أعمال تمديدات وأصناف إطفاء ومكافحة الحريق بمركز الغسيل الكلوي لمستشفى تنومة العام بكامل الدقة والالتزام، ومطابقة للمواصفات وفي الوقت المحدد."
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50/50 p-4 border border-slate-200/65 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 text-[10px]">
                    <span className="font-black text-blue-600">KAK CONTRACTING CO.</span>
                    <span className="font-mono text-slate-400">DATE: 2025/05/25</span>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-950">{language === 'en' ? 'Residential Villas Project Commercial, Jeddah' : 'مشهد إنجاز فلل حي المحمدية في مدينة جدة'}</h4>
                    <p className="text-slate-600 font-medium text-[10.5px] mt-1.5 leading-relaxed text-justify italic">
                      "يسرنا نحن مؤسسة كمال الخطيب للمقاولات (KAK) بأن نتقدم بالشكر الجزيل لشركة جي سي سي للمقاولات على جودة تمديد التكييف المجمّع والأحمال بمشروع الفلل وتوفير هدوء البال بانتظام فائق من تاريخ نوفمبر ٢٠٢٤ إلى أبريل ٢٠٢٥."
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 5: PDF OMNI SLIDER LAYOUT (الأومني سلايدر) */}
        {activeTab === 'slides' && (
          <motion.div
            key="slides"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            
            {/* Upper state tracking header */}
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">
                {language === 'en' ? `SLIDE DECK: ${currentSlide + 1} OF ${slides.length}` : `المقعد المساعد: شريحة ${currentSlide + 1} من أصل ${slides.length}`}
              </span>
              <span 
                onClick={downloadProfilePDF}
                className="text-[9px] bg-red-50 text-red-600 px-2.5 py-1 rounded-xl font-black border border-red-100 hover:bg-red-100 hover:border-red-200 cursor-pointer flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs select-none"
                title={language === 'en' ? 'Download Full PDF Profile Document' : 'تحميل مستند الملف التعريفي كاملاً بصيغة PDF'}
              >
                <Download className="w-3 h-3 text-red-600 animate-bounce" />
                {language === 'en' ? 'DOWNLOAD PDF' : 'تحميل ملف البروفايل PDF'}
              </span>
            </div>

            {/* Slide block display */}
            <div className="relative overflow-hidden shadow-lg shadow-slate-900/10 rounded-2xl transition-all duration-350">
              {slides[currentSlide].content}
            </div>

            {/* Stepper buttons */}
            <div className="flex justify-between items-center gap-4 bg-white p-4.5 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={handlePrevSlide}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-all select-none focus:outline-none flex items-center gap-1.5 font-bold text-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{language === 'en' ? 'Back' : 'السابق'}</span>
              </button>

              <div className="flex gap-1.5 justify-center">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-7 h-2 rounded-full transition-all ${
                      currentSlide === i ? 'bg-red-600 scale-105' : 'bg-slate-200 hover:bg-slate-350'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNextSlide}
                className="p-2.5 bg-red-650 hover:bg-red-700 text-white rounded-xl transition-all select-none focus:outline-none flex items-center gap-1.5 font-bold text-xs"
              >
                <span>{language === 'en' ? 'Next' : 'التالي'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[10.5px] text-slate-400 font-bold text-center leading-relaxed">
              {language === 'en' ? 'This viewer dynamically simplifies pages compiled from the official printed book of GCC CONTRACTING.' : 'يقوم هذا المتصفح التفاعلي بضغط وتلخيص كتاب بروفايل الشركة لتسهيل تتبع المخططات والشهادات الضريبية.'}
            </p>

          </motion.div>
        )}

      </AnimatePresence>


      {/* Lower persistent details (خميس مشيط - طريق الملك فهد - مركز العدوي التجاري) */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block">{language === 'en' ? 'CORPORATE REGIONAL HQ' : 'الفرع الإداري الموحد لخدمات عسير'}</span>
            <h4 className="text-sm font-black text-slate-100 mt-1">{language === 'en' ? 'Khamis Mushayt Commercial Center' : 'خميس مشيط - طريق الملك فهد - مركز العدوي التجاري'}</h4>
          </div>

          <a
            href="mailto:Gcc@gccgr.com"
            className="text-xs font-mono font-black text-red-500 flex items-center gap-1 hover:text-red-400 animate-pulse"
          >
            <Mail className="w-4 h-4" />
            <span>Gcc@gccgr.com</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400 font-sans">
          <div className="flex gap-3">
            <MapPin className="w-5 h-5 text-red-650 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-slate-200 block">{language === 'en' ? 'Riyadh / Southern Command' : 'فرع خدمات خميس مشيط وأبها'}</span>
              <p className="mt-1 font-semibold leading-relaxed text-slate-600">
                {language === 'en' ? 'King Fahad Road, Al Adawi Plaza, First Floor office.' : 'طريق الملك فهد، مركز العدوي التجاري، المقر الإداري المسجل.'}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Phone className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-slate-200 block">{language === 'en' ? 'Technical Hotline' : 'الاتصال والتنسيق المباشر'}</span>
              <p className="mt-1 font-semibold leading-relaxed font-mono select-all text-emerald-500" dir="ltr" style={{ direction: 'ltr', unicodeBidi: 'bidi-override', display: 'inline-block' }}>
                055 030 7003
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <FileText className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-slate-200 block">{language === 'en' ? 'SBC & civil conforms' : 'شهادات كود البناء السعودي'}</span>
              <p className="mt-1 font-semibold leading-relaxed text-slate-600">
                {language === 'en' ? 'Conforming perfectly with standard NFPA code 1, 13, 72 and SBC rules.' : 'المواد والشبكات تلتزم وتطابق اشتراطات الأكواد الوطنية ولائحة السلامة الإقليمية.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PROFESSIONAL HIGH-END LIGHTBOX MODALS */}
      <AnimatePresence>
        {openedModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setOpenedModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 220 } }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[580px] text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setOpenedModal(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-slate-850 hover:bg-slate-800 border border-slate-700/60 rounded-full text-slate-300 hover:text-white transition-all cursor-pointer backdrop-blur-sm shadow-md"
                aria-label="Close"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {openedModal === 'cover' ? (
                <>
                  {/* Left Column: Artistic blueprint engineering decoration */}
                  <div className="w-full md:w-5/12 bg-slate-950 p-8 flex flex-col justify-between relative overflow-hidden h-1/2 md:h-full border-b md:border-b-0 md:border-r border-slate-800">
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                      {/* Blueprint grid lines representation */}
                      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(239, 68, 68, 0.1) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                      <div className="absolute top-1/4 left-1/4 w-40 h-40 border-t border-l border-red-500/20 rounded-tl-3xl animate-pulse" />
                      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 border-b border-r border-red-500/20" />
                    </div>

                    <div className="z-10 flex justify-between items-start">
                      <span className="text-[10px] font-black text-red-550 uppercase tracking-widest font-mono">
                        OFFICIAL DOCUMENT • GCC
                      </span>
                    </div>

                    {/* Isometric outline shape drawing */}
                    <div className="my-auto z-10 flex justify-center opacity-80 scale-105">
                      <div className="relative w-44 h-44 border border-dashed border-slate-800 rounded-full flex items-center justify-center p-6 bg-slate-950/40">
                        <div className="absolute inset-0 rounded-full border border-red-500/20 animate-pulse" />
                        <svg viewBox="0 0 100 100" fill="none" className="w-28 h-28 stroke-slate-400 stroke-[0.5] tracking-widest leading-none">
                          <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" className="stroke-slate-700 fill-none" />
                          <polygon points="50,23 75,37 75,63 50,77 25,63 25,37" className="stroke-red-500/30 fill-none" />
                          <path d="M50,10 L50,90 M15,30 L85,70 M15,70 L85,30" className="stroke-slate-800" />
                          <circle cx="50" cy="50" r="12" className="stroke-red-500/50 fill-slate-900" />
                        </svg>
                      </div>
                    </div>

                    <div className="z-10 text-[9.5px] font-mono text-slate-500 leading-normal">
                      SAUDI BUILDING CODE (SBC) COMPLIANT • DEFENSE REGISTERED ID 7042113659
                    </div>
                  </div>

                  {/* Right Column: Beautiful book cover layout */}
                  <div className="w-full md:w-7/12 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-12 flex flex-col justify-between h-1/2 md:h-full relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-650/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-650 animate-pulse" />
                        <span className="text-[10px] sm:text-xs font-black tracking-widest text-red-500 font-mono uppercase">
                          {language === 'en' ? 'BROCHURE • PAGE 1' : 'بروفايل الشركة • الغلاف الرئيسي'}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <span className="block font-black text-rose-500 font-mono text-[11px] uppercase tracking-wider">
                          {language === 'en' ? 'GCC COMPANY FOR CONTRACTING' : 'شركة جي سي سي للمقاولات العامة'}
                        </span>
                        <h1 className="text-3.5xl sm:text-4.5xl font-black text-white leading-tight uppercase font-sans tracking-tight">
                          COMPANY <br/>
                          <span className="text-red-500">PROFILE</span>
                        </h1>
                        <div className="w-20 h-1 bg-red-650 rounded-full" />
                        <p className="text-xs sm:text-sm text-slate-300 leading-normal text-justify">
                          {language === 'en'
                            ? 'The official corporate execution book. Highlights electromechanical designs, mechanical refrigeration air ducting, safety engineering codes and verifiable infrastructure projects.'
                            : 'المستند الفني المعتمد والموثق لشركة جي سي سي للمقاولات العامة والأعمال الكهروميكانيكية المتكاملة، المصمم خصيصاً لمطابقة لوائح ومعايير السلامة والأكواد الإنشائية.'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Sub-details */}
                      <div className="grid grid-cols-2 gap-4 text-[10px] font-sans border-t border-slate-800/80 pt-4">
                        <div>
                          <span className="text-slate-500 font-bold block">{language === 'en' ? 'CR NUMBER' : 'رقم السجل التجاري'}</span>
                          <span className="font-mono text-slate-300 block font-bold">5855377113</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold block">{language === 'en' ? 'VAT ZATCA ID' : 'الرقم الضريبي الموحد'}</span>
                          <span className="font-mono text-slate-300 block font-bold">312596124700003</span>
                        </div>
                      </div>

                      {/* Download PDF button */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => {
                            downloadProfilePDF();
                            setOpenedModal(null);
                          }}
                          className="px-6 py-3 bg-red-650 hover:bg-red-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 tracking-wide transition-all active:scale-[0.98] cursor-pointer shadow-md shadow-red-950/20 shrink-0"
                        >
                          <Download className="w-4 h-4 animate-bounce" />
                          <span>{language === 'en' ? 'DOWNLOAD PDF FILE' : 'تحميل مستند البروفايل PDF'}</span>
                        </button>
                        <button
                          onClick={() => setOpenedModal(null)}
                          className="px-5 py-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          {language === 'en' ? 'Close Preview' : 'إغلاق المعاينة'}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Left Column: About Us visual layout with high-rise golden frame */}
                  <div className="w-full md:w-5/12 bg-slate-950 p-8 flex flex-col justify-between relative overflow-hidden h-1/2 md:h-full border-b md:border-b-0 md:border-r border-slate-800">
                    {/* Glowing yellow background light */}
                    <div className="absolute top-1/4 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="z-10 flex justify-between items-start">
                      <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest font-mono">
                        PAGE 3 • ABOUT US
                      </span>
                      <span className="font-serif font-black text-6xl text-slate-800/50 leading-none">03</span>
                    </div>

                    {/* Highly-styled abstract high-rise layout representing GCC infrastructure */}
                    <div className="my-auto z-10 space-y-3.5 pl-4 relative">
                      <div className="h-28 w-24 border-r-2 border-t-2 border-amber-500/30 rounded-tr-3xl relative p-4 flex flex-col justify-end">
                        <div className="absolute -left-3 top-6 w-16 h-0.5 bg-slate-800" />
                        <div className="absolute left-6 -bottom-3 w-0.5 h-12 bg-slate-850" />
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-0 right-0 animate-ping" />
                        
                        <div className="space-y-1.5 font-sans">
                          <div className="h-1 w-10 bg-slate-600 rounded" />
                          <div className="h-1.5 w-14 bg-amber-500/70 rounded" />
                          <div className="h-1 w-8 bg-slate-700 rounded" />
                        </div>
                      </div>
                      <p className="text-[10.5px] text-slate-400 font-semibold italic max-w-[190px] leading-relaxed">
                        {language === 'en'
                          ? '"Delivering unparalleled excellence across complex industries."'
                          : '"تقديم باقة استثنائية من الخدمات الهندسية تمنح هدوء البال لملاك البنى التحتية."'
                        }
                      </p>
                    </div>

                    <div className="z-10 text-[9px] font-mono text-slate-500">
                      REGISTERED IN MINISTRIES PORTAL • ARS CERTIFIED ISO 9001:2015
                    </div>
                  </div>

                  {/* Right Column: Editorial story text */}
                  <div className="w-full md:w-7/12 bg-slate-900 p-8 sm:p-12 flex flex-col justify-between h-1/2 md:h-full relative overflow-y-auto">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[10px] sm:text-xs font-black tracking-widest text-amber-500 font-mono uppercase">
                          {language === 'en' ? 'BROCHURE • PAGE 3' : 'بروفايل الشركة • قصة التميز'}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-2.5xl font-black text-white leading-tight">
                          {language === 'en' ? 'Company Overview' : 'مَن نَحْنُ • قِصّةُ رِيَادَتِنَا'}
                        </h2>
                        <div className="w-12 h-1 bg-amber-500 rounded" />
                        
                        {/* Beautifully columned book typesetting */}
                        <div className="text-xs sm:text-[13px] text-slate-300 leading-relaxed space-y-4 text-justify font-sans">
                          <p>
                            {language === 'en' ? (
                              <span>
                                <strong className="text-amber-500 text-lg float-left mr-2 font-serif font-black leading-none mt-0.5">G</strong>
                                CC Contracting represents a dynamic first-class electromechanical force, specializing in robust architectural HVAC controls, addressable fire alarm grids, and civil transport roadwork. By prioritizing the regulations of SBC (Saudi Building Code), we deliver lasting solutions that fully protect lives and build secure structural assets.
                              </span>
                            ) : (
                              <span>
                                <strong className="text-amber-500 text-2xl float-right ml-2 font-serif font-black leading-none mt-1">تُ</strong>
                                عتبر شركة جي سي سي (GCC) للمقاولات من الكيانات الهندسية المرموقة وذات الرؤية المستقبلية الواعدة، حيث أخذنا على عاتقنا تقديم مستوى لا مثيل له من التميز عبر باقة متكاملة من الأعمال الإنشائية والكهروميكانيكية. نجحنا في ترسيخ مكانتنا كشريك استراتيجي رائد يمنح أصحاب المشاريع التجارية والصناعية والتطويرية هدوء البال بفضل تماشينا المطلق مع لوائح كود البناء السعودي ومعايير الدفاع المدني.
                              </span>
                            )}
                          </p>
                          <p>
                            {language === 'en'
                              ? 'Through active partnerships and highly credentialed logistics teams, we conform with standard codes NFPA 1, 13, and 72, assuring maximum safety across Khamis Mushayt, Abha, Riyadh, and Jeddah.'
                              : 'نتميز بفريق هندسي كهروميكانيكي يمتلك فهماً عميقاً لأعمال مكافحة الحريق والإنذار المعنون، بجانب تمديدات مجاري التكييف المركزي العملاقة وسحب الأدخنة. تمتد تغطيتنا التشغيلية لتشمل المشاريع الحيوية في كود البناء السعودي (SBC) وتجهيز السبل الوقائية بمناطق عسير وجدة والرياض.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-800 pt-5 mt-6 flex justify-between items-center text-[10px] text-slate-400">
                      <span className="font-mono">GCC ARCHIVAL BOOK • REGISTERED</span>
                      <button
                        onClick={() => setOpenedModal(null)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white font-bold rounded-lg transition-all cursor-pointer"
                      >
                        {language === 'en' ? 'Close' : 'إغلاق'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default About;
