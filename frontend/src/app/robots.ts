import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://uzair.dev';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Admin, its login flow, and API responses have no business being
      // indexed — previously `allow: '/'` covered everything with no
      // disallow list at all.
      disallow: ['/admin', '/api'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
