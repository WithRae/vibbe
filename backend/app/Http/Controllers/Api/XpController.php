<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\XpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class XpController extends Controller
{
    public function __construct(private readonly XpService $xpService) {}

    /**
     * Return paginated XP transaction history for the authenticated user.
     *
     * GET /api/v1/xp/history
     *
     * Query params:
     *   per_page (int, default 20, max 100)
     */
    public function history(Request $request): JsonResponse
    {
        $perPage = min((int) $request->query('per_page', 20), 100);

        $history = $this->xpService->getHistory($request->user(), $perPage);

        return response()->json([
            'success' => true,
            'data'    => [
                'transactions' => $history->items(),
                'pagination'   => [
                    'total'        => $history->total(),
                    'per_page'     => $history->perPage(),
                    'current_page' => $history->currentPage(),
                    'last_page'    => $history->lastPage(),
                    'has_more'     => $history->hasMorePages(),
                ],
            ],
        ]);
    }

    /**
     * Return current XP and level state for the authenticated user.
     *
     * GET /api/v1/xp
     */
    public function state(Request $request): JsonResponse
    {
        $levelState = $this->xpService->getLevelState($request->user());

        return response()->json([
            'success' => true,
            'data'    => $levelState,
        ]);
    }
}