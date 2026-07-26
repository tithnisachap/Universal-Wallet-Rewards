<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'role' => $this->role,
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'vendor' => new VendorResource($this->whenLoaded('vendor')),
            'branch' => $this->when(
                $this->role === 'branch_staff' && $this->branchStaff?->branch,
                fn () => ['id' => $this->branchStaff->branch->id, 'name' => $this->branchStaff->branch->name],
            ),
            'created_at' => $this->created_at,
        ];
    }
}
