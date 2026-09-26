import React from 'react';
import { 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { BacbBadge, IsoBadge, BhcoeBadge } from './TrustBadges';
import { useLanguage } from '../context/LanguageContext';

export const AboutSection: React.FC = () => {
  const { t, isArabic } = useLanguage();

  return (
    <section 
      id="about" 
      className="py-16 md:py-24 relative overflow-hidden border-b border-slate-200/80 dark:border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Badges & Showcase (Left in RTL, Right in LTR) */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative mx-auto max-w-md glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/20 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-400/30">
                  {t.about.badge}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">{t.about.badgeSub}</span>
              </div>

              {/* Accreditations Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/80 dark:bg-white/[0.06] backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-white/15 flex flex-col items-center text-center">
                  <BacbBadge className="w-12 h-12 mb-1" />
                  <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 mt-1">{t.about.bacbTitle}</span>
                  <span className="text-[8px] text-slate-500 dark:text-slate-400">{t.about.bacbSub}</span>
                </div>

                <div className="bg-white/80 dark:bg-white/[0.06] backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-white/15 flex flex-col items-center text-center">
                  <IsoBadge className="w-12 h-12 mb-1" />
                  <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 mt-1">{t.about.isoTitle}</span>
                  <span className="text-[8px] text-slate-500 dark:text-slate-400">{t.about.isoSub}</span>
                </div>

                <div className="bg-white/80 dark:bg-white/[0.06] backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-white/15 flex flex-col items-center text-center">
                  <BhcoeBadge className="w-12 h-12 mb-1" />
                  <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 mt-1">{t.about.bhcoeTitle}</span>
                  <span className="text-[8px] text-slate-500 dark:text-slate-400">{t.about.bhcoeSub}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-white/80 dark:bg-white/[0.05] p-4 rounded-2xl border border-slate-200 dark:border-white/15 text-center">
                  <div className="text-2xl font-black text-sky-600 dark:text-[#00E5BE]">{t.about.yearsExp}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{t.about.yearsExpLabel}</div>
                </div>
                <div className="bg-white/80 dark:bg-white/[0.05] p-4 rounded-2xl border border-slate-200 dark:border-white/15 text-center">
                  <div className="text-2xl font-black text-[#0D6D54] dark:text-[#00E5BE]">{t.about.beneficiaries}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{t.about.beneficiariesLabel}</div>
                </div>
              </div>

              {/* Quote pill */}
              <div className={`p-3.5 rounded-2xl bg-sky-500/10 dark:bg-[#00E5BE]/10 border border-sky-400/30 dark:border-[#00E5BE]/30 text-xs text-sky-900 dark:text-teal-200 leading-relaxed ${isArabic ? 'text-right' : 'text-left'}`}>
                {isArabic 
                  ? '"نلتزم بأعلى معايير تحليل السلوك التطبيقي والتدخل العلمي المبني على البراهين، لنمنح كل طفل فرصة حقيقية للاندماج والريادة."'
                  : '"We are strictly committed to premier evidence-based Applied Behavior Analysis, granting every child their highest potential for societal integration and leadership."'}
              </div>

            </div>
          </div>

          {/* Copy Column */}
          <div className={`lg:col-span-7 order-1 lg:order-2 space-y-5 ${isArabic ? 'text-right' : 'text-left'}`}>
            
            <div className="inline-flex items-center gap-2 bg-sky-500/15 dark:bg-[#00E5BE]/15 text-sky-700 dark:text-[#00E5BE] border border-sky-400/30 dark:border-[#00E5BE]/30 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.about.badge}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight drop-shadow-xs">
              {t.about.title}
            </h2>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
              {t.about.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-medium">
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/70 dark:bg-white/[0.04] backdrop-blur-md border border-slate-200 dark:border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00E5BE] shrink-0 mt-0.5" />
                <span>{t.about.point1}</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/70 dark:bg-white/[0.04] backdrop-blur-md border border-slate-200 dark:border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00E5BE] shrink-0 mt-0.5" />
                <span>{t.about.point2}</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/70 dark:bg-white/[0.04] backdrop-blur-md border border-slate-200 dark:border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00E5BE] shrink-0 mt-0.5" />
                <span>{t.about.point3}</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/70 dark:bg-white/[0.04] backdrop-blur-md border border-slate-200 dark:border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00E5BE] shrink-0 mt-0.5" />
                <span>{t.about.point4}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
