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
  Star,
  Tag,
  Megaphone,
  Briefcase,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useLiveDataOptional } from '../../context/LiveDataContext';
import { 
  HeroSlideItem, 
  HeroSliderConfig, 
  getStoredHeroSlides, 
  saveStoredHeroSlides, 
  getStoredHeroSliderConfig, 
  saveStoredHeroSliderConfig, 
  resetHeroSlidesToDefault,
  DEFAULT_HERO_SLIDER_CONFIG
} from '../../data/sliderCustomizer';
import { compressImage } from '../../utils/imageCompressor';
import { useDailyChildrenCounter } from '../../utils/dailyChildrenCounter';
import { uploadAttachmentToServer } from '../../utils/persistentSync';
import {
  syncSlidersCollectionToFirestore,
  saveSliderConfigToFirestore,
  deleteSliderFromFirestore
} from '../../services/firestoreService';

interface SliderManagementTabProps {
  hasPermission?: (perm: any) => boolean;
  isSystemAdmin?: boolean;
}

export const SliderManagementTab: React.FC<SliderManagementTabProps> = ({ isSystemAdmin = false }) => {
  const { isArabic } = useLanguage();
  const liveData = useLiveDataOptional();

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

  // Modal Form States (Dedicated to Service & Promotional Images)
  const [formSlideType, setFormSlideType] = useState<'service' | 'offer' | 'announcement'>('service');
  const [formSrc, setFormSrc] = useState('');
  const [formAlt, setFormAlt] = useState('');
  const [formTitleAr, setFormTitleAr] = useState('');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formSubtitleAr, setFormSubtitleAr] = useState('');
  const [formSubtitleEn, setFormSubtitleEn] = useState('');
  const [formObjectPosition, setFormObjectPosition] = useState<'top' | 'center' | 'bottom'>('top');
  const [formZoomLevel, setFormZoomLevel] = useState<number>(100);
  const [formTagAr, setFormTagAr] = useState('');
  const [formTagEn, setFormTagEn] = useState('');
  const [formCtaUrl, setFormCtaUrl] = useState('');
  const [formCtaTextAr, setFormCtaTextAr] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hydrate live from Firestore via LiveDataContext when modals are closed
  useEffect(() => {
    if (isModalOpen || isResetConfirmOpen) return;
    if (liveData?.isAuthoritativeSliders && liveData.heroSlides) {
      setSlides(liveData.heroSlides);
    }
    if (liveData?.heroConfig) {
      setConfig(liveData.heroConfig);
    }
  }, [liveData?.heroSlides, liveData?.heroConfig, liveData?.isAuthoritativeSliders, isModalOpen, isResetConfirmOpen]);

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

  // Save changes to localStorage & Firestore collection
  const updateSlidesState = (newSlides: HeroSlideItem[]) => {
    setSlides(newSlides);
    saveStoredHeroSlides(newSlides);
    void syncSlidersCollectionToFirestore(newSlides, config);
  };

  const updateConfigState = (newConfig: HeroSliderConfig) => {
    setConfig(newConfig);
    saveStoredHeroSliderConfig(newConfig);
    void saveSliderConfigToFirestore(newConfig);
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
    
    newSlides.forEach((s, idx) => {
      s.order = idx + 1;
    });
    updateSlidesState(newSlides);
    showFeedback(isArabic ? 'تم تحديث ترتيب الشريحة للأعلى' : 'Slide moved up');
  };

  const handleMoveDown = (index: number) => {
    if (index === slides.length - 1) return;
    const newSlides = [...slides];
    const temp = newSlides[index + 1];
    newSlides[index + 1] = newSlides[index];
    newSlides[index] = temp;

    newSlides.forEach((s, idx) => {
      s.order = idx + 1;
    });
    updateSlidesState(newSlides);
    showFeedback(isArabic ? 'تم تحديث ترتيب الشريحة للأسفل' : 'Slide moved down');
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
    showFeedback(isArabic ? 'تم تغيير حالة ظهور الشريحة' : 'Slide visibility updated');
  };

  // Delete slide (System Admin only)
  const handleDeleteSlide = (id: string) => {
    if (!isSystemAdmin) return;
    if (slides.length <= 1) {
      showFeedback(isArabic ? 'لا يمكن حذف الشريحة الأخيرة' : 'Cannot delete the only slide', 'error');
      return;
    }
    const filtered = slides.filter((s) => s.id !== id);
    filtered.forEach((s, idx) => {
      s.order = idx + 1;
    });
    void deleteSliderFromFirestore(id);
    updateSlidesState(filtered);
    if (previewIndex >= filtered.length) {
      setPreviewIndex(0);
    }
    showFeedback(isArabic ? '✓ تم حذف الشريحة بنجاح' : 'Slide deleted successfully');
  };

  // Reset to default
  const handleResetDefaults = () => {
    setIsResetConfirmOpen(true);
  };

  const handleConfirmResetDefaults = () => {
    const reset = resetHeroSlidesToDefault();
    const defaultCfg = { ...DEFAULT_HERO_SLIDER_CONFIG };
    setSlides(reset);
    setConfig(defaultCfg);
    saveStoredHeroSliderConfig(defaultCfg);
    void syncSlidersCollectionToFirestore(reset, defaultCfg);
    setPreviewIndex(0);
    setIsResetConfirmOpen(false);
    showFeedback(isArabic ? '✓ تمت استعادة شرائح الخدمات والعروض الافتراضية' : 'Reset to default slides');
  };

  // Open modal for editing existing slide
  const handleOpenEdit = (slide: HeroSlideItem) => {
    setEditingSlide(slide);
    setIsNewSlide(false);
    setFormSlideType(slide.slideType || (slide.tagAr?.includes('عرض') || slide.tagAr?.includes('خصم') ? 'offer' : 'service'));
    setFormSrc(slide.src);
    setFormAlt(slide.alt || '');
    setFormTitleAr(slide.titleAr || '');
    setFormTitleEn(slide.titleEn || '');
    setFormSubtitleAr(slide.subtitleAr || '');
    setFormSubtitleEn(slide.subtitleEn || '');
    setFormObjectPosition(slide.objectPosition || 'top');
    setFormZoomLevel(slide.zoomLevel || 100);
    setFormTagAr(slide.tagAr || '');
    setFormTagEn(slide.tagEn || '');
    setFormCtaUrl(slide.ctaUrl || '');
    setFormCtaTextAr(slide.ctaTextAr || '');
    setFormActive(slide.active !== false);
    setIsModalOpen(true);
  };

  // Open modal for creating new service / promo slide
  const handleOpenNew = () => {
    setEditingSlide(null);
    setIsNewSlide(true);
    setFormSlideType('service');
    setFormSrc('/images/hero/card_1_journey.webp');
    setFormAlt(isArabic ? 'شريحة خدمية جديدة' : 'New service slide');
    setFormTitleAr('');
    setFormTitleEn('');
    setFormSubtitleAr('');
    setFormSubtitleEn('');
    setFormObjectPosition('center');
    setFormZoomLevel(100);
    setFormTagAr('خدمة تأهيلية');
    setFormTagEn('Service');
    setFormCtaUrl('#services');
    setFormCtaTextAr('تفاصيل الخدمة');
    setFormActive(true);
    setIsModalOpen(true);
  };

  // Handle image upload from computer (with server upload to keep Firestore doc under 200KB rule limit)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressedDataUrl = await compressImage(file, 900, 900, 0.82);
      const uploaded = await uploadAttachmentToServer(compressedDataUrl, file.name);
      const finalSrc = uploaded.success && uploaded.url ? uploaded.url : compressedDataUrl;
      setFormSrc(finalSrc);
      setIsCompressing(false);
    } catch (err) {
      console.error(err);
      setIsCompressing(false);
      showFeedback(isArabic ? 'حدث خطأ أثناء معالجة الصورة' : 'Failed to process image', 'error');
    }
  };

  // Preset tag chips for fast selection
  const PRESET_TAGS = [
    { labelAr: 'خدمة تأهيلية', type: 'service' as const },
    { labelAr: 'عرض ترويجي خاص', type: 'offer' as const },
    { labelAr: 'خصم 35%', type: 'offer' as const },
    { labelAr: 'استشارة مجانية', type: 'offer' as const },
    { labelAr: 'برنامج مكثف ABA', type: 'service' as const },
    { labelAr: 'تكامل حسي وعلاج وظيفي', type: 'service' as const },
    { labelAr: 'نطق وتخاطب', type: 'service' as const },
    { labelAr: 'دمج مدرسي (معلم ظل)', type: 'service' as const },
    { labelAr: 'تشخيص وتقييم مبكر', type: 'service' as const },
    { labelAr: 'إعلان عام / فعالية', type: 'announcement' as const }
  ];

  // Quick CTA link presets
  const PRESET_LINKS = [
    { label: isArabic ? 'حجز موعد فوري (#booking)' : 'Quick Booking (#booking)', url: '#booking', text: 'احجز الآن' },
    { label: isArabic ? 'صفحة الخدمات (#services)' : 'Services Page (#services)', url: '#services', text: 'تفاصيل الخدمة' },
    { label: isArabic ? 'صفحة العروض والخصومات (#offers)' : 'Offers Page (#offers)', url: '#offers', text: 'استفد من العرض' },
    { label: isArabic ? 'استشارة سريعة' : 'Quick Consultation', url: '#consultation', text: 'طلب استشارة' }
  ];

  // Save Modal Form
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSrc.trim()) {
      showFeedback(isArabic ? 'يرجى إدخال رابط أو رفع صورة للشريحة' : 'Please provide an image', 'error');
      return;
    }

    if (!formTitleAr.trim()) {
      showFeedback(isArabic ? 'يرجى كتابة عنوان الشريحة (اسم الخدمة أو العرض)' : 'Please enter slide title', 'error');
      return;
    }

    let resolvedSrc = formSrc.trim();
    if (resolvedSrc.startsWith('data:') && resolvedSrc.length > 195000) {
      const uploaded = await uploadAttachmentToServer(resolvedSrc, `slide-${Date.now()}.webp`);
      if (uploaded.success && uploaded.url) {
        resolvedSrc = uploaded.url;
        setFormSrc(resolvedSrc);
      } else {
        showFeedback(
          isArabic
            ? 'حجم الصورة المضمنة كبير جداً لقاعدة البيانات السحابية (الحد الأقصى 200KB). يرجى اختيار صورة أصغر أو رابط مباشر.'
            : 'Inline image exceeds the 200KB cloud limit. Please upload a smaller image or use a direct URL.',
          'error'
        );
        return;
      }
    }

    if (isNewSlide) {
      const newSlide: HeroSlideItem = {
        id: `slide-custom-${Date.now()}`,
        src: resolvedSrc,
        alt: formAlt || formTitleAr,
        titleAr: formTitleAr,
        titleEn: formTitleEn || formTitleAr,
        subtitleAr: formSubtitleAr,
        subtitleEn: formSubtitleEn,
        objectPosition: formObjectPosition,
        zoomLevel: formZoomLevel,
        active: formActive,
        order: slides.length + 1,
        tagAr: formTagAr || (formSlideType === 'offer' ? 'عرض خاص' : 'خدمة تأهيلية'),
        tagEn: formTagEn,
        slideType: formSlideType,
        ctaUrl: formCtaUrl || undefined,
        ctaTextAr: formCtaTextAr || undefined
      };
      updateSlidesState([...slides, newSlide]);
      showFeedback(isArabic ? '✓ تمت إضافة الشريحة الخدمية/الإعلانية بنجاح' : 'Slide added successfully');
    } else if (editingSlide) {
      const updated = slides.map((s) => {
        if (s.id === editingSlide.id) {
          return {
            ...s,
            src: resolvedSrc,
            alt: formAlt || formTitleAr || s.alt,
            titleAr: formTitleAr,
            titleEn: formTitleEn,
            subtitleAr: formSubtitleAr,
            subtitleEn: formSubtitleEn,
            objectPosition: formObjectPosition,
            zoomLevel: formZoomLevel,
            active: formActive,
            tagAr: formTagAr,
            tagEn: formTagEn,
            slideType: formSlideType,
            ctaUrl: formCtaUrl || undefined,
            ctaTextAr: formCtaTextAr || undefined
          };
        }
        return s;
      });
      updateSlidesState(updated);
      showFeedback(isArabic ? '✓ تم حفظ تخصيص الشريحة الخدمية/الإعلانية بنجاح' : 'Slide updated successfully');
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header with Title & Top CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-[#00E5BE] text-xs font-black flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5" />
              <span>{isArabic ? 'شرائح الخدمات والعروض الإعلانية' : 'Service & Promo Slides'}</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {isArabic ? 'إدارة شرائح العرض (الصور الخدمية والإعلانية)' : 'Service & Promotional Hero Slider'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isArabic 
              ? 'التحكم الكامل في صور البرامج والخدمات التأهيلية، العروض الترويجية، والإعلانات المعروضة في السلايدر الدائري للواجهة الرئيسية' 
              : 'Customize service programs, promotional campaign banners, focal positions, and action links in the main hero slider'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title={isArabic ? 'استعادة الشرائح الخدمية الأصلية' : 'Reset to default slides'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isArabic ? 'استعادة الافتراضي' : 'Reset'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenNew}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0B3B36] to-[#00E5BE] hover:opacity-95 text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isArabic ? 'إضافة شريحة خدمية / إعلانية جديدة' : 'Add New Slide'}</span>
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
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${config.autoplay ? 'bg-[#00E5BE]/20 text-[#0F766E] dark:text-[#00E5BE]' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
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
            <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-[#0F766E] dark:text-[#00E5BE] flex items-center justify-center">
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
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 dark:text-white block">
                {isArabic ? 'أختام الحجز والعداد' : 'Booking & Count Badges'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {isArabic ? 'إظهار بادج الحجز والعداد اليومي' : 'Display over hero frame'}
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
              {isArabic ? 'معاينة حية لشريحة الخدمة / العرض في السلايدر الرئيسي' : 'Live Service & Offer Slide Preview'}
            </h3>
          </div>
          <span className="text-[11px] font-bold text-slate-400 bg-white/10 px-2.5 py-1 rounded-full">
            {isArabic ? `شريحة ${previewIndex + 1} من ${activeSlides.length}` : `Slide ${previewIndex + 1} of ${activeSlides.length}`}
          </span>
        </div>

        {/* Live Simulation Viewport */}
        <div className="py-6 flex flex-col items-center justify-center">
          
          {/* Badges Row Above Circle in Preview */}
          {config.showBadges && (
            <div className="flex items-center justify-between gap-2 w-full max-w-[240px] xs:max-w-[280px] sm:max-w-[320px] mb-3 z-20">
              <div 
                className="bg-emerald-700/95 text-white px-2.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-emerald-300/40 text-[11px] font-black"
              >
                <span className="min-w-4 h-4 px-1 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[9px] font-bold">
                  +{dailyChildrenCount}
                </span>
                <span>{isArabic ? `+${dailyChildrenCount} أطفال جدد` : `+${dailyChildrenCount} Today`}</span>
              </div>

              <div className="bg-white/95 text-slate-900 px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-slate-200 text-[11px] font-bold">
                <Mail className="w-3.5 h-3.5 text-[#2E86EB]" />
                <span>{isArabic ? 'حجز فوري' : 'Quick Booking'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </div>
          )}

          {/* Circular Frame Mockup matching Frontend */}
          <div 
            className="relative w-[240px] h-[240px] xs:w-[280px] xs:h-[280px] sm:w-[320px] sm:h-[320px] rounded-full bg-gradient-to-tr from-[#2E86EB] via-[#FFD23F] via-[#FF2D9B] to-[#22C55E] backdrop-blur-2xl border-4 border-white/60 dark:border-white/30 flex items-center justify-center shadow-[0_20px_60px_rgba(46,134,235,0.3)] p-1.5 shrink-0 aspect-square"
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
                  className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-white/15 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="السابق"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewIndex((prev) => (prev + 1) % activeSlides.length)}
                  className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-white/15 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="التالي"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            )}

          </div>

          {/* Bottom Accent Star in Preview */}
          <div className="mt-3 text-[#FFD23F] drop-shadow-[0_0_8px_rgba(255,210,63,0.6)]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>

          {/* Current Slide Info Caption below Preview (Service & Promo Details) */}
          {currentPreviewSlide && (
            <div className="mt-5 text-center space-y-1.5 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-black text-[#00E5BE] shadow-xs">
                <span>{currentPreviewSlide.tagAr || (currentPreviewSlide.slideType === 'offer' ? 'عرض خاص' : 'خدمة تأهيلية')}</span>
                <span>•</span>
                <span>{currentPreviewSlide.titleAr || currentPreviewSlide.alt}</span>
              </div>
              {currentPreviewSlide.subtitleAr && (
                <p className="text-xs text-slate-300 mx-auto leading-relaxed">
                  {currentPreviewSlide.subtitleAr}
                </p>
              )}
              {currentPreviewSlide.ctaUrl && (
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 bg-amber-400/10 px-3 py-0.5 rounded-full border border-amber-400/20">
                    <LinkIcon className="w-3 h-3" />
                    <span>{currentPreviewSlide.ctaTextAr || 'رابط الإجراء'}: {currentPreviewSlide.ctaUrl}</span>
                  </span>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 4. Designer Specifications & Image Dimensions Guide */}
      <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-slate-900/10 border border-teal-500/30 rounded-3xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-800 dark:text-[#00E5BE] flex items-center justify-center font-bold text-sm">
              📐
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {isArabic ? 'دليل ومواصفات أبعاد الصور لمسؤول التصميم (Graphic Designer Specs)' : 'Image Dimensions & Graphic Designer Guide'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isArabic ? 'المقاسات الدقيقة والنسبة ومنطقة الأمان لتصميم شرائح الخدمات والإعلانات' : 'Exact canvas size, aspect ratio, and circular safe zone for creating slides'}
              </p>
            </div>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full bg-teal-500/15 text-teal-700 dark:text-[#00E5BE] text-xs font-mono font-black border border-teal-500/30">
            1000 × 1000 px (1:1)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xs space-y-1">
            <span className="text-[10px] font-black uppercase text-teal-700 dark:text-[#00E5BE] block">
              {isArabic ? '1. المقاس والتناسب' : '1. Canvas & Ratio'}
            </span>
            <div className="text-sm font-black font-mono text-slate-900 dark:text-white">1000 × 1000 px</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              {isArabic ? 'نسبة مربعة 1:1 (الحد الأدنى 800×800 والمثالي 1000×1000 أو 1200×1200).' : '1:1 Square aspect ratio.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xs space-y-1">
            <span className="text-[10px] font-black uppercase text-blue-700 dark:text-blue-400 block">
              {isArabic ? '2. مقاس العرض التفاعلي' : '2. Viewport Display'}
            </span>
            <div className="text-sm font-black font-mono text-slate-900 dark:text-white">460px / 320px</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              {isArabic ? 'تظهر بدائرة قطرها 460px على شاشات الكمبيوتر و 320px على شاشات الجوال.' : '460px circular frame desktop, 320px mobile.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xs space-y-1">
            <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 block">
              {isArabic ? '3. منطقة الأمان (Safe Zone)' : '3. Circular Safe Zone'}
            </span>
            <div className="text-sm font-black text-slate-900 dark:text-white">85% من مركز الدائرة</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              {isArabic ? 'ضع العناصر الهامة في المنتصف مع ترك هامش 15% من الحواف تجنباً للاقتصاص.' : 'Keep essential text and logos in center 85%.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xs space-y-1">
            <span className="text-[10px] font-black uppercase text-purple-700 dark:text-purple-400 block">
              {isArabic ? '4. الصيغ والحجم' : '4. File Formats & Weight'}
            </span>
            <div className="text-sm font-black text-slate-900 dark:text-white">PNG / JPG / WebP</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              {isArabic ? 'الحد الأقصى 3MB، مع دعم الضغط التلقائي السريع عند الرفع.' : 'PNG or JPG under 3MB with auto compression.'}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Slides Management List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0F766E] dark:text-[#00E5BE]" />
            <span>{isArabic ? 'قائمة شرائح الخدمات والعروض الإعلانية (الترتيب وحالة الظهور)' : 'Service & Promo Slides List'}</span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">({slides.length})</span>
          </h3>
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {isArabic ? 'استخدم أزرار الأسهم لتقديم أو تأخير الشريحة' : 'Use arrows to re-order slides'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {slides.map((slide, index) => {
            const isOffer = slide.slideType === 'offer' || slide.tagAr?.includes('عرض') || slide.tagAr?.includes('خصم');
            const isAnnouncement = slide.slideType === 'announcement';

            return (
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
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-sm font-black text-slate-900 dark:text-white truncate">
                        {slide.titleAr || slide.alt}
                      </span>
                      {slide.tagAr && (
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black shrink-0 ${
                          isOffer
                            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                            : isAnnouncement
                            ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20'
                            : 'bg-teal-500/10 text-teal-700 dark:text-[#00E5BE] border border-teal-500/20'
                        }`}>
                          {slide.tagAr}
                        </span>
                      )}
                    </div>
                    {slide.subtitleAr && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {slide.subtitleAr}
                      </p>
                    )}
                    {slide.ctaUrl && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
                        <LinkIcon className="w-2.5 h-2.5 text-teal-600 dark:text-teal-400" />
                        <span>{slide.ctaTextAr || 'رابط الإجراء'}: <span className="font-mono text-teal-700 dark:text-teal-400">{slide.ctaUrl}</span></span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Actions Right */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  
                  {/* Move Up */}
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                    title={isArabic ? 'تقديم الشريحة' : 'Move up'}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === slides.length - 1}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                    title={isArabic ? 'تأخير الشريحة' : 'Move down'}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Toggle Active / Inactive */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(slide.id)}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      slide.active 
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
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

                  {/* Delete Slide (System Admin Only) */}
                  {isSystemAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-700 dark:text-rose-400 hover:text-white transition-all cursor-pointer"
                      title={isArabic ? 'حذف الشريحة' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Modern Redesigned Service & Promotional Slide Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#00E5BE]/20 text-[#0F766E] dark:text-[#00E5BE]">
                  {formSlideType === 'offer' ? <Tag className="w-5 h-5 text-amber-600 dark:text-amber-400" /> : <ImageIcon className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {isNewSlide 
                      ? (isArabic ? 'إضافة شريحة خدمية أو إعلانية جديدة' : 'Add New Service / Promo Slide') 
                      : (isArabic ? 'تخصيص شريحة الخدمة أو الإعلان' : 'Customize Service / Promo Slide')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isArabic ? 'رفع صورة الخدمة/الإعلان، ضبط تركيز ومحاذاة الصورة، وتحديد العناوين والروابط التفاعلية' : 'Upload image, set focal alignment, titles, and call-to-action'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Circular Preview Box with Aspect & Dimension Badges */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-white/5 relative">
              <div className="flex items-center justify-between w-full mb-2 px-1">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  {isArabic ? 'المعاينة الحية داخل الإطار الدائري:' : 'Live circular preview:'}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-[#00E5BE] border border-emerald-500/20">
                  {isArabic ? 'المقاس الموصى به: 1000×1000px (1:1)' : 'Ideal: 1000×1000px (1:1)'}
                </span>
              </div>
              
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

            {/* Designer Dimensions & Specifications Guide Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/5 border border-teal-500/30 text-slate-800 dark:text-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-black text-xs text-teal-800 dark:text-[#00E5BE]">
                  <Sparkles className="w-4 h-4 text-[#0F766E] dark:text-[#00E5BE]" />
                  <span>{isArabic ? 'دليل أبعاد ومواصفات الصورة للمصمم (Image Dimensions)' : 'Designer Dimensions & Specs'}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-800 dark:text-teal-200 font-bold border border-teal-500/30">
                  {isArabic ? 'نسبة 1:1 مربعة' : '1:1 Square Ratio'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-xl border border-teal-500/20 shadow-2xs">
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">{isArabic ? 'المقاس الموصى به' : 'Recommended'}</div>
                  <div className="font-black text-teal-700 dark:text-[#00E5BE] font-mono mt-0.5 text-xs sm:text-sm">1000 × 1000 px</div>
                  <div className="text-[9px] text-slate-600 dark:text-slate-400">الحد الأدنى 800×800</div>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-xl border border-teal-500/20 shadow-2xs">
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">{isArabic ? 'العرض بالموقع' : 'Display Size'}</div>
                  <div className="font-black text-slate-800 dark:text-white font-mono mt-0.5 text-xs sm:text-sm">460px / 320px</div>
                  <div className="text-[9px] text-slate-600 dark:text-slate-400">كمبيوتر / جوال</div>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-xl border border-teal-500/20 shadow-2xs">
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">{isArabic ? 'منطقة الأمان' : 'Safe Zone'}</div>
                  <div className="font-black text-amber-700 dark:text-amber-400 font-mono mt-0.5 text-xs sm:text-sm">85% من المركز</div>
                  <div className="text-[9px] text-slate-600 dark:text-slate-400">هامش 15% بالحواف</div>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-xl border border-teal-500/20 shadow-2xs">
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">{isArabic ? 'الصيغ والحجم' : 'Formats & Size'}</div>
                  <div className="font-black text-slate-800 dark:text-white mt-0.5 text-xs">PNG, JPG, WebP</div>
                  <div className="text-[9px] text-slate-600 dark:text-slate-400">أقل من 3MB (ضغط آلي)</div>
                </div>
              </div>

              <div className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-xl border border-teal-500/15">
                💡 <span className="font-black text-teal-800 dark:text-[#00E5BE]">{isArabic ? 'تنبيه لمسؤول التصميم والجرافيك:' : 'Designer Note:'}</span> {isArabic 
                  ? 'بما أن الشريحة تُعرض داخل إطار دائري كامل، احرص على وضع النصوص والرموز والشخصيات داخل الدائرة المركزية (قطر 85%) مع ترك مسافة 15% خالية عند الأطراف لتجنب اقتصاصها بالإطار الدائري.'
                  : 'Since the slide is displayed within a full circular frame, ensure all key text, logos, and focal elements are centered within the 85% safe zone.'}
              </div>
            </div>

            {/* Form Fields Dedicated to Services & Promotional Ads */}
            <form onSubmit={handleSaveModal} className="space-y-4">
              
              {/* Field 1: Slide Content Type Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                  {isArabic ? 'نوع محتوى الشريحة:' : 'Slide Content Type:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'service', labelAr: 'خدمة تأهيلية', icon: Briefcase, color: 'text-teal-500' },
                    { id: 'offer', labelAr: 'عرض ترويجي / إعلان', icon: Tag, color: 'text-amber-500' },
                    { id: 'announcement', labelAr: 'إعلان عام / فعالية', icon: Megaphone, color: 'text-purple-500' }
                  ].map((t) => {
                    const IconComponent = t.icon;
                    const isSelected = formSlideType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setFormSlideType(t.id as any);
                          if (t.id === 'offer' && !formTagAr) setFormTagAr('عرض ترويجي خاص');
                          if (t.id === 'service' && !formTagAr) setFormTagAr('خدمة تأهيلية');
                        }}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 border text-center ${
                          isSelected
                            ? 'bg-[#0B3B36] text-white border-transparent dark:bg-[#00E5BE] dark:text-slate-950 font-black shadow-xs ring-2 ring-[#00E5BE]/30'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-100'
                        }`}
                      >
                        <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white dark:text-slate-950' : t.color}`} />
                        <span>{t.labelAr}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Field 2: Photo Upload / Link Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                  {isArabic ? 'صورة الخدمة أو الإعلان (رفع من جهازك أو رابط مباشر):' : 'Slide Image URL or Upload:'}
                </label>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={formSrc}
                    onChange={(e) => setFormSrc(e.target.value)}
                    placeholder="https://... أو /images/hero/..."
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
                <p className="text-[10px] text-slate-600 dark:text-slate-400">
                  {isArabic ? 'يُفضل استخدام صور واضحة وذات ألوان متناسقة للجلسات أو تصميم العرض الإعلاني' : 'High quality square or circular composition recommended'}
                </p>
              </div>

              {/* Field 3: Focal Alignment (Top / Center / Bottom) */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                  {isArabic ? 'محاذاة وتركيز الصورة داخل الإطار الدائري:' : 'Image Focal Alignment:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'top', labelAr: 'أعلى الصورة (Top)', labelEn: 'Top' },
                    { id: 'center', labelAr: 'وسط الصورة (Center)', labelEn: 'Center' },
                    { id: 'bottom', labelAr: 'أسفل الصورة (Bottom)', labelEn: 'Bottom' }
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

              {/* Field 4: Zoom / Scale Level */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#00E5BE]" />
                    {isArabic ? 'نسبة التقريب / التكبير (Zoom):' : 'Scale / Zoom Level:'}
                  </span>
                  <span className="font-mono font-bold text-teal-700 dark:text-[#00E5BE]">
                    {formZoomLevel}%
                  </span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="150"
                  step="5"
                  value={formZoomLevel}
                  onChange={(e) => setFormZoomLevel(Number(e.target.value))}
                  className="w-full accent-[#00E5BE] cursor-pointer"
                />
              </div>

              {/* Field 5: Service / Promo Title */}
              <div>
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'عنوان الشريحة الرئيسي (اسم الخدمة أو عنوان العرض الإعلاني):' : 'Slide Title (Service or Promo Title):'}
                </label>
                <input
                  type="text"
                  required
                  value={formTitleAr}
                  onChange={(e) => setFormTitleAr(e.target.value)}
                  placeholder={formSlideType === 'offer' ? 'مثال: عرض اليوم الوطني 96: خصم 35% للعملاء الجدد' : 'مثال: برنامج تحليل السلوك التطبيقي المكثف ABA'}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00E5BE]/30 font-bold"
                />
              </div>

              {/* Field 6: Category Tag & Quick Preset Chips */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                  {isArabic ? 'تصنيف الشريحة أو وسم العرض (Tag):' : 'Category Tag / Badge:'}
                </label>
                <input
                  type="text"
                  value={formTagAr}
                  onChange={(e) => setFormTagAr(e.target.value)}
                  placeholder="مثال: خدمة تأهيلية / عرض خاص / استشارة مجانية"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00E5BE]/30"
                />

                {/* Quick Preset Tag Pills */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400">{isArabic ? 'اقتراحات سريعة:' : 'Quick tags:'}</span>
                  {PRESET_TAGS.map((tag) => (
                    <button
                      key={tag.labelAr}
                      type="button"
                      onClick={() => {
                        setFormTagAr(tag.labelAr);
                        setFormSlideType(tag.type);
                      }}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold transition-all cursor-pointer"
                    >
                      +{tag.labelAr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 7: Description / Subtitle */}
              <div>
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'الوصف التوضيحي للخدمة أو تفاصيل العرض:' : 'Service Description / Offer Details:'}
                </label>
                <textarea
                  rows={2}
                  value={formSubtitleAr}
                  onChange={(e) => setFormSubtitleAr(e.target.value)}
                  placeholder={formSlideType === 'offer' ? 'مثال: باقة متكاملة تشمل التقييم النمائي وجلسات فردية، ساري لفترة محدودة لجميع فروع الرياض.' : 'مثال: برامج فردية مكثفة بإشراف نخبة من محللي السلوك المعتمدين دولياً، لتطوير المهارات والتفاعل الاجتماعي.'}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00E5BE]/30 leading-relaxed"
                />
              </div>

              {/* Field 8: Call to Action (CTA) Link & Button Text */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-white/10 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-white">
                  <LinkIcon className="w-3.5 h-3.5 text-teal-500" />
                  <span>{isArabic ? 'إجراء التفاعل وزر التحويل (Call To Action - اختياري):' : 'Call to Action Action (Optional):'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      {isArabic ? 'مسار الرابط المستهدف:' : 'Target URL:'}
                    </label>
                    <input
                      type="text"
                      value={formCtaUrl}
                      onChange={(e) => setFormCtaUrl(e.target.value)}
                      placeholder="#booking أو #services أو #offers"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-2 text-xs text-slate-900 dark:text-white outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      {isArabic ? 'نص زر الإجراء:' : 'Button Label:'}
                    </label>
                    <input
                      type="text"
                      value={formCtaTextAr}
                      onChange={(e) => setFormCtaTextAr(e.target.value)}
                      placeholder="مثال: حجز موعد / استفد من العرض"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-2 text-xs text-slate-900 dark:text-white outline-none font-bold"
                    />
                  </div>
                </div>

                {/* Quick Link Presets */}
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400">{isArabic ? 'روابط شائعة:' : 'Quick links:'}</span>
                  {PRESET_LINKS.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => {
                        setFormCtaUrl(preset.url);
                        if (!formCtaTextAr) setFormCtaTextAr(preset.text);
                      }}
                      className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-[10px] font-medium transition-all hover:bg-slate-100 cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 9: Active Toggle Switch in Form */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/5">
                <div>
                  <span className="text-xs font-black text-slate-900 dark:text-white block">
                    {isArabic ? 'حالة ظهور الشريحة في الموقع:' : 'Publish Status:'}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {formActive ? (isArabic ? 'نشطة وظاهرة للمراجعين' : 'Active and visible') : (isArabic ? 'مخفية (مسودة)' : 'Hidden')}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formActive}
                    onChange={(e) => setFormActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00E5BE]" />
                </label>
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0B3B36] to-[#0F766E] hover:opacity-95 text-white text-xs font-black shadow-md cursor-pointer transition-all active:scale-95"
                >
                  {isArabic ? 'حفظ الشريحة الخدمية / الإعلانية' : 'Save Slide'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 6. Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsResetConfirmOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-white/15 shadow-2xl text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                {isArabic ? 'استعادة الشرائح الافتراضية' : 'Reset Default Slides'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isArabic
                  ? 'هل تريد استعادة شرائح الخدمات والعروض الافتراضية ومزامنتها مع قاعدة البيانات؟'
                  : 'Reset to default service and offer slides and sync with Firestore?'}
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmResetDefaults}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md cursor-pointer"
              >
                {isArabic ? 'تأكيد الاستعادة' : 'Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SliderManagementTab;
