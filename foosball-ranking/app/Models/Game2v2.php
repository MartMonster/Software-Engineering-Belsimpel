<?php

namespace App\Models;

use App\Util\EloCalculator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game2v2 extends Model
{
    use HasFactory;

    protected $table = 'games2v2';

    public static function store($player1, $player2, $player3, $player4, $team1_score, $team2_score, $team1_side)
    {
        $game = new Game2v2;
        $team1 = FoosballTeam::getOrCreateTeamWithUsers($player1->id, $player2->id);
        $team2 = FoosballTeam::getOrCreateTeamWithUsers($player3->id, $player4->id);
        $updatedElo = EloCalculator::calculateElo($team1->elo, $team2->elo, $team1_score, $team2_score);
        self::updateGameIdScores($game, $team1->id, $team2->id, $team1_score, $team2_score, $team1_side);
        FoosballTeam::where('id', $team1->id)->update(['elo' => $updatedElo[0]]);
        FoosballTeam::where('id', $team2->id)->update(['elo' => $updatedElo[1]]);
        return response('Game succesfully created', 201);
    }

    public static function updateGameIdScores(Game2v2 $game, $team1_id, $team2_id, $team1_score, $team2_score, $team1_side)
    {
        if ($team1_side == 1) {
            $game->team1_id = $team1_id;
            $game->team2_id = $team2_id;
            $game->team1_score = $team1_score;
            $game->team2_score = $team2_score;
        } else {
            $game->team1_id = $team2_id;
            $game->team2_id = $team1_id;
            $game->team1_score = $team2_score;
            $game->team2_score = $team1_score;
        }
        $game->save();
    }
}
