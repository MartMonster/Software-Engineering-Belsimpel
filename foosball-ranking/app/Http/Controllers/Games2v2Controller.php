<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use DB,Auth;
use App\Util\EloCalculator;
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
                ->select('g.id',
                'g.team1_score',
                'g.team2_score',
                'g.created_at',
                'g.updated_at',
                't1.team_name AS t1_name',
                't2.team_name AS t2_name'
                )->paginate(10);
        return($result);
    }
    public function getLast10Games(){
        $result = DB::table('games2v2 as g')
                ->join('foosball_teams as t1', 'g.team1_id', '=', 't1.id')
                ->join('foosball_teams as t2', 'g.team2_id', '=', 't2.id')
                ->select('g.id',
                'g.team1_score',
                'g.team2_score',
                'g.created_at',
                'g.updated_at',
                't1.team_name AS t1_name',
                't2.team_name AS t2_name'
                )->paginate(10);
        return $result;
    }


    public function store(Request $request){
        $ids=array();
        array_push($ids,Auth::id());
        array_push($ids,self::getIdFromUsername($request->player2_username));
        array_push($ids,self::getIdFromUsername($request->player3_username));
        array_push($ids,self::getIdFromUsername($request->player4_username));
        if(in_array(null, $ids, true)){
            return response("Not found",404);
        }
        if(count($ids) > count(array_unique($ids)))
            return response("Bad request",400);


        $team1=self::getTeamWithUsers($ids[0],$ids[1]);
        $team2=self::getTeamWithUsers($ids[2],$ids[3]);
        if(is_null($team1))
            $team1= self::createTeam($ids[0],$ids[1]);
        if(is_null($team2))
            $team2=self::createTeam($ids[2],$ids[3]);

        if ($request->team1_score != $request->team2_score)
            $updatedElo = EloCalculator::calculateElo($team1->elo,$team2->elo,30,
                $request->team1_score>$request->team2_score);
        else if ($team1->elo != $team2->elo)
            $updatedElo=EloCalculator::calculateElo($team1->elo,$team2->elo,15,$team1->elo < $team2->elo);
        else
            $updatedElo=[$team1->elo,$team2->elo];
        DB::table('foosball_teams')
            ->where('id',$team1->id)
            ->update(['elo'=>$updatedElo[0]]);

        DB::table('foosball_teams')
            ->where('id',$team2->id)
            ->update(['elo'=>$updatedElo[1]]);

        self::createGameTeamScores($team1->id,$team2->id,$request->team1_score,$request->team2_score,$request->side);
        return $updatedElo;
    }

    public static function update($id,Request $request){
        //get the game we want to modify and see if it is valid
        $game=DB::table('games2v2')->find($id);
        if($game==null)
            return response('Not found',404);
        
        //see if the authenthificated user is part of this game
        $game_ids=array();
        $game_ids=array_merge($game_ids,self::getIdsFromTeams($game->team1_id));
        $game_ids=array_merge($game_ids,self::getIdsFromTeams($game->team2_id));
        if(!in_array(Auth::id(),$game_ids))
            return response("Not authorized",401);


        //get the id of the two teams provided     
        $request_team1_id=self::getTeamIdFromTeamName($request->team1_name);
        $request_team2_id=self::getTeamIdFromTeamName($request->team2_name);

        
        //get all the ids of the provided teams
        $request_ids=array();
        $request_ids=array_merge($request_ids,self::getIdsFromTeams($request_team1_id));
        $request_ids=array_merge($request_ids,self::getIdsFromTeams($request_team2_id));
        
        //check if they are the same
        sort($game_ids);
        sort($request_ids);
        if(!($game_ids===$request_ids))
            return response('Player ids don\'t match up',400);

        //update the game
        self::updateGameTeamScores($id,$request_team1_id,$request_team2_id,$request->team1_score,$request->team2_score,$request->side);
        return response('Game succesfully updated',200);
    }


    private static function getIdsFromTeams($team_id){
        $team=DB::table('foosball_teams')->find($team_id);
        $ids=array();
        if($team == null)
            return array();
        array_push($ids,$team->player1_id,$team->player2_id);
        return $ids;

    }

    
    private static function updateGameTeamScores($game_id,$team1_id, $team2_id, $team1_score, $team2_score, $side) {
        if ($side == 1) {
            DB::table('games2v2')
            ->where('id',$game_id)
            ->update([
                'team1_id'=>$team1_id,
                'team2_id'=>$team2_id,
                'team1_score'=>$team1_score,
                'team2_score'=>$team2_score,
                'updated_at'=>now()
            ]);
        } else {
            DB::table('games2v2')
            ->where('id',$game_id)
            ->update([
                'team1_id'=>$team2_id,
                'team2_id'=>$team1_id,
                'team1_score'=>$team2_score,
                'team2_score'=>$team1_score,
                'updated_at'=>now()
            ]);
        }

        return;
    }

    private static function createGameTeamScores($team1_id, $team2_id, $team1_score, $team2_score, $side) {
        if ($side == 1) {
            DB::table('games2v2')->insert([
                'team1_id'=>$team1_id,
                'team2_id'=>$team2_id,
                'team1_score'=>$team1_score,
                'team2_score'=>$team2_score,
                'created_at'=>now()
            ]);
        } else {
            DB::table('games2v2')->insert([
                'team1_id'=>$team2_id,
                'team2_id'=>$team1_id,
                'team1_score'=>$team2_score,
                'team2_score'=>$team1_score,
                'created_at'=>now()
            ]);
        }

        return;
    }



    private static function createTeam($id1,$id2){
        $new_id=DB::table('foosball_teams')->insertGetId([
            'player1_id'=>$id1,
            'player2_id'=>$id2,
            'created_at'=>now()
        ]);
        error_log($new_id);
        DB::table('foosball_teams')
        ->where('id',$new_id)
        ->update(['team_name'=>$new_id]);
        return DB::table('foosball_teams')->find($new_id);
    }

    private static function getIdFromUsername($username){
        $user=User::where('username', $username)->first();
        if(is_null($user)){
            return null;
        }
        return $user->id;
    }

    private static function getTeamIdFromTeamName($team_name){
        $team=DB::table('foosball_teams')->where('team_name', $team_name)->first();
        if(is_null($team)){
            return null;
        }
        return $team->id;
    }

    private static function getTeamWithUsers($id1,$id2){
            $team=DB::table('foosball_teams')->
            where(fn($query) =>
                $query->where('player1_id',$id1)
                      ->where('player2_id',$id2)
            )
            ->orWhere(fn($query) =>
                $query->where('player1_id',$id2)
                      ->where('player2_id',$id1)
            )
            ->get()->first();
            return $team;


    }

}
