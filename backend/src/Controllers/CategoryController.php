<?php

namespace App\Controllers;

use App\Models\Category;

class CategoryController
{
    private $categoryModel;

    public function __construct()
    {
        $this->categoryModel = new Category();
    }

    public function handleRequest()
    {
        $method = $_SERVER['REQUEST_METHOD'];

        if ($method === 'GET') {
            $this->getAll();
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        }
    }

    private function getAll()
    {
        $categories = $this->categoryModel->getAll();
        echo json_encode(['success' => true, 'categories' => $categories]);
    }
}
