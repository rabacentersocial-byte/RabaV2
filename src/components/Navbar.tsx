import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  CalendarCheck,
  Sun, 
  Moon,
  Globe,
  ShieldCheck
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
  onGoHome?: () => void;
  unreadCount?: number;
  cartCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenNotifications,
  onOpenLogin,
  onOpenAdmin,
  onOpenSpecialistsPage,
  onGoHome,
  unreadCount
}) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t, isArabic } = useLanguage();
  const isDark = theme === 'dark';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focused, professional navigation links strictly representing the core sections
  const navLinks = [
    { label: t('nav.home'), href: '#hero' },
    { label: t('nav.services'), href: '#services' },
    { label: isArabic ? 'الكورسات والدورات' : 'Courses', href: '#courses' },
    { label: isArabic ? 'خدمة سِوار (معلم الظل)' : 'Sewar (Shadow Teacher)', href: '#shadow-teacher' },
    { label: t('nav.packages'), href: '#packages' },
    { label: t('nav.specialists'), href: '#specialists' },
    { label: isArabic ? 'فروعنا بالمملكة' : 'Branches', href: '#branches' },
    { label: t('nav.blog'), href: '#blog' },
    { label: isArabic ? 'شركاء النجاح' : 'Success Partners', href: '#partners' },
    { label: isArabic ? 'الاعتمادات' : 'Accreditations', href: '#accreditations-section' },
    { label: t('nav.stories'), href: '#testimonials' },
  ];

  return (
    <header 
      id="main-sticky-header"
      className={`sticky top-0 z-50 w-full py-2 sm:py-2.5 transition-none sm:transition-colors sm:duration-300 ${
        isScrolled 
          ? isDark 
            ? 'bg-[#061412]/95 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
            : 'bg-white/95 backdrop-blur-2xl border-b border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.06)]'
          : isDark 
            ? 'bg-[#061412]/85 backdrop-blur-xl border-b border-white/10' 
            : 'bg-white/90 backdrop-blur-xl border-b border-slate-200/70'
      }`}
      style={{ position: 'sticky', top: 0, zIndex: 50 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* 2. Primary Navigation (Desktop - Balanced & Clean) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="القائمة الرئيسية">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.href === '#specialists' && onOpenSpecialistsPage) {
                    e.preventDefault();
                    onOpenSpecialistsPage();
                  } else if (link.href === '#hero' && onGoHome) {
                    e.preventDefault();
                    onGoHome();
                  } else if (onGoHome) {
                    onGoHome();
                  }
                }}
                className={`px-3 py-2 text-xs xl:text-sm font-bold rounded-xl transition-all ${
                  isDark
                    ? 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* 3. Streamlined Executive Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Language Switcher Button (AR / EN) */}
            <button
              onClick={toggleLanguage}
              id="header-language-toggle-btn"
              className={`px-2 sm:px-3 py-2 rounded-xl backdrop-blur-md transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 border text-xs font-black shadow-xs ${
                isDark 
                  ? 'bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 hover:text-white border-white/15' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-950 border-slate-200'
              }`}
              title={isArabic ? "Switch to English" : "التحويل إلى اللغة العربية"}
              aria-label="تبديل لغة الموقع"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600 dark:text-[#00E5BE]" />
              <span className="font-bold tracking-wide">{isArabic ? 'EN' : 'عربي'}</span>
            </button>

            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={toggleTheme}
              id="header-theme-toggle-btn"
              className={`p-2 sm:p-2.5 rounded-xl backdrop-blur-md transition-all cursor-pointer flex items-center justify-center border shadow-xs ${
                isDark 
                  ? 'bg-white/[0.08] hover:bg-white/[0.14] text-amber-400 border-white/15' 
                  : 'bg-slate-100 hover:bg-slate-200 text-sky-700 border-slate-200'
              }`}
              title={isDark ? "التحويل إلى الوضع الفاتح" : "التحويل إلى الوضع الليلي"}
              aria-label="تبديل الوضع الليلي والفاتح"
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-700 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Admin Dashboard Entry (Icon Only - on tablet/desktop) */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                id="header-admin-btn"
                className={`hidden sm:flex p-2 sm:p-2.5 rounded-xl backdrop-blur-md transition-all cursor-pointer items-center justify-center border shadow-xs ${
                  isDark 
                    ? 'bg-white/[0.08] hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border-white/15 hover:border-emerald-500/30' 
                    : 'bg-slate-100 hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 border-slate-200 hover:border-emerald-300'
                }`}
                title={isArabic ? "لوحة تحكم المنظومة والإدارة" : "Admin Dashboard"}
                aria-label={isArabic ? "لوحة تحكم المنظومة والإدارة" : "Admin Dashboard"}
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
            )}

            {/* Primary Action Button: "احجز الآن" / "Book Now" */}
            <button
              onClick={onOpenBooking}
              id="header-quick-book-btn"
              className="relative group overflow-hidden flex items-center gap-2 bg-gradient-to-r from-[#00E5BE] via-[#00c9a7] to-[#0284C7] hover:from-[#00ffd2] hover:to-[#0396e6] active:scale-95 text-slate-950 text-xs sm:text-sm font-black px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all duration-300 shadow-md shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/35 border border-white/40 cursor-pointer"
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
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl backdrop-blur-md cursor-pointer border ${
                isDark 
                  ? 'text-slate-200 hover:text-white hover:bg-white/10 border-white/10' 
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 border-slate-200'
              }`}
              aria-label="فتح القائمة الرئيسية"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer (Clean, Glassy & Structured) */}
      {mobileMenuOpen && (
        <div 
          className={`lg:hidden border-b px-4 pt-4 pb-6 ${isArabic ? 'text-right' : 'text-left'} shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-2xl ${
            isDark 
              ? 'bg-[#0B1120]/95 border-white/15 text-white' 
              : 'bg-white/95 border-slate-200 text-slate-900'
          }`}
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          {/* Quick booking top hero card for mobile */}
          <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-[#0B3B36] to-[#0284C7] text-white flex items-center justify-between shadow-md">
            <div>
              <h4 className="text-xs font-black">{isArabic ? 'حجز تقييم استشاري' : 'Book Assessment'}</h4>
              <p className="text-[11px] text-teal-100/90 mt-0.5">{isArabic ? 'أخصائيون معتمدون دولياً' : 'Internationally certified'}</p>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#00E5BE] hover:bg-[#00ffd2] text-slate-950 text-xs font-black shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              {t('nav.bookNow')}
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (link.href === '#specialists' && onOpenSpecialistsPage) {
                    e.preventDefault();
                    onOpenSpecialistsPage();
                  } else if (link.href === '#hero' && onGoHome) {
                    e.preventDefault();
                    onGoHome();
                  } else if (onGoHome) {
                    onGoHome();
                  }
                }}
                className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] flex items-center ${
                  isDark 
                    ? 'text-slate-200 hover:bg-white/10 hover:text-white' 
                    : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                {link.label}
              </a>
            ))}

            {/* Language switch button in mobile drawer */}
            <button
              onClick={() => {
                toggleLanguage();
                setMobileMenuOpen(false);
              }}
              className={`mt-2 px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between border cursor-pointer min-h-[44px] ${
                isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-500" />
                <span>{isArabic ? 'اللغة الحالية: العربية' : 'Current Language: English'}</span>
              </span>
              <span className="text-teal-600 dark:text-[#00E5BE] font-black">
                {isArabic ? 'English (EN)' : 'العربية (AR)'}
              </span>
            </button>

            {/* Quick Action inside Mobile Drawer */}
            <div className={`mt-2 pt-2 border-t flex flex-col gap-2 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              {onOpenAdmin && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border cursor-pointer min-h-[44px] ${
                    isDark 
                      ? 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/30 text-emerald-300' 
                      : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-900'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>{isArabic ? 'لوحة تحكم المنظومة وإدارة المستخدمين' : 'Admin Operations & RBAC Dashboard'}</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
