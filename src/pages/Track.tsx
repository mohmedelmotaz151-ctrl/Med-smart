import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { 
  Search, 
  FileText, 
  CheckCircle, 
  Clock, 
  Loader2, 
  MapPin, 
  Building, 
  Phone, 
  ArrowLeft,
  Calendar,
  ShieldCheck,
  FileDown,
  AlertCircle,
  TrendingUp,
  Flame,
  Bell,
  Zap,
  Snowflake,
  Video,
  Printer,
  ChevronDown,
  MessageSquare,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'react-router-dom';

interface InquiryData {
  id?: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  serviceType: string;
  projectType: string;
  projectArea: string;
  location: string;
  message: string;
  ticketId: string;
  status: 'received' | 'review' | 'pricing' | 'proposal' | 'executing' | 'completed' | 'new' | 'under_review' | 'priced';
  createdAt: string;
  uploadedFiles?: string[];
  engineerName?: string;
  inspectionDate?: string;
  attachedPdfUrl?: string;
  customStatusNotes?: string;
  priceDetails?: {
    componentsCost: number;
    laborFee: number;
    complianceFee: number;
    discountPercent: number;
    totalAmount: number;
    comments?: string;
  };
}

const getNormalizedStatus = (status: string): 'received' | 'review' | 'pricing' | 'proposal' | 'executing' | 'completed' => {
  if (status === 'new') return 'received';
  if (status === 'under_review') return 'review';
  if (status === 'priced') return 'proposal';
  return (status as any) || 'received';
};

const Track: React.FC = () => {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTicket = searchParams.get('id') || '';
  const initialContact = searchParams.get('contact') || '';

  const [searchQuery, setSearchQuery] = useState(initialTicket);
  const [contactQuery, setContactQuery] = useState(initialContact);
  const [searching, setSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [ticketData, setTicketData] = useState<InquiryData | null>(null);
  const [showInvoiceMock, setShowInvoiceMock] = useState(false);

  // Direct Interactive Tech Support Discussion states
  const [chatMessages, setChatMessages] = useState<{ sender: 'client' | 'engineer'; text: string; time: string }[]>([
    { sender: 'engineer', text: 'مرحباً بك! أنا المهندس فهد المسؤول عن دراسة هذا الطلب كهروميكانيكياً. كيف يمكنني مساعدتكم اليوم بخصوص تفاصيل جدول الأصناف أو معاينة الموقع؟', time: '10:15 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatTyping, setChatTyping] = useState(false);

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { 
      sender: 'client' as const, 
      text: chatInput, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setChatMessages(prev => [...prev, userMsg]);
    const clientQuery = chatInput;
    setChatInput('');
    setChatTyping(true);

    setTimeout(() => {
      let reply = 'شكراً لرسالتكم. تم توجيه الملاحظة إلى فرع التصميم الهندسي لمطابقتها فورياً.';
      const lq = clientQuery.toLowerCase();
      if (lq.includes('piping') || lq.includes('مواسير') || lq.includes('أنابيب') || lq.includes('انابيب')) {
        reply = 'نستخدم الأنابيب والجدار النحاسي السميك الخاضع لكود السلامة السعودي Sch 40، وهو يقاوم الضغوط والأحمال العالية بكفاءة دائمة.';
      } else if (lq.includes('price') || lq.includes('سعر') || lq.includes('discount') || lq.includes('خصم') || lq.includes('تكلف')) {
        reply = 'تم احتساب الكلفة وفقاً لأعلى مستويات جودة التوريدات. سنقوم بدراسة إمكانية عمل حسم إضافي مع المحاسب المالي فور جلب المخططات النهائية.';
      } else if (lq.includes('visit') || lq.includes('زيارة') || lq.includes('معاينة') || lq.includes('وقت') || lq.includes('متى')) {
        reply = 'سيقوم طاقم المعاينة بالتنسيق هاتفياً قبل موعد الموقع بـ ٣٠ دقيقة لتسهيل دخول المهندسين وبدء الفحوصات.';
      }

      setChatMessages(prev => [...prev, {
        sender: 'engineer',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setChatTyping(false);
    }, 1200);
  };

  // Auto-search if ticket id passed in URL parameters
  useEffect(() => {
    if (initialTicket) {
      handleSearch(initialTicket, initialContact);
    }
  }, [initialTicket, initialContact]);

  const handleSearch = async (targetId: string, contactVal: string) => {
    const cleanId = targetId.trim().toUpperCase();
    const cleanContact = contactVal.trim().toLowerCase();
    if (!cleanId) return;

    setSearching(true);
    setErrorMsg('');
    setTicketData(null);

    try {
      let candidate: InquiryData | null = null;

      // 1. Try querying remote Firestore
      const q = query(collection(db, 'inquiries'), where('ticketId', '==', cleanId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        candidate = docSnap.data() as InquiryData;
      } else {
        // 2. Hybrid fallback: Try checking localStorage
        const localInquiries: InquiryData[] = JSON.parse(localStorage.getItem('gcc_inquiries') || '[]');
        const foundLocal = localInquiries.find(inq => inq.ticketId.toUpperCase() === cleanId);
        if (foundLocal) {
          candidate = foundLocal;
        }
      }

      if (candidate) {
        // Security checks: Validate against phone or email if provided
        if (cleanContact) {
          const matchedPhone = candidate.phone.replace(/[^0-9]/g, '').endsWith(cleanContact.replace(/[^0-9]/g, '')) || candidate.phone.includes(cleanContact);
          const matchedEmail = candidate.email.toLowerCase().includes(cleanContact);
          
          if (!matchedPhone && !matchedEmail) {
            setErrorMsg(
              language === 'en'
                ? "Verification failed. The contact details do not match this Ticket ID."
                : "رمز التتبع غير متطابق مع رقم الجوال أو البريد الإلكتروني المدخل للتحقق."
            );
            setSearching(false);
            return;
          }
        }
        setTicketData(candidate);
      } else {
        setErrorMsg(
          language === 'en' 
            ? 'No quotation request found with this Ticket ID. Please double check the code.' 
            : 'لم يتم العثور على أي طلب عرض سعر بهذا الرقم. يرجى التحقق وإعادة المحاولة.'
        );
      }
    } catch (err) {
      console.error("Tracking lookup error. Searching local cache...", err);
      // Fallback to local storage check directly
      const localInquiries: InquiryData[] = JSON.parse(localStorage.getItem('gcc_inquiries') || '[]');
      const foundIdx = localInquiries.find(inq => inq.ticketId.toUpperCase() === cleanId);

      if (foundIdx) {
        if (cleanContact) {
          const matchedPhone = foundIdx.phone.includes(cleanContact);
          const matchedEmail = foundIdx.email.toLowerCase().includes(cleanContact);
          if (!matchedPhone && !matchedEmail) {
            setErrorMsg(
              language === 'en'
                ? "Verification failed. The contact details do not match this Ticket ID."
                : "رمز التتبع غير متطابق مع رقم الجوال أو البريد الإلكتروني المدخل للتحقق."
            );
            setSearching(false);
            return;
          }
        }
        setTicketData(foundIdx);
      } else {
        setErrorMsg(
          language === 'en' 
            ? 'Quotation not found. Please verify the code.' 
            : 'لم نجد طلباً مسجلاً بهذا الرمز. الرجاء التأكد من صحة رقم التتبع.'
        );
      }
    } finally {
      setSearching(false);
    }
  };

  const executeSearchForm = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ id: searchQuery.trim().toUpperCase(), contact: contactQuery.trim() });
    handleSearch(searchQuery, contactQuery);
  };

  // Status mapping and indexing for the 6 professional stages
  const statusConfig = {
    received: {
      index: 0,
      labelAr: 'تم استلام الطلب',
      labelEn: 'Order Received',
      color: 'bg-slate-100 text-slate-850 border-slate-300',
      descAr: 'تم تسجيل طلبك بنجاح في نظام المتابعة الفوري وجاري البدء في دراسة ومطابقة متطلبات الكهروميكانيك للبدء الفوري.',
      descEn: 'Ticket received and registered successfully. Sizing blueprints are prepared for engineers review.'
    },
    review: {
      index: 1,
      labelAr: 'جاري المراجعة',
      labelEn: 'In Review',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      descAr: 'فريق الهندسة والمخططات يطابق متطلبات الأحلال ويراجع النماذج ومطابقتها بكود البناء السعودي وكود السلامة.',
      descEn: 'Our technical engineering team is currently assessing requirements and building codes.'
    },
    pricing: {
      index: 2,
      labelAr: 'جاري التسعير',
      labelEn: 'Under Pricing',
      color: 'bg-amber-50 text-amber-850 border-amber-200',
      descAr: 'يتم احتساب كميات المواد وعزل المكائن والمدخلات الفنية لصياغة كشف المقايسة بأسعار مخفضة وتنافسية.',
      descEn: 'Accounting division is actively calculating system pricing options and labor metrics.'
    },
    proposal: {
      index: 3,
      labelAr: 'تم إصدار العرض',
      labelEn: 'Proposal Issued',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      descAr: 'العرض الفني جاهز تماماً للتحميل والمعاينة المالية المعتمدة بالبلدية والدفاع المدني، قم بتنزيله بالزر بالأسفل.',
      descEn: 'Quotation and detailed engineering bill of quantities is now released for approval and download.'
    },
    executing: {
      index: 4,
      labelAr: 'جاري التنفيذ',
      labelEn: 'In Progress',
      color: 'bg-teal-50 text-teal-800 border-teal-200',
      descAr: 'بدأ تنفيذ المشروع، باشرت طواقم السلامة والتأسيس بالميدان وأعمال التمرير والدكت والأنابيب مستمرة بنشاط.',
      descEn: 'Project execution and site installation have officially begun. Teams are on the premise.'
    },
    completed: {
      index: 5,
      labelAr: 'مكتمل',
      labelEn: 'Completed',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      descAr: 'تم إنهاء جميع التركيبات وتشغيل الأنظمة وإصدار شهادة هندسية معتمدة بالدفاع المدني. تم تسليم الموقع بنجاح.',
      descEn: 'All systems successfully installed, tested, and certified for official municipal operation.'
    }
  };

  const getServiceLabel = (serviceType: string) => {
    const map: Record<string, { ar: string; en: string; icon: any }> = {
      fire_suppression: { ar: 'أنظمة إطفاء الحرائق والانفجارات', en: 'Fire Suppression & Suppression', icon: <Flame className="w-4 h-4 text-red-500" /> },
      fire_alarm: { ar: 'إنذار مبكر ومسارات توجيه', en: 'Intelligent Fire Alarm Systems', icon: <Bell className="w-4 h-4 text-amber-500" /> },
      power: { ar: 'مولدات كهربائية وهندسة طاقة', en: 'Industrial Heavy Diesel Generators', icon: <Zap className="w-4 h-4 text-yellow-500" /> },
      hvac: { ar: 'تكييف مركزي وأنظمة تهوية ومسارات دكت', en: 'HVAC Central Chilled Aircon & Ducts', icon: <Snowflake className="w-4 h-4 text-blue-500" /> },
      cctv: { ar: 'كاميرات المراقبة الرقمية وكاميرات الأمان', en: 'CCTV Security IP Camera Networks', icon: <Video className="w-4 h-4 text-emerald-500" /> }
    };
    return map[serviceType] || { ar: 'مقاولة هندسية', en: 'General MEP Contract', icon: <FileText className="w-4 h-4" /> };
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadPDFMock = () => {
    // Elegant animation helper then browser download simulation
    const link = document.createElement('a');
    link.href = '#';
    alert(
      language === 'en' 
        ? "Dynamic technical PDF report compiled and saved successfully!" 
        : "تم صياغة وطرح الملف المحاسبي الموحد وتصديره بصيغة PDF بنجاح!"
    );
  };

  const textDict = {
    title: language === 'en' ? 'Track Quotation Proposal' : 'متابعة حالة طلب عرض السعر',
    subtitle: language === 'en' ? 'Track, review, and evaluate your civil estimate requests in real-time.' : 'أدخل رقم الطلب وبطاقة التتبع لمشاهدة نتائج الفحص وتفاصيل التكاليف المقررة لمشروعك أولاً بأول.',
    placeholder: language === 'en' ? 'Enter Ticket ID (e.g., GCC-2026-1052)' : 'أدخل رقم طلب تتبع التسعيرة (مثال: GCC-2026-1052)',
    btnSearch: language === 'en' ? 'Inquire State' : 'استعلام عن حالة الطلب',
    clientCardTitle: language === 'en' ? 'Project & Client Profile' : 'تفاصيل المنشأة وبيانات العميل',
    statusTimeline: language === 'en' ? 'Proposal SLA Progress Log' : 'سجل تقدم دراسة ومعاينة الطلب',
    costBreakdown: language === 'en' ? 'Electro-Mechanical Cost Estimation' : 'بنود المقايسة ومقدار التكلفة الأولية المقدرة',
    vatNote: language === 'en' ? 'Prices shown are inclusive of all customs, logistics compliance and 15% VAT.' : 'المقادير والأسعار المعلنة نهائية وشاملة لضريبة القيمة المضافة ١٥٪ والرسوم التنظيمية وكود البناء.',
    acceptBtn: language === 'en' ? 'Accept & Secure Order' : 'تعميد وموافقة على المقايسة',
    whatsappBtn: language === 'en' ? 'Direct Technical WhatsApp Support' : 'التنسيق الفني المباشر مع مهندس الحسابات'
  };

  return (
    <div className="space-y-10 pb-16 font-sans">
      
      {/* Search Header Area */}
      <div className="max-w-xl mx-auto text-center space-y-4">
        <div className="inline-block bg-slate-900 text-white rounded-full text-[10px] font-black tracking-widest px-3 py-1 border border-slate-800 uppercase">
          {language === 'en' ? 'GCC DIGITAL PORTAL' : 'بوابة التتبع الرقمية الموحدة'}
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {textDict.title}
        </h1>
        <p className="text-slate-600 text-xs leading-relaxed max-w-sm mx-auto">
          {textDict.subtitle}
        </p>

        {/* Action input bar */}
        <form onSubmit={executeSearchForm} className="space-y-4.5 mt-6 bg-white border border-slate-150 p-6 rounded-3xl shadow-sm text-right">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                {language === 'en' ? 'Order Number / Ticket ID' : 'رقم الطلب / كود التتبع *'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={textDict.placeholder}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-red-500 text-slate-800 rounded-xl px-4 py-3.5 pl-11 text-xs focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all font-sans font-bold text-center tracking-wide"
                  required
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                {language === 'en' ? 'Registered Email or Mobile' : 'البريد الإلكتروني أو رقم الجوال *'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={contactQuery}
                  onChange={(e) => setContactQuery(e.target.value)}
                  placeholder={language === 'en' ? 'e.g. name@example.com or 05xxxxxxxx' : 'البريد أو رقم الجول المسجل بمطابقة الطلب'}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-red-500 text-slate-800 rounded-xl px-4 py-3.5 pl-11 text-xs focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all font-sans font-bold text-center tracking-wide"
                  required
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={searching}
            className="w-full bg-red-650 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            {searching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>{textDict.btnSearch}</span>
              </>
            )}
          </button>
        </form>

        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-700 text-xs p-3.5 rounded-2xl border border-red-100 flex items-center gap-3 justify-center"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {ticketData ? (
          <motion.div 
            key={ticketData.ticketId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto"
          >

            {/* Left Content Area (Columns 8: Process & Pricing) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* 1. Milestone / Timeline Indicator */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    {textDict.statusTimeline}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${statusConfig[getNormalizedStatus(ticketData.status)].color}`}>
                    {language === 'en' ? statusConfig[getNormalizedStatus(ticketData.status)].labelEn : statusConfig[getNormalizedStatus(ticketData.status)].labelAr}
                  </span>
                </div>

                {/* Progress Visual Stepper */}
                <div className="relative pt-4 pb-2">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
                  
                  {/* Highlight bar up to current status */}
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-red-650 -translate-y-1/2 z-0 transition-all duration-700"
                    style={{ 
                      width: `${(statusConfig[getNormalizedStatus(ticketData.status)].index / 5) * 100}%`,
                      right: language === 'ar' ? 'auto' : undefined,
                      left: language === 'en' ? '0' : undefined
                    }}
                  />

                  <div className="relative z-10 flex justify-between">
                    {[
                      { key: 'received', labelAr: 'استلام', labelEn: 'Received' },
                      { key: 'review', labelAr: 'مراجعة', labelEn: 'Review' },
                      { key: 'pricing', labelAr: 'تسعير', labelEn: 'Pricing' },
                      { key: 'proposal', labelAr: 'العرض', labelEn: 'Proposal' },
                      { key: 'executing', labelAr: 'تنفيذ', labelEn: 'Executing' },
                      { key: 'completed', labelAr: 'مكتمل', labelEn: 'Completed' }
                    ].map((step, idx) => {
                      const stepIndex = statusConfig[step.key as any].index;
                      const currentIndex = statusConfig[getNormalizedStatus(ticketData.status)].index;
                      
                      const isCompleted = stepIndex < currentIndex;
                      const isActive = stepIndex === currentIndex;
                      const isPending = stepIndex > currentIndex;

                      return (
                        <div key={step.key} className="flex flex-col items-center">
                          <div 
                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-3 transition-all ${
                              isCompleted 
                                ? 'bg-red-600 text-white border-red-600 shadow' 
                                : isActive 
                                ? 'bg-white text-red-600 border-red-600 ring-4 ring-red-500/10 scale-110' 
                                : 'bg-slate-50 text-slate-355 border-slate-200'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-white" />
                            ) : (
                              <span className="text-[11px] font-black">{idx + 1}</span>
                            )}
                          </div>
                          <span 
                            className={`text-[9.5px] mt-2.5 font-black uppercase tracking-tight ${
                              isActive ? 'text-slate-900 scale-105 font-extrabold' : 'text-slate-400'
                            }`}
                          >
                            {language === 'en' ? step.labelEn : step.labelAr}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stepper detail text block */}
                <div className="bg-slate-50 border border-slate-100/70 p-4 rounded-2xl flex gap-3 text-xs leading-relaxed text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="block font-black text-slate-800">
                      {language === 'en' ? 'Current Activity Status' : 'تفاصيل الإجراء الحالي:'}
                    </span>
                    <p className="mt-1 font-sans">
                      {language === 'en' ? statusConfig[ticketData.status].descEn : statusConfig[ticketData.status].descAr}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Automatic Estimator & Pricing Breakdown (Visible on 'priced' & 'completed') */}
              {['priced', 'completed'].includes(ticketData.status) && ticketData.priceDetails && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm overflow-hidden"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-4.5 h-4.5 text-blue-600" />
                        {textDict.costBreakdown}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold">
                        {language === 'en' ? 'Auto-analyzed Electro-Mechanical quantity summary' : 'مقايسة تسعير كهروميكانيكية وفنية آلية معتمدة مريحة'}
                      </p>
                    </div>

                    <button
                      onClick={() => setShowInvoiceMock(true)}
                      className="text-xs font-black text-red-600 flex items-center gap-1 bg-red-50 hover:bg-red-100 border border-red-100 px-3 py-1.5 rounded-xl transition-all"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Print Proposal PDF' : 'طباعة العرض الفني'}</span>
                    </button>
                  </div>

                  {/* Lines Items Table layout */}
                  <div className="divide-y divide-slate-100 font-sans text-xs">
                    
                    {/* Item 1: Hardware Components */}
                    <div className="py-4 flex justify-between items-center">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-slate-800 block">
                          {language === 'en' ? '1. Hardware Material & Components Cost' : '١. تكلفة التوريدات والمواد الأساسية'}
                        </span>
                        <span className="text-[10px] text-slate-400 block leading-tight">
                          {language === 'en' ? 'Piping, primary controllers, sensors, certified hardware nodes.' : 'أنابيب، مكائن رئيسية، كواشف، مستشعرات، أجهزة موازنة مطابقة للأكواد.'}
                        </span>
                      </div>
                      <div className="font-mono font-black text-slate-900 text-sm">
                        {ticketData.priceDetails.componentsCost.toLocaleString()} {language === 'en' ? 'SAR' : 'ريال'}
                      </div>
                    </div>

                    {/* Item 2: Labor & Engineering Sizing */}
                    <div className="py-4 flex justify-between items-center">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-slate-800 block">
                          {language === 'en' ? '2. Electrical/Mechanical Installation & Labor Fee' : '٢. أجور التأسيس والتركيبات الميكانيكية'}
                        </span>
                        <span className="text-[10px] text-slate-400 block leading-tight">
                          {language === 'en' ? 'Pressure calculations, sizing configurations, mounting, wiring, and testing.' : 'أحمال الضغط، التركيب، سحب الوصلات الكهربائية، وفحص ضغط الشبكات.'}
                        </span>
                      </div>
                      <div className="font-mono font-black text-slate-900 text-sm">
                        {ticketData.priceDetails.laborFee.toLocaleString()} {language === 'en' ? 'SAR' : 'ريال'}
                      </div>
                    </div>

                    {/* Item 3: Safety / Compliance validation */}
                    <div className="py-4 flex justify-between items-center">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-slate-800 block">
                          {language === 'en' ? '3. Civil Defense Code & Compliance Approval Fee' : '٣. رسوم المخططات والشهادات والاعتمادات الرسمية'}
                        </span>
                        <span className="text-[10px] text-slate-400 block leading-tight">
                          {language === 'en' ? 'SLA verification against civil defense system grids, site verification stamp.' : 'فحوصات وربط المخططات ببوابات السلامة بالدفاع المدني لبلدية المنشأة.'}
                        </span>
                      </div>
                      <div className="font-mono font-black text-slate-900 text-sm">
                        {ticketData.priceDetails.complianceFee.toLocaleString()} {language === 'en' ? 'SAR' : 'ريال'}
                      </div>
                    </div>

                    {/* Item 4: Discount Row */}
                    {ticketData.priceDetails.discountPercent > 0 && (
                      <div className="py-4 flex justify-between items-center text-emerald-600 bg-emerald-50/20 px-3 rounded-xl">
                        <span className="font-extrabold flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4" />
                          {language === 'en' ? `Special Customer Discount (${ticketData.priceDetails.discountPercent}%)` : `خصم تفضيلي خاص بالعميل (${ticketData.priceDetails.discountPercent}%)`}
                        </span>
                        <span className="font-mono font-black text-sm">
                          -{((ticketData.priceDetails.componentsCost + ticketData.priceDetails.laborFee + ticketData.priceDetails.complianceFee) * (ticketData.priceDetails.discountPercent / 100)).toLocaleString()} {language === 'en' ? 'SAR' : 'ريال'}
                        </span>
                      </div>
                    )}

                    {/* Grand Total Pricing Block */}
                    <div className="pt-5 pb-2 flex justify-between items-baseline">
                      <span className="text-sm font-black text-slate-950 uppercase tracking-tight">
                        {language === 'en' ? 'Grand Net Total Proposal' : 'إجمالي سعر المقايسة الفعلي نهائي'}
                      </span>
                      <div className="text-right">
                        <div className="font-mono font-black text-red-600 text-2xl">
                          {ticketData.priceDetails.totalAmount.toLocaleString()} {language === 'en' ? 'SAR' : 'ريال'}
                        </div>
                        <span className="text-[9px] text-slate-400 block font-bold leading-none mt-1">
                          {textDict.vatNote}
                        </span>
                      </div>
                    </div>
                  </div>

                  {ticketData.priceDetails.comments && (
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                        {language === 'en' ? 'Engineering Lead Comments' : 'ملاحظات وتوصيات المهندس المسؤول:'}
                      </span>
                      <p className="text-xs text-slate-700 italic mt-1 font-sans leading-relaxed">
                        “{ticketData.priceDetails.comments}”
                      </p>
                    </div>
                  )}

                  {/* Client Accept/Decline Action button row */}
                  <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                    <button
                      onClick={downloadPDFMock}
                      className="flex-1 bg-slate-900 hover:bg-red-650 hover:border-red-650 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md border border-slate-800 flex items-center justify-center gap-1.5"
                    >
                      <FileDown className="w-4.5 h-4.5" />
                      <span>{language === 'en' ? 'Approve & Download PDF' : 'التعميد المباشر وتحميل العرض'}</span>
                    </button>
                    
                    <a
                      href={`https://wa.me/966500000000?text=${encodeURIComponent(
                        `السلام عليكم، بخصوص عرض السعر المالي لطلب كود (${ticketData.ticketId})، أود استكمال التنسيق حول المشروع والجدول الزمني.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{language === 'en' ? 'WhatsApp Support' : 'تنسيق واتساب'}</span>
                    </a>

                    <a
                      href="tel:+966500000000"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-black px-4 py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <Clock className="w-4 h-4" />
                      <span>{language === 'en' ? 'Call Office' : 'اتصال هاتفي'}</span>
                    </a>
                  </div>

                  {/* Interactive Tech Chat Discussion Board */}
                  <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4.5 space-y-3.5 mt-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4.5 h-4.5 text-red-600" />
                        <span className="text-xs font-black text-slate-800">
                          {language === 'en' ? 'Live Engineering Discussion' : 'النقاش والاستفسار الفني المباشر'}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        {language === 'en' ? 'Consultation Active' : 'مستشار فني متصل'}
                      </span>
                    </div>

                    {/* Message Log */}
                    <div className="space-y-3 max-h-56 overflow-y-auto p-1 text-[11px] leading-relaxed flex flex-col">
                      {chatMessages.map((msg, i) => (
                        <div 
                          key={i} 
                          className={`flex flex-col max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                            msg.sender === 'engineer' 
                              ? 'bg-slate-200/70 text-slate-800 self-start mr-auto rounded-tl-none text-right' 
                              : 'bg-red-650 text-white self-end ml-auto rounded-tr-none text-right'
                          }`}
                        >
                          <span className="font-extrabold text-[9.5px] opacity-75 mb-0.5">
                            {msg.sender === 'engineer' ? (language === 'en' ? 'Eng. Fahad (Design Lead)' : 'مهندس فهد (كود السلامة)') : (language === 'en' ? 'You' : 'أنت')}
                          </span>
                          <p className="font-sans leading-relaxed whitespace-pre-line">{msg.text}</p>
                          <span className="text-[8px] opacity-60 mt-1 self-end block leading-none">{msg.time}</span>
                        </div>
                      ))}

                      {chatTyping && (
                        <div className="bg-slate-200/50 text-slate-500 border border-slate-200/30 rounded-2xl px-3.5 py-2.5 self-start mr-auto flex items-center gap-1.5 max-w-[50%]">
                          <Loader2 className="w-3 h-3 animate-spin text-red-600 animate-infinite" />
                          <span className="font-bold text-[10px]">{language === 'en' ? 'Engineer is typing...' : 'يعمل المهندس على الرد...'}</span>
                        </div>
                      )}
                    </div>

                    {/* Message Form input */}
                    <form onSubmit={handleSendChatMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder={language === 'en' ? 'Ask about pipes, costs, inspection...' : 'اسأل بخصوص: الصيانة، المواسير، تكلفة معينة...'}
                        className="flex-1 bg-white border border-slate-200 focus:border-red-500 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-4 focus:ring-red-500/5 transition-all outline-none"
                      />
                      <button
                        type="submit"
                        disabled={chatTyping || !chatInput.trim()}
                        className="bg-red-650 hover:bg-red-700 text-white p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center shrink-0 disabled:opacity-45"
                      >
                        <Send className="w-4 h-4 rotate-180" />
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </div>


            {/* Right Information Column Dashboard (Columns 4: Project and Client Metadata) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm">
                <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider border-b border-slate-800 pb-3 block">
                  {textDict.clientCardTitle}
                </h3>

                <div className="space-y-4 font-sans text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">{language === 'en' ? 'Secure Ticket ID' : 'معرف التتبع الآمن'}</span>
                    <span className="text-sm font-mono font-black text-red-500 block leading-tight mt-1 select-all">{ticketData.ticketId}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">{language === 'en' ? 'Client Full Name' : 'اسم العميل'}</span>
                    <span className="font-extrabold text-slate-200 block mt-1">{ticketData.name}</span>
                  </div>

                  {ticketData.company && (
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">{language === 'en' ? 'Company Name' : 'اسم الشركة'}</span>
                      <span className="font-extrabold text-slate-200 block mt-1">{ticketData.company}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">{language === 'en' ? 'Contact Phone' : 'رقم الاتصال'}</span>
                      <span className="text-slate-200 mt-1 select-all font-mono block tracking-tight">{ticketData.phone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">{language === 'en' ? 'Registration Date' : 'تاريخ التسجيل'}</span>
                      <span className="text-slate-350 block mt-1 font-mono tracking-tighter text-[11px]">
                        {new Date(ticketData.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">{language === 'en' ? 'Required Engineering Service' : 'الخدمة الهندسية المطلوبة'}</span>
                    <div className="flex items-center gap-2 mt-1 px-3 py-2 bg-slate-800 rounded-xl max-w-xs border border-slate-700/50">
                      {getServiceLabel(ticketData.serviceType).icon}
                      <span className="font-black text-slate-200 text-[10px] leading-tight shrink-0 text-ellipsis overflow-hidden">
                        {language === 'en' ? getServiceLabel(ticketData.serviceType).en : getServiceLabel(ticketData.serviceType).ar}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1 border-t border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{language === 'en' ? 'Project Type' : 'طبيعة العقار'}</span>
                      <span className="font-black text-slate-100 block mt-0.5">
                        {ticketData.projectType === 'residential' ? (language === 'en' ? 'Residential' : 'سكني') :
                         ticketData.projectType === 'commercial' ? (language === 'en' ? 'Commercial' : 'تجاري') :
                         (language === 'en' ? 'Industrial' : 'صناعي ولوجستي')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">{language === 'en' ? 'Estimated Area' : 'إجمالي المساحة'}</span>
                      <span className="font-mono font-black text-slate-100 block mt-0.5">{ticketData.projectArea} m² (م٢)</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">{language === 'en' ? 'Site / City' : 'مدينة الموقع'}</span>
                    <span className="font-dark font-extrabold text-slate-200 block mt-0.5">{ticketData.location || 'Riyadh'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{language === 'en' ? 'Assigned Engineer' : 'المهندس المسؤول'}</span>
                      <span className="font-black text-rose-300 block mt-0.5 leading-snug">
                        {ticketData.engineerName || (language === 'en' ? 'Eng. Fahad Al-Nafiei' : 'المهندس فهد النفيعي')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">{language === 'en' ? 'Inspection Date' : 'موعد معاينة الموقع'}</span>
                      <span className="font-mono font-bold text-slate-200 block mt-0.5">
                        {ticketData.inspectionDate || (language === 'en' ? '2026-05-24' : '2026-05-24')}
                      </span>
                    </div>
                  </div>

                  {ticketData.uploadedFiles && ticketData.uploadedFiles.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-400 font-bold block mb-1.5">{language === 'en' ? 'Submitted Blueprints' : 'المخططات الهندسية المرفقة'}</span>
                      <div className="space-y-1">
                        {ticketData.uploadedFiles.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-800/50 border border-slate-850 rounded-lg text-[10px] text-slate-350 truncate block">
                            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate flex-1 font-mono">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Secure verification alert */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl flex gap-3 text-xs text-slate-600">
                <ShieldCheck className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {language === 'en' 
                    ? 'All GCC COMPANY invoices and project drawings are secure and conforming to SASO and NFPA guidelines.' 
                    : 'مقايسات ومواد شركة GCC خاضعة لاعتمادات الدفاع المدني واللجنة السعودية لكود البناء لضمان سرعة تعميد الرخص.'}
                </span>
              </div>
            </div>

          </motion.div>
        ) : (
          /* Searching placeholder layout or generic instruction card */
          <motion.div 
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 shadow-sm"
          >
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-100">
              <Search className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-black text-slate-900">
                {language === 'en' ? 'Awaiting Quote Ticket ID' : 'بانتظار رمز التتبع الآمن'}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                {language === 'en'
                  ? 'Submit your project details via the Contact portal to receive your GCC quote tracking number instantly.'
                  : 'بمجرد تسجيل مخططاتك وبيانات الهاتف في تبويب اتصل بنا / طلب السعر، يتم توليد رقم فوري مثل (GCC-2026-1052) لتتبع خطوات التصميم وحسابات الأحمال والتكلفة أولاً بأول.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RENDER MODAL/Invoice Simulator Mockup on click */}
      <AnimatePresence>
        {showInvoiceMock && ticketData && ticketData.priceDetails && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-100 overflow-y-auto"
            onClick={() => setShowInvoiceMock(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border text-slate-800 border-slate-300 w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 relative flex flex-col my-8 print:p-0 print:shadow-none print:border-none print:my-0"
              id="printed-invoice"
            >
              <div className="flex justify-between items-start border-b border-dashed border-slate-200 pb-5">
                <div>
                  <h2 className="text-lg font-black tracking-tight text-slate-950">GCC COMPANY</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ESTIMATION & CONTRACTING HQ</p>
                  <p className="text-[9px] text-slate-400 font-bold tracking-tight">RIYADH, SAUDI ARABIA</p>
                </div>
                <div className="text-right">
                  <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded">PROPOSAL INVOICE</span>
                  <div className="font-mono text-xs font-bold mt-2 text-slate-900 select-all">{ticketData.ticketId}</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">DATE: {new Date(ticketData.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Client specifications */}
              <div className="grid grid-cols-2 gap-6 text-[11px] font-sans">
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">PREPARED FOR:</span>
                  <p className="font-extrabold text-slate-900 text-xs mt-1">{ticketData.name}</p>
                  {ticketData.company && <p className="text-slate-600 font-semibold">{ticketData.company}</p>}
                  <p className="text-slate-500 mt-0.5">{ticketData.phone}</p>
                  <p className="text-slate-500">{ticketData.email}</p>
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">PROJECT TARGET:</span>
                  <p className="font-extrabold text-slate-900 text-xs mt-1">
                    {getServiceLabel(ticketData.serviceType).ar}
                  </p>
                  <p className="text-slate-600 font-semibold">{ticketData.projectArea} SQM (م٢)</p>
                  <p className="text-slate-550 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-500" />
                    {ticketData.location}
                  </p>
                </div>
              </div>

              {/* Invoice lines details */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left font-sans border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black text-[10px] uppercase">
                      <th className="p-3">Line item details / وصف الأصناف والخدمة</th>
                      <th className="p-3 text-right">Calculation Cost / السعر الصافي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-3 font-medium">
                        <div>Material Sizing & Devices</div>
                        <div className="text-[9px] text-slate-400">Pipes, controllers, cables, sensor fittings and backup units.</div>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-950">{ticketData.priceDetails.componentsCost.toLocaleString()} SAR</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">
                        <div>Labor, Engineering Sizing & Rigging</div>
                        <div className="text-[9px] text-slate-400">Mechanical installations, system configurations and local pressure testing.</div>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-950">{ticketData.priceDetails.laborFee.toLocaleString()} SAR</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">
                        <div>Civil Defense Regulatory Clearance & SASO Audit</div>
                        <div className="text-[9px] text-slate-400">SLA safety mapping, Municipal and Civil Defense connection processing.</div>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-950">{ticketData.priceDetails.complianceFee.toLocaleString()} SAR</td>
                    </tr>

                    {ticketData.priceDetails.discountPercent > 0 && (
                      <tr className="bg-emerald-50/10 text-emerald-700 font-bold">
                        <td className="p-3">Special Discount Voucher (-{ticketData.priceDetails.discountPercent}%)</td>
                        <td className="p-3 text-right font-mono">-{((ticketData.priceDetails.componentsCost + ticketData.priceDetails.laborFee + ticketData.priceDetails.complianceFee) * (ticketData.priceDetails.discountPercent / 100)).toLocaleString()} SAR</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Total Summary */}
              <div className="flex justify-end gap-10 items-baseline pt-4 border-t border-slate-100 font-sans">
                <div className="text-right text-[11px] space-y-1 text-slate-400 font-bold uppercase">
                  <div>SUBTOTAL (المجموع الصافي)</div>
                  <div>VAT Tax 15% (ضريبة القيمة المضافة)</div>
                  <div className="text-slate-950 font-black text-xs pt-1.5">NET GRAND TOTAL (الإجمالي النهائي)</div>
                </div>
                <div className="text-right text-xs font-mono font-black text-slate-950 space-y-1">
                  <div>{(ticketData.priceDetails.totalAmount * 0.85).toLocaleString(undefined, { maximumFractionDigits: 0 })} SAR</div>
                  <div>{(ticketData.priceDetails.totalAmount * 0.15).toLocaleString(undefined, { maximumFractionDigits: 0 })} SAR</div>
                  <div className="text-red-600 text-lg font-black pt-1">{ticketData.priceDetails.totalAmount.toLocaleString()} SAR</div>
                </div>
              </div>

              {/* stamp, seals and signers */}
              <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-xl p-4 text-[10px] font-sans mt-2">
                <div>
                  <div className="font-black text-slate-900 leading-none">CIVIL REGISTERED</div>
                  <div className="text-slate-400 mt-1">Conforms with NFPA Codes 1, 13, 72, 101, and local Saudi building codes (SBC).</div>
                </div>
                <div className="text-center shrink-0 space-y-1 relative pr-4 border-r border-slate-200">
                  <div className="w-12 h-12 rounded-full border border-red-500/20 bg-red-500/5 rotate-12 flex items-center justify-center font-black text-red-500 text-[9px] text-center uppercase tracking-tighter shadow-sm">
                    GCC SAUDI SEALS
                  </div>
                  <span className="block text-[8px] font-bold text-slate-400">AUTHORIZED APPROVAL</span>
                </div>
              </div>

              {/* Actions in dialog */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 print:hidden font-sans">
                <button
                  onClick={() => setShowInvoiceMock(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  {language === 'en' ? 'Close Builder' : 'إغلاق المعاينة'}
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white text-xs font-black rounded-xl flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Print Invoice' : 'بدء الطباعة الآن'}</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Track;
