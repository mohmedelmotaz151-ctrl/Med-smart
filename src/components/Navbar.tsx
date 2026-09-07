import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import {
  Menu,
  X,
  Globe2,
  User as UserIcon,
  LogOut,
  ArrowUpRight,
  Settings,
} from 'lucide-react';
import GccLogo from './GccLogo';

const Navbar: React.FC = () => {
  const { user, profile } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem('gcc_demo_user');
    localStorage.removeItem('gcc_demo_profile');
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signout failed', e);
    }
    navigate('/login');
    window.location.reload();
  };

  const links = [
    { path: '/', en: 'Home', ar: 'الرئيسية' },
    { path: '/about', en: 'About', ar: 'من نحن' },
    { path: '/services', en: 'Services', ar: 'الخدمات' },
    { path: '/projects', en: 'Projects', ar: 'المشاريع' },
    { path: '/sizer', en: 'Engineering AI', ar: 'الحلول الهندسية' },
    { path: '/track', en: 'Track Request', ar: 'تتبع الطلب' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-[0_1px_0_rgba(15,23,42,0.03)]">
      <div className="mx-auto flex h-[78px] w-full max-w-[1500px] items-center justify-between gap-5 px-5 sm:px-7 lg:px-10">
        <button
          onClick={() => navigate('/')}
          className="group flex min-w-0 items-center gap-3 text-start"
          title={language === 'en' ? 'GCC Company' : 'شركة جي سي سي'}
        >
          <GccLogo className="h-11 w-11 shrink-0 transition-transform duration-300 group-hover:scale-105" />
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-black tracking-[0.04em] text-slate-950 sm:text-[17px]">
              {t('app.name')}
            </span>
            <span className="mt-0.5 hidden truncate text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:block">
              {t('app.tagline')}
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 xl:flex">
          {links.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative rounded-xl px-3.5 py-2.5 text-[12px] font-extrabold transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              {language === 'en' ? item.en : item.ar}
            </Link>
          ))}
          {profile?.role === 'admin' && (
            <Link
              to="/gcc-dashboard"
              className={`rounded-xl px-3.5 py-2.5 text-[12px] font-extrabold transition-all ${
                isActive('/gcc-dashboard') || isActive('/admin')
                  ? 'bg-slate-950 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              {language === 'en' ? 'Admin' : 'الإدارة'}
            </Link>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-extrabold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 sm:flex"
          >
            <Globe2 className="h-4 w-4" />
            {language === 'en' ? 'العربية' : 'English'}
          </button>

          <button
            onClick={() => navigate('/contact')}
            className="hidden h-10 items-center gap-2 rounded-xl bg-red-650 px-4 text-[11px] font-black text-white shadow-[0_8px_24px_rgba(220,38,80,0.20)] transition hover:-translate-y-0.5 hover:bg-red-700 lg:flex"
          >
            {language === 'en' ? 'Request a Quote' : 'اطلب عرض سعر'}
            <ArrowUpRight className="h-4 w-4" />
          </button>

          {user && (
            <div className="hidden items-center gap-1 md:flex">
              <button
                onClick={() => navigate('/profile')}
                className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
                title={language === 'en' ? 'Profile' : 'الملف الشخصي'}
              >
                <UserIcon className="h-4 w-4" />
              </button>
              <button
                onClick={handleLogout}
                className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                title={language === 'en' ? 'Sign out' : 'تسجيل الخروج'}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 xl:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-5 py-4 shadow-xl xl:hidden">
          <div className="mx-auto grid max-w-[1500px] gap-1">
            {links.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-extrabold ${
                  isActive(item.path) ? 'bg-slate-950 text-white' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {language === 'en' ? item.en : item.ar}
              </Link>
            ))}
            {profile?.role === 'admin' && (
              <Link
                to="/gcc-dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
              >
                <Settings className="h-4 w-4" />
                {language === 'en' ? 'Admin Panel' : 'لوحة الإدارة'}
              </Link>
            )}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => {
                  setLanguage(language === 'en' ? 'ar' : 'en');
                  setMenuOpen(false);
                }}
                className="rounded-xl border border-slate-200 px-4 py-3 text-xs font-black text-slate-700"
              >
                {language === 'en' ? 'العربية' : 'English'}
              </button>
              <button
                onClick={() => {
                  navigate('/contact');
                  setMenuOpen(false);
                }}
                className="rounded-xl bg-red-650 px-4 py-3 text-xs font-black text-white"
              >
                {language === 'en' ? 'Request Quote' : 'اطلب عرض سعر'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
