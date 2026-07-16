import { MetadataRoute } from 'next';
import axios from 'axios';

// Server-only context (sitemap generation always runs on the server) - talk
// to the internal backend directly, same target next.config.ts's rewrite
// proxies /api/* to, rather than a domain-specific public URL.
const API_URL = process.env.NEXT_PUBLIC_API_URL || `${process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:8000'}/api/v1`;

async function fetchSlugs(endpoint: string): Promise<{ slug: string; updated_at?: string }[]> {
  try {
    const res = await axios.get(`${API_URL}/public/${endpoint}`, { params: { per_page: 100 } });
    return res.data?.data || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://uzair.dev';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/case-studies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/downloads`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ];

  const [blogs, portfolios, caseStudies, downloads] = await Promise.all([
    fetchSlugs('blogs'),
    fetchSlugs('portfolios'),
    fetchSlugs('case-studies'),
    fetchSlugs('downloads'),
  ]);

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...blogs.map((p) => ({ url: `${baseUrl}/blog/${p.slug}`, lastModified: p.updated_at ? new Date(p.updated_at) : new Date(), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...portfolios.map((p) => ({ url: `${baseUrl}/portfolio/${p.slug}`, lastModified: p.updated_at ? new Date(p.updated_at) : new Date(), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...caseStudies.map((p) => ({ url: `${baseUrl}/case-studies/${p.slug}`, lastModified: p.updated_at ? new Date(p.updated_at) : new Date(), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...downloads.map((p) => ({ url: `${baseUrl}/downloads/${p.slug}`, lastModified: p.updated_at ? new Date(p.updated_at) : new Date(), changeFrequency: 'monthly' as const, priority: 0.5 })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
