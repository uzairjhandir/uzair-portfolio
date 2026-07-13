
---
version: 1.0.0
status: Draft
last_updated: 2026-07-13
---

# Security Policies

## Application-level (verified in this repo)
- Rate limiting: 120 req/min general API (`RateLimiter::for('api', ...)`),
  5 req/min on `/auth/login` specifically — both in
  `app/Providers/AppServiceProvider.php`.
- Security headers (frontend, `next.config.ts` `headers()`): CSP,
  `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `Strict-Transport-Security` on all routes.
- `robots.ts` disallows `/admin` and `/api` from crawling/indexing.
- `AdminSeeder` refuses to run in production without an explicit
  `ADMIN_SEED_PASSWORD` — no fixed default credentials ship to prod.
- `GET /api/v1/health/details` requires `auth:sanctum`+`verified` (fixed
  Phase 10.6 — was previously public and leaked PHP version, DB latency,
  disk paths, queue backlog). `live`/`ready`/`startup` remain public by
  design for load-balancer probes.
- `.env` / `.env.local` are gitignored and were verified not tracked by git.
- CSRF/session: Sanctum SPA auth, `SESSION_ENCRYPT` configurable.

## Known gaps (not yet closed — track before/shortly after v1.0)
- `config/cors.php` `allowed_origins` is hardcoded to `http://localhost:3000`
  — **must** be updated to the real production domain before go-live, or
  the frontend cannot authenticate against the API at all.
- No WAF/Fail2Ban/CSF/ModSecurity configuration is part of this repo — those
  are server-level (WHM) controls to be configured during Phase 11, not
  application code.
- No dependency vulnerability scanning (`composer audit` / `npm audit`) is
  wired into CI — run manually before release.
- No centralized secret manager — production secrets live only in the
  server's `.env` file; back it up via a password manager (see
  `BACKUP.md`), never commit it.

## Server-level (to configure during Phase 11, WHM/cPanel)
- Enable **Fail2Ban** or **CSF** (ConfigServer Security & Firewall) for
  brute-force protection at the network level, complementing the app-level
  login rate limiter.
- Enable **ModSecurity** with the OWASP core rule set if available on the
  hosting plan.
- Force HTTPS (Cloudflare Full Strict + HSTS header, both already
  configured at the app level — see `next.config.ts`).
- Ensure the web document root points at `backend/public` and the Next.js
  app's own build output, never at either project's repository root (see
  `DEPLOYMENT.md` A2 step 1 for why this matters).

## Reporting
No formal vulnerability disclosure process exists yet for this project —
add one (e.g. a `SECURITY.md` contact email) before any public release
beyond a personal portfolio context.
