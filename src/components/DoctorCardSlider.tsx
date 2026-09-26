import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Heart, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  FileText, 
  Check,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { 
  getStoredSpecialistSettings, 
  SpecialistImageSetting,
  GlobalCardSettings,
  getStoredGlobalCardSettings,
  findCustomSettingForDoctor
} from '../data/specialistCustomizer';
import { getResolvedImageUrl, handleImageErrorWithStore } from '../utils/persistentImageStore';

// Doctor Interface
export interface Doctor {
  id: string;
  name: string;
  nameEn?: string;
  arabicName?: string;
  title: string;
  titleEn?: string;
  specialty: string;
  specialtyEn?: string;
  specialtyCode: string;
  specialtyCodeEn: string;
  category: 'all' | 'aba' | 'occupational' | 'speech' | 'physical' | 'psychology';
  department: string;
  avatar: string;
  fallbackAvatar?: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  patientsCount?: number;
  sessionPrice: number;
  location: string;
  locationEn: string;
  isAvailable: boolean;
  nextSlot: string;
  nextSlotEn: string;
  tags: string[];
  bio: string;
  isTopRated?: boolean;
}

// Realistic Medical Specialists matching Raba Center and the user's reference team
export const DOCTORS_DATA: Doctor[] = [
  {
    id: 'doc-haneen-obaidi',
    name: 'أ. حنين العبيدي',
    arabicName: 'أ. حنين العبيدي',
    nameEn: 'Haneen Al-Obaidi',
    title: 'رئيس قسم العلاج الوظيفي',
    titleEn: 'Head of Occupational Therapy Department',
    specialty: 'رئيس قسم العلاج الوظيفي والتكامل الحسي',
    specialtyEn: 'Head of Occupational Therapy & Ayres SI Specialist',
    specialtyCode: 'العلاج الوظيفي والتكامل الحسي',
    specialtyCodeEn: 'OCCUPATIONAL THERAPY & SI',
    category: 'occupational',
    department: 'قسم العلاج الوظيفي والتكامل الحسي',
    avatar: '/images/specialists/haneen_obaidi.jpg',
    fallbackAvatar: '/images/specialists/haneen_obaidi.jpg',
    rating: 4.95,
    reviewCount: 240,
    experienceYears: 16,
    patientsCount: 2600,
    sessionPrice: 280,
    location: 'عيادات رابا - فرع الملقا، الرياض',
    locationEn: 'Al-Malqa Branch, Riyadh',
    isAvailable: true,
    nextSlot: 'اليوم، 3:00 م',
    nextSlotEn: 'Today, 3:00 PM',
    isTopRated: true,
    tags: ['بكالوريوس الجامعة الهاشمية', 'شهادة ايرس العالمية (Ayres SI)', 'شهادة Floortime 101', 'مرخصة باختبار EASI'],
    bio: 'رئيس قسم العلاج الوظيفي، حاصلة على بكالوريوس الجامعة الهاشمية، شهادة ايرس العالمية بالتكامل الحسي، Floortime 101، ومرخصة باختبار EASI بخبرة أكثر من 16 سنة في تأهيل الأطفال.'
  },
  {
    id: 'doc-rahaf-doghmani',
    name: 'أ. رهف الدغماني',
    arabicName: 'أ. رهف الدغماني',
    nameEn: 'Rahaf Al-Doghmani',
    title: 'إشراف قسم الـ ABA',
    titleEn: 'Supervisor of ABA Department',
    specialty: 'مشرفة قسم تحليل السلوك التطبيقي ABA',
    specialtyEn: 'Supervisor of ABA Department & QABA Analyst',
    specialtyCode: 'تحليل السلوك التطبيقي ABA',
    specialtyCodeEn: 'BEHAVIOR ANALYSIS (ABA)',
    category: 'aba',
    department: 'قسم تحليل السلوك التطبيقي والتدخل المبكر',
    avatar: '/images/specialists/rahaf_doghmani.jpg',
    fallbackAvatar: '/images/specialists/rahaf_doghmani.jpg',
    rating: 4.9,
    reviewCount: 175,
    experienceYears: 5,
    patientsCount: 890,
    sessionPrice: 270,
    location: 'عيادات رابا - فرع النرجس، الرياض',
    locationEn: 'Al-Narjis Branch, Riyadh',
    isAvailable: true,
    nextSlot: 'اليوم، 4:30 م',
    nextSlotEn: 'Today, 4:30 PM',
    isTopRated: true,
    tags: ['ماجستير جامعة الملك سعود', 'بكالوريوس جامعة القصيم', 'محلل سلوك QABA', 'الاضطرابات السلوكية والانفعالية'],
    bio: 'مشرفة قسم ABA، بكالوريوس تربية خاصة جامعة القصيم، ماجستير الاضطرابات السلوكية والانفعالية جامعة الملك سعود، ومحلل سلوك معتمد من منظمة QABA بخبرة أكثر من 5 سنوات.'
  },
  {
    id: 'doc-doha-khaled',
    name: 'أ. ضحى خالد',
    arabicName: 'أ. ضحى خالد',
    nameEn: 'Doha Khaled',
    title: 'إشراف قسم الـ ABA',
    titleEn: 'Supervisor of ABA Department',
    specialty: 'مشرفة قسم ABA ومحلل سلوكي معتمد',
    specialtyEn: 'ABA Supervisor & QASP-S / IBA Analyst',
    specialtyCode: 'تحليل السلوك التطبيقي ABA',
    specialtyCodeEn: 'BEHAVIOR ANALYSIS (ABA)',
    category: 'aba',
    department: 'قسم تحليل السلوك التطبيقي والتدخل المبكر',
    avatar: '/images/specialists/doha_khaled.jpg',
    fallbackAvatar: '/images/specialists/doha_khaled.jpg',
    rating: 4.9,
    reviewCount: 195,
    experienceYears: 9,
    patientsCount: 1420,
    sessionPrice: 260,
    location: 'عيادات رابا - فرع النرجس، الرياض',
    locationEn: 'Al-Narjis Branch, Riyadh',
    isAvailable: true,
    nextSlot: 'غداً، 9:30 ص',
    nextSlotEn: 'Tomorrow, 9:30 AM',
    isTopRated: true,
    tags: ['بكالوريوس تربية خاصة الجامعة العربية', 'مشرف توحد QASP-S من البورد الأمريكي', 'محلل سلوكي IBAO'],
    bio: 'مشرفة قسم ABA، بكالوريوس تربية خاصة الجامعة العربية، مشرف أخصائي توحد معتمد من البورد الأمريكي من منظمة QABA، ومحلل سلوكي معتمد من IBAO بخبرة تزيد عن 9 سنوات.'
  },
  {
    id: 'doc-manar-wahba',
    name: 'أ. منار وهبه',
    arabicName: 'أ. منار وهبه',
    nameEn: 'Manar Wahba',
    title: 'إشراف قسم النطق والتخاطب',
    titleEn: 'Supervisor of Speech & Language Pathology Department',
    specialty: 'مشرفة قسم النطق والتخاطب وأخصائية OPT معتمدة',
    specialtyEn: 'Speech & Language Supervisor & OPT Specialist (ASHA)',
    specialtyCode: 'علاج النطق والتخاطب',
    specialtyCodeEn: 'SPEECH & LANGUAGE',
    category: 'speech',
    department: 'قسم أمراض التخاطب واللغة والتواصل المعزز',
    avatar: '/images/specialists/manar_wahba.jpg',
    fallbackAvatar: '/images/specialists/manar_wahba.jpg',
    rating: 4.88,
    reviewCount: 182,
    experienceYears: 10,
    patientsCount: 1550,
    sessionPrice: 270,
    location: 'عيادات رابا - فرع التخصصي، الرياض',
    locationEn: 'Al-Takhassusi Branch, Riyadh',
    isAvailable: true,
    nextSlot: 'اليوم، 5:00 م',
    nextSlotEn: 'Today, 5:00 PM',
    isTopRated: false,
    tags: ['دبلومة تخاطب جامعة عين شمس', 'دبلومة تربية خاصة الزقازيق', 'متخصصة OPT', 'شهادة OPT من منظمة ASHA'],
    bio: 'مشرفة قسم النطق والتخاطب، بكالوريوس خدمة اجتماعية جامعة القاهرة، دبلومة تخاطب عين شمس، دبلومة علوم إعاقة الزقازيق، ومتخصصة OPT ومشاكل نطق وسمع بشهادة من منظمة ASHA الأمريكية بخبرة تفوق 10 سنوات.'
  },
  {
    id: 'doc-ahmed-fathi',
    name: 'أ. أحمد فتحي',
    arabicName: 'أ. أحمد فتحي',
    nameEn: 'Ahmed Fathi',
    title: 'أخصائي ABA',
    titleEn: 'ABA Specialist',
    specialty: 'أخصائي تحليل السلوك التطبيقي ABAT',
    specialtyEn: 'Applied Behavior Analysis Technician (ABAT)',
    specialtyCode: 'تحليل السلوك التطبيقي ABA',
    specialtyCodeEn: 'BEHAVIOR ANALYSIS (ABA)',
    category: 'aba',
    department: 'قسم تحليل السلوك التطبيقي والتدخل المبكر',
    avatar: '/images/specialists/ahmed_fathi.jpg',
    fallbackAvatar: '/images/specialists/ahmed_fathi.jpg',
    rating: 4.85,
    reviewCount: 168,
    experienceYears: 8,
    patientsCount: 1200,
    sessionPrice: 250,
    location: 'عيادات رابا - فرع الملقا، الرياض',
    locationEn: 'Al-Malqa Branch, Riyadh',
    isAvailable: true,
    nextSlot: 'غداً، 11:00 ص',
    nextSlotEn: 'Tomorrow, 11:00 AM',
    isTopRated: false,
    tags: ['بكالوريوس تربية خاصة جامعة حلوان', 'دبلوم مهني تواصل عين شمس', 'اعتماد البورد الأمريكي ABAT'],
    bio: 'أخصائي ABA، بكالوريوس تربية خاصة جامعة حلوان، دبلوم مهني اضطرابات تواصل وتخاطب جامعة عين شمس، واعتماد البورد الأمريكي ABAT بخبرة أكثر من 8 سنوات في البرامج السلوكية.'
  },
  {
    id: 'doc-mohamed-atef',
    name: 'أ. محمد عاطف',
    arabicName: 'أ. محمد عاطف',
    nameEn: 'Mohamed Atef',
    title: 'أخصائي ABA',
    titleEn: 'ABA Specialist',
    specialty: 'أخصائي تحليل السلوك ومشرف توحد مؤهل QASP-S',
    specialtyEn: 'ABA Specialist & Autism Supervisor (QASP-S)',
    specialtyCode: 'تحليل السلوك والتوحد',
    specialtyCodeEn: 'BEHAVIOR ANALYSIS & AUTISM',
    category: 'aba',
    department: 'قسم تحليل السلوك التطبيقي والتدخل المبكر',
    avatar: '/images/specialists/mohamed_atef.jpg',
    fallbackAvatar: '/images/specialists/mohamed_atef.jpg',
    rating: 4.88,
    reviewCount: 154,
    experienceYears: 5,
    patientsCount: 920,
    sessionPrice: 250,
    location: 'عيادات رابا - فرع النرجس، الرياض',
    locationEn: 'Al-Narjis Branch, Riyadh',
    isAvailable: true,
    nextSlot: 'اليوم، 6:15 م',
    nextSlotEn: 'Today, 6:15 PM',
    isTopRated: false,
    tags: ['بكالوريوس علوم الإعاقة جامعة الزقازيق', 'دبلوم خاص الزقازيق', 'مشرف توحد مؤهل QASP-S', 'متخصص بالإعاقة العقلية'],
    bio: 'أخصائي ABA، بكالوريوس علوم الإعاقة والتأهيل ودبلوم خاص من جامعة الزقازيق، ومشرف توحد مؤهل من منظمة QASP-S الأمريكية ومتخصص في الإعاقة العقلية بخبرة أكثر من 5 سنوات.'
  },
  {
    id: 'doc-sadeem-mshari',
    name: 'أ. سديم احمد المشاري',
    arabicName: 'أ. سديم احمد المشاري',
    nameEn: 'Sadeem Ahmed Al-Mashari',
    title: 'أخصائي ABA',
    titleEn: 'ABA Specialist',
    specialty: 'أخصائي تحليل السلوك ومصنفة من الهيئة السعودية',
    specialtyEn: 'ABA Specialist & SCFHS Classified',
    specialtyCode: 'تحليل السلوك وعلم النفس',
    specialtyCodeEn: 'ABA & PSYCHOLOGY',
    category: 'aba',
    department: 'قسم تحليل السلوك التطبيقي والتقييم النفسي',
    avatar: '/images/specialists/sadeem_mshari.jpg',
    fallbackAvatar: '/images/specialists/sadeem_mshari.jpg',
    rating: 4.9,
    reviewCount: 142,
    experienceYears: 4,
    patientsCount: 840,
    sessionPrice: 260,
    location: 'عيادات رابا - فرع الملقا، الرياض',
    locationEn: 'Al-Malqa Branch, Riyadh',
    isAvailable: true,
    nextSlot: 'غداً، 10:30 ص',
    nextSlotEn: 'Tomorrow, 10:30 AM',
    isTopRated: true,
    tags: ['بكالوريوس علم النفس جامعة نورة', 'دبلوم المقاييس النفسية', 'مصنفة من الهيئة السعودية للتخصصات الصحية', 'رخصة ABAT'],
    bio: 'أخصائي ABA، بكالوريوس علم النفس من جامعة الأميرة نورة، دبلوم المقاييس النفسية، مصنفة من الهيئة السعودية للتخصصات الصحية، وحاصلة على رخصة ABAT من البورد الأمريكي.'
  },
  {
    id: 'doc-maram-mohamed',
    name: 'أ. مرام محمد',
    arabicName: 'أ. مرام محمد',
    nameEn: 'Maram Mohamed',
    title: 'أخصائية ABA',
    titleEn: 'ABA Specialist',
    specialty: 'أخصائية تحليل السلوك وعلم النفس الإكلينيكي',
    specialtyEn: 'ABA Specialist & Clinical Psychology',
    specialtyCode: 'تحليل السلوك وعلم النفس',
    specialtyCodeEn: 'ABA & PSYCHOLOGY',
    category: 'aba',
    department: 'قسم تحليل السلوك التطبيقي والتدخل المبكر',
    avatar: '/images/specialists/maram_mohamed.jpg',
    fallbackAvatar: '/images/specialists/maram_mohamed.jpg',
    rating: 4.85,
    reviewCount: 130,
    experienceYears: 3,
    patientsCount: 650,
    sessionPrice: 240,
    location: 'عيادات رابا - فرع التخصصي، الرياض',
    locationEn: 'Al-Takhassusi Branch, Riyadh',
    isAvailable: true,
    nextSlot: 'غداً، 1:00 م',
    nextSlotEn: 'Tomorrow, 1:00 PM',
    isTopRated: false,
    tags: ['بكالوريوس علم النفس الإكلينيكي', 'جامعة الرباط الوطني', 'اعتماد البورد الأمريكي ABAT', 'جلسات ABA السلوكية'],
    bio: 'أخصائية ABA، بكالوريوس علم النفس الإكلينيكي جامعة الرباط الوطني، اعتماد البورد الأمريكي ABAT من منظمة QABA، متخصصة في العلاج عن طريق تحليل السلوك التطبيقي للأطفال.'
  },
  {
    id: 'doc-ahmed-raad',
    name: 'أ. أحمد رعد',
    arabicName: 'أ. أحمد رعد',
    nameEn: 'Ahmed Raad',
    title: 'أخصائي ABA',
    titleEn: 'ABA Specialist',
    specialty: 'أخصائي تحليل السلوك التطبيقي ABAT',
    specialtyEn: 'ABA Specialist & Health Sciences',
    specialtyCode: 'تحليل السلوك التطبيقي ABA',
    specialtyCodeEn: 'BEHAVIOR ANALYSIS (ABA)',
    category: 'aba',
    department: 'قسم تحليل السلوك التطبيقي والتدخل المبكر',
    avatar: '/images/specialists/ahmed_raad.jpg',
    fallbackAvatar: '/images/specialists/ahmed_raad.jpg',
    rating: 4.82,
    reviewCount: 125,
    experienceYears: 3,
    patientsCount: 610,
    sessionPrice: 240,
    location: 'عيادات رابا - فرع النرجس، الرياض',
    locationEn: 'Al-Narjis Branch, Riyadh',
    isAvailable: true,
    nextSlot: 'اليوم، 5:45 م',
    nextSlotEn: 'Today, 5:45 PM',
    isTopRated: false,
    tags: ['بكالوريوس علوم صحية جامعة حمص', 'أخصائي تحليل السلوك ABAT من البورد الأمريكي', 'تعديل السلوك الفردي'],
    bio: 'أخصائي ABA، بكالوريوس علوم صحية من جامعة حمص، حاصل على شهادة أخصائي تحليل السلوك ABAT من البورد الأمريكي، بخبرة أكثر من 3 سنوات في الجلسات الفردية وتعديل السلوك.'
  },
  {
    id: 'doc-ahmed-abouzeid',
    name: 'أ. أحمد أبو زيد أنور',
    arabicName: 'أ. أحمد أبو زيد أنور',
    nameEn: 'Ahmed Abouzeid Anwar',
    title: 'المدير العام للبرامج التأهيلية | رئيس قسم ABA',
    titleEn: 'Master of Arts, QBA, IBA Board Certified',
    specialty: 'تحليل السلوك التطبيقي والإشراف الإكلينيكي',
    specialtyEn: 'Applied Behavior Analysis & Clinical Lead',
    specialtyCode: 'تحليل السلوك التطبيقي ABA',
    specialtyCodeEn: 'BEHAVIOR ANALYSIS (ABA)',
    category: 'aba',
    department: 'قسم تحليل السلوك التطبيقي والتدخل المبكر',
    avatar: '/images/specialists/ahmed_abouzeid.jpg',
    fallbackAvatar: '/images/specialists/ahmed_abouzeid.jpg',
    rating: 4.95,
    reviewCount: 220,
    experienceYears: 12,
    patientsCount: 2200,
    sessionPrice: 280,
    location: 'عيادات رابا - فرع الملقا، الرياض',
    locationEn: 'Al-Malqa Branch, Riyadh',
    isAvailable: true,
    nextSlot: 'غداً، 4:00 م',
    nextSlotEn: 'Tomorrow, 4:00 PM',
    isTopRated: true,
    tags: ['QBA Board Certified', 'IBA®', 'مقدم CEUs للبورد'],
    bio: 'محلل سلوك دولي معتمد ومدير عام البرامج التأهيلية ورئيس قسم ABA وتصميم خطط التدخل السلوكي المكثفة.'
  }
];

export interface DoctorCardSliderProps {
  doctors?: Doctor[];
  specialists?: any[];
  onBookAppointment?: (doctor: Doctor) => void;
  onViewCv?: (doctor: Doctor) => void;
  className?: string;
}

export const DoctorCardSlider: React.FC<DoctorCardSliderProps> = ({
  doctors = DOCTORS_DATA,
  specialists,
  onBookAppointment,
  onViewCv,
  className = '',
}) => {
  const { isArabic } = useLanguage();

  // Search and Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'earliest' | 'rating' | 'experience'>('earliest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  // Favorites state
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Dynamic Specialist Image and Card Customizations (from Admin Dashboard)
  const [customSettings, setCustomSettings] = useState<Record<string, SpecialistImageSetting>>(() => getStoredSpecialistSettings());
  const [globalCardSettings, setGlobalCardSettings] = useState<GlobalCardSettings>(() => getStoredGlobalCardSettings());

  useEffect(() => {
    const handleUpdate = (e?: any) => {
      if (e?.type === 'raba_specialist_settings_updated' && e?.detail && !('timestamp' in e.detail)) {
        setCustomSettings(e.detail);
      } else {
        setCustomSettings(getStoredSpecialistSettings());
      }
    };
    const handleGlobalUpdate = (e?: any) => {
      if (e?.type === 'raba_global_card_settings_updated' && e?.detail && !('timestamp' in e.detail)) {
        setGlobalCardSettings(e.detail);
      } else {
        setGlobalCardSettings(getStoredGlobalCardSettings());
      }
    };
    window.addEventListener('raba_specialist_settings_updated', handleUpdate);
    window.addEventListener('raba_global_card_settings_updated', handleGlobalUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('raba_persistent_sync_ready', handleUpdate);
    window.addEventListener('raba_persistent_sync_ready', handleGlobalUpdate);
    return () => {
      window.removeEventListener('raba_specialist_settings_updated', handleUpdate);
      window.removeEventListener('raba_global_card_settings_updated', handleGlobalUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('raba_persistent_sync_ready', handleUpdate);
      window.removeEventListener('raba_persistent_sync_ready', handleGlobalUpdate);
    };
  }, []);

  // Slider refs and states
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const movedDistanceRef = useRef(0);

  // Merge doctors list with any specialists data passed dynamically
  const effectiveDoctors = useMemo(() => {
    return doctors.map((doc) => {
      const spec = specialists?.find(
        (s: any) => s.id === doc.id || s.id === doc.id.replace('doc-', 'spec-') || s.name === doc.name
      );
      if (spec && spec.avatar && spec.avatar !== doc.avatar) {
        return {
          ...doc,
          avatar: spec.avatar,
          fallbackAvatar: spec.avatar
        };
      }
      return doc;
    });
  }, [doctors, specialists]);

  // Categories list
  const categories = useMemo(() => [
    { id: 'all', labelAr: 'جميع الأخصائيين', labelEn: 'All specialists' },
    { id: 'aba', labelAr: 'تحليل السلوك ABA', labelEn: 'ABA Therapy' },
    { id: 'occupational', labelAr: 'العلاج الوظيفي', labelEn: 'Occupational Therapy' },
    { id: 'speech', labelAr: 'التخاطب والنطق', labelEn: 'Speech & Language' },
    { id: 'physical', labelAr: 'العلاج الطبيعي', labelEn: 'Physical Therapy' },
    { id: 'psychology', labelAr: 'الاستشارات النفسية', labelEn: 'Child Psychology' },
  ], []);

  // Filtered & Sorted Doctors
  const filteredDoctors = useMemo(() => {
    let list = effectiveDoctors.filter((doc) => {
      // Category filter
      if (selectedCategory !== 'all' && doc.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = doc.name.toLowerCase().includes(q) || (doc.nameEn && doc.nameEn.toLowerCase().includes(q));
        const matchSpecialty = doc.specialty.toLowerCase().includes(q) || doc.specialtyCode.toLowerCase().includes(q) || doc.specialtyCodeEn.toLowerCase().includes(q);
        const matchLocation = doc.location.toLowerCase().includes(q) || doc.locationEn.toLowerCase().includes(q);
        if (!matchName && !matchSpecialty && !matchLocation) {
          return false;
        }
      }
      return true;
    });

    // Sort
    if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'experience') {
      list = [...list].sort((a, b) => b.experienceYears - a.experienceYears);
    }
    // 'earliest' default order
    return list;
  }, [doctors, selectedCategory, searchQuery, sortBy]);

  // Update scroll button states
  const updateScrollButtons = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    
    // In RTL scrollLeft can be negative or inverted depending on browser engine
    const maxScroll = scrollWidth - clientWidth;
    const currentScroll = Math.abs(scrollLeft);

    setCanScrollLeft(currentScroll > 10);
    setCanScrollRight(currentScroll < maxScroll - 10);
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [updateScrollButtons, filteredDoctors]);

  // Scroll functions
  const handleScroll = (direction: 'next' | 'prev') => {
    const el = sliderRef.current;
    if (!el) return;
    const scrollAmount = 390; // card width + gap
    
    // Account for RTL
    let delta = scrollAmount;
    if (direction === 'prev') {
      delta = -scrollAmount;
    }
    if (isArabic) {
      delta = -delta;
    }

    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  // Drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = sliderRef.current;
    if (!el) return;
    setIsDragging(true);
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
    movedDistanceRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    movedDistanceRef.current += Math.abs(walk);
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Toggle favorite
  const toggleFavorite = (e: React.MouseEvent, docId: string) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [docId]: !prev[docId] }));
  };

  // Book visit action
  const handleBook = (doctor: Doctor) => {
    if (onBookAppointment) {
      onBookAppointment(doctor);
    }
  };

  // View CV action
  const handleViewProfile = (doctor: Doctor) => {
    if (onViewCv) {
      onViewCv(doctor);
    }
  };

  return (
    <div className={`w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 ${className}`}>
      
      {/* 1. Header Top Row: Brand/Title & Subtitle on Left, Search Bar on Right */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        
        {/* Title and Subtitle */}
        <div className={`max-w-xl ${isArabic ? 'text-right' : 'text-left'}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-2 sm:mb-3">
            {isArabic ? (
              <span>
                الأخصائيون<span className="text-[#0B3B36] dark:text-[#00E5BE]">.</span>
              </span>
            ) : (
              <span>
                Specialists<span className="text-[#0B3B36] dark:text-[#00E5BE]">.</span>
              </span>
            )}
          </h2>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {isArabic 
              ? 'استكشف نخبة الأخصائيين المعتمدين، قارن المواعيد المتاحة، واحجز جلستك في دقائق.'
              : 'Explore highly rated local specialists, compare availability, and book your visit in minutes.'}
          </p>
        </div>

        {/* Pill Search Input */}
        <div className="w-full sm:w-auto min-w-0 sm:min-w-[340px] md:min-w-[380px]">
          <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-full px-3.5 sm:px-4 py-2 sm:py-2.5 shadow-xs sm:shadow-sm hover:border-slate-300 dark:hover:border-white/30 transition-all focus-within:ring-2 focus-within:ring-[#0B3B36]/20 dark:focus-within:ring-[#00E5BE]/20">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2 rtl:mr-0 rtl:ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isArabic ? 'ابحث باسم الأخصائي، التخصص، أو الفرع...' : 'Search by specialist, specialty, or branch...'}
              className="w-full bg-transparent border-none outline-hidden text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
            />
            {searchQuery ? (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 cursor-pointer font-bold"
              >
                ✕
              </button>
            ) : null}
            <button
              onClick={() => {}}
              className="shrink-0 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 sm:px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              {isArabic ? 'بحث' : 'SEARCH'}
            </button>
          </div>
        </div>

      </div>

      {/* 2. Category Filter Pills Row */}
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar pb-2 sm:pb-3 mb-6 sm:mb-8" style={{ WebkitOverflowScrolling: 'touch' }}>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all duration-200 font-bold cursor-pointer ${
                isActive
                  ? 'bg-[#0B3B36] text-white shadow-sm'
                  : 'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/15'
              }`}
            >
              {isArabic ? cat.labelAr : cat.labelEn}
            </button>
          );
        })}
      </div>

      {/* 3. Subheader Meta Row: Count on Left, Sort + Circular Arrows on Right */}
      <div className="flex items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        
        {/* Available Doctors Count */}
        <div className="flex items-center gap-1.5 text-xs sm:text-base text-slate-700 dark:text-slate-300">
          <span className="font-black text-slate-900 dark:text-white text-sm sm:text-lg">
            {filteredDoctors.length}
          </span>
          <span className="font-medium text-slate-600 dark:text-slate-400">
            {isArabic ? 'أخصائيين متاحين' : 'specialists available'}
          </span>
        </div>

        {/* Controls: Sort Dropdown + Circular Navigation Arrows */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-[#0B3B36] dark:hover:text-[#00E5BE] transition-colors cursor-pointer py-1.5 px-2 rounded-lg"
            >
              <span>
                {sortBy === 'earliest' && (isArabic ? 'الأقرب موعداً' : 'Earliest available')}
                {sortBy === 'rating' && (isArabic ? 'الأعلى تقييماً' : 'Highest rated')}
                {sortBy === 'experience' && (isArabic ? 'الأكثر خبرة' : 'Most experienced')}
              </span>
              <span className="text-xs">↓</span>
            </button>

            {isSortOpen && (
              <div className={`absolute top-full mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-2xl shadow-xl p-1.5 z-40 ${isArabic ? 'left-0' : 'right-0'}`}>
                <button
                  onClick={() => { setSortBy('earliest'); setIsSortOpen(false); }}
                  className={`w-full text-right rtl:text-right ltr:text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                    sortBy === 'earliest' ? 'bg-slate-100 dark:bg-white/10 text-[#0B3B36] dark:text-[#00E5BE]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{isArabic ? 'الأقرب موعداً' : 'Earliest available'}</span>
                  {sortBy === 'earliest' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => { setSortBy('rating'); setIsSortOpen(false); }}
                  className={`w-full text-right rtl:text-right ltr:text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                    sortBy === 'rating' ? 'bg-slate-100 dark:bg-white/10 text-[#0B3B36] dark:text-[#00E5BE]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{isArabic ? 'الأعلى تقييماً' : 'Highest rated'}</span>
                  {sortBy === 'rating' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => { setSortBy('experience'); setIsSortOpen(false); }}
                  className={`w-full text-right rtl:text-right ltr:text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                    sortBy === 'experience' ? 'bg-slate-100 dark:bg-white/10 text-[#0B3B36] dark:text-[#00E5BE]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{isArabic ? 'الأكثر خبرة' : 'Most experienced'}</span>
                  {sortBy === 'experience' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Circular Previous Button */}
          <button
            onClick={() => handleScroll('prev')}
            aria-label={isArabic ? 'الأخصائي السابق' : 'Previous specialist'}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/10 shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            {isArabic ? <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Circular Next Button */}
          <button
            onClick={() => handleScroll('next')}
            aria-label={isArabic ? 'الأخصائي التالي' : 'Next specialist'}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/10 shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            {isArabic ? <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

        </div>

      </div>

      {/* 4. Doctors Cards Slider Track */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 p-8">
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-3">
            {isArabic ? 'لم يتم العثور على أخصائيين يطابقون خيارات البحث.' : 'No specialists match your search criteria.'}
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="px-5 py-2 rounded-xl bg-[#0B3B36] text-white text-xs font-bold cursor-pointer"
          >
            {isArabic ? 'إعادة تعيين الفلاتر' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex gap-3.5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5 ${
            isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
          }`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {filteredDoctors.map((doctor) => {
            const isFav = !!favorites[doctor.id];
            
            // Dynamic custom settings from Admin Dashboard
            const custom = findCustomSettingForDoctor(doctor) || customSettings[doctor.id] || customSettings[doctor.id.replace('doc-', 'spec-')];
            const rawAvatar = custom?.avatar || doctor.avatar;
            const activeAvatar = getResolvedImageUrl(rawAvatar);
            const fitClass = custom?.displayMode === 'contain' ? 'object-contain' : 'object-cover';
            const posClass = custom?.focalPosition === 'top' ? 'object-top' : custom?.focalPosition === 'bottom' ? 'object-bottom' : 'object-center';
            const zoomScale = custom?.zoomLevel ? custom.zoomLevel / 100 : 1;
            const isTop = custom?.isTopRated !== undefined ? custom.isTopRated : doctor.isTopRated;
            const isPriceHidden = globalCardSettings.hideAllSessionPrices || !!custom?.hideSessionPrice || doctor.sessionPrice <= 0;

            return (
              <div
                key={doctor.id}
                className="w-[82vw] max-w-[325px] sm:w-[350px] md:w-[365px] lg:w-[380px] shrink-0 snap-start bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Upper Hero Image Area with Overlaid Badges */}
                <div className="relative h-52 sm:h-64 overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-white/5">
                  <img
                    src={activeAvatar}
                    alt={isArabic ? doctor.name : (doctor.nameEn || doctor.name)}
                    onError={(e) => {
                      handleImageErrorWithStore(e, rawAvatar, doctor.fallbackAvatar || doctor.avatar);
                    }}
                    className={`w-full h-full ${fitClass} ${posClass} hover:scale-105 transition-transform duration-500`}
                    style={{
                      transform: zoomScale !== 1 ? `scale(${zoomScale})` : undefined
                    }}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  {/* Top Left Badge: TOP RATED */}
                  {isTop && (
                    <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 z-10">
                      <span className="bg-white/95 dark:bg-slate-950/90 backdrop-blur-xs text-slate-900 dark:text-white text-[9px] sm:text-[10px] font-black tracking-wider px-2.5 py-0.5 sm:px-3.5 sm:py-1.5 rounded-full shadow-md uppercase">
                        {isArabic ? 'الأعلى تقييماً' : 'TOP RATED'}
                      </span>
                    </div>
                  )}

                  {/* Top Right Heart / Favorite Button */}
                  <button
                    onClick={(e) => toggleFavorite(e, doctor.id)}
                    aria-label="Save to favorites"
                    className="absolute top-2.5 sm:top-4 right-2.5 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-slate-900/90 shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer text-slate-700 dark:text-slate-200 hover:text-rose-500"
                  >
                    <Heart 
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                        isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-600 dark:text-slate-300'
                      }`} 
                    />
                  </button>
                </div>

                {/* Lower Card Body */}
                <div className="p-3.5 sm:p-6 flex flex-col justify-between flex-1">
                  
                  <div>
                    {/* Specialty Code & Rating Pill */}
                    <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
                      <span className="text-[#0D9488] dark:text-[#00E5BE] text-[10px] sm:text-[11px] font-black uppercase tracking-wider truncate">
                        {isArabic ? doctor.specialtyCode : doctor.specialtyCodeEn}
                      </span>

                      <span className="flex items-center gap-1 bg-amber-400/10 text-slate-900 dark:text-amber-300 px-2 sm:px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-black shrink-0">
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                        <span>{doctor.rating.toFixed(1)}</span>
                      </span>
                    </div>

                    {/* Doctor Name */}
                    <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug mb-1">
                      {isArabic ? doctor.name : (doctor.nameEn || doctor.name)}
                    </h3>

                    {/* Location / Branch */}
                    <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mb-3.5 sm:mb-5">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">
                        {isArabic ? doctor.location : doctor.locationEn}
                      </span>
                    </div>

                    {/* 3-Column Metrics Row */}
                    <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-white/10 rtl:divide-x-reverse py-2.5 sm:py-3.5 border-y border-slate-100 dark:border-white/10 mb-3.5 sm:mb-5 text-center">
                      <div className="px-1">
                        <span className="text-base sm:text-xl font-black text-slate-900 dark:text-white block font-sans">
                          {doctor.experienceYears}
                        </span>
                        <span className="text-[8.5px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                          {isArabic ? 'سنوات خبرة' : 'YEARS EXP.'}
                        </span>
                      </div>

                      <div className="px-1">
                        <span className="text-base sm:text-xl font-black text-slate-900 dark:text-white block font-sans">
                          {doctor.reviewCount}
                        </span>
                        <span className="text-[8.5px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                          {isArabic ? 'تقييم معتمد' : 'REVIEWS'}
                        </span>
                      </div>

                      <div className="px-1">
                        {isPriceHidden ? (
                          <>
                            <span className="text-[11px] sm:text-sm font-black text-[#0B3B36] dark:text-[#00E5BE] block font-sans truncate py-0.5">
                              {isArabic ? 'حسب التقييم' : 'Upon Consult'}
                            </span>
                            <span className="text-[8.5px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                              {isArabic ? 'خطة الجلسات' : 'SESSION PLAN'}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-base sm:text-xl font-black text-slate-900 dark:text-white block font-sans">
                              {isArabic ? `${doctor.sessionPrice} ر.س` : `$${Math.round(doctor.sessionPrice * 0.4)}`}
                            </span>
                            <span className="text-[8.5px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                              {isArabic ? 'سعر الجلسة' : 'CONSULT'}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer Row: Next Available & Book Visit Button */}
                  <div className="flex items-center justify-between gap-2 sm:gap-3 pt-1">
                    
                    {/* Next Available Info */}
                    <div className="min-w-0 flex-1">
                      <span className="text-[8.5px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {isArabic ? 'الموعد المتاح' : 'NEXT AVAILABLE'}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight mt-0.5 block truncate">
                        {isArabic ? doctor.nextSlot : doctor.nextSlotEn}
                      </span>
                    </div>

                    {/* Actions: Book Visit + Optional View Profile */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {onViewCv && (
                        <button
                          onClick={() => handleViewProfile(doctor)}
                          title={isArabic ? 'السيرة الذاتية' : 'View CV'}
                          className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-white/15 text-slate-600 dark:text-slate-300 hover:text-[#0B3B36] hover:border-[#0B3B36] transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleBook(doctor)}
                        className="bg-[#0B3B36] hover:bg-[#124d47] dark:bg-[#135d53] dark:hover:bg-[#1a776a] text-white font-bold text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                      >
                        {isArabic ? 'حجز جلسة' : 'Book visit'}
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default DoctorCardSlider;
