<?php

namespace Tests\Unit;

use App\Util\EloCalculator;
use PHPUnit\Framework\TestCase;

class EloCalculatorTest extends TestCase
{

    public function test_player1_wins(): void
    {
        $results = EloCalculator::calculateElo(1000, 1000, 10, 5);
        $this->assertGreaterThan($results[1], $results[0]);
    }

    public function test_player2_wins(): void
    {
        $results = EloCalculator::calculateElo(1000, 1000, 5, 10);
        $this->assertGreaterThan($results[0], $results[1]);
    }


    public function test_players_draw_but_player1_has_more_elo(): void
    {
        $results = EloCalculator::calculateElo(1000, 1100, 10, 10);
        $this->assertGreaterThan($results[0], $results[1]);
    }


    public function test_players_draw_but_player2_has_more_elo(): void
    {
        $results = EloCalculator::calculateElo(1100, 1000, 10, 10);
        $this->assertGreaterThan($results[1], $results[0]);
    }


    public function test_players_draw_and_have_the_same_elo(): void
    {
        $results = EloCalculator::calculateElo(1000, 1000, 10, 10);
        $this->assertEquals($results[1], $results[0]);
    }
}
