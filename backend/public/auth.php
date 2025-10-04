<?php
require_once '../config/cors.php';

header('Content-Type: application/json');
setCorsHeaders();

require_once '../config/database.php';
require_once '../config/session.php';

class Auth {
    private $conn;
    private $table_name = "users";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function login($username, $password) {
        $query = "SELECT id, username, email, password, role, first_name, last_name, phone, address FROM " . $this->table_name . " WHERE username = :username";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(password_verify($password, $row['password'])) {
                $user = [
                    'id' => $row['id'],
                    'username' => $row['username'],
                    'email' => $row['email'],
                    'role' => $row['role'],
                    'first_name' => $row['first_name'],
                    'last_name' => $row['last_name'],
                    'phone' => $row['phone'],
                    'address' => $row['address']
                ];
                
                // Set session
                SessionManager::setUser($user);
                
                return [
                    'success' => true,
                    'user' => $user,
                    'message' => 'Login successful'
                ];
            }
        }
        return ['success' => false, 'message' => 'Invalid credentials'];
    }

    public function createUser($userData) {
        $hashed_password = password_hash($userData['password'], PASSWORD_DEFAULT);
        
        $query = "INSERT INTO " . $this->table_name . " (username, email, password, role, first_name, last_name, phone, address) VALUES (:username, :email, :password, :role, :first_name, :last_name, :phone, :address)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $userData['username']);
        $stmt->bindParam(':email', $userData['email']);
        $stmt->bindParam(':password', $hashed_password);
        $stmt->bindParam(':role', $userData['role']);
        $first_name = $userData['first_name'] ?? null;
        $last_name = $userData['last_name'] ?? null;
        $phone = $userData['phone'] ?? null;
        $address = $userData['address'] ?? null;
        
        $stmt->bindParam(':first_name', $first_name);
        $stmt->bindParam(':last_name', $last_name);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':address', $address);
        
        if($stmt->execute()) {
            return ['success' => true, 'message' => 'User created successfully'];
        }
        return ['success' => false, 'message' => 'Failed to create user'];
    }

    public function getAllUsers() {
        $query = "SELECT id, username, email, role, first_name, last_name, phone, address, created_at FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function deleteUser($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
    
    public function logout() {
        return SessionManager::logout();
    }
    
    public function getCurrentUser() {
        if (SessionManager::isLoggedIn()) {
            return ['success' => true, 'user' => SessionManager::getUser()];
        }
        return ['success' => false, 'message' => 'Not logged in'];
    }
}

$database = new Database();
$db = $database->getConnection();
$auth = new Auth($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        
        if(isset($data['action'])) {
            switch($data['action']) {
                case 'login':
                    if(isset($data['username']) && isset($data['password'])) {
                        $result = $auth->login($data['username'], $data['password']);
                        echo json_encode($result);
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Username and password required']);
                    }
                    break;
                    
                case 'create_user':
                    // Check if user is creating admin/superadmin (requires superadmin role)
                    if(isset($data['role']) && ($data['role'] === 'admin' || $data['role'] === 'superadmin')) {
                        SessionManager::requireSuperAdmin();
                    }
                    
                    if(isset($data['username']) && isset($data['email']) && isset($data['password'])) {
                        $result = $auth->createUser($data);
                        echo json_encode($result);
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Username, email, and password required']);
                    }
                    break;
                    
                case 'logout':
                    $result = $auth->logout();
                    echo json_encode($result);
                    break;
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Action required']);
        }
        break;
        
    case 'GET':
        if(isset($_GET['action'])) {
            switch($_GET['action']) {
                case 'users':
                    SessionManager::requireSuperAdmin();
                    $users = $auth->getAllUsers();
                    echo json_encode(['success' => true, 'users' => $users]);
                    break;
                    
                case 'me':
                    $result = $auth->getCurrentUser();
                    echo json_encode($result);
                    break;
                    
                default:
                    echo json_encode(['success' => false, 'message' => 'Invalid action']);
                    break;
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Action required']);
        }
        break;
        
    case 'DELETE':
        SessionManager::requireSuperAdmin();
        $data = json_decode(file_get_contents("php://input"), true);
        if(isset($data['id'])) {
            $result = $auth->deleteUser($data['id']);
            echo json_encode(['success' => $result, 'message' => $result ? 'User deleted successfully' : 'Failed to delete user']);
        } else {
            echo json_encode(['success' => false, 'message' => 'User ID required']);
        }
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}
?>
