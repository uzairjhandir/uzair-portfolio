<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;
use Illuminate\Support\Str;

class DefaultPagesSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            [
                'title' => 'About Us',
                'slug' => 'about',
                'template' => 'about',
                'type' => 'page',
                'status' => 'published',
                'show_in_header' => true,
                'show_in_footer' => true,
            ],
            [
                'title' => 'Privacy Policy',
                'slug' => 'privacy-policy',
                'template' => 'privacy',
                'type' => 'legal',
                'status' => 'published',
                'show_in_header' => false,
                'show_in_footer' => true,
            ],
            [
                'title' => 'Terms of Service',
                'slug' => 'terms-of-service',
                'template' => 'terms',
                'type' => 'legal',
                'status' => 'published',
                'show_in_header' => false,
                'show_in_footer' => true,
            ],
            [
                'title' => 'Contact Us',
                'slug' => 'contact',
                'template' => 'contact',
                'type' => 'contact',
                'status' => 'published',
                'show_in_header' => true,
                'show_in_footer' => true,
            ],
            [
                'title' => 'FAQ',
                'slug' => 'faq',
                'template' => 'faq',
                'type' => 'faq',
                'status' => 'published',
                'show_in_header' => false,
                'show_in_footer' => true,
            ],
        ];

        foreach ($pages as $index => $data) {
            Page::firstOrCreate(
                ['slug' => $data['slug']],
                array_merge($data, [
                    'sort_order' => $index,
                    'preview_token' => Str::random(32),
                    'publish_date' => now(),
                    'blocks' => [
                        ['type' => 'text', 'data' => ['text' => 'Default content for ' . $data['title']]]
                    ]
                ])
            );
        }
    }
}
