<?php

namespace App\Modules\Blog;

use App\Core\Feeds\FeedProviderInterface;
use Illuminate\Database\Eloquent\Collection;

/**
 * Registers the Blog module with the Core Feed system.
 * Bind in AppServiceProvider: app(FeedManager::class)->register(new BlogFeedProvider());
 */
class BlogFeedProvider implements FeedProviderInterface
{
    public function getFeedTitle(): string
    {
        return config('app.name') . ' — Blog';
    }

    public function getFeedSlug(): string
    {
        return 'blog';
    }

    public function getFeedDescription(): string
    {
        return 'Latest articles and insights';
    }

    public function getFeedItems(): Collection
    {
        return Blog::where('status', 'published')
            ->orderByDesc('publish_at')
            ->limit(20)
            ->with(['author', 'seo'])
            ->get();
    }

    public function toFeedEntry(mixed $item): array
    {
        return [
            'title'        => $item->title,
            'url'          => url("/blog/{$item->slug}"),
            'guid'         => url("/blog/{$item->slug}"),
            'description'  => $item->excerpt ?? $item->getSeoDescription() ?? '',
            'published_at' => $item->publish_at?->toRfc2822() ?? now()->toRfc2822(),
            'author'       => $item->author?->name ?? '',
        ];
    }
}
