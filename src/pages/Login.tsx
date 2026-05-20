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
  Shield
} from 'lucide-react';
import { motion } from 'motion/react';

const Login: React.FC = () => {
  const { t, language } = useLanguage();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      console.error("Firebase auth error", err);
      setError(err.code || err.message);
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
    
    navigate('/');
    window.location.reload();
  };

  const isUnauthorizedDomain = error.toLowerCase().includes('unauthorized-domain') || 
                             error.toLowerCase().includes('unauthorized') ||
                             error.toLowerCase().includes('auth-domain');

  return (
    <div className="max-w-md mx-auto mt-12 mb-20 px-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-geometric shadow-xl shadow-slate-200 overflow-hidden bg-white border border-slate-200 rounded-3xl"
      >
        <div className="p-8 md:p-10">
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="bg-red-650 p-3 rounded-2xl shadow-lg shadow-red-100">
              <Shield className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {isRegister ? t('auth.register') : t('auth.login')}
              </h1>
              <span className="text-slate-400 text-xs font-semibold block mt-1">
                {language === 'en' 
                  ? 'Access engineering dashboard & request followups' 
                  : 'الدخول إلى بوابة إدارة المشاريع ومتابعة عروض الأسعار'}
              </span>
            </div>
          </div>

          {/* Trouble whitelisting domains helper */}
          {isUnauthorizedDomain && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2.5">
              <p className="font-extrabold flex items-center gap-1.5 leading-snug">
                ⚠️ {language === 'en' ? 'Firebase Domains Authorization Block' : 'تنبيه: نطاق تصفح غير مصرح به في Firebase'}
              </p>
              <p className="leading-relaxed opacity-95">
                {language === 'en' 
                  ? 'This preview environment runs on a dynamic URL which is not whitelisted inside your Firebase Authentication settings.'
                  : 'نطاق استعراض الموقع الحالي لا يظهر ضمن النطاقات المعتمدة (Authorized Domains) في إعدادات تفعيل مشروع Firebase.'}
              </p>
              <div className="p-2 bg-white rounded-lg border border-amber-200 font-mono text-[10.5px] select-all break-all text-slate-800 font-semibold">
                {window.location.hostname}
              </div>
              <p className="leading-normal font-bold">
                {language === 'en' 
                  ? ' 👉 Fix: Copy domain above and add it to Firebase Console -> Authentication -> Settings -> Authorized Domains.'
                  : '👉 الحل السريع: انسخ الرابط أعلاه وأضفه في لوحة تحكّم Firebase Console تحت النطاقات المعتمدة.'}
              </p>
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase ml-1">Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-red-105/10 transition-all font-semibold text-xs"
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-red-105/10 transition-all font-semibold text-xs"
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl space-y-1">
                <p className="text-red-650 text-[10.5px] font-bold text-center leading-snug">
                  {error}
                </p>
                <p className="text-slate-400 text-[9px] text-center font-bold">
                  {language === 'en' ? 'Tip: You can use the quick bypass demo mode below' : 'تلميح: يمكنك اختيار الدخول كمسؤول تجريبياً بأسفل النموذج'}
                </p>
              </div>
            )}

            <button className="w-full bg-red-600 text-white py-3.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-md shadow-red-100 active:scale-95 transform">
              {isRegister ? t('auth.register') : t('auth.login')}
              <ChevronRight size={16} />
            </button>
          </form>

          {/* Quick Demo Bypass Access Section (Highly visible and premium UX) */}
          <div className="mt-6 pt-5 border-t border-slate-150 space-y-3.5 text-center">
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">
              {language === 'en' ? '⚡ PREVIEW BYPASS' : '⚡ الدخول السريع للمعاينة'}
            </span>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleDemoBypassLogin('patient')}
                className="w-full px-4 py-3 bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-black tracking-tight hover:bg-slate-200 transition-all flex flex-col justify-center items-center shadow-sm"
              >
                <span>{language === 'en' ? 'Demo Client Access' : 'تفعيل حساب عميل تجريبي'}</span>
                <span className="text-[9.5px] text-slate-450 mt-0.5 uppercase tracking-wider">{language === 'en' ? 'Track Sizers & Proposals' : 'متابعة الطلبات الميكانيكية وعروض الأسعار'}</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs font-extrabold text-red-600 hover:underline"
            >
              {isRegister 
                ? (language === 'en' ? 'Already have an account? Login' : 'لديك حساب بالفعل؟ تسجيل الدخول')
                : (language === 'en' ? "Don't have an account? Register" : 'ليس لديك حساب؟ إنشاء حساب جديد في النظام')
              }
            </button>
          </div>
        </div>

        <div className="bg-slate-50 p-5 flex items-center justify-center border-t border-slate-200">
          <button 
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

