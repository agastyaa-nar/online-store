<?php

namespace App\Models;

class Order
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create($sessionId, $customerData, $cartItems)
    {
        $this->db->beginTransaction();

        try {
            // Create order
            $orderId = $this->generateId();
            $totalAmount = array_sum(array_map(function($item) {
                return $item['price'] * $item['quantity'];
            }, $cartItems));

            $stmt = $this->db->prepare("
                INSERT INTO orders (id, session_id, customer_name, customer_email, customer_phone, customer_address, total_amount) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $orderId,
                $sessionId,
                $customerData['name'],
                $customerData['email'],
                $customerData['phone'] ?? null,
                $customerData['address'],
                $totalAmount
            ]);

            // Create order items
            foreach ($cartItems as $item) {
                $stmt = $this->db->prepare("
                    INSERT INTO order_items (id, order_id, product_id, product_name, product_price, quantity) 
                    VALUES (?, ?, ?, ?, ?, ?)
                ");
                
                $itemId = $this->generateId();
                $stmt->execute([
                    $itemId,
                    $orderId,
                    $item['product_id'],
                    $item['name'],
                    $item['price'],
                    $item['quantity']
                ]);
            }

            $this->db->commit();
            return $orderId;

        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function findById($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function getOrderItems($orderId)
    {
        $stmt = $this->db->prepare("SELECT * FROM order_items WHERE order_id = ?");
        $stmt->execute([$orderId]);
        return $stmt->fetchAll();
    }

    private function generateId()
    {
        return 'order_' . uniqid() . '_' . bin2hex(random_bytes(8));
    }
}
