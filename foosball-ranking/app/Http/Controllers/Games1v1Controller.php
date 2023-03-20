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
        $player2=DB::table('users')->where('username', $request->player2Username)->first();
        $player1=Auth::user();
        if(is_null($player2)){
            return response('Second user not found',404);
        }
        if($player1->username== $player2->username){
            return response('Bad request',400);
        }

        $game = new Game1v1;
        if($request->player1Side==1){
            $game->player1_id = $player1->id;
            $game->player2_id = $player2->id;
            $game->player1_score = $request->player1Score;
            $game->player2_score = $request->player2Score;
        }
        else{
            $game->player1_id = $player2->id;
            $game->player2_id = $player1->id;
            $game->player1_score = $request->player2Score;
            $game->player2_score = $request->player1Score;
        }
        $game->save();

        if ($request->player1Score != $request->player2Score)
            $updatedElo = EloCalculator::calculateElo($player1->elo,$player2->elo,30,
                $request->player1Score>$request->player2Score);
        else
            $updatedElo=EloCalculator::calculateElo($player1->elo,$player2->elo,15,$player1->elo < $player2->elo);

        echo($updatedElo[0]);
        echo("\n");
        echo($updatedElo[1]);

        $newUser = User::all()->where('username', $player1->username)->get();
        $newUser->elo = $updatedElo[0];
        $newUser->save();

//        DB::table('users')
//            ->updateOrInsert(
//                ['username' => $player1->username],
//                ['elo' => $updatedElo[0]]
//        );

        DB::table('users')
            ->updateOrInsert(
                ['username' => $player2->username],
                ['elo' => $updatedElo[1]]
        );
        return response('Game succesfully created',201);
    }
}
