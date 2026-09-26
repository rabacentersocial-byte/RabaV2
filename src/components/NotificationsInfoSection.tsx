import React, { useState } from 'react';
import { 
  BellRing, 
  MessageSquare, 
  Smartphone, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Send, 
  ArrowLeft,
  CalendarCheck,
  Volume2,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NotificationsInfoSectionProps {
  onOpenNotifications: () => void;
  onOpenBooking: () => void;
}

export const NotificationsInfoSection: React.FC<NotificationsInfoSectionProps> = ({
  onOpenNotifications,
  onOpenBooking
}) => {
  const { t, isArabic, direction } = useLanguage();
  const [activePreview, setActivePreview] = useState<'whatsapp' | 'sms'>('whatsapp');

  return (
    <section id="notifications-info" className="py-16 md:py-24 bg-transparent relative overflow-hidden transition-colors border-b border-slate-200/80 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#00E5BE]/10 border border-[#00E5BE]/30 text-teal-800 dark:text-[#00E5BE] text-xs font-bold mb-3 shadow-xs backdrop-blur-md">
            <BellRing className="w-3.5 h-3.5 text-teal-600 dark:text-[#00E5BE] animate-bounce" />
            <span>{t.notifications.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.notifications.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.notifications.subtitle}
          </p>
        </div>

        {/* 2-Column Showcase with Glassy Depth */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Feature Steps with Glassy Cards */}
          <div className={`lg:col-span-7 space-y-4 ${isArabic ? 'text-right' : 'text-left'}`}>
            
            <div className="glass-card p-5 rounded-2xl flex items-start gap-4 hover:border-[#00E5BE]/40 transition-all backdrop-blur-md">
              <div className="w-11 h-11 rounded-2xl bg-[#00E5BE]/20 text-[#0284C7] dark:text-[#00E5BE] flex items-center justify-center font-black text-sm shrink-0 border border-[#00E5BE]/30">
                01
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  {isArabic ? 'تأكيد إلكتروني فوري مع سند السداد' : 'Instant Confirmation with Official Receipt'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isArabic 
                    ? 'بمجرد إتمام الحجز والسداد، يصلك إشعار فوري برقم الحجز المرجعي، تفاصيل الجلسة، ورابط موقع العيادة عبر خرائط جوجل.'
                    : 'Immediately upon booking, you receive instant confirmation with booking reference, appointment details, and GPS map guidance.'}
                </p>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-[#00E5BE]/40 ring-1 ring-[#00E5BE]/30 flex items-start gap-4 transition-all backdrop-blur-md">
              <div className="w-11 h-11 rounded-2xl bg-[#00E5BE]/20 text-[#0284C7] dark:text-[#00E5BE] flex items-center justify-center font-black text-sm shrink-0 border border-[#00E5BE]/40">
                02
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  {t.notifications.feature1Title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t.notifications.feature1Desc}
                </p>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl flex items-start gap-4 hover:border-[#00E5BE]/40 transition-all backdrop-blur-md">
              <div className="w-11 h-11 rounded-2xl bg-amber-400/20 text-amber-700 dark:text-amber-300 flex items-center justify-center font-black text-sm shrink-0 border border-amber-400/30">
                03
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  {t.notifications.feature2Title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t.notifications.feature2Desc}
                </p>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl flex items-start gap-4 hover:border-[#00E5BE]/40 transition-all backdrop-blur-md">
              <div className="w-11 h-11 rounded-2xl bg-blue-500/20 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black text-sm shrink-0 border border-blue-500/30">
                04
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  {t.notifications.feature3Title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t.notifications.feature3Desc}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenNotifications}
                className="px-6 py-3.5 bg-gradient-to-r from-[#00E5BE] to-[#00c2cb] text-slate-950 text-xs sm:text-sm font-black rounded-2xl flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-500/25 border border-white/40 hover:scale-105 transition-all"
              >
                <BellRing className="w-4 h-4" />
                <span>{t.notifications.openCenterBtn}</span>
              </button>

              <button
                onClick={onOpenBooking}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs sm:text-sm font-bold rounded-2xl border border-slate-200 dark:border-white/20 backdrop-blur-md shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4 text-[#0284C7] dark:text-[#00E5BE]" />
                <span>{isArabic ? 'حجز جلسة وتفعيل التنبيهات' : 'Book Session & Activate Alerts'}</span>
              </button>
            </div>

          </div>

          {/* Left: Glassy Interactive Phone Mockup Preview */}
          <div className="lg:col-span-5 flex justify-center perspective-1000">
            <div 
              className="w-full max-w-sm glass-panel rounded-[2.8rem] p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] border border-white/25 relative backdrop-blur-xl"
              style={{
                transform: 'rotateY(-6deg) rotateX(4deg)',
                transformStyle: 'preserve-3d',
              }}
            >
              
              {/* Phone Speaker Notch */}
              <div className="w-28 h-4 bg-white/15 backdrop-blur-md rounded-full mx-auto mb-4 border border-white/10" />

              {/* Toggle WhatsApp vs SMS */}
              <div className="flex bg-white/[0.06] p-1.5 rounded-2xl mb-4 text-xs font-bold border border-white/10 backdrop-blur-md">
                <button
                  onClick={() => setActivePreview('whatsapp')}
                  className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activePreview === 'whatsapp'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'تنبيهات WhatsApp' : 'WhatsApp Alerts'}</span>
                </button>

                <button
                  onClick={() => setActivePreview('sms')}
                  className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activePreview === 'sms'
                      ? 'bg-[#00E5BE] text-slate-950 font-black shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'رسائل SMS' : 'SMS Alerts'}</span>
                </button>
              </div>

              {/* Screen Content */}
              <div className={`bg-slate-950/80 backdrop-blur-md border border-white/15 rounded-2xl p-4 min-h-[380px] ${isArabic ? 'text-right' : 'text-left'} text-xs space-y-3 font-sans shadow-inner text-white`} dir={direction}>
                {activePreview === 'whatsapp' ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-slate-300">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                        {isArabic ? 'ر' : 'R'}
                      </div>
                      <div>
                        <span className="font-black text-xs block text-white">{isArabic ? 'مركز رابا للعلاج بتحليل السلوك ABA' : 'Raba Center - ABA Therapy'}</span>
                        <span className="text-[10px] text-[#00E5BE] font-bold">{isArabic ? 'حساب أعمال موثق معتمد ✓' : 'Verified Business Account ✓'}</span>
                      </div>
                    </div>

                    <div className="bg-white/[0.08] backdrop-blur-md p-3.5 rounded-2xl rounded-tr-none shadow-md border border-white/15 text-slate-200 space-y-2">
                      <p className="font-black text-[#00E5BE] text-xs">
                        {isArabic ? 'تذكير بموعد جلسة طفلك القادمة 🔔' : 'Upcoming Session Reminder 🔔'}
                      </p>
                      <p className="text-[11px] leading-relaxed">
                        {isArabic 
                          ? 'عزيزي ولي الأمر، نود تذكيركم بموعد جلسة تحليل السلوك التطبيقي (ABA) لطفلكم غداً.'
                          : 'Dear parent, this is a friendly reminder for your child\'s ABA session scheduled for tomorrow.'}
                      </p>
                      <div className="bg-white/[0.05] p-2.5 rounded-xl text-[10px] text-slate-300 space-y-1 font-mono border border-white/10">
                        <div>📅 {isArabic ? 'التاريخ: الأحد القادم' : 'Date: Next Sunday'}</div>
                        <div>⏰ {isArabic ? 'الوقت: 10:00 صباحاً' : 'Time: 10:00 AM'}</div>
                        <div>👩‍⚕️ {isArabic ? 'الأخصائية: د. نورة العتيبي (BCBA)' : 'Clinician: Dr. Noura Al-Otaibi (BCBA)'}</div>
                        <div>📍 {isArabic ? 'العيادة: قاعة التدخل السلوكي (1)' : 'Clinic: Behavioral Gym (1)'}</div>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {isArabic ? 'للتأكيد التلقائي أو الاعتذار، يرجى الرد على هذه الرسالة.' : 'To auto-confirm or reschedule, simply reply to this message.'}
                      </p>
                      <span className={`text-[9px] text-slate-400 block ${isArabic ? 'text-left' : 'text-right'}`}>10:00 {isArabic ? 'ص' : 'AM'} ✓✓</span>
                    </div>

                    <div className="bg-emerald-600/90 text-white p-2.5 rounded-xl text-[10px] text-center font-black shadow-sm border border-emerald-400/30">
                      {isArabic ? 'تم تأكيد الحضور بنجاح، بانتظاركم بكل حب 💚' : 'Session confirmed, we look forward to seeing you 💚'}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center text-[10px] text-slate-400 pb-1">
                      {isArabic ? 'الرسائل النصية SMS • رابا سنتر RABA' : 'SMS Messages • RABA Center'}
                    </div>

                    <div className="bg-white/[0.08] backdrop-blur-md p-3.5 rounded-2xl rounded-tr-none shadow-md border border-white/15 text-slate-200 space-y-2 text-[11px] leading-relaxed">
                      <p className="font-black text-[#00E5BE]">
                        {isArabic ? 'تم تأكيد الحجز - مركز رابا ABA:' : 'Booking Confirmed - Raba ABA:'}
                      </p>
                      <p>
                        {isArabic 
                          ? 'تم تأكيد موعد جلسة التقييم الشامل للطفل (سلطان) يوم الأحد 10:00ص. رقم الحجز: REF-84291.'
                          : 'Appointment confirmed for Sultan on Sunday at 10:00 AM. Ref: REF-84291.'}
                      </p>
                      <p className="text-slate-400 text-[10px]">
                        {isArabic ? 'رابط الموقع والتفاصيل: raba.sa/ref84291' : 'Location map & details: raba.sa/ref84291'}
                      </p>
                      <span className={`text-[9px] text-slate-400 block ${isArabic ? 'text-left' : 'text-right'}`}>{isArabic ? 'أمس 04:30م' : 'Yesterday 4:30 PM'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Phone Indicator */}
              <div className="w-32 h-1 bg-white/20 rounded-full mx-auto mt-4" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
