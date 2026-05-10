<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class XpTransaction extends Model
{
    protected $fillable = [
        'user_id',
        'amount',
        'source',
        'source_id',
        'meta',
    ];

    protected function casts(): array
    {
        return [
            'amount'    => 'integer',
            'source_id' => 'integer',
            'meta'      => 'array',
        ];
    }

    // ── Source constants ────────────────────────────────────────────────────

    const SOURCE_STREAK_MILESTONE    = 'streak_milestone';
    const SOURCE_TASK_COMPLETED      = 'task_completed';
    const SOURCE_MICROTASK_COMPLETED = 'microtask_completed';
    const SOURCE_FOCUS_SESSION       = 'focus_session';
    const SOURCE_BONUS               = 'bonus';
    const SOURCE_MANUAL              = 'manual';
    const SOURCE_PENALTY             = 'penalty';

    // ── Relationships ───────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}