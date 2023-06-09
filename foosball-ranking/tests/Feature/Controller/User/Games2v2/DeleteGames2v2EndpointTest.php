<?php

namespace Tests\Feature\Controller\User\Games2v2;

use App\Models\FoosballTeam;
use App\Models\Game2v2;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use ReflectionClass;
use stdClass;
use Tests\TestCase;

class DeleteGames2v2EndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_delete_2v2_games_when_they_are_part_of_team(): void
    {
        $players = self::create_players(4);
        $team1 = self::createTeam($players[0], $players[1], "TestTeam1");
        $team2 = self::createTeam($players[2], $players[3], "TestTeam2");
        $result = self::create2v2Game($players[0], $players[1], $players[2], $players[3], 10, 5, 1);
        $gameInDb = $result[1];
        $this->assertNotNull($gameInDb);
        $this->post('/login', [
            'email' => $players[0]->email,
            'password' => 'password',
        ]);
        $this->json('delete', '/games2v2/' . $gameInDb->id)->assertStatus(200);
        $this->assertNull(Game2v2::find($gameInDb->id));
    }

    private static function create_players($x)
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

    private function create2v2Game($player1, $player2, $player3, $player4, $team1_score, $team2_score, $side)
    {
        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $response = $this->json('post', '/games2v2', [
            "player2_username" => $player2->username,
            "player3_username" => $player3->username,
            "player4_username" => $player4->username,
            "team1_score" => $team1_score,
            "team2_score" => $team2_score,
            "side" => $side
        ]);
        $this->post('/logout');
        return array($response, self::find2v2Game($player1, $player2, $player3, $player4, $team1_score, $team2_score, $side));
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

    public function test_user_can_delete_2v2_even_if_the_other_team_created_the_game(): void
    {
        $players = self::create_players(4);
        $team1 = self::createTeam($players[0], $players[1], "TestTeam1");
        $team2 = self::createTeam($players[2], $players[3], "TestTeam2");
        $result = self::create2v2Game($players[0], $players[1], $players[2], $players[3], 10, 5, 1);
        $gameInDb = $result[1];
        $this->assertNotNull($gameInDb);
        $this->post('/login', [
            'email' => $players[3]->email,
            'password' => 'password',
        ]);
        $this->json('delete', '/games2v2/' . $gameInDb->id)->assertStatus(200);
        $this->assertNull(Game2v2::find($gameInDb->id));
    }

    public function test_user_cannot_delete_2v2_game_they_are_not_part_of(): void
    {
        $players = self::create_players(5);
        $team1 = self::createTeam($players[0], $players[1], "TestTeam1");
        $team2 = self::createTeam($players[2], $players[3], "TestTeam2");
        $result = self::create2v2Game($players[0], $players[1], $players[2], $players[3], 10, 5, 1);
        $gameInDb = $result[1];
        $this->assertNotNull($gameInDb);
        $this->post('/login', [
            'email' => $players[4]->email,
            'password' => 'password',
        ]);
        $this->json('delete', '/games2v2/' . $gameInDb->id)->assertStatus(401);
        $this->assertNotNull(Game2v2::find($gameInDb->id));
    }

    public function test_returns_appropaite_response_when_deleting_non_existing_game(): void
    {
        $players = self::create_players(1);
        $this->post('/login', [
            'email' => $players[0]->email,
            'password' => 'password',
        ]);
        $this->assertNull(Game2v2::find(0));
        $this->json('delete', '/games2v2/0')->assertStatus(404);
    }

    public function test_returns_appropaite_when_deleting_2v2_game_not_signed_in()
    {
        $players = self::create_players(4);
        $result = self::create2v2Game($players[0], $players[1], $players[2], $players[3], 10, 5, 1);
        $gameInDb = $result[1];
        $this->assertNotNull($gameInDb);
        $this->post('/logout');
        $this->assertGuest();
        $this->json('delete', '/games2v2/' . $gameInDb->id)->assertStatus(401);
        $this->assertNotNull(Game2v2::find($gameInDb->id));
    }

    private function createExpectedGame($team1, $team2, $team1_score, $team2_score)
    {
        $game = new stdClass();
        $game->team1_id = $team1->id;
        $game->team2_id = $team2->id;
        $game->team1_score = $team1_score;
        $game->team2_score = $team2_score;
        return $game;
    }

    private function returnGameWithNoProtectedAttributes($game)
    {
        $gameUnProtected = (object)self::getProperty($game, 'attributes');
        unset($gameUnProtected->created_at);
        unset($gameUnProtected->updated_at);
        return $gameUnProtected;
    }

    private function getProperty($object, $propertyName)
    {
        $reflection = new ReflectionClass($object);
        $property = $reflection->getProperty($propertyName);
        $property->setAccessible(true);
        return $property->getValue($object);
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


}
