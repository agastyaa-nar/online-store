<?php

namespace App\Routes;

use App\Controllers\OrderController;

class OrderRoutes
{
    public static function register()
    {
        $orderController = new OrderController();
        $orderController->handleRequest();
    }
}
