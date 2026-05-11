import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface Appointment {
  id: string;
  doctorId: string;
  doctorName?: string;
  patientId: string;
  dateTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  type: 'video' | 'voice' | 'in-person';
  notes?: string;
}

const Appointments: React.FC = () => {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      
      const q = query(
        collection(db, 'appointments'),
        where(profile?.role === 'doctor' ? 'doctorId' : 'patientId', '==', user.uid),
        orderBy('dateTime', 'desc')
      );

      try {
        const querySnapshot = await getDocs(q);
        const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
        setAppointments(apps);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user, profile]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Your Appointments</h1>
        <p className="text-slate-500">Manage and track your medical consultations</p>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-4">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="text-slate-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-700">No appointments found</h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm">
            You haven't booked any medical consultations yet. Find a doctor to get started.
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all">
            Find a Doctor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.map((app, idx) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="card-geometric hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-50 p-3 rounded-2xl">
                    {app.type === 'video' ? <Video className="text-blue-600" /> : <MapPin className="text-blue-600" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 tracking-tight">
                      {profile?.role === 'doctor' ? 'Patient' : 'Doctor'} #{app.doctorId.slice(0, 5)}
                    </h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{app.type} Consultation</p>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest ${getStatusStyle(app.status)}`}>
                  {app.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl">
                  <Calendar className="text-slate-400" size={18} />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Date</p>
                    <p className="text-sm font-bold text-slate-700">{new Date(app.dateTime).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl">
                  <Clock className="text-slate-400" size={18} />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Time</p>
                    <p className="text-sm font-bold text-slate-700">{new Date(app.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {app.status === 'confirmed' && (
                  <button className="flex-grow bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                    <MessageSquare size={18} />
                    Enter Consultation
                  </button>
                )}
                {app.status === 'pending' && (
                  <button className="flex-grow bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-all">
                    Cancel Appointment
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
