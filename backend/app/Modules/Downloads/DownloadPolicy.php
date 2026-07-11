<?php

namespace App\Modules\Downloads;

use App\Policies\AbstractContentPolicy;
use App\Models\User;

class DownloadPolicy extends AbstractContentPolicy
{
    /** 
     * Extensible access level check.
     */
    public function download(?User $user, Download $download): bool
    {
        if ($user?->hasRole('admin')) return true;

        return match($download->access_level) {
            'public'        => true,
            'authenticated' => $user !== null,
            'subscriber'    => $user?->hasRole('subscriber') || $user?->hasRole('customer') || $user?->hasRole('premium'),
            'customer'      => $user?->hasRole('customer') || $user?->hasRole('premium'),
            'premium'       => $user?->hasRole('premium'),
            'role'          => $user?->hasRole($download->required_permission),
            'permission'    => $user?->hasPermissionTo($download->required_permission),
            default         => false,
        };
    }
}
