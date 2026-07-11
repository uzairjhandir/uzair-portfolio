# Laravel Database Schema

Design derived exactly from the React Admin modules. Fully normalized to avoid duplication.

## Users Module (`users` table)
**Purpose**: System administrators and authors.
- **Columns**: `id`, `name`, `email`, `password`, `remember_token`, `last_login_at`, `status` (enum: active, inactive), `timestamps`
- **Soft Deletes**: Yes (`deleted_at`)
- **Relationships**: Has roles (Spatie), Has many Blog Posts.
- **Media**: `avatar` collection.

## Roles & Permissions (Spatie Permission Tables)
**Purpose**: RBAC structure.
- **Tables**: `roles`, `permissions`, `model_has_permissions`, `model_has_roles`, `role_has_permissions`.
- **Columns**: Default Spatie columns + `description` on `roles`.

## Blog Module (`blog_posts` table)
**Purpose**: Articles and tutorials.
- **Columns**: `id`, `title`, `slug`, `content`, `excerpt`, `status` (enum: draft, published, archived), `author_id`, `published_at`, `timestamps`.
- **Foreign Keys**: `author_id` references `users(id)`.
- **Indexes**: Unique `slug`, Index on `status`, `published_at`.
- **Soft Deletes**: Yes.
- **SEO**: Handled via global `seo_metadata` polymorphic table or JSON column `seo`.
- **Media**: `cover_image` collection.

## Blog Categories (`blog_categories` table)
**Purpose**: Grouping posts.
- **Columns**: `id`, `name`, `slug`, `description`, `timestamps`.
- **Relationships**: Has many Blog Posts.

## Blog Tags (`blog_tags` table)
**Purpose**: Taxonomy for posts.
- **Columns**: `id`, `name`, `slug`.
- **Pivot Table**: `blog_post_tag` (`post_id`, `tag_id`).

## Portfolio Module (`portfolio_projects` table)
**Purpose**: Work showcases.
- **Columns**: `id`, `title`, `slug`, `client_name`, `description`, `live_url`, `github_url`, `completion_date`, `status`, `timestamps`.
- **Soft Deletes**: Yes.
- **Media**: `thumbnail`, `gallery` collections.

## Case Studies (`case_studies` table)
**Purpose**: Detailed breakdowns of portfolio projects.
- **Columns**: `id`, `project_id`, `title`, `slug`, `challenge`, `solution`, `results`, `status`, `timestamps`.
- **Foreign Keys**: `project_id` references `portfolio_projects(id)`.

## CRM Module (`crm_contacts` table)
**Purpose**: Incoming leads from Contact forms.
- **Columns**: `id`, `name`, `email`, `subject`, `message`, `status` (enum: new, in-progress, resolved, spam), `priority` (enum: low, medium, high), `internal_notes`, `timestamps`.
- **Indexes**: Index on `status` and `email`.

## Newsletter (`newsletter_subscribers` table)
**Purpose**: Email list management.
- **Columns**: `id`, `email`, `status` (enum: subscribed, unsubscribed, bounced), `subscribed_at`, `timestamps`.

## Homepage Engine (Modular structure)
Instead of a single bloated table, homepage items are normalized into individual features.
- **`heroes`**: `id`, `title`, `subtitle`, `cta_text`, `cta_link`, `status` (Media: `hero_image`).
- **`services`**: `id`, `title`, `description`, `icon`, `status`.
- **`skills`**: `id`, `name`, `category`, `proficiency_percentage`, `icon`, `status`.
- **`testimonials`**: `id`, `client_name`, `client_role`, `content`, `rating`, `status` (Media: `avatar`).
- **`client_logos`**: `id`, `name`, `url`, `status` (Media: `logo`).

## Settings (`settings` table)
**Purpose**: Global configuration overrides.
- **Columns**: `id`, `group` (e.g., general, seo, email), `key` (string, unique per group), `value` (json), `type` (enum: string, boolean, int, json), `description`, `timestamps`.

## Activity Logs (`activity_logs` table)
**Purpose**: Audit trails for admin actions. (Spatie Activitylog)
- **Columns**: Default Spatie columns (`log_name`, `description`, `subject_type`, `subject_id`, `causer_type`, `causer_id`, `properties`, `created_at`).

## Reserved Architecture (Future Modules)
The architecture must be scalable to seamlessly support these modules in Phase 2+ without rewriting existing tables:

### Enterprise Modules
- **Comments & Reviews**: Polymorphic relationship to `blog_posts` and `portfolio_projects`.
- **API Keys & Webhooks**: Table for `api_keys` mapped to users, and `webhook_subscriptions` for automated push events.
- **Import/Export**: Background job statuses saved in a `data_exports` table.
- **AI Content**: AI prompt history and generation metadata stored in `ai_generations` polymorphic table.
- **Multi-language (i18n) / Multi-site**: Implementation via `spatie/laravel-translatable` using JSON columns for content fields rather than separate translation tables, to maintain high performance.

### Personal Brand Modules
Because this is a personal portfolio CMS, the backend reserves the exact structure for:
- **Resume/CV Manager**: Multiple CV uploads with a `is_default` flag. Tracks download counts.
- **Downloads Manager**: Generic file distribution with hit tracking.
- **Achievements & Awards**: Separate module for accolades.
- **Clients**: Client directory independent of the portfolio.
- **Tech Stack**: Centralized taxonomy of skills and tools.
- **Timeline**: Work history, education, and milestones.
- **Testimonials Approval Workflow**: Allow clients to submit reviews on the frontend, landing in the CMS as `pending` before being published.
- **Analytics Dashboard**: Dedicated settings group to configure GA4, Clarity, and Meta Pixel.
