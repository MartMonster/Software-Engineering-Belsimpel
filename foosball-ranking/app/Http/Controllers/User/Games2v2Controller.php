<?php
namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\FoosballTeam;
use App\Models\Game2v2;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class Games2v2Controller extends Controller
{

    public function getOwnGames(){
        $result = DB::table('games2v2 as g')
                ->join('foosball_teams as t1', 'g.team1_id', '=', 't1.id')
                ->join('foosball_teams as t2', 'g.team2_id', '=', 't2.id')
                ->join('users as p', function($join) {
                    $join->on('t1.player1_id', '=', 'p.id')
                        ->orOn('t1.player2_id', '=', 'p.id')
                        ->orOn('t2.player1_id', '=', 'p.id')
                        ->orOn('t2.player2_id', '=', 'p.id');
                })
                ->where('p.id', '=', Auth::id())
                ->orderBy('g.created_at', 'desc')
                ->select('g.id as id',
                'g.team1_score as team1_score',
                'g.team2_score as team2_score',
                't1.team_name AS team1_name',
                't2.team_name AS team2_name'
                )->paginate(10);
        return($result);
    }
    public function getLast10Games(){
        $result = DB::table('games2v2 as g')
                ->join('foosball_teams as t1', 'g.team1_id', '=', 't1.id')
                ->join('foosball_teams as t2', 'g.team2_id', '=', 't2.id')
                ->orderBy('g.created_at', 'desc')
                ->select('g.id as id',
                'g.team1_score as team1_score',
                'g.team2_score as team2_score',
                't1.team_name AS team1_name',
                't2.team_name AS team2_name'
                )->paginate(10);
        return $result;
    }


    public function store(Request $request){
        $ids=array();
        $ids[0] = Auth::id();
        $ids[1] = self::getIdFromUsername($request->player2_username);
        $ids[2] = self::getIdFromUsername($request->player3_username);
        $ids[3] = self::getIdFromUsername($request->player4_username);
        if(in_array(null, $ids, true)){
            return response("Not found",404);
        }
        if(count($ids) > count(array_unique($ids)))
            return response("Bad request",400);

        return Game2v2::store($ids[0], $ids[1], $ids[2], $ids[3], $request->team1_score, $request->team2_score, $request->side);
    }

    public static function update($id,Request $request){
        //get the game we want to modify and see if it is valid
        $game = self::checkIfPlayedInGame($id);

        if (in_array(Auth::id(), FoosballTeam::getIdsFromTeams($game->team1_id))) {
            $team1_id = $game->team1_id;
            $team2_id = $game->team2_id;
        }
        else {
            $team1_id = $game->team2_id;
            $team2_id = $game->team1_id;
        }

        //update the game
        Game2v2::updateGameIdScores($game,$team1_id,$team2_id,$request->team1_score,$request->team2_score,$request->side);
        return response('Game succesfully updated',200);
    }

    public static function delete($id) {
        self::checkIfPlayedInGame($id);
        Game2v2::where('id',$id)->delete();
        return response('Game succesfully deleted',200);
    }

    private static function checkIfPlayedInGame($game_id){
        $game = Game2v2::find($game_id);
        if($game==null)
            return response('Not found',404);
        $game_ids=array();
        $game_ids=array_merge($game_ids,FoosballTeam::getIdsFromTeams($game->team1_id));
        $game_ids=array_merge($game_ids,FoosballTeam::getIdsFromTeams($game->team2_id));
        if (!in_array(Auth::id(),$game_ids))
            return response("Not authorized",401);
        return $game;
    }

    public static function createGameTeamScores($team1_id, $team2_id, $team1_score, $team2_score, $side) {
        $newGame = new Game2v2();
        if ($side == 1) {
            $newGame->team1_id = $team1_id;
            $newGame->team2_id = $team2_id;
            $newGame->team1_score = $team1_score;
            $newGame->team2_score = $team2_score;
        } else {
            $newGame->team1_id = $team2_id;
            $newGame->team2_id = $team1_id;
            $newGame->team1_score = $team2_score;
            $newGame->team2_score = $team1_score;
        }
        $newGame->save();
    }



    public static function createTeam($id1,$id2){
        $newTeam = new FoosballTeam();
        $newTeam->player1_id = $id1;
        $newTeam->player2_id = $id2;
        $newTeam->save();
        $newTeam->team_name = $newTeam->id;
        $newTeam->save();
        return FoosballTeam::where('id', $newTeam->id)->first();
    }

    public static function getIdFromUsername($username){
        $user=User::where('username', $username)->first();
        if(is_null($user)){
            return null;
        }
        return $user->id;
    }

    public static function getTeamWithUsers($id1,$id2){
        $team = FoosballTeam::where(fn ($query) =>
            $query->where('player1_id', $id1)
                ->where('player2_id', $id2)
        )->orWhere(fn ($query) =>
            $query->where('player1_id', $id2)
                ->where('player2_id', $id1)
        )->first();
        return $team;
    }

}
