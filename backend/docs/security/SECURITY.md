# Security Hardening & Policies

## Production Security Measures
* **APP_DEBUG**: Must always be `false`. Enforced by `production:audit`.
* **Security Headers**: Injected automatically by `SecurityHeaders` middleware. Includes CSP, HSTS, and Permissions-Policy.
* **Database**: Ensure strict least-privilege users. Do not use the `root` user in `.env`.
* **Rate Limiting**: Critical endpoints (`/api/v1/auth/login`) are rate-limited heavily.
