import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Calendar,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  HelpCircle,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  Puzzle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { getStoredServices } from '../data/mockData';
import {
  getServiceSeoBySlug,
  SERVICE_SEO_ROUTES,
} from '../data/seoRoutes';
import { ServiceItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ServiceDetailPageProps {
  serviceSlug: string;
  onBackToHome: () => void;
  onNavigate: (path: string) => void;
  onSelectService: (service: ServiceItem) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  serviceSlug,
  onBackToHome,
  onNavigate,
  onSelectService,
}) => {
  const { isArabic } = useLanguage();
  const [services, setServices] = useState<ServiceItem[]>(() => getStoredServices());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [serviceSlug]);

  useEffect(() => {
    const handleUpdate = () => setServices(getStoredServices());
    window.addEventListener('raba_services_updated', handleUpdate);
    window.addEventListener('raba_persistent_sync_ready', handleUpdate);
    return () => {
      window.removeEventListener('raba_services_updated', handleUpdate);
      window.removeEventListener('raba_persistent_sync_ready', handleUpdate);
    };
  }, []);

  const seoConfig = useMemo(
    () => getServiceSeoBySlug(serviceSlug) || SERVICE_SEO_ROUTES[0],
    [serviceSlug]
  );

  const service = useMemo(() => {
    return (
      services.find((s) => s.id === seoConfig.serviceId) ||
      services[0]
    );
  }, [services, seoConfig]);

  const siblingServices = useMemo(
    () => SERVICE_SEO_ROUTES.filter((item) => item.slug !== seoConfig.slug),
    [seoConfig.slug]
  );

  const handleLinkClick = (path: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onNavigate(path);
  };

  const benefits = (isArabic ? service?.benefits : (service?.benefitsEn || service?.benefits)) || [];

  return (
    <div
      className="min-h-screen pt-6 sm:pt-10 pb-20 relative"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-[24px] liquid-glass-card">
          <nav className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#4B5563] dark:text-[#94A3B8] flex-wrap" aria-label="Breadcrumb">
            <a
              href="/"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                onBackToHome();
              }}
              className="inline-flex items-center gap-1.5 hover:text-[#1263D6] dark:hover:text-[#60AFFF] transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-[#2B95FF]" />
              <span>{isArabic ? 'الرئيسية' : 'Home'}</span>
            </a>
            <span className="opacity-50">/</span>
            <a
              href="/services"
              onClick={(e) => handleLinkClick('/services', e)}
              className="hover:text-[#1263D6] dark:hover:text-[#60AFFF] transition-colors"
            >
              {isArabic ? 'الخدمات الإكلينيكية' : 'Clinical Services'}
            </a>
            <span className="opacity-50">/</span>
            <span className="text-[#1263D6] dark:text-[#60AFFF] font-black">
              {isArabic ? seoConfig.h1 : seoConfig.h1En}
            </span>
          </nav>

          <a
            href="/services"
            onClick={(e) => handleLinkClick('/services', e)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full liquid-glass-btn text-[#161B26] dark:text-[#F8FAFC] text-xs font-black transition-all"
          >
            {isArabic ? <ArrowRight className="w-3.5 h-3.5 text-[#2B95FF]" /> : <ArrowLeft className="w-3.5 h-3.5 text-[#2B95FF]" />}
            <span>{isArabic ? 'جميع الخدمات' : 'All Services'}</span>
          </a>
        </div>
      </div>

      {/* Main Hero & Deepened Clinical Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <section className="obsidian-anchor-card rounded-[28px] p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div
            className="absolute -top-24 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(43, 149, 255, 0.22) 0%, rgba(43, 149, 255, 0) 70%)' }}
          />
          <div className="relative z-10 max-w-4xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2B95FF]/12 text-[#1263D6] dark:text-[#60AFFF] border border-[#2B95FF]/30 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isArabic ? (service?.categoryAr || 'برنامج إكلينيكي معتمد') : (service?.categoryEn || 'Accredited Clinical Program')}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#161B26] dark:text-[#F8FAFC] tracking-tight leading-tight">
              {isArabic ? seoConfig.h1 : seoConfig.h1En}
            </h1>

            <p className="text-sm sm:text-base text-[#4B5563] dark:text-[#94A3B8] leading-relaxed font-medium">
              {isArabic ? seoConfig.description : (service?.descriptionEn || seoConfig.description)}
            </p>

            {/* Key Quick Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl liquid-glass-card flex items-center gap-3">
                <Users className="w-5 h-5 text-[#2B95FF] shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-[#4B5563] dark:text-[#94A3B8]">
                    {isArabic ? 'الفئة العمرية المستهدفة' : 'Target Ages'}
                  </div>
                  <div className="text-xs sm:text-sm font-black text-[#161B26] dark:text-[#F8FAFC]">
                    {isArabic ? (service?.targetAges || 'من 1.5 إلى 14 سنة') : (service?.targetAgesEn || '1.5 to 14 years')}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl liquid-glass-card flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#10B981] shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-[#4B5563] dark:text-[#94A3B8]">
                    {isArabic ? 'مدة الجلسة / الخطة' : 'Session Format'}
                  </div>
                  <div className="text-xs sm:text-sm font-black text-[#161B26] dark:text-[#F8FAFC]">
                    {isArabic
                      ? (service?.durationMinutes ? `خطة فردية · ${service.durationMinutes} دقيقة` : 'خطة فردية 45 - 60 دقيقة')
                      : (service?.durationMinutes ? `Individual · ${service.durationMinutes} min` : 'Individual 45-60 min')}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl liquid-glass-card flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#8B5CF6] shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-[#4B5563] dark:text-[#94A3B8]">
                    {isArabic ? 'الإشراف والاعتماد' : 'Accreditation'}
                  </div>
                  <div className="text-xs sm:text-sm font-black text-[#161B26] dark:text-[#F8FAFC]">
                    {isArabic ? 'مرخص ومعتمد دولياً BACB / QABA' : 'MOH & International Standards'}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {service && (
                <button
                  onClick={() => onSelectService(service)}
                  className="warm-pill-cta px-7 py-3.5 rounded-full font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isArabic ? 'احجز تقييم البرنامج الآن' : 'Book Program Assessment'}</span>
                  {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              )}

              <a
                href="/booking"
                onClick={(e) => handleLinkClick('/booking', e)}
                className="px-5 py-3.5 rounded-full liquid-glass-btn text-[#161B26] dark:text-[#F8FAFC] font-black text-xs sm:text-sm flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#2B95FF]" />
                <span>{isArabic ? 'صفحة حجز المواعيد' : 'Booking Page'}</span>
              </a>

              <a
                href="https://wa.me/966575100100"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-full liquid-glass-btn text-[#161B26] dark:text-[#F8FAFC] font-black text-xs sm:text-sm flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#10B981]" />
                <span>{isArabic ? 'استفسار فوري عبر واتساب' : 'Ask via WhatsApp'}</span>
              </a>

              <a
                href="tel:0575100100"
                className="px-5 py-3.5 rounded-full liquid-glass-pill text-[#161B26] dark:text-[#F8FAFC] font-black text-xs sm:text-sm flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#2B95FF]" />
                <span dir="ltr">0575100100</span>
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 1 & SECTION 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 1. Target Audience & Symptoms */}
          <section className="lg:col-span-6 liquid-glass-card rounded-[28px] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#2B95FF]/15 text-[#1263D6] dark:text-[#60AFFF] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#161B26] dark:text-[#F8FAFC]">
                {isArabic ? 'لمن تناسب هذه الخدمة؟ (الفئات المستفيدة والأعراض)' : 'Who Is This Service For?'}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
              {seoConfig.targetAudienceIntro}
            </p>

            <div className="p-3.5 rounded-2xl liquid-glass-panel text-xs font-bold text-[#1263D6] dark:text-[#60AFFF]">
              {isArabic ? `الفئة العمرية: ${seoConfig.targetAgesDetail}` : seoConfig.targetAgesDetail}
            </div>

            <ul className="space-y-2.5">
              {seoConfig.symptomsChecklist.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#161B26] dark:text-[#F8FAFC]">
                  <CheckCircle2 className="w-4 h-4 text-[#2B95FF] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{symptom}</span>
                </li>
              ))}
            </ul>

            <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] leading-relaxed pt-2 border-t border-[#161B26]/[0.06] dark:border-white/10">
              {seoConfig.programVsGeneral}
            </p>
          </section>

          {/* 2. Clinical Goals & Objectives */}
          <section className="lg:col-span-6 liquid-glass-card rounded-[28px] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#047857] dark:text-[#34D399] flex items-center justify-center shrink-0">
                <Puzzle className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#161B26] dark:text-[#F8FAFC]">
                {isArabic ? 'الأهداف الإكلينيكية والتأهيلية للبرنامج' : 'Clinical & Rehabilitation Goals'}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
              {seoConfig.clinicalGoalsIntro}
            </p>

            <div className="space-y-2.5">
              {seoConfig.clinicalGoalsList.map((goal, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl liquid-glass-panel flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-[#161B26] dark:text-[#F8FAFC]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{goal}</span>
                </div>
              ))}
            </div>

            {benefits.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {benefits.slice(0, 4).map((b, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2 text-xs text-[#4B5563] dark:text-[#94A3B8]">
                    <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* SECTION 3 & SECTION 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 3. Evaluation & Session Plan */}
          <section className="lg:col-span-6 liquid-glass-card rounded-[28px] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA] flex items-center justify-center shrink-0">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#161B26] dark:text-[#F8FAFC]">
                {isArabic ? 'كيف يبدأ التقييم وخطة الجلسات في مركز رابا؟' : 'Assessment & Session Plan Journey'}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
              {seoConfig.evaluationJourneyIntro}
            </p>

            <div className="space-y-3">
              {seoConfig.evaluationSteps.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl liquid-glass-panel flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#2B95FF]/15 text-[#1263D6] dark:text-[#60AFFF] font-black text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-[#161B26] dark:text-[#F8FAFC] leading-relaxed">
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#2B95FF]/8 border border-[#2B95FF]/20 flex items-start gap-2.5">
              <Award className="w-4 h-4 text-[#2B95FF] shrink-0 mt-0.5" />
              <p className="text-xs text-[#161B26] dark:text-[#F8FAFC] leading-relaxed font-medium">
                {seoConfig.standardsNote}
              </p>
            </div>
          </section>

          {/* 4. Expected Results & Progress Measurement */}
          <section className="lg:col-span-6 liquid-glass-card rounded-[28px] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24] flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#161B26] dark:text-[#F8FAFC]">
                {isArabic ? 'النتائج المتوقعة وكيفية قياس التطور' : 'Expected Results & Progress Tracking'}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
              {seoConfig.expectedResultsIntro}
            </p>

            <ul className="space-y-2.5">
              {seoConfig.expectedOutcomes.map((outcome, idx) => (
                <li key={idx} className="p-3.5 rounded-2xl liquid-glass-panel flex items-start gap-2.5 text-xs sm:text-sm text-[#161B26] dark:text-[#F8FAFC]">
                  <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{outcome}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* SECTION 5: Branches Offering This Service */}
        <section className="liquid-glass-card rounded-[28px] p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#047857] dark:text-[#34D399] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#161B26] dark:text-[#F8FAFC]">
                {isArabic ? 'الفروع التي تقدم الخدمة في المملكة' : 'Branches Offering This Service'}
              </h2>
            </div>

            <a
              href="/booking"
              onClick={(e) => handleLinkClick('/booking', e)}
              className="warm-pill-cta px-5 py-2.5 rounded-full text-xs font-black flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isArabic ? 'احجز موعد التقييم الآن' : 'Book Evaluation Now'}</span>
            </a>
          </div>

          <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
            {seoConfig.branchesSectionText}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/branches/riyadh"
              onClick={(e) => handleLinkClick('/branches/riyadh', e)}
              className="p-4 rounded-2xl liquid-glass-panel hover:border-[#2B95FF]/40 transition-all flex items-center justify-between gap-3 group"
            >
              <div>
                <h3 className="text-sm font-black text-[#161B26] dark:text-[#F8FAFC] group-hover:text-[#1263D6] dark:group-hover:text-[#60AFFF]">
                  {isArabic ? 'مركز رابا في الرياض (5 فروع)' : 'Raba Center in Riyadh (5 Branches)'}
                </h3>
                <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] mt-1">
                  {isArabic ? 'المغرزات، الصحافة، حطين، النرجس، والربوة' : 'Al-Mugharrazat, Al-Sahafah, Hittin, Al-Narjis & Al-Rabwah'}
                </p>
              </div>
              {isArabic ? <ArrowLeft className="w-4 h-4 text-[#2B95FF] shrink-0" /> : <ArrowRight className="w-4 h-4 text-[#2B95FF] shrink-0" />}
            </a>

            <a
              href="/branches/alkharj"
              onClick={(e) => handleLinkClick('/branches/alkharj', e)}
              className="p-4 rounded-2xl liquid-glass-panel hover:border-[#2B95FF]/40 transition-all flex items-center justify-between gap-3 group"
            >
              <div>
                <h3 className="text-sm font-black text-[#161B26] dark:text-[#F8FAFC] group-hover:text-[#1263D6] dark:group-hover:text-[#60AFFF]">
                  {isArabic ? 'مركز رابا في الخرج' : 'Raba Center in Al-Kharj'}
                </h3>
                <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] mt-1">
                  {isArabic ? 'حي اليمامة – داخل مقر جمعية التنمية الاجتماعية' : 'Al-Yamamah District – Social Development Association'}
                </p>
              </div>
              {isArabic ? <ArrowLeft className="w-4 h-4 text-[#2B95FF] shrink-0" /> : <ArrowRight className="w-4 h-4 text-[#2B95FF] shrink-0" />}
            </a>
          </div>
        </section>

        {/* SECTION 6: 6 Detailed FAQs (Synced 1:1 with FAQPage JSON-LD) */}
        <section className="liquid-glass-card rounded-[28px] p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5 text-[#1263D6] dark:text-[#60AFFF] font-black">
            <HelpCircle className="w-5 h-5 shrink-0" />
            <h2 className="text-lg sm:text-2xl font-black text-[#161B26] dark:text-[#F8FAFC]">
              {isArabic ? 'الأسئلة الشائعة حول الخدمة (FAQ)' : 'Frequently Asked Questions (FAQ)'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seoConfig.faq.map((item, idx) => (
              <div key={idx} className="p-4 sm:p-5 rounded-2xl liquid-glass-panel space-y-2">
                <h3 className="text-xs sm:text-sm font-black text-[#161B26] dark:text-[#F8FAFC]">
                  {item.question}
                </h3>
                <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Crawlable Sibling Services Links */}
        <section className="liquid-glass-panel rounded-[28px] p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg sm:text-xl font-black text-[#161B26] dark:text-[#F8FAFC]">
              {isArabic ? 'برامج وخدمات تأهيلية أخرى في مركز رابا' : 'Other Specialized Rehabilitation Services'}
            </h2>
            <a
              href="/services"
              onClick={(e) => handleLinkClick('/services', e)}
              className="text-xs font-black text-[#1263D6] dark:text-[#60AFFF] hover:underline"
            >
              {isArabic ? 'عرض الدليل الشامل للخدمات ←' : 'View Full Directory →'}
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {siblingServices.map((sib) => (
              <a
                key={sib.slug}
                href={`/services/${sib.slug}`}
                onClick={(e) => handleLinkClick(`/services/${sib.slug}`, e)}
                className="p-4 rounded-2xl liquid-glass-card hover:border-[#2B95FF]/50 transition-all flex flex-col justify-between gap-2 group"
              >
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-[#161B26] dark:text-[#F8FAFC] group-hover:text-[#1263D6] dark:group-hover:text-[#60AFFF] transition-colors">
                    {isArabic ? sib.h1 : sib.h1En}
                  </h3>
                  <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] line-clamp-2 leading-relaxed">
                    {sib.description}
                  </p>
                </div>
                <span className="text-[11px] font-black text-[#1263D6] dark:text-[#60AFFF] inline-flex items-center gap-1 pt-1">
                  <span>{isArabic ? 'تفاصيل الخدمة' : 'Explore Service'}</span>
                  {isArabic ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
