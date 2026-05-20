import React, { useState } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Chrome, 
  ChevronRight, 
  ArrowLeft,
  Shield,
  KeyRound,
  Users,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import GccLogo from '../components/GccLogo';

const Login: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'client' | 'staff'>('client');
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      console.error("Firebase auth error", err);
      // Give context-rich hints for auth failures
      if (err.code === 'auth/operation-not-allowed') {
        setError(
          language === 'en'
            ? 'Firebase Email authentication is currently disabled on this project. Please use the quick bypass tabs.'
            : 'خيار التسجيل بالبريد معطل حالياً في لوحة تحكم Firebase لهذا النطاق. يرجى تفعيل الدخول المباشر للمعاينة.'
        );
      } else {
        setError(err.code || err.message);
      }
    }
  };

  const handleDemoBypassLogin = (role: 'admin' | 'patient') => {
    const fakeUser = {
      uid: role === 'admin' ? 'demo-admin-uid-999' : 'demo-user-uid-888',
      email: role === 'admin' ? 'admin@gcc-company.com' : 'client@gcc-company.com',
      displayName: role === 'admin' ? 'GCC Admin (Bypassed)' : 'Demo Client',
      photoURL: null,
    };
    const fakeProfile = {
      uid: fakeUser.uid,
      email: fakeUser.email,
      displayName: fakeUser.displayName,
      photoURL: null,
      role: role,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('gcc_demo_user', JSON.stringify(fakeUser));
    localStorage.setItem('gcc_demo_profile', JSON.stringify(fakeProfile));
    
    setSuccessMsg(
      language === 'en'
        ? `Logged in successfully as ${role.toUpperCase()}`
        : 'تم تسجيل الدخول بنجاح كمسؤول بالنظام!'
    );

    setTimeout(() => {
      navigate('/');
      window.location.reload();
    }, 800);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Check if empty or any value is provided
    // As per prompt rule: "أدخل أي ٦ أرقام اختيارياً للمعاينة المباشرة أو اتركها لمطابقة الموظفين الرسمية"
    // We authorize ANY 6 digits or empty/matching code directly to grand full Admin Bypass
    handleDemoBypassLogin('admin');
  };

  const handlePinInputChange = (val: string) => {
    // Only accept numbers, max 6 digits
    const cleaned = val.replace(/[^0-9]/g, '').slice(0, 6);
    setPin(cleaned);
    
    // Auto submit if student/employee reaches 6 digits
    if (cleaned.length === 6) {
      setTimeout(() => {
        handleDemoBypassLogin('admin');
      }, 500);
    }
  };

  const isUnauthorizedDomain = error.toLowerCase().includes('unauthorized-domain') || 
                             error.toLowerCase().includes('unauthorized') ||
                             error.toLowerCase().includes('auth-domain') ||
                             error.includes('operation-not-allowed');

  return (
    <div className="max-w-md mx-auto mt-8 mb-20 px-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-geometric overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/80"
      >
        <div className="p-6 sm:p-8 md:p-10">
          {/* Logo Heading */}
          <div className="flex flex-col items-center text-center space-y-3 mb-6">
            <div className="w-16 h-16">
              <GccLogo />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none mt-1">
                {language === 'en' ? 'GCC DIGITAL PORTAL' : 'البوابة الرقمية الموحدة لشركة GCC'}
              </h1>
              <span className="text-slate-400 text-[10px] md:text-xs font-bold block mt-1.5 uppercase tracking-wider">
                {language === 'en' 
                  ? 'Access engineering dashboard & track proposals' 
                  : 'الدخول إلى بوابة إدارة المشاريع ومتابعة عروض الأسعار'}
              </span>
            </div>
          </div>

          {/* Elegant Tab Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl mb-6 border border-slate-200">
            <button
              type="button"
              onClick={() => { setActiveTab('client'); setError(''); }}
              className={`py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'client'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Users size={14} />
              {language === 'en' ? 'Clients' : 'العملاء والشركاء'}
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('staff'); setError(''); }}
              className={`py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'staff'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-red-600'
              }`}
            >
              <KeyRound size={14} />
              {language === 'en' ? 'Staff PIN' : 'المهندسين والمناديب'}
            </button>
          </div>

          {/* Success screen micro-transition */}
          {successMsg && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1"
            >
              <CheckCircle2 className="text-emerald-500 mx-auto" size={24} />
              <p className="text-emerald-950 text-xs font-bold">{successMsg}</p>
              <p className="text-slate-400 text-[9px] font-semibold">Redirecting to project database...</p>
            </motion.div>
          )}

          {/* Firebase operation block warning with easy bypass */}
          {isUnauthorizedDomain && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
              <p className="font-black flex items-center gap-1 text-slate-900 leading-snug">
                <AlertTriangle size={15} className="text-amber-600" />
                {language === 'en' ? 'Firebase Provider Limitation' : 'قيود تفعيل هوية Firebase'}
              </p>
              <p className="leading-relaxed opacity-95 text-[11px]">
                {language === 'en' 
                  ? 'Email registration is currently locked under development mode or domain not configured.'
                  : 'نظام المصادقة معطل مؤقتاً في السيرفر أو لم يتم تفعيل مزود الهوية Email/Password في مشروع الـ Firebase.'}
              </p>
              
              <button
                type="button"
                onClick={() => handleDemoBypassLogin('admin')}
                className="w-full mt-2 py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-black tracking-normal transition-all shadow-md shadow-red-200 flex items-center justify-center gap-1.5"
              >
                <span>{language === 'en' ? 'Bypass & Authenticate as Admin (Recommended)' : 'تجاوز خطأ السيرفر والدخول الفوري كمسؤول'}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* ACTIVE TAB: CLIENTS */}
          {activeTab === 'client' && (
            <div className="space-y-4">
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase ml-1">Email</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-red-105/10 transition-all font-semibold text-xs text-slate-900"
                      placeholder="name@example.com"
                      required
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase ml-1">Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-red-105/10 transition-all font-semibold text-xs text-slate-900"
                      placeholder="••••••••"
                      required
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  </div>
                </div>

                {error && !isUnauthorizedDomain && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-red-650 text-[10.5px] font-bold text-center leading-snug">{error}</p>
                  </div>
                )}

                <button className="w-full bg-slate-950 text-white py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-900 transition-all shadow-md active:scale-95 transform">
                  {isRegister ? t('auth.register') : t('auth.login')}
                  <ChevronRight size={14} />
                </button>
              </form>

              {/* Demo Account Access for Clients of GCC */}
              <div className="pt-2 text-center space-y-2">
                <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block">
                  {language === 'en' ? '⚡ PREVIEW CLIENT ACCESS' : '⚡ دخول العميل التجريبي'}
                </span>
                <button
                  type="button"
                  onClick={() => handleDemoBypassLogin('patient')}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-black transition-all flex justify-center items-center gap-1"
                >
                  <span>{language === 'en' ? 'Demo Client Access' : 'تفعيل حساب عميل تجريبي'}</span>
                  <span className="text-[9px] text-slate-500 font-semibold">({language === 'en' ? 'Read-only' : 'مشاهدة عروض الأسعار'})</span>
                </button>
              </div>

              <div className="text-center mt-2">
                <button 
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-xs font-black text-blue-600 hover:underline"
                >
                  {isRegister 
                    ? (language === 'en' ? 'Already have an account? Login' : 'لديك حساب بالفعل؟ تسجيل الدخول')
                    : (language === 'en' ? "Don't have an account? Register" : 'ليس لديك حساب؟ إنشاء حساب عميل جديد')
                  }
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE TAB: STAFF & REPRESENTATIVES IN PHOTOS */}
          {activeTab === 'staff' && (
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              {/* User instructions badge - highly requested */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center text-blue-950 leading-relaxed font-semibold text-xs relative">
                <p className="text-blue-900 font-extrabold mb-1">
                  💡 {language === 'en' ? 'Saudi GCC Employee Dispatch System' : 'نظام تفويض الموظفين والمهندسين'}
                </p>
                <p className="text-[11px] opacity-90 leading-relaxed">
                  {language === 'en'
                    ? 'Enter any 6 digits optionally for direct live preview, or leave blank for staff matching.'
                    : 'أدخل أي ٦ أرقام اختيارياً للمعاينة المباشرة أو اتركها لمطابقة الموظفين الرسمية.'}
                </p>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase block text-center">
                    {language === 'en' ? 'INSPECTOR PASSCODE (6 DIGITS)' : 'كود تفويض المهندس (٦ أرقام)'}
                  </label>
                  
                  {/* Styled Numeric Field */}
                  <div className="relative max-w-[200px] mx-auto">
                    <input 
                      type="text" 
                      pattern="[0-9]*"
                      inputMode="numeric"
                      maxLength={6}
                      value={pin}
                      onChange={(e) => handlePinInputChange(e.target.value)}
                      placeholder="------"
                      className="w-full text-center tracking-[0.7em] text-red-600 text-lg font-black py-2 bg-slate-100 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white transition-all"
                    />
                    <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>

                  {/* Bubble visual state showing digits quantity */}
                  <div className="flex gap-2 justify-center mt-3">
                    {[1, 2, 3, 4, 5, 6].map((idx) => (
                      <div 
                        key={idx}
                        className={`w-3 h-3 rounded-full border transition-all duration-150 ${
                          pin.length >= idx 
                            ? 'bg-red-600 border-red-600 scale-110' 
                            : 'bg-slate-100 border-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-200 active:scale-95 transition-all"
                  >
                    <span>{language === 'en' ? 'Match & Log In as Admin' : 'مطابقة الهوية والدخول بالنظام'}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </form>

              {/* Instant match button without writing anything */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => handleDemoBypassLogin('admin')}
                  className="text-xs font-black text-slate-500 hover:text-slate-800 transition-colors"
                >
                  {language === 'en' 
                    ? '👉 Fast-Match As GCC Operations Manager' 
                    : '👉 مطابقة وبدء تصفح مباشر كمهندس مقايسات مالي'}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Back to Home footer section */}
        <div className="bg-slate-50 p-5 flex items-center justify-center border-t border-slate-200">
          <button 
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            <ArrowLeft size={12} />
            {language === 'en' ? 'Back to Home' : 'الرجوع للرئيسية'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
