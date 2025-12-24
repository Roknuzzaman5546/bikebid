<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Auction;
use Illuminate\Support\Facades\DB;
use App\Events\AuctionEnded;
use Illuminate\Support\Facades\Log;
class BuyNowController extends Controller
{
    public function buy(Auction $auction)
    {
        $user = auth()->user();

        DB::transaction(function () use ($auction, $user) {

            $auction = Auction::lockForUpdate()->find($auction->id);

            if ($auction->state !== 'live') {
                throw new \Exception('NOT_LIVE');
            }

            if (!$auction->buy_now_price) {
                throw new \Exception('NO_BUY_NOW');
            }

            $auction->state = 'ended';
            $auction->winner_id = $user->id;
            $auction->current_price = $auction->buy_now_price;
            $auction->save();

            event(new AuctionEnded($auction));
        });

        return redirect()->route('auctions.show', $auction);
    }
}

