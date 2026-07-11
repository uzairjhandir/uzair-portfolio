<?php

namespace App\Modules\Seo\Schema\Types;

/**
 * Breadcrumb Schema — Universal
 *
 * BreadcrumbList is auto-built from the URL path.
 * Applied to: any model with a URL (every content type).
 *
 * Note: This schema is ALWAYS injected alongside the primary schema.
 * SchemaBuilder returns an array of schemas — one is the type schema,
 * one is the BreadcrumbList. Frontend injects both.
 *
 * Example for /blog/laravel-tips:
 * {
 *   "@context": "https://schema.org",
 *   "@type": "BreadcrumbList",
 *   "itemListElement": [
 *     { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://domain.com/" },
 *     { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://domain.com/blog" },
 *     { "@type": "ListItem", "position": 3, "name": "Laravel Tips", "item": "https://domain.com/blog/laravel-tips" }
 *   ]
 * }
 */
class BreadcrumbSchema extends AbstractSchema
{
    public function type(): string { return 'BreadcrumbList'; }

    public function supports(object $model): bool
    {
        return !empty($model->slug);
    }

    public function build(object $model, array $context = []): array
    {
        $url      = $this->modelUrl($model);
        $baseUrl  = rtrim(config('app.url'), '/');
        $path     = str_replace($baseUrl, '', $url);
        $segments = array_filter(explode('/', trim($path, '/')));

        $items    = [];
        $current  = $baseUrl;
        $position = 1;

        // Always start with Home
        $items[] = [
            '@type'    => 'ListItem',
            'position' => $position++,
            'name'     => 'Home',
            'item'     => $baseUrl . '/',
        ];

        $slugParts = array_values($segments);
        $total     = count($slugParts);

        foreach ($slugParts as $i => $segment) {
            $current .= '/' . $segment;
            $isLast   = ($i === $total - 1);

            $items[] = [
                '@type'    => 'ListItem',
                'position' => $position++,
                'name'     => $isLast
                              ? ($model->title ?? ucfirst(str_replace('-', ' ', $segment)))
                              : ucfirst(str_replace('-', ' ', $segment)),
                'item'     => $current,
            ];
        }

        return $this->wrap('BreadcrumbList', ['itemListElement' => $items]);
    }
}
