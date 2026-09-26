import React from 'react';

export const TamaraLogo: React.FC<{ className?: string; height?: number }> = ({ 
  className = "h-7", 
  height = 28 
}) => {
  return (
    <div 
      className={`inline-flex items-center justify-center px-3.5 py-1 rounded-full shadow-xs border border-white/60 dark:border-white/20 select-none ${className}`}
      style={{
        background: 'linear-gradient(90deg, #FDE197 0%, #FFAE78 35%, #F88FA6 70%, #B8D6F7 100%)',
        height: `${height}px`
      }}
      title="Tamara - تمارا"
      aria-label="Tamara"
    >
      <span className="text-black font-black text-xs sm:text-sm tracking-tight font-sans leading-none">
        tamara
      </span>
    </div>
  );
};

export const EmkanLogo: React.FC<{ className?: string; height?: number; inDark?: boolean }> = ({ 
  className = "h-7", 
  height = 28,
  inDark = false
}) => {
  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-white/15 shadow-xs select-none ${className}`}
      style={{ height: `${height}px` }}
      title="Emkan - إمكان للتمويل"
      aria-label="Emkan"
    >
      {/* Emkan 3-loop clover icon */}
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M 17 22 C 17 12, 27 12, 27 22 C 27 27, 22 30, 17 30 M 17 22 C 7 22, 7 32, 17 32 C 23 32, 26 27, 26 22 M 22 26 C 22 36, 32 36, 32 26 C 32 20, 27 17, 22 17" 
          stroke="#00B5A5" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>
      {/* Emkan Arabic & English text */}
      <div className="flex flex-col justify-center leading-none text-left">
        <span className={`font-black text-[10px] leading-tight ${inDark ? 'text-white' : 'text-[#1E2050] dark:text-white'}`}>
          إمكـان
        </span>
        <span className={`font-bold text-[7px] tracking-wider leading-none ${inDark ? 'text-slate-300' : 'text-[#1E2050]/80 dark:text-slate-300'}`}>
          EMKAN
        </span>
      </div>
    </div>
  );
};

export const InstallmentLogosRow: React.FC<{
  className?: string;
  isArabic?: boolean;
}> = ({ className = '', isArabic = true }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TamaraLogo height={26} />
      <EmkanLogo height={26} />
    </div>
  );
};
