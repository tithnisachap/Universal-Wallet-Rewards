<?php

use App\Http\Controllers\Api\Admin\AnalyticsController as AdminAnalyticsController;
use App\Http\Controllers\Api\Auth\DevLoginController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\SettingsController as AdminSettingsController;
use App\Http\Controllers\Api\Admin\VendorController as AdminVendorController;
use App\Http\Controllers\Api\Customer\ActivityController as CustomerActivityController;
use App\Http\Controllers\Api\Customer\BranchController as CustomerBranchController;
use App\Http\Controllers\Api\Customer\LoyaltyController;
use App\Http\Controllers\Api\Customer\ProfileController as CustomerProfileController;
use App\Http\Controllers\Api\Customer\QrCodeController;
use App\Http\Controllers\Api\Customer\RedemptionController as CustomerRedemptionController;
use App\Http\Controllers\Api\Customer\VendorController as CustomerVendorController;
use App\Http\Controllers\Api\MeController;
use App\Http\Controllers\Api\Vendor\ActivityController as VendorActivityController;
use App\Http\Controllers\Api\Vendor\AnalyticsController as VendorAnalyticsController;
use App\Http\Controllers\Api\Vendor\BranchController as VendorBranchController;
use App\Http\Controllers\Api\Vendor\BranchStaffController;
use App\Http\Controllers\Api\Vendor\DashboardController as VendorDashboardController;
use App\Http\Controllers\Api\Vendor\GeocodeController;
use App\Http\Controllers\Api\Vendor\PointTransactionController;
use App\Http\Controllers\Api\Vendor\ProfileController as VendorProfileController;
use App\Http\Controllers\Api\Vendor\PromotionController as VendorPromotionController;
use App\Http\Controllers\Api\Vendor\RedemptionController as VendorRedemptionController;
use App\Http\Controllers\Api\Vendor\ScanController;
use App\Http\Controllers\Api\Vendor\StampTransactionController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['status' => 'ok']));

// Lets the frontend know whether real Google OAuth credentials are
// configured yet, so the login screen can fall back to dev-login until
// GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are set.
Route::get('/auth/config', fn () => response()->json([
    'data' => ['google_oauth_enabled' => filled(config('services.google.client_id'))],
]));

// Dev-only fallback for the real Google OAuth flow. See DevLoginController docblock.
Route::post('/auth/dev-login', [DevLoginController::class, 'store']);
Route::post('/auth/dev-signup', [DevLoginController::class, 'signup']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [MeController::class, 'show']);
    Route::post('/auth/logout', [DevLoginController::class, 'destroy']);

    // ---- Customer -------------------------------------------------------
    Route::middleware('role:customer')->prefix('customer')->group(function () {
        Route::get('/profile', [CustomerProfileController::class, 'show']);
        Route::put('/profile', [CustomerProfileController::class, 'update']);

        Route::get('/vendors', [CustomerVendorController::class, 'index']);
        Route::get('/vendors/{vendor}', [CustomerVendorController::class, 'show']);
        Route::get('/vendors/{vendor}/branches', [CustomerBranchController::class, 'index']);
        Route::get('/vendors/{vendor}/loyalty', [LoyaltyController::class, 'show']);
        Route::get('/vendors/{vendor}/activities', [CustomerActivityController::class, 'index']);
        Route::post('/vendors/{vendor}/redemptions', [CustomerRedemptionController::class, 'store']);

        Route::get('/branches/nearby', [CustomerBranchController::class, 'nearby']);

        Route::get('/qr-code', [QrCodeController::class, 'show']);
    });

    // ---- Vendor (owner-only) ------------------------------------------------
    Route::middleware('role:vendor')->prefix('vendor')->group(function () {
        Route::post('/profile', [VendorProfileController::class, 'store']);
        Route::put('/profile/{vendor}', [VendorProfileController::class, 'update']);

        Route::get('/branches', [VendorBranchController::class, 'index']);
        Route::post('/branches', [VendorBranchController::class, 'store']);
        Route::get('/branches/{branch}', [VendorBranchController::class, 'show']);
        Route::put('/branches/{branch}', [VendorBranchController::class, 'update']);

        Route::get('/branches/{branch}/staff', [BranchStaffController::class, 'index']);
        Route::post('/branches/{branch}/staff', [BranchStaffController::class, 'store']);
        Route::delete('/branches/{branch}/staff/{staff}', [BranchStaffController::class, 'destroy']);

        Route::post('/promotions', [VendorPromotionController::class, 'store']);
        Route::get('/promotions/{promotion}', [VendorPromotionController::class, 'show']);
        Route::put('/promotions/{promotion}', [VendorPromotionController::class, 'update']);

        Route::get('/geocode/search', [GeocodeController::class, 'search']);
        Route::get('/geocode/reverse', [GeocodeController::class, 'reverse']);
    });

    // ---- Vendor (owner or branch-scoped staff) -------------------------------
    Route::middleware('role:vendor,branch_staff')->prefix('vendor')->group(function () {
        Route::get('/profile', [VendorProfileController::class, 'show']);
        Route::get('/dashboard', [VendorDashboardController::class, 'show']);
        Route::get('/analytics', [VendorAnalyticsController::class, 'show']);

        Route::get('/promotions', [VendorPromotionController::class, 'index']);

        Route::post('/scan', [ScanController::class, 'store']);

        Route::post('/transactions/stamps', [StampTransactionController::class, 'store']);
        Route::post('/transactions/points', [PointTransactionController::class, 'store']);
        Route::post('/transactions/points/deduct', [PointTransactionController::class, 'deduct']);

        Route::post('/redemptions/redeem', [VendorRedemptionController::class, 'store']);

        Route::get('/activities', [VendorActivityController::class, 'index']);
    });

    // ---- Admin --------------------------------------------------------------
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'show']);

        Route::get('/vendors', [AdminVendorController::class, 'index']);
        Route::get('/vendors/{vendor}', [AdminVendorController::class, 'show']);
        Route::post('/vendors/{vendor}/review', [AdminVendorController::class, 'review']);
        Route::post('/vendors/{vendor}/suspend', [AdminVendorController::class, 'suspend']);
        Route::post('/vendors/{vendor}/reinstate', [AdminVendorController::class, 'reinstate']);

        Route::get('/analytics', [AdminAnalyticsController::class, 'show']);

        Route::get('/settings', [AdminSettingsController::class, 'show']);
        Route::put('/settings', [AdminSettingsController::class, 'update']);
    });
});
