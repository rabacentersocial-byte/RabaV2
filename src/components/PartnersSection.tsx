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
  const hw = cardW * 0.5;

  const evalAngleRad = (u: number) => maxAngleRad * Math.tanh(u * angleSlope);
  const evalZ = (u: number) => -zCenter + zDepth * (1 - Math.cos(Math.min(Math.PI / 2, u * depthFreq)));
  const evalFootprint = (u: number) => {
    const z = evalZ(u);
    const ang = evalAngleRad(u);
    const zOuter = z + hw * Math.sin(ang);
    const proj = perspective / Math.max(260, perspective - z);
    const edgeProj = perspective / Math.max(260, perspective - zOuter);
    const wingBoost = 1 + 0.45 * Math.sin(ang) * Math.min(1.6, u * 0.5);
    return (cardW * Math.max(proj, edgeProj) * Math.cos(ang) + gap) * wingBoost;
  };

  // Integrate screen footprint from 0 to absD using 10 midpoint steps for C1-smooth even spacing
  const steps = 10;
  let xScreen = 0;
  if (absD > 0.0001) {
    const h = absD / steps;
    for (let s = 0; s < steps; s++) {
      xScreen += evalFootprint((s + 0.5) * h) * h;
    }
  }

  const zPx = evalZ(absD);
  const angleDeg = -sign * ((evalAngleRad(absD) * 180) / Math.PI);
  const xWorld = sign * xScreen * (Math.max(260, perspective - zPx) / perspective);

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
  const hiddenFlagsRef = useRef<boolean[]>([]);
  const posRef = useRef<number>(0);
  const stepDeltaRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const isVisibleRef = useRef<boolean>(true);
  const isDocHiddenRef = useRef<boolean>(typeof document !== 'undefined' ? document.hidden : false);
  const wakeLoopRef = useRef<(() => void) | null>(null);
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
    hiddenFlagsRef.current = [];
    onActiveIndexChangeRef.current?.(0);
  }, [itemsSignature]);

  // Expose imperative step / reset controls for Prev / Next buttons
  useEffect(() => {
    controlsRef.current = {
      step: (direction: 1 | -1) => {
        velocityRef.current = 0;
        stepDeltaRef.current += direction;
        wakeLoopRef.current?.();
      },
      reset: () => {
        posRef.current = 0;
        stepDeltaRef.current = 0;
        velocityRef.current = 0;
        wakeLoopRef.current?.();
      },
    };
    return () => {
      controlsRef.current = null;
    };
  }, [controlsRef]);

  // Visibility & Reduced Motion observers to eliminate off-screen/background CPU/GPU work
  useEffect(() => {
    const stageEl = stageRef.current;
    let observer: IntersectionObserver | null = null;
    if (stageEl && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries[0]?.isIntersecting ?? true;
          isVisibleRef.current = visible;
          if (visible) wakeLoopRef.current?.();
        },
        { rootMargin: '150px 0px', threshold: 0.01 }
      );
      observer.observe(stageEl);
    }

    const handleVisibility = () => {
      isDocHiddenRef.current = document.hidden;
      if (!document.hidden) wakeLoopRef.current?.();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // 60-120fps GPU-composited RAF loop updating transform & opacity directly without React re-renders
  useEffect(() => {
    if (ringItems.length === 0) return;

    let rafId = 0;
    let isRunning = false;
    let lastTime = performance.now();
    const ringLen = ringItems.length;
    const baseLen = Math.max(1, items.length);
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const cardW = isMobile ? 132 : 216;
    const gap = isMobile ? 18 : 26;
    const perspective = isMobile ? 620 : 1140;
    const maxAngleDeg = isMobile ? 28 : 24;
    const zCenter = isMobile ? 130 : 180;
    const zDepth = isMobile ? 210 : 300;
    const angleSlope = isMobile ? 0.38 : 0.34;
    const depthFreq = isMobile ? 0.42 : 0.36;
    const maxVisible = isMobile ? 2.7 : 4.1;

    const renderFrame = () => {
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
          if (!hiddenFlagsRef.current[i]) {
            hiddenFlagsRef.current[i] = true;
            el.style.visibility = 'hidden';
            el.style.opacity = '0';
            el.style.pointerEvents = 'none';
            el.style.transform = 'translate3d(-9999px, 0px, -400px)';
          }
          continue;
        }

        if (hiddenFlagsRef.current[i]) {
          hiddenFlagsRef.current[i] = false;
          el.style.visibility = 'visible';
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

        const fadeWindow = isMobile ? 0.45 : 0.65;
        const fadeStart = maxVisible - fadeWindow;
        const opacity = absD > fadeStart ? Math.max(0, 1 - (absD - fadeStart) / fadeWindow) : 1;

        el.style.transform = `translate3d(${xWorld.toFixed(2)}px, 0px, ${zPx.toFixed(2)}px) rotateY(${angleDeg.toFixed(2)}deg)`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = String(Math.round(100 + absD * 10));
        el.style.pointerEvents = opacity > 0.15 ? 'auto' : 'none';
      }
    };

    const shouldKeepTicking = () => {
      if (!isVisibleRef.current || isDocHiddenRef.current) return false;
      const hasMotion =
        isDraggingRef.current ||
        Math.abs(stepDeltaRef.current) > 0.001 ||
        Math.abs(velocityRef.current) > 0.015;
      if (hasMotion) return true;
      return !isPausedManually && !prefersReducedMotion;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      if (!isDraggingRef.current) {
        if (Math.abs(stepDeltaRef.current) > 0.001) {
          const move = stepDeltaRef.current * Math.min(1, dt * 11);
          posRef.current += move;
          stepDeltaRef.current -= move;
          if (Math.abs(stepDeltaRef.current) <= 0.001) stepDeltaRef.current = 0;
        } else if (Math.abs(velocityRef.current) > 0.015) {
          posRef.current += velocityRef.current * dt;
          velocityRef.current *= Math.pow(0.035, dt);
          if (Math.abs(velocityRef.current) <= 0.015) velocityRef.current = 0;
        } else if (!isPausedManually && !prefersReducedMotion) {
          const cardsPerSec = Math.max(0.24, baseLen / Math.max(14, speedSeconds || 32));
          posRef.current += cardsPerSec * dt;
        }
      }

      if (posRef.current >= ringLen || posRef.current < 0) {
        posRef.current = ((posRef.current % ringLen) + ringLen) % ringLen;
      }

      renderFrame();

      if (shouldKeepTicking()) {
        rafId = requestAnimationFrame(tick);
      } else {
        isRunning = false;
      }
    };

    const startLoop = () => {
      if (isRunning) return;
      if (!shouldKeepTicking()) {
        renderFrame();
        return;
      }
      isRunning = true;
      lastTime = performance.now();
      rafId = requestAnimationFrame(tick);
    };

    wakeLoopRef.current = startLoop;
    renderFrame();
    startLoop();

    return () => {
      wakeLoopRef.current = null;
      isRunning = false;
      cancelAnimationFrame(rafId);
    };
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

      const stride = isMobile ? 130 : 220;
      posRef.current -= dx / stride;

      const now = performance.now();
      const dt = Math.max(0.008, (now - lastPointerTimeRef.current) / 1000);
      velocityRef.current = -(dx / stride) / dt * 0.45;

      lastPointerXRef.current = e.clientX;
      lastPointerTimeRef.current = now;
      wakeLoopRef.current?.();
    };

    const handlePointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      wakeLoopRef.current?.();
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
    wakeLoopRef.current?.();
  };

  return (
    <div
      ref={stageRef}
      dir="ltr"
      onPointerDown={handleStagePointerDown}
      className="relative w-full h-[250px] sm:h-[320px] md:h-[365px] overflow-clip flex items-center justify-center touch-pan-y cursor-grab active:cursor-grabbing select-none"
      style={{
        perspective: isMobile ? '620px' : '1140px',
        perspectiveOrigin: '50% 50%',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Subtle Ambient Horizon Arc */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-[#2B95FF]/25 to-transparent pointer-events-none" />

      {/* Desktop Left & Right Soft Edge Vignettes (Mobile shows edge-to-edge sweeping cards cleanly) */}
      <div className="hidden md:block absolute top-0 bottom-0 left-0 w-16 lg:w-24 bg-gradient-to-r from-[#F5F2EC] via-[#F5F2EC]/60 to-transparent dark:from-[#0B0F17] dark:via-[#0B0F17]/65 dark:to-transparent z-[200] pointer-events-none" />
      <div className="hidden md:block absolute top-0 bottom-0 right-0 w-16 lg:w-24 bg-gradient-to-l from-[#F5F2EC] via-[#F5F2EC]/60 to-transparent dark:from-[#0B0F17] dark:via-[#0B0F17]/65 dark:to-transparent z-[200] pointer-events-none" />

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
            marginLeft: isMobile ? '-66px' : '-108px',
            marginTop: isMobile ? '-98px' : '-139px',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          className="group arc-slider-card shrink-0 w-[132px] h-[196px] md:w-[216px] md:h-[278px] rounded-[20px] md:rounded-[28px] p-2 md:p-3 liquid-glass-card hover:border-[#2B95FF]/55 flex flex-col items-center justify-between cursor-pointer overflow-hidden"
        >
          {/* Logo Showcase Window (Pure white background in both light & dark themes) */}
          <div
            className="w-full flex-1 rounded-[14px] md:rounded-[18px] border border-[#161B26]/[0.06] dark:border-white/10 bg-white flex items-center justify-center p-1.5 md:p-3 overflow-hidden relative shadow-2xs"
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
              className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#161B26]/8 text-[#161B26] group-hover:bg-[#2B95FF] group-hover:text-white flex items-center justify-center absolute bottom-1.5 left-1.5 md:bottom-2 md:left-2 rtl:left-auto rtl:right-1.5 md:rtl:right-2 transition-colors pointer-events-none"
              aria-hidden="true"
            >
              <ArrowUpRight className="w-3 h-3 md:w-3.5 md:h-3.5 rtl:-scale-x-100" />
            </span>
          </div>

          {/* Card Footer Metadata */}
          <div className="w-full pt-1.5 md:pt-2.5 px-0.5 md:px-1 text-center shrink-0">
            <span
              className="text-[9.5px] md:text-[11px] font-bold block truncate"
              style={{ color: partner.accentColor || '#2B95FF' }}
            >
              {partner.badge || (isArabic ? 'شريك وطني' : 'Partner')}
            </span>
            <h3 className="text-[11px] md:text-[14px] font-black text-[#161B26] dark:text-[#F8FAFC] leading-tight mt-0.5 truncate group-hover:text-[#1263D6] dark:group-hover:text-[#60AFFF] transition-colors">
              {isArabic ? partner.name : partner.nameEn}
            </h3>
            <p className="hidden md:block text-[11px] text-[#4B5563] dark:text-[#94A3B8] font-medium truncate mt-0.5">
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
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767.98px)').matches : false
  );
  const [selectedMobileCategory, setSelectedMobileCategory] = useState<string>('all');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPausedManually, setIsPausedManually] = useState(false);

  // Track responsive breakpoint synced identically with Tailwind md: (768px)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(max-width: 767.98px)');
    const onChange = (e: MediaQueryListEvent) => setIsMobileViewport(e.matches);
    setIsMobileViewport(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
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
      className="py-16 sm:py-24 bg-transparent text-[#161B26] dark:text-[#F8FAFC] relative overflow-hidden select-none border-b border-[#161B26]/[0.06] dark:border-white/10 transition-colors [content-visibility:auto] [contain-intrinsic-size:1px_600px]"
    >
      {/* Background Subtle Sky Blue Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[380px] bg-[radial-gradient(ellipse_at_center,rgba(43,149,255,0.12)_0%,transparent_70%)] pointer-events-none transform-gpu" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#2B95FF]/25 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* HEADER: Enterprise Grade Clinical & Rehabilitation Partnership Header   */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          
          {/* Subtle Sector Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-pill text-[#1263D6] dark:text-[#60AFFF] text-xs sm:text-[13px] font-bold mb-4 shadow-2xs">
            <Handshake className="w-4 h-4 text-[#2B95FF] shrink-0" />
            <span>{isArabic ? (settings.badgeTextAr || 'شركاء النجاح والتميز المؤسسي') : (settings.badgeTextEn || 'SUCCESS PARTNERS & ALLIANCES')}</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-[#161B26] dark:text-[#F8FAFC] tracking-tight leading-tight mb-4">
            {isArabic ? (
              <>
                <span>{settings.sectionTitleAr || 'شركاؤنا في مسيرة النجاح والتمكين'}</span>
                <span className="text-[#2B95FF]">.</span>
              </>
            ) : (
              <>
                <span>{settings.sectionTitleEn || 'Our Partners in Success & Empowerment'}</span>
                <span className="text-[#2B95FF]">.</span>
              </>
            )}
          </h2>

          {/* Subtitle */}
          <p className="text-[#4B5563] dark:text-[#94A3B8] text-xs sm:text-sm md:text-base leading-relaxed px-4 max-w-2xl mx-auto font-normal">
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
                      ? 'warm-pill-cta shadow-md'
                      : 'liquid-glass-pill text-[#4B5563] dark:text-[#94A3B8] hover:text-[#1263D6] dark:hover:text-[#60AFFF]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-[#2B95FF]" />
                  <span>{isArabic ? sec.labelAr : sec.labelEn}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans ${
                    isSelected ? 'bg-[#2B95FF] text-white' : 'bg-[#161B26]/8 dark:bg-white/10 text-[#4B5563] dark:text-[#94A3B8]'
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
            <Search className="w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 left-3.5 rtl:left-auto rtl:right-3.5 text-[#8B95A5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isArabic ? 'ابحث عن جهة أو شريك...' : 'Search partners...'}
              className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 rounded-full warm-pill-input text-xs text-[#161B26] dark:text-[#F8FAFC] placeholder-[#8B95A5] dark:placeholder-[#64748B] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label={isArabic ? 'مسح البحث' : 'Clear search'}
                className="absolute top-1/2 -translate-y-1/2 right-1.5 rtl:right-auto rtl:left-1.5 w-8 h-8 flex items-center justify-center text-[#8B95A5] hover:text-[#161B26] dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="text-xs font-bold text-[#4B5563] dark:text-[#94A3B8]">
              {isArabic 
                ? `${filteredPartners.length} جهة وشريك معتمد` 
                : `${filteredPartners.length} Verified Partners`}
            </div>

            {/* Switcher Buttons */}
            <div className="flex items-center gap-1 liquid-glass-pill p-1 rounded-full">
              <button
                onClick={() => setViewMode('slider')}
                aria-label={isArabic ? 'عرض السلايدر' : 'Slider View'}
                className={`px-3.5 py-1.5 min-h-[36px] rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'slider' 
                    ? 'warm-pill-cta shadow-xs' 
                    : 'text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{isArabic ? 'متدفق' : 'Slider'}</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                aria-label={isArabic ? 'عرض الشبكة' : 'Grid View'}
                className={`px-3.5 py-1.5 min-h-[36px] rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'warm-pill-cta shadow-xs' 
                    : 'text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-white'
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
                <span className="text-xs font-bold text-[#4B5563] dark:text-[#94A3B8]">
                  {isArabic ? 'اسحب أو تنقّل لاستعراض الشركاء' : 'Swipe or browse partners'}
                </span>
                <div className="flex items-center gap-2" dir="ltr">
                  <button
                    onClick={() => stepArc(isArabic ? 'next' : 'prev')}
                    aria-label={isArabic ? 'التالي' : 'Previous'}
                    className="w-11 h-11 rounded-full liquid-glass-btn shadow-xs flex items-center justify-center text-[#161B26] dark:text-[#F8FAFC] active:scale-95 transition-transform cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => stepArc(isArabic ? 'prev' : 'next')}
                    aria-label={isArabic ? 'السابق' : 'Next'}
                    className="w-11 h-11 rounded-full liquid-glass-btn shadow-xs flex items-center justify-center text-[#161B26] dark:text-[#F8FAFC] active:scale-95 transition-transform cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs Capsule Bar */}
              <div className="w-full liquid-glass-pill p-1.5 shadow-xs mb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
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
                      className={`inline-flex items-center gap-2 px-3.5 py-2 min-h-[36px] rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                        isSelected
                          ? 'warm-pill-cta shadow-xs'
                          : 'bg-transparent text-[#4B5563] dark:text-[#94A3B8] hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[11px] font-sans font-bold ${
                          isSelected
                            ? 'bg-[#2B95FF] text-white'
                            : 'bg-[#161B26]/8 dark:bg-white/10 text-[#4B5563] dark:text-[#94A3B8]'
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
                <div className="flex-1 h-[3.5px] bg-[#161B26]/10 dark:bg-white/15 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2B95FF] rounded-full transition-[width] duration-300"
                    style={{
                      width: `${Math.min(100, Math.max(8, ((activeSlideIndex + 1) / Math.max(1, activeSliderPartners.length)) * 100))}%`
                    }}
                  />
                </div>
                <div className="flex items-baseline gap-1 font-sans shrink-0 tabular-nums">
                  <span className="text-base font-black text-[#161B26] dark:text-[#F8FAFC]">
                    {String(activeSlideIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-bold text-[#4B5563] dark:text-[#94A3B8]">
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
                className={`group h-[265px] sm:h-[285px] rounded-[28px] p-3 sm:p-3.5 liquid-glass-card hover:shadow-2xl hover:border-[#2B95FF]/50 hover:-translate-y-1.5 transition-transform duration-300 flex flex-col items-center justify-between cursor-pointer relative overflow-hidden`}
              >
                {/* Top Badge: Centered in the card */}
                <div className="flex items-center justify-center w-full pt-0.5 px-0.5 relative z-10">
                  <span 
                    className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-[12px] font-bold px-3 py-0.5 rounded-full truncate max-w-[90%] text-center"
                    style={{
                      backgroundColor: partner.accentColor ? `${partner.accentColor}18` : 'rgba(43, 149, 255, 0.12)',
                      color: partner.accentColor || '#2B95FF',
                      border: `1px solid ${partner.accentColor ? `${partner.accentColor}30` : 'rgba(43, 149, 255, 0.30)'}`
                    }}
                  >
                    <span 
                      className="w-2 h-2 rounded-full shrink-0 shadow-xs" 
                      style={{ backgroundColor: partner.accentColor || '#2B95FF' }}
                    />
                    <span className="truncate">{partner.badge || (isArabic ? 'شريك وطني' : 'Partner')}</span>
                  </span>
                </div>

                {/* Center Framed Canvas for Logo - Pure white in both light & dark mode */}
                <div 
                  className="w-full h-32 sm:h-36 rounded-2xl border border-[#161B26]/[0.06] dark:border-white/10 bg-white dark:bg-white flex items-center justify-center overflow-hidden relative z-10 p-2 sm:p-2.5 shadow-xs"
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
                  <h3 className="text-sm sm:text-[15px] font-black text-[#161B26] dark:text-[#F8FAFC] truncate max-w-full group-hover:text-[#1263D6] dark:group-hover:text-[#60AFFF] transition-colors leading-tight text-center">
                    {isArabic ? partner.name : partner.nameEn}
                  </h3>
                  <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] font-medium truncate max-w-full mt-0.5 text-center">
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
            <Building2 className="w-10 h-10 text-[#8B95A5] mx-auto mb-3" />
            <p className="text-sm font-bold text-[#4B5563] dark:text-[#94A3B8]">
              {isArabic ? 'لم نتمكن من العثور على شركاء يطابقون بحثك' : 'No partners found matching your search'}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedSector('all'); }}
              className="mt-3 text-xs font-black text-[#1263D6] dark:text-[#60AFFF] underline cursor-pointer"
            >
              {isArabic ? 'إعادة ضبط التصفية والبحث' : 'Reset filters'}
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* BOTTOM CONTROLS & NAVIGATION BAR (Desktop Only)                           */}
        {/* ========================================================================= */}
        {viewMode === 'slider' && filteredPartners.length > 0 && (
          <div className="hidden md:flex mt-3 items-center justify-between gap-4 text-xs text-[#4B5563] dark:text-[#94A3B8] px-2">
            
            {/* Counter & Subtle Hint */}
            <div className="flex items-center gap-3">
              <span className="font-sans font-black text-sm text-[#161B26] dark:text-[#F8FAFC] tabular-nums">
                {String(activeSlideIndex + 1).padStart(2, '0')}
                <span className="text-xs font-bold text-[#8B95A5] dark:text-[#64748B]"> / {filteredPartners.length}</span>
              </span>
              <span className="text-[#4B5563] dark:text-[#94A3B8]">
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
                  className="w-11 h-11 rounded-full liquid-glass-btn text-[#161B26] dark:text-[#F8FAFC] hover:text-[#2B95FF] transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => stepArc(isArabic ? 'prev' : 'next')}
                  aria-label={isArabic ? 'الشريك السابق' : 'Next partner'}
                  className="w-11 h-11 rounded-full liquid-glass-btn text-[#161B26] dark:text-[#F8FAFC] hover:text-[#2B95FF] transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Play / Pause Toggle */}
              <button
                onClick={() => setIsPausedManually(!isPausedManually)}
                className="inline-flex items-center gap-1.5 px-4 h-11 rounded-full warm-pill-cta font-bold transition-colors cursor-pointer shadow-xs"
              >
                {isPausedManually ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
                <span>{isPausedManually ? (isArabic ? 'تشغيل العرض' : 'Play') : (isArabic ? 'إيقاف مؤقت' : 'Pause')}</span>
              </button>
            </div>

          </div>
        )}

        {/* Partnership Metrics Highlights */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-[#161B26]/[0.08] dark:border-white/10">
          <div className="liquid-glass-panel rounded-[28px] p-3 sm:p-5 relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle_at_center,rgba(43,149,255,0.12)_0%,transparent_70%)] pointer-events-none transform-gpu" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.14)_0%,transparent_70%)] pointer-events-none transform-gpu" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 relative z-10">
              
              {/* Card 1: 20+ شراكة حكومية ومؤسسية */}
              <div className="group liquid-glass-card rounded-[22px] p-3.5 sm:p-5 transition-colors duration-300 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-1.5 mb-2.5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#2B95FF]/12 text-[#2B95FF] border border-[#2B95FF]/25 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-[#2B95FF]/20 transition-transform">
                    <Landmark className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[9.5px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#2B95FF]/12 text-[#1263D6] dark:text-[#60AFFF] border border-[#2B95FF]/25 truncate">
                    {isArabic ? 'جهات كبرى' : 'Major Alliances'}
                  </span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#1263D6] dark:text-[#60AFFF] tracking-tight leading-none font-mono tabular-nums">
                    20+
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#161B26] dark:text-[#F8FAFC] mt-1.5 leading-snug">
                    {isArabic ? 'شراكة حكومية ومؤسسية' : 'Strategic Alliances'}
                  </div>
                  <div className="text-[10px] text-[#4B5563] dark:text-[#94A3B8] mt-0.5 leading-tight">
                    {isArabic ? 'وزارات وهيئات وجامعات كبرى' : 'Ministries & Authorities'}
                  </div>
                </div>
              </div>

              {/* Card 2: 100% تكامل في مسارات الدمج */}
              <div className="group liquid-glass-card rounded-[22px] p-3.5 sm:p-5 transition-colors duration-300 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-1.5 mb-2.5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#10B981]/12 text-[#10B981] border border-[#10B981]/25 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-[#10B981]/20 transition-transform">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[9.5px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/12 text-[#047857] dark:text-[#34D399] border border-[#10B981]/25 truncate">
                    {isArabic ? 'دمج مدرسي' : 'Full Inclusion'}
                  </span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#047857] dark:text-[#34D399] tracking-tight leading-none font-mono tabular-nums">
                    100%
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#161B26] dark:text-[#F8FAFC] mt-1.5 leading-snug">
                    {isArabic ? 'تكامل في مسارات الدمج' : 'Inclusion & Integration'}
                  </div>
                  <div className="text-[10px] text-[#4B5563] dark:text-[#94A3B8] mt-0.5 leading-tight">
                    {isArabic ? 'دمج مدرسي ورعاية تخصصية' : 'Classroom & Dedicated Care'}
                  </div>
                </div>
              </div>

              {/* Card 3: 0% تقسيط وتيسير مالي مرن */}
              <div className="group liquid-glass-card rounded-[22px] p-3.5 sm:p-5 transition-colors duration-300 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-1.5 mb-2.5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#8B5CF6]/12 text-[#8B5CF6] border border-[#8B5CF6]/25 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-[#8B5CF6]/20 transition-transform">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[9.5px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#8B5CF6]/12 text-[#6D28D9] dark:text-[#A78BFA] border border-[#8B5CF6]/25 truncate">
                    {isArabic ? 'بدون فوائد' : '0% Interest'}
                  </span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#6D28D9] dark:text-[#A78BFA] tracking-tight leading-none font-mono tabular-nums">
                    0%
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#161B26] dark:text-[#F8FAFC] mt-1.5 leading-snug">
                    {isArabic ? 'تقسيط وتيسير مالي مرن' : 'Flexible Installments'}
                  </div>
                  <div className="text-[10px] text-[#4B5563] dark:text-[#94A3B8] mt-0.5 leading-tight">
                    {isArabic ? 'شراكة تمارا وإمكان بدون فوائد' : 'Tamara & Emkan Enablement'}
                  </div>
                </div>
              </div>

              {/* Card 4: 4 اعتمادات دولية */}
              <div className="group liquid-glass-card rounded-[22px] p-3.5 sm:p-5 transition-colors duration-300 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-1.5 mb-2.5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#F59E0B]/12 text-[#F59E0B] border border-[#F59E0B]/25 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-[#F59E0B]/20 transition-transform">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[9.5px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F59E0B]/12 text-[#B45309] dark:text-[#FBBF24] border border-[#F59E0B]/25 truncate">
                    {isArabic ? 'معايير دولية' : 'Global Standards'}
                  </span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#B45309] dark:text-[#FBBF24] tracking-tight leading-none font-mono tabular-nums">
                    4
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#161B26] dark:text-[#F8FAFC] mt-1.5 leading-snug">
                    {isArabic ? 'اعتمادات دولية لجودة التأهيل' : 'International Accreditations'}
                  </div>
                  <div className="text-[10px] text-[#4B5563] dark:text-[#94A3B8] mt-0.5 leading-tight font-medium">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActivePartnerModal(null)}
        >
          <div 
            className="w-full max-w-lg glass-modal-dialog rounded-[28px] p-6 sm:p-7 shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Top Accent Bar */}
            <div 
              className="absolute top-0 inset-x-0 h-2"
              style={{ backgroundColor: activePartnerModal.accentColor || '#2B95FF' }}
            />

            {/* Close button */}
            <button
              onClick={() => setActivePartnerModal(null)}
              aria-label={isArabic ? 'إغلاق' : 'Close'}
              className="absolute top-4 left-4 rtl:left-auto rtl:right-4 w-9 h-9 min-w-[36px] min-h-[36px] rounded-full liquid-glass-btn flex items-center justify-center text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-white cursor-pointer z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Logo in Header */}
            <div 
              className="w-36 h-24 sm:w-44 sm:h-28 mx-auto mb-4 rounded-2xl border border-[#161B26]/10 dark:border-white/20 p-2 sm:p-3 shadow-xs flex items-center justify-center relative z-10 overflow-hidden bg-white dark:bg-white"
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
              <h3 className="text-lg sm:text-xl font-black text-[#161B26] dark:text-[#F8FAFC]">
                {isArabic ? activePartnerModal.name : activePartnerModal.nameEn}
              </h3>
              <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] mt-1 font-medium">
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

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#10B981]/10 text-[#047857] dark:text-[#34D399] border border-[#10B981]/25">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'شراكة سارية وفعالة' : 'Active Partnership'}</span>
                </span>
              </div>
            </div>

            {/* Scope of Partnership Description */}
            <div className="p-4 rounded-2xl bg-[#F5F2EC]/70 dark:bg-white/5 border border-[#161B26]/[0.08] dark:border-white/10 text-xs sm:text-sm text-[#161B26] dark:text-[#F8FAFC] leading-relaxed text-center relative z-10">
              {isArabic 
                ? (activePartnerModal.description || 'شراكة استراتيجية مستمرة تسهم في تمكين أطفال مركز رابا وتقديم الدعم التخصصي والدمج المجتمعي بأعلى المعايير.')
                : (activePartnerModal.descriptionEn || 'Ongoing strategic alliance dedicated to empowering children with specialized care and community integration.')}
            </div>

            {/* Key Partnership Highlights */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-[#4B5563] dark:text-[#94A3B8]">
              <div className="p-2.5 rounded-xl bg-[#F5F2EC]/70 dark:bg-white/5 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span>{isArabic ? 'تسهيلات ورعاية مخصصة' : 'Dedicated Privileges'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F5F2EC]/70 dark:bg-white/5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2B95FF] shrink-0" />
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
                  className="flex-1 py-2.5 rounded-full liquid-glass-btn text-[#161B26] dark:text-[#F8FAFC] text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'زيارة الموقع الرسمي' : 'Visit Website'}</span>
                </a>
              ) : null}
              
              <button
                onClick={() => setActivePartnerModal(null)}
                className="flex-1 py-2.5 rounded-full warm-pill-cta text-xs font-black shadow-sm transition-colors cursor-pointer text-center"
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
