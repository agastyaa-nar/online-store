<?php

namespace App\Models;

class User
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function findByUsername($username)
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE username = ? AND is_active = true");
        $stmt->execute([$username]);
        return $stmt->fetch();
    }

    public function findByEmail($email)
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ? AND is_active = true");
        $stmt->execute([$email]);
        return $stmt->fetch();
    }

    public function findById($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = ? AND is_active = true");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($data)
    {
        $stmt = $this->db->prepare("
            INSERT INTO users (id, username, email, password_hash, role, first_name, last_name, phone, address) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $id = $this->generateId();
        $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);
        
        return $stmt->execute([
            $id,
            $data['username'],
            $data['email'],
            $passwordHash,
            $data['role'] ?? 'user',
            $data['first_name'] ?? null,
            $data['last_name'] ?? null,
            $data['phone'] ?? null,
            $data['address'] ?? null
        ]);
    }

    public function getAll()
    {
        $stmt = $this->db->prepare("SELECT id, username, email, role, first_name, last_name, phone, address, created_at FROM users WHERE is_active = true");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function delete($id)
    {
        $stmt = $this->db->prepare("UPDATE users SET is_active = false WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function verifyPassword($password, $hash)
    {
        return password_verify($password, $hash);
    }

    private function generateId()
    {
        return 'user_' . uniqid() . '_' . bin2hex(random_bytes(8));
    }
}
