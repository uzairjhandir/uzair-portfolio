<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\NavigationMenu;
use App\Models\NavigationItem;
use App\Models\Page;
use Illuminate\Support\Str;

class DefaultNavigationSeeder extends Seeder
{
    public function run(): void
    {
        $primaryMenu = NavigationMenu::firstOrCreate(
            ['location' => 'primary'],
            [
                'name' => 'Main Navigation',
                'slug' => 'main-navigation',
                'description' => 'The primary header navigation',
                'status' => 'published',
            ]
        );

        $footerMenu = NavigationMenu::firstOrCreate(
            ['location' => 'footer'],
            [
                'name' => 'Footer Navigation',
                'slug' => 'footer-navigation',
                'status' => 'published',
            ]
        );

        // Seed Primary Items
        $aboutPage = Page::where('slug', 'about')->first();
        if ($aboutPage) {
            NavigationItem::firstOrCreate([
                'navigation_menu_id' => $primaryMenu->id,
                'page_id' => $aboutPage->id,
            ], [
                'type' => 'page',
                'label' => 'About Us',
                'visibility' => 'public',
                'sort_order' => 1,
            ]);
        }
    }
}
