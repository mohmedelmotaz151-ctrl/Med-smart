import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { 
  Calendar, 
  ClipboardList, 
  MessageSquare, 
  User as UserIcon, 
  LogOut, 
  Globe,
  PlusCircle,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';

const Navbar: React.FC = () => {
  const { user, profile } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem('gcc_demo_user');
    localStorage.removeItem('gcc_demo_profile');
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Firebase signout failed", e);
    }
    // Force direct reload if needed or just navigate to flush state
    navigate('/login');
    window.location.reload();
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <nav className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-40">
      <div className="flex flex-col">
        <span className="text-lg font-black tracking-wider text-slate-900">{t('app.name')}</span>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight hidden sm:block leading-none mt-0.5">{t('app.tagline')}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest cursor-pointer">
          <button 
            onClick={() => setLanguage('en')}
            className={`${language === 'en' ? 'text-blue-600 underline underline-offset-4 font-extrabold' : 'text-slate-400'}`}
          >
            English
          </button>
          <span className="text-slate-300">|</span>
          <button 
            onClick={() => setLanguage('ar')}
            className={`font-sans ${language === 'ar' ? 'text-blue-600 underline underline-offset-4 font-extrabold' : 'text-slate-400'}`}
          >
            العربية
          </button>
        </div>

        <button 
          onClick={() => navigate('/sizer')}
          className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-5 py-2.5 font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-200 transition-all active:scale-95"
        >
          <PlusCircle size={16} />
          <span>{language === 'en' ? 'AI Consultation' : 'استشارة هندسية ذكية'}</span>
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

        {user && profile?.role === 'admin' ? (
          <div className="flex items-center gap-3">
            <Link to="/gcc-dashboard" className="flex items-center gap-3 group">
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-sm font-bold text-slate-800 group-hover:text-red-600 transition-colors">
                  {profile?.displayName || user.displayName || 'Admin'}
                </p>
                <p className="text-[10px] text-red-500 font-black uppercase tracking-tighter">
                  {language === 'en' ? 'System Administrator' : 'مدير النظام المعتمد'}
                </p>
              </div>
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border-2 border-red-500 shadow-sm" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-red-500 font-bold shadow-sm uppercase">
                  {user.email?.charAt(0) || 'A'}
                </div>
              )}
            </Link>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-300 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
              title={language === 'en' ? 'Logout Admin Session' : 'تسجيل الخروج'}
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
