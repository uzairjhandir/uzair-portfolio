<?php

namespace App\Core\Feeds;

class RssFeed
{
    public function render(FeedProviderInterface $provider, array $items): string
    {
        $siteUrl = config('app.url');
        $feedUrl = "{$siteUrl}/api/v1/feed/{$provider->getFeedSlug()}.xml";

        $itemsXml = collect($items)->map(function (array $entry) use ($siteUrl) {
            return "<item>"
                . "<title><![CDATA[{$entry['title']}]]></title>"
                . "<link>{$entry['url']}</link>"
                . "<guid isPermaLink=\"true\">{$entry['guid'] ?? $entry['url']}</guid>"
                . "<description><![CDATA[{$entry['description']}]]></description>"
                . "<pubDate>{$entry['published_at']}</pubDate>"
                . (!empty($entry['author']) ? "<author>{$entry['author']}</author>" : '')
                . "</item>";
        })->implode("\n");

        return '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
            . '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">' . "\n"
            . '<channel>' . "\n"
            . "<title><![CDATA[{$provider->getFeedTitle()}]]></title>\n"
            . "<link>{$siteUrl}</link>\n"
            . "<description>{$provider->getFeedDescription()}</description>\n"
            . "<atom:link href=\"{$feedUrl}\" rel=\"self\" type=\"application/rss+xml\" />\n"
            . $itemsXml . "\n"
            . '</channel>' . "\n"
            . '</rss>';
    }
}
