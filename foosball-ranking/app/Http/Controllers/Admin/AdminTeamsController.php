<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FoosballTeam;
use App\Models\User;
use Illuminate\Http\Request;

class AdminTeamsController extends Controller
{
    public function getTop10Teams()
    {
        return FoosballTeam::join('users as p1', 'foosball_teams.player1_id', '=', 'p1.id')
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
            'player1_username' => 'required',
            'player2_username' => 'required',
            'team_name' => 'required',
        ]);
        $player1 = User::where('username', $request->player1_username)->first();
        $player2 = User::where('username', $request->player2_username)->first();
        if (is_null($player1)) {
            return response('First user not found', 404);
        }
        if (is_null($player2)) {
            return response('Second user not found', 404);
        }
        return FoosballTeam::createTeam($player1, $player2, $request->team_name);
    }

    public function updateTeam($id, Request $request)
    {
        $request->validate([
            'team_name' => 'required',
        ]);
        FoosballTeam::updateTeamName($request->team_name, $id);
        return response('Team successfully updated', 200);
    }

    public function deleteTeam($id)
    {
        FoosballTeam::deleteTeam($id);
    }
}
