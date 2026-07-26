<?php

namespace Tests\Feature\Api\Vendor;

use App\Models\User;
use App\Models\Vendor;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\Feature\Api\ApiTestCase;

class OnboardingTest extends ApiTestCase
{
    public function test_profile_returns_404_before_shop_setup(): void
    {
        $user = User::factory()->vendor()->create();
        Sanctum::actingAs($user, ['*']);

        $this->getJson('/api/vendor/profile')->assertStatus(404);
    }

    public function test_vendor_can_complete_shop_setup(): void
    {
        Storage::fake('public');

        $user = User::factory()->vendor()->create();
        Sanctum::actingAs($user, ['*']);

        $response = $this->postJson('/api/vendor/profile', [
            'logo' => UploadedFile::fake()->image('logo.png'),
            'business_name' => 'The Coffee Bean',
            'category' => 'Coffee Shop',
            'phone' => '012 345 678',
            'latitude' => 11.5564,
            'longitude' => 104.9282,
            'website' => 'https://coffeebean.com',
        ])->assertCreated();

        $response->assertJsonPath('data.business_name', 'The Coffee Bean');
        $response->assertJsonPath('data.status', 'pending');
        // Address is server-derived from the pinned coordinates, never
        // client-typed — confirms the reverse-geocode wiring actually ran.
        $response->assertJsonPath('data.address', 'Fake Test Address, Phnom Penh, Cambodia');

        $this->assertDatabaseHas('vendors', [
            'user_id' => $user->id,
            'business_name' => 'The Coffee Bean',
            'status' => 'pending',
        ]);

        Storage::disk('public')->assertExists(Vendor::first()->logo_path);
    }

    public function test_vendor_cannot_submit_shop_setup_twice(): void
    {
        $vendor = Vendor::factory()->pending()->create();
        Sanctum::actingAs($vendor->user, ['*']);

        $this->postJson('/api/vendor/profile', [
            'business_name' => 'Second Shop',
            'category' => 'Bakery',
        ])->assertStatus(403);
    }

    public function test_vendor_can_update_own_profile(): void
    {
        $vendor = $this->actingAsVendor();

        $this->putJson("/api/vendor/profile/{$vendor->id}", [
            'business_name' => 'Renamed Shop',
        ])->assertOk()->assertJsonPath('data.business_name', 'Renamed Shop');
    }

    public function test_vendor_cannot_update_another_vendors_profile(): void
    {
        $this->actingAsVendor();
        $otherVendor = Vendor::factory()->approved()->create();

        $this->putJson("/api/vendor/profile/{$otherVendor->id}", [
            'business_name' => 'Hijacked',
        ])->assertStatus(403);
    }
}
