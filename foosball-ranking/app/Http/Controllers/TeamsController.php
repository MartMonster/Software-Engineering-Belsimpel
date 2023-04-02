<?php

namespace App\Http\Controllers;

use App\Models\FoosballTeam;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Games2v2Controller;

class TeamsController extends Controller
{
    public static function getTop10Teams() {
        return DB::table('foosball_teams as t')
            ->join('users as p1', 't.player1_id', '=', 'p1.id')
            ->join('users as p2', 't.player2_id', '=', 'p2.id')
            ->select('t.id as id',
                't.team_name as team_name',
                't.elo as elo',
                'p1.username AS player1_username',
                'p2.username AS player2_username'
            )->orderBy('elo', 'desc')->paginate(10);
        // TODO: replace the above with eloquent
//        return FoosballTeam::orderBy('elo','desc')->paginate(10);
    }

    public static function getOwnTeams() {
        return DB::table('foosball_teams as t')
            ->where('t.player1_id', '=', Auth::id())
            ->orWhere('t.player2_id', '=', Auth::id())
            ->join('users as p1', 't.player1_id', '=', 'p1.id')
            ->join('users as p2', 't.player2_id', '=', 'p2.id')
            ->select('t.id as id',
                't.team_name as team_name',
                't.elo as elo',
                'p1.username AS player1_username',
                'p2.username AS player2_username'
            )->orderBy('elo', 'desc')->paginate(10);
        // TODO: replace the above with eloquent
//        return FoosballTeam::where('player1_id', Auth::id())->orWhere('player2_id', Auth::id())->
//        orderBy('elo', 'desc')->paginate(10);
    }

    public function createTeam(Request $request) {
        $team=new FoosballTeam;
        $team->player1_id=Auth::id();
        error_log("hey");
        $team->player2_id=Games2v2Controller::getIdFromUsername($request->player2_username);
        if(Games2v2Controller::getTeamWithUsers($team->player1_id,$team->player2_id)!=null)
            return response("Bad request",400);

        if(is_null($team->player2_id))
            return response("Second user not found",404);
        if($team->player1_id ==$team->player2_id )
            return response("Bad request",400);
        $team->team_name=$request->team_name;
        
        $team->save();

    }

    public function updateTeam(Request $request, String $id) {
        $team = FoosballTeam::find($id);
        if($team == null)
            return response('Not found',404);
        if($team->player1_id!=Auth::id() && $team->player2_id!=Auth::id() &&
            Auth::user()->role_id != Role::where('role_name', 'Admin')->first()->id)
            return response('Unauthorized',401);
        $team->team_name = $request->team_name;
        $team->save();
        return FoosballTeam::find($id);
    }

    public function deleteTeam(String $id) {
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
