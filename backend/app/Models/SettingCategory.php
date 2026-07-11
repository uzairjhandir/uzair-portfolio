<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class SettingCategory extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'icon',
        'description',
        'sort_order',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function settings()
    {
        return $this->hasMany(Setting::class);
    }
}
