<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PlatformSetting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function show()
    {
        return response()->json(['data' => $this->present(PlatformSetting::current())]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'auto_approve_vendors' => ['required', 'boolean'],
        ]);

        $settings = PlatformSetting::current();
        $settings->update(['auto_approve_vendors' => $request->boolean('auto_approve_vendors')]);

        return response()->json(['data' => $this->present($settings)]);
    }

    private function present(PlatformSetting $settings): array
    {
        return [
            'auto_approve_vendors' => $settings->auto_approve_vendors,
        ];
    }
}
