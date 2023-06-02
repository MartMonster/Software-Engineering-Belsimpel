<?php

namespace Tests\Controller\Admin\Games1v1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Game1v1;


class AdminUpdate1v1GamesTest extends TestCase
{
    use RefreshDatabase;


    public function test_admin_can_update_1v1_games(){
        $players = $this->create_players(3);
        $admin=self::makeUserAdmin($players[0]);
        $this->createAdminGame($admin,10,5,$players[1],$players[2]);
        $game=self::find1v1Game($players[1],$players[2],10,5);
        $this->assertNotNull($game);
        $this->adminUpdateGame($admin,$game,10,9,$players[1],$players[2],0)->assertStatus(200);
        $expectedGame=self::find1v1Game($players[1],$players[2],10,9);
        $this->assertEquals($game->id,$expectedGame->id);
    }



    public function test_admin_can_swap_players_on_games(){
        $players = $this->create_players(3);
        $admin=self::makeUserAdmin($players[0]);
        $this->createAdminGame($admin,10,5,$players[1],$players[2]);
        $game=self::find1v1Game($players[1],$players[2],10,5);
        $this->assertNotNull($game);
        $this->adminUpdateGame($admin,$game,10,9,$players[1],$players[2],1)->assertStatus(200);
        $this->assertEquals($game->id,self::find1v1Game($players[2],$players[1],10,9)->id);
    }



    
    public function test_admin_cannot_update_1v1_games_with_invalid_scores(){
        $players = $this->create_players(3);
        $admin=self::makeUserAdmin($players[0]);
        $this->createAdminGame($admin,10,5,$players[1],$players[2]);
        $game=self::find1v1Game($players[1],$players[2],10,5);
        $this->assertNotNull($game);
        $this->adminUpdateGame($admin,$game,12,9,$players[1],$players[2],1)->assertStatus(422);
        $this->adminUpdateGame($admin,$game,10,-3,$players[1],$players[2],1)->assertStatus(422);
        $this->adminUpdateGame($admin,$game,10,"f",$players[1],$players[2],1)->assertStatus(422);
        $this->assertEquals($game,Game1v1::find($game->id));
    }


    public function test_returns_appropiate_response_when_admin_updating_inexistent_game(){
        $players = $this->create_players(3);
        $admin=self::makeUserAdmin($players[0]);
        $this->post('login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $this->json('put','admin/games1v1/1', [
            "player1_score" => 10,
            "player2_score" => 9,
            "swap"=>0
        ])->assertStatus(404);
    }

        
    public function test_users_cannot_use_admin_update_function(){
        $players = $this->create_players(4);
        $admin=self::makeUserAdmin($players[0]);
        self::createAdminGame($admin,10,5,$players[1],$players[2]);
        $game=self::find1v1Game($players[1],$players[2],10,5);
        $this->assertNotNull($game);
        self::adminUpdateGame($players[3],$game,10,9,$players[1],$players[2],0)->assertStatus(401);

    }
    

    public function test_admin_update_not_available_when_not_logged_in(){
        $players = $this->create_players(3);
        $admin=self::makeUserAdmin($players[0]);
        self::createAdminGame($admin,10,5,$players[1],$players[2]);
        $game=self::find1v1Game($players[1],$players[2],10,5);
        $this->assertNotNull($game);
        $this->json('put','admin/games1v1/'.$game->id, [
            "player1_score" => 10,
            "player2_score" => 9,
            "swap"=>0
        ])->assertStatus(401);

    }
  














    
    
    
    private function adminUpdateGame($admin,$game,$score1,$score2,$player1,$player2,$swap){
        $this->post('login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $response=$this->json('put','admin/games1v1/'.$game->id, [
            "player1_score" => $score1,
            "player2_score" => $score2,
            "swap"=>$swap
        ]);
        $this->post('logout');
        return $response;
    }
    
    private function check_if_game_exists($player1,$player2,$score1,$score2){
        $this->assertDatabaseHas('games1v1', [
            'player1_id' => $player1->id,
            'player2_id' => $player2->id,
            'player1_score' => $score1,
            'player2_score' => $score2,
        ]);
    }

    private function find1v1Game($player1,$player2,$score1,$score2){
        $game=Game1v1::where('player1_id',$player1->id)
        ->where('player2_id',$player2->id)
        ->where('player1_score',$score1)
        ->where('player2_score',$score2)
        ->first();
        return $game;
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
