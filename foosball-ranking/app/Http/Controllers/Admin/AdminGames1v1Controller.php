<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game1v1;
use App\Models\User;
use Illuminate\Http\Request;

class AdminGames1v1Controller extends Controller
{
    public function create1v1Game(Request $request)
    {
        $request->validate([
            'player1_username' => 'required',
            'player2_username' => 'required',
            'player1_score' => 'required',
            'player2_score' => 'required',
        ]);

        $player1 = User::where('username', $request->player1_username)->first();
        $player2 = User::where('username', $request->player2_username)->first();
        if (is_null($player1)) {
            return response('First user not found', 404);
        }
        if (is_null($player2)) {
            return response('Second user not found', 404);
        }
        return Game1v1::store(
            $player1,
            $player2,
            $request->player1_score,
            $request->player2_score,
            1);
    }

    public function edit1v1Game(Request $request, string $id)
    {
        $request->validate([
            'player1_username' => 'required',
            'player2_username' => 'required',
            'player1_score' => 'required',
            'player2_score' => 'required',
        ]);
        $player1 = User::where('username', $request->player1_username)->first();
        $player2 = User::where('username', $request->player2_username)->first();
        if (is_null($player1)) {
            return response('First user not found', 404);
        }
        if (is_null($player2)) {
            return response('Second user not found', 404);
        }

        $game = Game1v1::where('id', $id)->first();
        if ($game == null)
            return response('Not found', 404);
        else {
            Game1v1::updateGameIdScores($game, $player1->id, $player2->id, $request->player1_score, $request->player2_score, 1);
            return $game;
        }
    }

    public function delete1v1Game(string $id)
    {
        $game = Game1v1::where('id', $id)->first();
        if ($game == null)
            return response('Not found', 404);
        else {
            $game->delete();
            return response('Game deleted', 200);
        }
    }
}
