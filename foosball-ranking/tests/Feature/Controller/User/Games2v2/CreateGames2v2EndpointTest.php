<?php

namespace Tests\Feature\Controller\User\Games2v2;

use App\Models\FoosballTeam;
use App\Models\Game2v2;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use ReflectionClass;
use stdClass;
use Tests\TestCase;

class CreateGames2v2EndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_2v2_game_when_teams_already_exist(): void
    {
        $players = self::create_players(4);
        $team1 = self::createTeam($players[0], $players[1], "TestTeam1");
        $team2 = self::createTeam($players[2], $players[3], "TestTeam2");
        $result = self::create2v2Game($players[0], $players[1], $players[2], $players[3], 10, 5, 1);

        $result[0]->assertStatus(201);
        $gameInDb = $result[1];
        $this->assertNotNull($gameInDb);
        $expectedGame = self::createExpectedGame($team1, $team2, 10, 5);

        $gameInDb = self::returnGameWithNoProtectedAttributes($gameInDb);
        $this->assertEquals($gameInDb, $expectedGame);
    }

    public function test_user_can_create_2v2_games_and_teams_get_created(): void
    {
        $players = self::create_players(4);
        $result = self::create2v2Game($players[0], $players[1], $players[2], $players[3], 10, 5, 1);

        $result[0]->assertStatus(201);
        $gameInDb = $result[1];

        $this->assertNotNull($gameInDb);
        $team1 = self::findTeam($players[0], $players[1]);
        $team2 = self::findTeam($players[2], $players[3]);
        $expectedGame = self::createExpectedGame($team1, $team2, 10, 5);

        $gameInDb = self::returnGameWithNoProtectedAttributes($gameInDb);
        $this->assertEquals($gameInDb, $expectedGame);
        $this->assertNotNull($this->findTeam($players[0], $players[1]));
        $this->assertNotNull($this->findTeam($players[2], $players[3]));
    }


    public function test_user_cannot_create_2v2_game_when_one_player_does_not_exists(): void
    {
        $players = self::create_players(3);
        $nonExistentPlayer = new stdClass();
        $nonExistentPlayer->username = "John";
        $nonExistentPlayer->id = null;
        $result = self::create2v2Game($players[0], $players[1], $players[2], $nonExistentPlayer, 10, 5, 1);


        $result[0]->assertStatus(404);
        $gameInDb = $result[1];

        $this->assertNull($gameInDb);
        
    }

    public function test_teams_get_swapped_based_on_side(): void
    {
        $players = self::create_players(4);
        $team1 = self::createTeam($players[0], $players[1], "TestTeam1");
        $team2 = self::createTeam($players[2], $players[3], "TestTeam2");
        $result = self::create2v2Game($players[0], $players[1], $players[2], $players[3], 10, 5, 2);

        $result[0]->assertStatus(201);
        $gameInDb = $result[1];
        $this->assertNotNull($gameInDb);
        $expectedGame = self::createExpectedGame($team2, $team1, 5, 10);

        $gameInDb = self::returnGameWithNoProtectedAttributes($gameInDb);
        $this->assertEquals($gameInDb, $expectedGame);
        
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

        $response=$this->post('/games2v2', [
            "player2_username" => $player2->username,
            "player3_username" => $player3->username,
            "player4_username" => $player4->username,
            "team1_score" => $team1_score,
            "team2_score" => $team2_score,
            "side" => $side
        ]);
        $this->post('/logout');
        return array( $response,self::find2v2Game($player1, $player2, $player3, $player4, $team1_score, $team2_score, $side));
    }

    private function find2v2Game($player1, $player2, $player3, $player4, $team1_score, $team2_score, $side)
    {
        if ($side == 1) {
            $team1 = self::findTeam($player1, $player2);
            $team2 = self::findTeam($player3, $player4);
        } else {
            $team1 = self::findTeam($player3, $player4);
            $team2 = self::findTeam($player1, $player2);
            $tmp=$team1_score;
            $team1_score=$team2_score;
            $team2_score=$tmp;
        }

        //To avoid php complaining we force create the id property
        if(is_null($team1)){
            $team1= new stdClass();
            $team1->id=null;
        } 
        if(is_null($team2)){
            $team2= new stdClass();
            $team2->id=null;
        }
        $game = Game2v2::where('team1_id', $team1->id)
            ->where('team2_id', $team2->id)
            ->where('team1_score', $team1_score)
            ->where('team2_score', $team2_score)
            ->first();
        return $game;
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
        unset($gameUnProtected->id);
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
