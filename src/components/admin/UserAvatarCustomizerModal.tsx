import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Camera,
  Upload,
  Link2,
  Trash2,
  RotateCcw,
  Check,
  X,
  ZoomIn,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Palette,
  Sparkles,
} from 'lucide-react';
import { AdminUser } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { compressImage } from '../../utils/imageCompressor';
import {
  savePersistentImage,
  getResolvedImageUrl,
  handleImageErrorWithStore,
} from '../../utils/persistentImageStore';
import {
  USER_AVATAR_BG_PRESETS,
  getUserAvatarBgClass,
  getUserAvatarPositionClass,
  getUserAvatarTransformStyle,
  isSafeAvatarUrl,
  getUserInitials,
} from '../../utils/userAvatar';

export interface UserAvatarSavePayload {
  avatar: string;
  avatarPosition: 'top' | 'center' | 'bottom';
  avatarZoom: number;
  avatarBgColor: string;
}

interface UserAvatarCustomizerModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, payload: UserAvatarSavePayload) => Promise<void> | void;
}

export const UserAvatarCustomizerModal: React.FC<UserAvatarCustomizerModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const { isArabic } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [position, setPosition] = useState<'top' | 'center' | 'bottom'>('center');
  const [zoom, setZoom] = useState<number>(100);
  const [bgColor, setBgColor] = useState<string>('emerald');
  const [activeSourceTab, setActiveSourceTab] = useState<'upload' | 'url' | 'initials'>('upload');

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imgBroken, setImgBroken] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    if (!isOpen || !user) return;
    const current = user.avatar || '';
    setAvatarUrl(current);
    setUrlInput(current.startsWith('data:') ? '' : current);
    setPosition(user.avatarPosition || 'center');
    setZoom(typeof user.avatarZoom === 'number' ? Math.min(150, Math.max(100, user.avatarZoom)) : 100);
    setBgColor(user.avatarBgColor || 'emerald');
    setActiveSourceTab('upload');
    setImgBroken(false);
    setNotice(null);
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSaving) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, isSaving, onClose]);

  if (!isOpen || !user) return null;

  const processFile = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setNotice({
        type: 'error',
        text: isArabic ? 'يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)' : 'Please select a valid image file (JPG, PNG, WebP)',
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setNotice({
        type: 'error',
        text: isArabic ? 'حجم الصورة يتجاوز 10 ميجابايت، يرجى اختيار صورة أصغر' : 'Image exceeds 10MB limit. Please choose a smaller file.',
      });
      return;
    }

    try {
      setIsProcessing(true);
      setNotice({
        type: 'info',
        text: isArabic ? 'جاري ضغط ورفع الصورة بجودة عالية...' : 'Optimizing and uploading avatar...',
      });
      const compressedUrl = await compressImage(file, 512, 512, 0.86);
      setAvatarUrl(compressedUrl);
      setUrlInput(compressedUrl.startsWith('data:') ? '' : compressedUrl);
      setImgBroken(false);
      setNotice({
        type: 'success',
        text: isArabic ? `تم تجهيز الصورة "${file.name}" بنجاح` : `Image "${file.name}" ready`,
      });
    } catch {
      setNotice({
        type: 'error',
        text: isArabic ? 'تعذر معالجة ملف الصورة، يرجى المحاولة بصورة أخرى' : 'Could not process image file. Please try another.',
      });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setAvatarUrl('');
      setImgBroken(false);
      setNotice(null);
      return;
    }
    if (!isSafeAvatarUrl(trimmed)) {
      setNotice({
        type: 'error',
        text: isArabic ? 'الرابط غير صالح. استخدم رابط https:// أو مساراً محلياً يبدأ بـ /' : 'Invalid URL. Use an https:// link or relative / path.',
      });
      return;
    }
    setAvatarUrl(trimmed);
    setImgBroken(false);
    setNotice({
      type: 'success',
      text: isArabic ? 'تم تحميل معاينة الرابط بنجاح' : 'URL preview loaded',
    });
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
    setUrlInput('');
    setPosition('center');
    setZoom(100);
    setImgBroken(false);
    setNotice({
      type: 'info',
      text: isArabic ? 'تمت إزالة الصورة — سيظهر الحرفان الأولان للاسم باللون المختار' : 'Photo removed — styled initials will be displayed',
    });
  };

  const handleResetFraming = () => {
    setPosition('center');
    setZoom(100);
  };

  const handleSubmit = async () => {
    const finalAvatar = avatarUrl.trim();
    if (finalAvatar && !isSafeAvatarUrl(finalAvatar)) {
      setNotice({
        type: 'error',
        text: isArabic ? 'يرجى استخدام رابط صورة آمن وصالح' : 'Please provide a valid image URL',
      });
      return;
    }

    setIsSaving(true);
    try {
      if (finalAvatar) {
        await savePersistentImage(`admin_avatar_${user.id}`, finalAvatar).catch(() => {});
        await savePersistentImage(finalAvatar, finalAvatar).catch(() => {});
      }

      await onSave(user.id, {
        avatar: finalAvatar,
        avatarPosition: position,
        avatarZoom: zoom,
        avatarBgColor: bgColor,
      });
      onClose();
    } catch {
      setNotice({
        type: 'error',
        text: isArabic ? 'حدث خطأ أثناء حفظ الصورة، يرجى المحاولة مجدداً' : 'Failed to save avatar. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resolvedPreviewSrc = avatarUrl ? getResolvedImageUrl(avatarUrl) : '';
  const hasVisibleImage = Boolean(resolvedPreviewSrc && !imgBroken);
  const bgGradient = getUserAvatarBgClass(bgColor);
  const posClass = getUserAvatarPositionClass(position);
  const zoomStyle = getUserAvatarTransformStyle(zoom, position);
  const initials = getUserInitials(user, 2);

  const modalContent = (
    <div
      className="fixed inset-0 z-[120] isolate overflow-y-auto overscroll-contain bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={() => !isSaving && onClose()}
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-white/15 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B3B36] via-[#0E5246] to-[#1263D6] px-6 py-5 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5 text-emerald-200" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-black truncate">
                {isArabic ? 'تخصيص صورة المستخدم' : 'Customize User Avatar'}
              </h3>
              <p className="text-xs text-emerald-100/85 truncate mt-0.5">
                {user.name} · {isArabic ? user.roleTitleAr : user.roleTitleEn}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer disabled:opacity-50"
            aria-label={isArabic ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[76vh] overflow-y-auto">
          {/* Dual Live Preview Banner */}
          <div className="bg-slate-50 dark:bg-slate-800/70 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              {/* Card Square-Rounded Preview */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-lg relative bg-slate-200 dark:bg-slate-800">
                  {hasVisibleImage ? (
                    <img
                      src={resolvedPreviewSrc}
                      alt={user.name}
                      style={zoomStyle}
                      onError={(e) => {
                        const retry = Number(e.currentTarget.dataset.retryAttempt || 0);
                        if (retry >= 3) {
                          setImgBroken(true);
                          return;
                        }
                        handleImageErrorWithStore(e, avatarUrl);
                      }}
                      className={`w-full h-full object-cover ${posClass} transition-transform duration-150`}
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${bgGradient} text-white font-black text-2xl flex items-center justify-center`}
                    >
                      {initials}
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {isArabic ? 'في البطاقة' : 'Card View'}
                </span>
              </div>

              {/* Circular Topbar Preview */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#2B95FF]/40 shadow-md relative bg-slate-200 dark:bg-slate-800">
                  {hasVisibleImage ? (
                    <img
                      src={resolvedPreviewSrc}
                      alt={user.name}
                      style={zoomStyle}
                      className={`w-full h-full object-cover ${posClass} transition-transform duration-150`}
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${bgGradient} text-white font-black text-base flex items-center justify-center`}
                    >
                      {initials}
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {isArabic ? 'في الشريط العلوي' : 'Topbar View'}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-2">
              <div className="text-center sm:text-end">
                <div className="text-sm font-black text-slate-900 dark:text-white">{user.name}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{user.email}</div>
              </div>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'إزالة الصورة والعودة للأحرف' : 'Remove Photo'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Feedback Notice */}
          {notice && (
            <div
              className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                notice.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                  : notice.type === 'error'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                  : 'bg-sky-500/10 border-sky-500/30 text-sky-800 dark:text-sky-300'
              }`}
            >
              {notice.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : notice.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <Sparkles className="w-4 h-4 shrink-0" />
              )}
              <span>{notice.text}</span>
            </div>
          )}

          {/* Source Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            {(
              [
                { id: 'upload', icon: Upload, labelAr: 'رفع صورة', labelEn: 'Upload Photo' },
                { id: 'url', icon: Link2, labelAr: 'رابط مباشر', labelEn: 'Image URL' },
                { id: 'initials', icon: Palette, labelAr: 'لون الأحرف', labelEn: 'Initials Style' },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const active = activeSourceTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSourceTab(tab.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    active
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{isArabic ? tab.labelAr : tab.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Upload / Drag & Drop */}
          {activeSourceTab === 'upload' && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={handleDrop}
              onClick={() => !isProcessing && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                isDraggingOver
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-slate-300 dark:border-white/15 hover:border-emerald-500/70 bg-slate-50/70 dark:bg-slate-800/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                {isProcessing
                  ? isArabic
                    ? 'جاري ضغط ورفع الصورة...'
                    : 'Optimizing & uploading...'
                  : isArabic
                  ? 'انقر لاختيار صورة أو اسحبها وأفلتها هنا'
                  : 'Click to browse or drag & drop an image here'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {isArabic
                  ? 'يدعم JPG, PNG, WebP — يتم الضغط والحفظ تلقائياً للعمل السريع في الإنتاج'
                  : 'Supports JPG, PNG, WebP — automatically compressed and persisted'}
              </p>
            </div>
          )}

          {/* Tab 2: Direct Image URL */}
          {activeSourceTab === 'url' && (
            <div className="space-y-2.5 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-white/10">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                {isArabic ? 'أدخل رابط الصورة المباشر:' : 'Direct Image URL:'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  dir="ltr"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyUrl();
                    }
                  }}
                  placeholder="https://example.com/photo.jpg"
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2.5 rounded-xl bg-[#0B3B36] hover:bg-[#0E5246] text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  {isArabic ? 'معاينة' : 'Apply'}
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Initials Color Theme */}
          {activeSourceTab === 'initials' && (
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {isArabic ? 'اختر لون خلفية الأحرف الافتراضية:' : 'Choose initials badge color:'}
                </span>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    {isArabic ? 'اعتماد الأحرف بدلاً من الصورة' : 'Use initials instead'}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {USER_AVATAR_BG_PRESETS.map((preset) => {
                  const selected = bgColor === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setBgColor(preset.id)}
                      className={`p-2 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        selected
                          ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/25'
                          : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <span
                        className={`w-9 h-9 rounded-xl ${preset.swatchClass} text-white text-xs font-black flex items-center justify-center shadow-xs`}
                      >
                        {selected ? <Check className="w-4 h-4" /> : initials}
                      </span>
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-full text-center">
                        {isArabic ? preset.labelAr : preset.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Framing & Zoom Controls (Shown whenever a photo is active) */}
          {hasVisibleImage && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <ZoomIn className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{isArabic ? 'ضبط موضع الصورة والتقريب' : 'Framing & Zoom Controls'}</span>
                </span>
                <button
                  type="button"
                  onClick={handleResetFraming}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isArabic ? 'إعادة ضبط' : 'Reset'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Focal Position */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">
                    {isArabic ? 'موضع التركيز الرأسي:' : 'Vertical Focus:'}
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { id: 'top', labelAr: 'أعلى', labelEn: 'Top' },
                        { id: 'center', labelAr: 'وسط', labelEn: 'Center' },
                        { id: 'bottom', labelAr: 'أسفل', labelEn: 'Bottom' },
                      ] as const
                    ).map((pos) => (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() => setPosition(pos.id)}
                        className={`py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                          position === pos.id
                            ? 'bg-[#0B3B36] text-white border-[#0B3B36]'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-emerald-400'
                        }`}
                      >
                        {isArabic ? pos.labelAr : pos.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zoom Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    <span>{isArabic ? 'مستوى التقريب:' : 'Zoom Level:'}</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-mono">{zoom}%</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={150}
                    step={5}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isArabic ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving || isProcessing}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5BE] to-[#0284C7] hover:brightness-110 active:scale-[0.98] text-slate-950 font-black text-xs shadow-md inline-flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>{isSaving ? (isArabic ? 'جاري الحفظ...' : 'Saving...') : isArabic ? 'حفظ الصورة' : 'Save Avatar'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};

export default UserAvatarCustomizerModal;
