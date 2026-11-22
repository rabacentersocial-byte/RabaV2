import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Receipt,
  Search,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Eye,
  X,
  CreditCard,
  TrendingUp,
  CalendarDays,
  AlertCircle,
  FileImage,
  ShieldCheck
} from 'lucide-react';
import { PaymentTransaction, PaymentTransactionStatus } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { usePaymentPublicConfig } from '../../context/LiveDataContext';
import {
  subscribePayments,
  updatePaymentTransactionStatusInFirestore
} from '../../services/firestoreService';

interface PaymentsLedgerProps {
  canManage: boolean;
}

const STATUS_META: Record<
  PaymentTransactionStatus,
  { labelAr: string; labelEn: string; cls: string; icon: React.ReactNode }
> = {
  paid: {
    labelAr: 'مدفوع',
    labelEn: 'Paid',
    cls: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />
  },
  pending: {
    labelAr: 'قيد الانتظار',
    labelEn: 'Pending',
    cls: 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
    icon: <Clock className="w-3.5 h-3.5" />
  },
  manual_review: {
    labelAr: 'مراجعة تحويل',
    labelEn: 'Transfer Review',
    cls: 'bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-500/30',
    icon: <FileImage className="w-3.5 h-3.5" />
  },
  failed: {
    labelAr: 'فشل',
    labelEn: 'Failed',
    cls: 'bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30',
    icon: <XCircle className="w-3.5 h-3.5" />
  },
  refunded: {
    labelAr: 'مسترجع',
    labelEn: 'Refunded',
    cls: 'bg-slate-100 dark:bg-slate-700/40 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600/40',
    icon: <RotateCcw className="w-3.5 h-3.5" />
  }
};

function formatMethodLabel(method: string, isArabic: boolean): string {
  switch (method) {
    case 'mada':
      return isArabic ? 'مدى (mada)' : 'mada';
    case 'creditcard':
      return 'Visa / Mastercard';
    case 'applepay':
      return 'Apple Pay';
    case 'stcpay':
      return 'STC Pay';
    case 'bank_transfer':
      return isArabic ? 'تحويل بنكي' : 'Bank Transfer';
    case 'tabby':
      return isArabic ? 'تابي (Tabby)' : 'Tabby';
    case 'tamara':
      return isArabic ? 'تمارا (Tamara)' : 'Tamara';
    default:
      return method;
  }
}

export const PaymentsLedger: React.FC<PaymentsLedgerProps> = ({ canManage }) => {
  const { isArabic } = useLanguage();
  const paymentConfig = usePaymentPublicConfig();

  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentTransactionStatus>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<PaymentTransaction | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [confirmRefundId, setConfirmRefundId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribePayments(
      (list) => {
        setPayments(list);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // KPI Metrics
  const kpis = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    let totalCollected = 0;
    let todayCollected = 0;
    let pendingAmount = 0;
    let pendingCount = 0;
    let failedCount = 0;
    let paidCount = 0;

    payments.forEach((p) => {
      const amt = Number(p.amount) || 0;
      const dateStr = (p.verifiedAtISO || p.createdAtISO || p.createdAt || '').slice(0, 10);
      if (p.status === 'paid') {
        totalCollected += amt;
        paidCount += 1;
        if (dateStr === todayKey) todayCollected += amt;
      } else if (p.status === 'pending' || p.status === 'manual_review') {
        pendingAmount += amt;
        pendingCount += 1;
      } else if (p.status === 'failed') {
        failedCount += 1;
      }
    });

    return { totalCollected, todayCollected, pendingAmount, pendingCount, failedCount, paidCount };
  }, [payments]);

  const filteredPayments = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (methodFilter !== 'all' && p.method !== methodFilter) return false;
      if (!q) return true;
      return (
        p.invoiceNumber.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.gatewayPaymentId || '').toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q) ||
        (p.childName || '').toLowerCase().includes(q) ||
        p.clientPhone.toLowerCase().includes(q) ||
        p.serviceTitle.toLowerCase().includes(q)
      );
    });
  }, [payments, search, statusFilter, methodFilter]);

  const handleStatusChange = async (payment: PaymentTransaction, newStatus: PaymentTransactionStatus) => {
    if (!canManage) return;
    setPendingActionId(payment.id);
    setFeedback(null);
    try {
      const ok = await updatePaymentTransactionStatusInFirestore(payment.id, {
        status: newStatus,
        appointmentId: payment.appointmentId
      });
      if (ok) {
        setFeedback({
          type: 'success',
          text:
            newStatus === 'paid'
              ? `تم تأكيد الدفعة (${payment.invoiceNumber}) وتحديث حالة الحجز المرتبط بنجاح.`
              : `تم تحديث حالة العملية (${payment.invoiceNumber}) إلى ${STATUS_META[newStatus].labelAr}.`
        });
        setConfirmRefundId(null);
      } else {
        setFeedback({
          type: 'error',
          text: 'تعذر تحديث حالة العملية. يرجى المحاولة مرة أخرى.'
        });
      }
    } finally {
      setPendingActionId(null);
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'رقم الفاتورة',
      'مرجع البوابة',
      'اسم العميل',
      'اسم الطفل',
      'الجوال',
      'الخدمة / الباقة',
      'المبلغ قبل الضريبة',
      'الضريبة',
      'الإجمالي (SAR)',
      'وسيلة الدفع',
      'الحالة',
      'التاريخ'
    ];
    const rows = filteredPayments.map((p) => [
      p.invoiceNumber,
      p.gatewayPaymentId || p.transferReference || '-',
      p.clientName,
      p.childName || '-',
      p.clientPhone,
      p.serviceTitle,
      String(p.subtotal ?? p.amount),
      String(p.vatAmount ?? 0),
      String(p.amount),
      formatMethodLabel(p.method, true),
      STATUS_META[p.status]?.labelAr || p.status,
      p.createdAtISO || p.createdAt || ''
    ]);
    const csvContent =
      '\uFEFF' +
      [headers, ...rows]
        .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `raba-payments-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isArabic ? 'إجمالي الإيرادات المحصّلة' : 'Total Collected Revenue'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {kpis.totalCollected.toLocaleString('en-US', { maximumFractionDigits: 2 })}{' '}
            <span className="text-xs font-bold text-slate-500">ر.س</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
            {kpis.paidCount} {isArabic ? 'عملية مدفوعة مؤكدة' : 'confirmed payments'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isArabic ? 'تحصيلات اليوم' : "Today's Collections"}
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-500/15 text-[#2E86EB] flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {kpis.todayCollected.toLocaleString('en-US', { maximumFractionDigits: 2 })}{' '}
            <span className="text-xs font-bold text-slate-500">ر.س</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-1">
            {new Date().toLocaleDateString('ar-SA')}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isArabic ? 'مدفوعات قيد الانتظار / المراجعة' : 'Pending Payments'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {kpis.pendingAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}{' '}
            <span className="text-xs font-bold">ر.س</span>
          </div>
          <div className="text-[11px] text-amber-700 dark:text-amber-300 font-bold mt-1">
            {kpis.pendingCount} {isArabic ? 'عملية بانتظار التحقق' : 'awaiting verification'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isArabic ? 'العمليات الفاشلة' : 'Failed Transactions'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {kpis.failedCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-1">
            {isArabic ? 'محاولات دفع لم تكتمل' : 'unsuccessful payment attempts'}
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-700/40 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-700/40 text-rose-800 dark:text-rose-200'
          }`}
        >
          <span>{feedback.text}</span>
          <button type="button" onClick={() => setFeedback(null)} className="cursor-pointer opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter & Export Toolbar + Realtime Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 dark:border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#0B3B36] dark:text-emerald-400" />
              {isArabic ? 'سجل المدفوعات والفواتير المباشر' : 'Real-Time Payments & Invoices Ledger'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isArabic
                ? 'مزامنة لحظية مع Firestore لجميع عمليات الدفع الإلكتروني والتحويلات البنكية.'
                : 'Live Firestore stream of all online payments and bank transfers.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isArabic ? 'بحث برقم الفاتورة، العميل، المرجع...' : 'Search invoice, client, ref...'}
                className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none"
            >
              <option value="all">{isArabic ? 'جميع الحالات' : 'All Statuses'}</option>
              <option value="paid">{isArabic ? 'مدفوع' : 'Paid'}</option>
              <option value="pending">{isArabic ? 'قيد الانتظار' : 'Pending'}</option>
              <option value="manual_review">{isArabic ? 'مراجعة تحويل' : 'Transfer Review'}</option>
              <option value="failed">{isArabic ? 'فشل' : 'Failed'}</option>
              <option value="refunded">{isArabic ? 'مسترجع' : 'Refunded'}</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none"
            >
              <option value="all">{isArabic ? 'كل الوسائل' : 'All Methods'}</option>
              <option value="mada">مدى (mada)</option>
              <option value="creditcard">Visa / Mastercard</option>
              <option value="applepay">Apple Pay</option>
              <option value="stcpay">STC Pay</option>
              <option value="bank_transfer">{isArabic ? 'تحويل بنكي' : 'Bank Transfer'}</option>
            </select>

            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B3B36] hover:bg-[#082925] text-white font-bold cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isArabic ? 'تصدير CSV' : 'Export CSV'}</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="py-3.5 px-4 font-extrabold">رقم الفاتورة / المرجع</th>
                <th className="py-3.5 px-4 font-extrabold">العميل / الطفل</th>
                <th className="py-3.5 px-4 font-extrabold">الخدمة / الباقة / الدورة</th>
                <th className="py-3.5 px-4 font-extrabold">المبلغ (ر.س)</th>
                <th className="py-3.5 px-4 font-extrabold">الوسيلة</th>
                <th className="py-3.5 px-4 font-extrabold">الحالة</th>
                <th className="py-3.5 px-4 font-extrabold">التاريخ</th>
                <th className="py-3.5 px-4 font-extrabold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    {isArabic ? 'جاري تحميل سجل المدفوعات المباشر...' : 'Loading real-time ledger...'}
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <CreditCard className="w-8 h-8 opacity-30" />
                      <span className="font-bold">
                        {isArabic ? 'لا توجد عمليات دفع مطابقة حالياً.' : 'No matching payment transactions found.'}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((tx) => {
                  const meta = STATUS_META[tx.status] || STATUS_META.pending;
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-extrabold text-slate-900 dark:text-white">
                          {tx.invoiceNumber}
                        </div>
                        <div className="font-mono text-[10px] text-slate-500 truncate max-w-[160px]" dir="ltr">
                          {tx.gatewayPaymentId || tx.transferReference || tx.id}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{tx.clientName}</div>
                        <div className="text-[11px] text-slate-500">
                          {tx.childName ? `${tx.childName} • ` : ''}
                          <span dir="ltr">{tx.clientPhone}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {tx.serviceTitle}
                        </div>
                        {tx.mode === 'sandbox' && (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                            [وضع تجريبي Sandbox]
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-900 dark:text-white">
                          {Number(tx.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                          <span className="text-[10px] font-bold text-slate-500">ر.س</span>
                        </div>
                        {tx.vatAmount > 0 && (
                          <div className="text-[10px] text-slate-500">
                            ضريبة: {Number(tx.vatAmount).toFixed(2)} ر.س
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-[11px]">
                          {formatMethodLabel(tx.method, isArabic)}
                          {tx.cardLast4 ? ` ••${tx.cardLast4}` : ''}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${meta.cls}`}
                        >
                          {meta.icon}
                          <span>{isArabic ? meta.labelAr : meta.labelEn}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                        {tx.createdAtISO
                          ? new Date(tx.createdAtISO).toLocaleString('ar-SA', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })
                          : '-'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setSelectedInvoice(tx)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold cursor-pointer"
                            title="عرض الفاتورة الضريبية"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>فاتورة</span>
                          </button>

                          {canManage && (tx.status === 'manual_review' || tx.status === 'pending') && (
                            <button
                              type="button"
                              disabled={pendingActionId === tx.id}
                              onClick={() => void handleStatusChange(tx, 'paid')}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>اعتماد</span>
                            </button>
                          )}

                          {canManage && tx.status === 'paid' && confirmRefundId !== tx.id && (
                            <button
                              type="button"
                              onClick={() => setConfirmRefundId(tx.id)}
                              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-rose-600 font-bold cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {canManage && confirmRefundId === tx.id && (
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                disabled={pendingActionId === tx.id}
                                onClick={() => void handleStatusChange(tx, 'refunded')}
                                className="px-2 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] cursor-pointer"
                              >
                                تأكيد استرجاع
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmRefundId(null)}
                                className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-[10px] font-bold cursor-pointer"
                              >
                                إلغاء
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Arabic VAT Tax Invoice Preview Modal */}
      {selectedInvoice &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[130] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
            dir="rtl"
            onClick={() => setSelectedInvoice(null)}
          >
            <div
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar (hidden in print) */}
              <div className="px-6 py-4 bg-[#0B3B36] text-white flex items-center justify-between print:hidden">
                <div className="flex items-center gap-2.5">
                  <Receipt className="w-5 h-5 text-emerald-300" />
                  <h4 className="font-extrabold text-sm">معاينة الفاتورة الضريبية المبسطة (VAT Invoice)</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة / PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(null)}
                    className="p-1.5 rounded-xl hover:bg-white/15 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Invoice Content */}
              <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-800 dark:text-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
                  <div>
                    <div className="text-lg font-black text-[#0B3B36] dark:text-emerald-400">
                      مركز رابا للرعاية النهارية وتأهيل أطفال التوحد
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Raba Center for Autism Rehabilitation — Riyadh, KSA
                    </div>
                    <div className="mt-2 space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                      <div>
                        الرقم الضريبي (VAT):{' '}
                        <span className="font-mono font-bold">{paymentConfig.clinicTaxNumber || '310000000000003'}</span>
                      </div>
                      {paymentConfig.clinicCommercialReg && (
                        <div>
                          السجل التجاري: <span className="font-mono font-bold">{paymentConfig.clinicCommercialReg}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="sm:text-left">
                    <div className="text-sm font-black text-slate-900 dark:text-white">فاتورة ضريبية مبسطة</div>
                    <div className="font-mono font-extrabold text-[#2E86EB] mt-1">{selectedInvoice.invoiceNumber}</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {selectedInvoice.createdAtISO
                        ? new Date(selectedInvoice.createdAtISO).toLocaleString('ar-SA')
                        : '-'}
                    </div>
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${
                          (STATUS_META[selectedInvoice.status] || STATUS_META.pending).cls
                        }`}
                      >
                        {(STATUS_META[selectedInvoice.status] || STATUS_META.pending).icon}
                        <span>{(STATUS_META[selectedInvoice.status] || STATUS_META.pending).labelAr}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Client & Gateway Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-500">بيانات المستفيد / ولي الأمر</div>
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {selectedInvoice.clientName}
                    </div>
                    {selectedInvoice.childName && <div>الطفل المستفيد: {selectedInvoice.childName}</div>}
                    <div dir="ltr" className="text-right font-mono">{selectedInvoice.clientPhone}</div>
                    {selectedInvoice.fileNumber && <div>رقم الملف: {selectedInvoice.fileNumber}</div>}
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-500">تفاصيل العملية المالية</div>
                    <div>وسيلة الدفع: <span className="font-bold">{formatMethodLabel(selectedInvoice.method, true)}</span></div>
                    <div>
                      مرجع البوابة:{' '}
                      <span className="font-mono font-bold" dir="ltr">
                        {selectedInvoice.gatewayPaymentId || selectedInvoice.transferReference || selectedInvoice.id}
                      </span>
                    </div>
                    {selectedInvoice.verifiedByServer && (
                      <div className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>مؤكدة ومطابقة عبر الخادم</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Itemized Breakdown */}
                <div className="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/70">
                      <tr>
                        <th className="py-2.5 px-4 text-right font-bold">البيان / الخدمة</th>
                        <th className="py-2.5 px-4 text-left font-bold">المبلغ (ر.س)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      <tr>
                        <td className="py-3 px-4 font-bold">{selectedInvoice.serviceTitle}</td>
                        <td className="py-3 px-4 text-left font-mono font-bold">
                          {Number(selectedInvoice.subtotal ?? selectedInvoice.amount).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">
                          ضريبة القيمة المضافة ({selectedInvoice.vatRate ?? paymentConfig.vatRate}%)
                        </td>
                        <td className="py-2.5 px-4 text-left font-mono">
                          {Number(selectedInvoice.vatAmount ?? 0).toFixed(2)}
                        </td>
                      </tr>
                      <tr className="bg-emerald-50/70 dark:bg-emerald-950/30">
                        <td className="py-3 px-4 font-black text-sm text-[#0B3B36] dark:text-emerald-300">
                          الإجمالي المستحق (ريال سعودي)
                        </td>
                        <td className="py-3 px-4 text-left font-mono font-black text-base text-[#0B3B36] dark:text-emerald-300">
                          {Number(selectedInvoice.amount).toFixed(2)} SAR
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Bank Transfer Receipt Image if uploaded */}
                {selectedInvoice.receiptUrl && (
                  <div className="space-y-2 print:hidden">
                    <div className="font-bold text-slate-700 dark:text-slate-300">صورة إيصال التحويل البنكي المرفق:</div>
                    <img
                      src={selectedInvoice.receiptUrl}
                      alt="Bank Transfer Receipt"
                      className="max-h-64 rounded-2xl border border-slate-200 dark:border-white/10 object-contain bg-slate-50"
                    />
                  </div>
                )}

                <div className="text-center text-[11px] text-slate-500 pt-2 border-t border-slate-200/70 dark:border-white/10">
                  هذه فاتورة إلكترونية صادرة آلياً من منصة مركز رابا لتأهيل أطفال التوحد (rabacenters.com) ولا تحتاج إلى توقيع.
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default PaymentsLedger;
