<?php

namespace App\Http\Controllers;

use App\Models\Auction;
use App\Services\AuctionService;
use Illuminate\Http\Request;
use App\Models\AuditLog;

class BuyNowController extends Controller
{
    protected $auctionService;

    public function __construct(AuctionService $auctionService)
    {
        $this->auctionService = $auctionService;
    }

    public function buy(Auction $auction)
    {
        $user = auth()->user();

        if ($user->status !== 'active') {
            return back()->withErrors(['error' => 'Your account is suspended.']);
        }

        try {
            $result = $this->auctionService->buyNow($auction->id, $user->id);

            if (isset($result['error'])) {
                throw new \Exception($result['error']);
            }

            return redirect()->route('auctions.show', $auction)->with('success', 'Auction won via Buy Now!');

        } catch (\Exception $e) {
            AuditLog::create([
                'action' => 'BUY_NOW_REJECTED',
                'user_id' => $user->id,
                'auction_id' => $auction->id,
                'details' => $e->getMessage()
            ]);

            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}

