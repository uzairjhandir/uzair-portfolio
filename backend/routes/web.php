<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/sanctum/csrf-cookie', function () {
    return response()->noContent()->cookie('XSRF-TOKEN', 'mock-csrf-token', 60, '/', null, false, false);
});
