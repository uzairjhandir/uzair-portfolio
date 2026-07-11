<?php

namespace App\Modules\Blog;

use App\Policies\AbstractContentPolicy;
use App\Models\User;

/**
 * Blog authorization.
 * Inherits all standard content permissions from AbstractContentPolicy.
 * Override only if Blog has unique permission requirements.
 */
class BlogPolicy extends AbstractContentPolicy
{
    // Standard permissions (view, create, update, delete, publish, restore,
    // duplicate, export) all come from AbstractContentPolicy.

    // Example: only admins can pin posts
    public function pin(User $user, Blog $blog): bool
    {
        return $user->hasAnyPermission(['blog.pin', 'admin']);
    }

    // Example: only admins can feature posts
    public function feature(User $user, Blog $blog): bool
    {
        return $user->hasAnyPermission(['blog.feature', 'admin']);
    }
}
