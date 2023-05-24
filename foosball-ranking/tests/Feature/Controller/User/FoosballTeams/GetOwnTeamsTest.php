<?php

namespace Tests\Feature\Controller\User\FoosballTeams;

use App\Models\FoosballTeam;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use stdClass;
use Tests\TestCase;

class GetOwnTeamsTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_see_their_own_teams(): void
    {
        $players = self::create_players(11);
        $this->post('/login', [
            'email' => $players[0]->email,
            'password' => 'password',
        ]);
        $teams1 = self::create_teams(11, $players, $players[0], "a");

        $this->post('logout');

        $this->post('/login', [
            'email' => $players[1]->email,
            'password' => 'password',
        ]);
        $teams = self::create_teams(11, $players, $players[1], "b");
        $response = $this->get('/teams/self')->assertStatus(200);

        self::inversePlayersInTeams($teams[0]);
        $teams[0]->team_name[0] = 'a';
        //we manually inverse the players and overwrite the prefix of the first team because it gets created in the
        //frst batch of creating teams thus not fit the for loop bellow
        for ($i = 1; $i < 10; $i++) {
            $team = $response->getData()->data[$i];
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

    private function create_teams($x, $players, $player1, $prefix)
    {
        $teams = array();
        for ($i = 0; $i < $x; $i++) {
            if ($players[$i]->id != $player1->id) {
                $this->post('/teams', [
                    "player2_username" => $players[$i]->username,
                    "team_name" => $prefix . "TestTeam" . $i]);
                $team = new stdClass();
                $team->player1_username = $player1->username;
                $team->player2_username = $players[$i]->username;
                $team->team_name = $prefix . "TestTeam" . $i;
                $team->elo = 1000;
                $teams[] = $team;
            }
        }
        return $teams;
    }

    private function inversePlayersInTeams($team)
    {
        $player = $team->player1_username;
        $team->player1_username = $team->player2_username;
        $team->player2_username = $player;
    }

    public function test_users_can_see_their_own_teams_when_there_are_less_than_10(): void
    {
        $players = self::create_players(11);
        $this->post('/login', [
            'email' => $players[0]->email,
            'password' => 'password',
        ]);
        $teams1 = self::create_teams(6, $players, $players[0], "a");

        $this->post('logout');

        $this->post('/login', [
            'email' => $players[1]->email,
            'password' => 'password',
        ]);
        $teams = self::create_teams(6, $players, $players[1], "b");
        $response = $this->get('/teams/self')->assertStatus(200);

        self::inversePlayersInTeams($teams[0]);
        $teams[0]->team_name[0] = 'a';
        for ($i = 1; $i < 5; $i++) {
            $team = $response->getData()->data[$i];
            unset($team->id);
            $this->assertEquals($team, $teams[$i]);
        }
        $this->assertArrayNotHasKey(5, $response->getData()->data);
    }

    public function test_return_empty_array_when_user_has_no_teams(): void
    {
        $players = self::create_players(3);
        $this->post('/login', [
            'email' => $players[0]->email,
            'password' => 'password',
        ]);
        $this->post('/teams', [
            "player2_username" => $players[1]->username,
            "team_name" => "TestTeam"]);

        $this->post('logout');
        $this->post('/login', [
            'email' => $players[2]->email,
            'password' => 'password',
        ]);
        $response = $this->get('/teams/self')->assertStatus(200);
        $this->assertEquals($response->getData()->data, []);
    }

    public function test_returns_appropiate_response_when_not_logged_in(): void
    {
        $players = self::create_players(2);
        $this->post('/login', [
            'email' => $players[0]->email,
            'password' => 'password',
        ]);
        $teams = self::create_teams(2, $players, $players[0], "a");

        $this->assertNotNull(self::findTeam($players[0], $players[1], "aTestTeam1"));

        $this->post('logout');
        $response = $this->json('get', '/teams/self')->assertStatus(401);
    }

    private static function findTeam($player1, $player2, $teamName)
    {
        return FoosballTeam::where('player1_id', $player1->id)
            ->where('player2_id', $player2->id)
            ->where('team_name', $teamName)->first();
    }

    public function test_own_teams_are_paginated_with_only_10_teams_per_page()
    {
        $players = self::create_players(15);
        $this->post('/login', [
            'email' => $players[0]->email,
            'password' => 'password',
        ]);
        self::create_teams(15, $players, $players[0], "a");
        $this->post('logout');
        $this->post('/login', [
            'email' => $players[1]->email,
            'password' => 'password',
        ]);
        $teams = self::create_teams(15, $players, $players[1], "b");
        $response = $this->get('/teams/self')->assertStatus(200);

        self::inversePlayersInTeams($teams[0]);
        $teams[0]->team_name[0] = 'a';
        for ($i = 1; $i < 10; $i++) {
            $team = $response->getData()->data[$i];
            unset($team->id);
            $this->assertEquals($team, $teams[$i]);
        }

        $this->assertArrayNotHasKey(10, $response->getData()->data);
        $response = $this->get('/teams/self?page=2')->assertStatus(200);
        for ($i = 10; $i < 14; $i++) {
            $team = $response->getData()->data[$i - 10];
            unset($team->id);
            $this->assertEquals($team, $teams[$i]);
        }
        $this->assertArrayNotHasKey(4, $response->getData()->data);
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
}
