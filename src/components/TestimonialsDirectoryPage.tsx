import React, { useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Home,
  Star,
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';
import { ParentReview } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { TestimonialsSection } from './TestimonialsSection';

interface TestimonialsDirectoryPageProps {
  testimonials?: ParentReview[];
  onAddTestimonial?: (review: ParentReview) => void;
  onBackToHome: () => void;
  onOpenBooking?: () => void;
}

export const TestimonialsDirectoryPage: React.FC<TestimonialsDirectoryPageProps> = ({
  testimonials,
  onAddTestimonial,
  onBackToHome,
  onOpenBooking,
}) => {
  const { isArabic } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div
      className="min-h-screen pt-6 sm:pt-10 pb-20 relative"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Top Executive Navigation & Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-[24px] liquid-glass-card">
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass-btn text-xs sm:text-sm font-black text-[#161B26] dark:text-[#F8FAFC] hover:text-[#1263D6] dark:hover:text-[#60AFFF] transition-colors cursor-pointer"
            >
              {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{isArabic ? 'العودة للرئيسية' : 'Back to Home'}</span>
            </button>

            <nav className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#4B5563] dark:text-[#94A3B8]">
              <Home className="w-3.5 h-3.5 text-[#2B95FF]" />
              <span>/</span>
              <span className="text-[#1263D6] dark:text-[#60AFFF] font-black">
                {isArabic ? 'آراء العملاء' : 'Client Reviews'}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F59E0B]/12 border border-[#F59E0B]/25 text-[#B45309] dark:text-[#FBBF24] text-xs font-black">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{isArabic ? 'تقييم 4.9 / 5 من أولياء الأمور' : '4.9 / 5 Verified Parent Rating'}</span>
            </span>

            <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10B981]/12 border border-[#10B981]/25 text-[#047857] dark:text-[#34D399] text-xs font-black">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isArabic ? 'تجارب موثقة' : 'Verified Reviews'}</span>
            </span>

            {onOpenBooking && (
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full warm-pill-cta text-xs font-black shadow-md cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>{isArabic ? 'احجز موعدك الآن' : 'Book Appointment'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Testimonials Directory in Full Grid Layout */}
      <TestimonialsSection
        testimonials={testimonials}
        onAddTestimonial={onAddTestimonial}
        defaultLayout="grid"
        headingTag="h1"
      />
    </div>
  );
};

export default TestimonialsDirectoryPage;
