<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

class MeController extends Controller
{
    /**
     * Bootstrap endpoint: who am I, and what role-specific profile do I have.
     */
    public function show(Request $request)
    {
        $user = $request->user()->load(['customer', 'vendor', 'branchStaff.branch']);

        return new UserResource($user);
    }
}
