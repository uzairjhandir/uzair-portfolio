<?php

namespace App\Services;

use App\Interfaces\SettingRepositoryInterface;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class SettingService
{
    public function __construct(
        protected SettingRepositoryInterface $settingRepository
    ) {}

    public function get(string $key, mixed $default = null)
    {
        $group = explode('.', $key)[0];
        
        $settings = Cache::rememberForever("settings.{$group}", function () use ($group) {
            return Setting::whereHas('category', function($q) use ($group) {
                $q->where('slug', $group);
            })->pluck('value', 'key')->toArray();
        });

        // The Setting model accessor handles ENV overrides when retrieving via eloquent, 
        // but since we cached the raw value here, we should apply ENV override at retrieval time for cached values too.
        $envKey = strtoupper(str_replace('.', '_', $key));
        if (env($envKey) !== null) {
            return env($envKey);
        }

        return $settings[$key] ?? $default;
    }

    public function updateByKey(string $key, mixed $value): ?Setting
    {
        $setting = $this->settingRepository->updateByKey($key, $value);
        if ($setting) {
            $group = $setting->category->slug;
            $this->clearCache($group);
        }
        return $setting;
    }

    public function bulkUpdate(array $data): void
    {
        $this->settingRepository->bulkUpdate($data);
        
        // Clear all affected groups
        $keys = array_keys($data);
        $groups = [];
        foreach ($keys as $key) {
            $groups[] = explode('.', $key)[0];
        }
        $groups = array_unique($groups);
        
        foreach ($groups as $group) {
            $this->clearCache($group);
        }
    }
    
    public function clearCache(string $group): void
    {
        Cache::forget("settings.{$group}");
    }
}
