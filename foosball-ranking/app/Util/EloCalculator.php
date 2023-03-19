<?php

namespace App\Util;

class EloCalculator
{



    private static function Probability($rating1,$rating2) {
        return (
            (1.0 * 1.0) / (1 + 1.0 * pow(10,(1.0 * ($rating1 - $rating2)) / 400))
        );
    }
         
        // Function to calculate Elo rating
        // $K is a constant.
        // $d determines whether Player A wins
        // or Player B.
    public static function calculateElo($Ra, $Rb, $K, $d) {
        // To calculate the Winning
        // Probability of Player B
        $Pb =self::Probability($Ra, $Rb);
         
        // To calculate the Winning
        // Probability of Player A
        $Pa =self::Probability($Rb, $Ra);
         
        // Case 1 When Player A wins
        // Updating the Elo Ratings
        if ($d == 1) {
            $Ra = $Ra + $K * (1 - $Pa);
            $Rb = $Rb + $K * (0 - $Pb);
        }
         
        // Case 2 When Player B wins
        // Updating the Elo Ratings
        else {
            $Ra = $Ra + $K * (0 - $Pa);
            $Rb = $Rb + $K * (1 - $Pb);
        }

        error_log($Ra);
        error_log($Rb);
        return array(
            0=>$Ra,
            1=>$Rb
        );
         
    }

}