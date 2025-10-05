<?php

namespace App\Models;

class Cart
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getItems($sessionId)
    {
        $stmt = $this->db->prepare("
            SELECT ci.*, p.name, p.price, p.image_url 
            FROM cart_items ci 
            JOIN products p ON ci.product_id = p.id 
            WHERE ci.session_id = ? AND p.is_active = true
        ");
        $stmt->execute([$sessionId]);
        return $stmt->fetchAll();
    }

    public function addItem($sessionId, $productId, $quantity = 1)
    {
        // Check if item already exists
        $stmt = $this->db->prepare("SELECT * FROM cart_items WHERE session_id = ? AND product_id = ?");
        $stmt->execute([$sessionId, $productId]);
        $existing = $stmt->fetch();

        if ($existing) {
            // Update quantity
            $stmt = $this->db->prepare("UPDATE cart_items SET quantity = quantity + ? WHERE session_id = ? AND product_id = ?");
            return $stmt->execute([$quantity, $sessionId, $productId]);
        } else {
            // Add new item
            $stmt = $this->db->prepare("INSERT INTO cart_items (id, session_id, product_id, quantity) VALUES (?, ?, ?, ?)");
            $id = $this->generateId();
            return $stmt->execute([$id, $sessionId, $productId, $quantity]);
        }
    }

    public function updateItem($sessionId, $productId, $quantity)
    {
        if ($quantity <= 0) {
            return $this->removeItem($sessionId, $productId);
        }

        $stmt = $this->db->prepare("UPDATE cart_items SET quantity = ? WHERE session_id = ? AND product_id = ?");
        return $stmt->execute([$quantity, $sessionId, $productId]);
    }

    public function removeItem($sessionId, $productId)
    {
        $stmt = $this->db->prepare("DELETE FROM cart_items WHERE session_id = ? AND product_id = ?");
        return $stmt->execute([$sessionId, $productId]);
    }

    public function clearCart($sessionId)
    {
        $stmt = $this->db->prepare("DELETE FROM cart_items WHERE session_id = ?");
        return $stmt->execute([$sessionId]);
    }

    public function getTotal($sessionId)
    {
        $stmt = $this->db->prepare("
            SELECT SUM(ci.quantity * p.price) as total 
            FROM cart_items ci 
            JOIN products p ON ci.product_id = p.id 
            WHERE ci.session_id = ? AND p.is_active = true
        ");
        $stmt->execute([$sessionId]);
        $result = $stmt->fetch();
        return $result['total'] ?? 0;
    }

    private function generateId()
    {
        return 'cart_' . uniqid() . '_' . bin2hex(random_bytes(8));
    }
}
