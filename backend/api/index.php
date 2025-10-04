<?php
require_once '../config/cors.php';

header('Content-Type: application/json');
setCorsHeaders();

// Health check endpoint
if ($_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['endpoint'])) {
    echo json_encode([
        'success' => true,
        'message' => 'Online Store API is running',
        'version' => '1.0.0',
        'endpoints' => [
            'GET /api/products' => 'Get all products',
            'GET /api/products?id=1' => 'Get product by ID',
            'GET /api/categories' => 'Get all categories',
            'GET /api/cart' => 'Get cart items',
            'POST /api/auth/login' => 'User login',
            'POST /api/orders' => 'Create order'
        ]
    ]);
    exit;
}

// Handle API routing
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path_parts = explode('/', trim($path, '/'));

// Remove 'api' from the path if it exists
if ($path_parts[0] === 'api') {
    array_shift($path_parts);
}

$endpoint = $path_parts[0] ?? '';

switch ($endpoint) {
    case 'products':
        require_once 'products.php';
        break;
    case 'categories':
        require_once 'categories.php';
        break;
    case 'cart':
        require_once 'cart.php';
        break;
    case 'auth':
        require_once 'auth.php';
        break;
    case 'orders':
        require_once 'orders.php';
        break;
    default:
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Endpoint not found',
            'available_endpoints' => ['products', 'categories', 'cart', 'auth', 'orders']
        ]);
        break;
}
?>
