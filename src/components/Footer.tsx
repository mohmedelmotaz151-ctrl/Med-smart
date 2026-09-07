import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Phone, MapPin, ShieldCheck, FileCheck2, Award, ArrowUpRight } from 'lucide-react';
import GccLogo from './GccLogo';

const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="mt-8 border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-[1500px] px-5 py-12 sm:px-7 lg:px-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <GccLogo className="h-12 w-12" />
              <div>
                <h3 className="text-lg font-black tracking-wide text-white">{t('app.name')}</h3>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{t('app.tagline')}</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-xs leading-7 text-slate-400">
              {language === 'en'
                ? 'Integrated electro-mechanical, fire protection, HVAC and engineering solutions delivered with disciplined execution and professional field support across Saudi Arabia.'
                : 'حلول هندسية وكهروميكانيكية متكاملة تشمل أنظمة الحريق والتكييف والأعمال الفنية، بتنفيذ منظم ودعم ميداني احترافي في المملكة العربية السعودية.'}
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-slate-950 transition hover:bg-slate-100"
            >
              {language === 'en' ? 'Talk to our team' : 'تواصل مع فريقنا'}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-4 text-[11px] font-black uppercase tracking-[0.16em] text-white">
              {language === 'en' ? 'Company' : 'الشركة'}
            </h4>
            <div className="space-y-3 text-xs font-semibold text-slate-400">
              <Link className="block transition hover:text-white" to="/about">{language === 'en' ? 'About GCC' : 'من نحن'}</Link>
              <Link className="block transition hover:text-white" to="/projects">{language === 'en' ? 'Projects' : 'المشاريع'}</Link>
              <Link className="block transition hover:text-white" to="/track">{language === 'en' ? 'Track Request' : 'تتبع الطلب'}</Link>
              <Link className="block transition hover:text-white" to="/contact">{language === 'en' ? 'Contact' : 'اتصل بنا'}</Link>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-4 text-[11px] font-black uppercase tracking-[0.16em] text-white">
              {language === 'en' ? 'Engineering Services' : 'الخدمات الهندسية'}
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <p>{language === 'en' ? 'Fire Fighting & Suppression' : 'أنظمة مكافحة وإطفاء الحريق'}</p>
              <p>{language === 'en' ? 'Fire Alarm Systems' : 'أنظمة إنذار الحريق'}</p>
              <p>{language === 'en' ? 'HVAC & Ventilation' : 'التكييف والتهوية'}</p>
              <p>{language === 'en' ? 'Electrical & Low Current' : 'الكهرباء والتيار الخفيف'}</p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-4 text-[11px] font-black uppercase tracking-[0.16em] text-white">
              {language === 'en' ? 'Contact' : 'التواصل'}
            </h4>
            <div className="space-y-4 text-xs text-slate-400">
              <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-500" /><span>Riyadh, Kingdom of Saudi Arabia</span></div>
              <a className="flex items-center gap-3 transition hover:text-white" href="tel:+966550307003"><Phone className="h-4 w-4 shrink-0 text-red-500" /><span>+966 55 030 7003</span></a>
              <a className="flex items-center gap-3 transition hover:text-white" href="mailto:Gcc@gccgr.com"><Mail className="h-4 w-4 shrink-0 text-red-500" /><span>Gcc@gccgr.com</span></a>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-3 border-t border-slate-800 pt-6 sm:grid-cols-3">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500"><ShieldCheck className="h-4 w-4 text-red-500" />{language === 'en' ? 'Civil Defense Standards' : 'معايير الدفاع المدني'}</div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500"><FileCheck2 className="h-4 w-4 text-blue-500" />{language === 'en' ? 'Saudi Building Code' : 'كود البناء السعودي'}</div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500"><Award className="h-4 w-4 text-emerald-500" />{language === 'en' ? 'Professional Engineering Delivery' : 'تنفيذ هندسي احترافي'}</div>
        </div>

        <div className="mt-6 border-t border-slate-800/70 pt-6 text-center text-[10px] font-semibold text-slate-600">
          © {new Date().getFullYear()} GCC COMPANY. {language === 'en' ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
