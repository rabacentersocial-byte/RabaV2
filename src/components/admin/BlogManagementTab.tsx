import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Plus, 
  Upload, 
  Trash2, 
  SlidersHorizontal, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  User, 
  ArrowUp, 
  ArrowDown, 
  X, 
  RotateCcw,
  Tag,
  Share2,
  ExternalLink,
  Layers,
  Heart
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { BlogPost } from '../../types';
import { 
  getStoredBlogPosts, 
  saveStoredBlogPosts, 
  resetBlogPostsToDefault 
} from '../../data/blogCustomizer';
import { compressImage } from '../../utils/imageCompressor';
import { SPECIALISTS } from '../../data/mockData';

interface BlogManagementTabProps {
  hasPermission?: (perm: any) => boolean;
}

export const BlogManagementTab: React.FC<BlogManagementTabProps> = () => {
  const { isArabic } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>(() => getStoredBlogPosts());
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit / Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewPost, setIsNewPost] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Delete & Reset Confirmation Modals
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formCategory, setFormCategory] = useState<BlogPost['category']>('autism');
  const [formCategoryTitle, setFormCategoryTitle] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formExcerptEn, setFormExcerptEn] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formKeyTakeaways, setFormKeyTakeaways] = useState('');
  const [formAuthorName, setFormAuthorName] = useState('');
  const [formAuthorRole, setFormAuthorRole] = useState('');
  const [formAuthorAvatar, setFormAuthorAvatar] = useState('');
  const [formReadTime, setFormReadTime] = useState<number>(5);
  const [formTags, setFormTags] = useState('');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');
  const [formIsSliderFeatured, setFormIsSliderFeatured] = useState<boolean>(true);
  const [isCompressing, setIsCompressing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const updatePostsState = (newPosts: BlogPost[]) => {
    setPosts(newPosts);
    saveStoredBlogPosts(newPosts);
    showFeedback(isArabic ? 'تم حفظ التعديلات بنجاح' : 'Changes saved successfully');
  };

  // Reordering in Slider
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const next = [...posts];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    next.forEach((p, idx) => { p.order = idx + 1; });
    updatePostsState(next);
  };

  const handleMoveDown = (index: number) => {
    if (index === posts.length - 1) return;
    const next = [...posts];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    next.forEach((p, idx) => { p.order = idx + 1; });
    updatePostsState(next);
  };

  // Toggle status (published vs draft)
  const handleToggleStatus = (id: string) => {
    const next = posts.map((p) => {
      if (p.id === id) {
        const nextStatus = p.status === 'draft' ? 'published' : 'draft';
        return { ...p, status: nextStatus as any };
      }
      return p;
    });
    updatePostsState(next);
  };

  // Toggle slider visibility
  const handleToggleSlider = (id: string) => {
    const next = posts.map((p) => {
      if (p.id === id) {
        return { ...p, isSliderFeatured: p.isSliderFeatured === false ? true : false };
      }
      return p;
    });
    updatePostsState(next);
  };

  // Delete initiation - opens styled confirmation modal
  const handleDeletePost = (post: BlogPost) => {
    setPostToDelete(post);
  };

  // Confirm delete post
  const handleConfirmDelete = () => {
    if (!postToDelete) return;
    const next = posts.filter((p) => p.id !== postToDelete.id);
    next.forEach((p, idx) => { p.order = idx + 1; });
    updatePostsState(next);
    setPostToDelete(null);
    showFeedback(isArabic ? '✓ تم حذف المقال بنجاح' : 'Article deleted successfully');
  };

  // Reset to defaults with confirmation modal
  const handleConfirmReset = () => {
    const defs = resetBlogPostsToDefault();
    setPosts(defs);
    setIsResetConfirmOpen(false);
    showFeedback(isArabic ? '✓ تمت استعادة المقالات الافتراضية بنجاح' : 'Reset to default articles');
  };

  // Open modal for new
  const handleOpenNew = () => {
    setIsNewPost(true);
    setEditingPost(null);
    setFormTitle('');
    setFormTitleEn('');
    setFormCategory('psychology');
    setFormCategoryTitle('علم النفس والأعصاب');
    setFormImage('/images/hero/card_2_assessment.webp');
    setFormExcerpt('');
    setFormExcerptEn('');
    setFormContent('');
    setFormKeyTakeaways('');
    setFormAuthorName('أ. عامر قادوس');
    setFormAuthorRole('أخصائي التأهيل العصبي وباحث علم النفس العصبي | محلل سلوك دولي IBA');
    setFormAuthorAvatar('/specialists/61_amer-qadoos.webp');
    setFormReadTime(5);
    setFormTags('علم النفس والأعصاب, التأهيل العصبي');
    setFormStatus('published');
    setFormIsSliderFeatured(true);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (post: BlogPost) => {
    setIsNewPost(false);
    setEditingPost(post);
    setFormTitle(post.title);
    setFormTitleEn(post.titleEn || '');
    setFormCategory(post.category);
    setFormCategoryTitle(post.categoryTitle);
    setFormImage(post.image);
    setFormExcerpt(post.excerpt);
    setFormExcerptEn(post.excerptEn || '');
    setFormContent(Array.isArray(post.content) ? post.content.join('\n\n') : '');
    setFormKeyTakeaways(Array.isArray(post.keyTakeaways) ? post.keyTakeaways.join('\n') : '');
    setFormAuthorName(post.author.name);
    setFormAuthorRole(post.author.role);
    setFormAuthorAvatar(post.author.avatar);
    setFormReadTime(post.readTimeMinutes || 5);
    setFormTags(Array.isArray(post.tags) ? post.tags.join(', ') : '');
    setFormStatus(post.status || 'published');
    setFormIsSliderFeatured(post.isSliderFeatured !== false);
    setIsModalOpen(true);
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressing(true);
      const dataUrl = await compressImage(file, 900, 600, 0.82);
      setFormImage(dataUrl);
      setIsCompressing(false);
    } catch {
      setIsCompressing(false);
      showFeedback(isArabic ? 'فشل معالجة الصورة' : 'Image failed', 'error');
    }
  };

  // Handle author avatar upload
  const handleAuthorAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressing(true);
      const dataUrl = await compressImage(file, 400, 400, 0.85);
      setFormAuthorAvatar(dataUrl);
      setIsCompressing(false);
      showFeedback(isArabic ? '✓ تم تحديث صورة الكاتب بنجاح' : 'Author avatar updated successfully', 'success');
    } catch {
      setIsCompressing(false);
      showFeedback(isArabic ? 'فشل معالجة صورة الكاتب' : 'Author avatar upload failed', 'error');
    }
  };

  // Save Modal Form
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showFeedback(isArabic ? 'يرجى إدخال عنوان المقال' : 'Enter article title', 'error');
      return;
    }

    const contentParagraphs = formContent
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const takeaways = formKeyTakeaways
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const tagsList = formTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const categoryColorMap: Record<string, string> = {
      psychology: 'sky',
      autism: 'sky',
      aba: 'emerald',
      occupational: 'amber',
      speech: 'purple',
      family_guidance: 'rose'
    };

    if (isNewPost) {
      const newPostItem: BlogPost = {
        id: `blog-post-${Date.now()}`,
        title: formTitle,
        titleEn: formTitleEn || formTitle,
        slug: formTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        excerpt: formExcerpt || formTitle,
        excerptEn: formExcerptEn || formExcerpt,
        content: contentParagraphs.length > 0 ? contentParagraphs : [formExcerpt],
        contentEn: [formExcerptEn || formExcerpt],
        category: formCategory,
        categoryTitle: formCategoryTitle || formCategory,
        categoryColor: categoryColorMap[formCategory] || 'teal',
        author: {
          name: formAuthorName || 'مركز رابا',
          role: formAuthorRole || 'أخصائي معتمد',
          avatar: formAuthorAvatar || '/specialists/hanaa_basheer.jpg'
        },
        image: formImage || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
        readTimeMinutes: formReadTime || 5,
        publishDate: new Date().toLocaleDateString('ar-SA', { month: 'long', day: 'numeric', year: 'numeric' }),
        publishDateEn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        viewsCount: 1,
        likesCount: 0,
        tags: tagsList,
        keyTakeaways: takeaways,
        status: formStatus,
        isSliderFeatured: formIsSliderFeatured,
        order: posts.length + 1
      };

      updatePostsState([...posts, newPostItem]);
    } else if (editingPost) {
      const next = posts.map((p) => {
        if (p.id === editingPost.id) {
          return {
            ...p,
            title: formTitle,
            titleEn: formTitleEn,
            excerpt: formExcerpt,
            excerptEn: formExcerptEn,
            content: contentParagraphs.length > 0 ? contentParagraphs : p.content,
            keyTakeaways: takeaways.length > 0 ? takeaways : p.keyTakeaways,
            category: formCategory,
            categoryTitle: formCategoryTitle,
            categoryColor: categoryColorMap[formCategory] || p.categoryColor,
            author: {
              ...p.author,
              name: formAuthorName,
              role: formAuthorRole,
              avatar: formAuthorAvatar
            },
            image: formImage,
            readTimeMinutes: formReadTime,
            tags: tagsList,
            status: formStatus,
            isSliderFeatured: formIsSliderFeatured
          };
        }
        return p;
      });
      updatePostsState(next);
    }

    setIsModalOpen(false);
  };

  const filteredList = posts.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'published') return p.status === 'published';
    if (activeFilter === 'draft') return p.status === 'draft';
    if (activeFilter === 'slider') return p.isSliderFeatured !== false;
    return p.category === activeFilter;
  });

  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const sliderCount = posts.filter((p) => p.isSliderFeatured !== false && p.status === 'published').length;

  return (
    <div className="space-y-6">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#00E5BE] text-xs font-black">
              {isArabic ? 'المحتوى الإكلينيكي والمعرفي' : 'Clinical Knowledge'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#00E5BE]" />
            <span>{isArabic ? 'إدارة المدونات والمقالات وسلايدر المعرفة' : 'Blog & Articles Management'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isArabic 
              ? 'نشر مقالات جديدة، التحكم في نصوص وصور سلايدر المدونات بالواجهة، وتحديد المقالات المعروضة للزوار' 
              : 'Publish articles, customize slider cards, manage cover photos, and toggle visibility'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isArabic ? 'استعادة الافتراضي' : 'Reset'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenNew}
            className="px-4 py-2 rounded-xl bg-[#0B3B36] hover:bg-[#00E5BE] hover:text-slate-950 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isArabic ? 'إضافة مقال جديد' : 'New Article'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className={`p-3.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg transition-all animate-in fade-in ${
          feedbackMsg.type === 'success' 
            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300' 
            : 'bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-300'
        }`}>
          {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* 2. Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block">{isArabic ? 'إجمالي المقالات' : 'Total Articles'}</span>
          <span className="text-xl font-black text-slate-900 dark:text-white">{posts.length}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block">{isArabic ? 'المقالات المنشورة' : 'Published'}</span>
          <span className="text-xl font-black text-emerald-600 dark:text-[#00E5BE]">{publishedCount}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block">{isArabic ? 'في سلايدر الواجهة' : 'In Hero Slider'}</span>
          <span className="text-xl font-black text-sky-600">{sliderCount}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block">{isArabic ? 'المسودات' : 'Drafts'}</span>
          <span className="text-xl font-black text-amber-500">{posts.length - publishedCount}</span>
        </div>
      </div>

      {/* 3. Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {[
          { id: 'all', label: isArabic ? 'الكل' : 'All' },
          { id: 'slider', label: isArabic ? 'معروض في السلايدر' : 'Featured in Slider' },
          { id: 'published', label: isArabic ? 'منشور' : 'Published' },
          { id: 'draft', label: isArabic ? 'مسودة' : 'Draft' },
          { id: 'psychology', label: isArabic ? 'علم النفس والأعصاب' : 'Psychology' },
          { id: 'autism', label: isArabic ? 'طيف التوحد' : 'Autism' },
          { id: 'aba', label: 'ABA' },
          { id: 'occupational', label: isArabic ? 'علاج وظيفي' : 'Occupational' },
          { id: 'speech', label: isArabic ? 'تخاطب' : 'Speech' },
          { id: 'family_guidance', label: isArabic ? 'إرشاد أسري' : 'Family' }
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveFilter(f.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeFilter === f.id
                ? 'bg-[#0B3B36] text-white dark:bg-[#00E5BE] dark:text-slate-950 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 4. Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map((post, idx) => (
          <div
            key={post.id}
            className={`p-4 rounded-3xl border transition-all flex flex-col justify-between gap-4 ${
              post.status === 'published'
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200/60 dark:border-white/5 opacity-75'
            }`}
          >
            {/* Top Row: Thumbnail + Category + Order */}
            <div className="flex items-start gap-3">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-white/10">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-[#00E5BE] text-[10px] font-black">
                    {post.categoryTitle}
                  </span>
                  
                  {post.isSliderFeatured !== false && (
                    <span className="px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-700 dark:text-sky-300 text-[10px] font-black flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>{isArabic ? 'في السلايدر' : 'In Slider'}</span>
                    </span>
                  )}

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    post.status === 'published' 
                      ? 'bg-emerald-500/10 text-emerald-600' 
                      : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    {post.status === 'published' ? (isArabic ? 'منشور' : 'Published') : (isArabic ? 'مسودة' : 'Draft')}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white line-clamp-2 leading-snug">
                  {post.title}
                </h4>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Bottom Row: Author + Read Time + Controls */}
            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <img 
                  src={post.author.avatar || '/specialists/hanaa_basheer.jpg'} 
                  alt={post.author.name}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-[#00E5BE]/40 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80';
                  }}
                />
                <span className="truncate max-w-[120px] font-bold text-slate-700 dark:text-slate-200">{post.author.name}</span>
                <span>•</span>
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{post.readTimeMinutes} {isArabic ? 'د' : 'min'}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                {/* Reorder in Slider */}
                <button
                  type="button"
                  onClick={() => handleMoveUp(idx)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                  title={isArabic ? 'تقديم للأمام في السلايدر' : 'Move Up'}
                >
                  <ArrowUp className="w-3 h-3" />
                </button>

                <button
                  type="button"
                  onClick={() => handleMoveDown(idx)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                  title={isArabic ? 'تأخير للخلف في السلايدر' : 'Move Down'}
                >
                  <ArrowDown className="w-3 h-3" />
                </button>

                {/* Toggle Slider */}
                <button
                  type="button"
                  onClick={() => handleToggleSlider(post.id)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    post.isSliderFeatured !== false 
                      ? 'bg-sky-500/10 text-sky-600 hover:bg-sky-500/20' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                  title={isArabic ? 'إظهار/إخفاء من سلايدر المدونات' : 'Toggle Slider'}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>

                {/* Toggle Status */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(post.id)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    post.status === 'published' 
                      ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
                  }`}
                  title={post.status === 'published' ? (isArabic ? 'تحويل لمسودة' : 'Unpublish') : (isArabic ? 'نشر المقال' : 'Publish')}
                >
                  {post.status === 'published' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(post)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#0B3B36] hover:bg-[#00E5BE] hover:text-slate-950 text-white text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>{isArabic ? 'تعديل' : 'Edit'}</span>
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDeletePost(post)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white transition-all cursor-pointer"
                  title={isArabic ? 'حذف المقال' : 'Delete'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Create / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-[#00E5BE]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {isNewPost ? (isArabic ? 'إضافة ونشر مقال طبي جديد' : 'Add New Clinical Article') : (isArabic ? 'تعديل المقال والمحتوى وسلايدر العرض' : 'Edit Article & Slider Settings')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isArabic ? 'تعديل النصوص، صورة الغلاف، الكاتب، وظهور المقال في السلايدر' : 'Edit text, cover image, author, and slider visibility'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveModal} className="space-y-4">
              
              {/* Title & English Title */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'عنوان المقال باللغة العربية:' : 'Article Title (Arabic):'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="مثال: تفسير اضطراب تبدد الشخصية وتبدد الواقع"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00E5BE]/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'العنوان بالإنجليزية (اختياري):' : 'Title (English):'}
                  </label>
                  <input
                    type="text"
                    value={formTitleEn}
                    onChange={(e) => setFormTitleEn(e.target.value)}
                    placeholder="e.g. Early Intervention Signs for Autism"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00E5BE]/30"
                  />
                </div>
              </div>

              {/* Category & Status & Slider Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'التصنيف الطبي:' : 'Medical Category:'}
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => {
                      const cat = e.target.value as any;
                      setFormCategory(cat);
                      const titles: Record<string, string> = {
                        psychology: 'علم النفس والأعصاب',
                        autism: 'طيف التوحد والتدخل المبكر',
                        aba: 'تحليل السلوك التطبيقي (ABA)',
                        occupational: 'العلاج الوظيفي والتكامل الحسي',
                        speech: 'النطق والتخاطب والتواصل',
                        family_guidance: 'إرشادات أسرية وتعديل روتين'
                      };
                      setFormCategoryTitle(titles[cat] || cat);
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00E5BE]/30"
                  >
                    <option value="psychology">علم النفس والأعصاب</option>
                    <option value="autism">طيف التوحد والتدخل المبكر</option>
                    <option value="aba">تحليل السلوك التطبيقي (ABA)</option>
                    <option value="occupational">العلاج الوظيفي والتكامل الحسي</option>
                    <option value="speech">النطق والتخاطب</option>
                    <option value="family_guidance">إرشادات أسرية</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'حالة النشر:' : 'Publish Status:'}
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00E5BE]/30"
                  >
                    <option value="published">{isArabic ? 'منشور (يظهر للجمهور)' : 'Published'}</option>
                    <option value="draft">{isArabic ? 'مسودة (مخفي مؤقتاً)' : 'Draft'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'سلايدر المدونات:' : 'Slider Showcase:'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormIsSliderFeatured(!formIsSliderFeatured)}
                    className={`w-full p-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      formIsSliderFeatured
                        ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-400/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{formIsSliderFeatured ? (isArabic ? 'معروض بالسلايدر' : 'In Slider') : (isArabic ? 'مخفي من السلايدر' : 'Hidden from Slider')}</span>
                  </button>
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  {isArabic ? 'صورة الغلاف للمقال:' : 'Article Cover Image:'}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://... أو رفع صورة"
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none font-mono"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isCompressing}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isCompressing ? (isArabic ? 'جاري الضغط...' : 'Compressing...') : (isArabic ? 'رفع صورة' : 'Upload')}</span>
                  </button>
                </div>
              </div>

              {/* Excerpt (المقدمة والنبذة) */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'المقدمة والنبذة المختصرة (تظهر في بطاقة السلايدر):' : 'Excerpt (shown in slider card):'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  placeholder="مقدمة جذابة توضح أهمية المقال وما سيتعلمه القارئ..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00E5BE]/30 resize-none"
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'نص المقال الكامل (افصل الفقرات بسطر فارغ):' : 'Full Content Paragraphs:'}
                </label>
                <textarea
                  rows={5}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="اكتب فقرات المقال الطبي الكامل هنا..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00E5BE]/30"
                />
              </div>

              {/* Key Takeaways */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'أهم النقاط المستفادة (نقطة في كل سطر):' : 'Key Takeaways (one per line):'}
                </label>
                <textarea
                  rows={3}
                  value={formKeyTakeaways}
                  onChange={(e) => setFormKeyTakeaways(e.target.value)}
                  placeholder="نقطة 1&#10;نقطة 2&#10;نقطة 3"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00E5BE]/30"
                />
              </div>

              {/* Author Customization Panel */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#00E5BE]" />
                    <h5 className="text-xs font-black text-slate-900 dark:text-white">
                      {isArabic ? 'تخصيص كاتب المقال والصورة الشخصية' : 'Author Profile & Avatar Customization'}
                    </h5>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {isArabic ? 'تظهر مع المقال وفي بطاقات السلايدر' : 'Appears on post and slider cards'}
                  </span>
                </div>

                {/* Avatar Preview & Upload Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Avatar Preview with Upload badge */}
                  <div className="relative group shrink-0">
                    <img
                      src={formAuthorAvatar || '/specialists/hanaa_basheer.jpg'}
                      alt={formAuthorName || 'Author'}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-[#00E5BE] shadow-md bg-slate-200 dark:bg-slate-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#00E5BE] text-slate-950 shadow-md hover:scale-110 transition-transform cursor-pointer"
                      title={isArabic ? 'رفع صورة جديدة للكاتب' : 'Upload author photo'}
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </button>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAuthorAvatarUpload}
                    />
                  </div>

                  {/* Upload button & URL input */}
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="py-1.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-[#00E5BE] hover:text-[#00E5BE] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'رفع صورة الكاتب من الجهاز' : 'Upload photo from device'}</span>
                      </button>
                      <span className="text-[11px] text-slate-400">{isArabic ? 'أو أدخل رابط الصورة مباشرة:' : 'Or enter direct URL:'}</span>
                    </div>

                    <input
                      type="text"
                      value={formAuthorAvatar}
                      onChange={(e) => setFormAuthorAvatar(e.target.value)}
                      placeholder={isArabic ? 'رابط صورة الكاتب (مثال: https://... أو /specialists/...)' : 'Author avatar URL'}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-[#00E5BE]"
                    />
                  </div>
                </div>

                {/* Quick Selection from Center Specialists */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      {isArabic ? 'أو اختر صورة الكاتب من أخصائيي رابا:' : 'Or choose from Raba Center Specialists:'}
                    </span>
                    <span className="text-[10px] text-[#00E5BE] font-medium">
                      {isArabic ? 'نقرة واحدة لتعيين الصورة والاسم' : '1-click set photo & name'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                    {SPECIALISTS.slice(0, 8).map((spec) => {
                      const isSelected = formAuthorAvatar === spec.avatar || formAuthorName === spec.name;
                      return (
                        <button
                          key={spec.id}
                          type="button"
                          onClick={() => {
                            setFormAuthorAvatar(spec.avatar);
                            setFormAuthorName(spec.name);
                            setFormAuthorRole(spec.role || spec.title);
                            showFeedback(isArabic ? `✓ تم تعيين الكاتب: ${spec.name}` : `Author set: ${spec.name}`);
                          }}
                          className={`flex items-center gap-1.5 py-1 px-2.5 rounded-xl border text-xs shrink-0 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-[#00E5BE] font-bold shadow-sm'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-[#00E5BE]'
                          }`}
                          title={`${spec.name} - ${spec.title}`}
                        >
                          <img
                            src={spec.avatar}
                            alt={spec.name}
                            className="w-5 h-5 rounded-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80';
                            }}
                          />
                          <span className="text-[11px] truncate max-w-[85px]">{spec.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name, Role & Read Time Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isArabic ? 'اسم الكاتب/الأخصائي:' : 'Author Name:'}
                    </label>
                    <input
                      type="text"
                      value={formAuthorName}
                      onChange={(e) => setFormAuthorName(e.target.value)}
                      placeholder="د. هناء محمد بشير"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-[#00E5BE]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isArabic ? 'المسمى الوظيفي للكاتب:' : 'Author Role:'}
                    </label>
                    <input
                      type="text"
                      value={formAuthorRole}
                      onChange={(e) => setFormAuthorRole(e.target.value)}
                      placeholder="المدير الطبي – استشاري علم نفس"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-[#00E5BE]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isArabic ? 'مدة القراءة (بالدقائق):' : 'Read Time (min):'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={formReadTime}
                      onChange={(e) => setFormReadTime(Number(e.target.value))}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-[#00E5BE]"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B3B36] hover:bg-[#00E5BE] hover:text-slate-950 text-white text-xs font-black shadow-md cursor-pointer transition-all"
                >
                  {isArabic ? 'حفظ ونشر' : 'Save & Publish'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 6. CONFIRM DELETE POST MODAL */}
      {postToDelete && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPostToDelete(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-white/15 text-center space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                {isArabic ? 'تأكيد حذف المقال' : 'Confirm Article Deletion'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-2">
                {isArabic 
                  ? `هل أنت متأكد من رغبتك في حذف مقال «${postToDelete.title}» نهائياً؟` 
                  : `Are you sure you want to delete "${postToDelete.title}" permanently?`}
              </p>
            </div>

            {/* Post preview snippet */}
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/5 flex items-center gap-3 text-start">
              <img 
                src={postToDelete.image} 
                alt={postToDelete.title} 
                className="w-12 h-12 rounded-xl object-cover shrink-0" 
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-teal-600 dark:text-[#00E5BE] block truncate">
                  {postToDelete.categoryTitle}
                </span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 block truncate">
                  {postToDelete.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md cursor-pointer transition-all"
              >
                {isArabic ? 'نعم، حذف نهائي' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. CONFIRM RESET MODAL */}
      {isResetConfirmOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsResetConfirmOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-white/15 text-center space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
              <RotateCcw className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                {isArabic ? 'استعادة المقالات الأصلية' : 'Reset All Articles'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-2">
                {isArabic 
                  ? 'هل تريد استعادة جميع مقالات المدونة الإكلينيكية الأصلية المعتمدة لمركز رابا؟' 
                  : 'Do you want to restore all original clinical articles to default?'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md cursor-pointer transition-all"
              >
                {isArabic ? 'تأكيد الاستعادة' : 'Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
