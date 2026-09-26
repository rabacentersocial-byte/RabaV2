import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

export const AnimatedBackground: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none transition-colors duration-500">
      {/* Base Canvas Gradient */}
      <div 
        className={`absolute inset-0 transition-colors duration-500 ${
          isDark 
            ? 'bg-gradient-to-b from-[#080C16] via-[#0B1120] to-[#090D18]' 
            : 'bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]'
        }`} 
      />

      {/* 
        The 4 Emblem Brand Glows (Sky Blue, Golden Amber, Emerald Green, Vibrant Rose)
      */}
      
      {/* 1. Sky Blue / Vibrant Cyan Orb (Top Right) */}
      <motion.div
        aria-hidden="true"
        className={`absolute -top-36 -right-24 w-[550px] h-[550px] rounded-full blur-[110px] transition-all duration-700 ${
          isDark 
            ? 'bg-gradient-to-br from-[#00E5BE]/25 via-[#0284C7]/20 to-blue-700/10' 
            : 'bg-gradient-to-br from-[#38BDF8]/20 via-[#00E5BE]/15 to-sky-200/40'
        }`}
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.12, 0.94, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 2. Deep Medical Teal / Mint Glow Orb (Center Left) */}
      <motion.div
        aria-hidden="true"
        className={`absolute top-1/4 -left-36 w-[580px] h-[580px] rounded-full blur-[120px] transition-all duration-700 ${
          isDark 
            ? 'bg-gradient-to-tr from-[#0B3B36]/30 via-[#0D6D54]/20 to-teal-900/15' 
            : 'bg-gradient-to-tr from-[#99F6E4]/25 via-[#CCFBF1]/20 to-teal-100/35'
        }`}
        animate={{
          x: [0, 50, -35, 0],
          y: [0, 50, -25, 0],
          scale: [1, 0.92, 1.1, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 3. Emerald Green Orb (Mid-Bottom Right) */}
      <motion.div
        aria-hidden="true"
        className={`absolute top-2/3 -right-32 w-[620px] h-[620px] rounded-full blur-[130px] transition-all duration-700 ${
          isDark 
            ? 'bg-gradient-to-tl from-[#10B981]/20 via-[#059669]/15 to-teal-800/10' 
            : 'bg-gradient-to-tl from-[#34D399]/18 via-[#6EE7B7]/15 to-emerald-100/30'
        }`}
        animate={{
          x: [0, -50, 35, 0],
          y: [0, -35, 45, 0],
          scale: [1, 1.08, 0.94, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 4. Warm Golden Amber Orb (Bottom Left / Center) */}
      <motion.div
        aria-hidden="true"
        className={`absolute -bottom-40 left-1/4 w-[580px] h-[580px] rounded-full blur-[120px] transition-all duration-700 ${
          isDark 
            ? 'bg-gradient-to-r from-[#F59E0B]/18 via-[#D97706]/12 to-amber-700/10' 
            : 'bg-gradient-to-r from-[#FBBF24]/18 via-[#FDE68A]/15 to-amber-100/30'
        }`}
        animate={{
          x: [0, 45, -45, 0],
          y: [0, -35, 25, 0],
          scale: [1, 1.06, 0.94, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Specular Floating Glass Crystals (Pediatric & Puzzle Inspiration) */}
      <motion.div
        aria-hidden="true"
        className={`absolute top-36 left-[10%] w-10 h-10 rounded-2xl backdrop-blur-md shadow-lg ${
          isDark 
            ? 'bg-white/[0.06] border border-white/20 shadow-sky-500/10' 
            : 'bg-white/70 border border-slate-200/80 shadow-slate-300/40'
        }`}
        animate={{
          y: [0, -25, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden="true"
        className={`absolute top-[48%] right-[8%] w-12 h-12 rounded-full backdrop-blur-md shadow-xl ${
          isDark 
            ? 'bg-gradient-to-tr from-[#00E5BE]/15 to-white/10 border border-white/20' 
            : 'bg-gradient-to-tr from-[#00E5BE]/20 to-white/80 border border-emerald-200/70 shadow-emerald-200/30'
        }`}
        animate={{
          y: [0, 25, 0],
          rotate: [15, -15, 15],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <motion.div
        aria-hidden="true"
        className={`absolute top-[75%] left-[8%] w-8 h-8 rounded-xl backdrop-blur-sm ${
          isDark 
            ? 'bg-pink-500/15 border border-pink-400/25' 
            : 'bg-rose-500/15 border border-rose-300/40 shadow-rose-200/30'
        }`}
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Subtle Micro-Grid Texture */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isDark ? 'opacity-[0.025]' : 'opacity-[0.04]'
        }`} 
        style={{
          backgroundImage: `radial-gradient(${isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.6)'} 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};
