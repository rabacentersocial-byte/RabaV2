import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  ShieldCheck, 
  AlertCircle
} from 'lucide-react';
import { 
  getStoredCoursesData, 
  getStoredCoursesSettings, 
  getCourseNumericPrice,
  sortCoursesForDisplay,
  CourseItem, 
  CoursesSectionSettings 
} from '../data/coursesData';
import { useLanguage } from '../context/LanguageContext';
import { CourseDetailsModal } from './CourseDetailsModal';
import { CourseCustomIcon } from './CourseCustomIcon';
import { getCourseLogoTheme } from '../utils/courseLogoThemes';

interface CoursesSliderSectionProps {
  onRegisterCourse: (course: CourseItem) => void;
}

export const CoursesSliderSection: React.FC<CoursesSliderSectionProps> = ({ onRegisterCourse }) => {
  const { isArabic } = useLanguage();
  const [courses, setCourses] = useState<CourseItem[]>(() => getStoredCoursesData());
  const [sectionSettings, setSectionSettings] = useState<CoursesSectionSettings>(() => getStoredCoursesSettings());
  
  // Selected course for details modal
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<CourseItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Filter active courses and keep featured priority courses at the beginning
  const activeCourses = useMemo(() => {
    return sortCoursesForDisplay(courses.filter(c => c.isActive !== false));
  }, [courses]);

  // Slider reference & navigation state
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const movedDistanceRef = useRef(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sync courses and settings if updated in persistent storage
  useEffect(() => {
    const handleCoursesUpdate = () => {
      setCourses(getStoredCoursesData());
    };
    const handleSettingsUpdate = () => {
      setSectionSettings(getStoredCoursesSettings());
    };
    window.addEventListener('raba_courses_updated', handleCoursesUpdate);
    window.addEventListener('raba_courses_settings_updated', handleSettingsUpdate);
    window.addEventListener('raba_persistent_sync_ready' as any, handleCoursesUpdate);
    window.addEventListener('storage', handleCoursesUpdate);
    return () => {
      window.removeEventListener('raba_courses_updated', handleCoursesUpdate);
      window.removeEventListener('raba_courses_settings_updated', handleSettingsUpdate);
      window.removeEventListener('raba_persistent_sync_ready' as any, handleCoursesUpdate);
      window.removeEventListener('storage', handleCoursesUpdate);
    };
  }, []);

  const getSlideWidth = () => {
    if (typeof window === 'undefined') return 380;
    if (window.innerWidth < 640) {
      return Math.min(window.innerWidth * 0.78, 315) + 16;
    }
    return 390;
  };

  const rafIdRef = useRef<number | null>(null);
  const maxScrollRef = useRef(0);
  const slideWidthRef = useRef(390);
  const containerOffsetLeftRef = useRef(0);

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

      const slideWidth = slideWidthRef.current;
      const index = Math.round(current / slideWidth);
      setCurrentIndex(Math.min(Math.max(0, index), Math.max(0, activeCourses.length - 1)));
    });
  }, [activeCourses.length]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const measure = () => {
      maxScrollRef.current = Math.max(0, el.scrollWidth - el.clientWidth);
      containerOffsetLeftRef.current = el.offsetLeft;
      slideWidthRef.current = getSlideWidth();
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
  }, [activeCourses, updateScrollState]);

  const handleScroll = (direction: 'prev' | 'next') => {
    const el = sliderRef.current;
    if (!el) return;
    const cardWidth = slideWidthRef.current;

    let delta = cardWidth;
    if (direction === 'prev') {
      delta = -cardWidth;
    }
    // In RTL, scroll direction depends on coordinates
    if (isArabic) {
      delta = -delta;
    }

    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const scrollToIndex = (index: number) => {
    const el = sliderRef.current;
    if (!el) return;
    const slideWidth = slideWidthRef.current;
    let target = index * slideWidth;
    if (isArabic) target = -target;
    el.scrollTo({ left: target, behavior: 'smooth' });
  };

  // Drag handlers for mouse swipe (cached offsetLeft avoids synchronous layout thrashing)
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

  const handleOpenDetails = (course: CourseItem) => {
    setSelectedCourseForDetails(course);
    setIsDetailsModalOpen(true);
  };

  // Render a course card with distinct logo-compatible theme
  const renderCourseCard = (course: CourseItem, index: number) => {
    const title = isArabic ? course.titleAr : course.titleEn;
    const hoursBadge = isArabic ? course.hoursBadgeAr : course.hoursBadgeEn;
    const description = isArabic ? course.descriptionAr : course.descriptionEn;
    const features = (isArabic ? course.featuresAr : course.featuresEn) || course.featuresAr || [];
    const instructor = isArabic ? 'بإشراف نخبة من الأخصائيين المعتمدين' : 'Supervised by Certified Specialists';
    const theme = getCourseLogoTheme(course, index);

    return (
      <div
        key={course.id}
        className={`w-[78vw] min-w-[270px] max-w-[315px] sm:w-[350px] sm:max-w-none md:w-[370px] lg:w-[380px] shrink-0 snap-start bg-white dark:bg-[#111827] rounded-2xl sm:rounded-[32px] overflow-hidden border ${theme.cardBorderHover} shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-transform duration-300 flex flex-col group relative`}
      >
        {/* Top Header Section: Distinct Logo Color Container */}
        <div className={`${theme.headerBg} p-4 sm:p-7 pt-5 sm:pt-7 pb-4 sm:pb-6 rounded-t-2xl sm:rounded-t-[32px] border-b ${theme.headerBorder} relative transition-colors`}>
          {/* Top Row: Floating Pill Badge & Icon Button */}
          <div className="flex items-center justify-between gap-2.5">
            {/* Right in RTL: Solid Logo Theme Pill Badge */}
            <span className={`${theme.pillBg} text-[11px] sm:text-xs font-bold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-xs transition-colors truncate max-w-[70%]`}>
              {isArabic ? (course.floatingBadgeAr || 'الأكثر طلباً') : (course.floatingBadgeEn || 'Top Choice')}
            </span>

            {/* Left in RTL: Rounded White Icon Button */}
            <button
              onClick={() => handleOpenDetails(course)}
              className={`w-10 h-10 min-w-[40px] min-h-[40px] sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white dark:bg-[#0E1526] border ${theme.iconBoxBorder} shadow-xs flex items-center justify-center ${theme.iconColor} hover:scale-105 active:scale-95 transition-transform cursor-pointer group/icon shrink-0`}
              title={isArabic ? 'معاينة وفيديو الكورس' : 'Course Video Preview'}
            >
              <CourseCustomIcon course={course} className={`w-4 h-4 sm:w-5 sm:h-5 ${theme.iconColor} group-hover/icon:scale-110 transition-transform`} />
            </button>
          </div>

          {/* Category Kicker */}
          <div className={`${theme.kickerColor} text-[11px] sm:text-xs font-extrabold tracking-wide mt-2.5 sm:mt-4 mb-1 sm:mb-1.5 transition-colors`}>
            {isArabic ? (course.categoryAr || 'التقييم والتشخيص النمائي') : (course.categoryEn || 'Developmental Assessment')}
          </div>

          {/* Main Course Title */}
          <h3 
            onClick={() => handleOpenDetails(course)}
            className={`text-base sm:text-2xl md:text-[25px] font-black text-slate-900 dark:text-white leading-[1.3] tracking-tight ${theme.titleHover} transition-colors cursor-pointer line-clamp-2`}
          >
            {title}
          </h3>
        </div>

        {/* Lower Section: Pure White Body */}
        <div className="bg-white dark:bg-[#111827] p-4 sm:p-7 pt-4 sm:pt-5 rounded-b-2xl sm:rounded-b-[32px] flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
          
          <div className="space-y-2.5 sm:space-y-3.5">
            {/* Price Row: Big number + Currency + Strikethrough Original Price (or Inquiry Label if unpriced) */}
            {getCourseNumericPrice(course) > 0 ? (
              <div className="flex items-baseline gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
                <span className={`text-2xl sm:text-4xl md:text-[44px] font-black ${theme.priceColor} tracking-tight leading-none`}>
                  {getCourseNumericPrice(course)}
                </span>
                <span className={`text-sm sm:text-lg font-bold ${theme.priceSub}`}>
                  {isArabic ? 'ريال' : 'SAR'}
                </span>
                {Number(course.originalPrice) > 0 && (
                  <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 line-through mr-1 font-medium">
                    {course.originalPrice} {isArabic ? 'ريال' : 'SAR'}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center pt-0.5 sm:pt-1 min-h-[36px] sm:min-h-[44px]">
                <span className={`text-base sm:text-xl font-black ${theme.priceColor} tracking-tight leading-snug`}>
                  {isArabic ? (course.priceDisplayAr || 'تواصل للاستفسار عن السعر') : (course.priceDisplayEn || 'Contact for Pricing')}
                </span>
              </div>
            )}

            {/* Hours / Duration Badge */}
            <div>
              <div className={`inline-flex items-center gap-1.5 sm:gap-2 py-1 sm:py-1.5 px-2.5 sm:px-3.5 rounded-lg sm:rounded-xl border ${theme.hoursBg} text-[11px] sm:text-sm font-bold transition-colors`}>
                <Clock className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${theme.hoursIconColor} shrink-0`} />
                <span>{hoursBadge}</span>
              </div>
            </div>

            {/* Sub-note / Warning or Highlight Info */}
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-amber-800 dark:text-amber-300 font-semibold">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{isArabic ? (course.tagHighlightAr || 'شهادة إتمام معتمدة ومسار مهني') : (course.tagHighlightEn || 'Accredited Certificate')}</span>
            </div>

            {/* Short Description */}
            <p className="text-[11px] sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed min-h-[30px] sm:min-h-[36px] line-clamp-2">
              {description}
            </p>

            {/* Checklist of Features (4 items) */}
            <div className="space-y-1.5 sm:space-y-2.5 pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-800/80">
              {(features || []).slice(0, 4).map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px] sm:text-[13px] text-slate-700 dark:text-slate-200 font-medium">
                  <span className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${theme.checkBg} flex items-center justify-center shrink-0 mt-0.5 transition-colors`}>
                    <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 stroke-[3]" />
                  </span>
                  <span className="leading-snug line-clamp-1">{feat}</span>
                </div>
              ))}
            </div>

            {/* Instructor & Accreditation Note */}
            <div className="text-[10px] sm:text-[11px] font-medium text-slate-600 dark:text-slate-300 pt-0.5 sm:pt-1 flex items-center gap-1.5 flex-wrap">
              <span>{instructor}</span>
              <span>·</span>
              <span>{isArabic ? (course.accreditationBadgeAr || 'اعتماد دولي') : (course.accreditationBadgeEn || 'International Accreditation')}</span>
            </div>
          </div>

          {/* Full-Width Action Button */}
          <div className="pt-1.5 sm:pt-2">
            <button
              onClick={() => handleOpenDetails(course)}
              className={`w-full ${theme.buttonBg} active:scale-[0.98] text-white text-xs sm:text-base font-bold py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-[transform,background-color,box-shadow] cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2`}
            >
              <span>{isArabic ? 'حجز الكورس' : 'Book Course'}</span>
            </button>
          </div>

        </div>
      </div>
    );
  };

  return (
    <section 
      id="courses" 
      className="py-10 sm:py-24 bg-transparent text-slate-900 dark:text-white relative overflow-hidden transition-colors border-b border-slate-200/80 dark:border-white/10 [content-visibility:auto] [contain-intrinsic-size:1px_600px]"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.08)_0%,transparent_70%)] pointer-events-none transform-gpu -z-10 opacity-50 dark:opacity-40" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.07)_0%,transparent_70%)] pointer-events-none transform-gpu -z-10 opacity-40 dark:opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 1. HEADER SECTION MATCHING EXACT SCREENSHOT */}
        <div className="mb-10 sm:mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            
            {/* Right Side in RTL: Badge, Title, Subtitle */}
            <div className="max-w-3xl space-y-3">
              {/* Soft Blue Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2E86EB] dark:text-[#2E86EB] text-xs sm:text-sm font-bold shadow-2xs">
                <span>{isArabic ? sectionSettings.badgeAr : sectionSettings.badgeEn}</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.2] [text-wrap:balance]">
                {isArabic ? (
                  <>
                    <span>{sectionSettings.titlePart1Ar}</span>{' '}
                    <span>{sectionSettings.titleHighlightAr}</span>
                  </>
                ) : (
                  <span>{sectionSettings.titleEn}</span>
                )}
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl [text-wrap:pretty]">
                {isArabic ? sectionSettings.subtitleAr : sectionSettings.subtitleEn}
              </p>
            </div>

            {/* Left Side in RTL: Counter, View Toggle & Arrow Navigation */}
            <div className="flex items-center gap-4 self-end md:self-auto shrink-0 pt-2">
              
              {/* Courses Count */}
              <span className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
                {isArabic ? `${activeCourses.length} كورسات متاحة` : `${activeCourses.length} Courses Available`}
              </span>

              {/* Navigation Arrows (Prev / Next) */}
              <div className="flex items-center gap-2">
                {/* In RTL: Right button goes to previous items (scrolls right) */}
                <button
                  onClick={() => handleScroll('prev')}
                  disabled={!canScrollPrev}
                  aria-label={isArabic ? 'الكورس السابق' : 'Previous course'}
                  className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-sm transition-transform duration-200 cursor-pointer ${
                    canScrollPrev 
                      ? 'hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white active:scale-95' 
                      : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  {isArabic ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>

                {/* In RTL: Left button goes to next items (scrolls left) */}
                <button
                  onClick={() => handleScroll('next')}
                  disabled={!canScrollNext}
                  aria-label={isArabic ? 'الكورس التالي' : 'Next course'}
                  className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-sm transition-transform duration-200 cursor-pointer ${
                    canScrollNext 
                      ? 'hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white active:scale-95' 
                      : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  {isArabic ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 2. COURSES CAROUSEL TRACK */}
        <div className="relative">
          <div
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`flex gap-3.5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 sm:py-4 px-1 ${
              isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
            }`}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {activeCourses.map(renderCourseCard)}
          </div>

          {/* Slider Indicator Dots */}
          <div className="flex justify-center items-center gap-1 mt-6">
            {activeCourses.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToIndex(idx)}
                aria-label={`الكورس ${idx + 1}`}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer p-0 m-0 bg-transparent border-0"
              >
                <span
                  className={`block h-2 rounded-full transition-colors duration-200 ${
                    currentIndex === idx 
                      ? 'w-8 bg-[#0a3530] dark:bg-[#2dd4bf]' 
                      : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Interactive Course Details & Preview Modal */}
      <CourseDetailsModal
        course={selectedCourseForDetails}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedCourseForDetails(null);
        }}
        onRegister={(course) => {
          setIsDetailsModalOpen(false);
          onRegisterCourse(course);
        }}
        whatsappNumber={sectionSettings.whatsappNumber}
      />
    </section>
  );
};

export default CoursesSliderSection;
