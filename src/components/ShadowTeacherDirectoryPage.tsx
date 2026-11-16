import React, { useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Home,
  GraduationCap,
  CheckCircle2,
  ClipboardList,
  Users,
  TrendingUp,
  CalendarCheck,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { Appointment } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ShadowTeacherSection } from './ShadowTeacherSection';
import { SiwarBraceletIcon } from './SiwarBraceletIcon';

interface ShadowTeacherDirectoryPageProps {
  onBackToHome: () => void;
  onSubmitRequest?: (request: Appointment) => void;
  onOpenBooking?: () => void;
}

export const ShadowTeacherDirectoryPage: React.FC<ShadowTeacherDirectoryPageProps> = ({
  onBackToHome,
  onSubmitRequest,
  onOpenBooking,
}) => {
  const { isArabic } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const roadmapSteps = [
    {
      step: '01',
      icon: ClipboardList,
      color: '#2B95FF',
      titleAr: 'التقييم المدرسي والوظيفي الشامل',
      titleEn: 'Comprehensive School & Functional Assessment',
      descAr: 'دراسة احتياجات الطفل داخل البيئة التعليمية وتحديد نقاط القوة والمهارات المستهدفة.',
      descEn: 'Evaluating the child’s academic and behavioral profile inside the classroom environment.',
    },
    {
      step: '02',
      icon: Users,
      color: '#10B981',
      titleAr: 'اختيار وتأهيل معلم الظل المختص',
      titleEn: 'Matching & Training Dedicated Shadow Teacher',
      descAr: 'ترشيح أخصائي أو معلم ظل مؤهل وفق خطة تعديل السلوك الفردية (IEP) وتدريبه قبل البدء.',
      descEn: 'Pairing a specialized shadow teacher trained on the child’s individualized IEP plan.',
    },
    {
      step: '03',
      icon: GraduationCap,
      color: '#8B5CF6',
      titleAr: 'المرافقة المدرسية والتدخل اليومي',
      titleEn: 'Classroom Accompaniment & Daily Support',
      descAr: 'دعم الاندماج الأكاديمي والاجتماعي داخل الصف وتيسير التفاعل الإيجابي مع الأقران والمعلمين.',
      descEn: 'Supporting classroom focus, peer interaction, and structured curriculum adaptation.',
    },
    {
      step: '04',
      icon: TrendingUp,
      color: '#F59E0B',
      titleAr: 'تقارير تقدم أسبوعية واستقلالية تدريجية',
      titleEn: 'Weekly Progress Reports & Gradual Fading',
      descAr: 'قياس تطور المهارات عبر مؤشرات دقيقة بهدف الوصول إلى الاستقلالية الكاملة داخل المدرسة.',
      descEn: 'Tracking measurable developmental gains toward independent classroom participation.',
    },
  ];

  const coveredCities = [
    { ar: 'الرياض', en: 'Riyadh' },
    { ar: 'جدة', en: 'Jeddah' },
    { ar: 'الخبر', en: 'Al-Khobar' },
    { ar: 'الأحساء', en: 'Al-Ahsa' },
    { ar: 'الخرج', en: 'Al-Kharj' },
  ];

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
                {isArabic ? 'خدمة سِوار (معلم الظل)' : 'Sewar (Shadow Teacher Service)'}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10B981]/12 border border-[#10B981]/25 text-[#047857] dark:text-[#34D399] text-xs font-black">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isArabic ? 'برنامج الدمج المدرسي المعتمد' : 'Certified School Inclusion'}</span>
            </span>

            {onOpenBooking && (
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full warm-pill-cta text-xs font-black shadow-md cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>{isArabic ? 'احجز استشارة سِوار' : 'Book Sewar Consultation'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Embedded Interactive Shadow Teacher Service Experience */}
      <ShadowTeacherSection onSubmitRequest={onSubmitRequest} />

      {/* Additional Dedicated Page Details: Inclusion Roadmap & Regional Coverage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 space-y-10">
        {/* 4-Step Inclusion Roadmap */}
        <div className="liquid-glass-panel rounded-[28px] p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2B95FF]/12 text-[#1263D6] dark:text-[#60AFFF] text-xs font-black mb-2">
                <SiwarBraceletIcon className="w-4 h-4" />
                <span>{isArabic ? 'منهجية العمل في سِوار' : 'SEWAR METHODOLOGY'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#161B26] dark:text-[#F8FAFC]">
                {isArabic
                  ? 'رحلة الطفل نحو الاندماج المدرسي الناجح'
                  : 'Four Steps to Successful School Inclusion'}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {coveredCities.map((city) => (
                <span
                  key={city.en}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full liquid-glass-pill text-[11px] font-bold text-[#161B26] dark:text-[#F8FAFC]"
                >
                  <MapPin className="w-3 h-3 text-[#2B95FF]" />
                  <span>{isArabic ? city.ar : city.en}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {roadmapSteps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="liquid-glass-card rounded-[24px] p-5 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center border"
                        style={{
                          backgroundColor: `${item.color}18`,
                          borderColor: `${item.color}35`,
                          color: item.color,
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black font-mono text-[#4B5563] dark:text-[#94A3B8]">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-[#161B26] dark:text-[#F8FAFC] mb-1.5">
                      {isArabic ? item.titleAr : item.titleEn}
                    </h3>
                    <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
                      {isArabic ? item.descAr : item.descEn}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#161B26]/[0.06] dark:border-white/10 flex items-center gap-1.5 text-[11px] font-bold text-[#047857] dark:text-[#34D399]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'متابعة إشرافية مستمرة' : 'Ongoing Supervision'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShadowTeacherDirectoryPage;
