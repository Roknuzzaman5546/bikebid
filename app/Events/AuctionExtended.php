<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AuctionExtended
{
    use Dispatchable, SerializesModels;

    public int $auctionId;
    public string $newEndTime;

    public function __construct(int $auctionId, string $newEndTime)
    {
        $this->auctionId = $auctionId;
        $this->newEndTime = $newEndTime;
    }
}
