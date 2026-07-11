<?php

namespace App\Modules\Automation\Models;

use Illuminate\Database\Eloquent\Model;

class ActionResult extends Model
{
    protected $table = 'automation_action_results';
    protected $guarded = ['id'];

    protected $casts = [
        'output'       => 'array',
        'started_at'   => 'datetime',
        'completed_at' => 'datetime',
    ];
}
