import React, { useState, useEffect } from 'react';

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

  // Reset error state when logoUrl changes
  useEffect(() => {
    setHasError(false);
  }, [logoUrl]);

  // Fallback to stylized monogram circle if image fails or is missing
  if (hasError || !logoUrl) {
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
      : normalizedScale > 1.25
        ? 'w-auto h-auto object-contain'
        : 'max-h-full max-w-full h-auto w-auto object-contain';

  return (
    <div className={`w-full h-full flex items-center justify-center select-none pointer-events-none overflow-hidden ${paddingClass} ${className}`}>
      <img
        src={logoUrl}
        alt={name}
        style={{
          transform: normalizedScale !== 1 ? `scale(${normalizedScale})` : undefined,
          transformOrigin: 'center center',
          maxHeight: normalizedScale > 1.25 ? `${Math.min(Math.round(normalizedScale * 100), 220)}%` : undefined,
          maxWidth: normalizedScale > 1.25 ? `${Math.min(Math.round(normalizedScale * 100), 220)}%` : undefined
        }}
        className={`${fitClass} mx-auto block transition-transform duration-300 group-hover:scale-105`}
        loading="eager"
        decoding="async"
        onError={() => setHasError(true)}
      />
    </div>
  );
};

export default PartnerLogoRenderer;
