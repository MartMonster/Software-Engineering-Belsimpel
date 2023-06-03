<?php

namespace Tests\Controller\Admin\Games1v1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Game1v1;


class AdminDelete1v1GamesTest extends TestCase
{
    use RefreshDatabase;


    public function test_admin_can_delete_1v1_games(){
        $players = $this->create_players(3);
        $admin=self::makeUserAdmin($players[0]);
        $this->createAdminGame($admin,10,0,$players[1],$players[2]);
        self::DeleteAdminGame($admin,10,0,$players[1],$players[2])->assertStatus(200);
        $this->assertDatabaseMissing('games1v1', [
            'player1_id' => $players[1]->id,
            'player2_id' => $players[2]->id,
            'player1_score' => 10,
            'player2_score' => 0,
        ]);
    }
   

    public function test_users_cant_use_admin_delete_1v1_function(){
        $players = $this->create_players(4);
        $admin=self::makeUserAdmin($players[0]);
        self::createAdminGame($players[0],10,5,$players[1],$players[2])->assertStatus(201);

        self::DeleteAdminGame($players[1],10,5,$players[1],$players[2])->assertStatus(401);
        $this->assertDatabaseHas('games1v1', [
            'player1_id' => $players[1]->id,
            'player2_id' => $players[2]->id,
            'player1_score' => 10,
            'player2_score' => 5,
        ]);
    }


    public function test_must_be_logged_in_to_use_the_delete_admin_function(){
        $players = $this->create_players(3);
        $admin=self::makeUserAdmin($players[0]);
        self::createAdminGame($players[0],10,5,$players[1],$players[2])->assertStatus(201);
        $game=self::find1v1Game($players[1],$players[2],10,5);
        $this->json('delete','admin/games1v1/'.$game->id)->assertStatus(401);
        $this->assertDatabaseHas('games1v1', [
            'player1_id' => $players[1]->id,
            'player2_id' => $players[2]->id,
            'player1_score' => 10,
            'player2_score' => 5,
        ]);
    }

    

    public function test_returns_appropiate_response_when_admin_deletes_non_existent_1v1_games(){
        $players = $this->create_players(3);
        $admin=self::makeUserAdmin($players[0]);
        $this->post('login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $this->json('delete','admin/games1v1/1')->assertStatus(404);

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
    private function DeleteAdminGame($admin,$score1,$score2,$player1,$player2){
        $this->post('login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $game=$this->find1v1Game($player1,$player2,$score1,$score2);
        $response=$this->json('delete','admin/games1v1/'.$game->id);
        $this->post('logout');
        return $response;
    }
    private function find1v1Game($player1,$player2,$score1,$score2){
        $game=Game1v1::where('player1_id',$player1->id)
        ->where('player2_id',$player2->id)
        ->where('player1_score',$score1)
        ->where('player2_score',$score2)
        ->first();
        return $game;
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
