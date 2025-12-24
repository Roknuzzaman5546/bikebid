<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuctionController;
use App\Http\Controllers\BidController;
use App\Http\Controllers\BuyNowController;
use App\Http\Controllers\WatchlistController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Admin\UserAdminController;
use App\Http\Controllers\Admin\AuctionAdminController;
use App\Http\Controllers\Admin\AuditController;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');


Route::get('/', [AuctionController::class, 'index'])->name('home');
Route::get('/auctions', [AuctionController::class, 'index'])->name('auctions.index');
Route::get('/auctions/create', [AuctionController::class, 'create'])->name('auctions.create');
Route::get('/auctions/{auction}', [AuctionController::class, 'show'])->name('auctions.show');
Route::get('/auctions/{auction}/updates', [AuctionController::class, 'updates'])->name('auctions.updates');


Route::middleware(['auth', 'active'])->group(function () {

    // Seller Dashboard
    Route::get('/dashboard', [AuctionController::class, 'myAuctions'])->name('dashboard');

    // Auctions (Seller)
    Route::post('/auctions', [AuctionController::class, 'store'])->name('auctions.store');
    Route::post('/auctions/{auction}/cancel', [AuctionController::class, 'cancel'])->name('auctions.cancel');

    // Bids
    Route::post('/auctions/{auction}/bid', [BidController::class, 'store'])
        ->name('bids.store');

    // Buy Now
    Route::post('/auctions/{auction}/buy-now', [BuyNowController::class, 'buy'])
        ->name('buy.now');

    // Watchlist
    Route::post('/watch/{auctionId}', [WatchlistController::class, 'toggle'])->name('watch.toggle');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');

    // Checkout
    Route::get('/auctions/{auction}/checkout', [\App\Http\Controllers\CheckoutController::class, 'show'])->name('checkout.show');
    Route::post('/auctions/{auction}/checkout', [\App\Http\Controllers\CheckoutController::class, 'process'])->name('checkout.process');
});


Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/users', [UserAdminController::class, 'index'])->name('admin.users.index');
    Route::post('/users/{user}/suspend', [UserAdminController::class, 'suspend'])->name('admin.users.suspend');
    Route::post('/users/{user}/unsuspend', [UserAdminController::class, 'unsuspend'])->name('admin.users.unsuspend');

    Route::get('/auctions', [AuctionAdminController::class, 'index'])->name('admin.auctions.index');
    Route::post('/auctions/{auction}/cancel', [AuctionAdminController::class, 'cancel'])->name('admin.auctions.cancel');

    Route::get('/audit-logs', [AuditController::class, 'index'])->name('admin.audit.index');
});




Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
