<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('block_types', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category')->index(); // marketing, content, layout
            $table->string('icon')->nullable();
            
            $table->boolean('is_singleton')->default(false);
            $table->json('allowed_zones')->nullable(); // ["homepage", "landing"]
            $table->json('slots')->nullable(); // ["headline", "media", "actions"]
            $table->json('schema')->nullable();
            $table->json('default_settings')->nullable();
            
            $table->string('version')->default('1.0');
            $table->string('status')->default('active'); // active, deprecated
            
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('blocks', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('block_type_id')->constrained('block_types')->cascadeOnDelete();
            $table->foreignId('parent_block_id')->nullable()->constrained('blocks')->cascadeOnDelete();
            
            $table->string('name')->nullable(); // For global blocks "Global Newsletter"
            $table->string('variant')->nullable(); // accordion, minimal, cards
            
            $table->boolean('is_global')->default(false);
            $table->boolean('is_template')->default(false);
            $table->boolean('is_locked')->default(false);
            
            $table->json('content')->nullable(); // The actual data
            $table->json('settings')->nullable(); // Visual overrides
            $table->text('search_content')->nullable(); // Auto-generated flat string
            $table->json('tags')->nullable(); // For Admin search
            
            $table->string('status')->default('draft'); // draft, review, published, archived
            $table->string('version')->default('v1.0');
            
            $table->timestamp('publish_at')->nullable();
            $table->timestamp('expire_at')->nullable();
            
            $table->boolean('is_searchable')->default(true);
            
            // Reserved Analytics
            $table->unsignedBigInteger('view_count')->default(0);
            $table->unsignedBigInteger('click_count')->default(0);
            $table->timestamp('last_rendered_at')->nullable();
            
            // Reserved Localization
            $table->string('locale')->nullable();
            $table->uuid('translation_group_uuid')->nullable();
            
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('block_revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('block_id')->constrained('blocks')->cascadeOnDelete();
            $table->string('version');
            $table->string('comment')->nullable(); // Git-like commit message
            $table->json('content_snapshot')->nullable();
            $table->json('settings_snapshot')->nullable();
            $table->string('status');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('block_revisions');
        Schema::dropIfExists('blocks');
        Schema::dropIfExists('block_types');
    }
};
