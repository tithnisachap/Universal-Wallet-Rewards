<?php

namespace App\Http\Requests\Vendor;

use App\Models\Promotion;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StorePromotionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->vendor?->status === 'approved';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in(['stamps', 'points'])],
            'category' => ['required', 'string', 'max:100'],
            'title' => ['required', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:120'],
            'terms' => ['nullable', 'string', 'max:1000'],
            'required_amount' => [
                'required', 'integer', 'min:1',
                // Stamp cards are physically limited to 30 slots in the UI —
                // points-based promotions have no such constraint.
                $this->input('type') === 'stamps' ? 'max:30' : 'max:1000000',
            ],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['required', 'date', 'after_or_equal:starts_at'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function messages(): array
    {
        return [
            'ends_at.after_or_equal' => 'The end date must be on or after the start date.',
            'required_amount.max' => 'Required stamps cannot exceed 30.',
        ];
    }

    /**
     * Mirrors the DB partial unique index: a vendor may only have one active
     * Stamps promotion at a time. Points promotions are unrestricted.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $wantsActiveStamp = $this->input('type') === 'stamps'
                && $this->boolean('is_active', true);

            if (! $wantsActiveStamp) {
                return;
            }

            $hasActiveStampPromotion = Promotion::query()
                ->where('vendor_id', $this->user()->vendor->id)
                ->where('type', 'stamps')
                ->where('is_active', true)
                ->exists();

            if ($hasActiveStampPromotion) {
                $validator->errors()->add(
                    'type',
                    'You already have an active Stamps promotion. Deactivate it before creating a new one.'
                );
            }
        });
    }
}
