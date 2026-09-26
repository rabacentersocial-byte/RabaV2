import React, { useState } from 'react';
import { X, Play, CheckCircle2 } from 'lucide-react';
import { RabaLogo } from './RabaLogo';
import { useLanguage } from '../context/LanguageContext';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNow: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, onBookNow }) => {
  const { t, isArabic, direction } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-3xl bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden ${isArabic ? 'text-right' : 'text-left'} flex flex-col`}
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
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4">
            {isPlaying ? (
              <div className="bg-slate-900/90 border border-teal-500/40 rounded-2xl p-6 text-white max-w-md animate-in zoom-in-95 duration-200 backdrop-blur-md">
                <div className="w-12 h-12 rounded-full bg-[#00E5BE]/20 text-[#00E5BE] flex items-center justify-center mx-auto mb-3">
                  <Play className="w-6 h-6 fill-[#00E5BE]" />
                </div>
                <h4 className="text-base font-bold mb-1">
                  {isArabic ? 'جاري عرض الجولة الاستطلاعية لمركز رابا' : 'Showing Raba Center Virtual Tour'}
                </h4>
                <p className="text-xs text-slate-300">
                  {isArabic 
                    ? 'تتضمن الجولة غرف التكامل الحسي، عيادات التخاطب وعلاج اضطرابات النطق، وقاعات التدريب السلوكي الفردي ABA.' 
                    : 'The tour includes sensory integration rooms, speech clinics, and individualized 1:1 ABA behavior therapy rooms.'}
                </p>
              </div>
            ) : (
              <>
                <button 
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-[#00E5BE] to-[#0284C7] text-slate-950 flex items-center justify-center shadow-2xl transition-all border-4 border-white/30 cursor-pointer hover:scale-110 active:scale-95"
                  onClick={() => setIsPlaying(true)}
                  aria-label={isArabic ? 'تشغيل الفيديو' : 'Play video'}
                >
                  <Play className="w-9 h-9 fill-slate-950 ml-1" />
                </button>
                <span className="text-white font-black text-lg sm:text-xl drop-shadow-md">
                  {isArabic 
                    ? 'اضغط لمشاهدة جولة داخل عيادات وقاعات التكامل الحسي بمركز رابا' 
                    : 'Click to watch a walkthrough inside Raba Center clinics & sensory rooms'}
                </span>
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-200">
                  <span className="bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    {isArabic ? 'مدة الفيديو: 2:45 دقيقة' : 'Duration: 2:45 min'}
                  </span>
                  <span className="bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    {isArabic ? 'جودة فائقة 4K' : 'Ultra HD 4K'}
                  </span>
                </div>
              </>
            )}
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

          <button
            onClick={() => {
              onClose();
              onBookNow();
            }}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#00E5BE] to-[#0284C7] text-slate-950 font-black text-sm rounded-2xl shadow-md cursor-pointer transition-all shrink-0 hover:brightness-105"
          >
            {isArabic ? 'سجل الآن واحجز موعدك' : 'Register & Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
