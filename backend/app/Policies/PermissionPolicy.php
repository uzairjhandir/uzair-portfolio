<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Permission;

class PermissionPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }
}
