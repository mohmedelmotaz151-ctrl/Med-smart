import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'app.name': 'GCC COMPANY',
    'app.tagline': 'Engineering & Electro-Mechanical Solutions',
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.services': 'Services',
    'nav.projects': 'Projects',
    'nav.sizer': 'AI Sizer & Advisor',
    'nav.contact': 'Contact Us',
    'nav.profile': 'Portal',
    'home.hero_title': 'Engineering Excellence, Safety First',
    'home.hero_subtitle': 'Pioneering Electro-Mechanical installations, Fire Fighting systems, Intelligent Alarms, Industrial Cooling, and Power Solutions across the GCC region.',
    'home.request_quote': 'Request a Quote',
    'home.explore_services': 'Explore Our Services',
    'home.emergency_call': 'Emergency Service 24/7',
    'home.about_brief': 'Established with a vision of premium electro-mechanical service, GCC COMPANY stands at the forefront of engineering executing mission-critical HVAC, Fire Suppression, Security, and Emergency backup power systems for landmarks and industries.',
    'home.stats.experience': 'Years of Experience',
    'home.stats.projects': 'Completed Projects',
    'home.stats.engineers': 'Certified Engineers',
    'home.stats.safety': 'Safety Compliance',
    'auth.login': 'Client Portal Login',
    'auth.register': 'Create Client Account',
    'auth.logout': 'Sign Out',
    'common.save': 'Save Changes',
    'common.cancel': 'Cancel',
    'service.fire_fighting': 'Fire Fighting Systems',
    'service.fire_fighting.desc': 'Design and execution of state-of-the-art fire suppression networks, sprinklers, and FM200/CO2 gaseous systems adhering to Civil Defense standards.',
    'service.fire_alarm': 'Intelligent Alarms',
    'service.fire_alarm.desc': 'Highly sensitive addressable sensor arrays, smoke alarms, emergency lighting, and building command integrations.',
    'service.cooling': 'Cooling & HVAC Systems',
    'service.cooling.desc': 'Central chilled water infrastructure, Package units, ducted systems, and automated temperature controllers for massive complexes.',
    'service.power': 'Power Generators & Energy',
    'service.power.desc': 'Heavy-duty industrial generator supply, UPS systems, synch panels, acoustic covers, and 24/7 power backup deployment.',
    'service.cctv': 'CCTV & Security Cameras',
    'service.cctv.desc': 'Enterprise IP camera networks, motion detection surveillance, biometric security access control, and centralized control station designs.',
  },
  ar: {
    'app.name': 'GCC COMPANY',
    'app.tagline': 'للحلول الهندسية والكهروميكانيكية المتكاملة',
    'nav.home': 'الرئيسية',
    'nav.about': 'من نحن',
    'nav.services': 'الخدمات',
    'nav.projects': 'المشاريع السابقة',
    'nav.sizer': 'مستشار التسعير الذكي',
    'nav.contact': 'اتصل بنا',
    'nav.profile': 'بوابة العملاء',
    'home.hero_title': 'ريادة هندسية.. أمان لا يساوم',
    'home.hero_subtitle': 'الشركة الرائدة في تنفيذ المشروعات الكهروميكانيكية، شبكات مكافحة الحرائق، أنظمة الإنذار الذكية، التكييف المركزي، وتوليد الطاقة البديلة في دول الخليج.',
    'home.request_quote': 'طلب عرض سعر',
    'home.explore_services': 'تصفح خدماتنا',
    'home.emergency_call': 'خدمة طوارئ 24 ساعة',
    'home.about_brief': 'تأسست شركة GCC COMPANY برؤية صلبة لتقديم أرقى مستويات الخدمة الكهروميكانيكية. نقف اليوم في الصدارة لتنفيذ وتصميم تكييف الهواء HVAC، شبكات الإطفاء، الإنذار المبكر، ومولدات الطاقة الاحتياطية للمنشآت والمجمعات الصناعية والمدنية بامتثال كامل لاعتمادات الدفاع المدني والجودة العالمية.',
    'home.stats.experience': 'سنوات من الخبرة',
    'home.stats.projects': 'مشاريع منفذة',
    'home.stats.engineers': 'مهندسين معتمدين',
    'home.stats.safety': 'التزام بالسلامة %',
    'auth.login': 'بوابة تسجيل عملاء الشركة',
    'auth.register': 'تسجيل عميل جديد',
    'auth.logout': 'تسجيل الخروج',
    'common.save': 'حفظ التغييرات',
    'common.cancel': 'إلغاء المراجعة',
    'service.fire_fighting': 'أنظمة مكافحة وإطفاء الحرائق',
    'service.fire_fighting.desc': 'تصميم وتنفيذ شبكات الإطفاء المائية، المرشات التلقائية، وأنظمة الغاز النظيف (CO2 & FM200) متطابقة مع الكود العالمي واعتماد الدفاع المدني.',
    'service.fire_alarm': 'أنظمة الإنذار والتوجيه المبكر',
    'service.fire_alarm.desc': 'مجسات حرارية ودخانية ذكية متصلة بلوحات معالجة موجهة، أنظمة طوارئ وتدابير مكافحة الحوادث والإنذار الصوتي.',
    'service.cooling': 'أنظمة التكييف والتهوية والتبريد HVAC',
    'service.cooling.desc': 'توريد وتركيب التكييف المركزي تشيلرز (Chillers)، وحدات دكت مدمجة، وحلول التحكم الذكي والتهوية للأبراج والمولات الصناعية.',
    'service.power': 'المولدات الكهربائية وهندسة الطاقة',
    'service.power.desc': 'تجارة وتركيب المولدات الصناعية الثقيلة، أنظمة ATS للتحويل الآلي، حواجب الصوت، ومحطات توليد احتياطية على مدار الساعة.',
    'service.cctv': 'أنظمة كاميرات المراقبة والحماية',
    'service.cctv.desc': 'توريد وتركيب شبكات كاميرات المراقبة للشركات والمصانع، أنظمة الكشف عن الحركة والتعرف الذكي، التحكم بالأبواب بيومترياً وتأسيس غرف المراقبة.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
