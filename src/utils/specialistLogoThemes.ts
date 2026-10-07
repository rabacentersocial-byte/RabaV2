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
  // 1. Raba Classic Teal (اللون الأساسي لشعار رابا)
  {
    id: 'teal',
    nameAr: 'تيل رابا الأساسي',
    nameEn: 'Raba Teal',
    accentHex: '#0a3530',
    topRim: 'bg-[#0a3530]',
    specialtyBadge: 'text-[#0a3530] dark:text-[#2dd4bf] bg-[#edf7f4] dark:bg-teal-950/60 border border-[#bce8dc] dark:border-teal-800/40',
    statNumber: 'text-[#0a3530] dark:text-[#2dd4bf]',
    buttonBg: 'bg-[#0a3530] hover:bg-[#062420]',
    cvHover: 'hover:text-[#0a3530] hover:border-[#0a3530] dark:hover:text-[#2dd4bf] dark:hover:border-[#2dd4bf]',
    cardHover: 'hover:border-[#0a3530]/40 hover:shadow-[0_16px_40px_rgba(10,53,48,0.14)]',
    titleHover: 'hover:text-[#0a3530] dark:hover:text-[#2dd4bf]'
  },

  // 2. Logo Sky Blue (قطعة اللوجو الزرقاء السماوية #008CD3)
  {
    id: 'blue',
    nameAr: 'أزرق سماوي',
    nameEn: 'Sky Blue',
    accentHex: '#0284c7',
    topRim: 'bg-[#0284c7]',
    specialtyBadge: 'text-[#0369a1] dark:text-[#38bdf8] bg-[#f0f7fc] dark:bg-sky-950/60 border border-[#bfe3fb] dark:border-sky-800/40',
    statNumber: 'text-[#0284c7] dark:text-[#38bdf8]',
    buttonBg: 'bg-[#0284c7] hover:bg-[#0369a1]',
    cvHover: 'hover:text-[#0284c7] hover:border-[#0284c7] dark:hover:text-[#38bdf8] dark:hover:border-[#38bdf8]',
    cardHover: 'hover:border-[#0284c7]/40 hover:shadow-[0_16px_40px_rgba(2,132,199,0.14)]',
    titleHover: 'hover:text-[#0284c7] dark:hover:text-[#38bdf8]'
  },

  // 3. Logo Warm Amber / Gold (قطعة اللوجو الذهبية العنبرية #F8A51D)
  {
    id: 'amber',
    nameAr: 'عنبري ذهبي',
    nameEn: 'Warm Amber',
    accentHex: '#b45309',
    topRim: 'bg-[#d97706]',
    specialtyBadge: 'text-[#b45309] dark:text-[#fbbf24] bg-[#fef9ee] dark:bg-amber-950/60 border border-[#fde1a6] dark:border-amber-800/40',
    statNumber: 'text-[#b45309] dark:text-[#fbbf24]',
    buttonBg: 'bg-[#b45309] hover:bg-[#92400e]',
    cvHover: 'hover:text-[#b45309] hover:border-[#b45309] dark:hover:text-[#fbbf24] dark:hover:border-[#fbbf24]',
    cardHover: 'hover:border-[#b45309]/40 hover:shadow-[0_16px_40px_rgba(180,83,9,0.14)]',
    titleHover: 'hover:text-[#b45309] dark:hover:text-[#fbbf24]'
  },

  // 4. Logo Rose Magenta (قطعة اللوجو الفوشيا #E5007D)
  {
    id: 'rose',
    nameAr: 'وردي فوشيا',
    nameEn: 'Rose Magenta',
    accentHex: '#be185d',
    topRim: 'bg-[#db2777]',
    specialtyBadge: 'text-[#be185d] dark:text-[#f472b6] bg-[#fdf2f8] dark:bg-pink-950/60 border border-[#fbcfe8] dark:border-pink-800/40',
    statNumber: 'text-[#be185d] dark:text-[#f472b6]',
    buttonBg: 'bg-[#be185d] hover:bg-[#9d174d]',
    cvHover: 'hover:text-[#be185d] hover:border-[#be185d] dark:hover:text-[#f472b6] dark:hover:border-[#f472b6]',
    cardHover: 'hover:border-[#be185d]/40 hover:shadow-[0_16px_40px_rgba(190,24,93,0.14)]',
    titleHover: 'hover:text-[#be185d] dark:hover:text-[#f472b6]'
  },

  // 5. Royal Purple / Violet (ألوان التأهيل والتواصل اللغوي #8B5CF6)
  {
    id: 'purple',
    nameAr: 'بنفسجي ملكي',
    nameEn: 'Royal Purple',
    accentHex: '#6d28d9',
    topRim: 'bg-[#7c3aed]',
    specialtyBadge: 'text-[#6d28d9] dark:text-[#a78bfa] bg-[#f5f3ff] dark:bg-purple-950/60 border border-[#ddd6fe] dark:border-purple-800/40',
    statNumber: 'text-[#6d28d9] dark:text-[#a78bfa]',
    buttonBg: 'bg-[#6d28d9] hover:bg-[#5b21b6]',
    cvHover: 'hover:text-[#6d28d9] hover:border-[#6d28d9] dark:hover:text-[#a78bfa] dark:hover:border-[#a78bfa]',
    cardHover: 'hover:border-[#6d28d9]/40 hover:shadow-[0_16px_40px_rgba(109,40,217,0.14)]',
    titleHover: 'hover:text-[#6d28d9] dark:hover:text-[#a78bfa]'
  },

  // 6. Logo Emerald Green (قطعة اللوجو الخضراء الزمردية #00B050)
  {
    id: 'emerald',
    nameAr: 'أخضر زمردي',
    nameEn: 'Emerald Green',
    accentHex: '#15803d',
    topRim: 'bg-[#16a34a]',
    specialtyBadge: 'text-[#15803d] dark:text-[#4ade80] bg-[#f0fdf4] dark:bg-emerald-950/60 border border-[#bbf7d0] dark:border-emerald-800/40',
    statNumber: 'text-[#15803d] dark:text-[#4ade80]',
    buttonBg: 'bg-[#15803d] hover:bg-[#166534]',
    cvHover: 'hover:text-[#15803d] hover:border-[#15803d] dark:hover:text-[#4ade80] dark:hover:border-[#4ade80]',
    cardHover: 'hover:border-[#15803d]/40 hover:shadow-[0_16px_40px_rgba(21,128,61,0.14)]',
    titleHover: 'hover:text-[#15803d] dark:hover:text-[#4ade80]'
  },

  // 7. Turquoise Cyan (فيروزي رابا المميز #00E5BE / #0F766E)
  {
    id: 'cyan',
    nameAr: 'فيروزي رابا',
    nameEn: 'Turquoise Cyan',
    accentHex: '#0f766e',
    topRim: 'bg-[#0d9488]',
    specialtyBadge: 'text-[#0f766e] dark:text-[#2dd4bf] bg-[#ecfeff] dark:bg-teal-950/60 border border-[#99f6e4] dark:border-teal-800/40',
    statNumber: 'text-[#0f766e] dark:text-[#2dd4bf]',
    buttonBg: 'bg-[#0f766e] hover:bg-[#115e59]',
    cvHover: 'hover:text-[#0f766e] hover:border-[#0f766e] dark:hover:text-[#2dd4bf] dark:hover:border-[#2dd4bf]',
    cardHover: 'hover:border-[#0f766e]/40 hover:shadow-[0_16px_40px_rgba(15,118,110,0.14)]',
    titleHover: 'hover:text-[#0f766e] dark:hover:text-[#2dd4bf]'
  },

  // 8. Sunset Coral / Orange (برتقالي مرجاني دافئ #EA580C)
  {
    id: 'coral',
    nameAr: 'برتقالي مرجاني',
    nameEn: 'Sunset Coral',
    accentHex: '#c2410c',
    topRim: 'bg-[#ea580c]',
    specialtyBadge: 'text-[#c2410c] dark:text-[#fb923c] bg-[#fff7ed] dark:bg-orange-950/60 border border-[#fed7aa] dark:border-orange-800/40',
    statNumber: 'text-[#c2410c] dark:text-[#fb923c]',
    buttonBg: 'bg-[#c2410c] hover:bg-[#9a3412]',
    cvHover: 'hover:text-[#c2410c] hover:border-[#c2410c] dark:hover:text-[#fb923c] dark:hover:border-[#fb923c]',
    cardHover: 'hover:border-[#c2410c]/40 hover:shadow-[0_16px_40px_rgba(194,65,12,0.14)]',
    titleHover: 'hover:text-[#c2410c] dark:hover:text-[#fb923c]'
  }
];

export function getSpecialistLogoTheme(doctor?: any, index: number = 0): SpecialistLogoTheme {
  const safeIndex = Math.abs(index) % SPECIALIST_LOGO_THEMES.length;
  return SPECIALIST_LOGO_THEMES[safeIndex];
}
