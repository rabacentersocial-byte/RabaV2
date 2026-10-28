import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Gift, 
  Sparkles, 
  Tag, 
  Calendar, 
  Clock, 
  Copy, 
  Check, 
  Percent, 
  Phone, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight, 
  ArrowLeft, 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
  Home, 
  CheckCircle2, 
  Share2, 
  X, 
  Award, 
  ShieldCheck, 
  HeartHandshake, 
  CalendarDays, 
  Users, 
  MapPin, 
  MessageCircle,
  Flame,
  Star,
  CalendarCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SaudiNationalDayBadge, SaudiFalconGraphic } from './NationalDayVisuals';
import { OfferData } from '../types';
import { getStoredOffers } from '../data/offersData';

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CenterActivity {
  id: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  badgeAr: string;
  badgeEn: string;
  descriptionAr: string;
  descriptionEn: string;
  dateAr: string;
  dateEn: string;
  locationAr: string;
  locationEn: string;
  targetAudienceAr: string;
  targetAudienceEn: string;
  isFree: boolean;
  active: boolean;
  iconType: 'sensory' | 'social' | 'camp' | 'workshop';
}

const CENTER_ACTIVITIES: CenterActivity[] = [
  {
    id: 'act-sensory-workshop',
    titleAr: 'ورشة التكامل الحسي والأنشطة الحركية التفاعلية',
    titleEn: 'Sensory Integration & Interactive Motor Skills Workshop',
    categoryAr: 'أنشطة حركية وحسية',
    categoryEn: 'Motor & Sensory Activities',
    badgeAr: 'نشاط مجاني',
    badgeEn: 'Free Workshop',
    descriptionAr: 'أنشطة تفاعلية مصممة لتحفيز المعالجة الحسية وتطوير المهارات الحركية الدقيقة والكبيرة في بيئة آمنة ومجهزة بالكامل.',
    descriptionEn: 'Interactive activities designed to stimulate sensory processing and gross/fine motor skills development.',
    dateAr: 'السبت والأربعاء أسبوعياً',
    dateEn: 'Every Saturday & Wednesday',
    locationAr: 'فرع النرجس وفرع المغرزات (الرياض)',
    locationEn: 'Al-Narjis & Al-Mugharrazat Branches',
    targetAudienceAr: 'الأطفال من عمر 3 إلى 12 سنة',
    targetAudienceEn: 'Children aged 3-12 years',
    isFree: true,
    active: true,
    iconType: 'sensory'
  },
  {
    id: 'act-social-integration-day',
    titleAr: 'اليوم المفتوح للتواصل والتفاعل الاجتماعي (نادي رابا)',
    titleEn: 'Social Integration & Communication Open Day (Raba Club)',
    categoryAr: 'أنشطة الدمج الاجتماعي',
    categoryEn: 'Social Integration',
    badgeAr: 'فعالية تفاعلية',
    badgeEn: 'Interactive Event',
    descriptionAr: 'فعالية ترفيهية تأهيلية جماعية تهدف إلى تعزيز المهارات الاجتماعية وبناء الصداقات والتواصل اللفظي وغير اللفظي.',
    descriptionEn: 'Recreational and rehabilitation group event fostering peer socialization, friendship building, and communication.',
    dateAr: 'يوم الخميس من كل أسبوع (مسائي)',
    dateEn: 'Every Thursday Evening',
    locationAr: 'جميع فروع مركز ونادي رابا',
    locationEn: 'All Raba Center & Club Branches',
    targetAudienceAr: 'جميع الفئات العمرية والعملاء الجدد',
    targetAudienceEn: 'All age groups & new families',
    isFree: true,
    active: true,
    iconType: 'social'
  },
  {
    id: 'act-skills-summer-camp',
    titleAr: 'مخيم رابا التفاعلي لتنمية مهارات الحياة والاستقلالية',
    titleEn: 'Raba Interactive Life Skills & Independence Camp',
    categoryAr: 'معسكرات مهارات الحياة',
    categoryEn: 'Life Skills Camp',
    badgeAr: 'تسجيل مفتوح',
    badgeEn: 'Registration Open',
    descriptionAr: 'برنامج مكثف يركز على الاعتماد على النفس، الرعاية الذاتية، التعبير عن المشاعر، وحل المشكلات الحياتية اليومية.',
    descriptionEn: 'Intensive program focused on self-reliance, personal care, emotional expression, and daily problem-solving.',
    dateAr: 'جلسات صباحية ومسائية مستمرة',
    dateEn: 'Morning & Evening Daily Tracks',
    locationAr: 'فروع الرياض وجدة والخبر',
    locationEn: 'Riyadh, Jeddah & Khobar Branches',
    targetAudienceAr: 'الأطفال واليافعين',
    targetAudienceEn: 'Children & Adolescents',
    isFree: false,
    active: true,
    iconType: 'camp'
  },
  {
    id: 'act-speech-screening-day',
    titleAr: 'يوم الكشف المبكر والمسح اللغوي والنطقي المجاني',
    titleEn: 'Free Early Language & Speech Screening Day',
    categoryAr: 'تقييم واستشارات',
    categoryEn: 'Assessment & Screening',
    badgeAr: 'استشارة مجانية 100%',
    badgeEn: '100% Free Screening',
    descriptionAr: 'جلسة تقييم أولي مجانية بإشراف أخصائيي النطق والتخاطب المعتمدين لتقييم الحصيلة اللغوية ومخارج الحروف.',
    descriptionEn: 'Free initial screening with certified speech pathologists to evaluate articulation and language acquisition.',
    dateAr: 'طوال أيام الأسبوع بالحجز المسبق',
    dateEn: 'Weekdays with Prior Booking',
    locationAr: 'كافة فروع المملكة',
    locationEn: 'All Branches Across KSA',
    targetAudienceAr: 'الأطفال من عمر سنتين فما فوق',
    targetAudienceEn: 'Children aged 2+ years',
    isFree: true,
    active: true,
    iconType: 'workshop'
  }
];

interface OffersDirectoryPageProps {
  onBackToHome: () => void;
  onClaimOffer?: (offerTitle: string, discountedPrice?: number) => void;
  onOpenBooking?: (notes?: string) => void;
}

export const OffersDirectoryPage: React.FC<OffersDirectoryPageProps> = ({
  onBackToHome,
  onClaimOffer,
  onOpenBooking
}) => {
  const { isArabic, direction } = useLanguage();
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Drag to scroll
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // States
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'national_day' | 'free_day' | 'discounts' | 'activities'>('all');
  
  // Default view mode: slider on mobile, grid on desktop
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 'slider' : 'grid';
    }
    return 'grid';
  });

  // Offers data sync
  const [offersList, setOffersList] = useState<OfferData[]>(() => getStoredOffers());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      setOffersList(getStoredOffers());
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('raba_offers_updated', handleStorage);
    window.addEventListener('raba_persistent_sync_ready' as any, handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('raba_offers_updated', handleStorage);
      window.removeEventListener('raba_persistent_sync_ready' as any, handleStorage);
    };
  }, []);

  // Timers mapped by offer id
  const [countdowns, setCountdowns] = useState<Record<string, Countdown>>({});

  useEffect(() => {
    const updateCountdowns = () => {
      const now = new Date().getTime();
      const updated: Record<string, Countdown> = {};

      offersList.forEach((offer) => {
        const target = new Date(offer.targetDate).getTime();
        const diff = Math.max(0, target - now);

        updated[offer.id] = {
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        };
      });

      setCountdowns(updated);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [offersList]);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => {
      setCopiedCoupon(null);
    }, 2500);
  };

  const handleSharePage = () => {
    const url = window.location.origin + '/#offers';
    if (navigator.share) {
      navigator.share({
        title: isArabic ? 'العروض والأنشطة | مركز رابا للتأهيل' : 'Offers & Activities | Raba Center',
        text: isArabic ? 'استكشف باقة العروض والأنشطة الحصرية بمناسبة اليوم الوطني والفعاليات التأهيلية في مركز رابا' : 'Explore exclusive offers & activities at Raba Center',
        url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const fmt = (n: number | undefined) => (n ?? 0).toString().padStart(2, '0');

  // Slider navigation
  const handleScroll = (direction: 'next' | 'prev') => {
    const el = sliderRef.current;
    if (!el) return;
    const isMobile = window.innerWidth < 640;
    const scrollAmount = isMobile ? (window.innerWidth * 0.78 + 12) : 380;
    
    let delta = scrollAmount;
    if (direction === 'prev') {
      delta = -scrollAmount;
    }
    if (isArabic) {
      delta = -delta;
    }

    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Filtered offers
  const filteredOffers = useMemo(() => {
    return offersList.filter((offer) => {
      if (!offer.active) return false;

      // Filter tab
      if (selectedFilter === 'national_day' && !offer.isNationalDay) return false;
      if (selectedFilter === 'free_day' && offer.discountType !== 'free_day') return false;
      if (selectedFilter === 'discounts' && offer.discountType !== 'percentage') return false;
      if (selectedFilter === 'activities') return false; // Handled in activities section

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (offer.titleAr || '').toLowerCase().includes(q) || (offer.titleEn || '').toLowerCase().includes(q);
        const matchSub = (offer.subtitleAr || '').toLowerCase().includes(q) || (offer.subtitleEn || '').toLowerCase().includes(q);
        const matchDesc = (offer.descriptionAr || '').toLowerCase().includes(q) || (offer.descriptionEn || '').toLowerCase().includes(q);
        const matchCode = (offer.couponCode || '').toLowerCase().includes(q);
        const matchBadge = (offer.badgeAr || '').toLowerCase().includes(q);
        if (!matchTitle && !matchSub && !matchDesc && !matchCode && !matchBadge) return false;
      }

      return true;
    });
  }, [offersList, selectedFilter, searchQuery]);

  // Filtered activities
  const filteredActivities = useMemo(() => {
    if (selectedFilter === 'national_day' || selectedFilter === 'free_day' || selectedFilter === 'discounts') {
      return [];
    }

    return CENTER_ACTIVITIES.filter((act) => {
      if (!act.active) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = act.titleAr.toLowerCase().includes(q) || act.titleEn.toLowerCase().includes(q);
        const matchDesc = act.descriptionAr.toLowerCase().includes(q) || act.descriptionEn.toLowerCase().includes(q);
        const matchCategory = act.categoryAr.toLowerCase().includes(q) || act.categoryEn.toLowerCase().includes(q);
        const matchLocation = act.locationAr.toLowerCase().includes(q) || act.locationEn.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCategory && !matchLocation) return false;
      }
      return true;
    });
  }, [selectedFilter, searchQuery]);

  const activeOffersCount = offersList.filter(o => o.active).length;
  const totalItemsCount = filteredOffers.length + filteredActivities.length;

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-white transition-colors" dir={direction}>
      
      {/* 1. TOP BREADCRUMB & BACK ACTION BAR */}
      <div className="border-b border-white/80 dark:border-white/10 liquid-glass-panel sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
            <button 
              onClick={onBackToHome}
              className="flex items-center gap-1.5 hover:text-[#2E86EB] dark:hover:text-[#2E86EB] transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>{isArabic ? 'الرئيسية' : 'Home'}</span>
            </button>
            <span>/</span>
            <span className="text-[#2E86EB] dark:text-[#2E86EB] font-black">
              {isArabic ? 'العروض والأنشطة' : 'Offers & Activities'}
            </span>
          </div>

          {/* Quick Actions: Share & Back to Home Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSharePage}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title={isArabic ? 'مشاركة الصفحة' : 'Share Page'}
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-[#2E86EB] dark:text-[#2E86EB]" />}
              <span className="hidden sm:inline">{copiedShare ? (isArabic ? 'تم النسخ' : 'Copied') : (isArabic ? 'مشاركة' : 'Share')}</span>
            </button>

            <button
              onClick={onBackToHome}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#2E86EB] to-[#1E3A8A] text-white hover:brightness-110 text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-900/20 active:scale-95"
            >
              {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{isArabic ? 'العودة للرئيسية' : 'Back to Home'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. HERO HEADER SECTION */}
      <section className="relative overflow-hidden py-10 sm:py-14 md:py-16 border-b border-slate-200/80 dark:border-white/10 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/40 dark:from-[#112238] dark:via-[#0D1B2A] dark:to-[#08111D]">
        
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-1/4 w-[420px] h-[420px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[420px] h-[420px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-3xl">
            {/* National Day Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-500/30 px-3.5 py-1.5 rounded-full text-[#0D6D54] dark:text-[#52B79A] text-xs font-black tracking-wide uppercase mb-3 shadow-2xs">
              <span className="text-base">🇸🇦</span>
              <span>{isArabic ? 'عروض وتخفيضات اليوم الوطني الـ96 وفعاليات المركز — عزّنا بطبعنا' : 'SAUDI NATIONAL DAY 96 EXCLUSIVE OFFERS & ACTIVITIES'}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-3">
              {isArabic ? (
                <span>
                  العروض والأنشطة<span className="text-[#0D6D54] dark:text-[#00E5BE]">.</span>
                </span>
              ) : (
                <span>
                  Offers & Activities<span className="text-[#0D6D54] dark:text-[#00E5BE]">.</span>
                </span>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-emerald-100/80 leading-relaxed max-w-2xl font-medium mb-6">
              {isArabic
                ? 'دليل العروض والأنشطة التفاعلية في مركز رابا لتأهيل ورعاية الأطفال. استكشف كافة الخصومات الاستثنائية، باقات اليوم المجاني، والفعاليات المجتمعية المنعقدة في فروع المركز.'
                : 'Your comprehensive directory of exclusive offers and interactive activities at RABA Center. Explore special discounts, free days, and community events.'}
            </p>

            {/* Quick Stats Cards */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-1.5 bg-white dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 shadow-2xs">
                <Flame className="w-4 h-4 text-emerald-600 dark:text-[#00E5BE]" />
                <span>{activeOffersCount} {isArabic ? 'عروض سارية وحصرية' : 'Live Exclusive Offers'}</span>
              </span>

              <span className="flex items-center gap-1.5 bg-white dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 shadow-2xs">
                <Percent className="w-4 h-4 text-amber-500" />
                <span>{isArabic ? 'خصومات تصل إلى 100% مجاناً' : 'Discounts up to 100% Free'}</span>
              </span>

              <span className="flex items-center gap-1.5 bg-white dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 shadow-2xs">
                <Users className="w-4 h-4 text-sky-500" />
                <span>{CENTER_ACTIVITIES.length} {isArabic ? 'أنشطة وورش عمل تفاعلية' : 'Interactive Activities'}</span>
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* 3. SEARCH & FILTER TOOLBAR */}
      <div className="bg-white/95 dark:bg-[#06241d]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 sticky top-14 sm:top-16 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
          
          {/* Top Row: Search input + View Mode Switcher */}
          <div className="flex flex-row items-center justify-between gap-2 sm:gap-3">
            
            {/* Search Bar */}
            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isArabic ? 'ابحث في العروض، الأنشطة، الكوبونات، أو الفعاليات...' : 'Search offers, activities, coupons, or events...'}
                className="w-full bg-slate-100/90 dark:bg-slate-800/90 text-slate-900 dark:text-white rounded-xl sm:rounded-2xl pl-8 pr-9 sm:pl-10 sm:pr-12 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6D54] dark:focus:ring-[#00E5BE] border border-slate-200 dark:border-white/10 transition-all placeholder:text-slate-400"
              />
              <Search className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-2.5 sm:right-4' : 'left-2.5 sm:left-4'}`} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'left-2 sm:left-3' : 'right-2 sm:right-3'} p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-colors cursor-pointer`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Mode Toggle: Grid vs Slider */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200/80 dark:border-white/10 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-white/15 text-[#0D6D54] dark:text-[#00E5BE] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={isArabic ? 'عرض كشبكة' : 'Grid View'}
              >
                <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{isArabic ? 'شبكة' : 'Grid'}</span>
              </button>

              <button
                onClick={() => setViewMode('slider')}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'slider'
                    ? 'bg-white dark:bg-white/15 text-[#0D6D54] dark:text-[#00E5BE] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={isArabic ? 'عرض كسلايدر' : 'Slider View'}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{isArabic ? 'سلايدر' : 'Slider'}</span>
              </button>
            </div>

          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', labelAr: 'الكل (العروض والأنشطة)', labelEn: 'All' },
              { id: 'national_day', labelAr: 'عروض اليوم الوطني 96', labelEn: 'National Day 96' },
              { id: 'free_day', labelAr: 'يوم مجاني 100%', labelEn: '100% Free Day' },
              { id: 'discounts', labelAr: 'خصومات البرامج', labelEn: 'Program Discounts' },
              { id: 'activities', labelAr: 'الأنشطة والفعاليات التفاعلية', labelEn: 'Center Activities' },
            ].map((tab) => {
              const isSelected = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id as any)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#2E86EB] to-[#1E3A8A] text-white border-transparent shadow-md shadow-blue-900/20'
                      : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10'
                  }`}
                >
                  {isArabic ? tab.labelAr : tab.labelEn}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* 4. MAIN CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* SECTION A: EXCLUSIVE OFFERS */}
        {(selectedFilter !== 'activities') && filteredOffers.length > 0 && (
          <div className="mb-12">
            
            {/* Header with Slider Controls if in slider mode */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[#2E86EB] dark:text-[#2E86EB]" />
                  <span>{isArabic ? 'العروض والخصومات الحصرية' : 'Exclusive Offers & Discounts'}</span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-950/60 text-[#2E86EB] dark:text-[#2E86EB] px-2 py-0.5 rounded-full font-bold">
                    {filteredOffers.length}
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isArabic ? 'عروض معتمدة مع كوبونات خصم فورية وسريعة التطبيق' : 'Verified promotional packages with instant claim vouchers'}
                </p>
              </div>

              {viewMode === 'slider' && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleScroll('prev')}
                    aria-label={isArabic ? 'السابق' : 'Previous'}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-[#1E293B] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    {isArabic ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleScroll('next')}
                    aria-label={isArabic ? 'التالي' : 'Next'}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-[#1E293B] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            {/* Slider or Grid rendering */}
            <div
              ref={sliderRef}
              onMouseDown={viewMode === 'slider' ? handleMouseDown : undefined}
              onMouseMove={viewMode === 'slider' ? handleMouseMove : undefined}
              onMouseUp={viewMode === 'slider' ? handleMouseUp : undefined}
              onMouseLeave={viewMode === 'slider' ? handleMouseUp : undefined}
              className={
                viewMode === 'slider'
                  ? `flex items-stretch gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4 pt-1 ${
                      isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
                    }`
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6'
              }
            >
              {filteredOffers.map((offer) => {
                const cd = countdowns[offer.id] || { days: 0, hours: 0, minutes: 0, seconds: 0 };
                const isFreeDay = offer.discountType === 'free_day';
                const styling = offer.styling || {};
                const bgGradient = styling.bgGradientFrom 
                  ? `linear-gradient(135deg, ${styling.bgGradientFrom} 0%, ${styling.bgGradientVia || styling.bgGradientFrom} 50%, ${styling.bgGradientTo || styling.bgGradientFrom} 100%)`
                  : undefined;
                const borderColor = styling.borderColor || 'rgba(16,185,129,0.35)';
                const accentColor = styling.accentColor || '#00E5BE';
                const subcardBg = styling.subcardBg || '#032019';
                const subcardBorder = styling.subcardBorder || 'rgba(16,185,129,0.3)';

                return (
                  <div
                    key={offer.id}
                    className={`relative rounded-3xl p-5 sm:p-7 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl border text-white ${
                      viewMode === 'slider'
                        ? 'shrink-0 w-[86vw] sm:w-[440px] md:w-[480px] snap-center'
                        : 'w-full'
                    }`}
                    style={{
                      background: bgGradient || 'linear-gradient(135deg, #062c22 0%, #093c2f 50%, #041d17 100%)',
                      borderColor: borderColor,
                    }}
                  >
                    {/* Top Ribbon & Header Badges */}
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div className="flex flex-col gap-1.5">
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-black self-start uppercase tracking-wider shadow-sm"
                          style={{
                            backgroundColor: styling.badgeBgColor || accentColor,
                            color: styling.badgeTextColor || '#022c22',
                          }}
                        >
                          {isArabic ? offer.badgeAr : offer.badgeEn}
                        </span>

                        <span className="text-[11px] font-bold text-emerald-200/90 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{isArabic ? offer.dateLabelAr : offer.dateLabelEn}</span>
                        </span>
                      </div>

                      {offer.isNationalDay && (
                        <div className="shrink-0 flex items-center gap-1.5 bg-black/40 border border-emerald-500/30 px-2 py-1 rounded-xl">
                          <SaudiNationalDayBadge className="h-8" />
                        </div>
                      )}
                    </div>

                    {/* Middle Info */}
                    <div className="mb-6">
                      <h3 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">
                        {isArabic ? offer.titleAr : offer.titleEn}
                      </h3>
                      <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium mb-4">
                        {isArabic ? offer.descriptionAr : offer.descriptionEn}
                      </p>

                      {/* Terms Bullet Points */}
                      {offer.terms && offer.terms.length > 0 && (
                        <div 
                          className="rounded-2xl p-3 sm:p-3.5 mb-4 space-y-1.5"
                          style={{
                            backgroundColor: subcardBg,
                            border: `1px solid ${subcardBorder}`
                          }}
                        >
                          <span className="text-[10px] font-black text-emerald-300 block mb-1">
                            {isArabic ? 'شروط ومزايا العرض:' : 'Terms & Benefits:'}
                          </span>
                          {offer.terms.map((t, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="text-[11px] sm:text-xs leading-relaxed">
                                {isArabic ? t.textAr : t.textEn}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Coupon Code Pill */}
                      {offer.couponCode && (
                        <div className="flex items-center justify-between gap-2 bg-black/40 border border-white/10 rounded-xl px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs text-slate-300">{isArabic ? 'كود الكوبون:' : 'Coupon Code:'}</span>
                            <span className="font-mono font-black text-sm text-[#00E5BE] tracking-wider">
                              {offer.couponCode}
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopyCoupon(offer.couponCode!)}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            {copiedCoupon === offer.couponCode ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 text-[10px]">{isArabic ? 'تم النسخ' : 'Copied'}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span className="text-[10px]">{isArabic ? 'نسخ' : 'Copy'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Bottom Countdown & Action CTA */}
                    <div className="pt-4 border-t border-white/10">
                      
                      {offer.showCountdown && (
                        <div className="mb-4">
                          <span className="text-[10px] font-bold text-emerald-300/80 block mb-1.5">
                            {isArabic ? 'الوقت المتبقي حتى انتهاء العرض:' : 'Time Left:'}
                          </span>
                          <div className="grid grid-cols-4 gap-2 text-center" dir="ltr">
                            {[
                              { label: isArabic ? 'يوم' : 'D', val: cd.days },
                              { label: isArabic ? 'ساعة' : 'H', val: cd.hours },
                              { label: isArabic ? 'دقيقة' : 'M', val: cd.minutes },
                              { label: isArabic ? 'ثانية' : 'S', val: cd.seconds },
                            ].map((unit, uIdx) => (
                              <div key={uIdx} className="bg-black/35 rounded-xl p-1.5 border border-white/10">
                                <span className="font-mono text-base sm:text-lg font-black text-[#00E5BE] block leading-tight">
                                  {fmt(unit.val)}
                                </span>
                                <span className="text-[9px] text-slate-300 font-bold block">
                                  {unit.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          if (onClaimOffer) {
                            onClaimOffer(offer.titleAr);
                          } else if (onOpenBooking) {
                            onOpenBooking(`استفادة من عرض: ${offer.titleAr} (كوبون: ${offer.couponCode || 'مباشر'})`);
                          }
                        }}
                        className="w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 hover:brightness-110"
                        style={{
                          backgroundColor: styling.accentColor || '#00E5BE',
                          color: '#022c22'
                        }}
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{isArabic ? (offer.claimButtonTextAr || 'احصل على العرض الآن') : 'Claim This Offer'}</span>
                      </button>

                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* SECTION B: CENTER INTERACTIVE ACTIVITIES */}
        {(selectedFilter === 'all' || selectedFilter === 'activities') && filteredActivities.length > 0 && (
          <div className="mb-14">
            
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0D6D54] dark:text-[#00E5BE]" />
                <span>{isArabic ? 'الأنشطة والفعاليات التأهيلية التفاعلية' : 'Interactive Center Activities & Events'}</span>
                <span className="text-xs bg-teal-100 dark:bg-teal-950/60 text-[#0D6D54] dark:text-[#00E5BE] px-2 py-0.5 rounded-full font-bold">
                  {filteredActivities.length}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isArabic ? 'ورش عمل وفعاليات حضورية مصممة لتعزيز المهارات الحركية والتفاعل الاجتماعي' : 'In-person workshops and community events enhancing motor skills and social communication'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="bg-white dark:bg-[#111827] rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Activity Top Meta */}
                    <div className="flex items-center justify-between gap-3 mb-3.5">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-50 dark:bg-blue-950/60 text-[#2E86EB] dark:text-[#2E86EB] border border-blue-200/60 dark:border-blue-800/40">
                        {isArabic ? act.categoryAr : act.categoryEn}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${
                        act.isFree 
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40'
                      }`}>
                        {isArabic ? act.badgeAr : act.badgeEn}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                      {isArabic ? act.titleAr : act.titleEn}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-4">
                      {isArabic ? act.descriptionAr : act.descriptionEn}
                    </p>

                    {/* Schedule & Location Details */}
                    <div className="bg-slate-50 dark:bg-[#112238] rounded-2xl p-3 sm:p-3.5 mb-5 space-y-2 border border-slate-200/60 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#2E86EB] dark:text-[#2E86EB] shrink-0" />
                        <span className="font-bold">{isArabic ? act.dateAr : act.dateEn}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{isArabic ? act.locationAr : act.locationEn}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                        <span>{isArabic ? act.targetAudienceAr : act.targetAudienceEn}</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking CTA Button */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        if (onOpenBooking) {
                          onOpenBooking(`تسجيل في فعالية: ${act.titleAr} (${act.dateAr})`);
                        }
                      }}
                      className="flex-1 py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-[#0D6D54] to-[#0f766e] text-white hover:brightness-110 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-teal-900/20 active:scale-95"
                    >
                      <CalendarCheck className="w-4 h-4" />
                      <span>{isArabic ? 'تسجيل مقعد بالنشاط' : 'Register for Activity'}</span>
                    </button>

                    <a
                      href={`https://wa.me/966575100100?text=${encodeURIComponent(
                        isArabic
                          ? `السلام عليكم، أود الاستفسار والتسجيل في النشاط: ${act.titleAr}`
                          : `Hello, I would like to inquire about the activity: ${act.titleEn}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
                      title={isArabic ? 'استفسار عبر واتساب' : 'WhatsApp'}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* SECTION C: NO RESULTS STATE */}
        {totalItemsCount === 0 && (
          <div className="text-center py-16 bg-white dark:bg-[#06241d]/50 rounded-3xl border border-slate-200 dark:border-white/10 p-8 my-8">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#0D6D54] dark:text-[#00E5BE] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2">
              {isArabic ? 'لم يتم العثور على عروض أو أنشطة مطابقة للبحث' : 'No matching offers or activities found'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              {isArabic 
                ? 'جرب البحث بكلمات مفتاحية أخرى أو إعادة تعيين الفلاتر لعرض كافة العروض والفعاليات المتاحة.'
                : 'Try different search keywords or reset filters to view all available offers.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="px-6 py-2.5 rounded-xl bg-[#0D6D54] text-white text-xs sm:text-sm font-black hover:brightness-110 transition-all cursor-pointer shadow-md"
            >
              {isArabic ? 'عرض كافة العروض والأنشطة' : 'Show All Offers'}
            </button>
          </div>
        )}

        {/* SECTION D: BOTTOM CONSULTATION HOOK BANNER */}
        <div className="p-6 sm:p-8 rounded-3xl border border-[#0D6D54]/20 dark:border-[#00E5BE]/20 bg-gradient-to-r from-[#dff1ec]/70 via-white dark:via-slate-900 to-[#dff1ec]/40 dark:from-teal-950/40 dark:to-slate-900 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0D6D54] to-[#14b8a6] text-white flex items-center justify-center shrink-0 shadow-md">
              <HeartHandshake className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#0f2d29] dark:text-white">
                {isArabic ? 'هل ترغب في باقة مخصصة أو لديك استفسار عن الأنشطة؟' : 'Need a custom package or inquiry about activities?'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                {isArabic 
                  ? 'فريق الاستشارات بمركز رابا جاهز لتقديم المشورة وتنسيق خطة تأهيلية تناسب احتياجات طفلك.'
                  : 'Raba Center intake team is ready to assist and tailor a rehabilitation package for your child.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <a
              href="tel:966575100100"
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center"
            >
              <Phone className="w-4 h-4 text-[#0D6D54] dark:text-[#00E5BE]" />
              <span>{isArabic ? 'اتصال مباشر' : 'Call'}</span>
            </a>

            <button
              onClick={() => {
                if (onOpenBooking) {
                  onOpenBooking('استفسار عام عن باقات العروض والأنشطة');
                }
              }}
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0D6D54] to-[#0f766e] text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer hover:brightness-110 active:scale-95 text-center"
            >
              {isArabic ? 'طلب استشارة فورية' : 'Request Consultation'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default OffersDirectoryPage;
