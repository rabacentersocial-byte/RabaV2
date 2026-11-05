import React from 'react';
import { X, Play, CheckCircle2, ExternalLink } from 'lucide-react';
import { RabaLogo } from './RabaLogo';
import { useLanguage } from '../context/LanguageContext';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNow: () => void;
}

const VIDEO_URL = 'https://x.com/rabacenter/status/1352206247299321858?s=46';

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, onBookNow }) => {
  const { isArabic, direction } = useLanguage();

  if (!isOpen) return null;

  const handleOpenVideo = () => {
    window.open(VIDEO_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-3xl bg-white dark:bg-[#0D1B2A] text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden ${isArabic ? 'text-right' : 'text-left'} flex flex-col`}
        onClick={(e) => e.stopPropagation()}
        dir={direction}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04]">
          <div className="flex items-center gap-3">
            <RabaLogo />
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {isArabic ? 'فيديو تعريفي عن مركز رابا' : 'Introduction Video - Raba Center'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isArabic ? 'رحلة العلاج والتأهيل بتحليل السلوك التطبيقي (ABA)' : 'Rehabilitation Journey with Applied Behavior Analysis (ABA)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white transition-colors cursor-pointer"
            aria-label={isArabic ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80" 
            alt={isArabic ? 'فيديو تعريفي عن مركز رابا' : 'Raba Center Tour'}
            width={1200}
            height={675}
            style={{ aspectRatio: '16 / 9' }}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <a
              href={VIDEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-20 h-20 rounded-full bg-gradient-to-r from-[#00E5BE] to-[#0284C7] text-slate-950 flex items-center justify-center shadow-2xl transition-all border-4 border-white/30 cursor-pointer hover:scale-110 active:scale-95"
              aria-label={isArabic ? 'تشغيل الفيديو على منصة X' : 'Play video on X'}
            >
              <Play className="w-9 h-9 fill-slate-950 ml-1" />
            </a>
            
            <a
              href={VIDEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#00E5BE] font-black text-lg sm:text-xl drop-shadow-md transition-colors"
            >
              {isArabic 
                ? 'اضغط هنا لمشاهدة الفيديو التعريفي على منصة X (تويتر)' 
                : 'Click here to watch the introductory video on X (Twitter)'}
            </a>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-200">
              <a
                href={VIDEO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/15 hover:bg-white/25 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 transition-all text-white font-bold"
              >
                <span>{isArabic ? 'فتح التغريدة والفيديو على X' : 'Open Video on X'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="p-6 bg-slate-50 dark:bg-white/[0.03] border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-[#00E5BE] shrink-0" />
              <span>
                {isArabic ? 'أحدث غرف التحفيز الحسي وعيادات تحليل السلوك المعتمدة' : 'State-of-the-art sensory rooms and certified ABA behavioral clinics'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-[#00E5BE] shrink-0" />
              <span>
                {isArabic ? 'فريق إكلينيكي متخصص بإشراف أخصائيين ومحللي سلوك معتمدين' : 'Multidisciplinary clinical team supervised by certified BCBA therapists'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={VIDEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white font-bold text-sm rounded-2xl cursor-pointer transition-all shrink-0 text-center flex items-center justify-center gap-1.5"
            >
              <span>{isArabic ? 'مشاهدة على X' : 'Watch on X'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => {
                onClose();
                onBookNow();
              }}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#00E5BE] to-[#0284C7] text-slate-950 font-black text-sm rounded-2xl shadow-md cursor-pointer transition-all shrink-0 hover:brightness-105 text-center"
            >
              {isArabic ? 'سجل الآن واحجز موعدك' : 'Register & Book Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
