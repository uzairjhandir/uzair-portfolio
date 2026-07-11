# Contact Module Architecture

The Contact module centralizes the management of the public Contact page and routes inbound inquiries directly into the CRM.

## 1. CMS Management (Contact Page Settings)
The settings for the Contact page are stored in the `settings` table under the `contact` group.
- `office_address` (json array - supports multiple locations)
- `phone_numbers` (json array - supports multiple phones)
- `email_addresses` (json array - supports multiple emails)
- `emergency_contact` (string)
- `whatsapp_number` (string)
- `google_maps_embed` (json array - coordinates for multiple offices)
- `working_hours` (json)
- `cta_blocks` (json array - dynamic call-to-action sections)
- `social_links` (json)

## 2. Contact Form Submission (CRM Integration)
To avoid duplicating tables, all submissions from the frontend Contact Form will be saved directly into the existing CRM `crm_contacts` table.

### API Endpoint: `POST /api/v1/contact`
**Request Payload**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "Hello, I would like to..."
}
```

**Backend Process**:
1. Validate against `validation-rules.md`.
2. Save to `crm_contacts` with default status `new`.
3. Dispatch `ContactMessageReceived` Event.
4. (Listener) Send Email Notification to Admin.
5. (Listener) Send Auto-Responder Email to User.
