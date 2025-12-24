<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Auction;
use Inertia\Inertia;

class AuctionAdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Auctions', [
            'auctions' => Auction::with('seller')->get()
        ]);
    }

    public function cancel(Auction $auction)
    {
        $auction->update([
            'status' => 'canceled',
            'cancel_reason' => 'Canceled by admin'
        ]);
    }
}
