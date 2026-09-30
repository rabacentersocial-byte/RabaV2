import React, { useState, useEffect, useRef } from 'react';
import { 
  SlidersHorizontal, 
  Plus, 
  Upload, 
  Link as LinkIcon, 
  RotateCcw, 
  Trash2, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X, 
  Sparkles, 
  Clock, 
  Layers, 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  ZoomIn, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Mail,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  HeroSlideItem, 
  HeroSliderConfig, 
  getStoredHeroSlides, 
  saveStoredHeroSlides, 
  getStoredHeroSliderConfig, 
  saveStoredHeroSliderConfig, 
  resetHeroSlidesToDefault,
  DEFAULT_HERO_SLIDES
} from '../../data/sliderCustomizer';
import { compressImage } from '../../utils/imageCompressor';
import { BacbBadge, IsoBadge, BhcoeBadge } from '../TrustBadges';
import { useDailyChildrenCounter } from '../../utils/dailyChildrenCounter';

interface SliderManagementTabProps {
  hasPermission?: (perm: any) => boolean;
}

export const SliderManagementTab: React.FC<SliderManagementTabProps> = () => {
  const { isArabic } = useLanguage();

  // State
  const [slides, setSlides] = useState<HeroSlideItem[]>(() => getStoredHeroSlides());
  const [config, setConfig] = useState<HeroSliderConfig>(() => getStoredHeroSliderConfig());
  
  // Dynamic daily children counter (+10 children from 8am to 6pm)
  const { count: dailyChildrenCount } = useDailyChildrenCounter(10);
  
  // Preview State
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isPreviewPaused, setIsPreviewPaused] = useState(false);

  // Edit / Add Modal State
  const [editingSlide, setEditingSlide] = useState<HeroSlideItem | null>(null);
  const [isNewSlide, setIsNewSlide] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Form States
  const [formSrc, setFormSrc] = useState('');
  const [formAlt, setFormAlt] = useState('');
  const [formTitleAr, setFormTitleAr] = useState('');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formSubtitleAr, setFormSubtitleAr] = useState('');
  const [formSubtitleEn, setFormSubtitleEn] = useState('');
  const [formObjectPosition, setFormObjectPosition] = useState<'top' | 'center' | 'bottom'>('top');
  const [formZoomLevel, setFormZoomLevel] = useState<number>(100);
  const [formTagAr, setFormTagAr] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live auto-play for preview box
  useEffect(() => {
    if (!config.autoplay || isPreviewPaused || slides.length <= 1) return;
    const activeSlides = slides.filter((s) => s.active);
    if (activeSlides.length <= 1) return;

    const timer = setInterval(() => {
      setPreviewIndex((prev) => (prev + 1) % activeSlides.length);
    }, (config.intervalSeconds || 4) * 1000);

    return () => clearInterval(timer);
  }, [config.autoplay, config.intervalSeconds, isPreviewPaused, slides]);

  // Keep preview index safe
  const activeSlides = slides.filter((s) => s.active);
  const currentPreviewSlide = activeSlides[previewIndex] || activeSlides[0] || slides[0];

  // Save changes to localStorage
  const updateSlidesState = (newSlides: HeroSlideItem[]) => {
    setSlides(newSlides);
    saveStoredHeroSlides(newSlides);
    showFeedback(isArabic ? 'تم حفظ التعديلات بنجاح' : 'Changes saved successfully');
  };

  const updateConfigState = (newConfig: HeroSliderConfig) => {
    setConfig(newConfig);
    saveStoredHeroSliderConfig(newConfig);
    showFeedback(isArabic ? 'تم تحديث إعدادات السلايدر' : 'Slider settings updated');
  };

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 3500);
  };

  // Reorder actions
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSlides = [...slides];
    const temp = newSlides[index - 1];
    newSlides[index - 1] = newSlides[index];
    newSlides[index] = temp;
    
    // update order numbers
    newSlides.forEach((s, idx) => {
      s.order = idx + 1;
    });
    updateSlidesState(newSlides);
  };

  const handleMoveDown = (index: number) => {
    if (index === slides.length - 1) return;
    const newSlides = [...slides];
    const temp = newSlides[index + 1];
    newSlides[index + 1] = newSlides[index];
    newSlides[index] = temp;

    // update order numbers
    newSlides.forEach((s, idx) => {
      s.order = idx + 1;
    });
    updateSlidesState(newSlides);
  };

  // Toggle active
  const handleToggleActive = (id: string) => {
    const newSlides = slides.map((s) => {
      if (s.id === id) {
        return { ...s, active: !s.active };
      }
      return s;
    });
    updateSlidesState(newSlides);
  };

  // Delete slide
  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) {
      showFeedback(isArabic ? 'لا يمكن حذف الشريحة الأخيرة' : 'Cannot delete the only slide', 'error');
      return;
    }
    const filtered = slides.filter((s) => s.id !== id);
    filtered.forEach((s, idx) => {
      s.order = idx + 1;
    });
    updateSlidesState(filtered);
    if (previewIndex >= filtered.length) {
      setPreviewIndex(0);
    }
    showFeedback(isArabic ? '✓ تم حذف الشريحة بنجاح' : 'Slide deleted successfully');
  };

  // Reset to default
  const handleResetDefaults = () => {
    const reset = resetHeroSlidesToDefault();
    setSlides(reset);
    setConfig(getStoredHeroSliderConfig());
    setPreviewIndex(0);
    showFeedback(isArabic ? '✓ تمت استعادة شرائح العرض الافتراضية بنجاح' : 'Reset to default slides');
  };

  // Open modal for editing
  const handleOpenEdit = (slide: HeroSlideItem) => {
    setEditingSlide(slide);
    setIsNewSlide(false);
    setFormSrc(slide.src);
    setFormAlt(slide.alt || '');
    setFormTitleAr(slide.titleAr || '');
    setFormTitleEn(slide.titleEn || '');
    setFormSubtitleAr(slide.subtitleAr || '');
    setFormSubtitleEn(slide.subtitleEn || '');
    setFormObjectPosition(slide.objectPosition || 'top');
    setFormZoomLevel(slide.zoomLevel || 100);
    setFormTagAr(slide.tagAr || '');
    setIsModalOpen(true);
  };

  // Open modal for creating new slide
  const handleOpenNew = () => {
    setEditingSlide(null);
    setIsNewSlide(true);
    setFormSrc('/specialists/ahmed_abouzeid.jpg');
    setFormAlt(isArabic ? 'شريحة عرض جديدة' : 'New presentation slide');
    setFormTitleAr('');
    setFormTitleEn('');
    setFormSubtitleAr('');
    setFormSubtitleEn('');
    setFormObjectPosition('top');
    setFormZoomLevel(100);
    setFormTagAr('ABA');
    setIsModalOpen(true);
  };

  // Handle image upload from computer
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      // Compress and scale to ensure lightweight ~40KB base64
      const compressedDataUrl = await compressImage(file, 900, 900, 0.82);
      setFormSrc(compressedDataUrl);
      setIsCompressing(false);
    } catch (err) {
      console.error(err);
      setIsCompressing(false);
      showFeedback(isArabic ? 'حدث خطأ أثناء معالجة الصورة' : 'Failed to process image', 'error');
    }
  };

  // Save Modal Form
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSrc.trim()) {
      showFeedback(isArabic ? 'يرجى إدخال رابط أو رفع صورة للشريحة' : 'Please provide an image', 'error');
      return;
    }

    if (isNewSlide) {
      const newSlide: HeroSlideItem = {
        id: `photo-custom-${Date.now()}`,
        src: formSrc,
        alt: formAlt || formTitleAr || 'شريحة مركز رابا',
        titleAr: formTitleAr || (isArabic ? 'كادر رابا الطبي' : 'Raba Specialist'),
        titleEn: formTitleEn || 'Raba Specialist',
        subtitleAr: formSubtitleAr,
        subtitleEn: formSubtitleEn,
        objectPosition: formObjectPosition,
        zoomLevel: formZoomLevel,
        active: true,
        order: slides.length + 1,
        tagAr: formTagAr || 'تأهيل'
      };
      updateSlidesState([...slides, newSlide]);
    } else if (editingSlide) {
      const updated = slides.map((s) => {
        if (s.id === editingSlide.id) {
          return {
            ...s,
            src: formSrc,
            alt: formAlt || formTitleAr || s.alt,
            titleAr: formTitleAr,
            titleEn: formTitleEn,
            subtitleAr: formSubtitleAr,
            subtitleEn: formSubtitleEn,
            objectPosition: formObjectPosition,
            zoomLevel: formZoomLevel,
            tagAr: formTagAr
          };
        }
        return s;
      });
      updateSlidesState(updated);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header with Title & Top CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-[#0B3B36] dark:text-[#00E5BE] text-xs font-black">
              {isArabic ? 'تخصيص الواجهة الرئيسية' : 'Hero Presentation Control'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {isArabic ? 'إدارة صور العرض والشرائح في السلايدر' : 'Hero Slider & Presentation Customization'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isArabic 
              ? 'التحكم الكامل في صور العرض الدائرية، ترتيب ظهور الأخصائيين، ضبط المحاذاة والتقريب، وتفعيل الأختام التقديرية' 
              : 'Customize circular hero slides, specialist ordering, image focal positions, zoom levels, and trust badges'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title={isArabic ? 'استعادة الشرائح الأصلية' : 'Reset to default slides'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isArabic ? 'استعادة الافتراضي' : 'Reset'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenNew}
            className="px-4 py-2 rounded-xl bg-[#0B3B36] hover:bg-[#00E5BE] hover:text-slate-950 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isArabic ? 'إضافة شريحة عرض جديدة' : 'Add New Slide'}</span>
          </button>
        </div>
      </div>

      {/* Floating feedback alert */}
      {feedbackMsg && (
        <div className={`p-3.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg transition-all animate-in fade-in slide-in-from-top-2 ${
          feedbackMsg.type === 'success' 
            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300' 
            : 'bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-300'
        }`}>
          {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* 2. Global Slider Settings Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-4 sm:p-5 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        
        {/* Autoplay Switch */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${config.autoplay ? 'bg-[#00E5BE]/20 text-[#00E5BE]' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
              {config.autoplay ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 dark:text-white block">
                {isArabic ? 'التبديل التلقائي للشرائح' : 'Autoplay Slides'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {config.autoplay ? (isArabic ? 'مفعل (يعمل تلقائياً)' : 'Enabled') : (isArabic ? 'متوقف مؤقتاً' : 'Paused')}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => updateConfigState({ ...config, autoplay: !config.autoplay })}
            className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${config.autoplay ? 'bg-[#00E5BE]' : 'bg-slate-300 dark:bg-slate-700'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${config.autoplay ? 'ltr:translate-x-5 rtl:-translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Transition Speed Interval */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-[#00E5BE] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 dark:text-white block">
                {isArabic ? 'مدة بقاء الشريحة' : 'Slide Duration'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {config.intervalSeconds} {isArabic ? 'ثوانٍ لكل صورة' : 'seconds per slide'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {[3, 4, 5, 6].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => updateConfigState({ ...config, intervalSeconds: sec })}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  config.intervalSeconds === sec 
                    ? 'bg-[#0B3B36] text-white dark:bg-[#00E5BE] dark:text-slate-950 font-black shadow-xs' 
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {/* Outer Badges Visibility Switch */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 dark:text-white block">
                {isArabic ? 'أختام الاعتماد والشهادات' : 'Trust Badges & Seals'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {isArabic ? '+1K أطفال، ISO 9001، BACB' : 'Display over hero frame'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => updateConfigState({ ...config, showBadges: !config.showBadges })}
            className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${config.showBadges ? 'bg-amber-400' : 'bg-slate-300 dark:bg-slate-700'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${config.showBadges ? 'ltr:translate-x-5 rtl:-translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

      </div>

      {/* 3. Live Interactive Hero Slider Preview Panel */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0B1528] to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-white/10 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00E5BE]" />
            <h3 className="text-sm font-black text-white">
              {isArabic ? 'معاينة حية لشكل السلايدر في الواجهة الرئيسية' : 'Live Hero Presentation Preview'}
            </h3>
          </div>
          <span className="text-[11px] font-bold text-slate-400 bg-white/10 px-2.5 py-1 rounded-full">
            {isArabic ? `شريحة ${previewIndex + 1} من ${activeSlides.length}` : `Slide ${previewIndex + 1} of ${activeSlides.length}`}
          </span>
        </div>

        {/* Live Simulation Viewport */}
        <div className="py-6 flex flex-col items-center justify-center">
          
          {/* Circular Frame Mockup matching Screenshot */}
          <div 
            className="relative w-[240px] h-[240px] xs:w-[280px] xs:h-[280px] sm:w-[320px] sm:h-[320px] rounded-full bg-gradient-to-tr from-[#0284C7]/40 via-[#00E5BE]/25 to-sky-400/20 backdrop-blur-2xl border-4 border-white/60 dark:border-white/30 flex items-center justify-center shadow-[0_20px_60px_rgba(2,132,199,0.3)] p-1.5"
            onMouseEnter={() => setIsPreviewPaused(true)}
            onMouseLeave={() => setIsPreviewPaused(false)}
          >
            {/* Inner Circular Image */}
            <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center shadow-inner bg-slate-800">
              {currentPreviewSlide ? (
                <img
                  src={currentPreviewSlide.src}
                  alt={currentPreviewSlide.alt}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    currentPreviewSlide.objectPosition === 'center'
                      ? 'object-center'
                      : currentPreviewSlide.objectPosition === 'bottom'
                      ? 'object-bottom'
                      : 'object-top'
                  }`}
                  style={{
                    transform: `scale(${(currentPreviewSlide.zoomLevel || 100) / 100})`
                  }}
                />
              ) : (
                <div className="text-slate-400 text-xs">لا توجد صور</div>
              )}
            </div>

            {/* Navigation Arrows for Live Testing */}
            {activeSlides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setPreviewIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
                  className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-slate-900 border border-slate-200 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="السابق"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewIndex((prev) => (prev + 1) % activeSlides.length)}
                  className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-slate-900 border border-slate-200 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="التالي"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            )}

            {/* Badges preview matching screenshot */}
            {config.showBadges && (
              <>
                {/* Dynamic Daily Children Counter Badge */}
                <div 
                  className="absolute -top-2 -left-2 sm:-left-6 z-30 bg-emerald-600/90 text-white px-2 py-1 rounded-xl shadow-lg flex items-center gap-1.5 border border-emerald-300/40 text-[10px] font-black"
                  title={isArabic ? 'عداد يومي: يتزايد بمعدل 10 أطفال يومياً بين 8:00 ص و 6:00 م' : 'Daily counter: +10 children throughout the day (8:00 AM - 6:00 PM)'}
                >
                  <span className="min-w-4 h-4 px-1 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[8px] font-bold">
                    +{dailyChildrenCount}
                  </span>
                  <span>{isArabic ? `+${dailyChildrenCount} أطفال جدد اليوم` : `+${dailyChildrenCount} Today`}</span>
                </div>

                {/* Yellow Mail Badge */}
                <div className="absolute -bottom-3 -right-2 sm:-right-4 z-30 bg-white/95 text-slate-900 p-2 rounded-2xl shadow-xl flex items-center gap-2 max-w-[190px] border border-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black flex items-center gap-1">
                      <span>{isArabic ? 'تم استلام طلبك' : 'Request Sent'}</span>
                      <span className="text-emerald-600">✔</span>
                    </div>
                  </div>
                </div>

                {/* BACB seal */}
                <div className="absolute -top-1 left-2 z-20">
                  <BacbBadge className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
              </>
            )}

          </div>

          {/* Current Slide Info Caption below Preview */}
          {currentPreviewSlide && (
            <div className="mt-5 text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-black text-[#00E5BE]">
                <span>{currentPreviewSlide.tagAr || 'كادر رابا'}</span>
                <span>•</span>
                <span>{currentPreviewSlide.titleAr || currentPreviewSlide.alt}</span>
              </div>
              {currentPreviewSlide.subtitleAr && (
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  {currentPreviewSlide.subtitleAr}
                </p>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 4. Slides Management List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#00E5BE]" />
            <span>{isArabic ? 'قائمة شرائح العرض (الترتيب وحالة الظهور)' : 'Slide Order & Visibility'}</span>
            <span className="text-xs font-bold text-slate-400">({slides.length})</span>
          </h3>
          <span className="text-xs text-slate-500">
            {isArabic ? 'استخدم أزرار الأسهم لتقديم أو تأخير الشريحة' : 'Use arrows to re-order slides'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                slide.active 
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 shadow-xs' 
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 dark:border-white/5 opacity-70'
              }`}
            >
              {/* Slide Details Left */}
              <div className="flex items-center gap-3.5 min-w-0">
                
                {/* Order Index Badge */}
                <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-black shrink-0">
                  #{index + 1}
                </div>

                {/* Circular Mini Thumbnail with applied position & zoom */}
                <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-teal-500/30 shrink-0 relative">
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className={`w-full h-full object-cover ${
                      slide.objectPosition === 'center'
                        ? 'object-center'
                        : slide.objectPosition === 'bottom'
                        ? 'object-bottom'
                        : 'object-top'
                    }`}
                    style={{
                      transform: `scale(${(slide.zoomLevel || 100) / 100})`
                    }}
                  />
                </div>

                {/* Text Description */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-black text-slate-900 dark:text-white truncate">
                      {slide.titleAr || slide.alt}
                    </span>
                    {slide.tagAr && (
                      <span className="px-2 py-0.2 rounded-md bg-teal-500/10 text-teal-700 dark:text-[#00E5BE] text-[10px] font-black shrink-0">
                        {slide.tagAr}
                      </span>
                    )}
                    <span className={`px-2 py-0.2 rounded-full text-[10px] font-black shrink-0 ${
                      slide.active 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {slide.active ? (isArabic ? 'معروضة' : 'Active') : (isArabic ? 'مخفية' : 'Hidden')}
                    </span>
                  </div>
                  
                  {slide.subtitleAr && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {slide.subtitleAr}
                    </p>
                  )}

                  <div className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-3">
                    <span>{isArabic ? 'المحاذاة:' : 'Align:'} {slide.objectPosition || 'top'}</span>
                    <span>•</span>
                    <span>{isArabic ? 'التقريب:' : 'Zoom:'} {slide.zoomLevel || 100}%</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons Right */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                {/* Re-order Up */}
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMoveUp(index)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                  title={isArabic ? 'تقديم الشريحة للأعلى' : 'Move Up'}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                {/* Re-order Down */}
                <button
                  type="button"
                  disabled={index === slides.length - 1}
                  onClick={() => handleMoveDown(index)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                  title={isArabic ? 'تأخير الشريحة للأسفل' : 'Move Down'}
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                {/* Toggle Active / Inactive */}
                <button
                  type="button"
                  onClick={() => handleToggleActive(slide.id)}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    slide.active 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600'
                  }`}
                  title={slide.active ? (isArabic ? 'إخفاء الشريحة مؤقتاً' : 'Hide slide') : (isArabic ? 'إظهار الشريحة' : 'Show slide')}
                >
                  {slide.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(slide)}
                  className="px-3 py-1.5 rounded-xl bg-[#0B3B36] hover:bg-[#00E5BE] hover:text-slate-950 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'تخصيص' : 'Edit'}</span>
                </button>

                {/* Delete Slide */}
                <button
                  type="button"
                  onClick={() => handleDeleteSlide(slide.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white transition-all cursor-pointer"
                  title={isArabic ? 'حذف الشريحة' : 'Delete'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 5. Edit / Add Slide Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#00E5BE]/20 text-[#00E5BE]">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {isNewSlide ? (isArabic ? 'إضافة شريحة عرض جديدة' : 'Add New Slide') : (isArabic ? 'تخصيص واقتصاص صورة الشريحة' : 'Customize Slide Image')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isArabic ? 'تغيير الصورة، ضبط تركيز الوجه، وتعديل التقريب والمسميات' : 'Change photo, adjust face crop focal point, and titles'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Circular Preview Box */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-white/5">
              <span className="text-[11px] font-bold text-slate-400 mb-2">
                {isArabic ? 'المعاينة الحية داخل الإطار الدائري:' : 'Live circular preview:'}
              </span>
              
              <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-[#00E5BE] shadow-lg bg-slate-800 flex items-center justify-center">
                {formSrc ? (
                  <img
                    src={formSrc}
                    alt="Preview"
                    className={`w-full h-full object-cover transition-all duration-200 ${
                      formObjectPosition === 'center'
                        ? 'object-center'
                        : formObjectPosition === 'bottom'
                        ? 'object-bottom'
                        : 'object-top'
                    }`}
                    style={{
                      transform: `scale(${formZoomLevel / 100})`
                    }}
                  />
                ) : (
                  <span className="text-xs text-slate-400">لا توجد صورة</span>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSaveModal} className="space-y-4">
              
              {/* Photo Upload / Link Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                  {isArabic ? 'صورة الشريحة (رفع من الجهاز أو رابط مباشر):' : 'Slide Image:'}
                </label>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={formSrc}
                    onChange={(e) => setFormSrc(e.target.value)}
                    placeholder="https://... أو /specialists/..."
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00E5BE]/30 font-mono"
                  />

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isCompressing}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isCompressing ? (isArabic ? 'جاري الضغط...' : 'Compressing...') : (isArabic ? 'رفع صورة' : 'Upload')}</span>
                  </button>
                </div>
              </div>

              {/* Focal Alignment (Top / Center / Bottom) */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                  {isArabic ? 'محاذاة وتركيز الصورة (Focal Point):' : 'Image Focal Alignment:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'top', labelAr: 'أعلى (الوجه والرأس)', labelEn: 'Top (Face)' },
                    { id: 'center', labelAr: 'وسط (منتصف الصورة)', labelEn: 'Center' },
                    { id: 'bottom', labelAr: 'أسفل (الجسم)', labelEn: 'Bottom' }
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => setFormObjectPosition(pos.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        formObjectPosition === pos.id 
                          ? 'bg-[#0B3B36] text-white dark:bg-[#00E5BE] dark:text-slate-950 font-black shadow-xs ring-2 ring-[#00E5BE]/30' 
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {isArabic ? pos.labelAr : pos.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zoom / Scale Level */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5 text-[#00E5BE]" />
                    {isArabic ? 'نسبة التقريب / التكبير (Zoom):' : 'Scale / Zoom Level:'}
                  </span>
                  <span className="font-mono font-bold text-teal-600 dark:text-[#00E5BE]">
                    {formZoomLevel}%
                  </span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="140"
                  step="5"
                  value={formZoomLevel}
                  onChange={(e) => setFormZoomLevel(Number(e.target.value))}
                  className="w-full accent-[#00E5BE] cursor-pointer"
                />
              </div>

              {/* Title & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'اسم الأخصائي / العنوان:' : 'Title / Specialist Name:'}
                  </label>
                  <input
                    type="text"
                    value={formTitleAr}
                    onChange={(e) => setFormTitleAr(e.target.value)}
                    placeholder="أ. أحمد أبو زيد أنور"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00E5BE]/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'تصنيف التخصص (Tag):' : 'Department Tag:'}
                  </label>
                  <input
                    type="text"
                    value={formTagAr}
                    onChange={(e) => setFormTagAr(e.target.value)}
                    placeholder="تحليل السلوك ABA / علاج وظيفي"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00E5BE]/30"
                  />
                </div>
              </div>

              {/* Subtitle / Role */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'المسمى الوظيفي والوصف:' : 'Role Description / Subtitle:'}
                </label>
                <input
                  type="text"
                  value={formSubtitleAr}
                  onChange={(e) => setFormSubtitleAr(e.target.value)}
                  placeholder="المدير العام للبرامج التأهيلية ورئيس قسم ABA"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00E5BE]/30"
                />
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B3B36] hover:bg-[#00E5BE] hover:text-slate-950 text-white text-xs font-black shadow-md cursor-pointer transition-all"
                >
                  {isArabic ? 'حفظ الشريحة' : 'Save Slide'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
