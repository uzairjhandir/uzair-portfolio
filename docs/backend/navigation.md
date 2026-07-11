# Navigation Manager Architecture

Menus will not be hardcoded in the frontend. They will be managed via a hierarchical CMS structure.

## Database Schema (`menus` and `menu_items` tables)

### `menus` table
- `id`
- `name` (e.g., "Header Main", "Footer Company", "Mobile Menu")
- `location` (enum: header, footer_1, footer_2, mobile, sidebar)
- `status`

### `menu_items` table
- `id`
- `menu_id` (foreign key)
- `parent_id` (foreign key, self-referencing for unlimited nesting)
- `title` (string)
- `url` (string - supports internal like `/about` or external `https://...`)
- `target` (enum: _self, _blank)
- `icon` (string, optional SVG class)
- `badge` (string, optional e.g., "New", "Hot")
- `is_mega_menu` (boolean)
- `sort_order` (integer, drag & drop)
- `permissions` (string, optional - e.g., only show if user has `dashboard.view`)
- `status`

## API Behavior
`GET /api/v1/navigation` returns all active menus grouped by their location with deeply nested children.

```json
{
  "data": {
    "header": [
      {
        "title": "Services",
        "url": "/services",
        "children": [
          { "title": "Web Development", "url": "/services/web" }
        ]
      }
    ]
  }
}
```
