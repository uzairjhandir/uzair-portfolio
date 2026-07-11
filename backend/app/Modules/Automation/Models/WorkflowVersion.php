<?php

namespace App\Modules\Automation\Models;

use Illuminate\Database\Eloquent\Model;

class WorkflowVersion extends Model
{
    protected $table = 'automation_workflow_versions';
    protected $guarded = ['id'];

    protected $casts = [
        'definition'   => 'array',
        'published_at' => 'datetime',
    ];
}
