<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MercyController;
use App\Http\Controllers\Api\UserProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ── Auth (public) ──────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register',    [AuthController::class, 'register']);
    Route::post('/verify-otp',  [AuthController::class, 'verifyOtp']);
    Route::post('/resend-otp',  [AuthController::class, 'resendOtp']);
    Route::post('/login',       [AuthController::class, 'login']);

    // ── Auth (protected) ───────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout',    [AuthController::class, 'logout']);
        Route::patch('/password', [AuthController::class, 'updatePassword']);
    });
});

// ── Protected Resources ────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/profile',  [UserProfileController::class, 'store']);
    Route::get('/profile',   [UserProfileController::class, 'show']);

    // ── Streak ─────────────────────────────────────────────────────────────
    Route::post('/streak/mercy', [MercyController::class, 'apply']);
});