import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { Menu, X, Globe2, ShieldCheck, Sparkles, LogOut } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import GccLogo from './GccLogo';

const Navbar: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const items = [
    ['/', language === 'en' ? 'Home' : 'الرئيسية'],
    ['/about', language === 'en' ? 'About' : 'من نحن'],
    ['/services', language === 'en' ? 'Services' : 'الخدمات'],
    ['/projects', language === 'en' ? 'Projects' : 'المشاريع'],
    ['/track', language === 'en' ? 'Track request' : 'تتبع الطلب'],
    ['/contact', language === 'en' ? 'Contact' : 'تواصل معنا'],
  ];

  const logout = async () => { await signOut(auth); navigate('/'); };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="site-shell flex h-20 items-center justify-between gap-5">
        <Link to="/" className="flex items-center gap-3.5 min-w-0">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-950 p-2 shadow-sm"><GccLogo /></span>
          <span className="min-w-0"><strong className="block truncate text-base font-black tracking-tight text-slate-950">GCC COMPANY</strong><small className="block truncate text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">Engineering · MEP · Safety</small></span>
        </Link>

        <nav className="hidden xl:flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50/80 p-1.5">
          {items.map(([path,label]) => <NavLink key={path} to={path} className={({isActive})=>`rounded-xl px-3.5 py-2 text-xs font-extrabold transition ${isActive?'bg-white text-slate-950 shadow-sm ring-1 ring-slate-200':'text-slate-500 hover:text-slate-950'}`}>{label}</NavLink>)}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <button onClick={()=>setLanguage(language==='en'?'ar':'en')} className="secondary-button"><Globe2 size={16}/>{language==='en'?'العربية':'English'}</button>
          <Link to="/sizer" className="primary-button"><Sparkles size={16}/>{language==='en'?'AI consultation':'استشارة ذكية'}</Link>
          {isAdmin && <Link to="/gcc-dashboard" className="secondary-button"><ShieldCheck size={16}/>{language==='en'?'Admin':'الإدارة'}</Link>}
          {user && <button onClick={logout} className="icon-button" title={profile?.displayName || user.email || ''}><LogOut size={17}/></button>}
        </div>

        <button onClick={()=>setOpen(v=>!v)} className="icon-button lg:hidden" aria-label="Menu">{open?<X/>:<Menu/>}</button>
      </div>
      {open && <div className="site-shell border-t border-slate-100 py-4 lg:hidden">
        <div className="grid gap-1.5">
          {items.map(([path,label]) => <NavLink onClick={()=>setOpen(false)} key={path} to={path} className={({isActive})=>`rounded-xl px-4 py-3 text-sm font-bold ${isActive?'bg-slate-950 text-white':'bg-slate-50 text-slate-700'}`}>{label}</NavLink>)}
          <Link onClick={()=>setOpen(false)} to="/sizer" className="primary-button mt-2 justify-center"><Sparkles size={16}/>{language==='en'?'AI consultation':'استشارة هندسية ذكية'}</Link>
          {isAdmin && <Link onClick={()=>setOpen(false)} to="/gcc-dashboard" className="secondary-button justify-center"><ShieldCheck size={16}/>{language==='en'?'Administration':'لوحة الإدارة'}</Link>}
          <button onClick={()=>setLanguage(language==='en'?'ar':'en')} className="secondary-button justify-center"><Globe2 size={16}/>{language==='en'?'العربية':'English'}</button>
        </div>
      </div>}
    </header>
  );
};
export default Navbar;
