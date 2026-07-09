# Backup Strategy

To ensure data integrity and prevent loss of work, follow these backup procedures.

## 1. Codebase Backups (Git)
The source code should be backed up using Git and a remote repository (e.g., GitHub, GitLab, Bitbucket).
- Always commit changes locally.
- Push to the `main` or `master` branch before deploying.
- Ensure the `.gitignore` file correctly excludes `.env`, `node_modules`, and `.next` directories to prevent sensitive data leaks.

## 2. Server-Level Backups (cPanel/WHM)
If your application resides on a cPanel server, configure automated server backups:
1. Log into **WHM**.
2. Navigate to **Backup** > **Backup Configuration**.
3. Enable backups and set them to daily/weekly schedules.
4. Retain at least 3-7 days of daily backups.
5. Configure a remote destination (e.g., Amazon S3, Google Drive, or a remote FTP server) so backups are not stored exclusively on the same physical drive as the server.

## 3. Environment Variables Backup
Your `.env.local` file contains critical production secrets (SMTP passwords).
- Store a secure copy of your environment variables in a password manager (e.g., 1Password, Bitwarden) as a Secure Note.
- Never share these keys over unencrypted channels (Slack, WhatsApp).

## 4. Disaster Recovery
If the server fails:
1. Provision a new VPS.
2. Install WHM/cPanel & OpenLiteSpeed.
3. Pull the codebase from GitHub.
4. Retrieve the `.env` file from your secure password manager.
5. Run `npm install` and `npm run build`.
6. Update DNS records via Cloudflare to point to the new IP address.
