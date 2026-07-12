<?php

namespace App\Modules\Crm;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * Unified CRM Activity timeline.
 * Replaces CrmNote. Handles notes, calls, meetings, tasks, automated events.
 */
class CrmActivity extends Model
{
    use HasUuids;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    protected $table = 'crm_activities';

    protected $fillable = [
        'contact_id', 'performed_by',
        'actor_type', 'actor_id', 'source',
        'type', 'subject', 'body',
        'performed_at', 'is_pinned', 'metadata',
    ];

    protected $casts = [
        'is_pinned'    => 'boolean',
        'performed_at' => 'datetime',
        'metadata'     => 'json',
    ];

    /** Possible source values for documentation / IDE support */
    public const SOURCES = [
        'manual', 'website', 'api', 'automation',
        'newsletter', 'webhook', 'import',
    ];

    public function contact()
    {
        return $this->belongsTo(CrmContact::class, 'contact_id');
    }

    public function performedBy()
    {
        return $this->belongsTo(\App\Models\User::class, 'performed_by');
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /** Auto-log a system-generated event (no human actor) */
    public static function logSystem(
        CrmContact $contact,
        string $type,
        string $body,
        array $metadata = [],
        string $source = 'automation'
    ): self {
        return self::create([
            'contact_id'   => $contact->id,
            'actor_type'   => 'system',
            'actor_id'     => null,
            'source'       => $source,
            'type'         => $type,
            'subject'      => ucwords(str_replace('_', ' ', $type)),
            'body'         => $body,
            'performed_at' => now(),
            'metadata'     => $metadata,
        ]);
    }
}
