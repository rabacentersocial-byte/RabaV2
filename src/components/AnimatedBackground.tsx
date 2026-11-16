import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export const AnimatedBackground: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === 'undefined') return;

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    let rafId: number | null = null;

    const updateWaveTransforms = () => {
      rafId = null;
      const sy = window.scrollY || window.pageYOffset || 0;
      const vh = Math.max(1, window.innerHeight || 800);

      // Seamless C1-continuous vertical flow modulo 100vh + gentle horizontal sway
      const y1 = -((sy * 0.22) % vh);
      const x1 = Math.sin(sy * 0.0025) * 16;

      const y2 = -((sy * 0.34) % vh);
      const x2 = -Math.sin(sy * 0.0021) * 18;

      const y3 = -((sy * 0.14) % vh);
      const x3 = Math.sin(sy * 0.0018) * 14;

      el.style.setProperty('--raba-vwave-x1', `${x1.toFixed(2)}px`);
      el.style.setProperty('--raba-vwave-y1', `${y1.toFixed(2)}px`);
      el.style.setProperty('--raba-vwave-x2', `${x2.toFixed(2)}px`);
      el.style.setProperty('--raba-vwave-y2', `${y2.toFixed(2)}px`);
      el.style.setProperty('--raba-vwave-x3', `${x3.toFixed(2)}px`);
      el.style.setProperty('--raba-vwave-y3', `${y3.toFixed(2)}px`);
    };

    const handleScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateWaveTransforms);
      }
    };

    updateWaveTransforms();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const mist1PrimaryOpacity = isDark ? 0.16 : 0.14;
  const mist1SecondaryOpacity = isDark ? 0.12 : 0.10;

  const mist2PrimaryOpacity = isDark ? 0.15 : 0.12;
  const mist2SecondaryOpacity = isDark ? 0.12 : 0.10;

  const mist3PrimaryOpacity = isDark ? 0.11 : 0.10;
  const mist3SecondaryOpacity = isDark ? 0.11 : 0.09;

  return (
    <div
      ref={containerRef}
      className={`liquid-bg-container fixed inset-0 pointer-events-none overflow-hidden z-0 select-none ${
        isDark ? 'bg-[#0B0F17]' : 'bg-[#F5F2EC]'
      }`}
      aria-hidden="true"
    >
      {/* Vertical Mist Wave 1: Right / Sky-Blue & Violet sequential stream */}
      <div
        className="raba-wave-layer absolute inset-x-[-6%] top-0 h-[200vh]"
        style={{
          transform: 'translate3d(var(--raba-vwave-x1, 0px), var(--raba-vwave-y1, 0px), 0)',
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 1440 1600"
          preserveAspectRatio="none"
          className="w-full h-full block overflow-visible"
          style={{ filter: 'blur(28px)' }}
          fill="none"
        >
          <path
            d="M1080,0 C1190,200 970,600 1080,800 C1190,1000 970,1400 1080,1600"
            stroke="#2B95FF"
            strokeWidth="44"
            strokeOpacity={mist1PrimaryOpacity}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M1155,0 C1255,200 1055,600 1155,800 C1255,1000 1055,1400 1155,1600"
            stroke="#8B5CF6"
            strokeWidth="30"
            strokeOpacity={mist1SecondaryOpacity}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Vertical Mist Wave 2: Left / Emerald & Sky-Blue sequential stream */}
      <div
        className="raba-wave-layer absolute inset-x-[-6%] top-0 h-[200vh]"
        style={{
          transform: 'translate3d(var(--raba-vwave-x2, 0px), var(--raba-vwave-y2, 0px), 0)',
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 1440 1600"
          preserveAspectRatio="none"
          className="w-full h-full block overflow-visible"
          style={{ filter: 'blur(30px)' }}
          fill="none"
        >
          <path
            d="M390,0 C280,200 500,600 390,800 C280,1000 500,1400 390,1600"
            stroke="#10B981"
            strokeWidth="42"
            strokeOpacity={mist2PrimaryOpacity}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M315,0 C215,200 415,600 315,800 C215,1000 415,1400 315,1600"
            stroke="#2B95FF"
            strokeWidth="28"
            strokeOpacity={mist2SecondaryOpacity}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Vertical Mist Wave 3: Center / Warm Gold & Violet sequential stream */}
      <div
        className="raba-wave-layer absolute inset-x-[-6%] top-0 h-[200vh]"
        style={{
          transform: 'translate3d(var(--raba-vwave-x3, 0px), var(--raba-vwave-y3, 0px), 0)',
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 1440 1600"
          preserveAspectRatio="none"
          className="w-full h-full block overflow-visible"
          style={{ filter: 'blur(32px)' }}
          fill="none"
        >
          <path
            d="M735,0 C825,200 645,600 735,800 C825,1000 645,1400 735,1600"
            stroke="#F59E0B"
            strokeWidth="36"
            strokeOpacity={mist3PrimaryOpacity}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M680,0 C760,200 600,600 680,800 C760,1000 600,1400 680,1600"
            stroke="#8B5CF6"
            strokeWidth="26"
            strokeOpacity={mist3SecondaryOpacity}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
};
