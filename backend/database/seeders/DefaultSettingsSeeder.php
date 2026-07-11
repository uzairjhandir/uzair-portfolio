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
            'API' => ['icon' => 'lucide-code', 'sort_order' => 15],
        ];

        foreach ($categories as $name => $meta) {
            $category = SettingCategory::firstOrCreate(
                ['slug' => Str::slug($name)],
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
                ];
                break;
            // Additional categories can be seeded here...
        }

        foreach ($settings as $setting) {
            Setting::firstOrCreate(
                ['key' => $setting['key']],
                [
                    'setting_category_id' => $category->id,
                    'default_value' => json_encode($setting['default_value']),
                    'value' => json_encode($setting['default_value']),
                    'type' => $setting['type'],
                    'is_public' => $setting['is_public'] ?? false,
                    'is_encrypted' => $setting['is_encrypted'] ?? false,
                    'is_system' => true,
                ]
            );
        }
    }
}
