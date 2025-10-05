<?php

namespace App\Controllers;

use App\Models\Order;
use App\Models\Cart;

class OrderController
{
    private $orderModel;
    private $cartModel;

    public function __construct()
    {
        $this->orderModel = new Order();
        $this->cartModel = new Cart();
    }

    public function handleRequest()
    {
        $method = $_SERVER['REQUEST_METHOD'];

        if ($method === 'POST') {
            $this->create();
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        }
    }

    private function create()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $sessionId = $data['session_id'] ?? '';
        $customerData = $data['customer'] ?? [];
        $cartItems = $data['cart_items'] ?? [];

        if (empty($sessionId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Session ID is required']);
            return;
        }

        if (empty($customerData) || empty($cartItems)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Customer data and cart items are required']);
            return;
        }

        // Validate required customer fields
        $required = ['name', 'email', 'address'];
        foreach ($required as $field) {
            if (empty($customerData[$field])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => "Customer $field is required"]);
                return;
            }
        }

        try {
            $orderId = $this->orderModel->create($sessionId, $customerData, $cartItems);
            
            // Clear cart after successful order
            $this->cartModel->clearCart($sessionId);

            echo json_encode([
                'success' => true,
                'message' => 'Order created successfully',
                'order_id' => $orderId
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to create order: ' . $e->getMessage()]);
        }
    }
}
