<?php

namespace App\Repositories;

use App\Interfaces\SettingRepositoryInterface;
use App\Models\SettingCategory;
use App\Models\Setting;
use Illuminate\Database\Eloquent\Collection;

class SettingRepository implements SettingRepositoryInterface
{
    public function getAllGrouped(): Collection
    {
        return SettingCategory::with('settings')->orderBy('sort_order')->get();
    }
    
    public function getPublic(array $groups = [], array $keys = []): Collection
    {
        $query = SettingCategory::with(['settings' => function ($q) use ($keys) {
            $q->where('is_public', true);
            if (!empty($keys)) {
                $q->whereIn('key', $keys);
            }
        }]);

        if (!empty($groups)) {
            $query->whereIn('slug', $groups);
        }

        return $query->orderBy('sort_order')->get();
    }
    
    public function updateByKey(string $key, mixed $value): ?Setting
    {
        $setting = Setting::where('key', $key)->first();
        if ($setting) {
            $setting->update(['value' => $value]);
            return $setting;
        }
        return null;
    }
    
    public function bulkUpdate(array $settingsData): bool
    {
        foreach ($settingsData as $key => $value) {
            $this->updateByKey($key, $value);
        }
        return true;
    }
}
