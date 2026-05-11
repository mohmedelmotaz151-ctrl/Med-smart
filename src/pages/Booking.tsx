import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronRight, 
  ArrowLeft,
  CalendarDays,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { motion } from 'motion/react';

const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const docId = searchParams.get('docId');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationType, setConsultationType] = useState<'video' | 'voice' | 'in-person'>('video');

  const timeSlots = ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'];

  const handleBooking = async () => {
    if (!user || !selectedDate || !selectedTime) return;
    
    setLoading(true);
    try {
      const dateTime = new Date(`${selectedDate} ${selectedTime}`).toISOString();
      await addDoc(collection(db, 'appointments'), {
        patientId: user.uid,
        doctorId: docId || 'mock-id',
        dateTime,
        status: 'pending',
        type: consultationType,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      navigate('/appointments');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'appointments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8">
            <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
              <CalendarDays className="text-blue-600" />
              Book Your Appointment
            </h1>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Consultation Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['video', 'voice', 'in-person'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setConsultationType(type)}
                      className={`py-4 rounded-2xl font-bold text-sm transition-all border ${
                        consultationType === type 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                          : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-blue-200'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Select Date</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-700"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Available Time Slots</label>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-4 rounded-2xl font-bold text-sm transition-all border ${
                        selectedTime === time 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
            <h2 className="font-bold text-slate-800 text-lg">Booking Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium tracking-tight">Doctor</span>
                <span className="font-bold text-slate-800">Dr. Sarah Ahmed</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium tracking-tight">Specialty</span>
                <span className="text-blue-600 font-bold">Cardiology</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium tracking-tight">Fee</span>
                <span className="font-bold text-slate-800">$50.00</span>
              </div>
              <div className="border-t border-slate-50 pt-4 flex justify-between items-center">
                <span className="text-slate-800 font-extrabold tracking-tight">Total</span>
                <span className="text-xl font-black text-blue-600">$50.00</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                <ShieldCheck size={14} className="text-blue-500" />
                Secure Payment
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Your payment is processed securely. You can cancel up to 24 hours before the appointment for a full refund.
              </p>
            </div>

            <button 
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTime || loading}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 transform ${
                !selectedDate || !selectedTime || loading
                  ? 'bg-slate-100 text-slate-400'
                  : 'bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Processing...' : 'Confirm & Pay'}
              {!loading && <ChevronRight size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
