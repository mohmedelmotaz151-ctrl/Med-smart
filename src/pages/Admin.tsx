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
  CheckCircle,
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
  Edit,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight
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
  type: 'project' | 'service' | 'equipment';
  visible?: boolean;
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
  const [mediaType, setMediaType] = useState<'project' | 'service' | 'equipment'>('project');
  const [mediaClientEn, setMediaClientEn] = useState('GCC Saudi Arabia');
  const [mediaClientAr, setMediaClientAr] = useState('شركة جي سي سي للمقاولات العامة');
  const [mediaLocationEn, setMediaLocationEn] = useState('Riyadh, KSA');
  const [mediaLocationAr, setMediaLocationAr] = useState('الرياض، المملكة العربية السعودية');
  const [mediaYear, setMediaYear] = useState(new Date().getFullYear().toString());
  const [mediaVisible, setMediaVisible] = useState<boolean>(true);
  const [mediaListFilter, setMediaListFilter] = useState<'all' | 'project' | 'service' | 'equipment'>('all');
  const [selectedPreviewMedia, setSelectedPreviewMedia] = useState<MediaItem | null>(null);
  const [previewImageIndex, setPreviewImageIndex] = useState<number>(0);

  useEffect(() => {
    setPreviewImageIndex(0);
  }, [selectedPreviewMedia]);
  
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
  const [customItems, setCustomItems] = useState<Array<{ id: string; nameAr: string; nameEn: string; qty: number; unitPrice: number; total: number }>>([]);
  const [newItemNameAr, setNewItemNameAr] = useState('');
  const [newItemNameEn, setNewItemNameEn] = useState('');
  const [newItemQty, setNewItemQty] = useState<number>(1);
  const [newItemPrice, setNewItemPrice] = useState<number>(0);
  
  // Custom tracking metadata states
  const [engineerName, setEngineerName] = useState<string>('');
  const [inspectionDate, setInspectionDate] = useState<string>('');
  const [attachedPdfUrl, setAttachedPdfUrl] = useState<string>('');
  const [customStatusNotes, setCustomStatusNotes] = useState<string>('');

  // Simulated notification triggers
  const [notificationMsg, setNotificationMsg] = useState<{ text: string; type: 'whatsapp' | 'email' | 'toast' } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const copyToClipboard = (text: string): boolean => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) {
      console.warn("Navigator clipboard failed, using fallback:", err);
    }
    
    // Bulletproof offscreen fallback
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.top = "0";
      textarea.style.left = "0";
      textarea.style.width = "2em";
      textarea.style.height = "2em";
      textarea.style.padding = "0";
      textarea.style.border = "none";
      textarea.style.outline = "none";
      textarea.style.boxShadow = "none";
      textarea.style.background = "transparent";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);
      return successful;
    } catch (err) {
      console.error("Fallback copy to clipboard failed:", err);
      return false;
    }
  };

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
      let merged = [...items];
      localMedia.forEach(localItem => {
        const exists = merged.some(m => m.id === localItem.id || (m.titleEn === localItem.titleEn && m.createdAt === localItem.createdAt));
        if (!exists) {
          merged.push(localItem);
        }
      });

      const hasEquipment = merged.some(m => m.type === 'equipment');
      if (!hasEquipment) {
        const defaultEquipmentSeeds: MediaItem[] = [
          {
            id: 'default_eq_1',
            titleEn: 'High-Rise Steel & Foundation Rigs',
            titleAr: 'أعمال صب الخرسانات ورافعات الهياكل الهندسية',
            category: 'projects',
            descriptionEn: 'Executing grand excavations, deep piling foundation engineering complying with structural engineering SBC safety metrics.',
            descriptionAr: 'تجهيز وتشييد المباني الشاهقة وحسابات الحفر العميقة ودعم الأنفاق بالأبراج السكنية والطبية.',
            imageUrls: ['https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1200'],
            type: 'equipment',
            visible: true,
            createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
          },
          {
            id: 'default_eq_2',
            titleEn: 'Precision Calibration & Live Diagnostics',
            titleAr: 'الفحص الرقمي والمعاينة الميدانية بدقة',
            category: 'projects',
            descriptionEn: 'Our engineers supervise installations with advanced computerized analysis for thermal readings and signal circuits.',
            descriptionAr: 'مراقبة دائمة وإشراف هندسي متكامل لضمان مطابقة التركيبات للمخططات التكعيبية والمصادقات الرسمية.',
            imageUrls: ['https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1200'],
            type: 'equipment',
            visible: true,
            createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
          },
          {
            id: 'default_eq_3',
            titleEn: 'ATS Switches & Heavy-Duty Busbar Layout',
            titleAr: 'قواطع ضغط ومفاتيح التحويل التلقائية المزدوجة',
            category: 'projects',
            descriptionEn: 'Structuring high-voltage breakers and weatherproof cabinet shelters to withstand harsh Saudi desert environments.',
            descriptionAr: 'توفير وتجميع خلايا التوزيع الكهربائية ونقاط التماس المحكومة لتجنب انقطاع التيار والتأثر بالغبار والحرارة.',
            imageUrls: ['https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1200'],
            type: 'equipment',
            visible: true,
            createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
          },
          {
            id: 'default_eq_4',
            titleEn: 'NFPA Compliant Valves & FM-200 Loops',
            titleAr: 'شبكات مرشات التدفق المائي ومضخات مكافحة اللهب',
            category: 'projects',
            descriptionEn: 'Heavy engineering design for dry and wet alarm check valves keeping continuous automatic pressure indicators safe.',
            descriptionAr: 'شبكات متدفقة جافة لغرف التحكم وخراطيم تغذية رئيسية مطابقة لاشتراطات الدفاع المدني السعودي.',
            imageUrls: ['https://images.pexels.com/photos/3825585/pexels-photo-3825585.jpeg?auto=compress&cs=tinysrgb&w=1200'],
            type: 'equipment',
            visible: true,
            createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
          },
          {
            id: 'default_eq_5',
            titleEn: 'Hydraulic Rigs & Precision High Lift Solutions',
            titleAr: 'رافعات الإنشاءات والأنظمة الهيدروليكية الضخمة',
            category: 'projects',
            descriptionEn: 'Logistical muscle using multi-ton mobile and crawler cranes to place massive modular chiller coils with precision.',
            descriptionAr: 'معدات مناولة ونقل أحمال الروابط والـ Chiller والصمامات الكونية الكبرى لضمان تدشين سريع وآمن.',
            imageUrls: ['https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1200'],
            type: 'equipment',
            visible: true,
            createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
          },
          {
            id: 'default_eq_6',
            titleEn: 'UL/FM Certified Pump Installation',
            titleAr: 'توريد وتركيب مضخات الحريق المعتمدة UL/FM',
            category: 'projects',
            descriptionEn: 'Supply and installation of certified fire pumps in accordance with safety standards, with complete firefighting execution.',
            descriptionAr: 'توريد وتركيب مضخات الحريق المعتمدة وفق معايير السلامة العالمية، مع تنفيذ كامل لشبكات الإطفاء وأنظمة التحكم.',
            imageUrls: ['/images/fire-pump.jpg'],
            type: 'equipment',
            visible: true,
            createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
          }
        ];
        merged = [...merged, ...defaultEquipmentSeeds];
      }

      merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMediaItems(merged);
      localStorage.setItem('gcc_dynamic_media', JSON.stringify(merged));
    } catch (err) {
      console.error("Firestore dynamic media retrieval failed. Using cache...", err);
      let localMedia: MediaItem[] = JSON.parse(localStorage.getItem('gcc_dynamic_media') || '[]');
      
      const hasEquipment = localMedia.some(m => m.type === 'equipment');
      if (!hasEquipment) {
        const defaultEquipmentSeeds: MediaItem[] = [
          {
            id: 'default_eq_1',
            titleEn: 'High-Rise Steel & Foundation Rigs',
            titleAr: 'أعمال صب الخرسانات ورافعات الهياكل الهندسية',
            category: 'projects',
            descriptionEn: 'Executing grand excavations, deep piling foundation engineering complying with structural engineering SBC safety metrics.',
            descriptionAr: 'تجهيز وتشييد المباني الشاهقة وحسابات الحفر العميقة ودعم الأنفاق بالأبراج السكنية والطبية.',
            imageUrls: ['https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1200'],
            type: 'equipment',
            visible: true,
            createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
          },
          {
            id: 'default_eq_2',
            titleEn: 'Precision Calibration & Live Diagnostics',
            titleAr: 'الفحص الرقمي والمعاينة الميدانية بدقة',
            category: 'projects',
            descriptionEn: 'Our engineers supervise installations with advanced computerized analysis for thermal readings and signal circuits.',
            descriptionAr: 'مراقبة دائمة وإشراف هندسي متكامل لضمان مطابقة التركيبات للمخططات التكعيبية والمصادقات الرسمية.',
            imageUrls: ['https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1200'],
            type: 'equipment',
            visible: true,
            createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
          },
          {
            id: 'default_eq_3',
            titleEn: 'ATS Switches & Heavy-Duty Busbar Layout',
            titleAr: 'قواطع ضغط ومفاتيح التحويل التلقائية المزدوجة',
            category: 'projects',
            descriptionEn: 'Structuring high-voltage breakers and weatherproof cabinet shelters to withstand harsh Saudi desert environments.',
            descriptionAr: 'توفير وتجميع خلايا التوزيع الكهربائية ونقاط التماس المحكومة لتجنب انقطاع التيار والتأثر بالغبار والحرارة.',
            imageUrls: ['https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1200'],
            type: 'equipment',
            visible: true,
            createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
          },
          {
            id: 'default_eq_4',
            titleEn: 'NFPA Compliant Valves & FM-200 Loops',
            titleAr: 'شبكات مرشات التدفق المائي ومضخات مكافحة اللهب',
            category: 'projects',
            descriptionEn: 'Heavy engineering design for dry and wet alarm check valves keeping continuous automatic pressure indicators safe.',
            descriptionAr: 'شبكات متدفقة جافة لغرف التحكم وخراطيم تغذية رئيسية مطابقة لاشتراطات الدفاع المدني السعودي.',
            imageUrls: ['https://images.pexels.com/photos/3825585/pexels-photo-3825585.jpeg?auto=compress&cs=tinysrgb&w=1200'],
            type: 'equipment',
            visible: true,
            createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
          },
          {
            id: 'default_eq_5',
            titleEn: 'Hydraulic Rigs & Precision High Lift Solutions',
            titleAr: 'رافعات الإنشاءات والأنظمة الهيدروليكية الضخمة',
            category: 'projects',
            descriptionEn: 'Logistical muscle using multi-ton mobile and crawler cranes to place massive modular chiller coils with precision.',
            descriptionAr: 'معدات مناولة ونقل أحمال الروابط والـ Chiller والصمامات الكونية الكبرى لضمان تدشين سريع وآمن.',
            imageUrls: ['https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1200'],
            type: 'equipment',
            visible: true,
            createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
          },
          {
            id: 'default_eq_6',
            titleEn: 'UL/FM Certified Pump Installation',
            titleAr: 'توريد وتركيب مضخات الحريق المعتمدة UL/FM',
            category: 'projects',
            descriptionEn: 'Supply and installation of certified fire pumps in accordance with safety standards, with complete firefighting execution.',
            descriptionAr: 'توريد وتركيب مضخات الحريق المعتمدة وفق معايير السلامة العالمية، مع تنفيذ كامل لشبكات الإطفاء وأنظمة التحكم.',
            imageUrls: ['/images/fire-pump.jpg'],
            type: 'equipment',
            visible: true,
            createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
          }
        ];
        localMedia = [...localMedia, ...defaultEquipmentSeeds];
        localStorage.setItem('gcc_dynamic_media', JSON.stringify(localMedia));
      }
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
    setMediaVisible(true);
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
        try {
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
        } catch (uploadErr) {
          console.warn("Backend file upload failed, falling back to base64 encoding directly:", uploadErr);
          // Fallback directly to the base64 content
          uploadedUrls.push(upload.base64);
        }
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
        visible: mediaVisible,
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
    setMediaVisible(media.visible !== false);
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

  const handleToggleVisibility = async (item: MediaItem) => {
    if (!item.id) return;
    const updatedVisible = item.visible === false ? true : false;
    const updatedItem = { ...item, visible: updatedVisible };
    
    // update locally
    const localMedia: MediaItem[] = JSON.parse(localStorage.getItem('gcc_dynamic_media') || '[]');
    const updatedLocal = localMedia.map(m => m.id === item.id ? updatedItem : m);
    localStorage.setItem('gcc_dynamic_media', JSON.stringify(updatedLocal));
    setMediaItems(updatedLocal);
    
    // update in Firestore (if not local-only)
    if (!item.id.startsWith('local_')) {
      try {
        await updateDoc(doc(db, 'gcc_dynamic_media', item.id), { visible: updatedVisible });
      } catch (err) {
        console.warn("Could not toggle visibility in Firestore, kept offline change", err);
      }
    }
    triggerToast(
      language === 'en' 
        ? `Status updated to ${updatedVisible ? 'Visible' : 'Hidden'}` 
        : `تم تعديل حالة العرض إلى ${updatedVisible ? 'معروض للزوار' : 'مخفي مؤقتاً بالواجهة'}`
    );
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
      setCustomItems((inq.priceDetails as any).items || []);
    } else {
      setComponentsCost(0);
      setLaborFee(0);
      setComplianceFee(0);
      setDiscountPercent(0);
      setComments('');
      setCustomItems([]);
    }
    // Set custom tracking inputs
    setEngineerName((inq as any).engineerName || '');
    setInspectionDate((inq as any).inspectionDate || '');
    setAttachedPdfUrl((inq as any).attachedPdfUrl || '');
    setCustomStatusNotes((inq as any).customStatusNotes || '');
  };

  // Live Auto-calculated total amount
  const calculatedTotal = React.useMemo(() => {
    let sum = 0;
    if (customItems && customItems.length > 0) {
      sum = customItems.reduce((acc, item) => acc + item.total, 0) + complianceFee;
    } else {
      sum = componentsCost + laborFee + complianceFee;
    }
    const discount = sum * (discountPercent / 100);
    return Math.max(0, sum - discount);
  }, [componentsCost, laborFee, complianceFee, discountPercent, customItems]);

  const handleAddCustomItem = () => {
    if (!newItemNameEn && !newItemNameAr) {
      alert(language === 'en' ? 'Please fill in at least one description name.' : 'يرجى كتابة وصف البند بالعربية أو الإنجليزية أولاً.');
      return;
    }
    const total = newItemQty * newItemPrice;
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      nameAr: newItemNameAr || newItemNameEn,
      nameEn: newItemNameEn || newItemNameAr,
      qty: newItemQty,
      unitPrice: newItemPrice,
      total
    };
    setCustomItems(prev => [...prev, newItem]);
    setNewItemNameAr('');
    setNewItemNameEn('');
    setNewItemQty(1);
    setNewItemPrice(0);
  };

  const handleRemoveCustomItem = (id: string) => {
    setCustomItems(prev => prev.filter(item => item.id !== id));
  };

  // Update Status
  const handleUpdateStatus = async (status: 'new' | 'under_review' | 'priced' | 'completed') => {
    if (!selectedInquiry) return;

    const pricePayload = {
      componentsCost,
      laborFee,
      complianceFee,
      discountPercent,
      totalAmount: status === 'priced' || status === 'completed' ? calculatedTotal : 0,
      comments,
      items: customItems
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
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (inq.name || '').toLowerCase().includes(term) || 
      (inq.ticketId || '').toLowerCase().includes(term) || 
      (inq.company || '').toLowerCase().includes(term) ||
      (inq.location || '').toLowerCase().includes(term);
                          
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

                      {/* Detailed custom items builder */}
                      <div className="sm:col-span-2 border border-slate-200 bg-slate-50/50 rounded-2xl p-4.5 space-y-4 text-right">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
                          <div>
                            <span className="text-xs font-black text-slate-850 block uppercase tracking-tight">
                              {language === 'en' ? 'Quotation Custom Line Items' : 'أصناف ومواد عرض السعر التفصيلية المخصصة (اختياري)'}
                            </span>
                            <span className="text-[10px] text-slate-450 block font-semibold leading-tight mt-0.5">
                              {language === 'en' ? 'Define precise items/services overrides for the visual proposal.' : 'أدخل أصناف مواد فنية بالتفصيل لتظهر في جدول الفاتورة وعرض السعر للعميل بدقة بدلاً من المدخلات الثلاثة الكلية أعلاه.'}
                            </span>
                          </div>
                          {customItems.length > 0 && (
                            <span className="bg-[#0f2d59] text-white text-[9.5px] font-black px-2.5 py-1 rounded-md uppercase">
                              {customItems.length} {language === 'en' ? 'Items' : 'بند مالي مضاف'}
                            </span>
                          )}
                        </div>

                        {/* List of custom items */}
                        {customItems.length === 0 ? (
                          <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-white">
                            <p className="text-[11px] text-slate-400 font-semibold font-sans">
                              {language === 'en' ? 'No custom line items added. The system will fall back to using global costs.' : 'لا توجد أصناف تفصيلية مضافة حالياً لعلامة المطبوعات المعاينة. سيستخدم النظام المدخلات الإجمالية أعلاه.'}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden text-[11px] font-sans">
                            <table className="w-full text-right border-collapse">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black text-[9.5px] uppercase">
                                  <th className="p-2 text-right">{language === 'en' ? 'Item Details' : 'البند / المادة الموردة'}</th>
                                  <th className="p-2 text-center">{language === 'en' ? 'Price' : 'سعر الوحدة'}</th>
                                  <th className="p-2 text-center">{language === 'en' ? 'Qty' : 'الكمية'}</th>
                                  <th className="p-2 text-left">{language === 'en' ? 'Total' : 'الإجمالي'}</th>
                                  <th className="p-2 text-center"></th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-700">
                                {customItems.map((item) => (
                                  <tr key={item.id} className="hover:bg-slate-50/50">
                                    <td className="p-2 font-bold text-right">
                                      <div className="text-slate-900 leading-snug">{item.nameAr}</div>
                                      <div className="text-[9.5px] text-slate-400 font-mono mt-0.5 text-right">{item.nameEn}</div>
                                    </td>
                                    <td className="p-2 text-center font-mono font-bold text-slate-800">{item.unitPrice.toLocaleString()} {language === 'en' ? 'SAR' : 'ريال'}</td>
                                    <td className="p-2 text-center font-mono font-extrabold">{item.qty}</td>
                                    <td className="p-2 text-left font-mono font-black text-rose-650">{(item.qty * item.unitPrice).toLocaleString()} {language === 'en' ? 'SAR' : 'ريال'}</td>
                                    <td className="p-2 text-center">
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveCustomItem(item.id)}
                                        className="text-[10px] font-black text-red-650 hover:text-red-850 hover:bg-red-50 px-2 py-1 rounded-lg transition-all"
                                      >
                                        {language === 'en' ? 'Delete' : 'حذف'}
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* New Item Form Controls Row */}
                        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3">
                          <span className="text-[10.5px] font-black text-slate-700 block uppercase tracking-wider text-right">
                            {language === 'en' ? 'Add New Quotation Line Item' : 'إدراج بند مالي/أصناف جديد لعرض السعر:'}
                          </span>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                            {/* Title Arab */}
                            <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block text-right">
                                {language === 'en' ? 'Item Title (Arabic) *' : 'وصف الصنف بالعربية *'}
                              </label>
                              <input
                                type="text"
                                value={newItemNameAr}
                                onChange={(e) => setNewItemNameAr(e.target.value)}
                                placeholder="مثال: توريد وتركيب مجاري الهواء (الدكت) والمخارج"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold font-sans text-slate-850 focus:outline-none focus:border-red-500 text-right"
                              />
                            </div>

                            {/* Title Eng */}
                            <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block text-right">
                                {language === 'en' ? 'Item Title (English)' : 'الوصف الفني بالإنجليزية (اختياري)'}
                              </label>
                              <input
                                type="text"
                                value={newItemNameEn}
                                onChange={(e) => setNewItemNameEn(e.target.value)}
                                placeholder="e.g. Supply and Installation of Ducts and Diffusers"
                                className="w-full bg-slate-50 border border-slate-100/80 rounded-lg px-3 py-2 text-xs font-bold text-left font-mono text-slate-850 focus:outline-none focus:border-red-500"
                              />
                            </div>

                            {/* Price unit */}
                            <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block text-right">
                                {language === 'en' ? 'Unit Price (SAR)' : 'سعر الوحدة (ريال)'}
                              </label>
                              <input
                                type="number"
                                value={newItemPrice || ''}
                                onChange={(e) => setNewItemPrice(Number(e.target.value))}
                                placeholder="e.g. 5000"
                                className="w-full bg-slate-50 border border-slate-150 rounded-lg px-3 py-2 text-xs font-bold font-mono text-slate-850 focus:outline-none focus:border-red-500 text-left"
                              />
                            </div>

                            {/* Qty */}
                            <div className="space-y-1">
                              <label className="text-[9px] font-black text-[#0f2d59] uppercase tracking-wider block text-right">
                                {language === 'en' ? 'Quantity' : 'الكمية المطلوب توريدها'}
                              </label>
                              <input
                                type="number"
                                value={newItemQty || ''}
                                min="1"
                                onChange={(e) => setNewItemQty(Math.max(1, Number(e.target.value)))}
                                placeholder="e.g. 2"
                                className="w-full bg-slate-50 border border-slate-150 rounded-lg px-3 py-2 text-xs font-semibold font-mono text-slate-850 focus:outline-none focus:border-red-500 text-left"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleAddCustomItem}
                            className="w-full bg-[#0f2d59] hover:bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider py-2 rounded-lg transition-all"
                          >
                            + {language === 'en' ? 'Add Item To Quotation' : 'إدراج هذا البند في جدول عرض السعر المعتمد'}
                          </button>
                        </div>
                      </div>

                      {/* Comments leading lead */}
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-black text-slate-600 block text-right">
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

                    {/* Direct Client Tracking Link copied or shared */}
                    <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-right">
                      <div className="space-y-1 block flex-1 text-right">
                        <span className="text-[10px] font-black text-[#0f2d59] uppercase tracking-wider block">
                          {language === 'en' ? 'Client Dedicated Tracking URL' : 'رابط تتبع عرض السعر المباشر والآمن للزبون'}
                        </span>
                        <span className="text-[10px] text-slate-450 font-semibold block leading-snug">
                          {language === 'en' ? 'Copy and send this unique URL for direct quotation review:' : 'قم بنسخ هذا الرابط ومشاركته مع العميل ليدخل مباشرة على عارض الـ PDF الخاص بمشروعه:'}
                        </span>
                        <span className="text-[10px] font-mono text-indigo-700 block truncate select-all max-w-sm mt-1 bg-white border border-indigo-100 p-2.5 rounded-lg select-all">
                          {window.location.origin}/track?id={selectedInquiry.ticketId}&contact={selectedInquiry.phone || selectedInquiry.email}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const trackingUrl = `${window.location.origin}/track?id=${selectedInquiry.ticketId}&contact=${selectedInquiry.phone || selectedInquiry.email}`;
                          const success = copyToClipboard(trackingUrl);
                          if (success) {
                            triggerToast(language === 'en' ? 'Dedicated tracking URL copied to clipboard!' : 'تم نسخ رابط تتبع ومطابقة العرض بنجاح وبدء النسخ المباشر حافظة!');
                          } else {
                            triggerToast(language === 'en' ? 'Unable to copy automatically, please copy the URL from text above.' : 'فشل النسخ التلقائي، يرجى تظليل الرابط أعلاه ونسخه.');
                          }
                        }}
                        className="bg-[#0f2d59] hover:bg-slate-900 text-white font-black text-[10px] px-4 py-2.5 rounded-xl transition-all shadow-sm shrink-0 uppercase tracking-wider cursor-pointer"
                      >
                        {language === 'en' ? 'Copy Link' : 'نسخ رابط العميل'}
                      </button>
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
                      <option value="equipment">{language === 'en' ? 'Equipment / Gallery' : 'معرض المعدات والعمليات الحية (الصناعية)'}</option>
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

                {/* Live Site Visibility Toggle */}
                <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-200 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-extrabold text-slate-900 block text-xs">
                      {language === 'en' ? 'Publish Status' : 'حالة العرض والنشاط مباشرة'}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium mt-0.5">
                      {language === 'en' 
                        ? 'Control whether this resource is visible in the public galleries.' 
                        : 'تحكم في ما إذا كان هذا الـمشروع/الـمعدة يظهر للعملاء في الواجهة العامة.'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMediaVisible(!mediaVisible)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      mediaVisible ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        mediaVisible ? (language === 'en' ? 'translate-x-5' : '-translate-x-5') : 'translate-x-0'
                      }`}
                    />
                  </button>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase">
                    {language === 'en' ? 'Live Dynamic Media list' : 'المستودع ومكتبة الصور النشطة'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 shadow-none">
                    {language === 'en' 
                      ? 'Media objects are served instantly across slider widget, projects catalogue, and specialized tabs.'
                      : 'الصور والملفات المدرجة هنا تظهر تلقائياً في السلايدر، صفحات المشاريع المنجزة وضمن خانات الخدمات التكتيكية.'}
                  </p>
                </div>
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 border border-indigo-100 rounded-full text-[10px] font-black font-mono self-start sm:self-auto">
                  {mediaItems.length} {language === 'en' ? 'Total' : 'عناصر معتمدة'}
                </span>
              </div>

              {/* Segmented filtering buttons */}
              <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-3">
                <button
                  type="button"
                  onClick={() => setMediaListFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all ${
                    mediaListFilter === 'all'
                      ? 'bg-red-650 text-white'
                      : 'bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200'
                  }`}
                >
                  {language === 'en' ? 'All' : 'عرض الكل'}
                </button>
                <button
                  type="button"
                  onClick={() => setMediaListFilter('project')}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all ${
                    mediaListFilter === 'project'
                      ? 'bg-red-650 text-white'
                      : 'bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200'
                  }`}
                >
                  {language === 'en' ? 'Projects' : 'المشروعات (السيناريوهات)'}
                </button>
                <button
                  type="button"
                  onClick={() => setMediaListFilter('service')}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all ${
                    mediaListFilter === 'service'
                      ? 'bg-red-650 text-white'
                      : 'bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200'
                  }`}
                >
                  {language === 'en' ? 'Services' : 'الخدمات'}
                </button>
                <button
                  type="button"
                  onClick={() => setMediaListFilter('equipment')}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all ${
                    mediaListFilter === 'equipment'
                      ? 'bg-red-650 text-white'
                      : 'bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200'
                  }`}
                >
                  {language === 'en' ? 'Equipment' : 'معرض المعدات'}
                </button>
              </div>

              {/* Dynamic list rendering */}
              {mediaLoading ? (
                <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                  <Loader2 className="w-8 h-8 animate-spin text-red-650 mx-auto" />
                  <p className="text-xs text-slate-400 font-extrabold mt-3">{language === 'en' ? 'Querying static routes catalogs...' : 'جاري تجميع روابط المجلدات والملفات...'}</p>
                </div>
              ) : mediaItems.filter(item => mediaListFilter === 'all' || item.type === mediaListFilter).length === 0 ? (
                <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 italic font-semibold text-xs">
                  {language === 'en' ? 'No assets matching selected filter yet.' : 'لا توجد عناصر هندسية تتبع هذا الفرز حالياً.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mediaItems
                    .filter(item => mediaListFilter === 'all' || item.type === mediaListFilter)
                    .map((item) => (
                      <div 
                        key={item.id} 
                        className={`bg-white rounded-2xl border overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow ${
                          item.visible === false ? 'border-amber-200/60 bg-amber-50/5' : 'border-slate-200'
                        }`}
                      >
                        <div className="relative h-40 bg-slate-100 overflow-hidden shrink-0">
                          {item.imageUrls && item.imageUrls.length > 0 ? (
                            <img src={item.imageUrls[0]} alt={item.titleEn} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <ImageIcon className="w-10 h-10" />
                            </div>
                          )}
                          
                          {/* Visibility and Type labels */}
                          <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center gap-2">
                            <span className="bg-slate-900/80 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border border-white/10">
                              {item.type === 'equipment' 
                                ? (language === 'en' ? 'Equipment' : 'معرض المعدات')
                                : item.type === 'project' 
                                  ? (language === 'en' ? 'Project' : 'مشاريع وتركيبات') 
                                  : (language === 'en' ? 'Service Tab' : 'خدمات وتأسيس')
                              }
                            </span>
                            
                            {item.visible === false ? (
                              <span className="bg-amber-500/90 text-white text-[7.5px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
                                <EyeOff className="w-2.5 h-2.5" />
                                <span>{language === 'en' ? 'Hidden' : 'مخفي بالموقع'}</span>
                              </span>
                            ) : (
                              <span className="bg-emerald-600/95 text-white text-[7.5px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
                                <Eye className="w-2.5 h-2.5" />
                                <span>{language === 'en' ? 'Live' : 'نشط ومعروض'}</span>
                              </span>
                            )}
                          </div>
                          
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
                            {/* Shortened URL preview */}
                            <span className="font-mono text-[8px] text-slate-400 select-all truncate max-w-[90px]" title={item.imageUrls && item.imageUrls[0]}>
                              {item.imageUrls && item.imageUrls[0]?.split('/').pop()}
                            </span>

                            <div className="flex gap-1.5 items-center">
                              {/* Quick Preview Button */}
                              <button 
                                onClick={() => setSelectedPreviewMedia(item)}
                                className="px-2.5 py-1.5 border border-[#0f2d59] text-white bg-[#0f2d59] hover:bg-slate-800 rounded-lg text-[9.5px] font-black flex items-center gap-1 transition-all shadow-sm active:scale-95"
                                title={language === 'en' ? 'Quick Image Preview & Gallery' : 'معاينة تفاعلية سريعة للصور والمعرض'}
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>{language === 'en' ? 'Quick Preview' : 'معاينة سريعة'}</span>
                              </button>
                              
                              {/* Quick visibility toggle */}
                              <button 
                                onClick={() => handleToggleVisibility(item)}
                                className={`p-1.5 border rounded-lg transition-colors ${
                                  item.visible === false 
                                    ? 'border-amber-300 text-amber-500 hover:bg-amber-50' 
                                    : 'border-slate-200 text-emerald-600 hover:bg-slate-50'
                                }`}
                                title={item.visible === false 
                                  ? (language === 'en' ? 'Make active on site' : 'بث وتفعيل بالموقع')
                                  : (language === 'en' ? 'Hide from public catalog' : 'إخفاء وحجب بالموقع')
                                }
                              >
                                {item.visible === false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>

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

      {/* Dynamic Detail Viewer Modal */}
      <AnimatePresence>
        {selectedPreviewMedia && (
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col font-sans"
            >
              <div className="bg-[#0f2d59] p-5 text-white flex justify-between items-center">
                <div>
                  <h4 className="font-extrabold text-xs uppercase tracking-wider">
                    {language === 'en' ? 'Detailed Resource Inspection' : 'معاينة تفاصيل وبيانات الملف الهندسي'}
                  </h4>
                  <span className="text-[10px] text-slate-300 block mt-0.5">
                    {language === 'en' ? 'Live status: ' : 'حالة النشاط بالموقع: '} 
                    <span className="font-black text-white">
                      {selectedPreviewMedia.visible !== false ? (language === 'en' ? 'VISIBLE' : 'نشط ومعروض للزوار') : (language === 'en' ? 'HIDDEN' : 'مخفي حالياً')}
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPreviewMedia(null)}
                  className="bg-white/10 hover:bg-white/25 p-2 rounded-xl text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                {selectedPreviewMedia.imageUrls && selectedPreviewMedia.imageUrls.length > 0 && (
                  <div className="space-y-3">
                    <div className="relative h-64 md:h-80 overflow-hidden rounded-2xl border border-slate-100 bg-slate-950 flex items-center justify-center group/carousel shadow-inner">
                      <img 
                        src={selectedPreviewMedia.imageUrls[previewImageIndex] || selectedPreviewMedia.imageUrls[0]} 
                        alt={`Showcase image ${previewImageIndex + 1}`} 
                        className="max-w-full max-h-full object-contain transition-all duration-300" 
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Cycling controls */}
                      {selectedPreviewMedia.imageUrls.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewImageIndex((prev) => 
                                prev === 0 ? selectedPreviewMedia.imageUrls.length - 1 : prev - 1
                              );
                            }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 z-10 shadow-lg"
                            title={language === 'en' ? 'Previous Image' : 'الصورة السابقة'}
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewImageIndex((prev) => 
                                prev === selectedPreviewMedia.imageUrls.length - 1 ? 0 : prev + 1
                              );
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 z-10 shadow-lg"
                            title={language === 'en' ? 'Next Image' : 'الصورة التالية'}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                          
                          {/* Indicators badge */}
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-905/85 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-lg select-none">
                            <span>{previewImageIndex + 1}</span>
                            <span className="text-slate-400">/</span>
                            <span>{selectedPreviewMedia.imageUrls.length}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Thumbnails list if multiple images exist */}
                    {selectedPreviewMedia.imageUrls.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        {selectedPreviewMedia.imageUrls.map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setPreviewImageIndex(idx)}
                            className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                              previewImageIndex === idx 
                                ? 'border-red-650 scale-[1.02] ring-2 ring-red-100' 
                                : 'border-slate-200 hover:border-slate-350 hover:scale-[1.01]'
                            }`}
                          >
                            <img 
                              src={url} 
                              alt={`Thumbnail ${idx + 1}`} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            {previewImageIndex === idx && (
                              <div className="absolute inset-0 bg-red-650/10 pointer-events-none" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <h5 className="font-extrabold text-[#0f2d59] mb-1">{language === 'en' ? 'English Content' : 'المحتوى بالإنجليزية'}</h5>
                    <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl space-y-2">
                      <p className="font-bold text-slate-800"><span className="text-[#0f2d59] font-black">Title:</span> {selectedPreviewMedia.titleEn}</p>
                      <p className="text-slate-550 leading-relaxed font-semibold"><span className="text-[#0f2d59] font-black">Description:</span> {selectedPreviewMedia.descriptionEn}</p>
                      {selectedPreviewMedia.clientEn && <p className="text-slate-650"><span className="text-[#0f2d59] font-black">Client:</span> {selectedPreviewMedia.clientEn}</p>}
                      {selectedPreviewMedia.locationEn && <p className="text-slate-650"><span className="text-[#0f2d59] font-black">Location:</span> {selectedPreviewMedia.locationEn}</p>}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-extrabold text-[#0f2d59] mb-1">{language === 'en' ? 'Arabic Output' : 'المحتوى بالعربية (جاهز للنشر)'}</h5>
                    <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl space-y-2 text-right" dir="rtl">
                      <p className="font-bold text-slate-800"><span className="text-[#0f2d59] font-black">العنوان:</span> {selectedPreviewMedia.titleAr}</p>
                      <p className="text-slate-550 leading-relaxed font-semibold"><span className="text-[#0f2d59] font-black">الوصف:</span> {selectedPreviewMedia.descriptionAr}</p>
                      {selectedPreviewMedia.clientAr && <p className="text-slate-650"><span className="text-[#0f2d59] font-black">العميل:</span> {selectedPreviewMedia.clientAr}</p>}
                      {selectedPreviewMedia.locationAr && <p className="text-slate-650"><span className="text-[#0f2d59] font-black">الموقع:</span> {selectedPreviewMedia.locationAr}</p>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                    <span className="text-[9px] text-slate-400 block font-bold">{language === 'en' ? 'Placement' : 'خط التوزيع والفرز'}</span>
                    <span className="text-xs font-black text-slate-800 capitalize">{selectedPreviewMedia.type}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                    <span className="text-[9px] text-slate-400 block font-bold">{language === 'en' ? 'Category' : 'القسم الهندسي'}</span>
                    <span className="text-xs font-black text-slate-800 uppercase">{selectedPreviewMedia.category}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                    <span className="text-[9px] text-slate-400 block font-bold">{language === 'en' ? 'Execution Year' : 'سنة التنفيذ والتدشين'}</span>
                    <span className="text-xs font-black text-slate-800">{selectedPreviewMedia.year || '2026'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    handleEditInit(selectedPreviewMedia);
                    setSelectedPreviewMedia(null);
                  }}
                  className="bg-[#0f2d59] hover:bg-[#1e4883] text-white font-extrabold text-[11px] px-5 py-2.5 rounded-xl transition-all uppercase tracking-wider"
                >
                  {language === 'en' ? 'Configure & Edit' : 'تعديل البيانات'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPreviewMedia(null)}
                  className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-605 font-extrabold text-[11px] px-5 py-2.5 rounded-xl transition-all uppercase tracking-wider"
                >
                  {language === 'en' ? 'Close' : 'إغلاق المعاينة'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-10 left-6 right-6 md:left-auto md:right-10 z-[99999] max-w-sm bg-slate-900 border border-slate-805 text-white rounded-2xl py-3.5 px-4 shadow-2xl flex items-center gap-3 font-sans"
          >
            <div className="bg-red-500/10 rounded-lg p-2 shrink-0">
              <CheckCircle className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1 text-xs font-semibold leading-normal text-right">
              {toastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Admin;
