<?php

namespace App\Http\Controllers;

use App\Models\FoosballTeam;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeamsController extends Controller
{
    public static function getTop10Teams() {
        return FoosballTeam::orderBy('elo','desc')->paginate(10);
    }

    public static function getOwnTeams() {
        return FoosballTeam::where('player1_id', Auth::id())->orWhere('player2_id', Auth::id())->
        orderBy('elo', 'desc')->paginate(10);
    }

    public function createTeam(Request $request) {
        return Games2v2Controller::createTeam($request->player1_id, $request->player2_id);
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
