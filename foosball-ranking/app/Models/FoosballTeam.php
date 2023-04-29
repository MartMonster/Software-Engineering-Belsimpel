<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Games2v2Controller;

class FoosballTeam extends Model
{
    use HasFactory;

    public static function createTeam($player2_username,$team_name) {
        $team=new FoosballTeam;
        $team->player1_id=Auth::id();
        $team->player2_id=Games2v2Controller::getIdFromUsername($player2_username);
        if(Games2v2Controller::getTeamWithUsers($team->player1_id,$team->player2_id)!=null)
            return response("Bad request",400);

        if(is_null($team->player2_id))
            return response("Second user not found",404);
        if($team->player1_id ==$team->player2_id )
            return response("Bad request",400);
        $team->team_name=$team_name;
        
        $team->save();

    }
    public static function updateTeamName($team_name, String $id) {
        $team = FoosballTeam::find($id);
        if($team == null)
            return response('Not found',404);
        if($team->player1_id!=Auth::id() && $team->player2_id!=Auth::id() &&
            Auth::user()->role_id != Role::where('role_name', 'Admin')->first()->id)
            return response('Unauthorized',401);
        $team->team_name = $team_name;
        $team->save();
        return FoosballTeam::find($id);
    }

    public static function deleteTeam(String $id) {
        $team = FoosballTeam::find($id);
        if($team == null)
            return response('Not found',404);
        if($team->player1_id!=Auth::id() && $team->player2_id!=Auth::id() &&
            Auth::user()->role_id != Role::where('role_name', 'Admin')->first()->id)
            return response('Unauthorized',401);
        $team->delete();
        return response('Team deleted',200);
    }
}
