<?php

namespace App\Models;

class Product
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getAll($search = null, $categoryId = null)
    {
        $sql = "SELECT p.*, c.name as category_name 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id 
                WHERE p.is_active = true";
        $params = [];

        if ($search) {
            $sql .= " AND (p.name LIKE ? OR p.description LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        if ($categoryId) {
            $sql .= " AND p.category_id = ?";
            $params[] = $categoryId;
        }

        $sql .= " ORDER BY p.created_at DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function findById($id)
    {
        $stmt = $this->db->prepare("
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.id = ? AND p.is_active = true
        ");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($data)
    {
        $stmt = $this->db->prepare("
            INSERT INTO products (id, name, description, price, image_url, category_id, stock_quantity) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        $id = $this->generateId();
        
        return $stmt->execute([
            $id,
            $data['name'],
            $data['description'] ?? null,
            $data['price'],
            $data['image_url'] ?? null,
            $data['category_id'] ?? null,
            $data['stock_quantity'] ?? 0
        ]);
    }

    public function update($id, $data)
    {
        $fields = [];
        $params = [];

        foreach ($data as $key => $value) {
            if (in_array($key, ['name', 'description', 'price', 'image_url', 'category_id', 'stock_quantity'])) {
                $fields[] = "$key = ?";
                $params[] = $value;
            }
        }

        if (empty($fields)) {
            return false;
        }

        $params[] = $id;
        $sql = "UPDATE products SET " . implode(', ', $fields) . " WHERE id = ?";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function delete($id)
    {
        $stmt = $this->db->prepare("UPDATE products SET is_active = false WHERE id = ?");
        return $stmt->execute([$id]);
    }

    private function generateId()
    {
        return 'prod_' . uniqid() . '_' . bin2hex(random_bytes(8));
    }
}
