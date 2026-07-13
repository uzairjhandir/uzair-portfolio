<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add content engine extensions to the pages table as a reference model.
     * Blog, Portfolio, CaseStudy tables will include these columns from the start.
     */
    public function up(): void
    {
        // Add content locking to pages (reference for all future content tables).
        // Not guarded with Schema::hasColumn(): on this stack's SQLite/PHP combo,
        // Schema::table() recreates the whole table when a constrained() column
        // is queued, and that recreate path ignores the hasColumn() guard,
        // causing "duplicate column name" on every fresh install. None of these
        // columns are added anywhere else on `pages`.
        Schema::table('pages', function (Blueprint $table) {
            $table->foreignId('checked_out_by')->nullable()->constrained('users')->nullOnDelete()->after('locked_at');
            $table->timestamp('checked_out_at')->nullable()->after('checked_out_by');
            $table->string('lock_reason')->nullable()->after('checked_out_at');
            $table->string('lock_token')->nullable()->after('lock_reason');
            $table->timestamp('heartbeat_at')->nullable()->after('lock_token');
            $table->string('workflow_status')->nullable()->after('status');
        });

        // Add content_search_index for DatabaseSearchDriver
        Schema::create('content_search_index', function (Blueprint $table) {
            $table->id();
            $table->morphs('searchable');
            $table->string('title')->nullable();
            $table->text('body')->nullable();
            $table->json('tags')->nullable();
            $table->string('locale')->default('en');
            $table->boolean('is_indexed')->default(false);
            $table->timestamp('indexed_at')->nullable();
            $table->timestamps();
            // Note: morphs('searchable') already creates the index on searchable_type + searchable_id
            // Note: fullText removed — not supported by SQLite; use MySQL/MariaDB on production
        });

        // Polymorphic media collections table (used by HasContentMedia)
        Schema::create('content_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('media_id')->constrained('media')->cascadeOnDelete();
            $table->morphs('mediable');
            $table->string('collection')->default('featured'); // featured, gallery, attachments
            $table->integer('sort_order')->default(0);

            $table->unique(['media_id', 'mediable_type', 'mediable_id', 'collection'], 'content_media_unique');
        });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropForeign(['checked_out_by']);
            $table->dropColumn(['checked_out_by', 'checked_out_at', 'workflow_status']);
        });
        Schema::dropIfExists('content_media');
        Schema::dropIfExists('content_search_index');
    }
};
