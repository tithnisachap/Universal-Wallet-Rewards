<?php

namespace App\Http\Requests\Vendor;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InviteBranchStaffRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * Ownership of the branch itself is checked in the controller via
     * BranchPolicy::update, since that needs the route-bound {branch}.
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
            'email' => [
                'required',
                'email',
                Rule::unique('branch_staff', 'email'),
                function (string $attribute, mixed $value, \Closure $fail) {
                    $existing = User::where('email', $value)
                        ->whereNotIn('role', ['branch_staff'])
                        ->value('role');

                    if ($existing) {
                        $fail("This email already has a {$existing} account and cannot be added as branch staff.");
                    }
                },
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'This email has already been invited to a branch.',
        ];
    }
}
