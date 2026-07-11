<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('navigation_menus', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('location')->index();
            $table->string('status')->default('published');
            $table->timestamp('publish_date')->nullable();
            $table->timestamp('expire_date')->nullable();
            $table->integer('sort_order')->default(0);
            
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('navigation_items', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('navigation_menu_id')->constrained('navigation_menus')->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('navigation_items')->nullOnDelete();
            $table->foreignId('page_id')->nullable()->constrained('pages')->nullOnDelete();
            
            $table->string('type')->default('page');
            $table->string('custom_url')->nullable();
            $table->string('label');
            $table->string('target')->default('_self');
            $table->string('rel')->nullable();
            $table->string('tooltip')->nullable();
            $table->string('css_class')->nullable();
            $table->string('badge')->nullable();
            
            $table->string('visibility')->default('public');
            $table->json('roles')->nullable();
            $table->json('permissions')->nullable();
            
            $table->string('icon_type')->nullable(); // svg, media, lucide, emoji
            $table->text('icon_value')->nullable();
            $table->foreignId('media_id')->nullable()->constrained('media')->nullOnDelete();
            
            $table->integer('sort_order')->default(0);
            
            // Mega Menu & JSON Configs
            $table->json('columns')->nullable();
            $table->json('featured_card')->nullable();
            $table->json('groups')->nullable();
            
            $table->string('locale')->nullable();
            $table->string('translation_key')->nullable();
            
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            
            $table->timestamps();
        });

        Schema::create('navigation_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('navigation_menu_id')->constrained('navigation_menus')->cascadeOnDelete();
            $table->string('version');
            $table->json('tree_dump');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('navigation_versions');
        Schema::dropIfExists('navigation_items');
        Schema::dropIfExists('navigation_menus');
    }
};
