import { BlogPost } from '../types';
import { BLOG_POSTS } from './blogData';
import { savePersistentModule } from '../utils/persistentSync';

const STORAGE_BLOG_KEY = 'raba_blog_posts_v1';
const BROKEN_IMAGE_FRAGMENT = 'photo-1596464716127-f2a829822391';
const HEALED_IMAGE = 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80';

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
    if (Array.isArray(parsed) && parsed.length > 0) {
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
