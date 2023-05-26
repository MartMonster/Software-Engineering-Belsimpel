<?php

use App\Http\Controllers\Admin\AdminGames1v1Controller;
use App\Http\Controllers\Admin\AdminGames2v2Controller;
use App\Http\Controllers\Admin\AdminTeamsController;
use App\Http\Controllers\Admin\AdminUserController;
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

            Route::put('/username', 'editUsername');
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
        Route::controller(AdminUserController::class)->group(function () {
            Route::get('/', 'isAdmin');
        });

        Route::middleware(['admin'])->group(function () {
            Route::controller(AdminUserController::class)->group(function () {
                Route::prefix('/user')->group(function () {
                    Route::get('/', 'getTop10Users');

                    Route::put('/{id}', 'editPlayer');

                    Route::delete('/{id}', 'deletePlayer');
                });
            });

            Route::controller(AdminGames1v1Controller::class)->group(function () {
                Route::prefix('/games1v1')->group(function () {
                    Route::post('/', 'create1v1Game');

                    Route::put('/{id}', 'edit1v1Game');

                    Route::delete('/{id}', 'delete1v1Game');
                });
            });

            Route::controller(AdminGames2v2Controller::class)->group(function () {
                Route::prefix('/games2v2')->group(function () {
                    Route::post('/', 'create2v2Game');

                    Route::put('/{id}', 'edit2v2Game');

                    Route::delete('/{id}', 'delete2v2Game');
                });
            });

            Route::controller(AdminTeamsController::class)->group(function () {
                Route::prefix('/teams')->group(function () {
                    Route::get('/', 'getTop10Teams');

                    Route::post('/', 'createTeam');

                    Route::put('/{id}', 'updateTeam');

                    Route::delete('/{id}', 'deleteTeam');
                });
            });
        });
    });
});

require_once __DIR__ . '/auth.php';
