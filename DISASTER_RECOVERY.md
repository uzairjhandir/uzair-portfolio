
---
version: 1.0.0
status: Draft
last_updated: 2026-07-13
---

# Disaster Recovery

## Scenario: server/VPS is lost entirely
1. Provision a new VPS/hosting account; install WHM/cPanel + OpenLiteSpeed.
2. `git clone` the repository (GitHub is the source of truth for code —
   see `BACKUP.md` §1).
3. Restore the `.env` file from your password manager (see `BACKUP.md` §3)
   — this is the only piece of state not recoverable from git.
4. Restore the database from the most recent backup (see `BACKUP.md` §2)
   — or, if none exists / data loss is acceptable, run a fresh
   `php artisan migrate --force` + `db:seed --class=AdminSeeder` (see
   `DEPLOYMENT.md` Part A2, steps 6–7). Note: a fresh migrate starts with
   zero content — only do this if you don't have a real backup.
5. Follow `DEPLOYMENT.md` in full (Part A: backend, Part B: frontend,
   Part C: smoke test) to bring both halves back up.
6. Update DNS records (Cloudflare) to point to the new server's IP.
7. Re-verify: `health/live`, homepage renders, admin login works, sitemap
   contains real content, contact form doesn't 500 (`DEPLOYMENT.md` Part C).

## Scenario: database corruption / bad migration
1. Stop the queue worker first (`php artisan queue:work` restarted jobs
   against a half-migrated schema can compound the damage).
2. Restore the most recent database backup.
3. If no backup exists and only a specific migration is suspect, use
   `php artisan migrate:rollback --step=1` — but note this project's
   migrations were not exhaustively audited for down()-method correctness;
   verify the rollback actually works on a copy of the data first.
4. Re-run `queue:work`, confirm health checks pass.

## Scenario: accidental production data seeded from dev
The dev database used throughout this project's build phases contains
known test records (2 Blogs, 1 Portfolio, 1 Case Study, 1 Download, 1 User
— created during Phase 9.3 content verification). If this SQLite file is
ever accidentally copied to production instead of running a fresh
`migrate`, identify and delete those specific records rather than wiping
the whole database, since real production content may already coexist
with them by the time this is noticed.

## What this project does NOT yet have
- No automated off-site database backup job — `BACKUP.md` currently
  documents manual WHM backup configuration only. Set this up during
  Phase 11 before relying on it.
- No staging environment / blue-green deploy — deploys are direct-to-prod.
  Always run `npm run build` and `composer install --no-dev` locally (or
  in CI) before deploying to catch build breaks ahead of time.
