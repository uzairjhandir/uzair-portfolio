<?php

namespace App\Modules\LiveChat\Http\Controllers;

use App\Modules\LiveChat\LiveChatManager;
use Illuminate\Http\JsonResponse;

class LiveChatConfigController
{
    public function __construct(private LiveChatManager $manager) {}

    /**
     * GET /api/v1/livechat/config
     */
    public function config(): JsonResponse
    {
        $driver = $this->manager->driver();

        return response()->json([
            'enabled' => $driver->name() !== 'none',
            'config'  => $driver->getConfig(),
        ]);
    }
}
