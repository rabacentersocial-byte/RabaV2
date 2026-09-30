import React from 'react';
import { 
  Stethoscope, 
  Baby, 
  Users, 
  UserCheck 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useDailyChildrenCounter } from '../utils/dailyChildrenCounter';

export const StatsBar: React.FC = () => {
  const { t, isArabic } = useLanguage();
  const { count: dailyCount, formattedTotal, isWithinHours } = useDailyChildrenCounter(10);

  return (
    <section 
      id="stats-bar" 
      className={`py-8 relative z-20 ${isArabic ? 'text-right' : 'text-left'} border-b border-slate-200/80 dark:border-white/10`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          
          {/* Card 1: عدد الجلسات العلاجية */}
          <div className="glass-card p-3.5 sm:p-6 flex flex-col-reverse xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4 group hover:border-sky-400/50 rounded-2xl sm:rounded-3xl transition-all duration-300 relative overflow-hidden">
            <div className={isArabic ? 'text-right' : 'text-left'}>
              <div className="text-lg xs:text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-0.5">
                <span className="text-[#0284C7] dark:text-[#00E5BE] font-extrabold text-base xs:text-lg sm:text-3xl">+</span>
                <span>500K</span>
              </div>
              <p className="text-[11px] sm:text-sm text-slate-600 dark:text-slate-300 font-bold mt-0.5 sm:mt-1">
                {t.stats.sessionsLabel}
              </p>
            </div>

            {/* Professional Medical Stethoscope Icon Badge */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-sky-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-sky-500/20 via-sky-500/10 to-transparent dark:from-sky-400/25 dark:via-sky-500/10 dark:to-transparent border border-sky-400/35 dark:border-sky-400/30 flex items-center justify-center text-[#0284C7] dark:text-[#00E5BE] shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                <Stethoscope className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2]" />
              </div>
            </div>
          </div>

          {/* Card 2: عدد الأطفال المستفيدين (Synchronized with Daily Children Counter) */}
          <div 
            id="stat-children-card"
            className="glass-card p-3.5 sm:p-6 flex flex-col-reverse xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4 group hover:border-teal-400/50 rounded-2xl sm:rounded-3xl transition-all duration-300 relative overflow-hidden"
            title={isArabic ? `إجمالي الأطفال المستفيدين: ${formattedTotal}+ (يزداد تلقائياً بـ 10 أطفال يومياً من 8:00 ص إلى 6:00 م — المسجل اليوم: +${dailyCount})` : `Total beneficiary children: ${formattedTotal}+ (+${dailyCount} enrolled today)`}
          >
            <div className={isArabic ? 'text-right' : 'text-left'}>
              <div className="text-lg xs:text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1">
                <span className="text-[#0D6D54] dark:text-[#00E5BE] font-extrabold text-base xs:text-lg sm:text-3xl">+</span>
                <span>{formattedTotal}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1 flex-wrap">
                <p className="text-[11px] sm:text-sm text-slate-600 dark:text-slate-300 font-bold">
                  {t.stats.childrenLabel}
                </p>
                {/* Synchronized Live Daily Pill */}
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-400/15 border border-emerald-500/25 text-[#0D6D54] dark:text-[#00E5BE] text-[10px] font-extrabold shadow-2xs">
                  {isWithinHours && <span className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping inline-block" />}
                  <span>+{dailyCount} {isArabic ? 'اليوم' : 'today'}</span>
                </span>
              </div>
            </div>

            {/* Professional Pediatric Care Baby Icon Badge */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-teal-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#0D6D54]/20 via-teal-500/10 to-transparent dark:from-teal-400/25 dark:via-emerald-400/10 dark:to-transparent border border-teal-400/35 dark:border-teal-400/30 flex items-center justify-center text-[#0D6D54] dark:text-[#00E5BE] shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                <Baby className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2]" />
              </div>
            </div>
          </div>

          {/* Card 3: عدد الأسر المدعومة */}
          <div className="glass-card p-3.5 sm:p-6 flex flex-col-reverse xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4 group hover:border-emerald-400/50 rounded-2xl sm:rounded-3xl transition-all duration-300 relative overflow-hidden">
            <div className={isArabic ? 'text-right' : 'text-left'}>
              <div className="text-lg xs:text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-0.5">
                <span className="text-[#059669] dark:text-[#10B981] font-extrabold text-base xs:text-lg sm:text-3xl">+</span>
                <span>1,050</span>
              </div>
              <p className="text-[11px] sm:text-sm text-slate-600 dark:text-slate-300 font-bold mt-0.5 sm:mt-1">
                {t.stats.familiesLabel}
              </p>
            </div>

            {/* Professional Family Empowerment Icon Badge */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent dark:from-emerald-400/25 dark:via-emerald-400/10 dark:to-transparent border border-emerald-400/35 dark:border-emerald-400/30 flex items-center justify-center text-[#059669] dark:text-[#10B981] shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                <Users className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2]" />
              </div>
            </div>
          </div>

          {/* Card 4: عدد الأخصائيين المعتمدين */}
          <div className="glass-card p-3.5 sm:p-6 flex flex-col-reverse xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4 group hover:border-amber-400/50 rounded-2xl sm:rounded-3xl transition-all duration-300 relative overflow-hidden">
            <div className={isArabic ? 'text-right' : 'text-left'}>
              <div className="text-lg xs:text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-0.5">
                <span className="text-[#D97706] dark:text-[#F59E0B] font-extrabold text-base xs:text-lg sm:text-3xl">+</span>
                <span>48</span>
              </div>
              <p className="text-[11px] sm:text-sm text-slate-600 dark:text-slate-300 font-bold mt-0.5 sm:mt-1">
                {t.stats.specialistsLabel}
              </p>
            </div>

            {/* Professional Certified Specialist Icon Badge */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-amber-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent dark:from-amber-400/25 dark:via-amber-400/10 dark:to-transparent border border-amber-400/35 dark:border-amber-400/30 flex items-center justify-center text-[#D97706] dark:text-[#F59E0B] shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                <UserCheck className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2]" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
