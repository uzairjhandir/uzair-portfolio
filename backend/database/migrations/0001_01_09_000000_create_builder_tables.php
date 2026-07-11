<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->json('layout_settings')->nullable()->after('content');
            $table->string('preview_token')->nullable()->after('status');
            $table->foreignId('locked_by')->nullable()->constrained('users')->nullOnDelete()->after('preview_token');
            $table->timestamp('locked_at')->nullable()->after('locked_by');
        });

        Schema::create('builder_sessions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('page_id')->constrained('pages')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->json('auto_saved_state')->nullable();
            $table->timestamp('started_at');
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });

        Schema::create('page_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained('pages')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('block_id')->nullable()->constrained('blocks')->cascadeOnDelete();
            $table->text('comment');
            $table->boolean('resolved')->default(false);
            $table->timestamps();
        });

        Schema::create('builder_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained('pages')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('action'); // drag, delete, duplicate, settings_change
            $table->json('snapshot');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('builder_history');
        Schema::dropIfExists('page_comments');
        Schema::dropIfExists('builder_sessions');
        
        Schema::table('pages', function (Blueprint $table) {
            $table->dropForeign(['locked_by']);
            $table->dropColumn(['layout_settings', 'preview_token', 'locked_by', 'locked_at']);
        });
    }
};
