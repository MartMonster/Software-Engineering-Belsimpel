<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\TeamsController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Games1v1Controller;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Games2v2Controller;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::middleware(['auth'])->group(function () {

    Route::prefix('/games1v1')->group(function () {
        Route::controller(Games1v1Controller::class)->group(function () {
            Route::get('/self', 'getOwnGames');

            Route::get('/', 'getLast10Games');

            Route::post('/', 'store');

            Route::put('/{id}', 'update');

            Route::delete('/{id}', 'delete');
        });
    });

    Route::prefix('/user')->group(function () {
        Route::controller(UserController::class)->group(function () {
            Route::get('/top10', 'getTop10');

            Route::get('/summary', 'getPosElo');
        });

        // nice to have now, but should not be accessible for everyone
        Route::post('/reset/elo', function() {
            $users = User::get();
            foreach ($users as $user) {
                $user->elo = 1000.0;
                $user->save();
                echo($user->username . " " . $user->elo . "\n");
            }
        });
    });

    Route::prefix('/games2v2')->group(function () {
        Route::controller(Games2v2Controller::class)->group(function () {
            Route::get('/self', 'getOwnGames');

            Route::get('/', 'getLast10Games');

            Route::post('/', 'store');

            Route::put('/{id}', 'update');

            Route::delete('/{id}', 'delete');
        });
    });

    Route::prefix('/teams')->group(function () {
        Route::controller(TeamsController::class)->group(function () {
            Route::get('/top10', 'getTop10Teams');

            Route::get('/', 'getOwnTeams');

            Route::post('/', 'createTeam');

            Route::put('/{id}', 'updateTeam');

            Route::delete('/{id}', 'deleteTeam');
        });
    });

    Route::prefix('/admin')->group(function () {
        Route::controller(AdminController::class)->group(function () {
            Route::post('/games1v1', 'createGame');

            Route::put('/games1v1/{id}', 'editGame');

            Route::delete('/user/{id}', 'deletePlayer');

            Route::post('/games2v2', 'create2v2Game');
        });
    });
});

require __DIR__.'/auth.php';
