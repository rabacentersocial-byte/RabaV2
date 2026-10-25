import { savePersistentModule } from '../utils/persistentSync';

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
  // Professional screenshot & rich card fields
  iconName?: string;
  floatingBadgeAr?: string;
  floatingBadgeEn?: string;
  accreditationBadgeAr?: string;
  accreditationBadgeEn?: string;
  rating?: number;
  reviewsCount?: number;
  instructorAr?: string;
  instructorEn?: string;
  lessonsCount?: number;
  currentPrice?: number | string;
  originalPrice?: number | string;
  videoPreviewUrl?: string;
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
  badgeAr: 'تعلَم على يد خبراء',
  badgeEn: 'LEARN FROM EXPERTS',
  titlePart1Ar: 'كورسات تصنع',
  titleHighlightAr: 'فرقاً حقيقياً',
  titleEn: 'Courses That Make a Real Difference',
  subtitleAr: 'برامج تدريبية عملية للمتخصصين والأسر، مصممة لتطوير المهارات وتحويل المعرفة إلى أثر يومي.',
  subtitleEn: 'Practical training programs for professionals and families, designed to develop competencies and transform knowledge into daily impact.',
  whatsappNumber: '966575100100'
};

export const COURSES_DATA: CourseItem[] = [
  {
    "id": "course-autism-inclusion",
    "titleAr": "دمج أطفال التوحد في الصف",
    "titleEn": "Autism Inclusion in the Classroom",
    "shortTitle": "دمج التوحد في الصف",
    "hoursBadgeAr": "10 ساعات تدريبية معتمدة",
    "hoursBadgeEn": "10 Certified Training Hours",
    "hoursCount": 10,
    "ribbonTagAr": "شهادة تطوير مهني",
    "ribbonTagEn": "Professional Development Certificate",
    "categoryAr": "اضطراب طيف التوحد",
    "categoryEn": "Autism Spectrum Disorder",
    "badgeColor": "#0d5c52",
    "tagHighlightAr": "استراتيجيات الدمج والتدخل داخل الصف",
    "tagHighlightEn": "Inclusion Strategies & Classroom Interventions",
    "descriptionAr": "برنامج تطبيقي لبناء بيئة صفية دامجة تراعي احتياجات أطفال طيف التوحد وتدعم مشاركتهم.",
    "descriptionEn": "Applied training program to build an inclusive classroom environment supporting autism students.",
    "featuresAr": [
      "تكييف البيئة الصفية",
      "إدارة التحديات الحسية",
      "تصميم خطة دمج فردية"
    ],
    "featuresEn": [
      "Adapting the classroom physical & sensory environment",
      "Managing sensory challenges and behavioral triggers",
      "Designing individualized inclusion plans"
    ],
    "priceDisplayAr": "429 ر.س",
    "priceDisplayEn": "429 SAR",
    "accentColor": "#0d5c52",
    "targetAudienceAr": "معلمو المدارس العادية والدمج، الأخصائيون النفسيون، وأولياء الأمور",
    "targetAudienceEn": "Mainstream teachers, school psychologists, and parents",
    "order": 2,
    "isActive": true,
    "cardCoverUrl": "/images/courses/course_3_autism_inclusion.jpg",
    "iconName": "school",
    "floatingBadgeAr": "جديد",
    "floatingBadgeEn": "New",
    "accreditationBadgeAr": "شهادة تطوير مهني",
    "accreditationBadgeEn": "Professional Development Certificate",
    "rating": 4.9,
    "reviewsCount": 98,
    "instructorAr": "بإشراف نخبة من الأخصائيين المعتمدين",
    "instructorEn": "Supervised by Certified Specialists",
    "lessonsCount": 15,
    "currentPrice": 429,
    "originalPrice": 550,
    "videoPreviewUrl": "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
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
    "categoryAr": "إشراف وبرامج التوحد",
    "categoryEn": "Supervision & Autism Programs",
    "badgeColor": "#0d5c52",
    "tagHighlightAr": "تأهيل معتمد لمشرفي خدمات التوحد",
    "tagHighlightEn": "Advanced Supervision Qualification",
    "descriptionAr": "يتناول الكورس متطلبات اعتماد البورد الأمريكي لتأهيل وإعداد مشرفي خدمات التوحد وتصميم برامج التدخل والإشراف الإكلينيكي.",
    "descriptionEn": "Comprehensive training program meeting American QABA Board requirements for supervisory autism service credentials.",
    "featuresAr": [
      "متطلبات البورد الأمريكي 188 ساعة",
      "تصميم وتحليل برامج التدخل الإكلينيكي",
      "الإشراف الميداني وتدريب الكوادر"
    ],
    "featuresEn": [
      "188 QABA Board requirement curriculum hours",
      "Designing clinical intervention and assessment plans",
      "Field supervision and team clinical coaching"
    ],
    "priceDisplayAr": "3500 ر.س",
    "priceDisplayEn": "3500 SAR",
    "accentColor": "#0d5c52",
    "targetAudienceAr": "أخصائيو التربية الخاصة، مشرفو البرامج السلوكية، وممارسو التوحد",
    "targetAudienceEn": "Special education supervisors and autism practitioners",
    "order": 1,
    "isActive": true,
    "cardCoverUrl": "/images/courses/course_4_qasp.jpg",
    "iconName": "users-round",
    "floatingBadgeAr": "إشراف مهني",
    "floatingBadgeEn": "Supervision Track",
    "accreditationBadgeAr": "اعتماد البورد الدولي QABA",
    "accreditationBadgeEn": "International Board Certification",
    "rating": 4.9,
    "reviewsCount": 112,
    "instructorAr": "بإشراف نخبة من الأخصائيين المعتمدين",
    "instructorEn": "Supervised by Certified Specialists",
    "lessonsCount": 42,
    "currentPrice": 3500,
    "originalPrice": 5000,
    "videoPreviewUrl": "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
  },
  {
    "id": "course-mand-training",
    "titleAr": "كورس التدريب على الطلب (Mand Training)",
    "titleEn": "Mand Training Course: Functional Request Development",
    "shortTitle": "التدريب على الطلب (Mand)",
    "hoursBadgeAr": "6 ساعات تدريبية معتمدة",
    "hoursBadgeEn": "6 Certified CEUs",
    "hoursCount": 6,
    "ribbonTagAr": "تطوير التواصل اللغوي",
    "ribbonTagEn": "Communication Development",
    "categoryAr": "التواصل وتحليل السلوك",
    "categoryEn": "Functional Communication & Mand",
    "badgeColor": "#0d5c52",
    "tagHighlightAr": "تطبيقات عملية لبناء الطلب الوظيفي",
    "tagHighlightEn": "Practical Applications for Functional Requests",
    "descriptionAr": "أسس ومهارات تعليم الطفل كيفية التعبير عن احتياجاته ورغباته بطريقة وظيفية مع تطبيقات عملية.",
    "descriptionEn": "Teaches essential skills to help learners express wants and needs functionally through motivation and AAC.",
    "featuresAr": [
      "تحديد المعززات وتقييم الدافعية MO",
      "بناء مهارات الطلب اللفظي وPECS",
      "تعميم مهارات التواصل في البيئة"
    ],
    "featuresEn": [
      "Identifying reinforcers and Motifying Operations",
      "Building verbal manding & PECS communication",
      "Generalizing requests across daily settings"
    ],
    "priceDisplayAr": "200 ر.س",
    "priceDisplayEn": "200 SAR",
    "accentColor": "#0d5c52",
    "targetAudienceAr": "أخصائيو السلوك، أخصائيو النطق والتخاطب، ومعلمو التربية الخاصة ومقدمو الرعاية",
    "targetAudienceEn": "Behavior therapists, SLPs, and special education teachers",
    "order": 5,
    "isActive": true,
    "cardCoverUrl": "/images/courses/course_5_mand.jpg",
    "iconName": "message-square-quote",
    "floatingBadgeAr": "ساعات CEUs",
    "floatingBadgeEn": "CEUs Credits",
    "accreditationBadgeAr": "تطوير التواصل اللغوي",
    "accreditationBadgeEn": "Functional Communication Protocol",
    "rating": 4.8,
    "reviewsCount": 76,
    "instructorAr": "بإشراف نخبة من الأخصائيين المعتمدين",
    "instructorEn": "Supervised by Certified Specialists",
    "lessonsCount": 10,
    "currentPrice": 200,
    "originalPrice": 280,
    "videoPreviewUrl": "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
  },
  {
    "id": "course-toilet-training",
    "titleAr": "كورس التدريب على مهارات الحمام",
    "titleEn": "Toilet Training Protocol for Autism",
    "shortTitle": "مهارات الحمام (Toilet Training)",
    "hoursBadgeAr": "2 ساعة تدريبية معتمدة",
    "hoursBadgeEn": "2 Certified CEUs",
    "hoursCount": 2,
    "ribbonTagAr": "العناية بالذات والاستقلالية",
    "ribbonTagEn": "Self-Care & Independence",
    "categoryAr": "الاستقلالية الذاتية",
    "categoryEn": "Self-Care & Independence",
    "badgeColor": "#0d5c52",
    "tagHighlightAr": "بروتوكول تطبيقي فردي متكامل",
    "tagHighlightEn": "Individualized Practical Protocol",
    "descriptionAr": "كورس عملي تطبيقي لتصميم وتنفيذ برامج تدريب استخدام الحمام وتقييم الجاهزية وخفض المساعدة تدريجياً.",
    "descriptionEn": "Practical workshop to design and implement successful toilet training programs for learners with autism.",
    "featuresAr": [
      "تقييم الجاهزية الفسيولوجية والسلوكية",
      "إعداد خطة تدريب فردية وجدولة التعزيز",
      "خفض الاعتماد على المساعدة تدريجياً"
    ],
    "featuresEn": [
      "Physiological and behavioral readiness evaluation",
      "Individualized routine & reinforcement scheduling",
      "Systematic prompt fading and accident management"
    ],
    "priceDisplayAr": "150 ر.س",
    "priceDisplayEn": "150 SAR",
    "accentColor": "#0d5c52",
    "targetAudienceAr": "أخصائيو العلاج السلوكي والوظيفي، أولياء الأمور، ومعلمو التربية الخاصة",
    "targetAudienceEn": "Behavior analysts, occupational therapists, and parents",
    "order": 6,
    "isActive": true,
    "cardCoverUrl": "/images/courses/course_6_toilet.jpg",
    "iconName": "sparkles",
    "floatingBadgeAr": "استقلالية ذاتية",
    "floatingBadgeEn": "Independence Skills",
    "accreditationBadgeAr": "العناية بالذات والاستقلالية",
    "accreditationBadgeEn": "Self-Care & Independence",
    "rating": 4.9,
    "reviewsCount": 92,
    "instructorAr": "بإشراف نخبة من الأخصائيين المعتمدين",
    "instructorEn": "Supervised by Certified Specialists",
    "lessonsCount": 6,
    "currentPrice": 150,
    "originalPrice": 220,
    "videoPreviewUrl": "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
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
    "isActive": true,
    "iconName": "languages",
    "currentPrice": 250,
    "originalPrice": 350
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
    "isActive": true,
    "iconName": "clipboard-check",
    "currentPrice": 300,
    "originalPrice": 400
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
    "isActive": true,
    "iconName": "stethoscope",
    "currentPrice": 150,
    "originalPrice": 200
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
    "isActive": true,
    "iconName": "hand-heart",
    "currentPrice": 100,
    "originalPrice": 150
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
    "isActive": true,
    "iconName": "layers",
    "currentPrice": 100,
    "originalPrice": 150
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
    "isActive": true,
    "iconName": "scale",
    "currentPrice": 150,
    "originalPrice": 220
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
    "isActive": true,
    "iconName": "trending-up",
    "currentPrice": 350,
    "originalPrice": 500
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
    "isActive": true,
    "iconName": "file-text",
    "currentPrice": 350,
    "originalPrice": 450
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
    "isActive": true,
    "iconName": "bar-chart-3",
    "currentPrice": 100,
    "originalPrice": 160
  }
];

export const STORAGE_COURSES_KEY = 'raba_courses_data_v1';
export const STORAGE_COURSES_SETTINGS_KEY = 'raba_courses_settings_v1';

/**
 * Extracts the numeric price of a course for accurate sorting and comparisons.
 */
export function getCourseNumericPrice(course: CourseItem | null | undefined): number {
  if (!course) return 0;
  if (typeof course.currentPrice === 'number' && !isNaN(course.currentPrice) && course.currentPrice > 0) {
    return course.currentPrice;
  }
  if (typeof course.currentPrice === 'string' && course.currentPrice.trim() !== '') {
    const parsed = parseFloat(course.currentPrice.replace(/[^0-9.]/g, ''));
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  if (course.priceDisplayAr) {
    const parsed = parseFloat(course.priceDisplayAr.replace(/[^0-9.]/g, ''));
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  if (course.priceDisplayEn) {
    const parsed = parseFloat(course.priceDisplayEn.replace(/[^0-9.]/g, ''));
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return 0;
}

export function getStoredCoursesData(): CourseItem[] {
  const enrichItem = (c: any): CourseItem => {
    const def = COURSES_DATA.find(d => d.id === c.id);
    const numericPrice = (c.currentPrice !== undefined && c.currentPrice !== 0) 
      ? (typeof c.currentPrice === 'number' ? c.currentPrice : parseFloat(String(c.currentPrice).replace(/[^0-9.]/g, '')) || 0)
      : (def?.currentPrice || getCourseNumericPrice(c) || getCourseNumericPrice(def as any) || 0);

    return {
      ...def,
      ...c,
      cardCoverUrl: c.cardCoverUrl || def?.cardCoverUrl || '',
      iconName: c.iconName || def?.iconName || undefined,
      floatingBadgeAr: c.floatingBadgeAr || def?.floatingBadgeAr || '',
      accreditationBadgeAr: c.accreditationBadgeAr || def?.accreditationBadgeAr || c.ribbonTagAr || '',
      rating: c.rating || def?.rating || 4.9,
      reviewsCount: c.reviewsCount || def?.reviewsCount || 120,
      instructorAr: 'بإشراف نخبة من الأخصائيين المعتمدين',
      instructorEn: 'Supervised by Certified Specialists',
      lessonsCount: c.lessonsCount || def?.lessonsCount || 20,
      currentPrice: numericPrice,
      originalPrice: c.originalPrice !== undefined ? c.originalPrice : (def?.originalPrice || 0),
      isActive: c.isActive !== false
    };
  };

  try {
    const raw = localStorage.getItem(STORAGE_COURSES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Purge deleted courses from stored cache
        const cleaned = parsed.filter((p: any) => p && p.id !== 'course-qba' && p.id !== 'course-abat');
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(STORAGE_COURSES_KEY, JSON.stringify(cleaned));
        }
        const existingIds = new Set(cleaned.map((p: any) => p.id));
        const missing = COURSES_DATA.filter(c => !existingIds.has(c.id));
        const combined = [...cleaned, ...missing];
        return combined.map(enrichItem).sort((a: CourseItem, b: CourseItem) => getCourseNumericPrice(b) - getCourseNumericPrice(a));
      }
    }
    return COURSES_DATA.map(enrichItem).sort((a: CourseItem, b: CourseItem) => getCourseNumericPrice(b) - getCourseNumericPrice(a));
  } catch {
    return COURSES_DATA.map(enrichItem).sort((a: CourseItem, b: CourseItem) => getCourseNumericPrice(b) - getCourseNumericPrice(a));
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
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_COURSES_SETTINGS,
        ...parsed,
        badgeAr: parsed.badgeAr === 'الكورسات والدورات التدريبية' ? DEFAULT_COURSES_SETTINGS.badgeAr : (parsed.badgeAr || DEFAULT_COURSES_SETTINGS.badgeAr),
        titlePart1Ar: parsed.titlePart1Ar === 'طوّر مسارك المهني في' ? DEFAULT_COURSES_SETTINGS.titlePart1Ar : (parsed.titlePart1Ar || DEFAULT_COURSES_SETTINGS.titlePart1Ar),
        titleHighlightAr: parsed.titleHighlightAr === 'تحليل السلوك التطبيقي (ABA)' ? DEFAULT_COURSES_SETTINGS.titleHighlightAr : (parsed.titleHighlightAr || DEFAULT_COURSES_SETTINGS.titleHighlightAr),
        subtitleAr: (parsed.subtitleAr && parsed.subtitleAr.includes('بأعلى المعايير الإكلينيكية')) ? DEFAULT_COURSES_SETTINGS.subtitleAr : (parsed.subtitleAr || DEFAULT_COURSES_SETTINGS.subtitleAr)
      };
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
