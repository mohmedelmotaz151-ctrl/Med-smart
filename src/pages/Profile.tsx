import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  User as UserIcon, 
  Settings, 
  Bell, 
  Lock, 
  MapPin, 
  Phone, 
  Globe,
  Camera,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';

const Profile: React.FC = () => {
  const { user, profile } = useAuth();
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', name: 'Personal Details', icon: <UserIcon size={18} /> },
    { id: 'security', name: 'Security', icon: <Lock size={18} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="card-geometric p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <div className="w-48 h-48 bg-sky-600 rounded-full" />
        </div>
        
        <div className="relative">
          <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold">
                {profile?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg hover:bg-blue-700 transition-colors">
            <Camera size={16} />
          </button>
        </div>

        <div className="text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {profile?.displayName || user?.displayName || 'Medical User'}
            </h1>
            <span className="bg-blue-100 text-blue-700 text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
              {profile?.role || 'Patient'}
            </span>
          </div>
          <p className="text-slate-500 font-medium">{user?.email}</p>
          <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
            <div className="flex items-center gap-1 text-slate-400 text-xs font-bold uppercase">
              <MapPin size={14} className="text-blue-400" />
              Cairo, Egypt
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-xs font-bold uppercase">
              <Phone size={14} className="text-blue-400" />
              +20 123 456 7890
            </div>
          </div>
        </div>

        <div className="flex-grow flex justify-center md:justify-end">
          <div className="bg-green-50 border border-green-100 rounded-2xl px-6 py-4 flex items-center gap-3">
            <div className="bg-green-500 p-2 rounded-lg text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-green-800 uppercase tracking-widest">Verified Account</p>
              <p className="text-[10px] text-green-600 font-medium">Valid until Dec 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-100' 
                  : 'text-slate-500 hover:bg-white hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}>
                  {tab.icon}
                </span>
                {tab.name}
              </div>
              {activeTab === tab.id && <ChevronRight size={18} />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{tabs.find(t => t.id === activeTab)?.name}</h2>
              <button className="text-blue-600 font-extrabold text-sm hover:underline">Edit Info</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="bg-slate-50 p-4 rounded-xl font-bold text-slate-700">
                  {profile?.displayName || user?.displayName || 'N/A'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="bg-slate-50 p-4 rounded-xl font-bold text-slate-700 italic opacity-60">
                  {user?.email}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="bg-slate-50 p-4 rounded-xl font-bold text-slate-700">
                  +20 123 456 7890
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                <div className="bg-slate-50 p-4 rounded-xl font-bold text-slate-700">
                  January 15, 1990
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Preferred Language</label>
                <div className="flex bg-slate-50 p-1 rounded-xl w-fit">
                  <button className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${language === 'en' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>
                    English
                  </button>
                  <button className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${language === 'ar' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>
                    العربية
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Helper component for the background icon
const Stethoscope = ({ className, size }: { className: string; size: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M4.8 2.3A.3.3 0 1 0 5 2a.3.3 0 1 0-.2.3Z"/><path d="M10 22v-2"/><path d="M16 18a4 4 0 0 0-8 0v2a4 4 0 0 0 8 0Z"/><path d="M10 2a3 3 0 0 0-3 3v12"/><path d="M2 5a3 3 0 0 0 3 3h2"/><path d="M10 5V2"/><path d="M14 7a3 3 0 0 0-3-3"/><path d="M17 12h2a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-2"/>
  </svg>
);

export default Profile;
