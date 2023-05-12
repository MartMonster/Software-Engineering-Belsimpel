<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\User\Games1v1Controller;
use App\Http\Controllers\User\Games2v2Controller;
use App\Http\Controllers\User\TeamsController;
use App\Http\Controllers\User\UserController;
use Illuminate\Support\Facades\Route;

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
            Route::get('/', 'getTop10');

            Route::get('/summary', 'getPosElo');
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
            Route::get('/', 'getTop10Teams');

            Route::get('/self', 'getOwnTeams');

            Route::post('/', 'createTeam');

            Route::put('/{id}', 'updateTeam');

            Route::delete('/{id}', 'deleteTeam');
        });
    });

    Route::prefix('/admin')->group(function () {
        Route::controller(AdminController::class)->group(function () {
            Route::get('/', 'isAdmin');
            Route::middleware(['admin'])->group(function () {
                Route::post('/games1v1', 'create1v1Game');

                Route::put('/games1v1/{id}', 'edit1v1Game');

                Route::delete('/games1v1/{id}', 'delete1v1Game');

                Route::post('/games2v2', 'create2v2Game');

                Route::put('/games2v2/{id}', 'edit2v2Game');

                Route::delete('/games2v2/{id}', 'delete2v2Game');

                Route::post('/teams', 'createTeam');

                Route::put('/teams/{id}', 'editTeam');

                Route::delete('/teams/{id}', 'deleteTeam');

                Route::delete('/user/{id}', 'deletePlayer');
            });
        });
    });
});

require __DIR__ . '/auth.php';
