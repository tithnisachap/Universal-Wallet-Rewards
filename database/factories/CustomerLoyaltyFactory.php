<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\CustomerLoyalty;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CustomerLoyalty>
 */
class CustomerLoyaltyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => Customer::factory(),
            'vendor_id' => Vendor::factory(),
            'points_balance' => $this->faker->numberBetween(0, 300),
            'stamps_count' => $this->faker->numberBetween(0, 10),
        ];
    }
}
