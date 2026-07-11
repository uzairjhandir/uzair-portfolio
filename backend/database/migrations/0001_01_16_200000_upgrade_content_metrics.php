<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('content_metrics', function (Blueprint $table) {
            $table->renameColumn('likes', 'favorites');
            $table->unsignedBigInteger('conversions')->default(0)->after('shares');
        });
    }

    public function down(): void
    {
        Schema::table('content_metrics', function (Blueprint $table) {
            $table->renameColumn('favorites', 'likes');
            $table->dropColumn('conversions');
        });
    }
};
