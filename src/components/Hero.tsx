import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Mail, 
  ChevronRight, 
  ChevronLeft
} from 'lucide-react';
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
  onOpenVideo,
  onBookSpecialist,
  onViewCv
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

  // Dynamic counter badge pulse reacting exclusively with the upper counter when dailyChildrenCount updates
  const [counterPulse, setCounterPulse] = useState(false);

  useEffect(() => {
    setCounterPulse(true);
    const t = setTimeout(() => setCounterPulse(false), 1200);
    return () => clearTimeout(t);
  }, [dailyChildrenCount]);

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
    if (slides.length > 0 && currentSlideIndex >= slides.length) {
      setCurrentSlideIndex(0);
    }
  }, [slides.length, currentSlideIndex]);

  const currentSlide: HeroSlideItem = slides[currentSlideIndex] || slides[0];

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

  // Smart image resolver: supports custom uploaded slides from admin panel while maintaining instant local fallbacks
  const getSlideDisplayImage = useCallback((slide: HeroSlideItem) => {
    if (!slide) return '/images/hero/slide_2_ahmed.jpg';
    if (slide.src) {
      if (slide.src.startsWith('data:') || slide.src.startsWith('blob:')) {
        return slide.src;
      }
      const resolved = getResolvedImageUrl(slide.src);
      if (resolved && resolved !== '' && !resolved.includes('undefined')) {
        return resolved;
      }
      if (slide.src.startsWith('/')) {
        return slide.src;
      }
    }
    const defaults: Record<string, string> = {
      'photo-1': '/images/hero/slide_1_haneen.png',
      'photo-2': '/images/hero/slide_2_ahmed.jpg',
      'photo-3': '/images/hero/slide_3_rahaf.png',
      'photo-4': '/images/hero/slide_4_doha.png',
      'photo-5': '/images/hero/slide_5_manar.png',
      'photo-6': '/images/hero/slide_6_fathi.png',
      'photo-7': '/images/hero/slide_7_specialist.png',
      'photo-8': '/images/hero/slide_8_specialist.png',
    };
    return defaults[slide.id] || slide.src || '/images/hero/slide_2_ahmed.jpg';
  }, []);

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
                      <span className="relative z-10 bg-gradient-to-r from-[#FFD23F] to-[#FFE066] text-slate-950 font-black px-4 py-0.5 sm:px-6 sm:py-1 rounded-xl shadow-lg border border-amber-300 transform -rotate-1 inline-block text-2xl sm:text-4xl lg:text-[44px]">
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
                      <span className="relative z-10 bg-gradient-to-r from-[#FFD23F] to-[#FFE066] text-slate-950 font-black px-4 py-0.5 sm:px-6 sm:py-1 rounded-xl shadow-lg border border-amber-300 transform -rotate-1 inline-block text-2xl sm:text-4xl lg:text-[44px]">
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

            {/* Value checklist bullets with Liquid Glass Kit containers */}
            <div className="space-y-3 pt-2 text-sm sm:text-base text-slate-800 dark:text-slate-100 font-medium">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl liquid-glass-card shadow-xs transition-all">
                <span className="w-7 h-7 rounded-xl bg-[#2E86EB]/15 text-[#2E86EB] border border-[#2E86EB]/30 flex items-center justify-center shrink-0 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </span>
                <span>
                  {isArabic 
                    ? 'تشخيص وتقييم مبني على أساس علمي بشكل فردي لكل مستفيد' 
                    : 'Individualized scientific diagnosis and comprehensive developmental assessment'}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl liquid-glass-card shadow-xs transition-all">
                <span className="w-7 h-7 rounded-xl bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 flex items-center justify-center shrink-0 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </span>
                <span>
                  {isArabic 
                    ? 'برامج تدخل مبني على تحليل السلوك التطبيقي (ABA)' 
                    : 'Intensive Applied Behavior Analysis (ABA) early intervention programs'}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl liquid-glass-card shadow-xs transition-all">
                <span className="w-7 h-7 rounded-xl bg-[#FFD23F]/20 text-amber-700 dark:text-[#FFD23F] border border-[#FFD23F]/40 flex items-center justify-center shrink-0 shadow-2xs">
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
                className="relative group overflow-hidden bg-gradient-to-r from-[#2E86EB] via-[#3B92F5] to-[#22C55E] hover:from-[#1D74D8] hover:to-[#16A34A] text-white font-black px-6 sm:px-8 py-3.5 rounded-2xl border-t border-white/60 border-x border-b border-white/20 shadow-[0_12px_32px_rgba(46,134,235,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:shadow-xl active:scale-95 transition-all text-sm sm:text-base text-center justify-center flex items-center cursor-pointer"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                <span className="relative z-10">{isArabic ? 'سجل الآن' : 'Register Now'}</span>
              </button>

              {/* Button 2: شاهد فيديو تعريفي */}
              <a
                id="hero-watch-video-btn"
                href="https://x.com/rabacenter/status/1352206247299321858?s=46"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 text-slate-800 dark:text-white hover:text-[#2E86EB] dark:hover:text-[#2E86EB] font-bold transition-all group cursor-pointer text-sm sm:text-base py-2"
                title={isArabic ? 'شاهد فيديو تعريفي عن مركز رابا على منصة X' : 'Watch introductory video on X (Twitter)'}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full liquid-glass-btn text-slate-900 dark:text-white flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-transform shrink-0">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5 text-[#2E86EB]" />
                </div>
                <span>{isArabic ? 'شاهد فيديو تعريفي' : 'Watch Video'}</span>
              </a>
            </div>

          </div>

          {/* Left Column: Visual Presentation with Creative Liquid Glass Circular Showcase */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center mt-4 lg:mt-0 w-full select-none">
            
            {/* Unified Responsive Badges Row Above the Circle (Consistent across Mobile, Tablet & Desktop) */}
            {config.showBadges && (
              <div className="flex items-center justify-between gap-2 w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[380px] lg:max-w-[440px] xl:max-w-[460px] mb-3.5 sm:mb-4 z-20">
                {/* Live Daily Children Counter Pill */}
                <a 
                  href="#stats-bar"
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-[#22C55E] text-white text-[11px] sm:text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-400/40"
                  title={isArabic ? `+${dailyChildrenCount} أطفال جدد اليوم (إجمالي المستفيدين: ${formattedTotal}+)` : `+${dailyChildrenCount} Enrolled Today`}
                >
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FFD23F] text-slate-950 flex items-center justify-center text-[9px] sm:text-[10px] font-black shrink-0 shadow-xs">
                    +{dailyChildrenCount}
                  </span>
                  <span className="whitespace-nowrap font-black">
                    {isArabic ? `+${dailyChildrenCount} أطفال جدد` : `+${dailyChildrenCount} Today`}
                  </span>
                  {isWithinHours && (
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-ping shrink-0" />
                  )}
                </a>

                {/* Instant Booking Notice Pill */}
                <button 
                  onClick={onOpenBooking}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full liquid-glass-btn bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white text-[11px] sm:text-xs font-bold shadow-md border border-slate-200 dark:border-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
                  title={isArabic ? 'انقر لتقديم طلب تسجيل جديد' : 'Click to register'}
                >
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2E86EB] shrink-0" />
                  <span className="whitespace-nowrap">{isArabic ? 'حجز فوري' : 'Quick Booking'}</span>
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0 animate-pulse" />
                </button>
              </div>
            )}

            {/* The Main Circular Showcase Stage - 100% Unobstructed across all viewports */}
            <div 
              id="hero-services-slider"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative w-[280px] h-[280px] xs:w-[320px] xs:h-[320px] sm:w-[380px] sm:h-[380px] lg:w-[440px] lg:h-[440px] xl:w-[460px] xl:h-[460px] rounded-full p-2 sm:p-2.5 bg-gradient-to-tr from-[#2E86EB] via-[#FFD23F] via-[#FF2D9B] to-[#22C55E] shadow-[0_20px_50px_rgba(46,134,235,0.35),0_0_30px_rgba(0,229,190,0.2)] group select-none transition-all duration-300 shrink-0 aspect-square"
            >
              {/* Luminous Brand Aura Behind Circle */}
              <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-tr from-[#2E86EB]/30 via-[#FF2D9B]/15 to-[#FFD23F]/25 rounded-full blur-2xl -z-10 pointer-events-none transition-opacity duration-700 opacity-80 group-hover:opacity-100" />

              {/* Inner Circular Stage Window - Locked to full circle frame to prevent flexbox collapse */}
              <div className="absolute inset-2 sm:inset-2.5 rounded-full overflow-hidden bg-slate-900 border border-white/60 dark:border-white/10 shadow-inner">
                
                {/* Background Soft Spotlight Radial Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(46,134,235,0.25)_0%,rgba(0,229,190,0.1)_50%,transparent_75%)] pointer-events-none z-0" />

                {/* Specialist Image Directly Rendered Inside Circular Stage (Pure CSS Cross-Fade for 100% Reliability) */}
                <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden z-10">
                  {slides.map((s, idx) => {
                    const isActive = idx === currentSlideIndex;
                    const isNext = idx === (currentSlideIndex + 1) % slides.length;
                    // Only mount the active slide and adjacent prefetch slide to avoid loading 8 heavy images at once on mobile
                    if (!isActive && !isNext) return null;

                    return (
                      <div
                        key={s.id || idx}
                        className={`absolute inset-0 w-full h-full rounded-full overflow-hidden transition-opacity duration-500 ease-in-out ${
                          isActive ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
                        }`}
                      >
                        <img
                          src={getSlideDisplayImage(s)}
                          alt={s.alt}
                          width={460}
                          height={460}
                          loading={isActive && currentSlideIndex === 0 ? "eager" : "lazy"}
                          fetchPriority={isActive && currentSlideIndex === 0 ? "high" : "auto"}
                          decoding="async"
                          onError={(e) => handleImageErrorWithStore(e, s.src, '/images/hero/slide_2_ahmed.jpg')}
                          className={`w-full h-full object-cover rounded-full transition-transform duration-700 ease-out group-hover:scale-105 ${
                            s.objectPosition === 'center'
                              ? 'object-center'
                              : s.objectPosition === 'bottom'
                              ? 'object-bottom'
                              : 'object-[center_12%]'
                          }`}
                          style={{
                            transform: `scale(${(s.zoomLevel || 100) / 100})`
                          }}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Minimal Elegant Slide Pagination Dots at the Bottom Arc */}
                {slides.length > 1 && (
                  <div className="absolute bottom-3.5 sm:bottom-4 inset-x-0 z-20 flex justify-center items-center pointer-events-auto">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 shadow-lg">
                      {slides.map((s, idx) => (
                        <button
                          key={s.id || idx}
                          onClick={() => setCurrentSlideIndex(idx)}
                          aria-label={isArabic ? `شريحة ${idx + 1}` : `Slide ${idx + 1}`}
                          className={`transition-all duration-300 rounded-full cursor-pointer ${
                            idx === currentSlideIndex
                              ? 'w-5 h-1.5 bg-gradient-to-r from-[#2E86EB] via-[#FFD23F] to-[#22C55E] shadow-sm'
                              : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Navigation Chevron Buttons */}
              {slides.length > 1 && (
                <>
                  {/* Previous Button (Right side in RTL) */}
                  <button
                    id="hero-slider-prev-btn"
                    onClick={handlePrev}
                    aria-label={isArabic ? 'الصورة السابقة' : 'Previous photo'}
                    className="absolute -right-3 sm:-right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full liquid-glass-btn bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white border border-white/60 dark:border-white/20 shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Next Button (Left side in RTL) */}
                  <button
                    id="hero-slider-next-btn"
                    onClick={handleNext}
                    aria-label={isArabic ? 'الصورة التالية' : 'Next photo'}
                    className="absolute -left-3 sm:-left-4 lg:-left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full liquid-glass-btn bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white border border-white/60 dark:border-white/20 shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Accent Star (from unified mobile/desktop design in Screenshot 2) */}
            <div className="mt-3.5 sm:mt-4 flex items-center justify-center text-[#FFD23F] drop-shadow-[0_0_12px_rgba(255,210,63,0.6)] animate-pulse select-none pointer-events-none">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
