import React, { useState, useEffect, useRef } from 'react';
import { 
  Tag, 
  Copy, 
  Check, 
  Calendar, 
  Clock, 
  Gift, 
  Percent, 
  Sparkles,
  Phone,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Award
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SaudiNationalDayBadge, SaudiFalconGraphic } from './NationalDayVisuals';
import { OfferData } from '../types';
import { getStoredOffers } from '../data/offersData';

interface OffersSectionProps {
  onClaimOffer: (offerTitle: string, discountedPrice?: number) => void;
  offers?: OfferData[];
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const OffersSection: React.FC<OffersSectionProps> = ({ onClaimOffer, offers: propOffers }) => {
  const { isArabic } = useLanguage();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  
  // Drag-to-scroll state
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const movedDistanceRef = useRef(0);

  // Offers state (syncs with prop or localStorage)
  const [offersList, setOffersList] = useState<OfferData[]>(() => {
    return propOffers || getStoredOffers();
  });

  useEffect(() => {
    if (propOffers) {
      setOffersList(propOffers);
    } else {
      const handleStorage = () => {
        setOffersList(getStoredOffers());
      };
      window.addEventListener('storage', handleStorage);
      window.addEventListener('raba_offers_updated', handleStorage);
      window.addEventListener('raba_persistent_sync_ready', handleStorage);
      return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener('raba_offers_updated', handleStorage);
        window.removeEventListener('raba_persistent_sync_ready', handleStorage);
      };
    }
  }, [propOffers]);

  // Timers mapped by offer id
  const [countdowns, setCountdowns] = useState<Record<string, Countdown>>({});

  useEffect(() => {
    const updateCountdowns = () => {
      const now = new Date().getTime();
      const updated: Record<string, Countdown> = {};

      offersList.forEach((offer) => {
        const target = new Date(offer.targetDate).getTime();
        const diff = Math.max(0, target - now);

        updated[offer.id] = {
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        };
      });

      setCountdowns(updated);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [offersList]);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => {
      setCopiedCoupon(null);
    }, 2500);
  };

  const fmt = (n: number | undefined) => (n ?? 0).toString().padStart(2, '0');

  // Slider navigation controls
  const handleScroll = (direction: 'next' | 'prev') => {
    const el = sliderRef.current;
    if (!el) return;
    const isMobile = window.innerWidth < 640;
    const scrollAmount = isMobile ? (window.innerWidth * 0.78 + 12) : 380;
    
    let delta = scrollAmount;
    if (direction === 'prev') {
      delta = -scrollAmount;
    }
    if (isArabic) {
      delta = -delta;
    }

    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  // Drag-to-scroll handlers
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

  const handleMouseUp = () => setIsDragging(false);

  // Active offers filter
  const activeOffers = offersList.filter(o => o.active !== false);

  return (
    <section 
      id="offers-section" 
      className="py-10 sm:py-16 md:py-20 bg-slate-50/70 dark:bg-[#041a15]/90 relative overflow-hidden transition-colors border-b border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[420px] h-[420px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[420px] h-[420px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle background national grid texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px]"
      />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header with title and Slider Navigation arrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          
          <div className={`max-w-3xl ${isArabic ? 'text-right' : 'text-left'}`}>
            
            {/* National Day Tracked Eyebrow */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-500/30 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[#0D6D54] dark:text-[#52B79A] text-[10px] sm:text-xs font-black tracking-widest uppercase mb-2 sm:mb-3 shadow-2xs">
              <span className="text-sm sm:text-base">🇸🇦</span>
              <span>{isArabic ? 'عروض وتخفيضات اليوم الوطني الـ96 — عزّنا بطبعنا' : 'SAUDI NATIONAL DAY 96 EXCLUSIVE OFFERS'}</span>
            </div>

            {/* Headline with dot */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-1.5 sm:mb-2">
              {isArabic ? (
                <span>
                  العروض والخصومات الحصرية<span className="text-[#0D6D54] dark:text-[#00E5BE]">.</span>
                </span>
              ) : (
                <span>
                  Offers & Discounts<span className="text-[#0D6D54] dark:text-[#00E5BE]">.</span>
                </span>
              )}
            </h2>

            <p className="text-xs sm:text-base text-slate-600 dark:text-emerald-100/80 leading-relaxed max-w-2xl font-medium">
              {isArabic 
                ? 'استكشف باقة عروضنا الحصرية بمناسبة اليوم الوطني السعودي الـ96 مع إمكانية التمرير والاستفادة الفورية.'
                : 'Explore our premier exclusive offers for Saudi National Day 96 with convenient horizontal slider.'}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="shrink-0 flex items-center justify-between sm:justify-end gap-2.5">
            <div className="flex items-center gap-1.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl backdrop-blur-md text-[11px] sm:text-xs font-bold text-slate-700 dark:text-emerald-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0D6D54] dark:text-[#00E5BE]" />
              <span>{isArabic ? `${activeOffers.length} عروض متاحة` : `${activeOffers.length} Active Offers`}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleScroll('prev')}
                aria-label={isArabic ? 'العرض السابق' : 'Previous offer'}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-200 dark:border-emerald-500/30 bg-white dark:bg-[#062c22]/80 text-slate-700 dark:text-emerald-200 hover:text-emerald-700 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-600/40 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              >
                {isArabic ? <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>

              <button
                onClick={() => handleScroll('next')}
                aria-label={isArabic ? 'العرض التالي' : 'Next offer'}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-200 dark:border-emerald-500/30 bg-white dark:bg-[#062c22]/80 text-slate-700 dark:text-emerald-200 hover:text-emerald-700 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-600/40 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              >
                {isArabic ? <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>

        </div>

        {/* Offers Slider Track */}
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex items-start gap-3 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4 pt-1 px-0.5 ${
            isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
          }`}
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x pan-y' }}
        >
          {activeOffers.map((offer) => {
            const cd = countdowns[offer.id] || { days: 0, hours: 0, minutes: 0, seconds: 0 };
            const isFreeDay = offer.discountType === 'free_day';
            const isPercentage = offer.discountType === 'percentage';

            const styling = offer.styling || {};
            const bgGradient = styling.bgGradientFrom 
              ? `linear-gradient(135deg, ${styling.bgGradientFrom} 0%, ${styling.bgGradientVia || styling.bgGradientFrom} 50%, ${styling.bgGradientTo || styling.bgGradientFrom} 100%)`
              : undefined;
            const borderColor = styling.borderColor || 'rgba(16,185,129,0.35)';
            const accentColor = styling.accentColor || '#00E5BE';
            const glowColor = styling.glowColor || 'rgba(16,185,129,0.18)';
            const subcardBg = styling.subcardBg || '#032019';
            const subcardBorder = styling.subcardBorder || 'rgba(16,185,129,0.3)';
            const ribbonBg = styling.ribbonBgColor || '#00E5BE';
            const ribbonText = styling.ribbonTextColor || '#022c22';
            const ribbonLabel = isArabic 
              ? (offer.ribbonAr || (isFreeDay ? 'لجميع عملائنا' : 'للعملاء الجدد'))
              : (offer.ribbonEn || (isFreeDay ? 'All Clients' : 'New Clients'));
            const headerTag = isArabic
              ? (offer.headerTagAr || 'عزّنا بطبعنا')
              : (offer.headerTagEn || 'Saudi Pride');
            const headerTagSub = isArabic
              ? (offer.headerTagSubAr || 'اليوم الوطني 96')
              : (offer.headerTagSubEn || 'National Day 96');
            const showCountdown = offer.showCountdown !== false;
            const claimText = isArabic
              ? (offer.claimButtonTextAr || (isFreeDay ? 'حجز اليوم المجاني' : 'الاستفادة من العرض'))
              : (offer.claimButtonTextEn || 'Claim Offer');
            const contactPhone = offer.phone || '0575100100';

            return (
              <div 
                key={offer.id}
                id={`offer-card-${offer.id}`}
                className="w-[76vw] min-w-[260px] max-w-[310px] sm:min-w-0 sm:max-w-none sm:w-[380px] md:w-[410px] shrink-0 snap-start self-start rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-6 bg-gradient-to-br from-[#062c22] via-[#093c2f] to-[#041d17] border relative overflow-hidden shadow-xl sm:shadow-2xl flex flex-col transition-all duration-300"
                style={{
                  background: bgGradient,
                  borderColor: borderColor,
                  boxShadow: `0 20px 45px -15px ${glowColor}`
                }}
              >
                {/* Ambient Corner Glow */}
                <div 
                  className="absolute -top-14 -right-14 w-40 h-40 sm:w-52 sm:h-52 rounded-full blur-3xl pointer-events-none"
                  style={{ backgroundColor: glowColor }}
                />
                <div 
                  className="absolute -bottom-14 -left-14 w-40 h-40 sm:w-52 sm:h-52 rounded-full blur-3xl pointer-events-none"
                  style={{ backgroundColor: glowColor }}
                />

                <div className="relative z-10 flex flex-col">
                  
                  {/* Card Header: National Day Badge / Custom Badge & Live indicator */}
                  <div 
                    className="flex items-center justify-between gap-1.5 mb-2.5 sm:mb-4 pb-2 sm:pb-3 border-b"
                    style={{ borderColor: `${borderColor}40` }}
                  >
                    {offer.isNationalDay ? (
                      <div 
                        className="inline-flex items-center gap-1.5 sm:gap-2 border rounded-lg sm:rounded-xl px-2 py-1 sm:px-3 sm:py-1.5 text-right select-none"
                        style={{
                          backgroundColor: subcardBg,
                          borderColor: subcardBorder
                        }}
                      >
                        <div 
                          className="w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg border flex items-center justify-center p-0.5 shrink-0"
                          style={{
                            backgroundColor: `${accentColor}20`,
                            borderColor: `${accentColor}50`
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" style={{ color: accentColor }}>
                            <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
                            <circle cx="12" cy="12" r="3" fill={accentColor} />
                          </svg>
                        </div>
                        <div className="flex flex-col text-right leading-tight">
                          <span className="text-white font-black text-[10px] sm:text-xs tracking-wider">{headerTag}</span>
                          <span className="text-[7.5px] sm:text-[9px] font-bold uppercase" style={{ color: accentColor }}>{headerTagSub}</span>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="flex items-center gap-1 border rounded-lg sm:rounded-xl px-2 py-1 text-[10px] sm:text-xs font-bold"
                        style={{
                          backgroundColor: subcardBg,
                          borderColor: subcardBorder,
                          color: accentColor
                        }}
                      >
                        <Tag className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">{isArabic ? offer.titleAr : offer.titleEn}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
                      <span 
                        className="text-[8.5px] sm:text-[10.5px] font-black uppercase tracking-wider truncate max-w-[110px] sm:max-w-none"
                        style={{ color: accentColor }}
                      >
                        {isArabic ? offer.badgeAr : offer.badgeEn}
                      </span>
                    </div>
                  </div>

                  {/* Main Typography & Visual Graphic Row */}
                  <div className="flex items-center justify-between gap-2 sm:gap-3 mb-2.5 sm:mb-4">
                    
                    {/* Typography details */}
                    <div className="space-y-0.5 sm:space-y-1.5 flex-1 min-w-0">
                      
                      {/* Big Title */}
                      <h3 className="text-base sm:text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-md leading-tight line-clamp-1">
                        {isArabic ? offer.titleAr : offer.titleEn}
                      </h3>

                      {/* Subtitle / Ribbon */}
                      <div className="inline-block">
                        <span 
                          className="font-black text-[9px] sm:text-xs px-2 py-0.5 rounded-full shadow-xs tracking-wide"
                          style={{
                            backgroundColor: ribbonBg,
                            color: ribbonText
                          }}
                        >
                          {ribbonLabel}
                        </span>
                      </div>

                      {/* Occasion / Subtitle text */}
                      <p className="text-emerald-200/90 font-bold text-[10px] sm:text-xs sm:text-sm pt-0.5 truncate">
                        {isArabic ? offer.subtitleAr : offer.subtitleEn}
                      </p>

                      {/* Display Value (96 or 35% or Fixed) */}
                      {isFreeDay ? (
                        <div className="flex items-baseline gap-1.5 pt-0.5">
                          <span className="text-2xl sm:text-4xl md:text-5xl font-black bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-sans tracking-tight">
                            {offer.discountValue || 96}
                          </span>
                          <span className="text-[8.5px] sm:text-xs font-black text-amber-300 uppercase tracking-widest">
                            {isArabic ? 'عزّ وفخر' : 'GLORY & PRIDE'}
                          </span>
                        </div>
                      ) : isPercentage ? (
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span 
                            className="text-2xl sm:text-4xl md:text-5xl font-black font-sans drop-shadow-sm"
                            style={{ color: accentColor }}
                          >
                            {offer.discountValue}%
                          </span>
                          <span className="text-xs sm:text-base md:text-lg font-black text-white leading-tight">
                            {isArabic ? 'خصـم' : 'OFF'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1.5 pt-0.5">
                          <span 
                            className="text-xl sm:text-3xl md:text-4xl font-black"
                            style={{ color: accentColor }}
                          >
                            {offer.discountValue} {isArabic ? 'ر.س' : 'SAR'}
                          </span>
                        </div>
                      )}

                    </div>

                    {/* Graphic: Saudi Falcon for National Day or Custom Graphic */}
                    <div className="shrink-0 self-center">
                      {offer.isNationalDay ? (
                        <SaudiFalconGraphic className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24" />
                      ) : (
                        <div 
                          className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl border flex items-center justify-center"
                          style={{
                            backgroundColor: `${accentColor}15`,
                            borderColor: subcardBorder
                          }}
                        >
                          {offer.graphicType === 'gift' && <Gift className="w-7 h-7 sm:w-10 sm:h-10" style={{ color: accentColor }} />}
                          {offer.graphicType === 'percent' && <Percent className="w-7 h-7 sm:w-10 sm:h-10" style={{ color: accentColor }} />}
                          {offer.graphicType === 'sparkles' && <Sparkles className="w-7 h-7 sm:w-10 sm:h-10" style={{ color: accentColor }} />}
                          {offer.graphicType === 'award' && <Award className="w-7 h-7 sm:w-10 sm:h-10" style={{ color: accentColor }} />}
                          {(!offer.graphicType || offer.graphicType === 'falcon') && <SaudiFalconGraphic className="w-14 h-14 sm:w-20 sm:h-20" />}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Subcard with date & terms */}
                  <div 
                    className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border text-emerald-100 mb-2.5 sm:mb-3 shadow-inner space-y-1 sm:space-y-1.5"
                    style={{
                      backgroundColor: subcardBg,
                      borderColor: subcardBorder
                    }}
                  >
                    
                    {/* Date line */}
                    <div className="flex items-center gap-1 sm:gap-1.5 text-amber-300 font-black text-[10px] sm:text-xs">
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{isArabic ? offer.dateLabelAr : offer.dateLabelEn}</span>
                    </div>

                    {/* Brief description or terms list */}
                    {offer.terms && offer.terms.length > 0 ? (
                      <div className="space-y-1 text-[9.5px] sm:text-[11px] text-emerald-100/90 pt-0.5">
                        {offer.terms.slice(0, 2).map((term, i) => (
                          <div key={i} className="flex items-start gap-1 bg-black/20 px-1.5 py-0.5 rounded-md sm:rounded-lg border border-white/5">
                            <span className="font-bold shrink-0" style={{ color: accentColor }}>•</span>
                            <span className="leading-tight truncate">
                              {isArabic ? term.textAr : term.textEn}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] sm:text-xs text-emerald-200/90 leading-relaxed line-clamp-2">
                        {isArabic ? offer.descriptionAr : offer.descriptionEn}
                      </p>
                    )}

                  </div>

                  {/* Countdown Timer */}
                  {showCountdown && (
                    <div className="mb-2.5 sm:mb-3">
                      <span 
                        className="text-[8px] sm:text-[9px] font-black tracking-widest uppercase block mb-1"
                        style={{ color: `${accentColor}cc` }}
                      >
                        {isArabic ? 'المتبقي حتى الموعد المحدد' : 'COUNTDOWN'}
                      </span>

                      <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
                        <div 
                          className="bg-black/40 backdrop-blur-md rounded-lg sm:rounded-xl py-1 sm:py-1.5 px-0.5 sm:px-1 text-center border"
                          style={{ borderColor: `${borderColor}30` }}
                        >
                          <span className="text-xs sm:text-base md:text-lg font-black text-white leading-none font-mono block">
                            {fmt(cd.days)}
                          </span>
                          <span className="text-[7px] sm:text-[8px] font-bold text-emerald-300/70 uppercase mt-0.5 block">
                            {isArabic ? 'يوم' : 'Days'}
                          </span>
                        </div>

                        <div 
                          className="bg-black/40 backdrop-blur-md rounded-lg sm:rounded-xl py-1 sm:py-1.5 px-0.5 sm:px-1 text-center border"
                          style={{ borderColor: `${borderColor}30` }}
                        >
                          <span className="text-xs sm:text-base md:text-lg font-black text-white leading-none font-mono block">
                            {fmt(cd.hours)}
                          </span>
                          <span className="text-[7px] sm:text-[8px] font-bold text-emerald-300/70 uppercase mt-0.5 block">
                            {isArabic ? 'ساعة' : 'Hours'}
                          </span>
                        </div>

                        <div 
                          className="bg-black/40 backdrop-blur-md rounded-lg sm:rounded-xl py-1 sm:py-1.5 px-0.5 sm:px-1 text-center border"
                          style={{ borderColor: `${borderColor}30` }}
                        >
                          <span className="text-xs sm:text-base md:text-lg font-black text-white leading-none font-mono block">
                            {fmt(cd.minutes)}
                          </span>
                          <span className="text-[7px] sm:text-[8px] font-bold text-emerald-300/70 uppercase mt-0.5 block">
                            {isArabic ? 'دقيقة' : 'Mins'}
                          </span>
                        </div>

                        <div 
                          className="bg-black/40 backdrop-blur-md rounded-lg sm:rounded-xl py-1 sm:py-1.5 px-0.5 sm:px-1 text-center border"
                          style={{ borderColor: `${borderColor}30` }}
                        >
                          <span 
                            className="text-xs sm:text-base md:text-lg font-black leading-none font-mono block"
                            style={{ color: accentColor }}
                          >
                            {fmt(cd.seconds)}
                          </span>
                          <span className="text-[7px] sm:text-[8px] font-bold text-emerald-300/70 uppercase mt-0.5 block">
                            {isArabic ? 'ثانية' : 'Secs'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Bottom Actions Row: Coupon Copy + Booking CTA */}
                <div 
                  className="relative z-10 pt-2 sm:pt-3 border-t space-y-2"
                  style={{ borderColor: `${borderColor}30` }}
                >
                  
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Coupon Code Pill */}
                    <button
                      onClick={() => handleCopyCoupon(offer.couponCode)}
                      title={isArabic ? 'انقر لنسخ كود الكوبون' : 'Click to copy coupon code'}
                      className="border border-dashed bg-black/30 hover:bg-black/50 text-white rounded-lg sm:rounded-xl px-2 py-1.5 sm:px-2.5 sm:py-2.5 flex items-center justify-center gap-1 font-mono text-[10px] sm:text-xs font-black transition-all cursor-pointer shrink-0"
                      style={{ borderColor: `${accentColor}80` }}
                    >
                      {copiedCoupon === offer.couponCode ? (
                        <>
                          <Check className="w-3 h-3 stroke-[3]" style={{ color: accentColor }} />
                          <span className="text-[9px] sm:text-[10px] font-sans font-bold" style={{ color: accentColor }}>
                            {isArabic ? 'تم!' : 'Copied!'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3" style={{ color: `${accentColor}cc` }} />
                          <span className="text-[9.5px] sm:text-[11px]">{offer.couponCode}</span>
                        </>
                      )}
                    </button>

                    {/* Primary CTA Button */}
                    <button
                      onClick={() => onClaimOffer(isArabic ? offer.titleAr : offer.titleEn, offer.discountValue)}
                      className="flex-1 font-black text-[10px] sm:text-xs sm:text-sm py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl shadow-md transition-all active:scale-98 text-center cursor-pointer flex items-center justify-center gap-1"
                      style={{
                        backgroundColor: accentColor,
                        color: styling.badgeTextColor || '#022c22'
                      }}
                    >
                      <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" style={{ fill: 'currentColor' }} />
                      <span className="truncate">
                        {claimText}
                      </span>
                    </button>
                  </div>

                  {/* Contact Phone & Info Bar */}
                  <div 
                    className="flex items-center justify-between text-[8px] sm:text-[10px] text-emerald-200/70 pt-0.5 border-t"
                    style={{ borderColor: `${borderColor}20` }}
                  >
                    <a href={`tel:${contactPhone}`} className="flex items-center gap-1 hover:text-white font-mono font-bold">
                      <Phone className="w-2 h-2 sm:w-2.5 sm:h-2.5" style={{ color: accentColor }} />
                      <span>{contactPhone}</span>
                    </a>

                    <div className="flex items-center gap-1 font-medium">
                      <span>@rabacenter</span>
                      <span>•</span>
                      <span>raba-center.com</span>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Slider Indicator Dots */}
        {activeOffers.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
            {activeOffers.map((offer, idx) => (
              <button
                key={offer.id}
                onClick={() => {
                  if (sliderRef.current) {
                    const isMobile = window.innerWidth < 640;
                    const cardWidth = isMobile ? (window.innerWidth * 0.78 + 12) : 380;
                    sliderRef.current.scrollTo({
                      left: isArabic ? -idx * cardWidth : idx * cardWidth,
                      behavior: 'smooth'
                    });
                  }
                }}
                aria-label={`Go to offer ${idx + 1}`}
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500/30 hover:bg-[#00E5BE] transition-all cursor-pointer"
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default OffersSection;
