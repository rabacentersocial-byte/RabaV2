export interface HeroSlideItem {
  id: string;
  src: string;
  alt: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  objectPosition: 'top' | 'center' | 'bottom';
  zoomLevel: number; // 70 to 150%, default 100
  active: boolean;
  order: number;
  tagAr?: string;
  tagEn?: string;
}

export interface HeroSliderConfig {
  autoplay: boolean;
  intervalSeconds: number;
  showBadges: boolean;
  glowEffect: boolean;
}

export const DEFAULT_HERO_SLIDER_CONFIG: HeroSliderConfig = {
  autoplay: true,
  intervalSeconds: 4,
  showBadges: true,
  glowEffect: true
};

export const DEFAULT_HERO_SLIDES: HeroSlideItem[] = [
  {
    id: 'photo-1',
    src: '/images/hero/slide_1_haneen.png',
    alt: 'أ. حنين العبيدي - رئيس قسم العلاج الوظيفي والتكامل الحسي',
    titleAr: 'أ. حنين العبيدي',
    titleEn: 'Haneen Al-Obaidi',
    subtitleAr: 'رئيس قسم العلاج الوظيفي والتكامل الحسي',
    subtitleEn: 'Head of Occupational Therapy & Sensory Integration',
    objectPosition: 'top',
    zoomLevel: 100,
    active: true,
    order: 1,
    tagAr: 'علاج وظيفي',
    tagEn: 'OT'
  },
  {
    id: 'photo-2',
    src: '/images/hero/slide_2_ahmed.jpg',
    alt: 'أ. أحمد أبو زيد أنور - المدير العام للبرامج التأهيلية ورئيس قسم ABA',
    titleAr: 'أ. أحمد أبو زيد أنور',
    titleEn: 'Ahmed Abouzeid Anwar',
    subtitleAr: 'المدير العام للبرامج التأهيلية ورئيس قسم ABA',
    subtitleEn: 'General Director of Rehabilitation | Head of ABA',
    objectPosition: 'top',
    zoomLevel: 100,
    active: true,
    order: 2,
    tagAr: 'إدارة وتأهيل ABA',
    tagEn: 'ABA Director'
  },
  {
    id: 'photo-3',
    src: '/images/hero/slide_3_rahaf.png',
    alt: 'أ. رهف الدغماني - مشرفة قسم تحليل السلوك التطبيقي ABA',
    titleAr: 'أ. رهف الدغماني',
    titleEn: 'Rahaf Al-Doghmani',
    subtitleAr: 'مشرفة قسم تحليل السلوك التطبيقي ABA',
    subtitleEn: 'Supervisor of Applied Behavior Analysis',
    objectPosition: 'top',
    zoomLevel: 100,
    active: true,
    order: 3,
    tagAr: 'تحليل سلوك ABA',
    tagEn: 'ABA'
  },
  {
    id: 'photo-4',
    src: '/images/hero/slide_4_doha.png',
    alt: 'أ. ضحى خالد - مشرفة قسم ABA ومحلل سلوكي معتمد',
    titleAr: 'أ. ضحى خالد',
    titleEn: 'Doha Khaled',
    subtitleAr: 'مشرفة قسم ABA ومحلل سلوكي معتمد',
    subtitleEn: 'ABA Supervisor & Board Certified Behavior Analyst',
    objectPosition: 'top',
    zoomLevel: 100,
    active: true,
    order: 4,
    tagAr: 'إشراف ABA',
    tagEn: 'ABA Supervisor'
  },
  {
    id: 'photo-5',
    src: '/images/hero/slide_5_manar.png',
    alt: 'أ. منار وهبه - مشرفة قسم النطق والتخاطب',
    titleAr: 'أ. منار وهبه',
    titleEn: 'Manar Wahba',
    subtitleAr: 'مشرفة قسم النطق والتخاطب وتأهيل البلع واللغة',
    subtitleEn: 'Supervisor of Speech & Language Pathology',
    objectPosition: 'top',
    zoomLevel: 100,
    active: true,
    order: 5,
    tagAr: 'نطق وتخاطب',
    tagEn: 'Speech & Language'
  },
  {
    id: 'photo-6',
    src: '/uploads/1790358094657_Screenshot_2569-09-23_at_2_07_53_PM_png.png',
    alt: 'أ. أحمد فتحي - أخصائي تحليل السلوك التطبيقي ABAT',
    titleAr: 'أ. أحمد فتحي',
    titleEn: 'Ahmed Fathi',
    subtitleAr: 'أخصائي تحليل السلوك التطبيقي ABAT',
    subtitleEn: 'Applied Behavior Analysis Technician (ABAT)',
    objectPosition: 'top',
    zoomLevel: 100,
    active: true,
    order: 6,
    tagAr: 'أخصائي ABA',
    tagEn: 'ABA Specialist'
  },
  {
    id: 'photo-7',
    src: '/images/hero/slide_7_specialist.png',
    alt: 'أ. سديم احمد المشاري - أخصائي ABA ومصنفة من الهيئة السعودية',
    titleAr: 'أ. سديم احمد المشاري',
    titleEn: 'Sadeem Ahmed Al-Mshari',
    subtitleAr: 'أخصائي ABA ومصنفة من الهيئة السعودية للتخصصات',
    subtitleEn: 'ABA Specialist - Saudi Commission Certified',
    objectPosition: 'top',
    zoomLevel: 100,
    active: true,
    order: 7,
    tagAr: 'تحليل سلوك ABA',
    tagEn: 'ABA'
  },
  {
    id: 'photo-8',
    src: '/images/hero/slide_8_specialist.png',
    alt: 'أ. محمد عاطف - أخصائي تحليل السلوك ومشرف توحد QASP-S',
    titleAr: 'أ. محمد عاطف',
    titleEn: 'Mohamed Atef',
    subtitleAr: 'أخصائي تحليل السلوك ومشرف توحد معتمد QASP-S',
    subtitleEn: 'Behavior Specialist & Certified Autism Supervisor',
    objectPosition: 'top',
    zoomLevel: 100,
    active: true,
    order: 8,
    tagAr: 'مشرف توحد QASP-S',
    tagEn: 'Autism Supervisor'
  }
];

import { savePersistentModule } from '../utils/persistentSync';
import { savePersistentImage } from '../utils/persistentImageStore';

const STORAGE_HERO_SLIDES_KEY = 'raba_hero_slides_v2';
const STORAGE_HERO_CONFIG_KEY = 'raba_hero_slider_config_v2';

export function getStoredHeroSlides(): HeroSlideItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_HERO_SLIDES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    }
    return [...DEFAULT_HERO_SLIDES];
  } catch {
    return [...DEFAULT_HERO_SLIDES];
  }
}

export function getStoredHeroSliderConfig(): HeroSliderConfig {
  try {
    const raw = localStorage.getItem(STORAGE_HERO_CONFIG_KEY);
    if (raw) {
      return { ...DEFAULT_HERO_SLIDER_CONFIG, ...JSON.parse(raw) };
    }
    return { ...DEFAULT_HERO_SLIDER_CONFIG };
  } catch {
    return { ...DEFAULT_HERO_SLIDER_CONFIG };
  }
}

export function saveStoredHeroSlides(slides: HeroSlideItem[]): void {
  try {
    localStorage.setItem(STORAGE_HERO_SLIDES_KEY, JSON.stringify(slides));
  } catch (err) {
    console.error('Failed to save hero slides in localStorage', err);
  }

  // Cache images in IndexedDB
  slides.forEach((s) => {
    if (s.src) {
      savePersistentImage(s.id, s.src).catch(() => {});
      savePersistentImage(s.src, s.src).catch(() => {});
    }
  });

  savePersistentModule(STORAGE_HERO_SLIDES_KEY, slides);
  dispatchSlidesUpdated();
}

export function saveStoredHeroSliderConfig(config: HeroSliderConfig): void {
  try {
    localStorage.setItem(STORAGE_HERO_CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save hero slider config', err);
  }
  savePersistentModule(STORAGE_HERO_CONFIG_KEY, config);
  dispatchSlidesUpdated();
}

export function resetHeroSlidesToDefault(): HeroSlideItem[] {
  const defaults = [...DEFAULT_HERO_SLIDES];
  const defaultConfig = { ...DEFAULT_HERO_SLIDER_CONFIG };
  try {
    localStorage.setItem(STORAGE_HERO_SLIDES_KEY, JSON.stringify(defaults));
    localStorage.setItem(STORAGE_HERO_CONFIG_KEY, JSON.stringify(defaultConfig));
  } catch (err) {
    console.error('Failed to reset hero slides', err);
  }
  savePersistentModule(STORAGE_HERO_SLIDES_KEY, defaults);
  savePersistentModule(STORAGE_HERO_CONFIG_KEY, defaultConfig);
  dispatchSlidesUpdated();
  return defaults;
}

function dispatchSlidesUpdated() {
  window.dispatchEvent(new CustomEvent('raba_hero_slides_updated'));
}
