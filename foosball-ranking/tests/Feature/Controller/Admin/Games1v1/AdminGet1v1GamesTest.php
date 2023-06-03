<?php

namespace Tests\Controller\Admin\Games1v1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;


class AdminGet1v1GamesTest extends TestCase
{
    use RefreshDatabase;


    //Because there is no specific implementation anything more than just 
    //checking if the admin can use the function would lead to duplicate code

    public function test_admin_can_use_the_1v1_games_get_function(){
        $players = $this->create_players(3);
        $admin=self::makeUserAdmin($players[0]);
        $this->createAdminGame($admin,10,0,$players[1],$players[2]);
        $expectedGame=self::createExpectedGame($players[1],$players[2],10,0);
        $this->post('login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $gameReturned=$this->get('/games1v1')->getData()->data;
        unset($gameReturned[0]->id);
        $this->assertEquals($expectedGame,$gameReturned[0]);
    }














    private function createExpectedGame($player1,$player2,$score1,$score2){
        return (object)[
            "player1_username" => $player1->username,
            "player2_username" => $player2->username,
            "player1_score" => $score1,
            "player2_score" => $score2,
        ];
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
