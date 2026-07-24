<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\InviteBranchStaffRequest;
use App\Http\Resources\BranchStaffResource;
use App\Models\Branch;
use App\Models\BranchStaff;

class BranchStaffController extends Controller
{
    /**
     * List everyone invited to (or actively staffing) this branch.
     */
    public function index(Branch $branch)
    {
        $this->authorize('update', $branch);

        return BranchStaffResource::collection(
            $branch->staff()->with('user')->latest()->get()
        );
    }

    /**
     * Invite a Google account to manage this one branch. They don't get
     * access until they actually sign in with that exact email — see
     * GoogleAuthController::callback().
     */
    public function store(InviteBranchStaffRequest $request, Branch $branch)
    {
        $this->authorize('update', $branch);

        $staff = $branch->staff()->create([
            'email' => $request->validated('email'),
            'invited_by' => $request->user()->id,
        ]);

        return new BranchStaffResource($staff);
    }

    /**
     * Revoke a staff member's access to this branch.
     */
    public function destroy(Branch $branch, BranchStaff $staff)
    {
        $this->authorize('update', $branch);

        abort_if($staff->branch_id !== $branch->id, 404);

        $staff->delete();

        return response()->noContent();
    }
}
