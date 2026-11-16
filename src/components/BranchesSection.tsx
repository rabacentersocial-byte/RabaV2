import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  MapPin, 
  Navigation, 
  MessageCircle, 
  ChevronRight, 
  ChevronLeft, 
  Phone, 
  Clock, 
  Compass,
  SlidersHorizontal,
  LayoutGrid,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { getStoredBranchesData, BranchItem } from '../data/branchesData';
import { BranchMapPinGraphic } from './BranchMapPinGraphic';
import { useLanguage } from '../context/LanguageContext';

const LedClubBadge: React.FC = () => (
  <span 
    className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-xs font-black text-white dark:text-[#FBBF24] bg-gradient-to-r from-[#B45309] to-[#92400E] dark:bg-none dark:bg-[#141821]/95 border border-[#FDE68A] dark:border-[#F59E0B]/60 shadow-[0_0_12px_rgba(245,158,11,0.35)] ring-1 ring-[#F59E0B]/30 whitespace-nowrap select-none shrink-0 tracking-wide"
  >
    + نادي
  </span>
);

interface BranchesSectionProps {
  onSelectBranch?: (branch: BranchItem) => void;
  onOpenBranchesPage?: () => void;
}

export const BranchesSection: React.FC<BranchesSectionProps> = ({ onSelectBranch, onOpenBranchesPage }) => {
  const { isArabic } = useLanguage();
  const [branches, setBranches] = useState<BranchItem[]>(() => getStoredBranchesData());
  const [selectedCity, setSelectedCity] = useState<'all' | 'riyadh' | 'jeddah' | 'khobar' | 'ahsa' | 'kharj'>('all');
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  
  // Slider reference & state
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const movedDistanceRef = useRef(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sync with updates from other tabs or persistent storage
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

  const filteredBranches = branches.filter((b) => {
    if (selectedCity === 'all') return true;
    return b.city === selectedCity;
  });

  const riyadhCount = branches.filter(b => b.city === 'riyadh').length;
  const jeddahCount = branches.filter(b => b.city === 'jeddah').length;
  const khobarCount = branches.filter(b => b.city === 'khobar').length;
  const ahsaCount = branches.filter(b => b.city === 'ahsa').length;
  const kharjCount = branches.filter(b => b.city === 'kharj').length;

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
  }, [filteredBranches, viewMode, updateScrollState]);

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
    if (isArabic) target = -target;
    el.scrollTo({ left: target, behavior: 'smooth' });
  };

  // Drag handlers for desktop smooth dragging (cached offsetLeft avoids forced reflows)
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

  return (
    <section 
      id="branches" 
      className="py-10 sm:py-24 bg-transparent text-[#161B26] dark:text-[#F8FAFC] relative overflow-hidden transition-colors border-b border-[#161B26]/[0.08] dark:border-white/10 [content-visibility:auto] [contain-intrinsic-size:1px_600px]"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Background Ambience & Lighting */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(43,149,255,0.14)_0%,transparent_70%)] pointer-events-none transform-gpu -z-10" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.10)_0%,transparent_70%)] pointer-events-none transform-gpu -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title & Controls Bar */}
        <div className="mb-8 space-y-6">
          {/* Main Title Block */}
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-[#1263D6] dark:text-[#60AFFF] text-xs font-black mb-3 shadow-2xs">
              <Compass className="w-4 h-4 text-[#2B95FF]" />
              <span>{isArabic ? 'شبكة فروع مركز رابا' : 'RABA CENTER BRANCH NETWORK'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#161B26] dark:text-[#F8FAFC] tracking-tight leading-tight mb-3 [text-wrap:balance]">
              {isArabic ? (
                <>
                  <span className="inline-block">فروعنا المعتمدة</span>{' '}
                  <span className="inline-block bg-gradient-to-r from-[#2B95FF] via-[#1A73E8] to-[#8B5CF6] bg-clip-text text-transparent">
                    داخل المملكة العربية السعودية
                  </span>
                </>
              ) : (
                <>
                  Our Accredited Branches <span className="text-[#1263D6] dark:text-[#60AFFF]">Across Saudi Arabia</span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-[#4B5563] dark:text-[#94A3B8] font-medium leading-relaxed max-w-3xl [text-wrap:pretty]">
              {isArabic 
                ? 'مراكز وعيادات مجهزة بأعلى المعايير العالمية لتقديم خدمات التأهيل وتحليل السلوك في بيئة مهيأة وآمنة لطفلك في الرياض، وجدة، والخبر، والأحساء، والخرج.'
                : 'Clinics equipped with international clinical standards for behavioral and occupational rehabilitation across Riyadh, Jeddah, Al-Khobar, Al-Ahsa, and Al-Kharj.'}
            </p>

            {onOpenBranchesPage && (
              <div className="pt-3">
                <button
                  onClick={onOpenBranchesPage}
                  className="inline-flex items-center gap-2 px-4 py-2 min-h-[38px] rounded-full text-xs sm:text-sm font-bold liquid-glass-btn text-[#1263D6] dark:text-[#60AFFF] transition-colors cursor-pointer shadow-xs active:scale-95"
                >
                  <MapPin className="w-4 h-4 text-[#2B95FF]" />
                  <span>{isArabic ? 'عرض صفحة الفروع المخصصة مع خيارات العرض المتقدمة ←' : 'Explore Dedicated Branches Directory Page →'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Controls: Filter tabs & Slider Navigation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-[#161B26]/[0.08] dark:border-white/10">
            
            {/* City Filter Tabs */}
            <div className="liquid-glass-pill p-1.5 flex items-center gap-1 shadow-xs overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSelectedCity('all')}
                className={`px-3.5 py-2 min-h-[36px] rounded-full text-xs sm:text-sm font-black transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCity === 'all'
                    ? 'warm-pill-cta shadow-md'
                    : 'text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-white'
                }`}
              >
                <span>{isArabic ? 'كافة الفروع' : 'All Branches'}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedCity === 'all' ? 'bg-white/20 text-white' : 'bg-[#161B26]/[0.08] dark:bg-white/10 text-[#4B5563] dark:text-[#94A3B8]'
                }`}>
                  {branches.length}
                </span>
              </button>

              <button
                onClick={() => setSelectedCity('riyadh')}
                className={`px-3.5 py-2 min-h-[36px] rounded-full text-xs sm:text-sm font-black transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCity === 'riyadh'
                    ? 'warm-pill-cta shadow-xs'
                    : 'text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-white'
                }`}
              >
                <span>{isArabic ? 'الرياض' : 'Riyadh'}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedCity === 'riyadh' ? 'bg-white/20 text-white' : 'bg-[#161B26]/[0.08] dark:bg-white/10 text-[#4B5563] dark:text-[#94A3B8]'
                }`}>
                  {riyadhCount}
                </span>
              </button>

              <button
                onClick={() => setSelectedCity('jeddah')}
                className={`px-3.5 py-2 min-h-[36px] rounded-full text-xs sm:text-sm font-black transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCity === 'jeddah'
                    ? 'warm-pill-cta shadow-xs'
                    : 'text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-white'
                }`}
              >
                <span>{isArabic ? 'جدة' : 'Jeddah'}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedCity === 'jeddah' ? 'bg-white/20 text-white' : 'bg-[#161B26]/[0.08] dark:bg-white/10 text-[#4B5563] dark:text-[#94A3B8]'
                }`}>
                  {jeddahCount}
                </span>
              </button>

              <button
                onClick={() => setSelectedCity('khobar')}
                className={`px-3.5 py-2 min-h-[36px] rounded-full text-xs sm:text-sm font-black transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCity === 'khobar'
                    ? 'warm-pill-cta shadow-xs'
                    : 'text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-white'
                }`}
              >
                <span>{isArabic ? 'الخبر' : 'Al-Khobar'}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedCity === 'khobar' ? 'bg-white/20 text-white' : 'bg-[#161B26]/[0.08] dark:bg-white/10 text-[#4B5563] dark:text-[#94A3B8]'
                }`}>
                  {khobarCount}
                </span>
              </button>

              <button
                onClick={() => setSelectedCity('ahsa')}
                className={`px-3.5 py-2 min-h-[36px] rounded-full text-xs sm:text-sm font-black transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCity === 'ahsa'
                    ? 'warm-pill-cta shadow-xs'
                    : 'text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-white'
                }`}
              >
                <span>{isArabic ? 'الأحساء' : 'Al-Ahsa'}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedCity === 'ahsa' ? 'bg-white/20 text-white' : 'bg-[#161B26]/[0.08] dark:bg-white/10 text-[#4B5563] dark:text-[#94A3B8]'
                }`}>
                  {ahsaCount}
                </span>
              </button>

              <button
                onClick={() => setSelectedCity('kharj')}
                className={`px-3.5 py-2 min-h-[36px] rounded-full text-xs sm:text-sm font-black transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCity === 'kharj'
                    ? 'warm-pill-cta shadow-xs'
                    : 'text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-white'
                }`}
              >
                <span>{isArabic ? 'الخرج' : 'Al-Kharj'}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedCity === 'kharj' ? 'bg-white/20 text-white' : 'bg-[#161B26]/[0.08] dark:bg-white/10 text-[#4B5563] dark:text-[#94A3B8]'
                }`}>
                  {kharjCount}
                </span>
              </button>
            </div>

            {/* View Mode Toggle & Slider Navigation */}
            <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
              {/* View Mode Toggle (Slider / Grid) */}
              <div className="liquid-glass-pill p-1 rounded-full flex items-center shadow-xs">
                <button
                  onClick={() => setViewMode('slider')}
                  className={`w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                    viewMode === 'slider' 
                      ? 'warm-pill-cta shadow-xs' 
                      : 'text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-white'
                  }`}
                  title={isArabic ? 'عرض سلايدر تفاعلي' : 'Slider View'}
                  aria-label={isArabic ? 'عرض سلايدر تفاعلي' : 'Slider View'}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                    viewMode === 'grid' 
                      ? 'warm-pill-cta shadow-xs' 
                      : 'text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-white'
                  }`}
                  title={isArabic ? 'عرض شبكي' : 'Grid View'}
                  aria-label={isArabic ? 'عرض شبكي' : 'Grid View'}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              {/* Slider Next / Prev Arrows */}
              {viewMode === 'slider' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleScroll('prev')}
                    disabled={!canScrollPrev}
                    aria-label={isArabic ? 'الفرع السابق' : 'Previous branch'}
                    className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full liquid-glass-btn text-[#161B26] dark:text-[#F8FAFC] flex items-center justify-center shadow-xs transition-transform duration-200 cursor-pointer ${
                      canScrollPrev 
                        ? 'active:scale-95' 
                        : 'opacity-40 cursor-not-allowed'
                    }`}
                  >
                    {isArabic ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => handleScroll('next')}
                    disabled={!canScrollNext}
                    aria-label={isArabic ? 'الفرع التالي' : 'Next branch'}
                    className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full liquid-glass-btn text-[#161B26] dark:text-[#F8FAFC] flex items-center justify-center shadow-xs transition-transform duration-200 cursor-pointer ${
                      canScrollNext 
                        ? 'active:scale-95' 
                        : 'opacity-40 cursor-not-allowed'
                    }`}
                  >
                    {isArabic ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* SLIDER / GRID CONTAINER */}
        {viewMode === 'slider' ? (
          <div className="relative">
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
              {filteredBranches.map((branch) => (
                <div
                  key={branch.id}
                  className="w-[76vw] min-w-[260px] max-w-[310px] sm:w-[350px] sm:max-w-none md:w-[365px] shrink-0 snap-start liquid-glass-card rounded-[28px] overflow-hidden shadow-lg hover:border-[#2B95FF]/50 transition-colors duration-300 flex flex-col justify-between group relative"
                >
                  {/* Top: 3D Map Pin Graphic */}
                  <div className="relative h-36 sm:h-56 md:h-60 overflow-hidden bg-[#EDE9E0] dark:bg-[#161C2A]">
                    <BranchMapPinGraphic branchName={branch.name} />

                    {/* City Tag Indicator Overlay */}
                    <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 bg-white/90 dark:bg-[#141821]/85 backdrop-blur-md px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-[#161B26] dark:text-[#F8FAFC] border border-[#161B26]/10 dark:border-white/15 flex items-center gap-1 sm:gap-1.5 shadow-xs">
                      <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#2B95FF]" />
                      <span>{isArabic ? branch.cityNameAr : branch.cityNameEn}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-5">
                    
                    <div className="space-y-2.5 sm:space-y-3">
                      {/* Region Tag Pill */}
                      <div className="flex items-center justify-between">
                        <span className={`inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black border ${branch.badgeColorClass}`}>
                          {isArabic ? branch.regionBadgeAr : branch.regionBadgeEn}
                        </span>

                        <span className="text-[10px] sm:text-[11px] text-[#4B5563] dark:text-[#94A3B8] font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#2B95FF]" />
                          <span>{isArabic ? branch.hoursAr : branch.hoursEn}</span>
                        </span>
                      </div>

                      {/* Branch Name with single LedClubBadge */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-xl font-black text-[#161B26] dark:text-[#F8FAFC] group-hover:text-[#1263D6] dark:group-hover:text-[#60AFFF] transition-colors leading-snug line-clamp-1">
                          {isArabic ? branch.name : branch.nameEn}
                        </h3>
                        {branch.hasClubBadge && <LedClubBadge />}
                      </div>

                      {/* Branch Address */}
                      <div className="text-[11px] sm:text-xs text-[#4B5563] dark:text-[#94A3B8] leading-relaxed min-h-[36px] sm:min-h-[48px] line-clamp-2">
                        <span className="font-bold text-[#161B26] dark:text-[#F8FAFC] ml-1">{isArabic ? 'العنوان:' : 'Address:'}</span>
                        <span>{isArabic ? branch.address : branch.addressEn}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2 border-t border-[#161B26]/[0.08] dark:border-white/10">
                      
                      {/* Google Maps Button */}
                      <a
                        href={branch.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 sm:py-3 px-2 sm:px-3 warm-pill-cta text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-1 sm:gap-1.5 text-center shadow-xs active:scale-95 cursor-pointer"
                        title={isArabic ? `عرض موقع ${branch.name} على خرائط Google` : 'View on Google Maps'}
                      >
                        <Navigation className="w-3.5 h-3.5 text-white shrink-0" />
                        <span>{isArabic ? 'خرائط Google' : 'Google Maps'}</span>
                      </a>

                      {/* WhatsApp Button */}
                      <a
                        href={branch.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 sm:py-3 px-2 sm:px-3 bg-gradient-to-r from-[#047857] to-[#065F46] hover:opacity-95 text-white text-xs font-black rounded-full transition-opacity flex items-center justify-center gap-1 sm:gap-1.5 text-center shadow-lg shadow-[#10B981]/20 active:scale-95 cursor-pointer"
                        title={isArabic ? `تواصل واتساب مع ${branch.name}` : 'Chat on WhatsApp'}
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white shrink-0" />
                        <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span>
                      </a>

                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Slider Dot Indicators */}
            <div className="flex justify-center items-center gap-1 mt-6">
              {filteredBranches.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToIndex(idx)}
                  aria-label={`الانتقال للفرع ${idx + 1}`}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer p-0 m-0 bg-transparent border-0 focus:outline-none"
                >
                  <span
                    className={`block h-2 rounded-full transition-colors duration-200 ${
                      currentIndex === idx 
                        ? 'w-8 bg-[#2B95FF]' 
                        : 'w-2 bg-[#161B26]/20 dark:bg-white/25 hover:bg-[#161B26]/40 dark:hover:bg-white/40'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredBranches.map((branch) => (
              <div
                key={branch.id}
                className="liquid-glass-card rounded-[28px] overflow-hidden shadow-lg hover:border-[#2B95FF]/50 transition-colors duration-300 flex flex-col justify-between group relative"
              >
                <div className="relative h-36 sm:h-56 overflow-hidden bg-[#EDE9E0] dark:bg-[#161C2A]">
                  <BranchMapPinGraphic branchName={branch.name} />
                  <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-white/90 dark:bg-[#141821]/85 backdrop-blur-md px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-[#161B26] dark:text-[#F8FAFC] border border-[#161B26]/10 dark:border-white/15 flex items-center gap-1 shadow-xs">
                    <MapPin className="w-3 h-3 text-[#2B95FF]" />
                    <span>{isArabic ? branch.cityNameAr : branch.cityNameEn}</span>
                  </div>
                </div>

                <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                  <div className="space-y-2 sm:space-y-2.5">
                    {/* Region Tag Pill */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black border ${branch.badgeColorClass}`}>
                        {isArabic ? branch.regionBadgeAr : branch.regionBadgeEn}
                      </span>

                      <span className="text-[10px] text-[#4B5563] dark:text-[#94A3B8] font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#2B95FF]" />
                        <span>{isArabic ? branch.hoursAr : branch.hoursEn}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-black text-[#161B26] dark:text-[#F8FAFC] group-hover:text-[#1263D6] dark:group-hover:text-[#60AFFF] transition-colors leading-snug line-clamp-1">
                        {isArabic ? branch.name : branch.nameEn}
                      </h3>
                      {branch.hasClubBadge && <LedClubBadge />}
                    </div>

                    <p className="text-[11px] sm:text-xs text-[#4B5563] dark:text-[#94A3B8] leading-relaxed min-h-[36px] sm:min-h-[48px] line-clamp-2">
                      <span className="font-bold text-[#161B26] dark:text-[#F8FAFC] ml-1">{isArabic ? 'العنوان:' : 'Address:'}</span>
                      <span>{isArabic ? branch.address : branch.addressEn}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#161B26]/[0.08] dark:border-white/10">
                    <a
                      href={branch.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 sm:py-2.5 px-2 warm-pill-cta text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-1 text-center cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5 text-white" />
                      <span>{isArabic ? 'خرائط Google' : 'Maps'}</span>
                    </a>

                    <a
                      href={branch.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 sm:py-2.5 px-2 bg-gradient-to-r from-[#047857] to-[#065F46] hover:opacity-95 text-white text-xs font-black rounded-full transition-opacity flex items-center justify-center gap-1 text-center cursor-pointer shadow-md shadow-[#10B981]/20"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Unified Contact Bar below Branches */}
        <div className="mt-8 sm:mt-12 obsidian-anchor-card rounded-[28px] p-4 sm:p-6 sm:px-8 relative overflow-hidden">
          {/* Subtle ambient lighting glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(43,149,255,0.20)_0%,transparent_70%)] pointer-events-none transform-gpu" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.14)_0%,transparent_70%)] pointer-events-none transform-gpu" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-6 relative z-10">
            
            {/* Phone Info Block (Clickable tap-to-call) */}
            <a 
              href="tel:0575100100"
              className="flex items-center justify-between sm:justify-start gap-3 p-2 sm:p-0 rounded-xl hover:bg-[#161B26]/5 dark:hover:bg-white/5 active:bg-[#161B26]/10 dark:active:bg-white/10 transition-colors group cursor-pointer"
              title={isArabic ? 'اتصال مباشر بالرقم الموحد' : 'Call unified hotline'}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#2B95FF]/15 group-hover:bg-[#2B95FF]/25 border border-[#2B95FF]/30 flex items-center justify-center text-[#1263D6] dark:text-[#2B95FF] shrink-0 shadow-xs backdrop-blur-xs transition-colors">
                  <Phone className="w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] sm:text-xs text-[#4B5563] dark:text-[#94A3B8] font-bold">
                      {isArabic ? 'الرقم الموحد لكافة فروع المملكة:' : 'Unified Branch Call Center (KSA):'}
                    </span>
                  </div>
                  <div className="text-base sm:text-xl font-black text-[#161B26] dark:text-white group-hover:text-[#1263D6] dark:group-hover:text-[#60AFFF] transition-colors font-mono tracking-wider mt-0.5" dir="ltr">
                    0575100100
                  </div>
                </div>
              </div>

              {/* Instant Call indicator pill on mobile */}
              <span className="sm:hidden text-[10.5px] font-black px-2.5 py-1 rounded-full bg-white/90 dark:bg-white/10 text-[#161B26] dark:text-white border border-[#161B26]/10 dark:border-white/15 group-hover:bg-[#1463D6] group-hover:text-white transition-colors">
                {isArabic ? 'اتصال فوري' : 'Call'}
              </span>
            </a>

            {/* Action CTA Button */}
            <div className="w-full sm:w-auto shrink-0">
              <a
                href="https://wa.me/966575100100?text=السلام%20عليكم،%20أود%20الاستفسار%20عن%20أقرب%20فرع%20لمركز%20رابا%20في%20المملكة"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3.5 bg-gradient-to-r from-[#1668DC] to-[#1152B8] hover:opacity-95 text-white font-black rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 sm:gap-2.5 transition-[transform,opacity] shadow-md shadow-[#1668DC]/30 active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white text-white shrink-0" />
                <span className="font-black tracking-tight">{isArabic ? 'استشرنا لتحديد أقرب فرع لطفلك' : 'Find Closest Branch'}</span>
                {isArabic ? (
                  <ArrowLeft className="w-3.5 h-3.5 text-white shrink-0 opacity-80" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-white shrink-0 opacity-80" />
                )}
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
