<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\StorePromotionRequest;
use App\Http\Requests\Vendor\UpdatePromotionRequest;
use App\Http\Resources\PromotionResource;
use App\Models\Promotion;
use App\Services\VendorAccessResolver;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    public function __construct(private readonly VendorAccessResolver $access) {}

    public function index(Request $request)
    {
        $vendor = $this->access->vendorFor($request->user());

        abort_if(! $vendor, 404, 'No shop has been set up yet.');

        $promotions = $vendor->promotions()->orderByDesc('created_at')->get();

        return PromotionResource::collection($promotions);
    }

    public function store(StorePromotionRequest $request)
    {
        $this->authorize('create', Promotion::class);

        // Explicitly resolve is_active rather than relying on the DB column
        // default — Eloquent doesn't reflect DB-side defaults back into the
        // in-memory model after create(), so leaving it unset here would
        // make the response briefly (and incorrectly) look inactive.
        $promotion = $request->user()->vendor->promotions()->create([
            ...$request->validated(),
            'is_active' => $request->boolean('is_active', true),
        ]);

        return new PromotionResource($promotion);
    }

    public function show(Promotion $promotion)
    {
        $this->authorize('view', $promotion);

        return new PromotionResource($promotion);
    }

    public function update(UpdatePromotionRequest $request, Promotion $promotion)
    {
        $this->authorize('update', $promotion);

        $promotion->update($request->validated());

        return new PromotionResource($promotion->fresh());
    }
}
