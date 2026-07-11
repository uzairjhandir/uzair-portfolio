<?php

namespace App\Modules\LiveChat\Drivers;

use App\Modules\LiveChat\Contracts\LiveChatDriverInterface;
use App\Modules\Settings\SettingsManager;

class TawkToDriver implements LiveChatDriverInterface
{
    public function __construct(private SettingsManager $settings) {}

    public function name(): string
    {
        return 'tawk.to';
    }

    public function getConfig(): array
    {
        return [
            'provider'   => 'tawk.to',
            'propertyId' => $this->settings->get('livechat.tawkto.property_id'),
            'widgetId'   => $this->settings->get('livechat.tawkto.widget_id'),
            // UI Overrides
            'position'   => $this->settings->get('livechat.position', 'bottom-right'),
            'mobile_enabled' => $this->settings->get('livechat.mobile_enabled', true),
        ];
    }
}
