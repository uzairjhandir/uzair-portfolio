# Server Setup Guide

This guide details the recommended configuration for the VPS/Dedicated server running WHM/cPanel and OpenLiteSpeed.

## 1. Base Environment
- **OS:** AlmaLinux 8/9 or Ubuntu LTS.
- **Panel:** WHM / cPanel.
- **Web Server:** OpenLiteSpeed (OLS).

## 2. OpenLiteSpeed Configuration
1. Navigate to WHM > **Plugins** > **LiteSpeed Web Server**.
2. Ensure you have the latest stable version of OpenLiteSpeed installed.
3. Configure the LSAPI cache for optimal performance (though Next.js handles its own caching via Turbopack/App Router, OLS cache helps with static assets).

## 3. Node.js Availability
Ensure Node.js is globally available. If using EasyApache 4, install the `ea-nodejs` packages or install nvm globally.
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
nvm install 20
nvm use 20
```

## 4. SSL Certificates
If you are strictly using Cloudflare, Cloudflare provides Edge certificates. However, for "Full (Strict)" mode, you must have a valid SSL on your origin server.
1. Go to cPanel > **SSL/TLS Status**.
2. Run AutoSSL to generate free Let's Encrypt / cPanel certificates for your domain.
3. Verify the lock icon appears when accessing your domain directly.

## 5. Reverse Proxy for Next.js (OpenLiteSpeed)
If you are running Next.js via PM2 on port 3000, you must configure a reverse proxy.
1. Open `.htaccess` in your `public_html` directory.
2. Add the following rewrite rules to proxy traffic to Node.js:
   ```apache
   RewriteEngine On
   RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
   ```
*(Note: OLS reads `.htaccess`. Ensure the LiteSpeed proxy module is enabled in WHM).*
