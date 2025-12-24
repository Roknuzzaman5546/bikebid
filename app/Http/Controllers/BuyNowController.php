<?php

namespace App\Http\Controllers;

use App\Events\AuctionEnded;
use Illuminate\Http\Request;
use App\Models\Auction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
class BuyNowController extends Controller
{
    public function buy(Auction $auction)
    {
        $user = auth()->user();

        DB::transaction(function () use ($auction, $user) {

            $auction = Auction::lockForUpdate()->find($auction->id);

            if ($auction->state !== 'live') {
                // If ended, only allow if user is already the winner (completing purchase)
                if ($auction->state === 'ended' && $auction->winner_id === $user->id) {
                    // Proceed (act as payment confirmation)
                } else {
                    throw new \Exception('NOT_LIVE');
                }
            }

            if (!$auction->buy_now_price) {
                throw new \Exception('NO_BUY_NOW');
            }

            $auction->state = 'ended';
            $auction->winner_id = $user->id;
            $auction->current_price = $auction->buy_now_price;
            $auction->save();

            event(new AuctionEnded(
                $auction->id,
                $user->id,
                $auction->buy_now_price,
                true
            ));
        });

        return redirect()->route('auctions.show', $auction);
    }
}

