import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  Share2, 
  PlusSquare, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Copy, 
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../context/LanguageContext';

// Clean inline SVGs for Apple and Android brand icons
export const AppleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 384 512" className={`${className} fill-current`} aria-hidden="true">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-91.9-61.7-91.9zm-56.4-164.6c18-22.4 30.6-53.5 27.2-84.1-26.4 1.1-57.1 17.8-75.3 39.1-16.1 18.7-29.8 49.9-26 79.5 29.3 2.3 56.1-12.1 74.1-34.5z" />
  </svg>
);

export const AndroidIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 576 512" className={`${className} fill-current`} aria-hidden="true">
    <path d="M421.3 28.7c-5.8-10.7-19-14.7-29.8-8.9L340.1 47.2C307 36 270.8 30.6 233.1 31.8c-38.2 1.3-74.8 8.1-108.2 20.3L73.5 18.8c-10.7-5.9-24-1.9-29.8 8.9-5.9 10.7-1.9 24 8.9 29.8l52.5 28.7C42.8 126.8 0 197.8 0 279.7h512c0-82-42.8-153-104.9-193.4l52.5-28.7c10.8-5.8 14.8-19.1 8.9-29.8zM144 192c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm224 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm-288 128v128c0 17.7 14.3 32 32 32h16v-64h288v64h16c17.7 0 32-14.3 32-32V320H80z" />
  </svg>
);

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'ios' | 'android';
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  defaultTab
}) => {
  const { isArabic } = useLanguage();
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  
  const [activeTab, setActiveTab] = useState<'ios' | 'android'>(() => {
    if (defaultTab) return defaultTab;
    if (isIOS) return 'ios';
    return 'android';
  });
  
  const [installStatus, setInstallStatus] = useState<'idle' | 'installing' | 'success' | 'dismissed'>('idle');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (defaultTab) {
        setActiveTab(defaultTab);
      } else if (isIOS) {
        setActiveTab('ios');
      } else {
        setActiveTab('android');
      }
    }
  }, [isOpen, defaultTab, isIOS]);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    setInstallStatus('installing');
    try {
      const success = await install();
      if (success) {
        setInstallStatus('success');
      } else {
        setInstallStatus('dismissed');
      }
    } catch {
      setInstallStatus('dismissed');
    }
  };

  const copyPageUrl = () => {
    try {
      navigator.clipboard.writeText(window.location.origin);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // noop
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 w-72 h-36 bg-[#00E5BE]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-60 h-32 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative px-5 pt-5 pb-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00E5BE] to-teal-500 p-0.5 shadow-lg shadow-teal-500/20 shrink-0">
              <div className="w-full h-full rounded-[14px] bg-[#0A1A18] flex items-center justify-center">
                <img 
                  src="/logo/raba_puzzle_brain.png" 
                  alt="Raba Logo" 
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                  {isArabic ? 'تثبيت تطبيق مركز رابا' : 'Install Raba Center Web App'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-emerald-500/15 text-emerald-600 dark:text-[#00E5BE] border border-emerald-500/30">
                  PWA Web App
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isArabic ? 'أضف المنصة لشاشتك الرئيسية كأي تطبيق رسمي' : 'Add to Home Screen for fast native experience'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="px-5 py-4 overflow-y-auto space-y-4 text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
          
          {/* Status banner if already running standalone */}
          {isInstalled && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                {isArabic 
                  ? 'رائع! أنت تتصفح مركز رابا بالفعل كتطبيق مثبت على شاشتك الرئيسية.' 
                  : 'Great! You are already browsing Raba Center as an installed Web App.'}
              </span>
            </div>
          )}

          {/* Quick Direct 1-Click Install Button for Chrome / Android / Desktop (when browser supports beforeinstallprompt) */}
          {isInstallable && !isInstalled && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500/15 via-[#00E5BE]/10 to-transparent border border-[#00E5BE]/40 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs sm:text-sm">
                  <Zap className="w-4 h-4 text-[#00E5BE]" />
                  {isArabic ? 'التثبيت المباشر متاح بنقرة واحدة!' : 'Direct 1-Click Install is Ready!'}
                </span>
                <span className="text-[10px] bg-[#00E5BE]/20 text-[#00a386] dark:text-[#00E5BE] px-2 py-0.5 rounded-md font-semibold">
                  {isArabic ? 'تثبيت فوري' : 'Instant'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {isArabic 
                  ? 'متصفحك يدعم خاصية التثبيت التلقائي دون الحاجة لخطوات يدوية. اضغط على الزر أدناه لتأكيد التثبيت على شاشتك.' 
                  : 'Your browser supports direct installation. Tap below to add Raba Center immediately.'}
              </p>
              <button
                onClick={handleNativeInstall}
                disabled={installStatus === 'installing'}
                className="w-full py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm bg-[#00E5BE] hover:bg-[#00c9a7] text-slate-950 flex items-center justify-center gap-2 shadow-md hover:shadow-teal-500/20 transition-all cursor-pointer active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>
                  {installStatus === 'installing' 
                    ? (isArabic ? 'جارٍ فتح نافذة التثبيت...' : 'Opening prompt...')
                    : (isArabic ? 'تثبيت تطبيق مركز رابا الآن' : 'Install Raba Center App Now')}
                </span>
              </button>
            </div>
          )}

          {/* Platform Tabs: Apple iOS vs Android */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {isArabic ? 'اختر نوع جهازك لعرض طريقة التثبيت خطوة بخطوة:' : 'Select your device type for step-by-step instructions:'}
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-white/[0.05] rounded-2xl border border-slate-200 dark:border-white/10">
              {/* Apple Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'ios'
                    ? 'bg-white dark:bg-teal-500/20 text-slate-900 dark:text-[#00E5BE] shadow-xs border border-slate-200 dark:border-teal-500/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <AppleIcon className="w-4 h-4" />
                <span>{isArabic ? 'جوالات آبل (iOS / iPhone)' : 'Apple (iOS / iPhone)'}</span>
              </button>

              {/* Android Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'android'
                    ? 'bg-white dark:bg-teal-500/20 text-slate-900 dark:text-[#00E5BE] shadow-xs border border-slate-200 dark:border-teal-500/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <AndroidIcon className="w-4 h-4" />
                <span>{isArabic ? 'جوالات أندرويد (Android)' : 'Android Devices'}</span>
              </button>
            </div>
          </div>

          {/* Tab Content: iOS (iPhone / iPad) */}
          {activeTab === 'ios' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed flex items-start gap-2">
                <span className="text-sm shrink-0">💡</span>
                <span>
                  {isArabic 
                    ? 'على جوالات آيفون، يُرجى فتح الرابط عبر متصفح سفاري (Safari) الرسمي لإتاحة خيار الإضافة للشاشة الرئيسية.'
                    : 'On iPhone/iPad, make sure to open the link in the official Safari browser to enable Home Screen addition.'}
                </span>
              </div>

              {/* Step 1 */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-[#00E5BE]/20 text-[#00897B] dark:text-[#00E5BE] font-black flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div className="space-y-1 flex-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs sm:text-sm">
                    <Share2 className="w-3.5 h-3.5 text-sky-500" />
                    <span>{isArabic ? 'اضغط على زر المشاركة (Share)' : 'Tap the Share Button'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isArabic 
                      ? 'في أسفل شاشة متصفح Safari، اضغط على أيقونة المربع مع السهم للأعلى [ ⎋ ].' 
                      : 'At the bottom bar of Safari, tap the Share icon [ ⎋ ] (square with arrow pointing up).'}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-[#00E5BE]/20 text-[#00897B] dark:text-[#00E5BE] font-black flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div className="space-y-1 flex-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs sm:text-sm">
                    <PlusSquare className="w-3.5 h-3.5 text-[#00E5BE]" />
                    <span>{isArabic ? 'اختر "إضافة إلى الشاشة الرئيسية"' : 'Select "Add to Home Screen"'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isArabic 
                      ? 'مرر قائمة الخيارات لأسفل قليلاً واضغط على خيار: "إضافة إلى الصفحة الرئيسية" (Add to Home Screen).' 
                      : 'Scroll down the menu list and tap "Add to Home Screen" (with a square icon).'}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-[#00E5BE]/20 text-[#00897B] dark:text-[#00E5BE] font-black flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div className="space-y-1 flex-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs sm:text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{isArabic ? 'اضغط "إضافة" (Add) في الزاوية العلوية' : 'Tap "Add" in Top Right'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isArabic 
                      ? 'اضغط زر "إضافة" في أعلى يمين الشاشة، وستظهر أيقونة تطبيق مركز رابا فوراً على شاشة جوالك!' 
                      : 'Tap "Add" in the top-right corner. The Raba Center icon will appear right on your home screen!'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Android */}
          {activeTab === 'android' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {/* Direct button fallback for Android */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-[#00E5BE]/20 text-[#00897B] dark:text-[#00E5BE] font-black flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div className="space-y-1 flex-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs sm:text-sm">
                    <span>{isArabic ? 'اضغط قائمة المتصفح (⋮) الثلاث نقاط' : 'Tap Browser Menu (⋮)'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isArabic 
                      ? 'في أعلى يمين أو يسار شاشة متصفح Google Chrome أو Samsung Internet، اضغط على النقاط الثلاث (⋮).' 
                      : 'In Chrome or Samsung Internet, tap the three dots menu icon (⋮) at the top or bottom.'}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-[#00E5BE]/20 text-[#00897B] dark:text-[#00E5BE] font-black flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div className="space-y-1 flex-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs sm:text-sm">
                    <Download className="w-3.5 h-3.5 text-[#00E5BE]" />
                    <span>{isArabic ? 'اختر "تثبيت التطبيق" أو "إضافة للشاشة الرئيسية"' : 'Select "Install App" or "Add to Home Screen"'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isArabic 
                      ? 'اختر خيار "تثبيت التطبيق" (Install App) أو "إضافة إلى الشاشة الرئيسية" (Add to Home screen).' 
                      : 'Tap "Install App" or "Add to Home screen" from the menu options.'}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-[#00E5BE]/20 text-[#00897B] dark:text-[#00E5BE] font-black flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div className="space-y-1 flex-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs sm:text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{isArabic ? 'تأكيد التثبيت' : 'Confirm Installation'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isArabic 
                      ? 'اضغط "تثبيت" (Install)، وستتم إضافة التطبيق لدرج التطبيقات وشاشتك الرئيسية ليعمل بشكل مستقل وسريع.' 
                      : 'Confirm with "Install". The web app will appear on your app drawer and home screen.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Advantages / Benefits of PWA */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/10">
            <div className="text-[11px] font-bold text-slate-900 dark:text-white mb-2">
              {isArabic ? 'مميزات تطبيق الويب (Web App):' : 'Web App Benefits:'}
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <Check className="w-3 h-3 text-[#00E5BE] shrink-0" />
                <span>{isArabic ? 'خفيف جداً وبدون استهلاك للذاكرة' : 'Lightweight & zero storage waste'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <Check className="w-3 h-3 text-[#00E5BE] shrink-0" />
                <span>{isArabic ? 'يعمل بكامل الشاشة مثل التطبيق' : 'Full-screen app-like experience'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <Check className="w-3 h-3 text-[#00E5BE] shrink-0" />
                <span>{isArabic ? 'وصول فوري لحجز الجلسات والعروض' : 'Instant access to bookings & offers'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <Check className="w-3 h-3 text-[#00E5BE] shrink-0" />
                <span>{isArabic ? 'تحديثات لحظية ومجانية بالكامل' : 'Always up-to-date automatically'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-black/20 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={copyPageUrl}
            className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-slate-200/60 dark:bg-white/5 border border-slate-300 dark:border-white/10"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? (isArabic ? 'تم نسخ الرابط!' : 'Copied!') : (isArabic ? 'نسخ رابط المنصة' : 'Copy URL')}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-5 rounded-xl font-bold text-xs bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white transition-colors cursor-pointer"
          >
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
