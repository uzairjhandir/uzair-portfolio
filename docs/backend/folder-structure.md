# Laravel Architecture Freeze: Folder Structure

This document outlines the frozen, final folder architecture for the Laravel 12 backend. No further restructuring of the core `app/` directory is allowed. This ensures predictable scaling and separation of concerns.

## `app/` Directory Map

```text
app/
├── Actions/        # Single-responsibility classes for business logic (e.g., PublishBlogPostAction)
├── DTOs/           # Data Transfer Objects for strongly typing incoming request data
├── Enums/          # PHP Enums (e.g., UserRole, PostStatus, PriorityLevel)
├── Events/         # Domain events (e.g., UserRegistered, PostPublished)
├── Exceptions/     # Custom application exceptions and the global Handler
├── Helpers/        # Global helper functions and utilities
├── Http/           
│   ├── Controllers/    # API Controllers (thin layer: validate -> pass to service -> return resource)
│   ├── Middleware/     # Route middleware (Auth, Roles, Localization)
│   └── Requests/       # FormRequests mapping exactly to Frontend Zod validation schemas
├── Jobs/           # Queued jobs (e.g., ProcessImageConversions, SendNewsletter)
├── Listeners/      # Event listeners
├── Mail/           # Mailable classes for sending emails
├── Models/         # Eloquent models (relations, casts, accessors, mutators)
├── Notifications/  # System notifications (Database, Mail, Slack, SMS)
├── Observers/      # Model observers (created, updated, deleted hooks)
├── Policies/       # Authorization policies for resources (matching RBAC matrix)
├── Repositories/   # Data access layer (abstracts Eloquent queries away from Services)
├── Resources/      # API Resources & Resource Collections (JSON response transformers)
├── Rules/          # Custom validation rules
├── Services/       # Core business logic orchestrators (uses Repositories, Actions, and DTOs)
└── Traits/         # Reusable model traits (e.g., HasPermissions, HasAuthor)
```

## Backend Execution Order Roadmap

To ensure zero rework and perfect alignment with the React Admin, the Laravel implementation will follow this strict sequence:

### Phase A: Architecture
- Freeze folder structure, install core packages (Sanctum, Spatie Permission, Spatie MediaLibrary).

### Phase B: Database
- Create Migrations based exactly on `database-schema.md`.

### Phase C: Models
- Create Eloquent Models, Relationships, Casts, Enums, and Traits.

### Phase D: Repositories
- Build the Repository layer to handle data retrieval, filtering, and sorting.

### Phase E: Services & Actions
- Implement the business logic layer, encapsulating complex operations.

### Phase F: Http & Validation (Controllers & Requests)
- Build FormRequests based on `validation-rules.md`.
- Build thin API Controllers.

### Phase G: Authorization (Policies)
- Implement Spatie Permissions and Model Policies mapping to `permissions.md`.

### Phase H: API Responses (Resources)
- Build API Resources to guarantee the JSON shape matches the frontend React Admin expectations.

### Phase I: Testing & QA
- Feature tests for all endpoints.

### Phase J: Production
- Final deployment, cache configuration, queue workers setup.
