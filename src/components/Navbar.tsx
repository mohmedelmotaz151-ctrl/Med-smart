import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { 
  Stethoscope, 
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
    await signOut(auth);
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <nav className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-40">
      <div className="flex items-center gap-4 bg-slate-100 rounded-full px-4 py-2 w-full max-w-md border border-slate-200/50">
        <Search className="text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder={t('home.search_placeholder')}
          className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-slate-400 font-medium"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest cursor-pointer">
          <button 
            onClick={() => setLanguage('en')}
            className={`${language === 'en' ? 'text-sky-600 underline underline-offset-4' : 'text-slate-400'}`}
          >
            English
          </button>
          <span className="text-slate-300">|</span>
          <button 
            onClick={() => setLanguage('ar')}
            className={`font-sans ${language === 'ar' ? 'text-sky-600 underline underline-offset-4' : 'text-slate-400'}`}
          >
            العربية
          </button>
        </div>

        <button 
          onClick={() => navigate('/chat/ai')}
          className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-5 py-2.5 font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-100 transition-all active:scale-95"
        >
          <PlusCircle size={18} />
          <span>{language === 'en' ? 'Emergency' : 'طوارئ'}</span>
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

        {user ? (
          <div className="flex items-center gap-3">
            <Link to="/profile" className="flex items-center gap-3 group">
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-sm font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                  {profile?.displayName || user.displayName || 'User'}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                  {profile?.role || 'Patient'}
                </p>
              </div>
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold border-2 border-white shadow-sm uppercase">
                  {user.email?.charAt(0)}
                </div>
              )}
            </Link>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-300 hover:text-red-500 rounded-lg transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <Link 
            to="/login"
            className="bg-sky-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-sky-700 transition-colors shadow-lg shadow-sky-100 text-sm"
          >
            {t('auth.login')}
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
