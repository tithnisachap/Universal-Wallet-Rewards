<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Singleton row (always id=1) of platform-wide toggles.
 */
class PlatformSetting extends Model
{
    protected $fillable = [
        'auto_approve_vendors',
    ];

    protected function casts(): array
    {
        return [
            'auto_approve_vendors' => 'boolean',
        ];
    }

    public static function current(): self
    {
        return static::query()->firstOrCreate(['id' => 1]);
    }
}
