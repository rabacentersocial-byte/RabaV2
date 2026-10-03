import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  User, 
  Plus, 
  X, 
  Star, 
  Send 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PARENT_REVIEWS, SPECIALISTS } from '../data/mockData';
import { ParentReview } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface TestimonialsSectionProps {
  testimonials?: ParentReview[];
  onAddTestimonial?: (review: ParentReview) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials: propTestimonials,
  onAddTestimonial: propOnAdd
}) => {
  const { isArabic, direction } = useLanguage();

  const [reviewsList, setReviewsList] = useState<ParentReview[]>(
    propTestimonials || PARENT_REVIEWS
  );
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for adding new review
  const [authorName, setAuthorName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [selectedAvatarPreset, setSelectedAvatarPreset] = useState<string>('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('sensory');
  const [specialistName, setSpecialistName] = useState(SPECIALISTS[0].name);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Synchronize prop updates
  useEffect(() => {
    if (propTestimonials) {
      setReviewsList(propTestimonials);
    }
  }, [propTestimonials]);

  const presetAvatars = [
    { label: isArabic ? 'أم 1' : 'Mother 1', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
    { label: isArabic ? 'أب 1' : 'Father 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { label: isArabic ? 'أم 2' : 'Mother 2', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
    { label: isArabic ? 'أب 2' : 'Father 2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
  ];

  // Category filter tabs matching RABA center specialties and branches:
  const filterTabs = [
    { id: 'all', labelAr: 'كافة التقييمات', labelEn: 'All reviews' },
    { id: 'narjis', labelAr: 'فرع النرجس', labelEn: 'Al-Narjis Branch' },
    { id: 'mugharrazat', labelAr: 'فرع المغرزات', labelEn: 'Al-Mugharrazat' },
    { id: 'aba', labelAr: 'تحليل السلوك (ABA)', labelEn: 'ABA Therapy' },
    { id: 'speech', labelAr: 'النطق والتخاطب', labelEn: 'Speech Therapy' },
    { id: 'readiness', labelAr: 'فصول التهيئة والدمج', labelEn: 'School Readiness & Inclusion' },
    { id: 'assessment', labelAr: 'التشخيص والتقييم', labelEn: 'Assessment & Diagnosis' },
  ];

  // Filter reviews
  const filteredReviews = filterTopic === 'all'
    ? reviewsList
    : reviewsList.filter((r) => {
        if (filterTopic === 'narjis') {
          return (r.location && r.location.includes('النرجس')) || 
                 (r.locationEn && r.locationEn.includes('Narjis')) || 
                 (r.comment && r.comment.includes('النرجس'));
        }
        if (filterTopic === 'mugharrazat') {
          return (r.location && r.location.includes('المغرزات')) || 
                 (r.locationEn && r.locationEn.includes('Mugharrazat')) || 
                 (r.comment && r.comment.includes('المغرزات'));
        }
        if (filterTopic === 'readiness') {
          const c = (r.comment || '').toLowerCase();
          const iss = (r.childIssue || '').toLowerCase();
          return r.category === 'sensory' || c.includes('دمج') || c.includes('فصول') || c.includes('نادي') || iss.includes('دمج') || iss.includes('مدرسة');
        }
        if (r.category && r.category.toLowerCase() === filterTopic.toLowerCase()) return true;
        const matchingTab = filterTabs.find(t => t.id === filterTopic);
        if (!matchingTab) return false;
        
        const enCat = (r.categoryEn || '').toLowerCase();
        const tabEn = matchingTab.labelEn.toLowerCase();
        if (enCat.includes(tabEn) || tabEn.includes(enCat)) return true;

        const issue = (r.childIssue || '').toLowerCase();
        const commentText = (r.comment || '').toLowerCase();
        if (filterTopic === 'aba' && (issue.includes('سلوك') || issue.includes('aba') || commentText.includes('aba'))) return true;
        if (filterTopic === 'speech' && (issue.includes('نطق') || issue.includes('تخاطب') || issue.includes('كلام') || commentText.includes('تخاطب') || commentText.includes('يتكلم'))) return true;
        if (filterTopic === 'assessment' && (issue.includes('تقييم') || issue.includes('تشخيص') || commentText.includes('تشخيص') || commentText.includes('شخصو'))) return true;

        return false;
      });

  // Slider controls
  const handleScroll = (direction: 'next' | 'prev') => {
    const el = sliderRef.current;
    if (!el) return;
    const scrollAmount = 345;

    let delta = scrollAmount;
    if (direction === 'prev') {
      delta = -scrollAmount;
    }
    if (isArabic) {
      delta = -delta;
    }

    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  // Drag to scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = sliderRef.current;
    if (!el) return;
    setIsDragging(true);
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Submit new review
  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setFormError(isArabic ? 'يرجى كتابة نص التقييم أو الاقتباس الخاص بتجربتك' : 'Please write your testimonial quote or feedback');
      return;
    }

    const finalName = isAnonymous ? undefined : authorName.trim() || undefined;
    const finalAvatar = selectedAvatarPreset || (avatarUrl.trim() ? avatarUrl.trim() : undefined);

    const activeTab = filterTabs.find(t => t.id === selectedCategory);

    const newReview: ParentReview = {
      id: 'rev-' + Date.now(),
      parentName: finalName || (isArabic ? 'ولي أمر مستفيد' : 'Beneficiary Parent'),
      parentNameEn: finalName || 'Beneficiary Parent',
      isAnonymous: isAnonymous || !finalName,
      avatar: finalAvatar,
      location: locationName.trim() || (isArabic ? 'الرياض، المملكة' : 'Riyadh, KSA'),
      locationEn: locationName.trim() || 'Riyadh, KSA',
      category: selectedCategory,
      categoryEn: activeTab?.labelEn || 'General',
      treatedBy: specialistName ? (isArabic ? `تحت إشراف: ${specialistName}` : `Treated by ${specialistName}`) : undefined,
      treatedByEn: specialistName ? `Treated by ${specialistName}` : undefined,
      childIssue: isArabic ? 'برنامج علاجي وتأهيلي' : 'Therapy & Rehabilitation',
      childIssueEn: 'Therapy & Rehabilitation',
      rating: rating,
      comment: comment.trim(),
      commentEn: comment.trim(),
      specialistName: specialistName,
      date: isArabic ? 'اليوم' : 'Today',
      dateEn: 'Today',
      improvementDuration: isArabic ? 'مستفيد جديد' : 'New Beneficiary',
      improvementDurationEn: 'New Beneficiary',
      verifiedBeneficiary: true
    };

    if (propOnAdd) {
      propOnAdd(newReview);
    } else {
      setReviewsList((prev) => [newReview, ...prev]);
    }

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }

    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setIsAddModalOpen(false);
      setAuthorName('');
      setLocationName('');
      setIsAnonymous(false);
      setAvatarUrl('');
      setSelectedAvatarPreset('');
      setComment('');
      setFormError('');
      if (sliderRef.current) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }, 1200);
  };

  return (
    <section 
      id="testimonials" 
      className="py-16 sm:py-24 bg-transparent relative overflow-hidden transition-colors border-b border-slate-200/80 dark:border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP METRICS STRIP: 4 Columns with vertical dividers */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xs mb-12 sm:mb-16 overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200/80 dark:divide-white/10 [direction:ltr]">
            
            {/* Metric 1: Average Rating */}
            <div className="py-6 sm:py-8 px-4 sm:px-6 text-center">
              <div className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0B3B36] dark:text-[#2DD4BF] tracking-tight leading-none">
                4.9
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-2">
                {isArabic ? 'متوسط التقييم' : 'AVERAGE RATING'}
              </div>
            </div>

            {/* Metric 2: Verified Reviews */}
            <div className="py-6 sm:py-8 px-4 sm:px-6 text-center">
              <div className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0B3B36] dark:text-[#2DD4BF] tracking-tight leading-none">
                1,400+
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-2">
                {isArabic ? 'تقييم موثق' : 'VERIFIED REVIEWS'}
              </div>
            </div>

            {/* Metric 3: Would Recommend */}
            <div className="py-6 sm:py-8 px-4 sm:px-6 text-center">
              <div className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0B3B36] dark:text-[#2DD4BF] tracking-tight leading-none">
                98%
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-2">
                {isArabic ? 'يوصون بالمركز' : 'WOULD RECOMMEND'}
              </div>
            </div>

            {/* Metric 4: Booking Experience */}
            <div className="py-6 sm:py-8 px-4 sm:px-6 text-center">
              <div className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0B3B36] dark:text-[#2DD4BF] tracking-tight leading-none">
                4.8
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-2">
                {isArabic ? 'تجربة الحجز' : 'BOOKING EXPERIENCE'}
              </div>
            </div>

          </div>
        </div>

        {/* SECTION HEADER: Eyebrow + Title & Subtitle + Circular Nav Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          
          <div className={`max-w-2xl ${isArabic ? 'text-right' : 'text-left'}`}>
            
            {/* Small Uppercase Tracked Eyebrow */}
            <span className="text-[#0D6D54] dark:text-[#2DD4BF] text-[11px] sm:text-xs font-black tracking-widest uppercase block mb-2">
              {isArabic ? 'نتائج واقعية، تجارب حقيقية' : 'REAL PATIENTS, REAL RESULTS'}
            </span>

            {/* Main Headline with green terminal period */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-3">
              {isArabic ? (
                <span>
                  ماذا يقول أولياء الأمور عنّا<span className="text-[#0D6D54] dark:text-[#2DD4BF]">.</span>
                </span>
              ) : (
                <span>
                  What our patients say<span className="text-[#0D6D54] dark:text-[#2DD4BF]">.</span>
                </span>
              )}
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              {isArabic 
                ? 'كلمات صادقة من أشخاص وأسر عايشوا تجربة رابا على أرض الواقع.' 
                : 'Honest words from people who have experienced Wellside first-hand.'}
            </p>
          </div>

          {/* Right Circular Nav Arrows + Add Review Button */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
            
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-[#0D6D54] dark:text-[#2DD4BF]" />
              <span>{isArabic ? 'شاركنا رأيك' : 'Add review'}</span>
            </button>

            {/* Prev Arrow */}
            <button
              onClick={() => handleScroll('prev')}
              aria-label={isArabic ? 'التقييم السابق' : 'Previous review'}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              {isArabic ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            {/* Next Arrow */}
            <button
              onClick={() => handleScroll('next')}
              aria-label={isArabic ? 'التقييم التالي' : 'Next review'}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              {isArabic ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-3 mb-8">
          {filterTabs.map((tab) => {
            const isActive = filterTopic === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterTopic(tab.id)}
                className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 shadow-2xs whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0B3B36] dark:bg-[#00E5BE] text-white dark:text-slate-950 font-bold border border-[#0B3B36] dark:border-[#00E5BE] shadow-sm'
                    : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-white/10'
                }`}
              >
                {isArabic ? tab.labelAr : tab.labelEn}
              </button>
            );
          })}
        </div>

        {/* TESTIMONIALS SLIDER CARDS TRACK */}
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 ${
            isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
          }`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {filteredReviews.map((rev) => {
            const displayName = !isArabic && rev.parentNameEn ? rev.parentNameEn : rev.parentName;
            const displayComment = !isArabic && rev.commentEn ? rev.commentEn : rev.comment;
            const displayCategory = !isArabic && rev.categoryEn ? rev.categoryEn : (rev.category ? rev.category : 'ABA');
            const displayDate = !isArabic && rev.dateEn ? rev.dateEn : rev.date;
            const displayLocation = !isArabic && rev.locationEn ? rev.locationEn : (rev.location || (isArabic ? 'الرياض' : 'Riyadh'));
            const displayTreatedBy = !isArabic && rev.treatedByEn ? rev.treatedByEn : (rev.treatedBy || (rev.specialistName ? (isArabic ? `تحت إشراف: ${rev.specialistName}` : `Treated by ${rev.specialistName}`) : undefined));

            return (
              <div
                key={rev.id}
                className="w-[82vw] max-w-[325px] sm:w-[320px] md:w-[330px] shrink-0 snap-start bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-white/10 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  
                  {/* Top Row: Stars + Rating score on Left, Google Review Badge & Quotation Mark on Right */}
                  <div className="flex items-center justify-between gap-1.5 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center text-amber-400 gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < Math.floor(rev.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                        {rev.rating ? rev.rating.toFixed(1) : '5.0'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                        <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.99 0 12s.45 3.84 1.25 5.42l4.03-3.15z"/>
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                        </svg>
                        <span>Google</span>
                      </span>

                      <div className="text-xl text-emerald-300 dark:text-emerald-900/60 font-serif leading-none select-none font-bold">
                        “
                      </div>
                    </div>
                  </div>

                  {/* Review Text: compact, balanced height without dead empty space */}
                  <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-[13px] leading-relaxed mb-3 font-normal whitespace-pre-line max-h-[175px] overflow-y-auto pr-1 select-text">
                    “{displayComment}”
                  </p>

                </div>

                {/* Bottom Profile Row */}
                <div>
                  <div className="flex items-center justify-between gap-2.5 pt-2.5 border-t border-slate-100 dark:border-white/10">
                    
                    {/* Left: Avatar + Name with Verified Check + Location */}
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Anonymous User Silhouette Avatar */}
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center border border-slate-200 dark:border-white/10 shrink-0 shadow-2xs overflow-hidden">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white truncate">
                            {displayName}
                          </h4>
                          <CheckCircle2 className="w-3 h-3 text-[#0D6D54] dark:text-[#2DD4BF] shrink-0 fill-[#0D6D54]/10 dark:fill-[#2DD4BF]/10" />
                        </div>
                        <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                          {displayLocation}
                        </span>
                      </div>
                    </div>

                    {/* Right: Specialty / Category in Green + Date */}
                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-bold text-[#0D6D54] dark:text-[#2DD4BF] block max-w-[100px] truncate">
                        {displayCategory}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
                        {displayDate}
                      </span>
                    </div>

                  </div>

                  {/* "Treated by" Footnote */}
                  {displayTreatedBy && (
                    <div className="mt-1.5 pt-1 text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100/60 dark:border-white/5 truncate">
                      {displayTreatedBy}
                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* ADD TESTIMONIAL MODAL */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            className={`relative bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-white/15 overflow-hidden ${isArabic ? 'text-right' : 'text-left'} my-8`}
            onClick={(e) => e.stopPropagation()}
            id="add-testimonial-modal"
            dir={direction}
          >
            {/* Modal Header */}
            <div className="bg-[#0B3B36] p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black">{isArabic ? 'إضافة تقييم وتجربة جديدة' : 'Submit Review & Experience'}</h3>
                <p className="text-xs text-emerald-200/80 font-medium mt-1">{isArabic ? 'يسعدنا سماع تجربتك ورأيك في خدمات وأخصائيي المركز' : 'We value your experience and journey with our clinic'}</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label={isArabic ? 'إغلاق' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddReviewSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
              
              {formError && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-600 dark:text-rose-300 text-xs font-bold rounded-xl">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isArabic ? 'شكراً جزيلاً لمشاركتك! تم نشر تقييمك بنجاح 🎉' : 'Thank you for sharing! Your review is now live 🎉'}</span>
                </div>
              )}

              {/* Rating Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">{isArabic ? 'التقييم الإجمالي:' : 'Overall Rating:'}</label>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-white/10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className={`text-xs font-bold text-slate-800 dark:text-slate-200 ${isArabic ? 'mr-2' : 'ml-2'}`}>
                    {rating === 5 ? (isArabic ? 'ممتاز (5.0)' : '5.0 (Excellent)') : `${rating}.0`}
                  </span>
                </div>
              </div>

              {/* Quotation / Review Text */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'نص التجربة أو التقييم:' : 'Review Text:'} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={isArabic ? 'اكتب هنا تجربتك مع طفلك في المركز، مدى التحسن، ورأيك في تعامل الأخصائيين...' : 'Share your experience, clinician support, and outcomes...'}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl p-3 text-xs focus:ring-2 focus:ring-[#0D6D54]/50 outline-none"
                />
              </div>

              {/* Name & Location Fields */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {isArabic ? 'اسمك أو صفتك:' : 'Your Name:'}
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-3.5 h-3.5 text-emerald-600 rounded"
                    />
                    <span>{isArabic ? 'نشر باسم مجهول' : 'Submit Anonymously'}</span>
                  </label>
                </div>

                {!isAnonymous && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder={isArabic ? 'مثال: سارة المطيري' : 'e.g. Sarah Mitchell'}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#0D6D54]/50 outline-none"
                    />
                    <input
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder={isArabic ? 'المدينة / الحي: الرياض، الملقا' : 'City / Neighborhood: Brooklyn, NY'}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#0D6D54]/50 outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Avatar Preset */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 rounded-2xl space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {isArabic ? 'الصورة الشخصية أو الرمزية:' : 'Profile Picture:'}
                </label>

                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAvatarPreset('');
                      setAvatarUrl('');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                      !selectedAvatarPreset && !avatarUrl
                        ? 'bg-[#0B3B36] text-white border-[#0B3B36]'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/15 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'افتراضي' : 'Default'}</span>
                  </button>

                  {presetAvatars.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        setSelectedAvatarPreset(preset.url);
                        setAvatarUrl('');
                      }}
                      className={`relative rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedAvatarPreset === preset.url
                          ? 'border-[#0D6D54] ring-2 ring-[#0D6D54]/40 scale-105'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-8 h-8 rounded-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialty & Specialist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'التخصص / القسم:' : 'Specialty Track:'}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs outline-none"
                  >
                    <option value="sensory">{isArabic ? 'العلاج الوظيفي والتكامل الحسي (Cardiology)' : 'Cardiology (Sensory)'}</option>
                    <option value="aba">{isArabic ? 'تحليل السلوك التطبيقي (Dermatology)' : 'Dermatology (ABA)'}</option>
                    <option value="speech">{isArabic ? 'أمراض النطق والتخاطب (Family Med)' : 'Family Medicine (Speech)'}</option>
                    <option value="assessment">{isArabic ? 'التشخيص والتقييم النمائي (Neurology)' : 'Neurology (Assessment)'}</option>
                    <option value="physical">{isArabic ? 'العلاج الطبيعي والتأهيل الحركي (Orthopedics)' : 'Orthopedics (Physical)'}</option>
                    <option value="pediatrics">{isArabic ? 'التدخل المبكر للأطفال (Pediatrics)' : 'Pediatrics (Early Boost)'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'الأخصائي المعالج:' : 'Attending Clinician:'}
                  </label>
                  <select
                    value={specialistName}
                    onChange={(e) => setSpecialistName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs outline-none"
                  >
                    {SPECIALISTS.map((spec) => (
                      <option key={spec.id} value={spec.name}>
                        {spec.name} ({spec.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0B3B36] hover:bg-[#082a26] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Send className={`w-3.5 h-3.5 ${isArabic ? 'rotate-180' : ''}`} />
                  <span>{isArabic ? 'نشر التقييم' : 'Publish Review'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </section>
  );
};

export default TestimonialsSection;
