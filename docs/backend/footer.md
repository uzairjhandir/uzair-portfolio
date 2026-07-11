# Footer Manager Architecture

The Footer CMS combines Navigation links with specific Footer UI elements like Contact details and Newsletter CTAs.

## Integration Strategy
The Footer relies on two systems working together:
1. **Settings Module**: Stores the Company Info, Copyright text, and Contact Details under the `footer` settings group.
2. **Navigation Module**: Stores the "Quick Links", "Legal", and "Social" lists using the menu locations (`footer_1`, `footer_2`, etc.).

## Footer Settings Configuration
Stored in `settings` table (Group: `footer`):
- `company_description` (text)
- `copyright_text` (string)
- `newsletter_cta_heading` (string)
- `newsletter_cta_text` (string)
- `contact_email` (string)
- `contact_phone` (string)

## Frontend Implementation
The Next.js frontend will call `GET /api/v1/settings?group=footer` and `GET /api/v1/navigation` concurrently to assemble the dynamic footer layout.
