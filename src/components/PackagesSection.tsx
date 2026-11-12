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

  // Update scroll button states
  const updateScrollButtons = useCallback(() => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const el = sliderRef.current;
      if (!el) return;
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const maxScroll = scrollWidth - clientWidth;
      const currentScroll = Math.abs(scrollLeft);

      setCanScrollLeft(currentScroll > 10);
      setCanScrollRight(currentScroll < maxScroll - 10);
    });
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons, { passive: true });
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
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

  // Color theme helper matching the user's reference screenshot
  const getThemeStyles = (colorTheme: string, isPopular?: boolean) => {
    switch (colorTheme) {
      case 'rose':
        return {
          headerBg: 'bg-[#E8F8F3] dark:bg-[#07241d]/70',
          iconBg: 'bg-white/90 dark:bg-slate-800/90 text-[#0D6D54] dark:text-[#00E5BE]',
          categoryText: 'text-[#0D6D54] dark:text-[#00E5BE]',
          titleText: 'text-[#0B3B36] dark:text-emerald-100',
          checkBg: 'bg-[#DEF3EC] dark:bg-emerald-950/60 text-[#0D6D54] dark:text-[#00E5BE]',
          btnBg: 'bg-[#22C55E] hover:bg-[#16a34a] text-white',
          icon: <Heart className="w-5 h-5 fill-emerald-500/20 stroke-[2.2]" />
        };
      case 'purple':
        return {
          headerBg: 'bg-blue-50/70 dark:bg-[#0c2340]',
          iconBg: 'bg-white/90 dark:bg-slate-800/90 text-[#2E86EB]',
          categoryText: 'text-[#2E86EB]',
          titleText: 'text-[#1d74d8] dark:text-blue-200',
          checkBg: 'bg-blue-50 dark:bg-blue-950/60 text-[#2E86EB]',
          btnBg: 'bg-[#2E86EB] hover:bg-[#1d74d8] text-white',
          icon: <Sparkles className="w-5 h-5 fill-blue-500/20 stroke-[2.2]" />
        };
      case 'amber':
        return {
          headerBg: 'bg-amber-50/70 dark:bg-[#2b1f06]',
          iconBg: 'bg-white/90 dark:bg-slate-800/90 text-amber-700 dark:text-[#FFD23F]',
          categoryText: 'text-amber-800 dark:text-[#FFD23F]',
          titleText: 'text-amber-900 dark:text-amber-200',
          checkBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-[#FFD23F]',
          btnBg: 'bg-[#FFD23F] hover:bg-[#f5c724] text-slate-950 font-black',
          icon: <Brain className="w-5 h-5 stroke-[2.2]" />
        };
      case 'sky':
        return {
          headerBg: 'bg-blue-50/60 dark:bg-[#0b1f38]',
          iconBg: 'bg-white/90 dark:bg-slate-800/90 text-[#2E86EB]',
          categoryText: 'text-[#2E86EB]',
          titleText: 'text-[#1d74d8] dark:text-sky-200',
          checkBg: 'bg-blue-50 dark:bg-blue-950/60 text-[#2E86EB]',
          btnBg: 'bg-[#2E86EB] hover:bg-[#1d74d8] text-white',
          icon: <MessageSquare className="w-5 h-5 stroke-[2.2]" />
        };
      case 'teal':
        return {
          headerBg: 'bg-emerald-50/70 dark:bg-[#082b16]',
          iconBg: 'bg-white/90 dark:bg-slate-800/90 text-[#22C55E]',
          categoryText: 'text-[#22C55E]',
          titleText: 'text-[#16a34a] dark:text-emerald-200',
          checkBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-[#22C55E]',
          btnBg: 'bg-[#22C55E] hover:bg-[#16a34a] text-white',
          icon: <Activity className="w-5 h-5 stroke-[2.2]" />
        };
      case 'mint':
      default:
        return {
          headerBg: 'bg-blue-50/70 dark:bg-[#0c2340]',
          iconBg: 'bg-white/90 dark:bg-slate-800/90 text-[#2E86EB]',
          categoryText: 'text-[#2E86EB]',
          titleText: 'text-[#2E86EB] dark:text-white',
          checkBg: 'bg-blue-50 dark:bg-blue-950/60 text-[#2E86EB]',
          btnBg: 'bg-[#2E86EB] hover:bg-[#1d74d8] text-white',
          icon: <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
        };
    }
  };

  return (
    <section 
      id="packages" 
      className="py-14 sm:py-20 relative overflow-hidden border-b border-slate-200/80 dark:border-white/10 bg-transparent transition-colors [content-visibility:auto] [contain-intrinsic-size:1px_600px]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Header Top Area: Eyebrow + Title & Subtitle on Left, Circular Arrows on Right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          
          <div className={`max-w-2xl ${isArabic ? 'text-right' : 'text-left'}`}>
            
            {/* Small Uppercase Tracked Eyebrow */}
            <span className="text-[#2E86EB] text-[11px] sm:text-xs font-black tracking-widest uppercase block mb-2">
              {isArabic ? 'باقات مُصممة لاحتياجات طفلك' : 'TAILORED TO YOUR NEEDS'}
            </span>

            {/* Display Title with dot */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-3">
              {isArabic ? (
                <span>
                  الباقات<span className="text-[#2E86EB]">.</span>
                </span>
              ) : (
                <span>
                  Packages<span className="text-[#2E86EB]">.</span>
                </span>
              )}
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
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
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full liquid-glass-btn flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer text-slate-700 dark:text-slate-200"
            >
              {isArabic ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            <button
              onClick={() => handleScroll('next')}
              aria-label={isArabic ? 'الباقة التالية' : 'Next package'}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full liquid-glass-btn flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer text-slate-700 dark:text-slate-200"
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
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all duration-200 font-bold cursor-pointer ${
                  isActive
                    ? 'bg-[#2E86EB] text-white shadow-md shadow-blue-500/25 border-t border-white/50'
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
                className={`w-[76vw] min-w-[255px] max-w-[295px] sm:w-[350px] md:w-[370px] lg:w-[385px] shrink-0 snap-start liquid-glass-card rounded-2xl sm:rounded-3xl overflow-hidden border shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group ${
                  isSummer 
                    ? 'border-sky-400/60 dark:border-sky-500/40 ring-1 ring-sky-400/25' 
                    : 'border-slate-200/90 dark:border-white/10'
                }`}
              >
                {/* Decorative Slim Top Strip */}
                <div className={`h-1 sm:h-1.5 w-full ${isSummer ? 'bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600' : 'bg-gradient-to-r from-[#0B3B36] to-[#0284C7]'}`} />

                {/* Upper Header Section */}
                <div className={`${isSummer ? 'bg-gradient-to-br from-sky-50/90 via-cyan-50/50 to-blue-50/30 dark:from-sky-950/40 dark:via-slate-900/90 dark:to-cyan-950/30' : theme.headerBg} p-3 sm:p-6 pb-2.5 sm:pb-4 transition-colors relative`}>
                  
                  {/* Top Row: Icon Container and Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                    
                    {/* Rounded Icon Box */}
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl ${isSummer ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-300/30' : theme.iconBg} shadow-2xs border border-white/60 dark:border-white/10 flex items-center justify-center shrink-0`}>
                      {isSummer ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 fill-sky-500/15 stroke-[2.2]" /> : theme.icon}
                    </div>

                    {/* Badges Container */}
                    <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-end">
                      {isSummer && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 text-white shadow-2xs text-[9.5px] sm:text-xs font-black tracking-wide border border-white/30 select-none">
                          <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-100 fill-sky-200/50 shrink-0" />
                          <span>{isArabic ? 'باقات الصيف' : 'Summer Packages'}</span>
                        </span>
                      )}

                      {pkg.popular && isSummer && (
                        <span className="bg-blue-600/15 text-blue-700 dark:text-blue-300 text-[9px] sm:text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full shadow-2xs uppercase border border-blue-400/30">
                          {isArabic ? 'عرض مميز' : 'SPECIAL OFFER'}
                        </span>
                      )}

                      {pkg.popular && !isSummer && (
                        <span className="bg-[#2E86EB] text-white text-[9px] sm:text-[10px] font-black tracking-wider px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-2xs uppercase">
                          {isArabic ? 'الأكثر طلباً' : 'MOST POPULAR'}
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Category Tracked Label */}
                  <span className={`${isSummer ? 'text-sky-700 dark:text-sky-400' : theme.categoryText} text-[9.5px] sm:text-[11px] font-black tracking-widest uppercase block mb-1 sm:mb-1.5`}>
                    {isArabic 
                      ? (isSummer ? 'باقات الصيف المميزة' : (pkg.categoryCode || 'باقة علاجية متكاملة')) 
                      : (isSummer ? 'SUMMER SPECIAL' : (pkg.categoryCodeEn || 'PREVENTIVE CARE'))}
                  </span>

                  {/* Package Title */}
                  <h3 className={`text-base sm:text-2xl font-black ${isSummer ? 'text-slate-900 dark:text-white' : theme.titleText} tracking-tight leading-snug min-h-[auto] sm:min-h-[54px] flex items-center`}>
                    {isArabic ? pkg.name : (pkg.nameEn || pkg.name)}
                  </h3>

                </div>

                {/* Lower Body Section */}
                <div className="p-3 sm:p-6 pt-2.5 sm:pt-4 flex flex-col justify-between flex-1 bg-white dark:bg-[#111827] rounded-b-2xl sm:rounded-b-3xl">
                  
                  <div>
                    {/* Price Row */}
                    <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        {pkg.price.toLocaleString()}
                      </span>
                      <span className="text-xs sm:text-base font-black text-slate-700 dark:text-slate-300">
                        {isArabic ? 'ريال' : 'SAR'}
                      </span>
                      {pkg.originalPrice && (
                        <div className="flex items-center gap-1 ms-1">
                          <span className="text-[11px] sm:text-sm line-through text-slate-600 dark:text-slate-300 font-semibold">
                            {pkg.originalPrice.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                          </span>
                          {savings > 0 && (
                            <span className="text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                              {isArabic ? `وفر ${savings.toLocaleString()}` : `Save ${savings.toLocaleString()}`}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Duration / Offer Highlight: ٣ شهور + شهر مجاناً */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-black text-[10.5px] sm:text-xs border border-emerald-500/30">
                        <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{isArabic ? (pkg.durationText || '٣ شهور + شهر مجاناً') : (pkg.durationTextEn || '3 Months + 1 Month Free')}</span>
                      </div>

                      {/* If Card 3 or 4: مدة الجلسة ساعة / ساعتين */}
                      {pkg.sessionDurationText && (
                        <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 text-[10px] sm:text-xs font-bold border border-sky-200 dark:border-sky-800/40">
                          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                          <span>{isArabic ? pkg.sessionDurationText : pkg.sessionDurationTextEn}</span>
                        </div>
                      )}
                    </div>

                    {/* Disclaimer: الغياب غير معوض */}
                    <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-medium mb-2 sm:mb-3">
                      <AlertCircle className={`w-3 h-3 ${isSummer ? 'text-sky-600/70 dark:text-sky-400/70' : 'text-slate-400'} shrink-0`} />
                      <span>{isArabic ? (pkg.disclaimerText || 'الغياب غير معوض') : (pkg.disclaimerTextEn || 'Absence is non-compensated')}</span>
                    </div>

                    {/* Short Description */}
                    <p className="text-[11px] sm:text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2.5 sm:mb-3.5 line-clamp-2">
                      {isArabic ? pkg.tagline : (pkg.taglineEn || pkg.tagline)}
                    </p>

                    {/* Checklist (Features) */}
                    <div className="space-y-1 sm:space-y-2 mb-2.5 sm:mb-4">
                      {((isArabic ? pkg.features : (pkg.featuresEn || pkg.features)) || []).slice(0, 2).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 sm:gap-2">
                          <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${isSummer ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400' : theme.checkBg} flex items-center justify-center shrink-0`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="text-[10.5px] sm:text-xs md:text-sm text-slate-700 dark:text-slate-200 font-medium leading-snug truncate">
                            {feat}
                          </span>
                        </div>
                      ))}
                      {((isArabic ? pkg.features : (pkg.featuresEn || pkg.features)) || []).slice(2, 4).map((feat, idx) => (
                        <div key={idx + 2} className="hidden sm:flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${isSummer ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400' : theme.checkBg} flex items-center justify-center shrink-0`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="text-xs md:text-sm text-slate-700 dark:text-slate-200 font-medium leading-snug truncate">
                            {feat}
                          </span>
                        </div>
                      ))}
                      {(isArabic ? pkg.features : (pkg.featuresEn || pkg.features)).length > 2 && (
                        <span className={`text-[9.5px] font-bold ${isSummer ? 'text-sky-700 dark:text-sky-400' : 'text-teal-700 dark:text-teal-400'} block sm:hidden`}>
                          {isArabic 
                            ? `+ ${(isArabic ? pkg.features : (pkg.featuresEn || pkg.features)).length - 2} مميزات إضافية معتمدة`
                            : `+ ${(isArabic ? pkg.features : (pkg.featuresEn || pkg.features)).length - 2} more features`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Area: Installments Notice with Tamara & Emkan Logos - ONLY for Summer Packages */}
                  <div>
                    {isSummer && (
                      <div className="pt-2 sm:pt-3 border-t border-slate-100 dark:border-white/10 mb-2.5 sm:mb-3.5 bg-slate-50/80 dark:bg-[#0E1526] p-2 sm:p-2.5 rounded-xl border border-slate-200/70 dark:border-white/10">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">
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
                      className={`w-full py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
                        isSummer
                          ? 'bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-md shadow-sky-600/20'
                          : theme.btnBg
                      }`}
                    >
                      {isSummer && <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-100 shrink-0" />}
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
          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10.5px] font-bold text-slate-400 sm:hidden">
            <span>{isArabic ? 'اسحب للتنقل بين الباقات المتوفرة' : 'Swipe to explore all packages'}</span>
          </div>
        )}

      </div>
    </section>
  );
};

export default PackagesSection;
