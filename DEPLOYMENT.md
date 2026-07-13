# Deployment Guide (cPanel / WHM)

This guide covers deploying both halves of this app to a cPanel/WHM environment (OpenLiteSpeed): the Laravel API (Part A) and the Next.js frontend (Part B, unchanged from the original draft below).

## Part A: Laravel Backend

### A1. Requirements
- PHP 8.2+ (project targets `^8.2`, tested on 8.2/8.5) with extensions: `openssl`, `pdo`, `mbstring`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`, `fileinfo`, `pdo_mysql` (or `pdo_sqlite` if staying on SQLite).
- Composer 2.x.
- A database: SQLite is what dev/this audit ran against; MySQL 8 is the intended production target (the search driver has a MySQL FULLTEXT path already, see `DatabaseSearchDriver`).

### A2. Deploy steps
1. In cPanel, use **Setup PHP App** (or **MultiPHP Manager**) to create the app pointed at an **Application Root outside `public_html`** — e.g. `/home/username/backend`. Set the **document root to `backend/public`**, never the project root. (A prior audit of this repo found two debug scripts — since deleted — sitting at the project root; if the document root is ever misconfigured to point there instead of `public/`, anything at the root becomes web-reachable.)
2. Upload the codebase (excluding `vendor/`, `node_modules/`, `storage/framework/cache/*`) or `git clone` it directly on the server.
3. `composer install --no-dev --optimize-autoloader`
4. Copy `.env.example` to `.env` and fill in real values — see the "App-specific" section at the bottom of `.env.example` for the two vars that are NOT part of stock Laravel (`APP_FRONTEND_URL`, `ADMIN_SEED_EMAIL`/`ADMIN_SEED_PASSWORD`). Required for production: `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL` (this API's own domain), `APP_FRONTEND_URL` (the Next.js site's domain), real `DB_*`, `SESSION_DOMAIN` (your apex domain, for cookie-based Sanctum auth to work across subdomains if API and frontend are on different subdomains).
5. `php artisan key:generate` (only if `APP_KEY` is empty).
6. `php artisan migrate --force` (fresh DB — do **not** copy the dev SQLite file, it contains test content from this project's verification phases).
7. `php artisan db:seed --class=AdminSeeder` — requires `ADMIN_SEED_PASSWORD` to be set when `APP_ENV=production`; the seeder intentionally refuses to run without it.
8. `php artisan storage:link`
9. `php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan event:cache`
10. Update `config/cors.php` → `allowed_origins` from `http://localhost:3000` to the real production frontend domain (currently hardcoded to localhost — this is a known pre-production blocker, not yet done).

### A3. Queue worker
`QUEUE_CONNECTION=database` — jobs (search indexing, notifications, analytics batching, SEO audits, redirects) are **not** processed automatically; something must run `php artisan queue:work` continuously. No Horizon is installed. Options, in order of preference for a shared/VPS cPanel box:
- **Supervisor** (if you have root/SSH): a program block running `php artisan queue:work --sleep=3 --tries=3 --max-time=3600`, auto-restarting.
- **cPanel "Setup Node.js App"-style long-running process isn't applicable to PHP** — use cPanel's **Cron Jobs** as a fallback poor-man's-worker: `* * * * * php /path/to/backend/artisan queue:work --stop-when-empty >> /dev/null 2>&1`, which drains the queue once a minute (not real-time, but works without SSH/root).

### A4. Scheduler
`routes/console.php` currently defines no `Schedule::` entries (only the Laravel default `inspire` command) — **no cron entry for `schedule:run` is required until something is actually scheduled.** If a periodic task is added later (e.g. auto-expiring content via the currently-unused `ContentExpired` event, queue table cleanup, log rotation beyond what the OS does), add it to `routes/console.php` and then add the one cron line:
```
* * * * * php /path/to/backend/artisan schedule:run >> /dev/null 2>&1
```

### A5. Post-deploy smoke test
```
curl https://api.yourdomain.com/api/v1/health/live
curl https://api.yourdomain.com/up
```
`health/details` now requires auth (fixed in Phase 10.6) — test it with a real bearer token, not anonymously.

## Part B: Next.js Frontend

### B1. Preparation
1. Ensure all environment variables are correctly set in your production `.env` file.
2. Build the application locally to verify there are no errors:
   ```bash
   npm run build
   ```

### B2. Server Configuration
Since Next.js requires Node.js, your cPanel environment must support running Node.js applications. This is typically done via **Phusion Passenger** (Setup Node.js App in cPanel) or by using **PM2** via SSH.

### Option A: Using cPanel "Setup Node.js App"
1. Log into cPanel.
2. Go to **Setup Node.js App** (under the Software section).
3. Click **Create Application**.
   - **Node.js Version:** Select 18.x or 20.x (ensure it matches Next.js requirements).
   - **Application Mode:** Production.
   - **Application Root:** `/home/username/portfolio` (Create this outside `public_html` for security).
   - **Application URL:** `yourdomain.com`
   - **Application Startup File:** `server.js` (You need to create a custom server.js for Next.js, or use `npm start`).
4. Upload your files (excluding `node_modules` and `.next`) to the Application Root via File Manager or FTP.
5. Click **Run NPM Install** in the cPanel Node.js App UI.
6. SSH into the server and run `npm run build` in the Application Root.
7. Restart the Node.js application from the cPanel interface.

### Option B: Using PM2 via SSH (Recommended for Advanced Users)
1. SSH into your server:
   ```bash
   ssh username@yourserver.com
   ```
2. Navigate to your intended directory (e.g., `~/portfolio`).
3. Clone or upload your repository.
4. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```
5. Start the application with PM2:
   ```bash
   pm2 start npm --name "uzair-portfolio" -- start
   pm2 save
   pm2 startup
   ```
6. Set up a Reverse Proxy in cPanel/OpenLiteSpeed to route traffic from port 80/443 to the Node.js port (usually 3000).

### B3. Cloudflare Configuration
1. Point your domain's Nameservers to Cloudflare.
2. Under **DNS**, ensure the A record points to your VPS IP (Proxied = Orange Cloud).
3. Under **SSL/TLS**, set encryption mode to **Full (Strict)**.
4. Under **Speed > Optimization**, enable Brotli compression.
5. Under **Caching**, purge cache after deployment.

## Part C: Full smoke test (both halves running)
1. `curl https://api.yourdomain.com/api/v1/health/live` → `200`
2. Visit `https://yourdomain.com` → homepage renders with real content (not empty/error state).
3. Visit `https://yourdomain.com/sitemap.xml` → contains real blog/portfolio/case-study/download slugs, not just the 3 static URLs.
4. Log into `https://yourdomain.com/admin` with the seeded admin account, confirm dashboard loads.
5. Submit the public contact form once, confirm it doesn't 500 and (if mail is configured) an email arrives.
