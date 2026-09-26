import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Share2,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Appointment } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onPaymentSuccess: (appointment: Appointment) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onPaymentSuccess
}) => {
  const { t, isArabic, direction } = useLanguage();

  const [step, setStep] = useState<'payment' | 'otp' | 'success'>('payment');
  const [paymentMethod, setPaymentMethod] = useState<'mada' | 'apple_pay' | 'visa' | 'tabby'>('mada');

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(appointment?.guardianName || '');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // OTP State
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');

  useEffect(() => {
    if (appointment?.guardianName) {
      setCardHolder(appointment.guardianName);
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const handlePayClick = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      if (paymentMethod === 'apple_pay') {
        // Direct apple pay success
        triggerSuccess();
      } else {
        // 3D Secure OTP verification
        setStep('otp');
      }
    }, 1200);
  };

  const handleVerifyOtp = () => {
    if (otpCode.length < 4) {
      setOtpError(isArabic ? 'يرجى إدخال رمز التحقق المكون من 4 أرقام (الرمز التجريبي: 1234)' : 'Please enter the 4-digit verification code (demo code: 1234)');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      triggerSuccess();
    }, 1000);
  };

  const triggerSuccess = () => {
    setStep('success');
    const updated: Appointment = {
      ...appointment,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: paymentMethod
    };
    onPaymentSuccess(updated);

    // Fire Confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={() => step !== 'otp' && onClose()}
    >
      <div 
        className={`relative bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white rounded-3xl max-w-lg w-full shadow-[0_20px_60px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.7)] border border-slate-200 dark:border-white/20 overflow-hidden ${isArabic ? 'text-right' : 'text-left'} my-8`}
        onClick={(e) => e.stopPropagation()}
        id="payment-modal-card"
        dir={direction}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500/15 dark:from-teal-500/20 via-slate-100 dark:via-slate-900/60 to-white dark:to-slate-950/80 p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 dark:bg-[#00E5BE]/20 border border-sky-400/30 dark:border-[#00E5BE]/30 flex items-center justify-center text-sky-600 dark:text-[#00E5BE]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {isArabic ? 'بوابة الدفع الإلكتروني الآمنة' : 'Secure Payment Gateway'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00E5BE]" />
                {isArabic ? 'تشفير بنكي 256-bit SSL معتمد' : 'Certified 256-bit SSL Banking Encryption'}
              </p>
            </div>
          </div>
          {step !== 'otp' && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-white/20 transition-colors cursor-pointer"
              aria-label={isArabic ? 'إلغاء' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* STEP 1: Payment Methods & Details */}
        {step === 'payment' && (
          <form onSubmit={handlePayClick} className="p-6 space-y-5">
            
            {/* Order summary banner */}
            <div className="bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/15 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                <span>{isArabic ? 'الخدمة / الباقة المحجوزة:' : 'Booked Service / Package:'}</span>
                <span className="font-bold text-slate-900 dark:text-white">{appointment.serviceTitle}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                <span>{isArabic ? 'الأخصائي المسؤول:' : 'Attending Specialist:'}</span>
                <span className="font-semibold text-sky-700 dark:text-[#00E5BE]">{appointment.specialistName}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                <span>{isArabic ? 'اسم الطفل والموعد:' : 'Patient & Schedule:'}</span>
                <span className="text-slate-800 dark:text-slate-200">{appointment.childName} ({appointment.date} - {appointment.timeSlot.split('-')[0]})</span>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white">{isArabic ? 'المبلغ الإجمالي المستحق:' : 'Total Amount Due:'}</span>
                <span className="text-2xl font-black text-sky-600 dark:text-[#00E5BE]">{appointment.amount} {isArabic ? 'ر.س' : 'SAR'}</span>
              </div>
            </div>

            {/* Payment method selector tabs */}
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                {isArabic ? 'اختر وسيلة الدفع المعتمدة:' : 'Select Payment Method:'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mada')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    paymentMethod === 'mada'
                      ? 'border-sky-500 dark:border-[#00E5BE] bg-sky-50 dark:bg-[#00E5BE]/20 font-bold ring-2 ring-sky-400 dark:ring-[#00E5BE]/30'
                      : 'border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs font-black text-sky-700 dark:text-[#00E5BE]">مدى mada</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{isArabic ? 'فوري ومباشر' : 'Debit'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    paymentMethod === 'apple_pay'
                      ? 'border-slate-400 dark:border-white/40 bg-slate-200/80 dark:bg-white/20 font-bold ring-2 ring-slate-400 dark:ring-white/30'
                      : 'border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs font-black text-slate-900 dark:text-white">Apple Pay</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{isArabic ? 'بلمسة واحدة' : 'Instant'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('visa')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    paymentMethod === 'visa'
                      ? 'border-sky-500 dark:border-[#00E5BE] bg-sky-50 dark:bg-[#00E5BE]/20 font-bold ring-2 ring-sky-400 dark:ring-[#00E5BE]/30'
                      : 'border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Visa / MC</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{isArabic ? 'ائتمانية' : 'Credit'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('tabby')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    paymentMethod === 'tabby'
                      ? 'border-emerald-500 dark:border-[#00E5BE] bg-emerald-50 dark:bg-[#00E5BE]/20 font-bold ring-2 ring-emerald-400 dark:ring-[#00E5BE]/30'
                      : 'border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs font-black text-emerald-700 dark:text-[#00E5BE]">تابي Tabby</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{isArabic ? '4 أقساط' : '4 Splits'}</span>
                </button>
              </div>
            </div>

            {/* Apple Pay quick view */}
            {paymentMethod === 'apple_pay' && (
              <div className="p-4 bg-slate-50 dark:bg-white/[0.08] rounded-2xl text-center space-y-2 border border-slate-200 dark:border-white/15">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {isArabic 
                    ? 'الدفع السريع والآمن عبر خدمة Apple Pay بواسطة بصمة الوجه أو الإصبع'
                    : 'Fast and secure checkout using Apple Pay with Face ID or Touch ID'}
                </p>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-extrabold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>
                    {isProcessing 
                      ? (isArabic ? 'جاري التحقق...' : 'Verifying...') 
                      : (isArabic ? `إتمام السداد ${appointment.amount} ر.س` : `Pay ${appointment.amount} SAR`)}
                  </span>
                </button>
              </div>
            )}

            {/* Tabby Installments breakdown */}
            {paymentMethod === 'tabby' && (
              <div className="p-4 bg-emerald-50 dark:bg-[#00E5BE]/10 border border-emerald-200 dark:border-[#00E5BE]/25 rounded-2xl space-y-2 text-xs text-slate-800 dark:text-white">
                <div className="flex items-center justify-between font-bold">
                  <span>{isArabic ? 'قسّم فاتورتك على 4 دفعات شهرية متساوية:' : 'Split into 4 monthly payments:'}</span>
                  <span className="text-base text-emerald-700 dark:text-[#00E5BE]">
                    {(appointment.amount / 4).toFixed(2)} {isArabic ? 'ر.س / شهرياً' : 'SAR / mo'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  {isArabic 
                    ? `بدون أي فوائد وبدون رسوم خفية. متوافق مع أحكام الشريعة الإسلامية. الدفعة الأولى اليوم: ${(appointment.amount / 4).toFixed(2)} ر.س.`
                    : `No interest, no hidden fees. Sharia-compliant. First payment today: ${(appointment.amount / 4).toFixed(2)} SAR.`}
                </p>
              </div>
            )}

            {/* Card Inputs for mada / Visa / Tabby */}
            {paymentMethod !== 'apple_pay' && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    {isArabic ? 'اسم حامل البطاقة (كما هو مطبوع):' : 'Cardholder Name:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-xl p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 dark:focus:ring-[#00E5BE]/30 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    {isArabic ? 'رقم البطاقة البنكية:' : 'Card Number:'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-xl p-2.5 pl-10 font-mono tracking-wider text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 dark:focus:ring-[#00E5BE]/30 outline-none text-left"
                      dir="ltr"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      {isArabic ? 'تاريخ الانتهاء (MM/YY):' : 'Expiry Date (MM/YY):'}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-xl p-2.5 font-mono text-center text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 dark:focus:ring-[#00E5BE]/30 outline-none"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      {isArabic ? 'رمز الأمان (CVV):' : 'CVV Code:'}
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-xl p-2.5 font-mono text-center text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 dark:focus:ring-[#00E5BE]/30 outline-none"
                      dir="ltr"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-gradient-to-r from-[#00E5BE] via-[#0284C7] to-[#0284C7] hover:brightness-110 active:scale-95 text-slate-950 font-black rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isProcessing 
                      ? (isArabic ? 'جاري الاتصال المشفر بالبنك...' : 'Connecting to Bank...') 
                      : (isArabic ? `سداد آمن بمبلغ ${appointment.amount} ريال سعودي` : `Pay Securely ${appointment.amount} SAR`)}
                  </span>
                </button>
              </div>
            )}

            {/* Trust Seals */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00E5BE]" />
                {isArabic ? 'معتمد ومحمي بتشفير بنكي' : 'Bank Encrypted & Verified'}
              </span>
              <span>•</span>
              <span>PCI-DSS Compliant</span>
            </div>

          </form>
        )}

        {/* STEP 2: 3D Secure / OTP Simulation */}
        {step === 'otp' && (
          <div className="p-6 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/15 dark:bg-[#00E5BE]/20 border border-sky-400/30 dark:border-[#00E5BE]/30 text-sky-600 dark:text-[#00E5BE] flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {isArabic ? 'التحقق الأمني ثلاثي الأبعاد (3D Secure)' : '3D Secure Verification'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto">
                {isArabic ? (
                  <>تم إرسال رمز التحقق المؤقت (OTP) إلى هاتفك المسجل لدى البنك والمنتهي بـ <strong className="text-sky-600 dark:text-[#00E5BE]">****567</strong></>
                ) : (
                  <>A one-time password (OTP) was sent to your bank registered mobile ending in <strong className="text-sky-600 dark:text-[#00E5BE]">****567</strong></>
                )}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/15 p-4 rounded-2xl max-w-xs mx-auto">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                {isArabic ? 'أدخل رمز التحقق (للتجربة: 1234):' : 'Enter verification code (demo: 1234):'}
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value);
                  setOtpError('');
                }}
                placeholder="1234"
                className="w-full text-center tracking-[0.5em] font-mono font-bold text-xl py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-[#00E5BE]/50"
                dir="ltr"
              />
              {otpError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-2 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {otpError}
                </p>
              )}
            </div>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleVerifyOtp}
              className="w-full max-w-xs mx-auto py-3 bg-gradient-to-r from-[#00E5BE] to-[#0284C7] text-slate-950 font-black rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing 
                ? (isArabic ? 'جاري اعتماد العملية...' : 'Authorizing...') 
                : (isArabic ? 'تأكيد السداد والخصم' : 'Confirm & Authorize Payment')}
            </button>

            <button
              type="button"
              onClick={() => setStep('payment')}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white underline block mx-auto cursor-pointer"
            >
              {isArabic ? 'الرجوع لتعديل بيانات البطاقة' : 'Back to card details'}
            </button>
          </div>
        )}

        {/* STEP 3: Payment Success Screen & Digital Invoice */}
        {step === 'success' && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 dark:bg-[#00E5BE]/20 border border-emerald-400/30 dark:border-[#00E5BE]/40 text-emerald-600 dark:text-[#00E5BE] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-950 bg-gradient-to-r from-[#00E5BE] to-[#0284C7] px-3 py-1 rounded-full inline-block shadow-xs">
                {isArabic ? 'تم استلام الدفعة وتأكيد الموعد بنجاح 🎉' : 'Payment Received & Appointment Confirmed 🎉'}
              </span>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mt-2">
                {isArabic ? 'سند حجز إلكتروني رسمي' : 'Official Electronic Booking Receipt'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isArabic ? 'رقم الحجز المرجعي:' : 'Booking Reference:'} <strong className="font-mono text-sky-700 dark:text-[#00E5BE] text-sm">{appointment.referenceNumber}</strong>
              </p>
            </div>

            {/* Digital Receipt Card */}
            <div className={`bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/15 rounded-2xl p-4 ${isArabic ? 'text-right' : 'text-left'} text-xs space-y-2.5`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                <span className="text-slate-600 dark:text-slate-300">{isArabic ? 'المستفيد (الطفل):' : 'Patient (Child):'}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {appointment.childName} ({appointment.childAge} {isArabic ? 'سنوات' : 'years'})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">{isArabic ? 'الخدمة:' : 'Service:'}</span>
                <span className="font-bold text-slate-900 dark:text-white">{appointment.serviceTitle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">{isArabic ? 'الأخصائي المعالج:' : 'Attending Therapist:'}</span>
                <span className="font-semibold text-sky-700 dark:text-[#00E5BE]">{appointment.specialistName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">{isArabic ? 'تاريخ ووقت الجلسة:' : 'Date & Time:'}</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{appointment.date} | {appointment.timeSlot}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
                <span className="text-slate-800 dark:text-slate-200 font-bold">{isArabic ? 'طريقة السداد والمبلغ:' : 'Payment & Amount:'}</span>
                <span className="font-bold text-sky-700 dark:text-[#00E5BE] text-sm">
                  {appointment.amount} {isArabic ? 'ر.س' : 'SAR'} ({paymentMethod === 'apple_pay' ? 'Apple Pay' : paymentMethod === 'mada' ? 'mada' : paymentMethod === 'tabby' ? 'Tabby' : 'Visa'})
                </span>
              </div>
              <div className="bg-sky-50 dark:bg-[#00E5BE]/10 border border-sky-200 dark:border-[#00E5BE]/25 p-2.5 rounded-xl text-[11px] text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                {isArabic 
                  ? '🔔 تم تفعيل نظام التنبيهات الآلي! ستصلك رسالة تذكيرية عبر الواتساب والرسائل القصيرة قبل موعد الجلسة بـ 24 ساعة وساعتين.'
                  : '🔔 Automated notification system activated! You will receive reminder messages via WhatsApp and SMS 24 hours and 2 hours before the session.'}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={handlePrintReceipt}
                className="py-2.5 px-3 bg-slate-100 dark:bg-white/[0.08] border border-slate-300 dark:border-white/15 hover:bg-slate-200 dark:hover:bg-white/[0.15] text-slate-800 dark:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-sky-600 dark:text-[#00E5BE]" />
                <span>{isArabic ? 'طباعة السند' : 'Print Receipt'}</span>
              </button>

              <button
                onClick={() => {
                  const text = isArabic 
                    ? `تم تأكيد حجز موعد جلسة في مركز رابا للطفل ${appointment.childName} مع ${appointment.specialistName} بتاريخ ${appointment.date} - ${appointment.timeSlot}. رقم الحجز: ${appointment.referenceNumber}`
                    : `Session appointment confirmed at Raba Center for ${appointment.childName} with ${appointment.specialistName} on ${appointment.date} - ${appointment.timeSlot}. Booking Ref: ${appointment.referenceNumber}`;
                  window.open(`https://wa.me/966551234567?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isArabic ? 'مشاركة عبر واتساب' : 'Share on WhatsApp'}</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-[#00E5BE] to-[#0284C7] text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer hover:brightness-105"
            >
              {isArabic ? 'تم، العودة للصفحة الرئيسية' : 'Done, Back to Home'}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
