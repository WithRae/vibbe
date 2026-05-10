<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\StreakService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MercyController extends Controller
{
    public function __construct(private readonly StreakService $streakService) {}

    /**
     * Apply a mercy token to restore a broken streak.
     *
     * POST /api/v1/streak/mercy
     */
    public function apply(Request $request): JsonResponse
    {
        try {
            $streak = $this->streakService->applyMercyToken($request->user());

            return response()->json([
                'success' => true,
                'message' => 'Mercy token applied. Streak restored!',
                'data'    => ['streak' => $streak],
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}