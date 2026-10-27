import React, { useState, useEffect, useTransition } from 'react';
import { 
  Activity, 
  Code2, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  Info,
  Terminal,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { TrackingPixelsConfig, DEFAULT_TRACKING_PIXELS } from '../../types';
import { getStoredTrackingPixels, saveStoredTrackingPixels } from '../../utils/trackingPixels';

interface TrackingPixelSettingsProps {
  hasPermission?: (perm: any) => boolean;
}

export const TrackingPixelSettings: React.FC<TrackingPixelSettingsProps> = () => {
  const { isArabic } = useLanguage();
  const [isPending, startTransition] = useTransition();

  // State matching the required specifications
  const [pixels, setPixels] = useState<TrackingPixelsConfig>(() => getStoredTrackingPixels());
  const [isLoading, setIsLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch existing settings on mount from GET /api/admin/tracking-pixels
  useEffect(() => {
    let isMounted = true;
    async function fetchPixels() {
      try {
        const res = await fetch('/api/admin/tracking-pixels');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            setPixels(json.data);
            saveStoredTrackingPixels(json.data);
          }
        }
      } catch (err) {
        console.warn('[TrackingPixels] Server fetch notice (using local storage cache):', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchPixels();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopy = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Form Submit Handler utilizing React 19 useTransition
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSaveSuccess(null);

    startTransition(async () => {
      try {
        // 1. Immediately persist locally for zero-latency client state
        saveStoredTrackingPixels(pixels);

        // 2. Submit to server endpoint POST /api/admin/tracking-pixels
        const response = await fetch('/api/admin/tracking-pixels', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pixels)
        });

        if (!response.ok) {
          throw new Error(isArabic ? 'فشل حفظ إعدادات البيكسل على الخادم' : 'Failed to save tracking pixels on server');
        }

        const result = await response.json();
        if (result.success) {
          setSaveSuccess(isArabic ? '✓ تم حفظ إعدادات أكواد التتبع وتحديث الموقع بنجاح' : '✓ Tracking pixel configurations saved and activated successfully!');
        } else {
          setSaveSuccess(isArabic ? '✓ تم الحفظ محلياً وتفعيل الأكواد بنجاح' : '✓ Saved locally and active!');
        }
      } catch (err: any) {
        setSaveSuccess(isArabic ? '✓ تم حفظ وتفعيل الإعدادات في متصفح العميل' : '✓ Saved locally in client storage!');
      } finally {
        setTimeout(() => setSaveSuccess(null), 4000);
      }
    });
  };

  const handleResetToDefault = () => {
    if (window.confirm(isArabic ? 'هل أنت متأكد من رغبتك في إعادة ضبط إعدادات البيكسل إلى الحالة الافتراضية؟' : 'Are you sure you want to reset all tracking pixel settings?')) {
      setPixels(DEFAULT_TRACKING_PIXELS);
      saveStoredTrackingPixels(DEFAULT_TRACKING_PIXELS);
      setSaveSuccess(isArabic ? 'تمت استعادة الإعدادات الافتراضية بنجاح' : 'Reset to default configuration successfully');
      setTimeout(() => setSaveSuccess(null), 3000);
    }
  };

  // Quick summary counts
  const activeCount = [
    pixels.meta.is_active && pixels.meta.id,
    pixels.tiktok.is_active && pixels.tiktok.id,
    pixels.snapchat.is_active && pixels.snapchat.id,
    pixels.gtm.is_active && pixels.gtm.id,
    pixels.custom_head.is_active && pixels.custom_head.script,
    pixels.custom_body.is_active && pixels.custom_body.script
  ].filter(Boolean).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* 1. Header Banner with Liquid Glass Aesthetic */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0B1A2F] to-slate-900 text-white border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-32 bg-[#2E86EB]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-32 bg-[#22C55E]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-[#4A9CFF] text-[11px] font-black border border-blue-500/30 flex items-center gap-1.5 shadow-2xs">
                <Activity className="w-3.5 h-3.5" />
                <span>{isArabic ? 'إدارة أكواد الإعلانات والتحليلات' : 'Analytics & Conversion Tracking'}</span>
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeCount > 0 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-slate-700 text-slate-300'
              }`}>
                {activeCount} {isArabic ? 'بكسل نشط' : 'Active Pixels'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isArabic ? 'إعدادات التتبع والبيكسل (Tracking Pixels)' : 'Tracking Pixels & Analytics Management'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed font-medium">
              {isArabic 
                ? 'إدارة وربط بيكسل ميتا (فيسبوك)، تيك توك، سناب شات، Google Tag Manager، وإضافة أكواد الهيد والبودي المخصصة مع إمكانية التفعيل والإيقاف الفوري دون حذف المعرفات.'
                : 'Manage and connect Meta, TikTok, Snapchat, Google Tag Manager pixels, and custom head/body scripts with instant toggles without clearing stored IDs.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title={isArabic ? 'استعادة الافتراضي' : 'Reset to default'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isArabic ? 'استعادة الافتراضي' : 'Reset'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Feedback Alert Banners */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 3. Main Configuration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Section A: Major Advertising Platforms (Meta, TikTok, Snapchat, GTM) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-white/10 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-[#2E86EB] flex items-center justify-center font-bold">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {isArabic ? 'منصات الإعلانات والتحويلات الرئيسية' : 'Primary Ad Conversion Pixels'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {isArabic ? 'أدخل معرّف البيكسل الخاص بكل منصة دون الحاجة لنسخ السكربت البرمجي الكامل' : 'Enter the Pixel ID for each platform directly'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            
            {/* 1. Meta (Facebook & Instagram) Pixel */}
            <div className={`p-4 rounded-2xl border transition-all ${
              pixels.meta.is_active 
                ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800/60 shadow-xs' 
                : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-white/5 opacity-80'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#0866FF] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    f
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 dark:text-white block">
                      {isArabic ? 'بيكسل ميتا (Meta / Facebook)' : 'Meta (Facebook) Pixel'}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Facebook, Instagram & Messenger Ads
                    </span>
                  </div>
                </div>

                {/* Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={pixels.meta.is_active}
                    onChange={(e) => setPixels({
                      ...pixels,
                      meta: { ...pixels.meta, is_active: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0866FF]" />
                </label>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'معرّف البيكسل (Meta Pixel ID):' : 'Pixel ID:'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="e.g. 123456789012345"
                    value={pixels.meta.id}
                    onChange={(e) => setPixels({
                      ...pixels,
                      meta: { ...pixels.meta, id: e.target.value }
                    })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                  {pixels.meta.id && (
                    <button
                      type="button"
                      onClick={() => handleCopy(pixels.meta.id, 'meta')}
                      className="absolute end-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      title={isArabic ? 'نسخ' : 'Copy'}
                    >
                      {copiedId === 'meta' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10px]">
                  <span className={pixels.meta.is_active ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'}>
                    {pixels.meta.is_active ? (isArabic ? '● نشط ويتم التتبع' : '● Active & tracking') : (isArabic ? '○ معطل مؤقتاً' : '○ Paused')}
                  </span>
                  <a 
                    href="https://adsmanager.facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-blue-500 flex items-center gap-0.5"
                  >
                    <span>Ads Manager</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* 2. TikTok Pixel */}
            <div className={`p-4 rounded-2xl border transition-all ${
              pixels.tiktok.is_active 
                ? 'bg-pink-50/50 dark:bg-pink-950/20 border-pink-300 dark:border-pink-800/60 shadow-xs' 
                : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-white/5 opacity-80'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold text-xs shadow-xs border border-white/20">
                    <span className="text-[#00F2FE]">T</span>
                    <span className="text-[#FE2C55]">K</span>
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 dark:text-white block">
                      {isArabic ? 'بيكسل تيك توك (TikTok Pixel)' : 'TikTok Pixel'}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      TikTok Ads Manager Events API
                    </span>
                  </div>
                </div>

                {/* Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={pixels.tiktok.is_active}
                    onChange={(e) => setPixels({
                      ...pixels,
                      tiktok: { ...pixels.tiktok, is_active: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FE2C55]" />
                </label>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'معرّف بيكسل تيك توك (TikTok Pixel ID):' : 'Pixel ID:'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="e.g. C123456789012345678"
                    value={pixels.tiktok.id}
                    onChange={(e) => setPixels({
                      ...pixels,
                      tiktok: { ...pixels.tiktok, id: e.target.value }
                    })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/40"
                  />
                  {pixels.tiktok.id && (
                    <button
                      type="button"
                      onClick={() => handleCopy(pixels.tiktok.id, 'tiktok')}
                      className="absolute end-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      title={isArabic ? 'نسخ' : 'Copy'}
                    >
                      {copiedId === 'tiktok' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10px]">
                  <span className={pixels.tiktok.is_active ? 'text-[#FE2C55] font-bold' : 'text-slate-400'}>
                    {pixels.tiktok.is_active ? (isArabic ? '● نشط ويتم التتبع' : '● Active & tracking') : (isArabic ? '○ معطل مؤقتاً' : '○ Paused')}
                  </span>
                  <a 
                    href="https://ads.tiktok.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-pink-500 flex items-center gap-0.5"
                  >
                    <span>TikTok Ads</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* 3. Snapchat Pixel */}
            <div className={`p-4 rounded-2xl border transition-all ${
              pixels.snapchat.is_active 
                ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60 shadow-xs' 
                : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-white/5 opacity-80'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FFFC00] text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs border border-amber-300">
                    👻
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 dark:text-white block">
                      {isArabic ? 'بيكسل سناب شات (Snapchat Pixel)' : 'Snapchat Pixel'}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Snap Ads Conversions & Events
                    </span>
                  </div>
                </div>

                {/* Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={pixels.snapchat.is_active}
                    onChange={(e) => setPixels({
                      ...pixels,
                      snapchat: { ...pixels.snapchat, is_active: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400" />
                </label>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'معرّف بيكسل سناب شات (Snap Pixel ID):' : 'Pixel ID:'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="e.g. 12345678-abcd-ef01-2345-6789abcdef01"
                    value={pixels.snapchat.id}
                    onChange={(e) => setPixels({
                      ...pixels,
                      snapchat: { ...pixels.snapchat, id: e.target.value }
                    })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                  />
                  {pixels.snapchat.id && (
                    <button
                      type="button"
                      onClick={() => handleCopy(pixels.snapchat.id, 'snapchat')}
                      className="absolute end-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      title={isArabic ? 'نسخ' : 'Copy'}
                    >
                      {copiedId === 'snapchat' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10px]">
                  <span className={pixels.snapchat.is_active ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-400'}>
                    {pixels.snapchat.is_active ? (isArabic ? '● نشط ويتم التتبع' : '● Active & tracking') : (isArabic ? '○ معطل مؤقتاً' : '○ Paused')}
                  </span>
                  <a 
                    href="https://ads.snapchat.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-amber-500 flex items-center gap-0.5"
                  >
                    <span>Snap Ads</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* 4. Google Tag Manager (GTM) */}
            <div className={`p-4 rounded-2xl border transition-all ${
              pixels.gtm.is_active 
                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 shadow-xs' 
                : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-white/5 opacity-80'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#246FDB] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    GTM
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 dark:text-white block">
                      {isArabic ? 'مدير علامات جوجل (Google Tag Manager)' : 'Google Tag Manager'}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      GA4, Google Ads & Custom Tags
                    </span>
                  </div>
                </div>

                {/* Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={pixels.gtm.is_active}
                    onChange={(e) => setPixels({
                      ...pixels,
                      gtm: { ...pixels.gtm, is_active: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                </label>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'معرّف الحاوية (GTM Container ID):' : 'Container ID:'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="e.g. GTM-XXXXXXX"
                    value={pixels.gtm.id}
                    onChange={(e) => setPixels({
                      ...pixels,
                      gtm: { ...pixels.gtm, id: e.target.value }
                    })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                  {pixels.gtm.id && (
                    <button
                      type="button"
                      onClick={() => handleCopy(pixels.gtm.id, 'gtm')}
                      className="absolute end-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      title={isArabic ? 'نسخ' : 'Copy'}
                    >
                      {copiedId === 'gtm' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10px]">
                  <span className={pixels.gtm.is_active ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'}>
                    {pixels.gtm.is_active ? (isArabic ? '● نشط ويتم التتبع' : '● Active & tracking') : (isArabic ? '○ معطل مؤقتاً' : '○ Paused')}
                  </span>
                  <a 
                    href="https://tagmanager.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-emerald-500 flex items-center gap-0.5"
                  >
                    <span>Tag Manager</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Section B: Custom Header & Body Scripts (Monospace Dark Textareas) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-white/10 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {isArabic ? 'أكواد وسكربتات التتبع المخصصة (Custom Scripts)' : 'Arbitrary Custom Scripts'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {isArabic 
                    ? 'إدراج سكربتات HTML / JavaScript مخصصة في منطقة الرأس <head> أو جسم الصفحة <body> مباشرة'
                    : 'Inject raw HTML/JS scripts directly into <head> or <body> tags'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            
            {/* Custom Head Script */}
            <div className={`p-4 rounded-2xl border transition-all ${
              pixels.custom_head.is_active 
                ? 'bg-purple-50/30 dark:bg-purple-950/15 border-purple-300 dark:border-purple-800/60 shadow-xs' 
                : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-white/5 opacity-80'
            }`}>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {isArabic ? 'سكربت الرأس المخصص (Custom <head> Script):' : 'Custom <head> Script:'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold ${pixels.custom_head.is_active ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`}>
                    {pixels.custom_head.is_active ? (isArabic ? 'مُفعّل' : 'Active') : (isArabic ? 'مُعطّل' : 'Disabled')}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={pixels.custom_head.is_active}
                      onChange={(e) => setPixels({
                        ...pixels,
                        custom_head: { ...pixels.custom_head, is_active: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
                  </label>
                </div>
              </div>

              <textarea
                dir="ltr"
                rows={4}
                value={pixels.custom_head.script}
                onChange={(e) => setPixels({
                  ...pixels,
                  custom_head: { ...pixels.custom_head, script: e.target.value }
                })}
                placeholder="<!-- Paste your custom <script> tags here -->"
                className="w-full p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 leading-relaxed shadow-inner"
              />
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                {isArabic ? 'سيتم تضمين هذا الكود بأمان داخل وسم <head> في جميع صفحات الموقع.' : 'Injected inside the HTML <head> element.'}
              </p>
            </div>

            {/* Custom Body Script */}
            <div className={`p-4 rounded-2xl border transition-all ${
              pixels.custom_body.is_active 
                ? 'bg-purple-50/30 dark:bg-purple-950/15 border-purple-300 dark:border-purple-800/60 shadow-xs' 
                : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-white/5 opacity-80'
            }`}>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {isArabic ? 'سكربت جسم الصفحة المخصص (Custom <body> Script):' : 'Custom <body> Script:'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold ${pixels.custom_body.is_active ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`}>
                    {pixels.custom_body.is_active ? (isArabic ? 'مُفعّل' : 'Active') : (isArabic ? 'مُعطّل' : 'Disabled')}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={pixels.custom_body.is_active}
                      onChange={(e) => setPixels({
                        ...pixels,
                        custom_body: { ...pixels.custom_body, is_active: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
                  </label>
                </div>
              </div>

              <textarea
                dir="ltr"
                rows={4}
                value={pixels.custom_body.script}
                onChange={(e) => setPixels({
                  ...pixels,
                  custom_body: { ...pixels.custom_body, script: e.target.value }
                })}
                placeholder="<!-- Paste your custom tracking <iframe>, <noscript>, or JS tags for <body> here -->"
                className="w-full p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 leading-relaxed shadow-inner"
              />
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                {isArabic ? 'سيتم تضمين هذا الكود في نهاية وسم <body> قبل إغلاق الصفحة.' : 'Injected just before closing </body> element.'}
              </p>
            </div>

          </div>
        </div>

        {/* 4. Action Buttons Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              {isArabic 
                ? 'يتم تطبيق الأكواد النشطة وحفظها فوريًا على الموقع والخادم بمجرد النقر على حفظ.'
                : 'Changes are applied in real-time across the client and synced with server storage.'}
            </span>
          </div>

          <button
            type="submit"
            disabled={isPending || isLoading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0B3B36] to-[#00E5BE] hover:opacity-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isArabic ? 'جارِ الحفظ والتفعيل...' : 'Saving...'}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isArabic ? 'حفظ وتفعيل أكواد التتبع' : 'Save & Activate Pixels'}</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};

export default TrackingPixelSettings;
