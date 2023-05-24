<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminUserController extends Controller
{
    public function isAdmin(): bool
    {
        return Auth::user()->role_id == Role::where('role_name', 'Admin')->first()->id;
    }

    public function getTop10Users()
    {
        return User::orderBy('elo', 'desc')->paginate(10);
    }

    public function editPlayer(string $id, Request $request)
    {
        $player = User::find($id);
        if ($player == null)
            return response('Not found', 404);
        if ($player->role_id == Role::where('role_name', 'Admin')->first()->id && !Auth::id() == $id)
            return response('Forbidden: user is an admin', 403);
        if (User::where('username', $request->username)->first() != null)
            return response('Username already taken', 400);
        $player->username = $request->username;
        $player->save();
        return response('Player updated', 200);
    }

    public function deletePlayer(string $id)
    {
        $player = User::where('id', $id)->first();
        if ($player == null)
            return response('Not found', 404);
        if ($player->role_id == Role::where('role_name', 'Admin')->first()->id)
            return response('Forbidden: user is an admin', 403);
        $player->delete();
        return response('Player deleted', 200);
    }
}
