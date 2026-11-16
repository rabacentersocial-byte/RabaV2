import React from 'react';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowUpRight,
  Sparkles,
  PhoneCall,
  Activity,
  UserPlus,
  Star
} from 'lucide-react';
import { Appointment, AdminUser, PermissionId, ParentReview } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface OverviewTabProps {
  appointments: Appointment[];
  users: AdminUser[];
  currentUser: AdminUser;
  reviews: ParentReview[];
  onNavigateTab: (tabId: string) => void;
  hasPermission: (perm: PermissionId) => boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  appointments = [],
  users = [],
  currentUser,
  reviews = [],
  onNavigateTab,
  hasPermission
}) => {
  const { isArabic } = useLanguage();

  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const safeUsers = Array.isArray(users) ? users : [];
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const safeCurrentUser = currentUser || {
    id: 'admin-fallback',
    name: isArabic ? 'المدير العام' : 'Administrator',
    roleTitleAr: 'إدارة المنظومة',
    roleTitleEn: 'System Admin',
    department: 'الإدارة العامة'
  };

  const totalRevenue = safeAppointments
    .filter(a => a && (a.status === 'confirmed' || a.status === 'completed'))
    .reduce((sum, a) => sum + (Number(a.amount) || 0), 0);

  const confirmedCount = safeAppointments.filter(a => a && a.status === 'confirmed').length;
  const pendingCount = safeAppointments.filter(a => a && a.status === 'pending').length;
  const completedCount = safeAppointments.filter(a => a && a.status === 'completed').length;
  const activeUsersCount = safeUsers.filter(u => u && u.status === 'active').length;

  const averageRating = safeReviews.length > 0 
    ? (safeReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / safeReviews.length).toFixed(1)
    : '4.9';

  return (
    <div className="space-y-6">
      
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-br from-[#0D1B2A] via-[#133258] to-[#2E86EB] text-white p-6 sm:p-8 rounded-[28px] shadow-[0_20px_48px_-14px_rgba(46,134,235,0.38)] border border-white/15 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[#FFD23F] text-xs font-bold uppercase tracking-wider block mb-1">
              {isArabic ? 'منظومة إدارة مركز رابا للرعاية النهارية والتأهيل' : 'Raba Center Comprehensive Management Suite'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              {isArabic ? `أهلاً بك، ${safeCurrentUser.name || 'المدير'}` : `Welcome, ${safeCurrentUser.name || 'Admin'}`}
            </h1>
            <p className="text-blue-100/85 text-xs sm:text-sm mt-1 max-w-xl">
              {isArabic 
                ? `أنت مسجل كـ (${safeCurrentUser.roleTitleAr || 'إدارة'}) - قسم ${safeCurrentUser.department || 'الإدارة'}. لديك صلاحيات للتحكم بالمنظومة.` 
                : `Logged in as (${safeCurrentUser.roleTitleEn || 'Admin'}) - ${safeCurrentUser.department || 'Operations'}.`}
            </p>
          </div>

          {/* Quick Actions in Banner */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('pricing')}
              className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#FFD23F] to-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md hover:brightness-105 transition-all cursor-pointer whitespace-nowrap"
            >
              <DollarSign className="w-3.5 h-3.5 text-slate-950" />
              <span>{isArabic ? 'تخصيص الأسعار والباقات' : 'Customize Pricing'}</span>
            </button>

            <button
              onClick={() => onNavigateTab('site_settings')}
              className="px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer border border-white/15 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFD23F]" />
              <span>{isArabic ? 'تخصيص الشعار والموقع' : 'Customize Logo & Site'}</span>
            </button>

            {hasPermission('manage_users') && (
              <button
                onClick={() => onNavigateTab('users')}
                className="px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer border border-white/15 whitespace-nowrap"
              >
                <UserPlus className="w-3.5 h-3.5 text-blue-200" />
                <span>{isArabic ? 'إدارة المستخدمين' : 'Manage Users'}</span>
              </button>
            )}

            {hasPermission('manage_appointments') && (
              <button
                onClick={() => onNavigateTab('appointments')}
                className="px-4 py-2.5 rounded-full bg-white text-[#0D1B2A] hover:bg-blue-50 font-black text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                <Calendar className="w-3.5 h-3.5 text-[#1463D6]" />
                <span>{isArabic ? 'إدارة واستخراج تقارير الحجوزات' : 'Bookings & Reports'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Metric 1: Total Bookings */}
        <div className="liquid-glass-card p-5 rounded-[24px] relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {isArabic ? 'إجمالي الحجوزات المسجلة' : 'Total Bookings'}
            </span>
            <div className="w-10 h-10 rounded-full bg-[#2E86EB]/12 text-[#1463D6] dark:text-[#60AFFF] flex items-center justify-center font-bold shrink-0">
              <Calendar className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums">
            {safeAppointments.length}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#1463D6] dark:text-[#60AFFF] mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{isArabic ? `${pendingCount} طلب بانتظار التأكيد` : `${pendingCount} pending confirmation`}</span>
          </div>
        </div>

        {/* Metric 2: Confirmed Appointments */}
        <div className="liquid-glass-card p-5 rounded-[24px] relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {isArabic ? 'الحجوزات المؤكدة' : 'Confirmed Bookings'}
            </span>
            <div className="w-10 h-10 rounded-full bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums">
            {confirmedCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            {isArabic ? `${pendingCount} قيد الانتظار والمراجعة` : `${pendingCount} pending review`}
          </div>
        </div>

        {/* Metric 3: Active Administrative Users */}
        <div className="liquid-glass-card p-5 rounded-[24px] relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isArabic ? 'المستخدمين النشطين' : 'Active Staff Users'}
            </span>
            <div className="w-10 h-10 rounded-full bg-indigo-500/12 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums">
            {activeUsersCount} <span className="text-xs text-slate-400 font-normal">/ {safeUsers.length}</span>
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold mt-2">
            {isArabic ? 'نظام الصلاحيات مفعل' : 'RBAC enabled'}
          </div>
        </div>

        {/* Metric 4: Satisfaction Rating */}
        <div className="liquid-glass-card p-5 rounded-[24px] relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isArabic ? 'متوسط رضا المستفيدين' : 'Parent Satisfaction'}
            </span>
            <div className="w-10 h-10 rounded-full bg-amber-500/12 text-amber-500 flex items-center justify-center font-bold shrink-0">
              <Star className="w-4.5 h-4.5 fill-amber-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums">
            {averageRating} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-2">
            {isArabic ? `${safeReviews.length} تقييم معتمد` : `${safeReviews.length} reviews`}
          </div>
        </div>

      </div>

      {/* Two Columns: Recent Bookings & Quick System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left (2 Cols): Latest Bookings Table */}
        <div className="lg:col-span-2 liquid-glass-card rounded-[26px] p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isArabic ? 'أحدث حجوزات الجلسات والمواعيد' : 'Latest Session Bookings'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isArabic ? 'متابعة سريعة للمستفيدين والبرامج التأهيلية' : 'Real-time intake from parents and clinic schedule'}
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('appointments')}
              className="px-3.5 py-1.5 rounded-full liquid-glass-pill text-xs font-bold text-[#2E86EB] dark:text-[#4A9CFF] flex items-center gap-1 cursor-pointer"
            >
              <span>{isArabic ? 'عرض الكل' : 'View all'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-200/70 dark:divide-white/10">
            {safeAppointments.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50/70 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {isArabic ? 'لا توجد حجوزات مسجلة حالياً' : 'No bookings registered yet'}
                </p>
              </div>
            ) : (
              safeAppointments.slice(0, 5).map((app, idx) => {
                const childDisplayName = (app?.childName || (app as any)?.patientName || app?.guardianName || (isArabic ? 'مستفيد' : 'Beneficiary')).trim();
                const initial = (childDisplayName || 'م').slice(0, 2);
                const serviceLabel = app?.serviceTitle || (app as any)?.service || (isArabic ? 'جلسة تأهيلية' : 'Rehab Session');
                const appointmentDate = app?.date || (isArabic ? 'موعد جديد' : 'New Appointment');
                const timeSlot = app?.timeSlot || (app as any)?.time || '';
                const specialistName = app?.specialistName || (app as any)?.specialist || (isArabic ? 'أخصائي المركز' : 'Specialist');
                const isConfirmed = app?.status === 'confirmed' || app?.status === 'completed';

                return (
                  <div
                    key={`${app?.id || 'apt'}-${idx}`}
                    className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#2E86EB]/12 text-[#2E86EB] dark:text-[#4A9CFF] font-bold flex items-center justify-center shrink-0 text-xs">
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {childDisplayName} – <span className="font-normal text-slate-500 dark:text-slate-400">{serviceLabel}</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                          {appointmentDate} {timeSlot ? `· ${timeSlot}` : ''} {specialistName ? `· ${specialistName}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="text-end shrink-0">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isConfirmed
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                      }`}>
                        {isConfirmed ? (isArabic ? 'مؤكد' : 'Confirmed') : (isArabic ? 'قيد الانتظار' : 'Pending')}
                      </span>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
                        {Number(app?.amount) || 0} {isArabic ? 'ر.س' : 'SAR'}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right (1 Col): Active Admins & Staff Summary */}
        <div className="liquid-glass-card rounded-[26px] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isArabic ? 'فريق إدارة المنظومة' : 'Administrative Team'}
              </h3>
              <button
                onClick={() => onNavigateTab('users')}
                className="px-3 py-1 rounded-full liquid-glass-pill text-xs font-bold text-[#2E86EB] dark:text-[#4A9CFF] cursor-pointer"
              >
                {isArabic ? 'إدارة' : 'Manage'}
              </button>
            </div>

            <div className="divide-y divide-slate-200/70 dark:divide-white/10">
              {safeUsers.length === 0 ? (
                <div className="p-4 text-center rounded-2xl bg-slate-50/70 dark:bg-white/5 text-xs text-slate-600 dark:text-slate-300">
                  {isArabic ? 'لا يوجد مستخدمين' : 'No staff members'}
                </div>
              ) : (
                safeUsers.slice(0, 4).map((u, idx) => {
                  const userName = (u?.name || (u as any)?.username || (isArabic ? 'مستخدم' : 'User')).trim();
                  const userInitial = (userName || 'م').slice(0, 2);
                  const roleLabel = u?.roleTitleAr || u?.role || (isArabic ? 'عضو فريق' : 'Staff');
                  const permLength = Array.isArray(u?.permissions) ? u.permissions.length : 0;

                  return (
                    <div key={u?.id || `user-${idx}`} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {u?.avatar ? (
                          <img src={u.avatar} alt={userName} className="w-9 h-9 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#2E86EB]/12 text-[#2E86EB] dark:text-[#4A9CFF] text-xs font-bold flex items-center justify-center shrink-0">
                            {userInitial}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{userName}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{roleLabel}</div>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold text-[#2E86EB] dark:text-[#4A9CFF] bg-[#2E86EB]/10 px-2.5 py-0.5 rounded-full shrink-0 tabular-nums">
                        {permLength} {isArabic ? 'صلاحية' : 'perms'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Notice */}
          <div className="mt-6 pt-4 border-t border-slate-200/70 dark:border-white/10 text-center">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isArabic 
                ? 'مركز رابا - مرخص من وزارة الصحة وهيئة رعاية الأشخاص ذوي الإعاقة' 
                : 'Raba Center - Licensed by Ministry of Health & APD'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default OverviewTab;
