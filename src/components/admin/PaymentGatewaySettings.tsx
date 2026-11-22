import React, { useEffect, useRef, useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Landmark,
  Percent,
  Globe,
  PlugZap,
  Save,
  Sparkles,
  Layers
} from 'lucide-react';
import {
  DEFAULT_BANK_TRANSFER_CONFIG,
  DEFAULT_PAYMENT_PUBLIC_CONFIG,
  PaymentGatewayAdminConfig,
  PaymentGatewayProvider
} from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  getPaymentSecretsStatusFromFirestore,
  savePaymentGatewayConfigToFirestore,
  savePaymentSecretsToFirestore,
  subscribePaymentGatewayConfig
} from '../../services/firestoreService';
import { getAdminHeaders } from '../../utils/persistentSync';
import { auth } from '../../lib/firebase';

interface PaymentGatewaySettingsProps {
  canManage: boolean;
}

const PROVIDER_CARDS: Array<{
  id: PaymentGatewayProvider;
  titleAr: string;
  titleEn: string;
  badgeAr: string;
  descAr: string;
  descEn: string;
}> = [
  {
    id: 'moyasar',
    titleAr: 'بوابة مُيسّر (Moyasar)',
    titleEn: 'Moyasar Payment Gateway',
    badgeAr: 'المزود الأساسي في السعودية',
    descAr: 'تدعم مدى، فيزا، ماستركارد، Apple Pay، و STC Pay بربط فوري ومعتمد.',
    descEn: 'Primary Saudi gateway supporting mada, Visa/Mastercard, Apple Pay & STC Pay.'
  },
  {
    id: 'tabby',
    titleAr: 'تابي للتقسيط (Tabby)',
    titleEn: 'Tabby Installments',
    badgeAr: 'تقسيط 4 دفعات بدون فوائد',
    descAr: 'تمكين الأسر من تقسيم قيمة الباقات والدورات على 4 دفعات ميسرة.',
    descEn: 'Split rehabilitation packages and training courses into 4 interest-free payments.'
  },
  {
    id: 'tamara',
    titleAr: 'تمارا للتقسيط (Tamara)',
    titleEn: 'Tamara Installments',
    badgeAr: 'تقسيط مرن متوافق مع الشريعة',
    descAr: 'خيار تقسيط إضافي للباقات الشهرية والتقييمات الشاملة.',
    descEn: 'Sharia-compliant installment option for monthly packages and assessments.'
  }
];

export const PaymentGatewaySettings: React.FC<PaymentGatewaySettingsProps> = ({ canManage }) => {
  const { isArabic } = useLanguage();

  const [config, setConfig] = useState<PaymentGatewayAdminConfig>({
    ...DEFAULT_PAYMENT_PUBLIC_CONFIG,
    webhookUrl: typeof window !== 'undefined' ? `${window.location.origin}/api/payments/webhook/moyasar` : '',
    lastConnectionTestStatus: 'untested'
  });

  // Secret inputs are NEVER echoed back from Firestore; admin enters them only to set/rotate
  const [secretKeyInput, setSecretKeyInput] = useState('');
  const [webhookSecretInput, setWebhookSecretInput] = useState('');
  const [tabbySecretInput, setTabbySecretInput] = useState('');
  const [tamaraSecretInput, setTamaraSecretInput] = useState('');

  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

  const [secretsStatus, setSecretsStatus] = useState<{
    hasSecretKey: boolean;
    hasWebhookSecret: boolean;
    hasTabbySecret: boolean;
    hasTamaraSecret: boolean;
    secretKeyMasked?: string;
    webhookSecretMasked?: string;
  }>({
    hasSecretKey: false,
    hasWebhookSecret: false,
    hasTabbySecret: false,
    hasTamaraSecret: false
  });

  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const hydratedRef = useRef(false);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Subscribe live to `finance/payment_gateway_config`
  useEffect(() => {
    const unsub = subscribePaymentGatewayConfig((remote) => {
      if (remote) {
        setConfig((prev) => ({
          ...prev,
          ...remote,
          enabledMethods: {
            ...DEFAULT_PAYMENT_PUBLIC_CONFIG.enabledMethods,
            ...(remote.enabledMethods || {})
          },
          bankTransfer: {
            ...DEFAULT_BANK_TRANSFER_CONFIG,
            ...(remote.bankTransfer || {})
          },
          tabby: {
            ...DEFAULT_PAYMENT_PUBLIC_CONFIG.tabby,
            ...(remote.tabby || {})
          },
          tamara: {
            ...DEFAULT_PAYMENT_PUBLIC_CONFIG.tamara,
            ...(remote.tamara || {})
          },
          webhookUrl:
            remote.webhookUrl ||
            (typeof window !== 'undefined' ? `${window.location.origin}/api/payments/webhook/moyasar` : '')
        }));
      }
      setTimeout(() => {
        hydratedRef.current = true;
      }, 250);
    });

    getPaymentSecretsStatusFromFirestore()
      .then((status) => setSecretsStatus(status))
      .catch(() => {});

    return () => {
      unsub();
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, []);

  const persistConfigNow = async (
    nextConfig: PaymentGatewayAdminConfig,
    includeSecrets = false
  ): Promise<boolean> => {
    if (!canManage) return false;
    setIsSaving(true);
    setSaveFeedback(null);
    try {
      let secretSaved = false;
      const hasSecretInput =
        includeSecrets &&
        Boolean(
          secretKeyInput.trim() ||
            webhookSecretInput.trim() ||
            tabbySecretInput.trim() ||
            tamaraSecretInput.trim()
        );

      if (hasSecretInput) {
        const secretsOk = await savePaymentSecretsToFirestore({
          provider: nextConfig.provider,
          ...(secretKeyInput.trim() ? { secretKey: secretKeyInput.trim() } : {}),
          ...(webhookSecretInput.trim() ? { webhookSecret: webhookSecretInput.trim() } : {}),
          ...(tabbySecretInput.trim() ? { tabbySecretKey: tabbySecretInput.trim() } : {}),
          ...(tamaraSecretInput.trim() ? { tamaraSecretKey: tamaraSecretInput.trim() } : {})
        });
        if (!secretsOk) {
          setSaveFeedback({
            type: 'error',
            text: isArabic
              ? 'تعذر حفظ المفاتيح السرية (يتطلب صلاحية المدير العام Super Admin).'
              : 'Could not save secret credentials (requires Super Admin role).'
          });
          setIsSaving(false);
          return false;
        }
        secretSaved = true;
        setSecretKeyInput('');
        setWebhookSecretInput('');
        setTabbySecretInput('');
        setTamaraSecretInput('');
        const refreshedStatus = await getPaymentSecretsStatusFromFirestore();
        setSecretsStatus(refreshedStatus);
      }

      const ok = await savePaymentGatewayConfigToFirestore({
        ...nextConfig,
        hasSecretKeyConfigured: Boolean(secretsStatus.hasSecretKey || secretKeyInput.trim() || secretSaved),
        hasWebhookSecretConfigured: Boolean(secretsStatus.hasWebhookSecret || webhookSecretInput.trim() || secretSaved)
      });

      if (ok) {
        setSaveFeedback({
          type: 'success',
          text: isArabic
            ? 'تم حفظ ومزامنة إعدادات بوابة الدفع مباشرة مع Firestore بنجاح.'
            : 'Payment gateway configuration saved & synced to Firestore.'
        });
        return true;
      }
      setSaveFeedback({
        type: 'error',
        text: isArabic
          ? 'تعذر حفظ الإعدادات. يرجى التحقق من صلاحيات الحساب والاتصال بالإنترنت.'
          : 'Failed to save configuration. Check permissions and connection.'
      });
      return false;
    } catch {
      setSaveFeedback({
        type: 'error',
        text: isArabic ? 'حدث خطأ غير متوقع أثناء الحفظ.' : 'Unexpected error while saving.'
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Debounced auto-save for non-secret settings
  const scheduleAutoSave = (updated: PaymentGatewayAdminConfig) => {
    if (!canManage || !autoSaveEnabled || !hydratedRef.current) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      void persistConfigNow(updated, false);
    }, 900);
  };

  const updateConfig = (updater: (prev: PaymentGatewayAdminConfig) => PaymentGatewayAdminConfig) => {
    setConfig((prev) => {
      const next = updater(prev);
      scheduleAutoSave(next);
      return next;
    });
  };

  const handleTestConnection = async () => {
    if (!canManage) return;
    setIsTesting(true);
    setTestResult(null);
    try {
      const headers: Record<string, string> = { ...getAdminHeaders() };
      if (auth?.currentUser) {
        try {
          const idToken = await auth.currentUser.getIdToken();
          if (idToken) headers['Authorization'] = `Bearer ${idToken}`;
        } catch {
          // fallback to x-admin-token
        }
      }

      const res = await fetch('/api/payments/test-connection', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          provider: config.provider,
          mode: config.mode,
          publishableKey: config.publishableKey,
          secretKey: secretKeyInput.trim() || undefined
        })
      });

      const data = await res.json().catch(() => ({}));
      const connected = Boolean(data?.connected);
      const message =
        data?.message ||
        (connected
          ? 'تم التحقق من الاتصال بنجاح.'
          : data?.error || 'تعذر التحقق من الاتصال ببوابة الدفع.');

      setTestResult({ ok: connected, message });
      const nextConfig: PaymentGatewayAdminConfig = {
        ...config,
        lastConnectionTestAt: new Date().toISOString(),
        lastConnectionTestStatus: connected ? 'ok' : 'error',
        lastConnectionTestMessage: message
      };
      setConfig(nextConfig);
      await persistConfigNow(nextConfig, false);
    } catch {
      setTestResult({
        ok: false,
        message: isArabic
          ? 'تعذر الوصول إلى نقطة اختبار الاتصال على الخادم.'
          : 'Could not reach connection test endpoint.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopyWebhook = async () => {
    const url =
      config.webhookUrl ||
      (typeof window !== 'undefined' ? `${window.location.origin}/api/payments/webhook/moyasar` : '');
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    } catch {
      // ignore
    }
  };

  const webhookDisplayUrl =
    config.webhookUrl ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}/api/payments/webhook/moyasar`
      : 'https://rabacenters.com/api/payments/webhook/moyasar');

  const keyModeMismatch =
    Boolean(config.publishableKey.trim()) &&
    ((config.mode === 'live' && config.publishableKey.trim().startsWith('pk_test_')) ||
      (config.mode === 'sandbox' && config.publishableKey.trim().startsWith('pk_live_')));

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Master Control & Environment Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#0B3B36] dark:bg-emerald-600/20 text-white dark:text-emerald-300 flex items-center justify-center shrink-0 shadow-sm">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {isArabic ? 'إعدادات بوابات الدفع الإلكتروني' : 'Online Payment Gateway Settings'}
                </h3>
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                    config.isOnlinePaymentEnabled
                      ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                      : 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      config.isOnlinePaymentEnabled ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  {config.isOnlinePaymentEnabled
                    ? isArabic
                      ? 'الدفع الإلكتروني مفعّل'
                      : 'Online Payments Active'
                    : isArabic
                      ? 'الدفع الإلكتروني متوقف (الحجز المباشر فقط)'
                      : 'Online Payments Paused'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {isArabic
                  ? 'تحكم مركزي في بوابة Moyasar وخيارات التقسيط وضريبة القيمة المضافة مع عزل تام للمفاتيح السرية.'
                  : 'Central control for Moyasar, installments, VAT settings, and isolated secret storage.'}
              </p>
            </div>
          </div>

          {/* Master Switch + Mode Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Environment Mode */}
            <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10">
              <button
                type="button"
                disabled={!canManage}
                onClick={() => updateConfig((p) => ({ ...p, mode: 'sandbox' }))}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  config.mode === 'sandbox'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isArabic ? 'التجربة (Sandbox)' : 'Sandbox'}
              </button>
              <button
                type="button"
                disabled={!canManage}
                onClick={() => updateConfig((p) => ({ ...p, mode: 'live' }))}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  config.mode === 'live'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isArabic ? 'الإنتاج (Live)' : 'Live Production'}
              </button>
            </div>

            {/* Master Enable Switch */}
            <button
              type="button"
              disabled={!canManage}
              onClick={() => updateConfig((p) => ({ ...p, isOnlinePaymentEnabled: !p.isOnlinePaymentEnabled }))}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                config.isOnlinePaymentEnabled
                  ? 'bg-[#0B3B36] text-white border-[#0B3B36] shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10'
              }`}
            >
              <span>{isArabic ? 'تفعيل الدفع الإلكتروني' : 'Enable Online Payments'}</span>
              <span
                className={`w-9 h-5 rounded-full relative transition-colors inline-flex items-center px-0.5 ${
                  config.isOnlinePaymentEnabled ? 'bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${
                    config.isOnlinePaymentEnabled
                      ? isArabic
                        ? '-translate-x-4'
                        : 'translate-x-4'
                      : 'translate-x-0'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {config.mode === 'live' && config.isOnlinePaymentEnabled && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-700/40 flex items-center gap-2.5 text-xs text-emerald-900 dark:text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isArabic
                ? 'وضع الإنتاج الحقيقي (Live) مفعّل — جميع المدفوعات يتم التحقق منها حصرياً عبر الخادم باستخدام المفتاح السري ولن تُقبل أي حالة من المتصفح وحده.'
                : 'Live Production Mode active — all payments are strictly verified server-side against Moyasar API.'}
            </span>
          </div>
        )}

        {keyModeMismatch && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-700/40 flex items-center gap-2.5 text-xs text-rose-800 dark:text-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              {isArabic
                ? `تنبيه: المفتاح العام المدخل لا يطابق وضع البيئة الحالي (${config.mode === 'live' ? 'يجب أن يبدأ بـ pk_live_' : 'يجب أن يبدأ بـ pk_test_'}).`
                : `Warning: Publishable key prefix does not match ${config.mode} mode.`}
            </span>
          </div>
        )}
      </div>

      {/* Gateway Provider Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#2E86EB]" />
              {isArabic ? 'اختيار مزود بوابة الدفع وبوابات التقسيط' : 'Payment Gateway & Installment Providers'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isArabic
                ? 'بوابة Moyasar هي البوابة الافتراضية المعتمدة للمملكة، مع حقول قابلة للتوسعة لتفعيل تابي وتمارا.'
                : 'Moyasar is the primary Saudi gateway with extensible Tabby & Tamara installment options.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROVIDER_CARDS.map((card) => {
            const isSelected = config.provider === card.id;
            const isInstallmentEnabled =
              card.id === 'tabby'
                ? Boolean(config.enabledMethods.tabby)
                : card.id === 'tamara'
                  ? Boolean(config.enabledMethods.tamara)
                  : true;
            return (
              <div
                key={card.id}
                onClick={() => canManage && updateConfig((p) => ({ ...p, provider: card.id }))}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#0B3B36] dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm'
                    : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50/60 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {isArabic ? card.titleAr : card.titleEn}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#0B3B36] text-white">
                      {isArabic ? 'المزود المختار' : 'Active'}
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-bold text-[#2E86EB] mb-1.5">{card.badgeAr}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isArabic ? card.descAr : card.descEn}
                </p>
                {card.id !== 'moyasar' && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/70 dark:border-white/10 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      {isArabic ? 'إظهار كخيار تقسيط للعميل' : 'Show in checkout'}
                    </span>
                    <input
                      type="checkbox"
                      disabled={!canManage}
                      checked={isInstallmentEnabled}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        updateConfig((p) => ({
                          ...p,
                          enabledMethods: {
                            ...p.enabledMethods,
                            [card.id]: checked
                          },
                          [card.id]: {
                            ...(p[card.id] || {}),
                            enabled: checked
                          }
                        }));
                      }}
                      className="w-4 h-4 accent-[#0B3B36] cursor-pointer"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Secure Credentials Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#0B3B36] dark:text-emerald-400" />
              {isArabic ? 'بيانات الربط والمفاتيح الأمنية (API Credentials)' : 'Secure API Credentials'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isArabic
                ? 'المفتاح السري ومفتاح Webhook تُحفظ حصرياً في مجموعة payment_secrets المحمية للمدير العام ولا تُعرض للزوار مطلقاً.'
                : 'Secret Key & Webhook Secret are stored exclusively in Super-Admin-only payment_secrets and never exposed publicly.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              {secretsStatus.hasSecretKey
                ? isArabic
                  ? `المفتاح السري محفوظ (${secretsStatus.secretKeyMasked || 'مشفّر'})`
                  : 'Secret Key Stored'
                : isArabic
                  ? 'المفتاح السري غير محفوظ بعد'
                  : 'No Secret Key Saved'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Publishable Key */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              {isArabic ? 'المفتاح العام (Publishable API Key):' : 'Publishable API Key:'}
            </label>
            <input
              type="text"
              dir="ltr"
              disabled={!canManage}
              placeholder={config.mode === 'live' ? 'pk_live_xxxxxxxxxxxxxxxxxxxx' : 'pk_test_xxxxxxxxxxxxxxxxxxxx'}
              value={config.publishableKey}
              onChange={(e) => updateConfig((p) => ({ ...p, publishableKey: e.target.value }))}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs outline-none focus:border-[#2E86EB]"
            />
          </div>

          {/* Currency */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              {isArabic ? 'العملة الافتراضية (Currency):' : 'Default Currency:'}
            </label>
            <select
              disabled={!canManage}
              value={config.currency}
              onChange={(e) => updateConfig((p) => ({ ...p, currency: e.target.value }))}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none"
            >
              <option value="SAR">{isArabic ? 'ريال سعودي (SAR)' : 'Saudi Riyal (SAR)'}</option>
            </select>
          </div>

          {/* Secret Key (Super-Admin-only) */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between mb-1.5">
              <span>{isArabic ? 'المفتاح السري (Secret Key — سري للغاية):' : 'Secret Key (Server-Only):'}</span>
              {secretsStatus.hasSecretKey && (
                <span className="text-[10px] text-emerald-600 font-bold">
                  {isArabic ? 'اتركه فارغاً للإبقاء على المفتاح الحالي' : 'Leave blank to keep current'}
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type={showSecretKey ? 'text' : 'password'}
                dir="ltr"
                disabled={!canManage}
                autoComplete="new-password"
                placeholder={
                  secretsStatus.hasSecretKey
                    ? secretsStatus.secretKeyMasked || 'sk_••••••••••••••••'
                    : config.mode === 'live'
                      ? 'sk_live_xxxxxxxxxxxxxxxxxxxx'
                      : 'sk_test_xxxxxxxxxxxxxxxxxxxx'
                }
                value={secretKeyInput}
                onChange={(e) => setSecretKeyInput(e.target.value)}
                className="w-full p-2.5 pl-10 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs outline-none focus:border-[#2E86EB]"
              />
              <button
                type="button"
                onClick={() => setShowSecretKey((v) => !v)}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Toggle secret visibility"
              >
                {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Webhook Secret */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between mb-1.5">
              <span>{isArabic ? 'مفتاح توقيع Webhook (Webhook Secret):' : 'Webhook Secret Token:'}</span>
              {secretsStatus.hasWebhookSecret && (
                <span className="text-[10px] text-emerald-600 font-bold">
                  {isArabic ? 'محفوظ ومفعّل' : 'Configured'}
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type={showWebhookSecret ? 'text' : 'password'}
                dir="ltr"
                disabled={!canManage}
                autoComplete="new-password"
                placeholder={secretsStatus.webhookSecretMasked || 'whsec_xxxxxxxxxxxxxxxxxxxx'}
                value={webhookSecretInput}
                onChange={(e) => setWebhookSecretInput(e.target.value)}
                className="w-full p-2.5 pl-10 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs outline-none focus:border-[#2E86EB]"
              />
              <button
                type="button"
                onClick={() => setShowWebhookSecret((v) => !v)}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Toggle webhook secret visibility"
              >
                {showWebhookSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Webhook Endpoint URL (Copyable) */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#2E86EB]" />
              {isArabic ? 'رابط إشعارات الدفع (Webhook Callback URL لإضافته في لوحة Moyasar):' : 'Moyasar Webhook URL:'}
            </div>
            <div dir="ltr" className="text-xs font-mono font-bold text-slate-900 dark:text-white truncate mt-1">
              {webhookDisplayUrl}
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyWebhook}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 cursor-pointer"
          >
            {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedWebhook ? (isArabic ? 'تم النسخ' : 'Copied') : isArabic ? 'نسخ الرابط' : 'Copy URL'}</span>
          </button>
        </div>

        {/* Extensible Tabby / Tamara Credentials */}
        {(config.enabledMethods.tabby || config.enabledMethods.tamara) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-200/70 dark:border-white/10 text-xs">
            {config.enabledMethods.tabby && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 space-y-3">
                <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  {isArabic ? 'إعدادات تابي (Tabby)' : 'Tabby Configuration'}
                </div>
                <input
                  type="text"
                  dir="ltr"
                  disabled={!canManage}
                  placeholder="Tabby Public Key (pk_...)"
                  value={config.tabby?.publicKey || ''}
                  onChange={(e) =>
                    updateConfig((p) => ({
                      ...p,
                      tabby: { ...(p.tabby || { enabled: true }), publicKey: e.target.value }
                    }))
                  }
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 font-mono text-xs"
                />
                <input
                  type="text"
                  dir="ltr"
                  disabled={!canManage}
                  placeholder="Merchant Code (e.g. RABA_SA)"
                  value={config.tabby?.merchantCode || ''}
                  onChange={(e) =>
                    updateConfig((p) => ({
                      ...p,
                      tabby: { ...(p.tabby || { enabled: true }), merchantCode: e.target.value }
                    }))
                  }
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 font-mono text-xs"
                />
                <input
                  type="password"
                  dir="ltr"
                  disabled={!canManage}
                  placeholder={secretsStatus.hasTabbySecret ? 'Tabby Secret Saved (leave blank to keep)' : 'Tabby Secret Key'}
                  value={tabbySecretInput}
                  onChange={(e) => setTabbySecretInput(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 font-mono text-xs"
                />
              </div>
            )}

            {config.enabledMethods.tamara && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 space-y-3">
                <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2E86EB]" />
                  {isArabic ? 'إعدادات تمارا (Tamara)' : 'Tamara Configuration'}
                </div>
                <input
                  type="text"
                  dir="ltr"
                  disabled={!canManage}
                  placeholder="Tamara Public Key"
                  value={config.tamara?.publicKey || ''}
                  onChange={(e) =>
                    updateConfig((p) => ({
                      ...p,
                      tamara: { ...(p.tamara || { enabled: true }), publicKey: e.target.value }
                    }))
                  }
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 font-mono text-xs"
                />
                <input
                  type="password"
                  dir="ltr"
                  disabled={!canManage}
                  placeholder={secretsStatus.hasTamaraSecret ? 'Tamara API Token Saved (leave blank to keep)' : 'Tamara API Token'}
                  value={tamaraSecretInput}
                  onChange={(e) => setTamaraSecretInput(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 font-mono text-xs"
                />
              </div>
            )}
          </div>
        )}

        {/* Live Connection Test Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200/70 dark:border-white/10">
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              disabled={!canManage || isTesting}
              onClick={handleTestConnection}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E86EB] hover:bg-[#1D6FD1] disabled:opacity-60 text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer"
            >
              {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlugZap className="w-4 h-4" />}
              <span>{isTesting ? (isArabic ? 'جاري اختبار الاتصال...' : 'Testing...') : isArabic ? 'اختبار الاتصال بالبوابة' : 'Test Gateway Connection'}</span>
            </button>

            {testResult && (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${
                  testResult.ok
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/40'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-700/40'
                }`}
              >
                {testResult.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                <span>{testResult.message}</span>
              </span>
            )}
          </div>

          {config.lastConnectionTestAt && !testResult && (
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {isArabic ? 'آخر اختبار:' : 'Last tested:'}{' '}
              <span className="font-bold">{new Date(config.lastConnectionTestAt).toLocaleString('ar-SA')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Supported Payment Methods + Bank Transfer IBAN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Checkboxes */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#0B3B36] dark:text-emerald-400" />
            {isArabic ? 'وسائل الدفع المتاحة للعملاء' : 'Supported Payment Methods'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { key: 'mada', labelAr: 'بطاقة مدى (mada)', subAr: 'الشبكة السعودية للمدفوعات' },
              { key: 'creditcard', labelAr: 'فيزا / ماستركارد', subAr: 'Visa & Mastercard' },
              { key: 'applepay', labelAr: 'Apple Pay', subAr: 'الدفع السريع لأجهزة Apple' },
              { key: 'stcpay', labelAr: 'STC Pay', subAr: 'محفظة STC الرقمية' },
              { key: 'bank_transfer', labelAr: 'التحويل البنكي (IBAN)', subAr: 'مع رفع صورة إيصال التحويل' }
            ].map((item) => {
              const checked = Boolean((config.enabledMethods as any)[item.key]);
              return (
                <label
                  key={item.key}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    checked
                      ? 'border-[#0B3B36]/40 dark:border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={!canManage}
                    checked={checked}
                    onChange={(e) => {
                      const val = e.target.checked;
                      updateConfig((p) => ({
                        ...p,
                        enabledMethods: {
                          ...p.enabledMethods,
                          [item.key]: val
                        },
                        ...(item.key === 'bank_transfer'
                          ? { bankTransfer: { ...p.bankTransfer, enabled: val } }
                          : {})
                      }));
                    }}
                    className="mt-0.5 w-4 h-4 accent-[#0B3B36] cursor-pointer"
                  />
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white">{item.labelAr}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.subAr}</div>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Bank Transfer Details when enabled */}
          {config.enabledMethods.bank_transfer && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 space-y-3 text-xs mt-2">
              <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[#0B3B36] dark:text-emerald-400" />
                {isArabic ? 'بيانات الحساب البنكي للتحويل (IBAN)' : 'Bank Transfer Details (IBAN)'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">اسم البنك:</label>
                  <input
                    type="text"
                    disabled={!canManage}
                    value={config.bankTransfer.bankNameAr}
                    onChange={(e) =>
                      updateConfig((p) => ({
                        ...p,
                        bankTransfer: { ...p.bankTransfer, bankNameAr: e.target.value }
                      }))
                    }
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">اسم المستفيد:</label>
                  <input
                    type="text"
                    disabled={!canManage}
                    value={config.bankTransfer.accountNameAr}
                    onChange={(e) =>
                      updateConfig((p) => ({
                        ...p,
                        bankTransfer: { ...p.bankTransfer, accountNameAr: e.target.value }
                      }))
                    }
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">رقم الآيبان (IBAN):</label>
                <input
                  type="text"
                  dir="ltr"
                  disabled={!canManage}
                  placeholder="SA00 0000 0000 0000 0000 0000"
                  value={config.bankTransfer.iban}
                  onChange={(e) =>
                    updateConfig((p) => ({
                      ...p,
                      bankTransfer: { ...p.bankTransfer, iban: e.target.value.toUpperCase() }
                    }))
                  }
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">تعليمات التحويل للعميل:</label>
                <textarea
                  rows={2}
                  disabled={!canManage}
                  value={config.bankTransfer.instructionsAr || ''}
                  onChange={(e) =>
                    updateConfig((p) => ({
                      ...p,
                      bankTransfer: { ...p.bankTransfer, instructionsAr: e.target.value }
                    }))
                  }
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* VAT & ZATCA Tax Invoice Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Percent className="w-4 h-4 text-[#2E86EB]" />
            {isArabic ? 'ضريبة القيمة المضافة وبيانات الفاتورة الضريبية (VAT)' : 'VAT & Tax Invoice Settings'}
          </h4>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10">
              <div>
                <div className="font-extrabold text-slate-900 dark:text-white">
                  {isArabic ? 'تطبيق ضريبة القيمة المضافة (VAT)' : 'Enable VAT Calculation'}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isArabic ? 'إظهار تفاصيل الضريبة في نافذة الدفع والفاتورة الضريبية' : 'Display VAT breakdown in checkout & tax invoice'}
                </div>
              </div>
              <input
                type="checkbox"
                disabled={!canManage}
                checked={config.vatEnabled}
                onChange={(e) => updateConfig((p) => ({ ...p, vatEnabled: e.target.checked }))}
                className="w-4 h-4 accent-[#0B3B36] cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {isArabic ? 'نسبة الضريبة (%):' : 'VAT Rate (%):'}
                </label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  step={0.5}
                  disabled={!canManage || !config.vatEnabled}
                  value={config.vatRate}
                  onChange={(e) => updateConfig((p) => ({ ...p, vatRate: Number(e.target.value) || 0 }))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {isArabic ? 'طريقة احتساب السعر:' : 'Price Tax Mode:'}
                </label>
                <select
                  disabled={!canManage || !config.vatEnabled}
                  value={config.isVatInclusive ? 'inclusive' : 'exclusive'}
                  onChange={(e) => updateConfig((p) => ({ ...p, isVatInclusive: e.target.value === 'inclusive' }))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-800 font-bold"
                >
                  <option value="exclusive">{isArabic ? 'الأسعار لا تشمل الضريبة (تُضاف عند الدفع)' : 'Tax Exclusive (+VAT at checkout)'}</option>
                  <option value="inclusive">{isArabic ? 'الأسعار شاملة الضريبة' : 'Tax Inclusive'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                {isArabic ? 'الرقم الضريبي للمركز (VAT Number — 15 رقماً):' : 'Clinic VAT Number:'}
              </label>
              <input
                type="text"
                dir="ltr"
                disabled={!canManage}
                value={config.clinicTaxNumber}
                onChange={(e) => updateConfig((p) => ({ ...p, clinicTaxNumber: e.target.value }))}
                placeholder="310000000000003"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                {isArabic ? 'رقم السجل التجاري (اختياري):' : 'Commercial Registration (Optional):'}
              </label>
              <input
                type="text"
                dir="ltr"
                disabled={!canManage}
                value={config.clinicCommercialReg || ''}
                onChange={(e) => updateConfig((p) => ({ ...p, clinicCommercialReg: e.target.value }))}
                placeholder="1010XXXXXX"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Action Footer */}
      {canManage && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSaveEnabled}
                onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#0B3B36] cursor-pointer"
              />
              <span>{isArabic ? 'حفظ تلقائي للإعدادات العامة' : 'Auto-save non-secret settings'}</span>
            </label>

            {saveFeedback && (
              <span
                className={`text-xs font-bold flex items-center gap-1.5 ${
                  saveFeedback.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {saveFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{saveFeedback.text}</span>
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => void persistConfigNow(config, true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#0B3B36] hover:bg-[#082925] dark:bg-[#047857] dark:hover:bg-[#065F46] disabled:opacity-60 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>
              {isSaving
                ? isArabic
                  ? 'جاري الحفظ والمزامنة...'
                  : 'Saving...'
                : isArabic
                  ? 'حفظ إعدادات البوابة والمفاتيح السرية'
                  : 'Save Gateway Settings & Secrets'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentGatewaySettings;
