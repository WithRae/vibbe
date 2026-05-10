<?php

namespace App\Services;

use App\Models\User;
use App\Models\XpTransaction;
use Illuminate\Support\Facades\DB;

class XpService
{
    /**
     * XP rewards keyed by source type.
     * For sources with variable rewards (task_completed),
     * pass the amount explicitly — these are just defaults/references.
     */
    public const REWARDS = [
        XpTransaction::SOURCE_STREAK_MILESTONE    => 0,   // variable — set by milestone config
        XpTransaction::SOURCE_TASK_COMPLETED      => 30,  // default medium; override per priority
        XpTransaction::SOURCE_MICROTASK_COMPLETED => 10,
        XpTransaction::SOURCE_FOCUS_SESSION       => 40,
        XpTransaction::SOURCE_BONUS               => 0,   // always explicit
        XpTransaction::SOURCE_MANUAL              => 0,   // always explicit
        XpTransaction::SOURCE_PENALTY             => 0,   // always explicit (negative)
    ];

    /**
     * Task priority XP overrides.
     */
    public const TASK_XP = [
        'low'    => 20,
        'medium' => 30,
        'high'   => 50,
    ];

    public function __construct(private readonly LevelService $levelService) {}

    /**
     * Award XP to a user and record the transaction.
     *
     * This is the ONLY method that should write XP.
     * All services (StreakService, TaskService, FocusService, etc.) call this.
     *
     * @param  User        $user
     * @param  string      $source     One of XpTransaction::SOURCE_* constants
     * @param  int         $amount     XP to award (positive) or deduct (negative)
     * @param  int|null    $sourceId   Optional FK to originating record
     * @param  array       $meta       Optional context data stored as JSON
     *
     * @return array{
     *   transaction: XpTransaction,
     *   xp_before: int,
     *   xp_after: int,
     *   level_up: int|null,
     *   level_state: array,
     * }
     */
    public function award(
        User    $user,
        string  $source,
        int     $amount,
        ?int    $sourceId = null,
        array   $meta     = [],
    ): array {
        $xpBefore = $user->xp;

        DB::transaction(function () use ($user, $source, $amount, $sourceId, $meta, &$transaction) {
            // Record the transaction
            $transaction = XpTransaction::create([
                'user_id'   => $user->id,
                'amount'    => $amount,
                'source'    => $source,
                'source_id' => $sourceId,
                'meta'      => empty($meta) ? null : $meta,
            ]);

            // Update cached XP — floor at 0 so penalties never go negative
            $user->xp = max(0, $user->xp + $amount);
            $user->save();
        });

        $xpAfter    = $user->xp;
        $levelUp    = $this->levelService->checkLevelUp($xpBefore, $xpAfter);
        $levelState = $this->levelService->compute($xpAfter);

        return [
            'transaction' => $transaction,
            'xp_before'   => $xpBefore,
            'xp_after'    => $xpAfter,
            'level_up'    => $levelUp,
            'level_state' => $levelState,
        ];
    }

    /**
     * Get the current level state for a user without awarding anything.
     */
    public function getLevelState(User $user): array
    {
        return $this->levelService->compute($user->xp);
    }

    /**
     * Get paginated XP transaction history for a user.
     *
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function getHistory(User $user, int $perPage = 20)
    {
        return $user->xpTransactions()
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }
}