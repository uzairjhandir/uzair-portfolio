<?php

namespace App\Modules\Newsletter;

use Illuminate\Support\Str;
use App\Events\NewsletterSubscribeRequested;

/**
 * Newsletter subscription service.
 * Does NOT extend Content Engine — newsletters are delivery/engagement domain.
 * Driver-based: swap Mailchimp / Resend / custom by changing the binding.
 */
class NewsletterService
{
    public function subscribe(string $email, ?string $firstName, array $listSlugs = []): Subscriber
    {
        // Find or create subscriber
        $subscriber = Subscriber::firstOrCreate(['email' => $email], [
            'first_name'        => $firstName,
            'status'            => 'pending',
            'unsubscribe_token' => Str::random(40),
        ]);

        // Link to specified lists (default list if none specified)
        $lists = empty($listSlugs)
            ? NewsletterList::where('is_default', true)->get()
            : NewsletterList::whereIn('slug', $listSlugs)->get();

        foreach ($lists as $list) {
            $subscriber->lists()->syncWithoutDetaching([$list->id => ['subscribed_at' => now()]]);
            $list->increment('subscriber_count');
        }

        // If pending, send confirmation email (double opt-in)
        if ($subscriber->status === 'pending') {
            // Event triggers a queued job in Module 21 (Notifications)
            event(new NewsletterSubscribeRequested($subscriber));
        }

        return $subscriber;
    }

    public function confirm(string $token): bool
    {
        $subscriber = Subscriber::where('unsubscribe_token', $token)->where('status', 'pending')->first();
        if (!$subscriber) return false;

        $subscriber->update([
            'status'       => 'confirmed',
            'confirmed_at' => now(),
        ]);

        return true;
    }

    public function unsubscribe(string $token): bool
    {
        $subscriber = Subscriber::where('unsubscribe_token', $token)->first();
        if (!$subscriber) return false;

        $subscriber->update([
            'status'           => 'unsubscribed',
            'unsubscribed_at'  => now(),
        ]);

        // Decrement all list counts
        foreach ($subscriber->lists as $list) {
            $list->decrement('subscriber_count');
        }

        return true;
    }
}
