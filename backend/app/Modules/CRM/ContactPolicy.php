<?php

namespace App\Modules\Crm;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ContactPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasAnyPermission(['crm.viewAny', 'admin']);
    }

    public function view(User $user, CrmContact $contact): bool
    {
        return $user->hasAnyPermission(['crm.view', 'admin'])
            || $contact->assigned_to === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasAnyPermission(['crm.create', 'admin']);
    }

    public function update(User $user, CrmContact $contact): bool
    {
        return $user->hasAnyPermission(['crm.update', 'admin'])
            || $contact->assigned_to === $user->id;
    }

    public function delete(User $user, CrmContact $contact): bool
    {
        return $user->hasAnyPermission(['crm.delete', 'admin']);
    }

    public function export(User $user): bool
    {
        return $user->hasAnyPermission(['crm.export', 'admin']);
    }
}
