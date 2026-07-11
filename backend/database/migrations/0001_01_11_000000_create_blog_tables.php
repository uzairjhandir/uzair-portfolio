<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Blog Series (e.g. "Laravel from Zero to Hero")
        Schema::create('blog_series', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->foreignId('featured_image_id')->nullable()->constrained('media')->nullOnDelete();
            $table->string('status')->default('active'); // active, archived
            $table->integer('sort_order')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();

            // ---------------------------------------------------------------
            // Core Content Engine fields
            // (every field below is shared with Portfolio, CaseStudy, etc.)
            // ---------------------------------------------------------------
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content')->nullable();     // Rich text / Block-based
            $table->string('status')->default('draft'); // ContentStatusEnum
            $table->string('preview_token')->nullable();

            // Authoring
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('publisher_id')->nullable()->constrained('users')->nullOnDelete();

            // Scheduling
            $table->timestamp('publish_at')->nullable();
            $table->timestamp('expire_at')->nullable();

            // Locking
            $table->foreignId('checked_out_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('checked_out_at')->nullable();
            $table->string('lock_reason')->nullable();
            $table->string('lock_token')->nullable();
            $table->timestamp('heartbeat_at')->nullable();

            // Search
            $table->boolean('is_searchable')->default(true);
            $table->unsignedInteger('view_count')->default(0);

            // Audits
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->softDeletes();

            // ---------------------------------------------------------------
            // Blog-specific fields ONLY
            // ---------------------------------------------------------------
            $table->foreignId('blog_series_id')->nullable()->constrained('blog_series')->nullOnDelete();
            $table->unsignedSmallInteger('reading_time')->default(0); // Minutes
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_pinned')->default(false);

            $table->timestamps();

            $table->index(['status', 'publish_at']);
            $table->index(['is_featured', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blogs');
        Schema::dropIfExists('blog_series');
    }
};
