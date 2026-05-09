<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\AuthResource;
use App\Mail\OtpMail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    /**
     * Register a new user and send OTP.
     *
     * POST /api/v1/auth/register
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $otp       = strval(random_int(100000, 999999));
        $now       = Carbon::now();

        $user = User::create([
            'name'           => $validated['name'],
            'email'          => $validated['email'],
            'password'       => $validated['password'],
            'otp'            => Hash::make($otp),
            'otp_expires_at' => $now->copy()->addMinutes(5),
            'otp_sent_at'    => $now,
            'is_active'      => false,
        ]);

        Mail::to($user->email)->send(new OtpMail($otp, $user->name));

        return response()->json([
            'success' => true,
            'message' => 'OTP sent to your email. Please verify your account.',
            'email'   => $user->email,
        ], 201);
    }

    /**
     * Verify OTP and activate account.
     *
     * POST /api/v1/auth/verify-otp
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'otp'   => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        if ($user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Email already verified.',
            ], 400);
        }

        // Guard: OTP columns missing means registration did not complete properly
        if (is_null($user->otp) || is_null($user->otp_expires_at)) {
            return response()->json([
                'success' => false,
                'message' => 'No pending OTP found. Please register again or request a new code.',
            ], 422);
        }

        if (Carbon::now()->greaterThan($user->otp_expires_at)) {
            return response()->json([
                'success' => false,
                'message' => 'OTP has expired. Please request a new one.',
            ], 422);
        }

        if (! Hash::check($request->otp, $user->otp)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid OTP. Please try again.',
            ], 422);
        }

        $user->update([
            'is_active'         => true,
            'email_verified_at' => Carbon::now(),
            'otp'               => null,
            'otp_expires_at'    => null,
            'otp_sent_at'       => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully. You can now log in.',
        ]);
    }

    /**
     * Resend OTP with 60-second cooldown.
     *
     * POST /api/v1/auth/resend-otp
     */
    public function resendOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        if ($user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Email already verified.',
            ], 400);
        }

        // 60-second cooldown
        if (
            ! is_null($user->otp_sent_at) &&
            Carbon::now()->lessThan(Carbon::parse($user->otp_sent_at)->addSeconds(60))
        ) {
            $secondsLeft = (int) Carbon::now()->diffInSeconds(
                Carbon::parse($user->otp_sent_at)->addSeconds(60)
            );

            return response()->json([
                'success'     => false,
                'message'     => 'Please wait before requesting another OTP.',
                'retry_after' => $secondsLeft,
            ], 429);
        }

        $otp = strval(random_int(100000, 999999));
        $now = Carbon::now();

        $user->update([
            'otp'            => Hash::make($otp),
            'otp_expires_at' => $now->copy()->addMinutes(5),
            'otp_sent_at'    => $now,
        ]);

        Mail::to($user->email)->send(new OtpMail($otp, $user->name));

        return response()->json([
            'success' => true,
            'message' => 'A new OTP has been sent to your email.',
        ]);
    }

    /**
     * Authenticate an existing user.
     *
     * POST /api/v1/auth/login
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials. Please check your email and password.',
            ], 401);
        }

        if (! $user->is_active) {
            return response()->json([
                'success'            => false,
                'message'            => 'Please verify your email before logging in.',
                'needs_verification' => true,
                'email'              => $user->email,
            ], 403);
        }

        // Revoke all previous tokens to enforce single-session
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful.',
            'data'    => new AuthResource($user, $token),
        ]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $user = $request->user();

        if (! Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect.',
            ], 422);
        }

        $user->update([
            'password' => $validated['password'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully.',
        ]);
    }

    /**
     * Revoke the current access token (logout).
     *
     * POST /api/v1/auth/logout
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }
}