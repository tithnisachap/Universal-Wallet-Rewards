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
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['stamps', 'points']);
            $table->string('category');
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('terms')->nullable();
            $table->unsignedInteger('required_amount');
            $table->date('starts_at');
            $table->date('ends_at');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('vendor_id');
            $table->index(['vendor_id', 'is_active']);
        });

        // A vendor can only have one active Stamps promotion at a time.
        // Points promotions are unrestricted (never shown to customers, vendor-managed only).
        DB::statement(
            "CREATE UNIQUE INDEX promotions_one_active_stamp_per_vendor ON promotions (vendor_id) WHERE type = 'stamps' AND is_active = true"
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
