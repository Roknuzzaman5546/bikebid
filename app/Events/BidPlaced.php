<?php

namespace App\Events;

use App\Models\Auction;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BidPlaced
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $auction;
    public $user;

    public function __construct(Auction $auction, User $user)
    {
        $this->auction = $auction;
        $this->user = $user;
    }
}
