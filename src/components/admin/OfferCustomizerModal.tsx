import React, { useState } from 'react';
import { 
  X, 
  Palette, 
  Sparkles, 
  Tag, 
  Calendar, 
  Percent, 
  Gift, 
  Check, 
  Clock, 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  Award, 
  ShieldCheck, 
  Phone, 
  Sliders, 
  HelpCircle,
  Copy,
  ChevronRight
} from 'lucide-react';
import { OfferData, OfferCustomStyling, OfferTerm } from '../../types';
import { SaudiNationalDayBadge, SaudiFalconGraphic } from '../NationalDayVisuals';

interface OfferCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (savedOffer: OfferData) => void;
  offerToEdit?: OfferData | null;
  isArabic?: boolean;
}

// Preset color themes for quick 1-click styling
export const THEME_PRESETS: {
  id: string;
  nameAr: string;
  nameEn: string;
  styling: OfferCustomStyling;
  previewColor: string;
}[] = [
  {
    id: 'emerald',
    nameAr: 'الأخضر الزمردي الملكي (اليوم الوطني)',
    nameEn: 'Royal Emerald (National Day)',
    previewColor: '#062c22',
    styling: {
      themePreset: 'emerald',
      bgGradientFrom: '#062c22',
      bgGradientVia: '#093c2f',
      bgGradientTo: '#041d17',
      borderColor: 'rgba(16,185,129,0.35)',
      borderHoverColor: 'rgba(16,185,129,0.65)',
      accentColor: '#00E5BE',
      badgeBgColor: '#00E5BE',
      badgeTextColor: '#022c22',
      ribbonBgColor: '#00E5BE',
      ribbonTextColor: '#022c22',
      glowColor: 'rgba(16,185,129,0.18)',
      subcardBg: '#032019',
      subcardBorder: 'rgba(16,185,129,0.3)',
      textColor: '#ffffff'
    }
  },
  {
    id: 'teal',
    nameAr: 'التيل البحري الفاخر (Ocean Teal)',
    nameEn: 'Luxury Teal (Oceanic)',
    previewColor: '#042a2b',
    styling: {
      themePreset: 'teal',
      bgGradientFrom: '#042a2b',
      bgGradientVia: '#0b4245',
      bgGradientTo: '#021a1b',
      borderColor: 'rgba(20,184,166,0.35)',
      borderHoverColor: 'rgba(20,184,166,0.65)',
      accentColor: '#2dd4bf',
      badgeBgColor: '#2dd4bf',
      badgeTextColor: '#021a1b',
      ribbonBgColor: '#2dd4bf',
      ribbonTextColor: '#021a1b',
      glowColor: 'rgba(20,184,166,0.2)',
      subcardBg: '#022224',
      subcardBorder: 'rgba(20,184,166,0.3)',
      textColor: '#ffffff'
    }
  },
  {
    id: 'indigo',
    nameAr: 'البنفسجي الملكي (Royal Violet)',
    nameEn: 'Royal Violet & Indigo',
    previewColor: '#1e1338',
    styling: {
      themePreset: 'indigo',
      bgGradientFrom: '#1e1338',
      bgGradientVia: '#2d1f4e',
      bgGradientTo: '#110b24',
      borderColor: 'rgba(168,85,247,0.35)',
      borderHoverColor: 'rgba(168,85,247,0.65)',
      accentColor: '#c084fc',
      badgeBgColor: '#c084fc',
      badgeTextColor: '#110b24',
      ribbonBgColor: '#c084fc',
      ribbonTextColor: '#110b24',
      glowColor: 'rgba(168,85,247,0.22)',
      subcardBg: '#150d26',
      subcardBorder: 'rgba(168,85,247,0.3)',
      textColor: '#ffffff'
    }
  },
  {
    id: 'navy',
    nameAr: 'الكحلي الليلي (Midnight Navy)',
    nameEn: 'Midnight Navy & Cyan',
    previewColor: '#0a192f',
    styling: {
      themePreset: 'navy',
      bgGradientFrom: '#0a192f',
      bgGradientVia: '#112a45',
      bgGradientTo: '#06101e',
      borderColor: 'rgba(56,189,248,0.35)',
      borderHoverColor: 'rgba(56,189,248,0.65)',
      accentColor: '#38bdf8',
      badgeBgColor: '#38bdf8',
      badgeTextColor: '#06101e',
      ribbonBgColor: '#38bdf8',
      ribbonTextColor: '#06101e',
      glowColor: 'rgba(56,189,248,0.2)',
      subcardBg: '#071526',
      subcardBorder: 'rgba(56,189,248,0.3)',
      textColor: '#ffffff'
    }
  },
  {
    id: 'amber',
    nameAr: 'الذهبي والبرونزي (Royal Gold & Amber)',
    nameEn: 'Royal Gold & Amber',
    previewColor: '#2b1d06',
    styling: {
      themePreset: 'amber',
      bgGradientFrom: '#2b1d06',
      bgGradientVia: '#3d2b0b',
      bgGradientTo: '#1b1203',
      borderColor: 'rgba(245,158,11,0.35)',
      borderHoverColor: 'rgba(245,158,11,0.65)',
      accentColor: '#fbbf24',
      badgeBgColor: '#fbbf24',
      badgeTextColor: '#1b1203',
      ribbonBgColor: '#fbbf24',
      ribbonTextColor: '#1b1203',
      glowColor: 'rgba(245,158,11,0.2)',
      subcardBg: '#201504',
      subcardBorder: 'rgba(245,158,11,0.3)',
      textColor: '#ffffff'
    }
  },
  {
    id: 'rose',
    nameAr: 'العنابي الياقوتي (Luxury Ruby / Rose)',
    nameEn: 'Luxury Ruby & Rose',
    previewColor: '#310d18',
    styling: {
      themePreset: 'rose',
      bgGradientFrom: '#310d18',
      bgGradientVia: '#451624',
      bgGradientTo: '#20080f',
      borderColor: 'rgba(244,63,94,0.35)',
      borderHoverColor: 'rgba(244,63,94,0.65)',
      accentColor: '#fb7185',
      badgeBgColor: '#fb7185',
      badgeTextColor: '#20080f',
      ribbonBgColor: '#fb7185',
      ribbonTextColor: '#20080f',
      glowColor: 'rgba(244,63,94,0.2)',
      subcardBg: '#240a12',
      subcardBorder: 'rgba(244,63,94,0.3)',
      textColor: '#ffffff'
    }
  }
];

export const OfferCustomizerModal: React.FC<OfferCustomizerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  offerToEdit,
  isArabic = true
}) => {
  if (!isOpen) return null;

  // Active form tab
  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'discount' | 'terms'>('design');

  // Form State
  const [titleAr, setTitleAr] = useState(offerToEdit?.titleAr || '');
  const [titleEn, setTitleEn] = useState(offerToEdit?.titleEn || '');
  const [subtitleAr, setSubtitleAr] = useState(offerToEdit?.subtitleAr || '');
  const [subtitleEn, setSubtitleEn] = useState(offerToEdit?.subtitleEn || '');
  const [ribbonAr, setRibbonAr] = useState(offerToEdit?.ribbonAr || (offerToEdit?.discountType === 'free_day' ? 'لجميع عملائنا' : 'للعملاء الجدد'));
  const [ribbonEn, setRibbonEn] = useState(offerToEdit?.ribbonEn || '');
  const [badgeAr, setBadgeAr] = useState(offerToEdit?.badgeAr || 'عرض حصري لفترة محدودة');
  const [badgeEn, setBadgeEn] = useState(offerToEdit?.badgeEn || 'EXCLUSIVE OFFER');
  const [headerTagAr, setHeaderTagAr] = useState(offerToEdit?.headerTagAr || 'عزّنا بطبعنا');
  const [headerTagSubAr, setHeaderTagSubAr] = useState(offerToEdit?.headerTagSubAr || 'اليوم الوطني 96');
  
  const [couponCode, setCouponCode] = useState(offerToEdit?.couponCode || 'RABA-SPECIAL');
  const [targetDate, setTargetDate] = useState(offerToEdit?.targetDate || '2026-09-30T23:59:59');
  const [dateLabelAr, setDateLabelAr] = useState(offerToEdit?.dateLabelAr || 'ساري حتى 30/9/2026');
  const [dateLabelEn, setDateLabelEn] = useState(offerToEdit?.dateLabelEn || 'Valid until 30/09/2026');
  
  const [discountType, setDiscountType] = useState<'percentage' | 'free_day' | 'fixed_amount'>(offerToEdit?.discountType || 'percentage');
  const [discountValue, setDiscountValue] = useState<number>(offerToEdit?.discountValue ?? 35);
  const [isNationalDay, setIsNationalDay] = useState<boolean>(offerToEdit?.isNationalDay ?? true);
  const [graphicType, setGraphicType] = useState<'falcon' | 'gift' | 'percent' | 'sparkles' | 'award'>(offerToEdit?.graphicType || 'falcon');
  const [showCountdown, setShowCountdown] = useState<boolean>(offerToEdit?.showCountdown ?? true);
  const [active, setActive] = useState<boolean>(offerToEdit?.active ?? true);
  const [descriptionAr, setDescriptionAr] = useState(offerToEdit?.descriptionAr || '');
  const [descriptionEn, setDescriptionEn] = useState(offerToEdit?.descriptionEn || '');
  const [claimButtonTextAr, setClaimButtonTextAr] = useState(offerToEdit?.claimButtonTextAr || 'الاستفادة من العرض الآن');
  const [phone, setPhone] = useState(offerToEdit?.phone || '966550000000');

  // Terms list
  const [terms, setTerms] = useState<OfferTerm[]>(() => {
    if (offerToEdit?.terms && offerToEdit.terms.length > 0) {
      return [...offerToEdit.terms];
    }
    return [
      { textAr: 'الخصم يطبق على السعر الأصلي.', textEn: 'Discount applies to original price.' },
      { textAr: 'يُطبق الخصم لمرة واحدة على كل باقة.', textEn: 'Applied once per package.' },
      { textAr: 'ساري حتى اكتمال العدد المتاح.', textEn: 'Valid until slots are filled.' }
    ];
  });
  const [newTermAr, setNewTermAr] = useState('');

  // Styling State
  const defaultStyling = THEME_PRESETS[0].styling;
  const initialStyling = offerToEdit?.styling || (
    offerToEdit?.theme && THEME_PRESETS.find(p => p.id === offerToEdit.theme)?.styling
  ) || defaultStyling;

  const [styling, setStyling] = useState<OfferCustomStyling>({
    bgGradientFrom: initialStyling.bgGradientFrom || '#062c22',
    bgGradientVia: initialStyling.bgGradientVia || '#093c2f',
    bgGradientTo: initialStyling.bgGradientTo || '#041d17',
    borderColor: initialStyling.borderColor || 'rgba(16,185,129,0.35)',
    borderHoverColor: initialStyling.borderHoverColor || 'rgba(16,185,129,0.65)',
    accentColor: initialStyling.accentColor || '#00E5BE',
    badgeBgColor: initialStyling.badgeBgColor || '#00E5BE',
    badgeTextColor: initialStyling.badgeTextColor || '#022c22',
    ribbonBgColor: initialStyling.ribbonBgColor || '#00E5BE',
    ribbonTextColor: initialStyling.ribbonTextColor || '#022c22',
    glowColor: initialStyling.glowColor || 'rgba(16,185,129,0.2)',
    subcardBg: initialStyling.subcardBg || '#032019',
    subcardBorder: initialStyling.subcardBorder || 'rgba(16,185,129,0.3)',
    textColor: initialStyling.textColor || '#ffffff',
    themePreset: initialStyling.themePreset || 'emerald'
  });

  const handleApplyPreset = (preset: typeof THEME_PRESETS[0]) => {
    setStyling({ ...preset.styling });
  };

  const handleAddTerm = () => {
    if (!newTermAr.trim()) return;
    setTerms([...terms, { textAr: newTermAr.trim(), textEn: '' }]);
    setNewTermAr('');
  };

  const handleRemoveTerm = (index: number) => {
    setTerms(terms.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalOffer: OfferData = {
      id: offerToEdit?.id || `offer-${Date.now()}`,
      titleAr: titleAr.trim() || 'عرض خاص',
      titleEn: titleEn.trim() || 'Special Offer',
      subtitleAr: subtitleAr.trim(),
      subtitleEn: subtitleEn.trim(),
      ribbonAr: ribbonAr.trim(),
      ribbonEn: ribbonEn.trim(),
      badgeAr: badgeAr.trim(),
      badgeEn: badgeEn.trim(),
      headerTagAr: headerTagAr.trim(),
      headerTagSubAr: headerTagSubAr.trim(),
      couponCode: couponCode.trim().toUpperCase(),
      targetDate: targetDate || '2026-09-30T23:59:59',
      dateLabelAr: dateLabelAr.trim() || 'ساري لفترة محدودة',
      dateLabelEn: dateLabelEn.trim(),
      discountType,
      discountValue: Number(discountValue) || 0,
      theme: (styling.themePreset as any) || 'emerald',
      isNationalDay,
      graphicType,
      showCountdown,
      active,
      descriptionAr: descriptionAr.trim(),
      descriptionEn: descriptionEn.trim(),
      terms,
      claimButtonTextAr: claimButtonTextAr.trim(),
      phone: phone.trim(),
      styling
    };

    onSave(finalOffer);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-white/10 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00E5BE]/10 border border-[#00E5BE]/30 flex items-center justify-center text-[#00E5BE]">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{offerToEdit ? (isArabic ? 'تخصيص وتعديل بطاقة العرض الحصري' : 'Customize Exclusive Offer Card') : (isArabic ? 'إنشاء وتخصيص بطاقة عرض جديدة' : 'Create & Customize Offer Card')}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00E5BE]/20 text-[#00E5BE] border border-[#00E5BE]/30">
                  {isArabic ? 'لوحة تحكم الألوان والبيانات' : 'Card Design & Controls'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isArabic 
                  ? 'تحكم كامل في ألوان البطاقة، التدرجات، النصوص، الشارات، نسب الخصم والعداد التنازلي مع معاينة حية فورية.' 
                  : 'Full control over background colors, gradients, badges, discount types, countdown & live preview.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-950/40 border-b border-white/10 overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('design')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'design'
                ? 'bg-[#00E5BE] text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>{isArabic ? 'الألوان والمظهر الجمالي' : 'Colors & Theme'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'content'
                ? 'bg-[#00E5BE] text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{isArabic ? 'الهوية والعناوين والشارات' : 'Identity & Badges'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('discount')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'discount'
                ? 'bg-[#00E5BE] text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>{isArabic ? 'الخصم والكوبون والعداد' : 'Discount & Countdown'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-[#00E5BE] text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isArabic ? 'الشروط والأحكام والاتصال' : 'Terms & Contact'}</span>
          </button>
        </div>

        {/* Content Body: Split view (Left: Controls, Right: Live Card Preview) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 space-y-5">

            {/* TAB 1: DESIGN & COLORS */}
            {activeTab === 'design' && (
              <div className="space-y-5">
                
                {/* Preset Themes Selector */}
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#00E5BE]" />
                      <span>{isArabic ? 'أنماط ألوان جاهزة بنقرة واحدة (Presets)' : 'Quick Color Presets'}</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {isArabic ? 'اختر نمطاً أو خصص يدوياً' : 'Select a theme or customize'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {THEME_PRESETS.map((p) => {
                      const isSelected = styling.themePreset === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleApplyPreset(p)}
                          className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-2.5 cursor-pointer ${
                            isSelected
                              ? 'border-[#00E5BE] bg-[#00E5BE]/10 shadow-xs ring-1 ring-[#00E5BE]'
                              : 'border-white/10 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div 
                            className="w-6 h-6 rounded-lg shrink-0 border border-white/20 shadow-xs"
                            style={{ 
                              background: `linear-gradient(135deg, ${p.styling.bgGradientFrom}, ${p.styling.accentColor})` 
                            }} 
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-white block truncate leading-tight">
                              {isArabic ? p.nameAr.split('(')[0] : p.nameEn}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {p.styling.accentColor}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Granular Color Pickers */}
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/10 space-y-4">
                  <h4 className="text-xs font-black text-[#00E5BE] uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'تخصيص الألوان التفصيلي للبطاقة' : 'Fine-Grained Color Controls'}</span>
                  </h4>

                  {/* Gradient Background Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        {isArabic ? 'بداية التدرج (من)' : 'Gradient From'}
                      </label>
                      <div className="flex items-center gap-2 bg-slate-900 border border-white/10 p-1.5 rounded-xl">
                        <input
                          type="color"
                          value={styling.bgGradientFrom?.startsWith('#') ? styling.bgGradientFrom : '#062c22'}
                          onChange={(e) => setStyling({ ...styling, bgGradientFrom: e.target.value, themePreset: 'custom' })}
                          className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={styling.bgGradientFrom || ''}
                          onChange={(e) => setStyling({ ...styling, bgGradientFrom: e.target.value, themePreset: 'custom' })}
                          className="w-full text-xs font-mono bg-transparent text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        {isArabic ? 'وسط التدرج' : 'Gradient Via'}
                      </label>
                      <div className="flex items-center gap-2 bg-slate-900 border border-white/10 p-1.5 rounded-xl">
                        <input
                          type="color"
                          value={styling.bgGradientVia?.startsWith('#') ? styling.bgGradientVia : '#093c2f'}
                          onChange={(e) => setStyling({ ...styling, bgGradientVia: e.target.value, themePreset: 'custom' })}
                          className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={styling.bgGradientVia || ''}
                          onChange={(e) => setStyling({ ...styling, bgGradientVia: e.target.value, themePreset: 'custom' })}
                          className="w-full text-xs font-mono bg-transparent text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        {isArabic ? 'نهاية التدرج (إلى)' : 'Gradient To'}
                      </label>
                      <div className="flex items-center gap-2 bg-slate-900 border border-white/10 p-1.5 rounded-xl">
                        <input
                          type="color"
                          value={styling.bgGradientTo?.startsWith('#') ? styling.bgGradientTo : '#041d17'}
                          onChange={(e) => setStyling({ ...styling, bgGradientTo: e.target.value, themePreset: 'custom' })}
                          className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={styling.bgGradientTo || ''}
                          onChange={(e) => setStyling({ ...styling, bgGradientTo: e.target.value, themePreset: 'custom' })}
                          className="w-full text-xs font-mono bg-transparent text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Border and Accent Colors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        {isArabic ? 'لون الإطار الخارجي (Border)' : 'Card Border Color'}
                      </label>
                      <div className="flex items-center gap-2 bg-slate-900 border border-white/10 p-1.5 rounded-xl">
                        <input
                          type="color"
                          value={styling.borderColor?.startsWith('#') ? styling.borderColor : '#10b981'}
                          onChange={(e) => setStyling({ ...styling, borderColor: e.target.value, themePreset: 'custom' })}
                          className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={styling.borderColor || ''}
                          onChange={(e) => setStyling({ ...styling, borderColor: e.target.value, themePreset: 'custom' })}
                          className="w-full text-xs font-mono bg-transparent text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        {isArabic ? 'لون التمييز الرئيسي (Accent / Highlights)' : 'Primary Accent Color'}
                      </label>
                      <div className="flex items-center gap-2 bg-slate-900 border border-white/10 p-1.5 rounded-xl">
                        <input
                          type="color"
                          value={styling.accentColor?.startsWith('#') ? styling.accentColor : '#00E5BE'}
                          onChange={(e) => setStyling({ ...styling, accentColor: e.target.value, themePreset: 'custom' })}
                          className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={styling.accentColor || ''}
                          onChange={(e) => setStyling({ ...styling, accentColor: e.target.value, themePreset: 'custom' })}
                          className="w-full text-xs font-mono bg-transparent text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subcard Box Colors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        {isArabic ? 'خلفية مربع الشروط الداخلي' : 'Inner Conditions Box Bg'}
                      </label>
                      <div className="flex items-center gap-2 bg-slate-900 border border-white/10 p-1.5 rounded-xl">
                        <input
                          type="color"
                          value={styling.subcardBg?.startsWith('#') ? styling.subcardBg : '#032019'}
                          onChange={(e) => setStyling({ ...styling, subcardBg: e.target.value, themePreset: 'custom' })}
                          className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={styling.subcardBg || ''}
                          onChange={(e) => setStyling({ ...styling, subcardBg: e.target.value, themePreset: 'custom' })}
                          className="w-full text-xs font-mono bg-transparent text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        {isArabic ? 'لون إطار مربع الشروط' : 'Inner Box Border'}
                      </label>
                      <div className="flex items-center gap-2 bg-slate-900 border border-white/10 p-1.5 rounded-xl">
                        <input
                          type="color"
                          value={styling.subcardBorder?.startsWith('#') ? styling.subcardBorder : '#10b981'}
                          onChange={(e) => setStyling({ ...styling, subcardBorder: e.target.value, themePreset: 'custom' })}
                          className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={styling.subcardBorder || ''}
                          onChange={(e) => setStyling({ ...styling, subcardBorder: e.target.value, themePreset: 'custom' })}
                          className="w-full text-xs font-mono bg-transparent text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Badge & Ribbon Colors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        {isArabic ? 'خلفية شريط الفئة (Ribbon)' : 'Ribbon Background'}
                      </label>
                      <div className="flex items-center gap-2 bg-slate-900 border border-white/10 p-1.5 rounded-xl">
                        <input
                          type="color"
                          value={styling.ribbonBgColor?.startsWith('#') ? styling.ribbonBgColor : '#00E5BE'}
                          onChange={(e) => setStyling({ ...styling, ribbonBgColor: e.target.value, themePreset: 'custom' })}
                          className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={styling.ribbonBgColor || ''}
                          onChange={(e) => setStyling({ ...styling, ribbonBgColor: e.target.value, themePreset: 'custom' })}
                          className="w-full text-xs font-mono bg-transparent text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        {isArabic ? 'لون نص شريط الفئة' : 'Ribbon Text Color'}
                      </label>
                      <div className="flex items-center gap-2 bg-slate-900 border border-white/10 p-1.5 rounded-xl">
                        <input
                          type="color"
                          value={styling.ribbonTextColor?.startsWith('#') ? styling.ribbonTextColor : '#022c22'}
                          onChange={(e) => setStyling({ ...styling, ribbonTextColor: e.target.value, themePreset: 'custom' })}
                          className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={styling.ribbonTextColor || ''}
                          onChange={(e) => setStyling({ ...styling, ribbonTextColor: e.target.value, themePreset: 'custom' })}
                          className="w-full text-xs font-mono bg-transparent text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 2: CONTENT & IDENTITY */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                
                {/* National Day Mode & Graphic Selection */}
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-white block">
                        {isArabic ? 'طابع اليوم الوطني السعودي 96' : 'Saudi National Day Theme'}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        {isArabic ? 'تفعيل شعار عزّنا بطبعنا وصقر اليوم الوطني' : 'Display Saudi Falcon & National Day badge'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsNationalDay(!isNationalDay)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        isNationalDay ? 'bg-[#00E5BE]' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                          isNationalDay ? (isArabic ? '-translate-x-6' : 'translate-x-6') : (isArabic ? '-translate-x-1' : 'translate-x-1')
                        }`}
                      />
                    </button>
                  </div>

                  {!isNationalDay && (
                    <div className="pt-2 border-t border-white/10">
                      <label className="block text-[11px] font-bold text-slate-300 mb-2">
                        {isArabic ? 'الأيقونة التوضيحية للبطاقة' : 'Card Graphic / Icon'}
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { id: 'gift', labelAr: 'هدية', icon: Gift },
                          { id: 'percent', labelAr: 'خصم %', icon: Percent },
                          { id: 'sparkles', labelAr: 'بريق', icon: Sparkles },
                          { id: 'award', labelAr: 'درع تميز', icon: Award }
                        ].map((item) => {
                          const IconC = item.icon;
                          const isSel = graphicType === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setGraphicType(item.id as any)}
                              className={`p-2 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                                isSel
                                  ? 'border-[#00E5BE] bg-[#00E5BE]/10 text-[#00E5BE]'
                                  : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                              }`}
                            >
                              <IconC className="w-5 h-5" />
                              <span className="text-[10px] font-bold">{item.labelAr}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Header Tags & Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isArabic ? 'شارة العرض العلوية (Badge)' : 'Top Badge Text'}
                    </label>
                    <input
                      type="text"
                      value={badgeAr}
                      onChange={(e) => setBadgeAr(e.target.value)}
                      placeholder="عرض حصري 100% مجاني"
                      className="w-full text-xs p-3 rounded-xl border border-white/10 bg-slate-950 text-white focus:border-[#00E5BE] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isArabic ? 'وسم الفئة / الشريط (Ribbon)' : 'Ribbon Tag Text'}
                    </label>
                    <input
                      type="text"
                      value={ribbonAr}
                      onChange={(e) => setRibbonAr(e.target.value)}
                      placeholder="لجميع عملائنا / للعملاء الجدد"
                      className="w-full text-xs p-3 rounded-xl border border-white/10 bg-slate-950 text-white focus:border-[#00E5BE] outline-none"
                    />
                  </div>
                </div>

                {/* Main Titles */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isArabic ? 'العنوان الرئيسي للبطاقة (بالعربية)*' : 'Offer Title (Arabic)*'}
                  </label>
                  <input
                    type="text"
                    required
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder="يوم مجاني لجميع عملائنا"
                    className="w-full text-xs p-3 rounded-xl border border-white/10 bg-slate-950 text-white focus:border-[#00E5BE] outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isArabic ? 'العنوان الفرعي / المناسبة (بالعربية)' : 'Subtitle / Occasion (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={subtitleAr}
                    onChange={(e) => setSubtitleAr(e.target.value)}
                    placeholder="بمناسبة اليوم الوطني السعودي الـ96 — عزّ وفخر"
                    className="w-full text-xs p-3 rounded-xl border border-white/10 bg-slate-950 text-white focus:border-[#00E5BE] outline-none"
                  />
                </div>

                {/* English Titles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isArabic ? 'العنوان الرئيسي (بالإنجليزية)' : 'Title (English)'}
                    </label>
                    <input
                      type="text"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      placeholder="Free Day for All Clients"
                      className="w-full text-xs p-3 rounded-xl border border-white/10 bg-slate-950 text-white focus:border-[#00E5BE] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isArabic ? 'العنوان الفرعي (بالإنجليزية)' : 'Subtitle (English)'}
                    </label>
                    <input
                      type="text"
                      value={subtitleEn}
                      onChange={(e) => setSubtitleEn(e.target.value)}
                      placeholder="Saudi National Day 96 — Glory & Pride"
                      className="w-full text-xs p-3 rounded-xl border border-white/10 bg-slate-950 text-white focus:border-[#00E5BE] outline-none"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: DISCOUNT, COUPON & COUNTDOWN */}
            {activeTab === 'discount' && (
              <div className="space-y-4">
                
                {/* Discount Type and Value */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isArabic ? 'آلية ونوع الخصم' : 'Discount Calculation Type'}
                    </label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as any)}
                      className="w-full text-xs p-3 rounded-xl border border-white/10 bg-slate-950 text-white focus:border-[#00E5BE] outline-none cursor-pointer"
                    >
                      <option value="free_day">{isArabic ? 'يوم مجاني (100% مجاني / 96 عز وفخر)' : 'Free Day (100% Free / Day 96)'}</option>
                      <option value="percentage">{isArabic ? 'نسبة مئوية مخصومة (%)' : 'Percentage (%)'}</option>
                      <option value="fixed_amount">{isArabic ? 'مبلغ نقدي مقطوع (ر.س)' : 'Fixed Amount (SAR)'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isArabic ? 'القيمة الرقمية (النسبة أو المبلغ)' : 'Discount Numerical Value'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                      className="w-full text-xs p-3 rounded-xl border border-white/10 bg-slate-950 text-white focus:border-[#00E5BE] outline-none font-bold"
                    />
                  </div>
                </div>

                {/* Coupon Code */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isArabic ? 'كود الكوبون المخصص (ينسخه العميل)*' : 'Coupon Code (Copied by Client)*'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="KSA96-FREE"
                      className="w-full text-xs p-3 rounded-xl border border-white/10 bg-slate-950 text-white focus:border-[#00E5BE] outline-none font-mono font-bold tracking-wider"
                    />
                  </div>
                </div>

                {/* Date and Countdown Settings */}
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {isArabic ? 'تفعيل العداد التنازلي التفاعلي' : 'Enable Countdown Timer'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCountdown(!showCountdown)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        showCountdown ? 'bg-[#00E5BE]' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                          showCountdown ? (isArabic ? '-translate-x-6' : 'translate-x-6') : (isArabic ? '-translate-x-1' : 'translate-x-1')
                        }`}
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        {isArabic ? 'تاريخ ووقت الانتهاء للعداد' : 'Target Countdown End Date'}
                      </label>
                      <input
                        type="datetime-local"
                        value={targetDate.replace('Z', '')}
                        onChange={(e) => setTargetDate(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-white/10 bg-slate-900 text-white focus:border-[#00E5BE] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        {isArabic ? 'نص التاريخ المعروض بالبطاقة' : 'Display Date Text'}
                      </label>
                      <input
                        type="text"
                        value={dateLabelAr}
                        onChange={(e) => setDateLabelAr(e.target.value)}
                        placeholder="يوم الخميس 24/9/2026"
                        className="w-full text-xs p-3 rounded-xl border border-white/10 bg-slate-900 text-white focus:border-[#00E5BE] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Action button text */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isArabic ? 'نص زر الاستفادة من العرض' : 'Claim Offer Button Text'}
                  </label>
                  <input
                    type="text"
                    value={claimButtonTextAr}
                    onChange={(e) => setClaimButtonTextAr(e.target.value)}
                    placeholder="الاستفادة من العرض الآن"
                    className="w-full text-xs p-3 rounded-xl border border-white/10 bg-slate-950 text-white focus:border-[#00E5BE] outline-none"
                  />
                </div>

              </div>
            )}

            {/* TAB 4: TERMS & CONTACT */}
            {activeTab === 'terms' && (
              <div className="space-y-4">
                
                {/* Dynamic Terms list */}
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#00E5BE]" />
                      <span>{isArabic ? 'الشروط والأحكام الخاصة بالعرض' : 'Terms & Conditions'}</span>
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {terms.length} {isArabic ? 'شروط مسجلة' : 'terms'}
                    </span>
                  </div>

                  {/* Add term input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTermAr}
                      onChange={(e) => setNewTermAr(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTerm())}
                      placeholder={isArabic ? 'أدخل شرطاً جديداً واضغط إضافة...' : 'Add new term and click add...'}
                      className="w-full text-xs p-2.5 rounded-xl border border-white/10 bg-slate-900 text-white focus:border-[#00E5BE] outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddTerm}
                      className="px-3.5 py-2.5 rounded-xl bg-[#00E5BE] text-slate-950 font-black text-xs hover:brightness-105 shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isArabic ? 'إضافة' : 'Add'}</span>
                    </button>
                  </div>

                  {/* List of existing terms */}
                  <div className="space-y-2 pt-2">
                    {terms.map((t, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-200"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-md bg-[#00E5BE]/10 text-[#00E5BE] flex items-center justify-center font-bold text-[10px] shrink-0">
                            {idx + 1}
                          </span>
                          <span className="truncate">{t.textAr}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveTerm(idx)}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isArabic ? 'الوصف العام للعرض' : 'General Description'}
                  </label>
                  <textarea
                    rows={2}
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    placeholder={isArabic ? 'نحتفل معكم بيوم مميز تقديراً لثقتكم ووفائكم لنا لجميع عملائنا الكرام.' : 'Special offer description...'}
                    className="w-full text-xs p-3 rounded-xl border border-white/10 bg-slate-950 text-white focus:border-[#00E5BE] outline-none"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isArabic ? 'رقم الواتساب / الهاتف للحجز' : 'WhatsApp / Booking Phone'}
                    </label>
                    <div className="flex items-center gap-2 bg-slate-950 border border-white/10 p-2 rounded-xl">
                      <Phone className="w-4 h-4 text-[#00E5BE] shrink-0" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="966550000000"
                        className="w-full text-xs font-mono bg-transparent text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isArabic ? 'حالة التفعيل بالعرض' : 'Active Status in Slider'}
                    </label>
                    <div className="flex items-center gap-3 bg-slate-950 border border-white/10 p-2.5 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setActive(!active)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          active ? 'bg-emerald-500' : 'bg-slate-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                            active ? (isArabic ? '-translate-x-6' : 'translate-x-6') : (isArabic ? '-translate-x-1' : 'translate-x-1')
                          }`}
                        />
                      </button>
                      <span className={`text-xs font-bold ${active ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {active ? (isArabic ? 'نشط في السلايدر' : 'Live in Slider') : (isArabic ? 'معطل ومخفي' : 'Hidden')}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Live Card Preview Column (5 cols) */}
          <div className="lg:col-span-5 sticky top-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Eye className="w-3.5 h-3.5 text-[#00E5BE]" />
                <span>{isArabic ? 'معاينة حية للبطاقة كما ستظهر للمستخدم' : 'Live Interactive Preview'}</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                {styling.themePreset ? styling.themePreset.toUpperCase() : 'CUSTOM'}
              </span>
            </div>

            {/* Simulated Offer Card */}
            <div 
              className="w-full rounded-2xl sm:rounded-3xl p-4 sm:p-5 relative overflow-hidden shadow-2xl flex flex-col transition-all duration-300 border"
              style={{
                background: `linear-gradient(135deg, ${styling.bgGradientFrom || '#062c22'} 0%, ${styling.bgGradientVia || '#093c2f'} 50%, ${styling.bgGradientTo || '#041d17'} 100%)`,
                borderColor: styling.borderColor || 'rgba(16,185,129,0.35)',
                boxShadow: `0 20px 40px -15px ${styling.glowColor || 'rgba(0,0,0,0.5)'}`
              }}
            >
              {/* Corner Glow */}
              <div 
                className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl pointer-events-none"
                style={{ backgroundColor: styling.glowColor || 'rgba(16,185,129,0.2)' }}
              />

              <div className="relative z-10 flex flex-col">
                
                {/* Header Row */}
                <div 
                  className="flex items-center justify-between gap-1.5 mb-3 pb-2.5 border-b"
                  style={{ borderColor: styling.borderColor ? `${styling.borderColor}40` : 'rgba(255,255,255,0.1)' }}
                >
                  {isNationalDay ? (
                    <div 
                      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-right border"
                      style={{ 
                        backgroundColor: styling.subcardBg || '#03231B',
                        borderColor: styling.subcardBorder || 'rgba(16,185,129,0.4)'
                      }}
                    >
                      <div 
                        className="w-5 h-5 rounded-md flex items-center justify-center p-0.5 shrink-0 border"
                        style={{ 
                          backgroundColor: `${styling.accentColor || '#00E5BE'}20`,
                          borderColor: styling.accentColor || '#00E5BE'
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" style={{ color: styling.accentColor || '#00E5BE' }}>
                          <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
                          <circle cx="12" cy="12" r="3" fill={styling.accentColor || '#00E5BE'} />
                        </svg>
                      </div>
                      <div className="flex flex-col text-right leading-tight">
                        <span className="text-white font-black text-[10px] tracking-wider">{headerTagAr || 'عزّنا بطبعنا'}</span>
                        <span className="text-[7.5px] font-bold uppercase" style={{ color: styling.accentColor || '#34D399' }}>{headerTagSubAr || 'اليوم الوطني 96'}</span>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold border"
                      style={{ 
                        backgroundColor: styling.subcardBg || '#03231B',
                        borderColor: styling.subcardBorder || 'rgba(255,255,255,0.2)',
                        color: styling.accentColor || '#00E5BE'
                      }}
                    >
                      <Tag className="w-3 h-3" />
                      <span className="truncate max-w-[120px]">{titleAr || 'عرض حصري'}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: styling.accentColor || '#00E5BE' }} />
                    <span 
                      className="text-[9px] font-black uppercase tracking-wider truncate max-w-[130px]"
                      style={{ color: styling.accentColor || '#00E5BE' }}
                    >
                      {badgeAr}
                    </span>
                  </div>
                </div>

                {/* Typography & Graphic Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight line-clamp-1">
                      {titleAr || 'عنوان العرض الحصري'}
                    </h3>

                    {/* Ribbon */}
                    <div className="inline-block">
                      <span 
                        className="font-black text-[9.5px] px-2 py-0.5 rounded-full shadow-xs tracking-wide"
                        style={{ 
                          backgroundColor: styling.ribbonBgColor || '#00E5BE',
                          color: styling.ribbonTextColor || '#022c22'
                        }}
                      >
                        {ribbonAr || 'لجميع عملائنا'}
                      </span>
                    </div>

                    <p className="text-emerald-100/90 font-bold text-[10px] pt-0.5 truncate">
                      {subtitleAr || 'المناسبة أو الوصف الإضافي'}
                    </p>

                    {/* Discount Value Display */}
                    {discountType === 'free_day' ? (
                      <div className="flex items-baseline gap-1.5 pt-0.5">
                        <span className="text-3xl font-black bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-sans">
                          {discountValue || 96}
                        </span>
                        <span className="text-[9px] font-black text-amber-300 uppercase tracking-widest">
                          عزّ وفخر
                        </span>
                      </div>
                    ) : discountType === 'percentage' ? (
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span 
                          className="text-3xl font-black font-sans"
                          style={{ color: styling.accentColor || '#00E5BE' }}
                        >
                          {discountValue}%
                        </span>
                        <span className="text-xs font-black text-white">
                          خصـم
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1.5 pt-0.5">
                        <span 
                          className="text-2xl font-black"
                          style={{ color: styling.accentColor || '#00E5BE' }}
                        >
                          {discountValue} ر.س
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Graphic */}
                  <div className="shrink-0 self-center">
                    {isNationalDay ? (
                      <SaudiFalconGraphic className="w-14 h-14" />
                    ) : (
                      <div 
                        className="w-14 h-14 rounded-2xl border flex items-center justify-center"
                        style={{ 
                          backgroundColor: `${styling.accentColor || '#00E5BE'}15`,
                          borderColor: styling.subcardBorder || 'rgba(255,255,255,0.2)'
                        }}
                      >
                        {graphicType === 'gift' && <Gift className="w-7 h-7" style={{ color: styling.accentColor || '#00E5BE' }} />}
                        {graphicType === 'percent' && <Percent className="w-7 h-7" style={{ color: styling.accentColor || '#00E5BE' }} />}
                        {graphicType === 'sparkles' && <Sparkles className="w-7 h-7" style={{ color: styling.accentColor || '#00E5BE' }} />}
                        {graphicType === 'award' && <Award className="w-7 h-7" style={{ color: styling.accentColor || '#00E5BE' }} />}
                        {graphicType === 'falcon' && <SaudiFalconGraphic className="w-12 h-12" />}
                      </div>
                    )}
                  </div>
                </div>

                {/* Subcard Box with Date & Terms */}
                <div 
                  className="p-2.5 rounded-xl border text-emerald-100 mb-2.5 space-y-1"
                  style={{
                    backgroundColor: styling.subcardBg || '#032019',
                    borderColor: styling.subcardBorder || 'rgba(16,185,129,0.3)'
                  }}
                >
                  <div className="flex items-center gap-1.5 text-amber-300 font-black text-[10px]">
                    <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{dateLabelAr}</span>
                  </div>

                  <div className="space-y-1 text-[9.5px] text-emerald-100/90 pt-0.5">
                    {(terms || []).slice(0, 2).map((t, idx) => (
                      <div key={idx} className="flex items-start gap-1 bg-black/20 px-1.5 py-0.5 rounded-md border border-white/5">
                        <span className="font-bold shrink-0" style={{ color: styling.accentColor || '#00E5BE' }}>•</span>
                        <span className="leading-tight truncate">{t.textAr}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Countdown Simulation */}
                {showCountdown && (
                  <div className="mb-2.5">
                    <span 
                      className="text-[8px] font-black tracking-widest uppercase block mb-1"
                      style={{ color: `${styling.accentColor || '#00E5BE'}cc` }}
                    >
                      المتبقي حتى الموعد المحدد
                    </span>
                    <div className="grid grid-cols-4 gap-1">
                      {['أيام', 'ساعة', 'دقيقة', 'ثانية'].map((label, idx) => (
                        <div 
                          key={idx}
                          className="rounded-lg p-1 text-center border bg-black/30"
                          style={{ borderColor: styling.subcardBorder || 'rgba(255,255,255,0.1)' }}
                        >
                          <span className="text-xs font-black text-white font-mono block">
                            {idx === 0 ? '05' : idx === 1 ? '14' : idx === 2 ? '22' : '45'}
                          </span>
                          <span className="text-[7.5px] text-slate-300 block">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coupon Code Pill & Claim Button */}
                <div className="space-y-1.5 pt-1">
                  <div 
                    className="flex items-center justify-between gap-1 p-1.5 rounded-xl border border-dashed bg-black/40"
                    style={{ borderColor: styling.accentColor || '#00E5BE' }}
                  >
                    <div className="flex items-center gap-1 text-[9.5px] font-bold text-white px-1">
                      <Tag className="w-3 h-3" style={{ color: styling.accentColor || '#00E5BE' }} />
                      <span>الكود:</span>
                      <span className="font-mono font-black" style={{ color: styling.accentColor || '#00E5BE' }}>{couponCode}</span>
                    </div>
                    <span className="text-[8.5px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-white">
                      نسخ
                    </span>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 rounded-xl font-black text-xs shadow-md flex items-center justify-center gap-1.5"
                    style={{
                      backgroundColor: styling.accentColor || '#00E5BE',
                      color: styling.badgeTextColor || '#022c22'
                    }}
                  >
                    <span>{claimButtonTextAr || 'الاستفادة من العرض الآن'}</span>
                    <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>

              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              💡 {isArabic ? 'سيتم تطبيق هذه الألوان والنصوص فوراً على العرض في الصفحة الرئيسية وفي الجوال وسطح المكتب.' : 'These customized colors and texts will be published live to the homepage.'}
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-500'}`} />
            <span className="text-xs text-slate-400">
              {active ? (isArabic ? 'العرض سيُنشر في السلايدر كـ "نشط"' : 'Will publish as active') : (isArabic ? 'العرض سيُحفظ كـ "معطل"' : 'Will save as inactive')}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl text-xs font-black bg-[#00E5BE] hover:brightness-105 text-slate-950 shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{isArabic ? 'حفظ وتطبيق التخصيص' : 'Save & Publish Customization'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
