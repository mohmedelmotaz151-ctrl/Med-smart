import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Flame, 
  BellRing, 
  Zap, 
  Wind, 
  ShieldCheck, 
  Building, 
  ArrowUpRight, 
  PhoneCall, 
  Cpu, 
  Users, 
  CheckCircle2,
  FileSpreadsheet,
  Video,
  BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const mockServices = [
    {
      id: 'fire_fighting',
      title: t('service.fire_fighting'),
      desc: t('service.fire_fighting.desc'),
      icon: <Flame className="w-8 h-8 text-red-600" />,
      color: 'border-red-500/20 hover:border-red-500 bg-red-50/10 hover:shadow-red-500/10'
    },
    {
      id: 'fire_alarm',
      title: t('service.fire_alarm'),
      desc: t('service.fire_alarm.desc'),
      icon: <BellRing className="w-8 h-8 text-amber-500" />,
      color: 'border-amber-500/20 hover:border-amber-500 bg-amber-50/10 hover:shadow-amber-500/10'
    },
    {
      id: 'cooling',
      title: t('service.cooling'),
      desc: t('service.cooling.desc'),
      icon: <Wind className="w-8 h-8 text-blue-500" />,
      color: 'border-blue-500/20 hover:border-blue-500 bg-blue-50/10 hover:shadow-blue-500/10'
    },
    {
      id: 'power',
      title: t('service.power'),
      desc: t('service.power.desc'),
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      color: 'border-yellow-500/20 hover:border-yellow-500 bg-yellow-50/10 hover:shadow-yellow-500/10'
    },
    {
      id: 'cctv_security',
      title: t('service.cctv'),
      desc: t('service.cctv.desc'),
      icon: <Video className="w-8 h-8 text-emerald-650" />,
      color: 'border-emerald-500/20 hover:border-emerald-500 bg-emerald-50/10 hover:shadow-emerald-500/10'
    }
  ];

  const highlights = [
    { label: t('home.stats.experience'), value: language === 'en' ? '2+' : 'عامان', icon: <ShieldCheck className="w-5 h-5 text-emerald-500" /> },
    { label: t('home.stats.projects'), value: '450+', icon: <Building className="w-5 h-5 text-blue-500" /> },
    { label: t('home.stats.engineers'), value: language === 'en' ? '20+' : '+20', icon: <Users className="w-5 h-5 text-purple-500" /> },
    { label: t('home.stats.safety'), value: '100%', icon: <Flame className="w-5 h-5 text-red-500" /> },
  ];

  const handleWhatsAppQuickConnect = () => {
    const textStr = encodeURIComponent("Hello GCC Company, I would like to request an engineering service / quotation inquiry.");
    window.open(`https://wa.me/966500000000?text=${textStr}`, '_blank');
  };

  return (
    <div className="space-y-12">
      {/* Dynamic Animated Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl border border-slate-800"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-blue-600/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-slate-800 text-slate-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-slate-700">
            <Cpu className="w-4 h-4 text-red-500 animate-pulse" />
            <span>{language === 'en' ? 'Civil Defense & ASHRAE Certified' : 'اعتمادات الدفاع المدني وعالمية'}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4">
            {t('home.hero_title')}
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-8">
            {t('home.hero_subtitle')}
          </p>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/contact')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-xl text-xs font-bold shadow-lg shadow-red-900/30 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-wider"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{t('home.request_quote')}</span>
            </button>
            <button 
              onClick={() => navigate('/services')}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-6 py-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 tracking-wider"
            >
              <span>{t('home.explore_services')}</span>
              <ArrowUpRight className="w-4 h-4 text-blue-400" />
            </button>
            <button 
              onClick={handleWhatsAppQuickConnect}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/20 transition-all active:scale-95 flex items-center gap-2 tracking-wider"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{t('home.emergency_call')}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Counter Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {highlights.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              {stat.icon}
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black text-slate-900 leading-none mb-1">{stat.value}</div>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Overview brief layout */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1 space-y-4">
          <div className="inline-block bg-red-50 text-red-650 font-extrabold text-xs uppercase px-3 py-1 rounded-full border border-red-100">
            {language === 'en' ? 'Who We Are' : 'عن مجموعة GCC'}
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
            {language === 'en' ? 'GCC COMPANY – Delivering Heavy Engineering Legacy' : 'شركة GCC COMPANY – إتقان في الهندسة والتجهيز الصناعي'}
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            {t('home.about_brief')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{language === 'en' ? 'Expert Mechanical Engineers' : 'نخبة من المهندسين الميكانيكيين والمصممين'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{language === 'en' ? 'Fully Compliant to Fire Safety Codes' : 'تصميمات معتمدة للدفاع المدني وأنظمة الإنقاص'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{language === 'en' ? 'High-Efficiency Chiller Maintenance' : 'صيانة وإشراف فوري على أنظمة دكت الشيلر'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{language === 'en' ? 'Optimized Alternate Power Systems' : 'توفير مستلزمات طاقة الطوارئ والمولدات بدقة'}</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/about')}
            className="text-red-600 text-xs font-extrabold uppercase tracking-wider hover:text-red-700 transition-colors flex items-center gap-1.5 pt-4"
          >
            <span>{language === 'en' ? 'Read Our Mission' : 'اقرأ المزيد عن من نحن ورؤيتنا'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="w-full md:w-[320px] h-[240px] rounded-2xl overflow-hidden shadow-md shrink-0 border border-slate-200">
          <img 
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&fit=crop" 
            alt="Engineering Works" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Professional Company Profile Showcase Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xs">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-red-105 text-red-650 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-red-150">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'CORPORATE PROFILE' : 'الكتاب التعريفي المعتمد'}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
            {language === 'en' ? 'Official GCC Company Presentation & Capabilities' : 'تصفح بروفايل الشركة المعتمد والشهادات الرسمية'}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed text-justify">
            {language === 'en'
              ? 'Our official 30-page corporate profile detailing civil engineering licenses, ZATCA tax registrations, custom electrical generator specifications, and landmark executed HVAC & fire suppression projects at Bisha University, Maersk, and Amazon centers.'
              : 'الملف والبروفايل التعريفي الرسمي الشامل لشركة GCC للتجهيزات الكنزية والمقاولات الإلكتروميكانيكية. يحتوي على تراخيص الدفاع المدني ومطابقة الكود السعودي (SBC)، السجل التجاري والضريبي المعتمد (ZATCA)، وقائمة كاملة بالمشاريع المنفذة لجامعة بيشة، شركة أمازون، مرافئ ميرسك، ووزارة الصحة ومصانع مدن.'}
          </p>
          <div className="flex flex-wrap gap-4 pt-1.5 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>{language === 'en' ? '30 Multi-Specs Pages' : '٣٠ صفحة بالمواصفات'}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>{language === 'en' ? 'ZATCA Tax ID Verified' : 'رقم ضريبي وسجل ممتد معتمد'}</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-56 w-full lg:w-[350px] relative overflow-hidden border border-slate-800 shrink-0 select-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/15 rounded-full blur-2xl pointer-events-none" />
          <span className="bg-white/10 text-white border border-white/10 text-[8px] px-2 py-0.5 rounded uppercase self-start leading-none font-mono">
            PDF PRESENTATION BOOK
          </span>
          <div className="space-y-2">
            <h3 className="text-lg font-black tracking-tight uppercase leading-tight font-sans text-white">
              GCC PROFILE
            </h3>
            <p className="text-[10px] text-slate-400">
              {language === 'en' ? 'Interactive Flipbook presentation with full credentials.' : 'عرض تفاعلي مدمج وحي للكاتب الفني والشهادات.'}
            </p>
          </div>
          <button 
            onClick={() => navigate('/about')}
            className="w-full bg-red-650 hover:bg-red-700 text-white rounded-xl py-2.5 text-xs font-black transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{language === 'en' ? 'Open Corporate Profile' : 'تصفح البروفايل بالكامل'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Services Showcase Cards */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <div className="inline-block bg-blue-50 text-blue-600 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-blue-100 mb-2">
              {language === 'en' ? 'Tailored Solutions' : 'تأجير وتنفيذ متكامل'}
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'Our Engineering Specialities' : 'مجالات التخصص والمشاريع'}
            </h2>
          </div>
          <button 
            onClick={() => navigate('/services')}
            className="text-blue-600 text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1 shrink-0"
          >
            <span>{language === 'en' ? 'View Details' : 'عرض التفاصيل الفنية'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {mockServices.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ y: -6 }}
              onClick={() => navigate('/services')}
              className={`p-6 bg-white rounded-2xl border cursor-pointer hover:shadow-xl transition-all ${service.color}`}
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-sm font-black text-slate-900 mb-2 leading-tight uppercase tracking-tight">{service.title}</h3>
              <p className="text-slate-500 text-[11px] leading-relaxed font-sans">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Banner prompt to try our Sizer AI */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="bg-gradient-to-r from-red-600 to-blue-700 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="bg-red-500 text-white font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md inline-block">
            {language === 'en' ? 'SMART TOOL' : 'أداة هندسية ذكية'}
          </div>
          <h3 className="text-xl md:text-2xl font-black tracking-tight">
            {language === 'en' ? 'Try GCC Smart Alarm & Control Configurator' : 'حدد نظام الإنذار والتحكم التفاعلي بالذكاء الاصطناعي'}
          </h3>
          <p className="text-xs text-white/80 leading-relaxed font-sans">
            {language === 'en' 
              ? 'Easily spec fire alarms, motion intrusion, access gates, biometric panels, and custom central automation conformant to SBC in seconds.' 
              : 'حدد وصمم منظومة إنذار الحريق والسرقة والمنزل الذكي وبوابات العبور والتحكم بالوصول مطابقة للاشتراطات الكودية.'}
          </p>
        </div>
        <button 
          onClick={() => navigate('/sizer')}
          className="bg-white text-slate-900 px-6 py-3.5 rounded-xl text-xs font-black shadow-lg hover:bg-slate-50 transition-colors uppercase tracking-wider shrink-0 relative z-10 active:scale-95"
        >
          {language === 'en' ? 'Configure Now' : 'ابدأ التخطيط التفاعلي'}
        </button>
      </motion.div>
    </div>
  );
};

export default Home;
