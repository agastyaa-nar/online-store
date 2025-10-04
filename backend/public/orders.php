<?php
require_once '../config/cors.php';

header('Content-Type: application/json');
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

class Order {
    private $conn;
    private $orders_table = "orders";
    private $order_items_table = "order_items";
    private $cart_table = "cart_items";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function createOrder($session_id, $customer_data, $cart_items) {
        try {
            $this->conn->beginTransaction();

            // Calculate total
            $total = 0;
            foreach($cart_items as $item) {
                $total += $item['quantity'] * $item['price'];
            }

            // Create order
            $query = "INSERT INTO " . $this->orders_table . " 
                      (session_id, customer_name, customer_email, shipping_address, shipping_method, total_amount) 
                      VALUES (:session_id, :customer_name, :customer_email, :shipping_address, :shipping_method, :total_amount)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':session_id', $session_id);
            $stmt->bindParam(':customer_name', $customer_data['name']);
            $stmt->bindParam(':customer_email', $customer_data['email']);
            $stmt->bindParam(':shipping_address', $customer_data['address']);
            $stmt->bindParam(':shipping_method', $customer_data['shipping_method']);
            $stmt->bindParam(':total_amount', $total);
            $stmt->execute();

            $order_id = $this->conn->lastInsertId();

            // Create order items
            foreach($cart_items as $item) {
                $query = "INSERT INTO " . $this->order_items_table . " 
                          (order_id, product_id, quantity, price) 
                          VALUES (:order_id, :product_id, :quantity, :price)";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':order_id', $order_id);
                $stmt->bindParam(':product_id', $item['product_id']);
                $stmt->bindParam(':quantity', $item['quantity']);
                $stmt->bindParam(':price', $item['price']);
                $stmt->execute();
            }

            // Clear cart
            $query = "DELETE FROM " . $this->cart_table . " WHERE session_id = :session_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':session_id', $session_id);
            $stmt->execute();

            $this->conn->commit();
            return ['success' => true, 'order_id' => $order_id, 'message' => 'Order created successfully'];
        } catch(Exception $e) {
            $this->conn->rollBack();
            return ['success' => false, 'message' => 'Failed to create order: ' . $e->getMessage()];
        }
    }

    public function getOrders($session_id = null) {
        if($session_id) {
            $query = "SELECT * FROM " . $this->orders_table . " WHERE session_id = :session_id ORDER BY created_at DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':session_id', $session_id);
        } else {
            $query = "SELECT * FROM " . $this->orders_table . " ORDER BY created_at DESC";
            $stmt = $this->conn->prepare($query);
        }
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getOrderById($order_id) {
        $query = "SELECT o.*, oi.product_id, oi.quantity, oi.price, p.name as product_name, p.image_url 
                  FROM " . $this->orders_table . " o 
                  JOIN " . $this->order_items_table . " oi ON o.id = oi.order_id 
                  JOIN products p ON oi.product_id = p.id 
                  WHERE o.id = :order_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':order_id', $order_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateOrderStatus($order_id, $status) {
        $query = "UPDATE " . $this->orders_table . " SET status = :status WHERE id = :order_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':order_id', $order_id);
        return $stmt->execute();
    }
}

$database = new Database();
$db = $database->getConnection();
$order = new Order($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            $result = $order->getOrderById($_GET['id']);
            echo json_encode(['success' => true, 'order' => $result]);
        } else {
            $session_id = isset($_GET['session_id']) ? $_GET['session_id'] : null;
            $result = $order->getOrders($session_id);
            echo json_encode(['success' => true, 'orders' => $result]);
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if(isset($data['session_id']) && isset($data['customer']) && isset($data['cart_items'])) {
            $result = $order->createOrder($data['session_id'], $data['customer'], $data['cart_items']);
            echo json_encode($result);
        } else {
            echo json_encode(['success' => false, 'message' => 'Session ID, customer data, and cart items required']);
        }
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if(isset($data['order_id']) && isset($data['status'])) {
            $result = $order->updateOrderStatus($data['order_id'], $data['status']);
            echo json_encode(['success' => $result, 'message' => $result ? 'Order status updated' : 'Failed to update order status']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Order ID and status required']);
        }
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}
?>
