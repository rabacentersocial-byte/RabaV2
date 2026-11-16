import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Image as ImageIcon,
  Sliders,
  Type,
  Sun,
  Moon,
  Trash2,
  Eye,
  Check,
  Wand2,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  getStoredLogoSettings, 
  saveStoredLogoSettings, 
  resetLogoSettingsToDefault, 
  SiteLogoSettings, 
  DEFAULT_LOGO_SETTINGS 
} from '../../data/siteCustomizer';
import { compressImage } from '../../utils/imageCompressor';
import { removeBackgroundFromImage } from '../../utils/backgroundRemover';
import { RabaLogo } from '../RabaLogo';

interface LogoSettingsSubTabProps {
  onFeedback?: (msg: string, type: 'success' | 'error') => void;
}

export const LogoSettingsSubTab: React.FC<LogoSettingsSubTabProps> = ({ onFeedback }) => {
  const { isArabic } = useLanguage();

  // Settings State
  const [settings, setSettings] = useState<SiteLogoSettings>(() => getStoredLogoSettings());
  const [isCompressing, setIsCompressing] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [localFeedback, setLocalFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Live preview state (Theme & Language)
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('dark');
  const [previewLang, setPreviewLang] = useState<'ar' | 'en'>('ar');

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    if (onFeedback) {
      onFeedback(text, type);
    } else {
      setLocalFeedback({ text, type });
      setTimeout(() => setLocalFeedback(null), 3500);
    }
  };

  // Handle Logo Upload from Device
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const dataUrl = await compressImage(file, 600, 600, 0.92);
      setSettings(prev => ({
        ...prev,
        logoSource: 'custom',
        customLogoUrl: dataUrl
      }));
      setIsCompressing(false);
      showMsg(
        isArabic ? '✓ تم رفع صورة الشعار بنجاح' : 'Logo uploaded successfully', 
        'success'
      );
    } catch {
      setIsCompressing(false);
      showMsg(
        isArabic ? 'فشل معالجة صورة الشعار، يرجى اختيار ملف صورة صالح' : 'Failed to process logo image', 
        'error'
      );
    }
  };

  // Background Removal Handler
  const handleAutoRemoveBackground = async () => {
    if (!settings.customLogoUrl) {
      showMsg(
        isArabic ? 'يرجى اختيار صورة أولاً لإزالة خلفيتها' : 'Please upload or select an image first',
        'error'
      );
      return;
    }

    try {
      setIsRemovingBg(true);
      const transparentDataUrl = await removeBackgroundFromImage(settings.customLogoUrl);
      setSettings(prev => ({
        ...prev,
        logoSource: 'custom',
        customLogoUrl: transparentDataUrl
      }));
      setIsRemovingBg(false);
      showMsg(
        isArabic ? '✓ تم إزالة خلفية الصورة تلقائياً وأصبحت شفافة بنجاح!' : 'Background removed successfully and made transparent!',
        'success'
      );
    } catch {
      setIsRemovingBg(false);
      showMsg(
        isArabic ? 'تعذر إزالة الخلفية من هذا الرابط، يرجى رفع الملف مباشرة' : 'Could not remove background from this URL',
        'error'
      );
    }
  };

  // Save changes
  const handleSave = () => {
    saveStoredLogoSettings(settings);
    showMsg(
      isArabic ? '✓ تم حفظ وتطبيق إعدادات الشعار بنجاح على الموقع!' : 'Logo settings saved and applied successfully!',
      'success'
    );
  };

  // Reset to default factory settings
  const handleReset = () => {
    const confirmed = window.confirm(
      isArabic 
        ? 'هل أنت متأكد من استعادة الشعار المعتمد والإعدادات الأصلية؟' 
        : 'Are you sure you want to reset the logo and branding to original defaults?'
    );
    if (!confirmed) return;

    const resetDefaults = resetLogoSettingsToDefault();
    setSettings(resetDefaults);
    showMsg(
      isArabic ? '✓ تمت استعادة إعدادات الشعار الافتراضية بنجاح' : 'Logo reset to default brand configuration',
      'success'
    );
  };

  // Determine current active preset
  const isPuzzleBrainPreset = settings.logoSource === 'custom' && (
    settings.customLogoUrl === '/logo/raba_puzzle_brain.png' || 
    settings.customLogoUrl === '/logo/raba_puzzle_brain.svg' ||
    settings.customLogoUrl === '/uploads/1790358266500_logo_transparent_transparent_png.png' ||
    Boolean(settings.customLogoUrl?.includes('logo_transparent'))
  );
  const isVectorPreset = settings.logoSource === 'vector';
  const isCustomUserUpload = settings.logoSource === 'custom' && !isPuzzleBrainPreset;

  return (
    <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto" dir={isArabic ? 'rtl' : 'ltr'}>

      {/* Local Feedback Toast */}
      {localFeedback && (
        <div className={`p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-bold shadow-md transition-all ${
          localFeedback.type === 'success' 
            ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30' 
            : 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30'
        }`}>
          {localFeedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span>{localFeedback.text}</span>
        </div>
      )}

      {/* Header Info & Actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/15 text-teal-700 dark:text-[#00E5BE]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {isArabic ? 'إدارة الشعار وهوية المركز' : 'Logo & Brand Identity'}
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg border bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20">
              {isPuzzleBrainPreset 
                ? (isArabic ? 'شعار الدماغ الشفاف' : 'Transparent Brain Logo') 
                : isVectorPreset 
                ? (isArabic ? 'الشعار المتجهي SVG' : 'Vector SVG') 
                : (isArabic ? 'شعار مخصص' : 'Custom Image')}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isArabic 
              ? 'تخصيص مبسط واحترافي للشعار وأبعاده، مع التحكم المستقل في إظهار أو إخفاء الجزء النصي بجواره.'
              : 'Simplified and professional logo control, with independent toggle for text beside the logo.'}
          </p>
        </div>

        {/* Action Buttons Top */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
            title={isArabic ? 'استعادة إعدادات الشعار الأصلية' : 'Reset to default'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isArabic ? 'الافتراضي' : 'Reset'}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00E5BE] to-teal-600 hover:from-[#00ffd2] hover:to-teal-500 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isArabic ? 'حفظ وتطبيق الشعار' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. REAL-TIME LIVE PREVIEW (HEADER REPLICA) */}
      {/* ========================================================================= */}
      <div className="bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-teal-600 dark:text-[#00E5BE]" />
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
              {isArabic ? 'المعاينة الحية والمباشرة (Live Header Preview)' : 'Live Header Preview'}
            </h4>
          </div>

          {/* Preview Theme Controls */}
          <div className="flex items-center gap-2">
            <div className="bg-white dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-white/10 flex items-center text-xs font-bold">
              <button
                type="button"
                onClick={() => setPreviewTheme('light')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
                  previewTheme === 'light' 
                    ? 'bg-amber-100 text-amber-900 shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>{isArabic ? 'نهاري' : 'Light'}</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewTheme('dark')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
                  previewTheme === 'dark' 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-sky-400" />
                <span>{isArabic ? 'ليلي' : 'Dark'}</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-white/10 flex items-center text-xs font-bold">
              <button
                type="button"
                onClick={() => setPreviewLang('ar')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                  previewLang === 'ar' 
                    ? 'bg-teal-500/20 text-teal-800 dark:text-[#00E5BE]' 
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                عربي
              </button>
              <button
                type="button"
                onClick={() => setPreviewLang('en')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                  previewLang === 'en' 
                    ? 'bg-teal-500/20 text-teal-800 dark:text-[#00E5BE]' 
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Header Preview Surface */}
        <div className={`p-4 sm:p-6 rounded-xl border transition-all flex items-center justify-between shadow-xs ${
          previewTheme === 'dark' 
            ? 'bg-[#0B1120] border-white/10 text-white' 
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          {/* Logo Area */}
          <div className="flex items-center">
            <RabaLogo
              overrideSettings={settings}
              forceLanguage={previewLang}
              isLight={previewTheme === 'light'}
              variant="compact"
              showSubtitle={settings.showSubtitle}
              showText={settings.showText}
            />
          </div>

          {/* Dummy Nav items to give real context */}
          <div className={`hidden sm:flex items-center gap-3 text-xs pointer-events-none select-none ${
            previewTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            <span>{isArabic ? 'الرئيسية' : 'Home'}</span>
            <span>{isArabic ? 'الخدمات' : 'Services'}</span>
            <span>{isArabic ? 'الباقات' : 'Packages'}</span>
            <span className={`px-3 py-1.5 rounded-lg font-bold ${
              previewTheme === 'dark'
                ? 'bg-teal-500/20 text-[#00E5BE]'
                : 'bg-teal-500/15 text-teal-800'
            }`}>
              {isArabic ? 'احجز الآن' : 'Book'}
            </span>
          </div>
        </div>

        {/* Preview Status Banner */}
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-slate-600 dark:text-slate-300">
            {settings.showText ? (
              <span className="text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {isArabic ? 'الجزء النصي مفعّل ومعروض بجوار الشعار' : 'Text beside logo is active'}
              </span>
            ) : (
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {isArabic 
                  ? '✓ الجزء النصي مخفي حالياً — يظهر الشعار منفرداً بنقاء وعصرية' 
                  : '✓ Text beside logo is hidden — logo stands clean and modern'}
              </span>
            )}
          </span>

          <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
            {isArabic ? 'الحجم:' : 'Size:'} {settings.iconSizePx}px
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTROLS GRID (SIMPLIFIED & PROFESSIONAL) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ------------------------------------------------------------- */}
        {/* CARD 1: LOGO IMAGE & SOURCE SELECTION */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-teal-600 dark:text-[#00E5BE]" />
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {isArabic ? '١. اختيار وضبط الشعار' : '1. Logo Emblem & Source'}
              </h4>
            </div>
            <span className="text-[11px] font-bold text-teal-600 dark:text-[#00E5BE]">
              {isArabic ? 'بدون خلفية' : 'Transparent'}
            </span>
          </div>

          {/* 3 Intuitive Logo Options */}
          <div className="space-y-2.5">
            {/* Option A: Puzzle Brain Transparent Logo (RECOMMENDED) */}
            <button
              type="button"
              onClick={() => setSettings(prev => ({ 
                ...prev, 
                logoSource: 'custom', 
                customLogoUrl: '/logo/raba_puzzle_brain.png',
                iconRounding: 'none'
              }))}
              className={`w-full p-3 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isPuzzleBrainPreset
                  ? 'bg-teal-500/10 border-teal-500 text-teal-950 dark:text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 hover:border-teal-500/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center p-1 border border-white/10 shrink-0">
                  <img src="/logo/raba_puzzle_brain.png" alt="Puzzle Brain" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {isArabic ? 'شعار أحجية الدماغ الملون الشفاف' : 'Colorful Puzzle Brain Logo'}
                    </span>
                    <span className="text-[10px] bg-teal-500/20 text-teal-700 dark:text-[#00E5BE] font-black px-1.5 py-0.5 rounded">
                      {isArabic ? 'المعتمد' : 'Default'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isArabic ? 'مفرغ تماماً بدون أي خلفية، فائق الجودة والوضوح' : 'Fully transparent background, crisp PNG'}
                  </p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                isPuzzleBrainPreset ? 'bg-teal-500 text-slate-950' : 'border border-slate-300 dark:border-white/20'
              }`}>
                {isPuzzleBrainPreset && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>

            {/* Option B: Vector SVG Emblem */}
            <button
              type="button"
              onClick={() => setSettings(prev => ({ 
                ...prev, 
                logoSource: 'vector',
                customLogoUrl: ''
              }))}
              className={`w-full p-3 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isVectorPreset
                  ? 'bg-teal-500/10 border-teal-500 text-teal-950 dark:text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 hover:border-teal-500/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center p-1 border border-white/10 shrink-0">
                  <RabaLogo overrideSettings={{ logoSource: 'vector', showText: false, iconSizePx: 30 }} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {isArabic ? 'شعار المتجهي المعتمد (SVG)' : 'Official Vector SVG'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isArabic ? 'رسم متجهي لا يفقد دقة الألوان إطلاقاً' : 'Mathematical vector curve rendering'}
                  </p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                isVectorPreset ? 'bg-teal-500 text-slate-950' : 'border border-slate-300 dark:border-white/20'
              }`}>
                {isVectorPreset && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>

            {/* Option C: Custom Image Upload with Background Remover */}
            <button
              type="button"
              onClick={() => {
                if (!settings.customLogoUrl || isPuzzleBrainPreset) {
                  fileInputRef.current?.click();
                } else {
                  setSettings(prev => ({ ...prev, logoSource: 'custom' }));
                }
              }}
              className={`w-full p-3 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isCustomUserUpload
                  ? 'bg-teal-500/10 border-teal-500 text-teal-950 dark:text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 hover:border-teal-500/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-1 border border-slate-200 dark:border-white/10 shrink-0">
                  {isCustomUserUpload && settings.customLogoUrl ? (
                    <img src={settings.customLogoUrl} alt="Custom" className="w-full h-full object-contain" />
                  ) : (
                    <Upload className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {isArabic ? 'رفع صورة شعار خاصة من جهازك' : 'Upload Custom Logo Image'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isArabic ? 'مع أداة إزالة الخلفية التلقائية بلمسة زر' : 'Includes 1-click automatic background remover'}
                  </p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                isCustomUserUpload ? 'bg-teal-500 text-slate-950' : 'border border-slate-300 dark:border-white/20'
              }`}>
                {isCustomUserUpload && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>
          </div>

          {/* Custom Logo Details & Background Removal Tool (Visible when Custom is active or selected) */}
          {isCustomUserUpload && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-3 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isCompressing || isRemovingBg}
                  className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {isCompressing 
                      ? (isArabic ? 'جارِ المعالجة...' : 'Processing...') 
                      : (isArabic ? 'تغيير الصورة' : 'Change Image')}
                  </span>
                </button>

                {/* 1-CLICK AUTOMATIC BACKGROUND REMOVER BUTTON */}
                <button
                  type="button"
                  onClick={handleAutoRemoveBackground}
                  disabled={isRemovingBg || isCompressing || !settings.customLogoUrl}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  title={isArabic ? 'إزالة الخلفية البيضاء أو الرمادية وجعل الشعار شفافاً تماماً' : 'Remove background and make logo transparent'}
                >
                  <Wand2 className={`w-3.5 h-3.5 ${isRemovingBg ? 'animate-spin' : ''}`} />
                  <span>
                    {isRemovingBg 
                      ? (isArabic ? 'جارِ إزالة الخلفية...' : 'Removing Background...') 
                      : (isArabic ? 'إزالة الخلفية تلقائياً (شفاف)' : 'Auto Remove Background')}
                  </span>
                </button>
              </div>

              {/* Direct URL input fallback */}
              <div>
                <input
                  type="text"
                  value={settings.customLogoUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, customLogoUrl: e.target.value }))}
                  placeholder={isArabic ? 'رابط مباشر للشعار أو مسار محلي...' : 'Direct image URL or path...'}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-teal-500 font-mono text-left"
                  dir="ltr"
                />
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleLogoUpload}
          />

          {/* Logo Size Control (Simple Presets + Fine Slider) */}
          <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-white/5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">
                {isArabic ? 'حجم الشعار في شريط التنقل:' : 'Logo Size in Navbar:'}
              </span>
              <span className="font-mono text-teal-700 dark:text-[#00E5BE]">
                {settings.iconSizePx}px
              </span>
            </div>

            {/* Clean calibrated size presets */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: isArabic ? 'صغير (38px)' : 'Small (38px)', px: 38 },
                { label: isArabic ? 'قياسي (46px)' : 'Standard (46px)', px: 46 },
                { label: isArabic ? 'كبير (56px)' : 'Large (56px)', px: 56 }
              ].map(preset => (
                <button
                  key={preset.px}
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, iconSizePx: preset.px }))}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer text-center ${
                    settings.iconSizePx === preset.px
                      ? 'bg-teal-500/15 border-teal-500 text-teal-800 dark:text-[#00E5BE]'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Slider */}
            <input
              type="range"
              min="28"
              max="72"
              step="2"
              value={settings.iconSizePx}
              onChange={(e) => setSettings(prev => ({ ...prev, iconSizePx: Number(e.target.value) }))}
              className="w-full accent-teal-500 cursor-pointer pt-1"
            />
          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* CARD 2: TEXT BESIDE LOGO (CUSTOMIZABLE PART) */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-teal-700 dark:text-[#00E5BE]" />
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {isArabic ? '٢. الجزء النصي بجوار الشعار' : '2. Text Beside Logo'}
              </h4>
            </div>

            {/* Master Toggle: Show / Hide Text */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showText}
                onChange={(e) => setSettings(prev => ({ ...prev, showText: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500" />
            </label>
          </div>

          {/* When Text is Hidden (Default state requested by user) */}
          {!settings.showText ? (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 space-y-3 text-center">
              <div className="inline-flex p-2.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-[#00E5BE] mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'الجزء النصي مخفي حالياً (مظهر عصري ونظيف)' : 'Text beside logo is hidden (Clean Modern Look)'}
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {isArabic 
                    ? 'تم إخفاء هذا الجزء بجوار اللوجو بطلبكم لمنح الموقع طابعاً عصرياً وأنيقاً. يمكنك تفعيله وتخصيص كافة النصوص بلمسة زر واحدة في أي وقت.'
                    : 'The text beside the logo is removed as requested for an elegant modern look. You can enable and customize all texts anytime.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSettings(prev => ({ ...prev, showText: true }))}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Type className="w-3.5 h-3.5" />
                <span>{isArabic ? 'تفعيل وتخصيص الجزء النصي' : 'Enable & Customize Text'}</span>
              </button>
            </div>
          ) : (
            /* When Text is Enabled: Customizable Fields */
            <div className="space-y-3.5 animate-in fade-in">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {isArabic 
                  ? 'يمكنك هنا تخصيص اسم المركز والسطر الإضافي باللغتين العربية والإنجليزية:' 
                  : 'Customize the center title and subtitle descriptor in Arabic and English:'}
              </p>

              {/* Arabic Inputs */}
              <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5">
                <span className="text-[11px] font-bold text-teal-700 dark:text-[#00E5BE] block">
                  🇸🇦 {isArabic ? 'النصوص بالعربية' : 'Arabic Text'}
                </span>
                
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'اسم المركز الرئيسي:' : 'Main Center Title:'}
                  </label>
                  <input
                    type="text"
                    value={settings.titleAr}
                    onChange={(e) => setSettings(prev => ({ ...prev, titleAr: e.target.value }))}
                    placeholder="مركز رابا"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-teal-500"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'الوصف الإضافي (السطر الفرعي):' : 'Subtitle Descriptor:'}
                  </label>
                  <input
                    type="text"
                    value={settings.subtitleAr}
                    onChange={(e) => setSettings(prev => ({ ...prev, subtitleAr: e.target.value }))}
                    placeholder="للرعاية النهارية والتأهيل"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-teal-500"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* English Inputs */}
              <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5">
                <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 block">
                  🇬🇧 {isArabic ? 'النصوص بالإنجليزية' : 'English Text'}
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isArabic ? 'الاسم بالإنجليزية:' : 'English Title:'}
                    </label>
                    <input
                      type="text"
                      value={settings.titleEn}
                      onChange={(e) => setSettings(prev => ({ ...prev, titleEn: e.target.value }))}
                      placeholder="RABA"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-teal-500 font-sans"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isArabic ? 'الوصف بالإنجليزية:' : 'English Subtitle:'}
                    </label>
                    <input
                      type="text"
                      value={settings.subtitleEn}
                      onChange={(e) => setSettings(prev => ({ ...prev, subtitleEn: e.target.value }))}
                      placeholder="Center for Day Care & Rehabilitation"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-teal-500 font-sans"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* English Badge Toggle */}
                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showEnglishBadge}
                    onChange={(e) => setSettings(prev => ({ ...prev, showEnglishBadge: e.target.checked }))}
                    className="rounded text-teal-600 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isArabic ? 'إظهار شارة أحرف RABA الملونة بجوار الاسم' : 'Show colored RABA letter badge'}
                  </span>
                </label>
              </div>

              {/* Spacing & Font Size adjustments */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    {isArabic ? 'حجم خط العنوان:' : 'Title Font Size:'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="14"
                      max="24"
                      value={settings.titleFontSizePx}
                      onChange={(e) => setSettings(prev => ({ ...prev, titleFontSizePx: Number(e.target.value) }))}
                      className="w-full accent-teal-500 cursor-pointer"
                    />
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-400 w-8 text-center">{settings.titleFontSizePx}px</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    {isArabic ? 'المسافة عن الشعار:' : 'Spacing from Logo:'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="6"
                      max="24"
                      value={settings.spacingPx}
                      onChange={(e) => setSettings(prev => ({ ...prev, spacingPx: Number(e.target.value) }))}
                      className="w-full accent-teal-500 cursor-pointer"
                    />
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-400 w-8 text-center">{settings.spacingPx}px</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Sticky Bottom Save Actions */}
      <div className="sticky bottom-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-4">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 hidden sm:inline">
          {isArabic ? 'يتم حفظ وتطبيق التعديلات فوراً على كامل الهيدر والصفحات' : 'Changes apply immediately across the entire site'}
        </span>

        <div className="flex items-center gap-2.5 ms-auto">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            {isArabic ? 'استعادة الافتراضي' : 'Reset'}
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00E5BE] to-teal-600 hover:from-[#00ffd2] hover:to-teal-500 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isArabic ? 'حفظ وتطبيق الشعار الآن' : 'Save & Apply Logo'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
