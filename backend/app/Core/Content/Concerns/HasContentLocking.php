<?php

namespace App\Core\Content\Concerns;

use Illuminate\Support\Str;

/**
 * Collaborative editing lock for any content model.
 * Prevents two editors from overwriting each other's changes.
 * Heartbeat system ensures stale locks auto-expire if the browser closes.
 *
 * Usage: add `use HasContentLocking;` to Blog, Portfolio, Pages, etc.
 * Required columns: checked_out_by, checked_out_at, lock_reason, lock_token, heartbeat_at
 */
trait HasContentLocking
{
    /** Lock timeout in minutes — override per model if needed */
    protected int $lockTimeoutMinutes = 30;

    /** Heartbeat timeout in seconds — lock goes stale if no ping received */
    protected int $heartbeatTimeoutSeconds = 60;

    // -------------------------------------------------------------------------
    // Lock State
    // -------------------------------------------------------------------------

    public function isCheckedOut(): bool
    {
        if (!$this->checked_out_by || !$this->checked_out_at) {
            return false;
        }

        // If heartbeat has gone stale, the lock is expired regardless of timeout
        if ($this->heartbeat_at && $this->heartbeat_at->copy()->addSeconds($this->heartbeatTimeoutSeconds)->isPast()) {
            return false;
        }

        return $this->checked_out_at->copy()->addMinutes($this->lockTimeoutMinutes)->isFuture();
    }

    public function isCheckedOutBy(int $userId): bool
    {
        return $this->isCheckedOut() && $this->checked_out_by === $userId;
    }

    // -------------------------------------------------------------------------
    // Lock Operations
    // -------------------------------------------------------------------------

    public function checkOut(int $userId, string $reason = ''): string
    {
        if ($this->isCheckedOut() && !$this->isCheckedOutBy($userId)) {
            $locker = $this->checkedOutBy?->name ?? 'Another user';
            throw new \DomainException("This content is currently locked by {$locker}.");
        }

        $token = Str::random(32);

        $this->update([
            'checked_out_by' => $userId,
            'checked_out_at' => now(),
            'lock_reason'    => $reason ?: 'Editing',
            'lock_token'     => $token,
            'heartbeat_at'   => now(),
        ]);

        return $token; // Return token to the editor's browser session
    }

    public function checkIn(): void
    {
        $this->update([
            'checked_out_by' => null,
            'checked_out_at' => null,
            'lock_reason'    => null,
            'lock_token'     => null,
            'heartbeat_at'   => null,
        ]);
    }

    /**
     * Called every 20–30 seconds by the editor's browser.
     * Keeps the lock alive. Stale if this stops coming.
     */
    public function heartbeat(string $token): void
    {
        if ($this->lock_token !== $token) {
            throw new \DomainException('Invalid lock token — cannot refresh heartbeat.');
        }

        $this->update(['heartbeat_at' => now()]);
    }

    /**
     * Force-release a stale lock (admin only).
     */
    public function forceCheckIn(): void
    {
        $this->checkIn();
    }

    // -------------------------------------------------------------------------
    // Relationships & Accessors
    // -------------------------------------------------------------------------

    public function checkedOutBy()
    {
        return $this->belongsTo(\App\Models\User::class, 'checked_out_by');
    }

    public function getLockStatusAttribute(): array
    {
        if (!$this->isCheckedOut()) {
            return ['locked' => false];
        }

        return [
            'locked'       => true,
            'by'           => $this->checkedOutBy?->name,
            'reason'       => $this->lock_reason,
            'since'        => $this->checked_out_at?->toISOString(),
            'expires'      => $this->checked_out_at?->addMinutes($this->lockTimeoutMinutes)->toISOString(),
            'last_ping'    => $this->heartbeat_at?->toISOString(),
        ];
    }
}
