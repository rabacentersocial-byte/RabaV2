import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  CheckCircle2,
  Check,
  MessageCircle,
  CreditCard,
  Globe,
  AlertCircle,
  GraduationCap,
  User,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  ArrowRight,
  FileCheck2
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
  const [submittedRef, setSubmittedRef] = useState('');

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

  // Keep selected payment plan valid when admin toggles options
  useEffect(() => {
    if (enabledPaymentPlans.length > 0 && !enabledPaymentPlans.includes(paymentPlan)) {
      setPaymentPlan(enabledPaymentPlans[0]);
    }
  }, [enabledPaymentPlans, paymentPlan]);

  // Reset transient submission/success/error state whenever modal opens or selected course changes
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setErrorMessage('');
      setIsSubmitting(false);
      setSubmittedRef('');
    }
  }, [isOpen, course?.id]);

  // Lock body scroll safely with reference counting & support Escape key while modal is open
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;

    const currentLocks = Number(document.body.dataset.modalLockCount || '0');
    document.body.dataset.modalLockCount = String(currentLocks + 1);
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      const nextLocks = Math.max(0, Number(document.body.dataset.modalLockCount || '1') - 1);
      if (nextLocks === 0) {
        delete document.body.dataset.modalLockCount;
        document.body.style.overflow = '';
      } else {
        document.body.dataset.modalLockCount = String(nextLocks);
      }
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !course || typeof document === 'undefined') return null;

  const selectedCountry = MIDDLE_EAST_COUNTRIES.find((c) => c.code === countryCode) || MIDDLE_EAST_COUNTRIES[0];
  const selectedCountryLabel = isArabic ? selectedCountry.nameAr : selectedCountry.nameEn;

  const courseTitle = isArabic ? course.titleAr : course.titleEn;
  const hoursBadge = isArabic ? course.hoursBadgeAr : course.hoursBadgeEn;
  const priceText = isArabic ? course.priceDisplayAr : course.priceDisplayEn;
  const highlightText = isArabic ? course.tagHighlightAr : course.tagHighlightEn;
  const targetWhatsappNumber = (coursesSettings.whatsappNumber || '966575100100').replace(/[^0-9]/g, '') || '966575100100';

  const whatsappMessage = encodeURIComponent(
    `السلام عليكم، أود الاستفسار والتسجيل في: ${course.titleAr} (${course.hoursBadgeAr}) - الدولة: ${selectedCountry.nameAr}${submittedRef ? ` - رقم الطلب: ${submittedRef}` : ''} عبر منصة رابا التعليمية.`
  );
  const whatsappUrl = `https://wa.me/${targetWhatsappNumber}?text=${whatsappMessage}`;

  const resolvePaymentMethod = (): Appointment['paymentMethod'] | undefined => {
    if (enabledPaymentPlans.length === 0) return undefined;
    if (paymentPlan === 'tamara') return 'tamara';
    if (paymentPlan === 'emkan') return 'emkan';
    return 'bank_transfer';
  };

  const resolvePaymentLabel = (): string => {
    if (enabledPaymentPlans.length === 0) {
      return isArabic ? 'يتم التنسيق مع مسؤول الكورسات' : 'Coordinated with Academy Advisor';
    }
    if (paymentPlan === 'tamara') return isArabic ? 'تقسيط تمارا' : 'Tamara Installments';
    if (paymentPlan === 'emkan') return isArabic ? 'تمويل إمكان' : 'Emkan Finance';
    return isArabic ? 'سداد / تحويل بنكي' : 'Direct / Bank Transfer';
  };

  const handleCloseSafely = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
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

    const paymentLabelAr =
      enabledPaymentPlans.length === 0
        ? 'يتم التنسيق مع مسؤول الكورسات'
        : paymentPlan === 'tamara'
        ? 'تقسيط تمارا'
        : paymentPlan === 'emkan'
        ? 'تمويل إمكان'
        : 'سداد / تحويل بنكي';

    setIsSubmitting(true);

    try {
      const created = await dispatchCustomerRequestAsync({
        clientName: fullName.trim().slice(0, 140),
        childName: `تسجيل دورة: ${course.shortTitle || course.titleAr}`.slice(0, 140),
        phone: phone.trim().slice(0, 30),
        email: email.trim().slice(0, 120),
        requestType: 'course',
        type: 'course',
        serviceId: String(course.id || 'course-general').slice(0, 120),
        serviceType: String(course.titleAr || course.titleEn || 'دورة تدريبية').slice(0, 190),
        specialistName: hasSpecificAssignee && routing?.assignedUserName
          ? String(routing.assignedUserName).slice(0, 140)
          : (isArabic ? 'إدارة التدريب والكورسات' : 'Training & Courses Department'),
        sourcePage: 'سلايدر الكورسات والدورات',
        country: selectedCountry.nameAr.slice(0, 90),
        city: (city.trim() || selectedCountry.nameAr).slice(0, 90),
        qualification: qualification.trim().slice(0, 190),
        paymentMethod: resolvePaymentMethod(),
        paymentStatus: enabledPaymentPlans.length > 0 && (paymentPlan === 'tamara' || paymentPlan === 'emkan') ? 'installment' : 'unpaid',
        ...(hasSpecificAssignee ? {
          assignedToUserId: routing?.assignedUserId,
          assignedToUserName: routing?.assignedUserName,
          assignedToUserEmail: routing?.assignedUserEmail
        } : {}),
        amount: parsedPrice,
        notes: `الدورة: ${course.titleAr} | الساعات: ${course.hoursBadgeAr} | الدولة: ${selectedCountry.nameAr} | المدينة: ${city.trim() || 'غير محددة'} | التخصص: ${qualification.trim() || 'غير محدد'} | طريقة السداد المفضلة: ${paymentLabelAr}${notes.trim() ? ` | ملاحظات: ${notes.trim()}` : ''}`.slice(0, 1800)
      });

      setSubmittedRef(created?.referenceNumber || '');
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
    setSubmittedRef('');
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
      : 'grid-cols-1 sm:grid-cols-3';

  const inputBaseClass =
    'w-full min-w-0 h-11 rounded-xl border border-[#161B26]/12 dark:border-white/12 bg-[#F9F8F5] dark:bg-white/[0.04] focus:bg-white dark:focus:bg-[#101522] text-[#161B26] dark:text-[#F8FAFC] placeholder:text-[#6B7280] dark:placeholder:text-[#64748B] text-sm transition-colors duration-150 focus:outline-none focus:border-[#2B95FF] focus:ring-2 focus:ring-[#2B95FF]/20';

  const modalNode = (
    <div
      className="fixed inset-0 z-[125] isolate overflow-y-auto overscroll-contain bg-[#0B0F17]/70 backdrop-blur-md flex items-start sm:items-center justify-center p-3 sm:p-5"
      dir={isArabic ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-registration-modal-title"
      onClick={handleCloseSafely}
    >
      <div
        className={`relative my-auto w-full max-w-2xl glass-modal-dialog overflow-hidden max-h-[90dvh] flex flex-col ${isArabic ? 'text-right' : 'text-left'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Theme-Harmonized Header (mirrors Raba Light Alabaster & Dark Obsidian + Sky Blue) */}
        <div className="relative shrink-0 px-5 py-4 sm:px-6 sm:py-5 bg-gradient-to-l from-[#2B95FF]/12 via-[#2B95FF]/[0.04] to-transparent dark:from-[#2B95FF]/18 dark:via-[#1263D6]/8 dark:to-transparent border-b border-[#161B26]/[0.08] dark:border-white/10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-[#2B95FF]/14 dark:bg-[#2B95FF]/20 border border-[#2B95FF]/20 text-[#1263D6] dark:text-[#60AFFF] flex items-center justify-center shrink-0 mt-0.5">
                <GraduationCap className="w-5 h-5" />
              </div>

              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-bold text-[#1263D6] dark:text-[#60AFFF]">
                  <span>{isArabic ? 'أكاديمية رابا للتدريب' : 'RABA Training Academy'}</span>
                  {hoursBadge && (
                    <>
                      <span aria-hidden="true" className="text-[#161B26]/25 dark:text-white/25">·</span>
                      <span className="text-[#4B5563] dark:text-[#94A3B8] tabular-nums">{hoursBadge}</span>
                    </>
                  )}
                  {priceText && (
                    <>
                      <span aria-hidden="true" className="text-[#161B26]/25 dark:text-white/25">·</span>
                      <span className="text-[#047857] dark:text-[#34D399] font-extrabold tabular-nums">{priceText}</span>
                    </>
                  )}
                </div>

                <h3
                  id="course-registration-modal-title"
                  className="text-base sm:text-xl font-black text-[#161B26] dark:text-[#F8FAFC] leading-snug break-words"
                >
                  {courseTitle}
                </h3>

                <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] leading-relaxed line-clamp-2">
                  {highlightText || (isArabic ? course.descriptionAr : course.descriptionEn)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloseSafely}
              disabled={isSubmitting}
              className="w-9 h-9 rounded-full bg-[#161B26]/[0.06] hover:bg-[#161B26]/[0.12] dark:bg-white/10 dark:hover:bg-white/18 text-[#4B5563] dark:text-[#CBD5E1] flex items-center justify-center transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              aria-label={isArabic ? 'إغلاق' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="px-5 py-5 sm:px-6 sm:py-6 overflow-y-auto overscroll-contain flex-1 min-h-0">
          {isSuccess ? (
            /* Theme-Aligned Confirmation Screen */
            <div className="py-3 sm:py-5 text-center space-y-5">
              <div className="w-14 h-14 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#047857] dark:text-[#34D399] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-lg sm:text-2xl font-black text-[#161B26] dark:text-[#F8FAFC]">
                  {isArabic ? 'تم استلام طلب تسجيلك بنجاح' : 'Registration Received'}
                </h4>
                <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                  {isArabic
                    ? `شكراً لتسجيلك في برامج أكاديمية رابا (${selectedCountryLabel}). سيتواصل معك مستشار التدريب قريباً لتأكيد المقعد وتزويدك بالتفاصيل.`
                    : `Thank you for registering with RABA Academy (${selectedCountryLabel}). Our training advisor will contact you shortly to confirm your seat.`}
                </p>
              </div>

              {/* Clean Hairline Summary Block */}
              <div className="max-w-md mx-auto bg-[#F5F2EC]/70 dark:bg-white/[0.04] border border-[#161B26]/[0.08] dark:border-white/10 rounded-2xl p-4 text-xs space-y-2.5">
                {submittedRef && (
                  <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-[#161B26]/[0.08] dark:border-white/10">
                    <span className="text-[#525B6B] dark:text-[#94A3B8]">{isArabic ? 'الرقم المرجعي:' : 'Reference:'}</span>
                    <span className="font-mono tabular-nums font-black text-[#1263D6] dark:text-[#60AFFF]" dir="ltr">{submittedRef}</span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#525B6B] dark:text-[#94A3B8] shrink-0">{isArabic ? 'الدورة:' : 'Course:'}</span>
                  <span className="font-bold text-[#161B26] dark:text-[#F8FAFC] truncate">{courseTitle}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#525B6B] dark:text-[#94A3B8] shrink-0">{isArabic ? 'المتقدم:' : 'Applicant:'}</span>
                  <span className="font-bold text-[#161B26] dark:text-[#F8FAFC] truncate">{fullName}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#525B6B] dark:text-[#94A3B8] shrink-0">{isArabic ? 'خيار السداد:' : 'Payment:'}</span>
                  <span className="font-bold text-[#047857] dark:text-[#34D399]">{resolvePaymentLabel()}</span>
                </div>
              </div>

              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md mx-auto">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-h-[46px] px-5 py-3 bg-[#047857] hover:bg-[#065F46] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>{isArabic ? 'تأكيد فوري عبر واتساب' : 'Confirm on WhatsApp'}</span>
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="min-h-[46px] px-6 py-3 bg-[#161B26]/[0.06] hover:bg-[#161B26]/[0.12] dark:bg-white/10 dark:hover:bg-white/16 text-[#161B26] dark:text-[#F8FAFC] font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  {isArabic ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {errorMessage && (
                <div
                  role="alert"
                  className="p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-xl text-xs text-rose-700 dark:text-rose-200 font-bold flex items-center gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Section 1: Applicant Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="min-w-0">
                  <label htmlFor="course-reg-fullname" className="block text-xs font-bold text-[#161B26] dark:text-[#E2E8F0] mb-1.5">
                    {isArabic ? 'الاسم الثلاثي' : 'Full Name'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className={`w-4 h-4 text-[#6B7280] dark:text-[#64748B] pointer-events-none absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3.5' : 'left-3.5'}`} />
                    <input
                      id="course-reg-fullname"
                      type="text"
                      required
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={isArabic ? 'مثال: سارة محمد القحطاني' : 'e.g. Sarah M. Al-Qahtani'}
                      className={`${inputBaseClass} ps-10 pe-3.5`}
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <label htmlFor="course-reg-phone" className="block text-xs font-bold text-[#161B26] dark:text-[#E2E8F0] mb-1.5">
                    {isArabic ? 'رقم الجوال (واتساب)' : 'Mobile / WhatsApp'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className={`w-4 h-4 text-[#6B7280] dark:text-[#64748B] pointer-events-none absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3.5' : 'left-3.5'}`} />
                    <input
                      id="course-reg-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={`${selectedCountry.dialCode} / 05XXXXXXXX`}
                      className={`${inputBaseClass} ${isArabic ? 'pr-10 pl-3.5' : 'pl-10 pr-3.5'} text-left tabular-nums`}
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <label htmlFor="course-reg-email" className="block text-xs font-bold text-[#161B26] dark:text-[#E2E8F0] mb-1.5">
                    {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className={`w-4 h-4 text-[#6B7280] dark:text-[#64748B] pointer-events-none absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3.5' : 'left-3.5'}`} />
                    <input
                      id="course-reg-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className={`${inputBaseClass} ${isArabic ? 'pr-10 pl-3.5' : 'pl-10 pr-3.5'} text-left`}
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <label htmlFor="course-reg-country" className="block text-xs font-bold text-[#161B26] dark:text-[#E2E8F0] mb-1.5">
                    {isArabic ? 'الدولة' : 'Country'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Globe className={`w-4 h-4 text-[#1263D6] dark:text-[#60AFFF] pointer-events-none absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3.5' : 'left-3.5'}`} />
                    <select
                      id="course-reg-country"
                      required
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className={`${inputBaseClass} ps-10 pe-3.5 cursor-pointer`}
                    >
                      {MIDDLE_EAST_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-white dark:bg-[#141821] text-[#161B26] dark:text-[#F8FAFC]">
                          {c.flag} {isArabic ? c.nameAr : c.nameEn} ({c.dialCode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="min-w-0">
                  <label htmlFor="course-reg-city" className="block text-xs font-bold text-[#161B26] dark:text-[#E2E8F0] mb-1.5">
                    {isArabic ? 'المدينة' : 'City'}
                  </label>
                  <div className="relative">
                    <MapPin className={`w-4 h-4 text-[#6B7280] dark:text-[#64748B] pointer-events-none absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3.5' : 'left-3.5'}`} />
                    <input
                      id="course-reg-city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder={isArabic ? 'الرياض / جدة / دبي / عمان...' : 'Riyadh, Jeddah, Dubai...'}
                      className={`${inputBaseClass} ps-10 pe-3.5`}
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <label htmlFor="course-reg-qualification" className="block text-xs font-bold text-[#161B26] dark:text-[#E2E8F0] mb-1.5">
                    {isArabic ? 'المؤهل أو التخصص الحالي' : 'Academic Field / Role'}
                  </label>
                  <div className="relative">
                    <GraduationCap className={`w-4 h-4 text-[#6B7280] dark:text-[#64748B] pointer-events-none absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3.5' : 'left-3.5'}`} />
                    <input
                      id="course-reg-qualification"
                      type="text"
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      placeholder={isArabic ? 'تربية خاصة / علم نفس / معلم ظل...' : 'Special Education / Psychology...'}
                      className={`${inputBaseClass} ps-10 pe-3.5`}
                    />
                  </div>
                </div>
              </div>

              {/* Hairline Divider */}
              <div className="border-t border-[#161B26]/[0.08] dark:border-white/10" />

              {/* Section 2: Admin-Controlled Payment Options */}
              {enabledPaymentPlans.length > 0 ? (
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#161B26] dark:text-[#E2E8F0]">
                      {isArabic ? 'خيار السداد المفضل' : 'Preferred Payment Plan'}
                    </span>
                    {hasAnyInstallmentActive && (
                      <span className="text-xs font-bold text-[#047857] dark:text-[#34D399]">
                        {isArabic ? 'متاح التقسيط بدون فوائد' : '0% interest installments available'}
                      </span>
                    )}
                  </div>

                  <div className={`grid ${paymentGridColsClass} gap-2.5 sm:gap-3`}>
                    {paymentConfig.tamara && (
                      <button
                        type="button"
                        onClick={() => setPaymentPlan('tamara')}
                        aria-pressed={paymentPlan === 'tamara'}
                        className={`relative min-w-0 min-h-[56px] p-3 rounded-2xl border text-center transition-colors duration-150 cursor-pointer flex sm:flex-col items-center justify-center gap-2 sm:gap-1.5 ${
                          paymentPlan === 'tamara'
                            ? 'border-[#2B95FF] bg-[#2B95FF]/[0.08] dark:bg-[#2B95FF]/15 text-[#1263D6] dark:text-[#60AFFF] ring-1 ring-[#2B95FF]/35'
                            : 'border-[#161B26]/10 dark:border-white/10 bg-[#F9F8F5] dark:bg-white/[0.03] hover:border-[#2B95FF]/45 text-[#4B5563] dark:text-[#CBD5E1]'
                        }`}
                      >
                        {paymentPlan === 'tamara' && (
                          <span className={`absolute top-2 ${isArabic ? 'left-2' : 'right-2'} w-4 h-4 rounded-full bg-[#2B95FF] text-white flex items-center justify-center`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-white/95 dark:bg-white/90">
                          <img src="/assets/tamara-logo.svg" alt="Tamara" width={60} height={20} loading="lazy" decoding="async" className="h-4 max-w-[68px] object-contain shrink-0" />
                        </span>
                        <span className="text-xs font-bold whitespace-nowrap">{isArabic ? 'تقسيط تمارا' : 'Tamara'}</span>
                      </button>
                    )}

                    {paymentConfig.emkan && (
                      <button
                        type="button"
                        onClick={() => setPaymentPlan('emkan')}
                        aria-pressed={paymentPlan === 'emkan'}
                        className={`relative min-w-0 min-h-[56px] p-3 rounded-2xl border text-center transition-colors duration-150 cursor-pointer flex sm:flex-col items-center justify-center gap-2 sm:gap-1.5 ${
                          paymentPlan === 'emkan'
                            ? 'border-[#2B95FF] bg-[#2B95FF]/[0.08] dark:bg-[#2B95FF]/15 text-[#1263D6] dark:text-[#60AFFF] ring-1 ring-[#2B95FF]/35'
                            : 'border-[#161B26]/10 dark:border-white/10 bg-[#F9F8F5] dark:bg-white/[0.03] hover:border-[#2B95FF]/45 text-[#4B5563] dark:text-[#CBD5E1]'
                        }`}
                      >
                        {paymentPlan === 'emkan' && (
                          <span className={`absolute top-2 ${isArabic ? 'left-2' : 'right-2'} w-4 h-4 rounded-full bg-[#2B95FF] text-white flex items-center justify-center`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-white/95 dark:bg-white/90">
                          <img src="/assets/emkan-logo.svg" alt="Emkan" width={60} height={20} loading="lazy" decoding="async" className="h-4 max-w-[68px] object-contain shrink-0" />
                        </span>
                        <span className="text-xs font-bold whitespace-nowrap">{isArabic ? 'تمويل إمكان' : 'Emkan'}</span>
                      </button>
                    )}

                    {paymentConfig.cash && (
                      <button
                        type="button"
                        onClick={() => setPaymentPlan('cash')}
                        aria-pressed={paymentPlan === 'cash'}
                        className={`relative min-w-0 min-h-[56px] p-3 rounded-2xl border text-center transition-colors duration-150 cursor-pointer flex sm:flex-col items-center justify-center gap-2 sm:gap-1.5 ${
                          paymentPlan === 'cash'
                            ? 'border-[#2B95FF] bg-[#2B95FF]/[0.08] dark:bg-[#2B95FF]/15 text-[#1263D6] dark:text-[#60AFFF] ring-1 ring-[#2B95FF]/35'
                            : 'border-[#161B26]/10 dark:border-white/10 bg-[#F9F8F5] dark:bg-white/[0.03] hover:border-[#2B95FF]/45 text-[#4B5563] dark:text-[#CBD5E1]'
                        }`}
                      >
                        {paymentPlan === 'cash' && (
                          <span className={`absolute top-2 ${isArabic ? 'left-2' : 'right-2'} w-4 h-4 rounded-full bg-[#2B95FF] text-white flex items-center justify-center`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                        <CreditCard className="w-5 h-5 text-[#1263D6] dark:text-[#60AFFF] shrink-0" />
                        <span className="text-xs font-bold whitespace-nowrap">{isArabic ? 'سداد / تحويل' : 'Direct / Bank'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[#F5F2EC]/80 dark:bg-white/[0.04] border border-[#161B26]/[0.08] dark:border-white/10 text-xs text-[#4B5563] dark:text-[#94A3B8] flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-[#1263D6] dark:text-[#60AFFF] shrink-0" />
                  <span>
                    {isArabic
                      ? 'سيتم تزويدك بتفاصيل وطرق السداد المتاحة عند تأكيد التسجيل من قِبل فريق الأكاديمية.'
                      : 'Payment details and options will be shared upon enrollment confirmation by our academy team.'}
                  </span>
                </div>
              )}

              {/* Optional Notes */}
              <div className="min-w-0">
                <label htmlFor="course-reg-notes" className="block text-xs font-bold text-[#161B26] dark:text-[#E2E8F0] mb-1.5">
                  {isArabic ? 'ملاحظات إضافية (اختياري)' : 'Additional Notes (Optional)'}
                </label>
                <textarea
                  id="course-reg-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isArabic ? 'هل لديك استفسار حول المواعيد أو متطلبات الاعتماد؟' : 'Any questions about schedule or accreditation requirements?'}
                  className="w-full min-w-0 px-3.5 py-2.5 rounded-xl border border-[#161B26]/12 dark:border-white/12 bg-[#F9F8F5] dark:bg-white/[0.04] focus:bg-white dark:focus:bg-[#101522] text-[#161B26] dark:text-[#F8FAFC] placeholder:text-[#6B7280] dark:placeholder:text-[#64748B] text-sm resize-none transition-colors duration-150 focus:outline-none focus:border-[#2B95FF] focus:ring-2 focus:ring-[#2B95FF]/20"
                />
              </div>

              {/* Action Buttons (Matches BookingModal Raba Sky-to-Emerald Primary CTA) */}
              <div className="pt-1 space-y-2.5">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 min-h-[48px] py-3 px-6 rounded-xl bg-gradient-to-r from-[#1668DC] via-[#1255B8] to-[#047857] hover:brightness-105 active:scale-[0.99] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-[#1263D6]/20 transition-all cursor-pointer disabled:opacity-60"
                  >
                    <FileCheck2 className="w-4 h-4 shrink-0" />
                    <span>{isSubmitting ? (isArabic ? 'جاري حفظ طلب التسجيل...' : 'Submitting...') : (isArabic ? 'تأكيد طلب التسجيل' : 'Submit Registration')}</span>
                    {isArabic ? <ArrowLeft className="w-4 h-4 shrink-0" /> : <ArrowRight className="w-4 h-4 shrink-0" />}
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto min-h-[48px] py-3 px-5 rounded-xl bg-[#10B981]/10 hover:bg-[#10B981]/18 text-[#047857] dark:text-[#34D399] border border-[#10B981]/25 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>{isArabic ? 'استفسار عبر واتساب' : 'WhatsApp'}</span>
                  </a>
                </div>

                <p className="text-center text-[11px] text-[#525B6B] dark:text-[#94A3B8]">
                  {isArabic
                    ? 'شهادة تدريبية معتمدة · تسجيل مباشر بدون دفع إلكتروني مسبق'
                    : 'Accredited certificate · Direct registration with no upfront online payment'}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
};

export default CourseRegistrationModal;
