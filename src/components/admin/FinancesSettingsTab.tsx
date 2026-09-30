import React, { useState } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Building, 
  Phone, 
  Clock, 
  MapPin, 
  MessageSquare, 
  Check, 
  Download,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Appointment, PermissionId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface FinancesSettingsTabProps {
  appointments: Appointment[];
  hasPermission: (perm: PermissionId) => boolean;
}

export const FinancesSettingsTab: React.FC<FinancesSettingsTabProps> = ({
  appointments,
  hasPermission
}) => {
  const { isArabic } = useLanguage();

  const [clinicName, setClinicName] = useState('مركز رابا للرعاية النهارية وتأهيل أطفال التوحد');
  const [phone, setPhone] = useState('0575100100');
  const [whatsapp, setWhatsapp] = useState('0575100100');
  const [workingHours, setWorkingHours] = useState('السبت – الخميس: 8:00 ص – 9:00 م');
  const [address, setAddress] = useState('الرياض – حي النرجس / حي الملقا، طريق الملك سلمان');
  const [announcement, setAnnouncement] = useState('خصم 30% على جلسات التقييم الشامل للتوحد والنطق خلال هذا الشهر');
  const [isSaved, setIsSaved] = useState(false);

  const canViewFinances = hasPermission('view_finances');
  const canManageSettings = hasPermission('system_settings');

  const totalRevenue = appointments
    .filter(a => a.status === 'confirmed' || a.status === 'completed')
    .reduce((sum, a) => sum + (a.amount || 0), 0);

  const madaRevenue = Math.round(totalRevenue * 0.62);
  const applePayRevenue = Math.round(totalRevenue * 0.26);
  const tabbyRevenue = Math.round(totalRevenue * 0.12);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Financial Section / Payment Gateway Status */}
      {canViewFinances && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isArabic ? 'إعدادات الدفع والحجوزات المباشرة' : 'Bookings & Payment Status'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isArabic ? 'حالة بوابات الدفع الإلكتروني ونظام الحجوزات المباشر' : 'Online payment gateways status'}
              </p>
            </div>
            <div className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-amber-500/20">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{isArabic ? 'الدفع الإلكتروني: موقوف حالياً' : 'Online Payment: Paused'}</span>
            </div>
          </div>

          {/* Pause Status Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <div className="font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{isArabic ? 'نظام الحجوزات المباشر نشط' : 'Direct Booking System Active'}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed pr-6">
              {isArabic
                ? 'تمت إزالة بوابات الدفع الإلكتروني مؤقتاً من الموقع. أصبح بإمكان العملاء حجز المواعيد مباشرة وبكل سهولة دون الحاجة للدفع الإلكتروني، وتظهر جميع الحجوزات في لوحة التحكم لمتابعتها وتأكيدها هاتفياً مع إمكانية استخراج تقارير الحجوزات المفلترة.'
                : 'Online payment gateways are temporarily disabled. Clients can now book directly without prepayment, and all bookings appear in the dashboard with exportable reports.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>{isArabic ? 'إجمالي الحجوزات المسجلة' : 'Total Bookings'}</span>
                <span className="font-bold text-emerald-600">{appointments.length}</span>
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                {appointments.filter(a => a.status === 'confirmed').length} {isArabic ? 'مؤكدة' : 'Confirmed'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>{isArabic ? 'حجوزات بانتظار التأكيد' : 'Pending Confirmation'}</span>
                <span className="font-bold text-amber-600">{appointments.filter(a => a.status === 'pending').length}</span>
              </div>
              <div className="text-xl font-black text-amber-600 dark:text-amber-400">
                {appointments.filter(a => a.status === 'pending').length} {isArabic ? 'طلب جديد' : 'Pending'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>{isArabic ? 'آلية التحصيل' : 'Billing Method'}</span>
                <span className="font-bold text-emerald-600">POS / Cash</span>
              </div>
              <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">
                {isArabic ? 'عند الزيارة بالمركز' : 'Upon Clinic Visit'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clinic Settings Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isArabic ? 'إعدادات المنظومة وهوية المركز' : 'Clinic Information & Settings'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isArabic ? 'تحديث قنوات التواصل وأوقات العمل الرسمية' : 'Update contact channels, working hours, and clinic branding'}
          </p>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isArabic ? 'اسم المركز الرسمي:' : 'Official Clinic Name:'}
              </label>
              <input
                type="text"
                disabled={!canManageSettings}
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isArabic ? 'هاتف الاستقبال الموحد:' : 'Phone Number:'}
              </label>
              <input
                type="text"
                disabled={!canManageSettings}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isArabic ? 'رقم الواتساب للاستفسارات والحجوزات:' : 'WhatsApp Number:'}
              </label>
              <input
                type="text"
                disabled={!canManageSettings}
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isArabic ? 'أوقات العمل الرسمية:' : 'Working Hours:'}
              </label>
              <input
                type="text"
                disabled={!canManageSettings}
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {isArabic ? 'عنوان الفروع في الرياض:' : 'Clinic Address:'}
            </label>
            <input
              type="text"
              disabled={!canManageSettings}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {isArabic ? 'شريط الإعلانات الترويجي أعلى الموقع:' : 'Announcement Bar Message:'}
            </label>
            <input
              type="text"
              disabled={!canManageSettings}
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>

          {canManageSettings && (
            <div className="pt-2 flex items-center justify-between">
              {isSaved ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  {isArabic ? 'تم حفظ الإعدادات بنجاح!' : 'Settings saved successfully!'}
                </span>
              ) : <div />}

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0B3B36] hover:bg-[#082925] text-white font-bold rounded-xl cursor-pointer shadow-sm transition-all"
              >
                {isArabic ? 'حفظ إعدادات المنظومة' : 'Save Settings'}
              </button>
            </div>
          )}
        </form>
      </div>

    </div>
  );
};

export default FinancesSettingsTab;
