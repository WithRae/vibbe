<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'name',
    'email',
    'password',
    'otp',
    'otp_expires_at',
    'otp_sent_at',
    'is_active',
    'profile_completed',
    'login_streak',
    'longest_streak',
    'pre_break_streak',
    'last_login_date',
    'mercy_tokens',
])]
#[Hidden(['password', 'remember_token', 'otp', 'otp_expires_at', 'otp_sent_at'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at'  => 'datetime',
            'otp_expires_at'     => 'datetime',
            'otp_sent_at'        => 'datetime',
            'last_login_date'    => 'date',
            'is_active'          => 'boolean',
            'profile_completed'  => 'boolean',
            'password'           => 'hashed',
            'login_streak'       => 'integer',
            'longest_streak'     => 'integer',
            'pre_break_streak'   => 'integer',
            'mercy_tokens'       => 'integer',
        ];
    }

    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }
}