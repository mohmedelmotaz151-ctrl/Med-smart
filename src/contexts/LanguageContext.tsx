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
    'app.name': 'MedSmart',
    'nav.home': 'Home',
    'nav.appointments': 'Appointments',
    'nav.records': 'Medical Records',
    'nav.messages': 'Messages',
    'nav.profile': 'Profile',
    'home.welcome': 'Welcome to MedSmart',
    'home.search_placeholder': 'Search doctors, specialties...',
    'home.emergency': 'Emergency',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'doctor.specialty.cardiology': 'Cardiology',
    'doctor.specialty.dermatology': 'Dermatology',
    'doctor.specialty.pediatrics': 'Pediatrics',
    'doctor.specialty.neurology': 'Neurology',
  },
  ar: {
    'app.name': 'يد سمارت',
    'nav.home': 'الرئيسية',
    'nav.appointments': 'المواعيد',
    'nav.records': 'السجلات الطبية',
    'nav.messages': 'الرسائل',
    'nav.profile': 'الملف الشخصي',
    'home.welcome': 'مرحباً بكم في ميد سمارت',
    'home.search_placeholder': 'ابحث عن أطباء، تخصصات...',
    'home.emergency': 'طوارئ',
    'auth.login': 'تسجيل الدخول',
    'auth.register': 'إنشاء حساب',
    'auth.logout': 'تسجيل الخروج',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'doctor.specialty.cardiology': 'أمراض القلب',
    'doctor.specialty.dermatology': 'الأمراض الجلدية',
    'doctor.specialty.pediatrics': 'طب الأطفال',
    'doctor.specialty.neurology': 'مخ وأعصاب',
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
