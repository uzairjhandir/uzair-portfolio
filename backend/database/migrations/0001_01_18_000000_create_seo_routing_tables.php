<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── redirects ────────────────────────────────────────────────────────
        // Manual and auto-generated redirects.
        // Auto-generated when a content slug changes (via CreateRedirectFromSlugJob).
        // Manual: created by admin via RedirectController.

        Schema::create('redirects', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('source_path');           // Relative path: /blog/old-slug
            $table->string('target_path')->nullable(); // null = 410 Gone
            $table->unsignedSmallInteger('http_code')->default(301); // 301|302|307|308|410
            $table->enum('match_type', ['exact', 'wildcard', 'regex'])->default('exact');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_auto')->default(false);   // true = system-generated from slug change
            $table->unsignedBigInteger('hit_count')->default(0);
            $table->timestamp('last_accessed_at')->nullable();
            $table->string('note')->nullable();            // Admin annotation
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['source_path', 'match_type', 'is_active'], 'redirects_lookup');
            $table->index('http_code');
        });

        // ── url_rewrites ─────────────────────────────────────────────────────
        // URL Rewrites transform the incoming path before routing.
        // Different from redirects: client receives NO redirect header —
        // the server internally resolves a different route.
        //
        // Example:
        //   /blog/category/php  → /blog/php       (rewrite, not redirect)
        //   /portfolio/software/project → /projects/project-name
        //
        // match_type: exact | wildcard | regex
        // capture groups in regex source can be referenced in target as $1, $2 etc.

        Schema::create('url_rewrites', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('source_pattern');          // Pattern to match against the path
            $table->string('target_path');             // Resolved path (may use $1, $2 captures)
            $table->enum('match_type', ['exact', 'wildcard', 'regex'])->default('exact');
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('priority')->default(100); // Lower = evaluated first
            $table->string('note')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['is_active', 'priority'], 'rewrites_active_priority');
        });

        // ── sitemap_entries ──────────────────────────────────────────────────
        // Tracks generated sitemap sections.
        // SitemapEngine updates this after writing each XML file.
        // Used by the sitemap index to know which sections exist + their lastmod.

        Schema::create('sitemap_entries', function (Blueprint $table) {
            $table->id();
            $table->string('section')->unique(); // pages | blog | portfolio | case_study | downloads | taxonomy | authors
            $table->string('label');             // Human-readable: "Blog Posts"
            $table->string('file_path');         // storage/app/sitemaps/sitemap-blog.xml
            $table->string('public_url');        // https://domain.com/sitemap-blog.xml
            $table->unsignedInteger('url_count')->default(0);
            $table->timestamp('generated_at')->nullable();
            $table->timestamps();
        });

        // ── seo_metadata extensions ──────────────────────────────────────────
        // Extend the existing seo_metadata table.
        // hreflang is reserved (architecture) but not used yet — column added as nullable JSON.
        // schema_type drives the JSON-LD Schema builder (ArticleSchema, ProjectSchema, etc.)

        Schema::table('seo_metadata', function (Blueprint $table) {
            $table->string('schema_type')->nullable()->after('schema_markup'); // Article | Person | Organization | Project | FAQPage | DigitalDocument
            $table->json('hreflang')->nullable()->after('schema_type');        // Reserved — future locale implementation
            $table->unsignedTinyInteger('seo_score')->nullable()->after('hreflang'); // 0-100, computed by SeoHealthChecker
            $table->timestamp('last_audited_at')->nullable()->after('seo_score');
        });
    }

    public function down(): void
    {
        Schema::table('seo_metadata', function (Blueprint $table) {
            $table->dropColumn(['schema_type', 'hreflang', 'seo_score', 'last_audited_at']);
        });

        Schema::dropIfExists('sitemap_entries');
        Schema::dropIfExists('url_rewrites');
        Schema::dropIfExists('redirects');
    }
};
