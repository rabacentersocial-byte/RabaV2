import React, { useState, useEffect, useRef } from 'react';
import { 
  Tag, 
  Copy, 
  Check, 
  Calendar, 
  Clock, 
  Sun, 
  Gift, 
  Percent, 
  Sparkles,
  Phone,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  CheckCircle2
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
    const scrollAmount = 430; // Card width + gap
    
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
      className="py-14 sm:py-20 bg-slate-50/60 dark:bg-[#061F1A]/70 relative overflow-hidden transition-colors border-b border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle background national grid texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px]"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header with title and Slider Navigation arrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          
          <div className={`max-w-3xl ${isArabic ? 'text-right' : 'text-left'}`}>
            
            {/* National Day Tracked Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-500/30 px-3.5 py-1.5 rounded-full text-[#0D6D54] dark:text-[#52B79A] text-xs font-black tracking-widest uppercase mb-3 shadow-2xs">
              <span className="text-base">🇸🇦</span>
              <span>{isArabic ? 'عروض وتخفيضات اليوم الوطني الـ96 — عزّنا بطبعنا' : 'SAUDI NATIONAL DAY 96 EXCLUSIVE OFFERS'}</span>
            </div>

            {/* Headline with dot */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-2">
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

            <p className="text-sm sm:text-base text-slate-600 dark:text-emerald-100/80 leading-relaxed max-w-2xl font-medium">
              {isArabic 
                ? 'استكشف باقة عروضنا الحصرية بمناسبة اليوم الوطني السعودي الـ96 مع إمكانية التمرير والاستفادة الفورية.'
                : 'Explore our premier exclusive offers for Saudi National Day 96 with convenient horizontal slider.'}
            </p>
          </div>

          {/* Navigation Arrows for Slider */}
          <div className="shrink-0 flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-2xl backdrop-blur-md text-xs font-bold text-slate-700 dark:text-emerald-200 shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#0D6D54] dark:text-[#00E5BE]" />
              <span>{isArabic ? `${activeOffers.length} عروض متاحة` : `${activeOffers.length} Active Offers`}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScroll('prev')}
                aria-label={isArabic ? 'العرض السابق' : 'Previous offer'}
                className="w-10 h-10 rounded-full border border-slate-200 dark:border-emerald-500/30 bg-white dark:bg-[#062c22]/80 text-slate-700 dark:text-emerald-200 hover:text-emerald-700 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-600/40 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              >
                {isArabic ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>

              <button
                onClick={() => handleScroll('next')}
                aria-label={isArabic ? 'العرض التالي' : 'Next offer'}
                className="w-10 h-10 rounded-full border border-slate-200 dark:border-emerald-500/30 bg-white dark:bg-[#062c22]/80 text-slate-700 dark:text-emerald-200 hover:text-emerald-700 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-600/40 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              >
                {isArabic ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
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
          className={`flex gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-6 pt-2 ${
            isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
          }`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {activeOffers.map((offer) => {
            const cd = countdowns[offer.id] || { days: 0, hours: 0, minutes: 0, seconds: 0 };
            const isFreeDay = offer.discountType === 'free_day';
            const isPercentage = offer.discountType === 'percentage';

            return (
              <div 
                key={offer.id}
                id={`offer-card-${offer.id}`}
                className="w-[88vw] max-w-[420px] sm:w-[410px] md:w-[430px] lg:w-[440px] shrink-0 snap-start rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#062c22] via-[#093c2f] to-[#041d17] border border-emerald-500/35 relative overflow-hidden shadow-2xl flex flex-col justify-between hover:border-emerald-400/60 transition-all duration-300"
              >
                {/* Ambient Corner Glow */}
                <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  
                  {/* Card Header: National Day Badge & Type Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-emerald-500/20">
                    {offer.isNationalDay ? (
                      <SaudiNationalDayBadge className="scale-90 origin-right sm:origin-auto" />
                    ) : (
                      <div className="flex items-center gap-1.5 bg-[#03231B] border border-emerald-500/40 rounded-xl px-2.5 py-1 text-xs font-bold text-emerald-300">
                        <Tag className="w-3.5 h-3.5 text-[#00E5BE]" />
                        <span>{isArabic ? offer.titleAr : offer.titleEn}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[#00E5BE] animate-ping" />
                      <span className="text-[10px] sm:text-[11px] font-black text-[#00E5BE] uppercase tracking-wider">
                        {isArabic ? offer.badgeAr : offer.badgeEn}
                      </span>
                    </div>
                  </div>

                  {/* Main Typography & Visual Graphic Row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    
                    {/* Typography details */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      
                      {/* Big Title */}
                      <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md leading-tight">
                        {isArabic ? offer.titleAr : offer.titleEn}
                      </h3>

                      {/* Subtitle / Ribbon */}
                      <div className="inline-block">
                        <span className="bg-[#00E5BE] text-slate-950 font-black text-xs sm:text-sm px-3 py-0.5 rounded-full shadow-md tracking-wide">
                          {isArabic ? (isFreeDay ? 'لجميع عملائنا' : 'للعملاء الجدد') : (isFreeDay ? 'All Clients' : 'New Clients')}
                        </span>
                      </div>

                      {/* Occasion / Subtitle text */}
                      <p className="text-emerald-200/90 font-bold text-xs sm:text-sm pt-0.5 truncate">
                        {isArabic ? offer.subtitleAr : offer.subtitleEn}
                      </p>

                      {/* Display Value (96 or 35% or Fixed) */}
                      {isFreeDay ? (
                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="text-4xl sm:text-5xl font-black bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-sans tracking-tight">
                            96
                          </span>
                          <span className="text-[10px] sm:text-xs font-black text-amber-300 uppercase tracking-widest">
                            {isArabic ? 'عزّ وفخر' : 'GLORY & PRIDE'}
                          </span>
                        </div>
                      ) : isPercentage ? (
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00E5BE] to-white drop-shadow-[0_4px_12px_rgba(0,229,190,0.3)] font-sans">
                            {offer.discountValue}%
                          </span>
                          <span className="text-base sm:text-lg font-black text-white leading-tight">
                            {isArabic ? 'خصـم' : 'OFF'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="text-3xl sm:text-4xl font-black text-[#00E5BE]">
                            {offer.discountValue} {isArabic ? 'ر.س' : 'SAR'}
                          </span>
                        </div>
                      )}

                    </div>

                    {/* Graphic: Saudi Falcon for National Day or Special Icon */}
                    <div className="shrink-0 self-center">
                      {offer.isNationalDay ? (
                        <SaudiFalconGraphic className="w-20 h-20 sm:w-24 sm:h-24" />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center">
                          <Gift className="w-10 h-10 text-[#00E5BE]" />
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Subcard with date & terms */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-[#032019]/90 border border-emerald-500/30 text-emerald-100 mb-4 shadow-inner space-y-2">
                    
                    {/* Date line */}
                    <div className="flex items-center gap-1.5 text-amber-300 font-black text-xs sm:text-sm">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{isArabic ? offer.dateLabelAr : offer.dateLabelEn}</span>
                    </div>

                    {/* Brief description or terms list */}
                    {offer.terms && offer.terms.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-emerald-100/90 pt-1">
                        {offer.terms.map((term, i) => (
                          <div key={i} className="flex items-start gap-1.5 bg-black/20 px-2 py-1 rounded-lg border border-white/5">
                            <span className="text-[#00E5BE] font-bold">•</span>
                            <span className="leading-tight truncate">
                              {isArabic ? term.textAr : term.textEn}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-emerald-200/90 leading-relaxed">
                        {isArabic ? offer.descriptionAr : offer.descriptionEn}
                      </p>
                    )}

                  </div>

                  {/* Countdown Timer */}
                  <div className="mb-4">
                    <span className="text-[9px] font-black tracking-widest text-emerald-300/80 uppercase block mb-1.5">
                      {isArabic ? 'المتبقي حتى الموعد المحدد' : 'COUNTDOWN'}
                    </span>

                    <div className="grid grid-cols-4 gap-1.5">
                      <div className="bg-black/40 backdrop-blur-md rounded-xl py-1.5 px-1 text-center border border-white/10">
                        <span className="text-base sm:text-lg font-black text-white leading-none font-mono block">
                          {fmt(cd.days)}
                        </span>
                        <span className="text-[8px] font-bold text-emerald-300/70 uppercase mt-0.5 block">
                          {isArabic ? 'يوم' : 'Days'}
                        </span>
                      </div>

                      <div className="bg-black/40 backdrop-blur-md rounded-xl py-1.5 px-1 text-center border border-white/10">
                        <span className="text-base sm:text-lg font-black text-white leading-none font-mono block">
                          {fmt(cd.hours)}
                        </span>
                        <span className="text-[8px] font-bold text-emerald-300/70 uppercase mt-0.5 block">
                          {isArabic ? 'ساعة' : 'Hours'}
                        </span>
                      </div>

                      <div className="bg-black/40 backdrop-blur-md rounded-xl py-1.5 px-1 text-center border border-white/10">
                        <span className="text-base sm:text-lg font-black text-white leading-none font-mono block">
                          {fmt(cd.minutes)}
                        </span>
                        <span className="text-[8px] font-bold text-emerald-300/70 uppercase mt-0.5 block">
                          {isArabic ? 'دقيقة' : 'Mins'}
                        </span>
                      </div>

                      <div className="bg-black/40 backdrop-blur-md rounded-xl py-1.5 px-1 text-center border border-white/10">
                        <span className="text-base sm:text-lg font-black text-[#00E5BE] leading-none font-mono block">
                          {fmt(cd.seconds)}
                        </span>
                        <span className="text-[8px] font-bold text-emerald-300/70 uppercase mt-0.5 block">
                          {isArabic ? 'ثانية' : 'Secs'}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Actions Row: Coupon Copy + Booking CTA */}
                <div className="relative z-10 pt-3 border-t border-emerald-500/20 space-y-3">
                  
                  <div className="flex items-center gap-2">
                    {/* Coupon Code Pill */}
                    <button
                      onClick={() => handleCopyCoupon(offer.couponCode)}
                      title={isArabic ? 'انقر لنسخ كود الكوبون' : 'Click to copy coupon code'}
                      className="border border-dashed border-emerald-400/50 bg-black/30 hover:bg-black/50 text-white rounded-xl px-2.5 py-2.5 flex items-center justify-center gap-1 font-mono text-xs font-black transition-all cursor-pointer shrink-0"
                    >
                      {copiedCoupon === offer.couponCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                          <span className="text-[#00E5BE] text-[10px] font-sans font-bold">
                            {isArabic ? 'تم النسخ!' : 'Copied!'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-emerald-300/80" />
                          <span className="text-[11px]">{offer.couponCode}</span>
                        </>
                      )}
                    </button>

                    {/* Primary CTA Button */}
                    <button
                      onClick={() => onClaimOffer(isArabic ? offer.titleAr : offer.titleEn, offer.discountValue)}
                      className="flex-1 bg-gradient-to-r from-[#00E5BE] via-emerald-400 to-[#00E5BE] hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm py-2.5 sm:py-3 px-3 rounded-xl shadow-md transition-all active:scale-98 text-center cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950 shrink-0" />
                      <span className="truncate">
                        {isArabic ? (isFreeDay ? 'حجز اليوم المجاني' : `الاستفادة من العرض (${offer.couponCode})`) : 'Claim Offer'}
                      </span>
                    </button>
                  </div>

                  {/* Contact Phone & Info Bar */}
                  <div className="flex items-center justify-between text-[10px] text-emerald-200/70 pt-1 border-t border-emerald-500/10">
                    <a href="tel:0575100100" className="flex items-center gap-1 hover:text-white font-mono font-bold">
                      <Phone className="w-2.5 h-2.5 text-[#00E5BE]" />
                      <span>0575100100</span>
                    </a>

                    <div className="flex items-center gap-1.5 font-medium">
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
          <div className="flex items-center justify-center gap-2 mt-4">
            {activeOffers.map((offer, idx) => (
              <button
                key={offer.id}
                onClick={() => {
                  if (sliderRef.current) {
                    const cardWidth = 430;
                    sliderRef.current.scrollTo({
                      left: isArabic ? -idx * cardWidth : idx * cardWidth,
                      behavior: 'smooth'
                    });
                  }
                }}
                aria-label={`Go to offer ${idx + 1}`}
                className="w-2.5 h-2.5 rounded-full bg-emerald-500/30 hover:bg-[#00E5BE] transition-all cursor-pointer"
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default OffersSection;
