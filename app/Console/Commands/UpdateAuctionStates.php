<?php

namespace App\Console\Commands;

use App\Models\Auction;
use App\Services\AuctionService;
use Illuminate\Console\Command;

class UpdateAuctionStates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'auctions:update-states';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update auction states based on start and end times';

    protected $auctionService;

    public function __construct(AuctionService $auctionService)
    {
        parent::__construct();
        $this->auctionService = $auctionService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // 1. Scheduled -> Live
        $startedCount = Auction::where('state', 'scheduled')
            ->where('start_time', '<=', now())
            ->update(['state' => 'live']);

        if ($startedCount > 0) {
            $this->info("Started {$startedCount} auctions.");
        }

        // 2. Live -> Ended
        $expiredAuctions = Auction::where('state', 'live')
            ->where('end_time', '<=', now())
            ->get();

        foreach ($expiredAuctions as $auction) {
            $this->auctionService->closeAuction($auction);
            $this->info("Closed auction ID: {$auction->id}");
        }
    }
}
