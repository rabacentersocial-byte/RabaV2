import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  CalendarCheck,
  Sun, 
  Moon,
  Globe, 
  ShieldCheck, 
  Home, 
  Sparkles, 
  GraduationCap, 
  MapPin, 
  BookOpen, 
  Handshake, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  MessageCircle,
  SunMedium,
  Stethoscope,
  BadgeCheck,
  Award,
  Sparkle,
  Gift
} from 'lucide-react';
import { RabaLogo } from './RabaLogo';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenNotifications?: () => void;
  onOpenLogin?: () => void;
  onOpenAdmin?: () => void;
  onOpenStore?: () => void;
  onOpenSpecialistsPage?: () => void;
  onOpenServicesPage?: () => void;
  onOpenBranchesPage?: () => void;
  onOpenOffersPage?: () => void;
  onOpenBlogPage?: () => void;
  onGoHome?: () => void;
  isSpecialistsPageOpen?: boolean;
  isServicesPageOpen?: boolean;
  isBranchesPageOpen?: boolean;
  isOffersPageOpen?: boolean;
  isBlogPageOpen?: boolean;
  unreadCount?: number;
  cartCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenNotifications,
  onOpenLogin,
  onOpenAdmin,
  onOpenSpecialistsPage,
  onOpenServicesPage,
  onOpenBranchesPage,
  onOpenOffersPage,
  onOpenBlogPage,
  onGoHome,
  isSpecialistsPageOpen = false,
  isServicesPageOpen = false,
  isBranchesPageOpen = false,
  isOffersPageOpen = false,
  isBlogPageOpen = false,
  unreadCount
}) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t, isArabic } = useLanguage();
  const isDark = theme === 'dark';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled((window.pageYOffset || document.documentElement.scrollTop || 0) > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile sidebar drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Focused, professional navigation links strictly representing the core sections
  const navLinks = [
    { label: t('nav.home'), href: '#hero' },
    { label: isArabic ? 'من نحن' : 'About Us', href: '#about' },
    { label: isArabic ? 'الخدمات' : 'Services', href: '#services' },
    { label: isArabic ? 'العروض والأنشطة' : 'Offers & Activities', href: '#offers' },
    { label: isArabic ? 'خدمة سِوار (معلم الظل)' : 'Sewar (Shadow Teacher)', href: '#shadow-teacher' },
    { label: t('nav.specialists'), href: '#specialists' },
    { label: isArabic ? 'فروعنا بالمملكة' : 'Branches', href: '#branches' },
    { label: t('nav.blog'), href: '#blog' },
    { label: isArabic ? 'شركاء النجاح' : 'Success Partners', href: '#partners' },
    { label: isArabic ? 'الاعتمادات' : 'Accreditations', href: '#accreditations-section' },
    { label: t('nav.stories'), href: '#testimonials' },
    { label: isArabic ? 'اتصل بنا' : 'Contact Us', href: '#contact' },
  ];

  // Mobile navigation categorized items with custom professional icons & styling
  const mobileNavSections = [
    {
      sectionTitle: isArabic ? 'البرامج التأهيلية والعلاجية' : 'Clinical Care & Rehabilitation',
      items: [
        {
          id: 'home',
          label: t('nav.home'),
          subtitle: isArabic ? 'بوابة المركز الرئيسية ومحاور التميز' : 'Overview & Main Portal',
          href: '#hero',
          icon: Home,
          iconBg: 'bg-teal-500/15 text-teal-700 dark:text-[#00E5BE] border-teal-500/30',
          badge: null,
        },
        {
          id: 'services',
          label: isArabic ? 'الخدمات وباقات التأهيل' : 'Services & Programs',
          subtitle: isArabic ? 'جلسات التخاطب والوظيفي وتعديل السلوك' : 'Rehab, Speech & Behavioral Care',
          href: '#services',
          icon: Sparkles,
          iconBg: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30',
          badge: isArabic ? 'متاح الآن' : 'Available',
        },
        {
          id: 'offers',
          label: isArabic ? 'العروض والأنشطة' : 'Offers & Activities',
          subtitle: isArabic ? 'عروض وفعاليات اليوم الوطني والأنشطة الحصرية' : 'National Day Deals & Center Events',
          href: '#offers',
          icon: Gift,
          iconBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
          badge: isArabic ? 'عروض خاصة' : 'Offers',
          badgeHighlight: true,
        },
        {
          id: 'summer-packages',
          label: isArabic ? 'باقات الصيف الحصرية' : 'Exclusive Summer Packages',
          subtitle: isArabic ? 'عروض مكثفة ومخفضة لصيف 2026' : 'Special Intensive Summer Offers',
          href: '#services',
          icon: SunMedium,
          iconBg: 'bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-400/40 ring-1 ring-sky-400/30',
          badge: isArabic ? 'عروض الصيف' : 'Summer Deal',
          badgeHighlight: true,
        },
        {
          id: 'shadow-teacher',
          label: isArabic ? 'خدمة سِوار (معلم الظل)' : 'Sewar (Shadow Teacher)',
          subtitle: isArabic ? 'الدمج المدرسي والتربوي المتخصص' : 'School Integration & Support',
          href: '#shadow-teacher',
          icon: GraduationCap,
          iconBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
          badge: isArabic ? 'معتمد' : 'Certified',
        },
        {
          id: 'specialists',
          label: t('nav.specialists'),
          subtitle: isArabic ? 'نخبة الكوادر الطبية والتأهيلية المعتمدة' : 'Certified Clinical Specialist Team',
          href: '#specialists',
          icon: Stethoscope,
          iconBg: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30',
          badge: isArabic ? 'نخبة الأطباء' : 'Top Specialists',
        },
      ]
    },
    {
      sectionTitle: isArabic ? 'الفروع والمصادر التوعوية' : 'Locations & Family Hub',
      items: [
        {
          id: 'branches',
          label: isArabic ? 'فروعنا بالمملكة' : 'Branches & Centers',
          subtitle: isArabic ? 'الرياض · جدة · الخبر والمناطق' : 'Riyadh · Jeddah · Khobar Centers',
          href: '#branches',
          icon: MapPin,
          iconBg: 'bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-500/30',
          badge: isArabic ? 'مواقعنا' : 'Locations',
        },
        {
          id: 'blog',
          label: t('nav.blog'),
          subtitle: isArabic ? 'مقالات وأدلة توعوية شاملة للأسر' : 'Parent Guides & Autism Insights',
          href: '#blog',
          icon: BookOpen,
          iconBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
          badge: null,
        },
      ]
    },
    {
      sectionTitle: isArabic ? 'الموثوقية والشركاء' : 'Trust & Proven Impact',
      items: [
        {
          id: 'accreditations',
          label: isArabic ? 'الاعتمادات والتراخيص' : 'Accreditations & Licensing',
          subtitle: isArabic ? 'تراخيص وزارة الصحة وهيئة التخصصات' : 'MOH & SCFHS Certified Standards',
          href: '#accreditations-section',
          icon: ShieldCheck,
          iconBg: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
          badge: isArabic ? 'رسمي' : 'Official',
        },
        {
          id: 'partners',
          label: isArabic ? 'شركاء النجاح' : 'Success Partners',
          subtitle: isArabic ? 'شراكات ورعايات مؤسسية رائدة' : 'Institutional Alliances & Partners',
          href: '#partners',
          icon: Handshake,
          iconBg: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30',
          badge: null,
        },
        {
          id: 'testimonials',
          label: t('nav.stories'),
          subtitle: isArabic ? 'تجارب أسر أطفال رابا الحقيقية' : 'Real Parent Testimonials & Stories',
          href: '#testimonials',
          icon: Star,
          iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
          badge: null,
        },
      ]
    },
    {
      sectionTitle: isArabic ? 'عن المركز والمعلومات القانونية' : 'About & Legal Hub',
      items: [
        {
          id: 'about',
          label: isArabic ? 'عن مركز رابا' : 'About RABA Center',
          subtitle: isArabic ? 'رؤيتنا ورسالتنا وفلسفة العلاج' : 'Our Mission, Vision & Approach',
          href: '/about',
          icon: ShieldCheck,
          iconBg: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
          badge: null,
        },
        {
          id: 'contact',
          label: isArabic ? 'اتصل بنا والتواصل' : 'Contact Us',
          subtitle: isArabic ? 'خدمة العملاء وأرقام الفروع والموقع' : 'Customer Service & Contact Details',
          href: '/contact',
          icon: Phone,
          iconBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
          badge: null,
        },
        {
          id: 'terms',
          label: isArabic ? 'الشروط والأحكام والخصوصية' : 'Terms & Privacy',
          subtitle: isArabic ? 'سياسة الخصوصية وحقوق المستفيدين' : 'Terms of Service & Privacy Policy',
          href: '/terms',
          icon: BookOpen,
          iconBg: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30',
          badge: null,
        },
      ]
    }
  ];

  return (
    <>
      <header 
        id="main-sticky-header"
        className={`sticky top-0 z-50 w-full h-16 sm:h-20 flex items-center transition-colors duration-300 ${
          isScrolled 
            ? isDark 
              ? 'bg-[#0D1B2A]/85 backdrop-blur-2xl border-b border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.1)]' 
              : 'bg-white/85 backdrop-blur-2xl border-b border-white/80 shadow-[0_10px_30px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)]'
            : isDark 
              ? 'bg-[#0D1B2A]/70 backdrop-blur-xl border-b border-white/10' 
              : 'bg-white/70 backdrop-blur-xl border-b border-white/60'
        }`}
        style={{ position: 'sticky', top: 0, zIndex: 50 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between gap-4">
            
            {/* 1. Brand Identity & Logo (Right in RTL) */}
            <a 
              href="#hero" 
              onClick={(e) => {
                if (onGoHome) {
                  e.preventDefault();
                  onGoHome();
                }
              }}
              className="flex items-center group cursor-pointer shrink-0 transition-opacity hover:opacity-95" 
              id="header-logo-link"
              aria-label="الصفحة الرئيسية لمركز رابا"
            >
              <RabaLogo variant="compact" size="md" />
            </a>

            {/* 2. Primary Navigation (Desktop - Liquid Glass Capsule Track) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 p-1 rounded-full liquid-glass-pill" aria-label="القائمة الرئيسية">
              {navLinks.map((link) => {
                const isLinkActive = 
                  (link.href === '#blog' && isBlogPageOpen) ||
                  (link.href === '#offers' && isOffersPageOpen) ||
                  (link.href === '#services' && isServicesPageOpen) || 
                  (link.href === '#specialists' && isSpecialistsPageOpen) ||
                  (link.href === '#branches' && isBranchesPageOpen) ||
                  (link.href === '#hero' && !isServicesPageOpen && !isSpecialistsPageOpen && !isBranchesPageOpen && !isOffersPageOpen && !isBlogPageOpen);

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      if (link.href === '#blog' && onOpenBlogPage) {
                        e.preventDefault();
                        onOpenBlogPage();
                      } else if (link.href === '#offers' && onOpenOffersPage) {
                        e.preventDefault();
                        onOpenOffersPage();
                      } else if (link.href === '#services' && onOpenServicesPage) {
                        e.preventDefault();
                        onOpenServicesPage();
                      } else if (link.href === '#specialists' && onOpenSpecialistsPage) {
                        e.preventDefault();
                        onOpenSpecialistsPage();
                      } else if (link.href === '#branches' && onOpenBranchesPage) {
                        e.preventDefault();
                        onOpenBranchesPage();
                      } else if (link.href === '#hero' && onGoHome) {
                        e.preventDefault();
                        onGoHome();
                      } else if (onGoHome && (isSpecialistsPageOpen || isServicesPageOpen || isBranchesPageOpen || isOffersPageOpen || isBlogPageOpen)) {
                        onGoHome();
                      }
                    }}
                    className={`px-3 py-1.5 text-xs xl:text-sm font-bold rounded-full transition-all duration-200 ${
                      isLinkActive
                        ? 'bg-[#2E86EB] text-white shadow-md shadow-blue-500/25 border-t border-white/40'
                        : isDark
                          ? 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
                          : 'text-slate-700 hover:text-slate-950 hover:bg-white/80'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            {/* 3. Streamlined Executive Actions */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              
              {/* Language Switcher Button (AR / EN) */}
              <button
                onClick={toggleLanguage}
                id="header-language-toggle-btn"
                className={`min-w-[64px] h-9 px-2.5 sm:px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 text-xs font-black shadow-xs ${
                  isDark 
                    ? 'liquid-glass-btn text-slate-200 hover:text-white' 
                    : 'liquid-glass-btn text-slate-800 hover:text-slate-950'
                }`}
                title={isArabic ? "Switch to English" : "التحويل إلى اللغة العربية"}
                aria-label="تبديل لغة الموقع"
              >
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2E86EB] shrink-0" />
                <span className="font-bold tracking-wide">{isArabic ? 'EN' : 'عربي'}</span>
              </button>

              {/* Theme Toggle Button (Light / Dark) */}
              <button
                onClick={toggleTheme}
                id="header-theme-toggle-btn"
                className={`w-9 h-9 min-w-[36px] min-h-[36px] rounded-full transition-colors cursor-pointer flex items-center justify-center shadow-xs ${
                  isDark 
                    ? 'liquid-glass-btn text-[#FFD23F]' 
                    : 'liquid-glass-btn text-[#2E86EB]'
                }`}
                title={isDark ? "التحويل إلى الوضع الفاتح" : "التحويل إلى الوضع الليلي"}
                aria-label="تبديل الوضع الليلي والفاتح"
              >
                {isDark ? (
                  <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFD23F] transition-transform hover:rotate-45" />
                ) : (
                  <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2E86EB] transition-transform hover:-rotate-12" />
                )}
              </button>


              {/* Primary Action Button: "احجز الآن" / "Book Now" */}
              <button
                onClick={onOpenBooking}
                id="header-quick-book-btn"
                className="relative group overflow-hidden flex items-center gap-2 bg-gradient-to-r from-[#2E86EB] via-[#3B92F5] to-[#22C55E] hover:from-[#1D74D8] hover:to-[#16A34A] active:scale-95 text-white text-xs sm:text-sm font-black px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all duration-300 shadow-md shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 border border-white/30 cursor-pointer"
              >
                {/* Shimmer light sweep animation */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                
                {/* Live Availability Beacon */}
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950/80 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950" />
                </span>

                <CalendarCheck className="w-4 h-4 text-slate-950 transition-transform duration-300 group-hover:scale-110 shrink-0" />
                <span className="tracking-tight font-black whitespace-nowrap">{t('nav.bookNow')}</span>
              </button>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`lg:hidden p-2 rounded-xl backdrop-blur-md cursor-pointer border transition-colors ${
                  isDark 
                    ? 'text-slate-200 hover:text-white hover:bg-white/10 border-white/10' 
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 border-slate-200'
                }`}
                aria-label={isArabic ? "فتح القائمة الجانبية" : "Open Navigation Sidebar"}
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* True Slide-Over Mobile Sidebar Drawer (القائمة الجانبية في عرض الجوال) */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 lg:hidden flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label={isArabic ? 'القائمة الجانبية الرئيسية' : 'Mobile Navigation Sidebar'}
        >
          {/* Backdrop Blur Overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-300 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <aside 
            className={`relative z-10 w-[88vw] max-w-sm sm:w-[390px] h-[100dvh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-l rtl:border-l-0 rtl:border-r transition-transform duration-300 ease-out animate-in ${
              isArabic ? 'slide-in-from-right' : 'slide-in-from-left'
            } ${
              isDark 
                ? 'bg-[#0D1B2A] text-white border-white/10' 
                : 'bg-white text-slate-900 border-slate-200/90'
            }`}
            dir={isArabic ? 'rtl' : 'ltr'}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header: Brand, Status Beacon & Close Button */}
            <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between shrink-0 bg-gradient-to-l from-blue-500/10 dark:from-[#2E86EB]/20 to-transparent">
              <div className="flex items-center gap-2.5 min-w-0">
                <RabaLogo variant="compact" size="sm" />
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                    {isArabic ? 'مركز رابا الطبي' : 'Raba Medical Center'}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="text-[10px] text-blue-600 dark:text-[#22C55E] font-bold truncate">
                      {isArabic ? 'متاح لاستقبال الحالات' : 'Active & Accepting Cases'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer border border-slate-200/60 dark:border-white/10"
                aria-label={isArabic ? 'إغلاق القائمة الجانبية' : 'Close Sidebar'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body: Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar overscroll-contain">
              
              {/* Quick Booking Hero Card */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#0E2A54] via-[#1B4B8A] to-[#2E86EB] text-white shadow-md border border-white/20 relative overflow-hidden">
                <div className="absolute -left-6 -top-6 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between gap-3 relative z-10">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20 text-[#FFD23F] shadow-xs">
                      <CalendarCheck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-black truncate">
                        {isArabic ? 'حجز تقييم استشاري' : 'Book Clinical Assessment'}
                      </h4>
                      <p className="text-[10.5px] text-blue-100/90 mt-0.5 truncate font-medium">
                        {isArabic ? 'جلسات فورية مع نخبة الاستشاريين' : 'Certified clinical specialists'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenBooking();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#2E86EB] hover:bg-[#2575d0] text-white text-xs font-black shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1 shrink-0"
                  >
                    <span>{t('nav.bookNow')}</span>
                    {isArabic ? <ChevronLeft className="w-3.5 h-3.5 stroke-[3]" /> : <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                </div>
              </div>

              {/* Categorized Navigation Sections with Professional Themed Icons */}
              <div className="space-y-4">
                {mobileNavSections.map((section, sIdx) => (
                  <div key={sIdx} className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2E86EB]/60" />
                      <span>{section.sectionTitle}</span>
                    </span>

                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const ItemIcon = item.icon;
                        const isLinkActive = 
                          (item.href === '#offers' && isOffersPageOpen) ||
                          (item.href === '#services' && isServicesPageOpen) || 
                          (item.href === '#specialists' && isSpecialistsPageOpen) ||
                          (item.href === '#branches' && isBranchesPageOpen) ||
                          (item.href === '#hero' && !isServicesPageOpen && !isSpecialistsPageOpen && !isBranchesPageOpen && !isOffersPageOpen);

                        return (
                          <a
                            key={item.id}
                            href={item.href}
                            onClick={(e) => {
                              setMobileMenuOpen(false);
                              if (item.href === '#blog' && onOpenBlogPage) {
                                e.preventDefault();
                                onOpenBlogPage();
                              } else if (item.href === '#offers' && onOpenOffersPage) {
                                e.preventDefault();
                                onOpenOffersPage();
                              } else if (item.href === '#services' && onOpenServicesPage) {
                                e.preventDefault();
                                onOpenServicesPage();
                              } else if (item.href === '#specialists' && onOpenSpecialistsPage) {
                                e.preventDefault();
                                onOpenSpecialistsPage();
                              } else if (item.href === '#branches' && onOpenBranchesPage) {
                                e.preventDefault();
                                onOpenBranchesPage();
                              } else if (item.href === '#hero' && onGoHome) {
                                e.preventDefault();
                                onGoHome();
                              } else if (onGoHome && (isSpecialistsPageOpen || isServicesPageOpen || isBranchesPageOpen || isOffersPageOpen || isBlogPageOpen)) {
                                onGoHome();
                              }
                            }}
                            className={`group p-2.5 rounded-2xl transition-all flex items-center justify-between border cursor-pointer ${
                              isLinkActive
                                ? 'bg-gradient-to-r from-[#1B4B8A] to-[#2E86EB] text-white shadow-sm border-blue-500/40 ring-1 ring-[#FFD23F]/40'
                                : item.badgeHighlight
                                  ? 'bg-sky-500/5 hover:bg-sky-500/10 text-slate-800 dark:text-white border-sky-400/40 dark:border-sky-500/30'
                                  : isDark 
                                    ? 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-200 border-white/5' 
                                    : 'bg-slate-50/80 hover:bg-slate-100 text-slate-800 border-slate-200/60'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Dedicated Custom Icon Box */}
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 shadow-2xs ${item.iconBg}`}>
                                <ItemIcon className="w-4.5 h-4.5 stroke-[2.2]" />
                              </div>

                              {/* Titles */}
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-xs font-black truncate ${
                                    isLinkActive ? 'text-white' : isDark ? 'text-white' : 'text-slate-900'
                                  }`}>
                                    {item.label}
                                  </span>
                                  {item.badge && (
                                    <span className={`text-[8.5px] font-black px-1.5 py-0.2 rounded-md ${
                                      isLinkActive
                                        ? 'bg-[#00E5BE] text-slate-950'
                                        : item.badgeHighlight
                                          ? 'bg-sky-500 text-white dark:bg-sky-400 dark:text-slate-950 font-black'
                                          : 'bg-teal-500/15 text-teal-800 dark:bg-teal-400/15 dark:text-[#00E5BE]'
                                    }`}>
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className={`text-[10px] truncate font-medium mt-0.5 ${
                                  isLinkActive ? 'text-teal-100/85' : isDark ? 'text-slate-400' : 'text-slate-500'
                                }`}>
                                  {item.subtitle}
                                </p>
                              </div>
                            </div>

                            {/* Chevron Arrow */}
                            <div className={`shrink-0 ms-1.5 transition-transform group-hover:-translate-x-0.5 ${
                              isLinkActive
                                ? 'text-[#00E5BE]'
                                : 'text-slate-300 dark:text-slate-600 group-hover:text-teal-600 dark:group-hover:text-[#00E5BE]'
                            }`}>
                              {isArabic ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct Instant Contact Bar */}
              <div className="pt-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1.5 block mb-1.5">
                  {isArabic ? 'تواصل مباشر مع الفريق الطبي' : 'Direct Support & Assistance'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:0575100100"
                    className={`py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      isDark
                        ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-600 dark:text-[#00E5BE]" />
                    <span className="truncate">{isArabic ? 'اتصال: 0575100100' : '0575100100'}</span>
                  </a>

                  <a
                    href="https://wa.me/966575100100"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="truncate">{isArabic ? 'واتساب الاستشارات' : 'WhatsApp'}</span>
                  </a>
                </div>
              </div>


            </div>

            {/* Drawer Sticky Footer: Language, Theme & Accreditation info */}
            <div className="p-3.5 sm:p-4 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-black/20 shrink-0 space-y-2.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    toggleLanguage();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-black flex items-center justify-between border cursor-pointer ${
                    isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-teal-500" />
                    <span>{isArabic ? 'اللغة:' : 'Language:'}</span>
                  </span>
                  <span className="text-teal-600 dark:text-[#00E5BE]">
                    {isArabic ? 'English (EN)' : 'العربية (AR)'}
                  </span>
                </button>

                <button
                  onClick={toggleTheme}
                  aria-label={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border cursor-pointer ${
                    isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                  }`}
                >
                  {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
                  <span>{isDark ? (isArabic ? 'نهاري' : 'Light') : (isArabic ? 'ليلي' : 'Dark')}</span>
                </button>
              </div>

              <div className="text-[10px] text-center text-slate-400 dark:text-slate-500 font-medium">
                {isArabic ? 'مرخص من وزارة الصحة ووزارة الموارد البشرية والتنمية الاجتماعية © 2026' : 'MOH & HRSD Certified Clinic © 2026'}
              </div>
            </div>

          </aside>
        </div>
      )}
    </>
  );
};
