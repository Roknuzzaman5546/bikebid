<?php

namespace App\Http\Controllers;

use App\Models\Auction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function show(Auction $auction)
    {
        if ($auction->state !== 'ended' || $auction->winner_id !== auth()->id()) {
            return redirect()->route('auctions.show', $auction->id);
        }

        return Inertia::render('Auctions/Checkout', [
            'auction' => $auction->load('seller')
        ]);
    }

    public function process(Auction $auction)
    {
        if ($auction->state !== 'ended' || $auction->winner_id !== auth()->id()) {
            abort(403);
        }

        // In a real app, logic for payment would go here.
        // We'll just mark it as "paid" if we had such a field, 
        // but for now we'll just redirect to dashboard.

        return redirect()->route('dashboard')->with('success', 'Congratulations! Your purchase of ' . $auction->title . ' is confirmed.');
    }
}
