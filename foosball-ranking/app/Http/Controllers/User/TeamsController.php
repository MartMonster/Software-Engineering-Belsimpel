<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\FoosballTeam;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TeamsController extends Controller
{
    public static function getTop10Teams()
    {
        return DB::table('foosball_teams as t')
            ->join('users as p1', 't.player1_id', '=', 'p1.id')
            ->join('users as p2', 't.player2_id', '=', 'p2.id')
            ->select('t.id as id',
                't.team_name as team_name',
                't.elo as elo',
                'p1.username AS player1_username',
                'p2.username AS player2_username'
            )->orderBy('elo', 'desc')->take(10)->get();
        // TODO: replace the above with eloquent
//        return FoosballTeam::orderBy('elo','desc')->paginate(10);
    }

    public static function getOwnTeams()
    {
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

    public function createTeam(Request $request)
    {
        $player2_id = User::where('username', $request->player2_username)->first()->id;
        if (is_null($player2_id)) {
            return response('Second user not found', 404);
        }
        return FoosballTeam::createTeam(Auth::id(), $player2_id, $request->team_name);

    }

    public function updateTeam(Request $request, string $id)
    {
        $team = FoosballTeam::find($id);
        if ($team == null)
            return response('Not found', 404);

        if ($team->player1_id != Auth::id() && $team->player2_id != Auth::id() &&
            Auth::user()->role_id != Role::where('role_name', 'Admin')->first()->id)
            return response('Unauthorized', 401);
        return FoosballTeam::updateTeamName($request->team_name, $id);
    }

    public function deleteTeam(string $id)
    {
        $team = FoosballTeam::find($id);
        if ($team == null)
            return response('Not found', 404);

        if ($team->player1_id != Auth::id() && $team->player2_id != Auth::id() &&
            Auth::user()->role_id != Role::where('role_name', 'Admin')->first()->id)
            return response('Unauthorized', 401);

        return FoosballTeam::deleteTeam($id);
    }
}
