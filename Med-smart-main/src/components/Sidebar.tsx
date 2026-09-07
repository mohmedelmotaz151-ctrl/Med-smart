import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  User, 
  Wrench, 
  Building2, 
  Calculator, 
  Mail,
  Settings,
  ClipboardList
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import GccLogo from './GccLogo';

const Sidebar: React.FC = () => {
  const { language, t } = useLanguage();
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Hidden 5x tap counter for the Logo
  const [logoClicks, setLogoClicks] = useState(0);

  // Hidden Keypress Hook (Ctrl + Shift + A) to open secret gate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        navigate('/login');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleLogoTap = (e: React.MouseEvent) => {
    e.preventDefault();
    setLogoClicks(prev => {
      const next = prev + 1;
      if (next >= 5) {
        navigate('/login');
        return 0;
      }
      return next;
    });
  };

  const baseItems = [
    { icon: <Home size={22} />, path: '/', label: language === 'en' ? 'Home' : 'الرئيسية' },
    { icon: <Wrench size={22} />, path: '/services', label: language === 'en' ? 'Services' : 'الخدمات' },
    { icon: <Building2 size={22} />, path: '/projects', label: language === 'en' ? 'Projects' : 'المشاريع' },
    { icon: <Calculator size={22} />, path: '/sizer', label: t('nav.sizer') },
    { icon: <Mail size={22} />, path: '/contact', label: language === 'en' ? 'Contact' : 'اتصل بنا' },
    { icon: <ClipboardList size={22} />, path: '/track', label: language === 'en' ? 'Track Quote' : 'تتبع السعر' },
  ];

  // Only display the admin panel link if the logged in user has role === 'admin'
  const navItems = profile?.role === 'admin' 
    ? [...baseItems, { icon: <Settings size={22} />, path: '/gcc-dashboard', label: language === 'en' ? 'Admin Panel' : 'لوحة الإدمن' }]
    : baseItems;

  return (
    <aside className="sidebar-width bg-slate-900 text-white border-r border-slate-800 flex flex-col items-center py-6 gap-6 z-50 shrink-0 h-full overflow-y-auto no-scrollbar">
      <button 
        onClick={handleLogoTap} 
        className="w-12 h-12 transition-transform active:scale-95 duration-200 cursor-pointer relative group flex items-center justify-center"
        title={language === 'en' ? 'GCC MEP Digital Portal (KSA)' : 'البوابة الرقمية لشركة GCC بالمملكة العربية السعودية'}
      >
        <GccLogo className="w-11 h-11" />
      </button>
      
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
