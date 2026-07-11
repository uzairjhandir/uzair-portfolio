<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Contacts submitted via the public contact form or added manually by admins
        Schema::create('crm_contacts', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();

            // Identity
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('company')->nullable();
            $table->string('job_title')->nullable();
            $table->string('website')->nullable();

            // Lead management
            $table->string('status')->default('new');    // new, contacted, qualified, customer, archived
            $table->string('source')->nullable();         // contact_form, newsletter, import, manual
            $table->string('priority')->default('normal'); // low, normal, high, urgent

            // Consent & compliance
            $table->boolean('consented_at_submit')->default(false);
            $table->timestamp('gdpr_consented_at')->nullable();
            $table->timestamp('gdpr_withdrawn_at')->nullable();

            // Metadata
            $table->text('message')->nullable();           // Original contact form message
            $table->json('metadata')->nullable();          // Arbitrary extra fields (UTM params, etc.)
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();

            // Assignment
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('last_contacted_at')->nullable();

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['status', 'priority']);
            $table->index('email');
        });

        // Activity timeline per contact
        Schema::create('crm_notes', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('contact_id')->constrained('crm_contacts')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('type')->default('note');    // note, email, call, meeting, task
            $table->text('content');
            $table->timestamp('occurred_at')->nullable(); // When the activity happened
            $table->boolean('is_pinned')->default(false);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['contact_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crm_notes');
        Schema::dropIfExists('crm_contacts');
    }
};
