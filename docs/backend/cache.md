# Caching Architecture

Caching is critical for achieving < 50ms API response times.

## Cache Driver
- **Production**: Redis
- **Local**: Array / File

## Cache Strategies

### 1. Global API Response Cache
For purely static APIs like `GET /api/v1/navigation` or `GET /api/v1/settings`:
- Cached indefinitely using Laravel's `Cache::rememberForever()`.
- Invalidated selectively via Model Observers when the underlying data changes.

### 2. Query Cache
For resource-heavy database calls (e.g., fetching 10 joined tables for the Homepage):
- Eloquent query caching within the Repository layer.

### 3. Route Caching (Edge)
In the future, `Varnish` or `Cloudflare` CDN edge caching will sit in front of the API for read-only `GET` endpoints, respecting the `Cache-Control` headers sent by Laravel.
