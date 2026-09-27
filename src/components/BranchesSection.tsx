import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  MapPin, 
  Navigation, 
  MessageCircle, 
  ChevronRight, 
  ChevronLeft, 
  Phone, 
  Clock, 
  Compass,
  SlidersHorizontal,
  LayoutGrid
} from 'lucide-react';
import { getStoredBranchesData, BranchItem } from '../data/branchesData';
import { BranchMapPinGraphic } from './BranchMapPinGraphic';
import { useLanguage } from '../context/LanguageContext';

interface BranchesSectionProps {
  onSelectBranch?: (branch: BranchItem) => void;
}

export const BranchesSection: React.FC<BranchesSectionProps> = ({ onSelectBranch }) => {
  const { isArabic } = useLanguage();
  const [branches, setBranches] = useState<BranchItem[]>(() => getStoredBranchesData());
  const [selectedCity, setSelectedCity] = useState<'all' | 'riyadh' | 'jeddah' | 'khobar' | 'ahsa' | 'kharj'>('all');
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  
  // Slider reference & state
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const movedDistanceRef = useRef(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sync with updates from other tabs or persistent storage
  useEffect(() => {
    const handleUpdate = () => {
      setBranches(getStoredBranchesData());
    };
    window.addEventListener('raba_branches_updated', handleUpdate);
    window.addEventListener('raba_persistent_sync_ready' as any, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('raba_branches_updated', handleUpdate);
      window.removeEventListener('raba_persistent_sync_ready' as any, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const filteredBranches = branches.filter((b) => {
    if (selectedCity === 'all') return true;
    return b.city === selectedCity;
  });

  const riyadhCount = branches.filter(b => b.city === 'riyadh').length;
  const jeddahCount = branches.filter(b => b.city === 'jeddah').length;
  const khobarCount = branches.filter(b => b.city === 'khobar').length;
  const ahsaCount = branches.filter(b => b.city === 'ahsa').length;
  const kharjCount = branches.filter(b => b.city === 'kharj').length;

  const updateScrollState = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const current = Math.abs(el.scrollLeft);

    setCanScrollPrev(current > 15);
    setCanScrollNext(current < maxScroll - 15);

    const slideWidth = 360;
    const index = Math.round(current / slideWidth);
    setCurrentIndex(Math.min(Math.max(0, index), filteredBranches.length - 1));
  }, [filteredBranches.length]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [filteredBranches, updateScrollState]);

  const handleScroll = (direction: 'prev' | 'next') => {
    const el = sliderRef.current;
    if (!el) return;
    const scrollAmount = 370;

    let delta = scrollAmount;
    if (direction === 'prev') {
      delta = -scrollAmount;
    }
    if (isArabic) {
      delta = -delta;
    }

    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const scrollToIndex = (index: number) => {
    const el = sliderRef.current;
    if (!el) return;
    const slideWidth = 370;
    let target = index * slideWidth;
    if (isArabic) target = -target;
    el.scrollTo({ left: target, behavior: 'smooth' });
  };

  // Drag handlers for desktop smooth dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = sliderRef.current;
    if (!el) return;
    setIsDragging(true);
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
    movedDistanceRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    movedDistanceRef.current += Math.abs(walk);
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <section 
      id="branches" 
      className="py-16 sm:py-24 bg-[#0F172A] text-white relative overflow-hidden transition-colors border-b border-white/10"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Background Ambience & Lighting */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title & Controls Bar */}
        <div className="mb-8 space-y-6">
          {/* Main Title Block */}
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00E5BE]/10 border border-[#00E5BE]/30 text-[#00E5BE] text-xs font-black mb-3 shadow-2xs">
              <Compass className="w-4 h-4 text-[#00E5BE]" />
              <span>{isArabic ? 'شبكة فروع مركز رابا' : 'RABA CENTER BRANCH NETWORK'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3 [text-wrap:balance]">
              {isArabic ? (
                <>
                  <span className="inline-block">فروعنا المعتمدة</span>{' '}
                  <span className="inline-block bg-gradient-to-r from-[#00E5BE] to-[#38BDF8] bg-clip-text text-transparent">
                    داخل المملكة العربية السعودية
                  </span>
                </>
              ) : (
                <>
                  Our Accredited Branches <span className="text-[#00E5BE]">Across Saudi Arabia</span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-3xl [text-wrap:pretty]">
              {isArabic 
                ? 'مراكز وعيادات مجهزة بأعلى المعايير العالمية لتقديم خدمات التأهيل وتحليل السلوك في بيئة مهيأة وآمنة لطفلك في الرياض، وجدة، والخبر، والأحساء، والخرج.'
                : 'Clinics equipped with international clinical standards for behavioral and occupational rehabilitation across Riyadh, Jeddah, Al-Khobar, Al-Ahsa, and Al-Kharj.'}
            </p>
          </div>

          {/* Controls: Filter tabs & Slider Navigation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
            
            {/* City Filter Tabs */}
            <div className="bg-slate-800/90 p-1.5 rounded-2xl border border-white/10 flex items-center gap-1 shadow-xs overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSelectedCity('all')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCity === 'all'
                    ? 'bg-[#00E5BE] text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>{isArabic ? 'كافة الفروع' : 'All Branches'}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-md font-bold ${
                  selectedCity === 'all' ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-300'
                }`}>
                  {branches.length}
                </span>
              </button>

              <button
                onClick={() => setSelectedCity('riyadh')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCity === 'riyadh'
                    ? 'bg-[#00E5BE] text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>{isArabic ? 'الرياض' : 'Riyadh'}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-md font-bold ${
                  selectedCity === 'riyadh' ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-300'
                }`}>
                  {riyadhCount}
                </span>
              </button>

              <button
                onClick={() => setSelectedCity('jeddah')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCity === 'jeddah'
                    ? 'bg-[#00E5BE] text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>{isArabic ? 'جدة' : 'Jeddah'}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-md font-bold ${
                  selectedCity === 'jeddah' ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-300'
                }`}>
                  {jeddahCount}
                </span>
              </button>

              <button
                onClick={() => setSelectedCity('khobar')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCity === 'khobar'
                    ? 'bg-[#00E5BE] text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>{isArabic ? 'الخبر' : 'Al-Khobar'}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-md font-bold ${
                  selectedCity === 'khobar' ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-300'
                }`}>
                  {khobarCount}
                </span>
              </button>

              <button
                onClick={() => setSelectedCity('ahsa')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCity === 'ahsa'
                    ? 'bg-[#00E5BE] text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>{isArabic ? 'الأحساء' : 'Al-Ahsa'}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-md font-bold ${
                  selectedCity === 'ahsa' ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-300'
                }`}>
                  {ahsaCount}
                </span>
              </button>

              <button
                onClick={() => setSelectedCity('kharj')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCity === 'kharj'
                    ? 'bg-[#00E5BE] text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>{isArabic ? 'الخرج' : 'Al-Kharj'}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-md font-bold ${
                  selectedCity === 'kharj' ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-300'
                }`}>
                  {kharjCount}
                </span>
              </button>
            </div>

            {/* View Mode Toggle & Slider Navigation */}
            <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
              {/* View Mode Toggle (Slider / Grid) */}
              <div className="bg-slate-800/90 p-1 rounded-2xl border border-white/10 flex items-center shadow-xs">
                <button
                  onClick={() => setViewMode('slider')}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    viewMode === 'slider' 
                      ? 'bg-[#00E5BE] text-slate-950 shadow-xs' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={isArabic ? 'عرض سلايدر تفاعلي' : 'Slider View'}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    viewMode === 'grid' 
                      ? 'bg-[#00E5BE] text-slate-950 shadow-xs' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={isArabic ? 'عرض شبكي' : 'Grid View'}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              {/* Slider Next / Prev Arrows */}
              {viewMode === 'slider' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleScroll('prev')}
                    disabled={!canScrollPrev}
                    aria-label={isArabic ? 'الفرع السابق' : 'Previous branch'}
                    className={`w-10 h-10 rounded-full border border-white/15 bg-slate-800 text-slate-200 flex items-center justify-center shadow-xs transition-all cursor-pointer ${
                      canScrollPrev 
                        ? 'hover:bg-slate-700 hover:text-white active:scale-95' 
                        : 'opacity-40 cursor-not-allowed'
                    }`}
                  >
                    {isArabic ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => handleScroll('next')}
                    disabled={!canScrollNext}
                    aria-label={isArabic ? 'الفرع التالي' : 'Next branch'}
                    className={`w-10 h-10 rounded-full border border-white/15 bg-slate-800 text-slate-200 flex items-center justify-center shadow-xs transition-all cursor-pointer ${
                      canScrollNext 
                        ? 'hover:bg-slate-700 hover:text-white active:scale-95' 
                        : 'opacity-40 cursor-not-allowed'
                    }`}
                  >
                    {isArabic ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* SLIDER / GRID CONTAINER */}
        {viewMode === 'slider' ? (
          <div className="relative">
            <div
              ref={sliderRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`flex gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4 px-1 ${
                isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
              }`}
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {filteredBranches.map((branch) => (
                <div
                  key={branch.id}
                  className="w-[85vw] max-w-[360px] sm:w-[350px] md:w-[365px] shrink-0 snap-start bg-[#16202C] rounded-3xl overflow-hidden border border-white/10 shadow-2xl hover:border-[#00E5BE]/40 transition-all duration-300 flex flex-col justify-between group relative"
                >
                  {/* Top: 3D Map Pin Graphic */}
                  <div className="relative h-60 overflow-hidden bg-[#0e1722]">
                    <BranchMapPinGraphic branchName={branch.name} />

                    {/* City Tag Indicator Overlay */}
                    <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-300 border border-white/10 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#00E5BE]" />
                      <span>{isArabic ? branch.cityNameAr : branch.cityNameEn}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5 bg-[#16202C]">
                    
                    <div className="space-y-3">
                      {/* Region Tag Pill */}
                      <div className="flex items-center justify-between">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${branch.badgeColorClass}`}>
                          {isArabic ? branch.regionBadgeAr : branch.regionBadgeEn}
                        </span>

                        <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#00E5BE]" />
                          <span>{isArabic ? branch.hoursAr : branch.hoursEn}</span>
                        </span>
                      </div>

                      {/* Branch Name */}
                      <h3 className="text-xl font-black text-white group-hover:text-[#00E5BE] transition-colors">
                        {isArabic ? branch.name : branch.nameEn}
                      </h3>

                      {/* Branch Address */}
                      <div className="text-xs text-slate-300 leading-relaxed min-h-[48px]">
                        <span className="font-bold text-white ml-1">{isArabic ? 'العنوان:' : 'Address:'}</span>
                        <span>{isArabic ? branch.address : branch.addressEn}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                      
                      {/* Google Maps Button */}
                      <a
                        href={branch.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-3 bg-[#0F2438] hover:bg-[#15324d] text-white text-xs font-bold rounded-xl border border-white/15 hover:border-cyan-500/40 transition-all flex items-center justify-center gap-1.5 text-center shadow-xs active:scale-95 cursor-pointer"
                        title={isArabic ? `عرض موقع ${branch.name} على خرائط Google` : 'View on Google Maps'}
                      >
                        <Navigation className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{isArabic ? 'خرائط Google' : 'Google Maps'}</span>
                      </a>

                      {/* WhatsApp Button */}
                      <a
                        href={branch.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-3 bg-[#00E5BE] hover:bg-[#00ffd2] text-slate-950 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 text-center shadow-lg shadow-teal-500/20 active:scale-95 cursor-pointer"
                        title={isArabic ? `تواصل واتساب مع ${branch.name}` : 'Chat on WhatsApp'}
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
                        <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span>
                      </a>

                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Slider Dot Indicators */}
            <div className="flex justify-center items-center gap-2 mt-6">
              {filteredBranches.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToIndex(idx)}
                  aria-label={`الانتقال للفرع ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx 
                      ? 'w-8 bg-[#00E5BE]' 
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBranches.map((branch) => (
              <div
                key={branch.id}
                className="bg-[#16202C] rounded-3xl overflow-hidden border border-white/10 shadow-2xl hover:border-[#00E5BE]/40 transition-all duration-300 flex flex-col justify-between group relative"
              >
                <div className="relative h-56 overflow-hidden bg-[#0e1722]">
                  <BranchMapPinGraphic branchName={branch.name} />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-300 border border-white/10 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#00E5BE]" />
                    <span>{isArabic ? branch.cityNameAr : branch.cityNameEn}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-[#16202C]">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black border ${branch.badgeColorClass}`}>
                        {isArabic ? branch.regionBadgeAr : branch.regionBadgeEn}
                      </span>

                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#00E5BE]" />
                        <span>{isArabic ? branch.hoursAr : branch.hoursEn}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white group-hover:text-[#00E5BE] transition-colors">
                      {isArabic ? branch.name : branch.nameEn}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed min-h-[48px]">
                      <span className="font-bold text-white ml-1">{isArabic ? 'العنوان:' : 'Address:'}</span>
                      <span>{isArabic ? branch.address : branch.addressEn}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                    <a
                      href={branch.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-2 bg-[#0F2438] hover:bg-[#15324d] text-white text-xs font-bold rounded-xl border border-white/15 transition-all flex items-center justify-center gap-1 text-center cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isArabic ? 'خرائط Google' : 'Maps'}</span>
                    </a>

                    <a
                      href={branch.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-2 bg-[#00E5BE] hover:bg-[#00ffd2] text-slate-950 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1 text-center cursor-pointer shadow-md shadow-teal-500/20"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
                      <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Unified Contact Bar below Branches */}
        <div className="mt-12 bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-right">
            <div className="w-10 h-10 rounded-xl bg-[#00E5BE]/10 border border-[#00E5BE]/20 flex items-center justify-center text-[#00E5BE] shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold">{isArabic ? 'الرقم الموحد لكافة فروع المملكة:' : 'Unified Branch Call Center (KSA):'}</div>
              <a href="tel:0575100100" className="text-base font-black text-white hover:text-[#00E5BE] transition-colors" dir="ltr">
                0575100100
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/966575100100?text=السلام%20عليكم،%20أود%20الاستفسار%20عن%20أقرب%20فرع%20لمركز%20رابا%20في%20المملكة"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#00E5BE] hover:bg-[#00ffd2] text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-teal-500/20 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>{isArabic ? 'استشرنا لتحديد أقرب فرع لطفلك' : 'Find Closest Branch'}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
