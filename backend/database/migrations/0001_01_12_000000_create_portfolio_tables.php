<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolios', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();

            // ---------------------------------------------------------------
            // Core Content Engine fields (same as blogs)
            // ---------------------------------------------------------------
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content')->nullable();
            $table->string('status')->default('draft');
            $table->string('preview_token')->nullable();

            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('publisher_id')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamp('publish_at')->nullable();
            $table->timestamp('expire_at')->nullable();

            $table->foreignId('checked_out_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('checked_out_at')->nullable();
            $table->string('lock_reason')->nullable();
            $table->string('lock_token')->nullable();
            $table->timestamp('heartbeat_at')->nullable();

            $table->boolean('is_searchable')->default(true);
            $table->unsignedInteger('view_count')->default(0);

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->softDeletes();

            // ---------------------------------------------------------------
            // Portfolio-specific fields ONLY
            // ---------------------------------------------------------------
            $table->string('client_name')->nullable();
            $table->string('project_url')->nullable();
            $table->string('repository_url')->nullable();
            $table->date('completion_date')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_open_source')->default(false);
            $table->string('project_status')->default('completed'); // completed, in_progress, archived

            $table->timestamps();

            $table->index(['status', 'is_featured']);
            $table->index(['status', 'publish_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolios');
    }
};
