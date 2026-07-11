<?php

namespace App\Modules\Seo\Sitemap;

use App\Modules\Seo\Contracts\SitemapEntry;
use App\Modules\Seo\Contracts\SitemapSourceInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Sitemap Engine
 *
 * Orchestrates multi-section sitemap generation and file writing.
 *
 * Storage strategy: physical XML files in storage/app/sitemaps/
 *   - Fast to serve (static files, CDN-cacheable)
 *   - No Redis dependency
 *   - Next.js/Vercel can proxy these directly
 *
 * SeoServiceProvider registers all SitemapSource implementations.
 * SitemapEngine iterates them to build/rebuild sections.
 *
 * Usage:
 *   $engine->generate();                   // all sections
 *   $engine->generate('blog');             // single section
 *   $engine->generateIndex();              // rebuild sitemap-index.xml
 */
class SitemapEngine
{
    /** @var SitemapSourceInterface[] */
    private array $sources = [];

    private const DISK      = 'local';
    private const DIRECTORY = 'sitemaps';

    // ── Source Registration ───────────────────────────────────────────────────

    public function registerSource(SitemapSourceInterface $source): void
    {
        $this->sources[$source->section()] = $source;
    }

    /** @return SitemapSourceInterface[] */
    public function sources(): array
    {
        return $this->sources;
    }

    // ── Generation ────────────────────────────────────────────────────────────

    /**
     * Generate one or all sitemap sections.
     * Writes XML files to storage/app/sitemaps/ and updates sitemap_entries table.
     * Then regenerates the sitemap-index.xml.
     *
     * @param  string|null  $section  null = regenerate all enabled sources
     */
    public function generate(?string $section = null): void
    {
        $sources = $section
            ? array_filter($this->sources, fn($s) => $s->section() === $section)
            : array_filter($this->sources, fn($s) => $s->isEnabled());

        foreach ($sources as $source) {
            $this->generateSection($source);
        }

        $this->generateIndex();
    }

    private function generateSection(SitemapSourceInterface $source): void
    {
        $urlCount = 0;
        $xml      = $this->openUrlset();

        foreach ($source->buildEntries() as $entry) {
            /** @var SitemapEntry $entry */
            $xml .= $entry->toXml();
            $urlCount++;
        }

        $xml .= "</urlset>\n";

        $filename = "sitemap-{$source->section()}.xml";
        Storage::disk(self::DISK)->put(self::DIRECTORY . '/' . $filename, $xml);

        $publicUrl = config('app.url') . '/' . $filename;

        DB::table('sitemap_entries')->updateOrInsert(
            ['section' => $source->section()],
            [
                'label'        => $source->label(),
                'file_path'    => storage_path('app/' . self::DIRECTORY . '/' . $filename),
                'public_url'   => $publicUrl,
                'url_count'    => $urlCount,
                'generated_at' => now(),
                'updated_at'   => now(),
                'created_at'   => now(),
            ]
        );
    }

    /**
     * Generate the sitemap-index.xml referencing all section sitemaps.
     * Also updates sitemap.xml to be an alias or redirect to the index.
     */
    public function generateIndex(): void
    {
        $entries = DB::table('sitemap_entries')
            ->whereNotNull('generated_at')
            ->orderBy('section')
            ->get();

        $xml  = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
        $xml .= "<sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";

        foreach ($entries as $entry) {
            $xml .= "  <sitemap>\n";
            $xml .= "    <loc>" . htmlspecialchars($entry->public_url, ENT_XML1) . "</loc>\n";
            $xml .= "    <lastmod>" . now($entry->generated_at)->toDateString() . "</lastmod>\n";
            $xml .= "  </sitemap>\n";
        }

        $xml .= "</sitemapindex>\n";

        Storage::disk(self::DISK)->put(self::DIRECTORY . '/sitemap-index.xml', $xml);

        // sitemap.xml is a copy of the index for backwards compatibility
        Storage::disk(self::DISK)->put(self::DIRECTORY . '/sitemap.xml', $xml);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function openUrlset(): string
    {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
            . "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"\n"
            . "        xmlns:image=\"http://www.google.com/schemas/sitemap-image/1.1\">\n";
    }

    /**
     * Return the absolute filesystem path for a section file.
     * Used by SitemapController to serve files.
     */
    public function filePath(string $filename): string
    {
        return storage_path('app/' . self::DIRECTORY . '/' . $filename);
    }

    /**
     * Whether a section's sitemap file currently exists on disk.
     */
    public function exists(string $filename): bool
    {
        return Storage::disk(self::DISK)->exists(self::DIRECTORY . '/' . $filename);
    }
}
