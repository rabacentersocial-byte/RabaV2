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

  // Auto-play timer: initial 10-second stabilization delay ensures Slide 1 locks as rock-solid LCP element
  useEffect(() => {
    if (!config.autoplay || isPaused || slides.length <= 1) return;
    const intervalMs = Math.max(3, config.intervalSeconds || 5) * 1000;

    let intervalId: any = null;
    const initialDelay = setTimeout(() => {
      handleNext();
      intervalId = setInterval(() => {
        handleNext();
      }, intervalMs);
    }, 10000);

    return () => {
      clearTimeout(initialDelay);
      if (intervalId) clearInterval(intervalId);
    };
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
    if (!slide) return '/images/hero/card_1_journey.webp';
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
      'card-1-journey': '/images/hero/card_1_journey.webp',
      'card-2-assessment': '/images/hero/card_2_assessment.webp',
      'card-3-services': '/images/hero/card_3_services.webp',
      'card-4-inclusion': '/images/hero/card_4_inclusion.webp',
      'card-5-club': '/images/hero/card_5_club.webp',
      'card-6-academy': '/images/hero/card_6_academy.webp',
      'card-7-offer': '/images/hero/card_7_offer.webp',
      'service-aba': '/images/hero/card_1_journey.webp',
      'offer-national-day': '/images/hero/card_7_offer.webp',
      'service-sensory': '/images/hero/card_3_services.webp',
      'service-speech': '/images/hero/card_3_services.webp'
    };
    return defaults[slide.id] || slide.src || '/images/hero/card_1_journey.webp';
  }, []);

  return (
    <section 
      id="hero" 
      className="relative pt-6 pb-12 md:pt-16 md:pb-28 overflow-hidden border-b border-[#161B26]/[0.08] dark:border-white/[0.08]"
    >
      {/* Background Decorative Stars */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[#2B95FF] opacity-65 select-none pointer-events-none">
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-12 text-[#F59E0B] opacity-75 select-none pointer-events-none">
        <svg viewBox="0 0 24 24" className="w-9 h-9 fill-current">
          <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Hero Copy Column */}
          <div className={`lg:col-span-6 space-y-5 sm:space-y-6 ${isArabic ? 'text-right' : 'text-left'}`}>
            
            {/* Main Headline with Highlighted ABA */}
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black leading-[1.25] tracking-tight text-[#161B26] dark:text-[#F8FAFC] drop-shadow-xs">
              {isArabic ? (
                <>
                  مركز رابا للعلاج بتحليل <br />
                  <span className="inline-block mt-2">
                    السلوك التطبيقي{' '}
                    <span className="relative inline-block mx-1">
                      <span className="relative z-10 bg-gradient-to-r from-[#1668DC] to-[#1152B8] text-white font-black px-4 py-0.5 sm:px-6 sm:py-1 rounded-2xl shadow-lg border border-white/30 transform -rotate-1 inline-block text-2xl sm:text-4xl lg:text-[44px]">
                        ABA
                      </span>
                      <span className="absolute -inset-1 bg-[#2B95FF]/30 blur-md rounded-2xl" />
                    </span>
                  </span>
                </>
              ) : (
                <>
                  RABA Center for Applied <br />
                  <span className="inline-block mt-2">
                    Behavior Analysis{' '}
                    <span className="relative inline-block mx-1">
                      <span className="relative z-10 bg-gradient-to-r from-[#1668DC] to-[#1152B8] text-white font-black px-4 py-0.5 sm:px-6 sm:py-1 rounded-2xl shadow-lg border border-white/30 transform -rotate-1 inline-block text-2xl sm:text-4xl lg:text-[44px]">
                        ABA
                      </span>
                      <span className="absolute -inset-1 bg-[#2B95FF]/30 blur-md rounded-2xl" />
                    </span>
                  </span>
                </>
              )}
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-[#4B5563] dark:text-[#94A3B8] leading-relaxed font-normal max-w-xl">
              {isArabic 
                ? 'يعد مركز رابا من أقدم المراكز التي تقدم خدمات التأهيل والدعم لذوي الإحتياجات الخاصة، وفق المعايير العالمية المعتمدة.'
                : 'Raba Center is among the foremost certified institutions delivering evidence-based rehabilitation and developmental therapy for children with autism and developmental delays.'}
            </p>

            {/* Value checklist bullets with Frosted Glass containers */}
            <div className="space-y-3 pt-2 text-sm sm:text-base text-[#161B26] dark:text-[#F8FAFC] font-medium">
              <div className="flex items-center gap-3 p-3.5 rounded-[28px] liquid-glass-card transition-colors duration-200">
                <span className="w-8 h-8 rounded-full bg-[#2B95FF]/15 text-[#1263D6] dark:text-[#60AFFF] border border-[#2B95FF]/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </span>
                <span>
                  {isArabic 
                    ? 'تشخيص وتقييم مبني على أساس علمي بشكل فردي لكل مستفيد' 
                    : 'Individualized scientific diagnosis and comprehensive developmental assessment'}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-[28px] liquid-glass-card transition-colors duration-200">
                <span className="w-8 h-8 rounded-full bg-[#10B981]/15 text-[#047857] dark:text-[#34D399] border border-[#10B981]/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </span>
                <span>
                  {isArabic 
                    ? 'برامج تدخل مبني على تحليل السلوك التطبيقي (ABA)' 
                    : 'Intensive Applied Behavior Analysis (ABA) early intervention programs'}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-[28px] liquid-glass-card transition-colors duration-200">
                <span className="w-8 h-8 rounded-full bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA] border border-[#8B5CF6]/30 flex items-center justify-center shrink-0">
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
                aria-label={isArabic ? 'سجل الآن في برامج التأهيل والتطوير بمركز رابا' : 'Register now for rehabilitation programs at Raba Center'}
                className="relative group overflow-hidden bg-gradient-to-r from-[#1668DC] to-[#1152B8] hover:brightness-110 text-white font-black px-7 sm:px-9 py-3.5 min-h-[48px] rounded-full border border-white/25 dark:border-[#60AFFF]/30 shadow-[0_14px_32px_-10px_rgba(22,104,220,0.42)] hover:shadow-xl active:scale-95 transition-all duration-200 text-sm sm:text-base text-center justify-center flex items-center cursor-pointer"
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
                aria-label={isArabic ? 'شاهد فيديو تعريفي عن مركز رابا على منصة إكس' : 'Watch introductory video on X (Twitter)'}
                className="flex items-center justify-center gap-3 text-[#161B26] dark:text-[#F8FAFC] hover:text-[#1263D6] dark:hover:text-[#60AFFF] font-bold transition-colors duration-200 group cursor-pointer text-sm sm:text-base py-2 min-h-[48px]"
                title={isArabic ? 'شاهد فيديو تعريفي عن مركز رابا على منصة X' : 'Watch introductory video on X (Twitter)'}
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full liquid-glass-btn text-[#161B26] dark:text-[#F8FAFC] flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-transform shrink-0">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5 text-[#2B95FF]" />
                </div>
                <span>{isArabic ? 'شاهد فيديو تعريفي' : 'Watch Video'}</span>
              </a>
            </div>

          </div>

          {/* Left Column: Visual Presentation with Circular Showcase */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center mt-4 lg:mt-0 w-full select-none min-h-[380px] lg:min-h-[460px]">
            
            {/* Unified Responsive Badges Row Above the Circle */}
            {config.showBadges && (
              <div className="flex items-center justify-between gap-2 w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[380px] lg:max-w-[440px] xl:max-w-[460px] h-9 min-h-[36px] mb-3.5 sm:mb-4 z-20">
                {/* Live Daily Children Counter Pill */}
                <a 
                  href="#stats-bar"
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full liquid-glass-pill text-[#161B26] dark:bg-[#161E2E] dark:text-[#F8FAFC] text-[11px] sm:text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer border border-[#161B26]/10 dark:border-white/15"
                  title={isArabic ? `+${dailyChildrenCount} أطفال جدد اليوم (إجمالي المستفيدين: ${formattedTotal}+)` : `+${dailyChildrenCount} Enrolled Today`}
                >
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-[#1668DC] to-[#1152B8] text-white flex items-center justify-center text-[9px] sm:text-[10px] font-black shrink-0 shadow-xs">
                    +{dailyChildrenCount}
                  </span>
                  <span className="whitespace-nowrap font-black">
                    {isArabic ? `+${dailyChildrenCount} أطفال جدد` : `+${dailyChildrenCount} Today`}
                  </span>
                  {isWithinHours && (
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#10B981] shrink-0 opacity-90 shadow-xs" />
                  )}
                </a>

                {/* Instant Booking Notice Pill */}
                <button 
                  onClick={onOpenBooking}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full liquid-glass-pill text-[#161B26] dark:text-[#F8FAFC] text-[11px] sm:text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer"
                  title={isArabic ? 'انقر لتقديم طلب تسجيل جديد' : 'Click to register'}
                >
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2B95FF] shrink-0" />
                  <span className="whitespace-nowrap">{isArabic ? 'حجز فوري' : 'Quick Booking'}</span>
                  <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0 will-change-opacity transform-gpu" />
                </button>
              </div>
            )}

            {/* The Main Circular Showcase Stage */}
            <div 
              id="hero-services-slider"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative w-[280px] h-[280px] xs:w-[320px] xs:h-[320px] sm:w-[380px] sm:h-[380px] lg:w-[440px] lg:h-[440px] xl:w-[460px] xl:h-[460px] rounded-full p-2 sm:p-2.5 bg-gradient-to-tr from-[#2B95FF] via-[#8B5CF6] to-[#10B981] shadow-[0_24px_55px_-15px_rgba(43,149,255,0.28)] group select-none transition-transform duration-300 shrink-0 aspect-square"
              style={{ aspectRatio: '1 / 1' }}
            >
              {/* Luminous Warm Aura Behind Circle */}
              <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-tr from-[#2B95FF]/28 via-[#10B981]/20 to-[#8B5CF6]/24 rounded-full blur-2xl -z-10 pointer-events-none transition-opacity duration-700 opacity-80 group-hover:opacity-100" />

              {/* Inner Circular Stage Window */}
              <div className="absolute inset-2 sm:inset-2.5 rounded-full overflow-hidden bg-[#E8F3FF] dark:bg-[#141821] border border-white/70 dark:border-white/15 shadow-inner">
                
                {/* Background Soft Spotlight Radial Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(43,149,255,0.22)_0%,rgba(16,185,129,0.12)_50%,transparent_75%)] pointer-events-none z-0" />

                {/* Specialist Image Directly Rendered Inside Circular Stage */}
                <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden z-10">
                  {slides.map((s, idx) => {
                    const isActive = idx === currentSlideIndex;
                    if (!isActive) return null;

                    const isLcpCandidate = idx === 0;

                    return (
                      <div
                        key={s.id || idx}
                        data-slide-active={isActive ? "true" : "false"}
                        className={`absolute inset-0 w-full h-full rounded-full overflow-hidden ${
                          isActive ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
                        }`}
                        style={{
                          opacity: 1,
                          visibility: 'visible'
                        }}
                      >
                        <img
                          src={getSlideDisplayImage(s)}
                          alt={s.alt || 'مركز رابا للعلاج بتحليل السلوك التطبيقي ABA'}
                          width={460}
                          height={460}
                          sizes="(max-width: 479px) 280px, (max-width: 639px) 320px, (max-width: 1023px) 380px, (max-width: 1279px) 440px, 460px"
                          loading={isLcpCandidate ? undefined : 'lazy'}
                          fetchPriority={isLcpCandidate ? 'high' : 'auto'}
                          decoding="async"
                          onError={(e) => handleImageErrorWithStore(e, s.src, '/images/hero/card_1_journey.webp')}
                          className={`w-full h-full object-cover rounded-full ${
                            s.objectPosition === 'center'
                              ? 'object-center'
                              : s.objectPosition === 'bottom'
                              ? 'object-bottom'
                              : 'object-[center_12%]'
                          }`}
                          style={{
                            aspectRatio: '1 / 1',
                            transform: `scale(${(s.zoomLevel || 100) / 100})`
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Navigation Chevron Buttons */}
              {slides.length > 1 && (
                <>
                  <button
                    id="hero-slider-prev-btn"
                    onClick={handlePrev}
                    aria-label={isArabic ? 'الشريحة السابقة في المعرض الدائري' : 'Previous slide in carousel'}
                    className="absolute -right-3 sm:-right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 min-w-[48px] min-h-[48px] rounded-full liquid-glass-btn text-[#161B26] dark:text-[#F8FAFC] shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <button
                    id="hero-slider-next-btn"
                    onClick={handleNext}
                    aria-label={isArabic ? 'الشريحة التالية في المعرض الدائري' : 'Next slide in carousel'}
                    className="absolute -left-3 sm:-left-4 lg:-left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 min-w-[48px] min-h-[48px] rounded-full liquid-glass-btn text-[#161B26] dark:text-[#F8FAFC] shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Accent Star */}
            <div className="mt-3.5 sm:mt-4 flex items-center justify-center text-[#10B981] drop-shadow-[0_0_12px_rgba(16,185,129,0.45)] select-none pointer-events-none opacity-90">
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
