<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\FoosballTeam;
use App\Models\Game2v2;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Response;

class Games2v2Controller extends Controller
{

    public static function update($id, Request $request)
    {
        //get the game we want to modify and see if it is valid
        $game = self::checkIfPlayedInGame($id);
        if ($game instanceof Response || $game instanceof ResponseFactory)
            return $game;
        $request->validate([
            'team1_score' => 'required|integer|min:0|max:127',
            'team2_score' => 'required|integer|min:0|max:127',
            'side' => 'required|integer',
        ]);
        if (in_array(Auth::id(), FoosballTeam::getIdsFromTeams($game->team1_id))) {
            $team1_id = $game->team1_id;
            $team2_id = $game->team2_id;
        } else {
            $team1_id = $game->team2_id;
            $team2_id = $game->team1_id;
        }

        //update the game
        Game2v2::updateGameIdScores($game, $team1_id, $team2_id, $request->team1_score, $request->team2_score, $request->side);
        return response('Game succesfully updated', 200);
    }

    private static function checkIfPlayedInGame($game_id)
    {
        $game = Game2v2::find($game_id);
        if ($game == null)
            return response('Not found', 404);
        $game_ids = array();
        $game_ids = array_merge($game_ids, FoosballTeam::getIdsFromTeams($game->team1_id));
        $game_ids = array_merge($game_ids, FoosballTeam::getIdsFromTeams($game->team2_id));
        if (!in_array(Auth::id(), $game_ids))
            return response("Not authorized", 401);
        return $game;
    }

    public static function delete($id)
    {
        if(self::checkIfPlayedInGame($id)==response("Not authorized", 401))
            return response("Not authorized", 401);
        if(self::checkIfPlayedInGame($id)==response('Not found', 404))
            return response('Not found', 404);
        Game2v2::where('id', $id)->delete();
        return response('Game succesfully deleted', 200);
    }

    public function getOwnGames()
    {
        $result = Game2v2::join('foosball_teams as t1', 'games2v2.team1_id', '=', 't1.id')
            ->join('foosball_teams as t2', 'games2v2.team2_id', '=', 't2.id')
            ->join('users as p', function ($join) {
                $join->on('t1.player1_id', '=', 'p.id')
                    ->orOn('t1.player2_id', '=', 'p.id')
                    ->orOn('t2.player1_id', '=', 'p.id')
                    ->orOn('t2.player2_id', '=', 'p.id');
            })
            ->where('p.id', '=', Auth::id())
            ->orderBy('games2v2.created_at', 'desc')
            ->select('games2v2.id as id',
                'games2v2.team1_score as team1_score',
                'games2v2.team2_score as team2_score',
                't1.team_name AS team1_name',
                't2.team_name AS team2_name'
            )->paginate(10);
        return ($result);
    }

    public function getLast10Games()
    {
        $result = Game2v2::join('foosball_teams as t1', 'games2v2.team1_id', '=', 't1.id')
            ->join('foosball_teams as t2', 'games2v2.team2_id', '=', 't2.id')
            ->orderBy('games2v2.created_at', 'desc')
            ->select('games2v2.id as id',
                'games2v2.team1_score as team1_score',
                'games2v2.team2_score as team2_score',
                't1.team_name AS team1_name',
                't2.team_name AS team2_name'
            )->paginate(10);
        return $result;
    }

    public function store(Request $request)
    {
        $players = array();
        $players[0] = Auth::user();
        $players[1] = User::where('username', $request->player2_username)->first();
        $players[2] = User::where('username', $request->player3_username)->first();
        $players[3] = User::where('username', $request->player4_username)->first();
        $request->validate([
            'team1_score' => 'required|integer|min:0|max:127',
            'team2_score' => 'required|integer|min:0|max:127',
            'side' => 'required|integer',
        ]);
        if (in_array(null, $players, true)) {
            return response("Not found", 404);
        }
        if (count($players) > count(array_unique($players)))
            return response("Not all players are unique", 400);

        return Game2v2::store($players[0], $players[1], $players[2], $players[3], $request->team1_score, $request->team2_score, $request->side);
    }

}
