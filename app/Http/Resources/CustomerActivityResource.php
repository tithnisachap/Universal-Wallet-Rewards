<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerActivityResource extends JsonResource
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
            'customer_name' => $this->whenLoaded('customer', fn () => $this->customer->user?->name),
            'vendor_id' => $this->vendor_id,
            'vendor_name' => $this->whenLoaded('vendor', fn () => $this->vendor->business_name),
            'branch_id' => $this->branch_id,
            'branch_name' => $this->whenLoaded('branch', fn () => $this->branch?->name),
            'promotion_id' => $this->promotion_id,
            'type' => $this->type,
            'amount' => $this->amount,
            'note' => $this->note,
            'occurred_at' => $this->occurred_at,
        ];
    }
}
