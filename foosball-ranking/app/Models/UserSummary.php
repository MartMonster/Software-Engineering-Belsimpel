<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSummary extends Model
{
    use HasFactory;
    private string $username;
    private int $position;
    private float $elo;
}
