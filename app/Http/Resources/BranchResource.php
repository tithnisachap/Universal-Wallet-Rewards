<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BranchResource extends JsonResource
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
            'vendor_id' => $this->vendor_id,
            'vendor_name' => $this->whenLoaded('vendor', fn () => $this->vendor->business_name, $this->attributes['vendor_name'] ?? null),
            'name' => $this->name,
            'address' => $this->address,
            'phone' => $this->phone,
            'photo_path' => $this->photo_path,
            'opening_hours' => $this->opening_hours,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'distance_km' => $this->when(isset($this->distance_km), fn () => round((float) $this->distance_km, 2)),
            'is_main' => $this->is_main,
            'created_at' => $this->created_at,
        ];
    }
}
