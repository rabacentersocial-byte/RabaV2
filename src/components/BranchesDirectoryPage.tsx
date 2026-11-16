import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  MapPin, 
  Navigation, 
  MessageCircle, 
  ChevronRight, 
  ChevronLeft, 
  Phone, 
  Clock, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  LayoutGrid, 
  Home, 
  ArrowRight, 
  ArrowLeft, 
  Copy, 
  Check, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  Share2, 
  X,
  CalendarCheck
} from 'lucide-react';
import { getStoredBranchesData, BranchItem } from '../data/branchesData';
import { BranchMapPinGraphic } from './BranchMapPinGraphic';
import { useLanguage } from '../context/LanguageContext';

const LedClubBadge: React.FC = () => (
  <span 
    className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-black text-[#FBBF24] bg-[#141821]/95 border-2 border-[#F59E0B] shadow-[0_0_12px_#f59e0b,inset_0_0_7px_rgba(245,158,11,0.45)] ring-2 ring-[#F59E0B]/35 whitespace-nowrap select-none shrink-0 tracking-wide"
  >
    + نادي رابا
  </span>
);

interface BranchesDirectoryPageProps {
  onBackToHome: () => void;
  onSelectBranch?: (branch: BranchItem) => void;
  onOpenBooking?: (branchNotes?: string) => void;
}

export const BranchesDirectoryPage: React.FC<BranchesDirectoryPageProps> = ({
  onBackToHome,
  onSelectBranch,
  onOpenBooking
}) => {
  const { isArabic } = useLanguage();

  // Branch data state with live sync
  const [branches, setBranches] = useState<BranchItem[]>(() => getStoredBranchesData());

  // Filters state
  const [selectedCity, setSelectedCity] = useState<'all' | 'riyadh' | 'jeddah' | 'khobar' | 'ahsa' | 'kharj'>('all');
  const [onlyClub, setOnlyClub] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Default view mode: Slider on mobile (< 768px), Grid on desktop (>= 768px)
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 'slider' : 'grid';
    }
    return 'grid';
  });

  // Copied address toast tracker
  const [copiedBranchId, setCopiedBranchId] = useState<string | null>(null);

  // Slider reference & state
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const movedDistanceRef = useRef(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Sync branches data updates
  useEffect(() => {
    const handleUpdate = () => {
      setBranches(getStoredBranchesData());
    };
    window.addEventListener('raba_branches_updated', handleUpdate);
    window.addEventListener('raba_persistent_sync_ready' as any, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('raba_branches_updated', handleUpdate);
      window.removeEventListener('raba_persistent_sync_ready' as any, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Filtered branches list
  const filteredBranches = useMemo(() => {
    return branches.filter((branch) => {
      // City filter
      if (selectedCity !== 'all' && branch.city !== selectedCity) {
        return false;
      }
      // Club filter
      if (onlyClub && !branch.hasClubBadge) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchName = (branch.name || '').toLowerCase().includes(query);
        const matchNameEn = (branch.nameEn || '').toLowerCase().includes(query);
        const matchCity = (branch.cityNameAr || '').toLowerCase().includes(query);
        const matchCityEn = (branch.cityNameEn || '').toLowerCase().includes(query);
        const matchBadge = (branch.regionBadgeAr || '').toLowerCase().includes(query);
        const matchAddress = (branch.address || '').toLowerCase().includes(query);
        const matchAddressEn = (branch.addressEn || '').toLowerCase().includes(query);
        if (!matchName && !matchNameEn && !matchCity && !matchCityEn && !matchBadge && !matchAddress && !matchAddressEn) {
          return false;
        }
      }
      return true;
    });
  }, [branches, selectedCity, onlyClub, searchQuery]);

  // Counts by city
  const totalCount = branches.length;
  const riyadhCount = branches.filter(b => b.city === 'riyadh').length;
  const jeddahCount = branches.filter(b => b.city === 'jeddah').length;
  const khobarCount = branches.filter(b => b.city === 'khobar').length;
  const ahsaCount = branches.filter(b => b.city === 'ahsa').length;
  const kharjCount = branches.filter(b => b.city === 'kharj').length;
  const clubCount = branches.filter(b => b.hasClubBadge).length;

  // Slider scroll tracking
  const getSlideWidth = () => {
    if (typeof window === 'undefined') return 360;
    if (window.innerWidth < 640) {
      return Math.min(window.innerWidth * 0.76, 310) + 14;
    }
    return 370;
  };

  const rafIdRef = useRef<number | null>(null);
  const maxScrollRef = useRef(0);
  const slideWidthRef = useRef(370);
  const containerOffsetLeftRef = useRef(0);

  const updateScrollState = useCallback(() => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const el = sliderRef.current;
      if (!el) return;

      const maxScroll = maxScrollRef.current;
      const current = Math.abs(el.scrollLeft);

      setCanScrollPrev(current > 15);
      setCanScrollNext(current < maxScroll - 15);

      const slideWidth = slideWidthRef.current;
      const index = Math.round(current / slideWidth);
      setCurrentIndex(Math.min(Math.max(0, index), Math.max(0, filteredBranches.length - 1)));
    });
  }, [filteredBranches.length]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const measure = () => {
      maxScrollRef.current = Math.max(0, el.scrollWidth - el.clientWidth);
      containerOffsetLeftRef.current = el.offsetLeft;
      slideWidthRef.current = getSlideWidth();
      updateScrollState();
    };

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (ro) {
      ro.observe(el);
    } else {
      window.addEventListener('resize', measure, { passive: true });
    }
    el.addEventListener('scroll', updateScrollState, { passive: true });

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      ro?.disconnect();
      window.removeEventListener('resize', measure);
      el.removeEventListener('scroll', updateScrollState);
    };
  }, [filteredBranches, updateScrollState, viewMode]);

  const handleScroll = (direction: 'prev' | 'next') => {
    const el = sliderRef.current;
    if (!el) return;
    const scrollAmount = slideWidthRef.current;

    let delta = scrollAmount;
    if (direction === 'prev') {
      delta = -scrollAmount;
    }
    if (isArabic) {
      delta = -delta;
    }

    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const scrollToIndex = (index: number) => {
    const el = sliderRef.current;
    if (!el) return;
    const slideWidth = slideWidthRef.current;
    let target = index * slideWidth;
    if (isArabic) {
      target = -target;
    }
    el.scrollTo({ left: target, behavior: 'smooth' });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = sliderRef.current;
    if (!el) return;
    setIsDragging(true);
    containerOffsetLeftRef.current = el.offsetLeft;
    startXRef.current = e.pageX - containerOffsetLeftRef.current;
    scrollLeftRef.current = el.scrollLeft;
    movedDistanceRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerOffsetLeftRef.current;
    const walk = (x - startXRef.current) * 1.5;
    movedDistanceRef.current += Math.abs(walk);
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCopyAddress = (branch: BranchItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${branch.name} - ${branch.address}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedBranchId(branch.id);
      setTimeout(() => {
        setCopiedBranchId(null);
      }, 2500);
    }).catch(() => {});
  };

  const handleBranchBooking = (branch: BranchItem) => {
    if (onSelectBranch) {
      onSelectBranch(branch);
    }
    if (onOpenBooking) {
      const note = `حجز في فرع: ${branch.name} (${branch.cityNameAr}) - ${branch.address}`;
      onOpenBooking(note);
    }
  };

  const resetFilters = () => {
    setSelectedCity('all');
    setOnlyClub(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-transparent text-[#161B26] dark:text-[#F8FAFC] transition-colors" dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* 1. TOP BREADCRUMB & BACK HEADER BAR */}
      <div className="liquid-glass-panel border-b border-[#161B26]/[0.08] dark:border-white/10 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Breadcrumb path */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#4B5563] dark:text-[#94A3B8]">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 hover:text-[#1263D6] dark:hover:text-[#60AFFF] transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{isArabic ? 'الرئيسية' : 'Home'}</span>
            </button>
            <span className="text-[#8B95A5] dark:text-[#64748B]">/</span>
            <span className="text-[#161B26] dark:text-[#F8FAFC] font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2B95FF]" />
              <span>{isArabic ? 'دليل فروع مركز رابا' : 'Branches Directory'}</span>
            </span>
          </nav>

          {/* Back to Home Button */}
          <button
            onClick={onBackToHome}
            className="liquid-glass-btn flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-[#161B26] dark:text-[#F8FAFC] text-xs sm:text-sm font-bold transition-all cursor-pointer"
          >
            {isArabic ? <ArrowRight className="w-4 h-4 text-[#2B95FF]" /> : <ArrowLeft className="w-4 h-4 text-[#2B95FF]" />}
            <span>{isArabic ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </button>
        </div>
      </div>

      {/* 2. HERO INTRO BANNER */}
      <section className="relative overflow-hidden pt-10 sm:pt-14 pb-8 sm:pb-12 border-b border-[#161B26]/[0.08] dark:border-white/10">
        <div className="absolute -top-24 right-1/4 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-60" style={{ background: 'radial-gradient(circle, rgba(43, 149, 255, 0.22) 0%, rgba(43, 149, 255, 0) 70%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            
            {/* Pill Badge */}
            <div className="liquid-glass-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[#1263D6] dark:text-[#60AFFF] text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#2B95FF]" />
              <span>{isArabic ? 'شبكة مراكز رابا المعتمدة عبر المملكة' : 'Accredited RABA Centers Across Saudi Arabia'}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#161B26] dark:text-[#F8FAFC] tracking-tight leading-tight">
              {isArabic ? (
                <>فروعنا بالمملكة العربية السعودية<span className="text-[#2B95FF]">.</span></>
              ) : (
                <>Our Branches in Saudi Arabia<span className="text-[#2B95FF]">.</span></>
              )}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#4B5563] dark:text-[#94A3B8] leading-relaxed font-normal">
              {isArabic 
                ? 'ننتشر في أهم مدن المملكة لنكون الأقرب لطفلك، بمراكز مجهزة بأعلى المعايير العالمية وغرف التكامل الحسي ونوادي التأهيل التفاعلية، مع كفاءات إكلينيكية معتمدة.'
                : 'Conveniently located across major Saudi cities with state-of-the-art sensory gyms, rehabilitation clubs, and licensed clinical specialists.'}
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold">
              <div className="liquid-glass-pill flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[#161B26] dark:text-[#F8FAFC]">
                <Building2 className="w-4 h-4 text-[#2B95FF]" />
                <span>{branches.length} {isArabic ? 'فرعاً معتمداً' : 'Branches'}</span>
              </div>
              <div className="liquid-glass-pill flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[#161B26] dark:text-[#F8FAFC]">
                <MapPin className="w-4 h-4 text-[#10B981]" />
                <span>5 {isArabic ? 'مدن رئيسية' : 'Major Cities'}</span>
              </div>
              <div className="liquid-glass-pill flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[#161B26] dark:text-[#F8FAFC]">
                <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                <span>{clubCount} {isArabic ? 'فروع تضم نوادي رابا' : 'With Integrated Clubs'}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CONTROLS, SEARCH, FILTERS & VIEW MODE SWITCHER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Search & Top Action Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
          
          {/* Search Input Box */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 right-4 rtl:right-4 rtl:left-auto ltr:left-4 ltr:right-auto text-[#8B95A5] dark:text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isArabic ? 'ابحث باسم الفرع، الحي، المدينة، أو الشارع...' : 'Search by branch name, city, district...'}
              className="warm-pill-input w-full h-11 pr-10 pl-10 rtl:pr-10 rtl:pl-10 ltr:pl-10 ltr:pr-10 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2B95FF] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 -translate-y-1/2 left-3 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto text-[#8B95A5] dark:text-[#64748B] hover:text-[#161B26] dark:hover:text-[#F8FAFC] p-1"
                aria-label="مسح البحث"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Mode Toggle and Slider Controls */}
          <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
            
            {/* View Mode Switcher: Slider vs Grid */}
            <div className="liquid-glass-pill flex items-center p-1 rounded-full shadow-xs">
              <button
                onClick={() => setViewMode('slider')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'slider'
                    ? 'warm-pill-cta shadow-xs'
                    : 'text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-[#F8FAFC]'
                }`}
                title={isArabic ? 'عرض كسلايدر أفقي' : 'Slider View'}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{isArabic ? 'سلايدر' : 'Slider'}</span>
              </button>

              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'warm-pill-cta shadow-xs'
                    : 'text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-[#F8FAFC]'
                }`}
                title={isArabic ? 'عرض كشبكة بطاقات' : 'Grid View'}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{isArabic ? 'شبكة' : 'Grid'}</span>
              </button>
            </div>

            {/* Slider navigation buttons when in slider mode */}
            {viewMode === 'slider' && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleScroll('prev')}
                  disabled={!canScrollPrev}
                  aria-label={isArabic ? 'الفرع السابق' : 'Previous branch'}
                  className={`liquid-glass-btn w-9 h-9 rounded-full flex items-center justify-center shadow-xs transition-all cursor-pointer ${
                    canScrollPrev 
                      ? 'hover:text-[#1263D6] dark:hover:text-[#60AFFF] active:scale-95' 
                      : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  {isArabic ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => handleScroll('next')}
                  disabled={!canScrollNext}
                  aria-label={isArabic ? 'الفرع التالي' : 'Next branch'}
                  className={`liquid-glass-btn w-9 h-9 rounded-full flex items-center justify-center shadow-xs transition-all cursor-pointer ${
                    canScrollNext 
                      ? 'hover:text-[#1263D6] dark:hover:text-[#60AFFF] active:scale-95' 
                      : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            )}

          </div>
        </div>

        {/* City Filter Tabs + Club Filter Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#161B26]/[0.08] dark:border-white/10">
          
          {/* City Buttons Pill Carousel */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
            
            {/* All */}
            <button
              onClick={() => setSelectedCity('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCity === 'all'
                  ? 'warm-pill-cta shadow-xs'
                  : 'liquid-glass-pill text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-[#F8FAFC]'
              }`}
            >
              <span>{isArabic ? 'جميع الفروع' : 'All Branches'}</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedCity === 'all' ? 'bg-[#2B95FF] text-white' : 'bg-[#161B26]/5 dark:bg-white/10 text-[#4B5563] dark:text-[#94A3B8]'
              }`}>
                {totalCount}
              </span>
            </button>

            {/* Riyadh */}
            <button
              onClick={() => setSelectedCity('riyadh')}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCity === 'riyadh'
                  ? 'warm-pill-cta shadow-xs'
                  : 'liquid-glass-pill text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-[#F8FAFC]'
              }`}
            >
              <span>{isArabic ? 'الرياض' : 'Riyadh'}</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedCity === 'riyadh' ? 'bg-[#2B95FF] text-white' : 'bg-[#161B26]/5 dark:bg-white/10 text-[#4B5563] dark:text-[#94A3B8]'
              }`}>
                {riyadhCount}
              </span>
            </button>

            {/* Jeddah */}
            <button
              onClick={() => setSelectedCity('jeddah')}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCity === 'jeddah'
                  ? 'warm-pill-cta shadow-xs'
                  : 'liquid-glass-pill text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-[#F8FAFC]'
              }`}
            >
              <span>{isArabic ? 'جدة' : 'Jeddah'}</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedCity === 'jeddah' ? 'bg-[#2B95FF] text-white' : 'bg-[#161B26]/5 dark:bg-white/10 text-[#4B5563] dark:text-[#94A3B8]'
              }`}>
                {jeddahCount}
              </span>
            </button>

            {/* Khobar */}
            <button
              onClick={() => setSelectedCity('khobar')}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCity === 'khobar'
                  ? 'warm-pill-cta shadow-xs'
                  : 'liquid-glass-pill text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-[#F8FAFC]'
              }`}
            >
              <span>{isArabic ? 'الخبر' : 'Khobar'}</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedCity === 'khobar' ? 'bg-[#2B95FF] text-white' : 'bg-[#161B26]/5 dark:bg-white/10 text-[#4B5563] dark:text-[#94A3B8]'
              }`}>
                {khobarCount}
              </span>
            </button>

            {/* Al-Ahsa */}
            <button
              onClick={() => setSelectedCity('ahsa')}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCity === 'ahsa'
                  ? 'warm-pill-cta shadow-xs'
                  : 'liquid-glass-pill text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-[#F8FAFC]'
              }`}
            >
              <span>{isArabic ? 'الأحساء' : 'Al-Ahsa'}</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedCity === 'ahsa' ? 'bg-[#2B95FF] text-white' : 'bg-[#161B26]/5 dark:bg-white/10 text-[#4B5563] dark:text-[#94A3B8]'
              }`}>
                {ahsaCount}
              </span>
            </button>

            {/* Al-Kharj */}
            <button
              onClick={() => setSelectedCity('kharj')}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCity === 'kharj'
                  ? 'warm-pill-cta shadow-xs'
                  : 'liquid-glass-pill text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-[#F8FAFC]'
              }`}
            >
              <span>{isArabic ? 'الخرج' : 'Al-Kharj'}</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedCity === 'kharj' ? 'bg-[#2B95FF] text-white' : 'bg-[#161B26]/5 dark:bg-white/10 text-[#4B5563] dark:text-[#94A3B8]'
              }`}>
                {kharjCount}
              </span>
            </button>

          </div>

          {/* "+ نادي رابا" Filter Toggle Chip */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setOnlyClub(!onlyClub)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black border transition-all cursor-pointer flex items-center gap-1.5 ${
                onlyClub
                  ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-[#6D28D9] dark:text-[#A78BFA] shadow-xs'
                  : 'liquid-glass-pill text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-[#F8FAFC]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>{isArabic ? 'فروع تضم نادي تأهيلي (+ نادي)' : 'Branches with Clubs'}</span>
              {onlyClub && <Check className="w-3 h-3 text-[#8B5CF6]" />}
            </button>
          </div>

        </div>

        {/* Results Counter & Active Filter Tags */}
        <div className="flex items-center justify-between text-xs text-[#4B5563] dark:text-[#94A3B8] py-3">
          <div className="flex items-center gap-2">
            <span>{isArabic ? 'النتائج المعروضة:' : 'Showing:'}</span>
            <span className="font-black text-[#161B26] dark:text-[#F8FAFC]">{filteredBranches.length} {isArabic ? 'فرع' : 'branches'}</span>
          </div>
          {(selectedCity !== 'all' || onlyClub || searchQuery) && (
            <button
              onClick={resetFilters}
              className="text-[#1263D6] dark:text-[#60AFFF] font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>{isArabic ? 'إعادة ضبط الفلاتر' : 'Reset filters'}</span>
            </button>
          )}
        </div>

        {/* 4. BRANCH CARDS DISPLAY: SLIDER OR GRID */}
        {filteredBranches.length === 0 ? (
          /* Empty State */
          <div className="liquid-glass-card text-center py-16 rounded-[28px] my-6">
            <MapPin className="w-12 h-12 text-[#8B95A5] dark:text-[#64748B] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#161B26] dark:text-[#F8FAFC] mb-1">
              {isArabic ? 'لم يتم العثور على فروع مطابقة' : 'No matching branches found'}
            </h3>
            <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] max-w-md mx-auto mb-4">
              {isArabic 
                ? 'جرب البحث باسم مدينة أخرى أو إزالة الفلاتر لعرض كافة فروع مركز رابا.'
                : 'Try adjusting your search query or reset filters to view all RABA Center branches.'}
            </p>
            <button
              onClick={resetFilters}
              className="warm-pill-cta px-5 py-2.5 rounded-full text-xs font-black shadow-xs cursor-pointer"
            >
              {isArabic ? 'إعادة ضبط كل الفلاتر' : 'Reset all filters'}
            </button>
          </div>
        ) : viewMode === 'slider' ? (
          /* SLIDER VIEW MODE */
          <div className="relative my-4">
            <div
              ref={sliderRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`flex gap-3.5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 sm:py-4 px-1 ${
                isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
              }`}
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {filteredBranches.map((branch) => renderBranchCard(branch))}
            </div>

            {/* Slider Dot Indicators */}
            <div className="flex justify-center items-center gap-1 mt-6">
              {filteredBranches.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToIndex(idx)}
                  aria-label={`الانتقال للفرع ${idx + 1}`}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer p-0 m-0 bg-transparent border-0"
                >
                  <span
                    className={`block h-2 rounded-full transition-colors duration-200 ${
                      currentIndex === idx 
                        ? 'w-8 bg-[#2B95FF]' 
                        : 'w-2 bg-[#161B26]/15 dark:bg-white/20 hover:bg-[#161B26]/30'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* GRID VIEW MODE */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
            {filteredBranches.map((branch) => renderBranchCard(branch))}
          </div>
        )}

      </section>

      {/* 5. BOTTOM TRUST & CONTACT STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-12">
        <div className="obsidian-anchor-card rounded-[28px] py-10 px-6 sm:px-10 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-black text-white dark:text-[#161B26]">
            {isArabic ? 'هل تحتاج مساعدة في اختيار الفرع الأنسب لطفلك؟' : 'Need help selecting the closest branch?'}
          </h3>
          <p className="text-xs sm:text-sm text-[#94A3B8] dark:text-[#4B5563] leading-relaxed max-w-2xl mx-auto">
            {isArabic 
              ? 'فريق خدمة المستفيدين متاح لمساعدتكم في اختيار الفرع الأقرب، حجز مواعيد التقييم الأولي، والإجابة عن كافة استفساراتكم.'
              : 'Our customer support team is available to help you choose the best branch, schedule intake evaluations, and answer your questions.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="https://wa.me/966575100100?text=السلام%20عليكم،%20أود%20المساعدة%20في%20اختيار%20أقرب%20فرع%20لمركز%20رابا%20لطفلي"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:brightness-110 text-white text-xs font-black shadow-lg shadow-[#10B981]/25 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isArabic ? 'تواصل مع الدعم عبر واتساب' : 'Chat with Support on WhatsApp'}</span>
            </a>
            <a
              href="tel:0575100100"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 dark:bg-[#161B26]/5 hover:bg-white/20 dark:hover:bg-[#161B26]/10 text-white dark:text-[#161B26] text-xs font-bold border border-white/15 dark:border-[#161B26]/15 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#2B95FF]" />
              <span>{isArabic ? 'اتصال مباشر: 0575100100' : 'Call Directly: 0575100100'}</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );

  // Helper renderer for a single Branch Card
  function renderBranchCard(branch: BranchItem) {
    const isCopied = copiedBranchId === branch.id;

    return (
      <div
        key={branch.id}
        className={`liquid-glass-card rounded-[28px] overflow-hidden shadow-lg hover:border-[#2B95FF]/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative ${
          viewMode === 'slider' ? 'w-[76vw] min-w-[260px] max-w-[310px] sm:w-[350px] sm:max-w-none md:w-[365px] shrink-0 snap-start' : 'w-full'
        }`}
      >
        {/* Top: 3D Map Pin Graphic with Ambient Lighting */}
        <div className="relative h-36 sm:h-56 md:h-60 overflow-hidden bg-[#141821]">
          <BranchMapPinGraphic branchName={branch.name} />

          {/* City Tag Indicator Overlay */}
          <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 bg-[#141821]/85 backdrop-blur-md px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-[#F8FAFC] border border-white/10 flex items-center gap-1 sm:gap-1.5 shadow-md">
            <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#2B95FF]" />
            <span>{isArabic ? branch.cityNameAr : branch.cityNameEn}</span>
          </div>

          {/* Club badge overlay if applicable */}
          {branch.hasClubBadge && (
            <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4">
              <LedClubBadge />
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="p-3.5 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-5">
          
          <div className="space-y-2.5 sm:space-y-3">
            {/* Region Tag Pill & Working Hours */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className={`inline-block px-2.5 sm:px-3 py-0.5 sm:py-0.8 rounded-full text-[10px] sm:text-xs font-black border ${branch.badgeColorClass}`}>
                {isArabic ? branch.regionBadgeAr : branch.regionBadgeEn}
              </span>

              <span className="text-[10px] sm:text-[11px] text-[#4B5563] dark:text-[#94A3B8] font-semibold flex items-center gap-1">
                <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#2B95FF]" />
                <span>{isArabic ? branch.hoursAr : branch.hoursEn}</span>
              </span>
            </div>

            {/* Branch Name */}
            <div>
              <h3 className="text-base sm:text-xl font-black text-[#161B26] dark:text-[#F8FAFC] group-hover:text-[#1263D6] dark:group-hover:text-[#60AFFF] transition-colors leading-snug line-clamp-1">
                {isArabic ? branch.name : branch.nameEn}
              </h3>
            </div>

            {/* Branch Address with Copy action */}
            <div className="liquid-glass-panel p-2.5 sm:p-3 rounded-2xl relative group/addr">
              <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                <div className="text-[11px] sm:text-xs text-[#4B5563] dark:text-[#94A3B8] leading-relaxed pr-1 rtl:pr-1 ltr:pl-1 line-clamp-2">
                  <span className="font-bold text-[#161B26] dark:text-[#F8FAFC] block mb-0.5">
                    {isArabic ? 'العنوان التفصيلي:' : 'Address:'}
                  </span>
                  <span>{isArabic ? branch.address : branch.addressEn}</span>
                </div>
                
                {/* Copy button */}
                <button
                  onClick={(e) => handleCopyAddress(branch, e)}
                  title={isArabic ? 'نسخ العنوان' : 'Copy address'}
                  className={`p-1.5 rounded-full border text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isCopied 
                      ? 'bg-[#10B981] text-white border-[#059669]' 
                      : 'liquid-glass-btn text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-[#F8FAFC]'
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              {isCopied && (
                <span className="text-[10px] text-[#047857] dark:text-[#34D399] font-bold block mt-1 animate-fade-in">
                  {isArabic ? 'تم نسخ العنوان بنجاح!' : 'Address copied!'}
                </span>
              )}
            </div>

          </div>

          {/* Action Buttons Row */}
          <div className="space-y-2 pt-2 border-t border-[#161B26]/[0.08] dark:border-white/10">
            
            {/* Direct Book / Inquire at Branch */}
            <button
              onClick={() => handleBranchBooking(branch)}
              className="w-full py-2 sm:py-2.5 px-3 bg-gradient-to-r from-[#2B95FF] to-[#1A73E8] hover:brightness-110 text-white text-xs font-black rounded-full transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#2B95FF]/20 active:scale-95 cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>{isArabic ? 'احجز موعد أو استشارة في هذا الفرع' : 'Book at this Branch'}</span>
            </button>

            {/* Navigation & WhatsApp Row */}
            <div className="grid grid-cols-2 gap-2">
              
              {/* Google Maps Button */}
              <a
                href={branch.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="warm-pill-cta py-2 sm:py-2.5 px-2 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 text-center shadow-xs active:scale-95 cursor-pointer"
                title={isArabic ? `عرض موقع ${branch.name} على خرائط Google` : 'View on Google Maps'}
              >
                <Navigation className="w-3.5 h-3.5 text-[#2B95FF] shrink-0" />
                <span>{isArabic ? 'خرائط Google' : 'Google Maps'}</span>
              </a>

              {/* WhatsApp Button */}
              <a
                href={branch.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 sm:py-2.5 px-2 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-black rounded-full transition-all flex items-center justify-center gap-1.5 text-center shadow-md shadow-[#10B981]/20 active:scale-95 cursor-pointer"
                title={isArabic ? `تواصل واتساب مع ${branch.name}` : 'Chat on WhatsApp'}
              >
                <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span>
              </a>

            </div>

          </div>

        </div>
      </div>
    );
  }
};

export default BranchesDirectoryPage;
