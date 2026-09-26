import defaultSyncData from './defaultSyncData.json';

export interface SiteThemeSettings {
  id: string;
  nameAr: string;
  nameEn: string;
  primaryColor: string; // e.g. #0B3B36
  primaryLight: string; // e.g. #0E5246
  accentColor: string; // e.g. #00E5BE
  secondaryColor: string; // e.g. #0284C7
  isCustom?: boolean;
}

export const THEME_PRESETS: SiteThemeSettings[] = [
  {
    id: 'emerald-raba',
    nameAr: 'الزمردي الراقي والأخضر الصحي (هوية رابا الأصلية)',
    nameEn: 'Raba Classic Royal Emerald & Teal',
    primaryColor: '#0B3B36',
    primaryLight: '#0E5246',
    accentColor: '#00E5BE',
    secondaryColor: '#0284C7'
  },
  {
    id: 'medical-navy',
    nameAr: 'الأزرق الطبي الملكي والكحلي الموثوق',
    nameEn: 'Clinical Royal Navy & Sky Blue',
    primaryColor: '#0F2942',
    primaryLight: '#1B3E63',
    accentColor: '#0284C7',
    secondaryColor: '#38BDF8'
  },
  {
    id: 'ocean-turquoise',
    nameAr: 'الفيروزي والبحري الهادئ المهدئ للأطفال',
    nameEn: 'Calming Ocean & Turquoise',
    primaryColor: '#0D3B3F',
    primaryLight: '#16575D',
    accentColor: '#14B8A6',
    secondaryColor: '#06B6D4'
  },
  {
    id: 'clinical-violet',
    nameAr: 'البنفسجي الإكلينيكي الراقي (التحفيز الإدراكي)',
    nameEn: 'Clinical Royal Violet & Amethyst',
    primaryColor: '#2E1065',
    primaryLight: '#43198D',
    accentColor: '#8B5CF6',
    secondaryColor: '#A855F7'
  },
  {
    id: 'warm-amber',
    nameAr: 'العنبر والذهبي الدافئ (الإيجابية والأمل)',
    nameEn: 'Warm Amber & Golden Hope',
    primaryColor: '#451A03',
    primaryLight: '#652809',
    accentColor: '#F59E0B',
    secondaryColor: '#FBBF24'
  }
];

export interface SocialLinksSettings {
  whatsapp: string;
  phone: string;
  x: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  linkedin: string;
  snapchat: string;
}

export interface ProgramPillarItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  iconName: string; // 'UserCheck' | 'Lightbulb' | 'Heart' | 'Star' | 'Globe' | 'Shield' | 'Award' | 'Sparkles'
  color: string;
  bgColor: string;
  borderColor: string;
  active: boolean;
  order: number;
}

export interface FooterSettings {
  aboutTextAr: string;
  aboutTextEn: string;
  accreditationBadgeAr: string;
  accreditationBadgeEn: string;
  addressAr: string;
  addressEn: string;
  phone: string;
  email: string;
  hoursAr: string;
  hoursEn: string;
  officialLicenseAr: string;
  officialLicenseEn: string;
  copyrightAr: string;
  copyrightEn: string;
  qualityProtocolsAr: string;
  qualityProtocolsEn: string;
  showTrustBadges: boolean;
  showSocialIcons: boolean;
}

export interface SiteModulesVisibility {
  hero: boolean;
  pillars: boolean;
  stats: boolean;
  accreditations: boolean;
  branches: boolean;
  services: boolean;
  specialists: boolean;
  offers: boolean;
  reviews: boolean;
  blog: boolean;
  bookingForm: boolean;
  faq: boolean;
  footer: boolean;
}

export interface SiteLogoSettings {
  logoSource: 'vector' | 'custom';
  customLogoUrl: string;
  iconSizePx: number; // 28 to 96, default 44
  iconRounding: 'none' | 'sm' | 'md' | 'lg' | 'full';
  iconObjectFit: 'contain' | 'cover';
  spacingPx: number; // 4 to 32, default 10
  showText: boolean;
  titleAr: string;
  subtitleAr: string;
  titleEn: string;
  subtitleEn: string;
  showEnglishBadge: boolean;
  showSubtitle: boolean;
  titleColor: string; // custom hex or empty for default signature magenta
  titleFontSizePx: number; // 13 to 28, default 18
  subtitleFontSizePx: number; // 8 to 16, default 10
}

export const DEFAULT_LOGO_SETTINGS: SiteLogoSettings = {
  logoSource: 'custom',
  customLogoUrl: '/logo/raba_puzzle_brain.png',
  iconSizePx: 46,
  iconRounding: 'none',
  iconObjectFit: 'contain',
  spacingPx: 10,
  showText: false, // Default is false: text beside logo is removed for modern clean look
  titleAr: 'مركز رابا',
  subtitleAr: 'للرعاية النهارية والتأهيل',
  titleEn: 'RABA',
  subtitleEn: 'Center for Day Care & Rehabilitation',
  showEnglishBadge: true,
  showSubtitle: true,
  titleColor: '',
  titleFontSizePx: 18,
  subtitleFontSizePx: 10,
};

export const DEFAULT_THEME_SETTINGS: SiteThemeSettings = THEME_PRESETS[0];

export const DEFAULT_SOCIAL_SETTINGS: SocialLinksSettings = {
  whatsapp: 'https://wa.me/966551234567',
  phone: '+966 55 123 4567',
  x: 'https://x.com/rabacenter',
  instagram: 'https://instagram.com/rabacenter',
  tiktok: 'https://tiktok.com/@rabacenter',
  youtube: 'https://youtube.com/@rabacenter',
  linkedin: 'https://linkedin.com/company/rabacenter',
  snapchat: 'https://snapchat.com/add/rabacenter'
};

export const DEFAULT_PROGRAM_PILLARS: ProgramPillarItem[] = [
  {
    id: 'leadership',
    titleAr: 'الريادة والتميز الإكلينيكي',
    titleEn: 'Clinical Leadership',
    descAr: 'قيادة طبية سعودية مرخصة تضع معايير الجودة الدولية في الرعاية النهارية والتأهيل المتخصص.',
    descEn: 'Licensed Saudi clinical leadership setting international standards.',
    iconName: 'UserCheck',
    color: 'text-[#0284C7]',
    bgColor: 'bg-sky-500/15',
    borderColor: 'border-sky-400/30',
    active: true,
    order: 1
  },
  {
    id: 'innovation',
    titleAr: 'الابتكار والتحديث المستمر',
    titleEn: 'Innovation',
    descAr: 'تطبيق أحدث الأدوات والتقنيات المقننة في التقييم والتدخل السلوكي والحسي لدعم التطور النمائي.',
    descEn: 'Employing modern standardized tools and evidence-based methods.',
    iconName: 'Lightbulb',
    color: 'text-[#F59E0B]',
    bgColor: 'bg-amber-500/15',
    borderColor: 'border-amber-400/30',
    active: true,
    order: 2
  },
  {
    id: 'values',
    titleAr: 'القيم والأثر الإنساني',
    titleEn: 'Values & Impact',
    descAr: 'بيئة علاجية آمنة ومحبة تحترم خصوصية الطفل وتوفر إرشاداً نفسياً وأسرياً دائماً للوالدين.',
    descEn: 'A caring therapeutic setting respecting privacy and empowering families.',
    iconName: 'Heart',
    color: 'text-[#0D6D54] dark:text-[#00E5BE]',
    bgColor: 'bg-teal-500/15',
    borderColor: 'border-teal-400/30',
    active: true,
    order: 3
  },
  {
    id: 'behavior',
    titleAr: 'تحليل السلوك التطبيقي ABA',
    titleEn: 'Applied Behavior ABA',
    descAr: 'خطط تعديل سلوك فردية بإشراف مشرفين معتمدين دولياً لرفع الاستقلالية والمهارات الاجتماعية.',
    descEn: 'Individual behavior modification plans under international board supervision.',
    iconName: 'Star',
    color: 'text-[#10B981]',
    bgColor: 'bg-emerald-500/15',
    borderColor: 'border-emerald-400/30',
    active: true,
    order: 4
  },
  {
    id: 'culture',
    titleAr: 'البيئة والدمج المجتمعي',
    titleEn: 'Inclusion & Culture',
    descAr: 'تهيئة الطفل للدمج المدرسي والمجتمعي الفعال وتوفير معلم الظل المتخصص لتحقيق أقصى إمكاناته.',
    descEn: 'Preparing children for school inclusion and real-world independence.',
    iconName: 'Globe',
    color: 'text-[#00E5BE]',
    bgColor: 'bg-teal-500/15',
    borderColor: 'border-teal-400/30',
    active: true,
    order: 5
  }
];

export const DEFAULT_FOOTER_SETTINGS: FooterSettings = {
  aboutTextAr: 'مركز رابا للرعاية النهارية والتأهيل - مرخص من وزارة الصحة ووزارة الموارد البشرية والتنمية الاجتماعية، نقدم برامج تأهيلية متكاملة لطيف التوحد، تحليل السلوك التطبيقي ABA، واضطرابات النطق والتواصل.',
  aboutTextEn: 'Raba Center for Day Care & Rehabilitation - Accredited clinical care for autism spectrum, ABA behavioral therapy, and speech development.',
  accreditationBadgeAr: 'معتمد من وزارة الصحة والجهات التنظيمية الرسمية بالمملكة',
  accreditationBadgeEn: 'MOH & Saudi Ministry of Human Resources Accredited',
  addressAr: 'المملكة العربية السعودية، الرياض - حي الصحافة',
  addressEn: 'Riyadh, Saudi Arabia - Al Sahafa District',
  phone: '+966 55 123 4567',
  email: 'contact@rabacenter.com',
  hoursAr: 'الأحد - الخميس: 8:00 ص - 8:00 م | السبت: 9:00 ص - 4:00 م',
  hoursEn: 'Sun - Thu: 8:00 AM - 8:00 PM | Sat: 9:00 AM - 4:00 PM',
  officialLicenseAr: 'ترخيص وزارة الصحة: 1400039281 | اعتماد البورد الأمريكي BACB & BHCOE',
  officialLicenseEn: 'MOH License: 1400039281 | BACB & BHCOE Certified',
  copyrightAr: '© 2026 مركز رابا للرعاية النهارية والتأهيل. جميع الحقوق محفوظة.',
  copyrightEn: '© 2026 Raba Center for Day Care & Rehabilitation. All rights reserved.',
  qualityProtocolsAr: 'نطبق أعلى معايير الجودة العالمية وأحدث بروتوكولات تحليل السلوك التطبيقي ABA المعتمدة دولياً لضمان تطور مستمر لطفلك.',
  qualityProtocolsEn: 'We apply world-class clinical standards and evidence-based protocols to ensure real daily progress.',
  showTrustBadges: true,
  showSocialIcons: true
};

export const DEFAULT_MODULES_VISIBILITY: SiteModulesVisibility = {
  hero: true,
  pillars: false,
  stats: true,
  accreditations: true,
  branches: true,
  services: true,
  specialists: true,
  offers: true,
  reviews: true,
  blog: true,
  bookingForm: true,
  faq: true,
  footer: true
};

const STORAGE_THEME_KEY = 'raba_site_theme_v1';
const STORAGE_SOCIAL_KEY = 'raba_social_links_v1';
const STORAGE_PILLARS_KEY = 'raba_program_pillars_v1';
const STORAGE_FOOTER_KEY = 'raba_footer_settings_v1';
const STORAGE_MODULES_KEY = 'raba_site_modules_v1';
const STORAGE_LOGO_KEY = 'raba_site_logo_v3';
const STORAGE_LOGO_KEY_OLD2 = 'raba_site_logo_v2';
const STORAGE_LOGO_KEY_OLD = 'raba_site_logo_v1';

import { savePersistentModule } from '../utils/persistentSync';
import { savePersistentImage } from '../utils/persistentImageStore';

// Favicon updater for browser tabs
export function updateTabFavicon(settings?: SiteLogoSettings): void {
  if (typeof document === 'undefined') return;
  try {
    const current = settings || getStoredLogoSettings();
    const faviconUrl = (current.logoSource === 'custom' && current.customLogoUrl)
      ? current.customLogoUrl
      : '/logo/raba_puzzle_brain.png';

    const iconLinks = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
    if (iconLinks.length > 0) {
      iconLinks.forEach(link => {
        link.href = faviconUrl;
      });
    } else {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = faviconUrl;
      document.head.appendChild(link);
    }
  } catch (err) {
    console.error('Failed to update tab favicon', err);
  }
}

// Logo Load / Save
export function getStoredLogoSettings(): SiteLogoSettings {
  try {
    const raw = localStorage.getItem(STORAGE_LOGO_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Auto-replace any legacy WhatsApp or non-transparent logo
      if (!parsed.customLogoUrl || parsed.customLogoUrl.includes('WhatsApp')) {
        parsed.customLogoUrl = '/logo/raba_puzzle_brain.png';
        parsed.logoSource = 'custom';
        localStorage.setItem(STORAGE_LOGO_KEY, JSON.stringify(parsed));
      }
      return { ...DEFAULT_LOGO_SETTINGS, ...parsed };
    }
    // Migration from previous versions: ensure new transparent logo is active
    const oldRaw = localStorage.getItem(STORAGE_LOGO_KEY_OLD2) || localStorage.getItem(STORAGE_LOGO_KEY_OLD);
    if (oldRaw) {
      try {
        const parsed = JSON.parse(oldRaw);
        let customUrl = parsed.customLogoUrl;
        if (!customUrl || customUrl.includes('WhatsApp')) {
          customUrl = '/logo/raba_puzzle_brain.png';
        }
        const migrated: SiteLogoSettings = {
          ...DEFAULT_LOGO_SETTINGS,
          ...parsed,
          customLogoUrl: customUrl,
          logoSource: 'custom',
          showText: false // Removed text beside logo
        };
        localStorage.setItem(STORAGE_LOGO_KEY, JSON.stringify(migrated));
        return migrated;
      } catch {
        // ignore JSON parse error
      }
    }
    const bundled = (defaultSyncData as any)?.data?.raba_site_logo_v3;
    if (bundled && typeof bundled === 'object') {
      return { ...DEFAULT_LOGO_SETTINGS, ...bundled };
    }
    return { ...DEFAULT_LOGO_SETTINGS };
  } catch {
    const bundled = (defaultSyncData as any)?.data?.raba_site_logo_v3;
    if (bundled && typeof bundled === 'object') {
      return { ...DEFAULT_LOGO_SETTINGS, ...bundled };
    }
    return { ...DEFAULT_LOGO_SETTINGS };
  }
}

export function saveStoredLogoSettings(settings: SiteLogoSettings): void {
  try {
    const stringified = JSON.stringify(settings);
    const now = Date.now().toString();
    localStorage.setItem(STORAGE_LOGO_KEY, stringified);
    localStorage.setItem(STORAGE_LOGO_KEY_OLD2, stringified);
    localStorage.setItem(STORAGE_LOGO_KEY_OLD, stringified);
    localStorage.setItem(`raba_ts_${STORAGE_LOGO_KEY}`, now);
    localStorage.setItem(`raba_ts_${STORAGE_LOGO_KEY_OLD2}`, now);
    localStorage.setItem(`raba_ts_${STORAGE_LOGO_KEY_OLD}`, now);
  } catch (err) {
    console.error('Failed to save logo settings', err);
  }

  if (settings.customLogoUrl) {
    savePersistentImage('site_logo', settings.customLogoUrl).catch(() => {});
    savePersistentImage(settings.customLogoUrl, settings.customLogoUrl).catch(() => {});
  }

  savePersistentModule(STORAGE_LOGO_KEY, settings);
  updateTabFavicon(settings);
  window.dispatchEvent(new CustomEvent('raba_logo_updated', { detail: settings }));
}

export function resetLogoSettingsToDefault(): SiteLogoSettings {
  try {
    localStorage.removeItem(STORAGE_LOGO_KEY);
    localStorage.removeItem(STORAGE_LOGO_KEY_OLD2);
    localStorage.removeItem(STORAGE_LOGO_KEY_OLD);
  } catch (err) {
    console.error('Failed to reset logo settings', err);
  }
  savePersistentModule(STORAGE_LOGO_KEY, DEFAULT_LOGO_SETTINGS);
  updateTabFavicon(DEFAULT_LOGO_SETTINGS);
  window.dispatchEvent(new CustomEvent('raba_logo_updated', { detail: DEFAULT_LOGO_SETTINGS }));
  return { ...DEFAULT_LOGO_SETTINGS };
}

// Theme Load / Save
export function getStoredThemeSettings(): SiteThemeSettings {
  try {
    const raw = localStorage.getItem(STORAGE_THEME_KEY);
    if (!raw) return { ...DEFAULT_THEME_SETTINGS };
    return { ...DEFAULT_THEME_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_THEME_SETTINGS };
  }
}

export function saveStoredThemeSettings(settings: SiteThemeSettings): void {
  try {
    localStorage.setItem(STORAGE_THEME_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save theme settings', err);
  }
  savePersistentModule(STORAGE_THEME_KEY, settings);
  applyGlobalTheme(settings);
  window.dispatchEvent(new CustomEvent('raba_theme_updated', { detail: settings }));
}

export function applyGlobalTheme(settings: SiteThemeSettings): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--raba-primary', settings.primaryColor);
  root.style.setProperty('--raba-primary-light', settings.primaryLight);
  root.style.setProperty('--raba-accent', settings.accentColor);
  root.style.setProperty('--raba-secondary', settings.secondaryColor);
}

// Social Load / Save
export function getStoredSocialSettings(): SocialLinksSettings {
  try {
    const raw = localStorage.getItem(STORAGE_SOCIAL_KEY);
    if (!raw) return { ...DEFAULT_SOCIAL_SETTINGS };
    return { ...DEFAULT_SOCIAL_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SOCIAL_SETTINGS };
  }
}

export function saveStoredSocialSettings(settings: SocialLinksSettings): void {
  try {
    localStorage.setItem(STORAGE_SOCIAL_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save social settings', err);
  }
  savePersistentModule(STORAGE_SOCIAL_KEY, settings);
  window.dispatchEvent(new CustomEvent('raba_social_updated', { detail: settings }));
}

// Pillars Load / Save
export function getStoredPillars(): ProgramPillarItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_PILLARS_KEY);
    if (!raw) return [...DEFAULT_PROGRAM_PILLARS];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return [...DEFAULT_PROGRAM_PILLARS];
  } catch {
    return [...DEFAULT_PROGRAM_PILLARS];
  }
}

export function saveStoredPillars(pillars: ProgramPillarItem[]): void {
  try {
    localStorage.setItem(STORAGE_PILLARS_KEY, JSON.stringify(pillars));
  } catch (err) {
    console.error('Failed to save pillars', err);
  }
  savePersistentModule(STORAGE_PILLARS_KEY, pillars);
  window.dispatchEvent(new CustomEvent('raba_pillars_updated', { detail: pillars }));
}

// Footer Load / Save
export function getStoredFooterSettings(): FooterSettings {
  try {
    const raw = localStorage.getItem(STORAGE_FOOTER_KEY);
    if (!raw) return { ...DEFAULT_FOOTER_SETTINGS };
    return { ...DEFAULT_FOOTER_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_FOOTER_SETTINGS };
  }
}

export function saveStoredFooterSettings(settings: FooterSettings): void {
  try {
    localStorage.setItem(STORAGE_FOOTER_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save footer settings', err);
  }
  savePersistentModule(STORAGE_FOOTER_KEY, settings);
  window.dispatchEvent(new CustomEvent('raba_footer_updated', { detail: settings }));
}

// Modules Load / Save
export function getStoredModulesVisibility(): SiteModulesVisibility {
  try {
    const raw = localStorage.getItem(STORAGE_MODULES_KEY);
    if (!raw) return { ...DEFAULT_MODULES_VISIBILITY };
    return { ...DEFAULT_MODULES_VISIBILITY, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_MODULES_VISIBILITY };
  }
}

export function saveStoredModulesVisibility(modules: SiteModulesVisibility): void {
  try {
    localStorage.setItem(STORAGE_MODULES_KEY, JSON.stringify(modules));
  } catch (err) {
    console.error('Failed to save modules visibility', err);
  }
  savePersistentModule(STORAGE_MODULES_KEY, modules);
  window.dispatchEvent(new CustomEvent('raba_modules_updated', { detail: modules }));
}
