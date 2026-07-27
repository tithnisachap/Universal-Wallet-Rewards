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

        $query = Vendor::query()->with(['user:id,name,email', 'reviewer:id,name']);

        if ($status === 'history') {
            $query->whereIn('status', ['approved', 'rejected'])->orderByDesc('reviewed_at');
        } elseif ($status === 'all') {
            // The general vendor directory — every account regardless of
            // status, searchable by business name.
            $query->orderBy('business_name');
        } else {
            $query->where('status', $status)->orderByDesc('submitted_at');
        }

        if ($status === 'all' && $request->filled('search')) {
            $query->where('business_name', 'ilike', '%'.$request->string('search').'%');
        }

        $vendors = $query->paginate($request->integer('per_page', 20));

        return VendorResource::collection($vendors);
    }

    public function show(Vendor $vendor)
    {
        $this->authorize('view', $vendor);

        return new VendorResource($vendor->load([
            'user:id,name,email',
            'reviewer:id,name',
            'branches' => fn ($query) => $query->orderByDesc('is_main')->orderBy('name'),
            'promotions' => fn ($query) => $query->where('is_active', true)->orderByDesc('created_at'),
        ]));
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
