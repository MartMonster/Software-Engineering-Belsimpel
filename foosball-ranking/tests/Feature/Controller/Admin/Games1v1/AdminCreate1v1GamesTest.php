<?php

namespace Tests\Controller\Admin\Games1v1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;


class AdminCreate1v1GamesTest extends TestCase
{
    use RefreshDatabase;



    public function test_admin_can_create_1v1_games(){
        $players = $this->create_players(3);
        $admin=self::makeUserAdmin($players[0]);
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $this->post('admin/games1v1', [
            "player1_username" => $players[1]->username,
            "player2_username" => $players[2]->username,
            "player1_score" => 10,
            "player2_score" => 5,
        ])->assertStatus(201);
        self::check_if_game_exists($players[1],$players[2],10,5);
    }

    public function test_admin_cant_create_1v1_games_with_invalid_scores(){
        $players = $this->create_players(3);
        $admin=self::makeUserAdmin($players[0]);

        
        self::createAdminGame($admin,"f",5,$players[1],$players[2])->assertStatus(422);
        self::createAdminGame($admin,10,-1,$players[1],$players[2])->assertStatus(422);
        self::createAdminGame($admin,11,-1,$players[1],$players[2])->assertStatus(422);
    }

    public function test_admin_cant_create_1v1_games_when_the_names_are_invalid(){
        $players = $this->create_players(3);
        $admin=self::makeUserAdmin($players[0]) ;

        
        $players[1]->username="";
        self::createAdminGame($admin,10,-1,$players[1],$players[2])->assertStatus(422);
        $players[1]->username="NonExistentUser";
        self::createAdminGame($admin,10,5,$players[1],$players[2])->assertStatus(422);
    }



    public function test_admin_cant_create_games_when_not_logged_in(){
        $players = $this->create_players(3);
        $admin=self::makeUserAdmin($players[0]) ;
        $this->json('post','admin/games1v1', [
            "player1_username" => $players[1]->username,
            "player2_username" => $players[2]->username,
            "player1_score" => 10,
            "player2_score" => 5,
        ])->assertStatus(401);
        $this->assertDatabaseMissing('games1v1', [
            'player1_id' => $players[1]->id,
            'player2_id' => $players[2]->id,
            'player1_score' => 10,
            'player2_score' => 5,
        ]);
        
    }


    public function test_users_cant_use_admin_create_1v1_function(){
        $players = $this->create_players(3);
        self::createAdminGame($players[0],10,5,$players[1],$players[2])->assertStatus(401);
        $this->assertDatabaseMissing('games1v1', [
            'player1_id' => $players[1]->id,
            'player2_id' => $players[2]->id,
            'player1_score' => 10,
            'player2_score' => 5,
        ]);
    }





    public function test_admin_cannot_create_1v1_game_when_both_players_are_the_same(){
        $players = $this->create_players(2);
        $admin=self::makeUserAdmin($players[0]);
        self::createAdminGame($admin,10,5,$players[1],$players[1])->assertStatus(400);
        
    }














    private function check_if_game_exists($player1,$player2,$score1,$score2){
        $this->assertDatabaseHas('games1v1', [
            'player1_id' => $player1->id,
            'player2_id' => $player2->id,
            'player1_score' => $score1,
            'player2_score' => $score2,
        ]);
    }


    private static function makeUserAdmin($player){
        $player->role_id=1;
        $player->save();
        return $player;

    }

    private static function create_players($x)
    {
        $players = array();
        for ($i = 0; $i < $x; $i++) {
            $players[] = User::factory()->create();
        }
        return $players;
    }

    private function createAdminGame($admin,$score1,$score2,$player1,$player2){
        $this->post('login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $response=$this->json('post','admin/games1v1', [
            "player1_username" => $player1->username,
            "player2_username" => $player2->username,
            "player1_score" => $score1,
            "player2_score" => $score2,
        ]);
        $this->post('logout');
        return $response;
    }


   
}
