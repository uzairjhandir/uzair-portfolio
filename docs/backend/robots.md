# Robots.txt Architecture

Laravel dynamically serves the `robots.txt` file to ensure the public frontend has proper crawling instructions.

## API Endpoint
`GET /robots.txt`

*(Note: In a pure Headless setup, Next.js can proxy `/robots.txt` to the Laravel backend, or Laravel can serve it directly from the API subdomain, but the primary domain is usually preferred.)*

## Dynamic Rules
The output will adapt based on the environment (e.g., Staging environments automatically return `Disallow: /`).

**Production Output Format:**
```text
User-agent: *
Crawl-delay: 10

# Disallow Backend and Admin Routes
Disallow: /admin/
Disallow: /api/
Disallow: /login

# Allow Public Assets explicitly
Allow: /images/
Allow: /css/
Allow: /js/

# Auto-generated Sitemap Reference
Sitemap: https://uzair.dev/sitemap.xml
Sitemap: https://uzair.dev/sitemap-index.xml
```
