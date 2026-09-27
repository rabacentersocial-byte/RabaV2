import React, { useState, useEffect } from 'react';
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
import confetti from 'canvas-confetti';
import { SPECIALISTS, SERVICES, THERAPY_PACKAGES, TIME_SLOTS } from '../data/mockData';
import { Specialist, ServiceItem, TherapyPackage, Appointment } from '../types';
import { 
  generateRequestReference, 
  saveAndBroadcastCustomerRequest, 
  getCustomerWhatsAppMessage 
} from '../data/customerRequests';
import { useLanguage } from '../context/LanguageContext';

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

  // Booking Type: service or package
  const [bookingType, setBookingType] = useState<'service' | 'package'>(
    initialPackage ? 'package' : 'service'
  );

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialService?.id || SERVICES[0].id
  );
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    initialPackage?.id || THERAPY_PACKAGES[0].id
  );
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string>(
    initialSpecialist?.id || SPECIALISTS[0].id
  );

  // Date & Time
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || todayStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(TIME_SLOTS[1]);

  // Essential required fields
  const [fullName, setFullName] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');

  // Optional expandable details
  const [showOptionalDetails, setShowOptionalDetails] = useState(Boolean(initialNotes));
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState<number>(5);
  const [notes, setNotes] = useState(initialNotes || '');

  // Form State
  const [formError, setFormError] = useState('');
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
    }
    if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [initialService, initialPackage, initialSpecialist, initialNotes, initialDate]);

  const handleModalClose = () => {
    setIsSubmitted(false);
    setConfirmedApp(null);
    setFormError('');
    onClose();
  };

  if (!isOpen) return null;

  const activeService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];
  const activePackage = THERAPY_PACKAGES.find((p) => p.id === selectedPackageId) || THERAPY_PACKAGES[0];
  const activeSpecialist = SPECIALISTS.find((s) => s.id === selectedSpecialistId) || SPECIALISTS[0];

  const handleSubmit = (e: React.FormEvent) => {
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

    const isNationalDay = (initialNotes && (initialNotes.includes('اليوم الوطني') || initialNotes.includes('KSA96'))) ||
                          (notes && (notes.includes('اليوم الوطني') || notes.includes('KSA96')));
    
    const requestType = isNationalDay 
      ? 'national_day_offer' 
      : bookingType === 'package' 
      ? 'package' 
      : 'appointment';

    const ref = generateRequestReference(requestType);
    const serviceTitle = bookingType === 'package' 
      ? (!isArabic && activePackage.nameEn ? activePackage.nameEn : activePackage.name)
      : (!isArabic && activeService.titleEn ? activeService.titleEn : activeService.title);
    
    const specialistName = !isArabic && activeSpecialist.nameEn ? activeSpecialist.nameEn : activeSpecialist.name;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      referenceNumber: ref,
      childName: childName.trim() || (isArabic ? 'المستفيد' : 'Beneficiary'),
      childAge: Number(childAge) || 5,
      guardianName: fullName.trim(),
      guardianPhone: mobilePhone.trim(),
      guardianEmail: 'contact@customer.com',
      serviceId: bookingType === 'package' ? activePackage.id : activeService.id,
      serviceTitle: serviceTitle,
      specialistId: activeSpecialist.id,
      specialistName: specialistName,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      notes: notes.trim(),
      status: 'new',
      paymentStatus: 'unpaid',
      amount: bookingType === 'package' ? activePackage.price : activeSpecialist.sessionPrice,
      reminderSettings: {
        whatsapp: true,
        sms: true,
        email: false
      },
      createdAt: new Date().toISOString(),
      requestType: requestType,
      requestSource: isNationalDay ? 'عرض اليوم الوطني' : (bookingType === 'package' ? 'باقة تأهيلية' : 'حجز جلسة سريعة'),
      couponCode: isNationalDay ? 'KSA96-FREE' : undefined,
      readByAdmin: false
    };

    saveAndBroadcastCustomerRequest(newAppointment);

    try {
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setConfirmedApp(newAppointment);
    setIsSubmitted(true);
    onConfirmBooking(newAppointment);
  };

  const getWhatsAppLink = (app: Appointment) => {
    return getCustomerWhatsAppMessage(app, isArabic);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={handleModalClose}
    >
      <div 
        className={`relative bg-white dark:bg-[#0c1424] text-slate-900 dark:text-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200/90 dark:border-white/15 overflow-hidden ${isArabic ? 'text-right' : 'text-left'} my-auto`}
        onClick={(e) => e.stopPropagation()}
        id="appointment-booking-modal"
        dir={direction}
      >
        
        {/* Simplified Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-500/15 dark:to-transparent border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00E5BE]/15 text-[#0B3B36] dark:text-[#00E5BE] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{isArabic ? 'حجز موعد سريع' : 'Quick Booking'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-[#00E5BE] font-bold">
                  {isArabic ? 'تأكيد مباشر' : 'Instant'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isArabic ? 'بدون دفع إلكتروني - سنتواصل معك لتأكيد الحضور' : 'No prepayment required - Quick confirmation'}
              </p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 flex items-center justify-center text-slate-500 dark:text-slate-300 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted && confirmedApp ? (
          /* SUCCESS SCREEN */
          <div className="p-5 sm:p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-[#00E5BE] rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                {isArabic ? 'تم استلام طلبك بنجاح! 🎉' : 'Booking Received! 🎉'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isArabic 
                  ? 'رقم حجزك المرجعي محفوظ وسيقوم فريق الاستقبال بالتواصل معكم لتأكيد الموعد.' 
                  : 'Your booking has been received. Our team will contact you shortly.'}
              </p>
            </div>

            {/* Quick summary box */}
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl p-3.5 text-xs text-right space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-2">
                <span className="text-slate-500">{isArabic ? 'رقم الحجز المرجعي:' : 'Reference:'}</span>
                <span className="font-mono font-black text-emerald-700 dark:text-[#00E5BE]">{confirmedApp.referenceNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isArabic ? 'الاسم:' : 'Name:'}</span>
                <span className="font-bold">{confirmedApp.guardianName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isArabic ? 'الخدمة:' : 'Service:'}</span>
                <span className="font-bold text-emerald-700 dark:text-[#00E5BE]">{confirmedApp.serviceTitle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isArabic ? 'الموعد:' : 'Date & Time:'}</span>
                <span className="font-bold">{confirmedApp.date} ({confirmedApp.timeSlot})</span>
              </div>
            </div>

            {/* WhatsApp & Close Actions */}
            <div className="flex flex-col gap-2 pt-1">
              <a
                href={getWhatsAppLink(confirmedApp)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>{isArabic ? 'تأكيد الحجز فوراً عبر الواتساب' : 'Confirm via WhatsApp'}</span>
              </a>

              <button
                type="button"
                onClick={handleModalClose}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        ) : (
          /* ULTRA-STREAMLINED FORM */
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5">
            
            {formError && (
              <div className="p-2.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-700 dark:text-rose-200 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Field 1: Full Name */}
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                {isArabic ? 'الاسم الكريم:' : 'Full Name:'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isArabic ? 'اكتب اسمك الثلاثي' : 'Enter your full name'}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#00E5BE] outline-none transition-all"
                />
                <User className={`w-4 h-4 text-slate-400 absolute ${isArabic ? 'left-3' : 'right-3'} top-3`} />
              </div>
            </div>

            {/* Field 2: Mobile Phone */}
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                {isArabic ? 'رقم الجوال للتواصل:' : 'Mobile Number:'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={mobilePhone}
                  onChange={(e) => setMobilePhone(e.target.value)}
                  placeholder="05XXXXXXXX"
                  dir="ltr"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-mono placeholder:text-slate-400 focus:ring-2 focus:ring-[#00E5BE] outline-none text-left transition-all"
                />
                <Phone className={`w-4 h-4 text-slate-400 absolute ${isArabic ? 'left-3' : 'right-3'} top-3`} />
              </div>
            </div>

            {/* Field 3: Service / Package Selection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isArabic ? 'الخدمة أو البرنامج المطلوب:' : 'Selected Service / Program:'}
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setBookingType('service')}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-all ${
                      bookingType === 'service'
                        ? 'bg-[#0B3B36] text-white dark:bg-[#00E5BE] dark:text-slate-950'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    {isArabic ? 'جلسة' : 'Session'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingType('package')}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-all ${
                      bookingType === 'package'
                        ? 'bg-[#0B3B36] text-white dark:bg-[#00E5BE] dark:text-slate-950'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    {isArabic ? 'باقة' : 'Package'}
                  </button>
                </div>
              </div>

              {bookingType === 'service' ? (
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00E5BE] outline-none cursor-pointer"
                >
                  {SERVICES.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {!isArabic && srv.titleEn ? srv.titleEn : srv.title}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={selectedPackageId}
                  onChange={(e) => setSelectedPackageId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00E5BE] outline-none cursor-pointer"
                >
                  {THERAPY_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {!isArabic && pkg.nameEn ? pkg.nameEn : pkg.name} ({pkg.price} {isArabic ? 'ر.س' : 'SAR'})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Field 4: Preferred Date & Time (One neat compact row) */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  {isArabic ? 'الموعد المناسب:' : 'Preferred Date:'}
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00E5BE] outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  {isArabic ? 'الفترة:' : 'Time Slot:'}
                </label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00E5BE] outline-none cursor-pointer"
                >
                  {TIME_SLOTS.map((slot, idx) => (
                    <option key={idx} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Collapsible Optional Details (Keeps form 60% smaller!) */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setShowOptionalDetails(!showOptionalDetails)}
                className="text-xs font-bold text-[#0D6D54] dark:text-[#00E5BE] hover:underline flex items-center gap-1 cursor-pointer transition-all"
              >
                <span>{isArabic ? '+ بيانات إضافية للطفل أو ملاحظات (اختياري)' : '+ Child details & notes (Optional)'}</span>
                {showOptionalDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showOptionalDetails && (
                <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/10 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        placeholder={isArabic ? 'اسم الطفل (اختياري)' : 'Child name (optional)'}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <select
                        value={childAge}
                        onChange={(e) => setChildAge(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-2 py-1.5 text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
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
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={isArabic ? 'ملاحظة سريعة أو استفسار...' : 'Quick note or inquiry...'}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Direct Instant Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="submit-booking-btn"
                className="w-full py-3 px-4 bg-gradient-to-r from-[#0B3B36] via-[#0D6D54] to-[#00E5BE] hover:opacity-95 active:scale-98 text-white font-black rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4 shrink-0" />
                <span>{isArabic ? 'تأكيد طلب الحجز فوراً' : 'Confirm Booking Request'}</span>
                {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                <Sparkles className="w-3 h-3 text-[#00E5BE]" />
                <span>{isArabic ? 'حجز مباشر وسهل بدون دفع إلكتروني' : 'Direct booking, zero prepayment'}</span>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
