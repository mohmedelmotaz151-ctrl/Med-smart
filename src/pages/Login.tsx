import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Mail, 
  ChevronRight, 
  ArrowLeft,
  Shield,
  CheckCircle2,
  LockKeyhole
} from 'lucide-react';
import { motion } from 'motion/react';
import GccLogo from '../components/GccLogo';

const Login: React.FC = () => {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    setTimeout(() => {
      if (normalizedEmail === 'gcc@company.admin' && password === 'GCC2026') {
        const fakeUser = {
          uid: 'demo-admin-uid-999',
          email: 'GCC@company.admin',
          displayName: 'GCC System Controller',
          photoURL: null,
        };
        const fakeProfile = {
          uid: fakeUser.uid,
          email: fakeUser.email,
          displayName: fakeUser.displayName,
          photoURL: null,
          role: 'admin',
          createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('gcc_demo_user', JSON.stringify(fakeUser));
        localStorage.setItem('gcc_demo_profile', JSON.stringify(fakeProfile));
        localStorage.setItem('gcc_admin_jwt_sim', 'BYPASS_JWT_KEY_' + Date.now());

        setSuccessMsg(
          language === 'en'
            ? 'Access Authorized. Loading GCC Engineering Core Grid...'
            : 'تم التحقق من الصلاحيات الإدارية الفوقية بنجاح!'
        );

        setTimeout(() => {
          navigate('/gcc-dashboard');
          window.location.reload();
        }, 1200);
      } else {
        setLoading(false);
        setError(
          language === 'en'
            ? 'Invalid administrative credentials. Attempt logged in GCC firewall logs.'
            : 'عذراً، بيانات المرور والاعتماد غير صالحة. تم تسجيل رمز المحاولة في خوادم GCC الحيوية.'
        );
      }
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto mt-12 mb-20 px-4 font-sans text-right" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-geometric overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/80"
      >
        <div className="p-6 sm:p-8 md:p-10">
          {/* Logo Heading */}
          <div className="flex flex-col items-center text-center space-y-3 mb-8">
            <div className="w-20 h-20">
              <GccLogo />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-650 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-2 border border-red-100">
                <Shield className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'RESTRICTED PORTAL' : 'بوابة مشفرة ومحمية'}</span>
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                {language === 'en' ? 'GCC SYSTEM ADMINISTRATION' : 'منفذ الصلاحيات الإدارية'}
              </h1>
              <span className="text-slate-400 text-[10px] md:text-xs font-bold block mt-2 uppercase tracking-wide">
                {language === 'en' 
                  ? 'Authorized engineers and coordinators only' 
                  : 'خاص بالكوادر الهندسية والمدققين الماليين المعتمدين لشركة GCC'}
              </span>
            </div>
          </div>

          {/* Success screen micro-transition */}
          {successMsg ? (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2"
            >
              <CheckCircle2 className="text-emerald-500 mx-auto w-10 h-10" />
              <p className="text-emerald-950 text-sm font-black">{successMsg}</p>
              <p className="text-slate-400 text-[9px] font-semibold uppercase tracking-wider">
                {language === 'en' ? 'Synchronizing encrypted session...' : 'جاري تشفير تذكرة النواة...'}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleAdminAuthSubmit} className="space-y-5">
              
              {/* Email */}
              <div className="space-y-1 text-right">
                <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase block mr-1">
                  {language === 'en' ? 'System Email' : 'البريد الإلكتروني المعتمد'}
                </label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-red-600/10 focus:bg-white transition-all font-bold text-xs text-slate-900 text-center"
                    placeholder="GCC@company.admin"
                    required
                  />
                  <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1 text-right">
                <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase block mr-1">
                  {language === 'en' ? 'Security Password' : 'كلمة المرور الفوقية'}
                </label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-red-600/10 focus:bg-white transition-all font-bold text-xs text-slate-900 text-center"
                    placeholder="••••••••"
                    required
                  />
                  <LockKeyhole className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>
              </div>

              {error && (
                <div className="p-3.5 bg-red-50 border border-red-150 rounded-xl leading-relaxed text-center">
                  <p className="text-red-650 text-[11px] font-bold">{error}</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-950 text-white py-3.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 transform disabled:opacity-50"
              >
                <span>{loading ? (language === 'en' ? 'Verifying...' : 'جاري التحقق...') : (language === 'en' ? 'Verify & Authenticate' : 'مطابقة الهوية والدخول بالنظام')}</span>
                <ChevronRight size={14} className={language === 'ar' ? 'rotate-180' : ''} />
              </button>
            </form>
          )}
        </div>

        {/* Back to Home footer section */}
        <div className="bg-slate-50 p-5 flex items-center justify-center border-t border-slate-200">
          <button 
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            <ArrowLeft size={12} className={language === 'ar' ? 'rotate-180' : ''} />
            {language === 'en' ? 'Back to Home' : 'الرجوع للرئيسية'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
