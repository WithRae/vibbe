<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserProfile;
use Illuminate\Http\Request;

class UserProfileController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'username' => 'required|string|max:100|unique:user_profiles,username',
            'dob' => 'required|date',
            'gender' => 'required|in:Male,Female,Other',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png|max:1024',
        ]);

        $avatarPath = null;

        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
        }

        $profile = UserProfile::create([
            'user_id' => $request->user()->id,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'username' => $request->username,
            'dob' => $request->dob,
            'gender' => $request->gender,
            'avatar' => $avatarPath,
        ]);

        return response()->json([
            'message' => 'Profile created successfully',
            'profile' => $profile
        ]);
    }
}