<?php

namespace App\Http\Requests\Vendor;

use App\Models\CustomerLoyalty;
use App\Services\VendorAccessResolver;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class DeductPointsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $vendor = app(VendorAccessResolver::class)->vendorFor($this->user());

        return $vendor?->status === 'approved';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customer_id' => ['required', 'exists:customers,id'],
            'branch_id' => ['nullable', 'exists:branches,id'],
            'points' => ['required', 'integer', 'min:1'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $vendorId = app(VendorAccessResolver::class)->vendorFor($this->user())?->id;
            $customerId = $this->input('customer_id');
            $points = (int) $this->input('points');

            $balance = CustomerLoyalty::query()
                ->where('vendor_id', $vendorId)
                ->where('customer_id', $customerId)
                ->value('points_balance') ?? 0;

            if ($points > $balance) {
                $validator->errors()->add('points', 'This customer does not have enough points for this deduction.');
            }
        });
    }
}
