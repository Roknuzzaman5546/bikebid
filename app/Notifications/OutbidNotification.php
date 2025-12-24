<?php

namespace App\Notifications;

use App\Models\Auction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OutbidNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $auction;
    protected $newAmount;

    public function __construct(Auction $auction, float $newAmount)
    {
        $this->auction = $auction;
        $this->newAmount = $newAmount;
    }

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'auction_id' => $this->auction->id,
            'title' => $this->auction->title,
            'message' => "You have been outbid on '{$this->auction->title}'. New price: {$this->newAmount}",
            'new_price' => $this->newAmount,
            'url' => route('auctions.show', $this->auction->id)
        ];
    }
}
