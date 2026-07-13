
---
version: 1.0.0
status: Draft
last_updated: 2026-07-13
---

# Installation Guide (Local Development)

## Requirements
- PHP 8.2+ with `openssl`, `pdo_sqlite` (or `pdo_mysql`), `mbstring`, `bcmath`, `fileinfo`
- Composer 2.x
- Node.js 18.x or 20.x + npm
- SQLite (default) or MySQL 8

## Backend (`/backend`)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite   # if using the default SQLite connection
php artisan migrate
php artisan db:seed --class=AdminSeeder   # ADMIN_SEED_EMAIL/PASSWORD in .env, or defaults are used outside production
php artisan storage:link
php artisan serve   # http://localhost:8000
```

## Frontend (`/frontend`)
```bash
cd frontend
npm install
cp .env.local.example .env.local   # if present; otherwise create .env.local manually with NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev   # http://localhost:3000 (Turbopack)
```

## Verifying the install
- `curl http://localhost:8000/api/v1/health/live` → `{"status":"ok"}`
- `http://localhost:3000` renders the public site.
- `http://localhost:3000/admin` login screen appears; log in with the AdminSeeder credentials.

See `DEPLOYMENT.md` for production setup (WHM/cPanel/OpenLiteSpeed) and `.env.example` for the two app-specific env vars (`APP_FRONTEND_URL`, `ADMIN_SEED_EMAIL`/`ADMIN_SEED_PASSWORD`) that aren't part of stock Laravel.
