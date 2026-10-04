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
  X,
  Search,
  Landmark,
  GraduationCap,
  Stethoscope,
  CreditCard,
  ArrowUpRight,
  CheckCircle2,
  Award,
  CalendarCheck
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
  const [searchQuery, setSearchQuery] = useState('');
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

  // Card stride for responsive calculations
  const getCardStride = () => {
    if (typeof window !== 'undefined') {
      const w = window.innerWidth;
      if (w < 640) {
        // Mobile card: ~210px + 16px gap = 226px
        return Math.min(Math.max(w * 0.58, 200), 235) + 16;
      }
      if (w < 1024) {
        return 260 + 20; // 280px stride
      }
      return 280 + 24; // 304px stride
    }
    return 280;
  };

  const getCardWidth = () => {
    if (typeof window !== 'undefined') {
      const w = window.innerWidth;
      if (w < 640) {
        return Math.min(Math.max(w * 0.58, 200), 235);
      }
      if (w < 1024) {
        return 260;
      }
      return 280;
    }
    return 260;
  };

  // Speed calculation
  const speedPxPerSec = Math.max(30, Math.min(75, 1600 / (settings.speedSeconds || 32)));

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

  // Filter partners by sector and search query
  const filteredPartners = useMemo(() => {
    return partners.filter(p => {
      const matchSector = selectedSector === 'all' || p.sector === selectedSector;
      if (!matchSector) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = (p.name || '').toLowerCase().includes(q) || (p.nameEn || '').toLowerCase().includes(q);
      const categoryMatch = (p.category || '').toLowerCase().includes(q) || (p.categoryEn || '').toLowerCase().includes(q);
      const badgeMatch = (p.badge || '').toLowerCase().includes(q);
      return nameMatch || categoryMatch || badgeMatch;
    });
  }, [partners, selectedSector, searchQuery]);

  const totalPartners = filteredPartners.length;

  // Triplicate list for continuous seamless infinite loop
  const displayList = useMemo(() => {
    if (filteredPartners.length === 0) return [];
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

  // Sector counts
  const sectorCounts = useMemo(() => {
    const counts = { all: partners.length, government: 0, academic: 0, health: 0, corporate: 0 };
    partners.forEach(p => {
      if (p.sector && p.sector in counts) {
        counts[p.sector as keyof typeof counts]++;
      }
    });
    return counts;
  }, [partners]);

  // Sectors categories definitions with counts and icons
  const sectors = useMemo(() => [
    { 
      id: 'all', 
      labelAr: `جميع الشركاء`, 
      labelEn: `All Partners`,
      count: sectorCounts.all,
      icon: Sparkles
    },
    { 
      id: 'government', 
      labelAr: 'القطاع الحكومي والرسمي', 
      labelEn: 'Government & Ministries',
      count: sectorCounts.government,
      icon: Landmark
    },
    { 
      id: 'academic', 
      labelAr: 'الجهات الأكاديمية والتعليم', 
      labelEn: 'Academic & Schools',
      count: sectorCounts.academic,
      icon: GraduationCap
    },
    { 
      id: 'health', 
      labelAr: 'الرعاية الصحية والتشخيص', 
      labelEn: 'Healthcare & Labs',
      count: sectorCounts.health,
      icon: Stethoscope
    },
    { 
      id: 'corporate', 
      labelAr: 'كبرى الشركات والتمكين', 
      labelEn: 'Corporate & Finance',
      count: sectorCounts.corporate,
      icon: CreditCard
    },
  ], [sectorCounts]);

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

          {/* Category Filter Tabs with Live Counts & Icons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 sm:mt-8">
            {sectors.map((sec) => {
              const isSelected = selectedSector === sec.id;
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSector(sec.id as any)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0D6D54] text-white shadow-md shadow-emerald-900/20 scale-102 ring-2 ring-emerald-500/30'
                      : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 hover:border-emerald-500/50 hover:text-emerald-700 dark:hover:text-emerald-300 hover:shadow-xs'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                  <span>{isArabic ? sec.labelAr : sec.labelEn}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    {sec.count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* View Switcher & Quick Search Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 px-2">
          
          {/* Quick Search Input */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isArabic ? 'ابحث عن جهة أو شريك...' : 'Search partners...'}
              className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-1.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 -translate-y-1/2 right-2.5 rtl:right-auto rtl:left-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isArabic 
                ? `${filteredPartners.length} جهة وشريك معتمد` 
                : `${filteredPartners.length} Verified Partners`}
            </div>

            {/* Switcher Buttons */}
            <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-300/50 dark:border-white/10">
              <button
                onClick={() => setViewMode('slider')}
                aria-label={isArabic ? 'عرض السلايدر' : 'Slider View'}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'slider' 
                    ? 'bg-white dark:bg-slate-900 text-[#0D6D54] dark:text-[#2DD4BF] shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{isArabic ? 'متدفق' : 'Slider'}</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                aria-label={isArabic ? 'عرض الشبكة' : 'Grid View'}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-slate-900 text-[#0D6D54] dark:text-[#2DD4BF] shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{isArabic ? 'شبكة' : 'Grid'}</span>
              </button>
            </div>
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
            <div className="absolute top-0 right-0 bottom-0 w-12 sm:w-32 bg-gradient-to-l from-[#F8FAFC] via-[#F8FAFC]/70 to-transparent dark:from-[#061412] dark:via-[#061412]/80 dark:to-transparent z-30 pointer-events-none" />
            <div className="absolute top-0 left-0 bottom-0 w-12 sm:w-32 bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC]/70 to-transparent dark:from-[#061412] dark:via-[#061412]/80 dark:to-transparent z-30 pointer-events-none" />

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
                    {/* Modern Professional Partner Card - Matching high-prestige clinical standards */}
                    <div
                      onClick={() => setActivePartnerModal(partner)}
                      className={`group w-[58vw] min-w-[200px] max-w-[235px] sm:min-w-0 sm:max-w-none sm:w-[260px] lg:w-[280px] h-[215px] sm:h-[230px] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xs border border-slate-200/90 dark:border-white/10 hover:border-emerald-500/60 dark:hover:border-[#2DD4BF]/60 hover:shadow-xl hover:shadow-emerald-900/10 dark:hover:shadow-emerald-950/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                        partner.cardStyle === 'glow' ? 'shadow-md ring-1 ring-emerald-500/20' : ''
                      }`}
                    >
                      {/* Subtle Top Ambient Gradient */}
                      <div 
                        className="absolute top-0 inset-x-0 h-1.5 opacity-80"
                        style={{ backgroundColor: partner.accentColor || '#0D6D54' }}
                      />

                      {/* Top Header Row: Sector icon indicator & verified badge */}
                      <div className="flex items-center justify-between w-full pt-1 relative z-10">
                        <span 
                          className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full truncate max-w-[85%]"
                          style={{
                            backgroundColor: partner.accentColor ? `${partner.accentColor}15` : undefined,
                            color: partner.accentColor || undefined
                          }}
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">{partner.badge || (isArabic ? 'شريك معتمد' : 'Verified')}</span>
                        </span>
                        
                        <span 
                          className="w-2 h-2 rounded-full shrink-0 shadow-xs" 
                          style={{ backgroundColor: partner.accentColor || '#0D6D54' }}
                        />
                      </div>

                      {/* Clean Framed Canvas for Logo */}
                      <div 
                        className="w-full h-22 sm:h-24 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-2xs group-hover:shadow-xs group-hover:border-emerald-400/50 dark:group-hover:border-[#2DD4BF]/50 flex items-center justify-center overflow-hidden my-auto transition-all relative z-10 p-2"
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

                      {/* Partner Name, Subtitle & Interactive Micro-Action */}
                      <div className="w-full text-center mt-0.5 relative z-10">
                        <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-[#0D6D54] dark:group-hover:text-[#2DD4BF] transition-colors">
                          {isArabic ? partner.name : partner.nameEn}
                        </h3>
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium px-1">
                          <span className="truncate text-right rtl:text-right ltr:text-left">{isArabic ? partner.category : partner.categoryEn}</span>
                          <span className="inline-flex items-center text-[#0D6D54] dark:text-[#2DD4BF] opacity-0 group-hover:opacity-100 transition-opacity font-bold shrink-0">
                            <ArrowUpRight className="w-3 h-3" />
                          </span>
                        </div>
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
                className={`group rounded-2xl p-4 bg-white/95 dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 hover:border-emerald-500/60 dark:hover:border-[#2DD4BF]/60 hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                  partner.cardStyle === 'glow' ? 'shadow-md ring-1 ring-emerald-500/20' : ''
                }`}
              >
                {/* Subtle Top Ambient Gradient */}
                <div 
                  className="absolute top-0 inset-x-0 h-1.5 opacity-80"
                  style={{ backgroundColor: partner.accentColor || '#0D6D54' }}
                />

                <div className="flex items-center justify-between w-full mb-2 pt-1 relative z-10">
                  <span 
                    className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full truncate max-w-[85%]"
                    style={{
                      backgroundColor: partner.accentColor ? `${partner.accentColor}15` : undefined,
                      color: partner.accentColor || undefined
                    }}
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{partner.badge || (isArabic ? 'شريك معتمد' : 'Verified')}</span>
                  </span>
                  <span 
                    className="w-2 h-2 rounded-full shrink-0 shadow-xs" 
                    style={{ backgroundColor: partner.accentColor || '#0D6D54' }}
                  />
                </div>

                <div 
                  className="w-full h-22 sm:h-24 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-2xs group-hover:shadow-xs group-hover:border-emerald-400/50 dark:group-hover:border-[#2DD4BF]/50 flex items-center justify-center overflow-hidden my-auto transition-all relative z-10 p-2"
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

                <div className="w-full text-center mt-2 relative z-10">
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

        {/* Empty state when search matches nothing */}
        {filteredPartners.length === 0 && (
          <div className="py-12 text-center">
            <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
              {isArabic ? 'لم نتمكن من العثور على شركاء يطابقون بحثك' : 'No partners found matching your search'}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedSector('all'); }}
              className="mt-3 text-xs font-black text-[#0D6D54] dark:text-[#2DD4BF] underline cursor-pointer"
            >
              {isArabic ? 'إعادة ضبط التصفية والبحث' : 'Reset filters'}
            </button>
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
        <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
          
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5 shadow-2xs hover:shadow-sm transition-shadow">
            <span className="block text-2xl sm:text-3xl font-black text-[#0D6D54] dark:text-[#2DD4BF] mb-1 font-sans">+٢٠</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">
              {isArabic ? 'شراكة حكومية ومؤسسية' : 'Strategic Alliances'}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
              {isArabic ? 'وزارات وهيئات وجامعات كبرى' : 'Ministries & Authorities'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5 shadow-2xs hover:shadow-sm transition-shadow">
            <span className="block text-2xl sm:text-3xl font-black text-[#0D6D54] dark:text-[#2DD4BF] mb-1 font-sans">١٠٠٪</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">
              {isArabic ? 'تكامل في مسارات الدمج' : 'Inclusion & Integration'}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
              {isArabic ? 'دمج مدرسي ورعاية تخصصية' : 'Classroom & Dedicated Care'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5 shadow-2xs hover:shadow-sm transition-shadow">
            <span className="block text-2xl sm:text-3xl font-black text-[#0D6D54] dark:text-[#2DD4BF] mb-1 font-sans">٠٪</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">
              {isArabic ? 'تقسيط وتيسير مالي مرن' : '0% Interest Installments'}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
              {isArabic ? 'شراكة تمارا وإمكان بدون فوائد' : 'Tamara & Emkan Enablement'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5 shadow-2xs hover:shadow-sm transition-shadow">
            <span className="block text-2xl sm:text-3xl font-black text-[#0D6D54] dark:text-[#2DD4BF] mb-1 font-sans">٣</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">
              {isArabic ? 'اعتمادات دولية لجودة التأهيل' : 'International Accreditations'}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
              {isArabic ? 'IBAO و QABA و ISO 9001' : 'IBAO, QABA & ISO Standards'}
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
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Top Accent Bar */}
            <div 
              className="absolute top-0 inset-x-0 h-2"
              style={{ backgroundColor: activePartnerModal.accentColor || '#0D6D54' }}
            />

            {/* Close button */}
            <button
              onClick={() => setActivePartnerModal(null)}
              className="absolute top-4 left-4 rtl:left-auto rtl:right-4 w-8 h-8 rounded-full bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-xs flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Logo in Header */}
            <div 
              className="w-36 h-24 sm:w-44 sm:h-28 mx-auto mb-4 rounded-2xl border border-slate-200/80 dark:border-white/20 p-2 sm:p-3 shadow-xs flex items-center justify-center relative z-10 overflow-hidden transition-all"
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
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {isArabic ? activePartnerModal.name : activePartnerModal.nameEn}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {isArabic ? activePartnerModal.category : activePartnerModal.categoryEn}
              </p>
              
              <div className="flex items-center justify-center gap-2 mt-3">
                <span 
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                  style={{
                    backgroundColor: activePartnerModal.accentColor ? `${activePartnerModal.accentColor}15` : undefined,
                    borderColor: activePartnerModal.accentColor ? `${activePartnerModal.accentColor}30` : undefined,
                    color: activePartnerModal.accentColor || undefined
                  }}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{activePartnerModal.badge || (isArabic ? 'شريك استراتيجي معتمد' : 'Verified Strategic Partner')}</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'شراكة سارية وفعالة' : 'Active Partnership'}</span>
                </span>
              </div>
            </div>

            {/* Scope of Partnership Description */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-center relative z-10">
              {isArabic 
                ? (activePartnerModal.description || 'شراكة استراتيجية مستمرة تسهم في تمكين أطفال مركز رابا وتقديم الدعم التخصصي والدمج المجتمعي بأعلى المعايير.')
                : (activePartnerModal.descriptionEn || 'Ongoing strategic alliance dedicated to empowering children with specialized care and community integration.')}
            </div>

            {/* Key Partnership Highlights */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{isArabic ? 'تسهيلات ورعاية مخصصة' : 'Dedicated Privileges'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{isArabic ? 'معايير إكلينيكية معتمدة' : 'Clinical Standards'}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex items-center gap-2.5 relative z-10">
              {activePartnerModal.websiteUrl ? (
                <a
                  href={activePartnerModal.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'زيارة الموقع الرسمي' : 'Visit Website'}</span>
                </a>
              ) : null}
              
              <button
                onClick={() => setActivePartnerModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#0D6D54] hover:bg-[#09523F] text-white text-xs font-black shadow-sm transition-colors cursor-pointer text-center"
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
