<?php

namespace App\Models;

// use Spatie\Permission\Models\Role as SpatieRole;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
// use Spatie\Activitylog\Traits\LogsActivity;
// use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model; // Fallback since Spatie isn't installed here physically

class Role extends Model // extends SpatieRole
{
    use HasUuids;
    // use LogsActivity;

    protected $hidden = ['pivot'];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    /**
     * RoleRepository::paginate() and RoleController::show() both eager-load
     * this relation — role_has_permissions is the standard Spatie
     * laravel-permission pivot table (already migrated), but this model
     * never defined the Eloquent relationship over it since it stands in
     * for Spatie's own Role model.
     */
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_has_permissions', 'role_id', 'permission_id');
    }

    /*
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
    */
}
