import { savePersistentModule } from '../utils/persistentSync';
import defaultSyncData from './defaultSyncData.json';

export interface CourseItem {
  id: string;
  titleAr: string;
  titleEn: string;
  shortTitle: string;
  hoursBadgeAr: string;
  hoursBadgeEn: string;
  hoursCount: number;
  ribbonTagAr: string;
  ribbonTagEn: string;
  categoryAr: string;
  categoryEn: string;
  badgeColor: string;
  tagHighlightAr: string;
  tagHighlightEn: string;
  descriptionAr: string;
  descriptionEn: string;
  featuresAr: string[];
  featuresEn: string[];
  priceDisplayAr: string;
  priceDisplayEn: string;
  accentColor: string;
  targetAudienceAr: string;
  targetAudienceEn: string;
  order: number;
}

export const COURSES_DATA: CourseItem[] = [
  {
    id: "course-qba",
    titleAr: "كورس محلل سلوكي مؤهل (QBA)",
    titleEn: "Qualified Behavior Analyst (QBA) Course",
    shortTitle: "محلل سلوكي مؤهل QBA",
    hoursBadgeAr: "270 ساعة تدريبية معتمدة",
    hoursBadgeEn: "270 Certified Training Hours",
    hoursCount: 270,
    ribbonTagAr: "منصة رابا التعليمية",
    ribbonTagEn: "RABA Academy",
    categoryAr: "اعتماد البورد العالمي QABA",
    categoryEn: "QABA International Certification",
    badgeColor: "from-fuchsia-600 to-pink-600",
    tagHighlightAr: "يشمل أيضاً: VB-MAPP - ABLLS-R - PEAK",
    tagHighlightEn: "Includes: VB-MAPP - ABLLS-R - PEAK",
    descriptionAr: "ابدأ رحلتك الاحترافية في تحليل السلوك التطبيقي مع محتوى تدريبي متكامل يؤهلك للحصول على اعتماد QBA الدولي والعمل كمحلل سلوك مؤهل ومستقل.",
    descriptionEn: "Begin your professional career in Applied Behavior Analysis with comprehensive curriculum qualifying you for international QBA certification.",
    featuresAr: [
      "270 ساعة تدريبية معتمدة دولياً ومستوفية لمتطلبات QABA",
      "يشمل أدوات التقييم الشاملة: VB-MAPP و ABLLS-R و PEAK",
      "تدريب عملي على تصميم الخطط العلاجية وتحليل البيانات الإكلينيكية",
      "إشراف مباشر من محللي سلوك معتمدين دولياً ومصنفين",
      "شهادة معتمدة دولياً ومسار مهني معترف به"
    ],
    featuresEn: [
      "270 QABA-accredited training hours meeting board criteria",
      "Includes core assessment tools: VB-MAPP, ABLLS-R, and PEAK",
      "Clinical case planning and behavior intervention strategy design",
      "Mentorship by board-certified behavioral analysts",
      "Internationally recognized certification & career path"
    ],
    priceDisplayAr: "شامل المنهج المعتمد والاختبارات",
    priceDisplayEn: "Includes Accredited Curriculum & Exams",
    accentColor: "#E11D48",
    targetAudienceAr: "أخصائيو التربية الخاصة، علم النفس، العلاج الوظيفي، والراغبون في رخصة QBA الدولية",
    targetAudienceEn: "Special educators, psychologists, and clinicians seeking QBA credentials",
    order: 1
  },
  {
    id: "course-abat",
    titleAr: "كورس فني تحليل سلوك تطبيقي (ABAT)",
    titleEn: "Applied Behavior Analysis Technician (ABAT)",
    shortTitle: "فني تحليل سلوك تطبيقي ABAT",
    hoursBadgeAr: "40 ساعة تدريبية معتمدة",
    hoursBadgeEn: "40 Certified Training Hours",
    hoursCount: 40,
    ribbonTagAr: "منصة رابا التعليمية",
    ribbonTagEn: "RABA Academy",
    categoryAr: "الاعتماد المهني الأول في ABA",
    categoryEn: "Entry-Level Professional Credential",
    badgeColor: "from-teal-500 to-emerald-600",
    tagHighlightAr: "تأهيل لاختبار البورد QABA - فني سلوك",
    tagHighlightEn: "Prepares for QABA ABAT Board Exam",
    descriptionAr: "ابدأ مسارك المهني في تحليل السلوك التطبيقي مع شهادة ABAT الدولية المؤهلة للعمل المباشر كفني سلوك تحت إشراف إكلينيكي معتمد.",
    descriptionEn: "Launch your career in ABA with the recognized ABAT qualification for direct 1-on-1 behavioral therapy implementation.",
    featuresAr: [
      "40 ساعة تدريبية معتمدة دولياً وفق معايير QABA",
      "التأهيل الشامل لاجتياز اختبار بورد ABAT بنجاح",
      "فهم أساليب التعزيز الإيجابي وإجراءات تعديل السلوك",
      "تطبيق استراتيجيات التدخل المبكر ومساعدة معلم الظل",
      "تطبيق عملي ونماذج تدريبية محاكية للميدان"
    ],
    featuresEn: [
      "40 QABA-accredited curriculum hours",
      "Full prep for the ABAT international certification exam",
      "Positive reinforcement and behavioral modification protocols",
      "Early intervention and shadow teaching methodologies",
      "Hands-on practice & simulated field models"
    ],
    priceDisplayAr: "شامل المادة العلمية والتدريب",
    priceDisplayEn: "Includes Course Material & Training",
    accentColor: "#00E5BE",
    targetAudienceAr: "الخريجون الجدد، معلمو الظل، ومقدمو الرعاية المهتمون بالتدخل العملي",
    targetAudienceEn: "Recent graduates, shadow teachers, and therapists seeking certified entry",
    order: 2
  },
  {
    id: "course-ceus-vbm-bip",
    titleAr: "طوّر خبرتك المهنية في ABA (ساعات CEUs)",
    titleEn: "Advance Your Professional ABA Practice (CEUs)",
    shortTitle: "طوّر خبرتك المهنية في ABA",
    hoursBadgeAr: "ساعات تعلم مستمر (CEUs)",
    hoursBadgeEn: "Continuous Education Units (CEUs)",
    hoursCount: 20,
    ribbonTagAr: "منصة رابا التعليمية",
    ribbonTagEn: "RABA Academy",
    categoryAr: "ساعات تعلم مستمر وتطوير إكلينيكي",
    categoryEn: "Clinical CEU Modules",
    badgeColor: "from-amber-500 to-orange-600",
    tagHighlightAr: "كورس VB-MAPP (10 ساعات) + كورس خطة BIP (10 ساعات)",
    tagHighlightEn: "Includes VB-MAPP (10 hrs) + BIP Plan (10 hrs)",
    descriptionAr: "طوّر معرفتك بأهم أدوات التقييم والتخطيط السلوكي: كورس إعداد خطة التدخل السلوكي (BIP) وكورس أداة (VB-MAPP) واحصل على ساعات تعلم مستمر تدعم مسيرتك المهنية.",
    descriptionEn: "Master behavioral assessment tools with VB-MAPP and BIP behavior intervention planning, gaining accredited CEUs.",
    featuresAr: [
      "كورس متقدم في أداة تقييم معالم السلوك اللفظي VB-MAPP (10 ساعات)",
      "كورس عملي في إعداد وصياغة خطة التدخل السلوكي الفردية BIP (10 ساعات)",
      "شهادة ساعات تعلم مستمر (CEUs) لتجديد الرخص المهنية",
      "دراسة حالات واقعية ونماذج تقييم عملية جاهزة للتطبيق",
      "حقيبة تدريبية ونماذج إكلينيكية متكاملة"
    ],
    featuresEn: [
      "10-hour intensive module on VB-MAPP Assessment Protocol",
      "10-hour practical workshop on BIP (Behavior Intervention Plans)",
      "Official CEU units for credential maintenance and renewal",
      "Real clinical case studies and customizable assessment forms",
      "Complete clinical toolkit & customizable forms"
    ],
    priceDisplayAr: "شامل ساعات التعليم المستمر",
    priceDisplayEn: "Includes Continuous CEU Units",
    accentColor: "#F59E0B",
    targetAudienceAr: "أخصائيو ABA الممارسون، مشرفو البرامج، والمحللون السلوكيون",
    targetAudienceEn: "Practicing behavior therapists, supervisors, and clinical directors",
    order: 3
  },
  {
    id: "course-specialist-skills",
    titleAr: "كورس مهارات أخصائي ABA",
    titleEn: "ABA Specialist Clinical Skills Course",
    shortTitle: "مهارات أخصائي ABA",
    hoursBadgeAr: "10 ساعات تدريبية مكثفة",
    hoursBadgeEn: "10 Intensive Training Hours",
    hoursCount: 10,
    ribbonTagAr: "منصة رابا التعليمية",
    ribbonTagEn: "RABA Academy",
    categoryAr: "مهارات سريرية وتطبيقية",
    categoryEn: "Clinical & Practical Skills",
    badgeColor: "from-sky-500 to-blue-600",
    tagHighlightAr: "طوّر مهاراتك وارتقِ بممارستك الإكلينيكية",
    tagHighlightEn: "Elevate your clinical ABA intervention skills",
    descriptionAr: "طوّر مهاراتك وارتقِ بممارستك في تحليل السلوك التطبيقي من خلال استراتيجيات إكلينيكية متقدمة في قياس السلوك وبناء جداول التعزيز وتطوير التواصل الوظيفي.",
    descriptionEn: "Upgrade your hands-on competencies in behavioral measurement, functional communication training, and reinforcement scheduling.",
    featuresAr: [
      "10 ساعات تدريبية مركزة على الممارسة الإكلينيكية الميدانية",
      "تقنيات إدارة السلوكيات التحديات والتقليل من المشكلات السلوكية",
      "تطوير التواصل الوظيفي البديل (FCT) وجداول الأنشطة المرئية",
      "قياس وتسجيل البيانات السلوكية وتحليل منحنيات التطور",
      "إشراف إكلينيكي وتطبيقات عملية متقدمة"
    ],
    featuresEn: [
      "10 hours focused on direct clinical intervention",
      "Challenging behavior de-escalation and functional replacement",
      "Functional Communication Training (FCT) and visual scheduling",
      "Data collection protocols, graphing, and progress monitoring",
      "Clinical supervision & advanced practice"
    ],
    priceDisplayAr: "شامل التدريب والمتابعة الإكلينيكية",
    priceDisplayEn: "Includes Clinical Supervision & Training",
    accentColor: "#38BDF8",
    targetAudienceAr: "الأخصائيون، معلمو التربية الخاصة، ومقدمو الرعاية الصحية",
    targetAudienceEn: "Therapists, special education teachers, and allied healthcare staff",
    order: 4
  }
];

export const STORAGE_COURSES_KEY = 'raba_courses_data_v1';

export function getStoredCoursesData(): CourseItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_COURSES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    }
    const bundled = (defaultSyncData as any)?.data?.[STORAGE_COURSES_KEY];
    if (Array.isArray(bundled) && bundled.length > 0) {
      return [...bundled].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    }
    return [...COURSES_DATA];
  } catch {
    return [...COURSES_DATA];
  }
}

export function saveStoredCoursesData(courses: CourseItem[]): void {
  try {
    localStorage.setItem(STORAGE_COURSES_KEY, JSON.stringify(courses));
    savePersistentModule(STORAGE_COURSES_KEY, courses);
    window.dispatchEvent(new CustomEvent('raba_courses_updated', { detail: courses }));
  } catch (err) {
    console.error('Failed to save courses data', err);
  }
}
