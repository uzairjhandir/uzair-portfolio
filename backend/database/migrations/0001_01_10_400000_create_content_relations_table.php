<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /**
         * Generic content-to-content relationship graph.
         * Replaces all pairwise hardcoded FKs between modules.
         *
         * Examples:
         *   Blog      → related_to  → Portfolio (weight: 1.0)
         *   Portfolio → tells_story → CaseStudy  (weight: 1.0)
         *   CaseStudy → references  → Blog
         *   Blog      → related_to  → Blog
         */
        Schema::create('content_relations', function (Blueprint $table) {
            $table->id();
            $table->morphs('from_content');        // from_content_type, from_content_id
            $table->morphs('to_content');          // to_content_type, to_content_id
            $table->enum('relation', [
                'related', 'references', 'primary_of', 'child_of',
                'derived_from', 'alternative', 'successor', 'predecessor',
            ])->default('related');
            $table->float('weight')->default(1.0);  // for ranking related content
            $table->boolean('is_bidirectional')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(
                ['from_content_type', 'from_content_id', 'to_content_type', 'to_content_id', 'relation'],
                'content_relations_unique'
            );
            // Explicit short name: the auto-generated name (66 chars) exceeds
            // MySQL/MariaDB's 64-char identifier limit; fine on SQLite.
            $table->index(['from_content_type', 'from_content_id', 'relation'], 'content_relations_from_lookup');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_relations');
    }
};
