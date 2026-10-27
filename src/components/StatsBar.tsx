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
          
          {/* Card 1: عدد الجلسات العلاجية (Primary #2E86EB) */}
          <div className="glass-card p-3.5 sm:p-6 flex flex-col-reverse xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4 group hover:border-[#2E86EB]/50 rounded-2xl sm:rounded-3xl transition-all duration-300 relative overflow-hidden">
            <div className={isArabic ? 'text-right' : 'text-left'}>
              <div className="text-lg xs:text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-0.5">
                <span className="text-[#2E86EB] font-extrabold text-base xs:text-lg sm:text-3xl">+</span>
                <span>500K</span>
              </div>
              <p className="text-[11px] sm:text-sm text-slate-600 dark:text-slate-300 font-bold mt-0.5 sm:mt-1">
                {t.stats.sessionsLabel}
              </p>
            </div>

            {/* Professional Medical Stethoscope Icon Badge */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-[#2E86EB]/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#2E86EB]/20 via-[#2E86EB]/10 to-transparent border border-[#2E86EB]/35 flex items-center justify-center text-[#2E86EB] shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                <Stethoscope className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2]" />
              </div>
            </div>
          </div>

          {/* Card 2: عدد الأطفال المستفيدين (Tertiary #22C55E) */}
          <div 
            id="stat-children-card"
            className="glass-card p-3.5 sm:p-6 flex flex-col-reverse xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4 group hover:border-[#22C55E]/50 rounded-2xl sm:rounded-3xl transition-all duration-300 relative overflow-hidden"
          >
            <div className={isArabic ? 'text-right' : 'text-left'}>
              <div className="text-lg xs:text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1">
                <span className="text-[#22C55E] font-extrabold text-base xs:text-lg sm:text-3xl">+</span>
                <span>{formattedTotal}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1 flex-wrap">
                <p className="text-[11px] sm:text-sm text-slate-600 dark:text-slate-300 font-bold">
                  {t.stats.childrenLabel}
                </p>
                {/* Synchronized Live Daily Pill */}
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-[10px] font-extrabold shadow-2xs">
                  {isWithinHours && <span className="w-1 h-1 rounded-full bg-[#22C55E] animate-ping inline-block" />}
                  <span>+{dailyCount} {isArabic ? 'اليوم' : 'today'}</span>
                </span>
              </div>
            </div>

            {/* Professional Pediatric Care Baby Icon Badge */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-[#22C55E]/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#22C55E]/20 via-[#22C55E]/10 to-transparent border border-[#22C55E]/35 flex items-center justify-center text-[#22C55E] shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                <Baby className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2]" />
              </div>
            </div>
          </div>

          {/* Card 3: عدد الأسر المدعومة (Accent #FF2D9B) */}
          <div className="glass-card p-3.5 sm:p-6 flex flex-col-reverse xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4 group hover:border-[#FF2D9B]/50 rounded-2xl sm:rounded-3xl transition-all duration-300 relative overflow-hidden">
            <div className={isArabic ? 'text-right' : 'text-left'}>
              <div className="text-lg xs:text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-0.5">
                <span className="text-[#FF2D9B] font-extrabold text-base xs:text-lg sm:text-3xl">+</span>
                <span>1,050</span>
              </div>
              <p className="text-[11px] sm:text-sm text-slate-600 dark:text-slate-300 font-bold mt-0.5 sm:mt-1">
                {t.stats.familiesLabel}
              </p>
            </div>

            {/* Professional Family Empowerment Icon Badge */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-[#FF2D9B]/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#FF2D9B]/20 via-[#FF2D9B]/10 to-transparent border border-[#FF2D9B]/35 flex items-center justify-center text-[#FF2D9B] shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                <Users className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2]" />
              </div>
            </div>
          </div>

          {/* Card 4: عدد الأخصائيين المعتمدين (Secondary #FFD23F) */}
          <div className="glass-card p-3.5 sm:p-6 flex flex-col-reverse xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4 group hover:border-[#FFD23F]/50 rounded-2xl sm:rounded-3xl transition-all duration-300 relative overflow-hidden">
            <div className={isArabic ? 'text-right' : 'text-left'}>
              <div className="text-lg xs:text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-0.5">
                <span className="text-[#FFD23F] font-extrabold text-base xs:text-lg sm:text-3xl">+</span>
                <span>60</span>
              </div>
              <p className="text-[11px] sm:text-sm text-slate-600 dark:text-slate-300 font-bold mt-0.5 sm:mt-1">
                {t.stats.specialistsLabel}
              </p>
            </div>

            {/* Professional Certified Specialist Icon Badge */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-[#FFD23F]/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#FFD23F]/20 via-[#FFD23F]/10 to-transparent border border-[#FFD23F]/35 flex items-center justify-center text-[#FFD23F] shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                <UserCheck className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2]" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
