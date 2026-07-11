<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('case_studies', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();

            // ---------------------------------------------------------------
            // Core Content Engine fields
            // ---------------------------------------------------------------
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
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
            // Case Study-specific fields — narrative content only
            // ---------------------------------------------------------------
            $table->foreignId('portfolio_id')->nullable()->constrained('portfolios')->nullOnDelete();
            $table->boolean('is_primary')->default(false);    // Primary story for this portfolio
            $table->boolean('is_featured')->default(false);

            // Narrative sections (long-form structured text)
            $table->text('challenge')->nullable();         // The problem that was faced
            $table->text('solution')->nullable();          // What was designed/built
            $table->text('implementation')->nullable();    // How it was executed
            $table->text('results')->nullable();           // Measurable outcomes
            $table->string('customer_quote')->nullable();  // Pull quote from client

            // Quantitative results (flexible JSON)
            $table->json('outcome_metrics')->nullable();   // [{"label":"Revenue","value":"+40%"}]

            // Project context
            $table->unsignedSmallInteger('duration_weeks')->nullable(); // Project duration
            $table->unsignedSmallInteger('team_size')->nullable();

            $table->timestamps();

            $table->index(['portfolio_id', 'is_primary']);
            $table->index(['status', 'is_featured']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('case_studies');
    }
};
