<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Game1v1;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Games1v1Controller extends Controller
{
    public function getOwnGames()
    {
        return Game1v1::where('games1v1.player1_id', Auth::id())->orWhere('games1v1.player2_id', Auth::id())
            ->join('users as p1', 'games1v1.player1_id', '=', 'p1.id')
            ->join('users as p2', 'games1v1.player2_id', '=', 'p2.id')
            ->orderBy('games1v1.created_at', 'desc')
            ->select('games1v1.id as id',
                'games1v1.player1_score as player1_score',
                'games1v1.player2_score as player2_score',
                'p1.username AS player1_username',
                'p2.username AS player2_username')->paginate(10);
    }

    public function getLast10Games()
    {
        return Game1v1::join('users as p1', 'games1v1.player1_id', '=', 'p1.id')
            ->join('users as p2', 'games1v1.player2_id', '=', 'p2.id')
            ->orderBy('games1v1.created_at', 'desc')
            ->select('games1v1.id as id',
                'games1v1.player1_score as player1_score',
                'games1v1.player2_score as player2_score',
                'p1.username AS player1_username',
                'p2.username AS player2_username')->paginate(10);
    }

    public function store(Request $request)
    {
        $request->validate([
            'player1_score' => 'required|integer',
            'player2_score' => 'required|integer',
            'player1_side' => 'required|integer',
            'player2_username' => 'required|string|exists:users,username'
        ]);
        $player2 = User::where('username', $request->player2_username)->first();
        $player1 = Auth::user();
        if ($player1->username == $player2->username) {
            return response('Bad request', 400);
        }


        return Game1v1::store(
            $player1,
            $player2,
            $request->player1_score,
            $request->player2_score,
            $request->player1_side);


    }

    public function update(Request $request, string $id)
    {
        $game = Game1v1::where('id', $id)->first();
        if ($game == null)
            return response('Not found', 404);
        $player1 = User::find($game->player1_id);
        $player2 = User::find($game->player2_id);
        if ($game->player1_id == Auth::id() || $game->player2_id == Auth::id()) {
            $opponent = $game->player1_id == Auth::id() ? $player2 : $player1;
            Game1v1::updateGameIdScores($game, Auth::id(), $opponent->id, $request->player1_score, $request->player2_score, $request->player1_side);
            return response('Game succesfully updated', 200);
        } else
            return response('Unauthorized access', 401);
    }

    public function delete(string $id)
    {
        $game = Game1v1::where('id', $id)->first();
        if ($game == null)
            return response('Not found', 404);
        if ($game->player1_id == Auth::id() || $game->player2_id == Auth::id()) {
            $game->delete();
            return response('Game succesfully deleted', 200);
        }
        return response('Unauthorized access', 401);
    }
}
