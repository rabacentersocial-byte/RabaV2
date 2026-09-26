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
import { THERAPY_PACKAGES } from '../data/mockData';
import { TherapyPackage } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { TamaraLogo, EmkanLogo } from './InstallmentLogos';

interface PackagesSectionProps {
  onSelectPackage: (pkg: TherapyPackage) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({ onSelectPackage }) => {
  const { isArabic } = useLanguage();

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

  // Category filter tabs matching the user's reference design
  const categories = useMemo(() => [
    { id: 'all', labelAr: 'جميع الباقات', labelEn: 'All packages' },
    { id: 'summer', labelAr: 'باقات الصيف ☀️', labelEn: 'Summer Packages ☀️' },
    { id: 'assessment', labelAr: 'التقييم والتشخيص', labelEn: 'Preventive Care' },
    { id: 'sensory', labelAr: 'العلاج الوظيفي والحسي', labelEn: 'Cardiology & Sensory' },
    { id: 'speech', labelAr: 'النطق والتخاطب', labelEn: 'Speech & Language' },
    { id: 'aba', labelAr: 'تعديل السلوك ABA', labelEn: 'Mental Health & ABA' },
    { id: 'physical', labelAr: 'العلاج الطبيعي', labelEn: 'Physical Rehab' },
  ], []);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    if (selectedCategory === 'all') {
      return THERAPY_PACKAGES;
    }
    return THERAPY_PACKAGES.filter((pkg) => pkg.category === selectedCategory);
  }, [selectedCategory]);

  // Update scroll button states
  const updateScrollButtons = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
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
          btnBg: 'bg-[#0B3B36] hover:bg-[#124e47] text-white',
          icon: <Heart className="w-5 h-5 fill-emerald-500/20 stroke-[2.2]" />
        };
      case 'purple':
        return {
          headerBg: 'bg-[#EAF8FA] dark:bg-[#082229]/70',
          iconBg: 'bg-white/90 dark:bg-slate-800/90 text-[#0284C7] dark:text-[#00E5BE]',
          categoryText: 'text-[#0284C7] dark:text-[#00E5BE]',
          titleText: 'text-[#0369A1] dark:text-cyan-100',
          checkBg: 'bg-[#E0F2FE] dark:bg-sky-950/60 text-[#0284C7] dark:text-[#00E5BE]',
          btnBg: 'bg-[#0284C7] hover:bg-[#0369a1] text-white',
          icon: <Sparkles className="w-5 h-5 fill-cyan-500/20 stroke-[2.2]" />
        };
      case 'amber':
        return {
          headerBg: 'bg-[#FEF5ED] dark:bg-[#321f10]/60',
          iconBg: 'bg-white/90 dark:bg-slate-800/90 text-[#C26213] dark:text-[#FBBF24]',
          categoryText: 'text-[#C26213] dark:text-[#FBBF24]',
          titleText: 'text-[#9E4A07] dark:text-amber-100',
          checkBg: 'bg-[#FEF0E3] dark:bg-amber-950/60 text-[#C26213] dark:text-[#FBBF24]',
          btnBg: 'bg-[#C26213] hover:bg-[#a6510c] text-white',
          icon: <Brain className="w-5 h-5 stroke-[2.2]" />
        };
      case 'sky':
        return {
          headerBg: 'bg-[#F0F7FF] dark:bg-[#112338]/60',
          iconBg: 'bg-white/90 dark:bg-slate-800/90 text-[#1570EF] dark:text-[#60A5FA]',
          categoryText: 'text-[#1570EF] dark:text-[#60A5FA]',
          titleText: 'text-[#0E4A96] dark:text-sky-100',
          checkBg: 'bg-[#E0F2FE] dark:bg-sky-950/60 text-[#1570EF] dark:text-[#60A5FA]',
          btnBg: 'bg-[#1570EF] hover:bg-[#105ecb] text-white',
          icon: <MessageSquare className="w-5 h-5 stroke-[2.2]" />
        };
      case 'teal':
        return {
          headerBg: 'bg-[#EAFBF7] dark:bg-[#0c2a25]/60',
          iconBg: 'bg-white/90 dark:bg-slate-800/90 text-[#0E8376] dark:text-[#2DD4BF]',
          categoryText: 'text-[#0E8376] dark:text-[#2DD4BF]',
          titleText: 'text-[#0B4F47] dark:text-teal-100',
          checkBg: 'bg-[#E0F2EF] dark:bg-teal-950/60 text-[#0E8376] dark:text-[#2DD4BF]',
          btnBg: 'bg-[#0E8376] hover:bg-[#0b6b60] text-white',
          icon: <Activity className="w-5 h-5 stroke-[2.2]" />
        };
      case 'mint':
      default:
        return {
          headerBg: 'bg-[#ECF7F3] dark:bg-[#0b2923]/60',
          iconBg: 'bg-white/90 dark:bg-slate-800/90 text-[#0D6D54] dark:text-[#2DD4BF]',
          categoryText: 'text-[#0D6D54] dark:text-[#2DD4BF]',
          titleText: 'text-[#0B3B36] dark:text-white',
          checkBg: 'bg-[#E3F4EC] dark:bg-teal-950/60 text-[#0D6D54] dark:text-[#2DD4BF]',
          btnBg: 'bg-[#0B3B36] hover:bg-[#124e47] text-white',
          icon: <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
        };
    }
  };

  return (
    <section 
      id="packages" 
      className="py-14 sm:py-20 relative overflow-hidden border-b border-slate-200/80 dark:border-white/10 bg-slate-50/40 dark:bg-slate-950/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Header Top Area: Eyebrow + Title & Subtitle on Left, Circular Arrows on Right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          
          <div className={`max-w-2xl ${isArabic ? 'text-right' : 'text-left'}`}>
            
            {/* Small Uppercase Tracked Eyebrow */}
            <span className="text-[#0D6D54] dark:text-[#2DD4BF] text-[11px] sm:text-xs font-black tracking-widest uppercase block mb-2">
              {isArabic ? 'باقات مُصممة لاحتياجات طفلك' : 'TAILORED TO YOUR NEEDS'}
            </span>

            {/* Display Title with dot */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-3">
              {isArabic ? (
                <span>
                  الباقات والخدمات<span className="text-[#0D6D54] dark:text-[#2DD4BF]">.</span>
                </span>
              ) : (
                <span>
                  Packages & services<span className="text-[#0D6D54] dark:text-[#2DD4BF]">.</span>
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
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/10 shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              {isArabic ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            <button
              onClick={() => handleScroll('next')}
              aria-label={isArabic ? 'الباقة التالية' : 'Next package'}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/10 shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              {isArabic ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* 2. Category Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-3 mb-8" style={{ WebkitOverflowScrolling: 'touch' }}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all duration-200 font-bold cursor-pointer ${
                  isActive
                    ? 'bg-[#0B3B36] text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/15'
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
          className={`flex gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 ${
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
                className={`w-[88vw] max-w-[375px] sm:w-[360px] md:w-[375px] lg:w-[390px] shrink-0 snap-start bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative ${
                  isSummer 
                    ? 'border-amber-200 dark:border-amber-500/30 ring-1 ring-amber-400/20' 
                    : 'border-slate-200/90 dark:border-white/10'
                }`}
              >
                {/* Distinctive Left Corner Badge for Summer Packages */}
                {isSummer && (
                  <div 
                    className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md text-xs font-black tracking-wide border border-white/30 backdrop-blur-xs select-none"
                    style={{ transformOrigin: 'top left' }}
                  >
                    <Sun className="w-3.5 h-3.5 text-yellow-100 fill-yellow-200" />
                    <span>{isArabic ? 'باقات الصيف' : 'Summer Packages'}</span>
                  </div>
                )}

                {/* Upper Header Section */}
                <div className={`${isSummer ? 'bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-yellow-50/30 dark:from-amber-950/30 dark:to-slate-900' : theme.headerBg} p-6 sm:p-7 rounded-t-3xl transition-colors`}>
                  
                  {/* Top Row: Icon Container on Right (in RTL) or Left (in LTR), with Popular / Corner spacing */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    
                    {/* Rounded Icon Box */}
                    <div className={`w-11 h-11 rounded-2xl ${isSummer ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : theme.iconBg} shadow-xs border border-white/60 dark:border-white/10 flex items-center justify-center`}>
                      {isSummer ? <Sun className="w-5 h-5 fill-amber-500/20 stroke-[2.2]" /> : theme.icon}
                    </div>

                    {/* Popular Pill Badge or Right Badge (avoid overlapping with the left corner badge) */}
                    {pkg.popular && !isSummer && (
                      <span className="bg-[#0B3B36] text-white text-[10px] font-black tracking-wider px-3.5 py-1.5 rounded-full shadow-xs uppercase">
                        {isArabic ? 'الأكثر طلباً' : 'MOST POPULAR'}
                      </span>
                    )}

                    {pkg.popular && isSummer && (
                      <span className="bg-amber-600 text-white text-[10px] font-black tracking-wider px-3 py-1 rounded-full shadow-xs uppercase">
                        {isArabic ? 'عرض مميز' : 'SPECIAL OFFER'}
                      </span>
                    )}

                  </div>

                  {/* Category Tracked Label */}
                  <span className={`${isSummer ? 'text-amber-700 dark:text-amber-400' : theme.categoryText} text-[11px] font-black tracking-widest uppercase block mb-1.5`}>
                    {isArabic 
                      ? (isSummer ? 'باقات الصيف المميزة' : (pkg.categoryCode || 'باقة علاجية متكاملة')) 
                      : (isSummer ? 'SUMMER SPECIAL' : (pkg.categoryCodeEn || 'PREVENTIVE CARE'))}
                  </span>

                  {/* Package Title: بخط كبير و Bold */}
                  <h3 className={`text-2xl sm:text-3xl font-black ${isSummer ? 'text-slate-900 dark:text-white' : theme.titleText} tracking-tight leading-snug min-h-[58px] flex items-center`}>
                    {isArabic ? pkg.name : (pkg.nameEn || pkg.name)}
                  </h3>

                </div>

                {/* Lower Body Section */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 bg-white dark:bg-slate-900 rounded-b-3xl">
                  
                  <div>
                    {/* Price in Big Bold Numbers */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        {pkg.price.toLocaleString()}
                      </span>
                      <span className="text-base sm:text-lg font-black text-slate-700 dark:text-slate-300">
                        {isArabic ? 'ريال' : 'SAR'}
                      </span>
                      {pkg.originalPrice && (
                        <span className="text-xs sm:text-sm line-through text-slate-400 font-medium ms-1">
                          {pkg.originalPrice.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                        </span>
                      )}
                    </div>

                    {/* Duration / Offer Highlight: ٣ شهور + شهر مجاناً */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-black text-xs sm:text-sm border border-emerald-500/30">
                        <Gift className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{isArabic ? (pkg.durationText || '٣ شهور + شهر مجاناً') : (pkg.durationTextEn || '3 Months + 1 Month Free')}</span>
                      </div>

                      {/* If Card 3 or 4: مدة الجلسة ساعة / ساعتين */}
                      {pkg.sessionDurationText && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 text-xs font-bold border border-sky-200 dark:border-sky-800/40">
                          <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                          <span>{isArabic ? pkg.sessionDurationText : pkg.sessionDurationTextEn}</span>
                        </div>
                      )}
                    </div>

                    {/* Disclaimer: الغياب غير معوض (بخط صغير) */}
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 font-medium mb-5">
                      <AlertCircle className="w-3 h-3 text-amber-500/80 shrink-0" />
                      <span>{isArabic ? (pkg.disclaimerText || 'الغياب غير معوض') : (pkg.disclaimerTextEn || 'Absence is non-compensated')}</span>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {isArabic ? pkg.tagline : (pkg.taglineEn || pkg.tagline)}
                    </p>

                    {/* Checklist (Features) */}
                    <div className="space-y-2.5 mb-6">
                      {(isArabic ? pkg.features : (pkg.featuresEn || pkg.features)).slice(0, 4).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <div className={`w-4 h-4 rounded-full ${isSummer ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' : theme.checkBg} flex items-center justify-center shrink-0 mt-0.5`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium leading-tight">
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Area: Installments Notice with Tamara & Emkan Logos on the Left */}
                  <div>
                    {/* مع إمكانية التقسيط عبر تمارا وإمكان + لوجو تمارا وإمكان باليسار تحت */}
                    <div className="pt-3.5 border-t border-slate-100 dark:border-white/10 mb-4 bg-slate-50/70 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/70 dark:border-white/10">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">
                          {isArabic ? 'مع إمكانية التقسيط عبر تمارا وإمكان' : 'Installment available via Tamara & Emkan'}
                        </span>
                        
                        {/* تحت على اليسار لوجو تمارا ولوجو إمكان */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <TamaraLogo height={23} />
                          <EmkanLogo height={23} />
                        </div>
                      </div>
                    </div>

                    {/* Book Package Button */}
                    <button
                      id={`book-package-${pkg.id}`}
                      onClick={() => onSelectPackage(pkg)}
                      className={`w-full py-3.5 sm:py-4 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
                        isSummer
                          ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:brightness-110 text-white shadow-amber-500/20'
                          : theme.btnBg
                      }`}
                    >
                      {isSummer && <Sun className="w-4 h-4 fill-white/20" />}
                      <span>{isArabic ? (isSummer ? 'حجز باقة الصيف' : 'حجز الباقة') : (isSummer ? 'Book Summer Package' : 'Book package')}</span>
                    </button>

                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default PackagesSection;
