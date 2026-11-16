import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Puzzle, 
  Hand, 
  Brain, 
  Heart, 
  Calendar, 
  Users, 
  Check, 
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Award,
  Phone,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { getStoredServices } from '../data/mockData';
import { ServiceItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const { isArabic } = useLanguage();
  const [services, setServices] = useState<ServiceItem[]>(() => getStoredServices());
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  
  // Slider drag & scroll states
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const movedDistanceRef = useRef(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sync with localStorage updates from Admin Dashboard
  useEffect(() => {
    const handleUpdate = () => {
      setServices(getStoredServices());
    };
    window.addEventListener('raba_services_updated', handleUpdate);
    window.addEventListener('raba_persistent_sync_ready', handleUpdate);
    return () => {
      window.removeEventListener('raba_services_updated', handleUpdate);
      window.removeEventListener('raba_persistent_sync_ready', handleUpdate);
    };
  }, []);

  // Filter categories
  const categories = [
    { id: 'all', labelAr: 'كافة الخدمات التخصصية (6)', labelEn: 'All Specialized Services (6)' },
    { id: 'aba', labelAr: 'تحليل السلوك التطبيقي ABA', labelEn: 'ABA Therapy' },
    { id: 'speech', labelAr: 'النطق والتخاطب', labelEn: 'Speech & Language' },
    { id: 'occupational', labelAr: 'العلاج الوظيفي', labelEn: 'Occupational Therapy' },
    { id: 'sensory', labelAr: 'التكامل الحسي', labelEn: 'Sensory Integration' },
    { id: 'learning', labelAr: 'صعوبات التعلم وحل الواجبات', labelEn: 'Learning Support' },
    { id: 'psychological', labelAr: 'التشخيص والعلاج النفسي', labelEn: 'Psychological Care' },
  ];

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter((s) => s.category === activeCategory);

  // Custom vector icons precisely matching the attached flyer
  const renderFlyerIcon = (id: string) => {
    switch (id) {
      case 'srv-aba':
        // Yellow puzzle piece
        return <Puzzle className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[2.2]" />;
      case 'srv-speech':
        // Green speech bubbles with 000
        return (
          <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            <circle cx="8.5" cy="12" r="1.1" fill="currentColor" />
            <circle cx="12" cy="12" r="1.1" fill="currentColor" />
            <circle cx="15.5" cy="12" r="1.1" fill="currentColor" />
          </svg>
        );
      case 'srv-occupational':
        // Azure blue open hand
        return <Hand className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[2.2]" />;
      case 'srv-sensory':
        // Lime green brain
        return <Brain className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[2.2]" />;
      case 'srv-learning-difficulties':
        // Navy blue book and pencil
        return (
          <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h8" />
            <path d="M6 10h8" />
            <path d="M6 14h5" />
            <path d="m18 11 2.5 2.5-5 5h-2.5v-2.5l5-5z" fill="currentColor" fillOpacity="0.25" />
          </svg>
        );
      case 'srv-psychological':
        // Magenta head silhouette with heart
        return (
          <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a7.5 7.5 0 0 0-7.5 7.5c0 2.8 1.5 5.3 3.8 6.5.3.6.6 1.4 1 2V22h5.4v-4c.4-.6.7-1.4 1-2 2.3-1.2 3.8-3.7 3.8-6.5A7.5 7.5 0 0 0 12 2Z" />
            <path d="M12 8.2c-.8-1-2.2-.8-2.6.3-.5 1.2.7 2.2 2.6 3.5 1.9-1.3 3.1-2.3 2.6-3.5-.4-1.1-1.8-1.3-2.6-.3Z" fill="currentColor" />
          </svg>
        );
      default:
        return <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[2.2]" />;
    }
  };

  // Color styling matching the exact colors in the flyer
  const getServiceVisuals = (id: string) => {
    switch (id) {
      case 'srv-aba':
        return {
          colorClass: 'bg-[#1463D6]',
          colorClassHover: 'hover:border-[#2B95FF]/50',
          accentBorder: 'border-[#2B95FF]/20',
          lightBg: 'bg-[#2B95FF]/10 dark:bg-[#2B95FF]/15',
          textAccent: 'text-[#1263D6] dark:text-[#60AFFF]',
          badgeText: isArabic ? 'تحليل السلوك التطبيقي' : 'ABA Program',
          flyerText: 'تنمية المهارات وتعزيز السلوك الإيجابي والاستقلالية',
        };
      case 'srv-speech':
        return {
          colorClass: 'bg-[#047857]',
          colorClassHover: 'hover:border-[#10B981]/50',
          accentBorder: 'border-[#10B981]/20',
          lightBg: 'bg-[#10B981]/10 dark:bg-[#10B981]/15',
          textAccent: 'text-[#047857] dark:text-[#34D399]',
          badgeText: isArabic ? 'النطق والتخاطب' : 'Speech & Language',
          flyerText: 'تطوير مهارات اللغة والنطق والتواصل',
        };
      case 'srv-occupational':
        return {
          colorClass: 'bg-[#6D28D9]',
          colorClassHover: 'hover:border-[#8B5CF6]/50',
          accentBorder: 'border-[#8B5CF6]/20',
          lightBg: 'bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/15',
          textAccent: 'text-[#6D28D9] dark:text-[#A78BFA]',
          badgeText: isArabic ? 'العلاج الوظيفي' : 'Occupational Therapy',
          flyerText: 'تنمية المهارات الحركية والإدراكية ومهارات الحياة اليومية',
        };
      case 'srv-sensory':
        return {
          colorClass: 'bg-[#B45309]',
          colorClassHover: 'hover:border-[#F59E0B]/50',
          accentBorder: 'border-[#F59E0B]/25',
          lightBg: 'bg-[#F59E0B]/12 dark:bg-[#F59E0B]/15',
          textAccent: 'text-[#B45309] dark:text-[#FBBF24]',
          badgeText: isArabic ? 'التكامل الحسي' : 'Sensory Integration',
          flyerText: 'دعم تنظيم ومعالجة الاستجابات الحسية',
        };
      case 'srv-learning-difficulties':
        return {
          colorClass: 'bg-[#1463D6] text-white',
          colorClassHover: 'hover:border-[#2B95FF]/50',
          accentBorder: 'border-[#2B95FF]/20 dark:border-white/15',
          lightBg: 'bg-[#2B95FF]/10 dark:bg-white/[0.06]',
          textAccent: 'text-[#1263D6] dark:text-[#60AFFF]',
          badgeText: isArabic ? 'صعوبات التعلم والواجبات' : 'Learning Support',
          flyerText: 'تنمية المهارات الأكاديمية ودعم الطفل في أداء واجباته باستقلالية',
        };
      case 'srv-psychological':
        return {
          colorClass: 'bg-[#1463D6]',
          colorClassHover: 'hover:border-[#2B95FF]/50',
          accentBorder: 'border-[#2B95FF]/20',
          lightBg: 'bg-[#2B95FF]/10 dark:bg-[#2B95FF]/15',
          textAccent: 'text-[#1263D6] dark:text-[#60AFFF]',
          badgeText: isArabic ? 'التشخيص والعلاج النفسي' : 'Psychological Care',
          flyerText: 'تقييم وتشخيص وتدخلات نفسية وفق احتياج كل حالة',
        };
      default:
        return {
          colorClass: 'bg-[#1463D6] text-white',
          colorClassHover: 'hover:border-[#2B95FF]/50',
          accentBorder: 'border-[#2B95FF]/20 dark:border-white/15',
          lightBg: 'bg-[#2B95FF]/10 dark:bg-white/[0.06]',
          textAccent: 'text-[#1263D6] dark:text-[#60AFFF]',
          badgeText: '',
          flyerText: '',
        };
    }
  };

  const rafIdRef = useRef<number | null>(null);
  const maxScrollRef = useRef(0);
  const containerOffsetLeftRef = useRef(0);

  // Scroll capability
  const updateScrollState = useCallback(() => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const el = sliderRef.current;
      if (!el) return;
      const maxScroll = maxScrollRef.current;
      const current = Math.abs(el.scrollLeft);
      setCanScrollPrev(current > 15);
      setCanScrollNext(current < maxScroll - 15);

      const cardWidth = 380;
      const index = Math.round(current / cardWidth);
      setCurrentIndex(Math.min(Math.max(0, index), Math.max(0, filteredServices.length - 1)));
    });
  }, [filteredServices.length]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const measure = () => {
      maxScrollRef.current = Math.max(0, el.scrollWidth - el.clientWidth);
      containerOffsetLeftRef.current = el.offsetLeft;
      updateScrollState();
    };

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (ro) {
      ro.observe(el);
    } else {
      window.addEventListener('resize', measure, { passive: true });
    }
    el.addEventListener('scroll', updateScrollState, { passive: true });
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      ro?.disconnect();
      window.removeEventListener('resize', measure);
      el.removeEventListener('scroll', updateScrollState);
    };
  }, [filteredServices, updateScrollState]);

  const handleScroll = (direction: 'prev' | 'next') => {
    const el = sliderRef.current;
    if (!el) return;
    const scrollAmount = 390;
    let delta = scrollAmount;
    if (direction === 'prev') {
      delta = -scrollAmount;
    }
    if (isArabic) {
      delta = -delta;
    }
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const scrollToIndex = (index: number) => {
    const el = sliderRef.current;
    if (!el) return;
    const slideWidth = 390;
    let target = index * slideWidth;
    if (isArabic) target = -target;
    el.scrollTo({ left: target, behavior: 'smooth' });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = sliderRef.current;
    if (!el) return;
    setIsDragging(true);
    containerOffsetLeftRef.current = el.offsetLeft;
    startXRef.current = e.pageX - containerOffsetLeftRef.current;
    scrollLeftRef.current = el.scrollLeft;
    movedDistanceRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerOffsetLeftRef.current;
    const walk = (x - startXRef.current) * 1.5;
    movedDistanceRef.current += Math.abs(walk);
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section 
      id="services" 
      className="py-16 sm:py-24 bg-transparent relative overflow-hidden transition-colors border-b border-[#161B26]/[0.06] dark:border-white/[0.08] [content-visibility:auto] [contain-intrinsic-size:1px_600px]"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(43,149,255,0.12)_0%,transparent_70%)] pointer-events-none transform-gpu -z-10" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_0%,transparent_70%)] pointer-events-none transform-gpu -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. SECTION HEADER: matching the attached flyer */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-3xl">
            
            {/* Eyebrow Pill: خدماتنا التأهيلية التخصصية */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-[#1263D6] dark:text-[#60AFFF] text-xs font-black mb-3 shadow-2xs">
              <Award className="w-3.5 h-3.5 text-[#2B95FF]" />
              <span>{isArabic ? 'خدماتنا التأهيلية التخصصية' : 'SPECIALIZED REHABILITATION SERVICES'}</span>
            </div>

            {/* Main Headline from flyer: "خدمات.. متكاملة لدعم رحلة طفلك" */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-block px-4 py-1.5 rounded-2xl bg-gradient-to-r from-[#1668DC] to-[#1152B8] text-white text-2xl sm:text-3xl lg:text-4xl font-black shadow-md border-t border-white/40">
                {isArabic ? 'خدمات.. متكاملة' : 'Integrated Services'}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#161B26] dark:text-[#F8FAFC] tracking-tight leading-tight">
                {isArabic ? 'لدعم رحلة طفلك' : 'to Support Your Child\'s Journey'}
              </h2>
            </div>

            {/* Slogan from flyer with curved smile accent */}
            <div className="flex items-center gap-2 pt-1">
              <div className="w-6 h-2 border-b-3 border-[#2B95FF] rounded-full shrink-0" />
              <p className="text-sm sm:text-base text-[#4B5563] dark:text-[#94A3B8] font-bold leading-relaxed">
                {isArabic 
                  ? 'نبدأ بالتقييم .. ونبني المسار وفق احتياج طفلك' 
                  : 'We start with assessment .. and build the pathway tailored to your child\'s needs'}
              </p>
            </div>
          </div>

          {/* Right Controls: Services Count & Slider Navigation Arrows */}
          <div className="flex items-center gap-3 self-end md:self-auto shrink-0 pt-2">
            {/* Services Count Badge */}
            <span className="text-xs sm:text-sm font-bold text-[#4B5563] dark:text-[#94A3B8]">
              {isArabic ? `${filteredServices.length} خدمات معتمدة` : `${filteredServices.length} Specialized Services`}
            </span>

            {/* Slider Navigation Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleScroll('prev')}
                disabled={!canScrollPrev}
                aria-label={isArabic ? 'الخدمة السابقة' : 'Previous program'}
                className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full liquid-glass-btn flex items-center justify-center shadow-xs transition-transform duration-200 cursor-pointer ${
                  canScrollPrev
                    ? 'hover:scale-105 active:scale-95 text-[#161B26] dark:text-[#F8FAFC]'
                    : 'opacity-40 cursor-not-allowed text-[#525B6B] dark:text-[#94A3B8]'
                }`}
              >
                {isArabic ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              <button
                onClick={() => handleScroll('next')}
                disabled={!canScrollNext}
                aria-label={isArabic ? 'الخدمة التالية' : 'Next program'}
                className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full liquid-glass-btn flex items-center justify-center shadow-xs transition-transform duration-200 cursor-pointer ${
                  canScrollNext
                    ? 'hover:scale-105 active:scale-95 text-[#161B26] dark:text-[#F8FAFC]'
                    : 'opacity-40 cursor-not-allowed text-[#525B6B] dark:text-[#94A3B8]'
                }`}
              >
                {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* 2. CATEGORY FILTER PILLS ROW */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8" style={{ WebkitOverflowScrolling: 'touch' }}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  if (sliderRef.current) {
                    sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                  }
                }}
                className={`px-4 py-2 min-h-[38px] rounded-full text-xs sm:text-sm whitespace-nowrap transition-colors duration-200 font-bold cursor-pointer ${
                  isActive
                    ? 'warm-pill-cta shadow-md'
                    : 'liquid-glass-pill hover:scale-[1.02]'
                }`}
              >
                {isArabic ? cat.labelAr : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* ================================================================= */}
        {/* 3. EXCLUSIVE SLIDER VIEW (CUSTOM ICONS ONLY, NO IMAGES, NO GRID)   */}
        {/* ================================================================= */}
        <div className="relative">
          <div
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-3 px-1 ${
              isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
            }`}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {filteredServices.map((service) => {
              const visual = getServiceVisuals(service.id);
              const isFav = !!favorites[service.id];

              return (
                <div
                  key={service.id}
                  className={`w-[78vw] min-w-[270px] max-w-[315px] sm:w-[350px] sm:max-w-none md:w-[365px] lg:w-[380px] shrink-0 snap-start liquid-glass-card rounded-[28px] overflow-hidden flex flex-col justify-between group ${visual.colorClassHover}`}
                >
                  {/* Top Slim Accent Strip */}
                  <div className={`h-1.5 sm:h-2 w-full ${visual.colorClass}`} />

                  {/* Header: Coordinated Custom Icon Container */}
                  <div className={`p-4 sm:p-6 pb-3.5 sm:pb-5 ${visual.lightBg} border-b ${visual.accentBorder} relative transition-colors`}>
                    {/* Top Row: Category Pill & Favorite Heart */}
                    <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-4">
                      <span className={`inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-black ${visual.colorClass} text-white shadow-xs`}>
                        {visual.badgeText || (isArabic ? service.categoryAr : service.categoryEn)}
                      </span>

                      <button
                        onClick={(e) => toggleFavorite(e, service.id)}
                        aria-label={isFav ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                        className="w-9 h-9 min-w-[36px] min-h-[36px] sm:w-10 sm:h-10 rounded-full bg-white/80 dark:bg-white/10 shadow-xs flex items-center justify-center text-[#4B5563] dark:text-[#94A3B8] hover:text-[#2B95FF] transition-colors cursor-pointer"
                      >
                        <Heart className={`w-4 h-4 transition-transform ${isFav ? 'fill-[#2B95FF] text-[#2B95FF] scale-110' : ''}`} />
                      </button>
                    </div>

                    {/* Prominent Custom Icon Box with Title */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl ${visual.colorClass} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0`}>
                        {renderFlyerIcon(service.id)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-xl font-black text-[#161B26] dark:text-[#F8FAFC] leading-tight group-hover:text-[#1263D6] dark:group-hover:text-[#60AFFF] transition-colors">
                          {isArabic ? service.title : (service.titleEn || service.title)}
                        </h3>
                        {service.titleEn && isArabic && (
                          <span className="text-[10px] sm:text-[11px] font-semibold text-[#4B5563] dark:text-[#94A3B8] block mt-0.5 truncate" dir="ltr">
                            {service.titleEn}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-6 pt-3.5 sm:pt-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                    <div className="space-y-2.5 sm:space-y-3.5">
                      {/* Clinical Purpose Highlight Box */}
                      <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl ${visual.lightBg} border ${visual.accentBorder}`}>
                        <p className={`text-[11px] sm:text-sm font-bold ${visual.textAccent} leading-relaxed`}>
                          {isArabic ? (visual.flyerText || service.description) : (service.descriptionEn || service.description)}
                        </p>
                      </div>

                      {/* Key Clinical Benefits Checklist */}
                      <div className="space-y-1.5 sm:space-y-2 pt-0.5">
                        <span className="text-[10px] sm:text-[11px] font-black text-[#4B5563] dark:text-[#94A3B8] block uppercase tracking-wider">
                          {isArabic ? 'أبرز مخرجات البرنامج:' : 'Key Outcomes:'}
                        </span>
                        {((isArabic ? service.benefits : (service.benefitsEn || service.benefits)) || []).slice(0, 3).map((benefit, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-[#4B5563] dark:text-[#94A3B8]">
                            <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5 stroke-[2.5]" />
                            <span className="line-clamp-2 leading-relaxed">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metadata & Direct Booking Button */}
                    <div className="pt-3 sm:pt-4 border-t border-[#161B26]/[0.08] dark:border-white/[0.08] space-y-2.5 sm:space-y-3">
                      <div className="flex items-center text-[11px] sm:text-xs font-semibold text-[#4B5563] dark:text-[#94A3B8]">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2B95FF] shrink-0" />
                          <span className="truncate">{isArabic ? service.targetAges : (service.targetAgesEn || service.targetAges)}</span>
                        </span>
                      </div>

                      <button
                        id={`book-slider-service-${service.id}`}
                        onClick={() => onSelectService(service)}
                        className="w-full py-2.5 sm:py-3.5 px-3 sm:px-4 warm-pill-cta rounded-full font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 group/btn"
                      >
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white transition-colors" />
                        <span>{isArabic ? 'احجز تقييم البرنامج' : 'Book Evaluation Session'}</span>
                        {isArabic ? <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slider Indicator Dots */}
          <div className="flex justify-center items-center gap-1 mt-6">
            {filteredServices.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToIndex(idx)}
                aria-label={`الخدمة ${idx + 1}`}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer p-0 m-0 bg-transparent border-0"
              >
                <span
                  className={`block h-2 rounded-full transition-colors duration-200 ${
                    currentIndex === idx 
                      ? 'w-8 bg-[#2B95FF]' 
                      : 'w-2 bg-[#161B26]/15 dark:bg-white/20 hover:bg-[#161B26]/30 dark:hover:bg-white/40'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 4. BOTTOM BANNER (OBSIDIAN ANCHOR CARD)                           */}
        {/* ================================================================= */}
        <div className="mt-12 sm:mt-16 obsidian-anchor-card rounded-[28px] p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(43,149,255,0.22)_0%,transparent_70%)] pointer-events-none transform-gpu" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.16)_0%,transparent_70%)] pointer-events-none transform-gpu" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center lg:text-right">
              
              {/* Distinctive Raba Brand Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2B95FF]/12 dark:bg-[#2B95FF]/15 text-[#1263D6] dark:text-[#60AFFF] text-xs font-black tracking-wide border border-[#2B95FF]/30">
                <span>رابا</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span>{isArabic ? 'مسار رابا الإكلينيكي المخصص' : 'RABA Tailored Clinical Pathway'}</span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#161B26] dark:text-white">
                {isArabic ? 'نبدأ بالتقييم .. ونبني المسار وفق احتياج طفلك' : 'We start with assessment .. and build the pathway tailored to your child’s needs'}
              </h3>
              
              <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] max-w-xl">
                {isArabic 
                  ? 'برامج تأهيلية متكاملة تحت إشراف نخبة من الأخصائيين المعتمدين محلياً ودولياً في تحليل السلوك التطبيقي، التخاطب، العلاج الوظيفي والتكامل الحسي.'
                  : 'Integrated rehabilitation programs supervised by accredited local and international specialists in ABA, Speech Therapy, Occupational Therapy, and Sensory Integration.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="tel:0575100100"
                className="px-5 py-3 rounded-full bg-white/90 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20 text-[#161B26] dark:text-white border border-[#161B26]/10 dark:border-white/15 text-xs sm:text-sm font-black flex items-center gap-2 transition-colors duration-200 cursor-pointer backdrop-blur-md shadow-xs"
              >
                <Phone className="w-4 h-4 text-[#2B95FF]" />
                <span dir="ltr">0575100100</span>
              </a>

              <a
                href="https://wa.me/966575100100"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-full bg-white/90 hover:bg-white dark:bg-white/15 dark:hover:bg-white/25 text-[#161B26] dark:text-white border border-[#161B26]/10 dark:border-white/10 text-xs sm:text-sm font-black flex items-center gap-2 transition-colors duration-200 shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#10B981]" />
                <span>{isArabic ? 'واتساب مباشر' : 'WhatsApp'}</span>
              </a>

              <button
                onClick={() => onSelectService(services[0])}
                className="px-6 py-3 rounded-full bg-[#1463D6] hover:bg-[#1152B8] text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{isArabic ? 'احجز تقييم طفلك الآن' : 'Book Child Assessment'}</span>
                {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
