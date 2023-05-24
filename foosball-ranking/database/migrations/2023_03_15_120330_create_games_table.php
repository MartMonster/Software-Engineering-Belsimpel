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
        Schema::create('games1v1', function (Blueprint $table) {
            $table->id();
            $table->foreignId('player1_id')->constrained('users')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('player2_id')->constrained('users')->onUpdate('cascade')->onDelete('cascade');
            $table->tinyInteger('player1_score');
            $table->tinyInteger('player2_score');
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games1v1');
    }
};
