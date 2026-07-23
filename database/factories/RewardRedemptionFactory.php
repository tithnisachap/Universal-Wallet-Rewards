<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Promotion;
use App\Models\RewardRedemption;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<RewardRedemption>
 */
class RewardRedemptionFactory extends Factory
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
            'promotion_id' => Promotion::factory(),
            'code' => Str::upper(Str::random(12)),
            'status' => 'pending',
            'expires_at' => now()->addMinutes(5),
            'redeemed_at' => null,
        ];
    }

    public function redeemed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'redeemed',
            'redeemed_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'expired',
            'expires_at' => now()->subMinutes(10),
        ]);
    }
}
