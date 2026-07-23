<?php

namespace Database\Factories;

use App\Models\Branch;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Branch>
 */
class BranchFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'vendor_id' => Vendor::factory(),
            'name' => $this->faker->streetName().' Branch',
            'address' => $this->faker->streetAddress().', Phnom Penh, Cambodia',
            'phone' => '0'.$this->faker->numerify('## ### ###'),
            'photo_path' => null,
            'opening_hours' => [
                'mon_fri' => ['open' => '08:00', 'close' => '21:00'],
                'sat_sun' => ['open' => '09:00', 'close' => '22:00'],
            ],
            'latitude' => $this->faker->latitude(11.53, 11.58),
            'longitude' => $this->faker->longitude(104.88, 104.93),
            'is_main' => false,
        ];
    }

    public function main(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_main' => true,
        ]);
    }
}
