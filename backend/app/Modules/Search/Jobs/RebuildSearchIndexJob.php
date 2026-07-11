<?php

namespace App\Modules\Search\Jobs;

use App\Modules\Search\SearchManager;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Throwable;

/**
 * Queue a full search index rebuild.
 *
 * This job is dispatched by SearchController::rebuild() instead of
 * calling SearchManager::rebuild() synchronously, which would time
 * out on large datasets.
 *
 * The rebuild process:
 *   1. Flush the old index (for the target index_version)
 *   2. Discover all registered searchable models via module.json
 *   3. Re-index every record via the active driver
 *
 * A new index_version can be passed to perform a zero-downtime rebuild:
 *   - Old version remains queryable while new version builds
 *   - SearchManager switches to new version atomically after completion
 */
class RebuildSearchIndexJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Rebuilds can take a long time on large datasets.
     * No automatic retry — a failed rebuild should be investigated manually.
     */
    public int $tries   = 1;
    public int $timeout = 3600; // 1 hour maximum

    public function __construct(
        private readonly ?string $type = null,        // null = rebuild everything
        private readonly int $targetVersion = 1,      // index_version to write
        private readonly bool $flushFirst = true      // flush before rebuilding
    ) {}

    public function handle(SearchManager $search): void
    {
        $startedAt = now();

        try {
            if ($this->flushFirst) {
                $search->flush($this->type);
            }

            // Rebuild via SearchManager — it knows which models to iterate
            $search->rebuild($this->type, $this->targetVersion);

            // Record successful rebuild in health table
            DB::table('search_health')->insert([
                'driver'                => config('search.default', 'database'),
                'indexed_documents'     => DB::table('search_index')->count(),
                'pending_documents'     => 0,
                'failed_documents'      => 0,
                'last_rebuild'          => now(),
                'last_successful_index' => now(),
                'average_query_time_ms' => 0,
                'recorded_at'           => now(),
                'created_at'            => now(),
                'updated_at'            => now(),
            ]);

            logger()->info('SearchIndex: full rebuild completed', [
                'type'          => $this->type ?? 'all',
                'version'       => $this->targetVersion,
                'duration_ms'   => now()->diffInMilliseconds($startedAt),
            ]);
        } catch (Throwable $e) {
            DB::table('search_health')->insert([
                'driver'              => config('search.default', 'database'),
                'failed_documents'    => 1,
                'last_failed_index'   => now(),
                'recorded_at'         => now(),
                'created_at'          => now(),
                'updated_at'          => now(),
            ]);

            throw $e;
        }
    }

    public function failed(Throwable $exception): void
    {
        logger()->error('SearchIndex: rebuild job failed', [
            'type'  => $this->type ?? 'all',
            'error' => $exception->getMessage(),
        ]);
    }
}
