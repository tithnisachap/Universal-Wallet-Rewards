<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reward_redemptions', function (Blueprint $table) {
            // Nullable: existing rows and any redemption where the branch
            // couldn't be resolved have no way to be backfilled.
            $table->foreignId('branch_id')->nullable()->after('vendor_id')->constrained()->nullOnDelete();
            $table->index('branch_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reward_redemptions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('branch_id');
        });
    }
};
