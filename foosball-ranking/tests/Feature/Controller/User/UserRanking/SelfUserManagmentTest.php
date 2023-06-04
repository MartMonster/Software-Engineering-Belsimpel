<?php

namespace Controller\User\UserRanking;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use ReflectionClass;
use stdClass;
use Tests\TestCase;

class SelfUserManagmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_top_10_players_is_ordered_drecreasngly_by_elo()
    {
        $players = $this->create_players(10);
        for ($i = 0; $i < 10; $i++) {
            $this->updateElo($players[$i], 1000 + $i);
        }
        $this->post('/login', [
            'email' => $players[0]->email,
            'password' => 'password',
        ]);
        $ranking = $this->get('user/');
        for ($i = 9; $i >= 0; $i--) {
            $this->assertEquals((object)$ranking[9 - $i], self::selectPropertiesOfPlayer($players[$i]));
        }
    }

    private function create_players($x)
    {
        $players = array();
        for ($i = 0; $i < $x; $i++) {
            $players[] = User::factory()->create();
        }
        return $players;
    }

    private function updateElo($player, $elo)
    {
        $player->elo = $elo;
        $player->save();
    }

    private function selectPropertiesOfPlayer($player)
    {
        $playerUnProtected = (object)self::getProperty($player, 'attributes');
        $actualPlayerToBeReturned = new stdClass();
        $actualPlayerToBeReturned->elo = $playerUnProtected->elo;
        $actualPlayerToBeReturned->username = $playerUnProtected->username;
        $actualPlayerToBeReturned->id = $playerUnProtected->id;
        return $actualPlayerToBeReturned;
    }

    private function getProperty($object, $propertyName)
    {
        $reflection = new ReflectionClass($object);
        $property = $reflection->getProperty($propertyName);
        $property->setAccessible(true);
        return $property->getValue($object);
    }

    public function test_top_10_players_can_return_less_than10_when_there_are_less_than_10_players()
    {
        $players = $this->create_players(6);
        for ($i = 0; $i < 6; $i++) {
            $this->updateElo($players[$i], 1000 + $i);
        }
        $this->post('/login', [
            'email' => $players[0]->email,
            'password' => 'password',
        ]);
        $ranking = $this->get('user/');
        for ($i = 5; $i >= 0; $i--) {
            $this->assertEquals((object)$ranking[5 - $i], self::selectPropertiesOfPlayer($players[$i]));
        }
    }

    public function test_top_10_players_does_not_return_more_than_10()
    {
        $players = $this->create_players(11);
        for ($i = 0; $i < 11; $i++) {
            $this->updateElo($players[$i], 1000 + $i);
        }
        $this->post('/login', [
            'email' => $players[0]->email,
            'password' => 'password',
        ]);
        $ranking = $this->get('user/');
        for ($i = 9; $i >= 0; $i--) {
            $this->assertEquals((object)$ranking[9 - $i], self::selectPropertiesOfPlayer($players[$i + 1]));
        }
        $this->assertArrayNotHasKey(10, $ranking);
    }

    public function test_position_of_user_is_calculated_correctly()
    {
        $players = $this->create_players(5);
        for ($i = 1; $i < 5; $i++) {
            $this->updateElo($players[$i], 1000 + $i);
        }
        $this->post('/login', [
            'email' => $players[0]->email,
            'password' => 'password',
        ]);
        $this->assertEquals(5, $this->get('user/summary')["position"]);

    }

    public function test_user_can_change_their_own_name()
    {
        $players = $this->create_players(1);
        $this->post('/login', [
            'email' => $players[0]->email,
            'password' => 'password',
        ]);
        $this->put('user/username', ["username" => "newName"]);
        $this->assertEquals("newName", User::find($players[0]->id)->username);
    }

    public function test_user_gets_appropiate_response_when_updating_name_to_taken_name()
    {
        $players = $this->create_players(2);
        $this->post('/login', [
            'email' => $players[0]->email,
            'password' => 'password',
        ]);
        $this->json('put', 'user/username', ["username" => $players[1]->username])->assertStatus(400);

    }

    public function test_user_gets_appropiate_response_when_updating_name_to_invalid_name()
    {
        $players = $this->create_players(2);
        $this->post('/login', [
            'email' => $players[0]->email,
            'password' => 'password',
        ]);
        $this->json('put', 'user/username')->assertStatus(422);
        $this->json('put', 'user/username', ["username" => ""])->assertStatus(422);
        $this->json('put', 'user/username', ["username" => "  "])->assertStatus(422);

    }

    private function selctPropertiesFromUser($player)
    {

    }
}
