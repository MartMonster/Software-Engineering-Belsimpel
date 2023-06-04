<?php

namespace Tests\Feature\Controller\Admin\FoosballTeams;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\FoosballTeam;


class AdminUpdateTeamsTest extends TestCase
{
    use RefreshDatabase;



    public function test_admin_can_update_teams(){
        $players = $this->create_players(3);
        $admin = self::makeUserAdmin($players[0]);
        $this->createTeamAdmin($players[1],$players[2],'team1',$admin)->assertStatus(201);
        $this->updateTeamAdmin('team2',$admin,$players[1],$players[2])->assertStatus(200);
        $this->assertDatabaseHas('foosball_teams', [
            'team_name' => 'team2',
            'player1_id' => $players[1]->id,
            'player2_id' => $players[2]->id,
        ]);
    }


     public function test_admin_cant_update_teams_to_invalid_name(){
        $players = $this->create_players(3);
        $admin = self::makeUserAdmin($players[0]);
        $this->createTeamAdmin($players[1],$players[2],'team1',$admin)->assertStatus(201);
        $this->updateTeamAdmin('',$admin,$players[1],$players[2])->assertStatus(422);
        $this->updateTeamAdmin('   ',$admin,$players[1],$players[2])->assertStatus(422);
        $this->updateTeamAdmin(null,$admin,$players[1],$players[2])->assertStatus(422);
        $this->assertDatabaseHas('foosball_teams', [
            'team_name' => 'team1',
            'player1_id' => $players[1]->id,
            'player2_id' => $players[2]->id,
        ]);
    }



     public function test_admin_cant_update_inxestent_teams(){
        $players = $this->create_players(3);
        $admin = self::makeUserAdmin($players[0]);
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $this->json('put','/admin/teams/1', [
            'team_name' => 'team2',
        ])->assertStatus(404);
    }




     public function test_admin_update_function_is_not_available_when_not_logged_in(){
        $players = $this->create_players(3);
        $admin = self::makeUserAdmin($players[0]);
        $this->createTeamAdmin($players[1],$players[2],'team1',$admin)->assertStatus(201);
        $this->json('put','/admin/teams/'.$this->findTeam($players[1],$players[2])->id, [
            'team_name' => 'team2',
        ])->assertStatus(401);
        $this->assertDatabaseHas('foosball_teams', [
            'team_name' => 'team1',
            'player1_id' => $players[1]->id,
            'player2_id' => $players[2]->id,
        ]);
    }


     public function test_admin_update_function_is_not_available_to_non_admin_users(){
        $players = $this->create_players(4);
        $admin = self::makeUserAdmin($players[0]);
        $this->createTeamAdmin($players[1],$players[2],'team1',$admin)->assertStatus(201);
        $this->updateTeamAdmin('team2',$players[3],$players[1],$players[2])->assertStatus(401);
        $this->assertDatabaseHas('foosball_teams', [
            'team_name' => 'team1',
            'player1_id' => $players[1]->id,
            'player2_id' => $players[2]->id,
        ]);
    }



     public function test_admin_cant_update_team_name_to_already_taken_name(){
        $players = $this->create_players(4);
        $admin = self::makeUserAdmin($players[0]);
        $this->createTeamAdmin($players[1],$players[2],'team1',$admin)->assertStatus(201);
        $this->createTeamAdmin($players[2],$players[3],'team2',$admin)->assertStatus(201);
        $this->updateTeamAdmin('team2',$players[0],$players[1],$players[2])->assertStatus(422);

    }












    private function updateTeamAdmin($teamName,$admin,$player1,$player2){
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $team=$this->findTeam($player1,$player2);
        $response=$this->json('put','/admin/teams/'.$team->id, [
            'team_name' => $teamName,
        ]);
        $this->post('/logout');
        return $response;


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

    private function findTeam($player1, $player2)
    {
        return FoosballTeam::where('player1_id', $player1->id)
            ->where('player2_id', $player2->id)->first();
    }




}
