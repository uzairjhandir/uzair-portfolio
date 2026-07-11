<?php

namespace App\Modules\Blog;

/**
 * Blog-specific business logic only.
 * RSS is handled by Core/Feeds (BlogFeedProvider).
 * Publishing, SEO, revisions, and search are in Core services.
 */
class BlogService
{
    public function calculateReadingTime(string $content): int
    {
        $wordCount = str_word_count(strip_tags($content));
        return (int) ceil($wordCount / 200);
    }
}
