<?php

namespace Tests\Feature\Controller\User\Games1v1;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Game1v1;

class UpdateGames1v1EndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_update_1v1games(): void
    {
        $player1 = User::factory()->create();

        $player2=  User::factory()->create();
        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $response= $this->post('/games1v1', [
            'player2_username'=>$player2->username,
            'player2_score'=>10,
            'player1_score'=>7,
            'player1_side'=>1,
        ])->assertStatus(201);
        
        $game=Game1v1::where( 'player2_id' , $player2->id)
        ->where('player1_id' , $player1->id)
        ->where('player2_score' , 10)
        ->where('player1_score' , 7)->first();
        $this->assertNotNull($game);
        $this->put('/games1v1/'.$game->id,[
            "player1_score"=> 2,
            "player2_score"=> 3,
            "player1_side"=> 1
        ])->assertStatus(200);

        $this->assertNotNull( Game1v1::where( 'player2_id' , $player2->id)
        ->where('player1_id' , $player1->id)
        ->where('player2_score' , 3)
        ->where('player1_score' , 2)->first());

    }

    public function test_update_player_gets_swaped_based_on_side(): void
    {
        $player1 = User::factory()->create();

        $player2=  User::factory()->create();
        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $response= $this->post('/games1v1', [
            'player2_username'=>$player2->username,
            'player2_score'=>10,
            'player1_score'=>7,
            'player1_side'=>1,
        ])->assertStatus(201);
        
        $game=Game1v1::where( 'player2_id' , $player2->id)
        ->where('player1_id' , $player1->id)
        ->where('player2_score' , 10)
        ->where('player1_score' , 7)->first();
        $this->assertNotNull($game);
        $this->put('/games1v1/'.$game->id,[
            "player1_score"=> 2,
            "player2_score"=> 3,
            "player1_side"=> 2
        ])->assertStatus(200);

        $this->assertNotNull( Game1v1::where( 'player2_id' , $player1->id)
        ->where('player1_id' , $player2->id)
        ->where('player2_score' , 2)
        ->where('player1_score' , 3)->first());
    }

    public function test_users_cannot_update_1v1games_that_are_not_theirs(): void
    {
        //First create the two players
        $player1 = User::factory()->create();

        $player2=  User::factory()->create();

        $player3=  User::factory()->create();

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

        //log out and then login as the third player
        $this->post('/logout');

        $this->post('/login', [
            'email' => $player3->email,
            'password' => 'password',
        ]);
        
        
        //Make sure the game exists
        $game=Game1v1::where( 'player2_id' , $player2->id)
        ->where('player1_id' , $player1->id)
        ->where('player2_score' , 10)
        ->where('player1_score' , 7)->first();
        $this->assertNotNull($game);

        //Try and update the game
        $this->put('/games1v1/'.$game->id,[
            "player1_score"=> 2,
            "player2_score"=> 3,
            "player1_side"=> 2
        ])->assertStatus(401);

        //Make sure the game stayed the same
        $this->assertNotNull( Game1v1::where( 'player2_id' , $player2->id)
        ->where('player1_id' , $player1->id)
        ->where('player2_score' , 10)
        ->where('player1_score' , 7)->first());
    }

    public function test_returns_proper_response_code_when_not_authenticated_updating_1v1game_(): void
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

        $this->json('PUT','/games1v1/'.$game->id,[
            "player1_score"=> 2,
            "player2_score"=> 3,
            "player1_side"=> 2
        ])->assertStatus(401);

        //Make sure the game stayed the same
        $this->assertNotNull( Game1v1::where( 'player2_id' , $player2->id)
        ->where('player1_id' , $player1->id)
        ->where('player2_score' , 10)
        ->where('player1_score' , 7)->first());
    }

}
