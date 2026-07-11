<?php

namespace App\Events;

use App\Models\Block;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BlockPublished
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Block $block
    ) {}
}
