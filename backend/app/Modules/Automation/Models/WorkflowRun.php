<?php

namespace App\Modules\Automation\Models;

use Illuminate\Database\Eloquent\Model;

class WorkflowRun extends Model
{
    protected $table = 'automation_runs';
    protected $guarded = ['id'];

    protected $casts = [
        'context'      => 'array',
        'resume_at'    => 'datetime',
        'started_at'   => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function version()
    {
        return $this->belongsTo(WorkflowVersion::class, 'version_id');
    }
}
