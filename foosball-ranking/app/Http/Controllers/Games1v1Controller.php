<?php

namespace App\Http\Controllers;

use App\Models\Game1v1;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB, Illuminate\Support\Facades\Auth;
use App\Util\EloCalculator;

class Games1v1Controller extends Controller
{
    public function store(Request $request){
        $player2=DB::table('users')->where('username', $request->player2_username)->first();
        $player1=Auth::user();
        if(is_null($player2)){
            return response('Second user not found',404);
        }
        if($player1->username== $player2->username){
            return response('Bad request',400);
        }

        $game = new Game1v1;
        if($request->player1_side==1){
            $game->player1_id = $player1->id;
            $game->player2_id = $player2->id;
            $game->player1_score = $request->player1_score;
            $game->player2_score = $request->player2_score;
        }
        else{
            $game->player1_id = $player2->id;
            $game->player2_id = $player1->id;
            $game->player1_score = $request->player2_score;
            $game->player2_score = $request->player1_score;
        }
        $game->save();

        if ($request->player1_score != $request->player2_score)
            $updatedElo = EloCalculator::calculateElo($player1->elo,$player2->elo,30,
                $request->player1_score>$request->player2_score);
        else
            $updatedElo=EloCalculator::calculateElo($player1->elo,$player2->elo,15,$player1->elo < $player2->elo);

        echo($updatedElo[0]);
        echo("\n");
        echo($updatedElo[1]);
        echo("\n");

        User::where('username', $player1->username)->update(['elo' => $updatedElo[0]]);

        User::where('username', $player2->username)->update(['elo' => $updatedElo[1]]);

        return response('Game succesfully created',201);
    }

    public function delete(Game1v1 $game1v1){
        $game1v1->delete();
        return response('Game succesfully deleted',200);
    }
}
