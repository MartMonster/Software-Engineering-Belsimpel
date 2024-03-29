<?php

namespace Tests\Feature\Controller\User\FoosballTeams;

use App\Models\FoosballTeam;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateTeamEndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_create_teams(): void
    {
        $player1 = User::factory()->create();

        $player2 = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $this->post('/teams', [
            "player2_username" => $player2->username,
            "team_name" => "TestTeam"
        ])->assertStatus(201);

        $this->assertNotNull(self::findTeam($player1, $player2, "TestTeam"));
    }

    private static function findTeam($player1, $player2, $teamName)
    {
        return FoosballTeam::where('player1_id', $player1->id)
            ->where('player2_id', $player2->id)
            ->where('team_name', $teamName)->first();
    }

    public function test_users_canot_create_teams_when_team_already_exists(): void
    {
        $player1 = User::factory()->create();

        $player2 = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $this->post('/teams', [
            "player2_username" => $player2->username,
            "team_name" => "TestTeam"
        ])->assertStatus(201);

        $this->assertNotNull(self::findTeam($player1, $player2, "TestTeam"));

        $this->post('/teams', [
            "player2_username" => $player2->username,
            "team_name" => "TestTeam2"
        ])->assertStatus(400);
    }

    public function test_returns_appropiate_response_when_second_player_does_not_exist(): void
    {
        $player1 = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $this->json('post', '/teams', [
            "player2_username" => "SecondUsername",
            "team_name" => "TestTeam"
        ])->assertStatus(422);
    }

    public function test_returns_appropiate_response_when_creating_team_with_taken_name(): void
    {
        $player1 = User::factory()->create();

        $player2 = User::factory()->create();

        $player3 = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $this->post('/teams', [
            "player2_username" => $player2->username,
            "team_name" => "TestTeam"
        ])->assertStatus(201);

        $this->assertNotNull(self::findTeam($player1, $player2, "TestTeam"));


        $this->json('post', '/teams', [
            "player2_username" => $player3->username,
            "team_name" => "TestTeam"
        ])->assertStatus(422);
    }

    public function test_returns_appropiate_response_when_creating_team_with_missing_name(): void
    {
        $player1 = User::factory()->create();

        $player2 = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $this->json('post', '/teams', [
            "player2_username" => $player2->username
        ])->assertStatus(422);

    }

    public function test_returns_appropiate_response_when_creating_team_with_empty_name(): void
    {
        $player1 = User::factory()->create();

        $player2 = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $this->json('post', '/teams', [
            "player2_username" => $player2->username,
            "team_name" => ""
        ])->assertStatus(422);
    }

    public function test_returns_appropiate_response_when_creating_team_with_missing_second_player(): void
    {
        $player1 = User::factory()->create();


        $response = $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $this->json('post', '/teams', [
            "team_name" => "TestTeam"
        ])->assertStatus(422);
    }

    public function test_returns_appropiate_response_when_players_are_the_same(): void
    {
        $player1 = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $this->post('/teams', [
            "player2_username" => $player1->username,
            "team_name" => "TestTeam"
        ])->assertStatus(400);
    }

    public function test_return_appropiate_response_when_not_authenticated_creating_team(): void
    {
        $player1 = User::factory()->create();

        $player2 = User::factory()->create();


        $this->json('POST', '/teams', [
            "player2_username" => $player2->username,
            "team_name" => "TestTeam"
        ])->assertStatus(401);

        $this->assertNull(self::findTeam($player1, $player2, "TestTeam"));
    }


}
