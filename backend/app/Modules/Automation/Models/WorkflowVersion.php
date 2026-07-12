<?php

namespace App\Modules\Automation\Models;

use Illuminate\Database\Eloquent\Model;

class WorkflowVersion extends Model
{
    // automation_workflow_versions has no created_at/updated_at columns —
    // only published_at (the migration never calls ->timestamps()).
    public $timestamps = false;

    protected $table = 'automation_workflow_versions';
    protected $guarded = ['id'];

    protected $casts = [
        'definition'   => 'array',
        'published_at' => 'datetime',
    ];
}
