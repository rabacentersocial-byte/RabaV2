import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  HelpCircle,
  Home,
  MessageCircle,
  Phone,
  Puzzle,
  ShieldCheck,
  Sparkles,
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

      {/* Main Hero & Details Card */}
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

        {/* Detailed Program Overview & Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 liquid-glass-card rounded-[28px] p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#2B95FF]/15 text-[#1263D6] dark:text-[#60AFFF] flex items-center justify-center">
                <Puzzle className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#161B26] dark:text-[#F8FAFC]">
                {isArabic ? 'أبرز أهداف ومخرجات البرنامج العلاجي' : 'Key Clinical Objectives & Outcomes'}
              </h2>
            </div>

            {service?.description && (
              <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
                {isArabic ? service.description : (service.descriptionEn || service.description)}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl liquid-glass-panel flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-[#161B26] dark:text-[#F8FAFC]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ & Assessment Journey */}
          <div className="lg:col-span-5 space-y-6">
            {seoConfig.faq && seoConfig.faq.length > 0 && (
              <div className="liquid-glass-card rounded-[28px] p-6 sm:p-7 space-y-4">
                <div className="flex items-center gap-2 text-[#1263D6] dark:text-[#60AFFF] font-black text-base sm:text-lg">
                  <HelpCircle className="w-5 h-5" />
                  <h2>{isArabic ? 'الأسئلة الشائعة حول الخدمة' : 'Frequently Asked Questions'}</h2>
                </div>
                <div className="space-y-3">
                  {seoConfig.faq.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl liquid-glass-panel space-y-1.5">
                      <h3 className="text-xs sm:text-sm font-black text-[#161B26] dark:text-[#F8FAFC]">
                        {item.question}
                      </h3>
                      <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Pathway Steps */}
            <div className="liquid-glass-card rounded-[28px] p-6 sm:p-7 space-y-4">
              <h2 className="text-base sm:text-lg font-black text-[#161B26] dark:text-[#F8FAFC]">
                {isArabic ? 'خطوات البدء في مركز رابا' : 'How to Get Started'}
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8]">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2B95FF] shrink-0 mt-0.5" />
                  <span>{isArabic ? 'حجز جلسة التقييم المبدئي وتحديد الفرع المناسب.' : 'Book an initial developmental evaluation at your nearest branch.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span>{isArabic ? 'بناء خطة تدخل فردية (IEP) بمؤشرات قياس دورية.' : 'Receive a customized Individualized Education & Therapy Plan.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                  <span>{isArabic ? 'متابعة مستمرة وإرشاد وتدريب الأسرة لضمان استدامة التطور.' : 'Ongoing progress tracking and parent coaching.'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

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
