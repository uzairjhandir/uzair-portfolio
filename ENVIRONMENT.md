# Environment Variables Reference

Below is a complete list of environment variables used in the project. Never commit your `.env` or `.env.local` files to source control.

## Core Setup
- `NEXT_PUBLIC_SITE_URL`: The canonical URL of the website (e.g., `https://yourdomain.com`). Used for SEO metadata and JSON-LD schemas.

## Social & Contact Links
- `NEXT_PUBLIC_LINKEDIN_URL`: Your LinkedIn profile URL.
- `NEXT_PUBLIC_GITHUB_URL`: Your GitHub profile URL.
- `NEXT_PUBLIC_UPWORK_URL`: Your Upwork freelancer profile URL.
- `NEXT_PUBLIC_WHATSAPP`: Your WhatsApp number (e.g., `+1234567890`).
- `NEXT_PUBLIC_EMAIL`: Your primary contact email displayed on the site.

## Email / SMTP (Server-side only)
*These variables must not have the `NEXT_PUBLIC_` prefix to remain secure.*
- `SMTP_HOST`: The outgoing mail server (e.g., `mail.yourdomain.com`).
- `SMTP_PORT`: Port for SMTP (usually `465` for secure, `587` for TLS).
- `SMTP_SECURE`: `true` if using port 465, `false` for 587.
- `SMTP_USER`: The authenticated email address.
- `SMTP_PASS`: The password for the email address.
- `CONTACT_EMAIL`: The destination email where form submissions should be delivered (e.g., your personal Gmail).

## Analytics (Optional)
- `NEXT_PUBLIC_GA_ID`: Google Analytics 4 Measurement ID (e.g., `G-XXXXXXXXXX`).
- `NEXT_PUBLIC_CLARITY_ID`: Microsoft Clarity tracking ID.
- `NEXT_PUBLIC_META_PIXEL_ID`: Meta (Facebook) Pixel ID.

## Search Engine Verification (Optional)
- `GOOGLE_SITE_VERIFICATION`: Token for Google Search Console.
- `BING_SITE_VERIFICATION`: Token for Bing Webmaster Tools.
