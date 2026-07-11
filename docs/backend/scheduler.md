# Scheduler Architecture

The Laravel Task Scheduler replaces the need to manage individual cron jobs.

## Crontab Configuration
Only a single cron entry is required on the production server:
```bash
* * * * * cd /var/www/html && php artisan schedule:run >> /dev/null 2>&1
```

## Scheduled Tasks
Defined in `routes/console.php` or `App\Console\Kernel`:
1. **Sitemap Generation**: `dailyAt('02:00')` - Triggers the automated rebuilding of `sitemap.xml` cache.
2. **Telescope/Pulse Pruning**: `daily()` - Cleans up old debugging data.
3. **Temporary Media Cleanup**: `hourly()` - Deletes orphaned uploads in the temporary media directory.
4. **Database Backup**: `dailyAt('03:00')` - Generates a SQL dump and pushes it to an S3 bucket via Spatie Backup.
