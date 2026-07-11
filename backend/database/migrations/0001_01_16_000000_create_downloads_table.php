<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── 1. Downloads Table ───────────────────────────────────────────────
        Schema::create('downloads', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();

            // Core Content Engine fields
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

            // Downloads-specific (Refined)
            $table->foreignId('media_id')->nullable()->constrained('media')->nullOnDelete();
            $table->foreignId('preview_media_id')->nullable()->constrained('media')->nullOnDelete();

            $table->string('latest_version')->nullable();
            $table->string('access_level')->default('public'); // public, authenticated, subscriber, customer, premium, role, permission
            $table->string('required_permission')->nullable();  // e.g., 'downloads.premium'

            $table->boolean('requires_email')->default(false);
            $table->boolean('requires_accept_terms')->default(false);
            $table->boolean('requires_agreement')->default(false);

            $table->string('license_type')->nullable();
            $table->string('license_key')->nullable();
            $table->string('watermark_template')->nullable();
            $table->string('checksum')->nullable();

            $table->boolean('is_featured')->default(false);
            $table->unsignedBigInteger('download_count')->default(0);

            $table->timestamps();

            $table->index(['status', 'is_featured']);
        });

        // ── 2. Download Versions (Immutable History) ───────────────────────
        Schema::create('download_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('download_id')->constrained('downloads')->cascadeOnDelete();
            $table->foreignId('media_id')->constrained('media')->cascadeOnDelete();
            $table->string('version');              // e.g., 'v1.0.0'
            $table->string('checksum')->nullable();
            $table->text('changelog')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['download_id', 'version']);
        });

        // ── 3. Download Tokens ───────────────────────────────────────────────
        Schema::create('download_tokens', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('download_id')->constrained('downloads')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('email')->nullable();
            $table->string('ip')->nullable();
            $table->timestamp('expires_at');
            $table->timestamp('used_at')->nullable();
            $table->timestamp('downloaded_at')->nullable();
            $table->timestamps();
        });

        // ── 4. Download Events (Analytics) ───────────────────────────────────
        Schema::create('download_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('download_token_id')->nullable()->constrained('download_tokens')->nullOnDelete();
            $table->foreignId('download_id')->constrained('downloads')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('event_type');           // requested, served, completed, expired, denied
            $table->string('country')->nullable();
            $table->string('browser')->nullable();
            $table->string('device')->nullable();
            $table->string('referrer')->nullable();
            $table->unsignedInteger('duration')->nullable(); // seconds to download
            $table->timestamp('occurred_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('download_events');
        Schema::dropIfExists('download_tokens');
        Schema::dropIfExists('download_versions');
        Schema::dropIfExists('downloads');
    }
};
