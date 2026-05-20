import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { 
  User as UserIcon, 
  Settings, 
  MapPin, 
  Phone, 
  Camera,
  ChevronRight,
  ShieldCheck,
  ClipboardList,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';

interface Ticket {
  id: string;
  name: string;
  company: string;
  type: string;
  facility: string;
  location: string;
  message: string;
  status: 'pending' | 'reviewed' | 'dispatched' | 'completed';
  createdAt: string;
}

const Profile: React.FC = () => {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'personal' | 'tickets'>('personal');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const tabs = [
    { id: 'personal' as const, name: language === 'en' ? 'Client Details' : 'بيانات الحساب', icon: <UserIcon size={18} /> },
    { id: 'tickets' as const, name: language === 'en' ? 'GCC Service Tickets' : 'الطلبات والعقود الفنية', icon: <ClipboardList size={18} /> },
  ];

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user?.email) return;
      setLoadingTickets(true);
      try {
        const q = query(
          collection(db, 'inquiries'),
          where('userEmail', '==', user.email)
        );
        const querySnapshot = await getDocs(q);
        const loaded: Ticket[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          loaded.push({
            id: doc.id,
            name: data.name || '',
            company: data.company || '',
            type: data.type || 'quote',
            facility: data.facility || 'commercial',
            location: data.location || '',
            message: data.message || '',
            status: data.status || 'pending',
            createdAt: data.createdAt || new Date().toISOString()
          });
        });
        
        // Sort by date desc
        loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTickets(loaded);
      } catch (err) {
        console.error("Error fetching tickets: ", err);
      } finally {
        setLoadingTickets(false);
      }
    };

    if (activeTab === 'tickets') {
      fetchTickets();
    }
  }, [user, activeTab]);

  const getStatusBadge = (status: Ticket['status']) => {
    switch (status) {
      case 'completed':
        return <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> {language === 'en' ? 'Completed SLA' : 'تم التنفيذ والاعتماد'}</span>;
      case 'dispatched':
        return <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {language === 'en' ? 'Engineer Assigned' : 'تم توجيه الفريق الهندسي'}</span>;
      case 'reviewed':
        return <span className="bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {language === 'en' ? 'In Technical Review' : 'قيد المراجعة الفنية والمقايسة'}</span>;
      default:
        return <span className="bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {language === 'en' ? 'Pending Review' : 'قيد التدقيق الأولي'}</span>;
    }
  };

  const getObjectiveLabel = (obj: string) => {
    switch (obj) {
      case 'quote': return language === 'en' ? 'Heavy Quoting Estimate' : 'طلب عرض سعر ومقايسة كبرى';
      case 'maintenance': return language === 'en' ? 'Preventive Maintenance SLA' : 'صيانة كهروميكانيكية دورية';
      case 'inspection': return language === 'en' ? 'Civil Defense Fire Audit' : 'معاينة واعتمادات الدفاع المدني';
      default: return language === 'en' ? 'General Inquiry' : 'استفسار عام للمجموعة';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans pb-12">
      {/* Profile Header */}
      <div className="bg-slate-900 border border-slate-800 text-white p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-650/5 to-blue-600/5 pointer-events-none" />
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <div className="w-48 h-48 bg-blue-600 rounded-full blur-2xl" />
        </div>
        
        <div>
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl bg-slate-800 flex items-center justify-center text-red-500 font-black text-3xl uppercase">
            {profile?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
        </div>

        <div className="text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-white leading-none">
              {profile?.displayName || user?.displayName || 'GCC Company Client'}
            </h1>
            <span className="bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-red-500/20">
              {profile?.role === 'doctor' ? (language === 'en' ? 'Engineering Lead' : 'قائد القسم الهندسي') : (language === 'en' ? 'Corporate Client' : 'عميل شركة GCC')}
            </span>
          </div>
          <p className="text-slate-400 text-xs font-mono">{user?.email}</p>
          <div className="flex items-center justify-center md:justify-start gap-4 pt-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
              <MapPin size={14} className="text-red-500" />
              <span>{profile?.city || 'Riyadh, KSA'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
              <Phone size={14} className="text-blue-400" />
              <span>{profile?.phone || '+966 500 000 00'}</span>
            </div>
          </div>
        </div>

        <div className="flex-grow flex justify-center md:justify-end">
          <div className="bg-blue-950/40 border border-blue-900/30 rounded-2xl px-6 py-4 flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest leading-none mb-1">{language === 'en' ? 'GCC Platinum' : 'رتبة عميل مميز'}</p>
              <p className="text-[10px] text-slate-400 font-sans leading-none">{language === 'en' ? 'Direct SLA Routing Active' : 'توجيه عاجل لمهندسي الطوارئ مفعل'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav Buttons */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold text-xs transition-all border ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-white border-slate-950 shadow-sm' 
                  : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3 uppercase tracking-wider">
                {tab.icon}
                <span>{tab.name}</span>
              </div>
              {activeTab === tab.id && <ChevronRight size={16} />}
            </button>
          ))}
        </div>

        {/* Dynamic Display */}
        <div className="lg:col-span-3">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8"
          >
            {activeTab === 'personal' ? (
              <div className="space-y-6">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight pb-3 border-b border-slate-100">
                  {language === 'en' ? 'Client Specifications Profile' : 'البيانات الشخصية والاعتماد التجاري'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{language === 'en' ? 'Corporate Business Name' : 'الاسم التجاري للمؤسسة / العميل'}</label>
                    <div className="bg-slate-50 px-4 py-3.5 rounded-xl text-xs font-bold text-slate-700 border border-slate-100">
                      {profile?.displayName || user?.displayName || 'GCC Partner'}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{language === 'en' ? 'Official Email Contact' : 'البريد الإلكتروني المعتمد للتبادل الفني'}</label>
                    <div className="bg-slate-50 px-4 py-3.5 rounded-xl text-xs font-bold text-slate-500 border border-slate-100 font-mono italic">
                      {user?.email}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{language === 'en' ? 'Primary Telephone Number' : 'رقم هاتف الاتصال والشبكة'}</label>
                    <div className="bg-slate-50 px-4 py-3.5 rounded-xl text-xs font-bold text-slate-700 border border-slate-100">
                      {profile?.phone || '+966 500 000 00'}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{language === 'en' ? 'Region Office / City Code' : 'مقر المدينة الافتراضي'}</label>
                    <div className="bg-slate-50 px-4 py-3.5 rounded-xl text-xs font-bold text-slate-700 border border-slate-100">
                      {profile?.city || 'Riyadh, Saudi Arabia'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-1">
                    {language === 'en' ? 'Active GCC Service & Quote Tickets' : 'تتبع المقايسات وجداول الصيانة المعتمدة لشركتكم'}
                  </h2>
                  <p className="text-[11px] text-slate-450">
                    {language === 'en' ? 'Track real-time updates of filed specifications, fire protection audits, and standby generator kVA deployments.' : 'تابع مستجدات وتعديلات فريقنا الهندسي ومقايسة كود البناء وعروض الأسعار المتبادلة.'}
                  </p>
                </div>

                {loadingTickets ? (
                  <div className="text-center py-10 space-y-2 text-slate-400 font-bold text-xs uppercase">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                    <span>{language === 'en' ? 'Connecting to GCC secure database...' : 'جاري سحب عروض الأسعار المسجلة لشركتكم من السيرفر الآمن...'}</span>
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-3">
                    <AlertCircle className="w-10 h-10 text-slate-350 mx-auto animate-bounce" />
                    <div className="text-xs font-black text-slate-800 uppercase tracking-wide">
                      {language === 'en' ? 'No Engineering request tickets found' : 'لم يتم العثور على تذاكر أو طلبات مسجلة ببريدك الإلكتروني بعد'}
                    </div>
                    <p className="text-[11px] text-slate-450 font-sans max-w-sm mx-auto">
                      {language === 'en' 
                        ? 'Submit a mechanical pricing layout or fire suppression request inside our Contact page to initialize your ticket tracker.' 
                        : 'تفضل بالذهاب إلى صفحة اتصل بنا وتقديم طلب صيانة كهروميكانيكية أو عرض سعر للتكييف لتفعيل لوحة تتبع المشروع.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:bg-slate-50/40 transition-all font-sans space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-slate-100">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black text-slate-400 font-mono select-all uppercase">ID: {ticket.id}</span>
                            <h3 className="text-sm font-black text-slate-900 leading-none">{getObjectiveLabel(ticket.type)}</h3>
                          </div>
                          {getStatusBadge(ticket.status)}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
                          <div>
                            <span className="text-slate-400 font-bold block mb-0.5">{language === 'en' ? 'Assigned Facility' : 'طبيعة وتصنيف المبنى:'}</span>
                            <span className="text-slate-800 font-black">
                              {ticket.facility === 'server_room' ? (language === 'en' ? 'Data Server / Telecom Center' : 'مركز خوادم بيانات وغرفة اتصالات') :
                               ticket.facility === 'industrial' ? (language === 'en' ? 'Industrial Warehouse / Factory' : 'مستودع لوجستي / مصنع ثقيل') :
                               ticket.facility === 'residential' ? (language === 'en' ? 'Residential Complex / Villa' : 'مجمع سكني / فلل وقصور') :
                               (language === 'en' ? 'Commercial Complex / Mall' : 'مجمع مكاتب تجارية / مول')}
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-400 font-bold block mb-0.5">{language === 'en' ? 'Project Site' : 'حي وموقع التجهيز:'}</span>
                            <span className="text-slate-800 font-extrabold">{ticket.location || 'Riyadh HQ'}</span>
                          </div>
                        </div>

                        {ticket.message && (
                          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-[11px] leading-relaxed text-slate-600 font-sans">
                            <span className="font-extrabold text-slate-800 block mb-1">{language === 'en' ? 'Specifications Supplied:' : 'المواصفات والبيان الهندسي المقدم:'}</span>
                            {ticket.message}
                          </div>
                        )}

                        <div className="text-[10px] text-slate-400 font-bold">
                          {language === 'en' ? 'Created on' : 'تاريخ التسجيل:'} {new Date(ticket.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
