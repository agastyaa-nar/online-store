<?php

namespace App\Routes;

use App\Controllers\CartController;

class CartRoutes
{
    public static function register()
    {
        $cartController = new CartController();
        $cartController->handleRequest();
    }
}
