<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // No-op: uuid, status, last_login_at, and last_login_ip are already
        // defined directly in 0001_01_01_000000_create_users_table.php.
        // This migration predates that consolidation and was never cleaned
        // up - on any fresh install it failed with "duplicate column name"
        // for every one of these columns. Kept as a file (not deleted) so
        // its migrations-table record on already-migrated databases still
        // resolves to a real file.
    }

    public function down(): void
    {
        // No-op to match up(). See note above.
    }
};
