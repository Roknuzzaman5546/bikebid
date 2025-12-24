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
    protected $auctionService;

    public function __construct(\App\Services\AuctionService $auctionService)
    {
        $this->auctionService = $auctionService;
    }

    public function store(Request $request, Auction $auction)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'key' => 'required|string'
        ]);

        $user = auth()->user();


        try {
            // Idempotency check
            if (Bid::where('idempotency_key', $request->key)->exists()) {
                return back()->with('success', 'Bid placed');
            }

            if ($user->status !== 'active') {
                throw new \Exception('Checking status: USER_SUSPENDED');
            }

            $result = $this->auctionService->placeBid($auction->id, $user->id, $request->amount);

            if (isset($result['error'])) {
                throw new \Exception($result['error']);
            }

            return back()->with('success', 'Bid placed');

        } catch (\Exception $e) {
            AuditLog::create([
                'action' => 'BID_REJECTED',
                'user_id' => $user->id,
                'auction_id' => $auction->id,
                'details' => $e->getMessage()
            ]);

            return back()->withErrors(['amount' => $e->getMessage()]);
        }
    }
}
