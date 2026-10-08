import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Sparkles, 
  Puzzle, 
  Hand, 
  Brain, 
  CheckCircle2, 
  GraduationCap, 
  Package, 
  Award, 
  Clock, 
  Users, 
  Calendar, 
  ArrowLeft, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  X, 
  Home, 
  PhoneCall, 
  MessageCircle, 
  Tag, 
  Sun, 
  ShieldCheck, 
  Zap, 
  BookOpen, 
  Heart,
  ChevronDown
} from 'lucide-react';
import { ServiceItem, TherapyPackage } from '../types';
import { CourseItem, getStoredCoursesData } from '../data/coursesData';
import { getStoredServices, getStoredPackages } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { CourseCustomIcon } from './CourseCustomIcon';
import { CourseDetailsModal } from './CourseDetailsModal';
import { TamaraLogo, EmkanLogo } from './InstallmentLogos';

interface ServicesDirectoryPageProps {
  onBackToHome: () => void;
  onSelectService: (service: ServiceItem) => void;
  onSelectPackage: (pkg: TherapyPackage) => void;
  onRegisterCourse: (course: CourseItem) => void;
}

export const ServicesDirectoryPage: React.FC<ServicesDirectoryPageProps> = ({
  onBackToHome,
  onSelectService,
  onSelectPackage,
  onRegisterCourse,
}) => {
  const { isArabic } = useLanguage();

  // Data states with persistent sync support
  const [services, setServices] = useState<ServiceItem[]>(() => getStoredServices());
  const [courses, setCourses] = useState<CourseItem[]>(() => getStoredCoursesData());
  const [packages, setPackages] = useState<TherapyPackage[]>(() => getStoredPackages());

  // Modal for course details
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<CourseItem | null>(null);

  // Favorites state
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('raba_services_page_favorites');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('raba_services_page_favorites', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Sync listener
  useEffect(() => {
    const handleServicesUpdate = () => setServices(getStoredServices());
    const handleCoursesUpdate = () => setCourses(getStoredCoursesData());
    const handlePackagesUpdate = () => setPackages(getStoredPackages());

    window.addEventListener('raba_services_updated', handleServicesUpdate);
    window.addEventListener('raba_courses_updated', handleCoursesUpdate);
    window.addEventListener('raba_packages_updated', handlePackagesUpdate);
    window.addEventListener('raba_persistent_sync_ready', handleServicesUpdate);
    window.addEventListener('raba_persistent_sync_ready', handleCoursesUpdate);
    window.addEventListener('raba_persistent_sync_ready', handlePackagesUpdate);

    return () => {
      window.removeEventListener('raba_services_updated', handleServicesUpdate);
      window.removeEventListener('raba_courses_updated', handleCoursesUpdate);
      window.removeEventListener('raba_packages_updated', handlePackagesUpdate);
      window.removeEventListener('raba_persistent_sync_ready', handleServicesUpdate);
      window.removeEventListener('raba_persistent_sync_ready', handleCoursesUpdate);
      window.removeEventListener('raba_persistent_sync_ready', handlePackagesUpdate);
    };
  }, []);

  // Filter States
  const [activeTab, setActiveTab] = useState<'all' | 'programs' | 'courses' | 'packages'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [subFilter, setSubFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'priceAsc' | 'priceDesc' | 'name'>('recommended');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Reset subfilter when switching main tab
  const handleTabChange = (tab: 'all' | 'programs' | 'courses' | 'packages') => {
    setActiveTab(tab);
    setSubFilter('all');
  };

  // Category counts
  const activeCourses = useMemo(() => courses.filter(c => c.isActive !== false), [courses]);

  // Visual helper for services
  const getServiceVisuals = (id: string) => {
    switch (id) {
      case 'srv-aba':
        return {
          colorClass: 'bg-[#F59E0B]',
          colorClassHover: 'hover:border-[#F59E0B]',
          accentBorder: 'border-[#F59E0B]/30',
          lightBg: 'bg-amber-500/10 dark:bg-amber-500/15',
          textAccent: 'text-amber-600 dark:text-amber-400',
          badgeText: isArabic ? 'تحليل السلوك التطبيقي' : 'ABA Program',
          flyerText: 'تنمية المهارات وتعزيز السلوك الإيجابي والاستقلالية',
          icon: <Puzzle className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[2.2]" />
        };
      case 'srv-speech':
        return {
          colorClass: 'bg-[#10B981]',
          colorClassHover: 'hover:border-[#10B981]',
          accentBorder: 'border-[#10B981]/30',
          lightBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
          textAccent: 'text-emerald-600 dark:text-emerald-400',
          badgeText: isArabic ? 'النطق والتخاطب' : 'Speech & Language',
          flyerText: 'تطوير مهارات اللغة والنطق والتواصل الفعال',
          icon: (
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              <circle cx="8.5" cy="12" r="1.1" fill="currentColor" />
              <circle cx="12" cy="12" r="1.1" fill="currentColor" />
              <circle cx="15.5" cy="12" r="1.1" fill="currentColor" />
            </svg>
          )
        };
      case 'srv-occupational':
        return {
          colorClass: 'bg-[#0284C7]',
          colorClassHover: 'hover:border-[#0284C7]',
          accentBorder: 'border-[#0284C7]/30',
          lightBg: 'bg-sky-500/10 dark:bg-sky-500/15',
          textAccent: 'text-sky-600 dark:text-sky-400',
          badgeText: isArabic ? 'العلاج الوظيفي' : 'Occupational Therapy',
          flyerText: 'تنمية المهارات الحركية الدقيقة والإدراكية واستقلالية اليومي',
          icon: <Hand className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[2.2]" />
        };
      case 'srv-sensory':
        return {
          colorClass: 'bg-[#84CC16]',
          colorClassHover: 'hover:border-[#84CC16]',
          accentBorder: 'border-[#84CC16]/30',
          lightBg: 'bg-lime-500/10 dark:bg-lime-500/15',
          textAccent: 'text-lime-700 dark:text-lime-400',
          badgeText: isArabic ? 'التكامل الحسي' : 'Sensory Integration',
          flyerText: 'دعم تنظيم ومعالجة الاستجابات الحسية والبيئية',
          icon: <Brain className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[2.2]" />
        };
      case 'srv-learning-difficulties':
        return {
          colorClass: 'bg-[#1E40AF]',
          colorClassHover: 'hover:border-[#1E40AF]',
          accentBorder: 'border-[#1E40AF]/30',
          lightBg: 'bg-blue-500/10 dark:bg-blue-500/15',
          textAccent: 'text-blue-700 dark:text-blue-400',
          badgeText: isArabic ? 'صعوبات التعلم والواجبات' : 'Learning Support',
          flyerText: 'تنمية المهارات الأكاديمية ودعم استقلالية الطفل في حل الواجبات',
          icon: (
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h8" />
              <path d="M6 10h8" />
              <path d="M6 14h5" />
              <path d="m18 11 2.5 2.5-5 5h-2.5v-2.5l5-5z" fill="currentColor" fillOpacity="0.25" />
            </svg>
          )
        };
      case 'srv-psychological':
        return {
          colorClass: 'bg-[#DB2777]',
          colorClassHover: 'hover:border-[#DB2777]',
          accentBorder: 'border-[#DB2777]/30',
          lightBg: 'bg-pink-500/10 dark:bg-pink-500/15',
          textAccent: 'text-pink-600 dark:text-pink-400',
          badgeText: isArabic ? 'التشخيص والعلاج النفسي' : 'Psychological Care',
          flyerText: 'تقييم وتشخيص وتدخلات نفسية وسلوكية وفق احتياج الحالة',
          icon: (
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a7.5 7.5 0 0 0-7.5 7.5c0 2.8 1.5 5.3 3.8 6.5.3.6.6 1.4 1 2V22h5.4v-4c.4-.6.7-1.4 1-2 2.3-1.2 3.8-3.7 3.8-6.5A7.5 7.5 0 0 0 12 2Z" />
              <path d="M12 8.2c-.8-1-2.2-.8-2.6.3-.5 1.2.7 2.2 2.6 3.5 1.9-1.3 3.1-2.3 2.6-3.5-.4-1.1-1.8-1.3-2.6-.3Z" fill="currentColor" />
            </svg>
          )
        };
      default:
        return {
          colorClass: 'bg-[#0B3B36]',
          colorClassHover: 'hover:border-[#0B3B36]',
          accentBorder: 'border-[#0B3B36]/30',
          lightBg: 'bg-teal-500/10 dark:bg-teal-500/15',
          textAccent: 'text-teal-600 dark:text-teal-400',
          badgeText: isArabic ? 'برنامج تأهيلي معتمد' : 'Rehab Program',
          flyerText: 'برنامج علاجي مخصص مصمم لتحقيق التطور الأمثل',
          icon: <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[2.2]" />
        };
    }
  };

  // Filtering Logic
  const filteredServices = useMemo(() => {
    let result = services;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(s => 
        (s.title && s.title.toLowerCase().includes(q)) ||
        (s.titleEn && s.titleEn.toLowerCase().includes(q)) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        (s.categoryAr && s.categoryAr.toLowerCase().includes(q))
      );
    }
    if (subFilter !== 'all' && (activeTab === 'programs' || activeTab === 'all')) {
      result = result.filter(s => s.category === subFilter);
    }
    return result;
  }, [services, searchQuery, subFilter, activeTab]);

  const filteredCourses = useMemo(() => {
    let result = activeCourses;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(c => 
        (c.titleAr && c.titleAr.toLowerCase().includes(q)) ||
        (c.titleEn && c.titleEn.toLowerCase().includes(q)) ||
        (c.descriptionAr && c.descriptionAr.toLowerCase().includes(q)) ||
        (c.categoryAr && c.categoryAr.toLowerCase().includes(q)) ||
        (c.ribbonTagAr && c.ribbonTagAr.toLowerCase().includes(q))
      );
    }
    if (subFilter !== 'all' && activeTab === 'courses') {
      result = result.filter(c => {
        if (subFilter === 'qba') return c.id === 'course-qba' || c.titleAr.includes('QBA');
        if (subFilter === 'abat') return c.id === 'course-abat' || c.titleAr.includes('ABAT');
        if (subFilter === 'cas') return c.id === 'course-cas' || c.titleAr.includes('CAS') || c.categoryAr.includes('توحد');
        if (subFilter === 'parents') return c.targetAudienceAr?.includes('أسر') || c.categoryAr.includes('أسر');
        return true;
      });
    }
    return result;
  }, [activeCourses, searchQuery, subFilter, activeTab]);

  const filteredPackages = useMemo(() => {
    let result = packages;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
        (p.tagline && p.tagline.toLowerCase().includes(q)) ||
        (p.features && p.features.some(f => f.toLowerCase().includes(q)))
      );
    }
    if (subFilter !== 'all' && (activeTab === 'packages' || activeTab === 'all')) {
      result = result.filter(p => p.category === subFilter);
    }
    return result;
  }, [packages, searchQuery, subFilter, activeTab]);

  // Overall results count
  const totalResultsCount = useMemo(() => {
    let count = 0;
    if (activeTab === 'all' || activeTab === 'programs') count += filteredServices.length;
    if (activeTab === 'all' || activeTab === 'courses') count += filteredCourses.length;
    if (activeTab === 'all' || activeTab === 'packages') count += filteredPackages.length;
    return count;
  }, [activeTab, filteredServices, filteredCourses, filteredPackages]);

  // WhatsApp quick link
  const openWhatsAppInquiry = (itemTitle: string) => {
    const msg = encodeURIComponent(`السلام عليكم، أود الاستفسار والتفاصيل حول «${itemTitle}» بمركز رابا لتأهيل الطفل.`);
    window.open(`https://wa.me/966575100100?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#061412] text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-28 md:pb-16" dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* 1. TOP HERO & BREADCRUMBS BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0B3B36] via-[#092e2a] to-[#071D18] text-white pt-8 pb-14 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-teal-500/20 shadow-lg">
        
        {/* Ambient background glow & soft grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#00E5BE_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-[#00E5BE]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-4 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Breadcrumb Navigation Bar */}
          <div className="flex items-center justify-between gap-4 mb-6 text-xs font-bold text-teal-200/80">
            <div className="flex items-center gap-2">
              <button
                onClick={onBackToHome}
                className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer group"
              >
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{isArabic ? 'الرئيسية' : 'Home'}</span>
              </button>
              <span className="text-teal-400/50">/</span>
              <span className="text-[#00E5BE] font-black">{isArabic ? 'دليل الخدمات الشامل' : 'Services Directory'}</span>
            </div>

            {/* Back to Home Button */}
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black transition-all cursor-pointer backdrop-blur-md border border-white/15"
            >
              {isArabic ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{isArabic ? 'العودة للرئيسية' : 'Back to Home'}</span>
            </button>
          </div>

          {/* Hero Title & Description */}
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00E5BE]/15 border border-[#00E5BE]/30 text-[#00E5BE] text-xs font-black mb-3.5 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isArabic ? 'الدليل المعتمد للبرامج والكورسات والباقات' : 'Certified Directory & Care Packages'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              {isArabic ? (
                <>
                  خدمات مركز رابا <span className="bg-gradient-to-r from-[#00E5BE] via-teal-300 to-sky-400 bg-clip-text text-transparent">التأهيلية والتدريبية</span>
                </>
              ) : (
                <>
                  Raba Center <span className="bg-gradient-to-r from-[#00E5BE] via-teal-300 to-sky-400 bg-clip-text text-transparent">Services & Programs</span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed font-medium">
              {isArabic 
                ? 'استكشف كافة برامج التأهيل المتخصصة (ABA، التخاطب، الوظيفي، الحسي، صعوبات التعلم)، والدورات التدريبية المعتمدة دولياً، وباقات الرعاية الشاملة مع خيارات تقسيط ميسرة.'
                : 'Explore all specialized rehabilitation programs, internationally certified training courses, and all-inclusive care packages with transparent pricing.'}
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <Puzzle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">{services.length}+</div>
                <div className="text-[11px] font-bold text-teal-200/80">{isArabic ? 'برامج تأهيل تخصصية' : 'Rehab Programs'}</div>
              </div>
            </div>

            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00E5BE]/20 text-[#00E5BE] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">{activeCourses.length}</div>
                <div className="text-[11px] font-bold text-teal-200/80">{isArabic ? 'كورسات وبوردات دولية' : 'Certified Courses'}</div>
              </div>
            </div>

            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">{packages.length}</div>
                <div className="text-[11px] font-bold text-teal-200/80">{isArabic ? 'باقات رعاية وأسعار' : 'Care Packages'}</div>
              </div>
            </div>

            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                <div className="text-[11px] font-bold text-teal-200/80">{isArabic ? 'معتمدة وترخيص رسمي' : 'Accredited Care'}</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. STICKY CONTROLS & FILTER BAR */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-[#071D18]/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-xs py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3.5">
          
          {/* Top Row: Search Input + Sort Dropdown */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input Box */}
            <div className="relative flex-1 max-w-xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isArabic ? 'ابحث عن برنامج، كورس، باقة، أو تخصص...' : 'Search programs, courses, packages, or specialties...'}
                className={`w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00E5BE] transition-all ${
                  isArabic ? 'pr-10 pl-10' : 'pl-10 pr-10'
                }`}
              />
              <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3.5' : 'left-3.5'}`} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'left-3.5' : 'right-3.5'} p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-colors cursor-pointer`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Right Controls: Sort Dropdown & Clear */}
            <div className="flex items-center gap-2 shrink-0 justify-end">
              
              {/* Sort Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#0B3B36] dark:text-[#00E5BE]" />
                  <span>
                    {sortBy === 'recommended' && (isArabic ? 'الترتيب: الموصى به' : 'Sort: Recommended')}
                    {sortBy === 'name' && (isArabic ? 'أبجدياً (أ-ي)' : 'Alphabetical')}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isSortOpen && (
                  <div className={`absolute top-full mt-1.5 ${isArabic ? 'left-0' : 'right-0'} w-44 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150`}>
                    {[
                      { id: 'recommended', labelAr: 'الموصى به (الأولوية)', labelEn: 'Recommended' },
                      { id: 'name', labelAr: 'أبجدياً (أ-ي)', labelEn: 'Alphabetical' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSortBy(opt.id as any);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-right px-4 py-2 text-xs font-bold flex items-center justify-between hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer ${
                          sortBy === opt.id ? 'text-[#0B3B36] dark:text-[#00E5BE] bg-slate-50 dark:bg-white/5' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{isArabic ? opt.labelAr : opt.labelEn}</span>
                        {sortBy === opt.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {(searchQuery || subFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSubFilter('all');
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'مسح الفلاتر' : 'Reset'}</span>
                </button>
              )}

            </div>

          </div>

          {/* Main Section Filter Tabs (الكل · برامج التأهيل · الكورسات والدورات · الباقات والأسعار) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', labelAr: 'الكل (جميع الأقسام)', labelEn: 'All Services & Plans', icon: Sparkles, count: services.length + activeCourses.length + packages.length },
              { id: 'programs', labelAr: 'برامج التأهيل', labelEn: 'Rehab Programs', icon: Puzzle, count: services.length },
              { id: 'courses', labelAr: 'الكورسات والدورات', labelEn: 'Courses & Workshops', icon: GraduationCap, count: activeCourses.length },
              { id: 'packages', labelAr: 'الباقات والأسعار', labelEn: 'Packages & Pricing', icon: Package, count: packages.length },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as any)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0B3B36] via-[#0D4D46] to-[#00E5BE] text-white border-transparent shadow-md shadow-teal-950/20 scale-[1.02]'
                      : 'bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                  }`}
                >
                  <TabIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{isArabic ? tab.labelAr : tab.labelEn}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Contextual Sub-Filters Row based on active tab */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
            {activeTab === 'programs' && [
              { id: 'all', labelAr: 'جميع برامج التأهيل', labelEn: 'All Programs' },
              { id: 'aba', labelAr: 'تحليل السلوك التطبيقي ABA', labelEn: 'ABA Therapy' },
              { id: 'speech', labelAr: 'النطق والتخاطب', labelEn: 'Speech & Language' },
              { id: 'occupational', labelAr: 'العلاج الوظيفي', labelEn: 'Occupational Therapy' },
              { id: 'sensory', labelAr: 'التكامل الحسي', labelEn: 'Sensory Integration' },
              { id: 'learning', labelAr: 'صعوبات التعلم والواجبات', labelEn: 'Learning Support' },
              { id: 'psychological', labelAr: 'التشخيص والعلاج النفسي', labelEn: 'Psychological Care' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSubFilter(f.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  subFilter === f.id
                    ? 'bg-[#0B3B36] text-white dark:bg-[#00E5BE] dark:text-slate-950 font-black shadow-xs'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {isArabic ? f.labelAr : f.labelEn}
              </button>
            ))}

            {activeTab === 'courses' && [
              { id: 'all', labelAr: 'جميع الدورات التدريبية', labelEn: 'All Courses' },
              { id: 'qba', labelAr: 'محلل سلوكي مؤهل QBA', labelEn: 'QBA Course' },
              { id: 'abat', labelAr: 'فني سلوك تطبيقي معتمد ABAT', labelEn: 'ABAT Course' },
              { id: 'cas', labelAr: 'أخصائي توحد معتمد CAS', labelEn: 'Autism Specialist' },
              { id: 'parents', labelAr: 'برامج أولياء الأمور والأسرة', labelEn: 'Parent Training' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSubFilter(f.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  subFilter === f.id
                    ? 'bg-[#0B3B36] text-white dark:bg-[#00E5BE] dark:text-slate-950 font-black shadow-xs'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {isArabic ? f.labelAr : f.labelEn}
              </button>
            ))}

            {activeTab === 'packages' && [
              { id: 'all', labelAr: 'جميع الباقات', labelEn: 'All Packages' },
              { id: 'summer', labelAr: 'باقات الصيف ☀️', labelEn: 'Summer Packages' },
              { id: 'assessment', labelAr: 'التقييم والتشخيص', labelEn: 'Assessment & Diagnosis' },
              { id: 'aba', labelAr: 'باقات ABA المكثفة', labelEn: 'ABA Packages' },
              { id: 'speech', labelAr: 'النطق والتخاطب', labelEn: 'Speech Packages' },
              { id: 'sensory', labelAr: 'العلاج الوظيفي والحسي', labelEn: 'Sensory & OT' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSubFilter(f.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  subFilter === f.id
                    ? 'bg-[#0B3B36] text-white dark:bg-[#00E5BE] dark:text-slate-950 font-black shadow-xs'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {isArabic ? f.labelAr : f.labelEn}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 3. MAIN CONTENT: ORGANIZED GRID LAYOUT (آلية عرض شبكة متقنة) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Results Counter Header */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <div className="font-bold flex items-center gap-2">
            <span>{isArabic ? 'يتم عرض' : 'Showing'}</span>
            <span className="text-[#0B3B36] dark:text-[#00E5BE] font-black text-base">{totalResultsCount}</span>
            <span>{isArabic ? 'عنصر في الدليل' : 'items'}</span>
          </div>

          <div className="text-xs font-semibold text-slate-400">
            {isArabic ? 'عرض شبكة منظم ومباشر' : 'Structured Grid View'}
          </div>
        </div>

        {/* Empty State */}
        {totalResultsCount === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 p-12 text-center max-w-lg mx-auto shadow-sm my-10">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#0B3B36] dark:text-[#00E5BE] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
              {isArabic ? 'لم نتمكن من العثور على نتائج تطابق بحثك' : 'No items match your search criteria'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              {isArabic ? 'جرب البحث بكلمات أخرى أو قم بإعادة ضبط خيارات الفلترة لعرض كافة الخدمات والبرامج.' : 'Try adjusting your search terms or reset the filters.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSubFilter('all');
                setActiveTab('all');
              }}
              className="px-6 py-2.5 rounded-xl bg-[#0B3B36] hover:bg-[#0D4D46] text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              {isArabic ? 'إعادة ضبط خيارات الفلترة' : 'Reset Filters'}
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PART 1: REHABILITATION PROGRAMS GRID (برامج التأهيل التخصصية)            */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'programs') && filteredServices.length > 0 && (
          <section className="mb-14">
            
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Puzzle className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {isArabic ? 'برامج التأهيل التخصصية' : 'Rehabilitation Programs'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isArabic ? 'جلسات وخطط تدخل علاجية معتمدة وفق أحدث المقاييس الإكلينيكية' : 'Clinical intervention and developmental therapy plans'}
                  </p>
                </div>
              </div>

              <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                {filteredServices.length} {isArabic ? 'برامج' : 'programs'}
              </span>
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => {
                const visual = getServiceVisuals(service.id);
                const isFav = !!favorites[service.id];

                return (
                  <div
                    key={service.id}
                    className={`bg-white dark:bg-slate-900 rounded-[28px] overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${visual.colorClassHover}`}
                  >
                    {/* Top Slim Accent Strip in Service Brand Color */}
                    <div className={`h-2 w-full ${visual.colorClass}`} />

                    {/* Header: Custom Vector Icon Container (Zero Photography) */}
                    <div className={`p-6 pb-5 ${visual.lightBg} border-b ${visual.accentBorder} relative transition-colors`}>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${visual.colorClass} text-white shadow-xs`}>
                          {visual.badgeText || (isArabic ? service.categoryAr : service.categoryEn)}
                        </span>

                        <button
                          onClick={(e) => toggleFavorite(service.id, e)}
                          aria-label={isFav ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                          className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-xs flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 transition-all ${isFav ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${visual.colorClass} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0`}>
                          {visual.icon}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-[#0B3B36] dark:group-hover:text-[#00E5BE] transition-colors">
                            {isArabic ? service.title : (service.titleEn || service.title)}
                          </h3>
                          {service.titleEn && isArabic && (
                            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block mt-0.5" dir="ltr">
                              {service.titleEn}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 pt-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3.5">
                        
                        {/* Clinical Purpose Highlight Box */}
                        <div className={`p-3 rounded-2xl ${visual.lightBg} border ${visual.accentBorder}`}>
                          <p className={`text-xs sm:text-sm font-bold ${visual.textAccent} leading-relaxed`}>
                            {isArabic ? (visual.flyerText || service.description) : (service.descriptionEn || service.description)}
                          </p>
                        </div>

                        {/* Key Clinical Outcomes Checklist */}
                        <div className="space-y-2 pt-1">
                          <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
                            {isArabic ? 'أبرز مخرجات البرنامج:' : 'Key Outcomes:'}
                          </span>
                          {(isArabic ? service.benefits : (service.benefitsEn || service.benefits)).slice(0, 3).map((benefit, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                              <Check className="w-4 h-4 text-emerald-600 dark:text-[#00E5BE] shrink-0 mt-0.5 stroke-[2.5]" />
                              <span className="line-clamp-2 leading-relaxed">{benefit}</span>
                            </div>
                          ))}
                        </div>

                        {/* Target Age Metadata */}
                        <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <Users className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>{isArabic ? service.targetAges : (service.targetAgesEn || service.targetAges)}</span>
                        </div>

                        {/* Price metadata if configured */}
                        {(service.sessionPrice || service.assessmentPrice || service.priceDisplayAr) && (
                          <div className="p-2.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-800/30 flex items-center justify-between text-xs">
                            <span className="font-bold text-teal-800 dark:text-teal-200">
                              {service.sessionPrice ? (isArabic ? 'سعر الجلسة العلاجية:' : 'Session Rate:') : (isArabic ? 'التقييم الأولي:' : 'Evaluation:')}
                            </span>
                            <span className="font-black text-[#0B3B36] dark:text-[#00E5BE]">
                              {service.sessionPrice ? `${service.sessionPrice} ${isArabic ? 'ر.س' : 'SAR'}` : (service.priceDisplayAr || `${service.assessmentPrice} ${isArabic ? 'ر.س' : 'SAR'}`)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-2">
                        <button
                          onClick={() => onSelectService(service)}
                          className={`w-full py-3 px-4 ${visual.colorClass} hover:brightness-105 text-white font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm active:scale-95`}
                        >
                          <Calendar className="w-4 h-4" />
                          <span>{isArabic ? 'احجز تقييم البرنامج' : 'Book Evaluation Session'}</span>
                          {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => openWhatsAppInquiry(service.title)}
                          className="w-full py-2.5 px-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{isArabic ? 'استفسار عبر واتساب' : 'Inquire via WhatsApp'}</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* PART 2: COURSES & WORKSHOPS GRID (الكورسات والدورات التدريبية)            */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'courses') && filteredCourses.length > 0 && (
          <section className="mb-14">
            
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-[#00E5BE] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {isArabic ? 'الكورسات والدورات التدريبية المعتمدة' : 'Accredited Training Courses'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isArabic ? 'برامج مهنية معتمدة من البورد الدولي QABA وIBCCES للمتخصصين والأسر' : 'International board certified qualifications for practitioners and families'}
                  </p>
                </div>
              </div>

              <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                {filteredCourses.length} {isArabic ? 'دورات' : 'courses'}
              </span>
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const isFav = !!favorites[course.id];
                const title = isArabic ? course.titleAr : course.titleEn;
                const ribbon = isArabic ? course.ribbonTagAr : course.ribbonTagEn;
                const hoursBadge = isArabic ? course.hoursBadgeAr : course.hoursBadgeEn;
                const price = isArabic ? course.priceDisplayAr : course.priceDisplayEn;

                return (
                  <div
                    key={course.id}
                    className="bg-white dark:bg-slate-900 rounded-[28px] overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-[#00E5BE]/40"
                  >
                    {/* Top Slim Accent Strip in Course Accent Color */}
                    <div className="h-2 w-full bg-gradient-to-r from-[#0B3B36] to-[#00E5BE]" />

                    {/* Header */}
                    <div className="p-6 pb-5 bg-teal-500/5 dark:bg-teal-950/20 border-b border-teal-500/15 relative">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-[#0B3B36] dark:bg-[#00E5BE] text-white dark:text-slate-950 shadow-xs">
                          {ribbon}
                        </span>

                        <button
                          onClick={(e) => toggleFavorite(course.id, e)}
                          aria-label={isFav ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                          className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-xs flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 transition-all ${isFav ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#0B3B36] to-[#0f766e] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                          <CourseCustomIcon iconName={course.iconName || 'award'} className="w-7 h-7 sm:w-8 sm:h-8" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-[#0B3B36] dark:group-hover:text-[#00E5BE] transition-colors">
                            {title}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-teal-700 dark:text-[#00E5BE]">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{hoursBadge}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 pt-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3.5">
                        
                        {/* Course Overview */}
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                          {isArabic ? course.descriptionAr : course.descriptionEn}
                        </p>

                        {/* Key Syllabus Outcomes */}
                        <div className="space-y-2 pt-1">
                          <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
                            {isArabic ? 'محاور ومخرجات الدورة:' : 'Key Syllabus:'}
                          </span>
                          {(isArabic ? course.featuresAr : course.featuresEn).slice(0, 3).map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-[#00E5BE] shrink-0 mt-0.5" />
                              <span className="line-clamp-2 leading-relaxed">{feat}</span>
                            </div>
                          ))}
                        </div>

                        {/* Audience Info */}
                        {course.targetAudienceAr && (
                          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                            <span className="font-bold text-slate-700 dark:text-slate-300">{isArabic ? 'الفئة المستهدفة: ' : 'Audience: '}</span>
                            {isArabic ? course.targetAudienceAr : course.targetAudienceEn}
                          </div>
                        )}
                      </div>

                      {/* Pricing & Registration */}
                      <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400">{isArabic ? 'رسوم الدورة:' : 'Tuition:'}</span>
                          <span className="text-lg font-black text-[#0B3B36] dark:text-[#00E5BE]">{price}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSelectedCourseForDetails(course)}
                            className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-black text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-[#00E5BE]" />
                            <span>{isArabic ? 'تفاصيل الدورة' : 'Details'}</span>
                          </button>

                          <button
                            onClick={() => onRegisterCourse(course)}
                            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#0B3B36] to-[#0f766e] hover:brightness-110 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                          >
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>{isArabic ? 'سجل بالدورة' : 'Register'}</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* PART 3: PACKAGES & PRICING GRID (الباقات والأسعار)                        */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'packages') && filteredPackages.length > 0 && (
          <section className="mb-14">
            
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <Package className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {isArabic ? 'باقات التأهيل والأسعار' : 'Therapy Packages & Pricing'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isArabic ? 'باقات رعاية متكاملة ومصممة بعناية مع شفافية في الأسعار وتقسيط بدون فوائد' : 'All-inclusive bundled care plans with interest-free installment support'}
                  </p>
                </div>
              </div>

              <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                {filteredPackages.length} {isArabic ? 'باقات' : 'packages'}
              </span>
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => {
                const isSummer = pkg.isSummer || pkg.category === 'summer';
                const isFav = !!favorites[pkg.id];
                const savings = pkg.originalPrice ? pkg.originalPrice - pkg.price : 0;

                return (
                  <div
                    key={pkg.id}
                    className={`bg-white dark:bg-slate-900 rounded-[28px] overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${
                      isSummer
                        ? 'border-amber-200 dark:border-amber-500/30 ring-1 ring-amber-400/20'
                        : 'border-slate-200/90 dark:border-white/10'
                    }`}
                  >
                    {/* Top Slim Strip */}
                    <div className={`h-2 w-full ${isSummer ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-[#0B3B36] to-[#0284C7]'}`} />

                    {/* Header */}
                    <div className={`p-6 pb-5 ${isSummer ? 'bg-amber-500/10 dark:bg-amber-950/20 border-amber-300/20' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/50 dark:border-white/5'} border-b relative`}>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isSummer && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black shadow-xs">
                              <Sun className="w-3.5 h-3.5" />
                              <span>{isArabic ? 'باقة الصيف' : 'Summer'}</span>
                            </span>
                          )}
                          {pkg.popular && (
                            <span className="px-2.5 py-1 rounded-full bg-[#0B3B36] text-white text-[10px] font-black tracking-wider uppercase">
                              {isArabic ? 'الأكثر طلباً' : 'POPULAR'}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => toggleFavorite(pkg.id, e)}
                          aria-label={isFav ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                          className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-xs flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 transition-all ${isFav ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                        </button>
                      </div>

                      <span className="text-[11px] font-black text-teal-700 dark:text-[#00E5BE] tracking-widest uppercase block mb-1">
                        {isArabic ? (pkg.categoryCode || 'باقة تأهيلية متكاملة') : (pkg.categoryCodeEn || 'CARE PLAN')}
                      </span>

                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                        {isArabic ? pkg.name : (pkg.nameEn || pkg.name)}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 font-medium">
                        {isArabic ? pkg.tagline : (pkg.taglineEn || pkg.tagline)}
                      </p>
                    </div>

                    {/* Body */}
                    <div className="p-6 pt-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3.5">
                        
                        {/* Plan Duration & Sessions */}
                        <div className="flex items-center gap-2 p-3 rounded-2xl bg-teal-500/10 dark:bg-teal-950/20 text-xs font-black text-teal-800 dark:text-teal-200">
                          <Clock className="w-4 h-4 text-[#0B3B36] dark:text-[#00E5BE] shrink-0" />
                          <span>
                            {isArabic 
                              ? `${pkg.sessionsCount} جلسة علاجية وتأهيلية مكثفة · ${pkg.durationWeeks} أسابيع`
                              : `${pkg.sessionsCount} Clinical Sessions · ${pkg.durationWeeks} Weeks`}
                          </span>
                        </div>

                        {/* Features Checklist */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
                            {isArabic ? 'مميزات ومشتملات الباقة:' : 'Package Inclusions:'}
                          </span>
                          {(isArabic ? pkg.features : (pkg.featuresEn || pkg.features)).slice(0, 4).map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                              <Check className="w-4 h-4 text-emerald-600 dark:text-[#00E5BE] shrink-0 mt-0.5 stroke-[2.5]" />
                              <span className="leading-relaxed">{feat}</span>
                            </div>
                          ))}
                        </div>

                        {/* Installment Logos */}
                        <div className="pt-2 flex items-center gap-2 flex-wrap text-slate-400 text-xs">
                          <span className="text-[11px] font-bold text-slate-500">{isArabic ? 'تقسيط عبر:' : 'Installments:'}</span>
                          <TamaraLogo height={22} />
                          <EmkanLogo height={22} />
                        </div>
                      </div>

                      {/* Pricing Section & Action Button */}
                      <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-3">
                        <div className="flex items-end justify-between">
                          <div>
                            {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs text-slate-400 line-through font-bold">
                                  {pkg.originalPrice} {isArabic ? 'ر.س' : 'SAR'}
                                </span>
                                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                  {isArabic ? `وفر ${savings} ر.س` : `Save ${savings} SAR`}
                                </span>
                              </div>
                            )}
                            <div className="text-2xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
                              <span>{pkg.price}</span>
                              <span className="text-xs font-bold text-slate-500">{isArabic ? 'ر.س' : 'SAR'}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => onSelectPackage(pkg)}
                            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-[#0B3B36] to-[#0f766e] hover:brightness-110 active:scale-95 text-white text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-md shadow-teal-950/20 transition-all cursor-pointer"
                          >
                            <span>{isArabic ? 'حجز الباقة' : 'Book Package'}</span>
                            {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 4. BOTTOM GUIDANCE & TRIAGE BANNER */}
        <div className="mt-16 bg-gradient-to-br from-[#0B3B36] via-[#092e2a] to-[#071D18] text-white rounded-3xl p-8 sm:p-10 border border-teal-500/20 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 max-w-xl text-center md:text-right">
            <span className="text-[#00E5BE] text-xs font-black tracking-widest uppercase block mb-1">
              {isArabic ? 'استشارة إرشادية متخصصة' : 'Need Expert Guidance?'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
              {isArabic ? 'هل تحتاج مساعدة في اختيار البرنامج أو الباقة المناسبة؟' : 'Not sure which program or package fits best?'}
            </h3>
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed font-medium">
              {isArabic 
                ? 'فريقنا الاستشاري متواجد للإجابة على كافة تساؤلاتكم ومساعدتكم في اختيار المسار التأهيلي الأنسب لاحتياجات طفلكم.'
                : 'Our clinical triage specialists are available to answer your questions and recommend the ideal care path.'}
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 flex-wrap justify-center shrink-0">
            <button
              onClick={() => {
                const msg = encodeURIComponent('السلام عليكم، أود استشارة توجيهية لاختيار البرنامج أو الباقة الأنسب لطفلي');
                window.open(`https://wa.me/966575100100?text=${msg}`, '_blank', 'noopener,noreferrer');
              }}
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isArabic ? 'محادثة عبر واتساب' : 'WhatsApp Consultation'}</span>
            </button>

            <button
              onClick={onBackToHome}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs sm:text-sm flex items-center gap-2 border border-white/15 transition-all cursor-pointer"
            >
              <span>{isArabic ? 'استكشاف الأخصائيين' : 'Explore Specialists'}</span>
              {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </div>

      {/* Course Details Modal */}
      <CourseDetailsModal
        course={selectedCourseForDetails}
        isOpen={!!selectedCourseForDetails}
        onClose={() => setSelectedCourseForDetails(null)}
        onRegister={onRegisterCourse}
      />

    </div>
  );
};

export default ServicesDirectoryPage;
