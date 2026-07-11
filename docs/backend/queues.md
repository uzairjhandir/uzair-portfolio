# Queue Architecture

To ensure instantaneous API response times for the frontend, all heavy backend operations are offloaded to background queues.

## Queue Connection
- **Driver**: Redis (Production) / Database (Local/Staging)

## Configured Queues
1. **`default`**: Standard jobs (Email sending, notifications).
2. **`media`**: Image processing, WebP conversion, Responsive Image generation (CPU intensive).
3. **`exports`**: CSV/Excel generation for the React Admin bulk actions.

## Worker Configuration (Supervisor)
Supervisor will run on the production server to ensure the queue workers never die.
```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/html/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=4
```
