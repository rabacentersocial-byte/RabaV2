import React, { useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CalendarCheck,
  Home,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { StatsBar } from './StatsBar';
import { AboutSection } from './AboutSection';
import { AccreditationsSection } from './AccreditationsSection';

interface AboutDirectoryPageProps {
  onBackToHome: () => void;
  onOpenBooking?: () => void;
}

export const AboutDirectoryPage: React.FC<AboutDirectoryPageProps> = ({
  onBackToHome,
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
      {/* Top Navigation & Breadcrumb */}
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
                {isArabic ? 'عن مركز رابا' : 'About Raba Center'}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10B981]/12 border border-[#10B981]/25 text-[#047857] dark:text-[#34D399] text-xs font-black">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isArabic ? 'اعتماد BACB و ISO منذ +18 عاماً' : 'BACB & ISO Certified (+18 Years)'}</span>
            </span>

            {onOpenBooking && (
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full warm-pill-cta text-xs font-black shadow-md cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>{isArabic ? 'حجز استشارة الآن' : 'Book Consultation'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dedicated Single H1 Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="obsidian-anchor-card rounded-[28px] p-6 sm:p-10 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2B95FF]/12 text-[#1263D6] dark:text-[#60AFFF] border border-[#2B95FF]/30 text-xs font-black mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>{isArabic ? 'من نحن · رسالة مركز رابا' : 'ABOUT US · RABA MISSION'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#161B26] dark:text-[#F8FAFC] tracking-tight leading-tight mb-3">
            {isArabic
              ? 'عن مركز رابا للتأهيل وتحليل السلوك التطبيقي'
              : 'About Raba Center for Applied Behavior Analysis & Rehabilitation'}
          </h1>

          <p className="text-sm sm:text-base text-[#4B5563] dark:text-[#94A3B8] max-w-3xl leading-relaxed font-medium">
            {isArabic
              ? 'من أقدم المراكز المتخصصة في المملكة العربية السعودية لتقديم خدمات التأهيل والرعاية النهارية لذوي اضطراب طيف التوحد وصعوبات التعلم وفق أحدث البروتوكولات العلمية المعتمدة.'
              : 'One of the earliest specialized centers in Saudi Arabia delivering evidence-based Applied Behavior Analysis and developmental rehabilitation programs.'}
          </p>
        </div>
      </div>

      {/* Dedicated About Sections */}
      <StatsBar />
      <AboutSection />
      <AccreditationsSection />
    </div>
  );
};

export default AboutDirectoryPage;
