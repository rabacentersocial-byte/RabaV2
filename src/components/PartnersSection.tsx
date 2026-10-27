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

  // Dedicated Mobile Slider State matching user screenshot
  const [selectedMobileCategory, setSelectedMobileCategory] = useState<string>('all');
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

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
        return Math.min(Math.max(w * 0.72, 220), 250) + 16;
      }
      if (w < 1024) {
        return 240 + 20; // 260px stride
      }
      return 250 + 20; // 270px stride
    }
    return 270;
  };

  const getCardWidth = () => {
    if (typeof window !== 'undefined') {
      const w = window.innerWidth;
      if (w < 640) {
        return Math.min(Math.max(w * 0.72, 220), 250);
      }
      if (w < 1024) {
        return 240;
      }
      return 250;
    }
    return 250;
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

  // Mobile filter tabs: "الكل" + distinct categories with counts matching user screenshot
  const mobileFilterTabs = useMemo(() => {
    const counts: Record<string, number> = {};
    partners.forEach(p => {
      const b = p.badge || p.category || (isArabic ? 'شريك وطني' : 'Partner');
      counts[b] = (counts[b] || 0) + 1;
    });

    const tabs = [
      { id: 'all', label: isArabic ? 'الكل' : 'All', count: partners.length },
    ];

    // Priority badges matching user screenshot
    const priority = ['شريك إعلامي', 'شريك تعليمي', 'شريك استراتيجي', 'قطاع صحي حكومي', 'قطاع حكومي', 'شريك أكاديمي', 'حلول تمويلية'];
    priority.forEach(b => {
      if (counts[b]) {
        tabs.push({ id: b, label: b, count: counts[b] });
      }
    });

    Object.keys(counts).forEach(b => {
      if (!tabs.some(t => t.id === b)) {
        tabs.push({ id: b, label: b, count: counts[b] });
      }
    });

    return tabs;
  }, [partners, isArabic]);

  // Filtered partners for mobile slider
  const mobileFilteredPartners = useMemo(() => {
    if (selectedMobileCategory === 'all') {
      return partners;
    }
    return partners.filter(p => {
      const b = p.badge || p.category || '';
      return b === selectedMobileCategory || p.sector === selectedMobileCategory;
    });
  }, [partners, selectedMobileCategory]);

  const scrollMobile = (direction: 'next' | 'prev') => {
    if (!mobileScrollRef.current) return;
    const container = mobileScrollRef.current;
    const cardStride = 176;
    const isRtl = document.dir === 'rtl' || isArabic;
    
    // In RTL: '<' (direction === 'next') scrolls left (-cardStride)
    const sign = direction === 'next' ? (isRtl ? -1 : 1) : (isRtl ? 1 : -1);
    container.scrollBy({ left: sign * cardStride, behavior: 'smooth' });

    setActiveMobileIndex(prev => {
      if (direction === 'next') {
        return Math.min(mobileFilteredPartners.length - 1, prev + 1);
      } else {
        return Math.max(0, prev - 1);
      }
    });
  };

  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    const container = mobileScrollRef.current;
    const cardStride = 176;
    const currentScroll = Math.abs(container.scrollLeft);
    const maxIdx = Math.max(0, mobileFilteredPartners.length - 1);
    const idx = Math.min(maxIdx, Math.max(0, Math.round(currentScroll / cardStride)));
    setActiveMobileIndex(idx);
  };

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

          {/* Category Filter Tabs with Live Counts & Icons (Desktop View) */}
          <div className="hidden md:flex flex-wrap items-center justify-center gap-2 mt-6 sm:mt-8">
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

        {/* View Switcher & Quick Search Row (Desktop) */}
        <div className="hidden md:flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 px-2">
          
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
        {/* VIEW 1: SLIDER VIEW                                                       */}
        {/* ========================================================================= */}
        {viewMode === 'slider' && (
          <>
            {/* --------------------------------------------------------------------- */}
            {/* A. DEDICATED MOBILE PARTNER SLIDER (Exact design from user screenshot) */}
            {/* --------------------------------------------------------------------- */}
            <div className="block md:hidden py-1 mb-6" dir={isArabic ? 'rtl' : 'ltr'}>
              
              {/* Top Navigation Row: Arrow buttons (< and >) on top-left in RTL */}
              <div className="flex items-center justify-between mb-4 px-1">
                <div />
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => scrollMobile('next')}
                    aria-label={isArabic ? 'السابق' : 'Previous'}
                    className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center justify-center text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5 rtl:rotate-0" />
                  </button>
                  <button
                    onClick={() => scrollMobile('prev')}
                    aria-label={isArabic ? 'التالي' : 'Next'}
                    className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center justify-center text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5 rtl:rotate-0" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs Capsule Bar */}
              <div className="w-full bg-white dark:bg-[#111827] rounded-[28px] border border-slate-200/80 dark:border-white/10 p-1.5 shadow-xs mb-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
                {mobileFilterTabs.map((tab) => {
                  const isSelected = selectedMobileCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setSelectedMobileCategory(tab.id);
                        setActiveMobileIndex(0);
                        if (mobileScrollRef.current) {
                          mobileScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                        }
                      }}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#2E86EB] text-white shadow-xs'
                          : 'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-md text-[11px] font-sans font-bold ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-[#0E1526] text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Mobile Carousel Track (Showing 2+ cards side by side with snap) */}
              <div
                ref={mobileScrollRef}
                onScroll={handleMobileScroll}
                className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth py-2 px-0.5 snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {mobileFilteredPartners.map((partner, idx) => (
                  <div
                    key={`mob-card-${partner.id}-${idx}`}
                    onClick={() => setActivePartnerModal(partner)}
                    className="w-[156px] h-[174px] shrink-0 bg-white dark:bg-[#111827] rounded-[22px] p-2 border border-slate-200/90 dark:border-white/10 shadow-sm flex flex-col items-center justify-between cursor-pointer snap-start transition-all active:scale-[0.98]"
                  >
                    {/* Top Canvas with Logo - Pure White in both modes without excess padding */}
                    <div 
                      className="w-full h-[104px] rounded-xl border border-slate-100 dark:border-white/5 bg-white flex items-center justify-center p-1.5 overflow-hidden shadow-2xs shrink-0"
                      style={{ backgroundColor: '#ffffff' }}
                    >
                      <PartnerLogoRenderer
                        partnerId={partner.id}
                        logoUrl={partner.logoUrl}
                        name={partner.name}
                        accentColor={partner.accentColor}
                        letter={partner.letter}
                        imageFit="contain"
                        imagePadding="xs"
                        logoScale={partner.logoScale ? (partner.logoScale < 120 ? 120 : partner.logoScale) : 120}
                        expandImageToEdges={partner.expandImageToEdges}
                      />
                    </div>

                    {/* Bottom Details - Centered in the card */}
                    <div className="w-full flex-1 flex flex-col items-center justify-center text-center px-1">
                      <span className="text-[11px] font-bold text-[#0D6D54] dark:text-[#2DD4BF] leading-tight block text-center truncate max-w-full">
                        {partner.badge || partner.category || (isArabic ? 'شريك وطني' : 'Partner')}
                      </span>
                      <h4 className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white leading-tight mt-0.5 block text-center truncate max-w-full">
                        {isArabic ? partner.name : partner.nameEn}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Progress Bar & Counter: "01 / 10" */}
              <div className="flex items-center justify-between gap-4 mt-5 px-1">
                {/* Horizontal Progress track */}
                <div className="flex-1 h-[3.5px] bg-slate-200/90 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0D6D54] dark:bg-[#2DD4BF] rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.max(8, ((activeMobileIndex + 1) / Math.max(1, mobileFilteredPartners.length)) * 100))}%`
                    }}
                  />
                </div>

                {/* Number Counter */}
                <div className="flex items-baseline gap-1 font-sans shrink-0">
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    {String(activeMobileIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                    / {mobileFilteredPartners.length}
                  </span>
                </div>
              </div>

            </div>

            {/* --------------------------------------------------------------------- */}
            {/* B. DESKTOP CONTINUOUS INFINITE SLIDER TRACK (On md and larger screens) */}
            {/* --------------------------------------------------------------------- */}
            <div className="hidden md:block">
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
                        {/* Modern Professional Partner Card - Reduced empty spaces & centered texts */}
                        <div
                          onClick={() => setActivePartnerModal(partner)}
                          className={`group w-[72vw] min-w-[210px] max-w-[245px] sm:min-w-0 sm:max-w-none sm:w-[240px] md:w-[250px] h-[265px] sm:h-[285px] rounded-[24px] sm:rounded-[28px] p-3 sm:p-3.5 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-900/5 dark:shadow-black/40 hover:shadow-2xl hover:border-blue-500/50 dark:hover:border-[#2E86EB]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between cursor-pointer relative overflow-hidden`}
                        >
                          {/* Top Badge: Centered in the card */}
                          <div className="flex items-center justify-center w-full pt-0.5 px-0.5 relative z-10">
                            <span 
                              className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-[12px] font-bold px-3 py-0.5 rounded-full truncate max-w-[90%] text-center"
                              style={{
                                backgroundColor: partner.accentColor ? `${partner.accentColor}18` : '#E8F7F0',
                                color: partner.accentColor || '#006C35',
                                border: `1px solid ${partner.accentColor ? `${partner.accentColor}30` : '#A7F3D0'}`
                              }}
                            >
                              <span 
                                className="w-2 h-2 rounded-full shrink-0 shadow-xs" 
                                style={{ backgroundColor: partner.accentColor || '#006C35' }}
                              />
                              <span className="truncate">{partner.badge || (isArabic ? 'شريك وطني' : 'Partner')}</span>
                            </span>
                          </div>

                          {/* Center Framed Canvas for Logo - Pure white in both light & dark mode */}
                          <div 
                            className="w-full h-32 sm:h-36 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-white flex items-center justify-center overflow-hidden transition-all relative z-10 p-2 sm:p-2.5 shadow-xs"
                            style={{
                              backgroundColor: '#ffffff'
                            }}
                          >
                            <PartnerLogoRenderer
                              partnerId={partner.id}
                              logoUrl={partner.logoUrl}
                              name={partner.name}
                              accentColor={partner.accentColor}
                              letter={partner.letter}
                              imageFit={partner.imageFit}
                              imagePadding={partner.imagePadding || 'xs'}
                              logoScale={partner.logoScale ? (partner.logoScale < 120 ? 120 : partner.logoScale) : 120}
                              expandImageToEdges={partner.expandImageToEdges}
                            />
                          </div>

                          {/* Bottom: Partner Name & Category - Centered in the card */}
                          <div className="w-full text-center flex flex-col items-center justify-center mt-1 mb-0.5 px-1 relative z-10">
                            <h3 className="text-sm sm:text-[15px] font-black text-slate-900 dark:text-white truncate max-w-full group-hover:text-emerald-700 dark:group-hover:text-[#2DD4BF] transition-colors leading-tight text-center">
                              {isArabic ? partner.name : partner.nameEn}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-full mt-0.5 text-center">
                              {isArabic ? partner.category : partner.categoryEn}
                            </p>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: FULL GRID VIEW OF ALL PARTNERS                                    */}
        {/* ========================================================================= */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 py-6">
            {filteredPartners.map((partner) => (
              <div
                key={partner.id}
                onClick={() => setActivePartnerModal(partner)}
                className={`group h-[265px] sm:h-[285px] rounded-[24px] sm:rounded-[28px] p-3 sm:p-3.5 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-900/5 dark:shadow-black/40 hover:shadow-2xl hover:border-blue-500/50 dark:hover:border-[#2E86EB]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between cursor-pointer relative overflow-hidden`}
              >
                {/* Top Badge: Centered in the card */}
                <div className="flex items-center justify-center w-full pt-0.5 px-0.5 relative z-10">
                  <span 
                    className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-[12px] font-bold px-3 py-0.5 rounded-full truncate max-w-[90%] text-center"
                    style={{
                      backgroundColor: partner.accentColor ? `${partner.accentColor}18` : '#E8F7F0',
                      color: partner.accentColor || '#006C35',
                      border: `1px solid ${partner.accentColor ? `${partner.accentColor}30` : '#A7F3D0'}`
                    }}
                  >
                    <span 
                      className="w-2 h-2 rounded-full shrink-0 shadow-xs" 
                      style={{ backgroundColor: partner.accentColor || '#006C35' }}
                    />
                    <span className="truncate">{partner.badge || (isArabic ? 'شريك وطني' : 'Partner')}</span>
                  </span>
                </div>

                {/* Center Framed Canvas for Logo - Pure white in both light & dark mode */}
                <div 
                  className="w-full h-32 sm:h-36 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-white flex items-center justify-center overflow-hidden transition-all relative z-10 p-2 sm:p-2.5 shadow-xs"
                  style={{
                    backgroundColor: '#ffffff'
                  }}
                >
                  <PartnerLogoRenderer
                    partnerId={partner.id}
                    logoUrl={partner.logoUrl}
                    name={partner.name}
                    accentColor={partner.accentColor}
                    letter={partner.letter}
                    imageFit={partner.imageFit}
                    imagePadding={partner.imagePadding || 'xs'}
                    logoScale={partner.logoScale ? (partner.logoScale < 120 ? 120 : partner.logoScale) : 120}
                    expandImageToEdges={partner.expandImageToEdges}
                  />
                </div>

                {/* Bottom: Partner Name & Category - Centered in the card */}
                <div className="w-full text-center flex flex-col items-center justify-center mt-1 mb-0.5 px-1 relative z-10">
                  <h3 className="text-sm sm:text-[15px] font-black text-slate-900 dark:text-white truncate max-w-full group-hover:text-emerald-700 dark:group-hover:text-[#2DD4BF] transition-colors leading-tight text-center">
                    {isArabic ? partner.name : partner.nameEn}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-full mt-0.5 text-center">
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
        {/* BOTTOM CONTROLS & STATUS BAR (Desktop Only)                               */}
        {/* ========================================================================= */}
        {viewMode === 'slider' && (
          <div className="hidden md:flex mt-4 flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 px-2">
            
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
        <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-200/80 dark:border-white/10">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-3 sm:p-5 relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 relative z-10">
              
              {/* Card 1: 20+ شراكة حكومية ومؤسسية */}
              <div className="group bg-slate-50/70 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.06] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-slate-100 dark:border-white/5 hover:border-teal-400/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-1.5 mb-2.5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-teal-500/10 text-[#0D6D54] dark:text-[#2DD4BF] border border-teal-400/25 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-teal-500/20 transition-all">
                    <Landmark className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[9.5px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-400/20 truncate">
                    {isArabic ? 'جهات كبرى' : 'Major Alliances'}
                  </span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#0D6D54] dark:text-[#2DD4BF] tracking-tight leading-none font-mono">
                    20+
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mt-1.5 leading-snug">
                    {isArabic ? 'شراكة حكومية ومؤسسية' : 'Strategic Alliances'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    {isArabic ? 'وزارات وهيئات وجامعات كبرى' : 'Ministries & Authorities'}
                  </div>
                </div>
              </div>

              {/* Card 2: 100% تكامل في مسارات الدمج */}
              <div className="group bg-slate-50/70 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.06] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-slate-100 dark:border-white/5 hover:border-sky-400/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-1.5 mb-2.5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-400/25 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-sky-500/20 transition-all">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[9.5px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-400/20 truncate">
                    {isArabic ? 'دمج مدرسي' : 'Full Inclusion'}
                  </span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#0D6D54] dark:text-[#2DD4BF] tracking-tight leading-none font-mono">
                    100%
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mt-1.5 leading-snug">
                    {isArabic ? 'تكامل في مسارات الدمج' : 'Inclusion & Integration'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    {isArabic ? 'دمج مدرسي ورعاية تخصصية' : 'Classroom & Dedicated Care'}
                  </div>
                </div>
              </div>

              {/* Card 3: 0% تقسيط وتيسير مالي مرن */}
              <div className="group bg-slate-50/70 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.06] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-slate-100 dark:border-white/5 hover:border-amber-400/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-1.5 mb-2.5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-400/25 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-amber-500/20 transition-all">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[9.5px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-400/20 truncate">
                    {isArabic ? 'بدون فوائد' : '0% Interest'}
                  </span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#0D6D54] dark:text-[#2DD4BF] tracking-tight leading-none font-mono">
                    0%
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mt-1.5 leading-snug">
                    {isArabic ? 'تقسيط وتيسير مالي مرن' : 'Flexible Installments'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    {isArabic ? 'شراكة تمارا وإمكان بدون فوائد' : 'Tamara & Emkan Enablement'}
                  </div>
                </div>
              </div>

              {/* Card 4: 4 اعتمادات دولية */}
              <div className="group bg-slate-50/70 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.06] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-slate-100 dark:border-white/5 hover:border-emerald-400/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-1.5 mb-2.5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-[#00E5BE] border border-emerald-400/25 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-emerald-500/20 transition-all">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[9.5px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-400/20 truncate">
                    {isArabic ? 'معايير دولية' : 'Global Standards'}
                  </span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#0D6D54] dark:text-[#2DD4BF] tracking-tight leading-none font-mono">
                    4
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mt-1.5 leading-snug">
                    {isArabic ? 'اعتمادات دولية لجودة التأهيل' : 'International Accreditations'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight font-medium">
                    {isArabic ? 'IBAO و QABA و ISO و BACB' : 'IBAO, QABA, ISO & BACB'}
                  </div>
                </div>
              </div>

            </div>
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
            className="w-full max-w-lg bg-white dark:bg-[#0B0F19] rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Top Accent Bar */}
            <div 
              className="absolute top-0 inset-x-0 h-2"
              style={{ backgroundColor: activePartnerModal.accentColor || '#2E86EB' }}
            />

            {/* Close button */}
            <button
              onClick={() => setActivePartnerModal(null)}
              className="absolute top-4 left-4 rtl:left-auto rtl:right-4 w-8 h-8 rounded-full bg-slate-100/80 dark:bg-[#111827] backdrop-blur-xs flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Logo in Header */}
            <div 
              className="w-36 h-24 sm:w-44 sm:h-28 mx-auto mb-4 rounded-2xl border border-slate-200/80 dark:border-white/20 p-2 sm:p-3 shadow-xs flex items-center justify-center relative z-10 overflow-hidden transition-all bg-white dark:bg-white"
              style={{
                backgroundColor: '#ffffff'
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
