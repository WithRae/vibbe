<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;

class StreakService
{
    /**
     * Milestone definitions: days => xp_bonus
     */
    private const MILESTONES = [
        7   => 50,
        14  => 100,
        30  => 250,
        60  => 500,
        100 => 1000,
    ];

    /**
     * Called on every successful login.
     * Updates the streak and returns the current streak state.
     *
     * @return array{current: int, longest: int, mercy_tokens: int, is_broken: bool, milestone_hit: array|null}
     */
    public function handleLogin(User $user): array
    {
        $today     = Carbon::now('UTC')->toDateString();
        $lastLogin = $user->last_login_date
            ? Carbon::parse($user->last_login_date, 'UTC')->toDateString()
            : null;

        $milestoneHit = null;

        if ($lastLogin === null) {
            // First ever login
            $user->login_streak    = 1;
            $user->last_login_date = $today;

        } elseif ($lastLogin === $today) {
            // Already credited today — do nothing, just return current state

        } elseif ($lastLogin === Carbon::now('UTC')->subDay()->toDateString()) {
            // Consecutive day — increment
            $user->login_streak++;
            $user->last_login_date = $today;

            // Check milestone
            $milestoneHit = $this->checkMilestone($user->login_streak);

        } else {
            // Missed one or more days — streak broken
            $user->pre_break_streak = $user->login_streak;
            $user->login_streak     = 1;
            $user->last_login_date  = $today;
        }

        // Update longest streak record
        if ($user->login_streak > $user->longest_streak) {
            $user->longest_streak = $user->login_streak;
        }

        $user->save();

        return [
            'current'      => $user->login_streak,
            'longest'      => $user->longest_streak,
            'mercy_tokens' => $user->mercy_tokens,
            'is_broken'    => false,
            'milestone_hit' => $milestoneHit,
        ];
    }

    /**
     * Apply a mercy token to restore a broken streak.
     * Returns updated streak state or throws on failure.
     *
     * @throws \RuntimeException
     */
    public function applyMercyToken(User $user): array
    {
        if ($user->mercy_tokens <= 0) {
            throw new \RuntimeException('No mercy tokens remaining.');
        }

        $today     = Carbon::now('UTC')->toDateString();
        $lastLogin = $user->last_login_date
            ? Carbon::parse($user->last_login_date, 'UTC')->toDateString()
            : null;

        // Streak is only "broken" if last login was 2+ days ago
        $daysSince = $lastLogin
            ? Carbon::parse($lastLogin, 'UTC')->diffInDays(Carbon::now('UTC'))
            : null;

        if ($daysSince === null || $daysSince < 2) {
            throw new \RuntimeException('Your streak is not broken — no token needed.');
        }

        // Restore pre-break streak + credit today
        $restored = $user->pre_break_streak > 0
            ? $user->pre_break_streak
            : $user->login_streak;

        $user->login_streak     = $restored;
        $user->pre_break_streak = 0;
        $user->last_login_date  = $today;
        $user->mercy_tokens     = max(0, $user->mercy_tokens - 1);

        // Update longest if restored streak beats it
        if ($user->login_streak > $user->longest_streak) {
            $user->longest_streak = $user->login_streak;
        }

        $user->save();

        return [
            'current'      => $user->login_streak,
            'longest'      => $user->longest_streak,
            'mercy_tokens' => $user->mercy_tokens,
            'is_broken'    => false,
            'milestone_hit' => null,
        ];
    }

    /**
     * Refill mercy tokens for all users who used at least one.
     * Called on the 1st of each month.
     */
    public function refillAllMercyTokens(): int
    {
        return User::where('mercy_tokens', '<', 3)
            ->update(['mercy_tokens' => 3]);
    }

    /**
     * Build the streak state payload for a user without modifying anything.
     * Used by profile/get endpoints.
     *
     * @return array{current: int, longest: int, mercy_tokens: int, is_broken: bool, milestone_hit: null}
     */
    public function getStreakState(User $user): array
    {
        $lastLogin = $user->last_login_date
            ? Carbon::parse($user->last_login_date, 'UTC')->toDateString()
            : null;

        $today     = Carbon::now('UTC')->toDateString();
        $yesterday = Carbon::now('UTC')->subDay()->toDateString();

        $isBroken = $lastLogin !== null
            && $lastLogin !== $today
            && $lastLogin !== $yesterday;

        return [
            'current'       => $user->login_streak,
            'longest'       => $user->longest_streak,
            'mercy_tokens'  => $user->mercy_tokens,
            'is_broken'     => $isBroken,
            'milestone_hit' => null,
        ];
    }

    /**
     * Check if a streak count hits a defined milestone.
     *
     * @return array{days: int, xp_bonus: int}|null
     */
    private function checkMilestone(int $streak): ?array
    {
        if (array_key_exists($streak, self::MILESTONES)) {
            return [
                'days'     => $streak,
                'xp_bonus' => self::MILESTONES[$streak],
            ];
        }

        return null;
    }
}