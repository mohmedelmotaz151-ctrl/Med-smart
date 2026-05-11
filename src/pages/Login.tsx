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
  Stethoscope
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
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 mb-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-geometric shadow-xl shadow-slate-200 overflow-hidden"
      >
        <div className="p-8 md:p-10">
          <div className="flex flex-col items-center text-center space-y-4 mb-10">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
              <Stethoscope className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                {isRegister ? t('auth.register') : t('auth.login')}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Access your health records and book consultations
              </p>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                  placeholder="name@example.com"
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-medium text-center bg-red-50 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 transform">
              {isRegister ? t('auth.register') : t('auth.login')}
              <ChevronRight size={20} />
            </button>
          </form>

          <div className="relative my-10 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <span className="relative bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Or continue with</span>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 transform"
          >
            <Chrome className="text-red-500" size={20} />
            Google
          </button>

          <div className="mt-10 text-center">
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm font-bold text-blue-600 hover:underline"
            >
              {isRegister 
                ? (language === 'en' ? 'Already have an account? Login' : 'لديك حساب بالفعل؟ تسجيل الدخول')
                : (language === 'en' ? "Don't have an account? Register" : 'ليس لديك حساب؟ إنشاء حساب')
              }
            </button>
          </div>
        </div>

        <div className="bg-slate-50 p-6 flex items-center justify-center gap-2">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
