<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Auction;
use App\Services\AuctionService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AuctionAdminController extends Controller
{
    protected $auctionService;

    public function __construct(AuctionService $auctionService)
    {
        $this->auctionService = $auctionService;
    }

    public function index()
    {
        return Inertia::render('Admin/Auctions', [
            'auctions' => Auction::with('seller')->get()
        ]);
    }

    public function cancel(Request $request, Auction $auction)
    {
        $request->validate([
            'reason' => 'required|string|max:255'
        ]);

        $this->auctionService->cancelAuction($auction, $request->reason);

        return back()->with('success', 'Auction canceled');
    }
}
