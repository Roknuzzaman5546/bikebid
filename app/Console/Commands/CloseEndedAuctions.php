<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Auction;
use App\Services\AuctionService;

class CloseEndedAuctions extends Command
{
    protected $signature = 'auction:close-ended';
    protected $description = 'Close ended auctions and determine winner';

    public function handle(AuctionService $service)
    {
        $auctions = Auction::where('state', 'live')
            ->where('end_time', '<=', now())
            ->get();

        foreach ($auctions as $auction) {
            $service->closeAuction($auction);
        }

        $this->info('Ended auctions closed');
    }
}
