<?php

namespace App\Core\Feeds;

/**
 * Manages all registered feed providers.
 * Bind in AppServiceProvider. Modules register themselves here.
 *
 * Usage in AppServiceProvider:
 *   app(FeedManager::class)->register(new BlogFeedProvider());
 */
class FeedManager
{
    private array $providers = [];

    public function register(FeedProviderInterface $provider): void
    {
        $this->providers[$provider->getFeedSlug()] = $provider;
    }

    public function get(string $slug): FeedProviderInterface
    {
        if (!isset($this->providers[$slug])) {
            abort(404, "Feed '{$slug}' not found.");
        }
        return $this->providers[$slug];
    }

    public function all(): array
    {
        return $this->providers;
    }

    public function render(string $slug, string $format = 'rss'): string
    {
        $provider = $this->get($slug);
        $items    = $provider->getFeedItems()->map(fn($item) => $provider->toFeedEntry($item))->toArray();

        return match ($format) {
            'atom' => (new AtomFeed())->render($provider, $items),
            'json' => (new JsonFeed())->render($provider, $items),
            default => (new RssFeed())->render($provider, $items),
        };
    }
}
