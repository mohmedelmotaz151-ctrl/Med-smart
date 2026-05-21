import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { collection, getDocs, updateDoc, doc, query, orderBy, deleteDoc, addDoc } from 'firebase/firestore';
import { 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  User, 
  Search, 
  Filter, 
  TrendingUp, 
  Trash2, 
  Check, 
  X, 
  FileText, 
  AlertCircle, 
  Loader2, 
  Share2, 
  MessageSquare, 
  Download,
  Flame,
  Bell,
  Zap,
  Snowflake,
  Video,
  ExternalLink,
  DollarSign,
  Briefcase,
  Image as ImageIcon,
  FolderPlus,
  Upload,
  Plus,
  Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InquiryData {
  id?: string; // Firestore Doc ID
  name: string;
  company?: string;
  phone: string;
  email: string;
  serviceType: string;
  projectType: string;
  projectArea: string;
  location: string;
  message: string;
  ticketId: string;
  status: 'new' | 'under_review' | 'priced' | 'completed';
  createdAt: string;
  uploadedFiles?: string[];
  priceDetails?: {
    componentsCost: number;
    laborFee: number;
    complianceFee: number;
    discountPercent: number;
    totalAmount: number;
    comments?: string;
  };
}

export interface MediaItem {
  id?: string;
  titleEn: string;
  titleAr: string;
  category: 'projects' | 'services' | 'fire' | 'cooling' | 'power' | 'cctv';
  descriptionEn: string;
  descriptionAr: string;
  imageUrls: string[];
  type: 'project' | 'service';
  clientEn?: string;
  clientAr?: string;
  locationEn?: string;
  locationAr?: string;
  year?: string;
  createdAt: string;
}

const Admin: React.FC = () => {
  const { language } = useLanguage();
  const [inquiries, setInquiries] = useState<InquiryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryData | null>(null);

  // Mode Toggle for Admin panel
  const [adminMode, setAdminMode] = useState<'quotes' | 'media'>('quotes');

  // Media Management states
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaTitleEn, setMediaTitleEn] = useState('');
  const [mediaTitleAr, setMediaTitleAr] = useState('');
  const [mediaCategory, setMediaCategory] = useState<'projects' | 'services' | 'fire' | 'cooling' | 'power' | 'cctv'>('projects');
  const [mediaDescriptionEn, setMediaDescriptionEn] = useState('');
  const [mediaDescriptionAr, setMediaDescriptionAr] = useState('');
  const [mediaType, setMediaType] = useState<'project' | 'service'>('project');
  const [mediaClientEn, setMediaClientEn] = useState('GCC Saudi Arabia');
  const [mediaClientAr, setMediaClientAr] = useState('شركة جي سي سي للمقاولات العامة');
  const [mediaLocationEn, setMediaLocationEn] = useState('Riyadh, KSA');
  const [mediaLocationAr, setMediaLocationAr] = useState('الرياض، المملكة العربية السعودية');
  const [mediaYear, setMediaYear] = useState(new Date().getFullYear().toString());
  
  // Multi-image selection state
  const [selectedUploads, setSelectedUploads] = useState<{ name: string; base64: string }[]>([]);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);

  // Pricing inputs states for selected inquiry
  const [componentsCost, setComponentsCost] = useState<number>(0);
  const [laborFee, setLaborFee] = useState<number>(0);
  const [complianceFee, setComplianceFee] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [comments, setComments] = useState<string>('');
  
  // Custom tracking metadata states
  const [engineerName, setEngineerName] = useState<string>('');
  const [inspectionDate, setInspectionDate] = useState<string>('');
  const [attachedPdfUrl, setAttachedPdfUrl] = useState<string>('');
  const [customStatusNotes, setCustomStatusNotes] = useState<string>('');

  // Simulated notification triggers
  const [notificationMsg, setNotificationMsg] = useState<{ text: string; type: 'whatsapp' | 'email' | 'toast' } | null>(null);

  useEffect(() => {
    fetchInquiries();
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    setMediaLoading(true);
    try {
      let items: MediaItem[] = [];
      const q = query(collection(db, 'gcc_dynamic_media'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as MediaItem);
      });

      // Synchronize/Fallback to LocalStorage
      const localMedia: MediaItem[] = JSON.parse(localStorage.getItem('gcc_dynamic_media') || '[]');
      const merged = [...items];
      localMedia.forEach(localItem => {
        const exists = merged.some(m => m.id === localItem.id || (m.titleEn === localItem.titleEn && m.createdAt === localItem.createdAt));
        if (!exists) {
          merged.push(localItem);
        }
      });

      merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMediaItems(merged);
      localStorage.setItem('gcc_dynamic_media', JSON.stringify(merged));
    } catch (err) {
      console.error("Firestore dynamic media retrieval failed. Using cache...", err);
      const localMedia: MediaItem[] = JSON.parse(localStorage.getItem('gcc_dynamic_media') || '[]');
      localMedia.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMediaItems(localMedia);
    } finally {
      setMediaLoading(false);
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const max_size = 1000; // max size in pixels
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.75); // compress quality to 0.75 JPEG
          resolve(dataUrl);
        };
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadError('');
    
    const files = Array.from(e.target.files);
    const newUploads: { name: string; base64: string }[] = [];
    
    for (const file of files) {
      try {
        const compressedBase64 = await compressImage(file);
        newUploads.push({
          name: file.name,
          base64: compressedBase64
        });
      } catch (err) {
        console.error("Image compression error", err);
        setUploadError(language === 'en' ? 'Failed to process some images.' : 'فشل ضغط ومعالجة بعض الصور.');
      }
    }

    setSelectedUploads(prev => [...prev, ...newUploads]);
  };

  const handleRemoveUpload = (index: number) => {
    setSelectedUploads(prev => prev.filter((_, i) => i !== index));
  };

  const clearMediaForm = () => {
    setMediaTitleEn('');
    setMediaTitleAr('');
    setMediaCategory('projects');
    setMediaDescriptionEn('');
    setMediaDescriptionAr('');
    setMediaType('project');
    setMediaClientEn('GCC Saudi Arabia');
    setMediaClientAr('شركة جي سي سي للمقاولات العامة');
    setMediaLocationEn('Riyadh, KSA');
    setMediaLocationAr('الرياض، المملكة العربية السعودية');
    setMediaYear(new Date().getFullYear().toString());
    setSelectedUploads([]);
    setUploadError('');
    setEditingMedia(null);
  };

  const handleAddOrEditMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitleEn || !mediaTitleAr) {
      setUploadError(language === 'en' ? 'Arabic and English titles are required!' : 'العنوان باللغتين العربية والانجليزية مطلوب!');
      return;
    }
    if (selectedUploads.length === 0 && !editingMedia) {
      setUploadError(language === 'en' ? 'At least one image is required!' : 'يجب رفع صورة واحدة على الأقل!');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      // 1. Upload new files to Node/Express backend folder structure
      const uploadedUrls: string[] = [];
      for (const upload of selectedUploads) {
        // Post base64 file to server /api/upload
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: `${Date.now()}_${upload.name}`,
            content: upload.base64,
            category: mediaCategory
          })
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }
        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      // If editing, combine older image URLs with the newly uploaded ones
      const finalImageUrls = editingMedia
        ? [...editingMedia.imageUrls, ...uploadedUrls]
        : uploadedUrls;

      const mediaPayload: Omit<MediaItem, 'id'> = {
        titleEn: mediaTitleEn,
        titleAr: mediaTitleAr,
        category: mediaCategory,
        descriptionEn: mediaDescriptionEn,
        descriptionAr: mediaDescriptionAr,
        type: mediaType,
        imageUrls: finalImageUrls,
        clientEn: mediaClientEn,
        clientAr: mediaClientAr,
        locationEn: mediaLocationEn,
        locationAr: mediaLocationAr,
        year: mediaYear,
        createdAt: editingMedia ? editingMedia.createdAt : new Date().toISOString()
      };

      let registeredId = editingMedia?.id || `local_media_${Date.now()}`;

      // 2. Persist in Firestore
      try {
        if (editingMedia?.id && !editingMedia.id.startsWith('local_')) {
          const docRef = doc(db, 'gcc_dynamic_media', editingMedia.id);
          await updateDoc(docRef, { ...mediaPayload });
        } else {
          const docRef = await addDoc(collection(db, 'gcc_dynamic_media'), mediaPayload);
          registeredId = docRef.id;
        }
      } catch (dbErr) {
        console.warn("Firestore save skipped/failed, proceeding offline with LocalStorage:", dbErr);
      }

      // 3. Save to LocalStorage cache
      const updatedItem: MediaItem = { id: registeredId, ...mediaPayload };
      const localMedia: MediaItem[] = JSON.parse(localStorage.getItem('gcc_dynamic_media') || '[]');
      
      let updatedLocal: MediaItem[];
      if (editingMedia) {
        updatedLocal = localMedia.map(item => item.id === editingMedia.id ? updatedItem : item);
      } else {
        updatedLocal = [updatedItem, ...localMedia];
      }

      localStorage.setItem('gcc_dynamic_media', JSON.stringify(updatedLocal));
      
      // Update state
      setMediaItems(updatedLocal);
      clearMediaForm();

      alert(language === 'en' ? 'Dynamic media successfully registered!' : 'تم حفظ وتجهيز الصورة والبيانات بنجاح ومطابقتها الميدانية!');
    } catch (err: any) {
      console.error("Media registration failed", err);
      setUploadError(err.message || (language === 'en' ? 'Error saving content.' : 'حصل خطأ في حفظ البيانات.'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditInit = (media: MediaItem) => {
    setEditingMedia(media);
    setMediaTitleEn(media.titleEn);
    setMediaTitleAr(media.titleAr);
    setMediaCategory(media.category);
    setMediaDescriptionEn(media.descriptionEn);
    setMediaDescriptionAr(media.descriptionAr);
    setMediaType(media.type);
    setMediaClientEn(media.clientEn || 'GCC Saudi Arabia');
    setMediaClientAr(media.clientAr || 'شركة جي سي سي للمقاولات العامة');
    setMediaLocationEn(media.locationEn || 'Riyadh, KSA');
    setMediaLocationAr(media.locationAr || 'الرياض، المملكة العربية السعودية');
    setMediaYear(media.year || new Date().getFullYear().toString());
    setSelectedUploads([]);
  };

  const handleDeleteMedia = async (mediaId?: string) => {
    if (!mediaId) return;
    if (!window.confirm(language === 'en' ? 'Are you sure you want to remove this project/image resource?' : 'هل أنت متأكد من رغبتك في حذف هذا الملف الهندسي / الصورة بالكامل؟')) return;

    try {
      if (!mediaId.startsWith('local_')) {
        await deleteDoc(doc(db, 'gcc_dynamic_media', mediaId));
      }
    } catch (err) {
      console.warn("Firestore delete failed, carrying on local mirror bypass...", err);
    }

    const localMedia: MediaItem[] = JSON.parse(localStorage.getItem('gcc_dynamic_media') || '[]');
    const filtered = localMedia.filter(item => item.id !== mediaId);
    localStorage.setItem('gcc_dynamic_media', JSON.stringify(filtered));
    setMediaItems(filtered);

    if (editingMedia?.id === mediaId) {
      clearMediaForm();
    }
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      let remoteInquiries: InquiryData[] = [];
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach((doc) => {
        remoteInquiries.push({
          id: doc.id,
          ...doc.data()
        } as InquiryData);
      });

      // Hybrid merge with local storage as reliable backup
      const localInquiries: InquiryData[] = JSON.parse(localStorage.getItem('gcc_inquiries') || '[]');
      
      // Filter out duplicates from local that might already exist in remote using ticketId
      const merged = [...remoteInquiries];
      localInquiries.forEach(localItem => {
        const alreadyExists = merged.some(m => m.ticketId === localItem.ticketId);
        if (!alreadyExists) {
          merged.push(localItem);
        }
      });

      // Sort by createdAt descending
      merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setInquiries(merged);
    } catch (err) {
      console.error("Firestore fetch failed. Pulling local cache direct...", err);
      // Direct local storage pull
      const localInquiries: InquiryData[] = JSON.parse(localStorage.getItem('gcc_inquiries') || '[]');
      localInquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setInquiries(localInquiries);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectInquiry = (inq: InquiryData) => {
    setSelectedInquiry(inq);
    if (inq.priceDetails) {
      setComponentsCost(inq.priceDetails.componentsCost || 0);
      setLaborFee(inq.priceDetails.laborFee || 0);
      setComplianceFee(inq.priceDetails.complianceFee || 0);
      setDiscountPercent(inq.priceDetails.discountPercent || 0);
      setComments(inq.priceDetails.comments || '');
    } else {
      setComponentsCost(0);
      setLaborFee(0);
      setComplianceFee(0);
      setDiscountPercent(0);
      setComments('');
    }
    // Set custom tracking inputs
    setEngineerName((inq as any).engineerName || '');
    setInspectionDate((inq as any).inspectionDate || '');
    setAttachedPdfUrl((inq as any).attachedPdfUrl || '');
    setCustomStatusNotes((inq as any).customStatusNotes || '');
  };

  // Live Auto-calculated total amount
  const calculatedTotal = React.useMemo(() => {
    const sum = componentsCost + laborFee + complianceFee;
    const discount = sum * (discountPercent / 100);
    return Math.max(0, sum - discount);
  }, [componentsCost, laborFee, complianceFee, discountPercent]);

  // Update Status
  const handleUpdateStatus = async (status: 'new' | 'under_review' | 'priced' | 'completed') => {
    if (!selectedInquiry) return;

    const pricePayload = {
      componentsCost,
      laborFee,
      complianceFee,
      discountPercent,
      totalAmount: status === 'priced' || status === 'completed' ? calculatedTotal : 0,
      comments
    };

    const updatedInquiry = {
      ...selectedInquiry,
      status,
      priceDetails: pricePayload,
      engineerName,
      inspectionDate,
      attachedPdfUrl,
      customStatusNotes
    };

    // Trigger instant mock notifications
    triggerImmediateNotifications(updatedInquiry, status);

    try {
      // 1. Update firestore if remote id exists
      if (selectedInquiry.id) {
        const docRef = doc(db, 'inquiries', selectedInquiry.id);
        await updateDoc(docRef, {
          status,
          priceDetails: pricePayload,
          engineerName,
          inspectionDate,
          attachedPdfUrl,
          customStatusNotes
        });
      }

      // 2. Synchronize local storage inquiries list
      const localInquiries: InquiryData[] = JSON.parse(localStorage.getItem('gcc_inquiries') || '[]');
      const updatedLocal = localInquiries.map(item => {
        if (item.ticketId === selectedInquiry.ticketId) {
          return updatedInquiry;
        }
        return item;
      });
      localStorage.setItem('gcc_inquiries', JSON.stringify(updatedLocal));

      // 3. Update active lists
      setInquiries(prev => prev.map(item => item.ticketId === selectedInquiry.ticketId ? updatedInquiry : item));
      setSelectedInquiry(updatedInquiry);
    } catch (err) {
      console.error("Firestore status write error. Proceeding with offline sync:", err);
      
      const localInquiries: InquiryData[] = JSON.parse(localStorage.getItem('gcc_inquiries') || '[]');
      const updatedLocal = localInquiries.map(item => {
        if (item.ticketId === selectedInquiry.ticketId) {
          return updatedInquiry;
        }
        return item;
      });
      localStorage.setItem('gcc_inquiries', JSON.stringify(updatedLocal));

      setInquiries(prev => prev.map(item => item.ticketId === selectedInquiry.ticketId ? updatedInquiry : item));
      setSelectedInquiry(updatedInquiry);
    }
  };

  // Immediate alerts / dispatches simulating SMS, WhatsApp & Mail
  const triggerImmediateNotifications = (inq: InquiryData, nextStatus: string) => {
    const statusLabel = nextStatus === 'under_review' ? 'تحت الدراسة ميكانيكياً' : 
                        nextStatus === 'priced' ? 'تم الطرح والتسعير' : 
                        nextStatus === 'completed' ? 'معتمد ومكتمل' : 'مستلم وجديد';

    // Simulated email and whatsapp triggers
    setNotificationMsg({
      text: language === 'en' 
        ? `[MANAGEMENT DISPATCH] Instantly notified GCC team & client (${inq.phone}) via WhatsApp & email: "Ticket ${inq.ticketId} escalated to '${statusLabel}' with total ${calculatedTotal} SAR."`
        : `[إشعار العمليات الفورية] تم إشعار الإدارة الفنية والعميل (${inq.phone}) عبر واتساب وبريد العميل: "تم تصعيد الطلب رمز (${inq.ticketId}) إلى حالة '${statusLabel}' بالمقايسة المقررة لـ ${calculatedTotal} ريال."`,
      type: 'whatsapp'
    });

    setTimeout(() => {
      setNotificationMsg(null);
    }, 6000);
  };

  // Reject / Cancel Order
  const handleDeleteInquiry = async (ticketId: string, id?: string) => {
    if(!window.confirm(language === 'en' ? "Are you sure you want to cancel / delete this quotation?" : "هل أنت متأكد من إلغاء وحذف طلب المقايسة هذا؟")) return;

    try {
      if (id) {
        await deleteDoc(doc(db, 'inquiries', id));
      }
      
      const localInquiries: InquiryData[] = JSON.parse(localStorage.getItem('gcc_inquiries') || '[]');
      const filteredLocal = localInquiries.filter(item => item.ticketId !== ticketId);
      localStorage.setItem('gcc_inquiries', JSON.stringify(filteredLocal));

      setInquiries(prev => prev.filter(item => item.ticketId !== ticketId));
      if (selectedInquiry?.ticketId === ticketId) {
        setSelectedInquiry(null);
      }
    } catch (err) {
      console.error("Delete failed, applying local filter", err);
      const localInquiries: InquiryData[] = JSON.parse(localStorage.getItem('gcc_inquiries') || '[]');
      const filteredLocal = localInquiries.filter(item => item.ticketId !== ticketId);
      localStorage.setItem('gcc_inquiries', JSON.stringify(filteredLocal));

      setInquiries(prev => prev.filter(item => item.ticketId !== ticketId));
      if (selectedInquiry?.ticketId === ticketId) {
        setSelectedInquiry(null);
      }
    }
  };

  const getServiceBadge = (serviceType: string) => {
    const map: Record<string, { label: string; bg: string }> = {
      fire_suppression: { label: language === 'en' ? 'Fire Fighting' : 'أنظمة إطفاء', bg: 'bg-red-50 text-red-700 border-red-100' },
      fire_alarm: { label: language === 'en' ? 'Fire Alarm' : 'أنظمة إنذار', bg: 'bg-amber-50 text-amber-700 border-amber-100' },
      power: { label: language === 'en' ? 'Generators' : 'مولدات كهربائية', bg: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
      hvac: { label: language === 'en' ? 'HVAC' : 'تكييف', bg: 'bg-blue-50 text-blue-700 border-blue-100' },
      cctv: { label: language === 'en' ? 'CCTV Cameras' : 'كاميرات مراقبة', bg: 'bg-emerald-50 text-emerald-700 border-emerald-100' }
    };
    return map[serviceType] || { label: 'General', bg: 'bg-slate-50 text-slate-700' };
  };

  const filterInquiries = inquiries.filter(inq => {
    const matchesSearch = inq.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inq.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (inq.company && inq.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          inq.location.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10 pb-16 font-sans">
      
      {/* Header element */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-red-600" />
            {language === 'en' ? 'GCC Engineering Admin Panel' : 'لوحة إدارة المقايسات والتسعير فئة GCC'}
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-semibold">
            {language === 'en'
              ? 'Control incoming electro-mechanical quotes, size hardware and dispatch civil approvals.'
              : 'مراجعة وتحديد كميات ومواصفات الطلبات الكهروميكانيكية، وتوليد عروض فنية ملزمة بالدفاع المدني.'}
          </p>
        </div>

        <button 
          onClick={fetchInquiries}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
        >
          <Clock className="w-4 h-4 text-slate-400" />
          <span>{language === 'en' ? 'Refresh Logs' : 'تحديث سجلات الطلبات'}</span>
        </button>
      </div>

      {/* Immediate notification dispatches animations */}
      <AnimatePresence>
        {notificationMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="bg-emerald-600 border border-emerald-500 text-white rounded-2xl p-4 flex gap-3 text-xs shadow-md shadow-emerald-950/20"
          >
            <MessageSquare className="w-5 h-5 text-emerald-100 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <span className="font-extrabold uppercase tracking-widest">{language === 'en' ? 'IMMEDIATE SMS & WHATSAPP SLA DISPATCH' : 'إشعار فوري وتثبيت بالمقايسة'}</span>
              <p className="mt-1 font-semibold text-emerald-50">{notificationMsg.text}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode selectors */}
      <div className="flex border-b border-slate-200 pb-px gap-6 text-sm">
        <button
          onClick={() => setAdminMode('quotes')}
          className={`pb-3 font-extrabold transition-all relative outline-none flex items-center gap-2 ${
            adminMode === 'quotes' 
              ? 'text-slate-900 border-b-2 border-red-600' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileText className="w-4.5 h-4.5" />
          <span>{language === 'en' ? 'Quotation & Engineering Requests' : 'طلبات عروض الأسعار والمقايسات'}</span>
        </button>
        <button
          onClick={() => setAdminMode('media')}
          className={`pb-3 font-extrabold transition-all relative outline-none flex items-center gap-2 ${
            adminMode === 'media' 
              ? 'text-slate-900 border-b-2 border-red-600' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ImageIcon className="w-4.5 h-4.5" />
          <span>{language === 'en' ? 'Manage Projects & Services' : 'إدارة الصور والمشاريع والخدمات'}</span>
        </button>
      </div>

      {adminMode === 'quotes' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left column (list of inquiries) - columns 5 */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm">
              <span className="text-xs font-black uppercase text-slate-400 block tracking-wider">
                {language === 'en' ? 'Spec Filters' : 'أدوات التصفية والبحث السريع'}
              </span>

              {/* In-list filter inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={language === 'en' ? 'Search client, company...' : 'ابحث عميل، منشأة...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-9 text-xs focus:outline-none focus:border-red-500 transition-all font-sans font-bold"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                </div>

                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-red-500 text-slate-700 font-bold font-sans"
                  >
                    <option value="all">{language === 'en' ? 'All Inquiries' : 'جميع عروض الأسعار'}</option>
                    <option value="new">{language === 'en' ? 'New Only' : 'الطلبات الجديدة'}</option>
                    <option value="under_review">{language === 'en' ? 'Under Review' : 'تحت الدراسة ميكانيكياً'}</option>
                    <option value="priced">{language === 'en' ? 'Priced Proposals' : 'العروض المسعّرة'}</option>
                    <option value="completed">{language === 'en' ? 'Completed Orders' : 'المعتمدة والمكتملة'}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List display */}
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl">
                  <Loader2 className="w-8 h-8 animate-spin text-red-650 mx-auto" />
                  <p className="text-xs text-slate-400 font-black tracking-tight mt-3">{language === 'en' ? 'Parsing engineering database logs...' : 'جاري سحب عروض الأسعار والطلبات...'}</p>
                </div>
              ) : filterInquiries.length === 0 ? (
                <div className="bg-white border border-slate-150 rounded-3xl p-8 text-center text-slate-400 italic text-xs font-semibold">
                  {language === 'en' ? 'No quote requests match these constraints.' : 'لم نجد أي طلبات كهروميكانيكية تطابق محدد البحث.'}
                </div>
              ) : (
                filterInquiries.map((inq) => {
                  const isSelected = selectedInquiry?.ticketId === inq.ticketId;
                  return (
                    <button
                      key={inq.ticketId}
                      onClick={() => handleSelectInquiry(inq)}
                      className={`w-full text-left bg-white p-4.5 rounded-2xl border text-slate-800 flex flex-col gap-3.5 transition-all outline-none ${
                        isSelected 
                          ? 'border-red-500 ring-4 ring-red-500/10 shadow-md' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full gap-4">
                        <div>
                          <span className="block font-black text-xs text-slate-900 leading-tight">
                            {inq.name}
                          </span>
                          {inq.company && (
                            <span className="block text-[10px] text-slate-400 font-bold leading-normal mt-0.5">
                              {inq.company}
                            </span>
                          )}
                        </div>

                        <div className="text-right">
                          <span className="font-mono text-[10px] font-black block tracking-tight text-slate-500">
                            {inq.ticketId}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono tracking-tighter block mt-0.5">
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center w-full pt-2 border-t border-slate-100">
                        <span className={`px-2.5 py-0.5 border rounded-lg text-[9px] font-extrabold uppercase ${getServiceBadge(inq.serviceType).bg}`}>
                          {getServiceBadge(inq.serviceType).label}
                        </span>

                        <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider ${
                          inq.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          inq.status === 'priced' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          inq.status === 'under_review' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          'bg-slate-50 text-slate-600 border border-slate-100'
                        }`}>
                          {inq.status === 'completed' ? (language === 'en' ? 'Completed' : 'مكتمل') :
                           inq.status === 'priced' ? (language === 'en' ? 'Priced' : 'تم التسعير') :
                           inq.status === 'under_review' ? (language === 'en' ? 'In Review' : 'تحت الدراسة') :
                           (language === 'en' ? 'New' : 'جديد')}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

          </div>


          {/* Right column: Selected Inquiry Detail Panel & Action Forms - columns 7 */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {selectedInquiry ? (
                <motion.div
                  key={selectedInquiry.ticketId}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-8 shadow-sm"
                >
                  
                  {/* Visual ID bar & controls */}
                  <div className="flex justify-between items-center pb-4 border-b border-slate-150">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 tracking-wider block uppercase">{language === 'en' ? 'ACTIVE ESTIMATOR CONTROL' : 'إدارة الحسابات بالمقايسة'}</span>
                      <h2 className="text-base font-black text-slate-900 font-mono tracking-tight mt-0.5">{selectedInquiry.ticketId}</h2>
                    </div>

                    <button
                      onClick={() => handleDeleteInquiry(selectedInquiry.ticketId, selectedInquiry.id)}
                      className="p-2 border border-slate-200 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-650 transition-all select-none"
                      title={language === 'en' ? 'Reject Quote' : 'رفض وحذف الطلب'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Patient / Client specification grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs font-sans pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-slate-400 block font-bold">{language === 'en' ? 'Full Client Name' : 'اسم العميل'}</span>
                      <span className="font-extrabold text-slate-800 block mt-0.5">{selectedInquiry.name}</span>
                    </div>

                    {selectedInquiry.company && (
                      <div>
                        <span className="text-slate-400 block font-bold">{language === 'en' ? 'Company / Firm' : 'اسم الشركة المنشأة'}</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">{selectedInquiry.company}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 block font-bold">{language === 'en' ? 'Phone Number' : 'رقم الهاتف'}</span>
                        <span className="text-slate-700 block mt-0.5 font-mono select-all font-semibold">{selectedInquiry.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">{language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}</span>
                        <span className="text-slate-700 block mt-0.5 font-mono select-all truncate font-semibold">{selectedInquiry.email}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-bold">{language === 'en' ? 'Site / Area Specified' : 'المساحة والمنطقة'}</span>
                      <span className="font-extrabold text-slate-800 block mt-0.5">
                        {selectedInquiry.location || 'Riyadh'} • <span className="font-mono text-xs">{selectedInquiry.projectArea} m²</span>
                      </span>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block font-bold">{language === 'en' ? 'Client Remarks' : 'الطلب والملاحظات المدونة'}</span>
                      <p className="text-slate-600 bg-slate-50 border border-slate-100 p-3 rounded-xl mt-1 font-semibold leading-relaxed font-sans italic">
                        “{selectedInquiry.message || (language === 'en' ? 'No extra remarks furnished.' : 'لم يتم إدراج مواصفات استثنائية وبانتظار معاينة المخططات.')}”
                      </p>
                    </div>

                    {selectedInquiry.uploadedFiles && selectedInquiry.uploadedFiles.length > 0 && (
                      <div className="sm:col-span-2">
                        <span className="text-slate-400 block font-bold mb-1.5">{language === 'en' ? 'Uploaded Blueprints & CAD Files' : 'المخططات وصور المنشأة المرفوعة'}</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {selectedInquiry.uploadedFiles.map((f, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-150 text-[11px]">
                              <span className="truncate flex-1 font-mono text-slate-600">{f}</span>
                              <div className="flex gap-1.5 shrink-0 pl-2">
                                {/* Open link simulated */}
                                <button 
                                  onClick={() => alert(language === 'en' ? `Opening document ${f}` : `جاري فتح المستند ${f}`)}
                                  className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>


                  {/* TAB SECTION: Escalations and Automated pricing sliders (نظام تقييم تلقائي) */}
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-xs font-black text-slate-905 uppercase tracking-wider flex items-center gap-1">
                        <TrendingUp className="w-4.5 h-4.5 text-red-600" />
                        {language === 'en' ? 'Automated MEP Pricing Controls' : 'مدخلات بنود المقايسة ومقدار السعر'}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold">
                        {language === 'en' ? 'Input estimated hardware components and construction costs' : 'اضبط الأسعار الآتية، وسيتم تجميع الإجمالي وصياغة الفاتورة الذكية تلقائياً'}
                      </p>
                    </div>

                    {/* Pricing Fields grid inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Component Materials Cost */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-600 block">
                          {language === 'en' ? '1. Material & Devices Cost (SAR)' : '١. تكلفة التوريدات والمواد الأساسية (ريال)'}
                        </label>
                        <input
                          type="number"
                          value={componentsCost || ''}
                          onChange={(e) => setComponentsCost(Number(e.target.value))}
                          placeholder="e.g. 15000"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 font-bold font-mono text-slate-900"
                        />
                      </div>

                      {/* Labor installation Fee */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-600 block">
                          {language === 'en' ? '2. Engineering Installation & Labor (SAR)' : '٢. أجور التأسيس والتركيب بالتكييف/الإطفاء (ريال)'}
                        </label>
                        <input
                          type="number"
                          value={laborFee || ''}
                          onChange={(e) => setLaborFee(Number(e.target.value))}
                          placeholder="e.g. 4500"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 font-bold font-mono text-slate-900"
                        />
                      </div>

                      {/* Reg and compliance fee */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-600 block">
                          {language === 'en' ? '3. Civil Defense Approval & Certification Fee' : '٣. الرسوم التنظيمية وشهادات الدفاع المدني'}
                        </label>
                        <input
                          type="number"
                          value={complianceFee || ''}
                          onChange={(e) => setComplianceFee(Number(e.target.value))}
                          placeholder="e.g. 1800"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 font-bold font-mono text-slate-900"
                        />
                      </div>

                      {/* Global Discount % */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-600 block">
                          {language === 'en' ? '4. Special Customer Discount (%)' : '٤. خصم مالي تفضيلي خاص بالعميل (%)'}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={discountPercent || ''}
                            max="90"
                            onChange={(e) => setDiscountPercent(Math.min(90, Number(e.target.value)))}
                            placeholder="e.g. 10"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-xs focus:outline-none focus:border-red-500 font-bold font-mono text-slate-900 text-left"
                          />
                          <div className="absolute top-1/2 -translate-y-1/2 right-4 text-xs font-bold text-slate-400 font-sans">%</div>
                        </div>
                      </div>

                      {/* Comments leading lead */}
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-black text-slate-600 block">
                          {language === 'en' ? 'Engineering Lead Comments & SLA notes' : 'توجيه وملاحظات المهندس المسؤول'}
                        </label>
                        <input
                          type="text"
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          placeholder={language === 'en' ? 'Conforms strictly with NFPA standards, pressure safety logs clear.' : 'أحمال وتدفق المياه مطابقة للأكواد، وتم اعتماد سماكة مواسير الإطفاء.'}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 font-bold font-sans text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Progress tracking details form inputs */}
                    <div className="space-y-4 pt-5 border-t border-slate-150 text-right">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider block">
                          {language === 'en' ? 'Track Progress SLA & Engineer Parameters' : 'بيانات مهندس المعاينة وتفاصيل التتبع للعميل'}
                        </h4>
                        <p className="text-[10.5px] text-slate-450 font-bold block">
                          {language === 'en' ? 'Manage assignee details, proposal attachments, and custom milestone text for customer view.' : 'املأ هذه الخانات الإضافية لتظهر فوراً للعميل في صفحة تتبع الطلبات لتوفير تجربة بروفيشنال.'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Engineer Name Input */}
                        <div className="space-y-1.5 flex flex-col gap-1 text-right">
                          <label className="text-[10px] font-black text-slate-600 uppercase block">
                            {language === 'en' ? 'Designated Project Engineer' : 'المهندس المسؤول عن المشروع'}
                          </label>
                          <input
                            type="text"
                            value={engineerName}
                            onChange={(e) => setEngineerName(e.target.value)}
                            placeholder={language === 'en' ? 'e.g. Eng. Khalid Al-Qahtani' : 'مثال: م. خالد القحطاني'}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 font-bold text-right"
                          />
                        </div>

                        {/* Proposal PDF Attachment URL */}
                        <div className="space-y-1.5 flex flex-col gap-1 text-right">
                          <label className="text-[10px] font-black text-slate-600 uppercase block">
                            {language === 'en' ? 'Official Quotation PDF Link' : 'رابط عرض السعر المعتمد PDF'}
                          </label>
                          <input
                            type="text"
                            value={attachedPdfUrl}
                            onChange={(e) => setAttachedPdfUrl(e.target.value)}
                            placeholder={language === 'en' ? 'e.g. https://gcc-company.com/proposals/draft.pdf' : 'مثال: https://gcc-company.com/uploads/gcc-draft-proposal.pdf'}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 font-bold font-mono text-slate-800 text-left"
                          />
                        </div>

                        {/* Inspection schedule date */}
                        <div className="space-y-1.5 flex flex-col gap-1 text-right">
                          <label className="text-[10px] font-black text-slate-600 uppercase block">
                            {language === 'en' ? 'Site Inspection Date & Time' : 'توقيت الزيارة والمعاينة الميدانية'}
                          </label>
                          <input
                            type="text"
                            value={inspectionDate}
                            onChange={(e) => setInspectionDate(e.target.value)}
                            placeholder={language === 'en' ? 'e.g. Thursday, 2:30 PM' : 'مثال: الخميس القادم الساعة ٢:٣٠ ظهراً'}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 font-bold text-right"
                          />
                        </div>

                        {/* Custom status notes */}
                        <div className="space-y-1.5 flex flex-col gap-1 text-right">
                          <label className="text-[10px] font-black text-slate-600 uppercase block">
                            {language === 'en' ? 'Custom SLA Progression Message' : 'مذكرة إجراء المعاينة المحدثة مخصصة'}
                          </label>
                          <input
                            type="text"
                            value={customStatusNotes}
                            onChange={(e) => setCustomStatusNotes(e.target.value)}
                            placeholder={language === 'en' ? 'e.g. Sizing reports submitted to Civil Defense...' : 'مثال: تم طرح الحسابات الهيدروليكية ومطابقتها مع المهندس الاستشاري...'}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 font-bold text-right"
                          />
                        </div>
                      </div>
                    </div>

                    {/* COMPUTED SUM OUTPUT */}
                    <div className="bg-slate-950 text-white rounded-2xl p-5 flex items-center justify-between font-sans shadow shadow-rose-950/15">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{language === 'en' ? 'Calculated Grand Proposal Sizing' : 'المجموع النهائي للمقايسة المقررة'}</span>
                        <p className="text-[9.5px] text-slate-400 mt-1">{language === 'en' ? 'Values are automatically calculated from variables.' : 'محدث تلقائياً ومطابق لضريبة القيمة المضافة والشروط.'}</p>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-2xl font-black text-red-500">
                          {calculatedTotal.toLocaleString()} <span className="text-xs font-sans font-extrabold">{language === 'en' ? 'SAR' : 'ريال'}</span>
                        </div>
                      </div>
                    </div>


                    {/* STATE ACTION CONTROLS TRANSITION BAR */}
                    <div className="pt-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">{language === 'en' ? 'Transition Status SLA' : 'تعديل حالة ومستوى الطلب بالموقع:'}</span>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { key: 'new', label: language === 'en' ? 'Set New' : 'جديد', color: 'bg-slate-150 hover:bg-slate-250 border-slate-300 text-slate-700' },
                          { key: 'under_review', label: language === 'en' ? 'In Review' : 'قيد المراجعة', color: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-800' },
                          { key: 'priced', label: language === 'en' ? 'Submit Pricing' : 'تسعير وبث عرض', color: 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900 font-bold' },
                          { key: 'completed', label: language === 'en' ? 'Set Completed' : 'اعتماد واكتمال', color: 'bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold border-emerald-600' }
                        ].map((btn) => (
                          <button
                            type="button"
                            key={btn.key}
                            onClick={() => handleUpdateStatus(btn.key as any)}
                            className={`px-3 py-3 border rounded-xl text-[11px] text-center transition-all shadow-sm active:scale-95 leading-none block ${btn.color}`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                </motion.div>
              ) : (
                /* selected empty state view */
                <motion.div
                  key="empty-selection"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center space-y-4 shadow-inner"
                >
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-400 shadow-sm">
                    <User className="w-7 h-7" />
                  </div>
                  <div className="space-y-1 max-w-xs mx-auto text-center">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      {language === 'en' ? 'Awaiting Quote Selection' : 'يرجى اختيار طلب لتسعيره'}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-semibold leading-relaxed font-sans">
                      {language === 'en'
                        ? 'Select an engineering inquiry card from the sidebar list to inspect blueprints, adjust values and calculate civil proposals instantly.'
                        : 'حدد أحد العروض أو بطاقات العملاء في القائمة لتعديل وحساب أسعار الأصناف، وتوليد بطاقة تسعير تتبع فوري بموقع GCC.'}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Create & Edit Form (Col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  {editingMedia 
                    ? (language === 'en' ? 'Modify Media Resource' : 'تعديل الملف والبيانات') 
                    : (language === 'en' ? 'Register New Media' : 'رفع وإدراج صورة أو مشروع جديد')}
                </span>
                {editingMedia && (
                  <button 
                    onClick={clearMediaForm}
                    className="text-xs font-bold text-red-650 hover:underline"
                  >
                    {language === 'en' ? 'Cancel Edit' : 'إلغاء التعديل'}
                  </button>
                )}
              </div>

              <form onSubmit={handleAddOrEditMedia} className="space-y-4 font-sans text-xs">
                {/* Titles */}
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-700">{language === 'en' ? 'Arabic Title *' : 'العنوان بالعربية *'}</label>
                  <input 
                    type="text" 
                    value={mediaTitleAr} 
                    onChange={e => setMediaTitleAr(e.target.value)} 
                    placeholder="مثال: تركيب نظام إطفاء المبنى المالي" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-700">{language === 'en' ? 'English Title *' : 'العنوان بالإنجليزية *'}</label>
                  <input 
                    type="text" 
                    value={mediaTitleEn} 
                    onChange={e => setMediaTitleEn(e.target.value)} 
                    placeholder="e.g. HVAC system Al-Rajhi center" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 font-bold"
                  />
                </div>

                {/* Classification Classification and Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-700">{language === 'en' ? 'Placement Section' : 'نوع التصنيف بالموقع'}</label>
                    <select 
                      value={mediaType} 
                      onChange={e => setMediaType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs focus:outline-none focus:border-red-500 text-slate-800 font-bold font-sans"
                    >
                      <option value="project">{language === 'en' ? 'Project' : 'مشروع (سوابق الأعمال)'}</option>
                      <option value="service">{language === 'en' ? 'Service Tab' : 'خدمة (بيانات وقدرات)'}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-700">{language === 'en' ? 'Engineering Category' : 'القسم الهندسي المجموع'}</label>
                    <select 
                      value={mediaCategory} 
                      onChange={e => setMediaCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs focus:outline-none focus:border-red-500 text-slate-800 font-bold font-sans"
                    >
                      <option value="projects">{language === 'en' ? 'Projects Section Only' : 'عرض عام بقسم المشاريع'}</option>
                      <option value="fire">{language === 'en' ? 'Fire Suppression' : 'إطفاء ومكافحة الحريق'}</option>
                      <option value="cooling">{language === 'en' ? 'HVAC' : 'تكييف الهواء المركزي'}</option>
                      <option value="power">{language === 'en' ? 'Power Backup / Gen' : 'مولدات وطاقة طوارئ'}</option>
                      <option value="cctv">{language === 'en' ? 'CCTV Camera' : 'كاميرات مراقبة وحماية'}</option>
                    </select>
                  </div>
                </div>

                {/* Optional Project specifications fields if mediaType === 'project' */}
                {mediaType === 'project' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 border-t border-dashed border-slate-100 pt-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-extrabold text-slate-500">{language === 'en' ? 'Project Client (EN)' : 'العميل بالإنجليزية'}</label>
                        <input 
                          type="text" 
                          value={mediaClientEn} 
                          onChange={e => setMediaClientEn(e.target.value)} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:border-red-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-extrabold text-slate-500">{language === 'en' ? 'Project Client (AR)' : 'العميل بالعربية'}</label>
                        <input 
                          type="text" 
                          value={mediaClientAr} 
                          onChange={e => setMediaClientAr(e.target.value)} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-extrabold text-slate-500">{language === 'en' ? 'Location (EN)' : 'الموقع بالإنجليزية'}</label>
                        <input 
                          type="text" 
                          value={mediaLocationEn} 
                          onChange={e => setMediaLocationEn(e.target.value)} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:border-red-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-extrabold text-slate-500">{language === 'en' ? 'Location (AR)' : 'الموقع بالعربية'}</label>
                        <input 
                          type="text" 
                          value={mediaLocationAr} 
                          onChange={e => setMediaLocationAr(e.target.value)} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-extrabold text-slate-500">{language === 'en' ? 'Year of Execution' : 'سنة التنفيذ'}</label>
                      <input 
                        type="text" 
                        value={mediaYear} 
                        onChange={e => setMediaYear(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:border-red-500"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Descriptions */}
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-700">{language === 'en' ? 'Arabic Description' : 'شرح وتفاصيل العمل بالعربية'}</label>
                  <textarea 
                    value={mediaDescriptionAr} 
                    onChange={e => setMediaDescriptionAr(e.target.value)} 
                    rows={3}
                    placeholder="مثال: توريد وبناء تشغلي كامل لنظام الرش الرطب..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-700">{language === 'en' ? 'English Description' : 'شرح وتفاصيل العمل بالإنجليزية'}</label>
                  <textarea 
                    value={mediaDescriptionEn} 
                    onChange={e => setMediaDescriptionEn(e.target.value)} 
                    rows={3}
                    placeholder="e.g. Complete wet sprinkler and dry gas implementation..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 font-medium"
                  />
                </div>

                {/* Instant Compression Drag & Drop File Upload field */}
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-700 flex items-center justify-between">
                    <span>{language === 'en' ? 'Upload Images *' : 'رفع الصور الملحقة *'}</span>
                    <span className="text-[10px] text-emerald-600 font-black tracking-normal bg-emerald-50 px-2 py-0.5 rounded uppercase">Auto Compressed (JPEG 0.75)</span>
                  </label>

                  <div className="border-2 border-dashed border-slate-200 hover:border-red-500 rounded-2xl p-4 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-all relative">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <span className="text-[11px] font-black block text-slate-700">{language === 'en' ? 'Drag and drop files here, or Click to browse' : 'أفلت الصور هنا، أو اضغط للتصفح'}</span>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">{language === 'en' ? 'Supports multiple image selections' : 'بإمكانك تصفح واختيار عدة صور للمشروع أو قبل وبعد الصيانة'}</p>
                  </div>
                </div>

                {/* Previews grid of chosen items */}
                {selectedUploads.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">{language === 'en' ? 'Selected Attachment Previews' : 'معاينة المرفقات المحددة'}</span>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedUploads.map((up, i) => (
                        <div key={i} className="relative h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                          <img src={up.base64} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => handleRemoveUpload(i)}
                            className="absolute top-1 right-1 bg-red-650 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px] shadow"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* If editing, show older images */}
                {editingMedia && editingMedia.imageUrls && editingMedia.imageUrls.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">{language === 'en' ? 'Currently Saved Assets' : 'الصور الحالية المعتمدة بالملف'}</span>
                    <div className="grid grid-cols-4 gap-2">
                      {editingMedia.imageUrls.map((img, i) => (
                        <div key={i} className="relative h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img src={img} alt="Current Asset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {uploadError && (
                  <div className="bg-red-50 border border-red-100 text-red-650 px-3 py-2 rounded-xl text-[10px] font-bold flex gap-1.5 items-center">
                    <AlertCircle className="w-4 h-4" />
                    <span>{uploadError}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="w-full bg-red-650 hover:bg-red-700 text-white font-extrabold rounded-xl py-3 shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 text-xs disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                      <span>{language === 'en' ? 'Storing items in secure cabinet...' : 'جاري كتابة وتجهيز الرابط على الخادم...'}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4.5 h-4.5" />
                      <span>{editingMedia 
                        ? (language === 'en' ? 'Commit Changes' : 'حفظ التعديلات المدخلة') 
                        : (language === 'en' ? 'Upload and Publish Asset' : 'بث وتفعيل الصورة بالموقع مباشرة')}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Library and Directory layout (Col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase">
                    {language === 'en' ? 'Live Dynamic Media list' : 'المستودع ومكتبة الصور النشطة'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">
                    {language === 'en' 
                      ? 'Media objects are served instantly across slider widget, projects catalogue, and specialized tabs.'
                      : 'الصور والملفات المدرجة هنا تظهر تلقائياً في السلايدر، صفحات المشاريع المنجزة وضمن خانات الخدمات التكتيكية.'}
                  </p>
                </div>
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 border border-indigo-100 rounded-full text-[10px] font-black font-mono">
                  {mediaItems.length} {language === 'en' ? 'Total' : 'عناصر معتمدة'}
                </span>
              </div>

              {/* Dynamic list rendering */}
              {mediaLoading ? (
                <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                  <Loader2 className="w-8 h-8 animate-spin text-red-650 mx-auto" />
                  <p className="text-xs text-slate-400 font-extrabold mt-3">{language === 'en' ? 'Querying static routes catalogs...' : 'جاري تجميع روابط المجلدات والملفات...'}</p>
                </div>
              ) : mediaItems.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 italic font-semibold text-xs">
                  {language === 'en' ? 'No dynamic images uploaded yet.' : 'لا توجد صور أو مصادر كهروميكانيكية مضاف حالياً.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mediaItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-40 bg-slate-100 overflow-hidden shrink-0">
                        {item.imageUrls && item.imageUrls.length > 0 ? (
                          <img src={item.imageUrls[0]} alt={item.titleEn} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon className="w-10 h-10" />
                          </div>
                        )}
                        <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border border-white/10">
                          {item.type === 'project' ? (language === 'en' ? 'Project' : 'مشاريع وتركيبات') : (language === 'en' ? 'Service Tab' : 'خدمات وتأسيس')}
                        </span>
                        {item.imageUrls && item.imageUrls.length > 1 && (
                          <span className="absolute bottom-2.5 right-2.5 bg-red-650/90 text-white text-[8px] font-black px-2 py-1 rounded-lg">
                            +{item.imageUrls.length - 1} {language === 'en' ? 'More Images' : 'صور إضافية'}
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-3 font-sans">
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-xs line-clamp-1">
                            {language === 'en' ? item.titleEn : item.titleAr}
                          </h4>
                          <span className="inline-block bg-slate-50 border border-slate-150 text-[8px] px-2 py-0.5 rounded font-mono text-slate-400 mt-1 uppercase">
                            /{item.category} • {item.year || '2026'}
                          </span>
                        </div>

                        <p className="text-[10.5px] text-slate-500 leading-normal line-clamp-2">
                          {language === 'en' ? item.descriptionEn : item.descriptionAr}
                        </p>

                        <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 shrink-0">
                          {/* Live path readout */}
                          <span className="font-mono text-[8.5px] text-slate-450 select-all truncate max-w-[120px]" title={item.imageUrls && item.imageUrls[0]}>
                            {item.imageUrls && item.imageUrls[0]}
                          </span>

                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditInit(item)}
                              className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                              title={language === 'en' ? 'Edit details' : 'تعديل البيانات'}
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteMedia(item.id)}
                              className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:text-red-650 hover:bg-slate-50 transition-colors"
                              title={language === 'en' ? 'Delete resource' : 'حذف المصادر والصورة'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
