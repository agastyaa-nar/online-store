<?php

namespace App\Controllers;

use App\Models\User;

class AuthController
{
    private $userModel;

    public function __construct()
    {
        $this->userModel = new User();
    }

    public function handleRequest()
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $action = $_GET['action'] ?? '';

        switch ($method) {
            case 'POST':
                if ($action === 'login') {
                    $this->login();
                } elseif ($action === 'logout') {
                    $this->logout();
                } elseif ($action === 'register') {
                    $this->register();
                } elseif ($action === 'create_user') {
                    $this->createUser();
                } else {
                    $this->login(); // Default to login
                }
                break;
                
            case 'GET':
                if ($action === 'me') {
                    $this->getCurrentUser();
                } elseif ($action === 'users') {
                    $this->getAllUsers();
                } else {
                    $this->getCurrentUser();
                }
                break;
                
            case 'DELETE':
                $this->deleteUser();
                break;
                
            default:
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
                break;
        }
    }

    private function login()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($username) || empty($password)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Username and password are required']);
            return;
        }

        $user = $this->userModel->findByUsername($username);
        if (!$user) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Username not found']);
            return;
        }
        
        if (!$this->userModel->verifyPassword($password, $user['password_hash'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid password']);
            return;
        }
        
        if (!$user['is_active']) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Account is deactivated']);
            return;
        }

        // Generate simple token (in production, use proper JWT)
        $token = $this->generateToken($user);

        // Remove password from response
        unset($user['password_hash']);

        echo json_encode([
            'success' => true,
            'user' => $user,
            'token' => $token
        ]);
    }

    private function logout()
    {
        echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
    }

    private function getCurrentUser()
    {
        $user = $this->getUserFromToken();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid token']);
            return;
        }

        unset($user['password_hash']);
        echo json_encode(['success' => true, 'user' => $user]);
    }

    private function getAllUsers()
    {
        $currentUser = $this->getUserFromToken();
        if (!$currentUser) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Authentication required']);
            return;
        }
        
        if (!in_array($currentUser['role'], ['admin', 'superadmin'])) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Insufficient permissions. Admin or Superadmin role required.']);
            return;
        }

        $users = $this->userModel->getAll();
        echo json_encode(['success' => true, 'users' => $users]);
    }

    private function register()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        $required = ['username', 'email', 'password'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => "Field '$field' is required"]);
                return;
            }
        }
        
        // Validate email format
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid email format']);
            return;
        }
        
        // Validate password strength
        if (strlen($data['password']) < 6) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters long']);
            return;
        }
        
        // Check if username or email already exists
        if ($this->userModel->findByUsername($data['username'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Username "' . $data['username'] . '" already exists']);
            return;
        }

        if ($this->userModel->findByEmail($data['email'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Email "' . $data['email'] . '" already exists']);
            return;
        }

        // Set role to 'user' for public registration
        $data['role'] = 'user';

        try {
            $success = $this->userModel->create($data);
            if ($success) {
                echo json_encode(['success' => true, 'message' => 'User "' . $data['username'] . '" registered successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to register user. Please try again.']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }

    private function createUser()
    {
        $currentUser = $this->getUserFromToken();
        if (!$currentUser) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Authentication required']);
            return;
        }
        
        if (!in_array($currentUser['role'], ['admin', 'superadmin'])) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Insufficient permissions. Admin or Superadmin role required.']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        $required = ['username', 'email', 'password'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => "Field '$field' is required"]);
                return;
            }
        }
        
        // Validate email format
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid email format']);
            return;
        }
        
        // Validate password strength
        if (strlen($data['password']) < 6) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters long']);
            return;
        }

        // Check if username or email already exists
        if ($this->userModel->findByUsername($data['username'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Username "' . $data['username'] . '" already exists']);
            return;
        }

        if ($this->userModel->findByEmail($data['email'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Email "' . $data['email'] . '" already exists']);
            return;
        }

        try {
            $success = $this->userModel->create($data);
            if ($success) {
                echo json_encode(['success' => true, 'message' => 'User "' . $data['username'] . '" created successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to create user. Please try again.']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }

    private function deleteUser()
    {
        $currentUser = $this->getUserFromToken();
        if (!$currentUser) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Authentication required']);
            return;
        }
        
        if (!in_array($currentUser['role'], ['admin', 'superadmin'])) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Insufficient permissions. Admin or Superadmin role required.']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        $userId = $data['id'] ?? '';

        if (empty($userId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'User ID is required']);
            return;
        }

        if ($userId === $currentUser['id']) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Cannot delete your own account']);
            return;
        }

        try {
            $success = $this->userModel->delete($userId);
            if ($success) {
                echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to delete user. User may not exist.']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }

    private function generateToken($user)
    {
        // Simple token generation (in production, use proper JWT)
        $payload = [
            'user_id' => $user['id'],
            'username' => $user['username'],
            'role' => $user['role'],
            'iat' => time(),
            'exp' => time() + (24 * 60 * 60) // 24 hours
        ];

        return base64_encode(json_encode($payload));
    }

    private function getUserFromToken()
    {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        
        if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return null;
        }

        $token = $matches[1];
        
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
