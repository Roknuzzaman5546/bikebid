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
    }

    public function unsuspend(User $user)
    {
        $user->update(['status' => 'active']);
    }
}
