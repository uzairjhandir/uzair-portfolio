<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SettingCategory;
use App\Models\Setting;
use Illuminate\Support\Str;

class DefaultSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'General' => ['icon' => 'lucide-settings', 'sort_order' => 1],
            'Company' => ['icon' => 'lucide-building', 'sort_order' => 2],
            'Contact' => ['icon' => 'lucide-phone', 'sort_order' => 3],
            'SEO' => ['icon' => 'lucide-search', 'sort_order' => 4],
            'Email' => ['icon' => 'lucide-mail', 'sort_order' => 5],
            'Social' => ['icon' => 'lucide-share-2', 'sort_order' => 6],
            'Analytics' => ['icon' => 'lucide-pie-chart', 'sort_order' => 7],
            'Security' => ['icon' => 'lucide-shield', 'sort_order' => 8],
            'Media' => ['icon' => 'lucide-image', 'sort_order' => 9],
            'Appearance' => ['icon' => 'lucide-palette', 'sort_order' => 10],
            'Localization' => ['icon' => 'lucide-globe', 'sort_order' => 11],
            'Maintenance' => ['icon' => 'lucide-tool', 'sort_order' => 12],
            'Cache' => ['icon' => 'lucide-database', 'sort_order' => 13],
            'Backup' => ['icon' => 'lucide-hard-drive', 'sort_order' => 14],
            'API Keys' => ['icon' => 'lucide-code', 'sort_order' => 15, 'slug' => 'api'],
            // Slug forced to 'livechat' (not the auto-slugified 'live-chat') because
            // SettingService::get() derives the cache/lookup group from the setting
            // key's first dot-segment, and every LiveChat driver reads keys prefixed
            // 'livechat.*' (see App\Modules\LiveChat\Drivers\*) — a hyphenated slug
            // would never match and the settings would silently never resolve.
            'Live Chat' => ['icon' => 'lucide-message-circle', 'sort_order' => 16, 'slug' => 'livechat'],
        ];

        foreach ($categories as $name => $meta) {
            $category = SettingCategory::firstOrCreate(
                ['slug' => $meta['slug'] ?? Str::slug($name)],
                [
                    'name' => $name,
                    'icon' => $meta['icon'],
                    'sort_order' => $meta['sort_order']
                ]
            );

            // Seed specific keys based on category
            $this->seedSettingsForCategory($category);
        }
    }

    private function seedSettingsForCategory(SettingCategory $category): void
    {
        $settings = [];

        switch ($category->slug) {
            case 'general':
                $settings = [
                    ['key' => 'general.site_name', 'default_value' => 'Uzair Portfolio', 'type' => 'string', 'is_public' => true],
                    ['key' => 'general.logo', 'default_value' => null, 'type' => 'image', 'is_public' => true],
                    ['key' => 'general.favicon', 'default_value' => null, 'type' => 'image', 'is_public' => true],
                ];
                break;
            case 'seo':
                $settings = [
                    ['key' => 'seo.meta_title', 'default_value' => 'Uzair Portfolio', 'type' => 'string', 'is_public' => true],
                    ['key' => 'seo.meta_description', 'default_value' => 'Full Stack Developer', 'type' => 'textarea', 'is_public' => true],
                    ['key' => 'seo.robots', 'default_value' => 'index, follow', 'type' => 'string', 'is_public' => true],
                ];
                break;
            case 'email':
                $settings = [
                    ['key' => 'email.smtp_host', 'default_value' => 'smtp.mailtrap.io', 'type' => 'string'],
                    ['key' => 'email.smtp_port', 'default_value' => '2525', 'type' => 'integer'],
                    ['key' => 'email.smtp_username', 'default_value' => '', 'type' => 'string'],
                    ['key' => 'email.smtp_password', 'default_value' => '', 'type' => 'password', 'is_encrypted' => true],
                    ['key' => 'email.smtp_encryption', 'default_value' => 'tls', 'type' => 'string'],
                    ['key' => 'email.from_address', 'default_value' => '', 'type' => 'string'],
                    ['key' => 'email.from_name', 'default_value' => 'Uzair Portfolio', 'type' => 'string'],
                ];
                break;
            case 'social':
                $settings = [
                    ['key' => 'social.github', 'default_value' => '', 'type' => 'string', 'is_public' => true],
                    ['key' => 'social.linkedin', 'default_value' => '', 'type' => 'string', 'is_public' => true],
                    ['key' => 'social.twitter', 'default_value' => '', 'type' => 'string', 'is_public' => true],
                    ['key' => 'social.upwork', 'default_value' => '', 'type' => 'string', 'is_public' => true],
                ];
                break;
            case 'analytics':
                $settings = [
                    ['key' => 'analytics.ga4_id', 'default_value' => '', 'type' => 'string'],
                    ['key' => 'analytics.gtm_id', 'default_value' => '', 'type' => 'string'],
                    ['key' => 'analytics.clarity_id', 'default_value' => '', 'type' => 'string'],
                    ['key' => 'analytics.meta_pixel_id', 'default_value' => '', 'type' => 'string'],
                ];
                break;
            case 'livechat':
                $settings = [
                    ['key' => 'livechat.enabled', 'default_value' => false, 'type' => 'boolean'],
                    ['key' => 'livechat.provider', 'default_value' => 'none', 'type' => 'string'],
                    ['key' => 'livechat.tawkto.property_id', 'default_value' => '', 'type' => 'string'],
                    ['key' => 'livechat.tawkto.widget_id', 'default_value' => '', 'type' => 'string'],
                    ['key' => 'livechat.crisp.website_id', 'default_value' => '', 'type' => 'string'],
                    ['key' => 'livechat.position', 'default_value' => 'bottom-right', 'type' => 'string'],
                    ['key' => 'livechat.mobile_enabled', 'default_value' => true, 'type' => 'boolean'],
                ];
                break;
            case 'api':
                $settings = [
                    ['key' => 'api.openai_key', 'default_value' => '', 'type' => 'password', 'is_encrypted' => true],
                    ['key' => 'api.gemini_key', 'default_value' => '', 'type' => 'password', 'is_encrypted' => true],
                    ['key' => 'api.claude_key', 'default_value' => '', 'type' => 'password', 'is_encrypted' => true],
                    ['key' => 'api.google_maps_key', 'default_value' => '', 'type' => 'password', 'is_encrypted' => true],
                    ['key' => 'api.cloudflare_token', 'default_value' => '', 'type' => 'password', 'is_encrypted' => true],
                    ['key' => 'api.recaptcha_site_key', 'default_value' => '', 'type' => 'string', 'is_public' => true],
                    ['key' => 'api.recaptcha_secret_key', 'default_value' => '', 'type' => 'password', 'is_encrypted' => true],
                ];
                break;
            // Additional categories can be seeded here...
        }

        foreach ($settings as $setting) {
            // Pass raw PHP values, not pre-encoded JSON — Setting::setValueAttribute()
            // already json_encode()s on assignment (and default_value's 'json' cast
            // does the same), so encoding here too double-encodes every seeded
            // default (stored as e.g. "\"bottom-right\"" instead of "bottom-right").
            Setting::firstOrCreate(
                ['key' => $setting['key']],
                [
                    'setting_category_id' => $category->id,
                    'default_value' => $setting['default_value'],
                    'value' => $setting['default_value'],
                    'type' => $setting['type'],
                    'is_public' => $setting['is_public'] ?? false,
                    'is_encrypted' => $setting['is_encrypted'] ?? false,
                    'is_system' => true,
                ]
            );
        }
    }
}
