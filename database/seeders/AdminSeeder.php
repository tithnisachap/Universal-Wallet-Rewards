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
            'name' => 'admin1',
            'email' => 'neolimti@gmail.com',
        ]);

        User::factory()->admin()->create([
            'name' => 'admin2',
            'email' => 'vitou.raksmey.154433421@acestudent.org',
        ]);
    }
}
