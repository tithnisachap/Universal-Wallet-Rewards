<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Singleton table — always exactly one row (id=1).
        Schema::create('platform_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('auto_approve_vendors')->default(false);
            $table->timestamps();
        });

        DB::table('platform_settings')->insert(['auto_approve_vendors' => false]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('platform_settings');
    }
};
