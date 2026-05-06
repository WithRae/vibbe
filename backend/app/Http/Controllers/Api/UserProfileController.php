<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\UserProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserProfileController extends Controller
{
    /**
     * Create or update the authenticated user's profile.
     *
     * POST /api/v1/profile
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name'  => ['required', 'string', 'max:100'],
            'username'   => [
                'required',
                'string',
                'max:100',
                Rule::unique('user_profiles', 'username')
                    ->ignore($request->user()->profile?->id),
            ],
            'dob'        => ['required', 'date'],
            'gender'     => ['required', Rule::in(['Male', 'Female', 'Other'])],
            'avatar'     => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:1024'],
        ]);

        $avatarPath = null;

        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
        }

        $profile = UserProfile::updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'first_name' => $validated['first_name'],
                'last_name'  => $validated['last_name'],
                'username'   => $validated['username'],
                'dob'        => $validated['dob'],
                'gender'     => $validated['gender'],
                'avatar'     => $avatarPath ?? $request->user()->profile?->avatar,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Profile saved successfully.',
            'data'    => $profile,
        ]);
    }

    /**
     * Return the authenticated user's profile.
     *
     * GET /api/v1/profile
     */
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $request->user()->load('profile'),
        ]);
    }
}