# Logging & Error Tracking Architecture

## 1. Application Logging
- **Channel**: `daily`
- **Path**: `storage/logs/laravel.log`
- Retains 14 days of logs to prevent disk bloat.

## 2. Admin Activity Logs (Audit Trail)
- Powered by `spatie/laravel-activitylog`.
- All CRUD actions performed by admins in the React Admin are recorded.
- Logs are exposed via `GET /api/v1/activity-logs` and displayed in the React Admin Dashboard.
- Automatically tracks `causer_id` (the Admin User) and records `old` vs `new` properties for debugging.

## 3. Exception Tracking
- **Sentry** or **Bugsnag** will be integrated to capture 500-level fatal errors.
- Ensures the development team is notified immediately when an API endpoint crashes, rather than discovering it via user reports.
