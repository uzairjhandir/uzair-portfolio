<?php

if (!function_exists('setting')) {
    /**
     * Get a setting value.
     *
     * @param  string  $key
     * @param  mixed  $default
     * @return mixed
     */
    function setting(string $key, $default = null)
    {
        return app(\App\Services\SettingService::class)->get($key, $default);
    }
}
