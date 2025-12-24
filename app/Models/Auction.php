<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Auction extends Model
{
    protected $fillable = [
        'seller_id',
        'title',
        'description',
        'condition',
        'location',
        'starting_price',
        'current_price',
        'min_increment',
        'reserve_price',
        'buy_now_price',
        'start_time',
        'end_time',
        'state',
        'winner_id'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function bids()
    {
        return $this->hasMany(Bid::class);
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}

