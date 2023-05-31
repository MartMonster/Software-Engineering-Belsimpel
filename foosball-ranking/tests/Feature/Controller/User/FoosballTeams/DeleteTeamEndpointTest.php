<?php

namespace Tests\Feature\Controller\User\FoosballTeams;

use App\Models\FoosballTeam;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeleteTeamEndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_delete_teams(): void
    {
        $player1 = User::factory()->create();

        $player2 = User::factory()->create();

        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $this->post('/teams', [
            "player2_username" => $player2->username,
            "team_name" => "TestTeam"
        ])->assertStatus(201);

        $team = self::findTeam($player1, $player2, "TestTeam");
        $this->assertNotNull($team);

        $this->delete('/teams/' . $team->id)->assertStatus(200);

        $this->assertNull(self::findTeam($player1, $player2, "TestTeam"));
    }

    private static function findTeam($player1, $player2, $teamName)
    {
        return FoosballTeam::where('player1_id', $player1->id)
            ->where('player2_id', $player2->id)
            ->where('team_name', $teamName)->first();
    }

    public function test_users_canot_delete_teams_that_do_not_exist(): void
    {
        $player1 = User::factory()->create();


        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $this->delete('/teams/1')->assertStatus(404);
    }

    public function test_users_cannot_delete_teams_that_they_are_not_part_of()
    {
        $player1 = User::factory()->create();
        $player2 = User::factory()->create();
        $player3 = User::factory()->create();

        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $this->post('/teams', [
            "player2_username" => $player2->username,
            "team_name" => "TestTeam"
        ])->assertStatus(201);

        $team = self::findTeam($player1, $player2, "TestTeam");
        $this->assertNotNull($team);
        $this->post('/logout');
        $this->post('/login', [
            'email' => $player3->email,
            'password' => 'password',
        ]);
        $this->delete('/teams/' . $team->id)->assertStatus(401);
        $this->assertNotNull(self::findTeam($player1, $player2, "TestTeam"));
    }

    public function test_users_cannot_delete_teams_if_they_are_not_signed_in(): void
    {
        $player1 = User::factory()->create();

        $player2 = User::factory()->create();

        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $this->post('/teams', [
            "player2_username" => $player2->username,
            "team_name" => "TestTeam"
        ])->assertStatus(201);

        $team = self::findTeam($player1, $player2, "TestTeam");
        $this->assertNotNull($team);

        $this->post('/logout');

        $this->json('delete', '/teams/' . $team->id)->assertStatus(401);

        $this->assertNotNull(self::findTeam($player1, $player2, "TestTeam"));
    }

    public function test_users_can_delete_teams_no_matter_the_position(): void
    {
        $player1 = User::factory()->create();

        $player2 = User::factory()->create();

        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $this->post('/teams', [
            "player2_username" => $player2->username,
            "team_name" => "TestTeam"
        ])->assertStatus(201);

        $this->post('/logout');

        $this->post('/login', ['email' => $player2->email,
            'password' => 'password',
        ]);

        $team = self::findTeam($player1, $player2, "TestTeam");
        $this->assertNotNull($team);

        $this->delete('/teams/' . $team->id)->assertStatus(200);

        $this->assertNull(self::findTeam($player1, $player2, "TestTeam"));
    }
}
