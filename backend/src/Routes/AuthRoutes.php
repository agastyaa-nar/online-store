<?php

namespace App\Routes;

use App\Controllers\AuthController;

class AuthRoutes
{
    public static function register()
    {
        $authController = new AuthController();
        $authController->handleRequest();
    }
}
