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
  X, 
  Home, 
  Check, 
  ChevronDown, 
  Building2, 
  GraduationCap, 
  HeartHandshake,
  Heart,
  MessageCircle,
  PhoneCall
} from 'lucide-react';
import { Specialist } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getSpecialistLogoTheme } from '../utils/specialistCardThemes';
import { 
  getStoredSpecialistSettings, 
  SpecialistImageSetting, 
  GlobalCardSettings, 
  getStoredGlobalCardSettings, 
  findCustomSettingForDoctor 
} from '../data/specialistCustomizer';
import { getResolvedImageUrl, handleImageErrorWithStore } from '../utils/persistentImageStore';
import { 
  DOCTORS_DATA, 
  Doctor, 
  getUnifiedDoctors, 
  doctorToSpecialist 
} from './DoctorCardSlider';

interface SpecialistsDirectoryPageProps {
  specialists?: Specialist[];
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
  const [selectedExpMin, setSelectedExpMin] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'experience' | 'name'>('recommended');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Dynamic Specialist Image Settings (synced from Admin Dashboard)
  const [customSettings, setCustomSettings] = useState<Record<string, SpecialistImageSetting>>(() => getStoredSpecialistSettings());
  const [globalCardSettings, setGlobalCardSettings] = useState<GlobalCardSettings>(() => getStoredGlobalCardSettings());

  // Interactive user ratings state (synced with homepage slider)
  const [userRatings, setUserRatings] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('raba_user_doctor_ratings');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [doctorRatingDeltas, setDoctorRatingDeltas] = useState<Record<string, { ratingDelta: number; countDelta: number }>>({});
  const [ratingToast, setRatingToast] = useState<{ docId: string; star: number } | null>(null);

  // Favorites state (synced with homepage slider)
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('raba_favorite_doctors');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Cross-component synchronizations
  useEffect(() => {
    const handleSettingsUpdate = (e?: any) => {
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
    const handleRatingUpdate = () => {
      try {
        const saved = localStorage.getItem('raba_user_doctor_ratings');
        if (saved) setUserRatings(JSON.parse(saved));
      } catch {}
    };
    const handleFavUpdate = (e: any) => {
      if (e?.detail) setFavorites(e.detail);
      else {
        try {
          const saved = localStorage.getItem('raba_favorite_doctors');
          if (saved) setFavorites(JSON.parse(saved));
        } catch {}
      }
    };

    window.addEventListener('raba_specialist_settings_updated', handleSettingsUpdate);
    window.addEventListener('raba_global_card_settings_updated', handleGlobalUpdate);
    window.addEventListener('raba_doctor_rating_updated', handleRatingUpdate);
    window.addEventListener('raba_favorite_doctors_updated', handleFavUpdate);
    window.addEventListener('storage', handleSettingsUpdate);
    window.addEventListener('storage', handleFavUpdate);
    window.addEventListener('raba_persistent_sync_ready', handleSettingsUpdate);
    window.addEventListener('raba_persistent_sync_ready', handleGlobalUpdate);

    return () => {
      window.removeEventListener('raba_specialist_settings_updated', handleSettingsUpdate);
      window.removeEventListener('raba_global_card_settings_updated', handleGlobalUpdate);
      window.removeEventListener('raba_doctor_rating_updated', handleRatingUpdate);
      window.removeEventListener('raba_favorite_doctors_updated', handleFavUpdate);
      window.removeEventListener('storage', handleSettingsUpdate);
      window.removeEventListener('storage', handleFavUpdate);
      window.removeEventListener('raba_persistent_sync_ready', handleSettingsUpdate);
      window.removeEventListener('raba_persistent_sync_ready', handleGlobalUpdate);
    };
  }, []);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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

  // Handle rating a doctor
  const handleRateDoctor = (e: React.MouseEvent, docId: string, star: number) => {
    e.stopPropagation();
    const prevStar = userRatings[docId];
    const updated = { ...userRatings, [docId]: star };
    setUserRatings(updated);
    try {
      localStorage.setItem('raba_user_doctor_ratings', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('raba_doctor_rating_updated', { detail: { docId, star } }));
    } catch {}

    setDoctorRatingDeltas((prev) => {
      const doc = effectiveDoctors.find((d) => d.id === docId);
      const baseRating = doc?.rating || 4.9;
      const baseCount = doc?.reviewCount || 100;
      const newCount = prevStar ? baseCount : baseCount + 1;
      const totalPoints = baseRating * baseCount - (prevStar || 0) + star;
      const newRating = Number((totalPoints / newCount).toFixed(2));
      return {
        ...prev,
        [docId]: {
          ratingDelta: newRating - baseRating,
          countDelta: prevStar ? 0 : 1,
        },
      };
    });

    setRatingToast({ docId, star });
    setTimeout(() => {
      setRatingToast((curr) => (curr?.docId === docId ? null : curr));
    }, 2800);
  };

  // Compute unified, deduplicated and priority-sorted doctors: Exactly identical to homepage slider
  const effectiveDoctors = useMemo(() => {
    return getUnifiedDoctors(DOCTORS_DATA, propSpecialists);
  }, [propSpecialists]);

  // Categories definition matching Raba Centers specialties
  const categories = useMemo(() => [
    { id: 'all', labelAr: 'جميع التخصصات', labelEn: 'All Specialties' },
    { id: 'psychology', labelAr: 'الاستشارات النفسية والتشخيص', labelEn: 'Psychology & Diagnostics' },
    { id: 'aba', labelAr: 'تحليل السلوك التطبيقي (ABA)', labelEn: 'ABA Therapy' },
    { id: 'speech', labelAr: 'النطق والتخاطب وتأهيل اللغة', labelEn: 'Speech & Language' },
    { id: 'occupational', labelAr: 'العلاج الوظيفي والتكامل الحسي', labelEn: 'Occupational Therapy' },
  ], []);

  // Compute counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: effectiveDoctors.length,
      psychology: 0,
      aba: 0,
      speech: 0,
      occupational: 0,
    };

    effectiveDoctors.forEach((doc) => {
      const cat = doc.category || '';
      const title = (doc.title || '').toLowerCase();
      const role = (doc.specialty || '').toLowerCase();

      if (cat === 'psychology' || title.includes('نفس') || role.includes('نفس')) {
        counts.psychology++;
      } else if (cat === 'aba' || title.includes('سلوك') || role.includes('سلوك') || title.includes('aba')) {
        counts.aba++;
      } else if (cat === 'speech' || title.includes('نطق') || role.includes('نطق') || title.includes('تخاطب') || role.includes('تخاطب')) {
        counts.speech++;
      } else if (cat === 'occupational' || title.includes('وظيفي') || role.includes('وظيفي') || title.includes('حركي')) {
        counts.occupational++;
      }
    });

    return counts;
  }, [effectiveDoctors]);

  // Filtered & Sorted Doctors
  const filteredDoctors = useMemo(() => {
    return effectiveDoctors.filter((doc) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const nameMatch = doc.name.toLowerCase().includes(query) || (doc.nameEn && doc.nameEn.toLowerCase().includes(query));
        const titleMatch = doc.title.toLowerCase().includes(query) || (doc.titleEn && doc.titleEn.toLowerCase().includes(query));
        const roleMatch = (doc.specialty || '').toLowerCase().includes(query) || ((doc.specialtyEn || '').toLowerCase().includes(query));
        const codeMatch = (doc.specialtyCode || '').toLowerCase().includes(query);
        const bioMatch = (doc.bio || '').toLowerCase().includes(query);
        const tagsMatch = doc.tags && doc.tags.some((t) => t.toLowerCase().includes(query));
        if (!nameMatch && !titleMatch && !roleMatch && !codeMatch && !bioMatch && !tagsMatch) {
          return false;
        }
      }

      // 2. Specialty Category Filter
      if (selectedCategory !== 'all') {
        const cat = (doc.category || '').toLowerCase();
        const title = (doc.title || '').toLowerCase();
        const role = (doc.specialty || '').toLowerCase();

        if (selectedCategory === 'psychology') {
          if (!cat.includes('psychology') && !title.includes('نفس') && !role.includes('نفس')) return false;
        } else if (selectedCategory === 'aba') {
          if (!cat.includes('aba') && !title.includes('سلوك') && !role.includes('سلوك') && !title.includes('aba')) return false;
        } else if (selectedCategory === 'speech') {
          if (!cat.includes('speech') && !title.includes('نطق') && !role.includes('نطق') && !title.includes('تخاطب') && !role.includes('تخاطب')) return false;
        } else if (selectedCategory === 'occupational') {
          if (!cat.includes('occupational') && !title.includes('وظيفي') && !role.includes('وظيفي') && !title.includes('حركي')) return false;
        }
      }

      // 3. Minimum Experience Filter
      if (selectedExpMin > 0 && doc.experienceYears < selectedExpMin) {
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
  }, [effectiveDoctors, searchQuery, selectedCategory, selectedExpMin, sortBy]);

  const activeFiltersCount = (selectedCategory !== 'all' ? 1 : 0) + 
                             (selectedExpMin > 0 ? 1 : 0) + 
                             (searchQuery.trim() ? 1 : 0);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedExpMin(0);
    setSortBy('recommended');
  };

  // Convert Doctor to Specialist for CV modal and booking
  const handleViewCvClick = (doctor: Doctor) => {
    onViewCv(doctorToSpecialist(doctor, propSpecialists));
  };

  const handleBookClick = (doctor: Doctor) => {
    onBookSpecialist(doctorToSpecialist(doctor, propSpecialists));
  };

  // Build WhatsApp quick chat URL
  const getWhatsAppUrl = (doctor: Doctor) => {
    const text = isArabic
      ? `السلام عليكم، أود الاستفسار عن حجز موعد كشف واستشارة مع الأخصائي: ${doctor.name} (${doctor.specialty || doctor.title}) في مركز رابا.`
      : `Hello, I would like to inquire about booking a consultation with specialist: ${doctor.nameEn || doctor.name} at RABA Center.`;
    return `https://wa.me/966508803777?text=${encodeURIComponent(text)}`;
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 border border-[#0d5c52]/20 dark:border-[#2dd4bf]/20 text-[#0d5c52] dark:text-[#2dd4bf] text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isArabic ? 'نخبة الكفاءات الطبية والتأهيلية المعتمدة' : 'Certified Clinical Specialists & Experts'}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#0f2d29] dark:text-white tracking-tight leading-tight">
              {isArabic ? 'دليل الأخصائيين والكوادر الإكلينيكية' : 'Clinical Specialists Directory'}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {isArabic 
                ? 'تعرّف على نخبة الأخصائيين والاستشاريين المعتمدين في مراكز رابا في مجالات تحليل السلوك التطبيقي (ABA)، النطق والتخاطب، العلاج الوظيفي، والتأهيل النفسي، مع إمكانية استعراض السير الذاتية وحجز مواعيد التقييم.'
                : 'Browse our elite team of licensed consultants and therapists at RABA Centers across ABA, Speech Therapy, Occupational Therapy, and Clinical Psychology.'}
            </p>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-1.5 bg-white/80 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-2xs">
                <UserCheck className="w-4 h-4 text-[#0d5c52] dark:text-[#2dd4bf]" />
                <span>{effectiveDoctors.length} {isArabic ? 'أخصائي واستشاري معتمد' : 'Licensed Specialists'}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/80 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-2xs">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{isArabic ? 'تراخيص الهيئة السعودية للتخصصات الصحية (SCFHS)' : 'SCFHS Licensed'}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/80 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-2xs">
                <Building2 className="w-4 h-4 text-sky-500" />
                <span>{isArabic ? 'فروع الرياض: النرجس والمغرزات' : 'Riyadh: Al-Narjis & Mugharrazat'}</span>
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. STICKY FILTER & SEARCH TOOLBAR */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 sticky top-[57px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          
          {/* Top Row: Search Input + Sort + View Mode (List vs Grid) */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search bar */}
            <div className="relative flex-1 max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isArabic ? 'ابحث بالاسم، التخصص، الكفاءة السريرية، أو الكلمات المفتاحية...' : 'Search by name, specialty, bio, or credentials...'}
                className="w-full bg-slate-100/90 dark:bg-slate-800/90 text-slate-900 dark:text-white rounded-2xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5c52] dark:focus:ring-[#2dd4bf] border border-slate-200 dark:border-white/10 transition-all placeholder:text-slate-400"
              />
              <Search className={`w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-4' : 'left-4'}`} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'left-3' : 'right-3'} p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-colors cursor-pointer`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Right Controls: Sort & View Mode Toggle */}
            <div className="flex items-center gap-2 self-end md:self-auto shrink-0 flex-wrap">
              
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#0d5c52] dark:text-[#2dd4bf]" />
                  <span>
                    {sortBy === 'recommended' && (isArabic ? 'الترتيب: الموصى به' : 'Sort: Recommended')}
                    {sortBy === 'rating' && (isArabic ? 'الأعلى تقييماً' : 'Highest Rated')}
                    {sortBy === 'experience' && (isArabic ? 'الأكثر خبرة' : 'Most Experienced')}
                    {sortBy === 'name' && (isArabic ? 'أبجدياً (أ-ي)' : 'Alphabetical')}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isSortOpen && (
                  <div className={`absolute top-full mt-2 ${isArabic ? 'left-0' : 'right-0'} w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150`}>
                    {[
                      { id: 'recommended', labelAr: 'الموصى به (الأولوية)', labelEn: 'Recommended' },
                      { id: 'rating', labelAr: 'الأعلى تقييماً', labelEn: 'Highest Rated' },
                      { id: 'experience', labelAr: 'الأكثر خبرة', labelEn: 'Most Experienced' },
                      { id: 'name', labelAr: 'أبجدياً (أ-ي)', labelEn: 'Alphabetical' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSortBy(opt.id as any);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-right px-4 py-2.5 text-xs font-bold flex items-center justify-between hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer ${
                          sortBy === opt.id ? 'text-[#0d5c52] dark:text-[#2dd4bf] bg-slate-50 dark:bg-white/5' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{isArabic ? opt.labelAr : opt.labelEn}</span>
                        {sortBy === opt.id && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Specialty Categories Filter Bar with Real Counts */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#0d5c52] to-[#0f766e] text-white border-transparent shadow-md shadow-teal-900/20'
                      : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10'
                  }`}
                >
                  <span>{isArabic ? cat.labelAr : cat.labelEn}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}

            {/* Clear Filters Button if any filter is active */}
            {activeFiltersCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{isArabic ? 'مسح الفلاتر' : 'Clear Filters'}</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 4. MAIN SPECIALISTS LIST / GRID CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Results Counter Banner */}
        <div className="flex items-center justify-between mb-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <div className="font-bold flex items-center gap-2">
            <span>{isArabic ? 'يتم عرض' : 'Showing'}</span>
            <span className="text-[#0d5c52] dark:text-[#2dd4bf] font-black">{filteredDoctors.length}</span>
            <span>{isArabic ? 'من أصل' : 'of'}</span>
            <span className="font-black text-slate-800 dark:text-slate-200">{effectiveDoctors.length}</span>
            <span>{isArabic ? 'أخصائي معتمد' : 'specialists'}</span>
          </div>
        </div>

        {/* Empty State */}
        {filteredDoctors.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 p-12 text-center max-w-lg mx-auto shadow-sm my-10">
            <div className="w-16 h-16 rounded-2xl bg-[#dff1ec] dark:bg-teal-950/60 text-[#0d5c52] dark:text-[#2dd4bf] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
              {isArabic ? 'لم يتم العثور على أخصائيين يطابقون بحثك' : 'No specialists match your search criteria'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              {isArabic ? 'جرب البحث بكلمات أخرى أو قم بإعادة ضبط خيارات الفلترة لعرض كافة الكوادر.' : 'Try adjusting your search terms or reset the filters.'}
            </p>
            <button
              onClick={resetAllFilters}
              className="px-6 py-2.5 rounded-xl bg-[#0d5c52] hover:bg-[#0f766e] text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              {isArabic ? 'إعادة ضبط خيارات البحث' : 'Reset Search Filters'}
            </button>
          </div>
        ) : (
          /* ==================================================================== */
          /* GRID FORMAT (DEFAULT & EXCLUSIVE VIEW - MATCHING HOMEPAGE SLIDER)   */
          /* ==================================================================== */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredDoctors.map((doctor, index) => {
              const theme = getSpecialistLogoTheme(doctor, index);
              
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
              const isFav = !!favorites[doctor.id];

              return (
                <div
                  key={doctor.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border ${theme.cardBorderHover} shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group relative`}
                >
                  {/* Top Slim Accent Strip in Doctor's Brand/Logo Color */}
                  <div className={`h-1.5 w-full ${theme.topAccentBar}`} />

                  {/* Upper Hero Image Area with Overlaid Badges - Compact on mobile */}
                  <div className={`relative h-44 sm:h-52 md:h-56 overflow-hidden ${theme.photoBg} border-b border-slate-100 dark:border-white/5 transition-colors`}>
                    <img
                      src={activeAvatar}
                      alt={isArabic ? doctor.name : (doctor.nameEn || doctor.name)}
                      width={300}
                      height={224}
                      decoding="async"
                      onError={(e) => {
                        handleImageErrorWithStore(e, rawAvatar, doctor.fallbackAvatar || doctor.avatar);
                      }}
                      className={`w-full h-full ${fitClass} ${posClass} group-hover:scale-105 transition-transform duration-500`}
                      style={{
                        transform: zoomScale !== 1 ? `scale(${zoomScale})` : undefined
                      }}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />

                    {/* Top Left Badge: TOP RATED */}
                    {isTop && (
                      <div className="absolute top-2 sm:top-2.5 left-2 sm:left-2.5 z-10">
                        <span className="bg-white/95 dark:bg-slate-950/90 backdrop-blur-xs text-slate-900 dark:text-white text-[8.5px] sm:text-[9px] font-black tracking-wider px-2 py-0.5 sm:px-2.5 rounded-full shadow-md uppercase">
                          {isArabic ? 'الأعلى تقييماً' : 'TOP RATED'}
                        </span>
                      </div>
                    )}

                    {/* Top Right Heart / Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(e, doctor.id)}
                      aria-label="Save to favorites"
                      className="absolute top-2 sm:top-2.5 right-2 sm:right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 dark:bg-slate-900/90 shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer text-slate-700 dark:text-slate-200 hover:text-rose-500"
                    >
                      <Heart 
                        className={`w-3.5 h-3.5 transition-colors ${
                          isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-600 dark:text-slate-300'
                        }`} 
                      />
                    </button>
                  </div>

                  {/* Card Body - Tight, organized padding without excessive dead space */}
                  <div className="p-3 sm:p-5 flex-1 flex flex-col">
                    <div>
                      {/* Specialty Code & Rating */}
                      <div className="flex items-center justify-between gap-1 mb-1.5 sm:mb-2">
                        <span className={`text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider truncate max-w-[70%] px-2 py-0.5 rounded-lg ${theme.specialtyBadge}`}>
                          {isArabic ? doctor.specialtyCode : (doctor.specialtyCodeEn || doctor.specialtyCode)}
                        </span>

                        <span className="flex items-center gap-0.5 bg-amber-400/10 text-slate-900 dark:text-amber-300 px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-black">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{(displayRating || 4.9).toFixed(1)}</span>
                        </span>
                      </div>

                      {/* Doctor Name */}
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-snug mb-0.5 sm:mb-1 truncate">
                        {isArabic ? doctor.name : (doctor.nameEn || doctor.name)}
                      </h3>

                      <p className="text-xs font-bold text-[#0d5c52] dark:text-[#2dd4bf] mb-2 sm:mb-3 truncate">
                        {isArabic ? (doctor.specialty || doctor.title) : (doctor.specialtyEn || doctor.titleEn || doctor.title)}
                      </p>

                      {/* 3-Column Metrics Row */}
                      <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-white/10 rtl:divide-x-reverse py-1.5 sm:py-2 border-y border-slate-100 dark:border-white/10 mb-2 sm:mb-3 text-center">
                        <div className="px-0.5">
                          <span className={`text-sm sm:text-base font-black block font-sans ${theme.expMetricColor}`}>
                            {doctor.experienceYears}
                          </span>
                          <span className="text-[7.5px] sm:text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mt-0.5">
                            {isArabic ? 'سنوات خبرة' : 'EXP'}
                          </span>
                        </div>

                        <div className="px-0.5">
                          <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white block font-sans">
                            {displayReviewCount}
                          </span>
                          <span className="text-[7.5px] sm:text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mt-0.5">
                            {isArabic ? 'تقييم' : 'REVIEWS'}
                          </span>
                        </div>

                        <div className="px-0.5">
                          <span className="text-sm sm:text-base font-black text-amber-500 dark:text-amber-400 flex items-center justify-center gap-0.5 font-sans">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{(displayRating || 4.9).toFixed(1)}</span>
                          </span>
                          <span className="text-[7.5px] sm:text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mt-0.5">
                            {isArabic ? 'تقييم' : 'RATING'}
                          </span>
                        </div>
                      </div>

                      {/* Bio Snippet */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-2.5 sm:mb-4">
                        {doctor.bio}
                      </p>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="mt-auto pt-2 flex items-center gap-1.5 sm:gap-2">
                      <button
                        onClick={() => handleBookClick(doctor)}
                        className={`flex-1 ${theme.bookButton} font-black py-2 sm:py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95`}
                      >
                        <CalendarCheck className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'احجز موعد' : 'Book'}</span>
                      </button>

                      <button
                        onClick={() => handleViewCvClick(doctor)}
                        className={`px-2.5 sm:px-3 py-2 sm:py-2.5 ${theme.cvButton} border rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95`}
                        title={isArabic ? 'السيرة الذاتية' : 'View CV'}
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={getWhatsAppUrl(doctor)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 sm:p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center cursor-pointer active:scale-95"
                        title={isArabic ? 'واتساب' : 'WhatsApp'}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. BOTTOM CONSULTATION HOOK BANNER */}
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
                  ? 'فريق الاستشارات التوجيهية في مركز رابا متاح لمراجعة التقارير السابقة وإرشادك إلى الطبيب أو الأخصائي الأفضل مجاناً.'
                  : 'Our clinical intake team can review your previous reports and guide you to the ideal specialist free of charge.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (filteredDoctors.length > 0) {
                handleBookClick(filteredDoctors[0]);
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
