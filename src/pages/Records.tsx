import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, query as fsQuery, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { 
  FileText, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User as UserIcon,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';

interface Record {
  id: string;
  date: string;
  doctor: string;
  diagnosis: string;
  treatment: string;
  status: string;
  patientId: string;
}

const Records: React.FC = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const q = fsQuery(collection(db, 'medicalRecords'), where('patientId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const recordsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Record[];
        setRecords(recordsData);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'medicalRecords');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [user]);

  const filteredRecords = records.filter(rec => 
    rec.diagnosis.toLowerCase().includes(query.toLowerCase()) ||
    rec.doctor.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Medical Records</h1>
          <p className="text-slate-500">Access your complete health history securely</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
          <Plus size={20} />
          Upload New Record
        </button>
      </div>

      <div className="card-geometric border-sky-100 bg-sky-50/50 flex items-center gap-4">
        <div className="bg-sky-600 p-2 rounded-lg text-white">
          <ShieldAlert size={20} />
        </div>
        <p className="text-xs text-sky-900 font-bold uppercase tracking-tight">
          Your medical records are encrypted and only accessible by you and authorized providers.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Search diagnosis, doctor, or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all font-bold text-slate-700"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        </div>
        <button className="px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
          <Filter size={20} />
          Filter
        </button>
      </div>

      <div className="card-geometric p-0 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Record ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Doctor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Diagnosis</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRecords.map((rec, idx) => (
                <motion.tr 
                  key={rec.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-5">
                    <span className="font-mono text-xs font-bold text-slate-400">{rec.id}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(rec.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                        <UserIcon size={12} className="text-slate-400" />
                      </div>
                      {rec.doctor}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full text-xs">
                      {rec.diagnosis}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <Download size={20} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Records;
