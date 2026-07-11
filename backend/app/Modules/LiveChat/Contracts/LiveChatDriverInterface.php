<?php

namespace App\Modules\LiveChat\Contracts;

interface LiveChatDriverInterface
{
    public function name(): string;
    
    /**
     * Return the widget configuration necessary for the frontend to render the chat.
     */
    public function getConfig(): array;
}
