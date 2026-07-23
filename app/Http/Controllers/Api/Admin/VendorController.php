<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReviewVendorRequest;
use App\Http\Resources\VendorResource;
use App\Models\Vendor;
use App\Services\VendorReviewService;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    public function __construct(private readonly VendorReviewService $vendorReviewService) {}

    /**
     * Applications tab (?status=pending|approved|rejected) or the History
     * tab (?status=history, meaning "anything already reviewed").
     */
    public function index(Request $request)
    {
        $status = $request->string('status', 'pending')->toString();

        $query = Vendor::query()->with('reviewer:id,name');

        if ($status === 'history') {
            $query->whereIn('status', ['approved', 'rejected']);
        } else {
            $query->where('status', $status);
        }

        $vendors = $query->orderByDesc('submitted_at')->paginate($request->integer('per_page', 20));

        return VendorResource::collection($vendors);
    }

    public function show(Vendor $vendor)
    {
        $this->authorize('view', $vendor);

        return new VendorResource($vendor->load('reviewer:id,name'));
    }

    public function review(ReviewVendorRequest $request, Vendor $vendor)
    {
        $this->authorize('review', $vendor);

        $vendor = $this->vendorReviewService->review(
            $vendor,
            $request->user(),
            $request->validated('decision'),
            $request->validated('review_note')
        );

        return new VendorResource($vendor);
    }

    public function suspend(Request $request, Vendor $vendor)
    {
        $this->authorize('suspend', $vendor);

        $request->validate(['review_note' => ['nullable', 'string', 'max:1000']]);

        $vendor = $this->vendorReviewService->suspend($vendor, $request->user(), $request->input('review_note'));

        return new VendorResource($vendor);
    }

    public function reinstate(Request $request, Vendor $vendor)
    {
        $this->authorize('suspend', $vendor);

        $vendor = $this->vendorReviewService->reinstate($vendor, $request->user());

        return new VendorResource($vendor);
    }
}
