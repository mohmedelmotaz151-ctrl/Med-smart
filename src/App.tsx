import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Phone } from 'lucide-react';

// Lazy load pages
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
const MepManagement = lazy(() => import('./pages/MepManagement'));

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: string }) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/" />;
  if (role && profile?.role !== role) return <Navigate to="/" />;
  
  return <>{children}</>;
};

import Sidebar from './components/Sidebar';

function AppContent() {
  const { dir, language } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="h-screen flex bg-slate-100 font-sans text-slate-900 overflow-hidden" dir={dir}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full font-sans">
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
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute role="admin">
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/gcc-dashboard" 
                  element={
                    <ProtectedRoute role="admin">
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/mep-management" element={<MepManagement />} />
                <Route path="/secure-admin" element={<MepManagement />} />
                <Route path="/system-control" element={<MepManagement />} />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Suspense>
          </div>
        </main>

        {/* Global Floating Custom WhatsApp & Call Hub with Premium Micro-animations */}
        <div className="fixed bottom-6 end-6 z-50 flex flex-col items-end gap-3 font-sans">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.9 }}
                className="bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 w-64 space-y-3 shrink-0"
              >
                <div className="text-xs font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  <span>{language === 'en' ? 'Direct Connections Hub' : 'الرقم الموحد المباشر والطوارئ'}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  {language === 'en' 
                    ? 'Connect instantly with our engineering team for inquiries or urgent support.' 
                    : 'تواصل الآن فوراً مع مراجعة العقود الفنية أو بلاغات الدعم الميداني العاجل.'}
                </p>
                
                <div className="flex flex-col gap-2">
                  <a
                    href="https://wa.me/966550307003"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2 px-3 text-xs font-black flex items-center justify-center gap-2 transition-colors duration-150"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>+966 55 030 7003</span>
                  </a>

                  <a
                    href="tel:+966550307003"
                    className="bg-slate-900 hover:bg-slate-850 text-white rounded-xl py-2 px-3 text-xs font-black flex items-center justify-center gap-2 transition-colors duration-150"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{language === 'en' ? 'Call Support' : 'اتصال هاتفي مباشر'}</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Core Floating Button Trigger */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="bg-emerald-600 text-white p-4 rounded-full shadow-2xl shadow-emerald-950/40 hover:bg-emerald-700 transition-colors relative flex items-center justify-center cursor-pointer border border-emerald-500/10 focus:outline-none"
          >
            {/* Pulsing visual halo */}
            <span className="absolute inset-0 rounded-full bg-emerald-500/25 animate-ping opacity-75 pointer-events-none"></span>
            
            <MessageCircle className="w-6.5 h-6.5 relative z-10" />
            
            {/* Live Indicator */}
            <span className="absolute -top-1.5 -start-1.5 bg-red-650 text-white font-black font-sans text-[8px] px-1.5 py-0.5 rounded-full border border-white uppercase animate-bounce">
              LIVE
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}
