<?php

namespace App\Modules\Search;

use App\Modules\Search\Contracts\SearchDriverInterface;
use App\Modules\Search\Contracts\SearchableResource;
use App\Modules\Search\Contracts\SearchProviderInterface;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Manager;

/**
 * Search Manager
 *
 * Central orchestrator for the search subsystem.
 *
 * Responsibilities:
 *   1. Driver resolution via Laravel Manager pattern (Database / Meilisearch / Elastic / Null)
 *   2. Provider aggregation — merges Indexed + Live providers into a unified response
 *   3. Module auto-discovery — reads module.json files to find searchable modules
 *   4. Health metrics — collects and returns operational search statistics
 *   5. Capability delegation — proxies supportsX() flags to the active driver
 *
 * The application never needs to know which driver is active.
 * It only talks to SearchManager.
 */
class SearchManager extends Manager implements SearchDriverInterface
{
    /** @var SearchProviderInterface[] */
    private array $providers = [];

    // ── Driver Resolution ────────────────────────────────────────────────────

    public function getDefaultDriver(): string
    {
        return $this->config->get('search.default', 'database');
    }

    public function createDatabaseDriver(): Drivers\DatabaseSearchDriver
    {
        return new Drivers\DatabaseSearchDriver();
    }

    public function createMeilisearchDriver(): Drivers\MeilisearchDriver
    {
        return new Drivers\MeilisearchDriver();
    }

    public function createElasticDriver(): Drivers\ElasticDriver
    {
        return new Drivers\ElasticDriver();
    }

    public function createNullDriver(): Drivers\NullSearchDriver
    {
        return new Drivers\NullSearchDriver();
    }

    // ── Provider Registration ────────────────────────────────────────────────

    /**
     * Register a search provider.
     * Called from SearchServiceProvider::boot() for each known provider.
     */
    public function registerProvider(SearchProviderInterface $provider): void
    {
        $this->providers[$provider->identifier()] = $provider;
    }

    /**
     * Retrieve all registered providers.
     *
     * @return SearchProviderInterface[]
     */
    public function providers(): array
    {
        return $this->providers;
    }

    /**
     * Retrieve providers filtered by visibility/auth context.
     *
     * @return SearchProviderInterface[]
     */
    public function publicProviders(): array
    {
        return array_filter($this->providers, fn($p) => !$p->requiresAdmin());
    }

    /**
     * Retrieve all providers (admin has access to everything).
     *
     * @return SearchProviderInterface[]
     */
    public function adminProviders(): array
    {
        return $this->providers;
    }

    // ── Module Auto-Discovery ────────────────────────────────────────────────

    /**
     * Scan all module.json files and return an array of modules
     * that have declared search metadata.
     *
     * module.json format:
     * {
     *   "search": {
     *     "enabled": true,
     *     "provider": "content",
     *     "type": "blog",
     *     "visibility": "public",
     *     "boost": 40,
     *     "index_version": 1
     *   }
     * }
     *
     * SearchManager uses this to know which modules participate in search
     * without manual registration.
     */
    public function discoverModules(): array
    {
        $modulesPath = app_path('Modules');
        $discovered  = [];

        if (!File::isDirectory($modulesPath)) {
            return $discovered;
        }

        foreach (File::directories($modulesPath) as $moduleDir) {
            $manifestPath = $moduleDir . '/module.json';

            if (!File::exists($manifestPath)) {
                continue;
            }

            $manifest = json_decode(File::get($manifestPath), true);

            if (empty($manifest['search']['enabled'])) {
                continue;
            }

            $discovered[] = [
                'name'          => $manifest['name'] ?? basename($moduleDir),
                'namespace'     => $manifest['namespace'] ?? null,
                'search'        => $manifest['search'],
            ];
        }

        return $discovered;
    }

    // ── Search (Aggregated Provider Results) ─────────────────────────────────

    /**
     * Execute search across all registered providers and merge into a single SearchResult.
     *
     * Providers return SearchResult objects which are merged via SearchResult::merge().
     * Items are sorted by score descending after merging.
     *
     * @param  SearchQuery  $query       Immutable query value object
     * @param  bool         $adminMode   Whether to include admin-only live providers
     */
    public function searchAcrossProviders(SearchQuery $query, bool $adminMode = false): SearchResult
    {
        $providers = $adminMode ? $this->adminProviders() : $this->publicProviders();

        $merged = SearchResult::empty($query);

        foreach ($providers as $provider) {
            $result = $provider->search($query);
            $merged = $merged->merge($result);
        }

        // Sort merged items by score descending
        $items = $merged->getItems();
        usort($items, fn($a, $b) => ($b['score'] ?? 0) <=> ($a['score'] ?? 0));

        return $merged
            ->withItems(array_slice($items, 0, $query->getPerPage()))
            ->withCapabilities($this->capabilities());
    }

    // ── SearchDriverInterface Delegation ─────────────────────────────────────
    // These methods delegate to the active driver for single-driver operations
    // (used internally by ContentSearchProvider and rebuild jobs).

    public function index(SearchableResource $resource): void
    {
        $this->driver()->index($resource);
    }

    public function update(SearchableResource $resource): void
    {
        $this->driver()->update($resource);
    }

    public function remove(SearchableResource $resource): void
    {
        $this->driver()->remove($resource);
    }

    public function search(SearchQuery $query): SearchResult
    {
        return $this->driver()->search($query);
    }

    public function calculateScore(SearchQuery $query, array $document): float
    {
        return $this->driver()->calculateScore($query, $document);
    }

    public function suggest(SearchQuery $query, string $mode = 'autocomplete'): array
    {
        return $this->driver()->suggest($query, $mode);
    }

    public function related(SearchableResource $resource, int $limit = 5): array
    {
        return $this->driver()->related($resource, $limit);
    }

    public function rebuild(?string $type = null, int $targetVersion = 1): void
    {
        $this->driver()->rebuild();
    }

    public function flush(?string $type = null): void
    {
        $this->driver()->flush($type);
    }

    // ── Capability Flags ─────────────────────────────────────────────────────

    public function supportsHighlighting(): bool { return $this->driver()->supportsHighlighting(); }
    public function supportsFacets(): bool       { return $this->driver()->supportsFacets(); }
    public function supportsGeoSearch(): bool    { return $this->driver()->supportsGeoSearch(); }
    public function supportsSuggestions(): bool  { return $this->driver()->supportsSuggestions(); }
    public function supportsVectorSearch(): bool { return $this->driver()->supportsVectorSearch(); }
    public function supportsSynonyms(): bool     { return $this->driver()->supportsSynonyms(); }

    /**
     * Return all driver capabilities as a named array.
     * Useful for the admin health dashboard.
     */
    public function capabilities(): array
    {
        return [
            'highlighting'   => $this->supportsHighlighting(),
            'facets'         => $this->supportsFacets(),
            'geo_search'     => $this->supportsGeoSearch(),
            'suggestions'    => $this->supportsSuggestions(),
            'vector_search'  => $this->supportsVectorSearch(),
            'synonyms'       => $this->supportsSynonyms(),
        ];
    }

    // ── Health Metrics ────────────────────────────────────────────────────────

    /**
     * Return the latest search health snapshot.
     * Module 19 Dashboard consumes this for the search health widget.
     */
    public function health(): array
    {
        $snapshot = \Illuminate\Support\Facades\DB::table('search_health')
            ->orderByDesc('recorded_at')
            ->first();

        $queueBacklog = \Illuminate\Support\Facades\DB::table('jobs')
            ->where('queue', 'search')
            ->count();

        return [
            'driver'                => config('search.default', 'database'),
            'driver_version'        => $snapshot?->driver_version,
            'index_version'         => config('search.index_version', 1),
            'schema_version'        => config('search.schema_version', 1),
            'indexed_documents'     => \Illuminate\Support\Facades\DB::table('search_index')->count(),
            'pending_documents'     => $snapshot?->pending_documents ?? 0,
            'failed_documents'      => $snapshot?->failed_documents ?? 0,
            'queue_backlog'         => $queueBacklog,
            'last_rebuild'          => $snapshot?->last_rebuild,
            'last_successful_index' => $snapshot?->last_successful_index,
            'last_failed_index'     => $snapshot?->last_failed_index,
            'average_query_time_ms' => $snapshot?->average_query_time_ms ?? 0,
            'capabilities'          => $this->capabilities(),
        ];
    }
}
