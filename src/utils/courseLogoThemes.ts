import { CourseItem } from '../data/coursesData';

export interface CourseLogoTheme {
  id: string;
  nameAr: string;
  nameEn: string;
  accentHex: string;
  headerBg: string;
  headerBorder: string;
  pillBg: string;
  iconBoxBorder: string;
  iconColor: string;
  kickerColor: string;
  titleHover: string;
  priceColor: string;
  priceSub: string;
  hoursBg: string;
  hoursIconColor: string;
  checkBg: string;
  buttonBg: string;
  cardBorderHover: string;
}

export const COURSE_LOGO_THEMES: CourseLogoTheme[] = [
  // 1. Raba Classic Teal (اللون الأساسي لشعار رابا)
  {
    id: 'teal',
    nameAr: 'تيل رابا الأساسي',
    nameEn: 'Raba Teal',
    accentHex: '#0a3530',
    headerBg: 'bg-[#edf7f4] dark:bg-[#0a2c26]',
    headerBorder: 'border-[#e1f1eb] dark:border-teal-950/60',
    pillBg: 'bg-[#0a3530] text-white',
    iconBoxBorder: 'border-[#cbe8df] dark:border-slate-700/60',
    iconColor: 'text-[#0a3530] dark:text-[#2dd4bf]',
    kickerColor: 'text-[#0a3530] dark:text-[#2dd4bf]',
    titleHover: 'hover:text-[#0a3530] dark:hover:text-[#2dd4bf]',
    priceColor: 'text-[#0a3530] dark:text-white',
    priceSub: 'text-[#0a3530] dark:text-slate-200',
    hoursBg: 'bg-[#eaf8f4] dark:bg-teal-950/40 border-[#bce8dc] dark:border-teal-800/40 text-[#0a3530] dark:text-[#2dd4bf]',
    hoursIconColor: 'text-[#0a3530] dark:text-[#2dd4bf]',
    checkBg: 'bg-[#e8f8f2] dark:bg-emerald-950/60 text-[#0a3530] dark:text-emerald-400',
    buttonBg: 'bg-[#0a3530] hover:bg-[#062420]',
    cardBorderHover: 'border-[#dceee8] dark:border-slate-800 hover:border-[#0a3530]/40 hover:shadow-[0_16px_40px_rgba(10,53,48,0.12)]'
  },

  // 2. Logo Sky Blue (قطعة اللوجو الزرقاء السماوية #008CD3)
  {
    id: 'blue',
    nameAr: 'أزرق سماوي',
    nameEn: 'Sky Blue',
    accentHex: '#0284c7',
    headerBg: 'bg-[#f0f7fc] dark:bg-[#0a2238]',
    headerBorder: 'border-[#d8eaf8] dark:border-sky-950/60',
    pillBg: 'bg-[#0369a1] text-white',
    iconBoxBorder: 'border-[#c2e0f6] dark:border-slate-700/60',
    iconColor: 'text-[#0284c7] dark:text-[#38bdf8]',
    kickerColor: 'text-[#0284c7] dark:text-[#38bdf8]',
    titleHover: 'hover:text-[#0284c7] dark:hover:text-[#38bdf8]',
    priceColor: 'text-[#0369a1] dark:text-white',
    priceSub: 'text-[#0369a1] dark:text-slate-200',
    hoursBg: 'bg-[#e6f4fe] dark:bg-sky-950/40 border-[#bfe3fb] dark:border-sky-800/40 text-[#0369a1] dark:text-[#38bdf8]',
    hoursIconColor: 'text-[#0284c7] dark:text-[#38bdf8]',
    checkBg: 'bg-[#e0f2fe] dark:bg-sky-950/60 text-[#0284c7] dark:text-sky-400',
    buttonBg: 'bg-[#0284c7] hover:bg-[#0369a1]',
    cardBorderHover: 'border-[#d8eaf8] dark:border-slate-800 hover:border-[#0284c7]/40 hover:shadow-[0_16px_40px_rgba(2,132,199,0.14)]'
  },

  // 3. Logo Warm Amber / Golden (قطعة اللوجو الذهبية العنبرية #F8A51D)
  {
    id: 'amber',
    nameAr: 'عنبري ذهبي',
    nameEn: 'Warm Amber',
    accentHex: '#b45309',
    headerBg: 'bg-[#fef9ee] dark:bg-[#301f05]',
    headerBorder: 'border-[#fbebc6] dark:border-amber-950/60',
    pillBg: 'bg-[#9a5600] text-white',
    iconBoxBorder: 'border-[#f7dc9f] dark:border-slate-700/60',
    iconColor: 'text-[#b45309] dark:text-[#fbbf24]',
    kickerColor: 'text-[#b45309] dark:text-[#fbbf24]',
    titleHover: 'hover:text-[#b45309] dark:hover:text-[#fbbf24]',
    priceColor: 'text-[#9a5600] dark:text-white',
    priceSub: 'text-[#9a5600] dark:text-slate-200',
    hoursBg: 'bg-[#fef3dc] dark:bg-amber-950/40 border-[#fde1a6] dark:border-amber-800/40 text-[#9a5600] dark:text-[#fbbf24]',
    hoursIconColor: 'text-[#b45309] dark:text-[#fbbf24]',
    checkBg: 'bg-[#fef3c7] dark:bg-amber-950/60 text-[#b45309] dark:text-amber-400',
    buttonBg: 'bg-[#b45309] hover:bg-[#92400e]',
    cardBorderHover: 'border-[#fbebc6] dark:border-slate-800 hover:border-[#b45309]/40 hover:shadow-[0_16px_40px_rgba(180,83,9,0.14)]'
  },

  // 4. Logo Rose Magenta (قطعة اللوجو الفوشيا #E5007D)
  {
    id: 'rose',
    nameAr: 'وردي فوشيا',
    nameEn: 'Rose Magenta',
    accentHex: '#be185d',
    headerBg: 'bg-[#fdf2f8] dark:bg-[#340b1e]',
    headerBorder: 'border-[#fad4e8] dark:border-pink-950/60',
    pillBg: 'bg-[#9d174d] text-white',
    iconBoxBorder: 'border-[#f6b4d7] dark:border-slate-700/60',
    iconColor: 'text-[#be185d] dark:text-[#f472b6]',
    kickerColor: 'text-[#be185d] dark:text-[#f472b6]',
    titleHover: 'hover:text-[#be185d] dark:hover:text-[#f472b6]',
    priceColor: 'text-[#9d174d] dark:text-white',
    priceSub: 'text-[#9d174d] dark:text-slate-200',
    hoursBg: 'bg-[#fce7f3] dark:bg-pink-950/40 border-[#fbcfe8] dark:border-pink-800/40 text-[#9d174d] dark:text-[#f472b6]',
    hoursIconColor: 'text-[#be185d] dark:text-[#f472b6]',
    checkBg: 'bg-[#fce7f3] dark:bg-pink-950/60 text-[#be185d] dark:text-pink-400',
    buttonBg: 'bg-[#be185d] hover:bg-[#9d174d]',
    cardBorderHover: 'border-[#fad4e8] dark:border-slate-800 hover:border-[#be185d]/40 hover:shadow-[0_16px_40px_rgba(190,24,93,0.14)]'
  },

  // 5. Royal Purple / Violet (بنفسجي التواصل والتأهيل)
  {
    id: 'purple',
    nameAr: 'بنفسجي ملكي',
    nameEn: 'Royal Purple',
    accentHex: '#6d28d9',
    headerBg: 'bg-[#f5f3ff] dark:bg-[#1f1038]',
    headerBorder: 'border-[#e4defc] dark:border-purple-950/60',
    pillBg: 'bg-[#5b21b6] text-white',
    iconBoxBorder: 'border-[#d1c5f8] dark:border-slate-700/60',
    iconColor: 'text-[#7c3aed] dark:text-[#a78bfa]',
    kickerColor: 'text-[#7c3aed] dark:text-[#a78bfa]',
    titleHover: 'hover:text-[#7c3aed] dark:hover:text-[#a78bfa]',
    priceColor: 'text-[#5b21b6] dark:text-white',
    priceSub: 'text-[#5b21b6] dark:text-slate-200',
    hoursBg: 'bg-[#ede9fe] dark:bg-purple-950/40 border-[#ddd6fe] dark:border-purple-800/40 text-[#5b21b6] dark:text-[#a78bfa]',
    hoursIconColor: 'text-[#7c3aed] dark:text-[#a78bfa]',
    checkBg: 'bg-[#ede9fe] dark:bg-purple-950/60 text-[#7c3aed] dark:text-purple-400',
    buttonBg: 'bg-[#6d28d9] hover:bg-[#5b21b6]',
    cardBorderHover: 'border-[#e4defc] dark:border-slate-800 hover:border-[#6d28d9]/40 hover:shadow-[0_16px_40px_rgba(109,40,217,0.14)]'
  },

  // 6. Logo Emerald Green (قطعة اللوجو الخضراء الزمردية #00B050)
  {
    id: 'emerald',
    nameAr: 'أخضر زمردي',
    nameEn: 'Emerald Green',
    accentHex: '#15803d',
    headerBg: 'bg-[#f0fdf4] dark:bg-[#092914]',
    headerBorder: 'border-[#d5f8df] dark:border-emerald-950/60',
    pillBg: 'bg-[#14532d] text-white',
    iconBoxBorder: 'border-[#b9f2cb] dark:border-slate-700/60',
    iconColor: 'text-[#15803d] dark:text-[#4ade80]',
    kickerColor: 'text-[#15803d] dark:text-[#4ade80]',
    titleHover: 'hover:text-[#15803d] dark:hover:text-[#4ade80]',
    priceColor: 'text-[#14532d] dark:text-white',
    priceSub: 'text-[#14532d] dark:text-slate-200',
    hoursBg: 'bg-[#dcfce7] dark:bg-emerald-950/40 border-[#bbf7d0] dark:border-emerald-800/40 text-[#14532d] dark:text-[#4ade80]',
    hoursIconColor: 'text-[#15803d] dark:text-[#4ade80]',
    checkBg: 'bg-[#dcfce7] dark:bg-emerald-950/60 text-[#15803d] dark:text-emerald-400',
    buttonBg: 'bg-[#15803d] hover:bg-[#166534]',
    cardBorderHover: 'border-[#d5f8df] dark:border-slate-800 hover:border-[#15803d]/40 hover:shadow-[0_16px_40px_rgba(21,128,61,0.14)]'
  },

  // 7. Turquoise / Cyan (فيروزي رابا المميز #00E5BE / #0D9488)
  {
    id: 'cyan',
    nameAr: 'فيروزي رابا',
    nameEn: 'Turquoise Cyan',
    accentHex: '#0f766e',
    headerBg: 'bg-[#ecfeff] dark:bg-[#072428]',
    headerBorder: 'border-[#caf5f8] dark:border-cyan-950/60',
    pillBg: 'bg-[#115e59] text-white',
    iconBoxBorder: 'border-[#a2edf3] dark:border-slate-700/60',
    iconColor: 'text-[#0d9488] dark:text-[#2dd4bf]',
    kickerColor: 'text-[#0d9488] dark:text-[#2dd4bf]',
    titleHover: 'hover:text-[#0d9488] dark:hover:text-[#2dd4bf]',
    priceColor: 'text-[#115e59] dark:text-white',
    priceSub: 'text-[#115e59] dark:text-slate-200',
    hoursBg: 'bg-[#ccfbf1] dark:bg-teal-950/40 border-[#99f6e4] dark:border-teal-800/40 text-[#115e59] dark:text-[#2dd4bf]',
    hoursIconColor: 'text-[#0d9488] dark:text-[#2dd4bf]',
    checkBg: 'bg-[#ccfbf1] dark:bg-teal-950/60 text-[#0d9488] dark:text-teal-400',
    buttonBg: 'bg-[#0f766e] hover:bg-[#115e59]',
    cardBorderHover: 'border-[#caf5f8] dark:border-slate-800 hover:border-[#0f766e]/40 hover:shadow-[0_16px_40px_rgba(15,118,110,0.14)]'
  },

  // 8. Sunset Coral / Orange (برتقالي دافئ - من درجات اللوجو الذهبية)
  {
    id: 'coral',
    nameAr: 'برتقالي مرجاني',
    nameEn: 'Sunset Coral',
    accentHex: '#c2410c',
    headerBg: 'bg-[#fff7ed] dark:bg-[#301608]',
    headerBorder: 'border-[#fde1c9] dark:border-orange-950/60',
    pillBg: 'bg-[#9a3412] text-white',
    iconBoxBorder: 'border-[#fbc79d] dark:border-slate-700/60',
    iconColor: 'text-[#ea580c] dark:text-[#fb923c]',
    kickerColor: 'text-[#ea580c] dark:text-[#fb923c]',
    titleHover: 'hover:text-[#ea580c] dark:hover:text-[#fb923c]',
    priceColor: 'text-[#9a3412] dark:text-white',
    priceSub: 'text-[#9a3412] dark:text-slate-200',
    hoursBg: 'bg-[#ffedd5] dark:bg-orange-950/40 border-[#fed7aa] dark:border-orange-800/40 text-[#9a3412] dark:text-[#fb923c]',
    hoursIconColor: 'text-[#ea580c] dark:text-[#fb923c]',
    checkBg: 'bg-[#ffedd5] dark:bg-orange-950/60 text-[#ea580c] dark:text-orange-400',
    buttonBg: 'bg-[#c2410c] hover:bg-[#9a3412]',
    cardBorderHover: 'border-[#fde1c9] dark:border-slate-800 hover:border-[#c2410c]/40 hover:shadow-[0_16px_40px_rgba(194,65,12,0.14)]'
  }
];

// Mapping specific course IDs to their ideal matching logo color theme
const COURSE_ID_THEME_MAP: Record<string, string> = {
  'course-autism-inclusion': 'amber', // 1. Autism Classroom Inclusion: Warm Amber
  'course-qasp-s': 'rose',          // 2. QASP-S Supervisor: Rose Magenta
  'course-mand-training': 'purple', // 5. Mand & Speech: Royal Purple
  'course-toilet-training': 'emerald', // 6. Toilet Training & Independence: Emerald Green
  'course-verbal-behavior': 'cyan', // 7. Verbal Behavior: Turquoise Cyan
  'course-specialist-assessment': 'coral', // 8. Clinical Competency: Sunset Coral
  'course-medical-behavioral': 'rose',    // 9. Medical & Behavior: Rose Magenta
  'course-trauma-aba': 'amber',           // 10. Trauma Informed: Warm Amber
  'course-comorbidities': 'purple',       // 11. Dual Diagnoses: Royal Purple
  'course-qaba-ethics': 'teal',           // 12. Ethics: Raba Teal
  'course-peak': 'blue',                  // 13. PEAK System: Sky Blue
  'course-bip': 'coral',                  // 14. BIP Plans: Sunset Coral
  'course-data-graphing': 'cyan'          // 15. Data Graphing: Turquoise Cyan
};

/**
 * Returns the exact logo color theme for a course based on its id, explicit color, or index
 */
export function getCourseLogoTheme(course?: Partial<CourseItem> | null, index: number = 0): CourseLogoTheme {
  if (course?.id && COURSE_ID_THEME_MAP[course.id]) {
    const themeKey = COURSE_ID_THEME_MAP[course.id];
    const found = COURSE_LOGO_THEMES.find(t => t.id === themeKey);
    if (found) return found;
  }

  // Fallback by order or index modulo length
  const safeIndex = Math.abs(index) % COURSE_LOGO_THEMES.length;
  return COURSE_LOGO_THEMES[safeIndex];
}
