<?php

namespace App\Http\Controllers;

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

        if($request->player1Side==1){
            DB::table('games1v1')->insert([
                'player1_id'=>$player1->id,
                'player2_id'=>$player2->id,
                'player2_score'=>$request->player2Score,
                'player1_score'=>$request->player1Score,
                'created_at'=>now()
            ]);
        }
        else{
            DB::table('games1v1')->insert([
                'player1_id'=>$player2->id,
                'player2_id'=>$player1->id,
                'player2_score'=>$request->player1Score,
                'player1_score'=>$request->player2Score,
                'created_at'=>now()
            ]);
        }

        if ($request->player1Score != $request->player2Score)
            $updatedElo = EloCalculator::calculateElo($player1->elo,$player2->elo,30,
                $request->player1Score>$request->player2Score);
        else
            $updatedElo=EloCalculator::calculateElo($player1->elo,$player2->elo,15,$player1->elo < $player2->elo);

        echo($updatedElo[0]);
        echo("\n");
        echo($updatedElo[1]);

        DB::table('users')
            ->updateOrInsert(
                ['username' => $player1->username],
                ['elo' => $updatedElo[0]]
        );

        DB::table('users')
            ->updateOrInsert(
                ['username' => $player2->username],
                ['elo' => $updatedElo[1]]
        );
        return response('Game succesfully created',201);
    }
}
