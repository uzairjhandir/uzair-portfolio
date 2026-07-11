# Authentication & Security Architecture

The backend utilizes **Laravel Sanctum** configured specifically for SPA (Single Page Application) Cookie-Based Authentication. This provides state-of-the-art security without exposing plain text JWTs to XSS vulnerabilities.

## 1. SPA Authentication Flow (Sanctum)
Because the Next.js frontend and Laravel backend will share a top-level domain (e.g. `uzair.dev` and `api.uzair.dev`), cookie-based authentication is the most secure method.

### The Flow
1. **CSRF Initialization**: 
   - Frontend `GET /sanctum/csrf-cookie`
   - Laravel sets an `XSRF-TOKEN` cookie on the browser.
2. **Login Request**:
   - Frontend `POST /api/v1/login` with `{ email, password, remember }`.
   - Laravel validates credentials. If successful, it regenerates the session to prevent fixation and sets a `laravel_session` HTTP-Only cookie.
3. **Protected API Requests**:
   - Frontend sends requests (e.g., `GET /api/v1/users`).
   - Axios/Fetch automatically attaches the `laravel_session` and `XSRF-TOKEN` cookies.
   - Laravel's `auth:sanctum` middleware validates the stateful session cookie.
4. **Logout**:
   - Frontend `POST /api/v1/logout`.
   - Laravel invalidates the session and deletes the cookies.

## 2. Advanced Security Features

### Password Management
- Standard Laravel password hashing (Argon2 / Bcrypt).
- `/api/v1/forgot-password` and `/api/v1/reset-password` API endpoints to email unguessable tokens to the user, handled via Next.js frontend forms.

### Session Management & Expiry
- `SESSION_LIFETIME=120` (2 hours of inactivity).
- If `remember_me` is checked, issues a long-lived remember cookie.
- Rate limiting configured globally via `Route::middleware('throttle:api')` (60 requests/min).

### Two-Factor Authentication (2FA) Readiness
- The user table will include `two_factor_secret` and `two_factor_recovery_codes`.
- Laravel Fortify can be installed underneath to handle the TOTP (Time-Based One-Time Password) generation without rendering views.
- If a user has 2FA enabled, the `/api/v1/login` endpoint will return a specific `2FA_REQUIRED` status code, prompting the React Admin to render the OTP entry field before finalizing the session.
