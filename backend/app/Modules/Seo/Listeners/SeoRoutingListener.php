<?php

namespace App\Modules\Seo\Listeners;

use App\Events\ContentPublished;
use App\Events\ContentArchived;
use App\Modules\Seo\Jobs\GenerateSitemapJob;

/**
 * SEO Routing Listener
 *
 * Wired to domain events from the Content Engine.
 * Dispatches sitemap regeneration jobs when content changes.
 *
 * Events handled:
 *   ContentPublished  → regenerate the affected sitemap section
 *   ContentArchived   → regenerate the affected sitemap section
 *
 * Slug-change → Redirect creation is handled directly in HasContentSlug
 * via CreateRedirectFromSlugJob (not here) to keep the slug pipeline tight.
 */
class SeoRoutingListener
{
    public function handlePublished(ContentPublished $event): void
    {
        $section = $this->resolveSection($event->content);
        GenerateSitemapJob::dispatch($section)->onQueue('seo');
    }

    public function handleArchived(ContentArchived $event): void
    {
        $section = $this->resolveSection($event->content);
        GenerateSitemapJob::dispatch($section)->onQueue('seo');
    }

    /**
     * Map a model class to its sitemap section identifier.
     * Add new content types here when new modules are added.
     */
    private function resolveSection(object $model): string
    {
        return match (class_basename($model)) {
            'Blog'      => 'blog',
            'Portfolio' => 'portfolio',
            'CaseStudy' => 'case-studies',
            'Download'  => 'downloads',
            'Page'      => 'pages',
            default     => 'pages',
        };
    }
}
