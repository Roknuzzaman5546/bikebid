<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AuctionEnded
{
    use Dispatchable, SerializesModels;

    public int $auctionId;
    public ?int $winnerId;
    public ?float $finalPrice;
    public bool $sold;

    public function __construct(
        int $auctionId,
        ?int $winnerId,
        ?float $finalPrice,
        bool $sold
    ) {
        $this->auctionId = $auctionId;
        $this->winnerId = $winnerId;
        $this->finalPrice = $finalPrice;
        $this->sold = $sold;
    }
}
