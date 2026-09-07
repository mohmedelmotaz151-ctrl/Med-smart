import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { MessageCircle, Phone } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Projects = lazy(() => import('./pages/Projects'));
const AISizer = lazy(() => import('./pages/AISizer'));
const Contact = lazy(() => import('./pages/Contact'));
const Profile = lazy(() => import('./pages/Profile'));
const Track = lazy(() => import('./pages/Track'));
const Admin = lazy(() => import('./pages/Admin'));

const ProtectedRoute = ({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && !isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

function AppContent() {
  const { dir, language } = useLanguage();
  const [contactOpen, setContactOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-950 font-sans" dir={dir}>
      <Navbar />
      <main className="min-h-[calc(100vh-80px)]">
        <div className="site-shell py-7 sm:py-10">
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/services" element={<Services />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/sizer" element={<AISizer />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/track" element={<Track />} />
              <Route path="/admin" element={<ProtectedRoute admin><Admin /></ProtectedRoute>} />
              <Route path="/gcc-dashboard" element={<ProtectedRoute admin><Admin /></ProtectedRoute>} />
              <Route path="/mep-management" element={<Navigate to="/login" replace />} />
              <Route path="/secure-admin" element={<Navigate to="/login" replace />} />
              <Route path="/system-control" element={<Navigate to="/login" replace />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </main>
      <Footer />

      <div className="fixed bottom-5 end-5 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {contactOpen && (
            <motion.div initial={{opacity:0,y:14,scale:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:14,scale:.96}} className="w-72 premium-panel p-4 shadow-2xl">
              <div className="flex items-center gap-2 text-sm font-black"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />{language === 'en' ? 'Direct engineering support' : 'تواصل مباشر مع الفريق الهندسي'}</div>
              <p className="mt-2 text-xs leading-5 text-slate-500">{language === 'en' ? 'Contact GCC for quotations, projects and urgent technical support.' : 'تواصل مع GCC لطلبات الأسعار والمشاريع والدعم الفني العاجل.'}</p>
              <div className="mt-4 grid gap-2">
                <a href="https://wa.me/966550307003" target="_blank" rel="noreferrer" className="rounded-xl bg-emerald-600 px-4 py-3 text-center text-xs font-black text-white hover:bg-emerald-700">WhatsApp · +966 55 030 7003</a>
                <a href="tel:+966550307003" className="rounded-xl bg-slate-950 px-4 py-3 text-center text-xs font-black text-white hover:bg-slate-800"><Phone className="me-1 inline h-4 w-4" />{language === 'en' ? 'Call support' : 'اتصال مباشر'}</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button aria-label="Contact GCC" whileHover={{scale:1.04}} whileTap={{scale:.96}} onClick={()=>setContactOpen(v=>!v)} className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-950/20 ring-1 ring-white/10">
          <MessageCircle className="h-6 w-6" />
        </motion.button>
      </div>
    </div>
  );
}

export default function App() {
  return <LanguageProvider><AuthProvider><Router><AppContent /></Router></AuthProvider></LanguageProvider>;
}
