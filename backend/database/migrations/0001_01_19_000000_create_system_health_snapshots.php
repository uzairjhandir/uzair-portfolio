<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * System Health Snapshots
 *
 * Stores periodic historical snapshots of the HealthCheckManager::collect() output.
 * Designed to be written by Module 22 (Scheduler) to power trend charts
 * (e.g., "Health score over last 30 days", "Database latency trend").
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_health_snapshots', function (Blueprint $table) {
            $table->id();

            // Overall score (0-100)
            $table->unsignedTinyInteger('score');

            // Overall status enum (ok, warning, critical, unknown)
            $table->string('status', 20);

            // Time it took to run all checks (ms)
            $table->unsignedInteger('duration_ms');

            // The full HealthReport::toArray() payload (JSON)
            $table->json('payload');

            // When the snapshot was taken
            $table->timestamp('recorded_at')->useCurrent();

            // Auto-cleanup / partitioning aids
            $table->timestamps();

            $table->index('recorded_at');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_health_snapshots');
    }
};
