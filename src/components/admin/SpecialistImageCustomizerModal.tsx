import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  RotateCcw, 
  Check, 
  X, 
  Star, 
  MapPin, 
  ZoomIn, 
  Sliders, 
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCheck
} from 'lucide-react';
import { Specialist } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  SpecialistImageSetting, 
  getSpecialistImageSetting, 
  updateSpecialistCardSetting, 
  resetSpecialistCardSetting 
} from '../../data/specialistCustomizer';
import { compressImage } from '../../utils/imageCompressor';
import { savePersistentImage } from '../../utils/persistentImageStore';

interface SpecialistImageCustomizerModalProps {
  specialist: Specialist;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const SpecialistImageCustomizerModal: React.FC<SpecialistImageCustomizerModalProps> = ({
  specialist,
  isOpen,
  onClose,
  onSaved
}) => {
  const { isArabic } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load current settings for this specialist
  const initialSettings = getSpecialistImageSetting(specialist.id);

  const [activeAvatar, setActiveAvatar] = useState<string>(initialSettings.avatar);
  const [displayMode, setDisplayMode] = useState<'cover' | 'contain'>(initialSettings.displayMode || 'cover');
  const [focalPosition, setFocalPosition] = useState<'top' | 'center' | 'bottom'>(initialSettings.focalPosition || 'top');
  const [zoomLevel, setZoomLevel] = useState<number>(initialSettings.zoomLevel || 100);
  const [isTopRated, setIsTopRated] = useState<boolean>(!!initialSettings.isTopRated);
  const [isAvailableToday, setIsAvailableToday] = useState<boolean>(initialSettings.isAvailableToday ?? true);
  const [hideSessionPrice, setHideSessionPrice] = useState<boolean>(!!initialSettings.hideSessionPrice);

  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  if (!isOpen) return null;

  // Process chosen or dropped file
  const processImageFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadNotice(isArabic ? 'يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)' : 'Please select a valid image file');
      return;
    }

    try {
      setIsCompressing(true);
      setUploadedFileName(file.name);
      setUploadNotice(isArabic ? 'جاري رفع وضغط وتحسين الصورة لتناسب البطاقة...' : 'Optimizing and uploading image...');
      
      const compressedUrlOrData = await compressImage(file, 900, 900, 0.85);
      
      setActiveAvatar(compressedUrlOrData);
      setIsCompressing(false);
      setUploadNotice(isArabic ? `✓ تم تجهيز وضغط الصورة "${file.name}" بنجاح!` : `Image "${file.name}" ready!`);
    } catch {
      setIsCompressing(false);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setActiveAvatar(result);
          setUploadNotice(isArabic ? `✓ تم تحميل ملف "${file.name}" بنجاح!` : 'Image loaded successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Save changes persistently
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (activeAvatar) {
        await savePersistentImage(specialist.id, activeAvatar);
        await savePersistentImage(activeAvatar, activeAvatar);
      }

      updateSpecialistCardSetting(specialist.id, {
        avatar: activeAvatar,
        displayMode,
        focalPosition,
        zoomLevel,
        isTopRated,
        isAvailableToday,
        hideSessionPrice
      });

      if (onSaved) onSaved();
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 250);
    } catch {
      setIsSaving(false);
      onClose();
    }
  };

  // Reset to default original image
  const handleReset = () => {
    resetSpecialistCardSetting(specialist.id);
    const refreshed = getSpecialistImageSetting(specialist.id);
    setActiveAvatar(refreshed.posterCrop || refreshed.fallbackAvatar || refreshed.avatar);
    setDisplayMode('cover');
    setFocalPosition('top');
    setZoomLevel(100);
    setIsTopRated(!!refreshed.isTopRated);
    setIsAvailableToday(refreshed.isAvailableToday ?? true);
    setHideSessionPrice(false);
    setUploadedFileName(null);
    setUploadNotice(isArabic ? 'تمت استعادة الصورة والإعدادات الافتراضية للبطاقة' : 'Reset to default card photo & settings');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0B3B36] to-[#00E5BE] text-white flex items-center justify-center shadow-md">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {isArabic ? 'رفع صورة الأخصائي وتخصيص البطاقة' : 'Upload Specialist Photo'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {specialist.name} — {specialist.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 flex items-center justify-center text-slate-500 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content: 2-Column Grid (Settings on left, Live Card Preview on right) */}
        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Notice / Alert if any */}
            {uploadNotice && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span className="font-bold">{uploadNotice}</span>
              </div>
            )}

            {/* Main Upload Dropzone Area */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {isArabic ? 'رفع ملف أو صورة من جهازك' : 'Upload File or Image'}
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative p-6 sm:p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center group ${
                  isDraggingOver
                    ? 'border-[#00E5BE] bg-[#00E5BE]/10 scale-[1.01]'
                    : 'border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-slate-800/40 hover:border-[#0B3B36] dark:hover:border-[#00E5BE] hover:bg-slate-100/60 dark:hover:bg-slate-800/70'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  {isCompressing ? (
                    <Loader2 className="w-8 h-8 text-[#00E5BE] animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-[#0B3B36] dark:text-[#00E5BE]" />
                  )}
                </div>

                <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                  {isCompressing 
                    ? (isArabic ? 'جاري معالجة ورفع الصورة...' : 'Processing and uploading...') 
                    : (isArabic ? 'انقر لاختيار ملف أو صورة من جهازك' : 'Click to choose an image file')}
                </h4>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  {isArabic 
                    ? 'أو اسحب ملف الصورة وأفلته هنا مباشرة' 
                    : 'or drag and drop your image file here'}
                </p>

                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                  <span className="px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700/60">JPG</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700/60">PNG</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700/60">WEBP</span>
                  <span>{isArabic ? 'حتى 15MB' : 'up to 15MB'}</span>
                </div>

                {uploadedFileName && (
                  <div className="mt-3.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isArabic ? 'الملف الحالي:' : 'Current file:'} {uploadedFileName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Crop, Fit & Zoom Adjustments */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-white/10 space-y-4">
              <span className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {isArabic ? 'ضبط الملاءمة والتقريب في البطاقة' : 'Fit & Zoom in Card'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Object Fit */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                    {isArabic ? 'ملاءمة الإطار:' : 'Display Mode:'}
                  </label>
                  <div className="flex rounded-xl bg-slate-200 dark:bg-slate-900 p-1">
                    <button
                      type="button"
                      onClick={() => setDisplayMode('cover')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        displayMode === 'cover'
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {isArabic ? 'تغطية كاملة (Cover)' : 'Cover (Fill)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDisplayMode('contain')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        displayMode === 'contain'
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {isArabic ? 'احتواء كامل (Contain)' : 'Contain (Fit)'}
                    </button>
                  </div>
                </div>

                {/* Focal Position */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                    {isArabic ? 'تركيز البؤرة (Vertical Focus):' : 'Vertical Focus:'}
                  </label>
                  <div className="flex rounded-xl bg-slate-200 dark:bg-slate-900 p-1">
                    <button
                      type="button"
                      onClick={() => setFocalPosition('top')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        focalPosition === 'top'
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {isArabic ? 'أعلى (الرأس)' : 'Top'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFocalPosition('center')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        focalPosition === 'center'
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {isArabic ? 'وسط' : 'Center'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFocalPosition('bottom')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        focalPosition === 'bottom'
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {isArabic ? 'أسفل' : 'Bottom'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Zoom Scale Slider */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
                    {isArabic ? 'نسبة التقريب / التكبير (Zoom):' : 'Zoom Level:'}
                  </span>
                  <span className="font-mono text-[#0B3B36] dark:text-[#00E5BE] font-black">
                    {zoomLevel}%
                  </span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="140"
                  step="5"
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0B3B36] dark:accent-[#00E5BE]"
                />
              </div>

              {/* Badges Toggles */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTopRated}
                    onChange={(e) => setIsTopRated(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0B3B36] focus:ring-[#00E5BE] cursor-pointer"
                  />
                  <span>{isArabic ? 'شارة الأعلى تقييماً (TOP RATED)' : 'Top Rated Badge'}</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailableToday}
                    onChange={(e) => setIsAvailableToday(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0B3B36] focus:ring-[#00E5BE] cursor-pointer"
                  />
                  <span>{isArabic ? 'متاح للحجز الفوري اليوم' : 'Available Today'}</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 cursor-pointer bg-amber-500/10 dark:bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30">
                  <input
                    type="checkbox"
                    checked={hideSessionPrice}
                    onChange={(e) => setHideSessionPrice(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <span>{isArabic ? 'إخفاء سعر الجلسة من هذه البطاقة' : 'Hide session fee on this card'}</span>
                </label>
              </div>

            </div>

          </div>

          {/* Live Card Preview Column (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10 flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between mb-3 text-xs font-black uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#00E5BE]" />
                {isArabic ? 'معاينة حية لشكل البطاقة بالسلايدر' : 'Live Slider Card Preview'}
              </span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                {isArabic ? 'مباشر' : 'Live'}
              </span>
            </div>

            {/* Exactly Replicated Doctor Card */}
            <div className="w-full max-w-[340px] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-lg flex flex-col justify-between">
              
              {/* Card Header Hero Image */}
              <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-white/5">
                <img
                  src={activeAvatar}
                  alt={specialist.name}
                  className={`w-full h-full transition-all duration-300 ${
                    displayMode === 'contain' ? 'object-contain' : 'object-cover'
                  } ${
                    focalPosition === 'top' ? 'object-top' : focalPosition === 'bottom' ? 'object-bottom' : 'object-center'
                  }`}
                  style={{
                    transform: `scale(${zoomLevel / 100})`
                  }}
                  referrerPolicy="no-referrer"
                />

                {/* Overlaid Badge: Top Rated */}
                {isTopRated && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-white/95 dark:bg-slate-950/90 backdrop-blur-xs text-slate-900 dark:text-white text-[10px] font-black tracking-wider px-3 py-1 rounded-full shadow-md uppercase">
                      {isArabic ? 'الأعلى تقييماً' : 'TOP RATED'}
                    </span>
                  </div>
                )}

                {/* Favorite Heart (Static Preview) */}
                <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-md flex items-center justify-center text-rose-500">
                  ♥
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[#0D9488] dark:text-[#00E5BE] text-[10px] font-black uppercase tracking-wider truncate">
                      {specialist.role || specialist.title}
                    </span>
                    <span className="flex items-center gap-1 bg-amber-400/10 text-slate-900 dark:text-amber-300 px-2 py-0.5 rounded-full text-xs font-black">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{specialist.rating.toFixed(1)}</span>
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-snug mb-1">
                    {specialist.name}
                  </h4>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-4">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{isArabic ? 'عيادات رابا - الرياض' : 'Raba Clinics - Riyadh'}</span>
                  </div>

                  {/* 3-Column Metrics */}
                  <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-white/10 rtl:divide-x-reverse py-2.5 border-y border-slate-100 dark:border-white/10 mb-4 text-center">
                    <div className="px-1">
                      <span className="text-base font-black text-slate-900 dark:text-white block font-sans">
                        {specialist.experienceYears}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        {isArabic ? 'خبرة' : 'EXP.'}
                      </span>
                    </div>

                    <div className="px-1">
                      <span className="text-base font-black text-slate-900 dark:text-white block font-sans">
                        {specialist.reviewsCount}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        {isArabic ? 'تقييم' : 'REVIEWS'}
                      </span>
                    </div>

                    <div className="px-1">
                      {hideSessionPrice ? (
                        <>
                          <span className="text-xs font-black text-[#0B3B36] dark:text-[#00E5BE] block truncate py-0.5">
                            {isArabic ? 'حسب التقييم' : 'Upon Consult'}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                            {isArabic ? 'الخطة' : 'PLAN'}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-base font-black text-slate-900 dark:text-white block font-sans">
                            {specialist.sessionPrice} ر.س
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                            {isArabic ? 'الجلسة' : 'CONSULT'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fake CTA Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 py-2 text-center rounded-xl bg-[#0B3B36] text-white text-xs font-bold shadow-xs">
                    {isArabic ? 'حجز موعد' : 'Book'}
                  </div>
                  <div className="px-3 py-2 text-center rounded-xl border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200 text-xs font-bold">
                    {isArabic ? 'السيرة' : 'CV'}
                  </div>
                </div>
              </div>

            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-3 leading-relaxed">
              {isArabic 
                ? 'أي صورة يتم حفظها هنا تظهر فوراً للزوار على الموقع والسلايدر وتثبت بشكل دائم.' 
                : 'Any uploaded photo saved here will immediately show across the live site.'}
            </p>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-slate-900/80 sticky bottom-0 z-20">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isArabic ? 'استعادة الصورة الأصلية' : 'Reset to Original'}</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-bold transition-all cursor-pointer"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0B3B36] to-[#00E5BE] text-white hover:opacity-95 text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isArabic ? 'جاري الحفظ...' : 'Saving...'}</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isArabic ? 'حفظ وتطبيق الصورة فوراً' : 'Save & Apply Photo'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
