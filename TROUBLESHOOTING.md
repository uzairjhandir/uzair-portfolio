
---
version: 1.0.0
status: Draft
last_updated: 2026-07-13
---

# Troubleshooting

## "Config changes / env changes aren't taking effect"
Almost always stale cache. `env()` calls outside `config/*.php` files stop
working entirely after `php artisan config:cache` — this bit this project
twice (`PageResource.php`, `MediaResource.php`, both fixed to read via
`config()` in Phase 11 prep). If you add a new env var, make sure something
in `config/*.php` reads it, then run
`php artisan config:clear && php artisan config:cache`.

## "New content doesn't show up in search"
The queue worker is probably not running. `QUEUE_CONNECTION=database`
means nothing processes jobs unless `php artisan queue:work` (or a cron
fallback) is active. Check `php artisan queue:failed` for a backlog.

## "Preview link / uploaded media URL is wrong (localhost in production)"
Check `APP_FRONTEND_URL` (preview links, `config('app.frontend_url')`) and
`APP_URL` (media URLs, `config('app.url')`) in the server's `.env` — both
must be the real production domains, not the local defaults shipped in
`.env.example`.

## "Login / API calls fail with CORS errors in the browser"
`config/cors.php` → `allowed_origins` is hardcoded to
`http://localhost:3000` as of this version. It must be updated to the real
frontend domain before production traffic will work at all — see
`DEPLOYMENT.md` Part A2 step 10.

## "GET /api/v1/health/details returns 401"
Expected — this endpoint was locked down in Phase 10.6 (was previously
public). Use a valid Sanctum bearer token from an authenticated admin
session. `/health/live`, `/ready`, `/startup` remain public/unauthenticated
by design.

## "Roles page / permissions 500 error"
This was a real bug found and fixed in Phase 10.2 (`Role` model was
missing its `permissions()` relation). If it recurs, check that migration
history matches — this class of bug reappears if a stale build is deployed
over a newer one.

## "Publish/unpublish returns 500 instead of a validation error"
Also fixed in Phase 10.2/10.3 — illegal state transitions
(e.g. draft → published when a required field is missing) now return 422
via the `DomainException` handler in `bootstrap/app.php`. A raw 500 here
means that exception handler isn't registered — check `bootstrap/app.php`
wasn't reverted.

## "Rebuild Index button in admin does nothing"
Known, not a bug you can fix by retrying —
`AbstractSearchDriver::rebuild()` is an intentional stub (documented in
`RELEASE_NOTES_v1.0.md` Known Issues). Per-record indexing on
create/update/delete works normally; only a full manual reindex is
unavailable.

## Where to look next
- Laravel errors: `storage/logs/laravel.log`.
- Frontend errors: browser console (toast notifications are user-facing
  summaries, not the full stack trace).
- `CHANGELOG.md` for what changed and when, if a regression appeared after
  a specific phase/commit.
