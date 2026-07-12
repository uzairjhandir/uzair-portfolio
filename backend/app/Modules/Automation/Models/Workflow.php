<?php

namespace App\Modules\Automation\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Workflow extends Model
{
    use HasUuids;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    protected $table = 'automation_workflows';

    protected $fillable = ['name', 'description', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function versions()
    {
        return $this->hasMany(WorkflowVersion::class, 'workflow_id')->orderByDesc('version');
    }

    public function latestVersion()
    {
        return $this->hasOne(WorkflowVersion::class, 'workflow_id')->latestOfMany('version');
    }

    public function runs()
    {
        return $this->hasMany(WorkflowRun::class, 'workflow_id')->orderByDesc('created_at');
    }
}
