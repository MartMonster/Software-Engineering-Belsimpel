<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth,DB;
class TeamsController extends Controller
{
    

    public static function createTeam($id1,$id2){
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
}
