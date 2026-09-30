import { savePersistentModule } from '../utils/persistentSync';

export interface PartnerItem {
  id: string;
  name: string;
  nameEn: string;
  letter: string;
  category: string;
  categoryEn: string;
  badge?: string;
  badgeEn?: string;
  logoUrl?: string;
  websiteUrl?: string;
  accentColor?: string;
  isActive?: boolean;
}

export interface PartnersSliderSettings {
  displayMode: 'auto' | 'logo' | 'monogram'; // 'auto' shows logo if uploaded, monogram otherwise
  speedSeconds: number; // e.g. 25 to 60
  showBadges: boolean;
  sectionTitleAr: string;
  sectionTitleEn: string;
  sectionSubtitleAr: string;
  sectionSubtitleEn: string;
  badgeTextAr: string;
  badgeTextEn: string;
}

export const DEFAULT_PARTNERS_SETTINGS: PartnersSliderSettings = {
  displayMode: 'auto',
  speedSeconds: 35,
  showBadges: true,
  sectionTitleAr: 'شركاؤنا في مسيرة النجاح والتمكين',
  sectionTitleEn: 'Our Partners in Success & Empowerment',
  sectionSubtitleAr: 'نفخر بشراكاتنا الاستراتيجية مع كبرى القطاعات الحكومية والأكاديمية والصحية والتعليمية لتقديم أفضل برامج الرعاية والتأهيل والدمج.',
  sectionSubtitleEn: 'Proud strategic alliances with leading governmental, academic, healthcare, and educational institutions.',
  badgeTextAr: 'شركاء النجاح والتميز',
  badgeTextEn: 'SUCCESS PARTNERS & ALLIANCES'
};

export const DEFAULT_PARTNERS: PartnerItem[] = [
  {
    id: 'partner-nafea',
    name: 'برنامج نافع',
    nameEn: 'Nafia Program',
    letter: 'ن',
    category: 'مبادرات تمكين ودعم مجتمعي',
    categoryEn: 'Community Enablement Initiatives',
    badge: 'برنامج معتمد',
    badgeEn: 'Accredited Program',
    accentColor: '#0F766E',
    logoUrl: '/images/partners/nafea_program.svg',
    isActive: true
  },
  {
    id: 'partner-ksu',
    name: 'جامعة الملك سعود',
    nameEn: 'King Saud University',
    letter: 'س',
    category: 'شريك أكاديمي وتدريب وتأهيل',
    categoryEn: 'Academic & Clinical Training Partner',
    badge: 'شريك أكاديمي',
    badgeEn: 'Academic Partner',
    accentColor: '#0082C8',
    logoUrl: '/images/partners/ksu.svg',
    isActive: true
  },
  {
    id: 'partner-mngha',
    name: 'وزارة الحرس الوطني - الشؤون الصحية',
    nameEn: 'Ministry of National Guard Health Affairs (MNGHA)',
    letter: 'ح',
    category: 'رعاية طبية وإحالات تخصصية',
    categoryEn: 'Medical Care & Specialized Referrals',
    badge: 'قطاع صحي حكومي',
    badgeEn: 'Government Healthcare',
    accentColor: '#991B1B',
    logoUrl: '/images/partners/mngha.svg',
    isActive: true
  },
  {
    id: 'partner-mewa',
    name: 'وزارة البيئة والمياه والزراعة',
    nameEn: 'Ministry of Environment, Water & Agriculture',
    letter: 'ب',
    category: 'شراكة مؤسسية ومسؤولية مجتمعية',
    categoryEn: 'Institutional & CSR Partnership',
    badge: 'قطاع حكومي',
    badgeEn: 'Government Sector',
    accentColor: '#15803D',
    logoUrl: '/images/partners/mewa.svg',
    isActive: true
  },
  {
    id: 'partner-sba',
    name: 'هيئة الإذاعة والتلفزيون',
    nameEn: 'Saudi Broadcasting Authority (SBA)',
    letter: 'إ',
    category: 'شريك التوعية الإعلامية والمجتمعية',
    categoryEn: 'Media & Awareness Partner',
    badge: 'شريك إعلامي',
    badgeEn: 'Media Partner',
    accentColor: '#1E3A8A',
    logoUrl: '/images/partners/sba.svg',
    isActive: true
  },
  {
    id: 'partner-faisaliah',
    name: 'مدارس الفيصلية الأهلية',
    nameEn: 'Al Faisaliah Private Schools',
    letter: 'ف',
    category: 'الدمج المدرسي ومعلم الظل (سِوار)',
    categoryEn: 'School Inclusion & Shadow Teacher',
    badge: 'شريك تعليمي',
    badgeEn: 'Educational Partner',
    accentColor: '#0284C7',
    logoUrl: '/images/partners/faisaliah_schools.svg',
    isActive: true
  },
  {
    id: 'partner-delta',
    name: 'مختبرات دلتا الطبية',
    nameEn: 'Delta Medical Laboratories',
    letter: 'د',
    category: 'فحوصات وتحاليل طبية وتشخيصية',
    categoryEn: 'Medical Diagnostics & Clinical Lab',
    badge: 'شريك تشخيصي',
    badgeEn: 'Diagnostic Partner',
    accentColor: '#2E2A72',
    logoUrl: '/images/partners/delta_labs.svg',
    isActive: true
  },
  {
    id: 'partner-dgda',
    name: 'هيئة تطوير بوابة الدرعية',
    nameEn: 'Diriyah Gate Development Authority (DGDA)',
    letter: 'د',
    category: 'شراكة مجتمعية واستدامة وطنية',
    categoryEn: 'Community Partnership & Heritage',
    badge: 'شريك وطني',
    badgeEn: 'National Partner',
    accentColor: '#006B4D',
    logoUrl: '/images/partners/dgda.svg',
    isActive: true
  },
  {
    id: 'partner-elseif',
    name: 'شركة السيف مهندسون مقاولون',
    nameEn: 'El Seif Engineering Contracting',
    letter: 'س',
    category: 'المسؤولية الاجتماعية ودعم التأهيل',
    categoryEn: 'Corporate Social Responsibility (CSR)',
    badge: 'مسؤولية مجتمعية',
    badgeEn: 'CSR Partner',
    accentColor: '#DC2626',
    logoUrl: '/images/partners/el_seif.svg',
    isActive: true
  },
  {
    id: 'partner-diriyah',
    name: 'شركة الدرعية',
    nameEn: 'Diriyah Company',
    letter: 'د',
    category: 'مبادرات التمكين المجتمعي والرعاية',
    categoryEn: 'Community Empowerment & Inclusion',
    badge: 'شريك استراتيجي',
    badgeEn: 'Strategic Partner',
    accentColor: '#9A3412',
    logoUrl: '/images/partners/diriyah_company.svg',
    isActive: true
  },
  {
    id: 'partner-autism-alkharj',
    name: 'جمعية أسر التوحد - الخرج',
    nameEn: 'Autism Families Association - Al Kharj',
    letter: 'ت',
    category: 'تمكين الأسر والدعم الأسري المتخصص',
    categoryEn: 'Family Empowerment & Autism Support',
    badge: 'قطاع غير ربحي',
    badgeEn: 'Non-Profit Partner',
    accentColor: '#005A9C',
    logoUrl: '/images/partners/autism_families_alkharj.svg',
    isActive: true
  }
];

export const STORAGE_KEY_PARTNERS = 'raba_partners_list_v5';
export const STORAGE_KEY_SETTINGS = 'raba_partners_settings_v5';

export function getStoredPartners(): PartnerItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PARTNERS) || localStorage.getItem('raba_partners_list_v4');
    if (!raw) return DEFAULT_PARTNERS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_PARTNERS;
    }
    // Auto-migrate from old placeholder stock photos
    const hasOldUnsplash = parsed.some((p: PartnerItem) => p.logoUrl && p.logoUrl.includes('unsplash'));
    if (hasOldUnsplash) {
      localStorage.setItem(STORAGE_KEY_PARTNERS, JSON.stringify(DEFAULT_PARTNERS));
      return DEFAULT_PARTNERS;
    }
    const active = parsed.filter((p: PartnerItem) => p.isActive !== false);
    if (active.length === 0) {
      return DEFAULT_PARTNERS;
    }
    return parsed;
  } catch {
    return DEFAULT_PARTNERS;
  }
}

export function saveStoredPartners(partners: PartnerItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PARTNERS, JSON.stringify(partners));
    window.dispatchEvent(new CustomEvent('raba_partners_updated', { detail: partners }));
    savePersistentModule(STORAGE_KEY_PARTNERS, partners);
  } catch (err) {
    console.error('Error saving partners:', err);
  }
}

export function getStoredPartnersSettings(): PartnersSliderSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_PARTNERS_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PARTNERS_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_PARTNERS_SETTINGS;
  }
}

export function saveStoredPartnersSettings(settings: PartnersSliderSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('raba_partners_settings_updated', { detail: settings }));
    savePersistentModule(STORAGE_KEY_SETTINGS, settings);
  } catch (err) {
    console.error('Error saving partners settings:', err);
  }
}
