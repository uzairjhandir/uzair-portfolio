<?php

namespace App\Modules\Crm;

use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'uuid'             => $this->uuid,
            'full_name'        => $this->full_name,
            'first_name'       => $this->first_name,
            'last_name'        => $this->last_name,
            'email'            => $this->email,
            'phone'            => $this->phone,
            'company'          => $this->company,
            'job_title'        => $this->job_title,
            'website'          => $this->website,
            'status'           => $this->status,
            'source'           => $this->source,
            'priority'         => $this->priority,
            'message'          => $this->message,
            'gdpr_consented'   => $this->isGdprConsented(),
            'assigned_to'      => $this->whenLoaded('assignedTo', fn() => [
                'uuid' => $this->assignedTo->uuid,
                'name' => $this->assignedTo->name,
            ]),
            'notes_count'      => $this->notes_count ?? 0,
            'last_contacted_at'=> $this->last_contacted_at?->toISOString(),
            'created_at'       => $this->created_at->toISOString(),
        ];
    }
}
