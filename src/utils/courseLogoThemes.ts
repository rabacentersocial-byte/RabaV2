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
  // 1. Primary Sky Blue
  {
    id: 'blue',
    nameAr: 'برتقالي رابا المشع',
    nameEn: 'Solar Orange',
    accentHex: '#2B95FF',
    headerBg: 'bg-[#2B95FF]/[0.08] dark:bg-white/[0.04]',
    headerBorder: 'border-[#161B26]/[0.06] dark:border-white/10',
    pillBg: 'bg-[#2B95FF] text-white',
    iconBoxBorder: 'border-[#161B26]/10 dark:border-white/15',
    iconColor: 'text-[#1263D6] dark:text-[#60AFFF]',
    kickerColor: 'text-[#1263D6] dark:text-[#60AFFF]',
    titleHover: 'hover:text-[#1263D6] dark:hover:text-[#60AFFF]',
    priceColor: 'text-[#161B26] dark:text-[#F8FAFC]',
    priceSub: 'text-[#4B5563] dark:text-[#94A3B8]',
    hoursBg: 'bg-white/75 dark:bg-white/[0.06] border-[#161B26]/10 dark:border-white/10 text-[#161B26] dark:text-[#F8FAFC]',
    hoursIconColor: 'text-[#2B95FF]',
    checkBg: 'bg-[#2B95FF]/15 text-[#1263D6] dark:text-[#60AFFF]',
    buttonBg: 'bg-[#2B95FF] hover:bg-[#1A73E8] text-white',
    cardBorderHover: 'hover:border-[#2B95FF]/50'
  },

  // 2. Warm Gold / Saffron
  {
    id: 'amber',
    nameAr: 'ذهبي عنبري',
    nameEn: 'Warm Gold',
    accentHex: '#F59E0B',
    headerBg: 'bg-[#F59E0B]/[0.08] dark:bg-white/[0.04]',
    headerBorder: 'border-[#161B26]/[0.06] dark:border-white/10',
    pillBg: 'bg-[#D97706] dark:bg-[#1E293B] text-white dark:text-[#F8FAFC] dark:border dark:border-white/15 font-black',
    iconBoxBorder: 'border-[#161B26]/10 dark:border-white/15',
    iconColor: 'text-[#B45309] dark:text-[#FBBF24]',
    kickerColor: 'text-[#B45309] dark:text-[#FBBF24]',
    titleHover: 'hover:text-[#1263D6] dark:hover:text-[#60AFFF]',
    priceColor: 'text-[#161B26] dark:text-[#F8FAFC]',
    priceSub: 'text-[#4B5563] dark:text-[#94A3B8]',
    hoursBg: 'bg-white/75 dark:bg-white/[0.06] border-[#161B26]/10 dark:border-white/10 text-[#161B26] dark:text-[#F8FAFC]',
    hoursIconColor: 'text-[#B45309] dark:text-[#FBBF24]',
    checkBg: 'bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24]',
    buttonBg: 'bg-[#2B95FF] hover:bg-[#1A73E8] text-white',
    cardBorderHover: 'hover:border-[#F59E0B]/50'
  },

  // 3. Emerald Growth
  {
    id: 'emerald',
    nameAr: 'رملي دافئ',
    nameEn: 'Warm Sand',
    accentHex: '#10B981',
    headerBg: 'bg-[#10B981]/[0.08] dark:bg-white/[0.04]',
    headerBorder: 'border-[#161B26]/[0.06] dark:border-white/10',
    pillBg: 'bg-[#10B981] text-white',
    iconBoxBorder: 'border-[#161B26]/10 dark:border-white/15',
    iconColor: 'text-[#047857] dark:text-[#34D399]',
    kickerColor: 'text-[#047857] dark:text-[#34D399]',
    titleHover: 'hover:text-[#047857] dark:hover:text-[#34D399]',
    priceColor: 'text-[#161B26] dark:text-[#F8FAFC]',
    priceSub: 'text-[#4B5563] dark:text-[#94A3B8]',
    hoursBg: 'bg-white/75 dark:bg-white/[0.06] border-[#161B26]/10 dark:border-white/10 text-[#161B26] dark:text-[#F8FAFC]',
    hoursIconColor: 'text-[#10B981]',
    checkBg: 'bg-[#10B981]/15 text-[#047857] dark:text-[#34D399]',
    buttonBg: 'bg-[#2B95FF] hover:bg-[#1A73E8] text-white',
    cardBorderHover: 'hover:border-[#10B981]/50'
  },

  // 4. Rose Clinical Accent
  {
    id: 'rose',
    nameAr: 'جمر دافئ',
    nameEn: 'Deep Ember',
    accentHex: '#E11D48',
    headerBg: 'bg-rose-500/[0.08] dark:bg-white/[0.04]',
    headerBorder: 'border-[#161B26]/[0.06] dark:border-white/10',
    pillBg: 'bg-[#E11D48] text-white',
    iconBoxBorder: 'border-[#161B26]/10 dark:border-white/15',
    iconColor: 'text-[#BE123C] dark:text-[#FB7185]',
    kickerColor: 'text-[#BE123C] dark:text-[#FB7185]',
    titleHover: 'hover:text-[#BE123C] dark:hover:text-[#FB7185]',
    priceColor: 'text-[#161B26] dark:text-[#F8FAFC]',
    priceSub: 'text-[#4B5563] dark:text-[#94A3B8]',
    hoursBg: 'bg-white/75 dark:bg-white/[0.06] border-[#161B26]/10 dark:border-white/10 text-[#161B26] dark:text-[#F8FAFC]',
    hoursIconColor: 'text-[#E11D48]',
    checkBg: 'bg-rose-500/15 text-[#BE123C] dark:text-[#FB7185]',
    buttonBg: 'bg-[#2B95FF] hover:bg-[#1A73E8] text-white',
    cardBorderHover: 'hover:border-rose-500/50'
  },

  // 5. Vibrant Violet
  {
    id: 'purple',
    nameAr: 'أوبسيديان دافئ',
    nameEn: 'Warm Obsidian',
    accentHex: '#8B5CF6',
    headerBg: 'bg-[#8B5CF6]/[0.08] dark:bg-white/[0.05]',
    headerBorder: 'border-[#161B26]/[0.06] dark:border-white/10',
    pillBg: 'bg-[#8B5CF6] text-white',
    iconBoxBorder: 'border-[#161B26]/10 dark:border-white/15',
    iconColor: 'text-[#6D28D9] dark:text-[#A78BFA]',
    kickerColor: 'text-[#6D28D9] dark:text-[#A78BFA]',
    titleHover: 'hover:text-[#6D28D9] dark:hover:text-[#A78BFA]',
    priceColor: 'text-[#161B26] dark:text-[#F8FAFC]',
    priceSub: 'text-[#4B5563] dark:text-[#94A3B8]',
    hoursBg: 'bg-white/75 dark:bg-white/[0.06] border-[#161B26]/10 dark:border-white/10 text-[#161B26] dark:text-[#F8FAFC]',
    hoursIconColor: 'text-[#8B5CF6]',
    checkBg: 'bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA]',
    buttonBg: 'bg-[#2B95FF] hover:bg-[#1A73E8] text-white',
    cardBorderHover: 'hover:border-[#8B5CF6]/50'
  },

  // 6. Organic Emerald
  {
    id: 'emerald-2',
    nameAr: 'أخضر دافئ',
    nameEn: 'Warm Olive',
    accentHex: '#10B981',
    headerBg: 'bg-[#10B981]/[0.06] dark:bg-white/[0.04]',
    headerBorder: 'border-[#161B26]/[0.06] dark:border-white/10',
    pillBg: 'bg-[#059669] dark:bg-[#1E293B] text-white dark:text-[#F8FAFC] dark:border dark:border-white/15',
    iconBoxBorder: 'border-[#161B26]/10 dark:border-white/15',
    iconColor: 'text-[#047857] dark:text-[#34D399]',
    kickerColor: 'text-[#047857] dark:text-[#34D399]',
    titleHover: 'hover:text-[#047857] dark:hover:text-[#34D399]',
    priceColor: 'text-[#161B26] dark:text-[#F8FAFC]',
    priceSub: 'text-[#4B5563] dark:text-[#94A3B8]',
    hoursBg: 'bg-white/75 dark:bg-white/[0.06] border-[#161B26]/10 dark:border-white/10 text-[#161B26] dark:text-[#F8FAFC]',
    hoursIconColor: 'text-[#10B981]',
    checkBg: 'bg-[#10B981]/15 text-[#047857] dark:text-[#34D399]',
    buttonBg: 'bg-[#2B95FF] hover:bg-[#1A73E8] text-white',
    cardBorderHover: 'hover:border-[#10B981]/50'
  },

  // 7. Azure Cyan
  {
    id: 'cyan',
    nameAr: 'تيراكوتا دافئ',
    nameEn: 'Warm Terracotta',
    accentHex: '#0284C7',
    headerBg: 'bg-sky-500/[0.08] dark:bg-white/[0.04]',
    headerBorder: 'border-[#161B26]/[0.06] dark:border-white/10',
    pillBg: 'bg-[#0284C7] text-white',
    iconBoxBorder: 'border-[#161B26]/10 dark:border-white/15',
    iconColor: 'text-[#0369A1] dark:text-[#38BDF8]',
    kickerColor: 'text-[#0369A1] dark:text-[#38BDF8]',
    titleHover: 'hover:text-[#1263D6] dark:hover:text-[#60AFFF]',
    priceColor: 'text-[#161B26] dark:text-[#F8FAFC]',
    priceSub: 'text-[#4B5563] dark:text-[#94A3B8]',
    hoursBg: 'bg-white/75 dark:bg-white/[0.06] border-[#161B26]/10 dark:border-white/10 text-[#161B26] dark:text-[#F8FAFC]',
    hoursIconColor: 'text-[#0284C7]',
    checkBg: 'bg-sky-500/15 text-[#0369A1] dark:text-[#38BDF8]',
    buttonBg: 'bg-[#2B95FF] hover:bg-[#1A73E8] text-white',
    cardBorderHover: 'hover:border-[#2B95FF]/50'
  },

  // 8. Royal Indigo / Violet
  {
    id: 'coral',
    nameAr: 'برتقالي مرجاني',
    nameEn: 'Sunset Coral',
    accentHex: '#6366F1',
    headerBg: 'bg-indigo-500/[0.08] dark:bg-white/[0.04]',
    headerBorder: 'border-[#161B26]/[0.06] dark:border-white/10',
    pillBg: 'bg-[#6366F1] text-white',
    iconBoxBorder: 'border-[#161B26]/10 dark:border-white/15',
    iconColor: 'text-[#4338CA] dark:text-[#818CF8]',
    kickerColor: 'text-[#4338CA] dark:text-[#818CF8]',
    titleHover: 'hover:text-[#4338CA] dark:hover:text-[#818CF8]',
    priceColor: 'text-[#161B26] dark:text-[#F8FAFC]',
    priceSub: 'text-[#4B5563] dark:text-[#94A3B8]',
    hoursBg: 'bg-white/75 dark:bg-white/[0.06] border-[#161B26]/10 dark:border-white/10 text-[#161B26] dark:text-[#F8FAFC]',
    hoursIconColor: 'text-[#6366F1]',
    checkBg: 'bg-indigo-500/15 text-[#4338CA] dark:text-[#818CF8]',
    buttonBg: 'bg-[#2B95FF] hover:bg-[#1A73E8] text-white',
    cardBorderHover: 'hover:border-indigo-500/50'
  }
];

// Mapping specific course IDs to their ideal matching logo color theme
const COURSE_ID_THEME_MAP: Record<string, string> = {
  'course-abat': 'cyan',            // 1. ABAT Technician: Turquoise Cyan
  'course-qba': 'blue',             // 2. QBA Analyst: Primary Blue
  'course-vb-mapp': 'purple',       // 3. VB-MAPP Assessment: Royal Purple
  'course-autism-inclusion': 'amber', // 4. Autism Classroom Inclusion: Warm Amber
  'course-qasp-s': 'rose',          // 5. QASP-S Supervisor: Rose Magenta
  'course-mand-training': 'purple', // 6. Mand & Speech: Royal Purple
  'course-toilet-training': 'emerald', // 7. Toilet Training & Independence: Emerald Green
  'course-verbal-behavior': 'cyan', // 8. Verbal Behavior: Turquoise Cyan
  'course-specialist-assessment': 'coral', // 9. Clinical Competency: Sunset Coral
  'course-medical-behavioral': 'rose',    // 10. Medical & Behavior: Rose Magenta
  'course-trauma-aba': 'amber',           // 11. Trauma Informed: Warm Amber
  'course-comorbidities': 'purple',       // 12. Dual Diagnoses: Royal Purple
  'course-qaba-ethics': 'cyan',           // 13. Ethics: Turquoise Cyan
  'course-peak': 'blue',                  // 14. PEAK System: Sky Blue
  'course-bip': 'coral',                  // 15. BIP Plans: Sunset Coral
  'course-data-graphing': 'cyan'          // 16. Data Graphing: Turquoise Cyan
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
