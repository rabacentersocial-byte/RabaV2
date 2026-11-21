import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowLeft,
  ArrowRight,
  Phone, 
  User, 
  MessageCircle, 
  FileCheck2, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Baby
} from 'lucide-react';
import { SPECIALISTS, SERVICES, THERAPY_PACKAGES, TIME_SLOTS } from '../data/mockData';
import { BRANCHES_DATA, BranchItem } from '../data/branchesData';
import { Specialist, ServiceItem, TherapyPackage, Appointment } from '../types';
import { useLiveDataOptional } from '../context/LiveDataContext';
import { 
  generateRequestReference, 
  saveAndBroadcastCustomerRequestAsync,
  getCustomerWhatsAppMessage 
} from '../data/customerRequests';
import { getCleanBranchDisplayName, normalizeBranchText } from '../utils/branchPermissions';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceItem | null;
  initialPackage?: TherapyPackage | null;
  initialSpecialist?: Specialist | null;
  initialNotes?: string;
  initialDate?: string;
  onConfirmBooking: (appointment: Appointment) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialService,
  initialPackage,
  initialSpecialist,
  initialNotes,
  initialDate,
  onConfirmBooking
}) => {
  const { isArabic, direction } = useLanguage();
  const { user, clientProfile } = useAuth();
  const live = useLiveDataOptional();

  const activeLiveServices = (live?.services || []).filter((s) => s.active !== false && s.isActive !== false);
  const activeLivePackages = (live?.packages || []).filter((p) => p.active !== false && p.isActive !== false);
  const activeLiveSpecialists = (live?.specialists || []).filter((s) => s.active !== false && s.isActive !== false);

  const servicesList = activeLiveServices.length ? activeLiveServices : SERVICES;
  const packagesList = activeLivePackages.length ? activeLivePackages : THERAPY_PACKAGES;
  const branchesList: BranchItem[] = live?.branches?.length ? live.branches : BRANCHES_DATA;
  const liveSpecialists: Specialist[] = activeLiveSpecialists.length ? activeLiveSpecialists : SPECIALISTS;

  // Booking Type: service or package
  const [bookingType, setBookingType] = useState<'service' | 'package'>(
    initialPackage ? 'package' : 'service'
  );

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialService?.id || servicesList[0]?.id || SERVICES[0]?.id || ''
  );
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    initialPackage?.id || packagesList[0]?.id || THERAPY_PACKAGES[0]?.id || ''
  );
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string>(
    initialSpecialist?.id || liveSpecialists[0]?.id || SPECIALISTS[0]?.id || ''
  );

  // Date & Time
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || todayStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(TIME_SLOTS[1]);

  // Essential required fields
  const [fullName, setFullName] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');

  // City & Branch (2-step dependent selection)
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

  const [selectedCity, setSelectedCity] = useState<string>(() => branchesList[0]?.city || 'riyadh');

  const branchesInCity = useMemo(
    () => branchesList.filter((b) => b.city === selectedCity),
    [branchesList, selectedCity]
  );

  const [selectedBranchId, setSelectedBranchId] = useState<string>(() => {
    const defaultCity = branchesList[0]?.city || 'riyadh';
    return branchesList.find((b) => b.city === defaultCity)?.id || '';
  });

  const handleCityChange = (cityKey: string) => {
    setSelectedCity(cityKey);
    const firstInCity = branchesList.find((b) => b.city === cityKey);
    setSelectedBranchId(firstInCity?.id || '');
  };

  // Optional expandable details
  const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState<string>('');
  const [showOptionalDetails, setShowOptionalDetails] = useState(Boolean(initialNotes));
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState<number>(5);
  const [childBirthDate, setChildBirthDate] = useState<string>('');
  const [notes, setNotes] = useState(initialNotes || '');

  // Form State
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmedApp, setConfirmedApp] = useState<Appointment | null>(null);

  useEffect(() => {
    if (initialPackage) {
      setBookingType('package');
      setSelectedPackageId(initialPackage.id);
    } else if (initialService) {
      setBookingType('service');
      setSelectedServiceId(initialService.id);
    }
    if (initialSpecialist) {
      setSelectedSpecialistId(initialSpecialist.id);
    }
    if (initialNotes !== undefined) {
      setNotes(initialNotes);
      if (initialNotes.trim()) setShowOptionalDetails(true);
      const normNotes = normalizeBranchText(initialNotes);
      const matchedBranch = branchesList.find((b) => {
        const cleanAr = normalizeBranchText(getCleanBranchDisplayName(b, true));
        const cleanEn = normalizeBranchText(getCleanBranchDisplayName(b, false));
        return (cleanAr && normNotes.includes(cleanAr)) || (cleanEn && normNotes.includes(cleanEn));
      });
      if (matchedBranch) {
        setSelectedCity(matchedBranch.city);
        setSelectedBranchId(matchedBranch.id);
      }
    }
    if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [initialService, initialPackage, initialSpecialist, initialNotes, initialDate, branchesList]);

  // Reset submission/error state whenever the modal opens fresh and sync body scroll / Escape key
  useEffect(() => {
    if (!isOpen) return;
    setIsSubmitted(false);
    setIsSubmitting(false);
    setConfirmedApp(null);
    setFormError('');

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Keep selected dropdown values valid when live catalogs hydrate or change
  useEffect(() => {
    if (servicesList.length > 0 && !servicesList.some((s) => s.id === selectedServiceId)) {
      setSelectedServiceId(initialService?.id && servicesList.some((s) => s.id === initialService.id) ? initialService.id : servicesList[0].id);
    }
  }, [servicesList, selectedServiceId, initialService]);

  useEffect(() => {
    if (packagesList.length > 0 && !packagesList.some((p) => p.id === selectedPackageId)) {
      setSelectedPackageId(initialPackage?.id && packagesList.some((p) => p.id === initialPackage.id) ? initialPackage.id : packagesList[0].id);
    }
  }, [packagesList, selectedPackageId, initialPackage]);

  useEffect(() => {
    if (liveSpecialists.length > 0 && !liveSpecialists.some((s) => s.id === selectedSpecialistId)) {
      setSelectedSpecialistId(initialSpecialist?.id && liveSpecialists.some((s) => s.id === initialSpecialist.id) ? initialSpecialist.id : liveSpecialists[0].id);
    }
  }, [liveSpecialists, selectedSpecialistId, initialSpecialist]);

  useEffect(() => {
    if (availableCities.length > 0 && !availableCities.some((c) => c.key === selectedCity)) {
      setSelectedCity(availableCities[0].key);
    }
  }, [availableCities, selectedCity]);

  useEffect(() => {
    if (branchesInCity.length > 0 && !branchesInCity.some((b) => b.id === selectedBranchId)) {
      setSelectedBranchId(branchesInCity[0].id);
    }
  }, [branchesInCity, selectedBranchId]);

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

  const handleModalClose = () => {
    setIsSubmitted(false);
    setIsSubmitting(false);
    setConfirmedApp(null);
    setFormError('');
    onClose();
  };

  if (!isOpen) return null;

  const activeService = servicesList.find((s) => s.id === selectedServiceId) || servicesList[0];
  const activePackage = packagesList.find((p) => p.id === selectedPackageId) || packagesList[0];
  const activeSpecialist =
    liveSpecialists.find((s) => s.id === selectedSpecialistId) ||
    (initialSpecialist && initialSpecialist.id === selectedSpecialistId ? initialSpecialist : null) ||
    liveSpecialists[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Mandatory Name Validation
    if (!fullName.trim() || fullName.trim().length < 3) {
      setFormError(isArabic ? 'يرجى إدخال اسمك الكريم للتواصل' : 'Please enter your full name');
      return;
    }

    // 2. Mandatory Mobile Phone Validation
    const cleanDigits = mobilePhone.replace(/\D/g, '');
    if (!mobilePhone.trim() || cleanDigits.length < 9) {
      setFormError(isArabic ? 'يرجى إدخال رقم جوال صحيح (مثال: 05XXXXXXXX)' : 'Please enter a valid mobile number (e.g. 05XXXXXXXX)');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    const isNationalDay = (initialNotes && (initialNotes.includes('اليوم الوطني') || initialNotes.includes('KSA96'))) ||
                          (notes && (notes.includes('اليوم الوطني') || notes.includes('KSA96')));
    
    const requestType = isNationalDay 
      ? 'national_day_offer' 
      : bookingType === 'package' 
      ? 'package' 
      : 'appointment';

    const ref = generateRequestReference(requestType);
    const serviceTitle = bookingType === 'package' 
      ? (activePackage ? (!isArabic && activePackage.nameEn ? activePackage.nameEn : activePackage.name) : (isArabic ? 'باقة تأهيلية متكاملة' : 'Therapy Package'))
      : (activeService ? (!isArabic && activeService.titleEn ? activeService.titleEn : activeService.title) : (isArabic ? 'جلسة تقييم وتشخيص' : 'Clinical Assessment Session'));
    
    const specialistName = activeSpecialist
      ? (!isArabic && activeSpecialist.nameEn ? activeSpecialist.nameEn : activeSpecialist.name)
      : (isArabic ? 'الفريق الإكلينيكي المختص' : 'Clinical Specialist Team');

    const selectedMember = (clientProfile?.familyMembers || []).find(
      (m) => m.id === selectedFamilyMemberId
    );
    const activeCityObj = availableCities.find((c) => c.key === selectedCity) || availableCities[0];
    const chosenBranch = branchesInCity.find((b) => b.id === selectedBranchId) || branchesInCity[0];
    const branchLabel = chosenBranch ? getCleanBranchDisplayName(chosenBranch, isArabic) : '';
    const cityLabel = activeCityObj
      ? (isArabic ? activeCityObj.labelAr : activeCityObj.labelEn)
      : (chosenBranch ? (isArabic ? chosenBranch.cityNameAr : chosenBranch.cityNameEn) : '');

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
      serviceId: bookingType === 'package' ? (activePackage?.id || 'pkg-general') : (activeService?.id || 'srv-general'),
      serviceTitle: serviceTitle,
      specialistId: activeSpecialist?.id || 'spec-general',
      specialistName: specialistName,
      ...(branchLabel ? { branch: branchLabel } : {}),
      ...(cityLabel ? { city: cityLabel } : {}),
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      notes: notes.trim(),
      status: 'new',
      paymentStatus: 'unpaid',
      amount: bookingType === 'package' ? (activePackage?.price ?? 0) : (activeService?.sessionPrice ?? activeSpecialist?.sessionPrice ?? 280),
      reminderSettings: {
        whatsapp: true,
        sms: true,
        email: false
      },
      createdAt: new Date().toISOString(),
      requestType: requestType,
      requestSource: isNationalDay ? 'عرض اليوم الوطني' : (bookingType === 'package' ? 'باقة تأهيلية' : 'حجز جلسة سريعة'),
      couponCode: isNationalDay ? 'KSA96-FREE' : '',
      readByAdmin: false
    };

    try {
      // Await persistence across Firestore and backend database
      await saveAndBroadcastCustomerRequestAsync(newAppointment);

      onConfirmBooking(newAppointment);
      setConfirmedApp(newAppointment);
      setIsSubmitted(true);

      try {
        const { default: confetti } = await import('canvas-confetti');
        confetti({
          particleCount: 55,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    } catch (err: any) {
      console.error('[BookingModal Error]:', err);
      setFormError(
        isArabic
          ? 'عذراً، حدث خطأ أثناء إرسال طلب الحجز إلى قاعدة البيانات. يرجى التحقق من اتصالك والمحاولة مجدداً.'
          : 'Failed to record booking in database. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppLink = (app: Appointment) => {
    return getCustomerWhatsAppMessage(app, isArabic);
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[120] overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={handleModalClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div 
        className={`relative glass-modal-dialog text-slate-900 dark:text-white rounded-2xl sm:rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] my-auto ${isArabic ? 'text-right' : 'text-left'}`}
        onClick={(e) => e.stopPropagation()}
        id="appointment-booking-modal"
        dir={direction}
      >
        
        {/* Simplified Header */}
        <div className="px-4 py-3 sm:px-5 sm:py-4 bg-gradient-to-r from-[#2E86EB]/10 via-[#2E86EB]/5 to-transparent dark:from-[#2E86EB]/20 dark:to-transparent border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#2E86EB]/15 text-[#2E86EB] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 id="booking-modal-title" className="text-xs sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{isArabic ? 'حجز موعد سريع' : 'Quick Booking'}</span>
                <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-[#22C55E]/15 text-[#047857] dark:text-[#34D399] font-bold">
                  {isArabic ? 'تأكيد مباشر' : 'Instant'}
                </span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                {isArabic ? 'بدون دفع إلكتروني - سنتواصل معك لتأكيد الحضور' : 'No prepayment required - Quick confirmation'}
              </p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 flex items-center justify-center text-slate-500 dark:text-slate-300 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted && confirmedApp ? (
          /* SUCCESS SCREEN */
          <div className="p-4 sm:p-6 text-center space-y-3.5 sm:space-y-4 animate-in zoom-in-95 duration-200 overflow-y-auto">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isArabic ? 'تم استلام طلبك بنجاح! 🎉' : 'Booking Received! 🎉'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isArabic 
                  ? 'رقم حجزك المرجعي محفوظ وسيقوم فريق الاستقبال بالتواصل معكم لتأكيد الموعد.' 
                  : 'Your booking has been received. Our team will contact you shortly.'}
              </p>
            </div>

            {/* Quick summary box */}
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl p-3 sm:p-3.5 text-xs text-right space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-2">
                <span className="text-slate-600 dark:text-slate-400">{isArabic ? 'رقم الحجز المرجعي:' : 'Reference:'}</span>
                <span className="font-mono font-black text-[#1263D6] dark:text-[#60AFFF]">{confirmedApp.referenceNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">{isArabic ? 'الاسم:' : 'Name:'}</span>
                <span className="font-bold">{confirmedApp.guardianName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">{isArabic ? 'الخدمة:' : 'Service:'}</span>
                <span className="font-bold text-[#1263D6] dark:text-[#60AFFF]">{confirmedApp.serviceTitle}</span>
              </div>
              {(confirmedApp.city || confirmedApp.branch) && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{isArabic ? 'المدينة / الفرع:' : 'City / Branch:'}</span>
                  <span className="font-bold">
                    {[confirmedApp.city, confirmedApp.branch].filter(Boolean).join(' - ')}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">{isArabic ? 'الموعد:' : 'Date & Time:'}</span>
                <span className="font-bold">{confirmedApp.date} ({confirmedApp.timeSlot})</span>
              </div>
            </div>

            {/* WhatsApp & Close Actions */}
            <div className="flex flex-col gap-2 pt-1">
              <a
                href={getWhatsAppLink(confirmedApp)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 sm:h-12 py-2.5 px-4 rounded-xl bg-[#047857] hover:bg-[#065F46] active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>{isArabic ? 'تأكيد الحجز فوراً عبر الواتساب' : 'Confirm via WhatsApp'}</span>
              </a>

              <button
                type="button"
                onClick={handleModalClose}
                className="w-full h-10 py-2 px-4 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        ) : (
          /* ULTRA-STREAMLINED MOBILE-OPTIMIZED FORM */
          <form 
            onSubmit={handleSubmit} 
            {...({
              toolname: "book_rehabilitation_appointment",
              tooldescription: "حجز موعد تقييم وتشخيص مبكر أو جلسة علاجية في مركز رابا (ABA، تخاطب، تكامل حسي)"
            } as any)}
            data-toolname="book_rehabilitation_appointment"
            data-tooldescription="حجز موعد تقييم وتشخيص مبكر أو جلسة علاجية في مركز رابا (ABA، تخاطب، تكامل حسي)"
            className="overflow-y-auto flex-1 p-3.5 sm:p-5 space-y-3 sm:space-y-3.5"
          >
            
            {formError && (
              <div className="p-2.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-700 dark:text-rose-200 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Field 1: Full Name */}
            <div>
              <label htmlFor="booking-full-name" className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                {isArabic ? 'الاسم الكريم:' : 'Full Name:'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="booking-full-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isArabic ? 'اكتب اسمك الثلاثي' : 'Enter your full name'}
                  className={`w-full h-11 bg-slate-50 dark:bg-white/5 border border-slate-200/90 dark:border-white/15 rounded-xl px-3.5 py-2.5 ${isArabic ? 'pl-10' : 'pr-10'} text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-[#2E86EB]/30 focus:border-[#2E86EB] outline-none transition-all`}
                />
                <User className={`w-4 h-4 text-slate-500 dark:text-slate-400 absolute ${isArabic ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 pointer-events-none`} />
              </div>
            </div>

            {/* Field 2: Mobile Phone */}
            <div>
              <label htmlFor="booking-phone" className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                {isArabic ? 'رقم الجوال للتواصل:' : 'Mobile Number:'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="booking-phone"
                  type="tel"
                  required
                  value={mobilePhone}
                  onChange={(e) => setMobilePhone(e.target.value)}
                  placeholder="05XXXXXXXX"
                  dir="ltr"
                  className="w-full h-11 bg-slate-50 dark:bg-white/5 border border-slate-200/90 dark:border-white/15 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-slate-900 dark:text-white font-mono placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-[#2E86EB]/30 focus:border-[#2E86EB] outline-none text-left transition-all"
                />
                <Phone className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Field 3: Service / Package Selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor={bookingType === 'service' ? 'booking-service-select' : 'booking-package-select'} className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isArabic ? 'نوع الخدمة أو البرنامج:' : 'Service or Package:'}
                </label>
              </div>

              {/* Mobile-Friendly Segmented Toggle Bar */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-white/5 rounded-xl gap-1 mb-2 border border-slate-200/60 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setBookingType('service')}
                  className={`h-8 sm:h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    bookingType === 'service'
                      ? 'bg-white dark:bg-[#1463D6] text-[#1463D6] dark:text-white shadow-xs font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{isArabic ? 'جلسة تقييم / علاج' : 'Individual Session'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBookingType('package')}
                  className={`h-8 sm:h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    bookingType === 'package'
                      ? 'bg-white dark:bg-[#1463D6] text-[#1463D6] dark:text-white shadow-xs font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{isArabic ? 'باقة تأهيلية متكاملة' : 'Therapy Package'}</span>
                </button>
              </div>

              {bookingType === 'service' ? (
                <select
                  id="booking-service-select"
                  aria-label={isArabic ? 'اختر الخدمة' : 'Select Service'}
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full h-11 bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-white/15 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2E86EB]/30 focus:border-[#2E86EB] outline-none cursor-pointer"
                >
                  {servicesList.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {!isArabic && srv.titleEn ? srv.titleEn : srv.title}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  id="booking-package-select"
                  aria-label={isArabic ? 'اختر الباقة التأهيلية' : 'Select Therapy Package'}
                  value={selectedPackageId}
                  onChange={(e) => setSelectedPackageId(e.target.value)}
                  className="w-full h-11 bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-white/15 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2E86EB]/30 focus:border-[#2E86EB] outline-none cursor-pointer"
                >
                  {packagesList.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {!isArabic && pkg.nameEn ? pkg.nameEn : pkg.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Field 3.5: City & Branch Selection (2 separate fields) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              <div>
                <label htmlFor="booking-city-select" className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  {isArabic ? 'المدينة:' : 'City:'} <span className="text-rose-500">*</span>
                </label>
                <select
                  id="booking-city-select"
                  aria-label={isArabic ? 'اختر المدينة' : 'Select City'}
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full h-11 bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-white/15 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2E86EB]/30 focus:border-[#2E86EB] outline-none cursor-pointer"
                >
                  {availableCities.map((cityItem) => (
                    <option key={cityItem.key} value={cityItem.key}>
                      {isArabic ? cityItem.labelAr : cityItem.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="booking-branch-select" className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  {isArabic ? 'الفرع:' : 'Branch:'} <span className="text-rose-500">*</span>
                </label>
                <select
                  id="booking-branch-select"
                  aria-label={isArabic ? 'اختر الفرع' : 'Select Branch'}
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="w-full h-11 bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-white/15 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2E86EB]/30 focus:border-[#2E86EB] outline-none cursor-pointer"
                >
                  {branchesInCity.map((b) => (
                    <option key={b.id} value={b.id}>
                      {getCleanBranchDisplayName(b, isArabic)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Field 4: Preferred Date & Time (Optimized Touch Heights) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              <div>
                <label htmlFor="booking-date" className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  {isArabic ? 'الموعد المناسب:' : 'Preferred Date:'}
                </label>
                <input
                  id="booking-date"
                  type="date"
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full h-11 bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-white/15 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2E86EB]/30 focus:border-[#2E86EB] outline-none font-mono"
                />
              </div>

              <div>
                <label htmlFor="booking-timeslot" className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  {isArabic ? 'الفترة:' : 'Time Slot:'}
                </label>
                <select
                  id="booking-timeslot"
                  aria-label={isArabic ? 'الفترة الزمنية المفضلة' : 'Preferred Time Slot'}
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full h-11 bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-white/15 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2E86EB]/30 focus:border-[#2E86EB] outline-none cursor-pointer"
                >
                  {TIME_SLOTS.map((slot, idx) => (
                    <option key={idx} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Collapsible Optional Details (Clean, tactile card) */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setShowOptionalDetails(!showOptionalDetails)}
                className="w-full py-2 px-3 rounded-xl bg-slate-100/80 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 text-xs font-bold text-[#2E86EB] dark:text-[#3B92F5] flex items-center justify-between cursor-pointer transition-all border border-slate-200/60 dark:border-white/5 min-h-[44px]"
              >
                <span className="flex items-center gap-1.5">
                  <Baby className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'بيانات إضافية للطفل أو ملاحظات (اختياري)' : 'Child details & notes (Optional)'}</span>
                </span>
                {showOptionalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showOptionalDetails && (
                <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/10 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
                  {clientProfile && clientProfile.familyMembers && clientProfile.familyMembers.length > 0 && (
                    <div>
                      <label htmlFor="booking-family-member" className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                        {isArabic ? 'اختيار الفرد من ملف الأسرة:' : 'Select from Family File:'}
                      </label>
                      <select
                        id="booking-family-member"
                        value={selectedFamilyMemberId}
                        onChange={(e) => handleSelectFamilyMember(e.target.value)}
                        className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#2E86EB]"
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
                    <div className="col-span-2">
                      <label htmlFor="booking-child-name" className="sr-only">{isArabic ? 'اسم الطفل' : 'Child Name'}</label>
                      <input
                        id="booking-child-name"
                        type="text"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        placeholder={isArabic ? 'اسم الطفل (اختياري)' : 'Child name (optional)'}
                        className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#2E86EB]"
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-child-age" className="sr-only">{isArabic ? 'عمر الطفل' : 'Child Age'}</label>
                      <select
                        id="booking-child-age"
                        aria-label={isArabic ? 'عمر الطفل' : 'Child Age'}
                        value={childAge}
                        onChange={(e) => setChildAge(Number(e.target.value))}
                        className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-2.5 py-1.5 text-xs sm:text-sm text-slate-900 dark:text-white outline-none cursor-pointer focus:border-[#2E86EB]"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((age) => (
                          <option key={age} value={age}>
                            {age} {isArabic ? 'سنوات' : 'yrs'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="booking-notes" className="sr-only">{isArabic ? 'ملاحظات إضافية' : 'Notes'}</label>
                    <input
                      id="booking-notes"
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={isArabic ? 'ملاحظة سريعة أو استفسار...' : 'Quick note or inquiry...'}
                      className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#2E86EB]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Direct Instant Submit Button */}
            <div className="pt-1.5 sm:pt-2">
              <button
                type="submit"
                id="submit-booking-btn"
                disabled={isSubmitting}
                aria-label={isArabic ? 'تأكيد طلب حجز الموعد' : 'Confirm appointment booking request'}
                className="w-full min-h-[48px] py-3 px-4 bg-gradient-to-r from-[#1668DC] via-[#1255B8] to-[#047857] hover:opacity-95 active:scale-[0.98] text-white font-black rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                <FileCheck2 className="w-4 h-4 shrink-0" />
                <span>{isSubmitting ? (isArabic ? 'جاري تأكيد وحفظ الحجز...' : 'Saving booking...') : (isArabic ? 'تأكيد طلب الحجز فوراً' : 'Confirm Booking Request')}</span>
                {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD23F]" />
                <span>{isArabic ? 'حجز مباشر وسهل بدون دفع إلكتروني' : 'Direct booking, zero prepayment'}</span>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );

  if (typeof document !== 'undefined' && document.body) {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
};

export default BookingModal;
