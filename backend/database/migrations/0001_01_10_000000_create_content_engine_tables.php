<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Polymorphic SEO metadata - replaces all seo_* columns on every table
        Schema::create('seo_metadata', function (Blueprint $table) {
            $table->id();
            $table->morphs('seoable'); // seoable_type, seoable_id + index
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('robots')->default('index,follow');
            $table->string('focus_keyword')->nullable();
            // OpenGraph
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->foreignId('og_image_id')->nullable()->constrained('media')->nullOnDelete();
            $table->string('og_type')->default('website');
            // Twitter
            $table->string('twitter_card')->default('summary_large_image');
            $table->string('twitter_title')->nullable();
            $table->text('twitter_description')->nullable();
            $table->foreignId('twitter_image_id')->nullable()->constrained('media')->nullOnDelete();
            // JSON-LD
            $table->json('schema_markup')->nullable();
            $table->timestamps();

            $table->unique(['seoable_type', 'seoable_id']);
        });

        // Polymorphic revision history - one table for all content types
        Schema::create('content_revisions', function (Blueprint $table) {
            $table->id();
            $table->morphs('revisable');
            $table->string('version');
            $table->string('comment')->nullable(); // Git-like message
            $table->json('snapshot');              // Full model state
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('created_at');

            $table->index(['revisable_type', 'revisable_id', 'version']);
        });

        // Polymorphic activity log - audit trail for any content
        Schema::create('content_activity_logs', function (Blueprint $table) {
            $table->id();
            $table->morphs('loggable');
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action');           // published, archived, updated, etc.
            $table->json('metadata')->nullable(); // Before/after diff, IP, etc.
            $table->timestamp('created_at');

            $table->index(['loggable_type', 'loggable_id']);
        });

        // Polymorphic slug history - enables automatic 301 redirects on slug change
        Schema::create('content_slug_history', function (Blueprint $table) {
            $table->id();
            $table->morphs('sluggable');
            $table->string('slug')->unique(); // Globally unique to prevent collisions
            $table->boolean('is_redirect')->default(true);
            $table->timestamps();

            $table->index('slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_slug_history');
        Schema::dropIfExists('content_activity_logs');
        Schema::dropIfExists('content_revisions');
        Schema::dropIfExists('seo_metadata');
    }
};
