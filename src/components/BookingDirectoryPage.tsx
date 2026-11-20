import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileCheck2,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SERVICES, THERAPY_PACKAGES, TIME_SLOTS } from '../data/mockData';
import { BRANCHES_DATA, BranchItem } from '../data/branchesData';
import { Specialist, ServiceItem, TherapyPackage, Appointment } from '../types';
import { useLiveDataOptional } from '../context/LiveDataContext';
import {
  generateRequestReference,
  saveAndBroadcastCustomerRequestAsync,
  getCustomerWhatsAppMessage,
} from '../data/customerRequests';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface BookingDirectoryPageProps {
  onBackToHome: () => void;
  onConfirmBooking: (appointment: Appointment) => void;
  initialService?: ServiceItem | null;
  initialPackage?: TherapyPackage | null;
  initialSpecialist?: Specialist | null;
  initialNotes?: string;
  initialDate?: string;
  onNavigate?: (path: string) => void;
}

export const BookingDirectoryPage: React.FC<BookingDirectoryPageProps> = ({
  onBackToHome,
  onConfirmBooking,
  initialService,
  initialPackage,
  initialSpecialist,
  initialNotes,
  initialDate,
  onNavigate,
}) => {
  const { isArabic, direction } = useLanguage();
  const { user, clientProfile } = useAuth();
  const live = useLiveDataOptional();

  const activeLiveServices = (live?.services || []).filter((s) => s.active !== false && s.isActive !== false);
  const activeLivePackages = (live?.packages || []).filter((p) => p.active !== false && p.isActive !== false);

  const servicesList = activeLiveServices.length ? activeLiveServices : (live?.isAuthoritativeServices ? [] : SERVICES);
  const packagesList = activeLivePackages.length ? activeLivePackages : (live?.isAuthoritativePackages ? [] : THERAPY_PACKAGES);
  const branchesList: BranchItem[] = live?.branches?.length ? live.branches : BRANCHES_DATA;

  const [bookingType, setBookingType] = useState<'service' | 'package'>(
    initialPackage ? 'package' : 'service'
  );
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialService?.id || servicesList[0]?.id || SERVICES[0].id
  );
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    initialPackage?.id || packagesList[0]?.id || THERAPY_PACKAGES[0].id
  );

  const availableCities = useMemo(() => {
    const map = new Map<string, { key: string; labelAr: string; labelEn: string }>();
    branchesList.forEach((b) => {
      if (b.city && !map.has(b.city)) {
        map.set(b.city, {
          key: b.city,
          labelAr: b.cityNameAr || b.city,
          labelEn: b.cityNameEn || b.city,
        });
      }
    });
    return Array.from(map.values());
  }, [branchesList]);

  const [selectedCity, setSelectedCity] = useState<string>(() => {
    return branchesList[0]?.city || 'riyadh';
  });

  const branchesInCity = useMemo(
    () => branchesList.filter((b) => b.city === selectedCity),
    [branchesList, selectedCity]
  );

  const [selectedBranchId, setSelectedBranchId] = useState<string>(() => {
    const defaultCity = branchesList[0]?.city || 'riyadh';
    return branchesList.find((b) => b.city === defaultCity)?.id || '';
  });

  useEffect(() => {
    if (branchesInCity.length > 0 && !branchesInCity.some((b) => b.id === selectedBranchId)) {
      setSelectedBranchId(branchesInCity[0].id);
    }
  }, [branchesInCity, selectedBranchId]);

  const getCleanBranchName = (branch: BranchItem) => {
    const rawName = isArabic ? branch.name : (branch.nameEn || branch.name);
    return rawName.split(/\s*[-–—]\s*/)[0].replace(/\s*\([^)]*\)/g, '').trim();
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || todayStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(TIME_SLOTS[1]);

  const [fullName, setFullName] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');

  const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState<string>('');
  const [showOptionalDetails, setShowOptionalDetails] = useState(Boolean(initialNotes));
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState<number>(5);
  const [childBirthDate, setChildBirthDate] = useState<string>('');
  const [notes, setNotes] = useState(initialNotes || '');

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmedApp, setConfirmedApp] = useState<Appointment | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (clientProfile) {
      setFullName((prev) => prev || clientProfile.fullName || '');
      setMobilePhone((prev) => prev || clientProfile.phone || '');
    }
  }, [clientProfile]);

  const computeAgeYearsFromDob = (dob?: string): number => {
    if (!dob) return 5;
    const d = new Date(dob);
    if (Number.isNaN(d.getTime())) return 5;
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
    return Math.max(1, Math.min(18, age || 5));
  };

  const handleSelectFamilyMember = (memberId: string) => {
    setSelectedFamilyMemberId(memberId);
    const member = (clientProfile?.familyMembers || []).find((m) => m.id === memberId);
    if (member) {
      setChildName(member.name);
      setChildAge(computeAgeYearsFromDob(member.dob));
      setChildBirthDate(member.dob || '');
    } else {
      setChildBirthDate('');
    }
  };

  const activeService = servicesList.find((s) => s.id === selectedServiceId) || servicesList[0];
  const activePackage = packagesList.find((p) => p.id === selectedPackageId) || packagesList[0];
  const activeCityObj = availableCities.find((c) => c.key === selectedCity) || availableCities[0];
  const activeBranchObj = branchesInCity.find((b) => b.id === selectedBranchId) || branchesInCity[0];

  const handleCityChange = (cityKey: string) => {
    setSelectedCity(cityKey);
    const firstInCity = branchesList.find((b) => b.city === cityKey);
    setSelectedBranchId(firstInCity?.id || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || fullName.trim().length < 3) {
      setFormError(isArabic ? 'يرجى إدخال اسمك الكريم للتواصل' : 'Please enter your full name');
      return;
    }

    const cleanDigits = mobilePhone.replace(/\D/g, '');
    if (!mobilePhone.trim() || cleanDigits.length < 9) {
      setFormError(isArabic ? 'يرجى إدخال رقم جوال صحيح (مثال: 05XXXXXXXX)' : 'Please enter a valid mobile number (e.g. 05XXXXXXXX)');
      return;
    }

    if (!activeCityObj || !activeBranchObj) {
      setFormError(isArabic ? 'يرجى اختيار المدينة والفرع المناسب' : 'Please select a city and branch');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    const requestType = bookingType === 'package' ? 'package' : 'appointment';
    const ref = generateRequestReference(requestType);
    const serviceTitle =
      bookingType === 'package'
        ? (!isArabic && activePackage.nameEn ? activePackage.nameEn : activePackage.name)
        : (!isArabic && activeService.titleEn ? activeService.titleEn : activeService.title);
    const cityLabel = isArabic ? activeCityObj.labelAr : activeCityObj.labelEn;
    const branchLabel = getCleanBranchName(activeBranchObj);

    const selectedMember = (clientProfile?.familyMembers || []).find(
      (m) => m.id === selectedFamilyMemberId
    );

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      referenceNumber: ref,
      childName: selectedMember?.name || childName.trim() || (isArabic ? 'المستفيد' : 'Beneficiary'),
      childAge: Number(childAge) || 5,
      ...(childBirthDate ? { childBirthDate } : {}),
      guardianName: fullName.trim(),
      guardianPhone: mobilePhone.trim(),
      guardianEmail: clientProfile?.email || user?.email || 'contact@customer.com',
      userId: user?.uid || undefined,
      clientId: user?.uid || undefined,
      ...(selectedMember ? { familyMemberId: selectedMember.id, familyMemberName: selectedMember.name } : {}),
      serviceId: bookingType === 'package' ? activePackage.id : activeService.id,
      serviceTitle,
      specialistId: initialSpecialist?.id || 'spec-general',
      specialistName: initialSpecialist
        ? (!isArabic && initialSpecialist.nameEn ? initialSpecialist.nameEn : initialSpecialist.name)
        : (isArabic ? 'الفريق الإكلينيكي المختص' : 'Clinical Specialist Team'),
      city: cityLabel,
      branch: branchLabel,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      notes: notes.trim(),
      status: 'new',
      paymentStatus: 'unpaid',
      amount: bookingType === 'package'
        ? activePackage.price
        : (activeService.sessionPrice || initialSpecialist?.sessionPrice || 280),
      reminderSettings: {
        whatsapp: true,
        sms: true,
        email: false,
      },
      createdAt: new Date().toISOString(),
      requestType,
      requestSource: bookingType === 'package'
        ? `صفحة حجز الباقات - ${cityLabel} (${branchLabel})`
        : `صفحة حجز المواعيد المستقلة - ${cityLabel} (${branchLabel})`,
      couponCode: '',
      readByAdmin: false,
    };

    try {
      await saveAndBroadcastCustomerRequestAsync(newAppointment);
      onConfirmBooking(newAppointment);
      setConfirmedApp(newAppointment);
      setIsSubmitted(true);
      try {
        confetti({ particleCount: 55, spread: 60, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    } catch {
      setFormError(
        isArabic
          ? 'عذراً، حدث خطأ أثناء إرسال طلب الحجز. يرجى التحقق من اتصالك والمحاولة مجدداً.'
          : 'Failed to record booking. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen pt-6 sm:pt-10 pb-20 relative"
      dir={direction}
    >
      {/* Top Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-[24px] liquid-glass-card">
          <div className="flex items-center gap-2.5 flex-wrap">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onBackToHome();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass-btn text-xs sm:text-sm font-black text-[#161B26] dark:text-[#F8FAFC] hover:text-[#1263D6] dark:hover:text-[#60AFFF] transition-colors"
            >
              {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{isArabic ? 'العودة للرئيسية' : 'Back to Home'}</span>
            </a>

            <nav className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#4B5563] dark:text-[#94A3B8]" aria-label="Breadcrumb">
              <Home className="w-3.5 h-3.5 text-[#2B95FF]" />
              <span>/</span>
              <span className="text-[#1263D6] dark:text-[#60AFFF] font-black">
                {isArabic ? 'حجز موعد أو استشارة' : 'Book Appointment'}
              </span>
            </nav>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10B981]/12 border border-[#10B981]/25 text-[#047857] dark:text-[#34D399] text-xs font-black">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isArabic ? 'حجز مباشر بدون دفع إلكتروني' : 'Direct Booking · No Prepayment'}</span>
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Booking Form Column */}
          <div className="lg:col-span-7 liquid-glass-card rounded-[28px] p-5 sm:p-8 shadow-xl space-y-6">
            <div className="space-y-2 border-b border-[#161B26]/[0.08] dark:border-white/[0.08] pb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2B95FF]/12 text-[#1263D6] dark:text-[#60AFFF] text-xs font-black">
                <Calendar className="w-3.5 h-3.5" />
                <span>{isArabic ? 'استمارة الحجز الإلكتروني السريع' : 'Instant Online Booking'}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#161B26] dark:text-[#F8FAFC] leading-tight">
                {isArabic ? 'حجز موعد أو استشارة طبية' : 'Book an Appointment or Clinical Consultation'}
              </h1>

              <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
                {isArabic
                  ? 'اختر البرنامج التأهيلي أو جلسة التقييم والموعد المناسب لك، وسيتواصل معك فريق الاستقبال فوراً لتأكيد الحضور.'
                  : 'Select your preferred clinical service, city, branch, and date. Our reception team will confirm immediately.'}
              </p>
            </div>

            {isSubmitted && confirmedApp ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-14 h-14 bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-black text-[#161B26] dark:text-white">
                  {isArabic ? 'تم استلام طلب حجزك بنجاح!' : 'Booking Received!'}
                </h2>
                <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8]">
                  {isArabic
                    ? `رقم المرجع: ${confirmedApp.referenceNumber} — ${confirmedApp.city || ''} (${confirmedApp.branch || ''}) — الموعد: ${confirmedApp.date} (${confirmedApp.timeSlot})`
                    : `Reference: ${confirmedApp.referenceNumber} — ${confirmedApp.city || ''} (${confirmedApp.branch || ''}) — Date: ${confirmedApp.date} (${confirmedApp.timeSlot})`}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href={getCustomerWhatsAppMessage(confirmedApp, isArabic)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full bg-[#047857] hover:bg-[#065F46] text-white font-black text-xs sm:text-sm inline-flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isArabic ? 'تأكيد عبر الواتساب' : 'Confirm via WhatsApp'}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setConfirmedApp(null);
                    }}
                    className="px-6 py-3 rounded-full liquid-glass-btn text-xs sm:text-sm font-black cursor-pointer"
                  >
                    {isArabic ? 'حجز موعد آخر' : 'Book Another'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-700 dark:text-rose-200 font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="page-booking-name" className="text-xs font-bold text-[#161B26] dark:text-slate-200 block mb-1.5">
                      {isArabic ? 'الاسم الكريم:' : 'Full Name:'} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="page-booking-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={isArabic ? 'اكتب اسمك الثلاثي' : 'Enter full name'}
                        className={`w-full h-11 bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2.5 ${isArabic ? 'pl-10' : 'pr-10'} text-sm text-[#161B26] dark:text-white outline-none focus:border-[#2B95FF]`}
                      />
                      <User className={`w-4 h-4 text-slate-500 absolute ${isArabic ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 pointer-events-none`} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="page-booking-phone" className="text-xs font-bold text-[#161B26] dark:text-slate-200 block mb-1.5">
                      {isArabic ? 'رقم الجوال للتواصل:' : 'Mobile Number:'} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="page-booking-phone"
                        type="tel"
                        required
                        value={mobilePhone}
                        onChange={(e) => setMobilePhone(e.target.value)}
                        placeholder="05XXXXXXXX"
                        dir="ltr"
                        className="w-full h-11 bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-[#161B26] dark:text-white font-mono outline-none text-left focus:border-[#2B95FF]"
                      />
                      <Phone className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#161B26] dark:text-slate-200 block mb-1.5">
                    {isArabic ? 'نوع الخدمة أو الباقة:' : 'Service or Package:'}
                  </label>
                  <div className="grid grid-cols-2 p-1 bg-slate-100/80 dark:bg-white/5 rounded-xl gap-1 mb-2.5 border border-slate-200/60 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setBookingType('service')}
                      className={`h-9 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        bookingType === 'service'
                          ? 'bg-white dark:bg-[#1463D6] text-[#1463D6] dark:text-white shadow-xs font-black'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isArabic ? 'جلسة تقييم / علاج' : 'Individual Session'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingType('package')}
                      className={`h-9 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        bookingType === 'package'
                          ? 'bg-white dark:bg-[#1463D6] text-[#1463D6] dark:text-white shadow-xs font-black'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isArabic ? 'باقة تأهيلية متكاملة' : 'Therapy Package'}
                    </button>
                  </div>

                  {bookingType === 'service' ? (
                    <select
                      aria-label={isArabic ? 'اختر الخدمة' : 'Select Service'}
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full h-11 bg-white/80 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 text-sm text-[#161B26] dark:text-white outline-none focus:border-[#2B95FF]"
                    >
                      {servicesList.map((srv) => (
                        <option key={srv.id} value={srv.id}>
                          {!isArabic && srv.titleEn ? srv.titleEn : srv.title}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      aria-label={isArabic ? 'اختر الباقة' : 'Select Package'}
                      value={selectedPackageId}
                      onChange={(e) => setSelectedPackageId(e.target.value)}
                      className="w-full h-11 bg-white/80 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 text-sm text-[#161B26] dark:text-white outline-none focus:border-[#2B95FF]"
                    >
                      {packagesList.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {!isArabic && pkg.nameEn ? pkg.nameEn : pkg.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="page-booking-city" className="text-xs font-bold text-[#161B26] dark:text-slate-200 block mb-1.5">
                      {isArabic ? 'المدينة:' : 'City:'} <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="page-booking-city"
                      value={selectedCity}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full h-11 bg-white/80 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 text-sm text-[#161B26] dark:text-white outline-none focus:border-[#2B95FF]"
                    >
                      {availableCities.map((cityItem) => (
                        <option key={cityItem.key} value={cityItem.key}>
                          {isArabic ? cityItem.labelAr : cityItem.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="page-booking-branch" className="text-xs font-bold text-[#161B26] dark:text-slate-200 block mb-1.5">
                      {isArabic ? 'الفرع:' : 'Branch:'} <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="page-booking-branch"
                      value={selectedBranchId}
                      onChange={(e) => setSelectedBranchId(e.target.value)}
                      className="w-full h-11 bg-white/80 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 text-sm text-[#161B26] dark:text-white outline-none focus:border-[#2B95FF]"
                    >
                      {branchesInCity.map((branchItem) => (
                        <option key={branchItem.id} value={branchItem.id}>
                          {getCleanBranchName(branchItem)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="page-booking-date" className="text-xs font-bold text-[#161B26] dark:text-slate-200 block mb-1.5">
                      {isArabic ? 'التاريخ المفضل:' : 'Preferred Date:'}
                    </label>
                    <input
                      id="page-booking-date"
                      type="date"
                      min={todayStr}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full h-11 bg-white/80 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 text-sm text-[#161B26] dark:text-white font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="page-booking-time" className="text-xs font-bold text-[#161B26] dark:text-slate-200 block mb-1.5">
                      {isArabic ? 'الفترة الزمنية:' : 'Time Slot:'}
                    </label>
                    <select
                      id="page-booking-time"
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      className="w-full h-11 bg-white/80 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 text-sm text-[#161B26] dark:text-white outline-none"
                    >
                      {TIME_SLOTS.map((slot, idx) => (
                        <option key={idx} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setShowOptionalDetails(!showOptionalDetails)}
                    className="w-full py-2.5 px-3.5 rounded-xl liquid-glass-panel text-xs font-bold text-[#1263D6] dark:text-[#60AFFF] flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Baby className="w-4 h-4" />
                      <span>{isArabic ? 'بيانات إضافية للطفل أو ملاحظات (اختياري)' : 'Child details & notes (Optional)'}</span>
                    </span>
                    {showOptionalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showOptionalDetails && (
                    <div className="mt-2.5 p-3.5 rounded-xl liquid-glass-panel space-y-2.5">
                      {clientProfile && clientProfile.familyMembers && clientProfile.familyMembers.length > 0 && (
                        <div>
                          <label htmlFor="page-booking-family-member" className="text-[11px] font-bold text-[#161B26] dark:text-slate-200 block mb-1">
                            {isArabic ? 'اختيار الفرد من ملف الأسرة:' : 'Select from Family File:'}
                          </label>
                          <select
                            id="page-booking-family-member"
                            value={selectedFamilyMemberId}
                            onChange={(e) => handleSelectFamilyMember(e.target.value)}
                            className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3 text-xs sm:text-sm outline-none"
                          >
                            <option value="">{isArabic ? '— مستفيد جديد / إدخال يدوي —' : '— Manual entry —'}</option>
                            {clientProfile.familyMembers.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name} ({m.relation})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={childName}
                          onChange={(e) => setChildName(e.target.value)}
                          placeholder={isArabic ? 'اسم الطفل (اختياري)' : 'Child name (optional)'}
                          className="col-span-2 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3 text-xs sm:text-sm"
                        />
                        <select
                          aria-label={isArabic ? 'عمر الطفل' : 'Child Age'}
                          value={childAge}
                          onChange={(e) => setChildAge(Number(e.target.value))}
                          className="h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-2.5 text-xs sm:text-sm"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((age) => (
                            <option key={age} value={age}>
                              {age} {isArabic ? 'سنوات' : 'yrs'}
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={isArabic ? 'ملاحظة سريعة أو استفسار...' : 'Quick note or inquiry...'}
                        className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3 text-xs sm:text-sm"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[50px] py-3.5 px-6 warm-pill-cta font-black rounded-full text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>{isSubmitting ? (isArabic ? 'جاري إرسال الطلب...' : 'Submitting...') : (isArabic ? 'تأكيد طلب الحجز فوراً' : 'Confirm Booking Request')}</span>
                  {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}
          </div>

          {/* Side Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="obsidian-anchor-card rounded-[28px] p-6 sm:p-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/12 text-[#047857] dark:text-[#34D399] text-xs font-black">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isArabic ? 'قنوات الحجز المباشر' : 'Direct Support'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#161B26] dark:text-[#F8FAFC]">
                {isArabic ? 'تحتاج مساعدة فورية قبل الحجز؟' : 'Need Immediate Assistance?'}
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
                {isArabic
                  ? 'يسعد فريق الاستقبال والتنسيق الطبي بالإجابة عن استفساراتكم حول المواعيد، الفروع، والأسعار.'
                  : 'Our clinical coordination team is happy to answer questions about schedules, branches, and programs.'}
              </p>

              <div className="space-y-3 pt-1">
                <a
                  href="tel:0575100100"
                  className="p-3.5 rounded-2xl liquid-glass-card flex items-center justify-between hover:border-[#2B95FF]/40 transition-colors"
                >
                  <span className="flex items-center gap-2.5 text-xs sm:text-sm font-black">
                    <Phone className="w-4 h-4 text-[#2B95FF]" />
                    <span>{isArabic ? 'الاتصال الموحد' : 'Unified Phone'}</span>
                  </span>
                  <span dir="ltr" className="font-mono font-black text-[#1263D6] dark:text-[#60AFFF]">
                    0575100100
                  </span>
                </a>

                <a
                  href="https://wa.me/966575100100"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl liquid-glass-card flex items-center justify-between hover:border-[#10B981]/40 transition-colors"
                >
                  <span className="flex items-center gap-2.5 text-xs sm:text-sm font-black">
                    <MessageCircle className="w-4 h-4 text-[#10B981]" />
                    <span>{isArabic ? 'واتساب الاستقبال الفوري' : 'WhatsApp Support'}</span>
                  </span>
                  <span className="text-xs font-black text-[#047857] dark:text-[#34D399]">
                    {isArabic ? 'تواصل الآن ←' : 'Chat Now →'}
                  </span>
                </a>

                <div className="p-3.5 rounded-2xl liquid-glass-card flex items-center gap-2.5 text-xs text-[#4B5563] dark:text-[#94A3B8]">
                  <Clock className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <span>{isArabic ? 'الأحد - الخميس: 8:00 صباحاً حتى 9:00 مساءً' : 'Sun - Thu: 8:00 AM - 9:00 PM'}</span>
                </div>
              </div>
            </div>

            <div className="liquid-glass-card rounded-[28px] p-6 space-y-3">
              <h2 className="text-base font-black text-[#161B26] dark:text-[#F8FAFC] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2B95FF]" />
                <span>{isArabic ? 'استعرض فروعنا وأخصائيينا' : 'Explore Branches & Specialists'}</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/branches"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('/branches');
                    }
                  }}
                  className="px-4 py-2 rounded-full liquid-glass-pill text-xs font-bold hover:text-[#1263D6] dark:hover:text-[#60AFFF]"
                >
                  {isArabic ? 'فروع مركز رابا' : 'Center Branches'}
                </a>
                <a
                  href="/specialists"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('/specialists');
                    }
                  }}
                  className="px-4 py-2 rounded-full liquid-glass-pill text-xs font-bold hover:text-[#1263D6] dark:hover:text-[#60AFFF]"
                >
                  {isArabic ? 'دليل الأخصائيين' : 'Specialists Directory'}
                </a>
                <a
                  href="/services"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('/services');
                    }
                  }}
                  className="px-4 py-2 rounded-full liquid-glass-pill text-xs font-bold hover:text-[#1263D6] dark:hover:text-[#60AFFF]"
                >
                  {isArabic ? 'البرامج العلاجية' : 'Clinical Programs'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDirectoryPage;
