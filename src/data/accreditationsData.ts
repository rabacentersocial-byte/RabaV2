export interface AccreditationsSectionSettings {
  subtitleAr: string;
  subtitleEn: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  showAccentBar: boolean;
  accentBarColor: string;
}

export interface AccreditationItem {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  issuerAr: string;
  issuerEn: string;
  category: 'international' | 'local' | 'insurance' | 'behavioral';
  descriptionAr: string;
  descriptionEn: string;
  badgeTextAr: string;
  badgeTextEn: string;
  verified: boolean;
  active: boolean;
  order: number;
  logoType?: 'iso-9001' | 'ibao' | 'qaba' | 'bacb' | 'chi-daman' | 'cbahi' | 'custom' | string;
  customLogoUrl?: string;
  certificateNumber?: string;
  validUntil?: string;
}

export const DEFAULT_ACCREDITATIONS_SETTINGS: AccreditationsSectionSettings = {
  subtitleAr: 'اعتمادات وشهادات',
  subtitleEn: 'Accreditations & Certifications',
  titleAr: 'معترف بنا من',
  titleEn: 'Recognized & Accredited By',
  descriptionAr: 'يلتزم مركز رابا بأرفع المعايير الدولية والوطنية في تقديم خدمات تحليل السلوك التطبيقي (ABA) والتأهيل الشامل.',
  descriptionEn: 'Raba Center complies with premier international and national benchmarks in Applied Behavior Analysis and pediatric therapy.',
  showAccentBar: true,
  accentBarColor: 'bg-amber-500'
};


export const ACCREDITATIONS_LIST: AccreditationItem[] = [
  {
    id: 'iso-9001',
    code: 'ISO',
    nameAr: 'المنظمة الدولية للمعايير (ISO)',
    nameEn: 'International Organization for Standardization (ISO)',
    issuerAr: 'شهادة إدارة الجودة الشاملة والامتثال الطبي ISO 9001:2015',
    issuerEn: 'ISO 9001:2015 Healthcare Quality Management',
    category: 'international',
    descriptionAr: 'معايير جودة دولية صارمة لإدارة العيادات والمراكز الصحية وضمان سلامة وجودة الرعاية التأهيلية المقدمة للأطفال.',
    descriptionEn: 'Rigorous international quality management standards ensuring patient safety and therapy excellence.',
    badgeTextAr: 'معتمد دولياً للجودة',
    badgeTextEn: 'ISO 9001 Certified',
    verified: true,
    active: true,
    order: 1,
    logoType: 'custom',
    customLogoUrl: '/images/accreditations/iso_logo.webp',
    certificateNumber: 'ISO-SA-88421-2024',
    validUntil: '2027'
  },
  {
    id: 'ibao',
    code: 'IBAO',
    nameAr: 'المنظمة الدولية لتحليل السلوك (IBAO)',
    nameEn: 'International Behavioral Analysis Organization (IBAO)',
    issuerAr: 'اعتماد الممارسين والبرامج العلاجية الدولية IBAO',
    issuerEn: 'International Behavioral Analysis Organization Approved Provider',
    category: 'behavioral',
    descriptionAr: 'اعتماد المعايير الدولية للإشراف الإكلينيكي وتطبيق برامج تحليل السلوك التطبيقي من قبل أخصائيين ومحللي سلوك دوليين معتمدين.',
    descriptionEn: 'Accreditation for international clinical supervision and ABA intervention standards.',
    badgeTextAr: 'مزود معتمد IBAO',
    badgeTextEn: 'IBAO Approved',
    verified: true,
    active: true,
    order: 2,
    logoType: 'custom',
    customLogoUrl: '/images/accreditations/ibao_logo.webp',
    certificateNumber: 'IBAO-CP-9041',
    validUntil: '2026'
  },
  {
    id: 'qaba',
    code: 'QABA',
    nameAr: 'البورد الدولي لممارسي تحليل السلوك (QABA)',
    nameEn: 'Qualified Applied Behavior Analysis Credentialing Board (QABA)',
    issuerAr: 'مجلس اعتماد ممارسي تحليل السلوك التطبيقي المؤهلين (EST. 2012)',
    issuerEn: 'QABA Credentialing Board for ABA Professionals',
    category: 'behavioral',
    descriptionAr: 'اعتماد الممارسين الصحيين في تحليل السلوك (QBA / QASP-S / ABAT) وفق أعلى معايير الجمعيات العالمية للرعاية السلوكية.',
    descriptionEn: 'Credentialing board standard for applied behavior analysis practitioners (QBA, QASP-S, ABAT).',
    badgeTextAr: 'بورد ممارسي ABA',
    badgeTextEn: 'QABA Credentialed',
    verified: true,
    active: true,
    order: 3,
    logoType: 'custom',
    customLogoUrl: '/images/accreditations/qaba_logo.webp',
    certificateNumber: 'QABA-ORG-7712',
    validUntil: '2026'
  },
  {
    id: 'bacb',
    code: 'BACB',
    nameAr: 'مجلس اعتماد محللي السلوك الأمريكي (BACB)',
    nameEn: 'Behavior Analyst Certification Board (BACB)',
    issuerAr: 'المعيار الذهبي العالمي لتحليل السلوك التطبيقي (BCBA / BCaBA / RBT)',
    issuerEn: 'Behavior Analyst Certification Board - Global Standard',
    category: 'behavioral',
    descriptionAr: 'برامج علاجية وتأهيلية بإشراف وإدارة محللي سلوك معتمدين يحملون شهادات البورد الأمريكي BCBA لمتابعة خطط التدخل السلوكي.',
    descriptionEn: 'Therapy protocols overseen by Board Certified Behavior Analysts (BCBA) following BACB ethical guidelines.',
    badgeTextAr: 'إشراف بورد BCBA',
    badgeTextEn: 'BACB Aligned',
    verified: true,
    active: true,
    order: 4,
    logoType: 'bacb',
    certificateNumber: 'BACB-SUP-33019',
    validUntil: '2027'
  },
  {
    id: 'chi-daman',
    code: 'CHI',
    nameAr: 'مجلس الضمان الصحي (ضمان CHI)',
    nameEn: 'Council of Health Insurance (CHI - Daman)',
    issuerAr: 'مزود خدمات تأهيل طبي وسلوكي معتمد من مجلس الضمان الصحي',
    issuerEn: 'Accredited Healthcare & Rehabilitation Provider',
    category: 'insurance',
    descriptionAr: 'مركز رابا معتمد ضمن شبكات التأمين الطبي ومجلس الضمان الصحي لتقديم جلسات التأهيل السلوكي والتخاطب وتغطية المستفيدين.',
    descriptionEn: 'Official accreditation enabling health insurance coverage for pediatric therapy sessions.',
    badgeTextAr: 'معتمد تأمينياً',
    badgeTextEn: 'CHI Health Insurance',
    verified: true,
    active: true,
    order: 5,
    logoType: 'chi-daman',
    certificateNumber: 'CHI-PRV-44129',
    validUntil: '2026'
  },
  {
    id: 'cbahi',
    code: 'CBAHI',
    nameAr: 'المركز السعودي لاعتماد المنشآت الصحية (CBAHI)',
    nameEn: 'Saudi Central Board for Accreditation of Healthcare Institutions (CBAHI)',
    issuerAr: 'معايير الجودة الوطنية وسلامة المرضى في المنشآت الصحية',
    issuerEn: 'National Healthcare Quality & Patient Safety Accreditation',
    category: 'local',
    descriptionAr: 'تطبيق أعلى المعايير الوطنية السعودية للجودة وسلامة المرضى في المرافق الصحية الصادرة عن المركز السعودي لاعتماد المنشآت الصحية (سباهي).',
    descriptionEn: 'Compliance with Saudi national healthcare accreditation standards for quality and clinical safety.',
    badgeTextAr: 'معايير سباهي الوطنية',
    badgeTextEn: 'CBAHI Quality Standards',
    verified: true,
    active: true,
    order: 6,
    logoType: 'cbahi',
    certificateNumber: 'CBAHI-ACC-11029',
    validUntil: '2027'
  }
];

// Storage helpers for items list
export const getStoredAccreditations = (): AccreditationItem[] => {
  try {
    const saved = localStorage.getItem('raba_accreditations');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item: any, idx: number) => ({
          ...item,
          active: item.active !== undefined ? item.active : true,
          order: item.order !== undefined ? item.order : idx + 1,
          logoType: item.logoType || (item.customLogoUrl ? 'custom' : undefined)
        })).sort((a: AccreditationItem, b: AccreditationItem) => a.order - b.order);
      }
    }
  } catch {
    // ignore
  }
  return ACCREDITATIONS_LIST;
};

import { savePersistentModule } from '../utils/persistentSync';
import { savePersistentImage } from '../utils/persistentImageStore';

export const saveStoredAccreditations = (items: AccreditationItem[]) => {
  if (!Array.isArray(items)) {
    console.warn('[Accreditations] Attempted to save non-array accreditations:', items);
    return;
  }
  try {
    localStorage.setItem('raba_accreditations', JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('raba_accreditations_updated', { detail: items }));
  } catch {
    // ignore
  }

  items.forEach((it) => {
    if (it.customLogoUrl) {
      savePersistentImage(it.id, it.customLogoUrl).catch(() => {});
      savePersistentImage(it.customLogoUrl, it.customLogoUrl).catch(() => {});
    }
  });

  savePersistentModule('raba_accreditations', items);
};

// Storage helpers for Section Header & Settings
export const getStoredAccreditationSettings = (): AccreditationsSectionSettings => {
  try {
    const saved = localStorage.getItem('raba_accreditations_settings');
    if (saved) {
      return { ...DEFAULT_ACCREDITATIONS_SETTINGS, ...JSON.parse(saved) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_ACCREDITATIONS_SETTINGS;
};

export const saveStoredAccreditationSettings = (settings: AccreditationsSectionSettings) => {
  try {
    localStorage.setItem('raba_accreditations_settings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('raba_accreditations_settings_updated', { detail: settings }));
  } catch {
    // ignore
  }
  savePersistentModule('raba_accreditations_settings', settings);
};
