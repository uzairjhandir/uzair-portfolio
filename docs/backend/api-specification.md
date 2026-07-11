# OpenAPI REST Specification

This specification strictly maps the frontend `resources.ts` logic to the future Laravel endpoints.

## Global API Standard Envelope
Every single endpoint must return this exact JSON structure:
```json
{
  "success": true,
  "message": "Resource fetched successfully",
  "data": [],
  "errors": null,
  "meta": {
    "total": 100,
    "per_page": 10,
    "current_page": 1,
    "last_page": 10
  }
}
```

## Global Query Parameters
Every list endpoint supports these standardized query parameters:
- `page` (integer)
- `search` (string)
- `sort_by` (string - column name)
- `sort_dir` (enum: `asc`, `desc`)
- `filters` (JSON or array format for specific column filtering)

## Blog Module (`/api/v1/blogs`)
### GET `/api/v1/blogs`
- **Description**: List paginated blog posts.
- **Permission**: `blog.view`
- **Query Params**: `page` (int), `search` (string), `status` (string), `sort_by` (string), `sort_dir` (asc|desc)
- **Response**: Paginated array of Post objects with Author and Category relationships.

### POST `/api/v1/blogs`
- **Description**: Create a new post.
- **Permission**: `blog.create`
- **Request Body**: `{ title, slug, content, excerpt, status, author_id, tags[] }`
- **Response**: Created Post object.

*(Similar endpoints apply for GET /{id}, PUT /{id}, DELETE /{id} for all CRUDs)*

## CRM Module (`/api/v1/crm`)
### GET `/api/v1/crm`
- **Permission**: `crm.view`
- **Query Params**: `page`, `search`, `status`, `priority`
- **Response**: Paginated array of Lead objects.

### PUT `/api/v1/crm/{id}`
- **Permission**: `crm.edit`
- **Request Body**: `{ status, priority, internal_notes }`
- **Response**: Updated Lead object.

## Settings Module (`/api/v1/settings`)
### GET `/api/v1/settings`
- **Permission**: `settings.view`
- **Query Params**: `group` (string, optional to fetch specific group)
- **Response**: Grouped dictionary of settings (e.g. `{ general: { site_name: "..." }, seo: { ... } }`)

### PUT `/api/v1/settings/bulk`
- **Permission**: `settings.update`
- **Request Body**: `{ group: "general", settings: { site_name: "New Name" } }`
- **Response**: Updated settings block.

*(This pattern repeats systematically for Users, Roles, Portfolio, Case Studies, Newsletter, and all Homepage Sections: Heroes, Services, Skills, Testimonials, Client Logos).*
