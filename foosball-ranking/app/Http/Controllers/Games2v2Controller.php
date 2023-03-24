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

        
        $team2=self::getTeamWithUsers($ids[2],$ids[3]);
        $team1=self::getTeamWithUsers($ids[0],$ids[1]);
        if(is_null($team2))
            $team2=self::createTeam($ids[2],$ids[3]);
        if(is_null($team1))
            $team1= self::createTeam($ids[0],$ids[1]);

        if ($request->team1_score != $request->team2_score)
            $updatedElo = EloCalculator::calculateElo($team1->elo,$team2->elo,30,
                $request->team1_score>$request->team2_score);
        else
            $updatedElo=EloCalculator::calculateElo($team1->elo,$team2->elo,15,$team1->elo < $team2->elo);

        DB::table('foosball_teams')
            ->where('id',$team1->id)
            ->update(['elo'=>$updatedElo[0]]);

        DB::table('foosball_teams')
            ->where('id',$team2->id)
            ->update(['elo'=>$updatedElo[1]]);

        self::updateGameTeamScores($team1->id,$team2->id,$request->team1_score,$request->team2_score,$request->side);
        return $updatedElo;
    }



    private static function updateGameTeamScores($team1_id, $team2_id, $team1_score, $team2_score, $side) {
        echo($side);
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
