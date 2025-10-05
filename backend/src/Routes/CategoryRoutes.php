<?php

namespace App\Routes;

use App\Controllers\CategoryController;

class CategoryRoutes
{
    public static function register()
    {
        $categoryController = new CategoryController();
        $categoryController->handleRequest();
    }
}
