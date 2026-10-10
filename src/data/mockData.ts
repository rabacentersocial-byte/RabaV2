import { Specialist, ServiceItem, TherapyPackage, Appointment, NotificationItem, ParentReview } from '../types';

export const SPECIALISTS: Specialist[] = [
  {
    "id": "spec-hanaa-basheer",
    "name": "د. هناء بشير",
    "nameEn": "Dr. Hanaa Basheer",
    "title": "أخصائي نفسي أول / المدير الطبي لمراكز رابا",
    "titleEn": "Senior Clinical Psychologist & Medical Director",
    "role": "أخصائي نفسي أول / المدير الطبي لمراكز رابا",
    "roleEn": "Senior Clinical Psychologist & Medical Director",
    "category": "psychology",
    "department": "القسم الطبي والإرشاد النفسي الإكلينيكي",
    "avatar": "/uploads/1790827426491_50_png.png",
    "experienceYears": 15,
    "licenseNumber": "SCFHS-24-1022",
    "specialties": [
      "أخصائي نفسي أول والمدير الطبي لمراكز رابا",
      "حاصلة على دكتوراه في علم النفس تخصص داخلي سريري",
      "ماجستير العلاج النفسي ودبلوم الاحتياجات الخاصة من جامعة النيلين",
      "دبلومة العلاج السلوكي المعرفي CBT من جامعة القراءة ببريطانيا",
      "إعتماد بورد التشخيص الأمريكي لمقياس ADOS-2",
      "عضو في الجمعية النفسية الأمريكية APA",
      "استشاري علم النفس في المجلس القومي للمهن الطبية والصحية",
      "خبرة عملية أكثر من 15 سنة"
    ],
    "specialtiesEn": [
      "Senior Clinical Psychologist & Medical Director",
      "Ph.D. in Clinical Psychology - National Ribat University",
      "M.Sc. in Psychotherapy & Special Needs Diploma",
      "Cognitive Behavioral Therapy (CBT) - Univ. of Reading, UK",
      "ADOS-2 Autism Diagnostics American Board Credential",
      "Member of the American Psychological Association (APA)",
      "Consultant - National Council for Medical Professions",
      "15+ Years Clinical Experience"
    ],
    "education": [
      "حاصلة على بكالوريوس علم النفس العام من جامعة النيلين",
      "حاصلة على ماجستير العلاج النفسي من جامعة النيلين",
      "حاصلة على دكتوراه في علم النفس تخصص داخلي سريري من جامعة الرباط الوطني",
      "حاصلة على دبلوم الإحتياجات الخاصة من جامعة النيلين",
      "حاصلة على دبلومة العلاج السلوكي المعرفي من جامعة القراءة في بريطانيا"
    ],
    "educationEn": [
      "B.Sc. in General Psychology - Al-Neelain University",
      "M.Sc. in Psychotherapy - Al-Neelain University",
      "Ph.D. in Clinical Psychology - The National Ribat University",
      "Diploma in Special Needs - Al-Neelain University",
      "Diploma in Cognitive Behavioral Therapy (CBT) - University of Reading, UK"
    ],
    "bio": "أخصائي نفسي أول والمدير الطبي لمراكز رابا. حاصلة على دكتوراه في علم النفس السريري من جامعة الرباط الوطني، وماجستير العلاج النفسي ودبلوم الاحتياجات الخاصة من جامعة النيلين، ودبلومة العلاج السلوكي المعرفي من جامعة القراءة في بريطانيا. معتمدة من بورد التشخيص الأمريكي لمقياس ADOS-2، وعضو في الجمعية النفسية الأمريكية APA، واستشاري علم النفس بالمجلس القومي للمهن الطبية والصحية بخبرة سريرية تتجاوز 15 عاماً.",
    "bioEn": "Senior Clinical Psychologist and Medical Director at Raba Centers. Holds a PhD in Clinical Psychology from National Ribat University, MSc in Psychotherapy and Diploma in Special Needs from Al-Neelain University, and a Diploma in Cognitive Behavioral Therapy from the University of Reading, UK. Certified by the American Board for ADOS-2 Autism Diagnostics, Member of the American Psychological Association (APA), and Consultant at the National Council for Medical Professions with over 15 years of clinical leadership.",
    "certifications": [
      "حاصلة على إعتماد بورد التشخيص الأمريكي لمقياس ADOS-2",
      "عضو في الجمعية النفسية الأمريكية APA",
      "إستشاري علم النفس في المجلس القومي للمهن الطبية و الصحية بالسودان"
    ],
    "certificationsEn": [
      "Certified ADOS-2 Autism Diagnostic Evaluator - American Board",
      "Member of the American Psychological Association (APA)",
      "Consultant Psychologist - National Council for Medical & Health Professions"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "rating": 4.98,
    "reviewsCount": 320,
    "sessionPrice": 0,
    "fallbackAvatar": "/specialists/cards/spec_22_hanaa-basheer.png",
    "posterCrop": "/specialists/cards/spec_22_hanaa-basheer.png",
    "portraitCrop": "/specialists/cards/spec_22_hanaa-basheer.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790827426491_50_png.png",
    "orderIndex": 0,
    "image": "/uploads/1790827426491_50_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-1",
    "name": "احمد أبو زيد أنور",
    "nameEn": "Ahmed Abouzeid Anwar",
    "title": "المدير العام للبرامج التأهيلية | رئيس قسم ABA",
    "titleEn": "General Director of Rehabilitation | Head of ABA",
    "role": "المدير العام للبرامج التأهيلية ورئيس قسم تحليل السلوك",
    "roleEn": "General Director of Programs & Head of ABA",
    "avatar": "/uploads/1790826219680_16_png.png",
    "experienceYears": 12,
    "licenseNumber": "RABA-ABA-0104",
    "specialties": [
      "MA, QBA, IBA",
      "خبرة 12 سنة ومقدم CEUs للبورد QABA",
      "خطط التدخل السلوكي المكثفة",
      "تعديل السلوك وتدريب الكوادر والأسر"
    ],
    "specialtiesEn": [
      "MA, QBA, IBA",
      "12 Years Clinical Experience & QABA CEUs Provider",
      "Intensive Behavioral Intervention Plans",
      "Behavior Modification & Parent Coaching"
    ],
    "education": [
      "ماجستير تحليل السلوك التطبيقي (MA - Applied Behavior Analysis)",
      "معتمد من البورد الدولي المؤهل لتحليل السلوك (QBA)",
      "معتمد من البورد الدولي لتحليل السلوك (IBA)"
    ],
    "educationEn": [
      "Master of Arts in Applied Behavior Analysis (MA - ABA)",
      "Qualified Behavior Analyst (QBA®) Board Certified",
      "International Behavior Analyst (IBA®)"
    ],
    "bio": "المدير العام للبرامج التأهيلية ورئيس قسم ABA بمركز رابا. حاصل على MA، QBA، IBA بخبرة 12 سنة، ومقدم وحدات التعليم المستمر CEUs للبورد الدولي QABA.",
    "bioEn": "General Director of Rehabilitation Programs and Head of ABA at Raba Center. Holds MA, QBA, IBA with 12 years of experience and is an approved CEUs provider for QABA.",
    "certifications": [
      "Qualified Behavior Analyst (QBA®) Board Certified",
      "International Behavior Analyst (IBA®)",
      "Approved Continuing Education Provider (ACEP / CEUs Provider)",
      "اعتماد تحليل السلوك التطبيقي المتقدم"
    ],
    "certificationsEn": [
      "Qualified Behavior Analyst (QBA®) Board Certified",
      "International Behavior Analyst (IBA®)",
      "Approved Continuing Education Provider (ACEP / CEUs Provider)",
      "Advanced Applied Behavior Analysis Credential"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Wednesday",
      "Thursday"
    ],
    "rating": 4.95,
    "reviewsCount": 220,
    "sessionPrice": 280,
    "fallbackAvatar": "/specialists/cards/spec_10_1.png",
    "posterCrop": "/specialists/cards/spec_10_1.png",
    "portraitCrop": "/specialists/cards/spec_10_1.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790826219680_16_png.png",
    "orderIndex": 10,
    "category": "aba",
    "image": "/uploads/1790826219680_16_png.png",
    "isTopRated": true
  },
  {
    "id": "spec-hesham-ali",
    "name": "هشام علي",
    "nameEn": "Hesham Ali",
    "title": "رئيس قسم النطق والتخاطب",
    "titleEn": "Head of Speech and Language Department",
    "role": "رئيس قسم النطق والتخاطب",
    "roleEn": "Head of Speech & Language Pathology Department",
    "category": "speech",
    "department": "قسم النطق والتخاطب واضطرابات التواصل",
    "avatar": "/uploads/1791187379881_60_png.png",
    "experienceYears": 20,
    "licenseNumber": "SCFHS-SLP-014",
    "specialties": [
      "رئيس قسم النطق والتخاطب بمراكز رابا",
      "بكالوريوس التربية الخاصة - جامعة عين شمس",
      "تمهيدي ماجستير في اضطرابات النطق والكلام",
      "علاج التلعثم واضطرابات مخارج الحروف والنمو اللغوي",
      "خبرة عملية أكثر من 20 سنة"
    ],
    "specialtiesEn": [
      "Speech & Language Pathology Consultant",
      "Augmentative and Alternative Communication (AAC)",
      "Stuttering & Fluency Disorders Therapy",
      "Auditory Verbal Therapy & Cochlear Implant Rehab",
      "14+ Years Clinical Experience"
    ],
    "education": [
      "ماجستير أمراض التخاطب واللغة",
      "بكالوريوس علوم السمع والنطق"
    ],
    "educationEn": [
      "Master Degree in Speech-Language Pathology",
      "B.Sc. in Hearing and Speech Sciences"
    ],
    "bio": "رئيس قسم النطق والتخاطب بمراكز رابا. خبير واستشاري علاج اضطرابات النطق والكلام وتأخر النمو اللغوي والعيّ والتلعثم، حاصل على بكالوريوس وتمهيدي ماجستير اضطرابات النطق والكلام من جامعة عين شمس بخبرة سريرية تفوق 20 عاماً.",
    "bioEn": "Head of Speech-Language Pathology Department at Raba Center with over 14 years of clinical experience in evaluating and treating speech, language delay, stuttering, and cochlear implant habilitation.",
    "certifications": [
      "ترخيص استشاري تخاطب من الهيئة السعودية للتخصصات الصحية",
      "شهادة معتمدة في تقنيات التواصل البديل والمعزز AAC"
    ],
    "certificationsEn": [
      "SCFHS Consultant License",
      "AAC Certified Specialist"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "rating": 4.97,
    "reviewsCount": 230,
    "sessionPrice": 280,
    "fallbackAvatar": "/specialists/cards/spec_60_hesham-ali.png",
    "cardImage": "/uploads/1791187379881_60_png.png",
    "image": "/uploads/1791187379881_60_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-haneen-obaidi",
    "name": "حنين العبيدي",
    "nameEn": "Haneen Al-Obaidi",
    "title": "رئيس قسم العلاج الوظيفي",
    "titleEn": "Head of Occupational Therapy Department",
    "role": "رئيس قسم العلاج الوظيفي والتكامل الحسي",
    "roleEn": "Head of Occupational Therapy Department",
    "avatar": "/uploads/1790357520279_________________jpg_jpeg.jpg",
    "experienceYears": 16,
    "licenseNumber": "RABA-OT-016",
    "specialties": [
      "بكالوريوس العلاج الوظيفي الجامعة الهاشمية",
      "شهادة ايرس العالمية في التكامل الحسي (Ayres SI)",
      "شهادة Floortime 101",
      "مرخصة في اختبار EASI للتكامل الحسي",
      "تقييم وعلاج المشاكل الحسية والتحديات النمائية لدى الأطفال",
      "خبرة أكثر من 16 سنة في تأهيل الأطفال"
    ],
    "specialtiesEn": [
      "B.Sc. in Occupational Therapy (Hashemite University)",
      "Ayres Sensory Integration (CLASI / CASI)",
      "DIR Floortime 101 Certified",
      "Licensed in EASI Sensory Integration Assessment",
      "Sensory & Developmental Challenges in Pediatrics",
      "16+ Years Clinical Pediatric Rehabilitation Experience"
    ],
    "education": [
      "بكالوريوس العلاج الوظيفي من الجامعة الهاشمية",
      "شهادة ايرس العالمية في التكامل الحسي (Ayres Sensory Integration)",
      "شهادة Floortime 101 المعتمدة دولياً",
      "مرخصة ومعتمدة في اختبار EASI للتقييم الحسي الدقيق"
    ],
    "educationEn": [
      "B.Sc. in Occupational Therapy - The Hashemite University",
      "Ayres Sensory Integration Global Certification",
      "DIR Floortime 101 International Credential",
      "Licensed Assessor for EASI (Evaluation in Sensory Integration)"
    ],
    "bio": "رئيس قسم العلاج الوظيفي بمركز رابا. حاصلة على بكالوريوس العلاج الوظيفي من الجامعة الهاشمية، شهادة ايرس العالمية في التكامل الحسي، شهادة Floortime 101، ومرخصة في اختبار EASI للتكامل الحسي. متخصصة في تقييم وعلاج المشاكل الحسية والتحديات النمائية لدى الأطفال بخبرة عريقة تتجاوز 16 عاماً.",
    "bioEn": "Head of the Occupational Therapy Department at Raba Center. Holds B.Sc. in Occupational Therapy from The Hashemite University, Ayres Sensory Integration Global Certification, Floortime 101, and licensed EASI sensory assessor with over 16 years of pediatric experience.",
    "certifications": [
      "شهادة ايرس العالمية في التكامل الحسي (Ayres Sensory Integration)",
      "شهادة Floortime 101 للتطوير النمائي والتواصلي",
      "ترخيص دولي لاختبار تقييم التكامل الحسي EASI",
      "عضوية الجمعيات المهنية لتأهيل الأطفال ذوي التحديات النمائية"
    ],
    "certificationsEn": [
      "Ayres Sensory Integration Global Certification",
      "Floortime 101 Certified Practitioner",
      "Licensed EASI (Evaluation in Ayres Sensory Integration) Assessor",
      "Professional Pediatric Rehabilitation Board Member"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday"
    ],
    "rating": 4.95,
    "reviewsCount": 240,
    "sessionPrice": 280,
    "fallbackAvatar": "/specialists/cards/spec_01_haneen-obaidi.jpg",
    "posterCrop": "/specialists/cards/spec_01_haneen-obaidi.jpg",
    "portraitCrop": "/specialists/cards/spec_01_haneen-obaidi.jpg",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790357520279_________________jpg_jpeg.jpg",
    "orderIndex": 1,
    "category": "occupational",
    "image": "/uploads/1790357520279_________________jpg_jpeg.jpg",
    "isTopRated": true
  },
  {
    "id": "spec-amer-qadoos",
    "name": "عامر قادوس",
    "nameEn": "Amer Qadous",
    "title": "أخصائي التأهيل العصبي",
    "titleEn": "Neuro-Rehabilitation Specialist",
    "role": "أخصائي التأهيل العصبي ومحلل سلوك دولي IBA",
    "roleEn": "Neuro-Rehabilitation Specialist & Behavior Analyst (IBA)",
    "category": "psychology",
    "department": "قسم النطق والتخاطب والتأهيل السمعي",
    "avatar": "/uploads/1791187395677_61_png.png",
    "experienceYears": 10,
    "licenseNumber": "SCFHS-SLP-010",
    "specialties": [
      "أخصائي التأهيل العصبي وباحث علم النفس العصبي",
      "محلل سلوك دولي معتمد IBA من منظمة IBAO",
      "البورد الدولي للعلاجات النفسية ACT - CBT - DBT من جامعة نيفادا",
      "البورد البريطاني لمقاييس الذكاء والقدرات العقلية",
      "معتمد ساعات CME بالهيئة السعودية للتخصصات الصحية",
      "خبرة عملية أكثر من 10 سنوات في فرنسا وبريطانيا"
    ],
    "specialtiesEn": [
      "Senior Speech & Hearing Specialist",
      "Pediatric Developmental Language Assessment",
      "Early Intervention for Articulation & Stuttering",
      "Autism Spectrum Communication Habilitation",
      "10+ Years Clinical Experience"
    ],
    "education": [
      "بكالوريوس علوم السمع والنطق والتخاطب",
      "دبلوم عالي في التأهيل السمعي اللفظي"
    ],
    "educationEn": [
      "B.Sc. in Speech and Hearing Sciences",
      "Higher Diploma in Auditory-Verbal Rehabilitation"
    ],
    "bio": "أخصائي التأهيل العصبي وباحث ماجستير في علم النفس العصبي. محلل سلوك دولي معتمد IBA وحاصل على البورد الدولي للعلاجات النفسية (ACT, CBT, DBT) من جامعة نيفادا والبورد البريطاني للقدرات العقلية، بخبرة أكثر من 10 سنوات في مراكز التأهيل بفرنسا وبريطانيا.",
    "bioEn": "Senior Speech-Language Pathologist at Raba Center specializing in language delays, speech sound disorders, and pediatric auditory-verbal therapy with over 10 years of experience.",
    "certifications": [
      "ترخيص أخصائي أول من الهيئة السعودية للتخصصات الصحية",
      "شهادة معتمدة في تقييم اضطرابات النطق واللغة"
    ],
    "certificationsEn": [
      "SCFHS Senior Specialist License",
      "Certified Speech Sound Disorders Assessor"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "rating": 4.95,
    "reviewsCount": 185,
    "sessionPrice": 280,
    "fallbackAvatar": "/specialists/cards/spec_61_amer-qadoos.png",
    "cardImage": "/uploads/1791187395677_61_png.png",
    "image": "/uploads/1791187395677_61_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-doha-khaled",
    "name": "ضحى خالد",
    "nameEn": "Doha Khaled",
    "title": "إشراف قسم الـ ABA",
    "titleEn": "Supervisor of ABA Department",
    "role": "مشرفة قسم تحليل السلوك التطبيقي ومحلل سلوكي معتمد",
    "roleEn": "ABA Supervisor & Certified Behavior Analyst",
    "avatar": "/uploads/1790357539758_____________jpg_jpeg.jpg",
    "experienceYears": 9,
    "licenseNumber": "RABA-ABA-091",
    "specialties": [
      "بكالوريوس تربية خاصة من الجامعة العربية",
      "مشرف اخصائي توحد معتمد من البورد الامريكي من منظمة QABA",
      "حاصلة على محلل سلوكي معتمد من منظمة IBAO",
      "خبرة أكثر من 9 سنوات في رعاية وتأهيل التوحد"
    ],
    "specialtiesEn": [
      "B.Sc. in Special Education (Arab Open University)",
      "Certified Autism Specialist Supervisor by QABA (QASP-S)",
      "Certified Behavior Analyst by IBAO (IBA)",
      "9+ Years Clinical Practice in Pediatric Autism Rehabilitation"
    ],
    "education": [
      "بكالوريوس تربية خاصة من الجامعة العربية",
      "مشرف أخصائي توحد معتمد من البورد الأمريكي من منظمة QABA",
      "محلل سلوكي معتمد من منظمة IBAO الدولية"
    ],
    "educationEn": [
      "B.Sc. in Special Education - Arab University",
      "Certified Autism Services Practitioner Supervisor (QABA QASP-S)",
      "Certified Behavior Analyst - IBAO Board"
    ],
    "bio": "مشرفة قسم ABA بمركز رابا، حاصلة على بكالوريوس تربية خاصة من الجامعة العربية، ومشرف أخصائي توحد معتمد من البورد الأمريكي من منظمة QABA، ومحلل سلوكي معتمد من منظمة IBAO بخبرة تزيد عن 9 سنوات في الإشراف الإكلينيكي وتأهيل مهارات أطفال طيف التوحد.",
    "bioEn": "Supervisor in the ABA Department at Raba Center. Holds B.Sc. in Special Education, Certified Autism Specialist Supervisor by QABA, and Certified Behavior Analyst by IBAO with over 9 years of specialized clinical experience.",
    "certifications": [
      "مشرف أخصائي توحد معتمد من البورد الأمريكي من منظمة QABA (QASP-S)",
      "محلل سلوكي معتمد من منظمة IBAO الدولية",
      "اعتماد قياس السلوك اللغوي والتواصلي VB-MAPP"
    ],
    "certificationsEn": [
      "QABA Board Certified Autism Specialist Supervisor (QASP-S)",
      "IBAO Certified Behavior Analyst (IBA)",
      "VB-MAPP & Behavioral Milestones Assessment"
    ],
    "availableDays": [
      "السبت",
      "الأحد",
      "الثلاثاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Saturday",
      "Sunday",
      "Tuesday",
      "Thursday"
    ],
    "rating": 4.9,
    "reviewsCount": 195,
    "sessionPrice": 260,
    "fallbackAvatar": "/specialists/cards/spec_03_doha-khaled.jpg",
    "posterCrop": "/specialists/cards/spec_03_doha-khaled.jpg",
    "portraitCrop": "/specialists/cards/spec_03_doha-khaled.jpg",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790357539758_____________jpg_jpeg.jpg",
    "orderIndex": 3,
    "category": "aba",
    "image": "/uploads/1790357539758_____________jpg_jpeg.jpg",
    "isTopRated": true
  },
  {
    "id": "spec-heshmah-mutairi",
    "name": "حشمة المطيري",
    "nameEn": "Heshmah Al-Mutairi",
    "title": "المدير الإداري لفرع الربوة",
    "titleEn": "Administrative Director - Al-Rabwah Branch",
    "role": "المدير الإداري لفرع الربوة | فني تحليل سلوك تطبيقي معتمد ABAT",
    "roleEn": "Administrative Director & Certified Applied Behavior Analyst (ABAT)",
    "category": "aba",
    "department": "إدارة الفروع وتطوير البرامج السلوكية",
    "avatar": "/uploads/1790866017691_17_png.png",
    "experienceYears": 7,
    "licenseNumber": "",
    "sessionPrice": 0,
    "rating": 4.96,
    "reviewsCount": 190,
    "specialties": [
      "حاصلة على بكالوريوس التربية الخاصة تخصص صعوبات التعلم من جامعة الملك فيصل",
      "فني تحليل سلوك تطبيقي معتمد ABAT من البورد الدولي QABA",
      "الإدارة الإكلينيكية وضمان جودة برامج التدخل المبكر وتوجيه الكادر التأهيلي",
      "خبرة عملية أكثر من ٧ سنوات"
    ],
    "specialtiesEn": [
      "B.Sc. in Special Education (Learning Disabilities) - King Faisal University",
      "Applied Behavior Analysis Technician (ABAT) - QABA Board Certified",
      "Healthcare Administration & Rehabilitation Quality Management",
      "7+ Years Clinical & Administrative Experience"
    ],
    "education": [
      "بكالوريوس التربية الخاصة (صعوبات التعلم) - جامعة الملك فيصل"
    ],
    "educationEn": [
      "B.Sc. in Special Education - King Faisal University"
    ],
    "certifications": [
      "اعتماد فني تحليل سلوك تطبيقي ABAT من البورد الأمريكي QABA",
      "شهادات الإدارة الصحية المعتمدة"
    ],
    "certificationsEn": [
      "ABAT Credential - Qualified Applied Behavior Analysis Board (QABA)",
      "Healthcare Center Administrative Credentials"
    ],
    "bio": "المدير الإداري لفرع الربوة بمركز رابا. تجمع بين الكفاءة القيادية الإدارية والتخصص الإكلينيكي في صعوبات التعلم وتحليل السلوك التطبيقي (ABAT معتمد)، بخبرة تمتد لأكثر من 7 سنوات في إدارة مراكز التأهيل وتطوير الخطط العلاجية.",
    "bioEn": "Administrative Director of Al-Rabwah Branch at Raba Center, ABAT certified practitioner with B.Sc. from King Faisal University and 7+ years of experience in healthcare management and rehabilitation programs.",
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "fallbackAvatar": "/specialists/cards/spec_27_heshmah-mutairi.png",
    "posterCrop": "/specialists/cards/spec_27_heshmah-mutairi.png",
    "portraitCrop": "/specialists/cards/spec_27_heshmah-mutairi.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790866017691_17_png.png",
    "orderIndex": 27,
    "image": "/uploads/1790866017691_17_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-rahaf-doghmani",
    "name": "رهف الدغماني",
    "nameEn": "Rahaf Al-Doghmani",
    "title": "إشراف قسم الـ ABA",
    "titleEn": "Supervisor of ABA Department",
    "role": "مشرفة قسم تحليل السلوك التطبيقي ABA",
    "roleEn": "Supervisor of ABA Department & QABA Analyst",
    "avatar": "/uploads/1790357530423_________________jpg_jpeg.jpg",
    "experienceYears": 5,
    "licenseNumber": "RABA-ABA-052",
    "specialties": [
      "بكالوريوس التربية الخاصة جامعة القصيم",
      "ماجستير في الإضطرابات السلوكية والانفعالية من جامعة الملك سعود",
      "محلل سلوك معتمد من منظمة QABA",
      "خبرة أكثر من 5 سنوات في البرامج السلوكية"
    ],
    "specialtiesEn": [
      "B.Sc. in Special Education (Qassim University)",
      "Master in Behavioral & Emotional Disorders (King Saud University)",
      "Certified Behavior Analyst by QABA Board",
      "5+ Years Clinical Experience in ABA Therapy"
    ],
    "education": [
      "ماجستير في الإضطرابات السلوكية والانفعالية من جامعة الملك سعود",
      "بكالوريوس التربية الخاصة من جامعة القصيم",
      "اعتماد تحليل السلوك الدولي من البورد الأمريكي QABA"
    ],
    "educationEn": [
      "Master in Behavioral and Emotional Disorders - King Saud University",
      "B.Sc. in Special Education - Qassim University",
      "Applied Behavior Analysis Certified by QABA Board"
    ],
    "bio": "مشرفة قسم تحليل السلوك التطبيقي (ABA) بمركز رابا. حاصلة على بكالوريوس التربية الخاصة من جامعة القصيم، وماجستير في الإضطرابات السلوكية والانفعالية من جامعة الملك سعود، ومحلل سلوك معتمد من منظمة QABA بخبرة تفوق 5 سنوات في قيادة وتصميم الخطط السلوكية الفردية للأطفال.",
    "bioEn": "Supervisor of the ABA Department at Raba Center. Holds a Master degree in Behavioral & Emotional Disorders from King Saud University, B.Sc. in Special Education from Qassim University, and QABA Board Certified Behavior Analyst with 5+ years of experience.",
    "certifications": [
      "محلل سلوك معتمد من منظمة QABA العالمية",
      "ماجستير الإضطرابات السلوكية والانفعالية - جامعة الملك سعود",
      "اعتماد تصميم الخطط السلوكية التكيفية والحد من السلوكيات النمطية"
    ],
    "certificationsEn": [
      "QABA Board Certified Behavior Analyst",
      "Master Degree in Behavioral & Emotional Disorders (KSU)",
      "Individualized Behavior Support Plan Design Credential"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Wednesday",
      "Thursday"
    ],
    "rating": 4.9,
    "reviewsCount": 175,
    "sessionPrice": 270,
    "fallbackAvatar": "/specialists/cards/spec_02_rahaf-doghmani.jpg",
    "posterCrop": "/specialists/cards/spec_02_rahaf-doghmani.jpg",
    "portraitCrop": "/specialists/cards/spec_02_rahaf-doghmani.jpg",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790357530423_________________jpg_jpeg.jpg",
    "orderIndex": 2,
    "category": "aba",
    "image": "/uploads/1790357530423_________________jpg_jpeg.jpg",
    "isTopRated": true
  },
  {
    "id": "spec-manar-wahba",
    "name": "منار وهبه",
    "nameEn": "Manar Wahba",
    "title": "إشراف قسم النطق والتخاطب",
    "titleEn": "Supervisor of Speech & Language Pathology Department",
    "role": "مشرفة قسم النطق والتخاطب والتأهيل اللغوي",
    "roleEn": "Speech & Language Pathology Supervisor",
    "avatar": "/uploads/1790357549806______________jpg_jpeg.jpg",
    "experienceYears": 10,
    "licenseNumber": "RABA-SLP-010",
    "specialties": [
      "بكالوريوس خدمة اجتماعية جامعة القاهرة",
      "دبلومة تخاطب جامعة عين شمس",
      "دبلومة تربية خاصة علوم إعاقة جامعة الزقازيق",
      "متخصصة opt ومشاكل نطق وسمع",
      "شهادة opt من منظمة ASHA الأمريكية",
      "خبرة أكثر من 10 سنوات في علاج النطق واللغة"
    ],
    "specialtiesEn": [
      "B.Sc. in Social Work (Cairo University)",
      "Diploma in Speech & Language Pathology (Ain Shams University)",
      "Diploma in Special Education & Disabilities (Zagazig University)",
      "Oral Placement Therapy (OPT) Specialist",
      "Certified OPT Provider by ASHA (American Speech-Language-Hearing Association)",
      "10+ Years Dedicated Experience in Pediatric Speech Rehabilitation"
    ],
    "education": [
      "بكالوريوس خدمة اجتماعية - جامعة القاهرة",
      "دبلومة تخاطب واضطرابات النطق - جامعة عين شمس",
      "دبلومة تربية خاصة علوم إعاقة - جامعة الزقازيق",
      "شهادة Oral Placement Therapy (OPT) من منظمة ASHA الأمريكية"
    ],
    "educationEn": [
      "B.Sc. in Social Work - Cairo University",
      "Diploma in Speech & Communication Pathology - Ain Shams University",
      "Diploma in Special Education - Zagazig University",
      "Oral Placement Therapy (OPT) Certified - ASHA (USA)"
    ],
    "bio": "مشرفة قسم النطق والتخاطب بمركز رابا. حاصلة على بكالوريوس خدمة اجتماعية من جامعة القاهرة، دبلومة تخاطب من جامعة عين شمس، دبلومة تربية خاصة علوم إعاقة من جامعة الزقازيق، ومتخصصة في العلاج الوظيفي الفموي opt ومشاكل النطق والسمع وحاصلة على شهادة opt من منظمة ASHA الأمريكية بخبرة تتجاوز 10 سنوات.",
    "bioEn": "Supervisor of the Speech & Language Pathology Department at Raba Center. Holds specialized diplomas from Ain Shams and Zagazig Universities, ASHA-certified in Oral Placement Therapy (OPT), with 10+ years treating complex speech, voice, and articulation challenges.",
    "certifications": [
      "شهادة تخصصية في العلاج الفموي الحركي OPT من منظمة ASHA الأمريكية",
      "دبلوم مهني في اضطرابات التواصل والتخاطب - جامعة عين شمس",
      "اعتماد تشخيص وعلاج عيوب النطق والتأتأة والتواصل اللغوي"
    ],
    "certificationsEn": [
      "ASHA Certified Oral Placement Therapy (OPT) Specialist",
      "Professional Speech & Communication Diploma (Ain Shams Univ)",
      "Pediatric Articulation & Stuttering Therapy Accreditation"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday"
    ],
    "rating": 4.88,
    "reviewsCount": 182,
    "sessionPrice": 270,
    "fallbackAvatar": "/specialists/cards/spec_04_manar-wahba.jpg",
    "posterCrop": "/specialists/cards/spec_04_manar-wahba.jpg",
    "portraitCrop": "/specialists/cards/spec_04_manar-wahba.jpg",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790357549806______________jpg_jpeg.jpg",
    "orderIndex": 4,
    "category": "speech",
    "image": "/uploads/1790357549806______________jpg_jpeg.jpg",
    "isTopRated": false
  },
  {
    "id": "spec-ahmed-fathi",
    "name": "أحمد فتحي",
    "nameEn": "Ahmed Fathi",
    "title": "أخصائي ABA",
    "titleEn": "ABA Specialist",
    "role": "أخصائي تحليل السلوك التطبيقي المعتمد ABAT",
    "roleEn": "ABA Specialist & Board Certified ABAT",
    "avatar": "/uploads/1790357579245_______________jpg_jpeg.jpg",
    "experienceYears": 8,
    "licenseNumber": "RABA-ABA-084",
    "specialties": [
      "بكالوريوس تربية خاصة جامعة حلوان",
      "دبلوم مهني اضطرابات تواصل وتخاطب جامعة عين شمس",
      "اعتماد البورد الامريكي في تحليل السلوك التطبيقي ABAT",
      "خبرة أكثر من 8 سنوات في البرامج السلوكية"
    ],
    "specialtiesEn": [
      "B.Sc. in Special Education (Helwan University)",
      "Professional Diploma in Communication & Speech Disorders (Ain Shams University)",
      "Applied Behavior Analysis Technician (ABAT) Board Certified (QABA)",
      "8+ Years Pediatric Behavioral Experience"
    ],
    "education": [
      "بكالوريوس تربية خاصة - جامعة حلوان",
      "دبلوم مهني اضطرابات تواصل وتخاطب - جامعة عين شمس",
      "اعتماد البورد الأمريكي في تحليل السلوك التطبيقي ABAT"
    ],
    "educationEn": [
      "B.Sc. in Special Education - Helwan University",
      "Professional Diploma in Communication Disorders - Ain Shams University",
      "ABAT Board Certified - QABA"
    ],
    "bio": "أخصائي تحليل السلوك التطبيقي (ABA) بمركز رابا. حاصل على بكالوريوس تربية خاصة من جامعة حلوان، ودبلوم مهني في اضطرابات التواصل والتخاطب من جامعة عين شمس، ومعتمد من البورد الأمريكي في تحليل السلوك التطبيقي ABAT بخبرة سريرية وميدانية تزيد عن 8 سنوات.",
    "bioEn": "ABA Specialist at Raba Center. Holds B.Sc. in Special Education from Helwan University, Professional Diploma in Communication Disorders from Ain Shams University, and ABAT certified by the American Board (QABA) with over 8 years experience.",
    "certifications": [
      "اعتماد البورد الأمريكي في تحليل السلوك التطبيقي ABAT",
      "دبلوم مهني في اضطرابات التواصل والتخاطب - جامعة عين شمس",
      "اعتماد تطبيق استراتيجيات التعزيز الإيجابي وتعديل السلوك"
    ],
    "certificationsEn": [
      "Applied Behavior Analysis Technician (ABAT) - QABA Board Certified",
      "Professional Communication Disorders Diploma (Ain Shams)",
      "Positive Reinforcement & Behavior Intervention Accreditation"
    ],
    "availableDays": [
      "السبت",
      "الأحد",
      "الثلاثاء",
      "الأربعاء"
    ],
    "availableDaysEn": [
      "Saturday",
      "Sunday",
      "Tuesday",
      "Wednesday"
    ],
    "rating": 4.85,
    "reviewsCount": 168,
    "sessionPrice": 250,
    "fallbackAvatar": "/specialists/cards/spec_05_ahmed-fathi.jpg",
    "posterCrop": "/specialists/cards/spec_05_ahmed-fathi.jpg",
    "portraitCrop": "/specialists/cards/spec_05_ahmed-fathi.jpg",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790357579245_______________jpg_jpeg.jpg",
    "orderIndex": 5,
    "category": "aba",
    "image": "/uploads/1790357579245_______________jpg_jpeg.jpg",
    "isTopRated": false
  },
  {
    "id": "spec-mohamed-atef",
    "name": "محمد عاطف",
    "nameEn": "Mohamed Atef",
    "title": "أخصائي ABA",
    "titleEn": "ABA Specialist",
    "role": "أخصائي تحليل السلوك التطبيقي ومشرف توحد مؤهل QASP-S",
    "roleEn": "ABA Specialist & Qualified Autism Services Supervisor (QASP-S)",
    "avatar": "/uploads/1790357588113______________jpg_jpeg.jpg",
    "experienceYears": 5,
    "licenseNumber": "RABA-ABA-057",
    "specialties": [
      "بكالوريوس علوم الاعاقة والتأهيل جامعة الزقازيق",
      "دبلوم خاص من جامعة الزقازيق",
      "مشرف توحد مؤهل من منظمة QASP-S",
      "متخصص في الإعاقة العقلية",
      "خبرة أكثر من 5 سنوات في تأهيل التوحد والإعاقات النمائية"
    ],
    "specialtiesEn": [
      "B.Sc. in Disability Sciences & Rehabilitation (Zagazig University)",
      "Special Diploma in Disability Sciences (Zagazig University)",
      "Qualified Autism Services Practitioner Supervisor (QASP-S - QABA)",
      "Specialist in Intellectual & Developmental Disabilities",
      "5+ Years Clinical Experience"
    ],
    "education": [
      "بكالوريوس علوم الإعاقة والتأهيل - جامعة الزقازيق",
      "دبلوم خاص من جامعة الزقازيق في رعاية ذوي الإعاقة",
      "اعتماد مشرف توحد مؤهل من منظمة QASP-S الأمريكية"
    ],
    "educationEn": [
      "B.Sc. in Disability Sciences & Rehabilitation - Zagazig University",
      "Special Advanced Diploma - Zagazig University",
      "QASP-S Certified Autism Practitioner Supervisor - QABA"
    ],
    "bio": "أخصائي تحليل السلوك التطبيقي (ABA) بمركز رابا. حاصل على بكالوريوس علوم الإعاقة والتأهيل من جامعة الزقازيق، ودبلوم خاص من جامعة الزقازيق، ومشرف توحد مؤهل من منظمة QASP-S الأمريكية، ومتخصص في تأهيل الإعاقة العقلية واضطرابات طيف التوحد بخبرة تزيد عن 5 سنوات.",
    "bioEn": "ABA Specialist at Raba Center. Holds B.Sc. and Special Diploma in Disability Sciences & Rehabilitation from Zagazig University, and is a QASP-S certified Autism Practitioner Supervisor by QABA with 5+ years of specialized clinical experience.",
    "certifications": [
      "مشرف توحد مؤهل من منظمة QASP-S الأمريكية التابعة لـ QABA",
      "دبلوم خاص في علوم الإعاقة والتأهيل - جامعة الزقازيق",
      "اعتماد برامج التأهيل النمائي للإعاقات الفكرية والتواصلية"
    ],
    "certificationsEn": [
      "QASP-S Board Certified Autism Practitioner Supervisor",
      "Advanced Diploma in Disability Rehabilitation (Zagazig Univ)",
      "Developmental & Intellectual Disability Intervention Credential"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Wednesday",
      "Thursday"
    ],
    "rating": 4.88,
    "reviewsCount": 154,
    "sessionPrice": 250,
    "fallbackAvatar": "/specialists/cards/spec_06_mohamed-atef.jpg",
    "posterCrop": "/specialists/cards/spec_06_mohamed-atef.jpg",
    "portraitCrop": "/specialists/cards/spec_06_mohamed-atef.jpg",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790357588113______________jpg_jpeg.jpg",
    "orderIndex": 6,
    "category": "aba",
    "image": "/uploads/1790357588113______________jpg_jpeg.jpg",
    "isTopRated": false
  },
  {
    "id": "spec-sadeem-mshari",
    "name": "سديم احمد المشاري",
    "nameEn": "Sadeem Ahmed Al-Mashari",
    "title": "أخصائي ABA",
    "titleEn": "ABA Specialist",
    "role": "أخصائي تحليل السلوك ومصنفة من الهيئة السعودية للتخصصات الصحية",
    "roleEn": "ABA Specialist & SCFHS Licensed Psychologist",
    "avatar": "/uploads/1790357598308______________________jpg_jpeg.jpg",
    "experienceYears": 4,
    "licenseNumber": "RABA-PSY-049",
    "specialties": [
      "بكالوريوس علم النفس من جامعة الاميرة نورة",
      "دبلوم المقاييس النفسية من أكاديمية النخبة الدولية",
      "مصنفة من الهيئة السعودية للتخصصات الصحية",
      "حاصلة على رخصة ABAT من البورد الامريكي"
    ],
    "specialtiesEn": [
      "B.Sc. in Psychology (Princess Nourah Bint Abdulrahman University)",
      "Diploma in Psychological Assessments (Elite International Academy)",
      "Classified & Licensed by the Saudi Commission for Health Specialties (SCFHS)",
      "ABAT Board Certified by the American Board (QABA)"
    ],
    "education": [
      "بكالوريوس علم النفس من جامعة الأميرة نورة بنت عبدالرحمن",
      "دبلوم المقاييس والاختبارات النفسية من أكاديمية النخبة الدولية",
      "تصنيف الهيئة السعودية للتخصصات الصحية (SCFHS)",
      "رخصة فني تحليل سلوك تطبيقي ABAT من البورد الأمريكي QABA"
    ],
    "educationEn": [
      "B.Sc. in Psychology - Princess Nourah Bint Abdulrahman University",
      "Diploma in Psychological Testing - Elite International Academy",
      "Licensed Specialist - Saudi Commission for Health Specialties (SCFHS)",
      "ABAT License - QABA Board Certified"
    ],
    "bio": "أخصائي تحليل السلوك التطبيقي (ABA) بمركز رابا. حاصلة على بكالوريوس علم النفس من جامعة الأميرة نورة، ودبلوم المقاييس النفسية من أكاديمية النخبة الدولية، ومصنفة من الهيئة السعودية للتخصصات الصحية، وحاصلة على رخصة ABAT من البورد الأمريكي. متخصصة في القياس والتقييم السلوكي والتأهيل النفسي للأطفال.",
    "bioEn": "ABA Specialist at Raba Center. Holds B.Sc. in Psychology from Princess Nourah University, Diploma in Psychological Testing from Elite International Academy, licensed by SCFHS, and ABAT certified by the American Board (QABA).",
    "certifications": [
      "ترخيص وتصنيف الهيئة السعودية للتخصصات الصحية (SCFHS)",
      "رخصة فني تحليل سلوك تطبيقي ABAT من البورد الأمريكي QABA",
      "دبلوم تطبيقي في المقاييس النفسية والنمائية للأطفال"
    ],
    "certificationsEn": [
      "Licensed by Saudi Commission for Health Specialties (SCFHS)",
      "Applied Behavior Analysis Technician (ABAT) - QABA Certified",
      "Pediatric Psychological & Developmental Assessment Diploma"
    ],
    "availableDays": [
      "السبت",
      "الأحد",
      "الثلاثاء",
      "الأربعاء"
    ],
    "availableDaysEn": [
      "Saturday",
      "Sunday",
      "Tuesday",
      "Wednesday"
    ],
    "rating": 4.9,
    "reviewsCount": 142,
    "sessionPrice": 260,
    "fallbackAvatar": "/specialists/cards/spec_07_sadeem-mshari.jpg",
    "posterCrop": "/specialists/cards/spec_07_sadeem-mshari.jpg",
    "portraitCrop": "/specialists/cards/spec_07_sadeem-mshari.jpg",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790357598308______________________jpg_jpeg.jpg",
    "orderIndex": 7,
    "category": "aba",
    "image": "/uploads/1790357598308______________________jpg_jpeg.jpg",
    "isTopRated": true
  },
  {
    "id": "spec-maram-mohamed",
    "name": "مرام محمد",
    "nameEn": "Maram Mohamed",
    "title": "أخصائية ABA",
    "titleEn": "ABA Specialist",
    "role": "أخصائية تحليل السلوك التطبيقي وعلم النفس الإكلينيكي",
    "roleEn": "ABA Specialist & Clinical Psychologist",
    "avatar": "/uploads/1790357606704______________jpg_jpeg.jpg",
    "experienceYears": 3,
    "licenseNumber": "RABA-ABA-033",
    "specialties": [
      "بكالوريوس علم النفس الإكلينيكي جامعة الرباط الوطني",
      "اعتماد البورد الأمريكي ABAT",
      "متخصصة في العلاج عن طريق تحليل السلوك التطبيقي (ABA)",
      "خبرة أكثر من 3 سنوات في الجلسات السلوكية"
    ],
    "specialtiesEn": [
      "B.Sc. in Clinical Psychology (National Ribat University)",
      "Applied Behavior Analysis Technician (ABAT) Board Certified",
      "Specialized in Applied Behavior Analysis (ABA) Pediatric Interventions",
      "3+ Years Clinical Practice"
    ],
    "education": [
      "بكالوريوس علم النفس الإكلينيكي من جامعة الرباط الوطني",
      "اعتماد البورد الأمريكي في تحليل السلوك التطبيقي ABAT من منظمة QABA",
      "برامج متقدمة في تعديل السلوك للأطفال ذوي طيف التوحد"
    ],
    "educationEn": [
      "B.Sc. in Clinical Psychology - The National Ribat University",
      "ABAT Certified by the American Board (QABA)",
      "Advanced Clinical Intervention Protocols in Autism & Behavioral Acquisition"
    ],
    "bio": "أخصائية تحليل السلوك التطبيقي (ABA) بمركز رابا. حاصلة على بكالوريوس علم النفس الإكلينيكي من جامعة الرباط الوطني، وحاصلة على اعتماد البورد الأمريكي ABAT من منظمة QABA، متخصصة في العلاج والتأهيل عن طريق تحليل السلوك التطبيقي (ABA) للأطفال بخبرة تتجاوز 3 سنوات.",
    "bioEn": "ABA Specialist at Raba Center. Holds B.Sc. in Clinical Psychology from National Ribat University and is an ABAT certified practitioner by the American Board (QABA), specializing in evidence-based pediatric ABA therapy with 3+ years experience.",
    "certifications": [
      "اعتماد البورد الأمريكي في تحليل السلوك التطبيقي ABAT",
      "شهادة الممارسة الإكلينيكية في علم النفس وتأهيل الأطفال",
      "اعتماد تطبيق جلسات التدريب بالمحاولات المنفصلة DTT"
    ],
    "certificationsEn": [
      "Applied Behavior Analysis Technician (ABAT) - QABA Certified",
      "Clinical Child Psychology & Rehabilitation Practice Certificate",
      "Discrete Trial Training (DTT) & Natural Environment Teaching (NET)"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Wednesday",
      "Thursday"
    ],
    "rating": 4.85,
    "reviewsCount": 130,
    "sessionPrice": 240,
    "fallbackAvatar": "/specialists/cards/spec_08_maram-mohamed.jpg",
    "posterCrop": "/specialists/cards/spec_08_maram-mohamed.jpg",
    "portraitCrop": "/specialists/cards/spec_08_maram-mohamed.jpg",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790357606704______________jpg_jpeg.jpg",
    "orderIndex": 8,
    "category": "aba",
    "image": "/uploads/1790357606704______________jpg_jpeg.jpg",
    "isTopRated": false
  },
  {
    "id": "spec-ahmed-raad",
    "name": "أحمد رعد",
    "nameEn": "Ahmed Raad",
    "title": "أخصائي ABA",
    "titleEn": "ABA Specialist",
    "role": "أخصائي تحليل السلوك التطبيقي ABAT والعلوم الصحية",
    "roleEn": "ABA Specialist & Health Sciences Graduate",
    "avatar": "/uploads/1790357615959______________jpg_jpeg.jpg",
    "experienceYears": 3,
    "licenseNumber": "RABA-ABA-038",
    "specialties": [
      "بكالوريوس علوم صحية من جامعة حمص",
      "شهادة أخصائي تحليل السلوك ABAT من البورد الأمريكي",
      "خبرة أكثر من 3 سنوات في الجلسات الفردية وتعديل السلوك"
    ],
    "specialtiesEn": [
      "B.Sc. in Health Sciences (Homs University)",
      "Applied Behavior Analysis Technician (ABAT) Board Certified",
      "3+ Years Experience in ABA Therapy & Skill Building"
    ],
    "education": [
      "بكالوريوس علوم صحية من جامعة حمص",
      "شهادة أخصائي تحليل السلوك التطبيقي ABAT من البورد الأمريكي QABA",
      "تدريب مكثف على برامج التدخل المبكر وتنمية المهارات التكيفية"
    ],
    "educationEn": [
      "B.Sc. in Health Sciences - Homs University",
      "Applied Behavior Analysis Technician (ABAT) - QABA Board Certified",
      "Intensive Training in Early Intervention & Adaptive Skill Acquisition"
    ],
    "bio": "أخصائي تحليل السلوك التطبيقي (ABA) بمركز رابا. حاصل على بكالوريوس علوم صحية من جامعة حمص، وحاصل على شهادة أخصائي تحليل السلوك ABAT من البورد الأمريكي، بخبرة أكثر من 3 سنوات في تقديم جلسات التدخل السلوكي الفردية للأطفال وتطوير مهارات الاستقلالية والتواصل.",
    "bioEn": "ABA Specialist at Raba Center. Holds B.Sc. in Health Sciences from Homs University and is an ABAT certified practitioner by the American Board (QABA) with 3+ years experience delivering one-on-one behavioral intervention for children.",
    "certifications": [
      "شهادة أخصائي تحليل السلوك التطبيقي ABAT من البورد الأمريكي QABA",
      "اعتماد تطبيق استراتيجيات التعزيز الإيجابي وتطوير المهارات التكيفية",
      "شهادة الإنعاش القلبي الرئوي والسلامة في مراكز التأهيل"
    ],
    "certificationsEn": [
      "Applied Behavior Analysis Technician (ABAT) - QABA Board Certified",
      "Positive Reinforcement & Adaptive Skills Training Credential",
      "Pediatric Healthcare Safety & First Aid Accreditation"
    ],
    "availableDays": [
      "السبت",
      "الإثنين",
      "الثلاثاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Saturday",
      "Monday",
      "Tuesday",
      "Thursday"
    ],
    "rating": 4.82,
    "reviewsCount": 125,
    "sessionPrice": 240,
    "fallbackAvatar": "/specialists/cards/spec_09_ahmed-raad.jpg",
    "posterCrop": "/specialists/cards/spec_09_ahmed-raad.jpg",
    "portraitCrop": "/specialists/cards/spec_09_ahmed-raad.jpg",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790357615959______________jpg_jpeg.jpg",
    "orderIndex": 9,
    "category": "aba",
    "image": "/uploads/1790357615959______________jpg_jpeg.jpg",
    "isTopRated": false
  },
  {
    "id": "spec-mohamed-saad",
    "name": "محمد سعد",
    "nameEn": "Mohamed Saad",
    "title": "أخصائي النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "role": "أخصائي تأهيل النطق والتخاطب وتنمية المهارات اللغوية",
    "roleEn": "Speech & Language Pathologist & Early Intervention Lead",
    "avatar": "/uploads/1790826142955_1_png.png",
    "experienceYears": 8,
    "licenseNumber": "RABA-SLP-052",
    "specialties": [
      "حاصل على ليسانس الآداب وتربية لغة عربية من جامعة طنطا",
      "حاصل على دبلومة التخاطب واضطرابات النطق والكلام من كلية علوم ذوي الاحتياجات الخاصة جامعة بني سويف",
      "حاصل على تمهيدي ماجستير في علوم التخاطب واضطرابات النطق والكلام",
      "خبرة عملية أكثر من ٨ سنوات في تقييم وتشخيص اضطرابات النطق والكلام"
    ],
    "specialtiesEn": [
      "B.A. in Arts & Education (Arabic Language) - Tanta University",
      "Diploma in Speech & Language Pathology - Beni-Suef University",
      "Pre-Master Studies in Speech & Communication Sciences",
      "8+ Years Clinical Experience in Speech Sound & Language Assessment"
    ],
    "education": [
      "دبلومة التخاطب واضطرابات النطق والكلام - كلية علوم ذوي الاحتياجات الخاصة جامعة بني سويف",
      "تمهيدي ماجستير في علوم التخاطب واضطرابات التواصل",
      "ليسانس الآداب والتربية - جامعة طنطا",
      "دورات متقدمة في التأهيل اللغوي للتدخل المبكر واضطراب طيف التوحد"
    ],
    "educationEn": [
      "Diploma in Speech & Language Pathology - Faculty of Special Needs Sciences, Beni-Suef University",
      "Pre-Master in Speech & Communication Sciences",
      "B.A. in Arts & Education - Tanta University",
      "Advanced Clinical Certifications in Pediatric Language Development"
    ],
    "bio": "أخصائي النطق والتخاطب بمركز رابا. حاصل على ليسانس وماجستير في علوم التخاطب واضطرابات التواصل، بخبرة عملية تزيد عن 8 سنوات في تقييم وتشخيص اضطرابات النطق وتأخر نمو اللغة والتدخل المبكر لأطفال طيف التوحد ومتلازمة داون.",
    "bioEn": "Speech & Language Pathologist at Raba Center. Holds clinical degrees in Speech Pathology and Communication Sciences with 8+ years experience diagnosing and treating pediatric speech delays, articulation disorders, and autism communication.",
    "certifications": [
      "شهادة التخصص الإكلينيكي في اضطرابات النطق والكلام - جامعة بني سويف",
      "دبلوم مهني في التدخل المبكر لتأخر نمو اللغة",
      "اعتماد تأهيل اضطرابات الصوت والتأتأة لدى الأطفال"
    ],
    "certificationsEn": [
      "Clinical Speech & Language Disorders Credential - Beni-Suef University",
      "Early Intervention & Language Development Professional Diploma",
      "Pediatric Stuttering & Articulation Therapy Certification"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "rating": 4.93,
    "reviewsCount": 195,
    "sessionPrice": 240,
    "fallbackAvatar": "/specialists/cards/spec_11_mohamed-saad.png",
    "posterCrop": "/specialists/cards/spec_11_mohamed-saad.png",
    "portraitCrop": "/specialists/cards/spec_11_mohamed-saad.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790826142955_1_png.png",
    "orderIndex": 11,
    "category": "speech",
    "image": "/uploads/1790826142955_1_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-alzahraa-farag",
    "name": "الزهراء فرج",
    "nameEn": "Al-Zahraa Farag",
    "title": "أخصائية نفسية إكلينيكية",
    "titleEn": "Clinical Psychologist",
    "role": "أخصائية علم النفس الإكلينيكي وتعديل السلوك",
    "roleEn": "Clinical Child Psychologist & Behavioral Assessment Specialist",
    "avatar": "/uploads/1790826125079_2_png.png",
    "experienceYears": 7,
    "licenseNumber": "RABA-PSY-058",
    "specialties": [
      "حاصلة على ليسانس الآداب قسم علم النفس من جامعة عين شمس",
      "حاصلة على دبلومة علم النفس الإكلينيكي من كلية الآداب جامعة عين شمس",
      "حاصلة على دبلومة التربية الخاصة من كلية التربية جامعة عين شمس",
      "خبرة أكثر من ٧ سنوات في التقييم النفسي والتشخيص الإكلينيكي"
    ],
    "specialtiesEn": [
      "B.A. in Psychology - Ain Shams University",
      "Diploma in Clinical Psychology - Ain Shams University",
      "Diploma in Special Education - Ain Shams University",
      "7+ Years Experience in Psychological Diagnostics & Assessment"
    ],
    "education": [
      "دبلومة علم النفس الإكلينيكي - كلية الآداب جامعة عين شمس",
      "دبلومة التربية الخاصة - كلية التربية جامعة عين شمس",
      "ليسانس الآداب قسم علم النفس - جامعة عين شمس",
      "اعتماد تطبيق مقاييس الذكاء العالمية واختبارات السلوك التكيفي"
    ],
    "educationEn": [
      "Diploma in Clinical Psychology - Faculty of Arts, Ain Shams University",
      "Diploma in Special Education - Faculty of Education, Ain Shams University",
      "B.A. in Psychology - Ain Shams University",
      "Certified Assessor for WISC, Stanford-Binet & Adaptive Behavior Scales"
    ],
    "bio": "أخصائية نفسية إكلينيكية بمركز رابا. حاصلة على ماجستير علم النفس الإكلينيكي ودبلوم العلاج المعرفي السلوكي، بخبرة تتجاوز 7 سنوات في تقييم وتشخيص الاضطرابات النمائية والنفسية وتطبيق مقاييس الذكاء واختبارات الشخصية والسلوك التكيفي.",
    "bioEn": "Clinical Psychologist at Raba Center. Holds specialized postgraduate diplomas in Clinical Psychology and Special Education from Ain Shams University, with 7+ years evaluating pediatric developmental and cognitive profiles.",
    "certifications": [
      "دبلومة إكلينيكية معتمدة في القياس النفسي والتشخيص - عين شمس",
      "شهادة تطبيق مقياس ستانفورد بينيه ومقياس وكسلر لذكاء الأطفال",
      "اعتماد الإرشاد النفسي والأسري لأسر ذوي الإعاقة"
    ],
    "certificationsEn": [
      "Clinical Psychological Assessment Credential - Ain Shams University",
      "Certified Administrator for Stanford-Binet & Wechsler Intelligence Scales",
      "Family Counseling & Psychological Guidance for Special Needs Accreditation"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday"
    ],
    "rating": 4.91,
    "reviewsCount": 182,
    "sessionPrice": 260,
    "fallbackAvatar": "/specialists/cards/spec_12_alzahraa-farag.png",
    "posterCrop": "/specialists/cards/spec_12_alzahraa-farag.png",
    "portraitCrop": "/specialists/cards/spec_12_alzahraa-farag.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790826125079_2_png.png",
    "orderIndex": 12,
    "category": "psychology",
    "image": "/uploads/1790826125079_2_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-noura-elbasyouni",
    "name": "د/ نورا البسيوني",
    "nameEn": "Dr. Noura El-Basyouni",
    "title": "أخصائية نفسية",
    "titleEn": "Ph.D. Pediatric Psychologist",
    "role": "دكتوراه في علم النفس وأخصائية نفسية أطفال التوحد",
    "roleEn": "Ph.D. in Clinical Child Psychology & Autism Specialist",
    "avatar": "/uploads/1790826321411_3_png.png",
    "experienceYears": 10,
    "licenseNumber": "RABA-SCFHS-061",
    "specialties": [
      "حاصلة على ليسانس الآداب قسم علم النفس من جامعة عين شمس",
      "حاصلة على ماجستير في علم النفس تخصص أطفال التوحد",
      "حاصلة على دكتوراه في علم النفس تخصص أطفال التوحد",
      "مصنفة مهنياً من الهيئة السعودية للتخصصات الصحية",
      "خبرة أكثر من ١٠ سنوات في القياس والتشخيص النفسي"
    ],
    "specialtiesEn": [
      "B.A. in Psychology - Ain Shams University",
      "Master of Science in Child Psychology (Autism Spectrum Disorders)",
      "Ph.D. in Child Psychology (Autism Spectrum Disorders)",
      "SCFHS Professional Healthcare Classification",
      "10+ Years Advanced Diagnostic & Intervention Experience"
    ],
    "education": [
      "دكتوراه الفلسفة في علم النفس (تخصص أطفال التوحد)",
      "ماجستير علم النفس (تخصص أطفال التوحد)",
      "ليسانس الآداب قسم علم النفس - جامعة عين شمس",
      "تصنيف مهني معتمد من الهيئة السعودية للتخصصات الصحية (SCFHS)"
    ],
    "educationEn": [
      "Doctor of Philosophy (Ph.D.) in Psychology - Autism Spectrum Focus",
      "Master of Science (M.Sc.) in Psychology - Pediatric Autism Focus",
      "B.A. in Psychology - Ain Shams University",
      "SCFHS Accredited Professional Healthcare Classification"
    ],
    "bio": "دكتوراه في علم النفس وأخصائية نفسية بمركز رابا. حاصلة على درجتي الماجستير والدكتوراه في علم النفس تخصص أطفال التوحد، ومصنفة مهنياً من الهيئة السعودية للتخصصات الصحية بخبرة تزيد عن 10 سنوات في التقييم النفسي والبرامج النمائية لأطفال التوحد.",
    "bioEn": "Ph.D. Psychologist at Raba Center. Holds Doctorate & Master degrees in Psychology specializing in Autism, and active SCFHS classification with over 10 years of clinical experience in diagnostic and developmental psycho-education.",
    "certifications": [
      "تصنيف مهني معتمد من الهيئة السعودية للتخصصات الصحية",
      "دكتوراه الفلسفة في علم النفس (تخصص التوحد)",
      "شهادات متقدمة في الاختبارات الإكلينيكية ومقاييس التوحد العالمية"
    ],
    "certificationsEn": [
      "SCFHS Professional Healthcare Classification",
      "Doctor of Philosophy (Ph.D.) in Autism Psychology",
      "Advanced Certifications in Clinical Autism Assessment Scales"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "rating": 4.95,
    "reviewsCount": 215,
    "sessionPrice": 290,
    "fallbackAvatar": "/specialists/cards/spec_13_noura-elbasyouni.png",
    "posterCrop": "/specialists/cards/spec_13_noura-elbasyouni.png",
    "portraitCrop": "/specialists/cards/spec_13_noura-elbasyouni.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790826321411_3_png.png",
    "orderIndex": 13,
    "category": "psychology",
    "image": "/uploads/1790826321411_3_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-asmaa-moustafa",
    "name": "أسماء مصطفى",
    "nameEn": "Asmaa Moustafa",
    "title": "مشرفة قسم الـ ABA",
    "titleEn": "ABA Department Supervisor",
    "role": "مشرفة قسم تحليل السلوك ومحلل سلوك دولي معتمد QBA-IBA",
    "roleEn": "ABA Supervisor & International Behavior Analyst (QBA / IBA)",
    "avatar": "/uploads/1790826279297_4_png.png",
    "experienceYears": 10,
    "licenseNumber": "RABA-QBA-091",
    "specialties": [
      "حاصلة على ليسانس الآداب في علم الإجتماع من جامعة سوهاج",
      "حاصلة على ماجستير في التربية الخاصة تخصص التوحد من جامعة أسيوط",
      "باحثة دكتوراة في التربية الخاصة تخصص توحد",
      "محلل سلوك دولي معتمد QBA-IBA",
      "ممارس إدارة السلوك التنظيمي OBM-p",
      "خبرة عملية أكثر من ١٠ سنوات"
    ],
    "specialtiesEn": [
      "B.A. in Sociology - Sohag University",
      "Master in Special Education (Autism) - Assiut University",
      "Ph.D. Researcher in Special Education (Autism)",
      "QBA & IBA Board Certified Behavior Analyst",
      "Organizational Behavior Management Practitioner (OBM-p)",
      "10+ Years Clinical ABA Experience"
    ],
    "education": [
      "باحثة دكتوراه في التربية الخاصة تخصص التوحد",
      "ماجستير التربية الخاصة تخصص التوحد - جامعة أسيوط",
      "ليسانس الآداب في علم الاجتماع - جامعة سوهاج",
      "محلل سلوك دولي معتمد من بورد QBA ومنظمة IBA",
      "ممارس إدارة السلوك التنظيمي المعتمد OBM-p"
    ],
    "educationEn": [
      "Ph.D. Researcher in Special Education & Autism Spectrum",
      "Master of Special Education in Autism - Assiut University",
      "B.A. in Sociology - Sohag University",
      "Qualified Behavior Analyst (QBA) & International Behavior Analyst (IBA)",
      "Certified Organizational Behavior Management Practitioner (OBM-p)"
    ],
    "bio": "مشرفة قسم ABA بمركز رابا ومحلل سلوك دولي معتمد (QBA-IBA). باحثة دكتوراه وحاصلة على ماجستير التربية الخاصة تخصص التوحد، وممارس إدارة السلوك التنظيمي OBM-p بخبرة تزيد عن 10 سنوات في قيادة الخطط السلوكية المكثفة وتأهيل الكوادر.",
    "bioEn": "ABA Department Supervisor at Raba Center. QBA and IBA Board Certified Behavior Analyst, Ph.D. Researcher in Autism, and certified OBM-p practitioner with 10+ years leading intensive behavior interventions and clinical teams.",
    "certifications": [
      "اعتماد محلل سلوك مؤهل QBA من البورد الأمريكي",
      "اعتماد محلل سلوك دولي IBA من البورد الدولي",
      "اعتماد ممارس إدارة السلوك التنظيمي OBM-p"
    ],
    "certificationsEn": [
      "Qualified Behavior Analyst (QBA) International Credential",
      "International Behavior Analyst (IBA) Certification",
      "Certified Organizational Behavior Management Practitioner (OBM-p)"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "rating": 4.96,
    "reviewsCount": 230,
    "sessionPrice": 280,
    "fallbackAvatar": "/specialists/cards/spec_14_asmaa-moustafa.png",
    "posterCrop": "/specialists/cards/spec_14_asmaa-moustafa.png",
    "portraitCrop": "/specialists/cards/spec_14_asmaa-moustafa.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790826279297_4_png.png",
    "orderIndex": 14,
    "category": "aba",
    "image": "/uploads/1790826279297_4_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-ayman-elhoweity",
    "name": "أيمن عطية الحويطي",
    "nameEn": "Ayman Attia Al-Howeity",
    "title": "أخصائي ABA",
    "titleEn": "Behavior Analyst (BACB / TOT)",
    "role": "أخصائي تحليل السلوك ومدرب مدربين معتمد TOT",
    "roleEn": "ABA Specialist, BACB Licensed & Certified TOT",
    "avatar": "/uploads/1790826241596_5_png.png",
    "experienceYears": 10,
    "licenseNumber": "RABA-BACB-102",
    "specialties": [
      "حاصل على بكالوريوس التربية الخاصة من جامعة حلوان",
      "حاصل على دراسات عليا في التربية الخاصة من جامعة حلوان",
      "حاصل على رخصة البورد الأمريكي من بورد BACB",
      "ممارس توحد مرخص من هيئة قياس",
      "مدرب مدربين معتمد TOT",
      "خبرة عملية أكثر من ١٠ سنوات"
    ],
    "specialtiesEn": [
      "B.Sc. in Special Education - Helwan University",
      "Postgraduate Studies in Special Education - Helwan University",
      "Licensed by the American Behavior Analyst Certification Board (BACB)",
      "Licensed Autism Practitioner by Qiyas National Center",
      "Certified Trainer of Trainers (TOT)",
      "10+ Years Clinical ABA Experience"
    ],
    "education": [
      "دراسات عليا في التربية الخاصة - جامعة حلوان",
      "بكالوريوس التربية الخاصة - جامعة حلوان",
      "رخصة البورد الأمريكي لتحليل السلوك (BACB)",
      "ترخيص ممارس توحد من المركز الوطني قياس",
      "شهادة تدريب المدربين المعتمدة (TOT)"
    ],
    "educationEn": [
      "Postgraduate Diploma in Special Education - Helwan University",
      "B.Sc. in Special Education - Helwan University",
      "Behavior Analyst Certification Board (BACB) Licensure",
      "Certified Autism Specialist - National Center for Assessment (Qiyas)",
      "Certified Training of Trainers (TOT) Professional"
    ],
    "bio": "أخصائي تحليل السلوك التطبيقي ABA بمركز رابا. حاصل على دراسات عليا في التربية الخاصة من جامعة حلوان، ورخصة بورد BACB الأمريكي، وترخيص ممارس توحد من قياس ومدرب مدربين TOT بخبرة تتجاوز 10 سنوات في تأهيل ذوي اضطراب طيف التوحد.",
    "bioEn": "Applied Behavior Analyst at Raba Center. Holds Postgraduate credentials in Special Education from Helwan University, BACB American Board licensure, Qiyas Autism Practitioner license, and certified TOT trainer with 10+ years experience.",
    "certifications": [
      "رخصة البورد الأمريكي لتحليل السلوك BACB",
      "ترخيص ممارس توحد معتمد من هيئة تقويم التعليم والتدريب (قياس)",
      "شهادة مدرب مدربين دولي معتمد TOT"
    ],
    "certificationsEn": [
      "BACB American Board Licensure in Behavior Analysis",
      "Licensed Autism Practitioner by Saudi Qiyas Authority",
      "Certified International Training of Trainers (TOT)"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday"
    ],
    "rating": 4.88,
    "reviewsCount": 170,
    "sessionPrice": 260,
    "fallbackAvatar": "/specialists/cards/spec_15_ayman-elhoweity.png",
    "posterCrop": "/specialists/cards/spec_15_ayman-elhoweity.png",
    "portraitCrop": "/specialists/cards/spec_15_ayman-elhoweity.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790826241596_5_png.png",
    "orderIndex": 15,
    "category": "aba",
    "image": "/uploads/1790826241596_5_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-mohamed-bakry",
    "name": "محمد بكري",
    "nameEn": "Mohamed Bakry",
    "title": "أخصائي العلاج الوظيفي والتكامل الحسي",
    "titleEn": "Occupational & Sensory Therapist",
    "role": "أخصائي العلاج الوظيفي والتكامل الحسي وماجستير علوم الصحة الرياضية",
    "roleEn": "Occupational Therapist & Sensory Integration Practitioner",
    "avatar": "/uploads/1790826439548_6_png.png",
    "experienceYears": 6,
    "licenseNumber": "RABA-OT-065",
    "specialties": [
      "حاصل على بكالوريوس وماجستير علوم الصحة الرياضية وتأهيل الإصابات",
      "حاصل على دبلومة العلاج الوظيفي من مركز الخدمة العامة جامعة طنطا",
      "حاصل على تدريب معتمد في التكامل الحسي من مركز رابـا",
      "خبرة أكثر من ٦ سنوات في العلاج الوظيفي والتكامل الحسي"
    ],
    "specialtiesEn": [
      "B.Sc. & M.Sc. in Sports Health Sciences & Rehabilitation",
      "Diploma in Occupational Therapy - Tanta University Public Service Center",
      "Accredited Clinical Training in Sensory Integration from Raba Center",
      "6+ Years Pediatric Occupational Therapy Experience"
    ],
    "education": [
      "دبلومة العلاج الوظيفي - جامعة طنطا",
      "ماجستير علوم الصحة الرياضية والتأهيل الحركي",
      "بكالوريوس علوم الصحة الرياضية",
      "شهادة تدريب تخصصي متقدم في التكامل الحسي للأطفال"
    ],
    "educationEn": [
      "Diploma in Occupational Therapy - Tanta University",
      "M.Sc. in Sports Health Sciences & Motor Rehabilitation",
      "B.Sc. in Sports Health Sciences",
      "Advanced Clinical Training in Pediatric Sensory Integration"
    ],
    "bio": "أخصائي العلاج الوظيفي والتكامل الحسي بمركز رابا. حاصل على ماجستير علوم الصحة الرياضية ودبلومة العلاج الوظيفي وتدريب معتمد في التكامل الحسي بخبرة تفوق 6 سنوات في تنمية المهارات الحركية الدقيقة والتكامل الحسي والبدني للأطفال.",
    "bioEn": "Occupational Therapy & Sensory Integration Specialist at Raba Center. Holds Master degree in Sports Health Sciences and clinical OT diploma from Tanta University with 6+ years improving fine motor skills, sensory processing, and physical coordination.",
    "certifications": [
      "دبلومة العلاج الوظيفي السريري - جامعة طنطا",
      "شهادة تدريب معتمد في التكامل الحسي السريري للأطفال",
      "عضوية الجمعيات المهنية للتأهيل الحركي والوظيفي"
    ],
    "certificationsEn": [
      "Clinical Occupational Therapy Diploma - Tanta University",
      "Pediatric Clinical Sensory Integration Certification",
      "Professional Member of Motor & Functional Rehabilitation Associations"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "rating": 4.87,
    "reviewsCount": 145,
    "sessionPrice": 240,
    "fallbackAvatar": "/specialists/cards/spec_16_mohamed-bakry.png",
    "posterCrop": "/specialists/cards/spec_16_mohamed-bakry.png",
    "portraitCrop": "/specialists/cards/spec_16_mohamed-bakry.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790826439548_6_png.png",
    "orderIndex": 16,
    "category": "occupational",
    "image": "/uploads/1790826439548_6_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-anwar-elmaghyouli",
    "name": "أنوار المغيولي",
    "nameEn": "Anwar Al-Maghyouli",
    "title": "أخصائية النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "role": "أخصائية علاج اضطرابات النطق والتخاطب واللغة",
    "roleEn": "Speech-Language Pathologist & Communication Specialist",
    "avatar": "/uploads/1790826509139_7_png.png",
    "experienceYears": 5,
    "licenseNumber": "RABA-SLP-068",
    "specialties": [
      "حاصلة على بكالوريوس علم النفس من جامعة الملك عبدالعزيز",
      "حاصلة على دورة علاج التلعثم التخصصية",
      "حاصلة على دورة مهارات الحوار والتواصل التفاعلي",
      "خبرة أكثر من ٥ سنوات في تقييم وعلاج اضطرابات النطق واللغة"
    ],
    "specialtiesEn": [
      "B.A. in Psychology - King Abdulaziz University",
      "Specialized Clinical Training in Stuttering Therapy",
      "Certification in Interactive Dialogue & Communication Skills",
      "5+ Years Clinical Practice in Pediatric Speech-Language Pathology"
    ],
    "education": [
      "بكالوريوس علم النفس - جامعة الملك عبدالعزيز",
      "شهادة تخصصية متقدمة في علاج التلعثم واضطرابات طلاقة الكلام",
      "دورة تأهيل مهارات الحوار والتواصل للأطفال ذوي التحديات النمائية"
    ],
    "educationEn": [
      "B.A. in Psychology - King Abdulaziz University",
      "Advanced Clinical Certificate in Stuttering & Fluency Disorders",
      "Pediatric Interactive Dialogue & Pragmatic Language Development"
    ],
    "bio": "أخصائية النطق والتخاطب بمركز رابا. حاصلة على بكالوريوس علم النفس من جامعة الملك عبدالعزيز، بخبرة عملية تفوق 5 سنوات في تقييم وعلاج التلعثم واضطرابات مخارج الحروف وتأخر الكلام وتطوير مهارات الحوار والتواصل لدى الأطفال.",
    "bioEn": "Speech-Language Pathologist at Raba Center. Holds Psychology degree from King Abdulaziz University with 5+ years specializing in stuttering, articulation phonology, language acquisition, and interactive pragmatic dialog for children.",
    "certifications": [
      "شهادة تدريب متقدم في علاج اضطرابات النطق والتلعثم",
      "دورة تخصصية في تنمية المهارات اللغوية والتواصلية التفاعلية",
      "ترخيص مهني في علاج اضطرابات التخاطب"
    ],
    "certificationsEn": [
      "Advanced Speech Sound & Stuttering Therapy Credential",
      "Interactive Pragmatic Communication Skills Certification",
      "Licensed Speech & Language Rehabilitation Practitioner"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday"
    ],
    "rating": 4.89,
    "reviewsCount": 138,
    "sessionPrice": 230,
    "fallbackAvatar": "/specialists/cards/spec_17_anwar-elmaghyouli.png",
    "posterCrop": "/specialists/cards/spec_17_anwar-elmaghyouli.png",
    "portraitCrop": "/specialists/cards/spec_17_anwar-elmaghyouli.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790826509139_7_png.png",
    "orderIndex": 17,
    "category": "speech",
    "image": "/uploads/1790826509139_7_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-mohamed-abdelhamid",
    "name": "محمد عبد الحميد",
    "nameEn": "Mohamed Abdelhamid",
    "title": "أخصائي النطق والتخاطب",
    "titleEn": "Speech Pathologist & OPT Specialist",
    "role": "أخصائي علاج النطق والتخاطب ومتخصص OPT",
    "roleEn": "Speech Pathologist & Oral Placement Therapy (OPT) Specialist",
    "avatar": "/uploads/1790826577879_9_png.png",
    "experienceYears": 6,
    "licenseNumber": "RABA-SLP-070",
    "specialties": [
      "حاصل على بكالوريوس التربية الخاصة قسم اضطرابات التخاطب من جامعة المنصورة",
      "حاصل على كورس معتمد في تقنية OPT لتأهيل عضلات النطق",
      "خبرة أكثر من ٦ سنوات في تأهيل عيوب النطق والكلام ومخارج الحروف"
    ],
    "specialtiesEn": [
      "B.Sc. in Special Education (Speech Disorders) - Mansoura University",
      "Certified Clinical Course in Oral Placement Therapy (OPT)",
      "6+ Years Experience in Pediatric Articulation & Oral Motor Therapy"
    ],
    "education": [
      "بكالوريوس التربية الخاصة قسم اضطرابات التخاطب - جامعة المنصورة",
      "كورس معتمد في العلاج الوظيفي الفموي وتقنية OPT",
      "دورات متقدمة في علاج اللدغات وتأخر الكلام لدى أطفال التوحد"
    ],
    "educationEn": [
      "B.Sc. in Special Education (Speech Pathology) - Mansoura University",
      "Certified Oral Placement Therapy (OPT) Clinical Course",
      "Advanced Seminars in Pediatric Articulation Remediation"
    ],
    "bio": "أخصائي النطق والتخاطب بمركز رابا. حاصل على بكالوريوس التربية الخاصة من جامعة المنصورة، وكورس معتمد في تقنية OPT لتأهيل عضلات النطق، بخبرة عملية تزيد عن 6 سنوات في علاج صعوبات النطق واللغة والتواصل لدى الأطفال ذوي التحديات النمائية.",
    "bioEn": "Speech Pathologist & OPT Specialist at Raba Center. Holds degree in Speech Disorders from Mansoura University and certified in OPT oral motor therapy with 6+ years remediating pediatric speech delays, lisping, and communication difficulties.",
    "certifications": [
      "شهادة تدريب تخصصية في علاج اضطرابات عضلات الفم والنطق OPT",
      "دورة متقدمة في تأهيل اللدغات والعيوب الصوتية",
      "عضوية الجمعيات الأكاديمية للتخاطب والتربية الخاصة"
    ],
    "certificationsEn": [
      "Oral Placement Therapy (OPT) Level Clinical Credential",
      "Advanced Articulation & Phonological Therapy",
      "Academic Member of Special Education Associations"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "rating": 4.86,
    "reviewsCount": 152,
    "sessionPrice": 240,
    "fallbackAvatar": "/specialists/cards/spec_18_mohamed-abdelhamid.png",
    "posterCrop": "/specialists/cards/spec_18_mohamed-abdelhamid.png",
    "portraitCrop": "/specialists/cards/spec_18_mohamed-abdelhamid.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790826577879_9_png.png",
    "orderIndex": 18,
    "category": "speech",
    "image": "/uploads/1790826577879_9_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-mohamed-elgayyar",
    "name": "محمد الجيار",
    "nameEn": "Mohamed Al-Gayyar",
    "title": "أخصائي العلاج الوظيفي والتكامل الحسي",
    "titleEn": "Occupational Therapy & Sensory Integration Specialist",
    "role": "أخصائي العلاج الوظيفي والتكامل الحسي وتعديل السلوك ABAT",
    "roleEn": "Occupational Therapist & Certified Behavior Technician (ABAT)",
    "avatar": "/uploads/1790826687565_10_png.png",
    "experienceYears": 7,
    "licenseNumber": "RABA-OT-071",
    "specialties": [
      "حاصل كلية ليسانس الآداب من جامعة بورسعيد",
      "حاصل على دبلومة مهنية لإضطرابات التواصل من كلية التربية جامعة عين شمس",
      "حاصل علي دبلومة عامة قسم التوحد من كلية علوم إعاقة من جامعة الزقازيق",
      "حاصل على دورة تحليل السلوك التطبيقي ABAT",
      "حاصل على دورة في التكامل الحسي من د/دعاء عبد اللطيف",
      "خبرة عملية أكثر من ٧ سنوات"
    ],
    "specialtiesEn": [
      "B.A. from Port Said University",
      "Professional Diploma in Communication Disorders - Ain Shams University",
      "General Diploma in Autism - Disability Sciences, Zagazig University",
      "Certified Applied Behavior Analysis Course (ABAT)",
      "Certified Sensory Integration Course with Dr. Doaa Abdel-Latif",
      "7+ Years Multidisciplinary Rehabilitation Experience"
    ],
    "education": [
      "دبلومة مهنية لاضطرابات التواصل - كلية التربية جامعة عين شمس",
      "دبلومة عامة قسم التوحد - كلية علوم الإعاقة جامعة الزقازيق",
      "ليسانس الآداب - جامعة بورسعيد",
      "اعتماد دورة تحليل السلوك التطبيقي (ABAT)",
      "شهادة تدريب متقدم في التكامل الحسي"
    ],
    "educationEn": [
      "Professional Diploma in Communication Disorders - Ain Shams University",
      "General Diploma in Autism Spectrum - Zagazig University",
      "B.A. - Port Said University",
      "Applied Behavior Analysis Technician (ABAT) Credential",
      "Advanced Sensory Integration Pediatric Credential"
    ],
    "bio": "أخصائي العلاج الوظيفي والتكامل الحسي بمركز رابا. يجمع بين دبلومات اضطرابات التواصل من عين شمس والتوحد من الزقازيق وتدريب ABAT والتكامل الحسي بخبرة تزيد عن 7 سنوات في تحسين التآزر البصري الحركي والتكامل الحسي للأطفال.",
    "bioEn": "Occupational Therapy & Sensory Integration Specialist at Raba Center. Holds diplomas in Communication Disorders (Ain Shams) and Autism (Zagazig), ABAT credential, and SI training with 7+ years in sensorimotor integration for children.",
    "certifications": [
      "دبلومة مهنية في اضطرابات التواصل - عين شمس",
      "دبلومة دراسات التوحد - جامعة الزقازيق",
      "شهادة اعتماد فني تحليل السلوك التطبيقي ABAT",
      "شهادة التكامل الحسي السريري المعتمدة"
    ],
    "certificationsEn": [
      "Professional Diploma in Communication Disorders - Ain Shams",
      "Diploma in Autism Sciences - Zagazig University",
      "Applied Behavior Analysis Technician (ABAT) Credential",
      "Certified Clinical Sensory Integration Specialist"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday"
    ],
    "rating": 4.88,
    "reviewsCount": 160,
    "sessionPrice": 250,
    "fallbackAvatar": "/specialists/cards/spec_19_mohamed-elgayyar.png",
    "posterCrop": "/specialists/cards/spec_19_mohamed-elgayyar.png",
    "portraitCrop": "/specialists/cards/spec_19_mohamed-elgayyar.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790826687565_10_png.png",
    "orderIndex": 19,
    "category": "occupational",
    "image": "/uploads/1790826687565_10_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-elsaeed-diab",
    "name": "السعيد دياب",
    "nameEn": "El-Saeed Diab",
    "title": "أخصائي صعوبات تعلم",
    "titleEn": "Learning Disabilities Specialist",
    "role": "أخصائي صعوبات التعلم والتقييم والتشخيص النفسي والتربوي",
    "roleEn": "Learning Disabilities Specialist & Psycho-Educational Evaluator",
    "avatar": "/uploads/1790826711609_11_png.png",
    "experienceYears": 7,
    "licenseNumber": "RABA-LD-074",
    "specialties": [
      "حاصل على ليسانس الآداب والتربية من جامعه الأزهر",
      "حاصل على دبلومة الإختبارات والمقاييس النفسية من جامعة الزقازيق",
      "حاصل على دبلومة التخاطب من جامعة عين شمس",
      "حاصل على دبلومة التوحد من جامعة الزقازيق",
      "حاصل على دبلومة إعداد أخصائي تربية خاصة من جامعة عين شمس",
      "حاصل على دبلومة التربية الخاصة من جامعة عين شمس",
      "خبرة عملية أكثر من ٧ سنوات"
    ],
    "specialtiesEn": [
      "B.A. in Arts & Education - Al-Azhar University",
      "Diploma in Psychological Testing & Measurement - Zagazig University",
      "Diploma in Speech Pathology - Ain Shams University",
      "Diploma in Autism Spectrum Disorders - Zagazig University",
      "Diploma in Special Education Specialist Preparation - Ain Shams University",
      "Diploma in Special Education - Ain Shams University",
      "7+ Years Clinical Psycho-Educational Experience"
    ],
    "education": [
      "دبلومة الاختبارات والمقاييس النفسية - جامعة الزقازيق",
      "دبلومة التخاطب واضطرابات الكلام - جامعة عين شمس",
      "دبلومة التوحد والاضطرابات النمائية - جامعة الزقازيق",
      "دبلومة إعداد أخصائي التربية الخاصة - جامعة عين شمس",
      "دبلومة التربية الخاصة - جامعة عين شمس",
      "ليسانس الآداب والتربية - جامعة الأزهر"
    ],
    "educationEn": [
      "Diploma in Psychological Testing & Measurement - Zagazig University",
      "Diploma in Speech Pathology - Ain Shams University",
      "Diploma in Autism Spectrum Disorders - Zagazig University",
      "Special Education Specialist Preparation Diploma - Ain Shams University",
      "Diploma in Special Education - Ain Shams University",
      "B.A. in Arts and Education - Al-Azhar University"
    ],
    "bio": "أخصائي صعوبات التعلم بمركز رابا. حاصل على دبلومات متعددة في المقاييس النفسية والتخاطب والتوحد والتربية الخاصة من جامعتي عين شمس والزقازيق بخبرة تفوق 7 سنوات في التشخيص التربوي الدقيق وعلاج صعوبات القراءة والكتابة والحساب وتهيئة الأطفال للدمج.",
    "bioEn": "Learning Disabilities Specialist at Raba Center. Holds specialized diplomas in Psychological Testing, Speech, Autism, and Special Education from Ain Shams & Zagazig universities with 7+ years diagnosing and remediating academic challenges.",
    "certifications": [
      "دبلوم المقاييس والاختبارات النفسية والتربوية - جامعة الزقازيق",
      "دبلوم التخاطب واضطرابات النطق - جامعة عين شمس",
      "دبلوم علوم التوحد والتربية الخاصة - جامعة الزقازيق وعين شمس",
      "اعتماد تطبيق بطاريات تشخيص صعوبات التعلم الأكاديمية والنمائية"
    ],
    "certificationsEn": [
      "Diploma in Psycho-Educational Diagnostics - Zagazig University",
      "Diploma in Speech Disorders - Ain Shams University",
      "Diplomas in Autism & Special Education - Ain Shams & Zagazig",
      "Certified Assessor for Academic & Developmental Learning Disabilities Batteries"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "rating": 4.89,
    "reviewsCount": 164,
    "sessionPrice": 250,
    "fallbackAvatar": "/specialists/cards/spec_20_elsaeed-diab.png",
    "posterCrop": "/specialists/cards/spec_20_elsaeed-diab.png",
    "portraitCrop": "/specialists/cards/spec_20_elsaeed-diab.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790826711609_11_png.png",
    "orderIndex": 20,
    "category": "psychology",
    "image": "/uploads/1790826711609_11_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-yara-abouhamda",
    "name": "يارا أبو حمده",
    "nameEn": "Yara Abou Hamda",
    "role": "أخصائية العلاج الوظيفي",
    "roleEn": "Occupational Therapist",
    "title": "أخصائية العلاج الوظيفي",
    "titleEn": "Occupational Therapist",
    "category": "occupational",
    "department": "قسم العلاج الوظيفي والتكامل الحسي",
    "licenseNumber": "SCFHS-24-8464",
    "avatar": "/specialists/cards/spec_21_yara-abouhamda.png",
    "fallbackAvatar": "/specialists/cards/spec_21_yara-abouhamda.png",
    "rating": 4.9,
    "reviewsCount": 135,
    "experienceYears": 1,
    "education": [
      "بكالوريوس في التأهيل والعلوم الطبية التطبيقية",
      "دبلوم مهني متقدم في برامج التدخل المبكر"
    ],
    "educationEn": [
      "Bachelor of Rehabilitation & Applied Medical Sciences",
      "Advanced Professional Diploma in Early Intervention"
    ],
    "certifications": [
      "ترخيص الهيئة السعودية للتخصصات الصحية (SCFHS)",
      "اعتماد بورد برامج التأهيل الشامل"
    ],
    "certificationsEn": [
      "Saudi Commission for Health Specialties (SCFHS) License",
      "Comprehensive Rehabilitation Programs Board Certification"
    ],
    "specialties": [
      "بكالوريوس العلاج الوظيفي من الجامعة الأردنية",
      "تنمية التآزر البصري الحركي والتخطيط الحركي الدقيق",
      "تدريب مهارات الحياة اليومية والاستقلالية الذاتية للأطفال",
      "خبرة أكثر من سنة"
    ],
    "specialtiesEn": [
      "Specialized Rehabilitation",
      "Early Intervention",
      "Individual Plans"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "sessionPrice": 0,
    "bio": "أخصائية العلاج الوظيفي بمراكز رابا. حاصلة على بكالوريوس العلاج الوظيفي من الجامعة الأردنية، متخصصة في تنمية المهارات الحركية الدقيقة والتكامل الحسي وبرامج الاستقلالية الذاتية للأطفال.",
    "bioEn": "Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.",
    "cardImage": "/specialists/cards/spec_21_yara-abouhamda.png",
    "image": "/specialists/cards/spec_21_yara-abouhamda.png",
    "isTopRated": false
  },
  {
    "id": "spec-sara-abdelhamid",
    "name": "سارة عبد الحميد",
    "nameEn": "Sara Abdelhamid",
    "title": "أخصائية أولى نطق وتخاطب وتأهيل لغوي",
    "titleEn": "Senior Speech-Language Pathologist",
    "role": "أخصائية أولى نطق وتخاطب وتأهيل لغوي",
    "roleEn": "Senior Speech-Language Pathologist",
    "category": "speech",
    "department": "قسم علاج النطق واللغة واضطرابات التواصل",
    "avatar": "/uploads/1790827397368_38_png.png",
    "experienceYears": 8,
    "licenseNumber": "٣٣٤٣",
    "specialties": [
      "تأهيل لغوي متقدم",
      "علاج تأخر الكلام",
      "جلسات النطق والتخاطب وتنمية المهارات",
      "التواصل اللفظي وغير اللفظي"
    ],
    "specialtiesEn": [
      "Speech Delay",
      "PECS System",
      "Fluency & Stuttering",
      "Expressive Language"
    ],
    "education": [
      "بكالوريوس علوم السمع والنطق - جامعة عين شمس",
      "دبلوم مهني في اضطرابات التواصل"
    ],
    "educationEn": [
      "BSc in Speech & Hearing Sciences",
      "Professional Diploma in Communication Disorders"
    ],
    "bio": "أخصائية أولى في علاج اضطرابات النطق واللغة والتخاطب بمراكز رابا، متخصصة في تنمية الحصيلة اللغوية، وعلاج تأخر الكلام، والخطط التأهيلية التفاعلية للأطفال.",
    "bioEn": "Certified Speech-Language Pathologist specializing in language delays, articulation, and PECS for children on the autism spectrum.",
    "certifications": [
      "شهادة معتمدة في PECS Level 2",
      "رخصة الهيئة السعودية للتخصصات الصحية"
    ],
    "certificationsEn": [
      "PECS Level 2 Certified",
      "SCFHS License"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "rating": 4.95,
    "reviewsCount": 145,
    "sessionPrice": 0,
    "fallbackAvatar": "/specialists/sara_abdelhamid.jpg",
    "posterCrop": "/specialists/cards/spec_21_sara-abdelhamid.png",
    "portraitCrop": "/specialists/cards/spec_21_sara-abdelhamid.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790827397368_38_png.png",
    "orderIndex": 21,
    "image": "/uploads/1790827397368_38_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-bayan-alnajem",
    "name": "بيان الناجم",
    "nameEn": "Bayan Al-Najem",
    "title": "أخصائية تربية خاصة",
    "titleEn": "Special Education Specialist",
    "role": "أخصائية تربية خاصة وتأهيل عوق سمعي",
    "roleEn": "Special Education & Hearing Impairment Specialist",
    "category": "speech",
    "department": "قسم التربية الخاصة والتأهيل",
    "avatar": "/uploads/1790863548373_12_png.png",
    "experienceYears": 2,
    "licenseNumber": "",
    "sessionPrice": 0,
    "rating": 4.9,
    "reviewsCount": 95,
    "specialties": [
      "حاصلة على بكالوريوس التربية الخاصة من جامعة الملك فيصل تخصص عوق سمعي",
      "حاصلة على دبلوم إرشاد اسري من جامعة الإمام محمد بن سعود",
      "تأهيل الأطفال ذوي الإعاقة السمعية وتطوير التواصل اللفظي والبديل",
      "خبرة عملية أكثر من سنة"
    ],
    "specialtiesEn": [
      "B.Sc. in Special Education (King Faisal University) - Hearing Impairment",
      "Diploma in Family Counseling (IMSIU)",
      "Pediatric Hearing Impairment & Alternative Communication",
      "1+ Years Clinical Experience"
    ],
    "education": [
      "بكالوريوس التربية الخاصة (تخصص عوق سمعي) - جامعة الملك فيصل",
      "دبلوم الإرشاد الأسري - جامعة الإمام محمد بن سعود الإسلامية"
    ],
    "educationEn": [
      "B.Sc. in Special Education - King Faisal University",
      "Family Counseling Diploma - Imam Mohammad Ibn Saud Islamic University"
    ],
    "certifications": [
      "دبلوم معتمد في الإرشاد الأسري",
      "ترخيص مهني معتمد في التربية الخاصة"
    ],
    "certificationsEn": [
      "Certified Family Counseling Credential",
      "Special Education Professional Credential"
    ],
    "bio": "أخصائية تربية خاصة بمركز رابا. حاصلة على بكالوريوس التربية الخاصة من جامعة الملك فيصل تخصص عوق سمعي، ودبلوم إرشاد أسري من جامعة الإمام محمد بن سعود، بخبرة عملية متقدمة في تأهيل الأطفال ودعم الأسر وتنمية التواصل.",
    "bioEn": "Special Education Specialist at Raba Center, specialized in hearing impairment rehabilitation from King Faisal University and family counseling from IMSIU.",
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "fallbackAvatar": "/specialists/cards/spec_23_bayan-alnajem.png",
    "posterCrop": "/specialists/cards/spec_23_bayan-alnajem.png",
    "portraitCrop": "/specialists/cards/spec_23_bayan-alnajem.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790863548373_12_png.png",
    "orderIndex": 23,
    "image": "/uploads/1790863548373_12_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-manar-obeid",
    "name": "منار عبيد",
    "nameEn": "Manar Obeid",
    "title": "مشرفة قسم الـ ABA",
    "titleEn": "ABA Department Supervisor",
    "role": "مشرفة قسم تحليل السلوك التطبيقي ABA | محلل سلوك معتمد QABA / IBAO",
    "roleEn": "ABA Department Supervisor & Certified Behavior Analyst (QABA/IBAO)",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/uploads/1790865956621_13_png.png",
    "experienceYears": 17,
    "licenseNumber": "",
    "sessionPrice": 0,
    "rating": 4.98,
    "reviewsCount": 310,
    "specialties": [
      "حاصلة على ليسانس الآداب والتربية من جامعة المنوفية",
      "حاصلة على دبلوم مهني في القياس النفسي من جامعة المنوفية",
      "حاصلة على الدبلوم الخاص في القياس النفسي من جامعة المنوفية",
      "حاصلة على ماجستير في التربية الخاصة من جامعة القاهرة",
      "باحثة دكتوراه في التربية الخاصة في جامعة القاهرة",
      "محلل سلوك معتمد من البورد الأمريكي من منظمات QABA / IBAO",
      "خبرة عملية أكثر من ١٧ سنة"
    ],
    "specialtiesEn": [
      "B.A. & Ed. (Menoufia University)",
      "Professional Diploma in Psychometrics (Menoufia University)",
      "Special Diploma in Psychometrics (Menoufia University)",
      "Master Degree in Special Education (Cairo University)",
      "Ph.D. Researcher in Special Education (Cairo University)",
      "Board Certified Behavior Analyst (QABA / IBAO)",
      "17+ Years of clinical and supervisory experience"
    ],
    "education": [
      "ماجستير في التربية الخاصة - جامعة القاهرة",
      "باحثة دكتوراه في التربية الخاصة - جامعة القاهرة",
      "ليسانس الآداب والتربية ودبلومات القياس النفسي - جامعة المنوفية"
    ],
    "educationEn": [
      "Master Degree in Special Education - Cairo University",
      "Ph.D. Candidate in Special Education - Cairo University",
      "B.A. & Higher Psychometric Diplomas - Menoufia University"
    ],
    "certifications": [
      "محلل سلوك معتمد دولياً من البورد الأمريكي QABA",
      "محلل سلوك دولي معتمد من منظمة IBAO",
      "دبلومات عليا في القياس النفسي الإكلينيكي"
    ],
    "certificationsEn": [
      "QABA Board Certified Behavior Analyst",
      "IBAO International Behavior Analyst Certification",
      "Advanced Clinical Psychometrics Diplomas"
    ],
    "bio": "مشرفة قسم تحليل السلوك التطبيقي ABA بمركز رابا ومحلل سلوك معتمد دولياً من البورد الأمريكي QABA ومنظمة IBAO. باحثة دكتوراه وحاصلة على الماجستير في التربية الخاصة من جامعة القاهرة، بخبرة عملية وتدريبية تتجاوز 17 عاماً في الإشراف الإكلينيكي وتصميم الخطط السلوكية.",
    "bioEn": "Supervisor of the ABA Department at Raba Center, certified behavior analyst (QABA/IBAO), Ph.D. researcher and M.Sc. holder from Cairo University with over 17 years of leadership in clinical behavior analysis.",
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "fallbackAvatar": "/specialists/cards/spec_24_manar-obeid.png",
    "posterCrop": "/specialists/cards/spec_24_manar-obeid.png",
    "portraitCrop": "/specialists/cards/spec_24_manar-obeid.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790865956621_13_png.png",
    "orderIndex": 24,
    "image": "/uploads/1790865956621_13_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-salma-abouelfadl",
    "name": "سلمى أبو الفضل",
    "nameEn": "Salma Abo El-Fadl",
    "title": "أخصائية التكامل الحسي",
    "titleEn": "Sensory Integration Specialist",
    "role": "أخصائية التكامل الحسي والتخاطب والتربية الخاصة",
    "roleEn": "Sensory Integration & Communication Specialist",
    "category": "occupational",
    "department": "قسم العلاج الوظيفي والتكامل الحسي",
    "avatar": "/uploads/1790865973849_14_png.png",
    "experienceYears": 7,
    "licenseNumber": "",
    "sessionPrice": 0,
    "rating": 4.95,
    "reviewsCount": 165,
    "specialties": [
      "حاصلة على بكالوريوس تربية طفولة من جامعة المنوفية",
      "حاصلة على دبلوم خاص في التربية الخاصة من جامعة المنوفية",
      "حاصلة على دبلومة تخاطب 300 ساعة من جامعة عين شمس",
      "باحثة ماجستير في التربية الخاصة في جامعة المنوفية",
      "حاصلة على دورة في التكامل الحسي من جامعة عين شمس",
      "خبرة عملية أكثر من 7 سنوات"
    ],
    "specialtiesEn": [
      "B.Sc. in Early Childhood Education (Menoufia University)",
      "Special Diploma in Special Education (Menoufia University)",
      "300-hour Speech Pathology Diploma (Ain Shams University)",
      "Master Degree Researcher in Special Education",
      "Certified Sensory Integration Course (Ain Shams University)",
      "7+ Years Clinical Experience"
    ],
    "education": [
      "باحثة ماجستير في التربية الخاصة - جامعة المنوفية",
      "بكالوريوس تربية طفولة - جامعة المنوفية",
      "دبلومة التخاطب المتخصصة (300 ساعة) - جامعة عين شمس"
    ],
    "educationEn": [
      "M.Sc. Candidate in Special Education - Menoufia University",
      "B.Sc. in Early Childhood - Menoufia University",
      "300-hour Advanced Speech Diploma - Ain Shams University"
    ],
    "certifications": [
      "شهادة معتمدة في التكامل الحسي - جامعة عين شمس",
      "دبلومة التخاطب والنطق المعتمدة"
    ],
    "certificationsEn": [
      "Certified Sensory Integration Specialist - Ain Shams University",
      "Certified Speech & Language Diploma"
    ],
    "bio": "أخصائية التكامل الحسي بمركز رابا. باحثة ماجستير في التربية الخاصة، حاصلة على دبلومة التخاطب ودورة التكامل الحسي من جامعة عين شمس، مع خبرة سريرية تتجاوز 7 سنوات في معالجة الاضطرابات الحسية والتواصلية وتنمية مهارات الأطفال النمائية.",
    "bioEn": "Sensory Integration Specialist at Raba Center, M.Sc. researcher in Special Education with 7+ years of experience in sensory processing and pediatric communication therapies.",
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "fallbackAvatar": "/specialists/cards/spec_25_salma-abouelfadl.png",
    "posterCrop": "/specialists/cards/spec_25_salma-abouelfadl.png",
    "portraitCrop": "/specialists/cards/spec_25_salma-abouelfadl.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790865973849_14_png.png",
    "orderIndex": 25,
    "image": "/uploads/1790865973849_14_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-ahmed-sayed",
    "name": "أحمد سيد",
    "nameEn": "Ahmed Sayed",
    "title": "أخصائي النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "role": "أخصائي النطق والتخاطب والعلاج الفموي OPT",
    "roleEn": "Speech & Language Pathologist (OPT Certified)",
    "category": "speech",
    "department": "قسم النطق والتخاطب",
    "avatar": "/uploads/1790865993782_15_png.png",
    "experienceYears": 6,
    "licenseNumber": "",
    "sessionPrice": 0,
    "rating": 4.93,
    "reviewsCount": 140,
    "specialties": [
      "حاصل على بكالوريوس علوم لذوي الإحتياجات الخاصة بتخصص النطق والتخاطب من جامعة بني سويف",
      "حاصل على كورس العلاج الفموي OPT من الجمعية الأمريكية للنطق واللغة",
      "تأهيل التأتأة والتأخر اللغوي واضطرابات مخارج الحروف والبلع",
      "خبرة عملية أكثر من ٦ سنوات"
    ],
    "specialtiesEn": [
      "B.Sc. in Special Needs Sciences (Speech Pathology) - Beni-Suef University",
      "Oral Placement Therapy (OPT) - ASHA / TalkTools",
      "Stuttering, Speech Delays & Articulation Disorders",
      "6+ Years Clinical Experience"
    ],
    "education": [
      "بكالوريوس علوم ذوي الاحتياجات الخاصة (النطق والتخاطب) - جامعة بني سويف"
    ],
    "educationEn": [
      "B.Sc. in Speech-Language Pathology - Beni-Suef University"
    ],
    "certifications": [
      "كورس العلاج الفموي التموضعي OPT المعتمد دولياً",
      "ترخيص ممارسة مهنة علاج النطق والتخاطب"
    ],
    "certificationsEn": [
      "Oral Placement Therapy (OPT) Certification",
      "Professional Speech Pathology License"
    ],
    "bio": "أخصائي النطق والتخاطب بمركز رابا. حاصل على بكالوريوس النطق والتخاطب من كلية علوم ذوي الاحتياجات الخاصة بجامعة بني سويف، ومعتمد في العلاج الفموي OPT، بخبرة عملية تتجاوز 6 سنوات في علاج عيوب النطق والتأخر اللغوي ومشاكل البلع والتنفس النطقي.",
    "bioEn": "Speech-Language Pathologist at Raba Center, holds B.Sc. in Speech Pathology from Beni-Suef University and certified in Oral Placement Therapy (OPT) with over 6 years of clinical pediatric experience.",
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "fallbackAvatar": "/specialists/cards/spec_26_ahmed-sayed.png",
    "posterCrop": "/specialists/cards/spec_26_ahmed-sayed.png",
    "portraitCrop": "/specialists/cards/spec_26_ahmed-sayed.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790865993782_15_png.png",
    "orderIndex": 26,
    "image": "/uploads/1790865993782_15_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-aseel-yousef",
    "name": "أسيل يوسف",
    "nameEn": "Aseel Yousef",
    "title": "أخصائية العلاج الوظيفي",
    "titleEn": "Occupational Therapy Specialist",
    "role": "أخصائية العلاج الوظيفي والتأهيل الحركي الدقيق",
    "roleEn": "Occupational Therapy & Fine Motor Rehabilitation Specialist",
    "category": "occupational",
    "department": "قسم العلاج الوظيفي والتكامل الحسي",
    "avatar": "/uploads/1790866040732_19_png.png",
    "experienceYears": 3,
    "licenseNumber": "",
    "sessionPrice": 0,
    "rating": 4.91,
    "reviewsCount": 110,
    "specialties": [
      "حاصلة على بكالوريوس العلاج الوظيفي من كلية العلوم الطبية التطبيقية من الجامعة الهاشمية",
      "تأهيل المهارات الحركية الدقيقة والتناسق العضلي البصري",
      "تنمية مهارات الاعتماد على الذات والأنشطة الحياتية اليومية",
      "خبرة عملية أكثر من سنتين"
    ],
    "specialtiesEn": [
      "B.Sc. in Occupational Therapy (Faculty of Applied Medical Sciences - Hashemite University)",
      "Fine Motor & Visual-Motor Skills Development",
      "Activities of Daily Living (ADL) Training",
      "2+ Years Clinical Experience"
    ],
    "education": [
      "بكالوريوس العلاج الوظيفي - الجامعة الهاشمية"
    ],
    "educationEn": [
      "B.Sc. in Occupational Therapy - The Hashemite University"
    ],
    "certifications": [
      "ترخيص مزاولة مهنة العلاج الوظيفي",
      "دورات متخصصة في تنمية المهارات الحركية للأطفال"
    ],
    "certificationsEn": [
      "Licensed Occupational Therapist",
      "Pediatric Motor Skills Development Certification"
    ],
    "bio": "أخصائية العلاج الوظيفي بمركز رابا، خريجة الجامعة الهاشمية في العلوم الطبية التطبيقية، متخصصة في تأهيل المهارات الحركية الدقيقة والتكامل الحسي واستقلالية الطفل في مهارات الحياة اليومية والمدرسية.",
    "bioEn": "Occupational Therapist at Raba Center, graduate of The Hashemite University with specialized expertise in sensory-motor rehabilitation and functional independence for children.",
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "fallbackAvatar": "/specialists/cards/spec_28_aseel-yousef.png",
    "posterCrop": "/specialists/cards/spec_28_aseel-yousef.png",
    "portraitCrop": "/specialists/cards/spec_28_aseel-yousef.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790866040732_19_png.png",
    "orderIndex": 28,
    "image": "/uploads/1790866040732_19_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-mohammed-shehri-clinical",
    "name": "محمد الشهري",
    "nameEn": "Mohammed Al-Shehri",
    "title": "أخصائي نفسي إكلينيكي",
    "titleEn": "Clinical Psychologist",
    "role": "أخصائي نفسي إكلينيكي وتقييم سلوكي",
    "roleEn": "Clinical Psychologist & Behavioral Assessment Specialist",
    "category": "psychology",
    "department": "قسم الإرشاد والتقييم النفسي",
    "avatar": "/uploads/1790866057132_21_png.png",
    "experienceYears": 3,
    "licenseNumber": "",
    "sessionPrice": 0,
    "rating": 4.92,
    "reviewsCount": 115,
    "specialties": [
      "حاصل على بكالوريس علم النفس العام من جامعة الإمام محمد بن سعود الاسلامية",
      "التقييم الإكلينيكي والمقاييس النفسية النمائية",
      "برامج تعديل السلوك والإرشاد الأسري للأطفال",
      "خبرة أكثر من سنتين"
    ],
    "specialtiesEn": [
      "B.Sc. in Psychology - Imam Mohammad Ibn Saud Islamic University",
      "Clinical Psychological Assessments & Developmental Scales",
      "Behavioral Intervention & Parental Guidance",
      "2+ Years Clinical Experience"
    ],
    "education": [
      "بكالوريوس علم النفس - جامعة الإمام محمد بن سعود الإسلامية"
    ],
    "educationEn": [
      "B.Sc. in Psychology - Imam Mohammad Ibn Saud Islamic University"
    ],
    "certifications": [
      "ترخيص الهيئة السعودية للتخصصات الصحية",
      "اعتمادات تطبيق وتفسير المقاييس النفسية النمائية"
    ],
    "certificationsEn": [
      "Licensed by Saudi Commission for Health Specialties (SCFHS)",
      "Psychometric Testing Certification"
    ],
    "bio": "أخصائي نفسي إكلينيكي بمركز رابا. حاصل على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الإسلامية، متخصص في التقييم والتشخيص النفسي وتصميم برامج تعديل السلوك للأطفال وتقديم الدعم الإرشادي للأسر.",
    "bioEn": "Clinical Psychologist at Raba Center, holds B.Sc. in Psychology from IMSIU, specializing in diagnostic assessments, clinical evaluations, and behavioral interventions for children.",
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "fallbackAvatar": "/specialists/cards/spec_29_mohammed-shehri-clinical.png",
    "posterCrop": "/specialists/cards/spec_29_mohammed-shehri-clinical.png",
    "portraitCrop": "/specialists/cards/spec_29_mohammed-shehri-clinical.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790866057132_21_png.png",
    "orderIndex": 29,
    "image": "/uploads/1790866057132_21_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-saad-dosari",
    "name": "سعد الدوسري",
    "nameEn": "Saad Al-Dosari",
    "title": "أخصائي ABA",
    "titleEn": "Applied Behavior Analysis Specialist",
    "role": "أخصائي تحليل السلوك التطبيقي ABA معتمد ABAT",
    "roleEn": "ABA Specialist & Licensed ABAT Behavior Technician",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/uploads/1790866075647_22_png.png",
    "experienceYears": 2,
    "licenseNumber": "",
    "sessionPrice": 0,
    "rating": 4.9,
    "reviewsCount": 88,
    "specialties": [
      "حاصل على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الاسلامية",
      "حاصل على رخصة الهيئة السعودية للتخصصات الصحية",
      "حاصل على رخصة ABAT من البورد الامريكي QABA",
      "خبرة عملية أكثر من سنة في التدخل السلوكي الفردي"
    ],
    "specialtiesEn": [
      "B.Sc. in Psychology - Imam Mohammad Ibn Saud Islamic University",
      "Licensed by Saudi Commission for Health Specialties (SCFHS)",
      "ABAT Credential - QABA Board Certified",
      "1+ Years Clinical Experience"
    ],
    "education": [
      "بكالوريوس علم النفس - جامعة الإمام محمد بن سعود الإسلامية"
    ],
    "educationEn": [
      "B.Sc. in Psychology - Imam Mohammad Ibn Saud Islamic University"
    ],
    "certifications": [
      "رخصة الهيئة السعودية للتخصصات الصحية (SCFHS)",
      "رخصة البورد الأمريكي لتحليل السلوك التطبيقي (ABAT - QABA)"
    ],
    "certificationsEn": [
      "SCFHS Professional Healthcare License",
      "QABA ABAT Behavior Technician Certification"
    ],
    "bio": "أخصائي تحليل سلوك تطبيقي ABA بمركز رابا. مرخص من هيئة التخصصات الصحية السعودية وحاصل على رخصة ABAT من البورد الأمريكي QABA، متخصص في بناء المهارات السلوكية والتواصلية للأطفال.",
    "bioEn": "Certified ABA Specialist at Raba Center, licensed by SCFHS and QABA Board (ABAT) with a B.Sc. in Psychology from IMSIU.",
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "fallbackAvatar": "/specialists/cards/spec_30_saad-dosari.png",
    "posterCrop": "/specialists/cards/spec_30_saad-dosari.png",
    "portraitCrop": "/specialists/cards/spec_30_saad-dosari.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790866075647_22_png.png",
    "orderIndex": 30,
    "image": "/uploads/1790866075647_22_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-fahad-juhani",
    "name": "فهد الجهني",
    "nameEn": "Fahad Al-Juhani",
    "title": "أخصائي ABA",
    "titleEn": "Applied Behavior Analysis Specialist",
    "role": "أخصائي تحليل السلوك التطبيقي ABA معتمد ABAT",
    "roleEn": "ABA Specialist & Certified ABAT Practitioner",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/uploads/1790866092167_23_png.png",
    "experienceYears": 3,
    "licenseNumber": "",
    "sessionPrice": 0,
    "rating": 4.92,
    "reviewsCount": 105,
    "specialties": [
      "حاصل على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الاسلامية",
      "حاصل على إعتماد ABAT في تحليل السلوك التطبيقي من QABA",
      "تطوير التواصل الوظيفي والحد من السلوكيات النمطية",
      "خبرة عملية أكثر من سنتين"
    ],
    "specialtiesEn": [
      "B.Sc. in Psychology - Imam Mohammad Ibn Saud Islamic University",
      "ABAT Credential in Applied Behavior Analysis - QABA",
      "Functional Communication Training (FCT)",
      "2+ Years Clinical Experience"
    ],
    "education": [
      "بكالوريوس علم النفس - جامعة الإمام محمد بن سعود الإسلامية"
    ],
    "educationEn": [
      "B.Sc. in Psychology - Imam Mohammad Ibn Saud Islamic University"
    ],
    "certifications": [
      "اعتماد فني تحليل سلوك تطبيقي ABAT من البورد الدولي QABA",
      "ترخيص الرعاية الصحية والتأهيل السلوكي"
    ],
    "certificationsEn": [
      "ABAT Certification - QABA International Board",
      "Behavioral Rehabilitation Credential"
    ],
    "bio": "أخصائي تحليل السلوك التطبيقي ABA بمركز رابا، معتمد دولياً من البورد الأمريكي QABA، خريج جامعة الإمام في علم النفس، بخبرة عملية تتجاوز سنتين في التدريب السلوكي والتواصل الوظيفي للأطفال.",
    "bioEn": "ABA Specialist at Raba Center, QABA ABAT certified with B.Sc. in Psychology from IMSIU and 2+ years of clinical pediatric behavioral therapy experience.",
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "fallbackAvatar": "/specialists/cards/spec_31_fahad-juhani.png",
    "posterCrop": "/specialists/cards/spec_31_fahad-juhani.png",
    "portraitCrop": "/specialists/cards/spec_31_fahad-juhani.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790866092167_23_png.png",
    "orderIndex": 31,
    "image": "/uploads/1790866092167_23_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-hala-enazi",
    "name": "هلا العنزي",
    "nameEn": "Hala Al-Enazi",
    "title": "أخصائية ABA",
    "titleEn": "Applied Behavior Analysis Specialist",
    "role": "أخصائية تحليل السلوك التطبيقي ABA | تصنيف هيئة التخصصات الصحية",
    "roleEn": "ABA Specialist & SCFHS Classified Psychologist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/uploads/1790866107078_24_png.png",
    "experienceYears": 2,
    "licenseNumber": "",
    "sessionPrice": 0,
    "rating": 4.91,
    "reviewsCount": 92,
    "specialties": [
      "حاصلة على بكالوريوس علم النفس من جامعة الأميرة نورة بنت عبدالرحمن",
      "حاصلة على تصنيف مهني من الهيئة السعودية للتخصصات الصحية",
      "حاصلة على اعتماد ABAT في تحليل السلوك التطبيقي من QABA",
      "متخصصة في تطبيق مبادئ تحليل السلوك التطبيقي (ABA) مع الأطفال",
      "خبرة عملية أكثر من سنة"
    ],
    "specialtiesEn": [
      "B.Sc. in Psychology - Princess Nourah Bint Abdulrahman University",
      "SCFHS Professional Classification",
      "ABAT Credential - QABA Certified",
      "Pediatric Behavior Protocol Implementation",
      "1+ Years Clinical Experience"
    ],
    "education": [
      "بكالوريوس علم النفس - جامعة الأميرة نورة بنت عبدالرحمن"
    ],
    "educationEn": [
      "B.Sc. in Psychology - Princess Nourah Bint Abdulrahman University"
    ],
    "certifications": [
      "تصنيف مهني من الهيئة السعودية للتخصصات الصحية (SCFHS)",
      "اعتماد البورد الأمريكي لتحليل السلوك QABA (ABAT)"
    ],
    "certificationsEn": [
      "SCFHS Professional Healthcare Credential",
      "QABA ABAT Behavior Technician Certification"
    ],
    "bio": "أخصائية تحليل سلوك تطبيقي ABA بمركز رابا ومصنفة مهنياً من هيئة التخصصات الصحية. خريجة جامعة الأميرة نورة ومعتمدة من البورد الأمريكي QABA، متخصصة في الجلسات السلوكية الفردية وتنمية مهارات التواصل والتفاعل الاجتماعي.",
    "bioEn": "ABA Specialist at Raba Center, SCFHS certified psychologist and QABA ABAT practitioner, graduated from PNU with focus on pediatric behavior modification.",
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "fallbackAvatar": "/specialists/cards/spec_32_hala-enazi.png",
    "posterCrop": "/specialists/cards/spec_32_hala-enazi.png",
    "portraitCrop": "/specialists/cards/spec_32_hala-enazi.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790866107078_24_png.png",
    "orderIndex": 32,
    "image": "/uploads/1790866107078_24_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-taif-subaie",
    "name": "طيف السبيعي",
    "nameEn": "Taif Al-Subaie",
    "title": "أخصائية ABA",
    "titleEn": "Applied Behavior Analysis Specialist",
    "role": "أخصائية تحليل السلوك التطبيقي ABA | أخصائي نفسي مرخص",
    "roleEn": "ABA Specialist & Licensed Psychologist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/uploads/1790866122845_25_png.png",
    "experienceYears": 3,
    "licenseNumber": "",
    "sessionPrice": 0,
    "rating": 4.93,
    "reviewsCount": 110,
    "specialties": [
      "حاصلة على بكالوريوس علم النفس من جامعة الطائف",
      "حاصلة على اعتماد ABAT في تحليل السلوك التطبيقي من QABA",
      "حاصلة على ترخيص هيئة التخصصات الصحية بمسمى اخصائي نفسي.",
      "خبرة عملية أكثر من سنتين"
    ],
    "specialtiesEn": [
      "B.Sc. in Psychology - Taif University",
      "ABAT Credential - QABA Board Certified",
      "Licensed Psychologist by SCFHS",
      "Verbal Behavior & Social Skills Training",
      "2+ Years Clinical Experience"
    ],
    "education": [
      "بكالوريوس علم النفس - جامعة الطائف"
    ],
    "educationEn": [
      "B.Sc. in Psychology - Taif University"
    ],
    "certifications": [
      "ترخيص هيئة التخصصات الصحية السعودية (أخصائي نفسي)",
      "اعتماد البورد الأمريكي ABAT من QABA"
    ],
    "certificationsEn": [
      "SCFHS Licensed Psychologist",
      "QABA ABAT Credential"
    ],
    "bio": "أخصائية تحليل السلوك التطبيقي ABA بمركز رابا. مرخصة كأخصائية نفسية من هيئة التخصصات الصحية السعودية ومعتمدة كفني سلوك ABAT من البورد الأمريكي QABA، بخبرة سريرية متقدمة في رعاية وتأهيل الأطفال.",
    "bioEn": "ABA Specialist at Raba Center, licensed psychologist by SCFHS and ABAT certified by QABA, with B.Sc. from Taif University and over 2 years of clinical pediatric practice.",
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "fallbackAvatar": "/specialists/cards/spec_33_taif-subaie.png",
    "posterCrop": "/specialists/cards/spec_33_taif-subaie.png",
    "portraitCrop": "/specialists/cards/spec_33_taif-subaie.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790866122845_25_png.png",
    "orderIndex": 33,
    "image": "/uploads/1790866122845_25_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-raghad-hawarneh",
    "name": "رغد حوارنه",
    "nameEn": "Raghad Hawarneh",
    "title": "أخصائية العلاج الوظيفي",
    "titleEn": "Occupational Therapy Specialist",
    "role": "أخصائية العلاج الوظيفي والتأهيل الطبي",
    "roleEn": "Occupational Therapy & Medical Rehabilitation Specialist",
    "category": "occupational",
    "department": "قسم العلاج الوظيفي والتكامل الحسي",
    "avatar": "/uploads/1790866151823_26_png.png",
    "experienceYears": 2,
    "licenseNumber": "",
    "sessionPrice": 0,
    "rating": 4.9,
    "reviewsCount": 85,
    "specialties": [
      "حاصلة على بكالوريوس علوم التأهيل الطبية من جامعة العلوم والتكنولوجيا الأردنية",
      "تأهيل التناسق الحركي والتكامل العصبي العضلي للأطفال",
      "تنمية الاستقلالية في البيئة المدرسية والمنزلية",
      "خبرة عملية أكثر من سنة"
    ],
    "specialtiesEn": [
      "B.Sc. in Medical Rehabilitation Sciences (Occupational Therapy) - JUST",
      "Neuromuscular & Sensory-Motor Rehabilitation",
      "School & Home Adaptive Independence",
      "1+ Years Clinical Experience"
    ],
    "education": [
      "بكالوريوس علوم التأهيل الطبي (علاج وظيفي) - جامعة العلوم والتكنولوجيا الأردنية"
    ],
    "educationEn": [
      "B.Sc. in Rehabilitation Sciences - Jordan University of Science and Technology"
    ],
    "certifications": [
      "ترخيص مزاولة مهنة العلاج الوظيفي",
      "شهادات معتمدة في تقييم المهارات الوظيفية للأطفال"
    ],
    "certificationsEn": [
      "Licensed Occupational Therapist",
      "Pediatric Functional Assessment Credential"
    ],
    "bio": "أخصائية العلاج الوظيفي بمركز رابا، خريجة جامعة العلوم والتكنولوجيا الأردنية في علوم التأهيل الطبي، متخصصة في تأهيل المهارات الوظيفية الحركية وتنمية استقلالية الأطفال في المهام اليومية والبيئة التعليمية.",
    "bioEn": "Occupational Therapist at Raba Center, graduate in Medical Rehabilitation from Jordan University of Science and Technology (JUST), focusing on functional motor rehabilitation and pediatric independence.",
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "fallbackAvatar": "/specialists/cards/spec_34_raghad-hawarneh.png",
    "posterCrop": "/specialists/cards/spec_34_raghad-hawarneh.png",
    "portraitCrop": "/specialists/cards/spec_34_raghad-hawarneh.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790866151823_26_png.png",
    "orderIndex": 34,
    "image": "/uploads/1790866151823_26_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-eman-bahattab",
    "name": "إيمان باحطاب",
    "nameEn": "Eman Ba-Hattab",
    "title": "أخصائية ABA",
    "titleEn": "Applied Behavior Analysis Specialist",
    "role": "أخصائية تحليل السلوك التطبيقي ABA | فني سلوك معتمد QABA",
    "roleEn": "ABA Specialist & Certified Behavior Technician (QABA)",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/uploads/1790866167869_27_png.png",
    "experienceYears": 6,
    "licenseNumber": "",
    "sessionPrice": 0,
    "rating": 4.94,
    "reviewsCount": 155,
    "specialties": [
      "حاصلة على بكالوريوس علم النفس من جامعة العلوم والتكنولوجيا",
      "حاصلة على شهادة فني تحليل سلوك تطبيقي ABA معتمد من البورد الأمريكي QABA",
      "تصميم وتنفيذ برامج التدخل المبكر وتعديل السلوك",
      "خبرة عملية أكثر من ٥ سنوات"
    ],
    "specialtiesEn": [
      "B.Sc. in Psychology - University of Science and Technology",
      "Applied Behavior Analysis Technician (ABAT) - QABA Board",
      "Early Behavioral Intervention & Skill Acquisition",
      "5+ Years Clinical Experience"
    ],
    "education": [
      "بكالوريوس علم النفس - جامعة العلوم والتكنولوجيا"
    ],
    "educationEn": [
      "B.Sc. in Psychology - University of Science and Technology"
    ],
    "certifications": [
      "شهادة فني تحليل سلوك تطبيقي معتمد من البورد الأمريكي QABA",
      "اعتمادات متقدمة في برامج التوحد والتدخل المبكر"
    ],
    "certificationsEn": [
      "QABA ABAT Behavior Technician Credential",
      "Autism Spectrum Intervention Certifications"
    ],
    "bio": "أخصائية تحليل السلوك التطبيقي ABA بمركز رابا. حاصلة على بكالوريوس علم النفس ومعتمدة من البورد الأمريكي QABA، وتمتلك خبرة عملية واسعة تتجاوز 5 سنوات في تطبيق برامج تعديل السلوك والتدخل المبكر المبني على القياس الدقيق.",
    "bioEn": "ABA Specialist at Raba Center, QABA certified behavior technician with B.Sc. in Psychology and over 5 years of clinical pediatric experience in evidence-based behavioral intervention.",
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "fallbackAvatar": "/specialists/cards/spec_35_eman-bahattab.png",
    "posterCrop": "/specialists/cards/spec_35_eman-bahattab.png",
    "portraitCrop": "/specialists/cards/spec_35_eman-bahattab.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790866167869_27_png.png",
    "orderIndex": 35,
    "image": "/uploads/1790866167869_27_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-omar-saad-speech",
    "name": "عمر سعد",
    "nameEn": "Omar Saad",
    "title": "أخصائي النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "role": "أخصائي النطق والتخاطب | معتمد ABAT / QASP-S Candidate",
    "roleEn": "Speech Pathologist & Behavioral Specialist (ABAT / QASP-S Candidate)",
    "category": "speech",
    "department": "قسم النطق والتخاطب",
    "avatar": "/uploads/1790866182582_28_png.png",
    "experienceYears": 6,
    "licenseNumber": "",
    "sessionPrice": 0,
    "rating": 4.95,
    "reviewsCount": 160,
    "specialties": [
      "حاصل على بكالوريوس التربية الخاصة من جامعة العريش",
      "حاصل على إعتمادات من البورد الأمريكي ABAT / QASP-S Candidate",
      "تأهيل النطق واضطرابات الصوت والكلام والتواصل اللفظي",
      "خبرة عملية أكثر من ٥ سنوات"
    ],
    "specialtiesEn": [
      "B.Sc. in Special Education - Arish University",
      "QABA American Board: ABAT & QASP-S Candidate",
      "Speech, Language & Fluency Rehabilitation",
      "5+ Years Clinical Experience"
    ],
    "education": [
      "بكالوريوس التربية الخاصة - جامعة العريش"
    ],
    "educationEn": [
      "B.Sc. in Special Education - Arish University"
    ],
    "certifications": [
      "اعتماد ABAT من البورد الأمريكي QABA",
      "مرشح محلل سلوك تطبيقي مساعد QASP-S من البورد الأمريكي QABA",
      "ترخيص مزاولة مهنة التخاطب"
    ],
    "certificationsEn": [
      "QABA ABAT Credential",
      "QABA QASP-S Candidate Credential",
      "Licensed Speech-Language Specialist"
    ],
    "bio": "أخصائي النطق والتخاطب بمركز رابا. يجمع بين التخصص الأكاديمي في التربية الخاصة والاعتمادات الدولية من البورد الأمريكي QABA (ABAT / QASP-S Candidate)، بخبرة تتجاوز 5 سنوات في علاج التأتأة والتأخر اللغوي واضطرابات الصوت والكلام.",
    "bioEn": "Speech and Language Pathologist at Raba Center, ABAT credentialed and QASP-S Candidate by QABA Board with over 5 years of specialized clinical experience.",
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "fallbackAvatar": "/specialists/cards/spec_36_omar-saad-speech.png",
    "posterCrop": "/specialists/cards/spec_36_omar-saad-speech.png",
    "portraitCrop": "/specialists/cards/spec_36_omar-saad-speech.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790866182582_28_png.png",
    "orderIndex": 36,
    "image": "/uploads/1790866182582_28_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-aliah-mutairi",
    "name": "عاليه المطيري",
    "nameEn": "Aliah Al-Mutairi",
    "title": "أخصائية العلاج الوظيفي",
    "titleEn": "Occupational Therapy Specialist",
    "role": "أخصائية العلاج الوظيفي والتكامل الحسي",
    "roleEn": "Occupational Therapy & Sensory Rehabilitation Specialist",
    "category": "occupational",
    "department": "قسم العلاج الوظيفي والتكامل الحسي",
    "avatar": "/uploads/1790866202949_29_png.png",
    "experienceYears": 3,
    "licenseNumber": "",
    "sessionPrice": 0,
    "rating": 4.92,
    "reviewsCount": 118,
    "specialties": [
      "حاصله على بكالوريوس العلاج الوظيفي من جامعة الملك سعود",
      "تأهيل التكامل الحسي والتناسق العضلي الحركي",
      "تدريب المهارات التكيفية والاعتماد على الذات",
      "خبرة عملية أكثر من سنتين"
    ],
    "specialtiesEn": [
      "B.Sc. in Occupational Therapy - King Saud University (KSU)",
      "Sensory Integration & Motor Coordination",
      "Pediatric Adaptive Skills Development",
      "2+ Years Clinical Experience"
    ],
    "education": [
      "بكالوريوس العلاج الوظيفي - جامعة الملك سعود"
    ],
    "educationEn": [
      "B.Sc. in Occupational Therapy - King Saud University"
    ],
    "certifications": [
      "ترخيص الهيئة السعودية للتخصصات الصحية (SCFHS)",
      "اعتمادات التكامل الحسي للأطفال"
    ],
    "certificationsEn": [
      "SCFHS Professional Healthcare License",
      "Sensory Processing Certifications"
    ],
    "bio": "أخصائية العلاج الوظيفي بمركز رابا، خريجة جامعة الملك سعود المرموقة، متخصصة في تأهيل القدرات الحركية الدقيقة والتكامل الحسي وتعديل البيئة لدعم استقلالية الأطفال اليومية.",
    "bioEn": "Occupational Therapist at Raba Center, graduated from King Saud University (KSU) with 2+ years of clinical experience in pediatric sensory integration and functional rehabilitation.",
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "fallbackAvatar": "/specialists/cards/spec_37_aliah-mutairi.png",
    "posterCrop": "/specialists/cards/spec_37_aliah-mutairi.png",
    "portraitCrop": "/specialists/cards/spec_37_aliah-mutairi.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790866202949_29_png.png",
    "orderIndex": 37,
    "image": "/uploads/1790866202949_29_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-haya-faleh",
    "name": "هياء الفالح",
    "nameEn": "Haya Al-Faleh",
    "title": "أخصائية نفسية | أخصائية ABA",
    "titleEn": "Psychologist & ABA Specialist",
    "role": "أخصائية نفسية وسلوكية معتمدة ABAT من QABA",
    "roleEn": "Psychologist & Certified Behavior Analyst Technician (ABAT)",
    "category": "psychology",
    "department": "قسم الإرشاد النفسي والتدخل السلوكي ABA",
    "avatar": "/uploads/1790866269363_30_png.png",
    "experienceYears": 2,
    "licenseNumber": "",
    "sessionPrice": 0,
    "rating": 4.91,
    "reviewsCount": 94,
    "specialties": [
      "حاصلة على بكالوريوس علم النفس من كلية التربية - جامعة الملك سعود",
      "حاصلة على اعتماد ABAT في تحليل السلوك التطبيقي من QABA",
      "تعديل السلوك وتنمية المهارات التكيفية والنفسية للطفل",
      "خبرة عملية أكثر من سنة"
    ],
    "specialtiesEn": [
      "B.Sc. in Psychology (College of Education) - King Saud University",
      "ABAT Credential - QABA Certified",
      "Pediatric Behavior Therapy & Emotional Adaptation",
      "1+ Years Clinical Experience"
    ],
    "education": [
      "بكالوريوس علم النفس - كلية التربية - جامعة الملك سعود"
    ],
    "educationEn": [
      "B.Sc. in Psychology - King Saud University"
    ],
    "certifications": [
      "اعتماد فني تحليل سلوك تطبيقي ABAT من البورد الأمريكي QABA",
      "شهادات القياس النفسي السلوكي"
    ],
    "certificationsEn": [
      "QABA ABAT Behavior Technician Credential",
      "Child Behavioral Assessment Certifications"
    ],
    "bio": "أخصائية نفسية وأخصائية ABA بمركز رابا. خريجة جامعة الملك سعود ومعتمدة كفني تحليل سلوك تطبيقي من البورد الأمريكي QABA، متخصصة في معالجة القلق والمخاوف السلوكية وبناء المهارات التكيفية للأطفال.",
    "bioEn": "Psychologist & ABA Specialist at Raba Center, King Saud University alumna and QABA ABAT certified practitioner, dedicated to evidence-based psychological and behavioral therapy.",
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "fallbackAvatar": "/specialists/cards/spec_38_haya-faleh.png",
    "posterCrop": "/specialists/cards/spec_38_haya-faleh.png",
    "portraitCrop": "/specialists/cards/spec_38_haya-faleh.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790866269363_30_png.png",
    "orderIndex": 38,
    "image": "/uploads/1790866269363_30_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-haya-dosari",
    "name": "هياء الدوسري",
    "nameEn": "Haya Al-Dosari",
    "title": "أخصائية نفسية | أخصائية ABA",
    "titleEn": "Psychologist & ABA Specialist",
    "role": "أخصائية نفسية وسلوكية معتمدة ABAT من QABA",
    "roleEn": "Psychologist & Certified Behavior Analyst Technician (ABAT)",
    "category": "psychology",
    "department": "قسم الإرشاد النفسي والتدخل السلوكي ABA",
    "avatar": "/uploads/1790866288993_31_png.png",
    "experienceYears": 2,
    "licenseNumber": "",
    "sessionPrice": 0,
    "rating": 4.91,
    "reviewsCount": 96,
    "specialties": [
      "حاصلة على بكالوريوس علم النفس من كلية التربية - جامعة الملك سعود",
      "حاصلة على اعتماد ABAT في تحليل السلوك التطبيقي من QABA",
      "التدخلات السلوكية الإيجابية وتطوير المهارات التفاعلية",
      "خبرة عملية أكثر من سنة"
    ],
    "specialtiesEn": [
      "B.Sc. in Psychology (College of Education) - King Saud University",
      "ABAT Credential - QABA Certified",
      "Positive Behavior Interventions & Social Skills",
      "1+ Years Clinical Experience"
    ],
    "education": [
      "بكالوريوس علم النفس - كلية التربية - جامعة الملك سعود"
    ],
    "educationEn": [
      "B.Sc. in Psychology - King Saud University"
    ],
    "certifications": [
      "اعتماد فني تحليل سلوك تطبيقي ABAT من البورد الأمريكي QABA",
      "ترخيص الممارسة المهنية في الرعاية النفسية"
    ],
    "certificationsEn": [
      "QABA ABAT Certification",
      "Professional Psychological Healthcare Credential"
    ],
    "bio": "أخصائية نفسية وسلوكية ABA بمركز رابا. حاصلة على بكالوريوس علم النفس من جامعة الملك سعود واعتماد ABAT الدولي من QABA، متخصصة في التدخلات السلوكية الإيجابية وتطوير المهارات التفاعلية للأطفال.",
    "bioEn": "Clinical Psychologist & ABA Specialist at Raba Center, King Saud University graduate and certified ABAT behavior technician with expertise in individualized therapeutic protocols.",
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "fallbackAvatar": "/specialists/cards/spec_39_haya-dosari.png",
    "posterCrop": "/specialists/cards/spec_39_haya-dosari.png",
    "portraitCrop": "/specialists/cards/spec_39_haya-dosari.png",
    "focalPosition": "top",
    "zoomLevel": 100,
    "cardImage": "/uploads/1790866288993_31_png.png",
    "orderIndex": 39,
    "image": "/uploads/1790866288993_31_png.png",
    "isTopRated": false
  },
  {
    "id": "spec-ahlam-alnoaman",
    "name": "أحلام النعمان",
    "nameEn": "Ahlam Al-Noman",
    "role": "أخصائية النطق والتخاطب",
    "roleEn": "Speech & Language Pathologist",
    "title": "أخصائية النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "category": "speech",
    "department": "قسم النطق والتخاطب والتأهيل اللغوي",
    "licenseNumber": "SCFHS-24-5930",
    "avatar": "/uploads/1791192101630________________png.png",
    "fallbackAvatar": "/specialists/cards/spec_ahlam-alnoaman.svg",
    "rating": 4.95,
    "reviewsCount": 160,
    "experienceYears": 17,
    "education": [
      "حاصلة على درجة البكالوريوس من جامعة عين شمس",
      "حاصلة على دبلوم التوحد من جامعة القاهرة",
      "حاصلة على دبلومة التربية الخاصة من جامعة القاهرة",
      "حاصلة على دبلومة صعوبات التعلم من جامعة القاهرة",
      "حاصلة على دبلومة إعداد أخصائي تربية خاصة"
    ],
    "educationEn": [
      "Bachelor of Applied Sciences & Special Education",
      "Professional Diploma in Early Intervention & Autism Therapy"
    ],
    "certifications": [
      "حاصلة على دورة تخصصية في العلاج الحركي اللمسي للنطق والكلام OPT",
      "حاصلة على ترخيص الهيئة السعودية للتخصصات الصحية"
    ],
    "certificationsEn": [
      "SCFHS Accreditation & Licensing",
      "Certified Behavioral & Clinical Intervention Programs"
    ],
    "specialties": [
      "حاصلة على درجة البكالوريوس من جامعة عين شمس",
      "حاصلة على دبلوم التوحد من جامعة القاهرة",
      "حاصلة على دبلومة التربية الخاصة من جامعة القاهرة",
      "حاصلة على دبلومة صعوبات التعلم من جامعة القاهرة",
      "حاصلة على دبلومة إعداد أخصائي تربية خاصة",
      "حاصلة على دورة تخصصية في العلاج الحركي اللمسي للنطق والكلام OPT",
      "حاصلة على ترخيص الهيئة السعودية للتخصصات الصحية",
      "خبرة عملية أكثر من 17 سنة"
    ],
    "specialtiesEn": [
      "Specialized Rehabilitation",
      "Early Intervention",
      "Individual Plans"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "sessionPrice": 0,
    "bio": "أخصائية نطق وتخاطب بخبرة عملية تتجاوز 17 عاماً في علاج اضطرابات النطق والتواصل وتأخر النمو اللغوي. حاصلة على بكالوريوس من جامعة عين شمس ودبلومات تخصصية في التوحد وصعوبات التعلم والتربية الخاصة من جامعة القاهرة، ومرخصة من الهيئة السعودية للتخصصات الصحية مع اعتماد العلاج الحركي اللمسي OPT.",
    "bioEn": "Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.",
    "cardImage": "/uploads/1791192101630________________png.png",
    "image": "/uploads/1791192101630________________png.png",
    "isTopRated": false
  },
  {
    "id": "spec-atheer-alrasheed",
    "name": "اثير آل رشيد",
    "nameEn": "Atheer Al-Rasheed",
    "role": "أخصائية تحليل السلوك التطبيقي ABA",
    "roleEn": "Applied Behavior Analysis (ABA) Specialist",
    "title": "أخصائية ABA",
    "titleEn": "ABA Specialist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "licenseNumber": "SCFHS-24-2041",
    "avatar": "/uploads/1791192114276_______________png.png",
    "fallbackAvatar": "/specialists/cards/spec_atheer-alrasheed.svg",
    "rating": 4.9,
    "reviewsCount": 95,
    "experienceYears": 3,
    "education": [
      "حاصلة على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الاسلامية"
    ],
    "educationEn": [
      "Bachelor of Applied Sciences & Special Education",
      "Professional Diploma in Early Intervention & Autism Therapy"
    ],
    "certifications": [
      "حاصلة على تصنيف هيئة التخصصات الصحية",
      "حاصلة على رخصة ABAT فني تحليل سلوك تطبيقي",
      "حاصلة على دورة فعالية العلاج الطبي ومدى تأثيره على ذوي إضطرابات طيف التوحد"
    ],
    "certificationsEn": [
      "SCFHS Accreditation & Licensing",
      "Certified Behavioral & Clinical Intervention Programs"
    ],
    "specialties": [
      "حاصلة على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الاسلامية",
      "حاصلة على تصنيف هيئة التخصصات الصحية",
      "حاصلة على رخصة ABAT فني تحليل سلوك تطبيقي",
      "حاصلة على دورة فعالية العلاج الطبي ومدى تأثيره على ذوي إضطرابات طيف التوحد",
      "خبرة عملية أكثر من 3 سنوات"
    ],
    "specialtiesEn": [
      "Specialized Rehabilitation",
      "Early Intervention",
      "Individual Plans"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "sessionPrice": 0,
    "bio": "أخصائية تحليل سلوك تطبيقي ABA مرخصة ومصنفة من الهيئة السعودية للتخصصات الصحية وحاصلة على رخصة ABAT. متخصصة في تعديل السلوك وتنمية المهارات الاستقلالية والتواصلية للأطفال ذوي اضطراب طيف التوحد.",
    "bioEn": "Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.",
    "cardImage": "/uploads/1791192114276_______________png.png",
    "image": "/uploads/1791192114276_______________png.png",
    "isTopRated": false
  },
  {
    "id": "spec-tasneem-sabry",
    "name": "د. تسنيم صبري",
    "nameEn": "Dr. Tasneem Sabry",
    "role": "مشرفة قسم تحليل السلوك التطبيقي ABA",
    "roleEn": "Applied Behavior Analysis Department Supervisor",
    "title": "مشرفة قسم الـ ABA",
    "titleEn": "ABA Department Supervisor",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "licenseNumber": "SCFHS-24-9335",
    "avatar": "/uploads/1791192126580____________png.png",
    "fallbackAvatar": "/specialists/cards/spec_tasneem-sabry.svg",
    "rating": 4.96,
    "reviewsCount": 190,
    "experienceYears": 8,
    "education": [
      "حاصلة على بكالوريوس التربية والتربية الخاصة من جامعة قناة السويس",
      "حاصلة على الماجستير المهني من جامعة القاهرة",
      "حاصلة على الدكتوراه المهني من جامعة القاهرة",
      "حاصلة على دبلوم التوحد وإضطرابات النطق من الجامعة الامريكية",
      "حاصلة على دبلوم صعوبات التعلم والعلاج الوظيفي ومهارات النمو من الجامعة الامريكية"
    ],
    "educationEn": [
      "Bachelor of Applied Sciences & Special Education",
      "Professional Diploma in Early Intervention & Autism Therapy"
    ],
    "certifications": [
      "حاصلة على إعتماد في تحليل السلوك التطبيقي من QABA"
    ],
    "certificationsEn": [
      "SCFHS Accreditation & Licensing",
      "Certified Behavioral & Clinical Intervention Programs"
    ],
    "specialties": [
      "حاصلة على بكالوريوس التربية والتربية الخاصة من جامعة قناة السويس",
      "حاصلة على الماجستير المهني من جامعة القاهرة",
      "حاصلة على الدكتوراه المهني من جامعة القاهرة",
      "حاصلة على دبلوم التوحد وإضطرابات النطق من الجامعة الامريكية",
      "حاصلة على دبلوم صعوبات التعلم والعلاج الوظيفي ومهارات النمو من الجامعة الامريكية",
      "حاصلة على إعتماد في تحليل السلوك التطبيقي من QABA",
      "خبرة عملية أكثر من 8 سنوات"
    ],
    "specialtiesEn": [
      "Specialized Rehabilitation",
      "Early Intervention",
      "Individual Plans"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "sessionPrice": 0,
    "bio": "مشرفة قسم تحليل السلوك التطبيقي ABA بمراكز رابا، حاصلة على الدكتوراه والماجستير المهنيين من جامعة القاهرة ودبلومات متقدمة من الجامعة الأمريكية. تمتلك خبرة تفوق 8 سنوات في الإشراف الإكلينيكي وتصميم الخطط السلوكية المتقدمة.",
    "bioEn": "Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.",
    "cardImage": "/uploads/1791192126580____________png.png",
    "image": "/uploads/1791192126580____________png.png",
    "isTopRated": false
  },
  {
    "id": "spec-tasneem-abdelaziz",
    "name": "تسنيم عبد العزيز",
    "nameEn": "Tasneem Abdelaziz",
    "role": "أخصائية تحليل السلوك التطبيقي ABA",
    "roleEn": "Applied Behavior Analysis Specialist",
    "title": "اخصائية ABA",
    "titleEn": "ABA Specialist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "licenseNumber": "SCFHS-24-4360",
    "avatar": "/uploads/1791192139635__________________png.png",
    "fallbackAvatar": "/specialists/cards/spec_tasneem-abdelaziz.svg",
    "rating": 4.93,
    "reviewsCount": 140,
    "experienceYears": 10,
    "education": [
      "حاصلة على بكالوريوس العلوم الصحية من جامعة الرباط الوطني"
    ],
    "educationEn": [
      "Bachelor of Applied Sciences & Special Education",
      "Professional Diploma in Early Intervention & Autism Therapy"
    ],
    "certifications": [
      "حاصلة على رخصة ABAT من البورد الامريكي QABA",
      "حاصلة على دورة أسس التشخيص والعلاج للإضطرابات النفسية بمركز مطمئنة"
    ],
    "certificationsEn": [
      "SCFHS Accreditation & Licensing",
      "Certified Behavioral & Clinical Intervention Programs"
    ],
    "specialties": [
      "حاصلة على بكالوريوس العلوم الصحية من جامعة الرباط الوطني",
      "حاصلة على رخصة ABAT من البورد الامريكي QABA",
      "حاصلة على دورة أسس التشخيص والعلاج للإضطرابات النفسية بمركز مطمئنة",
      "خبرة عملية أكثر من 10 سنوات"
    ],
    "specialtiesEn": [
      "Specialized Rehabilitation",
      "Early Intervention",
      "Individual Plans"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "sessionPrice": 0,
    "bio": "أخصائية تحليل سلوك تطبيقي بخبرة سريرية تتجاوز 10 سنوات، حاصلة على بكالوريوس العلوم الصحية من جامعة الرباط الوطني ورخصة ABAT من بورد QABA الأمريكي، متخصصة في التدخل السلوكي المبكر وتأهيل الاضطرابات النمائية.",
    "bioEn": "Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.",
    "cardImage": "/uploads/1791192139635__________________png.png",
    "image": "/uploads/1791192139635__________________png.png",
    "isTopRated": false
  },
  {
    "id": "spec-jawaher-ibrahim",
    "name": "جواهر إبراهيم",
    "nameEn": "Jawaher Ibrahim",
    "role": "أخصائية نفسية وسلوكية",
    "roleEn": "Clinical Psychologist & Behavioral Therapist",
    "title": "أخصائية نفسية",
    "titleEn": "Psychologist",
    "category": "psychology",
    "department": "قسم علم النفس والإرشاد الأسري",
    "licenseNumber": "SCFHS-24-8472",
    "avatar": "/uploads/1791192158941________________png.png",
    "fallbackAvatar": "/specialists/cards/spec_jawaher-ibrahim.svg",
    "rating": 4.91,
    "reviewsCount": 110,
    "experienceYears": 3,
    "education": [
      "حاصلة على بكالوريوس علم النفس من جامعة الملك سعود"
    ],
    "educationEn": [
      "Bachelor of Applied Sciences & Special Education",
      "Professional Diploma in Early Intervention & Autism Therapy"
    ],
    "certifications": [
      "حاصلة على شهادة ABAT في تحليل السلوك التطبيقي",
      "حاصلة على دورة ABAT لمدة 40 ساعة"
    ],
    "certificationsEn": [
      "SCFHS Accreditation & Licensing",
      "Certified Behavioral & Clinical Intervention Programs"
    ],
    "specialties": [
      "حاصلة على بكالوريوس علم النفس من جامعة الملك سعود",
      "مصنفة من الهيئة السعودية للتخصصات الصحية كأخصائية نفسية",
      "حاصلة على شهادة ABAT في تحليل السلوك التطبيقي",
      "حاصلة على دورة ABAT لمدة 40 ساعة",
      "حاصلة على دورات في العلاج المعرفي السلوكي CBT",
      "خبرة عملية أكثر من 3 سنوات"
    ],
    "specialtiesEn": [
      "Specialized Rehabilitation",
      "Early Intervention",
      "Individual Plans"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "sessionPrice": 0,
    "bio": "أخصائية نفسية مصنفة من الهيئة السعودية للتخصصات الصحية وخريجة جامعة الملك سعود. تجمع بين العلاج النفسي المعرفي السلوكي CBT وتطبيقات تحليل السلوك التطبيقي ABAT لتقديم دعم نفسي وسلوكي شامل للأطفال وأسرهم.",
    "bioEn": "Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.",
    "cardImage": "/uploads/1791192158941________________png.png",
    "image": "/uploads/1791192158941________________png.png",
    "isTopRated": false
  },
  {
    "id": "spec-hossam-samy",
    "name": "حسام سامي",
    "nameEn": "Hossam Samy",
    "role": "أخصائي علاج اضطرابات النطق والتخاطب",
    "roleEn": "Speech-Language Pathologist",
    "title": "أخصائي النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "category": "speech",
    "department": "قسم النطق والتخاطب والتأهيل اللغوي",
    "licenseNumber": "SCFHS-24-3564",
    "avatar": "/uploads/1791192167745___________png.png",
    "fallbackAvatar": "/specialists/cards/spec_hossam-samy.svg",
    "rating": 4.92,
    "reviewsCount": 130,
    "experienceYears": 7,
    "education": [
      "حاصل علي بكالوريوس العلوم في التربيه الخاصه من جامعة مصر للعلوم",
      "حاصل علي دبلومة مهنية في إضطرابات التواصل من جامعة القاهرة",
      "حاصل علي دبلومه خاصه في التربية الخاصة من جامعة القاهرة"
    ],
    "educationEn": [
      "Bachelor of Applied Sciences & Special Education",
      "Professional Diploma in Early Intervention & Autism Therapy"
    ],
    "certifications": [],
    "certificationsEn": [
      "SCFHS Accreditation & Licensing",
      "Certified Behavioral & Clinical Intervention Programs"
    ],
    "specialties": [
      "حاصل علي بكالوريوس العلوم في التربيه الخاصه من جامعة مصر للعلوم",
      "حاصل علي دبلومة مهنية في إضطرابات التواصل من جامعة القاهرة",
      "حاصل علي دبلومه خاصه في التربية الخاصة من جامعة القاهرة",
      "خبرة عملية أكثر من 7 سنوات"
    ],
    "specialtiesEn": [
      "Specialized Rehabilitation",
      "Early Intervention",
      "Individual Plans"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "sessionPrice": 0,
    "bio": "أخصائي نطق وتخاطب بخبرة تفوق 7 سنوات في علاج اضطرابات التواصل واللغة وتأخر النطق واضطرابات مخارج الحروف، حاصل على دبلومات تخصصية من جامعة القاهرة وبكالوريوس تربية خاصة.",
    "bioEn": "Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.",
    "cardImage": "/uploads/1791192167745___________png.png",
    "image": "/uploads/1791192167745___________png.png",
    "isTopRated": false
  },
  {
    "id": "spec-khaled-alharbi",
    "name": "خالد الحربي",
    "nameEn": "Khaled Al-Harbi",
    "role": "أخصائي تحليل السلوك التطبيقي ABA",
    "roleEn": "Applied Behavior Analysis Specialist",
    "title": "أخصائي ABA",
    "titleEn": "ABA Specialist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "licenseNumber": "SCFHS-24-8418",
    "avatar": "/uploads/1791192175779_____________png.png",
    "fallbackAvatar": "/specialists/cards/spec_khaled-alharbi.svg",
    "rating": 4.89,
    "reviewsCount": 85,
    "experienceYears": 2,
    "education": [
      "حاصل على بكالوريوس علم النفس الإكلينيكي من جامعة الملك سعود"
    ],
    "educationEn": [
      "Bachelor of Applied Sciences & Special Education",
      "Professional Diploma in Early Intervention & Autism Therapy"
    ],
    "certifications": [
      "حاصل على رخصة ABAT فني تحليل سلوك تطبيقي",
      "حاصل على رخصة اخصائي نفسي مساعد من هيئة التخصصات الصحية"
    ],
    "certificationsEn": [
      "SCFHS Accreditation & Licensing",
      "Certified Behavioral & Clinical Intervention Programs"
    ],
    "specialties": [
      "حاصل على بكالوريوس علم النفس الإكلينيكي من جامعة الملك سعود",
      "حاصل على رخصة ABAT فني تحليل سلوك تطبيقي",
      "حاصل على رخصة اخصائي نفسي مساعد من هيئة التخصصات الصحية",
      "خبرة عملية أكثر من سنتين"
    ],
    "specialtiesEn": [
      "Specialized Rehabilitation",
      "Early Intervention",
      "Individual Plans"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "sessionPrice": 0,
    "bio": "أخصائي تحليل سلوك تطبيقي ونفسي إكلينيكي مساعد مصنف من هيئة التخصصات الصحية وخريج جامعة الملك سعود. متخصص في تنفيذ البرامج السلوكية الفردية وتنمية مهارات التفاعل الاجتماعي والتواصل.",
    "bioEn": "Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.",
    "cardImage": "/uploads/1791192175779_____________png.png",
    "image": "/uploads/1791192175779_____________png.png",
    "isTopRated": false
  },
  {
    "id": "spec-reema-alhusseini",
    "name": "ريمه الحسيني",
    "nameEn": "Reema Al-Husseini",
    "role": "أخصائية نفسية ومشرف توحد ممارس",
    "roleEn": "Psychologist & Qualified Autism Services Practitioner",
    "title": "أخصائية نفسية",
    "titleEn": "Psychologist & QASP-S",
    "category": "psychology",
    "department": "قسم علم النفس والإرشاد الأسري",
    "licenseNumber": "SCFHS-24-4834",
    "avatar": "/uploads/1791192184198______________png.png",
    "fallbackAvatar": "/specialists/cards/spec_reema-alhusseini.svg",
    "rating": 4.95,
    "reviewsCount": 175,
    "experienceYears": 10,
    "education": [
      "حاصلة على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الإسلامية"
    ],
    "educationEn": [
      "Bachelor of Applied Sciences & Special Education",
      "Professional Diploma in Early Intervention & Autism Therapy"
    ],
    "certifications": [
      "حاصلة على شهادة مشرف توحد ممارس QASP-S من منظمة QABA",
      "حاصلة على تصنيف مهني من الهيئة السعودية للتخصصات الصحية"
    ],
    "certificationsEn": [
      "SCFHS Accreditation & Licensing",
      "Certified Behavioral & Clinical Intervention Programs"
    ],
    "specialties": [
      "حاصلة على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الإسلامية",
      "حاصلة على شهادة مشرف توحد ممارس QASP-S من منظمة QABA",
      "حاصلة على تصنيف مهني من الهيئة السعودية للتخصصات الصحية",
      "خبرة أكثر من 10 سنوات"
    ],
    "specialtiesEn": [
      "Specialized Rehabilitation",
      "Early Intervention",
      "Individual Plans"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "sessionPrice": 0,
    "bio": "أخصائية نفسية ومشرف توحد ممارس معتمد دولياً QASP-S بخبرة تتجاوز 10 أعوام في التقييم النفسي والتشخيص الإكلينيكي والإشراف على برامج التدخل التخصصية لأطفال التوحد.",
    "bioEn": "Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.",
    "cardImage": "/uploads/1791192184198______________png.png",
    "image": "/uploads/1791192184198______________png.png",
    "isTopRated": false
  },
  {
    "id": "spec-sultan-alshaye",
    "name": "سلطان الشايع",
    "nameEn": "Sultan Al-Shaye",
    "role": "أخصائي العلاج الوظيفي والتكامل الحسي",
    "roleEn": "Occupational Therapist & Sensory Integration",
    "title": "أخصائي العلاج الوظيفي",
    "titleEn": "Occupational Therapist",
    "category": "occupational",
    "department": "قسم العلاج الوظيفي والتكامل الحسي",
    "licenseNumber": "SCFHS-24-5711",
    "avatar": "/uploads/1791192194710______________png.png",
    "fallbackAvatar": "/specialists/cards/spec_sultan-alshaye.svg",
    "rating": 4.9,
    "reviewsCount": 105,
    "experienceYears": 3,
    "education": [
      "حاصل على بكالوريوس العلوم التطبيقيه من جامعة الملك سعود تخصص علاج وظيفي"
    ],
    "educationEn": [
      "Bachelor of Applied Sciences & Special Education",
      "Professional Diploma in Early Intervention & Autism Therapy"
    ],
    "certifications": [],
    "certificationsEn": [
      "SCFHS Accreditation & Licensing",
      "Certified Behavioral & Clinical Intervention Programs"
    ],
    "specialties": [
      "حاصل على بكالوريوس العلوم التطبيقيه من جامعة الملك سعود تخصص علاج وظيفي",
      "خبرة أكثر من 3 سنوات"
    ],
    "specialtiesEn": [
      "Specialized Rehabilitation",
      "Early Intervention",
      "Individual Plans"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "sessionPrice": 0,
    "bio": "أخصائي علاج وظيفي متخرج من جامعة الملك سعود، متخصص في تطوير المهارات الحركية الدقيقة والتكامل الحسي ومساعدة الأطفال ذوي التحديات النمائية على تحقيق الاستقلالية اليومية.",
    "bioEn": "Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.",
    "cardImage": "/uploads/1791192194710______________png.png",
    "image": "/uploads/1791192194710______________png.png",
    "isTopRated": false
  },
  {
    "id": "spec-shaimaa-adel",
    "name": "شيماء عادل",
    "nameEn": "Shaimaa Adel",
    "role": "أخصائية أولى نطق وتخاطب ومشرف توحد معتمد",
    "roleEn": "Senior Speech Pathologist & Autism Supervisor",
    "title": "أخصائية النطق والتخاطب",
    "titleEn": "Senior Speech Pathologist & QASP-S",
    "category": "speech",
    "department": "قسم النطق والتخاطب والتأهيل اللغوي",
    "licenseNumber": "SCFHS-24-9265",
    "avatar": "/uploads/1791192202894____________png.png",
    "fallbackAvatar": "/specialists/cards/spec_shaimaa-adel.svg",
    "rating": 4.97,
    "reviewsCount": 210,
    "experienceYears": 18,
    "education": [
      "حاصلة على درجة البكالوريوس من جامعة الإسكندرية"
    ],
    "educationEn": [
      "Bachelor of Applied Sciences & Special Education",
      "Professional Diploma in Early Intervention & Autism Therapy"
    ],
    "certifications": [
      "حاصلة على الرخصة المهنية في النطق والتخاطب من هيئة التقويم والقياس",
      "حاصلة على رخصة مشرف توحد سلوكي معتمد دولياً QASP-S"
    ],
    "certificationsEn": [
      "SCFHS Accreditation & Licensing",
      "Certified Behavioral & Clinical Intervention Programs"
    ],
    "specialties": [
      "حاصلة على درجة البكالوريوس من جامعة الإسكندرية",
      "حاصلة على دراسات عليا علوم إعاقة مسار اضطرابات نطق وتخاطب من جامعة الزقازيق",
      "حاصلة على الرخصة المهنية في النطق والتخاطب من هيئة التقويم والقياس",
      "حاصلة على رخصة مشرف توحد سلوكي معتمد دولياً QASP-S",
      "خبرة عملية أكثر من 18 سنة"
    ],
    "specialtiesEn": [
      "Specialized Rehabilitation",
      "Early Intervention",
      "Individual Plans"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "sessionPrice": 0,
    "bio": "أخصائية أولى في علاج اضطرابات النطق والتخاطب ومشرف توحد سلوكي معتمد دولياً QASP-S بخبرة عريقة تفوق 18 عاماً في بناء البرامج اللغوية وتأهيل اضطرابات الكلام لدى أطفال التوحد.",
    "bioEn": "Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.",
    "cardImage": "/uploads/1791192202894____________png.png",
    "image": "/uploads/1791192202894____________png.png",
    "isTopRated": false
  },
  {
    "id": "spec-abdelilah-shakl",
    "name": "عبدالاله شقل",
    "nameEn": "Abdelilah Shakl",
    "role": "أخصائي العلاج الوظيفي والتكامل الحسي",
    "roleEn": "Occupational Therapist & Sensory Integration",
    "title": "أخصائي العلاج الوظيفي",
    "titleEn": "Occupational Therapist",
    "category": "occupational",
    "department": "قسم العلاج الوظيفي والتكامل الحسي",
    "licenseNumber": "SCFHS-24-7390",
    "avatar": "/uploads/1791192213481______________png.png",
    "fallbackAvatar": "/specialists/cards/spec_abdelilah-shakl.svg",
    "rating": 4.92,
    "reviewsCount": 115,
    "experienceYears": 3,
    "education": [
      "حاصل على بكالوريوس العلاج الوظيفي من جامعة الملك سعود بن عبدالعزيز للعلوم الصحية"
    ],
    "educationEn": [
      "Bachelor of Applied Sciences & Special Education",
      "Professional Diploma in Early Intervention & Autism Therapy"
    ],
    "certifications": [
      "حاصل على شهادة Floortime 101",
      "حاصل على ترخيص الهيئة السعودية للتخصصات الصحية"
    ],
    "certificationsEn": [
      "SCFHS Accreditation & Licensing",
      "Certified Behavioral & Clinical Intervention Programs"
    ],
    "specialties": [
      "حاصل على بكالوريوس العلاج الوظيفي من جامعة الملك سعود بن عبدالعزيز للعلوم الصحية",
      "حاصل على شهادة Floortime 101",
      "حاصل على ترخيص الهيئة السعودية للتخصصات الصحية",
      "متخصص في علاج المشاكل الحسية والتحديات النمائية لدى الاطفال ومشاكل الأكل",
      "خبرة عملية أكثر من 3 سنوات"
    ],
    "specialtiesEn": [
      "Specialized Rehabilitation",
      "Early Intervention",
      "Individual Plans"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "sessionPrice": 0,
    "bio": "أخصائي علاج وظيفي مرخص من هيئة التخصصات الصحية وحاصل على اعتماد Floortime 101. متخصص في التحديات الحسية النمائية، وتأهيل المهارات الحركية، وعلاج صعوبات ومشاكل التغذية والأكل لدى الأطفال.",
    "bioEn": "Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.",
    "cardImage": "/uploads/1791192213481______________png.png",
    "image": "/uploads/1791192213481______________png.png",
    "isTopRated": false
  },
  {
    "id": "spec-alaa-eldin-nagy",
    "name": "علاء الدين ناجي",
    "nameEn": "Alaa El-Din Nagy",
    "role": "أخصائي تحليل السلوك التطبيقي ABA",
    "roleEn": "Applied Behavior Analysis Specialist",
    "title": "أخصائي ABA",
    "titleEn": "ABA Specialist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "licenseNumber": "SCFHS-24-8260",
    "avatar": "/uploads/1791192231188_________________png.png",
    "fallbackAvatar": "/specialists/cards/spec_alaa-eldin-nagy.svg",
    "rating": 4.94,
    "reviewsCount": 155,
    "experienceYears": 8,
    "education": [
      "حاصل على ليسانس آداب وتربية قسم تربية خاصة من جامعة العريش",
      "حاصل على دبلومة مهنية في التربية الخاصة من جامعة العريش"
    ],
    "educationEn": [
      "Bachelor of Applied Sciences & Special Education",
      "Professional Diploma in Early Intervention & Autism Therapy"
    ],
    "certifications": [
      "حاصل على إعتماد البورد الأمريكي ABAT"
    ],
    "certificationsEn": [
      "SCFHS Accreditation & Licensing",
      "Certified Behavioral & Clinical Intervention Programs"
    ],
    "specialties": [
      "حاصل على ليسانس آداب وتربية قسم تربية خاصة من جامعة العريش",
      "حاصل على دبلومة مهنية في التربية الخاصة من جامعة العريش",
      "حاصل على إعتماد البورد الأمريكي ABAT",
      "خبرة عملية أكثر من 8 سنوات"
    ],
    "specialtiesEn": [
      "Specialized Rehabilitation",
      "Early Intervention",
      "Individual Plans"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "sessionPrice": 0,
    "bio": "أخصائي تحليل سلوك تطبيقي معتمد ABAT بخبرة سريرية تتجاوز 8 سنوات في مراكز التأهيل المتخصصة، خبير في تطبيق برامج تعديل السلوك وتنمية مهارات التواصل الوظيفي والاستقلالية.",
    "bioEn": "Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.",
    "cardImage": "/uploads/1791192231188_________________png.png",
    "image": "/uploads/1791192231188_________________png.png",
    "isTopRated": false
  },
  {
    "id": "spec-ghalib-alotaibi",
    "name": "غالب العتيبي",
    "nameEn": "Ghalib Al-Otaibi",
    "role": "أخصائي تحليل السلوك التطبيقي ABA",
    "roleEn": "Applied Behavior Analysis Specialist",
    "title": "أخصائي ABA",
    "titleEn": "ABA Specialist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "licenseNumber": "SCFHS-24-4055",
    "avatar": "/uploads/1791192244901______________png.png",
    "fallbackAvatar": "/specialists/cards/spec_ghalib-alotaibi.svg",
    "rating": 4.9,
    "reviewsCount": 90,
    "experienceYears": 2,
    "education": [
      "حاصل على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الاسلامية"
    ],
    "educationEn": [
      "Bachelor of Applied Sciences & Special Education",
      "Professional Diploma in Early Intervention & Autism Therapy"
    ],
    "certifications": [],
    "certificationsEn": [
      "SCFHS Accreditation & Licensing",
      "Certified Behavioral & Clinical Intervention Programs"
    ],
    "specialties": [
      "حاصل على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الاسلامية",
      "حاصل على دورات في إختبارات الذكاء للأطفال",
      "معتمد كأخصائي تحليل سلوك تطبيقي من QABA",
      "مصنف من الهيئة السعوديه للتخصصات الصحيه",
      "خبرة عملية أكثر من سنتين"
    ],
    "specialtiesEn": [
      "Specialized Rehabilitation",
      "Early Intervention",
      "Individual Plans"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "sessionPrice": 0,
    "bio": "أخصائي تحليل سلوك تطبيقي مصنف من هيئة التخصصات الصحية ومعتمد من بورد QABA، متخصص في تطبيق مقاييس الذكاء والتقييم السلوكي وتصميم البرامج التدريبية المخصصة للأطفال.",
    "bioEn": "Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.",
    "cardImage": "/uploads/1791192244901______________png.png",
    "image": "/uploads/1791192244901______________png.png",
    "isTopRated": false
  },
  {
    "id": "spec-kareem-ragab",
    "name": "كريم رجب",
    "nameEn": "Kareem Ragab",
    "role": "أخصائي علاج النطق والتخاطب وتعديل السلوك",
    "roleEn": "Speech & Language Pathologist",
    "title": "أخصائي النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "category": "speech",
    "department": "قسم النطق والتخاطب والتأهيل اللغوي",
    "licenseNumber": "SCFHS-24-9140",
    "avatar": "/uploads/1791192253778__________png.png",
    "fallbackAvatar": "/specialists/cards/spec_kareem-ragab.svg",
    "rating": 4.91,
    "reviewsCount": 100,
    "experienceYears": 3,
    "education": [
      "حاصل على بكالوريوس العلوم في التربية الخاصة من جامعة مصر للعلوم",
      "حاصل على دبلومة التخاطب لمدة عام من مركز الإشراق الطبي",
      "حاصل على دبلومة التخاطب من جامعة الأزهر"
    ],
    "educationEn": [
      "Bachelor of Applied Sciences & Special Education",
      "Professional Diploma in Early Intervention & Autism Therapy"
    ],
    "certifications": [
      "حاصل على شهادة 40 ساعة لفني تحليل السلوك التطبيقي"
    ],
    "certificationsEn": [
      "SCFHS Accreditation & Licensing",
      "Certified Behavioral & Clinical Intervention Programs"
    ],
    "specialties": [
      "حاصل على بكالوريوس العلوم في التربية الخاصة من جامعة مصر للعلوم",
      "حاصل على دبلومة التخاطب لمدة عام من مركز الإشراق الطبي",
      "حاصل على دبلومة التخاطب من جامعة الأزهر",
      "حاصل على شهادة 40 ساعة لفني تحليل السلوك التطبيقي",
      "خبرة عملية أكثر من 3 سنوات"
    ],
    "specialtiesEn": [
      "Specialized Rehabilitation",
      "Early Intervention",
      "Individual Plans"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "sessionPrice": 0,
    "bio": "أخصائي نطق وتخاطب وتربية خاصة متخصص في تأهيل الاضطرابات النطقية وتنمية مهارات التواصل اللفظي لدى أطفال التوحد مع تطبيق استراتيجيات تحليل السلوك التطبيقي.",
    "bioEn": "Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.",
    "cardImage": "/uploads/1791192253778__________png.png",
    "image": "/uploads/1791192253778__________png.png",
    "isTopRated": false
  },
  {
    "id": "spec-marwa-alsharif",
    "name": "مروة الشريف",
    "nameEn": "Marwa Al-Sharif",
    "role": "مشرفة برامج أكاديمية وتربية خاصة",
    "roleEn": "Academic Programs Supervisor",
    "title": "مشرفة أكاديمية",
    "titleEn": "Academic Supervisor",
    "category": "aba",
    "department": "قسم البرامج الأكاديمية والتربية الخاصة",
    "licenseNumber": "SCFHS-24-2625",
    "avatar": "/uploads/1791192261779_____________png.png",
    "fallbackAvatar": "/specialists/cards/spec_marwa-alsharif.svg",
    "rating": 4.93,
    "reviewsCount": 125,
    "experienceYears": 4,
    "education": [
      "حاصلة على بكالوريوس التربية الخاصة من المعهد العالي للتربية المختصة"
    ],
    "educationEn": [
      "Bachelor of Applied Sciences & Special Education",
      "Professional Diploma in Early Intervention & Autism Therapy"
    ],
    "certifications": [
      "حاصلة على دورة في التعامل مع أطفال طيف التوحد"
    ],
    "certificationsEn": [
      "SCFHS Accreditation & Licensing",
      "Certified Behavioral & Clinical Intervention Programs"
    ],
    "specialties": [
      "حاصلة على بكالوريوس التربية الخاصة من المعهد العالي للتربية المختصة",
      "حاصلة على دورة في التعامل مع أطفال طيف التوحد",
      "خبرة عملية أكثر من 4 سنوات"
    ],
    "specialtiesEn": [
      "Specialized Rehabilitation",
      "Early Intervention",
      "Individual Plans"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "sessionPrice": 0,
    "bio": "مشرفة البرامج الأكاديمية والتربية الخاصة بمراكز رابا، خبيرة في تصميم الخطط التعليمية الفردية وتأهيل مهارات ما قبل الأكاديمية والدمج المدرسي الشامل لذوي الإعاقة.",
    "bioEn": "Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.",
    "cardImage": "/uploads/1791192261779_____________png.png",
    "image": "/uploads/1791192261779_____________png.png",
    "isTopRated": false
  },
  {
    "id": "spec-mostafa-mahmoud",
    "name": "مصطفى محمود",
    "nameEn": "Mostafa Mahmoud",
    "role": "أخصائي تحليل السلوك التطبيقي ومشرف توحد معتمد",
    "roleEn": "Applied Behavior Analysis Specialist & QASP-S",
    "title": "أخصائي ABA",
    "titleEn": "ABA Specialist & QASP-S",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "licenseNumber": "SCFHS-24-7294",
    "avatar": "/uploads/1791192271638_____________png.png",
    "fallbackAvatar": "/specialists/cards/spec_mostafa-mahmoud.svg",
    "rating": 4.93,
    "reviewsCount": 135,
    "experienceYears": 4,
    "education": [
      "حاصل علي درجة الـ ليسانس من جامعة أسيوط"
    ],
    "educationEn": [
      "Bachelor of Applied Sciences & Special Education",
      "Professional Diploma in Early Intervention & Autism Therapy"
    ],
    "certifications": [
      "حاصل علي اعتماد ABAT من البورد الأمريكي كفني تحليل سلوك تطبيقي",
      "حاصل على اعتماد QASP-S كمشرف خدمات توحد معتمد من البورد الأمريكي"
    ],
    "certificationsEn": [
      "SCFHS Accreditation & Licensing",
      "Certified Behavioral & Clinical Intervention Programs"
    ],
    "specialties": [
      "حاصل علي درجة الـ ليسانس من جامعة أسيوط",
      "حاصل علي اعتماد ABAT من البورد الأمريكي كفني تحليل سلوك تطبيقي",
      "حاصل على اعتماد QASP-S كمشرف خدمات توحد معتمد من البورد الأمريكي",
      "حاصل على برنامج تقييم معالم تطور السلوك اللفظي VB-MAPP",
      "خبرة عملية أكثر من 4 سنوات"
    ],
    "specialtiesEn": [
      "Specialized Rehabilitation",
      "Early Intervention",
      "Individual Plans"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "sessionPrice": 0,
    "bio": "أخصائي تحليل سلوك تطبيقي ومشرف خدمات توحد معتمد دولياً QASP-S و ABAT، متخصص في تطبيق مقياس VB-MAPP وبناء الخطط التأهيلية الفردية المبنية على تحليل السلوك اللفظي.",
    "bioEn": "Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.",
    "cardImage": "/uploads/1791192271638_____________png.png",
    "image": "/uploads/1791192271638_____________png.png",
    "isTopRated": false
  },
  {
    "id": "spec-mayar-alsaeed",
    "name": "ميار السعيد",
    "nameEn": "Mayar Al-Saeed",
    "role": "أخصائية علاج اضطرابات النطق واللغة",
    "roleEn": "Speech & Language Pathologist",
    "title": "أخصائية النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "category": "speech",
    "department": "قسم النطق والتخاطب والتأهيل اللغوي",
    "licenseNumber": "SCFHS-24-1530",
    "avatar": "/uploads/1791192282250_____________png.png",
    "fallbackAvatar": "/specialists/cards/spec_mayar-alsaeed.svg",
    "rating": 4.92,
    "reviewsCount": 130,
    "experienceYears": 7,
    "education": [
      "حاصلة على بكالوريوس التربيه الخاصه تخصص إعاقة عقلية من جامعة الإمام محمد بن سعود"
    ],
    "educationEn": [
      "Bachelor of Applied Sciences & Special Education",
      "Professional Diploma in Early Intervention & Autism Therapy"
    ],
    "certifications": [],
    "certificationsEn": [
      "SCFHS Accreditation & Licensing",
      "Certified Behavioral & Clinical Intervention Programs"
    ],
    "specialties": [
      "حاصلة على بكالوريوس التربيه الخاصه تخصص إعاقة عقلية من جامعة الإمام محمد بن سعود",
      "حاصلة على دوره نطق وتخاطب 70 ساعه من أكاديمية علم النفس تحت اشراف وزاره التعليم",
      "خبرة عملية أكثر من 7 سنوات"
    ],
    "specialtiesEn": [
      "Specialized Rehabilitation",
      "Early Intervention",
      "Individual Plans"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "sessionPrice": 0,
    "bio": "أخصائية نطق وتخاطب وتربية خاصة بخبرة تتجاوز 7 سنوات في تقييم وتأهيل اضطرابات اللغة والكلام لدى الأطفال، متخصصة في تأهيل حالات التأخر اللغوي ومتلازمة داون وطيف التوحد.",
    "bioEn": "Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.",
    "cardImage": "/uploads/1791192282250_____________png.png",
    "image": "/uploads/1791192282250_____________png.png",
    "isTopRated": false
  },
  {
    "id": "spec-hala-badran",
    "name": "هالة بدران",
    "nameEn": "Hala Badran",
    "role": "أخصائية أولى نطق وتخاطب وعلم نفس إكلينيكي",
    "roleEn": "Senior Speech Pathologist & Clinical Psychologist",
    "title": "أخصائية النطق والتخاطب",
    "titleEn": "Senior Speech & Clinical Psychologist",
    "category": "speech",
    "department": "قسم النطق والتخاطب والتأهيل اللغوي",
    "licenseNumber": "SCFHS-24-5379",
    "avatar": "/uploads/1791192291320____________png.png",
    "fallbackAvatar": "/specialists/cards/spec_hala-badran.svg",
    "rating": 4.98,
    "reviewsCount": 260,
    "experienceYears": 20,
    "education": [
      "حاصلة علي ليسانس آداب علم النفس من جامعة الزقازيق",
      "حاصله علي ماجستير في التوحد من جامعة الزقازيق",
      "حاصلة علي دبلومة مهنية تخصص نطق وتواصل من جامعة عين شمس",
      "حاصلة علي دبلومة تدريبية في النطق والتخاطب من جامعة عين شمس",
      "حاصلة علي دبلومة في علم النفس الإكلينيكي من جامعة بنها"
    ],
    "educationEn": [
      "Bachelor of Applied Sciences & Special Education",
      "Professional Diploma in Early Intervention & Autism Therapy"
    ],
    "certifications": [],
    "certificationsEn": [
      "SCFHS Accreditation & Licensing",
      "Certified Behavioral & Clinical Intervention Programs"
    ],
    "specialties": [
      "حاصلة علي ليسانس آداب علم النفس من جامعة الزقازيق",
      "حاصله علي ماجستير في التوحد من جامعة الزقازيق",
      "حاصلة علي دبلومة مهنية تخصص نطق وتواصل من جامعة عين شمس",
      "حاصلة علي دبلومة تدريبية في النطق والتخاطب من جامعة عين شمس",
      "حاصلة علي دبلومة في علم النفس الإكلينيكي من جامعة بنها",
      "خبرة عملية أكثر من 20 سنة"
    ],
    "specialtiesEn": [
      "Specialized Rehabilitation",
      "Early Intervention",
      "Individual Plans"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "sessionPrice": 0,
    "bio": "استشارية وأخصائية أولى في النطق والتخاطب والتوحد بخبرة تزيد عن 20 عاماً، حاصلة على الماجستير في التوحد ودبلومات عليا في النطق والتواصل وعلم النفس الإكلينيكي من جامعات الزقازيق وعين شمس وبنها.",
    "bioEn": "Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.",
    "cardImage": "/uploads/1791192291320____________png.png",
    "image": "/uploads/1791192291320____________png.png",
    "isTopRated": false
  },
  {
    "id": "spec-hind-elsayed",
    "name": "هند السيد",
    "nameEn": "Hind El-Sayed",
    "role": "أخصائية علاج النطق والتخاطب وتأهيل التوحد",
    "roleEn": "Speech & Language Pathologist",
    "title": "أخصائية النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "category": "speech",
    "department": "قسم النطق والتخاطب والتأهيل اللغوي",
    "licenseNumber": "SCFHS-24-8020",
    "avatar": "/uploads/1791192301426___________png.png",
    "fallbackAvatar": "/specialists/cards/spec_hind-elsayed.svg",
    "rating": 4.94,
    "reviewsCount": 165,
    "experienceYears": 12,
    "education": [
      "حاصله على درجة البكالوريوس من جامعة القاهرة",
      "حاصله على دبلوم عام تربوي من جامعة طنطا",
      "حاصلة على دبلومة تخاطب 300 ساعة من جامعة عين شمس",
      "حاصله على دبلومة فى التوحد من جامعة عين شمس",
      "حاصله على دبلومة صعوبات تعلم مع د/لبنى الشرقاوى"
    ],
    "educationEn": [
      "Bachelor of Applied Sciences & Special Education",
      "Professional Diploma in Early Intervention & Autism Therapy"
    ],
    "certifications": [],
    "certificationsEn": [
      "SCFHS Accreditation & Licensing",
      "Certified Behavioral & Clinical Intervention Programs"
    ],
    "specialties": [
      "حاصله على درجة البكالوريوس من جامعة القاهرة",
      "حاصله على دبلوم عام تربوي من جامعة طنطا",
      "حاصلة على دبلومة تخاطب 300 ساعة من جامعة عين شمس",
      "حاصله على دبلومة فى التوحد من جامعة عين شمس",
      "حاصله على دبلومة صعوبات تعلم مع د/لبنى الشرقاوى",
      "خبرة عملية أكثر من 12 سنة"
    ],
    "specialtiesEn": [
      "Specialized Rehabilitation",
      "Early Intervention",
      "Individual Plans"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "sessionPrice": 0,
    "bio": "أخصائية نطق وتخاطب بخبرة سريرية تتجاوز 12 عاماً في علاج اضطرابات النطق والكلام وتأهيل الأطفال ذوي طيف التوحد وصعوبات التعلم، حاصلة على دبلومات تخصصية من جامعتي القاهرة وعين شمس.",
    "bioEn": "Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.",
    "cardImage": "/uploads/1791192301426___________png.png",
    "image": "/uploads/1791192301426___________png.png",
    "isTopRated": false
  },
  {
    "id": "spec-haitham-alzaidan",
    "name": "هيثم الزيدان",
    "nameEn": "Haitham Al-Zaidan",
    "role": "أخصائي تحليل السلوك التطبيقي ABA",
    "roleEn": "Applied Behavior Analysis Specialist",
    "title": "أخصائي ABA",
    "titleEn": "ABA Specialist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "licenseNumber": "SCFHS-24-7603",
    "avatar": "/uploads/1791192310187______________png.png",
    "fallbackAvatar": "/specialists/cards/spec_haitham-alzaidan.svg",
    "rating": 4.88,
    "reviewsCount": 75,
    "experienceYears": 2,
    "education": [
      "حاصل على بكالوريوس علم النفس من جامعه الإمام محمد بن سعود الاسلامية"
    ],
    "educationEn": [
      "Bachelor of Applied Sciences & Special Education",
      "Professional Diploma in Early Intervention & Autism Therapy"
    ],
    "certifications": [
      "حاصل على شهادة فني تحليل سلوك تطبيقي ABAT"
    ],
    "certificationsEn": [
      "SCFHS Accreditation & Licensing",
      "Certified Behavioral & Clinical Intervention Programs"
    ],
    "specialties": [
      "حاصل على بكالوريوس علم النفس من جامعه الإمام محمد بن سعود الاسلامية",
      "حاصل على شهادة فني تحليل سلوك تطبيقي ABAT",
      "خبرة عملية أكثر من سنة"
    ],
    "specialtiesEn": [
      "Specialized Rehabilitation",
      "Early Intervention",
      "Individual Plans"
    ],
    "availableDays": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "availableDaysEn": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "sessionPrice": 0,
    "bio": "أخصائي تحليل سلوك تطبيقي معتمد ABAT وخريج جامعة الإمام محمد بن سعود، متخصص في تطبيق برامج تعديل السلوك الفردية، وتنمية مهارات التفاعل الاجتماعي والتواصل لدى الأطفال.",
    "bioEn": "Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.",
    "cardImage": "/uploads/1791192310187______________png.png",
    "image": "/uploads/1791192310187______________png.png",
    "isTopRated": false
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
    id: 'rev-naif',
    parentName: 'NAIF',
    parentNameEn: 'NAIF',
    isAnonymous: true,
    location: 'الرياض، فرع النرجس',
    locationEn: 'Riyadh, Al-Narjis Branch',
    category: 'aba',
    categoryEn: 'ABA & Speech Therapy',
    treatedBy: 'أخصائي الـ ABA غالب & أخصائية التخاطب شيماء',
    treatedByEn: 'ABA Specialist Ghalib & Speech Specialist Shaimaa',
    childIssue: 'تأهيل سلوكي وتطوير النطق والتواصل',
    childIssueEn: 'Behavioral rehabilitation & speech communication',
    rating: 5,
    comment: 'اللهم لك الحمد وللأمانه كانت تجربتي مع المركز ممتازه ولاحظت تحسن واضح وملحوظ على طفلي وهذا بفضل الله ثم بفضل اهتمام وجهود فريق العمل في المركز .\nومن لايشكر الناس لايشكر الله لذلك شكر خاص جدا لأخصائي الــ ABA و الرائع غالب وأخصائية التخاطب الرائعة شيماء على اهتمامهم الكبير بطفلي و كذلك تعاملهم الراقي وحرصهم والاهتمام بكل التفاصيل.\nو كذلك أشكر الأخت غادة في الاستقبال و لا أنسى المشرفة وجميع العاملين في المركز الله يوفقكم ويجزاكم خير\n\nفرع النرجس',
    commentEn: 'Praise be to God, honestly my experience with the center was excellent and I noticed clear and remarkable progress in my child, thanks to God and the dedicated team. Special thanks to the wonderful ABA therapist Ghalib and speech therapist Shaimaa for their great care, respect, and meticulous attention to all details. Also special thanks to sister Ghada at reception, the supervisor, and all team members. May Allah bless you all.\n\nAl-Narjis Branch',
    specialistName: 'الأخصائي غالب & الأخصائية شيماء',
    specialistNameEn: 'Specialist Ghalib & Shaimaa',
    date: 'منذ أسبوعين',
    dateEn: '2 weeks ago',
    improvementDuration: 'تحسن واضح وملحوظ',
    improvementDurationEn: 'Clear and noticeable improvement',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-amr',
    parentName: 'Amr Hasanopen',
    parentNameEn: 'Amr Hasanopen',
    isAnonymous: true,
    location: 'الرياض، فرع النرجس',
    locationEn: 'Riyadh, Al-Narjis Branch',
    category: 'speech',
    categoryEn: 'Speech & Behavior Therapy',
    treatedBy: 'د. أحمد أبو زيد والفريق المعالج',
    treatedByEn: 'Dr. Ahmed Abouzeid & Clinical Team',
    childIssue: 'تأخر النطق والكلام وتعديل السلوك',
    childIssueEn: 'Speech delay & behavior modification',
    rating: 5,
    comment: 'ما شاء الله تبارك الله من اروع المراكز\nوالحمد لله ابني بدأ يتكلم على أيديهم\nفريق كامل ورائع\nبداية من د. أحمد أبو زيد وباقي الفريق المعالج من تعديل السلوك والتخاطب والعلاج الوظيفي\nوانصح بهذا المركز لما فيه النفع\n\nفرع النرجس',
    commentEn: 'Mashallah, truly one of the most wonderful centers. Praise be to God, my son began speaking through their hands. A complete and outstanding team, starting from Dr. Ahmed Abouzeid and the treating therapists in behavior modification, speech, and occupational therapy. Highly recommended.\n\nAl-Narjis Branch',
    specialistName: 'د. أحمد أبو زيد',
    specialistNameEn: 'Dr. Ahmed Abouzeid',
    date: 'منذ 3 أسابيع',
    dateEn: '3 weeks ago',
    improvementDuration: 'بدأ الطفل في الكلام',
    improvementDurationEn: 'Child started speaking',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-amin-omabdulaziz',
    parentName: 'Amin Alahmadi (أم عبدالعزيز)',
    parentNameEn: 'Amin Alahmadi (Um Abdulaziz)',
    isAnonymous: true,
    location: 'الرياض، فرع النرجس',
    locationEn: 'Riyadh, Al-Narjis Branch',
    category: 'aba',
    categoryEn: 'ABA & Behavior Modification',
    treatedBy: 'الأخصائية تسنيم والمشرفة فاطمة',
    treatedByEn: 'Specialist Tasneem & Supervisor Fatima',
    childIssue: 'تأهيل سلوكي وتكامل حسي وتطور نمائي',
    childIssueEn: 'Behavioral rehabilitation & developmental progress',
    rating: 5,
    comment: 'انا ام عبدالعزيز 🩵\nمن قلبي حابه اشكر الاخصائية تسنيم على كل اللي قدمته لعزوز ممتنه لكي على صبرك و عطائك ، ممتنه لكل شهر لكل يوم لكل ساعة تعلم فيها منك عزوز ، ممتنه لكل وقت و جهد بذلتيه معاه ، ممتنه للحب اللي قدمتيه له و لأهتمامك و حسن تعاملك و خبرتك العالية تركتي اثر كبير في تطوره وتحسنه .\nسبق و قلت لك انتي ( ضالتي اللي كنت بدور عليها ) ولكن أومن ان الله سخرك لنا في الوقت المناسب .\n\nشكرا لأمومتك اللي ساعدتني كنتي مصدر دعم و طمأنينة واحتواء لنا كعائلة ، انتي انسانة مخلصه تسمعي للأم و تفهميها بدون ماتتذمري ، اسأل الله ان يبارك لك في علمك و عملك ، وأن يجعل كل ما قدمتيه في ميزان حسناتك وان يرزقك من الخير اضعاف ماقدمتيه .\n\nانا و عزوز نشكرك من أعماق قلوبنا 🩵\n\nو أحب أشكر المشرفة فاطمة على كل الجهد اللي بذلتيه مع عبدالعزيز ، كنتي دائما مهتمة و حريصه على متابعته و وضع الأهداف والخطة المناسبة له و تحقيقها وكان واضح اهتمامك وحرصك على تطوره خطوة بخطوة ، أقدر جدا متابعتك وتوجيهاتك واهتمامك بكل التفاصيل، لأن اثر اهتمامك واضح في تقدم عبدالعزيز ، وجود مشرفة تهتم بعملها بهذا الإخلاص ويكون هدفها مصلحة الطفل شيء يطمن الأهل ،\nشكرا لك على عطائك، وعلى احترافيتك، وعلى كل ما قدمتيه لعبدالعزيز ولنا كعائلة ، أسأل الله أن يكتب لك الأجر ويوفقك دائما، ويجعل كل ما تقدمينه في ميزان حسناتك .\nانا و عزوز ممتنين لكي 🩵\nوفي النهاية بشكر مريم ألطف انسانة على تعاملها الراقي و استقبالها لنا بأبتسامة جميلة و اشكر غادة على تعاملها الرائع و ما انسى اشكر حياة و سعيدة الله يعطيكم العافية على ماتقدموه للمركز 💕',
    commentEn: 'From the bottom of my heart I thank specialist Tasneem for everything she gave Abdulaziz. Thank you for your patience, dedication, love, and high expertise that made a huge impact on his progress. You were a source of support, comfort, and embrace for our family. And I thank supervisor Fatima for setting precise goals and her step-by-step guidance. Also thanks to Maryam, Ghada, Hayat, and Saida for their wonderful reception and warmth.',
    specialistName: 'الأخصائية تسنيم & المشرفة فاطمة',
    specialistNameEn: 'Specialist Tasneem & Supervisor Fatima',
    date: 'منذ 5 أسابيع',
    dateEn: '5 weeks ago',
    improvementDuration: 'تطور ملحوظ واحتواء عائلي كامل',
    improvementDurationEn: 'Remarkable progress & total family support',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-om-mohammed',
    parentName: 'ام محمد',
    parentNameEn: 'Om Mohammed',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'aba',
    categoryEn: 'ABA Therapy & School Readiness',
    treatedBy: 'الأخصائية ضحى & الأخصائيين محمد عاطف وأحمد',
    treatedByEn: 'Specialist Dhuha, Mohamed Atef & Ahmed',
    childIssue: 'تأهيل شامل وتحسن بنسبة 80% خلال 5 أشهر',
    childIssueEn: 'Comprehensive rehabilitation with 80% improvement in 5 months',
    rating: 5,
    comment: 'مركز ممتاز جدًا، نظيف ومرتب كأنه مدرسة ما شاء الله.\nأشكر الأخصائية ضحى على جهودها الرائعة، وأسأل الله أن يسعدها في الدنيا والآخرة، وكذلك الأخصائيين محمد عاطف وأحمد على صبرهم وتعاونهم\nخلال خمسة أشهر فقط تحسّن ابني بنسبة 80% ولله الحمد\n\nكما أخص بالشكر موظفة الاستقبال على تعاونها وأخلاقها العالية، الله يسعدها ❤️',
    commentEn: 'Excellent center, clean and orderly like a school mashallah. I thank specialist Dhuha for her wonderful efforts, and specialists Mohamed Atef and Ahmed for their patience and cooperation. In just five months my son improved by 80% praise be to God.',
    specialistName: 'الأخصائية ضحى & أ. محمد عاطف & أ. أحمد',
    specialistNameEn: 'Specialists Dhuha, Mohamed Atef & Ahmed',
    date: 'منذ سنة',
    dateEn: 'a year ago',
    improvementDuration: 'تحسن بنسبة 80% خلال 5 أشهر',
    improvementDurationEn: '80% improvement in 5 months',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-budoor-ibraheem',
    parentName: 'Budoor Ibraheem',
    parentNameEn: 'Budoor Ibraheem',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'speech',
    categoryEn: 'Speech & Language Development',
    treatedBy: 'فريق التخاطب والتواصل',
    treatedByEn: 'Speech & Communication Team',
    childIssue: 'تأخر النطق والتعبير اللفظي',
    childIssueEn: 'Non-verbal to verbal expression progress',
    rating: 5,
    comment: 'تحديث تقييمي بعد تجربة حوالي 5 شهور\nالمركز غير طفلي تغيير رائع جدا\nابراهيم كان لايستخدم الكلام ك تعبير وغير ناطق تقريبا\nبعد 5 شهور صار يطلب لفظيا ايش يحتاج ، وصار يحاول يعبر ..',
    commentEn: 'Updating my review after 5 months of experience. The center transformed my child wonderfully. Ibrahim was practically non-verbal, now after 5 months he verbally asks for what he needs and expresses himself.',
    specialistName: 'فريق التخاطب وعيادات النطق',
    specialistNameEn: 'Speech & Language Team',
    date: 'منذ سنة',
    dateEn: 'a year ago',
    improvementDuration: 'بدأ يطلب لفظياً ويعبّر',
    improvementDurationEn: 'Started verbally requesting & expressing',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-mohammed-alomary',
    parentName: 'Mohammed Alomary',
    parentNameEn: 'Mohammed Alomary',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'aba',
    categoryEn: 'ABA & Intensive Sessions',
    treatedBy: 'الأخصائية حشمه & الأخصائية فوز العتيبي',
    treatedByEn: 'Specialist Heshmah & Specialist Fowz Al-Otaibi',
    childIssue: 'برنامج مكثف 60 جلسة تأهيلية متكاملة',
    childIssueEn: '60 intensive multidisciplinary rehabilitation sessions',
    rating: 5,
    comment: 'تم التجربة مره اخرى في 60 جلسة مختلفة عن التجربة السابقة\nاهم ما يميز هذا المكان تعامل الاخصائية حشمه تحصلونها في الاستقبال وجدا جدا متعاونه وتحاول تساعد الاباء والامهات بكل شيء تقدر عليه\nواشكر الاخصائية فوز العتيبي ايضا موظفة الاستقبال على جهودها وتعاملها معانا وكانت دائما تساعدنا\nوالمركز جدا جدا منظم ومرتب وواضح الاهتمام بالمكان',
    commentEn: 'Tried them again for 60 sessions. What distinguishes this place is specialist Heshmah at reception, extraordinarily helpful to parents with everything she can, and specialist Fowz Al-Otaibi for her continuous support. Very organized and spotless center.',
    specialistName: 'الأخصائية حشمه & الأخصائية فوز العتيبي',
    specialistNameEn: 'Specialists Heshmah & Fowz Al-Otaibi',
    date: 'منذ 3 أشهر',
    dateEn: '3 months ago',
    improvementDuration: 'برنامج 60 جلسة متقدمة',
    improvementDurationEn: '60 advanced clinical sessions',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-mm-nn',
    parentName: 'mm nn',
    parentNameEn: 'mm nn',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'aba',
    categoryEn: 'ABA Applied Behavior Analysis',
    treatedBy: 'الأخصائية رهف الدغماني',
    treatedByEn: 'Specialist Rahaf Al-Dughmani',
    childIssue: 'تعديل السلوك وتطبيق أحدث بروتوكولات ABA',
    childIssueEn: 'Behavior modification with latest ABA protocols',
    rating: 5,
    comment: 'صراحة مركز رابا من أفضل المراكز اللي تعاملنا معها، مركز متميز وذو خبرة عالية في مجال ABA.\nأشكر الأخصائية رهف الدغماني على أسلوبها الراقي واحترافيتها العالية الشكر قليل بحقها ومافي كلام يوصف خبرتها مع ABA\nوكذلك طاقم الاستقبال قمة في الاحترام والتعاون وكلمه راقين قليله فيهم ✨..',
    commentEn: 'Honestly RABA center is one of the best centers we ever worked with, distinguished and highly experienced in ABA. I thank specialist Rahaf Al-Dughmani for her high class approach and exceptional expertise in ABA.',
    specialistName: 'الأخصائية رهف الدغماني',
    specialistNameEn: 'Specialist Rahaf Al-Dughmani',
    date: 'منذ 9 أشهر',
    dateEn: '9 months ago',
    improvementDuration: 'احترافية عالية في ABA',
    improvementDurationEn: 'High ABA professionalism',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-eman-almalki',
    parentName: 'Eman Almalki',
    parentNameEn: 'Eman Almalki',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'aba',
    categoryEn: 'ABA Therapy',
    treatedBy: 'الأخصائي محمد عاطف',
    treatedByEn: 'Specialist Mohamed Atef',
    childIssue: 'تحسن سلوكي وتفاعل مع الطفل بصبر',
    childIssueEn: 'Behavioral progress with patient child interaction',
    rating: 5,
    comment: 'السلام عليكم صراحة مركز رابا من أفضل المراكز اللي تعاملت معها، مركز متميز وذو خبرة عالية في مجال ABA.\nاشكر الاخصائي محمد عاطف في تعامله مع ابني وعلى صبره واسلوبه الرائع مع الطفل بحيث لاحظت تحسن ملحوظ مع ابني بطريقته وتعامله الاحترافي اتمناله كل التوفيق وجعله الله في ميزان حسناته 🌸🌸',
    commentEn: 'Peace be upon you. Honestly RABA is one of the top centers with deep ABA expertise. I thank therapist Mohamed Atef for his patience and wonderful style with my son, noticing significant improvement.',
    specialistName: 'الأخصائي محمد عاطف',
    specialistNameEn: 'Specialist Mohamed Atef',
    date: 'منذ 5 أشهر',
    dateEn: '5 months ago',
    improvementDuration: 'تحسن ملحوظ في السلوك',
    improvementDurationEn: 'Noticeable behavioral progress',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-shrooq-belobaib',
    parentName: 'shrooq belobaib',
    parentNameEn: 'shrooq belobaib',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'assessment',
    categoryEn: 'Quality Care & Clinical Environment',
    treatedBy: 'فريق مركز رابا الطبي والتأهيلي',
    treatedByEn: 'RABA Medical & Rehab Team',
    childIssue: 'بيئة علاجية مريحة وتنظيم متكامل',
    childIssueEn: 'Comfortable clinical atmosphere and high organization',
    rating: 5,
    comment: 'من كل قلبي، حاب أشكر مركز رابا على كل اللي قدموه لنا من خدمات رائعة واحترافية. صراحة، تجربتي معهم كانت أكثر من ممتازة، حسّيت ببيئة مريحة، وتنظيم راقٍ، وتعامل راقٍ من أول لحظة.',
    commentEn: 'From the bottom of my heart, I thank RABA center for all the wonderful and professional services. Truly an experience beyond excellent in a comfortable environment and classy organization.',
    specialistName: 'إدارة وفريق مركز رابا',
    specialistNameEn: 'RABA Team & Clinical Staff',
    date: 'منذ سنة',
    dateEn: 'a year ago',
    improvementDuration: 'بيئة احترافية متكاملة',
    improvementDurationEn: 'Fully professional environment',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-florence',
    parentName: 'Florence',
    parentNameEn: 'Florence',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'aba',
    categoryEn: 'ABA Behavioral Therapy',
    treatedBy: 'الأخصائية آلاء ناجي (Alaa Nagy)',
    treatedByEn: 'ABA Specialist Alaa Nagy',
    childIssue: 'جلسات تحليل سلوك مكثفة وتأهيل يومي',
    childIssueEn: 'One month intensive ABA therapy',
    rating: 5,
    comment: 'Was here for one month with my client, the experience was amazing, all the therapist did a great job with my boy.\nMany thanks especially to the ABA (Alaa Nagy), keep up the good work.',
    commentEn: 'Was here for one month with my client, the experience was amazing, all the therapist did a great job with my boy. Many thanks especially to the ABA (Alaa Nagy), keep up the good work.',
    specialistName: 'الأخصائية آلاء ناجي',
    specialistNameEn: 'Alaa Nagy (ABA Specialist)',
    date: 'منذ شهر',
    dateEn: 'a month ago',
    improvementDuration: 'Amazing 1-month clinical growth',
    improvementDurationEn: 'Amazing 1-month clinical growth',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-ali-banafa',
    parentName: 'Ali Banafa',
    parentNameEn: 'Ali Banafa',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'aba',
    categoryEn: 'Comprehensive Behavioral Progress',
    treatedBy: 'الأستاذة منار وفريق المتخصصين',
    treatedByEn: 'Ms. Manar & Specialist Team',
    childIssue: 'تطور ملحوظ في سلوك ومهارات الطفل',
    childIssueEn: 'Significant developmental & behavioral progress',
    rating: 5,
    comment: 'بالعكس مركز رابا ممتاز وبالفعل ولدي تحسن بشكل كثير وللأمانة الأستاذة منار يعطيها العافية الجهود التي قامت وهي الفريق من الأساتذة المتخصصين بالفعل ساعدوا ابني بالتطور وبالفعل جهودهم مشكورة لهم والأستاذة منار',
    commentEn: 'RABA center is genuinely excellent and my son improved immensely. Special thanks to Ms. Manar and the specialized team who truly aided my son in his developmental progress.',
    specialistName: 'الأستاذة منار وفريق الأخصائيين',
    specialistNameEn: 'Ms. Manar & Therapy Team',
    date: 'منذ 3 أسابيع',
    dateEn: '3 weeks ago',
    improvementDuration: 'تحسن كبير وملحوظ',
    improvementDurationEn: 'Remarkable improvement',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-ahmed',
    parentName: 'Ahmed',
    parentNameEn: 'Ahmed',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'sensory',
    categoryEn: 'Sensory Club & Preschool Readiness',
    treatedBy: 'قسم النادي الصحي وفصول التهيئة',
    treatedByEn: 'Health Club & Preschool Readiness Department',
    childIssue: 'تأهيل أطفال طيف التوحد والتهيئة المدرسية',
    childIssueEn: 'Autism rehabilitation & school preparation classes',
    rating: 5,
    comment: 'مركز مميز لمرضى التوحد تحديداً خاصة في النادي الصحي وفصول التهيئه ما قبل المدرسة لهذه الفئة 👍🏻',
    commentEn: 'Distinguished center specifically for autism care, particularly the specialized health club and preschool readiness classrooms.',
    specialistName: 'فريق فصول التهيئة المدرسية والنادي الرياضي',
    specialistNameEn: 'School Readiness & Wellness Team',
    date: 'منذ 5 أشهر',
    dateEn: '5 months ago',
    improvementDuration: 'جاهزية للمدرسة ودمج متكامل',
    improvementDurationEn: 'Preschool readiness & inclusion',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-anwar-al-ahmad',
    parentName: 'Anwar Al Ahmad',
    parentNameEn: 'Anwar Al Ahmad',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'aba',
    categoryEn: 'Autism & Special Needs Care',
    treatedBy: 'الأستاذة سارة وفريق رابا',
    treatedByEn: 'Ms. Sara & RABA Clinical Staff',
    childIssue: 'إحداث فرق حقيقي في حياة الطفل والأسرة',
    childIssueEn: 'Making a real life difference for the child and family',
    rating: 5,
    comment: 'كل الشكر والتقدير لمركز رابا للتوحد والاحتياجات الخاصة على جهودكم ورعايتكم المميزة.\nأنتم لا تقدمون خدمات فقط، بل تصنعون فرقًا حقيقيًا في حياة الأطفال وأسرهم.\nالاستاذه ساره شكرا لعطائك الذي لا يُقدّر بثمن.',
    commentEn: 'All gratitude to RABA center for autism and special needs. You do not just provide services, you make a true difference in the lives of children and families. Thanks to Ms. Sara for priceless dedication.',
    specialistName: 'الأستاذة سارة',
    specialistNameEn: 'Ms. Sara',
    date: 'منذ 5 أشهر',
    dateEn: '5 months ago',
    improvementDuration: 'فرق حقيقي ومستدام',
    improvementDurationEn: 'Real sustainable difference',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-angel',
    parentName: 'Angel',
    parentNameEn: 'Angel',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'aba',
    categoryEn: 'Autism Special Care',
    treatedBy: 'فريق رعاية أطفال التوحد',
    treatedByEn: 'Autism Care Team',
    childIssue: 'اهتمام وصبر ورعاية متفانية',
    childIssueEn: 'Dedicated care, patient support, and life impact',
    rating: 5,
    comment: 'كل الشكر والتقدير لمركز رابا للتوحد والاحتياجات الخاصة على جهودكم العظيمة ورعايتكم المميزة.\nأنتم لا تقدمون خدمات فقط، بل تصنعون فرقًا حقيقيًا في حياة الأطفال وأسرهم.\nشكرًا لاهتمامكم، وصبركم، وعطائكم الذي لا يُقدّر بثمن.\nنسأل الله أن يبارك في عملكم ويجزيكم خير الجزاء',
    commentEn: 'Heartfelt appreciation to RABA center for autism and special needs for their great care. You create a genuine difference in the lives of children and their families.',
    specialistName: 'فريق رابا للرعاية التأهيلية',
    specialistNameEn: 'RABA Rehabilitation Care Team',
    date: 'منذ 5 أشهر',
    dateEn: '5 months ago',
    improvementDuration: 'رعاية مميزة ومستمرة',
    improvementDurationEn: 'Distinguished continuous care',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-aisha-almutairi',
    parentName: 'Aisha Almutairi',
    parentNameEn: 'Aisha Almutairi',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'aba',
    categoryEn: '9-Month Developmental Milestone',
    treatedBy: 'الفريق الإكلينيكي بمركز رابا',
    treatedByEn: 'RABA Clinical Team',
    childIssue: 'تطور صحي وسلوكي مستمر على مدار 9 أشهر',
    childIssueEn: 'Continuous developmental and health progress over 9 months',
    rating: 5,
    comment: 'أشكر مركز رابا على كل ما قدموه لطفلي. أعتبرهم اللبنة الأولى في طريق تطوره، وشهادتي فيهم مجروحة. خلال تسعة أشهر وما زالوا يبذلون بكل حب واهتمام وجهد في سبيل صحة طفلي وجميع الأطفال، دون كلل أو ملل، بقلوب يملؤها الحب والحرص.',
    commentEn: 'I thank RABA center for everything they offered my child. I consider them the foundation of his development. Over nine months they continuously gave with love and dedication.',
    specialistName: 'فريق الأخصائيين برابا',
    specialistNameEn: 'RABA Therapy Specialists',
    date: 'منذ 5 أشهر',
    dateEn: '5 months ago',
    improvementDuration: 'تطور متواصل خلال 9 أشهر',
    improvementDurationEn: 'Continuous growth over 9 months',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-hadeel-yaseen',
    parentName: 'hadeel yaseen',
    parentNameEn: 'hadeel yaseen',
    isAnonymous: true,
    location: 'الرياض، فرع المغرزات',
    locationEn: 'Riyadh, Al-Mugharrazat Branch',
    category: 'aba',
    categoryEn: 'ABA, Inclusion & Wellness Club',
    treatedBy: 'الأخصائية سارة & الأخصائية دولت & الأخصائي عبدالإله & غادة',
    treatedByEn: 'Specialists Sara, Dawlat, Abdelilah & Ghada',
    childIssue: 'دمج قوي ونادي رياضي اجتماعي وتأهيل سلوكي',
    childIssueEn: 'Strong inclusion, social sports club & behavior therapy',
    rating: 5,
    comment: 'مركز رابا فرع المغرزات مميز بال ABA و فكرة النادي الرياضي الاجتماعي و جدا مبسوطه من التعامل مع الاخصائين سارة و دولت و الاخصائي عبدالاله و المرحز بركز و بدعم الدمج بشكل قوي و غادة جدا متعاونة و التواصل جدا سهل مع المركز',
    commentEn: 'RABA Al-Mugharrazat branch stands out with ABA and social sports club. Thrilled with specialists Sara, Dawlat, and Abdelilah. The center strongly supports inclusion, and Ghada is very cooperative.',
    specialistName: 'الأخصائية سارة & الأخصائية دولت & أ. عبدالإله',
    specialistNameEn: 'Specialists Sara, Dawlat & Abdelilah',
    date: 'منذ 5 أشهر',
    dateEn: '5 months ago',
    improvementDuration: 'دمج اجتماعي ورياضي قوي',
    improvementDurationEn: 'Strong social & athletic inclusion',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-khaled-tahir',
    parentName: 'خالد الطاهر',
    parentNameEn: 'Khaled Al-Taher',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'aba',
    categoryEn: 'Behavior Modification & Cognitive Growth',
    treatedBy: 'الأخصائي أحمد',
    treatedByEn: 'Specialist Ahmed',
    childIssue: 'تطور سريع في السلوك والإدراك من أولى الجلسات',
    childIssueEn: 'Rapid behavioral & cognitive improvement from first sessions',
    rating: 5,
    comment: 'تجربتي مع المركز جداا ممتازين إبني عبدالرحمن مع الأستاذ أحمد ممتاااز ومتمكن ولاحظت التطور على ابني من اول الجلسات الحمدلله واحس ابني يتطور بسرعة سلوكيا وكمان الإدراك تحسن ماشاءالله هذا بفضل الله ثم الأخصائي أحمد بارك الله في علمه وعمله.',
    commentEn: 'My experience with the center is excellent. My son Abdulrahman with specialist Ahmed is amazing. I noticed progress from the very first sessions, rapid behavioral improvement and cognitive clarity.',
    specialistName: 'الأخصائي أحمد',
    specialistNameEn: 'Specialist Ahmed',
    date: 'منذ سنة',
    dateEn: 'a year ago',
    improvementDuration: 'تطور ملحوظ وسريع بالإدراك',
    improvementDurationEn: 'Fast cognitive & behavioral growth',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-husna-ahsan',
    parentName: 'Husna Ahsan',
    parentNameEn: 'Husna Ahsan',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'aba',
    categoryEn: 'Individualized Treatment Plans',
    treatedBy: 'فريق رابا الإكلينيكي',
    treatedByEn: 'RABA Clinical Team',
    childIssue: 'خطط تأهيلية متقدمة ودعم نفسي وأسري',
    childIssueEn: 'Amazing therapy plans and supportive staff',
    rating: 5,
    comment: 'Their team is fabulous, their plans are amazing and all of them are very supportive and very sweet',
    commentEn: 'Their team is fabulous, their plans are amazing and all of them are very supportive and very sweet',
    specialistName: 'فريق الخطط العلاجية برابا',
    specialistNameEn: 'RABA Therapy Planning Team',
    date: 'منذ 5 أشهر',
    dateEn: '5 months ago',
    improvementDuration: 'خطط علاجية استثنائية',
    improvementDurationEn: 'Fabulous plans & supportive team',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-om-nawaf',
    parentName: 'Om Nawaf (أم أسماء)',
    parentNameEn: 'Om Nawaf (Um Asmaa)',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'aba',
    categoryEn: 'Child Growth & Learning Support',
    treatedBy: 'فريق العمل بمركز رابا',
    treatedByEn: 'RABA Center Staff',
    childIssue: 'تسخير الإمكانيات لتطوير مهارات التعلم',
    childIssueEn: 'Mobilizing all resources for learning & growth',
    rating: 5,
    comment: 'أشكر القائمين على المركز وكل العاملين دون استثناء على الإهتمام والمتابعة وتسخير كافة الإمكانيات لمساعدة بنتي على التطور والتعلم.. أسأل الله لكم التوفيق.\nأم أسماء 🫶',
    commentEn: 'I thank everyone in charge of the center and all workers without exception for the dedicated follow-up and utilizing all capabilities to help my daughter grow and learn. Um Asmaa 🫶',
    specialistName: 'فريق المتابعة والتعليم',
    specialistNameEn: 'Learning & Follow-up Team',
    date: 'منذ 9 أشهر',
    dateEn: '9 months ago',
    improvementDuration: 'متابعة حثيثة وتطور مستمر',
    improvementDurationEn: 'Dedicated follow-up & continuous learning',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-nayef-alharbi',
    parentName: 'Nayef S Alharbi',
    parentNameEn: 'Nayef S Alharbi',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'aba',
    categoryEn: 'Professionalism & Plan Adaptation',
    treatedBy: 'فريق الاستقبال والأخصائيين والإداريين',
    treatedByEn: 'Reception, Therapists & Management',
    childIssue: 'مرونة في الاستماع وتعديل الخطط العلاجية',
    childIssueEn: 'Professional listening and adapting treatment plans',
    rating: 5,
    comment: 'يعتبر من المراكز المحترفة في نظري عندهم الاحترافية في الاستماع وتقبل النقد وتغيير الخطه في حال اقتناعهم .\nتحية الى فريق الاستقبال وفريق العمل الأخصائيين والاداريين',
    commentEn: 'Considered one of the most professional centers in my view, exhibiting true professionalism in listening and adjusting treatment plans whenever beneficial. Salutes to reception and therapists.',
    specialistName: 'الفريق الاستشاري والإداري',
    specialistNameEn: 'Consulting & Administrative Team',
    date: 'منذ 8 أشهر',
    dateEn: '8 months ago',
    improvementDuration: 'احترافية في التخطيط والتنفيذ',
    improvementDurationEn: 'Exemplary clinical planning',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-leena-abdullah',
    parentName: 'LEENA ABDULLAH',
    parentNameEn: 'LEENA ABDULLAH',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'speech',
    categoryEn: 'Speech & Language Therapy',
    treatedBy: 'الأستاذ حسام (أخصائي تخاطب) & موظفات الاستقبال غادة ومريم',
    treatedByEn: 'Specialist Hossam (Speech Therapist) & Ghada, Maryam',
    childIssue: 'تأخر لغوي ونتائج مرضية جداً في النطق',
    childIssueEn: 'Speech delay with highly satisfying outcomes',
    rating: 5,
    comment: 'الحمدلله والشكر له اولاً ثم لطاقم المركز كامل بداية من الاستقبال الموظفات بشوشات وخلوقات ومريحات غاده ومريم واشكر استاذ حسام اخصائي تخاطب دخلت ولدي عنده الحمدلله لقيت نتائج مررررضيه لولدي الحمدلله ششكررررررااا للمركز على هذا الطاقم الاكثر من رائع',
    commentEn: 'Praise be to God first and then the whole team, starting from cheerful reception staff Ghada and Maryam. Deep thanks to speech therapist Mr. Hossam, we achieved thoroughly satisfying speech results for my boy.',
    specialistName: 'الأستاذ حسام (أخصائي تخاطب)',
    specialistNameEn: 'Hossam (Speech Therapist)',
    date: 'منذ 8 أشهر',
    dateEn: '8 months ago',
    improvementDuration: 'نتائج مرضية جداً في النطق',
    improvementDurationEn: 'Highly satisfying speech results',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-amira',
    parentName: 'Amira',
    parentNameEn: 'Amira',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'aba',
    categoryEn: 'Inclusion, ABA, Speech, OT & Pool Club',
    treatedBy: 'مشرفة قسم الدمج سارة والفريق المعالج',
    treatedByEn: 'Sara (Inclusion Supervisor) & Therapy Team',
    childIssue: 'دمج شامل، جلسات فردية ABA وتخاطب وعلاج وظيفي وسباحة',
    childIssueEn: 'Comprehensive inclusion, ABA, Speech, OT & swimming sports center',
    rating: 5,
    comment: 'المكان متكامل شامل قسم دمج وفصول تهيئه وقسم جلسات فرديه مختصه بال ABA وال speech وال ot وتحت فيه مبنى كامل نادي رياضي شامل سباحه واجهزة\nشكراً لهم على تعاونهم وشكر خاص لمشرفة قسم الدمج سارة ❤️👏🏻',
    commentEn: 'A truly complete facility: inclusion department, readiness classrooms, 1-on-1 ABA, Speech, and OT sessions, and a full sports building with swimming pool and gym. Special thanks to inclusion supervisor Sara ❤️👏🏻',
    specialistName: 'الأستاذة سارة (مشرفة قسم الدمج)',
    specialistNameEn: 'Ms. Sara (Inclusion Supervisor)',
    date: 'منذ 5 أشهر',
    dateEn: '5 months ago',
    improvementDuration: 'تأهيل متكامل وبيئة رياضية',
    improvementDurationEn: 'Comprehensive inclusion & athletic facility',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-reyof-ahmed',
    parentName: 'Reyof Ahmed',
    parentNameEn: 'Reyof Ahmed',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'aba',
    categoryEn: 'ABA Supervision & Specialized Environment',
    treatedBy: 'المشرفات مدى ووضحى وسمر & الأخصائيين وليد وإيمان',
    treatedByEn: 'Supervisors Mada, Wadhha, Samar & Therapists Waleed, Eman',
    childIssue: 'بيئة داعمة وآمنة واحترافية عالية في ABA',
    childIssueEn: 'Safe supportive environment with high ABA quality',
    rating: 5,
    comment: 'فخورين جدًا بتجربتنا مع فريق رابا قسم ABA، فريق مميز بكل ما تعنيه الكلمة من معنى. شكر خاص للمشرفات الرائعات مدى ووضحى وسمر على احترافيتهم العالية وحرصهم الدائم على تقديم أفضل جودة في الخدمة.\nوشكر من القلب للأخصائيين وليد وإيمان على أسلوبهم الراقي وتفانيهم في العمل مع الأطفال وحرصهم على تهيئة بيئة داعمة وآمنة.',
    commentEn: 'Very proud of our experience with RABA ABA team. Special thanks to wonderful supervisors Mada, Wadhha, and Samar for high professionalism, and therapists Waleed and Eman for their dedication in creating a safe supportive environment.',
    specialistName: 'المشرفات: مدى، وضحى، سمر & أ. وليد & أ. إيمان',
    specialistNameEn: 'Supervisors: Mada, Wadhha, Samar & Waleed, Eman',
    date: 'منذ سنة',
    dateEn: 'a year ago',
    improvementDuration: 'بيئة داعمة وجودة خدمة متميزة',
    improvementDurationEn: 'Safe supportive environment & top quality',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-wasaif-naif',
    parentName: 'Wasaif Naif',
    parentNameEn: 'Wasaif Naif',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'aba',
    categoryEn: 'Behavioral & Pediatric Therapy',
    treatedBy: 'الأخصائي سعد الدوسري',
    treatedByEn: 'Specialist Saad Al-Dossary',
    childIssue: 'تأهيل سلوكي ودعم أسري',
    childIssueEn: 'Behavioral rehabilitation and dedicated specialist care',
    rating: 5,
    comment: 'مركز جميل من كل النواحي وحابه اشكر الاخصائي سعد الدوسري الله يجزاه خير 🙏🏻',
    commentEn: 'A beautiful center from every aspect. I would love to thank specialist Saad Al-Dossary, may God reward him with all goodness 🙏🏻',
    specialistName: 'الأخصائي سعد الدوسري',
    specialistNameEn: 'Specialist Saad Al-Dossary',
    date: 'منذ 3 أشهر',
    dateEn: '3 months ago',
    improvementDuration: 'تجربة ممتازة وتعامل راقي',
    improvementDurationEn: 'Excellent experience & respectful care',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-ebtesam-saedi',
    parentName: 'ابتسام الصاعدي',
    parentNameEn: 'Ebtesam Al-Saedi',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'aba',
    categoryEn: 'Rapid Progress & Family Warmth',
    treatedBy: 'الأخصائية أحلام & الأخصائي حاتم & أ. محمد & أ. إيمان & حشمه وفوز وإيمان',
    treatedByEn: 'Therapists Ahlam, Hatem, Mohamed, Eman & Admins Heshmah, Fowz',
    childIssue: 'تحسن ملحوظ في فترة قصيرة وشعور بالانتماء العائلي',
    childIssueEn: 'Noticeable improvement in short period with family warmth',
    rating: 5,
    comment: 'احبكم فريق رابا مررره\nشكرا شكرا شكرا من القلب علي جهودكم المباركة مع ولدي الحمدالله لاحظت تحسن ملحوض في فتره قصيره الحمدالله\nيعطيكم ألف عافيه مبدئيا من الاخصائية أحلام والاخصائي حاتم ومحمد والأخصائية إيمان مرررره رائعين ومتمكنين بقدراتهم العاليه وصراحه حسيتهم العايلة الثانيه لولدي وشكرا من اعماق القلب للحب حشمه وفوز الإداريات والعسل المشرفه إيمان الله يسعدكم جميعا',
    commentEn: 'I love you RABA team so much! Thank you from the heart for your blessed efforts with my son. I noticed rapid noticeable improvement. Specialists Ahlam, Hatem, Mohamed, and Eman are exceptionally competent. You truly felt like a second family to my son.',
    specialistName: 'الأخصائيون: أحلام، حاتم، محمد، إيمان & الإشراف',
    specialistNameEn: 'Specialists Ahlam, Hatem, Mohamed, Eman',
    date: 'منذ 5 أشهر',
    dateEn: '5 months ago',
    improvementDuration: 'تحسن ملحوظ في فترة قصيرة',
    improvementDurationEn: 'Noticeable progress in short timeframe',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-amina',
    parentName: 'Amina',
    parentNameEn: 'Amina',
    isAnonymous: true,
    location: 'الرياض',
    locationEn: 'Riyadh',
    category: 'aba',
    categoryEn: 'Self-Care & Toilet Training',
    treatedBy: 'الأخصائيات: منال أبو عطره، رهف الدغماني، هلا العنزي، فوز العتيبي، حشمه المطيري، نوره الصنيعي',
    treatedByEn: 'Manal Abu Atrah, Rahaf Al-Dughmani, Hala Al-Anzi, Fowz, Heshmah, Noura',
    childIssue: 'اكتساب مهارات الاستقلالية والرعاية الذاتية ودخول الحمام',
    childIssueEn: 'Milestone achievement in independence & toilet training',
    rating: 5,
    comment: 'المركز ممتاز والاخصائيات والاستقبال جدا متعاونات 🤍🤍\nلاحظت بطفلتي تحسن ملحوظ خاصه في تعلم الذهاب لدورة المياة\nاشكر الجميع منال ابو عطره - رهف الدغماني - هلا العنزي - فوز العتيبي - حشمه المطيري - نوره الصنيعي',
    commentEn: 'Excellent center and very cooperative therapists and reception 🤍🤍. I noticed noticeable improvement in my girl especially in toilet training. Many thanks to all specialists: Manal, Rahaf, Hala, Fowz, Heshmah, Noura.',
    specialistName: 'فريق التدريب على الاستقلالية والسلوك',
    specialistNameEn: 'Independence & Daily Skills Team',
    date: 'منذ شهر',
    dateEn: 'a month ago',
    improvementDuration: 'إتقان الذهاب لدورة المياه والاستقلالية',
    improvementDurationEn: 'Mastered toilet training & independence',
    verifiedBeneficiary: true
  },
  {
    id: 'rev-lana-b',
    parentName: 'Lana B',
    parentNameEn: 'Lana B',
    isAnonymous: true,
    location: 'الرياض، فرع النرجس وفرع المغرزات',
    locationEn: 'Riyadh, Al-Narjis & Al-Mugharrazat Branches',
    category: 'aba',
    categoryEn: 'Multi-Branch Excellence & Customer Care',
    treatedBy: 'الأخت بلقيس وكافة الأخصائيين',
    treatedByEn: 'Balqees & All Therapy Staff',
    childIssue: 'متابعة مستمرة بين فروع المركز وتطور مستمر للطفل',
    childIssueEn: 'Cross-branch continuous development and care',
    rating: 5,
    comment: 'من أفضل المراكز الي جربتها لأبني مركز رابا 💕\nوالشكر موصل لكل الاخصائين بلا استثناء .. وكل الشكر للأخت الراقيه بلقيس وسعيده جداً لتواجدها في فرع النرجس بعد تعاملي معها في فرع المغرزات\n.. شكراً لك على حسن تعاملك ولطفك وأقدّر اهتمامك .. وأتمنى لك كل التوفيق ❤️',
    commentEn: 'One of the best centers I have ever tried for my son 💕. Gratitude to all therapists without exception, and special thanks to the elegant Balqees, delighted to see her in Al-Narjis branch after Al-Mugharrazat.',
    specialistName: 'الأخت بلقيس وفريق الأخصائيين',
    specialistNameEn: 'Balqees & Therapy Staff',
    date: 'منذ 3 أشهر',
    dateEn: '3 months ago',
    improvementDuration: 'رعاية مميزة ومستمرة بالفروع',
    improvementDurationEn: 'Multi-branch high quality care',
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
