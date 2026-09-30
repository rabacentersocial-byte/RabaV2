import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  Clock, 
  Award, 
  ChevronRight, 
  ChevronLeft, 
  MessageCircle, 
  CheckCircle2, 
  SlidersHorizontal, 
  LayoutGrid, 
  BookOpen
} from 'lucide-react';
import { getStoredCoursesData, CourseItem } from '../data/coursesData';
import { useLanguage } from '../context/LanguageContext';

interface CoursesSliderSectionProps {
  onRegisterCourse: (course: CourseItem) => void;
}

export const CoursesSliderSection: React.FC<CoursesSliderSectionProps> = ({ onRegisterCourse }) => {
  const { isArabic } = useLanguage();
  const [courses, setCourses] = useState<CourseItem[]>(() => getStoredCoursesData());
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  
  // Slider reference & navigation state
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const movedDistanceRef = useRef(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sync courses if updated in persistent storage
  useEffect(() => {
    const handleUpdate = () => {
      setCourses(getStoredCoursesData());
    };
    window.addEventListener('raba_courses_updated', handleUpdate);
    window.addEventListener('raba_persistent_sync_ready' as any, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('raba_courses_updated', handleUpdate);
      window.removeEventListener('raba_persistent_sync_ready' as any, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const updateScrollState = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const current = Math.abs(el.scrollLeft);

    setCanScrollPrev(current > 15);
    setCanScrollNext(current < maxScroll - 15);

    const slideWidth = 380;
    const index = Math.round(current / slideWidth);
    setCurrentIndex(Math.min(Math.max(0, index), courses.length - 1));
  }, [courses.length]);

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
  }, [courses, updateScrollState]);

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

  // Drag handlers
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

  return (
    <section 
      id="courses" 
      className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-teal-50/25 to-white dark:from-[#0B1220] dark:via-[#0F1A2E] dark:to-[#0A101D] text-slate-900 dark:text-white relative overflow-hidden transition-colors border-b border-slate-200/80 dark:border-white/10"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Background Ambience & Lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10 opacity-40 dark:opacity-100" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10 opacity-30 dark:opacity-100" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 1. HEADER & CONTROLS BAR */}
        <div className="mb-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-[#00E5BE] text-xs font-black shadow-2xs">
                <BookOpen className="w-4 h-4 text-teal-600 dark:text-[#00E5BE]" />
                <span>{isArabic ? 'الكورسات والدورات التدريبية' : 'COURSES & PROFESSIONAL TRAINING'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight [text-wrap:balance]">
                {isArabic ? (
                  <>
                    <span>طوّر مسارك المهني في</span>{' '}
                    <span className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-[#00E5BE] dark:to-[#38BDF8] bg-clip-text text-transparent">
                      تحليل السلوك التطبيقي (ABA)
                    </span>
                  </>
                ) : (
                  <>
                    Advance Your Clinical Career in{' '}
                    <span className="text-teal-600 dark:text-[#00E5BE]">Applied Behavior Analysis</span>
                  </>
                )}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed [text-wrap:pretty]">
                {isArabic 
                  ? 'برامج تدريبية معتمدة دولياً ومصممة بأعلى المعايير الإكلينيكية لتزويدك بالمعرفة النظرية والمهارات التطبيقية في التقييم والتدخل السلوكي.'
                  : 'Internationally accredited training programs designed to build rigorous clinical competencies in behavior assessment and intervention.'}
              </p>
            </div>

            {/* View Mode Toggle & Slider Controls */}
            <div className="flex items-center gap-3 self-end md:self-auto shrink-0 pt-2">
              <div className="bg-white dark:bg-slate-800/90 p-1 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center shadow-xs">
                <button
                  onClick={() => setViewMode('slider')}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    viewMode === 'slider' 
                      ? 'bg-gradient-to-r from-teal-500 to-[#00E5BE] text-slate-950 font-black shadow-xs' 
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
                      ? 'bg-gradient-to-r from-teal-500 to-[#00E5BE] text-slate-950 font-black shadow-xs' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={isArabic ? 'عرض شبكي' : 'Grid View'}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              {viewMode === 'slider' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleScroll('prev')}
                    disabled={!canScrollPrev}
                    aria-label={isArabic ? 'الكورس السابق' : 'Previous course'}
                    className={`w-10 h-10 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs transition-all cursor-pointer ${
                      canScrollPrev 
                        ? 'hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white active:scale-95' 
                        : 'opacity-40 cursor-not-allowed'
                    }`}
                  >
                    {isArabic ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => handleScroll('next')}
                    disabled={!canScrollNext}
                    aria-label={isArabic ? 'الكورس التالي' : 'Next course'}
                    className={`w-10 h-10 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs transition-all cursor-pointer ${
                      canScrollNext 
                        ? 'hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white active:scale-95' 
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

        {/* 3. COURSES SLIDER / GRID DISPLAY */}
        {viewMode === 'slider' ? (
          <div className="relative">
            <div
              ref={sliderRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`flex gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4 px-1 ${
                isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
              }`}
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {courses.map((course) => {
                const title = isArabic ? course.titleAr : course.titleEn;
                const hoursBadge = isArabic ? course.hoursBadgeAr : course.hoursBadgeEn;
                const tagHighlight = isArabic ? course.tagHighlightAr : course.tagHighlightEn;
                const description = isArabic ? course.descriptionAr : course.descriptionEn;
                const features = isArabic ? course.featuresAr : course.featuresEn;

                return (
                  <div
                    key={course.id}
                    className="w-[88vw] max-w-[370px] sm:w-[370px] md:w-[380px] shrink-0 snap-start bg-white dark:bg-[#16202C] rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-lg dark:shadow-2xl hover:border-teal-400 dark:hover:border-[#00E5BE]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative"
                  >
                    {/* Top Ribbon & Category Banner */}
                    <div className="relative p-6 pb-4 bg-gradient-to-br from-slate-50 via-teal-50/20 to-slate-100/70 dark:from-[#1E293B] dark:to-[#16202C] border-b border-slate-200/80 dark:border-white/10 overflow-hidden">
                      {/* Top Ribbon Tag */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5007D] text-white text-[11px] font-black shadow-xs">
                          <Sparkles className="w-3 h-3" />
                          <span>{isArabic ? course.ribbonTagAr : course.ribbonTagEn}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 text-teal-700 dark:text-cyan-400 text-xs font-black shadow-2xs">
                          <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-[#00E5BE]" />
                          <span>{hoursBadge}</span>
                        </span>
                      </div>

                      {/* Main Course Title */}
                      <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-teal-600 dark:group-hover:text-[#00E5BE] transition-colors mb-2">
                        {title}
                      </h3>

                      {/* Tag Highlight Badge */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-white/5 border border-amber-200/80 dark:border-white/10 text-amber-800 dark:text-amber-300 text-xs font-bold">
                        <Award className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                        <span className="truncate">{tagHighlight}</span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-5 bg-white dark:bg-[#16202C]">
                      
                      <div className="space-y-4">
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed min-h-[44px]">
                          {description}
                        </p>

                        {/* Features List */}
                        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
                          {features.slice(0, 4).map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-[#00E5BE] shrink-0 mt-0.5" />
                              <span className="leading-snug">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Section: Action Buttons */}
                      <div className="pt-4 border-t border-slate-100 dark:border-white/10">
                        {/* Action Buttons: Register & WhatsApp */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            onClick={() => onRegisterCourse(course)}
                            className="py-3 px-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/20 active:scale-95 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
                            <span>{isArabic ? 'سجل الآن' : 'Register Now'}</span>
                          </button>

                          <a
                            href={`https://wa.me/966575100100?text=${encodeURIComponent(
                              `السلام عليكم، أود الاستفسار والتسجيل في: ${course.titleAr} عبر منصة رابا التعليمية.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-3 px-3 bg-slate-100 dark:bg-[#0F2438] hover:bg-slate-200 dark:hover:bg-[#15324d] text-slate-800 dark:text-white text-xs font-bold rounded-xl border border-slate-200 dark:border-white/15 hover:border-teal-500 dark:hover:border-cyan-500/40 transition-all flex items-center justify-center gap-1.5 text-center shadow-xs active:scale-95 cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-teal-600 dark:text-cyan-400 shrink-0" />
                            <span>{isArabic ? 'استفسار واتساب' : 'WhatsApp'}</span>
                          </a>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Slider Dots */}
            <div className="flex justify-center items-center gap-2 mt-6">
              {courses.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToIndex(idx)}
                  aria-label={`الكورس ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx 
                      ? 'w-8 bg-teal-600 dark:bg-[#00E5BE]' 
                      : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => {
              const title = isArabic ? course.titleAr : course.titleEn;
              const hoursBadge = isArabic ? course.hoursBadgeAr : course.hoursBadgeEn;
              const tagHighlight = isArabic ? course.tagHighlightAr : course.tagHighlightEn;
              const description = isArabic ? course.descriptionAr : course.descriptionEn;
              const features = isArabic ? course.featuresAr : course.featuresEn;

              return (
                <div
                  key={course.id}
                  className="bg-white dark:bg-[#16202C] rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-lg dark:shadow-2xl hover:border-teal-400 dark:hover:border-[#00E5BE]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative"
                >
                  <div className="p-5 pb-3 bg-gradient-to-br from-slate-50 via-teal-50/20 to-slate-100/70 dark:from-[#1E293B] dark:to-[#16202C] border-b border-slate-200/80 dark:border-white/10">
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E5007D] text-white text-[10px] font-black shadow-xs">
                        <Sparkles className="w-3 h-3" />
                        <span>{isArabic ? course.ribbonTagAr : course.ribbonTagEn}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 text-teal-700 dark:text-cyan-400 text-[11px] font-black shadow-2xs">
                        <Clock className="w-3 h-3 text-teal-600 dark:text-[#00E5BE]" />
                        <span>{hoursBadge}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight group-hover:text-teal-600 dark:group-hover:text-[#00E5BE] transition-colors mb-2">
                      {title}
                    </h3>

                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-white/5 border border-amber-200/80 dark:border-white/10 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                      <Award className="w-3 h-3 text-amber-500 dark:text-amber-400 shrink-0" />
                      <span className="truncate">{tagHighlight}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white dark:bg-[#16202C]">
                    <div className="space-y-3">
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed min-h-[44px]">
                        {description}
                      </p>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-white/10">
                        {features.slice(0, 3).map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-3 h-3 text-teal-600 dark:text-[#00E5BE] shrink-0 mt-0.5" />
                            <span className="leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-white/10">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onRegisterCourse(course)}
                          className="py-2.5 px-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-teal-500/20 active:scale-95"
                        >
                          <Sparkles className="w-3 h-3 fill-slate-950" />
                          <span>{isArabic ? 'سجل الآن' : 'Register'}</span>
                        </button>

                        <a
                          href={`https://wa.me/966575100100?text=${encodeURIComponent(
                            `السلام عليكم، أود الاستفسار والتسجيل في: ${course.titleAr} عبر منصة رابا التعليمية.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-2 bg-slate-100 dark:bg-[#0F2438] hover:bg-slate-200 dark:hover:bg-[#15324d] text-slate-800 dark:text-white text-xs font-bold rounded-xl border border-slate-200 dark:border-white/15 flex items-center justify-center gap-1 shadow-xs active:scale-95"
                        >
                          <MessageCircle className="w-3 h-3 text-teal-600 dark:text-cyan-400" />
                          <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
