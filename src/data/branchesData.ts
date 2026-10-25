import { savePersistentModule } from '../utils/persistentSync';

export interface BranchItem {
  id: string;
  name: string;
  nameEn: string;
  city: 'riyadh' | 'jeddah' | 'khobar' | 'ahsa' | 'kharj' | string;
  cityNameAr: string;
  cityNameEn: string;
  regionBadgeAr: string;
  regionBadgeEn: string;
  badgeColorClass: string;
  address: string;
  addressEn: string;
  googleMapsUrl: string;
  whatsappUrl: string;
  whatsappNumber: string;
  phone: string;
  hoursAr: string;
  hoursEn: string;
  order?: number;
  hasClubBadge?: boolean;
}

export const BRANCHES_DATA: BranchItem[] = [
  {
    id: 'branch-mugharrazat',
    name: 'فرع المغرزات - رواد الخليج',
    nameEn: 'Al-Mugharrazat Branch - Rowad Al-Khaleej',
    city: 'riyadh',
    cityNameAr: 'الرياض',
    cityNameEn: 'Riyadh',
    regionBadgeAr: 'الرياض - المغرزات',
    regionBadgeEn: 'Riyadh - Al-Mugharrazat',
    badgeColorClass: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    address: 'شارع ابي سفيان ابن حرب - داخل مدارس رواد الخليج العالمية - بوابة ٩',
    addressEn: 'Abi Sufyan Ibn Harb St - inside Rowad Al-Khaleej International Schools - Gate 9',
    googleMapsUrl: 'https://maps.google.com/?q=مدارس+رواد+الخليج+العالمية+حي+المغرزات+بوابة+9+الرياض',
    whatsappUrl: 'https://wa.me/966575100100?text=السلام%20عليكم،%20أود%20الاستفسار%20عن%20خدمات%20ومواعيد%20مركز%20رابا%20-%20فرع%20المغرزات%20-%20رواد%20الخليج',
    whatsappNumber: '0575100100',
    phone: '0575100100',
    hoursAr: 'الأحد - الخميس: 8:00 ص - 4:00 م',
    hoursEn: 'Sun - Thu: 8:00 AM - 4:00 PM',
    order: 1,
    hasClubBadge: true
  },
  {
    id: 'branch-sahafa',
    name: 'فرع الصحافة - رواد الخليج',
    nameEn: 'Al-Sahafah Branch - Rowad Al-Khaleej',
    city: 'riyadh',
    cityNameAr: 'الرياض',
    cityNameEn: 'Riyadh',
    regionBadgeAr: 'الرياض - الصحافة',
    regionBadgeEn: 'Riyadh - Al-Sahafah',
    badgeColorClass: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    address: 'شارع الأمير عبد الله بن سعود - داخل مدارس رواد الخليج العالمية',
    addressEn: 'Prince Abdullah Bin Saud St - inside Rowad Al-Khaleej International Schools',
    googleMapsUrl: 'https://maps.app.goo.gl/F6CpqLohJJTzqrRq6?g_st=iw',
    whatsappUrl: 'https://wa.me/966575100100?text=السلام%20عليكم،%20أود%20الاستفسار%20عن%20خدمات%20ومواعيد%20مركز%20رابا%20-%20فرع%20الصحافة%20-%20رواد%20الخليج',
    whatsappNumber: '0575100100',
    phone: '0575100100',
    hoursAr: 'الأحد - الخميس: 8:00 ص - 8:00 م',
    hoursEn: 'Sun - Thu: 8:00 AM - 8:00 PM',
    order: 2,
    hasClubBadge: true
  },
  {
    id: 'branch-hittin',
    name: 'فرع حطين - رواد الخليج',
    nameEn: 'Hittin Branch - Rowad Al-Khaleej',
    city: 'riyadh',
    cityNameAr: 'الرياض',
    cityNameEn: 'Riyadh',
    regionBadgeAr: 'الرياض - حطين',
    regionBadgeEn: 'Riyadh - Hittin',
    badgeColorClass: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    address: 'شارع الأمير يزيد ابن عبد الله - داخل مدارس رواد الخليج العالمية',
    addressEn: 'Prince Yazid Ibn Abdullah St - inside Rowad Al-Khaleej International Schools',
    googleMapsUrl: 'https://maps.google.com/?q=مدارس+رواد+الخليج+العالمية+شارع+الأمير+يزيد+ابن+عبدالله+حي+حطين+الرياض',
    whatsappUrl: 'https://wa.me/966575100100?text=السلام%20عليكم،%20أود%20الاستفسار%20عن%20خدمات%20ومواعيد%20مركز%20رابا%20-%20فرع%20حطين%20-%20رواد%20الخليج',
    whatsappNumber: '0575100100',
    phone: '0575100100',
    hoursAr: 'الأحد - الخميس: 8:00 ص - 8:00 م',
    hoursEn: 'Sun - Thu: 8:00 AM - 8:00 PM',
    order: 3,
    hasClubBadge: true
  },
  {
    id: 'branch-jeddah-shiraa',
    name: 'فرع ابحر الشمالية - رواد الخليج',
    nameEn: 'North Obhur Branch - Rowad Al-Khaleej',
    city: 'jeddah',
    cityNameAr: 'جدة',
    cityNameEn: 'Jeddah',
    regionBadgeAr: 'جدة - أبحر الشمالية',
    regionBadgeEn: 'Jeddah - North Obhur',
    badgeColorClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    address: 'حي الشراع - ابحر الشمالية - داخل مدارس رواد الخليج العالمية - بوابة ٢',
    addressEn: 'Al-Sheraa Dist - North Obhur - inside Rowad Al-Khaleej International Schools - Gate 2',
    googleMapsUrl: 'https://maps.google.com/?q=مدارس+رواد+الخليج+العالمية+حي+الشراع+أبحر+الشمالية+جدة',
    whatsappUrl: 'https://wa.me/966575100100?text=السلام%20عليكم،%20أود%20الاستفسار%20عن%20خدمات%20ومواعيد%20مركز%20رابا%20-%20فرع%20ابحر%20الشمالية%20-%20رواد%20الخليج',
    whatsappNumber: '0575100100',
    phone: '0575100100',
    hoursAr: 'الأحد - الخميس: 8:00 ص - 8:00 م',
    hoursEn: 'Sun - Thu: 8:00 AM - 8:00 PM',
    order: 4,
    hasClubBadge: true
  },
  {
    id: 'branch-jeddah-hamadaniyah',
    name: 'فرع الحمدانية - مدارس الفيصلية',
    nameEn: 'Al-Hamadaniyah Branch - Al-Faisaliah Schools',
    city: 'jeddah',
    cityNameAr: 'جدة',
    cityNameEn: 'Jeddah',
    regionBadgeAr: 'جدة - الحمدانية',
    regionBadgeEn: 'Jeddah - Al-Hamadaniyah',
    badgeColorClass: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    address: 'حي الحمدانية - خلف مدارس الفيصلية الأهلية بنين',
    addressEn: 'Al-Hamadaniyah Dist - behind Al-Faisaliah Private Schools (Boys)',
    googleMapsUrl: 'https://maps.google.com/?q=حي+الحمدانية+خلف+مدارس+الفيصلية+الأهلية+بنين+جدة',
    whatsappUrl: 'https://wa.me/966575100100?text=السلام%20عليكم،%20أود%20الاستفسار%20عن%20خدمات%20ومواعيد%20مركز%20رابا%20-%20فرع%20الحمدانية%20-%20مدارس%20الفيصلية',
    whatsappNumber: '0575100100',
    phone: '0575100100',
    hoursAr: 'الأحد - الخميس: 8:00 ص - 8:00 م',
    hoursEn: 'Sun - Thu: 8:00 AM - 8:00 PM',
    order: 5,
    hasClubBadge: true
  },
  {
    id: 'branch-ahsa',
    name: 'فرع الاحساء - رواد الخليج',
    nameEn: 'Al-Ahsa Branch - Rowad Al-Khaleej',
    city: 'ahsa',
    cityNameAr: 'الأحساء',
    cityNameEn: 'Al-Ahsa',
    regionBadgeAr: 'الأحساء - المبرز',
    regionBadgeEn: 'Al-Ahsa - Al-Mubarraz',
    badgeColorClass: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    address: 'حي اليرموك - المبرز - شارع أبي حبيب الأنصاري - تقاطع شارع عبد الله بن أبي حدرد - داخل مدارس رواد الخليج العالمية - بوابة ٧',
    addressEn: 'Al-Yarmouk Dist - Al-Mubarraz - Abi Habib Al-Ansari St x Abdullah Bin Abi Hadrad St - inside Rowad Al-Khaleej International Schools - Gate 7',
    googleMapsUrl: 'https://maps.google.com/?q=25.426332,49.565449',
    whatsappUrl: 'https://wa.me/966575100100?text=السلام%20عليكم،%20أود%20الاستفسار%20عن%20خدمات%20ومواعيد%20مركز%20رابا%20-%20فرع%20الاحساء%20-%20رواد%20الخليج',
    whatsappNumber: '0575100100',
    phone: '0575100100',
    hoursAr: 'الأحد - الخميس: 8:00 ص - 8:00 م',
    hoursEn: 'Sun - Thu: 8:00 AM - 8:00 PM',
    order: 6,
    hasClubBadge: true
  },
  {
    id: 'branch-khobar',
    name: 'فرع الخبر',
    nameEn: 'Al-Khobar Branch',
    city: 'khobar',
    cityNameAr: 'الخبر',
    cityNameEn: 'Al-Khobar',
    regionBadgeAr: 'الخبر - الراكة الجنوبية',
    regionBadgeEn: 'Al-Khobar - South Rakah',
    badgeColorClass: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    address: 'حي الراكة الجنوبية - طريق الملك فيصل داخل مدارس رواد الخليج العالمية',
    addressEn: 'South Rakah Dist - King Faisal Rd, inside Rowad Al-Khaleej International Schools',
    googleMapsUrl: 'https://maps.app.goo.gl/iPsvY46UotNMBcc27?g_st=aw',
    whatsappUrl: 'https://wa.me/966575100100?text=السلام%20عليكم،%20أود%20الاستفسار%20عن%20خدمات%20ومواعيد%20مركز%20رابا%20-%20فرع%20الخبر',
    whatsappNumber: '0575100100',
    phone: '0575100100',
    hoursAr: 'الأحد - الخميس: 8:00 ص - 8:00 م',
    hoursEn: 'Sun - Thu: 8:00 AM - 8:00 PM',
    order: 7,
    hasClubBadge: true
  },
  {
    id: 'branch-alkharj',
    name: 'فرع الخرج',
    nameEn: 'Al-Kharj Branch',
    city: 'kharj',
    cityNameAr: 'الخرج',
    cityNameEn: 'Al-Kharj',
    regionBadgeAr: 'الخرج - اليمامة',
    regionBadgeEn: 'Al-Kharj - Al-Yamamah',
    badgeColorClass: 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40',
    address: 'حي اليمامة - داخل مقر جمعية التنمية الاجتماعية',
    addressEn: 'Al-Yamamah Dist - inside Social Development Association headquarters',
    googleMapsUrl: 'https://maps.google.com/?q=مركز+رابا+الخرج+حي+اليمامة+جمعية+التنمية+الاجتماعية',
    whatsappUrl: 'https://wa.me/966575100100?text=السلام%20عليكم،%20أود%20الاستفسار%20عن%20خدمات%20ومواعيد%20مركز%20رابا%20-%20فرع%20الخرج',
    whatsappNumber: '0575100100',
    phone: '0575100100',
    hoursAr: 'الأحد - الخميس: 8:00 ص - 8:00 م',
    hoursEn: 'Sun - Thu: 8:00 AM - 8:00 PM',
    order: 8,
    hasClubBadge: false
  },
  {
    id: 'branch-narjis',
    name: 'فرع النرجس',
    nameEn: 'Al-Narjis Branch',
    city: 'riyadh',
    cityNameAr: 'الرياض',
    cityNameEn: 'Riyadh',
    regionBadgeAr: 'الرياض - النرجس',
    regionBadgeEn: 'Riyadh - Al-Narjis',
    badgeColorClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    address: 'طريق أنس ابن مالك',
    addressEn: 'Anas Ibn Malik Rd',
    googleMapsUrl: 'https://maps.google.com/?q=مركز+رابا+فرع+النرجس+طريق+أنس+بن+مالك+الرياض',
    whatsappUrl: 'https://wa.me/966575100100?text=السلام%20عليكم،%20أود%20الاستفسار%20عن%20خدمات%20ومواعيد%20مركز%20رابا%20-%20فرع%20النرجس',
    whatsappNumber: '0575100100',
    phone: '0575100100',
    hoursAr: 'الأحد - الخميس: 8:00 ص - 8:00 م',
    hoursEn: 'Sun - Thu: 8:00 AM - 8:00 PM',
    order: 9,
    hasClubBadge: false
  },
  {
    id: 'branch-rabwah',
    name: 'فرع الربوة',
    nameEn: 'Al-Rabwah Branch',
    city: 'riyadh',
    cityNameAr: 'الرياض',
    cityNameEn: 'Riyadh',
    regionBadgeAr: 'الرياض - الربوة',
    regionBadgeEn: 'Riyadh - Al-Rabwah',
    badgeColorClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    address: 'شارع الأمير فواز بن عبد العزيز',
    addressEn: 'Prince Fawaz Ibn Abdulaziz St',
    googleMapsUrl: 'https://maps.google.com/?q=مركز+رابا+فرع+الربوة+شارع+الأمير+فواز+بن+عبدالعزيز+الرياض',
    whatsappUrl: 'https://wa.me/966575100100?text=السلام%20عليكم،%20أود%20الاستفسار%20عن%20خدمات%20ومواعيد%20مركز%20رابا%20-%20فرع%20الربوة',
    whatsappNumber: '0575100100',
    phone: '0575100100',
    hoursAr: 'الأحد - الخميس: 8:00 ص - 8:00 م',
    hoursEn: 'Sun - Thu: 8:00 AM - 8:00 PM',
    order: 10,
    hasClubBadge: false
  }
];

export const STORAGE_BRANCHES_KEY = 'raba_branches_data_v3';

export function getStoredBranchesData(): BranchItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_BRANCHES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 8) {
        return parsed.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    }
    return [...BRANCHES_DATA];
  } catch {
    return [...BRANCHES_DATA];
  }
}

export function saveStoredBranchesData(branches: BranchItem[]): void {
  try {
    localStorage.setItem(STORAGE_BRANCHES_KEY, JSON.stringify(branches));
    savePersistentModule(STORAGE_BRANCHES_KEY, branches);
    window.dispatchEvent(new CustomEvent('raba_branches_updated', { detail: branches }));
  } catch (err) {
    console.error('Failed to save branches data', err);
  }
}
