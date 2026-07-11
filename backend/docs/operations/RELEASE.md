# Release Operations

Releasing code to production is fully orchestrated by the backend via the `php artisan release:go-live` command.

## The Pipeline
1. Run PHPUnit tests.
2. Run Static Analysis (PHPStan).
3. Run Code Style Checks (Laravel Pint).
4. Auto-generate OpenAPI spec via Scramble.
5. Generate language SDKs.
6. Run `production:audit` to verify environment security.
7. Execute Zero-Downtime Deployment hooks (Migrate -> Clear Cache -> Warm Cache).
8. Run Smoke Tests.
9. Generate the Final Release Report.
