<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_blocks', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('page_id')->constrained('pages')->cascadeOnDelete();
            $table->foreignId('block_id')->constrained('blocks')->cascadeOnDelete();
            
            $table->string('anchor')->nullable(); // #pricing
            $table->integer('sort_order')->default(0);
            
            $table->json('instance_settings')->nullable();
            $table->json('visibility_rules')->nullable(); // e.g. responsive
            $table->json('audience_rules')->nullable(); // e.g. personalization
            $table->json('conditions')->nullable();
            $table->json('responsive_layout')->nullable();
            $table->json('animation_settings')->nullable();
            
            $table->string('experiment_id')->nullable();
            $table->integer('traffic_percentage')->nullable();
            
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('page_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained('pages')->cascadeOnDelete();
            $table->string('version');
            
            $table->json('page_snapshot')->nullable();
            $table->json('attached_blocks_snapshot')->nullable(); // Complete tree
            $table->json('seo_snapshot')->nullable();
            
            $table->string('publish_state')->default('draft');
            
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
        
        // Remove blocks JSON from pages table since we now have page_blocks
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn('blocks');
        });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->json('blocks')->nullable();
        });
        Schema::dropIfExists('page_versions');
        Schema::dropIfExists('page_blocks');
    }
};
