<?php

namespace App\Modules\Newsletter;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

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
