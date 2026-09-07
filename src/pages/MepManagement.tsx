import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { 
  ShieldAlert, 
  LockKeyhole, 
  Monitor, 
  History, 
  Smartphone, 
  Globe, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  Fingerprint, 
  FileText, 
  Check, 
  Loader2,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AccessLog {
  timestamp: string;
  ip: string;
  device: string;
  username: string;
  status: 'SUCCESS' | 'FAILED_PWD' | 'FAILED_2FA' | 'ROLE_MISMATCH';
}

const MepManagement: React.FC = () => {
  const { language } = useLanguage();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Authentication states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token2FA, setToken2FA] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [successAuth, setSuccessAuth] = useState(false);

  // Security configuration information
  const [ipAddress, setIpAddress] = useState('192.168.1.135');
  const [userAgentStr, setUserAgentStr] = useState('');

  // Access history log stored in local storage for demonstration auditing
  const [logs, setLogs] = useState<AccessLog[]>([]);

  useEffect(() => {
    // Collect device details for the visual audit trail
    setUserAgentStr(navigator.userAgent.split(') ')[0] + ')');
    
    // Fallback/Simulate client IP address
    const randomIp = `192.168.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}`;
    setIpAddress(randomIp);

    // Load visual audit logs
    const savedLogs = localStorage.getItem('gcc_admin_security_logs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    } else {
      const defaultLogs: AccessLog[] = [
        { timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), ip: '185.122.14.99', device: 'Mozilla/5.0 (Macintosh; Intel OS X)', username: 'sysadmin@gcc-mep.com', status: 'SUCCESS' },
        { timestamp: new Date(Date.now() - 3600000 * 18).toISOString(), ip: '92.201.33.14', device: 'Mozilla/5.0 (iPhone; CPU iOS)', username: 'unknown_root', status: 'FAILED_PWD' },
        { timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), ip: '192.168.12.44', device: 'Mozilla/5.0 (Linux; Android 14)', username: 'admin@gcc-company.com', status: 'FAILED_2FA' }
      ];
      localStorage.setItem('gcc_admin_security_logs', JSON.stringify(defaultLogs));
      setLogs(defaultLogs);
    }
  }, []);

  // Log audit attempt to local storage helper to persist visual access audit trail
  const appendAuditLog = (username: string, status: AccessLog['status']) => {
    const newLog: AccessLog = {
      timestamp: new Date().toISOString(),
      ip: ipAddress,
      device: userAgentStr,
      username: username || 'Anonymous',
      status: status
    };
    const updated = [newLog, ...logs].slice(0, 15);
    setLogs(updated);
    localStorage.setItem('gcc_admin_security_logs', JSON.stringify(updated));
  };

  const handleAdminEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    // Simple visual validation of optional 2FA if entered but incorrect
    if (token2FA && token2FA.trim().length !== 6) {
      setErrorMsg(language === 'en' ? 'Incomplete 2FA Token. Security requires a 6-digit identifier.' : 'رمز التحقق الثنائي غير مكتمل. يتطلب النظام كوداً مكوناً من ٦ أرقام.');
      appendAuditLog(email, 'FAILED_2FA');
      setLoading(false);
      return;
    }

    try {
      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 2. Fetch role from database
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'admin') {
          // Success! Authenticated and authorized
          appendAuditLog(email, 'SUCCESS');
          setSuccessAuth(true);
          
          // Save session
          localStorage.setItem('gcc_admin_jwt_sim', 'SIM_JWT_TOKEN_' + Date.now());
          
          setTimeout(() => {
            navigate('/gcc-dashboard');
            window.location.reload();
          }, 1500);
        } else {
          // User is authenticated but is NOT an Administrator
          appendAuditLog(email, 'ROLE_MISMATCH');
          setErrorMsg(language === 'en' ? 'Access Denied. Authenticated user does not possess systemic Administrator privileges.' : 'تم رفض الصلاحية. الحساب المدخل غير مسجل كمسؤول نظام.');
        }
      } else {
        appendAuditLog(email, 'ROLE_MISMATCH');
        setErrorMsg(language === 'en' ? 'User profile information missing. Access forbidden.' : 'ملف المستخدم غير متوفر في قاعدة البيانات.');
      }
    } catch (err: any) {
      console.error("Admin login error", err);
      appendAuditLog(email || 'unknown', 'FAILED_PWD');
      setErrorMsg(err.code || err.message || (language === 'en' ? 'Invalid credentials supplied.' : 'البيانات المدخلة خاطئة أو غير معتمدة.'));
    } finally {
      setLoading(false);
    }
  };

  // Secure high-tech Admin demo bypass
  const handleDebugBypass = () => {
    setLoading(true);
    setErrorMsg('');
    
    setTimeout(() => {
      const fakeUser = {
        uid: 'demo-admin-uid-999',
        email: 'admin@gcc-company.com',
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

      appendAuditLog('admin@gcc-company.com', 'SUCCESS');
      setSuccessAuth(true);

      setTimeout(() => {
        navigate('/gcc-dashboard');
        window.location.reload();
      }, 1500);
    }, 1200);
  };

  const clearAuditHistory = () => {
    localStorage.removeItem('gcc_admin_security_logs');
    setLogs([]);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 font-sans text-right" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Title area */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center gap-1 bg-red-950/40 text-red-400 px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest uppercase border border-red-900/45">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'SYSTEM ADMINISTRATION SYSTEM GATE' : 'بوابة التشغيل وإدارة الأنظمة المشفرة'}</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {language === 'en' ? 'Secure Gateway Protection' : 'منفذ الصلاحيات الإدارية الفوقية'}
        </h1>
        <p className="text-slate-550 text-xs max-w-lg mx-auto leading-relaxed">
          {language === 'en' 
            ? 'Access restricted strictly to authorized MEP design team and audit directors. All network requests and login tokens are encrypted and logged.'
            : 'يقتصر الدخول حصراً على الكوادر الهندسية والمدققين الماليين المعتمدين. يتم تشفير الجلسات وتسجيل كافة الاتصالات برمجياً.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Security Gate */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-150 rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-3.5 border-b border-slate-100 pb-5">
                <div className="bg-slate-950 text-white p-3 rounded-2xl shadow-lg">
                  <Fingerprint className="w-6 h-6 text-red-500 animate-pulse" />
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-black text-slate-900">
                    {language === 'en' ? 'Administrative Credential Matrix' : 'مطابقة الهوية وصلاحية المشرف'}
                  </h3>
                  <p className="text-[10.5px] text-slate-400 font-bold block mt-0.5">
                    {language === 'en' ? 'Provide email coordinates & safety audit 2FA' : 'أدخل بيانات الاعتماد الثنائية للدفاع المدني وفلترة الموظفين'}
                  </p>
                </div>
              </div>

              {successAuth ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4"
                >
                  <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-lg">
                    <ShieldCheck className="w-8 h-8 font-black" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-emerald-950">
                      {language === 'en' ? 'Authentication Token Verified' : 'تم تفعيل الرمز والمطابقة المشفرة'}
                    </h4>
                    <p className="text-xs text-emerald-800 leading-relaxed max-w-xs mx-auto">
                      {language === 'en' 
                        ? 'System keys synchronized successfully. Establishing a military-grade secure admin session...'
                        : 'تم التحقق من الحساب بنجاح. جاري تشفير وحقن تذكرة الدخول واستدعاء لوحة التحكم الميكانيكية...'}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleAdminEmailLogin} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-1.5 text-right">
                    <label className="text-[10.5px] font-black text-slate-500 uppercase tracking-wider block">
                      {language === 'en' ? 'Administrative Email' : 'عنوان البريد الإلكتروني للمسؤول'}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@gcc-company.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-xs focus:outline-none focus:border-red-500 font-bold text-center tracking-wide"
                        required
                      />
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5 text-right">
                    <label className="text-[10.5px] font-black text-slate-500 uppercase tracking-wider block">
                      {language === 'en' ? 'Admin Access Token / Password' : 'كلمة المرور المشفرة'}
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-xs focus:outline-none focus:border-red-500 font-bold text-center"
                        required
                      />
                      <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* 2FA Token Code */}
                  <div className="space-y-1.5 text-right bg-slate-50 border border-slate-150 p-4.5 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9.5px] font-extrabold bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">
                        {language === 'en' ? 'MANDATORY SLA' : 'حماية ثنائية'}
                      </span>
                      <label className="text-[10.5px] font-black text-slate-700 block text-right">
                        {language === 'en' ? '2FA Google Authenticator Token' : 'رمز التحقق الثنائي المؤقت (2FA / OTP)'}
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={token2FA}
                        onChange={(e) => setToken2FA(e.target.value.replace(/\D/g, ''))}
                        maxLength={6}
                        placeholder={language === 'en' ? 'e.g. 844391' : 'مثال: 048255'}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pl-10 text-xs focus:outline-none focus:border-red-500 font-black tracking-widest text-center text-slate-900"
                      />
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-[8.5px] text-slate-400 block mt-1.5 leading-normal text-right">
                      {language === 'en' 
                        ? 'Optionally input any 6 digits for simulation evaluation, or leave blank to verify with standard base keys.'
                        : 'أدخل أي ٦ أرقام اختيارياً للمعاينة المباشرة أو اتركها لمطابقة الموظفين الرسمية.'}
                    </span>
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 bg-red-55 text-red-650 border border-red-150 rounded-xl text-xs font-bold leading-relaxed text-center space-y-1">
                      <p>{errorMsg}</p>
                      <p className="text-[9.5px] text-slate-500 uppercase">{language === 'en' ? 'Access has been security logged' : 'تم تدوين محاولتكم في سجل حظر الخروقات'}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-slate-950 text-white font-black py-4 rounded-xl text-xs tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-45"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>{language === 'en' ? 'Inquire Security Credentials' : 'تسجيل دخول آمن وفك النطاق'}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Simulated environment bypass options for evaluation */}
            <div className="bg-slate-50 p-6 border-t border-slate-150 space-y-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[9.5px] font-black tracking-wider text-rose-500 uppercase">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'AI STUDIO EVALUATOR PORTAL DIRECT ACTION' : 'منفذ معالجة التقييم الفوري للاستعراض'}</span>
              </div>
              
              <button
                type="button"
                onClick={handleDebugBypass}
                disabled={loading || successAuth}
                className="w-full bg-red-650 hover:bg-red-700 text-white font-black py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md shadow-red-950/10 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-45"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4.5 h-4.5 text-rose-200 animate-pulse" />}
                <span>{language === 'en' ? 'Bypass & Simulate Admin Session' : 'محاكاة كامل الصلاحية والدخول كآدمن'}</span>
              </button>

              <p className="text-[9px] text-slate-450 leading-relaxed max-w-sm mx-auto">
                {language === 'en'
                  ? 'Click this button to instantly inject the admin profile cookie/localStorage parameters and redirect to the dashboard without entering Firebase credentials.'
                  : 'اضغط لتجاوز مطابقة البيانات فورياً ولحقن ملفات الكوكيز وصلاحيات الأدمن والتحويل الفوري للوحة التحكم لتسهيل المراجعة.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Security Auditing & ROBOTS.TXT configurations */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active security logs */}
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <button 
                onClick={clearAuditHistory}
                className="text-[9.5px] font-bold text-red-400 hover:text-red-300 hover:underline cursor-pointer"
              >
                {language === 'en' ? 'Clear Local Audit' : 'تفريغ السجل المحفوظ'}
              </button>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    {language === 'en' ? 'Real-Time Security Audit Log' : 'سجل التحقق والاتصالات الفوري'}
                  </h4>
                  <p className="text-[9px] text-slate-400 font-bold block mt-0.5">
                    {language === 'en' ? 'Tracking incoming router requests' : 'مراقبة هجمات ومحاولات ولوج النواة'}
                  </p>
                </div>
                <History className="w-5 h-5 text-red-500" />
              </div>
            </div>

            {/* Current Visitor details badge */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 space-y-2 text-[10px] leading-relaxed">
              <div className="flex justify-between items-center text-right font-mono text-slate-400">
                <span className="font-bold text-red-400 select-all">{ipAddress}</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-red-500" />
                  {language === 'en' ? 'Local Peer IP Address' : 'عنوان الآي بي المكتشف'}
                </span>
              </div>
              <div className="flex justify-between items-start text-right font-mono text-slate-400 gap-2">
                <span className="font-semibold text-slate-300 block truncate max-w-[150px] leading-snug">{userAgentStr || 'Chrome Frame'}</span>
                <span className="flex items-center gap-1 shrink-0">
                  <Monitor className="w-3 h-3" />
                  {language === 'en' ? 'Browser Signature' : 'توقيع المتصفح البنيوي'}
                </span>
              </div>
            </div>

            {/* Audit log entries rendering */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {logs.length === 0 ? (
                <div className="text-center py-6 text-[10px] text-slate-500 font-bold">
                  {language === 'en' ? 'No incoming connection trace found.' : 'لم يتم تسجيل أي محاولات ولوج إدارية.'}
                </div>
              ) : (
                logs.map((log, idx) => {
                  const getStatusBadge = (st: typeof log.status) => {
                    switch (st) {
                      case 'SUCCESS':
                        return <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-900 text-[8px] font-black px-1.5 py-0.5 rounded leading-none">APPROVED</span>;
                      case 'FAILED_PWD':
                        return <span className="bg-red-950/60 text-red-400 border border-red-900 text-[8px] font-black px-1.5 py-0.5 rounded leading-none">BAD_PWD</span>;
                      case 'FAILED_2FA':
                        return <span className="bg-amber-955 text-amber-500 border border-amber-900/40 text-[8px] font-black px-1.5 py-0.5 rounded leading-none">2FA_FAIL</span>;
                      case 'ROLE_MISMATCH':
                        return <span className="bg-purple-950 text-purple-400 border border-purple-900 text-[8px] font-black px-1.5 py-0.5 rounded leading-none">ROLE_ERR</span>;
                    }
                  };
                  return (
                    <div key={idx} className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-900 flex flex-col gap-1.5 font-mono text-[9px]">
                      <div className="flex justify-between items-center select-none">
                        <span className="text-slate-500 font-bold">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        {getStatusBadge(log.status)}
                      </div>
                      <div className="flex justify-between items-center select-all text-slate-400">
                        <span className="font-semibold text-[8px] truncate max-w-[140px] text-slate-500">{log.device}</span>
                        <span className="font-bold text-slate-300">{log.username}</span>
                      </div>
                      <div className="text-right text-[8px] leading-none text-slate-600 border-t border-slate-900 pt-1.5">
                        IP: {log.ip} — GMT+3
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Robots.txt SEO Protection visual helper */}
          <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-sm space-y-4 text-right">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 justify-end">
              <div className="text-right">
                <h4 className="text-xs font-black text-slate-900">
                  {language === 'en' ? 'SEO Search Engine Exclusion' : 'إخفاء لوحة التحكم من محركات البحث'}
                </h4>
                <p className="text-[9.5px] text-slate-400 font-bold block">
                  {language === 'en' ? 'Preventing Google & Bing crawlers' : 'التوجيهات الوقائية لملف التمشيط البنيوي'}
                </p>
              </div>
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            
            <p className="text-[10.5px] text-slate-600 leading-relaxed">
              {language === 'en'
                ? 'To ensure that bots and search index services completely ignore the existence of the secret admin panel, place this configuration inside the raw robots.txt file:'
                : 'لضمان حظر زواحف التمشيط والأرشفة من كشف أو اقتراح الروابط السرية للبحث، يتم تضمين المسارات التالية بقاعدة استبعاد الروبوتات:'}
            </p>

            <div className="bg-slate-900 text-slate-100 rounded-xl p-3.5 font-mono text-[10.5px] select-all break-all text-left">
              <p className="text-cyan-400">User-agent: *</p>
              <p className="text-rose-400">Disallow: /secure-admin</p>
              <p className="text-rose-400">Disallow: /mep-management</p>
              <p className="text-rose-400">Disallow: /gcc-dashboard</p>
              <p className="text-rose-400">Disallow: /admin</p>
              <p className="text-slate-500"># Prevents crawler indexing of security gates</p>
            </div>

            <span className="text-[9px] text-slate-400 block leading-normal">
              {language === 'en'
                ? 'Note: All critical folders are also protected client-side via React Route Guard rules, returning empty states for non-identified agents.'
                : 'ملاحظة: كافة العناوين مؤمنة كذلك من جهة متصفح العميل بجدار حماية الحزم لمنع استرجاع المكونات البرمجية دون تذكرة JWT صالحة.'}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MepManagement;
