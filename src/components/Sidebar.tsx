import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  User, 
  Wrench, 
  Building2, 
  BrainCircuit, 
  Mail,
  Settings,
  ClipboardList
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Sidebar: React.FC = () => {
  const { language, t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { icon: <Home size={22} />, path: '/', label: language === 'en' ? 'Home' : 'الرئيسية' },
    { icon: <Wrench size={22} />, path: '/services', label: language === 'en' ? 'Services' : 'الخدمات' },
    { icon: <Building2 size={22} />, path: '/projects', label: language === 'en' ? 'Projects' : 'المشاريع' },
    { icon: <BrainCircuit size={22} />, path: '/sizer', label: t('nav.sizer') },
    { icon: <Mail size={22} />, path: '/contact', label: language === 'en' ? 'Contact' : 'اتصل بنا' },
    { icon: <ClipboardList size={22} />, path: '/track', label: language === 'en' ? 'Track Quote' : 'تتبع السعر' },
    { icon: <Settings size={22} />, path: '/admin', label: language === 'en' ? 'Admin Panel' : 'لوحة الإدمن' },
    { icon: <User size={22} />, path: '/profile', label: t('nav.profile') },
  ];

  return (
    <aside className="sidebar-width bg-slate-900 text-white border-r border-slate-800 flex flex-col items-center py-6 gap-8 z-50 shrink-0">
      <Link to="/" className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-red-900/30 transition-transform active:scale-95">
        GCC
      </Link>
      
      <nav className="flex flex-col gap-5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.label}
              className={`p-3.5 rounded-xl transition-all flex flex-col items-center gap-1 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 scale-105' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {item.icon}
              <span className="text-[9px] font-bold text-center leading-none mt-1 opacity-80">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <Link to="/about" className="text-xs text-slate-400 hover:text-white text-center font-bold font-sans uppercase tracking-tight py-1 px-2 border border-slate-700 hover:border-white rounded-md transition-all">
          {language === 'en' ? 'About' : 'من نحن'}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
