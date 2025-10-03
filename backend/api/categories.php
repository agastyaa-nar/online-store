<?php
require_once '../config/cors.php';

header('Content-Type: application/json');
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

class Category {
    private $conn;
    private $table_name = "categories";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAllCategories() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY name ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getCategoryById($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function createCategory($name, $description = '') {
        $query = "INSERT INTO " . $this->table_name . " (name, description) VALUES (:name, :description)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':description', $description);

        if($stmt->execute()) {
            return ['success' => true, 'id' => $this->conn->lastInsertId(), 'message' => 'Category created successfully'];
        }
        return ['success' => false, 'message' => 'Failed to create category'];
    }

    public function updateCategory($id, $name, $description = '') {
        $query = "UPDATE " . $this->table_name . " SET name = :name, description = :description WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':description', $description);

        if($stmt->execute()) {
            return ['success' => true, 'message' => 'Category updated successfully'];
        }
        return ['success' => false, 'message' => 'Failed to update category'];
    }

    public function deleteCategory($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}

$database = new Database();
$db = $database->getConnection();
$category = new Category($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            $result = $category->getCategoryById($_GET['id']);
            echo json_encode(['success' => true, 'category' => $result]);
        } else {
            $result = $category->getAllCategories();
            echo json_encode(['success' => true, 'categories' => $result]);
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if(isset($data['name'])) {
            $description = isset($data['description']) ? $data['description'] : '';
            $result = $category->createCategory($data['name'], $description);
            echo json_encode($result);
        } else {
            echo json_encode(['success' => false, 'message' => 'Category name required']);
        }
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if(isset($data['id']) && isset($data['name'])) {
            $description = isset($data['description']) ? $data['description'] : '';
            $result = $category->updateCategory($data['id'], $data['name'], $description);
            echo json_encode($result);
        } else {
            echo json_encode(['success' => false, 'message' => 'Category ID and name required']);
        }
        break;
        
    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        if(isset($data['id'])) {
            $result = $category->deleteCategory($data['id']);
            echo json_encode(['success' => $result, 'message' => $result ? 'Category deleted successfully' : 'Failed to delete category']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Category ID required']);
        }
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}
?>
