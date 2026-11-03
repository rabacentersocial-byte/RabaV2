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
  slideType?: 'service' | 'offer' | 'announcement';
  ctaUrl?: string;
  ctaTextAr?: string;
  ctaTextEn?: string;
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
    id: 'offer-national-day',
    src: '/images/hero/slide_1_haneen.webp',
    alt: 'عروض اليوم الوطني السعودي 96 - خصم 35%',
    titleAr: 'عرض اليوم الوطني 96: خصم 35% للعملاء الجدد',
    titleEn: 'National Day 96: 35% Off for New Clients',
    subtitleAr: 'باقات تأهيلية شاملة تبدأ من أول جلسة مع تقييم نمائي وسلوكي معتمد',
    subtitleEn: 'Exclusive rehabilitation packages with certified developmental assessment',
    objectPosition: 'top',
    zoomLevel: 100,
    active: true,
    order: 1,
    tagAr: 'عرض ترويجي خاص',
    tagEn: 'Special Offer',
    slideType: 'offer',
    ctaUrl: '#offers',
    ctaTextAr: 'استفد من العرض',
    ctaTextEn: 'Claim Offer'
  },
  {
    id: 'service-sensory',
    src: '/images/hero/slide_3_rahaf.webp',
    alt: 'غرف التكامل الحسي والعلاج الوظيفي - مركز رابا',
    titleAr: 'غرف التكامل الحسي والتأهيل الوظيفي',
    titleEn: 'Sensory Integration & Occupational Therapy',
    subtitleAr: 'بيئات حسية تفاعلية حديثة لتحسين الاستجابة العصبية والتناسق العضلي الحركي',
    subtitleEn: 'State-of-the-art sensory rooms for motor coordination & sensory modulation',
    objectPosition: 'top',
    zoomLevel: 100,
    active: true,
    order: 2,
    tagAr: 'خدمة متخصصة',
    tagEn: 'Specialized Service',
    slideType: 'service',
    ctaUrl: '#services',
    ctaTextAr: 'حجز موعد',
    ctaTextEn: 'Book Now'
  },
  {
    id: 'service-speech',
    src: '/images/hero/slide_5_manar.webp',
    alt: 'تأهيل النطق والتخاطب واضطرابات البلع واللغة',
    titleAr: 'جلسات تأهيل النطق والتخاطب وتطوير اللغة',
    titleEn: 'Speech & Language Pathology Sessions',
    subtitleAr: 'تطوير النطق، تنمية الحصيلة اللغوية، وعلاج التأتأة وصعوبات البلع والتواصل',
    subtitleEn: 'Developing expressive speech, linguistic skills, and communication fluency',
    objectPosition: 'top',
    zoomLevel: 100,
    active: true,
    order: 3,
    tagAr: 'علاج النطق واللغة',
    tagEn: 'Speech Therapy',
    slideType: 'service',
    ctaUrl: '#services',
    ctaTextAr: 'حجز جلسة',
    ctaTextEn: 'Book Session'
  },
  {
    id: 'service-shadow-teacher',
    src: '/images/shadow_teacher.webp',
    alt: 'برنامج المعلم الظل والمرافق المدرسي',
    titleAr: 'برنامج المعلم الظل (المرافق التعليمي المدرسي)',
    titleEn: 'Shadow Teacher & School Inclusion Program',
    subtitleAr: 'دمج تعليمي وأكاديمي ناجح ومرافقة يومية داخل المدرسة لتعزيز الاستقلالية',
    subtitleEn: 'Daily in-school behavioral assistance and certified academic inclusion',
    objectPosition: 'center',
    zoomLevel: 100,
    active: true,
    order: 4,
    tagAr: 'دمج أكاديمي',
    tagEn: 'School Inclusion',
    slideType: 'service',
    ctaUrl: '#services',
    ctaTextAr: 'طلب معلم ظل',
    ctaTextEn: 'Request Shadow Teacher'
  },
  {
    id: 'offer-assessment',
    src: '/images/hero/slide_4_doha.webp',
    alt: 'يوم التقييم الشامل والتشخيص المبكر',
    titleAr: 'جلسات التقييم الشامل والتشخيص المبكر للتوحد',
    titleEn: 'Comprehensive Early Autism Assessment',
    subtitleAr: 'تطبيق مقاييس مقننة (VB-MAPP و ABLLS-R و CARS) مع تقرير إكلينيكي مفصل وخطة علاجية',
    subtitleEn: 'Standardized assessment battery with detailed clinical IEP recommendation',
    objectPosition: 'top',
    zoomLevel: 100,
    active: true,
    order: 5,
    tagAr: 'تشخيص وتقييم',
    tagEn: 'Diagnostic Assessment',
    slideType: 'offer',
    ctaUrl: '#booking',
    ctaTextAr: 'حجز تقييم فوري',
    ctaTextEn: 'Book Assessment'
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
        // If legacy specialists slides are detected, upgrade to service & promotional slides
        const hasLegacyDoctorSlides = parsed.some(p => p.id === 'photo-1' && (p.titleAr?.includes('حنين') || p.alt?.includes('حنين')));
        if (hasLegacyDoctorSlides) {
          localStorage.setItem(STORAGE_HERO_SLIDES_KEY, JSON.stringify(DEFAULT_HERO_SLIDES));
          return [...DEFAULT_HERO_SLIDES];
        }

        // Clean out deleted first slide 'service-aba' if present in existing storage
        const hasDeletedAbaSlide = parsed.some(p => p.id === 'service-aba');
        if (hasDeletedAbaSlide) {
          const cleaned = parsed
            .filter(p => p.id !== 'service-aba')
            .map((s, idx) => ({ ...s, order: idx + 1 }));
          localStorage.setItem(STORAGE_HERO_SLIDES_KEY, JSON.stringify(cleaned));
          return cleaned.sort((a, b) => (a.order || 0) - (b.order || 0));
        }
        const upgraded = parsed.map(slide => {
          let src = slide.src || '';
          if (src.includes('/images/hero/slide_') && (src.endsWith('.png') || src.endsWith('.jpg'))) {
            src = src.replace(/\.(png|jpg)$/, '.webp');
          } else if (src.includes('/images/shadow_teacher.jpg')) {
            src = '/images/shadow_teacher.webp';
          }
          return { ...slide, src };
        });
        return upgraded.sort((a, b) => (a.order || 0) - (b.order || 0));
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
