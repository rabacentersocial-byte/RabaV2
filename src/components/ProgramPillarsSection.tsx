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
      className="relative py-16 sm:py-24 overflow-hidden border-b border-[#161B26]/[0.06] dark:border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-18">
          
          {/* Main Title */}
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#161B26] dark:text-[#F8FAFC] drop-shadow-xs">
            {t.pillars.title}
          </h2>

          {/* Wavy Raba Sky Blue squiggle */}
          <div className="flex justify-center items-center py-1">
            <svg 
              width="90" 
              height="18" 
              viewBox="0 0 90 18" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#2B95FF]"
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
          <p className="text-base sm:text-xl text-[#4B5563] dark:text-[#94A3B8] font-normal leading-relaxed">
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
            const pillarAccents = [
              { box: 'bg-[#2B95FF]/12 border-[#2B95FF]/25', icon: 'text-[#1263D6] dark:text-[#60AFFF]', bar: 'group-hover:bg-[#2B95FF]' },
              { box: 'bg-[#10B981]/12 border-[#10B981]/25', icon: 'text-[#047857] dark:text-[#34D399]', bar: 'group-hover:bg-[#10B981]' },
              { box: 'bg-[#F59E0B]/12 border-[#F59E0B]/25', icon: 'text-[#B45309] dark:text-[#FBBF24]', bar: 'group-hover:bg-[#F59E0B]' },
              { box: 'bg-[#8B5CF6]/12 border-[#8B5CF6]/25', icon: 'text-[#6D28D9] dark:text-[#A78BFA]', bar: 'group-hover:bg-[#8B5CF6]' },
              { box: 'bg-[#2B95FF]/12 border-[#2B95FF]/25', icon: 'text-[#1263D6] dark:text-[#60AFFF]', bar: 'group-hover:bg-[#2B95FF]' },
            ];
            const accent = pillarAccents[idx % pillarAccents.length];

            return (
              <div
                key={pillar.id}
                className={`group relative glass-card p-4 sm:p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 rounded-[28px] ${
                  isLastOnMobile ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                {/* Circular Glass Badge with Icon */}
                <div className={`w-12 h-12 sm:w-20 sm:h-20 rounded-2xl ${accent.box} backdrop-blur-md border flex items-center justify-center mb-3 sm:mb-6 group-hover:scale-105 transition-all shadow-xs`}>
                  <Icon className={`w-6 h-6 sm:w-9 sm:h-9 ${accent.icon} stroke-[2.2]`} />
                </div>

                {/* Pillar Title */}
                <h3 className="text-sm sm:text-lg font-black text-[#161B26] dark:text-[#F8FAFC] mb-1.5 sm:mb-3 leading-snug">
                  {pTitle}
                </h3>

                {/* Pillar Description */}
                <p className="text-[11px] sm:text-sm text-[#4B5563] dark:text-[#94A3B8] font-normal leading-relaxed">
                  {pDesc}
                </p>

                {/* Subtle bottom indicator */}
                <div className="mt-auto pt-3 sm:pt-5 w-full flex justify-center">
                  <span className={`w-6 h-1 rounded-full bg-[#161B26]/15 dark:bg-white/20 group-hover:w-12 ${accent.bar} transition-all duration-300`} />
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
              className="inline-flex items-center gap-2 warm-pill-cta font-black px-8 py-3.5 rounded-full shadow-lg border border-white/20 transition-all text-sm sm:text-base cursor-pointer group"
            >
              <span>{t.pillars.bookPillars}</span>
              {isArabic ? <ArrowLeft className="w-4 h-4 text-[#2B95FF] group-hover:text-white transition-colors" /> : <ArrowRight className="w-4 h-4 text-[#2B95FF] group-hover:text-white transition-colors" />}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
