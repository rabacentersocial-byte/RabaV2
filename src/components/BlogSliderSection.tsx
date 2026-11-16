import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Calendar,
  Heart, 
  Share2, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  X, 
  UserCheck, 
  Bookmark, 
  Brain,
  Target,
  Layers,
  MessageSquare,
  HeartHandshake,
  Play,
  Pause
} from 'lucide-react';
import { BlogPost, Specialist } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { SPECIALISTS } from '../data/mockData';
import { getStoredBlogPosts } from '../data/blogCustomizer';

interface ConcaveArcBlogHandle {
  step: (direction: 1 | -1) => void;
  reset: () => void;
}

interface ConcaveArcBlogSliderProps {
  posts: BlogPost[];
  isArabic: boolean;
  isMobile: boolean;
  isPausedManually: boolean;
  likedPosts: Record<string, boolean>;
  shareFeedback: string | null;
  getCategoryIconConfig: (cat?: string) => {
    icon: React.ComponentType<{ className?: string }>;
    iconBoxBg: string;
    headerBg: string;
    headerBorder: string;
    badgeBg: string;
  };
  onToggleLike: (e: React.MouseEvent, postId: string) => void;
  onShare: (e: React.MouseEvent, post: BlogPost) => void;
  onSelectPost: (post: BlogPost) => void;
  onActiveIndexChange?: (index: number) => void;
  controlsRef: React.MutableRefObject<ConcaveArcBlogHandle | null>;
}

/**
 * Computes screen-space integrated X offset and 3D concave cylindrical coordinates
 * so blog cards form a smooth panoramic inward-curving arc on both mobile and desktop.
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

const ConcaveArcBlogSlider: React.FC<ConcaveArcBlogSliderProps> = ({
  posts,
  isArabic,
  isMobile,
  isPausedManually,
  likedPosts,
  shareFeedback,
  getCategoryIconConfig,
  onToggleLike,
  onShare,
  onSelectPost,
  onActiveIndexChange,
  controlsRef,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
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

  const postsSignature = useMemo(
    () => posts.map((p) => p.id).join('|'),
    [posts]
  );

  const ringItems = useMemo(() => {
    if (posts.length === 0) return [];
    const targetMin = isMobile ? 9 : 13;
    const out: BlogPost[] = [];
    while (out.length < targetMin) {
      out.push(...posts);
    }
    return out;
  }, [posts, isMobile]);

  useEffect(() => {
    posRef.current = 0;
    stepDeltaRef.current = 0;
    velocityRef.current = 0;
    lastReportedIdxRef.current = -1;
    hiddenFlagsRef.current = [];
    onActiveIndexChangeRef.current?.(0);
  }, [postsSignature]);

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

  useEffect(() => {
    if (ringItems.length === 0) return;

    let rafId = 0;
    let isRunning = false;
    let lastTime = performance.now();
    const ringLen = ringItems.length;
    const baseLen = Math.max(1, posts.length);
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const cardW = isMobile ? 200 : 286;
    const gap = isMobile ? 20 : 28;
    const perspective = isMobile ? 660 : 1180;
    const maxAngleDeg = isMobile ? 26 : 22;
    const zCenter = isMobile ? 130 : 180;
    const zDepth = isMobile ? 210 : 290;
    const angleSlope = isMobile ? 0.38 : 0.33;
    const depthFreq = isMobile ? 0.42 : 0.35;
    const maxVisible = isMobile ? 2.5 : 3.8;

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

        const fadeWindow = isMobile ? 0.4 : 0.65;
        const fadeStart = maxVisible - fadeWindow;
        const opacity = absD > fadeStart ? Math.max(0, 1 - (absD - fadeStart) / fadeWindow) : 1;

        el.style.transform = `translate3d(${xWorld.toFixed(2)}px, 0px, ${zPx.toFixed(2)}px) rotateY(${angleDeg.toFixed(2)}deg)`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = String(Math.round(100 + absD * 10));
        el.style.pointerEvents = opacity > 0.12 ? 'auto' : 'none';
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
          const cardsPerSec = isMobile ? 0.28 : 0.25;
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
  }, [ringItems, posts.length, isMobile, isPausedManually]);

  useEffect(() => {

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastPointerXRef.current;
      const totalMove = Math.abs(e.clientX - dragStartXRef.current);
      if (totalMove > 6) {
        didDragMoveRef.current = true;
      }

      const stride = isMobile ? 140 : 225;
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

  const renderCardContent = (post: BlogPost) => {
    const isLiked = likedPosts[post.id] || false;
    const currentLikes = (post.likesCount || 0) + (isLiked ? 1 : 0);
    const categoryConfig = getCategoryIconConfig(post.category);
    const CategoryIcon = categoryConfig.icon;

    return (
      <>
        {/* 1. Integrated Custom Header with Topic Icon (No Photos) */}
        <div className={`p-3.5 md:p-5 pb-3 md:pb-4 ${categoryConfig.headerBg} ${categoryConfig.headerBorder} relative transition-colors shrink-0`}>
          {/* Top Row: Category Badge & Custom Integrated Icon Box */}
          <div className="flex items-center justify-between gap-2 mb-2.5 md:mb-3.5">
            <span className={`${categoryConfig.badgeBg} text-[9.5px] md:text-[11px] font-black px-2.5 md:px-3 py-1 rounded-xl shadow-xs tracking-tight truncate max-w-[74%]`}>
              {isArabic ? post.categoryTitle : (post.categoryTitleEn || post.categoryTitle)}
            </span>

            <div className={`w-8 h-8 md:w-11 md:h-11 rounded-xl md:rounded-2xl ${categoryConfig.iconBoxBg} border flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
              <CategoryIcon className="w-4 h-4 md:w-5 md:h-5" />
            </div>
          </div>

          {/* Integrated Metadata Strip: Reading Time, Views & Date */}
          <div className="flex items-center justify-between gap-1.5 text-[9.5px] md:text-[11px] font-medium text-[#4B5563] dark:text-[#94A3B8]">
            <span className="flex items-center gap-1 truncate">
              <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#2B95FF] shrink-0" />
              <span className="hidden md:inline">{post.readTimeMinutes} {isArabic ? 'دقائق قراءة' : 'min read'}</span>
              <span className="md:hidden">{post.readTimeMinutes} {isArabic ? 'د' : 'm'}</span>
            </span>

            <span className="flex items-center gap-1 shrink-0">
              <Eye className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#8B95A5] dark:text-[#64748B] shrink-0" />
              <span>{post.viewsCount}</span>
            </span>

            <span className="hidden md:flex items-center gap-1 truncate">
              <Calendar className="w-3.5 h-3.5 text-[#2B95FF] shrink-0" />
              <span className="truncate">{isArabic ? post.publishDate : (post.publishDateEn || post.publishDate)}</span>
            </span>
          </div>
        </div>

        {/* 2. Card Body (No Photos) */}
        <div className="p-3.5 md:p-5 flex flex-col justify-between flex-1 min-h-0">
          <div className="min-h-0">
            {/* Title */}
            <h3 className="text-xs md:text-base font-black text-[#161B26] dark:text-[#F8FAFC] leading-snug line-clamp-3 md:line-clamp-2 group-hover:text-[#1263D6] dark:group-hover:text-[#60AFFF] transition-colors mb-1.5 md:mb-2">
              {isArabic ? post.title : (post.titleEn || post.title)}
            </h3>

            {/* Excerpt */}
            <p className="text-[10.5px] md:text-xs text-[#4B5563] dark:text-[#94A3B8] line-clamp-2 leading-relaxed mb-2 md:mb-3">
              {isArabic ? post.excerpt : (post.excerptEn || post.excerpt)}
            </p>

            {/* Key Takeaway Snippet */}
            {post.keyTakeaways && post.keyTakeaways.length > 0 && (
              <div className="hidden md:block bg-[#2B95FF]/10 border border-[#2B95FF]/20 rounded-2xl p-2.5 mb-2 text-[11px]">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2B95FF] shrink-0 mt-0.5" />
                  <span className="text-[#161B26] dark:text-[#F8FAFC] line-clamp-2 leading-relaxed font-medium">
                    {isArabic
                      ? post.keyTakeaways[0]
                      : (post.keyTakeawaysEn?.[0] || post.keyTakeaways[0])}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 3. Card Bottom Actions */}
          <div className="pt-2 md:pt-3 border-t border-[#161B26]/10 dark:border-white/10 flex items-center justify-between shrink-0">
            <span className="inline-flex items-center gap-1 md:gap-1.5 text-[10.5px] md:text-xs font-black text-[#1263D6] dark:text-[#60AFFF] group-hover:gap-2 transition-all">
              <span className="hidden md:inline">{isArabic ? 'قراءة المقال بالكامل' : 'Read Article'}</span>
              <span className="md:hidden">{isArabic ? 'اقرأ المقال' : 'Read'}</span>
              {isArabic ? <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />}
            </span>

            <div className="flex items-center gap-0.5 md:gap-1" onClick={(e) => e.stopPropagation()}>
              {/* Like button */}
              <button
                type="button"
                onClick={(e) => onToggleLike(e, post.id)}
                aria-label="Like post"
                className={`p-1.5 rounded-full flex items-center gap-1 text-[10.5px] md:text-xs font-bold transition-all cursor-pointer ${
                  isLiked
                    ? 'text-rose-600 bg-rose-500/10'
                    : 'text-[#8B95A5] dark:text-[#94A3B8] hover:text-rose-500 hover:bg-[#161B26]/5 dark:hover:bg-white/5'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{currentLikes}</span>
              </button>

              {/* Share button */}
              <button
                type="button"
                onClick={(e) => onShare(e, post)}
                aria-label="Share post"
                className="p-1.5 rounded-full text-[#8B95A5] dark:text-[#94A3B8] hover:text-[#2B95FF] hover:bg-[#161B26]/5 dark:hover:bg-white/5 transition-colors relative cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {shareFeedback === post.id && (
                  <span className="absolute -top-7 right-0 text-[10px] bg-[#2B95FF] dark:bg-[#1E293B] text-white dark:border dark:border-white/15 px-2 py-0.5 rounded-full shadow whitespace-nowrap z-20">
                    {isArabic ? 'تم نسخ الرابط' : 'Link copied'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div
      ref={stageRef}
      dir="ltr"
      onPointerDown={handleStagePointerDown}
      className="relative w-full h-[372px] sm:h-[420px] md:h-[480px] overflow-clip flex items-center justify-center touch-pan-y cursor-grab active:cursor-grabbing select-none"
      style={{
        perspective: isMobile ? '660px' : '1180px',
        perspectiveOrigin: '50% 50%',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Subtle Ambient Horizon Arc */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-[#2B95FF]/25 to-transparent pointer-events-none" />

      {/* Desktop Left & Right Soft Edge Vignettes */}
      <div className="hidden md:block absolute top-0 bottom-0 left-0 w-16 lg:w-24 bg-gradient-to-r from-[#F5F2EC] via-[#F5F2EC]/60 to-transparent dark:from-[#0B0F17] dark:via-[#0B0F17]/65 dark:to-transparent z-[200] pointer-events-none" />
      <div className="hidden md:block absolute top-0 bottom-0 right-0 w-16 lg:w-24 bg-gradient-to-l from-[#F5F2EC] via-[#F5F2EC]/60 to-transparent dark:from-[#0B0F17] dark:via-[#0B0F17]/65 dark:to-transparent z-[200] pointer-events-none" />

      {ringItems.map((post, idx) => (
        <article
          key={`blog-arc-${post.id}-${idx}`}
          ref={(el) => {
            cardRefs.current[idx] = el;
          }}
          dir={isArabic ? 'rtl' : 'ltr'}
          onClick={() => {
            if (!didDragMoveRef.current) {
              onSelectPost(post);
            }
          }}
          style={{
            marginLeft: isMobile ? '-100px' : '-143px',
            marginTop: isMobile ? '-150px' : '-194px',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          className="group arc-slider-card shrink-0 w-[200px] h-[300px] md:w-[286px] md:h-[388px] rounded-[22px] md:rounded-[28px] overflow-hidden liquid-glass-card hover:border-[#2B95FF]/55 flex flex-col justify-between cursor-pointer"
        >
          {renderCardContent(post)}
        </article>
      ))}
    </div>
  );
};

interface BlogSliderSectionProps {
  onOpenBooking?: () => void;
  onBookSpecialist?: (specialist: Specialist) => void;
  onOpenBlogPage?: () => void;
}

export const BlogSliderSection: React.FC<BlogSliderSectionProps> = ({
  onOpenBooking,
  onBookSpecialist,
  onOpenBlogPage,
}) => {
  const { isArabic } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const arcControlsRef = useRef<ConcaveArcBlogHandle | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPausedManually, setIsPausedManually] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767.98px)').matches : false
  );

  // Dynamic Stored Posts
  const [allPosts, setAllPosts] = useState<BlogPost[]>(() => getStoredBlogPosts());

  // Track responsive breakpoint synced identically with Tailwind md: (768px)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(max-width: 767.98px)');
    const onChange = (e: MediaQueryListEvent) => setIsMobileViewport(e.matches);
    setIsMobileViewport(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      setAllPosts(getStoredBlogPosts());
    };
    window.addEventListener('raba_blog_posts_updated', handleUpdate);
    window.addEventListener('raba_persistent_sync_ready', handleUpdate);
    return () => {
      window.removeEventListener('raba_blog_posts_updated', handleUpdate);
      window.removeEventListener('raba_persistent_sync_ready', handleUpdate);
    };
  }, []);

  // Filter posts (memoized to prevent breaking slider animation loop on re-renders)
  const visiblePosts = useMemo(
    () =>
      allPosts.filter(
        (post) => (post.status === undefined || post.status === 'published') && post.isSliderFeatured !== false
      ),
    [allPosts]
  );

  const filteredPosts = useMemo(
    () =>
      activeCategory === 'all'
        ? visiblePosts
        : visiblePosts.filter((post) => post.category === activeCategory),
    [visiblePosts, activeCategory]
  );

  // Categories list
  const categories = [
    { id: 'all', labelAr: 'جميع المقالات', labelEn: 'All Articles' },
    { id: 'psychology', labelAr: 'علم النفس والأعصاب', labelEn: 'Psychology & Neuroscience' },
    { id: 'autism', labelAr: 'طيف التوحد والتدخل المبكر', labelEn: 'Autism & Early Intervention' },
    { id: 'aba', labelAr: 'تحليل السلوك التطبيقي (ABA)', labelEn: 'Applied Behavior Analysis' },
    { id: 'occupational', labelAr: 'العلاج الوظيفي والتكامل الحسي', labelEn: 'Occupational Therapy' },
    { id: 'speech', labelAr: 'النطق والتخاطب والتواصل', labelEn: 'Speech & Language' },
    { id: 'family_guidance', labelAr: 'إرشادات أسرية وتعديل روتين', labelEn: 'Family Guidance' },
  ];

  const stepArc = (direction: 'next' | 'prev') => {
    const stepSign: 1 | -1 = direction === 'next' ? 1 : -1;
    arcControlsRef.current?.step(stepSign);
  };

  const scrollLeft = () => {
    stepArc(isArabic ? 'next' : 'prev');
  };

  const scrollRight = () => {
    stepArc(isArabic ? 'prev' : 'next');
  };

  const toggleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleShare = (e: React.MouseEvent, post: BlogPost) => {
    e.stopPropagation();
    const title = isArabic ? post.title : (post.titleEn || post.title);
    const url = window.location.href.split('#')[0] + `#blog-${post.slug}`;
    
    if (navigator.share) {
      navigator.share({
        title,
        text: isArabic ? post.excerpt : (post.excerptEn || post.excerpt),
        url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setShareFeedback(post.id);
      setTimeout(() => setShareFeedback(null), 2500);
    }
  };

  const handleAuthorClick = (e: React.MouseEvent, authorId?: string) => {
    e.stopPropagation();
    if (!authorId || !onBookSpecialist) return;
    const matched = SPECIALISTS.find(s => s.id === authorId);
    if (matched) {
      onBookSpecialist(matched);
    }
  };

  // Custom Category Icons and Card Theming (replacing stock photos with integrated branding)
  const getCategoryIconConfig = (cat?: string) => {
    switch (cat) {
      case 'psychology':
        return {
          icon: Brain,
          iconBoxBg: 'bg-[#2B95FF]/15 text-[#1263D6] dark:text-[#60AFFF] border-[#2B95FF]/30 shadow-[#2B95FF]/10',
          headerBg: 'bg-gradient-to-br from-[#2B95FF]/12 via-[#2B95FF]/[0.03] to-transparent',
          headerBorder: 'border-b border-[#161B26]/[0.06] dark:border-white/5',
          badgeBg: 'bg-[#2B95FF] text-white',
        };
      case 'autism':
        return {
          icon: Brain,
          iconBoxBg: 'bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24] border-[#F59E0B]/30 shadow-[#F59E0B]/10',
          headerBg: 'bg-gradient-to-br from-[#F59E0B]/10 via-[#F59E0B]/[0.03] to-transparent',
          headerBorder: 'border-b border-[#161B26]/[0.06] dark:border-white/5',
          badgeBg: 'bg-[#F59E0B] text-white',
        };
      case 'aba':
        return {
          icon: Target,
          iconBoxBg: 'bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA] border-[#8B5CF6]/30 shadow-[#8B5CF6]/10',
          headerBg: 'bg-gradient-to-br from-[#8B5CF6]/12 via-[#8B5CF6]/[0.03] to-transparent',
          headerBorder: 'border-b border-[#161B26]/[0.06] dark:border-white/5',
          badgeBg: 'bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white',
        };
      case 'occupational':
        return {
          icon: Layers,
          iconBoxBg: 'bg-[#10B981]/15 text-[#047857] dark:text-[#34D399] border-[#10B981]/30 shadow-[#10B981]/10',
          headerBg: 'bg-gradient-to-br from-[#10B981]/10 via-[#10B981]/[0.03] to-transparent',
          headerBorder: 'border-b border-[#161B26]/[0.06] dark:border-white/5',
          badgeBg: 'bg-[#10B981] text-white',
        };
      case 'speech':
        return {
          icon: MessageSquare,
          iconBoxBg: 'bg-sky-500/15 text-[#0369A1] dark:text-[#38BDF8] border-sky-500/30 shadow-sky-500/10',
          headerBg: 'bg-gradient-to-br from-sky-500/10 via-sky-500/[0.03] to-transparent',
          headerBorder: 'border-b border-[#161B26]/[0.06] dark:border-white/5',
          badgeBg: 'bg-[#0284C7] text-white',
        };
      case 'family_guidance':
        return {
          icon: HeartHandshake,
          iconBoxBg: 'bg-rose-500/15 text-[#BE123C] dark:text-[#FB7185] border-rose-500/30 shadow-rose-500/10',
          headerBg: 'bg-gradient-to-br from-rose-500/10 via-rose-500/[0.03] to-transparent',
          headerBorder: 'border-b border-[#161B26]/[0.06] dark:border-white/5',
          badgeBg: 'bg-[#E11D48] text-white',
        };
      default:
        return {
          icon: BookOpen,
          iconBoxBg: 'bg-[#2B95FF]/15 text-[#1263D6] dark:text-[#60AFFF] border-[#2B95FF]/30 shadow-[#2B95FF]/10',
          headerBg: 'bg-gradient-to-br from-[#2B95FF]/12 via-transparent to-transparent',
          headerBorder: 'border-b border-[#161B26]/[0.06] dark:border-white/5',
          badgeBg: 'bg-[#2B95FF] text-white',
        };
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="blog" 
      className="py-16 sm:py-24 relative overflow-hidden bg-transparent text-[#161B26] dark:text-[#F8FAFC] border-b border-[#161B26]/[0.06] dark:border-white/10 transition-colors [content-visibility:auto] [contain-intrinsic-size:1px_650px]"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-gradient-to-br from-[#2B95FF]/15 via-[#2B95FF]/5 to-transparent rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-[#8B5CF6]/15 dark:bg-[#8B5CF6]/12 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-[#1263D6] dark:text-[#60AFFF] text-xs font-black shadow-xs">
              <BookOpen className="w-4 h-4 text-[#2B95FF]" />
              <span>{isArabic ? 'المدونة الطبية والدليل المعرفي' : 'Clinical Blog & Knowledge Guide'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#161B26] dark:text-[#F8FAFC] tracking-tight leading-tight">
              {isArabic ? (
                <>
                  مقالات إكلينيكية وإرشادات موثوقة{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60AFFF] via-[#2B95FF] to-[#1A73E8]">
                    لتطور طفلك
                  </span>
                </>
              ) : (
                <>
                  Clinical Insights & Guidance for{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60AFFF] via-[#2B95FF] to-[#1A73E8]">
                    Your Child’s Growth
                  </span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-[#4B5563] dark:text-[#94A3B8] leading-relaxed font-normal">
              {isArabic 
                ? 'محتوى علمي وتأهيلي معتمد كتبه نخبة من استشاريي وأخصائيي مركز رابا، يقدم حلولاً عملية وتوجيهات أسرية مثبتة بالأدلة الإكلينيكية.'
                : 'Evidence-based guidance written by Raba Center specialists to support parents through diagnostic, sensory, and behavioral milestones.'}
            </p>
          </div>

          {/* Navigation & View All Action */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 self-start md:self-end flex-wrap">
            {onOpenBlogPage && (
              <button
                onClick={onOpenBlogPage}
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full warm-pill-cta text-xs sm:text-sm font-black transition-colors duration-200 cursor-pointer shadow-xs"
              >
                <span>{isArabic ? 'تصفح دليل المقالات الشامل' : 'Browse All Articles'}</span>
                {isArabic ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            )}

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setIsPausedManually(!isPausedManually)}
                aria-label={isPausedManually ? (isArabic ? 'تشغيل العرض' : 'Resume') : (isArabic ? 'إيقاف مؤقت' : 'Pause')}
                className="w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full liquid-glass-btn text-[#161B26] dark:text-[#F8FAFC] flex items-center justify-center hover:text-[#2B95FF] shadow-xs active:scale-95 transition-transform duration-200 cursor-pointer"
              >
                {isPausedManually ? <Play className="w-4 h-4 sm:w-5 sm:h-5" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <button
                onClick={scrollRight}
                aria-label={isArabic ? 'السابق' : 'Previous'}
                className="w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full liquid-glass-btn text-[#161B26] dark:text-[#F8FAFC] flex items-center justify-center hover:text-[#2B95FF] shadow-xs active:scale-95 transition-transform duration-200 cursor-pointer"
              >
                {isArabic ? <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <button
                onClick={scrollLeft}
                aria-label={isArabic ? 'التالي' : 'Next'}
                className="w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full liquid-glass-btn text-[#161B26] dark:text-[#F8FAFC] flex items-center justify-center hover:text-[#2B95FF] shadow-xs active:scale-95 transition-transform duration-200 cursor-pointer"
              >
                {isArabic ? <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Categories Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-6 no-scrollbar scroll-smooth">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveSlideIndex(0);
                  arcControlsRef.current?.reset();
                }}
                className={`px-4 py-2 min-h-[40px] rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'warm-pill-cta font-black shadow-md'
                    : 'liquid-glass-pill text-[#161B26] dark:text-[#F8FAFC] hover:border-[#2B95FF]/40 hover:text-[#1263D6] dark:hover:text-[#60AFFF]'
                }`}
              >
                {isArabic ? cat.labelAr : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* Mobile Top Controls above 3D Concave Slider */}
        <div className="block md:hidden mb-2" dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-[#4B5563] dark:text-[#94A3B8]">
              {isArabic ? 'اسحب أو تنقّل لاستعراض المقالات' : 'Swipe or browse articles'}
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
        </div>

        {/* Unified 3D Concave Panoramic Arc Blog Slider (Mobile & Desktop) */}
        {filteredPosts.length > 0 ? (
          <div className="-mx-4 sm:-mx-6 lg:-mx-8">
            <ConcaveArcBlogSlider
              posts={filteredPosts}
              isArabic={isArabic}
              isMobile={isMobileViewport}
              isPausedManually={isPausedManually}
              likedPosts={likedPosts}
              shareFeedback={shareFeedback}
              getCategoryIconConfig={getCategoryIconConfig}
              onToggleLike={toggleLike}
              onShare={handleShare}
              onSelectPost={setSelectedPost}
              onActiveIndexChange={setActiveSlideIndex}
              controlsRef={arcControlsRef}
            />
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-[#4B5563] dark:text-[#94A3B8]">
            {isArabic ? 'لا توجد مقالات في هذا التصنيف حالياً' : 'No articles in this category yet'}
          </div>
        )}

        {/* Mobile Bottom Progress Bar & Counter */}
        {filteredPosts.length > 2 && (
          <div className="flex md:hidden items-center justify-between gap-4 mt-3 px-1" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="flex-1 h-[3.5px] bg-[#161B26]/10 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2B95FF] rounded-full transition-[width] duration-300"
                style={{
                  width: `${Math.min(100, Math.max(8, ((activeSlideIndex + 1) / Math.max(1, filteredPosts.length)) * 100))}%`
                }}
              />
            </div>
            <div className="flex items-baseline gap-1 font-sans shrink-0 tabular-nums">
              <span className="text-base font-black text-[#161B26] dark:text-[#F8FAFC]">
                {String(activeSlideIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-xs font-bold text-[#4B5563] dark:text-[#94A3B8]">
                / {filteredPosts.length}
              </span>
            </div>
          </div>
        )}

        {/* Bottom Banner with Consultation Hook Aligned with Brand Palette */}
        <div className="mt-10 sm:mt-14 p-6 sm:p-8 rounded-[28px] obsidian-anchor-card flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2B95FF] to-[#1A73E8] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#2B95FF]/25">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#161B26] dark:text-white">
                {isArabic ? 'هل ترغب في استشارة إكلينيكية متخصصة لحالة طفلك؟' : 'Need a specialized clinical consultation for your child?'}
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] mt-1">
                {isArabic 
                  ? 'فريقنا الاستشاري المرخص من الهيئة السعودية للتخصصات الصحية جاهز لإجراء تقييم شامل ووضع خطة علاجية مخصصة.'
                  : 'Our licensed team is ready to conduct a standardized evaluation and build a personalized rehabilitation program.'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenBooking}
            className="w-full md:w-auto shrink-0 bg-gradient-to-r from-[#2B95FF] to-[#1A73E8] hover:brightness-110 active:scale-95 text-white font-black px-6 sm:px-8 py-3.5 rounded-full shadow-lg shadow-[#2B95FF]/25 transition-all text-sm sm:text-base cursor-pointer text-center"
          >
            {isArabic ? 'احجز موعد تقييم فوري' : 'Book Evaluation Now'}
          </button>
        </div>

      </div>

      {/* Full Article Reading Modal */}
      {selectedPost && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            className="glass-modal-dialog rounded-[28px] w-full max-w-3xl max-h-[90vh] overflow-y-auto relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Modal Header Sticky Top */}
            <div className="sticky top-0 z-20 bg-[#F5F2EC]/90 dark:bg-[#161C2A]/90 backdrop-blur-md px-6 py-4 border-b border-[#161B26]/10 dark:border-white/10 flex items-center justify-between">
              {(() => {
                const modalConfig = getCategoryIconConfig(selectedPost.category);
                return (
                  <div className="flex items-center gap-2">
                    <span className={`${modalConfig.badgeBg} text-xs font-black px-3 py-1 rounded-full shadow-xs`}>
                      {isArabic ? selectedPost.categoryTitle : (selectedPost.categoryTitleEn || selectedPost.categoryTitle)}
                    </span>
                    <span className="text-xs text-[#4B5563] dark:text-[#94A3B8] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#2B95FF]" />
                      <span>{selectedPost.readTimeMinutes} {isArabic ? 'دقائق قراءة' : 'min read'}</span>
                    </span>
                  </div>
                );
              })()}

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleShare(e, selectedPost)}
                  className="w-9 h-9 rounded-full liquid-glass-btn text-[#161B26] dark:text-[#F8FAFC] hover:text-[#2B95FF] flex items-center justify-center transition-colors relative cursor-pointer"
                  aria-label={isArabic ? 'مشاركة المقال' : 'Share article'}
                >
                  <Share2 className="w-4 h-4" />
                  {shareFeedback === selectedPost.id && (
                    <span className="absolute -bottom-8 right-0 text-[10px] bg-[#2B95FF] dark:bg-[#1E293B] text-white dark:border dark:border-white/15 px-2 py-0.5 rounded-full shadow whitespace-nowrap z-30">
                      {isArabic ? 'تم نسخ الرابط' : 'Link copied'}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="w-9 h-9 rounded-full liquid-glass-btn text-[#161B26] dark:text-[#F8FAFC] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Article Hero Banner with Integrated Custom Icon (No Stock Photo) */}
              {(() => {
                const modalConfig = getCategoryIconConfig(selectedPost.category);
                const ModalIcon = modalConfig.icon;
                return (
                  <div className={`p-6 sm:p-7 rounded-[24px] ${modalConfig.headerBg} border ${modalConfig.headerBorder} flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-right rtl:sm:text-right ltr:sm:text-left shadow-xs`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl ${modalConfig.iconBoxBg} border flex items-center justify-center shrink-0 shadow-xs`}>
                        <ModalIcon className="w-8 h-8" />
                      </div>
                      <div>
                        <span className={`${modalConfig.badgeBg} text-xs font-black px-3 py-1 rounded-full shadow-xs inline-block mb-1.5`}>
                          {isArabic ? selectedPost.categoryTitle : (selectedPost.categoryTitleEn || selectedPost.categoryTitle)}
                        </span>
                        <h3 className="text-sm sm:text-base font-black text-[#161B26] dark:text-[#F8FAFC]">
                          {isArabic ? 'دليل إكلينيكي وتأهيلي معتمد' : 'Evidence-Based Clinical Guide'}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-bold text-[#4B5563] dark:text-[#94A3B8]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#2B95FF]" />
                        <span>{selectedPost.readTimeMinutes} {isArabic ? 'دقائق' : 'min'}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-[#2B95FF]" />
                        <span>{selectedPost.viewsCount} {isArabic ? 'مشاهدة' : 'views'}</span>
                      </span>
                      <span>·</span>
                      <span>{isArabic ? selectedPost.publishDate : (selectedPost.publishDateEn || selectedPost.publishDate)}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Title & Metadata */}
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#161B26] dark:text-[#F8FAFC] leading-tight">
                  {isArabic ? selectedPost.title : (selectedPost.titleEn || selectedPost.title)}
                </h2>

                {/* Author Card */}
                <div 
                  onClick={(e) => handleAuthorClick(e, selectedPost.author.id)}
                  className="flex items-center justify-between p-3.5 liquid-glass-panel rounded-2xl hover:border-[#2B95FF]/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedPost.author.avatar || '/specialists/spec_haneen_obaidi_1790197216150.jpg'}
                      alt={selectedPost.author.name}
                      width={48}
                      height={48}
                      style={{ aspectRatio: '1 / 1' }}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/specialists/spec_haneen_obaidi_1790197216150.jpg';
                      }}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-[#161B26] dark:text-[#F8FAFC] group-hover:text-[#1263D6] dark:group-hover:text-[#60AFFF] transition-colors">
                          {isArabic ? selectedPost.author.name : (selectedPost.author.nameEn || selectedPost.author.name)}
                        </span>
                        <UserCheck className="w-3.5 h-3.5 text-[#2B95FF]" />
                      </div>
                      <p className="text-xs text-[#4B5563] dark:text-[#94A3B8]">
                        {isArabic ? selectedPost.author.role : (selectedPost.author.roleEn || selectedPost.author.role)}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#1263D6] dark:text-[#60AFFF] hidden xs:inline">
                    {isArabic ? 'عرض ملف الأخصائي' : 'View Profile'}
                  </span>
                </div>
              </div>

              {/* Key Takeaways Box */}
              {selectedPost.keyTakeaways && selectedPost.keyTakeaways.length > 0 && (
                <div className="bg-[#2B95FF]/10 border border-[#2B95FF]/20 rounded-2xl p-4 sm:p-5">
                  <h4 className="text-sm font-black text-[#161B26] dark:text-[#F8FAFC] mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2B95FF]" />
                    <span>{isArabic ? 'أبرز المخرجات والنقاط الإكلينيكية:' : 'Key Clinical Takeaways:'}</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8]">
                    {(isArabic ? selectedPost.keyTakeaways : (selectedPost.keyTakeawaysEn || selectedPost.keyTakeaways)).map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2B95FF] shrink-0 mt-2" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Full Article Text */}
              <div className="space-y-3.5 text-sm sm:text-base text-[#4B5563] dark:text-[#94A3B8] leading-loose">
                {(isArabic ? selectedPost.content : (selectedPost.contentEn || selectedPost.content)).map((block, idx) => {
                  const trimmed = (block || '').trim();
                  if (trimmed.startsWith('## ')) {
                    return (
                      <h4
                        key={idx}
                        className="text-lg sm:text-xl font-black text-[#161B26] dark:text-[#F8FAFC] pt-4 pb-1 border-b border-[#161B26]/10 dark:border-white/10"
                      >
                        {trimmed.slice(3)}
                      </h4>
                    );
                  }
                  if (trimmed.startsWith('### ')) {
                    return (
                      <h5
                        key={idx}
                        className="text-base sm:text-lg font-extrabold text-[#1263D6] dark:text-[#60AFFF] pt-3"
                      >
                        {trimmed.slice(4)}
                      </h5>
                    );
                  }
                  if (trimmed.startsWith('• ')) {
                    return (
                      <div key={idx} className="flex items-start gap-2.5 pr-1 sm:pr-3">
                        <span className="w-2 h-2 rounded-full bg-[#2B95FF] shrink-0 mt-3" />
                        <span className="font-normal leading-relaxed">{trimmed.slice(2)}</span>
                      </div>
                    );
                  }
                  return (
                    <p key={idx} className="font-normal">
                      {trimmed}
                    </p>
                  );
                })}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#161B26]/10 dark:border-white/10">
                <span className="text-xs font-bold text-[#4B5563] dark:text-[#94A3B8] flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5 text-[#2B95FF]" />
                  <span>{isArabic ? 'الوسوم:' : 'Tags:'}</span>
                </span>
                {(isArabic ? selectedPost.tags : (selectedPost.tagsEn || selectedPost.tags)).map((tag, idx) => (
                  <span key={idx} className="text-xs liquid-glass-pill text-[#4B5563] dark:text-[#94A3B8] px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Call to Action Inside Modal */}
              <div className="p-5 sm:p-6 obsidian-anchor-card rounded-[24px] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                <div>
                  <h4 className="font-black text-base text-[#161B26] dark:text-white">
                    {isArabic ? 'هل تود استشارة الكاتب حول طفلك؟' : 'Want to consult the author about your child?'}
                  </h4>
                  <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] mt-0.5">
                    {isArabic 
                      ? 'يمكنك حجز جلسة تقييم مباشرة مع الأخصائي أو الفريق الإكلينيكي المعالج.' 
                      : 'You can book a direct diagnostic or rehabilitation session.'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedPost(null);
                    if (selectedPost.author.id && onBookSpecialist) {
                      const matched = SPECIALISTS.find(s => s.id === selectedPost.author.id);
                      if (matched) {
                        onBookSpecialist(matched);
                        return;
                      }
                    }
                    if (onOpenBooking) onOpenBooking();
                  }}
                  className="w-full sm:w-auto shrink-0 bg-gradient-to-r from-[#2B95FF] to-[#1A73E8] text-white font-black px-6 py-3 rounded-full hover:brightness-110 transition-all text-xs sm:text-sm cursor-pointer shadow-md shadow-[#2B95FF]/25"
                >
                  {isArabic ? 'احجز استشارة مع الأخصائي' : 'Book Consultation'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
};
