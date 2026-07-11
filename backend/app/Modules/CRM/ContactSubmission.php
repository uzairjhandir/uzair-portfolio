<?php

namespace App\Modules\Crm;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * Raw contact form submission.
 * Separate from CrmContact — stores full technical context (spam score, UTM, honeypot, attachments).
 * A submission may create or update a CrmContact, but they are not the same thing.
 */
class ContactSubmission extends Model
{
    use HasUuids;

    protected $table = 'contact_submissions';

    protected $fillable = [
        'crm_contact_id',
        'first_name', 'last_name', 'email', 'phone', 'company', 'subject', 'message',
        'ip_address', 'user_agent', 'referrer_url', 'utm_params',
        'honeypot_triggered', 'spam_score', 'recaptcha_passed',
        'status', 'attachments',
    ];

    protected $casts = [
        'honeypot_triggered' => 'boolean',
        'recaptcha_passed'   => 'boolean',
        'spam_score'         => 'float',
        'utm_params'         => 'json',
        'attachments'        => 'json',
    ];

    protected $hidden = ['ip_address', 'user_agent'];

    public function contact()
    {
        return $this->belongsTo(CrmContact::class, 'crm_contact_id');
    }

    public function isSpam(): bool
    {
        return $this->honeypot_triggered || $this->spam_score > 0.7;
    }
}
