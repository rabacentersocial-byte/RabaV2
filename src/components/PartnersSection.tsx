import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  Handshake, 
  ShieldCheck, 
  Building2, 
  LayoutGrid, 
  SlidersHorizontal,
  ExternalLink,
  Sparkles,
  Info,
  X
} from 'lucide-react';
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
  
  const [partners, setPartners] = useState<PartnerItem[]>(() => {
    const stored = getStoredPartners();
    const active = stored.filter(p => p.isActive !== false);
    return active.length > 0 ? active : DEFAULT_PARTNERS;
  });

  const [settings, setSettings] = useState<PartnersSliderSettings>(() => getStoredPartnersSettings());
  const [selectedSector, setSelectedSector] = useState<'all' | 'government' | 'academic' | 'health' | 'corporate'>('all');
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const [activePartnerModal, setActivePartnerModal] = useState<PartnerItem | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isPausedManually, setIsPausedManually] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Layout & Animation measurements
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);

  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Card dimensions (Generous, professional dimensions)
  const getCardStride = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return 186; // 170px card + 16px gap
    }
    return 236; // 212px card + 24px gap
  };

  const getCardWidth = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return 170;
    }
    return 212;
  };

  // Speed calculation
  const speedPxPerSec = Math.max(30, Math.min(80, 1600 / (settings.speedSeconds || 32)));

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

  // Filter partners by sector if selected
  const filteredPartners = useMemo(() => {
    if (selectedSector === 'all') return partners;
    return partners.filter(p => p.sector === selectedSector);
  }, [partners, selectedSector]);

  const totalPartners = filteredPartners.length;

  // Triplicate list for continuous seamless infinite loop
  const displayList = useMemo(() => {
    if (filteredPartners.length === 0) return [];
    // Ensure sufficient items in marquee for continuous flow
    const multiplier = Math.max(3, Math.ceil(30 / filteredPartners.length));
    const items: PartnerItem[] = [];
    for (let i = 0; i < multiplier; i++) {
      items.push(...filteredPartners);
    }
    return items;
  }, [filteredPartners]);

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

  // Initial offset positioning
  useEffect(() => {
    const updateCenter = () => {
      if (viewportRef.current) {
        const vpWidth = viewportRef.current.clientWidth;
        const cardWidth = getCardWidth();
        const initialOffset = (vpWidth / 2) - (cardWidth / 2);
        offsetRef.current = initialOffset;
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${initialOffset}px, 0, 0)`;
        }
      }
    };
    updateCenter();
    window.addEventListener('resize', updateCenter);
    return () => window.removeEventListener('resize', updateCenter);
  }, [totalPartners, selectedSector]);

  // Continuous animation loop
  useEffect(() => {
    if (viewMode !== 'slider') return;

    let active = true;

    const loop = (time: number) => {
      if (!active) return;
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Move continuously when not dragging, not paused manually, and not hovered
      if (!isDraggingRef.current && !isPausedManually && !isHovered) {
        offsetRef.current -= speedPxPerSec * delta;
        offsetRef.current = wrapOffset(offsetRef.current);
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
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
  }, [isPausedManually, isHovered, wrapOffset, viewMode, speedPxPerSec]);

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (viewMode !== 'slider') return;
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
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }
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
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }
  };

  // Sectors categories definitions
  const sectors = useMemo(() => [
    { id: 'all', labelAr: `جميع الشركاء (${partners.length})`, labelEn: `All Partners (${partners.length})` },
    { id: 'government', labelAr: 'القطاعات الحكومية والرسمية', labelEn: 'Government & Ministries' },
    { id: 'academic', labelAr: 'الجهات الأكاديمية والتعليم', labelEn: 'Academic & Schools' },
    { id: 'health', labelAr: 'الرعاية الصحية والتشخيص', labelEn: 'Healthcare & Labs' },
    { id: 'corporate', labelAr: 'كبرى الشركات والتمكين', labelEn: 'Corporate & Finance' },
  ], [partners.length]);

  return (
    <section 
      id="partners" 
      className="py-16 sm:py-24 bg-transparent text-slate-900 dark:text-white relative overflow-hidden select-none border-b border-slate-200/80 dark:border-white/10 transition-colors"
    >
      {/* Background Subtle RABA Emerald Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[380px] bg-emerald-500/[0.04] dark:bg-emerald-400/[0.07] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 dark:via-emerald-400/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* HEADER: Enterprise Grade Clinical & Rehabilitation Partnership Header   */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          
          {/* Subtle Sector Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/90 dark:border-emerald-700/50 text-[#0D6D54] dark:text-[#2DD4BF] text-xs sm:text-[13px] font-bold mb-4 shadow-2xs">
            <Handshake className="w-4 h-4 text-[#0D6D54] dark:text-[#2DD4BF] shrink-0" />
            <span>{isArabic ? (settings.badgeTextAr || 'شركاء النجاح والتميز المؤسسي') : (settings.badgeTextEn || 'SUCCESS PARTNERS & ALLIANCES')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
            {isArabic ? (
              <>
                <span>{settings.sectionTitleAr || 'شركاؤنا في مسيرة النجاح والتمكين'}</span>
                <span className="text-[#0D6D54] dark:text-[#2DD4BF]">.</span>
              </>
            ) : (
              <>
                <span>{settings.sectionTitleEn || 'Our Partners in Success & Empowerment'}</span>
                <span className="text-[#0D6D54] dark:text-[#2DD4BF]">.</span>
              </>
            )}
          </h2>

          {/* Subtitle */}
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed px-4 max-w-2xl mx-auto font-normal">
            {isArabic 
              ? (settings.sectionSubtitleAr || 'نفخر بشراكاتنا الاستراتيجية مع كبرى القطاعات الحكومية والأكاديمية والصحية والتعليمية لتقديم أفضل برامج الرعاية والتأهيل والدمج.')
              : (settings.sectionSubtitleEn || 'Proud strategic alliances with leading governmental, academic, healthcare, and educational institutions.')}
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 sm:mt-8">
            {sectors.map((sec) => {
              const isSelected = selectedSector === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSector(sec.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0D6D54] text-white shadow-sm shadow-emerald-900/20 scale-102'
                      : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 hover:border-emerald-500/50 hover:text-emerald-700 dark:hover:text-emerald-300'
                  }`}
                >
                  {isArabic ? sec.labelAr : sec.labelEn}
                </button>
              );
            })}
          </div>

        </div>

        {/* View Switcher: Slider vs Grid */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {isArabic ? `${filteredPartners.length} جهة وشريك معتمد` : `${filteredPartners.length} Verified Partners`}
          </div>

          <div className="flex items-center gap-1.5 bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-300/50 dark:border-white/10">
            <button
              onClick={() => setViewMode('slider')}
              aria-label={isArabic ? 'عرض السلايدر' : 'Slider View'}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'slider' 
                  ? 'bg-white dark:bg-slate-900 text-[#0D6D54] dark:text-[#2DD4BF] shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isArabic ? 'سلايدر متدفق' : 'Slider'}</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              aria-label={isArabic ? 'عرض الشبكة' : 'Grid View'}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-slate-900 text-[#0D6D54] dark:text-[#2DD4BF] shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isArabic ? 'شبكة الشركاء' : 'Grid'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: HORIZONTAL CONTINUOUS INFINITE SLIDER TRACK                        */}
        {/* ========================================================================= */}
        {viewMode === 'slider' && (
          <div 
            ref={viewportRef}
            dir="ltr"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative w-full py-6 sm:py-8 overflow-hidden flex items-center touch-pan-y ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{ touchAction: 'pan-y' }}
          >
            {/* Subtle Horizon line behind cards */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 dark:via-emerald-400/25 to-transparent pointer-events-none z-0" />

            {/* Left and Right Fade Masks for seamless infinite flow */}
            <div className="absolute top-0 right-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-[#F8FAFC]/90 via-[#F8FAFC]/60 to-transparent dark:from-[#061412] dark:via-[#061412]/80 dark:to-transparent z-30 pointer-events-none" />
            <div className="absolute top-0 left-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-[#F8FAFC]/90 via-[#F8FAFC]/60 to-transparent dark:from-[#061412] dark:via-[#061412]/80 dark:to-transparent z-30 pointer-events-none" />

            {/* Moving Track */}
            <div
              ref={trackRef}
              className="flex items-center gap-4 sm:gap-6 will-change-transform z-10 shrink-0"
              style={{
                transition: isDragging ? 'none' : 'none',
              }}
            >
              {displayList.map((partner, index) => {
                return (
                  <div
                    key={`${partner.id}-${index}`}
                    dir={isArabic ? 'rtl' : 'ltr'}
                    className="shrink-0 transition-all duration-300"
                  >
                    {/* Modern Professional Partner Card */}
                    <div
                      onClick={() => setActivePartnerModal(partner)}
                      className={`group w-[170px] ${partner.canvasHeight === 'xl' || partner.canvasHeight === 'full' ? 'h-[235px] sm:h-[260px]' : 'h-[215px] sm:h-[240px]'} rounded-2xl p-3.5 sm:p-4 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 hover:border-emerald-500/60 dark:hover:border-[#2DD4BF]/60 hover:shadow-xl hover:shadow-emerald-900/10 dark:hover:shadow-emerald-950/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                        partner.cardStyle === 'glow' ? 'shadow-md ring-1 ring-emerald-500/20' : ''
                      }`}
                    >
                      {/* Optional Card Top Cover Banner */}
                      {partner.cardCoverUrl && (
                        <div className="absolute top-0 inset-x-0 h-10 overflow-hidden opacity-30 group-hover:opacity-45 transition-opacity">
                          <img src={partner.cardCoverUrl} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-slate-900" />
                        </div>
                      )}

                      {/* Top Header Row: Sector icon indicator & verified badge */}
                      <div className="flex items-center justify-between w-full relative z-10">
                        <span 
                          className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full truncate max-w-[85%]"
                          style={{
                            backgroundColor: partner.accentColor ? `${partner.accentColor}15` : undefined,
                            color: partner.accentColor || undefined
                          }}
                        >
                          {partner.badge || (isArabic ? 'شريك معتمد' : 'Verified')}
                        </span>
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" 
                          style={{ backgroundColor: partner.accentColor || '#0D6D54' }}
                        />
                      </div>

                      {/* Clean Framed Canvas for Logo */}
                      <div 
                        className={`w-full ${
                          partner.canvasHeight === 'sm' 
                            ? 'h-16 sm:h-18' 
                            : partner.canvasHeight === 'lg' 
                              ? 'h-24 sm:h-28' 
                              : partner.canvasHeight === 'xl' 
                                ? 'h-28 sm:h-32' 
                                : partner.canvasHeight === 'full' 
                                  ? 'h-32 sm:h-36' 
                                  : 'h-20 sm:h-24'
                        } rounded-xl ${
                          partner.expandImageToEdges 
                            ? 'border-0 p-0 shadow-none' 
                            : 'border border-slate-200/80 dark:border-white/20 shadow-2xs group-hover:shadow-sm group-hover:border-emerald-400/60 dark:group-hover:border-[#2DD4BF]/60'
                        } flex items-center justify-center overflow-hidden my-auto transition-all relative z-10`}
                        style={{
                          backgroundColor: partner.imageBgColor || (isDark ? 'rgba(255,255,255,0.96)' : '#ffffff')
                        }}
                      >
                        <PartnerLogoRenderer
                          partnerId={partner.id}
                          logoUrl={partner.logoUrl}
                          name={partner.name}
                          accentColor={partner.accentColor}
                          letter={partner.letter}
                          imageFit={partner.imageFit}
                          imagePadding={partner.imagePadding}
                          logoScale={partner.logoScale}
                          expandImageToEdges={partner.expandImageToEdges}
                        />
                      </div>

                      {/* Partner Name & Subtitle */}
                      <div className="w-full text-center mt-1 relative z-10">
                        <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-[#0D6D54] dark:group-hover:text-[#2DD4BF] transition-colors">
                          {isArabic ? partner.name : partner.nameEn}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                          {isArabic ? partner.category : partner.categoryEn}
                        </p>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: FULL GRID VIEW OF ALL PARTNERS                                    */}
        {/* ========================================================================= */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5 py-6">
            {filteredPartners.map((partner) => (
              <div
                key={partner.id}
                onClick={() => setActivePartnerModal(partner)}
                className={`group rounded-2xl p-4 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 hover:border-emerald-500/60 dark:hover:border-[#2DD4BF]/60 hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                  partner.cardStyle === 'glow' ? 'shadow-md ring-1 ring-emerald-500/20' : ''
                }`}
              >
                {/* Optional Card Top Cover Banner */}
                {partner.cardCoverUrl && (
                  <div className="absolute top-0 inset-x-0 h-10 overflow-hidden opacity-30 group-hover:opacity-45 transition-opacity">
                    <img src={partner.cardCoverUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-slate-900" />
                  </div>
                )}

                <div className="flex items-center justify-between w-full mb-2 relative z-10">
                  <span 
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full truncate max-w-[85%]"
                    style={{
                      backgroundColor: partner.accentColor ? `${partner.accentColor}15` : undefined,
                      color: partner.accentColor || undefined
                    }}
                  >
                    {partner.badge || (isArabic ? 'شريك معتمد' : 'Verified')}
                  </span>
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" 
                    style={{ backgroundColor: partner.accentColor || '#0D6D54' }}
                  />
                </div>

                <div 
                  className={`w-full ${
                    partner.canvasHeight === 'sm' 
                      ? 'h-16' 
                      : partner.canvasHeight === 'lg' 
                        ? 'h-24' 
                        : partner.canvasHeight === 'xl' 
                          ? 'h-28' 
                          : partner.canvasHeight === 'full' 
                            ? 'h-32' 
                            : 'h-20'
                  } rounded-xl ${
                    partner.expandImageToEdges 
                      ? 'border-0 p-0 shadow-none' 
                      : 'border border-slate-200/80 dark:border-white/20 shadow-2xs group-hover:shadow-sm group-hover:border-emerald-400/60 dark:group-hover:border-[#2DD4BF]/60'
                  } flex items-center justify-center overflow-hidden my-auto transition-all relative z-10`}
                  style={{
                    backgroundColor: partner.imageBgColor || (isDark ? 'rgba(255,255,255,0.96)' : '#ffffff')
                  }}
                >
                  <PartnerLogoRenderer
                    partnerId={partner.id}
                    logoUrl={partner.logoUrl}
                    name={partner.name}
                    accentColor={partner.accentColor}
                    letter={partner.letter}
                    imageFit={partner.imageFit}
                    imagePadding={partner.imagePadding}
                    logoScale={partner.logoScale}
                    expandImageToEdges={partner.expandImageToEdges}
                  />
                </div>

                <div className="w-full text-center mt-3 relative z-10">
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-[#0D6D54] dark:group-hover:text-[#2DD4BF] transition-colors">
                    {isArabic ? partner.name : partner.nameEn}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                    {isArabic ? partner.category : partner.categoryEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* BOTTOM CONTROLS & STATUS BAR                                              */}
        {/* ========================================================================= */}
        {viewMode === 'slider' && (
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 px-2">
            
            {/* Live Status Hint */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isDragging ? 'bg-amber-500' : isHovered ? 'bg-blue-500' : 'bg-emerald-500 animate-pulse'}`}></span>
              <span>
                {isDragging 
                  ? (isArabic ? 'جارٍ السحب والتمرير اليدوي...' : 'Dragging...') 
                  : isHovered
                    ? (isArabic ? 'تم إيقاف الحركة مؤقتاً للتصفح' : 'Paused on hover')
                    : (isArabic ? 'حركة انسيابية مستمرة — مرر الماوس للتوقف أو اسحب للتنقل' : 'Continuous stream — hover to inspect')}
              </span>
            </div>

            {/* Quick Controls */}
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
        )}

        {/* Partnership Metrics Highlights */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5">
            <span className="block text-2xl sm:text-3xl font-black text-[#0D6D54] dark:text-[#2DD4BF] mb-1">+٢٠</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">
              {isArabic ? 'شراكة حكومية ومؤسسية رائدة' : 'Strategic Alliances'}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
              {isArabic ? 'وزارات وهيئات وطنية وكبرى الجامعات' : 'Ministries, Authorities & Universities'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5">
            <span className="block text-2xl sm:text-3xl font-black text-[#0D6D54] dark:text-[#2DD4BF] mb-1">١٠٠٪</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">
              {isArabic ? 'تكامل في مسارات الدمج والتأهيل' : 'Inclusion & Care Integration'}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
              {isArabic ? 'دمج مدرسي ورعاية تخصصية شاملة' : 'School Readiness & Dedicated Care'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5">
            <span className="block text-2xl sm:text-3xl font-black text-[#0D6D54] dark:text-[#2DD4BF] mb-1">مرن</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">
              {isArabic ? 'تيسير مالي وتسهيلات سداد' : 'Flexible Payment Solutions'}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
              {isArabic ? 'شراكات تمويلية وتقسيط بدون فوائد' : '0% Installment & Care Enablement'}
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* PARTNER DETAILS MODAL                                                     */}
      {/* ========================================================================= */}
      {activePartnerModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActivePartnerModal(null)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Optional Cover Banner */}
            {activePartnerModal.cardCoverUrl && (
              <div className="absolute top-0 inset-x-0 h-24 overflow-hidden opacity-35">
                <img src={activePartnerModal.cardCoverUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-slate-900" />
              </div>
            )}

            {/* Close button */}
            <button
              onClick={() => setActivePartnerModal(null)}
              className="absolute top-4 left-4 rtl:left-auto rtl:right-4 w-8 h-8 rounded-full bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-xs flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Logo in Header */}
            <div 
              className={`${
                activePartnerModal.canvasHeight === 'xl' || activePartnerModal.canvasHeight === 'full'
                  ? 'w-40 h-28 sm:w-48 sm:h-32'
                  : activePartnerModal.canvasHeight === 'lg'
                    ? 'w-32 h-24 sm:w-36 sm:h-26'
                    : activePartnerModal.canvasHeight === 'sm'
                      ? 'w-24 h-16 sm:w-28 sm:h-18'
                      : 'w-28 h-20 sm:w-32 sm:h-22'
              } mx-auto mb-4 rounded-2xl ${
                activePartnerModal.expandImageToEdges 
                  ? 'border-0 p-0 shadow-none' 
                  : 'border border-slate-200/80 dark:border-white/20 p-2 sm:p-3 shadow-xs'
              } flex items-center justify-center relative z-10 overflow-hidden transition-all`}
              style={{
                backgroundColor: activePartnerModal.imageBgColor || (isDark ? 'rgba(255,255,255,0.96)' : '#ffffff')
              }}
            >
              <PartnerLogoRenderer
                partnerId={activePartnerModal.id}
                logoUrl={activePartnerModal.logoUrl}
                name={activePartnerModal.name}
                accentColor={activePartnerModal.accentColor}
                letter={activePartnerModal.letter}
                imageFit={activePartnerModal.imageFit}
                imagePadding={activePartnerModal.imagePadding}
                logoScale={activePartnerModal.logoScale}
                expandImageToEdges={activePartnerModal.expandImageToEdges}
              />
            </div>

            {/* Partner Title & Category */}
            <div className="text-center mb-4 relative z-10">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {isArabic ? activePartnerModal.name : activePartnerModal.nameEn}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {isArabic ? activePartnerModal.category : activePartnerModal.categoryEn}
              </p>
              <div 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mt-3 border"
                style={{
                  backgroundColor: activePartnerModal.accentColor ? `${activePartnerModal.accentColor}15` : undefined,
                  borderColor: activePartnerModal.accentColor ? `${activePartnerModal.accentColor}30` : undefined,
                  color: activePartnerModal.accentColor || undefined
                }}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{activePartnerModal.badge || (isArabic ? 'شريك معتمد' : 'Verified Partner')}</span>
              </div>
            </div>

            {/* Scope of Partnership Description */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-center relative z-10">
              {isArabic 
                ? (activePartnerModal.description || 'شراكة استراتيجية مستمرة تسهم في تمكين أطفال مركز رابا وتقديم الدعم التخصصي والدمج المجتمعي بأعلى المعايير.')
                : (activePartnerModal.descriptionEn || 'Ongoing strategic alliance dedicated to empowering children with specialized care and community integration.')}
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex items-center gap-2 relative z-10">
              {activePartnerModal.websiteUrl && (
                <a
                  href={activePartnerModal.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'زيارة الموقع الرسمي' : 'Visit Website'}</span>
                </a>
              )}
              <button
                onClick={() => setActivePartnerModal(null)}
                className={`${activePartnerModal.websiteUrl ? 'flex-1' : 'w-full'} py-2.5 rounded-xl bg-[#0D6D54] hover:bg-[#09523F] text-white text-xs font-black shadow-sm transition-colors cursor-pointer`}
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default PartnersSection;
