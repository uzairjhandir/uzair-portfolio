<?php

namespace App\Modules\Automation\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Referenced by WorkflowEngine::completeRun() on the error path but never
 * defined as a model — calling that path threw "Class not found". Table
 * (automation_logs) already existed via the original migration.
 */
class AutomationLog extends Model
{
    const UPDATED_AT = null;

    protected $table = 'automation_logs';
    protected $guarded = ['id'];

    protected $casts = [
        'metadata'   => 'array',
        'created_at' => 'datetime',
    ];

    public function run()
    {
        return $this->belongsTo(WorkflowRun::class, 'run_id');
    }
}
