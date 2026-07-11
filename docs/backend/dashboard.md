# Dashboard Analytics & Widgets Architecture

The Admin Dashboard provides a high-level overview of system health and content metrics.

## API Endpoint
`GET /api/v1/dashboard/metrics`

## Metrics Payload
The backend will aggregate these statistics, utilizing Laravel's Cache to prevent expensive database counts on every page load:

### 1. Content Metrics
- **Visitors**: Pulled from integration with GA4/Clarity (or placeholder if not connected).
- **Projects**: Count of published portfolio projects.
- **Blogs**: Count of published blog posts.
- **Messages**: Count of new/unread CRM contacts.
- **Subscribers**: Count of active newsletter subscribers.
- **Users**: Count of active admin users.
- **Media Count**: Total files in Spatie MediaLibrary.

### 2. System Health Metrics
- **Storage Usage**: Total bytes used by the local/S3 disks.
- **Queue Status**: Pending jobs in the Redis queue.
- **Cache Status**: Cache hit/miss ratio (if driver supports) or basic driver status.
- **Failed Jobs**: Count from the `failed_jobs` table.
- **Last Backup**: Timestamp of the last successful DB/App backup.
- **Sitemap Status**: Timestamp of last successful XML generation.

### 3. Recent Activity Stream
A feed populated by `spatie/laravel-activitylog`, showing the 10 most recent actions (e.g., "User created post X").
