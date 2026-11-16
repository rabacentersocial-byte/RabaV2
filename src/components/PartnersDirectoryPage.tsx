import React, { useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Home,
  Handshake,
  ShieldCheck,
  CalendarCheck,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PartnersSection } from './PartnersSection';

interface PartnersDirectoryPageProps {
  onBackToHome: () => void;
  onOpenBooking?: () => void;
}

export const PartnersDirectoryPage: React.FC<PartnersDirectoryPageProps> = ({
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
                {isArabic ? 'شركاء النجاح' : 'Success Partners'}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2B95FF]/12 border border-[#2B95FF]/25 text-[#1263D6] dark:text-[#60AFFF] text-xs font-black">
              <Handshake className="w-3.5 h-3.5" />
              <span>{isArabic ? 'شراكات استراتيجية ومؤسسية' : 'Strategic Alliances'}</span>
            </span>

            {onOpenBooking && (
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full warm-pill-cta text-xs font-black shadow-md cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>{isArabic ? 'تواصل للشراكات أو الحجز' : 'Partner or Book Now'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Interactive Partners Directory (Grid Default with View Switcher & Filters) */}
      <PartnersSection defaultViewMode="grid" />

      {/* Institutional Partnership Inquiry Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14">
        <div className="liquid-glass-panel rounded-[28px] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/12 text-[#047857] dark:text-[#34D399] text-xs font-black">
              <Building2 className="w-3.5 h-3.5" />
              <span>{isArabic ? 'بوابة الشراكات المؤسسية' : 'INSTITUTIONAL PARTNERSHIPS'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#161B26] dark:text-[#F8FAFC]">
              {isArabic
                ? 'هل تمثل جهة تعليمية، طبية، أو مؤسسة راغبة في الشراكة؟'
                : 'Representing an Educational, Medical, or Corporate Institution?'}
            </h3>
            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
              {isArabic
                ? 'يرحب مركز رابا ببناء شراكات فعّالة في مجالات الدمج المدرسي، التدريب التخصصي، وتسهيلات الرعاية الصحية والتأهيلية.'
                : 'RABA Center welcomes strategic partnerships in school inclusion, specialist training, and developmental care enablement.'}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold text-[#161B26] dark:text-[#F8FAFC]">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                {isArabic ? 'اتفاقيات تأمين وتقسيط' : 'Insurance & Financing Deals'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2B95FF]" />
                {isArabic ? 'اعتمادات مهنية معتمدة' : 'Certified Clinical Programs'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://wa.me/966575100100"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-full warm-pill-cta text-xs sm:text-sm font-black shadow-md"
            >
              {isArabic ? 'تواصل مع إدارة الشراكات' : 'Contact Partnerships Team'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnersDirectoryPage;
