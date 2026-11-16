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
    { id: 'psychology', labelAr: 'علم النفس والأعصاب', labelEn: 'Psychology & Neuroscience', icon: Brain },
    { id: 'autism', labelAr: 'طيف التوحد والتدخل المبكر', labelEn: 'Autism & Early Intervention', icon: Brain },
    { id: 'aba', labelAr: 'تحليل السلوك التطبيقي (ABA)', labelEn: 'Applied Behavior Analysis', icon: Target },
    { id: 'occupational', labelAr: 'العلاج الوظيفي والتكامل الحسي', labelEn: 'Occupational Therapy', icon: Layers },
    { id: 'speech', labelAr: 'النطق والتخاطب والتواصل', labelEn: 'Speech & Language', icon: MessageSquare },
    { id: 'family_guidance', labelAr: 'إرشادات أسرية وتعديل روتين', labelEn: 'Family Guidance', icon: HeartHandshake },
  ];

  // Custom Category Icons and Card Theming
  const getCategoryIconConfig = (cat?: string) => {
    switch (cat) {
      case 'psychology':
        return {
          icon: Brain,
          iconBoxBg: 'bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA] border-[#8B5CF6]/25 shadow-[#8B5CF6]/10',
          headerBg: 'bg-gradient-to-br from-[#8B5CF6]/10 via-[#2B95FF]/[0.04] to-transparent dark:from-[#8B5CF6]/15 dark:via-transparent',
          headerBorder: 'border-b border-[#8B5CF6]/15 dark:border-white/5',
          badgeBg: 'bg-[#8B5CF6] text-white',
        };
      case 'autism':
        return {
          icon: Brain,
          iconBoxBg: 'bg-[#2B95FF]/10 dark:bg-[#2B95FF]/15 text-[#1263D6] dark:text-[#60AFFF] border-[#2B95FF]/25 shadow-[#2B95FF]/10',
          headerBg: 'bg-gradient-to-br from-[#2B95FF]/10 via-[#2B95FF]/[0.03] to-transparent dark:from-[#2B95FF]/15 dark:via-transparent',
          headerBorder: 'border-b border-[#2B95FF]/15 dark:border-white/5',
          badgeBg: 'bg-[#2B95FF] text-white',
        };
      case 'aba':
        return {
          icon: Target,
          iconBoxBg: 'bg-[#10B981]/10 dark:bg-[#10B981]/15 text-[#047857] dark:text-[#34D399] border-[#10B981]/25 shadow-[#10B981]/10',
          headerBg: 'bg-gradient-to-br from-[#10B981]/10 via-[#10B981]/[0.03] to-transparent dark:from-[#10B981]/15 dark:via-transparent',
          headerBorder: 'border-b border-[#10B981]/15 dark:border-white/5',
          badgeBg: 'bg-[#10B981] text-white',
        };
      case 'occupational':
        return {
          icon: Layers,
          iconBoxBg: 'bg-[#F59E0B]/10 dark:bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24] border-[#F59E0B]/25 shadow-[#F59E0B]/10',
          headerBg: 'bg-gradient-to-br from-[#F59E0B]/10 via-[#F59E0B]/[0.03] to-transparent dark:from-[#F59E0B]/15 dark:via-transparent',
          headerBorder: 'border-b border-[#F59E0B]/15 dark:border-white/5',
          badgeBg: 'bg-[#D97706] text-white',
        };
      case 'speech':
        return {
          icon: MessageSquare,
          iconBoxBg: 'bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA] border-[#8B5CF6]/25 shadow-[#8B5CF6]/10',
          headerBg: 'bg-gradient-to-br from-[#8B5CF6]/10 via-[#8B5CF6]/[0.03] to-transparent dark:from-[#8B5CF6]/15 dark:via-transparent',
          headerBorder: 'border-b border-[#8B5CF6]/15 dark:border-white/5',
          badgeBg: 'bg-[#7C3AED] text-white',
        };
      case 'family_guidance':
        return {
          icon: HeartHandshake,
          iconBoxBg: 'bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/25 shadow-rose-500/10',
          headerBg: 'bg-gradient-to-br from-rose-500/10 via-rose-500/[0.03] to-transparent dark:from-rose-500/15 dark:via-transparent',
          headerBorder: 'border-b border-rose-500/15 dark:border-white/5',
          badgeBg: 'bg-rose-600 text-white',
        };
      default:
        return {
          icon: BookOpen,
          iconBoxBg: 'bg-[#2B95FF]/10 dark:bg-[#2B95FF]/15 text-[#1263D6] dark:text-[#60AFFF] border-[#2B95FF]/25 shadow-[#2B95FF]/10',
          headerBg: 'bg-gradient-to-br from-[#2B95FF]/10 via-[#2B95FF]/[0.03] to-transparent dark:from-[#2B95FF]/15 dark:via-transparent',
          headerBorder: 'border-b border-[#2B95FF]/15 dark:border-white/5',
          badgeBg: 'bg-[#2B95FF] text-white',
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
    <div className="min-h-screen bg-[#F5F2EC] dark:bg-[#0B0F17] text-[#161B26] dark:text-[#F8FAFC] transition-colors pb-24 relative overflow-x-clip" dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* JSON-LD Schema.org SEO Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Ambient Visual Backdrops */}
      <div className="fixed top-0 right-0 w-[520px] h-[520px] rounded-full blur-[120px] pointer-events-none -z-10" style={{ background: 'radial-gradient(circle, rgba(43, 149, 255, 0.14) 0%, rgba(43, 149, 255, 0) 70%)' }} />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none -z-10" style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0) 70%)' }} />

      {/* Top Breadcrumb & Navigation Bar */}
      <div className="sticky top-0 z-30 liquid-glass-panel border-b border-[#161B26]/[0.06] dark:border-white/[0.08] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm" aria-label="Breadcrumb">
            <button
              onClick={onBackToHome}
              className="text-[#4B5563] dark:text-[#94A3B8] hover:text-[#1263D6] dark:hover:text-[#60AFFF] font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{isArabic ? 'الرئيسية' : 'Home'}</span>
            </button>
            <span className="text-[#8B95A5] dark:text-[#64748B]">/</span>
            <span className="text-[#1263D6] dark:text-[#60AFFF] font-black truncate">
              {isArabic ? 'المدونة الطبية والدليل المعرفي' : 'Clinical Blog & Knowledge Guide'}
            </span>
          </nav>

          {/* Return Home Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full liquid-glass-btn text-[#161B26] dark:text-[#F8FAFC] text-xs font-bold transition-all cursor-pointer"
            >
              {isArabic ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{isArabic ? 'العودة للرئيسية' : 'Back to Home'}</span>
            </button>

            {onOpenBooking && (
              <button
                onClick={() => onOpenBooking('حجز استشارة مباشرة من صفحة المدونة')}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#2B95FF] to-[#1A73E8] hover:brightness-110 text-white text-xs font-black shadow-sm shadow-[#2B95FF]/20 transition-all cursor-pointer"
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-pill text-[#1263D6] dark:text-[#60AFFF] text-xs font-black shadow-xs mb-4">
            <BookOpen className="w-4 h-4 text-[#2B95FF]" />
            <span>{isArabic ? 'المكتبة الإكلينيكية ودليل الأسرة الشامل' : 'Clinical Library & Comprehensive Family Guide'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#161B26] dark:text-[#F8FAFC] tracking-tight leading-tight mb-4">
            {isArabic ? (
              <>
                مقالات إكلينيكية وتوجيهات أسرية{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B95FF] to-[#1A73E8]">
                  لتطور واستقلالية طفلك
                </span>
              </>
            ) : (
              <>
                Evidence-Based Articles & Guides for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B95FF] to-[#1A73E8]">
                  Child Growth & Independence
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-[#4B5563] dark:text-[#94A3B8] leading-relaxed font-normal">
            {isArabic 
              ? 'محتوى تأهيلي علمي رصين كتبه استشاريو وأخصائيو مركز رابا، يقدم إرشادات عملية في تشخيص التوحد، تطبيق ABA الإيجابي، التكامل الحسي، وتنمية مهارات النطق والحياة اليومية.'
              : 'Rigorous therapeutic insights written by licensed clinicians at Raba Center, offering actionable guidance in autism diagnosis, positive ABA protocols, sensory integration, and speech milestones.'}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-[#161B26]/[0.06] dark:border-white/[0.08]">
            <div className="p-3.5 rounded-[24px] liquid-glass-card text-center">
              <div className="text-xl sm:text-2xl font-black text-[#1263D6] dark:text-[#60AFFF]">{publishedPosts.length}+</div>
              <div className="text-[11px] sm:text-xs text-[#4B5563] dark:text-[#94A3B8] font-medium mt-0.5">
                {isArabic ? 'مقال إكلينيكي منشور' : 'Published Articles'}
              </div>
            </div>

            <div className="p-3.5 rounded-[24px] liquid-glass-card text-center">
              <div className="text-xl sm:text-2xl font-black text-[#047857] dark:text-[#34D399]">100%</div>
              <div className="text-[11px] sm:text-xs text-[#4B5563] dark:text-[#94A3B8] font-medium mt-0.5">
                {isArabic ? 'مبني على الأدلة العلمية' : 'Evidence-Based'}
              </div>
            </div>

            <div className="p-3.5 rounded-[24px] liquid-glass-card text-center">
              <div className="text-xl sm:text-2xl font-black text-[#6D28D9] dark:text-[#A78BFA]">5+</div>
              <div className="text-[11px] sm:text-xs text-[#4B5563] dark:text-[#94A3B8] font-medium mt-0.5">
                {isArabic ? 'مسارات تأهيلية تخصصية' : 'Clinical Specialties'}
              </div>
            </div>

            <div className="p-3.5 rounded-[24px] liquid-glass-card text-center">
              <div className="text-xl sm:text-2xl font-black text-[#161B26] dark:text-[#F8FAFC]">مجاناً</div>
              <div className="text-[11px] sm:text-xs text-[#4B5563] dark:text-[#94A3B8] font-medium mt-0.5">
                {isArabic ? 'دليل إرشادي متاح للأسر' : 'Free Parent Guidance'}
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls Bar */}
        <div className="liquid-glass-card rounded-[28px] p-4 sm:p-6 mb-8 space-y-4">
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-[#8B95A5] dark:text-[#64748B] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isArabic ? 'ابحث عن موضوع، استراتيجية سلوكية، أو اسم أخصائي...' : 'Search topics, behavioral strategies, or specialist name...'}
                className="w-full pr-12 pl-10 py-3 rounded-full warm-pill-input text-[#161B26] dark:text-[#F8FAFC] placeholder:text-[#8B95A5] dark:placeholder:text-[#64748B] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2B95FF]/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1 text-[#8B95A5] hover:text-[#161B26] dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="w-full md:w-auto flex items-center justify-between gap-2 px-4 py-3 rounded-full liquid-glass-pill text-xs sm:text-sm font-bold text-[#161B26] dark:text-[#F8FAFC] transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#2B95FF]" />
                <span>
                  {sortBy === 'latest' && (isArabic ? 'الأحدث نشراً' : 'Latest')}
                  {sortBy === 'popular' && (isArabic ? 'الأكثر قراءة' : 'Most Popular')}
                  {sortBy === 'likes' && (isArabic ? 'الأعلى تفاعلاً' : 'Most Liked')}
                  {sortBy === 'reading_time' && (isArabic ? 'وقت القراءة (الأقصر)' : 'Shortest Read')}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8B95A5]" />
              </button>

              {isSortOpen && (
                <div className="absolute left-0 sm:right-0 mt-2 w-52 glass-modal-dialog rounded-2xl shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => { setSortBy('latest'); setIsSortOpen(false); }}
                    className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${sortBy === 'latest' ? 'bg-[#2B95FF]/12 text-[#1263D6] dark:text-[#60AFFF]' : 'text-[#4B5563] dark:text-[#94A3B8] hover:bg-[#161B26]/5 dark:hover:bg-white/5'}`}
                  >
                    {isArabic ? 'الأحدث نشراً' : 'Latest'}
                  </button>
                  <button
                    onClick={() => { setSortBy('popular'); setIsSortOpen(false); }}
                    className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${sortBy === 'popular' ? 'bg-[#2B95FF]/12 text-[#1263D6] dark:text-[#60AFFF]' : 'text-[#4B5563] dark:text-[#94A3B8] hover:bg-[#161B26]/5 dark:hover:bg-white/5'}`}
                  >
                    {isArabic ? 'الأكثر قراءة' : 'Most Popular'}
                  </button>
                  <button
                    onClick={() => { setSortBy('likes'); setIsSortOpen(false); }}
                    className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${sortBy === 'likes' ? 'bg-[#2B95FF]/12 text-[#1263D6] dark:text-[#60AFFF]' : 'text-[#4B5563] dark:text-[#94A3B8] hover:bg-[#161B26]/5 dark:hover:bg-white/5'}`}
                  >
                    {isArabic ? 'الأعلى تفاعلاً' : 'Most Liked'}
                  </button>
                  <button
                    onClick={() => { setSortBy('reading_time'); setIsSortOpen(false); }}
                    className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${sortBy === 'reading_time' ? 'bg-[#2B95FF]/12 text-[#1263D6] dark:text-[#60AFFF]' : 'text-[#4B5563] dark:text-[#94A3B8] hover:bg-[#161B26]/5 dark:hover:bg-white/5'}`}
                  >
                    {isArabic ? 'وقت القراءة (الأقصر)' : 'Shortest Read'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Categories Segmented Filter Bar */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'warm-pill-cta font-black shadow-sm'
                      : 'liquid-glass-pill text-[#4B5563] dark:text-[#94A3B8]'
                  }`}
                >
                  {isArabic ? cat.labelAr : cat.labelEn}
                </button>
              );
            })}
          </div>

        </div>

        {/* Results Count & Active Filter Notice */}
        <div className="flex items-center justify-between text-xs text-[#4B5563] dark:text-[#94A3B8] mb-6 px-1">
          <div>
            {isArabic 
              ? `عرض ${filteredPosts.length} مقال ${selectedCategory !== 'all' ? `في تخصص (${categories.find(c => c.id === selectedCategory)?.labelAr})` : ''}`
              : `Showing ${filteredPosts.length} articles`}
          </div>

          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="text-[#1263D6] dark:text-[#60AFFF] font-bold hover:underline cursor-pointer"
            >
              {isArabic ? 'إعادة ضبط التصفية' : 'Reset Filters'}
            </button>
          )}
        </div>

        {/* Articles Grid (Exact layout and visual design matching the screenshot) */}
        {filteredPosts.length === 0 ? (
          <div className="liquid-glass-card rounded-[28px] p-12 text-center my-8">
            <BookOpen className="w-12 h-12 text-[#8B95A5] dark:text-[#64748B] mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-bold text-[#161B26] dark:text-[#F8FAFC] mb-1">
              {isArabic ? 'لم يتم العثور على مقالات مطابقة' : 'No articles match your search'}
            </h3>
            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] max-w-md mx-auto mb-4">
              {isArabic 
                ? 'جرب البحث بكلمات عامة مثل (توحد، نطق، سلوك، تدريب) أو قم بتغيير التصنيف المختار.' 
                : 'Try broader search terms or clear selected categories.'}
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#2B95FF] to-[#1A73E8] text-white text-xs font-bold cursor-pointer hover:brightness-110 transition-all shadow-sm shadow-[#2B95FF]/20"
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
                  className="liquid-glass-card rounded-[28px] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  {/* 1. Integrated Custom Header with Topic Icon (No Photos - exact match to screenshot) */}
                  <div className={`p-6 sm:p-7 pb-5 ${categoryConfig.headerBg} ${categoryConfig.headerBorder} relative transition-colors`}>
                    {/* Top Row: Category Badge & Custom Integrated Icon Box */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      {/* Category Badge matching Brand Color */}
                      <span className={`${categoryConfig.badgeBg} text-[11px] font-black px-3.5 py-1.5 rounded-full shadow-xs tracking-tight`}>
                        {isArabic ? post.categoryTitle : (post.categoryTitleEn || post.categoryTitle)}
                      </span>

                      {/* Custom Integrated Icon Box */}
                      <div className={`w-12 h-12 rounded-2xl ${categoryConfig.iconBoxBg} border flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                        <CategoryIcon className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Integrated Metadata Strip: Reading Time, Views & Date */}
                    <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-[#4B5563] dark:text-[#94A3B8]">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#2B95FF] shrink-0" />
                        <span>{post.readTimeMinutes} {isArabic ? 'دقائق قراءة' : 'min read'}</span>
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#8B95A5] shrink-0" />
                        <span>{post.viewsCount || 100} {isArabic ? 'مشاهدة' : 'views'}</span>
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
                        <span>{isArabic ? post.publishDate : (post.publishDateEn || post.publishDate)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                    <div>
                      {/* Publication Date */}
                      <div className="flex items-center gap-2 text-[11px] text-[#4B5563] dark:text-[#94A3B8] mb-2.5">
                        <Calendar className="w-3.5 h-3.5 text-[#2B95FF]" />
                        <span>{isArabic ? post.publishDate : (post.publishDateEn || post.publishDate)}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-black text-[#161B26] dark:text-[#F8FAFC] leading-snug group-hover:text-[#1263D6] dark:group-hover:text-[#60AFFF] transition-colors mb-2.5">
                        {isArabic ? post.title : (post.titleEn || post.title)}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] line-clamp-2 leading-relaxed mb-4">
                        {isArabic ? post.excerpt : (post.excerptEn || post.excerpt)}
                      </p>

                      {/* Key Takeaway Snippet */}
                      {post.keyTakeaways && post.keyTakeaways.length > 0 && (
                        <div className="bg-[#2B95FF]/8 border border-[#2B95FF]/15 rounded-2xl p-3 mb-4 text-xs">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                            <span className="text-[#161B26] dark:text-[#F8FAFC] line-clamp-2 leading-relaxed font-medium">
                              {isArabic 
                                ? post.keyTakeaways[0] 
                                : (post.keyTakeawaysEn?.[0] || post.keyTakeaways[0])}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Bottom Actions */}
                    <div className="pt-3 border-t border-[#161B26]/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#1263D6] dark:text-[#60AFFF] group-hover:gap-2.5 transition-all">
                        <span>{isArabic ? 'قراءة المقال بالكامل' : 'Read Article'}</span>
                        {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      </span>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {/* Like button */}
                        <button
                          onClick={(e) => toggleLike(e, post.id)}
                          aria-label="Like post"
                          className={`p-2 rounded-full flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                            isLiked 
                              ? 'text-rose-600 bg-rose-500/10' 
                              : 'text-[#4B5563] dark:text-[#94A3B8] hover:text-rose-500 hover:bg-[#161B26]/5 dark:hover:bg-white/5'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                          <span>{currentLikes}</span>
                        </button>

                        {/* Share button */}
                        <button
                          onClick={(e) => handleShare(e, post)}
                          aria-label="Share post"
                          className="p-2 rounded-full text-[#4B5563] dark:text-[#94A3B8] hover:text-[#1263D6] dark:hover:text-[#60AFFF] hover:bg-[#161B26]/5 dark:hover:bg-white/5 transition-colors relative cursor-pointer"
                        >
                          <Share2 className="w-4 h-4" />
                          {shareFeedback === post.id && (
                            <span className="absolute -top-7 right-0 text-[10px] bg-[#141821] dark:bg-[#F5F2EC] text-white dark:text-[#161B26] px-2.5 py-0.5 rounded-full shadow whitespace-nowrap z-20">
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
        <div className="mt-14 sm:mt-20 obsidian-anchor-card rounded-[28px] p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(43, 149, 255, 0.25) 0%, rgba(43, 149, 255, 0) 70%)' }} />
          
          <div className="relative z-10 max-w-2xl">
            <span className="text-[#60AFFF] dark:text-[#1263D6] text-xs font-bold uppercase tracking-wider block mb-1">
              {isArabic ? 'النشرة المعرفية والتأهيلية الأسبوعية' : 'Weekly Clinical Rehabilitation Newsletter'}
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white dark:text-[#161B26] mb-2">
              {isArabic ? 'هل تود استلام أحدث الإرشادات السلوكية والنطقية؟' : 'Get the latest behavioral & speech guides'}
            </h3>
            <p className="text-[#94A3B8] dark:text-[#4B5563] text-xs sm:text-sm leading-relaxed mb-6">
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
                className="flex-1 px-5 py-3 rounded-full bg-white/10 dark:bg-[#161B26]/5 border border-white/20 dark:border-[#161B26]/15 text-white dark:text-[#161B26] placeholder:text-[#94A3B8] dark:placeholder:text-[#4B5563] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2B95FF]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#2B95FF] to-[#1A73E8] hover:brightness-110 text-white font-black text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-[#2B95FF]/25 shrink-0"
              >
                {isArabic ? 'اشتراك مجاني' : 'Subscribe Free'}
              </button>
            </form>
          </div>
        </div>

        {/* Clinical Assessment Booking CTA */}
        <div className="mt-10 sm:mt-12 liquid-glass-card rounded-[28px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#2B95FF]/12 text-[#1263D6] dark:text-[#60AFFF] flex items-center justify-center shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black text-[#161B26] dark:text-[#F8FAFC]">
                {isArabic ? 'هل يحتاج طفلك إلى خطة تدخل سلوكي أو تأهيلي عاجلة؟' : 'Does your child need urgent behavioral or therapy intake?'}
              </h4>
              <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] mt-0.5">
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
            className="w-full md:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#2B95FF] to-[#1A73E8] hover:brightness-110 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md shadow-[#2B95FF]/20 transition-all cursor-pointer shrink-0 text-center"
          >
            {isArabic ? 'احجز تقييم طفلك الآن' : 'Book Child Assessment'}
          </button>
        </div>

      </div>

      {/* Full Article Reader Modal (Dedicated Deep-Read View) */}
      {readingPost && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/60 backdrop-blur-md animate-fade-in"
          onClick={handleCloseReader}
        >
          <div 
            className="glass-modal-dialog rounded-[28px] w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Sticky Reading Progress Bar */}
            <div className="w-full bg-[#161B26]/5 dark:bg-white/10 h-1.5">
              <div 
                className="bg-gradient-to-r from-[#2B95FF] to-[#1A73E8] h-full transition-all duration-150"
                style={{ width: `${readingProgress}%` }}
              />
            </div>

            {/* Reader Header Bar */}
            <div className="px-5 sm:px-8 py-3.5 border-b border-[#161B26]/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-3 shrink-0 liquid-glass-panel">
              
              <div className="flex items-center gap-2 truncate">
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#141821] dark:bg-[#F5F2EC] text-white dark:text-[#161B26]">
                  {isArabic ? readingPost.categoryTitle : (readingPost.categoryTitleEn || readingPost.categoryTitle)}
                </span>
                <span className="text-xs font-bold text-[#4B5563] dark:text-[#94A3B8] truncate hidden sm:inline">
                  {isArabic ? readingPost.title : (readingPost.titleEn || readingPost.title)}
                </span>
              </div>

              {/* Reader Controls: Font Size, Share, Close */}
              <div className="flex items-center gap-2 shrink-0">
                
                {/* Font Size Adjuster */}
                <div className="flex items-center liquid-glass-pill rounded-full p-0.5 text-xs">
                  <button
                    onClick={() => setReaderFontSize('sm')}
                    className={`px-2.5 py-1 rounded-full font-bold cursor-pointer transition-all ${readerFontSize === 'sm' ? 'warm-pill-cta shadow-xs' : 'text-[#4B5563] dark:text-[#94A3B8]'}`}
                    title="خط صغير"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setReaderFontSize('md')}
                    className={`px-2.5 py-1 rounded-full font-bold cursor-pointer transition-all ${readerFontSize === 'md' ? 'warm-pill-cta shadow-xs' : 'text-[#4B5563] dark:text-[#94A3B8]'}`}
                    title="خط قياسي"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setReaderFontSize('lg')}
                    className={`px-2.5 py-1 rounded-full font-bold cursor-pointer transition-all ${readerFontSize === 'lg' ? 'warm-pill-cta shadow-xs' : 'text-[#4B5563] dark:text-[#94A3B8]'}`}
                    title="خط كبير"
                  >
                    A+
                  </button>
                </div>

                {/* Copy Link */}
                <button
                  onClick={handleCopyCurrentLink}
                  className="p-2 rounded-full liquid-glass-btn text-[#4B5563] dark:text-[#94A3B8] hover:text-[#1263D6] dark:hover:text-[#60AFFF] transition-colors cursor-pointer relative"
                  title="نسخ رابط المقال"
                >
                  {copyFeedback ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={handleCloseReader}
                  className="w-8 h-8 rounded-full liquid-glass-btn text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
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
              <div className="space-y-3 border-b border-[#161B26]/[0.06] dark:border-white/[0.08] pb-6">
                <div className="flex items-center gap-2 text-xs text-[#4B5563] dark:text-[#94A3B8] flex-wrap">
                  <span className="font-bold text-[#161B26] dark:text-[#F8FAFC]">
                    {isArabic ? readingPost.author?.name : (readingPost.author?.nameEn || readingPost.author?.name)}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{isArabic ? readingPost.publishDate : (readingPost.publishDateEn || readingPost.publishDate)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{readingPost.readTimeMinutes} {isArabic ? 'دقائق قراءة موجهة' : 'min read'}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#047857] dark:text-[#34D399] font-bold">
                    {isArabic ? 'مراجعة إكلينيكية معتمدة' : 'Clinically Reviewed'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#161B26] dark:text-[#F8FAFC] leading-tight">
                  {isArabic ? readingPost.title : (readingPost.titleEn || readingPost.title)}
                </h1>

                <p className="text-sm sm:text-base text-[#4B5563] dark:text-[#94A3B8] leading-relaxed font-medium">
                  {isArabic ? readingPost.excerpt : (readingPost.excerptEn || readingPost.excerpt)}
                </p>
              </div>

              {/* Cover Image */}
              <div className="rounded-[24px] overflow-hidden aspect-[16/9] max-h-[380px] bg-[#161B26]/5 dark:bg-white/5 shadow-md">
                <img
                  src={readingPost.image}
                  alt={readingPost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Key Takeaways Box */}
              {readingPost.keyTakeaways && readingPost.keyTakeaways.length > 0 && (
                <div className="p-5 sm:p-6 rounded-[24px] bg-[#2B95FF]/8 border border-[#2B95FF]/20 space-y-3">
                  <div className="flex items-center gap-2 text-[#1263D6] dark:text-[#60AFFF] font-black text-sm">
                    <Sparkles className="w-4 h-4 text-[#2B95FF]" />
                    <span>{isArabic ? 'أبرز المخرجات والنقاط الإكلينيكية المستفادة:' : 'Key Clinical Takeaways:'}</span>
                  </div>
                  <div className="space-y-2">
                    {readingPost.keyTakeaways.map((takeaway, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#161B26] dark:text-[#F8FAFC] font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Article Paragraphs */}
              <div className={`space-y-4 text-[#4B5563] dark:text-[#94A3B8] leading-relaxed ${
                readerFontSize === 'sm' ? 'text-xs sm:text-sm' : readerFontSize === 'lg' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
              }`}>
                {(isArabic ? readingPost.content : (readingPost.contentEn || readingPost.content))?.map((block, pIdx) => {
                  const trimmed = (block || '').trim();
                  if (trimmed.startsWith('## ')) {
                    return (
                      <h3
                        key={pIdx}
                        className="text-lg sm:text-xl font-black text-[#161B26] dark:text-[#F8FAFC] pt-4 pb-1 border-b border-[#161B26]/[0.06] dark:border-white/[0.08]"
                      >
                        {trimmed.slice(3)}
                      </h3>
                    );
                  }
                  if (trimmed.startsWith('### ')) {
                    return (
                      <h4
                        key={pIdx}
                        className="text-base sm:text-lg font-extrabold text-[#1263D6] dark:text-[#60AFFF] pt-2.5"
                      >
                        {trimmed.slice(4)}
                      </h4>
                    );
                  }
                  if (trimmed.startsWith('• ')) {
                    return (
                      <div key={pIdx} className="flex items-start gap-2.5 pr-1 sm:pr-3">
                        <span className="w-2 h-2 rounded-full bg-[#2B95FF] shrink-0 mt-2.5" />
                        <span className="leading-relaxed font-normal text-[#161B26] dark:text-[#F8FAFC]">{trimmed.slice(2)}</span>
                      </div>
                    );
                  }
                  return (
                    <p key={pIdx} className="leading-relaxed font-normal">
                      {trimmed}
                    </p>
                  );
                })}
              </div>

              {/* Tags Cloud */}
              {readingPost.tags && readingPost.tags.length > 0 && (
                <div className="pt-4 border-t border-[#161B26]/[0.06] dark:border-white/[0.08]">
                  <div className="text-xs font-bold text-[#8B95A5] dark:text-[#64748B] mb-2">
                    {isArabic ? 'الوسوم ومحاور المقال:' : 'Article Tags:'}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {readingPost.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-xs font-semibold px-3 py-1 rounded-full liquid-glass-pill text-[#4B5563] dark:text-[#94A3B8]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Bio Card with Direct Booking Action */}
              <div className="p-5 sm:p-6 rounded-[24px] liquid-glass-panel flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {readingPost.author?.avatar ? (
                    <img
                      src={readingPost.author.avatar}
                      alt={readingPost.author.name}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-[#2B95FF]/30"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2B95FF] to-[#1A73E8] text-white font-black text-xl flex items-center justify-center shrink-0">
                      {readingPost.author?.name ? readingPost.author.name.slice(0, 1) : 'ر'}
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] font-bold text-[#1263D6] dark:text-[#60AFFF] block">
                      {isArabic ? 'المؤلف والمشرف الإكلينيكي' : 'Author & Clinical Specialist'}
                    </span>
                    <h4 className="text-base font-black text-[#161B26] dark:text-[#F8FAFC]">
                      {isArabic ? readingPost.author?.name : (readingPost.author?.nameEn || readingPost.author?.name)}
                    </h4>
                    <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] mt-0.5">
                      {isArabic ? readingPost.author?.role : (readingPost.author?.roleEn || readingPost.author?.role)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleBookWithAuthor(readingPost.author?.id)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#2B95FF] to-[#1A73E8] hover:brightness-110 text-white text-xs font-bold transition-all shadow-sm shadow-[#2B95FF]/20 shrink-0 cursor-pointer text-center"
                >
                  {isArabic ? 'حجز موعد مع هذا الأخصائي' : 'Book with Specialist'}
                </button>
              </div>

              {/* Social Share Drawer */}
              <div className="pt-4 border-t border-[#161B26]/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs font-bold text-[#4B5563] dark:text-[#94A3B8]">
                  {isArabic ? 'شارك هذه المعرفة مع أسرة تحتاجها:' : 'Share this guide:'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShareWhatsApp}
                    className="px-3.5 py-1.5 rounded-full bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#047857] dark:text-[#34D399] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>واتساب</span>
                  </button>

                  <button
                    onClick={handleShareTwitter}
                    className="px-3.5 py-1.5 rounded-full liquid-glass-pill text-[#161B26] dark:text-[#F8FAFC] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>منصة X</span>
                  </button>

                  <button
                    onClick={handleCopyCurrentLink}
                    className="px-3.5 py-1.5 rounded-full liquid-glass-pill text-[#4B5563] dark:text-[#94A3B8] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copyFeedback ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copyFeedback ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'نسخ الرابط' : 'Copy')}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Sticky Reader Footer */}
            <div className="px-5 sm:px-8 py-3.5 border-t border-[#161B26]/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-4 shrink-0 liquid-glass-panel">
              <button
                onClick={handleCloseReader}
                className="text-xs font-bold text-[#4B5563] dark:text-[#94A3B8] hover:text-[#161B26] dark:hover:text-white transition-colors cursor-pointer"
              >
                {isArabic ? '← العودة لكافة المقالات' : '← Back to All Articles'}
              </button>

              <button
                onClick={() => {
                  if (onOpenBooking) onOpenBooking(`استفسار بناء على مقال: ${readingPost.title}`);
                }}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#2B95FF] to-[#1A73E8] hover:brightness-110 text-white font-black text-xs transition-all shadow-sm shadow-[#2B95FF]/20 cursor-pointer"
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
