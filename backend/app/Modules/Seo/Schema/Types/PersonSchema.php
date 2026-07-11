<?php

namespace App\Modules\Seo\Schema\Types;

use Illuminate\Support\Facades\DB;

/**
 * Person Schema — Personal Brand (About page, homepage)
 *
 * Applied to: Pages with schema_type = 'Person' in seo_metadata
 *
 * Output:
 * {
 *   "@context": "https://schema.org",
 *   "@type": "Person",
 *   "name": "Uzair Jhandir",
 *   "url": "https://uzair.dev",
 *   "sameAs": ["https://github.com/...", "https://linkedin.com/in/..."],
 *   "jobTitle": "...",
 *   "image": "..."
 * }
 */
class PersonSchema extends AbstractSchema
{
    public function type(): string { return 'Person'; }

    public function supports(object $model): bool
    {
        $seo = $this->loadSeo($model);
        return $seo?->schema_type === 'Person';
    }

    public function build(object $model, array $context = []): array
    {
        $seo = $this->loadSeo($model);

        // Personal data from Settings module
        $name     = DB::table('settings')->where('key', 'site.owner_name')->value('value')
                    ?? config('app.name');
        $jobTitle = DB::table('settings')->where('key', 'site.owner_job_title')->value('value');

        $sameAs = [];
        foreach (['site.github_url', 'site.linkedin_url', 'site.twitter_url'] as $key) {
            $val = DB::table('settings')->where('key', $key)->value('value');
            if ($val) {
                $sameAs[] = $val;
            }
        }

        $schema = [
            'name'  => $name,
            'url'   => config('app.url'),
        ];

        if ($jobTitle) {
            $schema['jobTitle'] = $jobTitle;
        }

        if (!empty($sameAs)) {
            $schema['sameAs'] = $sameAs;
        }

        if ($imageUrl = $this->imageUrl($model)) {
            $schema['image'] = $imageUrl;
        }

        return $this->wrap('Person', $schema);
    }
}
