import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const AnimatedBackground: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div 
      className="liquid-bg-container fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none transition-colors duration-700"
      aria-hidden="true"
    >
      {/* 
        1. Base Optical Canvas Gradient 
        - Dark: Cosmic deep midnight obsidian (#060913 to #091122 to #050810)
        - Light: Silky crystalline pearl canvas (#F8FAFD to #EEF4FB to #F4F8FD)
      */}
      <div 
        className={`absolute inset-0 transition-colors duration-700 ${
          isDark 
            ? 'bg-gradient-to-b from-[#0D1B2A] via-[#091524] via-45% to-[#070F1A]' 
            : 'bg-gradient-to-b from-[#F8FAFD] via-[#EEF4FB] via-45% to-[#F4F8FD]'
        }`} 
      />

      {/* 
        2. Liquid Glass Prismatic Horizon Sheen (Top Viewport Rim)
        Mimics sunlight passing through the curved upper lip of optical liquid glass
      */}
      <div 
        className="absolute top-0 inset-x-0 h-[480px] pointer-events-none transition-opacity duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(130% 100% at 50% -10%, rgba(46, 134, 235, 0.24) 0%, rgba(34, 197, 94, 0.08) 35%, rgba(255, 45, 155, 0.04) 60%, transparent 80%)'
            : 'radial-gradient(130% 100% at 50% -10%, rgba(255, 255, 255, 0.95) 0%, rgba(46, 134, 235, 0.12) 35%, rgba(34, 197, 94, 0.06) 60%, transparent 80%)'
        }}
      />

      {/* 
        3. Floating Liquid Glass Caustic Orbs (Brand 5-Color Spectrum)
        Slowly drift & breathe with GPU transform3d, continuously refracting light under glass cards
      */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        {/* Orb 1: Electric Blue (#2E86EB) - Primary Hero & Header Caustic Focus */}
        <div 
          className="liquid-orb absolute -top-24 -right-20 md:-top-32 md:-right-24 w-[380px] h-[380px] sm:w-[540px] sm:h-[540px] lg:w-[720px] lg:h-[720px] rounded-full blur-[90px] sm:blur-[120px] lg:blur-[140px] opacity-75 dark:opacity-60 animate-liquid-orb-1"
          style={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(46, 134, 235, 0.45) 0%, rgba(46, 134, 235, 0.15) 50%, transparent 75%)' 
              : 'radial-gradient(circle, rgba(46, 134, 235, 0.25) 0%, rgba(74, 156, 255, 0.12) 50%, transparent 75%)'
          }}
        />

        {/* Orb 2: Vivid Emerald Green (#22C55E) - Mid-Left Health & Services Aurora */}
        <div 
          className="liquid-orb absolute top-[28%] -left-24 sm:-left-32 md:-left-40 w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] lg:w-[660px] lg:h-[660px] rounded-full blur-[85px] sm:blur-[115px] lg:blur-[135px] opacity-70 dark:opacity-50 animate-liquid-orb-2"
          style={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(34, 197, 94, 0.38) 0%, rgba(34, 197, 94, 0.12) 50%, transparent 75%)' 
              : 'radial-gradient(circle, rgba(34, 197, 94, 0.22) 0%, rgba(74, 222, 128, 0.10) 50%, transparent 75%)'
          }}
        />

        {/* Orb 3: Warm Saffron Gold (#FFD23F) - Mid-Right Warmth & Depth */}
        <div 
          className="liquid-orb absolute top-[52%] -right-16 sm:-right-24 md:-right-32 w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] lg:w-[580px] lg:h-[580px] rounded-full blur-[80px] sm:blur-[110px] lg:blur-[130px] opacity-65 dark:opacity-45 animate-liquid-orb-3"
          style={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(255, 210, 63, 0.35) 0%, rgba(255, 210, 63, 0.10) 50%, transparent 75%)' 
              : 'radial-gradient(circle, rgba(255, 210, 63, 0.22) 0%, rgba(254, 240, 138, 0.12) 50%, transparent 75%)'
          }}
        />

        {/* Orb 4: Neon Magenta Flare (#FF2D9B) - Lower Left Prismatic Energy */}
        <div 
          className="liquid-orb absolute top-[75%] -left-16 sm:-left-24 md:-left-28 w-[350px] h-[350px] sm:w-[480px] sm:h-[480px] lg:w-[620px] lg:h-[620px] rounded-full blur-[85px] sm:blur-[120px] lg:blur-[140px] opacity-60 dark:opacity-40 animate-liquid-orb-4"
          style={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(255, 45, 155, 0.35) 0%, rgba(255, 45, 155, 0.10) 50%, transparent 75%)' 
              : 'radial-gradient(circle, rgba(255, 45, 155, 0.18) 0%, rgba(244, 114, 182, 0.08) 50%, transparent 75%)'
          }}
        />

        {/* Orb 5: High-Contrast Chartreuse / Lime (#D9F14A) - Center Dynamic Dispersion */}
        <div 
          className="liquid-orb absolute top-[40%] left-[25%] sm:left-[35%] w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] lg:w-[500px] lg:h-[500px] rounded-full blur-[80px] sm:blur-[110px] lg:blur-[130px] opacity-45 dark:opacity-30 animate-caustic-shimmer"
          style={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(217, 241, 74, 0.25) 0%, rgba(217, 241, 74, 0.06) 50%, transparent 75%)' 
              : 'radial-gradient(circle, rgba(217, 241, 74, 0.16) 0%, rgba(234, 252, 110, 0.06) 50%, transparent 75%)'
          }}
        />

      </div>

      {/* 
        4. Liquid Glass Caustic Wave Ripple Overlay
        Produces subtle rippling caustic lines reminiscent of light refracting through fluid
      */}
      <div 
        className="absolute inset-0 opacity-40 dark:opacity-25 pointer-events-none animate-prism-drift"
        style={{
          backgroundImage: isDark
            ? `
              radial-gradient(ellipse 90% 40% at 50% 20%, rgba(46, 134, 235, 0.16) 0%, transparent 60%),
              radial-gradient(ellipse 70% 35% at 75% 65%, rgba(255, 210, 63, 0.12) 0%, transparent 55%),
              radial-gradient(ellipse 80% 40% at 20% 85%, rgba(34, 197, 94, 0.12) 0%, transparent 60%)
            `
            : `
              radial-gradient(ellipse 90% 40% at 50% 20%, rgba(46, 134, 235, 0.12) 0%, transparent 60%),
              radial-gradient(ellipse 70% 35% at 75% 65%, rgba(255, 210, 63, 0.10) 0%, transparent 55%),
              radial-gradient(ellipse 80% 40% at 20% 85%, rgba(34, 197, 94, 0.08) 0%, transparent 60%)
            `
        }}
      />

      {/* 
        5. Crystalline Frosted Optical Noise Texture
        Gives real physical frosted glass substance, eliminating digital color banding
      */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* 
        6. Delicate Micro-Glass Lattice Grid
        A refined 32px by 32px optical dot matrix providing subtle architectural depth
      */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          isDark ? 'opacity-[0.03]' : 'opacity-[0.035]'
        }`} 
        style={{
          backgroundImage: `radial-gradient(${isDark ? 'rgba(74, 156, 255, 0.6)' : 'rgba(46, 134, 235, 0.5)'} 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* 
        7. Ambient Bottom Viewport Vignette
        Smoothly anchors the footer into the optical canvas
      */}
      <div 
        className={`absolute bottom-0 inset-x-0 h-48 pointer-events-none transition-opacity duration-700 ${
          isDark 
            ? 'bg-gradient-to-t from-[#0D1B2A] to-transparent opacity-80' 
            : 'bg-gradient-to-t from-[#F4F8FD] to-transparent opacity-60'
        }`}
      />
    </div>
  );
};

