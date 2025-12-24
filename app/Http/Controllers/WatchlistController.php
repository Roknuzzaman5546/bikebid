<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WatchlistController extends Controller
{
    public function toggle(Request $request, int $auctionId)
    {
        $userId = auth()->id();

        $exists = DB::table('watchlists')
            ->where('user_id', $userId)
            ->where('auction_id', $auctionId)
            ->exists();

        if ($exists) {
            DB::table('watchlists')
                ->where('user_id', $userId)
                ->where('auction_id', $auctionId)
                ->delete();

            return response()->json([
                'status' => 'removed'
            ]);
        }

        DB::table('watchlists')->insert([
            'user_id' => $userId,
            'auction_id' => $auctionId,
            'created_at' => now(),
        ]);

        return response()->json([
            'status' => 'added'
        ]);
    }

    public function myWatchlist()
    {
        $userId = auth()->id();

        $auctions = DB::table('watchlists as w')
            ->join('auctions as a', 'a.id', '=', 'w.auction_id')
            ->where('w.user_id', $userId)
            ->select(
                'a.id',
                'a.title',
                'a.current_price',
                'a.end_time',
                'a.status'
            )
            ->orderBy('a.end_time')
            ->get();

        return response()->json($auctions);
    }
}
