import { ServiceItem, TherapyPackage } from "../types";
export const SERVICES: ServiceItem[] = [
  {
    id: 'srv-aba',
    title: 'تحليل السلوك التطبيقي ABA',
    titleEn: 'Applied Behavior Analysis (ABA)',
    category: 'aba',
    categoryAr: 'تحليل السلوك التطبيقي',
    categoryEn: 'Behavior Analysis (ABA)',
    description: 'تنمية المهارات وتعزيز السلوك الإيجابي والاستقلالية',
    descriptionEn: 'Skill development, positive behavior reinforcement, and adaptive daily independence.',
    benefits: [
      'تنمية المهارات التكيفية والتواصلية وبناء الاستقلالية الذاتية',
      'تعزيز وتدعيم السلوكيات الإيجابية والحد من السلوكيات غير المرغوبة',
      'خطط علاجية فردية قائمة على التقييم السلوكي الوظيفي FBA',
      'تدريب أولياء الأمور لنقل وتعميم المهارات المكتسبة للمنزل'
    ],
    benefitsEn: [
      'Adaptive and communicative skills development fostering daily independence',
      'Reinforcing positive behaviors and mitigating challenging outbursts',
      'Individualized intervention plans derived from Functional Behavior Assessment (FBA)',
      'Caregiver coaching to generalize acquired skills into everyday home routines'
    ],
    targetAges: 'من عمر سنة ونصف إلى 14 سنة',
    targetAgesEn: 'Ages 1.5 to 14 years',
    durationMinutes: 50,
    iconName: 'Puzzle',
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80',
    featured: true
  },
  {
    id: 'srv-speech',
    title: 'النطق والتخاطب',
    titleEn: 'Speech & Language Therapy',
    category: 'speech',
    categoryAr: 'النطق والتخاطب',
    categoryEn: 'Speech & Language',
    description: 'تطوير مهارات اللغة والنطق والتواصل',
    descriptionEn: 'Enhancing functional language, speech clarity, and social communication.',
    benefits: [
      'تطوير الحصيلة اللغوية الاستقبالية والتعبيرية وبناء الجمل المتناسقة',
      'علاج تأخر الكلام وتصحيح مخارج الحروف وعيوب النطق والتأتأة',
      'تأهيل العلاج الفموي الحركي OPT ومشاكل عضلات النطق',
      'تطبيق وسائل التواصل البديل والمعزز (AAC / PECS) لغير الناطقين'
    ],
    benefitsEn: [
      'Enriching receptive and expressive linguistic repertoire and syntax',
      'Addressing speech delays, articulation defects, lisping, and stuttering',
      'Oral Placement Therapy (OPT) for oral motor coordination and chewing',
      'Augmentative and Alternative Communication (PECS / AAC) for non-verbal children'
    ],
    targetAges: 'من عمر سنة ونصف فما فوق',
    targetAgesEn: 'Ages 1.5 years and above',
    durationMinutes: 45,
    iconName: 'MessageSquare',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80',
    featured: true
  },
  {
    id: 'srv-occupational',
    title: 'العلاج الوظيفي',
    titleEn: 'Occupational Therapy',
    category: 'occupational',
    categoryAr: 'العلاج الوظيفي',
    categoryEn: 'Occupational Therapy',
    description: 'تنمية المهارات الحركية والإدراكية ومهارات الحياة اليومية',
    descriptionEn: 'Motor and cognitive skills development, and activities of daily living (ADL).',
    benefits: [
      'تطوير المهارات الحركية الدقيقة والتآزر البصري الحركي',
      'تدريب الطفل على مهارات الاستقلالية في الحياة اليومية (ارتداء، طعام، نظافة)',
      'تحسين مهارات مسك القلم والكتابة المدرسية واستخدام الأدوات',
      'تعزيز التركيز والانتباه الحركي أثناء أداء المهام المختلفة'
    ],
    benefitsEn: [
      'Fine motor dexterity, hand-eye coordination, and grip development',
      'Activities of Daily Living (ADL) independence: dressing, feeding, personal hygiene',
      'Pencil grasp optimization, school readiness, and tool manipulation',
      'Elevating motor-based attention span and task persistence'
    ],
    targetAges: 'كافة الفئات العمرية للأطفال',
    targetAgesEn: 'All pediatric age groups',
    durationMinutes: 45,
    iconName: 'Hand',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
    featured: true
  },
  {
    id: 'srv-sensory',
    title: 'التكامل الحسي',
    titleEn: 'Sensory Integration',
    category: 'sensory',
    categoryAr: 'التكامل الحسي',
    categoryEn: 'Sensory Integration',
    description: 'دعم تنظيم ومعالجة الاستجابات الحسية',
    descriptionEn: 'Supporting the regulation and processing of sensory responses.',
    benefits: [
      'معالجة فرط أو نقص التحسس للمثيرات البصرية والسمعية واللمسية',
      'تنظيم الجهاز الدهليزي والحس العميق في صالة حسية مجهزة عالمياً',
      'تقليل نوبات الانزعاج والتوتر الناتجة عن فرط التحفيز البيئي',
      'تحسين التوازن الحركي والتنظيم الذاتي والهدوء السلوكي للطفل'
    ],
    benefitsEn: [
      'Modulating hyper/hypo-reactivity to tactile, auditory, and visual sensory input',
      'Vestibular and proprioceptive regulation in a fully equipped sensory gym',
      'Mitigating sensory meltdowns and anxiety caused by environmental overload',
      'Advancing postural balance, motor planning, and emotional self-regulation'
    ],
    targetAges: 'من عمر سنتين إلى 14 سنة',
    targetAgesEn: 'Ages 2 to 14 years',
    durationMinutes: 45,
    iconName: 'Brain',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80',
    featured: true
  },
  {
    id: 'srv-learning-difficulties',
    title: 'صعوبات التعلم وحل الواجبات',
    titleEn: 'Learning Difficulties & Homework Support',
    category: 'learning',
    categoryAr: 'صعوبات التعلم والواجبات',
    categoryEn: 'Learning Difficulties',
    description: 'تنمية المهارات الأكاديمية ودعم الطفل في أداء واجباته باستقلالية',
    descriptionEn: 'Academic skill building and empowering the child to manage homework independently.',
    benefits: [
      'تنمية مهارات القراءة والكتابة والعمليات الحسابية الأساسية',
      'دعم وتوجيه الطفل لإنجاز واجباته المدرسية باستقلالية وثقة',
      'استراتيجيات علاجية متخصصة لعسر القراءة وتشتت الانتباه الأكاديمي',
      'تنسيق مستمر مع البيئة المدرسية لتطبيق التعديلات التربوية المناسبة'
    ],
    benefitsEn: [
      'Foundational reading, writing, and mathematical comprehension',
      'Empowering independent homework completion and academic confidence',
      'Evidence-based remediation for dyslexia, dysgraphia, and academic ADHD',
      'Direct collaboration with school staff for tailored educational accommodations'
    ],
    targetAges: 'من عمر 5 سنوات فما فوق',
    targetAgesEn: 'Ages 5 years and above',
    durationMinutes: 50,
    iconName: 'BookOpen',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
    featured: true
  },
  {
    id: 'srv-psychological',
    title: 'التشخيص والعلاج النفسي',
    titleEn: 'Psychological Diagnosis & Therapy',
    category: 'psychological',
    categoryAr: 'التشخيص والعلاج النفسي',
    categoryEn: 'Psychological Care',
    description: 'تقييم وتشخيص وتدخلات نفسية وفق احتياج كل حالة',
    descriptionEn: 'Comprehensive psychological evaluation, diagnosis, and tailored interventions for each case.',
    benefits: [
      'تطبيق اختبارات ومقاييس الذكاء والنمو واضطرابات طيف التوحد وفرط الحركة',
      'إصدار تقارير تشخيصية نفسية دقيقة ومعتمدة لدى الجهات الطبية والتعليمية',
      'جلسات دعم وعلاج نفسي سلوكي معرفي لتجاوز المخاوف والقلق والعدوانية',
      'إرشاد وتوجيه أسري تخصصي لتمكين الوالدين من مساندة طفلهم'
    ],
    benefitsEn: [
      'Standardized developmental, IQ, Autism, and ADHD diagnostic batteries',
      'Official accredited psychological evaluation reports for schools and healthcare entities',
      'Cognitive-behavioral psychological interventions targeting anxiety and tantrums',
      'Specialized parental coaching empowering families to nurture child progress'
    ],
    targetAges: 'كافة الفئات العمرية للأطفال والأسر',
    targetAgesEn: 'All age groups and caregivers',
    durationMinutes: 50,
    iconName: 'HeartHandshake',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    featured: true
  }
];

import { savePersistentModule } from '../utils/persistentSync';

const STORAGE_SERVICES_KEY = 'raba_custom_services_v2';

export const getStoredServices = (): ServiceItem[] => {
  if (typeof window === 'undefined') return SERVICES;
  try {
    const raw = localStorage.getItem(STORAGE_SERVICES_KEY);
    if (!raw) return SERVICES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load stored services', e);
  }
  return SERVICES;
};

export const saveStoredServices = (services: ServiceItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_SERVICES_KEY, JSON.stringify(services));
    window.dispatchEvent(new Event('raba_services_updated'));
  } catch (e) {
    console.error('Failed to save stored services', e);
  }
  savePersistentModule(STORAGE_SERVICES_KEY, services);
};

const STORAGE_PACKAGES_KEY = 'raba_custom_packages_v2';

export const getStoredPackages = (): TherapyPackage[] => {
  if (typeof window === 'undefined') return THERAPY_PACKAGES;
  try {
    const raw = localStorage.getItem(STORAGE_PACKAGES_KEY);
    if (!raw) return THERAPY_PACKAGES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load stored packages', e);
  }
  return THERAPY_PACKAGES;
};

export const saveStoredPackages = (packages: TherapyPackage[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PACKAGES_KEY, JSON.stringify(packages));
    window.dispatchEvent(new Event('raba_packages_updated'));
  } catch (e) {
    console.error('Failed to save stored packages', e);
  }
  savePersistentModule(STORAGE_PACKAGES_KEY, packages);
};

export const THERAPY_PACKAGES: TherapyPackage[] = [
  {
    id: 'pkg-summer-speech',
    name: 'باقة النطق والتخاطب',
    nameEn: 'Speech & Language Summer Package',
    badge: 'باقات الصيف',
    badgeEn: 'Summer Packages',
    tagline: '٣ شهور + شهر مجاناً — برنامج صيفي مكثف لعلاج النطق وتنمية الحصيلة اللغوية',
    taglineEn: '3 Months + 1 Month Free — Intensive summer speech and language development',
    category: 'summer',
    categoryTitle: 'باقات الصيف',
    categoryTitleEn: 'Summer Packages',
    categoryCode: 'باقات الصيف المميزة',
    categoryCodeEn: 'SUMMER PACKAGES',
    sessionsCount: 48,
    durationWeeks: 16,
    durationText: '٣ شهور + شهر مجاناً',
    durationTextEn: '3 Months + 1 Month Free',
    price: 18000,
    originalPrice: 24000,
    features: [
      '٣ شهور + شهر مجاناً متكامل',
      'جلسات فردية مع أخصائي أول نطق وتخاطب',
      'تصحيح مخارج الحروف وتطوير التواصل اللفظي',
      'إرشادات وتدريب منزلي مستمر للأسرة'
    ],
    featuresEn: [
      '3 Months + 1 Month Free',
      'One-on-one sessions with senior speech pathologist',
      'Articulation correction and functional communication',
      'Ongoing home guidance and parent coaching'
    ],
    recommendedFor: 'الأطفال الذين يعانون من تأخر لغوي، التأتأة، أو صعوبة مخارج الحروف خلال الصيف',
    recommendedForEn: 'Children needing summer speech acceleration and language enrichment',
    popular: true,
    colorTheme: 'sky',
    isSummer: true,
    disclaimerText: 'الغياب غير معوض',
    disclaimerTextEn: 'Absence is non-compensated',
    installmentText: 'متاح التقسيط :',
    installmentTextEn: 'Installments Available:'
  },
  {
    id: 'pkg-summer-ot',
    name: 'باقة العلاج الوظيفي',
    nameEn: 'Occupational Therapy Summer Package',
    badge: 'باقات الصيف',
    badgeEn: 'Summer Packages',
    tagline: '٣ شهور + شهر مجاناً — تأهيل حركي وحسي شامل في الصالة الحسية المتطورة',
    taglineEn: '3 Months + 1 Month Free — Sensory integration and fine motor independence',
    category: 'summer',
    categoryTitle: 'باقات الصيف',
    categoryTitleEn: 'Summer Packages',
    categoryCode: 'باقات الصيف المميزة',
    categoryCodeEn: 'SUMMER PACKAGES',
    sessionsCount: 48,
    durationWeeks: 16,
    durationText: '٣ شهور + شهر مجاناً',
    durationTextEn: '3 Months + 1 Month Free',
    price: 21000,
    originalPrice: 28000,
    features: [
      '٣ شهور + شهر مجاناً متكامل',
      'جلسات فردية في صالة التكامل الحسي الحديثة',
      'تطوير التآزر البصري الحركي ومهارات الكتابة',
      'خطة تعزيز الاستقلالية اليومية والاعتماد على الذات'
    ],
    featuresEn: [
      '3 Months + 1 Month Free',
      'Individual sessions in specialized sensory integration gym',
      'Visual-motor coordination and handwriting development',
      'Daily living skills and self-reliance coaching'
    ],
    recommendedFor: 'الأطفال الذين يحتاجون إلى تعزيز التكامل الحسي والمهارات الحركية الدقيقة',
    recommendedForEn: 'Children needing sensory modulation and fine motor enhancement',
    popular: false,
    colorTheme: 'teal',
    isSummer: true,
    disclaimerText: 'الغياب غير معوض',
    disclaimerTextEn: 'Absence is non-compensated',
    installmentText: 'متاح التقسيط :',
    installmentTextEn: 'Installments Available:'
  },
  {
    id: 'pkg-summer-aba-1h',
    name: 'ABA',
    nameEn: 'ABA Summer Package (1 Hour)',
    badge: 'باقات الصيف',
    badgeEn: 'Summer Packages',
    tagline: '٣ شهور + شهر مجاناً — مدة الجلسة ساعة كاملة لتعديل السلوك وتنمية المهارات',
    taglineEn: '3 Months + 1 Month Free — 1-hour session duration of evidence-based ABA',
    category: 'summer',
    categoryTitle: 'باقات الصيف',
    categoryTitleEn: 'Summer Packages',
    categoryCode: 'باقات الصيف المميزة',
    categoryCodeEn: 'SUMMER PACKAGES',
    sessionsCount: 48,
    durationWeeks: 16,
    durationText: '٣ شهور + شهر مجاناً',
    durationTextEn: '3 Months + 1 Month Free',
    sessionDurationText: 'مدة الجلسة ساعة',
    sessionDurationTextEn: 'Session duration: 1 hour',
    price: 15000,
    originalPrice: 20000,
    features: [
      '٣ شهور + شهر مجاناً متكامل',
      'مدة الجلسة: ساعة كاملة مكثفة',
      'تعديل السلوكيات وتطوير المهارات التكيفية واللعب',
      'جلسات إرشاد وتدريب منتظمة للأهل'
    ],
    featuresEn: [
      '3 Months + 1 Month Free',
      'Session duration: 1 full hour',
      'Behavior modification and adaptive skill acquisition',
      'Structured parent training and guidance'
    ],
    recommendedFor: 'الأطفال الراغبين في بناء وتعديل السلوك واكتساب مهارات جديدة خلال الإجازة',
    recommendedForEn: 'Children needing ABA therapy and behavioral foundation over summer',
    popular: false,
    colorTheme: 'purple',
    isSummer: true,
    disclaimerText: 'الغياب غير معوض',
    disclaimerTextEn: 'Absence is non-compensated',
    installmentText: 'متاح التقسيط :',
    installmentTextEn: 'Installments Available:'
  },
  {
    id: 'pkg-summer-aba-2h',
    name: 'باقة الـ ABA',
    nameEn: 'ABA Intensive Summer Package (2 Hours)',
    badge: 'باقات الصيف',
    badgeEn: 'Summer Packages',
    tagline: '٣ شهور + شهر مجاناً — مدة الجلسة ساعتين لتحقيق أعلى نقلة نوعية وسلوكية',
    taglineEn: '3 Months + 1 Month Free — 2-hour intensive sessions for accelerated progress',
    category: 'summer',
    categoryTitle: 'باقات الصيف',
    categoryTitleEn: 'Summer Packages',
    categoryCode: 'باقات الصيف المميزة',
    categoryCodeEn: 'SUMMER PACKAGES',
    sessionsCount: 48,
    durationWeeks: 16,
    durationText: '٣ شهور + شهر مجاناً',
    durationTextEn: '3 Months + 1 Month Free',
    sessionDurationText: 'مدة الجلسة ساعتين',
    sessionDurationTextEn: 'Session duration: 2 hours',
    price: 30000,
    originalPrice: 40000,
    features: [
      '٣ شهور + شهر مجاناً متكامل',
      'مدة الجلسة: ساعتين مكثفتين لتدخل علاجي عميق',
      'تطوير شامل للتواصل اللفظي والتفاعل الاجتماعي',
      'تقارير دورية وإشراف إكلينيكي متخصص'
    ],
    featuresEn: [
      '3 Months + 1 Month Free',
      'Session duration: 2 intensive hours per session',
      'Comprehensive social, cognitive and verbal intervention',
      'Clinical supervision and frequent progress reporting'
    ],
    recommendedFor: 'الأطفال الذين يحتاجون إلى تدخل سلوكي مكثف وعميق خلال فترة الصيف',
    recommendedForEn: 'Children requiring intensive 2-hour daily behavioral therapy',
    popular: true,
    colorTheme: 'rose',
    isSummer: true,
    disclaimerText: 'الغياب غير معوض',
    disclaimerTextEn: 'Absence is non-compensated',
    installmentText: 'متاح التقسيط :',
    installmentTextEn: 'Installments Available:'
  },
  {
    id: 'pkg-assessment',
    name: 'باقة التقييم والتشخيص الشامل',
    nameEn: 'Comprehensive Health & Development Screening',
    badge: 'الأكثر طلباً',
    badgeEn: 'MOST POPULAR',
    tagline: 'تقييم سريري شامل متعدد التخصصات مع خطة علاجية مخصصة لطفلك',
    taglineEn: 'Full-body assessment with multidisciplinary clinical review to catch concerns early.',
    category: 'assessment',
    categoryTitle: 'التشخيص والتقييم',
    categoryTitleEn: 'Preventive Care',
    categoryCode: 'التقييم والتشخيص النمائي',
    categoryCodeEn: 'PREVENTIVE CARE',
    sessionsCount: 3,
    durationWeeks: 1,
    durationText: '3–4 ساعات',
    durationTextEn: '3–4 hours',
    price: 650,
    originalPrice: 850,
    features: [
      'جلسة تقييم علاج وظيفي وتكامل حسي متكاملة (SIPT)',
      'جلسة تقييم نطق وتخاطب وتحديد الفجوات اللغوية',
      'جلسة تقييم سلوكي وتطوري مع استشارة الوالدين',
      'تقرير سريري شامل معتمد لدى المدارس والهيئات الرسمية'
    ],
    featuresEn: [
      'Occupational Therapy & Sensory Integration Evaluation',
      'Speech-Language & Communication Gap Assessment',
      'Parent Developmental & Behavioral Consultation',
      'Accredited Comprehensive Clinical Diagnostic Report'
    ],
    recommendedFor: 'الأطفال الجدد لتحديد دقيق وموثوق للاحتياجات التأهيلية والعلاجية',
    recommendedForEn: 'New admissions needing definitive clinical baseline evaluation',
    popular: true,
    colorTheme: 'mint'
  },
  {
    id: 'pkg-intensive-ot',
    name: 'باقة العلاج الوظيفي والتكامل الحسي المكثفة',
    nameEn: 'Sensory & Motor Intensive Care Package',
    badge: 'تأهيل وظيفي متقدم',
    badgeEn: 'Intensive OT Care',
    tagline: 'برنامج مكثف لتنمية الاستقلالية ومعالجة الاضطرابات الحسية والحركية الدقيقة',
    taglineEn: 'Advanced sensory modulation evaluation and in-depth occupational therapist consult.',
    category: 'sensory',
    categoryTitle: 'العلاج الوظيفي والحسي',
    categoryTitleEn: 'Sensory & OT',
    categoryCode: 'العلاج الوظيفي والتكامل الحسي',
    categoryCodeEn: 'SENSORY & OCCUPATIONAL',
    sessionsCount: 12,
    durationWeeks: 4,
    durationText: '4 أسابيع',
    durationTextEn: '4 weeks',
    price: 2450,
    originalPrice: 3200,
    features: [
      '12 جلسة علاج وظيفي فردية في الصالة الحسية المتطورة',
      'تطبيق استراتيجيات تقوية عضلات اليدين والتآزر البصري الحركي',
      'حقيبة الأدوات الحسية المنزلية مجاناً مع خطة تمارين يومية',
      'تقرير تقدم دوري مع قياس مؤشرات التطور والأداء السلوكي'
    ],
    featuresEn: [
      '12 One-on-One Sensory Integration Gym Sessions',
      'Fine Motor & Visual-Motor Coordination Training',
      'Complimentary Home Sensory Toolkit Kit',
      'Midterm & Final Progress Reports with Measurable KPIs'
    ],
    recommendedFor: 'أطفال التوحد، فرط الحركة وتشتت الانتباه، وصعوبات التناسق الحركي',
    recommendedForEn: 'Children with Autism Spectrum, ADHD, or sensory processing differences',
    popular: false,
    colorTheme: 'rose'
  },
  {
    id: 'pkg-dual-program',
    name: 'الباقة المزدوجة (علاج وظيفي + نطق وتخاطب)',
    nameEn: 'Dual Speech & Motor Integration Package',
    badge: 'تأهيل متكامل مدمج',
    badgeEn: 'Dual Specialist Care',
    tagline: 'دمج ذكي بين التطور الحركي واللغوي لأعلى فائدة علاجية متزامنة',
    taglineEn: 'Specialist-led dual intervention for language and motor skills, with personalised treatment plan.',
    category: 'speech',
    categoryTitle: 'النطق والتخاطب المزدوج',
    categoryTitleEn: 'Speech & Language',
    categoryCode: 'التخاطب والتكامل الحركي',
    categoryCodeEn: 'SPEECH & MOTOR',
    sessionsCount: 16,
    durationWeeks: 6,
    durationText: '6 أسابيع',
    durationTextEn: '6 weeks',
    price: 3350,
    originalPrice: 4400,
    features: [
      '8 جلسات علاج وظيفي وتكامل حسي مع أخصائي أول معتمد',
      '8 جلسات نطق وتخاطب وتواصل لفظي وبصري وتعديل مخارج الحروف',
      'تنسيق مشترك بين الأخصائيين لتوحيد أهداف الجلسات الأسبوعية',
      'استشارة إرشادية أسرية مجانية أسبوعياً مع متابعة التقدم'
    ],
    featuresEn: [
      '8 Senior Clinician Occupational Therapy Sessions',
      '8 Speech & Language Verbal Articulation Sessions',
      'Interdisciplinary Dual-Therapist Goal Alignment',
      'Weekly Family Guidance & Counseling Consult'
    ],
    recommendedFor: 'الأطفال الذين يعانون من تأخر نمائي مشترك بين الحركة والتواصل اللفظي',
    recommendedForEn: 'Children presenting co-occurring developmental and speech delays',
    popular: false,
    colorTheme: 'purple'
  },
  {
    id: 'pkg-early-boost',
    name: 'باقة التدخل المبكر وتعديل السلوك ABA',
    nameEn: 'Early Intervention & ABA Behavior Plan',
    badge: 'تأسيس وبناء سلوكي',
    badgeEn: 'Behavioral Foundation',
    tagline: 'برنامج متكامل لبناء المهارات التكيفية والاجتماعية والتهيئة للمدرسة',
    taglineEn: 'Structured ABA methodology and functional behavioral routines preparing children for school.',
    category: 'aba',
    categoryTitle: 'التدخل المبكر وABA',
    categoryTitleEn: 'Mental & Behavioral Health',
    categoryCode: 'تحليل السلوك التطبيقي ABA',
    categoryCodeEn: 'BEHAVIOR & ABA',
    sessionsCount: 10,
    durationWeeks: 4,
    durationText: '4 أسابيع',
    durationTextEn: '4 weeks',
    price: 2150,
    originalPrice: 2700,
    features: [
      '10 جلسات تحليل سلوك تطبيقي (ABA) مكثفة وتدخل مبكر',
      'جلسات لتعزيز التفاعل الاجتماعي والتواصل البديل',
      'تقليل السلوكيات غير المرغوبة وبناء روتين يومي إيجابي',
      'توفير دليل الأنشطة السلوكية للوالدين للتطبيق المنزلي'
    ],
    featuresEn: [
      '10 Applied Behavior Analysis (ABA) & Early Boost Sessions',
      'Social Skills Interaction & Adaptive Routine Building',
      'Challenging Behavior Reduction & Functional Communication',
      'Home Behavioral Playbook & Structured Family Guidance'
    ],
    recommendedFor: 'الأطفال من عمر سنتين إلى 7 سنوات للتحضير لمرحلة الروضة والمدرسة',
    recommendedForEn: 'Ages 2–7 transitioning to nursery, preschool, or school environments',
    popular: false,
    colorTheme: 'amber'
  },
  {
    id: 'pkg-speech-intensive',
    name: 'باقة تأهيل النطق واللغة والتواصل المعزز',
    nameEn: 'Comprehensive Speech & Communication Plan',
    badge: 'علاج تأخر الكلام',
    badgeEn: 'Speech Focus',
    tagline: 'برنامج متخصص لعلاج التلعثم، تأخر الكلام، وبناء الحصيلة اللغوية',
    taglineEn: 'Targeted speech pathology, articulation therapy, and augmentative communication routines.',
    category: 'speech',
    categoryTitle: 'النطق والتخاطب',
    categoryTitleEn: 'Speech Therapy',
    categoryCode: 'أمراض التخاطب واللغة',
    categoryCodeEn: 'SPEECH PATHOLOGY',
    sessionsCount: 8,
    durationWeeks: 4,
    durationText: '4 أسابيع',
    durationTextEn: '4 weeks',
    price: 1850,
    originalPrice: 2400,
    features: [
      '8 جلسات نطق وتخاطب فردية مكثفة مع أخصائي تخاطب أول',
      'تدريب عضلات النطق وتصحيح مخارج الحروف والأصوات',
      'تفعيل أنظمة التواصل البديل والمعزز (AAC) عند الحاجة',
      'تقرير تطور دوري وجلسة تدريبية للأم لتكرار التمارين بالمنزل'
    ],
    featuresEn: [
      '8 One-on-One Intensive Speech & Language Sessions',
      'Oral Motor Exercises & Articulation Deficit Correction',
      'Augmentative & Alternative Communication (AAC) Integration',
      'Bi-weekly Progress Tracking & Parent Home Coaching'
    ],
    recommendedFor: 'الأطفال الذين يعانون من تأخر لغوي، التأتأة، أو صعوبة نطق الحروف',
    recommendedForEn: 'Children with language delay, stuttering, or articulation difficulties',
    popular: false,
    colorTheme: 'sky'
  }
];

