# XML Sitemap & Robots.txt Architecture

Laravel acts as the generator for SEO discovery files to ensure absolute real-time accuracy and prevent the Next.js frontend from needing to poll massive datasets during build time.

## 1. Dynamic Sitemap Generation
Laravel will use `spatie/laravel-sitemap` to dynamically generate the XML responses.

### Endpoints
- `GET /sitemap.xml` (The primary index or single sitemap file depending on size)
- `GET /sitemap-index.xml` (For splitting massive sitemaps, e.g., `/sitemap-blogs.xml`, `/sitemap-portfolio.xml`)

### Included Entities (Published Content Only)
1. **Pages** (`/`, `/about`, `/contact`, etc.)
2. **Blog Posts** (`/blog/{slug}`)
3. **Portfolio Projects** (`/portfolio/{slug}`)
4. **Case Studies** (`/case-studies/{slug}`)
5. **Categories** (`/category/{slug}`)
6. **Tags** (`/tag/{slug}`)

### Output Format
Every entry must include:
- `loc` (Absolute URL)
- `lastmod` (Derived from model's `updated_at`)
- `changefreq` (Configurable per model, e.g., `daily` for homepage, `weekly` for posts)
- `priority` (e.g., `1.0` for home, `0.8` for posts)

## 2. Robots.txt
Laravel will expose a dynamic `GET /robots.txt`.

**Output**:
```text
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://uzair.dev/sitemap.xml
```

## Cache Strategy
Sitemap generation is expensive. The XML output will be cached and invalidated/regenerated via Event Listeners whenever a model (Page, Post, Project) is created, updated, or deleted.
