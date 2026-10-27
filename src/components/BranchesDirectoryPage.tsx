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
    className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-black text-amber-300 bg-[#181005]/95 border-2 border-amber-400 shadow-[0_0_12px_#f59e0b,inset_0_0_7px_rgba(245,158,11,0.45)] ring-2 ring-amber-400/35 whitespace-nowrap select-none shrink-0 tracking-wide"
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

  const updateScrollState = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const current = Math.abs(el.scrollLeft);

    setCanScrollPrev(current > 15);
    setCanScrollNext(current < maxScroll - 15);

    const slideWidth = getSlideWidth();
    const index = Math.round(current / slideWidth);
    setCurrentIndex(Math.min(Math.max(0, index), filteredBranches.length - 1));
  }, [filteredBranches.length]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [filteredBranches, updateScrollState, viewMode]);

  const handleScroll = (direction: 'prev' | 'next') => {
    const el = sliderRef.current;
    if (!el) return;
    const scrollAmount = getSlideWidth();

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
    const slideWidth = getSlideWidth();
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
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-white transition-colors" dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* 1. TOP BREADCRUMB & BACK HEADER BAR */}
      <div className="liquid-glass-panel border-b border-white/80 dark:border-white/10 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Breadcrumb path */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 hover:text-[#2E86EB] dark:hover:text-[#2E86EB] transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{isArabic ? 'الرئيسية' : 'Home'}</span>
            </button>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-slate-900 dark:text-white font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2E86EB]" />
              <span>{isArabic ? 'دليل فروع مركز رابا' : 'Branches Directory'}</span>
            </span>
          </nav>

          {/* Back to Home Button */}
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-[#dff1ec] dark:hover:bg-teal-950/60 text-slate-700 dark:text-slate-200 hover:text-[#0d5c52] dark:hover:text-[#2dd4bf] text-xs sm:text-sm font-bold border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
          >
            {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isArabic ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </button>
        </div>
      </div>

      {/* 2. HERO INTRO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#dff1ec]/50 via-transparent to-transparent dark:from-[#08221d] dark:via-transparent pt-10 sm:pt-14 pb-8 sm:pb-12 border-b border-slate-200/80 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 border border-[#0d5c52]/20 dark:border-[#2dd4bf]/20 text-[#0d5c52] dark:text-[#2dd4bf] text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isArabic ? 'شبكة مراكز رابا المعتمدة عبر المملكة' : 'Accredited RABA Centers Across Saudi Arabia'}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#0f2d29] dark:text-white tracking-tight leading-tight">
              {isArabic ? (
                <>فروعنا بالمملكة العربية السعودية<span className="text-[#0D6D54] dark:text-[#2DD4BF]">.</span></>
              ) : (
                <>Our Branches in Saudi Arabia<span className="text-[#0D6D54] dark:text-[#2DD4BF]">.</span></>
              )}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {isArabic 
                ? 'ننتشر في أهم مدن المملكة لنكون الأقرب لطفلك، بمراكز مجهزة بأعلى المعايير العالمية وغرف التكامل الحسي ونوادي التأهيل التفاعلية، مع كفاءات إكلينيكية معتمدة.'
                : 'Conveniently located across major Saudi cities with state-of-the-art sensory gyms, rehabilitation clubs, and licensed clinical specialists.'}
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200">
                <Building2 className="w-4 h-4 text-[#0D6D54] dark:text-[#00E5BE]" />
                <span>{branches.length} {isArabic ? 'فرعاً معتمداً' : 'Branches'}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200">
                <MapPin className="w-4 h-4 text-cyan-500" />
                <span>5 {isArabic ? 'مدن رئيسية' : 'Major Cities'}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200">
                <Sparkles className="w-4 h-4 text-amber-500" />
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
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 right-3.5 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isArabic ? 'ابحث باسم الفرع، الحي، المدينة، أو الشارع...' : 'Search by branch name, city, district...'}
              className="w-full h-11 pr-10 pl-10 rtl:pr-10 rtl:pl-10 ltr:pl-10 ltr:pr-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0D6D54] dark:focus:ring-[#00E5BE] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 -translate-y-1/2 left-3 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
                aria-label="مسح البحث"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Mode Toggle and Slider Controls */}
          <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
            
            {/* View Mode Switcher: Slider vs Grid */}
            <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-white/15 shadow-xs">
              <button
                onClick={() => setViewMode('slider')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'slider'
                    ? 'bg-[#0D6D54] dark:bg-[#00E5BE] text-white dark:text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={isArabic ? 'عرض كسلايدر أفقي' : 'Slider View'}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{isArabic ? 'سلايدر' : 'Slider'}</span>
              </button>

              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#0D6D54] dark:bg-[#00E5BE] text-white dark:text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
                  className={`w-9 h-9 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs transition-all cursor-pointer ${
                    canScrollPrev 
                      ? 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white active:scale-95' 
                      : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  {isArabic ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => handleScroll('next')}
                  disabled={!canScrollNext}
                  aria-label={isArabic ? 'الفرع التالي' : 'Next branch'}
                  className={`w-9 h-9 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs transition-all cursor-pointer ${
                    canScrollNext 
                      ? 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white active:scale-95' 
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-200/80 dark:border-white/10">
          
          {/* City Buttons Pill Carousel */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
            
            {/* All */}
            <button
              onClick={() => setSelectedCity('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCity === 'all'
                  ? 'bg-[#0D6D54] dark:bg-[#00E5BE] text-white dark:text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10'
              }`}
            >
              <span>{isArabic ? 'جميع الفروع' : 'All Branches'}</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-md font-bold ${
                selectedCity === 'all' ? 'bg-white/20 dark:bg-slate-950/20 text-white dark:text-slate-950' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
              }`}>
                {totalCount}
              </span>
            </button>

            {/* Riyadh */}
            <button
              onClick={() => setSelectedCity('riyadh')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCity === 'riyadh'
                  ? 'bg-[#0D6D54] dark:bg-[#00E5BE] text-white dark:text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10'
              }`}
            >
              <span>{isArabic ? 'الرياض' : 'Riyadh'}</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-md font-bold ${
                selectedCity === 'riyadh' ? 'bg-white/20 dark:bg-slate-950/20 text-white dark:text-slate-950' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
              }`}>
                {riyadhCount}
              </span>
            </button>

            {/* Jeddah */}
            <button
              onClick={() => setSelectedCity('jeddah')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCity === 'jeddah'
                  ? 'bg-[#0D6D54] dark:bg-[#00E5BE] text-white dark:text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10'
              }`}
            >
              <span>{isArabic ? 'جدة' : 'Jeddah'}</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-md font-bold ${
                selectedCity === 'jeddah' ? 'bg-white/20 dark:bg-slate-950/20 text-white dark:text-slate-950' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
              }`}>
                {jeddahCount}
              </span>
            </button>

            {/* Khobar */}
            <button
              onClick={() => setSelectedCity('khobar')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCity === 'khobar'
                  ? 'bg-[#0D6D54] dark:bg-[#00E5BE] text-white dark:text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10'
              }`}
            >
              <span>{isArabic ? 'الخبر' : 'Khobar'}</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-md font-bold ${
                selectedCity === 'khobar' ? 'bg-white/20 dark:bg-slate-950/20 text-white dark:text-slate-950' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
              }`}>
                {khobarCount}
              </span>
            </button>

            {/* Al-Ahsa */}
            <button
              onClick={() => setSelectedCity('ahsa')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCity === 'ahsa'
                  ? 'bg-[#0D6D54] dark:bg-[#00E5BE] text-white dark:text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10'
              }`}
            >
              <span>{isArabic ? 'الأحساء' : 'Al-Ahsa'}</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-md font-bold ${
                selectedCity === 'ahsa' ? 'bg-white/20 dark:bg-slate-950/20 text-white dark:text-slate-950' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
              }`}>
                {ahsaCount}
              </span>
            </button>

            {/* Al-Kharj */}
            <button
              onClick={() => setSelectedCity('kharj')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCity === 'kharj'
                  ? 'bg-[#0D6D54] dark:bg-[#00E5BE] text-white dark:text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10'
              }`}
            >
              <span>{isArabic ? 'الخرج' : 'Al-Kharj'}</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-md font-bold ${
                selectedCity === 'kharj' ? 'bg-white/20 dark:bg-slate-950/20 text-white dark:text-slate-950' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
              }`}>
                {kharjCount}
              </span>
            </button>

          </div>

          {/* "+ نادي رابا" Filter Toggle Chip */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setOnlyClub(!onlyClub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-1.5 ${
                onlyClub
                  ? 'bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isArabic ? 'فروع تضم نادي تأهيلي (+ نادي)' : 'Branches with Clubs'}</span>
              {onlyClub && <Check className="w-3 h-3 text-amber-500" />}
            </button>
          </div>

        </div>

        {/* Results Counter & Active Filter Tags */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 py-3">
          <div className="flex items-center gap-2">
            <span>{isArabic ? 'النتائج المعروضة:' : 'Showing:'}</span>
            <span className="font-black text-slate-900 dark:text-white">{filteredBranches.length} {isArabic ? 'فرع' : 'branches'}</span>
          </div>
          {(selectedCity !== 'all' || onlyClub || searchQuery) && (
            <button
              onClick={resetFilters}
              className="text-emerald-700 dark:text-[#00E5BE] font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>{isArabic ? 'إعادة ضبط الفلاتر' : 'Reset filters'}</span>
            </button>
          )}
        </div>

        {/* 4. BRANCH CARDS DISPLAY: SLIDER OR GRID */}
        {filteredBranches.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-white dark:bg-slate-900/60 rounded-3xl border border-dashed border-slate-300 dark:border-white/15 my-6">
            <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              {isArabic ? 'لم يتم العثور على فروع مطابقة' : 'No matching branches found'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
              {isArabic 
                ? 'جرب البحث باسم مدينة أخرى أو إزالة الفلاتر لعرض كافة فروع مركز رابا.'
                : 'Try adjusting your search query or reset filters to view all RABA Center branches.'}
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-[#0D6D54] dark:bg-[#00E5BE] text-white dark:text-slate-950 rounded-xl text-xs font-black shadow-xs cursor-pointer"
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
            <div className="flex justify-center items-center gap-2 mt-6">
              {filteredBranches.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToIndex(idx)}
                  aria-label={`الانتقال للفرع ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx 
                      ? 'w-8 bg-[#0D6D54] dark:bg-[#00E5BE]' 
                      : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-slate-400'
                  }`}
                />
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
      <section className="bg-gradient-to-b from-transparent to-slate-100/80 dark:to-[#071d18]/50 border-t border-slate-200/80 dark:border-white/10 py-12 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {isArabic ? 'هل تحتاج مساعدة في اختيار الفرع الأنسب لطفلك؟' : 'Need help selecting the closest branch?'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {isArabic 
              ? 'فريق خدمة المستفيدين متاح لمساعدتكم في اختيار الفرع الأقرب، حجز مواعيد التقييم الأولي، والإجابة عن كافة استفساراتكم.'
              : 'Our customer support team is available to help you choose the best branch, schedule intake evaluations, and answer your questions.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="https://wa.me/966575100100?text=السلام%20عليكم،%20أود%20المساعدة%20في%20اختيار%20أقرب%20فرع%20لمركز%20رابا%20لطفلي"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5BE] hover:bg-[#00ffd2] text-slate-950 text-xs font-black shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>{isArabic ? 'تواصل مع الدعم عبر واتساب' : 'Chat with Support on WhatsApp'}</span>
            </a>
            <a
              href="tel:0575100100"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-100 text-slate-900 dark:text-white text-xs font-bold border border-slate-200 dark:border-white/15 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#0D6D54] dark:text-[#00E5BE]" />
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
        className={`bg-white dark:bg-[#111827] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-lg hover:border-blue-500/50 dark:hover:border-[#2E86EB]/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative ${
          viewMode === 'slider' ? 'w-[76vw] min-w-[260px] max-w-[310px] sm:w-[350px] sm:max-w-none md:w-[365px] shrink-0 snap-start' : 'w-full'
        }`}
      >
        {/* Top: 3D Map Pin Graphic with Ambient Lighting */}
        <div className="relative h-36 sm:h-56 md:h-60 overflow-hidden bg-slate-100 dark:bg-[#0E1526]">
          <BranchMapPinGraphic branchName={branch.name} />

          {/* City Tag Indicator Overlay */}
          <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 bg-slate-900/85 backdrop-blur-md px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-slate-200 border border-white/10 flex items-center gap-1 sm:gap-1.5 shadow-md">
            <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#2E86EB]" />
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
        <div className="p-3.5 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-5 bg-white dark:bg-[#111827]">
          
          <div className="space-y-2.5 sm:space-y-3">
            {/* Region Tag Pill & Working Hours */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className={`inline-block px-2.5 sm:px-3 py-0.5 sm:py-0.8 rounded-full text-[10px] sm:text-xs font-black border ${branch.badgeColorClass}`}>
                {isArabic ? branch.regionBadgeAr : branch.regionBadgeEn}
              </span>

              <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#2E86EB] dark:text-[#2E86EB]" />
                <span>{isArabic ? branch.hoursAr : branch.hoursEn}</span>
              </span>
            </div>

            {/* Branch Name */}
            <div>
              <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-[#2E86EB] dark:group-hover:text-[#2E86EB] transition-colors leading-snug line-clamp-1">
                {isArabic ? branch.name : branch.nameEn}
              </h3>
            </div>

            {/* Branch Address with Copy action */}
            <div className="bg-slate-50 dark:bg-white/[0.04] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-white/5 relative group/addr">
              <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                <div className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed pr-1 rtl:pr-1 ltr:pl-1 line-clamp-2">
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                    {isArabic ? 'العنوان التفصيلي:' : 'Address:'}
                  </span>
                  <span>{isArabic ? branch.address : branch.addressEn}</span>
                </div>
                
                {/* Copy button */}
                <button
                  onClick={(e) => handleCopyAddress(branch, e)}
                  title={isArabic ? 'نسخ العنوان' : 'Copy address'}
                  className={`p-1.5 rounded-lg border text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isCopied 
                      ? 'bg-emerald-500 text-white border-emerald-600' 
                      : 'bg-white dark:bg-white/10 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              {isCopied && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-1 animate-fade-in">
                  {isArabic ? 'تم نسخ العنوان بنجاح!' : 'Address copied!'}
                </span>
              )}
            </div>

          </div>

          {/* Action Buttons Row */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
            
            {/* Direct Book / Inquire at Branch */}
            <button
              onClick={() => handleBranchBooking(branch)}
              className="w-full py-2 sm:py-2.5 px-3 bg-[#2E86EB] hover:bg-[#2575d0] dark:bg-[#2E86EB] dark:hover:bg-[#2575d0] text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
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
                className="py-2 sm:py-2.5 px-2 bg-[#0F2438] hover:bg-[#15324d] text-white text-xs font-bold rounded-xl border border-white/15 hover:border-cyan-500/40 transition-all flex items-center justify-center gap-1.5 text-center shadow-xs active:scale-95 cursor-pointer"
                title={isArabic ? `عرض موقع ${branch.name} على خرائط Google` : 'View on Google Maps'}
              >
                <Navigation className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{isArabic ? 'خرائط Google' : 'Google Maps'}</span>
              </a>

              {/* WhatsApp Button */}
              <a
                href={branch.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 sm:py-2.5 px-2 bg-[#00E5BE] hover:bg-[#00ffd2] text-slate-950 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 text-center shadow-md shadow-teal-500/20 active:scale-95 cursor-pointer"
                title={isArabic ? `تواصل واتساب مع ${branch.name}` : 'Chat on WhatsApp'}
              >
                <MessageCircle className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
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
