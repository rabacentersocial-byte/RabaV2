import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  CreditCard,
  ShieldCheck,
  Landmark,
  Copy,
  Check,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Sparkles,
  Receipt
} from 'lucide-react';
import { CheckoutItemPayload, PaymentTransaction } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { usePaymentPublicConfig } from '../context/LiveDataContext';
import { createPaymentTransactionInFirestore } from '../services/firestoreService';
import { compressImage } from '../utils/imageCompressor';
import { auth } from '../lib/firebase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CheckoutItemPayload | null;
  onPaymentSubmitted?: (tx: PaymentTransaction) => void;
}

const MOYASAR_CSS_ID = 'raba-moyasar-mpf-css';
const MOYASAR_JS_ID = 'raba-moyasar-mpf-js';

function loadMoyasarSdk(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window unavailable'));
      return;
    }
    if ((window as any).Moyasar) {
      resolve((window as any).Moyasar);
      return;
    }

    if (!document.getElementById(MOYASAR_CSS_ID)) {
      const link = document.createElement('link');
      link.id = MOYASAR_CSS_ID;
      link.rel = 'stylesheet';
      link.href = 'https://cdn.moyasar.com/mpf/1.14.0/moyasar.css';
      document.head.appendChild(link);
    }

    const existingScript = document.getElementById(MOYASAR_JS_ID) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve((window as any).Moyasar));
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Moyasar SDK')));
      return;
    }

    const script = document.createElement('script');
    script.id = MOYASAR_JS_ID;
    script.src = 'https://cdn.moyasar.com/mpf/1.14.0/moyasar.js';
    script.async = true;
    script.onload = () => {
      if ((window as any).Moyasar) {
        resolve((window as any).Moyasar);
      } else {
        reject(new Error('Moyasar SDK loaded without global instance'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Moyasar SDK'));
    document.head.appendChild(script);
  });
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  item,
  onPaymentSubmitted
}) => {
  const { isArabic } = useLanguage();
  const paymentConfig = usePaymentPublicConfig();

  const hasCardOrWalletMethod = Boolean(
    paymentConfig.enabledMethods.mada ||
      paymentConfig.enabledMethods.creditcard ||
      paymentConfig.enabledMethods.applepay ||
      paymentConfig.enabledMethods.stcpay
  );
  const hasBankTransfer = Boolean(
    paymentConfig.enabledMethods.bank_transfer && paymentConfig.bankTransfer?.enabled
  );

  const [selectedTab, setSelectedTab] = useState<'online' | 'bank'>(() =>
    hasCardOrWalletMethod ? 'online' : 'bank'
  );
  const [moyasarLoading, setMoyasarLoading] = useState(false);
  const [moyasarError, setMoyasarError] = useState('');
  const [pendingTx, setPendingTx] = useState<PaymentTransaction | null>(null);

  // Bank transfer states
  const [copiedIban, setCopiedIban] = useState(false);
  const [transferRef, setTransferRef] = useState('');
  const [receiptDataUrl, setReceiptDataUrl] = useState('');
  const [receiptFileName, setReceiptFileName] = useState('');
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [submittingBank, setSubmittingBank] = useState(false);
  const [bankError, setBankError] = useState('');
  const [submittedBankTx, setSubmittedBankTx] = useState<PaymentTransaction | null>(null);

  const moyasarContainerRef = useRef<HTMLDivElement | null>(null);
  const initializedTxIdRef = useRef<string | null>(null);

  // Calculate itemized Subtotal, VAT, and Total in SAR
  const pricing = useMemo(() => {
    const raw = Math.max(0, Number(item?.baseAmount) || 0);
    const vatRate = paymentConfig.vatEnabled ? Math.max(0, Number(paymentConfig.vatRate) || 0) : 0;

    if (!paymentConfig.vatEnabled || vatRate === 0) {
      return { subtotal: raw, vatAmount: 0, total: raw, vatRate: 0 };
    }

    if (paymentConfig.isVatInclusive) {
      const subtotal = Number((raw / (1 + vatRate / 100)).toFixed(2));
      const vatAmount = Number((raw - subtotal).toFixed(2));
      return { subtotal, vatAmount, total: Number(raw.toFixed(2)), vatRate };
    }

    const vatAmount = Number(((raw * vatRate) / 100).toFixed(2));
    const total = Number((raw + vatAmount).toFixed(2));
    return { subtotal: Number(raw.toFixed(2)), vatAmount, total, vatRate };
  }, [item?.baseAmount, paymentConfig.vatEnabled, paymentConfig.vatRate, paymentConfig.isVatInclusive]);

  // Reset modal transient states on open/close
  useEffect(() => {
    if (!isOpen) {
      setPendingTx(null);
      setSubmittedBankTx(null);
      setMoyasarError('');
      setBankError('');
      setTransferRef('');
      setReceiptDataUrl('');
      setReceiptFileName('');
      initializedTxIdRef.current = null;
      return;
    }
    setSelectedTab(hasCardOrWalletMethod ? 'online' : 'bank');
  }, [isOpen, hasCardOrWalletMethod]);

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Initialize Moyasar Web Form dynamically when `online` tab is active
  useEffect(() => {
    if (!isOpen || !item || selectedTab !== 'online') return;
    if (!paymentConfig.isOnlinePaymentEnabled) return;
    if (!paymentConfig.publishableKey?.trim()) {
      setMoyasarError(
        isArabic
          ? 'لم يتم إدخال مفتاح بوابة الدفع العام (Publishable Key) من لوحة التحكم بعد. يمكنك استخدام التحويل البنكي أو التواصل مع الاستقبال.'
          : 'Gateway Publishable Key is not configured yet. Please use Bank Transfer or contact reception.'
      );
      return;
    }
    if (pricing.total <= 0) {
      setMoyasarError(isArabic ? 'المبلغ المستحق غير محدد لهذه الخدمة.' : 'Invalid payable amount.');
      return;
    }

    let cancelled = false;
    setMoyasarLoading(true);
    setMoyasarError('');

    const initForm = async () => {
      try {
        // 1. Pre-create pending transaction in Firestore so callback & ledger track it seamlessly
        let activeTx = pendingTx;
        if (!activeTx) {
          activeTx = await createPaymentTransactionInFirestore({
            provider: 'moyasar',
            mode: paymentConfig.mode,
            method: paymentConfig.enabledMethods.mada ? 'mada' : 'creditcard',
            status: 'pending',
            amount: pricing.total,
            subtotal: pricing.subtotal,
            vatAmount: pricing.vatAmount,
            vatRate: pricing.vatRate,
            currency: 'SAR',
            clientName: item.clientName,
            childName: item.childName,
            clientPhone: item.clientPhone,
            clientEmail: item.clientEmail,
            clientId: item.clientId || auth?.currentUser?.uid || '',
            fileNumber: item.fileNumber,
            appointmentId: item.appointmentId,
            referenceNumber: item.referenceNumber,
            serviceId: item.serviceId,
            serviceTitle: item.serviceTitle,
            itemType: item.itemType || 'appointment'
          });
          if (cancelled) return;
          setPendingTx(activeTx);
        }

        if (initializedTxIdRef.current === activeTx.id && moyasarContainerRef.current?.childElementCount) {
          setMoyasarLoading(false);
          return;
        }

        // 2. Load Moyasar Web Form SDK
        const Moyasar = await loadMoyasarSdk();
        if (cancelled || !moyasarContainerRef.current) return;

        moyasarContainerRef.current.innerHTML = '';

        const methods: string[] = [];
        if (paymentConfig.enabledMethods.mada || paymentConfig.enabledMethods.creditcard) {
          methods.push('creditcard');
        }
        if (paymentConfig.enabledMethods.stcpay) {
          methods.push('stcpay');
        }
        if (paymentConfig.enabledMethods.applepay) {
          methods.push('applepay');
        }
        if (methods.length === 0) methods.push('creditcard');

        const callbackUrl = `${window.location.origin}/payment-callback?tx=${encodeURIComponent(activeTx.id)}`;

        Moyasar.init({
          element: moyasarContainerRef.current,
          amount: Math.max(100, Math.round(pricing.total * 100)), // halalas
          currency: 'SAR',
          language: isArabic ? 'ar' : 'en',
          description: `${item.serviceTitle} (${activeTx.invoiceNumber})`.slice(0, 200),
          publishable_api_key: paymentConfig.publishableKey.trim(),
          callback_url: callbackUrl,
          methods,
          supported_networks: [
            ...(paymentConfig.enabledMethods.mada ? ['mada'] : []),
            ...(paymentConfig.enabledMethods.creditcard ? ['visa', 'mastercard'] : [])
          ],
          apple_pay: {
            country: 'SA',
            label: isArabic ? 'مركز رابا لتأهيل أطفال التوحد' : 'Raba Center',
            validate_merchant_url: 'https://api.moyasar.com/v1/applepay/initiate'
          },
          metadata: {
            paymentId: activeTx.id,
            invoiceNumber: activeTx.invoiceNumber,
            appointmentId: item.appointmentId || '',
            clientId: item.clientId || auth?.currentUser?.uid || '',
            serviceTitle: item.serviceTitle.slice(0, 120),
            fileNumber: item.fileNumber || '',
            clientName: item.clientName.slice(0, 80),
            clientPhone: item.clientPhone.slice(0, 25)
          }
        });

        initializedTxIdRef.current = activeTx.id;
        setMoyasarLoading(false);
      } catch (err: any) {
        if (!cancelled) {
          setMoyasarLoading(false);
          setMoyasarError(
            isArabic
              ? 'تعذر تحميل نموذج الدفع الإلكتروني حالياً. يرجى المحاولة مرة أخرى أو اختيار التحويل البنكي.'
              : 'Could not load online payment form. Please retry or use Bank Transfer.'
          );
        }
      }
    };

    void initForm();
    return () => {
      cancelled = true;
    };
  }, [
    isOpen,
    item,
    selectedTab,
    paymentConfig.isOnlinePaymentEnabled,
    paymentConfig.publishableKey,
    paymentConfig.mode,
    paymentConfig.enabledMethods.mada,
    paymentConfig.enabledMethods.creditcard,
    paymentConfig.enabledMethods.applepay,
    paymentConfig.enabledMethods.stcpay,
    pricing.total,
    pricing.subtotal,
    pricing.vatAmount,
    pricing.vatRate,
    isArabic
  ]);

  const handleCopyIban = async () => {
    if (!paymentConfig.bankTransfer?.iban) return;
    try {
      await navigator.clipboard.writeText(paymentConfig.bankTransfer.iban);
      setCopiedIban(true);
      setTimeout(() => setCopiedIban(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleReceiptFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBankError('');
    setUploadingReceipt(true);
    try {
      const compressed = await compressImage(file, 900, 900, 0.72, false);
      if (compressed.length > 190_000) {
        const smaller = await compressImage(file, 650, 650, 0.6, false);
        setReceiptDataUrl(smaller);
      } else {
        setReceiptDataUrl(compressed);
      }
      setReceiptFileName(file.name);
    } catch {
      setBankError(isArabic ? 'تعذر معالجة صورة الإيصال. يرجى اختيار صورة JPG أو PNG صالحة.' : 'Could not process receipt image.');
    } finally {
      setUploadingReceipt(false);
    }
  };

  const handleBankTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    if (!transferRef.trim() && !receiptDataUrl) {
      setBankError(
        isArabic
          ? 'يرجى إدخال رقم مرجع التحويل أو إرفاق صورة إيصال التحويل البنكي.'
          : 'Please enter the transfer reference or upload the bank transfer receipt.'
      );
      return;
    }

    setSubmittingBank(true);
    setBankError('');
    try {
      const created = await createPaymentTransactionInFirestore({
        provider: 'manual',
        mode: paymentConfig.mode,
        method: 'bank_transfer',
        status: 'manual_review',
        amount: pricing.total,
        subtotal: pricing.subtotal,
        vatAmount: pricing.vatAmount,
        vatRate: pricing.vatRate,
        currency: 'SAR',
        clientName: item.clientName,
        childName: item.childName,
        clientPhone: item.clientPhone,
        clientEmail: item.clientEmail,
        clientId: item.clientId || auth?.currentUser?.uid || '',
        fileNumber: item.fileNumber,
        appointmentId: item.appointmentId,
        referenceNumber: item.referenceNumber,
        serviceId: item.serviceId,
        serviceTitle: item.serviceTitle,
        itemType: item.itemType || 'appointment',
        transferReference: transferRef.trim(),
        receiptUrl: receiptDataUrl
      });
      setSubmittedBankTx(created);
      onPaymentSubmitted?.(created);
    } catch {
      setBankError(
        isArabic
          ? 'حدث خطأ أثناء إرسال إيصال التحويل. يرجى المحاولة مرة أخرى.'
          : 'Failed to submit bank transfer receipt.'
      );
    } finally {
      setSubmittingBank(false);
    }
  };

  if (!isOpen || !item || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[130] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      dir={isArabic ? 'rtl' : 'ltr'}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-l from-[#0B3B36] to-[#0E4D46] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold">
                {isArabic ? 'إتمام السداد الإلكتروني الآمن' : 'Secure Online Checkout'}
              </h3>
              <p className="text-[11px] text-emerald-100/90 flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                <span>
                  {isArabic
                    ? `بوابة دفع مشفّرة (${paymentConfig.mode === 'sandbox' ? 'البيئة التجريبية Sandbox' : 'دفع آمن مشفّر SSL'})`
                    : `Encrypted Checkout (${paymentConfig.mode})`}
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {submittedBankTx ? (
            /* Bank Transfer Submitted Confirmation */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  {isArabic ? 'تم استلام إيصال التحويل البنكي بنجاح!' : 'Bank Transfer Receipt Received!'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  {isArabic
                    ? 'طلبك الآن قيد المراجعة المالية السريعة من فريق مركز رابا، وسيتم تأكيد الحجز وإصدار الفاتورة الضريبية فور المطابقة.'
                    : 'Your transfer receipt is under rapid finance review and your booking will be confirmed shortly.'}
                </p>
              </div>
              <div className="max-w-sm mx-auto p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">رقم الفاتورة:</span>
                  <span className="font-mono font-black text-[#2E86EB]">{submittedBankTx.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">المبلغ:</span>
                  <span className="font-black text-slate-900 dark:text-white">
                    {submittedBankTx.amount.toFixed(2)} ر.س
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">الحالة:</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">قيد مراجعة التحويل</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 rounded-xl bg-[#0B3B36] hover:bg-[#082925] text-white text-xs font-extrabold cursor-pointer"
              >
                {isArabic ? 'إغلاق والعودة' : 'Close'}
              </button>
            </div>
          ) : (
            <>
              {/* Itemized Summary + VAT Breakdown */}
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/90 dark:border-white/10 p-4 space-y-2.5 text-xs">
                <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-slate-200/80 dark:border-white/10">
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-[#0B3B36] dark:text-emerald-400" />
                      {isArabic ? 'ملخص الطلب والفاتورة' : 'Order Summary'}
                    </div>
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                      {item.serviceTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {item.clientName}
                      {item.childName ? ` • ${item.childName}` : ''}
                      {item.referenceNumber ? ` • ${item.referenceNumber}` : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>{isArabic ? 'المبلغ قبل الضريبة:' : 'Subtotal:'}</span>
                  <span className="font-mono font-bold">{pricing.subtotal.toFixed(2)} ر.س</span>
                </div>

                {paymentConfig.vatEnabled && (
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>
                      {isArabic
                        ? `ضريبة القيمة المضافة (${pricing.vatRate}%):`
                        : `VAT (${pricing.vatRate}%):`}
                    </span>
                    <span className="font-mono font-bold">{pricing.vatAmount.toFixed(2)} ر.س</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-white/10 text-sm font-black text-[#0B3B36] dark:text-emerald-300">
                  <span>{isArabic ? 'الإجمالي المستحق للدفع:' : 'Total Due:'}</span>
                  <span className="font-mono text-base">{pricing.total.toFixed(2)} SAR</span>
                </div>
              </div>

              {/* Payment Method Tabs */}
              {hasCardOrWalletMethod && hasBankTransfer && (
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedTab('online')}
                    className={`p-3 rounded-2xl border-2 text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedTab === 'online'
                        ? 'border-[#0B3B36] dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-[#0B3B36] dark:text-emerald-300'
                        : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{isArabic ? 'مدى / فيزا / Apple Pay' : 'Card / Apple Pay'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTab('bank')}
                    className={`p-3 rounded-2xl border-2 text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedTab === 'bank'
                        ? 'border-[#0B3B36] dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-[#0B3B36] dark:text-emerald-300'
                        : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Landmark className="w-4 h-4" />
                    <span>{isArabic ? 'التحويل البنكي (IBAN)' : 'Bank Transfer'}</span>
                  </button>
                </div>
              )}

              {/* Installments Badge Note if Tabby/Tamara enabled */}
              {(paymentConfig.enabledMethods.tabby || paymentConfig.enabledMethods.tamara) && (
                <div className="p-3 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/40 text-[11px] font-bold text-sky-900 dark:text-sky-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2E86EB] shrink-0" />
                  <span>
                    {isArabic
                      ? `متاح تقسيم المبلغ على 4 دفعات شهرية بقيمة ${(pricing.total / 4).toFixed(2)} ر.س بدون فوائد عبر ${[
                          paymentConfig.enabledMethods.tabby ? 'تابي (Tabby)' : '',
                          paymentConfig.enabledMethods.tamara ? 'تمارا (Tamara)' : ''
                        ]
                          .filter(Boolean)
                          .join(' و ')}.`
                      : `Split into 4 interest-free payments of ${(pricing.total / 4).toFixed(2)} SAR.`}
                  </span>
                </div>
              )}

              {/* TAB 1: Moyasar Dynamic Payment Form */}
              {selectedTab === 'online' && hasCardOrWalletMethod && (
                <div className="space-y-3">
                  {/* Supported Method Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                    {paymentConfig.enabledMethods.mada && (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                        مدى mada
                      </span>
                    )}
                    {paymentConfig.enabledMethods.creditcard && (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                        Visa / Mastercard
                      </span>
                    )}
                    {paymentConfig.enabledMethods.applepay && (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                        Apple Pay
                      </span>
                    )}
                    {paymentConfig.enabledMethods.stcpay && (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                        STC Pay
                      </span>
                    )}
                  </div>

                  {moyasarError && (
                    <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/40 text-xs font-bold text-amber-900 dark:text-amber-200 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                      <span>{moyasarError}</span>
                    </div>
                  )}

                  {moyasarLoading && (
                    <div className="py-10 flex flex-col items-center justify-center gap-2 text-xs text-slate-500">
                      <Loader2 className="w-6 h-6 animate-spin text-[#0B3B36]" />
                      <span>{isArabic ? 'جاري تهيئة بوابة الدفع المشفرة...' : 'Initializing secure payment form...'}</span>
                    </div>
                  )}

                  <div
                    ref={moyasarContainerRef}
                    className="mysr-form bg-white rounded-2xl p-2 sm:p-3 border border-slate-200/80 min-h-[120px]"
                  />
                </div>
              )}

              {/* TAB 2: Bank Transfer with IBAN & Receipt Upload */}
              {selectedTab === 'bank' && hasBankTransfer && (
                <form onSubmit={handleBankTransferSubmit} className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">البنك:</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {paymentConfig.bankTransfer.bankNameAr}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">اسم الحساب:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {paymentConfig.bankTransfer.accountNameAr}
                      </span>
                    </div>
                    {paymentConfig.bankTransfer.iban && (
                      <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-[10px] text-slate-500">رقم الآيبان (IBAN)</div>
                          <div dir="ltr" className="font-mono font-black text-slate-900 dark:text-white truncate">
                            {paymentConfig.bankTransfer.iban}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyIban}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 font-bold cursor-pointer shrink-0"
                        >
                          {copiedIban ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedIban ? 'تم النسخ' : 'نسخ'}</span>
                        </button>
                      </div>
                    )}
                    {paymentConfig.bankTransfer.instructionsAr && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">
                        {paymentConfig.bankTransfer.instructionsAr}
                      </p>
                    )}
                  </div>

                  {bankError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-700/40 text-rose-700 dark:text-rose-200 font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{bankError}</span>
                    </div>
                  )}

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                      رقم العملية / مرجع التحويل البنكي:
                    </label>
                    <input
                      type="text"
                      value={transferRef}
                      onChange={(e) => setTransferRef(e.target.value)}
                      placeholder="مثال: TRF-2026-99812"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                      إرفاق صورة إيصال التحويل (اختياري مع المرجع):
                    </label>
                    <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/15 hover:border-[#0B3B36] bg-slate-50/70 dark:bg-slate-800/40 cursor-pointer transition-colors">
                      <Upload className="w-5 h-5 text-[#0B3B36] dark:text-emerald-400" />
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {uploadingReceipt
                          ? 'جاري ضغط وتجهيز الإيصال...'
                          : receiptFileName || 'اضغط لاختيار صورة إيصال التحويل (JPG / PNG)'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptFileChange}
                        className="hidden"
                      />
                    </label>
                    {receiptDataUrl && (
                      <img
                        src={receiptDataUrl}
                        alt="Receipt preview"
                        className="mt-2.5 max-h-36 rounded-xl border border-slate-200 dark:border-white/10 object-contain"
                      />
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submittingBank || uploadingReceipt}
                    className="w-full py-3.5 rounded-2xl bg-[#0B3B36] hover:bg-[#082925] disabled:opacity-60 text-white font-extrabold text-sm shadow-sm cursor-pointer transition-all"
                  >
                    {submittingBank ? 'جاري إرسال إيصال التحويل...' : 'تأكيد وإرسال إيصال التحويل البنكي'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CheckoutModal;
