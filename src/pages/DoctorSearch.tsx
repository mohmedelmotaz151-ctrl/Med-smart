import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, query as fsQuery, where } from 'firebase/firestore';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  DollarSign, 
  ChevronRight,
  Stethoscope
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  fees: number;
  location: string;
  languages: string[];
  image: string;
}

const DoctorSearch: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [specialty, setSpecialty] = useState('All');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const specialties = ['All', 'Cardiology', 'Dermatology', 'Pediatrics', 'Neurology', 'General Medicine'];

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const q = fsQuery(collection(db, 'doctors'));
        const querySnapshot = await getDocs(q);
        const docsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Doctor[];
        
        // Merge with users to get names if they are split, but for this applet 
        // we assume doctors collection has the necessary info or we'd join.
        // For now, let's assume doctors collection is self-contained.
        setDoctors(docsData.length > 0 ? docsData : []);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doc => {
    const matchesQuery = doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doc.specialty?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = specialty === 'All' || doc.specialty === specialty;
    return matchesQuery && matchesSpecialty;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Find Your Doctor</h1>
        <p className="text-slate-500">Search from thousands of qualified professionals</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Search by name, specialty, or condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {specialties.map((s) => (
            <button
              key={s}
              onClick={() => setSpecialty(s)}
              className={`whitespace-nowrap px-6 py-4 rounded-2xl font-bold transition-all ${
                specialty === s 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredDoctors.map((doc, idx) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card-geometric flex flex-col sm:flex-row gap-6 hover:shadow-xl transition-all group"
          >
            <div className="relative w-full sm:w-40 aspect-square rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
              <img src={doc.image} alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-slate-800">
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                {doc.rating}
              </div>
            </div>
            
            <div className="flex-grow flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{doc.name}</h3>
                    <p className="text-blue-600 font-bold flex items-center gap-1">
                      <Stethoscope size={16} />
                      {doc.specialty}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Fees</p>
                    <p className="text-lg font-extrabold text-slate-800">${doc.fees}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-start gap-2 text-slate-500">
                    <MapPin size={16} className="text-slate-400 mt-1" />
                    <span className="text-xs font-medium">{doc.location}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-500">
                    <DollarSign size={16} className="text-slate-400 mt-1" />
                    <span className="text-xs font-medium">Accepting Insurance</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex gap-2">
                  {doc.languages.map(lang => (
                    <span key={lang} className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-2 py-1 rounded-md uppercase tracking-tighter">
                      {lang}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => navigate(`/appointments/book?docId=${doc.id}`)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                >
                  Book Appointment
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DoctorSearch;
