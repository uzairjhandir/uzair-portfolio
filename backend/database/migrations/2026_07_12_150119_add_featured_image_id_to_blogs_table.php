<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    /**
     * Corrective migration: 0001_01_11_000000_create_blog_tables.php already
     * defines featured_image_id, but that migration ran against this dev DB
     * before the column was added to the file, so the live schema never
     * picked it up (migrate:status shows it as "Ran" — Laravel does not
     * re-run migrations whose code changed after the fact). Blog.php's
     * featuredImage() belongsTo('featured_image_id') and BlogController's
     * $fillable have depended on this column existing since Phase 4; it
     * silently never did.
     */
    public function up(): void
    {
        Schema::table('blogs', function (Blueprint $table) {
            $table->foreignId('featured_image_id')->nullable()->after('preview_token')->constrained('media')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blogs', function (Blueprint $table) {
            $table->dropConstrainedForeignId('featured_image_id');
        });
    }
};
