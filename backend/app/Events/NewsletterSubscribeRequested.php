<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Modules\Newsletter\Subscriber;

class NewsletterSubscribeRequested
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Subscriber $subscriber
    ) {}
}
