<?php

namespace App\Models;

// use Spatie\Permission\Models\Permission as SpatiePermission;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model; // Fallback since Spatie isn't installed

class Permission extends Model // extends SpatiePermission
{
    use HasUuids;

    protected $hidden = ['pivot'];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }
}
