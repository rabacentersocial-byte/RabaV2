import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Clock, 
  Award, 
  MessageCircle, 
  Sparkles, 
  Star, 
  PlayCircle, 
  BookOpen, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  FileText
} from 'lucide-react';
import { CourseItem } from '../data/coursesData';
import { useLanguage } from '../context/LanguageContext';
import { CourseCustomIcon } from './CourseCustomIcon';
import { getCourseLogoTheme } from '../utils/courseLogoThemes';

interface CourseDetailsModalProps {
  course: CourseItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (course: CourseItem) => void;
  whatsappNumber?: string;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  course,
  isOpen,
  onClose,
  onRegister,
  whatsappNumber = '966575100100'
}) => {
  const { isArabic } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'syllabus' | 'instructor'>('overview');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !course) return null;

  const title = isArabic ? course.titleAr : course.titleEn;
  const hoursBadge = isArabic ? course.hoursBadgeAr : course.hoursBadgeEn;
  const tagHighlight = isArabic ? course.tagHighlightAr : course.tagHighlightEn;
  const description = isArabic ? course.descriptionAr : course.descriptionEn;
  const features = isArabic ? course.featuresAr : course.featuresEn;
  const instructor = isArabic ? 'بإشراف نخبة من الأخصائيين المعتمدين' : 'Supervised by Certified Specialists';
  const theme = getCourseLogoTheme(course);

  const whatsappMessage = encodeURIComponent(
    `السلام عليكم، أود الاستفسار والتسجيل في: ${course.titleAr} (${course.hoursBadgeAr}) عبر منصة رابا التعليمية.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      dir={isArabic ? 'rtl' : 'ltr'}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-[#121c24] border border-slate-200 dark:border-slate-800 rounded-[28px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header & Cover Media */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-900 overflow-hidden shrink-0">
          {isPlayingVideo ? (
            <div className="w-full h-full relative bg-black flex items-center justify-center">
              <iframe
                src={`${course.videoPreviewUrl || 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'}?autoplay=1&rel=0`}
                title={title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={() => setIsPlayingVideo(false)}
                className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-bold hover:bg-black/80 transition-colors cursor-pointer"
              >
                {isArabic ? 'إغلاق الفيديو' : 'Close Video'}
              </button>
            </div>
          ) : (
            <>
              <img 
                src={course.cardCoverUrl || '/images/courses/course_1_qba.jpg'} 
                alt={title} 
                width={800}
                height={450}
                style={{ aspectRatio: '16 / 9' }}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Floating badges & Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 left-4 rtl:left-4 rtl:right-auto ltr:right-4 ltr:left-auto z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 backdrop-blur-xs"
                aria-label={isArabic ? 'إغلاق' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute top-4 right-4 rtl:right-4 rtl:left-auto ltr:left-4 ltr:right-auto z-10 flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-[#fefce8] text-[#78350f] text-xs font-bold border border-[#fef08a] shadow-sm">
                  {course.floatingBadgeAr || 'اعتماد دولي'}
                </span>
                <span className="px-3.5 py-1 rounded-full bg-[#0d5c52] text-white text-xs font-bold shadow-sm">
                  {course.accreditationBadgeAr || 'بورد دولي'}
                </span>
              </div>

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setIsPlayingVideo(true)}
                  className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-[#0d5c52] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer group backdrop-blur-sm"
                  title={isArabic ? 'مشاهدة الفيديو التعريفي' : 'Watch Intro Video'}
                >
                  <PlayCircle className="w-9 h-9 transition-transform group-hover:scale-105" />
                </button>
              </div>

              {/* Title & Stats over Cover */}
              <div className="absolute bottom-4 right-6 left-6 z-10 text-white">
                <div className="flex items-center gap-2 text-xs text-teal-300 font-bold mb-1.5 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-lg border border-teal-500/30">
                    <CourseCustomIcon course={course} className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                    <span>{course.categoryAr}</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1 text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    <span>{course.rating || 4.9}</span>
                    <span className="text-white/60">({course.reviewsCount || 120} تقييم)</span>
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {title}
                </h2>
              </div>
            </>
          )}
        </div>

        {/* Content Tabs Navigation */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 px-6 pt-2 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#0d5c52] text-[#0d5c52] dark:border-[#2dd4bf] dark:text-[#2dd4bf]'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {isArabic ? 'نظرة عامة والهدف' : 'Overview & Goals'}
          </button>
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'syllabus'
                ? 'border-[#0d5c52] text-[#0d5c52] dark:border-[#2dd4bf] dark:text-[#2dd4bf]'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {isArabic ? 'محاور ومنهج الكورس' : 'Curriculum & Modules'}
          </button>
          <button
            onClick={() => setActiveTab('instructor')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'instructor'
                ? 'border-[#0d5c52] text-[#0d5c52] dark:border-[#2dd4bf] dark:text-[#2dd4bf]'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {isArabic ? 'المشرف والاعتماد' : 'Faculty & Accreditation'}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-fade-in">
              {/* Highlight Scope Banner */}
              <div className="p-3.5 rounded-2xl bg-[#fffdf0] dark:bg-amber-950/20 border border-[#fef08a] dark:border-amber-800/40 text-[#92400e] dark:text-amber-200 text-xs sm:text-sm font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{tagHighlight}</span>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'عن البرنامج التدريبي' : 'About The Program'}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-100 dark:border-slate-800">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
                  <Clock className="w-4 h-4 text-[#0d5c52] dark:text-[#2dd4bf] mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{hoursBadge}</div>
                  <div className="text-[10px] text-slate-500">{isArabic ? 'ساعات معتمدة' : 'Accredited Hours'}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
                  <PlayCircle className="w-4 h-4 text-[#0d5c52] dark:text-[#2dd4bf] mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{course.lessonsCount || 24} {isArabic ? 'درساً تفاعلياً' : 'Lessons'}</div>
                  <div className="text-[10px] text-slate-500">{isArabic ? 'محتوى مسجل ومباشر' : 'Live & Recorded'}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
                  <Award className="w-4 h-4 text-[#0d5c52] dark:text-[#2dd4bf] mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{isArabic ? 'شهادة معتمدة' : 'Accredited'}</div>
                  <div className="text-[10px] text-slate-500">{isArabic ? 'بورد دولي' : 'Global Board'}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
                  <Users className="w-4 h-4 text-[#0d5c52] dark:text-[#2dd4bf] mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{isArabic ? 'إشراف مباشر' : 'Mentorship'}</div>
                  <div className="text-[10px] text-slate-500">{isArabic ? 'نخبة من الاستشاريين' : 'Clinical Faculty'}</div>
                </div>
              </div>

              {/* Target Audience */}
              {course.targetAudienceAr && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isArabic ? 'الفئات المستهدفة:' : 'Target Audience:'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-150 dark:border-slate-800">
                    {isArabic ? course.targetAudienceAr : course.targetAudienceEn}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'syllabus' && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {isArabic ? 'أبرز مخرجات ومحاور الكورس التدريبي' : 'Key Learning Outcomes'}
              </h4>
              <div className="space-y-2.5">
                {features.map((feat, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#ecfdf5] dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {feat}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {isArabic ? 'تطبيقات عملية، تحليل دراسات حالة، ونماذج تدريبية محاكية للميدان الإكلينيكي.' : 'Practical applications and clinical case simulations.'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'instructor' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40">
                <div className="w-14 h-14 rounded-2xl bg-[#0d5c52] text-white flex items-center justify-center font-black shadow-md">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    {instructor}
                  </div>
                  <div className="text-xs text-[#0d5c52] dark:text-[#2dd4bf] font-bold mt-0.5">
                    {isArabic ? 'استشاري وخبير معتمد في تحليل السلوك واضطراب طيف التوحد' : 'Certified Clinical Consultant in ABA & ASD'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {isArabic ? 'خبرة عملية متقدمة في الإشراف الإكلينيكي وتأهيل الكوادر وتطبيق أحدث بروتوكولات التدخل المبكر.' : 'Extensive clinical background in supervision, board credentialing, and early intervention.'}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <ShieldCheck className="w-4 h-4 text-[#0d5c52] dark:text-[#2dd4bf]" />
                  <span>{isArabic ? 'الاعتماد الدولي والشهادة الممنوحة' : 'Accreditation & Certification'}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isArabic 
                    ? 'يحصل المتدرب عند استيفاء متطلبات الساعات التدريبية والاختبار التقييمي على شهادة إتمام معتمدة مستوفية لمعايير البورد الدولي، وتؤهل للتقديم على الاختبارات المهنية المعتمدة.'
                    : 'Upon completion, trainees receive an official certificate compliant with international board criteria.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Actions */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#121c24] border-t border-slate-200 dark:border-slate-800 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Price breakdown */}
          <div className="flex items-baseline gap-2 self-start sm:self-auto">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {course.currentPrice || course.priceDisplayAr || '990'}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isArabic ? 'ر.س' : 'SAR'}
            </span>
            {course.originalPrice && (
              <span className="text-xs text-slate-400 line-through font-normal">
                {course.originalPrice} {isArabic ? 'ر.س' : 'SAR'}
              </span>
            )}
            <span className="text-[10px] text-emerald-600 font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40">
              {isArabic ? 'شامل الحقيبة التدريبية' : 'Full Access'}
            </span>
          </div>

          {/* Buttons: Register & WhatsApp */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 flex-1 sm:flex-none"
            >
              <MessageCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>{isArabic ? 'استفسار واتساب' : 'WhatsApp'}</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onRegister(course);
              }}
              className={`py-3 px-6 ${theme.buttonBg} text-white text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer flex-1 sm:flex-none`}
            >
              <Sparkles className="w-4 h-4 fill-white" />
              <span>{isArabic ? 'سجل الآن في الكورس' : 'Register Now'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
