<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@universalwallet.test',
        ]);

        User::factory()->admin()->create([
            'name' => 'Sophana Phat',
            'email' => 'sophana@universalwallet.test',
        ]);
    }
}
