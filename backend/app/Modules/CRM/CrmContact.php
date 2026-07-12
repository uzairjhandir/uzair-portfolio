<?php

namespace App\Modules\Crm;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * CRM Contact.
 * NOT a content model — does NOT use AbstractContentController or Core Content traits.
 * CRM is a relationship management domain, not a publishing domain.
 */
class CrmContact extends Model
{
    use HasUuids, SoftDeletes;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    protected $table = 'crm_contacts';

    protected $fillable = [
        'first_name', 'last_name', 'email', 'phone',
        'company', 'job_title', 'website',
        'status', 'source', 'priority',
        'consented_at_submit', 'gdpr_consented_at', 'gdpr_withdrawn_at',
        'message', 'metadata', 'ip_address', 'user_agent',
        'assigned_to', 'last_contacted_at',
        'created_by', 'updated_by',
    ];

    protected $casts = [
        'metadata'            => 'json',
        'consented_at_submit' => 'boolean',
        'gdpr_consented_at'   => 'datetime',
        'gdpr_withdrawn_at'   => 'datetime',
        'last_contacted_at'   => 'datetime',
    ];

    protected $hidden = ['ip_address', 'user_agent'];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function activities()
    {
        return $this->hasMany(CrmActivity::class, 'contact_id')->orderByDesc('performed_at');
    }

    public function pinnedActivities()
    {
        return $this->hasMany(CrmActivity::class, 'contact_id')->where('is_pinned', true);
    }

    public function pipelineStage()
    {
        return $this->belongsTo(CrmPipelineStage::class, 'pipeline_stage_id');
    }

    public function assignedTo()
    {
        return $this->belongsTo(\App\Models\User::class, 'assigned_to');
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    public function isGdprConsented(): bool
    {
        return $this->gdpr_consented_at !== null && $this->gdpr_withdrawn_at === null;
    }

    public function hasConsented(): bool
    {
        return $this->consented_at_submit || $this->isGdprConsented();
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeAssignedTo($query, int $userId)
    {
        return $query->where('assigned_to', $userId);
    }
}
