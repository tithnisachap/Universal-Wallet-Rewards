<?php

namespace App\Http\Requests\Vendor;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreBranchRequest extends FormRequest
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
            'photo' => ['nullable', 'image', 'max:5120'],
            'name' => ['required', 'string', 'max:255'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'phone' => ['nullable', 'string', 'max:30'],
            'opening_hours' => ['nullable', 'array'],
            'opening_hours.mon_fri.open' => ['nullable', 'date_format:H:i'],
            'opening_hours.mon_fri.close' => ['nullable', 'date_format:H:i'],
            'opening_hours.sat_sun.open' => ['nullable', 'date_format:H:i'],
            'opening_hours.sat_sun.close' => ['nullable', 'date_format:H:i'],
            'is_main' => ['sometimes', 'boolean'],
        ];
    }
}
