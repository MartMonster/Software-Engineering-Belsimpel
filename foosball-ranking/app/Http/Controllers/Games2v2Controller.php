<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB,Auth;
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

}
