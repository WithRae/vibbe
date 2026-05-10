<?php

namespace App\Services;

use App\Models\User;
use App\Models\XpTransaction;
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

    public function __construct(private readonly XpService $xpService) {}

    /**
     * Called on every successful login.
     * Updates the streak, awards milestone XP if applicable,
     * and returns the current streak + XP state.
     *
     * @return array{
     *   current: int,
     *   longest: int,
     *   mercy_tokens: int,
     *   is_broken: bool,
     *   milestone_hit: array|null,
     *   xp_awarded: int,
     *   level_up: int|null,
     * }
     */
    public function handleLogin(User $user): array
    {
        $today     = Carbon::now('UTC')->toDateString();
        $lastLogin = $user->last_login_date
            ? Carbon::parse($user->last_login_date, 'UTC')->toDateString()
            : null;

        $milestoneHit = null;
        $xpAwarded    = 0;
        $levelUp      = null;

        if ($lastLogin === null) {
            // First ever login
            $user->login_streak    = 1;
            $user->last_login_date = $today;

        } elseif ($lastLogin === $today) {
            // Already credited today — return current state unchanged

        } elseif ($lastLogin === Carbon::now('UTC')->subDay()->toDateString()) {
            // Consecutive day — increment
            $user->login_streak++;
            $user->last_login_date = $today;

            // Check and award milestone XP
            if (array_key_exists($user->login_streak, self::MILESTONES)) {
                $milestoneXp  = self::MILESTONES[$user->login_streak];
                $milestoneHit = [
                    'days'     => $user->login_streak,
                    'xp_bonus' => $milestoneXp,
                ];

                $result    = $this->xpService->award(
                    user:     $user,
                    source:   XpTransaction::SOURCE_STREAK_MILESTONE,
                    amount:   $milestoneXp,
                    sourceId: null,
                    meta:     [
                        'streak_days' => $user->login_streak,
                        'milestone'   => true,
                    ],
                );

                $xpAwarded = $milestoneXp;
                $levelUp   = $result['level_up'];
            }

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
            'xp_awarded'   => $xpAwarded,
            'level_up'     => $levelUp,
        ];
    }

    /**
     * Apply a mercy token to restore a broken streak.
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

        $daysSince = $lastLogin
            ? Carbon::parse($lastLogin, 'UTC')->diffInDays(Carbon::now('UTC'))
            : null;

        if ($daysSince === null || $daysSince < 2) {
            throw new \RuntimeException('Your streak is not broken — no token needed.');
        }

        $restored = $user->pre_break_streak > 0
            ? $user->pre_break_streak
            : $user->login_streak;

        $user->login_streak     = $restored;
        $user->pre_break_streak = 0;
        $user->last_login_date  = $today;
        $user->mercy_tokens     = max(0, $user->mercy_tokens - 1);

        if ($user->login_streak > $user->longest_streak) {
            $user->longest_streak = $user->login_streak;
        }

        $user->save();

        return [
            'current'       => $user->login_streak,
            'longest'       => $user->longest_streak,
            'mercy_tokens'  => $user->mercy_tokens,
            'is_broken'     => false,
            'milestone_hit' => null,
            'xp_awarded'    => 0,
            'level_up'      => null,
        ];
    }

    /**
     * Refill mercy tokens for all users who used at least one.
     * Called on the 1st of each month.
     */
    public function refillAllMercyTokens(): int
    {
        return \App\Models\User::where('mercy_tokens', '<', 3)
            ->update(['mercy_tokens' => 3]);
    }

    /**
     * Build the streak state payload without modifying anything.
     * Used by GET /profile.
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
            'xp_awarded'    => 0,
            'level_up'      => null,
        ];
    }
}