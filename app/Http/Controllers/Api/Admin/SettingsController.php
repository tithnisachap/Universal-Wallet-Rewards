<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PlatformSetting;
use App\Models\User;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function show()
    {
        return response()->json(['data' => $this->present(PlatformSetting::current())]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'auto_approve_vendors' => ['sometimes', 'required', 'boolean'],
            'support_email' => ['sometimes', 'nullable', 'email', 'max:255'],
        ]);

        $settings = PlatformSetting::current();
        $settings->update($validated);

        return response()->json(['data' => $this->present($settings)]);
    }

    public function admins()
    {
        return response()->json([
            'data' => User::where('role', 'admin')
                ->orderBy('name')
                ->get(['id', 'name', 'email']),
        ]);
    }

    private function present(PlatformSetting $settings): array
    {
        return [
            'auto_approve_vendors' => $settings->auto_approve_vendors,
            'support_email' => $settings->support_email,
        ];
    }
}
