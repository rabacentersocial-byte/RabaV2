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
  Send 
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

  return (
    <section 
      id="blog" 
      className="py-16 sm:py-24 relative overflow-hidden bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-200/80 dark:border-white/10 transition-colors"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-[#00E5BE]/10 dark:bg-[#00E5BE]/15 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 border border-sky-400/30 text-sky-700 dark:text-[#00E5BE] text-xs font-black shadow-xs">
              <BookOpen className="w-4 h-4 text-sky-600 dark:text-[#00E5BE]" />
              <span>{isArabic ? 'المدونة الطبية والدليل المعرفي' : 'Clinical Blog & Knowledge Guide'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {isArabic ? (
                <>
                  مقالات إكلينيكية وإرشادات موثوقة{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] to-[#00E5BE]">
                    لتطور طفلك
                  </span>
                </>
              ) : (
                <>
                  Clinical Insights & Guidance for{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] to-[#00E5BE]">
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
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-white flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-700 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isArabic ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
            <button
              onClick={scrollLeft}
              aria-label={isArabic ? 'التالي' : 'Next'}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-white flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-700 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
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
                    ? 'bg-gradient-to-r from-[#0284C7] to-[#00E5BE] text-slate-950 font-black shadow-md shadow-sky-500/20 scale-[1.02]'
                    : 'bg-white/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-sky-400/50 hover:text-sky-600 dark:hover:text-white'
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

            return (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="w-[88vw] max-w-[370px] sm:w-[360px] md:w-[380px] lg:w-[400px] shrink-0 snap-start bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-sky-400/40 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                {/* Upper Image Section */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={post.image}
                    alt={isArabic ? post.title : (post.titleEn || post.title)}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  
                  {/* Subtle gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                  {/* Category Badge (Top-Right / Left depending on RTL) */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-sky-600/95 dark:bg-slate-950/90 text-white dark:text-[#00E5BE] text-[11px] font-black px-3 py-1 rounded-xl shadow-md border border-white/20 dark:border-white/10 backdrop-blur-md">
                      {isArabic ? post.categoryTitle : (post.categoryTitleEn || post.categoryTitle)}
                    </span>
                  </div>

                  {/* Read Time Badge (Top-Left / Right) */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-xl flex items-center gap-1 border border-white/15">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{post.readTimeMinutes} {isArabic ? 'دقائق قراءة' : 'min read'}</span>
                    </span>
                  </div>

                  {/* Views Count Badge */}
                  <div className="absolute bottom-3 end-3 z-10">
                    <span className="flex items-center gap-1 text-[11px] text-slate-200 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15">
                      <Eye className="w-3.5 h-3.5 text-sky-400" />
                      <span>{post.viewsCount}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                  <div>
                    {/* Publication Date */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
                      <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-[#00E5BE]" />
                      <span>{isArabic ? post.publishDate : (post.publishDateEn || post.publishDate)}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug group-hover:text-sky-600 dark:group-hover:text-[#00E5BE] transition-colors mb-2.5">
                      {isArabic ? post.title : (post.titleEn || post.title)}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                      {isArabic ? post.excerpt : (post.excerptEn || post.excerpt)}
                    </p>

                    {/* Key Takeaway Snippet */}
                    {post.keyTakeaways && post.keyTakeaways.length > 0 && (
                      <div className="bg-sky-50/70 dark:bg-slate-800/50 border border-sky-100 dark:border-white/5 rounded-xl p-3 mb-4 text-xs">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
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
                    <span className="inline-flex items-center gap-1.5 text-xs font-black text-sky-600 dark:text-[#00E5BE] group-hover:gap-2.5 transition-all">
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
                        className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors relative"
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

        {/* Bottom Banner with Consultation Hook */}
        <div className="mt-10 sm:mt-14 glass-card p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 border border-sky-400/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#00E5BE] text-slate-950 flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
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
            className="w-full md:w-auto shrink-0 bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#FB7185] hover:brightness-110 active:scale-95 text-white font-black px-6 sm:px-8 py-3.5 rounded-2xl shadow-lg shadow-rose-500/25 transition-all text-sm sm:text-base cursor-pointer text-center"
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
            className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-white/15 relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Modal Header Sticky Top */}
            <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-sky-500/15 text-sky-700 dark:text-[#00E5BE] text-xs font-black px-3 py-1 rounded-xl">
                  {isArabic ? selectedPost.categoryTitle : (selectedPost.categoryTitleEn || selectedPost.categoryTitle)}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedPost.readTimeMinutes} {isArabic ? 'دقائق قراءة' : 'min read'}</span>
                </span>
              </div>

              <button
                onClick={() => setSelectedPost(null)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Article Hero Image */}
              <div className="relative h-60 sm:h-72 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={selectedPost.image}
                  alt={isArabic ? selectedPost.title : (selectedPost.titleEn || selectedPost.title)}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                  {isArabic ? selectedPost.title : (selectedPost.titleEn || selectedPost.title)}
                </h2>

                {/* Author Card */}
                <div 
                  onClick={(e) => handleAuthorClick(e, selectedPost.author.id)}
                  className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-white/10 hover:border-sky-400/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedPost.author.avatar || '/specialists/spec_haneen_obaidi_1790197216150.jpg'}
                      alt={selectedPost.author.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/specialists/spec_haneen_obaidi_1790197216150.jpg';
                      }}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-[#00E5BE] transition-colors">
                          {isArabic ? selectedPost.author.name : (selectedPost.author.nameEn || selectedPost.author.name)}
                        </span>
                        <UserCheck className="w-3.5 h-3.5 text-[#00E5BE]" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isArabic ? selectedPost.author.role : (selectedPost.author.roleEn || selectedPost.author.role)}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-sky-600 dark:text-[#00E5BE] hidden xs:inline">
                    {isArabic ? 'عرض ملف الأخصائي' : 'View Profile'}
                  </span>
                </div>
              </div>

              {/* Key Takeaways Box */}
              {selectedPost.keyTakeaways && selectedPost.keyTakeaways.length > 0 && (
                <div className="bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-400/20 rounded-2xl p-4 sm:p-5">
                  <h4 className="text-sm font-black text-sky-900 dark:text-sky-200 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{isArabic ? 'أبرز المخرجات والنقاط الإكلينيكية:' : 'Key Clinical Takeaways:'}</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    {(isArabic ? selectedPost.keyTakeaways : (selectedPost.keyTakeawaysEn || selectedPost.keyTakeaways)).map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-2" />
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
              <div className="p-5 sm:p-6 bg-gradient-to-r from-sky-600 to-teal-600 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                <div>
                  <h4 className="font-black text-base">
                    {isArabic ? 'هل تود استشارة الكاتب حول طفلك؟' : 'Want to consult the author about your child?'}
                  </h4>
                  <p className="text-xs text-sky-100 mt-0.5">
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
                  className="w-full sm:w-auto shrink-0 bg-white text-slate-900 font-black px-6 py-3 rounded-xl hover:bg-amber-400 transition-colors text-xs sm:text-sm cursor-pointer"
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
