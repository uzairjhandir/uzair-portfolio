# Uzair Portfolio DXP — Release Notes (v1.0.0, in progress)

## Overview
This document tracks the actual, verified state of the Laravel + Next.js enterprise admin/CMS rebuild toward a v1.0.0 release. It supersedes the earlier draft of this file, which described infrastructure (Meilisearch, S3, Horizon, MySQL 8, Next.js 14) that was never actually wired up in this codebase — see "Actual Architecture" below for what's real.

**Status: NOT YET RELEASED.** Phase 10 (stabilization) is in progress; Phase 11 (production deployment) has not started.

## Actual Architecture (verified, not aspirational)
- **Backend:** Laravel 12.63, PHP 8.2/8.5, SQLite (dev) — no MySQL/Redis/Meilisearch/Horizon configured yet
- **Frontend:** Next.js 16.2.10 (App Router, Turbopack), React 19, Tailwind CSS
- **Data Layer:** TanStack React Query v5, Axios (`lib/api/client.ts`)
- **Search:** Custom `DatabaseSearchDriver` (LIKE-based on SQLite, FULLTEXT on MySQL) — not Meilisearch/Scout
- **Queue:** Database queue driver — not Horizon (Horizon setup is a Phase 11 deployment task)

## Phase Status

| Phase | Status |
|---|---|
| Phase 1–8 (Core build: Dashboard, Homepage Builder, Media, Blog, Portfolio, Case Studies, Downloads, CRM, Newsletter, Automation, Notifications) | ✅ Complete |
| Phase 9 (Public Dynamic Rendering) | ✅ Complete |
| Phase 9.2 (Enterprise Admin Audit) | ✅ Complete |
| Phase 9.3/9.4 (Content Verification + Settings) | ✅ Complete |
| Phase 10.1 (ESLint / Type Safety / Dead Code) | ✅ Complete |
| Phase 10.2 (Regression Audit) | ✅ Complete |
| Phase 10.3 (Error Boundaries) | ✅ Complete |
| Phase 10.4 (Loading/Empty/Error Consistency) | ✅ Complete |
| Phase 10.5 (Performance/Accessibility/SEO/Security Hardening) | ✅ Complete |
| Phase 10.6 (Final Production Audit) | ✅ Complete |
| Phase 11 (WHM/cPanel + OpenLiteSpeed Deployment) | ⏳ Pending |

See `CHANGELOG.md` for per-phase detail and commit hashes.

## Verification Status (as of Phase 10.6)
- Build: ✅ PASS
- Lint: ✅ PASS (0 errors, 0 warnings)
- Typecheck: ✅ PASS
- Backend regression sweep (21 modules, curl-based): ✅ PASS
- Security headers, rate limiting, sitemap/robots: ✅ PASS (curl-verified against a live backend)
- Pending migrations: 0 (verified via `migrate:status`)
- Documentation: all 11 required files present (README/INSTALL/DEPLOYMENT/OPERATIONS/SECURITY/BACKUP/DISASTER_RECOVERY/TROUBLESHOOTING/API_REFERENCE/CHANGELOG/VERSION); several are stubs — see Known Issues.
- **Browser QA: ❌ NOT VERIFIED** — no browser automation tool available in this environment; all verification has been build/lint/typecheck/curl-level, never an actual rendered browser session. Do not treat this as browser-tested. No Lighthouse run has been performed for the same reason.

## Known Issues (as of Phase 10.6)
- Search "Rebuild Index" admin button is a no-op — `AbstractSearchDriver::rebuild()` is an empty stub. Per-record indexing (create/update/delete) works correctly.
- Seeded Super Admin role has `uuid: null` (AdminSeeder uses Spatie's Role model directly, bypassing `App\Models\Role`'s UUID generation).
- Navigation/Pages/Redirects admin pages are minimal stub forms (ID + Title only), not full per-module field editors.
- Homepage Builder page doesn't distinguish a failed initial load from "no home page found."
- CORS is hardcoded to `http://localhost:3000` only — must be updated with the real production domain during Phase 11.
- ~9 admin-only/table-thumbnail `<img>` usages and `Testimonials.tsx` (hardcoded fake data) not converted to `next/image` — deprioritized below the public-facing, real-content images.
- `PageResource::preview_url` reads `env('APP_FRONTEND_URL')` directly (bypasses config cache) and the var is unset in `.env` — preview links have been incomplete this whole project. Not fixed (out of Phase 10.6 scope; needs a config-file-backed env var and a value).
- `routes/console.php` defines no `Schedule::` entries — nothing is actually scheduled. Decide before v1.0 whether anything (e.g. queue cleanup, expired-token pruning) needs one.
- Dev database contains 5 real content records + 1 user from Phase 9.3 verification work — **must not be copied to production**; production needs a fresh `migrate` + guarded `AdminSeeder` run only.
- DEPLOYMENT.md / BACKUP.md cover only the Next.js frontend deployment (PM2/cPanel Node app) — no Laravel backend deployment steps (PHP-FPM, composer install, queue worker, artisan cache commands). Needed before Phase 11.
- OPERATIONS.md, SECURITY.md, DISASTER_RECOVERY.md, TROUBLESHOOTING.md, API_REFERENCE.md, INSTALL.md are single-line placeholder stubs, despite frontmatter claiming `status: Frozen (Production Ready)` — not actually production-ready documentation.

## Phase 10.6 Security Fix
- `GET /api/v1/health/details` was publicly accessible with no authentication, leaking PHP version, DB latency, disk paths, queue backlog, and SEO health scores. The route had a pre-existing `// Should be protected in prod` comment that was never acted on. Fixed by moving it behind `auth:sanctum`+`verified`; `live`/`ready`/`startup` remain public (needed for load-balancer/uptime probes, and expose no sensitive data).

## Deployment
Not yet documented for this codebase's actual stack (SQLite dev / no queue worker manager / no Meilisearch). Phase 11 will produce a real WHM/cPanel + OpenLiteSpeed deployment runbook against the actual architecture above — the deployment steps in earlier drafts of this file (referencing Horizon, MySQL 8, S3) should not be used until Phase 11 replaces them with verified steps.

## Security note
`database/seeders/AdminSeeder.php` no longer seeds a fixed admin/password pair in production — it requires an explicit `ADMIN_SEED_PASSWORD` env var, or is skipped entirely when `APP_ENV=production`.
