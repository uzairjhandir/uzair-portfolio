<?php

namespace App\Events;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ContentArchived
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Model $content
    ) {}
}
