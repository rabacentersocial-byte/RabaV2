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
  // 1. Primary #2E86EB (Medical Blue)
  {
    id: 'blue',
    nameAr: 'أزرق رابا الأساسي',
    nameEn: 'Primary Blue',
    accentHex: '#2E86EB',
    headerBg: 'bg-blue-50/70 dark:bg-[#0c2340]',
    headerBorder: 'border-blue-100 dark:border-blue-950/60',
    pillBg: 'bg-[#2E86EB] text-white',
    iconBoxBorder: 'border-blue-200 dark:border-slate-700/60',
    iconColor: 'text-[#2E86EB] dark:text-[#60a5fa]',
    kickerColor: 'text-[#2E86EB] dark:text-[#60a5fa]',
    titleHover: 'hover:text-[#2E86EB] dark:hover:text-[#60a5fa]',
    priceColor: 'text-[#2E86EB] dark:text-white',
    priceSub: 'text-[#2E86EB] dark:text-slate-200',
    hoursBg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/40 text-[#2E86EB] dark:text-[#60a5fa]',
    hoursIconColor: 'text-[#2E86EB] dark:text-[#60a5fa]',
    checkBg: 'bg-blue-50 dark:bg-blue-950/60 text-[#2E86EB] dark:text-blue-400',
    buttonBg: 'bg-[#2E86EB] hover:bg-[#1d74d8]',
    cardBorderHover: 'border-blue-100 dark:border-slate-800 hover:border-[#2E86EB]/50 hover:shadow-[0_16px_40px_rgba(46,134,235,0.16)]'
  },

  // 2. Secondary #FFD23F (Warm Gold / Saffron)
  {
    id: 'amber',
    nameAr: 'ذهبي عنبري',
    nameEn: 'Warm Gold',
    accentHex: '#FFD23F',
    headerBg: 'bg-amber-50/70 dark:bg-[#2b1f06]',
    headerBorder: 'border-amber-100 dark:border-amber-950/60',
    pillBg: 'bg-[#FFD23F] text-slate-950 font-black',
    iconBoxBorder: 'border-amber-200 dark:border-slate-700/60',
    iconColor: 'text-amber-700 dark:text-[#FFD23F]',
    kickerColor: 'text-amber-700 dark:text-[#FFD23F]',
    titleHover: 'hover:text-amber-700 dark:hover:text-[#FFD23F]',
    priceColor: 'text-amber-800 dark:text-white',
    priceSub: 'text-amber-800 dark:text-slate-200',
    hoursBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-[#FFD23F]',
    hoursIconColor: 'text-amber-700 dark:text-[#FFD23F]',
    checkBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
    buttonBg: 'bg-[#FFD23F] hover:bg-[#f5c724] text-slate-950 font-black',
    cardBorderHover: 'border-amber-100 dark:border-slate-800 hover:border-[#FFD23F]/50 hover:shadow-[0_16px_40px_rgba(255,210,63,0.16)]'
  },

  // 3. Tertiary #22C55E (Emerald Green)
  {
    id: 'emerald',
    nameAr: 'أخضر زمردي',
    nameEn: 'Emerald Green',
    accentHex: '#22C55E',
    headerBg: 'bg-emerald-50/70 dark:bg-[#082b16]',
    headerBorder: 'border-emerald-100 dark:border-emerald-950/60',
    pillBg: 'bg-[#22C55E] text-white',
    iconBoxBorder: 'border-emerald-200 dark:border-slate-700/60',
    iconColor: 'text-[#15803d] dark:text-[#4ade80]',
    kickerColor: 'text-[#15803d] dark:text-[#4ade80]',
    titleHover: 'hover:text-[#15803d] dark:hover:text-[#4ade80]',
    priceColor: 'text-[#15803d] dark:text-white',
    priceSub: 'text-[#15803d] dark:text-slate-200',
    hoursBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40 text-[#15803d] dark:text-[#4ade80]',
    hoursIconColor: 'text-[#15803d] dark:text-[#4ade80]',
    checkBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-[#15803d] dark:text-emerald-400',
    buttonBg: 'bg-[#22C55E] hover:bg-[#16a34a]',
    cardBorderHover: 'border-emerald-100 dark:border-slate-800 hover:border-[#22C55E]/50 hover:shadow-[0_16px_40px_rgba(34,197,94,0.16)]'
  },

  // 4. Accent #FF2D9B (Neon Magenta)
  {
    id: 'rose',
    nameAr: 'وردي فوشيا',
    nameEn: 'Neon Magenta',
    accentHex: '#FF2D9B',
    headerBg: 'bg-pink-50/70 dark:bg-[#2e0b1d]',
    headerBorder: 'border-pink-100 dark:border-pink-950/60',
    pillBg: 'bg-[#FF2D9B] text-white',
    iconBoxBorder: 'border-pink-200 dark:border-slate-700/60',
    iconColor: 'text-[#be185d] dark:text-[#f472b6]',
    kickerColor: 'text-[#be185d] dark:text-[#f472b6]',
    titleHover: 'hover:text-[#be185d] dark:hover:text-[#f472b6]',
    priceColor: 'text-[#be185d] dark:text-white',
    priceSub: 'text-[#be185d] dark:text-slate-200',
    hoursBg: 'bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800/40 text-[#be185d] dark:text-[#f472b6]',
    hoursIconColor: 'text-[#be185d] dark:text-[#f472b6]',
    checkBg: 'bg-pink-50 dark:bg-pink-950/60 text-[#be185d] dark:text-pink-400',
    buttonBg: 'bg-[#FF2D9B] hover:bg-[#e01980]',
    cardBorderHover: 'border-pink-100 dark:border-slate-800 hover:border-[#FF2D9B]/50 hover:shadow-[0_16px_40px_rgba(255,45,155,0.16)]'
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
