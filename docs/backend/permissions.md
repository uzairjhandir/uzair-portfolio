# RBAC Permissions Matrix

This matrix maps directly to Laravel Policies and Spatie Permissions. Frontend buttons and API Controller gates are enforced by these precise string keys.

| Module | View | Create | Edit | Delete | Special/Other |
|---|---|---|---|---|---|
| **Homepage** | `homepage.view` | `homepage.create` | `homepage.edit` | `homepage.delete` | - |
| **Blog** | `blog.view` | `blog.create` | `blog.edit` | `blog.delete` | `blog.publish` |
| **Portfolio** | `portfolio.view` | `portfolio.create` | `portfolio.edit` | `portfolio.delete` | `portfolio.feature` |
| **CRM** | `crm.view` | `crm.create` | `crm.edit` | `crm.delete` | `crm.export` |
| **Newsletter** | `newsletter.view` | `newsletter.create` | `newsletter.edit` | `newsletter.delete` | `newsletter.export` |
| **Users** | `users.view` | `users.create` | `users.edit` | `users.delete` | `users.manage_roles` |
| **Roles** | `roles.view` | `roles.create` | `roles.edit` | `roles.delete` | - |
| **Settings** | `settings.view` | - | `settings.update` | - | - |
| **Media** | `media.view` | `media.upload` | `media.edit` | `media.delete` | - |
| **Activity Logs** | `logs.view` | - | - | - | `logs.export` |

## Enforcement Strategy
- **Frontend**: Hidden via `hasPermission("blog.view")`
- **Backend Routing**: `Route::get('/blogs')->middleware('permission:blog.view')`
- **Backend Policy**: `public function update(User $user, Post $post) { return $user->hasPermissionTo('blog.edit'); }`
