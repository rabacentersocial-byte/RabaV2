import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, 
  Heart, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft,
  ArrowRight,
  FileText, 
  Check,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Specialist } from '../types';
import { 
  getStoredSpecialistSettings, 
  SpecialistImageSetting,
  GlobalCardSettings,
  getStoredGlobalCardSettings,
  findCustomSettingForDoctor
} from '../data/specialistCustomizer';
import { getResolvedImageUrl, handleImageErrorWithStore } from '../utils/persistentImageStore';
import { isSameSpecialist, deduplicateDoctors, sortSpecialistsByPriority, normalizeSpecialistName } from '../utils/specialistDeduplication';
import { getSpecialistLogoTheme } from '../utils/specialistCardThemes';

// Doctor Interface
export interface Doctor {
  id: string;
  name: string;
  nameEn?: string;
  arabicName?: string;
  title: string;
  titleEn?: string;
  specialty: string;
  specialtyEn?: string;
  specialtyCode: string;
  specialtyCodeEn: string;
  category: 'all' | 'aba' | 'occupational' | 'speech' | 'psychology';
  department?: string;
  avatar: string;
  image?: string;
  fallbackAvatar?: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  patientsCount?: number;
  sessionPrice: number;
  location: string;
  locationEn: string;
  isAvailable: boolean;
  nextSlot: string;
  nextSlotEn: string;
  tags: string[];
  bio: string;
  isTopRated?: boolean;
}

// 40 Realistic Medical Specialists matching Raba Center
export const DOCTORS_DATA: Doctor[] = [
  {
    "id": "doc-hanaa-basheer",
    "name": "د. هناء بشير",
    "arabicName": "د. هناء بشير",
    "nameEn": "Dr. Hanaa Basheer",
    "title": "أخصائي نفسي أول / المدير الطبي لمراكز رابا",
    "titleEn": "Senior Clinical Psychologist & Medical Director",
    "specialty": "أخصائي نفسي أول / المدير الطبي لمراكز رابا",
    "specialtyEn": "Senior Clinical Psychologist & Medical Director",
    "specialtyCode": "أخصائي نفسي أول / المدير الطبي لمراكز رابا",
    "specialtyCodeEn": "Senior Clinical Psychologist & Medical Director",
    "category": "psychology",
    "department": "القسم الطبي والإرشاد النفسي الإكلينيكي",
    "avatar": "/uploads/1790827426491_50_png.png",
    "image": "/uploads/1790827426491_50_png.png",
    "fallbackAvatar": "/uploads/1790827426491_50_png.png",
    "rating": 4.98,
    "reviewCount": 320,
    "experienceYears": 15,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس علم النفس العام من جامعة النيلين",
      "حاصلة على ماجستير العلاج النفسي من جامعة النيلين",
      "حاصلة على دكتوراه في علم النفس تخصص داخلي سريري من جامعة الرباط الوطني",
      "حاصلة على دبلوم الإحتياجات الخاصة من جامعة النيلين",
      "حاصلة على دبلومة العلاج السلوكي المعرفي من جامعة القراءة في بريطانيا",
      "حاصلة على إعتماد بورد التشخيص الأميريكي لمقياس ADOS-2",
      "عضو في الجمعية النفسية الأمريكية APA",
      "إستشاري علم النفس في المجلس القومي للمهن الطبية و الصحية بالسودان",
      "خبرة عملية أكثر من ١٥ سنة"
    ],
    "bio": "أخصائي نفسي أول / المدير الطبي لمراكز رابا بمركز رابا. حاصلة على بكالوريوس علم النفس العام من جامعة النيلين · حاصلة على ماجستير العلاج النفسي من جامعة النيلين · حاصلة على دكتوراه في علم النفس تخصص داخلي سريري من جامعة الرباط الوطني · حاصلة على دبلوم الإحتياجات الخاصة من جامعة النيلين · حاصلة على دبلومة العلاج السلوكي المعرفي من جامعة القراءة في بريطانيا · حاصلة على إعتماد بورد التشخيص الأميريكي لمقياس ADOS-2 · عضو في الجمعية النفسية الأمريكية APA · إستشاري علم النفس في المجلس القومي للمهن الطبية و الصحية بالسودان · خبرة عملية أكثر من ١٥ سنة",
    "isTopRated": false
  },
  {
    "id": "doc-ahmed-abouzeid",
    "name": "احمد أبو زيد أنور",
    "arabicName": "احمد أبو زيد أنور",
    "nameEn": "Ahmed Abouzeid Anwar",
    "title": "مدير برامج التأهيل ورئيس قسم الـ ABA",
    "titleEn": "General Director of Rehabilitation | Head of ABA",
    "specialty": "مدير برامج التأهيل ورئيس قسم الـ ABA",
    "specialtyEn": "General Director of Programs & Head of ABA",
    "specialtyCode": "المدير العام للبرامج التأهيلية | رئيس قسم ABA",
    "specialtyCodeEn": "General Director of Rehabilitation | Head of ABA",
    "category": "aba",
    "avatar": "/uploads/1790826219680_16_png.png",
    "image": "/uploads/1790826219680_16_png.png",
    "fallbackAvatar": "/uploads/1790826219680_16_png.png",
    "rating": 4.95,
    "reviewCount": 220,
    "experienceYears": 12,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل على درجة الـ ليسانس في التربية من جامعه أسيوط",
      "حاصل على ماجستير في التوحد من جامعة دمنهور",
      "محلل سلوكي معتمد من البورد الأميريكي  من منظمات QBA / IBA",
      "مقدم كورسات معتمد من البورد الأمريكي لجميع مستويات الاعتماد",
      "QBA/ QASP-S/ ABAT",
      "حاصل كورس في منهج تقييم PEAK",
      "حاصل على كورس في آداة تقييم VB-MAPP",
      "خبرة عملية أكثر من ١٢ سنة"
    ],
    "bio": "مدير برامج التأهيل ورئيس قسم الـ ABA بمركز رابا. حاصل على درجة الـ ليسانس في التربية من جامعه أسيوط · حاصل على ماجستير في التوحد من جامعة دمنهور · محلل سلوكي معتمد من البورد الأميريكي  من منظمات QBA / IBA · مقدم كورسات معتمد من البورد الأمريكي لجميع مستويات الاعتماد · QBA/ QASP-S/ ABAT · حاصل كورس في منهج تقييم PEAK · حاصل على كورس في آداة تقييم VB-MAPP · خبرة عملية أكثر من ١٢ سنة",
    "isTopRated": true
  },
  {
    "id": "doc-hesham-ali",
    "name": "هشام علي",
    "arabicName": "هشام علي",
    "nameEn": "Hesham Ali",
    "title": "رئيس قسم النطق والتخاطب",
    "titleEn": "Head of Speech and Language Department",
    "specialty": "رئيس قسم النطق والتخاطب",
    "specialtyEn": "Head of Speech & Language Pathology Department",
    "specialtyCode": "رئيس قسم النطق والتخاطب",
    "specialtyCodeEn": "Head of Speech and Language Department",
    "category": "speech",
    "department": "قسم النطق والتخاطب واضطرابات التواصل",
    "avatar": "/uploads/1791187379881_60_png.png",
    "image": "/uploads/1791187379881_60_png.png",
    "fallbackAvatar": "/uploads/1791187379881_60_png.png",
    "rating": 4.97,
    "reviewCount": 230,
    "experienceYears": 20,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "رئيس قسم النطق والتخاطب بمراكز رابا",
      "بكالوريوس التربية الخاصة - جامعة عين شمس",
      "تمهيدي ماجستير في اضطرابات النطق والكلام",
      "علاج التلعثم واضطرابات مخارج الحروف والنمو اللغوي",
      "خبرة عملية أكثر من 20 سنة"
    ],
    "bio": "رئيس قسم النطق والتخاطب بمراكز رابا. خبير واستشاري علاج اضطرابات النطق والكلام وتأخر النمو اللغوي والعيّ والتلعثم، حاصل على بكالوريوس وتمهيدي ماجستير اضطرابات النطق والكلام من جامعة عين شمس بخبرة سريرية تفوق 20 عاماً.",
    "isTopRated": false
  },
  {
    "id": "doc-haneen-obaidi",
    "name": "حنين العبيدي",
    "arabicName": "حنين العبيدي",
    "nameEn": "Haneen Al-Obaidi",
    "title": "رئيس قسم العلاج الوظيفي",
    "titleEn": "Head of Occupational Therapy Department",
    "specialty": "رئيس قسم العلاج الوظيفي",
    "specialtyEn": "Head of Occupational Therapy Department",
    "specialtyCode": "رئيس قسم العلاج الوظيفي",
    "specialtyCodeEn": "Head of Occupational Therapy Department",
    "category": "occupational",
    "avatar": "/uploads/1790357520279_________________jpg_jpeg.jpg",
    "image": "/uploads/1790357520279_________________jpg_jpeg.jpg",
    "fallbackAvatar": "/uploads/1790357520279_________________jpg_jpeg.jpg",
    "rating": 4.95,
    "reviewCount": 240,
    "experienceYears": 11,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس العلاج الوظيفي",
      "من الجامعه الهاشمية",
      "حاصلة على شهادة ايرس العالمية في التكامل الحسّي",
      "حاصلة على شهادة Floortime 101",
      "مرخصه في اختبار EASI للتكامل الحسّي",
      "عضو في الجمعية الأردنية للعلاج الوظيفي",
      "حاصلة على ترخيص الهيئة السعودية للتخصصات الصحية",
      "متخصصه في تقييم وعلاج المشاكل الحسية والتحديات النمائية لدى الاطفال",
      "خبرة عملية أكثر من ١١ سنة"
    ],
    "bio": "رئيس قسم العلاج الوظيفي بمركز رابا. حاصلة على بكالوريوس العلاج الوظيفي · من الجامعه الهاشمية · حاصلة على شهادة ايرس العالمية في التكامل الحسّي · حاصلة على شهادة Floortime 101 · مرخصه في اختبار EASI للتكامل الحسّي · عضو في الجمعية الأردنية للعلاج الوظيفي · حاصلة على ترخيص الهيئة السعودية للتخصصات الصحية · متخصصه في تقييم وعلاج المشاكل الحسية والتحديات النمائية لدى الاطفال · خبرة عملية أكثر من ١١ سنة",
    "isTopRated": true
  },
  {
    "id": "doc-amer-qadoos",
    "name": "عامر قادوس",
    "arabicName": "عامر قادوس",
    "nameEn": "Amer Qadous",
    "title": "أخصائي التأهيل العصبي",
    "titleEn": "Neuro-Rehabilitation Specialist",
    "specialty": "أخصائي التأهيل العصبي ومحلل سلوك دولي IBA",
    "specialtyEn": "Neuro-Rehabilitation Specialist & Behavior Analyst (IBA)",
    "specialtyCode": "أخصائي التأهيل العصبي",
    "specialtyCodeEn": "Neuro-Rehabilitation Specialist",
    "category": "psychology",
    "department": "قسم النطق والتخاطب والتأهيل السمعي",
    "avatar": "/uploads/1791187395677_61_png.png",
    "image": "/uploads/1791187395677_61_png.png",
    "fallbackAvatar": "/uploads/1791187395677_61_png.png",
    "rating": 4.95,
    "reviewCount": 185,
    "experienceYears": 10,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "أخصائي التأهيل العصبي وباحث علم النفس العصبي",
      "محلل سلوك دولي معتمد IBA من منظمة IBAO",
      "البورد الدولي للعلاجات النفسية ACT - CBT - DBT من جامعة نيفادا",
      "البورد البريطاني لمقاييس الذكاء والقدرات العقلية",
      "معتمد ساعات CME بالهيئة السعودية للتخصصات الصحية",
      "خبرة عملية أكثر من 10 سنوات في فرنسا وبريطانيا"
    ],
    "bio": "أخصائي التأهيل العصبي وباحث ماجستير في علم النفس العصبي. محلل سلوك دولي معتمد IBA وحاصل على البورد الدولي للعلاجات النفسية (ACT, CBT, DBT) من جامعة نيفادا والبورد البريطاني للقدرات العقلية، بخبرة أكثر من 10 سنوات في مراكز التأهيل بفرنسا وبريطانيا.",
    "isTopRated": false
  },
  {
    "id": "doc-doha-khaled",
    "name": "ضحى خالد",
    "arabicName": "ضحى خالد",
    "nameEn": "Doha Khaled",
    "title": "إشراف قسم الـ ABA",
    "titleEn": "Supervisor of ABA Department",
    "specialty": "مشرفة قسم تحليل السلوك التطبيقي ومحلل سلوكي معتمد",
    "specialtyEn": "ABA Supervisor & Certified Behavior Analyst",
    "specialtyCode": "إشراف قسم الـ ABA",
    "specialtyCodeEn": "Supervisor of ABA Department",
    "category": "aba",
    "avatar": "/uploads/1790357539758_____________jpg_jpeg.jpg",
    "image": "/uploads/1790357539758_____________jpg_jpeg.jpg",
    "fallbackAvatar": "/uploads/1790357539758_____________jpg_jpeg.jpg",
    "rating": 4.9,
    "reviewCount": 195,
    "experienceYears": 9,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "بكالوريوس تربية خاصة من الجامعة العربية",
      "مشرف اخصائي توحد معتمد من البورد الامريكي من منظمة QABA",
      "حاصلة على محلل سلوكي معتمد من منظمة IBAO",
      "خبرة أكثر من 9 سنوات في رعاية وتأهيل التوحد"
    ],
    "bio": "مشرفة قسم ABA بمركز رابا، حاصلة على بكالوريوس تربية خاصة من الجامعة العربية، ومشرف أخصائي توحد معتمد من البورد الأمريكي من منظمة QABA، ومحلل سلوكي معتمد من منظمة IBAO بخبرة تزيد عن 9 سنوات في الإشراف الإكلينيكي وتأهيل مهارات أطفال طيف التوحد.",
    "isTopRated": true
  },
  {
    "id": "doc-heshmah-mutairi",
    "name": "حشمة المطيري",
    "arabicName": "حشمة المطيري",
    "nameEn": "Heshmah Al-Mutairi",
    "title": "المدير الإداري لفرع الربوة",
    "titleEn": "Administrative Director - Al-Rabwah Branch",
    "specialty": "المدير الإداري لفرع الربوة",
    "specialtyEn": "Administrative Director & Certified Applied Behavior Analyst (ABAT)",
    "specialtyCode": "المدير الإداري لفرع الربوة",
    "specialtyCodeEn": "Administrative Director - Al-Rabwah Branch",
    "category": "aba",
    "department": "إدارة الفروع وتطوير البرامج السلوكية",
    "avatar": "/uploads/1790866017691_17_png.png",
    "image": "/uploads/1790866017691_17_png.png",
    "fallbackAvatar": "/uploads/1790866017691_17_png.png",
    "rating": 4.96,
    "reviewCount": 190,
    "experienceYears": 7,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس التربية الخاصة  تخصص صعوبات التعلم من جامعة الملك فيصل",
      "فني تحليل سلوك تطبيقي معتمد ABAT",
      "خبرة عملية أكثر من ٧ سنوات"
    ],
    "bio": "المدير الإداري لفرع الربوة بمركز رابا. حاصلة على بكالوريوس التربية الخاصة  تخصص صعوبات التعلم من جامعة الملك فيصل · فني تحليل سلوك تطبيقي معتمد ABAT · خبرة عملية أكثر من ٧ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-rahaf-doghmani",
    "name": "رهف الدغماني",
    "arabicName": "رهف الدغماني",
    "nameEn": "Rahaf Al-Doghmani",
    "title": "مشرفة قسم الـ ABA",
    "titleEn": "Supervisor of ABA Department",
    "specialty": "مشرفة قسم الـ ABA",
    "specialtyEn": "Supervisor of ABA Department & QABA Analyst",
    "specialtyCode": "إشراف قسم الـ ABA",
    "specialtyCodeEn": "Supervisor of ABA Department",
    "category": "aba",
    "avatar": "/uploads/1790357530423_________________jpg_jpeg.jpg",
    "image": "/uploads/1790357530423_________________jpg_jpeg.jpg",
    "fallbackAvatar": "/uploads/1790357530423_________________jpg_jpeg.jpg",
    "rating": 4.9,
    "reviewCount": 175,
    "experienceYears": 6,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس الإعاقة السمعية من جامعة القصيم",
      "حاصلة على ماجستير في الإضطرابات السلوكية والإنفعالية من جامعة الملك سعود.",
      "حاصلة على شهادة محلل سلوك معتمد QBA من البورد الأميريكي من منظمة QABA.",
      "خبرة عملية أكثر من ٦ سنوات"
    ],
    "bio": "مشرفة قسم الـ ABA بمركز رابا. حاصلة على بكالوريوس الإعاقة السمعية من جامعة القصيم · حاصلة على ماجستير في الإضطرابات السلوكية والإنفعالية من جامعة الملك سعود. · حاصلة على شهادة محلل سلوك معتمد QBA من البورد الأميريكي من منظمة QABA. · خبرة عملية أكثر من ٦ سنوات",
    "isTopRated": true
  },
  {
    "id": "doc-manar-wahba",
    "name": "منار وهبه",
    "arabicName": "منار وهبه",
    "nameEn": "Manar Wahba",
    "title": "إشراف قسم النطق والتخاطب",
    "titleEn": "Supervisor of Speech & Language Pathology Department",
    "specialty": "مشرفة قسم النطق والتخاطب والتأهيل اللغوي",
    "specialtyEn": "Speech & Language Pathology Supervisor",
    "specialtyCode": "إشراف قسم النطق والتخاطب",
    "specialtyCodeEn": "Supervisor of Speech & Language Pathology Department",
    "category": "speech",
    "avatar": "/uploads/1790357549806______________jpg_jpeg.jpg",
    "image": "/uploads/1790357549806______________jpg_jpeg.jpg",
    "fallbackAvatar": "/uploads/1790357549806______________jpg_jpeg.jpg",
    "rating": 4.88,
    "reviewCount": 182,
    "experienceYears": 10,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "بكالوريوس خدمة اجتماعية جامعة القاهرة",
      "دبلومة تخاطب جامعة عين شمس",
      "دبلومة تربية خاصة علوم إعاقة جامعة الزقازيق",
      "متخصصة opt ومشاكل نطق وسمع",
      "شهادة opt من منظمة ASHA الأمريكية",
      "خبرة أكثر من 10 سنوات في علاج النطق واللغة"
    ],
    "bio": "مشرفة قسم النطق والتخاطب بمركز رابا. حاصلة على بكالوريوس خدمة اجتماعية من جامعة القاهرة، دبلومة تخاطب من جامعة عين شمس، دبلومة تربية خاصة علوم إعاقة من جامعة الزقازيق، ومتخصصة في العلاج الوظيفي الفموي opt ومشاكل النطق والسمع وحاصلة على شهادة opt من منظمة ASHA الأمريكية بخبرة تتجاوز 10 سنوات.",
    "isTopRated": false
  },
  {
    "id": "doc-ahmed-fathi",
    "name": "أحمد فتحي",
    "arabicName": "أحمد فتحي",
    "nameEn": "Ahmed Fathi",
    "title": "أخصائي ABA",
    "titleEn": "ABA Specialist",
    "specialty": "أخصائي تحليل السلوك التطبيقي المعتمد ABAT",
    "specialtyEn": "ABA Specialist & Board Certified ABAT",
    "specialtyCode": "أخصائي ABA",
    "specialtyCodeEn": "ABA Specialist",
    "category": "aba",
    "avatar": "/uploads/1790357579245_______________jpg_jpeg.jpg",
    "image": "/uploads/1790357579245_______________jpg_jpeg.jpg",
    "fallbackAvatar": "/uploads/1790357579245_______________jpg_jpeg.jpg",
    "rating": 4.85,
    "reviewCount": 168,
    "experienceYears": 8,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل علي بكالوريوس التربية الخاصة من جامعة حلوان",
      "حاصل علي دبلوم مهني في إضطرابات التواصل والتخاطب من جامعة عين شمس",
      "حاصل علي اعتماد البورد الأميريكي في تحليل السلوك التطبيقي ABAT",
      "خبرة عملية أكثر من ٨ سنوات"
    ],
    "bio": "أخصائي معتمد بمركز رابا. حاصل علي بكالوريوس التربية الخاصة من جامعة حلوان · حاصل علي دبلوم مهني في إضطرابات التواصل والتخاطب من جامعة عين شمس · حاصل علي اعتماد البورد الأميريكي في تحليل السلوك التطبيقي ABAT · خبرة عملية أكثر من ٨ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-mohamed-atef",
    "name": "محمد عاطف",
    "arabicName": "محمد عاطف",
    "nameEn": "Mohamed Atef",
    "title": "أخصائي ABA",
    "titleEn": "ABA Specialist",
    "specialty": "أخصائي ABA",
    "specialtyEn": "ABA Specialist & Qualified Autism Services Supervisor (QASP-S)",
    "specialtyCode": "أخصائي ABA",
    "specialtyCodeEn": "ABA Specialist",
    "category": "aba",
    "avatar": "/uploads/1790357588113______________jpg_jpeg.jpg",
    "image": "/uploads/1790357588113______________jpg_jpeg.jpg",
    "fallbackAvatar": "/uploads/1790357588113______________jpg_jpeg.jpg",
    "rating": 4.88,
    "reviewCount": 154,
    "experienceYears": 5,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل علي بكالوريوس علوم الاعاقه",
      "والتأهيل من جامعة الزقازيق",
      "حاصل على دبلوم خاص في الإعاقة العقلية من كلية علوم الإعاقة والتأهيل من جامعة الزقازيق",
      "حاصل على دورات في برنامج VB-MAPP",
      "مشرف توحد مؤهل من منظمة QASP-S",
      "خبره عملية أكثر من ٥ سنوات"
    ],
    "bio": "أخصائي ABA بمركز رابا. حاصل علي بكالوريوس علوم الاعاقه · والتأهيل من جامعة الزقازيق · حاصل على دبلوم خاص في الإعاقة العقلية من كلية علوم الإعاقة والتأهيل من جامعة الزقازيق · حاصل على دورات في برنامج VB-MAPP · مشرف توحد مؤهل من منظمة QASP-S · خبره عملية أكثر من ٥ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-sadeem-mshari",
    "name": "سديم احمد المشاري",
    "arabicName": "سديم احمد المشاري",
    "nameEn": "Sadeem Ahmed Al-Mashari",
    "title": "أخصائية ABA",
    "titleEn": "ABA Specialist",
    "specialty": "أخصائية ABA",
    "specialtyEn": "ABA Specialist & SCFHS Licensed Psychologist",
    "specialtyCode": "أخصائي ABA",
    "specialtyCodeEn": "ABA Specialist",
    "category": "aba",
    "avatar": "/uploads/1790357598308______________________jpg_jpeg.jpg",
    "image": "/uploads/1790357598308______________________jpg_jpeg.jpg",
    "fallbackAvatar": "/uploads/1790357598308______________________jpg_jpeg.jpg",
    "rating": 4.9,
    "reviewCount": 142,
    "experienceYears": 990,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس علم النفس من جامعة الأميرة نورة بنت عبدالرحمن",
      "حاصلة على رخصة ABAT من البورد الأميريكي QABA",
      "حاصلة على دبلوم المقاييس النفسية من أكاديمية النخبة الدولية",
      "حاصلة على دورة التدريب على تطبيق وتصحيح مقياس ستانفورد بينيه للذكاء الصورة الخامسة",
      "عضو مجلس إدارة في الجمعية العلمية السعودية للإرشاد النفسي",
      "خبرة تطوعية عامة وصحية لما يقارب ٩٩٠ ساعة",
      "حاصلة على دورة التقييم والتشخيص للإضطرابات النفسية من هيئة الصحة العامة (وقاية)",
      "حاصلة على مبادئ الذكاء الإصطناعي من سدايا",
      "خبرة عملية أكثر من عام"
    ],
    "bio": "أخصائية ABA بمركز رابا. حاصلة على بكالوريوس علم النفس من جامعة الأميرة نورة بنت عبدالرحمن · حاصلة على رخصة ABAT من البورد الأميريكي QABA · حاصلة على دبلوم المقاييس النفسية من أكاديمية النخبة الدولية · حاصلة على دورة التدريب على تطبيق وتصحيح مقياس ستانفورد بينيه للذكاء الصورة الخامسة · عضو مجلس إدارة في الجمعية العلمية السعودية للإرشاد النفسي · خبرة تطوعية عامة وصحية لما يقارب ٩٩٠ ساعة · حاصلة على دورة التقييم والتشخيص للإضطرابات النفسية من هيئة الصحة العامة (وقاية) · حاصلة على مبادئ الذكاء الإصطناعي من سدايا · خبرة عملية أكثر من عام",
    "isTopRated": true
  },
  {
    "id": "doc-maram-mohamed",
    "name": "مرام محمد",
    "arabicName": "مرام محمد",
    "nameEn": "Maram Mohamed",
    "title": "أخصائية ABA",
    "titleEn": "ABA Specialist",
    "specialty": "أخصائية تحليل السلوك التطبيقي وعلم النفس الإكلينيكي",
    "specialtyEn": "ABA Specialist & Clinical Psychologist",
    "specialtyCode": "أخصائية ABA",
    "specialtyCodeEn": "ABA Specialist",
    "category": "aba",
    "avatar": "/uploads/1790357606704______________jpg_jpeg.jpg",
    "image": "/uploads/1790357606704______________jpg_jpeg.jpg",
    "fallbackAvatar": "/uploads/1790357606704______________jpg_jpeg.jpg",
    "rating": 4.85,
    "reviewCount": 130,
    "experienceYears": 3,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "بكالوريوس علم النفس الإكلينيكي جامعة الرباط الوطني",
      "اعتماد البورد الأمريكي ABAT",
      "متخصصة في العلاج عن طريق تحليل السلوك التطبيقي (ABA)",
      "خبرة أكثر من 3 سنوات في الجلسات السلوكية"
    ],
    "bio": "أخصائية تحليل السلوك التطبيقي (ABA) بمركز رابا. حاصلة على بكالوريوس علم النفس الإكلينيكي من جامعة الرباط الوطني، وحاصلة على اعتماد البورد الأمريكي ABAT من منظمة QABA، متخصصة في العلاج والتأهيل عن طريق تحليل السلوك التطبيقي (ABA) للأطفال بخبرة تتجاوز 3 سنوات.",
    "isTopRated": false
  },
  {
    "id": "doc-ahmed-raad",
    "name": "أحمد رعد",
    "arabicName": "أحمد رعد",
    "nameEn": "Ahmed Raad",
    "title": "أخصائي ABA",
    "titleEn": "ABA Specialist",
    "specialty": "أخصائي ABA",
    "specialtyEn": "ABA Specialist & Health Sciences Graduate",
    "specialtyCode": "أخصائي ABA",
    "specialtyCodeEn": "ABA Specialist",
    "category": "aba",
    "avatar": "/uploads/1790357615959______________jpg_jpeg.jpg",
    "image": "/uploads/1790357615959______________jpg_jpeg.jpg",
    "fallbackAvatar": "/uploads/1790357615959______________jpg_jpeg.jpg",
    "rating": 4.82,
    "reviewCount": 125,
    "experienceYears": 2,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل على درجة البكالوريوس من جامعة حمص",
      "حاصل على إعتماد ABAT في تحليل السلوك التطبيقي من QABA",
      "خبرة عملية أكثر من سنتين"
    ],
    "bio": "أخصائي ABA بمركز رابا. حاصل على درجة البكالوريوس من جامعة حمص · حاصل على إعتماد ABAT في تحليل السلوك التطبيقي من QABA · خبرة عملية أكثر من سنتين",
    "isTopRated": false
  },
  {
    "id": "doc-mohamed-saad",
    "name": "محمد سعد",
    "arabicName": "محمد سعد",
    "nameEn": "Mohamed Saad",
    "title": "أخصائي النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "specialty": "أخصائي النطق والتخاطب",
    "specialtyEn": "Speech & Language Pathologist & Early Intervention Lead",
    "specialtyCode": "أخصائي النطق والتخاطب",
    "specialtyCodeEn": "Speech & Language Pathologist",
    "category": "speech",
    "avatar": "/uploads/1790826142955_1_png.png",
    "image": "/uploads/1790826142955_1_png.png",
    "fallbackAvatar": "/uploads/1790826142955_1_png.png",
    "rating": 4.93,
    "reviewCount": 195,
    "experienceYears": 8,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل على بكالوريوس التربية الخاصة من جامعة حلوان",
      "حاصل علي دورة تدريبية في OPT معتمده من Talk Tools",
      "حاصل علي ٤٠ ساعة معتمدة في الـ ABA",
      "خبرة عملية أكثر من ٨ سنوات"
    ],
    "bio": "أخصائي النطق والتخاطب بمركز رابا. حاصل على بكالوريوس التربية الخاصة من جامعة حلوان · حاصل علي دورة تدريبية في OPT معتمده من Talk Tools · حاصل علي ٤٠ ساعة معتمدة في الـ ABA · خبرة عملية أكثر من ٨ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-alzahraa-farag",
    "name": "الزهراء فرج",
    "arabicName": "الزهراء فرج",
    "nameEn": "Al-Zahraa Farag",
    "title": "أخصائي نفسي إكلينيكي",
    "titleEn": "Clinical Psychologist",
    "specialty": "أخصائي نفسي إكلينيكي",
    "specialtyEn": "Clinical Child Psychologist & Behavioral Assessment Specialist",
    "specialtyCode": "أخصائية نفسية إكلينيكية",
    "specialtyCodeEn": "Clinical Psychologist",
    "category": "psychology",
    "avatar": "/uploads/1790826125079_2_png.png",
    "image": "/uploads/1790826125079_2_png.png",
    "fallbackAvatar": "/uploads/1790826125079_2_png.png",
    "rating": 4.91,
    "reviewCount": 182,
    "experienceYears": 10,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على ليسانس اداب وتربية من جامعة عين شمس",
      "حاصلة على دبلوم التشخيص والقياس النفسي من جامعة عين شمس",
      "حاصلة على دبلوم الأمراض النفسية والسلوكية من الجامعة الأمريكية",
      "خبرة عملية أكثر من ١٠ سنوات"
    ],
    "bio": "أخصائي نفسي إكلينيكي بمركز رابا. حاصلة على ليسانس اداب وتربية من جامعة عين شمس · حاصلة على دبلوم التشخيص والقياس النفسي من جامعة عين شمس · حاصلة على دبلوم الأمراض النفسية والسلوكية من الجامعة الأمريكية · خبرة عملية أكثر من ١٠ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-noura-elbasyouni",
    "name": "د/ نورا البسيوني",
    "arabicName": "د/ نورا البسيوني",
    "nameEn": "Dr. Noura El-Basyouni",
    "title": "أخصائية نفسية",
    "titleEn": "Ph.D. Pediatric Psychologist",
    "specialty": "أخصائية نفسية",
    "specialtyEn": "Ph.D. in Clinical Child Psychology & Autism Specialist",
    "specialtyCode": "أخصائية نفسية",
    "specialtyCodeEn": "Ph.D. Pediatric Psychologist",
    "category": "psychology",
    "avatar": "/uploads/1790826321411_3_png.png",
    "image": "/uploads/1790826321411_3_png.png",
    "fallbackAvatar": "/uploads/1790826321411_3_png.png",
    "rating": 4.95,
    "reviewCount": 215,
    "experienceYears": 10,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على ليسانس الآداب والتربية قسم علم النفس من جامعة كفر الشيخ",
      "حاصلة على ماجستير في علم النفس من كلية التربية من جامعة كفر الشيخ",
      "حاصلة على دكتوراه في علم النفس تخصص أطفال التوحد من كلية التربية من جامعة كفر الشيخ",
      "حاصله على تصنيف مهني ساري من الهيئة السعودية للتخصصات الصحية",
      "خبره عملية أكثر من ١٠ سنوات بالمجال النفسي وتعديل السلوك بمنهجيه الـ APA"
    ],
    "bio": "أخصائية نفسية بمركز رابا. حاصلة على ليسانس الآداب والتربية قسم علم النفس من جامعة كفر الشيخ · حاصلة على ماجستير في علم النفس من كلية التربية من جامعة كفر الشيخ · حاصلة على دكتوراه في علم النفس تخصص أطفال التوحد من كلية التربية من جامعة كفر الشيخ · حاصله على تصنيف مهني ساري من الهيئة السعودية للتخصصات الصحية · خبره عملية أكثر من ١٠ سنوات بالمجال النفسي وتعديل السلوك بمنهجيه الـ APA",
    "isTopRated": false
  },
  {
    "id": "doc-asmaa-moustafa",
    "name": "أسماء مصطفى",
    "arabicName": "أسماء مصطفى",
    "nameEn": "Asmaa Moustafa",
    "title": "مشرفة قسم الـ ABA",
    "titleEn": "ABA Department Supervisor",
    "specialty": "مشرفة قسم الـ ABA",
    "specialtyEn": "ABA Supervisor & International Behavior Analyst (QBA / IBA)",
    "specialtyCode": "مشرفة قسم الـ ABA",
    "specialtyCodeEn": "ABA Department Supervisor",
    "category": "aba",
    "avatar": "/uploads/1790826279297_4_png.png",
    "image": "/uploads/1790826279297_4_png.png",
    "fallbackAvatar": "/uploads/1790826279297_4_png.png",
    "rating": 4.96,
    "reviewCount": 230,
    "experienceYears": 10,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على ليسانس اداب علم إجتماع من جامعة سوهاج",
      "حاصلة على ماجستير في التربية الخاصة تخصص التوحد من جامعة أسيوط",
      "باحثة دكتوراة في التربية الخاصة تخصص توحد",
      "محلل سلوك دولي معتمد QBA-IBA",
      "ممارس إدارة السلوك التنظيمي OBM-p",
      "خبرة عملية أكثر من ١٠ سنوات"
    ],
    "bio": "مشرفة قسم الـ ABA بمركز رابا. حاصلة على ليسانس اداب علم إجتماع من جامعة سوهاج · حاصلة على ماجستير في التربية الخاصة تخصص التوحد من جامعة أسيوط · باحثة دكتوراة في التربية الخاصة تخصص توحد · محلل سلوك دولي معتمد QBA-IBA · ممارس إدارة السلوك التنظيمي OBM-p · خبرة عملية أكثر من ١٠ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-ayman-elhoweity",
    "name": "أيمن عطية الحويطي",
    "arabicName": "أيمن عطية الحويطي",
    "nameEn": "Ayman Attia Al-Howeity",
    "title": "أخصائي ABA",
    "titleEn": "Behavior Analyst (BACB / TOT)",
    "specialty": "أخصائي ABA",
    "specialtyEn": "ABA Specialist, BACB Licensed & Certified TOT",
    "specialtyCode": "أخصائي ABA",
    "specialtyCodeEn": "Behavior Analyst (BACB / TOT)",
    "category": "aba",
    "avatar": "/uploads/1790826241596_5_png.png",
    "image": "/uploads/1790826241596_5_png.png",
    "fallbackAvatar": "/uploads/1790826241596_5_png.png",
    "rating": 4.88,
    "reviewCount": 170,
    "experienceYears": 10,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل على بكالوريوس التربية الخاصة من جامعة حلوان",
      "حاصل على دراسات عليا في التربية الخاصة من جامعة حلوان",
      "حاصل على رخصة البورد الأمريكي من بورد BACB",
      "ممارس توحد مرخص من هيئة قياس",
      "مدرب مدربين معتمد TOT",
      "خبرة عملية أكثر من ١٠ سنوات"
    ],
    "bio": "أخصائي ABA بمركز رابا. حاصل على بكالوريوس التربية الخاصة من جامعة حلوان · حاصل على دراسات عليا في التربية الخاصة من جامعة حلوان · حاصل على رخصة البورد الأمريكي من بورد BACB · ممارس توحد مرخص من هيئة قياس · مدرب مدربين معتمد TOT · خبرة عملية أكثر من ١٠ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-mohamed-bakry",
    "name": "محمد بكري",
    "arabicName": "محمد بكري",
    "nameEn": "Mohamed Bakry",
    "title": "أخصائي علاج وظيفي وتكامل حسّي / سيكوموتر",
    "titleEn": "Occupational & Sensory Therapist",
    "specialty": "أخصائي علاج وظيفي وتكامل حسّي / سيكوموتر",
    "specialtyEn": "Occupational Therapist & Sensory Integration Practitioner",
    "specialtyCode": "أخصائي العلاج الوظيفي والتكامل الحسي",
    "specialtyCodeEn": "Occupational & Sensory Therapist",
    "category": "occupational",
    "avatar": "/uploads/1790826439548_6_png.png",
    "image": "/uploads/1790826439548_6_png.png",
    "fallbackAvatar": "/uploads/1790826439548_6_png.png",
    "rating": 4.87,
    "reviewCount": 145,
    "experienceYears": 6,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل علي بكالوريوس التربية البدنية تخصص الرياضة المدرسية لذوي الاحتياجات الخاصة من جامعة بني سويف",
      "حاصل على ماجستير علوم الصحة الرياضية من جامعة بني سويف",
      "حاصل على دبلومة علاج وظيفي من جامعة طنطا",
      "حاصل على كورس للعلاج الوظيفي مع د/رباب الشاعر",
      "حاصل على كورس في التكامل الحسّي مع د/دعاء عبد اللطيف",
      "حاصل على كورس إعداد أخصائي تكامل حسي مع د/محمود المغربي",
      "حاصل على كورس السيكوموتر ( التدريبات النفس حركية ) مع د/محمد صبري وهبة",
      "حاصل على كورس الإصابات الرياضية والتأهيل الحركي من وزارة الشباب والرياضة بمصر",
      "حاصل على دورة في تحليل السلوك التطبيقي ABA لمدة ٤٠ ساعة",
      "خبرة عملية أكثر من ٦ سنوات"
    ],
    "bio": "أخصائي علاج وظيفي وتكامل حسّي / سيكوموتر بمركز رابا. حاصل علي بكالوريوس التربية البدنية تخصص الرياضة المدرسية لذوي الاحتياجات الخاصة من جامعة بني سويف · حاصل على ماجستير علوم الصحة الرياضية من جامعة بني سويف · حاصل على دبلومة علاج وظيفي من جامعة طنطا · حاصل على كورس للعلاج الوظيفي مع د/رباب الشاعر · حاصل على كورس في التكامل الحسّي مع د/دعاء عبد اللطيف · حاصل على كورس إعداد أخصائي تكامل حسي مع د/محمود المغربي · حاصل على كورس السيكوموتر ( التدريبات النفس حركية ) مع د/محمد صبري وهبة · حاصل على كورس الإصابات الرياضية والتأهيل الحركي من وزارة الشباب والرياضة بمصر · حاصل على دورة في تحليل السلوك التطبيقي ABA لمدة ٤٠ ساعة · خبرة عملية أكثر من ٦ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-anwar-elmaghyouli",
    "name": "أنوار المغيولي",
    "arabicName": "أنوار المغيولي",
    "nameEn": "Anwar Al-Maghyouli",
    "title": "أخصائية النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "specialty": "أخصائية النطق والتخاطب",
    "specialtyEn": "Speech-Language Pathologist & Communication Specialist",
    "specialtyCode": "أخصائية النطق والتخاطب",
    "specialtyCodeEn": "Speech & Language Pathologist",
    "category": "speech",
    "avatar": "/uploads/1790826509139_7_png.png",
    "image": "/uploads/1790826509139_7_png.png",
    "fallbackAvatar": "/uploads/1790826509139_7_png.png",
    "rating": 4.89,
    "reviewCount": 138,
    "experienceYears": 5,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس علم النفس من جامعة الملك عبد العزيز",
      "خبرة أكثر من ٥ سنوات"
    ],
    "bio": "أخصائية النطق والتخاطب بمركز رابا. حاصلة على بكالوريوس علم النفس من جامعة الملك عبد العزيز · خبرة أكثر من ٥ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-mohamed-abdelhamid",
    "name": "محمد عبد الحميد",
    "arabicName": "محمد عبد الحميد",
    "nameEn": "Mohamed Abdelhamid",
    "title": "أخصائي النطق والتخاطب",
    "titleEn": "Speech Pathologist & OPT Specialist",
    "specialty": "أخصائي النطق والتخاطب",
    "specialtyEn": "Speech Pathologist & Oral Placement Therapy (OPT) Specialist",
    "specialtyCode": "أخصائي النطق والتخاطب",
    "specialtyCodeEn": "Speech Pathologist & OPT Specialist",
    "category": "speech",
    "avatar": "/uploads/1790826577879_9_png.png",
    "image": "/uploads/1790826577879_9_png.png",
    "fallbackAvatar": "/uploads/1790826577879_9_png.png",
    "rating": 4.86,
    "reviewCount": 152,
    "experienceYears": 6,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل على بكالوريوس التربية الخاصة من جامعة المنصورة",
      "حاصل على كورس في OPT",
      "خبرة عملية أكثر من ٦ سنوات"
    ],
    "bio": "أخصائي النطق والتخاطب بمركز رابا. حاصل على بكالوريوس التربية الخاصة من جامعة المنصورة · حاصل على كورس في OPT · خبرة عملية أكثر من ٦ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-mohamed-elgayyar",
    "name": "محمد الجيار",
    "arabicName": "محمد الجيار",
    "nameEn": "Mohamed Al-Gayyar",
    "title": "أخصائي العلاج الوظيفي والتكامل الحسي",
    "titleEn": "Occupational Therapy & Sensory Integration Specialist",
    "specialty": "أخصائي العلاج الوظيفي والتكامل الحسي",
    "specialtyEn": "Occupational Therapist & Certified Behavior Technician (ABAT)",
    "specialtyCode": "أخصائي العلاج الوظيفي والتكامل الحسي",
    "specialtyCodeEn": "Occupational Therapy & Sensory Integration Specialist",
    "category": "occupational",
    "avatar": "/uploads/1790826687565_10_png.png",
    "image": "/uploads/1790826687565_10_png.png",
    "fallbackAvatar": "/uploads/1790826687565_10_png.png",
    "rating": 4.88,
    "reviewCount": 160,
    "experienceYears": 7,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل كلية ليسانس الآداب من جامعة بورسعيد",
      "حاصل على دبلومة مهنية لإضطرابات التواصل من كلية التربية جامعة عين شمس",
      "حاصل علي دبلومة عامة قسم التوحد من كلية علوم إعاقة من جامعة الزقازيق",
      "حاصل على دورة تحليل السلوك التطبيقي ABAT",
      "حاصل على دورة في التكامل الحسي من د/دعاء عبد اللطيف",
      "خبرة عملية أكثر من ٧ سنوات"
    ],
    "bio": "أخصائي العلاج الوظيفي والتكامل الحسي بمركز رابا. حاصل كلية ليسانس الآداب من جامعة بورسعيد · حاصل على دبلومة مهنية لإضطرابات التواصل من كلية التربية جامعة عين شمس · حاصل علي دبلومة عامة قسم التوحد من كلية علوم إعاقة من جامعة الزقازيق · حاصل على دورة تحليل السلوك التطبيقي ABAT · حاصل على دورة في التكامل الحسي من د/دعاء عبد اللطيف · خبرة عملية أكثر من ٧ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-elsaeed-diab",
    "name": "السعيد دياب",
    "arabicName": "السعيد دياب",
    "nameEn": "El-Saeed Diab",
    "title": "أخصائي صعوبات تعلم",
    "titleEn": "Learning Disabilities Specialist",
    "specialty": "أخصائي صعوبات تعلم",
    "specialtyEn": "Learning Disabilities Specialist & Psycho-Educational Evaluator",
    "specialtyCode": "أخصائي صعوبات تعلم",
    "specialtyCodeEn": "Learning Disabilities Specialist",
    "category": "psychology",
    "avatar": "/uploads/1790826711609_11_png.png",
    "image": "/uploads/1790826711609_11_png.png",
    "fallbackAvatar": "/uploads/1790826711609_11_png.png",
    "rating": 4.89,
    "reviewCount": 164,
    "experienceYears": 7,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل على ليسانس الآداب والتربية من جامعه الأزهر",
      "حاصل على دبلومة الإختبارات والمقاييس النفسية من جامعة الزقازيق",
      "حاصل على دبلومة التخاطب من جامعة عين شمس",
      "حاصل على دبلومة التوحد من جامعة الزقازيق",
      "حاصل على دبلومة إعداد أخصائي تربية خاصة من جامعة عين شمس",
      "حاصل على دبلومة التربية الخاصة من جامعة عين شمس",
      "خبرة عملية أكثر من ٧ سنوات"
    ],
    "bio": "أخصائي صعوبات تعلم بمركز رابا. حاصل على ليسانس الآداب والتربية من جامعه الأزهر · حاصل على دبلومة الإختبارات والمقاييس النفسية من جامعة الزقازيق · حاصل على دبلومة التخاطب من جامعة عين شمس · حاصل على دبلومة التوحد من جامعة الزقازيق · حاصل على دبلومة إعداد أخصائي تربية خاصة من جامعة عين شمس · حاصل على دبلومة التربية الخاصة من جامعة عين شمس · خبرة عملية أكثر من ٧ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-yara-abouhamda",
    "name": "يارا أبو حمده",
    "arabicName": "يارا أبو حمده",
    "nameEn": "Yara Abou Hamda",
    "title": "أخصائية العلاج الوظيفي",
    "titleEn": "Occupational Therapist",
    "specialty": "أخصائية العلاج الوظيفي",
    "specialtyEn": "Occupational Therapist",
    "specialtyCode": "أخصائية العلاج الوظيفي",
    "specialtyCodeEn": "Occupational Therapist",
    "category": "occupational",
    "department": "قسم العلاج الوظيفي والتكامل الحسي",
    "avatar": "/specialists/cards/spec_21_yara-abouhamda.png",
    "image": "/specialists/cards/spec_21_yara-abouhamda.png",
    "fallbackAvatar": "/specialists/cards/spec_21_yara-abouhamda.png",
    "rating": 4.9,
    "reviewCount": 135,
    "experienceYears": 1,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس العلاج الوظيفي من الجامعة الأردنية",
      "خبرة أكثر من سنة"
    ],
    "bio": "أخصائية العلاج الوظيفي بمركز رابا. حاصلة على بكالوريوس العلاج الوظيفي من الجامعة الأردنية · خبرة أكثر من سنة",
    "isTopRated": false
  },
  {
    "id": "doc-sara-abdelhamid",
    "name": "سارة عبد الحميد",
    "arabicName": "سارة عبد الحميد",
    "nameEn": "Sara Abdelhamid",
    "title": "أخصائية أولى نطق وتخاطب وتأهيل لغوي",
    "titleEn": "Senior Speech-Language Pathologist",
    "specialty": "أخصائية أولى نطق وتخاطب وتأهيل لغوي",
    "specialtyEn": "Senior Speech-Language Pathologist",
    "specialtyCode": "أخصائية أولى نطق وتخاطب وتأهيل لغوي",
    "specialtyCodeEn": "Senior Speech-Language Pathologist",
    "category": "speech",
    "department": "قسم علاج النطق واللغة واضطرابات التواصل",
    "avatar": "/uploads/1790827397368_38_png.png",
    "image": "/uploads/1790827397368_38_png.png",
    "fallbackAvatar": "/uploads/1790827397368_38_png.png",
    "rating": 4.95,
    "reviewCount": 145,
    "experienceYears": 8,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "تأهيل لغوي متقدم",
      "علاج تأخر الكلام",
      "جلسات النطق والتخاطب وتنمية المهارات",
      "التواصل اللفظي وغير اللفظي"
    ],
    "bio": "أخصائية أولى في علاج اضطرابات النطق واللغة والتخاطب بمراكز رابا، متخصصة في تنمية الحصيلة اللغوية، وعلاج تأخر الكلام، والخطط التأهيلية التفاعلية للأطفال.",
    "isTopRated": false
  },
  {
    "id": "doc-bayan-alnajem",
    "name": "بيان الناجم",
    "arabicName": "بيان الناجم",
    "nameEn": "Bayan Al-Najem",
    "title": "أخصائية تربية خاصة",
    "titleEn": "Special Education Specialist",
    "specialty": "أخصائية تربية خاصة",
    "specialtyEn": "Special Education & Hearing Impairment Specialist",
    "specialtyCode": "أخصائية تربية خاصة",
    "specialtyCodeEn": "Special Education Specialist",
    "category": "speech",
    "department": "قسم التربية الخاصة والتأهيل",
    "avatar": "/uploads/1790863548373_12_png.png",
    "image": "/uploads/1790863548373_12_png.png",
    "fallbackAvatar": "/uploads/1790863548373_12_png.png",
    "rating": 4.9,
    "reviewCount": 95,
    "experienceYears": 1,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس التربية الخاصة من جامعة الملك فيصل تخصص عوق سمعي",
      "حاصلة على دبلوم إرشاد اسري من جامعة الإمام محمد بن سعود",
      "خبرة عملية أكثر من سنة"
    ],
    "bio": "أخصائية تربية خاصة بمركز رابا. حاصلة على بكالوريوس التربية الخاصة من جامعة الملك فيصل تخصص عوق سمعي · حاصلة على دبلوم إرشاد اسري من جامعة الإمام محمد بن سعود · خبرة عملية أكثر من سنة",
    "isTopRated": false
  },
  {
    "id": "doc-manar-obeid",
    "name": "منار عبيد",
    "arabicName": "منار عبيد",
    "nameEn": "Manar Obeid",
    "title": "مشرفة قسم الـ ABA",
    "titleEn": "ABA Department Supervisor",
    "specialty": "مشرفة قسم الـ ABA",
    "specialtyEn": "ABA Department Supervisor & Certified Behavior Analyst (QABA/IBAO)",
    "specialtyCode": "مشرفة قسم الـ ABA",
    "specialtyCodeEn": "ABA Department Supervisor",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/uploads/1790865956621_13_png.png",
    "image": "/uploads/1790865956621_13_png.png",
    "fallbackAvatar": "/uploads/1790865956621_13_png.png",
    "rating": 4.98,
    "reviewCount": 310,
    "experienceYears": 17,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على ليسانس الآداب والتربية من جامعة المنوفية",
      "حاصلة على دبلوم مهني في القياس النفسي من جامعة المنوفية",
      "حاصله على الدبلوم الخاص في القياس النفسي من جامعة المنوفيه",
      "حاصلة على ماجستير في التربية الخاصة من جامعة القاهرة",
      "باحثة دكتوراه في التربية الخاصة في جامعة القاهرة",
      "محلل سلوك  معتمد من البورد الأمريكي من منظمات QABA / IBAO",
      "خبرة عملية أكثر من ١٧ سنة"
    ],
    "bio": "مشرفة قسم الـ ABA بمركز رابا. حاصلة على ليسانس الآداب والتربية من جامعة المنوفية · حاصلة على دبلوم مهني في القياس النفسي من جامعة المنوفية · حاصله على الدبلوم الخاص في القياس النفسي من جامعة المنوفيه · حاصلة على ماجستير في التربية الخاصة من جامعة القاهرة · باحثة دكتوراه في التربية الخاصة في جامعة القاهرة · محلل سلوك  معتمد من البورد الأمريكي من منظمات QABA / IBAO · خبرة عملية أكثر من ١٧ سنة",
    "isTopRated": false
  },
  {
    "id": "doc-salma-abouelfadl",
    "name": "سلمى أبو الفضل",
    "arabicName": "سلمى أبو الفضل",
    "nameEn": "Salma Abo El-Fadl",
    "title": "أخصائية التكامل الحسي",
    "titleEn": "Sensory Integration Specialist",
    "specialty": "أخصائية التكامل الحسي",
    "specialtyEn": "Sensory Integration & Communication Specialist",
    "specialtyCode": "أخصائية التكامل الحسي",
    "specialtyCodeEn": "Sensory Integration Specialist",
    "category": "occupational",
    "department": "قسم العلاج الوظيفي والتكامل الحسي",
    "avatar": "/uploads/1790865973849_14_png.png",
    "image": "/uploads/1790865973849_14_png.png",
    "fallbackAvatar": "/uploads/1790865973849_14_png.png",
    "rating": 4.95,
    "reviewCount": 165,
    "experienceYears": 7,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس تربيه طفوله من جامعه المنوفيه",
      "حاصلة على دبلوم خاص في التربية الخاصة من جامعة المنوفية",
      "حاصلة على دبلومة تخاطب  ٣٠٠ ساعه من جامعة عين شمس",
      "باحثة ماجستير في التربية الخاصة في جامعة المنوفية",
      "حاصلة على دورات ف تعديل السلوك وإضرابات النطق والكلام وصعوبات التعلم والتوحد من جامعة عين شمس",
      "حاصلة على دورة في التكامل الحسي من جامعة عين شمس",
      "خبرة عملية أكثر من ٧ سنوات"
    ],
    "bio": "أخصائية التكامل الحسي بمركز رابا. حاصلة على بكالوريوس تربيه طفوله من جامعه المنوفيه · حاصلة على دبلوم خاص في التربية الخاصة من جامعة المنوفية · حاصلة على دبلومة تخاطب  ٣٠٠ ساعه من جامعة عين شمس · باحثة ماجستير في التربية الخاصة في جامعة المنوفية · حاصلة على دورات ف تعديل السلوك وإضرابات النطق والكلام وصعوبات التعلم والتوحد من جامعة عين شمس · حاصلة على دورة في التكامل الحسي من جامعة عين شمس · خبرة عملية أكثر من ٧ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-ahmed-sayed",
    "name": "أحمد سيد",
    "arabicName": "أحمد سيد",
    "nameEn": "Ahmed Sayed",
    "title": "أخصائي النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "specialty": "أخصائي النطق والتخاطب",
    "specialtyEn": "Speech & Language Pathologist (OPT Certified)",
    "specialtyCode": "أخصائي النطق والتخاطب",
    "specialtyCodeEn": "Speech & Language Pathologist",
    "category": "speech",
    "department": "قسم النطق والتخاطب",
    "avatar": "/uploads/1790865993782_15_png.png",
    "image": "/uploads/1790865993782_15_png.png",
    "fallbackAvatar": "/uploads/1790865993782_15_png.png",
    "rating": 4.93,
    "reviewCount": 140,
    "experienceYears": 6,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل على بكالوريوس علوم لذوي الإحتياجات الخاصة بتخصص النطق والتخاطب من جامعة بني سويف",
      "حاصل على كورس العلاج الفموي OPT من الجمعية الأميريكية للنطق واللغة",
      "خبرة عملية أكثر من ٦ سنوات"
    ],
    "bio": "أخصائي النطق والتخاطب بمركز رابا. حاصل على بكالوريوس علوم لذوي الإحتياجات الخاصة بتخصص النطق والتخاطب من جامعة بني سويف · حاصل على كورس العلاج الفموي OPT من الجمعية الأميريكية للنطق واللغة · خبرة عملية أكثر من ٦ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-aseel-yousef",
    "name": "أسيل يوسف",
    "arabicName": "أسيل يوسف",
    "nameEn": "Aseel Yousef",
    "title": "أخصائية العلاج الوظيفي",
    "titleEn": "Occupational Therapy Specialist",
    "specialty": "أخصائية العلاج الوظيفي",
    "specialtyEn": "Occupational Therapy & Fine Motor Rehabilitation Specialist",
    "specialtyCode": "أخصائية العلاج الوظيفي",
    "specialtyCodeEn": "Occupational Therapy Specialist",
    "category": "occupational",
    "department": "قسم العلاج الوظيفي والتكامل الحسي",
    "avatar": "/uploads/1790866040732_19_png.png",
    "image": "/uploads/1790866040732_19_png.png",
    "fallbackAvatar": "/uploads/1790866040732_19_png.png",
    "rating": 4.91,
    "reviewCount": 110,
    "experienceYears": 2,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس العلاج الوظيفي من كلية العلوم التطبيقية من الجامعة الهاشمية",
      "خبرة عملية أكثر من سنتين"
    ],
    "bio": "أخصائية العلاج الوظيفي بمركز رابا. حاصلة على بكالوريوس العلاج الوظيفي من كلية العلوم التطبيقية من الجامعة الهاشمية · خبرة عملية أكثر من سنتين",
    "isTopRated": false
  },
  {
    "id": "doc-mohammed-shehri-clinical",
    "name": "محمد الشهري",
    "arabicName": "محمد الشهري",
    "nameEn": "Mohammed Al-Shehri",
    "title": "أخصائي نفسي إكلينيكي",
    "titleEn": "Clinical Psychologist",
    "specialty": "أخصائي نفسي إكلينيكي",
    "specialtyEn": "Clinical Psychologist & Behavioral Assessment Specialist",
    "specialtyCode": "أخصائي نفسي إكلينيكي",
    "specialtyCodeEn": "Clinical Psychologist",
    "category": "psychology",
    "department": "قسم الإرشاد والتقييم النفسي",
    "avatar": "/uploads/1790866057132_21_png.png",
    "image": "/uploads/1790866057132_21_png.png",
    "fallbackAvatar": "/uploads/1790866057132_21_png.png",
    "rating": 4.92,
    "reviewCount": 115,
    "experienceYears": 2,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل على بكالوريس علم النفس العام من جامعة الإمام محمد بن سعود الاسلامية",
      "خبرة أكثر من سنتين"
    ],
    "bio": "أخصائي نفسي إكلينيكي بمركز رابا. حاصل على بكالوريس علم النفس العام من جامعة الإمام محمد بن سعود الاسلامية · خبرة أكثر من سنتين",
    "isTopRated": false
  },
  {
    "id": "doc-saad-dosari",
    "name": "سعد الدوسري",
    "arabicName": "سعد الدوسري",
    "nameEn": "Saad Al-Dosari",
    "title": "أخصائي ABA",
    "titleEn": "Applied Behavior Analysis Specialist",
    "specialty": "أخصائي تحليل السلوك التطبيقي ABA معتمد ABAT",
    "specialtyEn": "ABA Specialist & Licensed ABAT Behavior Technician",
    "specialtyCode": "أخصائي ABA",
    "specialtyCodeEn": "Applied Behavior Analysis Specialist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/uploads/1790866075647_22_png.png",
    "image": "/uploads/1790866075647_22_png.png",
    "fallbackAvatar": "/uploads/1790866075647_22_png.png",
    "rating": 4.9,
    "reviewCount": 88,
    "experienceYears": 2,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الاسلامية",
      "حاصل على رخصة الهيئة السعودية للتخصصات الصحية",
      "حاصل على رخصة ABAT من البورد الامريكي QABA",
      "خبرة عملية أكثر من سنة في التدخل السلوكي الفردي"
    ],
    "bio": "أخصائي تحليل سلوك تطبيقي ABA بمركز رابا. مرخص من هيئة التخصصات الصحية السعودية وحاصل على رخصة ABAT من البورد الأمريكي QABA، متخصص في بناء المهارات السلوكية والتواصلية للأطفال.",
    "isTopRated": false
  },
  {
    "id": "doc-fahad-juhani",
    "name": "فهد الجهني",
    "arabicName": "فهد الجهني",
    "nameEn": "Fahad Al-Juhani",
    "title": "أخصائي ABA",
    "titleEn": "Applied Behavior Analysis Specialist",
    "specialty": "أخصائي ABA",
    "specialtyEn": "ABA Specialist & Certified ABAT Practitioner",
    "specialtyCode": "أخصائي ABA",
    "specialtyCodeEn": "Applied Behavior Analysis Specialist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/uploads/1790866092167_23_png.png",
    "image": "/uploads/1790866092167_23_png.png",
    "fallbackAvatar": "/uploads/1790866092167_23_png.png",
    "rating": 4.92,
    "reviewCount": 105,
    "experienceYears": 2,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الاسلامية",
      "حاصل على إعتماد ABAT في تحليل السلوك التطبيقي من QABA",
      "خبرة عملية أكثر من سنتين"
    ],
    "bio": "أخصائي ABA بمركز رابا. حاصل على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الاسلامية · حاصل على إعتماد ABAT في تحليل السلوك التطبيقي من QABA · خبرة عملية أكثر من سنتين",
    "isTopRated": false
  },
  {
    "id": "doc-hala-enazi",
    "name": "هلا العنزي",
    "arabicName": "هلا العنزي",
    "nameEn": "Hala Al-Enazi",
    "title": "أخصائية نفسية | أخصائية تعديل سلوك (ABA)",
    "titleEn": "Applied Behavior Analysis Specialist",
    "specialty": "أخصائية نفسية | أخصائية تعديل سلوك (ABA)",
    "specialtyEn": "ABA Specialist & SCFHS Classified Psychologist",
    "specialtyCode": "أخصائية ABA",
    "specialtyCodeEn": "Applied Behavior Analysis Specialist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/uploads/1790866107078_24_png.png",
    "image": "/uploads/1790866107078_24_png.png",
    "fallbackAvatar": "/uploads/1790866107078_24_png.png",
    "rating": 4.91,
    "reviewCount": 92,
    "experienceYears": 1,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس علم النفس من جامعة الأميرة نورة بنت عبدالرحمن، مع مرتبة الشرف الأولى",
      "حاصلة على تصنيف مهني من الهيئة السعودية للتخصصات الصحية كـ أخصائي نفسي",
      "حاصلة على اعتماد ABAT في تحليل السلوك التطبيقي من QABA",
      "متخصصة في تطبيق مبادئ تحليل السلوك التطبيقي (ABA) مع الأطفال",
      "خبرة عملية أكثر من سنة"
    ],
    "bio": "أخصائية نفسية | أخصائية تعديل سلوك (ABA) بمركز رابا. حاصلة على بكالوريوس علم النفس من جامعة الأميرة نورة بنت عبدالرحمن، مع مرتبة الشرف الأولى · حاصلة على تصنيف مهني من الهيئة السعودية للتخصصات الصحية كـ أخصائي نفسي · حاصلة على اعتماد ABAT في تحليل السلوك التطبيقي من QABA · متخصصة في تطبيق مبادئ تحليل السلوك التطبيقي (ABA) مع الأطفال · خبرة عملية أكثر من سنة",
    "isTopRated": false
  },
  {
    "id": "doc-taif-subaie",
    "name": "طيف السبيعي",
    "arabicName": "طيف السبيعي",
    "nameEn": "Taif Al-Subaie",
    "title": "أخصائية ABA",
    "titleEn": "Applied Behavior Analysis Specialist",
    "specialty": "أخصائية ABA",
    "specialtyEn": "ABA Specialist & Licensed Psychologist",
    "specialtyCode": "أخصائية ABA",
    "specialtyCodeEn": "Applied Behavior Analysis Specialist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/uploads/1790866122845_25_png.png",
    "image": "/uploads/1790866122845_25_png.png",
    "fallbackAvatar": "/uploads/1790866122845_25_png.png",
    "rating": 4.93,
    "reviewCount": 110,
    "experienceYears": 2,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس علم النفس من جامعة الطائف",
      "حاصلة على اعتماد ABAT في تحليل السلوك التطبيقي من QABA",
      "حاصلة على ترخيص هيئة التخصصات الصحية بمسمى اخصائي نفسي.",
      "خبرة عملية أكثر من سنتين"
    ],
    "bio": "أخصائية ABA بمركز رابا. حاصلة على بكالوريوس علم النفس من جامعة الطائف · حاصلة على اعتماد ABAT في تحليل السلوك التطبيقي من QABA · حاصلة على ترخيص هيئة التخصصات الصحية بمسمى اخصائي نفسي. · خبرة عملية أكثر من سنتين",
    "isTopRated": false
  },
  {
    "id": "doc-raghad-hawarneh",
    "name": "رغد حوارنه",
    "arabicName": "رغد حوارنه",
    "nameEn": "Raghad Hawarneh",
    "title": "أخصائية العلاج الوظيفي",
    "titleEn": "Occupational Therapy Specialist",
    "specialty": "أخصائية العلاج الوظيفي",
    "specialtyEn": "Occupational Therapy & Medical Rehabilitation Specialist",
    "specialtyCode": "أخصائية العلاج الوظيفي",
    "specialtyCodeEn": "Occupational Therapy Specialist",
    "category": "occupational",
    "department": "قسم العلاج الوظيفي والتكامل الحسي",
    "avatar": "/uploads/1790866151823_26_png.png",
    "image": "/uploads/1790866151823_26_png.png",
    "fallbackAvatar": "/uploads/1790866151823_26_png.png",
    "rating": 4.9,
    "reviewCount": 85,
    "experienceYears": 1,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس علوم التأهيل الطبية من جامعة العلوم والتكنولوجيا الأردنية",
      "خبرة عملية أكثر من سنة"
    ],
    "bio": "أخصائية العلاج الوظيفي بمركز رابا. حاصلة على بكالوريوس علوم التأهيل الطبية من جامعة العلوم والتكنولوجيا الأردنية · خبرة عملية أكثر من سنة",
    "isTopRated": false
  },
  {
    "id": "doc-eman-bahattab",
    "name": "إيمان باحطاب",
    "arabicName": "إيمان باحطاب",
    "nameEn": "Eman Ba-Hattab",
    "title": "أخصائي نفسي إكلينيكي | أخصائية ABA",
    "titleEn": "Applied Behavior Analysis Specialist",
    "specialty": "أخصائي نفسي إكلينيكي | أخصائية ABA",
    "specialtyEn": "ABA Specialist & Certified Behavior Technician (QABA)",
    "specialtyCode": "أخصائية ABA",
    "specialtyCodeEn": "Applied Behavior Analysis Specialist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/uploads/1790866167869_27_png.png",
    "image": "/uploads/1790866167869_27_png.png",
    "fallbackAvatar": "/uploads/1790866167869_27_png.png",
    "rating": 4.94,
    "reviewCount": 155,
    "experienceYears": 5,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس علم النفس من جامعة العلوم والتكنولوجيا",
      "حاصلة على شهادة فني تحليل سلوك تطبيقي ABA معتمد من البورد الأمريكي QABA",
      "خبرة عملية أكثر من ٥ سنوات"
    ],
    "bio": "أخصائي نفسي إكلينيكي | أخصائية ABA بمركز رابا. حاصلة على بكالوريوس علم النفس من جامعة العلوم والتكنولوجيا · حاصلة على شهادة فني تحليل سلوك تطبيقي ABA معتمد من البورد الأمريكي QABA · خبرة عملية أكثر من ٥ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-omar-saad-speech",
    "name": "عمر سعد",
    "arabicName": "عمر سعد",
    "nameEn": "Omar Saad",
    "title": "أخصائي النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "specialty": "أخصائي النطق والتخاطب",
    "specialtyEn": "Speech Pathologist & Behavioral Specialist (ABAT / QASP-S Candidate)",
    "specialtyCode": "أخصائي النطق والتخاطب",
    "specialtyCodeEn": "Speech & Language Pathologist",
    "category": "speech",
    "department": "قسم النطق والتخاطب",
    "avatar": "/uploads/1790866182582_28_png.png",
    "image": "/uploads/1790866182582_28_png.png",
    "fallbackAvatar": "/uploads/1790866182582_28_png.png",
    "rating": 4.95,
    "reviewCount": 160,
    "experienceYears": 5,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل على بكالوريوس التربية الخاصة من جامعة العريش",
      "حاصل على إعتمادات من البورد الأميريكي  ABAT / QASP-S",
      "حاصل على Candidate",
      "خبرة عملية أكثر من ٥ سنوات"
    ],
    "bio": "أخصائي النطق والتخاطب بمركز رابا. حاصل على بكالوريوس التربية الخاصة من جامعة العريش · حاصل على إعتمادات من البورد الأميريكي  ABAT / QASP-S · حاصل على Candidate · خبرة عملية أكثر من ٥ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-aliah-mutairi",
    "name": "عاليه المطيري",
    "arabicName": "عاليه المطيري",
    "nameEn": "Aliah Al-Mutairi",
    "title": "أخصائية العلاج الوظيفي",
    "titleEn": "Occupational Therapy Specialist",
    "specialty": "أخصائية العلاج الوظيفي",
    "specialtyEn": "Occupational Therapy & Sensory Rehabilitation Specialist",
    "specialtyCode": "أخصائية العلاج الوظيفي",
    "specialtyCodeEn": "Occupational Therapy Specialist",
    "category": "occupational",
    "department": "قسم العلاج الوظيفي والتكامل الحسي",
    "avatar": "/uploads/1790866202949_29_png.png",
    "image": "/uploads/1790866202949_29_png.png",
    "fallbackAvatar": "/uploads/1790866202949_29_png.png",
    "rating": 4.92,
    "reviewCount": 118,
    "experienceYears": 2,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصله على بكالوريوس العلاج الوظيفي من جامعة الملك سعود",
      "خبرة عملية أكثر من سنتين"
    ],
    "bio": "أخصائية العلاج الوظيفي بمركز رابا. حاصله على بكالوريوس العلاج الوظيفي من جامعة الملك سعود · خبرة عملية أكثر من سنتين",
    "isTopRated": false
  },
  {
    "id": "doc-haya-faleh",
    "name": "هياء الفالح",
    "arabicName": "هياء الفالح",
    "nameEn": "Haya Al-Faleh",
    "title": "أخصائية نفسية | أخصائية ABA",
    "titleEn": "Psychologist & ABA Specialist",
    "specialty": "أخصائية نفسية | أخصائية ABA",
    "specialtyEn": "Psychologist & Certified Behavior Analyst Technician (ABAT)",
    "specialtyCode": "أخصائية نفسية | أخصائية ABA",
    "specialtyCodeEn": "Psychologist & ABA Specialist",
    "category": "psychology",
    "department": "قسم الإرشاد النفسي والتدخل السلوكي ABA",
    "avatar": "/uploads/1790866269363_30_png.png",
    "image": "/uploads/1790866269363_30_png.png",
    "fallbackAvatar": "/uploads/1790866269363_30_png.png",
    "rating": 4.91,
    "reviewCount": 94,
    "experienceYears": 1,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس علم النفس من كلية التربية - جامعة الملك سعود",
      "حاصلة على اعتماد ABAT في تحليل السلوك التطبيقي من QABA",
      "خبرة عملية أكثر من سنة"
    ],
    "bio": "أخصائية نفسية | أخصائية ABA بمركز رابا. حاصلة على بكالوريوس علم النفس من كلية التربية - جامعة الملك سعود · حاصلة على اعتماد ABAT في تحليل السلوك التطبيقي من QABA · خبرة عملية أكثر من سنة",
    "isTopRated": false
  },
  {
    "id": "doc-haya-dosari",
    "name": "هياء الدوسري",
    "arabicName": "هياء الدوسري",
    "nameEn": "Haya Al-Dosari",
    "title": "أخصائية نفسية | أخصائية ABA",
    "titleEn": "Psychologist & ABA Specialist",
    "specialty": "أخصائية نفسية | أخصائية ABA",
    "specialtyEn": "Psychologist & Certified Behavior Analyst Technician (ABAT)",
    "specialtyCode": "أخصائية نفسية | أخصائية ABA",
    "specialtyCodeEn": "Psychologist & ABA Specialist",
    "category": "psychology",
    "department": "قسم الإرشاد النفسي والتدخل السلوكي ABA",
    "avatar": "/uploads/1790866288993_31_png.png",
    "image": "/uploads/1790866288993_31_png.png",
    "fallbackAvatar": "/uploads/1790866288993_31_png.png",
    "rating": 4.91,
    "reviewCount": 96,
    "experienceYears": 1,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس علم النفس من كلية التربية - جامعة الملك سعود",
      "حاصلة على اعتماد ABAT في تحليل السلوك التطبيقي من QABA",
      "خبرة عملية أكثر من سنة"
    ],
    "bio": "أخصائية نفسية | أخصائية ABA بمركز رابا. حاصلة على بكالوريوس علم النفس من كلية التربية - جامعة الملك سعود · حاصلة على اعتماد ABAT في تحليل السلوك التطبيقي من QABA · خبرة عملية أكثر من سنة",
    "isTopRated": false
  },
  {
    "id": "doc-ahlam-alnoaman",
    "name": "أحلام النعمان",
    "arabicName": "أحلام النعمان",
    "nameEn": "Ahlam Al-Noman",
    "title": "أخصائية النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "specialty": "أخصائية النطق والتخاطب",
    "specialtyEn": "Speech & Language Pathologist",
    "specialtyCode": "أخصائية النطق والتخاطب",
    "specialtyCodeEn": "Speech & Language Pathologist",
    "category": "speech",
    "department": "قسم النطق والتخاطب والتأهيل اللغوي",
    "avatar": "/uploads/1791192101630________________png.png",
    "image": "/uploads/1791192101630________________png.png",
    "fallbackAvatar": "/uploads/1791192101630________________png.png",
    "rating": 4.95,
    "reviewCount": 160,
    "experienceYears": 17,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على درجة البكالوريوس من جامعة عين شمس",
      "حاصلة على دبلوم التوحد من جامعهة القاهره",
      "حاصلة على دبلومة التربية الخاصة من جامعة القاهرة",
      "حاصلة على دبلومة صعوبات التعلم من جامعة القاهرة",
      "حاصلة على دبلومة إعداد أخصائي تربية خاصة من نقابة ذوي الإحتياجات الخاصة بالإسماعيلية",
      "حاصلة على دورة تخصصية في العلاج الحركي اللمسي للنطق والكلام OPT",
      "فني تحليل سلوك تطبيقي معتمد ABAT",
      "حاصلة على ترخيص الهيئة السعودية للتخصصات الصحية",
      "خبرة عملية أكثر من ١٧ سنة"
    ],
    "bio": "أخصائية النطق والتخاطب بمركز رابا. حاصلة على درجة البكالوريوس من جامعة عين شمس · حاصلة على دبلوم التوحد من جامعهة القاهره · حاصلة على دبلومة التربية الخاصة من جامعة القاهرة · حاصلة على دبلومة صعوبات التعلم من جامعة القاهرة · حاصلة على دبلومة إعداد أخصائي تربية خاصة من نقابة ذوي الإحتياجات الخاصة بالإسماعيلية · حاصلة على دورة تخصصية في العلاج الحركي اللمسي للنطق والكلام OPT · فني تحليل سلوك تطبيقي معتمد ABAT · حاصلة على ترخيص الهيئة السعودية للتخصصات الصحية · خبرة عملية أكثر من ١٧ سنة",
    "isTopRated": false
  },
  {
    "id": "doc-atheer-alrasheed",
    "name": "اثير آل رشيد",
    "arabicName": "اثير آل رشيد",
    "nameEn": "Atheer Al-Rasheed",
    "title": "أخصائية ABA",
    "titleEn": "ABA Specialist",
    "specialty": "أخصائية تحليل السلوك التطبيقي ABA",
    "specialtyEn": "Applied Behavior Analysis (ABA) Specialist",
    "specialtyCode": "أخصائية ABA",
    "specialtyCodeEn": "ABA Specialist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/uploads/1791192114276_______________png.png",
    "image": "/uploads/1791192114276_______________png.png",
    "fallbackAvatar": "/uploads/1791192114276_______________png.png",
    "rating": 4.9,
    "reviewCount": 95,
    "experienceYears": 3,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الاسلامية",
      "حاصلة على تصنيف هيئة التخصصات الصحية",
      "حاصلة على رخصة ABAT فني تحليل سلوك تطبيقي",
      "حاصلة على دورة فعالية العلاج الطبي ومدى تأثيره على ذوي إضطرابات طيف التوحد",
      "خبرة عملية أكثر من 3 سنوات"
    ],
    "bio": "أخصائية تحليل سلوك تطبيقي ABA مرخصة ومصنفة من الهيئة السعودية للتخصصات الصحية وحاصلة على رخصة ABAT. متخصصة في تعديل السلوك وتنمية المهارات الاستقلالية والتواصلية للأطفال ذوي اضطراب طيف التوحد.",
    "isTopRated": false
  },
  {
    "id": "doc-tasneem-sabry",
    "name": "د. تسنيم صبري",
    "arabicName": "د. تسنيم صبري",
    "nameEn": "Dr. Tasneem Sabry",
    "title": "مشرفة قسم الـ ABA",
    "titleEn": "ABA Department Supervisor",
    "specialty": "مشرفة قسم تحليل السلوك التطبيقي ABA",
    "specialtyEn": "Applied Behavior Analysis Department Supervisor",
    "specialtyCode": "مشرفة قسم الـ ABA",
    "specialtyCodeEn": "ABA Department Supervisor",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/uploads/1791192126580____________png.png",
    "image": "/uploads/1791192126580____________png.png",
    "fallbackAvatar": "/uploads/1791192126580____________png.png",
    "rating": 4.96,
    "reviewCount": 190,
    "experienceYears": 8,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس التربية والتربية الخاصة من جامعة قناة السويس",
      "حاصلة على الماجستير المهني من جامعة القاهرة",
      "حاصلة على الدكتوراه المهني من جامعة القاهرة",
      "حاصلة على دبلوم التوحد وإضطرابات النطق من الجامعة الامريكية",
      "حاصلة على دبلوم صعوبات التعلم والعلاج الوظيفي ومهارات النمو من الجامعة الامريكية",
      "حاصلة على إعتماد في تحليل السلوك التطبيقي من QABA",
      "خبرة عملية أكثر من 8 سنوات"
    ],
    "bio": "مشرفة قسم تحليل السلوك التطبيقي ABA بمراكز رابا، حاصلة على الدكتوراه والماجستير المهنيين من جامعة القاهرة ودبلومات متقدمة من الجامعة الأمريكية. تمتلك خبرة تفوق 8 سنوات في الإشراف الإكلينيكي وتصميم الخطط السلوكية المتقدمة.",
    "isTopRated": false
  },
  {
    "id": "doc-tasneem-abdelaziz",
    "name": "تسنيم عبد العزيز",
    "arabicName": "تسنيم عبد العزيز",
    "nameEn": "Tasneem Abdelaziz",
    "title": "اخصائية ABA",
    "titleEn": "ABA Specialist",
    "specialty": "اخصائية ABA",
    "specialtyEn": "Applied Behavior Analysis Specialist",
    "specialtyCode": "اخصائية ABA",
    "specialtyCodeEn": "ABA Specialist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/uploads/1791192139635__________________png.png",
    "image": "/uploads/1791192139635__________________png.png",
    "fallbackAvatar": "/uploads/1791192139635__________________png.png",
    "rating": 4.93,
    "reviewCount": 140,
    "experienceYears": 10,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس العلوم الصحية من جامعة الرباط الوطني",
      "حاصلة على رخصة ABAT من البورد الامريكي QABA",
      "حاصلة على دورة أسس التشخيص والعلاج للإضطرابات النفسية بمركز",
      "مطمئنة للدكتور طارق الحبيب",
      "خبرة عملية أكثر من ١٠ سنوات"
    ],
    "bio": "اخصائية ABA بمركز رابا. حاصلة على بكالوريوس العلوم الصحية من جامعة الرباط الوطني · حاصلة على رخصة ABAT من البورد الامريكي QABA · حاصلة على دورة أسس التشخيص والعلاج للإضطرابات النفسية بمركز · مطمئنة للدكتور طارق الحبيب · خبرة عملية أكثر من ١٠ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-jawaher-ibrahim",
    "name": "جواهر إبراهيم",
    "arabicName": "جواهر إبراهيم",
    "nameEn": "Jawaher Ibrahim",
    "title": "أخصائية نفسية",
    "titleEn": "Psychologist",
    "specialty": "أخصائية نفسية",
    "specialtyEn": "Clinical Psychologist & Behavioral Therapist",
    "specialtyCode": "أخصائية نفسية",
    "specialtyCodeEn": "Psychologist",
    "category": "psychology",
    "department": "قسم علم النفس والإرشاد الأسري",
    "avatar": "/uploads/1791192158941________________png.png",
    "image": "/uploads/1791192158941________________png.png",
    "fallbackAvatar": "/uploads/1791192158941________________png.png",
    "rating": 4.91,
    "reviewCount": 110,
    "experienceYears": 3,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس علم النفس من جامعة الملك سعود",
      "مصنفة من الهيئة السعودية للتخصصات الصحية كأخصائية نفسية",
      "حاصلة على شهادة ABAT في تحليل السلوك التطبيقي",
      "حاصلة على دورة ABAT لمدة 40 ساعة",
      "دورات في العلاج المعرفي السلوكي CBT",
      "خبرة عملية أكثر من ٣ سنوات"
    ],
    "bio": "أخصائية نفسية بمركز رابا. حاصلة على بكالوريوس علم النفس من جامعة الملك سعود · مصنفة من الهيئة السعودية للتخصصات الصحية كأخصائية نفسية · حاصلة على شهادة ABAT في تحليل السلوك التطبيقي · حاصلة على دورة ABAT لمدة 40 ساعة · دورات في العلاج المعرفي السلوكي CBT · خبرة عملية أكثر من ٣ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-hossam-samy",
    "name": "حسام سامي",
    "arabicName": "حسام سامي",
    "nameEn": "Hossam Samy",
    "title": "أخصائي النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "specialty": "أخصائي النطق والتخاطب",
    "specialtyEn": "Speech-Language Pathologist",
    "specialtyCode": "أخصائي النطق والتخاطب",
    "specialtyCodeEn": "Speech & Language Pathologist",
    "category": "speech",
    "department": "قسم النطق والتخاطب والتأهيل اللغوي",
    "avatar": "/uploads/1791192167745___________png.png",
    "image": "/uploads/1791192167745___________png.png",
    "fallbackAvatar": "/uploads/1791192167745___________png.png",
    "rating": 4.92,
    "reviewCount": 130,
    "experienceYears": 7,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل علي بكالوريوس العلوم في التربيه الخاصه من جامعة مصر للعلوم",
      "حاصل علي دبلومة مهنية في إضطرابات التواصل من جامعة القاهرة",
      "حاصل علي دبلومه خاصه في التربية الخاصة من جامعة القاهرة",
      "خبرة عملية أكثر من ٧ سنوات"
    ],
    "bio": "أخصائي النطق والتخاطب بمركز رابا. حاصل علي بكالوريوس العلوم في التربيه الخاصه من جامعة مصر للعلوم · حاصل علي دبلومة مهنية في إضطرابات التواصل من جامعة القاهرة · حاصل علي دبلومه خاصه في التربية الخاصة من جامعة القاهرة · خبرة عملية أكثر من ٧ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-khaled-alharbi",
    "name": "خالد الحربي",
    "arabicName": "خالد الحربي",
    "nameEn": "Khaled Al-Harbi",
    "title": "أخصائي ABA",
    "titleEn": "ABA Specialist",
    "specialty": "أخصائي ABA",
    "specialtyEn": "Applied Behavior Analysis Specialist",
    "specialtyCode": "أخصائي ABA",
    "specialtyCodeEn": "ABA Specialist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/uploads/1791192175779_____________png.png",
    "image": "/uploads/1791192175779_____________png.png",
    "fallbackAvatar": "/uploads/1791192175779_____________png.png",
    "rating": 4.89,
    "reviewCount": 85,
    "experienceYears": 2,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل على بكالوريوس علم النفس الإكلينيكي من جامعة الملك سعود",
      "حاصل على رخصة ABAT فني تحليل سلوك تطبيقي",
      "حاصل على رخصة اخصائي نفسي مساعد من هيئة التخصصات الصحية",
      "خبرة عملية أكثر من سنتين"
    ],
    "bio": "أخصائي ABA بمركز رابا. حاصل على بكالوريوس علم النفس الإكلينيكي من جامعة الملك سعود · حاصل على رخصة ABAT فني تحليل سلوك تطبيقي · حاصل على رخصة اخصائي نفسي مساعد من هيئة التخصصات الصحية · خبرة عملية أكثر من سنتين",
    "isTopRated": false
  },
  {
    "id": "doc-reema-alhusseini",
    "name": "ريمه الحسيني",
    "arabicName": "ريمه الحسيني",
    "nameEn": "Reema Al-Husseini",
    "title": "أخصائية نفسية",
    "titleEn": "Psychologist & QASP-S",
    "specialty": "أخصائية نفسية",
    "specialtyEn": "Psychologist & Qualified Autism Services Practitioner",
    "specialtyCode": "أخصائية نفسية",
    "specialtyCodeEn": "Psychologist & QASP-S",
    "category": "psychology",
    "department": "قسم علم النفس والإرشاد الأسري",
    "avatar": "/uploads/1791192184198______________png.png",
    "image": "/uploads/1791192184198______________png.png",
    "fallbackAvatar": "/uploads/1791192184198______________png.png",
    "rating": 4.95,
    "reviewCount": 175,
    "experienceYears": 10,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الإسلامية",
      "حاصلة على شهادة مشرف توحد ممارس QASP-S من منظمة QABA",
      "حاصلة على تصنيف مهني من الهيئة السعودية للتخصصات الصحية",
      "خبرة أكثر من ١٠ سنوات"
    ],
    "bio": "أخصائية نفسية بمركز رابا. حاصلة على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الإسلامية · حاصلة على شهادة مشرف توحد ممارس QASP-S من منظمة QABA · حاصلة على تصنيف مهني من الهيئة السعودية للتخصصات الصحية · خبرة أكثر من ١٠ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-sultan-alshaye",
    "name": "سلطان الشايع",
    "arabicName": "سلطان الشايع",
    "nameEn": "Sultan Al-Shaye",
    "title": "أخصائي العلاج الوظيفي",
    "titleEn": "Occupational Therapist",
    "specialty": "أخصائي العلاج الوظيفي",
    "specialtyEn": "Occupational Therapist & Sensory Integration",
    "specialtyCode": "أخصائي العلاج الوظيفي",
    "specialtyCodeEn": "Occupational Therapist",
    "category": "occupational",
    "department": "قسم العلاج الوظيفي والتكامل الحسي",
    "avatar": "/uploads/1791192194710______________png.png",
    "image": "/uploads/1791192194710______________png.png",
    "fallbackAvatar": "/uploads/1791192194710______________png.png",
    "rating": 4.9,
    "reviewCount": 105,
    "experienceYears": 3,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل على بكالوريوس العلوم التطبيقيه من جامعة الملك سعود تخصص علاج وظيفي",
      "خبرة أكثر من ٣ سنوات"
    ],
    "bio": "أخصائي العلاج الوظيفي بمركز رابا. حاصل على بكالوريوس العلوم التطبيقيه من جامعة الملك سعود تخصص علاج وظيفي · خبرة أكثر من ٣ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-shaimaa-adel",
    "name": "شيماء عادل",
    "arabicName": "شيماء عادل",
    "nameEn": "Shaimaa Adel",
    "title": "أخصائية النطق والتخاطب",
    "titleEn": "Senior Speech Pathologist & QASP-S",
    "specialty": "أخصائية النطق والتخاطب",
    "specialtyEn": "Senior Speech Pathologist & Autism Supervisor",
    "specialtyCode": "أخصائية النطق والتخاطب",
    "specialtyCodeEn": "Senior Speech Pathologist & QASP-S",
    "category": "speech",
    "department": "قسم النطق والتخاطب والتأهيل اللغوي",
    "avatar": "/uploads/1791192202894____________png.png",
    "image": "/uploads/1791192202894____________png.png",
    "fallbackAvatar": "/uploads/1791192202894____________png.png",
    "rating": 4.97,
    "reviewCount": 210,
    "experienceYears": 18,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على درجة البكالوريوس من جامعة الإسكندرية",
      "حاصلة على دراسات عليا علوم إعاقة مسار اضطرابات نطق وتخاطب من جامعة الزقازيق",
      "حاصلة على الرخصة المهنية في النطق والتخاطب من هيئة التقويم والقياس",
      "حاصلة على رخصة مشرف توحد سلوكي معتمد دولياً QASP-S",
      "خبرة عملية أكثر من ١٨ سنة"
    ],
    "bio": "أخصائية النطق والتخاطب بمركز رابا. حاصلة على درجة البكالوريوس من جامعة الإسكندرية · حاصلة على دراسات عليا علوم إعاقة مسار اضطرابات نطق وتخاطب من جامعة الزقازيق · حاصلة على الرخصة المهنية في النطق والتخاطب من هيئة التقويم والقياس · حاصلة على رخصة مشرف توحد سلوكي معتمد دولياً QASP-S · خبرة عملية أكثر من ١٨ سنة",
    "isTopRated": false
  },
  {
    "id": "doc-abdelilah-shakl",
    "name": "عبدالاله شقل",
    "arabicName": "عبدالاله شقل",
    "nameEn": "Abdelilah Shakl",
    "title": "أخصائي العلاج الوظيفي",
    "titleEn": "Occupational Therapist",
    "specialty": "أخصائي العلاج الوظيفي والتكامل الحسي",
    "specialtyEn": "Occupational Therapist & Sensory Integration",
    "specialtyCode": "أخصائي العلاج الوظيفي",
    "specialtyCodeEn": "Occupational Therapist",
    "category": "occupational",
    "department": "قسم العلاج الوظيفي والتكامل الحسي",
    "avatar": "/uploads/1791192213481______________png.png",
    "image": "/uploads/1791192213481______________png.png",
    "fallbackAvatar": "/uploads/1791192213481______________png.png",
    "rating": 4.92,
    "reviewCount": 115,
    "experienceYears": 3,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل على بكالوريوس العلاج الوظيفي من جامعة الملك سعود بن عبدالعزيز للعلوم الصحية",
      "حاصل على شهادة Floortime 101",
      "حاصل على ترخيص الهيئة السعودية للتخصصات الصحية",
      "متخصص في علاج المشاكل الحسية والتحديات النمائية لدى الاطفال ومشاكل الأكل",
      "خبرة عملية أكثر من 3 سنوات"
    ],
    "bio": "أخصائي علاج وظيفي مرخص من هيئة التخصصات الصحية وحاصل على اعتماد Floortime 101. متخصص في التحديات الحسية النمائية، وتأهيل المهارات الحركية، وعلاج صعوبات ومشاكل التغذية والأكل لدى الأطفال.",
    "isTopRated": false
  },
  {
    "id": "doc-alaa-eldin-nagy",
    "name": "علاء الدين ناجي",
    "arabicName": "علاء الدين ناجي",
    "nameEn": "Alaa El-Din Nagy",
    "title": "أخصائي ABA",
    "titleEn": "ABA Specialist",
    "specialty": "أخصائي تحليل السلوك التطبيقي ABA",
    "specialtyEn": "Applied Behavior Analysis Specialist",
    "specialtyCode": "أخصائي ABA",
    "specialtyCodeEn": "ABA Specialist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/uploads/1791192231188_________________png.png",
    "image": "/uploads/1791192231188_________________png.png",
    "fallbackAvatar": "/uploads/1791192231188_________________png.png",
    "rating": 4.94,
    "reviewCount": 155,
    "experienceYears": 8,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل على ليسانس آداب وتربية قسم تربية خاصة من جامعة العريش",
      "حاصل على دبلومة مهنية في التربية الخاصة من جامعة العريش",
      "حاصل على إعتماد البورد الأمريكي ABAT",
      "خبرة عملية أكثر من 8 سنوات"
    ],
    "bio": "أخصائي تحليل سلوك تطبيقي معتمد ABAT بخبرة سريرية تتجاوز 8 سنوات في مراكز التأهيل المتخصصة، خبير في تطبيق برامج تعديل السلوك وتنمية مهارات التواصل الوظيفي والاستقلالية.",
    "isTopRated": false
  },
  {
    "id": "doc-ghalib-alotaibi",
    "name": "غالب العتيبي",
    "arabicName": "غالب العتيبي",
    "nameEn": "Ghalib Al-Otaibi",
    "title": "أخصائي ABA",
    "titleEn": "ABA Specialist",
    "specialty": "أخصائي ABA",
    "specialtyEn": "Applied Behavior Analysis Specialist",
    "specialtyCode": "أخصائي ABA",
    "specialtyCodeEn": "ABA Specialist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/uploads/1791192244901______________png.png",
    "image": "/uploads/1791192244901______________png.png",
    "fallbackAvatar": "/uploads/1791192244901______________png.png",
    "rating": 4.9,
    "reviewCount": 90,
    "experienceYears": 2,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الاسلامية",
      "حاصل على دورات في إختبارات الذكاء للأطفال",
      "معتمد كأخصائي تحليل سلوك تطبيقي من QABA",
      "مصنف من الهيئة السعوديه للتخصصات الصحيه",
      "خبرة عملية أكثر من سنتين"
    ],
    "bio": "أخصائي ABA بمركز رابا. حاصل على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الاسلامية · حاصل على دورات في إختبارات الذكاء للأطفال · معتمد كأخصائي تحليل سلوك تطبيقي من QABA · مصنف من الهيئة السعوديه للتخصصات الصحيه · خبرة عملية أكثر من سنتين",
    "isTopRated": false
  },
  {
    "id": "doc-kareem-ragab",
    "name": "كريم رجب",
    "arabicName": "كريم رجب",
    "nameEn": "Kareem Ragab",
    "title": "أخصائي النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "specialty": "أخصائي النطق والتخاطب",
    "specialtyEn": "Speech & Language Pathologist",
    "specialtyCode": "أخصائي النطق والتخاطب",
    "specialtyCodeEn": "Speech & Language Pathologist",
    "category": "speech",
    "department": "قسم النطق والتخاطب والتأهيل اللغوي",
    "avatar": "/uploads/1791192253778__________png.png",
    "image": "/uploads/1791192253778__________png.png",
    "fallbackAvatar": "/uploads/1791192253778__________png.png",
    "rating": 4.91,
    "reviewCount": 100,
    "experienceYears": 3,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل على بكالوريوس العلوم في التربية الخاصة من جامعة مصر للعلوم",
      "حاصل على دبلومة التخاطب لمدة عام من مركز الإشراق الطبي",
      "حاصل على دبلومة التخاطب من جامعة الأزهر",
      "حاصل على شهادة ٤٠ ساعة لفني تحليل السلوك التطبيقي",
      "خبرة عملية أكثر من ٣ سنوات"
    ],
    "bio": "أخصائي النطق والتخاطب بمركز رابا. حاصل على بكالوريوس العلوم في التربية الخاصة من جامعة مصر للعلوم · حاصل على دبلومة التخاطب لمدة عام من مركز الإشراق الطبي · حاصل على دبلومة التخاطب من جامعة الأزهر · حاصل على شهادة ٤٠ ساعة لفني تحليل السلوك التطبيقي · خبرة عملية أكثر من ٣ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-marwa-alsharif",
    "name": "مروة الشريف",
    "arabicName": "مروة الشريف",
    "nameEn": "Marwa Al-Sharif",
    "title": "مشرفة أكاديمية",
    "titleEn": "Academic Supervisor",
    "specialty": "مشرفة أكاديمية",
    "specialtyEn": "Academic Programs Supervisor",
    "specialtyCode": "مشرفة أكاديمية",
    "specialtyCodeEn": "Academic Supervisor",
    "category": "aba",
    "department": "قسم البرامج الأكاديمية والتربية الخاصة",
    "avatar": "/uploads/1791192261779_____________png.png",
    "image": "/uploads/1791192261779_____________png.png",
    "fallbackAvatar": "/uploads/1791192261779_____________png.png",
    "rating": 4.93,
    "reviewCount": 125,
    "experienceYears": 4,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس التربية الخاصة من المعهد العالي للتربية المختصة",
      "حاصلة على دورة في التعامل مع أطفال طيف التوحد",
      "خبرة عملية أكثر من ٤ سنوات"
    ],
    "bio": "مشرفة أكاديمية بمركز رابا. حاصلة على بكالوريوس التربية الخاصة من المعهد العالي للتربية المختصة · حاصلة على دورة في التعامل مع أطفال طيف التوحد · خبرة عملية أكثر من ٤ سنوات",
    "isTopRated": false
  },
  {
    "id": "doc-mostafa-mahmoud",
    "name": "مصطفى محمود",
    "arabicName": "مصطفى محمود",
    "nameEn": "Mostafa Mahmoud",
    "title": "أخصائي ABA",
    "titleEn": "ABA Specialist & QASP-S",
    "specialty": "أخصائي تحليل السلوك التطبيقي ومشرف توحد معتمد",
    "specialtyEn": "Applied Behavior Analysis Specialist & QASP-S",
    "specialtyCode": "أخصائي ABA",
    "specialtyCodeEn": "ABA Specialist & QASP-S",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/uploads/1791192271638_____________png.png",
    "image": "/uploads/1791192271638_____________png.png",
    "fallbackAvatar": "/uploads/1791192271638_____________png.png",
    "rating": 4.93,
    "reviewCount": 135,
    "experienceYears": 4,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل علي درجة الـ ليسانس من جامعة أسيوط",
      "حاصل علي اعتماد ABAT من البورد الأمريكي كفني تحليل سلوك تطبيقي",
      "حاصل على اعتماد QASP-S كمشرف خدمات توحد معتمد من البورد الأمريكي",
      "حاصل على برنامج تقييم معالم تطور السلوك اللفظي VB-MAPP",
      "خبرة عملية أكثر من 4 سنوات"
    ],
    "bio": "أخصائي تحليل سلوك تطبيقي ومشرف خدمات توحد معتمد دولياً QASP-S و ABAT، متخصص في تطبيق مقياس VB-MAPP وبناء الخطط التأهيلية الفردية المبنية على تحليل السلوك اللفظي.",
    "isTopRated": false
  },
  {
    "id": "doc-mayar-alsaeed",
    "name": "ميار السعيد",
    "arabicName": "ميار السعيد",
    "nameEn": "Mayar Al-Saeed",
    "title": "أخصائية النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "specialty": "أخصائية علاج اضطرابات النطق واللغة",
    "specialtyEn": "Speech & Language Pathologist",
    "specialtyCode": "أخصائية النطق والتخاطب",
    "specialtyCodeEn": "Speech & Language Pathologist",
    "category": "speech",
    "department": "قسم النطق والتخاطب والتأهيل اللغوي",
    "avatar": "/uploads/1791192282250_____________png.png",
    "image": "/uploads/1791192282250_____________png.png",
    "fallbackAvatar": "/uploads/1791192282250_____________png.png",
    "rating": 4.92,
    "reviewCount": 130,
    "experienceYears": 7,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس التربيه الخاصه تخصص إعاقة عقلية من جامعة الإمام محمد بن سعود",
      "حاصلة على دوره نطق وتخاطب 70 ساعه من أكاديمية علم النفس تحت اشراف وزاره التعليم",
      "خبرة عملية أكثر من 7 سنوات"
    ],
    "bio": "أخصائية نطق وتخاطب وتربية خاصة بخبرة تتجاوز 7 سنوات في تقييم وتأهيل اضطرابات اللغة والكلام لدى الأطفال، متخصصة في تأهيل حالات التأخر اللغوي ومتلازمة داون وطيف التوحد.",
    "isTopRated": false
  },
  {
    "id": "doc-hala-badran",
    "name": "هالة بدران",
    "arabicName": "هالة بدران",
    "nameEn": "Hala Badran",
    "title": "أخصائية النطق والتخاطب",
    "titleEn": "Senior Speech & Clinical Psychologist",
    "specialty": "أخصائية النطق والتخاطب",
    "specialtyEn": "Senior Speech Pathologist & Clinical Psychologist",
    "specialtyCode": "أخصائية النطق والتخاطب",
    "specialtyCodeEn": "Senior Speech & Clinical Psychologist",
    "category": "speech",
    "department": "قسم النطق والتخاطب والتأهيل اللغوي",
    "avatar": "/uploads/1791192291320____________png.png",
    "image": "/uploads/1791192291320____________png.png",
    "fallbackAvatar": "/uploads/1791192291320____________png.png",
    "rating": 4.98,
    "reviewCount": 260,
    "experienceYears": 20,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة علي ليسانس آداب علم النفس من جامعة الزقازيق",
      "حاصله علي ماجستير في التوحد من جامعة الزقازيق",
      "حاصلة علي دبلومة مهنية تخصص نطق وتواصل من جامعة عين شمس",
      "حاصلة علي دبلومة تدريبية في النطق والتخاطب من جامعة عين شمس",
      "حاصلة علي دبلومة في علم النفس الإكلينكي من جامعة بنها",
      "خبرة عملية أكثر من ٢٠ سنة"
    ],
    "bio": "أخصائية النطق والتخاطب بمركز رابا. حاصلة علي ليسانس آداب علم النفس من جامعة الزقازيق · حاصله علي ماجستير في التوحد من جامعة الزقازيق · حاصلة علي دبلومة مهنية تخصص نطق وتواصل من جامعة عين شمس · حاصلة علي دبلومة تدريبية في النطق والتخاطب من جامعة عين شمس · حاصلة علي دبلومة في علم النفس الإكلينكي من جامعة بنها · خبرة عملية أكثر من ٢٠ سنة",
    "isTopRated": false
  },
  {
    "id": "doc-hind-elsayed",
    "name": "هند السيد",
    "arabicName": "هند السيد",
    "nameEn": "Hind El-Sayed",
    "title": "أخصائية النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "specialty": "أخصائية النطق والتخاطب",
    "specialtyEn": "Speech & Language Pathologist",
    "specialtyCode": "أخصائية النطق والتخاطب",
    "specialtyCodeEn": "Speech & Language Pathologist",
    "category": "speech",
    "department": "قسم النطق والتخاطب والتأهيل اللغوي",
    "avatar": "/uploads/1791192301426___________png.png",
    "image": "/uploads/1791192301426___________png.png",
    "fallbackAvatar": "/uploads/1791192301426___________png.png",
    "rating": 4.94,
    "reviewCount": 165,
    "experienceYears": 12,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصله على درجة البكالوريوس من جامعة القاهرة",
      "حاصله على دبلوم عام تربوي من جامعة طنطا",
      "حاصلة على دبلومة تخاطب ٣٠٠ ساعة من جامعة عين شمس",
      "حاصله على دبلومة فى التوحد من جامعة عين شمس",
      "حاصله على دبلومة صعوبات تعلم مع د/لبنى الشرقاوى",
      "خبرة عملية أكثر من ١٢ س"
    ],
    "bio": "أخصائية النطق والتخاطب بمركز رابا. حاصله على درجة البكالوريوس من جامعة القاهرة · حاصله على دبلوم عام تربوي من جامعة طنطا · حاصلة على دبلومة تخاطب ٣٠٠ ساعة من جامعة عين شمس · حاصله على دبلومة فى التوحد من جامعة عين شمس · حاصله على دبلومة صعوبات تعلم مع د/لبنى الشرقاوى · خبرة عملية أكثر من ١٢ س",
    "isTopRated": false
  },
  {
    "id": "doc-haitham-alzaidan",
    "name": "هيثم الزيدان",
    "arabicName": "هيثم الزيدان",
    "nameEn": "Haitham Al-Zaidan",
    "title": "أخصائي نفسي - أخصائي ABA",
    "titleEn": "ABA Specialist",
    "specialty": "أخصائي نفسي - أخصائي ABA",
    "specialtyEn": "Applied Behavior Analysis Specialist",
    "specialtyCode": "أخصائي ABA",
    "specialtyCodeEn": "ABA Specialist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/uploads/1791192310187______________png.png",
    "image": "/uploads/1791192310187______________png.png",
    "fallbackAvatar": "/uploads/1791192310187______________png.png",
    "rating": 4.88,
    "reviewCount": 75,
    "experienceYears": 1,
    "patientsCount": 1000,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصل على بكالوريوس علم النفس من جامعه الإمام محمد بن سعود الاسلامية",
      "حاصل على شهادة فني تحليل سلوك تطبيقي ABAT",
      "خبرة عملية أكثر من سنة"
    ],
    "bio": "أخصائي نفسي - أخصائي ABA بمركز رابا. حاصل على بكالوريوس علم النفس من جامعه الإمام محمد بن سعود الاسلامية · حاصل على شهادة فني تحليل سلوك تطبيقي ABAT · خبرة عملية أكثر من سنة",
    "isTopRated": false
  },
  {
    "id": "doc-renad-otaibi",
    "name": "ريناد العتيبي",
    "arabicName": "ريناد العتيبي",
    "nameEn": "Renad Al-Otaibi",
    "title": "أخصائي نفسي",
    "titleEn": "Psychologist",
    "specialty": "أخصائي نفسي",
    "specialtyEn": "Psychologist & Behavior Interventionist",
    "specialtyCode": "أخصائي نفسي",
    "specialtyCodeEn": "Psychologist",
    "category": "psychology",
    "avatar": "/specialists/cards/spec_34_hala-enazi.png",
    "image": "/specialists/cards/spec_34_hala-enazi.png",
    "fallbackAvatar": "/specialists/cards/spec_34_hala-enazi.png",
    "rating": 4.9,
    "reviewCount": 45,
    "experienceYears": 1,
    "patientsCount": 150,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "tags": [
      "حاصلة على بكالوريوس علم النفس من كلية التربية - جامعة الملك سعود",
      "حاصلة على اعتماد ABAT في تحليل السلوك التطبيقي من QABA",
      "خبرة عملية أكثر من سنة"
    ],
    "bio": "أخصائي نفسي بمركز رابا. حاصلة على بكالوريوس علم النفس من كلية التربية - جامعة الملك سعود · حاصلة على اعتماد ABAT في تحليل السلوك التطبيقي من QABA · خبرة عملية أكثر من سنة",
    "isTopRated": false
  }
];

// Reusable function to compute unified, deduplicated and priority-sorted doctors
export function getUnifiedDoctors(sourceDoctors: Doctor[] = DOCTORS_DATA, extraSpecialists?: any[]): Doctor[] {
  const cleanSourceDoctors = deduplicateDoctors(sourceDoctors);

  let baseDocs: Doctor[];
  if (extraSpecialists && extraSpecialists.length > 0) {
    baseDocs = extraSpecialists.map((spec) => {
      const matchingDoc = cleanSourceDoctors.find(d => isSameSpecialist(d, spec));
      return {
        id: spec.id.startsWith('spec-') ? spec.id.replace('spec-', 'doc-') : (matchingDoc?.id || `doc-${spec.id}`),
        name: spec.name,
        arabicName: spec.name,
        nameEn: spec.nameEn || matchingDoc?.nameEn || spec.name,
        title: spec.title || matchingDoc?.title || '',
        titleEn: spec.titleEn || matchingDoc?.titleEn || spec.title || '',
        specialty: spec.role || matchingDoc?.specialty || spec.title || '',
        specialtyEn: spec.roleEn || matchingDoc?.specialtyEn || spec.titleEn || spec.title || '',
        specialtyCode: spec.title || matchingDoc?.specialtyCode || '',
        specialtyCodeEn: spec.titleEn || matchingDoc?.specialtyCodeEn || 'SPECIALIST',
        category: (spec.category as any) || matchingDoc?.category || ((spec.title?.includes('نطق') || spec.title?.includes('تخاطب')) ? 'speech' : (spec.title?.includes('وظيفي') || spec.title?.includes('حركي')) ? 'occupational' : (spec.title?.includes('نفس')) ? 'psychology' : 'aba'),
        department: spec.department || matchingDoc?.department || spec.role || spec.title,
        avatar: spec.avatar || matchingDoc?.avatar || '/uploads/1790827426491_50_png.png',
        fallbackAvatar: spec.avatar || matchingDoc?.fallbackAvatar || '/uploads/1790827426491_50_png.png',
        rating: spec.rating || matchingDoc?.rating || 4.9,
        reviewCount: spec.reviewsCount || matchingDoc?.reviewCount || 120,
        experienceYears: spec.experienceYears || matchingDoc?.experienceYears || 5,
        patientsCount: matchingDoc?.patientsCount || 1000,
        sessionPrice: 0,
        location: matchingDoc?.location || '',
        locationEn: matchingDoc?.locationEn || '',
        isAvailable: true,
        nextSlot: matchingDoc?.nextSlot || 'متاح للحجز',
        nextSlotEn: matchingDoc?.nextSlotEn || 'Available for booking',
        tags: (spec.specialties && spec.specialties.length > 0) ? spec.specialties : (matchingDoc?.tags || []),
        bio: spec.bio || matchingDoc?.bio || '',
        isTopRated: (spec.rating || matchingDoc?.rating || 0) >= 4.9
      };
    });

    const existingNames = new Set(baseDocs.map(d => normalizeSpecialistName(d.name)));
    cleanSourceDoctors.forEach((doc) => {
      if (!existingNames.has(normalizeSpecialistName(doc.name))) {
        baseDocs.push(doc);
      }
    });
  } else {
    baseDocs = cleanSourceDoctors;
  }

  return sortSpecialistsByPriority(deduplicateDoctors(baseDocs));
}

// Convert a Doctor record into a full Specialist record for CV modal and booking
export function doctorToSpecialist(doctor: Doctor, allSpecialists?: any[]): Specialist {
  if (allSpecialists && allSpecialists.length > 0) {
    const matched = allSpecialists.find((s) => isSameSpecialist(s, doctor));
    if (matched) {
      return {
        ...matched,
        avatar: doctor.avatar || matched.avatar,
        title: doctor.title || matched.title,
        role: doctor.specialty || matched.role,
        bio: doctor.bio || matched.bio,
        experienceYears: doctor.experienceYears || matched.experienceYears,
        rating: doctor.rating || matched.rating,
        specialties: (doctor.tags && doctor.tags.length > 0) ? doctor.tags : matched.specialties,
      };
    }
  }

  return {
    id: doctor.id.startsWith('spec-') ? doctor.id : `spec-${doctor.id.replace('doc-', '')}`,
    name: doctor.name,
    nameEn: doctor.nameEn || doctor.name,
    role: doctor.specialty || doctor.title,
    roleEn: doctor.specialtyEn || doctor.titleEn || doctor.title,
    title: doctor.title,
    titleEn: doctor.titleEn || doctor.title,
    licenseNumber: 'SCFHS-24-1022',
    category: doctor.category,
    avatar: doctor.avatar,
    bio: doctor.bio || 'أخصائي معتمد في مركز رابا للرعاية النهارية وتأهيل ذوي الإعاقة. يمتلك خبرة سريرية متقدمة في تطبيق الخطط التأهيلية الفردية المبنية على الأدلة والقياس الدقيق للنتائج وتطوير مهارات الأطفال التكيفية والتواصلية.',
    bioEn: 'Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.',
    rating: doctor.rating || 4.9,
    reviewsCount: doctor.reviewCount || 120,
    experienceYears: doctor.experienceYears || 5,
    education: [
      'بكالوريوس في علوم التأهيل والرعاية الطبية التطبيقية',
      'دبلوم مهني متقدم في برامج التدخل المبكر وتعديل السلوك'
    ],
    educationEn: [
      'Bachelor of Rehabilitation & Applied Medical Sciences',
      'Advanced Diploma in Early Intervention & Behavioral Therapy'
    ],
    certifications: [
      'ترخيص الهيئة السعودية للتخصصات الصحية (SCFHS)',
      'اعتماد بورد التأهيل الإكلينيكي'
    ],
    certificationsEn: [
      'Saudi Commission for Health Specialties (SCFHS) License',
      'Clinical Board Accreditation'
    ],
    specialties: (doctor.tags && doctor.tags.length > 0) ? doctor.tags : ['تأهيل متخصص', 'تدخل مبكر', 'خطط فردية'],
    specialtiesEn: ['Specialized Rehabilitation', 'Early Intervention', 'Individual Treatment Plans'],
    availableDays: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
    availableDaysEn: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    sessionPrice: 0,
  };
}

interface DoctorCardSliderProps {
  doctors?: Doctor[];
  specialists?: any[];
  onBookAppointment?: (doctor: Doctor) => void;
  onViewCv?: (doctor: Doctor) => void;
  onOpenSpecialistsPage?: () => void;
  className?: string;
}

export const DoctorCardSlider: React.FC<DoctorCardSliderProps> = ({
  doctors = DOCTORS_DATA,
  specialists,
  onBookAppointment,
  onViewCv,
  onOpenSpecialistsPage,
  className = '',
}) => {
  const { isArabic } = useLanguage();

  // Search and Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'earliest' | 'rating' | 'experience'>('earliest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  // Favorites state synced across slider and directory
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('raba_favorite_doctors');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const handleFavUpdate = (e: any) => {
      if (e?.detail) setFavorites(e.detail);
      else {
        try {
          const saved = localStorage.getItem('raba_favorite_doctors');
          if (saved) setFavorites(JSON.parse(saved));
        } catch {}
      }
    };
    window.addEventListener('raba_favorite_doctors_updated', handleFavUpdate);
    return () => window.removeEventListener('raba_favorite_doctors_updated', handleFavUpdate);
  }, []);

  // Interactive user star ratings state (persisted in localStorage)
  const [userRatings, setUserRatings] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('raba_user_doctor_ratings');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [hoveredRating, setHoveredRating] = useState<{ docId: string; star: number } | null>(null);
  const [ratingToast, setRatingToast] = useState<{ docId: string; star: number } | null>(null);
  const [doctorRatingDeltas, setDoctorRatingDeltas] = useState<Record<string, { ratingDelta: number; countDelta: number }>>({});

  const handleRateDoctor = (e: React.MouseEvent, docId: string, star: number) => {
    e.stopPropagation();
    const prevStar = userRatings[docId];
    const updated = { ...userRatings, [docId]: star };
    setUserRatings(updated);
    try {
      localStorage.setItem('raba_user_doctor_ratings', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('raba_doctor_rating_updated', { detail: { docId, star } }));
    } catch {}

    setDoctorRatingDeltas(prev => {
      const doc = effectiveDoctors.find(d => d.id === docId);
      const baseRating = doc?.rating || 4.9;
      const baseCount = doc?.reviewCount || 100;
      
      const newCount = prevStar ? baseCount : baseCount + 1;
      const totalPoints = (baseRating * baseCount) - (prevStar || 0) + star;
      const newRating = Number((totalPoints / newCount).toFixed(2));

      return {
        ...prev,
        [docId]: {
          ratingDelta: newRating - baseRating,
          countDelta: prevStar ? 0 : 1
        }
      };
    });

    setRatingToast({ docId, star });
    setTimeout(() => {
      setRatingToast(curr => curr?.docId === docId ? null : curr);
    }, 2800);
  };

  // Dynamic Specialist Image and Card Customizations (from Admin Dashboard)
  const [customSettings, setCustomSettings] = useState<Record<string, SpecialistImageSetting>>(() => getStoredSpecialistSettings());
  const [globalCardSettings, setGlobalCardSettings] = useState<GlobalCardSettings>(() => getStoredGlobalCardSettings());

  useEffect(() => {
    const handleUpdate = (e?: any) => {
      if (e?.type === 'raba_specialist_settings_updated' && e?.detail && !('timestamp' in e.detail)) {
        setCustomSettings(e.detail);
      } else {
        setCustomSettings(getStoredSpecialistSettings());
      }
    };
    const handleGlobalUpdate = (e?: any) => {
      if (e?.type === 'raba_global_card_settings_updated' && e?.detail && !('timestamp' in e.detail)) {
        setGlobalCardSettings(e.detail);
      } else {
        setGlobalCardSettings(getStoredGlobalCardSettings());
      }
    };
    window.addEventListener('raba_specialist_settings_updated', handleUpdate);
    window.addEventListener('raba_global_card_settings_updated', handleGlobalUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('raba_persistent_sync_ready', handleUpdate);
    window.addEventListener('raba_persistent_sync_ready', handleGlobalUpdate);
    return () => {
      window.removeEventListener('raba_specialist_settings_updated', handleUpdate);
      window.removeEventListener('raba_global_card_settings_updated', handleGlobalUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('raba_persistent_sync_ready', handleUpdate);
      window.removeEventListener('raba_persistent_sync_ready', handleGlobalUpdate);
    };
  }, []);

  // Single unified slider ref
  const sliderRef = useRef<HTMLDivElement>(null);

  // Dragging state for unified Slider
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Merge doctors list with any specialists data passed dynamically, deduplicating rigorously
  const effectiveDoctors = useMemo(() => {
    return getUnifiedDoctors(doctors, specialists);
  }, [doctors, specialists]);

  // Categories list for classification filter (حسب التخصص)
  const categories = useMemo(() => [
    { id: 'all', labelAr: 'جميع التخصصات', labelEn: 'All Specialties' },
    { id: 'aba', labelAr: 'تحليل السلوك التطبيقي (ABA)', labelEn: 'ABA Therapy' },
    { id: 'occupational', labelAr: 'العلاج الوظيفي والتكامل الحسي', labelEn: 'Occupational Therapy' },
    { id: 'speech', labelAr: 'النطق والتخاطب', labelEn: 'Speech & Language' },
    { id: 'psychology', labelAr: 'الاستشارات النفسية والإدراك', labelEn: 'Child Psychology' },
  ], []);

  // Compute doctor count for each specialty category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: effectiveDoctors.length,
      aba: 0,
      occupational: 0,
      speech: 0,
      psychology: 0,
    };
    effectiveDoctors.forEach((doc) => {
      if (counts[doc.category] !== undefined) {
        counts[doc.category]++;
      }
    });
    return counts;
  }, [effectiveDoctors]);

  // Filtered & Sorted Doctors
  const filteredDoctors = useMemo(() => {
    let list = effectiveDoctors.filter((doc) => {
      // Category filter (تصنيف حسب التخصص)
      if (selectedCategory !== 'all' && doc.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = doc.name.toLowerCase().includes(q) || (doc.nameEn && doc.nameEn.toLowerCase().includes(q));
        const matchSpecialty = doc.specialty.toLowerCase().includes(q) || doc.specialtyCode.toLowerCase().includes(q) || doc.specialtyCodeEn.toLowerCase().includes(q);
        const matchBio = doc.bio && doc.bio.toLowerCase().includes(q);
        if (!matchName && !matchSpecialty && !matchBio) {
          return false;
        }
      }
      return true;
    });

    // Sort
    if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'experience') {
      list = [...list].sort((a, b) => b.experienceYears - a.experienceYears);
    } else {
      // Default: Strict priority sorting (هناء بشير, أحمد أبو زيد, هشام علي, حنين العبيدي, عامر قادوس, ضحى خالد, حشمة المطيري)
      list = sortSpecialistsByPriority(list);
    }
    return list;
  }, [effectiveDoctors, selectedCategory, searchQuery, sortBy]);

  // Reset slider position when category or search changes
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [selectedCategory, searchQuery, sortBy]);

  // Scroll handler for Single Slider
  const handleScroll = (direction: 'next' | 'prev') => {
    const el = sliderRef.current;
    if (!el) return;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const scrollAmount = isMobile ? Math.round(el.clientWidth * 0.75) : 380;
    let delta = direction === 'prev' ? -scrollAmount : scrollAmount;
    if (isArabic) delta = -delta;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  // Drag handlers for Single Slider
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = sliderRef.current;
    if (!el) return;
    setIsDragging(true);
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  // Toggle favorite with cross-page sync
  const toggleFavorite = (e: React.MouseEvent, docId: string) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = { ...prev, [docId]: !prev[docId] };
      try {
        localStorage.setItem('raba_favorite_doctors', JSON.stringify(next));
        window.dispatchEvent(new CustomEvent('raba_favorite_doctors_updated', { detail: next }));
      } catch {}
      return next;
    });
  };

  // Book visit action
  const handleBook = (doctor: Doctor) => {
    if (onBookAppointment) {
      onBookAppointment(doctor);
    }
  };

  // View CV action
  const handleViewProfile = (doctor: Doctor) => {
    if (onViewCv) {
      onViewCv(doctor);
    }
  };

  // Render an Individual Specialist Card
  // Explicitly contains: Specialist Photo, Name, Specialty, Bio/CV, and Years of Experience
  // Explicitly excludes: Location and Branch
  // Styled with Distinct Logo-Compatible Identity Themes
  const renderDoctorCard = (doctor: Doctor, index: number = 0) => {
    const isFav = !!favorites[doctor.id];
    const theme = getSpecialistLogoTheme(doctor, index);
    
    // Dynamic custom settings from Admin Dashboard
    const custom = findCustomSettingForDoctor(doctor) || customSettings[doctor.id] || customSettings[doctor.id.replace('doc-', 'spec-')];
    const rawAvatar = custom?.avatar || doctor.avatar;
    const activeAvatar = getResolvedImageUrl(rawAvatar);
    const fitClass = custom?.displayMode === 'contain' ? 'object-contain' : 'object-cover';
    const posClass = custom?.focalPosition === 'top' ? 'object-top' : custom?.focalPosition === 'bottom' ? 'object-bottom' : 'object-center';
    const zoomScale = custom?.zoomLevel ? custom.zoomLevel / 100 : 1;
    const isTop = custom?.isTopRated !== undefined ? custom.isTopRated : doctor.isTopRated;
    const deltas = doctorRatingDeltas[doctor.id];
    const baseRating = typeof doctor?.rating === 'number' && !isNaN(doctor.rating) ? doctor.rating : 4.9;
    const displayRating = deltas ? Number((baseRating + deltas.ratingDelta).toFixed(1)) : baseRating;
    const baseCount = typeof doctor?.reviewCount === 'number' && !isNaN(doctor.reviewCount) ? doctor.reviewCount : 120;
    const displayReviewCount = deltas ? baseCount + deltas.countDelta : baseCount;
    const userRating = userRatings[doctor.id];

    return (
      <div
        key={doctor.id}
        className={`w-[66vw] min-w-[220px] max-w-[260px] sm:min-w-0 sm:max-w-none sm:w-[325px] md:w-[350px] lg:w-[375px] shrink-0 snap-start self-start bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden border ${theme.cardBorderHover} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group`}
      >
        {/* Top Slim Accent Strip in Doctor's Brand/Logo Color */}
        <div className={`h-1.5 w-full ${theme.topAccentBar}`} />

        {/* Upper Hero Image Area with Overlaid Badges */}
        <div className={`relative h-40 sm:h-48 md:h-56 overflow-hidden ${theme.photoBg} border-b border-slate-100 dark:border-white/5 transition-colors`}>
          <img
            src={activeAvatar}
            alt={isArabic ? doctor.name : (doctor.nameEn || doctor.name)}
            width={375}
            height={224}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              handleImageErrorWithStore(e, rawAvatar, doctor.fallbackAvatar || doctor.avatar);
            }}
            className={`w-full h-full ${fitClass} ${posClass} hover:scale-105 transition-transform duration-500`}
            style={{
              transform: zoomScale !== 1 ? `scale(${zoomScale})` : undefined
            }}
            referrerPolicy="no-referrer"
          />

          {/* Top Left Badge: TOP RATED */}
          {isTop && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
              <span className="bg-white/95 dark:bg-slate-950/90 backdrop-blur-xs text-slate-900 dark:text-white text-[8px] sm:text-[10px] font-black tracking-wider px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md uppercase">
                {isArabic ? 'الأعلى تقييماً' : 'TOP RATED'}
              </span>
            </div>
          )}

          {/* Top Right Heart / Favorite Button */}
          <button
            onClick={(e) => toggleFavorite(e, doctor.id)}
            aria-label="Save to favorites"
            className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/95 dark:bg-slate-900/90 shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer text-slate-700 dark:text-slate-200 hover:text-rose-500"
          >
            <Heart 
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-600 dark:text-slate-300'
              }`} 
            />
          </button>
        </div>

        {/* Lower Card Body - Compact, snug without empty dead space */}
        <div className="p-2.5 sm:p-4 md:p-5 flex flex-col">
          <div>
            {/* 1. Specialty Code & Rating Pill */}
            <div className="flex items-center justify-between gap-1 mb-1 sm:mb-2">
              <span className={`text-[9px] sm:text-[11px] font-black uppercase tracking-wider truncate max-w-[68%] px-2 sm:px-2.5 py-0.5 rounded-lg transition-colors ${theme.specialtyBadge}`}>
                {isArabic ? doctor.specialtyCode : doctor.specialtyCodeEn}
              </span>

              <span className="flex items-center gap-0.5 sm:gap-1 bg-amber-400/10 text-slate-900 dark:text-amber-300 px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-xs font-black shrink-0">
                <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                <span>{(displayRating || 4.9).toFixed(1)}</span>
              </span>
            </div>

            {/* 2. Doctor Name */}
            <h3 className="text-xs sm:text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-snug mb-0.5 sm:mb-2.5 truncate">
              {isArabic ? doctor.name : (doctor.nameEn || doctor.name)}
            </h3>

            {/* 3. 3-Column Metrics Row: Prominently Highlights Years of Experience */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-white/10 rtl:divide-x-reverse py-1 sm:py-2.5 border-y border-slate-100 dark:border-white/10 mb-1 sm:mb-2 text-center">
              <div className="px-0.5 sm:px-1">
                <span className={`text-xs sm:text-base md:text-lg font-black block font-sans ${theme.expMetricColor}`}>
                  {doctor.experienceYears}
                </span>
                <span className="text-[7.5px] sm:text-[9.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mt-0.5">
                  {isArabic ? 'سنوات خبرة' : 'YEARS EXP.'}
                </span>
              </div>

              <div className="px-0.5 sm:px-1">
                <span className="text-xs sm:text-base md:text-lg font-black text-slate-900 dark:text-white block font-sans">
                  {displayReviewCount}
                </span>
                <span className="text-[7.5px] sm:text-[9.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mt-0.5">
                  {isArabic ? 'تقييم معتمد' : 'REVIEWS'}
                </span>
              </div>

              <div className="px-0.5 sm:px-1">
                <span className="text-xs sm:text-base md:text-lg font-black text-amber-500 dark:text-amber-400 flex items-center justify-center gap-0.5 sm:gap-1 font-sans">
                  <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                  <span>{(displayRating || 4.9).toFixed(1)}</span>
                </span>
                <span className="text-[7.5px] sm:text-[9.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mt-0.5">
                  {isArabic ? 'متوسط التقييم' : 'RATING'}
                </span>
              </div>
            </div>

            {/* 5. Interactive Star Rating Widget directly on the Card */}
            <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-500/20 rounded-xl sm:rounded-2xl p-1 sm:p-2.5 my-1 sm:my-1.5 flex items-center justify-between gap-1 transition-all shadow-2xs">
              <div className="min-w-0">
                <span className="text-[8.5px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200 block truncate">
                  {ratingToast?.docId === doctor.id
                    ? (isArabic ? '✨ تم تقييمك!' : '✨ Saved!')
                    : userRating
                      ? (isArabic ? `تقييمك: ${userRating}/5` : `Rating: ${userRating}/5`)
                      : (isArabic ? 'أضف تقييمك:' : 'Rate:')
                  }
                </span>
                <span className="text-[7px] sm:text-[9.5px] text-slate-400 dark:text-slate-500 block truncate">
                  {userRating 
                    ? (isArabic ? 'تعديل التقييم' : 'Update') 
                    : (isArabic ? 'قيّم بالنجوم' : 'Click stars')}
                </span>
              </div>

              <div className="flex items-center gap-0.5 shrink-0" dir="ltr">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isHovered = hoveredRating?.docId === doctor.id && star <= hoveredRating.star;
                  const isSelected = star <= (userRating || 0);
                  const isFilled = isHovered || isSelected;

                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={(e) => handleRateDoctor(e, doctor.id, star)}
                      onMouseEnter={() => setHoveredRating({ docId: doctor.id, star })}
                      onMouseLeave={() => setHoveredRating(null)}
                      className="p-0.5 rounded-md hover:scale-125 active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400/40"
                      title={`${star} ${isArabic ? (star === 1 ? 'نجمة' : 'نجوم') : 'stars'}`}
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star 
                        className={`w-2.5 h-2.5 sm:w-4 sm:h-4 transition-colors ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400 drop-shadow-2xs'
                            : 'text-slate-300 dark:text-slate-600 hover:text-amber-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Row: Actions (Without Location or Branch) - Sits tightly right below rating widget */}
          <div className="flex items-center justify-between gap-1 mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-slate-100 dark:border-white/5">
            <div className={`flex items-center gap-1 text-xs font-bold min-w-0 ${theme.availableText}`}>
              <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${theme.availableDot} animate-pulse shrink-0`}></span>
              <span className="text-[8.5px] sm:text-[11px] truncate">
                {isArabic ? 'متاح للحجز' : 'Available'}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {onViewCv && (
                <button
                  onClick={() => handleViewProfile(doctor)}
                  title={isArabic ? 'السيرة الذاتية' : 'View CV'}
                  className={`px-1.5 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border font-bold text-[9px] sm:text-xs flex items-center gap-0.5 transition-colors cursor-pointer shadow-2xs ${theme.cvButton}`}
                >
                  <FileText className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                  <span className="inline">{isArabic ? 'السيرة' : 'CV'}</span>
                </button>
              )}

              <button
                onClick={() => handleBook(doctor)}
                className={`font-bold text-[10px] sm:text-sm px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap ${theme.bookButton}`}
              >
                {isArabic ? 'حجز جلسة' : 'Book visit'}
              </button>
            </div>
          </div>

        </div>

      </div>
    );
  };

  return (
    <div className={`w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 ${className}`}>
      
      {/* 1. Header Top Row: Brand/Title & Subtitle on Left, Search Bar on Right */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/40 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{isArabic ? `${effectiveDoctors.length} أخصائي واستشاري معتمد` : `${effectiveDoctors.length} Certified Specialists & Consultants`}</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {isArabic ? 'فريق رابا الطبي والتأهيلي' : 'Raba Medical & Rehabilitation Team'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            {isArabic 
              ? 'تصفح نخبة الاستشاريين والأخصائيين المعتمدين في مركز رابا لتأهيل ورعاية الأطفال'
              : 'Browse our elite certified consultants & specialists at Raba Day Care Center.'}
          </p>
        </div>

        {/* Actions: View More / Directory Button & Search Input Bar */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap sm:flex-nowrap">
          {onOpenSpecialistsPage && (
            <button
              onClick={onOpenSpecialistsPage}
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-[#dff1ec] to-[#e6f4f1] dark:from-teal-950/60 dark:to-teal-900/40 hover:from-[#0d5c52] hover:to-[#0f766e] hover:text-white dark:hover:from-[#2dd4bf] dark:hover:to-[#14b8a6] dark:hover:text-slate-950 text-[#0d5c52] dark:text-[#2dd4bf] border border-[#0d5c52]/20 dark:border-[#2dd4bf]/20 rounded-2xl text-xs sm:text-sm font-black shadow-xs hover:shadow-md transition-all cursor-pointer group"
              title={isArabic ? 'فتح صفحة دليل الأخصائيين الشاملة' : 'Open Specialists Directory Page'}
            >
              <span>{isArabic ? 'عرض المزيد (دليل الأخصائيين)' : 'View More (Directory)'}</span>
              {isArabic ? <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          )}

          {/* Search Input Bar */}
          <div className="relative w-full md:w-72 lg:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isArabic ? 'ابحث باسم الأخصائي أو التخصص أو المؤهل...' : 'Search by name, specialty, or bio...'}
              className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 sm:py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3B36] dark:focus:ring-[#00E5BE] transition-all shadow-xs"
            />
            <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3.5' : 'left-3.5'}`} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`text-xs text-slate-400 hover:text-slate-600 absolute top-1/2 -translate-y-1/2 ${isArabic ? 'left-3' : 'right-3'}`}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Category Classification Filter Tabs (فلتر تصنيف حسب التخصص) */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] ?? 0;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B3B36] text-white shadow-md dark:bg-[#00E5BE] dark:text-slate-950 font-black scale-[1.02]'
                    : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-300'
                }`}
              >
                <span>{isArabic ? cat.labelAr : cat.labelEn}</span>
                <span
                  className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-bold tabular-nums ${
                    isSelected
                      ? 'bg-white/20 dark:bg-slate-950/20 text-white dark:text-slate-950'
                      : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Toolbar: Count, Sort Dropdown & Slider Navigation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-6 border-b border-slate-200/70 dark:border-white/10">
        <div className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400">
          {isArabic ? `${filteredDoctors.length} أخصائي متاح` : `${filteredDoctors.length} Specialists Available`}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
            >
              <span>
                {sortBy === 'earliest' && (isArabic ? 'الترتيب: الموصى بهم' : 'Sort: Recommended')}
                {sortBy === 'rating' && (isArabic ? 'الترتيب: الأعلى تقييماً' : 'Sort: Highest Rated')}
                {sortBy === 'experience' && (isArabic ? 'الترتيب: الأكثر خبرة' : 'Sort: Most Experienced')}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isSortOpen && (
              <div className={`absolute top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-2xl shadow-xl p-1.5 z-40 ${isArabic ? 'left-0' : 'right-0'}`}>
                <button
                  onClick={() => { setSortBy('earliest'); setIsSortOpen(false); }}
                  className={`w-full text-right rtl:text-right ltr:text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                    sortBy === 'earliest' ? 'bg-slate-100 dark:bg-white/10 text-[#0B3B36] dark:text-[#00E5BE]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{isArabic ? 'الموصى بهم (الافتراضي)' : 'Recommended (Default)'}</span>
                  {sortBy === 'earliest' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => { setSortBy('rating'); setIsSortOpen(false); }}
                  className={`w-full text-right rtl:text-right ltr:text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                    sortBy === 'rating' ? 'bg-slate-100 dark:bg-white/10 text-[#0B3B36] dark:text-[#00E5BE]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{isArabic ? 'الأعلى تقييماً' : 'Highest rated'}</span>
                  {sortBy === 'rating' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => { setSortBy('experience'); setIsSortOpen(false); }}
                  className={`w-full text-right rtl:text-right ltr:text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                    sortBy === 'experience' ? 'bg-slate-100 dark:bg-white/10 text-[#0B3B36] dark:text-[#00E5BE]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{isArabic ? 'الأكثر خبرة' : 'Most experienced'}</span>
                  {sortBy === 'experience' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Slider Navigation Buttons (Prev / Next) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleScroll('prev')}
              aria-label={isArabic ? 'السابق' : 'Previous'}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/10 shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              {isArabic ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleScroll('next')}
              aria-label={isArabic ? 'التالي' : 'Next'}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/10 shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* No Results Fallback */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 p-8">
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-3">
            {isArabic ? 'لم يتم العثور على أخصائيين يطابقون خيارات البحث أو التخصص المحدد.' : 'No specialists match your search criteria or selected specialty.'}
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="px-5 py-2 rounded-xl bg-[#0B3B36] text-white text-xs font-bold cursor-pointer hover:bg-[#124d47] transition-all"
          >
            {isArabic ? 'إعادة تعيين الفلاتر' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        /* 4. Single Unified Slider Track (جميع الأخصائيين في سلايدر واحد) */
        <div className="bg-slate-50/60 dark:bg-slate-900/40 rounded-2xl sm:rounded-3xl p-2 sm:p-5 border border-slate-200/70 dark:border-white/5 shadow-2xs">
          <div
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`flex items-start gap-2.5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1.5 sm:py-2 px-1 ${
              isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
            }`}
            style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x pan-y' }}
          >
            {filteredDoctors.map((doc, idx) => renderDoctorCard(doc, idx))}
          </div>
        </div>
      )}

      {/* 5. View More Specialists Page Hook Banner */}
      {onOpenSpecialistsPage && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xs">
          <div className="flex items-center gap-3 text-right">
            <div className="w-11 h-11 rounded-2xl bg-[#dff1ec] dark:bg-teal-950/60 text-[#0d5c52] dark:text-[#2dd4bf] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {isArabic ? 'هل ترغب في تصفح جميع الكفاءات الطبية بقائمة مفصلة؟' : 'Want to browse all specialists in a full list view?'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isArabic ? 'تصفح صفحة الأخصائيين المخصصة مع فلاتر شاملة للسنوات والتخصصات وحجز المواعيد مباشرة.' : 'Visit our dedicated directory page with specialty filtering and direct booking.'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSpecialistsPage}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-[#0d5c52] hover:bg-[#093e37] text-white font-black rounded-2xl text-xs sm:text-sm shadow-md transition-all cursor-pointer group"
          >
            <span>{isArabic ? 'عرض المزيد من الأخصائيين' : 'View More Specialists'}</span>
            {isArabic ? <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>
      )}

    </div>
  );
};

export default DoctorCardSlider;
