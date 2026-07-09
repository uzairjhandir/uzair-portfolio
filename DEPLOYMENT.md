# Deployment Guide (cPanel / WHM)

This guide covers deploying the Next.js application to a cPanel/WHM environment (specifically tailored for OpenLiteSpeed).

## 1. Preparation
1. Ensure all environment variables are correctly set in your production `.env` file.
2. Build the application locally to verify there are no errors:
   ```bash
   npm run build
   ```

## 2. Server Configuration
Since Next.js requires Node.js, your cPanel environment must support running Node.js applications. This is typically done via **Phusion Passenger** (Setup Node.js App in cPanel) or by using **PM2** via SSH.

### Option A: Using cPanel "Setup Node.js App"
1. Log into cPanel.
2. Go to **Setup Node.js App** (under the Software section).
3. Click **Create Application**.
   - **Node.js Version:** Select 18.x or 20.x (ensure it matches Next.js requirements).
   - **Application Mode:** Production.
   - **Application Root:** `/home/username/portfolio` (Create this outside `public_html` for security).
   - **Application URL:** `yourdomain.com`
   - **Application Startup File:** `server.js` (You need to create a custom server.js for Next.js, or use `npm start`).
4. Upload your files (excluding `node_modules` and `.next`) to the Application Root via File Manager or FTP.
5. Click **Run NPM Install** in the cPanel Node.js App UI.
6. SSH into the server and run `npm run build` in the Application Root.
7. Restart the Node.js application from the cPanel interface.

### Option B: Using PM2 via SSH (Recommended for Advanced Users)
1. SSH into your server:
   ```bash
   ssh username@yourserver.com
   ```
2. Navigate to your intended directory (e.g., `~/portfolio`).
3. Clone or upload your repository.
4. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```
5. Start the application with PM2:
   ```bash
   pm2 start npm --name "uzair-portfolio" -- start
   pm2 save
   pm2 startup
   ```
6. Set up a Reverse Proxy in cPanel/OpenLiteSpeed to route traffic from port 80/443 to the Node.js port (usually 3000).

## 3. Cloudflare Configuration
1. Point your domain's Nameservers to Cloudflare.
2. Under **DNS**, ensure the A record points to your VPS IP (Proxied = Orange Cloud).
3. Under **SSL/TLS**, set encryption mode to **Full (Strict)**.
4. Under **Speed > Optimization**, enable Brotli compression.
5. Under **Caching**, purge cache after deployment.
