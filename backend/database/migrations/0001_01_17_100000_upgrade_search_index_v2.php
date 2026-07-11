<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Search Engine v2 Upgrade
 *
 * Additive migration — does not touch existing search_index rows.
 * Adds:
 *   • index_version    — allows zero-downtime index rebuilds (v1 → v2)
 *   • schema_version   — tracks structural changes to the document format
 *   • translation_group_uuid — groups translations of the same content
 *
 * Creates:
 *   • search_suggestions — powers autocomplete, recent, popular, trending
 *   • search_health      — operational metrics snapshot table
 */
return new class extends Migration
{
    public function up(): void
    {
        // ── Extend search_index ──────────────────────────────────────────────
        Schema::table('search_index', function (Blueprint $table) {
            // ✅ #1 Index Versioning
            $table->tinyInteger('index_version')->default(1)->after('boost');

            // ✅ #2 Schema Versioning (independent of index_version)
            // index_version = logical rebuild generation (scoring changed, re-rank)
            // schema_version = structural change to the document format itself
            $table->tinyInteger('schema_version')->default(1)->after('index_version');

            // ✅ #2 Multi-language grouping
            // Shared UUID across all locale variants of the same content
            $table->uuid('translation_group_uuid')->nullable()->after('locale');

            // Separate FULLTEXT indexes per field for weighted scoring in DatabaseSearchDriver
            // MATCH(title) × 10, MATCH(keywords) × 7, MATCH(summary) × 4, MATCH(content) × 1
            $table->fullText(['title'],    'search_ft_title');
            $table->fullText(['keywords'], 'search_ft_keywords');
            $table->fullText(['summary'],  'search_ft_summary');
            $table->fullText(['content'],  'search_ft_content');
        });

        // ── search_suggestions ───────────────────────────────────────────────
        // ✅ #6 Rich Suggestions — powers autocomplete, recent, popular, trending
        // GDPR: Only the query string is stored. No IP, no user_id, no session_id.
        Schema::create('search_suggestions', function (Blueprint $table) {
            $table->id();

            $table->string('query', 255);
            $table->string('locale', 10)->default('en');

            // Suggestion type: autocomplete | recent | popular | trending
            $table->string('type', 30)->default('autocomplete');

            // Analytics counters (no PII — aggregated counts only)
            $table->unsignedInteger('result_count')->default(0);   // Results returned
            $table->unsignedInteger('clicked_count')->default(0);  // Times a result was clicked
            $table->unsignedInteger('search_count')->default(1);   // Times this query was searched

            $table->timestamp('last_used_at')->useCurrent();
            $table->timestamps();

            // Unique per query+locale+type combination
            $table->unique(['query', 'locale', 'type']);
            $table->index(['type', 'locale', 'search_count']);
            $table->index(['type', 'locale', 'clicked_count']);
            $table->index(['last_used_at']);
        });

        // ── search_health ────────────────────────────────────────────────────
        // ✅ #11 Search Health Metrics — operational snapshot table
        Schema::create('search_health', function (Blueprint $table) {
            $table->id();

            $table->string('driver', 50)->default('database');
            $table->string('driver_version', 20)->nullable();  // e.g. Meilisearch 1.7.0

            // Index state counters
            $table->unsignedInteger('indexed_documents')->default(0);
            $table->unsignedInteger('pending_documents')->default(0);
            $table->unsignedInteger('failed_documents')->default(0);

            // Queue state
            $table->unsignedInteger('queue_backlog')->default(0);  // Jobs waiting in queue

            // Timing
            $table->decimal('average_query_time_ms', 8, 2)->default(0);

            // Last operation timestamps
            $table->timestamp('last_rebuild')->nullable();
            $table->timestamp('last_successful_index')->nullable();
            $table->timestamp('last_failed_index')->nullable();

            // When this snapshot was recorded
            $table->timestamp('recorded_at')->useCurrent();
            $table->timestamps();

            $table->index(['driver', 'recorded_at']);
        });
    }

    public function down(): void
    {
        Schema::table('search_index', function (Blueprint $table) {
            $table->dropFullText('search_ft_title');
            $table->dropFullText('search_ft_keywords');
            $table->dropFullText('search_ft_summary');
            $table->dropFullText('search_ft_content');
            $table->dropColumn(['index_version', 'schema_version', 'translation_group_uuid']);
        });

        Schema::dropIfExists('search_suggestions');
        Schema::dropIfExists('search_health');
    }
};
