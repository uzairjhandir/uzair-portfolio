<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // UUID for external references
            $table->uuid('uuid')->unique()->nullable()->after('id');

            // Account status
            $table->string('status')->default('active')->after('email_verified_at');

            // Login tracking
            $table->timestamp('last_login_at')->nullable()->after('status');
            $table->string('last_login_ip', 45)->nullable()->after('last_login_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['uuid', 'status', 'last_login_at', 'last_login_ip']);
        });
    }
};
