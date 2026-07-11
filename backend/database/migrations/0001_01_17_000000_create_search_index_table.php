<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Unified Search Index ─────────────────────────────────────────────
        Schema::create('search_index', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique(); // Re-used for API references to search items
            
            // Polymorphic link to the original model
            $table->string('searchable_type');
            $table->unsignedBigInteger('searchable_id');
            $table->string('searchable_uuid')->nullable();
            
            // Core Searchable Fields
            $table->string('module');        // The module that owns this (e.g., 'Blog')
            $table->string('type');          // The specific type (e.g., 'blog_post')
            $table->string('locale')->default('en');
            $table->string('title');
            $table->text('summary')->nullable();
            $table->longText('content')->nullable();
            $table->text('keywords')->nullable(); // CSV or extracted keywords
            $table->string('url')->nullable();    // Frontend URL
            $table->string('image')->nullable();  // Preview image URL
            
            // State & Visibility
            $table->string('status')->default('published');
            $table->string('visibility')->default('public'); // public, admin, restricted
            
            // Ranking
            $table->timestamp('published_at')->nullable();
            $table->integer('boost')->default(0);
            
            // Flexible attributes (JSON allows driver to push random stuff into Meili later)
            $table->json('metadata')->nullable();

            $table->timestamps();

            // Indexes for querying
            $table->unique(['searchable_type', 'searchable_id']);
            $table->index(['visibility', 'status']);
            $table->index(['type', 'status']);
            
            // Fulltext Index for Database Driver
            $table->fullText(['title', 'summary', 'content']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('search_index');
    }
};
