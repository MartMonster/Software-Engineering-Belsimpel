<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('foosball_teams', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('team_name');
            $table->foreignId('player1_id')->constrained('users')->onUpdate('cascade');
            $table->foreignId('player2_id')->constrained('users')->onUpdate('cascade');
            $table->float('elo')->default(1000);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('foosball_teams');
    }
};
