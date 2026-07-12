<?php

namespace App\Modules\Newsletter;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/** newsletter_subscribers has no deleted_at column — unsubscribe is the deletion mechanism, not soft-delete. */
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
        // newsletter_list_subscriber has no created_at/updated_at columns —
        // no ->withTimestamps() (would produce "no such column" on every query).
        return $this->belongsToMany(NewsletterList::class, 'newsletter_list_subscriber', 'subscriber_id', 'list_id')
            ->withPivot('subscribed_at', 'unsubscribed_at');
    }

    public function crmContact()
    {
        return $this->belongsTo(\App\Modules\Crm\CrmContact::class, 'crm_contact_id');
    }

    public function isActive(): bool { return $this->status === 'confirmed'; }
}
