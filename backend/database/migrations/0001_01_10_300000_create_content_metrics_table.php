<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_metrics', function (Blueprint $table) {
            $table->id();
            $table->morphs('measurable');          // measurable_type, measurable_id
            $table->unsignedBigInteger('views')->default(0);
            $table->unsignedBigInteger('downloads')->default(0);
            $table->unsignedBigInteger('shares')->default(0);
            $table->unsignedBigInteger('likes')->default(0);
            $table->float('popularity_score')->default(0); // Computed — not stored raw
            $table->timestamp('trending_at')->nullable();   // Set when above threshold
            $table->timestamps();

            $table->unique(['measurable_type', 'measurable_id']);
            $table->index('popularity_score');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_metrics');
    }
};
