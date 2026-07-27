<?php

namespace App\Http\Resources;

use App\Models\PlatformSetting;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VendorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $viewer = $request->user();
        $isOwnerOrAdmin = $viewer && ($viewer->role === 'admin' || $viewer->id === $this->user_id);

        return [
            'id' => $this->id,
            'business_name' => $this->business_name,
            'category' => $this->category,
            'logo_path' => $this->logo_path,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'website' => $this->website,
            'status' => $this->status,
            'submitted_at' => $this->when($isOwnerOrAdmin, $this->submitted_at),
            'reviewed_at' => $this->when($isOwnerOrAdmin, $this->reviewed_at),
            'review_note' => $this->when($isOwnerOrAdmin, $this->review_note),
            'owner' => new UserResource($this->whenLoaded('user')),
            'branches' => BranchResource::collection($this->whenLoaded('branches')),
            'branches_count' => $this->whenCounted('branches'),
            'promotions' => PromotionResource::collection($this->whenLoaded('promotions')),
            // Never tied to a specific admin account — pulled from platform
            // settings so it stays correct even if admin emails change.
            'support_email' => $this->when(
                $this->status === 'suspended',
                fn () => PlatformSetting::current()->support_email,
            ),
            'loyalty' => $this->when(
                isset($this->loyalty_snapshot),
                fn () => $this->loyalty_snapshot ? [
                    'points_balance' => $this->loyalty_snapshot->points_balance,
                    'stamps_count' => $this->loyalty_snapshot->stamps_count,
                ] : ['points_balance' => 0, 'stamps_count' => 0]
            ),
            'created_at' => $this->created_at,
        ];
    }
}
