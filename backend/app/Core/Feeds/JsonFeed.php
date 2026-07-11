<?php

namespace App\Core\Feeds;

class JsonFeed
{
    public function render(FeedProviderInterface $provider, array $items): string
    {
        $siteUrl = config('app.url');

        $payload = [
            'version'     => 'https://jsonfeed.org/version/1.1',
            'title'       => $provider->getFeedTitle(),
            'description' => $provider->getFeedDescription(),
            'home_page_url' => $siteUrl,
            'feed_url'    => "{$siteUrl}/api/v1/feed/{$provider->getFeedSlug()}.json",
            'items'       => collect($items)->map(fn($e) => [
                'id'             => $e['guid'] ?? $e['url'],
                'url'            => $e['url'],
                'title'          => $e['title'],
                'summary'        => $e['description'],
                'date_published' => $e['published_at'],
                'author'         => ['name' => $e['author'] ?? ''],
            ])->toArray(),
        ];

        return json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }
}
