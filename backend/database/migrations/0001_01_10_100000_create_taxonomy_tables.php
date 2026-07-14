<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Master taxonomy registry (Category, Tag, Technology, Industry, etc.)
        Schema::create('taxonomies', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_hierarchical')->default(false); // e.g. Category = yes, Tag = no
            $table->boolean('is_required')->default(false);     // Force every Blog to have a Category
            $table->json('allowed_content_types')->nullable();  // e.g. ['blog', 'portfolio']
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Individual terms (e.g. "Laravel", "React", "Design")
        Schema::create('taxonomy_terms', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('taxonomy_id')->constrained('taxonomies')->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('taxonomy_terms')->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->foreignId('featured_image_id')->nullable()->constrained('media')->nullOnDelete();
            $table->string('color')->nullable();
            $table->string('icon')->nullable();
            $table->integer('sort_order')->default(0);
            $table->string('status')->default('active'); // active, archived
            $table->foreignId('seo_metadata_id')->nullable()->constrained('seo_metadata')->nullOnDelete();
            $table->json('metadata')->nullable();         // Arbitrary extension data (e.g. hero_text, cta_url)
            $table->integer('count')->default(0);         // Cached usage count
            $table->timestamps();

            $table->index(['taxonomy_id', 'slug']);
        });

        // Polymorphic pivot — attaches any term to any content model
        Schema::create('taxonomy_termables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('taxonomy_term_id')->constrained('taxonomy_terms')->cascadeOnDelete();
            $table->morphs('termable'); // termable_type, termable_id
            $table->integer('sort_order')->default(0);

            // Explicit short name: Laravel's auto-generated name for this column
            // combination is 71 chars, over MySQL/MariaDB's 64-char identifier
            // limit - silently fine on SQLite (no such limit), fails on MySQL.
            $table->unique(['taxonomy_term_id', 'termable_type', 'termable_id'], 'taxonomy_termables_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('taxonomy_termables');
        Schema::dropIfExists('taxonomy_terms');
        Schema::dropIfExists('taxonomies');
    }
};
