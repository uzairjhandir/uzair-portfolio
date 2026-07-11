<?php

namespace App\Modules\Seo\Schema\Types;

/**
 * Project Schema — Portfolio items
 *
 * Uses schema.org/CreativeWork as the closest standard type for software projects.
 * Applied to: Portfolio model
 */
class ProjectSchema extends AbstractSchema
{
    public function type(): string { return 'CreativeWork'; }

    public function supports(object $model): bool
    {
        return $model instanceof \App\Modules\Portfolio\Portfolio;
    }

    public function build(object $model, array $context = []): array
    {
        $seo = $this->loadSeo($model);

        $schema = [
            'name'        => $seo?->title ?? $model->title ?? '',
            'description' => $seo?->description ?? $model->excerpt ?? '',
            'url'         => $this->modelUrl($model),
            'creator'     => $this->organizationStub(),
        ];

        if ($imageUrl = $this->imageUrl($model)) {
            $schema['image'] = $imageUrl;
        }

        if (!empty($model->updated_at)) {
            $schema['dateModified'] = $model->updated_at->toDateString();
        }

        // Technologies from metadata JSON (if stored)
        if (!empty($model->technologies) && is_array($model->technologies)) {
            $schema['keywords'] = implode(', ', $model->technologies);
        }

        return $this->wrap('CreativeWork', $schema);
    }
}
