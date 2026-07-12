<?php

namespace App\Modules\Newsletter;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Campaign extends Model
{
    use HasUuids, SoftDeletes;

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
