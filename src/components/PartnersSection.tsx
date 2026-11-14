import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  X,
  Search,
  Landmark,
  GraduationCap,
  Stethoscope,
  CreditCard,
  ArrowUpRight,
  CheckCircle2,
  Award
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { 
  PartnerItem, 
  PartnersSliderSettings, 
  DEFAULT_PARTNERS, 
  DEFAULT_PARTNERS_SETTINGS, 
  getStoredPartners, 
  getStoredPartnersSettings,
} from '../data/partnersData';
import { PartnerLogoRenderer } from './PartnerLogos';

interface ConcaveArcSliderHandle {
  step: (direction: 1 | -1) => void;
  reset: () => void;
}

interface ConcaveArcPartnerSliderProps {
  items: PartnerItem[];
  isArabic: boolean;
  isMobile: boolean;
  speedSeconds: number;
  isPausedManually: boolean;
  onSelectPartner: (partner: PartnerItem) => void;
  onActiveIndexChange?: (index: number) => void;
  controlsRef: React.MutableRefObject<ConcaveArcSliderHandle | null>;
}

/**
 * Computes screen-space integrated X offset and 3D concave cylindrical coordinates
 * so cards form a smooth panoramic inward-curving arc (larger & tilted inward on outer edges,
 * subtly recessed & smaller at center) with uniform visual spacing and zero overlap.
 */
function computeConcaveArcCoords(
  d: number,
  cardW: number,
  gap: number,
  perspective: number,
  maxAngleDeg: number,
  zCenter: number,
  zDepth: number,
  angleSlope: number,
  depthFreq: number
) {
  const absD = Math.abs(d);
  const sign = d < 0 ? -1 : 1;
  const maxAngleRad = (maxAngleDeg * Math.PI) / 180;

  const evalAngleRad = (u: number) => maxAngleRad * Math.tanh(u * angleSlope);
  const evalZ = (u: number) => -zCenter + zDepth * (1 - Math.cos(Math.min(Math.PI / 2, u * depthFreq)));
  const evalFootprint = (u: number) => {
    const z = evalZ(u);
    const proj = perspective / Math.max(240, perspective - z);
    const ang = evalAngleRad(u);
    return cardW * proj * Math.cos(ang) + gap;
  };

  // Integrate screen footprint from 0 to absD using 8 midpoint steps for C1-smooth even spacing
  const steps = 8;
  let xScreen = 0;
  if (absD > 0.0001) {
    const h = absD / steps;
    for (let s = 0; s < steps; s++) {
      xScreen += evalFootprint((s + 0.5) * h) * h;
    }
  }

  const zPx = evalZ(absD);
  const angleDeg = -sign * ((evalAngleRad(absD) * 180) / Math.PI);
  const xWorld = sign * xScreen * (Math.max(240, perspective - zPx) / perspective);

  return { xWorld, zPx, angleDeg };
}

const ConcaveArcPartnerSlider: React.FC<ConcaveArcPartnerSliderProps> = ({
  items,
  isArabic,
  isMobile,
  speedSeconds,
  isPausedManually,
  onSelectPartner,
  onActiveIndexChange,
  controlsRef,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const posRef = useRef<number>(0);
  const stepDeltaRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const lastPointerXRef = useRef<number>(0);
  const lastPointerTimeRef = useRef<number>(0);
  const didDragMoveRef = useRef<boolean>(false);
  const lastReportedIdxRef = useRef<number>(-1);
  const onActiveIndexChangeRef = useRef(onActiveIndexChange);
  onActiveIndexChangeRef.current = onActiveIndexChange;

  const itemsSignature = useMemo(
    () => items.map((p) => p.id).join('|'),
    [items]
  );

  // Build ring with enough items to fill the 3D panoramic arc seamlessly
  const ringItems = useMemo(() => {
    if (items.length === 0) return [];
    const targetMin = isMobile ? 9 : 13;
    const out: PartnerItem[] = [];
    while (out.length < targetMin) {
      out.push(...items);
    }
    return out;
  }, [items, isMobile]);

  // Reset scroll offset cleanly when filtered list changes
  useEffect(() => {
    posRef.current = 0;
    stepDeltaRef.current = 0;
    velocityRef.current = 0;
    lastReportedIdxRef.current = -1;
    onActiveIndexChangeRef.current?.(0);
  }, [itemsSignature]);

  // Expose imperative step / reset controls for Prev / Next buttons
  useEffect(() => {
    controlsRef.current = {
      step: (direction: 1 | -1) => {
        velocityRef.current = 0;
        stepDeltaRef.current += direction;
      },
      reset: () => {
        posRef.current = 0;
        stepDeltaRef.current = 0;
        velocityRef.current = 0;
      },
    };
    return () => {
      controlsRef.current = null;
    };
  }, [controlsRef]);

  // 60-120fps GPU-composited RAF loop updating transform & opacity directly without React re-renders
  useEffect(() => {
    if (ringItems.length === 0) return;

    let rafId = 0;
    let lastTime = performance.now();
    const ringLen = ringItems.length;
    const baseLen = Math.max(1, items.length);

    const cardW = isMobile ? 124 : 216;
    const gap = isMobile ? 12 : 18;
    const perspective = isMobile ? 560 : 1120;
    const maxAngleDeg = isMobile ? 38 : 31;
    const zCenter = isMobile ? 155 : 210;
    const zDepth = isMobile ? 285 : 390;
    const angleSlope = isMobile ? 0.42 : 0.36;
    const depthFreq = isMobile ? 0.48 : 0.4;
    const maxVisible = isMobile ? 3.5 : 4.55;

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      if (!isDraggingRef.current) {
        if (Math.abs(stepDeltaRef.current) > 0.001) {
          const move = stepDeltaRef.current * Math.min(1, dt * 11);
          posRef.current += move;
          stepDeltaRef.current -= move;
        } else if (Math.abs(velocityRef.current) > 0.015) {
          posRef.current += velocityRef.current * dt;
          velocityRef.current *= Math.pow(0.035, dt);
          if (Math.abs(velocityRef.current) <= 0.015) velocityRef.current = 0;
        } else if (!isPausedManually) {
          const cardsPerSec = Math.max(0.24, baseLen / Math.max(14, speedSeconds || 32));
          posRef.current += cardsPerSec * dt;
        }
      }

      // Normalize posRef cleanly modulo ringLen for infinite seamless looping
      if (posRef.current >= ringLen || posRef.current < 0) {
        posRef.current = ((posRef.current % ringLen) + ringLen) % ringLen;
      }

      const pos = posRef.current;
      const reportedIdx = ((Math.round(pos) % baseLen) + baseLen) % baseLen;
      if (reportedIdx !== lastReportedIdxRef.current) {
        lastReportedIdxRef.current = reportedIdx;
        onActiveIndexChangeRef.current?.(reportedIdx);
      }

      for (let i = 0; i < ringLen; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        let d = ((i - pos) % ringLen + ringLen) % ringLen;
        if (d > ringLen / 2) d -= ringLen;

        const absD = Math.abs(d);
        if (absD > maxVisible) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          el.style.transform = 'translate3d(-9999px, 0px, -400px)';
          continue;
        }

        const { xWorld, zPx, angleDeg } = computeConcaveArcCoords(
          d,
          cardW,
          gap,
          perspective,
          maxAngleDeg,
          zCenter,
          zDepth,
          angleSlope,
          depthFreq
        );

        const fadeWindow = isMobile ? 0.35 : 0.65;
        const fadeStart = maxVisible - fadeWindow;
        const opacity = absD > fadeStart ? Math.max(0, 1 - (absD - fadeStart) / fadeWindow) : 1;

        el.style.transform = `translate3d(${xWorld.toFixed(2)}px, 0px, ${zPx.toFixed(2)}px) rotateY(${angleDeg.toFixed(2)}deg)`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = String(Math.round(100 + absD * 10));
        el.style.pointerEvents = opacity > 0.12 ? 'auto' : 'none';
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [ringItems, items.length, isMobile, isPausedManually, speedSeconds]);

  // Smooth mouse & touch drag interaction without forcing layout reflows
  useEffect(() => {

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastPointerXRef.current;
      const totalMove = Math.abs(e.clientX - dragStartXRef.current);
      if (totalMove > 6) {
        didDragMoveRef.current = true;
      }

      const stride = isMobile ? 115 : 215;
      posRef.current -= dx / stride;

      const now = performance.now();
      const dt = Math.max(0.008, (now - lastPointerTimeRef.current) / 1000);
      velocityRef.current = -(dx / stride) / dt * 0.45;

      lastPointerXRef.current = e.clientX;
      lastPointerTimeRef.current = now;
    };

    const handlePointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setTimeout(() => {
        didDragMoveRef.current = false;
      }, 40);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isMobile]);

  const handleStagePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isDraggingRef.current = true;
    didDragMoveRef.current = false;
    stepDeltaRef.current = 0;
    velocityRef.current = 0;
    dragStartXRef.current = e.clientX;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
  };

  return (
    <div
      ref={stageRef}
      dir="ltr"
      onPointerDown={handleStagePointerDown}
      className="relative w-full h-[240px] sm:h-[320px] md:h-[365px] overflow-hidden flex items-center justify-center touch-pan-y cursor-grab active:cursor-grabbing select-none"
      style={{
        perspective: isMobile ? '560px' : '1120px',
        perspectiveOrigin: '50% 50%',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Subtle Ambient Horizon Arc */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/20 dark:via-emerald-400/25 to-transparent pointer-events-none" />

      {/* Desktop Left & Right Soft Edge Vignettes (Mobile shows edge-to-edge sweeping cards cleanly) */}
      <div className="hidden md:block absolute top-0 bottom-0 left-0 w-16 lg:w-24 bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC]/55 to-transparent dark:from-[#0D1B2A] dark:via-[#0D1B2A]/60 dark:to-transparent z-[200] pointer-events-none" />
      <div className="hidden md:block absolute top-0 bottom-0 right-0 w-16 lg:w-24 bg-gradient-to-l from-[#F8FAFC] via-[#F8FAFC]/55 to-transparent dark:from-[#0D1B2A] dark:via-[#0D1B2A]/60 dark:to-transparent z-[200] pointer-events-none" />

      {ringItems.map((partner, idx) => (
        <div
          key={`arc-${partner.id}-${idx}`}
          ref={(el) => {
            cardRefs.current[idx] = el;
          }}
          dir={isArabic ? 'rtl' : 'ltr'}
          onClick={() => {
            if (!didDragMoveRef.current) {
              onSelectPartner(partner);
            }
          }}
          style={{
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          className="group absolute w-[124px] h-[190px] md:w-[216px] md:h-[278px] rounded-[18px] md:rounded-[26px] p-2 md:p-3 bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-white/12 shadow-[0_18px_40px_-14px_rgba(15,23,42,0.16)] dark:shadow-[0_22px_45px_-12px_rgba(0,0,0,0.6)] hover:border-emerald-500/60 dark:hover:border-[#2DD4BF]/50 flex flex-col items-center justify-between cursor-pointer overflow-hidden"
        >
          {/* Logo Showcase Window (Pure white background in both light & dark themes) */}
          <div
            className="w-full flex-1 rounded-[12px] md:rounded-[18px] border border-slate-100 dark:border-white/10 bg-white flex items-center justify-center p-1.5 md:p-3 overflow-hidden relative shadow-2xs"
            style={{ backgroundColor: '#ffffff' }}
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

            {/* Subtle Corner Action Indicator matching card affordance */}
            <span
              className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-slate-900/8 dark:bg-slate-900/12 text-slate-700 group-hover:bg-[#0D6D54] group-hover:text-white flex items-center justify-center absolute bottom-1.5 left-1.5 md:bottom-2 md:left-2 rtl:left-auto rtl:right-1.5 md:rtl:right-2 transition-colors pointer-events-none"
              aria-hidden="true"
            >
              <ArrowUpRight className="w-3 h-3 md:w-3.5 md:h-3.5 rtl:-scale-x-100" />
            </span>
          </div>

          {/* Card Footer Metadata */}
          <div className="w-full pt-1.5 md:pt-2.5 px-0.5 md:px-1 text-center shrink-0">
            <span
              className="text-[9.5px] md:text-[11px] font-bold block truncate"
              style={{ color: partner.accentColor || '#0D6D54' }}
            >
              {partner.badge || (isArabic ? 'شريك وطني' : 'Partner')}
            </span>
            <h3 className="text-[11px] md:text-[14px] font-black text-slate-900 dark:text-white leading-tight mt-0.5 truncate group-hover:text-[#0D6D54] dark:group-hover:text-[#2DD4BF] transition-colors">
              {isArabic ? partner.name : partner.nameEn}
            </h3>
            <p className="hidden md:block text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate mt-0.5">
              {isArabic ? partner.category : partner.categoryEn}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export const PartnersSection: React.FC = () => {
  const { isArabic } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const arcControlsRef = useRef<ConcaveArcSliderHandle | null>(null);

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

  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [selectedMobileCategory, setSelectedMobileCategory] = useState<string>('all');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPausedManually, setIsPausedManually] = useState(false);

  // Track responsive breakpoint via ResizeObserver (zero forced reflows)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (typeof w === 'number' && w > 0) {
        setIsMobileViewport(w < 768);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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

  // Mobile filter tabs: "الكل" + distinct categories with counts
  const mobileFilterTabs = useMemo(() => {
    const counts: Record<string, number> = {};
    partners.forEach(p => {
      const b = p.badge || p.category || (isArabic ? 'شريك وطني' : 'Partner');
      counts[b] = (counts[b] || 0) + 1;
    });

    const tabs = [
      { id: 'all', label: isArabic ? 'الكل' : 'All', count: partners.length },
    ];

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

  const activeSliderPartners = isMobileViewport ? mobileFilteredPartners : filteredPartners;

  const stepArc = (direction: 'next' | 'prev') => {
    const stepSign: 1 | -1 = direction === 'next' ? 1 : -1;
    arcControlsRef.current?.step(stepSign);
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
      ref={sectionRef}
      id="partners" 
      className="py-16 sm:py-24 bg-transparent text-slate-900 dark:text-white relative overflow-hidden select-none border-b border-slate-200/80 dark:border-white/10 transition-colors [content-visibility:auto] [contain-intrinsic-size:1px_600px]"
    >
      {/* Background Subtle RABA Emerald Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[380px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none transform-gpu" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 dark:via-emerald-400/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* HEADER: Enterprise Grade Clinical & Rehabilitation Partnership Header   */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          
          {/* Subtle Sector Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/90 dark:border-emerald-700/50 text-[#0D6D54] dark:text-[#2DD4BF] text-xs sm:text-[13px] font-bold mb-4 shadow-2xs">
            <Handshake className="w-4 h-4 text-[#0D6D54] dark:text-[#2DD4BF] shrink-0" />
            <span>{isArabic ? (settings.badgeTextAr || 'شركاء النجاح والتميز المؤسسي') : (settings.badgeTextEn || 'SUCCESS PARTNERS & ALLIANCES')}</span>
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
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[36px] rounded-full text-xs font-bold transition-colors duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0D6D54] text-white shadow-md shadow-emerald-900/20 ring-2 ring-emerald-500/30'
                      : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 hover:border-emerald-500/50 hover:text-emerald-700 dark:hover:text-emerald-300'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                  <span>{isArabic ? sec.labelAr : sec.labelEn}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
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
              className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label={isArabic ? 'مسح البحث' : 'Clear search'}
                className="absolute top-1/2 -translate-y-1/2 right-1.5 rtl:right-auto rtl:left-1.5 w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {isArabic 
                ? `${filteredPartners.length} جهة وشريك معتمد` 
                : `${filteredPartners.length} Verified Partners`}
            </div>

            {/* Switcher Buttons */}
            <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-300/50 dark:border-white/10">
              <button
                onClick={() => setViewMode('slider')}
                aria-label={isArabic ? 'عرض السلايدر' : 'Slider View'}
                className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'slider' 
                    ? 'bg-white dark:bg-slate-900 text-[#0D6D54] dark:text-[#2DD4BF] shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{isArabic ? 'متدفق' : 'Slider'}</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                aria-label={isArabic ? 'عرض الشبكة' : 'Grid View'}
                className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-slate-900 text-[#0D6D54] dark:text-[#2DD4BF] shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{isArabic ? 'شبكة' : 'Grid'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: 3D CONCAVE PANORAMIC ARC SLIDER VIEW (Mobile & Desktop)           */}
        {/* ========================================================================= */}
        {viewMode === 'slider' && (
          <div className="relative">
            {/* Mobile Top Controls & Filter Tabs */}
            <div className="block md:hidden mb-2" dir={isArabic ? 'rtl' : 'ltr'}>
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {isArabic ? 'اسحب أو تنقّل لاستعراض الشركاء' : 'Swipe or browse partners'}
                </span>
                <div className="flex items-center gap-2" dir="ltr">
                  <button
                    onClick={() => stepArc(isArabic ? 'next' : 'prev')}
                    aria-label={isArabic ? 'التالي' : 'Previous'}
                    className="w-11 h-11 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center justify-center text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-transform cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => stepArc(isArabic ? 'prev' : 'next')}
                    aria-label={isArabic ? 'السابق' : 'Next'}
                    className="w-11 h-11 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center justify-center text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-transform cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs Capsule Bar */}
              <div className="w-full bg-white dark:bg-[#111827] rounded-[28px] border border-slate-200/80 dark:border-white/10 p-1.5 shadow-xs mb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
                {mobileFilterTabs.map((tab) => {
                  const isSelected = selectedMobileCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setSelectedMobileCategory(tab.id);
                        setActiveSlideIndex(0);
                        arcControlsRef.current?.reset();
                      }}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 min-h-[36px] rounded-2xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
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
            </div>

            {/* Unified 3D Concave Panoramic Arc Carousel */}
            {activeSliderPartners.length > 0 && (
              <div className="-mx-4 sm:-mx-6 lg:-mx-8">
                <ConcaveArcPartnerSlider
                  items={activeSliderPartners}
                  isArabic={isArabic}
                  isMobile={isMobileViewport}
                  speedSeconds={settings.speedSeconds}
                  isPausedManually={isPausedManually}
                  onSelectPartner={setActivePartnerModal}
                  onActiveIndexChange={setActiveSlideIndex}
                  controlsRef={arcControlsRef}
                />
              </div>
            )}

            {/* Mobile Bottom Progress Bar & Counter */}
            {activeSliderPartners.length > 0 && (
              <div className="flex md:hidden items-center justify-between gap-4 mt-3 px-1" dir={isArabic ? 'rtl' : 'ltr'}>
                <div className="flex-1 h-[3.5px] bg-slate-200/90 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0D6D54] dark:bg-[#2DD4BF] rounded-full transition-[width] duration-300"
                    style={{
                      width: `${Math.min(100, Math.max(8, ((activeSlideIndex + 1) / Math.max(1, activeSliderPartners.length)) * 100))}%`
                    }}
                  />
                </div>
                <div className="flex items-baseline gap-1 font-sans shrink-0 tabular-nums">
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    {String(activeSlideIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    / {activeSliderPartners.length}
                  </span>
                </div>
              </div>
            )}
          </div>
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
                className={`group h-[265px] sm:h-[285px] rounded-[24px] sm:rounded-[28px] p-3 sm:p-3.5 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-900/5 dark:shadow-black/40 hover:shadow-2xl hover:border-blue-500/50 dark:hover:border-[#2E86EB]/50 hover:-translate-y-1.5 transition-transform duration-300 flex flex-col items-center justify-between cursor-pointer relative overflow-hidden`}
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
                  className="w-full h-32 sm:h-36 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-white flex items-center justify-center overflow-hidden relative z-10 p-2 sm:p-2.5 shadow-xs"
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
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate max-w-full mt-0.5 text-center">
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
        {/* BOTTOM CONTROLS & NAVIGATION BAR (Desktop Only)                           */}
        {/* ========================================================================= */}
        {viewMode === 'slider' && filteredPartners.length > 0 && (
          <div className="hidden md:flex mt-3 items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-300 px-2">
            
            {/* Counter & Subtle Hint */}
            <div className="flex items-center gap-3">
              <span className="font-sans font-black text-sm text-slate-900 dark:text-white tabular-nums">
                {String(activeSlideIndex + 1).padStart(2, '0')}
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400"> / {filteredPartners.length}</span>
              </span>
              <span className="text-slate-600 dark:text-slate-300">
                {isPausedManually
                  ? (isArabic ? 'متوقف مؤقتاً — اسحب أو استخدم الأسهم للتصفح' : 'Paused — drag or use arrows to browse')
                  : (isArabic ? 'اسحب العرض أفقياً أو انقر على أي شريك لاستعراض التفاصيل' : 'Drag horizontally or click any partner to inspect')}
              </span>
            </div>

            {/* Arrow Navigation & Play / Pause Controls */}
            <div className="flex items-center gap-2 z-20">
              <div className="flex items-center gap-2" dir="ltr">
                <button
                  onClick={() => stepArc(isArabic ? 'next' : 'prev')}
                  aria-label={isArabic ? 'الشريك التالي' : 'Previous partner'}
                  className="w-11 h-11 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:border-emerald-500 text-slate-700 dark:text-slate-200 hover:text-[#0D6D54] dark:hover:text-[#2DD4BF] transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => stepArc(isArabic ? 'prev' : 'next')}
                  aria-label={isArabic ? 'الشريك السابق' : 'Next partner'}
                  className="w-11 h-11 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:border-emerald-500 text-slate-700 dark:text-slate-200 hover:text-[#0D6D54] dark:hover:text-[#2DD4BF] transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Play / Pause Toggle */}
              <button
                onClick={() => setIsPausedManually(!isPausedManually)}
                className="inline-flex items-center gap-1.5 px-4 h-11 rounded-full bg-[#0D6D54] hover:bg-[#09523F] text-white font-bold transition-colors cursor-pointer shadow-xs"
              >
                {isPausedManually ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
                <span>{isPausedManually ? (isArabic ? 'تشغيل العرض' : 'Play') : (isArabic ? 'إيقاف مؤقت' : 'Pause')}</span>
              </button>
            </div>

          </div>
        )}

        {/* Partnership Metrics Highlights */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-200/80 dark:border-white/10">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-3 sm:p-5 relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.08)_0%,transparent_70%)] pointer-events-none transform-gpu" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.08)_0%,transparent_70%)] pointer-events-none transform-gpu" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 relative z-10">
              
              {/* Card 1: 20+ شراكة حكومية ومؤسسية */}
              <div className="group bg-slate-50/70 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.06] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-slate-100 dark:border-white/5 hover:border-teal-400/40 hover:shadow-md transition-colors duration-300 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-1.5 mb-2.5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-teal-500/10 text-[#0D6D54] dark:text-[#2DD4BF] border border-teal-400/25 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-teal-500/20 transition-transform">
                    <Landmark className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[9.5px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-400/20 truncate">
                    {isArabic ? 'جهات كبرى' : 'Major Alliances'}
                  </span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#0D6D54] dark:text-[#2DD4BF] tracking-tight leading-none font-mono tabular-nums">
                    20+
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mt-1.5 leading-snug">
                    {isArabic ? 'شراكة حكومية ومؤسسية' : 'Strategic Alliances'}
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5 leading-tight">
                    {isArabic ? 'وزارات وهيئات وجامعات كبرى' : 'Ministries & Authorities'}
                  </div>
                </div>
              </div>

              {/* Card 2: 100% تكامل في مسارات الدمج */}
              <div className="group bg-slate-50/70 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.06] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-slate-100 dark:border-white/5 hover:border-sky-400/40 hover:shadow-md transition-colors duration-300 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-1.5 mb-2.5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-400/25 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-sky-500/20 transition-transform">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[9.5px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-400/20 truncate">
                    {isArabic ? 'دمج مدرسي' : 'Full Inclusion'}
                  </span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#0D6D54] dark:text-[#2DD4BF] tracking-tight leading-none font-mono tabular-nums">
                    100%
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mt-1.5 leading-snug">
                    {isArabic ? 'تكامل في مسارات الدمج' : 'Inclusion & Integration'}
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5 leading-tight">
                    {isArabic ? 'دمج مدرسي ورعاية تخصصية' : 'Classroom & Dedicated Care'}
                  </div>
                </div>
              </div>

              {/* Card 3: 0% تقسيط وتيسير مالي مرن */}
              <div className="group bg-slate-50/70 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.06] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-slate-100 dark:border-white/5 hover:border-amber-400/40 hover:shadow-md transition-colors duration-300 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-1.5 mb-2.5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-400/25 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-amber-500/20 transition-transform">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[9.5px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-400/20 truncate">
                    {isArabic ? 'بدون فوائد' : '0% Interest'}
                  </span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#0D6D54] dark:text-[#2DD4BF] tracking-tight leading-none font-mono tabular-nums">
                    0%
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mt-1.5 leading-snug">
                    {isArabic ? 'تقسيط وتيسير مالي مرن' : 'Flexible Installments'}
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5 leading-tight">
                    {isArabic ? 'شراكة تمارا وإمكان بدون فوائد' : 'Tamara & Emkan Enablement'}
                  </div>
                </div>
              </div>

              {/* Card 4: 4 اعتمادات دولية */}
              <div className="group bg-slate-50/70 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.06] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-slate-100 dark:border-white/5 hover:border-emerald-400/40 hover:shadow-md transition-colors duration-300 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-1.5 mb-2.5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-[#00E5BE] border border-emerald-400/25 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-emerald-500/20 transition-transform">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[9.5px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-400/20 truncate">
                    {isArabic ? 'معايير دولية' : 'Global Standards'}
                  </span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#0D6D54] dark:text-[#2DD4BF] tracking-tight leading-none font-mono tabular-nums">
                    4
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mt-1.5 leading-snug">
                    {isArabic ? 'اعتمادات دولية لجودة التأهيل' : 'International Accreditations'}
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5 leading-tight font-medium">
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
            className="w-full max-w-lg bg-white dark:bg-[#0D1B2A] rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden"
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
              aria-label={isArabic ? 'إغلاق' : 'Close'}
              className="absolute top-4 left-4 rtl:left-auto rtl:right-4 w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-slate-100/80 dark:bg-[#111827] backdrop-blur-xs flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Logo in Header */}
            <div 
              className="w-36 h-24 sm:w-44 sm:h-28 mx-auto mb-4 rounded-2xl border border-slate-200/80 dark:border-white/20 p-2 sm:p-3 shadow-xs flex items-center justify-center relative z-10 overflow-hidden bg-white dark:bg-white"
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
