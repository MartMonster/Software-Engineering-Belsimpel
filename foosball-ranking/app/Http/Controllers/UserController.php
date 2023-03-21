<?php

namespace App\Http\Controllers;

use App\Models\PositionElo;
use App\Models\Role;
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
        return new PositionElo(Auth::user()->username, $this->getPosition(), $this->getElo());
    }

    public function getTop10() {
//        if (Auth::user()->role_id == Role::where('role_name', 'admin')->first()->id)
        return User::orderBy('elo', 'desc')->take(10)->get();
    }
}
