<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class PromotionResource extends JsonResource
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
            'type' => $this->type,
            'category' => $this->category,
            'title' => $this->title,
            'description' => $this->description,
            'terms' => $this->terms,
            'required_amount' => $this->required_amount,
            'starts_at' => $this->starts_at,
            'ends_at' => $this->ends_at,
            'is_active' => $this->is_active,
            'display_status' => $this->displayStatus(),
            'created_at' => $this->created_at,
        ];
    }

    /**
     * Maps is_active + the date window onto the four labels the UI shows:
     * active, scheduled, expired, deactivated.
     */
    private function displayStatus(): string
    {
        if (! $this->is_active) {
            return $this->ends_at && Carbon::parse($this->ends_at)->isPast() ? 'expired' : 'deactivated';
        }

        if ($this->starts_at && Carbon::parse($this->starts_at)->isFuture()) {
            return 'scheduled';
        }

        if ($this->ends_at && Carbon::parse($this->ends_at)->isPast()) {
            return 'expired';
        }

        return 'active';
    }
}
