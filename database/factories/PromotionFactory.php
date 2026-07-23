<?php

namespace Database\Factories;

use App\Models\Promotion;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Promotion>
 */
class PromotionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['stamps', 'points']);
        $category = $this->faker->randomElement(['Drinks', 'Food', 'Discount']);

        return [
            'vendor_id' => Vendor::factory(),
            'type' => $type,
            'category' => $category,
            'title' => $type === 'stamps' ? 'Free '.$category : $category.' Reward',
            'description' => $type === 'stamps'
                ? 'Collect stamps to unlock a free reward.'
                : 'Redeem your points for this reward at checkout.',
            'terms' => 'This promotion cannot be combined with other discounts. Stamps are non-transferable.',
            'required_amount' => $type === 'stamps' ? $this->faker->randomElement([8, 10, 12]) : $this->faker->randomElement([100, 120, 150, 200]),
            'starts_at' => now()->subMonths(2)->toDateString(),
            'ends_at' => now()->addMonths(6)->toDateString(),
            'is_active' => true,
        ];
    }

    public function stamps(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'stamps',
            'category' => 'Drinks',
            'required_amount' => 10,
        ]);
    }

    public function points(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'points',
            'required_amount' => $this->faker->randomElement([100, 120, 150, 200]),
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
            'starts_at' => now()->subMonths(6)->toDateString(),
            'ends_at' => now()->subMonth()->toDateString(),
        ]);
    }

    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'starts_at' => now()->addWeek()->toDateString(),
            'ends_at' => now()->addMonths(4)->toDateString(),
        ]);
    }
}
