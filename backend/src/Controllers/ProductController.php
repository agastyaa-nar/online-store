<?php

namespace App\Controllers;

use App\Models\Product;
use App\Models\User;

class ProductController
{
    private $productModel;
    private $userModel;

    public function __construct()
    {
        $this->productModel = new Product();
        $this->userModel = new User();
    }

    public function handleRequest()
    {
        $method = $_SERVER['REQUEST_METHOD'];

        switch ($method) {
            case 'GET':
                $this->getAll();
                break;
                
            case 'POST':
                $this->create();
                break;
                
            case 'PUT':
                $this->update();
                break;
                
            case 'DELETE':
                $this->delete();
                break;
                
            default:
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
                break;
        }
    }

    private function getAll()
    {
        $search = $_GET['search'] ?? null;
        $categoryId = $_GET['category'] ?? null;
        $productId = $_GET['id'] ?? null;

        if ($productId) {
            $product = $this->productModel->findById($productId);
            if ($product) {
                echo json_encode(['success' => true, 'product' => $product]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Product not found']);
            }
            return;
        }

        $products = $this->productModel->getAll($search, $categoryId);
        echo json_encode(['success' => true, 'products' => $products]);
    }

    private function create()
    {
        $user = $this->getUserFromToken();
        if (!$user || !in_array($user['role'], ['admin', 'superadmin'])) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        $required = ['name', 'price'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => "$field is required"]);
                return;
            }
        }

        $success = $this->productModel->create($data);
        if ($success) {
            echo json_encode(['success' => true, 'message' => 'Product created successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to create product']);
        }
    }

    private function update()
    {
        $user = $this->getUserFromToken();
        if (!$user || !in_array($user['role'], ['admin', 'superadmin'])) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        $productId = $data['id'] ?? '';

        if (empty($productId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Product ID is required']);
            return;
        }

        // Remove id from data to avoid updating it
        unset($data['id']);

        $success = $this->productModel->update($productId, $data);
        if ($success) {
            echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update product']);
        }
    }

    private function delete()
    {
        $user = $this->getUserFromToken();
        if (!$user || !in_array($user['role'], ['admin', 'superadmin'])) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        $productId = $data['id'] ?? '';

        if (empty($productId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Product ID is required']);
            return;
        }

        $success = $this->productModel->delete($productId);
        if ($success) {
            echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to delete product']);
        }
    }

    private function getUserFromToken()
    {
        $token = null;
        
        // Try Authorization header first
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (!empty($authHeader) && preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = $matches[1];
        }
        // Fallback to query parameter (for CORS issues)
        elseif (!empty($_GET['token'])) {
            $token = $_GET['token'];
        }
        
        if (empty($token)) {
            return null;
        }
        
        try {
            $decoded = json_decode(base64_decode($token), true);
            if (!$decoded || $decoded['exp'] < time()) {
                return null;
            }
            return $this->userModel->findById($decoded['user_id']);
        } catch (\Exception $e) {
            return null;
        }
    }
}
