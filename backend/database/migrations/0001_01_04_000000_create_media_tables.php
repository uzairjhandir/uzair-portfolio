<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Create Media Folders Table
        Schema::create('media_folders', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('parent_id')->nullable()->constrained('media_folders')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        // 2. Create the Spatie Media Table (with our Enterprise Extensions baked in)
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique(); // Replaces Spatie's UUID which is usually morph-based, but we want a true API UUID
            $table->foreignId('folder_id')->nullable()->constrained('media_folders')->nullOnDelete();
            
            // Spatie Morph Columns
            $table->morphs('model');
            $table->string('collection_name');
            $table->string('name');
            $table->string('file_name');
            $table->string('mime_type')->nullable();
            $table->string('disk');
            $table->string('conversions_disk')->nullable();
            $table->unsignedBigInteger('size');
            $table->json('manipulations');
            $table->json('custom_properties');
            $table->json('generated_conversions');
            $table->json('responsive_images');
            
            // Enterprise Extensions
            $table->string('alt_text')->nullable();
            $table->text('caption')->nullable();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('credits')->nullable();
            $table->string('license')->nullable();
            
            // UI & Conversions metadata
            $table->string('focal_point')->nullable();
            $table->string('dominant_color')->nullable();
            $table->text('blur_placeholder')->nullable();
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->integer('duration')->nullable(); // For video/audio
            
            // Security & Tracking
            $table->string('status')->default('active');
            $table->string('visibility')->default('public');
            $table->string('checksum', 64)->nullable()->index(); // SHA-256 for duplicate detection
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            
            $table->unsignedInteger('order_column')->nullable();
            $table->timestamps();
            $table->softDeletes(); // Recycle bin
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
        Schema::dropIfExists('media_folders');
    }
};
