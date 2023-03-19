<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Games1v1Controller;
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

Route::post('/games1v1',[Games1v1Controller::class],'store')
    ->middleware('auth');

require __DIR__.'/auth.php';
