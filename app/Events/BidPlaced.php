<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BidPlaced implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $auctionId;
    public $bid;
    public float $amount;

    public function __construct(int $auctionId, $bid, float $amount)
    {
        $this->auctionId = $auctionId;
        $this->bid = $bid;
        $this->amount = $amount;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('auction.' . $this->auctionId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'BidPlaced';
    }
}
