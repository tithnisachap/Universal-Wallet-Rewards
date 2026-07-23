<?php

namespace App\Http\Requests\Vendor;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBranchRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->vendor?->id === $this->route('branch')?->vendor_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'photo' => ['nullable', 'image', 'max:5120'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'address' => ['sometimes', 'required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'opening_hours' => ['nullable', 'array'],
            'opening_hours.mon_fri.open' => ['nullable', 'date_format:H:i'],
            'opening_hours.mon_fri.close' => ['nullable', 'date_format:H:i'],
            'opening_hours.sat_sun.open' => ['nullable', 'date_format:H:i'],
            'opening_hours.sat_sun.close' => ['nullable', 'date_format:H:i'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'is_main' => ['sometimes', 'boolean'],
        ];
    }
}
