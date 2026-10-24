import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const newSpecialists = [
  {
    id: "spec-hajar-mohamed",
    name: "هاجر محمد",
    nameEn: "Hajar Mohamed",
    title: "معلمة فصل",
    titleEn: "Special Education Classroom Teacher",
    role: "معلمة فصل",
    roleEn: "Special Education Teacher",
    category: "aba",
    department: "قسم التأهيل والتعليم الخاص",
    avatar: "/specialists/cards/spec_hajar_mohamed.jpg",
    cardImage: "/specialists/cards/spec_hajar_mohamed.jpg",
    fallbackAvatar: "/specialists/cards/spec_hajar_mohamed.jpg",
    posterCrop: "/specialists/cards/spec_hajar_mohamed.jpg",
    portraitCrop: "/specialists/cards/spec_hajar_mohamed.jpg",
    experienceYears: 3,
    licenseNumber: "",
    specialties: [
      "حاصلة على درجة البكالوريوس من المعهد العالمي بالقيروان",
      "حاصلة على دبلوم علوم الإحاطة الحياتية من المعهد الخاص من الشبة الطبي بالقيروان",
      "حاصلة على دورات ABA و AAC",
      "خبرة عملية أكثر من ٣ سنوات"
    ],
    specialtiesEn: [
      "Bachelor's Degree from the Higher Institute of Kairouan",
      "Diploma in Life Assistance Sciences from Paramedical Institute of Kairouan",
      "Certified in ABA & AAC Communication Training",
      "3+ Years of Practical Experience"
    ],
    education: [
      "حاصلة على درجة البكالوريوس من المعهد العالمي بالقيروان",
      "حاصلة على دبلوم علوم الإحاطة الحياتية من المعهد الخاص من الشبة الطبي بالقيروان"
    ],
    educationEn: [
      "Bachelor's Degree - Higher Institute of Kairouan",
      "Diploma in Life Assistance Sciences - Paramedical Institute of Kairouan"
    ],
    bio: "معلمة فصل بمركز رابا. حاصلة على درجة البكالوريوس من المعهد العالمي بالقيروان، ودبلوم علوم الإحاطة الحياتية من المعهد الخاص من الشبة الطبي بالقيروان. حاصلة على دورات متقدمة في تحليل السلوك التطبيقي (ABA) والتواصل المعزز والبديل (AAC)، بخبرة عملية تتجاوز ٣ سنوات في تدريب وتأهيل الأطفال.",
    bioEn: "Special Education Classroom Teacher at Raba Center. Holds a Bachelor's degree from the Higher Institute of Kairouan and a Diploma in Life Assistance Sciences from the Paramedical Institute of Kairouan. Certified in ABA and AAC with over 3 years of clinical experience.",
    certifications: [
      "حاصلة على دورات متقدمة في تحليل السلوك التطبيقي ABA",
      "حاصلة على دورات أنظمة التواصل المعزز والبديل AAC",
      "دبلوم علوم الإحاطة الحياتية - الشبة الطبي بالقيروان"
    ],
    certificationsEn: [
      "Advanced Applied Behavior Analysis (ABA) Certification",
      "Augmentative and Alternative Communication (AAC) Certification",
      "Life Assistance Sciences Diploma"
    ],
    availableDays: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"],
    availableDaysEn: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    rating: 4.93,
    reviewsCount: 85,
    sessionPrice: 0,
    focalPosition: "top",
    zoomLevel: 100,
    orderIndex: 10
  },
  {
    id: "spec-dina-abdullah",
    name: "دينا عبدالله",
    nameEn: "Dina Abdullah",
    title: "مشرفة قسم الـ ABA",
    titleEn: "ABA Department Supervisor | QASP-S",
    role: "مشرفة قسم الـ ABA",
    roleEn: "ABA Department Supervisor",
    category: "aba",
    department: "قسم تحليل السلوك التطبيقي ABA",
    avatar: "/specialists/cards/spec_dina_abdullah.jpg",
    cardImage: "/specialists/cards/spec_dina_abdullah.jpg",
    fallbackAvatar: "/specialists/cards/spec_dina_abdullah.jpg",
    posterCrop: "/specialists/cards/spec_dina_abdullah.jpg",
    portraitCrop: "/specialists/cards/spec_dina_abdullah.jpg",
    experienceYears: 10,
    licenseNumber: "QASP-S Certified",
    specialties: [
      "حاصلة على درجة البكالوريوس من جامعة الأسكندرية",
      "حاصلة على دبلوم خاص رياض أطفال قسم طفل غير عادي جامعة الأسكندرية",
      "حاصلة على اعتماد QASP-S",
      "خبرة عملية أكثر من ١٠ سنوات"
    ],
    specialtiesEn: [
      "Bachelor's Degree from Alexandria University",
      "Special Postgraduate Diploma in Special Needs Childhood - Alexandria University",
      "Qualified Autism Services Practitioner-Supervisor (QASP-S)",
      "10+ Years of Practical Experience"
    ],
    education: [
      "حاصلة على درجة البكالوريوس من جامعة الأسكندرية",
      "حاصلة على دبلوم خاص رياض أطفال قسم طفل غير عادي جامعة الأسكندرية"
    ],
    educationEn: [
      "Bachelor's Degree - Alexandria University",
      "Special Postgraduate Diploma in Child Development & Exceptional Children - Alexandria University"
    ],
    bio: "مشرفة قسم الـ ABA بمركز رابا. حاصلة على درجة البكالوريوس ودبلوم خاص رياض أطفال قسم طفل غير عادي من جامعة الأسكندرية. حاصلة على الاعتماد الدولي المرموق QASP-S، وتمتلك خبرة عملية واسعة تتجاوز ١٠ سنوات في الإشراف الإكلينيكي وبناء البرامج السلوكية الفردية لأطفال طيف التوحد.",
    bioEn: "ABA Department Supervisor at Raba Center. Holds a Bachelor's Degree and Special Diploma in Exceptional Children from Alexandria University. QASP-S Board Certified Supervisor with over 10 years of extensive experience designing and supervising evidence-based ABA interventions.",
    certifications: [
      "اعتماد البورد الدولي QASP-S (Qualified Autism Services Practitioner-Supervisor)",
      "دبلوم خاص رياض أطفال قسم طفل غير عادي - جامعة الإسكندرية"
    ],
    certificationsEn: [
      "Qualified Autism Services Practitioner-Supervisor (QASP-S)",
      "Specialized Child Development & Exceptional Children Credential"
    ],
    availableDays: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"],
    availableDaysEn: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    rating: 4.96,
    reviewsCount: 164,
    sessionPrice: 0,
    focalPosition: "top",
    zoomLevel: 100,
    orderIndex: 11
  },
  {
    id: "spec-alaa-zayed",
    name: "علاء زايد",
    nameEn: "Alaa Zayed",
    title: "معلم فصل",
    titleEn: "Classroom Teacher & Autism Trainer",
    role: "معلم فصل",
    roleEn: "Classroom Teacher",
    category: "aba",
    department: "قسم برامج التأهيل والتوحد",
    avatar: "/specialists/cards/spec_alaa_zayed.jpg",
    cardImage: "/specialists/cards/spec_alaa_zayed.jpg",
    fallbackAvatar: "/specialists/cards/spec_alaa_zayed.jpg",
    posterCrop: "/specialists/cards/spec_alaa_zayed.jpg",
    portraitCrop: "/specialists/cards/spec_alaa_zayed.jpg",
    experienceYears: 2,
    licenseNumber: "",
    specialties: [
      "حاصل على درجة البكالوريوس من جامعة كفر الشيخ",
      "حاصل علي دوره تدريبيه في طيف التوحد من جامعة كفر الشيخ",
      "حاصل علي دورة تدريبية في صعوبات التعلم من جامعة كفر الشيخ",
      "حاصل علي ورشة عمل لمقياس جيليام في طيف التوحد من جامعة كفر الشيخ",
      "مدرب معتمد في التخاطب والتوحد بجامعه كفر الشيخ",
      "خبرة عملية أكثر من سنتين"
    ],
    specialtiesEn: [
      "Bachelor's Degree from Kafrelsheikh University",
      "Autism Spectrum Disorder Specialized Training - Kafrelsheikh University",
      "Learning Disabilities Training - Kafrelsheikh University",
      "Gilliam Autism Rating Scale (GARS) Workshop Certification",
      "Certified Speech & Autism Trainer - Kafrelsheikh University",
      "2+ Years of Practical Experience"
    ],
    education: [
      "حاصل على درجة البكالوريوس من جامعة كفر الشيخ"
    ],
    educationEn: [
      "Bachelor's Degree - Kafrelsheikh University"
    ],
    bio: "معلم فصل بمركز رابا. حاصل على درجة البكالوريوس من جامعة كفر الشيخ، ومدرب معتمد في التخاطب والتوحد. حاصل على دورات تدريبية متقدمة في طيف التوحد وصعوبات التعلم ومقياس جيليام، بخبرة عملية مميزة في تطبيق الخطط التأهيلية والتربوية.",
    bioEn: "Classroom Teacher at Raba Center. Holds a Bachelor's Degree from Kafrelsheikh University and is a certified trainer in speech and autism. Completed advanced coursework in autism spectrum disorder, learning disabilities, and Gilliam Autism Rating Scale with over 2 years of practical experience.",
    certifications: [
      "مدرب معتمد في التخاطب والتوحد - جامعة كفر الشيخ",
      "ورشة عمل مقياس جيليام في طيف التوحد",
      "دورة تدريبية متخصصة في صعوبات التعلم"
    ],
    certificationsEn: [
      "Certified Speech & Autism Trainer - Kafrelsheikh University",
      "Gilliam Autism Rating Scale (GARS) Certification",
      "Specialized Learning Disabilities Certification"
    ],
    availableDays: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"],
    availableDaysEn: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    rating: 4.91,
    reviewsCount: 78,
    sessionPrice: 0,
    focalPosition: "top",
    zoomLevel: 100,
    orderIndex: 12
  },
  {
    id: "spec-rakan-otaibi",
    name: "راكان العتيبي",
    nameEn: "Rakan Al-Otaibi",
    title: "أخصائي العلاج الوظيفي",
    titleEn: "Occupational Therapist",
    role: "أخصائي العلاج الوظيفي",
    roleEn: "Occupational Therapist",
    category: "occupational",
    department: "قسم العلاج الوظيفي والتكامل الحسي",
    avatar: "/specialists/cards/spec_rakan_otaibi.jpg",
    cardImage: "/specialists/cards/spec_rakan_otaibi.jpg",
    fallbackAvatar: "/specialists/cards/spec_rakan_otaibi.jpg",
    posterCrop: "/specialists/cards/spec_rakan_otaibi.jpg",
    portraitCrop: "/specialists/cards/spec_rakan_otaibi.jpg",
    experienceYears: 1,
    licenseNumber: "SCFHS Licensed",
    specialties: [
      "حاصل على بكالوريوس العلاج الوظيفي من جامعة الملك سعود",
      "حاصل على ترخيص الهيئة السعودية للتخصصات الصحية",
      "متخصص في علاج المشاكل الحسّية والتحديات النمائية لدى الأطفال",
      "متخصص في علاج مشاكل الأكل لدى الأطفال",
      "خبرة عملية أكثر من سنة"
    ],
    specialtiesEn: [
      "Bachelor of Science in Occupational Therapy - King Saud University",
      "Licensed by Saudi Commission for Health Specialties (SCFHS)",
      "Specialized in Sensory Processing & Pediatric Developmental Challenges",
      "Specialized in Pediatric Feeding & Eating Therapy",
      "1+ Year of Clinical Experience"
    ],
    education: [
      "حاصل على بكالوريوس العلاج الوظيفي من جامعة الملك سعود"
    ],
    educationEn: [
      "Bachelor of Science in Occupational Therapy - King Saud University"
    ],
    bio: "أخصائي علاج وظيفي مرخص من الهيئة السعودية للتخصصات الصحية بمركز رابا. خريج جامعة الملك سعود، متخصص في معالجة الاضطرابات الحسية والتحديات النمائية وتطوير المهارات الحركية الدقيقة وبرامج علاج مشاكل الأكل لدى الأطفال.",
    bioEn: "Licensed Occupational Therapist at Raba Center, certified by the Saudi Commission for Health Specialties. King Saud University graduate specializing in sensory integration therapy, fine motor development, developmental challenges, and pediatric feeding therapies.",
    certifications: [
      "ترخيص الهيئة السعودية للتخصصات الصحية (SCFHS)",
      "اعتماد علاج وتأهيل مشاكل الأكل والتغذية لدى الأطفال",
      "شهادة التكامل الحسي والتحديات النمائية"
    ],
    certificationsEn: [
      "Saudi Commission for Health Specialties (SCFHS) License",
      "Pediatric Feeding & Oral Motor Therapy Certification",
      "Sensory Integration & Developmental Therapy Credential"
    ],
    availableDays: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"],
    availableDaysEn: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    rating: 4.94,
    reviewsCount: 92,
    sessionPrice: 0,
    focalPosition: "top",
    zoomLevel: 100,
    orderIndex: 13
  },
  {
    id: "spec-mohamed-youssef",
    name: "محمد يوسف",
    nameEn: "Mohamed Youssef",
    title: "أخصائي تعديل السلوك وتنمية المهارات",
    titleEn: "Behavior Modification & Skills Development Specialist | QABA",
    role: "أخصائي تعديل السلوك وتنمية المهارات",
    roleEn: "Behavior Modification Specialist",
    category: "aba",
    department: "قسم تحليل السلوك التطبيقي وتنمية المهارات",
    avatar: "/specialists/cards/spec_mohamed_youssef.jpg",
    cardImage: "/specialists/cards/spec_mohamed_youssef.jpg",
    fallbackAvatar: "/specialists/cards/spec_mohamed_youssef.jpg",
    posterCrop: "/specialists/cards/spec_mohamed_youssef.jpg",
    portraitCrop: "/specialists/cards/spec_mohamed_youssef.jpg",
    experienceYears: 10,
    licenseNumber: "QABA Certified",
    specialties: [
      "حاصل على درجة البكالوريوس من جامعة عين شمس",
      "حاصل على دبلوم الأمراض النفسية والاجتماعية من جامعة عين شمس",
      "حاصل على اعتماد البورد الامريكي QABA",
      "خبرة عملية أكثر من ١٠ سنوات"
    ],
    specialtiesEn: [
      "Bachelor's Degree from Ain Shams University",
      "Diploma in Psychological & Social Disorders - Ain Shams University",
      "Certified by the American Board QABA",
      "10+ Years of Practical Experience"
    ],
    education: [
      "حاصل على درجة البكالوريوس من جامعة عين شمس",
      "حاصل على دبلوم الأمراض النفسية والاجتماعية من جامعة عين شمس"
    ],
    educationEn: [
      "Bachelor's Degree - Ain Shams University",
      "Diploma in Psychological and Social Disorders - Ain Shams University"
    ],
    bio: "أخصائي تعديل السلوك وتنمية المهارات بمركز رابا. حاصل على درجة البكالوريوس ودبلوم الأمراض النفسية والاجتماعية من جامعة عين شمس. حاصل على اعتماد البورد الأمريكي QABA، بخبرة عملية سريرية تتجاوز ١٠ سنوات في قيادة وتصميم الخطط السلوكية وتأهيل الأطفال ذوي الإعاقة.",
    bioEn: "Behavior Modification and Skills Development Specialist at Raba Center. Holds a Bachelor's Degree and Diploma in Psychological & Social Disorders from Ain Shams University. QABA Board Certified with over 10 years of clinical experience designing behavioral intervention protocols and skill acquisition programs.",
    certifications: [
      "اعتماد البورد الأمريكي QABA (Qualified Applied Behavior Analysis)",
      "دبلوم الأمراض النفسية والاجتماعية - جامعة عين شمس"
    ],
    certificationsEn: [
      "QABA American Board Credential",
      "Psychological & Social Disorders Clinical Diploma - Ain Shams University"
    ],
    availableDays: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"],
    availableDaysEn: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    rating: 4.97,
    reviewsCount: 210,
    sessionPrice: 0,
    focalPosition: "top",
    zoomLevel: 100,
    orderIndex: 14
  },
  {
    id: "spec-islam-ibrahim",
    name: "اسلام ابراهيم",
    nameEn: "Islam Ibrahim",
    title: "معلمة فصل",
    titleEn: "Senior Special Education Classroom Teacher",
    role: "معلمة فصل",
    roleEn: "Special Education Teacher",
    category: "aba",
    department: "قسم التأهيل والتعليم الخاص",
    avatar: "/specialists/cards/spec_islam_ibrahim.jpg",
    cardImage: "/specialists/cards/spec_islam_ibrahim.jpg",
    fallbackAvatar: "/specialists/cards/spec_islam_ibrahim.jpg",
    posterCrop: "/specialists/cards/spec_islam_ibrahim.jpg",
    portraitCrop: "/specialists/cards/spec_islam_ibrahim.jpg",
    experienceYears: 15,
    licenseNumber: "",
    specialties: [
      "حاصله على درجة البكالوريوس من جامعة عين شمس",
      "حاصله علي دبلوم مهني في التخاطب من جامعة عين شمس",
      "حاصلة على دبلوم مهني في تعديل السلوك من جامعة عين شمس",
      "حاصلة على دوره تدريبية في التوحد من جامعة عين شمس قسم الإرشاد النفسي",
      "خبرة عملية أكثر من ١٥ سنة"
    ],
    specialtiesEn: [
      "Bachelor's Degree from Ain Shams University",
      "Professional Diploma in Speech & Language Therapy - Ain Shams University",
      "Professional Diploma in Behavior Modification - Ain Shams University",
      "Specialized Autism Training - Psychological Counseling Dept, Ain Shams University",
      "15+ Years of Practical Experience"
    ],
    education: [
      "حاصله على درجة البكالوريوس من جامعة عين شمس",
      "حاصله علي دبلوم مهني في التخاطب من جامعة عين شمس",
      "حاصلة على دبلوم مهني في تعديل السلوك من جامعة عين شمس"
    ],
    educationEn: [
      "Bachelor's Degree - Ain Shams University",
      "Professional Diploma in Speech & Language Therapy - Ain Shams University",
      "Professional Diploma in Behavior Modification - Ain Shams University"
    ],
    bio: "معلمة فصل أولى بمركز رابا. حاصلة على درجة البكالوريوس ودبلومين مهنيين في التخاطب وتعديل السلوك من جامعة عين شمس، بالإضافة إلى تدريب متخصص في طيف التوحد من قسم الإرشاد النفسي، بخبرة ريادية تتجاوز ١٥ سنة في التربية الخاصة وتأهيل الأطفال.",
    bioEn: "Senior Special Education Classroom Teacher at Raba Center. Holds a Bachelor's Degree and two Professional Diplomas in Speech-Language Therapy and Behavior Modification from Ain Shams University, with specialized training in autism counseling and over 15 years of distinguished teaching experience.",
    certifications: [
      "دبلوم مهني في التخاطب واضطرابات النطق - جامعة عين شمس",
      "دبلوم مهني في تعديل السلوك - جامعة عين شمس",
      "شهادة تدريبية معتمدة في التوحد - قسم الإرشاد النفسي"
    ],
    certificationsEn: [
      "Professional Diploma in Speech & Language Therapy - Ain Shams University",
      "Professional Diploma in Behavior Modification - Ain Shams University",
      "Autism Psychological Counseling Certification"
    ],
    availableDays: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"],
    availableDaysEn: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    rating: 4.98,
    reviewsCount: 240,
    sessionPrice: 0,
    focalPosition: "top",
    zoomLevel: 100,
    orderIndex: 15
  },
  {
    id: "spec-maryam-zahrani",
    name: "مريم الزهراني",
    nameEn: "Maryam Al-Zahrani",
    title: "المشرف الإداري لفرع النرجس",
    titleEn: "Administrative Supervisor - Al-Narjis Branch",
    role: "المشرف الإداري لفرع النرجس",
    roleEn: "Branch Administrative Supervisor",
    category: "psychology",
    department: "الإدارة التنفيذية والإشراف الإداري - فرع النرجس",
    avatar: "/specialists/cards/spec_maryam_zahrani.jpg",
    cardImage: "/specialists/cards/spec_maryam_zahrani.jpg",
    fallbackAvatar: "/specialists/cards/spec_maryam_zahrani.jpg",
    posterCrop: "/specialists/cards/spec_maryam_zahrani.jpg",
    portraitCrop: "/specialists/cards/spec_maryam_zahrani.jpg",
    experienceYears: 3,
    licenseNumber: "IPA Certified Leader",
    specialties: [
      "حاصلة على بكالوريوس إدارة الأعمال من جامعة الطائف",
      "حاصلة على دورة مهارات القيادة والإشراف الإداري من IPA",
      "حاصلة على دورة إدارة وتطوير فرق العمل من IPA",
      "حاصلة على دورة إدارة الأداء الوظيفي وتقييم الموظفين من IPA",
      "خبرة عملية أكثر من ٣ سنوات"
    ],
    specialtiesEn: [
      "Bachelor's Degree in Business Administration - Taif University",
      "Leadership & Administrative Supervision Certificate - Institute of Public Administration (IPA)",
      "Team Management & Development Certificate - IPA",
      "Job Performance Management & Evaluation Certificate - IPA",
      "3+ Years of Leadership Experience"
    ],
    education: [
      "حاصلة على بكالوريوس إدارة الأعمال من جامعة الطائف"
    ],
    educationEn: [
      "Bachelor's Degree in Business Administration - Taif University"
    ],
    bio: "المشرف الإداري لفرع النرجس بمركز رابا. حاصلة على بكالوريوس إدارة الأعمال من جامعة الطائف ومجموعة شهادات قيادية وإدارية متقدمة من معهد الإدارة العامة (IPA) تشمل الإشراف الإداري وتطوير فرق العمل وتقييم الأداء، بخبرة عملية تتجاوز ٣ سنوات.",
    bioEn: "Administrative Supervisor for Al-Narjis Branch at Raba Center. Holds a Bachelor's Degree in Business Administration from Taif University and advanced leadership credentials from the Institute of Public Administration (IPA), with over 3 years of executive branch oversight experience.",
    certifications: [
      "شهادة مهارات القيادة والإشراف الإداري - معهد الإدارة العامة (IPA)",
      "شهادة إدارة وتطوير فرق العمل - معهد الإدارة العامة (IPA)",
      "شهادة إدارة الأداء الوظيفي وتقييم الموظفين - معهد الإدارة العامة (IPA)"
    ],
    certificationsEn: [
      "Leadership & Administrative Supervision - Institute of Public Administration (IPA)",
      "Team Management & Development - IPA",
      "Performance Management & Staff Evaluation - IPA"
    ],
    availableDays: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"],
    availableDaysEn: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    rating: 4.95,
    reviewsCount: 110,
    sessionPrice: 0,
    focalPosition: "top",
    zoomLevel: 100,
    orderIndex: 16
  },
  {
    id: "spec-abrar-qahtani",
    name: "أبرار القحطاني",
    nameEn: "Abrar Al-Qahtani",
    title: "مشرفة قسم الـ ABA",
    titleEn: "ABA Department Supervisor | ABAT",
    role: "مشرفة قسم الـ ABA",
    roleEn: "ABA Department Supervisor",
    category: "aba",
    department: "قسم تحليل السلوك التطبيقي ABA",
    avatar: "/specialists/cards/spec_abrar_qahtani.jpg",
    cardImage: "/specialists/cards/spec_abrar_qahtani.jpg",
    fallbackAvatar: "/specialists/cards/spec_abrar_qahtani.jpg",
    posterCrop: "/specialists/cards/spec_abrar_qahtani.jpg",
    portraitCrop: "/specialists/cards/spec_abrar_qahtani.jpg",
    experienceYears: 9,
    licenseNumber: "ABAT Certified",
    specialties: [
      "حاصله على بكالوريوس التربية الخاصة من جامعة شقراء",
      "حاصلة على إعتماد البورد الأميريكي ABAT",
      "خبرة عملية أكثر من ٩ سنوات"
    ],
    specialtiesEn: [
      "Bachelor's Degree in Special Education - Shaqra University",
      "Applied Behavior Analysis Technician (ABAT) - American Board",
      "9+ Years of Clinical Experience"
    ],
    education: [
      "حاصله على بكالوريوس التربية الخاصة من جامعة شقراء"
    ],
    educationEn: [
      "Bachelor's Degree in Special Education - Shaqra University"
    ],
    bio: "مشرفة قسم الـ ABA بمركز رابا. حاصلة على بكالوريوس التربية الخاصة من جامعة شقراء، وحاصلة على اعتماد البورد الأمريكي ABAT. تمتلك خبرة سريرية وتطبيقية تتجاوز ٩ سنوات في إعداد البرامج السلوكية الفردية وإدارة الجلسات العلاجية ومتابعة تطور مهارات الأطفال.",
    bioEn: "ABA Department Supervisor at Raba Center. Holds a Bachelor's Degree in Special Education from Shaqra University and is certified by the American Board as an Applied Behavior Analysis Technician (ABAT), with over 9 years of dedicated clinical practice in autism and behavioral therapy.",
    certifications: [
      "اعتماد البورد الأمريكي ABAT (Applied Behavior Analysis Technician)",
      "بكالوريوس التربية الخاصة والتدخل المبكر - جامعة شقراء"
    ],
    certificationsEn: [
      "Applied Behavior Analysis Technician (ABAT) - American Board",
      "Special Education & Early Intervention Degree"
    ],
    availableDays: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"],
    availableDaysEn: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    rating: 4.97,
    reviewsCount: 185,
    sessionPrice: 0,
    focalPosition: "top",
    zoomLevel: 100,
    orderIndex: 17
  }
];

// 1. Read existing specialists from data/specialists.json
const dataPath = path.join(rootDir, 'data', 'specialists.json');
const publicDataPath = path.join(rootDir, 'public', 'data', 'specialists.json');

let existing = [];
if (fs.existsSync(dataPath)) {
  existing = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

// Remove any prior version of these 8 by ID
const newIds = new Set(newSpecialists.map(s => s.id));
const filtered = existing.filter(s => !newIds.has(s.id));

// Insert the new 8 specialists right after the core leadership (first 7)
const topLeaders = filtered.slice(0, 7);
const remainder = filtered.slice(7);
const combinedSpecialists = [...topLeaders, ...newSpecialists, ...remainder];

// Re-index orderIndex
combinedSpecialists.forEach((s, idx) => {
  s.orderIndex = idx;
});

// Save to data/specialists.json and public/data/specialists.json
fs.writeFileSync(dataPath, JSON.stringify(combinedSpecialists, null, 2), 'utf-8');
fs.writeFileSync(publicDataPath, JSON.stringify(combinedSpecialists, null, 2), 'utf-8');
console.log(`[Add-Specialists] Saved ${combinedSpecialists.length} specialists to data/ and public/data/`);

// 2. Also update src/data/mockData.ts
const mockDataPath = path.join(rootDir, 'src', 'data', 'mockData.ts');
let mockDataContent = fs.readFileSync(mockDataPath, 'utf-8');

// Replace SPECIALISTS array in mockData.ts
const startMarker = 'export const SPECIALISTS: Specialist[] = ';
const startIdx = mockDataContent.indexOf(startMarker);
if (startIdx !== -1) {
  // Find where the array ends (before export const SERVICES or next export)
  const afterStart = mockDataContent.slice(startIdx + startMarker.length);
  const nextExportMatch = afterStart.search(/\nexport const /);
  if (nextExportMatch !== -1) {
    const specialistsCode = JSON.stringify(combinedSpecialists, null, 2) + ';\n\n';
    mockDataContent = mockDataContent.slice(0, startIdx + startMarker.length) + specialistsCode + afterStart.slice(nextExportMatch + 1);
    fs.writeFileSync(mockDataPath, mockDataContent, 'utf-8');
    console.log(`[Add-Specialists] Updated SPECIALISTS in src/data/mockData.ts`);
  }
}

// 3. Update DOCTORS_DATA in src/components/DoctorCardSlider.tsx as well
const sliderPath = path.join(rootDir, 'src', 'components', 'DoctorCardSlider.tsx');
let sliderContent = fs.readFileSync(sliderPath, 'utf-8');

const docStartMarker = 'export const DOCTORS_DATA: Doctor[] = ';
const docStartIdx = sliderContent.indexOf(docStartMarker);
if (docStartIdx !== -1) {
  const afterDocStart = sliderContent.slice(docStartIdx + docStartMarker.length);
  const docNextExportMatch = afterDocStart.search(/\nexport const /);
  if (docNextExportMatch !== -1) {
    // Map new specialists to Doctor interface format
    const newDoctors = newSpecialists.map(s => ({
      id: s.id.replace('spec-', 'doc-'),
      name: s.name,
      arabicName: s.name,
      nameEn: s.nameEn,
      title: s.title,
      titleEn: s.titleEn,
      specialty: s.role,
      specialtyEn: s.roleEn,
      specialtyCode: s.role,
      specialtyCodeEn: s.roleEn,
      category: s.category || 'aba',
      department: s.department,
      avatar: s.avatar,
      image: s.avatar,
      fallbackAvatar: s.fallbackAvatar,
      rating: s.rating,
      reviewCount: s.reviewsCount,
      experienceYears: s.experienceYears,
      patientsCount: s.reviewsCount * 5,
      sessionPrice: 0,
      location: "الرياض",
      locationEn: "Riyadh",
      isAvailable: true,
      nextSlot: "متاح للحجز",
      nextSlotEn: "Available for booking",
      tags: s.specialties,
      bio: s.bio,
      isTopRated: false
    }));

    // Read existing doctors
    try {
      const existingDoctorsStr = afterDocStart.slice(0, docNextExportMatch).trim().replace(/;$/, '');
      const existingDoctors = JSON.parse(existingDoctorsStr);
      const filteredDocs = existingDoctors.filter(d => !newSpecialists.some(ns => ns.id.replace('spec-', 'doc-') === d.id));
      const combinedDocs = [...filteredDocs.slice(0, 7), ...newDoctors, ...filteredDocs.slice(7)];
      sliderContent = sliderContent.slice(0, docStartIdx + docStartMarker.length) + JSON.stringify(combinedDocs, null, 2) + ';\n\n' + afterDocStart.slice(docNextExportMatch + 1);
      fs.writeFileSync(sliderPath, sliderContent, 'utf-8');
      console.log(`[Add-Specialists] Updated DOCTORS_DATA in src/components/DoctorCardSlider.tsx`);
    } catch (e) {
      console.warn('Could not parse existing DOCTORS_DATA in DoctorCardSlider.tsx:', e);
    }
  }
}
