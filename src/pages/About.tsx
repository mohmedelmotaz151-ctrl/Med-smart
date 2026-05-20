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
        <div className="bg-slate-900 text-white rounded-2xl p-8 flex flex-col justify-between h-96 relative overflow-hidden border border-slate-800 text-center items-center justify-center space-y-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-650/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl -ml-24 -mb-24" />
          
          <div className="z-10 bg-red-650 text-white font-black text-[10px] tracking-widest px-3 py-1 rounded-full uppercase border border-red-500/30">
            {language === 'en' ? 'OFFICIAL PRESENTATION' : 'الوثيقة التقديمية الرسمية'}
          </div>

          <div className="space-y-3 z-10 max-w-md mx-auto">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white uppercase font-sans">
              COMPANY PROFILE
            </h1>
            <div className="w-16 h-1 bg-red-600 mx-auto rounded-full" />
            <p className="text-sm font-extrabold text-slate-300">
              {language === 'en' ? 'GCC Company for Contracting' : 'شركة جي سي سي للمقاولات العامة'}
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {language === 'en' ? 'HVAC • FIRE SUPPRESSION • ELECTROMECHANICAL • CIVIL' : 'أنظمة التكييف • مكافحة الحرائق • الكهروميكانيك • الخدمات المدنية'}
            </p>
          </div>

          <div className="z-10 text-[10px] text-slate-500 font-mono">
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
            <span className="text-[9px] font-black text-red-600 uppercase tracking-wider block mb-1">
              {language === 'en' ? 'PDF OUTLINE' : 'فهرس المحتويات التنظيمي'}
            </span>
            <h3 className="text-lg font-black text-slate-950">
              {language === 'en' ? 'Table of Contents (الفهرس)' : 'أبواب بروفايل الشركة المعتمد'}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 my-auto text-xs font-sans">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="font-extrabold text-slate-700">1. من نحن / Overview</span>
              <span className="font-mono text-red-650 font-black">صفحة ٣</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="font-extrabold text-slate-700">2. الرؤية والرسالة / Vision</span>
              <span className="font-mono text-red-650 font-black">صفحة ٤</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="font-extrabold text-slate-700">3. خدماتنا / Services</span>
              <span className="font-mono text-red-650 font-black">صفحة ٥</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="font-extrabold text-slate-700">4. المشاريع المنفذة / Portfolio</span>
              <span className="font-mono text-red-650 font-black">صفحة ٩</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="font-extrabold text-slate-700">5. ما يميزنا / Distinct Edge</span>
              <span className="font-mono text-red-650 font-black">صفحة ١١</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="font-extrabold text-slate-700">6. المستندات الرسمية / Docs</span>
              <span className="font-mono text-red-650 font-black">صفحة ٢٥</span>
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
        <div className="bg-white text-slate-800 rounded-2xl p-6 sm:p-8 h-96 flex flex-col justify-between border border-slate-200 overflow-y-auto">
          <div>
            <span className="text-[9px] font-black text-red-600 block uppercase tracking-wider mb-0.5">PAGE 3 • COMPANY OVERVIEW</span>
            <h3 className="text-base font-black text-slate-900">{language === 'en' ? 'Introduction Summary' : 'قصة تأسيس شركة GCC للمقاولات'}</h3>
          </div>

          <div className="space-y-3 font-sans my-auto py-2">
            <p className="text-[11px] leading-relaxed text-slate-700 text-justify">
              <strong>AR:</strong> تُعد شركة جي سي سي للمقاولات شركة ذات رؤية مستقبلية تسعى إلى تقديم مستوى لا مثيل له من التميز عبر مجموعة واسعة من خدمات المقاولات. استطاعت الشركة أن ترسخ مكانتها كشريك موثوق يعتمد عليه في مختلف القطاعات مدفوعة بالتزامها بالجودة العالية والابتكار ورضا العملاء.
            </p>
            <p className="text-[11.5px] leading-relaxed text-slate-600 text-justify italic">
              <strong>EN:</strong> GCC Company for Contracting is a dynamic and forward-thinking company dedicated to delivering unparalleled excellence across a wide spectrum of contracting services. Driven by a commitment to high quality, groundbreaking innovation, and profound client satisfaction.
            </p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl text-[9.5px] text-slate-500 font-semibold border border-slate-100/80 leading-tight">
            {language === 'en' ? '• 100% compliant with Zakat, ZATCA VAT standards & Municipal rules.' : '• ملتزمون بقواعد كود البناء ولائحة السلامة، وتصنيف الهيئة السعودية للمقاولين.'}
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
                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest block">{language === 'en' ? 'PAGE 3 SUMMARY' : 'ملخص الصفحة الثالثة للبروفايل'}</span>
                
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
              <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-80 relative overflow-hidden border border-slate-850">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-650/15 rounded-full blur-2xl" />
                
                <span className="bg-slate-800 text-slate-350 border border-slate-700 text-[8.5px] px-2 py-0.5 rounded uppercase self-start leading-none font-mono">
                  GCC COVER PG.1
                </span>

                <div className="space-y-2">
                  <h3 className="text-xl font-black tracking-tight uppercase leading-tight font-sans text-white">
                    COMPANY PROFILE
                  </h3>
                  <div className="w-10 h-1 bg-red-600 rounded" />
                  <p className="text-[10.5px] text-slate-350 leading-relaxed font-semibold">
                    {language === 'en' ? 'Official book of execution, civil capabilities, and regulatory approvals.' : 'بروفايل معتمد بمكاتب الدفاع المدني للمقايسات والمقاولات.'}
                  </p>
                </div>

                <div className="text-[9px] text-slate-400 font-mono tracking-tighter">
                  ESTABLISHED REGISTERED TRADEMARK
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
                {tocItems.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex flex-col justify-between hover:border-slate-350 transition-all">
                    <div>
                      <span className="font-mono text-[9px] text-red-600 font-black block">PAGE {item.page}</span>
                      <h4 className="text-xs font-black text-slate-900 mt-1 leading-snug">
                        {language === 'en' ? item.titleEn : item.titleAr}
                      </h4>
                    </div>
                  </div>
                ))}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start font-sans">
              
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
              <span className="text-[9px] bg-red-50 text-red-600 px-2 py-0.5 rounded font-black border border-red-100">
                {language === 'en' ? 'HIGH INTENSITY VIEW' : 'عرض الشرائح التفاعلي للمستند المرفق'}
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
            href="mailto:Gcc@gccgr.com animate-pulse"
            className="text-xs font-mono font-black text-red-500 flex items-center gap-1 hover:text-red-400"
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

    </div>
  );
};

export default About;
