<?php

namespace Tests\Feature\Controller\Admin\FoosballTeams;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\FoosballTeam;


class AdminCreateTeamsTest extends TestCase
{
    use RefreshDatabase;



    public function test_admin_can_create_teams(){
        $players = $this->create_players(3);
        $admin = self::makeUserAdmin($players[0]);
        $this->createTeamAdmin($players[1],$players[2],'team1',$admin)->assertStatus(201);
        $this->assertDatabaseHas('foosball_teams', [
            'player1_id' => $players[1]->id,
            'player2_id' => $players[2]->id,
            'team_name' => 'team1',
        ]);
    }



    public function test_admin_cant_create_teams_when_the_players_are_identical(){
        $players = $this->create_players(2);
        $admin = self::makeUserAdmin($players[0]);
        $this->createTeamAdmin($players[1],$players[1],'team1',$admin)->assertStatus(400);

    }


    public function test_admin_cant_create_teams_when_the_one_of_the_players_doesnt_exist(){
        $players = $this->create_players(3);
        $admin = self::makeUserAdmin($players[0]);
        $players[1]->username="IncorrectUsername";
        $this->createTeamAdmin($players[1],$players[2],'team1',$admin)->assertStatus(422);

    }

    public function test_admin_cant_create_team_when_team_already_exists(){
        $players = $this->create_players(3);
        $admin = self::makeUserAdmin($players[0]);
        $this->createTeamAdmin($players[1],$players[2],'team1',$admin)->assertStatus(201);
        $this->assertDatabaseHas('foosball_teams', [
            'player1_id' => $players[1]->id,
            'player2_id' => $players[2]->id,
            'team_name' => 'team1',
        ]);
        $this->createTeamAdmin($players[1],$players[2],'team2',$admin)->assertStatus(400);

    }


    public function test_admin_cant_create_team_when_team_name_taken(){
        $players = $this->create_players(4);
        $admin = self::makeUserAdmin($players[0]);
        $this->createTeamAdmin($players[1],$players[2],'team1',$admin)->assertStatus(201);
        $this->createTeamAdmin($players[3],$players[2],'team1',$admin)->assertStatus(422);

    }


    public function test_admin_cant_create_teams_with_invalid_names(){
        $players = $this->create_players(4);
        $admin = self::makeUserAdmin($players[0]);
        $this->createTeamAdmin($players[1],$players[2],'',$admin)->assertStatus(422);
        $this->createTeamAdmin($players[1],$players[2],null,$admin)->assertStatus(422);
        $this->createTeamAdmin($players[1],$players[2],'  ',$admin)->assertStatus(422);

    }


    public function test_admin_cant_create_teams_when_one_of_the_players_is_not_mentioned(){
        $players = $this->create_players(3);
        $admin = self::makeUserAdmin($players[0]);
        $players[1]->username=null;
        $this->createTeamAdmin($players[1],$players[2],'team1',$admin)->assertStatus(422);

    }


    public function test_admin_create_teams_function_must_be_logged_in(){
        $players = $this->create_players(3);
        $admin = self::makeUserAdmin($players[0]);
        $this->json('post','/admin/teams', [
            'player1_username' => $players[1]->username,
            'player2_username' => $players[2]->username,
            'team_name' => 'team1',
        ])->assertStatus(401);
        $this->assertDatabaseMissing('foosball_teams', [
            'player1_id' => $players[1]->id,
            'player2_id' => $players[2]->id,
            'team_name' => 'team1',
        ]);

    }

    public function test_user_cant_access_admin_create_teams(){
        $players = $this->create_players(3);
        $this->post('/login', [
            'email' => $players[0]->email,
            'password' => 'password',
        ]);
        $this->post('/admin/teams', [
            'player1_username' => $players[1]->username,
            'player2_username' => $players[2]->username,
            'team_name' => 'team1',
        ])->assertStatus(401);
        $this->assertDatabaseMissing('foosball_teams', [
            'player1_id' => $players[1]->id,
            'player2_id' => $players[2]->id,
            'team_name' => 'team1',
        ]);

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




}
