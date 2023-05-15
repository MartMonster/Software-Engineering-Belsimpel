<?php

namespace App\Models;

use App\Http\Controllers\User\Games2v2Controller;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FoosballTeam extends Model
{
    use HasFactory;

    public static function createTeam($player1_id, $player2_id, $team_name)
    {
        $team = new FoosballTeam;
        $team->player1_id = $player1_id;
        $team->player2_id = $player2_id;

        if(is_null($team_name)||$team_name=="")
            return response("Invalid Team Name", 400);
        
        /// TODO: remove this weird dependency 
        if (Games2v2Controller::getTeamWithUsers($team->player1_id, $team->player2_id) != null)
            return response("Bad request", 400);

        if (FoosballTeam::where('team_name',$team_name)->first()!=null)
            return response("Team name already taken",400);

        if ($team->player1_id == $team->player2_id)
            return response("Bad request", 400);
        $team->team_name = $team_name;

        $team->save();
        return response("Ok", 201);

    }

    public static function updateTeamName($team_name, string $id)
    {
        $team = FoosballTeam::find($id);
        if ($team == null)
            return response('Not found', 404);
        $team->team_name = $team_name;
        $team->save();
        return FoosballTeam::find($id);
    }

    public static function deleteTeam(string $id)
    {
        $team = FoosballTeam::find($id);
        if ($team == null)
            return response('Not found', 404);
        $team->delete();
        return response('Team deleted', 200);
    }

    public static function getTeamWithUsers($id1, $id2)
    {
        $team = FoosballTeam::where(fn($query) => $query->where('player1_id', $id1)
            ->where('player2_id', $id2)
        )->orWhere(fn($query) => $query->where('player1_id', $id2)
            ->where('player2_id', $id1)
        )->first();
        if ($team == null) {
            $team = new FoosballTeam;
            $team->player1_id = $id1;
            $team->player2_id = $id2;
            $team->save();
            $team->team_name = $team->fresh()->id;
            $team->save();
        }
        return $team->fresh();
    }

    public static function getIdsFromTeams($team_id)
    {
        $team = FoosballTeam::find($team_id);
        $ids = array();
        if ($team == null)
            return array();
        array_push($ids, $team->player1_id, $team->player2_id);
        return $ids;
    }
}
