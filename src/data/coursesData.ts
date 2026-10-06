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
  isActive?: boolean;
  cardCoverUrl?: string;
}

export interface CoursesSectionSettings {
  badgeAr: string;
  badgeEn: string;
  titlePart1Ar: string;
  titleHighlightAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  whatsappNumber: string;
}

export const DEFAULT_COURSES_SETTINGS: CoursesSectionSettings = {
  badgeAr: 'الكورسات والدورات التدريبية',
  badgeEn: 'COURSES & PROFESSIONAL TRAINING',
  titlePart1Ar: 'طوّر مسارك المهني في',
  titleHighlightAr: 'تحليل السلوك التطبيقي (ABA)',
  titleEn: 'Advance Your Clinical Career in Applied Behavior Analysis',
  subtitleAr: 'برامج تدريبية معتمدة دولياً ومصممة بأعلى المعايير الإكلينيكية لتزويدك بالمعرفة النظرية والمهارات التطبيقية في التقييم والتدخل السلوكي.',
  subtitleEn: 'Internationally accredited training programs designed to build rigorous clinical competencies in behavior assessment and intervention.',
  whatsappNumber: '966575100100'
};

export const COURSES_DATA: CourseItem[] = [
  {
    "id": "course-qba",
    "titleAr": "كورس محلل سلوكي مؤهل (QBA)",
    "titleEn": "Qualified Behavior Analyst (QBA) Course",
    "shortTitle": "محلل سلوكي مؤهل QBA",
    "hoursBadgeAr": "270 ساعة تدريبية معتمدة",
    "hoursBadgeEn": "270 Certified Training Hours",
    "hoursCount": 270,
    "ribbonTagAr": "اعتماد البورد الدولي QABA",
    "ribbonTagEn": "QABA International Certification",
    "categoryAr": "اعتماد البورد العالمي QABA",
    "categoryEn": "QABA International Certification",
    "badgeColor": "#E11D48",
    "tagHighlightAr": "يشمل: VB-MAPP - ABLLS-R - PEAK",
    "tagHighlightEn": "Includes: VB-MAPP - ABLLS-R - PEAK",
    "descriptionAr": "ابدأ رحلتك الاحترافية في تحليل السلوك التطبيقي مع محتوى تدريبي متكامل يؤهلك للحصول على اعتماد QBA الدولي والعمل كمحلل سلوك مؤهل ومستقل.",
    "descriptionEn": "Begin your professional career in Applied Behavior Analysis with comprehensive curriculum qualifying you for international QBA certification.",
    "featuresAr": [
      "270 ساعة تدريبية معتمدة دولياً ومستوفية لمتطلبات QABA",
      "يشمل أدوات التقييم الشاملة: VB-MAPP و ABLLS-R و PEAK",
      "تدريب عملي على تصميم الخطط العلاجية وتحليل البيانات الإكلينيكية",
      "إشراف مباشر من محللي سلوك معتمدين دولياً ومصنفين",
      "شهادة معتمدة دولياً ومسار مهني معترف به عالمياً"
    ],
    "featuresEn": [
      "270 QABA-accredited training hours meeting board criteria",
      "Includes core assessment tools: VB-MAPP, ABLLS-R, and PEAK",
      "Clinical case planning and behavior intervention strategy design",
      "Mentorship by board-certified behavioral analysts",
      "Internationally recognized certification & career path"
    ],
    "priceDisplayAr": "شامل المنهج المعتمد والاختبارات",
    "priceDisplayEn": "Includes Accredited Curriculum & Exams",
    "accentColor": "#E11D48",
    "targetAudienceAr": "أخصائيو التربية الخاصة، علم النفس، العلاج الوظيفي، والراغبون في رخصة QBA الدولية",
    "targetAudienceEn": "Special educators, psychologists, and clinicians seeking QBA credentials",
    "order": 1,
    "isActive": true
  },
  {
    "id": "course-abat",
    "titleAr": "كورس فني تحليل سلوك تطبيقي (ABAT)",
    "titleEn": "Applied Behavior Analysis Technician (ABAT)",
    "shortTitle": "فني تحليل سلوك تطبيقي ABAT",
    "hoursBadgeAr": "40 ساعة تدريبية معتمدة",
    "hoursBadgeEn": "40 Certified Training Hours",
    "hoursCount": 40,
    "ribbonTagAr": "الاعتماد المهني الأول في ABA",
    "ribbonTagEn": "Entry-Level Credential",
    "categoryAr": "الاعتماد المهني الأول في ABA",
    "categoryEn": "Entry-Level Professional Credential",
    "badgeColor": "#00E5BE",
    "tagHighlightAr": "تأهيل لاختبار البورد QABA - فني سلوك",
    "tagHighlightEn": "Prepares for QABA ABAT Board Exam",
    "descriptionAr": "ابدأ مسارك المهني في تحليل السلوك التطبيقي مع شهادة ABAT الدولية المؤهلة للعمل المباشر كفني سلوك تحت إشراف إكلينيكي معتمد.",
    "descriptionEn": "Launch your career in ABA with the recognized ABAT qualification for direct 1-on-1 behavioral therapy implementation.",
    "featuresAr": [
      "40 ساعة تدريبية معتمدة دولياً وفق معايير QABA",
      "التأهيل الشامل لاجتياز اختبار بورد ABAT بنجاح",
      "فهم أساليب التعزيز الإيجابي وإجراءات تعديل السلوك",
      "تطبيق استراتيجيات التدخل المبكر ومساعدة معلم الظل",
      "تطبيق عملي ونماذج تدريبية محاكية للميدان"
    ],
    "featuresEn": [
      "40 QABA-accredited curriculum hours",
      "Full prep for the ABAT international certification exam",
      "Positive reinforcement and behavioral modification protocols",
      "Early intervention and shadow teaching methodologies",
      "Hands-on practice & simulated field models"
    ],
    "priceDisplayAr": "شامل المادة العلمية والتدريب",
    "priceDisplayEn": "Includes Course Material & Training",
    "accentColor": "#00E5BE",
    "targetAudienceAr": "الخريجون الجدد، معلمو الظل، ومقدمو الرعاية المهتمون بالتدخل العملي",
    "targetAudienceEn": "Recent graduates, shadow teachers, and therapists seeking certified entry",
    "order": 2,
    "isActive": true
  },
  {
    "id": "course-qasp-s",
    "titleAr": "كورس مشرف خدمات التوحد المؤهل (QASP-S)",
    "titleEn": "Qualified Autism Services Practitioner-Supervisor (QASP-S)",
    "shortTitle": "مشرف خدمات التوحد QASP-S",
    "hoursBadgeAr": "188 ساعة تدريبية معتمدة",
    "hoursBadgeEn": "188 Certified Training Hours",
    "hoursCount": 188,
    "ribbonTagAr": "اعتماد البورد الأمريكي QABA",
    "ribbonTagEn": "American Board Certification",
    "categoryAr": "اعتماد البورد الأمريكي QABA",
    "categoryEn": "QABA American Board Credential",
    "badgeColor": "#7C3AED",
    "tagHighlightAr": "188 ساعة تدريبية - خصم 30% لفترة محدودة",
    "tagHighlightEn": "188 Training Hours - 30% Discount",
    "descriptionAr": "يتناول الكورس متطلبات اعتماد البورد الأمريكي لهذا المستوى والمكون من 188 ساعة تدريبية لتأهيل وإعداد مشرفي خدمات التوحد وتصميم برامج التدخل والإشراف الإكلينيكي.",
    "descriptionEn": "Comprehensive 188-hour training program meeting American QABA Board requirements for supervisory autism service credentials.",
    "featuresAr": [
      "اساسيات تحليل السلوك التطبيقي ABA المتقدمة",
      "جمع وتحليل البيانات وأنظمة القياس الإكلينيكي",
      "تدخلات إكساب المهارات وتدخلات خفض السلوك والتدخل في السوابق",
      "التقييم الشامل والتدريب والإشراف الإكلينيكي الميداني",
      "الأخلاقيات والقوانين المهنية والمعرفة الأساسية باضطراب طيف التوحد"
    ],
    "featuresEn": [
      "Advanced ABA behavioral principles and methodologies",
      "Behavioral data collection, graphing, and measurement systems",
      "Skill acquisition protocols, behavior reduction, and antecedent strategies",
      "Comprehensive clinical assessment, staff training, and supervision",
      "Professional ethics, regulatory compliance, and core ASD foundations"
    ],
    "priceDisplayAr": "3500 ريال (بعد خصم 30% - الأصل 5000 ريال)",
    "priceDisplayEn": "3500 SAR (After 30% Off - Orig. 5000 SAR)",
    "accentColor": "#7C3AED",
    "targetAudienceAr": "أخصائيو التربية الخاصة، مشرفو البرامج السلوكية، وممارسو التوحد الساعون لرخصة QASP-S",
    "targetAudienceEn": "Special education supervisors, behavior therapists, and autism practitioners",
    "order": 3,
    "isActive": true
  },
  {
    "id": "course-mand-training",
    "titleAr": "كورس التدريب على الطلب (Mand Training)",
    "titleEn": "Mand Training Course: Functional Request Development",
    "shortTitle": "التدريب على الطلب (Mand)",
    "hoursBadgeAr": "6 ساعات معتمدة (6 CEUs)",
    "hoursBadgeEn": "6 Certified CEUs",
    "hoursCount": 6,
    "ribbonTagAr": "ساعات تعلم مستمر CEUs",
    "ribbonTagEn": "Continuous Education Units",
    "categoryAr": "تطوير التواصل اللغوي والطلب",
    "categoryEn": "Functional Communication & Mand",
    "badgeColor": "#0284C7",
    "tagHighlightAr": "6 CEUs معتمدة - بناء مهارات الطلب الوظيفي",
    "tagHighlightEn": "6 Accredited CEUs - Mand Mastery",
    "descriptionAr": "يتناول الكورس أسس ومهارات تعليم الطفل كيفية التعبير عن احتياجاته ورغباته بطريقة وظيفية، مع التركيز على الدافعية، وتطبيقات PECS، والتواصل البديل.",
    "descriptionEn": "Teaches essential skills to help non-verbal and minimally verbal learners express wants and needs functionally through motivation and AAC.",
    "featuresAr": [
      "مفهوم الـ Mand وأهميته المحورية في تحليل السلوك وسكنر",
      "تحديد المعززات الفعالة وتقييم الدافعية (MO) لدى المتعلم",
      "بناء مهارات الطلب اللفظي وغير اللفظي واستخدام PECS والوسائل البديلة",
      "استراتيجيات زيادة الاستقلالية وتعميم مهارات الطلب في بيئات متعددة",
      "التعامل مع أخطاء ومشكلات التواصل أثناء التدريب وتطبيقات عملية ونماذج تدريبية"
    ],
    "featuresEn": [
      "Mand conceptual framework and its core value in verbal behavior",
      "Motivating Operations (MO) analysis and preference assessment",
      "Verbal, vocal, and non-verbal manding with PECS and AAC integration",
      "Systematic prompt fading, mand generalization, and spontaneity",
      "Troubleshooting communication barriers & hands-on case simulations"
    ],
    "priceDisplayAr": "200 ريال",
    "priceDisplayEn": "200 SAR",
    "accentColor": "#0284C7",
    "targetAudienceAr": "أخصائيو السلوك، أخصائيو النطق والتخاطب، ومعلمو التربية الخاصة ومقدمو الرعاية",
    "targetAudienceEn": "Behavior therapists, SLPs, special education teachers, and shadow staff",
    "order": 4,
    "isActive": true
  },
  {
    "id": "course-toilet-training",
    "titleAr": "كورس التدريب على مهارات الحمام (Toilet Training)",
    "titleEn": "Toilet Training Protocol for Autism & Developmental Delays",
    "shortTitle": "مهارات الحمام (Toilet Training)",
    "hoursBadgeAr": "2 ساعة معتمدة (2 CEUs)",
    "hoursBadgeEn": "2 Certified CEUs",
    "hoursCount": 2,
    "ribbonTagAr": "مهارات الاستقلالية الذاتية",
    "ribbonTagEn": "Independent Living Skills",
    "categoryAr": "الاستقلالية والعناية بالذات",
    "categoryEn": "Self-Care & Independence",
    "badgeColor": "#10B981",
    "tagHighlightAr": "2 CEUs معتمدة - خطة تدريب عملية فردية",
    "tagHighlightEn": "2 Accredited CEUs - Individualized Plan",
    "descriptionAr": "كورس عملي تطبيقي لتصميم وتنفيذ برامج تدريب استخدام الحمام، وتقييم الجاهزية، والجدولة والتعزيز والتلقين، وخفض الاعتماد على المساعدة تدريجياً.",
    "descriptionEn": "Practical, evidence-based workshop to design and implement successful toilet training programs for learners with autism.",
    "featuresAr": [
      "تقييم الجاهزية الفسيولوجية والسلوكية للتدريب",
      "تحليل السلوكيات والحواجز المرتبطة باستخدام الحمام",
      "إعداد خطة تدريب فردية متكاملة (الجدولة، التعزيز، والتلقين)",
      "التعامل الفعال مع حالات الرفض والحوادث الطارئة",
      "خفض الاعتماد على المساعدة تدريجياً وتعميم المهارة ومتابعة البيانات"
    ],
    "featuresEn": [
      "Physiological and behavioral readiness evaluation",
      "Functional task analysis of toileting sequences & barrier identification",
      "Comprehensive individualized plan: scheduling, reinforcement, and prompting",
      "Managing resistance, fear, accidents, and nighttime routines",
      "Systematic prompt fading, skill generalization, and longitudinal data tracking"
    ],
    "priceDisplayAr": "150 ريال",
    "priceDisplayEn": "150 SAR",
    "accentColor": "#10B981",
    "targetAudienceAr": "أخصائيو العلاج السلوكي والوظيفي، أولياء الأمور، ومعلمو التربية الخاصة",
    "targetAudienceEn": "Behavior analysts, occupational therapists, parents, and educators",
    "order": 5,
    "isActive": true
  },
  {
    "id": "course-verbal-behavior",
    "titleAr": "كورس السلوك اللغوي (Verbal Behavior)",
    "titleEn": "Verbal Behavior (VB) Approach in Autism Intervention",
    "shortTitle": "السلوك اللغوي Verbal Behavior",
    "hoursBadgeAr": "10 ساعات معتمدة (10 CEUs)",
    "hoursBadgeEn": "10 Certified CEUs",
    "hoursCount": 10,
    "ribbonTagAr": "ساعات تعلم مستمر CEUs",
    "ribbonTagEn": "Continuous Education Units",
    "categoryAr": "تطوير اللغة والتواصل",
    "categoryEn": "Language & Verbal Behavior",
    "badgeColor": "#8B5CF6",
    "tagHighlightAr": "10 CEUs معتمدة - Mand, Tact, Echoic, Intraverbal",
    "tagHighlightEn": "10 Accredited CEUs - Verbal Operants",
    "descriptionAr": "يتناول تطبيق مبادئ Verbal Behavior وفقاً لسكنر في تطوير مهارات التواصل واللغة، مع التركيز على الموجهات اللفظية وتصميم البرامج للأطفال ذوي التوحد.",
    "descriptionEn": "Explores Skinner's functional analysis of verbal behavior for language development, covering verbal operants and clinical implementation.",
    "featuresAr": [
      "مفهوم السلوك اللغوي وفقاً لـ Skinner وتطبيقاته الإكلينيكية",
      "الموجهات اللفظية الأساسية: Mand, Tact, Echoic, Intraverbal",
      "استجابة المستمع (Listener Responding) وأهمية الدافعية في اكتساب اللغة",
      "تقييم المهارات اللغوية وتحديد الأولويات وتصميم البرامج التعليمية",
      "استراتيجيات التلقين والتشكيل والتعميم مع الأطفال ذوي طيف التوحد"
    ],
    "featuresEn": [
      "B.F. Skinner's behavioral account of human language and communication",
      "Primary verbal operants: Mand, Tact, Echoic, Intraverbal",
      "Listener Responding (Receptive skills) and motivating conditions",
      "Language assessment, priority ranking, and curriculum customization",
      "Prompting hierarchies, shaping, and generalization for autistic children"
    ],
    "priceDisplayAr": "250 ريال",
    "priceDisplayEn": "250 SAR",
    "accentColor": "#8B5CF6",
    "targetAudienceAr": "أخصائيو التخاطب والنطق، محللو السلوك، ومعلمو برامج التدخل المبكر",
    "targetAudienceEn": "Speech-language pathologists, behavior analysts, and early intervention staff",
    "order": 6,
    "isActive": true
  },
  {
    "id": "course-specialist-assessment",
    "titleAr": "كورس تقييم مهارات أخصائي ABA",
    "titleEn": "ABA Specialist Core Clinical Competency Course",
    "shortTitle": "تقييم مهارات أخصائي ABA",
    "hoursBadgeAr": "10 ساعات معتمدة (10 CEUs)",
    "hoursBadgeEn": "10 Certified CEUs",
    "hoursCount": 10,
    "ribbonTagAr": "الكفاءة الإكلينيكية والميدانية",
    "ribbonTagEn": "Clinical Competency",
    "categoryAr": "الكفاءة المهنية والممارسة الميدانية",
    "categoryEn": "Clinical Skills & Competencies",
    "badgeColor": "#06B6D4",
    "tagHighlightAr": "10 CEUs معتمدة - كفاءة الممارسة السلوكية الميدانية",
    "tagHighlightEn": "10 Accredited CEUs - Field Competence",
    "descriptionAr": "يهدف إلى تطوير المهارات العملية اللازمة للعمل بكفاءة داخل برامج تحليل السلوك التطبيقي، من جمع البيانات وتطبيق البرامج السلوكية والالتزام بالأخلاقيات.",
    "descriptionEn": "Develops core hands-on proficiencies required for ABA therapists: data recording, program implementation, and interprofessional teamwork.",
    "featuresAr": [
      "دور ومسؤوليات أخصائي ABA وحدود الممارسة المهنية",
      "جمع البيانات وتسجيلها بدقة وتطبيق البرامج السلوكية والتعليمية",
      "استخدام التعزيز والتلقين وتصحيح الأخطاء والتعامل مع السلوكيات التحدية",
      "تنفيذ خطط التدخل السلوكي (BIP) وكتابة الملاحظات المهنية الدقيقة",
      "التواصل الفعال مع المشرف والأسرة والالتزام بأخلاقيات الممارسة"
    ],
    "featuresEn": [
      "Clinical scope, boundaries, and responsibilities of ABA specialists",
      "Precision measurement, reliable data recording, and protocol delivery",
      "Reinforcement contingencies, prompting, and de-escalation of challenging behaviors",
      "Execution of BIP plans and professional clinical progress reporting",
      "Effective supervision engagement, family rapport, and ethical standards"
    ],
    "priceDisplayAr": "300 ريال",
    "priceDisplayEn": "300 SAR",
    "accentColor": "#06B6D4",
    "targetAudienceAr": "أخصائيو وفنيو تحليل السلوك، معلمو الظل، وممارسو التدخل المبكر",
    "targetAudienceEn": "Behavior technicians, ABAT clinicians, shadow teachers, and therapists",
    "order": 7,
    "isActive": true
  },
  {
    "id": "course-medical-behavioral",
    "titleAr": "محاضرة التنسيق بين التدخل السلوكي والتدخل الطبي",
    "titleEn": "Medical & Behavioral Intervention Coordination in Autism",
    "shortTitle": "التنسيق السلوكي والطبي",
    "hoursBadgeAr": "3 ساعات معتمدة (3 CEUs)",
    "hoursBadgeEn": "3 Certified CEUs",
    "hoursCount": 3,
    "ribbonTagAr": "التكامل الطبي والسلوكي",
    "ribbonTagEn": "Medical-Behavioral Care",
    "categoryAr": "الرعاية المتكاملة ومتعددة التخصصات",
    "categoryEn": "Integrated Healthcare & Behavior",
    "badgeColor": "#EC4899",
    "tagHighlightAr": "3 CEUs معتمدة - تكامل الخدمات الطبية والسلوكية",
    "tagHighlightEn": "3 Accredited CEUs - Clinical Synergy",
    "descriptionAr": "يركز على مفهوم التكامل بين الخدمات الطبية والسلوكية لضمان تقديم تدخل أكثر شمولاً، وفهم تأثير الحالات الطبية والأدوية على السلوك ومعايير الإحالة.",
    "descriptionEn": "Explores the interdisciplinary bridge between medical practitioners and behavior analysts, distinguishing physical etiology from behavioral issues.",
    "featuresAr": [
      "دور الطبيب والفريق الطبي ودور محلل السلوك ومناطق التكامل",
      "كيفية تبادل المعلومات والتقارير المهنية بصورة آمنة ومناسبة",
      "تأثير بعض الحالات الطبية (الألم، الصرع، الهضم، النوم) والأدوية على السلوك",
      "التمييز بين الأسباب الطبية والسلوكية المحتملة للتغيرات السلوكية",
      "متى يجب إحالة الحالة للفريق الطبي ودراسة حالات تطبيقية واقعية مشتركة"
    ],
    "featuresEn": [
      "Collaborative roles between pediatric physicians and behavior clinicians",
      "Professional, compliant health information sharing across disciplines",
      "Impact of physiological conditions (pain, GI, seizures, sleep) & meds on behavior",
      "Differentiating medical triggers from learned behavioral functions",
      "Medical referral decision trees & interprofessional case study analyses"
    ],
    "priceDisplayAr": "150 ريال",
    "priceDisplayEn": "150 SAR",
    "accentColor": "#EC4899",
    "targetAudienceAr": "الأطباء، محللو السلوك، أخصائيو التمريض، والمشرفون الإكلينيكيون",
    "targetAudienceEn": "Physicians, behavior analysts, pediatric nurses, and clinical directors",
    "order": 8,
    "isActive": true
  },
  {
    "id": "course-trauma-aba",
    "titleAr": "كورس التعامل مع الصدمات من منظور ABA",
    "titleEn": "Trauma-Informed Applied Behavior Analysis",
    "shortTitle": "التعامل مع الصدمات من منظور ABA",
    "hoursBadgeAr": "2 ساعة معتمدة (2 CEUs)",
    "hoursBadgeEn": "2 Certified CEUs",
    "hoursCount": 2,
    "ribbonTagAr": "رعاية مستنيرة بالصدمات",
    "ribbonTagEn": "Trauma-Informed Care",
    "categoryAr": "الدعم النفسي والسلوكي المستنير",
    "categoryEn": "Trauma-Informed Behavioral Support",
    "badgeColor": "#F97316",
    "tagHighlightAr": "2 CEUs معتمدة - رعاية وسلوك مستنير بالصدمات",
    "tagHighlightEn": "2 Accredited CEUs - Trauma Informed",
    "descriptionAr": "يتناول كيفية فهم السلوكيات المرتبطة بالتجارب الصادمة من منظور سلوكي دون تجاوز حدود ممارسة محلل السلوك، وتعديل البيئة واستراتيجيات الدعم الإيجابي.",
    "descriptionEn": "Prepares behavior professionals to view trauma-related behaviors functionally, crafting safe and supportive intervention environments.",
    "featuresAr": [
      "مفهوم الصدمة وتأثيرها المحتمل على السلوك والنمو العصبي",
      "فهم السلوك الصدمي من خلال مبادئ ABA وتحديد السوابق والنتائج",
      "تعديل البيئة وتقليل المحفزات المسببة للضغط والتوتر الحاد",
      "استخدام استراتيجيات التعزيز والدعم السلوكي والتعاون مع النفسيين والطبيين",
      "الاعتبارات الأخلاقية وحدود الممارسة المهنية وتطبيقات ودراسات حالة"
    ],
    "featuresEn": [
      "Neurodevelopmental foundations of trauma and behavioral manifestations",
      "Understanding trauma responses using behavioral ABC models",
      "Environmental accommodations reducing stress triggers and escalations",
      "Positive reinforcement and behavioral support with psychological collaboration",
      "Ethical boundaries, clinical scope of practice, and case studies"
    ],
    "priceDisplayAr": "100 ريال",
    "priceDisplayEn": "100 SAR",
    "accentColor": "#F97316",
    "targetAudienceAr": "محللو السلوك، الأخصائيون النفسيون، ومعلمو التربية الخاصة ومقدمو الرعاية",
    "targetAudienceEn": "Behavior analysts, clinical psychologists, special educators, and caregivers",
    "order": 9,
    "isActive": true
  },
  {
    "id": "course-comorbidities",
    "titleAr": "كورس التشخيصات المتعددة لذوي الاحتياجات الخاصة",
    "titleEn": "Comorbidities & Dual Diagnoses in Developmental Care",
    "shortTitle": "التشخيصات المتعددة والمزدوجة",
    "hoursBadgeAr": "2 ساعة معتمدة (2 CEUs)",
    "hoursBadgeEn": "2 Certified CEUs",
    "hoursCount": 2,
    "ribbonTagAr": "تقييم الحالات المركبة",
    "ribbonTagEn": "Complex Case Evaluation",
    "categoryAr": "التشخيص المزدوج والتقييم الإكلينيكي",
    "categoryEn": "Comorbidity & Dual Diagnosis",
    "badgeColor": "#6366F1",
    "tagHighlightAr": "2 CEUs معتمدة - تقييم وتعديل برامج الحالات المزدوجة",
    "tagHighlightEn": "2 Accredited CEUs - Comorbidities",
    "descriptionAr": "يهدف إلى رفع قدرة المتخصص على فهم الحالات التي تتضمن أكثر من تشخيص أو احتياج نمائي وسلوكي (Comorbidities) وتحديد الأولويات العلاجية.",
    "descriptionEn": "Enhances practitioners' capability to assess and adapt behavioral plans for learners presenting multiple developmental or psychological diagnoses.",
    "featuresAr": [
      "التعرف على التشخيصات النمائية والسلوكية الشائعة وتداخلاتها",
      "مفهوم التشخيصات المصاحبة (Comorbidities) وتأثيرها على تقييم الحالة",
      "تحديد الأولويات العلاجية والتعليمية وتعديل البرامج السلوكية",
      "التمييز بين الأعراض المرتبطة بالتشخيص والسلوكيات المكتسبة",
      "العمل ضمن الفريق متعدد التخصصات مع تطبيقات عملية ودراسات حالة"
    ],
    "featuresEn": [
      "Common co-occurring developmental, cognitive, and sensory disorders",
      "Impact of comorbidities on standardized behavioral assessment accuracy",
      "Prioritizing therapeutic milestones according to individual functional needs",
      "Differentiating core diagnostic symptomatology from operant behavior",
      "Interdisciplinary planning with real-world case simulations"
    ],
    "priceDisplayAr": "100 ريال",
    "priceDisplayEn": "100 SAR",
    "accentColor": "#6366F1",
    "targetAudienceAr": "أخصائيو التشخيص والتقييم، محللو السلوك، والأطباء النفسيون",
    "targetAudienceEn": "Diagnostic evaluators, clinical psychologists, and behavior analysts",
    "order": 10,
    "isActive": true
  },
  {
    "id": "course-qaba-ethics",
    "titleAr": "كورس الأخلاقيات المهنية طبقًا لمعايير QABA",
    "titleEn": "QABA Professional Ethical Standards & Practice Code",
    "shortTitle": "أخلاقيات الممارسة طبقاً لـ QABA",
    "hoursBadgeAr": "3 ساعات معتمدة (3 CEUs)",
    "hoursBadgeEn": "3 Certified CEUs",
    "hoursCount": 3,
    "ribbonTagAr": "أخلاقيات البورد المعتمدة",
    "ribbonTagEn": "Board Ethical Standards",
    "categoryAr": "الأخلاقيات والقوانين المهنية",
    "categoryEn": "Professional Ethics & Standards",
    "badgeColor": "#D97706",
    "tagHighlightAr": "3 CEUs معتمدة - معايير وميثاق أخلاقيات QABA",
    "tagHighlightEn": "3 Accredited CEUs - Ethics Code",
    "descriptionAr": "يتناول المبادئ الأخلاقية والمهنية المرتبطة بممارسة تحليل السلوك وفق متطلبات ومعايير QABA، لحماية العميل والأسرة والالتزام بالسرية والموافقة المستنيرة.",
    "descriptionEn": "Comprehensive review of QABA's international code of ethics, emphasizing client welfare, confidentiality, informed consent, and safety.",
    "featuresAr": [
      "المبادئ الأساسية للممارسة الأخلاقية والمسؤولية المهنية تجاه العميل والأسرة",
      "السرية وحماية معلومات العميل والخصوصية الرقمية المعتمدة",
      "الحدود المهنية وتجنب العلاقات المزدوجة وتضارب المصالح",
      "الكفاءة المهنية، التطوير المستمر، الموافقة المستنيرة، وإدارة المخاطر",
      "التوثيق والسجلات والتعاون بين التخصصات ومناقشة سيناريوهات واقعية"
    ],
    "featuresEn": [
      "Core ethical pillars and clinician duties toward clients and families",
      "Client data protection, confidentiality protocols, and digital privacy",
      "Professional boundaries, preventing dual relationships and conflict of interest",
      "Clinical competence maintenance, continuous education, and informed consent",
      "Accurate records keeping, risk prevention, and resolution of ethical dilemmas"
    ],
    "priceDisplayAr": "150 ريال",
    "priceDisplayEn": "150 SAR",
    "accentColor": "#D97706",
    "targetAudienceAr": "حاملو رخص ABAT, QASP-S, QBA والمرشحون لاختبارات البورد",
    "targetAudienceEn": "Certified ABAT, QASP-S, and QBA clinicians and certification candidates",
    "order": 11,
    "isActive": true
  },
  {
    "id": "course-peak",
    "titleAr": "كورس نظام التقييم والتدريب العلائقي (PEAK)",
    "titleEn": "PEAK Relational Training System Comprehensive Masterclass",
    "shortTitle": "كورس نظام PEAK المتكامل",
    "hoursBadgeAr": "15 ساعة معتمدة (15 CEUs)",
    "hoursBadgeEn": "15 Certified CEUs",
    "hoursCount": 15,
    "ribbonTagAr": "أداة تقييم وتدريب متقدمة",
    "ribbonTagEn": "Advanced Assessment Protocol",
    "categoryAr": "أدوات التقييم والتعلم العلائقي",
    "categoryEn": "Relational Assessment & Training",
    "badgeColor": "#2563EB",
    "tagHighlightAr": "15 CEUs معتمدة - Direct, Generalization, Equivalence, Transformation",
    "tagHighlightEn": "15 Accredited CEUs - All 4 Modules",
    "descriptionAr": "كورس متقدم في استخدام PEAK Relational Training System لتطوير المهارات المعرفية واللغوية والعلاقية، وبناء مهارات التعلم والاستدلال والتعميم.",
    "descriptionEn": "Comprehensive clinical mastery of the PEAK Relational Training System to expand generative language, relational responding, and advanced reasoning.",
    "featuresAr": [
      "التعريف بنظام PEAK وأهدافه والأسس النظرية للتعلم العلائقي (RFT)",
      "التعرف على مكونات PEAK الأربعة: Direct, Generalization, Equivalence, Transformation",
      "إجراء التقييم وتحديد مستوى المتعلم واختيار البرامج المناسبة",
      "تطبيق البرامج وبناء مهارات الاستدلال والعلاقات بين المثيرات والاستجابات",
      "تسجيل البيانات، تحليل نتائج التدريب، معايير الإتقان، وتطبيقات عملية شاملة"
    ],
    "featuresEn": [
      "Foundational theory of PEAK and Relational Frame Theory (RFT) in ABA",
      "Complete navigation across all 4 PEAK modules (DTI, GEN, EQU, TRA)",
      "Administering PEAK assessments & individual learner baseline profiling",
      "Delivering relational frame protocols and cognitive generalization",
      "Data collection rubrics, mastery criterion metrics, and clinical work models"
    ],
    "priceDisplayAr": "350 ريال",
    "priceDisplayEn": "350 SAR",
    "accentColor": "#2563EB",
    "targetAudienceAr": "محللو السلوك، أخصائيو التخاطب، معلمو التربية الخاصة، والمشرفون الإكلينيكيون",
    "targetAudienceEn": "Behavior analysts, speech therapists, special educators, and clinical directors",
    "order": 12,
    "isActive": true
  },
  {
    "id": "course-bip",
    "titleAr": "كورس التدخلات السلوكية وإعداد خطة التدخل السلوكي (BIP)",
    "titleEn": "Behavior Intervention Plan (BIP): Practical Design & Execution",
    "shortTitle": "إعداد خطة التدخل السلوكي BIP",
    "hoursBadgeAr": "10 ساعات معتمدة (10 CEUs)",
    "hoursBadgeEn": "10 Certified CEUs",
    "hoursCount": 10,
    "ribbonTagAr": "تصميم الخطط السلوكية الفردية",
    "ribbonTagEn": "Clinical Intervention Design",
    "categoryAr": "تصميم وإدارة خطط التدخل السلوكي",
    "categoryEn": "Behavior Intervention Planning (BIP)",
    "badgeColor": "#EA580C",
    "tagHighlightAr": "10 CEUs معتمدة - تقييم FBA وصياغة خطة BIP كاملة",
    "tagHighlightEn": "10 Accredited CEUs - FBA & BIP Mastery",
    "descriptionAr": "كورس عملي في تصميم وتنفيذ Behavioral Intervention Plan (BIP)، وإجراء التقييم الوظيفي للسلوك FBA، واختيار استراتيجيات التدخل وتعليم السلوك البديل.",
    "descriptionEn": "Practical mastery in designing and executing individualized Behavioral Intervention Plans (BIPs) based on Functional Behavior Assessments (FBAs).",
    "featuresAr": [
      "تعريف خطة التدخل السلوكي ومكوناتها وتحديد السلوك المستهدف إجرائياً",
      "جمع وتحليل البيانات وإجراء Functional Behavior Assessment (FBA) بصورة مناسبة",
      "تحديد وظيفة السلوك واختيار استراتيجيات التدخل المبنية على الوظيفة",
      "التدخلات السابقة للسلوك (Antecedent) والنتائج والتعزيز وخطط خفض السلوك",
      "تعليم السلوك البديل الوظيفي وقياس فعالية الخطة وتعديلها ونماذج عملية"
    ],
    "featuresEn": [
      "Operational target behavior definitions and core components of a BIP",
      "Conducting indirect and direct Functional Behavior Assessments (FBAs)",
      "Function-based intervention strategy selection across behavioral functions",
      "Antecedent modifications, consequence management, and reinforcement systems",
      "Teaching Functional Replacement Behaviors (FERBs) and data monitoring"
    ],
    "priceDisplayAr": "350 ريال",
    "priceDisplayEn": "350 SAR",
    "accentColor": "#EA580C",
    "targetAudienceAr": "أخصائيو ومحللو السلوك، معلمو الدمج، والمشرفون التربويون والإكلينيكيون",
    "targetAudienceEn": "Behavior analysts, inclusion specialists, educational supervisors, and clinicians",
    "order": 13,
    "isActive": true
  },
  {
    "id": "course-data-graphing",
    "titleAr": "كورس الرسوم البيانية وتحليل البيانات في ABA",
    "titleEn": "Behavioral Data Graphing & Visual Analysis in ABA",
    "shortTitle": "الرسوم البيانية وتحليل البيانات",
    "hoursBadgeAr": "2 ساعة معتمدة (2 CEUs)",
    "hoursBadgeEn": "2 Certified CEUs",
    "hoursCount": 2,
    "ribbonTagAr": "تحليل البيانات والقرارات الإكلينيكية",
    "ribbonTagEn": "Visual Data Analysis",
    "categoryAr": "قياس السلوك والتمثيل البياني",
    "categoryEn": "Measurement & Visual Analytics",
    "badgeColor": "#0D9488",
    "tagHighlightAr": "2 CEUs معتمدة - Line, Bar, Cumulative, Scatterplot",
    "tagHighlightEn": "2 Accredited CEUs - Graphing Mastery",
    "descriptionAr": "يهدف إلى إكساب المتدرب القدرة على تحويل البيانات السلوكية إلى رسوم بيانية واضحة وتحليلها مهنياً، وقراءة الاتجاه والتباين لاتخاذ قرارات علاجية مبنية على الأدلة.",
    "descriptionEn": "Practical workshop for converting raw behavioral data into standard clinical graphs and mastering visual inspection to guide intervention decisions.",
    "featuresAr": [
      "أهمية جمع البيانات في ABA وأنواع القياس: Frequency, Rate, Duration, Latency",
      "اختيار الرسم البياني المناسب: Line Graph و Bar Graph و Cumulative و Scatterplot",
      "قراءة وتحليل الاتجاهات (Trend) ومستوى البيانات (Level) والتباين (Variability)",
      "مقارنة خط الأساس (Baseline) بالتدخل ومراحل البرامج المختلفة",
      "اتخاذ القرارات العلاجية بناءً على البيانات وتطبيقات عملية على بيانات حقيقية"
    ],
    "featuresEn": [
      "Role of empirical measurement: Frequency, rate, duration, and latency metrics",
      "Graph selection guidelines: Line graphs, bar charts, cumulative records, and scatterplots",
      "Visual analysis techniques: Evaluating trend lines, level shifts, and variability",
      "Comparing baseline data with multi-phase intervention outcomes",
      "Data-based clinical decision-making protocols with real therapy cases"
    ],
    "priceDisplayAr": "100 ريال",
    "priceDisplayEn": "100 SAR",
    "accentColor": "#0D9488",
    "targetAudienceAr": "فنيو ومحللو السلوك، أخصائيو القياس، والمشرفون الإكلينيكيون",
    "targetAudienceEn": "Behavior technicians, clinical analysts, and special education teachers",
    "order": 14,
    "isActive": true
  }
];

export const STORAGE_COURSES_KEY = 'raba_courses_data_v1';
export const STORAGE_COURSES_SETTINGS_KEY = 'raba_courses_settings_v1';

export function getStoredCoursesData(): CourseItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_COURSES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= COURSES_DATA.length) {
        return parsed.map((c: CourseItem) => ({ ...c, isActive: c.isActive !== false })).sort((a: CourseItem, b: CourseItem) => (a.order || 0) - (b.order || 0));
      } else if (Array.isArray(parsed) && parsed.length > 0) {
        const existingIds = new Set(parsed.map((p: any) => p.id));
        const missing = COURSES_DATA.filter(c => !existingIds.has(c.id));
        const merged = [...parsed, ...missing].map((c: CourseItem) => ({ ...c, isActive: c.isActive !== false })).sort((a: CourseItem, b: CourseItem) => (a.order || 0) - (b.order || 0));
        localStorage.setItem(STORAGE_COURSES_KEY, JSON.stringify(merged));
        return merged;
      }
    }
    const bundled = (defaultSyncData as any)?.data?.[STORAGE_COURSES_KEY];
    if (Array.isArray(bundled) && bundled.length > 0) {
      return [...bundled].map((c: any) => ({ ...c, isActive: c.isActive !== false })).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    }
    return COURSES_DATA.map(c => ({ ...c, isActive: true }));
  } catch {
    return COURSES_DATA.map(c => ({ ...c, isActive: true }));
  }
}

export function saveStoredCoursesData(courses: CourseItem[]): void {
  try {
    localStorage.setItem(STORAGE_COURSES_KEY, JSON.stringify(courses));
    savePersistentModule(STORAGE_COURSES_KEY, courses);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('raba_courses_updated', { detail: courses }));
    }
  } catch (err) {
    console.error('Failed to save courses data', err);
  }
}

export function getStoredCoursesSettings(): CoursesSectionSettings {
  try {
    const raw = localStorage.getItem(STORAGE_COURSES_SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_COURSES_SETTINGS, ...JSON.parse(raw) };
    }
    const bundled = (defaultSyncData as any)?.data?.[STORAGE_COURSES_SETTINGS_KEY];
    if (bundled && typeof bundled === 'object') {
      return { ...DEFAULT_COURSES_SETTINGS, ...bundled };
    }
    return DEFAULT_COURSES_SETTINGS;
  } catch {
    return DEFAULT_COURSES_SETTINGS;
  }
}

export function saveStoredCoursesSettings(settings: CoursesSectionSettings): void {
  try {
    localStorage.setItem(STORAGE_COURSES_SETTINGS_KEY, JSON.stringify(settings));
    savePersistentModule(STORAGE_COURSES_SETTINGS_KEY, settings);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('raba_courses_settings_updated', { detail: settings }));
    }
  } catch (err) {
    console.error('Failed to save courses settings', err);
  }
}
