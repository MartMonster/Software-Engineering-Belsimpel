<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\User\Games2v2Controller;
use App\Http\Controllers\Controller;
use App\Models\FoosballTeam;
use App\Models\Game1v1;
use App\Models\Role;
use App\Models\User;
use App\Util\EloCalculator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function createGame(Request $request)
    {
        $request->validate([
            'player1_username' => 'required',
            'player2_username' => 'required',
            'player1_score' => 'required',
            'player2_score' => 'required',
        ]);

        $player1 = User::where('username', $request->player1_username)->first();
        $player2 = User::where('username', $request->player2_username)->first();
        if(is_null($player1)){
            return response('First user not found',404);
        }
        if(is_null($player2)){
            return response('Second user not found',404);
        }
        return Game1v1::store(
            $player1,
            $player2,
            $request->player1_score,
            $request->player2_score,
            1);
    }

    public function editGame(Request $request, string $id) {
        $request->validate([
            'player1_username' => 'required',
            'player2_username' => 'required',
            'player1_score' => 'required',
            'player2_score' => 'required',
        ]);
        $player1 = User::where('username', $request->player1_username)->first();
        $player2 = User::where('username', $request->player2_username)->first();
        if(is_null($player1)){
            return response('First user not found',404);
        }
        if(is_null($player2)){
            return response('Second user not found',404);
        }

        $game = Game1v1::where('id', $id)->first();
        if($game == null)
            return response('Not found',404);
        else {
            Game1v1::updateGameIdScores($game, $player1->id, $player2->id, $request->player1_score, $request->player2_score, 1);
            return $game;
        }
    }

    public function deleteGame(string $id) {
        $game = Game1v1::where('id', $id)->first();
        if($game == null)
            return response('Not found',404);
        else {
            $game->delete();
            return response('Game deleted',200);
        }
    }

    public function deletePlayer(string $id) {
        $player = User::where('id', $id)->first();
        if ($player == null)
            return response('Not found',404);
        if ($player->role_id == Role::where('role_name', 'Admin')->first()->id)
            return response('Forbidden: user is an admin',403);
        $player->delete();
        return response('Player deleted',200);
    }

    public function create2v2Game(Request $request) {
        $ids=array();
        array_push($ids,Games2v2Controller::getIdFromUsername($request->player1_username));
        array_push($ids,Games2v2Controller::getIdFromUsername($request->player2_username));
        array_push($ids,Games2v2Controller::getIdFromUsername($request->player3_username));
        array_push($ids,Games2v2Controller::getIdFromUsername($request->player4_username));
        if(in_array(null, $ids, true))
            return response("Player not found",404);
        if(count($ids) > count(array_unique($ids)))
            return response("Bad request",400);
        $team1 = Games2v2Controller::getTeamWithUsers($ids[0], $ids[1]);
        $team2 = Games2v2Controller::getTeamWithUsers($ids[2], $ids[3]);
        if(is_null($team1))
            $team1= Games2v2Controller::createTeam($ids[0],$ids[1]);
        if(is_null($team2))
            $team2=Games2v2Controller::createTeam($ids[2],$ids[3]);
        if ($request->team1_score != $request->team2_score)
            $updatedElo = EloCalculator::calculateElo($team1->elo,$team2->elo,30,
                $request->team1_score>$request->team2_score);
        else if ($team1->elo != $team2->elo)
            $updatedElo=EloCalculator::calculateElo($team1->elo,$team2->elo,15,$team1->elo < $team2->elo);
        else
            $updatedElo=[$team1->elo,$team2->elo];
        FoosballTeam::where('id',$team1->id)->update(['elo'=>$updatedElo[0]]);
        FoosballTeam::where('id',$team2->id)->update(['elo'=>$updatedElo[1]]);
        Games2v2Controller::createGameTeamScores($team1->id,$team2->id,$request->team1_score,$request->team2_score,$request->side);
        return $updatedElo;
    }

    public function update2v2Game(Request $request) {

    }

    public function isAdmin(): bool
    {
        return Auth::user()->role_id == Role::where('role_name', 'Admin')->first()->id;
    }
}
