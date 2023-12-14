<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class GameController extends Controller
{
    public function index(): View
    {
        return view('home');
    }
}
