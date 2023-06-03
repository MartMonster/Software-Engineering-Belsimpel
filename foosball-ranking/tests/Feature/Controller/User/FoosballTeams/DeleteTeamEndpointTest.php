<?php

namespace Tests\Feature\Controller\User\FoosballTeams;

use App\Models\FoosballTeam;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Game2v2;

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


    public function test_deleting_team_also_deletes_2v2_games(){
        $player1 = User::factory()->create();

        $player2 = User::factory()->create();
        $player3 = User::factory()->create();
        $player4 = User::factory()->create();

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

        $this->post('/games2v2', [
            "player2_username" => $player2->username,
            "player3_username" => $player3->username,
            "player4_username" => $player4->username,
            "team1_score" => 10,
            "team2_score" => 5,
            "side" => 1
        ])->assertStatus(201);

        $this->delete('/teams/' . $team->id)->assertStatus(200);

        $this->assertNull(self::findTeam($player1, $player2, "TestTeam"));

        $this->assertNull(self::find2v2Game($player1, $player2, $player3, $player4, 10, 5, 1));
    }
    private function find2v2Game($player1, $player2, $player3, $player4, $team1_score, $team2_score, $side)
    {
        if ($side == 1) {
            $team1 = FoosballTeam::where('player1_id', $player1->id)
                ->where('player2_id', $player2->id)
                ->first();
            $team2 = FoosballTeam::where('player1_id', $player3->id)
                ->where('player2_id', $player4->id)
                ->first();
        } else {
            $team1 = FoosballTeam::where('player1_id', $player3->id)
                ->where('player2_id', $player4->id)
                ->first();
            $team2 = FoosballTeam::where('player1_id', $player1->id)
                ->where('player2_id', $player2->id)
                ->first();
            $tmp=$team1_score;
            $team1_score=$team2_score;
            $team2_score=$tmp;
        }

        //To avoid php complaining we force create the id property
        if(is_null($team1)){
            $team1= new \stdClass();
            $team1->id=null;
        } 
        if(is_null($team2)){
            $team2= new \stdClass();
            $team2->id=null;
        }
        $game = Game2v2::where('team1_id', $team1->id)
            ->where('team2_id', $team2->id)
            ->where('team1_score', $team1_score)
            ->where('team2_score', $team2_score)
            ->first();
        return $game;
    }

}
