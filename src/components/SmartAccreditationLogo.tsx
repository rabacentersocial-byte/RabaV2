import React, { useState, useEffect } from 'react';
import { getResolvedImageUrl, handleImageErrorWithStore } from '../utils/persistentImageStore';

interface SmartAccreditationLogoProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackSvg?: React.ReactNode;
}

/**
 * SmartAccreditationLogo:
 * Intelligently analyzes uploaded logo images (via an offscreen canvas)
 * to detect their background tone (Dark / Light / Transparent) and seamlessly
 * eliminates harsh rectangular bounding boxes, ensuring luxury clinical presentation.
 */
export const SmartAccreditationLogo: React.FC<SmartAccreditationLogoProps> = ({
  src,
  alt,
  className = 'h-14 sm:h-16 w-auto max-w-[135px]',
  fallbackSvg
}) => {
  const [tone, setTone] = useState<'unknown' | 'dark' | 'light' | 'transparent'>('unknown');

  useEffect(() => {
    if (!src) {
      setTone('unknown');
      return;
    }

    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      if (!isMounted) return;

      try {
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(img.naturalWidth || 64, 120);
        canvas.height = Math.min(img.naturalHeight || 64, 120);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const w = canvas.width;
        const h = canvas.height;

        // Sample border pixels around the edges
        const samples = [
          ctx.getImageData(2, 2, 1, 1).data,
          ctx.getImageData(w - 3, 2, 1, 1).data,
          ctx.getImageData(2, h - 3, 1, 1).data,
          ctx.getImageData(w - 3, h - 3, 1, 1).data,
          ctx.getImageData(Math.floor(w / 2), 2, 1, 1).data,
          ctx.getImageData(Math.floor(w / 2), h - 3, 1, 1).data,
          ctx.getImageData(2, Math.floor(h / 2), 1, 1).data,
          ctx.getImageData(w - 3, Math.floor(h / 2), 1, 1).data,
        ];

        let totalBrightness = 0;
        let transparentCount = 0;

        samples.forEach(([r, g, b, a]) => {
          if (a < 35) {
            transparentCount++;
          } else {
            // Standard perceived luminance
            totalBrightness += (r * 0.299 + g * 0.587 + b * 0.114);
          }
        });

        if (transparentCount >= 4) {
          setTone('transparent');
        } else {
          const validSamples = samples.length - transparentCount;
          const avgBrightness = validSamples > 0 ? totalBrightness / validSamples : 255;
          
          if (avgBrightness < 60) {
            // Dark/Black background (e.g. BACB, QABA, ISO on black)
            setTone('dark');
          } else if (avgBrightness > 195) {
            // White or light-gray background (e.g. CHI/Daman with rectangular box)
            setTone('light');
          } else {
            setTone('transparent');
          }
        }
      } catch {
        setTone('unknown');
      }
    };

    return () => {
      isMounted = false;
    };
  }, [src]);

  // If no custom image provided, render the built-in Vector SVG
  if (!src) {
    return <div className="w-full h-full flex items-center justify-center">{fallbackSvg}</div>;
  }

  const effectiveSrc = getResolvedImageUrl(src);

  // Case 1: Dark / Black background (e.g., BACB, QABA, ISO black boxes)
  // Encapsulate into a sleek, executive dark-mode badge pod with smooth rounded corners
  // so the black background becomes an intentional, prestigious medallion rather than an ugly cutout
  if (tone === 'dark') {
    return (
      <div className="w-full h-full flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-[#161C2A] via-[#1C2436] to-[#0B0F17] border border-white/15 shadow-sm group-hover:shadow-md group-hover:border-[#2B95FF]/45 transition-all duration-300 relative overflow-hidden">
        <img
          src={effectiveSrc}
          alt={alt}
          width={120}
          height={60}
          style={{ aspectRatio: '2 / 1' }}
          onError={(e) => handleImageErrorWithStore(e, src)}
          className={`${className} object-contain rounded-xl transition-transform duration-300 group-hover:scale-105`}
          loading="lazy"
          decoding="async"
        />
        {/* Subtle metallic sheen accent */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent rounded-2xl pointer-events-none" />
      </div>
    );
  }

  // Case 2: Light / White / Gray background box (e.g., Daman with gray rectangle)
  // In light mode: use mix-blend-multiply so the off-white/gray bounding box dissolves completely into the card!
  // In dark mode: encapsulate in a clean, high-contrast white pod with rounded corners
  if (tone === 'light') {
    return (
      <div className="w-full h-full flex items-center justify-center p-2 rounded-2xl bg-white/95 dark:bg-slate-200/85 border border-white/80 dark:border-white/15 shadow-2xs group-hover:shadow-md transition-all duration-300">
        <img
          src={effectiveSrc}
          alt={alt}
          width={120}
          height={60}
          style={{ aspectRatio: '2 / 1' }}
          onError={(e) => handleImageErrorWithStore(e, src)}
          className={`${className} object-contain transition-transform duration-300 group-hover:scale-105 mix-blend-multiply`}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  // Case 3: Transparent or native image
  return (
    <div className="w-full h-full flex items-center justify-center p-1">
      <img
        src={effectiveSrc}
        alt={alt}
        width={120}
        height={60}
        style={{ aspectRatio: '2 / 1' }}
        onError={(e) => handleImageErrorWithStore(e, src)}
        className={`${className} object-contain transition-transform duration-300 group-hover:scale-105 filter dark:brightness-105`}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};
