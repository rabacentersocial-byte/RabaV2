import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Mail, 
  ChevronRight, 
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

import { Specialist } from '../types';
import { 
  HeroSlideItem, 
  HeroSliderConfig, 
  getStoredHeroSlides, 
  getStoredHeroSliderConfig 
} from '../data/sliderCustomizer';
import { getResolvedImageUrl, handleImageErrorWithStore } from '../utils/persistentImageStore';
import { useDailyChildrenCounter } from '../utils/dailyChildrenCounter';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenNotifications: () => void;
  onOpenVideo?: () => void;
  onBookSpecialist?: (specialist: Specialist) => void;
  onViewCv?: (specialist: Specialist) => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onOpenBooking, 
  onOpenNotifications,
  onOpenVideo
}) => {
  const { language, isArabic } = useLanguage();
  
  const [slides, setSlides] = useState<HeroSlideItem[]>(() => {
    const all = getStoredHeroSlides();
    const active = all.filter((s) => s.active !== false);
    return active.length > 0 ? active : all;
  });
  const [config, setConfig] = useState<HeroSliderConfig>(() => getStoredHeroSliderConfig());
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // Dynamic daily children counter (10 children from 8 AM to 6 PM) synchronized with cumulative beneficiaries
  const { count: dailyChildrenCount, formattedTotal, isWithinHours } = useDailyChildrenCounter(10);

  useEffect(() => {
    const handleUpdated = () => {
      const all = getStoredHeroSlides();
      const active = all.filter((s) => s.active !== false);
      setSlides(active.length > 0 ? active : all);
      setConfig(getStoredHeroSliderConfig());
    };
    window.addEventListener('raba_hero_slides_updated', handleUpdated);
    window.addEventListener('raba_slider_updated', handleUpdated);
    window.addEventListener('raba_persistent_sync_ready', handleUpdated);
    return () => {
      window.removeEventListener('raba_hero_slides_updated', handleUpdated);
      window.removeEventListener('raba_slider_updated', handleUpdated);
      window.removeEventListener('raba_persistent_sync_ready', handleUpdated);
    };
  }, []);

  // Safeguard index if slides count changes
  useEffect(() => {
    if (currentSlideIndex >= slides.length) {
      setCurrentSlideIndex(0);
    }
  }, [slides.length, currentSlideIndex]);

  const currentSlide = slides[currentSlideIndex] || slides[0] || {
    id: 'fallback',
    src: '/specialists/ahmed_abouzeid.jpg',
    alt: 'مركز رابا',
    objectPosition: 'top',
    zoomLevel: 100
  };

  const handleNext = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-play timer (slides based on configured interval when not paused)
  useEffect(() => {
    if (!config.autoplay || isPaused || slides.length <= 1) return;
    const intervalMs = Math.max(2, config.intervalSeconds || 4) * 1000;
    const interval = setInterval(() => {
      handleNext();
    }, intervalMs);
    return () => clearInterval(interval);
  }, [config.autoplay, config.intervalSeconds, isPaused, slides.length, handleNext]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <section 
      id="hero" 
      className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden border-b border-slate-200/80 dark:border-white/10"
    >
      {/* Background Decorative Stars (Teal & Golden Amber from Logo) */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-sky-500 dark:text-[#00E5BE] opacity-80 select-none pointer-events-none animate-pulse">
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-12 text-[#F59E0B] opacity-80 select-none pointer-events-none">
        <svg viewBox="0 0 24 24" className="w-9 h-9 fill-current">
          <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Copy Column */}
          <div className={`lg:col-span-6 space-y-6 ${isArabic ? 'text-right' : 'text-left'}`}>
            
            {/* Main Headline with Brush Highlighted ABA */}
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black leading-[1.25] tracking-tight text-slate-900 dark:text-white drop-shadow-xs">
              {isArabic ? (
                <>
                  مركز رابا للعلاج بتحليل <br />
                  <span className="inline-block mt-2">
                    السلوك التطبيقي{' '}
                    <span className="relative inline-block mx-1">
                      <span className="relative z-10 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-slate-950 font-black px-4 py-0.5 sm:px-6 sm:py-1 rounded-xl shadow-lg border border-amber-300 transform -rotate-1 inline-block text-2xl sm:text-4xl lg:text-[44px]">
                        ABA
                      </span>
                      <span className="absolute -inset-1 bg-amber-400/40 blur-md rounded-xl" />
                    </span>
                  </span>
                </>
              ) : (
                <>
                  RABA Center for Applied <br />
                  <span className="inline-block mt-2">
                    Behavior Analysis{' '}
                    <span className="relative inline-block mx-1">
                      <span className="relative z-10 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-slate-950 font-black px-4 py-0.5 sm:px-6 sm:py-1 rounded-xl shadow-lg border border-amber-300 transform -rotate-1 inline-block text-2xl sm:text-4xl lg:text-[44px]">
                        ABA
                      </span>
                      <span className="absolute -inset-1 bg-amber-400/40 blur-md rounded-xl" />
                    </span>
                  </span>
                </>
              )}
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-normal max-w-xl">
              {isArabic 
                ? 'يعد مركز رابا من أقدم المراكز التي تقدم خدمات التأهيل والدعم لذوي الإحتياجات الخاصة، وفق المعايير العالمية المعتمدة.'
                : 'Raba Center is among the foremost certified institutions delivering evidence-based rehabilitation and developmental therapy for children with autism and developmental delays.'}
            </p>

            {/* Value checklist bullets with glassy containers */}
            <div className="space-y-3 pt-2 text-sm sm:text-base text-slate-800 dark:text-slate-100 font-medium">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 dark:bg-white/[0.06] backdrop-blur-md border border-slate-200/90 dark:border-white/15 shadow-xs transition-all">
                <span className="w-6 h-6 rounded-xl bg-sky-500/20 text-sky-600 dark:text-[#00E5BE] border border-sky-400/40 dark:border-[#00E5BE]/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </span>
                <span>
                  {isArabic 
                    ? 'تشخيص وتقييم مبني على أساس علمي بشكل فردي لكل مستفيد' 
                    : 'Individualized scientific diagnosis and comprehensive developmental assessment'}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 dark:bg-white/[0.06] backdrop-blur-md border border-slate-200/90 dark:border-white/15 shadow-xs transition-all">
                <span className="w-6 h-6 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-[#10B981] border border-emerald-400/40 dark:border-[#10B981]/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </span>
                <span>
                  {isArabic 
                    ? 'برامج تدخل مبني على تحليل السلوك التطبيقي (ABA)' 
                    : 'Intensive Applied Behavior Analysis (ABA) early intervention programs'}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 dark:bg-white/[0.06] backdrop-blur-md border border-slate-200/90 dark:border-white/15 shadow-xs transition-all">
                <span className="w-6 h-6 rounded-xl bg-amber-500/20 text-amber-600 dark:text-[#F59E0B] border border-amber-400/40 dark:border-amber-400/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </span>
                <span>
                  {isArabic 
                    ? 'دعم نفسي وإرشاد أسري مستمر لتمكين أولياء الأمور' 
                    : 'Continuous parental counseling and dedicated family empowerment sessions'}
                </span>
              </div>
            </div>

            {/* Action Buttons: "سجل الآن" + "شاهد فيديو تعريفي" */}
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-5 pt-3 sm:pt-4">
              {/* Button 1: سجل الآن */}
              <button
                id="hero-register-btn"
                onClick={onOpenBooking}
                className="relative group overflow-hidden bg-gradient-to-r from-[#0B3B36] via-[#0E544C] to-[#00897B] hover:from-[#062420] hover:to-[#00a896] dark:from-[#00E5BE] dark:via-[#00c9a7] dark:to-[#0284C7] text-white dark:text-slate-950 font-black px-6 sm:px-8 py-3.5 rounded-2xl border border-white/30 shadow-[0_10px_30px_rgba(11,59,54,0.35)] dark:shadow-[0_10px_30px_rgba(0,229,190,0.35)] hover:shadow-xl active:scale-95 transition-all text-sm sm:text-base text-center justify-center flex items-center cursor-pointer"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                <span className="relative z-10">{isArabic ? 'سجل الآن' : 'Register Now'}</span>
              </button>

              {/* Button 2: شاهد فيديو تعريفي */}
              <a
                id="hero-watch-video-btn"
                href="https://x.com/rabacenter/status/1352206247299321858?s=46"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 text-slate-800 dark:text-white hover:text-sky-600 dark:hover:text-[#00E5BE] font-bold transition-all group cursor-pointer text-sm sm:text-base py-2"
                title={isArabic ? 'شاهد فيديو تعريفي عن مركز رابا على منصة X' : 'Watch introductory video on X (Twitter)'}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 dark:bg-white/[0.12] hover:bg-white dark:hover:bg-white/[0.22] backdrop-blur-xl text-slate-900 dark:text-white border border-slate-200 dark:border-white/30 flex items-center justify-center shadow-lg shadow-sky-500/10 group-hover:scale-110 active:scale-95 transition-transform shrink-0">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
                </div>
                <span>{isArabic ? 'شاهد فيديو تعريفي' : 'Watch Video'}</span>
              </a>
            </div>

          </div>

          {/* Left Column: Visual Presentation with Images-Only Slider Circle */}
          <div className="lg:col-span-6 relative flex items-center justify-center mt-6 lg:mt-0">
            
            {/* Main Outer Frosted Glowing Glass Circle Backdrop */}
            <div 
              id="hero-specialists-slider"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative w-[280px] h-[280px] xs:w-[320px] xs:h-[320px] sm:w-[420px] sm:h-[420px] md:w-[460px] md:h-[460px] rounded-full bg-gradient-to-tr from-[#0284C7]/40 via-[#00E5BE]/25 to-sky-400/20 backdrop-blur-2xl border-4 border-white/60 dark:border-white/30 flex items-center justify-center shadow-[0_20px_60px_rgba(2,132,199,0.3)] group p-1 sm:p-1.5"
            >
              
              {/* Inner Circular Frame: Pure Images Only (No Text, No Dark Overlay) */}
              <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center shadow-inner">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={currentSlide.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.04 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={getResolvedImageUrl(currentSlide.src)}
                      alt={currentSlide.alt}
                      onError={(e) => handleImageErrorWithStore(e, currentSlide.src, '/specialists/ahmed_abouzeid.jpg')}
                      className={`w-full h-full object-cover transition-transform duration-300 ${
                        currentSlide.objectPosition === 'center'
                          ? 'object-center'
                          : currentSlide.objectPosition === 'bottom'
                          ? 'object-bottom'
                          : 'object-top'
                      }`}
                      style={{
                        transform: `scale(${(currentSlide.zoomLevel || 100) / 100})`
                      }}
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slider Navigation Arrows */}
              {/* Previous Button */}
              {slides.length > 1 && (
                <button
                  id="hero-slider-prev-btn"
                  onClick={handlePrev}
                  aria-label={isArabic ? 'الصورة السابقة' : 'Previous photo'}
                  className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/95 dark:bg-slate-900/95 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-white border border-slate-200/90 dark:border-white/25 shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
                >
                  <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                </button>
              )}

              {/* Next Button */}
              {slides.length > 1 && (
                <button
                  id="hero-slider-next-btn"
                  onClick={handleNext}
                  aria-label={isArabic ? 'الصورة التالية' : 'Next photo'}
                  className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/95 dark:bg-slate-900/95 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-white border border-slate-200/90 dark:border-white/25 shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                </button>
              )}

              {/* Floating Badge 1 (Top-Left Corner): عداد أطفال جدد يومياً (+10 أطفال من 8 ص إلى 6 م) */}
              {config.showBadges && (
                <>
                  <a 
                    href="#stats-bar"
                    className="absolute -top-2 -left-2 sm:-left-12 z-30 bg-emerald-600/90 dark:bg-emerald-500/80 backdrop-blur-xl text-white px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-xl flex items-center gap-2 sm:gap-2.5 border border-emerald-300/40 animate-bounce-subtle cursor-pointer hover:scale-105 transition-transform"
                    title={isArabic ? `مزامنة مباشرة: +${dailyChildrenCount} أطفال جدد اليوم (من إجمالي ${formattedTotal}+ مستفيد) — انقر للتفاصيل` : `Live sync: +${dailyChildrenCount} enrolled today (out of ${formattedTotal}+ total)`}
                  >
                    <div className="flex -space-x-2 -space-x-reverse overflow-hidden items-center">
                      {/* Counter Badge Circle */}
                      <div className="min-w-6 h-6 sm:min-w-7 sm:h-7 px-1 rounded-full border-2 border-white bg-amber-400 flex items-center justify-center text-[9px] sm:text-[10px] font-black text-slate-900 shadow-xs z-10 transition-transform">
                        +{dailyChildrenCount}
                      </div>
                      <img className="inline-block h-6 w-6 sm:h-7 sm:w-7 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="child" />
                      <img className="inline-block h-6 w-6 sm:h-7 sm:w-7 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="child" />
                    </div>

                    <div className="flex flex-col items-start leading-tight">
                      <span className="text-[11px] sm:text-xs font-black flex items-center gap-1.5">
                        <span>{isArabic ? `+${dailyChildrenCount} أطفال جدد اليوم` : `+${dailyChildrenCount} Enrolled Today`}</span>
                        {isWithinHours && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping inline-block" title={isArabic ? 'تحديث مباشر' : 'Live update'} />
                        )}
                      </span>
                      <span className="text-[9px] text-emerald-100/90 font-bold tracking-tight">
                        {isArabic ? `إجمالي المستفيدين: ${formattedTotal}+` : `Total: ${formattedTotal}+`}
                      </span>
                    </div>
                  </a>

                  {/* Floating Notification Card (Bottom-Right Corner) */}
                  <div className={`absolute -bottom-5 -right-2 sm:-right-8 z-30 bg-white/95 dark:bg-[#0B1120]/90 backdrop-blur-2xl border border-slate-200 dark:border-white/20 rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-[0_16px_40px_rgba(0,0,0,0.25)] flex items-center gap-2.5 sm:gap-3 ${isArabic ? 'text-right' : 'text-left'} max-w-[230px] sm:max-w-[310px]`}>
                    {/* Yellow Envelope Badge */}
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md border border-amber-300">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {isArabic ? 'تم استلام طلبك' : 'Request Received'}
                        </span>
                        <span className="text-emerald-600 dark:text-[#00E5BE] text-xs">✔</span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 leading-tight mt-0.5">
                        {isArabic 
                          ? 'سيقوم فريق مركز رابا بالتواصل معك' 
                          : 'Our team will contact you shortly'}
                      </p>
                    </div>
                  </div>
                </>
              )}

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
