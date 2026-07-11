<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tableNames = config('permission.table_names', [
            'roles' => 'roles',
            'permissions' => 'permissions',
        ]);

        Schema::table($tableNames['roles'], function (Blueprint $table) {
            $table->uuid('uuid')->unique()->after('id');
            $table->integer('priority')->default(0)->after('name');
            $table->string('display_name')->nullable()->after('priority');
            $table->text('description')->nullable()->after('display_name');
        });

        Schema::table($tableNames['permissions'], function (Blueprint $table) {
            $table->uuid('uuid')->unique()->after('id');
            $table->string('label')->nullable()->after('name');
            $table->text('description')->nullable()->after('label');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableNames = config('permission.table_names', [
            'roles' => 'roles',
            'permissions' => 'permissions',
        ]);

        Schema::table($tableNames['roles'], function (Blueprint $table) {
            $table->dropColumn(['uuid', 'priority', 'display_name', 'description']);
        });

        Schema::table($tableNames['permissions'], function (Blueprint $table) {
            $table->dropColumn(['uuid', 'label', 'description']);
        });
    }
};
