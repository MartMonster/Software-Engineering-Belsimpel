<?php

namespace Tests\Feature\Controller\Admin\AdminManagement;

use App\Models\FoosballTeam;
use App\Models\Game1v1;
use App\Models\Game2v2;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use ReflectionClass;
use stdClass;
use Tests\TestCase;
use function PHPUnit\Framework\assertEquals;

class AdminManagementFunctionalitiesTest extends TestCase
{
    use RefreshDatabase;


    public function test_admin_top_10_players_is_ordered_drecreasngly_by_elo()
    {
        $players = $this->create_players(10);
        $admin = self::makeUserAdmin($players[0]);
        for ($i = 0; $i < 10; $i++) {
            $this->updateElo($players[$i], 1000 + $i);
        }
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $ranking = $this->get('admin/user/')->getData()->data;
        for ($i = 9; $i >= 0; $i--) {
            $this->assertEquals((object)$ranking[9 - $i], self::selectPropertiesOfPlayer($players[$i]));
        }
    }


    public function test_admin_top_10_players_can_return_less_than10_when_there_are_less_than_10_players()
    {
        $players = $this->create_players(6);
        $admin = self::makeUserAdmin($players[0]);
        for ($i = 0; $i < 6; $i++) {
            $this->updateElo($players[$i], 1000 + $i);
        }
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $ranking = $this->get('admin/user/')->getData()->data;
        for ($i = 5; $i >= 0; $i--) {
            $this->assertEquals((object)$ranking[5 - $i], self::selectPropertiesOfPlayer($players[$i]));
        }
    }


    public function test_admin_top_10_is_paginated()
    {
        $players = $this->create_players(13);
        $admin = self::makeUserAdmin($players[0]);
        for ($i = 0; $i < 13; $i++) {
            $this->updateElo($players[$i], 1000 + $i);
        }
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $ranking = $this->get('admin/user/')->getData()->data;
        for ($i = 9; $i >= 0; $i--) {
            $this->assertEquals((object)$ranking[9 - $i], self::selectPropertiesOfPlayer($players[$i + 3]));
        }
        $ranking = $this->get('admin/user/?page=2')->getData()->data;
        for ($i = 2; $i >= 0; $i--) {
            $this->assertEquals((object)$ranking[2 - $i], self::selectPropertiesOfPlayer($players[$i]));
        }

    }


    public function test_admin_can_edit_the_usernames_of_players()
    {
        $players = $this->create_players(2);
        $admin = self::makeUserAdmin($players[0]);
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $this->json('put', '/admin/user/' . $players[1]->id, [
            'username' => 'newUsername'
        ])->assertStatus(200);
        $this->assertEquals('newUsername', User::find($players[1]->id)->username);

    }


    public function test_admin_cant_edit_the_username_of_player_to_invalid_name()
    {
        $players = $this->create_players(2);
        $admin = self::makeUserAdmin($players[0]);
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $this->json('put', '/admin/user/' . $players[1]->id, [
            'username' => ''
        ])->assertStatus(422);
        $this->json('put', '/admin/user/' . $players[1]->id, [
            'username' => ' '
        ])->assertStatus(422);
        $this->json('put', '/admin/user/' . $players[1]->id, [
            'username' => null
        ])->assertStatus(422);
        $this->assertEquals($players[1]->username, User::find($players[1]->id)->username);

    }


    public function test_admin_cant_edit_the_usernames_of_players_to_taken_usernames()
    {
        $players = $this->create_players(3);
        $admin = self::makeUserAdmin($players[0]);
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $this->json('put', '/admin/user/' . $players[1]->id, [
            'username' => $players[2]->username
        ])->assertStatus(400);

    }


    public function test_admin_cant_edit_the_usernames_of_other_admins()
    {
        $players = $this->create_players(2);
        $admin = self::makeUserAdmin($players[0]);
        $admin2 = self::makeUserAdmin($players[1]);
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $this->json('put', '/admin/user/' . $admin2->id, [
            'username' => "NewUsername"
        ])->assertStatus(403);

    }

    public function test_admin_cant_edit_their_own_usernames()
    {
        $players = $this->create_players(1);
        $admin = self::makeUserAdmin($players[0]);
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $this->json('put', '/admin/user/' . $players[0]->id, [
            'username' => "newUsername"
        ])->assertStatus(200);
        $this->assertEquals('newUsername', User::find($players[0]->id)->username);

    }


    public function test_admin_can_delete_players()
    {
        $players = $this->create_players(2);
        $admin = self::makeUserAdmin($players[0]);
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $this->json('delete', '/admin/user/' . $players[1]->id)->assertStatus(200);
        $this->assertNull(User::find($players[1]->id));
    }

    public function test_admin_cant_delete_admins()
    {
        $players = $this->create_players(2);
        $admin = self::makeUserAdmin($players[0]);
        self::makeUserAdmin($players[1]);
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $this->json('delete', '/admin/user/' . $players[1]->id)->assertStatus(403);
        $this->assertNotNull(User::find($players[1]->id));
    }


    public function test_admin_cant_delete_themselves()
    {
        $players = $this->create_players(1);
        $admin = self::makeUserAdmin($players[0]);
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $this->json('delete', '/admin/user/' . $players[0]->id)->assertStatus(403);
        $this->assertNotNull(User::find($players[0]->id));
    }


    public function test_admin_cant_delete_players_that_dont_exist()
    {
        $players = $this->create_players(1);
        $admin = self::makeUserAdmin($players[0]);
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $this->json('delete', '/admin/user/10')->assertStatus(404);
    }

    public function test_admin_delete_player_also_deletes_teams_and_games()
    {
        $players = $this->create_players(5);
        $admin = self::makeUserAdmin($players[0]);
        $results1 = self::adminCreate2v2Game($admin, $players[1], $players[2], $players[3], $players[4], 10, 8, 1);
        $this->assertNotNull($results1[1]);
        $this->assertNotNull(self::findTeam($players[1], $players[2]));
        $this->assertNotNull(self::findTeam($players[3], $players[4]));
        self::createAdminGame1v1($admin, 10, 8, $players[1], $players[2], 1)->assertStatus(201);
        $this->assertNotNull(self::findGame1v1($players[1], $players[2], 10, 8));
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $this->json('delete', '/admin/user/' . $players[1]->id)->assertStatus(200);
        $this->assertNull(User::find($players[1]->id));
        $this->assertNull(self::findTeam($players[1], $players[2]));
        $this->assertNotNull(self::findTeam($players[3], $players[4]));
        $this->assertNull(self::findGame1v1($players[1], $players[2], 10, 8));
        $this->assertNull(Game2v2::find($results1[1]->id));

    }

    public function test_isAdmin_returns_true_for_admins()
    {
        $admin = self::makeUserAdmin(self::create_players(1)[0]);
        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $value = $this->get('/admin')->assertStatus(200);
        assertEquals(1, $value->content());
    }

    public function test_isAdmin_returns_nothing_for_non_admins()
    {
        $player = self::create_players(1)[0];
        $this->post('/login', [
            'email' => $player->email,
            'password' => 'password',
        ]);
        $value = $this->get('/admin')->assertStatus(200);
        assertEquals('', $value->content());
    }

    private static function makeUserAdmin($player)
    {
        $player->role_id = 1;
        $player->save();
        return $player;

    }

    private function updateElo($player, $elo)
    {
        $player->elo = $elo;
        $player->save();
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


    private static function create_players($x)
    {
        $players = array();
        for ($i = 0; $i < $x; $i++) {
            $players[] = User::factory()->create();
        }
        return $players;
    }


    private function selectPropertiesOfPlayer($player)
    {
        $playerUnProtected = (object)self::getProperty($player, 'attributes');
        $actualPlayerToBeReturned = new \stdClass();
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

    private function createAdminGame1v1($admin, $score1, $score2, $player1, $player2)
    {
        $this->post('login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);
        $response = $this->json('post', 'admin/games1v1', [
            "player1_username" => $player1->username,
            "player2_username" => $player2->username,
            "player1_score" => $score1,
            "player2_score" => $score2,
        ]);
        $this->post('logout');
        return $response;
    }

    private function findGame1v1($player1, $player2, $score1, $score2)
    {
        return Game1v1::where('player1_id', $player1->id)->where('player2_id', $player2->id)->where('player1_score', $score1)->where('player2_score', $score2)->first();
    }


}
