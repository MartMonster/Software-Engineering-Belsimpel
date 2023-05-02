<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\UserSummary;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    //
    private function getPosition(): int
    {
        $userId = Auth::id();
        $users = User::orderBy('elo', 'desc')->get();
        $i=1;
        foreach ($users as $user){
            if($user->id == $userId){
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

    public function getPosElo(): string
    {
        $usPosElo = new UserSummary();
        $usPosElo->username = Auth::user()->username;
        $usPosElo->position = $this->getPosition();
        $usPosElo->elo = $this->getElo();
        return $usPosElo;
    }

    public function getTop10() {
        return User::orderBy('elo', 'desc')->take(10)->get();
    }
}
