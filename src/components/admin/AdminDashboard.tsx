import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Briefcase, 
  UserCheck, 
  Tag, 
  DollarSign, 
  ShieldCheck, 
  LogOut, 
  Moon, 
  Sun, 
  Globe, 
  ChevronDown, 
  Sparkles,
  ExternalLink,
  Lock,
  Menu,
  X,
  SlidersHorizontal,
  BookOpen,
  Award,
  RefreshCw,
  Database,
  Handshake,
  GraduationCap,
  Activity,
  PanelRightOpen,
  PanelRightClose,
  PanelLeftOpen,
  PanelLeftClose
} from 'lucide-react';
import { Appointment, ParentReview, AdminUser, PermissionId, ServiceItem, TherapyPackage, Specialist } from '../../types';
import { syncAllToDiskNow, savePersistentModule } from '../../utils/persistentSync';
import { 
  getStoredAdminUsers, 
  saveStoredAdminUsers, 
  getStoredCurrentAdminUser, 
  saveStoredCurrentAdminUser,
  getStoredAdminSession,
  saveStoredAdminSession,
  clearStoredAdminSession
} from '../../data/adminData';
import { SPECIALISTS, getStoredServices, saveStoredServices, getStoredPackages, saveStoredPackages } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { AnimatedBackground } from '../AnimatedBackground';
import { RabaLogo } from '../RabaLogo';

import { OverviewTab } from './OverviewTab';
import { UserManagementTab } from './UserManagementTab';
import { AppointmentsTab } from './AppointmentsTab';
import { ServicesPackagesTab } from './ServicesPackagesTab';
import { PricingManagementTab } from './PricingManagementTab';
import { SpecialistsTab } from './SpecialistsTab';
import { SliderManagementTab } from './SliderManagementTab';
import { BlogManagementTab } from './BlogManagementTab';
import { SiteSettingsTab } from './SiteSettingsTab';
import { AccreditationsSettingsTab } from './AccreditationsSettingsTab';
import { PartnersSettingsTab } from './PartnersSettingsTab';
import { CoursesManagementTab } from './CoursesManagementTab';
import { MarketingReviewsTab } from './MarketingReviewsTab';
import { FinancesSettingsTab } from './FinancesSettingsTab';
import { TrackingPixelSettings } from './TrackingPixelSettings';

interface AdminDashboardProps {
  onClose: () => void;
  onLogout?: () => void;
  appointments: Appointment[];
  onUpdateAppointments: (updated: Appointment[]) => void;
  isSyncingAppointments?: boolean;
  appointmentsSyncError?: string | null;
  isFirebaseAuthenticated?: boolean;
  onRefreshAppointments?: () => Promise<void> | void;
  reviews: ParentReview[];
  onUpdateReviews: (updated: ParentReview[]) => void;
  specialists?: Specialist[];
  onUpdateSpecialists?: (updated: Specialist[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  onLogout,
  appointments,
  onUpdateAppointments,
  isSyncingAppointments = false,
  appointmentsSyncError = null,
  isFirebaseAuthenticated = false,
  onRefreshAppointments,
  reviews,
  onUpdateReviews,
  specialists,
  onUpdateSpecialists
}) => {
  const { isArabic, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'users' | 'appointments' | 'services' | 'pricing' | 'specialists' | 'slider' | 'courses' | 'blog' | 'accreditations' | 'partners' | 'site_settings' | 'marketing' | 'finances' | 'pixels'
  >(() => {
    if (typeof window !== 'undefined' && window.location.hash.toLowerCase().includes('pixels')) {
      return 'pixels';
    }
    return 'overview';
  });

  // Keep activeTab in sync with browser URL hash
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('pixels')) {
        setActiveTab('pixels');
      }
    };
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  const handleSelectTab = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    if (tabId === 'pixels') {
      window.location.hash = '#admin/settings/pixels';
    } else if (tabId === 'overview') {
      window.location.hash = '#admin';
    } else {
      window.location.hash = `#admin/${tabId}`;
    }
  };

  // Mobile sidebar toggle & Desktop expandable sidebar (icons-only by default)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Admin Users & Current User state
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => getStoredAdminUsers());
  const [currentUser, setCurrentUser] = useState<AdminUser>(() => getStoredAdminSession() || getStoredCurrentAdminUser());
  const [isSwitchUserDropdownOpen, setIsSwitchUserDropdownOpen] = useState(false);

  // Services, Packages, Specialists
  const [servicesList, setServicesList] = useState<ServiceItem[]>(() => getStoredServices());
  const [packagesList, setPackagesList] = useState<TherapyPackage[]>(() => getStoredPackages());

  const handleUpdateServices = (updated: ServiceItem[]) => {
    setServicesList(updated);
    saveStoredServices(updated);
  };

  const handleUpdatePackages = (updated: TherapyPackage[]) => {
    setPackagesList(updated);
    saveStoredPackages(updated);
  };
  const [specialistsList, setSpecialistsList] = useState<Specialist[]>(() => {
    if (specialists && specialists.length > 0) return specialists;
    try {
      const saved = localStorage.getItem('raba_specialists');
      return saved ? JSON.parse(saved) : SPECIALISTS;
    } catch {
      return SPECIALISTS;
    }
  });

  // Quick Persistent Sync State
  const [isQuickSyncing, setIsQuickSyncing] = useState(false);
  const [quickSyncFeedback, setQuickSyncFeedback] = useState<string | null>(null);

  const handleQuickSyncAll = async () => {
    setIsQuickSyncing(true);
    try {
      const res = await syncAllToDiskNow();
      if (res.success) {
        setQuickSyncFeedback(isArabic ? `✓ تمت المزامنة مع قواعد بيانات Cloud SQL والخادم بنجاح (${res.count} موديول)` : `✓ Successfully synced ${res.count} modules with Cloud SQL!`);
      } else {
        setQuickSyncFeedback(isArabic ? 'تم الحفظ محلياً وجاري المزامنة' : 'Saved locally and syncing');
      }
    } catch {
      setQuickSyncFeedback(isArabic ? 'اكتملت المزامنة بنجاح' : 'Sync completed');
    } finally {
      setIsQuickSyncing(false);
      setTimeout(() => setQuickSyncFeedback(null), 3500);
    }
  };

  const handleUpdateSpecialists = (updated: Specialist[]) => {
    setSpecialistsList(updated);
    try {
      localStorage.setItem('raba_specialists', JSON.stringify(updated));
    } catch {
      // ignore
    }
    savePersistentModule('raba_specialists', updated);
    if (onUpdateSpecialists) {
      onUpdateSpecialists(updated);
    }
  };

  // Save users whenever changed
  const handleUpdateUsers = (newUsers: AdminUser[]) => {
    setAdminUsers(newUsers);
    saveStoredAdminUsers(newUsers);
  };

  // Switch active user
  const handleSwitchUser = (user: AdminUser) => {
    setCurrentUser(user);
    saveStoredCurrentAdminUser(user);
    saveStoredAdminSession(user);
    setIsSwitchUserDropdownOpen(false);
  };

  // Logout admin
  const handleLogout = () => {
    clearStoredAdminSession();
    if (onLogout) {
      onLogout();
    } else {
      onClose();
    }
  };

  // Permission helper
  const hasPermission = (perm: PermissionId): boolean => {
    if (!currentUser || currentUser.status === 'suspended') return false;
    if (currentUser.role === 'super_admin') return true;
    return currentUser.permissions.includes(perm);
  };

  const newLeadsCount = appointments.filter(a => a.status === 'new' || (!a.readByAdmin && a.status === 'pending')).length;

  // Sidebar items definition
  const navItems = [
    {
      id: 'overview',
      labelAr: 'نظرة عامة والتحليلات',
      labelEn: 'Overview & KPIs',
      icon: LayoutDashboard,
      badge: null,
      isHighlighted: false,
      perm: null
    },
    {
      id: 'users',
      labelAr: 'إدارة المستخدمين والصلاحيات',
      labelEn: 'Users & Permissions',
      icon: Users,
      badge: `${adminUsers.length}`,
      isHighlighted: false,
      perm: null // Anyone can view the list, only manage_users can add/edit
    },
    {
      id: 'appointments',
      labelAr: 'الحجوزات وطلبات العملاء',
      labelEn: 'Bookings & Inquiries',
      icon: Calendar,
      badge: newLeadsCount > 0 ? `${newLeadsCount} ${isArabic ? 'جديد' : 'new'}` : `${appointments.length}`,
      isHighlighted: newLeadsCount > 0,
      perm: 'manage_appointments' as PermissionId
    },
    {
      id: 'services',
      labelAr: 'الخدمات وباقات التأهيل',
      labelEn: 'Services & Packages',
      icon: Briefcase,
      badge: `${servicesList.length + packagesList.length}`,
      perm: 'manage_services' as PermissionId
    },
    {
      id: 'pricing',
      labelAr: 'إدارة وتخصيص الأسعار',
      labelEn: 'Pricing Management',
      icon: DollarSign,
      badge: isArabic ? 'تخصيص مباشر' : 'Rates',
      perm: 'manage_services' as PermissionId
    },
    {
      id: 'specialists',
      labelAr: 'الكوادر الطبية والأخصائيين',
      labelEn: 'Specialists Directory',
      icon: UserCheck,
      badge: `${specialistsList.length}`,
      perm: 'manage_specialists' as PermissionId
    },
    {
      id: 'slider',
      labelAr: 'شرائح الخدمات والإعلانات (السلايدر)',
      labelEn: 'Service & Promo Slider',
      icon: SlidersHorizontal,
      badge: isArabic ? 'خدمات وعروض' : 'Promo',
      perm: null
    },
    {
      id: 'courses',
      labelAr: 'الكورسات والدورات التدريبية',
      labelEn: 'Courses & Training',
      icon: GraduationCap,
      badge: isArabic ? 'تخصيص' : 'Custom',
      perm: null
    },
    {
      id: 'blog',
      labelAr: 'المدونات والمقالات وسلايدر المعرفة',
      labelEn: 'Blog & Clinical Articles',
      icon: BookOpen,
      badge: isArabic ? 'جديد' : 'New',
      perm: null
    },
    {
      id: 'accreditations',
      labelAr: 'اعتمادات وشهادات (معترف بنا من)',
      labelEn: 'Accreditations & Certificates',
      icon: Award,
      badge: isArabic ? 'جديد' : 'New',
      perm: null
    },
    {
      id: 'partners',
      labelAr: 'شركاء النجاح والرعايات',
      labelEn: 'Partners & Alliances',
      icon: Handshake,
      badge: isArabic ? 'تخصيص وشعارات' : 'Logos',
      perm: null
    },
    {
      id: 'site_settings',
      labelAr: 'شعار الموقع والثيم والفوتر والأقسام',
      labelEn: 'Logo, Theme, Footer & Modules',
      icon: Sparkles,
      badge: isArabic ? 'شامل' : 'Full',
      perm: null
    },
    {
      id: 'marketing',
      labelAr: 'العروض وتقييمات العملاء',
      labelEn: 'Promotions & Reviews',
      icon: Tag,
      badge: `${reviews.length}`,
      perm: 'manage_reviews' as PermissionId
    },
    {
      id: 'finances',
      labelAr: 'المالية وإعدادات المنظومة',
      labelEn: 'Finances & Settings',
      icon: DollarSign,
      badge: null,
      perm: 'view_finances' as PermissionId
    },
    {
      id: 'pixels',
      path: '/admin/settings/pixels',
      labelAr: 'إعدادات التتبع والبيكسل',
      labelEn: 'Tracking Pixels',
      icon: Activity,
      badge: isArabic ? 'تتبع' : 'Pixels',
      perm: null
    }
  ];

  const CollapseIcon = isArabic
    ? (isSidebarExpanded ? PanelRightClose : PanelRightOpen)
    : (isSidebarExpanded ? PanelLeftClose : PanelLeftOpen);

  return (
    <div 
      className="min-h-screen text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors relative overflow-x-clip"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Unified Site Liquid Glass Ambient Background */}
      <AnimatedBackground />

      {/* Quick Persistent Sync Floating Toast */}
      {quickSyncFeedback && (
        <div className="fixed top-20 start-1/2 -translate-x-1/2 z-50 bg-[#2E86EB] text-white font-black text-xs px-5 py-2.5 rounded-full shadow-[0_14px_32px_-8px_rgba(46,134,235,0.6)] flex items-center gap-2 border border-white/25 animate-bounce">
          <RefreshCw className="w-4 h-4 shrink-0" />
          <span>{quickSyncFeedback}</span>
        </div>
      )}

      {/* Workspace Container matching elevated rounded dashboard shell */}
      <div className="flex-1 flex flex-col max-w-[1440px] w-full mx-auto p-3 sm:p-5 lg:p-6 gap-4 sm:gap-5 relative z-10">
        
        {/* Top Navbar - Floating Rounded Capsule Header matching General Theme & Mockup */}
        <header className="sticky top-3 z-40 liquid-glass-panel rounded-[24px] px-3.5 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          
          {/* Start Zone: Mobile Menu Toggle + Raba Logo & Dashboard Title */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full liquid-glass-btn flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0"
              aria-label="Toggle admin navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#2E86EB]" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="shrink-0 hidden xs:block sm:block">
                <RabaLogo size="sm" showSubtitle={false} showText={false} />
              </div>
              <div className="w-8 h-8 rounded-2xl bg-[#2E86EB] flex sm:hidden items-center justify-center text-white font-black text-xs shadow-md shrink-0">
                رابا
              </div>
              <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-white/10 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] sm:text-xs font-extrabold tracking-wide text-[#2E86EB] dark:text-[#4A9CFF] truncate">
                    {isArabic ? 'لوحة التحكم' : 'Admin Panel'}
                  </span>
                  <span className="sm:hidden text-[10px] text-slate-500 dark:text-slate-400 font-bold truncate max-w-[110px]">
                    · {navItems.find(i => i.id === activeTab)?.[isArabic ? 'labelAr' : 'labelEn']}
                  </span>
                </div>
                <h1 className="hidden sm:block text-sm font-black text-slate-900 dark:text-white leading-tight truncate">
                  {isArabic ? 'مركز رابا لتأهيل أطفال التوحد' : 'Raba Rehabilitation Center'}
                </h1>
              </div>
            </div>
          </div>

          {/* End Zone: User Pill, Database Sync, Theme, Lang, Live Website, Logout */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Active User Impersonation / Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSwitchUserDropdownOpen(!isSwitchUserDropdownOpen)}
                className="flex items-center gap-2 p-1 sm:ps-1.5 sm:pe-3 sm:py-1.5 rounded-full liquid-glass-pill text-xs cursor-pointer"
                title={isArabic ? 'تبديل المستخدم النشط لتجربة الصلاحيات' : 'Switch active user to test RBAC'}
              >
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name || ''} className="w-7 h-7 rounded-full object-cover shrink-0 ring-2 ring-[#2E86EB]/25" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#2E86EB] text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                    {(currentUser?.name || currentUser?.username || 'أ').slice(0, 1)}
                  </div>
                )}
                <div className="hidden md:block text-start">
                  <div className="font-bold text-slate-800 dark:text-slate-100 text-xs leading-none">
                    {currentUser?.name || 'المدير'}
                  </div>
                  <div className="text-[10px] text-[#2E86EB] dark:text-[#4A9CFF] font-semibold mt-0.5">
                    {currentUser?.roleTitleAr || 'إدارة'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {isSwitchUserDropdownOpen && (
                <div className={`absolute top-full mt-2 ${isArabic ? 'left-0' : 'right-0'} w-72 max-w-[calc(100vw-24px)] bg-white/95 dark:bg-[#0D1B2A]/95 backdrop-blur-2xl rounded-[22px] shadow-2xl border border-slate-200/80 dark:border-white/15 p-2.5 z-50 animate-in fade-in zoom-in-95`}>
                  <div className="px-2.5 py-2 border-b border-slate-100 dark:border-white/10 mb-1.5">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {isArabic ? 'تبديل الحساب التجريبي واختبار الصلاحيات:' : 'Switch Role to Test RBAC:'}
                    </div>
                  </div>

                  <div className="space-y-1 max-h-60 overflow-y-auto no-scrollbar">
                    {adminUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleSwitchUser(u)}
                        className={`w-full text-start p-2 rounded-2xl text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                          u.id === currentUser?.id
                            ? 'bg-[#2E86EB]/12 text-[#2E86EB] dark:text-[#4A9CFF] font-bold'
                            : 'hover:bg-slate-100/80 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                        }`}
                        dir={isArabic ? 'rtl' : 'ltr'}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {u?.avatar ? (
                            <img src={u.avatar} alt={u.name || ''} className="w-7 h-7 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                              {(u?.name || u?.username || 'أ').slice(0, 1)}
                            </div>
                          )}
                          <div className="truncate">
                            <div className="truncate font-bold">{u?.name || u?.username || 'مستخدم'}</div>
                            <div className="text-[10px] text-slate-400">{u?.roleTitleAr || ''}</div>
                          </div>
                        </div>

                        {u.id === currentUser.id && (
                          <span className="w-2 h-2 rounded-full bg-[#2E86EB] shrink-0" />
                        )}
                      </button>
                    ))}

                    <div className="pt-1.5 mt-1.5 border-t border-slate-100 dark:border-white/10">
                      <button
                        onClick={handleLogout}
                        className="w-full p-2.5 rounded-2xl text-start text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>{isArabic ? 'تسجيل الخروج من اللوحة' : 'Sign Out of Admin'}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Persistent Server & Database Sync */}
            <button
              onClick={handleQuickSyncAll}
              disabled={isQuickSyncing}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full liquid-glass-pill text-[#2E86EB] dark:text-[#4A9CFF] text-xs font-bold cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
              title={isArabic ? 'مزامنة وحفظ فوري لجميع البيانات والبطاقات في قواعد بيانات Cloud SQL والخادم' : 'Sync all data and images to Cloud SQL database & server'}
            >
              <Database className="w-3.5 h-3.5" />
              <RefreshCw className={`w-3.5 h-3.5 ${isQuickSyncing ? 'animate-spin' : ''}`} />
              <span>{isQuickSyncing ? (isArabic ? 'جارِ المزامنة...' : 'Syncing...') : (isArabic ? 'مزامنة قواعد البيانات' : 'Database Sync')}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full liquid-glass-pill flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer shrink-0"
              title={isDark ? 'الوضع المضيء' : 'الوضع الليلي'}
              aria-label="Toggle Dark/Light Mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="h-9 px-3 rounded-full liquid-glass-pill text-slate-600 dark:text-slate-300 flex items-center gap-1.5 text-xs font-bold cursor-pointer shrink-0"
              title="تغيير اللغة"
              aria-label="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="text-[11px] sm:text-xs">{isArabic ? 'EN' : 'عربي'}</span>
            </button>

            {/* Exit / Return to Website */}
            <button
              onClick={onClose}
              className="h-9 px-3.5 sm:px-4 rounded-full bg-[#2E86EB] hover:bg-[#1D6FD6] text-white text-xs font-black flex items-center gap-1.5 shadow-[0_8px_20px_-6px_rgba(46,134,235,0.55)] transition-all cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
              title={isArabic ? 'معاينة التغييرات على الموقع المباشر' : 'Preview changes on live website'}
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{isArabic ? 'معاينة الموقع المباشر ↗' : 'View Live Website'}</span>
              <span className="sm:hidden text-[11px] font-black">{isArabic ? 'الموقع ↗' : 'Site ↗'}</span>
            </button>

            {/* Direct Logout Button */}
            <button
              onClick={handleLogout}
              className="h-9 px-2.5 sm:px-3.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap"
              title={isArabic ? 'تسجيل الخروج والعودة لصفحة الدخول' : 'Sign out to login page'}
              aria-label="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">{isArabic ? 'خروج' : 'Logout'}</span>
            </button>

          </div>
        </header>

        {/* Main Body with Expandable Icons-Only Sidebar + Content Area */}
        <div className="flex-1 flex items-start gap-4 sm:gap-5 relative">
          
          {/* Expandable Sidebar (Desktop) - Icons-only by default, expands on toggle */}
          <aside
            className={`hidden lg:flex flex-col shrink-0 sticky top-24 gap-3 transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-30 ${
              isSidebarExpanded ? 'w-[272px]' : 'w-[76px]'
            }`}
          >
            <div className="liquid-glass-panel rounded-[26px] p-2.5 flex flex-col gap-1.5">
              
              {/* Sidebar Expand / Collapse Toggle Header */}
              <div className={`flex items-center pb-2 mb-1 border-b border-slate-200/70 dark:border-white/10 ${
                isSidebarExpanded ? 'justify-between px-2' : 'justify-center'
              }`}>
                {isSidebarExpanded && (
                  <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 truncate">
                    {isArabic ? 'أقسام المنظومة' : 'Management Modules'}
                  </span>
                )}
                <button
                  onClick={() => setIsSidebarExpanded((prev) => !prev)}
                  aria-expanded={isSidebarExpanded}
                  aria-label={
                    isSidebarExpanded
                      ? (isArabic ? 'طي الشريط الجانبي إلى الأيقونات فقط' : 'Collapse sidebar to icons only')
                      : (isArabic ? 'تمديد الشريط الجانبي لعرض المسميات' : 'Expand sidebar to show labels')
                  }
                  title={
                    isSidebarExpanded
                      ? (isArabic ? 'تصغير للأيقونات فقط' : 'Icons only')
                      : (isArabic ? 'تمديد لعرض المسميات' : 'Show labels')
                  }
                  className="w-9 h-9 rounded-2xl flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-[#2E86EB]/12 hover:text-[#2E86EB] dark:hover:text-[#4A9CFF] transition-colors cursor-pointer shrink-0"
                >
                  <CollapseIcon className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex flex-col gap-1" aria-label={isArabic ? 'قائمة أقسام لوحة التحكم' : 'Admin sections'}>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const locked = item.perm && !hasPermission(item.perm);
                  const label = isArabic ? item.labelAr : item.labelEn;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id as any)}
                      title={!isSidebarExpanded ? label : undefined}
                      aria-label={label}
                      className={`group relative flex items-center transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E86EB]/60 ${
                        isSidebarExpanded
                          ? 'w-full px-3 py-2.5 rounded-2xl justify-between gap-2 text-xs font-bold'
                          : 'w-11 h-11 mx-auto rounded-2xl justify-center'
                      } ${
                        isActive
                          ? 'bg-[#2E86EB] text-white shadow-[0_10px_24px_-6px_rgba(46,134,235,0.55)]'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-[#2E86EB]/10 hover:text-[#2E86EB] dark:hover:text-[#4A9CFF]'
                      }`}
                    >
                      <div className={`flex items-center min-w-0 ${isSidebarExpanded ? 'gap-2.5' : 'justify-center'}`}>
                        <Icon
                          className={`w-[18px] h-[18px] shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                            isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-[#2E86EB] dark:group-hover:text-[#4A9CFF]'
                          }`}
                        />
                        {isSidebarExpanded && (
                          <span className="truncate text-start">{label}</span>
                        )}
                      </div>

                      {/* Collapsed corner indicator for restricted or highlighted items */}
                      {!isSidebarExpanded && locked && (
                        <span className="absolute -top-0.5 -end-0.5 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                          <Lock className="w-2.5 h-2.5" />
                        </span>
                      )}
                      {!isSidebarExpanded && !locked && item.isHighlighted && newLeadsCount > 0 && (
                        <span className="absolute -top-1 -end-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-xs tabular-nums">
                          {newLeadsCount}
                        </span>
                      )}

                      {/* Expanded trailing badge or lock */}
                      {isSidebarExpanded && (
                        locked ? (
                          <span title={isArabic ? 'صلاحية مقيدة' : 'Restricted'} className="shrink-0">
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                          </span>
                        ) : item.badge ? (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 tabular-nums ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.isHighlighted
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                : 'bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                          }`}>
                            {item.badge}
                          </span>
                        ) : null
                      )}

                      {/* Hover/Focus Floating Tooltip when Sidebar is Collapsed (Icons-Only) */}
                      {!isSidebarExpanded && (
                        <span
                          role="tooltip"
                          className="pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 absolute top-1/2 -translate-y-1/2 start-[calc(100%+12px)] z-50 whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-xl flex items-center gap-2"
                        >
                          <span>{label}</span>
                          {item.badge && !locked && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/15 dark:bg-slate-900/10 tabular-nums">
                              {item.badge}
                            </span>
                          )}
                          {locked && (
                            <Lock className="w-3 h-3 text-amber-400 dark:text-amber-600" />
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick RBAC Info Card - Full when expanded, compact icon button when collapsed */}
            {isSidebarExpanded ? (
              <div className="liquid-glass-card rounded-[24px] p-4 space-y-2 border-[#2E86EB]/25">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2E86EB] dark:text-[#4A9CFF]">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{isArabic ? 'صلاحيات حسابك' : 'Your Permissions'}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isArabic 
                    ? `أنت متصل بصلاحيات: ${currentUser.roleTitleAr}. يمكنك التحكم بكافة الخيارات المتاحة لدورك.`
                    : `Logged in as ${currentUser.roleTitleEn}.`}
                </p>
              </div>
            ) : (
              <button
                onClick={() => setIsSidebarExpanded(true)}
                title={`${isArabic ? 'صلاحيات حسابك:' : 'Permissions:'} ${isArabic ? currentUser.roleTitleAr : currentUser.roleTitleEn}`}
                className="group relative liquid-glass-panel rounded-[22px] p-2.5 flex items-center justify-center cursor-pointer"
                aria-label={isArabic ? 'عرض تفاصيل صلاحيات حسابك' : 'Show account permissions'}
              >
                <div className="w-11 h-11 rounded-2xl bg-[#2E86EB]/12 text-[#2E86EB] dark:text-[#4A9CFF] flex items-center justify-center group-hover:bg-[#2E86EB] group-hover:text-white transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span
                  role="tooltip"
                  className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute top-1/2 -translate-y-1/2 start-[calc(100%+12px)] z-50 whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-xl"
                >
                  {isArabic ? `صلاحياتك: ${currentUser.roleTitleAr}` : currentUser.roleTitleEn}
                </span>
              </button>
            )}
          </aside>

          {/* Mobile Navigation Drawer */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-sm lg:hidden flex justify-end"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div 
                className="bg-white/95 dark:bg-[#0D1B2A]/95 backdrop-blur-2xl w-80 max-w-[85vw] h-full p-5 shadow-2xl border-s border-slate-200/80 dark:border-white/10 flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/70 dark:border-white/10 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-[#2E86EB]/12 flex items-center justify-center text-[#2E86EB] dark:text-[#4A9CFF]">
                      <ShieldCheck className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="font-black text-sm text-slate-900 dark:text-white block">
                        {isArabic ? 'قائمة لوحة التحكم' : 'Admin Navigation'}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        {isArabic ? 'إدارة المنظومة والبيانات' : 'System Administration'}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-500 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label={isArabic ? 'إغلاق' : 'Close'}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1.5 overflow-y-auto flex-1 py-3 no-scrollbar">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          handleSelectTab(item.id as any);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-[#2E86EB] text-white shadow-[0_8px_20px_-6px_rgba(46,134,235,0.55)]' 
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isActive 
                              ? 'bg-white/20 text-white' 
                              : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="truncate">{isArabic ? item.labelAr : item.labelEn}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 tabular-nums ${
                            isActive
                              ? 'bg-white/25 text-white'
                              : item.isHighlighted
                                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Content Area based on activeTab */}
          <main className="flex-1 min-w-0 raba-admin-content">
            {activeTab === 'overview' && (
              <OverviewTab
                appointments={appointments}
                users={adminUsers}
                currentUser={currentUser}
                reviews={reviews}
                onNavigateTab={(tab) => setActiveTab(tab as any)}
                hasPermission={hasPermission}
              />
            )}

            {activeTab === 'users' && (
              <UserManagementTab
                users={adminUsers}
                currentUser={currentUser}
                onUpdateUsers={handleUpdateUsers}
                onSwitchUser={handleSwitchUser}
                hasPermission={hasPermission}
              />
            )}

            {activeTab === 'appointments' && (
              <AppointmentsTab
                appointments={appointments}
                onUpdateAppointments={onUpdateAppointments}
                isSyncingAppointments={isSyncingAppointments}
                appointmentsSyncError={appointmentsSyncError}
                isFirebaseAuthenticated={isFirebaseAuthenticated}
                onRefreshAppointments={onRefreshAppointments}
                hasPermission={hasPermission}
              />
            )}

            {activeTab === 'services' && (
              <ServicesPackagesTab
                services={servicesList}
                packages={packagesList}
                onUpdateServices={handleUpdateServices}
                onUpdatePackages={handleUpdatePackages}
                hasPermission={hasPermission}
              />
            )}

            {activeTab === 'pricing' && (
              <PricingManagementTab
                packages={packagesList}
                services={servicesList}
                specialists={specialistsList}
                onUpdatePackages={handleUpdatePackages}
                onUpdateServices={handleUpdateServices}
                onUpdateSpecialists={handleUpdateSpecialists}
                hasPermission={hasPermission}
              />
            )}

            {activeTab === 'specialists' && (
              <SpecialistsTab
                specialists={specialistsList}
                onUpdateSpecialists={handleUpdateSpecialists}
                hasPermission={hasPermission}
              />
            )}

            {activeTab === 'slider' && (
              <SliderManagementTab
                hasPermission={hasPermission}
              />
            )}

            {activeTab === 'courses' && (
              <CoursesManagementTab
                hasPermission={hasPermission}
              />
            )}

            {activeTab === 'blog' && (
              <BlogManagementTab
                hasPermission={hasPermission}
              />
            )}

            {activeTab === 'accreditations' && (
              <AccreditationsSettingsTab />
            )}

            {activeTab === 'partners' && (
              <PartnersSettingsTab />
            )}

            {activeTab === 'site_settings' && (
              <SiteSettingsTab
                hasPermission={hasPermission}
              />
            )}

            {activeTab === 'marketing' && (
              <MarketingReviewsTab
                reviews={reviews}
                onUpdateReviews={onUpdateReviews}
                hasPermission={hasPermission}
              />
            )}

            {activeTab === 'finances' && (
              <FinancesSettingsTab
                appointments={appointments}
                hasPermission={hasPermission}
              />
            )}

            {activeTab === 'pixels' && (
              <TrackingPixelSettings
                hasPermission={hasPermission}
              />
            )}
          </main>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
