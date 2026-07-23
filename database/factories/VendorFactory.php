<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Vendor>
 */
class VendorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['Coffee Shop', 'Bakery', 'Restaurant', 'Retail', 'Juice Bar', 'Fast Food', 'Healthy Food'];
        $submittedAt = $this->faker->dateTimeBetween('-6 months', 'now');

        return [
            'user_id' => User::factory()->vendor(),
            'business_name' => $this->faker->company(),
            'category' => $this->faker->randomElement($categories),
            'logo_path' => null,
            'phone' => '+855 '.$this->faker->numerify('## ### ###'),
            'email' => $this->faker->unique()->companyEmail(),
            'address' => $this->faker->streetAddress().', Phnom Penh, Cambodia',
            'website' => $this->faker->boolean(60) ? 'www.'.$this->faker->domainName() : null,
            'status' => 'pending',
            'submitted_at' => $submittedAt,
            'reviewed_at' => null,
            'reviewed_by' => null,
            'review_note' => null,
        ];
    }

    public function approved(): static
    {
        return $this->state(function (array $attributes) {
            $submittedAt = $attributes['submitted_at'] ?? $this->faker->dateTimeBetween('-6 months', '-1 week');

            return [
                'status' => 'approved',
                'submitted_at' => $submittedAt,
                'reviewed_at' => $this->faker->dateTimeBetween($submittedAt, 'now'),
            ];
        });
    }

    public function rejected(): static
    {
        return $this->state(function (array $attributes) {
            $submittedAt = $attributes['submitted_at'] ?? $this->faker->dateTimeBetween('-6 months', '-1 week');

            return [
                'status' => 'rejected',
                'submitted_at' => $submittedAt,
                'reviewed_at' => $this->faker->dateTimeBetween($submittedAt, 'now'),
                'review_note' => $this->faker->randomElement([
                    'Business registration document was unclear.',
                    'Address could not be verified.',
                    'Duplicate application already on file.',
                ]),
            ];
        });
    }

    public function suspended(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'suspended',
            'reviewed_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
            'review_note' => 'Suspended pending investigation of suspicious redemption activity.',
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'reviewed_at' => null,
            'review_note' => null,
        ]);
    }
}
