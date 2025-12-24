<?php

namespace Database\Factories;

use App\Models\Auction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Auction>
 */
class AuctionFactory extends Factory
{
    protected $model = Auction::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startingPrice = $this->faker->randomFloat(2, 500, 5000);

        return [
            'seller_id' => User::factory(),
            'title' => $this->faker->sentence(3) . ' Bike',
            'description' => $this->faker->paragraph(),
            'condition' => $this->faker->randomElement(['New', 'Like New', 'Used', 'Fair']),
            'location' => $this->faker->city(),
            'image_url' => 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800',
            'starting_price' => $startingPrice,
            'current_price' => $startingPrice,
            'min_increment' => 50,
            'reserve_price' => $startingPrice + 500,
            'buy_now_price' => $startingPrice + 2000,
            'start_time' => now()->subDay(),
            'end_time' => now()->addDays(3),
            'state' => 'live',
        ];
    }

    public function live()
    {
        return $this->state(fn(array $attributes) => [
            'state' => 'live',
            'start_time' => now()->subDay(),
            'end_time' => now()->addDays(2),
        ]);
    }

    public function scheduled()
    {
        return $this->state(fn(array $attributes) => [
            'state' => 'scheduled',
            'start_time' => now()->addDays(1),
            'end_time' => now()->addDays(5),
        ]);
    }

    public function ended()
    {
        return $this->state(fn(array $attributes) => [
            'state' => 'ended',
            'start_time' => now()->subDays(5),
            'end_time' => now()->subDay(),
        ]);
    }
}
