<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class UserAdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Users', [
            'users' => User::all()
        ]);
    }

    public function suspend(User $user)
    {
        $user->update(['status' => 'suspended']);

        \App\Models\AuditLog::create([
            'action' => 'USER_SUSPENDED',
            'user_id' => auth()->id(),
            'details' => json_encode(['target_user_id' => $user->id])
        ]);

        return back()->with('success', 'User suspended');
    }

    public function unsuspend(User $user)
    {
        $user->update(['status' => 'active']);

        \App\Models\AuditLog::create([
            'action' => 'USER_UNSUSPENDED',
            'user_id' => auth()->id(),
            'details' => json_encode(['target_user_id' => $user->id])
        ]);

        return back()->with('success', 'User unsuspended');
    }
}
