<?php

namespace App\Util;

class EloCalculator
{

    private static function Probability($rating1,$rating2): float
    {
        return (
            (1.0) / (1 + 1.0 * pow(10,(1.0 * ($rating1 - $rating2)) / 400))
        );
    }

    /**
     * @param $Ra float elo of player A
     * @param $Rb float elo of player B
     * @param $K integer constant to determine how much elo fluctuates
     * @param $d integer 1 if player A wins, 0 if player B wins
     * @return float[] array with new elo of player A and player B
     */
    public static function calculateElo(float $Ra, float $Rb, int $K, int $d): array
    {
        // To calculate the Winning
        // Probability of Player B
        $Pb =self::Probability($Ra, $Rb);

        // To calculate the Winning
        // Probability of Player A
        $Pa =self::Probability($Rb, $Ra);

        // calculates new elo of player A and player B based on win probability
        assert($d == 1 || $d == 0, "d must be 1 or 0");
        $Ra = $Ra + $K * ($d - $Pa);
        $Rb = $Rb + $K * (1-$d - $Pb);

        error_log($Ra);
        error_log($Rb);
        return array(
            0=>$Ra,
            1=>$Rb
        );
    }
}
