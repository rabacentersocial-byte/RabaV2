import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Clock, 
  Calendar, 
  Heart, 
  Share2, 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  X, 
  Home, 
  Bookmark, 
  MessageSquare, 
  HeartHandshake, 
  UserCheck, 
  Stethoscope, 
  ChevronDown, 
  Check, 
  Copy, 
  ExternalLink, 
  Send,
  HelpCircle,
  Brain,
  ShieldCheck,
  Award,
  CalendarCheck,
  Type,
  Target,
  Layers
} from 'lucide-react';
import { BlogPost, Specialist } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { SPECIALISTS } from '../data/mockData';
import { getStoredBlogPosts } from '../data/blogCustomizer';

interface BlogDirectoryPageProps {
  onBackToHome: () => void;
  onOpenBooking?: (notes?: string) => void;
  onBookSpecialist?: (specialist: Specialist) => void;
  initialPostSlug?: string | null;
}

export const BlogDirectoryPage: React.FC<BlogDirectoryPageProps> = ({
  onBackToHome,
  onOpenBooking,
  onBookSpecialist,
  initialPostSlug
}) => {
  const { isArabic } = useLanguage();

  // All blog posts state (synchronized with localStorage, persistent sync, and Firestore)
  const [allPosts, setAllPosts] = useState<BlogPost[]>(() => getStoredBlogPosts());

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'likes' | 'reading_time'>('latest');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Active Reader modal / full view
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);
  const [readerFontSize, setReaderFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [readingProgress, setReadingProgress] = useState(0);

  // Interactive bookmarks & likes
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('raba_blog_likes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('raba_blog_bookmarks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Categories list
  const categories = [
    { id: 'all', labelAr: 'جميع المقالات', labelEn: 'All Articles', icon: BookOpen },
    { id: 'autism', labelAr: 'طيف التوحد والتدخل المبكر', labelEn: 'Autism & Early Intervention', icon: Brain },
    { id: 'aba', labelAr: 'تحليل السلوك التطبيقي (ABA)', labelEn: 'Applied Behavior Analysis', icon: Target },
    { id: 'occupational', labelAr: 'العلاج الوظيفي والتكامل الحسي', labelEn: 'Occupational Therapy', icon: Layers },
    { id: 'speech', labelAr: 'النطق والتخاطب والتواصل', labelEn: 'Speech & Language', icon: MessageSquare },
    { id: 'family_guidance', labelAr: 'إرشادات أسرية وتعديل روتين', labelEn: 'Family Guidance', icon: HeartHandshake },
  ];

  // Custom Category Icons and Card Theming (matching screenshot & BlogSliderSection)
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

  // Synchronize dynamic updates from admin
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

  // Sync initial slug if provided
  useEffect(() => {
    if (initialPostSlug) {
      const matched = allPosts.find(p => p.slug === initialPostSlug);
      if (matched) {
        setReadingPost(matched);
      }
    }
  }, [initialPostSlug, allPosts]);

  // Check URL hash for article slug deep-linking (#blog/slug or #blog-slug)
  useEffect(() => {
    const checkSlugFromHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#blog/')) {
        const slug = hash.replace('#blog/', '');
        const matched = allPosts.find(p => p.slug === slug);
        if (matched) setReadingPost(matched);
      } else if (hash.startsWith('#blog-') && hash !== '#blog-directory' && hash !== '#blog-page') {
        const slug = hash.replace('#blog-', '');
        const matched = allPosts.find(p => p.slug === slug);
        if (matched) setReadingPost(matched);
      }
    };
    checkSlugFromHash();
    window.addEventListener('hashchange', checkSlugFromHash);
    return () => window.removeEventListener('hashchange', checkSlugFromHash);
  }, [allPosts]);

  // Update document title and canonical meta for SEO
  useEffect(() => {
    const originalTitle = document.title;
    if (readingPost) {
      document.title = `${isArabic ? readingPost.title : (readingPost.titleEn || readingPost.title)} | مركز رابا ABA`;
    } else {
      document.title = isArabic 
        ? 'المدونة الطبية والدليل المعرفي | مركز رابا للرعاية والتأهيل' 
        : 'Clinical Blog & Knowledge Guide | Raba Center';
    }
    return () => {
      document.title = originalTitle;
    };
  }, [readingPost, isArabic]);

  // Reading progress tracker
  const readerContentRef = useRef<HTMLDivElement>(null);
  const handleReaderScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    setReadingProgress(Math.min(100, Math.max(0, progress)));
  };

  const handleOpenReader = (post: BlogPost) => {
    setReadingPost(post);
    setReadingProgress(0);
    window.location.hash = `#blog/${post.slug}`;
  };

  const handleCloseReader = () => {
    setReadingPost(null);
    window.location.hash = '#blog-directory';
  };

  const toggleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setLikedPosts(prev => {
      const updated = { ...prev, [postId]: !prev[postId] };
      try {
        localStorage.setItem('raba_blog_likes', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const toggleBookmark = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setBookmarkedPosts(prev => {
      const updated = { ...prev, [postId]: !prev[postId] };
      try {
        localStorage.setItem('raba_blog_bookmarks', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleShare = (e: React.MouseEvent, post: BlogPost) => {
    e.stopPropagation();
    const title = isArabic ? post.title : (post.titleEn || post.title);
    const url = `${window.location.origin}/#blog/${post.slug}`;

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

  const handleCopyCurrentLink = () => {
    if (!readingPost) return;
    const url = `${window.location.origin}/#blog/${readingPost.slug}`;
    navigator.clipboard.writeText(url);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!readingPost) return;
    const title = isArabic ? readingPost.title : (readingPost.titleEn || readingPost.title);
    const url = `${window.location.origin}/#blog/${readingPost.slug}`;
    const text = encodeURIComponent(`*${title}*\n\nمقال قيم من مركز رابا للتأهيل:\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTwitter = () => {
    if (!readingPost) return;
    const title = isArabic ? readingPost.title : (readingPost.titleEn || readingPost.title);
    const url = `${window.location.origin}/#blog/${readingPost.slug}`;
    const text = encodeURIComponent(`${title} - مركز رابا`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleBookWithAuthor = (authorId?: string) => {
    if (!authorId) {
      if (onOpenBooking) onOpenBooking('استشارة عامة بناءً على مقال في المدونة الطبية');
      return;
    }
    const matched = SPECIALISTS.find(s => s.id === authorId);
    if (matched && onBookSpecialist) {
      onBookSpecialist(matched);
    } else if (onOpenBooking) {
      onOpenBooking(`حجز استشارة بإشراف: ${authorId}`);
    }
  };

  // Published posts
  const publishedPosts = useMemo(() => {
    return (allPosts || []).filter(p => p && (p.status === undefined || p.status === 'published'));
  }, [allPosts]);

  // Filtered & Sorted list
  const filteredPosts = useMemo(() => {
    let result = [...publishedPosts];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => {
        const titleAr = (p.title || '').toLowerCase();
        const titleEn = (p.titleEn || '').toLowerCase();
        const excerptAr = (p.excerpt || '').toLowerCase();
        const excerptEn = (p.excerptEn || '').toLowerCase();
        const authorName = (p.author?.name || '').toLowerCase();
        const categoryName = (p.categoryTitle || '').toLowerCase();
        const tags = (p.tags || []).join(' ').toLowerCase();
        const contentStr = (p.content || []).join(' ').toLowerCase();

        return (
          titleAr.includes(q) ||
          titleEn.includes(q) ||
          excerptAr.includes(q) ||
          excerptEn.includes(q) ||
          authorName.includes(q) ||
          categoryName.includes(q) ||
          tags.includes(q) ||
          contentStr.includes(q)
        );
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.viewsCount || 0) - (a.viewsCount || 0);
      }
      if (sortBy === 'likes') {
        const likesA = (a.likesCount || 0) + (likedPosts[a.id] ? 1 : 0);
        const likesB = (b.likesCount || 0) + (likedPosts[b.id] ? 1 : 0);
        return likesB - likesA;
      }
      if (sortBy === 'reading_time') {
        return (a.readTimeMinutes || 5) - (b.readTimeMinutes || 5);
      }
      // default: latest / custom order
      return (a.order || 0) - (b.order || 0);
    });

    return result;
  }, [publishedPosts, selectedCategory, searchQuery, sortBy, likedPosts]);

  // Schema.org BlogPosting structured data
  const structuredData = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": isArabic ? "مدونة مركز رابا للتأهيل وتحليل السلوك" : "Raba Center Clinical Blog",
      "description": "دليل معرفي ومقالات إكلينيكية معتمدة في طيف التوحد، تحليل السلوك التطبيقي ABA، والعلاج الوظيفي والتخاطب.",
      "url": `${typeof window !== 'undefined' ? window.location.origin : 'https://rabacenters.com'}/#blog-directory`,
      "blogPost": publishedPosts.map(p => ({
        "@type": "BlogPosting",
        "headline": p.title,
        "description": p.excerpt,
        "datePublished": p.publishDate,
        "author": {
          "@type": "Person",
          "name": p.author?.name || "فريق رابا الطبي"
        },
        "publisher": {
          "@type": "Organization",
          "name": "مركز رابا للرعاية النهارية والتأهيل"
        }
      }))
    };
  }, [publishedPosts, isArabic]);

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#070D18] text-slate-900 dark:text-white transition-colors pb-24" dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* JSON-LD Schema.org SEO Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Ambient Visual Backdrops */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-teal-500/10 via-[#0d5c52]/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Top Breadcrumb & Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#070D18]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm" aria-label="Breadcrumb">
            <button
              onClick={onBackToHome}
              className="text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-[#00E5BE] font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{isArabic ? 'الرئيسية' : 'Home'}</span>
            </button>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-teal-700 dark:text-[#00E5BE] font-black truncate">
              {isArabic ? 'المدونة الطبية والدليل المعرفي' : 'Clinical Blog & Knowledge Guide'}
            </span>
          </nav>

          {/* Return Home Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              {isArabic ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{isArabic ? 'العودة للرئيسية' : 'Back to Home'}</span>
            </button>

            {onOpenBooking && (
              <button
                onClick={() => onOpenBooking('حجز استشارة مباشرة من صفحة المدونة')}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#0d5c52] to-[#115e59] hover:brightness-110 text-white text-xs font-black shadow-sm transition-all cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>{isArabic ? 'طلب استشارة إكلينيكية' : 'Book Clinical Consultation'}</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        {/* Page Hero Header */}
        <div className="mb-10 sm:mb-14 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dff1ec] dark:bg-teal-950/60 border border-[#0d5c52]/20 dark:border-[#2dd4bf]/20 text-[#0d5c52] dark:text-[#2dd4bf] text-xs font-black shadow-xs mb-4">
            <BookOpen className="w-4 h-4 text-[#0d5c52] dark:text-[#2dd4bf]" />
            <span>{isArabic ? 'المكتبة الإكلينيكية ودليل الأسرة الشامل' : 'Clinical Library & Comprehensive Family Guide'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
            {isArabic ? (
              <>
                مقالات إكلينيكية وتوجيهات أسرية{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d5c52] via-[#0284C7] to-[#0d5c52] dark:from-[#2dd4bf] dark:via-sky-400 dark:to-[#2dd4bf]">
                  لتطور واستقلالية طفلك
                </span>
              </>
            ) : (
              <>
                Evidence-Based Articles & Guides for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d5c52] via-[#0284C7] to-[#0d5c52] dark:from-[#2dd4bf] dark:via-sky-400 dark:to-[#2dd4bf]">
                  Child Growth & Independence
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {isArabic 
              ? 'محتوى تأهيلي علمي رصين كتبه استشاريو وأخصائيو مركز رابا، يقدم إرشادات عملية في تشخيص التوحد، تطبيق ABA الإيجابي، التكامل الحسي، وتنمية مهارات النطق والحياة اليومية.'
              : 'Rigorous therapeutic insights written by licensed clinicians at Raba Center, offering actionable guidance in autism diagnosis, positive ABA protocols, sensory integration, and speech milestones.'}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/60 dark:border-white/5 text-center shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-teal-700 dark:text-[#00E5BE]">{publishedPosts.length}+</div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {isArabic ? 'مقال إكلينيكي منشور' : 'Published Articles'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/60 dark:border-white/5 text-center shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-sky-600 dark:text-sky-400">100%</div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {isArabic ? 'مبني على الأدلة العلمية' : 'Evidence-Based'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/60 dark:border-white/5 text-center shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">5+</div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {isArabic ? 'مسارات تأهيلية تخصصية' : 'Clinical Specialties'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/60 dark:border-white/5 text-center shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">مجاناً</div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {isArabic ? 'دليل إرشادي متاح للأسر' : 'Free Parent Guidance'}
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-white/10 shadow-xs mb-8 space-y-4">
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isArabic ? 'ابحث عن موضوع، استراتيجية سلوكية، أو اسم أخصائي...' : 'Search topics, behavioral strategies, or specialist name...'}
                className="w-full pr-12 pl-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="w-full md:w-auto flex items-center justify-between gap-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-teal-600 dark:text-[#00E5BE]" />
                <span>
                  {sortBy === 'latest' && (isArabic ? 'الأحدث نشراً' : 'Latest')}
                  {sortBy === 'popular' && (isArabic ? 'الأكثر قراءة' : 'Most Popular')}
                  {sortBy === 'likes' && (isArabic ? 'الأعلى تفاعلاً' : 'Most Liked')}
                  {sortBy === 'reading_time' && (isArabic ? 'وقت القراءة (الأقصر)' : 'Shortest Read')}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isSortOpen && (
                <div className="absolute left-0 sm:right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-white/15 p-1.5 z-40 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => { setSortBy('latest'); setIsSortOpen(false); }}
                    className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition-all ${sortBy === 'latest' ? 'bg-teal-500/10 text-teal-700 dark:text-[#00E5BE]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    {isArabic ? 'الأحدث نشراً' : 'Latest'}
                  </button>
                  <button
                    onClick={() => { setSortBy('popular'); setIsSortOpen(false); }}
                    className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition-all ${sortBy === 'popular' ? 'bg-teal-500/10 text-teal-700 dark:text-[#00E5BE]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    {isArabic ? 'الأكثر قراءة' : 'Most Popular'}
                  </button>
                  <button
                    onClick={() => { setSortBy('likes'); setIsSortOpen(false); }}
                    className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition-all ${sortBy === 'likes' ? 'bg-teal-500/10 text-teal-700 dark:text-[#00E5BE]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    {isArabic ? 'الأعلى تفاعلاً' : 'Most Liked'}
                  </button>
                  <button
                    onClick={() => { setSortBy('reading_time'); setIsSortOpen(false); }}
                    className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition-all ${sortBy === 'reading_time' ? 'bg-teal-500/10 text-teal-700 dark:text-[#00E5BE]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    {isArabic ? 'وقت القراءة (الأقصر)' : 'Shortest Read'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Categories Segmented Filter Bar */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-6 no-scrollbar scroll-smooth">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
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

        </div>

        {/* Results Count & Active Filter Notice */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-6 px-1">
          <div>
            {isArabic 
              ? `عرض ${filteredPosts.length} مقال ${selectedCategory !== 'all' ? `في تخصص (${categories.find(c => c.id === selectedCategory)?.labelAr})` : ''}`
              : `Showing ${filteredPosts.length} articles`}
          </div>

          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="text-teal-600 dark:text-[#00E5BE] font-bold hover:underline cursor-pointer"
            >
              {isArabic ? 'إعادة ضبط التصفية' : 'Reset Filters'}
            </button>
          )}
        </div>

        {/* Articles Grid (Exact layout and visual design matching the screenshot) */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-white/10 my-8">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
              {isArabic ? 'لم يتم العثور على مقالات مطابقة' : 'No articles match your search'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
              {isArabic 
                ? 'جرب البحث بكلمات عامة مثل (توحد، نطق، سلوك، تدريب) أو قم بتغيير التصنيف المختار.' 
                : 'Try broader search terms or clear selected categories.'}
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold cursor-pointer hover:bg-teal-700 transition-colors"
            >
              {isArabic ? 'عرض جميع المقالات' : 'Show All Articles'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredPosts.map((post) => {
              const isLiked = likedPosts[post.id] || false;
              const currentLikes = (post.likesCount || 0) + (isLiked ? 1 : 0);
              const categoryConfig = getCategoryIconConfig(post.category);
              const CategoryIcon = categoryConfig.icon;

              return (
                <article
                  key={post.id}
                  onClick={() => handleOpenReader(post)}
                  className="liquid-glass-card rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer border border-slate-200/80 dark:border-white/10 dark:bg-[#0c1524]"
                >
                  {/* 1. Integrated Custom Header with Topic Icon (No Photos - exact match to screenshot) */}
                  <div className={`p-6 sm:p-7 pb-5 ${categoryConfig.headerBg} ${categoryConfig.headerBorder} relative transition-colors`}>
                    {/* Top Row: Category Badge & Custom Integrated Icon Box */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      {/* Category Badge matching Brand Color */}
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
                        <span>{post.viewsCount || 100} {isArabic ? 'مشاهدة' : 'views'}</span>
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
                          className={`p-2 rounded-xl flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
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
                          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-[#0d5c52] dark:hover:text-[#2dd4bf] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors relative cursor-pointer"
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
        )}

        {/* Specialized Clinical Newsletter & Parent Guide Box */}
        <div className="mt-14 sm:mt-20 bg-gradient-to-r from-[#0B3B36] via-[#0E5246] to-[#0A2E2A] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <span className="text-[#00E5BE] text-xs font-bold uppercase tracking-wider block mb-1">
              {isArabic ? 'النشرة المعرفية والتأهيلية الأسبوعية' : 'Weekly Clinical Rehabilitation Newsletter'}
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black mb-2">
              {isArabic ? 'هل تود استلام أحدث الإرشادات السلوكية والنطقية؟' : 'Get the latest behavioral & speech guides'}
            </h3>
            <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed mb-6">
              {isArabic 
                ? 'انضم لأكثر من 3,500 أسرة تستلم أسبوعياً نصائح مقننة من أخصائيي واستشاريي مركز رابا في التعامل مع التحديات السلوكية والتكامل الحسي في المنزل.'
                : 'Join over 3,500 families receiving weekly evidence-based tips directly from Raba Center clinical team.'}
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(isArabic ? 'شكراً لاهتمامك! تم تسجيل اشتراكك في النشرة الإكلينيكية بنجاح.' : 'Thank you! You have subscribed successfully.');
              }}
              className="flex flex-col sm:flex-row gap-2.5 max-w-lg"
            >
              <input
                type="email"
                required
                placeholder={isArabic ? 'أدخل بريدك الإلكتروني أو رقم الواتساب...' : 'Enter your email or WhatsApp number...'}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-emerald-200/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00E5BE]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#00E5BE] hover:bg-[#00c9a7] text-slate-950 font-black text-xs sm:text-sm transition-all cursor-pointer shadow-md shrink-0"
              >
                {isArabic ? 'اشتراك مجاني' : 'Subscribe Free'}
              </button>
            </form>
          </div>
        </div>

        {/* Clinical Assessment Booking CTA */}
        <div className="mt-10 sm:mt-12 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-[#00E5BE] flex items-center justify-center shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isArabic ? 'هل يحتاج طفلك إلى خطة تدخل سلوكي أو تأهيلي عاجلة؟' : 'Does your child need urgent behavioral or therapy intake?'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {isArabic 
                  ? 'مراكزنا في الرياض وجدة والخبر مجهزة بأحدث مقاييس التشخيص المقننة لاستقبال طفلك فوراً.'
                  : 'Our branches in Riyadh, Jeddah, and Khobar are equipped with international standardized assessments.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (onOpenBooking) onOpenBooking('طلب موعد تقييم شامل بعد تصفح المدونة');
            }}
            className="w-full md:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#0d5c52] to-[#115e59] hover:brightness-110 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0 text-center"
          >
            {isArabic ? 'احجز تقييم طفلك الآن' : 'Book Child Assessment'}
          </button>
        </div>

      </div>

      {/* Full Article Reader Modal (Dedicated Deep-Read View) */}
      {readingPost && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in"
          onClick={handleCloseReader}
        >
          <div 
            className="bg-white dark:bg-[#0c1322] rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/15 relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Sticky Reading Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1">
              <div 
                className="bg-gradient-to-r from-teal-500 to-[#00E5BE] h-full transition-all duration-150"
                style={{ width: `${readingProgress}%` }}
              />
            </div>

            {/* Reader Header Bar */}
            <div className="px-5 sm:px-8 py-3.5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between gap-3 shrink-0 bg-white/90 dark:bg-[#0c1322]/90 backdrop-blur-md">
              
              <div className="flex items-center gap-2 truncate">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-[#0d5c52] text-white">
                  {isArabic ? readingPost.categoryTitle : (readingPost.categoryTitleEn || readingPost.categoryTitle)}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate hidden sm:inline">
                  {isArabic ? readingPost.title : (readingPost.titleEn || readingPost.title)}
                </span>
              </div>

              {/* Reader Controls: Font Size, Share, Close */}
              <div className="flex items-center gap-2 shrink-0">
                
                {/* Font Size Adjuster */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs">
                  <button
                    onClick={() => setReaderFontSize('sm')}
                    className={`px-2 py-1 rounded font-bold ${readerFontSize === 'sm' ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-xs' : 'text-slate-500'}`}
                    title="خط صغير"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setReaderFontSize('md')}
                    className={`px-2 py-1 rounded font-bold ${readerFontSize === 'md' ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-xs' : 'text-slate-500'}`}
                    title="خط قياسي"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setReaderFontSize('lg')}
                    className={`px-2 py-1 rounded font-bold ${readerFontSize === 'lg' ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-xs' : 'text-slate-500'}`}
                    title="خط كبير"
                  >
                    A+
                  </button>
                </div>

                {/* Copy Link */}
                <button
                  onClick={handleCopyCurrentLink}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600 transition-colors cursor-pointer relative"
                  title="نسخ رابط المقال"
                >
                  {copyFeedback ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={handleCloseReader}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="إغلاق"
                >
                  <X className="w-4 h-4" />
                </button>

              </div>
            </div>

            {/* Scrollable Reader Body */}
            <div 
              ref={readerContentRef}
              onScroll={handleReaderScroll}
              className="flex-1 overflow-y-auto px-5 sm:px-10 lg:px-14 py-6 sm:py-8 space-y-6"
            >
              
              {/* Post Headline & Unboxed Metadata */}
              <div className="space-y-3 border-b border-slate-100 dark:border-white/10 pb-6">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {isArabic ? readingPost.author?.name : (readingPost.author?.nameEn || readingPost.author?.name)}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{isArabic ? readingPost.publishDate : (readingPost.publishDateEn || readingPost.publishDate)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{readingPost.readTimeMinutes} {isArabic ? 'دقائق قراءة موجهة' : 'min read'}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-teal-600 dark:text-[#00E5BE] font-bold">
                    {isArabic ? 'مراجعة إكلينيكية معتمدة' : 'Clinically Reviewed'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                  {isArabic ? readingPost.title : (readingPost.titleEn || readingPost.title)}
                </h1>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {isArabic ? readingPost.excerpt : (readingPost.excerptEn || readingPost.excerpt)}
                </p>
              </div>

              {/* Cover Image */}
              <div className="rounded-3xl overflow-hidden aspect-[16/9] max-h-[380px] bg-slate-100 dark:bg-slate-800 shadow-md">
                <img
                  src={readingPost.image}
                  alt={readingPost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Key Takeaways Box */}
              {readingPost.keyTakeaways && readingPost.keyTakeaways.length > 0 && (
                <div className="p-5 sm:p-6 rounded-3xl bg-[#dff1ec]/70 dark:bg-teal-950/40 border border-teal-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-teal-800 dark:text-[#2dd4bf] font-black text-sm">
                    <Sparkles className="w-4 h-4 text-teal-600 dark:text-[#2dd4bf]" />
                    <span>{isArabic ? 'أبرز المخرجات والنقاط الإكلينيكية المستفادة:' : 'Key Clinical Takeaways:'}</span>
                  </div>
                  <div className="space-y-2">
                    {readingPost.keyTakeaways.map((takeaway, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-[#2dd4bf] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Article Paragraphs */}
              <div className={`space-y-5 text-slate-700 dark:text-slate-200 leading-relaxed ${
                readerFontSize === 'sm' ? 'text-xs sm:text-sm' : readerFontSize === 'lg' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
              }`}>
                {(isArabic ? readingPost.content : (readingPost.contentEn || readingPost.content))?.map((paragraph, pIdx) => (
                  <p key={pIdx} className="leading-relaxed font-normal">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Tags Cloud */}
              {readingPost.tags && readingPost.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-white/10">
                  <div className="text-xs font-bold text-slate-400 mb-2">
                    {isArabic ? 'الوسوم ومحاور المقال:' : 'Article Tags:'}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {readingPost.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Bio Card with Direct Booking Action */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {readingPost.author?.avatar ? (
                    <img
                      src={readingPost.author.avatar}
                      alt={readingPost.author.name}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-teal-500/30"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white font-black text-xl flex items-center justify-center shrink-0">
                      {readingPost.author?.name ? readingPost.author.name.slice(0, 1) : 'ر'}
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] font-bold text-teal-600 dark:text-[#00E5BE] block">
                      {isArabic ? 'المؤلف والمشرف الإكلينيكي' : 'Author & Clinical Specialist'}
                    </span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      {isArabic ? readingPost.author?.name : (readingPost.author?.nameEn || readingPost.author?.name)}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {isArabic ? readingPost.author?.role : (readingPost.author?.roleEn || readingPost.author?.role)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleBookWithAuthor(readingPost.author?.id)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer text-center"
                >
                  {isArabic ? 'حجز موعد مع هذا الأخصائي' : 'Book with Specialist'}
                </button>
              </div>

              {/* Social Share Drawer */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs font-bold text-slate-500">
                  {isArabic ? 'شارك هذه المعرفة مع أسرة تحتاجها:' : 'Share this guide:'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShareWhatsApp}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>واتساب</span>
                  </button>

                  <button
                    onClick={handleShareTwitter}
                    className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>منصة X</span>
                  </button>

                  <button
                    onClick={handleCopyCurrentLink}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copyFeedback ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copyFeedback ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'نسخ الرابط' : 'Copy')}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Sticky Reader Footer */}
            <div className="px-5 sm:px-8 py-3.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-4 shrink-0 bg-slate-50 dark:bg-slate-900/90">
              <button
                onClick={handleCloseReader}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                {isArabic ? '← العودة لكافة المقالات' : '← Back to All Articles'}
              </button>

              <button
                onClick={() => {
                  if (onOpenBooking) onOpenBooking(`استفسار بناء على مقال: ${readingPost.title}`);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0d5c52] to-[#115e59] hover:brightness-110 text-white font-black text-xs transition-all shadow-sm cursor-pointer"
              >
                {isArabic ? 'حجز تقييم لحالة طفلي' : 'Book Child Assessment'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default BlogDirectoryPage;
