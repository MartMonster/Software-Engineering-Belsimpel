<?php

namespace App\Models;

class PositionElo
{
    private int $position;
    private float $elo;

    public function __construct(int $position, float $elo)
    {
        $this->position = $position;
        $this->elo = $elo;
    }

    public function __toString(): string
    {
        return json_encode([
            'position' => $this->position,
            'elo' => $this->elo,
        ]);
    }
}
