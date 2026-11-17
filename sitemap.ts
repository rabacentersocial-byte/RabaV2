import fs from 'fs';
import path from 'path';
import { SERVICE_SEO_ROUTES } from './src/data/seoRoutes.ts';

export namespace MetadataRoute {
  export interface SitemapItem {
    url: string;
    lastModified?: string | Date;
    changeFrequency?:
      | 'always'
      | 'hourly'
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'yearly'
      | 'never';
    priority?: number;
  }

  export type Sitemap = SitemapItem[];
}

const BASE_URL = 'https://rabacenters.com';

interface BlogPostEntry {
  slug?: unknown;
  active?: unknown;
  updatedAt?: unknown;
  date?: unknown;
}

function readBlogPostsFromDisk(): BlogPostEntry[] {
  const candidates = [
    path.join(process.cwd(), 'data', 'blog_posts.json'),
    path.join(process.cwd(), 'public', 'data', 'blog_posts.json'),
  ];

  for (const filePath of candidates) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Fallback to next candidate
    }
  }

  return [];
}

function formatLastModified(value?: string | Date): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().split('T')[0];
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0];
    }
  }
  return new Date().toISOString().split('T')[0];
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date().toISOString().split('T')[0];

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/articles`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/specialists`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/courses`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/branches`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/branches/riyadh`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/branches/alkharj`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/booking`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/offers-directory`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/shadow-teacher`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/partners`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/testimonials`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  const serviceDetailRoutes: MetadataRoute.Sitemap = SERVICE_SEO_ROUTES.map((srv) => ({
    url: `${BASE_URL}/services/${srv.slug}`,
    lastModified: today,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const blogPosts = readBlogPostsFromDisk();
  const dynamicBlogRoutes: MetadataRoute.Sitemap = blogPosts
    .filter(
      (post) =>
        post &&
        typeof post.slug === 'string' &&
        post.slug.trim().length > 0 &&
        post.active !== false
    )
    .map((post) => {
      const safeSlug = encodeURIComponent((post.slug as string).trim());
      const rawDate =
        typeof post.updatedAt === 'string'
          ? post.updatedAt
          : typeof post.date === 'string'
          ? post.date
          : today;

      return {
        url: `${BASE_URL}/blog/${safeSlug}`,
        lastModified: formatLastModified(rawDate),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    });

  return [...staticRoutes, ...serviceDetailRoutes, ...dynamicBlogRoutes].filter(
    (entry) => typeof entry.url === 'string' && !entry.url.includes('#')
  );
}

export function renderSitemapXml(entries: MetadataRoute.Sitemap = sitemap()): string {
  const cleanEntries = entries.filter(
    (entry) => typeof entry.url === 'string' && !entry.url.includes('#')
  );

  const urlNodes = cleanEntries
    .map((entry) => {
      const lines = [
        '  <url>',
        `    <loc>${escapeXml(entry.url)}</loc>`,
      ];

      if (entry.lastModified) {
        lines.push(`    <lastmod>${formatLastModified(entry.lastModified)}</lastmod>`);
      }
      if (entry.changeFrequency) {
        lines.push(`    <changefreq>${entry.changeFrequency}</changefreq>`);
      }
      if (typeof entry.priority === 'number') {
        lines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
      }

      lines.push('  </url>');
      return lines.join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlNodes,
    '</urlset>',
    '',
  ].join('\n');
}
