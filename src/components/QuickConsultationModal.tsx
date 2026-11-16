import React, { useState } from 'react';
import { 
  X, 
  PhoneCall, 
  User, 
  Phone, 
  CheckCircle2, 
  MessageCircle, 
  Send,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { Appointment } from '../types';
import { 
  generateRequestReference, 
  saveAndBroadcastCustomerRequestAsync,
  getCustomerWhatsAppMessage 
} from '../data/customerRequests';

interface QuickConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessSubmit?: (request: Appointment) => void;
  defaultTopic?: string;
}

export const QuickConsultationModal: React.FC<QuickConsultationModalProps> = ({
  isOpen,
  onClose,
  onSuccessSubmit,
  defaultTopic = ''
}) => {
  const { isArabic, direction } = useLanguage();

  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState(defaultTopic || (isArabic ? 'تقييم شامل وتشخيص مبكر' : 'Comprehensive Assessment'));
  const [showOptional, setShowOptional] = useState(false);
  const [childAge, setChildAge] = useState('');
  const [preferredTime, setPreferredTime] = useState(isArabic ? 'صباحاً (09:00 ص - 12:00 م)' : 'Morning (09:00 AM - 12:00 PM)');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<Appointment | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!parentName.trim() || parentName.trim().length < 2) {
      setError(isArabic ? 'يرجى كتابة الاسم الكريم' : 'Please enter your name');
      return;
    }

    const digits = phone.replace(/\D/g, '');
    if (!phone.trim() || digits.length < 9) {
      setError(isArabic ? 'يرجى إدخال رقم جوال صحيح (مثال: 05XXXXXXXX)' : 'Please enter a valid mobile number (e.g. 05XXXXXXXX)');
      return;
    }

    setIsSubmitting(true);
    const ref = generateRequestReference('quick_consultation');

    const newRequest: Appointment = {
      id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      referenceNumber: ref,
      childName: childAge ? (isArabic ? `طفل عمره ${childAge} سنوات` : `Child age ${childAge}`) : (isArabic ? 'مستفيد جديد' : 'New Beneficiary'),
      childAge: Number(childAge) || 4,
      guardianName: parentName.trim(),
      guardianPhone: phone.trim(),
      guardianEmail: 'consultation@customer.com',
      serviceId: 'srv-consultation',
      serviceTitle: topic,
      specialistId: 'spec-general',
      specialistName: isArabic ? 'فريق الاستشارات والتوجيه الإكلينيكي' : 'Clinical Consultation Team',
      date: new Date().toISOString().split('T')[0],
      timeSlot: preferredTime,
      notes: notes.trim() || (isArabic ? `طلب استشارة حول: ${topic}` : `Inquiry about: ${topic}`),
      status: 'new',
      paymentStatus: 'unpaid',
      amount: 0,
      reminderSettings: {
        whatsapp: true,
        sms: true,
        email: false
      },
      createdAt: new Date().toISOString(),
      requestType: 'quick_consultation',
      requestSource: 'استشارة هاتفية سريعة',
      preferredCallTime: preferredTime,
      readByAdmin: false
    };

    try {
      await saveAndBroadcastCustomerRequestAsync(newRequest);

      if (onSuccessSubmit) {
        onSuccessSubmit(newRequest);
      }

      setSubmittedRequest(newRequest);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    } catch (err: any) {
      console.error('[QuickConsultationModal Error]:', err);
      setError(
        isArabic
          ? 'عذراً، حدث خطأ أثناء إرسال طلب الاستشارة. يرجى التحقق من اتصالك والمحاولة مجدداً.'
          : 'Failed to save consultation request. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmittedRequest(null);
    setError('');
    setParentName('');
    setPhone('');
    setNotes('');
    setShowOptional(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div 
        className={`relative glass-modal-dialog text-slate-900 dark:text-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden ${isArabic ? 'text-right' : 'text-left'} my-auto`}
        onClick={(e) => e.stopPropagation()}
        dir={direction}
      >
        {/* Simplified Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent dark:from-[#2E86EB]/15 dark:to-transparent border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2E86EB]/15 text-[#2E86EB] dark:text-[#2E86EB] flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{isArabic ? 'استشارة هاتفية مجانية' : 'Free Phone Consultation'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-[#047857] dark:text-[#34D399] font-bold">
                  {isArabic ? 'مجاناً 100%' : '100% Free'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isArabic ? 'يتواصل معك الأخصائي مباشرة للإجابة على تساؤلاتك' : 'Our specialist will call you directly'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 flex items-center justify-center text-slate-500 dark:text-slate-300 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {submittedRequest ? (
          <div className="p-5 sm:p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-[#00E5BE] rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                {isArabic ? 'تم إرسال طلبك بنجاح!' : 'Consultation Request Sent!'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isArabic 
                  ? 'تم استلام طلبك وسيتواصل معك الأخصائي التوجيهي قريباً.' 
                  : 'Your request has been received. Our team will contact you shortly.'}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl p-3.5 text-xs text-right space-y-1.5">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-1.5">
                <span className="text-slate-600 dark:text-slate-400">{isArabic ? 'الرقم المرجعي:' : 'Reference:'}</span>
                <span className="font-mono font-bold text-[#047857] dark:text-[#00E5BE]">{submittedRequest.referenceNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">{isArabic ? 'الاسم:' : 'Name:'}</span>
                <span className="font-bold">{submittedRequest.guardianName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">{isArabic ? 'الموضوع:' : 'Topic:'}</span>
                <span className="font-bold text-[#047857] dark:text-[#00E5BE]">{submittedRequest.serviceTitle}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <a
                href={getCustomerWhatsAppMessage(submittedRequest, isArabic)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>{isArabic ? 'تأكيد الطلب بالواتساب الآن' : 'Confirm via WhatsApp'}</span>
              </a>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 text-xs">
            
            {error && (
              <div className="p-2.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-700 dark:text-rose-200 font-bold">
                {error}
              </div>
            )}

            {/* Field 1: Name */}
            <div>
              <label htmlFor="quick-parent-name" className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                {isArabic ? 'الاسم الكريم:' : 'Your Name:'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="quick-parent-name"
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder={isArabic ? 'اكتب اسمك الثلاثي' : 'Enter your name'}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-[#00E5BE] outline-none"
                />
                <User className={`w-4 h-4 text-slate-500 dark:text-slate-400 absolute ${isArabic ? 'left-3' : 'right-3'} top-3`} />
              </div>
            </div>

            {/* Field 2: Phone */}
            <div>
              <label htmlFor="quick-phone" className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                {isArabic ? 'رقم الجوال للتواصل:' : 'Mobile Number:'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="quick-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05XXXXXXXX"
                  dir="ltr"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-mono placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-[#00E5BE] outline-none text-left"
                />
                <Phone className={`w-4 h-4 text-slate-500 dark:text-slate-400 absolute ${isArabic ? 'left-3' : 'right-3'} top-3`} />
              </div>
            </div>

            {/* Field 3: Topic */}
            <div>
              <label htmlFor="quick-topic-select" className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                {isArabic ? 'موضوع الاستشارة الأساسي:' : 'Consultation Topic:'}
              </label>
              <select
                id="quick-topic-select"
                aria-label={isArabic ? 'موضوع الاستشارة الأساسي' : 'Consultation Topic'}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00E5BE] outline-none cursor-pointer"
              >
                <option value={isArabic ? 'تقييم شامل وتشخيص مبكر' : 'Comprehensive Assessment'}>{isArabic ? 'تقييم شامل وتشخيص مبكر' : 'Comprehensive Assessment'}</option>
                <option value={isArabic ? 'تحليل سلوك تطبيقي (ABA)' : 'Applied Behavior Analysis (ABA)'}>{isArabic ? 'تحليل سلوك تطبيقي (ABA)' : 'Applied Behavior Analysis (ABA)'}</option>
                <option value={isArabic ? 'تكامل حسي وعلاج وظيفي' : 'Occupational & Sensory Therapy'}>{isArabic ? 'تكامل حسي وعلاج وظيفي' : 'Occupational & Sensory Therapy'}</option>
                <option value={isArabic ? 'تأخر وصعوبات نطق وتخاطب' : 'Speech & Language Difficulties'}>{isArabic ? 'تأخر وصعوبات نطق وتخاطب' : 'Speech & Language Difficulties'}</option>
                <option value={isArabic ? 'خدمة سِوار (معلم الظل المدرسي)' : 'Sewar Service (School Shadow Teacher)'}>{isArabic ? 'خدمة سِوار (معلم الظل المدرسي)' : 'Sewar Service (School Shadow Teacher)'}</option>
              </select>
            </div>

            {/* Collapsible details for child age & notes */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setShowOptional(!showOptional)}
                className="text-xs font-bold text-[#2E86EB] dark:text-[#2E86EB] hover:underline flex items-center gap-1 cursor-pointer min-h-[36px]"
              >
                <span>{isArabic ? '+ تحديد الوقت المفضل أو ملاحظة (اختياري)' : '+ Preferred time or note (Optional)'}</span>
                {showOptional ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showOptional && (
                <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/10 space-y-2.5 animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="quick-child-age" className="text-[10px] text-slate-600 dark:text-slate-400 block mb-1">{isArabic ? 'عمر الطفل (اختياري)' : 'Child Age'}</label>
                      <input
                        id="quick-child-age"
                        type="number"
                        min="1"
                        max="18"
                        value={childAge}
                        onChange={(e) => setChildAge(e.target.value)}
                        placeholder={isArabic ? 'مثال: 5' : 'e.g. 5'}
                        className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="quick-preferred-time" className="text-[10px] text-slate-600 dark:text-slate-400 block mb-1">{isArabic ? 'فترة الاتصال' : 'Call Window'}</label>
                      <select
                        id="quick-preferred-time"
                        aria-label={isArabic ? 'فترة الاتصال' : 'Call Window'}
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/15 rounded-xl px-2 py-1.5 text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                      >
                        <option value={isArabic ? 'صباحاً (09:00 ص - 12:00 م)' : 'Morning'}>{isArabic ? 'صباحاً (9 ص - 12 م)' : 'Morning'}</option>
                        <option value={isArabic ? 'مساءً (04:00 م - 08:00 م)' : 'Evening'}>{isArabic ? 'مساءً (4 م - 8 م)' : 'Evening'}</option>
                        <option value={isArabic ? 'في أي وقت متاح' : 'Anytime'}>{isArabic ? 'في أي وقت' : 'Anytime'}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="quick-notes" className="sr-only">{isArabic ? 'أبرز الملاحظات' : 'Symptom notes'}</label>
                    <input
                      id="quick-notes"
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={isArabic ? 'أبرز ما تلاحظه على طفلك (اختياري)...' : 'Brief symptom notes...'}
                      className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                aria-label={isArabic ? 'إرسال طلب الاستشارة الفورية' : 'Submit Quick Consultation Request'}
                className="w-full min-h-[48px] py-3 px-4 bg-gradient-to-r from-[#0E2A54] via-[#1B4B8A] to-[#1463D6] hover:opacity-95 active:scale-98 text-white font-black rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                <Send className={`w-3.5 h-3.5 ${isArabic ? 'rotate-180' : ''}`} />
                <span>{isSubmitting ? (isArabic ? 'جاري الإرسال وحفظ الطلب...' : 'Submitting...') : (isArabic ? 'إرسال طلب الاستشارة فوراً' : 'Submit Consultation Request')}</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                <Sparkles className="w-3 h-3 text-[#FFD23F]" />
                <span>{isArabic ? 'خدمة مجانية وسريعة - يتصل بك أخصائي التوجيه' : 'Free & quick service'}</span>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};
