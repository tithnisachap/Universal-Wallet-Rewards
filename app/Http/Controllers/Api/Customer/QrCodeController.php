<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class QrCodeController extends Controller
{
    /**
     * The customer's permanent identification QR ("My QR Code" screen).
     * The QR itself is rendered client-side from this payload.
     */
    public function show(Request $request)
    {
        $customer = $request->user()->customer()->firstOrFail();

        return response()->json([
            'data' => [
                'customer_id' => $customer->id,
                'customer_code' => $customer->customer_code,
                'qr_value' => $customer->customer_code,
            ],
        ]);
    }
}
