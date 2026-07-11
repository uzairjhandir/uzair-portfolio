# Global Search Architecture

The React Admin requires a unified Global Search experience accessible via `Cmd+K` or the top navigation bar.

## API Endpoint
`GET /api/v1/search`

**Query Parameters:**
- `q` (string, the search term)
- `type` (optional string, to restrict search to a specific model)

## Response Structure
The endpoint will return a unified array of results categorized by type:
```json
{
  "success": true,
  "data": {
    "pages": [{ "id": 1, "title": "About", "url": "/admin/pages/1/edit" }],
    "blog": [{ "id": 4, "title": "How to build...", "url": "/admin/blog/4/edit" }],
    "portfolio": [],
    "crm": [{ "id": 9, "name": "John Doe", "url": "/admin/crm/9/edit" }],
    "users": [],
    "media": []
  }
}
```

## Backend Implementation
Laravel will use an aggregate search service or `Laravel Scout` if database limits are exceeded. For initial implementation, the search service will perform concurrent queries across the indexed columns of the following tables:
- `pages` (title)
- `blog_posts` (title)
- `portfolio_projects` (title, client_name)
- `case_studies` (title)
- `crm_contacts` (name, email)
- `users` (name, email)
- `media` (file_name)
