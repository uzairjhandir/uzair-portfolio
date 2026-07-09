# SMTP & Email Deliverability Setup

The portfolio's contact form relies on Nodemailer connecting to a custom SMTP server to dispatch emails. Proper setup is critical to prevent emails from going to spam.

## 1. Creating the Email Account
1. Log into **cPanel**.
2. Navigate to **Email Accounts** > **Create**.
3. Create an address, e.g., `contact@yourdomain.com`.
4. Generate a strong password and save it securely.
5. Note the "Connect Devices" settings:
   - **Outgoing Server:** `mail.yourdomain.com`
   - **SMTP Port:** `465` (Requires SSL/TLS)

## 2. Configuring the Application
Update your `.env` file on the server with the credentials:
```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contact@yourdomain.com
SMTP_PASS=your_strong_password
CONTACT_EMAIL=your_personal_email@gmail.com
```

## 3. DNS Records for Deliverability (CRITICAL)
If you are using Cloudflare, ensure these records are set up correctly under your DNS tab:

### A. SPF (Sender Policy Framework)
Add a TXT record for `@`:
```text
v=spf1 +a +mx +ip4:YOUR_SERVER_IP ~all
```

### B. DKIM (DomainKeys Identified Mail)
1. In cPanel, go to **Email Deliverability**.
2. Click **Manage** next to your domain.
3. Copy the DKIM Name and Value.
4. In Cloudflare, add a CNAME or TXT record as provided by cPanel.

### C. DMARC (Domain-based Message Authentication, Reporting, and Conformance)
Add a TXT record for `_dmarc`:
```text
v=DMARC1; p=none; sp=none; rua=mailto:contact@yourdomain.com;
```

## 4. Testing
1. Submit a test inquiry via the contact form.
2. Check your personal inbox (`CONTACT_EMAIL`).
3. Check the auto-reply in the sender's inbox.
4. Verify headers to ensure SPF, DKIM, and DMARC pass.
