<?php

namespace App\Modules\Crm;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class CrmPipelineStage extends Model
{
    use HasUuids;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    protected $table = 'crm_pipeline_stages';

    protected $fillable = [
        'name', 'color', 'icon', 'sort_order',
        'is_won', 'is_lost', 'is_default',
        'probability', 'expected_value',
    ];

    protected $casts = [
        'is_won'         => 'boolean',
        'is_lost'        => 'boolean',
        'is_default'     => 'boolean',
        'probability'    => 'integer',
        'expected_value' => 'decimal:2',
    ];

    public function contacts()
    {
        return $this->hasMany(CrmContact::class, 'pipeline_stage_id');
    }

    public static function default(): ?self
    {
        return static::where('is_default', true)->first();
    }
}
