import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Play, Pause, Handshake, ShieldCheck, Building2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { 
  PartnerItem, 
  PartnersSliderSettings, 
  DEFAULT_PARTNERS, 
  DEFAULT_PARTNERS_SETTINGS, 
  getStoredPartners, 
  getStoredPartnersSettings,
} from '../data/partnersData';
import { PartnerLogoRenderer } from './PartnerLogos';

export const PartnersSection: React.FC = () => {
  const { isArabic } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Guarantee active partners list with fallback to DEFAULT_PARTNERS
  const [partners, setPartners] = useState<PartnerItem[]>(() => {
    const stored = getStoredPartners();
    const active = stored.filter(p => p.isActive !== false);
    return active.length > 0 ? active : DEFAULT_PARTNERS;
  });

  const [settings, setSettings] = useState<PartnersSliderSettings>(() => getStoredPartnersSettings());
  const [activeCenterIndex, setActiveCenterIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPausedManually, setIsPausedManually] = useState(false);

  // Layout measurements
  const viewportRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const [renderOffset, setRenderOffset] = useState(0);

  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Card dimensions
  const getCardStride = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return 160; // 144px card + 16px gap
    }
    return 200; // 176px card + 24px gap
  };

  const getCardWidth = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return 144;
    }
    return 176;
  };

  const speedPxPerSec = Math.max(25, Math.min(75, 1700 / (settings.speedSeconds || 40)));

  // Sync with storage updates
  useEffect(() => {
    const handlePartnersUpdate = (e?: any) => {
      const stored = Array.isArray(e?.detail) && e.detail.length > 0 ? e.detail : getStoredPartners();
      const active = stored.filter((p: PartnerItem) => p.isActive !== false);
      setPartners(active.length > 0 ? active : DEFAULT_PARTNERS);
    };

    const handleSettingsUpdate = (e?: any) => {
      const stored = e?.detail || getStoredPartnersSettings();
      setSettings(stored);
    };

    window.addEventListener('raba_partners_updated', handlePartnersUpdate);
    window.addEventListener('raba_partners_settings_updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('raba_partners_updated', handlePartnersUpdate);
      window.removeEventListener('raba_partners_settings_updated', handleSettingsUpdate);
    };
  }, []);

  const effectivePartners = partners.length > 0 ? partners : DEFAULT_PARTNERS;
  const totalPartners = effectivePartners.length;

  // Triplicate list for continuous infinite loop without blank gaps
  const displayList = [...effectivePartners, ...effectivePartners, ...effectivePartners];

  // Wrap offset within one full set of cards
  const wrapOffset = useCallback((rawOffset: number) => {
    const cardStride = getCardStride();
    const singleSetWidth = totalPartners * cardStride;
    if (singleSetWidth <= 0) return rawOffset;

    let wrapped = rawOffset;
    while (wrapped < -singleSetWidth) {
      wrapped += singleSetWidth;
    }
    while (wrapped > 0) {
      wrapped -= singleSetWidth;
    }
    return wrapped;
  }, [totalPartners]);

  // Initial offset starts at 0 so cards are immediately visible in the viewport
  useEffect(() => {
    offsetRef.current = 0;
    setRenderOffset(0);
  }, [totalPartners]);

  // Continuous animation loop
  useEffect(() => {
    let active = true;

    const loop = (time: number) => {
      if (!active) return;
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Move continuously when not dragging and not paused
      if (!isDraggingRef.current && !isPausedManually) {
        offsetRef.current -= speedPxPerSec * delta;
        offsetRef.current = wrapOffset(offsetRef.current);
        setRenderOffset(offsetRef.current);
      }

      // Detect center primary card
      if (viewportRef.current) {
        const vpWidth = viewportRef.current.clientWidth;
        const vpCenter = vpWidth / 2;
        const cardStride = getCardStride();
        const cardWidth = getCardWidth();

        let closestIdx: number | null = null;
        let minDistance = Infinity;

        for (let i = 0; i < displayList.length; i++) {
          const cardX = offsetRef.current + i * cardStride + cardWidth / 2;
          const dist = Math.abs(vpCenter - cardX);
          if (dist < minDistance) {
            minDistance = dist;
            closestIdx = i;
          }
        }

        if (minDistance < cardStride * 0.65 && closestIdx !== null) {
          setActiveCenterIndex(closestIdx);
        } else {
          setActiveCenterIndex(null);
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      lastTimeRef.current = null;
    };
  }, [isPausedManually, wrapOffset, displayList.length, speedPxPerSec]);

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    const newOffset = dragStartOffsetRef.current + deltaX;
    offsetRef.current = wrapOffset(newOffset);
    setRenderOffset(offsetRef.current);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Step button (Next / Prev)
  const handleStep = (direction: 'next' | 'prev') => {
    const cardStride = getCardStride();
    const delta = direction === 'next' ? -cardStride : cardStride;
    offsetRef.current = wrapOffset(offsetRef.current + delta);
    setRenderOffset(offsetRef.current);
  };

  return (
    <section 
      id="partners" 
      className="py-16 sm:py-24 bg-gradient-to-b from-white via-slate-50/80 to-slate-100/60 dark:from-[#061D17] dark:via-[#08241D] dark:to-[#051B16] text-slate-900 dark:text-white relative overflow-hidden select-none border-t border-b border-slate-200/80 dark:border-white/10 transition-colors"
    >
      {/* Background Subtle RABA Emerald Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[380px] bg-emerald-500/[0.04] dark:bg-emerald-400/[0.06] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 dark:via-emerald-400/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* HEADER: Conforming to RABA's Clinical & Rehabilitation Identity */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          
          {/* Badge Pill: تحالفات التمكين والرعاية */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/90 dark:border-emerald-700/50 text-[#0D6D54] dark:text-[#2DD4BF] text-xs sm:text-[13px] font-bold mb-4 shadow-2xs">
            <Handshake className="w-4 h-4 text-[#0D6D54] dark:text-[#2DD4BF] shrink-0" />
            <span>{isArabic ? (settings.badgeTextAr || 'تحالفات التمكين والرعاية') : (settings.badgeTextEn || 'CARE ALLIANCES')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
            {isArabic ? (
              <>
                <span>{settings.sectionTitleAr || 'شركاؤنا في رحلة الرعاية والتمكين'}</span>
                <span className="text-[#0D6D54] dark:text-[#2DD4BF]">.</span>
              </>
            ) : (
              <>
                <span>{settings.sectionTitleEn || 'Our Partners in Care & Empowerment'}</span>
                <span className="text-[#0D6D54] dark:text-[#2DD4BF]">.</span>
              </>
            )}
          </h2>

          {/* Subtitle */}
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed px-4 max-w-2xl mx-auto font-normal">
            {isArabic 
              ? (settings.sectionSubtitleAr || 'شراكات استراتيجية واعتمادات تأمينية وطنية تضمن لأطفالنا أعلى معايير الجودة والتأهيل والدمج المدرسي والمجتمعي.')
              : (settings.sectionSubtitleEn || 'Strategic alliances and national insurance accreditations ensuring children receive world-class care.')}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* HORIZONTAL CONTINUOUS SLIDER TRACK (DRAGGABLE & GUARANTEED VISIBLE) */}
        {/* Using dir="ltr" on track wrapper for mathematically guaranteed positioning */}
        {/* ========================================================================= */}
        <div 
          ref={viewportRef}
          dir="ltr"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative w-full py-10 sm:py-14 overflow-hidden flex items-center touch-pan-y ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ touchAction: 'pan-y' }}
        >
          {/* Horizontal Emerald Line Passing Behind Cards */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/25 dark:via-emerald-400/35 to-transparent pointer-events-none z-0" />

          {/* Left and Right Fade Masks for seamless infinite flow */}
          <div className="absolute top-0 right-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-100 via-slate-100/80 to-transparent dark:from-[#061D17] dark:via-[#061D17]/80 dark:to-transparent z-30 pointer-events-none" />
          <div className="absolute top-0 left-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-100 via-slate-100/80 to-transparent dark:from-[#061D17] dark:via-[#061D17]/80 dark:to-transparent z-30 pointer-events-none" />

          {/* Moving Track via Transform TranslateX */}
          <div
            className="flex items-center gap-4 sm:gap-6 will-change-transform z-10 shrink-0"
            style={{
              transform: `translate3d(${renderOffset}px, 0, 0)`,
              transition: isDragging ? 'none' : 'none',
            }}
          >
            {displayList.map((partner, index) => {
              const isCenterPrimary = activeCenterIndex === index;
              const hasLogo = Boolean(partner.logoUrl && partner.logoUrl.trim().length > 5);
              const shouldShowLogo = settings.displayMode === 'logo' || (settings.displayMode === 'auto' && hasLogo);

              return (
                <div
                  key={`${partner.id}-${index}`}
                  dir={isArabic ? 'rtl' : 'ltr'}
                  className="shrink-0 transition-transform duration-300 will-change-transform"
                >
                  {/* SQUIRCLE CARD with Elevation and Highlight when Center */}
                  <div
                    className={`w-[144px] h-[175px] sm:w-[176px] sm:h-[195px] rounded-3xl p-3 sm:p-3.5 flex flex-col items-center justify-between transition-all duration-300 pointer-events-none ${
                      isCenterPrimary
                        ? '-translate-y-3 sm:-translate-y-4 scale-108 sm:scale-110 bg-white dark:bg-[#0B2E24] border-2 border-[#0D6D54] dark:border-[#2DD4BF] ring-4 ring-emerald-500/20 dark:ring-[#2DD4BF]/25 shadow-2xl shadow-emerald-700/20 z-20'
                        : 'bg-white/95 dark:bg-[#08251E]/90 backdrop-blur-md border border-slate-200/90 dark:border-white/10 hover:border-emerald-400/50 shadow-md dark:shadow-black/40'
                    }`}
                  >
                    {/* Top Category Badge */}
                    <div className="w-full flex items-center justify-center">
                      <span 
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-tight truncate max-w-full transition-colors ${
                          isCenterPrimary
                            ? 'bg-emerald-100 dark:bg-emerald-900/60 text-[#0D6D54] dark:text-[#2DD4BF]'
                            : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <ShieldCheck className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{partner.badge || (isArabic ? 'شريك معتمد' : 'Verified')}</span>
                      </span>
                    </div>

                    {/* Logo Image OR Monogram Circle */}
                    <div className="flex-1 w-full flex items-center justify-center my-1.5 overflow-hidden">
                      {shouldShowLogo && (partner.logoUrl || partner.id) ? (
                        <div className="w-full h-16 sm:h-20 rounded-2xl bg-white dark:bg-white/95 border border-slate-200/60 dark:border-white/20 flex items-center justify-center p-2 sm:p-2.5 shadow-xs">
                          <PartnerLogoRenderer 
                            partnerId={partner.id} 
                            logoUrl={partner.logoUrl} 
                            name={partner.name} 
                          />
                        </div>
                      ) : (
                        <div 
                          className={`rounded-full flex items-center justify-center font-black transition-all duration-300 shadow-inner ${
                            isCenterPrimary
                              ? 'w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 dark:bg-emerald-950/80 border-2 border-[#0D6D54] dark:border-[#2DD4BF] text-[#0D6D54] dark:text-[#2DD4BF] text-xl sm:text-2xl scale-105 shadow-md'
                              : 'w-11 h-11 sm:w-13 sm:h-13 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-lg sm:text-xl'
                          }`}
                        >
                          {partner.letter || partner.name.slice(0, 1)}
                        </div>
                      )}
                    </div>

                    {/* Bottom Partner Label & Category */}
                    <div className="w-full text-center">
                      <span 
                        className={`block text-[11px] sm:text-xs tracking-tight truncate max-w-full transition-colors duration-300 ${
                          isCenterPrimary 
                            ? 'font-black text-[#0D6D54] dark:text-[#2DD4BF]' 
                            : 'font-bold text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {isArabic ? partner.name : partner.nameEn}
                      </span>

                      {partner.category && (
                        <span 
                          className="block text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-full mt-0.5"
                        >
                          {isArabic ? partner.category : partner.categoryEn}
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM CONTROLS & STATUS BAR */}
        <div className="mt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 px-2">
          
          {/* Live Status Hint */}
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isDragging ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`}></span>
            <span>
              {isDragging 
                ? (isArabic ? 'جارٍ السحب والتمرير اليدوي...' : 'Dragging...') 
                : (isArabic ? 'حركة مستمرة بدون توقف — اسحب للتنقل بين الشركاء' : 'Continuous scroll — drag to swipe')}
            </span>
          </div>

          {/* Quick Switching Buttons */}
          <div className="flex items-center gap-2 z-20">
            
            {/* Play / Pause Toggle */}
            <button
              onClick={() => setIsPausedManually(!isPausedManually)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:border-emerald-500 text-slate-700 dark:text-slate-300 hover:text-[#0D6D54] dark:hover:text-[#2DD4BF] transition-colors cursor-pointer shadow-xs"
            >
              {isPausedManually ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
              <span>{isPausedManually ? (isArabic ? 'تشغيل' : 'Play') : (isArabic ? 'إيقاف' : 'Pause')}</span>
            </button>

            {/* Prev step */}
            <button
              onClick={() => handleStep('prev')}
              aria-label={isArabic ? 'السابق' : 'Previous'}
              className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:border-emerald-500 text-slate-700 dark:text-slate-300 hover:text-[#0D6D54] dark:hover:text-[#2DD4BF] flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Next step */}
            <button
              onClick={() => handleStep('next')}
              aria-label={isArabic ? 'التالي' : 'Next'}
              className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:border-emerald-500 text-slate-700 dark:text-slate-300 hover:text-[#0D6D54] dark:hover:text-[#2DD4BF] flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PartnersSection;
