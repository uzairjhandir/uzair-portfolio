<?php

namespace App\Modules\Automation\Actions;

use App\Core\Automation\WorkflowContext;
use App\Modules\Automation\Contracts\AutomationActionInterface;
use App\Modules\Automation\Models\WorkflowRun;
use Illuminate\Support\Facades\Http;

class WebhookAction implements AutomationActionInterface
{
    public function type(): string { return 'webhook'; }

    public function execute(string $nodeId, array $config, WorkflowContext $context, WorkflowRun $run): array
    {
        $url = $config['url'] ?? null;
        if (!$url) {
            throw new \InvalidArgumentException("Webhook URL is required.");
        }

        // We can substitute {{variables}} in the URL using the context
        foreach ($context->toArray() as $key => $value) {
            if (is_scalar($value)) {
                $url = str_replace('{{' . $key . '}}', (string)$value, $url);
            }
        }

        $payload = $config['payload'] ?? $context->toArray();

        $response = Http::post($url, $payload);

        if (!$response->successful()) {
            throw new \RuntimeException("Webhook action failed with status {$response->status()}");
        }

        return [
            'webhook_response_status' => $response->status(),
            'webhook_response_body'   => $response->body(),
        ];
    }
}
