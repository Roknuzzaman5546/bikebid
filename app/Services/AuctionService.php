<?php

namespace App\Services;

use App\Events\AuctionEnded;
use App\Events\AuctionExtended;
use App\Events\BidPlaced;
use App\Models\Auction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuctionService
{
    /**
     * Create Auction
     */
    public function createAuction(array $data, int $sellerId)
    {
        return Auction::create(array_merge($data, [
            'seller_id' => $sellerId,
            'state' => 'scheduled',
            'current_price' => $data['starting_price']
        ]));
    }

    /**
     * Cancel Auction
     */
    public function cancelAuction(Auction $auction, string $reason)
    {
        $auction->update([
            'state' => 'canceled',
            // If you have a cancel_reason column, uncomment:
            // 'cancel_reason' => $reason
        ]);

        // Logic to refund bids if any, etc.
    }

    /**
     * Place Bid (Concurrency Safe)
     */
    public function placeBid(int $auctionId, int $userId, float $amount)
    {
        return DB::transaction(function () use ($auctionId, $userId, $amount) {

            $auction = DB::table('auctions')
                ->lockForUpdate()
                ->where('id', $auctionId)
                ->first();

            if (!$auction || $auction->state !== 'live') {
                return ['error' => 'Auction not live'];
            }

            if (now()->gt($auction->end_time)) {
                return ['error' => 'Auction already ended'];
            }

            if ($auction->seller_id == $userId) {
                return ['error' => 'Self bidding not allowed'];
            }

            $minBid = $auction->current_price + $auction->min_increment;

            if ($amount < $minBid) {
                return ['error' => "Minimum bid is {$minBid}"];
            }

            DB::table('bids')->insert([
                'auction_id' => $auctionId,
                'user_id' => $userId,
                'amount' => $amount,
                'created_at' => now(),
            ]);

            DB::table('auctions')
                ->where('id', $auctionId)
                ->update([
                    'current_price' => $amount
                ]);

            // Anti-sniping (last 2 minutes)
            if (now()->diffInSeconds($auction->end_time) <= 120) {
                $newEnd = now()->addMinutes(2);

                DB::table('auctions')
                    ->where('id', $auctionId)
                    ->update(['end_time' => $newEnd]);

                event(new AuctionExtended($auctionId, $newEnd->toDateTimeString()));
            }

            event(new BidPlaced($auctionId, $userId, $amount));

            $this->audit('BID_ACCEPTED', $auctionId, $userId, $amount);

            return ['success' => true];
        });
    }

    /**
     * Buy Now
     */
    public function buyNow(int $auctionId, int $userId)
    {
        return DB::transaction(function () use ($auctionId, $userId) {

            $auction = DB::table('auctions')
                ->lockForUpdate()
                ->where('id', $auctionId)
                ->first();

            if (!$auction || !$auction->buy_now_price) {
                return ['error' => 'Buy now not available'];
            }

            if ($auction->state !== 'live') {
                return ['error' => 'Auction not live'];
            }

            DB::table('auctions')
                ->where('id', $auctionId)
                ->update([
                    'state' => 'ended',
                    'winner_id' => $userId,
                    //  'final_price' => $auction->buy_now_price, // Assuming final_price exists or current_price is used
                    'current_price' => $auction->buy_now_price,
                    //  'ended_at' => now(), // Assuming ended_at column exists
                ]);

            event(new AuctionEnded(
                $auctionId,
                $userId,
                $auction->buy_now_price,
                true
            ));

            $this->audit('BUY_NOW', $auctionId, $userId, $auction->buy_now_price);

            return ['success' => true];
        });
    }

    /**
     * Close Auction (Cron / Command)
     */
    public function closeAuction(int $auctionId)
    {
        return DB::transaction(function () use ($auctionId) {

            $auction = DB::table('auctions')
                ->lockForUpdate()
                ->where('id', $auctionId)
                ->first();

            if (!$auction || $auction->state !== 'live') {
                return;
            }

            $bid = DB::table('bids')
                ->where('auction_id', $auctionId)
                ->orderByDesc('amount')
                ->first();

            $sold = false;
            $winnerId = null;
            $price = null;

            if ($bid) {
                if (!$auction->reserve_price || $bid->amount >= $auction->reserve_price) {
                    $sold = true;
                    $winnerId = $bid->user_id;
                    $price = $bid->amount;
                }
            }

            DB::table('auctions')
                ->where('id', $auctionId)
                ->update([
                    'state' => 'ended',
                    'winner_id' => $winnerId,
                    // 'final_price' => $price,
                    // 'ended_at' => now(),
                ]);

            event(new AuctionEnded(
                $auctionId,
                $winnerId,
                $price,
                $sold
            ));

            $this->audit('AUCTION_ENDED', $auctionId, $winnerId, $price);
        });
    }

    private function audit(string $action, int $auctionId, ?int $userId, $value = null)
    {
        DB::table('audit_logs')->insert([
            'action' => $action,
            'auction_id' => $auctionId,
            'user_id' => $userId,
            'details' => json_encode(['value' => $value]), // Changed value to details to match schema
            'created_at' => now(),
        ]);
    }
}
