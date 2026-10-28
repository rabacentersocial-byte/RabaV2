import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  FileCheck, 
  X, 
  ExternalLink,
  ShieldCheck,
  Award,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { 
  AccreditationItem, 
  AccreditationsSectionSettings,
  ACCREDITATIONS_LIST,
  getStoredAccreditations, 
  getStoredAccreditationSettings 
} from '../data/accreditationsData';

export const AccreditationsSection: React.FC = () => {
  const { isArabic } = useLanguage();

  const [accreditations, setAccreditations] = useState<AccreditationItem[]>(() => {
    const stored = getStoredAccreditations();
    return Array.isArray(stored) && stored.length > 0 ? stored : ACCREDITATIONS_LIST;
  });

  const [settings, setSettings] = useState<AccreditationsSectionSettings>(() => getStoredAccreditationSettings());
  const [selectedItem, setSelectedItem] = useState<AccreditationItem | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartXRef = React.useRef(0);
  const hasMovedRef = React.useRef(false);
  const resumeTimerRef = React.useRef<any>(null);

  // Sync with Admin updates
  useEffect(() => {
    const handleAccreditationsUpdate = (e?: any) => {
      const stored = Array.isArray(e?.detail) ? e.detail : getStoredAccreditations();
      setAccreditations(Array.isArray(stored) && stored.length > 0 ? stored : ACCREDITATIONS_LIST);
    };

    const handleSettingsUpdate = (e?: any) => {
      const stored = e?.detail || getStoredAccreditationSettings();
      setSettings(stored);
    };

    window.addEventListener('raba_accreditations_updated', handleAccreditationsUpdate);
    window.addEventListener('raba_accreditations_settings_updated', handleSettingsUpdate);
    window.addEventListener('raba_persistent_sync_ready', handleAccreditationsUpdate);

    return () => {
      window.removeEventListener('raba_accreditations_updated', handleAccreditationsUpdate);
      window.removeEventListener('raba_accreditations_settings_updated', handleSettingsUpdate);
      window.removeEventListener('raba_persistent_sync_ready', handleAccreditationsUpdate);
    };
  }, []);

  // Standard items matching user screenshot
  const defaultBadges = [
    { id: 'iso-9001', label: 'ISO 9001', code: 'ISO', nameAr: 'شهادة الآيزو لإدارة الجودة 9001:2015', nameEn: 'ISO 9001:2015 Quality Management', issuer: 'International Organization for Standardization', desc: 'معايير جودة دولية صارمة لإدارة العيادات وضمان سلامة وجودة الرعاية التأهيلية.' },
    { id: 'bacb', label: 'BACB', code: 'BA', nameAr: 'مجلس اعتماد محللي السلوك (BACB)', nameEn: 'Behavior Analyst Certification Board', issuer: 'BACB International', desc: 'أعلى اعتماد عالمي لممارسي ومحللي السلوك التطبيقي (BCBA / BCaBA / RBT).' },
    { id: 'qaba', label: 'QABA', code: 'QA', nameAr: 'هيئة اعتماد تحليل السلوك التطبيقي (QABA)', nameEn: 'Qualified Applied Behavior Analysis Board', issuer: 'QABA Credentialing Board', desc: 'اعتماد دولي متخصص في كفاءة ومهارات تأهيل طيف التوحد والاضطرابات النمائية.' },
    { id: 'ibao', label: 'IBAO', code: 'IB', nameAr: 'المنظمة الدولية لتحليل السلوك (IBAO)', nameEn: 'International Behavior Analysis Organization', issuer: 'IBAO Global', desc: 'معايير إكلينيكية دولية للممارسات السلوكية والأخلاقيات العلاجية.' },
    { id: 'cbahi', label: 'CBAHI', code: 'CB', nameAr: 'المركز السعودي لاعتماد المنشآت الصحية (سباهي)', nameEn: 'Saudi Central Board for Healthcare Institutions', issuer: 'Saudi CBAHI', desc: 'معايير الجودة وسلامة المرضى المعتمدة في القطاع الصحي بالمملكة.' },
    { id: 'jci', label: 'JCI', code: 'JC', nameAr: 'اللجنة الدولية المشتركة لاعتماد المنشآت الصحية (JCI)', nameEn: 'Joint Commission International', issuer: 'JCI Healthcare', desc: 'الاعتراف الدولي الذهبي بسلامة البيئة العلاجية والرعاية الطبية.' },
    { id: 'chi-daman', label: 'CHI', code: 'CHI', nameAr: 'مجلس الضمان الصحي السعودي (CHI)', nameEn: 'Council of Health Insurance', issuer: 'Saudi Council of Health Insurance', desc: 'الاعتماد التأميني لتغطية جلسات التأهيل والعلاج الطبي للتوحد.' },
    { id: 'hipaa', label: 'HIPAA', code: 'HI', nameAr: 'معيار حماية وخصوصية البيانات الطبية (HIPAA)', nameEn: 'Health Information Privacy & Security', issuer: 'HIPAA Compliance Standard', desc: 'أعلى معايير الحماية لسرية بيانات الأطفال وسجلاتهم الطبية والتأهيلية.' }
  ];

  // Merge stored accreditations with default visual structure
  const rawList = accreditations.filter(item => item && item.active !== false);
  const itemsToDisplay = rawList.length > 0 ? rawList.map(item => {
    // Generate clean 2-3 letter badge code
    let badgeCode = item.code || '';
    if (item.id === 'iso-9001') badgeCode = 'ISO';
    else if (item.id === 'bacb') badgeCode = 'BA';
    else if (item.id === 'qaba') badgeCode = 'QA';
    else if (item.id === 'ibao') badgeCode = 'IB';
    else if (item.id === 'cbahi') badgeCode = 'CB';
    else if (item.id === 'chi-daman') badgeCode = 'CHI';
    else if (!badgeCode) {
      badgeCode = item.nameEn?.slice(0, 2).toUpperCase() || 'AC';
    }

    // Display label
    const label = item.id === 'iso-9001' ? 'ISO 9001' : (item.code || item.nameEn || item.nameAr);

    return {
      id: item.id,
      label,
      code: badgeCode,
      nameAr: item.nameAr,
      nameEn: item.nameEn,
      issuer: isArabic ? item.issuerAr : item.issuerEn,
      desc: isArabic ? item.descriptionAr : item.descriptionEn,
      certificateNumber: item.certificateNumber,
      validUntil: item.validUntil
    };
  }) : defaultBadges;

  // Duplicate 4 times for infinite loop
  const loopList = [...itemsToDisplay, ...itemsToDisplay, ...itemsToDisplay, ...itemsToDisplay];

  // Initialize scroll position to 1 set width so user can swipe left or right immediately
  useEffect(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const singleSetWidth = container.scrollWidth / 4;
    if (singleSetWidth > 0 && container.scrollLeft === 0) {
      container.scrollLeft = singleSetWidth;
    }
  }, [itemsToDisplay.length]);

  // Smooth continuous requestAnimationFrame ticker
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const ticker = (time: number) => {
      const delta = Math.min(time - lastTime, 80);
      lastTime = time;

      if (!isPaused && !isDragging && scrollRef.current) {
        const container = scrollRef.current;
        const singleSetWidth = container.scrollWidth / 4;

        if (singleSetWidth > 0) {
          // Continuous 32px/sec smooth scroll
          container.scrollLeft += delta * 0.032;

          // Infinite wrap bounds
          if (container.scrollLeft >= singleSetWidth * 2.5) {
            container.scrollLeft -= singleSetWidth;
          } else if (container.scrollLeft <= 10) {
            container.scrollLeft += singleSetWidth;
          }
        }
      }

      animId = requestAnimationFrame(ticker);
    };

    animId = requestAnimationFrame(ticker);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, isDragging, itemsToDisplay.length]);

  // Touch gesture handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    hasMovedRef.current = false;
    touchStartXRef.current = e.touches[0].clientX;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (Math.abs(e.touches[0].clientX - touchStartXRef.current) > 8) {
      hasMovedRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsDragging(false);
    }, 1800);
  };

  const handleManualStep = (direction: 'next' | 'prev') => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const stride = 180;
    container.scrollBy({
      left: direction === 'next' ? stride : -stride,
      behavior: 'smooth'
    });
  };

  const handleBadgeClick = (item: any) => {
    if (!hasMovedRef.current) {
      setSelectedItem(item);
    }
  };

  return (
    <section 
      id="accreditations-section"
      className="py-8 sm:py-10 bg-transparent text-slate-800 dark:text-white relative overflow-hidden border-t border-b border-slate-200/80 dark:border-white/10 select-none transition-colors"
    >
      {/* Edge gradient fade masks for smooth entrance/exit */}
      <div className="absolute top-0 right-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-slate-50/90 dark:from-[#0D1B2A] to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 left-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-slate-50/90 dark:from-[#0D1B2A] to-transparent z-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header with Title and Mobile Navigation Arrows */}
        <div className="flex items-center justify-between sm:justify-center gap-4 mb-4 sm:mb-6">
          
          {/* Prev Arrow */}
          <button
            onClick={() => handleManualStep('prev')}
            aria-label={isArabic ? 'السابق' : 'Previous'}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-[#2E86EB] dark:hover:text-[#2E86EB] flex items-center justify-center shadow-2xs active:scale-95 transition-all cursor-pointer shrink-0"
            title={isArabic ? 'عرض الشهادات السابقة' : 'Previous accreditations'}
          >
            {isArabic ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Simple Centered Header: "معترف بنا من" */}
          <div className="text-center">
            <h3 className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider">
              {isArabic ? (settings.titleAr || 'معترف بنا من') : (settings.titleEn || 'Accredited By')}
            </h3>
          </div>

          {/* Next Arrow */}
          <button
            onClick={() => handleManualStep('next')}
            aria-label={isArabic ? 'التالي' : 'Next'}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-[#2E86EB] dark:hover:text-[#2E86EB] flex items-center justify-center shadow-2xs active:scale-95 transition-all cursor-pointer shrink-0"
            title={isArabic ? 'عرض المزيد من الشهادات' : 'Next accreditations'}
          >
            {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

        </div>

        {/* Swipeable, touch-friendly, and continuous auto-scrolling loop */}
        <div 
          ref={scrollRef}
          dir="ltr"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full overflow-x-auto scrollbar-none flex items-center py-2.5 cursor-grab active:cursor-grabbing select-none"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div className="flex items-center gap-7 sm:gap-14 shrink-0 px-4">
            {loopList.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                onClick={() => handleBadgeClick(item)}
                className="flex items-center gap-2.5 sm:gap-3 shrink-0 group transition-all duration-200 opacity-85 hover:opacity-100 cursor-pointer active:scale-95"
                title={isArabic ? `${item.nameAr} - انقر للتفاصيل` : `${item.nameEn} - Click for details`}
              >
                {/* Certification Name / Label */}
                <span className="text-xs sm:text-sm md:text-base font-bold text-slate-700 dark:text-slate-300 tracking-wider group-hover:text-[#0D6D54] dark:group-hover:text-white transition-colors whitespace-nowrap">
                  {item.label}
                </span>

                {/* Rounded Squircle Badge with Code (e.g. [ ISO ], [ BA ], [ QA ]) */}
                <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl border border-slate-300 dark:border-slate-500/50 bg-slate-100 dark:bg-[#0E1E34]/80 text-slate-800 dark:text-slate-200 font-extrabold text-xs sm:text-sm tracking-widest shadow-xs group-hover:border-amber-400/80 group-hover:text-amber-500 dark:group-hover:text-amber-300 group-hover:scale-105 transition-all shrink-0">
                  {item.code}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Accreditation Details Modal on Click */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white dark:bg-[#0D1B2A] text-slate-900 dark:text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-white/10 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Top Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 start-auto end-4 sm:end-6 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header Badge */}
            <div className="flex items-center gap-3 pt-2 pb-4 border-b border-slate-100 dark:border-white/10">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-[#14233D] border border-amber-500/30 flex items-center justify-center text-amber-500 dark:text-amber-400 font-black text-lg shrink-0 shadow-inner">
                {(selectedItem as any).code || 'AC'}
              </div>
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full mb-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{isArabic ? 'اعتماد دولي موثق وساري' : 'Verified & Active Accreditation'}</span>
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                  {isArabic ? selectedItem.nameAr : selectedItem.nameEn}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-3">
              <div>
                <h5 className="text-xs font-bold text-slate-400">
                  {isArabic ? 'جهة الاعتماد والمجال:' : 'Issuing Body:'}
                </h5>
                <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5">
                  {(selectedItem as any).issuer || (isArabic ? selectedItem.issuerAr : selectedItem.issuerEn)}
                </p>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-400">
                  {isArabic ? 'أهمية الاعتماد والامتثال الإكلينيكي:' : 'Clinical Value:'}
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                  {(selectedItem as any).desc || (isArabic ? selectedItem.descriptionAr : selectedItem.descriptionEn)}
                </p>
              </div>

              {/* Certificate Details */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isArabic ? 'رقم التحقق:' : 'Verification ID:'}</span>
                  <span className="font-mono font-bold text-white">
                    {selectedItem.certificateNumber || 'RABA-VERIFIED'}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 font-bold">
                  {selectedItem.validUntil ? (isArabic ? `ساري حتى ${selectedItem.validUntil}` : `Valid thru ${selectedItem.validUntil}`) : (isArabic ? 'معتمد ومجدد سنوياً' : 'Renewed Annually')}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {isArabic ? 'مركز رابا للتأهيل وتحليل السلوك التطبيقي' : 'Raba Center for ABA Therapy'}
              </span>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
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

export default AccreditationsSection;
