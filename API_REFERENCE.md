
---
version: 1.0.0
status: Draft
last_updated: 2026-07-13
---

# API Reference

## OpenAPI docs: not currently available
`config/scramble.php` exists (configured for `api_path: api/v1`), but the
`dedoc/scramble` package itself is **not** in `composer.json`/`composer.lock`
— it was never actually installed. There is no working `/docs` endpoint.
Either run `composer require dedoc/scramble` to activate it, or remove the
dead config file — deferred, not part of this audit's scope.

## Base URL
- Dev: `http://localhost:8000/api/v1`
- Prod: `{APP_URL}/api/v1` (see `DEPLOYMENT.md`)

## Auth
Laravel Sanctum, SPA-style cookie auth for the admin frontend. Login:
`POST /auth/login` (rate-limited to 5/min/IP). Most `/admin/*`-equivalent
routes require `auth:sanctum`.

## Public (unauthenticated) routes
Prefixed `/public/*` — added in Phase 9 specifically because every
content-module route was originally behind `auth:sanctum`, which meant the
public site could never read published content. Covers published-only
Blog, Portfolio, Case Studies, Downloads listings/details.

## Health routes
- `GET /health/live`, `/health/ready`, `/health/startup` — public, for
  uptime monitors / load balancers.
- `GET /health/details` — requires `auth:sanctum`+`verified` (Phase 10.6;
  was public before, leaked internal infra info).
- `GET /up` — Laravel's built-in framework health check (outside the
  `/api/v1` prefix).

## Modules (see `routes/api.php` for the authoritative, current list)
Auth, Users, Roles/Permissions, Blog, Portfolio, Case Studies, Downloads,
Media, Homepage Builder / Pages, Navigation, Redirects/URL Rewrites, CRM,
Newsletter, Automation, Notifications, Search, Settings, System Health,
SEO, Analytics.

## Rate limits
- `api` group: 120 req/min, keyed by user ID (or IP if unauthenticated).
- `login`: 5 req/min per IP.
Both return `429 Too Many Requests` with standard `Retry-After` semantics
when exceeded (registered in `AppServiceProvider::boot()`).

## Response shape
Standard envelope used across the app: `{ success, message, data/errors, meta }`.
Validation failures: `422` with `errors` populated per-field. Domain-level
illegal state transitions (e.g. publishing a draft missing required
fields): also `422` (via the `DomainException` handler in
`bootstrap/app.php`), not `500`.

## Until Scramble is wired up
`routes/api.php` is the source of truth for the full route list. Postman/
Insomnia collections are not currently maintained in this repo.
