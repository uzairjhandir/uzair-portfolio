<?php

namespace App\Core\Feeds;

use Illuminate\Database\Eloquent\Collection;

/**
 * Contract for any module that wants to expose a feed.
 * Blog, Portfolio, News — implement this interface and register with FeedManager.
 */
interface FeedProviderInterface
{
    /** Human-readable feed title */
    public function getFeedTitle(): string;

    /** Unique slug used in URL: /feed/{slug}.xml */
    public function getFeedSlug(): string;

    /** Feed description */
    public function getFeedDescription(): string;

    /**
     * Returns the published items to include in the feed.
     * Limit to a sensible maximum (e.g. 20).
     */
    public function getFeedItems(): Collection;

    /**
     * Maps a single model to a feed-agnostic entry array.
     * Keys: title, url, description, published_at, author, guid
     */
    public function toFeedEntry(mixed $item): array;
}
