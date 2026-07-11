<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Facades\Crypt;

class Setting extends Model
{
    use HasUuids; // Add LogsActivity later if spatie/laravel-activitylog installed

    protected $fillable = [
        'setting_category_id',
        'key',
        'value',
        'default_value',
        'type',
        'validation',
        'is_public',
        'is_encrypted',
        'is_system',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'value' => 'json',
        'default_value' => 'json',
        'validation' => 'json',
        'is_public' => 'boolean',
        'is_encrypted' => 'boolean',
        'is_system' => 'boolean',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function category()
    {
        return $this->belongsTo(SettingCategory::class, 'setting_category_id');
    }

    // Accessor to handle ENV override and Decryption
    public function getValueAttribute($value)
    {
        // 1. Check ENV override (e.g. key 'general.site_name' -> 'GENERAL_SITE_NAME')
        $envKey = strtoupper(str_replace('.', '_', $this->key));
        if (env($envKey) !== null) {
            return env($envKey);
        }

        // 2. Decode JSON (handled by casts implicitly, but we must handle decryption manually if needed)
        $actualValue = json_decode($value, true) ?? $value;

        // If it's null, return default
        if ($actualValue === null) {
            return $this->default_value;
        }

        // 3. Decrypt if encrypted
        if ($this->is_encrypted && !empty($actualValue)) {
            try {
                return Crypt::decryptString($actualValue);
            } catch (\Exception $e) {
                return $actualValue;
            }
        }

        return $actualValue;
    }

    // Mutator to handle Encryption
    public function setValueAttribute($value)
    {
        if ($this->is_encrypted && !empty($value)) {
            $value = Crypt::encryptString($value);
        }
        
        $this->attributes['value'] = json_encode($value);
    }
}
