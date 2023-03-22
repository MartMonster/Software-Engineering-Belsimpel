<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Games1v1Controller;
use App\Http\Controllers\UserController;

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

            Route::put('/{game}', 'update');

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

});

require __DIR__.'/auth.php';
