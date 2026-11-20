import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  HelpCircle,
  Home,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { BRANCHES_DATA, BranchItem } from '../data/branchesData';
import {
  getBranchSeoBySlug,
  SERVICE_SEO_ROUTES,
  SHADOW_TEACHER_SEO_CONTENT,
} from '../data/seoRoutes';
import { BranchMapPinGraphic } from './BranchMapPinGraphic';
import { useLanguage } from '../context/LanguageContext';
import { useLiveDataOptional } from '../context/LiveDataContext';

interface BranchDetailPageProps {
  branchSlug: 'riyadh' | 'alkharj';
  onBackToHome: () => void;
  onNavigate: (path: string) => void;
  onOpenBooking: (notes?: string) => void;
}

export const BranchDetailPage: React.FC<BranchDetailPageProps> = ({
  branchSlug,
  onBackToHome,
  onNavigate,
  onOpenBooking,
}) => {
  const { isArabic } = useLanguage();
  const live = useLiveDataOptional();
  const branches: BranchItem[] = live?.branches || BRANCHES_DATA;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [branchSlug]);

  const branchSeo = useMemo(
    () => getBranchSeoBySlug(branchSlug)!,
    [branchSlug]
  );

  const cityKey = branchSlug === 'riyadh' ? 'riyadh' : 'kharj';
  const cityBranches = useMemo(
    () => branches.filter((b) => b.city === cityKey),
    [branches, cityKey]
  );

  const otherBranchSlug = branchSlug === 'riyadh' ? 'alkharj' : 'riyadh';
  const otherBranchLabelAr =
    branchSlug === 'riyadh'
      ? 'استعراض فرع الخرج'
      : 'استعراض فروع الرياض';
  const otherBranchLabelEn =
    branchSlug === 'riyadh'
      ? 'Explore Al-Kharj Branch'
      : 'Explore Riyadh Branches';

  const handleLinkClick = (path: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onNavigate(path);
  };

  const handleCopyAddress = (branch: BranchItem) => {
    const text = `${branch.name} - ${branch.address}`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedId(branch.id);
        setTimeout(() => setCopiedId(null), 2500);
      })
      .catch(() => {});
  };

  return (
    <div
      className="min-h-screen pt-6 sm:pt-10 pb-20 relative"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-[24px] liquid-glass-card">
          <nav
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#4B5563] dark:text-[#94A3B8] flex-wrap"
            aria-label="Breadcrumb"
          >
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
              href="/branches"
              onClick={(e) => handleLinkClick('/branches', e)}
              className="hover:text-[#1263D6] dark:hover:text-[#60AFFF] transition-colors"
            >
              {isArabic ? 'فروع مركز رابا' : 'Branches'}
            </a>
            <span className="opacity-50">/</span>
            <span className="text-[#1263D6] dark:text-[#60AFFF] font-black">
              {isArabic ? `فرع ${branchSeo.cityNameAr}` : `${branchSeo.cityNameEn} Branch`}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`/branches/${otherBranchSlug}`}
              onClick={(e) => handleLinkClick(`/branches/${otherBranchSlug}`, e)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full liquid-glass-pill text-[#1263D6] dark:text-[#60AFFF] text-xs font-black transition-all"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{isArabic ? otherBranchLabelAr : otherBranchLabelEn}</span>
            </a>
            <a
              href="/branches"
              onClick={(e) => handleLinkClick('/branches', e)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full liquid-glass-btn text-[#161B26] dark:text-[#F8FAFC] text-xs font-black transition-all"
            >
              {isArabic ? (
                <ArrowRight className="w-3.5 h-3.5 text-[#2B95FF]" />
              ) : (
                <ArrowLeft className="w-3.5 h-3.5 text-[#2B95FF]" />
              )}
              <span>{isArabic ? 'جميع الفروع' : 'All Branches'}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Local SEO Card */}
        <section className="obsidian-anchor-card rounded-[28px] p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div
            className="absolute -top-24 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(43, 149, 255, 0.22) 0%, rgba(43, 149, 255, 0) 70%)',
            }}
          />
          <div className="relative z-10 max-w-4xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2B95FF]/12 text-[#1263D6] dark:text-[#60AFFF] border border-[#2B95FF]/30 text-xs font-black">
              <Building2 className="w-3.5 h-3.5" />
              <span>
                {isArabic
                  ? `الفرع المعتمد في ${branchSeo.cityNameAr}`
                  : `Certified Raba Center — ${branchSeo.cityNameEn}`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#161B26] dark:text-[#F8FAFC] tracking-tight leading-tight">
              {isArabic ? branchSeo.h1 : branchSeo.h1En}
            </h1>

            <p className="text-sm sm:text-base text-[#4B5563] dark:text-[#94A3B8] leading-relaxed font-medium">
              {isArabic ? branchSeo.introText : branchSeo.introTextEn}
            </p>

            {/* Quick Local Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl liquid-glass-card flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#2B95FF] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-[#4B5563] dark:text-[#94A3B8]">
                    {isArabic ? 'العنوان والتغطية' : 'Location'}
                  </div>
                  <div className="text-xs sm:text-sm font-black text-[#161B26] dark:text-[#F8FAFC]">
                    {isArabic ? branchSeo.address : branchSeo.addressEn}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl liquid-glass-card flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-[#4B5563] dark:text-[#94A3B8]">
                    {isArabic ? 'ساعات العمل' : 'Working Hours'}
                  </div>
                  <div className="text-xs sm:text-sm font-black text-[#161B26] dark:text-[#F8FAFC]">
                    {isArabic ? branchSeo.hoursAr : branchSeo.hoursEn}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl liquid-glass-card flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#8B5CF6] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-[#4B5563] dark:text-[#94A3B8]">
                    {isArabic ? 'الرقم الموحد والحجز' : 'Phone & WhatsApp'}
                  </div>
                  <div className="text-xs sm:text-sm font-black text-[#161B26] dark:text-[#F8FAFC]" dir="ltr">
                    {branchSeo.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="/booking"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  onOpenBooking(`حجز موعد في فرع مركز رابا (${branchSeo.cityNameAr})`);
                }}
                className="warm-pill-cta px-7 py-3.5 rounded-full font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>
                  {isArabic
                    ? `احجز موعداً في ${branchSeo.cityNameAr}`
                    : `Book in ${branchSeo.cityNameEn}`}
                </span>
              </a>

              <a
                href={branchSeo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-full bg-[#047857] hover:bg-[#065F46] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isArabic ? 'تواصل عبر واتساب' : 'WhatsApp'}</span>
              </a>

              <a
                href={branchSeo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-full liquid-glass-btn text-[#161B26] dark:text-[#F8FAFC] font-black text-xs sm:text-sm flex items-center gap-2"
              >
                <Navigation className="w-4 h-4 text-[#2B95FF]" />
                <span>{isArabic ? 'الموقع على خرائط Google' : 'Google Maps'}</span>
              </a>
            </div>
          </div>
        </section>

        {/* Sub-branches Cards */}
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-[#161B26] dark:text-[#F8FAFC]">
              {isArabic
                ? branchSlug === 'riyadh'
                  ? 'مواقع فروع مركز رابا في الرياض (5 فروع معتمدة)'
                  : 'موقع وتفاصيل فرع مركز رابا في الخرج'
                : `${branchSeo.cityNameEn} Branch Locations`}
            </h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass-pill text-xs font-black text-[#1263D6] dark:text-[#60AFFF]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {cityBranches.length}{' '}
                {isArabic
                  ? cityBranches.length > 1
                    ? 'فروع في الرياض'
                    : 'فرع معتمد'
                  : 'Locations'}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityBranches.map((branch) => {
              const isCopied = copiedId === branch.id;
              return (
                <div
                  key={branch.id}
                  className="liquid-glass-card rounded-[28px] overflow-hidden shadow-lg hover:border-[#2B95FF]/50 transition-all flex flex-col justify-between"
                >
                  <div className="relative h-44 bg-[#E0F2FE] dark:bg-[#141821] overflow-hidden">
                    <BranchMapPinGraphic branchName={branch.name} />
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#141821]/85 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#161B26] dark:text-[#F8FAFC] border border-[#161B26]/10 dark:border-white/10 flex items-center gap-1.5 shadow-sm">
                      <MapPin className="w-3.5 h-3.5 text-[#2B95FF]" />
                      <span>{isArabic ? branch.regionBadgeAr : branch.regionBadgeEn}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <h3 className="text-lg font-black text-[#161B26] dark:text-[#F8FAFC]">
                        {isArabic ? branch.name : branch.nameEn}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#4B5563] dark:text-[#94A3B8]">
                        <Clock className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                        <span>{isArabic ? branch.hoursAr : branch.hoursEn}</span>
                      </div>

                      <div className="liquid-glass-panel p-3 rounded-2xl flex items-start justify-between gap-2">
                        <div className="text-xs text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
                          <strong className="block text-[#161B26] dark:text-[#F8FAFC] mb-0.5">
                            {isArabic ? 'العنوان التفصيلي:' : 'Address:'}
                          </strong>
                          <span>{isArabic ? branch.address : branch.addressEn}</span>
                        </div>
                        <button
                          onClick={() => handleCopyAddress(branch)}
                          title={isArabic ? 'نسخ العنوان' : 'Copy address'}
                          className={`p-1.5 rounded-full border shrink-0 cursor-pointer transition-colors ${
                            isCopied
                              ? 'bg-[#047857] text-white border-[#065F46]'
                              : 'liquid-glass-btn text-[#4B5563] dark:text-[#94A3B8]'
                          }`}
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#161B26]/[0.08] dark:border-white/10">
                      <button
                        onClick={() =>
                          onOpenBooking(`حجز في ${branch.name} (${branch.cityNameAr}) - ${branch.address}`)
                        }
                        className="w-full py-2.5 px-3 bg-gradient-to-r from-[#1668DC] to-[#1152B8] hover:brightness-110 text-white text-xs font-black rounded-full transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <CalendarCheck className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'احجز موعداً في هذا الفرع' : 'Book at this Branch'}</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={branch.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="warm-pill-cta py-2 px-2 text-xs font-bold rounded-full flex items-center justify-center gap-1.5 text-center"
                        >
                          <Navigation className="w-3.5 h-3.5 shrink-0" />
                          <span>{isArabic ? 'خرائط Google' : 'Google Maps'}</span>
                        </a>
                        <a
                          href={branch.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-2 bg-[#047857] hover:bg-[#065F46] text-white text-xs font-black rounded-full flex items-center justify-center gap-1.5 text-center"
                        >
                          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Highlights + Clinical Services Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Clinical Services Provided */}
          <section className="lg:col-span-7 liquid-glass-card rounded-[28px] p-6 sm:p-8 space-y-5">
            <h2 className="text-xl sm:text-2xl font-black text-[#161B26] dark:text-[#F8FAFC]">
              {isArabic
                ? `الخدمات الإكلينيكية المتوفرة في ${branchSeo.cityNameAr}`
                : `Available Clinical Services in ${branchSeo.cityNameEn}`}
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
              {isArabic
                ? `جميع برامج التأهيل والتقييم الإكلينيكي معتمدة وتُقدم عبر كوادر مرخصة في فرع ${branchSeo.cityNameAr}:`
                : `All specialized rehabilitation programs and diagnostics are available at our ${branchSeo.cityNameEn} center:`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICE_SEO_ROUTES.map((srv) => (
                <a
                  key={srv.slug}
                  href={`/services/${srv.slug}`}
                  onClick={(e) => handleLinkClick(`/services/${srv.slug}`, e)}
                  className="p-4 rounded-2xl liquid-glass-panel hover:border-[#2B95FF]/40 transition-all flex items-start justify-between gap-2 group"
                >
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-[#161B26] dark:text-[#F8FAFC] group-hover:text-[#1263D6] dark:group-hover:text-[#60AFFF]">
                      {isArabic ? srv.h1 : srv.h1En}
                    </h3>
                    <p className="text-[11px] text-[#4B5563] dark:text-[#94A3B8] line-clamp-2 mt-1">
                      {srv.description}
                    </p>
                  </div>
                  {isArabic ? (
                    <ArrowLeft className="w-4 h-4 text-[#2B95FF] shrink-0 mt-1" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-[#2B95FF] shrink-0 mt-1" />
                  )}
                </a>
              ))}
              <a
                href="/shadow-teacher"
                onClick={(e) => handleLinkClick('/shadow-teacher', e)}
                className="p-4 rounded-2xl liquid-glass-panel hover:border-[#2B95FF]/40 transition-all flex items-start justify-between gap-2 group"
              >
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-[#161B26] dark:text-[#F8FAFC] group-hover:text-[#1263D6] dark:group-hover:text-[#60AFFF]">
                    {isArabic ? SHADOW_TEACHER_SEO_CONTENT.h1 : SHADOW_TEACHER_SEO_CONTENT.h1En}
                  </h3>
                  <p className="text-[11px] text-[#4B5563] dark:text-[#94A3B8] line-clamp-2 mt-1">
                    {SHADOW_TEACHER_SEO_CONTENT.description}
                  </p>
                </div>
                {isArabic ? (
                  <ArrowLeft className="w-4 h-4 text-[#2B95FF] shrink-0 mt-1" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-[#2B95FF] shrink-0 mt-1" />
                )}
              </a>
            </div>
          </section>

          {/* Branch Highlights & FAQ */}
          <div className="lg:col-span-5 space-y-6">
            <section className="liquid-glass-card rounded-[28px] p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-2 text-[#047857] dark:text-[#34D399] font-black text-base sm:text-lg">
                <ShieldCheck className="w-5 h-5" />
                <h2>{isArabic ? `مميزات الرعاية في ${branchSeo.cityNameAr}` : 'Care Highlights'}</h2>
              </div>
              <ul className="space-y-2.5">
                {(isArabic ? branchSeo.highlights : branchSeo.highlightsEn).map((hl, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8]">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{hl}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="liquid-glass-card rounded-[28px] p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-2 text-[#1263D6] dark:text-[#60AFFF] font-black text-base sm:text-lg">
                <HelpCircle className="w-5 h-5" />
                <h2>{isArabic ? `الأسئلة الشائعة حول فرع ${branchSeo.cityNameAr}` : 'Branch FAQs'}</h2>
              </div>
              <div className="space-y-3">
                {branchSeo.faq.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-2xl liquid-glass-panel space-y-1.5">
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
      </div>
    </div>
  );
};

export default BranchDetailPage;
