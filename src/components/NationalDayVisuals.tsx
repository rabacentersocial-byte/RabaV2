import React from 'react';

/**
 * Saudi National Day 96 "عزّنا بطبعنا" Identity Emblem
 */
export const SaudiNationalDayBadge: React.FC<{ className?: string }> = ({ className = "h-11" }) => {
  return (
    <div className={`inline-flex items-center gap-2 bg-[#03231B] border border-emerald-500/40 rounded-xl px-3 py-1.5 shadow-sm text-right select-none ${className}`}>
      {/* Traditional Green Geometric Pattern */}
      <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center p-1 shrink-0">
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-emerald-300">
          <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" fill="#34D399" />
        </svg>
      </div>

      <div className="flex flex-col text-right leading-tight">
        <span className="text-white font-black text-xs tracking-wider font-sans">عزّنا بطبعنا</span>
        <span className="text-[9px] text-emerald-300/80 font-bold uppercase tracking-tight">اليوم الوطني السعودي 96</span>
      </div>
    </div>
  );
};

/**
 * Majestic Saudi Falcon with Green National Scarf
 */
export const SaudiFalconGraphic: React.FC<{ className?: string }> = ({ className = "w-28 h-28" }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />

      <svg viewBox="0 0 160 160" fill="none" className="w-full h-full drop-shadow-xl relative z-10">
        <defs>
          <linearGradient id="featherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8A6743" />
            <stop offset="50%" stopColor="#63452B" />
            <stop offset="100%" stopColor="#432D19" />
          </linearGradient>
          <linearGradient id="scarfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="60%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="beakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
        </defs>

        {/* Falcon Chest & Body */}
        <path
          d="M48 152 C48 110, 60 78, 88 64 C116 78, 128 110, 128 152 Z"
          fill="url(#featherGrad)"
          stroke="#382512"
          strokeWidth="2"
        />

        {/* Feather details on chest */}
        <path d="M72 105 Q88 115 104 105" stroke="#D1B89D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M68 120 Q88 132 108 120" stroke="#D1B89D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M64 135 Q88 148 112 135" stroke="#D1B89D" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Falcon Head */}
        <path
          d="M62 70 C60 42, 74 24, 98 22 C116 22, 126 36, 122 62 C120 72, 108 76, 92 74 C78 72, 64 78, 62 70 Z"
          fill="#A47E55"
          stroke="#432D19"
          strokeWidth="2"
        />

        {/* Head Feathers / Crest */}
        <path d="M85 24 Q95 16 102 24" stroke="#432D19" strokeWidth="2" fill="none" />
        <path d="M78 28 Q88 20 95 28" stroke="#432D19" strokeWidth="2" fill="none" />

        {/* Eye Mask / Dark Patch around eye */}
        <path
          d="M86 42 Q102 38 110 44 Q106 54 90 52 Z"
          fill="#2B1A0E"
        />

        {/* Falcon Eye (Sharp Amber Eye with black pupil and specular dot) */}
        <circle cx="98" cy="45" r="7" fill="#F59E0B" stroke="#111827" strokeWidth="1.5" />
        <circle cx="98" cy="45" r="4" fill="#030712" />
        <circle cx="96" cy="43" r="1.5" fill="#FFFFFF" />

        {/* Curved Sharp Beak */}
        <path
          d="M116 45 C128 47, 138 55, 134 68 C130 72, 124 70, 120 62 C118 58, 116 54, 114 50 Z"
          fill="url(#beakGrad)"
          stroke="#1F2937"
          strokeWidth="1.5"
        />
        <path d="M120 54 Q126 56 128 62" stroke="#4B5563" strokeWidth="1" fill="none" />

        {/* Green National Scarf Draped Around Falcon's Neck */}
        <path
          d="M54 75 C68 68, 108 68, 122 75 C126 84, 122 96, 112 100 C88 106, 68 104, 54 96 C48 88, 48 80, 54 75 Z"
          fill="url(#scarfGrad)"
          stroke="#065F46"
          strokeWidth="2"
        />
        {/* Scarf folds and golden fringe embroidery */}
        <path d="M58 84 Q88 94 118 84" stroke="#34D399" strokeWidth="2" fill="none" />
        <path d="M62 92 Q88 100 114 92" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />

        {/* Scarf hanging tail on left */}
        <path
          d="M58 88 C50 98, 44 118, 42 136 C48 138, 56 134, 60 126 C64 114, 66 98, 62 88 Z"
          fill="url(#scarfGrad)"
          stroke="#065F46"
          strokeWidth="1.5"
        />
        {/* Golden Tassels on scarf end */}
        <path d="M42 136 L40 144 M45 137 L45 145 M49 136 L50 145 M54 135 L56 144 M59 133 L61 142" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};
