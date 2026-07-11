# Deployment Strategy

This project utilizes a split-deployment architecture.

## Frontend (Next.js)
- **Host**: Vercel
- **Build Command**: `npm run build`
- **Output**: `.next` optimized production build.
- **Environment**: Depends on standard `.env.production` pointing `NEXT_PUBLIC_API_URL` to the Laravel backend.

## Backend (Laravel 12)
- **Host**: AWS EC2, DigitalOcean Droplet, or Laravel Forge.
- **Web Server**: Nginx with PHP 8.3 FPM.
- **Process Manager**: Supervisor (for queue workers).
- **Zero-Downtime Deployment**: Handled via Laravel Envoyer or GitHub Actions using symlinked deployments.

### Deployment Script Steps
1. `git pull`
2. `composer install --optimize-autoloader --no-dev`
3. `php artisan migrate --force`
4. `php artisan optimize:clear`
5. `php artisan optimize`
6. `php artisan config:cache`
7. `php artisan route:cache`
8. `php artisan view:cache`
9. Restart PHP-FPM and Queue Workers.
