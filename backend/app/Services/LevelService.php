<?php

namespace App\Services;

class LevelService
{
    /**
     * XP required to REACH each level.
     * Level 1 starts at 0 XP (everyone begins here).
     * Level 10 is the max display level — XP continues beyond it.
     */
    public const THRESHOLDS = [
        1  => 0,
        2  => 100,
        3  => 300,
        4  => 600,
        5  => 1000,
        6  => 1500,
        7  => 2200,
        8  => 3000,
        9  => 4000,
        10 => 5500,
    ];

    public const MAX_LEVEL = 10;

    /**
     * Compute the full level state for a given XP total.
     *
     * Returns:
     *  - level:                current level (capped at MAX_LEVEL)
     *  - total_xp:             raw XP total (never capped)
     *  - current_level_xp:     XP earned within the current level
     *  - next_level_xp:        XP needed to complete the current level
     *  - progress_percent:     0–100 progress through the current level
     *  - is_max_level:         true when level === MAX_LEVEL
     *
     * @return array{
     *   level: int,
     *   total_xp: int,
     *   current_level_xp: int,
     *   next_level_xp: int,
     *   progress_percent: float,
     *   is_max_level: bool,
     * }
     */
    public function compute(int $totalXp): array
    {
        $level = 1;

        foreach (self::THRESHOLDS as $lvl => $required) {
            if ($totalXp >= $required) {
                $level = $lvl;
            }
        }

        $isMaxLevel = $level >= self::MAX_LEVEL;

        if ($isMaxLevel) {
            // At max level XP keeps accumulating but progress bar stays full
            $currentLevelXp  = $totalXp - self::THRESHOLDS[self::MAX_LEVEL];
            $nextLevelXp     = 0; // no next level
            $progressPercent = 100.0;
        } else {
            $currentLevelStart = self::THRESHOLDS[$level];
            $nextLevelStart    = self::THRESHOLDS[$level + 1];
            $levelRange        = $nextLevelStart - $currentLevelStart;

            $currentLevelXp  = $totalXp - $currentLevelStart;
            $nextLevelXp     = $levelRange;
            $progressPercent = round(($currentLevelXp / $levelRange) * 100, 2);
        }

        return [
            'level'             => $level,
            'total_xp'          => $totalXp,
            'current_level_xp'  => $currentLevelXp,
            'next_level_xp'     => $nextLevelXp,
            'progress_percent'  => $progressPercent,
            'is_max_level'      => $isMaxLevel,
        ];
    }

    /**
     * Check if crossing a new level boundary between old and new XP.
     * Returns the new level if a level-up occurred, null otherwise.
     */
    public function checkLevelUp(int $xpBefore, int $xpAfter): ?int
    {
        $levelBefore = $this->compute($xpBefore)['level'];
        $levelAfter  = $this->compute($xpAfter)['level'];

        return $levelAfter > $levelBefore ? $levelAfter : null;
    }
}