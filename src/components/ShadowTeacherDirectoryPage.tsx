import React, { useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Award,
  GraduationCap,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  HelpCircle,
  Home,
  Users,
  TrendingUp,
  CalendarCheck,
  ShieldCheck,
  MapPin,
  Puzzle,
  Check,
} from 'lucide-react';
import { Appointment } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { SHADOW_TEACHER_SEO_CONTENT } from '../data/seoRoutes';
import { ShadowTeacherSection } from './ShadowTeacherSection';
import { SiwarBraceletIcon } from './SiwarBraceletIcon';

interface ShadowTeacherDirectoryPageProps {
  onBackToHome: () => void;
  onSubmitRequest?: (request: Appointment) => void;
  onOpenBooking?: () => void;
  onNavigate?: (path: string) => void;
}

export const ShadowTeacherDirectoryPage: React.FC<ShadowTeacherDirectoryPageProps> = ({
  onBackToHome,
  onSubmitRequest,
  onOpenBooking,
  onNavigate,
}) => {
  const { isArabic } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLinkClick = (path: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!onNavigate || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onNavigate(path);
  };

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
    { ar: 'الرياض', en: 'Riyadh', path: '/branches/riyadh' },
    { ar: 'جدة', en: 'Jeddah', path: '/branches' },
    { ar: 'الخبر', en: 'Al-Khobar', path: '/branches' },
    { ar: 'الأحساء', en: 'Al-Ahsa', path: '/branches' },
    { ar: 'الخرج', en: 'Al-Kharj', path: '/branches/alkharj' },
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
      <ShadowTeacherSection onSubmitRequest={onSubmitRequest} headingTag="h1" />

      {/* Additional Dedicated Page Details: Inclusion Roadmap & 6 Clinical SEO Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 space-y-8">
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
                <a
                  key={city.en}
                  href={city.path}
                  onClick={(e) => handleLinkClick(city.path, e)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full liquid-glass-pill text-[11px] font-bold text-[#161B26] dark:text-[#F8FAFC] hover:text-[#1263D6] dark:hover:text-[#60AFFF]"
                >
                  <MapPin className="w-3 h-3 text-[#2B95FF]" />
                  <span>{isArabic ? city.ar : city.en}</span>
                </a>
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

        {/* 6 Required Deepened Clinical Sections for Shadow Teacher */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-6 liquid-glass-card rounded-[28px] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#2B95FF]/15 text-[#1263D6] dark:text-[#60AFFF] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#161B26] dark:text-[#F8FAFC]">
                {isArabic ? 'لمن تناسب هذه الخدمة؟ (الفئات المستفيدة والأعراض)' : 'Who Needs a Shadow Teacher?'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
              {SHADOW_TEACHER_SEO_CONTENT.targetAudienceIntro}
            </p>
            <div className="p-3.5 rounded-2xl liquid-glass-panel text-xs font-bold text-[#1263D6] dark:text-[#60AFFF]">
              {isArabic ? `الفئة العمرية: ${SHADOW_TEACHER_SEO_CONTENT.targetAgesDetail}` : SHADOW_TEACHER_SEO_CONTENT.targetAgesDetail}
            </div>
            <ul className="space-y-2.5">
              {SHADOW_TEACHER_SEO_CONTENT.symptomsChecklist.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#161B26] dark:text-[#F8FAFC]">
                  <CheckCircle2 className="w-4 h-4 text-[#2B95FF] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] leading-relaxed pt-2 border-t border-[#161B26]/[0.06] dark:border-white/10">
              {SHADOW_TEACHER_SEO_CONTENT.programVsGeneral}
            </p>
          </section>

          <section className="lg:col-span-6 liquid-glass-card rounded-[28px] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#047857] dark:text-[#34D399] flex items-center justify-center shrink-0">
                <Puzzle className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#161B26] dark:text-[#F8FAFC]">
                {isArabic ? 'الأهداف الإكلينيكية والتأهيلية للبرنامج' : 'Clinical & Inclusion Objectives'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
              {SHADOW_TEACHER_SEO_CONTENT.clinicalGoalsIntro}
            </p>
            <div className="space-y-2.5">
              {SHADOW_TEACHER_SEO_CONTENT.clinicalGoalsList.map((g, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl liquid-glass-panel flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-[#161B26] dark:text-[#F8FAFC]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{g}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-6 liquid-glass-card rounded-[28px] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA] flex items-center justify-center shrink-0">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#161B26] dark:text-[#F8FAFC]">
                {isArabic ? 'كيف يبدأ التقييم وخطة الجلسات في مركز رابا؟' : 'Assessment & Placement Plan'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
              {SHADOW_TEACHER_SEO_CONTENT.evaluationJourneyIntro}
            </p>
            <div className="space-y-3">
              {SHADOW_TEACHER_SEO_CONTENT.evaluationSteps.map((st, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl liquid-glass-panel flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#2B95FF]/15 text-[#1263D6] dark:text-[#60AFFF] font-black text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-[#161B26] dark:text-[#F8FAFC] leading-relaxed">
                    {st}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-2xl bg-[#2B95FF]/8 border border-[#2B95FF]/20 flex items-start gap-2.5">
              <Award className="w-4 h-4 text-[#2B95FF] shrink-0 mt-0.5" />
              <p className="text-xs text-[#161B26] dark:text-[#F8FAFC] leading-relaxed font-medium">
                {SHADOW_TEACHER_SEO_CONTENT.standardsNote}
              </p>
            </div>
          </section>

          <section className="lg:col-span-6 liquid-glass-card rounded-[28px] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24] flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#161B26] dark:text-[#F8FAFC]">
                {isArabic ? 'النتائج المتوقعة وكيفية قياس التطور' : 'Expected Outcomes & Fading Plan'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
              {SHADOW_TEACHER_SEO_CONTENT.expectedResultsIntro}
            </p>
            <ul className="space-y-2.5">
              {SHADOW_TEACHER_SEO_CONTENT.expectedOutcomes.map((o, idx) => (
                <li key={idx} className="p-3.5 rounded-2xl liquid-glass-panel flex items-start gap-2.5 text-xs sm:text-sm text-[#161B26] dark:text-[#F8FAFC]">
                  <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{o}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Branches Offering Sewar */}
        <section className="liquid-glass-card rounded-[28px] p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#047857] dark:text-[#34D399] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#161B26] dark:text-[#F8FAFC]">
                {isArabic ? 'الفروع التي تقدم الخدمة في المملكة' : 'Branches Coordinating Sewar Service'}
              </h2>
            </div>
            <a
              href="/booking"
              onClick={(e) => handleLinkClick('/booking', e)}
              className="warm-pill-cta px-5 py-2.5 rounded-full text-xs font-black flex items-center gap-1.5"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>{isArabic ? 'احجز استشارة سِوار' : 'Book Sewar Consultation'}</span>
            </a>
          </div>
          <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
            {SHADOW_TEACHER_SEO_CONTENT.branchesSectionText}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/branches/riyadh"
              onClick={(e) => handleLinkClick('/branches/riyadh', e)}
              className="p-4 rounded-2xl liquid-glass-panel hover:border-[#2B95FF]/40 transition-all flex items-center justify-between gap-3 group"
            >
              <div>
                <h3 className="text-sm font-black text-[#161B26] dark:text-[#F8FAFC] group-hover:text-[#1263D6] dark:group-hover:text-[#60AFFF]">
                  {isArabic ? 'فروع مركز رابا في الرياض' : 'Raba Center Riyadh'}
                </h3>
                <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] mt-1">
                  {isArabic ? 'المغرزات، الصحافة، حطين، النرجس، الربوة' : 'Riyadh Branches'}
                </p>
              </div>
              {isArabic ? <ArrowLeft className="w-4 h-4 text-[#2B95FF]" /> : <ArrowRight className="w-4 h-4 text-[#2B95FF]" />}
            </a>
            <a
              href="/branches/alkharj"
              onClick={(e) => handleLinkClick('/branches/alkharj', e)}
              className="p-4 rounded-2xl liquid-glass-panel hover:border-[#2B95FF]/40 transition-all flex items-center justify-between gap-3 group"
            >
              <div>
                <h3 className="text-sm font-black text-[#161B26] dark:text-[#F8FAFC] group-hover:text-[#1263D6] dark:group-hover:text-[#60AFFF]">
                  {isArabic ? 'فرع مركز رابا في الخرج' : 'Raba Center Al-Kharj'}
                </h3>
                <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] mt-1">
                  {isArabic ? 'حي اليمامة – جمعية التنمية الاجتماعية' : 'Al-Yamamah District'}
                </p>
              </div>
              {isArabic ? <ArrowLeft className="w-4 h-4 text-[#2B95FF]" /> : <ArrowRight className="w-4 h-4 text-[#2B95FF]" />}
            </a>
          </div>
        </section>

        {/* 6 FAQs */}
        <section className="liquid-glass-card rounded-[28px] p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5 text-[#1263D6] dark:text-[#60AFFF]">
            <HelpCircle className="w-5 h-5 shrink-0" />
            <h2 className="text-lg sm:text-2xl font-black text-[#161B26] dark:text-[#F8FAFC]">
              {isArabic ? 'الأسئلة الشائعة حول الخدمة (FAQ)' : 'Frequently Asked Questions (FAQ)'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SHADOW_TEACHER_SEO_CONTENT.faq.map((q, idx) => (
              <div key={idx} className="p-4 sm:p-5 rounded-2xl liquid-glass-panel space-y-2">
                <h3 className="text-xs sm:text-sm font-black text-[#161B26] dark:text-[#F8FAFC]">
                  {q.question}
                </h3>
                <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
                  {q.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShadowTeacherDirectoryPage;
