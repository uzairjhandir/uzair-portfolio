<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Modules\Downloads\Download;
use App\Modules\Downloads\DownloadToken;

class DownloadRequested
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Download $download,
        public DownloadToken $token
    ) {}
}

class DownloadCompleted
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Download $download,
        public DownloadToken $token
    ) {}
}
