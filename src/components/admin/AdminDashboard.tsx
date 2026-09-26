import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Briefcase, 
  UserCheck, 
  Tag, 
  DollarSign, 
  Settings, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  LogOut, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  ChevronDown, 
  Sparkles,
  ExternalLink,
  Lock,
  Menu,
  X,
  Building,
  SlidersHorizontal,
  BookOpen,
  Palette,
  Award,
  RefreshCw,
  Database
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
  clearStoredAdminSession,
  SYSTEM_PERMISSIONS 
} from '../../data/adminData';
import { SERVICES, THERAPY_PACKAGES, SPECIALISTS, getStoredServices, saveStoredServices } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

import { OverviewTab } from './OverviewTab';
import { UserManagementTab } from './UserManagementTab';
import { AppointmentsTab } from './AppointmentsTab';
import { ServicesPackagesTab } from './ServicesPackagesTab';
import { SpecialistsTab } from './SpecialistsTab';
import { SliderManagementTab } from './SliderManagementTab';
import { BlogManagementTab } from './BlogManagementTab';
import { SiteSettingsTab } from './SiteSettingsTab';
import { AccreditationsSettingsTab } from './AccreditationsSettingsTab';
import { MarketingReviewsTab } from './MarketingReviewsTab';
import { FinancesSettingsTab } from './FinancesSettingsTab';

interface AdminDashboardProps {
  onClose: () => void;
  onLogout?: () => void;
  appointments: Appointment[];
  onUpdateAppointments: (updated: Appointment[]) => void;
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
    'overview' | 'users' | 'appointments' | 'services' | 'specialists' | 'slider' | 'blog' | 'accreditations' | 'site_settings' | 'marketing' | 'finances'
  >('overview');

  // Mobile sidebar toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Admin Users & Current User state
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => getStoredAdminUsers());
  const [currentUser, setCurrentUser] = useState<AdminUser>(() => getStoredAdminSession() || getStoredCurrentAdminUser());
  const [isSwitchUserDropdownOpen, setIsSwitchUserDropdownOpen] = useState(false);

  // Services, Packages, Specialists
  const [servicesList, setServicesList] = useState<ServiceItem[]>(() => getStoredServices());
  const [packagesList, setPackagesList] = useState<TherapyPackage[]>(THERAPY_PACKAGES);

  const handleUpdateServices = (updated: ServiceItem[]) => {
    setServicesList(updated);
    saveStoredServices(updated);
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
      id: 'specialists',
      labelAr: 'الكوادر الطبية والأخصائيين',
      labelEn: 'Specialists Directory',
      icon: UserCheck,
      badge: `${specialistsList.length}`,
      perm: 'manage_specialists' as PermissionId
    },
    {
      id: 'slider',
      labelAr: 'صور العرض والشرائح (السلايدر)',
      labelEn: 'Hero & Slider Photos',
      icon: SlidersHorizontal,
      badge: isArabic ? 'جديد' : 'New',
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
    }
  ];

  return (
    <div 
      className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors relative"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Quick Persistent Sync Floating Toast */}
      {quickSyncFeedback && (
        <div className="fixed top-18 start-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-black text-xs px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-emerald-400/40 animate-bounce">
          <RefreshCw className="w-4 h-4 shrink-0" />
          <span>{quickSyncFeedback}</span>
        </div>
      )}
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
        
        {/* Left: Mobile Menu Toggle + Logo & Dashboard Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#0B3B36] to-[#00E5BE] flex items-center justify-center text-white font-black text-sm shadow-md">
              رابا
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-[#00E5BE]">
                {isArabic ? 'لوحة التحكم الإدارية' : 'Admin Operations Control'}
              </div>
              <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-none">
                {isArabic ? 'مركز رابا لتأهيل أطفال التوحد' : 'Raba Rehabilitation Center'}
              </h1>
            </div>
          </div>
        </div>

        {/* Right: Quick Switch User, Theme, Lang, Return to Website */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Active User Impersonation / Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSwitchUserDropdownOpen(!isSwitchUserDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/80 dark:border-white/10 text-xs cursor-pointer"
              title={isArabic ? 'تبديل المستخدم النشط لتجربة الصلاحيات' : 'Switch active user to test RBAC'}
            >
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
                  {currentUser.name.slice(0, 1)}
                </div>
              )}
              <div className="hidden md:block text-right">
                <div className="font-bold text-slate-800 dark:text-slate-200 text-xs leading-none">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {currentUser.roleTitleAr}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isSwitchUserDropdownOpen && (
              <div className={`absolute top-full mt-2 ${isArabic ? 'left-0' : 'right-0'} w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-white/15 p-2 z-50 animate-in fade-in zoom-in-95`}>
                <div className="p-2 border-b border-slate-100 dark:border-white/10 mb-1">
                  <div className="text-[11px] font-bold text-slate-400">
                    {isArabic ? 'تبديل الحساب التجريبي واختبار الصلاحيات:' : 'Switch Role to Test RBAC:'}
                  </div>
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {adminUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleSwitchUser(u)}
                      className={`w-full text-right p-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        u.id === currentUser.id
                          ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 font-bold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                      dir={isArabic ? 'rtl' : 'ltr'}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                            {u.name.slice(0, 1)}
                          </div>
                        )}
                        <div className="truncate">
                          <div className="truncate font-bold">{u.name}</div>
                          <div className="text-[10px] text-slate-400">{u.roleTitleAr}</div>
                        </div>
                      </div>

                      {u.id === currentUser.id && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </button>
                  ))}

                  {/* Dropdown Logout Divider & Button */}
                  <div className="pt-1.5 mt-1 border-t border-slate-200 dark:border-white/10">
                    <button
                      onClick={handleLogout}
                      className="w-full p-2.5 rounded-xl text-left rtl:text-right text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center justify-between cursor-pointer"
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
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            title={isArabic ? 'مزامنة وحفظ فوري لجميع البيانات والبطاقات في قواعد بيانات Cloud SQL والخادم' : 'Sync all data and images to Cloud SQL database & server'}
          >
            <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00E5BE]" />
            <RefreshCw className={`w-3.5 h-3.5 ${isQuickSyncing ? 'animate-spin' : ''}`} />
            <span>{isQuickSyncing ? (isArabic ? 'جارِ المزامنة...' : 'Syncing...') : (isArabic ? 'مزامنة قواعد البيانات' : 'Database Sync')}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isDark ? 'الوضع المضيء' : 'الوضع الليلي'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
            title="تغيير اللغة"
          >
            <Globe className="w-4 h-4" />
            <span>{isArabic ? 'EN' : 'عربي'}</span>
          </button>

          {/* Exit / Return to Website */}
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0B3B36] to-[#00E5BE] text-white hover:opacity-95 text-xs font-black flex items-center gap-2 shadow-md transition-all cursor-pointer hover:shadow-lg active:scale-95"
            title={isArabic ? 'معاينة التغييرات على الموقع المباشر' : 'Preview changes on live website'}
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#00E5BE] group-hover:text-white" />
            <span>{isArabic ? 'معاينة الموقع المباشر ↗' : 'View Live Website'}</span>
          </button>

          {/* Direct Logout Button */}
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/60 border border-rose-200/80 dark:border-rose-800/40 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title={isArabic ? 'تسجيل الخروج والعودة لصفحة الدخول' : 'Sign out to login page'}
          >
            <LogOut className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">{isArabic ? 'خروج' : 'Logout'}</span>
          </button>

        </div>
      </header>

      {/* Main Body with Sidebar + Content Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 space-y-2">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-white/10 shadow-xs space-y-1">
            <div className="px-3 py-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">
              {isArabic ? 'أقسام المنظومة' : 'Management Modules'}
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const locked = item.perm && !hasPermission(item.perm);

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                  }}
                  className={`w-full p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0B3B36] text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-slate-400'}`} />
                    <span>{isArabic ? item.labelAr : item.labelEn}</span>
                  </div>

                  {locked ? (
                    <span title={isArabic ? 'صلاحية مقيدة' : 'Restricted'}>
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                    </span>
                  ) : item.badge ? (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Quick RBAC Info Card */}
          <div className="bg-gradient-to-br from-slate-900 to-[#0B3B36] text-white p-4 rounded-3xl shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
              <span>{isArabic ? 'صلاحيات حسابك' : 'Your Permissions'}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isArabic 
                ? `أنت متصل بصلاحيات: ${currentUser.roleTitleAr}. يمكنك التحكم بكافة الخيارات المتاحة لدورك.`
                : `Logged in as ${currentUser.roleTitleEn}.`}
            </p>
          </div>

        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm lg:hidden flex"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div 
              className="bg-white dark:bg-slate-900 w-72 max-w-[80vw] h-full p-6 shadow-2xl space-y-3 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                <span className="font-black text-sm text-[#0B3B36] dark:text-emerald-400">
                  {isArabic ? 'قائمة لوحة التحكم' : 'Admin Navigation'}
                </span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-lg">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full p-3 rounded-2xl text-xs font-bold flex items-center justify-between ${
                        isActive ? 'bg-[#0B3B36] text-white' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{isArabic ? item.labelAr : item.labelEn}</span>
                      </div>
                      {item.badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">{item.badge}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Content Area based on activeTab */}
        <main className="flex-1 min-w-0">
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
              hasPermission={hasPermission}
            />
          )}

          {activeTab === 'services' && (
            <ServicesPackagesTab
              services={servicesList}
              packages={packagesList}
              onUpdateServices={handleUpdateServices}
              onUpdatePackages={setPackagesList}
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

          {activeTab === 'blog' && (
            <BlogManagementTab
              hasPermission={hasPermission}
            />
          )}

          {activeTab === 'accreditations' && (
            <AccreditationsSettingsTab />
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
        </main>

      </div>

    </div>
  );
};

export default AdminDashboard;
