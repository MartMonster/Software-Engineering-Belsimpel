<?php

namespace Tests\Feature\Controller\User\FoosballTeams;

use App\Models\FoosballTeam;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GetUsernamesFromTeamTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_usernames_from_team(): void
    {
        $users = self::create_players(2);
        $team = self::createTeam($users[0], $users[1], "TestTeam");
        $this->post('/login', [
            'email' => $users[0]->email,
            'password' => 'password',
        ]);
        $u = $this->get('/teams/users/' . $team->team_name)->assertStatus(200);
        $this->assertEquals($users[0]->username, $u[0]);
        $this->assertEquals($users[1]->username, $u[1]);
    }

    public function test_cannot_get_from_unexisting_team(): void
    {
        $users = self::create_players(2);
        $this->post('/login', [
            'email' => $users[0]->email,
            'password' => 'password',
        ]);
        $this->get('/teams/users/UnexistingTeam')->assertStatus(404);
    }

    private static function create_players($x): array
    {
        $players = array();
        for ($i = 0; $i < $x; $i++) {
            $players[] = User::factory()->create();
        }
        return $players;
    }

    private function createTeam($player1, $player2, $teamName)
    {
        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);
        $this->post('/teams', [
            "player2_username" => $player2->username,
            "team_name" => $teamName
        ])->assertStatus(201);
        $this->post('/logout');
        return self::findTeam($player1, $player2, $teamName);
    }

    private static function findTeam($player1, $player2, $teamName)
    {
        return FoosballTeam::where('player1_id', $player1->id)
            ->where('player2_id', $player2->id)
            ->where('team_name', $teamName)->first();
    }
}
