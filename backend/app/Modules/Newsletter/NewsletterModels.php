<?php

namespace App\Modules\Newsletter;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Subscriber extends Model
{
    use HasUuids;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }
    protected $table = 'newsletter_subscribers';
    protected $fillable = ['email', 'first_name', 'last_name', 'status', 'unsubscribe_token', 'confirmed_at', 'unsubscribed_at', 'metadata', 'ip_address', 'crm_contact_id'];
    protected $casts = ['confirmed_at' => 'datetime', 'unsubscribed_at' => 'datetime', 'metadata' => 'json'];
    protected $hidden = ['ip_address'];

    public function lists()
    {
        return $this->belongsToMany(NewsletterList::class, 'newsletter_list_subscriber', 'subscriber_id', 'list_id')
            ->withPivot('subscribed_at', 'unsubscribed_at')
            ->withTimestamps();
    }

    public function crmContact()
    {
        return $this->belongsTo(\App\Modules\Crm\CrmContact::class, 'crm_contact_id');
    }

    public function isActive(): bool { return $this->status === 'confirmed'; }
}

class NewsletterList extends Model
{
    use HasUuids;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }
    protected $table = 'newsletter_lists';
    protected $fillable = ['name', 'slug', 'description', 'is_public', 'is_default', 'subscriber_count', 'created_by'];
    protected $casts = ['is_public' => 'boolean', 'is_default' => 'boolean'];

    public function subscribers()
    {
        return $this->belongsToMany(Subscriber::class, 'newsletter_list_subscriber', 'list_id', 'subscriber_id')
            ->withPivot('subscribed_at', 'unsubscribed_at');
    }

    public function campaigns()
    {
        return $this->belongsToMany(Campaign::class, 'newsletter_campaign_list', 'list_id', 'campaign_id');
    }
}

class Campaign extends Model
{
    use HasUuids;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }
    protected $table = 'newsletter_campaigns';
    protected $fillable = ['name', 'subject', 'preview_text', 'html_body', 'plain_body', 'from_name', 'from_email', 'reply_to', 'status', 'scheduled_at', 'sent_at', 'created_by'];
    protected $casts = ['scheduled_at' => 'datetime', 'sent_at' => 'datetime'];

    public function lists()
    {
        return $this->belongsToMany(NewsletterList::class, 'newsletter_campaign_list', 'campaign_id', 'list_id');
    }

    public function scopeDraft($query) { return $query->where('status', 'draft'); }
    public function scopeSent($query) { return $query->where('status', 'sent'); }
}
