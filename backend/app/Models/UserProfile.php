<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'username',
        'dob',
        'gender',
        'avatar',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}