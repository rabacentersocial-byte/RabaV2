import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  FileCheck, 
  X, 
  ExternalLink,
  ShieldCheck,
  Award,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause
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

  // Duplicate list once for pure GPU CSS marquee (-50% transform)
  const loopList = useMemo(() => {
    return [...itemsToDisplay, ...itemsToDisplay];
  }, [itemsToDisplay]);

  const handleBadgeClick = (item: any) => {
    if (!hasMovedRef.current) {
      setSelectedItem(item);
    }
  };

  return (
    <section 
      id="accreditations-section"
      className="py-8 sm:py-10 bg-transparent text-[#161B26] dark:text-[#F8FAFC] relative overflow-hidden border-t border-b border-[#161B26]/[0.08] dark:border-white/10 select-none transition-colors"
    >
      {/* Edge gradient fade masks for smooth entrance/exit */}
      <div className="absolute top-0 right-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#F5F2EC] dark:from-[#0B0F17] to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 left-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#F5F2EC] dark:from-[#0B0F17] to-transparent z-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header with Title and Quick Pause/Play */}
        <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
          <div className="text-center">
            <h3 className="text-xs sm:text-sm font-bold text-[#4B5563] dark:text-[#94A3B8] tracking-wider">
              {isArabic ? (settings.titleAr || 'معترف بنا من') : (settings.titleEn || 'Accredited By')}
            </h3>
          </div>

          {/* Toggle Pause/Play */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? 'تشغيل' : 'إيقاف'}
            className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full liquid-glass-btn text-[#4B5563] dark:text-[#94A3B8] hover:text-[#1263D6] dark:hover:text-[#60AFFF] flex items-center justify-center shadow-2xs active:scale-95 transition-colors cursor-pointer shrink-0"
            title={isPaused ? (isArabic ? 'تشغيل الحركة' : 'Play') : (isArabic ? 'إيقاف الحركة' : 'Pause')}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
          </button>
        </div>

        {/* Continuous auto-scrolling loop - Pure GPU CSS Marquee (0ms CPU / Zero Reflows) */}
        <div 
          dir="ltr"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="w-full overflow-hidden flex items-center py-2.5 select-none"
        >
          <div 
            className="flex items-center gap-7 sm:gap-14 shrink-0 px-4 animate-accred-marquee hover:[animation-play-state:paused]"
            style={{
              willChange: 'transform',
              animationPlayState: isPaused ? 'paused' : 'running'
            }}
          >
            {loopList.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                onClick={() => handleBadgeClick(item)}
                className="flex items-center gap-2.5 sm:gap-3 shrink-0 group transition-opacity duration-200 opacity-85 hover:opacity-100 cursor-pointer active:scale-95"
                title={isArabic ? `${item.nameAr} - انقر للتفاصيل` : `${item.nameEn} - Click for details`}
              >
                {/* Certification Name / Label */}
                <span className="text-xs sm:text-sm md:text-base font-bold text-[#161B26] dark:text-[#F8FAFC] tracking-wider group-hover:text-[#1263D6] dark:group-hover:text-[#60AFFF] transition-colors whitespace-nowrap">
                  {item.label}
                </span>

                {/* Rounded Squircle Badge with Code (e.g. [ ISO ], [ BA ], [ QA ]) */}
                <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full liquid-glass-pill text-[#161B26] dark:text-[#F8FAFC] font-extrabold text-xs sm:text-sm tracking-widest shadow-xs group-hover:border-[#2B95FF]/60 group-hover:text-[#1263D6] dark:group-hover:text-[#60AFFF] group-hover:scale-105 transition-transform shrink-0">
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
            className="glass-modal-dialog text-[#161B26] dark:text-[#F8FAFC] rounded-[28px] max-w-lg w-full p-6 shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Top Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 start-auto end-4 sm:end-6 w-9 h-9 min-w-[36px] min-h-[36px] rounded-full liquid-glass-btn text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header Badge */}
            <div className="flex items-center gap-3 pt-2 pb-4 border-b border-[#161B26]/[0.08] dark:border-white/10">
              <div className="w-14 h-14 rounded-2xl bg-[#2B95FF]/12 border border-[#2B95FF]/30 flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-black text-lg shrink-0 shadow-inner">
                {(selectedItem as any).code || 'AC'}
              </div>
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#047857] dark:text-[#34D399] bg-[#10B981]/12 px-2 py-0.5 rounded-full mb-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{isArabic ? 'اعتماد دولي موثق وساري' : 'Verified & Active Accreditation'}</span>
                </span>
                <h3 className="text-base sm:text-lg font-black text-[#161B26] dark:text-[#F8FAFC] leading-snug">
                  {isArabic ? selectedItem.nameAr : selectedItem.nameEn}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-3">
              <div>
                <h5 className="text-xs font-bold text-[#4B5563] dark:text-[#94A3B8]">
                  {isArabic ? 'جهة الاعتماد والمجال:' : 'Issuing Body:'}
                </h5>
                <p className="text-xs sm:text-sm font-semibold text-[#161B26] dark:text-[#F8FAFC] mt-0.5">
                  {(selectedItem as any).issuer || (isArabic ? selectedItem.issuerAr : selectedItem.issuerEn)}
                </p>
              </div>

              <div>
                <h5 className="text-xs font-bold text-[#4B5563] dark:text-[#94A3B8]">
                  {isArabic ? 'أهمية الاعتماد والامتثال الإكلينيكي:' : 'Clinical Value:'}
                </h5>
                <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] leading-relaxed mt-0.5">
                  {(selectedItem as any).desc || (isArabic ? selectedItem.descriptionAr : selectedItem.descriptionEn)}
                </p>
              </div>

              {/* Certificate Details */}
              <div className="p-3.5 rounded-2xl bg-[#F5F2EC]/70 dark:bg-white/5 border border-[#161B26]/[0.08] dark:border-white/10 text-xs flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[#4B5563] dark:text-[#94A3B8]">
                  <FileCheck className="w-4 h-4 text-[#2B95FF]" />
                  <span>{isArabic ? 'رقم التحقق:' : 'Verification ID:'}</span>
                  <span className="font-mono font-bold text-[#161B26] dark:text-[#F8FAFC]">
                    {selectedItem.certificateNumber || 'RABA-VERIFIED'}
                  </span>
                </div>
                <span className="text-[11px] text-[#1263D6] dark:text-[#60AFFF] font-bold">
                  {selectedItem.validUntil ? (isArabic ? `ساري حتى ${selectedItem.validUntil}` : `Valid thru ${selectedItem.validUntil}`) : (isArabic ? 'معتمد ومجدد سنوياً' : 'Renewed Annually')}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-[#161B26]/[0.08] dark:border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-[#4B5563] dark:text-[#94A3B8]">
                {isArabic ? 'مركز رابا للتأهيل وتحليل السلوك التطبيقي' : 'Raba Center for ABA Therapy'}
              </span>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-1.5 rounded-full warm-pill-cta text-xs font-bold transition-colors cursor-pointer"
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
