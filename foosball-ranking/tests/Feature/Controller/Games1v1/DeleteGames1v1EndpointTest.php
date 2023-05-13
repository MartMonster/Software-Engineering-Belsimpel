<?php

namespace Tests\Feature\Controller\Games1v1;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Game1v1;

class DeleteGames1v1EndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_delete_their_own_1v1games(): void
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

        //Delete the game
        $this->delete('/games1v1/'.$game->id)->assertStatus(200);

        //Make sure the game is deleted
        $this->assertNull(Game1v1::find($game->id));
    }

    public function test_users_can_delete_their_own_1v1games_no_matter_of_which_side_they_played_on(): void
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
            'player1_side'=>2,
        ])->assertStatus(201);
        
        //Make sure the game exists
        $game=Game1v1::where( 'player2_id' , $player1->id)
        ->where('player1_id' , $player2->id)
        ->where('player2_score' , 7)
        ->where('player1_score' , 10)->first();
        $this->assertNotNull($game);

        //Delete the game
        $this->delete('/games1v1/'.$game->id)->assertStatus(200);

        //Make sure the game is deleted
        $this->assertNull(Game1v1::find($game->id));
    }

    public function test_users_cannot_delete_1v1games_that_are_not_theirs(): void
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
            'player1_side'=>2,
        ])->assertStatus(201);

        //log out and then login as the third player
        $this->post('/logout');

        $this->post('/login', [
            'email' => $player3->email,
            'password' => 'password',
        ]);
        
        
        //Make sure the game exists
        $game=Game1v1::where( 'player2_id' , $player1->id)
        ->where('player1_id' , $player2->id)
        ->where('player2_score' , 7)
        ->where('player1_score' , 10)->first();
        $this->assertNotNull($game);

        //Delete the game
        $this->delete('/games1v1/'.$game->id)->assertStatus(401);

        //Make sure the game is not deleted
        $this->assertNotNull(Game1v1::find($game->id));
    }

    public function test_returns_appropiate_response_when_deleting_non_existing_1v1game(): void
    {
        //First create the player
        $player1 = User::factory()->create();

        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        //Try and delete the game
        $this->delete('/games1v1/1')->assertStatus(404);

    }

    public function test_returns_proper_response_code_when_not_authenticated_deleting_1v1game_(): void
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
        $this->json('delete','/games1v1/'.$game->id)->assertStatus(401);

        //Make sure the game  is  not deleted
        $this->assertNotNull(Game1v1::find($game->id));
    }

   

}
