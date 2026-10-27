import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  getStoredLogoSettings, 
  SiteLogoSettings, 
  DEFAULT_LOGO_SETTINGS 
} from '../data/siteCustomizer';
import { getResolvedImageUrl, getPersistentImage } from '../utils/persistentImageStore';

export interface RabaLogoProps {
  className?: string;
  isLight?: boolean;
  variant?: 'horizontal' | 'vertical' | 'icon-only' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  showText?: boolean;
  overrideSettings?: Partial<SiteLogoSettings>;
  forceLanguage?: 'ar' | 'en';
}

export const RabaLogo: React.FC<RabaLogoProps> = ({ 
  className = '', 
  isLight: propIsLight,
  variant = 'horizontal',
  size = 'md',
  showSubtitle = true,
  showText: propShowText,
  overrideSettings,
  forceLanguage
}) => {
  // 1. Language Context
  let isArabic = true;
  try {
    const langContext = useLanguage();
    isArabic = forceLanguage ? forceLanguage === 'ar' : langContext.isArabic;
  } catch {
    isArabic = forceLanguage ? forceLanguage === 'ar' : true;
  }

  // 2. Theme Context
  let isDarkMode = true;
  try {
    const themeContext = useTheme();
    isDarkMode = propIsLight !== undefined ? !propIsLight : themeContext.theme === 'dark';
  } catch {
    isDarkMode = propIsLight !== undefined ? !propIsLight : true;
  }

  // 3. Stored Logo Settings + Live Listener
  const [storedSettings, setStoredSettings] = useState<SiteLogoSettings>(() => getStoredLogoSettings());

  useEffect(() => {
    const handleUpdate = (e?: any) => {
      if (e?.type === 'raba_logo_updated' && e?.detail && !('timestamp' in e.detail) && (e.detail.logoSource || e.detail.customLogoUrl)) {
        setStoredSettings(e.detail);
      } else {
        setStoredSettings(getStoredLogoSettings());
      }
    };
    window.addEventListener('raba_logo_updated' as any, handleUpdate);
    window.addEventListener('raba_persistent_sync_ready' as any, handleUpdate);
    return () => {
      window.removeEventListener('raba_logo_updated' as any, handleUpdate);
      window.removeEventListener('raba_persistent_sync_ready' as any, handleUpdate);
    };
  }, []);

  // Merge stored with overrides (e.g. for real-time live preview in Admin Customizer)
  const currentSettings: SiteLogoSettings = {
    ...storedSettings,
    ...(overrideSettings || {})
  };

  // Scale factor based on preset size prop
  const scale = size === 'sm' ? 0.82 : size === 'lg' ? 1.45 : size === 'xl' ? 1.9 : 1.0;
  const iconPx = Math.round((currentSettings.iconSizePx || 44) * scale);
  const gapPx = Math.round((currentSettings.spacingPx || 10) * (size === 'sm' ? 0.75 : 1.0));
  const titleSizePx = Math.round((currentSettings.titleFontSizePx || 18) * scale);
  const subtitleSizePx = Math.round((currentSettings.subtitleFontSizePx || 10) * scale);

  // Border radius class for custom image logo
  const roundingClassMap = {
    none: 'rounded-none',
    sm: 'rounded-md',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full'
  };
  const iconRoundingClass = roundingClassMap[currentSettings.iconRounding] || 'rounded-xl';

  // SVG Cut strokes
  const cutStroke = isDarkMode ? '#05070B' : '#ffffff';
  const cutStrokeWidth = 4.2;

  // Vector Brain Puzzle Emblem SVG
  const BrainPuzzleSvg = (
    <div 
      style={{ width: `${iconPx}px`, height: `${iconPx}px` }} 
      className="relative shrink-0 transition-transform duration-300 group-hover:scale-105 select-none flex items-center justify-center"
    >
      <svg 
        viewBox="65 40 282 330" 
        className="w-full h-full drop-shadow-xs overflow-visible"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 1. TOP-LEFT PIECE: Vibrant Electric Blue (#2E86EB) */}
        <path 
          d="
            M 200 45 
            C 152 44, 114 62, 88 98 
            C 72 118, 68 138, 72 156 
            C 76 172, 90 182, 106 182 
            C 118 182, 126 174, 134 168
            C 142 162, 154 164, 160 174
            C 166 184, 160 196, 150 200
            L 142 202
            C 152 216, 172 220, 186 214
            C 192 208, 194 198, 190 188
            C 186 178, 192 168, 204 168
            C 216 168, 224 178, 222 190
            L 220 206
            L 218 126
            C 218 114, 224 104, 236 104
            C 248 104, 254 114, 254 126
            C 254 138, 246 148, 234 148
            L 204 148
            L 200 45 Z
          "
          fill="#2E86EB"
          stroke={cutStroke}
          strokeWidth={cutStrokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <g stroke="#1D6BC4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 108 112 C 124 102, 148 106, 162 120" />
          <path d="M 132 82 C 150 74, 174 76, 188 88" />
        </g>

        {/* 2. TOP-RIGHT PIECE: Sunburst Gold (#FFD23F) */}
        <path 
          d="
            M 200 45
            L 204 148
            L 234 148
            C 246 148, 254 138, 254 126
            C 254 114, 248 104, 236 104
            C 224 104, 218 114, 218 126
            L 220 206
            L 242 206
            C 244 194, 254 184, 268 184
            C 282 184, 290 196, 288 210
            C 286 224, 274 232, 260 230
            L 250 230
            C 264 246, 286 250, 308 244
            C 328 234, 338 216, 334 194
            C 342 180, 344 160, 338 140
            C 330 110, 310 82, 280 64
            C 256 50, 228 44, 200 45 Z
          "
          fill="#FFD23F"
          stroke={cutStroke}
          strokeWidth={cutStrokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <g stroke="#D9A814" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 234 82 C 254 74, 282 78, 298 94" />
          <path d="M 248 118 C 274 110, 304 116, 318 134" />
          <path d="M 272 156 C 292 152, 314 162, 322 178" />
        </g>

        {/* 3. MIDDLE-LEFT PIECE: Fresh Emerald Green (#22C55E) */}
        <path 
          d="
            M 72 156
            C 68 174, 70 196, 78 214
            C 90 240, 114 260, 142 268
            C 156 272, 170 270, 180 262
            L 176 250
            C 168 250, 158 244, 156 234
            C 154 224, 162 214, 172 212
            C 182 210, 192 216, 194 226
            L 194 246
            C 202 242, 210 234, 214 224
            L 220 206
            L 186 214
            C 172 220, 152 216, 142 202
            L 150 200
            C 160 196, 166 184, 160 174
            C 154 164, 142 162, 134 168
            C 126 174, 118 182, 106 182
            C 90 182, 76 172, 72 156 Z
          "
          fill="#22C55E"
          stroke={cutStroke}
          strokeWidth={cutStrokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <g stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 96 196 C 114 188, 134 192, 146 206" />
          <path d="M 106 230 C 124 224, 144 232, 152 246" />
        </g>

        {/* 4. CENTER & LOWER-RIGHT PIECE: Vibrant Neon Magenta (#FF2D9B) */}
        <path 
          d="
            M 220 206
            L 242 206
            C 244 194, 254 184, 268 184
            C 282 184, 290 196, 288 210
            C 286 224, 274 232, 260 230
            L 250 230
            C 264 246, 286 250, 308 244
            C 316 260, 310 280, 294 294
            C 278 308, 254 314, 234 308
            C 220 304, 210 294, 204 282
            L 194 282
            C 190 292, 180 298, 168 296
            C 158 294, 150 284, 152 274
            C 154 264, 164 258, 174 260
            L 180 262
            L 194 246
            C 202 242, 210 234, 214 224
            L 220 206 Z
          "
          fill="#FF2D9B"
          stroke={cutStroke}
          strokeWidth={cutStrokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <g stroke="#BE126E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 238 238 C 262 232, 286 242, 294 262" />
          <path d="M 226 270 C 248 266, 270 274, 278 290" />
        </g>

        {/* 5. BOTTOM STEM PIECE: High-Contrast Chartreuse / Lime (#D9F14A) */}
        <path 
          d="
            M 176 250
            C 168 250, 158 244, 156 234
            C 154 224, 162 214, 172 212
            C 182 210, 192 216, 194 226
            L 194 282
            C 190 292, 180 298, 168 296
            C 158 294, 150 284, 152 274
            C 154 264, 164 258, 174 260
            L 180 262
            C 180 284, 174 308, 166 326
            C 160 338, 152 344, 144 340
            C 136 336, 138 322, 142 312
            C 146 302, 142 292, 134 288
            C 126 284, 116 290, 114 300
            C 112 314, 122 328, 136 338
            C 142 344, 140 354, 132 360
            C 124 366, 112 364, 108 354
            C 100 334, 106 312, 118 292
            C 128 276, 142 268, 156 268
            L 176 250 Z
          "
          fill="#D9F14A"
          stroke={cutStroke}
          strokeWidth={cutStrokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <g stroke="#A3BD12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 148 296 C 158 308, 158 326, 152 340" />
        </g>
      </svg>
    </div>
  );

  // Fallback image state
  const [imageError, setImageError] = useState(false);

  // Reset imageError if customLogoUrl changes
  useEffect(() => {
    setImageError(false);
  }, [currentSettings.customLogoUrl, currentSettings.logoSource]);

  // Selected Emblem element (Vector SVG or Custom Image)
  const EmblemElement = (
    currentSettings.logoSource === 'custom' && currentSettings.customLogoUrl && !imageError ? (
      <div 
        style={{ 
          height: `${iconPx}px`, 
          minWidth: `${iconPx}px`,
          maxWidth: `${Math.round(iconPx * 3.5)}px` 
        }} 
        className={`relative shrink-0 transition-transform duration-300 group-hover:scale-105 select-none flex items-center justify-center overflow-hidden ${iconRoundingClass} shadow-xs`}
      >
        <img
          src={getResolvedImageUrl(currentSettings.customLogoUrl)}
          alt={isArabic ? currentSettings.titleAr : currentSettings.titleEn}
          width={iconPx}
          height={iconPx}
          decoding="async"
          style={{ maxHeight: `${iconPx}px`, width: 'auto', height: 'auto' }}
          className={`max-h-full max-w-full object-${currentSettings.iconObjectFit || 'contain'}`}
          onError={async (e) => {
            try {
              const cached = await getPersistentImage(currentSettings.customLogoUrl);
              if (cached && (e.target as HTMLImageElement).src !== cached) {
                (e.target as HTMLImageElement).src = cached;
                return;
              }
            } catch { /* ignore */ }
            setImageError(true);
          }}
        />
      </div>
    ) : (
      BrainPuzzleSvg
    )
  );

  // Check if text beside logo should be shown
  const shouldShowText = propShowText !== undefined 
    ? propShowText 
    : (variant !== 'icon-only' && Boolean(currentSettings.showText));

  if (!shouldShowText) {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        {EmblemElement}
      </div>
    );
  }

  // English letters badge (Colored if RABA, or styled pill if custom)
  const renderEnglishBadge = () => {
    const enText = currentSettings.titleEn || 'RABA';
    if (enText.trim().toUpperCase() === 'RABA') {
      return (
        <div className="flex items-center gap-0.5 sm:gap-1 font-sans font-bold select-none text-[11px] sm:text-[13px] tracking-[0.24em] leading-none" dir="ltr">
          <span className="text-[#2E86EB]">R</span>
          <span className="text-[#FFD23F]">A</span>
          <span className="text-[#22C55E]">B</span>
          <span className="text-[#FF2D9B]">A</span>
        </div>
      );
    }
    return (
      <span 
        className="font-sans font-bold select-none text-[10px] sm:text-[11px] tracking-wider px-1.5 py-0.5 rounded-md bg-[#2E86EB]/10 text-[#2E86EB] border border-[#2E86EB]/20 leading-none" 
        dir="ltr"
      >
        {enText}
      </span>
    );
  };

  // Primary Title Component (Arabic or English according to active language)
  const mainTitleText = isArabic 
    ? (currentSettings.titleAr || 'مركز رابا') 
    : (currentSettings.titleEn || 'RABA');

  const mainTitleColorStyle = currentSettings.titleColor 
    ? { color: currentSettings.titleColor, fontSize: `${titleSizePx}px` } 
    : { fontSize: `${titleSizePx}px` };

  const MainTitleElement = (
    <span 
      style={mainTitleColorStyle}
      className={`font-black select-none tracking-tight leading-none drop-shadow-2xs ${
        !currentSettings.titleColor ? 'text-[#2E86EB] dark:text-white' : ''
      }`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {mainTitleText}
    </span>
  );

  // Subtitle Component
  const subtitleText = isArabic 
    ? (currentSettings.subtitleAr || 'للعلاج بتحليل السلوك التطبيقي') 
    : (currentSettings.subtitleEn || 'Center for Day Care & Rehabilitation');

  const SubtitleElement = (
    <span 
      style={{ fontSize: `${subtitleSizePx}px` }}
      className={`font-semibold select-none ${
        isDarkMode ? 'text-slate-300' : 'text-slate-600'
      } tracking-tight leading-tight block whitespace-nowrap`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {subtitleText}
    </span>
  );

  // Secondary badge beside main title
  const SecondaryBadge = isArabic ? (
    currentSettings.showEnglishBadge ? renderEnglishBadge() : null
  ) : (
    currentSettings.showEnglishBadge && currentSettings.titleAr ? (
      <span 
        className="font-bold select-none text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-md bg-pink-500/10 text-[#E5007D] dark:text-[#FB7185] border border-pink-500/20 leading-none font-sans"
        dir="rtl"
      >
        {currentSettings.titleAr}
      </span>
    ) : null
  );

  // ----------------------------------------------------
  // VARIANT: Vertical
  // ----------------------------------------------------
  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {EmblemElement}
        <div className="flex flex-col items-center mt-2.5 sm:mt-3.5 w-full gap-1 sm:gap-1.5">
          {SecondaryBadge && (
            <div className="flex justify-center w-full">
              {SecondaryBadge}
            </div>
          )}
          <div className="mt-0.5">
            {MainTitleElement}
          </div>
          {showSubtitle && currentSettings.showSubtitle && (
            <div className="mt-0.5">
              {SubtitleElement}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VARIANT: Horizontal (Standard in Navbar & Footers)
  // ----------------------------------------------------
  return (
    <div 
      style={{ gap: `${gapPx}px` }}
      className={`flex items-center select-none ${className}`} 
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {EmblemElement}
      <div className={`flex flex-col justify-center select-none ${isArabic ? 'text-right' : 'text-left'}`}>
        {/* Tier 1: Main Title + Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 leading-none">
          {MainTitleElement}
          {SecondaryBadge && (
            <div className="flex items-center">
              {SecondaryBadge}
            </div>
          )}
        </div>

        {/* Tier 2: Subtitle */}
        {showSubtitle && currentSettings.showSubtitle && (
          <div className="mt-1 sm:mt-1.5 leading-none hidden xs:block">
            {SubtitleElement}
          </div>
        )}
      </div>
    </div>
  );
};
