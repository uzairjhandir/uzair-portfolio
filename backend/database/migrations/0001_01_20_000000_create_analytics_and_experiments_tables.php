<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Analytics & Experimentation Engine
 * 
 * Reserves the schema for Module 20's Feature Flags, A/B Testing, and Personalization.
 */
return new class extends Migration
{
    public function up(): void
    {
        // ── 1. Feature Flags ──────────────────────────────────────────────────
        Schema::create('feature_flags', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique(); // e.g., 'new_checkout_flow'
            $table->string('description')->nullable();
            $table->string('type')->default('boolean'); // boolean, string, json, multivariate
            $table->text('default_value')->nullable();
            
            // JSON array of rules for targeted rollouts (e.g. ['role' => 'admin', 'percentage' => 20])
            $table->json('rules')->nullable(); 
            
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });

        // ── 2. Experiments (A/B Tests) ────────────────────────────────────────
        Schema::create('experiments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('key')->unique();
            $table->string('status')->default('draft'); // draft, running, paused, completed
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->string('target_metric')->nullable(); // e.g., 'conversion_rate'
            $table->timestamps();
        });

        Schema::create('experiment_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('experiment_id')->constrained('experiments')->cascadeOnDelete();
            $table->string('name');   // e.g., 'Control', 'Variant A'
            $table->integer('weight')->default(50); // percentage allocation
            $table->json('payload')->nullable(); // Config for this variant
            $table->timestamps();
        });

        // ── 3. Event Log (Optional Self-Hosted Fallback) ──────────────────────
        Schema::create('analytics_events_log', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->index()->nullable();
            $table->uuid('user_uuid')->index()->nullable();
            
            $table->string('event_name');
            $table->json('properties')->nullable();
            $table->json('context')->nullable(); // IP, User Agent, Referrer
            
            $table->timestamp('created_at')->useCurrent();
            
            $table->index(['event_name', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_events_log');
        Schema::dropIfExists('experiment_variants');
        Schema::dropIfExists('experiments');
        Schema::dropIfExists('feature_flags');
    }
};
