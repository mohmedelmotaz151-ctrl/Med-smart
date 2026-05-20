import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Building2, 
  Filter, 
  MapPin, 
  ArrowUpRight, 
  CheckCircle, 
  Activity,
  Calendar,
  Layers,
  Flame,
  Wind,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Project {
  id: string;
  nameEn: string;
  nameAr: string;
  category: 'fire' | 'cooling' | 'power' | 'mep';
  categoryLabelEn: string;
  categoryLabelAr: string;
  clientEn: string;
  clientAr: string;
  locationEn: string;
  locationAr: string;
  year: string;
  scopeEn: string;
  scopeAr: string;
  img: string;
  detailsEn: string;
  detailsAr: string;
}

const Projects: React.FC = () => {
  const { language } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'fire' | 'cooling' | 'power' | 'mep'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Read admin uploaded projects dynamically on load
  const [dynamicProjects, setDynamicProjects] = useState<Project[]>([]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('gcc_dynamic_media');
      if (stored) {
        const parsed = JSON.parse(stored);
        const filtered = parsed
          .filter((item: any) => item.type === 'project')
          .map((item: any) => ({
            id: item.id || `dynamic-p-${item.createdAt}`,
            nameEn: item.titleEn,
            nameAr: item.titleAr,
            category: item.category === 'projects' ? 'mep' : item.category,
            categoryLabelEn: item.category === 'fire' ? 'Clean Gas Fire Suppression' :
                             item.category === 'cooling' ? 'HVAC & Central Air' :
                             item.category === 'power' ? 'Industrial Power Grid Backup' :
                             'Comprehensive MEP Services',
            categoryLabelAr: item.category === 'fire' ? 'غاز نظيف ومكافحة حرائق' :
                             item.category === 'cooling' ? 'تكييف مركزي وتشيلرات' :
                             item.category === 'power' ? 'طاقة ومولدات احتياطية صامتة' :
                             'حلول كهروميكانيكية شاملة',
            clientEn: item.clientEn || 'GCC Company Client',
            clientAr: item.clientAr || 'عميل شركة الخليج',
            locationEn: item.locationEn || 'Riyadh, KSA',
            locationAr: item.locationAr || 'الرياض، المملكة العربية السعودية',
            year: item.year || '2026',
            scopeEn: item.descriptionEn,
            scopeAr: item.descriptionAr,
            img: item.imageUrls && item.imageUrls[0] ? item.imageUrls[0] : 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&fit=crop',
            detailsEn: item.descriptionEn,
            detailsAr: item.descriptionAr
          }));
        setDynamicProjects(filtered);
      }
    } catch (e) {
      console.warn("Error reading dynamic projects list", e);
    }
  }, []);

  const projectsData: Project[] = [
    {
      id: 'proj-101',
      nameEn: 'GCC Financial District Tower',
      nameAr: 'برج المركز المالي بمدينة الرياض',
      category: 'cooling',
      categoryLabelEn: 'HVAC & Central Air',
      categoryLabelAr: 'تكييف مركزي وتشيلرات',
      clientEn: 'Financial District Authority',
      clientAr: 'هيئة المركز المالي',
      locationEn: 'Riyadh, KSA',
      locationAr: 'الرياض، المملكة العربية السعودية',
      year: '2023',
      scopeEn: 'Design & installation of 6,200 Tons of centrifugal chilled water plant with custom ducted air distribution.',
      scopeAr: 'تصميم وتركيب محطة مياه مبردة تشيلر مركزية بسعة 6,200 طن تبريد للمقرات الرئيسية والمكاتب.',
      img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&fit=crop',
      detailsEn: 'Integration of automated Building Management Systems (BMS), custom vibration dampening, water conservation economizers matching energy-saving initiatives, and duct fabric insulation.',
      detailsAr: 'تكامل كامل مع أنظمة التحكم بالمباني BMS وتفصيل عازلات اهتزاز متطورة وتصنيع دكت داخلي معزول بالكامل.'
    },
    {
      id: 'proj-102',
      nameEn: 'Petrochemical Server Center Protection',
      nameAr: 'حماية مركز خوادم مجمع البتروكيماويات',
      category: 'fire',
      categoryLabelEn: 'Clean Gas Fire Suppression',
      categoryLabelAr: 'غاز نظيف ومكافحة حرائق',
      clientEn: 'International Chemicals Group',
      clientAr: 'المجموعة الكيميائية الدولية',
      locationEn: 'Jubail, KSA',
      locationAr: 'الجبيل، المملكة العربية السعودية',
      year: '2024',
      scopeEn: 'Deployment of specialized Novec 1230 & FM-200 clean gas dry suppression networks for active server nodes.',
      scopeAr: 'تصميم وتنفيذ شبكات إطفاء جافة باستخدام غاز Novec و FM-200 وغرف التحكم لتأمين غرف الخوادم المركزية.',
      img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&fit=crop',
      detailsEn: 'The system triggers clean gas within 8 seconds of smoke inhalation detection (VESDA), saving sensitive electronic assets without chemical residue.',
      detailsAr: 'يتفاعل النظام خلال 8 ثوانٍ من استشعار الدخان VESDA، ويتم تفريغ الغاز النظيف لحماية الخوادم دون مخلفات تآكلية.'
    },
    {
      id: 'proj-103',
      nameEn: 'Kuwait Logistics Hub Standby',
      nameAr: 'محطة طاقة الطوارئ بمستودعات الكويت',
      category: 'power',
      categoryLabelEn: 'Industrial Power Grid Backup',
      categoryLabelAr: 'طاقة ومولدات احتياطية صامتة',
      clientEn: 'Regional Cargo & Logistics Corp',
      clientAr: 'الخليج للشحن واللوجستيات',
      locationEn: 'Shuaiba, Kuwait',
      locationAr: 'الشعيبة، دولة الكويت',
      year: '2022',
      scopeEn: 'Installation of 3 units of 2500 kVA synchronized heavy diesel generators with automatic ATS panels.',
      scopeAr: 'توريد وتشغيل 3 مولدات ديزل ثقيلة متزامنة بقدرة 2500 كيلو فولت أمبير مع مفاتيح النقل التلقائية ATS.',
      img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&fit=crop',
      detailsEn: 'Acoustic sound shelters were designed to reduce decibels to 75dBA at 7 meters, equipped with independent 10,000L fuel day-tanks and cooling jackets.',
      detailsAr: 'إنشاء كواتم وحواجب صوت أفقية وخزانات تغذية وقود يومية سعة 10,000 لتر لضمان استمرار الكهرباء حتى في أشد الأزمات.'
    },
    {
      id: 'proj-104',
      nameEn: 'GCC Plaza Commercial Complex',
      nameAr: 'مجمع مجمع الخليج التجاري الطبي',
      category: 'mep',
      categoryLabelEn: 'Comprehensive MEP Services',
      categoryLabelAr: 'حلول كهروميكانيكية شاملة',
      clientEn: 'Al-Khobar Holding',
      clientAr: 'الخبر القابضة للتطوير العقاري',
      locationEn: 'Khobar, KSA',
      locationAr: 'الخبر، المملكة العربية السعودية',
      year: '2023',
      scopeEn: 'Integrated deployment of wet sprinkler protection, variable refrigerant flow (VRF) lines, design lights, and power supply panels.',
      scopeAr: 'تنفيذ أعمال الكهروميكانيكا الشاملة بما فيها تكييف الهواء المتغير VRF، شبكات مرشات الحريق المائية، ولوحات التوزيع الأساسية.',
      img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&fit=crop',
      detailsEn: 'Full legal certification and defense permission achieved ahead of schedule, ensuring seamless occupancy clearance.',
      detailsAr: 'الحصول على تراخيص الدفاع المدني وبلديات المنطقة قبل الموعد التعاقدي المحدد لتيسير عمل الملاك والمستثمرين.'
    }
  ];

  const allProjects = [...dynamicProjects, ...projectsData];

  const filteredProjects = filter === 'all' 
    ? allProjects 
    : allProjects.filter(proj => proj.category === filter);

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Title bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-block bg-red-50 text-red-600 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-red-100">
            {language === 'en' ? 'Track Record' : 'المشاريع الكبرى'}
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1.5">
            {language === 'en' ? 'Engineering Reference Showcase' : 'سابقة أعمالنا ومشروعاتنا المنجزة'}
          </h1>
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', en: 'All', ar: 'الكل' },
            { id: 'fire', en: 'Fire', ar: 'أنظمة حريق' },
            { id: 'cooling', en: 'HVAC', ar: 'تكييف وتبريد' },
            { id: 'power', en: 'Power', ar: 'مولدات وطاقة' },
            { id: 'mep', en: 'MEP Integration', ar: 'كهروميكانيكا' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setFilter(cat.id as any); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                filter === cat.id 
                  ? 'bg-slate-900 text-white border-slate-950 shadow-sm' 
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {language === 'en' ? cat.en : cat.ar}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((proj) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img 
                  src={proj.img} 
                  alt={proj.nameEn} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-white/10">
                  {language === 'en' ? proj.categoryLabelEn : proj.categoryLabelAr}
                </span>
                <span className="absolute bottom-4 right-4 bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                  {proj.year}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    {language === 'en' ? proj.nameEn : proj.nameAr}
                  </h3>
                  <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wide flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>{language === 'en' ? proj.locationEn : proj.locationAr}</span>
                  </p>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed font-sans line-clamp-2">
                  {language === 'en' ? proj.scopeEn : proj.scopeAr}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">{language === 'en' ? 'Client:' : 'العميل:'}</span>
                    <span className="text-slate-800">{language === 'en' ? proj.clientEn : proj.clientAr}</span>
                  </div>
                  <span className="text-red-600 flex items-center gap-0.5 text-[10px] uppercase tracking-wider group-hover:underline">
                    {language === 'en' ? 'View Details' : 'التفاصيل'}
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full border border-slate-200 shadow-2xl flex flex-col"
          >
            <div className="relative h-60 overflow-hidden bg-slate-100 shrink-0">
              <img src={selectedProject.img} alt={selectedProject.nameEn} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-slate-900 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto max-h-[400px]">
              <div className="space-y-2">
                <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  {language === 'en' ? selectedProject.categoryLabelEn : selectedProject.categoryLabelAr}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 pt-1">
                  {language === 'en' ? selectedProject.nameEn : selectedProject.nameAr}
                </h2>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-red-500" /> {language === 'en' ? selectedProject.locationEn : selectedProject.locationAr}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-blue-500" /> {language === 'en' ? 'Completed in' : 'تم التنفيذ في عام'} {selectedProject.year}</span>
                </div>
              </div>

              <div className="h-px bg-slate-155" />

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{language === 'en' ? 'Project Scope' : 'نطاق العمل التعاقدي'}</h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">{language === 'en' ? selectedProject.scopeEn : selectedProject.scopeAr}</p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{language === 'en' ? 'Detailed Implementation' : 'تفاصيل التجهيز الهندسي'}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">{language === 'en' ? selectedProject.detailsEn : selectedProject.detailsAr}</p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  {language === 'en' ? 'Close Portal' : 'إغلاق الصحيفة'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Projects;
