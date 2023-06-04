<?php

namespace Tests\Feature\Controller\User\Games2v2;

use App\Models\FoosballTeam;
use App\Models\Game2v2;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use ReflectionClass;
use stdClass;
use Tests\TestCase;

class GetOwnLastGames2v2EndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_see_their_own_last_2v2_game_played_when_there_are_less_then_10(): void
    {
        $players = self::create_players(5);
        $team1 = self::createTeam($players[0], $players[1], 'team1');
        $team2 = self::createTeam($players[2], $players[3], 'team2');
        $result = self::create2v2Game($players[0], $players[1], $players[2], $players[3], 10, 5, 1);
        $this->assertNotNull($result[1]);
        self::create2v2Game($players[1], $players[2], $players[3], $players[4], 11, 6, 1);
        //We can't use directly the game in the databse because the endpoint returns the name using a joi
        //As such we create the game manually
        $expectedGame = self::createExpectedGame($team1,$team2,10,5,1);
        $this->assertEquals($expectedGame,self::getOwn2v2Games($players[0],1)[0]);
        $this->post('/login',[
            'email'=>$players[0]->email,
            'password'=>'password'
        ]);
        $this->assertArrayNotHasKey (2,$this->get('/games2v2/self?page=1')->getData()->data);
    }

    public function test_user_can_see_only_10_own_2v2games_per_page(): void
    {
        $players = self::create_players(5);
        $team1 = self::createTeam($players[0], $players[1], 'team1');
        $team2 = self::createTeam($players[2], $players[3], 'team2');
        for($i=0;$i<11;$i++)
            $this->assertNotNull(self::create2v2Game($players[0], $players[1], $players[2], $players[3], 10, 5, 1)[1]);
        self::create2v2Game($players[1], $players[2], $players[3], $players[4], 11, 6, 1);
        $expectedGame = self::createExpectedGame($team1,$team2,10,5,1);
        $games=self::getOwn2v2Games($players[0],1);
        for($i=0;$i<10;$i++){
            $this->assertEquals($expectedGame,$games[$i]);
        }
        $this->post('/login',[
            'email'=>$players[0]->email,
            'password'=>'password'
        ]);
        $this->assertArrayNotHasKey (10,$this->get('/games2v2?page=1')->getData()->data);
    }
    public function test_user_cant_see_their_own_last_2v2_games_when_not_logged_in(): void
    {
        $players = self::create_players(4);
        $team1 = self::createTeam($players[0], $players[1], 'team1');
        $team2 = self::createTeam($players[2], $players[3], 'team2');
        $result = self::create2v2Game($players[0], $players[1], $players[2], $players[3], 10, 5, 1);
        $this->assertNotNull($result[1]);
        $this->json('get','/games2v2/self')->assertStatus(401);
    }
    public function test_returns_empty_if_no_2v2_games_are():void
    {
        $players = self::create_players(1);
        $this->assertEmpty(self::getOwn2v2Games($players[0],1));
    }

    public function test_own_2v2_games_are_paginated_with_10_games_per_page(){
        $players = self::create_players(5);
        $team1 = self::createTeam($players[0], $players[1], 'team1');
        $team2 = self::createTeam($players[2], $players[3], 'team2');
        for($i=0;$i<13;$i++)
            $this->assertNotNull(self::create2v2Game($players[0], $players[1], $players[2], $players[3], 10, 5, 1)[1]);
        $expectedGame = self::createExpectedGame($team1,$team2,10,5,1);
        self::create2v2Game($players[1], $players[2], $players[3], $players[4], 11, 6, 1);

        $games=self::getOwn2v2Games($players[0],1);
        for($i=0;$i<10;$i++){
            $this->assertEquals($expectedGame,$games[$i]);
        }
        $games=self::getOwn2v2Games($players[0],2);
        for($i=0;$i<3;$i++){
            $this->assertEquals($expectedGame,$games[$i]);
        }
        $this->post('/login',[
            'email'=>$players[0]->email,
            'password'=>'password'
        ]);
        $this->assertArrayNotHasKey (3,$this->get('/games2v2/self?page=2')->getData()->data);
    }

    public function test_own_2v2_games_are_ordered_descengly_by_date():void{
        $players = self::create_players(5);
        $team1 = self::createTeam($players[0], $players[1], 'team1');
        $team2 = self::createTeam($players[2], $players[3], 'team2');
        for($i=0;$i<5;$i++)
            $this->assertNotNull(self::create2v2Game($players[0], $players[1], $players[2], $players[3], 10, 5, 1)[1]);
        $expectedGame1 = self::createExpectedGame($team1,$team2,10,5,1);
        sleep(1);
        for($i=0;$i<5;$i++)
            $this->assertNotNull(self::create2v2Game($players[0], $players[1], $players[2], $players[3], 12, 6, 1)[1]);
        self::create2v2Game($players[1], $players[2], $players[3], $players[4], 11, 6, 1);
        $expectedGame2 = self::createExpectedGame($team1,$team2,12,6,1);
        $games=self::getOwn2v2Games($players[0],1);
        for($i=0;$i<5;$i++){
            $this->assertEquals($expectedGame2,$games[$i]);
        }
        for($i=5;$i<10;$i++){
            $this->assertEquals($expectedGame1,$games[$i]);
        }
        $this->post('/login',[
            'email'=>$players[0]->email,
            'password'=>'password'
        ]);
        $this->assertArrayNotHasKey (0,$this->get('/games2v2/self?page=2')->getData()->data);


    }















    private function getOwn2v2Games($player,$page){
        $this->post('/login', [
            'email' => $player->email,
            'password' => 'password',
        ]);
        $games=array();
        $response=$this->get('/games2v2/self?page='.$page)->assertStatus(200);
        foreach ($response->getData()->data as $game){
            //we remove this property because it is not relevant to the test
            $tempGame=$game;
            unset($tempGame->id);
            $games[]=$tempGame;
        }
        $this->post('/logout');
        return $games;


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
        $game->team1_name = $team1->team_name;
        $game->team2_name = $team2->team_name;
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
