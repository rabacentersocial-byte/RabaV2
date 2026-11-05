import React, { useState, useEffect } from 'react';
import { BUNDLED_PARTNER_LOGOS } from '../data/partnerLogosBundle';
import { getResolvedImageUrl } from '../utils/persistentImageStore';

export const PartnerLogoRenderer: React.FC<{
  partnerId?: string;
  logoUrl?: string;
  name: string;
  accentColor?: string;
  letter?: string;
  imageFit?: 'contain' | 'cover' | 'fill';
  imagePadding?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  logoScale?: number;
  expandImageToEdges?: boolean;
  className?: string;
}> = ({
  partnerId,
  logoUrl,
  name,
  accentColor = '#0D6D54',
  letter,
  imageFit = 'contain',
  imagePadding = 'md',
  logoScale = 1,
  expandImageToEdges = false,
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);

  // Reset error state when logoUrl or partnerId changes
  useEffect(() => {
    setHasError(false);
  }, [logoUrl, partnerId]);

  // Priority 1: Check inlined bundled logo (embedded in core JS bundle for 100% incognito reliability)
  // Priority 2: In-memory / persistent store resolved image
  // Priority 3: Direct logoUrl
  const bundledSrc = partnerId ? BUNDLED_PARTNER_LOGOS[partnerId] : undefined;
  const effectiveSrc = (hasError && bundledSrc)
    ? bundledSrc
    : (bundledSrc || (logoUrl ? getResolvedImageUrl(logoUrl) : '') || logoUrl || '');

  // Fallback to stylized monogram circle ONLY if both external URL and bundled image are absent
  if ((hasError && !bundledSrc) || !effectiveSrc) {
    return (
      <div 
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-lg sm:text-xl text-white shadow-xs ring-2 ring-white/30 shrink-0"
        style={{ backgroundColor: accentColor }}
      >
        {letter || (name ? name.slice(0, 1) : 'ش')}
      </div>
    );
  }

  // Padding classes mapping (if expandImageToEdges is true, force p-0)
  const paddingClass = expandImageToEdges ? 'p-0' : ({
    none: 'p-0',
    xs: 'p-0.5',
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3.5'
  }[imagePadding] || 'p-2');

  // Normalize scale (e.g. 150 -> 1.5, or 1.5 -> 1.5)
  const normalizedScale = typeof logoScale === 'number' 
    ? (logoScale > 10 ? logoScale / 100 : logoScale)
    : 1;

  const fitClass = imageFit === 'cover' 
    ? 'w-full h-full object-cover rounded-lg' 
    : imageFit === 'fill'
      ? 'w-full h-full object-fill'
      : 'max-h-full max-w-full w-full h-full object-contain';

  return (
    <div className={`w-full h-full flex items-center justify-center select-none pointer-events-none overflow-hidden ${paddingClass} ${className}`}>
      <img
        src={effectiveSrc}
        alt={name}
        width={140}
        height={50}
        loading="lazy"
        decoding="async"
        style={{
          aspectRatio: '14 / 5',
          transform: normalizedScale !== 1 ? `scale(${normalizedScale})` : undefined,
          transformOrigin: 'center center',
          maxHeight: normalizedScale > 1.25 ? `${Math.min(Math.round(normalizedScale * 100), 160)}%` : '100%',
          maxWidth: normalizedScale > 1.25 ? `${Math.min(Math.round(normalizedScale * 100), 160)}%` : '100%'
        }}
        className={`${fitClass} mx-auto block transition-transform duration-300 group-hover:scale-105`}
        onError={() => {
          if (!hasError && bundledSrc && effectiveSrc !== bundledSrc) {
            setHasError(true);
          } else if (!bundledSrc) {
            setHasError(true);
          }
        }}
      />
    </div>
  );
};

export default PartnerLogoRenderer;
