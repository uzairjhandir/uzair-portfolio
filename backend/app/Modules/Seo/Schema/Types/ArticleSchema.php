<?php

namespace App\Modules\Seo\Schema\Types;

use Illuminate\Database\Eloquent\Model;

/**
 * Article Schema — Blog Posts, Case Studies
 *
 * JSON-LD type: Article (or BlogPosting — both are valid)
 * Applied to: Blog, CaseStudy
 *
 * Output:
 * {
 *   "@context": "https://schema.org",
 *   "@type": "Article",
 *   "headline": "...",
 *   "description": "...",
 *   "image": "...",
 *   "author": { "@type": "Person", "name": "..." },
 *   "publisher": { "@type": "Organization", ... },
 *   "datePublished": "2025-07-11",
 *   "dateModified": "2025-07-11",
 *   "url": "https://..."
 * }
 */
class ArticleSchema extends AbstractSchema
{
    public function type(): string { return 'Article'; }

    public function supports(object $model): bool
    {
        return $model instanceof \App\Modules\Blog\Blog
            || $model instanceof \App\Modules\CaseStudy\CaseStudy;
    }

    public function build(object $model, array $context = []): array
    {
        $seo        = $this->loadSeo($model);
        $authorName = $this->authorName($model->author_id ?? null);

        $schema = [
            'headline'      => $seo?->title ?? $model->title ?? '',
            'description'   => $seo?->description ?? $model->excerpt ?? '',
            'url'           => $this->modelUrl($model),
            'datePublished' => $model->publish_at
                                ? \Carbon\Carbon::parse($model->publish_at)->toDateString()
                                : $model->created_at?->toDateString(),
            'dateModified'  => $model->updated_at?->toDateString(),
            'publisher'     => $this->organizationStub(),
        ];

        if ($imageUrl = $this->imageUrl($model)) {
            $schema['image'] = $imageUrl;
        }

        if ($authorName) {
            $schema['author'] = ['@type' => 'Person', 'name' => $authorName];
        }

        if (!empty($model->reading_time)) {
            $schema['timeRequired'] = 'PT' . $model->reading_time . 'M';
        }

        return $this->wrap('Article', $schema);
    }
}
