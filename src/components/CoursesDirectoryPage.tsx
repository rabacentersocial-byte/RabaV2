import React, { useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CalendarCheck,
  Home,
  ShieldCheck,
} from 'lucide-react';
import { CourseItem } from '../data/coursesData';
import { useLanguage } from '../context/LanguageContext';
import { CoursesSliderSection } from './CoursesSliderSection';

interface CoursesDirectoryPageProps {
  onBackToHome: () => void;
  onRegisterCourse: (course: CourseItem) => void;
  onOpenBooking?: () => void;
}

export const CoursesDirectoryPage: React.FC<CoursesDirectoryPageProps> = ({
  onBackToHome,
  onRegisterCourse,
  onOpenBooking,
}) => {
  const { isArabic } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div
      className="min-h-screen pt-6 sm:pt-10 pb-16 relative"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Top Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-[24px] liquid-glass-card">
          <div className="flex items-center gap-2.5 flex-wrap">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onBackToHome();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass-btn text-xs sm:text-sm font-black text-[#161B26] dark:text-[#F8FAFC] hover:text-[#1263D6] dark:hover:text-[#60AFFF] transition-colors"
            >
              {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{isArabic ? 'العودة للرئيسية' : 'Back to Home'}</span>
            </a>

            <nav className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#4B5563] dark:text-[#94A3B8]" aria-label="Breadcrumb">
              <Home className="w-3.5 h-3.5 text-[#2B95FF]" />
              <span>/</span>
              <span className="text-[#1263D6] dark:text-[#60AFFF] font-black">
                {isArabic ? 'الدورات التدريبية' : 'Training Courses'}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8B5CF6]/12 border border-[#8B5CF6]/25 text-[#6D28D9] dark:text-[#A78BFA] text-xs font-black">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isArabic ? 'اعتماد QABA و IBCCES' : 'QABA & IBCCES Accredited'}</span>
            </span>

            {onOpenBooking && (
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full warm-pill-cta text-xs font-black shadow-md cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>{isArabic ? 'حجز استشارة' : 'Book Consultation'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Single H1 Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="obsidian-anchor-card rounded-[28px] p-6 sm:p-10 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2B95FF]/12 text-[#1263D6] dark:text-[#60AFFF] border border-[#2B95FF]/30 text-xs font-black mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>{isArabic ? 'التأهيل المهني وتدريب الأسر' : 'PROFESSIONAL & FAMILY TRAINING'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#161B26] dark:text-[#F8FAFC] tracking-tight leading-tight mb-3">
            {isArabic ? 'الدورات التدريبية وورش العمل المعتمدة' : 'Accredited Training Courses & Workshops'}
          </h1>
          <p className="text-sm sm:text-base text-[#4B5563] dark:text-[#94A3B8] max-w-3xl leading-relaxed">
            {isArabic
              ? 'مسارات تأهيل دولية في تحليل السلوك التطبيقي ABA وإعداد الأخصائيين وأولياء الأمور بإشراف استشاريين معتمدين.'
              : 'International qualification tracks in Applied Behavior Analysis (ABA) and developmental care.'}
          </p>
        </div>
      </div>

      {/* Courses Catalog Section */}
      <CoursesSliderSection onRegisterCourse={onRegisterCourse} />
    </div>
  );
};

export default CoursesDirectoryPage;
