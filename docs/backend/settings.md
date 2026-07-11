# Settings Architecture

To prevent a massive, disorganized list of flat key-value pairs, settings are grouped into domains. The database table utilizes a `group` column and a strongly typed `type` column.

## Database Structure (`settings` table)
| Column | Type | Description |
|---|---|---|
| `group` | string | The domain (e.g., `general`, `seo`, `email`) |
| `key` | string | Unique within the group (e.g., `site_name`) |
| `value` | json | The actual value (JSON allows arrays, strings, booleans, ints safely) |
| `type` | enum | `string`, `boolean`, `integer`, `json`, `text` (used for frontend rendering hints) |
| `description` | string | Helper text for the admin panel |

## Defined Groups

### 1. General
- `site_name` (string)
- `site_tagline` (string)
- `contact_email` (string)
- `maintenance_mode` (boolean)

### 2. SEO
- `meta_title_pattern` (string)
- `meta_description_default` (text)
- `og_image_default` (string - URL)

### 3. Social
- `twitter_url` (string)
- `github_url` (string)
- `linkedin_url` (string)

### 4. Email
- `smtp_host` (string)
- `smtp_port` (integer)
- `mail_from_address` (string)

### 5. Analytics
- `google_analytics_id` (string)
- `meta_pixel_id` (string)

## API Behavior
`GET /api/v1/settings` returns all settings formatted as a deeply nested object to avoid complex parsing on the frontend:
```json
{
  "general": {
    "site_name": "Uzair Portfolio",
    "maintenance_mode": false
  },
  "seo": {
    "meta_title_pattern": "%s | Uzair"
  }
}
```
