# Static Pages Module Architecture

The Static Pages module provides a reusable, dynamic CMS structure for core marketing and legal pages, preventing the need to hardcode pages in the frontend application.

## Database Schema (`pages` table)
- `id` (uuid)
- `title` (string)
- `slug` (string, unique)
- `parent_id` (foreign key -> pages, supports nested URLs like /about/team)
- `template` (enum: default, blank, contact, landing)
- `content` (text/json)
- `status` (enum: draft, published, archived)
- `publish_schedule` (timestamp, for future publishing)
- `published_at` (timestamp)
- `author_id` (foreign key -> users)
- `revisions` (json - history of changes)
- `timestamps`
- `deleted_at` (soft deletes)

## Features & Behaviors
1. **Dynamic Routing Fallback**: In the Next.js frontend, dynamic catch-all routes (`/[...slug]`) will query the Laravel API to render these pages dynamically.
2. **SEO Integration**: Deeply integrated with the Polymorphic SEO Module.
3. **Media Integration**: `featured_image` collection for the main header image.
4. **Revisions**: Every update stores a snapshot of the previous state in the `revisions` JSON column to allow rolling back.

## Default Seeded Pages
- Home (`/`)
- About (`/about`)
- Contact (`/contact`)
- Privacy Policy (`/privacy-policy`)
- Terms of Service (`/terms`)
- Cookies Policy (`/cookies`)
- Disclaimer (`/disclaimer`)
- Careers (`/careers`)
