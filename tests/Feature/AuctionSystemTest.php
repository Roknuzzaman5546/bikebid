<?php

namespace Tests\Feature;

use App\Models\Auction;
use App\Models\User;
use App\Services\AuctionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;
use Illuminate\Support\Facades\Event;
use App\Events\AuctionExtended;
use App\Events\BidPlaced;

class AuctionSystemTest extends TestCase
{
    use RefreshDatabase;

    protected $auctionService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->auctionService = app(AuctionService::class);
    }

    /** @test */
    public function suspended_user_cannot_bid()
    {
        $seller = User::factory()->create();
        $buyer = User::factory()->create(['status' => 'suspended']);
        $auction = Auction::create([
            'seller_id' => $seller->id,
            'title' => 'Bike',
            'description' => 'Desc',
            'condition' => 'used',
            'location' => 'Dhaka',
            'starting_price' => 1000,
            'current_price' => 1000,
            'min_increment' => 100,
            'start_time' => now()->subHour(),
            'end_time' => now()->addHour(),
            'state' => 'live'
        ]);

        $this->actingAs($buyer);
        $response = $this->post("/auctions/{$auction->id}/bid", [
            'amount' => 1200,
            'key' => 'unique-1'
        ]);

        $response->assertSessionHasErrors(['amount']);
        $this->assertEquals(1000, $auction->fresh()->current_price);
    }

    /** @test */
    public function bid_near_end_extends_auction()
    {
        Event::fake([AuctionExtended::class]);

        $seller = User::factory()->create();
        $buyer = User::factory()->create(['status' => 'active']);

        // End time is in 1 minute
        $endTime = now()->addMinute();

        $auction = Auction::create([
            'seller_id' => $seller->id,
            'title' => 'Bike',
            'description' => 'Desc',
            'condition' => 'used',
            'location' => 'Dhaka',
            'starting_price' => 1000,
            'current_price' => 1000,
            'min_increment' => 100,
            'start_time' => now()->subHour(),
            'end_time' => $endTime,
            'state' => 'live'
        ]);

        $this->actingAs($buyer);
        $this->post("/auctions/{$auction->id}/bid", [
            'amount' => 1200,
            'key' => 'unique-2'
        ]);

        $auction->refresh();

        // New end time should be old end time + 2 minutes
        $this->assertTrue($auction->end_time->gt($endTime));
        $this->assertEquals($endTime->addMinutes(2)->toDateTimeString(), $auction->end_time->toDateTimeString());

        Event::assertDispatched(AuctionExtended::class);
    }

    /** @test */
    public function buy_now_ends_auction_instantly()
    {
        $seller = User::factory()->create();
        $buyer = User::factory()->create(['status' => 'active']);

        $auction = Auction::create([
            'seller_id' => $seller->id,
            'title' => 'Bike',
            'description' => 'Desc',
            'condition' => 'used',
            'location' => 'Dhaka',
            'starting_price' => 1000,
            'current_price' => 1000,
            'min_increment' => 100,
            'buy_now_price' => 5000,
            'start_time' => now()->subHour(),
            'end_time' => now()->addHour(),
            'state' => 'live'
        ]);

        $this->actingAs($buyer);
        $this->post("/auctions/{$auction->id}/buy-now");

        $auction->refresh();
        $this->assertEquals('ended', $auction->state);
        $this->assertEquals($buyer->id, $auction->winner_id);
        $this->assertEquals(5000, $auction->current_price);
    }

    /** @test */
    public function self_bidding_is_not_allowed()
    {
        $seller = User::factory()->create(['status' => 'active']);

        $auction = Auction::create([
            'seller_id' => $seller->id,
            'title' => 'Bike',
            'description' => 'Desc',
            'condition' => 'used',
            'location' => 'Dhaka',
            'starting_price' => 1000,
            'current_price' => 1000,
            'min_increment' => 100,
            'start_time' => now()->subHour(),
            'end_time' => now()->addHour(),
            'state' => 'live'
        ]);

        $this->actingAs($seller);
        $response = $this->post("/auctions/{$auction->id}/bid", [
            'amount' => 1200,
            'key' => 'unique-3'
        ]);

        $response->assertSessionHasErrors(['amount']);
        $this->assertEquals(1000, $auction->fresh()->current_price);
    }
}
