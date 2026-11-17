import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  CalendarCheck,
  Sun, 
  Moon,
  Globe, 
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
  Stethoscope,
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
  onOpenShadowTeacherPage?: () => void;
  onOpenPartnersPage?: () => void;
  onOpenTestimonialsPage?: () => void;
  onGoHome?: () => void;
  isSpecialistsPageOpen?: boolean;
  isServicesPageOpen?: boolean;
  isBranchesPageOpen?: boolean;
  isOffersPageOpen?: boolean;
  isBlogPageOpen?: boolean;
  isShadowTeacherPageOpen?: boolean;
  isPartnersPageOpen?: boolean;
  isTestimonialsPageOpen?: boolean;
  unreadCount?: number;
  cartCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenSpecialistsPage,
  onOpenServicesPage,
  onOpenBranchesPage,
  onOpenOffersPage,
  onOpenBlogPage,
  onOpenShadowTeacherPage,
  onOpenPartnersPage,
  onOpenTestimonialsPage,
  onGoHome,
  isSpecialistsPageOpen = false,
  isServicesPageOpen = false,
  isBranchesPageOpen = false,
  isOffersPageOpen = false,
  isBlogPageOpen = false,
  isShadowTeacherPageOpen = false,
  isPartnersPageOpen = false,
  isTestimonialsPageOpen = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { toggleLanguage, t, isArabic } = useLanguage();
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

  // Approved final navigation menu (Single source of truth mirrored across desktop header & mobile drawer)
  const navLinks = [
    {
      id: 'home',
      label: t('nav.home'),
      subtitle: isArabic ? 'بوابة المركز الرئيسية ومحاور التميز' : 'Overview & Main Portal',
      href: '#hero',
      icon: Home,
      iconBg: 'bg-[#2B95FF]/15 text-[#1263D6] dark:text-[#60AFFF] border-[#2B95FF]/30',
    },
    {
      id: 'services',
      label: isArabic ? 'الخدمات' : 'Services',
      subtitle: isArabic ? 'جلسات التخاطب والوظيفي وتعديل السلوك' : 'Rehab, Speech & Behavioral Care',
      href: '#services',
      icon: Sparkles,
      iconBg: 'bg-[#10B981]/15 text-[#047857] dark:text-[#34D399] border-[#10B981]/30',
    },
    {
      id: 'offers',
      label: isArabic ? 'العروض والأنشطة' : 'Offers & Activities',
      subtitle: isArabic ? 'عروض وفعاليات اليوم الوطني والأنشطة الحصرية' : 'Seasonal Deals & Center Events',
      href: '#offers',
      icon: Gift,
      iconBg: 'bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA] border-[#8B5CF6]/30',
    },
    {
      id: 'shadow-teacher',
      label: isArabic ? 'خدمة سِوار (معلم الظل)' : 'Sewar (Shadow Teacher)',
      subtitle: isArabic ? 'الدمج المدرسي والتربوي المتخصص' : 'School Integration & Support',
      href: '#shadow-teacher',
      icon: GraduationCap,
      iconBg: 'bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24] border-[#F59E0B]/30',
    },
    {
      id: 'specialists',
      label: t('nav.specialists'),
      subtitle: isArabic ? 'نخبة الكوادر الطبية والتأهيلية المعتمدة' : 'Certified Clinical Specialist Team',
      href: '#specialists',
      icon: Stethoscope,
      iconBg: 'bg-[#141821]/10 dark:bg-white/10 text-[#161B26] dark:text-[#F8FAFC] border-[#161B26]/15 dark:border-white/15',
    },
    {
      id: 'branches',
      label: isArabic ? 'فروعنا بالمملكة' : 'Branches',
      subtitle: isArabic ? 'الرياض · الخرج · الفروع والمواقع' : 'Riyadh · Al-Kharj & Locations',
      href: '#branches',
      icon: MapPin,
      iconBg: 'bg-[#2B95FF]/15 text-[#1263D6] dark:text-[#60AFFF] border-[#2B95FF]/30',
    },
    {
      id: 'blog',
      label: t('nav.blog'),
      subtitle: isArabic ? 'مقالات وأدلة توعوية شاملة للأسر' : 'Parent Guides & Autism Insights',
      href: '#blog',
      icon: BookOpen,
      iconBg: 'bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA] border-[#8B5CF6]/30',
    },
    {
      id: 'partners',
      label: isArabic ? 'شركاء النجاح' : 'Success Partners',
      subtitle: isArabic ? 'شراكات ورعايات مؤسسية رائدة' : 'Institutional Alliances & Partners',
      href: '#partners',
      icon: Handshake,
      iconBg: 'bg-[#141821]/10 dark:bg-white/10 text-[#161B26] dark:text-[#F8FAFC] border-[#161B26]/15 dark:border-white/15',
    },
    {
      id: 'testimonials',
      label: t('nav.stories'),
      subtitle: isArabic ? 'تجارب أسر أطفال رابا الحقيقية' : 'Real Parent Testimonials & Stories',
      href: '#testimonials',
      icon: Star,
      iconBg: 'bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24] border-[#F59E0B]/30',
    },
  ];

  const anySubPageOpen =
    isServicesPageOpen ||
    isSpecialistsPageOpen ||
    isBranchesPageOpen ||
    isOffersPageOpen ||
    isBlogPageOpen ||
    isShadowTeacherPageOpen ||
    isPartnersPageOpen ||
    isTestimonialsPageOpen;

  const isHrefActive = (href: string): boolean =>
    (href === '#blog' && isBlogPageOpen) ||
    (href === '#offers' && isOffersPageOpen) ||
    (href === '#services' && isServicesPageOpen) ||
    (href === '#specialists' && isSpecialistsPageOpen) ||
    (href === '#branches' && isBranchesPageOpen) ||
    (href === '#shadow-teacher' && isShadowTeacherPageOpen) ||
    (href === '#partners' && isPartnersPageOpen) ||
    (href === '#testimonials' && isTestimonialsPageOpen) ||
    (href === '#hero' && !anySubPageOpen);

  const handleNavClick = (href: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href === '#blog' && onOpenBlogPage) {
      e.preventDefault();
      onOpenBlogPage();
    } else if (href === '#offers' && onOpenOffersPage) {
      e.preventDefault();
      onOpenOffersPage();
    } else if (href === '#services' && onOpenServicesPage) {
      e.preventDefault();
      onOpenServicesPage();
    } else if (href === '#specialists' && onOpenSpecialistsPage) {
      e.preventDefault();
      onOpenSpecialistsPage();
    } else if (href === '#branches' && onOpenBranchesPage) {
      e.preventDefault();
      onOpenBranchesPage();
    } else if (href === '#shadow-teacher' && onOpenShadowTeacherPage) {
      e.preventDefault();
      onOpenShadowTeacherPage();
    } else if (href === '#partners' && onOpenPartnersPage) {
      e.preventDefault();
      onOpenPartnersPage();
    } else if (href === '#testimonials' && onOpenTestimonialsPage) {
      e.preventDefault();
      onOpenTestimonialsPage();
    } else if (href === '#hero' && onGoHome) {
      e.preventDefault();
      onGoHome();
    } else if (onGoHome && anySubPageOpen) {
      onGoHome();
    }
  };

  return (
    <>
      <header 
        id="main-sticky-header"
        className={`sticky top-0 z-50 w-full h-16 sm:h-20 flex items-center transition-all duration-300 backdrop-blur-xl ${
          isScrolled 
            ? isDark 
              ? 'bg-[rgba(22,28,42,0.82)] border-b border-white/[0.08] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.55)]' 
              : 'bg-[rgba(255,255,255,0.72)] border-b border-[#161B26]/[0.08] shadow-[0_20px_40px_-15px_rgba(22,27,38,0.10)]'
            : isDark 
              ? 'bg-[rgba(22,28,42,0.68)] border-b border-white/[0.06]' 
              : 'bg-[rgba(255,255,255,0.62)] border-b border-[#161B26]/[0.06]'
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
              <RabaLogo variant="compact" size="md" loading="eager" />
            </a>

            {/* 2. Primary Navigation (Desktop - Clean Unboxed Links) */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 min-w-0" aria-label="القائمة الرئيسية">
              {navLinks.map((link) => {
                const isLinkActive = isHrefActive(link.href);

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(link.href, e)}
                    className={`px-1.5 xl:px-2.5 py-1.5 text-[11px] xl:text-[13px] font-bold rounded-full whitespace-nowrap shrink-0 transition-colors duration-200 ${
                      isLinkActive
                        ? 'text-[#1263D6] dark:text-[#60AFFF] bg-[#2B95FF]/12'
                        : isDark
                          ? 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.06]'
                          : 'text-[#4B5563] hover:text-[#161B26] hover:bg-white/70'
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
                className={`min-w-[64px] h-9 px-2.5 sm:px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 text-xs font-black border backdrop-blur-md ${
                  isDark 
                    ? 'bg-white/[0.06] hover:bg-white/[0.12] border-white/[0.10] text-[#F8FAFC]' 
                    : 'bg-white/75 hover:bg-white border-[#161B26]/[0.08] text-[#161B26]'
                }`}
                title={isArabic ? "Switch to English" : "التحويل إلى اللغة العربية"}
                aria-label="تبديل لغة الموقع"
              >
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2B95FF] shrink-0" />
                <span className="font-bold tracking-wide">{isArabic ? 'EN' : 'عربي'}</span>
              </button>

              {/* Theme Toggle Button (Light / Dark) */}
              <button
                onClick={toggleTheme}
                id="header-theme-toggle-btn"
                className={`w-9 h-9 min-w-[36px] min-h-[36px] rounded-full transition-colors cursor-pointer flex items-center justify-center border backdrop-blur-md ${
                  isDark 
                    ? 'bg-white/[0.06] hover:bg-white/[0.12] border-white/[0.10] text-[#F59E0B]' 
                    : 'bg-white/75 hover:bg-white border-[#161B26]/[0.08] text-[#161B26]'
                }`}
                title={isDark ? "التحويل إلى الوضع الفاتح" : "التحويل إلى الوضع الليلي"}
                aria-label="تبديل الوضع الليلي والفاتح"
              >
                {isDark ? (
                  <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F59E0B] transition-transform hover:rotate-45" />
                ) : (
                  <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#161B26] transition-transform hover:-rotate-12" />
                )}
              </button>


              {/* Primary Action Button: "احجز الآن" / "Book Now" */}
              <button
                onClick={onOpenBooking}
                id="header-quick-book-btn"
                className="relative group overflow-hidden flex items-center gap-2 bg-gradient-to-r from-[#1668DC] to-[#1152B8] hover:brightness-110 text-white active:scale-95 text-xs sm:text-sm font-black px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-200 shadow-[0_12px_28px_-10px_rgba(22,104,220,0.45)] border border-white/25 cursor-pointer"
              >
                {/* Shimmer light sweep animation */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                
                {/* Live Availability Beacon */}
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
                </span>

                <CalendarCheck className="w-4 h-4 text-white transition-colors duration-200 group-hover:scale-110 shrink-0" />
                <span className="tracking-tight font-black whitespace-nowrap">{t('nav.bookNow')}</span>
              </button>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`lg:hidden p-2 rounded-full cursor-pointer border transition-colors backdrop-blur-md ${
                  isDark 
                    ? 'bg-white/[0.06] text-[#F8FAFC] hover:bg-white/[0.12] border-white/[0.10]' 
                    : 'bg-white/75 text-[#161B26] hover:bg-white border-[#161B26]/[0.08]'
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
            className={`relative z-10 w-[88vw] max-w-sm sm:w-[390px] h-[100dvh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.45)] border-l rtl:border-l-0 rtl:border-r transition-transform duration-300 ease-out animate-in backdrop-blur-2xl ${
              isArabic ? 'slide-in-from-right' : 'slide-in-from-left'
            } ${
              isDark 
                ? 'bg-[#0B0F17]/95 text-[#F8FAFC] border-white/[0.08]' 
                : 'bg-[#F5F2EC]/95 text-[#161B26] border-[#161B26]/[0.08]'
            }`}
            dir={isArabic ? 'rtl' : 'ltr'}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header: Brand, Status Beacon & Close Button */}
            <div className="p-4 sm:p-5 border-b border-[#161B26]/[0.08] dark:border-white/[0.08] flex items-center justify-between shrink-0 bg-gradient-to-l from-[#2B95FF]/10 to-transparent">
              <div className="flex items-center gap-2.5 min-w-0">
                <RabaLogo variant="compact" size="sm" loading="eager" />
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-black text-[#161B26] dark:text-[#F8FAFC] truncate">
                    {isArabic ? 'مركز رابا الطبي' : 'Raba Medical Center'}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shrink-0" />
                    <span className="text-[10px] text-[#047857] dark:text-[#34D399] font-bold truncate">
                      {isArabic ? 'متاح لاستقبال الحالات' : 'Active & Accepting Cases'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full bg-white/80 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20 text-[#161B26] dark:text-[#F8FAFC] transition-colors cursor-pointer border border-[#161B26]/[0.08] dark:border-white/10"
                aria-label={isArabic ? 'إغلاق القائمة الجانبية' : 'Close Sidebar'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body: Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar overscroll-contain">
              
              {/* Quick Booking Hero Card */}
              <div className="p-3.5 sm:p-4 rounded-[28px] obsidian-anchor-card shadow-md relative overflow-hidden">
                <div className="absolute -left-6 -top-6 w-20 h-20 bg-[#2B95FF]/20 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between gap-3 relative z-10">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#2B95FF]/20 flex items-center justify-center shrink-0 border border-[#2B95FF]/30 text-[#2B95FF]">
                      <CalendarCheck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-black truncate">
                        {isArabic ? 'حجز تقييم استشاري' : 'Book Clinical Assessment'}
                      </h4>
                      <p className="text-[10.5px] opacity-80 mt-0.5 truncate font-medium">
                        {isArabic ? 'جلسات فورية مع نخبة الاستشاريين' : 'Certified clinical specialists'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenBooking();
                    }}
                    className="px-3.5 py-2 rounded-full bg-[#1463D6] hover:bg-[#1152B8] text-white text-xs font-black shadow-xs cursor-pointer active:scale-95 transition-all duration-200 flex items-center gap-1 shrink-0"
                  >
                    <span>{t('nav.bookNow')}</span>
                    {isArabic ? <ChevronLeft className="w-3.5 h-3.5 stroke-[3]" /> : <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                </div>
              </div>

              {/* Mirrored Primary Navigation Menu matching Desktop Header */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#4B5563] dark:text-[#94A3B8] px-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2B95FF]" />
                  <span>{isArabic ? 'القائمة الرئيسية' : 'Main Menu'}</span>
                </span>

                <nav className="space-y-1.5" aria-label={isArabic ? 'القائمة الجانبية' : 'Sidebar Navigation'}>
                  {navLinks.map((item) => {
                    const ItemIcon = item.icon;
                    const isLinkActive = isHrefActive(item.href);

                    return (
                      <a
                        key={item.id}
                        href={item.href}
                        onClick={(e) => {
                          setMobileMenuOpen(false);
                          handleNavClick(item.href, e);
                        }}
                        className={`group p-2.5 rounded-2xl transition-colors duration-200 flex items-center justify-between border cursor-pointer ${
                          isLinkActive
                            ? 'bg-gradient-to-r from-[#1668DC] to-[#1152B8] text-white shadow-sm border-transparent'
                            : isDark
                              ? 'bg-white/[0.04] hover:bg-white/[0.08] text-[#F8FAFC] border-white/[0.08]'
                              : 'bg-white/70 hover:bg-white text-[#161B26] border-[#161B26]/[0.08]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 shadow-2xs ${
                            isLinkActive ? 'bg-white/15 text-white border-white/25' : item.iconBg
                          }`}>
                            <ItemIcon className="w-4.5 h-4.5 stroke-[2.2]" />
                          </div>

                          <div className="min-w-0">
                            <span className={`block text-xs font-black truncate ${
                              isLinkActive ? 'text-white' : isDark ? 'text-[#F8FAFC]' : 'text-[#161B26]'
                            }`}>
                              {item.label}
                            </span>
                            <p className={`text-[10px] truncate font-medium mt-0.5 ${
                              isLinkActive ? 'text-white/80' : isDark ? 'text-[#94A3B8]' : 'text-[#4B5563]'
                            }`}>
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className={`shrink-0 ms-1.5 transition-transform group-hover:-translate-x-0.5 ${
                          isLinkActive
                            ? 'text-white'
                            : 'text-[#525B6B] dark:text-[#94A3B8] group-hover:text-[#1263D6] dark:group-hover:text-[#60AFFF]'
                        }`}>
                          {isArabic ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </div>
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* Direct Instant Contact Bar */}
              <div className="pt-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#4B5563] dark:text-[#94A3B8] px-1.5 block mb-1.5">
                  {isArabic ? 'تواصل مباشر مع الفريق الطبي' : 'Direct Support & Assistance'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:0575100100"
                    className={`py-2 px-2.5 rounded-full text-xs font-black flex items-center justify-center gap-1.5 border transition-colors duration-200 cursor-pointer ${
                      isDark
                        ? 'bg-white/[0.06] hover:bg-white/[0.12] border-white/[0.10] text-[#F8FAFC]'
                        : 'bg-white/80 hover:bg-white border-[#161B26]/[0.08] text-[#161B26]'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5 text-[#2B95FF]" />
                    <span className="truncate">{isArabic ? 'اتصال: 0575100100' : '0575100100'}</span>
                  </a>

                  <a
                    href="https://wa.me/966575100100"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2.5 rounded-full text-xs font-black flex items-center justify-center gap-1.5 bg-[#10B981]/12 hover:bg-[#10B981]/20 border border-[#10B981]/30 text-[#047857] dark:text-[#34D399] transition-colors duration-200 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="truncate">{isArabic ? 'واتساب الاستشارات' : 'WhatsApp'}</span>
                  </a>
                </div>
              </div>


            </div>

            {/* Drawer Sticky Footer: Language, Theme & Accreditation info */}
            <div className="p-3.5 sm:p-4 border-t border-[#161B26]/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-[#161C2A]/75 shrink-0 space-y-2.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    toggleLanguage();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 px-3 py-2 rounded-full text-xs font-black flex items-center justify-between border cursor-pointer ${
                    isDark ? 'bg-white/[0.06] border-white/[0.10] text-[#F8FAFC]' : 'bg-white border-[#161B26]/[0.08] text-[#161B26] shadow-2xs'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#2B95FF]" />
                    <span>{isArabic ? 'اللغة:' : 'Language:'}</span>
                  </span>
                  <span className="text-[#1263D6] dark:text-[#60AFFF]">
                    {isArabic ? 'English (EN)' : 'العربية (AR)'}
                  </span>
                </button>

                <button
                  onClick={toggleTheme}
                  aria-label={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
                  className={`px-3.5 py-2 rounded-full text-xs font-black flex items-center gap-1.5 border cursor-pointer ${
                    isDark ? 'bg-white/[0.06] border-white/[0.10] text-[#F8FAFC]' : 'bg-white border-[#161B26]/[0.08] text-[#161B26] shadow-2xs'
                  }`}
                >
                  {isDark ? <Sun className="w-3.5 h-3.5 text-[#F59E0B]" /> : <Moon className="w-3.5 h-3.5 text-[#161B26]" />}
                  <span>{isDark ? (isArabic ? 'نهاري' : 'Light') : (isArabic ? 'ليلي' : 'Dark')}</span>
                </button>
              </div>

              <div className="text-[10px] text-center text-[#4B5563] dark:text-[#94A3B8] font-medium">
                {isArabic ? 'مرخص من وزارة الصحة ووزارة الموارد البشرية والتنمية الاجتماعية © 2026' : 'MOH & HRSD Certified Clinic © 2026'}
              </div>
            </div>

          </aside>
        </div>
      )}
    </>
  );
};
