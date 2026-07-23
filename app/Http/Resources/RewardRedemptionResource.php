<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RewardRedemptionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_id' => $this->customer_id,
            'vendor_id' => $this->vendor_id,
            'promotion' => new PromotionResource($this->whenLoaded('promotion')),
            'code' => $this->code,
            'status' => $this->status,
            'expires_at' => $this->expires_at,
            'redeemed_at' => $this->redeemed_at,
            'seconds_remaining' => $this->when(
                $this->status === 'pending',
                fn () => max(0, (int) now()->diffInSeconds($this->expires_at, false))
            ),
        ];
    }
}
