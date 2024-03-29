<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\FoosballTeam;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeamsController extends Controller
{
    public static function getTop10Teams()
    {
        return FoosballTeam::join('users as p1', 'foosball_teams.player1_id', '=', 'p1.id')
            ->join('users as p2', 'foosball_teams.player2_id', '=', 'p2.id')
            ->select('foosball_teams.id as id',
                'foosball_teams.team_name as team_name',
                'foosball_teams.elo as elo',
                'p1.username AS player1_username',
                'p2.username AS player2_username'
            )->orderBy('elo', 'desc')->take(10)->get();
    }

    public static function getOwnTeams()
    {
        return FoosballTeam::where('foosball_teams.player1_id', '=', Auth::id())
            ->orWhere('foosball_teams.player2_id', '=', Auth::id())
            ->join('users as p1', 'foosball_teams.player1_id', '=', 'p1.id')
            ->join('users as p2', 'foosball_teams.player2_id', '=', 'p2.id')
            ->select('foosball_teams.id as id',
                'foosball_teams.team_name as team_name',
                'foosball_teams.elo as elo',
                'p1.username AS player1_username',
                'p2.username AS player2_username'
            )->orderBy('elo', 'desc')->paginate(10);
    }

    public function createTeam(Request $request)
    {
        $request->validate([
            'team_name' => ['required', 'unique:' . FoosballTeam::class],
            'player2_username' => ['required', 'exists:' . User::class . ',username']

        ]);
        $player2 = User::where('username', $request->player2_username)->first();
        return FoosballTeam::createTeam(Auth::id(), $player2->id, $request->team_name);

    }

    public function updateTeam(Request $request, string $id)
    {
        $request->validate([
            'team_name' => ['required', 'unique:' . FoosballTeam::class]
        ]);
        $team = FoosballTeam::find($id);
        if ($team == null)
            return response('Not found', 404);

        if ($team->player1_id != Auth::id() && $team->player2_id != Auth::id())
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

    public function getUsersFromTeam(string $name)
    {
        $team = FoosballTeam::where('team_name', $name)->first();
        if ($team == null)
            return response('Not found', 404);
        return ([User::find($team->player1_id)->username, User::find($team->player2_id)->username]);
    }
}
