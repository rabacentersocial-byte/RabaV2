import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  FileCheck, 
  ExternalLink, 
  X, 
  Sparkles,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SmartAccreditationLogo } from './SmartAccreditationLogo';
import { 
  AccreditationItem, 
  AccreditationsSectionSettings,
  getStoredAccreditations,
  getStoredAccreditationSettings
} from '../data/accreditationsData';

export const AccreditationsSection: React.FC = () => {
  const { isArabic } = useLanguage();
  const [accreditations, setAccreditations] = useState<AccreditationItem[]>(() => {
    const initial = getStoredAccreditations();
    return Array.isArray(initial) ? initial : [];
  });
  const [settings, setSettings] = useState<AccreditationsSectionSettings>(() => getStoredAccreditationSettings());
  const [selectedItem, setSelectedItem] = useState<AccreditationItem | null>(null);

  // Mobile Slider Controls
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Live Sync with Admin Panel updates
  useEffect(() => {
    const handleAccreditationsUpdate = (e?: any) => {
      if (e?.type === 'raba_accreditations_updated' && Array.isArray(e?.detail)) {
        setAccreditations(e.detail);
      } else {
        const stored = getStoredAccreditations();
        setAccreditations(Array.isArray(stored) ? stored : []);
      }
    };

    const handleSettingsUpdate = (e?: any) => {
      if (e?.type === 'raba_accreditations_settings_updated' && e?.detail && !('timestamp' in e.detail) && typeof e.detail === 'object' && !Array.isArray(e.detail)) {
        setSettings(e.detail);
      } else {
        setSettings(getStoredAccreditationSettings());
      }
    };

    window.addEventListener('raba_accreditations_updated', handleAccreditationsUpdate);
    window.addEventListener('raba_accreditations_settings_updated', handleSettingsUpdate);
    window.addEventListener('raba_persistent_sync_ready', handleAccreditationsUpdate);
    window.addEventListener('raba_persistent_sync_ready', handleSettingsUpdate);

    return () => {
      window.removeEventListener('raba_accreditations_updated', handleAccreditationsUpdate);
      window.removeEventListener('raba_accreditations_settings_updated', handleSettingsUpdate);
      window.removeEventListener('raba_persistent_sync_ready', handleAccreditationsUpdate);
      window.removeEventListener('raba_persistent_sync_ready', handleSettingsUpdate);
    };
  }, []);

  // Filter only active items and sort by order
  const validAccreditations = Array.isArray(accreditations) ? accreditations : getStoredAccreditations();
  const displayItems = (Array.isArray(validAccreditations) ? validAccreditations : [])
    .filter((item) => item && item.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Monitor mobile scroll progress
  const updateScrollState = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    const scrollLeft = Math.abs(el.scrollLeft);
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < maxScroll - 15);

    if (el.clientWidth > 0) {
      const cardWidth = 250;
      const idx = Math.min(
        Math.max(0, Math.round(scrollLeft / cardWidth)),
        displayItems.length - 1
      );
      setActiveIndex(idx);
    }
  }, [displayItems.length]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, displayItems]);

  const handleScroll = (direction: 'next' | 'prev') => {
    const el = sliderRef.current;
    if (!el) return;
    const scrollAmount = 260;
    let delta = direction === 'next' ? scrollAmount : -scrollAmount;
    if (isArabic) {
      delta = -delta;
    }
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const scrollToItem = (index: number) => {
    const el = sliderRef.current;
    if (!el) return;
    const cardWidth = 260;
    let target = index * cardWidth;
    if (isArabic) {
      target = -target;
    }
    el.scrollTo({ left: target, behavior: 'smooth' });
    setActiveIndex(index);
  };

  // Fallback badge if no custom logo image is uploaded yet
  const renderFallbackSvg = (item: AccreditationItem) => {
    return (
      <div className="flex flex-col items-center justify-center p-2 text-center">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 dark:text-[#00E5BE] mb-1 group-hover:scale-105 transition-transform">
          <Award className="w-6 h-6" />
        </div>
        <span className="text-[11px] font-black text-slate-800 dark:text-slate-200">
          {item.code || (isArabic ? item.nameAr : item.nameEn)}
        </span>
      </div>
    );
  };

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <section 
      id="accreditations-section"
      className="py-12 sm:py-16 relative overflow-hidden bg-gradient-to-b from-slate-50/60 via-purple-50/25 to-slate-50/60 dark:from-slate-950 dark:via-purple-950/10 dark:to-slate-950 transition-colors border-y border-slate-200/50 dark:border-white/5"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Ambient background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[250px] bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching exact image layout */}
        <div className="text-center mb-10 sm:mb-14">
          
          {/* Top Subtitle in Brand Teal */}
          <span className="inline-block text-[#0D6D54] dark:text-[#00E5BE] font-extrabold text-xs sm:text-sm tracking-wider uppercase">
            {isArabic ? settings.subtitleAr : settings.subtitleEn}
          </span>

          {/* Main Title: "معترف بنا من" */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mt-1.5 tracking-tight">
            {isArabic ? settings.titleAr : settings.titleEn}
          </h2>

          {/* Distinctive Accent Underline from Image */}
          {settings.showAccentBar !== false && (
            <div className={`w-16 h-1 ${settings.accentBarColor || 'bg-amber-500'} rounded-full mx-auto mt-3 shadow-xs`} />
          )}

          {/* Optional subtext explaining clinical rigor */}
          {(isArabic ? settings.descriptionAr : settings.descriptionEn) && (
            <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3 font-medium">
              {isArabic ? settings.descriptionAr : settings.descriptionEn}
            </p>
          )}

        </div>

        {/* Mobile Slider Navigation Bar */}
        <div className="flex md:hidden items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Award className="w-4 h-4 text-[#0D6D54] dark:text-[#00E5BE]" />
            <span>{isArabic ? `الاعتمادات المعتمدة (${displayItems.length})` : `Accreditations (${displayItems.length})`}</span>
          </div>

          <div className="flex items-center gap-1.5" dir="ltr">
            <button
              onClick={() => handleScroll('prev')}
              disabled={!canScrollLeft}
              aria-label={isArabic ? 'السابق' : 'Previous'}
              className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#00E5BE] hover:text-slate-950 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('next')}
              disabled={!canScrollRight}
              aria-label={isArabic ? 'التالي' : 'Next'}
              className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#00E5BE] hover:text-slate-950 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cards Slider on Mobile / Grid on Desktop */}
        <div 
          ref={sliderRef}
          className="flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5 overflow-x-auto md:overflow-visible no-scrollbar snap-x snap-mandatory scroll-smooth pb-3 pt-1 px-3 sm:px-4 md:px-0 -mx-3 sm:-mx-4 md:mx-0"
        >
          {displayItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedItem(item);
                }
              }}
              className="w-[72vw] max-w-[260px] sm:w-[230px] md:w-auto shrink-0 md:shrink snap-center md:snap-align-none group relative bg-white dark:bg-slate-900/95 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/10 p-3.5 sm:p-4 flex flex-col items-center justify-between min-h-[160px] sm:min-h-[180px] shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden"
              title={isArabic ? `${item.nameAr} - انقر للاطلاع على تفاصيل الاعتماد` : `${item.nameEn} - Click to view accreditation details`}
            >
              {/* Subtle hover gradient glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00E5BE]/[0.08] via-transparent to-[#0D6D54]/[0.08] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* Verified Trust Indicator Pill */}
              <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <span className="w-2 h-2 rounded-full bg-[#00E5BE] inline-block shadow-xs ring-4 ring-[#00E5BE]/20" />
              </div>

              {/* Uniform Logo Showcase Stage */}
              <div className="w-full flex-1 flex items-center justify-center relative p-1.5 min-h-[85px] sm:min-h-[100px]">
                <SmartAccreditationLogo
                  src={item.customLogoUrl}
                  alt={isArabic ? item.nameAr : item.nameEn}
                  className="h-12 sm:h-14 w-auto max-w-[130px] sm:max-w-[140px]"
                  fallbackSvg={renderFallbackSvg(item)}
                />
              </div>

              {/* Verified Clinical Label with Divider */}
              <div className="w-full pt-2.5 border-t border-slate-100 dark:border-white/10 text-center mt-1">
                <span className="text-[11px] sm:text-xs font-black text-slate-800 dark:text-slate-200 group-hover:text-[#0B3B36] dark:group-hover:text-[#00E5BE] transition-colors line-clamp-1 block">
                  {isArabic ? item.badgeTextAr : item.badgeTextEn}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Pagination Dots & Swipe Hint */}
        <div className="flex md:hidden flex-col items-center justify-center gap-2 mt-4">
          <div className="flex items-center gap-1.5">
            {displayItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => scrollToItem(idx)}
                aria-label={`انتقل إلى ${item.nameAr}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? 'w-6 bg-[#00E5BE]'
                    : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            {isArabic ? 'اسحب لمشاهدة جميع شهادات واعتمادات المركز' : 'Swipe to explore all accreditations'}
          </span>
        </div>

        {/* Clinical Quality Assurance Guarantee Bar */}
        <div className="mt-8 sm:mt-10 max-w-3xl mx-auto p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 shadow-sm text-center sm:text-right">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-700 dark:text-[#00E5BE] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                {isArabic ? 'ضمان الامتثال الإكلينيكي والرقابة المستمرة' : 'Continuous Clinical Oversight & Quality Assurance'}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isArabic 
                  ? 'تخضع جميع البرامج العلاجية والخطط السلوكية لمراجعة إكلينيكية دورية بإشراف محللي سلوك دوليين.'
                  : 'All individual therapy plans are reviewed under certified BCBA supervision to guarantee progress.'}
              </p>
            </div>
          </div>

          <a 
            href="#booking-cta"
            className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0B3B36] to-[#0D6D54] hover:from-[#062420] hover:to-[#094d3c] text-white dark:from-[#00E5BE] dark:to-[#0284C7] dark:text-slate-950 text-xs font-black shadow-sm transition-all"
          >
            {isArabic ? 'طلب استشارة تأهيلية' : 'Book Consultation'}
          </a>
        </div>

      </div>

      {/* Detail Modal for Clicked Accreditation Badge */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-white/10 relative overflow-hidden text-right"
            onClick={(e) => e.stopPropagation()}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Top Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 left-4 sm:left-6 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              aria-label="إغلاق النافذة"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header Badge */}
            <div className="flex items-center gap-3 pt-2 pb-4 border-b border-slate-100 dark:border-white/10">
              <div className="w-18 h-18 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 flex items-center justify-center p-2 shrink-0 overflow-hidden">
                <SmartAccreditationLogo
                  src={selectedItem.customLogoUrl}
                  alt={isArabic ? selectedItem.nameAr : selectedItem.nameEn}
                  className="h-12 w-auto max-w-[60px]"
                  fallbackSvg={renderFallbackSvg(selectedItem)}
                />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full mb-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{isArabic ? 'اعتماد موثق ونشط' : 'Verified & Active Accreditation'}</span>
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                  {isArabic ? selectedItem.nameAr : selectedItem.nameEn}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-3">
              <div>
                <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {isArabic ? 'جهة الاعتماد والمجال:' : 'Issuing Entity:'}
                </h5>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {isArabic ? selectedItem.issuerAr : selectedItem.issuerEn}
                </p>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {isArabic ? 'أهمية الاعتماد لأولياء الأمور والأطفال:' : 'Clinical Importance:'}
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">
                  {isArabic ? selectedItem.descriptionAr : selectedItem.descriptionEn}
                </p>
              </div>

              {/* Certificate details if available */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 text-xs flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <FileCheck className="w-4 h-4 text-emerald-500" />
                  <span>{isArabic ? 'رمز الترخيص/الاعتماد:' : 'Credential ID:'}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white" dir="ltr">
                    {selectedItem.certificateNumber || 'RABA-VERIFIED'}
                  </span>
                </div>
                {selectedItem.validUntil && (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    {isArabic ? `ساري حتى ${selectedItem.validUntil}` : `Valid thru ${selectedItem.validUntil}`}
                  </span>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {isArabic ? 'مركز رابا للتأهيل وتحليل السلوك التطبيقي' : 'Raba Center for ABA Therapy'}
              </span>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
