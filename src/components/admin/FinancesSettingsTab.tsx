import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Receipt,
  Building,
  Check,
  CheckCircle2,
  AlertCircle,
  Settings2
} from 'lucide-react';
import { Appointment, PermissionId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useLiveDataOptional, usePaymentPublicConfig } from '../../context/LiveDataContext';
import { saveFinanceRecordToFirestore, subscribeFinanceRecords } from '../../services/firestoreService';
import { savePersistentModule } from '../../utils/persistentSync';
import {
  getStoredAnnouncementBarSettings,
  saveStoredAnnouncementBarSettings
} from '../../data/siteCustomizer';
import { PaymentGatewaySettings } from './PaymentGatewaySettings';
import { PaymentsLedger } from './PaymentsLedger';

interface FinancesSettingsTabProps {
  appointments: Appointment[];
  hasPermission: (perm: PermissionId) => boolean;
}

type FinanceSubTab = 'gateway' | 'ledger' | 'clinic';

export const FinancesSettingsTab: React.FC<FinancesSettingsTabProps> = ({
  appointments,
  hasPermission
}) => {
  const { isArabic } = useLanguage();
  const liveData = useLiveDataOptional();
  const paymentPublicConfig = usePaymentPublicConfig();

  const canViewFinances = hasPermission('view_finances');
  const canManageSettings = hasPermission('system_settings');

  const [activeSubTab, setActiveSubTab] = useState<FinanceSubTab>(
    canViewFinances ? 'gateway' : 'clinic'
  );

  const [clinicName, setClinicName] = useState('مركز رابا للرعاية النهارية وتأهيل أطفال التوحد');
  const [phone, setPhone] = useState('0575100100');
  const [whatsapp, setWhatsapp] = useState('0575100100');
  const [workingHours, setWorkingHours] = useState('السبت – الخميس: 8:00 ص – 9:00 م');
  const [address, setAddress] = useState('الرياض – حي النرجس / حي الملقا، طريق الملك سلمان');
  const [announcement, setAnnouncement] = useState(() => getStoredAnnouncementBarSettings().messageAr);
  const [isSaved, setIsSaved] = useState(false);

  // Hydrate announcement bar live from LiveDataContext
  useEffect(() => {
    if (liveData && !liveData.loadingSettings && liveData.announcementBar?.messageAr) {
      setAnnouncement(liveData.announcementBar.messageAr);
    }
  }, [liveData, liveData?.loadingSettings, liveData?.announcementBar?.messageAr]);

  // Hydrate clinic settings live from Firestore /finance/clinic_settings + /site_settings fallback
  useEffect(() => {
    if (liveData?.rawSettings?.raba_clinic_settings) {
      const s = liveData.rawSettings.raba_clinic_settings;
      if (s.clinicName) setClinicName(s.clinicName);
      if (s.phone) setPhone(s.phone);
      if (s.whatsapp) setWhatsapp(s.whatsapp);
      if (s.workingHours) setWorkingHours(s.workingHours);
      if (s.address) setAddress(s.address);
    }
  }, [liveData?.rawSettings?.raba_clinic_settings]);

  useEffect(() => {
    const unsubscribe = subscribeFinanceRecords(
      (recordsMap) => {
        const clinicDoc = recordsMap['clinic_settings'];
        if (clinicDoc) {
          if (clinicDoc.clinicName) setClinicName(String(clinicDoc.clinicName));
          if (clinicDoc.phone) setPhone(String(clinicDoc.phone));
          if (clinicDoc.whatsapp) setWhatsapp(String(clinicDoc.whatsapp));
          if (clinicDoc.workingHours) setWorkingHours(String(clinicDoc.workingHours));
          if (clinicDoc.address) setAddress(String(clinicDoc.address));
        }
      },
      (err) => {
        console.error('[Firestore Live Sync Error]:', err?.code || 'unknown', err?.message || err);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const clinicPayload = {
      clinicName: clinicName.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      workingHours: workingHours.trim(),
      address: address.trim(),
      updatedAtISO: new Date().toISOString()
    };
    void saveFinanceRecordToFirestore('clinic_settings', clinicPayload);
    void savePersistentModule('raba_clinic_settings', clinicPayload);

    const currentBar = liveData?.announcementBar || getStoredAnnouncementBarSettings();
    saveStoredAnnouncementBarSettings({
      ...currentBar,
      messageAr: announcement.trim() || currentBar.messageAr,
      updatedAt: new Date().toISOString()
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tabs Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-2.5 border border-slate-200 dark:border-white/10 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {canViewFinances && (
            <>
              <button
                type="button"
                onClick={() => setActiveSubTab('gateway')}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeSubTab === 'gateway'
                    ? 'bg-[#0B3B36] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>{isArabic ? 'إعدادات بوابات الدفع والمدفوعات' : 'Payment Gateway Settings'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('ledger')}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeSubTab === 'ledger'
                    ? 'bg-[#0B3B36] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>{isArabic ? 'سجل المدفوعات والفواتير' : 'Payments & Invoices Ledger'}</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setActiveSubTab('clinic')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              activeSubTab === 'clinic'
                ? 'bg-[#0B3B36] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            <span>{isArabic ? 'إعدادات المنظومة وهوية المركز' : 'Clinic Information & Settings'}</span>
          </button>
        </div>

        {/* Live Payment Status Indicator */}
        <div
          className={`text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border ${
            paymentPublicConfig.isOnlinePaymentEnabled
              ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
              : 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
          }`}
        >
          {paymentPublicConfig.isOnlinePaymentEnabled ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {isArabic
                  ? `بوابة الدفع نشطة (${paymentPublicConfig.mode === 'live' ? 'إنتاج' : 'تجريبي'})`
                  : `Gateway Active (${paymentPublicConfig.mode})`}
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{isArabic ? 'الدفع الإلكتروني موقوف (حجز مباشر)' : 'Online Payment Paused'}</span>
            </>
          )}
        </div>
      </div>

      {/* Sub-Tab 1: Payment Gateway Configuration */}
      {activeSubTab === 'gateway' && canViewFinances && (
        <PaymentGatewaySettings canManage={canManageSettings || canViewFinances} />
      )}

      {/* Sub-Tab 2: Real-Time Payments & Invoices Ledger */}
      {activeSubTab === 'ledger' && canViewFinances && (
        <PaymentsLedger canManage={canManageSettings || canViewFinances} />
      )}

      {/* Sub-Tab 3: Clinic Settings & Quick Booking Overview */}
      {activeSubTab === 'clinic' && (
        <div className="space-y-6">
          {canViewFinances && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#0B3B36] dark:text-emerald-400" />
                    {isArabic ? 'ملخص الحجوزات وآلية التحصيل' : 'Bookings & Collection Overview'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {isArabic ? 'نظرة سريعة على حالة الحجوزات في المنظومة' : 'Quick overview of clinic bookings'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/5">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                    <span>{isArabic ? 'إجمالي الحجوزات المسجلة' : 'Total Bookings'}</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{appointments.length}</span>
                  </div>
                  <div className="text-xl font-black text-slate-900 dark:text-white">
                    {appointments.filter((a) => a.status === 'confirmed').length} {isArabic ? 'مؤكدة' : 'Confirmed'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/5">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                    <span>{isArabic ? 'حجوزات بانتظار التأكيد' : 'Pending Confirmation'}</span>
                    <span className="font-bold text-amber-700 dark:text-amber-400">
                      {appointments.filter((a) => a.status === 'pending' || a.status === 'new').length}
                    </span>
                  </div>
                  <div className="text-xl font-black text-amber-700 dark:text-amber-400">
                    {appointments.filter((a) => a.status === 'pending' || a.status === 'new').length}{' '}
                    {isArabic ? 'طلب جديد' : 'Pending'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/5">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                    <span>{isArabic ? 'آلية التحصيل النشطة' : 'Active Billing Mode'}</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {paymentPublicConfig.isOnlinePaymentEnabled ? 'Moyasar / Online' : 'POS / Cash'}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">
                    {paymentPublicConfig.isOnlinePaymentEnabled
                      ? isArabic
                        ? 'دفع إلكتروني + تحصيل بالمركز'
                        : 'Online Checkout + Clinic POS'
                      : isArabic
                        ? 'عند الزيارة بالمركز'
                        : 'Upon Clinic Visit'}
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
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
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
                  ) : (
                    <div />
                  )}

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0B3B36] hover:bg-[#082925] dark:bg-[#047857] dark:hover:bg-[#065F46] text-white font-bold rounded-xl cursor-pointer shadow-sm transition-all"
                  >
                    {isArabic ? 'حفظ إعدادات المنظومة' : 'Save Settings'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancesSettingsTab;
