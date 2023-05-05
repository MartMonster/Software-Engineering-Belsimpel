<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Util\EloCalculator;
use App\Models\User;

class Game1v1 extends Model
{
    use HasFactory;
    protected $table = 'games1v1';


    public static function store($player1,$player2,$player1_score,$player2_score,$player1_side){


        $game = new Game1v1;
        self::updateGameIdScores($game, $player1->id, $player2->id, $player1_score, $player2_score, $player1_side);

        if ($player1_score != $player2_score)
            $updatedElo = EloCalculator::calculateElo($player1->elo,$player2->elo,30,
                $player1_score>$player2_score);
        else if ($player1->elo != $player2->elo)
            $updatedElo=EloCalculator::calculateElo($player1->elo,$player2->elo,15,$player1->elo < $player2->elo);
        else
            $updatedElo=[$player1->elo, $player2->elo];

        User::where('username', $player1->username)->update(['elo' => $updatedElo[0]]);

        User::where('username', $player2->username)->update(['elo' => $updatedElo[1]]);
        return response('Game succesfully created',201);
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
}
