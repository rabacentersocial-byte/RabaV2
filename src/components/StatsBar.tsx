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
      className={`py-8 relative z-20 ${isArabic ? 'text-right' : 'text-left'} border-b border-[#161B26]/[0.06] dark:border-white/[0.08]`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          
          {/* Card 1 */}
          <div className="glass-card p-3.5 sm:p-6 flex flex-col-reverse xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4 group hover:border-[#2B95FF]/45 rounded-[28px] transition-all duration-300 relative overflow-hidden">
            <div className={isArabic ? 'text-right' : 'text-left'}>
              <div className="text-lg xs:text-xl sm:text-3xl font-black text-[#161B26] dark:text-[#F8FAFC] tracking-tight flex items-center gap-0.5">
                <span className="text-[#1263D6] dark:text-[#60AFFF] font-extrabold text-base xs:text-lg sm:text-3xl">+</span>
                <span>500K</span>
              </div>
              <p className="text-[11px] sm:text-sm text-[#4B5563] dark:text-[#94A3B8] font-bold mt-0.5 sm:mt-1">
                {t.stats.sessionsLabel}
              </p>
            </div>

            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-[#2B95FF]/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#2B95FF]/20 via-[#2B95FF]/10 to-transparent border border-[#2B95FF]/30 flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                <Stethoscope className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2]" />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div 
            id="stat-children-card"
            className="glass-card p-3.5 sm:p-6 flex flex-col-reverse xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4 group hover:border-[#10B981]/45 rounded-[28px] transition-all duration-300 relative overflow-hidden"
          >
            <div className={isArabic ? 'text-right' : 'text-left'}>
              <div className="text-lg xs:text-xl sm:text-3xl font-black text-[#161B26] dark:text-[#F8FAFC] tracking-tight flex items-center gap-1">
                <span className="text-[#047857] dark:text-[#34D399] font-extrabold text-base xs:text-lg sm:text-3xl">+</span>
                <span>{formattedTotal}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1 flex-wrap">
                <p className="text-[11px] sm:text-sm text-[#4B5563] dark:text-[#94A3B8] font-bold">
                  {t.stats.childrenLabel}
                </p>
                {/* Synchronized Live Daily Pill */}
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#10B981]/12 border border-[#10B981]/30 text-[#047857] dark:text-[#34D399] text-[10px] font-extrabold shadow-2xs">
                  {isWithinHours && <span className="w-1 h-1 rounded-full bg-[#10B981] animate-ping inline-block" />}
                  <span>+{dailyCount} {isArabic ? 'اليوم' : 'today'}</span>
                </span>
              </div>
            </div>

            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-[#10B981]/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#10B981]/20 via-[#10B981]/10 to-transparent border border-[#10B981]/30 flex items-center justify-center text-[#047857] dark:text-[#34D399] shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                <Baby className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2]" />
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-3.5 sm:p-6 flex flex-col-reverse xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4 group hover:border-[#8B5CF6]/45 rounded-[28px] transition-all duration-300 relative overflow-hidden">
            <div className={isArabic ? 'text-right' : 'text-left'}>
              <div className="text-lg xs:text-xl sm:text-3xl font-black text-[#161B26] dark:text-[#F8FAFC] tracking-tight flex items-center gap-0.5">
                <span className="text-[#6D28D9] dark:text-[#A78BFA] font-extrabold text-base xs:text-lg sm:text-3xl">+</span>
                <span>1,050</span>
              </div>
              <p className="text-[11px] sm:text-sm text-[#4B5563] dark:text-[#94A3B8] font-bold mt-0.5 sm:mt-1">
                {t.stats.familiesLabel}
              </p>
            </div>

            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-[#8B5CF6]/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/20 via-[#8B5CF6]/10 to-transparent border border-[#8B5CF6]/30 flex items-center justify-center text-[#6D28D9] dark:text-[#A78BFA] shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                <Users className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2]" />
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-card p-3.5 sm:p-6 flex flex-col-reverse xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4 group hover:border-[#F59E0B]/45 rounded-[28px] transition-all duration-300 relative overflow-hidden">
            <div className={isArabic ? 'text-right' : 'text-left'}>
              <div className="text-lg xs:text-xl sm:text-3xl font-black text-[#161B26] dark:text-[#F8FAFC] tracking-tight flex items-center gap-0.5">
                <span className="text-[#B45309] dark:text-[#FBBF24] font-extrabold text-base xs:text-lg sm:text-3xl">+</span>
                <span>60</span>
              </div>
              <p className="text-[11px] sm:text-sm text-[#4B5563] dark:text-[#94A3B8] font-bold mt-0.5 sm:mt-1">
                {t.stats.specialistsLabel}
              </p>
            </div>

            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-[#2B95FF]/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#2B95FF] to-[#8B5CF6] border border-white/30 flex items-center justify-center text-white shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                <UserCheck className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2]" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
