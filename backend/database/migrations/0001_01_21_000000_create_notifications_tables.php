<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Enterprise Notifications Engine Schema
 * 
 * Supports Markdown templates, Template Versioning, Notification Preferences,
 * Rules Engine (Conceptual Reservation), and granular Delivery Logs.
 */
return new class extends Migration
{
    public function up(): void
    {
        // ── 1. Templates & Layouts ────────────────────────────────────────────
        Schema::create('notification_layouts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('view_path'); // e.g. 'emails.layouts.default'
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('notification_templates', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique(); // e.g. 'welcome_email'
            $table->foreignId('layout_id')->nullable()->constrained('notification_layouts')->nullOnDelete();
            
            $table->string('subject')->nullable();
            $table->text('body_markdown')->nullable();
            
            // Expected variables for validation
            $table->json('variables')->nullable(); 
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // ── 1b. Template Versioning (Marketing / Compliance fallback) ─────────
        Schema::create('notification_template_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained('notification_templates')->cascadeOnDelete();
            $table->integer('version');
            
            $table->string('subject')->nullable();
            $table->text('body_markdown')->nullable();
            
            $table->uuid('created_by')->nullable();
            $table->timestamp('published_at')->useCurrent();
            
            $table->unique(['template_id', 'version']);
        });

        // ── 2. Notification Preferences ───────────────────────────────────────
        Schema::create('notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_uuid')->index(); // No strict FK in case it points to CRM Contact instead of User
            
            $table->string('channel'); // e.g. 'mail', 'slack'
            $table->string('event')->nullable(); // e.g. 'newsletter', 'system_alerts'
            
            $table->boolean('enabled')->default(true);
            $table->string('quiet_hours')->nullable(); // e.g. "22:00-08:00"
            $table->boolean('digest')->default(false);
            
            $table->timestamps();
            
            $table->unique(['user_uuid', 'channel', 'event']);
        });

        // ── 3. Notification Rules Engine (Reservation) ────────────────────────
        Schema::create('notification_rules', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. "High Value Lead Alert"
            
            $table->json('conditions'); // e.g. [{"field": "value", "operator": ">", "value": 5000}]
            $table->json('actions'); // e.g. [{"channel": "slack", "target": "sales_team"}]
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // ── 4. Delivery Logs ──────────────────────────────────────────────────
        Schema::create('notification_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            
            $table->uuid('recipient_id')->nullable()->index(); // Resolves to User or Contact
            $table->string('recipient_contact'); // actual email, phone, webhook url
            
            $table->string('channel')->index(); // 'mail', 'slack', etc.
            $table->string('template_key')->index();
            $table->json('payload')->nullable(); // the variables merged into the template
            
            // Core tracking state
            $table->string('status')->default('queued')->index();
            
            // Error handling & retry mechanism
            $table->text('error_message')->nullable();
            $table->unsignedTinyInteger('attempts')->default(0);
            
            // Driver response mapping
            $table->string('provider_id')->nullable(); // Message ID from SES/Twilio/Slack
            $table->json('provider_metadata')->nullable();
            
            // Timestamps for funnel analytics
            $table->timestamp('queued_at')->useCurrent();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('opened_at')->nullable();
            $table->timestamp('clicked_at')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_logs');
        Schema::dropIfExists('notification_rules');
        Schema::dropIfExists('notification_preferences');
        Schema::dropIfExists('notification_template_versions');
        Schema::dropIfExists('notification_templates');
        Schema::dropIfExists('notification_layouts');
    }
};
