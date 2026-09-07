import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LockKeyhole, Mail, ShieldCheck, Loader2 } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useLanguage } from '../contexts/LanguageContext';
import GccLogo from '../components/GccLogo';

const Login: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate('/gcc-dashboard', { replace: true });
    } catch {
      setError(language === 'en'
        ? 'The email or password is incorrect, or this account is not authorized.'
        : 'البريد الإلكتروني أو كلمة المرور غير صحيحة، أو أن الحساب غير مصرح له.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center py-12" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} className="w-full max-w-md premium-panel p-7 sm:p-9">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-slate-950 p-2.5"><GccLogo /></div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-emerald-700 text-[11px] font-extrabold mb-1"><ShieldCheck size={14}/>{language === 'en' ? 'SECURE ACCESS' : 'دخول آمن'}</div>
            <h1 className="text-2xl font-black text-slate-950">{language === 'en' ? 'Administration Portal' : 'بوابة الإدارة'}</h1>
            <p className="text-sm text-slate-500 mt-1">{language === 'en' ? 'Authorized GCC team members only.' : 'للمستخدمين المصرح لهم من فريق GCC فقط.'}</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <label className="block">
            <span className="field-label">{language === 'en' ? 'Email address' : 'البريد الإلكتروني'}</span>
            <div className="relative mt-2"><Mail size={18} className="field-icon"/><input className="modern-input ps-11" type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
          </label>
          <label className="block">
            <span className="field-label">{language === 'en' ? 'Password' : 'كلمة المرور'}</span>
            <div className="relative mt-2"><LockKeyhole size={18} className="field-icon"/><input className="modern-input ps-11" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
          </label>
          {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
          <button disabled={loading} className="primary-button w-full justify-center py-3.5 disabled:opacity-60">
            {loading ? <Loader2 size={18} className="animate-spin"/> : <LockKeyhole size={18}/>} {language === 'en' ? 'Sign in securely' : 'تسجيل الدخول الآمن'}
          </button>
        </form>
        <p className="mt-6 text-center text-[11px] leading-5 text-slate-400">{language === 'en' ? 'Authentication is handled by Firebase. Administrative privileges are read from the protected user profile.' : 'تتم المصادقة عبر Firebase، وتُقرأ صلاحية الإدارة من ملف المستخدم المحمي في قاعدة البيانات.'}</p>
      </motion.div>
    </div>
  );
};

export default Login;
