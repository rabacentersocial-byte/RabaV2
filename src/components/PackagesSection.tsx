import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Heart, 
  Sparkles, 
  Brain, 
  MessageSquare, 
  Activity, 
  ShieldCheck,
  Zap,
  Tag,
  Sun,
  Gift,
  AlertCircle
} from 'lucide-react';
import { THERAPY_PACKAGES, getStoredPackages } from '../data/mockData';
import { TherapyPackage } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { TamaraLogo, EmkanLogo } from './InstallmentLogos';

interface PackagesSectionProps {
  onSelectPackage: (pkg: TherapyPackage) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({ onSelectPackage }) => {
  const { isArabic } = useLanguage();
  const [packages, setPackages] = useState<TherapyPackage[]>(() => getStoredPackages());

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Slider refs and states
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const movedDistanceRef = useRef(0);

  // Sync with updates from Admin Dashboard
  useEffect(() => {
    const handleUpdate = () => {
      setPackages(getStoredPackages());
    };
    window.addEventListener('raba_packages_updated', handleUpdate);
    return () => window.removeEventListener('raba_packages_updated', handleUpdate);
  }, []);

  // Category filter tabs matching the user's reference design
  const categories = useMemo(() => [
    { id: 'all', labelAr: 'جميع الباقات', labelEn: 'All packages' },
    { id: 'summer', labelAr: 'باقات الصيف ☀️', labelEn: 'Summer Packages ☀️' },
    { id: 'assessment', labelAr: 'التقييم والتشخيص', labelEn: 'Preventive Care' },
    { id: 'sensory', labelAr: 'العلاج الوظيفي والحسي', labelEn: 'Cardiology & Sensory' },
    { id: 'speech', labelAr: 'النطق والتخاطب', labelEn: 'Speech & Language' },
    { id: 'aba', labelAr: 'تعديل السلوك ABA', labelEn: 'Mental Health & ABA' },
  ], []);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    if (selectedCategory === 'all') {
      return packages;
    }
    return packages.filter((pkg) => pkg.category === selectedCategory);
  }, [packages, selectedCategory]);

  const rafIdRef = useRef<number | null>(null);
  const maxScrollRef = useRef(0);
  const containerOffsetLeftRef = useRef(0);

  // Update scroll button states
  const updateScrollButtons = useCallback(() => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const el = sliderRef.current;
      if (!el) return;
      const maxScroll = maxScrollRef.current;
      const currentScroll = Math.abs(el.scrollLeft);

      setCanScrollLeft(currentScroll > 10);
      setCanScrollRight(currentScroll < maxScroll - 10);
    });
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const measure = () => {
      maxScrollRef.current = Math.max(0, el.scrollWidth - el.clientWidth);
      containerOffsetLeftRef.current = el.offsetLeft;
      updateScrollButtons();
    };

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (ro) {
      ro.observe(el);
    } else {
      window.addEventListener('resize', measure, { passive: true });
    }
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      ro?.disconnect();
      window.removeEventListener('resize', measure);
      el.removeEventListener('scroll', updateScrollButtons);
    };
  }, [updateScrollButtons, filteredPackages]);

  // Smooth scroll handler
  const handleScroll = (direction: 'next' | 'prev') => {
    const el = sliderRef.current;
    if (!el) return;
    const scrollAmount = 405; // Card width + gap
    
    let delta = scrollAmount;
    if (direction === 'prev') {
      delta = -scrollAmount;
    }
    if (isArabic) {
      delta = -delta;
    }

    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  // Drag to scroll handlers (cached offsetLeft prevents layout thrashing)
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

  // Color theme helper harmonized with Raba Logo palette
  const getThemeStyles = (colorTheme: string, isPopular?: boolean) => {
    switch (colorTheme) {
      case 'rose':
        return {
          headerBg: 'bg-[#8B5CF6]/[0.08] dark:bg-[#8B5CF6]/[0.08]',
          iconBg: 'bg-white/85 dark:bg-white/10 text-[#6D28D9] dark:text-[#A78BFA]',
          categoryText: 'text-[#6D28D9] dark:text-[#A78BFA]',
          titleText: 'text-[#161B26] dark:text-[#F8FAFC]',
          checkBg: 'bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA]',
          btnBg: 'warm-pill-cta',
          icon: <Heart className="w-5 h-5 fill-[#8B5CF6]/20 stroke-[2.2]" />
        };
      case 'purple':
        return {
          headerBg: 'bg-[#8B5CF6]/[0.06] dark:bg-white/[0.05]',
          iconBg: 'bg-white/85 dark:bg-white/10 text-[#6D28D9] dark:text-[#A78BFA]',
          categoryText: 'text-[#6D28D9] dark:text-[#A78BFA]',
          titleText: 'text-[#161B26] dark:text-[#F8FAFC]',
          checkBg: 'bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA]',
          btnBg: 'warm-pill-cta',
          icon: <Sparkles className="w-5 h-5 fill-[#8B5CF6]/20 stroke-[2.2]" />
        };
      case 'amber':
        return {
          headerBg: 'bg-[#F59E0B]/[0.08] dark:bg-[#F59E0B]/[0.06]',
          iconBg: 'bg-white/85 dark:bg-white/10 text-[#B45309] dark:text-[#FBBF24]',
          categoryText: 'text-[#B45309] dark:text-[#FBBF24]',
          titleText: 'text-[#161B26] dark:text-[#F8FAFC]',
          checkBg: 'bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24]',
          btnBg: 'warm-pill-cta',
          icon: <Brain className="w-5 h-5 stroke-[2.2]" />
        };
      case 'sky':
        return {
          headerBg: 'bg-[#2B95FF]/[0.08] dark:bg-[#2B95FF]/[0.08]',
          iconBg: 'bg-white/85 dark:bg-white/10 text-[#1263D6] dark:text-[#60AFFF]',
          categoryText: 'text-[#1263D6] dark:text-[#60AFFF]',
          titleText: 'text-[#161B26] dark:text-[#F8FAFC]',
          checkBg: 'bg-[#2B95FF]/15 text-[#1263D6] dark:text-[#60AFFF]',
          btnBg: 'warm-pill-cta',
          icon: <MessageSquare className="w-5 h-5 stroke-[2.2]" />
        };
      case 'teal':
        return {
          headerBg: 'bg-[#10B981]/[0.08] dark:bg-[#10B981]/[0.08]',
          iconBg: 'bg-white/85 dark:bg-white/10 text-[#047857] dark:text-[#34D399]',
          categoryText: 'text-[#047857] dark:text-[#34D399]',
          titleText: 'text-[#161B26] dark:text-[#F8FAFC]',
          checkBg: 'bg-[#10B981]/15 text-[#047857] dark:text-[#34D399]',
          btnBg: 'warm-pill-cta',
          icon: <Activity className="w-5 h-5 stroke-[2.2]" />
        };
      case 'mint':
      default:
        return {
          headerBg: 'bg-[#10B981]/[0.08] dark:bg-[#10B981]/[0.06]',
          iconBg: 'bg-white/85 dark:bg-white/10 text-[#047857] dark:text-[#34D399]',
          categoryText: 'text-[#047857] dark:text-[#34D399]',
          titleText: 'text-[#161B26] dark:text-[#F8FAFC]',
          checkBg: 'bg-[#10B981]/15 text-[#047857] dark:text-[#34D399]',
          btnBg: 'warm-pill-cta',
          icon: <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
        };
    }
  };

  return (
    <section 
      id="packages" 
      className="py-14 sm:py-20 relative overflow-hidden border-b border-[#161B26]/[0.06] dark:border-white/[0.08] bg-transparent transition-colors [content-visibility:auto] [contain-intrinsic-size:1px_600px]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Header Top Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          
          <div className={`max-w-2xl ${isArabic ? 'text-right' : 'text-left'}`}>
            
            {/* Small Uppercase Tracked Eyebrow */}
            <span className="text-[#1263D6] dark:text-[#60AFFF] text-[11px] sm:text-xs font-black tracking-widest uppercase block mb-2">
              {isArabic ? 'باقات مُصممة لاحتياجات طفلك' : 'TAILORED TO YOUR NEEDS'}
            </span>

            {/* Display Title with dot */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#161B26] dark:text-[#F8FAFC] tracking-tight leading-none mb-3">
              {isArabic ? (
                <span>
                  الباقات<span className="text-[#2B95FF]">.</span>
                </span>
              ) : (
                <span>
                  Packages<span className="text-[#2B95FF]">.</span>
                </span>
              )}
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
              {isArabic 
                ? 'خطط رعاية وتأهيل متكاملة ومصممة بعناية — كل ما يحتاجه طفلك، بشفافية كاملة في الأسعار.'
                : 'Bundled care plans designed for convenience — everything you need, priced transparently.'}
            </p>
          </div>

          {/* Top Right Circular Slider Navigation Arrows */}
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-end">
            <button
              onClick={() => handleScroll('prev')}
              aria-label={isArabic ? 'الباقة السابقة' : 'Previous package'}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full liquid-glass-btn flex items-center justify-center shadow-xs active:scale-95 transition-transform duration-200 cursor-pointer text-[#161B26] dark:text-[#F8FAFC]"
            >
              {isArabic ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            <button
              onClick={() => handleScroll('next')}
              aria-label={isArabic ? 'الباقة التالية' : 'Next package'}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full liquid-glass-btn flex items-center justify-center shadow-xs active:scale-95 transition-transform duration-200 cursor-pointer text-[#161B26] dark:text-[#F8FAFC]"
            >
              {isArabic ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* 2. Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 min-h-[38px] rounded-full text-xs sm:text-sm whitespace-nowrap transition-colors duration-200 font-bold cursor-pointer ${
                  isActive
                    ? 'warm-pill-cta shadow-md'
                    : 'liquid-glass-pill hover:scale-[1.02]'
                }`}
              >
                {isArabic ? cat.labelAr : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* 3. Packages Cards Slider Track */}
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex gap-3.5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 ${
            isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
          }`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {filteredPackages.map((pkg) => {
            const isSummer = pkg.isSummer || pkg.category === 'summer';
            const theme = getThemeStyles(pkg.colorTheme, pkg.popular);
            const savings = pkg.originalPrice ? pkg.originalPrice - pkg.price : 0;
            const savingsInUsd = Math.round(savings * 0.27);
            const priceInUsd = Math.round(pkg.price * 0.27);
            const origPriceInUsd = pkg.originalPrice ? Math.round(pkg.originalPrice * 0.27) : 0;

            return (
              <div
                key={pkg.id}
                className={`w-[76vw] min-w-[255px] max-w-[295px] sm:w-[350px] md:w-[370px] lg:w-[385px] shrink-0 snap-start liquid-glass-card rounded-[28px] overflow-hidden border shadow-xs hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between relative group ${
                  isSummer 
                    ? 'border-[#F59E0B]/55 ring-1 ring-[#F59E0B]/30' 
                    : 'border-[#161B26]/[0.08] dark:border-white/[0.08]'
                }`}
              >
                {/* Decorative Slim Top Strip */}
                <div className={`h-1 sm:h-1.5 w-full ${isSummer ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]' : 'bg-gradient-to-r from-[#2B95FF] via-[#10B981] to-[#8B5CF6]'}`} />

                {/* Upper Header Section */}
                <div className={`${isSummer ? 'bg-[#F59E0B]/[0.10] dark:bg-[#F59E0B]/[0.08]' : theme.headerBg} p-3 sm:p-6 pb-2.5 sm:pb-4 transition-colors relative`}>
                  
                  {/* Top Row: Icon Container and Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                    
                    {/* Rounded Icon Box */}
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl ${isSummer ? 'bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24] border border-[#F59E0B]/30' : theme.iconBg} shadow-2xs border border-[#161B26]/[0.08] dark:border-white/10 flex items-center justify-center shrink-0`}>
                      {isSummer ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 fill-[#F59E0B]/15 stroke-[2.2]" /> : theme.icon}
                    </div>

                    {/* Badges Container */}
                    <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-end">
                      {isSummer && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white shadow-2xs text-[9.5px] sm:text-xs font-black tracking-wide border border-white/30 select-none">
                          <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white shrink-0" />
                          <span>{isArabic ? 'باقات الصيف' : 'Summer Packages'}</span>
                        </span>
                      )}

                      {pkg.popular && isSummer && (
                        <span className="bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24] text-[9px] sm:text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full shadow-2xs uppercase border border-[#F59E0B]/30">
                          {isArabic ? 'عرض مميز' : 'SPECIAL OFFER'}
                        </span>
                      )}

                      {pkg.popular && !isSummer && (
                        <span className="bg-[#2B95FF] text-white text-[9px] sm:text-[10px] font-black tracking-wider px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-2xs uppercase">
                          {isArabic ? 'الأكثر طلباً' : 'MOST POPULAR'}
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Category Tracked Label */}
                  <span className={`${isSummer ? 'text-[#B45309] dark:text-[#FBBF24]' : theme.categoryText} text-[9.5px] sm:text-[11px] font-black tracking-widest uppercase block mb-1 sm:mb-1.5`}>
                    {isArabic 
                      ? (isSummer ? 'باقات الصيف المميزة' : (pkg.categoryCode || 'باقة علاجية متكاملة')) 
                      : (isSummer ? 'SUMMER SPECIAL' : (pkg.categoryCodeEn || 'PREVENTIVE CARE'))}
                  </span>

                  {/* Package Title */}
                  <h3 className={`text-base sm:text-2xl font-black ${isSummer ? 'text-[#161B26] dark:text-[#F8FAFC]' : theme.titleText} tracking-tight leading-snug min-h-[auto] sm:min-h-[54px] flex items-center`}>
                    {isArabic ? pkg.name : (pkg.nameEn || pkg.name)}
                  </h3>

                </div>

                {/* Lower Body Section */}
                <div className="p-3 sm:p-6 pt-2.5 sm:pt-4 flex flex-col justify-between flex-1 bg-transparent rounded-b-[28px]">
                  
                  <div>
                    {/* Price Row */}
                    <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#161B26] dark:text-[#F8FAFC] tracking-tight">
                        {pkg.price.toLocaleString()}
                      </span>
                      <span className="text-xs sm:text-base font-black text-[#4B5563] dark:text-[#94A3B8]">
                        {isArabic ? 'ريال' : 'SAR'}
                      </span>
                      {pkg.originalPrice && (
                        <div className="flex items-center gap-1 ms-1">
                          <span className="text-[11px] sm:text-sm line-through text-[#8B95A5] dark:text-[#64748B] font-semibold">
                            {pkg.originalPrice.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                          </span>
                          {savings > 0 && (
                            <span className="text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full bg-[#10B981]/12 text-[#047857] dark:text-[#34D399] border border-[#10B981]/25">
                              {isArabic ? `وفر ${savings.toLocaleString()}` : `Save ${savings.toLocaleString()}`}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Duration / Offer Highlight */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#2B95FF]/12 text-[#1263D6] dark:text-[#60AFFF] font-black text-[10.5px] sm:text-xs border border-[#2B95FF]/25">
                        <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2B95FF] shrink-0" />
                        <span>{isArabic ? (pkg.durationText || '٣ شهور + شهر مجاناً') : (pkg.durationTextEn || '3 Months + 1 Month Free')}</span>
                      </div>

                      {pkg.sessionDurationText && (
                        <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full bg-white/75 dark:bg-white/[0.06] text-[#161B26] dark:text-[#F8FAFC] text-[10px] sm:text-xs font-bold border border-[#161B26]/[0.08] dark:border-white/10">
                          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#2B95FF] shrink-0" />
                          <span>{isArabic ? pkg.sessionDurationText : pkg.sessionDurationTextEn}</span>
                        </div>
                      )}
                    </div>

                    {/* Disclaimer */}
                    <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#4B5563] dark:text-[#94A3B8] font-medium mb-2 sm:mb-3">
                      <AlertCircle className={`w-3 h-3 text-[#F59E0B] shrink-0`} />
                      <span>{isArabic ? (pkg.disclaimerText || 'الغياب غير معوض') : (pkg.disclaimerTextEn || 'Absence is non-compensated')}</span>
                    </div>

                    {/* Short Description */}
                    <p className="text-[11px] sm:text-xs md:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed mb-2.5 sm:mb-3.5 line-clamp-2">
                      {isArabic ? pkg.tagline : (pkg.taglineEn || pkg.tagline)}
                    </p>

                    {/* Checklist (Features) */}
                    <div className="space-y-1 sm:space-y-2 mb-2.5 sm:mb-4">
                      {((isArabic ? pkg.features : (pkg.featuresEn || pkg.features)) || []).slice(0, 2).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 sm:gap-2">
                          <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${theme.checkBg} flex items-center justify-center shrink-0`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="text-[10.5px] sm:text-xs md:text-sm text-[#161B26] dark:text-[#F8FAFC] font-medium leading-snug truncate">
                            {feat}
                          </span>
                        </div>
                      ))}
                      {((isArabic ? pkg.features : (pkg.featuresEn || pkg.features)) || []).slice(2, 4).map((feat, idx) => (
                        <div key={idx + 2} className="hidden sm:flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${theme.checkBg} flex items-center justify-center shrink-0`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="text-xs md:text-sm text-[#161B26] dark:text-[#F8FAFC] font-medium leading-snug truncate">
                            {feat}
                          </span>
                        </div>
                      ))}
                      {(isArabic ? pkg.features : (pkg.featuresEn || pkg.features)).length > 2 && (
                        <span className={`text-[9.5px] font-bold text-[#1263D6] dark:text-[#60AFFF] block sm:hidden`}>
                          {isArabic 
                            ? `+ ${(isArabic ? pkg.features : (pkg.featuresEn || pkg.features)).length - 2} مميزات إضافية معتمدة`
                            : `+ ${(isArabic ? pkg.features : (pkg.featuresEn || pkg.features)).length - 2} more features`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Area: Installments Notice with Tamara & Emkan Logos */}
                  <div>
                    {isSummer && (
                      <div className="pt-2 sm:pt-3 border-t border-[#161B26]/[0.06] dark:border-white/[0.08] mb-2.5 sm:mb-3.5 bg-white/75 dark:bg-white/[0.05] p-2 sm:p-2.5 rounded-2xl border border-[#161B26]/[0.06] dark:border-white/[0.08]">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] sm:text-xs font-bold text-[#161B26] dark:text-[#F8FAFC] leading-tight">
                            {isArabic ? 'متاح التقسيط :' : 'Installments Available:'}
                          </span>
                          
                          <div className="flex items-center gap-1.5 shrink-0">
                            <TamaraLogo height={18} className="h-4 sm:h-5" />
                            <EmkanLogo height={18} className="h-4 sm:h-5" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Book Package Button */}
                    <button
                      id={`book-package-${pkg.id}`}
                      onClick={() => onSelectPackage(pkg)}
                      className={`w-full py-2.5 sm:py-3.5 rounded-full font-black text-xs sm:text-sm transition-[transform,background-color,box-shadow] duration-200 shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
                        isSummer
                          ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:brightness-110 text-white shadow-md'
                          : theme.btnBg
                      }`}
                    >
                      {isSummer && <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />}
                      <span>{isArabic ? (isSummer ? 'حجز باقة الصيف' : 'حجز الباقة') : (isSummer ? 'Book Summer Package' : 'Book package')}</span>
                    </button>

                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Mobile Swipe Guidance Hint */}
        {filteredPackages.length > 1 && (
          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10.5px] font-bold text-[#4B5563] dark:text-[#94A3B8] sm:hidden">
            <span>{isArabic ? 'اسحب للتنقل بين الباقات المتوفرة' : 'Swipe to explore all packages'}</span>
          </div>
        )}

      </div>
    </section>
  );
};

export default PackagesSection;
