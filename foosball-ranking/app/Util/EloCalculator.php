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
    private static function calculate(float $Ra, float $Rb, int $K, int $d): array
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

        return array(
            0=>$Ra,
            1=>$Rb
        );
    }

    public static function calculateElo($elo1,$elo2,$score1,$score2){
        if ($score1 != $score2)
        $updatedElo = self::calculate($elo1,$elo2,30,
            $score1>$score2);
        else if ($elo1 != $elo2)
        $updatedElo=EloCalculator::calculate($elo1,$elo2,15,$elo1 < $elo2);
        else
        $updatedElo=[$elo1, $elo2];

        return $updatedElo;

    }
}
