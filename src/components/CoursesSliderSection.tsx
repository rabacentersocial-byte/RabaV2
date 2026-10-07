import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Star, 
  Play, 
  PlayCircle, 
  SlidersHorizontal, 
  LayoutGrid
} from 'lucide-react';
import { 
  getStoredCoursesData, 
  getStoredCoursesSettings, 
  CourseItem, 
  CoursesSectionSettings 
} from '../data/coursesData';
import { useLanguage } from '../context/LanguageContext';
import { CourseDetailsModal } from './CourseDetailsModal';

interface CoursesSliderSectionProps {
  onRegisterCourse: (course: CourseItem) => void;
}

export const CoursesSliderSection: React.FC<CoursesSliderSectionProps> = ({ onRegisterCourse }) => {
  const { isArabic } = useLanguage();
  const [courses, setCourses] = useState<CourseItem[]>(() => getStoredCoursesData());
  const [sectionSettings, setSectionSettings] = useState<CoursesSectionSettings>(() => getStoredCoursesSettings());
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  
  // Selected course for details modal
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<CourseItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Filter active courses
  const activeCourses = courses.filter(c => c.isActive !== false);

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

  const updateScrollState = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const current = Math.abs(el.scrollLeft);

    setCanScrollPrev(current > 15);
    setCanScrollNext(current < maxScroll - 15);

    const slideWidth = 390;
    const index = Math.round(current / slideWidth);
    setCurrentIndex(Math.min(Math.max(0, index), Math.max(0, activeCourses.length - 1)));
  }, [activeCourses.length]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [activeCourses, updateScrollState]);

  const handleScroll = (direction: 'prev' | 'next') => {
    const el = sliderRef.current;
    if (!el) return;
    const cardWidth = 390;

    let delta = cardWidth;
    if (direction === 'prev') {
      delta = -cardWidth;
    }
    // In RTL, scrollLeft direction depends on browser RTL coordinate system
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

  // Drag handlers for mouse swipe
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = sliderRef.current;
    if (!el) return;
    setIsDragging(true);
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
    movedDistanceRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
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

  return (
    <section 
      id="courses" 
      className="py-16 sm:py-24 bg-transparent text-slate-900 dark:text-white relative overflow-hidden transition-colors border-b border-slate-200/80 dark:border-white/10"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-teal-500/10 via-[#0d5c52]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10 opacity-50 dark:opacity-40" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10 opacity-40 dark:opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 1. HEADER SECTION MATCHING EXACT SCREENSHOT */}
        <div className="mb-10 sm:mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            
            {/* Right Side in RTL: Badge, Title, Subtitle */}
            <div className="max-w-3xl space-y-3">
              {/* Soft Sage Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dff1ec] dark:bg-teal-950/60 text-[#0d5c52] dark:text-[#2dd4bf] text-xs sm:text-sm font-bold shadow-2xs">
                <span>{isArabic ? sectionSettings.badgeAr : sectionSettings.badgeEn}</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f2d29] dark:text-white tracking-tight leading-[1.2] [text-wrap:balance]">
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
              <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
                {isArabic ? `${activeCourses.length} كورسات متاحة` : `${activeCourses.length} Courses Available`}
              </span>

              {/* View Mode Toggle */}
              <div className="bg-slate-100 dark:bg-slate-800/90 p-1 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center shadow-xs">
                <button
                  onClick={() => setViewMode('slider')}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    viewMode === 'slider' 
                      ? 'bg-white dark:bg-[#0d5c52] text-[#0d5c52] dark:text-white shadow-xs font-bold' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={isArabic ? 'عرض سلايدر' : 'Slider View'}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-[#0d5c52] text-[#0d5c52] dark:text-white shadow-xs font-bold' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={isArabic ? 'عرض شبكي' : 'Grid View'}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Arrows (Prev / Next) */}
              {viewMode === 'slider' && (
                <div className="flex items-center gap-2">
                  {/* In RTL: Right button goes to previous items (scrolls right) */}
                  <button
                    onClick={() => handleScroll('prev')}
                    disabled={!canScrollPrev}
                    aria-label={isArabic ? 'الكورس السابق' : 'Previous course'}
                    className={`w-11 h-11 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-sm transition-all cursor-pointer ${
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
                    className={`w-11 h-11 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-sm transition-all cursor-pointer ${
                      canScrollNext 
                        ? 'hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white active:scale-95' 
                        : 'opacity-40 cursor-not-allowed'
                    }`}
                  >
                    {isArabic ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* 2. COURSES CAROUSEL TRACK / GRID DISPLAY */}
        {viewMode === 'slider' ? (
          <div className="relative">
            <div
              ref={sliderRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4 px-1 ${
                isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
              }`}
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {activeCourses.map((course) => {
                const title = isArabic ? course.titleAr : course.titleEn;
                const hoursBadge = isArabic ? course.hoursBadgeAr : course.hoursBadgeEn;
                const tagHighlight = isArabic ? course.tagHighlightAr : course.tagHighlightEn;
                const description = isArabic ? course.descriptionAr : course.descriptionEn;
                const features = isArabic ? course.featuresAr : course.featuresEn;
                const instructor = isArabic ? (course.instructorAr || 'بإشراف نخبة من الأخصائيين المعتمدين') : (course.instructorEn || 'Supervised by Certified Clinicians');

                return (
                  <div
                    key={course.id}
                    className="w-[86vw] max-w-[360px] sm:w-[370px] md:w-[380px] shrink-0 snap-start bg-white dark:bg-[#131d24] rounded-[28px] overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(13,92,82,0.12)] dark:hover:shadow-[0_16px_36px_rgba(0,229,190,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col group relative"
                  >
                    {/* Top Image Container with Badges & Play Button */}
                    <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 select-none">
                      <img 
                        src={course.cardCoverUrl || '/images/courses/course_1_qba.jpg'} 
                        alt={title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                      />
                      
                      {/* Floating Top Badge (Top-Right in RTL) */}
                      <div className="absolute top-3.5 right-3.5 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto z-10 px-3.5 py-1 rounded-full bg-[#fefce8] dark:bg-amber-950/80 text-[#78350f] dark:text-amber-200 text-xs font-bold border border-[#fef08a] dark:border-amber-700/40 shadow-xs">
                        {course.floatingBadgeAr || 'اعتماد دولي'}
                      </div>

                      {/* Video Play Button (Bottom-Left in RTL / Bottom-Right in LTR) */}
                      <button 
                        onClick={() => handleOpenDetails(course)}
                        className="absolute bottom-3.5 left-3.5 rtl:left-3.5 rtl:right-auto ltr:right-3.5 ltr:left-auto z-10 w-10 h-10 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur text-[#0d5c52] dark:text-[#2dd4bf] shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer border border-white/60 dark:border-white/10 group/play"
                        title={isArabic ? 'معاينة وفيديو الكورس' : 'Course Video Preview'}
                      >
                        <Play className="w-4 h-4 fill-current ml-0.5 rtl:ml-0 rtl:mr-0.5 transition-transform group-hover/play:scale-110" />
                      </button>
                    </div>

                    {/* Dual Badge Row Immediately Under Image */}
                    <div className="px-5 pt-4 pb-1 grid grid-cols-2 gap-2.5">
                      {/* Forest Teal Badge (Right in RTL) */}
                      <div className="bg-[#0d5c52] text-white text-[11px] sm:text-xs font-bold py-2 px-2.5 rounded-xl text-center truncate shadow-xs">
                        {course.accreditationBadgeAr || course.ribbonTagAr || 'اعتماد دولي'}
                      </div>

                      {/* Soft Light Gray Badge (Left in RTL) */}
                      <div className="bg-slate-50 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-150 dark:border-slate-700/60 text-[11px] sm:text-xs font-medium py-2 px-2.5 rounded-xl text-center truncate">
                        {hoursBadge}
                      </div>
                    </div>

                    {/* Category & Rating Row */}
                    <div className="px-5 pt-3 flex items-center justify-between">
                      {/* Category in Teal */}
                      <span className="text-[#0d5c52] dark:text-[#2dd4bf] text-xs font-bold tracking-wide">
                        {course.categoryAr || 'تحليل السلوك التطبيقي'}
                      </span>

                      {/* Rating */}
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{course.rating || 4.9}</span>
                        <span className="text-slate-400 dark:text-slate-500 font-normal">({course.reviewsCount || 120})</span>
                      </div>
                    </div>

                    {/* Course Title */}
                    <h3 
                      onClick={() => handleOpenDetails(course)}
                      className="px-5 pt-2 text-xl font-black text-slate-900 dark:text-white leading-snug group-hover:text-[#0d5c52] dark:group-hover:text-[#2dd4bf] transition-colors cursor-pointer"
                    >
                      {title}
                    </h3>

                    {/* Special Scope / Highlight Banner */}
                    <div className="mx-5 mt-3 py-2 px-3 rounded-xl bg-[#fffdf0] dark:bg-amber-950/20 border border-[#fef08a] dark:border-amber-800/40 text-[#92400e] dark:text-amber-200 text-xs font-semibold text-center leading-relaxed truncate">
                      {tagHighlight}
                    </div>

                    {/* Brief Description */}
                    <p className="px-5 pt-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 min-h-[36px]">
                      {description}
                    </p>

                    {/* Divider */}
                    <div className="mx-5 my-3 border-t border-slate-100 dark:border-slate-800/80" />

                    {/* 3 Checklist Outcomes */}
                    <div className="px-5 space-y-2">
                      {features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          <span className="w-4 h-4 rounded-full bg-[#ecfdf5] dark:bg-emerald-950/50 text-[#059669] dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Instructor / Supervisor */}
                    <div className="px-5 pt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {instructor}
                    </div>

                    {/* Meta Stats Row (Hours & Lessons) */}
                    <div className="px-5 pt-2.5 pb-1 flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.hoursCount || 40} {isArabic ? 'ساعة' : 'hours'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <PlayCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.lessonsCount || 20} {isArabic ? 'درساً' : 'lessons'}</span>
                      </div>
                    </div>

                    {/* Footer Row (Price & Action Button) */}
                    <div className="p-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-auto bg-slate-50/40 dark:bg-slate-900/30">
                      {/* Price Section */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                          {course.currentPrice || course.priceDisplayAr || '990'}
                        </span>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {isArabic ? 'ر.س' : 'SAR'}
                        </span>
                        {course.originalPrice && (
                          <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-normal">
                            {course.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Course Details CTA Button */}
                      <button
                        onClick={() => handleOpenDetails(course)}
                        className="bg-[#0d5c52] hover:bg-[#0a4840] active:scale-95 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 hover:shadow-md"
                      >
                        <span>{isArabic ? 'تفاصيل الكورس' : 'Course Details'}</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Slider Indicator Dots */}
            <div className="flex justify-center items-center gap-2 mt-6">
              {activeCourses.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToIndex(idx)}
                  aria-label={`الكورس ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx 
                      ? 'w-8 bg-[#0d5c52] dark:bg-[#2dd4bf]' 
                      : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCourses.map((course) => {
              const title = isArabic ? course.titleAr : course.titleEn;
              const hoursBadge = isArabic ? course.hoursBadgeAr : course.hoursBadgeEn;
              const tagHighlight = isArabic ? course.tagHighlightAr : course.tagHighlightEn;
              const description = isArabic ? course.descriptionAr : course.descriptionEn;
              const features = isArabic ? course.featuresAr : course.featuresEn;
              const instructor = isArabic ? (course.instructorAr || 'بإشراف نخبة من الأخصائيين المعتمدين') : (course.instructorEn || 'Supervised by Certified Clinicians');

              return (
                <div
                  key={course.id}
                  className="bg-white dark:bg-[#131d24] rounded-[28px] overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(13,92,82,0.12)] dark:hover:shadow-[0_16px_36px_rgba(0,229,190,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col group relative"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 select-none">
                    <img 
                      src={course.cardCoverUrl || '/images/courses/course_1_qba.jpg'} 
                      alt={title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                    />
                    
                    <div className="absolute top-3.5 right-3.5 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto z-10 px-3.5 py-1 rounded-full bg-[#fefce8] dark:bg-amber-950/80 text-[#78350f] dark:text-amber-200 text-xs font-bold border border-[#fef08a] dark:border-amber-700/40 shadow-xs">
                      {course.floatingBadgeAr || 'اعتماد دولي'}
                    </div>

                    <button 
                      onClick={() => handleOpenDetails(course)}
                      className="absolute bottom-3.5 left-3.5 rtl:left-3.5 rtl:right-auto ltr:right-3.5 ltr:left-auto z-10 w-10 h-10 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur text-[#0d5c52] dark:text-[#2dd4bf] shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer border border-white/60 dark:border-white/10 group/play"
                      title={isArabic ? 'معاينة وفيديو الكورس' : 'Course Video Preview'}
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5 rtl:ml-0 rtl:mr-0.5 transition-transform group-hover/play:scale-110" />
                    </button>
                  </div>

                  <div className="px-5 pt-4 pb-1 grid grid-cols-2 gap-2.5">
                    <div className="bg-[#0d5c52] text-white text-[11px] sm:text-xs font-bold py-2 px-2.5 rounded-xl text-center truncate shadow-xs">
                      {course.accreditationBadgeAr || course.ribbonTagAr || 'اعتماد دولي'}
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-150 dark:border-slate-700/60 text-[11px] sm:text-xs font-medium py-2 px-2.5 rounded-xl text-center truncate">
                      {hoursBadge}
                    </div>
                  </div>

                  <div className="px-5 pt-3 flex items-center justify-between">
                    <span className="text-[#0d5c52] dark:text-[#2dd4bf] text-xs font-bold tracking-wide">
                      {course.categoryAr || 'تحليل السلوك التطبيقي'}
                    </span>

                    <div className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{course.rating || 4.9}</span>
                      <span className="text-slate-400 dark:text-slate-500 font-normal">({course.reviewsCount || 120})</span>
                    </div>
                  </div>

                  <h3 
                    onClick={() => handleOpenDetails(course)}
                    className="px-5 pt-2 text-xl font-black text-slate-900 dark:text-white leading-snug group-hover:text-[#0d5c52] dark:group-hover:text-[#2dd4bf] transition-colors cursor-pointer"
                  >
                    {title}
                  </h3>

                  <div className="mx-5 mt-3 py-2 px-3 rounded-xl bg-[#fffdf0] dark:bg-amber-950/20 border border-[#fef08a] dark:border-amber-800/40 text-[#92400e] dark:text-amber-200 text-xs font-semibold text-center leading-relaxed truncate">
                    {tagHighlight}
                  </div>

                  <p className="px-5 pt-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 min-h-[36px]">
                    {description}
                  </p>

                  <div className="mx-5 my-3 border-t border-slate-100 dark:border-slate-800/80" />

                  <div className="px-5 space-y-2">
                    {features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <span className="w-4 h-4 rounded-full bg-[#ecfdf5] dark:bg-emerald-950/50 text-[#059669] dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="px-5 pt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {instructor}
                  </div>

                  <div className="px-5 pt-2.5 pb-1 flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.hoursCount || 40} {isArabic ? 'ساعة' : 'hours'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <PlayCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.lessonsCount || 20} {isArabic ? 'درساً' : 'lessons'}</span>
                    </div>
                  </div>

                  <div className="p-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-auto bg-slate-50/40 dark:bg-slate-900/30">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {course.currentPrice || course.priceDisplayAr || '990'}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {isArabic ? 'ر.س' : 'SAR'}
                      </span>
                      {course.originalPrice && (
                        <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-normal">
                          {course.originalPrice}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenDetails(course)}
                      className="bg-[#0d5c52] hover:bg-[#0a4840] active:scale-95 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 hover:shadow-md"
                    >
                      <span>{isArabic ? 'تفاصيل الكورس' : 'Course Details'}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

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
