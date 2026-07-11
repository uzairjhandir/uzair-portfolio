<?php

namespace App\Modules\LiveChat;

use App\Modules\LiveChat\Drivers\CrispDriver;
use App\Modules\LiveChat\Drivers\NullDriver;
use App\Modules\LiveChat\Drivers\TawkToDriver;
use App\Modules\Settings\SettingsManager;
use InvalidArgumentException;

class LiveChatManager
{
    public function __construct(private SettingsManager $settings) {}

    public function driver(): Contracts\LiveChatDriverInterface
    {
        $enabled = $this->settings->get('livechat.enabled', false);

        if (!$enabled) {
            return new NullDriver();
        }

        $provider = $this->settings->get('livechat.provider', 'none');

        return match ($provider) {
            'tawk.to' => new TawkToDriver($this->settings),
            'crisp'   => new CrispDriver($this->settings),
            'none'    => new NullDriver(),
            default   => throw new InvalidArgumentException("Live Chat provider [{$provider}] is not supported."),
        };
    }
}
