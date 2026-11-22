import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  BlogPost,
  DEFAULT_BANK_TRANSFER_CONFIG,
  DEFAULT_PAYMENT_PUBLIC_CONFIG,
  DEFAULT_TRACKING_PIXELS,
  OfferData,
  ParentReview,
  PaymentPublicConfig,
  ServiceItem,
  Specialist,
  TherapyPackage,
  TrackingPixelsConfig
} from '../types';
import {
  AnnouncementBarSettings,
  DEFAULT_ANNOUNCEMENT_BAR_SETTINGS,
  DEFAULT_FOOTER_SETTINGS,
  DEFAULT_LOGO_SETTINGS,
  DEFAULT_MODULES_VISIBILITY,
  DEFAULT_PROGRAM_PILLARS,
  DEFAULT_SOCIAL_SETTINGS,
  DEFAULT_THEME_SETTINGS,
  FooterSettings,
  ProgramPillarItem,
  SiteLogoSettings,
  SiteModulesVisibility,
  SiteThemeSettings,
  SocialLinksSettings,
  applyGlobalTheme,
  updateTabFavicon
} from '../data/siteCustomizer';
import {
  DEFAULT_HERO_SLIDER_CONFIG,
  DEFAULT_HERO_SLIDES,
  HeroSlideItem,
  HeroSliderConfig
} from '../data/sliderCustomizer';
import { SERVICES, THERAPY_PACKAGES } from '../data/servicesData';
import { BRANCHES_DATA, BranchItem } from '../data/branchesData';
import { INITIAL_OFFERS } from '../data/offersData';
import {
  COURSES_DATA,
  CourseItem,
  CoursesSectionSettings,
  DEFAULT_COURSES_SETTINGS,
  getCourseNumericPrice,
  sortCoursesForDisplay
} from '../data/coursesData';
import {
  DEFAULT_PARTNERS,
  DEFAULT_PARTNERS_SETTINGS,
  PartnerItem,
  PartnersSliderSettings
} from '../data/partnersData';
import { BUNDLED_PARTNER_LOGOS } from '../data/partnerLogosBundle';
import {
  ACCREDITATIONS_LIST,
  AccreditationItem,
  AccreditationsSectionSettings,
  DEFAULT_ACCREDITATIONS_SETTINGS
} from '../data/accreditationsData';
import {
  DEFAULT_GLOBAL_CARD_SETTINGS,
  DEFAULT_SPECIALIST_SETTINGS,
  GlobalCardSettings,
  SpecialistImageSetting
} from '../data/specialistCustomizer';
import { SPECIALISTS } from '../data/specialistsData';
import { PARENT_REVIEWS } from '../data/reviewsData';
import { BLOG_POSTS } from '../data/blogData';
import { deduplicateSpecialists, normalizeSpecialistId } from '../utils/specialistDeduplication';
import { applyAuthoritativeFirestoreSetting } from '../utils/persistentSync';
import { getLazyDb } from '../lib/firebase';
import {
  subscribeAccreditations,
  subscribeBlogPosts,
  subscribeCourses,
  subscribeOffers,
  subscribePackages,
  subscribePartners,
  subscribeServices,
  subscribeSiteSettings,
  subscribeSliders,
  subscribeSpecialists,
  subscribeTestimonials,
  testFirestoreConnection
} from '../services/firestoreService';

export interface PricingGlobalSettings {
  currencySymbol: string;
  isVatInclusive: boolean;
  installmentNote: string;
}

export const DEFAULT_PRICING_GLOBAL_SETTINGS: PricingGlobalSettings = {
  currencySymbol: 'ر.س',
  isVatInclusive: true,
  installmentNote: 'متاح الدفع بالأقساط الميسرة عبر تمارا (Tamara) وإمكان بدون فوائد'
};

export interface LiveDataSyncErrors {
  siteSettings?: string;
  specialists?: string;
  services?: string;
  packages?: string;
  sliders?: string;
  courses?: string;
  blogPosts?: string;
  accreditations?: string;
  partners?: string;
  offers?: string;
  testimonials?: string;
}

export interface LiveDataContextValue {
  // Raw Firestore settings map
  rawSettings: Record<string, any>;

  // Loading states (strictly true until initial onSnapshot resolves)
  loading: boolean;
  isLoading: boolean;
  loadingSettings: boolean;
  loadingSpecialists: boolean;
  loadingServices: boolean;
  loadingPackages: boolean;
  loadingSliders: boolean;
  loadingCourses: boolean;
  loadingBlogPosts: boolean;
  loadingAccreditations: boolean;
  loadingPartners: boolean;
  loadingOffers: boolean;
  loadingTestimonials: boolean;
  syncErrors: LiveDataSyncErrors;

  // Authoritative collection flags (prevent empty/deleted catalogs from falling back to defaults)
  isAuthoritativeSpecialists: boolean;
  isAuthoritativeServices: boolean;
  isAuthoritativePackages: boolean;
  isAuthoritativeSliders: boolean;
  isAuthoritativeCourses: boolean;
  isAuthoritativeBlogPosts: boolean;
  isAuthoritativeAccreditations: boolean;
  isAuthoritativePartners: boolean;
  isAuthoritativeOffers: boolean;
  isAuthoritativeTestimonials: boolean;

  // Normalized live domain state
  modules: SiteModulesVisibility;
  siteTheme: SiteThemeSettings;
  logo: SiteLogoSettings;
  social: SocialLinksSettings;
  footer: FooterSettings;
  pillars: ProgramPillarItem[];
  announcementBar: AnnouncementBarSettings;
  trackingPixels: TrackingPixelsConfig;
  heroSlides: HeroSlideItem[];
  heroConfig: HeroSliderConfig;
  services: ServiceItem[];
  packages: TherapyPackage[];
  offers: OfferData[];
  branches: BranchItem[];
  courses: CourseItem[];
  coursesSettings: CoursesSectionSettings;
  partners: PartnerItem[];
  partnersSettings: PartnersSliderSettings;
  accreditations: AccreditationItem[];
  accreditationSettings: AccreditationsSectionSettings;
  specialistCardSettings: Record<string, SpecialistImageSetting>;
  globalCardSettings: GlobalCardSettings;
  pricingGlobalSettings: PricingGlobalSettings;
  paymentPublicConfig: PaymentPublicConfig;
  specialists: Specialist[];
  testimonials: ParentReview[];
  blogPosts: BlogPost[];
}

export interface RealtimeHookResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

/**
 * Strongly typed generic real-time Firestore collection hook using onSnapshot.
 */
export function useRealtimeCollection<T = Record<string, any>>(
  collectionName: string
): RealtimeHookResult<T[]> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collectionName) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    let unsubscribe: (() => void) | null = null;
    setLoading(true);

    Promise.all([import('firebase/firestore'), getLazyDb()])
      .then(([fs, db]) => {
        if (cancelled) return;
        const colRef = fs.collection(db, collectionName);
        unsubscribe = fs.onSnapshot(
          colRef,
          (querySnapshot) => {
            if (cancelled) return;
            const docs = querySnapshot.docs.map((d) => ({
              ...(d.data() as Record<string, any>),
              id: (d.data() as any)?.id || d.id,
            })) as T[];
            setData(docs);
            setError(null);
            setLoading(false);
          },
          (err: any) => {
            console.error('[Firestore Live Sync Error]:', err?.code || 'unknown', err?.message || err);
            if (!cancelled) {
              setError(`${err?.code || 'unknown'}: ${err?.message || String(err)}`);
              setLoading(false);
            }
          }
        );
      })
      .catch((err: any) => {
        console.error('[Firestore Live Sync Error]:', err?.code || 'init-failed', err?.message || err);
        if (!cancelled) {
          setError(`${err?.code || 'init-failed'}: ${err?.message || String(err)}`);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
    };
  }, [collectionName]);

  return { data, loading, error };
}

/**
 * Strongly typed generic real-time Firestore document hook using onSnapshot.
 */
export function useRealtimeDocument<T = Record<string, any>>(
  collectionName: string,
  docId: string
): RealtimeHookResult<T | null> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collectionName || !docId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    let unsubscribe: (() => void) | null = null;
    setLoading(true);

    Promise.all([import('firebase/firestore'), getLazyDb()])
      .then(([fs, db]) => {
        if (cancelled) return;
        const docRef = fs.doc(db, collectionName, docId);
        unsubscribe = fs.onSnapshot(
          docRef,
          (docSnap) => {
            if (cancelled) return;
            if (docSnap.exists()) {
              setData({ ...(docSnap.data() as Record<string, any>), id: docSnap.id } as T);
            } else {
              setData(null);
            }
            setError(null);
            setLoading(false);
          },
          (err: any) => {
            console.error('[Firestore Live Sync Error]:', err?.code || 'unknown', err?.message || err);
            if (!cancelled) {
              setError(`${err?.code || 'unknown'}: ${err?.message || String(err)}`);
              setLoading(false);
            }
          }
        );
      })
      .catch((err: any) => {
        console.error('[Firestore Live Sync Error]:', err?.code || 'init-failed', err?.message || err);
        if (!cancelled) {
          setError(`${err?.code || 'init-failed'}: ${err?.message || String(err)}`);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
    };
  }, [collectionName, docId]);

  return { data, loading, error };
}

const BROKEN_BLOG_IMAGE_FRAGMENT = 'photo-1596464716127-f2a829822391';
const HEALED_BLOG_IMAGE = '/images/hero/card_2_assessment.webp';

function normalizePillarColor(color?: string): string {
  if (!color) return 'text-[#1263D6] dark:text-[#60AFFF]';
  if (color.includes('dark:text-')) return color;
  const legacyMap: Record<string, string> = {
    'text-[#2E86EB]': 'text-[#1263D6] dark:text-[#60AFFF]',
    'text-[#FFD23F]': 'text-[#B45309] dark:text-[#FFD23F]',
    'text-[#FF2D9B]': 'text-[#BE123C] dark:text-[#FF5CB4]',
    'text-[#22C55E]': 'text-[#047857] dark:text-[#34D399]',
    'text-[#D9F14A]': 'text-[#4D7C0F] dark:text-[#D9F14A]',
  };
  return legacyMap[color.trim()] || color;
}

function normalizeBranchBadgeClass(badgeColorClass?: string): string {
  if (!badgeColorClass) return 'bg-blue-500/15 text-[#1D4ED8] dark:text-blue-300 border-blue-500/30';
  if (badgeColorClass.includes('dark:text-')) return badgeColorClass;
  const map: Array<[RegExp, string]> = [
    [/text-cyan-(300|400)/, 'text-[#0E7490] dark:text-cyan-300'],
    [/text-teal-(300|400)/, 'text-[#0F766E] dark:text-teal-300'],
    [/text-violet-(300|400)/, 'text-[#6D28D9] dark:text-violet-300'],
    [/text-amber-(300|400)/, 'text-[#B45309] dark:text-amber-300'],
    [/text-rose-(300|400)/, 'text-[#BE123C] dark:text-rose-300'],
    [/text-indigo-(300|400)/, 'text-[#4338CA] dark:text-indigo-300'],
    [/text-sky-(300|400)/, 'text-[#0369A1] dark:text-sky-300'],
    [/text-emerald-(300|400)/, 'text-[#047857] dark:text-emerald-300'],
    [/text-blue-(300|400)/, 'text-[#1D4ED8] dark:text-blue-300'],
  ];
  let updated = badgeColorClass;
  for (const [pattern, replacement] of map) {
    updated = updated.replace(pattern, replacement);
  }
  return updated;
}

function normalizeLogo(raw: any): SiteLogoSettings {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_LOGO_SETTINGS };
  const merged = { ...DEFAULT_LOGO_SETTINGS, ...raw };
  if (!merged.customLogoUrl || String(merged.customLogoUrl).includes('WhatsApp')) {
    merged.customLogoUrl = '/logo/raba_puzzle_brain.png';
    merged.logoSource = 'custom';
  }
  return merged;
}

function normalizeSocial(raw: any): SocialLinksSettings {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_SOCIAL_SETTINGS };
  const parsed = { ...DEFAULT_SOCIAL_SETTINGS, ...raw };
  if (!parsed.phone || parsed.phone.includes('55 123 4567') || parsed.phone.includes('000 0000')) {
    parsed.phone = '0575100100';
  }
  if (!parsed.whatsapp || parsed.whatsapp.includes('551234567')) {
    parsed.whatsapp = 'https://wa.me/966575100100';
  }
  return parsed;
}

function normalizeFooter(raw: any): FooterSettings {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_FOOTER_SETTINGS };
  const parsed = { ...DEFAULT_FOOTER_SETTINGS, ...raw };
  if (!parsed.phone || parsed.phone.includes('55 123 4567') || parsed.phone.includes('000 0000')) {
    parsed.phone = '0575100100';
  }
  if (!parsed.email || parsed.email.includes('contact@rabacenter')) {
    parsed.email = 'info@rabacenters.com';
  }
  if (!parsed.addressAr || parsed.addressAr.includes('حي الصحافة') || parsed.addressAr.includes('الصحافة')) {
    parsed.addressAr = 'المملكة العربية السعودية';
  }
  if (!parsed.addressEn || parsed.addressEn.includes('Al Sahafa') || parsed.addressEn.includes('Sahafa')) {
    parsed.addressEn = 'Kingdom of Saudi Arabia';
  }
  if (!parsed.hoursAr || parsed.hoursAr.includes('السبت') || parsed.hoursAr.includes('Saturday')) {
    parsed.hoursAr = 'الأحد – الخميس: 8:00 ص – 8:00 م';
  }
  if (!parsed.hoursEn || parsed.hoursEn.includes('Sat') || parsed.hoursEn.includes('Saturday')) {
    parsed.hoursEn = 'Sunday – Thursday: 8:00 AM – 8:00 PM';
  }
  parsed.officialLicenseAr = '';
  parsed.officialLicenseEn = '';
  parsed.accreditationBadgeAr = '';
  parsed.accreditationBadgeEn = '';
  return parsed;
}

function normalizeTrackingPixels(raw: any): TrackingPixelsConfig {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_TRACKING_PIXELS };
  return {
    meta: { ...DEFAULT_TRACKING_PIXELS.meta, ...(raw.meta || {}) },
    tiktok: { ...DEFAULT_TRACKING_PIXELS.tiktok, ...(raw.tiktok || {}) },
    snapchat: { ...DEFAULT_TRACKING_PIXELS.snapchat, ...(raw.snapchat || {}) },
    gtm: { ...DEFAULT_TRACKING_PIXELS.gtm, ...(raw.gtm || {}) },
    custom_head: { ...DEFAULT_TRACKING_PIXELS.custom_head, ...(raw.custom_head || {}) },
    custom_body: { ...DEFAULT_TRACKING_PIXELS.custom_body, ...(raw.custom_body || {}) },
  };
}

function normalizeCoursesList(raw: any, isAuthoritative: boolean): CourseItem[] {
  const enrichItem = (c: any): CourseItem => {
    const def = COURSES_DATA.find((d) => d.id === c.id);
    const hasCachedPrice = c.currentPrice !== undefined && Number(c.currentPrice) > 0;
    const numericPrice = hasCachedPrice
      ? typeof c.currentPrice === 'number'
        ? c.currentPrice
        : parseFloat(String(c.currentPrice).replace(/[^0-9.]/g, '')) || 0
      : def?.currentPrice || getCourseNumericPrice(c) || getCourseNumericPrice(def as any) || 0;

    return {
      ...def,
      ...c,
      cardCoverUrl: c.cardCoverUrl || def?.cardCoverUrl || '',
      iconName: c.iconName || def?.iconName || undefined,
      floatingBadgeAr: c.floatingBadgeAr || def?.floatingBadgeAr || '',
      floatingBadgeEn: c.floatingBadgeEn || def?.floatingBadgeEn || '',
      accreditationBadgeAr: c.accreditationBadgeAr || def?.accreditationBadgeAr || c.ribbonTagAr || '',
      accreditationBadgeEn: c.accreditationBadgeEn || def?.accreditationBadgeEn || c.ribbonTagEn || '',
      rating: c.rating || def?.rating || 4.9,
      reviewsCount: c.reviewsCount || def?.reviewsCount || 120,
      instructorAr: c.instructorAr || 'بإشراف نخبة من الأخصائيين المعتمدين',
      instructorEn: c.instructorEn || 'Supervised by Certified Specialists',
      lessonsCount: c.lessonsCount || def?.lessonsCount || 20,
      priceDisplayAr:
        !hasCachedPrice && def?.priceDisplayAr
          ? def.priceDisplayAr
          : c.priceDisplayAr || def?.priceDisplayAr || '',
      priceDisplayEn:
        !hasCachedPrice && def?.priceDisplayEn
          ? def.priceDisplayEn
          : c.priceDisplayEn || def?.priceDisplayEn || '',
      currentPrice: numericPrice,
      originalPrice:
        c.originalPrice !== undefined && Number(c.originalPrice) > 0
          ? c.originalPrice
          : def?.originalPrice || 0,
      isActive: c.isActive !== false && c.active !== false,
      active: c.active !== false && c.isActive !== false,
    };
  };

  if (Array.isArray(raw)) {
    const cleaned = raw.filter((p: any) => p && typeof p.id === 'string');
    if (isAuthoritative) {
      return sortCoursesForDisplay(cleaned.map(enrichItem));
    }
    if (cleaned.length > 0) {
      const existingIds = new Set(cleaned.map((p: any) => p.id));
      const missing = COURSES_DATA.filter((c) => !existingIds.has(c.id));
      return sortCoursesForDisplay([...cleaned, ...missing].map(enrichItem));
    }
  }
  return isAuthoritative ? [] : sortCoursesForDisplay(COURSES_DATA.map(enrichItem));
}

function normalizeCoursesSettings(raw: any): CoursesSectionSettings {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_COURSES_SETTINGS };
  return {
    ...DEFAULT_COURSES_SETTINGS,
    ...raw,
    badgeAr:
      raw.badgeAr === 'الكورسات والدورات التدريبية'
        ? DEFAULT_COURSES_SETTINGS.badgeAr
        : raw.badgeAr || DEFAULT_COURSES_SETTINGS.badgeAr,
    titlePart1Ar:
      raw.titlePart1Ar === 'طوّر مسارك المهني في'
        ? DEFAULT_COURSES_SETTINGS.titlePart1Ar
        : raw.titlePart1Ar || DEFAULT_COURSES_SETTINGS.titlePart1Ar,
    titleHighlightAr:
      raw.titleHighlightAr === 'تحليل السلوك التطبيقي (ABA)'
        ? DEFAULT_COURSES_SETTINGS.titleHighlightAr
        : raw.titleHighlightAr || DEFAULT_COURSES_SETTINGS.titleHighlightAr,
    subtitleAr:
      raw.subtitleAr && String(raw.subtitleAr).includes('بأعلى المعايير الإكلينيكية')
        ? DEFAULT_COURSES_SETTINGS.subtitleAr
        : raw.subtitleAr || DEFAULT_COURSES_SETTINGS.subtitleAr,
    paymentOptions: {
      tamara: raw?.paymentOptions?.tamara !== undefined ? Boolean(raw.paymentOptions.tamara) : true,
      emkan: raw?.paymentOptions?.emkan !== undefined ? Boolean(raw.paymentOptions.emkan) : true,
      cash: raw?.paymentOptions?.cash !== undefined ? Boolean(raw.paymentOptions.cash) : true,
    },
    courseRouting: {
      mode: raw?.courseRouting?.mode === 'specific_user' ? 'specific_user' : 'all_authorized',
      assignedUserId: raw?.courseRouting?.assignedUserId || '',
      assignedUserName: raw?.courseRouting?.assignedUserName || '',
      assignedUserEmail: raw?.courseRouting?.assignedUserEmail || '',
    },
  };
}

function normalizePartnersList(raw: any, isAuthoritative: boolean): PartnerItem[] {
  let source: PartnerItem[];
  if (Array.isArray(raw)) {
    if (raw.length === 0) {
      if (isAuthoritative) return [];
      source = DEFAULT_PARTNERS;
    } else {
      source = raw;
    }
  } else {
    if (isAuthoritative) return [];
    source = DEFAULT_PARTNERS;
  }

  return source
    .map((p: PartnerItem) => {
      const bundled = BUNDLED_PARTNER_LOGOS[p.id];
      const resolvedUrl =
        p.logoUrl && !String(p.logoUrl).startsWith('data:')
          ? p.logoUrl
          : bundled || p.logoUrl || `/images/partners/${p.id}_custom.webp`;
      return {
        ...p,
        logoUrl: resolvedUrl,
        isActive: p.isActive !== false && (p as any).active !== false,
      };
    })
    .sort((a, b) => (a.order || 999) - (b.order || 999));
}

function normalizeHeroSlides(raw: any, isAuthoritative: boolean): HeroSlideItem[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return isAuthoritative ? [] : [...DEFAULT_HERO_SLIDES];
  }
  return raw
    .map((slide: HeroSlideItem) => {
      let src = slide.src || '';
      if (src.includes('/images/hero/slide_') && (src.endsWith('.png') || src.endsWith('.jpg'))) {
        src = src.replace(/\.(png|jpg)$/, '.webp');
      }
      return { ...slide, src, active: slide.active !== false };
    })
    .sort((a: HeroSlideItem, b: HeroSlideItem) => (a.order || 0) - (b.order || 0));
}

function normalizeBlogList(
  settingsBlog: any,
  collectionBlog: BlogPost[],
  isCollectionAuthoritative: boolean
): BlogPost[] {
  const fixPost = (p: BlogPost, idx: number): BlogPost => ({
    ...p,
    image: p.image?.includes(BROKEN_BLOG_IMAGE_FRAGMENT) ? HEALED_BLOG_IMAGE : p.image,
    status: p.status === 'draft' ? 'draft' : 'published',
    isSliderFeatured: p.isSliderFeatured !== false,
    order: p.order || idx + 1,
  });

  if (isCollectionAuthoritative) {
    return collectionBlog
      .map((p, idx) => fixPost(p, idx))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  const colMap = new Map<string, BlogPost>();
  for (const post of collectionBlog) {
    if (post?.id) colMap.set(post.id, post);
  }

  if (collectionBlog.length > 0) {
    if (Array.isArray(settingsBlog) && settingsBlog.length > 0) {
      const seen = new Set<string>();
      const merged: BlogPost[] = settingsBlog
        .filter((item: BlogPost) => item?.id && (colMap.has(item.id) || !isCollectionAuthoritative))
        .map((item: BlogPost, idx: number) => {
          const colDoc = item?.id ? colMap.get(item.id) : undefined;
          if (item?.id) seen.add(item.id);
          return fixPost(colDoc ? { ...item, ...colDoc } : item, idx);
        });
      for (const colPost of collectionBlog) {
        if (colPost?.id && !seen.has(colPost.id)) {
          merged.push(fixPost(colPost, merged.length));
        }
      }
      return merged.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return collectionBlog
      .map((p, idx) => fixPost(p, idx))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  if (Array.isArray(settingsBlog)) {
    return settingsBlog
      .map((p: BlogPost, idx: number) => fixPost(p, idx))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  return BLOG_POSTS.map((p, idx) => fixPost(p, idx));
}

const LiveDataContext = createContext<LiveDataContextValue | null>(null);

export const LiveDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rawSettings, setRawSettings] = useState<Record<string, any>>({});
  const [specialistsDocs, setSpecialistsDocs] = useState<Specialist[]>([]);
  const [servicesDocs, setServicesDocs] = useState<ServiceItem[]>([]);
  const [packagesDocs, setPackagesDocs] = useState<TherapyPackage[]>([]);
  const [slidersDocs, setSlidersDocs] = useState<HeroSlideItem[]>([]);
  const [sliderConfigDoc, setSliderConfigDoc] = useState<HeroSliderConfig | undefined>(undefined);
  const [coursesDocs, setCoursesDocs] = useState<CourseItem[]>([]);
  const [blogPostsDocs, setBlogPostsDocs] = useState<BlogPost[]>([]);
  const [accreditationsDocs, setAccreditationsDocs] = useState<AccreditationItem[]>([]);
  const [partnersDocs, setPartnersDocs] = useState<PartnerItem[]>([]);
  const [offersDocs, setOffersDocs] = useState<OfferData[]>([]);
  const [testimonialsDocs, setTestimonialsDocs] = useState<ParentReview[]>([]);

  const [loadingSettings, setLoadingSettings] = useState(true);
  const [loadingSpecialists, setLoadingSpecialists] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loadingSliders, setLoadingSliders] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingBlogPosts, setLoadingBlogPosts] = useState(true);
  const [loadingAccreditations, setLoadingAccreditations] = useState(true);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  const [syncErrors, setSyncErrors] = useState<LiveDataSyncErrors>({});

  // Attach public unauthenticated Firestore onSnapshot listeners across all 11 public collections on mount
  useEffect(() => {
    void testFirestoreConnection();

    const makeErrorHandler =
      (field: keyof LiveDataSyncErrors, setLoadingFn: React.Dispatch<React.SetStateAction<boolean>>) =>
      (error: any) => {
        const msg = `${error?.code || 'unknown'}: ${error?.message || error}`;
        console.error('[Firestore Live Sync Error]:', error?.code || 'unknown', error?.message || error);
        setSyncErrors((prev) => ({ ...prev, [field]: msg }));
        setLoadingFn(false);
      };

    const unsubSettings = subscribeSiteSettings(
      (settingsMap) => {
        setRawSettings(settingsMap);
        setLoadingSettings(false);
        setSyncErrors((prev) => ({ ...prev, siteSettings: undefined }));
        for (const [key, value] of Object.entries(settingsMap)) {
          applyAuthoritativeFirestoreSetting(key, value);
        }
      },
      makeErrorHandler('siteSettings', setLoadingSettings)
    );

    const unsubSpecialists = subscribeSpecialists(
      (list) => {
        setSpecialistsDocs(list);
        setLoadingSpecialists(false);
        setSyncErrors((prev) => ({ ...prev, specialists: undefined }));
      },
      makeErrorHandler('specialists', setLoadingSpecialists)
    );

    const unsubServices = subscribeServices(
      (list) => {
        setServicesDocs(list);
        setLoadingServices(false);
        setSyncErrors((prev) => ({ ...prev, services: undefined }));
      },
      makeErrorHandler('services', setLoadingServices)
    );

    const unsubPackages = subscribePackages(
      (list) => {
        setPackagesDocs(list);
        setLoadingPackages(false);
        setSyncErrors((prev) => ({ ...prev, packages: undefined }));
      },
      makeErrorHandler('packages', setLoadingPackages)
    );

    const unsubSliders = subscribeSliders(
      ({ slides, config }) => {
        setSlidersDocs(slides);
        setSliderConfigDoc(config);
        setLoadingSliders(false);
        setSyncErrors((prev) => ({ ...prev, sliders: undefined }));
      },
      makeErrorHandler('sliders', setLoadingSliders)
    );

    const unsubCourses = subscribeCourses(
      (list) => {
        setCoursesDocs(list);
        setLoadingCourses(false);
        setSyncErrors((prev) => ({ ...prev, courses: undefined }));
      },
      makeErrorHandler('courses', setLoadingCourses)
    );

    const unsubBlogPosts = subscribeBlogPosts(
      (list) => {
        setBlogPostsDocs(list);
        setLoadingBlogPosts(false);
        setSyncErrors((prev) => ({ ...prev, blogPosts: undefined }));
      },
      makeErrorHandler('blogPosts', setLoadingBlogPosts)
    );

    const unsubAccreditations = subscribeAccreditations(
      (list) => {
        setAccreditationsDocs(list);
        setLoadingAccreditations(false);
        setSyncErrors((prev) => ({ ...prev, accreditations: undefined }));
      },
      makeErrorHandler('accreditations', setLoadingAccreditations)
    );

    const unsubPartners = subscribePartners(
      (list) => {
        setPartnersDocs(list);
        setLoadingPartners(false);
        setSyncErrors((prev) => ({ ...prev, partners: undefined }));
      },
      makeErrorHandler('partners', setLoadingPartners)
    );

    const unsubOffers = subscribeOffers(
      (list) => {
        setOffersDocs(list);
        setLoadingOffers(false);
        setSyncErrors((prev) => ({ ...prev, offers: undefined }));
      },
      makeErrorHandler('offers', setLoadingOffers)
    );

    const unsubTestimonials = subscribeTestimonials(
      (list) => {
        setTestimonialsDocs(list);
        setLoadingTestimonials(false);
        setSyncErrors((prev) => ({ ...prev, testimonials: undefined }));
      },
      makeErrorHandler('testimonials', setLoadingTestimonials)
    );

    return () => {
      unsubSettings();
      unsubSpecialists();
      unsubServices();
      unsubPackages();
      unsubSliders();
      unsubCourses();
      unsubBlogPosts();
      unsubAccreditations();
      unsubPartners();
      unsubOffers();
      unsubTestimonials();
    };
  }, []);

  const authority = useMemo<Record<string, boolean>>(() => {
    const raw = rawSettings.raba_collection_authority;
    return raw && typeof raw === 'object' ? raw : {};
  }, [rawSettings.raba_collection_authority]);

  const modules = useMemo<SiteModulesVisibility>(() => {
    const remote = rawSettings.raba_site_modules_v1;
    if (remote && typeof remote === 'object') {
      return { ...DEFAULT_MODULES_VISIBILITY, ...remote };
    }
    return { ...DEFAULT_MODULES_VISIBILITY };
  }, [rawSettings.raba_site_modules_v1]);

  const siteTheme = useMemo<SiteThemeSettings>(() => {
    const remote = rawSettings.raba_site_theme_v1;
    if (remote && typeof remote === 'object') {
      return { ...DEFAULT_THEME_SETTINGS, ...remote };
    }
    return { ...DEFAULT_THEME_SETTINGS };
  }, [rawSettings.raba_site_theme_v1]);

  const logo = useMemo<SiteLogoSettings>(() => {
    const remote =
      rawSettings.raba_site_logo_v3 ??
      rawSettings.raba_site_logo_v2 ??
      rawSettings.raba_site_logo_v1;
    return normalizeLogo(remote);
  }, [
    rawSettings.raba_site_logo_v3,
    rawSettings.raba_site_logo_v2,
    rawSettings.raba_site_logo_v1,
  ]);

  const social = useMemo<SocialLinksSettings>(() => {
    const remote = rawSettings.raba_social_links_v2 ?? rawSettings.raba_social_links_v1;
    return normalizeSocial(remote);
  }, [rawSettings.raba_social_links_v2, rawSettings.raba_social_links_v1]);

  const footer = useMemo<FooterSettings>(() => {
    const remote = rawSettings.raba_footer_settings_v2 ?? rawSettings.raba_footer_settings_v1;
    return normalizeFooter(remote);
  }, [rawSettings.raba_footer_settings_v2, rawSettings.raba_footer_settings_v1]);

  const pillars = useMemo<ProgramPillarItem[]>(() => {
    const remote = rawSettings.raba_program_pillars_v1;
    if (Array.isArray(remote) && remote.length > 0) {
      return remote
        .map((p: ProgramPillarItem) => ({ ...p, color: normalizePillarColor(p.color) }))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return [...DEFAULT_PROGRAM_PILLARS];
  }, [rawSettings.raba_program_pillars_v1]);

  const announcementBar = useMemo<AnnouncementBarSettings>(() => {
    const remote = rawSettings.raba_announcement_bar_v1;
    if (remote && typeof remote === 'object') {
      return { ...DEFAULT_ANNOUNCEMENT_BAR_SETTINGS, ...remote };
    }
    return { ...DEFAULT_ANNOUNCEMENT_BAR_SETTINGS };
  }, [rawSettings.raba_announcement_bar_v1]);

  const trackingPixels = useMemo<TrackingPixelsConfig>(() => {
    const remote = rawSettings.raba_tracking_pixels ?? rawSettings.raba_tracking_pixels_v1;
    return normalizeTrackingPixels(remote);
  }, [rawSettings.raba_tracking_pixels, rawSettings.raba_tracking_pixels_v1]);

  // --- SLIDERS ---
  const { heroSlides, isAuthoritativeSliders } = useMemo(() => {
    if (loadingSettings || loadingSliders) {
      return { heroSlides: [] as HeroSlideItem[], isAuthoritativeSliders: false };
    }
    const isAuthCol = Boolean(authority.sliders);
    const hasSettingArray = Array.isArray(rawSettings.raba_hero_slides_v2);
    const isAuth = isAuthCol || hasSettingArray || slidersDocs.length > 0;

    if (isAuthCol || slidersDocs.length > 0) {
      return {
        heroSlides: normalizeHeroSlides(slidersDocs, true),
        isAuthoritativeSliders: true,
      };
    }
    if (hasSettingArray) {
      return {
        heroSlides: normalizeHeroSlides(rawSettings.raba_hero_slides_v2, true),
        isAuthoritativeSliders: true,
      };
    }
    return {
      heroSlides: normalizeHeroSlides(undefined, false),
      isAuthoritativeSliders: isAuth,
    };
  }, [loadingSettings, loadingSliders, authority.sliders, rawSettings.raba_hero_slides_v2, slidersDocs]);

  const heroConfig = useMemo<HeroSliderConfig>(() => {
    if (sliderConfigDoc) {
      return { ...DEFAULT_HERO_SLIDER_CONFIG, ...sliderConfigDoc };
    }
    const remote = rawSettings.raba_hero_slider_config_v2;
    if (remote && typeof remote === 'object') {
      return { ...DEFAULT_HERO_SLIDER_CONFIG, ...remote };
    }
    return { ...DEFAULT_HERO_SLIDER_CONFIG };
  }, [sliderConfigDoc, rawSettings.raba_hero_slider_config_v2]);

  // --- SERVICES ---
  const { services, isAuthoritativeServices } = useMemo(() => {
    if (loadingSettings || loadingServices) {
      return { services: [] as ServiceItem[], isAuthoritativeServices: false };
    }
    const isAuthCol = Boolean(authority.services);
    const settingList = rawSettings.raba_custom_services_v2 ?? rawSettings.raba_custom_services_v1;
    const hasSettingArray = Array.isArray(settingList);

    if (isAuthCol || servicesDocs.length > 0) {
      return {
        services: [...servicesDocs].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
        isAuthoritativeServices: true,
      };
    }
    if (hasSettingArray) {
      return {
        services: settingList,
        isAuthoritativeServices: true,
      };
    }
    return {
      services: SERVICES,
      isAuthoritativeServices: false,
    };
  }, [
    loadingSettings,
    loadingServices,
    authority.services,
    rawSettings.raba_custom_services_v2,
    rawSettings.raba_custom_services_v1,
    servicesDocs,
  ]);

  // --- PACKAGES ---
  const { packages, isAuthoritativePackages } = useMemo(() => {
    if (loadingSettings || loadingPackages) {
      return { packages: [] as TherapyPackage[], isAuthoritativePackages: false };
    }
    const isAuthCol = Boolean(authority.packages);
    const settingList = rawSettings.raba_custom_packages_v2;
    const hasSettingArray = Array.isArray(settingList);

    if (isAuthCol || packagesDocs.length > 0) {
      return {
        packages: [...packagesDocs].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
        isAuthoritativePackages: true,
      };
    }
    if (hasSettingArray) {
      return {
        packages: settingList,
        isAuthoritativePackages: true,
      };
    }
    return {
      packages: THERAPY_PACKAGES,
      isAuthoritativePackages: false,
    };
  }, [loadingSettings, loadingPackages, authority.packages, rawSettings.raba_custom_packages_v2, packagesDocs]);

  // --- OFFERS ---
  const { offers, isAuthoritativeOffers } = useMemo(() => {
    if (loadingSettings || loadingOffers) {
      return { offers: [] as OfferData[], isAuthoritativeOffers: false };
    }
    const isAuthCol = Boolean(authority.offers);
    const settingList = rawSettings.raba_offers_data ?? rawSettings.raba_offers_data_v1;
    const hasSettingArray = Array.isArray(settingList);

    if (isAuthCol || offersDocs.length > 0) {
      return {
        offers: offersDocs,
        isAuthoritativeOffers: true,
      };
    }
    if (hasSettingArray) {
      return {
        offers: settingList,
        isAuthoritativeOffers: true,
      };
    }
    return {
      offers: INITIAL_OFFERS,
      isAuthoritativeOffers: false,
    };
  }, [
    loadingSettings,
    loadingOffers,
    authority.offers,
    rawSettings.raba_offers_data,
    rawSettings.raba_offers_data_v1,
    offersDocs,
  ]);

  const branches = useMemo<BranchItem[]>(() => {
    const remote = rawSettings.raba_branches_data_v3 ?? rawSettings.raba_branches_data_v1;
    if (Array.isArray(remote) && remote.length > 0) {
      return remote
        .map((item: BranchItem) => ({
          ...item,
          badgeColorClass: normalizeBranchBadgeClass(item.badgeColorClass),
        }))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return [...BRANCHES_DATA];
  }, [rawSettings.raba_branches_data_v3, rawSettings.raba_branches_data_v1]);

  // --- COURSES ---
  const { courses, isAuthoritativeCourses } = useMemo(() => {
    if (loadingSettings || loadingCourses) {
      return { courses: [] as CourseItem[], isAuthoritativeCourses: false };
    }
    const isAuthCol = Boolean(authority.courses);
    const settingList = rawSettings.raba_courses_data_v1;
    const hasSettingArray = Array.isArray(settingList);

    if (isAuthCol || coursesDocs.length > 0) {
      return {
        courses: normalizeCoursesList(coursesDocs, true),
        isAuthoritativeCourses: true,
      };
    }
    if (hasSettingArray) {
      return {
        courses: normalizeCoursesList(settingList, true),
        isAuthoritativeCourses: true,
      };
    }
    return {
      courses: normalizeCoursesList(undefined, false),
      isAuthoritativeCourses: false,
    };
  }, [loadingSettings, loadingCourses, authority.courses, rawSettings.raba_courses_data_v1, coursesDocs]);

  const coursesSettings = useMemo<CoursesSectionSettings>(() => {
    return normalizeCoursesSettings(rawSettings.raba_courses_settings_v1);
  }, [rawSettings.raba_courses_settings_v1]);

  // --- PARTNERS ---
  const { partners, isAuthoritativePartners } = useMemo(() => {
    if (loadingSettings || loadingPartners) {
      return { partners: [] as PartnerItem[], isAuthoritativePartners: false };
    }
    const isAuthCol = Boolean(authority.partners);
    const settingList = rawSettings.raba_partners_list_v7;
    const hasSettingArray = Array.isArray(settingList);

    if (isAuthCol || partnersDocs.length > 0) {
      return {
        partners: normalizePartnersList(partnersDocs, true),
        isAuthoritativePartners: true,
      };
    }
    if (hasSettingArray) {
      return {
        partners: normalizePartnersList(settingList, true),
        isAuthoritativePartners: true,
      };
    }
    return {
      partners: normalizePartnersList(undefined, false),
      isAuthoritativePartners: false,
    };
  }, [loadingSettings, loadingPartners, authority.partners, rawSettings.raba_partners_list_v7, partnersDocs]);

  const partnersSettings = useMemo<PartnersSliderSettings>(() => {
    const remote = rawSettings.raba_partners_settings_v7;
    if (remote && typeof remote === 'object') {
      return { ...DEFAULT_PARTNERS_SETTINGS, ...remote };
    }
    return { ...DEFAULT_PARTNERS_SETTINGS };
  }, [rawSettings.raba_partners_settings_v7]);

  // --- ACCREDITATIONS ---
  const { accreditations, isAuthoritativeAccreditations } = useMemo(() => {
    if (loadingSettings || loadingAccreditations) {
      return { accreditations: [] as AccreditationItem[], isAuthoritativeAccreditations: false };
    }
    const isAuthCol = Boolean(authority.accreditations);
    const settingList = rawSettings.raba_accreditations;
    const hasSettingArray = Array.isArray(settingList);

    const normalizeAccList = (list: any[]) =>
      list
        .map((item: any, idx: number) => ({
          ...item,
          active: item.active !== undefined ? item.active : true,
          order: item.order !== undefined ? item.order : idx + 1,
          logoType: item.logoType || (item.customLogoUrl ? 'custom' : undefined),
        }))
        .sort((a: AccreditationItem, b: AccreditationItem) => a.order - b.order);

    if (isAuthCol || accreditationsDocs.length > 0) {
      return {
        accreditations: normalizeAccList(accreditationsDocs),
        isAuthoritativeAccreditations: true,
      };
    }
    if (hasSettingArray) {
      return {
        accreditations: normalizeAccList(settingList),
        isAuthoritativeAccreditations: true,
      };
    }
    return {
      accreditations: ACCREDITATIONS_LIST,
      isAuthoritativeAccreditations: false,
    };
  }, [
    loadingSettings,
    loadingAccreditations,
    authority.accreditations,
    rawSettings.raba_accreditations,
    accreditationsDocs,
  ]);

  const accreditationSettings = useMemo<AccreditationsSectionSettings>(() => {
    const remote = rawSettings.raba_accreditations_settings;
    if (remote && typeof remote === 'object') {
      return { ...DEFAULT_ACCREDITATIONS_SETTINGS, ...remote };
    }
    return { ...DEFAULT_ACCREDITATIONS_SETTINGS };
  }, [rawSettings.raba_accreditations_settings]);

  const specialistCardSettings = useMemo<Record<string, SpecialistImageSetting>>(() => {
    const remote =
      rawSettings.raba_specialists_card_customizations ??
      rawSettings.raba_specialists_settings;
    if (remote && typeof remote === 'object') {
      return { ...DEFAULT_SPECIALIST_SETTINGS, ...remote };
    }
    return { ...DEFAULT_SPECIALIST_SETTINGS };
  }, [
    rawSettings.raba_specialists_card_customizations,
    rawSettings.raba_specialists_settings,
  ]);

  const globalCardSettings = useMemo<GlobalCardSettings>(() => {
    const remote = rawSettings.raba_global_card_settings;
    if (remote && typeof remote === 'object') {
      return { ...DEFAULT_GLOBAL_CARD_SETTINGS, ...remote };
    }
    return { ...DEFAULT_GLOBAL_CARD_SETTINGS };
  }, [rawSettings.raba_global_card_settings]);

  const pricingGlobalSettings = useMemo<PricingGlobalSettings>(() => {
    const remote = rawSettings.raba_pricing_global_settings;
    if (remote && typeof remote === 'object') {
      return { ...DEFAULT_PRICING_GLOBAL_SETTINGS, ...remote };
    }
    return { ...DEFAULT_PRICING_GLOBAL_SETTINGS };
  }, [rawSettings.raba_pricing_global_settings]);

  const paymentPublicConfig = useMemo<PaymentPublicConfig>(() => {
    const remote = rawSettings.payment_public_config;
    if (remote && typeof remote === 'object') {
      return {
        ...DEFAULT_PAYMENT_PUBLIC_CONFIG,
        ...remote,
        enabledMethods: {
          ...DEFAULT_PAYMENT_PUBLIC_CONFIG.enabledMethods,
          ...(remote.enabledMethods || {}),
        },
        bankTransfer: {
          ...DEFAULT_BANK_TRANSFER_CONFIG,
          ...(remote.bankTransfer || {}),
        },
        tabby: {
          ...DEFAULT_PAYMENT_PUBLIC_CONFIG.tabby,
          ...(remote.tabby || {}),
        },
        tamara: {
          ...DEFAULT_PAYMENT_PUBLIC_CONFIG.tamara,
          ...(remote.tamara || {}),
        },
      };
    }
    return { ...DEFAULT_PAYMENT_PUBLIC_CONFIG };
  }, [rawSettings.payment_public_config]);

  // --- SPECIALISTS ---
  const { specialists, isAuthoritativeSpecialists } = useMemo(() => {
    if (loadingSettings || loadingSpecialists) {
      return { specialists: [] as Specialist[], isAuthoritativeSpecialists: false };
    }

    const isAuthCol = Boolean(authority.specialists);
    if (isAuthCol) {
      return {
        specialists: deduplicateSpecialists(specialistsDocs),
        isAuthoritativeSpecialists: true,
      };
    }

    const settingList = rawSettings.raba_specialists;
    const docsByNormId = new Map<string, Specialist>();
    for (const docItem of specialistsDocs) {
      if (docItem?.id) {
        docsByNormId.set(normalizeSpecialistId(docItem.id), docItem);
      }
    }

    if (specialistsDocs.length > 0 && !Array.isArray(settingList)) {
      return {
        specialists: deduplicateSpecialists(specialistsDocs),
        isAuthoritativeSpecialists: true,
      };
    }

    if (Array.isArray(settingList)) {
      if (settingList.length === 0 && specialistsDocs.length === 0) {
        return { specialists: [] as Specialist[], isAuthoritativeSpecialists: true };
      }
      const seenNormIds = new Set<string>();
      const merged = settingList.map((s: Specialist) => {
        const normId = normalizeSpecialistId(s.id);
        if (normId) seenNormIds.add(normId);
        const freshDoc = normId ? docsByNormId.get(normId) : undefined;
        return freshDoc ? { ...s, ...freshDoc } : s;
      });
      for (const docItem of specialistsDocs) {
        const normId = normalizeSpecialistId(docItem.id);
        if (normId && !seenNormIds.has(normId)) {
          merged.push(docItem);
        }
      }
      return {
        specialists: deduplicateSpecialists(merged),
        isAuthoritativeSpecialists: true,
      };
    }

    return {
      specialists: deduplicateSpecialists(SPECIALISTS),
      isAuthoritativeSpecialists: false,
    };
  }, [
    loadingSettings,
    loadingSpecialists,
    authority.specialists,
    rawSettings.raba_specialists,
    specialistsDocs,
  ]);

  // --- TESTIMONIALS ---
  const { testimonials, isAuthoritativeTestimonials } = useMemo(() => {
    if (loadingSettings || loadingTestimonials) {
      return { testimonials: [] as ParentReview[], isAuthoritativeTestimonials: false };
    }
    const isAuthCol = Boolean(authority.testimonials);
    const hasSettingArray = Array.isArray(rawSettings.raba_testimonials);

    if (isAuthCol || testimonialsDocs.length > 0) {
      return {
        testimonials: testimonialsDocs,
        isAuthoritativeTestimonials: true,
      };
    }
    if (hasSettingArray) {
      return {
        testimonials: rawSettings.raba_testimonials,
        isAuthoritativeTestimonials: true,
      };
    }
    return {
      testimonials: PARENT_REVIEWS,
      isAuthoritativeTestimonials: false,
    };
  }, [
    loadingSettings,
    loadingTestimonials,
    authority.testimonials,
    rawSettings.raba_testimonials,
    testimonialsDocs,
  ]);

  // --- BLOG POSTS ---
  const { blogPosts, isAuthoritativeBlogPosts } = useMemo(() => {
    if (loadingSettings || loadingBlogPosts) {
      return { blogPosts: [] as BlogPost[], isAuthoritativeBlogPosts: false };
    }
    const isAuthCol = Boolean(authority.blog_posts);
    const hasSettingArray = Array.isArray(rawSettings.raba_blog_posts_v1);
    const isAuth = isAuthCol || hasSettingArray || blogPostsDocs.length > 0;
    return {
      blogPosts: normalizeBlogList(rawSettings.raba_blog_posts_v1, blogPostsDocs, isAuthCol),
      isAuthoritativeBlogPosts: isAuth,
    };
  }, [
    loadingSettings,
    loadingBlogPosts,
    authority.blog_posts,
    rawSettings.raba_blog_posts_v1,
    blogPostsDocs,
  ]);

  // Apply CSS custom properties & browser favicon reactively whenever live Firestore theme/logo changes
  useEffect(() => {
    if (!loadingSettings) {
      applyGlobalTheme(siteTheme);
    }
  }, [loadingSettings, siteTheme]);

  useEffect(() => {
    if (!loadingSettings) {
      updateTabFavicon(logo);
    }
  }, [loadingSettings, logo]);

  const isLoadingAll =
    loadingSettings ||
    loadingSpecialists ||
    loadingServices ||
    loadingPackages ||
    loadingSliders ||
    loadingCourses ||
    loadingBlogPosts ||
    loadingAccreditations ||
    loadingPartners ||
    loadingOffers ||
    loadingTestimonials;

  const value = useMemo<LiveDataContextValue>(
    () => ({
      rawSettings,
      loading: isLoadingAll,
      isLoading: isLoadingAll,
      loadingSettings,
      loadingSpecialists,
      loadingServices,
      loadingPackages,
      loadingSliders,
      loadingCourses,
      loadingBlogPosts,
      loadingAccreditations,
      loadingPartners,
      loadingOffers,
      loadingTestimonials,
      syncErrors,
      isAuthoritativeSpecialists,
      isAuthoritativeServices,
      isAuthoritativePackages,
      isAuthoritativeSliders,
      isAuthoritativeCourses,
      isAuthoritativeBlogPosts,
      isAuthoritativeAccreditations,
      isAuthoritativePartners,
      isAuthoritativeOffers,
      isAuthoritativeTestimonials,
      modules,
      siteTheme,
      logo,
      social,
      footer,
      pillars,
      announcementBar,
      trackingPixels,
      heroSlides,
      heroConfig,
      services,
      packages,
      offers,
      branches,
      courses,
      coursesSettings,
      partners,
      partnersSettings,
      accreditations,
      accreditationSettings,
      specialistCardSettings,
      globalCardSettings,
      pricingGlobalSettings,
      paymentPublicConfig,
      specialists,
      testimonials,
      blogPosts,
    }),
    [
      rawSettings,
      isLoadingAll,
      loadingSettings,
      loadingSpecialists,
      loadingServices,
      loadingPackages,
      loadingSliders,
      loadingCourses,
      loadingBlogPosts,
      loadingAccreditations,
      loadingPartners,
      loadingOffers,
      loadingTestimonials,
      syncErrors,
      isAuthoritativeSpecialists,
      isAuthoritativeServices,
      isAuthoritativePackages,
      isAuthoritativeSliders,
      isAuthoritativeCourses,
      isAuthoritativeBlogPosts,
      isAuthoritativeAccreditations,
      isAuthoritativePartners,
      isAuthoritativeOffers,
      isAuthoritativeTestimonials,
      modules,
      siteTheme,
      logo,
      social,
      footer,
      pillars,
      announcementBar,
      trackingPixels,
      heroSlides,
      heroConfig,
      services,
      packages,
      offers,
      branches,
      courses,
      coursesSettings,
      partners,
      partnersSettings,
      accreditations,
      accreditationSettings,
      specialistCardSettings,
      globalCardSettings,
      pricingGlobalSettings,
      paymentPublicConfig,
      specialists,
      testimonials,
      blogPosts,
    ]
  );

  return <LiveDataContext.Provider value={value}>{children}</LiveDataContext.Provider>;
};

export function useLiveData(): LiveDataContextValue {
  const ctx = useContext(LiveDataContext);
  if (!ctx) {
    throw new Error('useLiveData must be used within a <LiveDataProvider>');
  }
  return ctx;
}

export function useLiveDataOptional(): LiveDataContextValue | null {
  return useContext(LiveDataContext);
}

/**
 * Convenience hook returning fallback-safe live defaults even if rendered outside provider.
 */
export function useLiveModules(): SiteModulesVisibility {
  const ctx = useLiveDataOptional();
  return ctx ? ctx.modules : DEFAULT_MODULES_VISIBILITY;
}

/**
 * Convenience hook returning live public payment gateway settings (non-secret).
 */
export function usePaymentPublicConfig(): PaymentPublicConfig {
  const ctx = useLiveDataOptional();
  return ctx ? ctx.paymentPublicConfig : DEFAULT_PAYMENT_PUBLIC_CONFIG;
}
