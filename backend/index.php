<?php
/**
 * Railway Backend Entry Point
 * This file serves as the main entry point for Railway deployment
 */

// Set error reporting based on environment
$is_production = ($_ENV['APP_ENV'] ?? 'development') === 'production';
if (!$is_production) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}

// Load configuration
require_once __DIR__ . '/config/cors.php';

// Set CORS headers
setCorsHeaders();

// Set content type
header('Content-Type: application/json');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get request path
$request_uri = $_SERVER['REQUEST_URI'] ?? '';
$path = parse_url($request_uri, PHP_URL_PATH);

// Log request for debugging (only in development)
if (!$is_production) {
    error_log("Request URI: " . $request_uri);
    error_log("Path: " . $path);
}

// Handle Railway routing - remove any prefix if needed
$path_parts = explode('/', trim($path, '/'));
$path_parts = array_filter($path_parts, function($part) {
    return !empty($part);
});

// Handle root path or health check
if (empty($path_parts)) {
    echo json_encode([
        'success' => true,
        'message' => 'Online Store API is running',
        'version' => '1.0.0',
        'environment' => $_ENV['APP_ENV'] ?? 'development',
        'port' => $_ENV['PORT'] ?? 'unknown',
        'timestamp' => date('Y-m-d H:i:s'),
        'endpoints' => [
            'GET /products' => 'Get all products',
            'GET /products?id=1' => 'Get product by ID',
            'GET /categories' => 'Get all categories',
            'GET /cart' => 'Get cart items',
            'POST /auth/login' => 'User login',
            'POST /orders' => 'Create order'
        ]
    ]);
    exit;
}

// Route to appropriate endpoint
$endpoint = $path_parts[0];

// Handle file extensions (e.g., products.php, auth.php)
if (strpos($endpoint, '.php') !== false) {
    $endpoint = str_replace('.php', '', $endpoint);
}

try {
    switch ($endpoint) {
        case 'products':
            require_once __DIR__ . '/public/products.php';
            break;
        case 'categories':
            require_once __DIR__ . '/public/categories.php';
            break;
        case 'cart':
            require_once __DIR__ . '/public/cart.php';
            break;
        case 'auth':
            require_once __DIR__ . '/public/auth.php';
            break;
        case 'orders':
            require_once __DIR__ . '/public/orders.php';
            break;
        default:
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Endpoint not found',
                'available_endpoints' => ['products', 'categories', 'cart', 'auth', 'orders'],
                'requested_path' => $path,
                'requested_uri' => $request_uri,
                'endpoint' => $endpoint
            ]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error',
        'error' => ($_ENV['APP_DEBUG'] ?? 'false') === 'true' ? $e->getMessage() : 'Something went wrong',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    error_log("API Error: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine());
}
?>
