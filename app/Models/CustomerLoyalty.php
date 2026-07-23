<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerLoyalty extends Model
{
    /** @use HasFactory<\Database\Factories\CustomerLoyaltyFactory> */
    use HasFactory;

    protected $table = 'customer_loyalty';

    protected $fillable = [
        'customer_id',
        'vendor_id',
        'points_balance',
        'stamps_count',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }
}
