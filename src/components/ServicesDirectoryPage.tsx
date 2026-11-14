import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
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
  MessageCircle, 
  Sun, 
  ShieldCheck, 
  BookOpen, 
  Heart,
  ChevronDown,
  RotateCcw
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
  onOpenSpecialistsPage?: () => void;
}

export const ServicesDirectoryPage: React.FC<ServicesDirectoryPageProps> = ({
  onBackToHome,
  onSelectService,
  onSelectPackage,
  onRegisterCourse,
  onOpenSpecialistsPage,
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

  // Top Global Search & Tab Filters
  const [activeTab, setActiveTab] = useState<'all' | 'programs' | 'courses' | 'packages'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'priceAsc' | 'priceDesc' | 'name'>('recommended');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Scroll direction detection: Auto-hide controls bar on scroll down, reveal on scroll up
  const [isControlsBarVisible, setIsControlsBarVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY || document.documentElement.scrollTop;
          const diff = currentScrollY - lastScrollYRef.current;

          // Always visible near top of the page
          if (currentScrollY < 90) {
            setIsControlsBarVisible(true);
          } else if (diff > 8) {
            // Scrolling DOWN -> hide controls bar to give user full unhindered view
            setIsControlsBarVisible(false);
            setIsSortOpen(false);
          } else if (diff < -8) {
            // Scrolling UP -> reveal controls bar smoothly
            setIsControlsBarVisible(true);
          }

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Default view mode per section:
  // On Mobile (< 768px): 'slider'
  // On Desktop (>= 768px): 'grid'
  const getInitialViewMode = (): 'slider' | 'grid' => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 'slider' : 'grid';
    }
    return 'grid';
  };

  const [programsViewMode, setProgramsViewMode] = useState<'slider' | 'grid'>(getInitialViewMode);
  const [coursesViewMode, setCoursesViewMode] = useState<'slider' | 'grid'>(getInitialViewMode);
  const [packagesViewMode, setPackagesViewMode] = useState<'slider' | 'grid'>(getInitialViewMode);

  // Dedicated filter for each part (كل جزء يشمل فلتر مخصص له)
  const [programsFilter, setProgramsFilter] = useState<string>('all');
  const [coursesFilter, setCoursesFilter] = useState<string>('all');
  const [packagesFilter, setPackagesFilter] = useState<string>('all');

  // Slider refs for horizontal scrolling
  const programsSliderRef = useRef<HTMLDivElement>(null);
  const coursesSliderRef = useRef<HTMLDivElement>(null);
  const packagesSliderRef = useRef<HTMLDivElement>(null);

  // Scroll function for sliders with RTL support
  const handleScrollSlider = (ref: React.RefObject<HTMLDivElement | null>, direction: 'prev' | 'next') => {
    const el = ref.current;
    if (!el) return;
    const cardStep = typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.85, 360) : 320;
    // In RTL, moving forward ('next') scrolls leftwards (negative), 'prev' scrolls rightwards (positive)
    const offset = isArabic 
      ? (direction === 'next' ? -cardStep : cardStep)
      : (direction === 'next' ? cardStep : -cardStep);
    el.scrollBy({ left: offset, behavior: 'smooth' });
  };

  // Active courses list
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

  // 1. FILTERING REHAB PROGRAMS (برامج التأهيل)
  const filteredServices = useMemo(() => {
    let result = services;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(s => 
        (s.title && s.title.toLowerCase().includes(q)) ||
        (s.titleEn && s.titleEn.toLowerCase().includes(q)) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        (s.categoryAr && s.categoryAr.toLowerCase().includes(q))
      );
    }

    // Dedicated filter for Programs
    if (programsFilter !== 'all') {
      result = result.filter(s => {
        if (programsFilter === 'aba') return s.category === 'aba' || s.id === 'srv-aba';
        if (programsFilter === 'speech') return s.category === 'speech' || s.id === 'srv-speech';
        if (programsFilter === 'occupational') return s.category === 'occupational' || s.id === 'srv-occupational';
        if (programsFilter === 'sensory') return s.category === 'sensory' || s.id === 'srv-sensory';
        if (programsFilter === 'learning') return s.category === 'learning' || s.id === 'srv-learning-difficulties';
        if (programsFilter === 'psychological') return s.category === 'psychological' || s.id === 'srv-psychological';
        return s.category === programsFilter;
      });
    }

    return result;
  }, [services, searchQuery, programsFilter]);

  // 2. FILTERING COURSES (الكورسات والدورات)
  const filteredCourses = useMemo(() => {
    let result = activeCourses;

    // Search filter
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

    // Dedicated filter for Courses
    if (coursesFilter !== 'all') {
      result = result.filter(c => {
        if (coursesFilter === 'cas') return c.id === 'course-autism-inclusion' || c.categoryAr?.includes('توحد') || c.titleAr.includes('توحد');
        if (coursesFilter === 'qasp') return c.id === 'course-qasp-s' || c.id === 'course-qba' || c.id === 'course-abat' || c.categoryAr?.includes('إشراف') || c.titleAr.includes('QASP') || c.titleAr.includes('QBA') || c.titleAr.includes('ABAT');
        if (coursesFilter === 'communication') return c.id === 'course-mand-training' || c.categoryAr?.includes('تواصل') || c.titleAr.includes('Mand');
        if (coursesFilter === 'parents') return c.targetAudienceAr?.includes('أسر') || c.categoryAr?.includes('أسر') || c.targetAudienceAr?.includes('أولياء');
        return true;
      });
    }

    return result;
  }, [activeCourses, searchQuery, coursesFilter]);

  // 3. FILTERING PACKAGES (الباقات والأسعار)
  const filteredPackages = useMemo(() => {
    let result = packages;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
        (p.tagline && p.tagline.toLowerCase().includes(q)) ||
        (p.features && p.features.some(f => f.toLowerCase().includes(q)))
      );
    }

    // Dedicated filter for Packages
    if (packagesFilter !== 'all') {
      result = result.filter(p => {
        if (packagesFilter === 'summer') return p.isSummer || p.category === 'summer' || (p.badge && p.badge.includes('الصيف'));
        if (packagesFilter === 'aba') return p.category === 'aba' || p.name.toLowerCase().includes('aba') || p.tagline?.toLowerCase().includes('aba') || (p.categoryCode && p.categoryCode.includes('ABA'));
        if (packagesFilter === 'speech') return p.category === 'speech' || p.name.includes('النطق') || p.name.includes('تخاطب');
        if (packagesFilter === 'sensory') return p.category === 'sensory' || p.name.includes('الحسي') || p.name.includes('الوظيفي') || p.tagline?.includes('حسي');
        if (packagesFilter === 'assessment') return p.category === 'assessment' || p.name.includes('تقييم') || p.name.includes('تشخيص');
        return p.category === packagesFilter;
      });
    }

    return result;
  }, [packages, searchQuery, packagesFilter]);

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
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-28 md:pb-16" dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* 1. TOP HERO & BREADCRUMBS BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0F1E38] via-[#0C172C] to-[#090F1E] text-white pt-8 pb-14 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-blue-500/20 shadow-lg">
        
        {/* Ambient background glow & soft grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#2E86EB_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-[#2E86EB]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-4 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Breadcrumb Navigation Bar */}
          <div className="flex items-center justify-between gap-4 mb-6 text-xs font-bold text-blue-200/80">
            <div className="flex items-center gap-2">
              <button
                onClick={onBackToHome}
                className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer group"
              >
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{isArabic ? 'الرئيسية' : 'Home'}</span>
              </button>
              <span className="text-blue-400/50">/</span>
              <span className="text-[#FFD23F] font-black">{isArabic ? 'دليل الخدمات الشامل' : 'Services Directory'}</span>
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

      {/* 2. STICKY TOP CONTROLS BAR (SEARCH + SECTION SWITCHER) - Hides on scroll down */}
      <div 
        className={`sticky top-16 z-30 bg-white/95 dark:bg-[#071D18]/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-xs py-3.5 px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out ${
          isControlsBarVisible 
            ? 'translate-y-0 opacity-100 pointer-events-auto' 
            : '-translate-y-[140%] opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-3.5">
          
          {/* Top Row: Search Input + Sort Dropdown ON THE SAME LINE */}
          <div className="flex flex-row items-center justify-between gap-2 sm:gap-3 w-full">
            
            {/* Search Input Box */}
            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isArabic ? 'ابحث عن برنامج، كورس، باقة، أو تخصص...' : 'Search programs, courses, packages, or specialties...'}
                className={`w-full py-2 sm:py-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00E5BE] transition-all truncate ${
                  isArabic ? 'pr-8 pl-7 sm:pr-10 sm:pl-10' : 'pl-8 pr-7 sm:pl-10 sm:pr-10'
                }`}
              />
              <Search className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-2.5 sm:right-3.5' : 'left-2.5 sm:left-3.5'}`} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'left-2 sm:left-3' : 'right-2 sm:right-3'} p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-colors cursor-pointer`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Right Controls: Sort & Quick Reset on the Same Line */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* Sort Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-[11px] sm:text-xs font-bold border border-slate-200 dark:border-white/10 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#0B3B36] dark:text-[#00E5BE] shrink-0" />
                  <span>
                    {sortBy === 'recommended' && (isArabic ? 'الترتيب: الموصى به' : 'Sort: Recommended')}
                    {sortBy === 'name' && (isArabic ? 'أبجدياً (أ-ي)' : 'Alphabetical')}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
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

              {/* Global Reset if filters/search active */}
              {(searchQuery || programsFilter !== 'all' || coursesFilter !== 'all' || packagesFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setProgramsFilter('all');
                    setCoursesFilter('all');
                    setPackagesFilter('all');
                  }}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                  title={isArabic ? 'مسح الفلاتر' : 'Reset'}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">{isArabic ? 'مسح' : 'Reset'}</span>
                </button>
              )}

            </div>

          </div>

          {/* Section Navigation Tabs: (الكل · برامج التأهيل · الكورسات والدورات · الباقات والأسعار) */}
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
                  onClick={() => setActiveTab(tab.id as any)}
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

        </div>
      </div>

      {/* 3. MAIN CONTENT: ORGANIZED SECTIONS (EACH WITH ITS OWN DEDICATED FILTER AND SLIDER/GRID SWITCH) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Results Counter Header */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <div className="font-bold flex items-center gap-2">
            <span>{isArabic ? 'يتم عرض' : 'Showing'}</span>
            <span className="text-[#0B3B36] dark:text-[#00E5BE] font-black text-base">{totalResultsCount}</span>
            <span>{isArabic ? 'عنصر في الدليل' : 'items'}</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>{isArabic ? 'العرض الافتراضي للجوال: سلايدر · للكمبيوتر: شبكة' : 'Mobile Default: Slider · Desktop: Grid'}</span>
          </div>
        </div>

        {/* Global Empty State */}
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
                setProgramsFilter('all');
                setCoursesFilter('all');
                setPackagesFilter('all');
                setActiveTab('all');
              }}
              className="px-6 py-2.5 rounded-xl bg-[#0B3B36] hover:bg-[#0D4D46] text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              {isArabic ? 'إعادة ضبط خيارات الفلترة' : 'Reset Filters'}
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* PART 1: REHABILITATION PROGRAMS (الجزء الأول: برامج التأهيل التخصصية)      */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'programs') && (
          <section className="mb-10 sm:mb-16 bg-white/60 dark:bg-slate-900/40 rounded-2xl sm:rounded-3xl p-3 sm:p-7 border border-slate-200/80 dark:border-white/5 shadow-xs">
            
            {/* 1.1 Section Header & Controls (View mode switch + Slider Arrows) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-slate-200/60 dark:border-white/10">
              
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Puzzle className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {isArabic ? 'برامج التأهيل التخصصية' : 'Rehabilitation Programs'}
                    </h2>
                    <span className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {filteredServices.length} {isArabic ? 'برامج' : 'programs'}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isArabic ? 'جلسات وخطط تدخل علاجية معتمدة وفق أحدث المقاييس الإكلينيكية' : 'Clinical intervention and developmental therapy plans'}
                  </p>
                </div>
              </div>

              {/* View Switcher: Slider vs Grid + Scroll Arrows */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                
                {/* Navigation arrows when in slider mode */}
                {programsViewMode === 'slider' && filteredServices.length > 0 && (
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
                    <button
                      onClick={() => handleScrollSlider(programsSliderRef, 'prev')}
                      aria-label={isArabic ? 'السابق' : 'Previous'}
                      className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      {isArabic ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleScrollSlider(programsSliderRef, 'next')}
                      aria-label={isArabic ? 'التالي' : 'Next'}
                      className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                )}

                {/* Segmented Toggle: Slider vs Grid */}
                <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <button
                    onClick={() => setProgramsViewMode('slider')}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      programsViewMode === 'slider'
                        ? 'bg-[#0B3B36] text-white dark:bg-[#00E5BE] dark:text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'سلايدر' : 'Slider'}</span>
                  </button>
                  <button
                    onClick={() => setProgramsViewMode('grid')}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      programsViewMode === 'grid'
                        ? 'bg-[#0B3B36] text-white dark:bg-[#00E5BE] dark:text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'شبكة' : 'Grid'}</span>
                  </button>
                </div>

              </div>

            </div>

            {/* 1.2 DEDICATED FILTER FOR PROGRAMS (فلتر مخصص لقسم البرامج) */}
            <div className="mb-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {[
                  { id: 'all', labelAr: 'جميع برامج التأهيل', labelEn: 'All Programs', count: services.length },
                  { id: 'aba', labelAr: 'تحليل السلوك التطبيقي ABA', labelEn: 'ABA Therapy', count: services.filter(s => s.category === 'aba' || s.id === 'srv-aba').length },
                  { id: 'speech', labelAr: 'النطق والتخاطب', labelEn: 'Speech & Language', count: services.filter(s => s.category === 'speech' || s.id === 'srv-speech').length },
                  { id: 'occupational', labelAr: 'العلاج الوظيفي', labelEn: 'Occupational Therapy', count: services.filter(s => s.category === 'occupational' || s.id === 'srv-occupational').length },
                  { id: 'sensory', labelAr: 'التكامل الحسي', labelEn: 'Sensory Integration', count: services.filter(s => s.category === 'sensory' || s.id === 'srv-sensory').length },
                  { id: 'learning', labelAr: 'صعوبات التعلم والواجبات', labelEn: 'Learning Support', count: services.filter(s => s.category === 'learning' || s.id === 'srv-learning-difficulties').length },
                  { id: 'psychological', labelAr: 'التشخيص والعلاج النفسي', labelEn: 'Psychological Care', count: services.filter(s => s.category === 'psychological' || s.id === 'srv-psychological').length },
                ].map(f => {
                  const isActive = programsFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setProgramsFilter(f.id)}
                      className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#0B3B36] text-white dark:bg-[#00E5BE] dark:text-slate-950 font-black shadow-xs ring-2 ring-amber-500/40'
                          : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10'
                      }`}
                    >
                      <span>{isArabic ? f.labelAr : f.labelEn}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        isActive ? 'bg-white/25 text-white dark:text-slate-950' : 'bg-slate-200 dark:bg-white/10 text-slate-500'
                      }`}>
                        {f.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 1.3 Programs Empty State */}
            {filteredServices.length === 0 && (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-white/10">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3">
                  {isArabic ? 'لا توجد برامج تأهيل مطابقة لهذا الفلتر' : 'No rehab programs match this filter'}
                </p>
                <button
                  onClick={() => setProgramsFilter('all')}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors cursor-pointer"
                >
                  {isArabic ? 'إظهار كافة برامج التأهيل' : 'Show All Programs'}
                </button>
              </div>
            )}

            {/* 1.4 Programs Content Container (Slider or Grid) */}
            {filteredServices.length > 0 && (
              <div
                ref={programsSliderRef}
                className={
                  programsViewMode === 'slider'
                    ? "flex overflow-x-auto gap-3 sm:gap-6 pb-2.5 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar -mx-1 px-1 sm:mx-0 sm:px-0"
                    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
                }
              >
                {filteredServices.map((service) => {
                  const visual = getServiceVisuals(service.id);
                  const isFav = !!favorites[service.id];

                  return (
                    <div
                      key={service.id}
                      className={`bg-white dark:bg-[#111827] rounded-2xl sm:rounded-[28px] overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${visual.colorClassHover} ${
                        programsViewMode === 'slider'
                          ? "w-[72vw] min-w-[245px] max-w-[280px] sm:w-[330px] sm:max-w-none md:w-[350px] shrink-0 snap-start"
                          : "w-full max-w-[320px] mx-auto sm:max-w-none"
                      }`}
                    >
                      {/* Top Accent Strip */}
                      <div className={`h-1.5 sm:h-2 w-full ${visual.colorClass}`} />

                      {/* Header */}
                      <div className={`p-4 sm:p-6 pb-3.5 sm:pb-5 ${visual.lightBg} border-b ${visual.accentBorder} relative transition-colors`}>
                        <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-4">
                          <span className={`inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-black ${visual.colorClass} text-white shadow-xs`}>
                            {visual.badgeText || (isArabic ? service.categoryAr : service.categoryEn)}
                          </span>

                          <button
                            onClick={(e) => toggleFavorite(service.id, e)}
                            aria-label={isFav ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                            className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white/90 dark:bg-slate-800/90 shadow-xs flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                          >
                            <Heart className={`w-4 h-4 transition-transform ${isFav ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                          </button>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl ${visual.colorClass} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0`}>
                            {visual.icon}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-[#0B3B36] dark:group-hover:text-[#00E5BE] transition-colors">
                              {isArabic ? service.title : (service.titleEn || service.title)}
                            </h3>
                            {service.titleEn && isArabic && (
                              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mt-0.5 truncate" dir="ltr">
                                {service.titleEn}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 sm:p-6 pt-3.5 sm:pt-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                        <div className="space-y-2.5 sm:space-y-3.5">
                          
                          {/* Clinical Purpose */}
                          <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl ${visual.lightBg} border ${visual.accentBorder}`}>
                            <p className={`text-[11px] sm:text-sm font-bold ${visual.textAccent} leading-relaxed`}>
                              {isArabic ? (visual.flyerText || service.description) : (service.descriptionEn || service.description)}
                            </p>
                          </div>

                          {/* Key Outcomes */}
                          <div className="space-y-1.5 sm:space-y-2 pt-0.5">
                            <span className="text-[10px] sm:text-[11px] font-black text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
                              {isArabic ? 'أبرز مخرجات البرنامج:' : 'Key Outcomes:'}
                            </span>
                            {((isArabic ? service.benefits : (service.benefitsEn || service.benefits)) || []).slice(0, 3).map((benefit, bIdx) => (
                              <div key={bIdx} className="flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300">
                                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00E5BE] shrink-0 mt-0.5 stroke-[2.5]" />
                                <span className="line-clamp-2 leading-relaxed">{benefit}</span>
                              </div>
                            ))}
                          </div>

                          {/* Target Age */}
                          <div className="pt-1 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
                            <span className="truncate">{isArabic ? service.targetAges : (service.targetAgesEn || service.targetAges)}</span>
                          </div>

                          {/* Price */}
                          {(service.sessionPrice || service.assessmentPrice || service.priceDisplayAr) && (
                            <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-800/30 flex items-center justify-between text-[11px] sm:text-xs">
                              <span className="font-bold text-teal-800 dark:text-teal-200">
                                {service.sessionPrice ? (isArabic ? 'سعر الجلسة العلاجية:' : 'Session Rate:') : (isArabic ? 'التقييم الأولي:' : 'Evaluation:')}
                              </span>
                              <span className="font-black text-[#0B3B36] dark:text-[#00E5BE]">
                                {service.sessionPrice ? `${service.sessionPrice} ${isArabic ? 'ر.س' : 'SAR'}` : (service.priceDisplayAr || `${service.assessmentPrice} ${isArabic ? 'ر.س' : 'SAR'}`)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="pt-3 sm:pt-4 border-t border-slate-100 dark:border-white/10 space-y-2">
                          <button
                            onClick={() => onSelectService(service)}
                            className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 ${visual.colorClass} hover:brightness-105 text-white font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm active:scale-95`}
                          >
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>{isArabic ? 'احجز تقييم البرنامج' : 'Book Evaluation Session'}</span>
                            {isArabic ? <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                          </button>

                          <button
                            onClick={() => openWhatsAppInquiry(service.title)}
                            className="w-full py-2 sm:py-2.5 px-3 sm:px-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
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
            )}

            {/* Slider visual hint on mobile when in slider mode */}
            {programsViewMode === 'slider' && filteredServices.length > 1 && (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400 sm:hidden">
                <span>{isArabic ? 'اسحب لليمين واليسار للتنقل بين البرامج' : 'Swipe left/right to view programs'}</span>
              </div>
            )}

          </section>
        )}

        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* PART 2: COURSES & WORKSHOPS (الجزء الثاني: الكورسات والدورات التدريبية)   */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'courses') && (
          <section className="mb-10 sm:mb-16 bg-white/60 dark:bg-slate-900/40 rounded-2xl sm:rounded-3xl p-3 sm:p-7 border border-slate-200/80 dark:border-white/5 shadow-xs">
            
            {/* 2.1 Section Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-slate-200/60 dark:border-white/10">
              
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-teal-500/10 text-[#00E5BE] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {isArabic ? 'الكورسات والدورات التدريبية المعتمدة' : 'Accredited Training Courses'}
                    </h2>
                    <span className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full bg-teal-500/10 text-[#00E5BE] border border-[#00E5BE]/20">
                      {filteredCourses.length} {isArabic ? 'دورات' : 'courses'}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isArabic ? 'برامج مهنية معتمدة من البورد الدولي QABA وIBCCES للمتخصصين والأسر' : 'International board certified qualifications for practitioners and families'}
                  </p>
                </div>
              </div>

              {/* View Switcher: Slider vs Grid + Scroll Arrows */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                
                {/* Navigation arrows when in slider mode */}
                {coursesViewMode === 'slider' && filteredCourses.length > 0 && (
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
                    <button
                      onClick={() => handleScrollSlider(coursesSliderRef, 'prev')}
                      aria-label={isArabic ? 'السابق' : 'Previous'}
                      className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      {isArabic ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleScrollSlider(coursesSliderRef, 'next')}
                      aria-label={isArabic ? 'التالي' : 'Next'}
                      className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                )}

                {/* Segmented Toggle: Slider vs Grid */}
                <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <button
                    onClick={() => setCoursesViewMode('slider')}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      coursesViewMode === 'slider'
                        ? 'bg-[#0B3B36] text-white dark:bg-[#00E5BE] dark:text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'سلايدر' : 'Slider'}</span>
                  </button>
                  <button
                    onClick={() => setCoursesViewMode('grid')}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      coursesViewMode === 'grid'
                        ? 'bg-[#0B3B36] text-white dark:bg-[#00E5BE] dark:text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'شبكة' : 'Grid'}</span>
                  </button>
                </div>

              </div>

            </div>

            {/* 2.2 DEDICATED FILTER FOR COURSES (فلتر مخصص لقسم الكورسات) */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {[
                  { id: 'all', labelAr: 'جميع الدورات التدريبية', labelEn: 'All Courses', count: activeCourses.length },
                  { id: 'cas', labelAr: 'أخصائي توحد ودمج مدرسي', labelEn: 'Autism & Inclusion', count: activeCourses.filter(c => c.id === 'course-autism-inclusion' || c.categoryAr?.includes('توحد')).length },
                  { id: 'qasp', labelAr: 'اعتماد البورد QABA / QASP-S', labelEn: 'QABA Board & Supervision', count: activeCourses.filter(c => c.id === 'course-qasp-s' || c.id === 'course-qba' || c.id === 'course-abat' || c.categoryAr?.includes('إشراف')).length },
                  { id: 'communication', labelAr: 'التواصل والطلب Mand', labelEn: 'Mand Communication', count: activeCourses.filter(c => c.id === 'course-mand-training' || c.categoryAr?.includes('تواصل')).length },
                  { id: 'parents', labelAr: 'برامج أولياء الأمور والأسرة', labelEn: 'Parent Programs', count: activeCourses.filter(c => c.targetAudienceAr?.includes('أسر') || c.categoryAr?.includes('أسر')).length },
                ].filter(f => f.count > 0 || f.id === 'all').map(f => {
                  const isActive = coursesFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setCoursesFilter(f.id)}
                      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#0B3B36] text-white dark:bg-[#00E5BE] dark:text-slate-950 font-black shadow-xs ring-2 ring-teal-500/40'
                          : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10'
                      }`}
                    >
                      <span>{isArabic ? f.labelAr : f.labelEn}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        isActive ? 'bg-white/25 text-white dark:text-slate-950' : 'bg-slate-200 dark:bg-white/10 text-slate-500'
                      }`}>
                        {f.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2.3 Courses Empty State */}
            {filteredCourses.length === 0 && (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-white/10">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3">
                  {isArabic ? 'لا توجد كورسات مطابقة لهذا الفلتر' : 'No courses match this filter'}
                </p>
                <button
                  onClick={() => setCoursesFilter('all')}
                  className="px-4 py-1.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-colors cursor-pointer"
                >
                  {isArabic ? 'إظهار كافة الكورسات' : 'Show All Courses'}
                </button>
              </div>
            )}

            {/* 2.4 Courses Content Container (Slider or Grid) */}
            {filteredCourses.length > 0 && (
              <div
                ref={coursesSliderRef}
                className={
                  coursesViewMode === 'slider'
                    ? "flex overflow-x-auto gap-3 sm:gap-6 pb-2.5 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar -mx-1 px-1 sm:mx-0 sm:px-0"
                    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
                }
              >
                {filteredCourses.map((course) => {
                  const isFav = !!favorites[course.id];
                  const title = isArabic ? course.titleAr : course.titleEn;
                  const ribbon = isArabic ? course.ribbonTagAr : course.ribbonTagEn;
                  const hoursBadge = isArabic ? course.hoursBadgeAr : course.hoursBadgeEn;
                  const price = isArabic ? course.priceDisplayAr : course.priceDisplayEn;

                  return (
                    <div
                      key={course.id}
                      className={`bg-white dark:bg-[#111827] rounded-2xl sm:rounded-[28px] overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-[#2E86EB]/50 ${
                        coursesViewMode === 'slider'
                          ? "w-[70vw] min-w-[230px] max-w-[270px] sm:w-[320px] sm:max-w-none md:w-[340px] shrink-0 snap-start"
                          : "w-full max-w-[320px] mx-auto sm:max-w-none"
                      }`}
                    >
                      {/* Top Accent Strip */}
                      <div className="h-1 sm:h-1.5 w-full bg-gradient-to-r from-[#1B4B8A] to-[#2E86EB]" />

                      {/* Header */}
                      <div className="p-2.5 sm:p-4 pb-2 sm:pb-3 bg-teal-500/5 dark:bg-teal-950/20 border-b border-teal-500/15 relative">
                        <div className="flex items-center justify-between gap-1 mb-1.5 sm:mb-2.5">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[9.5px] sm:text-xs font-black bg-[#0B3B36] dark:bg-[#00E5BE] text-white dark:text-slate-950 shadow-2xs truncate max-w-[170px]">
                            {ribbon}
                          </span>

                          <button
                            onClick={(e) => toggleFavorite(course.id, e)}
                            aria-label={isFav ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                            className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white/90 dark:bg-slate-800/90 shadow-2xs flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
                          >
                            <Heart className={`w-4 h-4 transition-transform ${isFav ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#0B3B36] to-[#0f766e] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                            <CourseCustomIcon iconName={course.iconName || 'award'} className="w-4.5 h-4.5 sm:w-6 sm:h-6" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-snug group-hover:text-[#0B3B36] dark:group-hover:text-[#00E5BE] transition-colors line-clamp-2">
                              {title}
                            </h3>
                            <div className="flex items-center gap-1 mt-0.5 text-[9.5px] sm:text-[11px] font-bold text-teal-700 dark:text-[#00E5BE]">
                              <Clock className="w-3 h-3 shrink-0" />
                              <span className="truncate">{hoursBadge}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-2.5 sm:p-4 pt-2 sm:pt-3 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
                        <div className="space-y-1.5 sm:space-y-2">
                          
                          {/* Overview */}
                          <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium line-clamp-2">
                            {isArabic ? course.descriptionAr : course.descriptionEn}
                          </p>

                          {/* Syllabus */}
                          <div className="space-y-1 pt-0.5">
                            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
                              {isArabic ? 'محاور الدورة:' : 'Key Syllabus:'}
                            </span>
                            {((isArabic ? course.featuresAr : course.featuresEn) || []).slice(0, 2).map((feat, fIdx) => (
                              <div key={fIdx} className="flex items-center gap-1.5 text-[9.5px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300">
                                <CheckCircle2 className="w-3 h-3 text-teal-600 dark:text-[#00E5BE] shrink-0" />
                                <span className="truncate leading-normal">{feat}</span>
                              </div>
                            ))}
                          </div>

                          {/* Target Audience */}
                          {course.targetAudienceAr && (
                            <div className="flex items-center gap-1.5 text-[9px] sm:text-[10.5px] text-slate-500 dark:text-slate-400 font-medium truncate pt-0.5">
                              <Users className="w-3 h-3 text-teal-600 dark:text-[#00E5BE] shrink-0" />
                              <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0">{isArabic ? 'المستهدف:' : 'Audience:'}</span>
                              <span className="truncate">{isArabic ? course.targetAudienceAr : course.targetAudienceEn}</span>
                            </div>
                          )}
                        </div>

                        {/* Pricing & Registration */}
                        <div className="pt-2 sm:pt-2.5 border-t border-slate-100 dark:border-white/10 space-y-1.5 sm:space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9.5px] sm:text-xs font-bold text-slate-400">{isArabic ? 'رسوم الدورة:' : 'Tuition:'}</span>
                            <span className="text-xs sm:text-sm font-black text-[#0B3B36] dark:text-[#00E5BE]">{price}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() => setSelectedCourseForDetails(course)}
                              className="py-1.5 px-2 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-[10px] sm:text-xs font-black text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                              <BookOpen className="w-3 h-3 text-teal-600 dark:text-[#00E5BE]" />
                              <span>{isArabic ? 'تفاصيل' : 'Details'}</span>
                            </button>

                            <button
                              onClick={() => onRegisterCourse(course)}
                              className="py-1.5 px-2 rounded-lg bg-gradient-to-r from-[#0B3B36] to-[#0f766e] hover:brightness-110 text-white text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 transition-all shadow-2xs cursor-pointer active:scale-95"
                            >
                              <GraduationCap className="w-3 h-3" />
                              <span>{isArabic ? 'سجل الآن' : 'Register'}</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Slider visual hint on mobile */}
            {coursesViewMode === 'slider' && filteredCourses.length > 1 && (
              <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10.5px] font-bold text-slate-400 sm:hidden">
                <span>{isArabic ? 'اسحب لليمين واليسار للتنقل بين الكورسات' : 'Swipe left/right to view courses'}</span>
              </div>
            )}

          </section>
        )}

        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* PART 3: PACKAGES & PRICING (الجزء الثالث: باقات التأهيل والأسعار)         */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'packages') && (
          <section className="mb-10 sm:mb-16 bg-white/60 dark:bg-slate-900/40 rounded-2xl sm:rounded-3xl p-3 sm:p-7 border border-slate-200/80 dark:border-white/5 shadow-xs">
            
            {/* 3.1 Section Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-slate-200/60 dark:border-white/10">
              
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {isArabic ? 'باقات التأهيل والأسعار' : 'Therapy Packages & Pricing'}
                    </h2>
                    <span className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                      {filteredPackages.length} {isArabic ? 'باقات' : 'packages'}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isArabic ? 'باقات رعاية متكاملة ومصممة بعناية مع شفافية في الأسعار وتقسيط بدون فوائد' : 'All-inclusive bundled care plans with interest-free installment support'}
                  </p>
                </div>
              </div>

              {/* View Switcher: Slider vs Grid + Scroll Arrows */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                
                {/* Navigation arrows when in slider mode */}
                {packagesViewMode === 'slider' && filteredPackages.length > 0 && (
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
                    <button
                      onClick={() => handleScrollSlider(packagesSliderRef, 'prev')}
                      aria-label={isArabic ? 'السابق' : 'Previous'}
                      className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      {isArabic ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleScrollSlider(packagesSliderRef, 'next')}
                      aria-label={isArabic ? 'التالي' : 'Next'}
                      className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                )}

                {/* Segmented Toggle: Slider vs Grid */}
                <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <button
                    onClick={() => setPackagesViewMode('slider')}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      packagesViewMode === 'slider'
                        ? 'bg-[#0B3B36] text-white dark:bg-[#00E5BE] dark:text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'سلايدر' : 'Slider'}</span>
                  </button>
                  <button
                    onClick={() => setPackagesViewMode('grid')}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      packagesViewMode === 'grid'
                        ? 'bg-[#0B3B36] text-white dark:bg-[#00E5BE] dark:text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'شبكة' : 'Grid'}</span>
                  </button>
                </div>

              </div>

            </div>

            {/* 3.2 DEDICATED FILTER FOR PACKAGES (فلتر مخصص لقسم الباقات) */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {[
                  { id: 'all', labelAr: 'جميع الباقات', labelEn: 'All Packages', count: packages.length },
                  { id: 'summer', labelAr: 'باقات الصيف ☀️', labelEn: 'Summer Packages', count: packages.filter(p => p.isSummer || p.category === 'summer').length },
                  { id: 'aba', labelAr: 'باقات الـ ABA المكثفة', labelEn: 'ABA Packages', count: packages.filter(p => p.category === 'aba' || p.name.includes('ABA')).length },
                  { id: 'speech', labelAr: 'باقات النطق والتخاطب', labelEn: 'Speech Packages', count: packages.filter(p => p.category === 'speech' || p.name.includes('النطق')).length },
                  { id: 'sensory', labelAr: 'العلاج الوظيفي والحسي', labelEn: 'Sensory & OT', count: packages.filter(p => p.category === 'sensory' || p.name.includes('الوظيفي') || p.name.includes('الحسي')).length },
                  { id: 'assessment', labelAr: 'التقييم والتشخيص', labelEn: 'Assessment & Diagnosis', count: packages.filter(p => p.category === 'assessment' || p.name.includes('تقييم')).length },
                ].map(f => {
                  const isActive = packagesFilter === f.id;
                  const isSummerTab = f.id === 'summer';
                  return (
                    <button
                      key={f.id}
                      onClick={() => setPackagesFilter(f.id)}
                      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? isSummerTab
                            ? 'bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 text-white font-black shadow-xs ring-2 ring-sky-400/40'
                            : 'bg-[#0B3B36] text-white dark:bg-[#00E5BE] dark:text-slate-950 font-black shadow-xs ring-2 ring-sky-500/40'
                          : isSummerTab
                            ? 'bg-sky-50/80 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 hover:bg-sky-100 border border-sky-200/80 dark:border-sky-800/40'
                            : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10'
                      }`}
                    >
                      <span>{isArabic ? f.labelAr : f.labelEn}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        isActive ? 'bg-white/25 text-white dark:text-slate-950' : 'bg-slate-200 dark:bg-white/10 text-slate-500'
                      }`}>
                        {f.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3.3 Packages Empty State */}
            {filteredPackages.length === 0 && (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-white/10">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3">
                  {isArabic ? 'لا توجد باقات مطابقة لهذا الفلتر' : 'No packages match this filter'}
                </p>
                <button
                  onClick={() => setPackagesFilter('all')}
                  className="px-4 py-1.5 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 transition-colors cursor-pointer"
                >
                  {isArabic ? 'إظهار كافة الباقات' : 'Show All Packages'}
                </button>
              </div>
            )}

            {/* 3.4 Packages Content Container (Slider or Grid) */}
            {filteredPackages.length > 0 && (
              <div
                ref={packagesSliderRef}
                className={
                  packagesViewMode === 'slider'
                    ? "flex overflow-x-auto gap-3 sm:gap-6 pb-2.5 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar -mx-1 px-1 sm:mx-0 sm:px-0"
                    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
                }
              >
                {filteredPackages.map((pkg) => {
                  const isSummer = pkg.isSummer || pkg.category === 'summer';
                  const isFav = !!favorites[pkg.id];
                  const savings = pkg.originalPrice ? pkg.originalPrice - pkg.price : 0;

                  return (
                    <div
                      key={pkg.id}
                      className={`bg-white dark:bg-[#111827] rounded-2xl sm:rounded-[28px] overflow-hidden border shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${
                        isSummer
                          ? 'border-sky-300 dark:border-sky-500/40 ring-1 ring-sky-400/25 shadow-sky-500/5'
                          : 'border-slate-200/90 dark:border-white/10'
                      } ${
                        packagesViewMode === 'slider'
                          ? "w-[72vw] min-w-[245px] max-w-[280px] sm:w-[330px] sm:max-w-none md:w-[350px] shrink-0 snap-start"
                          : "w-full max-w-[320px] mx-auto sm:max-w-none"
                      }`}
                    >
                      {/* Top Slim Strip */}
                      <div className={`h-1 sm:h-1.5 w-full ${isSummer ? 'bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600' : 'bg-gradient-to-r from-[#0B3B36] to-[#0284C7]'}`} />

                      {/* Header */}
                      <div className={`p-2.5 sm:p-5 pb-2 sm:pb-3.5 ${isSummer ? 'bg-gradient-to-br from-sky-50/90 via-cyan-50/50 to-blue-50/30 dark:from-sky-950/40 dark:via-slate-900/90 dark:to-cyan-950/30 border-sky-200/60 dark:border-sky-500/20' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/50 dark:border-white/5'} border-b relative`}>
                        <div className="flex items-center justify-between gap-1.5 mb-1.5 sm:mb-3">
                          <div className="flex items-center gap-1 flex-wrap">
                            {isSummer && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 text-white text-[9.5px] sm:text-[10.5px] font-black shadow-2xs">
                                <Sun className="w-3 h-3 text-sky-100" />
                                <span>{isArabic ? 'باقة الصيف' : 'Summer'}</span>
                              </span>
                            )}
                            {pkg.popular && (
                              <span className="px-2 py-0.5 rounded-full bg-[#0B3B36] text-white text-[9px] sm:text-[10px] font-black tracking-wider uppercase">
                                {isArabic ? 'الأكثر طلباً' : 'POPULAR'}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={(e) => toggleFavorite(pkg.id, e)}
                            aria-label={isFav ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                            className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white/90 dark:bg-slate-800/90 shadow-2xs flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
                          >
                            <Heart className={`w-4 h-4 transition-transform ${isFav ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                          </button>
                        </div>

                        <span className={`text-[9.5px] sm:text-[10.5px] font-black ${isSummer ? 'text-sky-700 dark:text-sky-400' : 'text-teal-700 dark:text-[#00E5BE]'} tracking-wider uppercase block mb-0.5`}>
                          {isArabic ? (pkg.categoryCode || 'باقة تأهيلية متكاملة') : (pkg.categoryCodeEn || 'CARE PLAN')}
                        </span>

                        <h3 className="text-sm sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                          {isArabic ? pkg.name : (pkg.nameEn || pkg.name)}
                        </h3>

                        <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1 font-medium">
                          {isArabic ? pkg.tagline : (pkg.taglineEn || pkg.tagline)}
                        </p>
                      </div>

                      {/* Body */}
                      <div className="p-2.5 sm:p-5 pt-2 sm:pt-3.5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
                        <div className="space-y-1.5 sm:space-y-2.5">
                          
                          {/* Plan Duration & Sessions */}
                          <div className={`flex items-center gap-1.5 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl ${isSummer ? 'bg-sky-50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-200' : 'bg-teal-500/10 dark:bg-teal-950/20 text-teal-800 dark:text-teal-200'} text-[10px] sm:text-xs font-black`}>
                            <Clock className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isSummer ? 'text-sky-600 dark:text-sky-400' : 'text-[#0B3B36] dark:text-[#00E5BE]'} shrink-0`} />
                            <span className="leading-tight truncate">
                              {isArabic 
                                ? `${pkg.sessionsCount} جلسة علاجية مكثفة · ${pkg.durationWeeks} أسابيع`
                                : `${pkg.sessionsCount} Sessions · ${pkg.durationWeeks} Weeks`}
                            </span>
                          </div>

                          {/* Features Checklist */}
                          <div className="space-y-1 sm:space-y-1.5">
                            {((isArabic ? pkg.features : (pkg.featuresEn || pkg.features)) || []).slice(0, 2).map((feat, fIdx) => (
                              <div key={fIdx} className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300">
                                <Check className={`w-3 h-3 ${isSummer ? 'text-sky-600 dark:text-sky-400' : 'text-emerald-600 dark:text-[#00E5BE]'} shrink-0 stroke-[2.5]`} />
                                <span className="truncate leading-normal">{feat}</span>
                              </div>
                            ))}
                            {((isArabic ? pkg.features : (pkg.featuresEn || pkg.features)) || []).slice(2, 3).map((feat, fIdx) => (
                              <div key={fIdx + 2} className="hidden sm:flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300">
                                <Check className={`w-3.5 h-3.5 ${isSummer ? 'text-sky-600 dark:text-sky-400' : 'text-emerald-600 dark:text-[#00E5BE]'} shrink-0 stroke-[2.5]`} />
                                <span className="truncate leading-normal">{feat}</span>
                              </div>
                            ))}
                            {(isArabic ? pkg.features : (pkg.featuresEn || pkg.features)).length > 2 && (
                              <span className={`text-[9px] font-bold ${isSummer ? 'text-sky-700 dark:text-sky-400' : 'text-teal-700 dark:text-[#00E5BE]'} block sm:hidden`}>
                                {isArabic 
                                  ? `+ ${(isArabic ? pkg.features : (pkg.featuresEn || pkg.features)).length - 2} مميزات إضافية بالباقة` 
                                  : `+ ${(isArabic ? pkg.features : (pkg.featuresEn || pkg.features)).length - 2} more features`}
                              </span>
                            )}
                          </div>

                          {/* Installment Logos */}
                          <div className="pt-0.5 flex items-center gap-1.5 flex-wrap text-slate-400 text-[9.5px] sm:text-xs">
                            <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-500 shrink-0">{isArabic ? 'تقسيط:' : 'Installments:'}</span>
                            <TamaraLogo height={18} className="h-4.5 sm:h-5" />
                            <EmkanLogo height={18} className="h-4.5 sm:h-5" />
                          </div>
                        </div>

                        {/* Pricing & Action */}
                        <div className="pt-2 sm:pt-2.5 border-t border-slate-100 dark:border-white/10">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                                <div className="flex items-center gap-1 mb-0.5">
                                  <span className="text-[9.5px] sm:text-[11px] text-slate-600 dark:text-slate-300 line-through font-bold">
                                    {pkg.originalPrice} {isArabic ? 'ر.س' : 'SAR'}
                                  </span>
                                  <span className="text-[8.5px] sm:text-[9.5px] font-black px-1.5 py-0.2 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                    {isArabic ? `وفر ${savings}` : `Save ${savings}`}
                                  </span>
                                </div>
                              )}
                              <div className="text-base sm:text-xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
                                <span>{pkg.price}</span>
                                <span className="text-[10px] sm:text-xs font-bold text-slate-500">{isArabic ? 'ر.س' : 'SAR'}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => onSelectPackage(pkg)}
                              className={`py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl ${
                                isSummer
                                  ? 'bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-sky-600/20'
                                  : 'bg-gradient-to-r from-[#0B3B36] to-[#0f766e]'
                              } hover:brightness-110 active:scale-95 text-white text-[10.5px] sm:text-xs font-black flex items-center gap-1 shadow-2xs transition-all cursor-pointer shrink-0`}
                            >
                              {isSummer && <Sun className="w-3 h-3 text-sky-100 shrink-0" />}
                              <span>{isArabic ? (isSummer ? 'حجز باقة الصيف' : 'حجز الباقة') : (isSummer ? 'Book Summer' : 'Book')}</span>
                              {isArabic ? <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Slider visual hint on mobile */}
            {packagesViewMode === 'slider' && filteredPackages.length > 1 && (
              <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10.5px] font-bold text-slate-400 sm:hidden">
                <span>{isArabic ? 'اسحب لليمين واليسار للتنقل بين الباقات' : 'Swipe left/right to view packages'}</span>
              </div>
            )}

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
              onClick={() => {
                if (onOpenSpecialistsPage) {
                  onOpenSpecialistsPage();
                } else {
                  window.location.hash = '#specialists-directory';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs sm:text-sm flex items-center gap-2 border border-white/15 transition-all cursor-pointer active:scale-95"
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
