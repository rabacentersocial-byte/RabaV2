import React from 'react';

export const BacbBadge: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <div className={`liquid-glass-card rounded-2xl shadow-xl p-2 flex flex-col items-center justify-center text-center ${className}`}>
    <div className="w-10 h-10 rounded-full border border-[#2B95FF]/60 flex flex-col items-center justify-center p-0.5 bg-[#2B95FF]/12">
      <span className="text-[7px] font-extrabold text-[#161B26] dark:text-[#F8FAFC] tracking-tighter uppercase leading-none">CERTIFIED</span>
      <span className="text-[11px] font-black text-[#1263D6] dark:text-[#60AFFF] leading-tight">BACB</span>
      <span className="text-[6px] text-[#4B5563] dark:text-[#94A3B8] font-bold leading-none">BOARD</span>
    </div>
  </div>
);

export const IsoBadge: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <div className={`liquid-glass-card rounded-2xl shadow-xl p-2 flex flex-col items-center justify-center text-center ${className}`}>
    <div className="flex items-center gap-1">
      <span className="text-sm font-black text-[#161B26] dark:text-[#F8FAFC] tracking-tight">ISO</span>
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    </div>
    <span className="text-[7px] text-[#4B5563] dark:text-[#94A3B8] font-extrabold mt-0.5">9001:2015</span>
  </div>
);

export const BhcoeBadge: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <div className={`liquid-glass-card rounded-2xl shadow-xl border border-[#F59E0B]/40 p-1.5 flex flex-col items-center justify-center text-center ${className}`}>
    <div className="w-9 h-9 rounded-full border border-[#F59E0B] bg-[#F59E0B]/15 flex flex-col items-center justify-center">
      <span className="text-[6px] font-bold text-[#B45309] dark:text-[#FBBF24]">BHCOE</span>
      <span className="text-[9px] font-black text-[#B45309] dark:text-[#FBBF24]">★ ★ ★</span>
    </div>
  </div>
);

