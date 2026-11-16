import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Clock, 
  Send, 
  Smartphone, 
  CheckCheck,
  CalendarCheck,
  Calendar
} from 'lucide-react';
import { NotificationItem, Appointment } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  appointments: Appointment[];
  onMarkAllAsRead: () => void;
  onAddTestNotification: (msg: string, type: 'reminder' | 'confirmation') => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  appointments,
  onMarkAllAsRead,
  onAddTestNotification
}) => {
  const { t, isArabic, direction } = useLanguage();
  const [activeTab, setActiveTab] = useState<'alerts' | 'sessions' | 'settings'>('alerts');
  const [testSent, setTestSent] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  if (!isOpen) return null;

  // Play subtle ding sound
  const playAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {
      // AudioContext unavailable
    }
  };

  const handleTriggerTestReminder = () => {
    playAlertSound();
    setTestSent(true);
    onAddTestNotification(
      isArabic 
        ? 'تنبيه فوري تلقائي: موعد جلسة العلاج الوظيفي لطفلك غداً الساعة 10:00 ص. يرجى إحضار الأدوات الحسية المنزلية.'
        : 'Automated notification: Occupational therapy session tomorrow at 10:00 AM. Please bring sensory materials.',
      'reminder'
    );
    setTimeout(() => setTestSent(false), 3000);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`relative bg-white dark:bg-[#0D1B2A] text-slate-900 dark:text-white rounded-3xl max-w-2xl w-full shadow-[0_20px_60px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.7)] border border-slate-200 dark:border-white/20 overflow-hidden ${isArabic ? 'text-right' : 'text-left'} my-8`}
        onClick={(e) => e.stopPropagation()}
        id="notification-center-modal"
        dir={direction}
      >
        {/* Header */}
        <div className="bg-gradient-to-l from-sky-500/15 dark:from-teal-500/20 via-slate-100 dark:via-slate-900/60 to-white dark:to-slate-950/80 p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 dark:bg-[#00E5BE]/20 border border-sky-400/30 dark:border-[#00E5BE]/30 flex items-center justify-center text-sky-600 dark:text-[#00E5BE]">
              <Bell className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'نظام تنبيهات الجلسات الآلي' : 'Automated Session Alerts'}
                </h3>
                {unreadCount > 0 && (
                  <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} {isArabic ? 'جديد' : 'new'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isArabic ? 'متابعة دقيقة لمواعيد طفلك وتنبيهات الحضور الذكية' : 'Accurate tracking of your child’s sessions and smart reminders'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-white/20 transition-colors cursor-pointer"
            aria-label={isArabic ? 'إغلاق التنبيهات' : 'Close alerts'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] px-6 pt-2">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'alerts'
                ? 'border-sky-600 dark:border-[#00E5BE] text-sky-700 dark:text-[#00E5BE] bg-white dark:bg-white/[0.08] rounded-t-xl'
                : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>{isArabic ? `سجل التنبيهات (${notifications.length})` : `Alerts Log (${notifications.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'sessions'
                ? 'border-sky-600 dark:border-[#00E5BE] text-sky-700 dark:text-[#00E5BE] bg-white dark:bg-white/[0.08] rounded-t-xl'
                : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>{isArabic ? `جلساتي المحجوزة (${appointments.length})` : `Booked Sessions (${appointments.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'border-sky-600 dark:border-[#00E5BE] text-sky-700 dark:text-[#00E5BE] bg-white dark:bg-white/[0.08] rounded-t-xl'
                : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{isArabic ? 'قنوات الإشعار' : 'Alert Channels'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          
          {/* TAB 1: Alerts list */}
          {activeTab === 'alerts' && (
            <div className="space-y-3">
              {/* Quick Simulator Bar */}
              <div className="p-3.5 bg-sky-500/10 dark:bg-[#00E5BE]/10 border border-sky-400/30 dark:border-[#00E5BE]/25 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className={isArabic ? 'text-right' : 'text-left'}>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {isArabic ? 'اختبار نظام التنبيه الآلي الفوري' : 'Test Instant Alert System'}
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    {isArabic ? 'اضغط لتجربة وصول رسالة تذكيرية فورية لمتابعة الجلسة' : 'Click to simulate a real-time reminder notification'}
                  </p>
                </div>
                <button
                  onClick={handleTriggerTestReminder}
                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#00E5BE] to-[#0284C7] text-slate-950 rounded-xl text-xs font-black shadow-xs flex items-center justify-center gap-1.5 shrink-0 transition-all active:scale-95 cursor-pointer"
                >
                  <Send className={`w-3.5 h-3.5 ${isArabic ? 'rotate-180' : ''}`} />
                  <span>
                    {testSent 
                      ? (isArabic ? 'تم إرسال التنبيه! 🔔' : 'Alert Sent! 🔔') 
                      : (isArabic ? 'إرسال تذكير تجريبي' : 'Send Test Reminder')}
                  </span>
                </button>
              </div>

              {/* Actions row */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-1">
                <span>{isArabic ? 'التنبيهات الأخيرة:' : 'Recent Alerts:'}</span>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-sky-600 dark:text-[#00E5BE] hover:underline font-bold cursor-pointer"
                  >
                    {isArabic ? 'تحديد الكل كمقروء' : 'Mark all as read'}
                  </button>
                )}
              </div>

              {/* List of notifications */}
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all ${isArabic ? 'text-right' : 'text-left'} space-y-1.5 ${
                    !notif.read
                      ? 'bg-sky-50/70 dark:bg-white/[0.08] border-sky-400 dark:border-[#00E5BE]/50 shadow-xs'
                      : 'bg-slate-50 dark:bg-white/[0.04] border-slate-200 dark:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${!notif.read ? 'bg-[#00E5BE] animate-ping' : 'bg-slate-400'}`} />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{notif.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{notif.date}</span>
                  </div>

                  <p className={`text-xs text-slate-700 dark:text-slate-300 leading-relaxed ${isArabic ? 'pr-4' : 'pl-4'}`}>
                    {notif.message}
                  </p>

                  <div className={`flex items-center gap-3 ${isArabic ? 'pr-4' : 'pl-4'} pt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium`}>
                    <span className="flex items-center gap-1 text-sky-700 dark:text-[#00E5BE]">
                      <CheckCheck className="w-3.5 h-3.5" />
                      {isArabic ? 'مرسل عبر: ' : 'Sent via: '}
                      {notif.channel === 'whatsapp' 
                        ? (isArabic ? 'واتساب WhatsApp' : 'WhatsApp') 
                        : notif.channel === 'sms' 
                        ? (isArabic ? 'رسائل SMS' : 'SMS') 
                        : (isArabic ? 'النظام الداخلي' : 'In-App')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Booked Sessions */}
          {activeTab === 'sessions' && (
            <div className="space-y-3">
              {appointments.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">{isArabic ? 'لا توجد جلسات محجوزة حالياً' : 'No booked sessions currently'}</p>
                </div>
              ) : (
                appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className={`p-4 bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/15 rounded-2xl shadow-xs space-y-2 ${isArabic ? 'text-right' : 'text-left'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{apt.serviceTitle}</span>
                      <span className="bg-sky-500/15 dark:bg-[#00E5BE]/20 text-sky-700 dark:text-[#00E5BE] border border-sky-400/30 dark:border-[#00E5BE]/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {apt.status === 'confirmed' 
                          ? (isArabic ? 'جلسة مؤكدة' : 'Confirmed') 
                          : (isArabic ? 'قيد الانتظار' : 'Pending')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300 pt-1">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">{isArabic ? 'الطفل: ' : 'Child: '}</span>
                        <strong className="text-slate-900 dark:text-white">{apt.childName}</strong> ({apt.childAge} {isArabic ? 'سنوات' : 'yrs'})
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">{isArabic ? 'الأخصائي: ' : 'Therapist: '}</span>
                        <strong className="text-sky-700 dark:text-[#00E5BE]">{apt.specialistName}</strong>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-[#00E5BE]" />
                        <span>{apt.date} - {apt.timeSlot}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">{isArabic ? 'رقم الحجز: ' : 'Ref No: '}</span>
                        <span className="font-mono text-slate-800 dark:text-slate-200">{apt.referenceNumber}</span>
                      </div>
                    </div>

                    {/* Alert channels active */}
                    <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-sky-700 dark:text-[#00E5BE]">
                      <span className="flex items-center gap-1">
                        <Bell className="w-3.5 h-3.5 text-sky-600 dark:text-[#00E5BE]" />
                        {isArabic ? 'التنبيهات مفعلة: واتساب + رسائل SMS' : 'Alerts enabled: WhatsApp + SMS'}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">{apt.amount} {isArabic ? 'ر.س' : 'SAR'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Alert Channels & Preferences */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/15 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'تفضيلات قنوات التواصل والتنبيه:' : 'Communication & Alert Preferences:'}
                </h4>
                <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center justify-between p-2.5 bg-white dark:bg-white/[0.06] rounded-xl border border-slate-200 dark:border-white/10">
                    <div>
                      <strong className="block text-slate-900 dark:text-white">
                        {isArabic ? 'تنبيهات واتساب الآلية (WhatsApp)' : 'Automated WhatsApp Alerts'}
                      </strong>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {isArabic ? 'إرسال بطاقة الموعد ورابط اللوكيشن والتذكير الفوري' : 'Send appointment card, location pin, and real-time reminders'}
                      </span>
                    </div>
                    <span className="bg-emerald-500/15 text-emerald-700 dark:text-[#00E5BE] text-[11px] font-bold px-2 py-0.5 rounded-md border border-emerald-400/30">
                      {isArabic ? 'مفعل' : 'Active'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-white dark:bg-white/[0.06] rounded-xl border border-slate-200 dark:border-white/10">
                    <div>
                      <strong className="block text-slate-900 dark:text-white">
                        {isArabic ? 'الرسائل النصية القصيرة (SMS)' : 'SMS Text Messages'}
                      </strong>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {isArabic ? 'رمز التأكيد وتنبيه الموعد قبل 24 ساعة' : 'Confirmation code and 24h appointment alerts'}
                      </span>
                    </div>
                    <span className="bg-emerald-500/15 text-emerald-700 dark:text-[#00E5BE] text-[11px] font-bold px-2 py-0.5 rounded-md border border-emerald-400/30">
                      {isArabic ? 'مفعل' : 'Active'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-white dark:bg-white/[0.06] rounded-xl border border-slate-200 dark:border-white/10">
                    <div>
                      <strong className="block text-slate-900 dark:text-white">
                        {isArabic ? 'التنبيهات الصوتية داخل المتصفح' : 'In-browser Audio Alerts'}
                      </strong>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {isArabic ? 'نغمة تنبيه صوتية عند ورود إشعار جديد' : 'Chime sound when receiving a new notification'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                      className="w-4 h-4 text-sky-600 dark:text-teal-500 rounded border-slate-300 dark:border-white/30 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className={`p-4 bg-slate-50 dark:bg-white/[0.04] border-t border-slate-200 dark:border-white/10 flex items-center ${isArabic ? 'justify-end' : 'justify-start'}`}>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
