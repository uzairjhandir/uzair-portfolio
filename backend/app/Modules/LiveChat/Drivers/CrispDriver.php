<?php

namespace App\Modules\LiveChat\Drivers;

use App\Modules\LiveChat\Contracts\LiveChatDriverInterface;
use App\Modules\Settings\SettingsManager;

class CrispDriver implements LiveChatDriverInterface
{
    public function __construct(private SettingsManager $settings) {}

    public function name(): string
    {
        return 'crisp';
    }

    public function getConfig(): array
    {
        return [
            'provider'   => 'crisp',
            'websiteId'  => $this->settings->get('livechat.crisp.website_id'),
            // UI Overrides
            'position'   => $this->settings->get('livechat.position', 'bottom-right'),
            'mobile_enabled' => $this->settings->get('livechat.mobile_enabled', true),
        ];
    }
}
