<?php

namespace App\Http\Controllers;

use App\Models\Auction;
use App\Services\AuctionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuctionController extends Controller
{
    protected $auctionService;

    public function __construct(AuctionService $auctionService)
    {
        $this->auctionService = $auctionService;
    }
    /**
     * Browse auctions (Live + Upcoming)
     */
    public function index(Request $request)
    {
        $query = Auction::query()
            ->whereIn('state', ['scheduled', 'live'])
            ->orderBy('start_time');

        if ($request->state) {
            $query->where('state', $request->state);
        }

        if ($request->ending_soon) {
            $query->where('state', 'live')->orderBy('end_time');
        }

        $auctions = $query->paginate(12);

        return Inertia::render('Auctions/Index', [
            'auctions' => $auctions,
        ]);
    }

    /**
     * Show auction detail
     */
    public function show(Auction $auction)
    {
        $auction->load([
            'bids.user:id,name',
            'seller:id,name',
        ]);

        return Inertia::render('Auctions/Show', [
            'auction' => $auction,
            'isWatching' => Auth::user()
                ? Auth::user()->watchlists()->where('auction_id', $auction->id)->exists()
                : false,
        ]);
    }

    /**
     * Create auction page
     */
    public function create()
    {
        return Inertia::render('Auctions/Create');
    }

    /**
     * Store auction
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'condition' => 'required|string',
            'location' => 'required|string',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
            'starting_price' => 'required|numeric|min:1',
            'min_increment' => 'required|numeric|min:1',
            'reserve_price' => 'nullable|numeric|min:1',
            'buy_now_price' => 'nullable|numeric|min:1',
        ]);

        $auction = $this->auctionService->createAuction(
            $validated,
            Auth::id()
        );

        return redirect()
            ->route('auctions.show', $auction->id)
            ->with('success', 'Auction created successfully');
    }

    /**
     * Seller dashboard – own auctions
     */
    public function myAuctions()
    {
        $auctions = Auction::where('seller_id', Auth::id())
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Dashboard', [
            'myAuctions' => $auctions,
        ]);
    }

    /**
     * Cancel auction (seller)
     */
    public function cancel(Request $request, Auction $auction)
    {
        if ($auction->seller_id !== Auth::id()) {
            abort(403);
        }

        if (!in_array($auction->state, ['scheduled', 'live'])) {
            return back()->withErrors('Auction cannot be canceled now');
        }

        $this->auctionService->cancelAuction(
            $auction,
            'Canceled by seller'
        );

        return back()->with('success', 'Auction canceled');
    }
}
