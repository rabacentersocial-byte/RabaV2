export interface SpecialistLogoTheme {
  id: string;
  nameAr: string;
  nameEn: string;
  accentHex: string;
  topRim: string;
  specialtyBadge: string;
  statNumber: string;
  buttonBg: string;
  cvHover: string;
  cardHover: string;
  titleHover: string;
}

export const SPECIALIST_LOGO_THEMES: SpecialistLogoTheme[] = [
  // 1. Primary Sky Blue
  {
    id: 'teal',
    nameAr: 'برتقالي رابا الشمسي',
    nameEn: 'Solar Orange',
    accentHex: '#2B95FF',
    topRim: 'bg-[#2B95FF]',
    specialtyBadge: 'text-[#1263D6] dark:text-[#60AFFF] bg-[#2B95FF]/10 dark:bg-[#2B95FF]/15 border border-[#2B95FF]/25 dark:border-[#2B95FF]/30',
    statNumber: 'text-[#1263D6] dark:text-[#60AFFF]',
    buttonBg: 'bg-[#2B95FF] hover:bg-[#1A73E8] text-white',
    cvHover: 'hover:text-[#1263D6] hover:border-[#2B95FF] dark:hover:text-[#60AFFF] dark:hover:border-[#60AFFF]',
    cardHover: 'hover:border-[#2B95FF]/45 hover:shadow-[0_20px_44px_rgba(43,149,255,0.16)]',
    titleHover: 'hover:text-[#1263D6] dark:hover:text-[#60AFFF]'
  },

  // 2. Matte Obsidian / Warm Alabaster
  {
    id: 'blue',
    nameAr: 'أوبسيديان دافئ',
    nameEn: 'Matte Obsidian',
    accentHex: '#141821',
    topRim: 'bg-[#2B95FF]',
    specialtyBadge: 'text-[#161B26] dark:text-[#F8FAFC] bg-[#161B26]/8 dark:bg-white/10 border border-[#161B26]/12 dark:border-white/15',
    statNumber: 'text-[#161B26] dark:text-[#60AFFF]',
    buttonBg: 'bg-gradient-to-r from-[#2B95FF] to-[#1A73E8] hover:opacity-95',
    cvHover: 'hover:text-[#1263D6] hover:border-[#2B95FF] dark:hover:text-[#60AFFF] dark:hover:border-[#60AFFF]',
    cardHover: 'hover:border-[#2B95FF]/45 hover:shadow-[0_20px_44px_rgba(22,27,38,0.16)]',
    titleHover: 'hover:text-[#1263D6] dark:hover:text-[#60AFFF]'
  },

  // 3. Warm Gold
  {
    id: 'amber',
    nameAr: 'عنبري ذهبي',
    nameEn: 'Warm Amber',
    accentHex: '#F59E0B',
    topRim: 'bg-[#F59E0B]',
    specialtyBadge: 'text-[#B45309] dark:text-[#FBBF24] bg-[#F59E0B]/10 dark:bg-amber-950/60 border border-[#F59E0B]/25 dark:border-amber-800/40',
    statNumber: 'text-[#B45309] dark:text-[#FBBF24]',
    buttonBg: 'bg-[#2B95FF] hover:bg-[#1A73E8] text-white',
    cvHover: 'hover:text-[#B45309] hover:border-[#F59E0B] dark:hover:text-[#FBBF24] dark:hover:border-[#FBBF24]',
    cardHover: 'hover:border-[#F59E0B]/45 hover:shadow-[0_20px_44px_rgba(245,158,11,0.14)]',
    titleHover: 'hover:text-[#B45309] dark:hover:text-[#FBBF24]'
  },

  // 4. Clinical Rose
  {
    id: 'rose',
    nameAr: 'جمر دافئ',
    nameEn: 'Deep Ember',
    accentHex: '#E11D48',
    topRim: 'bg-[#E11D48]',
    specialtyBadge: 'text-[#BE123C] dark:text-[#FB7185] bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/25 dark:border-rose-500/30',
    statNumber: 'text-[#BE123C] dark:text-[#FB7185]',
    buttonBg: 'bg-gradient-to-r from-[#2B95FF] to-[#1A73E8] hover:opacity-95',
    cvHover: 'hover:text-[#BE123C] hover:border-[#E11D48] dark:hover:text-[#FB7185] dark:hover:border-[#FB7185]',
    cardHover: 'hover:border-rose-500/45 hover:shadow-[0_20px_44px_rgba(225,29,72,0.16)]',
    titleHover: 'hover:text-[#BE123C] dark:hover:text-[#FB7185]'
  },

  // 5. Vibrant Violet
  {
    id: 'purple',
    nameAr: 'برونز رملي',
    nameEn: 'Warm Bronze',
    accentHex: '#8B5CF6',
    topRim: 'bg-[#8B5CF6]',
    specialtyBadge: 'text-[#6D28D9] dark:text-[#A78BFA] bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 border border-[#8B5CF6]/25 dark:border-[#8B5CF6]/35',
    statNumber: 'text-[#6D28D9] dark:text-[#A78BFA]',
    buttonBg: 'bg-[#2B95FF] hover:bg-[#1A73E8] text-white',
    cvHover: 'hover:text-[#6D28D9] hover:border-[#8B5CF6] dark:hover:text-[#A78BFA] dark:hover:border-[#A78BFA]',
    cardHover: 'hover:border-[#8B5CF6]/55 hover:shadow-[0_20px_44px_rgba(139,92,246,0.18)]',
    titleHover: 'hover:text-[#6D28D9] dark:hover:text-[#A78BFA]'
  },

  // 6. Organic Emerald
  {
    id: 'emerald',
    nameAr: 'أخضر عضوي',
    nameEn: 'Organic Emerald',
    accentHex: '#10B981',
    topRim: 'bg-[#10B981]',
    specialtyBadge: 'text-[#047857] dark:text-[#34D399] bg-[#10B981]/10 dark:bg-emerald-950/60 border border-[#10B981]/25 dark:border-emerald-800/40',
    statNumber: 'text-[#047857] dark:text-[#34D399]',
    buttonBg: 'bg-[#2B95FF] hover:bg-[#1A73E8] text-white',
    cvHover: 'hover:text-[#047857] hover:border-[#10B981] dark:hover:text-[#34D399] dark:hover:border-[#34D399]',
    cardHover: 'hover:border-[#10B981]/45 hover:shadow-[0_20px_44px_rgba(16,185,129,0.14)]',
    titleHover: 'hover:text-[#047857] dark:hover:text-[#34D399]'
  },

  // 7. Azure Cyan
  {
    id: 'cyan',
    nameAr: 'مشمشي متوهج',
    nameEn: 'Solar Apricot',
    accentHex: '#0284C7',
    topRim: 'bg-[#0284C7]',
    specialtyBadge: 'text-[#0369A1] dark:text-[#38BDF8] bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/30 dark:border-sky-500/30',
    statNumber: 'text-[#0369A1] dark:text-[#38BDF8]',
    buttonBg: 'bg-gradient-to-r from-[#2B95FF] to-[#1A73E8] hover:opacity-95',
    cvHover: 'hover:text-[#0369A1] hover:border-[#0284C7] dark:hover:text-[#38BDF8] dark:hover:border-[#38BDF8]',
    cardHover: 'hover:border-sky-500/45 hover:shadow-[0_20px_44px_rgba(2,132,199,0.16)]',
    titleHover: 'hover:text-[#0369A1] dark:hover:text-[#38BDF8]'
  },

  // 8. Royal Indigo
  {
    id: 'coral',
    nameAr: 'برتقالي مرجاني',
    nameEn: 'Sunset Coral',
    accentHex: '#6366F1',
    topRim: 'bg-[#6366F1]',
    specialtyBadge: 'text-[#4338CA] dark:text-[#818CF8] bg-indigo-500/10 dark:bg-indigo-950/60 border border-indigo-500/25 dark:border-indigo-800/40',
    statNumber: 'text-[#4338CA] dark:text-[#818CF8]',
    buttonBg: 'bg-[#2B95FF] hover:bg-[#1A73E8] text-white',
    cvHover: 'hover:text-[#4338CA] hover:border-[#6366F1] dark:hover:text-[#818CF8] dark:hover:border-[#818CF8]',
    cardHover: 'hover:border-[#6366F1]/45 hover:shadow-[0_20px_44px_rgba(99,102,241,0.14)]',
    titleHover: 'hover:text-[#4338CA] dark:hover:text-[#818CF8]'
  }
];

export function getSpecialistLogoTheme(doctor?: any, index: number = 0): SpecialistLogoTheme {
  const safeIndex = Math.abs(index) % SPECIALIST_LOGO_THEMES.length;
  return SPECIALIST_LOGO_THEMES[safeIndex];
}
