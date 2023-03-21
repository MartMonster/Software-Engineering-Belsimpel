<?php

use App\Models\Game1v1;
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

Route::get('/games1v1', function() {
    return Game1v1::orderBy('created_at', 'desc')->paginate(10);
})->middleware('auth');

Route::post('/games1v1',[Games1v1Controller::class,'store'])
    ->middleware('auth');

// TODO: implement
Route::put('/games1v1/{game}', function (Game1v1 $game) {})
    ->middleware('auth');

Route::delete('/games1v1/{id}', [Games1v1Controller::class,'delete'])
    ->middleware('auth');

Route::get('/user/summary',[UserController::class,'getPosElo'])->middleware('auth');

// nice to have now, but should not be accessible for everyone
Route::post('/user/reset/elo', function() {
    $users = \App\Models\User::get();
    foreach ($users as $user) {
        $user->elo = 1000.0;
        $user->save();
        echo($user->username . " " . $user->elo . "\n");
    }
});

require __DIR__.'/auth.php';
