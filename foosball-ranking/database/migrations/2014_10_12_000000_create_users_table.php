<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $roles = DB::table('roles')->get();
        $playerRole = $roles->firstWhere('role_name', 'Player');
        Schema::create('users', function (Blueprint $table) use ($playerRole) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
            $table->string('username')->unique();
            $table->string('lastname');
            $table->foreignId('role_id')->default($playerRole->id)->constrained('roles')->onUpdate('cascade'); // For if we want to add more roles
            $table->float('elo')->default(1000);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
