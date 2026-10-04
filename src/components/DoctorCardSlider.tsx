import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, 
  Heart, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Check,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { 
  getStoredSpecialistSettings, 
  SpecialistImageSetting,
  GlobalCardSettings,
  getStoredGlobalCardSettings,
  findCustomSettingForDoctor
} from '../data/specialistCustomizer';
import { getResolvedImageUrl, handleImageErrorWithStore } from '../utils/persistentImageStore';
import { isSameSpecialist, deduplicateDoctors } from '../utils/specialistDeduplication';

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
  department: string;
  avatar: string;
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
    "id": "doc-haneen-obaidi",
    "name": "حنين العبيدي",
    "arabicName": "حنين العبيدي",
    "nameEn": "Haneen Al-Obaidi",
    "title": "رئيس قسم العلاج الوظيفي",
    "titleEn": "Head of Occupational Therapy Department",
    "specialty": "رئيس قسم العلاج الوظيفي والتكامل الحسي",
    "specialtyEn": "Head of Occupational Therapy Department",
    "specialtyCode": "رئيس قسم العلاج الوظيفي",
    "specialtyCodeEn": "Head of Occupational Therapy Department",
    "category": "aba",
    "department": "رئيس قسم العلاج الوظيفي والتكامل الحسي",
    "avatar": "/specialists/cards/spec_01_haneen-obaidi.jpg",
    "fallbackAvatar": "/specialists/cards/spec_01_haneen-obaidi.jpg",
    "rating": 4.95,
    "reviewCount": 240,
    "experienceYears": 16,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "بكالوريوس العلاج الوظيفي الجامعة الهاشمية",
      "شهادة ايرس العالمية في التكامل الحسي (Ayres SI)",
      "شهادة Floortime 101",
      "مرخصة في اختبار EASI للتكامل الحسي",
      "تقييم وعلاج المشاكل الحسية والتحديات النمائية لدى الأطفال",
      "خبرة أكثر من 16 سنة في تأهيل الأطفال"
    ],
    "bio": "رئيس قسم العلاج الوظيفي بمركز رابا. حاصلة على بكالوريوس العلاج الوظيفي من الجامعة الهاشمية، شهادة ايرس العالمية في التكامل الحسي، شهادة Floortime 101، ومرخصة في اختبار EASI للتكامل الحسي. متخصصة في تقييم وعلاج المشاكل الحسية والتحديات النمائية لدى الأطفال بخبرة عريقة تتجاوز 16 عاماً."
  },
  {
    "id": "doc-rahaf-doghmani",
    "name": "رهف الدغماني",
    "arabicName": "رهف الدغماني",
    "nameEn": "Rahaf Al-Doghmani",
    "title": "إشراف قسم الـ ABA",
    "titleEn": "Supervisor of ABA Department",
    "specialty": "مشرفة قسم تحليل السلوك التطبيقي ABA",
    "specialtyEn": "Supervisor of ABA Department & QABA Analyst",
    "specialtyCode": "إشراف قسم الـ ABA",
    "specialtyCodeEn": "Supervisor of ABA Department",
    "category": "aba",
    "department": "مشرفة قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/specialists/cards/spec_02_rahaf-doghmani.jpg",
    "fallbackAvatar": "/specialists/cards/spec_02_rahaf-doghmani.jpg",
    "rating": 4.9,
    "reviewCount": 175,
    "experienceYears": 5,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "بكالوريوس التربية الخاصة جامعة القصيم",
      "ماجستير في الإضطرابات السلوكية والانفعالية من جامعة الملك سعود",
      "محلل سلوك معتمد من منظمة QABA",
      "خبرة أكثر من 5 سنوات في البرامج السلوكية"
    ],
    "bio": "مشرفة قسم تحليل السلوك التطبيقي (ABA) بمركز رابا. حاصلة على بكالوريوس التربية الخاصة من جامعة القصيم، وماجستير في الإضطرابات السلوكية والانفعالية من جامعة الملك سعود، ومحلل سلوك معتمد من منظمة QABA بخبرة تفوق 5 سنوات في قيادة وتصميم الخطط السلوكية الفردية للأطفال."
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
    "department": "مشرفة قسم تحليل السلوك التطبيقي ومحلل سلوكي معتمد",
    "avatar": "/specialists/cards/spec_03_doha-khaled.jpg",
    "fallbackAvatar": "/specialists/cards/spec_03_doha-khaled.jpg",
    "rating": 4.9,
    "reviewCount": 195,
    "experienceYears": 9,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "بكالوريوس تربية خاصة من الجامعة العربية",
      "مشرف اخصائي توحد معتمد من البورد الامريكي من منظمة QABA",
      "حاصلة على محلل سلوكي معتمد من منظمة IBAO",
      "خبرة أكثر من 9 سنوات في رعاية وتأهيل التوحد"
    ],
    "bio": "مشرفة قسم ABA بمركز رابا، حاصلة على بكالوريوس تربية خاصة من الجامعة العربية، ومشرف أخصائي توحد معتمد من البورد الأمريكي من منظمة QABA، ومحلل سلوكي معتمد من منظمة IBAO بخبرة تزيد عن 9 سنوات في الإشراف الإكلينيكي وتأهيل مهارات أطفال طيف التوحد."
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
    "category": "aba",
    "department": "مشرفة قسم النطق والتخاطب والتأهيل اللغوي",
    "avatar": "/specialists/cards/spec_04_manar-wahba.jpg",
    "fallbackAvatar": "/specialists/cards/spec_04_manar-wahba.jpg",
    "rating": 4.88,
    "reviewCount": 182,
    "experienceYears": 10,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": false,
    "tags": [
      "بكالوريوس خدمة اجتماعية جامعة القاهرة",
      "دبلومة تخاطب جامعة عين شمس",
      "دبلومة تربية خاصة علوم إعاقة جامعة الزقازيق",
      "متخصصة opt ومشاكل نطق وسمع",
      "شهادة opt من منظمة ASHA الأمريكية",
      "خبرة أكثر من 10 سنوات في علاج النطق واللغة"
    ],
    "bio": "مشرفة قسم النطق والتخاطب بمركز رابا. حاصلة على بكالوريوس خدمة اجتماعية من جامعة القاهرة، دبلومة تخاطب من جامعة عين شمس، دبلومة تربية خاصة علوم إعاقة من جامعة الزقازيق، ومتخصصة في العلاج الوظيفي الفموي opt ومشاكل النطق والسمع وحاصلة على شهادة opt من منظمة ASHA الأمريكية بخبرة تتجاوز 10 سنوات."
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
    "department": "أخصائي تحليل السلوك التطبيقي المعتمد ABAT",
    "avatar": "/specialists/cards/spec_05_ahmed-fathi.jpg",
    "fallbackAvatar": "/specialists/cards/spec_05_ahmed-fathi.jpg",
    "rating": 4.85,
    "reviewCount": 168,
    "experienceYears": 8,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": false,
    "tags": [
      "بكالوريوس تربية خاصة جامعة حلوان",
      "دبلوم مهني اضطرابات تواصل وتخاطب جامعة عين شمس",
      "اعتماد البورد الامريكي في تحليل السلوك التطبيقي ABAT",
      "خبرة أكثر من 8 سنوات في البرامج السلوكية"
    ],
    "bio": "أخصائي تحليل السلوك التطبيقي (ABA) بمركز رابا. حاصل على بكالوريوس تربية خاصة من جامعة حلوان، ودبلوم مهني في اضطرابات التواصل والتخاطب من جامعة عين شمس، ومعتمد من البورد الأمريكي في تحليل السلوك التطبيقي ABAT بخبرة سريرية وميدانية تزيد عن 8 سنوات."
  },
  {
    "id": "doc-mohamed-atef",
    "name": "محمد عاطف",
    "arabicName": "محمد عاطف",
    "nameEn": "Mohamed Atef",
    "title": "أخصائي ABA",
    "titleEn": "ABA Specialist",
    "specialty": "أخصائي تحليل السلوك التطبيقي ومشرف توحد مؤهل QASP-S",
    "specialtyEn": "ABA Specialist & Qualified Autism Services Supervisor (QASP-S)",
    "specialtyCode": "أخصائي ABA",
    "specialtyCodeEn": "ABA Specialist",
    "category": "aba",
    "department": "أخصائي تحليل السلوك التطبيقي ومشرف توحد مؤهل QASP-S",
    "avatar": "/specialists/cards/spec_06_mohamed-atef.jpg",
    "fallbackAvatar": "/specialists/cards/spec_06_mohamed-atef.jpg",
    "rating": 4.88,
    "reviewCount": 154,
    "experienceYears": 5,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": false,
    "tags": [
      "بكالوريوس علوم الاعاقة والتأهيل جامعة الزقازيق",
      "دبلوم خاص من جامعة الزقازيق",
      "مشرف توحد مؤهل من منظمة QASP-S",
      "متخصص في الإعاقة العقلية",
      "خبرة أكثر من 5 سنوات في تأهيل التوحد والإعاقات النمائية"
    ],
    "bio": "أخصائي تحليل السلوك التطبيقي (ABA) بمركز رابا. حاصل على بكالوريوس علوم الإعاقة والتأهيل من جامعة الزقازيق، ودبلوم خاص من جامعة الزقازيق، ومشرف توحد مؤهل من منظمة QASP-S الأمريكية، ومتخصص في تأهيل الإعاقة العقلية واضطرابات طيف التوحد بخبرة تزيد عن 5 سنوات."
  },
  {
    "id": "doc-sadeem-mshari",
    "name": "سديم احمد المشاري",
    "arabicName": "سديم احمد المشاري",
    "nameEn": "Sadeem Ahmed Al-Mashari",
    "title": "أخصائي ABA",
    "titleEn": "ABA Specialist",
    "specialty": "أخصائي تحليل السلوك ومصنفة من الهيئة السعودية للتخصصات الصحية",
    "specialtyEn": "ABA Specialist & SCFHS Licensed Psychologist",
    "specialtyCode": "أخصائي ABA",
    "specialtyCodeEn": "ABA Specialist",
    "category": "aba",
    "department": "أخصائي تحليل السلوك ومصنفة من الهيئة السعودية للتخصصات الصحية",
    "avatar": "/specialists/cards/spec_07_sadeem-mshari.jpg",
    "fallbackAvatar": "/specialists/cards/spec_07_sadeem-mshari.jpg",
    "rating": 4.9,
    "reviewCount": 142,
    "experienceYears": 4,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "بكالوريوس علم النفس من جامعة الاميرة نورة",
      "دبلوم المقاييس النفسية من أكاديمية النخبة الدولية",
      "مصنفة من الهيئة السعودية للتخصصات الصحية",
      "حاصلة على رخصة ABAT من البورد الامريكي"
    ],
    "bio": "أخصائي تحليل السلوك التطبيقي (ABA) بمركز رابا. حاصلة على بكالوريوس علم النفس من جامعة الأميرة نورة، ودبلوم المقاييس النفسية من أكاديمية النخبة الدولية، ومصنفة من الهيئة السعودية للتخصصات الصحية، وحاصلة على رخصة ABAT من البورد الأمريكي. متخصصة في القياس والتقييم السلوكي والتأهيل النفسي للأطفال."
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
    "department": "أخصائية تحليل السلوك التطبيقي وعلم النفس الإكلينيكي",
    "avatar": "/specialists/cards/spec_08_maram-mohamed.jpg",
    "fallbackAvatar": "/specialists/cards/spec_08_maram-mohamed.jpg",
    "rating": 4.85,
    "reviewCount": 130,
    "experienceYears": 3,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": false,
    "tags": [
      "بكالوريوس علم النفس الإكلينيكي جامعة الرباط الوطني",
      "اعتماد البورد الأمريكي ABAT",
      "متخصصة في العلاج عن طريق تحليل السلوك التطبيقي (ABA)",
      "خبرة أكثر من 3 سنوات في الجلسات السلوكية"
    ],
    "bio": "أخصائية تحليل السلوك التطبيقي (ABA) بمركز رابا. حاصلة على بكالوريوس علم النفس الإكلينيكي من جامعة الرباط الوطني، وحاصلة على اعتماد البورد الأمريكي ABAT من منظمة QABA، متخصصة في العلاج والتأهيل عن طريق تحليل السلوك التطبيقي (ABA) للأطفال بخبرة تتجاوز 3 سنوات."
  },
  {
    "id": "doc-ahmed-raad",
    "name": "أحمد رعد",
    "arabicName": "أحمد رعد",
    "nameEn": "Ahmed Raad",
    "title": "أخصائي ABA",
    "titleEn": "ABA Specialist",
    "specialty": "أخصائي تحليل السلوك التطبيقي ABAT والعلوم الصحية",
    "specialtyEn": "ABA Specialist & Health Sciences Graduate",
    "specialtyCode": "أخصائي ABA",
    "specialtyCodeEn": "ABA Specialist",
    "category": "aba",
    "department": "أخصائي تحليل السلوك التطبيقي ABAT والعلوم الصحية",
    "avatar": "/specialists/cards/spec_09_ahmed-raad.jpg",
    "fallbackAvatar": "/specialists/cards/spec_09_ahmed-raad.jpg",
    "rating": 4.82,
    "reviewCount": 125,
    "experienceYears": 3,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": false,
    "tags": [
      "بكالوريوس علوم صحية من جامعة حمص",
      "شهادة أخصائي تحليل السلوك ABAT من البورد الأمريكي",
      "خبرة أكثر من 3 سنوات في الجلسات الفردية وتعديل السلوك"
    ],
    "bio": "أخصائي تحليل السلوك التطبيقي (ABA) بمركز رابا. حاصل على بكالوريوس علوم صحية من جامعة حمص، وحاصل على شهادة أخصائي تحليل السلوك ABAT من البورد الأمريكي، بخبرة أكثر من 3 سنوات في تقديم جلسات التدخل السلوكي الفردية للأطفال وتطوير مهارات الاستقلالية والتواصل."
  },
  {
    "id": "doc-1",
    "name": "احمد أبو زيد أنور",
    "arabicName": "احمد أبو زيد أنور",
    "nameEn": "Ahmed Abouzeid Anwar",
    "title": "المدير العام للبرامج التأهيلية | رئيس قسم ABA",
    "titleEn": "General Director of Rehabilitation | Head of ABA",
    "specialty": "المدير العام للبرامج التأهيلية ورئيس قسم تحليل السلوك",
    "specialtyEn": "General Director of Programs & Head of ABA",
    "specialtyCode": "المدير العام للبرامج التأهيلية | رئيس قسم ABA",
    "specialtyCodeEn": "General Director of Rehabilitation | Head of ABA",
    "category": "aba",
    "department": "المدير العام للبرامج التأهيلية ورئيس قسم تحليل السلوك",
    "avatar": "/specialists/cards/spec_10_1.png",
    "fallbackAvatar": "/specialists/cards/spec_10_1.png",
    "rating": 4.95,
    "reviewCount": 220,
    "experienceYears": 12,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "MA, QBA, IBA",
      "خبرة 12 سنة ومقدم CEUs للبورد QABA",
      "خطط التدخل السلوكي المكثفة",
      "تعديل السلوك وتدريب الكوادر والأسر"
    ],
    "bio": "المدير العام للبرامج التأهيلية ورئيس قسم ABA بمركز رابا. حاصل على MA، QBA، IBA بخبرة 12 سنة، ومقدم وحدات التعليم المستمر CEUs للبورد الدولي QABA."
  },
  {
    "id": "doc-mohamed-saad",
    "name": "محمد سعد",
    "arabicName": "محمد سعد",
    "nameEn": "Mohamed Saad",
    "title": "أخصائي النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "specialty": "أخصائي تأهيل النطق والتخاطب وتنمية المهارات اللغوية",
    "specialtyEn": "Speech & Language Pathologist & Early Intervention Lead",
    "specialtyCode": "أخصائي النطق والتخاطب",
    "specialtyCodeEn": "Speech & Language Pathologist",
    "category": "aba",
    "department": "أخصائي تأهيل النطق والتخاطب وتنمية المهارات اللغوية",
    "avatar": "/specialists/cards/spec_11_mohamed-saad.png",
    "fallbackAvatar": "/specialists/cards/spec_11_mohamed-saad.png",
    "rating": 4.93,
    "reviewCount": 195,
    "experienceYears": 8,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصل على ليسانس الآداب وتربية لغة عربية من جامعة طنطا",
      "حاصل على دبلومة التخاطب واضطرابات النطق والكلام من كلية علوم ذوي الاحتياجات الخاصة جامعة بني سويف",
      "حاصل على تمهيدي ماجستير في علوم التخاطب واضطرابات النطق والكلام",
      "خبرة عملية أكثر من ٨ سنوات في تقييم وتشخيص اضطرابات النطق والكلام"
    ],
    "bio": "أخصائي النطق والتخاطب بمركز رابا. حاصل على ليسانس وماجستير في علوم التخاطب واضطرابات التواصل، بخبرة عملية تزيد عن 8 سنوات في تقييم وتشخيص اضطرابات النطق وتأخر نمو اللغة والتدخل المبكر لأطفال طيف التوحد ومتلازمة داون."
  },
  {
    "id": "doc-alzahraa-farag",
    "name": "الزهراء فرج",
    "arabicName": "الزهراء فرج",
    "nameEn": "Al-Zahraa Farag",
    "title": "أخصائية نفسية إكلينيكية",
    "titleEn": "Clinical Psychologist",
    "specialty": "أخصائية علم النفس الإكلينيكي وتعديل السلوك",
    "specialtyEn": "Clinical Child Psychologist & Behavioral Assessment Specialist",
    "specialtyCode": "أخصائية نفسية إكلينيكية",
    "specialtyCodeEn": "Clinical Psychologist",
    "category": "aba",
    "department": "أخصائية علم النفس الإكلينيكي وتعديل السلوك",
    "avatar": "/specialists/cards/spec_12_alzahraa-farag.png",
    "fallbackAvatar": "/specialists/cards/spec_12_alzahraa-farag.png",
    "rating": 4.91,
    "reviewCount": 182,
    "experienceYears": 7,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصلة على ليسانس الآداب قسم علم النفس من جامعة عين شمس",
      "حاصلة على دبلومة علم النفس الإكلينيكي من كلية الآداب جامعة عين شمس",
      "حاصلة على دبلومة التربية الخاصة من كلية التربية جامعة عين شمس",
      "خبرة أكثر من ٧ سنوات في التقييم النفسي والتشخيص الإكلينيكي"
    ],
    "bio": "أخصائية نفسية إكلينيكية بمركز رابا. حاصلة على ماجستير علم النفس الإكلينيكي ودبلوم العلاج المعرفي السلوكي، بخبرة تتجاوز 7 سنوات في تقييم وتشخيص الاضطرابات النمائية والنفسية وتطبيق مقاييس الذكاء واختبارات الشخصية والسلوك التكيفي."
  },
  {
    "id": "doc-noura-elbasyouni",
    "name": "د/ نورا البسيوني",
    "arabicName": "د/ نورا البسيوني",
    "nameEn": "Dr. Noura El-Basyouni",
    "title": "أخصائية نفسية",
    "titleEn": "Ph.D. Pediatric Psychologist",
    "specialty": "دكتوراه في علم النفس وأخصائية نفسية أطفال التوحد",
    "specialtyEn": "Ph.D. in Clinical Child Psychology & Autism Specialist",
    "specialtyCode": "أخصائية نفسية",
    "specialtyCodeEn": "Ph.D. Pediatric Psychologist",
    "category": "aba",
    "department": "دكتوراه في علم النفس وأخصائية نفسية أطفال التوحد",
    "avatar": "/specialists/cards/spec_13_noura-elbasyouni.png",
    "fallbackAvatar": "/specialists/cards/spec_13_noura-elbasyouni.png",
    "rating": 4.95,
    "reviewCount": 215,
    "experienceYears": 10,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصلة على ليسانس الآداب قسم علم النفس من جامعة عين شمس",
      "حاصلة على ماجستير في علم النفس تخصص أطفال التوحد",
      "حاصلة على دكتوراه في علم النفس تخصص أطفال التوحد",
      "مصنفة مهنياً من الهيئة السعودية للتخصصات الصحية",
      "خبرة أكثر من ١٠ سنوات في القياس والتشخيص النفسي"
    ],
    "bio": "دكتوراه في علم النفس وأخصائية نفسية بمركز رابا. حاصلة على درجتي الماجستير والدكتوراه في علم النفس تخصص أطفال التوحد، ومصنفة مهنياً من الهيئة السعودية للتخصصات الصحية بخبرة تزيد عن 10 سنوات في التقييم النفسي والبرامج النمائية لأطفال التوحد."
  },
  {
    "id": "doc-asmaa-moustafa",
    "name": "أسماء مصطفى",
    "arabicName": "أسماء مصطفى",
    "nameEn": "Asmaa Moustafa",
    "title": "مشرفة قسم الـ ABA",
    "titleEn": "ABA Department Supervisor",
    "specialty": "مشرفة قسم تحليل السلوك ومحلل سلوك دولي معتمد QBA-IBA",
    "specialtyEn": "ABA Supervisor & International Behavior Analyst (QBA / IBA)",
    "specialtyCode": "مشرفة قسم الـ ABA",
    "specialtyCodeEn": "ABA Department Supervisor",
    "category": "aba",
    "department": "مشرفة قسم تحليل السلوك ومحلل سلوك دولي معتمد QBA-IBA",
    "avatar": "/specialists/cards/spec_14_asmaa-moustafa.png",
    "fallbackAvatar": "/specialists/cards/spec_14_asmaa-moustafa.png",
    "rating": 4.96,
    "reviewCount": 230,
    "experienceYears": 10,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصلة على ليسانس الآداب في علم الإجتماع من جامعة سوهاج",
      "حاصلة على ماجستير في التربية الخاصة تخصص التوحد من جامعة أسيوط",
      "باحثة دكتوراة في التربية الخاصة تخصص توحد",
      "محلل سلوك دولي معتمد QBA-IBA",
      "ممارس إدارة السلوك التنظيمي OBM-p",
      "خبرة عملية أكثر من ١٠ سنوات"
    ],
    "bio": "مشرفة قسم ABA بمركز رابا ومحلل سلوك دولي معتمد (QBA-IBA). باحثة دكتوراه وحاصلة على ماجستير التربية الخاصة تخصص التوحد، وممارس إدارة السلوك التنظيمي OBM-p بخبرة تزيد عن 10 سنوات في قيادة الخطط السلوكية المكثفة وتأهيل الكوادر."
  },
  {
    "id": "doc-ayman-elhoweity",
    "name": "أيمن عطية الحويطي",
    "arabicName": "أيمن عطية الحويطي",
    "nameEn": "Ayman Attia Al-Howeity",
    "title": "أخصائي ABA",
    "titleEn": "Behavior Analyst (BACB / TOT)",
    "specialty": "أخصائي تحليل السلوك ومدرب مدربين معتمد TOT",
    "specialtyEn": "ABA Specialist, BACB Licensed & Certified TOT",
    "specialtyCode": "أخصائي ABA",
    "specialtyCodeEn": "Behavior Analyst (BACB / TOT)",
    "category": "aba",
    "department": "أخصائي تحليل السلوك ومدرب مدربين معتمد TOT",
    "avatar": "/specialists/cards/spec_15_ayman-elhoweity.png",
    "fallbackAvatar": "/specialists/cards/spec_15_ayman-elhoweity.png",
    "rating": 4.88,
    "reviewCount": 170,
    "experienceYears": 10,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": false,
    "tags": [
      "حاصل على بكالوريوس التربية الخاصة من جامعة حلوان",
      "حاصل على دراسات عليا في التربية الخاصة من جامعة حلوان",
      "حاصل على رخصة البورد الأمريكي من بورد BACB",
      "ممارس توحد مرخص من هيئة قياس",
      "مدرب مدربين معتمد TOT",
      "خبرة عملية أكثر من ١٠ سنوات"
    ],
    "bio": "أخصائي تحليل السلوك التطبيقي ABA بمركز رابا. حاصل على دراسات عليا في التربية الخاصة من جامعة حلوان، ورخصة بورد BACB الأمريكي، وترخيص ممارس توحد من قياس ومدرب مدربين TOT بخبرة تتجاوز 10 سنوات في تأهيل ذوي اضطراب طيف التوحد."
  },
  {
    "id": "doc-mohamed-bakry",
    "name": "محمد بكري",
    "arabicName": "محمد بكري",
    "nameEn": "Mohamed Bakry",
    "title": "أخصائي العلاج الوظيفي والتكامل الحسي",
    "titleEn": "Occupational & Sensory Therapist",
    "specialty": "أخصائي العلاج الوظيفي والتكامل الحسي وماجستير علوم الصحة الرياضية",
    "specialtyEn": "Occupational Therapist & Sensory Integration Practitioner",
    "specialtyCode": "أخصائي العلاج الوظيفي والتكامل الحسي",
    "specialtyCodeEn": "Occupational & Sensory Therapist",
    "category": "aba",
    "department": "أخصائي العلاج الوظيفي والتكامل الحسي وماجستير علوم الصحة الرياضية",
    "avatar": "/specialists/cards/spec_16_mohamed-bakry.png",
    "fallbackAvatar": "/specialists/cards/spec_16_mohamed-bakry.png",
    "rating": 4.87,
    "reviewCount": 145,
    "experienceYears": 6,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": false,
    "tags": [
      "حاصل على بكالوريوس وماجستير علوم الصحة الرياضية وتأهيل الإصابات",
      "حاصل على دبلومة العلاج الوظيفي من مركز الخدمة العامة جامعة طنطا",
      "حاصل على تدريب معتمد في التكامل الحسي من مركز رابـا",
      "خبرة أكثر من ٦ سنوات في العلاج الوظيفي والتكامل الحسي"
    ],
    "bio": "أخصائي العلاج الوظيفي والتكامل الحسي بمركز رابا. حاصل على ماجستير علوم الصحة الرياضية ودبلومة العلاج الوظيفي وتدريب معتمد في التكامل الحسي بخبرة تفوق 6 سنوات في تنمية المهارات الحركية الدقيقة والتكامل الحسي والبدني للأطفال."
  },
  {
    "id": "doc-anwar-elmaghyouli",
    "name": "أنوار المغيولي",
    "arabicName": "أنوار المغيولي",
    "nameEn": "Anwar Al-Maghyouli",
    "title": "أخصائية النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "specialty": "أخصائية علاج اضطرابات النطق والتخاطب واللغة",
    "specialtyEn": "Speech-Language Pathologist & Communication Specialist",
    "specialtyCode": "أخصائية النطق والتخاطب",
    "specialtyCodeEn": "Speech & Language Pathologist",
    "category": "aba",
    "department": "أخصائية علاج اضطرابات النطق والتخاطب واللغة",
    "avatar": "/specialists/cards/spec_17_anwar-elmaghyouli.png",
    "fallbackAvatar": "/specialists/cards/spec_17_anwar-elmaghyouli.png",
    "rating": 4.89,
    "reviewCount": 138,
    "experienceYears": 5,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": false,
    "tags": [
      "حاصلة على بكالوريوس علم النفس من جامعة الملك عبدالعزيز",
      "حاصلة على دورة علاج التلعثم التخصصية",
      "حاصلة على دورة مهارات الحوار والتواصل التفاعلي",
      "خبرة أكثر من ٥ سنوات في تقييم وعلاج اضطرابات النطق واللغة"
    ],
    "bio": "أخصائية النطق والتخاطب بمركز رابا. حاصلة على بكالوريوس علم النفس من جامعة الملك عبدالعزيز، بخبرة عملية تفوق 5 سنوات في تقييم وعلاج التلعثم واضطرابات مخارج الحروف وتأخر الكلام وتطوير مهارات الحوار والتواصل لدى الأطفال."
  },
  {
    "id": "doc-mohamed-abdelhamid",
    "name": "محمد عبد الحميد",
    "arabicName": "محمد عبد الحميد",
    "nameEn": "Mohamed Abdelhamid",
    "title": "أخصائي النطق والتخاطب",
    "titleEn": "Speech Pathologist & OPT Specialist",
    "specialty": "أخصائي علاج النطق والتخاطب ومتخصص OPT",
    "specialtyEn": "Speech Pathologist & Oral Placement Therapy (OPT) Specialist",
    "specialtyCode": "أخصائي النطق والتخاطب",
    "specialtyCodeEn": "Speech Pathologist & OPT Specialist",
    "category": "aba",
    "department": "أخصائي علاج النطق والتخاطب ومتخصص OPT",
    "avatar": "/specialists/cards/spec_18_mohamed-abdelhamid.png",
    "fallbackAvatar": "/specialists/cards/spec_18_mohamed-abdelhamid.png",
    "rating": 4.86,
    "reviewCount": 152,
    "experienceYears": 6,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": false,
    "tags": [
      "حاصل على بكالوريوس التربية الخاصة قسم اضطرابات التخاطب من جامعة المنصورة",
      "حاصل على كورس معتمد في تقنية OPT لتأهيل عضلات النطق",
      "خبرة أكثر من ٦ سنوات في تأهيل عيوب النطق والكلام ومخارج الحروف"
    ],
    "bio": "أخصائي النطق والتخاطب بمركز رابا. حاصل على بكالوريوس التربية الخاصة من جامعة المنصورة، وكورس معتمد في تقنية OPT لتأهيل عضلات النطق، بخبرة عملية تزيد عن 6 سنوات في علاج صعوبات النطق واللغة والتواصل لدى الأطفال ذوي التحديات النمائية."
  },
  {
    "id": "doc-mohamed-elgayyar",
    "name": "محمد الجيار",
    "arabicName": "محمد الجيار",
    "nameEn": "Mohamed Al-Gayyar",
    "title": "أخصائي العلاج الوظيفي والتكامل الحسي",
    "titleEn": "Occupational Therapy & Sensory Integration Specialist",
    "specialty": "أخصائي العلاج الوظيفي والتكامل الحسي وتعديل السلوك ABAT",
    "specialtyEn": "Occupational Therapist & Certified Behavior Technician (ABAT)",
    "specialtyCode": "أخصائي العلاج الوظيفي والتكامل الحسي",
    "specialtyCodeEn": "Occupational Therapy & Sensory Integration Specialist",
    "category": "aba",
    "department": "أخصائي العلاج الوظيفي والتكامل الحسي وتعديل السلوك ABAT",
    "avatar": "/specialists/cards/spec_19_mohamed-elgayyar.png",
    "fallbackAvatar": "/specialists/cards/spec_19_mohamed-elgayyar.png",
    "rating": 4.88,
    "reviewCount": 160,
    "experienceYears": 7,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": false,
    "tags": [
      "حاصل كلية ليسانس الآداب من جامعة بورسعيد",
      "حاصل على دبلومة مهنية لإضطرابات التواصل من كلية التربية جامعة عين شمس",
      "حاصل علي دبلومة عامة قسم التوحد من كلية علوم إعاقة من جامعة الزقازيق",
      "حاصل على دورة تحليل السلوك التطبيقي ABAT",
      "حاصل على دورة في التكامل الحسي من د/دعاء عبد اللطيف",
      "خبرة عملية أكثر من ٧ سنوات"
    ],
    "bio": "أخصائي العلاج الوظيفي والتكامل الحسي بمركز رابا. يجمع بين دبلومات اضطرابات التواصل من عين شمس والتوحد من الزقازيق وتدريب ABAT والتكامل الحسي بخبرة تزيد عن 7 سنوات في تحسين التآزر البصري الحركي والتكامل الحسي للأطفال."
  },
  {
    "id": "doc-elsaeed-diab",
    "name": "السعيد دياب",
    "arabicName": "السعيد دياب",
    "nameEn": "El-Saeed Diab",
    "title": "أخصائي صعوبات تعلم",
    "titleEn": "Learning Disabilities Specialist",
    "specialty": "أخصائي صعوبات التعلم والتقييم والتشخيص النفسي والتربوي",
    "specialtyEn": "Learning Disabilities Specialist & Psycho-Educational Evaluator",
    "specialtyCode": "أخصائي صعوبات تعلم",
    "specialtyCodeEn": "Learning Disabilities Specialist",
    "category": "aba",
    "department": "أخصائي صعوبات التعلم والتقييم والتشخيص النفسي والتربوي",
    "avatar": "/specialists/cards/spec_20_elsaeed-diab.png",
    "fallbackAvatar": "/specialists/cards/spec_20_elsaeed-diab.png",
    "rating": 4.89,
    "reviewCount": 164,
    "experienceYears": 7,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": false,
    "tags": [
      "حاصل على ليسانس الآداب والتربية من جامعه الأزهر",
      "حاصل على دبلومة الإختبارات والمقاييس النفسية من جامعة الزقازيق",
      "حاصل على دبلومة التخاطب من جامعة عين شمس",
      "حاصل على دبلومة التوحد من جامعة الزقازيق",
      "حاصل على دبلومة إعداد أخصائي تربية خاصة من جامعة عين شمس",
      "حاصل على دبلومة التربية الخاصة من جامعة عين شمس",
      "خبرة عملية أكثر من ٧ سنوات"
    ],
    "bio": "أخصائي صعوبات التعلم بمركز رابا. حاصل على دبلومات متعددة في المقاييس النفسية والتخاطب والتوحد والتربية الخاصة من جامعتي عين شمس والزقازيق بخبرة تفوق 7 سنوات في التشخيص التربوي الدقيق وعلاج صعوبات القراءة والكتابة والحساب وتهيئة الأطفال للدمج."
  },
  {
    "id": "doc-sara-abdelhamid",
    "name": "يارا  أبو حمده",
    "arabicName": "يارا  أبو حمده",
    "nameEn": "Sara Abdelhamid",
    "title": "أخصائية العلاج الوظيفي",
    "titleEn": "Speech-Language Pathologist",
    "specialty": "أخصائية نطق وتخاطب",
    "specialtyEn": "Speech-Language Pathologist",
    "specialtyCode": "أخصائية العلاج الوظيفي",
    "specialtyCodeEn": "Speech-Language Pathologist",
    "category": "speech",
    "department": "قسم علاج النطق واللغة واضطرابات التواصل",
    "avatar": "/specialists/cards/spec_21_sara-abdelhamid.png",
    "fallbackAvatar": "/specialists/cards/spec_21_sara-abdelhamid.png",
    "rating": 4.9,
    "reviewCount": 135,
    "experienceYears": 2,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "تأخر الكلام واللغة",
      "برامج التواصل البديل PECS",
      "التلعثم والتأتأة",
      "تحفيز المهارات التعبيرية"
    ],
    "bio": "حاصلة علي بكالوريوس  العلاج الوظيفي من الجامعة الأردنية\nخبرة أكثر من سنة "
  },
  {
    "id": "doc-hanaa-basheer",
    "name": "هناء بشير",
    "arabicName": "هناء بشير",
    "nameEn": "Hanaa Basheer",
    "title": "أخصائية العلاج الوظيفي والتأهيل العصبي الحسي",
    "titleEn": "Occupational Therapist & Sensory Specialist",
    "specialty": "أخصائية علاج وظيفي",
    "specialtyEn": "Occupational Therapist",
    "specialtyCode": "أخصائية العلاج الوظيفي والتأهيل العصبي الحسي",
    "specialtyCodeEn": "Occupational Therapist & Sensory Specialist",
    "category": "occupational",
    "department": "قسم العلاج الوظيفي والتكامل الحسي",
    "avatar": "/specialists/cards/spec_22_hanaa-basheer.png",
    "fallbackAvatar": "/specialists/cards/spec_22_hanaa-basheer.png",
    "rating": 4.95,
    "reviewCount": 178,
    "experienceYears": 9,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "التكامل الحسي Ayres SI",
      "التخطيط الحركي الدقيق",
      "تعديل البيئة الحسية",
      "التنسيق العضلي العصبي"
    ],
    "bio": "أخصائية علاج وظيفي متميزة بخبرة 9 سنوات في تقييم وعلاج صعوبات المعالجة الحسية وفرط التحسس وتنمية التآزر البصري الحركي ومهارات الكتابة اليدوية والرعاية الذاتية للأطفال."
  },
  {
    "id": "doc-bayan-alnajem",
    "name": "بيان الناجم",
    "arabicName": "بيان الناجم",
    "nameEn": "Bayan Al-Najem",
    "title": "أخصائية تربية خاصة",
    "titleEn": "Special Education Specialist",
    "specialty": "أخصائية تربية خاصة وتأهيل عوق سمعي",
    "specialtyEn": "Special Education & Hearing Impairment Specialist",
    "specialtyCode": "أخصائية تربية خاصة",
    "specialtyCodeEn": "Special Education Specialist",
    "category": "aba",
    "department": "قسم التربية الخاصة والتأهيل",
    "avatar": "/specialists/cards/spec_23_bayan-alnajem.png",
    "fallbackAvatar": "/specialists/cards/spec_23_bayan-alnajem.png",
    "rating": 4.9,
    "reviewCount": 95,
    "experienceYears": 2,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصلة على بكالوريوس التربية الخاصة من جامعة الملك فيصل تخصص عوق سمعي",
      "حاصلة على دبلوم إرشاد اسري من جامعة الإمام محمد بن سعود",
      "تأهيل الأطفال ذوي الإعاقة السمعية وتطوير التواصل اللفظي والبديل",
      "خبرة عملية أكثر من سنة"
    ],
    "bio": "أخصائية تربية خاصة بمركز رابا. حاصلة على بكالوريوس التربية الخاصة من جامعة الملك فيصل تخصص عوق سمعي، ودبلوم إرشاد أسري من جامعة الإمام محمد بن سعود، بخبرة عملية متقدمة في تأهيل الأطفال ودعم الأسر وتنمية التواصل."
  },
  {
    "id": "doc-manar-obeid",
    "name": "منار عبيد",
    "arabicName": "منار عبيد",
    "nameEn": "Manar Obeid",
    "title": "مشرفة قسم الـ ABA",
    "titleEn": "ABA Department Supervisor",
    "specialty": "مشرفة قسم تحليل السلوك التطبيقي ABA | محلل سلوك معتمد QABA / IBAO",
    "specialtyEn": "ABA Department Supervisor & Certified Behavior Analyst (QABA/IBAO)",
    "specialtyCode": "مشرفة قسم الـ ABA",
    "specialtyCodeEn": "ABA Department Supervisor",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/specialists/cards/spec_24_manar-obeid.png",
    "fallbackAvatar": "/specialists/cards/spec_24_manar-obeid.png",
    "rating": 4.98,
    "reviewCount": 310,
    "experienceYears": 17,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصلة على ليسانس الآداب والتربية من جامعة المنوفية",
      "حاصلة على دبلوم مهني في القياس النفسي من جامعة المنوفية",
      "حاصلة على الدبلوم الخاص في القياس النفسي من جامعة المنوفية",
      "حاصلة على ماجستير في التربية الخاصة من جامعة القاهرة",
      "باحثة دكتوراه في التربية الخاصة في جامعة القاهرة",
      "محلل سلوك معتمد من البورد الأمريكي من منظمات QABA / IBAO",
      "خبرة عملية أكثر من ١٧ سنة"
    ],
    "bio": "مشرفة قسم تحليل السلوك التطبيقي ABA بمركز رابا ومحلل سلوك معتمد دولياً من البورد الأمريكي QABA ومنظمة IBAO. باحثة دكتوراه وحاصلة على الماجستير في التربية الخاصة من جامعة القاهرة، بخبرة عملية وتدريبية تتجاوز 17 عاماً في الإشراف الإكلينيكي وتصميم الخطط السلوكية."
  },
  {
    "id": "doc-salma-abouelfadl",
    "name": "سلمى أبو الفضل",
    "arabicName": "سلمى أبو الفضل",
    "nameEn": "Salma Abo El-Fadl",
    "title": "أخصائية التكامل الحسي",
    "titleEn": "Sensory Integration Specialist",
    "specialty": "أخصائية التكامل الحسي والتخاطب والتربية الخاصة",
    "specialtyEn": "Sensory Integration & Communication Specialist",
    "specialtyCode": "أخصائية التكامل الحسي",
    "specialtyCodeEn": "Sensory Integration Specialist",
    "category": "occupational",
    "department": "قسم العلاج الوظيفي والتكامل الحسي",
    "avatar": "/specialists/cards/spec_25_salma-abouelfadl.png",
    "fallbackAvatar": "/specialists/cards/spec_25_salma-abouelfadl.png",
    "rating": 4.95,
    "reviewCount": 165,
    "experienceYears": 7,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصلة على بكالوريوس تربية طفولة من جامعة المنوفية",
      "حاصلة على دبلوم خاص في التربية الخاصة من جامعة المنوفية",
      "حاصلة على دبلومة تخاطب 300 ساعة من جامعة عين شمس",
      "باحثة ماجستير في التربية الخاصة في جامعة المنوفية",
      "حاصلة على دورة في التكامل الحسي من جامعة عين شمس",
      "خبرة عملية أكثر من 7 سنوات"
    ],
    "bio": "أخصائية التكامل الحسي بمركز رابا. باحثة ماجستير في التربية الخاصة، حاصلة على دبلومة التخاطب ودورة التكامل الحسي من جامعة عين شمس، مع خبرة سريرية تتجاوز 7 سنوات في معالجة الاضطرابات الحسية والتواصلية وتنمية مهارات الأطفال النمائية."
  },
  {
    "id": "doc-ahmed-sayed",
    "name": "أحمد سيد",
    "arabicName": "أحمد سيد",
    "nameEn": "Ahmed Sayed",
    "title": "أخصائي النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "specialty": "أخصائي النطق والتخاطب والعلاج الفموي OPT",
    "specialtyEn": "Speech & Language Pathologist (OPT Certified)",
    "specialtyCode": "أخصائي النطق والتخاطب",
    "specialtyCodeEn": "Speech & Language Pathologist",
    "category": "speech",
    "department": "قسم النطق والتخاطب",
    "avatar": "/specialists/cards/spec_26_ahmed-sayed.png",
    "fallbackAvatar": "/specialists/cards/spec_26_ahmed-sayed.png",
    "rating": 4.93,
    "reviewCount": 140,
    "experienceYears": 6,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصل على بكالوريوس علوم لذوي الإحتياجات الخاصة بتخصص النطق والتخاطب من جامعة بني سويف",
      "حاصل على كورس العلاج الفموي OPT من الجمعية الأمريكية للنطق واللغة",
      "تأهيل التأتأة والتأخر اللغوي واضطرابات مخارج الحروف والبلع",
      "خبرة عملية أكثر من ٦ سنوات"
    ],
    "bio": "أخصائي النطق والتخاطب بمركز رابا. حاصل على بكالوريوس النطق والتخاطب من كلية علوم ذوي الاحتياجات الخاصة بجامعة بني سويف، ومعتمد في العلاج الفموي OPT، بخبرة عملية تتجاوز 6 سنوات في علاج عيوب النطق والتأخر اللغوي ومشاكل البلع والتنفس النطقي."
  },
  {
    "id": "doc-heshmah-mutairi",
    "name": "حشمة المطيري",
    "arabicName": "حشمة المطيري",
    "nameEn": "Heshmah Al-Mutairi",
    "title": "المدير الإداري لفرع الربوة",
    "titleEn": "Administrative Director - Al-Rabwah Branch",
    "specialty": "المدير الإداري لفرع الربوة | فني تحليل سلوك تطبيقي معتمد ABAT",
    "specialtyEn": "Administrative Director & Certified Applied Behavior Analyst (ABAT)",
    "specialtyCode": "المدير الإداري لفرع الربوة",
    "specialtyCodeEn": "Administrative Director - Al-Rabwah Branch",
    "category": "aba",
    "department": "إدارة الفروع وتطوير البرامج السلوكية",
    "avatar": "/specialists/cards/spec_27_heshmah-mutairi.png",
    "fallbackAvatar": "/specialists/cards/spec_27_heshmah-mutairi.png",
    "rating": 4.96,
    "reviewCount": 190,
    "experienceYears": 7,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصلة على بكالوريوس التربية الخاصة تخصص صعوبات التعلم من جامعة الملك فيصل",
      "فني تحليل سلوك تطبيقي معتمد ABAT من البورد الدولي QABA",
      "الإدارة الإكلينيكية وضمان جودة برامج التدخل المبكر وتوجيه الكادر التأهيلي",
      "خبرة عملية أكثر من ٧ سنوات"
    ],
    "bio": "المدير الإداري لفرع الربوة بمركز رابا. تجمع بين الكفاءة القيادية الإدارية والتخصص الإكلينيكي في صعوبات التعلم وتحليل السلوك التطبيقي (ABAT معتمد)، بخبرة تمتد لأكثر من 7 سنوات في إدارة مراكز التأهيل وتطوير الخطط العلاجية."
  },
  {
    "id": "doc-aseel-yousef",
    "name": "أسيل يوسف",
    "arabicName": "أسيل يوسف",
    "nameEn": "Aseel Yousef",
    "title": "أخصائية العلاج الوظيفي",
    "titleEn": "Occupational Therapy Specialist",
    "specialty": "أخصائية العلاج الوظيفي والتأهيل الحركي الدقيق",
    "specialtyEn": "Occupational Therapy & Fine Motor Rehabilitation Specialist",
    "specialtyCode": "أخصائية العلاج الوظيفي",
    "specialtyCodeEn": "Occupational Therapy Specialist",
    "category": "occupational",
    "department": "قسم العلاج الوظيفي والتكامل الحسي",
    "avatar": "/specialists/cards/spec_28_aseel-yousef.png",
    "fallbackAvatar": "/specialists/cards/spec_28_aseel-yousef.png",
    "rating": 4.91,
    "reviewCount": 110,
    "experienceYears": 3,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصلة على بكالوريوس العلاج الوظيفي من كلية العلوم الطبية التطبيقية من الجامعة الهاشمية",
      "تأهيل المهارات الحركية الدقيقة والتناسق العضلي البصري",
      "تنمية مهارات الاعتماد على الذات والأنشطة الحياتية اليومية",
      "خبرة عملية أكثر من سنتين"
    ],
    "bio": "أخصائية العلاج الوظيفي بمركز رابا، خريجة الجامعة الهاشمية في العلوم الطبية التطبيقية، متخصصة في تأهيل المهارات الحركية الدقيقة والتكامل الحسي واستقلالية الطفل في مهارات الحياة اليومية والمدرسية."
  },
  {
    "id": "doc-mohammed-shehri-clinical",
    "name": "محمد الشهري",
    "arabicName": "محمد الشهري",
    "nameEn": "Mohammed Al-Shehri",
    "title": "أخصائي نفسي إكلينيكي",
    "titleEn": "Clinical Psychologist",
    "specialty": "أخصائي نفسي إكلينيكي وتقييم سلوكي",
    "specialtyEn": "Clinical Psychologist & Behavioral Assessment Specialist",
    "specialtyCode": "أخصائي نفسي إكلينيكي",
    "specialtyCodeEn": "Clinical Psychologist",
    "category": "psychology",
    "department": "قسم الإرشاد والتقييم النفسي",
    "avatar": "/specialists/cards/spec_29_mohammed-shehri-clinical.png",
    "fallbackAvatar": "/specialists/cards/spec_29_mohammed-shehri-clinical.png",
    "rating": 4.92,
    "reviewCount": 115,
    "experienceYears": 3,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصل على بكالوريس علم النفس العام من جامعة الإمام محمد بن سعود الاسلامية",
      "التقييم الإكلينيكي والمقاييس النفسية النمائية",
      "برامج تعديل السلوك والإرشاد الأسري للأطفال",
      "خبرة أكثر من سنتين"
    ],
    "bio": "أخصائي نفسي إكلينيكي بمركز رابا. حاصل على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الإسلامية، متخصص في التقييم والتشخيص النفسي وتصميم برامج تعديل السلوك للأطفال وتقديم الدعم الإرشادي للأسر."
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
    "avatar": "/specialists/cards/spec_30_saad-dosari.png",
    "fallbackAvatar": "/specialists/cards/spec_30_saad-dosari.png",
    "rating": 4.9,
    "reviewCount": 88,
    "experienceYears": 2,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصل على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الاسلامية",
      "حاصل على رخصة الهيئة السعودية للتخصصات الصحية",
      "حاصل على رخصة ABAT من البورد الامريكي QABA",
      "خبرة عملية أكثر من سنة في التدخل السلوكي الفردي"
    ],
    "bio": "أخصائي تحليل سلوك تطبيقي ABA بمركز رابا. مرخص من هيئة التخصصات الصحية السعودية وحاصل على رخصة ABAT من البورد الأمريكي QABA، متخصص في بناء المهارات السلوكية والتواصلية للأطفال."
  },
  {
    "id": "doc-fahad-juhani",
    "name": "فهد الجهني",
    "arabicName": "فهد الجهني",
    "nameEn": "Fahad Al-Juhani",
    "title": "أخصائي ABA",
    "titleEn": "Applied Behavior Analysis Specialist",
    "specialty": "أخصائي تحليل السلوك التطبيقي ABA معتمد ABAT",
    "specialtyEn": "ABA Specialist & Certified ABAT Practitioner",
    "specialtyCode": "أخصائي ABA",
    "specialtyCodeEn": "Applied Behavior Analysis Specialist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/specialists/cards/spec_31_fahad-juhani.png",
    "fallbackAvatar": "/specialists/cards/spec_31_fahad-juhani.png",
    "rating": 4.92,
    "reviewCount": 105,
    "experienceYears": 3,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصل على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الاسلامية",
      "حاصل على إعتماد ABAT في تحليل السلوك التطبيقي من QABA",
      "تطوير التواصل الوظيفي والحد من السلوكيات النمطية",
      "خبرة عملية أكثر من سنتين"
    ],
    "bio": "أخصائي تحليل السلوك التطبيقي ABA بمركز رابا، معتمد دولياً من البورد الأمريكي QABA، خريج جامعة الإمام في علم النفس، بخبرة عملية تتجاوز سنتين في التدريب السلوكي والتواصل الوظيفي للأطفال."
  },
  {
    "id": "doc-hala-enazi",
    "name": "هلا العنزي",
    "arabicName": "هلا العنزي",
    "nameEn": "Hala Al-Enazi",
    "title": "أخصائية ABA",
    "titleEn": "Applied Behavior Analysis Specialist",
    "specialty": "أخصائية تحليل السلوك التطبيقي ABA | تصنيف هيئة التخصصات الصحية",
    "specialtyEn": "ABA Specialist & SCFHS Classified Psychologist",
    "specialtyCode": "أخصائية ABA",
    "specialtyCodeEn": "Applied Behavior Analysis Specialist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/specialists/cards/spec_32_hala-enazi.png",
    "fallbackAvatar": "/specialists/cards/spec_32_hala-enazi.png",
    "rating": 4.91,
    "reviewCount": 92,
    "experienceYears": 2,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصلة على بكالوريوس علم النفس من جامعة الأميرة نورة بنت عبدالرحمن",
      "حاصلة على تصنيف مهني من الهيئة السعودية للتخصصات الصحية",
      "حاصلة على اعتماد ABAT في تحليل السلوك التطبيقي من QABA",
      "متخصصة في تطبيق مبادئ تحليل السلوك التطبيقي (ABA) مع الأطفال",
      "خبرة عملية أكثر من سنة"
    ],
    "bio": "أخصائية تحليل سلوك تطبيقي ABA بمركز رابا ومصنفة مهنياً من هيئة التخصصات الصحية. خريجة جامعة الأميرة نورة ومعتمدة من البورد الأمريكي QABA، متخصصة في الجلسات السلوكية الفردية وتنمية مهارات التواصل والتفاعل الاجتماعي."
  },
  {
    "id": "doc-taif-subaie",
    "name": "طيف السبيعي",
    "arabicName": "طيف السبيعي",
    "nameEn": "Taif Al-Subaie",
    "title": "أخصائية ABA",
    "titleEn": "Applied Behavior Analysis Specialist",
    "specialty": "أخصائية تحليل السلوك التطبيقي ABA | أخصائي نفسي مرخص",
    "specialtyEn": "ABA Specialist & Licensed Psychologist",
    "specialtyCode": "أخصائية ABA",
    "specialtyCodeEn": "Applied Behavior Analysis Specialist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/specialists/cards/spec_33_taif-subaie.png",
    "fallbackAvatar": "/specialists/cards/spec_33_taif-subaie.png",
    "rating": 4.93,
    "reviewCount": 110,
    "experienceYears": 3,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصلة على بكالوريوس علم النفس من جامعة الطائف",
      "حاصلة على اعتماد ABAT في تحليل السلوك التطبيقي من QABA",
      "حاصلة على ترخيص هيئة التخصصات الصحية بمسمى اخصائي نفسي.",
      "خبرة عملية أكثر من سنتين"
    ],
    "bio": "أخصائية تحليل السلوك التطبيقي ABA بمركز رابا. مرخصة كأخصائية نفسية من هيئة التخصصات الصحية السعودية ومعتمدة كفني سلوك ABAT من البورد الأمريكي QABA، بخبرة سريرية متقدمة في رعاية وتأهيل الأطفال."
  },
  {
    "id": "doc-raghad-hawarneh",
    "name": "رغد حوارنه",
    "arabicName": "رغد حوارنه",
    "nameEn": "Raghad Hawarneh",
    "title": "أخصائية العلاج الوظيفي",
    "titleEn": "Occupational Therapy Specialist",
    "specialty": "أخصائية العلاج الوظيفي والتأهيل الطبي",
    "specialtyEn": "Occupational Therapy & Medical Rehabilitation Specialist",
    "specialtyCode": "أخصائية العلاج الوظيفي",
    "specialtyCodeEn": "Occupational Therapy Specialist",
    "category": "occupational",
    "department": "قسم العلاج الوظيفي والتكامل الحسي",
    "avatar": "/specialists/cards/spec_34_raghad-hawarneh.png",
    "fallbackAvatar": "/specialists/cards/spec_34_raghad-hawarneh.png",
    "rating": 4.9,
    "reviewCount": 85,
    "experienceYears": 2,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصلة على بكالوريوس علوم التأهيل الطبية من جامعة العلوم والتكنولوجيا الأردنية",
      "تأهيل التناسق الحركي والتكامل العصبي العضلي للأطفال",
      "تنمية الاستقلالية في البيئة المدرسية والمنزلية",
      "خبرة عملية أكثر من سنة"
    ],
    "bio": "أخصائية العلاج الوظيفي بمركز رابا، خريجة جامعة العلوم والتكنولوجيا الأردنية في علوم التأهيل الطبي، متخصصة في تأهيل المهارات الوظيفية الحركية وتنمية استقلالية الأطفال في المهام اليومية والبيئة التعليمية."
  },
  {
    "id": "doc-eman-bahattab",
    "name": "إيمان باحطاب",
    "arabicName": "إيمان باحطاب",
    "nameEn": "Eman Ba-Hattab",
    "title": "أخصائية ABA",
    "titleEn": "Applied Behavior Analysis Specialist",
    "specialty": "أخصائية تحليل السلوك التطبيقي ABA | فني سلوك معتمد QABA",
    "specialtyEn": "ABA Specialist & Certified Behavior Technician (QABA)",
    "specialtyCode": "أخصائية ABA",
    "specialtyCodeEn": "Applied Behavior Analysis Specialist",
    "category": "aba",
    "department": "قسم تحليل السلوك التطبيقي ABA",
    "avatar": "/specialists/cards/spec_35_eman-bahattab.png",
    "fallbackAvatar": "/specialists/cards/spec_35_eman-bahattab.png",
    "rating": 4.94,
    "reviewCount": 155,
    "experienceYears": 6,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصلة على بكالوريوس علم النفس من جامعة العلوم والتكنولوجيا",
      "حاصلة على شهادة فني تحليل سلوك تطبيقي ABA معتمد من البورد الأمريكي QABA",
      "تصميم وتنفيذ برامج التدخل المبكر وتعديل السلوك",
      "خبرة عملية أكثر من ٥ سنوات"
    ],
    "bio": "أخصائية تحليل السلوك التطبيقي ABA بمركز رابا. حاصلة على بكالوريوس علم النفس ومعتمدة من البورد الأمريكي QABA، وتمتلك خبرة عملية واسعة تتجاوز 5 سنوات في تطبيق برامج تعديل السلوك والتدخل المبكر المبني على القياس الدقيق."
  },
  {
    "id": "doc-omar-saad-speech",
    "name": "عمر سعد",
    "arabicName": "عمر سعد",
    "nameEn": "Omar Saad",
    "title": "أخصائي النطق والتخاطب",
    "titleEn": "Speech & Language Pathologist",
    "specialty": "أخصائي النطق والتخاطب | معتمد ABAT / QASP-S Candidate",
    "specialtyEn": "Speech Pathologist & Behavioral Specialist (ABAT / QASP-S Candidate)",
    "specialtyCode": "أخصائي النطق والتخاطب",
    "specialtyCodeEn": "Speech & Language Pathologist",
    "category": "speech",
    "department": "قسم النطق والتخاطب",
    "avatar": "/specialists/cards/spec_36_omar-saad-speech.png",
    "fallbackAvatar": "/specialists/cards/spec_36_omar-saad-speech.png",
    "rating": 4.95,
    "reviewCount": 160,
    "experienceYears": 6,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصل على بكالوريوس التربية الخاصة من جامعة العريش",
      "حاصل على إعتمادات من البورد الأمريكي ABAT / QASP-S Candidate",
      "تأهيل النطق واضطرابات الصوت والكلام والتواصل اللفظي",
      "خبرة عملية أكثر من ٥ سنوات"
    ],
    "bio": "أخصائي النطق والتخاطب بمركز رابا. يجمع بين التخصص الأكاديمي في التربية الخاصة والاعتمادات الدولية من البورد الأمريكي QABA (ABAT / QASP-S Candidate)، بخبرة تتجاوز 5 سنوات في علاج التأتأة والتأخر اللغوي واضطرابات الصوت والكلام."
  },
  {
    "id": "doc-aliah-mutairi",
    "name": "عاليه المطيري",
    "arabicName": "عاليه المطيري",
    "nameEn": "Aliah Al-Mutairi",
    "title": "أخصائية العلاج الوظيفي",
    "titleEn": "Occupational Therapy Specialist",
    "specialty": "أخصائية العلاج الوظيفي والتكامل الحسي",
    "specialtyEn": "Occupational Therapy & Sensory Rehabilitation Specialist",
    "specialtyCode": "أخصائية العلاج الوظيفي",
    "specialtyCodeEn": "Occupational Therapy Specialist",
    "category": "occupational",
    "department": "قسم العلاج الوظيفي والتكامل الحسي",
    "avatar": "/specialists/cards/spec_37_aliah-mutairi.png",
    "fallbackAvatar": "/specialists/cards/spec_37_aliah-mutairi.png",
    "rating": 4.92,
    "reviewCount": 118,
    "experienceYears": 3,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصله على بكالوريوس العلاج الوظيفي من جامعة الملك سعود",
      "تأهيل التكامل الحسي والتناسق العضلي الحركي",
      "تدريب المهارات التكيفية والاعتماد على الذات",
      "خبرة عملية أكثر من سنتين"
    ],
    "bio": "أخصائية العلاج الوظيفي بمركز رابا، خريجة جامعة الملك سعود المرموقة، متخصصة في تأهيل القدرات الحركية الدقيقة والتكامل الحسي وتعديل البيئة لدعم استقلالية الأطفال اليومية."
  },
  {
    "id": "doc-haya-faleh",
    "name": "هياء الفالح",
    "arabicName": "هياء الفالح",
    "nameEn": "Haya Al-Faleh",
    "title": "أخصائية نفسية | أخصائية ABA",
    "titleEn": "Psychologist & ABA Specialist",
    "specialty": "أخصائية نفسية وسلوكية معتمدة ABAT من QABA",
    "specialtyEn": "Psychologist & Certified Behavior Analyst Technician (ABAT)",
    "specialtyCode": "أخصائية نفسية | أخصائية ABA",
    "specialtyCodeEn": "Psychologist & ABA Specialist",
    "category": "psychology",
    "department": "قسم الإرشاد النفسي والتدخل السلوكي ABA",
    "avatar": "/specialists/cards/spec_38_haya-faleh.png",
    "fallbackAvatar": "/specialists/cards/spec_38_haya-faleh.png",
    "rating": 4.91,
    "reviewCount": 94,
    "experienceYears": 2,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصلة على بكالوريوس علم النفس من كلية التربية - جامعة الملك سعود",
      "حاصلة على اعتماد ABAT في تحليل السلوك التطبيقي من QABA",
      "تعديل السلوك وتنمية المهارات التكيفية والنفسية للطفل",
      "خبرة عملية أكثر من سنة"
    ],
    "bio": "أخصائية نفسية وأخصائية ABA بمركز رابا. خريجة جامعة الملك سعود ومعتمدة كفني تحليل سلوك تطبيقي من البورد الأمريكي QABA، متخصصة في معالجة القلق والمخاوف السلوكية وبناء المهارات التكيفية للأطفال."
  },
  {
    "id": "doc-haya-dosari",
    "name": "هياء الدوسري",
    "arabicName": "هياء الدوسري",
    "nameEn": "Haya Al-Dosari",
    "title": "أخصائية نفسية | أخصائية ABA",
    "titleEn": "Psychologist & ABA Specialist",
    "specialty": "أخصائية نفسية وسلوكية معتمدة ABAT من QABA",
    "specialtyEn": "Psychologist & Certified Behavior Analyst Technician (ABAT)",
    "specialtyCode": "أخصائية نفسية | أخصائية ABA",
    "specialtyCodeEn": "Psychologist & ABA Specialist",
    "category": "psychology",
    "department": "قسم الإرشاد النفسي والتدخل السلوكي ABA",
    "avatar": "/specialists/cards/spec_39_haya-dosari.png",
    "fallbackAvatar": "/specialists/cards/spec_39_haya-dosari.png",
    "rating": 4.91,
    "reviewCount": 96,
    "experienceYears": 2,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصلة على بكالوريوس علم النفس من كلية التربية - جامعة الملك سعود",
      "حاصلة على اعتماد ABAT في تحليل السلوك التطبيقي من QABA",
      "التدخلات السلوكية الإيجابية وتطوير المهارات التفاعلية",
      "خبرة عملية أكثر من سنة"
    ],
    "bio": "أخصائية نفسية وسلوكية ABA بمركز رابا. حاصلة على بكالوريوس علم النفس من جامعة الملك سعود واعتماد ABAT الدولي من QABA، متخصصة في التدخلات السلوكية الإيجابية وتطوير المهارات التفاعلية للأطفال."
  },
  {
    "id": "doc-renad-otaibi",
    "name": "ريناد العتيبي",
    "arabicName": "ريناد العتيبي",
    "nameEn": "Renad Al-Otaibi",
    "title": "أخصائية نفسية",
    "titleEn": "Psychological Specialist",
    "specialty": "أخصائية نفسية وسلوكية معتمدة ABAT من QABA",
    "specialtyEn": "Child Psychologist & Certified ABAT Technician",
    "specialtyCode": "أخصائية نفسية",
    "specialtyCodeEn": "Psychological Specialist",
    "category": "psychology",
    "department": "قسم الإرشاد والتقييم النفسي",
    "avatar": "/specialists/cards/spec_40_renad-otaibi.png",
    "fallbackAvatar": "/specialists/cards/spec_40_renad-otaibi.png",
    "rating": 4.92,
    "reviewCount": 98,
    "experienceYears": 2,
    "patientsCount": 1200,
    "sessionPrice": 0,
    "location": "",
    "locationEn": "",
    "isAvailable": true,
    "nextSlot": "متاح للحجز",
    "nextSlotEn": "Available for booking",
    "isTopRated": true,
    "tags": [
      "حاصلة على بكالوريوس علم النفس من كلية التربية - جامعة الملك سعود",
      "حاصلة على اعتماد ABAT في تحليل السلوك التطبيقي من QABA",
      "جلسات الدعم النفسي وتعديل السلوك وتنمية الذكاء العاطفي",
      "خبرة عملية أكثر من سنة"
    ],
    "bio": "أخصائية نفسية بمركز رابا. خريجة جامعة الملك سعود ومعتمدة دولياً من البورد الأمريكي QABA في تحليل السلوك التطبيقي (ABAT)، متخصصة في الدعم النفسي وتعديل السلوك وتنمية الذكاء العاطفي والتواصلي لدى الأطفال."
  }
];

interface DoctorCardSliderProps {
  doctors?: Doctor[];
  specialists?: any[];
  onBookAppointment?: (doctor: Doctor) => void;
  onViewCv?: (doctor: Doctor) => void;
  className?: string;
}

export const DoctorCardSlider: React.FC<DoctorCardSliderProps> = ({
  doctors = DOCTORS_DATA,
  specialists,
  onBookAppointment,
  onViewCv,
  className = '',
}) => {
  const { isArabic } = useLanguage();

  // Search and Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'earliest' | 'rating' | 'experience'>('earliest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  // Favorites state
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

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

  // Slider refs for Dual Slider (Upper & Lower tracks)
  const upperSliderRef = useRef<HTMLDivElement>(null);
  const lowerSliderRef = useRef<HTMLDivElement>(null);

  // Dragging state for Upper Slider
  const [isUpperDragging, setIsUpperDragging] = useState(false);
  const upperStartXRef = useRef(0);
  const upperScrollLeftRef = useRef(0);

  // Dragging state for Lower Slider
  const [isLowerDragging, setIsLowerDragging] = useState(false);
  const lowerStartXRef = useRef(0);
  const lowerScrollLeftRef = useRef(0);

  // Merge doctors list with any specialists data passed dynamically, deduplicating rigorously
  const effectiveDoctors = useMemo(() => {
    // 1. Initial deduplication of source doctors
    const cleanSourceDoctors = deduplicateDoctors(doctors);

    let baseDocs: Doctor[];
    if (specialists && specialists.length > 0) {
      baseDocs = specialists.map((spec) => {
        const matchingDoc = cleanSourceDoctors.find(d => isSameSpecialist(d, spec));
        return {
          id: spec.id.startsWith('spec-') ? spec.id.replace('spec-', 'doc-') : (matchingDoc?.id || `doc-${spec.id}`),
          name: spec.name,
          arabicName: spec.name,
          nameEn: spec.nameEn || matchingDoc?.nameEn || spec.name,
          title: spec.title,
          titleEn: spec.titleEn || matchingDoc?.titleEn || spec.title,
          specialty: spec.role || matchingDoc?.specialty || spec.title,
          specialtyEn: spec.roleEn || matchingDoc?.specialtyEn || spec.titleEn || spec.title,
          specialtyCode: spec.title,
          specialtyCodeEn: spec.titleEn || 'SPECIALIST',
          category: (spec.category as any) || ((spec.title.includes('نطق') || spec.title.includes('تخاطب')) ? 'speech' : (spec.title.includes('وظيفي') || spec.title.includes('حركي')) ? 'occupational' : (spec.title.includes('نفس')) ? 'psychology' : 'aba'),
          department: spec.department || spec.role || spec.title,
          avatar: spec.avatar || matchingDoc?.avatar || '/images/specialists/haneen_obaidi.jpg',
          fallbackAvatar: spec.avatar || matchingDoc?.fallbackAvatar || '/images/specialists/haneen_obaidi.jpg',
          rating: spec.rating || matchingDoc?.rating || 4.9,
          reviewCount: spec.reviewsCount || matchingDoc?.reviewCount || 120,
          experienceYears: spec.experienceYears || matchingDoc?.experienceYears || 5,
          patientsCount: matchingDoc?.patientsCount || 1000,
          sessionPrice: 0,
          location: '',
          locationEn: '',
          isAvailable: true,
          nextSlot: 'متاح للحجز',
          nextSlotEn: 'Available for booking',
          tags: (spec.specialties && spec.specialties.length > 0) ? spec.specialties : (matchingDoc?.tags || []),
          bio: spec.bio || matchingDoc?.bio || '',
          isTopRated: (spec.rating || matchingDoc?.rating || 0) >= 4.9
        };
      });
    } else {
      baseDocs = cleanSourceDoctors;
    }

    // 2. Final strict deduplication pass to guarantee uniqueness
    return deduplicateDoctors(baseDocs);
  }, [doctors, specialists]);

  // Categories list
  const categories = useMemo(() => [
    { id: 'all', labelAr: 'جميع الأخصائيين (٤٠)', labelEn: 'All specialists (40)' },
    { id: 'aba', labelAr: 'تحليل السلوك ABA', labelEn: 'ABA Therapy' },
    { id: 'occupational', labelAr: 'العلاج الوظيفي والتكامل الحسي', labelEn: 'Occupational Therapy' },
    { id: 'speech', labelAr: 'التخاطب والنطق', labelEn: 'Speech & Language' },
    { id: 'psychology', labelAr: 'الاستشارات النفسية والإدراك', labelEn: 'Child Psychology' },
  ], []);

  // Filtered & Sorted Doctors
  const filteredDoctors = useMemo(() => {
    let list = effectiveDoctors.filter((doc) => {
      // Category filter
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
    }
    return list;
  }, [effectiveDoctors, selectedCategory, searchQuery, sortBy]);

  // Split into 2 Sliders: Upper Slider (30 cards) and Lower Slider (30 cards)
  const { upperDoctors, lowerDoctors } = useMemo(() => {
    const total = filteredDoctors.length;
    if (total <= 1) {
      return { upperDoctors: filteredDoctors, lowerDoctors: [] };
    }
    const mid = Math.ceil(total / 2);
    return {
      upperDoctors: filteredDoctors.slice(0, mid),
      lowerDoctors: filteredDoctors.slice(mid, total)
    };
  }, [filteredDoctors]);

  // Scroll handler for Upper Slider
  const handleScrollUpper = (direction: 'next' | 'prev') => {
    const el = upperSliderRef.current;
    if (!el) return;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const scrollAmount = isMobile ? Math.round(el.clientWidth * 0.65) : 380;
    let delta = direction === 'prev' ? -scrollAmount : scrollAmount;
    if (isArabic) delta = -delta;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  // Scroll handler for Lower Slider
  const handleScrollLower = (direction: 'next' | 'prev') => {
    const el = lowerSliderRef.current;
    if (!el) return;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const scrollAmount = isMobile ? Math.round(el.clientWidth * 0.65) : 380;
    let delta = direction === 'prev' ? -scrollAmount : scrollAmount;
    if (isArabic) delta = -delta;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  // Drag handlers for Upper Slider
  const handleUpperMouseDown = (e: React.MouseEvent) => {
    const el = upperSliderRef.current;
    if (!el) return;
    setIsUpperDragging(true);
    upperStartXRef.current = e.pageX - el.offsetLeft;
    upperScrollLeftRef.current = el.scrollLeft;
  };

  const handleUpperMouseMove = (e: React.MouseEvent) => {
    if (!isUpperDragging || !upperSliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - upperSliderRef.current.offsetLeft;
    const walk = (x - upperStartXRef.current) * 1.5;
    upperSliderRef.current.scrollLeft = upperScrollLeftRef.current - walk;
  };

  const handleUpperMouseUp = () => setIsUpperDragging(false);

  // Drag handlers for Lower Slider
  const handleLowerMouseDown = (e: React.MouseEvent) => {
    const el = lowerSliderRef.current;
    if (!el) return;
    setIsLowerDragging(true);
    lowerStartXRef.current = e.pageX - el.offsetLeft;
    lowerScrollLeftRef.current = el.scrollLeft;
  };

  const handleLowerMouseMove = (e: React.MouseEvent) => {
    if (!isLowerDragging || !lowerSliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - lowerSliderRef.current.offsetLeft;
    const walk = (x - lowerStartXRef.current) * 1.5;
    lowerSliderRef.current.scrollLeft = lowerScrollLeftRef.current - walk;
  };

  const handleLowerMouseUp = () => setIsLowerDragging(false);

  // Toggle favorite
  const toggleFavorite = (e: React.MouseEvent, docId: string) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [docId]: !prev[docId] }));
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
  const renderDoctorCard = (doctor: Doctor) => {
    const isFav = !!favorites[doctor.id];
    
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
        className="w-[56vw] min-w-[195px] max-w-[225px] sm:min-w-0 sm:max-w-none sm:w-[325px] md:w-[350px] lg:w-[375px] shrink-0 snap-start bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
      >
        {/* Upper Hero Image Area with Overlaid Badges */}
        <div className="relative h-32 sm:h-48 md:h-56 overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-white/5">
          <img
            src={activeAvatar}
            alt={isArabic ? doctor.name : (doctor.nameEn || doctor.name)}
            onError={(e) => {
              handleImageErrorWithStore(e, rawAvatar, doctor.fallbackAvatar || doctor.avatar);
            }}
            className={`w-full h-full ${fitClass} ${posClass} hover:scale-105 transition-transform duration-500`}
            style={{
              transform: zoomScale !== 1 ? `scale(${zoomScale})` : undefined
            }}
            loading="lazy"
            referrerPolicy="no-referrer"
          />

          {/* Top Left Badge: TOP RATED */}
          {isTop && (
            <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 z-10">
              <span className="bg-white/95 dark:bg-slate-950/90 backdrop-blur-xs text-slate-900 dark:text-white text-[7.5px] sm:text-[10px] font-black tracking-wider px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md uppercase">
                {isArabic ? 'الأعلى تقييماً' : 'TOP RATED'}
              </span>
            </div>
          )}

          {/* Top Right Heart / Favorite Button */}
          <button
            onClick={(e) => toggleFavorite(e, doctor.id)}
            aria-label="Save to favorites"
            className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3 z-10 w-6 h-6 sm:w-9 sm:h-9 rounded-full bg-white/95 dark:bg-slate-900/90 shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer text-slate-700 dark:text-slate-200 hover:text-rose-500"
          >
            <Heart 
              className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors ${
                isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-600 dark:text-slate-300'
              }`} 
            />
          </button>
        </div>

        {/* Lower Card Body */}
        <div className="p-2 sm:p-4 md:p-5 flex flex-col justify-between flex-1">
          <div>
            {/* 1. Specialty Code & Rating Pill */}
            <div className="flex items-center justify-between gap-1 mb-1 sm:mb-2">
              <span className="text-[#0D9488] dark:text-[#00E5BE] text-[9px] sm:text-[11px] font-black uppercase tracking-wider truncate max-w-[68%]">
                {isArabic ? doctor.specialtyCode : doctor.specialtyCodeEn}
              </span>

              <span className="flex items-center gap-0.5 sm:gap-1 bg-amber-400/10 text-slate-900 dark:text-amber-300 px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9.5px] sm:text-xs font-black shrink-0">
                <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                <span>{(displayRating || 4.9).toFixed(1)}</span>
              </span>
            </div>

            {/* 2. Doctor Name */}
            <h3 className="text-xs sm:text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-snug mb-1 sm:mb-2.5 truncate">
              {isArabic ? doctor.name : (doctor.nameEn || doctor.name)}
            </h3>

            {/* 3. 3-Column Metrics Row: Prominently Highlights Years of Experience */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-white/10 rtl:divide-x-reverse py-1 sm:py-2.5 border-y border-slate-100 dark:border-white/10 mb-1 sm:mb-2.5 text-center">
              <div className="px-0.5 sm:px-1">
                <span className="text-xs sm:text-base md:text-lg font-black text-slate-900 dark:text-white block font-sans">
                  {doctor.experienceYears}
                </span>
                <span className="text-[7px] sm:text-[9.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mt-0.5">
                  {isArabic ? 'سنوات خبرة' : 'YEARS EXP.'}
                </span>
              </div>

              <div className="px-0.5 sm:px-1">
                <span className="text-xs sm:text-base md:text-lg font-black text-slate-900 dark:text-white block font-sans">
                  {displayReviewCount}
                </span>
                <span className="text-[7px] sm:text-[9.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mt-0.5">
                  {isArabic ? 'تقييم معتمد' : 'REVIEWS'}
                </span>
              </div>

              <div className="px-0.5 sm:px-1">
                <span className="text-xs sm:text-base md:text-lg font-black text-amber-500 dark:text-amber-400 flex items-center justify-center gap-0.5 sm:gap-1 font-sans">
                  <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                  <span>{(displayRating || 4.9).toFixed(1)}</span>
                </span>
                <span className="text-[7px] sm:text-[9.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mt-0.5">
                  {isArabic ? 'متوسط التقييم' : 'RATING'}
                </span>
              </div>
            </div>

            {/* 5. Interactive Star Rating Widget directly on the Card */}
            <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-500/20 rounded-xl sm:rounded-2xl p-1 sm:p-2.5 my-1 sm:my-2 flex items-center justify-between gap-1 transition-all shadow-2xs">
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

          {/* Footer Row: Actions (Without Location or Branch) */}
          <div className="flex items-center justify-between gap-1 pt-1.5 sm:pt-2 border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold min-w-0">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="text-[8.5px] sm:text-[11px] truncate">
                {isArabic ? 'متاح للحجز' : 'Available'}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {onViewCv && (
                <button
                  onClick={() => handleViewProfile(doctor)}
                  title={isArabic ? 'السيرة الذاتية' : 'View CV'}
                  className="px-1.5 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-[#0B3B36] hover:border-[#0B3B36] dark:hover:text-[#00E5BE] dark:hover:border-[#00E5BE] font-bold text-[9px] sm:text-xs flex items-center gap-0.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <FileText className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">{isArabic ? 'السيرة' : 'CV'}</span>
                </button>
              )}

              <button
                onClick={() => handleBook(doctor)}
                className="bg-[#0B3B36] hover:bg-[#124d47] dark:bg-[#135d53] dark:hover:bg-[#1a776a] text-white font-bold text-[10px] sm:text-sm px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
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
              <span>{isArabic ? '٤٠ أخصائي واستشاري معتمد' : '40 Certified Specialists & Consultants'}</span>
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

        {/* Search Input Bar */}
        <div className="relative w-full md:w-80 lg:w-96">
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

      {/* 2. Sort Toolbar (Without category pills) */}
      <div className="flex items-center justify-between gap-3.5 pb-3 mb-6 border-b border-slate-200/70 dark:border-white/10">
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
          {isArabic ? `${filteredDoctors.length} أخصائي متاح` : `${filteredDoctors.length} Specialists Available`}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 sm:py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
            >
              <span>
                {sortBy === 'earliest' && (isArabic ? 'الترتيب: الأقرب موعداً' : 'Sort: Earliest')}
                {sortBy === 'rating' && (isArabic ? 'الترتيب: الأعلى تقييماً' : 'Sort: Highest Rated')}
                {sortBy === 'experience' && (isArabic ? 'الترتيب: الأكثر خبرة' : 'Sort: Most Experienced')}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isSortOpen && (
              <div className={`absolute top-full mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-2xl shadow-xl p-1.5 z-40 ${isArabic ? 'left-0' : 'right-0'}`}>
                <button
                  onClick={() => { setSortBy('earliest'); setIsSortOpen(false); }}
                  className={`w-full text-right rtl:text-right ltr:text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                    sortBy === 'earliest' ? 'bg-slate-100 dark:bg-white/10 text-[#0B3B36] dark:text-[#00E5BE]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{isArabic ? 'الأقرب موعداً' : 'Earliest available'}</span>
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
        </div>

      </div>

      {/* No Results Fallback */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 p-8">
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-3">
            {isArabic ? 'لم يتم العثور على أخصائيين يطابقون خيارات البحث.' : 'No specialists match your search criteria.'}
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="px-5 py-2 rounded-xl bg-[#0B3B36] text-white text-xs font-bold cursor-pointer"
          >
            {isArabic ? 'إعادة تعيين الفلاتر' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="space-y-8 sm:space-y-10">

          {/* 3. UPPER ROW (٣٠ بطاقة أخصائي) */}
          <div className="bg-slate-50/60 dark:bg-slate-900/40 rounded-2xl sm:rounded-3xl p-2 sm:p-5 border border-slate-200/70 dark:border-white/5 shadow-2xs">
            <div className="flex items-center justify-end mb-2 sm:mb-2.5 px-1">
              {/* Upper Navigation Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleScrollUpper('prev')}
                  aria-label={isArabic ? 'السابق' : 'Previous'}
                  className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/10 shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  {isArabic ? <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>
                <button
                  onClick={() => handleScrollUpper('next')}
                  aria-label={isArabic ? 'التالي' : 'Next'}
                  className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/10 shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  {isArabic ? <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>
              </div>
            </div>

            {/* Upper Track */}
            <div
              ref={upperSliderRef}
              onMouseDown={handleUpperMouseDown}
              onMouseMove={handleUpperMouseMove}
              onMouseUp={handleUpperMouseUp}
              onMouseLeave={handleUpperMouseUp}
              className={`flex gap-2.5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1.5 sm:py-2 px-1 ${
                isUpperDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
              }`}
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {upperDoctors.map(renderDoctorCard)}
            </div>
          </div>

          {/* 4. LOWER ROW (٣٠ بطاقة أخصائي) */}
          {lowerDoctors.length > 0 && (
            <div className="bg-slate-50/60 dark:bg-slate-900/40 rounded-2xl sm:rounded-3xl p-2 sm:p-5 border border-slate-200/70 dark:border-white/5 shadow-2xs">
              <div className="flex items-center justify-end mb-2 sm:mb-2.5 px-1">
                {/* Lower Navigation Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleScrollLower('prev')}
                    aria-label={isArabic ? 'السابق' : 'Previous'}
                    className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/10 shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    {isArabic ? <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>
                  <button
                    onClick={() => handleScrollLower('next')}
                    aria-label={isArabic ? 'التالي' : 'Next'}
                    className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/10 shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    {isArabic ? <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>
                </div>
              </div>

              {/* Lower Track */}
              <div
                ref={lowerSliderRef}
                onMouseDown={handleLowerMouseDown}
                onMouseMove={handleLowerMouseMove}
                onMouseUp={handleLowerMouseUp}
                onMouseLeave={handleLowerMouseUp}
                className={`flex gap-2.5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1.5 sm:py-2 px-1 ${
                  isLowerDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
                }`}
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {lowerDoctors.map(renderDoctorCard)}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default DoctorCardSlider;
