import React, { useState, useEffect } from 'react';
import { 
  X, 
  Award, 
  GraduationCap, 
  CheckCircle2, 
  Calendar, 
  Star, 
  ShieldCheck, 
  Clock, 
  BadgeCheck, 
  ArrowLeft,
  ArrowRight,
  FileText,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Share2,
  Sparkles,
  CalendarDays,
  UserCheck
} from 'lucide-react';
import { Specialist } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getResolvedImageUrl, handleImageErrorWithStore } from '../utils/persistentImageStore';

interface SpecialistCvModalProps {
  specialist: Specialist | null;
  onClose: () => void;
  onBookSpecialist: (specialist: Specialist) => void;
}

type CvTab = 'all' | 'bio' | 'education' | 'certifications' | 'specialties' | 'schedule';

export const SpecialistCvModal: React.FC<SpecialistCvModalProps> = ({
  specialist,
  onClose,
  onBookSpecialist
}) => {
  const { isArabic, direction } = useLanguage();
  const [activeTab, setActiveTab] = useState<CvTab>('all');
  const [copiedLicense, setCopiedLicense] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Lock body scroll on open & handle Escape key
  useEffect(() => {
    if (!specialist) return;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [specialist, onClose]);

  if (!specialist) return null;

  const displayName = !isArabic && specialist.nameEn ? specialist.nameEn : specialist.name;
  const displayRole = !isArabic && specialist.roleEn ? specialist.roleEn : specialist.role;
  const displayTitle = !isArabic && specialist.titleEn ? specialist.titleEn : specialist.title;
  const displayBio = !isArabic && specialist.bioEn ? specialist.bioEn : specialist.bio;
  const displayEducation = !isArabic && specialist.educationEn ? specialist.educationEn : (specialist.education || []);
  const displayCertifications = !isArabic && specialist.certificationsEn ? specialist.certificationsEn : (specialist.certifications || []);
  const displaySpecialties = !isArabic && specialist.specialtiesEn ? specialist.specialtiesEn : (specialist.specialties || []);
  const displayDays = !isArabic && specialist.availableDaysEn ? specialist.availableDaysEn : (specialist.availableDays || []);

  const handleCopyLicense = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!specialist.licenseNumber) return;
    navigator.clipboard.writeText(specialist.licenseNumber);
    setCopiedLicense(true);
    setTimeout(() => setCopiedLicense(false), 2000);
  };

  const handleShareCv = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = window.location.origin + `/#specialists`;
    if (navigator.share) {
      navigator.share({
        title: `${displayName} - ${displayRole}`,
        text: `${isArabic ? 'السيرة الذاتية للأخصائي' : 'Specialist CV:'} ${displayName} - ${displayTitle}`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${displayName} - ${displayRole}\n${shareUrl}`);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const whatsappMessage = encodeURIComponent(
    isArabic
      ? `السلام عليكم، أود الاستفسار عن حجز جلسة تقييم مع الأخصائي/ة: ${displayName} (${displayRole})`
      : `Hello, I would like to inquire about booking a session with specialist: ${displayName} (${displayRole})`
  );

  const tabs: { id: CvTab; labelAr: string; labelEn: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All', icon: Sparkles },
    { id: 'bio', labelAr: 'النبذة والخبرات', labelEn: 'Bio & Exp', icon: FileText },
    { id: 'education', labelAr: 'المؤهلات', labelEn: 'Education', icon: GraduationCap },
    { id: 'certifications', labelAr: 'الاعتمادات', labelEn: 'Licenses', icon: Award },
    { id: 'specialties', labelAr: 'التخصصات', labelEn: 'Specialties', icon: UserCheck },
    { id: 'schedule', labelAr: 'أيام العيادة', labelEn: 'Schedule', icon: CalendarDays },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="specialist-cv-name"
    >
      <div 
        className={`relative bg-white dark:bg-[#0D1B2A] text-slate-900 dark:text-white rounded-t-[28px] sm:rounded-3xl max-w-3xl w-full shadow-[0_25px_65px_rgba(0,0,0,0.4)] dark:shadow-[0_25px_65px_rgba(0,0,0,0.85)] border-t sm:border border-slate-200/90 dark:border-white/15 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] ${isArabic ? 'text-right' : 'text-left'} my-0 sm:my-auto animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
        id="specialist-cv-modal"
        dir={direction}
      >
        {/* Mobile Pull-to-dismiss Handle indicator */}
        <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Top Banner & Header Section */}
        <div className="bg-gradient-to-l from-blue-500/10 dark:from-[#2E86EB]/20 via-slate-100/90 dark:via-[#111827]/80 to-white dark:to-[#0D1B2A] p-4 sm:p-6 sm:pb-5 relative border-b border-slate-200/80 dark:border-white/10 shrink-0">
          
          {/* Top Bar Actions: Share & Close */}
          <div className={`absolute top-3 ${isArabic ? 'left-3' : 'right-3'} flex items-center gap-1.5 z-10`}>
            <button
              onClick={handleShareCv}
              className="p-2 rounded-xl bg-white/80 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-white/20 transition-colors cursor-pointer border border-slate-200/60 dark:border-white/10 shadow-2xs"
              title={isArabic ? 'مشاركة السيرة الذاتية' : 'Share CV'}
              aria-label={isArabic ? 'مشاركة السيرة الذاتية' : 'Share CV'}
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/80 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-white/20 transition-colors cursor-pointer border border-slate-200/60 dark:border-white/10 shadow-2xs"
              aria-label={isArabic ? 'إغلاق السيرة الذاتية' : 'Close CV'}
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Header Layout: Mobile Optimized Compact Horizontal Flex */}
          <div className="flex items-start gap-3.5 sm:gap-5 pe-16 sm:pe-20">
            {/* Specialist Avatar with Availability Beacon */}
            <div className="relative shrink-0">
              <img
                src={getResolvedImageUrl(specialist.avatar)}
                alt={displayName}
                onError={(e) => handleImageErrorWithStore(e, specialist.avatar, specialist.avatar)}
                className="w-18 h-18 sm:w-24 sm:h-24 rounded-2xl object-cover object-top border-2 sm:border-3 border-teal-500/30 dark:border-teal-400/40 shadow-md bg-slate-100 dark:bg-slate-800"
                referrerPolicy="no-referrer"
              />
              <span className={`absolute -bottom-1.5 ${isArabic ? '-left-1' : '-right-1'} bg-gradient-to-r from-[#00E5BE] to-[#0284C7] text-slate-950 text-[9.5px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-white/80 dark:border-slate-900`}>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                <BadgeCheck className="w-3 h-3" />
                <span className="hidden sm:inline">{isArabic ? 'متاح للحجز' : 'Available'}</span>
              </span>
            </div>

            {/* Doctor Info */}
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 id="specialist-cv-name" className="text-base sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {displayName}
                </h3>
                <span className="bg-teal-500/15 dark:bg-[#00E5BE]/20 text-teal-800 dark:text-[#00E5BE] text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full border border-teal-500/30 dark:border-[#00E5BE]/30 font-black">
                  {displayRole}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium line-clamp-2">
                {displayTitle}
              </p>

              {/* Quick Key Badges Row */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                {/* Clinical Experience */}
                <div className="inline-flex items-center gap-1 bg-white/70 dark:bg-white/10 px-2 py-0.5 rounded-lg border border-slate-200/70 dark:border-white/10 font-bold">
                  <Clock className="w-3 h-3 text-teal-600 dark:text-[#00E5BE] shrink-0" />
                  <span>{isArabic ? `خبرة ${specialist.experienceYears}+ سنوات` : `${specialist.experienceYears}+ Yrs Exp`}</span>
                </div>

                {/* Rating */}
                <div className="inline-flex items-center gap-1 bg-amber-500/10 dark:bg-amber-400/15 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-lg border border-amber-500/20 font-black">
                  <Star className="w-3 h-3 fill-amber-500 dark:fill-amber-300 shrink-0" />
                  <span>{specialist.rating} ({specialist.reviewsCount} {isArabic ? 'تقييم' : 'reviews'})</span>
                </div>

                {/* SCFHS License with Instant Copy */}
                {specialist.licenseNumber && specialist.licenseNumber.trim() !== '' && (
                  <button
                    onClick={handleCopyLicense}
                    className="inline-flex items-center gap-1 bg-sky-50 dark:bg-sky-500/15 text-sky-800 dark:text-sky-300 px-2 py-0.5 rounded-lg border border-sky-300/60 dark:border-sky-500/30 font-bold cursor-pointer hover:bg-sky-100 transition-colors"
                    title={isArabic ? 'انقر لنسخ رقم الترخيص' : 'Click to copy license'}
                  >
                    <ShieldCheck className="w-3 h-3 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span>{isArabic ? 'ترخيص الهيئة:' : 'SCFHS:'}</span>
                    <strong className="font-mono text-[10px] sm:text-xs">{specialist.licenseNumber}</strong>
                    {copiedLicense ? (
                      <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                    ) : (
                      <Copy className="w-2.5 h-2.5 opacity-60 shrink-0" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Segmented Filter Tabs for Quick Mobile Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 mt-2 border-t border-slate-200/60 dark:border-white/10" style={{ WebkitOverflowScrolling: 'touch' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#0B3B36] text-white dark:bg-[#00E5BE] dark:text-slate-950 shadow-xs'
                      : 'bg-white/70 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{isArabic ? tab.labelAr : tab.labelEn}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Modal Body: CV Sections (Scrollable & Responsive) */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1 no-scrollbar overscroll-contain">
          
          {/* 1. Bio / Overview */}
          {(activeTab === 'all' || activeTab === 'bio') && (
            <div className="bg-slate-50 dark:bg-white/[0.03] p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 transition-all">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mb-2.5 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-teal-500/15 dark:bg-[#00E5BE]/20 flex items-center justify-center text-teal-700 dark:text-[#00E5BE] shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span>{isArabic ? 'نبذة تعريفية وفلسفة الرعاية التأهيلية' : 'Biography & Clinical Philosophy'}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                {displayBio}
              </p>
            </div>
          )}

          {/* 2. Education & Academic Qualifications */}
          {(activeTab === 'all' || activeTab === 'education') && displayEducation.length > 0 && (
            <div className="bg-slate-50 dark:bg-white/[0.03] p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 transition-all">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/15 dark:bg-indigo-400/20 flex items-center justify-center text-indigo-700 dark:text-indigo-400 shrink-0">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <span>{isArabic ? 'المؤهلات والدرجات الأكاديمية' : 'Academic Degrees & Education'}</span>
              </h4>
              <div className="space-y-2">
                {displayEducation.map((edu, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200/70 dark:border-white/10 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-1.5 shrink-0" />
                    <span className="flex-1">{edu}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Licenses & Certifications */}
          {(activeTab === 'all' || activeTab === 'certifications') && displayCertifications.length > 0 && (
            <div className="bg-slate-50 dark:bg-white/[0.03] p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 transition-all">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-sky-500/15 dark:bg-sky-400/20 flex items-center justify-center text-sky-700 dark:text-sky-400 shrink-0">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <span>{isArabic ? 'الاعتمادات المهنية والتراخيص السريرية' : 'Certifications & Accreditations'}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {displayCertifications.map((cert, idx) => (
                  <div key={idx} className="bg-white dark:bg-white/[0.04] border border-sky-200/70 dark:border-sky-500/25 p-2.5 rounded-xl flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-[#00E5BE] shrink-0 mt-0.5" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Areas of Clinical Focus */}
          {(activeTab === 'all' || activeTab === 'specialties') && displaySpecialties.length > 0 && (
            <div className="bg-slate-50 dark:bg-white/[0.03] p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 transition-all">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mb-2.5 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-teal-500/15 dark:bg-teal-400/20 flex items-center justify-center text-teal-700 dark:text-teal-400 shrink-0">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <span>{isArabic ? 'مجالات التركيز السريري الدقيق:' : 'Areas of Clinical Focus:'}</span>
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {displaySpecialties.map((spec, idx) => (
                  <span key={idx} className="bg-white dark:bg-white/[0.06] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/15 text-[11px] sm:text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5BE] shrink-0" />
                    <span>{spec}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 5. Working Days & Clinic Schedule */}
          {(activeTab === 'all' || activeTab === 'schedule') && (
            <div className="bg-slate-50 dark:bg-white/[0.03] p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 transition-all">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mb-2.5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/15 dark:bg-amber-400/20 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
                    <CalendarDays className="w-3.5 h-3.5" />
                  </div>
                  <span>{isArabic ? 'أيام تواجد الأخصائي بالمركز:' : 'Clinic Days & Availability:'}</span>
                </span>
                <span className="text-[10px] text-teal-700 dark:text-[#00E5BE] font-bold bg-teal-500/10 px-2 py-0.5 rounded-full">
                  {isArabic ? 'جلسات حضورية صباحية ومسائية' : 'Morning & Evening Sessions'}
                </span>
              </h4>

              <div className="flex flex-wrap gap-1.5">
                {displayDays.map((day, idx) => (
                  <span key={idx} className="bg-white dark:bg-white/[0.06] border border-teal-500/30 dark:border-[#00E5BE]/30 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                    <span>{day}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sticky Mobile-Friendly Modal Footer CTA */}
        <div className="p-3 sm:p-5 bg-white/95 dark:bg-[#0D1B2A]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          
          {/* Left Buttons: Close & WhatsApp consultation */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer text-center"
            >
              {isArabic ? 'إغلاق' : 'Close'}
            </button>

            <a
              href={`https://wa.me/966575100100?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{isArabic ? 'استفسار واتساب' : 'WhatsApp'}</span>
            </a>
          </div>

          {/* Primary CTA: Book Specialist directly */}
          <button
            id={`book-from-cv-${specialist.id}`}
            onClick={() => {
              onClose();
              onBookSpecialist(specialist);
            }}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-[#00E5BE] via-[#00d4af] to-[#0284C7] hover:brightness-105 active:scale-98 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-slate-950" />
            <span>{isArabic ? `حجز موعد مع ${displayName}` : `Book with ${displayName}`}</span>
            {isArabic ? <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> : <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
          </button>
        </div>

      </div>
    </div>
  );
};
