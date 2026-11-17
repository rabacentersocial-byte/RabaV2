import fs from 'fs';
import path from 'path';
import {
  STATIC_SEO_PATHS,
  SERVICE_SEO_ROUTES,
  injectRouteSeoHtml,
  resolveRouteSeo,
  ArticleSeed,
} from '../src/data/seoRoutes.ts';
import { BLOG_POSTS } from '../src/data/blogData.ts';

function loadMergedBlogPosts(): ArticleSeed[] {
  const candidates = [
    path.join(process.cwd(), 'data', 'blog_posts.json'),
    path.join(process.cwd(), 'public', 'data', 'blog_posts.json'),
  ];

  const merged: ArticleSeed[] = [];
  const seenSlugs = new Set<string>();

  for (const filePath of candidates) {
    try {
      if (fs.existsSync(filePath)) {
        const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            const slug = typeof item?.slug === 'string' ? item.slug.trim() : '';
            if (slug && !seenSlugs.has(slug) && item?.active !== false && item?.status !== 'draft') {
              seenSlugs.add(slug);
              merged.push(item);
            }
          }
        }
      }
    } catch {
      // Ignore invalid optional disk JSON and continue
    }
  }

  for (const item of BLOG_POSTS as ArticleSeed[]) {
    const slug = typeof item?.slug === 'string' ? item.slug.trim() : '';
    if (slug && !seenSlugs.has(slug) && item?.active !== false) {
      seenSlugs.add(slug);
      merged.push(item);
    }
  }

  return merged;
}

function prerenderStaticSeoPages(): void {
  const distDir = path.join(process.cwd(), 'dist');
  const templatePath = path.join(distDir, 'index.html');

  if (!fs.existsSync(templatePath)) {
    throw new Error(`[prerender-seo] dist/index.html not found at ${templatePath}. Run vite build first.`);
  }

  const baseHtml = fs.readFileSync(templatePath, 'utf-8');
  const blogPosts = loadMergedBlogPosts();

  const routeSet = new Set<string>();
  for (const p of STATIC_SEO_PATHS) {
    routeSet.add(p.replace(/\/+$/, ''));
  }
  for (const srv of SERVICE_SEO_ROUTES) {
    routeSet.add(`/services/${srv.slug}`);
  }
  for (const post of blogPosts) {
    const slug = typeof post?.slug === 'string' ? post.slug.trim() : '';
    if (slug) {
      routeSet.add(`/blog/${slug}`);
      routeSet.add(`/articles/${slug}`);
    }
  }

  let generatedCount = 0;
  for (const routePath of routeSet) {
    const seo = resolveRouteSeo(routePath, blogPosts);
    const renderedHtml = injectRouteSeoHtml(baseHtml, routePath, blogPosts);

    if (!renderedHtml.includes(seo.canonical) || !renderedHtml.includes('id="raba-structured-data"')) {
      throw new Error(`[prerender-seo] Metadata injection verification failed for route: ${routePath}`);
    }

    const relativeDir = routePath.replace(/^\/+/, '');
    const targetDir = path.join(distDir, relativeDir);
    const targetFile = path.join(targetDir, 'index.html');

    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(targetFile, renderedHtml, 'utf-8');
    generatedCount++;
  }

  console.log(`[prerender-seo] Successfully pre-rendered ${generatedCount} static SEO route pages into dist/.`);
}

prerenderStaticSeoPages();
