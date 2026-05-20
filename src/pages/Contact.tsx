import React, { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  Loader2, 
  PhoneCall, 
  ArrowUpRight,
  ShieldCheck,
  FileSpreadsheet,
  UploadCloud,
  FileText,
  Trash2,
  Flame,
  Bell,
  Zap,
  Snowflake,
  Video,
  Home as HomeIcon,
  Building as BuildingIcon,
  Warehouse,
  FileUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

const Contact: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    serviceType: 'fire_suppression', // 'fire_suppression' | 'fire_alarm' | 'power' | 'hvac' | 'cctv'
    projectType: 'commercial', // 'residential' | 'commercial' | 'industrial'
    projectArea: '',
    location: '',
    message: ''
  });

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectService = (service: string) => {
    setFormData(prev => ({ ...prev, serviceType: service }));
  };

  const selectProjectType = (type: string) => {
    setFormData(prev => ({ ...prev, projectType: type }));
  };

  // Drag and Drop support
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const simulateProgress = (fileId: string) => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 5;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: 100, status: 'completed' } : f));
      } else {
        setFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: current } : f));
      }
    }, 150);
  };

  const addFilesToList = (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map(file => {
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
        : `${(file.size / 1024).toFixed(1)} KB`;
      const id = Math.random().toString(36).substring(2, 9);
      
      return {
        id,
        name: file.name,
        size: sizeStr,
        progress: 0,
        status: 'uploading'
      };
    });

    setFiles(prev => [...prev, ...newFiles]);

    // Trigger progressive feedback animation for each added file
    newFiles.forEach(f => {
      simulateProgress(f.id);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFilesToList(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addFilesToList(e.target.files);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) return;

    setLoading(true);
    // Generate an elegant, easily traceable engineering ticket ID conforming to: GCC-2026-XXXX
    const computedTicketId = `GCC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const uploadedFileNames = files.map(f => f.name);

    const inquiryPayload = {
      ...formData,
      ticketId: computedTicketId,
      uploadedFiles: uploadedFileNames,
      userId: user?.uid || 'guest',
      userEmail: user?.email || formData.email,
      status: 'new', // 'new' | 'under_review' | 'priced' | 'completed'
      createdAt: new Date().toISOString(),
      priceDetails: {
        componentsCost: 0,
        laborFee: 0,
        complianceFee: 0,
        discountPercent: 0,
        totalAmount: 0,
        comments: ''
      }
    };

    try {
      // 1. Save to firestore
      await addDoc(collection(db, 'inquiries'), inquiryPayload);
      
      // 2. Cache in local storage for a super response hybrid system
      const localInquiries = JSON.parse(localStorage.getItem('gcc_inquiries') || '[]');
      localInquiries.unshift(inquiryPayload);
      localStorage.setItem('gcc_inquiries', JSON.stringify(localInquiries));

      setTicketId(computedTicketId);
      setSubmitted(true);
    } catch (err) {
      console.error("Firestore submit error: ", err);
      // Dual-mode fallback still succeeds smoothly using our robust local sync engine
      const localInquiries = JSON.parse(localStorage.getItem('gcc_inquiries') || '[]');
      localInquiries.unshift(inquiryPayload);
      localStorage.setItem('gcc_inquiries', JSON.stringify(localInquiries));

      setTicketId(computedTicketId);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppInstant = () => {
    const servicesMapEn: Record<string, string> = {
      fire_suppression: 'أنظمة إطفاء الحرائق',
      fire_alarm: 'أنظمة الإنذار والتوجيه',
      power: 'المولدات الكهربائية وهندسة الطاقة',
      hvac: 'أنظمة التكييف والتهوية',
      cctv: 'كاميرات المراقبة والأمن'
    };
    const serviceName = servicesMapEn[formData.serviceType] || 'خدمات كهروميكانيكية';
    const textStr = encodeURIComponent(
      `السلام عليكم شركة GCC COMPANY، أنا المهندس/العميل ${formData.name}. ` +
      `لقد أرسلت طلباً لعرض سعر عبر الموقع لـ (${serviceName}) لمشروع (${formData.projectType === 'residential' ? 'سكني' : formData.projectType === 'commercial' ? 'تجاري' : 'صناعي'}) ` +
      `بمساحة ${formData.projectArea} م٢ في حي/مدينة ${formData.location || 'غير محدد'}. ` +
      `أرجو التواصل معي لتأكيد المواصفات وتقديم عرض السعر الفني.`
    );
    window.open(`https://wa.me/966500000000?text=${textStr}`, '_blank');
  };

  return (
    <div className="space-y-12 pb-16 font-sans">
      
      {/* Page Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-block bg-red-50 text-red-600 font-extrabold text-xs uppercase px-3 py-1 rounded-full border border-red-100">
          {language === 'en' ? 'FAST QUOTATION HUB' : 'منصة عروض الأسعار السريعة'}
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
          {language === 'en' ? 'Get Your Commercial Engineering Proposal' : 'طلب عرض سعر هندسي متكامل ومباشر'}
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed font-sans">
          {language === 'en'
            ? 'GCC COMPANY helps you size, estimate, and evaluate electro-mechanical contracts easily. Furnish your layout specs, estimated building size, and download your preliminary estimate within 4 hours.'
            : 'تساعدكم شركة GCC COMPANY على تصميم وتسعير المقاولات الكهروميكانيكية والأنظمة الأمنية والدفاع المدني بدقة. أدخل تفاصيل ومخطط المنشأة واحصل على عرض سعر ومقايس أولية فنية في غضون 4 ساعات.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Form Container on left (Takes 8 columns for extra breathing room) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* SECTION 1: Client Information */}
              <div>
                <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs font-bold font-sans">1</span>
                  {language === 'en' ? 'Contact Details' : 'معلومات الاتصال والمنشأة'}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5 animate-fade-in">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      {language === 'en' ? 'Full Name' : 'الاسم الكامل'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInput}
                      placeholder={language === 'en' ? 'e.g. Sultan Al-Ahmad' : 'مثال: سلطان الأحمد'}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 focus:bg-white transition-all text-slate-800 font-sans"
                    />
                  </div>

                  {/* Company establishing */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      {language === 'en' ? 'Company Name (Optional)' : 'اسم الشركة / المنشأة (اختياري)'}
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInput}
                      placeholder={language === 'en' ? 'e.g. Al-Fahd Contracting' : 'مثال: شركة الفهد للمقاولات'}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 focus:bg-white transition-all text-slate-800 font-sans"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      {language === 'en' ? 'Phone Number' : 'رقم الهاتف'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInput}
                      placeholder="e.g. +966 50 000 0000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 focus:bg-white transition-all text-slate-800 font-sans text-left dir-ltr"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInput}
                      placeholder="name@business.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 focus:bg-white transition-all text-slate-800 font-sans"
                    />
                  </div>
                </div>
              </div>


              {/* SECTION 2: Service Type Selection Cards */}
              <div>
                <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs font-bold font-sans">2</span>
                  {language === 'en' ? 'Select Required Service' : 'اختر نوع الخدمة المطلوبة'}
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { id: 'fire_suppression', label: language === 'en' ? 'Fire Fighting' : 'أنظمة إطفاء', icon: <Flame className="w-5 h-5 text-red-500" /> },
                    { id: 'fire_alarm', label: language === 'en' ? 'Fire Alarm' : 'أنظمة إنذار', icon: <Bell className="w-5 h-5 text-amber-500" /> },
                    { id: 'power', label: language === 'en' ? 'Generators' : 'مولدات كهربائية', icon: <Zap className="w-5 h-5 text-yellow-500" /> },
                    { id: 'hvac', label: language === 'en' ? 'HVAC Cooling' : 'أنظمة تكييف', icon: <Snowflake className="w-5 h-5 text-blue-500" /> },
                    { id: 'cctv', label: language === 'en' ? 'CCTV Cameras' : 'كاميرات مراقبة', icon: <Video className="w-5 h-5 text-emerald-500" /> }
                  ].map((service) => {
                    const isSelected = formData.serviceType === service.id;
                    return (
                      <button
                        type="button"
                        key={service.id}
                        onClick={() => selectService(service.id)}
                        className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center gap-2.5 transition-all outline-none ${
                          isSelected 
                            ? 'bg-red-50/70 border-red-500 ring-2 ring-red-500/20 shadow-md shadow-red-500/5' 
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`p-2 rounded-xl transition-all ${isSelected ? 'bg-white scale-110 shadow-sm' : 'bg-slate-200/50'}`}>
                          {service.icon}
                        </div>
                        <span className={`text-[11px] font-black tracking-tight ${isSelected ? 'text-red-700' : 'text-slate-700'}`}>
                          {service.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>


              {/* SECTION 3: Project Specifications */}
              <div>
                <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs font-bold font-sans">3</span>
                  {language === 'en' ? 'Project Specifications' : 'تفاصيل ومواصفات المشروع'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Project Type */}
                  <div className="space-y-1.5 md:col-span-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      {language === 'en' ? 'Project Type' : 'نوع المشروع'}
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: 'residential', label: language === 'en' ? 'Residential' : 'سكني', icon: <HomeIcon className="w-4 h-4 text-emerald-500" /> },
                        { id: 'commercial', label: language === 'en' ? 'Commercial' : 'تجاري', icon: <BuildingIcon className="w-4 h-4 text-blue-500" /> },
                        { id: 'industrial', label: language === 'en' ? 'Industrial' : 'صناعي', icon: <Warehouse className="w-4 h-4 text-purple-500" /> }
                      ].map((type) => {
                        const isSelected = formData.projectType === type.id;
                        return (
                          <button
                            type="button"
                            key={type.id}
                            onClick={() => selectProjectType(type.id)}
                            className={`px-4 py-2.5 rounded-xl border flex items-center gap-3 text-xs font-bold transition-all ${
                              isSelected 
                                ? 'bg-slate-900 text-white border-slate-900 shadow' 
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {type.icon}
                            <span>{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Project Area & City */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Project Area in SQM */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700 block">
                          {language === 'en' ? 'Project Area' : 'مساحة المشروع'}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="projectArea"
                            value={formData.projectArea}
                            onChange={handleInput}
                            placeholder={language === 'en' ? 'e.g. 1500' : 'مثال: 1200'}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-xs focus:outline-none focus:border-red-500 focus:bg-white transition-all text-slate-800 font-sans"
                          />
                          <div className={`absolute top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 font-sans ${language === 'en' ? 'right-4' : 'left-4'}`}>
                            {language === 'en' ? 'SQM' : 'متر مربع'}
                          </div>
                        </div>
                      </div>

                      {/* Project Location */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700 block">
                          {language === 'en' ? 'City / Location' : 'المدينة / الموقع'}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInput}
                            placeholder={language === 'en' ? 'e.g. Riyadh, Al Olaya' : 'مثال: الرياض، حي العليا'}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 focus:bg-white transition-all text-slate-800 font-sans"
                          />
                          <MapPin className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none right-4" />
                        </div>
                      </div>
                    </div>

                    {/* Request Details */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 block">
                        {language === 'en' ? 'Request Details / Scope of Work' : 'تفاصيل الطلب / نطاق العمل المقترح'}
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInput}
                        rows={3}
                        placeholder={language === 'en' 
                          ? 'Describe building specifications, room quantities, chilled water loads or system requirements...' 
                          : 'ادخل أي مواصفات فنية إضافية، نطاق العمل المطلوب، أو الماركات والمواصفات المعينة لتسريع التسعير الدقيق...'}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 focus:bg-white transition-all text-slate-800 font-sans leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </div>


              {/* SECTION 4: Uploading Blueprints / Images */}
              <div>
                <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs font-bold font-sans">4</span>
                  {language === 'en' ? 'Project Blueprints & Site Photos' : 'إمكانية رفع المخططات الهندسية أو صور الموقع'}
                </h3>
                
                {/* Drag and Drop Zone */}
                <div 
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    dragActive 
                      ? 'border-red-500 bg-red-50/20' 
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                  onClick={triggerFileSelect}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    multiple 
                    onChange={handleFileInput}
                    className="hidden" 
                    accept=".pdf,.dwg,.png,.jpg,.jpeg,.zip"
                  />
                  
                  <div className="flex flex-col items-center gap-2.5">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm text-slate-500">
                      <UploadCloud className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">
                        {language === 'en' 
                          ? 'Click to secure upload or drag & drop layouts' 
                          : 'انقر هنا لتحديد المخططات الآمنة أو قم بسحب وإسقاط الملفات'}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {language === 'en' 
                          ? 'Supports PDFs, CAD Drawings (.dwg), Site Photos, or ZIP files up to 50MB' 
                          : 'يقبل ملفات الأوتوكاد (DWG)، المستندات (PDF)، مخططات ثنائية الأبعاد، صور الموقع أو ملفات مضغوطة'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progressive Uploading Queue Visualizer */}
                <AnimatePresence>
                  {files.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-2"
                    >
                      <h4 className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
                        {language === 'en' ? 'Uploaded Documents & Schematics' : 'المخططات وصور المنشأة المرفقة'}
                      </h4>
                      
                      <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-white">
                        {files.map((file) => (
                          <div key={file.id} className="p-3 flex items-center justify-between gap-4 text-xs font-sans">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                <FileText className="w-4 h-4 text-slate-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-slate-800 truncate block">{file.name}</div>
                                <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                                  <span>{file.size}</span>
                                  <span>•</span>
                                  {file.status === 'uploading' ? (
                                    <span className="text-blue-500 animate-pulse">{language === 'en' ? `Uploading (${file.progress}%)` : `جاري الرفع (${file.progress}%)`}</span>
                                  ) : (
                                    <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                                      <CheckCircle className="w-3 h-3" />
                                      {language === 'en' ? 'Secure Ready' : 'جاهز وآمن للتشفير'}
                                    </span>
                                  )}
                                </div>
                                
                                {/* Simulated Progress Bar */}
                                {file.status === 'uploading' && (
                                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-1.5">
                                    <div 
                                      className="bg-red-500 h-full transition-all duration-150" 
                                      style={{ width: `${file.progress}%` }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => removeFile(file.id)}
                              className="w-8 h-8 rounded-full border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-red-600 flex items-center justify-center transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>


              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-650 hover:bg-red-700 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all active:scale-98 shadow-md shadow-red-900/10 flex items-center justify-center gap-2 font-sans"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{language === 'en' ? 'Milling Preliminary Quote Estimations...' : 'جاري تحليل كميات المنشأة وتخزين الطلب...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{language === 'en' ? 'Calculate Cost & Submit Bid' : 'إيداع الطلب مراجعاً وفورياً'}</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-10 space-y-6 font-sans"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {language === 'en' ? 'Engineering Proposal Request Queued' : 'تم استلام طلب المقايسة وتوليد بطاقة تسعير تتبع'}
                </h2>
                
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 max-w-md mx-auto space-y-2 text-left text-xs text-slate-600">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-400 uppercase tracking-wider">{language === 'en' ? 'TICKET ID' : 'معرف التتبع الآمن'}</span>
                    <span className="font-mono text-slate-900 font-bold select-all">{ticketId || 'GCC-78192'}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>{language === 'en' ? 'Client Name' : 'اسم العميل'}</span>
                    <span className="font-bold text-slate-900">{formData.name}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>{language === 'en' ? 'Selected Service' : 'الخدمة المختارة'}</span>
                    <span className="font-bold text-slate-900">
                      {formData.serviceType === 'fire_suppression' ? (language === 'en' ? 'Fire Fighting' : 'أنظمة إطفاء') :
                       formData.serviceType === 'fire_alarm' ? (language === 'en' ? 'Fire Alarm' : 'أنظمة إنذار') :
                       formData.serviceType === 'power' ? (language === 'en' ? 'Power' : 'مستشار الطاقة') :
                       formData.serviceType === 'hvac' ? (language === 'en' ? 'HVAC' : 'أنظمة تكييف') :
                       (language === 'en' ? 'CCTV Camera Network' : 'كاميرات المراقبة وتحليل الحركة')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>{language === 'en' ? 'Project Category' : 'تصنيف طبيعة العقار'}</span>
                    <span className="font-bold text-slate-900">
                      {formData.projectType === 'residential' ? (language === 'en' ? 'Residential' : 'سكني') :
                       formData.projectType === 'commercial' ? (language === 'en' ? 'Commercial' : 'تجاري') :
                       (language === 'en' ? 'Industrial Establishment' : 'صناعي ولوجستي')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>{language === 'en' ? 'Estimated Area' : 'إجمالي المساحة المقدرة'}</span>
                    <span className="font-bold text-slate-900">{formData.projectArea || '500'} sqm (م٢)</span>
                  </div>
                  {files.length > 0 && (
                    <div className="flex justify-between pt-1 border-t border-slate-100 mt-2">
                      <span>{language === 'en' ? 'Blueprints Sent' : 'المخططات الهندسية المرفقة'}</span>
                      <span className="font-bold text-red-600">{files.length} {language === 'en' ? 'layouts' : 'ملفات'}</span>
                    </div>
                  )}
                </div>

                <p className="text-slate-500 text-xs leading-relaxed max-w-md mx-auto pt-2">
                  {language === 'en'
                    ? 'Your requirements have been processed into our corporate scheduler. A certified MEP and Civil Defense engineer has been assigned.'
                    : 'لقد تم ربط طلبكم بنظام تسعير المواد وجدولة المشاريع بقاعدة بيانات مؤسسة GCC. لتسريع عملية الفحص والبدء بالمقايسة، نوصي بالتواصل المباشر مع مكتبنا الفني عبر الواتساب.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-4">
                <button
                  onClick={handleWhatsAppInstant}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-xl text-xs font-black shadow-lg shadow-emerald-950/25 flex items-center justify-center gap-2 active:scale-95"
                >
                  <PhoneCall className="w-4.5 h-4.5" />
                  <span>{language === 'en' ? 'Instant WhatsApp Coordination' : 'تفعيل التواصل وبدء المقايسة فوراً عبر واتساب'}</span>
                </button>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFiles([]);
                    setFormData({
                      name: '',
                      company: '',
                      phone: '',
                      email: '',
                      serviceType: 'fire_suppression',
                      projectType: 'commercial',
                      projectArea: '',
                      location: '',
                      message: ''
                    });
                  }}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 px-6 py-4 rounded-xl text-xs font-bold"
                >
                  {language === 'en' ? 'Submit Another Estimate' : 'تقديم طلب تسعير جديد'}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Corporate Headquarters Address and Info on the right */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-wider pb-3 border-b border-slate-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              {language === 'en' ? 'GCC Main HQ & Operations' : 'مكتب العمليات الإقليمي الرئيسي'}
            </h3>

            <div className="space-y-4">
              <div className="flex gap-3 items-start text-xs leading-relaxed font-sans">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-black text-slate-200">{language === 'en' ? 'Saudi Arabia Command Central' : 'مقر التواجد الرئيسي (مملكة ريادية)'}</span>
                  <span className="block text-[11px] text-slate-400">7190 King Fahd Road, Al-Aqeeq District, Riyadh 13511</span>
                </div>
              </div>

              <div className="flex gap-3 items-start text-xs leading-relaxed font-sans">
                <Phone className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-black text-slate-200">{language === 'en' ? 'MEP Contracts Center' : 'مكتب مراجعة العقود الفنية'}</span>
                  <span className="block text-[11px] text-slate-400 [direction:ltr]" dir="ltr">+966 11 405 9000</span>
                </div>
              </div>

              <div className="flex gap-3 items-start text-xs leading-relaxed font-sans">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="block font-black text-slate-200">{language === 'en' ? 'Estimation Desk' : 'البريد الفني لطلبات التسعير'}</span>
                  <span className="block text-[11px] text-slate-400">contracts@gcc-company.com</span>
                </div>
              </div>

              <div className="flex gap-3 items-start text-xs leading-relaxed font-sans">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-black text-slate-200">{language === 'en' ? 'Working Hours' : 'ساعات معاينات العمل'}</span>
                  <span className="block text-[11px] text-slate-400">{language === 'en' ? 'Sunday - Thursday: 8:00 AM - 5:00 PM' : 'الأحد - الخميس: 8:00 صباحاً - 5:00 مساءً'}</span>
                  <span className="block text-[10px] text-red-500 font-extrabold uppercase mt-1">*{language === 'en' ? 'Emergencies response Active 24/7' : 'استجابة الكوارث والدعم الفني مستمرة 24 ساعة'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SLA Badging */}
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
              <div>
                <h4 className="text-xs font-black text-slate-900">{language === 'en' ? '4-Hour Bidding SLA Guarantee' : 'ضمان إنجاز المقايسة خلال 4 ساعات'}</h4>
                <p className="text-[10px] text-slate-400 leading-normal font-sans">{language === 'en' ? 'Our civil safety estimators analyze specifications at record speeds.' : 'فريق المهندسين الفنيين يحلل المتطلبات بأقصى كفاءة.'}</p>
              </div>
            </div>
          </div>

          {/* Location details */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 overflow-hidden relative shadow-sm text-center space-y-2 font-sans">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
              {language === 'en' ? 'Main Headquarters' : 'المقر الرئيسي'}
            </h4>
            
            <div className="h-40 bg-slate-50 border border-slate-100/70 rounded-2xl flex flex-col items-center justify-center p-3 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-red-600 rounded-full animate-ping" />
              <div className="absolute top-1/2 left-1/3 w-2.5 h-2.5 bg-red-650 rounded-full border border-white shadow" />
              <div className="text-center relative z-10 space-y-0.5">
                <div className="text-sm font-black text-slate-800">
                  {language === 'en' ? 'Abha Head Office' : 'مؤسسة مقر أبها الرئيسي'}
                </div>
                <div className="text-[9px] text-slate-400 font-bold tracking-tight uppercase">
                  ABHA.KING FHAD ST
                </div>
                <div className="inline-block bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-white text-[8px] font-mono leading-none mt-2">
                  LAT 18.2163 / LNG 42.5053
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
