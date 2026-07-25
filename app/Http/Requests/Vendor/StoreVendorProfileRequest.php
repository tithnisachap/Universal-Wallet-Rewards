<?php

namespace App\Http\Requests\Vendor;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreVendorProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->role === 'vendor' && ! $this->user()->vendor()->exists();
    }

    /**
     * Accept a website typed without a scheme (e.g. "www.example.com")
     * rather than rejecting it outright.
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
            'business_name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:30'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'website' => ['nullable', 'url', 'max:255'],
        ];
    }
}
