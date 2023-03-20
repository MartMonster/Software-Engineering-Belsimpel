<?php

namespace App\Models;

class PositionElo
{
    private string $username;
    private int $position;
    private float $elo;

    public function __construct(string $username, int $position, float $elo)
    {
        $this->username = $username;
        $this->position = $position;
        $this->elo = $elo;
    }

    public function __toString(): string
    {
        return json_encode([
            'username' => $this->username,
            'position' => $this->position,
            'elo' => $this->elo,
        ]);
    }
}
