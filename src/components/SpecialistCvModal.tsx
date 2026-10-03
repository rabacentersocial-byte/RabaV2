import React from 'react';
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
  FileText
} from 'lucide-react';
import { Specialist } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SpecialistCvModalProps {
  specialist: Specialist | null;
  onClose: () => void;
  onBookSpecialist: (specialist: Specialist) => void;
}

export const SpecialistCvModal: React.FC<SpecialistCvModalProps> = ({
  specialist,
  onClose,
  onBookSpecialist
}) => {
  const { t, isArabic, direction } = useLanguage();
  if (!specialist) return null;

  const displayName = !isArabic && specialist.nameEn ? specialist.nameEn : specialist.name;
  const displayRole = !isArabic && specialist.roleEn ? specialist.roleEn : specialist.role;
  const displayTitle = !isArabic && specialist.titleEn ? specialist.titleEn : specialist.title;
  const displayBio = !isArabic && specialist.bioEn ? specialist.bioEn : specialist.bio;
  const displayEducation = !isArabic && specialist.educationEn ? specialist.educationEn : specialist.education;
  const displayCertifications = !isArabic && specialist.certificationsEn ? specialist.certificationsEn : specialist.certifications;
  const displaySpecialties = !isArabic && specialist.specialtiesEn ? specialist.specialtiesEn : specialist.specialties;
  const displayDays = !isArabic && specialist.availableDaysEn ? specialist.availableDaysEn : specialist.availableDays;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`relative bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white rounded-3xl max-w-3xl w-full shadow-[0_20px_60px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.7)] border border-slate-200 dark:border-white/20 overflow-hidden ${isArabic ? 'text-right' : 'text-left'} my-8`}
        onClick={(e) => e.stopPropagation()}
        id="specialist-cv-modal"
        dir={direction}
      >
        {/* Top Banner & Close Button */}
        <div className="bg-gradient-to-l from-sky-500/15 dark:from-teal-500/20 via-slate-100 dark:via-slate-900/60 to-white dark:to-slate-950/80 p-6 sm:p-8 relative border-b border-slate-200 dark:border-white/10">
          <button
            onClick={onClose}
            className={`absolute top-4 ${isArabic ? 'left-4' : 'right-4'} p-2 rounded-xl bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-white/20 transition-colors cursor-pointer`}
            aria-label={isArabic ? 'إغلاق السيرة الذاتية' : 'Close CV'}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar */}
            <div className="relative">
              <img
                src={specialist.avatar}
                alt={displayName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white dark:border-white/20 shadow-md"
                referrerPolicy="no-referrer"
              />
              <span className={`absolute -bottom-2 ${isArabic ? '-left-2' : '-right-2'} bg-[#00E5BE] text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm`}>
                <BadgeCheck className="w-3 h-3" /> {isArabic ? 'متاح للحجز' : 'Available'}
              </span>
            </div>

            {/* Header info */}
            <div className={`text-center ${isArabic ? 'sm:text-right' : 'sm:text-left'} space-y-1.5 flex-1`}>
              <div className={`flex flex-wrap items-center justify-center ${isArabic ? 'sm:justify-start' : 'sm:justify-start'} gap-2`}>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{displayName}</h3>
                <span className="bg-sky-500/15 dark:bg-[#00E5BE]/20 text-sky-700 dark:text-[#00E5BE] text-xs px-2.5 py-0.5 rounded-full border border-sky-400/30 dark:border-[#00E5BE]/30 font-bold">
                  {displayRole}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{displayTitle}</p>
              
              <div className={`flex flex-wrap items-center justify-center ${isArabic ? 'sm:justify-start' : 'sm:justify-start'} gap-4 text-xs text-slate-600 dark:text-slate-300 pt-1`}>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-[#00E5BE]" />
                  {isArabic ? `خبرة سريرية: ${specialist.experienceYears} سنوات` : `Clinical Exp: ${specialist.experienceYears} Years`}
                </span>
                {specialist.licenseNumber && specialist.licenseNumber.trim() !== '' && (
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-[#00E5BE]" />
                    {isArabic ? 'ترخيص الهيئة:' : 'SCFHS Lic:'} <strong className="text-slate-900 dark:text-white font-mono">{specialist.licenseNumber}</strong>
                  </span>
                )}
                <span className="flex items-center gap-1 text-amber-500 dark:text-amber-300 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 dark:fill-amber-300" />
                  {specialist.rating} ({specialist.reviewsCount} {isArabic ? 'تقييم' : 'reviews'})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body: CV Sections */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          
          {/* Bio / Overview */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600 dark:text-[#00E5BE]" />
              <span>{isArabic ? 'نبذة تعريفية وفلسفة الرعاية التأهيلية' : 'Biography & Clinical Philosophy'}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-white/[0.05] p-4 rounded-2xl border border-slate-200 dark:border-white/15">
              {displayBio}
            </p>
          </div>

          {/* Education & Qualifications */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-sky-600 dark:text-[#00E5BE]" />
              <span>{isArabic ? 'المؤهلات الأكاديمية والدرجات العلمية' : 'Education & Academic Qualifications'}</span>
            </h4>
            <div className="space-y-2">
              {displayEducation.map((edu, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-sky-600 dark:bg-[#00E5BE] mt-2 shrink-0" />
                  <span>{edu}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Licenses & Certifications */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-600 dark:text-[#00E5BE]" />
              <span>{isArabic ? 'الاعتمادات المهنية والشهادات التخصصية' : 'Professional Certifications & Accreditations'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {displayCertifications.map((cert, idx) => (
                <div key={idx} className="bg-sky-50 dark:bg-[#00E5BE]/10 border border-sky-200 dark:border-[#00E5BE]/25 p-3 rounded-xl flex items-start gap-2 text-xs text-slate-800 dark:text-white font-medium">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-[#00E5BE] shrink-0 mt-0.5" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Areas of Expertise */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              {isArabic ? 'مجالات التركيز السريري الدقيق:' : 'Areas of Clinical Focus:'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {displaySpecialties.map((spec, idx) => (
                <span key={idx} className="bg-slate-100 dark:bg-white/[0.08] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/15 text-xs px-3 py-1 rounded-lg font-medium">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Working Days & Schedule */}
          <div className="bg-slate-50 dark:bg-white/[0.05] p-4 rounded-2xl border border-slate-200 dark:border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                {isArabic ? 'أيام تواجد الأخصائي بالمركز:' : 'Clinic Days:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {displayDays.map((day, idx) => (
                  <span key={idx} className="bg-white dark:bg-white/[0.08] border border-slate-200 dark:border-white/15 px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-white/[0.03] border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isArabic ? 'إغلاق السيرة الذاتية' : 'Close CV'}
          </button>

          <button
            id={`book-from-cv-${specialist.id}`}
            onClick={() => {
              onClose();
              onBookSpecialist(specialist);
            }}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#00E5BE] to-[#0284C7] text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer hover:brightness-105"
          >
            <Calendar className="w-4 h-4" />
            <span>{isArabic ? `حجز موعد مع ${displayName}` : `Book with ${displayName}`}</span>
            {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </div>
  );
};
