<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthResource extends JsonResource
{
    private string $token;
    private array  $streak;

    public function __construct(mixed $resource, string $token, array $streak)
    {
        parent::__construct($resource);
        $this->token  = $token;
        $this->streak = $streak;
    }

    public function toArray(Request $request): array
    {
        return [
            'user'   => new UserResource($this->resource),
            'token'  => $this->token,
            'streak' => $this->streak,
        ];
    }
}