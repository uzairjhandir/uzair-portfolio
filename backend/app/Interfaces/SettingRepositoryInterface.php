<?php

namespace App\Interfaces;

use App\Models\SettingCategory;
use App\Models\Setting;
use Illuminate\Database\Eloquent\Collection;

interface SettingRepositoryInterface
{
    public function getAllGrouped(): Collection;
    
    public function getPublic(array $groups = [], array $keys = []): Collection;
    
    public function updateByKey(string $key, mixed $value): ?Setting;
    
    public function bulkUpdate(array $settings): bool;
}
