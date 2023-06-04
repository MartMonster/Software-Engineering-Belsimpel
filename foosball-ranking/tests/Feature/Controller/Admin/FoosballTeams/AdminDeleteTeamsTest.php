<?php

namespace Tests\Feature\Controller\Admin\FoosballTeams;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\FoosballTeam;


class AdminDeleteTeamsTest extends TestCase
{
    use RefreshDatabase;



    public function test_admin_can_delete_teams(){
        $players = $this->create_players(3);
        $admin = self::makeUserAdmin($players[0]);
        $this->createTeamAdmin($players[1],$players[2],'team1',$admin)->assertStatus(201);
        $this->deleteTeamAdmin($admin,$players[1],$players[2])->assertStatus(200);
        $this->assertDatabaseMissing('foosball_teams', [
            'player1_id' => $players[1]->id,
            'player2_id' => $players[2]->id,
            'team_name' => 'team1'
        ]);

    }


    public function test_admin_delete_teams_not_accessible_when_not_logged_in(){
        $players = $this->create_players(3);
        $admin = self::makeUserAdmin($players[0]);
        $this->createTeamAdmin($players[1],$players[2],'team1',$admin)->assertStatus(201);
        $this->json('delete','/admin/teams/'.$this->findTeam($players[1],$players[2])->id)->assertStatus(401);

    }


    public function test_users_cant_use_admin_delete_teams_function(){
        $players = $this->create_players(4);
        $admin = self::makeUserAdmin($players[0]);
        $this->createTeamAdmin($players[1],$players[2],'team1',$admin)->assertStatus(201);
        $this->deleteTeamAdmin($players[3],$players[1],$players[2])->assertStatus(401);
        $this->assertDatabaseHas('foosball_teams', [
            'player1_id' => $players[1]->id,
            'player2_id' => $players[2]->id,
            'team_name' => 'team1'
        ]);

    }


    public function test_admin_cant_delete_non_existent_teams(){
        $players = $this->create_players(1);
        $admin = self::makeUserAdmin($players[0]);
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $this->json('delete','/admin/teams/1')->assertStatus(404);

    }


    public function test_deleting_also_deletes_2v2_games(){
        $players = $this->create_players(5);
        $admin = self::makeUserAdmin($players[0]);
        $this->createTeamAdmin($players[1],$players[2],'team1',$admin)->assertStatus(201);
        $this->createTeamAdmin($players[3],$players[4],'team2',$admin)->assertStatus(201);
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $this->post('admin/games2v2', [
            'player1_username' => $players[1]->username,
            'player2_username' => $players[2]->username,
            'player3_username' => $players[3]->username,
            'player4_username' => $players[4]->username,
            'side'=>1,
            'team1_score' => 10,
            'team2_score' => 5,
        ]);
        $this->assertDatabaseHas('games2v2', [
            'team1_id' => $this->findTeam($players[1],$players[2])->id,
            'team2_id' => $this->findTeam($players[3],$players[4])->id,
            'team1_score' => 10,
            'team2_score' => 5,
        ]);
        $team1=$this->findTeam($players[1],$players[2]);
        $team2=$this->findTeam($players[3],$players[4]);
        $this->deleteTeamAdmin($admin,$players[1],$players[2])->assertStatus(200);
        $this->assertDatabaseMissing('games2v2', [
            'team1_id' => $team1->id,
            'team2_id' => $team2->id,
            'team1_score' => 10,
            'team2_score' => 5,
        ]);
        $this->assertDatabaseMissing('foosball_teams', [
            'player1_id' => $players[1]->id,
            'player2_id' => $players[2]->id,
            'team_name' => 'team1'
        ]);
    }

















    private static function makeUserAdmin($player){
        $player->role_id=1;
        $player->save();
        return $player;

    }

    private function deleteTeamAdmin($admin,$player1,$player2){
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $team=$this->findTeam($player1,$player2);
        $response=$this->json('delete','/admin/teams/'.$team->id);
        $this->post('/logout');
        return $response;
    }
    private function findTeam($player1, $player2)
    {
        return FoosballTeam::where('player1_id', $player1->id)
            ->where('player2_id', $player2->id)->first();
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
