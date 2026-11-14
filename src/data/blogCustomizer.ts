import { BlogPost } from '../types';
import { BLOG_POSTS } from './blogData';
import { savePersistentModule } from '../utils/persistentSync';

const STORAGE_BLOG_KEY = 'raba_blog_posts_v1';
const MIGRATION_FLAG_KEY = 'raba_blog_migrated_2026_11_15_v7';
const BROKEN_IMAGE_FRAGMENT = 'photo-1596464716127-f2a829822391';
const HEALED_IMAGE = '/images/hero/card_2_assessment.webp';

export function isLegacySeededBlogList(list: any[]): boolean {
  return (
    Array.isArray(list) &&
    list.length > 0 &&
    list.length <= 6 &&
    list.every((p) => typeof p?.id === 'string' && /^blog-[1-6]$/.test(p.id))
  );
}

export function getStoredBlogPosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_BLOG_KEY);
    if (!raw) {
      return BLOG_POSTS.map((p, idx) => ({
        ...p,
        image: p.image?.includes(BROKEN_IMAGE_FRAGMENT) ? HEALED_IMAGE : p.image,
        status: p.status || 'published',
        isSliderFeatured: p.isSliderFeatured !== false,
        order: p.order || idx + 1
      }));
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const migrated = localStorage.getItem(MIGRATION_FLAG_KEY) === '1';
      if (!migrated && isLegacySeededBlogList(parsed)) {
        try {
          localStorage.setItem(MIGRATION_FLAG_KEY, '1');
          localStorage.setItem(STORAGE_BLOG_KEY, JSON.stringify(BLOG_POSTS));
        } catch {
          // ignore
        }
        return BLOG_POSTS;
      }
      if (!migrated) {
        const missingDefaults = BLOG_POSTS.filter(
          (def) => !parsed.some((p: any) => p?.id === def.id)
        );
        const merged = missingDefaults.length > 0
          ? [
              ...parsed,
              ...missingDefaults.map((def, idx) => ({
                ...def,
                order: parsed.length + idx + 1
              }))
            ]
          : parsed;
        try {
          localStorage.setItem(MIGRATION_FLAG_KEY, '1');
          if (missingDefaults.length > 0) {
            localStorage.setItem(STORAGE_BLOG_KEY, JSON.stringify(merged));
          }
        } catch {
          // ignore
        }
        return merged
          .map(p => ({
            ...p,
            image: p.image?.includes(BROKEN_IMAGE_FRAGMENT) ? HEALED_IMAGE : p.image
          }))
          .sort((a, b) => (a.order || 0) - (b.order || 0));
      }
      return parsed
        .map(p => ({
          ...p,
          image: p.image?.includes(BROKEN_IMAGE_FRAGMENT) ? HEALED_IMAGE : p.image
        }))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return BLOG_POSTS;
  } catch {
    return BLOG_POSTS;
  }
}

export function saveStoredBlogPosts(posts: BlogPost[]): void {
  try {
    localStorage.setItem(MIGRATION_FLAG_KEY, '1');
    localStorage.setItem(STORAGE_BLOG_KEY, JSON.stringify(posts));
  } catch (err) {
    console.error('Failed to save blog posts', err);
  }
  savePersistentModule(STORAGE_BLOG_KEY, posts);
  window.dispatchEvent(new CustomEvent('raba_blog_posts_updated', { detail: posts }));
}

export function resetBlogPostsToDefault(): BlogPost[] {
  const defaults = BLOG_POSTS.map((p, idx) => ({
    ...p,
    status: 'published' as const,
    isSliderFeatured: true,
    order: idx + 1
  }));
  saveStoredBlogPosts(defaults);
  return defaults;
}
