<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // CRM Pipeline Stages (New → Qualified → Won → Lost)
        Schema::create('crm_pipeline_stages', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name');                         // "Qualified", "Proposal Sent", etc.
            $table->string('color')->nullable();            // For Kanban UI
            $table->string('icon')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_won')->default(false);      // Terminal: successful
            $table->boolean('is_lost')->default(false);     // Terminal: unsuccessful
            $table->boolean('is_default')->default(false);  // Default stage for new contacts
            $table->timestamps();
        });

        // Add pipeline_stage_id FK to crm_contacts
        Schema::table('crm_contacts', function (Blueprint $table) {
            $table->foreignId('pipeline_stage_id')
                ->nullable()
                ->constrained('crm_pipeline_stages')
                ->nullOnDelete()
                ->after('priority');
        });

        // Replace crm_notes with crm_activities (rich activity timeline)
        Schema::dropIfExists('crm_notes');
        Schema::create('crm_activities', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('contact_id')->constrained('crm_contacts')->cascadeOnDelete();
            $table->foreignId('performed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('type', [
                'note', 'call', 'email', 'meeting', 'task',
                'sms', 'whatsapp', 'reminder',
                'status_change', 'assignment', 'stage_change',
            ])->default('note');
            $table->string('subject')->nullable();          // Short title (e.g. "Discovery Call")
            $table->text('body')->nullable();               // Full content
            $table->timestamp('performed_at');              // When it happened
            $table->boolean('is_pinned')->default(false);
            $table->json('metadata')->nullable();           // e.g. call duration, email ID, task due date
            $table->timestamps();

            $table->index(['contact_id', 'type']);
            $table->index(['contact_id', 'performed_at']);
        });

        // Contact form submissions — separate from CRM Contact
        Schema::create('contact_submissions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('crm_contact_id')->nullable()->constrained('crm_contacts')->nullOnDelete();
            // Raw submission data
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('company')->nullable();
            $table->string('subject')->nullable();
            $table->text('message');
            // Technical context
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('referrer_url')->nullable();
            $table->json('utm_params')->nullable();         // utm_source, utm_campaign, etc.
            // Anti-spam
            $table->boolean('honeypot_triggered')->default(false);
            $table->float('spam_score')->default(0.0);      // 0.0 clean → 1.0 definite spam
            $table->boolean('recaptcha_passed')->nullable();
            // Review
            $table->string('status')->default('pending');  // pending, processed, spam, archived
            $table->json('attachments')->nullable();        // Uploaded file references
            $table->timestamps();

            $table->index('email');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_submissions');
        Schema::dropIfExists('crm_activities');
        Schema::table('crm_contacts', fn($t) => $t->dropColumn('pipeline_stage_id'));
        Schema::dropIfExists('crm_pipeline_stages');
    }
};
