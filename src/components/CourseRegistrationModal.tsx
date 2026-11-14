import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  GraduationCap, 
  Clock, 
  Award, 
  MessageCircle, 
  Sparkles,
  ShieldCheck,
  CreditCard,
  Send
} from 'lucide-react';
import { CourseItem } from '../data/coursesData';
import { useLanguage } from '../context/LanguageContext';
import { dispatchCustomerRequestAsync } from '../data/customerRequests';

interface CourseRegistrationModalProps {
  course: CourseItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CourseRegistrationModal: React.FC<CourseRegistrationModalProps> = ({
  course,
  isOpen,
  onClose
}) => {
  const { isArabic } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [qualification, setQualification] = useState('');
  const [paymentPlan, setPaymentPlan] = useState<'tamara' | 'emkan' | 'cash'>('tamara');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !course) return null;

  const courseTitle = isArabic ? course.titleAr : course.titleEn;
  const hoursBadge = isArabic ? course.hoursBadgeAr : course.hoursBadgeEn;

  const whatsappMessage = encodeURIComponent(
    `السلام عليكم، أود الاستفسار والتسجيل في: ${course.titleAr} (${course.hoursBadgeAr}) عبر منصة رابا التعليمية.`
  );
  const whatsappUrl = `https://wa.me/966575100100?text=${whatsappMessage}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage(isArabic ? 'يرجى كتابة الاسم الثلاثي' : 'Please enter your full name');
      return;
    }

    const digits = phone.replace(/\D/g, '');
    if (!phone.trim() || digits.length < 9) {
      setErrorMessage(isArabic ? 'يرجى إدخال رقم جوال صحيح (مثال: 05XXXXXXXX)' : 'Please enter a valid mobile number (e.g. 05XXXXXXXX)');
      return;
    }

    const parsedPrice = Number(String(course.currentPrice ?? '').replace(/[^0-9.]/g, '')) || 0;

    setIsSubmitting(true);

    try {
      await dispatchCustomerRequestAsync({
        clientName: fullName.trim(),
        childName: `تسجيل دورة: ${course.shortTitle || course.titleAr}`,
        phone: phone.trim(),
        email: email.trim(),
        requestType: 'course',
        type: 'course',
        serviceId: course.id,
        serviceType: course.titleAr,
        sourcePage: 'سلايدر الكورسات والدورات',
        city: city.trim() || 'الرياض',
        amount: parsedPrice,
        notes: `الدورة: ${course.titleAr} | الساعات: ${course.hoursBadgeAr} | المدينة: ${city || 'الرياض'} | التخصص: ${qualification || 'غير محدد'} | طريقة الدفع المفضلة: ${paymentPlan} | ملاحظات: ${notes || 'لا توجد'}`
      });

      setIsSuccess(true);
    } catch (err: any) {
      console.error('[CourseRegistrationModal Error]:', err);
      setErrorMessage(
        isArabic
          ? 'عذراً، حدث خطأ أثناء إرسال طلب التسجيل. يرجى التحقق من اتصالك والمحاولة مجدداً.'
          : 'Failed to record registration in database. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setErrorMessage('');
    setFullName('');
    setPhone('');
    setEmail('');
    setCity('');
    setQualification('');
    setNotes('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      dir={isArabic ? 'rtl' : 'ltr'}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-[#0F172A] via-[#16293D] to-[#0D3B3F] text-white p-6 sm:p-7 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-5 left-5 rtl:left-5 rtl:right-auto ltr:right-5 ltr:left-auto w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5007D] text-white text-[11px] font-black shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isArabic ? 'منصة رابا التعليمية' : 'RABA Academy'}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00E5BE]/20 border border-[#00E5BE]/40 text-[#00E5BE] text-[11px] font-black">
              <Clock className="w-3.5 h-3.5" />
              <span>{hoursBadge}</span>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
            {courseTitle}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed line-clamp-2">
            {isArabic ? course.descriptionAr : course.descriptionEn}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                {isArabic ? 'تم استلام طلب تسجيلك بنجاح!' : 'Registration Received!'}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                {isArabic 
                  ? 'شكراً لاهتمامك ببرامج منصة رابا التعليمية. سيتواصل معك مستشار التدريب الأكاديمي خلال وقت قصير لتأكيد المقعد وتزويدك بالجدول التدريبي ورابط المنصة.'
                  : 'Thank you for registering with RABA Academy. Our academic advisor will contact you shortly to confirm your seat.'}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-[#00E5BE] hover:bg-[#00ffd2] text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>{isArabic ? 'تأكيد فوري عبر واتساب' : 'Fast Confirm on WhatsApp'}</span>
                </a>
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-white font-bold rounded-xl text-sm"
                >
                  {isArabic ? 'إغلاق النافذة' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-700 dark:text-rose-200 font-bold">
                  {errorMessage}
                </div>
              )}
              {/* Highlights badge bar */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold">
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{isArabic ? course.tagHighlightAr : course.tagHighlightEn}</span>
                </div>

                {course.priceDisplayAr && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-500/30 text-teal-800 dark:text-[#00E5BE] font-black">
                    <span>{isArabic ? 'الرسوم:' : 'Fee:'}</span>
                    <span>{isArabic ? course.priceDisplayAr : course.priceDisplayEn}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{isArabic ? 'شهادة تدريبية معتمدة' : 'Accredited Certificate'}</span>
                </div>
              </div>

              {/* Form Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isArabic ? 'الاسم الثلاثي *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isArabic ? 'مثال: سارة محمد القحطاني' : 'e.g. Sarah M. Al-Qahtani'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#00E5BE]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isArabic ? 'رقم الجوال (واتساب) *' : 'Mobile / WhatsApp *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#00E5BE]"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#00E5BE]"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isArabic ? 'المدينة' : 'City'}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={isArabic ? 'الرياض / جدة / الخبر...' : 'Riyadh, Jeddah, Khobar...'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#00E5BE]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isArabic ? 'المؤهل الأكاديمي أو التخصص الحالي' : 'Academic Field or Current Role'}
                </label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder={isArabic ? 'مثال: بكالوريوس تربية خاصة / أخصائي علم نفس / معلم ظل...' : 'e.g. Special Education / Psychology / Shadow Teacher'}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#00E5BE]"
                />
              </div>

              {/* Installment / Payment Options */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
                  <span>{isArabic ? 'خيار السداد أو التقسيط المفضل:' : 'Preferred Payment Plan:'}</span>
                  <span className="text-[11px] text-teal-600 dark:text-[#00E5BE] font-bold">
                    {isArabic ? 'متاح التقسيط بدون فوائد' : '0% Interest Installments'}
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentPlan('tamara')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      paymentPlan === 'tamara'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-black'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-400 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <img src="/assets/tamara-logo.svg" alt="Tamara" width={60} height={20} loading="lazy" decoding="async" className="h-5 object-contain" />
                    <span className="text-[11px] font-bold">{isArabic ? 'تقسيط تمارا' : 'Tamara'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentPlan('emkan')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      paymentPlan === 'emkan'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-black'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-400 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <img src="/assets/emkan-logo.svg" alt="Emkan" width={60} height={20} loading="lazy" decoding="async" className="h-5 object-contain" />
                    <span className="text-[11px] font-bold">{isArabic ? 'تمويل إمكان' : 'Emkan'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentPlan('cash')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      paymentPlan === 'cash'
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-black'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-400 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-cyan-500" />
                    <span className="text-[11px] font-bold">{isArabic ? 'سداد / تحويل' : 'Direct / Bank'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 fill-slate-950" />
                  <span>{isSubmitting ? (isArabic ? 'جاري الإرسال...' : 'Submitting...') : (isArabic ? 'تأكيد طلب التسجيل' : 'Submit Registration')}</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-[#0F2438] hover:bg-[#15324d] text-white border border-white/15 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-cyan-400" />
                  <span>{isArabic ? 'استفسار عبر واتساب' : 'WhatsApp'}</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
