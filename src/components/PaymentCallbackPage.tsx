import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ShieldCheck,
  Printer,
  Home,
  UserCheck,
  Receipt,
  Clock
} from 'lucide-react';
import { PaymentTransaction } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { usePaymentPublicConfig } from '../context/LiveDataContext';
import { subscribePaymentById } from '../services/firestoreService';

interface PaymentCallbackPageProps {
  onGoPortal: () => void;
  onGoHome: () => void;
}

interface VerifiedServerResponse {
  success?: boolean;
  verified?: boolean;
  paymentId?: string;
  gatewayPaymentId?: string;
  status?: 'paid' | 'failed' | 'refunded' | 'pending';
  gatewayStatus?: string;
  amount?: number;
  currency?: string;
  method?: string;
  cardBrand?: string;
  cardLast4?: string;
  message?: string;
  appointmentId?: string;
  verifiedAtISO?: string;
  error?: string;
}

export const PaymentCallbackPage: React.FC<PaymentCallbackPageProps> = ({
  onGoPortal,
  onGoHome
}) => {
  const { isArabic } = useLanguage();
  const paymentConfig = usePaymentPublicConfig();

  const [verifying, setVerifying] = useState(true);
  const [serverResult, setServerResult] = useState<VerifiedServerResponse | null>(null);
  const [livePaymentDoc, setLivePaymentDoc] = useState<PaymentTransaction | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Read URL params from Moyasar redirect (?id=...&status=...&message=...&tx=...)
  const searchParams =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const gatewayPaymentId = searchParams.get('id') || '';
  const txId = searchParams.get('tx') || '';
  const queryMessage = searchParams.get('message') || '';

  // 1. Real-time Firestore listener on `payments/{txId}` (updates instantaneously if webhook fires)
  useEffect(() => {
    if (!txId) return;
    const unsub = subscribePaymentById(txId, (doc) => {
      if (doc) setLivePaymentDoc(doc);
    });
    return () => unsub();
  }, [txId]);

  // 2. Authoritative server-side verification against Moyasar REST API (NEVER trusts client query status alone)
  useEffect(() => {
    let cancelled = false;
    if (!gatewayPaymentId) {
      setVerifying(false);
      setErrorMessage(
        isArabic
          ? 'لم يتم العثور على معرف عملية دفع صالح للتحقق منه.'
          : 'No valid payment reference ID found in callback URL.'
      );
      return;
    }

    const verifyOnServer = async () => {
      setVerifying(true);
      setErrorMessage('');
      try {
        const res = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gatewayPaymentId,
            paymentId: txId || undefined
          })
        });
        const data = (await res.json().catch(() => ({}))) as VerifiedServerResponse;
        if (cancelled) return;
        if (res.ok && data.verified) {
          setServerResult(data);
        } else {
          setServerResult(data);
          setErrorMessage(
            data?.error ||
              (isArabic
                ? 'تعذر التحقق الآلي الفوري من العملية. سيتم تحديث حالة الدفع فور وصول إشعار البوابة.'
                : 'Could not verify payment immediately. Waiting for gateway confirmation.')
          );
        }
      } catch {
        if (!cancelled) {
          setErrorMessage(
            isArabic
              ? 'حدث خطأ في الاتصال بالخادم أثناء التحقق من العملية.'
              : 'Network error while verifying payment status.'
          );
        }
      } finally {
        if (!cancelled) setVerifying(false);
      }
    };

    void verifyOnServer();
    return () => {
      cancelled = true;
    };
  }, [gatewayPaymentId, txId, isArabic]);

  // Authoritative status strictly from server verification or verified Firestore doc
  const effectiveStatus =
    livePaymentDoc?.verifiedByServer && livePaymentDoc?.status
      ? livePaymentDoc.status
      : serverResult?.verified && serverResult?.status
        ? serverResult.status
        : verifying
          ? 'pending'
          : 'failed';

  const isPaid = effectiveStatus === 'paid';
  const isPending = verifying || effectiveStatus === 'pending';

  const displayAmount = livePaymentDoc?.amount ?? serverResult?.amount ?? 0;
  const displayInvoice = livePaymentDoc?.invoiceNumber || (txId ? `RABA-${txId.slice(-6).toUpperCase()}` : gatewayPaymentId);
  const displayMethod = livePaymentDoc?.method || serverResult?.method || 'mada';
  const displayCardLast4 = livePaymentDoc?.cardLast4 || serverResult?.cardLast4 || '';
  const displayMessage =
    serverResult?.message || livePaymentDoc?.gatewayMessage || queryMessage || '';

  return (
    <main
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 py-12 px-4 flex items-center justify-center"
    >
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden">
        {/* Top Accent Strip */}
        <div
          className={`px-6 py-6 text-white text-center space-y-2.5 ${
            isPending
              ? 'bg-[#0B3B36]'
              : isPaid
                ? 'bg-gradient-to-l from-[#0B3B36] to-[#047857]'
                : 'bg-gradient-to-l from-rose-700 to-rose-600'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-white/15 mx-auto flex items-center justify-center">
            {isPending ? (
              <Loader2 className="w-8 h-8 animate-spin text-emerald-300" />
            ) : isPaid ? (
              <CheckCircle2 className="w-9 h-9 text-emerald-200" />
            ) : (
              <XCircle className="w-9 h-9 text-rose-100" />
            )}
          </div>

          <h1 className="text-xl font-black">
            {isPending
              ? isArabic
                ? 'جاري التحقق الآمن من عملية الدفع...'
                : 'Verifying Your Payment Securely...'
              : isPaid
                ? isArabic
                  ? 'تم استلام وتأكيد دفعتك بنجاح!'
                  : 'Payment Confirmed Successfully!'
                : isArabic
                  ? 'لم تكتمل عملية الدفع'
                  : 'Payment Could Not Be Completed'}
          </h1>

          <p className="text-xs text-white/85 max-w-md mx-auto leading-relaxed">
            {isPending
              ? isArabic
                ? 'يتم الآن مطابقة حالة العملية مباشرة مع بوابة الدفع عبر الخادم وتحديث ملفك في بوابة الأسرة.'
                : 'Cross-checking transaction status directly with the payment gateway.'
              : isPaid
                ? isArabic
                  ? 'تم تأكيد الحجز وإصدار إيصال السداد الضريبي الخاص بك وحفظه في سجل بوابة الأسرة.'
                  : 'Your booking is confirmed and your VAT receipt is saved in the Family Portal.'
                : errorMessage ||
                  displayMessage ||
                  (isArabic
                    ? 'لم يتم خصم المبلغ أو تم رفض العملية من البنك المصدر للبطاقة. يمكنك المحاولة مرة أخرى من بوابة الأسرة.'
                    : 'The transaction was not completed. Please try again from the Family Portal.')}
          </p>
        </div>

        {/* Receipt Body */}
        <div className="p-6 sm:p-8 space-y-6 text-xs">
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
              <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white">
                <Receipt className="w-4 h-4 text-[#0B3B36] dark:text-emerald-400" />
                <span>{isArabic ? 'تفاصيل الإيصال الإلكتروني' : 'Electronic Receipt Details'}</span>
              </div>
              {isPaid && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-500/20 px-2.5 py-0.5 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>مؤكد عبر الخادم</span>
                </span>
              )}
              {isPending && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-lg">
                  <Clock className="w-3.5 h-3.5" />
                  <span>قيد المطابقة</span>
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">رقم الفاتورة:</span>
              <span className="font-mono font-extrabold text-slate-900 dark:text-white">{displayInvoice}</span>
            </div>

            {gatewayPaymentId && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">الرقم المرجعي بالبوابة:</span>
                <span dir="ltr" className="font-mono font-bold text-[#2E86EB] truncate max-w-[220px]">
                  {gatewayPaymentId}
                </span>
              </div>
            )}

            {livePaymentDoc?.serviceTitle && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">الخدمة / الباقة:</span>
                <span className="font-bold text-slate-900 dark:text-white">{livePaymentDoc.serviceTitle}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-slate-500">وسيلة الدفع:</span>
              <span className="font-bold text-slate-900 dark:text-white uppercase">
                {displayMethod}
                {displayCardLast4 ? ` •••• ${displayCardLast4}` : ''}
              </span>
            </div>

            {displayAmount > 0 && (
              <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-white/10 text-sm font-black text-[#0B3B36] dark:text-emerald-300">
                <span>الإجمالي المدفوع:</span>
                <span className="font-mono">{Number(displayAmount).toFixed(2)} SAR</span>
              </div>
            )}

            <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
              <span>الرقم الضريبي للمركز:</span>
              <span className="font-mono font-bold">{paymentConfig.clinicTaxNumber || '310000000000003'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 print:hidden">
            <button
              type="button"
              onClick={onGoPortal}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#0B3B36] hover:bg-[#082925] text-white font-extrabold text-sm shadow-sm cursor-pointer transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isArabic ? 'العودة لبوابة الأسرة' : 'Return to Family Portal'}</span>
            </button>

            {isPaid && (
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs cursor-pointer transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>{isArabic ? 'طباعة الإيصال' : 'Print Receipt'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onGoHome}
              className="inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl border border-slate-200 dark:border-white/15 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer transition-all"
            >
              <Home className="w-4 h-4" />
              <span>{isArabic ? 'الرئيسية' : 'Home'}</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentCallbackPage;
