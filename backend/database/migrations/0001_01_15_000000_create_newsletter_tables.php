<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Subscriber lists (e.g. "Main List", "VIP", "Product Updates")
        Schema::create('newsletter_lists', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_public')->default(true);     // Visible in subscribe form
            $table->boolean('is_default')->default(false);   // Auto-subscribed on signup
            $table->unsignedInteger('subscriber_count')->default(0); // Cached
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // Subscribers (one email address, multiple list memberships)
        Schema::create('newsletter_subscribers', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('email')->unique();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('status')->default('pending'); // pending, confirmed, unsubscribed, bounced, complained
            $table->string('unsubscribe_token')->unique(); // For one-click unsubscribe
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('unsubscribed_at')->nullable();
            $table->json('metadata')->nullable();           // Tags, custom fields
            $table->string('ip_address')->nullable();
            $table->foreignId('crm_contact_id')->nullable()->constrained('crm_contacts')->nullOnDelete();
            $table->timestamps();

            $table->index('status');
        });

        // Pivot: subscriber ↔ list membership
        Schema::create('newsletter_list_subscriber', function (Blueprint $table) {
            $table->id();
            $table->foreignId('list_id')->constrained('newsletter_lists')->cascadeOnDelete();
            $table->foreignId('subscriber_id')->constrained('newsletter_subscribers')->cascadeOnDelete();
            $table->timestamp('subscribed_at')->useCurrent();
            $table->timestamp('unsubscribed_at')->nullable();

            $table->unique(['list_id', 'subscriber_id']);
        });

        // Campaigns (one-off sends or automations)
        Schema::create('newsletter_campaigns', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name');
            $table->string('subject');
            $table->string('preview_text')->nullable();     // Email client preview snippet
            $table->longText('html_body')->nullable();
            $table->text('plain_body')->nullable();
            $table->string('from_name')->nullable();
            $table->string('from_email')->nullable();
            $table->string('reply_to')->nullable();
            $table->string('status')->default('draft');    // draft, scheduled, sending, sent, cancelled
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            // Stats (updated by webhook / send driver)
            $table->unsignedInteger('sent_count')->default(0);
            $table->unsignedInteger('opened_count')->default(0);
            $table->unsignedInteger('clicked_count')->default(0);
            $table->unsignedInteger('bounced_count')->default(0);
            $table->unsignedInteger('unsubscribed_count')->default(0);

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['status', 'scheduled_at']);
        });

        // Campaign ↔ List targeting
        Schema::create('newsletter_campaign_list', function (Blueprint $table) {
            $table->foreignId('campaign_id')->constrained('newsletter_campaigns')->cascadeOnDelete();
            $table->foreignId('list_id')->constrained('newsletter_lists')->cascadeOnDelete();
            $table->primary(['campaign_id', 'list_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('newsletter_campaign_list');
        Schema::dropIfExists('newsletter_campaigns');
        Schema::dropIfExists('newsletter_list_subscriber');
        Schema::dropIfExists('newsletter_subscribers');
        Schema::dropIfExists('newsletter_lists');
    }
};
