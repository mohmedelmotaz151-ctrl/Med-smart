import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search, 
  ChevronRight, 
  Activity, 
  UserPlus, 
  ShieldCheck, 
  BrainCircuit,
  AlertCircle,
  Clock,
  Star,
  MapPin
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

const categories = [
  { id: 'cardiology', name: 'doctor.specialty.cardiology', icon: <Activity className="text-red-500" /> },
  { id: 'dermatology', name: 'doctor.specialty.dermatology', icon: <ChevronRight className="text-orange-500" /> },
  { id: 'pediatrics', name: 'doctor.specialty.pediatrics', icon: <UserPlus className="text-green-500" /> },
  { id: 'neurology', name: 'doctor.specialty.neurology', icon: <BrainCircuit className="text-purple-500" /> },
];

const mockDoctors = [
  { id: '1', name: 'Dr. Sarah Ahmed', specialty: 'Cardiology', rating: 4.9, reviews: 120, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop' },
  { id: '2', name: 'Dr. John Smith', specialty: 'Neurology', rating: 4.8, reviews: 85, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop' },
  { id: '3', name: 'Dr. Mona Hassan', specialty: 'Pediatrics', rating: 5.0, reviews: 210, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop' },
];

const Home: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-12 grid-rows-6 gap-6 h-full pb-8">
      {/* AI Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-geometric ai-glow col-span-12 lg:col-span-8 flex flex-col justify-between text-white border-none shadow-xl shadow-sky-100"
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-extrabold mb-2 tracking-tight">
              {language === 'en' ? `Hello, ${profile?.displayName || 'User'}` : `مرحباً، ${profile?.displayName || 'مستخدم'}`}
            </h2>
            <p className="opacity-90 font-medium">How can I assist your health today?</p>
          </div>
          <div className="bg-white/20 px-4 py-1.5 rounded-xl text-xs backdrop-blur-md uppercase tracking-wider font-bold border border-white/20">
            Smart AI Assistant
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-8">
          <button 
            onClick={() => navigate('/chat/ai')}
            className="bg-white text-sky-700 px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-sky-50 transition-colors flex items-center gap-2"
          >
            <BrainCircuit size={18} />
            Symptom Checker
          </button>
          <button 
            onClick={() => navigate('/records')}
            className="bg-sky-500/30 border border-white/30 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-sky-500/40 transition-colors"
          >
            View History
          </button>
        </div>
      </motion.div>

      {/* Appointments Sidebar Widget */}
      <div className="card-geometric col-span-12 lg:col-span-4 lg:row-span-3 flex flex-col">
        <h3 className="font-extrabold text-lg mb-6 text-slate-800 flex items-center justify-between">
          Upcoming
          <Clock size={18} className="text-slate-400" />
        </h3>
        <div className="space-y-4 mb-6">
          {[
            { name: 'Dr. Sarah Ahmed', specialty: 'Cardiology', time: '10:30 AM', date: 'Today', initial: 'SA', color: 'text-red-600 bg-red-50' },
            { name: 'Dr. Mona Hassan', specialty: 'Pediatrics', time: '02:15 PM', date: 'Mon, 12 Oct', initial: 'MH', color: 'text-emerald-600 bg-emerald-50' }
          ].map((app, i) => (
            <div key={i} className="p-4 border border-slate-100 rounded-2xl flex gap-4 items-center hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border border-slate-200/50 ${app.color}`}>
                {app.initial}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800 group-hover:text-sky-600 transition-colors">{app.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{app.specialty}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-700">{app.time}</p>
                <p className="text-[10px] text-slate-400 font-medium">{app.date}</p>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={() => navigate('/appointments')}
          className="w-full mt-auto py-3.5 bg-slate-50 text-slate-600 font-bold rounded-2xl text-xs border border-slate-100 hover:bg-slate-100 transition-all uppercase tracking-widest"
        >
          View Full Calendar
        </button>
      </div>

      {/* Categories Section */}
      <div className="card-geometric col-span-12 lg:col-span-8 lg:row-span-4 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-extrabold text-xl text-slate-800 tracking-tight">Medical Specialties</h3>
          <button 
            onClick={() => navigate('/search')}
            className="text-sky-600 text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-1"
          >
            Explore All <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
          {[
            { id: 'cardiology', name: 'Cardiology', ar: 'قلب', icon: '❤️', color: 'text-red-600' },
            { id: 'dentistry', name: 'Dentistry', ar: 'أسنان', icon: '🦷', color: 'text-pink-600' },
            { id: 'pediatrics', name: 'Pediatrics', ar: 'أطفال', icon: '👶', color: 'text-emerald-600' },
            { id: 'neurology', name: 'Neurology', ar: 'أعصاب', icon: '🧠', color: 'text-orange-600' },
            { id: 'orthopedics', name: 'Orthopedics', ar: 'عظام', icon: '🦴', color: 'text-indigo-600' },
            { id: 'ophthalmology', name: 'Ophthalmology', ar: 'عيون', icon: '👁️', color: 'text-purple-600' },
            { id: 'hematology', name: 'Hematology', ar: 'دم', icon: '🩸', color: 'text-amber-600' },
            { id: 'general', name: 'General', ar: 'طب عام', icon: '💊', color: 'text-teal-600' },
          ].map((cat, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -4 }}
              onClick={() => navigate(`/search?specialty=${cat.id}`)}
              className="flex flex-col items-center justify-center gap-2 bg-slate-50/50 border border-slate-100 rounded-2xl p-4 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
            >
              <div className="text-3xl mb-1 filter drop-shadow-sm group-hover:scale-110 transition-transform">{cat.icon}</div>
              <div className="text-center">
                <span className={`block text-xs font-extrabold uppercase tracking-tight ${cat.color}`}>{cat.name}</span>
                <span className="block text-[10px] text-slate-400 font-bold font-sans">{cat.ar}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Pharmacy Integration */}
      <div className="card-geometric col-span-12 lg:col-span-4 lg:row-span-3 flex flex-col">
        <h3 className="font-extrabold text-lg mb-6 text-slate-800">Local Pharmacies</h3>
        <div className="space-y-6">
          <div className="flex gap-4 items-center group cursor-pointer">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl filter group-hover:bg-blue-50 transition-colors">🏥</div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800">City Life Pharma</p>
              <p className="text-[10px] text-slate-500 font-bold">2.4km • <span className="text-green-500">Open until 11PM</span></p>
            </div>
            <button className="text-sky-600 font-extrabold text-xs uppercase tracking-widest hover:text-sky-700">Order</button>
          </div>
          <div className="h-px bg-slate-100 w-full"></div>
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse"></div>
              <p className="text-xs font-extrabold text-sky-800 uppercase tracking-widest">Active Prescription</p>
            </div>
            <p className="text-[11px] text-sky-600 leading-relaxed font-medium">
              Amoxicillin 500mg - 2 times daily<br />
              <span className="font-bold">Ready for pickup at MedCentral</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
