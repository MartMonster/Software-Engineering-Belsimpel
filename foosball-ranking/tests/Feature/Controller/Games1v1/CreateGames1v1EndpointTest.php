<?php

namespace Tests\Feature\Controller\Games1v1;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Game1v1;

class CreateGames1v1EndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_create_1v1games(): void
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
        
        $this->assertNotNull(Game1v1::where( 'player2_id' , $player2->id)
        ->where('player1_id' , $player1->id)
        ->where('player2_score' , 10)
        ->where('player1_score' , 7)->first());
    }

    public function test_player_gets_swaped_based_on_side(): void
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
            'player1_side'=>2,
        ])->assertStatus(201);
        
        $this->assertNotNull(Game1v1::where( 'player2_id' , $player1->id)
        ->where('player1_id' , $player2->id)
        ->where('player2_score' , 7)
        ->where('player1_score' , 10)->first());
    }

    public function test_returns_appropiate_response_if_second_player_doesnt_exist(): void
    {
        $player1 = User::factory()->create();


        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        
        $response= $this->post('/games1v1', [
            'player2_username'=>"Wrong username",
            'player2_score'=>10,
            'player1_score'=>7,
            'player1_side'=>2,
        ])->assertStatus(404);
        
    }
    public function test_checks_if_the_players_are_different(): void
    {
        $player1 = User::factory()->create();


        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        
        $response= $this->post('/games1v1', [
            'player2_username'=>$player1->username,
            'player2_score'=>10,
            'player1_score'=>7,
            'player1_side'=>2,
        ])->assertStatus(400);
        
    }

    public function test_cannot_create_game_if_not_authenticated(): void
    {
        $player1 = User::factory()->create();

        $player2=  User::factory()->create();


        $this->assertGuest();
        
        $response= $this->json('POST','/games1v1', [
            'player2_username'=>$player2->username,
            'player2_score'=>10,
            'player1_score'=>7,
            'player1_side'=>2,
        ])->assertStatus(401);
        
        $this->assertNull(Game1v1::where( 'player2_id' , $player1->id)
        ->where('player1_id' , $player2->id)
        ->where('player2_score' , 7)
        ->where('player1_score' , 10)->first());
    }

}
