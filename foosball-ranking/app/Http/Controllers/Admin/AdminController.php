<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\User\Games2v2Controller;
use App\Models\FoosballTeam;
use App\Models\Game1v1;
use App\Models\Game2v2;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function create1v1Game(Request $request)
    {
        $request->validate([
            'player1_username' => 'required',
            'player2_username' => 'required',
            'player1_score' => 'required',
            'player2_score' => 'required',
        ]);

        $player1 = User::where('username', $request->player1_username)->first();
        $player2 = User::where('username', $request->player2_username)->first();
        if (is_null($player1)) {
            return response('First user not found', 404);
        }
        if (is_null($player2)) {
            return response('Second user not found', 404);
        }
        return Game1v1::store(
            $player1,
            $player2,
            $request->player1_score,
            $request->player2_score,
            1);
    }

    public function edit1v1Game(Request $request, string $id)
    {
        $request->validate([
            'player1_username' => 'required',
            'player2_username' => 'required',
            'player1_score' => 'required',
            'player2_score' => 'required',
        ]);
        $player1 = User::where('username', $request->player1_username)->first();
        $player2 = User::where('username', $request->player2_username)->first();
        if (is_null($player1)) {
            return response('First user not found', 404);
        }
        if (is_null($player2)) {
            return response('Second user not found', 404);
        }

        $game = Game1v1::where('id', $id)->first();
        if ($game == null)
            return response('Not found', 404);
        else {
            Game1v1::updateGameIdScores($game, $player1->id, $player2->id, $request->player1_score, $request->player2_score, 1);
            return $game;
        }
    }

    public function delete1v1Game(string $id)
    {
        $game = Game1v1::where('id', $id)->first();
        if ($game == null)
            return response('Not found', 404);
        else {
            $game->delete();
            return response('Game deleted', 200);
        }
    }

    public function create2v2Game(Request $request)
    {
        $players = array();
        $players[0] = User::where('username', $request->player1_username)->first();
        $players[1] = User::where('username', $request->player2_username)->first();
        $players[2] = User::where('username', $request->player3_username)->first();
        $players[3] = User::where('username', $request->player4_username)->first();
        if (in_array(null, $players, true))
            return response("Player not found", 404);
        if (count($players) > count(array_unique($players)))
            return response("Not all players are unique", 400);
        return Game2v2::store($players[0], $players[1], $players[2], $players[3], $request->team1_score, $request->team2_score, $request->side);
    }

    public function edit2v2Game($id, Request $request)
    {
        $game = Game2v2::where('id', $id)->first();
        if ($game == null)
            return response('Not found', 404);
        $ids = array();
        $ids[0] = Games2v2Controller::getIdFromUsername($request->player1_username);
        $ids[1] = Games2v2Controller::getIdFromUsername($request->player2_username);
        $ids[2] = Games2v2Controller::getIdFromUsername($request->player3_username);
        $ids[3] = Games2v2Controller::getIdFromUsername($request->player4_username);
        $team1_id = FoosballTeam::getTeamWithUsers($ids[0], $ids[1])->id;
        $team2_id = FoosballTeam::getTeamWithUsers($ids[2], $ids[3])->id;
        Game2v2::updateGameIdScores($game, $team1_id, $team2_id, $request->team1_score, $request->team2_score, 1);
        return response('Game succesfully updated', 200);
    }

    public function delete2v2Game($id)
    {
        $game = Game2v2::where('id', $id)->first();
        if ($game == null)
            return response('Not found', 404);
        else {
            $game->delete();
            return response('Game deleted', 200);
        }
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
        return response('Team succesfully updated', 200);
    }

    public function deleteTeam($id)
    {
        FoosballTeam::deleteTeam($id);
    }

    public function isAdmin(): bool
    {
        return Auth::user()->role_id == Role::where('role_name', 'Admin')->first()->id;
    }

    public function getTop10Users()
    {
        return User::orderBy('elo', 'desc')->paginate(10);
    }

    public function deletePlayer(string $id)
    {
        $player = User::where('id', $id)->first();
        if ($player == null)
            return response('Not found', 404);
        if ($player->role_id == Role::where('role_name', 'Admin')->first()->id)
            return response('Forbidden: user is an admin', 403);
        $player->delete();
        return response('Player deleted', 200);
    }

    public function editPlayer(string $id, Request $request)
    {
        $player = User::find($id);
        if ($player == null)
            return response('Not found', 404);
        if ($player->role_id == Role::where('role_name', 'Admin')->first()->id && !Auth::id() == $id)
            return response('Forbidden: user is an admin', 403);
        if (User::where('username', $request->username)->first() != null)
            return response('Username already taken', 400);
        $player->username = $request->username;
        $player->save();
        return response('Player updated', 200);
    }

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
}
