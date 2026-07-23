<?php

namespace App\Services;

use App\Models\User;
use App\Models\Vendor;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Owns the vendor application review workflow (admin approving/rejecting
 * a submission) and account suspension. Kept as a service, rather than
 * inline in the controller, because reviewing touches several fields
 * atomically and is the kind of state transition future steps (e.g.
 * notifying the vendor by email) will hang additional work off of.
 */
class VendorReviewService
{
    public function review(Vendor $vendor, User $admin, string $decision, ?string $note = null): Vendor
    {
        if ($vendor->status !== 'pending') {
            throw ValidationException::withMessages([
                'decision' => 'Only pending applications can be reviewed.',
            ]);
        }

        return DB::transaction(function () use ($vendor, $admin, $decision, $note) {
            $vendor->update([
                'status' => $decision,
                'reviewed_at' => now(),
                'reviewed_by' => $admin->id,
                'review_note' => $note,
            ]);

            return $vendor->fresh();
        });
    }

    public function suspend(Vendor $vendor, User $admin, ?string $note = null): Vendor
    {
        if ($vendor->status !== 'approved') {
            throw ValidationException::withMessages([
                'status' => 'Only approved vendors can be suspended.',
            ]);
        }

        return DB::transaction(function () use ($vendor, $admin, $note) {
            $vendor->update([
                'status' => 'suspended',
                'reviewed_at' => now(),
                'reviewed_by' => $admin->id,
                'review_note' => $note,
            ]);

            return $vendor->fresh();
        });
    }

    public function reinstate(Vendor $vendor, User $admin): Vendor
    {
        if ($vendor->status !== 'suspended') {
            throw ValidationException::withMessages([
                'status' => 'Only suspended vendors can be reinstated.',
            ]);
        }

        return DB::transaction(function () use ($vendor, $admin) {
            $vendor->update([
                'status' => 'approved',
                'reviewed_at' => now(),
                'reviewed_by' => $admin->id,
                'review_note' => null,
            ]);

            return $vendor->fresh();
        });
    }
}
