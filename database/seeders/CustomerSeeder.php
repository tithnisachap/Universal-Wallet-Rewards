<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\CustomerActivity;
use App\Models\CustomerLoyalty;
use App\Models\Promotion;
use App\Models\RewardRedemption;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $coffeeBean = Vendor::where('business_name', 'The Coffee Bean')->firstOrFail();
        $starbucks = Vendor::where('business_name', 'Starbucks')->firstOrFail();
        $breadTalk = Vendor::where('business_name', 'BreadTalk')->firstOrFail();
        $dunkin = Vendor::where('business_name', "Dunkin' Donuts")->firstOrFail();

        $vitou = $this->seedHeroCustomer();
        $this->seedHeroActivity($vitou, $coffeeBean, $starbucks, $breadTalk, $dunkin);

        $johnDoe = $this->seedNamedCustomer('John Doe', 'john.doe@gmail.com', 'CUS-000124');
        $this->seedCompletedStampCard($johnDoe, $coffeeBean);

        $pendingRedeemer = $this->seedNamedCustomer('Mary Jane', 'mary.jane@gmail.com', 'CUS-000126');
        $this->seedPendingRedemption($pendingRedeemer, $coffeeBean);

        $expiredRedeemer = $this->seedNamedCustomer('Peter Parker', 'peter.parker@gmail.com', 'CUS-000127');
        $this->seedExpiredRedemption($expiredRedeemer, $coffeeBean);

        // Long-tail customers for realistic analytics/activity volume.
        Customer::factory()
            ->count(16)
            ->create()
            ->each(function (Customer $customer) {
                $vendors = Vendor::where('status', 'approved')->inRandomOrder()->limit(rand(1, 3))->get();

                foreach ($vendors as $vendor) {
                    /** @var CustomerLoyalty $loyalty */
                    $loyalty = CustomerLoyalty::factory()->create([
                        'customer_id' => $customer->id,
                        'vendor_id' => $vendor->id,
                    ]);

                    CustomerActivity::factory()
                        ->count(rand(1, 4))
                        ->pointsEarned()
                        ->create([
                            'customer_id' => $customer->id,
                            'vendor_id' => $vendor->id,
                        ]);
                }
            });
    }

    private function seedHeroCustomer(): Customer
    {
        $user = User::factory()->customer()->create([
            'name' => 'Vitou Raksmey',
            'email' => 'Tou@gmail.com',
        ]);
        $user->forceFill(['created_at' => Carbon::parse('2026-06-23 09:00:00')])->save();

        /** @var Customer $customer */
        $customer = Customer::create([
            'user_id' => $user->id,
            'customer_code' => 'CUS-000125',
        ]);
        $customer->forceFill(['created_at' => Carbon::parse('2026-06-23 09:00:00')])->save();

        return $customer;
    }

    private function seedNamedCustomer(string $name, string $email, string $code): Customer
    {
        $user = User::factory()->customer()->create([
            'name' => $name,
            'email' => $email,
        ]);

        return Customer::create([
            'user_id' => $user->id,
            'customer_code' => $code,
        ]);
    }

    private function seedHeroActivity(Customer $vitou, Vendor $coffeeBean, Vendor $starbucks, Vendor $breadTalk, Vendor $dunkin): void
    {
        CustomerLoyalty::create([
            'customer_id' => $vitou->id,
            'vendor_id' => $coffeeBean->id,
            'points_balance' => 125,
            'stamps_count' => 6,
        ]);

        CustomerLoyalty::create([
            'customer_id' => $vitou->id,
            'vendor_id' => $starbucks->id,
            'points_balance' => 100,
            'stamps_count' => 8,
        ]);

        CustomerLoyalty::create([
            'customer_id' => $vitou->id,
            'vendor_id' => $breadTalk->id,
            'points_balance' => 23,
            'stamps_count' => 2,
        ]);

        CustomerLoyalty::create([
            'customer_id' => $vitou->id,
            'vendor_id' => $dunkin->id,
            'points_balance' => 0,
            'stamps_count' => 7,
        ]);

        $coffeeBeanPromotion = Promotion::where('vendor_id', $coffeeBean->id)
            ->where('title', 'Free Coffee (Big Size)')
            ->first();

        $entries = [
            ['type' => 'points_earned', 'amount' => 20, 'occurred_at' => '2026-04-28 13:05:00', 'note' => null],
            ['type' => 'reward_redeemed', 'amount' => -150, 'occurred_at' => '2026-05-15 15:40:00', 'note' => '1 Free Drink'],
            ['type' => 'points_earned', 'amount' => 20, 'occurred_at' => '2026-05-18 14:15:00', 'note' => null],
            ['type' => 'stamp_earned', 'amount' => 1, 'occurred_at' => '2026-05-18 14:15:00', 'note' => null],
            ['type' => 'stamp_earned', 'amount' => 1, 'occurred_at' => '2026-05-24 10:30:00', 'note' => null],
            ['type' => 'points_earned', 'amount' => 25, 'occurred_at' => '2026-05-24 10:30:00', 'note' => null],
        ];

        foreach ($entries as $entry) {
            CustomerActivity::create([
                'customer_id' => $vitou->id,
                'vendor_id' => $coffeeBean->id,
                'branch_id' => null,
                'promotion_id' => $entry['type'] === 'reward_redeemed' ? $coffeeBeanPromotion?->id : null,
                'type' => $entry['type'],
                'amount' => $entry['amount'],
                'note' => $entry['note'],
                'occurred_at' => Carbon::parse($entry['occurred_at']),
            ]);
        }
    }

    private function seedCompletedStampCard(Customer $customer, Vendor $vendor): void
    {
        CustomerLoyalty::create([
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'points_balance' => 40,
            'stamps_count' => 10,
        ]);

        CustomerActivity::factory()->stampEarned()->create([
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'occurred_at' => now()->subDays(2),
        ]);
    }

    private function seedPendingRedemption(Customer $customer, Vendor $vendor): void
    {
        CustomerLoyalty::create([
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'points_balance' => 15,
            'stamps_count' => 10,
        ]);

        $promotion = Promotion::where('vendor_id', $vendor->id)->where('title', 'Free Coffee (Big Size)')->firstOrFail();

        RewardRedemption::create([
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'promotion_id' => $promotion->id,
            'code' => Str::upper(Str::random(12)),
            'status' => 'pending',
            'expires_at' => now()->addMinutes(5),
        ]);
    }

    private function seedExpiredRedemption(Customer $customer, Vendor $vendor): void
    {
        CustomerLoyalty::create([
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'points_balance' => 5,
            'stamps_count' => 0,
        ]);

        $promotion = Promotion::where('vendor_id', $vendor->id)->where('title', 'Free Coffee (Big Size)')->firstOrFail();

        RewardRedemption::factory()->expired()->create([
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'promotion_id' => $promotion->id,
        ]);
    }
}
