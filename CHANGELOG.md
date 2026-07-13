# Changelog

All notable changes to this project will be documented in this file.

## Enterprise DXP Rebuild (Phases 1–10, in progress)

The sections below this point document the Laravel + Next.js enterprise
admin/CMS rebuild — a different, later effort than the static-site
entries under `[1.0.0] - 2026-07-09` below. See `RELEASE_NOTES_v1.0.md`
for the full v1.0.0 status snapshot.

### Phase 10.6 — Final Production Audit (Release Candidate)
**Commit:** (pending)

Read-only audit per user's 5-section checklist; one critical fix made under the phase's own escape clause ("no code unless critical").

- **Fixed:** `GET /api/v1/health/details` was publicly reachable with no auth — leaks PHP version, DB latency, disk paths, queue backlog, SEO scores. The route already had a `// Should be protected in prod` comment that was never acted on. Moved it behind `auth:sanctum`+`verified`; `live`/`ready`/`startup` stay public (load-balancer probes, no sensitive data).
- **Found, not fixed (deferred to user):** `PageResource.php` calls `env('APP_FRONTEND_URL')` directly (anti-pattern — breaks after `config:cache`), and the var is unset in `.env` — `preview_url` has been incomplete this whole project.
- **Found, not fixed:** no `Schedule::` entries anywhere in `routes/console.php` — nothing is actually scheduled.
- **Deleted** (user-approved via AskUserQuestion): `backend/test_login.php` (hardcoded admin credentials, bypasses HTTP) and `backend/check_tables.php` (dumps full DB schema) — both untracked by git but present on disk at the Laravel project root, a real risk under a WHM/cPanel document-root misconfiguration.
- Verified: 0 pending migrations, `.env`/`.env.local` correctly gitignored, no other stray root-level PHP files, no TODO/FIXME in routes, config/route/view/event cache all succeed cleanly.
- Dev DB confirmed to contain only the Phase 9.3 verification records (2 Blogs, 1 Portfolio, 1 Case Study, 1 Download, 1 User) — flagged as must-not-ship-to-production, not deleted (still serves as verification proof).
- Documentation audit: README/INSTALL/DEPLOYMENT/OPERATIONS/SECURITY/BACKUP/DISASTER_RECOVERY/TROUBLESHOOTING/API_REFERENCE/CHANGELOG/VERSION all exist. DEPLOYMENT.md/BACKUP.md have real content but only cover the Next.js frontend, not the Laravel backend. OPERATIONS/SECURITY/DISASTER_RECOVERY/TROUBLESHOOTING/API_REFERENCE/INSTALL are 1-line stubs despite frontmatter claiming `status: Frozen (Production Ready)`.
- **Browser QA / Lighthouse: still not performed** — no browser automation tool exists in this environment; every verification in Phases 10.3–10.6 has been build/lint/typecheck/curl-level only.

### Phase 10.5 — Performance, Accessibility, SEO & Security Hardening
**Commit:** `310bad0f`

- Converted `Hero3DLaptop` (three.js/@react-three) and Dashboard's `recharts` chart to `next/dynamic`; lazy-loaded the globally-mounted `CommandPalette`.
- `next.config.ts` did not exist at all — added it (image `remotePatterns` + security headers in one file).
- `sitemap.ts` was 100% static (3 hardcoded URLs); rewired to fetch real published content slugs, verified end-to-end against a live backend. `robots.ts` had no disallow list — `/admin` and `/api` were crawlable.
- Added `aria-label` to 8 icon-only buttons and 4 search inputs with no accessible name; added a skip-to-main-content link (none existed).
- No `RateLimiter` was registered anywhere — added a default 120/min API limiter and a 5/min login limiter, verified the 6th rapid login attempt returns 429.
- Verified already-correct: Radix Dialog focus trap, `SecurityHeaders` middleware, upload validation, OpenGraph/Twitter/JSON-LD on all public detail pages.
- Flagged for Phase 11: CORS hardcoded to `localhost:3000` only.

### Phase 10.4 — Loading/Empty/Error State Consistency
**Commit:** `286b73a4`

- `useGenericCrud()` already exposed `isError`/`error`; `CrudFactory`/`DataTable` never read them, so a failed list request silently rendered as "No results found." instead of an error. Fixed once at the shared-component level (benefits Navigation/Pages/Redirects/Roles/Users/Settings automatically).
- Same gap independently fixed in 7 bespoke list pages (Blog/Portfolio/Case Studies/Downloads/CRM/Notifications/Automation) that use `DataTable` directly.
- Replaced ad-hoc `<p className="text-red-500">` error text (Settings/Search/System Health/Homepage Settings) with the shared `ErrorState` + retry.
- Added `PermissionDenied` gating to `CrudFactory`.
- Fixed the identical isError gap on the public `BlogListClient.tsx`.

### Phase 10.3 — Error Boundaries & Runtime Recovery
**Commit:** `b1e75ad4`

- Added `app/error.tsx` (Public Error Boundary) and `app/global-error.tsx` (Root Error Boundary, self-contained) — previously only the admin section had error boundaries.
- Added `app/loading.tsx` for the public site.
- Added `PermissionDenied` to the shared admin state-component design system.
- Hardened `lib/api/client.ts`: explicit 30s timeout, global toast handling for network/timeout/403/429/500 (left 404/409/422 to callers, which already handle them meaningfully).
- Fixed React Query retry logic: only retries network/5xx errors, never 4xx client errors. Added explicit `gcTime`, disabled mutation retries.

### Phase 10.2 — Regression Audit
**Commit:** `3fcf0cce`

Full curl-based sweep across all 21 modules surfaced 3 real, pre-existing bugs:
- `GET /roles` 500 — `App\Models\Role` never defined the `permissions()` relation despite the controller eager-loading it.
- `POST /{content}/publish` and `/unpublish` 500 for every content type — `SeoRoutingListener` read `$event->model` instead of `$event->content`.
- Legitimate state-machine rejections (e.g. draft → published) crashed as 500 instead of 422 — no exception handling was configured at all.

### Phase 10.1 — ESLint / Type Safety / Dead Code
**Commit:** `42f96e7e`

- Full frontend lint pass: 36 errors → 0, all warnings → 0.
- Found and fixed a real `rules-of-hooks` violation in `Sidebar.tsx` (hook called after conditional early returns).
- Removed two dead files: a root-level scratch file and an orphaned `MediaPicker.tsx` containing hardcoded mock data.
- Added `lib/utils.ts:getErrorMessage()` to replace ~10 duplicated error-toast blocks.

### Phase 9.3/9.4 — Enterprise Content Verification + Settings Completion
**Commit:** `2462819d`

Created and published real Blog/Portfolio/Case Study/Download records and traced each through Database → API → public listing → detail → Search → SEO end-to-end. Found:
- `PageService.php` had `this->` instead of `$this->` — broke every page publish/update.
- `DownloadPolicy` was never registered in `AuthServiceProvider` — every download serve request was denied.
- `usePageRenderQuery` misread the JsonResource envelope — Homepage Builder blocks silently never rendered.
- `SearchIndexListener` never listened for `ContentCreated` — content published in one step (not draft→publish) was never indexed.
- `Portfolio`/`CaseStudy` models never implemented `SearchableResource` — never searchable despite Blog/Download working.
- Homepage "Blog Highlights" was 100% hardcoded fake data.
- Added an "API Keys" Settings category (OpenAI/Gemini/Claude/Maps/Cloudflare/reCAPTCHA).

### Phase 9.2 — Enterprise Admin Audit
**Commit:** `058181f7`

- Wired `RedirectController`/`UrlRewriteController` routes (fully built, never registered).
- Rebuilt `/admin/settings` — the old page used a generic CrudFactory incompatible with the real category-based Settings API.
- Fixed `DefaultSettingsSeeder` double-JSON-encoding every seeded value, and `SettingService::get()` bypassing the model's decode/decrypt accessor.
- Fixed `HealthCheckInterface` missing import (broke every System Health check) and `HealthEndpointController` calling a nonexistent method.
- Removed 3 admin pages that hit nonexistent backend routes (Footer/Contact/Activity Logs).
- Added `/admin/search` (index health/rebuild/flush) and real `/admin/system-health` data (was 100% hardcoded mock).

### Phase 9 — Public Dynamic Rendering
**Commit:** `984a8943`

- Discovered every content-module GET route was behind `auth:sanctum` — the public site could never read published content. Added additive `/public/*` routes, published-only, existing authed routes untouched.
- Built the Homepage Block Renderer (Page Builder → real sections) with graceful fallback to static sections.
- Fixed SQLite incompatibility in the search driver (MySQL-only FULLTEXT syntax).
- Fixed LiveChat config hook reading the wrong nesting level.

### Phases 1–8 — Core Build
Dashboard, Homepage Builder, Media Library, Blog/Portfolio/Case Studies/Downloads Admin CRUD, CRM, Newsletter, Automation, Notifications. See individual phase commits for detail.

---

## [1.0.0] - 2026-07-09

### Added
- **Premium Personal Intro:** Comprehensive "About Me" section featuring floating glassmorphism cards, expertise grid, and professional storytelling.
- **Nodemailer API Integration:** Fully functional server-side `/api/contact` route handling form submissions, email dispatch, and auto-replies.
- **Trust Badges:** Added dynamic trust metrics (Experience, Projects, Clients) to the Contact section.
- **Legal Pages:** High-end `/privacy` and `/terms` pages with customized SEO metadata and JSON-LD schema support.
- **Visual Identity:** Custom MU monogram and typography-based logo component.
- **Animations:** Extensive use of `framer-motion` for scroll reveals, hover states, and dynamic page transitions.
- **Documentation:** Added comprehensive guides for Deployment, Server Setup, SMTP configuration, and Environments.

### Changed
- Refactored `Contact.tsx` UI to include advanced interactive form fields (Dropdowns, Company, Timeline).
- Replaced dummy text with polished professional copywriting targeted at high-ticket clients.
- Improved overall easing functions to `ease: [0.22, 1, 0.36, 1]` for all Framer Motion components.
- Upgraded Next.js dynamic routing to correctly `await params` per Next.js 15 standards.

### Fixed
- ESLint and React hooks purity warnings.
- Hydration mismatch issues by extracting client logic to appropriate `useEffect` hooks.
- Layout shifts and z-index overlapping issues in the Navigation and Footer components.
