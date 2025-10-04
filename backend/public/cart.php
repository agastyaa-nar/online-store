<?php
require_once '../config/cors.php';

header('Content-Type: application/json');
setCorsHeaders();

require_once '../config/database.php';

class Cart {
    private $conn;
    private $table_name = "cart_items";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getCartItems($session_id) {
        $query = "SELECT ci.*, p.name, p.price, p.image_url FROM " . $this->table_name . " ci 
                  JOIN products p ON ci.product_id = p.id 
                  WHERE ci.session_id = :session_id AND p.is_active = TRUE";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':session_id', $session_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addToCart($session_id, $product_id, $quantity = 1) {
        // Check if item already exists in cart
        $query = "SELECT id, quantity FROM " . $this->table_name . " WHERE session_id = :session_id AND product_id = :product_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':session_id', $session_id);
        $stmt->bindParam(':product_id', $product_id);
        $stmt->execute();
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);

        if($existing) {
            // Update quantity
            $new_quantity = $existing['quantity'] + $quantity;
            $query = "UPDATE " . $this->table_name . " SET quantity = :quantity WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':quantity', $new_quantity);
            $stmt->bindParam(':id', $existing['id']);
            return $stmt->execute();
        } else {
            // Add new item
            $query = "INSERT INTO " . $this->table_name . " (session_id, product_id, quantity) VALUES (:session_id, :product_id, :quantity)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':session_id', $session_id);
            $stmt->bindParam(':product_id', $product_id);
            $stmt->bindParam(':quantity', $quantity);
            return $stmt->execute();
        }
    }

    public function updateCartItem($session_id, $product_id, $quantity) {
        if($quantity <= 0) {
            return $this->removeFromCart($session_id, $product_id);
        }

        $query = "UPDATE " . $this->table_name . " SET quantity = :quantity WHERE session_id = :session_id AND product_id = :product_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':quantity', $quantity);
        $stmt->bindParam(':session_id', $session_id);
        $stmt->bindParam(':product_id', $product_id);
        return $stmt->execute();
    }

    public function removeFromCart($session_id, $product_id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE session_id = :session_id AND product_id = :product_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':session_id', $session_id);
        $stmt->bindParam(':product_id', $product_id);
        return $stmt->execute();
    }

    public function clearCart($session_id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE session_id = :session_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':session_id', $session_id);
        return $stmt->execute();
    }

    public function getCartTotal($session_id) {
        $query = "SELECT SUM(ci.quantity * p.price) as total FROM " . $this->table_name . " ci 
                  JOIN products p ON ci.product_id = p.id 
                  WHERE ci.session_id = :session_id AND p.is_active = TRUE";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':session_id', $session_id);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['total'] ? $result['total'] : 0;
    }
}

$database = new Database();
$db = $database->getConnection();
$cart = new Cart($db);

$method = $_SERVER['REQUEST_METHOD'];

// Get session_id from different sources
$session_id = '';
if ($method === 'GET') {
    $session_id = isset($_GET['session_id']) ? $_GET['session_id'] : '';
} else {
    // For POST, PUT, DELETE - get from JSON data
    $input = json_decode(file_get_contents("php://input"), true);
    $session_id = isset($input['session_id']) ? $input['session_id'] : '';
}

if(empty($session_id)) {
    echo json_encode(['success' => false, 'message' => 'Session ID required']);
    exit;
}

switch($method) {
    case 'GET':
        $items = $cart->getCartItems($session_id);
        $total = $cart->getCartTotal($session_id);
        echo json_encode(['success' => true, 'items' => $items, 'total' => $total]);
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if(isset($data['product_id'])) {
            $quantity = isset($data['quantity']) ? $data['quantity'] : 1;
            $result = $cart->addToCart($session_id, $data['product_id'], $quantity);
            echo json_encode(['success' => $result, 'message' => $result ? 'Item added to cart' : 'Failed to add item']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Product ID required']);
        }
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if(isset($data['product_id']) && isset($data['quantity'])) {
            $result = $cart->updateCartItem($session_id, $data['product_id'], $data['quantity']);
            echo json_encode(['success' => $result, 'message' => $result ? 'Cart updated' : 'Failed to update cart']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Product ID and quantity required']);
        }
        break;
        
    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        if(isset($data['product_id'])) {
            $result = $cart->removeFromCart($session_id, $data['product_id']);
            echo json_encode(['success' => $result, 'message' => $result ? 'Item removed from cart' : 'Failed to remove item']);
        } elseif(isset($data['clear_all'])) {
            $result = $cart->clearCart($session_id);
            echo json_encode(['success' => $result, 'message' => $result ? 'Cart cleared' : 'Failed to clear cart']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Product ID or clear_all required']);
        }
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}
?>
