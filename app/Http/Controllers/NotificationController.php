<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = DB::table('notifications')
            ->where('user_id', auth()->id())
            ->orderByDesc('id')
            ->get();

        return response()->json($notifications);
    }

    public function markAsRead(int $id)
    {
        DB::table('notifications')
            ->where('id', $id)
            ->where('user_id', auth()->id())
            ->update([
                'read_at' => now()
            ]);

        return response()->json(['success' => true]);
    }
}
