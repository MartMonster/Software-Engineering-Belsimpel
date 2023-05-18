<?php

namespace Tests\Feature\Controller\User\FoosballTeams;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\FoosballTeam;

class UpdateTeamEndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_update_teams(): void
    {
        $player1 = User::factory()->create();

        $player2 = User::factory()->create();

        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $this->post('/teams', [
            "player2_username"=>$player2->username,
            "team_name"=>"TestTeam"
        ])->assertStatus(201);

        $team = self::findTeam($player1,$player2,"TestTeam");
        $this->assertNotNull($team);

        $this->put('/teams/'.$team->id,["team_name"=>"UpdatedTeam"])->assertStatus(200);

        $this->assertNotNull(self::findTeam($player1,$player2,"UpdatedTeam"));
    }

    public function test_users_cannot_update_teams_that_do_not_exist(): void
    {
        $player1 = User::factory()->create();

        $player2 = User::factory()->create();

        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);


        $this->put('/teams/3',["team_name"=>"UpdatedTeam"])->assertStatus(404);
    }

    public function test_users_cannot_update_teams_that_are_not_theirs(): void
    {
        $player1 = User::factory()->create();

        $player2 = User::factory()->create();

        $player3 = User::factory()->create();

        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $this->post('/teams', [
            "player2_username"=>$player2->username,
            "team_name"=>"TestTeam"
        ])->assertStatus(201);
        
        $team = self::findTeam($player1,$player2,"TestTeam");
        $this->assertNotNull($team);
        
        $this->post('/logout');

        $this->post('/login', [
            'email' => $player3->email,
            'password' => 'password',
        ]);
        

        $this->put('/teams/'.$team->id,["team_name"=>"UpdatedTeam"])->assertStatus(401);

        $this->assertNotNull(self::findTeam($player1,$player2,"TestTeam"));
        $this->assertNull(self::findTeam($player1,$player2,"UpdatedTeam"));

    }

    public function test_users_cannot_update_teams_to_an_empty_name(): void
    {
        $player1 = User::factory()->create();

        $player2 = User::factory()->create();

        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $this->post('/teams', [
            "player2_username"=>$player2->username,
            "team_name"=>"TestTeam"
        ])->assertStatus(201);
        
        $team = self::findTeam($player1,$player2,"TestTeam");
        $this->assertNotNull($team);
        

        $this->put('/teams/'.$team->id,["team_name"=>""])->assertStatus(400);

        $this->assertNotNull(self::findTeam($player1,$player2,"TestTeam"));

    }

    public function test_users_cannot_update_teams_to_a_null_name(): void
    {
        $player1 = User::factory()->create();

        $player2 = User::factory()->create();

        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $this->post('/teams', [
            "player2_username"=>$player2->username,
            "team_name"=>"TestTeam"
        ])->assertStatus(201);
        
        $team = self::findTeam($player1,$player2,"TestTeam");
        $this->assertNotNull($team);
        

        $this->put('/teams/'.$team->id,[])->assertStatus(400);

        $this->assertNotNull(self::findTeam($player1,$player2,"TestTeam"));

    }
    public function test_users_cannot_update_teams_when_not_authenticated(): void
    {
        $player1 = User::factory()->create();

        $player2 = User::factory()->create();

        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $this->post('/teams', [
            "player2_username"=>$player2->username,
            "team_name"=>"TestTeam"
        ])->assertStatus(201);

        $team = self::findTeam($player1,$player2,"TestTeam");
        $this->assertNotNull($team);

        $this->post('/logout');
        $this->json('put','/teams/'.$team->id,["team_name"=>"UpdatedTeam"])->assertStatus(401);

        $this->assertNotNull(self::findTeam($player1,$player2,"TestTeam"));
    }

    













    private static function findTeam($player1,$player2,$teamName){
        return FoosballTeam::where('player1_id',$player1->id)
        ->where('player2_id',$player2->id)
        ->where('team_name',$teamName)->first();
    }
}
