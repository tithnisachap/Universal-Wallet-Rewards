<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Models\CustomerActivity;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * "Today's Overview" tiles, optionally scoped to a single branch.
     */
    public function show(Request $request)
    {
        $vendor = $request->user()->vendor;

        abort_if(! $vendor, 404, 'No shop has been set up yet.');

        $query = CustomerActivity::where('vendor_id', $vendor->id)
            ->whereDate('occurred_at', now()->toDateString());

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->integer('branch_id'));
        }

        $todayActivities = $query->get();

        return response()->json([
            'data' => [
                'vendor_status' => $vendor->status,
                'today' => [
                    'stamps_added' => (int) $todayActivities->where('type', 'stamp_earned')->sum('amount'),
                    'points_added' => (int) $todayActivities->where('type', 'points_earned')->sum('amount'),
                    'stamps_redeemed' => (int) $todayActivities->where('type', 'reward_redeemed')->count(),
                    'points_deducted' => (int) abs($todayActivities->where('type', 'points_deducted')->sum('amount')),
                ],
            ],
        ]);
    }
}
