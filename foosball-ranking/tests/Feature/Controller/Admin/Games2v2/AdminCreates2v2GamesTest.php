<?php

namespace Tests\Feature\Controller\Admin\Games2v2;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Game2v2;
use App\Models\FoosballTeam;
use stdClass;

class AdminCreates2v2GamesTest extends TestCase
{
    use RefreshDatabase;


    public function test_admin_can_create_2v2_game_and_teams_get_created(){
        $players = $this->create_players(5);
        $admin = self::makeUserAdmin($players[0]);
        $results=$this->adminCreate2v2Game($admin,$players[1],$players[2],$players[3],$players[4],10,8,1);
        $results[0]->assertStatus(201);
        $this->assertNotNull($results[1]);
        $this->assertNotNull(self::findTeam($players[1],$players[2]));
        $this->assertNotNull(self::findTeam($players[3],$players[4]));
    }


    public function test_admin_can_create_2v2_when_teams_already_exist(){
        $players = $this->create_players(5);
        $admin = self::makeUserAdmin($players[0]);
        self::createTeamAdmin($players[1],$players[2],"team1",$admin);
        self::createTeamAdmin($players[3],$players[4],"team2",$admin);
        $results=$this->adminCreate2v2Game($admin,$players[1],$players[2],$players[3],$players[4],10,8,1);
        $results[0]->assertStatus(201);
        $this->assertNotNull($results[1]);
        $this->assertEquals($results[1]->team1_id,self::findTeam($players[1],$players[2])->id);
        $this->assertEquals($results[1]->team2_id,self::findTeam($players[3],$players[4])->id);
    }

     public function test_admin_can_create_2v2_and_teams_get_swapped(){
        $players = $this->create_players(5);
        $admin = self::makeUserAdmin($players[0]);
        self::createTeamAdmin($players[1],$players[2],"team1",$admin);
        self::createTeamAdmin($players[3],$players[4],"team2",$admin);
        $results=$this->adminCreate2v2Game($admin,$players[1],$players[2],$players[3],$players[4],10,8,2);
        $results[0]->assertStatus(201);
        $this->assertNotNull($results[1]);
        $this->assertEquals($results[1]->team2_id,self::findTeam($players[1],$players[2])->id);
        $this->assertEquals($results[1]->team1_id,self::findTeam($players[3],$players[4])->id);
    }




     public function test_admin_cant_create_2v2_games_with_duplicate_players(){
        $players = $this->create_players(4);
        $admin = self::makeUserAdmin($players[0]);
        $results=$this->adminCreate2v2Game($admin,$players[1],$players[2],$players[3],$players[3],10,8,2);
        $results[0]->assertStatus(400);
        $this->assertNull($results[1]);

    }



     public function test_admin_cant_create_2v2_games_when_one_of_the_player_is_missing(){
        $players = $this->create_players(4);
        $admin = self::makeUserAdmin($players[0]);
        $players[3]->username=null;
        $results=$this->adminCreate2v2Game($admin,$players[1],$players[2],$players[3],$players[3],10,8,2);
        $results[0]->assertStatus(404);
        $this->assertNull($results[1]);

    }



     public function test_admin_cant_create_2v2_games_when_one_of_the_players_doesnt_exist(){
        $players = $this->create_players(4);
        $admin = self::makeUserAdmin($players[0]);
        $players[3]->username="nonExsistentPlayer";
        $results=$this->adminCreate2v2Game($admin,$players[1],$players[2],$players[3],$players[3],10,8,2);
        $results[0]->assertStatus(404);
        $this->assertNull($results[1]);

    }



     public function test_admin_cant_create_2v2_with_out_of_bounds_score(){
        $players = $this->create_players(4);
        $admin = self::makeUserAdmin($players[0]);
        $results=$this->adminCreate2v2Game($admin,$players[1],$players[2],$players[3],$players[3],12,8,2);
        $results[0]->assertStatus(400);
        $results=$this->adminCreate2v2Game($admin,$players[1],$players[2],$players[3],$players[3],10,-1,2);
        $results[0]->assertStatus(400);
        $this->assertNull($results[1]);

    }


    public function test_admin_create_2v2_game_function_is_not_available_when_not_logged_in(){
        $players = $this->create_players(5);
        $this->json('post', '/admin/games2v2', [
            'player1_username' => $players[1]->username,
            'player2_username' => $players[2]->username,
            'player3_username' => $players[3]->username,
            'player4_username' => $players[4]->username,
            'team1_score' => 10,
            'team2_score' => 8,
            'team1_id' => 1
        ])->assertStatus(401);
    }


     public function test_admin_create_2v2_game_function_is_not_available_to_non_admin_users(){
         $players = $this->create_players(5);
         $results=$this->adminCreate2v2Game($players[0],$players[1],$players[2],$players[3],$players[4],10,8,1);
        $results[0]->assertStatus(401);
        $this->assertNull($results[1]);
        $this->assertNull(self::findTeam($players[1],$players[2]));
        $this->assertNull(self::findTeam($players[3],$players[4]));
    }











    private static function makeUserAdmin($player){
        $player->role_id=1;
        $player->save();
        return $player;

    }
    private function createTeamAdmin($plyer1,$player2,$teamName,$admin){
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $response=$this->json('post','/admin/teams', [
            'player1_username' => $plyer1->username,
            'player2_username' => $player2->username,
            'team_name' => $teamName,
        ]);
        $this->post('/logout');
        return $response;
    }

    private function findTeam($player1, $player2)
    {
        $team = FoosballTeam::where('player1_id', $player1->id)
            ->where('player2_id', $player2->id)->first();
        if (is_null($team)) {
            $team = FoosballTeam::where('player1_id', $player2->id)
                ->where('player2_id', $player1->id)->first();
        }
        return $team;

    }

    private function find2v2Game($player1, $player2, $player3, $player4, $team1_score, $team2_score, $side)
    {
        if ($side == 1) {
            $team1 = self::findTeam($player1, $player2);
            $team2 = self::findTeam($player3, $player4);
        } else {
            $team1 = self::findTeam($player3, $player4);
            $team2 = self::findTeam($player1, $player2);
            $tmp=$team1_score;
            $team1_score=$team2_score;
            $team2_score=$tmp;
        }

        //To avoid php complaining we force create the id property
        if(is_null($team1)){
            $team1= new stdClass();
            $team1->id=null;
        }
        if(is_null($team2)){
            $team2= new stdClass();
            $team2->id=null;
        }
        $game = Game2v2::where('team1_id', $team1->id)
            ->where('team2_id', $team2->id)
            ->where('team1_score', $team1_score)
            ->where('team2_score', $team2_score)
            ->first();
        return $game;
    }

    private function adminCreate2v2Game($admin,$player1,$player2,$player3,$player4,$score1,$score2,$side){
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $response=$this->json('post','/admin/games2v2', [
            'player1_username' => $player1->username,
            'player2_username' => $player2->username,
            'player3_username' => $player3->username,
            'player4_username' => $player4->username,
            'team1_score' => $score1,
            'team2_score' => $score2,
            'side' => $side,
        ]);
        $this->post('/logout');
        return array($response,self::find2v2Game($player1,$player2,$player3,$player4,$score1,$score2,$side));
    }


    private static function create_players($x)
    {
        $players = array();
        for ($i = 0; $i < $x; $i++) {
            $players[] = User::factory()->create();
        }
        return $players;
    }






}
