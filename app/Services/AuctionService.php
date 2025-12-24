<?php

namespace App\Services;

use App\Events\AuctionEnded;
use App\Events\AuctionExtended;
use App\Events\BidPlaced;
use App\Models\Auction;
use App\Notifications\OutbidNotification;
use App\Notifications\AuctionWonNotification;
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
            'cancel_reason' => $reason
        ]);

        $this->audit('AUCTION_CANCELED', $auction->id, auth()->id(), $reason);
    }

    /**
     * Place Bid (Concurrency Safe)
     */
    /**
     * Place Bid (Concurrency Safe)
     */
    public function placeBid(int $auctionId, int $userId, float $amount)
    {
        return DB::transaction(function () use ($auctionId, $userId, $amount) {
            // Check User Status
            $user = \App\Models\User::find($userId);
            if (!$user || $user->status !== 'active') {
                return ['error' => 'User is suspended or invalid'];
            }

            // Lock Auction
            $auction = Auction::lockForUpdate()->find($auctionId);

            if (!$auction || $auction->state !== 'live') {
                return ['error' => 'Auction not live'];
            }

            $now = now();
            $endTime = \Carbon\Carbon::parse($auction->end_time);

            if ($now->gt($endTime)) {
                return ['error' => 'Auction already ended'];
            }
            if ($auction->seller_id == $userId) {
                return ['error' => 'Self bidding not allowed'];
            }

            // Determine minimum bid
            if (!is_null($auction->current_price)) {
                $minBid = $auction->current_price + $auction->min_increment;
            } else {
                $minBid = $auction->starting_price;
            }

            if ($amount < $minBid) {
                return ['error' => "Minimum bid is {$minBid}"];
            }

            // Idempotency Check (Basic) - If needed, usually via a unique constraint or separate table check
            // assuming mostly handled by frontend preventing double clicks, ensuring robustness here:
            // We could check if this user already bid this exact amount recently?
            // For now, allow multiple same bids if increasing? No, price must increase.
            // If amount == current_price, rejected by logic above.

            $bidId = DB::table('bids')->insertGetId([
                'auction_id' => $auctionId,
                'user_id' => $userId,
                'amount' => $amount,
                'idempotency_key' => request('key'),
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            $bid = \App\Models\Bid::with('user:id,name')->find($bidId);

            $updateData = [
                'current_price' => $amount,
                'updated_at' => $now,
            ];

            // Notify Previous Bidder
            $previousBid = DB::table('bids')
                ->where('auction_id', $auctionId)
                ->where('user_id', '!=', $userId)
                ->orderByDesc('amount')
                ->first();

            if ($previousBid) {
                $prevUser = \App\Models\User::find($previousBid->user_id);
                if ($prevUser) {
                    $prevUser->notify(new OutbidNotification($auction, $amount));
                }
            }

            // Anti-sniping (last 2 minutes)
            // If endTime is within 120 seconds from now
            if ($endTime->diffInSeconds($now) <= 120) {
                $newEnd = $endTime->copy()->addMinutes(2);
                $updateData['end_time'] = $newEnd;

                // Fire extension event
                event(new AuctionExtended($auctionId, $newEnd->toDateTimeString()));

                $this->audit('AUCTION_EXTENDED', $auctionId, $userId, $newEnd->toDateTimeString());
            }

            DB::table('auctions')
                ->where('id', $auctionId)
                ->update($updateData);

            event(new BidPlaced($auctionId, $bid, $amount));

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
                    'current_price' => $auction->buy_now_price,
                    'updated_at' => now(),
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
    public function closeAuction(Auction $auction)
    {
        return DB::transaction(function () use ($auction) {

            // Reload to get lock
            $auction = Auction::lockForUpdate()->find($auction->id);

            if (!$auction || $auction->state !== 'live') {
                return;
            }

            $bid = $auction->bids()->orderByDesc('amount')->first();

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

            $auction->update([
                'state' => 'ended',
                'winner_id' => $winnerId,
                'buy_now_price' => $price, // Set buy now price to winning bid for checkout
            ]);

            event(new AuctionEnded(
                $auction->id,
                $winnerId,
                $price,
                $sold
            ));

            if ($sold) {
                $winner = \App\Models\User::find($winnerId);
                if ($winner) {
                    $winner->notify(new AuctionWonNotification($auction));
                }
            }

            $this->audit('AUCTION_ENDED', $auction->id, $winnerId, $price);
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
