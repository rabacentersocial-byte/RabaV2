import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  SlidersHorizontal, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MessageSquare, 
  Plus, 
  User, 
  Phone, 
  ExternalLink,
  ChevronDown,
  Filter,
  Check,
  X,
  FileSpreadsheet,
  GraduationCap,
  ShoppingBag,
  Sparkles,
  PhoneCall,
  Package,
  Layers,
  Eye,
  Trash2,
  MapPin,
  Mail,
  FileText,
  AlertCircle,
  Tag,
  RefreshCw,
  Cloud,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Appointment, PermissionId, CustomerRequestType } from '../../types';
import { SERVICES, SPECIALISTS } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { BookingReportModal } from './BookingReportModal';
import { getCustomerWhatsAppMessage, generateRequestReference } from '../../data/customerRequests';
import {
  saveAppointmentToFirestore,
  updateAppointmentStatusInFirestore,
  updateAppointmentFieldsInFirestore,
  deleteAppointmentFromFirestore
} from '../../services/firestoreService';

interface AppointmentsTabProps {
  appointments: Appointment[];
  onUpdateAppointments: (updated: Appointment[]) => void;
  hasPermission: (perm: PermissionId) => boolean;
  isSyncingAppointments?: boolean;
  appointmentsSyncError?: string | null;
  isFirebaseAuthenticated?: boolean;
  onRefreshAppointments?: () => Promise<void> | void;
}

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({
  appointments,
  onUpdateAppointments,
  hasPermission,
  isSyncingAppointments = false,
  appointmentsSyncError = null,
  isFirebaseAuthenticated = false,
  onRefreshAppointments
}) => {
  const { isArabic } = useLanguage();
  const { signInWithGoogle } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Appointment | null>(null);
  const [internalAdminNote, setInternalAdminNote] = useState('');
  const [requestToDelete, setRequestToDelete] = useState<Appointment | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isActivatingCloudAuth, setIsActivatingCloudAuth] = useState(false);

  // New Manual Appointment Form State
  const [manualType, setManualType] = useState<CustomerRequestType>('appointment');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState(5);
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [serviceId, setServiceId] = useState(SERVICES[0].id);
  const [specialistId, setSpecialistId] = useState(SPECIALISTS[0].id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('04:30 م');
  const [notes, setNotes] = useState('');
  const [amount, setAmount] = useState(280);
  const [status, setStatus] = useState<Appointment['status']>('confirmed');

  const canManage = hasPermission('manage_appointments');
  const canSendWhatsapp = hasPermission('send_notifications');

  // Counts by Request Type
  const countAll = appointments.length;
  const countSessions = appointments.filter(a => !a.requestType || a.requestType === 'appointment').length;
  const countPackages = appointments.filter(a => a.requestType === 'package').length;
  const countCourses = appointments.filter(a => a.requestType === 'course').length;
  const countShadow = appointments.filter(a => a.requestType === 'shadow_teacher').length;
  const countNationalDay = appointments.filter(a => a.requestType === 'national_day_offer').length;
  const countConsultations = appointments.filter(a => a.requestType === 'quick_consultation').length;
  const countStore = appointments.filter(a => a.requestType === 'store_order').length;

  const countNewLeads = appointments.filter(a => a.status === 'new' || (!a.readByAdmin && a.status === 'pending')).length;

  const showToastSuccess = (msg: string) => {
    setActionError(null);
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleActivateCloudSync = async () => {
    setIsActivatingCloudAuth(true);
    setActionError(null);
    try {
      await signInWithGoogle();
      if (onRefreshAppointments) {
        await onRefreshAppointments();
      }
      showToastSuccess(isArabic ? 'تم تفعيل الربط السحابي ومزامنة الطلبات بنجاح' : 'Cloud sync activated and synced!');
    } catch (err: any) {
      console.error('[AppointmentsTab] Cloud Auth activation error:', err);
      setActionError(
        isArabic
          ? 'تعذر تفعيل الربط السحابي عبر Google. يرجى السماح بالنوافذ المنبثقة والمحاولة مجدداً.'
          : 'Failed to activate Google cloud authentication. Please allow popups and try again.'
      );
    } finally {
      setIsActivatingCloudAuth(false);
    }
  };

  // Filtered List
  const filtered = appointments.filter((app) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (app.childName && app.childName.toLowerCase().includes(q)) ||
      (app.guardianName && app.guardianName.toLowerCase().includes(q)) ||
      (app.guardianPhone && app.guardianPhone.toLowerCase().includes(q)) ||
      (app.referenceNumber && app.referenceNumber.toLowerCase().includes(q)) ||
      (app.serviceTitle && app.serviceTitle.toLowerCase().includes(q)) ||
      (app.notes && app.notes.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    let matchesType = true;
    if (typeFilter !== 'all') {
      if (typeFilter === 'appointment') {
        matchesType = !app.requestType || app.requestType === 'appointment';
      } else {
        matchesType = app.requestType === typeFilter;
      }
    }

    return matchesSearch && matchesStatus && matchesType;
  });

  // Update Status
  const handleUpdateStatus = async (appId: string, newStatus: Appointment['status']) => {
    if (!canManage) return;
    setActionError(null);
    const previous = appointments;
    const updated = appointments.map((a) => {
      if (a.id === appId) {
        return { ...a, status: newStatus, readByAdmin: true };
      }
      return a;
    });
    onUpdateAppointments(updated);
    if (selectedRequest && selectedRequest.id === appId) {
      setSelectedRequest({ ...selectedRequest, status: newStatus, readByAdmin: true });
    }

    try {
      await updateAppointmentStatusInFirestore(appId, newStatus);
      showToastSuccess(isArabic ? 'تم تحديث حالة الطلب في السحابة' : 'Status updated in Firestore');
    } catch (err) {
      console.error('[AppointmentsTab] Failed to update status in Firestore:', err);
      onUpdateAppointments(previous);
      setActionError(
        isArabic
          ? 'تعذر حفظ تغيير الحالة في قاعدة البيانات. تأكد من تسجيل الدخول السحابي عبر Google.'
          : 'Failed to persist status update to Firestore. Ensure cloud sync authentication is active.'
      );
    }
  };

  // Save Admin Internal Note
  const handleSaveAdminNote = async (appId: string) => {
    if (!canManage) return;
    setActionError(null);
    const previous = appointments;
    const updated = appointments.map((a) => {
      if (a.id === appId) {
        return { ...a, adminNotes: internalAdminNote, readByAdmin: true };
      }
      return a;
    });
    onUpdateAppointments(updated);
    if (selectedRequest && selectedRequest.id === appId) {
      setSelectedRequest({ ...selectedRequest, adminNotes: internalAdminNote, readByAdmin: true });
    }

    try {
      await updateAppointmentFieldsInFirestore(appId, { adminNotes: internalAdminNote, readByAdmin: true });
      showToastSuccess(isArabic ? 'تم حفظ الملاحظة الداخلية في السحابة' : 'Internal note saved to Firestore');
    } catch (err) {
      console.error('[AppointmentsTab] Failed to save admin note to Firestore:', err);
      onUpdateAppointments(previous);
      setActionError(
        isArabic
          ? 'تعذر حفظ الملاحظة في قاعدة البيانات. تأكد من تفعيل الربط السحابي.'
          : 'Failed to save internal note to Firestore.'
      );
    }
  };

  // Delete Request
  const handleDeleteRequest = (app: Appointment) => {
    if (!canManage) return;
    setRequestToDelete(app);
  };

  const handleConfirmDeleteRequest = async () => {
    if (!requestToDelete) return;
    const target = requestToDelete;
    setRequestToDelete(null);
    setActionError(null);

    const previous = appointments;
    const updated = appointments.filter(a => a.id !== target.id);
    onUpdateAppointments(updated);
    if (selectedRequest && selectedRequest.id === target.id) {
      setSelectedRequest(null);
    }

    try {
      await deleteAppointmentFromFirestore(target.id);
      showToastSuccess(isArabic ? 'تم حذف الطلب نهائياً من قاعدة البيانات' : 'Request deleted from Firestore');
    } catch (err) {
      console.error('[AppointmentsTab] Failed to delete appointment from Firestore:', err);
      onUpdateAppointments(previous);
      setActionError(
        isArabic
          ? 'تعذر حذف الطلب من قاعدة البيانات السحابية. تأكد من صلاحيات الجلسة.'
          : 'Failed to delete request from Firestore.'
      );
    }
  };

  // Open Details Modal
  const handleOpenDetails = (app: Appointment) => {
    setSelectedRequest(app);
    setInternalAdminNote(app.adminNotes || '');
    // Mark as read
    if (!app.readByAdmin) {
      const updated = appointments.map(a => a.id === app.id ? { ...a, readByAdmin: true } : a);
      onUpdateAppointments(updated);
      updateAppointmentFieldsInFirestore(app.id, { readByAdmin: true }).catch(() => {});
    }
  };

  // Open Direct WhatsApp Reminder / Follow-up
  const handleSendWhatsApp = (app: Appointment) => {
    const link = getCustomerWhatsAppMessage(app, isArabic);
    window.open(link, '_blank');
  };

  // Manual Add Form Submit
  const handleAddAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guardianPhone.trim()) return;
    setActionError(null);

    const selectedService = SERVICES.find(s => s.id === serviceId) || SERVICES[0];
    const selectedSpec = SPECIALISTS.find(s => s.id === specialistId) || SPECIALISTS[0];
    const ref = generateRequestReference(manualType);

    let defaultTitle = selectedService.title;
    if (manualType === 'shadow_teacher') defaultTitle = isArabic ? 'خدمة سِوار – معلم الظل المدرسي (Shadow Teacher)' : 'Sewar Service – School Shadow Teacher';
    else if (manualType === 'course') defaultTitle = isArabic ? 'تسجيل دورة تدريبية - منصة رابا' : 'Training Course Registration';
    else if (manualType === 'national_day_offer') defaultTitle = 'عرض اليوم الوطني 96 (جلسة مجانية)';
    else if (manualType === 'quick_consultation') defaultTitle = 'طلب استشارة هاتفية سريعة';
    else if (manualType === 'store_order') defaultTitle = 'طلب منتجات من المتجر التأهيلي';

    const newApp: Appointment = {
      id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      referenceNumber: ref,
      childName: childName.trim() || (isArabic ? 'المستفيد' : 'Beneficiary'),
      childAge: Number(childAge) || 5,
      guardianName: guardianName.trim() || (isArabic ? 'ولي الأمر' : 'Guardian'),
      guardianPhone: guardianPhone.trim(),
      guardianEmail: guardianEmail.trim() || 'parent@gmail.com',
      serviceId: selectedService.id,
      serviceTitle: defaultTitle,
      specialistId: selectedSpec.id,
      specialistName: selectedSpec.name,
      date: date,
      timeSlot: timeSlot,
      notes: notes.trim(),
      status: status,
      paymentStatus: 'unpaid',
      amount: Number(amount) || 280,
      reminderSettings: {
        whatsapp: true,
        sms: true,
        email: true
      },
      createdAt: new Date().toISOString(),
      requestType: manualType,
      requestSource: isArabic ? 'إدخال يدوي من لوحة تحكم الإدارة' : 'Manual entry by staff',
      readByAdmin: true
    };

    try {
      await saveAppointmentToFirestore(newApp);
      onUpdateAppointments([newApp, ...appointments]);
      showToastSuccess(isArabic ? 'تمت إضافة الطلب وحفظه في السحابة بنجاح' : 'Manual request saved to Firestore');

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      setIsAddModalOpen(false);
      setChildName('');
      setGuardianName('');
      setGuardianPhone('');
      setNotes('');
    } catch (err) {
      console.error('[AppointmentsTab] Failed to create manual appointment in Firestore:', err);
      setActionError(
        isArabic
          ? 'تعذر حفظ الطلب اليدوي في قاعدة البيانات السحابية.'
          : 'Failed to persist manual request to Firestore.'
      );
    }
  };

  // Type Badge Renderer
  const renderTypeBadge = (type?: CustomerRequestType) => {
    switch (type) {
      case 'shadow_teacher':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
            <GraduationCap className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            <span>{isArabic ? 'معلم ظل' : 'Shadow Teacher'}</span>
          </span>
        );
      case 'national_day_offer':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-600/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40">
            <span className="text-xs">🇸🇦</span>
            <span>{isArabic ? 'اليوم الوطني 96' : 'National Day'}</span>
          </span>
        );
      case 'store_order':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30">
            <ShoppingBag className="w-3 h-3 text-sky-600 dark:text-sky-400" />
            <span>{isArabic ? 'طلب متجر' : 'Store Order'}</span>
          </span>
        );
      case 'quick_consultation':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
            <PhoneCall className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>{isArabic ? 'استشارة سريعة' : 'Consultation'}</span>
          </span>
        );
      case 'course':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-pink-500/15 text-pink-700 dark:text-pink-300 border border-pink-500/30">
            <GraduationCap className="w-3 h-3 text-pink-600 dark:text-pink-400" />
            <span>{isArabic ? 'تسجيل دورة' : 'Course'}</span>
          </span>
        );
      case 'package':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
            <Package className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            <span>{isArabic ? 'باقة تأهيل' : 'Package'}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30">
            <Calendar className="w-3 h-3 text-teal-600 dark:text-teal-400" />
            <span>{isArabic ? 'جلسة عيادة' : 'Session'}</span>
          </span>
        );
    }
  };

  const hasPermissionDeniedError = Boolean(
    appointmentsSyncError &&
      (appointmentsSyncError.toLowerCase().includes('permission') ||
        appointmentsSyncError.toLowerCase().includes('insufficient'))
  );

  return (
    <div className="space-y-6">

      {/* Cloud Sync Auth / Error Warning Banner */}
      {(!isFirebaseAuthenticated || appointmentsSyncError) && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-950 dark:text-amber-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-black">
                {!isFirebaseAuthenticated || hasPermissionDeniedError
                  ? isArabic
                    ? 'يلزم تفعيل الربط السحابي لقراءة وتعديل حجوزات Firestore المباشرة'
                    : 'Cloud authentication required to read & manage live Firestore bookings'
                  : isArabic
                    ? 'تنبيه مزامنة قاعدة البيانات السحابية'
                    : 'Cloud Database Sync Notice'}
              </h4>
              <p className="text-[11px] opacity-90 leading-relaxed">
                {!isFirebaseAuthenticated || hasPermissionDeniedError
                  ? isArabic
                    ? 'تم تسجيل الدخول بالجلسة المحلية فقط. انقر على «تفعيل الربط السحابي (Google)» لجلب كافة الطلبات والحجوزات المسجلة من العملاء مباشرة.'
                    : 'Signed in with local session only. Click "Activate Cloud Sync (Google)" to load and manage live customer bookings from Firestore.'
                  : appointmentsSyncError}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {(!isFirebaseAuthenticated || hasPermissionDeniedError) && (
              <button
                type="button"
                onClick={handleActivateCloudSync}
                disabled={isActivatingCloudAuth}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-60"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>
                  {isActivatingCloudAuth
                    ? isArabic ? 'جاري التفعيل...' : 'Activating...'
                    : isArabic ? 'تفعيل الربط السحابي (Google)' : 'Activate Cloud Sync (Google)'}
                </span>
              </button>
            )}
            {onRefreshAppointments && (
              <button
                type="button"
                onClick={() => onRefreshAppointments()}
                disabled={isSyncingAppointments}
                className="px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800 text-slate-900 dark:text-white border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAppointments ? 'animate-spin' : ''}`} />
                <span>{isArabic ? 'إعادة المحاولة' : 'Retry'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Action Feedback Banners */}
      {actionError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button type="button" onClick={() => setActionError(null)} className="cursor-pointer p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}
      
      {/* New Leads Notification Banner */}
      {countNewLeads > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-700 to-[#0B3B36] text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-300 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-black">
                {isArabic 
                  ? `يوجد ${countNewLeads} طلبات جديدة واردة من استمارات الموقع بحاجة للمتابعة!` 
                  : `${countNewLeads} new customer inquiries received from website forms!`}
              </h4>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                {isArabic 
                  ? 'تم استلام طلبات من نماذج معلم الظل، المتجر، الاستشارات السريعة، وحجوزات الجلسات.' 
                  : 'Includes Shadow Teacher forms, Store orders, Callbacks, and Session bookings.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setStatusFilter('new');
                setTypeFilter('all');
              }}
              className="px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-black shadow-sm cursor-pointer transition-all"
            >
              {isArabic ? 'عرض الطلبات الجديدة' : 'Show New Leads'}
            </button>
          </div>
        </div>
      )}

      {/* Request Type Navigation Tabs */}
      <div className="bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
            typeFilter === 'all'
              ? 'bg-[#0B3B36] dark:bg-[#00E5BE] text-white dark:text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isArabic ? 'جميع الطلبات والمواعيد' : 'All Requests'}</span>
          <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px] font-mono">{countAll}</span>
        </button>

        <button
          onClick={() => setTypeFilter('appointment')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
            typeFilter === 'appointment'
              ? 'bg-teal-700 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{isArabic ? 'جلسات العيادة' : 'Sessions'}</span>
          <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px] font-mono">{countSessions}</span>
        </button>

        <button
          onClick={() => setTypeFilter('package')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
            typeFilter === 'package'
              ? 'bg-indigo-700 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>{isArabic ? 'باقات التأهيل' : 'Packages'}</span>
          <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px] font-mono">{countPackages}</span>
        </button>

        <button
          onClick={() => setTypeFilter('shadow_teacher')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
            typeFilter === 'shadow_teacher'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>{isArabic ? 'طلبات خدمة سِوار (معلم الظل)' : 'Sewar (Shadow Teacher)'}</span>
          <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px] font-mono">{countShadow}</span>
        </button>

        <button
          onClick={() => setTypeFilter('national_day_offer')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
            typeFilter === 'national_day_offer'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>🇸🇦</span>
          <span>{isArabic ? 'عروض اليوم الوطني' : 'National Day'}</span>
          <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px] font-mono">{countNationalDay}</span>
        </button>

        <button
          onClick={() => setTypeFilter('quick_consultation')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
            typeFilter === 'quick_consultation'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>{isArabic ? 'استشارات واتصال' : 'Consultations'}</span>
          <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px] font-mono">{countConsultations}</span>
        </button>

        <button
          onClick={() => setTypeFilter('course')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
            typeFilter === 'course'
              ? 'bg-pink-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>{isArabic ? 'تسجيل الكورسات' : 'Courses'}</span>
          <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px] font-mono">{countCourses}</span>
        </button>

        <button
          onClick={() => setTypeFilter('store_order')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
            typeFilter === 'store_order'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{isArabic ? 'طلبات المتجر' : 'Store Orders'}</span>
          <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px] font-mono">{countStore}</span>
        </button>

      </div>
      
      {/* Search & Actions Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isArabic ? 'بحث بالاسم، الجوال، المرجع، أو الملاحظات...' : 'Search by name, phone, ref, or notes...'}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
          <Search className={`w-4 h-4 text-slate-400 absolute ${isArabic ? 'left-3' : 'right-3'} top-3`} />
        </div>

        {/* Filters and Add button */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end overflow-x-auto">
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer shrink-0"
          >
            <option value="all">{isArabic ? 'كافة حالات الطلب' : 'All Statuses'}</option>
            <option value="new">{isArabic ? 'جديد (New Leads)' : 'New Leads'}</option>
            <option value="contacted">{isArabic ? 'تم التواصل' : 'Contacted'}</option>
            <option value="confirmed">{isArabic ? 'مؤكد' : 'Confirmed'}</option>
            <option value="pending">{isArabic ? 'قيد الانتظار' : 'Pending'}</option>
            <option value="completed">{isArabic ? 'مكتمل' : 'Completed'}</option>
            <option value="cancelled">{isArabic ? 'ملغى' : 'Cancelled'}</option>
          </select>

          {onRefreshAppointments && (
            <button
              type="button"
              onClick={() => onRefreshAppointments()}
              disabled={isSyncingAppointments}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer shrink-0 transition-all disabled:opacity-60"
              title={isArabic ? 'تحديث الطلبات من قاعدة البيانات السحابية' : 'Refresh bookings from Firestore cloud'}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 dark:text-[#00E5BE] ${isSyncingAppointments ? 'animate-spin' : ''}`} />
              <span>{isSyncingAppointments ? (isArabic ? 'جاري التحديث...' : 'Syncing...') : (isArabic ? 'تحديث من السحابة' : 'Refresh Cloud')}</span>
            </button>
          )}

          {/* Export Report with Filter Button */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0 transition-all"
            title={isArabic ? 'استخراج وتصدير تقرير الحجوزات مع الفلترة' : 'Export & Filter Bookings Report'}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{isArabic ? 'استخراج تقرير الحجوزات' : 'Export Report'}</span>
          </button>

          {canManage && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-[#0B3B36] hover:bg-[#092925] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isArabic ? 'إضافة طلب يدوي' : 'New Manual Request'}</span>
            </button>
          )}
        </div>

      </div>

      {/* Appointments & Requests Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs" dir={isArabic ? 'rtl' : 'ltr'}>
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-bold uppercase">
              <tr>
                <th className="p-4">{isArabic ? 'المرجع والنوع' : 'Reference & Type'}</th>
                <th className="p-4">{isArabic ? 'المستفيد / الطفل' : 'Beneficiary / Child'}</th>
                <th className="p-4">{isArabic ? 'ولي الأمر والاتصال' : 'Client & Phone'}</th>
                <th className="p-4">{isArabic ? 'الخدمة / الطلب' : 'Service / Request'}</th>
                <th className="p-4">{isArabic ? 'الموعد أو التاريخ' : 'Date & Shift'}</th>
                <th className="p-4">{isArabic ? 'المبلغ' : 'Amount'}</th>
                <th className="p-4">{isArabic ? 'الحالة' : 'Status'}</th>
                <th className="p-4 text-center">{isArabic ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-800 dark:text-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-slate-400 text-xs">
                    {isArabic ? 'لا توجد طلبات أو حجوزات مطابقة للفلتر المحدد' : 'No requests or bookings match current filter'}
                  </td>
                </tr>
              ) : (
                filtered.map((app, idx) => {
                  const isNew = app.status === 'new' || (!app.readByAdmin && app.status === 'pending');
                  return (
                    <tr 
                      key={`${app.id}-${idx}`} 
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                        isNew ? 'bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06]' : ''
                      }`}
                    >
                      
                      {/* Reference & Request Type */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-mono text-[11px] font-bold text-emerald-700 dark:text-[#2DD4BF]">
                            {app.referenceNumber}
                          </span>
                          {isNew && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title={isArabic ? 'طلب جديد' : 'New lead'} />
                          )}
                        </div>
                        <div>
                          {renderTypeBadge(app.requestType)}
                        </div>
                      </td>

                      {/* Beneficiary / Child */}
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white text-xs">
                          {app.childName}
                        </div>
                        {app.childAge > 0 && (
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {app.childAge} {isArabic ? 'سنوات' : 'years'} {app.childBirthDate ? `(${app.childBirthDate})` : ''}
                          </div>
                        )}
                      </td>

                      {/* Guardian & Phone */}
                      <td className="p-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {app.guardianName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                          <span dir="ltr">{app.guardianPhone}</span>
                        </div>
                      </td>

                      {/* Service / Request Title */}
                      <td className="p-4 max-w-[220px]">
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                          {app.serviceTitle}
                        </div>
                        {app.specialistName && (
                          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 line-clamp-1">
                            {app.specialistName}
                          </div>
                        )}
                        {app.couponCode && (
                          <span className="inline-block mt-1 text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono font-bold px-1.5 py-0.2 rounded border border-emerald-500/20">
                            🎟️ {app.couponCode}
                          </span>
                        )}
                      </td>

                      {/* Date & Time */}
                      <td className="p-4">
                        <div className="font-bold">{app.date}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{app.timeSlot}</div>
                      </td>

                      {/* Amount */}
                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        {app.amount > 0 ? (
                          <span>{app.amount} {isArabic ? 'ر.س' : 'SAR'}</span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                            {isArabic ? 'استشارة مجانية' : 'Free Lead'}
                          </span>
                        )}
                      </td>

                      {/* Status Selector */}
                      <td className="p-4">
                        {canManage ? (
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateStatus(app.id, e.target.value as Appointment['status'])}
                            className={`text-[11px] font-bold rounded-xl px-2.5 py-1 border outline-none cursor-pointer ${
                              app.status === 'confirmed'
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                                : app.status === 'new'
                                ? 'bg-teal-500/15 text-teal-800 dark:text-teal-300 border-teal-500/40 animate-pulse'
                                : app.status === 'contacted'
                                ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30'
                                : app.status === 'pending'
                                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                                : app.status === 'completed'
                                ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30'
                                : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30'
                            }`}
                          >
                            <option value="new">{isArabic ? 'جديد (New)' : 'New'}</option>
                            <option value="contacted">{isArabic ? 'تم التواصل' : 'Contacted'}</option>
                            <option value="confirmed">{isArabic ? 'مؤكد' : 'Confirmed'}</option>
                            <option value="pending">{isArabic ? 'قيد الانتظار' : 'Pending'}</option>
                            <option value="completed">{isArabic ? 'مكتمل' : 'Completed'}</option>
                            <option value="cancelled">{isArabic ? 'ملغى' : 'Cancelled'}</option>
                          </select>
                        ) : (
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-xl inline-block ${
                            app.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-700' : 'bg-amber-500/10 text-amber-700'
                          }`}>
                            {app.status}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View Details Button */}
                          <button
                            onClick={() => handleOpenDetails(app)}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                            title={isArabic ? 'عرض تفاصيل الطلب الكاملة' : 'View Full Details'}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* WhatsApp Direct Action */}
                          {canSendWhatsapp && (
                            <button
                              onClick={() => handleSendWhatsApp(app)}
                              className="p-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white transition-colors cursor-pointer"
                              title={isArabic ? 'تواصل فوري عبر الواتساب' : 'WhatsApp Client'}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Delete Request */}
                          {canManage && (
                            <button
                              onClick={() => handleDeleteRequest(app)}
                              className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white transition-colors cursor-pointer"
                              title={isArabic ? 'حذف الطلب' : 'Delete Request'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW FULL REQUEST DETAILS MODAL */}
      {selectedRequest && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          onClick={() => setSelectedRequest(null)}
        >
          <div 
            className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-white/15 space-y-5"
            onClick={(e) => e.stopPropagation()}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{isArabic ? 'تفاصيل طلب العميل الكاملة' : 'Customer Request Details'}</span>
                    <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                      ({selectedRequest.referenceNumber})
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isArabic ? `تاريخ ووقت الورود: ${selectedRequest.createdAt}` : `Received: ${selectedRequest.createdAt}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {renderTypeBadge(selectedRequest.requestType)}
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Client / Guardian Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 space-y-2">
                <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-200 dark:border-white/10 pb-1.5">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>{isArabic ? 'بيانات ولي الأمر / العميل:' : 'Client / Guardian Details:'}</span>
                </span>
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isArabic ? 'الاسم:' : 'Name:'}</span>
                    <span className="font-bold text-slate-800 dark:text-white">{selectedRequest.guardianName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isArabic ? 'رقم الجوال:' : 'Phone:'}</span>
                    <a href={`tel:${selectedRequest.guardianPhone}`} className="font-mono font-bold text-emerald-700 hover:underline" dir="ltr">
                      {selectedRequest.guardianPhone}
                    </a>
                  </div>
                  {selectedRequest.guardianEmail && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isArabic ? 'البريد الإلكتروني:' : 'Email:'}</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">{selectedRequest.guardianEmail}</span>
                    </div>
                  )}
                  {selectedRequest.shippingAddress && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isArabic ? 'عنوان التوصيل:' : 'Address:'}</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{selectedRequest.shippingAddress}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Beneficiary / Child Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 space-y-2">
                <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-200 dark:border-white/10 pb-1.5">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>{isArabic ? 'بيانات المستفيد والخدمة:' : 'Beneficiary & Service Details:'}</span>
                </span>
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isArabic ? 'اسم الطفل / المستفيد:' : 'Child Name:'}</span>
                    <span className="font-bold text-slate-800 dark:text-white">{selectedRequest.childName}</span>
                  </div>
                  {selectedRequest.childAge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isArabic ? 'العمر:' : 'Age:'}</span>
                      <span className="font-medium">{selectedRequest.childAge} {isArabic ? 'سنوات' : 'years'}</span>
                    </div>
                  )}
                  {selectedRequest.childBirthDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isArabic ? 'تاريخ الميلاد:' : 'Birthdate:'}</span>
                      <span className="font-mono font-medium">{selectedRequest.childBirthDate}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isArabic ? 'الخدمة / البرنامج:' : 'Service:'}</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{selectedRequest.serviceTitle}</span>
                  </div>
                  {selectedRequest.specialistName && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isArabic ? 'الأخصائي المعني:' : 'Specialist:'}</span>
                      <span className="font-medium">{selectedRequest.specialistName}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Store Order Items (if store order) */}
            {selectedRequest.orderItems && selectedRequest.orderItems.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 space-y-2 text-xs">
                <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-200 dark:border-white/10 pb-1.5">
                  <ShoppingBag className="w-4 h-4 text-sky-600" />
                  <span>{isArabic ? 'قائمة المنتجات المطلوبة من المتجر:' : 'Ordered Store Items:'}</span>
                </span>
                <div className="divide-y divide-slate-200/60 dark:divide-white/5 space-y-1.5 pt-1">
                  {selectedRequest.orderItems.map((item, idx) => (
                    <div key={idx} className="pt-1.5 flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {item.name} <span className="text-slate-400">× {item.quantity}</span>
                      </span>
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {item.price * item.quantity} {isArabic ? 'ر.س' : 'SAR'}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between font-black text-sm text-slate-900 dark:text-white">
                    <span>{isArabic ? 'الإجمالي المطلوب تحصيله:' : 'Total Amount:'}</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-mono">
                      {selectedRequest.amount} {isArabic ? 'ر.س' : 'SAR'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Client Notes & Source */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
              <span className="font-black text-amber-900 dark:text-amber-200 block">
                {isArabic ? 'ملاحظات وتفاصيل العميل الواردة:' : 'Customer Notes & Inquiry:'}
              </span>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                {selectedRequest.notes || (isArabic ? 'لا توجد ملاحظات إضافية' : 'No extra notes')}
              </p>
              {selectedRequest.preferredCallTime && (
                <div className="pt-1 text-[11px] font-bold text-amber-900 dark:text-amber-200">
                  ⏰ {isArabic ? 'الوقت المفضل للاتصال:' : 'Preferred Call Time:'} {selectedRequest.preferredCallTime}
                </div>
              )}
            </div>

            {/* Internal Staff Notes (Editable) */}
            <div className="space-y-2 text-xs">
              <label className="font-black text-slate-900 dark:text-white flex items-center justify-between">
                <span>{isArabic ? 'ملاحظات الاستقبال والمتابعة الداخلية (خاصة بالموظفين):' : 'Internal Staff Notes:'}</span>
                <span className="text-[10px] text-slate-400 font-normal">{isArabic ? 'مرئية للإدارة فقط' : 'Staff only'}</span>
              </label>
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  value={internalAdminNote}
                  onChange={(e) => setInternalAdminNote(e.target.value)}
                  placeholder={isArabic ? 'اكتب ملاحظة (مثال: تم الاتصال بولي الأمر وتم الاتفاق على جلسة تقييم الأحد القادم)...' : 'Write staff follow-up note...'}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
                <button
                  type="button"
                  onClick={() => handleSaveAdminNote(selectedRequest.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl self-end cursor-pointer shadow-sm transition-all"
                >
                  {isArabic ? 'حفظ' : 'Save'}
                </button>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-bold">{isArabic ? 'تحديث الحالة:' : 'Status:'}</span>
                <select
                  value={selectedRequest.status}
                  onChange={(e) => handleUpdateStatus(selectedRequest.id, e.target.value as Appointment['status'])}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 font-bold outline-none cursor-pointer"
                >
                  <option value="new">{isArabic ? 'جديد (New)' : 'New'}</option>
                  <option value="contacted">{isArabic ? 'تم التواصل' : 'Contacted'}</option>
                  <option value="confirmed">{isArabic ? 'مؤكد' : 'Confirmed'}</option>
                  <option value="pending">{isArabic ? 'قيد الانتظار' : 'Pending'}</option>
                  <option value="completed">{isArabic ? 'مكتمل' : 'Completed'}</option>
                  <option value="cancelled">{isArabic ? 'ملغى' : 'Cancelled'}</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedRequest.guardianPhone}`}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'اتصال بالعميل' : 'Call'}</span>
                </a>

                <button
                  onClick={() => handleSendWhatsApp(selectedRequest)}
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'واتساب مخصص' : 'WhatsApp'}</span>
                </button>

                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl font-bold cursor-pointer transition-colors"
                >
                  {isArabic ? 'إغلاق' : 'Close'}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* MANUAL ADD BOOKING / REQUEST MODAL */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-white/15 space-y-4"
            onClick={(e) => e.stopPropagation()}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isArabic ? 'إضافة طلب أو حجز يدوي' : 'New Manual Request'}
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAppointmentSubmit} className="space-y-4 text-xs">
              
              {/* Type Selection */}
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                  {isArabic ? 'نوع الطلب الوارد:' : 'Request Category:'}
                </label>
                <select
                  value={manualType}
                  onChange={(e) => setManualType(e.target.value as CustomerRequestType)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 outline-none cursor-pointer font-bold text-slate-900 dark:text-white"
                >
                  <option value="appointment">{isArabic ? 'جلسة عيادة عادية' : 'Clinic Session'}</option>
                  <option value="package">{isArabic ? 'باقة تأهيلية' : 'Therapy Package'}</option>
                  <option value="course">{isArabic ? 'تسجيل دورة تدريبية' : 'Training Course'}</option>
                  <option value="shadow_teacher">{isArabic ? 'طلب خدمة معلم ظل' : 'Shadow Teacher Application'}</option>
                  <option value="national_day_offer">{isArabic ? 'طلب عرض اليوم الوطني' : 'National Day Offer'}</option>
                  <option value="quick_consultation">{isArabic ? 'طلب استشارة واتصال هاتفي' : 'Phone Callback Consultation'}</option>
                  <option value="store_order">{isArabic ? 'طلب من متجر رابا' : 'Store Rehab Tools Order'}</option>
                </select>
              </div>

              {/* Child Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                    {isArabic ? 'اسم الطفل / المستفيد:' : 'Beneficiary Name:'}
                  </label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder={isArabic ? 'اسم الطفل...' : 'Child Name...'}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                    {isArabic ? 'العمر (سنوات):' : 'Age:'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="18"
                    value={childAge}
                    onChange={(e) => setChildAge(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              {/* Guardian Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                    {isArabic ? 'اسم ولي الأمر:' : 'Guardian Name:'}
                  </label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder={isArabic ? 'مثال: أبو خالد' : 'Guardian Name'}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                    {isArabic ? 'رقم الجوال:' : 'Phone:'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    dir="ltr"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Service & Specialist */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                    {isArabic ? 'الخدمة / التخصص:' : 'Service:'}
                  </label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 outline-none cursor-pointer"
                  >
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                    {isArabic ? 'الأخصائي المعالج:' : 'Specialist:'}
                  </label>
                  <select
                    value={specialistId}
                    onChange={(e) => setSpecialistId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 outline-none cursor-pointer"
                  >
                    {SPECIALISTS.map((sp) => (
                      <option key={sp.id} value={sp.id}>{sp.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                    {isArabic ? 'التاريخ:' : 'Date:'}
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                    {isArabic ? 'الوقت:' : 'Time Slot:'}
                  </label>
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    placeholder="04:30 م"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              {/* Amount & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                    {isArabic ? 'المبلغ (ريال):' : 'Amount (SAR):'}
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                    {isArabic ? 'الحالة المبدئية:' : 'Initial Status:'}
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Appointment['status'])}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 outline-none cursor-pointer"
                  >
                    <option value="new">{isArabic ? 'جديد (New)' : 'New'}</option>
                    <option value="confirmed">{isArabic ? 'مؤكد (Confirmed)' : 'Confirmed'}</option>
                    <option value="pending">{isArabic ? 'قيد الانتظار (Pending)' : 'Pending'}</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                  {isArabic ? 'ملاحظات إضافية:' : 'Notes:'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isArabic ? 'أي تفاصيل خاصة بالحجز...' : 'Special notes...'}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B3B36] hover:bg-[#092925] text-white font-bold rounded-xl cursor-pointer"
                >
                  {isArabic ? 'حفظ الطلب باللوحة' : 'Save to Dashboard'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Booking & Requests Report Modal */}
      <BookingReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        appointments={filtered}
      />

      {/* CONFIRM DELETE REQUEST MODAL */}
      {requestToDelete && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setRequestToDelete(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-white/15 text-center space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                {isArabic ? 'تأكيد حذف الطلب' : 'Confirm Request Deletion'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-2">
                {isArabic 
                  ? `هل أنت متأكد من رغبتك في حذف طلب الحجز رقم (${requestToDelete.referenceNumber}) لـ ${requestToDelete.guardianName} نهائياً؟` 
                  : `Are you sure you want to delete request #${requestToDelete.referenceNumber} for ${requestToDelete.guardianName} permanently?`}
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRequestToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteRequest}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md cursor-pointer transition-all"
              >
                {isArabic ? 'نعم، حذف الطلب' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
