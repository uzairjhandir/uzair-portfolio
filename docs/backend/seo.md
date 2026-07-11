# Polymorphic SEO Module Architecture

Every public-facing resource requires SEO metadata. Instead of adding SEO columns to every table, we will use a global polymorphic architecture.

## Database Schema (`seo_metadata` table)
- `id`
- `model_type` (e.g., `App\Models\Post`, `App\Models\Page`)
- `model_id`
- `meta_title` (string, overrides default)
- `meta_description` (text)
- `canonical_url` (string)
- `robots_meta` (enum: index, noindex, follow, nofollow)
- `schema_type` (enum: Article, Organization, Person, FAQPage, BreadcrumbList)
- `schema_data` (json - overrides default schema structure)
- `open_graph_image_uuid` (linked to Spatie MediaLibrary)

## JSON-LD Schema Builder
Laravel will expose a Schema builder resource that auto-generates JSON-LD based on the entity type.
- **Pages**: Uses `Website` or `Organization` schema.
- **Blog Posts**: Automatically builds `Article` schema, injecting the Author and Publish Date.
- **FAQ Page**: Automatically transforms the FAQ JSON into `FAQPage` schema.
- **Portfolio Projects**: Automatically builds `Project` schema.
- **Global**: Injects `BreadcrumbList` schema dynamically based on the URL tree.
- **Personal Brand**: Global `Person` schema injected on the homepage and about page.

## Frontend Usage
The React Admin will embed an SEO Form Component inside the tabs of any content type (Pages, Blogs, Portfolio) that saves directly to this polymorphic relationship.
