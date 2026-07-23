<?php

use App\Http\Controllers\Api\Admin\AnalyticsController as AdminAnalyticsController;
use App\Http\Controllers\Api\Auth\DevLoginController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
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
use App\Http\Controllers\Api\Vendor\DashboardController as VendorDashboardController;
use App\Http\Controllers\Api\Vendor\PointTransactionController;
use App\Http\Controllers\Api\Vendor\ProfileController as VendorProfileController;
use App\Http\Controllers\Api\Vendor\PromotionController as VendorPromotionController;
use App\Http\Controllers\Api\Vendor\RedemptionController as VendorRedemptionController;
use App\Http\Controllers\Api\Vendor\ScanController;
use App\Http\Controllers\Api\Vendor\StampTransactionController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['status' => 'ok']));

// TEMPORARY — stand-in for Google OAuth. See DevLoginController docblock.
Route::post('/auth/dev-login', [DevLoginController::class, 'store']);

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

    // ---- Vendor -----------------------------------------------------------
    Route::middleware('role:vendor')->prefix('vendor')->group(function () {
        Route::get('/profile', [VendorProfileController::class, 'show']);
        Route::post('/profile', [VendorProfileController::class, 'store']);
        Route::put('/profile/{vendor}', [VendorProfileController::class, 'update']);

        Route::get('/dashboard', [VendorDashboardController::class, 'show']);

        Route::get('/branches', [VendorBranchController::class, 'index']);
        Route::post('/branches', [VendorBranchController::class, 'store']);
        Route::get('/branches/{branch}', [VendorBranchController::class, 'show']);
        Route::put('/branches/{branch}', [VendorBranchController::class, 'update']);

        Route::get('/promotions', [VendorPromotionController::class, 'index']);
        Route::post('/promotions', [VendorPromotionController::class, 'store']);
        Route::get('/promotions/{promotion}', [VendorPromotionController::class, 'show']);
        Route::put('/promotions/{promotion}', [VendorPromotionController::class, 'update']);

        Route::post('/scan', [ScanController::class, 'store']);

        Route::post('/transactions/stamps', [StampTransactionController::class, 'store']);
        Route::post('/transactions/points', [PointTransactionController::class, 'store']);
        Route::post('/transactions/points/deduct', [PointTransactionController::class, 'deduct']);

        Route::post('/redemptions/redeem', [VendorRedemptionController::class, 'store']);

        Route::get('/activities', [VendorActivityController::class, 'index']);
        Route::get('/analytics', [VendorAnalyticsController::class, 'show']);
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
    });
});
