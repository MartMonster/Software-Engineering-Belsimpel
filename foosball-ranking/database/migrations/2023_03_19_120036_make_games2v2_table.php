<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('games2v2', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team1_id')->constrained('foosball_teams')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('team2_id')->constrained('foosball_teams')->onUpdate('cascade')->onDelete('cascade');
            $table->tinyInteger('team1_score');
            $table->tinyInteger('team2_score');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('games2v2', function (Blueprint $table) {
            //
        });
    }
};
