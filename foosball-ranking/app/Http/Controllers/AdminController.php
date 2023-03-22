<?php

namespace App\Http\Controllers;

use App\Models\Game1v1;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    private static function updateGame(Game1v1 $game, $player1_id, $player2_id, $player1_score, $player2_score) {
        $game->player1_id = $player1_id;
        $game->player2_id = $player2_id;
        $game->player1_score = $player1_score;
        $game->player2_score = $player2_score;
        $game->save();
    }
    public function createGame(Request $request)
    {
        if (Auth::user()->role_id != Role::where('role_name', 'Admin')->first()->id)
            return response('Forbidden',403);
        $game = new Game1v1();
        $this->updateGame($game, $request->player1_id, $request->player2_id, $request->player1_score, $request->player2_score);
        return $game;
    }

    public function editGame(Request $request, string $id) {
        if (Auth::user()->role_id != Role::where('role_name', 'Admin')->first()->id)
            return response('Forbidden',403);
        $game = Game1v1::where('id', $id)->first();
        if($game == null)
            return response('Not found',404);
        else {
            $this->updateGame($game, $request->player1_id, $request->player2_id, $request->player1_score, $request->player2_score);
            return $game;
        }
    }

    public function deletePlayer(string $id) {
        if (Auth::user()->role_id != Role::where('role_name', 'Admin')->first()->id)
            return response('Forbidden',403);
        $player = User::firstOrFail($id);
        if ($player == null)
            return response('Not found',404);
        if ($player->role_id == Role::where('role_name', 'Admin')->first()->id)
            return response('Forbidden: user is an admin',403);
        $player->delete();
        return response('Player deleted',200);

    }
}
