<?php

namespace App\Http\Resources;

use App\Services\LevelService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Never expose: password, remember_token, email_verified_at internals.
     * Only expose what the client actually needs.
     */
    public function toArray(Request $request): array
    {
        $levelService = app(LevelService::class);
        $levelState   = $levelService->compute($this->xp ?? 0);

        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'email'      => $this->email,
            'profile_completed' => $this->profile_completed,
            'created_at' => $this->created_at?->toISOString(),
            'xp'                => [
                'total'             => $levelState['total_xp'],
                'level'             => $levelState['level'],
                'current_level_xp'  => $levelState['current_level_xp'],
                'next_level_xp'     => $levelState['next_level_xp'],
                'progress_percent'  => $levelState['progress_percent'],
                'is_max_level'      => $levelState['is_max_level'],
            ],
        ];
    }
}