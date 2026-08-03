<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

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
            'vendor_name' => $this->whenLoaded('vendor', fn () => $this->vendor->business_name, $this->vendor_name),
            'name' => $this->name,
            'address' => $this->address,
            'phone' => $this->phone,
            'photo_url' => $this->photo_path ? Storage::disk('spaces')->url($this->photo_path) : null,
            'opening_hours' => $this->opening_hours,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'distance_km' => $this->when(isset($this->distance_km), fn () => round((float) $this->distance_km, 2)),
            'is_main' => $this->is_main,
            'created_at' => $this->created_at,
        ];
    }
}
