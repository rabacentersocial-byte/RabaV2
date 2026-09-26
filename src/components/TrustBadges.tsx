import React from 'react';

export const BacbBadge: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <div className={`bg-white/[0.08] backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-2 flex flex-col items-center justify-center text-center ${className}`}>
    <div className="w-10 h-10 rounded-full border border-[#00E5BE]/60 flex flex-col items-center justify-center p-0.5 bg-[#00E5BE]/10">
      <span className="text-[7px] font-extrabold text-slate-200 tracking-tighter uppercase leading-none">CERTIFIED</span>
      <span className="text-[11px] font-black text-[#00E5BE] leading-tight">BACB</span>
      <span className="text-[6px] text-slate-300 font-bold leading-none">BOARD</span>
    </div>
  </div>
);

export const IsoBadge: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <div className={`bg-white/[0.08] backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-2 flex flex-col items-center justify-center text-center ${className}`}>
    <div className="flex items-center gap-1">
      <span className="text-sm font-black text-white tracking-tight">ISO</span>
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    </div>
    <span className="text-[7px] text-slate-300 font-extrabold mt-0.5">9001:2015</span>
  </div>
);

export const BhcoeBadge: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <div className={`bg-white/[0.08] backdrop-blur-md rounded-2xl shadow-xl border border-amber-400/40 p-1.5 flex flex-col items-center justify-center text-center ${className}`}>
    <div className="w-9 h-9 rounded-full border border-amber-400 bg-amber-400/15 flex flex-col items-center justify-center">
      <span className="text-[6px] font-bold text-amber-300">BHCOE</span>
      <span className="text-[9px] font-black text-amber-300">★ ★ ★</span>
    </div>
  </div>
);

