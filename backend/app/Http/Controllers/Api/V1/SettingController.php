<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Interfaces\SettingRepositoryInterface;
use App\Services\SettingService;
use App\Http\Requests\Settings\BulkUpdateSettingsRequest;
use App\Http\Resources\SettingCategoryResource;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function __construct(
        protected SettingRepositoryInterface $settingRepository,
        protected SettingService $settingService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Setting::class);
        
        $categories = $this->settingRepository->getAllGrouped();

        // Transform into a keyed structure if desired, or return collection
        // Based on user request: { "general": {...}, "seo": {...} }
        $structured = [];
        foreach ($categories as $category) {
            $structured[$category->slug] = new SettingCategoryResource($category);
        }

        return response()->json([
            'success' => true,
            'message' => 'Settings retrieved successfully',
            'data' => $structured,
            'errors' => null,
            'meta' => null
        ]);
    }

    public function public(Request $request): JsonResponse
    {
        $groups = $request->query('group') ? explode(',', $request->query('group')) : [];
        $keys = $request->query('keys') ? explode(',', $request->query('keys')) : [];
        
        $categories = $this->settingRepository->getPublic($groups, $keys);

        $structured = [];
        foreach ($categories as $category) {
            $structured[$category->slug] = new SettingCategoryResource($category);
        }

        return response()->json([
            'success' => true,
            'message' => 'Public settings retrieved successfully',
            'data' => $structured,
            'errors' => null,
            'meta' => null
        ]);
    }

    public function update(BulkUpdateSettingsRequest $request): JsonResponse
    {
        $this->authorize('update', Setting::class);

        $this->settingService->bulkUpdate($request->validated('settings'));

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully',
            'data' => null,
            'errors' => null,
            'meta' => null
        ]);
    }

    /**
     * POST /api/v1/settings/email/test-connection
     * Opens an SMTP connection with the currently saved email.* settings
     * (or an override supplied in the request) and reports success/failure
     * without sending a message.
     */
    public function testEmailConnection(Request $request): JsonResponse
    {
        $this->authorize('update', Setting::class);

        $config = $this->resolveMailConfig($request);

        // A placeholder/unreachable host would otherwise hang until PHP's
        // max_execution_time and crash the whole request as a 500 instead of
        // reporting a clean failure — set an explicit connect timeout.
        set_time_limit(15);

        try {
            $transport = new \Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport(
                $config['host'],
                $config['port'],
                $config['encryption'] === 'tls'
            );
            $transport->getStream()->setTimeout(10);
            if ($config['username']) {
                $transport->setUsername($config['username']);
                $transport->setPassword($config['password']);
            }
            $transport->start();
            $transport->stop();

            return response()->json(['success' => true, 'message' => 'SMTP connection succeeded.']);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * POST /api/v1/settings/email/test-send
     * Sends a real test email using the saved (or overridden) email.* settings.
     */
    public function testEmailSend(Request $request): JsonResponse
    {
        $this->authorize('update', Setting::class);

        $validated = $request->validate(['to' => ['required', 'email']]);
        $config = $this->resolveMailConfig($request);

        try {
            config([
                'mail.mailers.smtp.host'       => $config['host'],
                'mail.mailers.smtp.port'       => $config['port'],
                'mail.mailers.smtp.encryption' => $config['encryption'],
                'mail.mailers.smtp.username'   => $config['username'],
                'mail.mailers.smtp.password'   => $config['password'],
                'mail.from.address'            => $config['from_address'] ?: $config['username'],
                'mail.from.name'               => $config['from_name'] ?: config('app.name'),
            ]);

            \Illuminate\Support\Facades\Mail::raw(
                'This is a test email from your Admin Panel Settings > Email (SMTP) page.',
                fn($message) => $message->to($validated['to'])->subject('SMTP Test Email')
            );

            return response()->json(['success' => true, 'message' => "Test email sent to {$validated['to']}."]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * Builds SMTP config from saved email.* settings, allowing the request
     * body to override any field so an admin can test before saving.
     */
    private function resolveMailConfig(Request $request): array
    {
        return [
            'host'         => $request->input('smtp_host', $this->settingService->get('email.smtp_host')),
            'port'         => (int) $request->input('smtp_port', $this->settingService->get('email.smtp_port', 587)),
            'username'     => $request->input('smtp_username', $this->settingService->get('email.smtp_username')),
            'password'     => $request->input('smtp_password', $this->settingService->get('email.smtp_password')),
            'encryption'   => $request->input('smtp_encryption', $this->settingService->get('email.smtp_encryption', 'tls')),
            'from_address' => $request->input('from_address', $this->settingService->get('email.from_address')),
            'from_name'    => $request->input('from_name', $this->settingService->get('email.from_name')),
        ];
    }
}
