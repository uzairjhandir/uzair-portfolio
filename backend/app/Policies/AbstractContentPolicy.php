<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * Base authorization policy for all content types.
 * Extend in BlogPolicy, PortfolioPolicy, etc. and override only what differs.
 *
 * Usage:
 *   class BlogPolicy extends AbstractContentPolicy {}
 */
abstract class AbstractContentPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Model $content): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasAnyPermission(['content.create', 'admin']);
    }

    public function update(User $user, Model $content): bool
    {
        return $user->id === $content->author_id
            || $user->hasAnyPermission(['content.edit', 'admin']);
    }

    public function delete(User $user, Model $content): bool
    {
        return $user->hasAnyPermission(['content.delete', 'admin']);
    }

    public function publish(User $user, Model $content): bool
    {
        return $user->hasAnyPermission(['content.publish', 'admin']);
    }

    public function restore(User $user, Model $content): bool
    {
        return $user->hasAnyPermission(['content.restore', 'admin']);
    }

    public function duplicate(User $user, Model $content): bool
    {
        return $user->hasAnyPermission(['content.create', 'admin']);
    }

    public function export(User $user, Model $content): bool
    {
        return $user->hasAnyPermission(['content.export', 'admin']);
    }
}
