<?php

namespace App\Http\Resources;

use App\Models\CustomerLoyalty;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CustomerResource extends JsonResource
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
            'customer_code' => $this->customer_code,
            'name' => $this->whenLoaded('user', fn () => $this->user->name),
            'email' => $this->whenLoaded('user', fn () => $this->user->email),
            'avatar' => $this->whenLoaded('user', fn () => $this->user->avatar),
            'member_since' => $this->created_at,
            'is_suspended' => ! is_null($this->suspended_at),
            // Admin customer-detail view only: every vendor this customer
            // has an existing loyalty account with (not a full directory).
            'vendors' => $this->when(
                isset($this->vendor_loyalty_list),
                fn () => $this->vendor_loyalty_list->map(fn (CustomerLoyalty $loyalty) => [
                    'vendor_id' => $loyalty->vendor_id,
                    'business_name' => $loyalty->vendor->business_name,
                    'logo_url' => $loyalty->vendor->logo_path ? Storage::disk('spaces')->url($loyalty->vendor->logo_path) : null,
                    'category' => $loyalty->vendor->category,
                    'points_balance' => $loyalty->points_balance,
                    'stamps_count' => $loyalty->stamps_count,
                ]),
            ),
        ];
    }
}
