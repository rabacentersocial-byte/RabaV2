export interface BranchItem {
  id: string;
  name: string;
  nameEn: string;
  city: 'riyadh' | 'kharj';
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
}

export const BRANCHES_DATA: BranchItem[] = [
  {
    id: 'branch-narjis',
    name: 'فرع النرجس',
    nameEn: 'Al-Narjis Branch',
    city: 'riyadh',
    cityNameAr: 'فروع الرياض',
    cityNameEn: 'Riyadh Branches',
    regionBadgeAr: 'شمال الرياض',
    regionBadgeEn: 'North Riyadh',
    badgeColorClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    address: 'طريق أنس بن مالك، حي النرجس، الدور الثالث.',
    addressEn: 'Anas Ibn Malik Rd, Al-Narjis District, 3rd Floor.',
    googleMapsUrl: 'https://maps.google.com/?q=مركز+رابا+فرع+النرجس+طريق+أنس+بن+مالك+حي+النرجس+الرياض',
    whatsappUrl: 'https://wa.me/966575100100?text=السلام%20عليكم،%20أود%20الاستفسار%20عن%20خدمات%20ومواعيد%20مركز%20رابا%20-%20فرع%20النرجس',
    whatsappNumber: '0575100100',
    phone: '0575100100',
    hoursAr: 'الأحد - الخميس: 8:00 ص - 8:00 م',
    hoursEn: 'Sun - Thu: 8:00 AM - 8:00 PM'
  },
  {
    id: 'branch-rabwah',
    name: 'فرع الربوة',
    nameEn: 'Al-Rabwah Branch',
    city: 'riyadh',
    cityNameAr: 'فروع الرياض',
    cityNameEn: 'Riyadh Branches',
    regionBadgeAr: 'الرياض',
    regionBadgeEn: 'Riyadh',
    badgeColorClass: 'bg-slate-700/60 text-slate-200 border-slate-600/40',
    address: 'حي الربوة، شارع الأمير فواز بن عبدالعزيز.',
    addressEn: 'Al-Rabwah District, Prince Fawaz Ibn Abdulaziz St.',
    googleMapsUrl: 'https://maps.google.com/?q=مركز+رابا+فرع+الربوة+شارع+الأمير+فواز+بن+عبدالعزيز+الرياض',
    whatsappUrl: 'https://wa.me/966575100100?text=السلام%20عليكم،%20أود%20الاستفسار%20عن%20خدمات%20ومواعيد%20مركز%20رابا%20-%20فرع%20الربوة',
    whatsappNumber: '0575100100',
    phone: '0575100100',
    hoursAr: 'الأحد - الخميس: 8:00 ص - 8:00 م',
    hoursEn: 'Sun - Thu: 8:00 AM - 8:00 PM'
  },
  {
    id: 'branch-ruwad-alkhaleej',
    name: 'فرع رابا - رواد الخليج',
    nameEn: 'Raba - Rowad Al-Khaleej Branch',
    city: 'riyadh',
    cityNameAr: 'فروع الرياض',
    cityNameEn: 'Riyadh Branches',
    regionBadgeAr: 'الرياض',
    regionBadgeEn: 'Riyadh',
    badgeColorClass: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    address: 'حي المغرزات، داخل مدارس رواد الخليج (بوابة 9).',
    addressEn: 'Al-Mugharrazat District, inside Rowad Al-Khaleej Schools (Gate 9).',
    googleMapsUrl: 'https://maps.google.com/?q=مركز+رابا+رواد+الخليج+حي+المغرزات+الرياض',
    whatsappUrl: 'https://wa.me/966575100100?text=السلام%20عليكم،%20أود%20الاستفسار%20عن%20خدمات%20ومواعيد%20مركز%20رابا%20-%20فرع%20رواد%20الخليج',
    whatsappNumber: '0575100100',
    phone: '0575100100',
    hoursAr: 'الأحد - الخميس: 8:00 ص - 4:00 م',
    hoursEn: 'Sun - Thu: 8:00 AM - 4:00 PM'
  },
  {
    id: 'branch-alkharj',
    name: 'مركز رابا (الخرج)',
    nameEn: 'Raba Center (Al-Kharj)',
    city: 'kharj',
    cityNameAr: 'فرع الخرج',
    cityNameEn: 'Al-Kharj Branch',
    regionBadgeAr: 'الخرج',
    regionBadgeEn: 'Al-Kharj',
    badgeColorClass: 'bg-amber-500/25 text-amber-300 border-amber-500/40',
    address: 'حي اليمامة، بمقر جمعية التنمية الأهلية.',
    addressEn: 'Al-Yamamah District, at Al-Kharj Community Development Association.',
    googleMapsUrl: 'https://maps.google.com/?q=مركز+رابا+الخرج+حي+اليمامة+جمعية+التنمية+الأهلية',
    whatsappUrl: 'https://wa.me/966575100100?text=السلام%20عليكم،%20أود%20الاستفسار%20عن%20خدمات%20ومواعيد%20مركز%20رابا%20-%20فرع%20الخرج',
    whatsappNumber: '0575100100',
    phone: '0575100100',
    hoursAr: 'الأحد - الخميس: 8:00 ص - 8:00 م',
    hoursEn: 'Sun - Thu: 8:00 AM - 8:00 PM'
  }
];
