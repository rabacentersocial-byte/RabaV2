export interface SiteTranslations {
  // Navigation
  nav: {
    home: string;
    about: string;
    services: string;
    packages: string;
    specialists: string;
    blog: string;
    stories: string;
    bookNow: string;
    notifications: string;
    language: string;
  };
  // Hero
  hero: {
    title1: string;
    title2: string;
    aba: string;
    subtitle: string;
    point1: string;
    point2: string;
    point3: string;
    registerNow: string;
    watchVideo: string;
    enrolledBadge: string;
    requestReceived: string;
    teamContact: string;
    prevPhoto: string;
    nextPhoto: string;
  };
  // Pillars
  pillars: {
    title: string;
    subtitle: string;
    bookPillars: string;
    items: {
      leadership: { title: string; desc: string };
      innovation: { title: string; desc: string };
      values: { title: string; desc: string };
      behavior: { title: string; desc: string };
      culture: { title: string; desc: string };
    };
  };
  // About
  about: {
    badge: string;
    badgeSub: string;
    title: string;
    description: string;
    yearsExp: string;
    yearsExpLabel: string;
    beneficiaries: string;
    beneficiariesLabel: string;
    point1: string;
    point2: string;
    point3: string;
    point4: string;
    bacbTitle: string;
    bacbSub: string;
    isoTitle: string;
    isoSub: string;
    bhcoeTitle: string;
    bhcoeSub: string;
  };
  // Stats
  stats: {
    sessions: string;
    sessionsLabel: string;
    children: string;
    childrenLabel: string;
    families: string;
    familiesLabel: string;
    specialists: string;
    specialistsLabel: string;
  };
  // Offers
  offers: {
    badge: string;
    title: string;
    subtitle: string;
    claimBtn: string;
    expiresIn: string;
    currency: string;
    exclusive: string;
    special: string;
    featured: string;
    save: string;
  };
  // Services
  services: {
    badge: string;
    title: string;
    subtitle: string;
    bookSession: string;
    currency: string;
    perSession: string;
    featuresIncluded: string;
    allPrograms: string;
  };
  // Packages
  packages: {
    badge: string;
    title: string;
    subtitle: string;
    bookPackage: string;
    mostPopular: string;
    currency: string;
    month: string;
    featuresTitle: string;
    consultationIncluded: string;
  };
  // Specialists
  specialists: {
    badge: string;
    title: string;
    sliderView: string;
    gridView: string;
    bookSpecialist: string;
    viewCv: string;
    experience: string;
    rating: string;
    reviews: string;
    available: string;
    busy: string;
    patients: string;
    nextSlot: string;
    bookAppointment: string;
  };
  // Notifications Section
  notifications: {
    badge: string;
    title: string;
    subtitle: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    openCenterBtn: string;
    bookEvalBtn: string;
  };
  // Testimonials
  testimonials: {
    badge: string;
    title: string;
    subtitle: string;
    shareStoryBtn: string;
    verifiedParent: string;
    modalTitle: string;
    parentNameLabel: string;
    childNameLabel: string;
    roleLabel: string;
    ratingLabel: string;
    contentLabel: string;
    submitBtn: string;
    cancelBtn: string;
  };
  // Footer
  footer: {
    aboutText: string;
    accreditationBadge: string;
    programsTitle: string;
    contactTitle: string;
    address: string;
    phone: string;
    workingHours: string;
    hoursDetails: string;
    officialLicense: string;
    internationalAccreditations: string;
    qualityProtocols: string;
    copyright: string;
    privacyPolicy: string;
    termsConditions: string;
    medicalEthics: string;
  };
  // Floating Actions
  floating: {
    whatsapp: string;
    aiAssistant: string;
    bookQuick: string;
    scrollTop: string;
    aiTitle: string;
    aiWelcome: string;
    aiAskHelp: string;
  };
  // Modals (Booking, CV, etc.)
  modals: {
    bookingTitle: string;
    bookingSubtitle: string;
    parentName: string;
    parentPhone: string;
    childName: string;
    childAge: string;
    selectService: string;
    selectSpecialist: string;
    selectDate: string;
    selectTime: string;
    notes: string;
    confirmBooking: string;
    close: string;
    cvTitle: string;
    specialties: string;
    education: string;
    certifications: string;
  };
}

export const TRANSLATIONS: Record<'ar' | 'en', SiteTranslations> = {
  ar: {
    nav: {
      home: 'الرئيسية',
      about: 'عن المركز',
      services: 'الخدمات',
      packages: 'الباقات والأسعار',
      specialists: 'الأخصائيون',
      blog: 'المدونة',
      stories: 'قصص النجاح',
      bookNow: 'احجز الآن',
      notifications: 'مركز الإشعارات',
      language: 'English',
    },
    hero: {
      title1: 'مركز رابا للعلاج بتحليل',
      title2: 'السلوك التطبيقي',
      aba: 'ABA',
      subtitle: 'يعد مركز رابا من أقدم المراكز التي تقدم خدمات التأهيل والدعم لذوي الإحتياجات الخاصة، وفق المعايير العالمية المعتمدة.',
      point1: 'تشخيص وتقييم مبني على أساس علمي بشكل فردي لكل مستفيد',
      point2: 'برامج تدخل مبني على تحليل السلوك التطبيقي (ABA)',
      point3: 'دعم نفسي وإرشاد أسري مستمر لتمكين أولياء الأمور',
      registerNow: 'سجل الآن',
      watchVideo: 'شاهد فيديو تعريفي',
      enrolledBadge: 'ينضم لنا يومياً أطفال جدد +1K',
      requestReceived: 'تم استلام طلبك',
      teamContact: 'سيقوم فريق مركز رابا بالتواصل معك قريبًا',
      prevPhoto: 'الصورة السابقة',
      nextPhoto: 'الصورة التالية',
    },
    pillars: {
      title: 'محاور برنامجنا',
      subtitle: 'نقدم مواضيع شاملة لتطوير طفلك وتأهيله سلوكياً ومعرفياً واستقلالية متكاملة',
      bookPillars: 'احجز تقييم طفلك في محاور البرنامج',
      items: {
        leadership: {
          title: 'بناء الشخصية الريادية',
          desc: 'تعزيز الثقة بالنفس والقيادة الإيجابية والاستقلالية من خلال أنشطة تطبيقية ممتعة مبنية على أسس ABA.',
        },
        innovation: {
          title: 'تنمية مهارات الابتكار',
          desc: 'تطوير مهارات التحليل والتفكير المرن وحل المشكلات بطرق إبداعية وملهمة تحفز القدرات المعرفية للطفل.',
        },
        values: {
          title: 'تمكين القيم الأخلاقية',
          desc: 'غرس القيم والأخلاق الحميدة وتعديل السلوك في نفوس الأطفال لبناء جيل متسامح، واثق، ومسؤول.',
        },
        behavior: {
          title: 'تعزيز السلوك الإيجابي',
          desc: 'تعليم الأطفال فنون السلوك التكيفي الراقي وآداب التعامل اليومي وتقليل السلوكيات النمطية بالتعزيز الإيجابي.',
        },
        culture: {
          title: 'استكشاف ثقافات الشعوب',
          desc: 'استكشاف محيط العالم والمجتمع، تعزيز مهارات الدمج المدرسي والمجتمعي وتنمية الفضول المعرفي.',
        },
      },
    },
    about: {
      badge: 'سجل عريق من الإنجازات',
      badgeSub: 'من أقدم المراكز المتخصصة',
      title: 'عن مركز رابا للتأهيل وتحليل السلوك التطبيقي',
      description: 'يعد مركز رابا من أعرق المؤسسات التأهيلية المتخصصة في رعاية أطفال طيف التوحد وتأخر النمو والاضطرابات السلوكية. نعتمد أرقى المناهج الإكلينيكية القائمة على الأدلة العلمية، وتحت إشراف مباشر من كفاءات طبية وتربوية معتمدة دولياً ومصنفة من الهيئة السعودية للتخصصات الصحية ومجلس البورد الدولي لتحليل السلوك (BACB).',
      yearsExp: '+15 سنة',
      yearsExpLabel: 'خبرة سريرية وتأهيلية',
      beneficiaries: '+4,500',
      beneficiariesLabel: 'مستفيد تم تأهيلهم',
      point1: 'خطط علاجية فردية دقيقة مصممة بناءً على أحدث مقاييس التشخيص العالمية (VB-MAPP, ABLLS-R).',
      point2: 'فريق عمل متكامل من استشاريي الطب النفسي، محللي السلوك المعتمدين (BCBA/QBA)، وأخصائيي النطق والتكامل الحسي.',
      point3: 'غرف علاجية مجهزة بأحدث تقنيات التحفيز الحسي والبيئة الطبيعية الآمنة للأطفال.',
      point4: 'شراكة حقيقية مع الأسرة وتدريب منزلي مستمر لضمان تعميم المهارات في الحياة اليومية.',
      bacbTitle: 'BACB',
      bacbSub: 'مجلس تحليل السلوك الدولي',
      isoTitle: 'ISO 9001',
      isoSub: 'الجودة والاعتماد العالمي',
      bhcoeTitle: 'BHCOE',
      bhcoeSub: 'التميز في خدمات التوحد',
    },
    stats: {
      sessions: '500,000+',
      sessionsLabel: 'عدد الجلسات العلاجية المنفذة',
      children: '1,340+',
      childrenLabel: 'عدد الأطفال المستفيدين',
      families: '1,050+',
      familiesLabel: 'عدد الأسر التي تم تمكينها',
      specialists: '48+',
      specialistsLabel: 'أخصائي واستشاري معتمد',
    },
    offers: {
      badge: 'عروض وباقات استثنائية',
      title: 'خصومات حصرية لفترة محدودة',
      subtitle: 'اختر الباقة المناسبة لطفلك واستفد من الدعم التأهيلي بأفضل الأسعار مع أطباء ومحللي سلوك معتمدين',
      claimBtn: 'استفد من هذا العرض',
      expiresIn: 'متاح لفترة محدودة',
      currency: 'ر.س',
      exclusive: 'خصم حصري',
      special: 'عرض خاص',
      featured: 'الأكثر طلباً',
      save: 'وفر',
    },
    services: {
      badge: 'خدماتنا المتخصصة',
      title: 'برامج التأهيل والعلاج المتكاملة',
      subtitle: 'برامج علاجية مصممة خصيصاً لتلبية الاحتياجات الفردية لكل طفل وتحقيق أقصى درجات الاستقلالية والتطور',
      bookSession: 'حجز جلسة تقييم',
      currency: 'ر.س',
      perSession: 'لكل جلسة',
      featuresIncluded: 'المزايا المشمولة:',
      allPrograms: 'جميع برامج المركز معتمدة وفق أعلى معايير الجودة العالمية',
    },
    packages: {
      badge: 'باقات الدعم المكثف',
      title: 'باقات تأهيلية شاملة ومدروسة',
      subtitle: 'باقات متكاملة تضمن استمرارية التدريب والتأهيل ومتابعة أسبوعية دقيقة مع فريق الإشراف الإكلينيكي',
      bookPackage: 'اختيار هذه الباقة',
      mostPopular: 'الباقة الأكثر طلباً',
      currency: 'ر.س',
      month: 'شهرياً',
      featuresTitle: 'مميزات الباقة:',
      consultationIncluded: 'تشمل استشارة أسبوعية مع المشرف الإكلينيكي',
    },
    specialists: {
      badge: 'الكوادر الطبية والتأهيلية المعتمدة',
      title: 'نخبة الأطباء ومحللي السلوك المعتمدين',
      sliderView: 'سلايدر الأطباء التفاعلي (3D Slider)',
      gridView: 'عرض البطاقات والملف (Grid)',
      bookSpecialist: 'حجز استشارة',
      viewCv: 'عرض السيرة الذاتية',
      experience: 'سنوات خبرة',
      rating: 'تقييم معتمد',
      reviews: 'تقييم',
      available: 'متاح اليوم',
      busy: 'في جلسة علاجية',
      patients: 'مستفيد تم تأهيلهم',
      nextSlot: 'الموعد المتاح التالي',
      bookAppointment: 'حجز موعد طبي',
    },
    notifications: {
      badge: 'نظام المتابعة والتنبيهات الذكي',
      title: 'ابقَ على تواصل مستمر مع مواعيد وجلسات طفلك',
      subtitle: 'يقدم المركز نظاماً مؤتمتاً يرسل إشعارات دورية وتنبيهات فورية بمواعيد الجلسات، وتقارير التقدم التأهيلي الأسبوعية',
      feature1Title: 'تذكير ذكي بالمواعيد',
      feature1Desc: 'إشعارات تلقائية قبل الجلسة بـ 24 ساعة وساعتين لتجنب التأخير والغياب.',
      feature2Title: 'تقارير الإنجاز الفورية',
      feature2Desc: 'تحديثات مباشرة بعد كل جلسة توضح المهارات المكتسبة وملاحظات الأخصائي.',
      feature3Title: 'خطة التدريب المنزلي',
      feature3Desc: 'إرشادات مخصصة لأولياء الأمور لتطبيق التمارين التكيفية في البيت بسهولة.',
      openCenterBtn: 'فتح مركز التنبيهات المباشر',
      bookEvalBtn: 'طلب تقرير تقدم أسبوعي',
    },
    testimonials: {
      badge: 'قصص نجاح ملهمة',
      title: 'تجارب وآراء أولياء الأمور',
      subtitle: 'نفخر بشراكتنا مع الأسر وشهاداتهم في التقدم الملحوظ لأطفالهم في النطق والسلوك والاستقلالية',
      shareStoryBtn: 'شارك تجربتك مع رابا',
      verifiedParent: 'ولي أمر مستفيد معتمد',
      modalTitle: 'إضافة تقييم أو قصة نجاح جديدة',
      parentNameLabel: 'اسم ولي الأمر',
      childNameLabel: 'اسم الطفل / المستفيد',
      roleLabel: 'الصفة (مثال: والدة الطفل زياد)',
      ratingLabel: 'التقييم',
      contentLabel: 'نص التقييم والتجربة مع المركز',
      submitBtn: 'إرسال التقييم',
      cancelBtn: 'إلغاء',
    },
    footer: {
      aboutText: 'يعد مركز رابا من أقدم وأعرق المراكز المتخصصة في تقديم خدمات التأهيل والدعم لذوي الاحتياجات الخاصة، برامج تحليل السلوك التطبيقي (ABA)، التشخيص العلمي الفردي، والدعم النفسي والإرشاد الأسري.',
      accreditationBadge: '',
      programsTitle: 'البرامج والخدمات التأهيلية',
      contactTitle: 'معلومات المركز والتواصل',
      address: 'المملكة العربية السعودية',
      phone: '0575100100',
      workingHours: 'أوقات العمل الرسمية',
      hoursDetails: 'الأحد – الخميس: 8:00 ص – 8:00 م',
      officialLicense: '',
      internationalAccreditations: 'الاعتمادات والشهادات الدولية',
      qualityProtocols: 'يطبق المركز أعلى بروتوكولات الجودة العالمية لضمان تحقيق أقصى درجات التقدم الإكلينيكي والسلوكي لكل طفل.',
      copyright: 'جميع الحقوق محفوظة © مركز رابا للتأهيل وتحليل السلوك التطبيقي ABA',
      privacyPolicy: 'سياسة الخصوصية وسرية البيانات',
      termsConditions: 'الشروط والأحكام الطبية',
      medicalEthics: 'ميثاق الأخلاقيات المهنية',
    },
    floating: {
      whatsapp: 'تواصل فوري عبر واتساب',
      aiAssistant: 'المساعد الذكي لمركز رابا',
      bookQuick: 'حجز سريع',
      scrollTop: 'العودة للأعلى',
      aiTitle: 'المساعد الذكي لمركز رابا',
      aiWelcome: 'أهلاً بك! كيف يمكنني مساعدتك في برامج التأهيل، أسعار الجلسات، أو حجز موعد مع أخصائيي رابا اليوم؟',
      aiAskHelp: 'اكتب استفسارك هنا...',
    },
    modals: {
      bookingTitle: 'حجز استشارة أو جلسة تقييم',
      bookingSubtitle: 'اختر الخدمة أو الأخصائي المناسب وسيتم تأكيد موعدك فورياً من الفريق الطبي',
      parentName: 'اسم ولي الأمر الكامل',
      parentPhone: 'رقم الهاتف (واتساب)',
      childName: 'اسم الطفل / المستفيد',
      childAge: 'عمر الطفل (بالسنوات)',
      selectService: 'اختر البرنامج التأهيلي المطلوب',
      selectSpecialist: 'اختر الأخصائي المفضل (اختياري)',
      selectDate: 'تاريخ الموعد المفضل',
      selectTime: 'الوقت المفضل',
      notes: 'ملاحظات إضافية أو تشخيص سابق',
      confirmBooking: 'تأكيد الحجز ومتابعة الدفع',
      close: 'إغلاق',
      cvTitle: 'الملف المهني والسيرة الذاتية للأخصائي',
      specialties: 'مجالات التخصص الدقيقة',
      education: 'المؤهلات العلمية والدرجات الأكاديمية',
      certifications: 'الاعتمادات المهنية والتراخيص',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      packages: 'Packages & Pricing',
      specialists: 'Specialists',
      blog: 'Blog',
      stories: 'Success Stories',
      bookNow: 'Book Now',
      notifications: 'Notification Center',
      language: 'العربية',
    },
    hero: {
      title1: 'RABA Center for Applied',
      title2: 'Behavior Analysis',
      aba: 'ABA',
      subtitle: 'Raba Center is among the foremost certified institutions delivering evidence-based rehabilitation and developmental therapy for children with autism and developmental delays.',
      point1: 'Individualized scientific diagnosis and comprehensive developmental assessment',
      point2: 'Intensive Applied Behavior Analysis (ABA) early intervention programs',
      point3: 'Continuous parental counseling and dedicated family empowerment sessions',
      registerNow: 'Register Now',
      watchVideo: 'Watch Video',
      enrolledBadge: '+1K Children enrolled daily',
      requestReceived: 'Request Received',
      teamContact: 'Our clinical team will contact you shortly',
      prevPhoto: 'Previous Photo',
      nextPhoto: 'Next Photo',
    },
    pillars: {
      title: 'Our Program Pillars',
      subtitle: 'Comprehensive foundational domains designed to develop your child behaviorally, cognitively, and for full independence',
      bookPillars: 'Book an Assessment across Program Pillars',
      items: {
        leadership: {
          title: 'Leadership & Self-Confidence',
          desc: 'Building self-reliance, positive decision-making, and functional independence through structured, fun ABA activities.',
        },
        innovation: {
          title: 'Cognitive Innovation Skills',
          desc: 'Nurturing problem-solving, flexible thinking, and exploratory play to stimulate the child\'s cognitive potential.',
        },
        values: {
          title: 'Moral & Social Values',
          desc: 'Fostering ethical behavior, empathetic communication, and peer cooperation to raise confident, responsible individuals.',
        },
        behavior: {
          title: 'Positive Adaptive Behavior',
          desc: 'Teaching everyday manners, social adaptation, and decreasing repetitive patterns through positive reinforcement.',
        },
        culture: {
          title: 'Community & Cultural Integration',
          desc: 'Preparing the child for successful inclusive schooling, social participation, and community life.',
        },
      },
    },
    about: {
      badge: 'Heritage of Excellence',
      badgeSub: 'Pioneer Specialized Center',
      title: 'About RABA Center for Applied Behavior Analysis',
      description: 'Raba Center is one of the premier rehabilitation centers dedicated to serving children with Autism Spectrum Disorder (ASD), developmental delays, and behavioral challenges. We apply rigorous evidence-based clinical protocols under the direct supervision of internationally certified behavioral analysts (BCBA/QBA) and SCFHS-licensed clinicians.',
      yearsExp: '+15 Years',
      yearsExpLabel: 'Clinical & Therapy Experience',
      beneficiaries: '+4,500',
      beneficiariesLabel: 'Children & Beneficiaries Rehabilitated',
      point1: 'Precision individualized treatment plans based on internationally standardized assessments (VB-MAPP, ABLLS-R).',
      point2: 'Multidisciplinary team of child clinical psychologists, board-certified behavior analysts, speech pathologists, and OT clinicians.',
      point3: 'State-of-the-art sensory integration rooms and safe natural environment learning spaces.',
      point4: 'True family partnership with hands-on home training to ensure skill generalization into daily routines.',
      bacbTitle: 'BACB',
      bacbSub: 'Behavior Analyst Certification Board',
      isoTitle: 'ISO 9001',
      isoSub: 'International Quality Certified',
      bhcoeTitle: 'BHCOE',
      bhcoeSub: 'Behavioral Health Center of Excellence',
    },
    stats: {
      sessions: '500,000+',
      sessionsLabel: 'Therapy Sessions Completed',
      children: '1,340+',
      childrenLabel: 'Enrolled Children',
      families: '1,050+',
      familiesLabel: 'Empowered Families',
      specialists: '48+',
      specialistsLabel: 'Certified Clinicians & Therapists',
    },
    offers: {
      badge: 'Special Offers & Packages',
      title: 'Limited-Time Exclusive Discounts',
      subtitle: 'Select the optimal package for your child and access top-tier clinical rehabilitation at preferential rates',
      claimBtn: 'Claim This Offer',
      expiresIn: 'Limited-Time Offer',
      currency: 'SAR',
      exclusive: 'Exclusive Discount',
      special: 'Special Offer',
      featured: 'Most Popular',
      save: 'Save',
    },
    services: {
      badge: 'Clinical Services',
      title: 'Integrated Rehabilitation & Therapy Programs',
      subtitle: 'Custom-tailored intervention programs engineered to meet each child\'s individual needs and achieve peak independence',
      bookSession: 'Book Assessment Session',
      currency: 'SAR',
      perSession: 'per session',
      featuresIncluded: 'Included Features:',
      allPrograms: 'All center clinical programs adhere to international healthcare standards',
    },
    packages: {
      badge: 'Intensive Support Plans',
      title: 'Structured Monthly Rehabilitation Packages',
      subtitle: 'Holistic packages providing regular treatment, continuous clinical oversight, and detailed weekly parent progress reports',
      bookPackage: 'Select This Package',
      mostPopular: 'Most Popular Package',
      currency: 'SAR',
      month: 'Monthly',
      featuresTitle: 'Package Features:',
      consultationIncluded: 'Includes weekly clinical supervisor consult',
    },
    specialists: {
      badge: 'Certified Medical & Clinical Faculty',
      title: 'Our Leading Specialists & Board-Certified Analysts',
      sliderView: 'Interactive Doctor Slider (3D)',
      gridView: 'Grid View & Directory',
      bookSpecialist: 'Book Consultation',
      viewCv: 'View Professional CV',
      experience: 'Years Experience',
      rating: 'Certified Rating',
      reviews: 'reviews',
      available: 'Available Today',
      busy: 'In Session',
      patients: 'Patients Rehabilitated',
      nextSlot: 'Next Available Slot',
      bookAppointment: 'Book Appointment',
    },
    notifications: {
      badge: 'Smart Care & Notification System',
      title: 'Stay Continuously Connected with Your Child\'s Sessions',
      subtitle: 'Our automated notification platform sends timely reminders, scheduled session updates, and weekly clinical milestone summaries',
      feature1Title: 'Smart Appointment Reminders',
      feature1Desc: 'Automated reminders sent 24h and 2h prior to appointments to ensure seamless consistency.',
      feature2Title: 'Real-Time Progress Reports',
      feature2Desc: 'Instant session debriefs and clinician observations delivered straight to your dashboard.',
      feature3Title: 'Home Training Assignments',
      feature3Desc: 'Structured home extension exercises to easily practice adaptive skills in family life.',
      openCenterBtn: 'Open Notification Center',
      bookEvalBtn: 'Request Weekly Progress Summary',
    },
    testimonials: {
      badge: 'Inspiring Journeys',
      title: 'Parent Experiences & Success Stories',
      subtitle: 'We take pride in our family partnerships and the remarkable breakthroughs in communication, independence, and behavior',
      shareStoryBtn: 'Share Your Experience with RABA',
      verifiedParent: 'Verified RABA Parent',
      modalTitle: 'Submit a Parent Review or Story',
      parentNameLabel: 'Parent Name',
      childNameLabel: 'Child Name',
      roleLabel: 'Role (e.g., Mother of Ziad)',
      ratingLabel: 'Rating',
      contentLabel: 'Your Experience with Raba Center',
      submitBtn: 'Submit Review',
      cancelBtn: 'Cancel',
    },
    footer: {
      aboutText: 'Raba Center is one of the premier clinical institutions dedicated to pediatric rehabilitation, Applied Behavior Analysis (ABA), precision developmental diagnosis, and continuous family counseling.',
      accreditationBadge: '',
      programsTitle: 'Therapeutic Programs & Services',
      contactTitle: 'Center Information & Contact',
      address: 'Kingdom of Saudi Arabia',
      phone: '0575100100',
      workingHours: 'Official Working Hours',
      hoursDetails: 'Sunday – Thursday: 8:00 AM – 8:00 PM',
      officialLicense: '',
      internationalAccreditations: 'International Accreditations & Quality',
      qualityProtocols: 'The center adheres to the highest global protocols to maximize clinical and developmental growth for every child.',
      copyright: 'All Rights Reserved © RABA Center for Applied Behavior Analysis ABA',
      privacyPolicy: 'Privacy Policy & Data Confidentiality',
      termsConditions: 'Clinical Terms & Conditions',
      medicalEthics: 'Code of Professional Ethics',
    },
    floating: {
      whatsapp: 'Instant WhatsApp Support',
      aiAssistant: 'Raba Intelligent Assistant',
      bookQuick: 'Quick Booking',
      scrollTop: 'Back to Top',
      aiTitle: 'RABA AI Clinical Assistant',
      aiWelcome: 'Hello! How can I assist you today regarding therapy programs, session pricing, or booking with our specialists?',
      aiAskHelp: 'Type your inquiry here...',
    },
    modals: {
      bookingTitle: 'Book Consultation or Evaluation Session',
      bookingSubtitle: 'Choose your desired therapy service or specialist, and our clinical team will confirm promptly',
      parentName: 'Full Parent Name',
      parentPhone: 'Phone Number (WhatsApp)',
      childName: 'Child / Beneficiary Name',
      childAge: 'Child Age (Years)',
      selectService: 'Select Desired Program',
      selectSpecialist: 'Select Preferred Specialist (Optional)',
      selectDate: 'Preferred Date',
      selectTime: 'Preferred Time Slot',
      notes: 'Additional Notes or Prior Diagnosis',
      confirmBooking: 'Confirm Booking & Proceed',
      close: 'Close',
      cvTitle: 'Specialist Professional Biography',
      specialties: 'Clinical Specializations',
      education: 'Academic Degrees & Education',
      certifications: 'Board Certifications & Licenses',
    },
  },
};
