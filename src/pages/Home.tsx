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
    { label: t('home.stats.engineers'), value: language === 'en' ? '20+' : '+20', icon: <Users className="w-5 h-5 text-purple-500" /> },
    { label: t('home.stats.safety'), value: '100%', icon: <Flame className="w-5 h-5 text-red-500" /> },
  ];

  const handleWhatsAppQuickConnect = () => {
    const textStr = encodeURIComponent("Hello GCC Company, I would like to request an engineering service / quotation inquiry.");
    window.open(`https://wa.me/966550307003?text=${textStr}`, '_blank');
  };

  return (
    <div className="space-y-12">
      {/* Dynamic Animated Hero Section with powerful 2-column layout */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-slate-950 rounded-3xl text-white shadow-2xl border border-slate-900"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-650/15 via-blue-600/15 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 md:p-12">
          {/* Hero Left Content Column */}
          <div className="relative z-10 lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-slate-900 text-slate-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-800">
              <Cpu className="w-4 h-4 text-red-500 animate-pulse" />
              <span>{language === 'en' ? 'Civil Defense & ASHRAE Authorized MEP' : 'اعتمادات الدفاع المدني وكود البناء السعودي'}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              {t('home.hero_title')}
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans max-w-2xl">
              {t('home.hero_subtitle')}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => navigate('/contact')}
                className="bg-red-650 hover:bg-red-700 text-white px-6 py-3.5 rounded-xl text-xs font-bold shadow-lg shadow-red-950/40 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-wider cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{t('home.request_quote')}</span>
              </button>
              <button 
                onClick={() => navigate('/services')}
                className="bg-white hover:bg-slate-100 text-slate-950 border border-white px-6 py-3.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 tracking-wider cursor-pointer shadow-lg shadow-slate-950/25"
              >
                <span className="text-slate-950 font-black">{t('home.explore_services')}</span>
                <ArrowUpRight className="w-4 h-4 text-red-650" />
              </button>
              <button 
                onClick={handleWhatsAppQuickConnect}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/20 transition-all active:scale-95 flex items-center gap-2 tracking-wider cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{t('home.emergency_call')}</span>
              </button>
            </div>
          </div>

          {/* Hero Right Visual Column - Powerful Construction Site/Crane Image */}
          <div className="lg:col-span-5 relative h-64 lg:h-[340px] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <img 
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&fit=crop" 
              alt="GCC Heavy Construction Site" 
              className="w-full h-full object-cover brightness-95 contrast-105"
              referrerPolicy="no-referrer"
            />
            {/* Dark glassy overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent p-4 flex justify-between items-end">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-slate-300 block">{language === 'en' ? 'Active Projects' : 'مواقع العمل النشطة'}</span>
                <span className="text-xs font-bold text-white">{language === 'en' ? 'Riyadh Financial Hub Foundations' : 'أساسات مجمع الرياض المالي الرقمي'}</span>
              </div>
              <span className="bg-red-650 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">SBC Verified</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Counter Section */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Overview brief layout with real on-site engineers image */}
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
            className="text-red-600 text-xs font-extrabold uppercase tracking-wider hover:text-red-700 transition-colors flex items-center gap-1.5 pt-4 cursor-pointer"
          >
            <span>{language === 'en' ? 'Read Our Mission' : 'اقرأ المزيد عن من نحن ورؤيتنا'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="w-full md:w-[360px] h-[260px] rounded-2xl overflow-hidden shadow-lg shrink-0 border border-slate-200 relative group">
          <img 
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&fit=crop" 
            alt="Engineering Team on site" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* NEW: LIVE FIELD OPERATIONS & REAL IMAGES SHOWCASE */}
      <div className="space-y-6">
        <div>
          <div className="inline-block bg-blue-50 text-blue-600 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-blue-100 mb-2">
            {language === 'en' ? 'Field Execution' : 'صناعة الإتقان الميداني والإنشائي'}
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight">
            {language === 'en' ? 'GCC Live Operations Gallery & heavy machinery' : 'معرض المعدات وعمليات المقاولات الميدانية الحية'}
          </h2>
          <p className="text-slate-400 font-sans text-xs mt-1 leading-relaxed">
            {language === 'en' 
              ? 'Real-world photography depicting active construction sites, expert technicians calibration, electrical panels, safety loops and heavy logistics crane dispatch.' 
              : 'نستعرض صوراً حقيقية من مواقع التدشين الإنشائية الثقيلة لبث الثقة، بدءاً من لوحات القواطع ومحركات الديزل وأنظمة الإطفاء وفريق الإشراف.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Heavy Construction Sites */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 group flex flex-col justify-between">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&fit=crop" 
                alt="GCC Heavy Construction Sites" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 bg-slate-950/85 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded">01</span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase font-mono mb-1">{language === 'en' ? 'Construction Sites' : 'مواقع إنشائية مهيبة'}</h3>
                <h4 className="text-sm font-black text-slate-950 leading-tight">
                  {language === 'en' ? 'High-Rise Steel & Foundation Rigs' : 'أعمال صب الخرسانات ورافعات الهياكل الهندسية'}
                </h4>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                {language === 'en'
                  ? 'Executing grand excavations, deep piling foundation engineering complying with structural engineering SBC safety metrics.'
                  : 'تجهيز وتشييد المباني الشاهقة وحسابات الحفر العميقة ودعم الأنفاق بالأبراج السكنية والطبية.'}
              </p>
            </div>
          </div>

          {/* Card 2: On-site Engineers */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 group flex flex-col justify-between">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=500&fit=crop" 
                alt="On-site Engineers at Work" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 bg-blue-650 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded">02</span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase font-mono mb-1">{language === 'en' ? 'On-site Engineers' : 'مهندسين واستشاريين بالموقع'}</h3>
                <h4 className="text-sm font-black text-slate-950 leading-tight">
                  {language === 'en' ? 'Precision Calibration & Live Diagnostics' : 'الفحص الرقمي والمعاينة الميدانية بدقة'}
                </h4>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                {language === 'en'
                  ? 'Our engineers supervise installations with advanced computerized analysis for thermal readings and signal circuits.'
                  : 'مراقبة دائمة وإشراف هندسي متكامل لضمان مطابقة التركيبات للمخططات التكعيبية والمصادقات الرسمية.'}
              </p>
            </div>
          </div>

          {/* Card 3: Electrical Boards */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 group flex flex-col justify-between">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&fit=crop" 
                alt="Electrical boards and cabinets" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 bg-red-650 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded">03</span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase font-mono mb-1">{language === 'en' ? 'Control Distribution Panels' : 'لوحات كهربائية ونحاسية'}</h3>
                <h4 className="text-sm font-black text-slate-950 leading-tight">
                  {language === 'en' ? 'ATS Switches & Heavy-Duty Busbar Layout' : 'قواطع ضغط ومفاتيح التحويل التلقائية المزدوجة'}
                </h4>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                {language === 'en'
                  ? 'Structuring high-voltage breakers and weatherproof cabinet shelters to withstand harsh Saudi desert environments.'
                  : 'توفير وتجميع خلايا التوزيع الكهربائية ونقاط التماس المحكومة لتجنب انقطاع التيار والتأثر بالغبار والحرارة.'}
              </p>
            </div>
          </div>

          {/* Card 4: Safety Systems */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 group flex flex-col justify-between">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&fit=crop" 
                alt="Safety and Fire Safety Systems" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 bg-emerald-650 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded">04</span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase font-mono mb-1">{language === 'en' ? 'Safety Systems' : 'أنظمة السلامة ومكافحة الحريق'}</h3>
                <h4 className="text-sm font-black text-slate-950 leading-tight">
                  {language === 'en' ? 'NFPA Compliant Valves & FM-205 Loops' : 'شبكات مرشات التدفق المائي ومضخات مكافحة اللهب'}
                </h4>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                {language === 'en'
                  ? 'Heavy engineering design for dry and wet alarm check valves keeping continuous automatic pressure indicators safe.'
                  : 'شبكات متدفقة جافة لغرف التحكم وخراطيم تغذية رئيسية مطابقة لاشتراطات الدفاع المدني السعودي.'}
              </p>
            </div>
          </div>

          {/* Card 5: Heavy Cranes & Equipment */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 group flex flex-col justify-between">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&fit=crop" 
                alt="Heavy cranes and industrial machinery" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 bg-amber-500 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded">05</span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase font-mono mb-1">{language === 'en' ? 'Heavy Cranes & Equipment' : 'رافعات حفر ومعدات ثقيلة'}</h3>
                <h4 className="text-sm font-black text-slate-950 leading-tight">
                  {language === 'en' ? 'Hydraulic Rigs & Precision High Lift Solutions' : 'رافعات الإنشاءات والأنظمة الهيدروليكية الضخمة'}
                </h4>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                {language === 'en'
                  ? 'Logistical muscle using multi-ton mobile and crawler cranes to place massive modular chiller coils with precision.'
                  : 'معدات مناولة ونقل أحمال الروابط والـ Chiller والصمامات الكونية الكبرى لضمان تدشين سريع وآمن.'}
              </p>
            </div>
          </div>

          {/* Card 6: UL/FM Certified Pump Installation */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 group flex flex-col justify-between">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1584281729155-3c1b3532f170?w=800&fit=crop" 
                alt="UL/FM Certified Fire Fighting Pump Installation" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 bg-red-650 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded">06</span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase font-mono mb-1">{language === 'en' ? 'Pumping Systems' : 'أنظمة مكافحة اللهب'}</h3>
                <h4 className="text-sm font-black text-slate-950 leading-tight">
                  {language === 'en' ? 'Installation of UL/FM Certified Fire Pumps' : 'توريد وتركيب مضخات الحريق المعتمدة UL/FM'}
                </h4>
              </div>
              <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed">
                {language === 'en'
                  ? 'Supply and installation of certified fire pumps in accordance with international safety standards, with complete execution of firefighting networks and control systems.'
                  : 'توريد وتركيب مضخات الحريق المعتمدة وفق معايير السلامة العالمية، مع تنفيذ كامل لشبكات الإطفاء وأنظمة التحكم لضمان أعلى مستويات الحماية والكفاءة التشغيلية.'}
              </p>
            </div>
          </div>
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

      {/* Banner prompt to try our Sizer */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="bg-gradient-to-r from-red-600 to-blue-700 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="bg-red-500 text-white font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md inline-block">
            {language === 'en' ? 'ESTIMATION TOOL' : 'أداة التخطيط والتسعير'}
          </div>
          <h3 className="text-xl md:text-2xl font-black tracking-tight">
            {language === 'en' ? 'Try GCC Interactive Alarm & Control Sizer' : 'حدد نظام الإنذار والتحكم التفاعلي المباشر'}
          </h3>
          <p className="text-xs text-white/80 leading-relaxed font-sans">
            {language === 'en' 
              ? 'Easily spec fire alarms, motion intrusion, access gates, biometric panels, and custom central automation conformant to SBC in seconds.' 
              : 'حدد وصمم منظومة إنذار الحريق والسرقة وأنظمة الأتمتة المتقدمة وبوابات العبور والتحكم بالوصول مطابقة للاشتراطات الكودية.'}
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
