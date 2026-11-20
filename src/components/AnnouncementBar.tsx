import React, { useState, useEffect, useMemo } from 'react';
import {
  Megaphone,
  Bell,
  Sparkles,
  CalendarCheck,
  Gift,
  Info,
  X,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import {
  AnnouncementBarSettings,
  AnnouncementIconName,
  DEFAULT_ANNOUNCEMENT_BAR_SETTINGS,
  DEFAULT_SOCIAL_SETTINGS,
  DEFAULT_THEME_SETTINGS,
  SiteThemeSettings
} from '../data/siteCustomizer';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useLiveDataOptional } from '../context/LiveDataContext';

interface AnnouncementBarProps {
  onOpenBooking?: () => void;
  onOpenOffersPage?: () => void;
  onOpenBranchesPage?: () => void;
  onOpenPortal?: () => void;
  onNavigate?: (path: string) => void;
  /** Optional override used for Admin Dashboard live preview */
  previewSettings?: AnnouncementBarSettings;
  isPreview?: boolean;
}

const DISMISS_STORAGE_KEY = 'raba_announcement_dismissed_sig';

function buildSignature(s: AnnouncementBarSettings): string {
  return `${s.messageAr}|${s.messageEn}|${s.badgeAr}|${s.updatedAt || ''}`;
}

export const renderAnnouncementIcon = (iconName: AnnouncementIconName, className = 'w-4 h-4') => {
  switch (iconName) {
    case 'bell':
      return <Bell className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'calendar':
      return <CalendarCheck className={className} />;
    case 'gift':
      return <Gift className={className} />;
    case 'info':
      return <Info className={className} />;
    case 'megaphone':
    default:
      return <Megaphone className={className} />;
  }
};

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  onOpenBooking,
  onOpenOffersPage,
  onOpenBranchesPage,
  onOpenPortal,
  onNavigate,
  previewSettings,
  isPreview = false
}) => {
  const { isArabic } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const live = useLiveDataOptional();

  const [dismissedSig, setDismissedSig] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return sessionStorage.getItem(DISMISS_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const settings = previewSettings || live?.announcementBar || DEFAULT_ANNOUNCEMENT_BAR_SETTINGS;
  const siteTheme: SiteThemeSettings = live?.siteTheme || DEFAULT_THEME_SETTINGS;
  const sig = useMemo(() => buildSignature(settings), [settings]);

  const message = isArabic
    ? (settings.messageAr || settings.messageEn || '').trim()
    : (settings.messageEn || settings.messageAr || '').trim();

  const badge = isArabic
    ? (settings.badgeAr || '').trim()
    : (settings.badgeEn || settings.badgeAr || '').trim();

  const ctaText = isArabic
    ? (settings.ctaTextAr || '').trim()
    : (settings.ctaTextEn || settings.ctaTextAr || '').trim();

  if (!isPreview && !previewSettings && live?.loadingSettings) {
    return null;
  }

  if (!isPreview && (!settings.enabled || !message)) {
    return null;
  }

  if (!isPreview && settings.dismissible && dismissedSig === sig) {
    return null;
  }

  const handleDismiss = () => {
    if (isPreview) return;
    setDismissedSig(sig);
    try {
      sessionStorage.setItem(DISMISS_STORAGE_KEY, sig);
    } catch {
      // ignore
    }
  };

  const handleCtaClick = () => {
    if (isPreview) return;
    switch (settings.ctaAction) {
      case 'booking':
        if (onOpenBooking) onOpenBooking();
        else if (onNavigate) onNavigate('/booking');
        break;
      case 'courses':
        if (onNavigate) onNavigate('/courses');
        break;
      case 'offers':
        if (onOpenOffersPage) onOpenOffersPage();
        else if (onNavigate) onNavigate('/offers-directory');
        break;
      case 'branches':
        if (onOpenBranchesPage) onOpenBranchesPage();
        else if (onNavigate) onNavigate('/branches');
        break;
      case 'portal':
        if (onOpenPortal) onOpenPortal();
        else if (onNavigate) onNavigate('/portal');
        break;
      case 'whatsapp': {
        const social = live?.social || DEFAULT_SOCIAL_SETTINGS;
        const waUrl = social.whatsapp || 'https://wa.me/966575100100';
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        break;
      }
      case 'custom_url': {
        const url = (settings.ctaUrl || '').trim();
        if (!url) break;
        if (url.startsWith('/') && onNavigate) {
          onNavigate(url);
        } else {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
        break;
      }
      default:
        break;
    }
  };

  const primaryHex = siteTheme.primaryColor || '#2E86EB';
  const primaryLightHex = siteTheme.primaryLight || '#4A9CFF';

  const variant = settings.styleVariant || 'theme_glass';

  const containerStyle: React.CSSProperties | undefined =
    variant === 'primary_gradient'
      ? {
          backgroundImage: `linear-gradient(90deg, ${primaryHex}, ${primaryLightHex}, ${primaryHex})`
        }
      : variant === 'theme_glass'
        ? {
            backgroundImage: isDark
              ? `linear-gradient(90deg, color-mix(in srgb, ${primaryHex} 16%, rgba(16, 22, 34, 0.92)), rgba(22, 28, 42, 0.88), color-mix(in srgb, ${primaryHex} 12%, rgba(16, 22, 34, 0.92)))`
              : `linear-gradient(90deg, color-mix(in srgb, ${primaryHex} 10%, rgba(255, 255, 255, 0.86)), rgba(255, 255, 255, 0.82), color-mix(in srgb, ${primaryHex} 8%, rgba(255, 255, 255, 0.86)))`
          }
        : undefined;

  const containerClasses =
    variant === 'primary_gradient'
      ? 'text-white border-b border-white/20 shadow-[0_8px_24px_-12px_rgba(20,99,214,0.45)]'
      : variant === 'emerald_clinical'
        ? 'bg-gradient-to-r from-[#0B3B36] via-[#0E5246] to-[#0B3B36] text-white border-b border-emerald-400/25 shadow-sm'
        : variant === 'obsidian_gold'
          ? 'bg-gradient-to-r from-[#141821] via-[#1C2333] to-[#141821] text-[#F8FAFC] border-b border-[#F59E0B]/30 shadow-sm'
          : isDark
            ? 'backdrop-blur-xl text-[#F8FAFC] border-b border-white/[0.08] shadow-[0_10px_28px_-14px_rgba(0,0,0,0.6)]'
            : 'backdrop-blur-xl text-[#161B26] border-b border-[#161B26]/[0.08] shadow-[0_10px_28px_-14px_rgba(22,27,38,0.12)]';

  const isLightThemeGlass = variant === 'theme_glass' && !isDark;

  const showCtaButton = settings.ctaAction !== 'none' && Boolean(ctaText);
  const DirectionArrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <div
      role="region"
      aria-label={isArabic ? 'شريط الإشعارات والتنبيهات' : 'Announcement Bar'}
      dir={isArabic ? 'rtl' : 'ltr'}
      style={containerStyle}
      className={`relative z-30 w-full transition-colors duration-300 ${containerClasses} ${
        isPreview ? 'rounded-2xl border overflow-hidden' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2.5 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 justify-center sm:justify-start">
          {/* Icon Pill */}
          <span
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border ${
              variant === 'obsidian_gold'
                ? 'bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/35'
                : isLightThemeGlass
                  ? 'bg-[#2B95FF]/12 text-[#1263D6] border-[#2B95FF]/25'
                  : variant === 'theme_glass'
                    ? 'bg-[#2B95FF]/20 text-[#60AFFF] border-[#2B95FF]/35'
                    : 'bg-white/15 text-white border-white/25'
            }`}
          >
            {renderAnnouncementIcon(settings.iconName, 'w-3.5 h-3.5 sm:w-4 sm:h-4')}
          </span>

          {/* Highlight Badge */}
          {badge && (
            <span
              className={`hidden xs:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black shrink-0 border ${
                variant === 'obsidian_gold'
                  ? 'bg-[#F59E0B] text-slate-950 border-transparent'
                  : isLightThemeGlass
                    ? 'bg-[#1463D6] text-white border-transparent'
                    : variant === 'theme_glass'
                      ? 'bg-[#2B95FF] text-white border-transparent'
                      : 'bg-white/20 text-white border-white/30'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span>{badge}</span>
            </span>
          )}

          {/* Main Notification Text */}
          <p className="text-[11.5px] sm:text-xs font-bold leading-snug line-clamp-2 sm:line-clamp-1">
            {message}
          </p>
        </div>

        {/* Action & Dismiss Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {showCtaButton && (
            <button
              type="button"
              onClick={handleCtaClick}
              className={`px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-black flex items-center gap-1 transition-all cursor-pointer active:scale-95 whitespace-nowrap shadow-xs ${
                variant === 'obsidian_gold'
                  ? 'bg-[#F59E0B] hover:bg-[#FBBF24] text-slate-950'
                  : isLightThemeGlass
                    ? 'bg-[#1463D6] hover:bg-[#1152B8] text-white'
                    : variant === 'theme_glass'
                      ? 'bg-[#2B95FF] hover:bg-[#4A9CFF] text-white'
                      : 'bg-white hover:bg-white/90 text-slate-900'
              }`}
            >
              <span>{ctaText}</span>
              <DirectionArrow className="w-3 h-3 shrink-0" />
            </button>
          )}

          {settings.dismissible && (
            <button
              type="button"
              onClick={handleDismiss}
              aria-label={isArabic ? 'إغلاق شريط الإشعارات' : 'Dismiss notification bar'}
              title={isArabic ? 'إغلاق' : 'Dismiss'}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                isLightThemeGlass
                  ? 'hover:bg-slate-900/10 text-slate-600 hover:text-slate-900'
                  : 'hover:bg-white/15 text-white/80 hover:text-white'
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
