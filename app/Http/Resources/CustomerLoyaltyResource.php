<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerLoyaltyResource extends JsonResource
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
            'vendor' => new VendorResource($this->whenLoaded('vendor')),
            'points_balance' => $this->points_balance,
            'stamps_count' => $this->stamps_count,
            'updated_at' => $this->updated_at,
        ];
    }
}
