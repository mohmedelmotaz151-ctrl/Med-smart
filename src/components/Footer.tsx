import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Phone, MapPin, ShieldCheck, FileCheck2, Award } from 'lucide-react';

const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-xl font-black text-white">{t('app.name')}</h3>
            <p className="text-xs leading-relaxed text-slate-400">
              {language === 'en'
                ? 'Pioneering heavy electro-mechanical installations, certified Fire Suppression loops, and premier industrial HVAC engineering across Riyadh and GCC.'
                : 'الشركة الرائدة في تصميم وإنجاز الأعمال الكهروميكانيكية المتكاملة، شبكات ومضخات مكافحة الحرائق وتكييف الهواء للمجمعات والمصانع بالمملكة العربيّة السعوديّة.'}
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">
              {language === 'en' ? 'Our Core Work' : 'أقسامنا الهندسية'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>{language === 'en' ? 'Fire Fighting Systems' : 'أنظمة مكافحة الحريق'}</li>
              <li>{language === 'en' ? 'Early Alarm Systems' : 'أنظمة الإنذار والتوجيه الفوري'}</li>
              <li>{language === 'en' ? 'HVAC & Air Chilling' : 'أنظمة التكييف والتهوية'}</li>
              <li>{language === 'en' ? 'Industrial Generators' : 'المولدات الكهربائية الثقيلة'}</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">
              {language === 'en' ? 'Corporate Certificates' : 'الشهادات والاعتمادات'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-red-500" />
                <span>{language === 'en' ? 'Saudi Civil Defense Approved' : 'معتمد من الدفاع المدني السعودي'}</span>
              </li>
              <li className="flex items-center gap-2">
                <FileCheck2 size={14} className="text-blue-500" />
                <span>{language === 'en' ? 'SBC Building Code Compliant' : 'مطابق لكود البناء السعودي'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Award size={14} className="text-emerald-500" />
                <span>{language === 'en' ? 'ZATCA Registered Profile' : 'مسجل لدى هيئة الزكاة والضريبة'}</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">
              {language === 'en' ? 'Corporate Contact' : 'بيانات المقر الموحد'}
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-red-500" />
                <span>Riyadh, Kingdom of Saudi Arabia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-red-500" />
                <span>+966 500 000 000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-red-500" />
                <span>info@gcc-mep.co</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} GCC COMPANY. {language === 'en' ? 'All rights reserved.' : 'جميع الحقوق محفوظة لشركة جي سي سي للمقاولات.'}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
