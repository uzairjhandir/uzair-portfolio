<?php

namespace App\Modules\Crm;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ContactRepository
{
    public function paginate(array $filters = []): LengthAwarePaginator
    {
        $query = CrmContact::query()->withCount('activities');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['stage'])) {
            $query->whereHas('pipelineStage', fn($q) => $q->where('uuid', $filters['stage']));
        }
        if (!empty($filters['assigned_to'])) {
            $query->where('assigned_to', $filters['assigned_to']);
        }
        if (!empty($filters['search'])) {
            $q = $filters['search'];
            $query->where(fn($q2) =>
                $q2->where('email', 'like', "%{$q}%")
                    ->orWhere('first_name', 'like', "%{$q}%")
                    ->orWhere('last_name', 'like', "%{$q}%")
                    ->orWhere('company', 'like', "%{$q}%")
            );
        }

        return $query->with('pipelineStage', 'assignedTo')->orderByDesc('created_at')->paginate(25);
    }

    public function findByEmail(string $email): ?CrmContact
    {
        return CrmContact::where('email', $email)->first();
    }

    /**
     * Deduplication strategy — default is email-only.
     * Can be extended later: email+phone, external CRM ID, etc.
     */
    public function createOrUpdate(array $data, string $strategy = 'email'): CrmContact
    {
        $key = match($strategy) {
            'email_phone' => ['email' => $data['email'], 'phone' => $data['phone']],
            default       => ['email' => $data['email']],
        };
        return CrmContact::updateOrCreate($key, $data);
    }

    public function addActivity(CrmContact $contact, array $data): CrmActivity
    {
        $data['performed_at'] ??= now();
        return $contact->activities()->create($data);
    }

    public function moveToStage(CrmContact $contact, string $stageUuid, int $movedByUserId): void
    {
        $stage = CrmPipelineStage::where('uuid', $stageUuid)->firstOrFail();
        $oldStage = $contact->pipelineStage?->name ?? 'None';
        $contact->update(['pipeline_stage_id' => $stage->id]);

        CrmActivity::logSystem($contact, 'stage_change',
            "Stage changed from {$oldStage} to {$stage->name}",
            ['old_stage' => $oldStage, 'new_stage' => $stage->name, 'moved_by' => $movedByUserId]
        );
    }
}
