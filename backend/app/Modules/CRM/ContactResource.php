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
            'assigned_to'      => $this->whenLoaded('assignedTo', fn() => $this->assignedTo ? [
                'uuid' => $this->assignedTo->uuid,
                'name' => $this->assignedTo->name,
            ] : null),
            'pipeline_stage'   => $this->whenLoaded('pipelineStage', fn() => $this->pipelineStage ? [
                'uuid'  => $this->pipelineStage->uuid,
                'name'  => $this->pipelineStage->name,
                'color' => $this->pipelineStage->color,
                'is_won'  => $this->pipelineStage->is_won,
                'is_lost' => $this->pipelineStage->is_lost,
            ] : null),
            // Set via withCount('activities') in the repository/controller — the
            // "notes" concept was superseded by CrmActivity (crm_notes table is
            // dropped), so this reads the real count key instead of the
            // nonexistent notes_count attribute.
            'activities_count' => $this->activities_count ?? 0,
            'last_contacted_at'=> $this->last_contacted_at?->toISOString(),
            'created_at'       => $this->created_at->toISOString(),
        ];
    }
}
