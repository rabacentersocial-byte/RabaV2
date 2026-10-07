import { Doctor } from '../components/DoctorCardSlider';

export interface SpecialistLogoTheme {
  id: string;
  nameAr: string;
  nameEn: string;
  accentHex: string;
  
  // Card border and shadow
  cardBorderHover: string;
  
  // Top Accent Bar / Strip at the very top of the card
  topAccentBar: string;
  
  // Photo container subtle accent / tint
  photoBg: string;
  
  // Specialty tag/code badge
  specialtyBadge: string;
  
  // Experience / years metric highlight
  expMetricColor: string;
  
  // Primary action button ("حجز جلسة" / "Book visit")
  bookButton: string;
  
  // Secondary action button ("السيرة" / "CV")
  cvButton: string;
  
  // Active availability indicator dot & text
  availableDot: string;
  availableText: string;
}

export const SPECIALIST_LOGO_THEMES: SpecialistLogoTheme[] = [
  // 1. Raba Classic Deep Teal (#0a3530 / #0d5c52) - اللون الأساسي للشعار والإدارة الطبية
  {
    id: 'teal',
    nameAr: 'تيل رابا الأساسي',
    nameEn: 'Raba Classic Teal',
    accentHex: '#0a3530',
    cardBorderHover: 'border-[#cbe8df] dark:border-teal-950/70 hover:border-[#0a3530]/60 hover:shadow-[0_16px_36px_rgba(10,53,48,0.13)]',
    topAccentBar: 'bg-gradient-to-r from-[#0a3530] via-[#0d5c52] to-[#2dd4bf]',
    photoBg: 'bg-[#edf7f4] dark:bg-[#072420]',
    specialtyBadge: 'bg-[#edf7f4] dark:bg-teal-950/60 text-[#0a3530] dark:text-[#2dd4bf] border border-[#cbe8df] dark:border-teal-800/40',
    expMetricColor: 'text-[#0a3530] dark:text-[#2dd4bf]',
    bookButton: 'bg-[#0a3530] hover:bg-[#062420] text-white shadow-xs hover:shadow-md active:scale-95',
    cvButton: 'border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-[#0a3530] hover:border-[#0a3530] dark:hover:text-[#2dd4bf] dark:hover:border-[#2dd4bf]',
    availableDot: 'bg-[#0d9488]',
    availableText: 'text-[#0a3530] dark:text-[#2dd4bf]'
  },

  // 2. Logo Sky Blue (#008CD3 / #0284c7) - قطعة اللوجو الزرقاء السماوية
  {
    id: 'blue',
    nameAr: 'أزرق سماوي',
    nameEn: 'Logo Sky Blue',
    accentHex: '#0284c7',
    cardBorderHover: 'border-[#c2e0f6] dark:border-sky-950/70 hover:border-[#0284c7]/60 hover:shadow-[0_16px_36px_rgba(2,132,199,0.15)]',
    topAccentBar: 'bg-gradient-to-r from-[#0284c7] via-[#008CD3] to-[#38bdf8]',
    photoBg: 'bg-[#f0f7fc] dark:bg-[#081e33]',
    specialtyBadge: 'bg-[#f0f7fc] dark:bg-sky-950/60 text-[#0284c7] dark:text-[#38bdf8] border border-[#c2e0f6] dark:border-sky-800/40',
    expMetricColor: 'text-[#0284c7] dark:text-[#38bdf8]',
    bookButton: 'bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-xs hover:shadow-md active:scale-95',
    cvButton: 'border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-[#0284c7] hover:border-[#0284c7] dark:hover:text-[#38bdf8] dark:hover:border-[#38bdf8]',
    availableDot: 'bg-[#0284c7]',
    availableText: 'text-[#0284c7] dark:text-[#38bdf8]'
  },

  // 3. Logo Warm Amber / Golden Orange (#F8A51D / #b45309) - قطعة اللوجو الذهبية العنبرية
  {
    id: 'amber',
    nameAr: 'عنبري ذهبي',
    nameEn: 'Logo Warm Amber',
    accentHex: '#b45309',
    cardBorderHover: 'border-[#f7dc9f] dark:border-amber-950/70 hover:border-[#b45309]/60 hover:shadow-[0_16px_36px_rgba(180,83,9,0.15)]',
    topAccentBar: 'bg-gradient-to-r from-[#b45309] via-[#F8A51D] to-[#fbbf24]',
    photoBg: 'bg-[#fef9ee] dark:bg-[#2b1c06]',
    specialtyBadge: 'bg-[#fef9ee] dark:bg-amber-950/60 text-[#9a5600] dark:text-[#fbbf24] border border-[#f7dc9f] dark:border-amber-800/40',
    expMetricColor: 'text-[#9a5600] dark:text-[#fbbf24]',
    bookButton: 'bg-[#b45309] hover:bg-[#92400e] text-white shadow-xs hover:shadow-md active:scale-95',
    cvButton: 'border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-[#b45309] hover:border-[#b45309] dark:hover:text-[#fbbf24] dark:hover:border-[#fbbf24]',
    availableDot: 'bg-[#d97706]',
    availableText: 'text-[#9a5600] dark:text-[#fbbf24]'
  },

  // 4. Logo Rose Magenta (#E5007D / #be185d) - قطعة اللوجو الفوشيا الوردية
  {
    id: 'rose',
    nameAr: 'وردي فوشيا',
    nameEn: 'Logo Rose Magenta',
    accentHex: '#be185d',
    cardBorderHover: 'border-[#f6b4d7] dark:border-pink-950/70 hover:border-[#be185d]/60 hover:shadow-[0_16px_36px_rgba(190,24,93,0.15)]',
    topAccentBar: 'bg-gradient-to-r from-[#be185d] via-[#E5007D] to-[#f472b6]',
    photoBg: 'bg-[#fdf2f8] dark:bg-[#2e0b1d]',
    specialtyBadge: 'bg-[#fdf2f8] dark:bg-pink-950/60 text-[#9d174d] dark:text-[#f472b6] border border-[#f6b4d7] dark:border-pink-800/40',
    expMetricColor: 'text-[#9d174d] dark:text-[#f472b6]',
    bookButton: 'bg-[#be185d] hover:bg-[#9d174d] text-white shadow-xs hover:shadow-md active:scale-95',
    cvButton: 'border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-[#be185d] hover:border-[#be185d] dark:hover:text-[#f472b6] dark:hover:border-[#f472b6]',
    availableDot: 'bg-[#e11d48]',
    availableText: 'text-[#be185d] dark:text-[#f472b6]'
  },

  // 5. Logo Emerald Green (#00B050 / #15803d) - قطعة اللوجو الخضراء الزمردية
  {
    id: 'emerald',
    nameAr: 'أخضر زمردي',
    nameEn: 'Logo Emerald Green',
    accentHex: '#15803d',
    cardBorderHover: 'border-[#b9f2cb] dark:border-emerald-950/70 hover:border-[#15803d]/60 hover:shadow-[0_16px_36px_rgba(21,128,61,0.15)]',
    topAccentBar: 'bg-gradient-to-r from-[#15803d] via-[#00B050] to-[#4ade80]',
    photoBg: 'bg-[#f0fdf4] dark:bg-[#072412]',
    specialtyBadge: 'bg-[#f0fdf4] dark:bg-emerald-950/60 text-[#14532d] dark:text-[#4ade80] border border-[#b9f2cb] dark:border-emerald-800/40',
    expMetricColor: 'text-[#14532d] dark:text-[#4ade80]',
    bookButton: 'bg-[#15803d] hover:bg-[#166534] text-white shadow-xs hover:shadow-md active:scale-95',
    cvButton: 'border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-[#15803d] hover:border-[#15803d] dark:hover:text-[#4ade80] dark:hover:border-[#4ade80]',
    availableDot: 'bg-[#16a34a]',
    availableText: 'text-[#14532d] dark:text-[#4ade80]'
  },

  // 6. Royal Purple / Violet (#6d28d9) - بنفسجي التأهيل التخصصي
  {
    id: 'purple',
    nameAr: 'بنفسجي ملكي',
    nameEn: 'Royal Purple',
    accentHex: '#6d28d9',
    cardBorderHover: 'border-[#d1c5f8] dark:border-purple-950/70 hover:border-[#6d28d9]/60 hover:shadow-[0_16px_36px_rgba(109,40,217,0.15)]',
    topAccentBar: 'bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#a78bfa]',
    photoBg: 'bg-[#f5f3ff] dark:bg-[#1c0e35]',
    specialtyBadge: 'bg-[#f5f3ff] dark:bg-purple-950/60 text-[#5b21b6] dark:text-[#a78bfa] border border-[#d1c5f8] dark:border-purple-800/40',
    expMetricColor: 'text-[#5b21b6] dark:text-[#a78bfa]',
    bookButton: 'bg-[#6d28d9] hover:bg-[#5b21b6] text-white shadow-xs hover:shadow-md active:scale-95',
    cvButton: 'border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-[#6d28d9] hover:border-[#6d28d9] dark:hover:text-[#a78bfa] dark:hover:border-[#a78bfa]',
    availableDot: 'bg-[#7c3aed]',
    availableText: 'text-[#6d28d9] dark:text-[#a78bfa]'
  },

  // 7. Turquoise / Vibrant Cyan (#0f766e / #00E5BE) - فيروزي رابا المتألق
  {
    id: 'cyan',
    nameAr: 'فيروزي رابا',
    nameEn: 'Turquoise Cyan',
    accentHex: '#0f766e',
    cardBorderHover: 'border-[#a2edf3] dark:border-cyan-950/70 hover:border-[#0f766e]/60 hover:shadow-[0_16px_36px_rgba(15,118,110,0.15)]',
    topAccentBar: 'bg-gradient-to-r from-[#0f766e] via-[#0d9488] to-[#00E5BE]',
    photoBg: 'bg-[#ecfeff] dark:bg-[#062125]',
    specialtyBadge: 'bg-[#ecfeff] dark:bg-cyan-950/60 text-[#115e59] dark:text-[#2dd4bf] border border-[#a2edf3] dark:border-cyan-800/40',
    expMetricColor: 'text-[#115e59] dark:text-[#2dd4bf]',
    bookButton: 'bg-[#0f766e] hover:bg-[#115e59] text-white shadow-xs hover:shadow-md active:scale-95',
    cvButton: 'border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-[#0f766e] hover:border-[#0f766e] dark:hover:text-[#2dd4bf] dark:hover:border-[#2dd4bf]',
    availableDot: 'bg-[#0d9488]',
    availableText: 'text-[#0f766e] dark:text-[#2dd4bf]'
  },

  // 8. Sunset Coral / Warm Orange (#c2410c) - برتقالي دافئ من درجات الهوية
  {
    id: 'coral',
    nameAr: 'مرجاني دافئ',
    nameEn: 'Sunset Coral',
    accentHex: '#c2410c',
    cardBorderHover: 'border-[#fbc79d] dark:border-orange-950/70 hover:border-[#c2410c]/60 hover:shadow-[0_16px_36px_rgba(194,65,12,0.15)]',
    topAccentBar: 'bg-gradient-to-r from-[#c2410c] via-[#ea580c] to-[#fb923c]',
    photoBg: 'bg-[#fff7ed] dark:bg-[#2b1307]',
    specialtyBadge: 'bg-[#fff7ed] dark:bg-orange-950/60 text-[#9a3412] dark:text-[#fb923c] border border-[#fbc79d] dark:border-orange-800/40',
    expMetricColor: 'text-[#9a3412] dark:text-[#fb923c]',
    bookButton: 'bg-[#c2410c] hover:bg-[#9a3412] text-white shadow-xs hover:shadow-md active:scale-95',
    cvButton: 'border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-[#c2410c] hover:border-[#c2410c] dark:hover:text-[#fb923c] dark:hover:border-[#fb923c]',
    availableDot: 'bg-[#ea580c]',
    availableText: 'text-[#c2410c] dark:text-[#fb923c]'
  }
];

// Specific known doctor thematic assignments (based on their leadership role or specialty)
const DOCTOR_SPECIFIC_THEMES: Record<string, string> = {
  'doc-hanaa-basheer': 'teal',      // Medical Director / Clinical Psychology
  'doc-ahmed-abouzeid': 'blue',     // General Director / ABA
  'doc-hesham-ali': 'purple',       // Head of Speech & Language
  'doc-haneen-obaidi': 'amber',     // Early Intervention & Autism
  'doc-mohamed-sayed': 'emerald',   // Motor & Occupational Rehabilitation
  'doc-sarah-khalil': 'rose',       // Pediatric Behavior Analysis
  'doc-khaled-mahmoud': 'cyan',     // Special Diagnostics
  'doc-nour-aldeen': 'coral',       // Adaptive Skills
  'doc-asmaa-abdullah': 'teal',     // Clinical Supervision
  'doc-tariq-mansour': 'blue',      // Speech Pathology
  'doc-reem-salem': 'amber',        // Sensory Integration
  'doc-yasmin-adel': 'rose'         // Early Childhood Therapy
};

/**
 * Returns the exact logo color theme for a doctor/specialist based on their ID, category, or index.
 * Alternates colors smoothly so every card in the carousel / list has a distinct logo color!
 */
export function getSpecialistLogoTheme(doctor?: { id?: string; category?: string } | null, index: number = 0): SpecialistLogoTheme {
  // 1. Direct ID match
  if (doctor?.id) {
    const normId = doctor.id.toLowerCase();
    if (DOCTOR_SPECIFIC_THEMES[normId]) {
      const themeKey = DOCTOR_SPECIFIC_THEMES[normId];
      const found = SPECIALIST_LOGO_THEMES.find(t => t.id === themeKey);
      if (found) return found;
    }
    // Also check normalized without doc-/spec-
    const cleanId = normId.replace(/^(doc|spec)-/, '');
    for (const [key, val] of Object.entries(DOCTOR_SPECIFIC_THEMES)) {
      if (key.replace(/^(doc|spec)-/, '') === cleanId) {
        const found = SPECIALIST_LOGO_THEMES.find(t => t.id === val);
        if (found) return found;
      }
    }
  }

  // 2. Alternating through themes by sequence index for vibrant diversity
  const safeIndex = Math.abs(index) % SPECIALIST_LOGO_THEMES.length;
  return SPECIALIST_LOGO_THEMES[safeIndex];
}
