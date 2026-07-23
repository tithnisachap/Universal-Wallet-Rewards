<?php

namespace Tests\Feature\Api\Customer;

use Tests\Feature\Api\ApiTestCase;

class QrCodeTest extends ApiTestCase
{
    public function test_customer_can_fetch_their_qr_payload(): void
    {
        $customer = $this->actingAsCustomer();

        $this->getJson('/api/customer/qr-code')
            ->assertOk()
            ->assertJsonPath('data.customer_code', $customer->customer_code)
            ->assertJsonPath('data.qr_value', $customer->customer_code);
    }
}
