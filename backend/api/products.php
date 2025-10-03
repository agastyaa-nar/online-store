<?php
require_once '../config/cors.php';

header('Content-Type: application/json');
setCorsHeaders();

require_once '../config/database.php';
require_once '../config/session.php';

class Product {
    private $conn;
    private $table_name = "products";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAllProducts() {
        $query = "SELECT p.*, c.name as category_name FROM " . $this->table_name . " p 
                  LEFT JOIN categories c ON p.category_id = c.id 
                  WHERE p.is_active = TRUE 
                  ORDER BY p.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getProductById($id) {
        $query = "SELECT p.*, c.name as category_name FROM " . $this->table_name . " p 
                  LEFT JOIN categories c ON p.category_id = c.id 
                  WHERE p.id = :id AND p.is_active = TRUE";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getProductsByCategory($category_id) {
        $query = "SELECT p.*, c.name as category_name FROM " . $this->table_name . " p 
                  LEFT JOIN categories c ON p.category_id = c.id 
                  WHERE p.category_id = :category_id AND p.is_active = TRUE 
                  ORDER BY p.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':category_id', $category_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function searchProducts($search_term) {
        $query = "SELECT p.*, c.name as category_name FROM " . $this->table_name . " p 
                  LEFT JOIN categories c ON p.category_id = c.id 
                  WHERE (p.name LIKE :search OR p.description LIKE :search) AND p.is_active = TRUE 
                  ORDER BY p.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $search_param = "%{$search_term}%";
        $stmt->bindParam(':search', $search_param);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createProduct($data) {
        $query = "INSERT INTO " . $this->table_name . " (name, description, price, image_url, category_id, stock_quantity) 
                  VALUES (:name, :description, :price, :image_url, :category_id, :stock_quantity)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->bindParam(':image_url', $data['image_url']);
        $stmt->bindParam(':category_id', $data['category_id']);
        $stmt->bindParam(':stock_quantity', $data['stock_quantity']);

        if($stmt->execute()) {
            return ['success' => true, 'id' => $this->conn->lastInsertId(), 'message' => 'Product created successfully'];
        }
        return ['success' => false, 'message' => 'Failed to create product'];
    }

    public function updateProduct($id, $data) {
        $query = "UPDATE " . $this->table_name . " SET 
                  name = :name, description = :description, price = :price, 
                  image_url = :image_url, category_id = :category_id, 
                  stock_quantity = :stock_quantity, updated_at = CURRENT_TIMESTAMP 
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->bindParam(':image_url', $data['image_url']);
        $stmt->bindParam(':category_id', $data['category_id']);
        $stmt->bindParam(':stock_quantity', $data['stock_quantity']);

        if($stmt->execute()) {
            return ['success' => true, 'message' => 'Product updated successfully'];
        }
        return ['success' => false, 'message' => 'Failed to update product'];
    }

    public function deleteProduct($id) {
        $query = "UPDATE " . $this->table_name . " SET is_active = FALSE WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}

$database = new Database();
$db = $database->getConnection();
$product = new Product($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // GET requests are public (no authentication required)
        if(isset($_GET['id'])) {
            $result = $product->getProductById($_GET['id']);
            echo json_encode(['success' => true, 'product' => $result]);
        } elseif(isset($_GET['category'])) {
            $result = $product->getProductsByCategory($_GET['category']);
            echo json_encode(['success' => true, 'products' => $result]);
        } elseif(isset($_GET['search'])) {
            $result = $product->searchProducts($_GET['search']);
            echo json_encode(['success' => true, 'products' => $result]);
        } else {
            $result = $product->getAllProducts();
            echo json_encode(['success' => true, 'products' => $result]);
        }
        break;
        
    case 'POST':
        // POST requires admin authentication
        SessionManager::requireAdmin();
        $data = json_decode(file_get_contents("php://input"), true);
        $result = $product->createProduct($data);
        echo json_encode($result);
        break;
        
    case 'PUT':
        // PUT requires admin authentication
        SessionManager::requireAdmin();
        $data = json_decode(file_get_contents("php://input"), true);
        if(isset($data['id'])) {
            $result = $product->updateProduct($data['id'], $data);
            echo json_encode($result);
        } else {
            echo json_encode(['success' => false, 'message' => 'Product ID required']);
        }
        break;
        
    case 'DELETE':
        // DELETE requires admin authentication
        SessionManager::requireAdmin();
        $data = json_decode(file_get_contents("php://input"), true);
        if(isset($data['id'])) {
            $result = $product->deleteProduct($data['id']);
            echo json_encode(['success' => $result, 'message' => $result ? 'Product deleted successfully' : 'Failed to delete product']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Product ID required']);
        }
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}
?>
