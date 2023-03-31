<?php

namespace App\Http\Controllers;

use App\Models\Game1v1;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Util\EloCalculator;
use Illuminate\Support\Facades\DB;

class Games1v1Controller extends Controller
{
    public function getOwnGames() {
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

    public function getLast10Games() {
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

    public function store(Request $request){
        $player2 = User::where('username', $request->player2_username)->first();
        $player1=Auth::user();
        if(is_null($player2)){
            return response('Second user not found',404);
        }
        if($player1->username== $player2->username){
            return response('Bad request',400);
        }

        $game = new Game1v1;
        $this->updateGameIdScores($game, $player1->id, $player2->id, $request->player1_score, $request->player2_score, $request->player1_side);

        if ($request->player1_score != $request->player2_score)
            $updatedElo = EloCalculator::calculateElo($player1->elo,$player2->elo,30,
                $request->player1_score>$request->player2_score);
        else if ($player1->elo != $player2->elo)
            $updatedElo=EloCalculator::calculateElo($player1->elo,$player2->elo,15,$player1->elo < $player2->elo);
        else
            $updatedElo=[$player1->elo, $player2->elo];
        echo($updatedElo[0]);
        echo("\n");
        echo($updatedElo[1]);
        echo("\n");

        User::where('username', $player1->username)->update(['elo' => $updatedElo[0]]);

        User::where('username', $player2->username)->update(['elo' => $updatedElo[1]]);

        return response('Game succesfully created',201);
    }

    public function update(Request $request, String $id) {
        $game = Game1v1::where('id', $id)->first();
        if($game == null)
            return response('Not found',404);
        $player1 = User::find($game->player1_id);
        $player2 = User::find($game->player2_id);
        if($game->player1_id==Auth::id() || $game->player2_id==Auth::id()) {
            $opponent = $game->player1_id == Auth::id() ? $player2 : $player1;
            $this->updateGameIdScores($game, Auth::id(), $opponent->id, $request->player1_score, $request->player2_score, $request->player1_side);
            return response('Game succesfully updated',200);
        }
        else
            return response('Unauthorized access',401);
    }

    private static function updateGameIdScores(Game1v1 $game, $player1_id, $player2_id, $player1_score, $player2_score, $side) {
        if ($side == 1) {
            $game->player1_id = $player1_id;
            $game->player2_id = $player2_id;
            $game->player1_score = $player1_score;
            $game->player2_score = $player2_score;
        } else {
            $game->player1_id = $player2_id;
            $game->player2_id = $player1_id;
            $game->player1_score = $player2_score;
            $game->player2_score = $player1_score;
        }
        $game->save();
    }

    public function delete(String $id){
        $game = Game1v1::where('id', $id)->first();
        if($game == null)
            return response('Not found',404);
        if($game->player1_id==Auth::id() || $game->player2_id==Auth::id() ||
            Auth::user()->role_id == Role::where('role_name', 'Admin')->first()->id){
                $game->delete();
                return response('Game succesfully deleted',200);
        }
        return response('Unauthorized access',401);
    }
}
