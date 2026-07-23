<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\CustomerActivity;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CustomerActivity>
 */
class CustomerActivityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $occurredAt = $this->faker->dateTimeBetween('-3 months', 'now');

        return [
            'customer_id' => Customer::factory(),
            'vendor_id' => Vendor::factory(),
            'branch_id' => null,
            'promotion_id' => null,
            'type' => 'points_earned',
            'amount' => $this->faker->randomElement([10, 15, 20, 25, 30]),
            'note' => null,
            'occurred_at' => $occurredAt,
        ];
    }

    public function pointsEarned(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'points_earned',
            'amount' => $this->faker->randomElement([10, 15, 20, 25, 30]),
        ]);
    }

    public function pointsDeducted(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'points_deducted',
            'amount' => -$this->faker->randomElement([50, 100, 150]),
        ]);
    }

    public function stampEarned(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'stamp_earned',
            'amount' => 1,
        ]);
    }

    public function rewardRedeemed(string $note = '1 Free Drink'): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'reward_redeemed',
            'amount' => -$this->faker->randomElement([100, 120, 150]),
            'note' => $note,
        ]);
    }
}
