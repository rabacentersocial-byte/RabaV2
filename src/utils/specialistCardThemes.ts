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
  // 1. Primary #2E86EB (Electric Medical Blue) - اللون الأساسي المعتمد
  {
    id: 'blue',
    nameAr: 'أزرق رابا الأساسي',
    nameEn: 'Primary Medical Blue',
    accentHex: '#2E86EB',
    cardBorderHover: 'border-blue-200 dark:border-blue-950/70 hover:border-[#2E86EB]/60 hover:shadow-[0_16px_36px_rgba(46,134,235,0.18)]',
    topAccentBar: 'bg-gradient-to-r from-[#2E86EB] via-[#3B92F5] to-[#60a5fa]',
    photoBg: 'bg-blue-50/60 dark:bg-[#0c1f38]',
    specialtyBadge: 'bg-blue-50 dark:bg-blue-950/60 text-[#2E86EB] dark:text-[#60a5fa] border border-blue-200 dark:border-blue-800/40',
    expMetricColor: 'text-[#2E86EB] dark:text-[#60a5fa]',
    bookButton: 'bg-[#2E86EB] hover:bg-[#1d74d8] text-white shadow-xs hover:shadow-md active:scale-95',
    cvButton: 'border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-[#2E86EB] hover:border-[#2E86EB] dark:hover:text-[#60a5fa] dark:hover:border-[#60a5fa]',
    availableDot: 'bg-[#2E86EB]',
    availableText: 'text-[#2E86EB] dark:text-[#60a5fa]'
  },

  // 2. Secondary #FFD23F (Warm Gold / Saffron) - اللون الثانوي
  {
    id: 'amber',
    nameAr: 'ذهبي عنبري',
    nameEn: 'Secondary Warm Gold',
    accentHex: '#FFD23F',
    cardBorderHover: 'border-amber-200 dark:border-amber-950/70 hover:border-[#FFD23F]/60 hover:shadow-[0_16px_36px_rgba(255,210,63,0.18)]',
    topAccentBar: 'bg-gradient-to-r from-[#FFD23F] via-[#FBBF24] to-[#fde047]',
    photoBg: 'bg-amber-50/60 dark:bg-[#2b1f06]',
    specialtyBadge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-[#FFD23F] border border-amber-200 dark:border-amber-800/40',
    expMetricColor: 'text-amber-700 dark:text-[#FFD23F]',
    bookButton: 'bg-[#FFD23F] hover:bg-[#f5c724] text-slate-950 font-black shadow-xs hover:shadow-md active:scale-95',
    cvButton: 'border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-amber-700 hover:border-[#FFD23F] dark:hover:text-[#FFD23F] dark:hover:border-[#FFD23F]',
    availableDot: 'bg-[#FFD23F]',
    availableText: 'text-amber-800 dark:text-[#FFD23F]'
  },

  // 3. Tertiary #22C55E (Vivid Emerald Green) - لون النمو والتعافي الصحي
  {
    id: 'emerald',
    nameAr: 'أخضر زمردي',
    nameEn: 'Tertiary Emerald Green',
    accentHex: '#22C55E',
    cardBorderHover: 'border-emerald-200 dark:border-emerald-950/70 hover:border-[#22C55E]/60 hover:shadow-[0_16px_36px_rgba(34,197,94,0.18)]',
    topAccentBar: 'bg-gradient-to-r from-[#22C55E] via-[#16a34a] to-[#4ade80]',
    photoBg: 'bg-emerald-50/60 dark:bg-[#072412]',
    specialtyBadge: 'bg-emerald-50 dark:bg-emerald-950/60 text-[#15803d] dark:text-[#4ade80] border border-emerald-200 dark:border-emerald-800/40',
    expMetricColor: 'text-[#15803d] dark:text-[#4ade80]',
    bookButton: 'bg-[#22C55E] hover:bg-[#16a34a] text-white shadow-xs hover:shadow-md active:scale-95',
    cvButton: 'border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-[#22C55E] hover:border-[#22C55E] dark:hover:text-[#4ade80] dark:hover:border-[#4ade80]',
    availableDot: 'bg-[#22C55E]',
    availableText: 'text-[#15803d] dark:text-[#4ade80]'
  },

  // 4. Accent #FF2D9B (Neon Magenta / Rose) - لون التميز والنشاط
  {
    id: 'rose',
    nameAr: 'وردي فوشيا',
    nameEn: 'Accent Neon Magenta',
    accentHex: '#FF2D9B',
    cardBorderHover: 'border-pink-200 dark:border-pink-950/70 hover:border-[#FF2D9B]/60 hover:shadow-[0_16px_36px_rgba(255,45,155,0.18)]',
    topAccentBar: 'bg-gradient-to-r from-[#FF2D9B] via-[#f43f5e] to-[#fb7185]',
    photoBg: 'bg-pink-50/60 dark:bg-[#2b0c1e]',
    specialtyBadge: 'bg-pink-50 dark:bg-pink-950/60 text-[#be185d] dark:text-[#f472b6] border border-pink-200 dark:border-pink-800/40',
    expMetricColor: 'text-[#be185d] dark:text-[#f472b6]',
    bookButton: 'bg-[#FF2D9B] hover:bg-[#e01980] text-white shadow-xs hover:shadow-md active:scale-95',
    cvButton: 'border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-[#FF2D9B] hover:border-[#FF2D9B] dark:hover:text-[#f472b6] dark:hover:border-[#f472b6]',
    availableDot: 'bg-[#FF2D9B]',
    availableText: 'text-[#be185d] dark:text-[#f472b6]'
  },

  // 5. Neutral #D9F14A (Electric Chartreuse / Lime) - لون التباين العالي
  {
    id: 'lime',
    nameAr: 'ليموني مشرق',
    nameEn: 'Neutral Electric Lime',
    accentHex: '#D9F14A',
    cardBorderHover: 'border-lime-200 dark:border-lime-950/70 hover:border-[#D9F14A]/60 hover:shadow-[0_16px_36px_rgba(217,241,74,0.18)]',
    topAccentBar: 'bg-gradient-to-r from-[#D9F14A] via-[#bef264] to-[#a3e635]',
    photoBg: 'bg-lime-50/60 dark:bg-[#1a2307]',
    specialtyBadge: 'bg-lime-50 dark:bg-lime-950/60 text-[#4d7c0f] dark:text-[#D9F14A] border border-lime-200 dark:border-lime-800/40',
    expMetricColor: 'text-[#4d7c0f] dark:text-[#D9F14A]',
    bookButton: 'bg-[#D9F14A] hover:bg-[#c9e338] text-slate-950 font-black shadow-xs hover:shadow-md active:scale-95',
    cvButton: 'border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-[#4d7c0f] hover:border-[#D9F14A] dark:hover:text-[#D9F14A] dark:hover:border-[#D9F14A]',
    availableDot: 'bg-[#65a30d]',
    availableText: 'text-[#4d7c0f] dark:text-[#D9F14A]'
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
