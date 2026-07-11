# Backend Architecture: Core / Modules / Shared

## Philosophy
This backend is a **modular Digital Experience Platform (DXP)** — not a traditional Laravel monolith.
Every architectural decision should favour **reusability over convenience** and **explicit contracts over implicit dependencies**.

---

## Directory Structure

```
backend/app/
├── Core/                    # Framework-level infrastructure (frozen after Module 10.5)
│   ├── Content/
│   │   ├── Concerns/        # Composable traits (use these in Models)
│   │   │   ├── HasContentSeo.php
│   │   │   ├── HasContentPublishing.php
│   │   │   ├── HasContentRevisions.php
│   │   │   ├── HasContentScheduling.php
│   │   │   ├── HasContentSlug.php
│   │   │   ├── HasPreviewToken.php
│   │   │   ├── HasContentMedia.php
│   │   │   ├── HasContentSearch.php
│   │   │   ├── HasContentLocking.php
│   │   │   └── HasTaxonomy.php
│   │   └── Services/        # ContentPublishingService, ContentRevisionService, etc.
│   ├── Taxonomy/
│   │   ├── Models/          # Taxonomy, TaxonomyTerm
│   │   └── Services/        # TaxonomyService
│   ├── Media/               # Media library (Module 5)
│   ├── SEO/                 # SeoMetadata model (polymorphic)
│   ├── Settings/            # Settings engine (Module 4)
│   ├── Navigation/          # Navigation manager (Module 7)
│   └── Auth/                # Auth, RBAC, permissions
│
├── Modules/                 # Domain-specific content modules (thin layers)
│   ├── Blog/                # Blog model + unique features (Series, ReadingTime, etc.)
│   ├── Portfolio/           # Portfolio module
│   ├── Pages/               # Pages module
│   ├── CRM/                 # Contact & CRM
│   ├── Newsletter/          # Newsletter module
│   └── Downloads/           # Downloads module
│
└── Shared/                  # Stateless reusable code (no DB models here)
    ├── Traits/              # General Laravel traits
    ├── Enums/               # ContentTypeEnum, ContentStatusEnum, etc.
    ├── Contracts/           # Interfaces (SearchDriverInterface, etc.)
    └── Helpers/             # Global helper functions
```

---

## Dependency Rules — PERMANENT

```
Core
 │
 ▼
Shared
 │
 ▼
Modules
 │
 ▼
API Controllers
 │
 ▼
Next.js Frontend
```

### ✅ Allowed

- `Modules` may depend on `Core` and `Shared`.
- `Core` may depend on `Shared`.
- Any layer may fire or listen to **Events**.
- Any layer may use `Contracts` / Interfaces.

### ❌ Forbidden

- `Blog` → `Portfolio` (cross-module direct dependency)
- `CRM` → `Blog` (cross-module direct dependency)
- `Core` → `Modules` (Core must not know about specific modules)

### ✅ Cross-module communication is ONLY permitted via:

1. **Core Services** — e.g. `ContentPublishingService`, `TaxonomyService`
2. **Contracts** — e.g. `SearchDriverInterface`
3. **Events** — e.g. `ContentPublished`, `TaxonomyUpdated`, `MediaAttached`

---

## Content Engine Rule

> Before adding a feature to a Module, ask:
> **"Can this be a Core trait or Service?"**
> If yes → add it to Core. If it's genuinely blog-specific → add it to the Blog Module.

---

## Core Layer Freeze

`Core/`, `Shared/`, and all content engine traits are **frozen after Module 10.5**.
New capabilities must be added as **new traits or new services** — never by modifying existing ones.

---

## API Pattern

Every content module exposes exactly these actions (via `AbstractContentController`):

| Action | Method | Endpoint |
|---|---|---|
| List | GET | `/resource` |
| Show | GET | `/resource/{uuid}` |
| Create | POST | `/resource` |
| Update | PUT | `/resource/{uuid}` |
| Delete | DELETE | `/resource/{uuid}` |
| Publish | POST | `/resource/{uuid}/publish` |
| Unpublish | POST | `/resource/{uuid}/unpublish` |
| Duplicate | POST | `/resource/{uuid}/duplicate` |
| Restore | POST | `/resource/{uuid}/restore` |
| Preview | POST | `/resource/{uuid}/preview` |
| Export | GET | `/resource/{uuid}/export` |
| Import | POST | `/resource/import` |
| Revisions | GET | `/resource/{uuid}/revisions` |
| Show Revision | GET | `/resource/{uuid}/revisions/{version}` |
| Diff | GET | `/resource/{uuid}/revisions/diff` |
| Heartbeat | POST | `/resource/{uuid}/heartbeat` |

---

## Event Bus

All cross-layer communication goes through the event system. Never make direct service-to-service calls across module boundaries.

**Domain Events (complete list):**
- `ContentCreated`, `ContentUpdated`, `ContentDeleted`
- `ContentPublished`, `ContentUnpublished`, `ContentArchived`
- `ContentRestored`, `ContentDuplicated`, `ContentScheduled`, `ContentExpired`
- `ContentViewed`, `PreviewGenerated`
- `SearchIndexed`, `SearchRemoved`
- `SeoUpdated`, `TaxonomyUpdated`
- `MediaAttached`, `MediaDetached`
