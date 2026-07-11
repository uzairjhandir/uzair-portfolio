<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MediaFolder;
use Illuminate\Support\Str;

class MediaFolderSeeder extends Seeder
{
    public function run(): void
    {
        $folders = [
            'Homepage',
            'Blog',
            'Portfolio',
            'Case Studies',
            'Users',
            'Clients',
            'Downloads',
            'Documents',
            'SEO',
            'General',
        ];

        foreach ($folders as $folder) {
            MediaFolder::firstOrCreate([
                'slug' => Str::slug($folder),
            ], [
                'name' => $folder,
            ]);
        }
    }
}
