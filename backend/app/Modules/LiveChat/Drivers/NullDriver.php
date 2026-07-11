<?php

namespace App\Modules\LiveChat\Drivers;

use App\Modules\LiveChat\Contracts\LiveChatDriverInterface;

class NullDriver implements LiveChatDriverInterface
{
    public function name(): string
    {
        return 'none';
    }

    public function getConfig(): array
    {
        return [
            'provider' => 'none',
        ];
    }
}
