<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AuctionExtended implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $auctionId;
    public string $newEndTime;

    public function __construct(int $auctionId, string $newEndTime)
    {
        $this->auctionId = $auctionId;
        $this->newEndTime = $newEndTime;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('auction.' . $this->auctionId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'AuctionExtended';
    }
}
