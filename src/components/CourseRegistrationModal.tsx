import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Award, 
  MessageCircle, 
  Sparkles,
  ShieldCheck,
  CreditCard,
  Send,
  Globe
} from 'lucide-react';
import {
  CourseItem,
  CoursesSectionSettings,
  DEFAULT_COURSES_SETTINGS,
  MIDDLE_EAST_COUNTRIES
} from '../data/coursesData';
import { useLanguage } from '../context/LanguageContext';
import { useLiveDataOptional } from '../context/LiveDataContext';
import { dispatchCustomerRequestAsync } from '../data/customerRequests';
import { Appointment } from '../types';

interface CourseRegistrationModalProps {
  course: CourseItem | null;
  isOpen: boolean;
  onClose: () => void;
}

type CoursePaymentPlanId = 'tamara' | 'emkan' | 'cash';

export const CourseRegistrationModal: React.FC<CourseRegistrationModalProps> = ({
  course,
  isOpen,
  onClose
}) => {
  const { isArabic } = useLanguage();
  const live = useLiveDataOptional();
  const coursesSettings: CoursesSectionSettings = live?.coursesSettings || DEFAULT_COURSES_SETTINGS;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState<string>('SA');
  const [city, setCity] = useState('');
  const [qualification, setQualification] = useState('');
  const [paymentPlan, setPaymentPlan] = useState<CoursePaymentPlanId>('tamara');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const paymentConfig = useMemo(() => ({
    tamara: coursesSettings.paymentOptions?.tamara !== false,
    emkan: coursesSettings.paymentOptions?.emkan !== false,
    cash: coursesSettings.paymentOptions?.cash !== false
  }), [coursesSettings]);

  const enabledPaymentPlans = useMemo(() => {
    const list: CoursePaymentPlanId[] = [];
    if (paymentConfig.tamara) list.push('tamara');
    if (paymentConfig.emkan) list.push('emkan');
    if (paymentConfig.cash) list.push('cash');
    return list;
  }, [paymentConfig]);

  const hasAnyInstallmentActive = paymentConfig.tamara || paymentConfig.emkan;

  // Ensure selected payment plan always stays valid when admin toggles options
  useEffect(() => {
    if (enabledPaymentPlans.length > 0 && !enabledPaymentPlans.includes(paymentPlan)) {
      setPaymentPlan(enabledPaymentPlans[0]);
    }
  }, [enabledPaymentPlans, paymentPlan]);

  if (!isOpen || !course) return null;

  const selectedCountry = MIDDLE_EAST_COUNTRIES.find((c) => c.code === countryCode) || MIDDLE_EAST_COUNTRIES[0];
  const selectedCountryLabel = isArabic ? selectedCountry.nameAr : selectedCountry.nameEn;

  const courseTitle = isArabic ? course.titleAr : course.titleEn;
  const hoursBadge = isArabic ? course.hoursBadgeAr : course.hoursBadgeEn;
  const targetWhatsappNumber = (coursesSettings.whatsappNumber || '966575100100').replace(/[^0-9]/g, '') || '966575100100';

  const whatsappMessage = encodeURIComponent(
    `السلام عليكم، أود الاستفسار والتسجيل في: ${course.titleAr} (${course.hoursBadgeAr}) - الدولة: ${selectedCountry.nameAr} عبر منصة رابا التعليمية.`
  );
  const whatsappUrl = `https://wa.me/${targetWhatsappNumber}?text=${whatsappMessage}`;

  const resolvePaymentMethod = (): Appointment['paymentMethod'] | undefined => {
    if (enabledPaymentPlans.length === 0) return undefined;
    if (paymentPlan === 'tamara') return 'tamara';
    if (paymentPlan === 'emkan') return 'emkan';
    return 'bank_transfer';
  };

  const resolvePaymentLabelAr = (): string => {
    if (enabledPaymentPlans.length === 0) return 'يتم التنسيق مع مسؤول الكورسات';
    if (paymentPlan === 'tamara') return 'تقسيط تمارا';
    if (paymentPlan === 'emkan') return 'تمويل إمكان';
    return 'سداد / تحويل بنكي';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage(isArabic ? 'يرجى كتابة الاسم الثلاثي' : 'Please enter your full name');
      return;
    }

    const digits = phone.replace(/\D/g, '');
    if (!phone.trim() || digits.length < 8) {
      setErrorMessage(isArabic ? 'يرجى إدخال رقم جوال صحيح (مثال: 05XXXXXXXX)' : 'Please enter a valid mobile number (e.g. 05XXXXXXXX)');
      return;
    }

    if (!countryCode) {
      setErrorMessage(isArabic ? 'يرجى اختيار الدولة' : 'Please select your country');
      return;
    }

    const parsedPrice = Number(String(course.currentPrice ?? '').replace(/[^0-9.]/g, '')) || 0;
    const routing = coursesSettings.courseRouting;
    const hasSpecificAssignee = Boolean(routing?.mode === 'specific_user' && routing?.assignedUserId);

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
        specialistName: hasSpecificAssignee && routing?.assignedUserName
          ? routing.assignedUserName
          : (isArabic ? 'إدارة التدريب والكورسات' : 'Training & Courses Department'),
        sourcePage: 'سلايدر الكورسات والدورات',
        country: selectedCountry.nameAr,
        city: city.trim() || selectedCountry.nameAr,
        qualification: qualification.trim(),
        paymentMethod: resolvePaymentMethod(),
        paymentStatus: enabledPaymentPlans.length > 0 && (paymentPlan === 'tamara' || paymentPlan === 'emkan') ? 'installment' : 'unpaid',
        ...(hasSpecificAssignee ? {
          assignedToUserId: routing?.assignedUserId,
          assignedToUserName: routing?.assignedUserName,
          assignedToUserEmail: routing?.assignedUserEmail
        } : {}),
        amount: parsedPrice,
        notes: `الدورة: ${course.titleAr} | الساعات: ${course.hoursBadgeAr} | الدولة: ${selectedCountry.nameAr} | المدينة: ${city.trim() || 'غير محددة'} | التخصص: ${qualification.trim() || 'غير محدد'} | طريقة السداد المفضلة: ${resolvePaymentLabelAr()}${notes ? ` | ملاحظات: ${notes}` : ''}`
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
    setCountryCode('SA');
    setCity('');
    setQualification('');
    setNotes('');
    onClose();
  };

  const paymentGridColsClass =
    enabledPaymentPlans.length === 1
      ? 'grid-cols-1'
      : enabledPaymentPlans.length === 2
      ? 'grid-cols-2'
      : 'grid-cols-3';

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
                  ? `شكراً لاهتمامك ببرامج منصة رابا التعليمية (${selectedCountryLabel}). سيتواصل معك مستشار التدريب الأكاديمي خلال وقت قصير لتأكيد المقعد وتزويدك بالجدول التدريبي ورابط المنصة.`
                  : `Thank you for registering with RABA Academy (${selectedCountryLabel}). Our academic advisor will contact you shortly to confirm your seat.`}
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
                  className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-white font-bold rounded-xl text-sm cursor-pointer"
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
                    placeholder={`${selectedCountry.dialCode} / 05XXXXXXXX`}
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
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-[#00E5BE]" />
                    <span>{isArabic ? 'الدولة (دول الشرق الأوسط) *' : 'Country (Middle East) *'}</span>
                  </label>
                  <select
                    required
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#00E5BE] cursor-pointer"
                  >
                    {MIDDLE_EAST_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {isArabic ? c.nameAr : c.nameEn} ({c.dialCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isArabic ? 'المدينة' : 'City'}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={isArabic ? 'الرياض / دبي / عمان / القاهرة...' : 'Riyadh, Dubai, Amman, Cairo...'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#00E5BE]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isArabic ? 'المؤهل الأكاديمي أو التخصص الحالي' : 'Academic Field or Current Role'}
                  </label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder={isArabic ? 'بكالوريوس تربية خاصة / أخصائي علم نفس / معلم ظل...' : 'Special Education / Psychology / Shadow Teacher'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#00E5BE]"
                  />
                </div>
              </div>

              {/* Admin-Controlled Installment / Payment Options */}
              {enabledPaymentPlans.length > 0 ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
                    <span>{isArabic ? 'خيار السداد أو التقسيط المفضل:' : 'Preferred Payment Plan:'}</span>
                    {hasAnyInstallmentActive && (
                      <span className="text-[11px] text-teal-600 dark:text-[#00E5BE] font-bold">
                        {isArabic ? 'متاح التقسيط بدون فوائد' : '0% Interest Installments'}
                      </span>
                    )}
                  </label>
                  <div className={`grid ${paymentGridColsClass} gap-3`}>
                    {paymentConfig.tamara && (
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
                    )}

                    {paymentConfig.emkan && (
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
                    )}

                    {paymentConfig.cash && (
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
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-teal-600 dark:text-[#00E5BE] shrink-0" />
                  <span>
                    {isArabic
                      ? 'سيتم تزويدك بتفاصيل وطرق السداد المتاحة عند تأكيد التسجيل من قِبل فريق الأكاديمية.'
                      : 'Payment details and options will be shared upon enrollment confirmation by our academy team.'}
                  </span>
                </div>
              )}

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
