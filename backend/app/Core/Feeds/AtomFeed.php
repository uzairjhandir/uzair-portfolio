<?php

namespace App\Core\Feeds;

class AtomFeed
{
    public function render(FeedProviderInterface $provider, array $items): string
    {
        $siteUrl = config('app.url');
        $now     = now()->toAtomString();

        $entries = collect($items)->map(function (array $entry) {
            return "<entry>"
                . "<title><![CDATA[{$entry['title']}]]></title>"
                . "<link href=\"{$entry['url']}\" />"
                . "<id>{$entry['guid'] ?? $entry['url']}</id>"
                . "<updated>{$entry['published_at']}</updated>"
                . "<summary type=\"html\"><![CDATA[{$entry['description']}]]></summary>"
                . "</entry>";
        })->implode("\n");

        return '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
            . '<feed xmlns="http://www.w3.org/2005/Atom">' . "\n"
            . "<title>{$provider->getFeedTitle()}</title>\n"
            . "<link href=\"{$siteUrl}\" />\n"
            . "<updated>{$now}</updated>\n"
            . "<id>{$siteUrl}/feed/{$provider->getFeedSlug()}</id>\n"
            . $entries . "\n"
            . '</feed>';
    }
}
