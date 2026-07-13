
---
version: 1.0.0
status: Draft
last_updated: 2026-07-13
---

# Day-to-Day Operations

## Queue worker
`QUEUE_CONNECTION=database` — no jobs run automatically. Something must keep
`php artisan queue:work` running (Supervisor preferred; a once-a-minute
`queue:work --stop-when-empty` cron is the fallback on shared hosting without
root/SSH). See `DEPLOYMENT.md` Part A3. Jobs that flow through this queue:
`FlushAnalyticsBatchJob`, `TrackAnalyticsEventJob`, `EvaluateNodeJob`
(Automation), `DispatchNotificationJob`, `IndexSearchDocumentJob` /
`RebuildSearchIndexJob` / `RemoveSearchDocumentJob` (Search),
`CreateRedirectFromSlugJob` / `GenerateSitemapJob` / `IncrementRedirectHitJob`
/ `RunSeoAuditJob` (SEO).

If the worker stops, symptoms are: newly published content doesn't show up in
search, notifications never arrive, redirect hit counts stop incrementing.
Check `php artisan queue:failed` for a backlog of failed jobs first.

## Scheduler
`routes/console.php` currently defines no `Schedule::` entries — a
`schedule:run` cron entry is **not required** as of this version. If a
periodic task is added later, add it there and then add the cron line
documented in `DEPLOYMENT.md` Part A4.

## Cache
`CACHE_STORE=database`. After any deploy that changes `.env`, config files,
or routes, re-run:
```bash
php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan event:cache
```
If changes don't seem to take effect, stale cache is the first thing to
suspect — `php artisan optimize:clear` resets everything.

## Health checks
- `GET /api/v1/health/live` / `ready` / `startup` — public, safe for uptime
  monitors and load balancers.
- `GET /api/v1/health/details` — requires `auth:sanctum` + `verified`
  (fixed in Phase 10.6, was previously public). Returns PHP version, DB
  latency, disk space, cache/queue/search status. Use an admin bearer token
  to check it manually.
- Admin UI: `/admin/system-health` surfaces the same data with a dashboard.

## Search index
Per-record indexing (create/update/delete) is wired via
`SearchIndexListener`/`IndexSearchDocumentJob` and works automatically as
content changes. The admin "Rebuild Index" button
(`/admin/search`) is currently a no-op —
`AbstractSearchDriver::rebuild()` is an empty stub — so a full reindex is not
yet possible from the UI; this is a known gap, not an operational procedure
you can rely on today.

## Logs
- Laravel: `storage/logs/laravel.log` (`LOG_CHANNEL=stack`).
- Frontend: browser console + Next.js server console (no external log
  aggregation configured yet).
- Toast notifications surface user-facing errors in real time (see
  `lib/api/client.ts` interceptor); the log file is the source of truth for
  anything that happened server-side.

## Rate limits
`api` group: 120 req/min per user (or IP if unauthenticated).
`login` route specifically: 5 req/min per IP. Both registered in
`AppServiceProvider::boot()`.
