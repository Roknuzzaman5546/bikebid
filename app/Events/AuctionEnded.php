<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AuctionEnded implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

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

    public function broadcastOn(): array
    {
        return [
            new Channel('auction.' . $this->auctionId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'AuctionEnded';
    }
}
