<?php

namespace App\Controllers;

use App\Models\Cart;

class CartController
{
    private $cartModel;

    public function __construct()
    {
        $this->cartModel = new Cart();
    }

    public function handleRequest()
    {
        $method = $_SERVER['REQUEST_METHOD'];

        switch ($method) {
            case 'GET':
                $this->getItems();
                break;
                
            case 'POST':
                $this->addItem();
                break;
                
            case 'PUT':
                $this->updateItem();
                break;
                
            case 'DELETE':
                $this->removeItem();
                break;
                
            default:
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
                break;
        }
    }

    private function getItems()
    {
        try {
            $sessionId = $_GET['session_id'] ?? '';

            if (empty($sessionId)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Session ID is required']);
                return;
            }

            $items = $this->cartModel->getItems($sessionId);
            $total = $this->cartModel->getTotal($sessionId);

            echo json_encode([
                'success' => true,
                'items' => $items,
                'total' => $total
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false, 
                'message' => 'Database connection failed. Please try again later.',
                'error' => $e->getMessage()
            ]);
        }
    }

    private function addItem()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $sessionId = $data['session_id'] ?? '';
        $productId = $data['product_id'] ?? '';
        $quantity = $data['quantity'] ?? 1;

        if (empty($sessionId) || empty($productId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Session ID and Product ID are required']);
            return;
        }

        $success = $this->cartModel->addItem($sessionId, $productId, $quantity);
        if ($success) {
            echo json_encode(['success' => true, 'message' => 'Item added to cart']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to add item to cart']);
        }
    }

    private function updateItem()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $sessionId = $data['session_id'] ?? '';
        $productId = $data['product_id'] ?? '';
        $quantity = $data['quantity'] ?? 0;

        if (empty($sessionId) || empty($productId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Session ID and Product ID are required']);
            return;
        }

        $success = $this->cartModel->updateItem($sessionId, $productId, $quantity);
        if ($success) {
            echo json_encode(['success' => true, 'message' => 'Cart updated']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update cart']);
        }
    }

    private function removeItem()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $sessionId = $data['session_id'] ?? '';
        $productId = $data['product_id'] ?? '';
        $clearAll = $data['clear_all'] ?? false;

        if (empty($sessionId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Session ID is required']);
            return;
        }

        if ($clearAll) {
            $success = $this->cartModel->clearCart($sessionId);
            $message = 'Cart cleared';
        } else {
            if (empty($productId)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Product ID is required']);
                return;
            }
            $success = $this->cartModel->removeItem($sessionId, $productId);
            $message = 'Item removed from cart';
        }

        if ($success) {
            echo json_encode(['success' => true, 'message' => $message]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update cart']);
        }
    }
}
