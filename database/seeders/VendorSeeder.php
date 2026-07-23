<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Promotion;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class VendorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        $this->seedCoffeeBean($admin);
        $this->seedSimpleApprovedVendor($admin, 'Starbucks', 'Coffee Shop', 'TK Avenue, Toul Kork, Phnom Penh');
        $this->seedSimpleApprovedVendor($admin, 'BreadTalk', 'Bakery', 'Aeon Mall Sen Sok, Phnom Penh');
        $this->seedSimpleApprovedVendor($admin, "Dunkin' Donuts", 'Bakery', 'Preah Monivong Blvd, Phnom Penh');
        $this->seedSimpleApprovedVendor($admin, 'Burger House', 'Fast Food', 'Street 51, Phnom Penh');
        $this->seedSimpleApprovedVendor($admin, 'TK Cafe', 'Cafe', 'TK Avenue, Toul Kork, Phnom Penh');
        $this->seedSimpleApprovedVendor($admin, 'Green Garden', 'Restaurant', 'Street 240, Phnom Penh');

        $this->seedPendingVendor('Sweet Bites Bakery', 'Bakery', 'Central Market, Block B');

        $this->seedRejectedVendor($admin, 'Fit & Fresh Juice Bar', 'Juice Bar', 'Street 63, Phnom Penh', 'Business registration document was unclear.');
        $this->seedRejectedVendor($admin, 'Healthy Bowl', 'Healthy Food', 'BKK1, Phnom Penh', 'Address could not be verified.');

        $this->seedSuspendedVendor($admin, 'Quick Mart', 'Retail', 'Street 271, Phnom Penh');

        // Extra long-tail vendors for realistic dashboard/analytics volume.
        Vendor::factory()
            ->count(6)
            ->approved()
            ->create()
            ->each(function (Vendor $vendor) {
                Branch::factory()->main()->for($vendor)->create();
                Promotion::factory()->for($vendor)->create();
            });

        Vendor::factory()->count(2)->pending()->create();
        Vendor::factory()->count(1)->rejected()->create();
    }

    private function seedCoffeeBean(User $admin): void
    {
        $user = User::factory()->vendor()->create([
            'name' => 'John Doe',
            'email' => 'john@gmail.com',
        ]);

        /** @var Vendor $vendor */
        $vendor = Vendor::factory()->approved()->create([
            'user_id' => $user->id,
            'business_name' => 'The Coffee Bean',
            'category' => 'Coffee Shop',
            'phone' => '+855 12 345 678',
            'email' => 'vendor@coffeebean.com',
            'address' => '#123, Street 123, Phnom Penh, Cambodia',
            'website' => 'www.coffeebean.com',
            'submitted_at' => Carbon::parse('2026-05-20 10:30:00'),
            'reviewed_at' => Carbon::parse('2026-05-20 12:00:00'),
            'reviewed_by' => $admin->id,
        ]);

        $branches = [
            [
                'name' => 'TK Avenue Branch',
                'address' => 'TK Avenue, Toul Kork, Phnom Penh',
                'phone' => '012 345 678',
                'hours' => ['open' => '08:00', 'close' => '22:00'],
                'is_main' => true,
                'lat' => 11.5697,
                'lng' => 104.8921,
            ],
            [
                'name' => 'BKK1 Branch',
                'address' => 'BKK1, Phnom Penh',
                'phone' => '098 345 678',
                'hours' => ['open' => '09:00', 'close' => '22:00'],
                'is_main' => false,
                'lat' => 11.5480,
                'lng' => 104.9203,
            ],
            [
                'name' => 'AEON Mall Branch',
                'address' => 'AEON Mall Sen Sok, Phnom Penh',
                'phone' => '011 345 678',
                'hours' => ['open' => '10:00', 'close' => '22:00'],
                'is_main' => false,
                'lat' => 11.5885,
                'lng' => 104.8935,
            ],
            [
                'name' => 'Chip Mong 271 Branch',
                'address' => 'Chip Mong 271, Phnom Penh',
                'phone' => '021 345 678',
                'hours' => ['open' => '08:00', 'close' => '23:00'],
                'is_main' => false,
                'lat' => 11.5325,
                'lng' => 104.9142,
            ],
        ];

        foreach ($branches as $branch) {
            Branch::create([
                'vendor_id' => $vendor->id,
                'name' => $branch['name'],
                'address' => $branch['address'],
                'phone' => $branch['phone'],
                'opening_hours' => [
                    'mon_fri' => $branch['hours'],
                    'sat_sun' => $branch['hours'],
                ],
                'latitude' => $branch['lat'],
                'longitude' => $branch['lng'],
                'is_main' => $branch['is_main'],
            ]);
        }

        Promotion::create([
            'vendor_id' => $vendor->id,
            'type' => 'stamps',
            'category' => 'Drinks',
            'title' => 'Free Coffee (Big Size)',
            'description' => 'Get 1 free coffee (Big size)',
            'terms' => 'This promotion cannot be combined with other discounts. Stamps are non-transferable.',
            'required_amount' => 10,
            'starts_at' => '2026-01-01',
            'ends_at' => '2026-12-31',
            'is_active' => true,
        ]);

        Promotion::create([
            'vendor_id' => $vendor->id,
            'type' => 'points',
            'category' => 'Discount',
            'title' => 'Discount 20%',
            'description' => 'Get 20% off on any purchase by exchanging with 150 points',
            'terms' => 'This promotion cannot be combined with other discounts.',
            'required_amount' => 150,
            'starts_at' => '2026-06-01',
            'ends_at' => '2026-12-31',
            'is_active' => true,
        ]);

        Promotion::create([
            'vendor_id' => $vendor->id,
            'type' => 'points',
            'category' => 'Food',
            'title' => 'Free Dessert',
            'description' => 'Get 1 free dessert',
            'terms' => 'This promotion cannot be combined with other discounts.',
            'required_amount' => 120,
            'starts_at' => '2026-01-01',
            'ends_at' => '2026-12-31',
            'is_active' => true,
        ]);

        Promotion::create([
            'vendor_id' => $vendor->id,
            'type' => 'stamps',
            'category' => 'Drinks',
            'title' => 'Buy 1 Get 1',
            'description' => 'Buy any drink, get 1 free',
            'terms' => 'This promotion cannot be combined with other discounts. Stamps are non-transferable.',
            'required_amount' => 12,
            'starts_at' => '2025-10-01',
            'ends_at' => '2026-05-10',
            'is_active' => false,
        ]);

        Promotion::create([
            'vendor_id' => $vendor->id,
            'type' => 'points',
            'category' => 'Discount',
            'title' => '$5 Off',
            'description' => 'Get $5 off on min. spend $20',
            'terms' => 'This promotion cannot be combined with other discounts.',
            'required_amount' => 200,
            'starts_at' => '2025-09-01',
            'ends_at' => '2026-04-20',
            'is_active' => false,
        ]);
    }

    private function seedSimpleApprovedVendor(User $admin, string $name, string $category, string $address): void
    {
        /** @var Vendor $vendor */
        $vendor = Vendor::factory()->approved()->create([
            'business_name' => $name,
            'category' => $category,
            'address' => $address,
            'reviewed_by' => $admin->id,
        ]);

        Branch::factory()->main()->for($vendor)->create([
            'name' => $name.' - Main Branch',
            'address' => $address,
        ]);

        Promotion::factory()->stamps()->for($vendor)->create();
    }

    private function seedPendingVendor(string $name, string $category, string $address): void
    {
        Vendor::factory()->pending()->create([
            'business_name' => $name,
            'category' => $category,
            'address' => $address,
            'submitted_at' => Carbon::parse('2026-05-20 09:15:00'),
        ]);
    }

    private function seedRejectedVendor(User $admin, string $name, string $category, string $address, string $note): void
    {
        Vendor::factory()->rejected()->create([
            'business_name' => $name,
            'category' => $category,
            'address' => $address,
            'reviewed_by' => $admin->id,
            'review_note' => $note,
        ]);
    }

    private function seedSuspendedVendor(User $admin, string $name, string $category, string $address): void
    {
        /** @var Vendor $vendor */
        $vendor = Vendor::factory()->approved()->suspended()->create([
            'business_name' => $name,
            'category' => $category,
            'address' => $address,
            'reviewed_by' => $admin->id,
        ]);

        Branch::factory()->main()->for($vendor)->create([
            'name' => $name.' - Main Branch',
            'address' => $address,
        ]);
    }
}
