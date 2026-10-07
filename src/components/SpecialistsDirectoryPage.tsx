import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Star, 
  Award, 
  Clock, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  UserCheck, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  FileText, 
  CalendarCheck, 
  LayoutList, 
  LayoutGrid, 
  X, 
  Home,
  Check,
  ChevronDown,
  Building2,
  GraduationCap,
  HeartHandshake
} from 'lucide-react';
import { Specialist } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getSpecialistLogoTheme } from '../utils/specialistCardThemes';
import { deduplicateSpecialists, sortSpecialistsByPriority } from '../utils/specialistDeduplication';
import { getSpecialistImageSetting } from '../data/specialistCustomizer';
import { DOCTORS_DATA, Doctor } from './DoctorCardSlider';

interface SpecialistsDirectoryPageProps {
  specialists: Specialist[];
  onBackToHome: () => void;
  onViewCv: (specialist: Specialist) => void;
  onBookSpecialist: (specialist: Specialist) => void;
}

export const SpecialistsDirectoryPage: React.FC<SpecialistsDirectoryPageProps> = ({
  specialists: propSpecialists,
  onBackToHome,
  onViewCv,
  onBookSpecialist,
}) => {
  const { isArabic } = useLanguage();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedExpMin, setSelectedExpMin] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'experience' | 'name'>('recommended');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list'); // Default to list view as requested!
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Merge prop specialists with fallback doctors if needed to ensure complete directory
  const allSpecialists = useMemo(() => {
    const list = propSpecialists && propSpecialists.length > 0 ? propSpecialists : [];
    
    // Normalize and supplement from DOCTORS_DATA if any doctor is missing
    const supplemented: Specialist[] = [...list];
    const existingNames = new Set(supplemented.map(s => s.name.trim().toLowerCase()));

    DOCTORS_DATA.forEach((doc) => {
      if (!existingNames.has(doc.name.trim().toLowerCase())) {
        supplemented.push({
          id: doc.id.startsWith('spec-') ? doc.id : `spec-${doc.id.replace('doc-', '')}`,
          name: doc.name,
          nameEn: doc.nameEn || doc.name,
          role: doc.specialty || doc.title,
          roleEn: doc.specialtyEn || doc.titleEn || doc.title,
          title: doc.title,
          titleEn: doc.titleEn || doc.title,
          licenseNumber: '',
          category: doc.category,
          avatar: doc.avatar,
          rating: doc.rating || 4.9,
          reviewsCount: doc.reviewCount || 120,
          experienceYears: doc.experienceYears || 6,
          education: ['بكالوريوس في علوم التأهيل والرعاية الطبية التطبيقية'],
          educationEn: ['Bachelor in Applied Medical & Rehabilitation Sciences'],
          certifications: ['ترخيص الهيئة السعودية للتخصصات الصحية'],
          certificationsEn: ['Saudi Commission for Health Specialties License'],
          specialties: doc.tags || ['تأهيل متخصص', 'تدخل مبكر'],
          specialtiesEn: ['Specialized Rehabilitation', 'Early Intervention'],
          availableDays: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
          availableDaysEn: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          sessionPrice: 0,
          bio: doc.bio || 'أخصائي معتمد في مركز رابا للرعاية النهارية وتأهيل ذوي الإعاقة، يمتلك خبرة سريرية متقدمة في تطبيق برامج التأهيل الفردية.',
          bioEn: 'Certified specialist at Raba Center with clinical experience in personalized therapy programs.'
        });
      }
    });

    return sortSpecialistsByPriority(deduplicateSpecialists(supplemented));
  }, [propSpecialists]);

  // Categories definition
  const categories = useMemo(() => [
    { id: 'all', labelAr: 'جميع التخصصات', labelEn: 'All Specialties' },
    { id: 'psychology', labelAr: 'الاستشارات النفسية والتشخيص', labelEn: 'Psychology & Assessment' },
    { id: 'aba', labelAr: 'تحليل السلوك التطبيقي (ABA)', labelEn: 'ABA Therapy' },
    { id: 'speech', labelAr: 'النطق والتخاطب وتأهيل اللغة', labelEn: 'Speech & Language' },
    { id: 'occupational', labelAr: 'العلاج الوظيفي والتكامل الحسي', labelEn: 'Occupational Therapy' },
    { id: 'special_education', labelAr: 'التربية الخاصة والتهيئة المدرسية', labelEn: 'Special Education' },
  ], []);

  // Compute counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allSpecialists.length };
    categories.forEach(c => {
      if (c.id !== 'all') counts[c.id] = 0;
    });

    allSpecialists.forEach(spec => {
      const cat = (spec.category || '').toLowerCase();
      const title = (spec.title || '').toLowerCase();
      const role = (spec.role || '').toLowerCase();

      if (cat === 'psychology' || title.includes('نفس') || role.includes('نفس')) {
        counts.psychology = (counts.psychology || 0) + 1;
      } else if (cat === 'aba' || title.includes('سلوك') || role.includes('سلوك') || title.includes('aba')) {
        counts.aba = (counts.aba || 0) + 1;
      } else if (cat === 'speech' || title.includes('نطق') || role.includes('نطق') || title.includes('تخاطب') || role.includes('تخاطب')) {
        counts.speech = (counts.speech || 0) + 1;
      } else if (cat === 'occupational' || title.includes('وظيفي') || role.includes('وظيفي') || title.includes('حركي')) {
        counts.occupational = (counts.occupational || 0) + 1;
      } else if (cat === 'special_education' || title.includes('تربية') || role.includes('تربية') || title.includes('دمج')) {
        counts.special_education = (counts.special_education || 0) + 1;
      }
    });

    return counts;
  }, [allSpecialists, categories]);

  // Branches list
  const branches = [
    { id: 'all', labelAr: 'كافة الفروع', labelEn: 'All Branches' },
    { id: 'narjis', labelAr: 'فرع النرجس (شمال الرياض)', labelEn: 'Al-Narjis (North Riyadh)' },
    { id: 'mugharrazat', labelAr: 'فرع المغرزات (شرق الرياض)', labelEn: 'Al-Mugharrazat (East Riyadh)' },
  ];

  // Filtered & Sorted Specialists
  const filteredSpecialists = useMemo(() => {
    return allSpecialists.filter((spec) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const nameMatch = spec.name.toLowerCase().includes(query) || (spec.nameEn && spec.nameEn.toLowerCase().includes(query));
        const titleMatch = spec.title.toLowerCase().includes(query) || (spec.titleEn && spec.titleEn.toLowerCase().includes(query));
        const roleMatch = (spec.role || '').toLowerCase().includes(query) || ((spec.roleEn || '').toLowerCase().includes(query));
        const bioMatch = (spec.bio || '').toLowerCase().includes(query);
        const tagsMatch = spec.specialties && spec.specialties.some(t => t.toLowerCase().includes(query));
        if (!nameMatch && !titleMatch && !roleMatch && !bioMatch && !tagsMatch) {
          return false;
        }
      }

      // 2. Specialty Category Filter
      if (selectedCategory !== 'all') {
        const cat = (spec.category || '').toLowerCase();
        const title = (spec.title || '').toLowerCase();
        const role = (spec.role || '').toLowerCase();

        if (selectedCategory === 'psychology') {
          if (!cat.includes('psychology') && !title.includes('نفس') && !role.includes('نفس')) return false;
        } else if (selectedCategory === 'aba') {
          if (!cat.includes('aba') && !title.includes('سلوك') && !role.includes('سلوك') && !title.includes('aba')) return false;
        } else if (selectedCategory === 'speech') {
          if (!cat.includes('speech') && !title.includes('نطق') && !role.includes('نطق') && !title.includes('تخاطب') && !role.includes('تخاطب')) return false;
        } else if (selectedCategory === 'occupational') {
          if (!cat.includes('occupational') && !title.includes('وظيفي') && !role.includes('وظيفي') && !title.includes('حركي')) return false;
        } else if (selectedCategory === 'special_education') {
          if (!cat.includes('special') && !title.includes('تربية') && !role.includes('تربية') && !title.includes('دمج')) return false;
        }
      }

      // 3. Minimum Experience Filter
      if (selectedExpMin > 0 && spec.experienceYears < selectedExpMin) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === 'experience') {
        return (b.experienceYears || 0) - (a.experienceYears || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name, 'ar');
      }
      // 'recommended': keep default priority sort
      return 0;
    });
  }, [allSpecialists, searchQuery, selectedCategory, selectedExpMin, sortBy]);

  const activeFiltersCount = (selectedCategory !== 'all' ? 1 : 0) + 
                             (selectedBranch !== 'all' ? 1 : 0) + 
                             (selectedExpMin > 0 ? 1 : 0) + 
                             (searchQuery.trim() ? 1 : 0);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBranch('all');
    setSelectedExpMin(0);
    setSortBy('recommended');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#061412] text-slate-900 dark:text-white transition-colors" dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* 1. TOP BREADCRUMB & BACK HEADER BAR */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Breadcrumb path */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 hover:text-[#0d5c52] dark:hover:text-[#2dd4bf] transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{isArabic ? 'الرئيسية' : 'Home'}</span>
            </button>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-slate-900 dark:text-white font-bold">
              {isArabic ? 'دليل الأخصائيين والخبراء' : 'Specialists Directory'}
            </span>
          </nav>

          {/* Back to Home Button */}
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-[#dff1ec] dark:hover:bg-teal-950/60 text-slate-700 dark:text-slate-200 hover:text-[#0d5c52] dark:hover:text-[#2dd4bf] text-xs sm:text-sm font-bold border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
          >
            {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isArabic ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </button>
        </div>
      </div>

      {/* 2. HERO INTRO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#dff1ec]/50 via-transparent to-transparent dark:from-[#08221d] dark:via-transparent pt-10 sm:pt-14 pb-8 sm:pb-12 border-b border-slate-200/80 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-3xl space-y-4">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dff1ec] dark:bg-teal-950/60 border border-[#0d5c52]/20 dark:border-[#2dd4bf]/20 text-[#0d5c52] dark:text-[#2dd4bf] text-xs sm:text-sm font-black shadow-2xs">
              <Sparkles className="w-4 h-4" />
              <span>{isArabic ? 'دليل الكفاءات الإكلينيكية والكوادر المعتمدة' : 'Clinical Faculty & Certified Specialists'}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f2d29] dark:text-white tracking-tight leading-[1.2]">
              {isArabic ? (
                <>
                  نخبة استشاريي وأخصائيي{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d5c52] via-[#0284C7] to-[#0d5c52] dark:from-[#2dd4bf] dark:via-sky-400 dark:to-[#2dd4bf]">
                    مركز رابا للرعاية النهارية
                  </span>
                </>
              ) : (
                'Raba Center Medical & Rehabilitation Specialists'
              )}
            </h1>

            {/* Subtitle description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {isArabic 
                ? 'فريق إكلينيكي وتأهيلي متكامل مرخص رسمياً من الهيئة السعودية للتخصصات الصحية، يقدم خطط علاجية وتأهيلية فردية مقننة مبنية على أحدث الأدلة العلمية في مجالات التوحد وتأخر النمو والتخاطب والعلاج الوظيفي.'
                : 'A multidisciplinary clinical team licensed by the Saudi Commission for Health Specialties (SCFHS), delivering evidence-based therapy programs in Autism, ABA, Speech & Occupational Therapy.'}
            </p>

            {/* Trust Metrics Ribbon */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-2xs">
                <UserCheck className="w-4 h-4 text-[#0d5c52] dark:text-[#2dd4bf]" />
                <span>{allSpecialists.length}+ {isArabic ? 'أخصائي واستشاري معتمد' : 'Specialists'}</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-2xs">
                <Award className="w-4 h-4 text-[#D97706]" />
                <span>{isArabic ? 'تراخيص رسمية من هيئة التخصصات الصحية' : 'SCFHS Licensed'}</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-2xs">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>4.9/5 {isArabic ? 'متوسط تقييم أسر المستفيدين' : 'Average Rating'}</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. FILTERS, SEARCH & VIEW TOOLBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Search Bar + Sort + View Mode Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          
          {/* Real-time Search Input */}
          <div className="relative flex-1 max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isArabic ? 'ابحث باسم الأخصائي، التخصص الدقيق، المؤهل، أو الكلمات المفتاحية...' : 'Search by specialist name, specialty, or qualification...'}
              className="w-full pl-11 pr-4 rtl:pr-11 rtl:pl-4 py-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d5c52] dark:focus:ring-[#2dd4bf] shadow-xs transition-all"
            />
            <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-4' : 'left-4'}`} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`text-slate-400 hover:text-slate-600 dark:hover:text-white absolute top-1/2 -translate-y-1/2 ${isArabic ? 'left-4' : 'right-4'}`}
                aria-label="مسح البحث"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
            
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-3.5 py-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:border-[#0d5c52]/40 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#0d5c52] dark:text-[#2dd4bf]" />
                <span>
                  {sortBy === 'recommended' && (isArabic ? 'الموصى بهم' : 'Recommended')}
                  {sortBy === 'rating' && (isArabic ? 'الأعلى تقييماً' : 'Highest Rated')}
                  {sortBy === 'experience' && (isArabic ? 'الأكثر خبرة' : 'Most Experienced')}
                  {sortBy === 'name' && (isArabic ? 'أبجدياً' : 'Name')}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isSortOpen && (
                <div className={`absolute top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-2xl shadow-xl p-1.5 z-30 ${isArabic ? 'left-0' : 'right-0'}`}>
                  <button
                    onClick={() => { setSortBy('recommended'); setIsSortOpen(false); }}
                    className={`w-full text-right rtl:text-right ltr:text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                      sortBy === 'recommended' ? 'bg-[#dff1ec] dark:bg-teal-950/60 text-[#0d5c52] dark:text-[#2dd4bf]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>{isArabic ? 'الموصى بهم (الافتراضي)' : 'Recommended'}</span>
                    {sortBy === 'recommended' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => { setSortBy('rating'); setIsSortOpen(false); }}
                    className={`w-full text-right rtl:text-right ltr:text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                      sortBy === 'rating' ? 'bg-[#dff1ec] dark:bg-teal-950/60 text-[#0d5c52] dark:text-[#2dd4bf]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>{isArabic ? 'الأعلى تقييماً' : 'Highest Rated'}</span>
                    {sortBy === 'rating' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => { setSortBy('experience'); setIsSortOpen(false); }}
                    className={`w-full text-right rtl:text-right ltr:text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                      sortBy === 'experience' ? 'bg-[#dff1ec] dark:bg-teal-950/60 text-[#0d5c52] dark:text-[#2dd4bf]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>{isArabic ? 'الأكثر خبرة' : 'Most Experienced'}</span>
                    {sortBy === 'experience' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => { setSortBy('name'); setIsSortOpen(false); }}
                    className={`w-full text-right rtl:text-right ltr:text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                      sortBy === 'name' ? 'bg-[#dff1ec] dark:bg-teal-950/60 text-[#0d5c52] dark:text-[#2dd4bf]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>{isArabic ? 'أبجدياً (أ - ي)' : 'Alphabetical'}</span>
                    {sortBy === 'name' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Experience Filter Selector */}
            <select
              value={selectedExpMin}
              onChange={(e) => setSelectedExpMin(Number(e.target.value))}
              className="px-3.5 py-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:border-[#0d5c52]/40 cursor-pointer focus:outline-none"
            >
              <option value={0}>{isArabic ? 'كافة سنوات الخبرة' : 'All Experience'}</option>
              <option value={5}>{isArabic ? '5+ سنوات خبرة' : '5+ Years'}</option>
              <option value={10}>{isArabic ? '10+ سنوات خبرة' : '10+ Years'}</option>
              <option value={15}>{isArabic ? '15+ سنة خبرة' : '15+ Years'}</option>
            </select>

            {/* View Mode Toggle: List (Primary) vs Grid */}
            <div className="bg-white dark:bg-slate-900 p-1 border border-slate-200/90 dark:border-white/10 rounded-2xl flex items-center shadow-xs">
              <button
                onClick={() => setViewMode('list')}
                title={isArabic ? 'عرض القائمة' : 'List View'}
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'list'
                    ? 'bg-[#0d5c52] text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutList className="w-4 h-4" />
                <span className="text-xs font-bold hidden sm:inline">{isArabic ? 'قائمة' : 'List'}</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title={isArabic ? 'عرض الشبكة' : 'Grid View'}
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-[#0d5c52] text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="text-xs font-bold hidden sm:inline">{isArabic ? 'شبكة' : 'Grid'}</span>
              </button>
            </div>

          </div>

        </div>

        {/* 4. SPECIALTY FILTER TABS (فلتر التخصصات) */}
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] ?? 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#0d5c52] to-[#115e59] text-white shadow-md shadow-teal-900/20 font-black scale-[1.02]'
                      : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-white/10 hover:border-[#0d5c52]/40 hover:text-[#0d5c52] dark:hover:text-[#2dd4bf]'
                  }`}
                >
                  <span>{isArabic ? cat.labelAr : cat.labelEn}</span>
                  <span
                    className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold tabular-nums ${
                      isSelected
                        ? 'bg-white/20 text-white'
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

        {/* Active Filters Summary & Result Counter */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200/80 dark:border-white/10 text-xs sm:text-sm">
          <div className="text-slate-600 dark:text-slate-400 font-bold">
            {isArabic 
              ? `عرض ${filteredSpecialists.length} من أصل ${allSpecialists.length} أخصائي متاح`
              : `Showing ${filteredSpecialists.length} of ${allSpecialists.length} Specialists`}
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={resetAllFilters}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>{isArabic ? 'إعادة تعيين جميع الفلاتر' : 'Reset all filters'}</span>
            </button>
          )}
        </div>

        {/* 5. MAIN SPECIALISTS DISPLAY: LIST VIEW (DEFAULT) OR GRID VIEW */}
        {filteredSpecialists.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 p-8 shadow-xs">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
              {isArabic ? 'لم يتم العثور على أخصائيين يطابقون خيارات البحث' : 'No specialists match your search criteria'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              {isArabic 
                ? 'جرب البحث بكلمات أخرى أو اختر تخصصاً مختلفاً من الفلتر بالأعلى للاطلاع على كامل الكادر الطبي.'
                : 'Try searching with different terms or select another specialty from the filters.'}
            </p>
            <button
              onClick={resetAllFilters}
              className="px-6 py-2.5 rounded-xl bg-[#0d5c52] hover:bg-[#093e37] text-white text-xs sm:text-sm font-black transition-all cursor-pointer shadow-md"
            >
              {isArabic ? 'إعادة ضبط خيارات البحث' : 'Reset Search Filters'}
            </button>
          </div>
        ) : viewMode === 'list' ? (
          /* LIST FORMAT (شكل قائمة - AS SPECIFIED IN USER REQUEST) */
          <div className="space-y-4">
            {filteredSpecialists.map((spec, index) => {
              const theme = getSpecialistLogoTheme(spec, index);
              const setting = getSpecialistImageSetting(spec.id);
              const activeAvatar = setting?.avatar || spec.avatar;

              return (
                <div
                  key={spec.id}
                  className={`bg-white dark:bg-slate-900 rounded-3xl border ${theme.cardBorderHover} shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden relative group`}
                >
                  {/* Top colored accent bar matching Logo Identity Theme */}
                  <div className={`h-1.5 w-full ${theme.topAccentBar}`} />

                  <div className="p-5 sm:p-7 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    
                    {/* Left & Middle Container (Avatar + Info) */}
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 flex-1 w-full">
                      
                      {/* Avatar with Badges */}
                      <div className="relative shrink-0 self-center sm:self-start">
                        <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ${theme.photoBg} border-2 border-slate-100 dark:border-white/10 shadow-sm relative group-hover:scale-105 transition-transform duration-300`}>
                          <img
                            src={activeAvatar}
                            alt={spec.name}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/specialists/spec_haneen_obaidi_1790197216150.jpg';
                            }}
                          />
                        </div>

                        {/* Verified SCFHS Check Badge */}
                        <div 
                          className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 rounded-full p-1 shadow-md border border-slate-200 dark:border-white/10"
                          title={isArabic ? 'مرخص من الهيئة السعودية للتخصصات الصحية' : 'SCFHS Licensed'}
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#0d5c52] dark:text-[#2dd4bf] fill-white dark:fill-slate-900" />
                        </div>
                      </div>

                      {/* Specialist Metadata & Clinical Bio */}
                      <div className="space-y-2.5 flex-1 min-w-0">
                        
                        {/* Top Tag Row: Category + Experience + Rating */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[11px] font-black px-3 py-1 rounded-xl shadow-2xs ${theme.specialtyBadge}`}>
                            {spec.title || (isArabic ? 'أخصائي معتمد' : 'Specialist')}
                          </span>

                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-xl flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#0d5c52] dark:text-[#2dd4bf]" />
                            <span>{spec.experienceYears}+ {isArabic ? 'سنوات خبرة إكلينيكية' : 'Years Experience'}</span>
                          </span>

                          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{spec.rating || 4.9}</span>
                            <span className="text-slate-400">({spec.reviewsCount || 120} {isArabic ? 'تقييم' : 'reviews'})</span>
                          </span>
                        </div>

                        {/* Specialist Name */}
                        <div>
                          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                            {spec.name}
                          </h2>
                          {spec.nameEn && spec.nameEn !== spec.name && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                              {spec.nameEn}
                            </p>
                          )}
                        </div>

                        {/* Professional Role / Department */}
                        <p className="text-xs sm:text-sm font-bold text-[#0d5c52] dark:text-[#2dd4bf]">
                          {spec.role || spec.title}
                        </p>

                        {/* Clinical Bio / Summary */}
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 sm:line-clamp-3">
                          {spec.bio}
                        </p>

                        {/* Specialization Tags & Branch Note */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {spec.specialties && spec.specialties.slice(0, 4).map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-lg border border-slate-200/60 dark:border-white/5"
                            >
                              #{tag}
                            </span>
                          ))}
                          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mr-2 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#0d5c52] dark:text-[#2dd4bf]" />
                            <span>{isArabic ? 'فروع الرياض (النرجس والمغرزات)' : 'Riyadh Branches'}</span>
                          </span>
                        </div>

                      </div>

                    </div>

                    {/* Right Actions Column (Buttons: CV & Book) */}
                    <div className="flex flex-row lg:flex-col items-center justify-end gap-2.5 w-full lg:w-48 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-white/10">
                      
                      {/* Book Appointment Button */}
                      <button
                        onClick={() => onBookSpecialist(spec)}
                        className={`w-full ${theme.bookButton} font-black py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all duration-200`}
                      >
                        <CalendarCheck className="w-4 h-4" />
                        <span>{isArabic ? 'احجز موعد كشف' : 'Book Appointment'}</span>
                      </button>

                      {/* View CV Button */}
                      <button
                        onClick={() => onViewCv(spec)}
                        className={`w-full ${theme.cvButton} font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 border cursor-pointer transition-all duration-200`}
                      >
                        <FileText className="w-4 h-4" />
                        <span>{isArabic ? 'السيرة الذاتية' : 'View Profile'}</span>
                      </button>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* GRID VIEW (Alternative View Mode) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSpecialists.map((spec, index) => {
              const theme = getSpecialistLogoTheme(spec, index);
              const setting = getSpecialistImageSetting(spec.id);
              const activeAvatar = setting?.avatar || spec.avatar;

              return (
                <div
                  key={spec.id}
                  className={`bg-white dark:bg-slate-900 rounded-3xl border ${theme.cardBorderHover} shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group relative`}
                >
                  <div className={`h-1.5 w-full ${theme.topAccentBar}`} />

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Top Avatar */}
                    <div className="relative w-28 h-28 mx-auto mb-4">
                      <div className={`w-full h-full rounded-2xl overflow-hidden ${theme.photoBg} border-2 border-slate-100 dark:border-white/10 shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                        <img
                          src={activeAvatar}
                          alt={spec.name}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/specialists/spec_haneen_obaidi_1790197216150.jpg';
                          }}
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-1 shadow-md border border-slate-200 dark:border-white/10">
                        <CheckCircle2 className="w-4 h-4 text-[#0d5c52] dark:text-[#2dd4bf]" />
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="text-center space-y-1.5 mb-4">
                      <span className={`inline-block text-[11px] font-black px-3 py-0.5 rounded-xl ${theme.specialtyBadge}`}>
                        {spec.title || (isArabic ? 'أخصائي معتمد' : 'Specialist')}
                      </span>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        {spec.name}
                      </h3>
                      <p className="text-xs font-bold text-[#0d5c52] dark:text-[#2dd4bf]">
                        {spec.role}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 text-center mb-4 leading-relaxed">
                      {spec.bio}
                    </p>

                    <div className="mt-auto pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-bold">
                        <Clock className="w-3.5 h-3.5 text-[#0d5c52]" />
                        {spec.experienceYears}+ {isArabic ? 'سنوات' : 'yrs'}
                      </span>
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {spec.rating || 4.9}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="p-4 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-white/10 flex items-center gap-2">
                    <button
                      onClick={() => onBookSpecialist(spec)}
                      className={`flex-1 ${theme.bookButton} py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1 cursor-pointer`}
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'حجز موعد' : 'Book'}</span>
                    </button>
                    <button
                      onClick={() => onViewCv(spec)}
                      className={`px-3 py-2.5 ${theme.cvButton} border rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer`}
                      title={isArabic ? 'السيرة الذاتية' : 'CV'}
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* 6. BOTTOM CONSULTATION HOOK BANNER */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl border border-[#0d5c52]/20 dark:border-[#2dd4bf]/20 bg-gradient-to-r from-[#dff1ec]/70 via-white dark:via-slate-900 to-[#dff1ec]/40 dark:from-teal-950/40 dark:to-slate-900 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0d5c52] to-[#14b8a6] text-white flex items-center justify-center shrink-0 shadow-md">
              <HeartHandshake className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#0f2d29] dark:text-white">
                {isArabic ? 'هل تحتاج لمساعدة في اختيار الأخصائي الأنسب لحالة طفلك؟' : 'Need help selecting the best specialist for your child?'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                {isArabic 
                  ? 'فريق الاستشارات التوجيهية في مركز رابا متاح لمراجعة التقارير السابقة وإرشادك إلى الطبيب أو الأخصائي الأفضل.'
                  : 'Our clinical intake team can review your previous reports and guide you to the ideal specialist.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (filteredSpecialists.length > 0) {
                onBookSpecialist(filteredSpecialists[0]);
              }
            }}
            className="w-full md:w-auto shrink-0 bg-gradient-to-r from-[#0d5c52] via-[#0f766e] to-[#115e59] hover:brightness-110 active:scale-95 text-white font-black px-6 sm:px-8 py-3.5 rounded-2xl shadow-lg shadow-teal-900/25 transition-all text-sm cursor-pointer text-center"
          >
            {isArabic ? 'طلب استشارة توجيهية فورية' : 'Request Triage Consultation'}
          </button>
        </div>

      </div>

    </div>
  );
};

export default SpecialistsDirectoryPage;
