<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BidPlaced
{
    use Dispatchable, SerializesModels;

    public int $auctionId;
    public int $userId;
    public float $amount;

    public function __construct(int $auctionId, int $userId, float $amount)
    {
        $this->auctionId = $auctionId;
        $this->userId = $userId;
        $this->amount = $amount;
    }
}
