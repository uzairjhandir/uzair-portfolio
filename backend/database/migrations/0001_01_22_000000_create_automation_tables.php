<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Enterprise Automation Engine Schema
 * 
 * Supports a graph-based workflow definition (nodes and edges),
 * immutable versioning, run state tracking, and step-by-step action results.
 */
return new class extends Migration
{
    public function up(): void
    {
        // ── 1. Automation Workflows ───────────────────────────────────────────
        Schema::create('automation_workflows', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });

        // ── 2. Workflow Versioning (Immutable Definitions) ────────────────────
        Schema::create('automation_workflow_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workflow_id')->constrained('automation_workflows')->cascadeOnDelete();
            $table->integer('version');
            
            // The JSON graph definition (Nodes and Edges)
            $table->json('definition');
            
            $table->uuid('published_by')->nullable();
            $table->timestamp('published_at')->useCurrent();
            
            $table->unique(['workflow_id', 'version']);
        });

        // ── 3. Automation Runs (Workflow Instances) ───────────────────────────
        Schema::create('automation_runs', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('workflow_id')->constrained('automation_workflows')->cascadeOnDelete();
            $table->foreignId('version_id')->constrained('automation_workflow_versions')->cascadeOnDelete();
            
            // Status: waiting, running, paused, retrying, skipped, cancelled, completed, failed, expired
            $table->string('status')->default('waiting')->index();
            
            // Workflow Context (variables passed between actions)
            $table->json('context')->nullable();
            
            // For paused runs waiting to resume (e.g. WaitAction)
            $table->timestamp('resume_at')->nullable()->index();
            
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        // ── 4. Action Results (Node Execution Logs) ───────────────────────────
        Schema::create('automation_action_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('run_id')->constrained('automation_runs')->cascadeOnDelete();
            
            // The UUID of the node in the JSON definition graph
            $table->string('node_id')->index();
            $table->string('action_type'); // e.g. 'wait', 'notification', 'condition'
            
            // Status: running, success, failed, skipped
            $table->string('status')->default('running');
            
            $table->json('output')->nullable(); // Data returned by the action to merge into Context
            $table->text('exception')->nullable();
            $table->integer('duration_ms')->nullable();
            
            $table->timestamp('started_at')->useCurrent();
            $table->timestamp('completed_at')->nullable();
            
            $table->unique(['run_id', 'node_id']);
        });

        // ── 5. System Logs for the Workflow ───────────────────────────────────
        Schema::create('automation_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('run_id')->nullable()->constrained('automation_runs')->cascadeOnDelete();
            $table->string('level')->default('info'); // info, warning, error
            $table->text('message');
            $table->json('metadata')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('automation_logs');
        Schema::dropIfExists('automation_action_results');
        Schema::dropIfExists('automation_runs');
        Schema::dropIfExists('automation_workflow_versions');
        Schema::dropIfExists('automation_workflows');
    }
};
