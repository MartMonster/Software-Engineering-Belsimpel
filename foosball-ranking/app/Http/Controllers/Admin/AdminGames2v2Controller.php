<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FoosballTeam;
use App\Models\Game2v2;
use App\Models\User;
use Illuminate\Http\Request;

class AdminGames2v2Controller extends Controller
{
    public function create2v2Game(Request $request)
    {
        $players = array();
        $players[0] = User::where('username', $request->player1_username)->first();
        $players[1] = User::where('username', $request->player2_username)->first();
        $players[2] = User::where('username', $request->player3_username)->first();
        $players[3] = User::where('username', $request->player4_username)->first();
        if (in_array(null, $players, true))
            return response("Player not found", 404);
        if (count($players) > count(array_unique($players)))
            return response("Not all players are unique", 400);
        return Game2v2::store($players[0], $players[1], $players[2], $players[3], $request->team1_score, $request->team2_score, $request->side);
    }

    public function edit2v2Game($id, Request $request)
    {
        $request->validate([
            'team1_score' => 'required|integer|min:0|max:10',
            'team2_score' => 'required|integer|min:0|max:10',
            'swap' => 'required|integer|min:0|max:1'
        ]);
        $game = Game2v2::where('id', $id)->first();
        if ($game == null)
            return response('Not found', 404);
        if (!$request->swap) {
            $team1_id = $game->team1_id;
            $team2_id = $game->team2_id;
        } else {
            $team1_id = $game->team2_id;
            $team2_id = $game->team1_id;
        }
        Game2v2::updateGameIdScores($game, $team1_id, $team2_id, $request->team1_score, $request->team2_score, 1);
        return response('Game successfully updated', 200);
    }

    public function delete2v2Game($id)
    {
        $game = Game2v2::where('id', $id)->first();
        if ($game == null)
            return response('Not found', 404);
        else {
            $game->delete();
            return response('Game deleted', 200);
        }
    }
}
