<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserSummary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    //
    public function getPosElo(): string
    {
        $usPosElo = new UserSummary();
        $usPosElo->username = Auth::user()->username;
        $usPosElo->position = $this->getPosition();
        $usPosElo->elo = $this->getElo();
        return $usPosElo;
    }

    private function getPosition(): int
    {
        $userId = Auth::id();
        $users = User::orderBy('elo', 'desc')->get();
        $i = 1;
        foreach ($users as $user) {
            if ($user->id == $userId) {
                break;
            }
            $i++;
        }
        return $i;
    }

    private function getElo(): float
    {
        $userId = Auth::id();
        $user = User::findOrFail($userId);
        return $user->elo;
    }

    public function editUsername(Request $request)
    {
        if (User::where('username', $request->username)->first() != null)
            return response('Username already taken', 400);
        $request->validate([
            'username' => 'required|string|max:255',
        ]);
        Auth::user()->username = $request->username;
        Auth::user()->save();
        return response('Username changed', 200);
    }

    public function getTop10()
    {
        return User::select('id', 'username', 'elo')->orderBy('elo', 'desc')->take(10)->get();
    }
}
