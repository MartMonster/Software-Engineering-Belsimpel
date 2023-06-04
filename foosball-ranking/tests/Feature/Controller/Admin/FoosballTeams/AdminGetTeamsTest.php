<?php

namespace Tests\Feature\Controller\Admin\FoosballTeams;

use Illuminate\Foundation\Testing\RefreshDatabase;
use stdClass;
use Tests\TestCase;
use App\Models\User;
use App\Models\FoosballTeam;


class AdminGetTeamsTest extends TestCase
{
    use RefreshDatabase;



    public function test_admin_top_10_teams_are_ordered_decreseangly_by_elo()
    {
        $players = self::create_players(12);
        $admin=self::makeUserAdmin($players[11]);
        $teams = self::create_teams_different_elo(11, $players, $players[0]);
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $response = $this->json('get', '/admin/teams')->assertStatus(200);
        for ($i = 0; $i < 10; $i++) {
            $team = $response->getData()->data[$i];
            unset($team->id);
            $this->assertEquals($team, $teams[$i]);
        }
    }


    public function test_admin_top_10_teams_are_pagniated()
    {
        $players = self::create_players(15);
        $admin=self::makeUserAdmin($players[14]);
        $teams = self::create_teams_different_elo(14, $players, $players[0]);
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $response = $this->json('get', '/admin/teams')->assertStatus(200);
        for ($i = 0; $i < 10; $i++) {
            $team = $response->getData()->data[$i];
            unset($team->id);
            $this->assertEquals($team, $teams[$i]);
        }
        $response = $this->json('get', '/admin/teams?page=2')->assertStatus(200);
        for ($i = 0; $i < 3; $i++) {
            $team = $response->getData()->data[$i];
            unset($team->id);
            $this->assertEquals($team, $teams[$i + 10]);
        }
    }


    public function test_get_top_10_teams_admin_is_not_accesible_to_non_signed_in_users()
    {
        $players = self::create_players(15);
        $admin=self::makeUserAdmin($players[14]);
        $teams = self::create_teams_different_elo(14, $players, $players[0]);
        $response = $this->json('get', '/admin/teams')->assertStatus(401);

    }

    public function test_user_needs_to_be_admin_to_get_top_10_teams_admins()
    {
        $players = self::create_players(15);
        $teams = self::create_teams_different_elo(14, $players, $players[0]);
        $this->post('/login', [
            'email' => $players[14]->email,
            'password' => 'password',
        ]);
        $response = $this->json('get', '/admin/teams')->assertStatus(401);

    }




    public function test_admin_get_top_10_teams_returns_empty_when_no_teams_exist(){
        $admin=User::factory()->create();
        $admin=self::makeUserAdmin($admin);
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $response = $this->json('get', '/admin/teams')->assertStatus(200);
        $this->assertEquals($response->getData()->data,[]);

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

    private function createTeamAdmin($plyer1,$player2,$teamName,$admin){
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $response=$this->json('post','/admin/teams', [
            'player1_username' => $plyer1->username,
            'player2_username' => $player2->username,
            'team_name' => $teamName,
        ]);
        $this->post('/logout');
        return $response;
    }

    private function create_teams_different_elo($x, $players, $player1)
    {
        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);
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

        $this->post('/logout');
        return $teams;
    }

    private static function findTeam($player1, $player2, $teamName)
    {
        return FoosballTeam::where('player1_id', $player1->id)
            ->where('player2_id', $player2->id)
            ->where('team_name', $teamName)->first();
    }




}
