<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BlockType;

class BlockTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            [
                'name' => 'Hero',
                'slug' => 'hero',
                'category' => 'marketing',
                'is_singleton' => false,
                'allowed_zones' => ['homepage', 'landing'],
                'slots' => ['headline', 'description', 'actions', 'media'],
                'icon' => 'layout-template',
            ],
            [
                'name' => 'Cookie Banner',
                'slug' => 'cookie-banner',
                'category' => 'interactive',
                'is_singleton' => true,
                'allowed_zones' => ['*'],
                'slots' => ['content', 'actions'],
                'icon' => 'cookie',
            ],
            [
                'name' => 'FAQ',
                'slug' => 'faq',
                'category' => 'content',
                'allowed_zones' => ['homepage', 'landing', 'page'],
                'icon' => 'message-circle-question',
            ],
            [
                'name' => 'Testimonials',
                'slug' => 'testimonials',
                'category' => 'marketing',
                'allowed_zones' => ['homepage', 'landing'],
                'icon' => 'message-square-quote',
            ],
            [
                'name' => 'Gallery',
                'slug' => 'gallery',
                'category' => 'media',
                'allowed_zones' => ['homepage', 'landing', 'portfolio', 'case_study'],
                'icon' => 'images',
            ],
            [
                'name' => 'Tabs',
                'slug' => 'tabs',
                'category' => 'layout',
                'allowed_zones' => ['homepage', 'landing', 'page'],
                'icon' => 'folder-open',
            ],
            [
                'name' => 'Text',
                'slug' => 'text',
                'category' => 'content',
                'allowed_zones' => ['*'], // Allowed everywhere
                'icon' => 'type',
            ],
        ];

        foreach ($types as $data) {
            BlockType::firstOrCreate(
                ['slug' => $data['slug']],
                $data
            );
        }
    }
}
