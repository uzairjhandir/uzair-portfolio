<?php

namespace App\Modules\Newsletter;

use Illuminate\Database\Eloquent\Model;

/**
 * Cached aggregate statistics for a campaign.
 * Rebuilt from campaign_events by a queued job — never write to this directly.
 */
class CampaignStatistics extends Model
{
    protected $table = 'campaign_statistics';

    protected $fillable = [
        'campaign_id', 'sent_count', 'delivered_count',
        'opened_count', 'unique_opens', 'clicked_count', 'unique_clicks',
        'bounced_count', 'complained_count', 'unsubscribed_count',
        'open_rate', 'click_rate', 'last_updated_at',
    ];

    protected $casts = [
        'open_rate'       => 'float',
        'click_rate'      => 'float',
        'last_updated_at' => 'datetime',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class, 'campaign_id');
    }

    /** Recompute rates from raw counts */
    public function recalculate(): void
    {
        $this->open_rate  = $this->sent_count > 0
            ? round($this->unique_opens / $this->sent_count * 100, 2) : 0;
        $this->click_rate = $this->sent_count > 0
            ? round($this->unique_clicks / $this->sent_count * 100, 2) : 0;
        $this->last_updated_at = now();
        $this->save();
    }
}

/**
 * Raw per-subscriber delivery events.
 * Never deleted — permanent audit log for ESP webhooks.
 */
class CampaignEvent extends Model
{
    public $timestamps = false;
    protected $table = 'campaign_events';

    protected $fillable = [
        'campaign_id', 'subscriber_id', 'event',
        'email', 'metadata', 'occurred_at',
    ];

    protected $casts = [
        'occurred_at' => 'datetime',
        'metadata'    => 'json',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class, 'campaign_id');
    }

    public function subscriber()
    {
        return $this->belongsTo(Subscriber::class, 'subscriber_id');
    }
}
