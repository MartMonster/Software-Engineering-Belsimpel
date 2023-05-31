<?php

namespace Tests\Feature\Controller\User\Games2v2;

use App\Models\FoosballTeam;
use App\Models\Game2v2;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use ReflectionClass;
use stdClass;
use Tests\TestCase;

class UpdateGames2v2EndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_update_the_game_they_created(): void
    {
        $players = self::create_players(4);

        $result = self::create2v2Game($players[0], $players[1], $players[2], $players[3], 10, 5, 1);
        $gameInDb = $result[1];
        $this->assertNotNull($gameInDb);
        $this->updateGame($gameInDb, 12, 7, 1, $players[0]);
        $gameInDb = Game2v2::find($gameInDb->id);
        $expectedGame=self::createExpectedGame(self::findTeam($players[0],$players[1]),self::findTeam($players[2],$players[3]),12,7);
        $this->assertEquals($expectedGame,self::returnGameWithNoProtectedAttributes( $gameInDb));
    }

    public function test_user_can_update_the_game_they_are_part_of_even_if_they_did_not_create_the_game(): void
    {
        $players = self::create_players(4);

        $result = self::create2v2Game($players[0], $players[1], $players[2], $players[3], 10, 5, 1);
        $gameInDb = $result[1];
        $this->assertNotNull($gameInDb);

        $this->updateGame($gameInDb, 12, 7, 1, $players[1]);
        $gameInDb = Game2v2::find($gameInDb->id);
        $expectedGame=self::createExpectedGame(self::findTeam($players[0],$players[1]),self::findTeam($players[2],$players[3]),12,7);
        $this->assertEquals($expectedGame,self::returnGameWithNoProtectedAttributes( $gameInDb));

        //the side paramater changes to keep the game consistent
        //Because the team that first creates game on the first side for the game to stay the same
        //Team 2 requests that they be on side 2
        $this->updateGame($gameInDb, 13, 8, 2, $players[2]);
        $gameInDb = Game2v2::find($gameInDb->id);
        $expectedGame=self::createExpectedGame(self::findTeam($players[0],$players[1]),self::findTeam($players[2],$players[3]),8,13);   
        $this->assertEquals($expectedGame,self::returnGameWithNoProtectedAttributes( $gameInDb));
        
        
        
        $this->updateGame($gameInDb, 14, 9, 2, $players[3]);
        $gameInDb = Game2v2::find($gameInDb->id);
        $expectedGame=self::createExpectedGame(self::findTeam($players[0],$players[1]),self::findTeam($players[2],$players[3]),9,14);
        $this->assertEquals($expectedGame,self::returnGameWithNoProtectedAttributes( $gameInDb));
    }


    public function test_teams_get_swapped_appropietly(){
        $players = self::create_players(4);
        $result=self::create2v2Game($players[0],$players[1],$players[2],$players[3],10,5,1);
        $gameInDb=$result[1];

        //In this situation we're placing the first team on the second side
        $this->updateGame($gameInDb, 10, 5, 2, $players[0]);
        $gameInDb = Game2v2::find($gameInDb->id);
        $expectedGame=self::createExpectedGame(self::findTeam($players[2],$players[3]),self::findTeam($players[0],$players[1]),5,10);
        $this->assertEquals($expectedGame,self::returnGameWithNoProtectedAttributes( $gameInDb));

        //In this situation we're placing the first team on the first side
        $this->updateGame($gameInDb, 6, 11, 1, $players[1]);
        $gameInDb = Game2v2::find($gameInDb->id);
        $expectedGame=self::createExpectedGame(self::findTeam($players[0],$players[1]),self::findTeam($players[2],$players[3]),6,11);
        $this->assertEquals($expectedGame,self::returnGameWithNoProtectedAttributes( $gameInDb));

        //In this situation we're placing the second team on the second side
        $this->updateGame($gameInDb, 12, 7, 2, $players[2]);
        $gameInDb = Game2v2::find($gameInDb->id);
        $expectedGame=self::createExpectedGame(self::findTeam($players[0],$players[1]),self::findTeam($players[2],$players[3]),7,12);
        $this->assertEquals($expectedGame,self::returnGameWithNoProtectedAttributes( $gameInDb));

        $this->updateGame($gameInDb, 13, 8, 1, $players[3]);
        $gameInDb = Game2v2::find($gameInDb->id);
        $expectedGame=self::createExpectedGame(self::findTeam($players[2],$players[3]),self::findTeam($players[0],$players[1]),13,8);
        $this->assertEquals($expectedGame,self::returnGameWithNoProtectedAttributes( $gameInDb));
    }
    














    private function updateGame($game,$team1_score,$team2_score,$side,$player1){
        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);
        $this->put('/games2v2/' . $game->id, [
            "team1_score" => $team1_score,
            "team2_score" => $team2_score,
            "side" => $side
        ])->assertStatus(200);
        $this->post('/logout');

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

        $response=$this->json('post','/games2v2', [
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
