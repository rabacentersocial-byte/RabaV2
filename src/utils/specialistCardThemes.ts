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
  // 1. Primary Sky Blue (#2B95FF)
  {
    id: 'blue',
    nameAr: 'برتقالي رابا الشمسي',
    nameEn: 'Primary Solar Orange',
    accentHex: '#2B95FF',
    cardBorderHover: 'border-white/70 dark:border-white/10 hover:border-[#2B95FF]/55 hover:shadow-[0_20px_44px_-12px_rgba(43,149,255,0.22)]',
    topAccentBar: 'bg-gradient-to-r from-[#60AFFF] via-[#2B95FF] to-[#1A73E8]',
    photoBg: 'bg-[#F5F2EC]/80 dark:bg-[#161C2A]',
    specialtyBadge: 'bg-[#2B95FF]/10 dark:bg-[#2B95FF]/15 text-[#1263D6] dark:text-[#60AFFF] border border-[#2B95FF]/25 dark:border-[#2B95FF]/30',
    expMetricColor: 'text-[#1263D6] dark:text-[#60AFFF]',
    bookButton: 'warm-pill-cta shadow-xs hover:shadow-md active:scale-95',
    cvButton: 'border-[#161B26]/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.06] text-[#161B26] dark:text-[#F8FAFC] hover:text-[#1263D6] hover:border-[#2B95FF] dark:hover:text-[#60AFFF] dark:hover:border-[#60AFFF]',
    availableDot: 'bg-[#2B95FF]',
    availableText: 'text-[#1263D6] dark:text-[#60AFFF]'
  },

  // 2. Warm Gold (#F59E0B)
  {
    id: 'amber',
    nameAr: 'ذهبي عنبري',
    nameEn: 'Secondary Warm Amber',
    accentHex: '#F59E0B',
    cardBorderHover: 'border-white/70 dark:border-white/10 hover:border-[#F59E0B]/50 hover:shadow-[0_20px_44px_-12px_rgba(245,158,11,0.20)]',
    topAccentBar: 'bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#D97706]',
    photoBg: 'bg-[#F5F2EC]/80 dark:bg-[#161C2A]',
    specialtyBadge: 'bg-[#F59E0B]/10 dark:bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24] border border-[#F59E0B]/25 dark:border-[#FBBF24]/25',
    expMetricColor: 'text-[#B45309] dark:text-[#FBBF24]',
    bookButton: 'bg-gradient-to-r from-[#2B95FF] to-[#1A73E8] hover:opacity-95 text-white font-black shadow-xs hover:shadow-md active:scale-95',
    cvButton: 'border-[#161B26]/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.06] text-[#161B26] dark:text-[#F8FAFC] hover:text-[#B45309] hover:border-[#F59E0B] dark:hover:text-[#FBBF24] dark:hover:border-[#FBBF24]',
    availableDot: 'bg-[#F59E0B]',
    availableText: 'text-[#B45309] dark:text-[#FBBF24]'
  },

  // 3. Organic Emerald (#10B981)
  {
    id: 'emerald',
    nameAr: 'أخضر عضوي',
    nameEn: 'Organic Emerald',
    accentHex: '#10B981',
    cardBorderHover: 'border-white/70 dark:border-white/10 hover:border-[#10B981]/50 hover:shadow-[0_20px_44px_-12px_rgba(16,185,129,0.18)]',
    topAccentBar: 'bg-gradient-to-r from-[#34D399] via-[#10B981] to-[#059669]',
    photoBg: 'bg-[#F5F2EC]/80 dark:bg-[#161C2A]',
    specialtyBadge: 'bg-[#10B981]/10 dark:bg-[#10B981]/15 text-[#047857] dark:text-[#34D399] border border-[#10B981]/25 dark:border-[#34D399]/25',
    expMetricColor: 'text-[#047857] dark:text-[#34D399]',
    bookButton: 'warm-pill-cta shadow-xs hover:shadow-md active:scale-95',
    cvButton: 'border-[#161B26]/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.06] text-[#161B26] dark:text-[#F8FAFC] hover:text-[#047857] hover:border-[#10B981] dark:hover:text-[#34D399] dark:hover:border-[#34D399]',
    availableDot: 'bg-[#10B981]',
    availableText: 'text-[#047857] dark:text-[#34D399]'
  },

  // 4. Rose Clinical (#E11D48)
  {
    id: 'rose',
    nameAr: 'مرجاني متوهج',
    nameEn: 'Deep Ember Coral',
    accentHex: '#E11D48',
    cardBorderHover: 'border-white/70 dark:border-white/10 hover:border-rose-500/55 hover:shadow-[0_20px_44px_-12px_rgba(225,29,72,0.20)]',
    topAccentBar: 'bg-gradient-to-r from-[#FB7185] via-[#E11D48] to-[#BE123C]',
    photoBg: 'bg-[#F5F2EC]/80 dark:bg-[#161C2A]',
    specialtyBadge: 'bg-rose-500/10 dark:bg-rose-500/15 text-[#BE123C] dark:text-[#FB7185] border border-rose-500/25 dark:border-rose-500/30',
    expMetricColor: 'text-[#BE123C] dark:text-[#FB7185]',
    bookButton: 'bg-gradient-to-r from-[#2B95FF] to-[#1A73E8] hover:opacity-95 text-white shadow-xs hover:shadow-md active:scale-95',
    cvButton: 'border-[#161B26]/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.06] text-[#161B26] dark:text-[#F8FAFC] hover:text-[#BE123C] hover:border-rose-500 dark:hover:text-[#FB7185] dark:hover:border-[#FB7185]',
    availableDot: 'bg-[#E11D48]',
    availableText: 'text-[#BE123C] dark:text-[#FB7185]'
  },

  // 5. Sky Cyan (#0284C7)
  {
    id: 'lime',
    nameAr: 'رملي دافئ',
    nameEn: 'Warm Clay Sand',
    accentHex: '#0284C7',
    cardBorderHover: 'border-white/70 dark:border-white/10 hover:border-[#2B95FF]/50 hover:shadow-[0_20px_44px_-12px_rgba(2,132,199,0.20)]',
    topAccentBar: 'bg-gradient-to-r from-[#38BDF8] via-[#0284C7] to-[#2B95FF]',
    photoBg: 'bg-[#F5F2EC]/80 dark:bg-[#161C2A]',
    specialtyBadge: 'bg-sky-500/12 dark:bg-sky-500/20 text-[#0369A1] dark:text-[#38BDF8] border border-sky-500/25 dark:border-sky-400/35',
    expMetricColor: 'text-[#0369A1] dark:text-[#38BDF8]',
    bookButton: 'warm-pill-cta font-black shadow-xs hover:shadow-md active:scale-95',
    cvButton: 'border-[#161B26]/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.06] text-[#161B26] dark:text-[#F8FAFC] hover:text-[#1263D6] hover:border-[#2B95FF] dark:hover:text-[#60AFFF] dark:hover:border-[#60AFFF]',
    availableDot: 'bg-[#0284C7]',
    availableText: 'text-[#0369A1] dark:text-[#38BDF8]'
  },

  // 6. Vibrant Violet (#8B5CF6)
  {
    id: 'purple',
    nameAr: 'أوبسيديان دافئ',
    nameEn: 'Smoked Obsidian',
    accentHex: '#8B5CF6',
    cardBorderHover: 'border-white/70 dark:border-white/10 hover:border-[#8B5CF6]/50 hover:shadow-[0_20px_44px_-12px_rgba(139,92,246,0.20)]',
    topAccentBar: 'bg-gradient-to-r from-[#A78BFA] via-[#8B5CF6] to-[#6D28D9]',
    photoBg: 'bg-[#F5F2EC]/80 dark:bg-[#161C2A]',
    specialtyBadge: 'bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA] border border-[#8B5CF6]/25 dark:border-[#8B5CF6]/30',
    expMetricColor: 'text-[#6D28D9] dark:text-[#A78BFA]',
    bookButton: 'warm-pill-cta shadow-xs hover:shadow-md active:scale-95',
    cvButton: 'border-[#161B26]/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.06] text-[#161B26] dark:text-[#F8FAFC] hover:text-[#6D28D9] hover:border-[#8B5CF6] dark:hover:text-[#A78BFA] dark:hover:border-[#A78BFA]',
    availableDot: 'bg-[#8B5CF6]',
    availableText: 'text-[#6D28D9] dark:text-[#A78BFA]'
  },

  // 7. Teal Emerald (#0D9488)
  {
    id: 'cyan',
    nameAr: 'مشمشي دافئ',
    nameEn: 'Warm Apricot Glow',
    accentHex: '#0D9488',
    cardBorderHover: 'border-white/70 dark:border-white/10 hover:border-teal-500/60 hover:shadow-[0_20px_44px_-12px_rgba(13,148,136,0.20)]',
    topAccentBar: 'bg-gradient-to-r from-[#2DD4BF] via-[#0D9488] to-[#10B981]',
    photoBg: 'bg-[#F5F2EC]/80 dark:bg-[#161C2A]',
    specialtyBadge: 'bg-teal-500/12 dark:bg-teal-500/15 text-[#0F766E] dark:text-[#2DD4BF] border border-teal-500/30 dark:border-teal-400/35',
    expMetricColor: 'text-[#0F766E] dark:text-[#2DD4BF]',
    bookButton: 'bg-gradient-to-r from-[#2B95FF] to-[#1A73E8] hover:opacity-95 text-white shadow-xs hover:shadow-md active:scale-95',
    cvButton: 'border-[#161B26]/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.06] text-[#161B26] dark:text-[#F8FAFC] hover:text-[#0F766E] hover:border-teal-500 dark:hover:text-[#2DD4BF] dark:hover:border-[#2DD4BF]',
    availableDot: 'bg-teal-500',
    availableText: 'text-[#0F766E] dark:text-[#2DD4BF]'
  },

  // 8. Royal Indigo (#6366F1)
  {
    id: 'coral',
    nameAr: 'مرجاني دافئ',
    nameEn: 'Sunset Coral',
    accentHex: '#6366F1',
    cardBorderHover: 'border-white/70 dark:border-white/10 hover:border-indigo-500/60 hover:shadow-[0_20px_44px_-12px_rgba(99,102,241,0.20)]',
    topAccentBar: 'bg-gradient-to-r from-[#818CF8] via-[#6366F1] to-[#4F46E5]',
    photoBg: 'bg-[#F5F2EC]/80 dark:bg-[#161C2A]',
    specialtyBadge: 'bg-indigo-500/10 dark:bg-indigo-500/15 text-[#4338CA] dark:text-[#818CF8] border border-indigo-500/25 dark:border-indigo-500/30',
    expMetricColor: 'text-[#4338CA] dark:text-[#818CF8]',
    bookButton: 'warm-pill-cta shadow-xs hover:shadow-md active:scale-95',
    cvButton: 'border-[#161B26]/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.06] text-[#161B26] dark:text-[#F8FAFC] hover:text-[#4338CA] hover:border-indigo-500 dark:hover:text-[#818CF8] dark:hover:border-[#818CF8]',
    availableDot: 'bg-[#6366F1]',
    availableText: 'text-[#4338CA] dark:text-[#818CF8]'
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
