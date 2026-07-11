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
