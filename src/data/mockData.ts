import { Specialist, ServiceItem, TherapyPackage, Appointment, NotificationItem, ParentReview } from '../types';

export const SPECIALISTS: Specialist[] = [
  {
    id: 'spec-haneen-obaidi',
    name: 'حنين العبيدي',
    nameEn: 'Haneen Al-Obaidi',
    title: 'رئيس قسم العلاج الوظيفي',
    titleEn: 'Head of Occupational Therapy Department',
    role: 'رئيس قسم العلاج الوظيفي والتكامل الحسي',
    roleEn: 'Head of Occupational Therapy Department',
    avatar: '/images/specialists/haneen_obaidi.jpg',
    experienceYears: 16,
    licenseNumber: 'RABA-OT-016',
    specialties: [
      'بكالوريوس العلاج الوظيفي الجامعة الهاشمية',
      'شهادة ايرس العالمية في التكامل الحسي (Ayres SI)',
      'شهادة Floortime 101',
      'مرخصة في اختبار EASI للتكامل الحسي',
      'تقييم وعلاج المشاكل الحسية والتحديات النمائية لدى الأطفال',
      'خبرة أكثر من 16 سنة في تأهيل الأطفال'
    ],
    specialtiesEn: [
      'B.Sc. in Occupational Therapy (Hashemite University)',
      'Ayres Sensory Integration (CLASI / CASI)',
      'DIR Floortime 101 Certified',
      'Licensed in EASI Sensory Integration Assessment',
      'Sensory & Developmental Challenges in Pediatrics',
      '16+ Years Clinical Pediatric Rehabilitation Experience'
    ],
    education: [
      'بكالوريوس العلاج الوظيفي من الجامعة الهاشمية',
      'شهادة ايرس العالمية في التكامل الحسي (Ayres Sensory Integration)',
      'شهادة Floortime 101 المعتمدة دولياً',
      'مرخصة ومعتمدة في اختبار EASI للتقييم الحسي الدقيق'
    ],
    educationEn: [
      'B.Sc. in Occupational Therapy - The Hashemite University',
      'Ayres Sensory Integration Global Certification',
      'DIR Floortime 101 International Credential',
      'Licensed Assessor for EASI (Evaluation in Sensory Integration)'
    ],
    bio: 'رئيس قسم العلاج الوظيفي بمركز رابا. حاصلة على بكالوريوس العلاج الوظيفي من الجامعة الهاشمية، شهادة ايرس العالمية في التكامل الحسي، شهادة Floortime 101، ومرخصة في اختبار EASI للتكامل الحسي. متخصصة في تقييم وعلاج المشاكل الحسية والتحديات النمائية لدى الأطفال بخبرة عريقة تتجاوز 16 عاماً.',
    bioEn: 'Head of the Occupational Therapy Department at Raba Center. Holds B.Sc. in Occupational Therapy from The Hashemite University, Ayres Sensory Integration Global Certification, Floortime 101, and licensed EASI sensory assessor with over 16 years of pediatric experience.',
    certifications: [
      'شهادة ايرس العالمية في التكامل الحسي (Ayres Sensory Integration)',
      'شهادة Floortime 101 للتطوير النمائي والتواصلي',
      'ترخيص دولي لاختبار تقييم التكامل الحسي EASI',
      'عضوية الجمعيات المهنية لتأهيل الأطفال ذوي التحديات النمائية'
    ],
    certificationsEn: [
      'Ayres Sensory Integration Global Certification',
      'Floortime 101 Certified Practitioner',
      'Licensed EASI (Evaluation in Ayres Sensory Integration) Assessor',
      'Professional Pediatric Rehabilitation Board Member'
    ],
    availableDays: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء'],
    availableDaysEn: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'],
    rating: 4.95,
    reviewsCount: 240,
    sessionPrice: 280
  },
  {
    id: 'spec-rahaf-doghmani',
    name: 'رهف الدغماني',
    nameEn: 'Rahaf Al-Doghmani',
    title: 'إشراف قسم الـ ABA',
    titleEn: 'Supervisor of ABA Department',
    role: 'مشرفة قسم تحليل السلوك التطبيقي ABA',
    roleEn: 'Supervisor of ABA Department & QABA Analyst',
    avatar: '/images/specialists/rahaf_doghmani.jpg',
    experienceYears: 5,
    licenseNumber: 'RABA-ABA-052',
    specialties: [
      'بكالوريوس التربية الخاصة جامعة القصيم',
      'ماجستير في الإضطرابات السلوكية والانفعالية من جامعة الملك سعود',
      'محلل سلوك معتمد من منظمة QABA',
      'خبرة أكثر من 5 سنوات في البرامج السلوكية'
    ],
    specialtiesEn: [
      'B.Sc. in Special Education (Qassim University)',
      'Master in Behavioral & Emotional Disorders (King Saud University)',
      'Certified Behavior Analyst by QABA Board',
      '5+ Years Clinical Experience in ABA Therapy'
    ],
    education: [
      'ماجستير في الإضطرابات السلوكية والانفعالية من جامعة الملك سعود',
      'بكالوريوس التربية الخاصة من جامعة القصيم',
      'اعتماد تحليل السلوك الدولي من البورد الأمريكي QABA'
    ],
    educationEn: [
      'Master in Behavioral and Emotional Disorders - King Saud University',
      'B.Sc. in Special Education - Qassim University',
      'Applied Behavior Analysis Certified by QABA Board'
    ],
    bio: 'مشرفة قسم تحليل السلوك التطبيقي (ABA) بمركز رابا. حاصلة على بكالوريوس التربية الخاصة من جامعة القصيم، وماجستير في الإضطرابات السلوكية والانفعالية من جامعة الملك سعود، ومحلل سلوك معتمد من منظمة QABA بخبرة تفوق 5 سنوات في قيادة وتصميم الخطط السلوكية الفردية للأطفال.',
    bioEn: 'Supervisor of the ABA Department at Raba Center. Holds a Master degree in Behavioral & Emotional Disorders from King Saud University, B.Sc. in Special Education from Qassim University, and QABA Board Certified Behavior Analyst with 5+ years of experience.',
    certifications: [
      'محلل سلوك معتمد من منظمة QABA العالمية',
      'ماجستير الإضطرابات السلوكية والانفعالية - جامعة الملك سعود',
      'اعتماد تصميم الخطط السلوكية التكيفية والحد من السلوكيات النمطية'
    ],
    certificationsEn: [
      'QABA Board Certified Behavior Analyst',
      'Master Degree in Behavioral & Emotional Disorders (KSU)',
      'Individualized Behavior Support Plan Design Credential'
    ],
    availableDays: ['الأحد', 'الإثنين', 'الأربعاء', 'الخميس'],
    availableDaysEn: ['Sunday', 'Monday', 'Wednesday', 'Thursday'],
    rating: 4.9,
    reviewsCount: 175,
    sessionPrice: 270
  },
  {
    id: 'spec-doha-khaled',
    name: 'ضحى خالد',
    nameEn: 'Doha Khaled',
    title: 'إشراف قسم الـ ABA',
    titleEn: 'Supervisor of ABA Department',
    role: 'مشرفة قسم تحليل السلوك التطبيقي ومحلل سلوكي معتمد',
    roleEn: 'ABA Supervisor & Certified Behavior Analyst',
    avatar: '/images/specialists/doha_khaled.jpg',
    experienceYears: 9,
    licenseNumber: 'RABA-ABA-091',
    specialties: [
      'بكالوريوس تربية خاصة من الجامعة العربية',
      'مشرف اخصائي توحد معتمد من البورد الامريكي من منظمة QABA',
      'حاصلة على محلل سلوكي معتمد من منظمة IBAO',
      'خبرة أكثر من 9 سنوات في رعاية وتأهيل التوحد'
    ],
    specialtiesEn: [
      'B.Sc. in Special Education (Arab Open University)',
      'Certified Autism Specialist Supervisor by QABA (QASP-S)',
      'Certified Behavior Analyst by IBAO (IBA)',
      '9+ Years Clinical Practice in Pediatric Autism Rehabilitation'
    ],
    education: [
      'بكالوريوس تربية خاصة من الجامعة العربية',
      'مشرف أخصائي توحد معتمد من البورد الأمريكي من منظمة QABA',
      'محلل سلوكي معتمد من منظمة IBAO الدولية'
    ],
    educationEn: [
      'B.Sc. in Special Education - Arab University',
      'Certified Autism Services Practitioner Supervisor (QABA QASP-S)',
      'Certified Behavior Analyst - IBAO Board'
    ],
    bio: 'مشرفة قسم ABA بمركز رابا، حاصلة على بكالوريوس تربية خاصة من الجامعة العربية، ومشرف أخصائي توحد معتمد من البورد الأمريكي من منظمة QABA، ومحلل سلوكي معتمد من منظمة IBAO بخبرة تزيد عن 9 سنوات في الإشراف الإكلينيكي وتأهيل مهارات أطفال طيف التوحد.',
    bioEn: 'Supervisor in the ABA Department at Raba Center. Holds B.Sc. in Special Education, Certified Autism Specialist Supervisor by QABA, and Certified Behavior Analyst by IBAO with over 9 years of specialized clinical experience.',
    certifications: [
      'مشرف أخصائي توحد معتمد من البورد الأمريكي من منظمة QABA (QASP-S)',
      'محلل سلوكي معتمد من منظمة IBAO الدولية',
      'اعتماد قياس السلوك اللغوي والتواصلي VB-MAPP'
    ],
    certificationsEn: [
      'QABA Board Certified Autism Specialist Supervisor (QASP-S)',
      'IBAO Certified Behavior Analyst (IBA)',
      'VB-MAPP & Behavioral Milestones Assessment'
    ],
    availableDays: ['السبت', 'الأحد', 'الثلاثاء', 'الخميس'],
    availableDaysEn: ['Saturday', 'Sunday', 'Tuesday', 'Thursday'],
    rating: 4.9,
    reviewsCount: 195,
    sessionPrice: 260
  },
  {
    id: 'spec-manar-wahba',
    name: 'منار وهبه',
    nameEn: 'Manar Wahba',
    title: 'إشراف قسم النطق والتخاطب',
    titleEn: 'Supervisor of Speech & Language Pathology Department',
    role: 'مشرفة قسم النطق والتخاطب والتأهيل اللغوي',
    roleEn: 'Speech & Language Pathology Supervisor',
    avatar: '/images/specialists/manar_wahba.jpg',
    experienceYears: 10,
    licenseNumber: 'RABA-SLP-010',
    specialties: [
      'بكالوريوس خدمة اجتماعية جامعة القاهرة',
      'دبلومة تخاطب جامعة عين شمس',
      'دبلومة تربية خاصة علوم إعاقة جامعة الزقازيق',
      'متخصصة opt ومشاكل نطق وسمع',
      'شهادة opt من منظمة ASHA الأمريكية',
      'خبرة أكثر من 10 سنوات في علاج النطق واللغة'
    ],
    specialtiesEn: [
      'B.Sc. in Social Work (Cairo University)',
      'Diploma in Speech & Language Pathology (Ain Shams University)',
      'Diploma in Special Education & Disabilities (Zagazig University)',
      'Oral Placement Therapy (OPT) Specialist',
      'Certified OPT Provider by ASHA (American Speech-Language-Hearing Association)',
      '10+ Years Dedicated Experience in Pediatric Speech Rehabilitation'
    ],
    education: [
      'بكالوريوس خدمة اجتماعية - جامعة القاهرة',
      'دبلومة تخاطب واضطرابات النطق - جامعة عين شمس',
      'دبلومة تربية خاصة علوم إعاقة - جامعة الزقازيق',
      'شهادة Oral Placement Therapy (OPT) من منظمة ASHA الأمريكية'
    ],
    educationEn: [
      'B.Sc. in Social Work - Cairo University',
      'Diploma in Speech & Communication Pathology - Ain Shams University',
      'Diploma in Special Education - Zagazig University',
      'Oral Placement Therapy (OPT) Certified - ASHA (USA)'
    ],
    bio: 'مشرفة قسم النطق والتخاطب بمركز رابا. حاصلة على بكالوريوس خدمة اجتماعية من جامعة القاهرة، دبلومة تخاطب من جامعة عين شمس، دبلومة تربية خاصة علوم إعاقة من جامعة الزقازيق، ومتخصصة في العلاج الوظيفي الفموي opt ومشاكل النطق والسمع وحاصلة على شهادة opt من منظمة ASHA الأمريكية بخبرة تتجاوز 10 سنوات.',
    bioEn: 'Supervisor of the Speech & Language Pathology Department at Raba Center. Holds specialized diplomas from Ain Shams and Zagazig Universities, ASHA-certified in Oral Placement Therapy (OPT), with 10+ years treating complex speech, voice, and articulation challenges.',
    certifications: [
      'شهادة تخصصية في العلاج الفموي الحركي OPT من منظمة ASHA الأمريكية',
      'دبلوم مهني في اضطرابات التواصل والتخاطب - جامعة عين شمس',
      'اعتماد تشخيص وعلاج عيوب النطق والتأتأة والتواصل اللغوي'
    ],
    certificationsEn: [
      'ASHA Certified Oral Placement Therapy (OPT) Specialist',
      'Professional Speech & Communication Diploma (Ain Shams Univ)',
      'Pediatric Articulation & Stuttering Therapy Accreditation'
    ],
    availableDays: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء'],
    availableDaysEn: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'],
    rating: 4.88,
    reviewsCount: 182,
    sessionPrice: 270
  },
  {
    id: 'spec-ahmed-fathi',
    name: 'أحمد فتحي',
    nameEn: 'Ahmed Fathi',
    title: 'أخصائي ABA',
    titleEn: 'ABA Specialist',
    role: 'أخصائي تحليل السلوك التطبيقي المعتمد ABAT',
    roleEn: 'ABA Specialist & Board Certified ABAT',
    avatar: '/images/specialists/ahmed_fathi.jpg',
    experienceYears: 8,
    licenseNumber: 'RABA-ABA-084',
    specialties: [
      'بكالوريوس تربية خاصة جامعة حلوان',
      'دبلوم مهني اضطرابات تواصل وتخاطب جامعة عين شمس',
      'اعتماد البورد الامريكي في تحليل السلوك التطبيقي ABAT',
      'خبرة أكثر من 8 سنوات في البرامج السلوكية'
    ],
    specialtiesEn: [
      'B.Sc. in Special Education (Helwan University)',
      'Professional Diploma in Communication & Speech Disorders (Ain Shams University)',
      'Applied Behavior Analysis Technician (ABAT) Board Certified (QABA)',
      '8+ Years Pediatric Behavioral Experience'
    ],
    education: [
      'بكالوريوس تربية خاصة - جامعة حلوان',
      'دبلوم مهني اضطرابات تواصل وتخاطب - جامعة عين شمس',
      'اعتماد البورد الأمريكي في تحليل السلوك التطبيقي ABAT'
    ],
    educationEn: [
      'B.Sc. in Special Education - Helwan University',
      'Professional Diploma in Communication Disorders - Ain Shams University',
      'ABAT Board Certified - QABA'
    ],
    bio: 'أخصائي تحليل السلوك التطبيقي (ABA) بمركز رابا. حاصل على بكالوريوس تربية خاصة من جامعة حلوان، ودبلوم مهني في اضطرابات التواصل والتخاطب من جامعة عين شمس، ومعتمد من البورد الأمريكي في تحليل السلوك التطبيقي ABAT بخبرة سريرية وميدانية تزيد عن 8 سنوات.',
    bioEn: 'ABA Specialist at Raba Center. Holds B.Sc. in Special Education from Helwan University, Professional Diploma in Communication Disorders from Ain Shams University, and ABAT certified by the American Board (QABA) with over 8 years experience.',
    certifications: [
      'اعتماد البورد الأمريكي في تحليل السلوك التطبيقي ABAT',
      'دبلوم مهني في اضطرابات التواصل والتخاطب - جامعة عين شمس',
      'اعتماد تطبيق استراتيجيات التعزيز الإيجابي وتعديل السلوك'
    ],
    certificationsEn: [
      'Applied Behavior Analysis Technician (ABAT) - QABA Board Certified',
      'Professional Communication Disorders Diploma (Ain Shams)',
      'Positive Reinforcement & Behavior Intervention Accreditation'
    ],
    availableDays: ['السبت', 'الأحد', 'الثلاثاء', 'الأربعاء'],
    availableDaysEn: ['Saturday', 'Sunday', 'Tuesday', 'Wednesday'],
    rating: 4.85,
    reviewsCount: 168,
    sessionPrice: 250
  },
  {
    id: 'spec-mohamed-atef',
    name: 'محمد عاطف',
    nameEn: 'Mohamed Atef',
    title: 'أخصائي ABA',
    titleEn: 'ABA Specialist',
    role: 'أخصائي تحليل السلوك التطبيقي ومشرف توحد مؤهل QASP-S',
    roleEn: 'ABA Specialist & Qualified Autism Services Supervisor (QASP-S)',
    avatar: '/images/specialists/mohamed_atef.jpg',
    experienceYears: 5,
    licenseNumber: 'RABA-ABA-057',
    specialties: [
      'بكالوريوس علوم الاعاقة والتأهيل جامعة الزقازيق',
      'دبلوم خاص من جامعة الزقازيق',
      'مشرف توحد مؤهل من منظمة QASP-S',
      'متخصص في الإعاقة العقلية',
      'خبرة أكثر من 5 سنوات في تأهيل التوحد والإعاقات النمائية'
    ],
    specialtiesEn: [
      'B.Sc. in Disability Sciences & Rehabilitation (Zagazig University)',
      'Special Diploma in Disability Sciences (Zagazig University)',
      'Qualified Autism Services Practitioner Supervisor (QASP-S - QABA)',
      'Specialist in Intellectual & Developmental Disabilities',
      '5+ Years Clinical Experience'
    ],
    education: [
      'بكالوريوس علوم الإعاقة والتأهيل - جامعة الزقازيق',
      'دبلوم خاص من جامعة الزقازيق في رعاية ذوي الإعاقة',
      'اعتماد مشرف توحد مؤهل من منظمة QASP-S الأمريكية'
    ],
    educationEn: [
      'B.Sc. in Disability Sciences & Rehabilitation - Zagazig University',
      'Special Advanced Diploma - Zagazig University',
      'QASP-S Certified Autism Practitioner Supervisor - QABA'
    ],
    bio: 'أخصائي تحليل السلوك التطبيقي (ABA) بمركز رابا. حاصل على بكالوريوس علوم الإعاقة والتأهيل من جامعة الزقازيق، ودبلوم خاص من جامعة الزقازيق، ومشرف توحد مؤهل من منظمة QASP-S الأمريكية، ومتخصص في تأهيل الإعاقة العقلية واضطرابات طيف التوحد بخبرة تزيد عن 5 سنوات.',
    bioEn: 'ABA Specialist at Raba Center. Holds B.Sc. and Special Diploma in Disability Sciences & Rehabilitation from Zagazig University, and is a QASP-S certified Autism Practitioner Supervisor by QABA with 5+ years of specialized clinical experience.',
    certifications: [
      'مشرف توحد مؤهل من منظمة QASP-S الأمريكية التابعة لـ QABA',
      'دبلوم خاص في علوم الإعاقة والتأهيل - جامعة الزقازيق',
      'اعتماد برامج التأهيل النمائي للإعاقات الفكرية والتواصلية'
    ],
    certificationsEn: [
      'QASP-S Board Certified Autism Practitioner Supervisor',
      'Advanced Diploma in Disability Rehabilitation (Zagazig Univ)',
      'Developmental & Intellectual Disability Intervention Credential'
    ],
    availableDays: ['الأحد', 'الإثنين', 'الأربعاء', 'الخميس'],
    availableDaysEn: ['Sunday', 'Monday', 'Wednesday', 'Thursday'],
    rating: 4.88,
    reviewsCount: 154,
    sessionPrice: 250
  },
  {
    id: 'spec-sadeem-mshari',
    name: 'سديم احمد المشاري',
    nameEn: 'Sadeem Ahmed Al-Mashari',
    title: 'أخصائي ABA',
    titleEn: 'ABA Specialist',
    role: 'أخصائي تحليل السلوك ومصنفة من الهيئة السعودية للتخصصات الصحية',
    roleEn: 'ABA Specialist & SCFHS Licensed Psychologist',
    avatar: '/images/specialists/sadeem_mshari.jpg',
    experienceYears: 4,
    licenseNumber: 'RABA-PSY-049',
    specialties: [
      'بكالوريوس علم النفس من جامعة الاميرة نورة',
      'دبلوم المقاييس النفسية من أكاديمية النخبة الدولية',
      'مصنفة من الهيئة السعودية للتخصصات الصحية',
      'حاصلة على رخصة ABAT من البورد الامريكي'
    ],
    specialtiesEn: [
      'B.Sc. in Psychology (Princess Nourah Bint Abdulrahman University)',
      'Diploma in Psychological Assessments (Elite International Academy)',
      'Classified & Licensed by the Saudi Commission for Health Specialties (SCFHS)',
      'ABAT Board Certified by the American Board (QABA)'
    ],
    education: [
      'بكالوريوس علم النفس من جامعة الأميرة نورة بنت عبدالرحمن',
      'دبلوم المقاييس والاختبارات النفسية من أكاديمية النخبة الدولية',
      'تصنيف الهيئة السعودية للتخصصات الصحية (SCFHS)',
      'رخصة فني تحليل سلوك تطبيقي ABAT من البورد الأمريكي QABA'
    ],
    educationEn: [
      'B.Sc. in Psychology - Princess Nourah Bint Abdulrahman University',
      'Diploma in Psychological Testing - Elite International Academy',
      'Licensed Specialist - Saudi Commission for Health Specialties (SCFHS)',
      'ABAT License - QABA Board Certified'
    ],
    bio: 'أخصائي تحليل السلوك التطبيقي (ABA) بمركز رابا. حاصلة على بكالوريوس علم النفس من جامعة الأميرة نورة، ودبلوم المقاييس النفسية من أكاديمية النخبة الدولية، ومصنفة من الهيئة السعودية للتخصصات الصحية، وحاصلة على رخصة ABAT من البورد الأمريكي. متخصصة في القياس والتقييم السلوكي والتأهيل النفسي للأطفال.',
    bioEn: 'ABA Specialist at Raba Center. Holds B.Sc. in Psychology from Princess Nourah University, Diploma in Psychological Testing from Elite International Academy, licensed by SCFHS, and ABAT certified by the American Board (QABA).',
    certifications: [
      'ترخيص وتصنيف الهيئة السعودية للتخصصات الصحية (SCFHS)',
      'رخصة فني تحليل سلوك تطبيقي ABAT من البورد الأمريكي QABA',
      'دبلوم تطبيقي في المقاييس النفسية والنمائية للأطفال'
    ],
    certificationsEn: [
      'Licensed by Saudi Commission for Health Specialties (SCFHS)',
      'Applied Behavior Analysis Technician (ABAT) - QABA Certified',
      'Pediatric Psychological & Developmental Assessment Diploma'
    ],
    availableDays: ['السبت', 'الأحد', 'الثلاثاء', 'الأربعاء'],
    availableDaysEn: ['Saturday', 'Sunday', 'Tuesday', 'Wednesday'],
    rating: 4.9,
    reviewsCount: 142,
    sessionPrice: 260
  },
  {
    id: 'spec-maram-mohamed',
    name: 'مرام محمد',
    nameEn: 'Maram Mohamed',
    title: 'أخصائية ABA',
    titleEn: 'ABA Specialist',
    role: 'أخصائية تحليل السلوك التطبيقي وعلم النفس الإكلينيكي',
    roleEn: 'ABA Specialist & Clinical Psychologist',
    avatar: '/images/specialists/maram_mohamed.jpg',
    experienceYears: 3,
    licenseNumber: 'RABA-ABA-033',
    specialties: [
      'بكالوريوس علم النفس الإكلينيكي جامعة الرباط الوطني',
      'اعتماد البورد الأمريكي ABAT',
      'متخصصة في العلاج عن طريق تحليل السلوك التطبيقي (ABA)',
      'خبرة أكثر من 3 سنوات في الجلسات السلوكية'
    ],
    specialtiesEn: [
      'B.Sc. in Clinical Psychology (National Ribat University)',
      'Applied Behavior Analysis Technician (ABAT) Board Certified',
      'Specialized in Applied Behavior Analysis (ABA) Pediatric Interventions',
      '3+ Years Clinical Practice'
    ],
    education: [
      'بكالوريوس علم النفس الإكلينيكي من جامعة الرباط الوطني',
      'اعتماد البورد الأمريكي في تحليل السلوك التطبيقي ABAT من منظمة QABA',
      'برامج متقدمة في تعديل السلوك للأطفال ذوي طيف التوحد'
    ],
    educationEn: [
      'B.Sc. in Clinical Psychology - The National Ribat University',
      'ABAT Certified by the American Board (QABA)',
      'Advanced Clinical Intervention Protocols in Autism & Behavioral Acquisition'
    ],
    bio: 'أخصائية تحليل السلوك التطبيقي (ABA) بمركز رابا. حاصلة على بكالوريوس علم النفس الإكلينيكي من جامعة الرباط الوطني، وحاصلة على اعتماد البورد الأمريكي ABAT من منظمة QABA، متخصصة في العلاج والتأهيل عن طريق تحليل السلوك التطبيقي (ABA) للأطفال بخبرة تتجاوز 3 سنوات.',
    bioEn: 'ABA Specialist at Raba Center. Holds B.Sc. in Clinical Psychology from National Ribat University and is an ABAT certified practitioner by the American Board (QABA), specializing in evidence-based pediatric ABA therapy with 3+ years experience.',
    certifications: [
      'اعتماد البورد الأمريكي في تحليل السلوك التطبيقي ABAT',
      'شهادة الممارسة الإكلينيكية في علم النفس وتأهيل الأطفال',
      'اعتماد تطبيق جلسات التدريب بالمحاولات المنفصلة DTT'
    ],
    certificationsEn: [
      'Applied Behavior Analysis Technician (ABAT) - QABA Certified',
      'Clinical Child Psychology & Rehabilitation Practice Certificate',
      'Discrete Trial Training (DTT) & Natural Environment Teaching (NET)'
    ],
    availableDays: ['الأحد', 'الإثنين', 'الأربعاء', 'الخميس'],
    availableDaysEn: ['Sunday', 'Monday', 'Wednesday', 'Thursday'],
    rating: 4.85,
    reviewsCount: 130,
    sessionPrice: 240
  },
  {
    id: 'spec-ahmed-raad',
    name: 'أحمد رعد',
    nameEn: 'Ahmed Raad',
    title: 'أخصائي ABA',
    titleEn: 'ABA Specialist',
    role: 'أخصائي تحليل السلوك التطبيقي ABAT والعلوم الصحية',
    roleEn: 'ABA Specialist & Health Sciences Graduate',
    avatar: '/images/specialists/ahmed_raad.jpg',
    experienceYears: 3,
    licenseNumber: 'RABA-ABA-038',
    specialties: [
      'بكالوريوس علوم صحية من جامعة حمص',
      'شهادة أخصائي تحليل السلوك ABAT من البورد الأمريكي',
      'خبرة أكثر من 3 سنوات في الجلسات الفردية وتعديل السلوك'
    ],
    specialtiesEn: [
      'B.Sc. in Health Sciences (Homs University)',
      'Applied Behavior Analysis Technician (ABAT) Board Certified',
      '3+ Years Experience in ABA Therapy & Skill Building'
    ],
    education: [
      'بكالوريوس علوم صحية من جامعة حمص',
      'شهادة أخصائي تحليل السلوك التطبيقي ABAT من البورد الأمريكي QABA',
      'تدريب مكثف على برامج التدخل المبكر وتنمية المهارات التكيفية'
    ],
    educationEn: [
      'B.Sc. in Health Sciences - Homs University',
      'Applied Behavior Analysis Technician (ABAT) - QABA Board Certified',
      'Intensive Training in Early Intervention & Adaptive Skill Acquisition'
    ],
    bio: 'أخصائي تحليل السلوك التطبيقي (ABA) بمركز رابا. حاصل على بكالوريوس علوم صحية من جامعة حمص، وحاصل على شهادة أخصائي تحليل السلوك ABAT من البورد الأمريكي، بخبرة أكثر من 3 سنوات في تقديم جلسات التدخل السلوكي الفردية للأطفال وتطوير مهارات الاستقلالية والتواصل.',
    bioEn: 'ABA Specialist at Raba Center. Holds B.Sc. in Health Sciences from Homs University and is an ABAT certified practitioner by the American Board (QABA) with 3+ years experience delivering one-on-one behavioral intervention for children.',
    certifications: [
      'شهادة أخصائي تحليل السلوك التطبيقي ABAT من البورد الأمريكي QABA',
      'اعتماد تطبيق استراتيجيات التعزيز الإيجابي وتطوير المهارات التكيفية',
      'شهادة الإنعاش القلبي الرئوي والسلامة في مراكز التأهيل'
    ],
    certificationsEn: [
      'Applied Behavior Analysis Technician (ABAT) - QABA Board Certified',
      'Positive Reinforcement & Adaptive Skills Training Credential',
      'Pediatric Healthcare Safety & First Aid Accreditation'
    ],
    availableDays: ['السبت', 'الإثنين', 'الثلاثاء', 'الخميس'],
    availableDaysEn: ['Saturday', 'Monday', 'Tuesday', 'Thursday'],
    rating: 4.82,
    reviewsCount: 125,
    sessionPrice: 240
  },
  {
    id: 'spec-1',
    name: 'احمد أبو زيد أنور',
    nameEn: 'Ahmed Abouzeid Anwar',
    title: 'المدير العام للبرامج التأهيلية | رئيس قسم ABA',
    titleEn: 'General Director of Rehabilitation | Head of ABA',
    role: 'المدير العام للبرامج التأهيلية ورئيس قسم تحليل السلوك',
    roleEn: 'General Director of Programs & Head of ABA',
    avatar: '/images/specialists/ahmed_abouzeid.jpg',
    experienceYears: 12,
    licenseNumber: 'RABA-ABA-0104',
    specialties: ['MA, QBA, IBA', 'خبرة 12 سنة ومقدم CEUs للبورد QABA', 'خطط التدخل السلوكي المكثفة', 'تعديل السلوك وتدريب الكوادر والأسر'],
    specialtiesEn: ['MA, QBA, IBA', '12 Years Clinical Experience & QABA CEUs Provider', 'Intensive Behavioral Intervention Plans', 'Behavior Modification & Parent Coaching'],
    education: [
      'ماجستير تحليل السلوك التطبيقي (MA - Applied Behavior Analysis)',
      'معتمد من البورد الدولي المؤهل لتحليل السلوك (QBA)',
      'معتمد من البورد الدولي لتحليل السلوك (IBA)'
    ],
    educationEn: [
      'Master of Arts in Applied Behavior Analysis (MA - ABA)',
      'Qualified Behavior Analyst (QBA®) Board Certified',
      'International Behavior Analyst (IBA®)'
    ],
    bio: 'المدير العام للبرامج التأهيلية ورئيس قسم ABA بمركز رابا. حاصل على MA، QBA، IBA بخبرة 12 سنة، ومقدم وحدات التعليم المستمر CEUs للبورد الدولي QABA.',
    bioEn: 'General Director of Rehabilitation Programs and Head of ABA at Raba Center. Holds MA, QBA, IBA with 12 years of experience and is an approved CEUs provider for QABA.',
    certifications: [
      'Qualified Behavior Analyst (QBA®) Board Certified',
      'International Behavior Analyst (IBA®)',
      'Approved Continuing Education Provider (ACEP / CEUs Provider)',
      'اعتماد تحليل السلوك التطبيقي المتقدم'
    ],
    certificationsEn: [
      'Qualified Behavior Analyst (QBA®) Board Certified',
      'International Behavior Analyst (IBA®)',
      'Approved Continuing Education Provider (ACEP / CEUs Provider)',
      'Advanced Applied Behavior Analysis Credential'
    ],
    availableDays: ['الأحد', 'الإثنين', 'الأربعاء', 'الخميس'],
    availableDaysEn: ['Sunday', 'Monday', 'Wednesday', 'Thursday'],
    rating: 4.95,
    reviewsCount: 220,
    sessionPrice: 280
  }
];

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
    colorTheme: 'amber',
    isSummer: true,
    disclaimerText: 'الغياب غير معوض',
    disclaimerTextEn: 'Absence is non-compensated',
    installmentText: 'مع إمكانية التقسيط عبر تمارا وإمكان',
    installmentTextEn: 'Installments available via Tamara & Emkan'
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
    installmentText: 'مع إمكانية التقسيط عبر تمارا وإمكان',
    installmentTextEn: 'Installments available via Tamara & Emkan'
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
    installmentText: 'مع إمكانية التقسيط عبر تمارا وإمكان',
    installmentTextEn: 'Installments available via Tamara & Emkan'
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
    installmentText: 'مع إمكانية التقسيط عبر تمارا وإمكان',
    installmentTextEn: 'Installments available via Tamara & Emkan'
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
  },
  {
    id: 'pkg-pediatric-pt',
    name: 'باقة العلاج الطبيعي والتناسق الحركي للأطفال',
    nameEn: 'Pediatric Physical Therapy & Motor Plan',
    badge: 'تأهيل حركي شامل',
    badgeEn: 'Physical Rehab',
    tagline: 'تحفيز التوازن، المشي الصحيح، وتأهيل المهارات الحركية الكبرى',
    taglineEn: 'Gross motor coordination, posture alignment, and pediatric physical rehabilitation.',
    category: 'physical',
    categoryTitle: 'العلاج الطبيعي',
    categoryTitleEn: 'Physical Therapy',
    categoryCode: 'العلاج الطبيعي والتأهيل الحركي',
    categoryCodeEn: 'PHYSICAL THERAPY',
    sessionsCount: 10,
    durationWeeks: 5,
    durationText: '5 أسابيع',
    durationTextEn: '5 weeks',
    price: 2200,
    originalPrice: 2850,
    features: [
      '10 جلسات علاج طبيعي فردية في وحدة التأهيل الحركي',
      'تمارين تحفيز التوازن، تقوية الجذع، والتناسق الحركي العصبي',
      'تصميم جبائر وبرامج تدريب المشي الوظيفي الصحيح',
      'متابعة سريرية دورية وقياس المدى الحركي وقوة العضلات'
    ],
    featuresEn: [
      '10 Pediatric Physical Therapy & Motor Training Sessions',
      'Balance, Postural Alignment & Neuromotor Coordination',
      'Functional Gait Training & Orthotics Assessment',
      'Periodic Range-of-Motion & Muscle Tone Milestone Reports'
    ],
    recommendedFor: 'أطفال متلازمة داون، الشلل الدماغي، وتأخر المشي والتناسق الحركي',
    recommendedForEn: 'Children with motor delays, Down syndrome, cerebral palsy, or gait issues',
    popular: false,
    colorTheme: 'teal'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    referenceNumber: 'REF-84291',
    childName: 'سلطان محمد الشمري',
    childAge: 5,
    guardianName: 'محمد الشمري',
    guardianPhone: '0551234567',
    guardianEmail: 'm.alshammari@example.com',
    serviceId: 'srv-occupational',
    serviceTitle: 'العلاج الوظيفي والتكامل الحسي',
    specialistId: 'spec-1',
    specialistName: 'د. نورة العتيبي',
    date: '2026-09-20',
    timeSlot: '10:00 صباحاً - 10:45 صباحاً',
    notes: 'يعاني من حساسية مفرطة للأصوات ومسك القلم بطريقة غير سليمة',
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'mada',
    amount: 280,
    reminderSettings: {
      whatsapp: true,
      sms: true,
      email: true,
      intervals: ['24h', '2h', '30m']
    },
    createdAt: '2026-09-17'
  },
  {
    id: 'apt-002',
    referenceNumber: 'REF-92104',
    childName: 'ريما عبدالله الحربي',
    childAge: 4,
    guardianName: 'عبدالله الحربي',
    guardianPhone: '0509876543',
    guardianEmail: 'a.alharbi@example.com',
    serviceId: 'srv-speech',
    serviceTitle: 'علاج اضطرابات النطق والتخاطب',
    specialistId: 'spec-3',
    specialistName: 'د. سارة المنصور',
    date: '2026-09-21',
    timeSlot: '04:30 مساءً - 05:15 مساءً',
    notes: 'تأخر في تكوين الجمل وصعوبة نطق حرف الراء والكاف',
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'apple_pay',
    amount: 290,
    reminderSettings: {
      whatsapp: true,
      sms: true,
      email: false,
      intervals: ['24h', '2h']
    },
    createdAt: '2026-09-18'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'تذكير بموعد جلسة العلاج الوظيفي القادمة',
    message: 'عزيزي ولي الأمر، نود تذكيركم بموعد جلسة الطفل (سلطان) مع د. نورة العتيبي غداً في تمام الساعة 10:00 صباحاً. يرجى الحضور قبل الموعد بـ 10 دقائق.',
    date: 'منذ 10 دقائق',
    type: 'reminder',
    read: false,
    appointmentId: 'apt-001',
    channel: 'whatsapp'
  },
  {
    id: 'notif-2',
    title: 'تم تأكيد حجز الموعد بنجاح ورقم السداد',
    message: 'تم استلام وتأكيد سداد جلسة التخاطب للطفلة (ريما) بنجاح عبر مدى. رقم الحجز: REF-92104. نتمنى لها كل التوفيق.',
    date: 'منذ ساعتين',
    type: 'confirmation',
    read: true,
    appointmentId: 'apt-002',
    channel: 'sms'
  },
  {
    id: 'notif-3',
    title: 'تقرير تطور المهارات الحركية الدقيقة جاهز',
    message: 'قام أخصائي العلاج الوظيفي بإيداع تقرير جلسات المتابعة لهذا الأسبوع. يمكنك الاطلاع على توصيات التمارين المنزلية.',
    date: 'أمس',
    type: 'report',
    read: true,
    channel: 'system'
  }
];

export const PARENT_REVIEWS: ParentReview[] = [
  {
    id: 'rev-1',
    parentName: 'سارة المطيري',
    parentNameEn: 'Sarah Mitchell',
    isAnonymous: false,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    location: 'الرياض، حي الملقا',
    locationEn: 'Brooklyn, NY',
    category: 'sensory',
    categoryEn: 'Cardiology',
    treatedBy: 'د. رزان الشمري (أخصائية أولى ABA)',
    treatedByEn: 'Dr. Maya Chen',
    childIssue: 'تكامل حسي وصعوبة في مسك القلم والتركيز',
    childIssueEn: 'Sensory integration, pencil grip difficulty & attention',
    rating: 5,
    comment: 'استمعت الدكتورة بكل صبر لتفاصيل حالة طفلي وشرحت لي كل خطوة في الخطة العلاجية. بعد فترة طويلة من القلق والحيرة، شعرت أخيراً أننا في أيدٍ أمينة وخبيرة. تجربة الحجز والمتابعة كانت سلسة وممتازة.',
    commentEn: 'Dr. Chen took the time to truly listen and explain every step of my diagnosis. After years of anxiety about my heart health, I finally feel in good hands. The booking experience was seamless.',
    specialistName: 'د. نورة العتيبي',
    specialistNameEn: 'Dr. Noura Al-Otaibi',
    date: '12 سبتمبر 2026',
    dateEn: 'Sep 12, 2026',
    improvementDuration: 'تحسن ملحوظ خلال 8 أسابيع',
    improvementDurationEn: 'Remarkable improvement in 8 weeks',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-2',
    parentName: 'م. راكان الدوسري',
    parentNameEn: 'James Okonkwo',
    isAnonymous: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    location: 'الرياض، حي النرجس',
    locationEn: 'Harlem, NY',
    category: 'physical',
    categoryEn: 'Orthopedics',
    treatedBy: 'د. ليلى الشريف (علاج طبيعي وتأهيل حركي)',
    treatedByEn: 'Dr. Samuel Okafor',
    childIssue: 'تأخر في المشي وتناسق الجذع الحركي',
    childIssueEn: 'Gait delay and motor trunk balance',
    rating: 5,
    comment: 'بعد ستة أسابيع فقط من جلسات العلاج الطبيعي والتأهيل الحركي، بدأت ابنتي بالمشي المستقل واستعادة التوازن. كانت الخطة مفصلة وجلسات التأهيل منسقة باحترافية عالية جداً. أنصح بالمركز بشدة.',
    commentEn: 'Six weeks after my knee surgery I’m back to running. The recovery plan was detailed and the physio sessions through Wellside were incredibly well-coordinated. Highly recommend.',
    specialistName: 'د. ليلى الشريف',
    specialistNameEn: 'Dr. Leila Al-Sharif',
    date: '8 سبتمبر 2026',
    dateEn: 'Sep 8, 2026',
    improvementDuration: 'تحسن خلال 6 أسابيع',
    improvementDurationEn: 'Noticeable progress in 6 weeks',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-3',
    parentName: 'أم فيصل الغامدي',
    parentNameEn: 'Priya Nair',
    isAnonymous: false,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    location: 'الرياض، حي الصحافة',
    locationEn: 'Jersey City, NY',
    category: 'aba',
    categoryEn: 'Dermatology',
    treatedBy: 'أ. فهد التميمي (مستشار تحليل سلوك)',
    treatedByEn: 'Dr. Nadia Brooks',
    childIssue: 'صعوبة في التفاعل وتأخر في التواصل والتأقلم',
    childIssueEn: 'Social interaction and behavioral adaptation',
    rating: 5,
    comment: 'كانت لدي مخاوف سلوكية وتواصلية أجلت استشارتها لأشهر. حدد الأخصائي المشكلة فوراً من أول جلسة، والخطة السلوكية اليومية التي وضعها غيرت تفاعل طفلي وهدوءه بالكامل خلال 4 أسابيع.',
    commentEn: 'I had a skin concern I’d been putting off for months. Dr. Brooks identified it immediately and the personalised routine she recommended has completely transformed my skin in 4 weeks.',
    specialistName: 'أ. فهد التميمي',
    specialistNameEn: 'Fahad Al-Tamimi',
    date: '29 أغسطس 2026',
    dateEn: 'Aug 29, 2026',
    improvementDuration: 'تحسن خلال 4 أسابيع',
    improvementDurationEn: 'Transformative growth in 4 weeks',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-4',
    parentName: 'أبو تميم الشهري',
    parentNameEn: 'David Sterling',
    isAnonymous: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    location: 'الرياض، حي الياسمين',
    locationEn: 'Manhattan, NY',
    category: 'speech',
    categoryEn: 'Family Medicine',
    treatedBy: 'د. سارة المنصور (أخصائية تخاطب أولى)',
    treatedByEn: 'Dr. Emily Vance',
    childIssue: 'تأخر في نطق الكلمات والتفاعل اللفظي',
    childIssueEn: 'Speech delay & verbal conversational milestones',
    rating: 5,
    comment: 'نظام التنبيهات التلقائي لمواعيد الجلسات رائع جداً، والأخصائية تعاملت مع تميم بصبر وتشجيع مذهل حتى بدأ ينطق جملاً مركبة ويعبر عما بداخله بطلاقة وثقة.',
    commentEn: 'The automated appointment reminder system was wonderful, and the specialist engaged my child with extraordinary patience and warmth until he spoke complete sentences with total confidence.',
    specialistName: 'د. سارة المنصور',
    specialistNameEn: 'Dr. Sara Al-Mansour',
    date: '20 أغسطس 2026',
    dateEn: 'Aug 20, 2026',
    improvementDuration: 'تحسن خلال 5 أسابيع',
    improvementDurationEn: 'Steady progress in 5 weeks',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-5',
    parentName: 'أم دانة الخالدي',
    parentNameEn: 'Elena Rostova',
    isAnonymous: false,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    location: 'الرياض، حي حطين',
    locationEn: 'Queens, NY',
    category: 'assessment',
    categoryEn: 'Neurology',
    treatedBy: 'د. خالد العمري (استشاري نمو وسلوك)',
    treatedByEn: 'Dr. Jonathan Reese',
    childIssue: 'تقييم نمائي شامل وتشتت انتباه',
    childIssueEn: 'Comprehensive developmental assessment & attention',
    rating: 5,
    comment: 'تقرير التقييم الشامل كان دقيقاً للغاية ومعتمداً ومفصلاً في كل جانب حركي ولغوي. وضع لنا خارطة طريق واضحة، وزال كل التوتر والغموض الذي كنا نعيشه.',
    commentEn: 'The comprehensive diagnostic evaluation was extraordinarily precise and detailed across motor and speech milestones. It provided a clear roadmap and removed all our anxiety.',
    specialistName: 'د. نورة العتيبي',
    specialistNameEn: 'Dr. Noura Al-Otaibi',
    date: '14 أغسطس 2026',
    dateEn: 'Aug 14, 2026',
    improvementDuration: 'خطة علاجية واضحة',
    improvementDurationEn: 'Definitive clinical roadmap',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-6',
    parentName: 'أبو يوسف القحطاني',
    parentNameEn: 'Marcus Vance',
    isAnonymous: false,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    location: 'الرياض، حي اليرموك',
    locationEn: 'Hoboken, NJ',
    category: 'pediatrics',
    categoryEn: 'Pediatrics',
    treatedBy: 'أ. ماجد القحطاني (أخصائي تدخل مبكر)',
    treatedByEn: 'Dr. Alan Morales',
    childIssue: 'التدخل المبكر وتهيئة الروضة',
    childIssueEn: 'Early childhood intervention & preschool readiness',
    rating: 5,
    comment: 'برنامج التدخل المبكر كان الخطوة الأفضل التي اتخذناها لطفلنا قبل دخول الروضة. الروتين المنزلي والمدرسي أصبح أكثر استقراراً، والتعامل الإنساني والمهني في رابا استثنائي.',
    commentEn: 'The early intervention plan was the best decision for our child before starting preschool. His daily routine is stable and the supportive staff at the clinic are truly world-class.',
    specialistName: 'أ. ماجد القحطاني',
    specialistNameEn: 'Majed Al-Qahtani',
    date: '5 أغسطس 2026',
    dateEn: 'Aug 5, 2026',
    improvementDuration: 'تطور مستمر',
    improvementDurationEn: 'Continuous growth',
    verifiedBeneficiary: true
  }
];

export const TIME_SLOTS = [
  '09:00 صباحاً - 09:45 صباحاً',
  '10:00 صباحاً - 10:45 صباحاً',
  '11:00 صباحاً - 11:45 صباحاً',
  '04:00 مساءً - 04:45 مساءً',
  '05:00 مساءً - 05:45 مساءً',
  '06:00 مساءً - 06:45 مساءً',
  '07:00 مساءً - 07:45 مساءً'
];
