# Redirect Manager Architecture

Enterprise CMS platforms must handle URL changes gracefully to preserve SEO ranking. The Redirect module captures and routes traffic automatically.

## Database Schema (`redirects` table)
- `id`
- `old_url` (string, unique, indexed)
- `new_url` (string, nullable for 410)
- `type` (enum: 301, 302, 307, 410)
- `hit_count` (integer, default 0)
- `last_accessed_at` (timestamp)
- `active` (boolean)
- `timestamps`

## Interception Strategy

### Backend Middleware (Laravel)
Laravel will implement a global middleware `CheckRedirects`.
1. Intercept `404 Not Found` requests.
2. Check `old_url` against the requested path.
3. If a match is found and is active, return the specified HTTP redirect (301 or 302).
4. Increment `hit_count` (can be queued to prevent DB locking on high traffic).

### Frontend Middleware (Next.js)
Alternatively, for pure headless speed, the Next.js `middleware.ts` can fetch and cache the active redirects list from Laravel and perform edge-level redirects before the request even hits the frontend rendering engine.
