<?php

namespace App\Modules\Settings;

use App\Services\SettingService;

class SettingsManager
{
    public function __construct(private SettingService $settingService) {}

    public function get(string $key, mixed $default = null)
    {
        return $this->settingService->get($key, $default);
    }
}
