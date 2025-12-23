<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bids', function (Blueprint $table) {
            $table->id();
            $table->foreignId('auction_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->decimal('amount', 10, 2);
            $table->string('idempotency_key')->unique();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
Schema::create('bids', function (Blueprint $table) {
    $table->id();
    $table->foreignId('auction_id')->constrained();
    $table->foreignId('user_id')->constrained();
    $table->decimal('amount', 10,2);
    $table->string('idempotency_key')->unique();
    $table->timestamps();
});

};
