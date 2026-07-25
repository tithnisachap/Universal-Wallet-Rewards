<?php

namespace App\Http\Requests\Vendor;

use App\Models\Promotion;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdatePromotionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->vendor?->id === $this->route('promotion')?->vendor_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Type is immutable once a promotion exists, so the cap check looks
        // at the existing record's type rather than request input.
        $isStamps = $this->route('promotion')?->type === 'stamps';

        return [
            'category' => ['sometimes', 'required', 'string', 'max:100'],
            'title' => ['sometimes', 'required', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:120'],
            'terms' => ['nullable', 'string', 'max:1000'],
            'required_amount' => [
                'sometimes', 'required', 'integer', 'min:1',
                $isStamps ? 'max:30' : 'max:1000000',
            ],
            'starts_at' => ['sometimes', 'required', 'date'],
            'ends_at' => ['sometimes', 'required', 'date', 'after_or_equal:starts_at'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function messages(): array
    {
        return [
            'required_amount.max' => 'Required stamps cannot exceed 30.',
        ];
    }

    /**
     * Mirrors the DB partial unique index: a vendor may only have one active
     * Stamps promotion at a time. Points promotions are unrestricted.
     * The `type` of an existing promotion is immutable, so this only matters
     * when re-activating a previously deactivated Stamps promotion.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $promotion = $this->route('promotion');

            $wantsActiveStamp = $promotion->type === 'stamps'
                && $this->boolean('is_active', $promotion->is_active)
                && ! $promotion->is_active;

            if (! $wantsActiveStamp) {
                return;
            }

            $hasActiveStampPromotion = Promotion::query()
                ->where('vendor_id', $promotion->vendor_id)
                ->where('type', 'stamps')
                ->where('is_active', true)
                ->where('id', '!=', $promotion->id)
                ->exists();

            if ($hasActiveStampPromotion) {
                $validator->errors()->add(
                    'is_active',
                    'You already have an active Stamps promotion. Deactivate it before reactivating this one.'
                );
            }
        });
    }
}
