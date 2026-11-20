import { savePersistentModule } from '../utils/persistentSync';
import { BUNDLED_PARTNER_LOGOS } from './partnerLogosBundle';

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
  cardCoverUrl?: string;
  imageFit?: 'contain' | 'cover' | 'fill';
  imagePadding?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  logoScale?: number;
  canvasHeight?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  expandImageToEdges?: boolean;
  imageBgColor?: string;
  cardStyle?: 'standard' | 'glow' | 'accent-border';
  websiteUrl?: string;
  accentColor?: string;
  sector?: 'government' | 'academic' | 'health' | 'corporate';
  description?: string;
  descriptionEn?: string;
  isActive?: boolean;
  order?: number;
}

export interface PartnersSliderSettings {
  displayMode: 'auto' | 'logo' | 'monogram';
  speedSeconds: number;
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
  speedSeconds: 32,
  showBadges: true,
  sectionTitleAr: 'شركاؤنا في مسيرة النجاح والتمكين',
  sectionTitleEn: 'Our Strategic Partners in Care & Empowerment',
  sectionSubtitleAr: 'تحالفات استراتيجية مع كبرى الوزارات والهيئات الحكومية والمؤسسات الأكاديمية والشركات الوطنية لتقديم أفضل مسارات الرعاية والتأهيل والدمج الشامل.',
  sectionSubtitleEn: 'Proud strategic alliances with leading governmental ministries, authorities, academic universities, and national corporations.',
  badgeTextAr: 'شركاء النجاح والتميز المؤسسي',
  badgeTextEn: 'SUCCESS PARTNERS & ALLIANCES'
};

export const DEFAULT_PARTNERS: PartnerItem[] = [
  {
    id: "partner-moi",
    name: "وزارة الداخلية",
    nameEn: "Ministry of Interior",
    letter: "د",
    category: "القطاع الحكومي والأمني",
    categoryEn: "Government & Security Sector",
    badge: "شريك حكومي",
    badgeEn: "Government Partner",
    sector: "government",
    accentColor: "#006C35",
    logoUrl: "/images/partners/partner-moi_custom.png",
    logoScale: 125,
    canvasHeight: "md",
    expandImageToEdges: false,
    imageFit: "contain",
    imagePadding: "md",
    imageBgColor: "#ffffff",
    cardStyle: "standard",
    cardCoverUrl: "",
    websiteUrl: "",
    description: "شراكة وتعاون مؤسسي لخدمة وتأهيل ورعاية أبناء ومنسوبي القطاع.",
    descriptionEn: "Institutional collaboration serving and supporting beneficiaries and staff.",
    isActive: true,
  },
  {
    id: "partner-state-security",
    name: "رئاسة أمن الدولة",
    nameEn: "Presidency of State Security",
    letter: "أ",
    category: "القطاع الحكومي والوطني",
    categoryEn: "State Security & National Sector",
    badge: "شريك استراتيجي",
    badgeEn: "Strategic Partner",
    sector: "government",
    accentColor: "#16A34A",
    logoUrl: "/images/partners/partner-state-security_custom.png",
    logoScale: 130,
    canvasHeight: "md",
    expandImageToEdges: false,
    imageFit: "contain",
    imagePadding: "md",
    imageBgColor: "transparent",
    cardStyle: "standard",
    cardCoverUrl: "",
    websiteUrl: "",
    description: "تعاون رسمي لتقديم برامج الرعاية النمائية والتدخل المبكر المعتمدة.",
    descriptionEn: "Official cooperation offering accredited developmental care and early intervention.",
    isActive: true,
  },
  {
    id: "partner-national-guard",
    name: "وزارة الحرس الوطني",
    nameEn: "Ministry of National Guard",
    letter: "ح",
    category: "القطاع الحكومي والوطني",
    categoryEn: "National Government Sector",
    badge: "شريك وطني",
    badgeEn: "National Partner",
    sector: "government",
    accentColor: "#15803D",
    logoUrl: "/images/partners/partner-national-guard_custom.png",
    logoScale: 125,
    canvasHeight: "md",
    expandImageToEdges: false,
    imageFit: "contain",
    imagePadding: "md",
    imageBgColor: "transparent",
    cardStyle: "standard",
    cardCoverUrl: "",
    websiteUrl: "",
    description: "اتفاقية تعاون لتقديم خدمات التأهيل المتخصصة لأطفال ومنسوبي الحرس الوطني.",
    descriptionEn: "Cooperation framework providing specialized rehabilitation services.",
    isActive: true,
  },
  {
    id: "partner-mngha",
    name: "وزارة الحرس الوطني - الشؤون الصحية",
    nameEn: "Ministry of National Guard Health Affairs (MNGHA)",
    letter: "ص",
    category: "الرعاية الطبية والإحالات التخصصية",
    categoryEn: "Specialized Medical Care & Clinical Referrals",
    badge: "قطاع صحي حكومي",
    badgeEn: "Government Healthcare",
    sector: "health",
    accentColor: "#DC2626",
    logoUrl: "/images/partners/partner-mngha_custom.png",
    logoScale: 125,
    canvasHeight: "md",
    expandImageToEdges: false,
    imageFit: "contain",
    imagePadding: "md",
    imageBgColor: "#ffffff",
    cardStyle: "standard",
    cardCoverUrl: "",
    websiteUrl: "",
    description: "تكامل صحي إكلينيكي في تقييم اضطرابات طيف التوحد والنمو وإحالات التأهيل.",
    descriptionEn: "Clinical integration for autism evaluation and developmental rehabilitation.",
    isActive: true,
  },
  {
    id: "partner-misa",
    name: "وزارة الاستثمار",
    nameEn: "Ministry of Investment (MISA)",
    letter: "ا",
    category: "تمكين وتطوير بيئة الرعاية",
    categoryEn: "Investment & Care Enablement",
    badge: "تمكين مؤسسي",
    badgeEn: "Institutional Enablement",
    sector: "government",
    accentColor: "#006A4E",
    logoUrl: "/images/partners/partner-misa_custom.png",
    logoScale: 150,
    canvasHeight: "md",
    expandImageToEdges: false,
    imageFit: "contain",
    imagePadding: "md",
    imageBgColor: "#ffffff",
    cardStyle: "standard",
    cardCoverUrl: "",
    websiteUrl: "",
    description: "دعم الاستثمار في منظومة مراكز التأهيل التخصصية وفق رؤية المملكة 2030.",
    descriptionEn: "Supporting specialized rehabilitation center enablement under Vision 2030.",
    isActive: true,
  },
  {
    id: "partner-mewa",
    name: "وزارة البيئة والمياه والزراعة",
    nameEn: "Ministry of Environment, Water & Agriculture",
    letter: "ب",
    category: "المسؤولية المجتمعية والرعاية",
    categoryEn: "Corporate Social Responsibility & Care",
    badge: "قطاع حكومي",
    badgeEn: "Government Sector",
    sector: "government",
    accentColor: "#0C7844",
    logoUrl: "/images/partners/partner-mewa_custom.png",
    logoScale: 125,
    canvasHeight: "md",
    expandImageToEdges: false,
    imageFit: "contain",
    imagePadding: "md",
    imageBgColor: "#ffffff",
    cardStyle: "standard",
    cardCoverUrl: "",
    websiteUrl: "",
    description: "شراكة مجتمعية مستدامة لتوفير برامج الرعاية لأسر ومنسوبي الوزارة.",
    descriptionEn: "Sustainable community partnership delivering care programs to staff and families.",
    isActive: true,
  },
  {
    id: "partner-dgda",
    name: "هيئة تطوير بوابة الدرعية",
    nameEn: "Diriyah Gate Development Authority (DGDA)",
    letter: "د",
    category: "تنمية مجتمعية واستدامة وطنية",
    categoryEn: "Community Development & Heritage",
    badge: "تنمية وطنية",
    badgeEn: "National Development",
    sector: "government",
    accentColor: "#10B981",
    logoUrl: "/images/partners/partner-dgda_custom.png",
    logoScale: 140,
    canvasHeight: "md",
    expandImageToEdges: false,
    imageFit: "contain",
    imagePadding: "md",
    imageBgColor: "#ffffff",
    cardStyle: "standard",
    cardCoverUrl: "",
    websiteUrl: "",
    description: "مبادرات دمج وتأهيل وتمكين الأطفال ذوي الإعاقة ضمن برامج المجتمع المحلي.",
    descriptionEn: "Inclusive community initiatives integrating children of determination.",
    isActive: true,
  },
  {
    id: "partner-sba",
    name: "هيئة الإذاعة والتلفزيون",
    nameEn: "Saudi Broadcasting Authority (SBA)",
    letter: "إ",
    category: "التوعية الإعلامية والمجتمعية",
    categoryEn: "Media & Community Awareness",
    badge: "شريك إعلامي",
    badgeEn: "Media Partner",
    sector: "corporate",
    accentColor: "#3B82F6",
    logoUrl: "/images/partners/partner-sba_custom.png",
    logoScale: 130,
    canvasHeight: "md",
    expandImageToEdges: false,
    imageFit: "contain",
    imagePadding: "md",
    imageBgColor: "#ffffff",
    cardStyle: "standard",
    cardCoverUrl: "",
    websiteUrl: "",
    description: "شريك التوعية الإعلامية بقضايا التوحد والتدخل المبكر ونشر المعرفة التخصصية.",
    descriptionEn: "Official media partner advancing autism awareness and developmental education.",
    isActive: true,
  },
  {
    id: "partner-ksu",
    name: "جامعة الملك سعود",
    nameEn: "King Saud University (KSU)",
    letter: "س",
    category: "أبحاث وتدريب وتأهيل إكلينيكي",
    categoryEn: "Academic & Clinical Training Partner",
    badge: "شريك أكاديمي",
    badgeEn: "Academic Partner",
    sector: "academic",
    accentColor: "#0082C8",
    logoUrl: "/images/partners/partner-ksu_custom.png",
    logoScale: 150,
    canvasHeight: "md",
    expandImageToEdges: false,
    imageFit: "contain",
    imagePadding: "md",
    imageBgColor: "#ffffff",
    cardStyle: "standard",
    cardCoverUrl: "",
    websiteUrl: "",
    description: "شراكة أكاديمية وبحثية وتدريب كوادر التربية الخاصة والتحليل السلوكي وعلاج النطق.",
    descriptionEn: "Academic and clinical training partnership empowering certified clinicians.",
    isActive: true,
  },
  {
    id: "partner-stc",
    name: "شركة الاتصالات السعودية",
    nameEn: "stc - Saudi Telecom Company",
    letter: "ت",
    category: "التمكين الرقمي والمسؤولية المجتمعية",
    categoryEn: "Digital & Social Enablement",
    badge: "تمكين مجتمعي",
    badgeEn: "Digital Enablement",
    sector: "corporate",
    accentColor: "#4F008C",
    logoUrl: "/images/partners/partner-stc_custom.png",
    logoScale: 150,
    canvasHeight: "md",
    expandImageToEdges: false,
    imageFit: "contain",
    imagePadding: "md",
    imageBgColor: "#ffffff",
    cardStyle: "standard",
    cardCoverUrl: "",
    websiteUrl: "",
    description: "شراكة المسؤولية المجتمعية ودعم التحول الرقمي في خدمات التأهيل والتقييم.",
    descriptionEn: "CSR collaboration advancing digital inclusion and modern clinical tools.",
    isActive: true,
  },
  {
    id: "partner-diriyah",
    name: "شركة الدرعية",
    nameEn: "Diriyah Company",
    letter: "د",
    category: "مبادرات الرعاية والتمكين المجتمعي",
    categoryEn: "Community Empowerment & Inclusion",
    badge: "شريك استراتيجي",
    badgeEn: "Strategic Partner",
    sector: "corporate",
    accentColor: "#A26848",
    logoUrl: "/images/partners/partner-diriyah_custom.png",
    logoScale: 125,
    canvasHeight: "md",
    expandImageToEdges: false,
    imageFit: "contain",
    imagePadding: "md",
    imageBgColor: "#ffffff",
    cardStyle: "standard",
    cardCoverUrl: "",
    websiteUrl: "",
    description: "شراكة مجتمعية لدعم برامج دمج الأطفال ذوي الاحتياجات الخاصة في الأنشطة الثقافية.",
    descriptionEn: "Strategic partnership promoting inclusive access in historic and cultural spaces.",
    isActive: true,
  },
  {
    id: "partner-el-seif",
    name: "مجموعة السيف",
    nameEn: "El Seif Group",
    letter: "س",
    category: "المسؤولية الاجتماعية للشركات",
    categoryEn: "Corporate Social Responsibility (CSR)",
    badge: "مسؤولية مجتمعية",
    badgeEn: "CSR Partner",
    sector: "corporate",
    accentColor: "#C8102E",
    logoUrl: "/images/partners/partner-el-seif_custom.png",
    logoScale: 125,
    canvasHeight: "md",
    expandImageToEdges: false,
    imageFit: "contain",
    imagePadding: "md",
    imageBgColor: "#ffffff",
    cardStyle: "standard",
    cardCoverUrl: "",
    websiteUrl: "",
    description: "مساهمة وطنية مستمرة في رعاية برامج التأهيل ودعم الفصول التجهيزية.",
    descriptionEn: "Active corporate contribution sponsoring specialized sensory and learning rooms.",
    isActive: true,
  },
  {
    id: "partner-emkan",
    name: "شركة إمكان للتمويل",
    nameEn: "Emkan Finance",
    letter: "م",
    category: "حلول التمويل والتيسير المالي",
    categoryEn: "Financial Enablement & Care Solutions",
    badge: "حلول تمويلية",
    badgeEn: "Financial Solutions",
    sector: "corporate",
    accentColor: "#2DD4BF",
    logoUrl: "/images/partners/partner-emkan_custom.png",
    logoScale: 125,
    canvasHeight: "md",
    expandImageToEdges: false,
    imageFit: "contain",
    imagePadding: "md",
    imageBgColor: "#ffffff",
    cardStyle: "standard",
    cardCoverUrl: "",
    websiteUrl: "",
    description: "توفير خيارات تمويل ميسرة ومرنة للباقات التأهيلية والبرامج العلاجية المكثفة.",
    descriptionEn: "Flexible financing solutions making intensive therapy packages accessible.",
    isActive: true,
  },
  {
    id: "partner-tamara",
    name: "تمارا",
    nameEn: "Tamara",
    letter: "ت",
    category: "السداد والتقسيط الميسر",
    categoryEn: "Flexible Installments & BNPL",
    badge: "تقسيط ميسر",
    badgeEn: "Installment Partner",
    sector: "corporate",
    accentColor: "#F97316",
    logoUrl: "/images/partners/partner-tamara_custom.png",
    logoScale: 125,
    canvasHeight: "md",
    expandImageToEdges: false,
    imageFit: "contain",
    imagePadding: "md",
    imageBgColor: "#ffffff",
    cardStyle: "standard",
    cardCoverUrl: "",
    websiteUrl: "",
    description: "تقسيط جلسات وبرامج التأهيل بدون فوائد ولا رسوم إضافية تيسيراً على أولياء الأمور.",
    descriptionEn: "Zero-interest installment options for therapy sessions and evaluation programs.",
    isActive: true,
  },
  {
    id: "partner-autism-families",
    name: "جمعية أسر التوحد",
    nameEn: "Autism Families Association",
    letter: "ت",
    category: "القطاع غير الربحي وتمكين الأسر",
    categoryEn: "Non-Profit & Autism Family Support",
    badge: "قطاع غير ربحي",
    badgeEn: "Non-Profit Partner",
    sector: "health",
    accentColor: "#0F4C81",
    logoUrl: "/images/partners/autism_families.svg",
    logoScale: 115,
    canvasHeight: "md",
    expandImageToEdges: false,
    imageFit: "contain",
    imagePadding: "md",
    imageBgColor: "#ffffff",
    cardStyle: "standard",
    cardCoverUrl: "",
    websiteUrl: "",
    description: "تحالف استراتيجي لتمكين أسر ذوي التوحد وتقديم الإرشاد الأسري والخدمات المساندة.",
    descriptionEn: "Strategic alliance empowering families through counseling and advocacy.",
    isActive: true,
  },
  {
    id: "partner-itizaz",
    name: "برنامج اعتزاز",
    nameEn: "I'tizaz Program",
    letter: "ع",
    category: "البرامج والمبادرات الوطنية",
    categoryEn: "National Recognition & Welfare",
    badge: "مبادرة وطنية",
    badgeEn: "National Initiative",
    sector: "government",
    accentColor: "#203A30",
    logoUrl: "/images/partners/partner-itizaz_custom.png",
    logoScale: 125,
    canvasHeight: "md",
    expandImageToEdges: false,
    imageFit: "contain",
    imagePadding: "md",
    imageBgColor: "#ffffff",
    cardStyle: "standard",
    cardCoverUrl: "",
    websiteUrl: "",
    description: "برنامج خصومات ورعاية خاصة لمنسوبي القطاعات الحكومية والمستفيدين المعتمدين.",
    descriptionEn: "Dedicated privileges and discounted rehabilitation packages for members.",
    isActive: true,
  },
  {
    id: "partner-faisaliah",
    name: "مدارس الفيصلية الأهلية - جدة",
    nameEn: "Al-Faisaliya Private Schools - Jeddah",
    letter: "ف",
    category: "الدمج المدرسي الشامل والتعليم",
    categoryEn: "School Inclusion & Shadow Teacher",
    badge: "شريك تعليمي",
    badgeEn: "Educational Partner",
    sector: "academic",
    accentColor: "#0B2341",
    logoUrl: "/images/partners/partner-faisaliah_custom.png",
    logoScale: 110,
    canvasHeight: "md",
    expandImageToEdges: false,
    imageFit: "contain",
    imagePadding: "md",
    imageBgColor: "#ffffff",
    cardStyle: "standard",
    cardCoverUrl: "",
    websiteUrl: "",
    description: "تطبيق نموذج الدمج الصفي الشامل وتوفير وتدريب معلمات ومعلمي الظل المتخصصين.",
    descriptionEn: "Classroom inclusion models and certified shadow teacher training.",
    isActive: true,
  },
  {
    id: "partner-rais",
    name: "مدارس رياض المعارف الدولية (RAIS)",
    nameEn: "Riyadh Al Maarif International Schools (RAIS)",
    letter: "ر",
    category: "التعليم الدولي وتطوير المهارات",
    categoryEn: "International Education & Inclusion",
    badge: "تعليم دولي",
    badgeEn: "International School",
    sector: "academic",
    accentColor: "#004098",
    logoUrl: "/images/partners/partner-rais_custom.png",
    logoScale: 150,
    canvasHeight: "md",
    expandImageToEdges: false,
    imageFit: "contain",
    imagePadding: "md",
    imageBgColor: "#ffffff",
    cardStyle: "standard",
    cardCoverUrl: "",
    websiteUrl: "",
    description: "برامج الدمج الأكاديمي للطلاب وتوفير البيئة التعليمية المهيأة لنمو الطفل.",
    descriptionEn: "Inclusive academic curricula and supportive school environment.",
    isActive: true,
  },
  {
    id: "partner-roaya",
    name: "شركة رؤيا",
    nameEn: "Roaya Company",
    letter: "ر",
    category: "حلول التأهيل والاستشارات",
    categoryEn: "Rehabilitation Consulting & Solutions",
    badge: "استشارات متخصصة",
    badgeEn: "Consulting Partner",
    sector: "corporate",
    accentColor: "#C59B27",
    logoUrl: "/images/partners/roaya_company.svg",
    logoScale: 125,
    canvasHeight: "md",
    expandImageToEdges: false,
    imageFit: "contain",
    imagePadding: "md",
    imageBgColor: "#ffffff",
    cardStyle: "standard",
    cardCoverUrl: "",
    websiteUrl: "",
    description: "شريك تطوير الأنظمة التأهيلية والمناهج التطويرية الموجهة لذوي الاحتياجات الخاصة.",
    descriptionEn: "Development of therapeutic curricula and specialized learning models.",
    isActive: true,
  },
  {
    id: "partner-delta",
    name: "مختبرات دلتا الطبية",
    nameEn: "Delta Medical Laboratories",
    letter: "د",
    category: "التحاليل الطبية والجينات النمائية",
    categoryEn: "Clinical Genetics & Diagnostic Labs",
    badge: "شريك تشخيصي",
    badgeEn: "Diagnostic Partner",
    sector: "health",
    accentColor: "#1E3A8A",
    logoUrl: "/images/partners/partner-delta_custom.png",
    logoScale: 180,
    canvasHeight: "md",
    expandImageToEdges: false,
    imageFit: "contain",
    imagePadding: "md",
    imageBgColor: "#ffffff",
    cardStyle: "standard",
    cardCoverUrl: "",
    websiteUrl: "",
    description: "فحوصات طبية ومخبرية متقدمة تدعم التشخيص النمائي والحسي الدقيق.",
    descriptionEn: "Advanced clinical genetics and laboratory tests supporting diagnosis.",
    isActive: true,
  },
  {
    id: "partner-my-character",
    name: "مركز شخصيتي",
    nameEn: "My Character Center",
    letter: "ش",
    category: "التقييم النمائي والسلوكي والنفسي",
    categoryEn: "Psychological & Behavioral Assessment",
    badge: "تقييم وتشخيص",
    badgeEn: "Assessment Partner",
    sector: "health",
    accentColor: "#0284C7",
    logoUrl: "/images/partners/partner-my-character_custom.png",
    logoScale: 130,
    canvasHeight: "md",
    expandImageToEdges: false,
    imageFit: "cover",
    imagePadding: "md",
    imageBgColor: "#ffffff",
    cardStyle: "standard",
    cardCoverUrl: "",
    websiteUrl: "",
    description: "تطبيق مقاييس الذكاء واختبارات السلوك التكيفي وبناء الخطط الفردية المتكاملة.",
    descriptionEn: "Standardized psychological batteries, psychometrics, and adaptive behavioral scales.",
    isActive: true,
  },
];

export const STORAGE_KEY_PARTNERS = 'raba_partners_list_v7';
export const STORAGE_KEY_SETTINGS = 'raba_partners_settings_v7';

export function getStoredPartners(): PartnerItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PARTNERS);
    if (!raw) {
      return DEFAULT_PARTNERS.map(p => ({
        ...p,
        logoUrl: BUNDLED_PARTNER_LOGOS[p.id] || p.logoUrl
      }));
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return DEFAULT_PARTNERS.map(p => ({
        ...p,
        logoUrl: BUNDLED_PARTNER_LOGOS[p.id] || p.logoUrl
      }));
    }
    if (parsed.length === 0) {
      return [];
    }
    // Automatically sanitize and guarantee bundled inlined logos only when no custom logoUrl is saved
    let modified = false;
    const sanitized = parsed.map((p: PartnerItem) => {
      const bundled = BUNDLED_PARTNER_LOGOS[p.id];
      if (p.logoUrl && p.logoUrl.startsWith('data:') && !bundled) {
        modified = true;
        return {
          ...p,
          logoUrl: p.id === 'partner-tamara'
            ? '/images/partners/partner-tamara_custom.webp'
            : p.id === 'partner-rais'
              ? '/images/partners/partner-rais_custom.webp'
              : `/images/partners/${p.id}_custom.webp`
        };
      }
      return {
        ...p,
        logoUrl: p.logoUrl || bundled || `/images/partners/${p.id}_custom.webp`
      };
    });
    if (modified) {
      try {
        localStorage.setItem(STORAGE_KEY_PARTNERS, JSON.stringify(sanitized));
      } catch {}
    }
    return sanitized;
  } catch {
    return DEFAULT_PARTNERS.map(p => ({
      ...p,
      logoUrl: BUNDLED_PARTNER_LOGOS[p.id] || p.logoUrl
    }));
  }
}

export function saveStoredPartners(partners: PartnerItem[]): void {
  try {
    const stringified = JSON.stringify(partners);
    localStorage.setItem(STORAGE_KEY_PARTNERS, stringified);
    localStorage.setItem('raba_partners_list_v6', stringified);
    localStorage.setItem('raba_partners_list_v5', stringified);

    savePersistentModule(STORAGE_KEY_PARTNERS, partners);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('raba_partners_updated', { detail: partners }));
    }
  } catch (err) {
    console.error('Failed to save partners:', err);
  }
}

export function getStoredPartnersSettings(): PartnersSliderSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_PARTNERS_SETTINGS;
    return { ...DEFAULT_PARTNERS_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PARTNERS_SETTINGS;
  }
}

export function saveStoredPartnersSettings(settings: PartnersSliderSettings): void {
  try {
    const stringified = JSON.stringify(settings);
    localStorage.setItem(STORAGE_KEY_SETTINGS, stringified);
    localStorage.setItem('raba_partners_settings_v6', stringified);

    savePersistentModule(STORAGE_KEY_SETTINGS, settings);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('raba_partners_settings_updated', { detail: settings }));
    }
  } catch (err) {
    console.error('Failed to save partners settings:', err);
  }
}
