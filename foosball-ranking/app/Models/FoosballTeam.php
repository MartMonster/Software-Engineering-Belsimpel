<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Http\Controllers\User\Games2v2Controller;

class FoosballTeam extends Model
{
    use HasFactory;

    public static function createTeam($player1_id,$player2_id,$team_name) {
        $team=new FoosballTeam;
        $team->player1_id=$player1_id;
        $team->player2_id=$player2_id;
        if(Games2v2Controller::getTeamWithUsers($team->player1_id,$team->player2_id)!=null)
            return response("Bad request",400);

        if(is_null($team->player2_id))
            return response("Second user not found",404);
        if($team->player1_id ==$team->player2_id )
            return response("Bad request",400);
        $team->team_name=$team_name;

        $team->save();
        return response("Ok",200);

    }
    public static function updateTeamName($team_name, String $id) {
        $team = FoosballTeam::find($id);
        if($team == null)
            return response('Not found',404);
        $team->team_name = $team_name;
        $team->save();
        return FoosballTeam::find($id);
    }

    public static function deleteTeam(String $id) {
        $team = FoosballTeam::find($id);
        if($team == null)
            return response('Not found',404);
        $team->delete();
        return response('Team deleted',200);
    }

    public static function getTeamWithUsers($id1,$id2){
        $team =  FoosballTeam::where(fn ($query) =>
        $query->where('player1_id', $id1)
            ->where('player2_id', $id2)
        )->orWhere(fn ($query) =>
        $query->where('player1_id', $id2)
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

    public static function getIdsFromTeams($team_id){
        $team = FoosballTeam::find($team_id);
        $ids=array();
        if($team == null)
            return array();
        array_push($ids,$team->player1_id,$team->player2_id);
        return $ids;
    }
}
