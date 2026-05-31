import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Flame, 
  BellRing, 
  Wind, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  ClipboardList, 
  TrendingUp,
  FileText,
  Video
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const Services: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'fire_suppression' | 'fire_detection' | 'hvac' | 'power_systems' | 'cctv_security'>('fire_suppression');
  const navigate = useNavigate();

  const [dynamicServices, setDynamicServices] = useState<any[]>([]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('gcc_dynamic_media');
      if (stored) {
        const parsed = JSON.parse(stored);
        const filtered = parsed.filter((item: any) => item.type === 'service');
        setDynamicServices(filtered);
      }
    } catch (e) {
      console.warn("Error loading dynamic services", e);
    }
  }, []);

  const servicesData = {
    fire_suppression: {
      title: language === 'en' ? 'Fire Fighting & Suppression' : 'أنظمة مكافحة وإطفاء الحرائق',
      subtitle: language === 'en' ? 'Protecting complex physical facilities from fire hazards' : 'حماية متكاملة ومستجيبة ضد الحرائق بموجب الأكواد الدولية',
      icon: <Flame className="w-6 h-6 text-red-600" />,
      features: [
        language === 'en' ? 'Wet pipe, dry pipe, pre-action, and deluge sprinkler installations.' : 'تصميم وتنفيذ شبكات الرش الرطبة والجافة وشبكات الرش المغمورة.',
        language === 'en' ? 'Gaseous fire suppression: FM-200, Novec 1230, and Carbon Dioxide (CO2).' : 'أنظمة الغاز النظيف لإطفاء السيرفرات وغرف الكهرباء (FM200 & CO2).',
        language === 'en' ? 'NFPA-compliant diesel and electric fire pump sets.' : 'مضخات الحريق المعتمدة والمطابقة لمعايير NFPA بالكامل.',
        language === 'en' ? 'Fire cabinets, foam equipment, and hydrant connections.' : 'خزانات الحريق، أنظمة الرغوة، ومنافذ ومخارج الإطفاء الخارجية.',
        language === 'en' ? '24/7 hydraulic pressure testing and annual certifications.' : 'خدمات الاختبارات الدورية وتأكيد توازن ضغط المياه لتكثيف الاعتماد.'
      ],
      metrics: [
        { label: language === 'en' ? 'Standard Code' : 'الكود المتبع', value: 'NFPA 13, 14, 20' }
      ],
      color: 'red',
      img: '/images/fire-pump.jpg'
    },
    fire_detection: {
      title: language === 'en' ? 'Early Detection & Alarms' : 'أنظمة الإنذار والتوجيه المبكر',
      subtitle: language === 'en' ? 'Advanced sensors, smoke controllers, and voice announcement systems' : 'كواشف متطورة موجهة وأنظمة سحب عينات وحساسة',
      icon: <BellRing className="w-6 h-6 text-amber-500" />,
      features: [
        language === 'en' ? 'Analog addressable fire safety command systems.' : 'تركيب وتجهيز لوحات إنذار حريق موجهة ومعنونة.',
        language === 'en' ? 'Aspiration smoke sensors and early warning air sampling (VESDA).' : 'أجهزة استنشاق الهواء الحساسة للكشف المبكر عن الدخان (VESDA).',
        language === 'en' ? 'Automatic safety relay triggers to shutdown HVAC ducts and elevator shafts.' : 'التنسيق التلقائي لإيقاف قنوات التكييف وإغلاق المصاعد وبوابات الحريق.',
        language === 'en' ? 'Emergency voice evacuation systems and audible horn-strobes.' : 'أنظمة الإخلاء الصوتي الاستباقي ومكبرات الصوت والمؤشرات البصرية.'
      ],
      metrics: [
        { label: language === 'en' ? 'Standard Code' : 'الكود المتبع', value: 'NFPA 72, SBC 800' },
        { label: language === 'en' ? 'Response Time' : 'سرعة الاستجابة', value: '< 3 Seconds' },
        { label: language === 'en' ? 'Loop Capacity' : 'سعة الدائرة الواحدة', value: 'Up to 250 Devices' },
      ],
      color: 'amber',
      img: '/images/alarm-system.jpg'
    },
    hvac: {
      title: language === 'en' ? 'Air Conditioning & Cooling (HVAC)' : 'أنظمة التكييف والتهوية وتبريد المجمعات',
      subtitle: language === 'en' ? 'Designing premium air control, heating, and cooling networks' : 'الأعمال المتكاملة لتكييف الهواء وضبط مستويات الرطوبة ومقايسات الهواء',
      icon: <Wind className="w-6 h-6 text-blue-500" />,
      features: [
        language === 'en' ? 'Chilled water networks and package/ducted HVAC installations.' : 'مشاريع أنظمة التكييف الشاملة للمستشفيات وبناء شبكات دكت بموجب المخطط المعتمد.',
        language === 'en' ? 'Direct Digital Control (DDC) and precise thermostat integration.' : 'أنظمة DDC للتحكم الرقمي المباشر وتكامل غرف التحكم والتهوية.',
        language === 'en' ? 'Fresh air handling units and exhaust systems.' : 'تخطيط وتوزيع مخارج الهواء وتوريد مراوح سحب عادم عالية الضغط.',
        language === 'en' ? 'Refrigeration cold rooms and critical cooling infrastructure.' : 'تصنيع وتجهيز غرف تبريد وتجميد وصيانة دورية للفريون.',
        language === 'en' ? 'Routine maintenance, filter cleanings, and air quality tests.' : 'مراقبة وتنظيف فلاتر الهواء وفحص التسريبات والغازات بشكل دوري.'
      ],
      metrics: [
        { label: language === 'en' ? 'Engineering Code' : 'المرجع الهندسي', value: 'ASHRAE / SMACNA' },
        { label: language === 'en' ? 'Energy Efficiency' : 'معدل توفير الكهرباء', value: 'Premium EER' },
        { label: language === 'en' ? 'Maintenance Service' : 'دورة صيانة متكاملة', value: '2 Hours Response' },
      ],
      color: 'blue',
      img: 'https://images.pexels.com/photos/3825585/pexels-photo-3825585.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    power_systems: {
      title: language === 'en' ? 'Generators & Power Solutions' : 'المولدات الكهربائية وتجهيزات الطاقة',
      subtitle: language === 'en' ? 'Continuous standby generator capabilities to secure operations' : 'شبكات طاقة احتياطية ومحطات توليد مستقرة لمواجهة الطوارئ',
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      features: [
        language === 'en' ? 'Prime and standby heavy-duty diesel generator sets (10 kVA to 3000 kVA).' : 'مجموعات مولدات ديزل ثقيلة (من 10 كيلو فولت أمبير إلى 3000 KVA).',
        language === 'en' ? 'Automatic Transfer Switches (ATS) and synchronizing panels.' : 'لوحات التحويل الآلي ATS ولوحات تزامن ومطابقة المولدات الكهربائية.',
        language === 'en' ? 'Soundproof acoustic enclosures and weatherproof canopies.' : 'تصنيع وتوريد مخمدات الصوت وحواجب العوامل والظروف البيئية الجوية.',
        language === 'en' ? 'External fuel supply infrastructure and automatic day-tank refills.' : 'بناء مستودعات الوقود الخارجية ومضخات التغذية التلقائية للخزان اليومي.',
        language === 'en' ? 'Preventive maintenance, engine overhauls, and fluid analyses.' : 'أعمال الإصلاح، وعَمرات الماكينات الدورية مع فحوصات الزيوت الدقيقة.'
      ],
      metrics: [
        { label: language === 'en' ? 'Engine Standard' : 'معايير المحركات', value: 'ISO 8528 Class G3' },
        { label: language === 'en' ? 'ATS Switchover' : 'سرعة تشغيل ATS', value: '< 6 Seconds' },
        { label: language === 'en' ? 'Max Continuous Power' : 'مستويات الدعم المستمر', value: '72 Hours Prime' },
      ],
      color: 'yellow',
      img: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    cctv_security: {
      title: language === 'en' ? 'CCTV & Security Systems' : 'أنظمة كاميرات المراقبة والحماية',
      subtitle: language === 'en' ? 'Advanced IP camera surveillance and biometric security controls' : 'تأمين المنشآت بشبكات المراقبة الرقمية المتطورة والأمن الوقائي',
      icon: <Video className="w-6 h-6 text-emerald-600" />,
      features: [
        language === 'en' ? 'Ultra-HD IP security cameras with night vision and advanced motion tracking.' : 'كاميرات المراقبة بجودة فائقة (Ultra-HD IP) مع الرؤية الليلية والتتبع التلقائي المطور.',
        language === 'en' ? 'Biometric access control, card readers, and security turnstiles.' : 'أنظمة التحكم بالبوابات البيومترية، قارئات الكروت، والبوابات الدوارة الآمنة.',
        language === 'en' ? 'Centralized monitoring room design, storage servers, and NVR configure.' : 'رسم وإعداد غرف المراقبة المركزية، سيرفرات الحفظ وأجهزة مسجلات الـ NVR.',
        language === 'en' ? 'Intrusion alarm systems, motion barriers, and laser fence alerts.' : 'أنظمة الإنذار ضد السرقة والسطو، الحواجز الحركية، والإنذار بالليزر.',
        language === 'en' ? 'Remote live viewing and unified operations command.' : 'إمكانية المشاهدة الحية عن بعد والربط مع غرف المعالجة والتحكم.'
      ],
      metrics: [
        { label: language === 'en' ? 'Device Standard' : 'مواصفة الأجهزة', value: 'NDAA Compliant & ONVIF' },
        { label: language === 'en' ? 'Storage Backups' : 'مدة صلاحية التخزين المقترحة', value: '90+ Days continuous' },
        { label: language === 'en' ? 'Advanced Video Analytics' : 'تحليل الفيديو الرقمي المتقدم', value: 'Security Log & Search' },
      ],
      color: 'emerald',
      img: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  };

  // Enhance with dynamic categories features
  const enhancedServices = {
    fire_suppression: {
      ...servicesData.fire_suppression,
      features: [...servicesData.fire_suppression.features]
    },
    fire_detection: {
      ...servicesData.fire_detection,
      features: [...servicesData.fire_detection.features]
    },
    hvac: {
      ...servicesData.hvac,
      features: [...servicesData.hvac.features]
    },
    power_systems: {
      ...servicesData.power_systems,
      features: [...servicesData.power_systems.features]
    },
    cctv_security: {
      ...servicesData.cctv_security,
      features: [...servicesData.cctv_security.features]
    }
  };

  dynamicServices.forEach((item) => {
    const text = language === 'en' ? item.descriptionEn : item.descriptionAr;
    if (!text) return;
    
    if (item.category === 'fire') {
      enhancedServices.fire_suppression.features.push(text);
    } else if (item.category === 'cooling') {
      enhancedServices.hvac.features.push(text);
    } else if (item.category === 'power') {
      enhancedServices.power_systems.features.push(text);
    } else if (item.category === 'cctv') {
      enhancedServices.cctv_security.features.push(text);
    }
  });

  const tabs = [
    { id: 'fire_suppression', label: language === 'en' ? 'Fire Fighting' : 'مكافحة الحريق', color: 'text-red-650 hover:bg-red-50' },
    { id: 'fire_detection', label: language === 'en' ? 'Fire Alarm' : 'الإنذار المبكر', color: 'text-amber-500 hover:bg-amber-50' },
    { id: 'hvac', label: language === 'en' ? 'Cooling & HVAC' : 'التكييف المركزي', color: 'text-blue-500 hover:bg-blue-50' },
    { id: 'power_systems', label: language === 'en' ? 'Power Generators' : 'المولدات الكهربائية', color: 'text-yellow-600 hover:bg-yellow-50' },
    { id: 'cctv_security', label: language === 'en' ? 'CCTV & Security' : 'كاميرات المراقبة والأمن', color: 'text-emerald-600 hover:bg-emerald-50' },
  ] as const;

  const currentService = enhancedServices[activeTab];

  return (
    <div className="space-y-12">
      {/* Services Title bar */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-block bg-blue-50 text-blue-600 font-extrabold text-xs uppercase px-3 py-1 rounded-full border border-blue-100">
          {language === 'en' ? 'Division Portfolio' : 'أقسام وتخصصات الشركة'}
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          {language === 'en' ? 'Professional Electro-Mechanical Contracting Divisions' : 'أنشطة وأقسام عقود شركة GCC الهندسية'}
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed font-sans">
          {language === 'en'
            ? 'We offer bespoke mechanical, safety, and electrical installations. Our certified divisions design, fabricate, install, and service complexes under strict adherence to Saudi Building Codes (SBC).'
            : 'نقدم حلولاً متكاملة لتصميم وتركيب وتشغيل الأنظمة الهندسية ومكافحة المخاطر. تعمل فرقنا التقنية الموزعة على تلبية مواصفات كود البناء السعودي وكود السلامة العالمي بدقة ميكانيكية استثنائية.'}
        </p>
      </div>

      {/* Tab Selectors */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                isSelected 
                  ? 'bg-slate-900 border border-slate-950 text-white shadow-md' 
                  : 'text-slate-500 border border-transparent hover:border-slate-200 hover:bg-white'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${
                tab.id === 'fire_suppression' ? 'bg-red-500' :
                tab.id === 'fire_detection' ? 'bg-amber-400' :
                tab.id === 'hvac' ? 'bg-blue-500' :
                tab.id === 'power_systems' ? 'bg-yellow-400' : 'bg-emerald-500'
              }`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Division Container */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-10 items-stretch font-sans">
        <div className="flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 text-slate-800 font-extrabold">
              <span className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                {currentService.icon}
              </span>
              <div>
                <h2 className="text-xl font-black tracking-tight">{currentService.title}</h2>
                <p className="text-xs text-slate-400 leading-none">{currentService.subtitle}</p>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="space-y-3.5 pt-2">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                {language === 'en' ? 'Core Specialties & Capabilities' : 'قدرات وخدمات القسم الرئيسية'}
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-650 leading-relaxed pl-1">
                {currentService.features.map((feat, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-6">
            <button 
              onClick={() => navigate('/contact')}
              className="bg-red-650 hover:bg-red-700 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-2 tracking-wider"
            >
              <ClipboardList className="w-4 h-4" />
              <span>{language === 'en' ? 'Schedule Quote / Site Visit' : 'طلب زيارة ميدانية ومقايسة'}</span>
            </button>
            <button 
              onClick={() => navigate('/sizer')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 tracking-wider"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>{language === 'en' ? 'Configure Alarm & Control' : 'حدد نظام الإنذار والتحكم'}</span>
            </button>
          </div>
        </div>

        {/* Technical Specification sheet on the right side */}
        <div className="w-full lg:w-[350px] bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col justify-between gap-6 shrink-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-200/50">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4.5 h-4.5 text-slate-450" />
                {language === 'en' ? 'Technical Specifications' : 'الصحيفة والمحددات الفنية'}
              </span>
              <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[9px] uppercase tracking-normal">Approved</span>
            </div>

            <div className="space-y-4">
              {currentService.metrics.map((met, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs border-b border-slate-150/50 pb-2">
                  <span className="text-slate-400 font-bold">{met.label}</span>
                  <span className="font-extrabold text-slate-800 text-right">{met.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-150 p-4 rounded-xl space-y-1.5">
            <div className="flex items-center gap-1 text-[10px] font-black uppercase text-blue-600 tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 animate-pulse" />
              <span>{language === 'en' ? 'Annual SLA Coverage' : 'تغطية صيانة SLA الممتدة'}</span>
            </div>
            <p className="text-[10px] text-slate-450 leading-normal">
              {language === 'en' 
                ? 'All installations are eligible for our 24/7 preventive maintenance agreement backed by Civil Defense approval seals.'
                : 'كافة الأنظمة المجهزة تندرج تلقائياً تحت بند الحماية وضمان الجودة وحق الصيانة الدورية المعتمدة من الدفاع المدني.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
