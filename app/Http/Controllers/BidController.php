<?php

namespace App\Http\Controllers;

use App\Models\Auction;
use App\Models\Bid;
use App\Models\AuditLog;
use App\Events\BidPlaced;
use App\Events\AuctionExtended;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BidController extends Controller
{
    public function store(Request $request, Auction $auction)
    {
        $request->validate([
            'amount' => 'required|numeric',
            'key' => 'required|string'
        ]);

        $user = auth()->user();

        try {
            DB::transaction(function () use ($auction, $request, $user) {

                $auction = Auction::where('id', $auction->id)
                    ->lockForUpdate()
                    ->first();

                if ($auction->state !== 'live') {
                    throw new \Exception('AUCTION_NOT_LIVE');
                }

                if ($user->status !== 'active') {
                    throw new \Exception('USER_SUSPENDED');
                }

                if ($auction->seller_id === $user->id) {
                    throw new \Exception('SELF_BIDDING');
                }

                if (Bid::where('idempotency_key', $request->key)->exists()) {
                    return;
                }

                $minBid = max(
                    $auction->current_price ?: $auction->starting_price,
                    $auction->current_price
                ) + $auction->min_increment;

                if ($request->amount < $minBid) {
                    throw new \Exception('MIN_INCREMENT_NOT_MET');
                }

                Bid::create([
                    'auction_id' => $auction->id,
                    'user_id' => $user->id,
                    'amount' => $request->amount,
                    'idempotency_key' => $request->key
                ]);

                $auction->current_price = $request->amount;

                // Anti-sniping
                if ($auction->end_time->diffInSeconds(now()) <= 120) {
                    $auction->end_time = $auction->end_time->addMinutes(2);
                    event(new AuctionExtended($auction));
                }

                $auction->save();

                event(new BidPlaced($auction, $user));
            });

            return back()->with('success', 'Bid placed');

        } catch (\Exception $e) {
            AuditLog::create([
                'action' => 'BID_REJECTED',
                'user_id' => $user->id,
                'auction_id' => $auction->id,
                'details' => $e->getMessage()
            ]);

            return back()->withErrors($e->getMessage());
        }
    }
}
