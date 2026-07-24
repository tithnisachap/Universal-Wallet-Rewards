<?php

namespace App\Services;

use App\Models\Branch;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Validation\ValidationException;

/**
 * Resolves "which vendor / which branch" a request is acting on, for both
 * the vendor owner (role: vendor) and a branch-scoped staff account (role:
 * branch_staff). Staff never get to choose their branch from client input —
 * it's always forced to whatever they were assigned, so a compromised or
 * malicious staff client can't write activity onto a sibling branch.
 */
class VendorAccessResolver
{
    public function vendorFor(User $user): ?Vendor
    {
        return $user->role === 'branch_staff'
            ? $user->branchStaff?->branch?->vendor
            : $user->vendor;
    }

    /**
     * @throws ValidationException if a vendor owner supplies a branch_id
     *         that doesn't belong to their own vendor.
     */
    public function branchFor(User $user, Vendor $vendor, ?int $requestedBranchId): ?Branch
    {
        if ($user->role === 'branch_staff') {
            return $user->branchStaff?->branch;
        }

        // The owner's own scanner isn't tied to a specific physical
        // location in the UI, so unless a branch is explicitly requested,
        // their activity is always attributed to their main branch.
        if (! $requestedBranchId) {
            return $vendor->branches()->where('is_main', true)->first();
        }

        $branch = Branch::where('id', $requestedBranchId)->where('vendor_id', $vendor->id)->first();

        if (! $branch) {
            throw ValidationException::withMessages([
                'branch_id' => 'That branch does not belong to your shop.',
            ]);
        }

        return $branch;
    }
}
