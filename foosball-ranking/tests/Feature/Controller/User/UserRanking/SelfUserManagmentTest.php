<?php

namespace Tests\Feature\UserRanking;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
class SelfUserManagmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_top_10_players(){
        //TODO: Add tests for later
        $this->assertTrue(true);
    }
    




    private function create_players($x)
    {
        $players = array();
        for ($i = 0; $i < $x; $i++) {
            $players[] = User::factory()->create();
        }
        return $players;
    }
    private function updateElo($player,$elo){
        $player->elo=$elo;
        $player->save();
    }
}
