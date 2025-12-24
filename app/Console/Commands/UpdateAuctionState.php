<?php

namespace App\Console\Commands;

use App\Models\Auction;
use Illuminate\Console\Command;

class UpdateAuctionState extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-auction-state';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Move auctions from Scheduled to Live';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Auction::where('state', 'scheduled')
            ->where('start_time', '<=', now())
            ->update(['state' => 'live']);

        $this->info('Auction states updated');
    }
}
