# 🔧 Backend Files Documentation

## 📁 Configuration Files

### 📄 `composer.json`
**Purpose**: PHP dependency management dan project configuration
```json
{
  "autoload": {
    "psr-4": {
      "App\\": "src/"
    }
  },
  "require": {
    "php": ">=8.0"
  }
}
```
**Functions**:
- Mengatur PSR-4 autoloading untuk namespace `App\`
- Mendefinisikan PHP version requirements
- Mengelola dependencies PHP packages

### 📄 `Dockerfile`
**Purpose**: Container configuration untuk deployment
```dockerfile
FROM php:8.2-apache
COPY . /var/www/html/
EXPOSE 80
```
**Functions**:
- Base image PHP 8.2 dengan Apache
- Copy source code ke container
- Expose port 80 untuk web server
- Production-ready container setup

### 📄 `docker-compose.yml`
**Purpose**: Multi-container orchestration untuk development
```yaml
services:
  web:
    build: .
    ports:
      - "8080:80"
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
```
**Functions**:
- Mengatur web server di port 8080
- Setup MySQL database container
- Environment variables untuk database
- Volume mounting untuk development

### 📄 `render.yaml`
**Purpose**: Render.com deployment configuration
```yaml
services:
  - type: web
    plan: free
    buildCommand: composer install
    startCommand: php -S 0.0.0.0:10000 -t public
```
**Functions**:
- Konfigurasi deployment di Render.com
- Build command untuk install dependencies
- Start command untuk PHP built-in server
- Environment setup untuk production

---

## 🗄️ Database Files

### 📄 `database/schema.sql`
**Purpose**: Database schema definition dan table structures
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin', 'superadmin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Functions**:
- Definisi struktur tabel users, products, categories, orders, cart
- Primary keys, foreign keys, dan constraints
- Indexes untuk performance optimization
- Default values dan data types

### 📄 `setup.php`
**Purpose**: Database initialization script
```php
<?php
require_once 'src/autoload.php';
require_once 'src/Models/Database.php';

$database = new Database();
$database->initialize();
```
**Functions**:
- Drop existing tables (untuk reset)
- Create tables berdasarkan schema.sql
- Insert sample data untuk testing
- Database connection setup
- Error handling untuk database operations

---

## 🌐 API Entry Point

### 📄 `public/index.php`
**Purpose**: Main API entry point dan request router
```php
<?php
require_once '../src/autoload.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$requestUri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Route handling
switch ($requestUri) {
    case '/auth':
        require_once '../src/Routes/AuthRoutes.php';
        break;
    case '/products':
        require_once '../src/Routes/ProductRoutes.php';
        break;
}
```
**Functions**:
- CORS headers setup
- Request method handling (GET, POST, PUT, DELETE)
- Route dispatching berdasarkan URL
- JSON response formatting
- Error handling dan logging

---

## 🏗️ Core Architecture

### 📄 `src/autoload.php`
**Purpose**: PSR-4 class autoloader
```php
<?php
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/';
    
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    
    $relativeClass = substr($class, $len);
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';
    
    if (file_exists($file)) {
        require $file;
    }
});
```
**Functions**:
- Automatic class loading berdasarkan namespace
- PSR-4 standard compliance
- File path resolution
- Error handling untuk missing classes

### 📄 `src/Models/Database.php`
**Purpose**: Database connection dan configuration
```php
<?php
namespace App\Models;

class Database {
    private $connection;
    
    public function __construct() {
        $host = $_ENV['DB_HOST'] ?? 'localhost';
        $dbname = $_ENV['DB_NAME'] ?? 'online_store';
        $username = $_ENV['DB_USER'] ?? 'root';
        $password = $_ENV['DB_PASS'] ?? '';
        
        $this->connection = new \PDO(
            "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
            $username,
            $password
        );
    }
}
```
**Functions**:
- PDO connection management
- Environment variable configuration
- Connection error handling
- Database charset setup (UTF-8)
- Singleton pattern untuk connection reuse

---

## 🎮 Controllers

### 📄 `src/Controllers/AuthController.php`
**Purpose**: Authentication logic dan user management
```php
<?php
namespace App\Controllers;

use App\Models\User;
use App\Models\Database;

class AuthController {
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $action = $_GET['action'] ?? '';
        
        switch ($method) {
            case 'POST':
                switch ($action) {
                    case 'login':
                        $this->login();
                        break;
                    case 'register':
                        $this->register();
                        break;
                }
                break;
        }
    }
    
    private function login() {
        $data = json_decode(file_get_contents('php://input'), true);
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        
        $user = $this->userModel->findByUsername($username);
        if ($user && password_verify($password, $user['password_hash'])) {
            $token = $this->generateJWT($user);
            echo json_encode(['success' => true, 'token' => $token]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        }
    }
}
```
**Functions**:
- **login()**: User authentication dengan password verification
- **register()**: User registration dengan password hashing
- **logout()**: Token invalidation
- **createUser()**: Admin function untuk create users
- **getAllUsers()**: Retrieve semua users (admin only)
- **deleteUser()**: Delete user (admin only)
- **getCurrentUser()**: Get current authenticated user
- JWT token generation dan validation

### 📄 `src/Controllers/ProductController.php`
**Purpose**: Product management dan CRUD operations
```php
<?php
namespace App\Controllers;

use App\Models\Product;
use App\Models\User;

class ProductController {
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        
        switch ($method) {
            case 'GET':
                $this->getAll();
                break;
            case 'POST':
                $this->create();
                break;
            case 'PUT':
                $this->update();
                break;
            case 'DELETE':
                $this->delete();
                break;
        }
    }
    
    private function getAll() {
        $search = $_GET['search'] ?? null;
        $categoryId = $_GET['category'] ?? null;
        $productId = $_GET['id'] ?? null;
        
        if ($productId) {
            $product = $this->productModel->findById($productId);
            echo json_encode(['success' => true, 'product' => $product]);
        } else {
            $products = $this->productModel->getAll($search, $categoryId);
            echo json_encode(['success' => true, 'products' => $products]);
        }
    }
}
```
**Functions**:
- **getAll()**: Get products dengan search dan category filtering
- **create()**: Create new product (admin only)
- **update()**: Update existing product (admin only)
- **delete()**: Delete product (admin only)
- Search functionality dengan query parameters
- Category-based filtering
- Single product retrieval by ID

### 📄 `src/Controllers/CartController.php`
**Purpose**: Shopping cart management
```php
<?php
namespace App\Controllers;

use App\Models\Cart;

class CartController {
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        
        switch ($method) {
            case 'GET':
                $this->getCart();
                break;
            case 'POST':
                $this->addToCart();
                break;
            case 'PUT':
                $this->updateCart();
                break;
            case 'DELETE':
                $this->removeFromCart();
                break;
        }
    }
    
    private function addToCart() {
        $data = json_decode(file_get_contents('php://input'), true);
        $userId = $this->getCurrentUserId();
        $productId = $data['product_id'] ?? '';
        $quantity = $data['quantity'] ?? 1;
        
        $result = $this->cartModel->addItem($userId, $productId, $quantity);
        echo json_encode($result);
    }
}
```
**Functions**:
- **getCart()**: Retrieve user's cart items
- **addToCart()**: Add product ke cart
- **updateCart()**: Update quantity di cart
- **removeFromCart()**: Remove item dari cart
- **clearCart()**: Clear semua items di cart
- User authentication untuk cart operations

### 📄 `src/Controllers/OrderController.php`
**Purpose**: Order processing dan management
```php
<?php
namespace App\Controllers;

use App\Models\Order;

class OrderController {
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        
        switch ($method) {
            case 'GET':
                $this->getOrders();
                break;
            case 'POST':
                $this->createOrder();
                break;
            case 'PUT':
                $this->updateOrder();
                break;
        }
    }
    
    private function createOrder() {
        $data = json_decode(file_get_contents('php://input'), true);
        $userId = $this->getCurrentUserId();
        
        $orderData = [
            'user_id' => $userId,
            'items' => $data['items'],
            'total_amount' => $data['total_amount'],
            'shipping_address' => $data['shipping_address']
        ];
        
        $result = $this->orderModel->create($orderData);
        echo json_encode($result);
    }
}
```
**Functions**:
- **createOrder()**: Process checkout dan create order
- **getOrders()**: Get user orders atau admin view semua orders
- **updateOrder()**: Update order status (admin)
- **getOrderById()**: Get specific order details
- Order status management
- Payment processing integration

### 📄 `src/Controllers/CategoryController.php`
**Purpose**: Category management
```php
<?php
namespace App\Controllers;

use App\Models\Category;

class CategoryController {
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        
        switch ($method) {
            case 'GET':
                $this->getAll();
                break;
            case 'POST':
                $this->create();
                break;
        }
    }
    
    private function getAll() {
        $categories = $this->categoryModel->getAll();
        echo json_encode(['success' => true, 'categories' => $categories]);
    }
}
```
**Functions**:
- **getAll()**: Get semua categories
- **create()**: Create new category (admin)
- **update()**: Update category (admin)
- **delete()**: Delete category (admin)
- Category hierarchy support

---

## 🛡️ Middleware

### 📄 `src/Middleware/CorsMiddleware.php`
**Purpose**: Cross-Origin Resource Sharing handling
```php
<?php
namespace App\Middleware;

class CorsMiddleware {
    public static function handle() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
    }
}
```
**Functions**:
- CORS headers setup untuk cross-origin requests
- OPTIONS request handling untuk preflight
- Content-Type dan Authorization header support
- Development dan production environment support

---

## 🛣️ Routes

### 📄 `src/Routes/AuthRoutes.php`
**Purpose**: Authentication route definitions
```php
<?php
require_once '../Controllers/AuthController.php';

$authController = new \App\Controllers\AuthController();
$authController->handleRequest();
```
**Functions**:
- Route mapping untuk authentication endpoints
- Controller instantiation
- Request handling delegation

### 📄 `src/Routes/ProductRoutes.php`
**Purpose**: Product route definitions
```php
<?php
require_once '../Controllers/ProductController.php';

$productController = new \App\Controllers\ProductController();
$productController->handleRequest();
```
**Functions**:
- Route mapping untuk product endpoints
- Controller instantiation
- Request handling delegation

### 📄 `src/Routes/CartRoutes.php`
**Purpose**: Cart route definitions
```php
<?php
require_once '../Controllers/CartController.php';

$cartController = new \App\Controllers\CartController();
$cartController->handleRequest();
```
**Functions**:
- Route mapping untuk cart endpoints
- Controller instantiation
- Request handling delegation

### 📄 `src/Routes/OrderRoutes.php`
**Purpose**: Order route definitions
```php
<?php
require_once '../Controllers/OrderController.php';

$orderController = new \App\Controllers\OrderController();
$orderController->handleRequest();
```
**Functions**:
- Route mapping untuk order endpoints
- Controller instantiation
- Request handling delegation

### 📄 `src/Routes/CategoryRoutes.php`
**Purpose**: Category route definitions
```php
<?php
require_once '../Controllers/CategoryController.php';

$categoryController = new \App\Controllers\CategoryController();
$categoryController->handleRequest();
```
**Functions**:
- Route mapping untuk category endpoints
- Controller instantiation
- Request handling delegation

---

## 📊 Models

### 📄 `src/Models/User.php`
**Purpose**: User data model dan database operations
```php
<?php
namespace App\Models;

class User {
    private $db;
    
    public function __construct() {
        $this->db = new Database();
    }
    
    public function findByUsername($username) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
    
    public function create($userData) {
        $stmt = $this->db->prepare("
            INSERT INTO users (id, username, email, password_hash, role) 
            VALUES (?, ?, ?, ?, ?)
        ");
        return $stmt->execute([
            $userData['id'],
            $userData['username'],
            $userData['email'],
            password_hash($userData['password'], PASSWORD_DEFAULT),
            $userData['role']
        ]);
    }
}
```
**Functions**:
- **findByUsername()**: Find user by username
- **findByEmail()**: Find user by email
- **create()**: Create new user dengan password hashing
- **update()**: Update user information
- **delete()**: Delete user
- **getAll()**: Get semua users (admin)
- **findById()**: Find user by ID
- Password hashing dengan bcrypt

### 📄 `src/Models/Product.php`
**Purpose**: Product data model dan database operations
```php
<?php
namespace App\Models;

class Product {
    private $db;
    
    public function __construct() {
        $this->db = new Database();
    }
    
    public function getAll($search = null, $categoryId = null) {
        $sql = "SELECT * FROM products WHERE is_active = 1";
        $params = [];
        
        if ($search) {
            $sql .= " AND (name LIKE ? OR description LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }
        
        if ($categoryId) {
            $sql .= " AND category_id = ?";
            $params[] = $categoryId;
        }
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}
```
**Functions**:
- **getAll()**: Get products dengan search dan category filtering
- **findById()**: Find product by ID
- **create()**: Create new product
- **update()**: Update existing product
- **delete()**: Soft delete product (set is_active = false)
- **getByCategory()**: Get products by category
- **search()**: Search products by name atau description

### 📄 `src/Models/Cart.php`
**Purpose**: Shopping cart data model
```php
<?php
namespace App\Models;

class Cart {
    private $db;
    
    public function addItem($userId, $productId, $quantity) {
        // Check if item already exists
        $existing = $this->getItem($userId, $productId);
        
        if ($existing) {
            // Update quantity
            $newQuantity = $existing['quantity'] + $quantity;
            return $this->updateQuantity($userId, $productId, $newQuantity);
        } else {
            // Add new item
            $stmt = $this->db->prepare("
                INSERT INTO cart (user_id, product_id, quantity) 
                VALUES (?, ?, ?)
            ");
            return $stmt->execute([$userId, $productId, $quantity]);
        }
    }
}
```
**Functions**:
- **addItem()**: Add product ke cart dengan quantity
- **removeItem()**: Remove item dari cart
- **updateQuantity()**: Update item quantity
- **getCart()**: Get semua cart items untuk user
- **clearCart()**: Clear semua items dari cart
- **getItem()**: Get specific cart item

### 📄 `src/Models/Order.php`
**Purpose**: Order data model dan processing
```php
<?php
namespace App\Models;

class Order {
    private $db;
    
    public function create($orderData) {
        $this->db->beginTransaction();
        
        try {
            // Create order
            $orderId = $this->generateOrderId();
            $stmt = $this->db->prepare("
                INSERT INTO orders (id, user_id, total_amount, status, shipping_address) 
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $orderId,
                $orderData['user_id'],
                $orderData['total_amount'],
                'pending',
                json_encode($orderData['shipping_address'])
            ]);
            
            // Add order items
            foreach ($orderData['items'] as $item) {
                $this->addOrderItem($orderId, $item);
            }
            
            $this->db->commit();
            return ['success' => true, 'order_id' => $orderId];
        } catch (\Exception $e) {
            $this->db->rollback();
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
```
**Functions**:
- **create()**: Create new order dengan transaction
- **getOrders()**: Get user orders atau admin view
- **getOrderById()**: Get specific order details
- **updateStatus()**: Update order status
- **addOrderItem()**: Add item to order
- Transaction handling untuk data consistency

### 📄 `src/Models/Category.php`
**Purpose**: Category data model
```php
<?php
namespace App\Models;

class Category {
    private $db;
    
    public function getAll() {
        $stmt = $this->db->prepare("SELECT * FROM categories WHERE is_active = 1 ORDER BY name");
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
    
    public function create($categoryData) {
        $stmt = $this->db->prepare("
            INSERT INTO categories (id, name, description, image_url) 
            VALUES (?, ?, ?, ?)
        ");
        return $stmt->execute([
            $categoryData['id'],
            $categoryData['name'],
            $categoryData['description'],
            $categoryData['image_url']
        ]);
    }
}
```
**Functions**:
- **getAll()**: Get semua active categories
- **findById()**: Find category by ID
- **create()**: Create new category
- **update()**: Update category
- **delete()**: Soft delete category
- Category hierarchy support

---

## 🔐 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt untuk secure password storage
- **Role-based Access**: User, Admin, SuperAdmin roles
- **CORS Protection**: Cross-origin request handling

### Data Protection
- **SQL Injection Prevention**: PDO prepared statements
- **Input Validation**: Server-side validation
- **Error Handling**: Secure error messages
- **Environment Variables**: Sensitive data protection

---

## 🚀 Performance Optimizations

### Database
- **Prepared Statements**: SQL injection prevention
- **Indexes**: Optimized database queries
- **Connection Pooling**: Efficient database connections
- **Transaction Management**: Data consistency

### API
- **RESTful Design**: Standard HTTP methods
- **JSON Responses**: Efficient data format
- **Error Codes**: Proper HTTP status codes
- **Caching Headers**: Browser caching support

---

*Dokumentasi ini mencakup semua file backend dan fungsinya dalam membangun website e-commerce.*
