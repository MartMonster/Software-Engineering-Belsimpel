<?php

namespace Tests\Feature\Controller\Admin\Games2v2;

use App\Models\FoosballTeam;
use App\Models\Game2v2;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use stdClass;
use Tests\TestCase;

class AdminDeletes2v2GamesTest extends TestCase
{
    use RefreshDatabase;


    public function test_admin_can_delete_2v2_game()
    {
        $players = $this->create_players(5);
        $admin = self::makeUserAdmin($players[0]);
        $results = $this->adminCreate2v2Game($admin, $players[1], $players[2], $players[3], $players[4], 10, 8, 1);
        $this->deleteGames2v2Admin($results[1]->id, $admin)->assertStatus(200);
        $this->assertNull(Game2v2::find($results[1]->id));
    }

    private static function create_players($x)
    {
        $players = array();
        for ($i = 0; $i < $x; $i++) {
            $players[] = User::factory()->create();
        }
        return $players;
    }

    private static function makeUserAdmin($player)
    {
        $player->role_id = 1;
        $player->save();
        return $player;

    }

    private function adminCreate2v2Game($admin, $player1, $player2, $player3, $player4, $score1, $score2, $side)
    {
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $response = $this->json('post', '/admin/games2v2', [
            'player1_username' => $player1->username,
            'player2_username' => $player2->username,
            'player3_username' => $player3->username,
            'player4_username' => $player4->username,
            'team1_score' => $score1,
            'team2_score' => $score2,
            'side' => $side,
        ]);
        $this->post('/logout');
        return array($response, self::find2v2Game($player1, $player2, $player3, $player4, $score1, $score2, $side));
    }

    private function find2v2Game($player1, $player2, $player3, $player4, $team1_score, $team2_score, $side)
    {
        if ($side == 1) {
            $team1 = self::findTeam($player1, $player2);
            $team2 = self::findTeam($player3, $player4);
        } else {
            $team1 = self::findTeam($player3, $player4);
            $team2 = self::findTeam($player1, $player2);
            $tmp = $team1_score;
            $team1_score = $team2_score;
            $team2_score = $tmp;
        }

        //To avoid php complaining we force create the id property
        if (is_null($team1)) {
            $team1 = new stdClass();
            $team1->id = null;
        }
        if (is_null($team2)) {
            $team2 = new stdClass();
            $team2->id = null;
        }
        $game = Game2v2::where('team1_id', $team1->id)
            ->where('team2_id', $team2->id)
            ->where('team1_score', $team1_score)
            ->where('team2_score', $team2_score)
            ->first();
        return $game;
    }

    private function findTeam($player1, $player2)
    {
        $team = FoosballTeam::where('player1_id', $player1->id)
            ->where('player2_id', $player2->id)->first();
        if (is_null($team)) {
            $team = FoosballTeam::where('player1_id', $player2->id)
                ->where('player2_id', $player1->id)->first();
        }
        return $team;

    }

    private function deleteGames2v2Admin($id, $admin)
    {
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $response = $this->json('delete', '/admin/games2v2/' . $id);
        $this->post('/logout');
        return $response;

    }

    public function test_admin_cant_delete_2v2_when_game_doesnt_exist()
    {
        $players = $this->create_players(5);
        $admin = self::makeUserAdmin($players[0]);
        $this->deleteGames2v2Admin("1", $admin)->assertStatus(404);
    }

    public function test_admin_delete_2v2_game_function_is_not_available_when_not_logged_in()
    {
        $players = $this->create_players(5);
        $admin = self::makeUserAdmin($players[0]);
        $results = $this->adminCreate2v2Game($admin, $players[1], $players[2], $players[3], $players[4], 10, 8, 1);
        $this->json('delete', '/admin/games2v2/' . $results[1]->id)->assertStatus(401);
    }

    public function test_admin_delete_2v2_game_function_is_not_available_to_non_admin_users()
    {
        $players = $this->create_players(6);
        $admin = self::makeUserAdmin($players[0]);
        $results = $this->adminCreate2v2Game($players[0], $players[1], $players[2], $players[3], $players[4], 10, 8, 1);
        $this->deleteGames2v2Admin($results[1]->id, $players[5])->assertStatus(401);
    }

    private function createTeamAdmin($plyer1, $player2, $teamName, $admin)
    {
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $response = $this->json('post', '/admin/teams', [
            'player1_username' => $plyer1->username,
            'player2_username' => $player2->username,
            'team_name' => $teamName,
        ]);
        $this->post('/logout');
        return $response;
    }


}
