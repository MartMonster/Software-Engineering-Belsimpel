<?php

namespace App\Http\Controllers;

use App\Models\PositionElo;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    //
    public function getPosition(): int
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

    public function getElo(): float
    {
        $userId = Auth::id();
        $user = User::findOrFail($userId);
        return $user->elo;
    }

    public function getPosElo(): string
    {
        return new PositionElo(Auth::user()->username, $this->getPosition(), $this->getElo());
    }
}
