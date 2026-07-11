<?php

namespace App\Modules\Seo\Contracts;

/**
 * SitemapEntry — Value Object
 *
 * Represents a single URL entry in an XML sitemap.
 * Produced by SitemapSourceInterface::buildEntries().
 */
final class SitemapEntry
{
    public function __construct(
        public readonly string  $loc,
        public readonly string  $lastmod,          // ISO 8601: 2025-07-11
        public readonly string  $changefreq,       // daily | weekly | monthly…
        public readonly float   $priority,         // 0.1 – 1.0
        public readonly ?string $image     = null, // Optional: image URL for image sitemap (future)
        public readonly ?string $news      = null, // Optional: news metadata (future)
    ) {}

    public static function make(
        string  $loc,
        string  $lastmod,
        string  $changefreq = 'weekly',
        float   $priority   = 0.6,
        ?string $image      = null,
    ): self {
        return new self($loc, $lastmod, $changefreq, $priority, $image);
    }

    public function toXml(): string
    {
        $xml = "  <url>\n";
        $xml .= "    <loc>" . htmlspecialchars($this->loc, ENT_XML1) . "</loc>\n";
        $xml .= "    <lastmod>{$this->lastmod}</lastmod>\n";
        $xml .= "    <changefreq>{$this->changefreq}</changefreq>\n";
        $xml .= "    <priority>{$this->priority}</priority>\n";

        if ($this->image) {
            $xml .= "    <image:image>\n";
            $xml .= "      <image:loc>" . htmlspecialchars($this->image, ENT_XML1) . "</image:loc>\n";
            $xml .= "    </image:image>\n";
        }

        $xml .= "  </url>\n";

        return $xml;
    }
}
