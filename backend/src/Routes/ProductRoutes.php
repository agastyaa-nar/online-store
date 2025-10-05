<?php

namespace App\Routes;

use App\Controllers\ProductController;

class ProductRoutes
{
    public static function register()
    {
        $productController = new ProductController();
        $productController->handleRequest();
    }
}
