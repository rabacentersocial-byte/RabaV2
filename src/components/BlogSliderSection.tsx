import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Calendar, 
  Heart, 
  Share2, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  X, 
  UserCheck, 
  Bookmark, 
  Send,
  Brain,
  Target,
  Layers,
  MessageSquare,
  HeartHandshake
} from 'lucide-react';
import { BLOG_POSTS } from '../data/blogData';
import { BlogPost, Specialist } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { SPECIALISTS } from '../data/mockData';
import { getStoredBlogPosts } from '../data/blogCustomizer';

interface BlogSliderSectionProps {
  onOpenBooking?: () => void;
  onBookSpecialist?: (specialist: Specialist) => void;
}

export const BlogSliderSection: React.FC<BlogSliderSectionProps> = ({
  onOpenBooking,
  onBookSpecialist,
}) => {
  const { isArabic } = useLanguage();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Dynamic Stored Posts
  const [allPosts, setAllPosts] = useState<BlogPost[]>(() => getStoredBlogPosts());

  useEffect(() => {
    const handleUpdate = () => {
      setAllPosts(getStoredBlogPosts());
    };
    window.addEventListener('raba_blog_posts_updated', handleUpdate);
    window.addEventListener('raba_persistent_sync_ready', handleUpdate);
    return () => {
      window.removeEventListener('raba_blog_posts_updated', handleUpdate);
      window.removeEventListener('raba_persistent_sync_ready', handleUpdate);
    };
  }, []);

  // Filter posts (only published and slider featured)
  const visiblePosts = allPosts.filter(
    (post) => (post.status === undefined || post.status === 'published') && post.isSliderFeatured !== false
  );

  const filteredPosts = activeCategory === 'all'
    ? visiblePosts
    : visiblePosts.filter(post => post.category === activeCategory);

  // Categories list
  const categories = [
    { id: 'all', labelAr: 'جميع المقالات', labelEn: 'All Articles' },
    { id: 'autism', labelAr: 'طيف التوحد والتدخل المبكر', labelEn: 'Autism & Early Intervention' },
    { id: 'aba', labelAr: 'تحليل السلوك التطبيقي (ABA)', labelEn: 'Applied Behavior Analysis' },
    { id: 'occupational', labelAr: 'العلاج الوظيفي والتكامل الحسي', labelEn: 'Occupational Therapy' },
    { id: 'speech', labelAr: 'النطق والتخاطب والتواصل', labelEn: 'Speech & Language' },
    { id: 'family_guidance', labelAr: 'إرشادات أسرية وتعديل روتين', labelEn: 'Family Guidance' },
  ];

  const scrollLeft = () => {
    if (sliderRef.current) {
      const scrollAmount = isArabic ? 380 : -380;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      const scrollAmount = isArabic ? -380 : 380;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left
        if (isArabic) scrollLeft();
        else scrollRight();
      } else {
        // Swiped right
        if (isArabic) scrollRight();
        else scrollLeft();
      }
    }
    setTouchStart(null);
  };

  const toggleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleShare = (e: React.MouseEvent, post: BlogPost) => {
    e.stopPropagation();
    const title = isArabic ? post.title : (post.titleEn || post.title);
    const url = window.location.href.split('#')[0] + `#blog-${post.slug}`;
    
    if (navigator.share) {
      navigator.share({
        title,
        text: isArabic ? post.excerpt : (post.excerptEn || post.excerpt),
        url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setShareFeedback(post.id);
      setTimeout(() => setShareFeedback(null), 2500);
    }
  };

  const handleAuthorClick = (e: React.MouseEvent, authorId?: string) => {
    e.stopPropagation();
    if (!authorId || !onBookSpecialist) return;
    const matched = SPECIALISTS.find(s => s.id === authorId);
    if (matched) {
      onBookSpecialist(matched);
    }
  };

  // Custom Category Icons and Card Theming (replacing stock photos with integrated branding)
  const getCategoryIconConfig = (cat?: string) => {
    switch (cat) {
      case 'autism':
        return {
          icon: Brain,
          iconBoxBg: 'bg-sky-50 dark:bg-sky-950/60 text-[#0284C7] dark:text-[#38bdf8] border-sky-200/90 dark:border-sky-800/50 shadow-sky-500/10',
          headerBg: 'bg-gradient-to-br from-sky-500/10 via-sky-500/[0.03] to-transparent dark:from-sky-950/40 dark:via-transparent',
          headerBorder: 'border-b border-sky-100 dark:border-white/5',
          badgeBg: 'bg-[#008CD3] text-white',
        };
      case 'aba':
        return {
          icon: Target,
          iconBoxBg: 'bg-teal-50 dark:bg-teal-950/60 text-[#0d5c52] dark:text-[#2dd4bf] border-teal-200/90 dark:border-teal-800/50 shadow-teal-500/10',
          headerBg: 'bg-gradient-to-br from-teal-500/10 via-[#0d5c52]/[0.03] to-transparent dark:from-teal-950/40 dark:via-transparent',
          headerBorder: 'border-b border-teal-100 dark:border-white/5',
          badgeBg: 'bg-[#0d5c52] text-white',
        };
      case 'occupational':
        return {
          icon: Layers,
          iconBoxBg: 'bg-amber-50 dark:bg-amber-950/60 text-[#D97706] dark:text-[#fbbf24] border-amber-200/90 dark:border-amber-800/50 shadow-amber-500/10',
          headerBg: 'bg-gradient-to-br from-amber-500/10 via-amber-500/[0.03] to-transparent dark:from-amber-950/40 dark:via-transparent',
          headerBorder: 'border-b border-amber-100 dark:border-white/5',
          badgeBg: 'bg-[#D97706] text-white',
        };
      case 'speech':
        return {
          icon: MessageSquare,
          iconBoxBg: 'bg-purple-50 dark:bg-purple-950/60 text-[#7C3AED] dark:text-[#c084fc] border-purple-200/90 dark:border-purple-800/50 shadow-purple-500/10',
          headerBg: 'bg-gradient-to-br from-purple-500/10 via-purple-500/[0.03] to-transparent dark:from-purple-950/40 dark:via-transparent',
          headerBorder: 'border-b border-purple-100 dark:border-white/5',
          badgeBg: 'bg-[#7C3AED] text-white',
        };
      case 'family_guidance':
        return {
          icon: HeartHandshake,
          iconBoxBg: 'bg-rose-50 dark:bg-rose-950/60 text-[#E11D48] dark:text-[#fb7185] border-rose-200/90 dark:border-rose-800/50 shadow-rose-500/10',
          headerBg: 'bg-gradient-to-br from-rose-500/10 via-rose-500/[0.03] to-transparent dark:from-rose-950/40 dark:via-transparent',
          headerBorder: 'border-b border-rose-100 dark:border-white/5',
          badgeBg: 'bg-[#E11D48] text-white',
        };
      default:
        return {
          icon: BookOpen,
          iconBoxBg: 'bg-teal-50 dark:bg-teal-950/60 text-[#0d5c52] dark:text-[#2dd4bf] border-teal-200/90 dark:border-teal-800/50 shadow-teal-500/10',
          headerBg: 'bg-gradient-to-br from-teal-500/10 via-teal-500/[0.03] to-transparent dark:from-teal-950/40 dark:via-transparent',
          headerBorder: 'border-b border-teal-100 dark:border-white/5',
          badgeBg: 'bg-[#0d5c52] text-white',
        };
    }
  };

  return (
    <section 
      id="blog" 
      className="py-16 sm:py-24 relative overflow-hidden bg-transparent text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-white/10 transition-colors"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Background ambient lighting aligned with Brand Teal & Cyan */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-gradient-to-br from-teal-500/10 via-[#0d5c52]/5 to-transparent rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dff1ec] dark:bg-teal-950/60 border border-[#0d5c52]/20 dark:border-[#2dd4bf]/20 text-[#0d5c52] dark:text-[#2dd4bf] text-xs font-black shadow-xs">
              <BookOpen className="w-4 h-4 text-[#0d5c52] dark:text-[#2dd4bf]" />
              <span>{isArabic ? 'المدونة الطبية والدليل المعرفي' : 'Clinical Blog & Knowledge Guide'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0f2d29] dark:text-white tracking-tight leading-tight">
              {isArabic ? (
                <>
                  مقالات إكلينيكية وإرشادات موثوقة{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d5c52] via-[#0284C7] to-[#0d5c52] dark:from-[#2dd4bf] dark:via-sky-400 dark:to-[#2dd4bf]">
                    لتطور طفلك
                  </span>
                </>
              ) : (
                <>
                  Clinical Insights & Guidance for{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d5c52] via-[#0284C7] to-[#0d5c52] dark:from-[#2dd4bf] dark:via-sky-400 dark:to-[#2dd4bf]">
                    Your Child’s Growth
                  </span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {isArabic 
                ? 'محتوى علمي وتأهيلي معتمد كتبه نخبة من استشاريي وأخصائيي مركز رابا، يقدم حلولاً عملية وتوجيهات أسرية مثبتة بالأدلة الإكلينيكية.'
                : 'Evidence-based guidance written by Raba Center specialists to support parents through diagnostic, sensory, and behavioral milestones.'}
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
            <button
              onClick={scrollRight}
              aria-label={isArabic ? 'السابق' : 'Previous'}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-white flex items-center justify-center hover:bg-[#dff1ec]/60 dark:hover:bg-teal-950/60 hover:text-[#0d5c52] dark:hover:text-[#2dd4bf] hover:border-[#0d5c52]/30 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isArabic ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
            <button
              onClick={scrollLeft}
              aria-label={isArabic ? 'التالي' : 'Next'}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-white flex items-center justify-center hover:bg-[#dff1ec]/60 dark:hover:bg-teal-950/60 hover:text-[#0d5c52] dark:hover:text-[#2dd4bf] hover:border-[#0d5c52]/30 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isArabic ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Categories Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-6 no-scrollbar scroll-smooth">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#0d5c52] to-[#115e59] text-white font-black shadow-md shadow-teal-900/20 scale-[1.02] border border-[#0d5c52]'
                    : 'bg-white/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-[#0d5c52]/40 hover:text-[#0d5c52] dark:hover:text-[#2dd4bf]'
                }`}
              >
                {isArabic ? cat.labelAr : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* Blog Posts Slider */}
        <div
          ref={sliderRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          {filteredPosts.map((post) => {
            const isLiked = likedPosts[post.id] || false;
            const currentLikes = post.likesCount + (isLiked ? 1 : 0);
            const categoryConfig = getCategoryIconConfig(post.category);
            const CategoryIcon = categoryConfig.icon;

            return (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="w-[88vw] max-w-[370px] sm:w-[360px] md:w-[380px] lg:w-[400px] shrink-0 snap-start liquid-glass-card rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                {/* 1. Integrated Custom Header with Topic Icon (No Photos) */}
                <div className={`p-6 sm:p-7 pb-5 ${categoryConfig.headerBg} ${categoryConfig.headerBorder} relative transition-colors`}>
                  {/* Top Row: Category Badge & Custom Integrated Icon Box */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    {/* Category Badge matching Brand Petal Color */}
                    <span className={`${categoryConfig.badgeBg} text-[11px] font-black px-3.5 py-1.5 rounded-xl shadow-xs tracking-tight`}>
                      {isArabic ? post.categoryTitle : (post.categoryTitleEn || post.categoryTitle)}
                    </span>

                    {/* Custom Integrated Icon Box */}
                    <div className={`w-12 h-12 rounded-2xl ${categoryConfig.iconBoxBg} border flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                      <CategoryIcon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Integrated Metadata Strip: Reading Time, Views & Date */}
                  <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{post.readTimeMinutes} {isArabic ? 'دقائق قراءة' : 'min read'}</span>
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{post.viewsCount} {isArabic ? 'مشاهدة' : 'views'}</span>
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#0d5c52] dark:text-[#2dd4bf] shrink-0" />
                      <span>{isArabic ? post.publishDate : (post.publishDateEn || post.publishDate)}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                  <div>
                    {/* Publication Date */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
                      <Calendar className="w-3.5 h-3.5 text-[#0d5c52] dark:text-[#2dd4bf]" />
                      <span>{isArabic ? post.publishDate : (post.publishDateEn || post.publishDate)}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug group-hover:text-[#0d5c52] dark:group-hover:text-[#2dd4bf] transition-colors mb-2.5">
                      {isArabic ? post.title : (post.titleEn || post.title)}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                      {isArabic ? post.excerpt : (post.excerptEn || post.excerpt)}
                    </p>

                    {/* Key Takeaway Snippet */}
                    {post.keyTakeaways && post.keyTakeaways.length > 0 && (
                      <div className="bg-[#dff1ec]/40 dark:bg-teal-950/30 border border-[#0d5c52]/15 dark:border-[#2dd4bf]/20 rounded-xl p-3 mb-4 text-xs">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#0d5c52] dark:text-[#2dd4bf] shrink-0 mt-0.5" />
                          <span className="text-slate-700 dark:text-slate-200 line-clamp-2 leading-relaxed font-medium">
                            {isArabic 
                              ? post.keyTakeaways[0] 
                              : (post.keyTakeawaysEn?.[0] || post.keyTakeaways[0])}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#0d5c52] dark:text-[#2dd4bf] group-hover:gap-2.5 transition-all">
                      <span>{isArabic ? 'قراءة المقال بالكامل' : 'Read Article'}</span>
                      {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </span>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {/* Like button */}
                      <button
                        onClick={(e) => toggleLike(e, post.id)}
                        aria-label="Like post"
                        className={`p-2 rounded-xl flex items-center gap-1 text-xs font-bold transition-all ${
                          isLiked 
                            ? 'text-rose-600 bg-rose-50 dark:bg-rose-500/15' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{currentLikes}</span>
                      </button>

                      {/* Share button */}
                      <button
                        onClick={(e) => handleShare(e, post)}
                        aria-label="Share post"
                        className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-[#0d5c52] dark:hover:text-[#2dd4bf] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors relative"
                      >
                        <Share2 className="w-4 h-4" />
                        {shareFeedback === post.id && (
                          <span className="absolute -top-7 right-0 text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded shadow whitespace-nowrap z-20">
                            {isArabic ? 'تم نسخ الرابط' : 'Link copied'}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Banner with Consultation Hook Aligned with Brand Palette */}
        <div className="mt-10 sm:mt-14 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#0d5c52]/20 dark:border-[#2dd4bf]/20 bg-gradient-to-r from-[#dff1ec]/60 via-white dark:via-slate-900 to-[#dff1ec]/30 dark:from-teal-950/40 dark:to-slate-900 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0d5c52] to-[#14b8a6] text-white flex items-center justify-center shrink-0 shadow-md shadow-teal-900/15">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#0f2d29] dark:text-white">
                {isArabic ? 'هل ترغب في استشارة إكلينيكية متخصصة لحالة طفلك؟' : 'Need a specialized clinical consultation for your child?'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                {isArabic 
                  ? 'فريقنا الاستشاري المرخص من الهيئة السعودية للتخصصات الصحية جاهز لإجراء تقييم شامل ووضع خطة علاجية مخصصة.'
                  : 'Our licensed team is ready to conduct a standardized evaluation and build a personalized rehabilitation program.'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenBooking}
            className="w-full md:w-auto shrink-0 bg-gradient-to-r from-[#0d5c52] via-[#0f766e] to-[#115e59] hover:brightness-110 active:scale-95 text-white font-black px-6 sm:px-8 py-3.5 rounded-2xl shadow-lg shadow-teal-900/25 transition-all text-sm sm:text-base cursor-pointer text-center"
          >
            {isArabic ? 'احجز موعد تقييم فوري' : 'Book Evaluation Now'}
          </button>
        </div>

      </div>

      {/* Full Article Reading Modal */}
      {selectedPost && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            className="bg-white dark:bg-[#0D1B2A] rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-white/15 relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Modal Header Sticky Top */}
            <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#0D1B2A]/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              {(() => {
                const modalConfig = getCategoryIconConfig(selectedPost.category);
                return (
                  <div className="flex items-center gap-2">
                    <span className={`${modalConfig.badgeBg} text-xs font-black px-3 py-1 rounded-xl shadow-xs`}>
                      {isArabic ? selectedPost.categoryTitle : (selectedPost.categoryTitleEn || selectedPost.categoryTitle)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{selectedPost.readTimeMinutes} {isArabic ? 'دقائق قراءة' : 'min read'}</span>
                    </span>
                  </div>
                );
              })()}

              <button
                onClick={() => setSelectedPost(null)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-[#111827] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1F2937] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Article Hero Banner with Integrated Custom Icon (No Stock Photo) */}
              {(() => {
                const modalConfig = getCategoryIconConfig(selectedPost.category);
                const ModalIcon = modalConfig.icon;
                return (
                  <div className={`p-6 sm:p-7 rounded-2xl ${modalConfig.headerBg} border ${modalConfig.headerBorder} flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-right rtl:sm:text-right ltr:sm:text-left shadow-xs`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl ${modalConfig.iconBoxBg} border flex items-center justify-center shrink-0 shadow-xs`}>
                        <ModalIcon className="w-8 h-8" />
                      </div>
                      <div>
                        <span className={`${modalConfig.badgeBg} text-xs font-black px-3 py-1 rounded-xl shadow-xs inline-block mb-1.5`}>
                          {isArabic ? selectedPost.categoryTitle : (selectedPost.categoryTitleEn || selectedPost.categoryTitle)}
                        </span>
                        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                          {isArabic ? 'دليل إكلينيكي وتأهيلي معتمد' : 'Evidence-Based Clinical Guide'}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>{selectedPost.readTimeMinutes} {isArabic ? 'دقائق' : 'min'}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-[#0d5c52] dark:text-[#2dd4bf]" />
                        <span>{selectedPost.viewsCount} {isArabic ? 'مشاهدة' : 'views'}</span>
                      </span>
                      <span>·</span>
                      <span>{isArabic ? selectedPost.publishDate : (selectedPost.publishDateEn || selectedPost.publishDate)}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Title & Metadata */}
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                  {isArabic ? selectedPost.title : (selectedPost.titleEn || selectedPost.title)}
                </h2>

                {/* Author Card */}
                <div 
                  onClick={(e) => handleAuthorClick(e, selectedPost.author.id)}
                  className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-white/10 hover:border-[#0d5c52]/50 dark:hover:border-[#2dd4bf]/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedPost.author.avatar || '/specialists/spec_haneen_obaidi_1790197216150.jpg'}
                      alt={selectedPost.author.name}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/specialists/spec_haneen_obaidi_1790197216150.jpg';
                      }}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#0d5c52] dark:group-hover:text-[#2dd4bf] transition-colors">
                          {isArabic ? selectedPost.author.name : (selectedPost.author.nameEn || selectedPost.author.name)}
                        </span>
                        <UserCheck className="w-3.5 h-3.5 text-[#0d5c52] dark:text-[#2dd4bf]" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isArabic ? selectedPost.author.role : (selectedPost.author.roleEn || selectedPost.author.role)}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#0d5c52] dark:text-[#2dd4bf] hidden xs:inline">
                    {isArabic ? 'عرض ملف الأخصائي' : 'View Profile'}
                  </span>
                </div>
              </div>

              {/* Key Takeaways Box */}
              {selectedPost.keyTakeaways && selectedPost.keyTakeaways.length > 0 && (
                <div className="bg-[#dff1ec]/50 dark:bg-teal-950/40 border border-[#0d5c52]/20 dark:border-[#2dd4bf]/20 rounded-2xl p-4 sm:p-5">
                  <h4 className="text-sm font-black text-[#0f2d29] dark:text-[#2dd4bf] mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0d5c52] dark:text-[#2dd4bf]" />
                    <span>{isArabic ? 'أبرز المخرجات والنقاط الإكلينيكية:' : 'Key Clinical Takeaways:'}</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    {(isArabic ? selectedPost.keyTakeaways : (selectedPost.keyTakeawaysEn || selectedPost.keyTakeaways)).map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0d5c52] dark:bg-[#2dd4bf] shrink-0 mt-2" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Full Article Text */}
              <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-loose">
                {(isArabic ? selectedPost.content : (selectedPost.contentEn || selectedPost.content)).map((paragraph, idx) => (
                  <p key={idx} className="font-normal">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-200 dark:border-white/10">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'الوسوم:' : 'Tags:'}</span>
                </span>
                {(isArabic ? selectedPost.tags : (selectedPost.tagsEn || selectedPost.tags)).map((tag, idx) => (
                  <span key={idx} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-xl">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Call to Action Inside Modal */}
              <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0E2A54] via-[#153E75] to-[#2E86EB] rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-blue-900/20">
                <div>
                  <h4 className="font-black text-base">
                    {isArabic ? 'هل تود استشارة الكاتب حول طفلك؟' : 'Want to consult the author about your child?'}
                  </h4>
                  <p className="text-xs text-blue-100 mt-0.5">
                    {isArabic 
                      ? 'يمكنك حجز جلسة تقييم مباشرة مع الأخصائي أو الفريق الإكلينيكي المعالج.' 
                      : 'You can book a direct diagnostic or rehabilitation session.'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedPost(null);
                    if (selectedPost.author.id && onBookSpecialist) {
                      const matched = SPECIALISTS.find(s => s.id === selectedPost.author.id);
                      if (matched) {
                        onBookSpecialist(matched);
                        return;
                      }
                    }
                    if (onOpenBooking) onOpenBooking();
                  }}
                  className="w-full sm:w-auto shrink-0 bg-white text-[#0E2A54] font-black px-6 py-3 rounded-xl hover:bg-[#FFD23F] transition-colors text-xs sm:text-sm cursor-pointer shadow-md"
                >
                  {isArabic ? 'احجز استشارة مع الأخصائي' : 'Book Consultation'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
};
