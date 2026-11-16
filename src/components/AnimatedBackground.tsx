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
      {/* 1. Base Warm Canvas Background (#F5F2EC Light / #0B0F17 Dark) */}
      <div 
        className={`absolute inset-0 transition-colors duration-700 ${
          isDark 
            ? 'bg-[#0B0F17]' 
            : 'bg-[#F5F2EC]'
        }`} 
      />

      {/* 2. Top Diffused Horizon Glow */}
      <div 
        className="absolute top-0 inset-x-0 h-[520px] pointer-events-none transition-opacity duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(120% 90% at 50% -10%, rgba(43, 149, 255, 0.14) 0%, rgba(16, 185, 129, 0.06) 45%, transparent 80%)'
            : 'radial-gradient(120% 90% at 50% -10%, rgba(255, 255, 255, 0.72) 0%, rgba(43, 149, 255, 0.09) 42%, rgba(237, 233, 224, 0.35) 68%, transparent 85%)'
        }}
      />

      {/* 3. Ambient Decorative Diffused Glows (Raba Harmonized Spectrum) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        {/* Orb 1: Raba Sky Blue (#2B95FF) */}
        <div 
          className="liquid-orb absolute -top-24 -right-20 md:-top-32 md:-right-24 w-[420px] h-[420px] sm:w-[580px] sm:h-[580px] lg:w-[760px] lg:h-[760px] rounded-full blur-[90px] sm:blur-[120px] lg:blur-[140px] opacity-90 animate-liquid-orb-1"
          style={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(43, 149, 255, 0.16) 0%, rgba(43, 149, 255, 0) 70%)' 
              : 'radial-gradient(circle, rgba(43, 149, 255, 0.18) 0%, rgba(43, 149, 255, 0) 70%)'
          }}
        />

        {/* Orb 2: Raba Warm Gold / Sand (#F59E0B / #EDE9E0) */}
        <div 
          className="liquid-orb absolute top-[26%] -left-24 sm:-left-32 md:-left-40 w-[400px] h-[400px] sm:w-[560px] sm:h-[560px] lg:w-[720px] lg:h-[720px] rounded-full blur-[90px] sm:blur-[120px] lg:blur-[140px] opacity-90 animate-liquid-orb-2"
          style={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(139, 92, 246, 0.13) 0%, rgba(139, 92, 246, 0) 70%)' 
              : 'radial-gradient(circle, rgba(245, 158, 11, 0.14) 0%, rgba(245, 158, 11, 0) 70%)'
          }}
        />

        {/* Orb 3: Raba Emerald Green (#10B981) */}
        <div 
          className="liquid-orb absolute top-[54%] -right-16 sm:-right-24 md:-right-32 w-[380px] h-[380px] sm:w-[520px] sm:h-[520px] lg:w-[660px] lg:h-[660px] rounded-full blur-[90px] sm:blur-[115px] lg:blur-[135px] opacity-85 animate-liquid-orb-3"
          style={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(16, 185, 129, 0.13) 0%, rgba(16, 185, 129, 0) 70%)' 
              : 'radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, rgba(16, 185, 129, 0) 70%)'
          }}
        />

        {/* Orb 4: Raba Vibrant Violet (#8B5CF6) */}
        <div 
          className="liquid-orb absolute top-[76%] -left-16 sm:-left-24 md:-left-28 w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] lg:w-[640px] lg:h-[640px] rounded-full blur-[90px] sm:blur-[120px] lg:blur-[140px] opacity-85 animate-liquid-orb-4"
          style={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(245, 158, 11, 0.10) 0%, rgba(245, 158, 11, 0) 70%)' 
              : 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0) 70%)'
          }}
        />

      </div>

      {/* 4. Subtle Tactile Organic Grain */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.025] dark:opacity-[0.04] mix-blend-overlay hidden md:block"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* 5. Ambient Bottom Vignette */}
      <div 
        className={`absolute bottom-0 inset-x-0 h-48 pointer-events-none transition-opacity duration-700 ${
          isDark 
            ? 'bg-gradient-to-t from-[#0B0F17] to-transparent opacity-80' 
            : 'bg-gradient-to-t from-[#F5F2EC] to-transparent opacity-70'
        }`}
      />
    </div>
  );
};
