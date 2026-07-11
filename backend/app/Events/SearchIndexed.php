<?php

namespace App\Events;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SearchIndexed
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Model $subject,
        public array $context = []
    ) {}
}
