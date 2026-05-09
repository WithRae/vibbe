<?php

namespace App\Http\Resources;

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
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'email'      => $this->email,
            'profile_completed' => $this->profile_completed,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}