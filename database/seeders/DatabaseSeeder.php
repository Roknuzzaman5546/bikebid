<?php

namespace Database\Seeders;

use App\Models\Auction;
use App\Models\Bid;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create specific test accounts
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@bikebid.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $seller = User::factory()->create([
            'name' => 'Bike Seller',
            'email' => 'seller@bikebid.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        $buyer = User::factory()->create([
            'name' => 'Active Buyer',
            'email' => 'buyer@bikebid.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        $testUser = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
        ]);

        // 2. Create some Live Auctions
        $liveAuctions = Auction::factory(5)->live()->create([
            'seller_id' => $seller->id
        ]);

        // 3. Create some Scheduled Auctions
        Auction::factory(3)->scheduled()->create([
            'seller_id' => $seller->id
        ]);

        // 4. Create some Ended Auctions
        Auction::factory(2)->ended()->create([
            'seller_id' => $seller->id,
            'winner_id' => $buyer->id
        ]);

        // 5. Add some bids to live auctions
        foreach ($liveAuctions as $auction) {
            $amount = $auction->starting_price;

            // Add 1-3 bids for each live auction
            for ($i = 0; $i < rand(1, 3); $i++) {
                $amount += $auction->min_increment;
                Bid::create([
                    'auction_id' => $auction->id,
                    'user_id' => $buyer->id,
                    'amount' => $amount,
                    'created_at' => now()->subMinutes(60 - ($i * 10)),
                ]);
            }

            // Update current price
            $auction->update(['current_price' => $amount]);
        }
    }
}
