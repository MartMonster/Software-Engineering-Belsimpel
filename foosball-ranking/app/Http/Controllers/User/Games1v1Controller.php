<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Game1v1;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Games1v1Controller extends Controller
{
    public function getOwnGames()
    {
        return DB::table('games1v1 as g')
            ->where('g.player1_id', Auth::id())->orWhere('g.player2_id', Auth::id())
            ->join('users as p1', 'g.player1_id', '=', 'p1.id')
            ->join('users as p2', 'g.player2_id', '=', 'p2.id')
            ->orderBy('g.created_at', 'desc')
            ->select('g.id as id',
                'g.player1_score as player1_score',
                'g.player2_score as player2_score',
                'p1.username AS player1_username',
                'p2.username AS player2_username')->paginate(10);
        // TODO: update the above to use eloquent
//        return Game1v1::where('player1_id', Auth::id())->orWhere('player2_id', Auth::id())->
//        orderBy('created_at', 'desc')->paginate(10);
    }

    public function getLast10Games()
    {
        return DB::table('games1v1 as g')
            ->join('users as p1', 'g.player1_id', '=', 'p1.id')
            ->join('users as p2', 'g.player2_id', '=', 'p2.id')
            ->orderBy('g.created_at', 'desc')
            ->select('g.id as id',
                'g.player1_score as player1_score',
                'g.player2_score as player2_score',
                'p1.username AS player1_username',
                'p2.username AS player2_username')->paginate(10);
        // TODO: update the above to use eloquent
//        return Game1v1::orderBy('created_at', 'desc')->paginate(10);
    }

    public function store(Request $request)
    {
        $player2 = User::where('username', $request->player2_username)->first();
        $player1 = Auth::user();
        if (is_null($player2)) {
            return response('Second user not found', 404);
        }
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
