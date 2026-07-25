<?php

namespace App\Http\Requests\Vendor;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateVendorProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->vendor?->id === $this->route('vendor')?->id;
    }

    /**
     * Older/seeded records may have a website stored without a scheme
     * (e.g. "www.example.com"), which the `url` rule below would otherwise
     * reject even when the vendor hasn't touched that field.
     */
    protected function prepareForValidation(): void
    {
        if ($this->filled('website') && ! preg_match('#^https?://#i', $this->input('website'))) {
            $this->merge(['website' => 'https://'.$this->input('website')]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'logo' => ['nullable', 'image', 'max:5120'],
            'business_name' => ['sometimes', 'required', 'string', 'max:255'],
            'category' => ['sometimes', 'required', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
        ];
    }
}
