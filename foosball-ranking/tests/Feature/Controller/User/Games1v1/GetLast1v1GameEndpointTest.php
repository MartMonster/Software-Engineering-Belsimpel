<?php

namespace Tests\Feature\Controller\User\Games1v1;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Game1v1;
use \stdClass;
class GetLast1v1GameEndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_retrieve_the_last_1v1_10games_when_there_are_less_than_10(): void
    {
        $player1 = User::factory()->create();
        
        $player2 = User::factory()->create();

        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $this->post('/games1v1', [
            'player2_username'=>$player2->username,
            'player2_score'=>10,
            'player1_score'=>7,
            'player1_side'=>1,
        ]);
        $response=$this->get('/games1v1')->assertStatus(200);
        $game= new stdClass();
        $game->player1_username=$player1->username;
        $game->player2_username=$player2->username;
        $game->player1_score=7;
        $game->player2_score=10;

        $game1=$response->getData()->data[0];
        unset($game1->id);
        $this->assertEquals($game,$game1);
        
    }

    public function test_users_can_see_the_last_1v1_10game(): void
    {
        $player1 = User::factory()->create();
        
        $player2 = User::factory()->create();

        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);
        for($i=0;$i<10;$i++){
            $this->post('/games1v1', [
                'player2_username'=>$player2->username,
                'player2_score'=>10,
                'player1_score'=>7,
                'player1_side'=>1,
            ]);
        }
        $response=$this->get('/games1v1')->assertStatus(200);
        $game= new stdClass();
        $game->player1_username=$player1->username;
        $game->player2_username=$player2->username;
        $game->player1_score=7;
        $game->player2_score=10;

        for($i=0;$i<10;$i++){
            $game1=$response->getData()->data[$i];
            unset($game1->id);
            $this->assertEquals($game,$game1);
        }
    }
    public function test_users_can_see_the_last_1v1_10game_no_matter_who_played_in_them(): void
    {
        $player1 = User::factory()->create();
        
        $player2 = User::factory()->create();

        $player3=User::factory()->create();
        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);
        for($i=0;$i<12;$i++){
            $this->post('/games1v1', [
                'player2_username'=>$player2->username,
                'player2_score'=>10,
                'player1_score'=>7,
                'player1_side'=>1,
            ]);
        }
        $this->post('/logout');
        $this->post('/login', [
            'email' => $player3->email,
            'password' => 'password',
        ]);
        $response=$this->get('/games1v1')->assertStatus(200);
        $game= new stdClass();
        $game->player1_username=$player1->username;
        $game->player2_username=$player2->username;
        $game->player1_score=7;
        $game->player2_score=10;

        for($i=0;$i<10;$i++){
            $game1=$response->getData()->data[$i];
            unset($game1->id);
            $this->assertEquals($game,$game1);
        }
        $this->assertArrayNotHasKey(11,$response->getData()->data);
        $this->assertArrayNotHasKey(12,$response->getData()->data);
    }
    public function test_games_are_ordered_decreasingly_by_date(): void
    {
        $player1 = User::factory()->create();
        
        $player2 = User::factory()->create();

        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);
        for($i=0;$i<5;$i++){
            $this->post('/games1v1', [
                'player2_username'=>$player2->username,
                'player2_score'=>10,
                'player1_score'=>7,
                'player1_side'=>1,
            ]);
        }
        sleep(1);
        for($i=0;$i<5;$i++){
            $this->post('/games1v1', [
                'player2_username'=>$player2->username,
                'player2_score'=>12,
                'player1_score'=>5,
                'player1_side'=>1,
            ]);
        }
        $response=$this->get('/games1v1')->assertStatus(200);
        $game= new stdClass();
        $game->player1_username=$player1->username;
        $game->player2_username=$player2->username;

        $game->player1_score=5;
        $game->player2_score=12;

        for($i=0;$i<5;$i++){
            $game1=$response->getData()->data[$i];
            unset($game1->id);
            $this->assertEquals($game,$game1);
        }
        $game->player1_score=7;
        $game->player2_score=10;

        for($i=5;$i<10;$i++){
            $game1=$response->getData()->data[$i];
            unset($game1->id);
            $this->assertEquals($game,$game1);
        }
    }

    public function test_returns_proper_response_code_when_not_authenticated_getting_1v1games_(): void
    {
        //First create the two players
        $player1 = User::factory()->create();

        $player2=  User::factory()->create();
        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);


        //Create the game
        $this->post('/games1v1', [
            'player2_username'=>$player2->username,
            'player2_score'=>10,
            'player1_score'=>7,
            'player1_side'=>1,
        ])->assertStatus(201);
        
        //Make sure the game exists
        $game=Game1v1::where( 'player2_id' , $player2->id)
        ->where('player1_id' , $player1->id)
        ->where('player2_score' , 10)
        ->where('player1_score' , 7)->first();
        $this->assertNotNull($game);

        //logot and then make sure that we've succesfully logged out
        $this->post('/logout');
        $this->assertGuest();

        //Try to delete the game
        $response=$this->json('get','/games1v1')->assertStatus(401);
    }
    public function test_returns_empty_if_no_1v1games_are_present(): void
    {
        //First create the two players
        $player1 = User::factory()->create();

        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        //Try to get the games
        $response=$this->json('get','/games1v1')->assertStatus(200);
        $this->assertEmpty($response->getData()->data);
    }

    public function test_own_games_are_paginated_with_only_10_games_per_page(): void
    {
        $player1 = User::factory()->create();
        
        $player2 = User::factory()->create();

        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);
        for($i=0;$i<12;$i++){
            $this->post('/games1v1', [
                'player2_username'=>$player2->username,
                'player2_score'=>10,
                'player1_score'=>7,
                'player1_side'=>1,
            ]);
        }

        $response=$this->get('/games1v1')->assertStatus(200);
        $game= new stdClass();
        $game->player1_username=$player1->username;
        $game->player2_username=$player2->username;
        $game->player1_score=7;
        $game->player2_score=10;

        for($i=0;$i<10;$i++){
            $game1=$response->getData()->data[$i];
            unset($game1->id);
            $this->assertEquals($game,$game1);
        }

        $this->assertArrayNotHasKey(11,$response->getData()->data);

        $response=$this->get('/games1v1?page=2')->assertStatus(200);

        for($i=0;$i<2;$i++){
            $game1=$response->getData()->data[$i];
            unset($game1->id);
            $this->assertEquals($game,$game1);
        }
        $this->assertArrayNotHasKey(3,$response->getData()->data);
    }
}
