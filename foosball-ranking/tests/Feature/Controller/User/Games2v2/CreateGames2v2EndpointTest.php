<?php

namespace Tests\Feature\Controller\User\Games2v2;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Game2v2;
use \stdClass;
use App\Models\FoosballTeam;

class CreateGames2v2EndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_2v2_game_when_teams_already_exist(): void
    {
        $players=self::create_players(4);
        $team1=self::createTeam($players[0],$players[1],"TestTeam1");
        $team2=self::createTeam($players[2],$players[3],"TestTeam2");
        $gameInDb=self::create2v2Game($players[0],$players[1],$players[2],$players[3],10,5,1);

        $this->assertNotNull($gameInDb);
        $expectedGame=self::createExpectedGame($team1,$team2,10,5);

        $gameInDb=self::returnGameWithNoProtectedAttributes($gameInDb);
        $this->assertEquals($gameInDb,$expectedGame);
    }

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    private function createExpectedGame($team1,$team2,$team1_score,$team2_score){
        $game=new stdClass();
        $game->team1_id=$team1->id;
        $game->team2_id=$team2->id;
        $game->team1_score=$team1_score;
        $game->team2_score=$team2_score;
        return $game;
    }
    
    private function returnGameWithNoProtectedAttributes($game){
        $gameUnProtected=(object)self::getProperty($game,'attributes');
        unset($gameUnProtected->id);
        unset($gameUnProtected->created_at);
        unset($gameUnProtected->updated_at);
        return $gameUnProtected;
    }
    
    private function create2v2Game($player1,$player2,$player3,$player4,$team1_score,$team2_score,$side){
        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);

        $this->post('/games2v2', [
            "player2_username"=>$player2->username,
            "player3_username"=>$player3->username,
            "player4_username"=>$player4->username,
            "team1_score"=>$team1_score,
            "team2_score"=>$team2_score,
            "side"=>1
        ]);
        $this->post('/logout');
        return self::find2v2Game($player1,$player2,$player3,$player4,$team1_score,$team2_score,$side);
    }
    
    private function find2v2Game($player1,$player2,$player3,$player4,$team1_score,$team2_score,$side){
        if($side==1){
        $team1=self::findTeam($player1,$player2);
        $team2=self::findTeam($player3,$player4);
        }
        else{
            $team1=self::findTeam($player3,$player4);
            $team2=self::findTeam($player1,$player2);
        }
        $game=Game2v2::where('team1_id',$team1->id)
        ->where('team2_id',$team2->id)
        ->where('team1_score',$team1_score)
        ->where('team2_score',$team2_score)
        ->first();
        return $game;
    }
    
    private function createTeam($player1,$player2,$teamName){
        $this->post('/login', [
            'email' => $player1->email,
            'password' => 'password',
        ]);
        $this->post('/teams', [
            "player2_username"=>$player2->username,
            "team_name"=>$teamName
        ])->assertStatus(201);
        $this->post('/logout');
        return self::findTeam($player1,$player2,$teamName);
    }
    private function create_teams($x,$players,$player1){
        $teams=array();
        for($i=0;$i<$x;$i++){
           if($players[$i]->id!=$player1->id){
             $this->post('/teams', [
               "player2_username"=>$players[$i]->username,
               "team_name"=>"TestTeam".$i]);
               $team= new stdClass();
               $team->player1_username=$player1->username;
               $team->player2_username=$players[$i]->username;
               $team->team_name="TestTeam".$i;
               $team->elo=1000;
               $teams[]=$team;
             }
        }
        return $teams;
  }
   private static function create_players($x){
       $players=array();
       for($i=0;$i<$x;$i++){
           $players[]=User::factory()->create();
       }
       return $players;
   }

    private function findTeam($player1,$player2){
        $team=FoosballTeam::where('player1_id',$player1->id)
        ->where('player2_id',$player2->id)->first();
        if(is_null($team)){
           $team= FoosballTeam::where('player1_id',$player2->id)
           ->where('player2_id',$player1->id)->first();      
        }
        return $team;

    }

    private function getProperty($object, $propertyName){
        $reflection = new \ReflectionClass($object);
        $property = $reflection->getProperty($propertyName);
        $property->setAccessible(true);
        return $property->getValue($object);
    }

    
}