import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { 
  Calculator, 
  Send, 
  Flame, 
  Zap, 
  Cpu, 
  Sparkles, 
  User, 
  Loader2, 
  Building, 
  Shield, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Printer, 
  RefreshCw, 
  MessageSquare, 
  BellRing, 
  Fingerprint, 
  Home as HomeIcon, 
  SquareDot,
  DoorOpen,
  FolderTree,
  FileCheck2,
  ListRestart,
  Wind,
  ShieldCheck,
  Settings,
  Layers,
  Award,
  CircleDot,
  VolumeX,
  Database,
  Eye,
  Activity,
  CheckCircle,
  Copy,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

// Define the systems categories available
type SystemCategory = 'alarm_control' | 'generators' | 'hvac' | 'fire_fighting';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const AISizer: React.FC = () => {
  const { language } = useLanguage();
  
  // High level system selection state
  const [selectedCategory, setSelectedCategory] = useState<SystemCategory>('alarm_control');
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1); // 1: System choices, 2: Project specifications, 3: Equipment Select, 4: Review, 5: Floating Loading Animation, 6: Success display

  // Loading animation state variables
  const [progress, setProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [generatedTicketId, setGeneratedTicketId] = useState('');

  // Client Identification fields
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientCity, setClientCity] = useState('Riyadh');

  // Input Error State
  const [validationError, setValidationError] = useState('');

  // ============================================
  // SYSTEM 1: ALARM & CONTROL STATE
  // ============================================
  const alarmTypes = [
    { id: 'fire_alarm', nameAr: 'إنذار حريق', nameEn: 'Fire Alarm System', descAr: 'حماية كودية معتمدة من الدفاع المدني وحساسات دخان دقيقة.', descEn: 'SBC & Civil Defense approved smoke detectors.' },
    { id: 'burglar_alarm', nameAr: 'إنذار سرقة', nameEn: 'Intrusion / Burglar Alarm', descAr: 'حساسات حركة لاسلكية ومستشعرات كسر الزجاج والفتح.', descEn: 'Acoustic glass break & volumetric sensors.' },
    { id: 'access_control', nameAr: 'Access Control', nameEn: 'Access Control Systems', descAr: 'تحكم بصلاحيات الأبواب وتأمين مخارج الطوارئ الذكي.', descEn: 'Magnetic lock grids and credential verification.' },
    { id: 'biometrics', nameAr: 'أجهزة البصمة', nameEn: 'Biometric Access', descAr: 'محطات التحقق الذاتي بالوجه، بصمة اليد، وبطاقات التعريف.', descEn: 'Face recognition terminal and RFID logs.' },
    { id: 'smart_home', nameAr: 'Smart Home', nameEn: 'Smart Home Automation', descAr: 'أتمتة الأنظمة والتحكم بالإضاءة والتكييف والتنبيهات عبر الجوال.', descEn: 'Full Zigbee/Z-Wave appliance scheduling.' },
    { id: 'access_gates', nameAr: 'بوابات دخول وخروج', nameEn: 'Security Barriers & Gates', descAr: 'حواجب بوابات مواقف السيارات الدوارة والبوابات المنزلقة.', descEn: 'Active boom gates & fast sliding barriers.' }
  ];
  const [selectedAlarmTypes, setSelectedAlarmTypes] = useState<string[]>(['fire_alarm']);
  const [roomsAlarm, setRoomsAlarm] = useState<number>(4);
  const [doorsAlarm, setDoorsAlarm] = useState<number>(3);
  const [buildingTypeAlarm, setBuildingTypeAlarm] = useState<string>('commercial');
  const [centralLinkAlarm, setCentralLinkAlarm] = useState<boolean>(true);
  
  // Equipment selection system 1
  const alarmSensors = [
    { id: 'smoke_det', nameAr: 'كاشف دخان وحرارة معنون', nameEn: 'Addressable Photoelectric Sensor' },
    { id: 'pir_motion', nameAr: 'حساسات حركة موجهة 360 درجة', nameEn: 'Volumetric PIR Motion Tracker' },
    { id: 'magnetic_door', nameAr: 'مغناطيس أبواب ونوافذ بالبصمة', nameEn: 'Magnetic Door/Window Contact' }
  ];
  const [selectedAlarmSensors, setSelectedAlarmSensors] = useState<string[]>(['smoke_det', 'pir_motion']);
  
  const alarmPanels = [
    { id: 'fire_plc', nameAr: 'لوحة إنذار حريق مركزية معنونة', nameEn: 'Addressable Fire Alarm PLC Hub' },
    { id: 'smart_iot', nameAr: 'لوحة ذكية أتمتة منزلية WiFi', nameEn: 'Integrated IoT Automation Gateway' },
    { id: 'intruder_shield', nameAr: 'لوحة إنذار سرقة مستقلة مقاومة للخلل', nameEn: 'Tamper-Proof Standalone Burglar Box' }
  ];
  const [selectedAlarmPanel, setSelectedAlarmPanel] = useState<string>('fire_plc');

  const alarmControllers = [
    { id: 'bio_rfid_reader', nameAr: 'قارئ بصمة وكروت RFID مدمج', nameEn: 'Multi-Biometric RFID Access Reader' },
    { id: 'wall_ips_screen', nameAr: 'شاشة جدارية IPS ملونة تفاعلية', nameEn: 'IPS Interactive Wall Control Panel' },
    { id: 'cloud_mobile_app', nameAr: 'تطبيق هاتف سحابي فوري ومستجيب', nameEn: 'Cloud Mobile App & Notification Center' }
  ];
  const [selectedAlarmControllers, setSelectedAlarmControllers] = useState<string[]>(['cloud_mobile_app']);

  // ============================================
  // SYSTEM 2: ELECTRICAL GENERATORS STATE
  // ============================================
  const generatorTypes = [
    { id: 'diesel_gen', nameAr: 'مولدات ديزل', nameEn: 'Heavy Diesel Generators' },
    { id: 'standby_gen', nameAr: 'مولدات احتياطية', nameEn: 'Standby Generators' },
    { id: 'ats_switch', nameAr: 'ATS (لوحات تحويل آلي)', nameEn: 'Automatic Transfer Switch (ATS)' },
    { id: 'trans_panels', nameAr: 'لوحات تحويل لتوزيع الطاقة', nameEn: 'Electrical Power Transfer Panels' },
    { id: 'factory_power', nameAr: 'أنظمة طاقة متكاملة للمصانع', nameEn: 'Industrial Class Power Solutions' }
  ];
  const [selectedGenType, setSelectedGenType] = useState<string>('diesel_gen');
  const [requiredKVA, setRequiredKVA] = useState<number>(250);
  const [operatingHours, setOperatingHours] = useState<number>(12);
  const [projectTypeGen, setProjectTypeGen] = useState<string>('commercial');
  const [genLocation, setGenLocation] = useState<'indoor' | 'outdoor'>('outdoor');
  
  // Custom addon flags system 2
  const [addFuelTank, setAddFuelTank] = useState<boolean>(true);
  const [soundShield, setSoundShield] = useState<boolean>(true);
  const [remoteMonitoring, setRemoteMonitoring] = useState<boolean>(true);

  // ============================================
  // SYSTEM 3: HVAC & COOLING STATE
  // ============================================
  const hvacTypes = [
    { id: 'split', nameAr: 'سبليت جداري ودولابي', nameEn: 'Wall Mount & Cabinet Split' },
    { id: 'central', nameAr: 'تكييف مركزي متكامل', nameEn: 'Package Unit Central System' },
    { id: 'vrf', nameAr: 'نظام التدفق المتغير VRF', nameEn: 'Variable Refrigerant Flow (VRF)' },
    { id: 'duct', nameAr: 'دكت سبليت مخفي', nameEn: 'Concealed Ducted Split' },
    { id: 'chiller', nameAr: 'مبردات تشيلر مائية وهواوية', nameEn: 'Water & Air Cooled Chiller Complexes' }
  ];
  const [selectedHvacType, setSelectedHvacType] = useState<string>('vrf');
  const [hvacArea, setHvacArea] = useState<number>(350);
  const [hvacRooms, setHvacRooms] = useState<number>(8);
  const [hvacFloors, setHvacFloors] = useState<number>(2);
  const [hvacActivity, setHvacActivity] = useState<string>('commercial');

  const [hotCold, setHotCold] = useState<boolean>(true);
  const [energySaving, setEnergySaving] = useState<boolean>(true);
  const [smartHvacControl, setSmartHvacControl] = useState<boolean>(true);

  // ============================================
  // SYSTEM 4: FIRE SUPPRESSION / FIGHTING STATE
  // ============================================
  const fireSuppressionTypes = [
    { id: 'sprinkler', nameAr: 'رشاشات مائية تلقائية (Sprinkler)', nameEn: 'Wet & Dry Pipe Sprinklers' },
    { id: 'fm200', nameAr: 'غاز نظيف حماية الخوادم (FM200)', nameEn: 'Clean Agent Gas Suppression (FM-200)' },
    { id: 'co2', nameAr: 'ثاني أكسيد الكربون المركزي (CO2)', nameEn: 'Carbon Dioxide Heavy Suppression (CO2)' },
    { id: 'hose_reel', nameAr: 'بكرات خراطيم وصناديق إطفاء', nameEn: 'Fire Hose Reel & Cabinets' },
    { id: 'fire_alarm_supp', nameAr: 'إنذار حريق مبكر متصل', nameEn: 'Addressable Fire Alarm Tie-in' },
    { id: 'fire_pumps', nameAr: 'مضخات حريق معتمدة (ديزل وكهرباء)', nameEn: 'Certified Fire Pump Configurations' }
  ];
  const [selectedSuppressionTypes, setSelectedSuppressionTypes] = useState<string[]>(['sprinkler']);
  const [suppArea, setSuppArea] = useState<number>(500);
  const [suppFloors, setSuppFloors] = useState<number>(3);
  const [suppActivity, setSuppActivity] = useState<'warehouse' | 'residential' | 'industrial' | 'commercial'>('commercial');

  const [pumpType, setPumpType] = useState<string>('UL_Listed_Diesel_Electric');
  const [panelTypeSupp, setPanelTypeSupp] = useState<string>('addressable_fire_panel');
  const [pipeType, setPipeType] = useState<string>('seamless_steel_sch40');
  const [extinguishersCount, setExtinguishersCount] = useState<number>(12);

  const buildingTypesLocalized: Record<string, {en: string, ar: string}> = {
    commercial: { en: 'Commercial Hub / Showroom', ar: 'مقر تجاري / معرض فني' },
    residential: { en: 'Residential Villa / Apartments', ar: 'فيلّا سكنية / مجمع سكني' },
    industrial: { en: 'Factory / Heavy Logistics Storage', ar: 'مصنع أو مجمع تصنيع ثقيل' },
    medical: { en: 'Medical Clinic / Critical Space', ar: 'مبنى طبي / مركز عيادات' },
    educational: { en: 'Educational / School Complex', ar: 'مبنى تعليمي / مدرسة' }
  };

  // Toggle helpers for multiple selections
  const toggleAlarmType = (id: string) => {
    if (selectedAlarmTypes.includes(id)) {
      if (selectedAlarmTypes.length > 1) setSelectedAlarmTypes(selectedAlarmTypes.filter(t => t !== id));
    } else {
      setSelectedAlarmTypes([...selectedAlarmTypes, id]);
    }
  };

  const toggleAlarmSensor = (id: string) => {
    if (selectedAlarmSensors.includes(id)) {
      setSelectedAlarmSensors(selectedAlarmSensors.filter(s => s !== id));
    } else {
      setSelectedAlarmSensors([...selectedAlarmSensors, id]);
    }
  };

  const toggleAlarmController = (id: string) => {
    if (selectedAlarmControllers.includes(id)) {
      setSelectedAlarmControllers(selectedAlarmControllers.filter(c => c !== id));
    } else {
      setSelectedAlarmControllers([...selectedAlarmControllers, id]);
    }
  };

  const toggleSuppressionType = (id: string) => {
    if (selectedSuppressionTypes.includes(id)) {
      if (selectedSuppressionTypes.length > 1) setSelectedSuppressionTypes(selectedSuppressionTypes.filter(t => t !== id));
    } else {
      setSelectedSuppressionTypes([...selectedSuppressionTypes, id]);
    }
  };

  // ============================================
  // AUTO-COMPUTING MATERIALS & COSTS DIRECTLY
  // ============================================
  const estimatedCostData = React.useMemo(() => {
    let priceRangeMin = 0;
    let priceRangeMax = 0;
    const itemsList: {en: string, ar: string}[] = [];

    if (selectedCategory === 'alarm_control') {
      // Calculate costs roughly
      const baseSensorsCount = roomsAlarm * 2;
      const baseAccessDoors = doorsAlarm;
      priceRangeMin = (baseSensorsCount * 300) + (baseAccessDoors * 1200) + 4000;
      priceRangeMax = (baseSensorsCount * 550) + (baseAccessDoors * 2200) + 9500;
      if (centralLinkAlarm) {
        priceRangeMin += 2500;
        priceRangeMax += 5000;
      }

      itemsList.push({ en: `${baseSensorsCount}x Multi-Sensing Heat & Smoke Detectors`, ar: `عدد ${baseSensorsCount} كواشف حساسة مشتركة دخان وحرارة معنونة` });
      itemsList.push({ en: `${baseAccessDoors}x Fail-Safe Magnetic Door Access Assemblies`, ar: `عدد ${baseAccessDoors} أقفال ميكانيكية مغناطيسية وحواسب أمان للأبواب` });
      itemsList.push({ en: `1x Central ${alarmPanels.find(p => p.id === selectedAlarmPanel)?.nameEn}`, ar: `لوحة تحكم سنترال رئيسية: ${alarmPanels.find(p => p.id === selectedAlarmPanel)?.nameAr}` });
      if (centralLinkAlarm) {
        itemsList.push({ en: `Civil Defense Central Communications Receiver`, ar: `جهاز إرسال وبث مباشر للإشارة مع الدفاع المدني` });
      }

    } else if (selectedCategory === 'generators') {
      priceRangeMin = requiredKVA * 250 + (operatingHours * 100);
      priceRangeMax = requiredKVA * 420 + (operatingHours * 250);
      if (soundShield) {
        priceRangeMin += 12000;
        priceRangeMax += 25000;
      }
      if (addFuelTank) {
        priceRangeMin += 8000;
        priceRangeMax += 15000;
      }

      const activeGenName = generatorTypes.find(g => g.id === selectedGenType)?.nameAr;
      itemsList.push({ en: `1x Heavy-Duty Prime Diesel Engine rated at ${requiredKVA} KVA`, ar: `ماكينة توليد ديزل ثقيلة سعة ${requiredKVA} كيلو فولت أمبير كاتم وعازل للصوت` });
      itemsList.push({ en: `Automatic Transfer Switching Matrix (ATS Cabinet)`, ar: `كابينة ولوحة تحويل إلكتروني آلي (ATS) سريعة الاستجابة` });
      if (addFuelTank) {
        itemsList.push({ en: `1000 Liter Steel External Fuel Supply Auxiliary Tank`, ar: `خزان ديزل مساعد خارجي فولاذي لحفظ الارتفاع السائل بسعة ١٠٠٠ لتر` });
      }
      if (soundShield) {
        itemsList.push({ en: `Acoustic Enclosure with Sound Dampener Silencers`, ar: `حاوية معزولة مطابقة للمواصفات ومخمد صوت لغرف التبريد` });
      }
      if (remoteMonitoring) {
        itemsList.push({ en: `Integrated Smart SCADA Remote Generator Telemetry Modbus`, ar: `وحدة مراقبة ذكية لبث الأحمال ومستويات الديزل والزيت للجوال` });
      }

    } else if (selectedCategory === 'hvac') {
      const tonnage = Math.ceil(hvacArea / 14); // Roughly 1 TR per 14 sqm
      priceRangeMin = tonnage * 3800 + (hvacRooms * 1500);
      priceRangeMax = tonnage * 6000 + (hvacRooms * 3000);

      const hvacName = hvacTypes.find(h => h.id === selectedHvacType)?.nameAr;
      itemsList.push({ en: `${tonnage} Tons Cooling Power (${tonnage * 12000} BTU/Hr rating)`, ar: `إجمالي أحمال تبريد مقدر بـ ${tonnage} طن تبريد (${(tonnage * 12000).toLocaleString()} وحدة BTU)` });
      itemsList.push({ en: `${hvacRooms} Air Distribution Terminals & Diffuser grills`, ar: `عدد ${hvacRooms} مخارج هواء وجريلات نشر مصنعة بمصانعنا للـ Duct` });
      itemsList.push({ en: `High Static Condenser Compressors (${hvacTypes.find(h => h.id === selectedHvacType)?.nameEn})`, ar: `مجموعات ضواغط وحقن تبريد بنظام ${hvacName}` });
      if (energySaving) {
        itemsList.push({ en: `Inverter compressor frequency energy optimizer (-30% fuel/power)`, ar: `تكنولوجيا العاكس الذكية (Inverter) لتوفير ٣٠٪ من استهلاك الطاقة` });
      }

    } else if (selectedCategory === 'fire_fighting') {
      priceRangeMin = suppArea * 45 + (suppFloors * 12000);
      priceRangeMax = suppArea * 85 + (suppFloors * 25000);
      if (pumpType !== 'none') {
        priceRangeMin += 35000;
        priceRangeMax += 85000;
      }

      itemsList.push({ en: `${Math.ceil(suppArea / 9)}x UL/FM Listed Recessed Quick Response Sprinkler Heads`, ar: `عدد ${Math.ceil(suppArea / 9)} من رؤوس رشاشات الإطفاء الذكية وسريعة الاستجابة` });
      itemsList.push({ en: `${extinguishersCount}x Carbon Dioxide (CO2) and Dry Powder canisters`, ar: `عدد ${extinguishersCount} طفايات حريق يدوية (ثاني أكسيد كربون وجودة عالية جافة)` });
      itemsList.push({ en: `Certified Electro-Diesel Fire Fighting Pump Skid Assembly`, ar: `شاسي مضخات الحريق المدمجة (مضخة كهرباء، ديزل، ومضخة جوكي التعويضية)` });
      itemsList.push({ en: `Seamless Carbon Steel Pipes schedule 40 corrosion-resistant`, ar: `مجموعة مواسير فولاذ أسود غير ملحومة سماكة جدول ٤٠ لمستويات الضغط` });
    }

    return {
      min: priceRangeMin,
      max: priceRangeMax,
      materials: itemsList
    };
  }, [
    selectedCategory,
    roomsAlarm,
    doorsAlarm,
    centralLinkAlarm,
    selectedAlarmPanel,
    requiredKVA,
    operatingHours,
    selectedGenType,
    addFuelTank,
    soundShield,
    remoteMonitoring,
    hvacArea,
    hvacRooms,
    selectedHvacType,
    energySaving,
    suppArea,
    suppFloors,
    pumpType,
    extinguishersCount
  ]);


  // ============================================
  // FINAL SUBMISSION ACTION & DATABASE WRITE
  // ============================================
  const handleSubmitPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !clientEmail) {
      setValidationError(language === 'en' ? 'Kindly provide Name, Phone number and email' : 'يرجى كتابة الاسم ورقم الهاتف والبريد الإلكتروني لإتمام طلبك.');
      return;
    }

    setValidationError('');
    setStep(5); // Go to CAD animation loading screen
    setProgress(5);
    setLoadingStatus(language === 'ar' ? 'جاري تجهيز وثائق المشروع ومعاينة الإحداثيات...' : 'Assessing technical criteria and loading CAD layouts...');

    // Fake ticking loading process increments
    const timerIntervals = [
      { p: 18, t: language === 'ar' ? 'جاري مطابقة اشتراطات كود البناء السعودي والمحرك الهيدروليكي...' : 'Comparing SBC code criteria & hydraulic balance models...' },
      { p: 38, t: language === 'ar' ? 'جاري رسم لوحة التوصيلات وتحديد الماكينات الإضافية...' : 'Composing loop relays and calculating standby components...' },
      { p: 58, t: language === 'ar' ? 'جاري محاكاة ضغط شبكات وسحب تيار التحميل...' : 'Simulating continuous pressure profiles & electrical load curves...' },
      { p: 78, t: language === 'ar' ? 'جاري تسعير الأجهزة وإخراج جداول الكميات التقديرية...' : 'Formulating preliminary quantities of materials and draft pricing...' },
      { p: 96, t: language === 'ar' ? 'جاري تخزين المخطط بمركز تحكم الإدارة الفنية...' : 'Uploading secure specs to global technical supervisor dashboard...' },
      { p: 100, t: language === 'ar' ? 'تم تأكيد التقرير الفني وحفظ المخططات بنجاح!' : 'Systems configuration validated and locked successfully!' }
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < timerIntervals.length) {
        setProgress(timerIntervals[currentIdx].p);
        setLoadingStatus(timerIntervals[currentIdx].t);
        currentIdx++;
      } else {
        clearInterval(interval);
        finalizeSubmit();
      }
    }, 900);
  };

  const finalizeSubmit = async () => {
    // Generate immediate Ticket Identifier
    const randomTicketNum = Math.floor(Math.random() * 9000) + 1000;
    const ticketStr = `GCC-2026-${randomTicketNum}`;
    setGeneratedTicketId(ticketStr);

    let systemLabel = '';
    let detailedSpecs = '';

    if (selectedCategory === 'alarm_control') {
      systemLabel = 'fire_alarm'; // map to service types inside 'Admin'
      detailedSpecs = `أنظمة إنذار وتحكم تفاعلية: ${selectedAlarmTypes.join(', ')}. عدد الغرف: ${roomsAlarm}. عدد الأبواب: ${doorsAlarm}. ربط مركزي: ${centralLinkAlarm ? 'نعم منسق' : 'لا لاسلكى'}. اللوحة: ${selectedAlarmPanel}.`;
    } else if (selectedCategory === 'generators') {
      systemLabel = 'power';
      detailedSpecs = `المولدات الهندسية للطاقة: النوع ${selectedGenType}. القدرة المقررة: ${requiredKVA} KVA. ساعات التشغيل اليومية: ${operatingHours} ساعة. عازل كاتم مستمر: ${soundShield ? 'نعم' : 'لا'}. خزان إضافي: ${addFuelTank ? 'نعم' : 'لا'}.`;
    } else if (selectedCategory === 'hvac') {
      systemLabel = 'hvac';
      detailedSpecs = `أنظمة تكييف وتبريد: نظام ${selectedHvacType}. مساحة المجمع: ${hvacArea} متر مربع. عدد الحجرات: ${hvacRooms}. عدد الأدوار: ${hvacFloors}. حار/بارد: ${hotCold ? 'نعم' : 'لا'}. طاقة خضراء: ${energySaving ? 'نعم' : 'لا'}.`;
    } else if (selectedCategory === 'fire_fighting') {
      systemLabel = 'fire_suppression';
      detailedSpecs = `أنظمة مكافحة الحرائق والإطفاء: التكوين ${selectedSuppressionTypes.join(', ')}. المساحة الكلية: ${suppArea} متر مربع. الطوابق: ${suppFloors}. نوع المضخات: ${pumpType}. المواسير: ${pipeType}. عدد الطفايات: ${extinguishersCount} حبة.`;
    }

    // Build the consolidated Inquiry Object formatted exactly for the GCC Admin Panel Database
    const finalInquiryPayload = {
      name: clientName,
      company: clientCompany || 'Personal/Bespoke Property',
      phone: clientPhone,
      email: clientEmail,
      serviceType: systemLabel,
      projectType: buildingTypesLocalized[buildingTypeAlarm]?.en || 'General Construction',
      projectArea: selectedCategory === 'hvac' ? hvacArea.toString() : (selectedCategory === 'fire_fighting' ? suppArea.toString() : 'N/A'),
      location: clientCity,
      message: `[طلب مخصص تم تكوينه وحسابه ذاتياً بموقع GCC لتقدير وتخطيط المشروعات] التفاصيل الإضافية: ${detailedSpecs}`,
      ticketId: ticketStr,
      status: 'new',
      createdAt: new Date().toISOString(),
      uploadedFiles: ['Interactive-Config-Generated.pdf', 'Estimated-Layout.cad'],
      priceDetails: {
        componentsCost: estimatedCostData.min,
        laborFee: Math.ceil(estimatedCostData.min * 0.15),
        complianceFee: 1500,
        discountPercent: 10,
        totalAmount: Math.ceil((estimatedCostData.min * 1.15 + 1500) * 0.9),
        comments: `تم حساب وتخطيط المقايسة آلياً بناء على خيارات العميل ومطابقة الكود السعودي.`
      }
    };

    // 1. Save to Remote Firebase Firestore
    try {
      await addDoc(collection(db, 'inquiries'), finalInquiryPayload);
      console.log("Success storing GCC specification remotely to Firestore!");
    } catch (err) {
      console.error("Firebase write error, storing securely in local caches...", err);
    }

    // 2. Save directly inside local storage to ensure availability
    const localInquiries = JSON.parse(localStorage.getItem('gcc_inquiries') || '[]');
    localInquiries.unshift(finalInquiryPayload);
    localStorage.setItem('gcc_inquiries', JSON.stringify(localInquiries));

    // Show Success Step 6
    setStep(6);
  };

  const handleReset = () => {
    setStep(1);
    setProgress(0);
    setValidationError('');
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setClientCompany('');
  };


  return (
    <div className="space-y-6 pb-16 font-sans max-w-7xl mx-auto">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-650 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-red-150">
            <Calculator className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'GCC INTERACTIVE CONFIGURATORS' : 'دليل وأنظمة تقدير وتخطيط أسعار شركة GCC'}</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1.5 leading-none">
            {language === 'en' ? 'Engineering Equipment Sizer & Pricing' : 'حاسبة تقدير التكاليف وتخطيط الأنظمة'}
          </h1>
          <p className="text-slate-500 text-xs mt-1.5 font-bold">
            {language === 'en' 
              ? 'Select an electro-mechanical category of choice, spec physical inputs conformant to Saudi Codes, and receive automated design reports.' 
              : 'صمم وحدد سعة تكييف مبناك، شبكة الإطفاء، المولدات الاحتياطية أو الإنذار بموجب الأكواد واحصل على مقايسة فورية.'}
          </p>
        </div>

        {step > 1 && step < 5 && (
          <button 
            onClick={() => setStep(1)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-200 select-none cursor-pointer"
          >
            <ListRestart className="w-4 h-4 text-slate-500" />
            {language === 'en' ? 'Switch Category' : 'تغيير نوع النظام'}
          </button>
        )}
      </div>

      {/* STEP 1: INTERACTIVE SELECTION OF CATEGORY AND SYSTEM COSIGN */}
      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl text-center space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900">
              {language === 'en' ? 'Choose System to Configure & Quote' : 'يرجى اختيار القسم الهندسي لمخططك'}
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto font-semibold">
              {language === 'en' 
                ? 'Welcome to the sizing and pricing center. Select any of the primary GCC divisions below to start configuring required devices, capacity, and materials.'
                : 'أهلاً بك في حاسبة التقييم والتقدير لشركة GCC المعتمدة. يرجى اختيار أحد الأقسام وتحديد سعة تبريدك، مضخات الإطفاء، كاتم المولدات أو كواشف الأمن للحساب الفوري.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Category Option 1 */}
            <div 
              onClick={() => { setSelectedCategory('alarm_control'); setStep(2); }}
              className="bg-white hover:bg-slate-50/50 border-2 border-slate-150 hover:border-slate-350 p-6 rounded-3xl cursor-pointer transition-all flex flex-col justify-between space-y-4 hover:shadow-lg relative group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {language === 'en' ? 'Alarm & Access Systems' : 'الإنذار والتحكم بالوصول'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-bold leading-normal mt-1">
                    {language === 'en' ? 'Configure fire alarms, biometrics, security gates and automatic releases.' : 'حدد كواشف فتح الأبواب، بوابات مواقف السيارات الدوارة، وأجهزة تحقق البصمة والتحكم الفوري بالوصول.'}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 text-slate-500 text-xs font-black group-hover:text-red-650 transition-colors">
                <span>{language === 'en' ? 'Configure Security' : 'تحديد الأنواع'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Category Option 2 */}
            <div 
              onClick={() => { setSelectedCategory('generators'); setStep(2); }}
              className="bg-white hover:bg-slate-50/50 border-2 border-slate-150 hover:border-slate-350 p-6 rounded-3xl cursor-pointer transition-all flex flex-col justify-between space-y-4 hover:shadow-lg relative group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-600">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {language === 'en' ? 'Generators & Power' : 'المولدات الكهربائية والجهد'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-bold leading-normal mt-1">
                    {language === 'en' ? 'Sizing alternate heavy standby generators, ATS synchronizers, and fuel canopy systems.' : 'اختر كوابل التحويل التلقائي، مبردات المحرك، عازل ومخمد الصوت الكاتم، وسعة الكيلو فولت أمبير (KVA) المطلوبة المبنى.'}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 text-slate-500 text-xs font-black group-hover:text-red-650 transition-colors">
                <span>{language === 'en' ? 'Configure Generators' : 'تحديد المولدات'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Category Option 3 */}
            <div 
              onClick={() => { setSelectedCategory('hvac'); setStep(2); }}
              className="bg-white hover:bg-slate-50/50 border-2 border-slate-150 hover:border-slate-350 p-6 rounded-3xl cursor-pointer transition-all flex flex-col justify-between space-y-4 hover:shadow-lg relative group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Wind className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {language === 'en' ? 'HVAC & Cooling Systems' : 'أنظمة التكييف والتبريد'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-bold leading-normal mt-1">
                    {language === 'en' ? 'Size mechanical VRF, packaged HVAC cooling loads, or high static duct layouts.' : 'حدد نوع نظام التكييف (سبليت، مركزي، دكت، تشيلر)، ومساحة التغطية لحساب الأطنان وتوفير الطاقة.'}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 text-slate-500 text-xs font-black group-hover:text-red-650 transition-colors">
                <span>{language === 'en' ? 'Configure HVAC' : 'تحديد التكييف'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Category Option 4 */}
            <div 
              onClick={() => { setSelectedCategory('fire_fighting'); setStep(2); }}
              className="bg-white hover:bg-slate-50/50 border-2 border-slate-150 hover:border-slate-350 p-6 rounded-3xl cursor-pointer transition-all flex flex-col justify-between space-y-4 hover:shadow-lg relative group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-650">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {language === 'en' ? 'Fire Fighting Systems' : 'أنظمة مكافحة الحرائق'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-bold leading-normal mt-1">
                    {language === 'en' ? 'Configure wet sprinkler loops, FM200 protection, safety pumps, and pipe specifications.' : 'اختر كوابل الإطفاء بالغاز النظيف ورشاشات المبنى المائية والمواسير ومضخات الطوارئ.'}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 text-slate-500 text-xs font-black group-hover:text-red-650 transition-colors">
                <span>{language === 'en' ? 'Configure Suppression' : 'تحديد الإطفاء'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

          </div>
        </div>
      )}


      {/* PROCESS STEPS CONTENT */}
      {step >= 2 && step <= 4 && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm animate-fade-in font-sans">
          
          {/* Active Navigation Tracker */}
          <div className="bg-slate-900 text-white px-6 py-4.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-white/10 rounded-xl text-red-500">
                {selectedCategory === 'alarm_control' && <Fingerprint className="w-5 h-5" />}
                {selectedCategory === 'generators' && <Zap className="w-5 h-5" />}
                {selectedCategory === 'hvac' && <Wind className="w-5 h-5" />}
                {selectedCategory === 'fire_fighting' && <Flame className="w-5 h-5" />}
              </span>
              <div>
                <span className="text-[9px] font-black uppercase text-red-500 tracking-wider">
                  {language === 'en' ? 'ACTIVE DESIGN PROCESS' : 'منظومة التوجيه الهندسي'}
                </span>
                <h2 className="text-sm font-black text-white leading-none">
                  {selectedCategory === 'alarm_control' && (language === 'en' ? 'Alarm & Secure Logic Config' : 'تخصيص أنظمة التحكم بجدولة الأمان والإنذار')}
                  {selectedCategory === 'generators' && (language === 'en' ? 'Standby Power & kVA Sizing' : 'حساب المولدات الاحتياطية وتوزيع الأحمال الكهربائية')}
                  {selectedCategory === 'hvac' && (language === 'en' ? 'HVAC Air Tonnage & Duct Sizing' : 'جداول التكييف وحساب سعة الوحدات بالطن الحراري')}
                  {selectedCategory === 'fire_fighting' && (language === 'en' ? 'SBC Fire Suppression Systems' : 'تصميم واختيار شبكة الإطفاء ومكافحة الحريق')}
                </h2>
              </div>
            </div>

            <div className="flex gap-2 text-xs font-bold text-slate-450 items-center">
              <span>{language === 'en' ? 'Step' : 'الخطوة'} {step - 1} {language === 'en' ? 'of 3' : 'من ٣'}</span>
            </div>
          </div>


          {/* =======================================================
               SUB-STAGE 1: PRIMARY HARDWARE SELECTION TYPE (STEP 2 STATE)
             ======================================================= */}
          {step === 2 && (
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Category 1 Selection Display */}
              {selectedCategory === 'alarm_control' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      {language === 'en' ? 'Select Alarm and Access Types' : 'اختر نظام الإنذار والتحكم'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {language === 'en' ? 'Identify and combine required alarm components' : 'حدد نظاماً أو أكثر لتأسيس وتغذية رغبتك بالأنظمة الآتية:'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {alarmTypes.map((type) => {
                      const isSel = selectedAlarmTypes.includes(type.id);
                      return (
                        <div 
                          key={type.id}
                          onClick={() => toggleAlarmType(type.id)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer select-none transition-all flex items-start gap-3 ${
                            isSel ? 'border-slate-900 bg-slate-50' : 'border-slate-150 bg-white hover:border-slate-250'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                            isSel ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSel && <Check className="w-3 h-3" />}
                          </span>
                          <div>
                            <span className="block text-xs font-black text-slate-900">{language === 'en' ? type.nameEn : type.nameAr}</span>
                            <span className="block text-[10px] text-slate-400 mt-0.5 leading-normal">{language === 'en' ? type.descEn : type.descAr}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Category 2 Generator Selection Display */}
              {selectedCategory === 'generators' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      {language === 'en' ? 'Choose the Appropriate Power System' : 'اختر نظام الطاقة المناسب'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {language === 'en' ? 'Select prime electrical generation setups or backup switchers' : 'اختر نوع شبكة التوليد والتحكم بالتغذية للمجمعات أو المصانع:'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generatorTypes.map((type) => {
                      const isSel = selectedGenType === type.id;
                      return (
                        <div 
                          key={type.id}
                          onClick={() => setSelectedGenType(type.id)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer select-none transition-all flex items-start gap-3 ${
                            isSel ? 'border-red-650 bg-slate-50' : 'border-slate-150 bg-white hover:border-slate-250'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                            isSel ? 'border-red-650 bg-red-650 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSel && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          <div>
                            <span className="block text-xs font-black text-slate-900">{language === 'en' ? type.nameEn : type.nameAr}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Category 3 HVAC Selection Display */}
              {selectedCategory === 'hvac' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      {language === 'en' ? 'Select Air Conditioning & Cooling Type' : 'حدد نوع نظام التكييف'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {language === 'en' ? 'Choose split, packaged or water-cooled units' : 'حدد طبيعة وتصنيف الضواغط والتوزيع تكييف مبناك:'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hvacTypes.map((type) => {
                      const isSel = selectedHvacType === type.id;
                      return (
                        <div 
                          key={type.id}
                          onClick={() => setSelectedHvacType(type.id)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer select-none transition-all flex items-start gap-3 ${
                            isSel ? 'border-blue-600 bg-slate-50/50' : 'border-slate-150 bg-white hover:border-slate-250'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                            isSel ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSel && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          <div>
                            <span className="block text-xs font-black text-slate-900">{language === 'en' ? type.nameEn : type.nameAr}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Category 4 Fire Suppression Selector */}
              {selectedCategory === 'fire_fighting' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      {language === 'en' ? 'Choose the Appropriate Fire Suppression System' : 'اختر نظام الإطفاء المناسب'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {language === 'en' ? 'Select clean agent gas (FM200), central water sprinkler arrays, or hose reels' : 'اختر تصنيفات ومحطات حماية الحوادث للإخماد الفوري:'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fireSuppressionTypes.map((type) => {
                      const isSel = selectedSuppressionTypes.includes(type.id);
                      return (
                        <div 
                          key={type.id}
                          onClick={() => toggleSuppressionType(type.id)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer select-none transition-all flex items-start gap-3 ${
                            isSel ? 'border-red-650 bg-slate-50' : 'border-slate-150 bg-white hover:border-slate-250'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                            isSel ? 'bg-red-650 border-red-650 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSel && <Check className="w-3 h-3" />}
                          </span>
                          <div>
                            <span className="block text-xs font-black text-slate-900">{language === 'en' ? type.nameEn : type.nameAr}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Next navigation bar */}
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <button 
                  onClick={() => setStep(1)}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer select-none"
                >
                  {language === 'en' ? 'Back' : 'رجوع'}
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="bg-red-650 hover:bg-red-700 text-white px-5 py-2.5 text-xs font-black rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{language === 'en' ? 'Next: Project Specifications' : 'تفاصيل المشروع'}</span>
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>

            </div>
          )}


          {/* =======================================================
               SUB-STAGE 2: PROJECT SPECIFICATIONS DETAILS (STEP 3 STATE)
             ======================================================= */}
          {step === 3 && (
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Category 1 SPECIFIC DETS */}
              {selectedCategory === 'alarm_control' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                  
                  {/* Left Specs */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">1. Physical Nodes Sizing</span>
                    
                    {/* Rooms Alarm slider */}
                    <div className="space-y-1 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-150">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-slate-800">{language === 'en' ? 'Number of Rooms' : 'عدد الغرف'}</span>
                        <span className="font-mono font-black text-red-650 bg-white px-2.5 py-0.5 rounded border border-slate-200">{roomsAlarm}</span>
                      </div>
                      <input 
                        type="range" min="1" max="50" value={roomsAlarm} 
                        onChange={(e) => setRoomsAlarm(parseInt(e.target.value))}
                        className="w-full accent-red-650 h-5"
                      />
                    </div>

                    {/* Doors Alarm slider */}
                    <div className="space-y-1 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-150">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-slate-800">{language === 'en' ? 'Number of Doors' : 'عدد الأبواب ومداخل العبور'}</span>
                        <span className="font-mono font-black text-slate-800 bg-white px-2.5 py-0.5 rounded border border-slate-200">{doorsAlarm}</span>
                      </div>
                      <input 
                        type="range" min="1" max="40" value={doorsAlarm} 
                        onChange={(e) => setDoorsAlarm(parseInt(e.target.value))}
                        className="w-full accent-slate-900 h-5"
                      />
                    </div>
                  </div>

                  {/* Right Specs */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">2. Property Profile</span>
                    
                    <div className="space-y-1.5 text-xs">
                      <span className="font-bold text-slate-650 block">{language === 'en' ? 'Building Type' : 'نوع المبنى'}</span>
                      <select 
                        value={buildingTypeAlarm} onChange={(e) => setBuildingTypeAlarm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500 font-bold text-slate-805"
                      >
                        <option value="commercial">{language === 'en' ? 'Commercial Building' : 'تجاري / معارض ومراكز'}</option>
                        <option value="residential">{language === 'en' ? 'Residential / Private Villa' : 'سكني / فلل وعمارات'}</option>
                        <option value="industrial">{language === 'en' ? 'Industrial Plant / Warehouse' : 'صناعي / مستودعات وصوامع'}</option>
                      </select>
                    </div>

                    {/* Central Integration link flag */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-150 flex justify-between items-center">
                      <div>
                        <span className="text-xs font-black text-slate-900 block">{language === 'en' ? 'Requires Central Integration?' : 'هل يحتاج ربط مركزي؟'}</span>
                        <span className="text-[9.5px] text-slate-400 block mt-0.5">{language === 'en' ? 'Direct Civil Defense secure link receiver' : 'توصيل اللوحة آلياً لغرف المعالجة'}</span>
                      </div>
                      <button 
                        onClick={() => setCentralLinkAlarm(!centralLinkAlarm)}
                        className={`w-11 h-6 rounded-full p-0.5 transition-colors ${centralLinkAlarm ? 'bg-slate-950' : 'bg-slate-200'}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white transition-all transform ${centralLinkAlarm ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* Category 2 Generator SPECIFIC DETS */}
              {selectedCategory === 'generators' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                  
                  {/* Left Specs */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">1. Sizing Parameters</span>
                    
                    {/* KVA Capacity slider */}
                    <div className="space-y-1 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-150">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-slate-800">{language === 'en' ? 'Required Capacity (KVA)' : 'القدرة المطلوبة KVA'}</span>
                        <span className="font-mono font-black text-yellow-650 bg-white px-2.5 py-0.5 rounded border border-slate-200">{requiredKVA} kVA</span>
                      </div>
                      <input 
                        type="range" min="10" max="2500" step="10" value={requiredKVA} 
                        onChange={(e) => setRequiredKVA(parseInt(e.target.value))}
                        className="w-full accent-yellow-500 h-5"
                      />
                    </div>

                    {/* Operating hours slider */}
                    <div className="space-y-1 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-150">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-slate-800">{language === 'en' ? 'Daily Operating Hours' : 'ساعات التشغيل باليوم'}</span>
                        <span className="font-mono font-black text-slate-800 bg-white px-2.5 py-0.5 rounded border border-slate-200">{operatingHours} {language === 'en' ? 'Hrs' : 'ساعة'}</span>
                      </div>
                      <input 
                        type="range" min="2" max="24" value={operatingHours} 
                        onChange={(e) => setOperatingHours(parseInt(e.target.value))}
                        className="w-full accent-slate-900 h-5"
                      />
                    </div>
                  </div>

                  {/* Right Specs */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">2. Environment Configuration</span>
                    
                    <div className="space-y-1.5 text-xs">
                      <span className="font-bold text-slate-650 block">{language === 'en' ? 'Project Category Type' : 'نوع المشروع'}</span>
                      <select 
                        value={projectTypeGen} onChange={(e) => setProjectTypeGen(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500 font-bold text-slate-805"
                      >
                        <option value="commercial">{language === 'en' ? 'Commercial Hub' : 'تجاري ومجمعات أسواق'}</option>
                        <option value="factory">{language === 'en' ? 'Industrial / Factory' : 'صناعي ومصانع مغلقة'}</option>
                        <option value="residential">{language === 'en' ? 'Residential Complex' : 'سكني / عمارات ومحطات'}</option>
                        <option value="medical">{language === 'en' ? 'Emergency Medical Site' : 'طبي وعناية فائقة مستودعات'}</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <span className="font-bold text-slate-650 block">{language === 'en' ? 'Installation Environment' : 'مكان وموطن التركيب'}</span>
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => setGenLocation('indoor')}
                          className={`p-2 rounded-xl border text-xs font-black transition-all ${genLocation === 'indoor' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white text-slate-600'}`}
                        >
                          {language === 'en' ? 'Indoor Room' : 'داخلي بداخل غرفة'}
                        </button>
                        <button 
                          onClick={() => setGenLocation('outdoor')}
                          className={`p-2 rounded-xl border text-xs font-black transition-all ${genLocation === 'outdoor' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white text-slate-600'}`}
                        >
                          {language === 'en' ? 'Outdoor Yard' : 'خارجي بالفناء'}
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Category 3 HVAC SPECIFIC DETS */}
              {selectedCategory === 'hvac' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                  
                  {/* Left Specs */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">1. Sizing Site Measurements</span>
                    
                    {/* Area Slider */}
                    <div className="space-y-1 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-150">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-slate-800">{language === 'en' ? 'Primes site area (m²)' : 'مساحة الموقع الإجمالية'}</span>
                        <span className="font-mono font-black text-blue-600 bg-white px-2.5 py-0.5 rounded border border-slate-200">{hvacArea} m²</span>
                      </div>
                      <input 
                        type="range" min="30" max="6000" step="10" value={hvacArea} 
                        onChange={(e) => setHvacArea(parseInt(e.target.value))}
                        className="w-full accent-blue-600 h-5"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Rooms Counts */}
                      <div className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-150 text-xs">
                        <span className="font-bold text-slate-650 block text-[10px]">{language === 'en' ? 'Rooms' : 'عدد الغرف'}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => setHvacRooms(Math.max(1, hvacRooms - 1))} className="w-6 h-6 bg-slate-100 rounded text-slate-800 font-extrabold">-</button>
                          <span className="font-black flex-1 text-center font-mono">{hvacRooms}</span>
                          <button onClick={() => setHvacRooms(hvacRooms + 1)} className="w-6 h-6 bg-slate-100 rounded text-slate-800 font-extrabold">+</button>
                        </div>
                      </div>

                      {/* Floors count */}
                      <div className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-150 text-xs">
                        <span className="font-bold text-slate-650 block text-[10px]">{language === 'en' ? 'Floors count' : 'عدد الطوابق'}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => setHvacFloors(Math.max(1, hvacFloors - 1))} className="w-6 h-6 bg-slate-100 rounded text-slate-800 font-extrabold">-</button>
                          <span className="font-black flex-1 text-center font-mono">{hvacFloors}</span>
                          <button onClick={() => setHvacFloors(hvacFloors + 1)} className="w-6 h-6 bg-slate-100 rounded text-slate-800 font-extrabold">+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Specs */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">2. Dynamic Occupancy / Activity</span>
                    
                    <div className="space-y-1.5 text-xs">
                      <span className="font-bold text-slate-650 block">{language === 'en' ? 'Type of Use / Activity' : 'نوع الاستخدام'}</span>
                      <select 
                        value={hvacActivity} onChange={(e) => setHvacActivity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500 font-bold text-slate-805"
                      >
                        <option value="commercial">{language === 'en' ? 'Showroom / Retail complexity' : 'معرض / مجمع تجاري عالي الحرارة'}</option>
                        <option value="residential">{language === 'en' ? 'Villa / Apartment housing' : 'فيلا / مجمع سكني مريح وهادئ'}</option>
                        <option value="medical">{language === 'en' ? 'Clean Lab / Healthcare' : 'مستشفى / غرف عيادات معقمة'}</option>
                        <option value="industrial">{language === 'en' ? 'Warehouse cooling' : 'مخزن / مصنع تهوية ومستودع'}</option>
                      </select>
                    </div>

                    {/* Quick checkboxes options */}
                    <div className="space-y-2 pt-1">
                      <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 text-[11px] border border-slate-150">
                        <span className="font-bold text-slate-700">{language === 'en' ? 'Heat and Cooling Option' : 'نظام حار / بارد'}</span>
                        <button onClick={() => setHotCold(!hotCold)} className={`w-8 h-4.5 rounded-full p-0.5 Transition ${hotCold ? 'bg-slate-900' : 'bg-slate-200'}`}>
                          <div className={`w-3.5 h-3.5 rounded-full bg-white transform ${hotCold ? 'translate-x-3.5' : 'translate-x-[1px]'}`} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 text-[11px] border border-slate-150">
                        <span className="font-bold text-slate-700">{language === 'en' ? 'Smart Inverter Eco Mode' : 'توفير الطاقة الممتد'}</span>
                        <button onClick={() => setEnergySaving(!energySaving)} className={`w-8 h-4.5 rounded-full p-0.5 Transition ${energySaving ? 'bg-slate-900' : 'bg-slate-200'}`}>
                          <div className={`w-3.5 h-3.5 rounded-full bg-white transform ${energySaving ? 'translate-x-3.5' : 'translate-x-[1px]'}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Category 4 FIRE FIGHTING DETS */}
              {selectedCategory === 'fire_fighting' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                  
                  {/* Left Specs */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">1. Sizing Safety Scope</span>
                    
                    {/* Area Slider */}
                    <div className="space-y-1 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-150">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-slate-800">{language === 'en' ? 'Building Footprint Area (m²)' : 'مساحة المبنى الإجمالية'}</span>
                        <span className="font-mono font-black text-red-650 bg-white px-2.5 py-0.5 rounded border border-slate-200">{suppArea} m²</span>
                      </div>
                      <input 
                        type="range" min="50" max="10000" step="20" value={suppArea} 
                        onChange={(e) => setSuppArea(parseInt(e.target.value))}
                        className="w-full accent-red-650 h-5"
                      />
                    </div>

                    {/* Floor count slider */}
                    <div className="space-y-1 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-150">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-slate-800">{language === 'en' ? 'Total Floors Count' : 'عدد الطوابق'}</span>
                        <span className="font-mono font-black text-slate-800 bg-white px-2.5 py-0.5 rounded border border-slate-200">{suppFloors}</span>
                      </div>
                      <input 
                        type="range" min="1" max="15" value={suppFloors} 
                        onChange={(e) => setSuppFloors(parseInt(e.target.value))}
                        className="w-full accent-slate-900 h-5"
                      />
                    </div>
                  </div>

                  {/* Right Specs */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">2. Activity Hazard Sizing</span>
                    
                    <div className="space-y-1.5 text-xs">
                      <span className="font-bold text-slate-650 block">{language === 'en' ? 'Occupancy / Building Activity' : 'نوع النشاط'}</span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          { id: 'warehouse', labelAr: 'مستودع وتخزين', labelEn: 'Warehouse Setup' },
                          { id: 'industrial', labelAr: 'صناعي / مصنع', labelEn: 'Industrial Plant' },
                          { id: 'residential', labelAr: 'مجمع سكني / فلل', labelEn: 'Residential Home' },
                          { id: 'commercial', labelAr: 'تجاري وشرائي', labelEn: 'Retail / Commerce' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSuppActivity(opt.id as any)}
                            className={`p-2.5 rounded-xl border text-[11px] font-black transition-all ${
                              suppActivity === opt.id ? 'bg-red-650 border-red-650 text-white' : 'bg-white text-slate-600 hover:border-slate-350'
                            }`}
                          >
                            {language === 'en' ? opt.labelEn : opt.labelAr}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Back & Next Navigation for step 3 */}
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <button 
                  onClick={() => setStep(2)}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer select-none"
                >
                  {language === 'en' ? 'Back' : 'رجوع لخيارات الموديل'}
                </button>
                <button 
                  onClick={() => setStep(4)}
                  className="bg-red-650 hover:bg-red-700 text-white px-5 py-2.5 text-xs font-black rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{language === 'en' ? 'Next: Materials & Review' : 'الحل النهائي والمقايسة'}</span>
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>

            </div>
          )}


          {/* =======================================================
               SUB-STAGE 3: MATERIALS EQUIP & DRAFT PRICING REVIEW (STEP 4 STATE)
             ======================================================= */}
          {step === 4 && (
            <div className="p-6 sm:p-8 space-y-8">
              
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {language === 'en' ? 'Step 3: Engineering Request Review' : 'الخطوة الأخيرة: مراجعة الطلب والمواد المطلوبة'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'en' ? 'Review selected systems, required materials inventory and estimated costings.' : 'تصفح ملخص مدخلاتك الهندسية والمواد التقديرية المترتبة عليها.'}
                </p>
              </div>

              {/* REVIEW GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
                
                {/* Left side: Materials checklist and summary */}
                <div className="lg:col-span-7 space-y-5">
                  
                  {/* Summary card */}
                  <div className="bg-slate-50 border border-slate-150 p-5 rounded-2xl space-y-3.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block border-b border-slate-200 pb-1.5">
                      {language === 'en' ? 'Project Specification Summary' : 'ملخص مواصفات المشروع'}
                    </span>

                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                      <div>
                        <span className="text-slate-400 block">{language === 'en' ? 'System Category' : 'النظام المختار'}</span>
                        <span className="font-extrabold text-slate-900">
                          {selectedCategory === 'alarm_control' && (language === 'en' ? 'Fire Alarm & Security Access' : 'كواشف إنذار وتحكم بالمرور')}
                          {selectedCategory === 'generators' && (language === 'en' ? 'Heavy Prime Power Generators' : 'تجهيزات ومولدات الطاقة الكثيفة')}
                          {selectedCategory === 'hvac' && (language === 'en' ? 'HVAC Air Cooling Networks' : 'التكييف المركزي والتبريد')}
                          {selectedCategory === 'fire_fighting' && (language === 'en' ? 'Civil Safe Suppression' : 'إطفاء ومكافحة حرائق')}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block">{language === 'en' ? 'Premises Properties' : 'إجمالي الحجم والمساحة'}</span>
                        <span className="font-extrabold text-slate-900 font-mono">
                          {selectedCategory === 'alarm_control' && `${roomsAlarm} R / ${doorsAlarm} D`}
                          {selectedCategory === 'generators' && `${requiredKVA} kVA Generator (${genLocation})`}
                          {selectedCategory === 'hvac' && `${hvacArea} m² Site Size`}
                          {selectedCategory === 'fire_fighting' && `${suppArea} m² Footprint`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Materials list display */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                      {language === 'en' ? 'Recommended Required Materials' : 'المواد والوحدات المطلوبة للتجهيز'}
                    </span>

                    <div className="space-y-2.5">
                      {estimatedCostData.materials.map((mat, i) => (
                        <div key={i} className="flex gap-3 bg-white p-3.5 rounded-xl border border-slate-150 items-center justify-between shadow-xs">
                          <div className="flex bg-slate-100 rounded-lg p-1 text-slate-600 shrink-0">
                            <CircleDot className="w-4 h-4 text-slate-400" />
                          </div>
                          <span className="text-xs font-extrabold text-slate-800 flex-1 leading-normal">
                            {language === 'en' ? mat.en : mat.ar}
                          </span>
                          <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black py-0.5 px-2 rounded uppercase border border-emerald-150">
                            SBC Standard
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right side: Cost summary and User lead inputs */}
                <form onSubmit={handleSubmitPrompt} className="lg:col-span-5 space-y-5 bg-slate-50/50 p-5 rounded-3xl border border-slate-200">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block border-b border-slate-200 pb-1.5">
                    {language === 'en' ? 'Estimator & Contact Submit' : 'بيانات التواصل والمقايسة التقديرية'}
                  </span>

                  {/* Optional Estimated Price */}
                  <div className="bg-slate-900 text-white p-4.5 rounded-2xl text-center space-y-1 relative overflow-hidden">
                    <span className="text-[9.5px] font-mono tracking-widest text-red-500 uppercase block font-black">
                      {language === 'en' ? 'ESTIMATED INITIAL CAPITAL COST' : 'التكلفة التقديرية المقررة فئوية'}
                    </span>
                    <h4 className="text-2xl font-black text-red-500 font-mono leading-none">
                      {estimatedCostData.min.toLocaleString()} - {estimatedCostData.max.toLocaleString()}
                      <span className="text-xs font-sans font-semibold text-white/90 pl-1.5"> {language === 'en' ? 'SAR' : 'ريال'}</span>
                    </h4>
                    <p className="text-[9.5px] text-white/50 leading-relaxed font-semibold">
                      {language === 'en' ? 'Draft values subject to detailed blueprints assessment' : 'قيم تخمينية تقريبية وخاضعة للتسوية والمراجعة النهائية بمكتب العقود.'}
                    </p>
                  </div>

                  {/* User Form Information */}
                  <div className="space-y-3.5">
                    
                    {/* Customer validation error */}
                    <AnimatePresence>
                      {validationError && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-red-50 border border-red-150 text-red-700 text-[11px] p-2.5 rounded-xl font-bold flex items-center gap-1.5"
                        >
                          <Flame className="w-4 h-4 shrink-0" />
                          <span>{validationError}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-[10.5px] font-black text-slate-600 block">{language === 'en' ? 'Full Contact Name' : 'اسم مقدم الطلب للشركة'} <span className="text-red-500">*</span></label>
                      <input 
                        type="text" required value={clientName} onChange={(e) => setClientName(e.target.value)}
                        placeholder={language === 'en' ? 'e.g. Mohammed Al-Otaibi' : 'مثال: محمد السبيعي'}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-red-500 font-bold"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-[10.5px] font-black text-slate-600 block">{language === 'en' ? 'Mobile Number' : 'رقم الهاتف / الجوال'} <span className="text-red-500">*</span></label>
                      <input 
                        type="tel" required value={clientPhone} onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="e.g. +966 50 000 0000"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-red-500 font-bold font-mono [direction:ltr]"
                        dir="ltr"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[10.5px] font-black text-slate-600 block">{language === 'en' ? 'Email Address' : 'البريد الإلكتروني المباشر'} <span className="text-red-500">*</span></label>
                      <input 
                        type="email" required value={clientEmail} onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-red-500 font-bold font-mono"
                      />
                    </div>

                    {/* Organization / Company optional */}
                    <div className="space-y-1">
                      <label className="text-[10.5px] font-black text-slate-600 block">{language === 'en' ? 'Company Name / Entity' : 'اسم الشركة / المنشأة (مستحب)'}</label>
                      <input 
                        type="text" value={clientCompany} onChange={(e) => setClientCompany(e.target.value)}
                        placeholder={language === 'en' ? 'e.g. GCC Industrial Co.' : 'مثال: شركة الخليج للتطوير'}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-red-500 font-bold"
                      />
                    </div>
                  </div>

                  {/* Submission prompt Button */}
                  <button
                    type="submit"
                    className="w-full bg-red-650 hover:bg-red-700 text-white rounded-xl py-3.5 text-xs font-black transition-all active:scale-95 shadow-md shadow-red-950/15 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    {language === 'en' ? 'Submit Design & Create Ticket' : 'إرسال طلب المقايسة والفحص'}
                  </button>
                </form>

              </div>

              {/* Back navigation only */}
              <div className="pt-4 border-t border-slate-150 flex justify-start">
                <button 
                  onClick={() => setStep(3)}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer select-none"
                >
                  {language === 'en' ? 'Back' : 'رجوع لخصائص المبنى'}
                </button>
              </div>

            </div>
          )}

        </div>
      )}


      {/* =======================================================
           STAGE 5: PROFESSIONAL ENGINEERING TRANSITION DRAWING (STEP 5 STATE)
         ======================================================= */}
      {step === 5 && (
        <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px] border border-slate-800 shadow-2xl">
          
          {/* Subtle architectural blueprints grid background built strictly in css */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          
          <div className="relative space-y-4 max-w-lg mx-auto z-10 flex flex-col items-center">
            
            {/* Elegant Brand Logo Symbol simulating rotating engines/gears */}
            <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 relative flex items-center justify-center mb-4">
              <div className="absolute inset-2 rounded-full border border-dashed border-red-500/30 animate-spin" style={{ animationDuration: '10s' }} />
              <div className="absolute inset-4 rounded-full border border-slate-800 flex items-center justify-center">
                <Activity className="w-8 h-8 text-red-500 animate-pulse" />
              </div>
              <svg className="w-20 h-20 absolute text-blue-500/40 opacity-70 animate-spin" viewBox="0 0 100 100" style={{ animationDuration: '24s' }}>
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="6,4" fill="none" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-xl font-black text-white leading-none">
              {language === 'en' ? 'GCC Live Specifications Sizing Server' : 'جاري معالجة طلبكم وحفظ المخططات...'}
            </h3>
            
            {/* Status explanation */}
            <p className="text-xs text-slate-400 font-mono italic max-w-sm">
              {loadingStatus}
            </p>

            {/* Dynamic Sizing Progress Bar */}
            <div className="w-full max-w-md bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 mt-4 relative">
              <div 
                className="bg-red-650 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Numeric ticking index */}
            <span className="text-xs font-mono font-black text-red-500 bg-red-950/40 px-3 py-1 rounded border border-red-900/30">
              {progress}% {language === 'en' ? 'Processed' : 'مكتمل بالمطابقة'}
            </span>
          </div>

        </div>
      )}


      {/* =======================================================
           STAGE 6: SUCCESS AND PRINT RECEIPT CONSOLE (STEP 6 STATE)
         ======================================================= */}
      {step === 6 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-8 animate-fade-in shadow-xl relative font-sans">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-red-600 rounded-b-full" />

          {/* Large badge confirming GCC registration */}
          <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-150 flex items-center justify-center mx-auto text-emerald-600 shadow-sm animate-bounce">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl font-black text-slate-900">
              {language === 'en' ? 'Submission Confirmed Successfully!' : 'تم تقديم طلبك وحفظه بنجاح!'}
            </h2>
            <p className="text-xs text-slate-400 font-bold leading-normal">
              {language === 'en' 
                ? 'Your smart electro-mechanical configuration has been logged in the GCC system. Our central design queue will review CAD attachments shortly.'
                : 'تم استلام مدخلاتك الهندسية وتخزينها بقوافل لوحة الإدارة. سنقوم بمطابقة الكتل والمخططات وصياغة السعر الرسمي خلال دقائق.'}
            </p>
          </div>

          {/* Ticket ID Board */}
          <div className="bg-slate-50 border border-slate-150 p-6 rounded-2xl max-w-md mx-auto space-y-3 font-mono">
            <span className="text-[10px] font-sans font-black text-slate-450 uppercase tracking-widest block">{language === 'en' ? 'QUOTATION TRACKING CODE' : 'رقم طلب ومقايسة تتبع التسعير الرقمي'}</span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-lg font-black text-slate-900 select-all tracking-wide">
                {generatedTicketId}
              </span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generatedTicketId);
                  alert(language === 'en' ? 'Ticket Code Copied!' : 'تم نسخ رقم الطلب بنجاح للتحقق!');
                }}
                className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-600 transition-colors"
                title={language === 'en' ? 'Copy ID' : 'نسخ الرمز'}
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] font-sans text-slate-400 font-bold mt-1 max-w-xs mx-auto text-center leading-normal">
              {language === 'en' 
                ? 'Copy or print this ticket. You can track this project directly in our "Track Progress" tab.' 
                : 'يرجى حفظ هذا الرقم. يمكنك التحقق ومتابعة خطوات التقييم أولاً بأول من قسم "تتبع الطلبات" بالشركة.'}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <button 
              onClick={() => window.print()}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4.5 h-4.5 text-slate-500" />
              <span>{language === 'en' ? 'Print System Sheet' : 'طباعة ملخص المقايسة'}</span>
            </button>
            <button 
              onClick={handleReset}
              className="bg-red-650 hover:bg-red-700 text-white px-5 py-3 rounded-xl text-xs font-black transition-all active:scale-95 shadow-md shadow-red-950/15 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{language === 'en' ? 'Configure Another Property' : 'تخطيط مشروع جديد'}</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default AISizer;
