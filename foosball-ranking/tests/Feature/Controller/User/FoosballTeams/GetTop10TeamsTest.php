<?php

namespace Tests\Feature\Controller\User\FoosballTeams;

use App\Models\FoosballTeam;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use stdClass;
use Tests\TestCase;

class GetTop10TeamsTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_see_the_top_10_teams(): void
    {
        $players = self::create_players(11);
        $this->post('/login', [
            'email' => $players[0]->email,
            'password' => 'password',
        ]);
        $teams = self::create_teams(11, $players, $players[0]);
        $response = $this->get('/teams')->assertStatus(200);
        for ($i = 0; $i < 10; $i++) {
            $team = $response->getData()[$i];
            unset($team->id);
            $this->assertEquals($team, $teams[$i]);
        }
    }

    private static function create_players($x)
    {
        $players = array();
        for ($i = 0; $i < $x; $i++) {
            $players[] = User::factory()->create();
        }
        return $players;
    }

    private function create_teams($x, $players, $player1)
    {
        $teams = array();
        for ($i = 0; $i < $x; $i++) {
            if ($players[$i]->id != $player1->id) {
                $this->post('/teams', [
                    "player2_username" => $players[$i]->username,
                    "team_name" => "TestTeam" . $i]);
                $team = new stdClass();
                $team->player1_username = $player1->username;
                $team->player2_username = $players[$i]->username;
                $team->team_name = "TestTeam" . $i;
                $team->elo = 1000;
                $teams[] = $team;
            }
        }
        return $teams;
    }

    public function test_users_can_see_the_top_10_teams_when_there_are_less_than_10(): void
    {
        $players = self::create_players(6);
        $this->post('/login', [
            'email' => $players[0]->email,
            'password' => 'password',
        ]);
        $teams = self::create_teams(6, $players, $players[0]);
        $response = $this->get('/teams')->assertStatus(200);
        for ($i = 0; $i < 5; $i++) {
            $team = $response->getData()[$i];
            unset($team->id);
            $this->assertEquals($team, $teams[$i]);
        }
    }

    public function test_returns_empty_array_when_there_are_no_teams(): void
    {
        $players = self::create_players(1);
        $this->post('/login', [
            'email' => $players[0]->email,
            'password' => 'password',
        ]);
        $response = $this->get('/teams')->assertStatus(200);
        $this->assertEquals($response->getData(), []);
    }

    public function test_returns_appropiate_response_when_not_logged_in(): void
    {
        $players = self::create_players(11);
        $this->post('/login', [
            'email' => $players[0]->email,
            'password' => 'password',
        ]);
        $teams = self::create_teams(11, $players, $players[0]);
        $this->post('/logout');
        $response = $this->json('get', '/teams');
        $response->assertStatus(401);
    }

    public function test_returns_top_10_teams_even_if_the_user_is_not_part_of_them()
    {
        $players = self::create_players(11);
        $this->post('/login', [
            'email' => $players[0]->email,
            'password' => 'password',
        ]);
        $teams = self::create_teams(11, $players, $players[0]);
        $this->post('/logout');
        $this->post('/login', [
            'email' => $players[1]->email,
            'password' => 'password',
        ]);
        $response = $this->json('get', '/teams')->assertStatus(200);
        for ($i = 0; $i < 10; $i++) {
            $team = $response->getData()[$i];
            unset($team->id);
            $this->assertEquals($team, $teams[$i]);
        }
    }

    public function test_teams_are_ordered_decreseangly_by_elo()
    {
        $players = self::create_players(11);
        $this->post('/login', [
            'email' => $players[0]->email,
            'password' => 'password',
        ]);
        $teams = self::create_teams_different_elo(11, $players, $players[0]);
        $response = $this->json('get', '/teams')->assertStatus(200);
        for ($i = 0; $i < 10; $i++) {
            $team = $response->getData()[$i];
            unset($team->id);
            $this->assertEquals($team, $teams[$i]);
        }
    }

    private function create_teams_different_elo($x, $players, $player1)
    {
        $teams = array();
        for ($i = 0; $i < $x; $i++) {
            if ($players[$i]->id != $player1->id) {
                $elo = rand(1000, 2000);
                $this->post('/teams', [
                    "player2_username" => $players[$i]->username,
                    "team_name" => "TestTeam" . $i]);

                $teamInDB = self::findTeam($player1, $players[$i], "TestTeam" . $i);
                $teamInDB->elo = $elo;
                $teamInDB->save();

                $team = new stdClass();
                $team->player1_username = $player1->username;
                $team->player2_username = $players[$i]->username;
                $team->team_name = "TestTeam" . $i;
                $team->elo = $elo;
                $teams[] = $team;
            }
            usort($teams, fn($a, $b) => $b->elo <=> $a->elo);
        }

        return $teams;
    }

    private static function findTeam($player1, $player2, $teamName)
    {
        return FoosballTeam::where('player1_id', $player1->id)
            ->where('player2_id', $player2->id)
            ->where('team_name', $teamName)->first();
    }
}
