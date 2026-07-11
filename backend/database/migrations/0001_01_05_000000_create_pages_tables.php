<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('parent_id')->nullable()->constrained('pages')->nullOnDelete();
            
            // Content
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('breadcrumb_title')->nullable();
            $table->text('excerpt')->nullable();
            $table->longText('content')->nullable();
            $table->json('blocks')->nullable();
            
            // Presentation
            $table->string('template')->default('default');
            $table->string('layout')->default('default');
            $table->string('type')->default('page');
            
            // Status & Visibility
            $table->string('status')->default('draft');
            $table->string('visibility')->default('public');
            $table->string('password')->nullable();
            $table->timestamp('publish_date')->nullable();
            $table->timestamp('expire_date')->nullable();
            $table->integer('sort_order')->default(0);
            $table->string('preview_token')->nullable()->unique();
            
            // Media Relationships
            $table->foreignId('featured_image_id')->nullable()->constrained('media')->nullOnDelete();
            $table->foreignId('banner_id')->nullable()->constrained('media')->nullOnDelete();
            $table->foreignId('og_image_id')->nullable()->constrained('media')->nullOnDelete();
            
            // Workflow
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('publisher_id')->nullable()->constrained('users')->nullOnDelete();
            
            // Sitemap
            $table->decimal('sitemap_priority', 2, 1)->default(0.5);
            $table->string('sitemap_change_frequency')->default('weekly');
            $table->timestamp('sitemap_last_modified')->nullable();
            
            // Navigation & Discovery
            $table->boolean('show_in_header')->default(false);
            $table->boolean('show_in_footer')->default(false);
            $table->boolean('show_in_sitemap')->default(true);
            $table->boolean('show_in_search')->default(true);
            $table->boolean('show_in_breadcrumb')->default(true);
            
            $table->string('navigation_menu')->nullable();
            $table->integer('navigation_order')->default(0);
            $table->string('navigation_icon')->nullable();
            $table->string('navigation_badge')->nullable();
            
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('page_revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained('pages')->cascadeOnDelete();
            $table->string('version'); // e.g. v1.0
            $table->string('change_summary')->nullable();
            $table->json('blocks')->nullable(); // Snapshot of blocks JSON
            $table->longText('content')->nullable(); // Snapshot of legacy content
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_revisions');
        Schema::dropIfExists('pages');
    }
};
