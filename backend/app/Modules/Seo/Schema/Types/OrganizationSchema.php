<?php

namespace App\Modules\Seo\Schema\Types;

/**
 * Organization Schema — Company/Agency pages
 *
 * Applied to: Pages with schema_type = 'Organization' in seo_metadata
 */
class OrganizationSchema extends AbstractSchema
{
    public function type(): string { return 'Organization'; }

    public function supports(object $model): bool
    {
        $seo = $this->loadSeo($model);
        return $seo?->schema_type === 'Organization';
    }

    public function build(object $model, array $context = []): array
    {
        return $this->wrap('Organization', [
            'name'  => config('app.name'),
            'url'   => config('app.url'),
            'logo'  => config('app.url') . '/logo.png',
        ]);
    }
}
