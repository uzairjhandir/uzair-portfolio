<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Upgrade migration covering all approved schema refinements:
 * 1. crm_activities — actor polymorphism + source
 * 2. crm_pipeline_stages — probability + expected_value
 * 3. contact_submissions — marketing attribution fields
 * 4. newsletter_subscribers — add 'suppressed' status
 * 5. newsletter_campaigns — remove inline stats (moved to campaign_statistics + campaign_events)
 */
return new class extends Migration
{
    public function up(): void
    {
        // ── 1. crm_activities — actor + source ───────────────────────────────
        Schema::table('crm_activities', function (Blueprint $table) {
            // Who performed the action (polymorphic: User, System, Webhook, Import)
            $table->string('actor_type')->nullable()->after('performed_by');
            $table->unsignedBigInteger('actor_id')->nullable()->after('actor_type');
            // Where did this activity originate?
            $table->enum('source', [
                'manual', 'website', 'api', 'automation',
                'newsletter', 'webhook', 'import',
            ])->default('manual')->after('actor_id');

            $table->index(['actor_type', 'actor_id']);
            $table->index(['contact_id', 'source']);
        });

        // ── 2. crm_pipeline_stages — probability + expected_value ────────────
        Schema::table('crm_pipeline_stages', function (Blueprint $table) {
            $table->unsignedTinyInteger('probability')->default(0)->after('is_default');  // 0–100%
            $table->decimal('expected_value', 12, 2)->nullable()->after('probability');   // e.g. 12000.00
        });

        // ── 3. contact_submissions — marketing attribution ────────────────────
        Schema::table('contact_submissions', function (Blueprint $table) {
            $table->string('landing_page')->nullable()->after('referrer_url');
            $table->string('first_page')->nullable()->after('landing_page');
            $table->string('session_id')->nullable()->after('first_page');
            $table->string('browser')->nullable()->after('session_id');
            $table->string('country')->nullable()->after('browser');
            $table->string('city')->nullable()->after('country');
        });

        // ── 4. newsletter_subscribers — add 'suppressed' ─────────────────────
        // MySQL ENUM cannot be modified with change() alone — drop + recreate column
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->dropColumn('status');
        });
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->enum('status', [
                'pending', 'confirmed', 'unsubscribed', 'bounced', 'complained', 'suppressed',
            ])->default('pending')->after('last_name');
        });

        // ── 5a. Remove inline stats from newsletter_campaigns ─────────────────
        Schema::table('newsletter_campaigns', function (Blueprint $table) {
            $table->dropColumn([
                'sent_count', 'opened_count', 'clicked_count',
                'bounced_count', 'unsubscribed_count',
            ]);
        });

        // ── 5b. campaign_statistics — cached aggregate totals ─────────────────
        Schema::create('campaign_statistics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->unique()->constrained('newsletter_campaigns')->cascadeOnDelete();
            $table->unsignedInteger('sent_count')->default(0);
            $table->unsignedInteger('delivered_count')->default(0);
            $table->unsignedInteger('opened_count')->default(0);
            $table->unsignedInteger('unique_opens')->default(0);
            $table->unsignedInteger('clicked_count')->default(0);
            $table->unsignedInteger('unique_clicks')->default(0);
            $table->unsignedInteger('bounced_count')->default(0);
            $table->unsignedInteger('complained_count')->default(0);
            $table->unsignedInteger('unsubscribed_count')->default(0);
            $table->float('open_rate')->default(0);
            $table->float('click_rate')->default(0);
            $table->timestamp('last_updated_at')->nullable();
            $table->timestamps();
        });

        // ── 5c. campaign_events — raw delivery events (permanent log) ─────────
        Schema::create('campaign_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('newsletter_campaigns')->cascadeOnDelete();
            $table->foreignId('subscriber_id')->nullable()->constrained('newsletter_subscribers')->nullOnDelete();
            $table->enum('event', [
                'sent', 'delivered', 'opened', 'clicked',
                'bounced', 'complained', 'unsubscribed',
            ]);
            $table->string('email')->nullable();            // Denormalized in case subscriber is deleted
            $table->json('metadata')->nullable();           // Click URL, bounce reason, etc.
            $table->timestamp('occurred_at');
            $table->index(['campaign_id', 'event']);
            $table->index(['subscriber_id', 'event']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_events');
        Schema::dropIfExists('campaign_statistics');

        Schema::table('newsletter_campaigns', function (Blueprint $table) {
            $table->unsignedInteger('sent_count')->default(0);
            $table->unsignedInteger('opened_count')->default(0);
            $table->unsignedInteger('clicked_count')->default(0);
            $table->unsignedInteger('bounced_count')->default(0);
            $table->unsignedInteger('unsubscribed_count')->default(0);
        });
        // Subscriber status, crm_activities, pipeline — reverse as needed
    }
};
