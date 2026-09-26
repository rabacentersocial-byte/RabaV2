import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Lightbulb, 
  Heart, 
  Star, 
  Globe, 
  ShieldCheck,
  Award,
  Sparkles,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getStoredPillars, ProgramPillarItem } from '../data/siteCustomizer';

interface ProgramPillarsSectionProps {
  onOpenBooking?: () => void;
}

const ICON_MAP: Record<string, any> = {
  UserCheck,
  Lightbulb,
  Heart,
  Star,
  Globe,
  ShieldCheck,
  Award,
  Sparkles
};

export const ProgramPillarsSection: React.FC<ProgramPillarsSectionProps> = ({ onOpenBooking }) => {
  const { t, isArabic } = useLanguage();
  const [pillars, setPillars] = useState<ProgramPillarItem[]>(() => getStoredPillars());

  useEffect(() => {
    const handleUpdate = () => {
      setPillars(getStoredPillars());
    };
    window.addEventListener('raba_pillars_updated', handleUpdate);
    window.addEventListener('raba_persistent_sync_ready', handleUpdate);
    return () => {
      window.removeEventListener('raba_pillars_updated', handleUpdate);
      window.removeEventListener('raba_persistent_sync_ready', handleUpdate);
    };
  }, []);

  const activePillars = pillars.filter((p) => p.active !== false);

  return (
    <section 
      id="pillars-section" 
      className="relative py-16 sm:py-24 overflow-hidden border-b border-slate-200/80 dark:border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-18">
          
          {/* Main Title */}
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-xs">
            {t.pillars.title}
          </h2>

          {/* Wavy Cyan squiggle */}
          <div className="flex justify-center items-center py-1">
            <svg 
              width="90" 
              height="18" 
              viewBox="0 0 90 18" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-sky-500 dark:text-[#00E5BE]"
            >
              <path 
                d="M 5 9 Q 25 -2, 45 9 T 85 9" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinecap="round" 
                fill="none" 
              />
            </svg>
          </div>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-200 font-normal leading-relaxed">
            {t.pillars.subtitle}
          </p>
        </div>

        {/* Frosted Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6">
          {activePillars.map((pillar, idx) => {
            const Icon = ICON_MAP[pillar.iconName] || Star;
            const isLastOnMobile = idx === activePillars.length - 1;
            const pTitle = isArabic ? pillar.titleAr : (pillar.titleEn || pillar.titleAr);
            const pDesc = isArabic ? pillar.descAr : (pillar.descEn || pillar.descAr);

            return (
              <div
                key={pillar.id}
                className={`group relative glass-card p-4 sm:p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 rounded-2xl sm:rounded-3xl ${
                  isLastOnMobile ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                {/* Circular Glass Badge with Icon in Logo Colors */}
                <div className={`w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl ${pillar.bgColor || 'bg-teal-500/15'} backdrop-blur-md border ${pillar.borderColor || 'border-teal-400/30'} flex items-center justify-center mb-3 sm:mb-6 group-hover:scale-105 transition-all shadow-xs`}>
                  <Icon className={`w-6 h-6 sm:w-9 sm:h-9 ${pillar.color || 'text-[#00E5BE]'} stroke-[2.2]`} />
                </div>

                {/* Pillar Title */}
                <h3 className="text-sm sm:text-lg font-black text-slate-900 dark:text-white mb-1.5 sm:mb-3 leading-snug">
                  {pTitle}
                </h3>

                {/* Pillar Description */}
                <p className="text-[11px] sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                  {pDesc}
                </p>

                {/* Subtle bottom indicator */}
                <div className="mt-auto pt-3 sm:pt-5 w-full flex justify-center">
                  <span className="w-6 h-1 rounded-full bg-slate-300 dark:bg-white/20 group-hover:w-12 group-hover:bg-[#00E5BE] transition-all duration-300" />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Prompt */}
        {onOpenBooking && (
          <div className="mt-12 text-center">
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 bg-[#0B3B36] hover:bg-[#124e47] text-white dark:bg-gradient-to-r dark:from-[#00E5BE] dark:via-[#00c9a7] dark:to-[#0284C7] dark:text-slate-950 font-black px-8 py-3.5 rounded-2xl shadow-lg shadow-teal-900/20 dark:shadow-teal-500/20 border border-white/20 transition-all text-sm sm:text-base cursor-pointer"
            >
              <span>{t.pillars.bookPillars}</span>
              {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
