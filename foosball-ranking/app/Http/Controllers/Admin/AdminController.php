<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\User\Games2v2Controller;
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
    private static function updateGame(Game1v1 $game, $player1_id, $player2_id, $player1_score, $player2_score) {
        $game->player1_id = $player1_id;
        $game->player2_id = $player2_id;
        $game->player1_score = $player1_score;
        $game->player2_score = $player2_score;
        $game->save();
    }
    public function createGame(Request $request)
    {
        if (Auth::user()->role_id != Role::where('role_name', 'Admin')->first()->id)
            return response('Forbidden',403);
        $game = new Game1v1();
        $this->updateGame($game, $request->player1_id, $request->player2_id, $request->player1_score, $request->player2_score);
        return $game;
    }

    public function editGame(Request $request, string $id) {
        if (Auth::user()->role_id != Role::where('role_name', 'Admin')->first()->id)
            return response('Forbidden',403);
        $game = Game1v1::where('id', $id)->first();
        if($game == null)
            return response('Not found',404);
        else {
            $this->updateGame($game, $request->player1_id, $request->player2_id, $request->player1_score, $request->player2_score);
            return $game;
        }
    }

    public function deletePlayer(string $id) {
        if (Auth::user()->role_id != Role::where('role_name', 'Admin')->first()->id)
            return response('Forbidden',403);
        $player = User::where('id', $id)->first();
        if ($player == null)
            return response('Not found',404);
        if ($player->role_id == Role::where('role_name', 'Admin')->first()->id)
            return response('Forbidden: user is an admin',403);
        $player->delete();
        return response('Player deleted',200);
    }

    public function create2v2Game(Request $request) {
        if (Auth::user()->role_id != Role::where('role_name', 'Admin')->first()->id)
            return response('Forbidden',403);
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
