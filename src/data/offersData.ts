import { OfferData } from '../types';

export const INITIAL_OFFERS: OfferData[] = [
  {
    id: 'offer-national-day-free-day',
    titleAr: 'يوم مجاني لجميع عملائنا',
    titleEn: 'Free Day for All Clients',
    subtitleAr: 'بمناسبة اليوم الوطني السعودي الـ96 — عزّ وفخر',
    subtitleEn: 'Saudi National Day 96 — Glory & Pride',
    ribbonAr: 'لجميع عملائنا',
    ribbonEn: 'All Clients',
    headerTagAr: 'عزّنا بطبعنا',
    headerTagSubAr: 'اليوم الوطني 96',
    badgeAr: 'عرض حصري 100% مجاني',
    badgeEn: '100% FREE DAY',
    couponCode: 'KSA96-FREE',
    targetDate: '2026-09-24T23:59:59',
    dateLabelAr: 'يوم الخميس 24/9/2026',
    dateLabelEn: 'Thursday 24/09/2026',
    discountType: 'free_day',
    discountValue: 100,
    theme: 'emerald',
    isNationalDay: true,
    active: true,
    showCountdown: true,
    claimButtonTextAr: 'حجز اليوم المجاني',
    descriptionAr: 'نحتفل معكم بيوم مميز تقديراً لثقتكم ووفائكم لنا لجميع عملائنا الكرام.',
    descriptionEn: 'Celebrating a special day in appreciation of your trust and loyalty to us for all valued clients.',
    styling: {
      themePreset: 'emerald',
      bgGradientFrom: '#062c22',
      bgGradientVia: '#093c2f',
      bgGradientTo: '#041d17',
      borderColor: 'rgba(16,185,129,0.35)',
      borderHoverColor: 'rgba(16,185,129,0.65)',
      accentColor: '#00E5BE',
      badgeBgColor: '#00E5BE',
      badgeTextColor: '#022c22',
      ribbonBgColor: '#00E5BE',
      ribbonTextColor: '#022c22',
      glowColor: 'rgba(16,185,129,0.2)',
      subcardBg: '#032019',
      subcardBorder: 'rgba(16,185,129,0.3)',
      textColor: '#ffffff'
    },
    terms: [
      { textAr: 'متاح لجميع العملاء الحاليين والجدد', textEn: 'Available for all existing and new clients' },
      { textAr: 'الحجز المسبق إلزامي لتأكيد الحضور', textEn: 'Prior booking is mandatory' },
      { textAr: 'ساري حصرياً يوم الخميس 24/9/2026', textEn: 'Valid exclusively on Thursday 24/9/2026' }
    ]
  },
  {
    id: 'offer-national-day-35-percent',
    titleAr: 'خصم 35% للعملاء الجدد',
    titleEn: '35% Discount for New Clients',
    subtitleAr: 'بمناسبة اليوم الوطني الـ96 — تسجيل صباحي',
    subtitleEn: 'The 96th Saudi National Day — Morning Registration',
    ribbonAr: 'للعملاء الجدد',
    ribbonEn: 'New Clients',
    headerTagAr: 'عزّنا بطبعنا',
    headerTagSubAr: 'اليوم الوطني 96',
    badgeAr: 'خصم 35% للعملاء الجدد',
    badgeEn: 'NEW CLIENTS 35% OFF',
    couponCode: 'KSA96-NEW',
    targetDate: '2026-09-30T23:59:59',
    dateLabelAr: 'ساري حتى 30/9/2026',
    dateLabelEn: 'Valid until 30/09/2026',
    discountType: 'percentage',
    discountValue: 35,
    theme: 'teal',
    isNationalDay: true,
    active: true,
    showCountdown: true,
    claimButtonTextAr: 'الاستفادة من الخصم 35%',
    descriptionAr: 'عرض مميز للعملاء الجدد بمناسبة اليوم الوطني السعودي الـ96.',
    descriptionEn: 'Exclusive offer for new clients on the occasion of Saudi National Day 96.',
    styling: {
      themePreset: 'teal',
      bgGradientFrom: '#042a2b',
      bgGradientVia: '#0b4245',
      bgGradientTo: '#021a1b',
      borderColor: 'rgba(20,184,166,0.35)',
      borderHoverColor: 'rgba(20,184,166,0.65)',
      accentColor: '#2dd4bf',
      badgeBgColor: '#2dd4bf',
      badgeTextColor: '#021a1b',
      ribbonBgColor: '#2dd4bf',
      ribbonTextColor: '#021a1b',
      glowColor: 'rgba(20,184,166,0.2)',
      subcardBg: '#022224',
      subcardBorder: 'rgba(20,184,166,0.3)',
      textColor: '#ffffff'
    },
    terms: [
      { textAr: 'الخصم يطبق على السعر الأصلي.', textEn: 'Discount applies to original price.' },
      { textAr: 'يُطبق الخصم لمرة واحدة على كل باقة.', textEn: 'Applied once per package.' },
      { textAr: 'العرض ساري حتى 30/9/2026.', textEn: 'Offer valid until 30/9/2026.' },
      { textAr: 'الخصم يقدم للتسجيل الصباحي من 08:00 ص إلى 12:00 م.', textEn: 'Valid for morning registration (08:00 AM - 12:00 PM).' }
    ]
  }
];

const STORAGE_KEY = 'raba_offers_data';

export const getStoredOffers = (): OfferData[] => {
  if (typeof window === 'undefined') return INITIAL_OFFERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_OFFERS));
      return INITIAL_OFFERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_OFFERS;
  } catch {
    return INITIAL_OFFERS;
  }
};

import { savePersistentModule } from '../utils/persistentSync';

export const saveStoredOffers = (offers: OfferData[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(offers));
  } catch (e) {
    console.error('Failed to save offers to localStorage:', e);
  }
  savePersistentModule(STORAGE_KEY, offers);
  window.dispatchEvent(new CustomEvent('raba_offers_updated', { detail: offers }));
};
